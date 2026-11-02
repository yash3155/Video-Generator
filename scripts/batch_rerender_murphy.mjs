// scripts/batch_rerender_murphy.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ALL_MURPHY_KEYS = [
  'ch01_part1',
  'ch01_part2',
  'ch02_part1',
  'ch02_part2',
  'ch03_part1',
  'ch04_part1',
  'ch04_part2',
  'ch04_part3',
  'ch05_part1',
  'ch05_part2',
  'ch06_part1',
  'ch06_part2',
  'ch07_part1',
  'ch07_part2',
  'ch08_part1',
  'ch09_part1',
  'ch09_part2',
  'ch10_part1',
  'ch10_part2',
  'ch11_part1',
  'ch12_part1',
  'ch13_part1',
  'ch13_part2',
  'ch14_part1',
  'ch15_part1',
  'ch16_part1',
  'ch16_part2',
  'ch17_part1',
  'ch17_part2',
  'ch18_part1',
  'ch19_part1',
  'appendix_ab',
  'appendix_cd',
];

const rawArgs = process.argv.slice(2);
const fromArg = rawArgs.find((a) => a.startsWith('--from='));
const fromKey = fromArg ? fromArg.split('=')[1].trim() : null;
const onlyArg = rawArgs.find((a) => a.startsWith('--only='));
const onlyKeys = onlyArg
  ? onlyArg
      .split('=')[1]
      .split(',')
      .map((k) => k.trim())
  : null;

let targetKeys = [...ALL_MURPHY_KEYS];
if (onlyKeys && onlyKeys.length > 0) {
  targetKeys = targetKeys.filter((k) => onlyKeys.includes(k));
} else if (fromKey) {
  const idx = targetKeys.indexOf(fromKey);
  if (idx !== -1) {
    targetKeys = targetKeys.slice(idx);
  }
}

const progressFile = path.join(rootDir, 'out', 'chapters', 'murphy_technical_analysis', 'rerender_progress.json');
fs.mkdirSync(path.dirname(progressFile), { recursive: true });
let completedLog = {};
if (fs.existsSync(progressFile)) {
  try {
    completedLog = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  } catch {}
}

console.log(`\n======================================================`);
console.log(`🎬 BATCH RE-RENDER PIPELINE: TECHNICAL ANALYSIS (MURPHY)`);
console.log(`   Total Targets: ${targetKeys.length} videos`);
console.log(`   Templates / Safeguards: Proportional TugOfWar, Sanitized Audio, Safe Coordinates`);
console.log(`======================================================\n`);

let successCount = 0;
let failCount = 0;
const startTime = Date.now();

for (let i = 0; i < targetKeys.length; i++) {
  const key = targetKeys[i];
  const itemStart = Date.now();
  console.log(`\n[${i + 1}/${targetKeys.length}] 🚀 Processing: ${key}...`);

  // 1. Resolve props file
  let propsFile = path.join(rootDir, 'src', 'data', 'chapters', 'murphy_technical_analysis', `${key}_argon`, 'episode_compiled.json');
  if (!fs.existsSync(propsFile)) {
    propsFile = path.join(rootDir, 'src', 'data', 'chapters', `${key}_argon`, 'episode_compiled.json');
  }
  if (!fs.existsSync(propsFile)) {
    const fallback = path.join(rootDir, 'src', 'data', 'episode_compiled.json');
    if (fs.existsSync(fallback)) propsFile = fallback;
  }

  if (!fs.existsSync(propsFile)) {
    console.error(`❌ Props file not found for ${key}: ${propsFile}`);
    failCount++;
    continue;
  }

  const outVideo = path.join(rootDir, 'out', 'chapters', 'murphy_technical_analysis', `${key}.mp4`);

  // 2. Render Remotion video
  const renderCmd = `npx remotion render src/index.ts EpisodeComposition "${outVideo}" --props="${propsFile}" --crf=16 --pixel-format=yuv420p`;
  console.log(`   Executing: ${renderCmd}`);

  try {
    execSync(renderCmd, { stdio: 'inherit', cwd: rootDir });
    const durationMin = ((Date.now() - itemStart) / 1000 / 60).toFixed(1);
    const sizeMb = (fs.statSync(outVideo).size / 1024 / 1024).toFixed(1);

    completedLog[key] = {
      timestamp: new Date().toISOString(),
      sizeMb: `${sizeMb} MB`,
      durationMin: `${durationMin} min`,
      status: 'SUCCESS',
    };
    fs.writeFileSync(progressFile, JSON.stringify(completedLog, null, 2), 'utf8');

    console.log(`✅ [${i + 1}/${targetKeys.length}] Successfully rendered ${key}.mp4 (${sizeMb} MB in ${durationMin} min)`);
    successCount++;
  } catch (err) {
    console.error(`❌ [${i + 1}/${targetKeys.length}] Failed rendering ${key}:`, err.message);
    completedLog[key] = {
      timestamp: new Date().toISOString(),
      status: 'FAILED',
      error: err.message,
    };
    fs.writeFileSync(progressFile, JSON.stringify(completedLog, null, 2), 'utf8');
    failCount++;
  }
}

const totalMin = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
console.log(`\n======================================================`);
console.log(`🎉 BATCH RE-RENDER COMPLETE!`);
console.log(`   Success: ${successCount} | Failed: ${failCount} | Total Elapsed: ${totalMin} min`);
console.log(`======================================================\n`);

