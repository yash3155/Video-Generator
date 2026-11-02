// scripts/batch_runner_all_pending.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawn } from 'node:child_process';
import 'dotenv/config';
import { normalizeAndRemedyEpisode } from './generate_episode.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function restartProxy() {
  console.log('🔄 [PROXY] Resetting proxy daemon for a clean conversation session...');
  try {
    execSync('powershell -Command "Get-Process -Name \'gemini-core*\' -ErrorAction SilentlyContinue | Stop-Process -Force"', { stdio: 'ignore' });
  } catch {}
  const exePath = path.resolve(rootDir, '..', 'free-gemini-api', 'gemini-core-windows-amd64.exe');
  const sub = spawn(exePath, [], {
    cwd: path.dirname(exePath),
    detached: true,
    stdio: 'ignore',
  });
  sub.unref();
  execSync('powershell -Command "Start-Sleep -Seconds 3"', { stdio: 'ignore' });
  console.log('✅ Proxy daemon refreshed and ready.');
}

let TARGET_QUEUE = [
  'ch16_part1',
  'ch16_part2',
  'ch17_part1',
  'ch17_part2',
  'ch18_part1',
  'ch19_part1',
  'appendix_ab',
  'appendix_cd',
];

const cliArgs = process.argv.slice(2);
const fromArg = cliArgs.find((a) => a.startsWith('--from='));
const onlyArg = cliArgs.find((a) => a.startsWith('--only='));

if (fromArg) {
  const startKey = fromArg.split('=')[1];
  const startIdx = TARGET_QUEUE.indexOf(startKey);
  if (startIdx >= 0) {
    TARGET_QUEUE = TARGET_QUEUE.slice(startIdx);
  }
} else if (onlyArg) {
  const onlyKeys = onlyArg.split('=')[1].split(',');
  TARGET_QUEUE = TARGET_QUEUE.filter((k) => onlyKeys.includes(k));
} else if (cliArgs.length > 0 && !cliArgs[0].startsWith('--')) {
  TARGET_QUEUE = TARGET_QUEUE.filter((k) => cliArgs.includes(k));
}

const curriculumPath = path.join(rootDir, '41-Video Master Curriculum.txt');
const curriculumContent = fs.readFileSync(curriculumPath, 'utf8');

const reportPath = path.join(rootDir, 'out', 'batch_pending_chapters_report.json');
let results = [];
if (fs.existsSync(reportPath)) {
  try {
    results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch {}
}

console.log(`\n======================================================`);
console.log(`🚀 MASTER AUTONOMOUS BATCH PIPELINE: FINAL PENDING CHAPTERS`);
console.log(`   Chapters: 16, 17, 18, 19, Appendix A&B, Appendix C&D`);
console.log(`   Engine: Gemini 4 Argon via free-gemini-api Proxy (argon-low)`);
console.log(`   Total Targets: ${TARGET_QUEUE.length} video parts`);
console.log(`======================================================\n`);

for (let idx = 0; idx < TARGET_QUEUE.length; idx++) {
  const key = TARGET_QUEUE[idx];
  const slug = `${key}_argon`;
  const dataDir = path.join(rootDir, 'src', 'data', 'chapters', slug);
  const audioDir = path.join(rootDir, 'public', 'audio', slug);
  const outputVideo = path.join(rootDir, 'out', 'chapters', `${key}.mp4`);
  const rawPath = path.join(dataDir, 'episode_raw.json');
  const compiledPath = path.join(dataDir, 'episode_compiled.json');

  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(audioDir, { recursive: true });
  fs.mkdirSync(path.dirname(outputVideo), { recursive: true });

  const isCaseA = fs.existsSync(rawPath);
  const forceRender = cliArgs.includes('--force') || cliArgs.includes('--force-render');
  const existingReport = results.find((r) => r.key === key);

  if (
    fs.existsSync(outputVideo) &&
    fs.statSync(outputVideo).size > 1024 * 1024 &&
    existingReport?.status === 'Pristine ✅' &&
    !forceRender
  ) {
    console.log(`⏩ [SKIP] ${key} is already completed & verified (${existingReport.duration}, ${existingReport.fileSizeMb}).`);
    continue;
  }

  console.log(`\n======================================================`);
  console.log(`[${idx + 1}/${TARGET_QUEUE.length}] Processing Part: ${key} (${isCaseA ? 'Case A: Remediate' : 'Case B: Generate via Argon'})`);
  console.log(`======================================================`);

  try {
    if (isCaseA) {
      // -----------------------------------------------------------------
      // Case A: Sanitize & Remediate Existing Payload
      // -----------------------------------------------------------------
      console.log(`\n🔧 [Step 1/4] Auditing and sanitizing existing ${rawPath}...`);
      let rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
      rawData = normalizeAndRemedyEpisode(rawData, slug);
      fs.writeFileSync(rawPath, JSON.stringify(rawData, null, 2), 'utf8');
      console.log(`✅ Normalized payload written.`);
    } else {
      // -----------------------------------------------------------------
      // Case B: Generate via Gemini 4 Argon Proxy
      // -----------------------------------------------------------------
      restartProxy();
      console.log(`\n🤖 [Step 1/4] Generating new episode payload with Gemini 4 Argon...`);
      const regex = new RegExp(`"(Create a video[^\"]*?${key}\\.mp4[.]?)"`, 'i');
      const match = curriculumContent.match(regex);
      if (!match) {
        throw new Error(`Curriculum directive not found for ${key}`);
      }
      const directive = match[1].replace(/\r?\n/g, ' ').trim();

      const genCmd = `"${process.execPath}" --max-http-header-size=65536 scripts/generate_episode.mjs --dir="${dataDir}" --model=gemini-4-argon --temperature=0.2 --curriculum="${directive.replace(/"/g, '\\"')}"`;
      execSync(genCmd, { stdio: 'inherit', cwd: rootDir });

      // Run normalization & remedy immediately after generation
      if (fs.existsSync(rawPath)) {
        let rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
        rawData = normalizeAndRemedyEpisode(rawData, slug);
        fs.writeFileSync(rawPath, JSON.stringify(rawData, null, 2), 'utf8');
      }
    }

    // -----------------------------------------------------------------
    // Step 2: Validate via validate_episode.mjs (with single-pass auto-correction)
    // -----------------------------------------------------------------
    console.log(`\n🛡️ [Step 2/4] Validating episode with Zod & Invariant Rules...`);
    try {
      execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${path.relative(rootDir, dataDir).replace(/\\/g, '/')}"`, {
        stdio: 'inherit',
        cwd: rootDir,
      });
    } catch (valErr) {
      console.warn(`\n⚠️ [WARN] First validation pass flagged issues. Applying automated remediation remedy pass...`);
      let rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
      rawData = normalizeAndRemedyEpisode(rawData, slug);
      fs.writeFileSync(rawPath, JSON.stringify(rawData, null, 2), 'utf8');
      execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${path.relative(rootDir, dataDir).replace(/\\/g, '/')}"`, {
        stdio: 'inherit',
        cwd: rootDir,
      });
    }
    console.log(`✅ Validation passed.`);

    // -----------------------------------------------------------------
    // Step 3: Re-synthesize / Synthesize Hinglish TTS Audio
    // -----------------------------------------------------------------
    console.log(`\n🎙️ [Step 3/4] Synthesizing TTS audio...`);
    execSync(`"${process.execPath}" scripts/compile_tts_audio.mjs --dir="${dataDir}" --force`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
    console.log(`✅ Audio synthesis complete.`);

    // -----------------------------------------------------------------
    // Step 4: Render MP4 Video via Remotion
    // -----------------------------------------------------------------
    console.log(`\n🎬 [Step 4/4] Rendering Final MP4 video to ${outputVideo}...`);
    const cleanOutputVideo = outputVideo.replace(/\\/g, '/');
    const cleanCompiledPath = compiledPath.replace(/\\/g, '/');
    const renderCmd = `npx remotion render src/index.ts EpisodeComposition "${cleanOutputVideo}" --props="${cleanCompiledPath}" --crf=16 --pixel-format=yuv420p`;
    execSync(renderCmd, { stdio: 'inherit', cwd: rootDir });
    console.log(`✅ Render complete: ${outputVideo}`);

    // Gather Stats
    const compiled = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));
    const totalScenes = compiled.scenes?.length || 0;
    const totalBeats = compiled.scenes?.reduce((acc, s) => acc + (s.beats?.length || 0), 0) || 0;
    const totalFrames = compiled.scenes?.reduce((acc, s) => acc + (s.beats?.reduce((bAcc, b) => bAcc + (b.durationInFrames || 0), 0) || 0), 0) || 0;
    const totalSec = Math.round(totalFrames / 30);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const durationFormatted = `${mins}:${String(secs).padStart(2, '0')}`;
    const fileSizeMb = (fs.statSync(outputVideo).size / (1024 * 1024)).toFixed(1);
    const topic = compiled.meta?.title || compiled.scenes?.[0]?.title || key;

    const entry = {
      key,
      topic,
      caseType: isCaseA ? 'Remediated & Re-rendered' : 'Generated via Argon & Rendered',
      scenes: totalScenes,
      beats: totalBeats,
      duration: durationFormatted,
      fileSizeMb: `${fileSizeMb} MB`,
      status: 'Pristine ✅',
    };

    const existingIdx = results.findIndex((r) => r.key === key);
    if (existingIdx >= 0) {
      results[existingIdx] = entry;
    } else {
      results.push(entry);
    }

    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  } catch (err) {
    console.error(`\n❌ Error processing ${key}:`, err.message);
    const failEntry = {
      key,
      topic: key,
      caseType: isCaseA ? 'Case A' : 'Case B',
      scenes: 0,
      beats: 0,
      duration: '0:00',
      fileSizeMb: '0 MB',
      status: `FAILED: ${err.message}`,
    };

    const existingIdx = results.findIndex((r) => r.key === key);
    if (existingIdx >= 0) {
      results[existingIdx] = failEntry;
    } else {
      results.push(failEntry);
    }

    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  }
}

// Final report output
console.log(`\n======================================================`);
console.log(`🎉 ALL PENDING CHAPTERS BATCH RUNNER FINISHED!`);
console.log(`======================================================`);
console.table(results);
