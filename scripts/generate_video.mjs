// scripts/generate_video.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import 'dotenv/config';
import { normalizeAndRemedyEpisode } from './generate_episode.mjs';
import { extractSourceFacts } from './extract_source_facts.mjs';
import { runContentAudit } from './audit_content.mjs';
import { generateLessonAndStoryboard } from './generate_lesson_storyboard.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// -------------------------------------------------------------------
// 0. CLI Arguments Parsing & Dispatch
// -------------------------------------------------------------------
const rawArgs = process.argv.slice(2);
const fullInput = rawArgs.join(' ').trim();

if (!fullInput || rawArgs.includes('--help') || rawArgs.includes('-h')) {
  console.log(`
Usage:
  node scripts/generate_video.mjs <command_or_chapter_key> [options]
  npm run make-video -- <command_or_chapter_key> [options]

Examples:
  # Argon Pipeline (Isolated workspace, gemini-4-argon, out/chapters/):
  node scripts/generate_video.mjs "Generate Chapter 2 Part 1 using Argon"
  node scripts/generate_video.mjs ch02_part1 argon
  npm run make-video -- ch02_part1 argon

  # Standard Flash Pipeline (Standard production workspace, Gemini Flash, out/):
  node scripts/generate_video.mjs "Make video ch02_part1"
  node scripts/generate_video.mjs ch02_part1

Options:
  --force           Overwrite existing episode_raw.json and regenerate
  --dry-run         Parse curriculum and setup paths without making API/render calls
  --skip-render     Compile audio and data only, skip final Remotion render
  --skip-tts        Skip audio compilation if already generated
  --tts=gemini      Use Gemini TTS instead of Edge-TTS
`);
  process.exit(0);
}

// 1. Detect Book & Model Engine
const isHull = /hull/i.test(fullInput);
const isArgon = /argon/i.test(fullInput);
const isForce = rawArgs.includes('--force');
const isReRender = rawArgs.includes('--re-render') || rawArgs.includes('--force-render');
const isDryRun = rawArgs.includes('--dry-run');
const skipRender = rawArgs.includes('--skip-render');
const skipTTS = rawArgs.includes('--skip-tts');
const ttsModeArg = rawArgs.find((a) => a.startsWith('--tts='));
const ttsMode = ttsModeArg ? ttsModeArg.split('=')[1] : 'edge';

// 2. Extract Chapter Key or Chapter Range (e.g. ch04 or ch02_part1 or "Chapter 4, 5, 6" or "hull ch1 to ch2")
function resolveChapterKeys(input) {
  const clean = input.toLowerCase();

  // If HULL course
  if (isHull) {
    const hullCurriculum = path.join(rootDir, 'Hull_40_Video_Master_Curriculum.txt');
    const content = fs.existsSync(hullCurriculum) ? fs.readFileSync(hullCurriculum, 'utf8') : '';

    // Pattern H1: Direct part matches like hull_ch01_part1 or ch01_part1 when hull is present
    const directPartMatches = [...clean.matchAll(/(?:hull_)?ch(\d+)[_.-]*(?:part|p)\s*0?(\d+)/gi)];
    if (directPartMatches.length > 0 && !clean.includes(' to ') && !clean.includes(' - ')) {
      return directPartMatches.map((m) => `hull_ch${m[1].padStart(2, '0')}_part${m[2]}`);
    }

    // Pattern H2: Chapter range like "hull ch1 to ch2" or "hull chapter 1 to 3"
    const rangeMatch = clean.match(/(?:chapter|ch)?\s*0?(\d+)\s*(?:to|-)\s*(?:chapter|ch)?\s*0?(\d+)/i);
    let chapterNums = [];
    if (rangeMatch && !clean.includes('part') && !clean.includes(' p')) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      for (let n = start; n <= end; n++) {
        chapterNums.push(String(n).padStart(2, '0'));
      }
    } else {
      const chapterMatches = [...clean.matchAll(/(?:chapter|ch)\s*0?(\d+)/gi)];
      chapterNums = chapterMatches.map((m) => m[1].padStart(2, '0'));
    }

    chapterNums = [...new Set(chapterNums)];
    const allKeys = [];
    for (const cNum of chapterNums) {
      const regex = new RegExp(`out[\\/\\\\](hull_ch${cNum}_part\\d+)\\.mp4`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (!allKeys.includes(match[1])) allKeys.push(match[1]);
      }
    }
    if (allKeys.length > 0) return allKeys;
    return [];
  }

  // Murphy course (default)
  // Pattern A: Appendix range
  if (/appendix/i.test(clean)) {
    if (/ab|[1-2]/i.test(clean)) return ['appendix_ab'];
    if (/cd|[3-4]/i.test(clean)) return ['appendix_cd'];
    return ['appendix_ab', 'appendix_cd'];
  }

  // Pattern B: Multiple specific part keys directly in input (e.g., ch04_part1 ch04_part2 ...)
  const directPartMatches = [...clean.matchAll(/(ch\d+[_.-]*(?:part|p)\s*0?\d+)/gi)];
  if (directPartMatches.length > 0) {
    return directPartMatches.map((m) =>
      m[1].replace(/[_.-]*(?:part|p)\s*0?(\d+)/i, '_part$1').toLowerCase()
    );
  }

  // Read curriculum file
  const curriculumCandidates = [
    '41-Video Master Curriculum.txt',
    '41-Video Master Curriculum_2.txt',
  ];
  const curriculumFile = curriculumCandidates.find((f) =>
    fs.existsSync(path.join(rootDir, f))
  );

  // Pattern C: Specific Chapter & Part text (e.g., "Chapter 2 Part 1") - single part
  const partMatch = clean.match(/ch(?:apter)?\s*0?(\d+)[\s_,.-]*(?:part|p)\s*0?(\d+)/i);
  if (partMatch) {
    const c = partMatch[1].padStart(2, '0');
    const p = partMatch[2];
    return [`ch${c}_part${p}`];
  }

  // Pattern D: Multiple or single whole chapters (e.g., "Chapter 4, Chapter 5, and Chapter 6" or "ch4-6" or "ch04")
  const chapterMatches = [...clean.matchAll(/(?:chapter|ch)\s*0?(\d+)/gi)];
  if (chapterMatches.length > 0 && curriculumFile) {
    const content = fs.readFileSync(path.join(rootDir, curriculumFile), 'utf8');
    const allKeys = [];

    // Check for chapter range like "chapter 4 to 6" or "4-6"
    const rangeMatch = clean.match(/(?:chapter|ch)?\s*0?(\d+)\s*(?:to|-)\s*0?(\d+)/i);
    let chapterNums = [];
    if (rangeMatch && !clean.includes('part')) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      for (let n = start; n <= end; n++) {
        chapterNums.push(String(n).padStart(2, '0'));
      }
    } else {
      chapterNums = chapterMatches.map((m) => m[1].padStart(2, '0'));
    }

    chapterNums = [...new Set(chapterNums)];

    for (const cNum of chapterNums) {
      const regex = new RegExp(`out[\\/\\\\](ch${cNum}_part\\d+)\\.mp4`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (!allKeys.includes(match[1])) allKeys.push(match[1]);
      }
    }

    if (allKeys.length > 0) return allKeys;
  }

  return [];
}

const chapterKeys = resolveChapterKeys(fullInput);
if (chapterKeys.length === 0) {
  console.error(`❌ Could not identify a valid chapter key or range from: "${fullInput}"`);
  process.exit(1);
}

// -------------------------------------------------------------------
// 1. Curriculum Extraction
// -------------------------------------------------------------------
const curriculumCandidates = isHull
  ? ['Hull_40_Video_Master_Curriculum.txt']
  : [
      '41-Video Master Curriculum.txt',
      '41-Video Master Curriculum_2.txt',
    ];
const curriculumFile = curriculumCandidates.find((f) =>
  fs.existsSync(path.join(rootDir, f))
);

if (!curriculumFile) {
  console.error(`❌ Curriculum file not found in project root!`);
  process.exit(1);
}

const curriculumContent = fs.readFileSync(path.join(rootDir, curriculumFile), 'utf8');

// -------------------------------------------------------------------
// 1.5. Gemini Notebook Extraction (NotebookLM Single Source of Truth)
// -------------------------------------------------------------------
function ensureNotebookContext(isHullBook, key, directive, targetDir) {
  const contextFilePath = path.join(targetDir, 'notebook_context.txt');
  if (fs.existsSync(contextFilePath) && fs.statSync(contextFilePath).size > 200 && !isForce) {
    console.log(`📖 [NOTEBOOK-LM] Using verified notebook context from: ${contextFilePath}`);
    return contextFilePath;
  }

  console.log(`\n📚 [NOTEBOOK-LM] Querying Gemini Notebook for ${key}...`);
  console.log(`   Rule: Gemini Notebook is the STRICT SINGLE SOURCE OF TRUTH (No web/chat fabrication).`);

  // 1. List notebooks
  let notebooks = [];
  try {
    const listOut = execSync('nlm notebook list', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    notebooks = JSON.parse(listOut);
  } catch (err) {
    console.error(`❌ Failed to list Gemini Notebooks via 'nlm notebook list':`, err.message);
    throw new Error('Could not access Gemini NotebookLM via nlm CLI.');
  }

  // 2. Identify target notebook
  const targetNotebook = isHullBook
    ? notebooks.find((n) => /futures|options|hull/i.test(n.title))
    : notebooks.find((n) => /murphy|technical\s*analysis/i.test(n.title));

  if (!targetNotebook) {
    console.error(`\n❌ [FATAL] No matching Gemini Notebook found for ${isHullBook ? 'John C. Hull (Futures & Options)' : 'John Murphy (Technical Analysis)'}!`);
    console.error(`   Available notebooks in your account:`);
    notebooks.forEach((n) => console.error(`   - "${n.title}" (${n.id})`));
    console.error(`   As per your strict directive, we will NOT search the web or chat.`);
    console.error(`   Please add the book to Gemini NotebookLM first.\n`);
    process.exit(1);
  }

  console.log(`   Connected to Notebook: "${targetNotebook.title}" (${targetNotebook.id})`);

  // 3. Find target book source
  let sourceId = '';
  try {
    const srcOut = execSync(`nlm source list ${targetNotebook.id}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const sources = JSON.parse(srcOut);
    const bookSrc = isHullBook
      ? sources.find((s) => /fundamentals.*future.*option|hull/i.test(s.title))
      : sources.find((s) => /murphy.*technical/i.test(s.title));
    if (bookSrc) {
      sourceId = bookSrc.id;
      console.log(`   Source PDF: "${bookSrc.title}" (${bookSrc.id})`);
    } else if (sources.length > 0) {
      sourceId = sources[0].id;
      console.log(`   Primary Source: "${sources[0].title}" (${sources[0].id})`);
    }
  } catch (err) {
    console.warn(`   ⚠️ Warning listing sources, querying entire notebook:`, err.message);
  }

  // 4. Query NotebookLM
  const sourceFlag = sourceId ? `-s ${sourceId}` : '';
  const queryPrompt = `Extract all core concepts, definitions, formulas, real-world Business Snapshots and case studies, numerical data, and author analogies for: ${directive}`;
  console.log(`   Extracting authoritative content from book...`);

  try {
    const queryCmd = `nlm query notebook ${targetNotebook.id} "${queryPrompt.replace(/"/g, '\\"')}" ${sourceFlag} --new-conversation --json`;
    const resRaw = execSync(queryCmd, {
      encoding: 'utf8',
      maxBuffer: 15 * 1024 * 1024,
      timeout: 240000,
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    let contextContent = '';
    try {
      const resJson = JSON.parse(resRaw);
      contextContent = resJson.answer || resRaw;
      if (resJson.citations && typeof resJson.citations === 'object') {
        contextContent += '\n\n### Direct Citations from Book Sources:\n';
        const citationsList = Array.isArray(resJson.citations) ? resJson.citations : Object.values(resJson.citations);
        citationsList.forEach((c) => {
          if (typeof c === 'string') contextContent += `- ${c}\n`;
          else if (c?.cited_text) contextContent += `- "${c.cited_text}"\n`;
        });
      }
    } catch {
      contextContent = resRaw;
    }

    fs.writeFileSync(contextFilePath, contextContent, 'utf8');
    console.log(`✅ [NOTEBOOK-LM] Extracted ${contextContent.length} chars of authoritative text to: ${contextFilePath}\n`);
    return contextFilePath;
  } catch (queryErr) {
    console.error(`❌ NotebookLM query failed:`, queryErr.message);
    throw new Error(`Failed to extract context from Gemini Notebook for ${key}`);
  }
}

// -------------------------------------------------------------------
// 2. Batch Execution Loop for Each Chapter Part
// -------------------------------------------------------------------
console.log(`\n======================================================`);
console.log(`🎬 AUTOMATED VIDEO GENERATION ENGINE (BATCH MODE)`);
console.log(`======================================================`);
console.log(`  Input Command:      "${fullInput}"`);
console.log(`  Target Parts:       ${chapterKeys.join(', ')}`);
console.log(`  Engine Pipeline:    ${isArgon ? '🔥 GEMINI 4 ARGON (Isolated Workspace)' : '⚡ GEMINI FLASH (Production Root)'}`);
console.log(`======================================================\n`);

if (isDryRun) {
  console.log(`[DRY RUN] Target parts resolved: ${chapterKeys.join(', ')}. Exiting without execution.`);
  process.exit(0);
}

for (let i = 0; i < chapterKeys.length; i++) {
  const chapterKey = chapterKeys[i];
  console.log(`\n------------------------------------------------------`);
  console.log(`▶ Processing [${i + 1}/${chapterKeys.length}]: ${chapterKey}`);
  console.log(`------------------------------------------------------`);

  const regex = new RegExp(`"(Create a video[^\"]*?${chapterKey}\\.mp4[^\"]*?)"`, 'i');
  let curriculumMatch = curriculumContent.match(regex);
  if (!curriculumMatch) {
    const fallbackRegex = new RegExp(`out[\\/\\\\]${chapterKey}\\.mp4:\\s*["']?([^"\\r\\n]+)["']?`, 'i');
    curriculumMatch = curriculumContent.match(fallbackRegex);
  }

  if (!curriculumMatch) {
    console.error(`⚠️ Could not locate curriculum directive for '${chapterKey}'. Skipping.`);
    continue;
  }

  const curriculumDirective = curriculumMatch[1].replace(/\r?\n/g, ' ').trim();
  const targetModel = isArgon ? 'gemini-4-argon' : (process.env.GEMINI_FLASH_MODEL || 'gemini-2.5-flash');

  let dataDir;
  let audioDir;
  let outputVideo;
  let chapterSlug;

  if (isArgon) {
    chapterSlug = `${chapterKey}_argon`;
    dataDir = path.join(rootDir, 'src', 'data', 'chapters', chapterSlug);
    audioDir = path.join(rootDir, 'public', 'audio', chapterSlug);
    outputVideo = path.join(rootDir, 'out', 'chapters', `${chapterKey}.mp4`);
  } else {
    chapterSlug = null;
    dataDir = path.join(rootDir, 'src', 'data');
    audioDir = path.join(rootDir, 'public', 'audio');
    outputVideo = path.join(rootDir, 'out', `${chapterKey}.mp4`);
  }

  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(audioDir, { recursive: true });
  fs.mkdirSync(path.dirname(outputVideo), { recursive: true });

  const rawEpisodePath = path.join(dataDir, 'episode_raw.json');
  const compiledEpisodePath = path.join(dataDir, 'episode_compiled.json');

  // Script Generation / Normalization
  if (fs.existsSync(rawEpisodePath) && !isForce) {
    console.log(`ℹ️ Existing 'episode_raw.json' found at: ${rawEpisodePath}. Applying normalization & remedies...`);
    try {
      let raw = JSON.parse(fs.readFileSync(rawEpisodePath, 'utf8'));
      raw = normalizeAndRemedyEpisode(raw, chapterSlug || path.basename(dataDir));
      fs.writeFileSync(rawEpisodePath, JSON.stringify(raw, null, 2), 'utf8');
      console.log(`✅ Normalized existing payload for ${chapterKey}.`);
    } catch (normErr) {
      console.warn(`⚠️ Warning: normalization failed for ${chapterKey}:`, normErr.message);
    }
  } else {
    // 1. Extract Authoritative Context from Gemini Notebook (Single Source of Truth)
    const contextFilePath = ensureNotebookContext(isHull, chapterKey, curriculumDirective, dataDir);
    const notesArg = contextFilePath ? `--notes="${contextFilePath}"` : '';

    // Phase 1: Source Facts Extraction & Content Audit Gate
    console.log(`📋 [PHASE 1] Extracting & Auditing Structured Source Facts for ${chapterKey}...`);
    try {
      await extractSourceFacts(dataDir, { force: isForce });
      const audit = runContentAudit(dataDir);
      if (audit.status === 'FAIL') {
        console.error(`\n❌ [AUDIT GATE FAILED] Episode generation blocked for ${chapterKey}:`);
        console.error(`   ${audit.blockingReason}`);
        audit.findings
          .filter((f) => f.severity === 'CRITICAL')
          .forEach((f, idx) => {
            console.error(`   ${idx + 1}. [${f.code}] (${f.category}): ${f.message}`);
            if (f.suggestedRemedy) console.error(`      Remedy: ${f.suggestedRemedy}`);
          });
        console.error(`   Halting generation as per Phase 1 contract. Please repair source facts.\n`);
        continue;
      }
      console.log(`✅ [AUDIT GATE PASSED] Content audit status: ${audit.status}`);

      // Generate Lesson Plan & Storyboard grounded strictly in verified source facts
      await generateLessonAndStoryboard(dataDir, { force: isForce });
    } catch (phase1Err) {
      console.error(`❌ Phase 1 Source/Lesson architecture error for ${chapterKey}:`, phase1Err.message);
      continue;
    }

    console.log(`🤖 Generating episode payload with model ${targetModel}...`);
    const topicArg = isHull ? '--topic="FUTURES & OPTIONS · JOHN C. HULL"' : '';
    const genCommand = `"${process.execPath}" --max-http-header-size=65536 scripts/generate_episode.mjs --dir="${dataDir}" --model=${targetModel} --temperature=0.2 ${topicArg} ${notesArg} --curriculum="${curriculumDirective.replace(/"/g, '\\"')}"`;
    try {
      execSync(genCommand, { stdio: 'inherit', cwd: rootDir });
    } catch (err) {
      console.error(`❌ Episode generation script failed for ${chapterKey}:`, err.message);
      continue;
    }
  }

  // Automated QA Harness & Pre-TTS Gate
  console.log(`🛡️ Running QA Harness & Validation for ${chapterKey}...`);
  try {
    execSync(`"${process.execPath}" scripts/test_harness.mjs --dir="${dataDir}"`, { stdio: 'inherit', cwd: rootDir });
  } catch {
    console.error(`❌ QA Harness validation failed for ${chapterKey}. Skipping render.`);
    continue;
  }

  // Audio Synthesis
  if (!skipTTS) {
    console.log(`🎙️ Compiling Hinglish TTS Audio (${ttsMode.toUpperCase()}) for ${chapterKey}...`);
    const ttsFlag = ttsMode === 'gemini' ? '--tts=gemini' : '';
    try {
      execSync(`"${process.execPath}" scripts/compile_tts_audio.mjs --dir="${dataDir}" ${ttsFlag} --force`, { stdio: 'inherit', cwd: rootDir });
    } catch (err) {
      console.error(`❌ Audio compilation failed for ${chapterKey}:`, err.message);
      continue;
    }
  }

  if (!fs.existsSync(compiledEpisodePath)) {
    console.error(`❌ Compiled episode data not found at: ${compiledEpisodePath}`);
    continue;
  }

  // If video already exists and is valid, skip unless force or re-render is requested
  if (fs.existsSync(outputVideo) && fs.statSync(outputVideo).size > 1024 * 1024 && !isForce && !isReRender) {
    console.log(`✅ Video already rendered and verified at: ${outputVideo}. Skipping to next.`);
    continue;
  }

  // Video Rendering via Remotion
  if (skipRender) {
    console.log(`⏭️ [--skip-render] Skipping video rendering for ${chapterKey}.`);
    continue;
  }

  // Phase 1 Render Gate: Block rendering when unresolved CRITICAL findings exist
  const auditPath = path.join(dataDir, 'content_audit.json');
  if (fs.existsSync(auditPath)) {
    try {
      const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
      if (auditData.status === 'FAIL') {
        console.error(`🛑 RENDER BLOCKED: Content audit for ${chapterKey} has status FAIL.`);
        console.error(`   ${auditData.blockingReason || 'Unresolved critical findings present.'}`);
        continue;
      }
    } catch (e) {
      console.error(`🛑 RENDER BLOCKED: Invalid content_audit.json for ${chapterKey}:`, e.message);
      continue;
    }
  } else {
    console.error(`🛑 RENDER BLOCKED: No content_audit.json found in ${dataDir}. Phase 1 compliance required.`);
    continue;
  }

  console.log(`🎬 Rendering Final MP4 Video to ${outputVideo}...`);
  const renderProps = isArgon ? `--props="${compiledEpisodePath}"` : '';
  const renderCommand = `npx remotion render src/index.ts EpisodeComposition "${outputVideo}" ${renderProps} --crf=16 --pixel-format=yuv420p`.trim();

  try {
    execSync(renderCommand, { stdio: 'inherit', cwd: rootDir });
    console.log(`✅ Successfully completed: ${outputVideo}`);

    // Post-render QA verification
    try {
      execSync(`"${process.execPath}" scripts/test_harness.mjs --dir="${dataDir}"`, { stdio: 'inherit', cwd: rootDir });
    } catch {
      console.warn(`⚠️ Post-render QA detected telemetry warnings for ${chapterKey}.`);
    }
  } catch (err) {
    console.error(`❌ Remotion rendering failed for ${chapterKey}:`, err.message);
  }
}

console.log(`\n======================================================`);
console.log(`🎉 BATCH PROCESSING COMPLETE!`);
console.log(`======================================================\n`);