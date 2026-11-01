// scripts/generate_video.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import 'dotenv/config';

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

// 1. Detect Model Engine: Argon vs Standard Flash
const isArgon = /argon/i.test(fullInput);
const isForce = rawArgs.includes('--force');
const isDryRun = rawArgs.includes('--dry-run');
const skipRender = rawArgs.includes('--skip-render');
const skipTTS = rawArgs.includes('--skip-tts');
const ttsModeArg = rawArgs.find((a) => a.startsWith('--tts='));
const ttsMode = ttsModeArg ? ttsModeArg.split('=')[1] : 'edge';

// 2. Extract Chapter Key or Chapter Range (e.g. ch04 or ch02_part1 or "Chapter 4, 5, 6")
function resolveChapterKeys(input) {
  const clean = input.toLowerCase();

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
// 1. Curriculum Extraction from 41-Video Master Curriculum.txt
// -------------------------------------------------------------------
const curriculumCandidates = [
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

  const regex = new RegExp(`"(Create a video[^\"]*?${chapterKey}\\.mp4[.]?)"`, 'i');
  const curriculumMatch = curriculumContent.match(regex);

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

  // Script Generation
  if (fs.existsSync(rawEpisodePath) && !isForce) {
    console.log(`ℹ️ Existing 'episode_raw.json' found at: ${rawEpisodePath}`);
  } else {
    console.log(`🤖 Generating episode payload with model ${targetModel}...`);
    const genCommand = `"${process.execPath}" --max-http-header-size=65536 scripts/generate_episode.mjs --dir="${dataDir}" --model=${targetModel} --temperature=0.2 --curriculum="${curriculumDirective.replace(/"/g, '\\"')}"`;
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

  // If video already exists and is valid, skip unless force is requested
  if (fs.existsSync(outputVideo) && fs.statSync(outputVideo).size > 1024 * 1024 && !isForce) {
    console.log(`✅ Video already rendered and verified at: ${outputVideo}. Skipping to next.`);
    continue;
  }

  // Video Rendering via Remotion
  if (skipRender) {
    console.log(`⏭️ [--skip-render] Skipping video rendering for ${chapterKey}.`);
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