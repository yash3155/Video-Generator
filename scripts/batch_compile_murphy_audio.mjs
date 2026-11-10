// scripts/batch_compile_murphy_audio.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const courses = ['murphy_technical_analysis', 'murphy_technical_analysis_en'];
const rootDir = process.cwd();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('[BATCH TTS] Starting compilation for Murphy chapters...');
  let total = 0;
  let compiled = 0;
  let skipped = 0;
  let failed = [];

  for (const c of courses) {
    const courseDir = path.join(rootDir, 'src', 'data', 'chapters', c);
    if (!fs.existsSync(courseDir)) continue;
    const chs = fs.readdirSync(courseDir).filter((f) => !f.includes('.') && f !== 'test_run');

    for (const ch of chs) {
      total++;
      const rawPath = path.join(courseDir, ch, 'episode_raw.json');
      const compPath = path.join(courseDir, ch, 'episode_compiled.json');

      if (fs.existsSync(compPath)) {
        const rawMtime = fs.statSync(rawPath).mtimeMs;
        const compMtime = fs.statSync(compPath).mtimeMs;
        if (compMtime >= rawMtime) {
          console.log(`[SKIP ${total}/70] ${c}/${ch} already compiled and up-to-date.`);
          skipped++;
          continue;
        }
      }

      console.log(`\n[COMPILE ${total}/70] Processing ${c}/${ch}...`);
      let success = false;
      let attempts = 0;

      while (!success && attempts < 3) {
        attempts++;
        try {
          execSync(`node scripts/compile_tts_audio.mjs --dir=src/data/chapters/${c}/${ch}`, {
            stdio: 'inherit',
            cwd: rootDir,
          });
          success = true;
          compiled++;
          console.log(`[SUCCESS] Compiled ${c}/${ch}`);
          // Brief breather between chapters
          await sleep(2500);
        } catch (err) {
          console.warn(`[RETRY] Chapter ${c}/${ch} failed on attempt ${attempts}/3: ${err.message}`);
          await sleep(15000 * attempts);
        }
      }

      if (!success) {
        console.error(`[FATAL CHAPTER ERROR] ${c}/${ch} failed after 3 attempts.`);
        failed.push(`${c}/${ch}`);
      }
    }
  }

  console.log('\n========================================');
  console.log(`[BATCH TTS SUMMARY]`);
  console.log(`Total: ${total}`);
  console.log(`Compiled: ${compiled}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.error(`Failed chapters:`, failed);
    process.exit(1);
  }
  console.log('========================================\n');
}

run().catch((e) => {
  console.error('[UNHANDLED FATAL]', e);
  process.exit(1);
});
