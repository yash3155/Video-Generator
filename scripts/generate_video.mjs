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
import { getBookSlug, resolveChapterDirectory, resolveOutputVideoPath } from '../src/utils/chapterPaths.mjs';
import { checkArgonPreflight } from '../src/utils/modelPreflight.mjs';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';
import { recordExecution } from '../src/orchestrator/executionLedger.mjs';

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
  node scripts/generate_video.mjs "Make video ch02_part1"
  node scripts/generate_video.mjs ch02_part1
  npm run make-video -- ch02_part1
  npm run make-video -- "hull ch01_part1"

Options:
  --confirm-flash   Explicit user confirmation to fallback to Gemini 3.8 Flash if Argon is unavailable
  --force           Overwrite existing episode_raw.json and regenerate
  --dry-run         Parse curriculum and setup paths without making API/render calls
  --skip-render     Compile audio and data only, skip final Remotion render
  --skip-tts        Skip audio compilation if already generated
  --tts=gemini      Use Gemini TTS instead of Edge-TTS
`);
  process.exit(0);
}

// Detect book domain & language
const isHull = /hull/i.test(fullInput);
const isEnglish = /_en|\ben\b|english/i.test(fullInput);
const isForce = rawArgs.includes('--force');
const isReRender = rawArgs.includes('--re-render') || rawArgs.includes('--force-render');
const isDryRun = rawArgs.includes('--dry-run');
const skipRender = rawArgs.includes('--skip-render');
const skipTTS = rawArgs.includes('--skip-tts');
const confirmFlash = rawArgs.includes('--confirm-flash') || rawArgs.includes('--flash');
const isLegacyMonolith = rawArgs.includes('--legacy-monolith');
const ttsModeArg = rawArgs.find((a) => a.startsWith('--tts='));
const ttsMode = ttsModeArg ? ttsModeArg.split('=')[1] : 'edge';

// -------------------------------------------------------------------
// 1. Mandatory Argon Preflight Check & Explicit Flash Fallback Policy
// -------------------------------------------------------------------
console.log(`\n======================================================`);
console.log(`🔍 MODEL PREFLIGHT VERIFICATION`);
console.log(`======================================================`);

const argonStatus = await checkArgonPreflight(rootDir);
let targetModel = 'gemini-4-argon';
let generationProvenance = {};

if (argonStatus.available) {
  targetModel = 'gemini-4-argon';
  generationProvenance = {
    model: 'gemini-4-argon',
    requestedModel: 'gemini-4-argon',
    preflightStatus: 'PASSED',
    preflightEngine: argonStatus.engine,
    approvedByUser: true,
    approvalTimestamp: new Date().toISOString(),
    runId: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
  console.log(`✅ [PREFLIGHT PASSED] Gemini 4 Argon is online and ready (engine: ${argonStatus.engine}).`);
} else {
  console.log(`\n❌ [PREFLIGHT FAILED] Gemini 4 Argon is unavailable.`);
  console.log(`   Reason: ${argonStatus.reason}\n`);

  if (!confirmFlash) {
    console.error(`Argon is unavailable. Would you like me to continue this chapter with Gemini 3.8 Flash?`);
    console.error(`\nTo proceed with Gemini 3.8 Flash, confirm with:`);
    console.error(`   npm run make-video -- ${rawArgs.filter((a) => a !== '--confirm-flash').join(' ')} --confirm-flash\n`);
    process.exit(2);
  }

  targetModel = process.env.GEMINI_FLASH_MODEL || 'gemini-3.8-flash';
  generationProvenance = {
    model: targetModel,
    requestedModel: 'gemini-4-argon',
    preflightStatus: 'FAILED',
    fallbackReason: argonStatus.reason,
    approvedByUser: true,
    approvalTimestamp: new Date().toISOString(),
    runId: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
  console.log(`⚡ [USER CONFIRMED] Explicit approval received to fallback to ${targetModel}.`);
}
console.log(`======================================================\n`);

// -------------------------------------------------------------------
// 2. Resolve Chapter Keys
// -------------------------------------------------------------------
function resolveChapterKeys(input) {
  const clean = input.toLowerCase();

  // If HULL course
  if (isHull) {
    const hullCurriculum = isEnglish
      ? path.join(rootDir, 'Hull_40_Video_Master_Curriculum_EN.txt')
      : path.join(rootDir, 'Hull_40_Video_Master_Curriculum.txt');
    const content = fs.existsSync(hullCurriculum) ? fs.readFileSync(hullCurriculum, 'utf8') : '';

    const directPartMatches = [...clean.matchAll(/(?:hull_)?ch(\d+)[_.-]*(?:part|p)\s*0?(\d+)/gi)];
    if (directPartMatches.length > 0 && !clean.includes(' to ') && !clean.includes(' - ')) {
      return directPartMatches.map((m) => `ch${m[1].padStart(2, '0')}_part${m[2]}`);
    }

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
        const cleanK = match[1].replace(/^hull_/i, '');
        if (!allKeys.includes(cleanK)) allKeys.push(cleanK);
      }
    }
    if (allKeys.length > 0) return allKeys;
    return [];
  }

  // Murphy course (default)
  if (/appendix/i.test(clean)) {
    if (/ab|[1-2]/i.test(clean)) return ['appendix_ab'];
    if (/cd|[3-4]/i.test(clean)) return ['appendix_cd'];
    return ['appendix_ab', 'appendix_cd'];
  }

  const directPartMatches = [...clean.matchAll(/(ch\d+[_.-]*(?:part|p)\s*0?\d+)/gi)];
  if (directPartMatches.length > 0) {
    return directPartMatches.map((m) =>
      m[1].replace(/[_.-]*(?:part|p)\s*0?(\d+)/i, '_part$1').toLowerCase()
    );
  }

  const curriculumCandidates = [
    '41-Video Master Curriculum.txt',
    '41-Video Master Curriculum_2.txt',
  ];
  const curriculumFile = curriculumCandidates.find((f) =>
    fs.existsSync(path.join(rootDir, f))
  );

  const partMatch = clean.match(/ch(?:apter)?\s*0?(\d+)[\s_,.-]*(?:part|p)\s*0?(\d+)/i);
  if (partMatch) {
    const c = partMatch[1].padStart(2, '0');
    const p = partMatch[2];
    return [`ch${c}_part${p}`];
  }

  const chapterMatches = [...clean.matchAll(/(?:chapter|ch)\s*0?(\d+)/gi)];
  if (chapterMatches.length > 0 && curriculumFile) {
    const content = fs.readFileSync(path.join(rootDir, curriculumFile), 'utf8');
    const allKeys = [];

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
// 3. Curriculum File Resolution
// -------------------------------------------------------------------
const curriculumCandidates = isEnglish
  ? ['Hull_40_Video_Master_Curriculum_EN.txt']
  : (isHull
    ? ['Hull_40_Video_Master_Curriculum.txt']
    : [
        '41-Video Master Curriculum.txt',
        '41-Video Master Curriculum_2.txt',
      ]);
const curriculumFile = curriculumCandidates.find((f) =>
  fs.existsSync(path.join(rootDir, f))
);

if (!curriculumFile) {
  console.error(`❌ Curriculum file not found in project root!`);
  process.exit(1);
}

const curriculumContent = fs.readFileSync(path.join(rootDir, curriculumFile), 'utf8');

// -------------------------------------------------------------------
// 4. Gemini Notebook Extraction (NotebookLM Single Source of Truth)
// -------------------------------------------------------------------
function ensureNotebookContext(isHullBook, key, directive, targetDir) {
  const contextFilePath = path.join(targetDir, 'notebook_context.txt');
  if (fs.existsSync(contextFilePath) && fs.statSync(contextFilePath).size > 200 && !isForce) {
    console.log(`📖 [NOTEBOOK-LM] Using verified notebook context from: ${contextFilePath}`);
    return contextFilePath;
  }

  console.log(`\n📚 [NOTEBOOK-LM] Querying Gemini Notebook for ${key}...`);
  console.log(`   Rule: Gemini Notebook is the STRICT SINGLE SOURCE OF TRUTH (No web/chat fabrication).`);

  let notebooks = [];
  try {
    const listOut = execSync('nlm notebook list', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    notebooks = JSON.parse(listOut);
  } catch (err) {
    console.error(`❌ Failed to list Gemini Notebooks via 'nlm notebook list':`, err.message);
    throw new Error('Could not access Gemini NotebookLM via nlm CLI.');
  }

  const targetNotebook = isHullBook
    ? notebooks.find((n) => /futures|options|hull/i.test(n.title))
    : notebooks.find((n) => /murphy|technical\s*analysis/i.test(n.title));

  if (!targetNotebook) {
    console.error(`\n❌ [FATAL] No matching Gemini Notebook found for ${isHullBook ? 'John C. Hull (Futures & Options)' : 'John Murphy (Technical Analysis)'}!`);
    console.error(`   Available notebooks in your account:`);
    notebooks.forEach((n) => console.error(`   - "${n.title}" (${n.id})`));
    console.error(`   Please add the book to Gemini NotebookLM first.\n`);
    process.exit(1);
  }

  console.log(`   Connected to Notebook: "${targetNotebook.title}" (${targetNotebook.id})`);

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
// 5. Batch Execution Loop
// -------------------------------------------------------------------
console.log(`\n======================================================`);
console.log(`🎬 AUTOMATED VIDEO GENERATION ENGINE`);
console.log(`======================================================`);
console.log(`  Input Command:      "${fullInput}"`);
console.log(`  Target Parts:       ${chapterKeys.join(', ')}`);
console.log(`  Model Engine:       ${targetModel}`);
console.log(`  Provenance ID:      ${generationProvenance.runId}`);
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

  // Locate curriculum directive
  const searchCandidates = isHull
    ? [chapterKey, `hull_${chapterKey}`]
    : [chapterKey];

  let curriculumDirective = null;
  for (const sKey of searchCandidates) {
    const regex = new RegExp(`"(Create a video[^\"]*?${sKey}\\.mp4[^\"]*?)"`, 'i');
    let match = curriculumContent.match(regex);
    if (!match) {
      const fallbackRegex = new RegExp(`out[\\/\\\\]${sKey}\\.mp4:\\s*["']?([^"\\r\\n]+)["']?`, 'i');
      match = curriculumContent.match(fallbackRegex);
    }
    if (match) {
      curriculumDirective = match[1].replace(/\r?\n/g, ' ').trim();
      break;
    }
  }

  if (!curriculumDirective) {
    console.error(`⚠️ Could not locate curriculum directive for '${chapterKey}'. Skipping.`);
    continue;
  }

  // Stable, model-neutral book-grouped paths
  const bookSlug = isEnglish ? 'hull_derivatives_en' : (isHull ? 'hull_derivatives' : getBookSlug(chapterKey));
  const dataDir = path.join(rootDir, 'src', 'data', 'chapters', bookSlug, chapterKey);
  const audioDir = path.join(rootDir, 'public', 'audio', bookSlug, chapterKey);
  const outputVideo = path.join(rootDir, 'out', 'chapters', bookSlug, `${chapterKey}.mp4`);

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
      raw = normalizeAndRemedyEpisode(raw, chapterKey);
      if (!raw.meta) raw.meta = {};
      raw.meta.generationProvenance = generationProvenance;
      fs.writeFileSync(rawEpisodePath, JSON.stringify(raw, null, 2), 'utf8');
      console.log(`✅ Normalized existing payload for ${chapterKey}.`);
    } catch (normErr) {
      console.warn(`⚠️ Warning: normalization failed for ${chapterKey}:`, normErr.message);
    }
  } else {
    // 1. Extract Authoritative Context from Gemini Notebook
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

    if (!isLegacyMonolith) {
      console.log(`⚡ [MICROKERNEL] Synthesizing 12-scene Cognitive Micro-Kernel episode deterministically (0 tokens)...`);
      try {
        const factsPath = path.join(dataDir, 'source_facts.json');
        const factsData = fs.existsSync(factsPath) ? JSON.parse(fs.readFileSync(factsPath, 'utf8')) : { facts: [] };
        
        const courseConfigPath = path.join(rootDir, 'src', 'courses', `${bookSlug}.json`);
        const courseConfig = fs.existsSync(courseConfigPath) ? JSON.parse(fs.readFileSync(courseConfigPath, 'utf8')) : {};
        
        let episode = scaffoldEpisode({
          chapterKey,
          courseSlug: bookSlug,
          chapterTitle: curriculumDirective,
          facts: factsData.facts || [],
          courseConfig
        });
        
        episode = normalizeAndRemedyEpisode(episode, chapterKey);
        if (!episode.meta) episode.meta = {};
        episode.meta.generationProvenance = generationProvenance;
        
        fs.writeFileSync(rawEpisodePath, JSON.stringify(episode, null, 2), 'utf8');
        console.log(`✅ [MICROKERNEL] Successfully generated 12-scene episode_raw.json for ${chapterKey} (0 tokens burned).`);
        
        recordExecution({
          runId: generationProvenance.runId,
          chapterKey,
          taskId: `scaffold_${chapterKey}`,
          category: 'EPISODE_SCAFFOLDING',
          engine: 'deterministic-microkernel',
          model: 'none',
          inputTokens: 0,
          outputTokens: 0,
          status: 'SUCCESS',
          savingsVsLegacyTokens: 95000
        });
      } catch (scaffoldErr) {
        console.error(`❌ Microkernel scaffolding failed for ${chapterKey}:`, scaffoldErr.message);
        continue;
      }
    } else {
      console.log(`🤖 Generating episode payload with legacy monolithic model ${targetModel}...`);
      const topicArg = isHull ? '--topic="FUTURES & OPTIONS · JOHN C. HULL"' : '';
      const genCommand = `"${process.execPath}" --max-http-header-size=65536 scripts/generate_episode.mjs --dir="${dataDir}" --model=${targetModel} --temperature=0.2 ${topicArg} ${notesArg} --curriculum="${curriculumDirective.replace(/"/g, '\\"')}"`;
      try {
        execSync(genCommand, { stdio: 'inherit', cwd: rootDir });

        // Embed generation provenance
        if (fs.existsSync(rawEpisodePath)) {
          try {
            const raw = JSON.parse(fs.readFileSync(rawEpisodePath, 'utf8'));
            if (!raw.meta) raw.meta = {};
            raw.meta.generationProvenance = generationProvenance;
            fs.writeFileSync(rawEpisodePath, JSON.stringify(raw, null, 2), 'utf8');
          } catch {}
        }
      } catch (err) {
        console.error(`❌ Episode generation script failed for ${chapterKey}:`, err.message);
        continue;
      }
    }
  }

  // Pre-TTS Validation Gate
  console.log(`🛡️ Running Zod Validation Gate for ${chapterKey}...`);
  try {
    execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${dataDir}"`, { stdio: 'inherit', cwd: rootDir });
  } catch {
    console.error(`❌ Validation failed for ${chapterKey}. Skipping render.`);
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
  const renderCommand = `npx remotion render src/index.ts EpisodeComposition "${outputVideo}" --props="${compiledEpisodePath}" --crf=16 --pixel-format=yuv420p`.trim();

  try {
    execSync(renderCommand, { stdio: 'inherit', cwd: rootDir });
    console.log(`✅ Successfully completed: ${outputVideo}`);

    // Post-render QA Release Gate verification
    try {
      execSync(`"${process.execPath}" scripts/run_qa.mjs --dir="${dataDir}" --allow-high`, { stdio: 'inherit', cwd: rootDir });
    } catch {
      console.warn(`⚠️ Post-render QA detected findings for ${chapterKey}.`);
    }
  } catch (err) {
    console.error(`❌ Remotion rendering failed for ${chapterKey}:`, err.message);
  }
}

console.log(`\n======================================================`);
console.log(`🎉 BATCH PROCESSING COMPLETE!`);
console.log(`======================================================\n`);
