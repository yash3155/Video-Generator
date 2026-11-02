// scripts/reorganize_by_book.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const chaptersRoot = path.join(rootDir, 'src', 'data', 'chapters');
const outChaptersRoot = path.join(rootDir, 'out', 'chapters');

const murphyDataDir = path.join(chaptersRoot, 'murphy_technical_analysis');
const hullDataDir = path.join(chaptersRoot, 'hull_derivatives');

const murphyOutDir = path.join(outChaptersRoot, 'murphy_technical_analysis');
const hullOutDir = path.join(outChaptersRoot, 'hull_derivatives');

console.log('======================================================');
console.log('📚 REORGANIZING CHAPTER DATA & VIDEOS BY BOOK');
console.log('======================================================\n');

// 1. Create target book directories
fs.mkdirSync(murphyDataDir, { recursive: true });
fs.mkdirSync(hullDataDir, { recursive: true });
fs.mkdirSync(murphyOutDir, { recursive: true });
fs.mkdirSync(hullOutDir, { recursive: true });

// 2. Reorganize chapter workspaces in src/data/chapters/
const chapterEntries = fs
  .readdirSync(chaptersRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== 'murphy_technical_analysis' && d.name !== 'hull_derivatives')
  .map((d) => d.name);

console.log(`📁 Found ${chapterEntries.length} chapters to organize in src/data/chapters/...\n`);

let murphyChapterCount = 0;
let hullChapterCount = 0;

for (const name of chapterEntries) {
  const srcPath = path.join(chaptersRoot, name);
  const isHull = name.startsWith('hull_') || name.includes('hull');
  const destDir = isHull ? hullDataDir : murphyDataDir;
  const destPath = path.join(destDir, name);

  if (fs.existsSync(destPath)) {
    console.log(`  [SKIP] ${name} already exists in ${path.basename(destDir)}`);
    continue;
  }

  fs.renameSync(srcPath, destPath);
  if (isHull) {
    hullChapterCount++;
    console.log(`  ➔ [HULL]   ${name} -> hull_derivatives/${name}`);
  } else {
    murphyChapterCount++;
    console.log(`  ➔ [MURPHY] ${name} -> murphy_technical_analysis/${name}`);
  }
}

// 3. Reorganize video outputs in out/chapters/
console.log(`\n🎬 Organizing videos in out/chapters/...`);

if (fs.existsSync(outChaptersRoot)) {
  const videoFiles = fs
    .readdirSync(outChaptersRoot, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.mp4'))
    .map((f) => f.name);

  let murphyVideoCount = 0;
  let hullVideoCount = 0;

  for (const vName of videoFiles) {
    const srcVideo = path.join(outChaptersRoot, vName);
    const isHull = vName.startsWith('hull_');
    const destDir = isHull ? hullOutDir : murphyOutDir;
    const destVideo = path.join(destDir, vName);

    if (fs.existsSync(destVideo)) {
      console.log(`  [SKIP] ${vName} already exists in ${path.basename(destDir)}`);
      continue;
    }

    fs.renameSync(srcVideo, destVideo);
    if (isHull) {
      hullVideoCount++;
      console.log(`  ➔ [HULL MP4]   ${vName} -> hull_derivatives/${vName}`);
    } else {
      murphyVideoCount++;
      console.log(`  ➔ [MURPHY MP4] ${vName} -> murphy_technical_analysis/${vName}`);
    }
  }

  // Move rerender_progress.json if present
  const progressFile = path.join(outChaptersRoot, 'rerender_progress.json');
  if (fs.existsSync(progressFile)) {
    fs.copyFileSync(progressFile, path.join(murphyOutDir, 'rerender_progress.json'));
    console.log(`  ➔ [PROGRESS] rerender_progress.json copied to murphy_technical_analysis/`);
  }
}

console.log('\n======================================================');
console.log('🎉 REORGANIZATION SUMMARY:');
console.log(`   - Murphy Chapters: ${murphyChapterCount} moved to src/data/chapters/murphy_technical_analysis/`);
console.log(`   - Hull Chapters:   ${hullChapterCount} moved to src/data/chapters/hull_derivatives/`);
console.log(`   - Murphy Videos:   moved to out/chapters/murphy_technical_analysis/`);
console.log(`   - Hull Videos:     moved to out/chapters/hull_derivatives/`);
console.log('======================================================\n');

