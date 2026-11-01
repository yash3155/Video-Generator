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

// 2. Extract Chapter Key
function extractChapterKey(input) {
  // Pattern 1: Chapter X Part Y or chX_partY
  const chapMatch = input.match(/ch(?:apter)?\s*0?(\d+)[\s_,.-]*(?:part|p)\s*0?(\d+)/i);
  if (chapMatch) {
    const c = chapMatch[1].padStart(2, '0');
    const p = chapMatch[2];
    return `ch${c}_part${p}`;
  }

  // Pattern 2: Appendix A & B or appendix_ab
  const appMatch = input.match(/appendix[_\s-]*([a-d]{1,2})/i);
  if (appMatch) {
    const letters = appMatch[1].toLowerCase();
    if (letters.includes('a') || letters.includes('b')) return 'appendix_ab';
    if (letters.includes('c') || letters.includes('d')) return 'appendix_cd';
  }

  // Pattern 3: Direct key match (e.g., ch01_part2)
  const directMatch = input.match(/(ch\d+_part\d+|appendix_[a-z]+)/i);
  if (directMatch) {
    return directMatch[1].toLowerCase();
  }

  return null;
}

const chapterKey = extractChapterKey(fullInput);
if (!chapterKey) {
  console.error(`❌ Could not identify a valid chapter key from: "${fullInput}"`);
  console.error(`   Expected formats like 'ch02_part1', 'Chapter 2 Part 1', or 'appendix_ab'.`);
  process.exit(1);
}

// -------------------------------------------------------------------
// 1. Curriculum Extraction from 41-Video Master Curriculum.txt
// -------------------------------------------------------------------
const curriculumPath = path.join(rootDir, '41-Video Master Curriculum.txt');
if (!fs.existsSync(curriculumPath)) {
  console.error(`❌ '41-Video Master Curriculum.txt' not found at: ${curriculumPath}`);
  process.exit(1);
}

const curriculumContent = fs.readFileSync(curriculumPath, 'utf8');
const regex = new RegExp(`"(Create a video[^\"]*?${chapterKey}\\.mp4[.]?)"`, 'i');
const curriculumMatch = curriculumContent.match(regex);

if (!curriculumMatch) {
  console.error(`❌ Could not locate curriculum directive for '${chapterKey}' in 41-Video Master Curriculum.txt`);
  process.exit(1);
}

const curriculumDirective = curriculumMatch[1];

// -------------------------------------------------------------------
// 2. Workspace & Path Initialization
// -------------------------------------------------------------------
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

console.log(`\n======================================================`);
console.log(`🎬 AUTOMATED VIDEO GENERATION ENGINE`);
console.log(`======================================================`);
console.log(`  Input Command:      "${fullInput}"`);
console.log(`  Target Key:         ${chapterKey}`);
console.log(`  Engine Pipeline:    ${isArgon ? '🔥 GEMINI 4 ARGON (Isolated Workspace)' : '⚡ GEMINI FLASH (Production Root)'}`);
console.log(`  Target Model:       ${targetModel}`);
console.log(`  Data Directory:     ${dataDir}`);
console.log(`  Audio Directory:    ${audioDir}`);
console.log(`  Final Render:       ${outputVideo}`);
console.log(`------------------------------------------------------`);
console.log(`  Curriculum Prompt:\n  "${curriculumDirective}"`);
console.log(`======================================================\n`);

if (isDryRun) {
  console.log(`[DRY RUN] Workspace and paths verified. Exiting without execution.`);
  process.exit(0);
}

// Ensure target directories exist
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(path.dirname(outputVideo), { recursive: true });

// -------------------------------------------------------------------
// 3. Script Generation (Gemini 4 Argon or Flash)
// -------------------------------------------------------------------
const rawEpisodePath = path.join(dataDir, 'episode_raw.json');
const compiledEpisodePath = path.join(dataDir, 'episode_compiled.json');

if (fs.existsSync(rawEpisodePath) && !isForce) {
  console.log(`ℹ️ Existing 'episode_raw.json' found at: ${rawEpisodePath}`);
  console.log(`   (Use --force to regenerate from LLM)`);
} else {
  console.log(`🤖 Generating episode payload with model ${targetModel}...`);
  const genCommand = `"${process.execPath}" --max-http-header-size=65536 scripts/generate_episode.mjs --dir="${dataDir}" --model=${targetModel} --temperature=0.2 --curriculum="${curriculumDirective.replace(/"/g, '\\"')}"`;
  
  try {
    execSync(genCommand, { stdio: 'inherit', cwd: rootDir });
  } catch (err) {
    console.error(`❌ Episode generation script failed:`, err.message);
    process.exit(1);
  }
}

// -------------------------------------------------------------------
// 4. Single-Pass Automated Self-Correction Loop & Zod Validation
// -------------------------------------------------------------------
console.log(`\n🔍 [STEP 4] Running Zod Schema Validation...`);
let validationPassed = false;

try {
  execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${dataDir}"`, { stdio: 'inherit', cwd: rootDir });
  validationPassed = true;
} catch {
  console.warn(`\n⚠️ Initial validation detected issues. Executing SINGLE-PASS automated self-correction...`);
  
  try {
    if (fs.existsSync(rawEpisodePath)) {
      let content = fs.readFileSync(rawEpisodePath, 'utf8');
      
      // Auto-remedy 1: Phonetic TTS corrections
      content = content.replace(/रि[ज़जज़]ल्ट्स|रि[ज़जज़]ल्ट|रि[ज़जज़]िट|रि[ज़जज़]ट/gi, 'नतीजे');
      content = content.replace(/USFDA|यू\s*एस\s*एफ\s*डी\s*ए/gi, 'दवा रेगुलेटर (FDA)');

      // Auto-remedy 2: Parse and verify scene structures
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.scenes)) {
        parsed.scenes.forEach((scene) => {
          if (scene.template === 'tug_of_war') {
            scene.beats?.forEach((b) => {
              if (b.ui_state) {
                b.ui_state.centerTitle = b.ui_state.centerTitle || 'Tug of War';
                b.ui_state.centerMetric = b.ui_state.centerMetric || 'Balance';
                b.ui_state.trend = b.ui_state.trend || 'neutral';
              }
            });
          }
        });
      }
      
      fs.writeFileSync(rawEpisodePath, JSON.stringify(parsed, null, 2), 'utf8');
      console.log(`  -> Applied phonetic and structure fixes. Re-validating (strict single pass)...`);
    }

    // Single re-validation attempt
    execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${dataDir}"`, { stdio: 'inherit', cwd: rootDir });
    validationPassed = true;
    console.log(`✅ Single-pass self-correction succeeded!`);
  } catch (reErr) {
    console.error(`❌ Validation failed after single self-correction attempt. Halting to prevent infinite loop.`);
    process.exit(1);
  }
}

// -------------------------------------------------------------------
// 5. Audio Synthesis & Mirroring
// -------------------------------------------------------------------
if (!skipTTS) {
  console.log(`\n🎙️ [STEP 5] Compiling Hinglish TTS Audio (${ttsMode.toUpperCase()})...`);
  const ttsFlag = ttsMode === 'gemini' ? '--tts=gemini' : '';
  const compileCommand = `"${process.execPath}" scripts/compile_tts_audio.mjs --dir="${dataDir}" ${ttsFlag} --force`;
  
  try {
    execSync(compileCommand, { stdio: 'inherit', cwd: rootDir });
  } catch (err) {
    console.error(`❌ Audio compilation failed:`, err.message);
    process.exit(1);
  }
}

if (!fs.existsSync(compiledEpisodePath)) {
  console.error(`❌ Compiled episode data not found at: ${compiledEpisodePath}`);
  process.exit(1);
}

// -------------------------------------------------------------------
// 6. Video Rendering via Remotion
// -------------------------------------------------------------------
if (skipRender) {
  console.log(`\n⏭️ [--skip-render] Audio and episode compiled. Skipping video rendering.`);
  console.log(`✨ All workspace assets prepared in: ${dataDir}`);
  process.exit(0);
}

console.log(`\n🎬 [STEP 6] Rendering Final MP4 Video to ${outputVideo}...`);
const renderProps = isArgon
  ? `--props="${compiledEpisodePath}"`
  : '';

const renderCommand = `npx remotion render src/index.ts EpisodeComposition "${outputVideo}" ${renderProps} --crf=16 --pixel-format=yuv420p`.trim();

try {
  execSync(renderCommand, { stdio: 'inherit', cwd: rootDir });
  console.log(`\n======================================================`);
  console.log(`🎉 VIDEO GENERATION COMPLETE!`);
  console.log(`  File: ${outputVideo}`);
  console.log(`======================================================\n`);
} catch (err) {
  console.error(`❌ Remotion rendering failed:`, err.message);
  process.exit(1);
}
