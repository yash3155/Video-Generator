// scripts/batch_compile_murphy_audio.mjs
import { execSync } from 'node:child_process';
import path from 'node:path';

const chapters = [
  'ch05_part1',
  'ch05_part2',
  'ch06_part1',
  'ch06_part2'
];

const course = 'murphy_technical_analysis_en';

console.log(`[BATCH AUDIO] Resuming compilation for the remaining 4 English chapters...`);

for (const ch of chapters) {
  const dir = `src/data/chapters/${course}/${ch}`;
  console.log(`\n>>> Compiling: ${dir}`);
  try {
    execSync(`node scripts/compile_tts_audio.mjs --dir="${dir}"`, {
      stdio: 'inherit'
    });
    console.log(`  [OK] Completed ${course}/${ch}`);
  } catch (err) {
    console.error(`  [FAIL] Error compiling ${course}/${ch}`);
    process.exit(1);
  }
}

console.log(`\n[BATCH AUDIO COMPLETE] All remaining chapters compiled successfully!`);
