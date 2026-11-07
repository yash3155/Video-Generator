// scripts/batch_render_murphy_en.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const baseDir = path.resolve('src/data/chapters/murphy_technical_analysis_en');
const outDir = path.resolve('out/chapters/murphy_technical_analysis_en');
fs.mkdirSync(outDir, { recursive: true });

const chapters = fs.readdirSync(baseDir)
  .filter(d => fs.statSync(path.join(baseDir, d)).isDirectory());

console.log(`Starting automated batch rendering for Murphy English (${chapters.length} chapters)...`);

let renderedCount = 0;
let skippedCount = 0;
let failCount = 0;
const failures = [];

for (let i = 0; i < chapters.length; i++) {
  const ch = chapters[i];
  const targetMp4 = path.join(outDir, `${ch}.mp4`);
  const compiledProps = path.join(baseDir, ch, 'episode_compiled.json');

  if (fs.existsSync(targetMp4) && fs.statSync(targetMp4).size > 1000000) {
    console.log(`⏩ [${i + 1}/${chapters.length}] Already rendered: ${ch}.mp4 (${(fs.statSync(targetMp4).size / 1024 / 1024).toFixed(1)}MB). Skipping.`);
    skippedCount++;
    continue;
  }

  if (!fs.existsSync(compiledProps)) {
    console.log(`⏳ [${i + 1}/${chapters.length}] Waiting for audio compilation: ${ch}`);
    continue;
  }

  console.log(`\n========================================`);
  console.log(`🎬 [${i + 1}/${chapters.length}] Rendering: murphy_technical_analysis_en/${ch}.mp4`);
  console.log(`========================================`);

  try {
    const renderCmd = `npx remotion render src/index.ts EpisodeComposition "${targetMp4}" --props="${compiledProps}" --crf=16 --pixel-format=yuv420p`;
    execSync(renderCmd, { stdio: 'inherit' });

    console.log(`🛡️ Running QA Release Gate on ${ch}...`);
    const qaCmd = `node scripts/run_qa.mjs --dir="${path.join(baseDir, ch)}"`;
    execSync(qaCmd, { stdio: 'inherit' });

    renderedCount++;
    console.log(`✅ Successfully delivered: ${ch}.mp4`);
  } catch (err) {
    failCount++;
    failures.push({ chapter: ch, error: err.message });
    console.error(`❌ Render failed for ${ch}:`, err.message);
  }
}

console.log(`\n========================================`);
console.log(`MURPHY ENGLISH BATCH RENDER SUMMARY`);
console.log(`Already Rendered: ${skippedCount}`);
console.log(`Newly Rendered:   ${renderedCount}`);
console.log(`Failed:           ${failCount}`);
if (failures.length > 0) {
  console.log('Failures:', failures);
}
console.log(`========================================`);
