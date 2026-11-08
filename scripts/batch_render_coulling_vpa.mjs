// scripts/batch_render_coulling_vpa.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const courseHi = 'coulling_vpa';
const courseEn = 'coulling_vpa_en';

const baseHi = path.resolve(`src/data/chapters/${courseHi}`);
const baseEn = path.resolve(`src/data/chapters/${courseEn}`);
const outHi = path.resolve(`out/chapters/${courseHi}`);
const outEn = path.resolve(`out/chapters/${courseEn}`);

fs.mkdirSync(outHi, { recursive: true });
fs.mkdirSync(outEn, { recursive: true });

const chapters = fs.readdirSync(baseHi).filter(d => fs.statSync(path.join(baseHi, d)).isDirectory());

// Check for CLI filter
const args = process.argv.slice(2);
let targetChapters = chapters;
if (args.length > 0 && !args[0].startsWith('--')) {
  targetChapters = args.filter(a => chapters.includes(a));
}

console.log(`\n======================================================`);
console.log(`🎬 BATCH RENDERING COULLING VPA (${targetChapters.length} chapter pairs)`);
console.log(`======================================================\n`);

let renderedHi = 0;
let renderedEn = 0;
let skipped = 0;

for (let i = 0; i < targetChapters.length; i++) {
  const ch = targetChapters[i];
  console.log(`\n------------------------------------------------------`);
  console.log(`📹 [${i + 1}/${targetChapters.length}] Processing Chapter Pair: ${ch}`);
  console.log(`------------------------------------------------------`);

  // 1. Hindi Render
  const targetMp4Hi = path.join(outHi, `${ch}.mp4`);
  const compiledPropsHi = path.join(baseHi, ch, 'episode_compiled.json');

  if (fs.existsSync(targetMp4Hi) && fs.statSync(targetMp4Hi).size > 1000000) {
    console.log(`⏩ Hindi MP4 already exists for ${ch} (${(fs.statSync(targetMp4Hi).size / 1e6).toFixed(1)} MB). Skipping.`);
  } else if (fs.existsSync(compiledPropsHi)) {
    console.log(`🎬 Rendering Hindi video: ${courseHi}/${ch}.mp4...`);
    try {
      const renderCmd = `npx remotion render src/index.ts EpisodeComposition "${targetMp4Hi}" --props="${compiledPropsHi}" --crf=16 --pixel-format=yuv420p`;
      execSync(renderCmd, { stdio: 'inherit' });
      renderedHi++;
      console.log(`🛡️ Running QA Release Gate for Hindi ${ch}...`);
      execSync(`node scripts/run_qa.mjs --dir="${path.join(baseHi, ch)}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ Hindi render error on ${ch}:`, err.message);
    }
  } else {
    console.warn(`⚠️ Missing compiled props for Hindi ${ch}!`);
  }

  // 2. English Render
  const targetMp4En = path.join(outEn, `${ch}.mp4`);
  const compiledPropsEn = path.join(baseEn, ch, 'episode_compiled.json');

  if (fs.existsSync(targetMp4En) && fs.statSync(targetMp4En).size > 1000000) {
    console.log(`⏩ English MP4 already exists for ${ch} (${(fs.statSync(targetMp4En).size / 1e6).toFixed(1)} MB). Skipping.`);
  } else if (fs.existsSync(compiledPropsEn)) {
    console.log(`🎬 Rendering English video: ${courseEn}/${ch}.mp4...`);
    try {
      const renderCmd = `npx remotion render src/index.ts EpisodeComposition "${targetMp4En}" --props="${compiledPropsEn}" --crf=16 --pixel-format=yuv420p`;
      execSync(renderCmd, { stdio: 'inherit' });
      renderedEn++;
      console.log(`🛡️ Running QA Release Gate for English ${ch}...`);
      execSync(`node scripts/run_qa.mjs --dir="${path.join(baseEn, ch)}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ English render error on ${ch}:`, err.message);
    }
  } else {
    console.warn(`⚠️ Missing compiled props for English ${ch}!`);
  }

  // Refresh Inventory
  try {
    execSync('node scripts/build_bilingual_inventory.mjs', { stdio: 'ignore' });
  } catch {}
}

console.log(`\n======================================================`);
console.log(`🎉 COULLING VPA BATCH RENDER COMPLETE!`);
console.log(`   Rendered Hindi:   ${renderedHi}`);
console.log(`   Rendered English: ${renderedEn}`);
console.log(`======================================================\n`);
