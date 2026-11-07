// scripts/batch_compile_murphy_en_tts.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const baseDir = path.resolve('src/data/chapters/murphy_technical_analysis_en');
const chapters = fs.readdirSync(baseDir)
  .filter(d => fs.statSync(path.join(baseDir, d)).isDirectory());

console.log(`Starting batch TTS compilation for ${chapters.length} Murphy English chapters...`);

let successCount = 0;
let skippedCount = 0;
let failCount = 0;
const failures = [];

for (let i = 0; i < chapters.length; i++) {
  const ch = chapters[i];
  const chDir = path.join(baseDir, ch);
  const audioDir = path.resolve(`public/audio/murphy_technical_analysis_en/${ch}`);
  const compiledPath = path.join(chDir, 'episode_compiled.json');

  if (fs.existsSync(compiledPath) && fs.existsSync(audioDir) && fs.readdirSync(audioDir).length > 10) {
    console.log(`⏩ [${i + 1}/${chapters.length}] Already compiled: murphy_technical_analysis_en/${ch} (${fs.readdirSync(audioDir).length} audio files). Skipping.`);
    skippedCount++;
    continue;
  }

  console.log(`\n========================================`);
  console.log(`[${i + 1}/${chapters.length}] Compiling TTS: murphy_technical_analysis_en/${ch}`);
  console.log(`========================================`);

  try {
    const cmd = `node scripts/compile_tts_audio.mjs --dir="${chDir}" --force`;
    execSync(cmd, { stdio: 'inherit' });
    successCount++;
    console.log(`✅ Completed: ${ch}`);
  } catch (err) {
    failCount++;
    failures.push({ chapter: ch, error: err.message });
    console.error(`❌ Failed: ${ch}`, err.message);
  }
}

console.log(`\n========================================`);
console.log(`BATCH TTS COMPILATION SUMMARY`);
console.log(`Skipped (already compiled): ${skippedCount}`);
console.log(`Newly Compiled:             ${successCount}`);
console.log(`Failed:                     ${failCount}`);
if (failures.length > 0) {
  console.log('Failures:', failures);
}
console.log(`========================================`);
