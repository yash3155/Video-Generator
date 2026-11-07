/**
 * Batch Render Script for Hull Derivatives Chapters
 * Renders chapters sequentially: Hindi first, then English
 * Skips already-rendered chapters unless --force is passed
 * Usage: node scripts/batch_render_hull.mjs [--from=ch05_part2] [--force]
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const force = args.includes('--force');
const fromArg = args.find(a => a.startsWith('--from='))?.split('=')[1];

// All chapters in order
const ALL_CHAPTERS = [
  'ch01_part1', 'ch01_part2',
  'ch02_part1', 'ch02_part2',
  'ch03_part1', 'ch03_part2',
  'ch04_part1', 'ch04_part2',
  'ch05_part1', 'ch05_part2',
  'ch06_part1', 'ch06_part2',
  'ch07_part1', 'ch07_part2',
  'ch08_part1',
];

const COURSES = ['hull_derivatives', 'hull_derivatives_en'];
const RENDER_CMD = (course, chapter) =>
  `npx remotion render src/index.ts EpisodeComposition out/chapters/${course}/${chapter}.mp4 --props=src/data/chapters/${course}/${chapter}/episode_compiled.json --crf=16 --pixel-format=yuv420p`;
const QA_CMD = (course, chapter) =>
  `node scripts/run_qa.mjs --dir=src/data/chapters/${course}/${chapter}`;

function fileExists(p) {
  try { return existsSync(path.join(ROOT, p)); } catch { return false; }
}

function fileSizeMB(p) {
  try { return (statSync(path.join(ROOT, p)).size / 1024 / 1024).toFixed(1); } catch { return 0; }
}

async function runRender(course, chapter) {
  const videoPath = `out/chapters/${course}/${chapter}.mp4`;
  const compiledPath = `src/data/chapters/${course}/${chapter}/episode_compiled.json`;

  if (!fileExists(compiledPath)) {
    console.log(`⚠️  [${course}/${chapter}] No episode_compiled.json — SKIPPING`);
    return false;
  }

  if (fileExists(videoPath) && !force) {
    const sizeMB = fileSizeMB(videoPath);
    console.log(`✅ [${course}/${chapter}] Already rendered (${sizeMB} MB) — SKIPPING`);
    return true;
  }

  console.log(`\n🎬 [${course}/${chapter}] Starting render...`);
  const start = Date.now();
  
  try {
    execSync(RENDER_CMD(course, chapter), {
      cwd: ROOT,
      stdio: 'inherit',
      timeout: 3600000, // 1 hour timeout
    });
    const elapsed = ((Date.now() - start) / 60000).toFixed(1);
    const sizeMB = fileSizeMB(videoPath);
    console.log(`✅ [${course}/${chapter}] Rendered in ${elapsed}m — ${sizeMB} MB`);
    return true;
  } catch (err) {
    console.error(`❌ [${course}/${chapter}] Render FAILED: ${err.message}`);
    return false;
  }
}

async function runQA(course, chapter) {
  console.log(`\n🔍 [${course}/${chapter}] Running QA...`);
  try {
    execSync(QA_CMD(course, chapter), {
      cwd: ROOT,
      stdio: 'inherit',
      timeout: 120000,
    });
    return true;
  } catch (err) {
    console.error(`⚠️  [${course}/${chapter}] QA found issues: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🎯 HULL DERIVATIVES BATCH RENDERER');
  console.log('   Hindi (hull_derivatives) → English (hull_derivatives_en)');
  console.log('='.repeat(60));

  // Find starting index
  let startIdx = 0;
  if (fromArg) {
    startIdx = ALL_CHAPTERS.indexOf(fromArg);
    if (startIdx === -1) {
      console.error(`❌ Chapter '${fromArg}' not found in chapter list`);
      process.exit(1);
    }
    console.log(`📍 Starting from: ${fromArg} (index ${startIdx})`);
  }

  const chaptersToProcess = ALL_CHAPTERS.slice(startIdx);
  const results = [];

  for (const chapter of chaptersToProcess) {
    for (const course of COURSES) {
      const success = await runRender(course, chapter);
      if (success) {
        await runQA(course, chapter);
      }
      results.push({ course, chapter, success });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH RENDER SUMMARY');
  console.log('='.repeat(60));
  let rendered = 0, skipped = 0, failed = 0;
  for (const r of results) {
    const videoPath = `out/chapters/${r.course}/${r.chapter}.mp4`;
    if (r.success) {
      if (fileExists(videoPath)) {
        console.log(`✅ ${r.course}/${r.chapter} — ${fileSizeMB(videoPath)} MB`);
        rendered++;
      } else {
        console.log(`⚠️  ${r.course}/${r.chapter} — Skipped (no compiled episode)`);
        skipped++;
      }
    } else {
      console.log(`❌ ${r.course}/${r.chapter} — FAILED`);
      failed++;
    }
  }
  console.log(`\nTotal: ${rendered} rendered, ${skipped} skipped, ${failed} failed`);
}

main().catch(console.error);

