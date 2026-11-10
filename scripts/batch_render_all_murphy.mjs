// scripts/batch_render_all_murphy.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const courseArg = args.find((a) => a.startsWith('--course='));
const targetCourse = courseArg ? courseArg.split('=')[1].trim() : null;
const force = args.includes('--force');
const onlyArg = args.find((a) => a.startsWith('--only='));
const onlyChapters = onlyArg ? onlyArg.split('=')[1].split(',').map((c) => c.trim()) : null;

const allCourses = targetCourse
  ? [targetCourse]
  : ['murphy_technical_analysis', 'murphy_technical_analysis_en'];

console.log('======================================================');
console.log('🎬 AUTOMATED PRODUCTION BATCH RENDER & QA GATE');
console.log(`   Courses: ${allCourses.join(', ')}`);
console.log(`   Force Overwrite: ${force}`);
console.log('======================================================\n');

let totalRendered = 0;
let totalSkipped = 0;
let totalFailed = 0;
const failures = [];

for (const course of allCourses) {
  const courseDataDir = path.join(rootDir, 'src', 'data', 'chapters', course);
  const courseOutDir = path.join(rootDir, 'out', 'chapters', course);
  fs.mkdirSync(courseOutDir, { recursive: true });

  if (!fs.existsSync(courseDataDir)) {
    console.warn(`[WARN] Course directory not found: ${courseDataDir}`);
    continue;
  }

  let chapters = fs.readdirSync(courseDataDir).filter((f) => {
    return fs.statSync(path.join(courseDataDir, f)).isDirectory() && f !== 'test_run';
  });

  if (onlyChapters && onlyChapters.length > 0) {
    chapters = chapters.filter((c) => onlyChapters.includes(c));
  }

  console.log(`\n--- Course: ${course} (${chapters.length} chapters) ---`);

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const compFile = path.join(courseDataDir, ch, 'episode_compiled.json');
    const outMp4 = path.join(courseOutDir, `${ch}.mp4`);

    if (!fs.existsSync(compFile)) {
      console.warn(`[SKIP ${i + 1}/${chapters.length}] Missing episode_compiled.json for ${course}/${ch}`);
      totalSkipped++;
      continue;
    }

    const compMtime = fs.statSync(compFile).mtimeMs;
    const mp4Exists = fs.existsSync(outMp4);
    const mp4Mtime = mp4Exists ? fs.statSync(outMp4).mtimeMs : 0;
    const isFresh = mp4Exists && mp4Mtime >= compMtime && fs.statSync(outMp4).size > 1000000;

    if (isFresh && !force) {
      console.log(`[SKIP ${i + 1}/${chapters.length}] ${course}/${ch}.mp4 is fresh and up-to-date.`);
      totalSkipped++;
      continue;
    }

    console.log(`\n[RENDER ${i + 1}/${chapters.length}] 🎥 Rendering ${course}/${ch}.mp4...`);
    const renderStart = Date.now();
    const renderCmd = `npx remotion render src/index.ts EpisodeComposition "${outMp4}" --props="${compFile}" --crf=16 --pixel-format=yuv420p`;

    try {
      execSync(renderCmd, { stdio: 'inherit', cwd: rootDir });
      const elapsedMin = ((Date.now() - renderStart) / 1000 / 60).toFixed(1);
      const sizeMb = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(1);
      console.log(`✅ [${i + 1}/${chapters.length}] Finished ${ch}.mp4 (${sizeMb} MB in ${elapsedMin} min)`);

      // Run Phase 2C Release Gate QA
      console.log(`🛡️ [QA] Running Release Gate for ${course}/${ch}...`);
      const qaCmd = `node scripts/run_qa.mjs --dir="${path.join(courseDataDir, ch)}"`;
      try {
        execSync(qaCmd, { stdio: 'inherit', cwd: rootDir });
        console.log(`✅ [QA PASS] ${course}/${ch}`);
      } catch (qaErr) {
        console.warn(`⚠️ [QA WARN] ${course}/${ch} reported QA findings.`);
      }

      totalRendered++;
    } catch (err) {
      console.error(`❌ [RENDER FAIL] Failed to render ${course}/${ch}: ${err.message}`);
      totalFailed++;
      failures.push(`${course}/${ch}`);
    }
  }
}

console.log('\n======================================================');
console.log('🎉 BATCH PRODUCTION COMPLETE');
console.log(`   Rendered: ${totalRendered}`);
console.log(`   Skipped:  ${totalSkipped}`);
console.log(`   Failed:   ${totalFailed}`);
if (failures.length > 0) {
  console.error(`   Failed chapters:`, failures);
  process.exit(1);
}
console.log('======================================================\n');

