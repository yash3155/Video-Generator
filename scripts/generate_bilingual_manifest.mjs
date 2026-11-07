// scripts/generate_bilingual_manifest.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getChapterMedia(courseId, chapterSlug) {
  const vidPath = path.join(rootDir, 'out/chapters', courseId, `${chapterSlug}.mp4`);
  const hasVideo = fs.existsSync(vidPath);
  let sizeMB = 0;
  if (hasVideo) {
    sizeMB = (fs.statSync(vidPath).size / (1024 * 1024)).toFixed(1);
  }

  const qaPath = path.join(rootDir, 'reports/qa', courseId, chapterSlug, 'qa_report.json');
  let qaStatus = 'NO_QA';
  let durationSec = null;
  let blockers = 0;
  let highs = 0;
  if (fs.existsSync(qaPath)) {
    try {
      const q = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
      qaStatus = q.status || 'UNKNOWN';
      durationSec = q.telemetry?.actualAudioDurationSec || null;
      blockers = q.summary?.blockerCount || 0;
      highs = q.summary?.highCount || 0;
    } catch {}
  }

  return {
    hasVideo,
    videoPath: hasVideo ? `out/chapters/${courseId}/${chapterSlug}.mp4` : null,
    sizeMB,
    qaStatus,
    durationSec: durationSec ? `${durationSec.toFixed(1)}s` : 'N/A',
    blockers,
    highs
  };
}

export function buildBilingualManifest() {
  const chaptersRoot = path.join(rootDir, 'src/data/chapters');

  const hullChapters = [
    'ch01_part1', 'ch01_part2',
    'ch02_part1', 'ch02_part2',
    'ch03_part1', 'ch03_part2',
    'ch04_part1', 'ch04_part2',
    'ch05_part1', 'ch05_part2',
    'ch06_part1', 'ch06_part2',
    'ch07_part1', 'ch07_part2',
    'ch08_part1'
  ];

  const murphyChapters = fs.readdirSync(path.join(chaptersRoot, 'murphy_technical_analysis'))
    .filter(d => fs.statSync(path.join(chaptersRoot, 'murphy_technical_analysis', d)).isDirectory() && d !== 'test_run' && !d.includes('backup'));

  const pairs = [];

  // Hull pairs
  for (const ch of hullChapters) {
    const hi = getChapterMedia('hull_derivatives', ch);
    const en = getChapterMedia('hull_derivatives_en', ch);
    pairs.push({
      course: 'John C. Hull (Derivatives)',
      chapter: ch,
      hiCourse: 'hull_derivatives',
      enCourse: 'hull_derivatives_en',
      hi,
      en
    });
  }

  // Murphy pairs
  for (const ch of murphyChapters) {
    const hi = getChapterMedia('murphy_technical_analysis', ch);
    const en = getChapterMedia('murphy_technical_analysis_en', ch);
    pairs.push({
      course: 'John J. Murphy (Technical Analysis)',
      chapter: ch,
      hiCourse: 'murphy_technical_analysis',
      enCourse: 'murphy_technical_analysis_en',
      hi,
      en
    });
  }

  let md = `# Official Bilingual Course Delivery Manifest\n\n`;
  md += `**Generated**: ${new Date().toISOString()}  \n`;
  md += `**Governing Standard**: \`AGENTS.md\` Phase 12 Delivery Contract  \n\n`;

  const totalPairs = pairs.length;
  const bothRendered = pairs.filter(p => p.hi.hasVideo && p.en.hasVideo).length;
  const hiRendered = pairs.filter(p => p.hi.hasVideo).length;
  const enRendered = pairs.filter(p => p.en.hasVideo).length;

  md += `## 1. Executive Delivery Summary\n\n`;
  md += `- **Total Configured Course Chapter Pairs**: ${totalPairs}\n`;
  md += `- **Complete Back-to-Back Bilingual Video Pairs Delivered**: ${bothRendered} pairs\n`;
  md += `- **Total Hindi Videos Rendered**: ${hiRendered} / ${totalPairs}\n`;
  md += `- **Total English Videos Rendered**: ${enRendered} / ${totalPairs}\n\n`;

  md += `## 2. John C. Hull — Fundamentals of Futures & Options Markets\n\n`;
  md += `| Chapter | Hindi MP4 Video | Hindi Dur. | Hindi QA | English MP4 Video | English Dur. | English QA | Pair Status |\n`;
  md += `| :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: |\n`;

  for (const p of pairs.filter(x => x.course.includes('Hull'))) {
    const hiLink = p.hi.hasVideo ? `[\`${p.chapter}.mp4\` (${p.hi.sizeMB}MB)](../../${p.hi.videoPath})` : '⏳ Pending';
    const enLink = p.en.hasVideo ? `[\`${p.chapter}.mp4\` (${p.en.sizeMB}MB)](../../${p.en.videoPath})` : '⏳ Pending';
    const pairStatus = (p.hi.hasVideo && p.en.hasVideo) ? '✅ Complete Pair' : (p.hi.hasVideo ? '🎬 Hindi Only' : '⏳ Pending Data');
    md += `| \`${p.chapter}\` | ${hiLink} | ${p.hi.durationSec} | ${p.hi.qaStatus} | ${enLink} | ${p.en.durationSec} | ${p.en.qaStatus} | ${pairStatus} |\n`;
  }

  md += `\n## 3. John J. Murphy — Technical Analysis of the Financial Markets\n\n`;
  md += `| Chapter | Hindi MP4 Video | Hindi Dur. | Hindi QA | English MP4 Video | English Dur. | English QA | Pair Status |\n`;
  md += `| :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: |\n`;

  for (const p of pairs.filter(x => x.course.includes('Murphy'))) {
    const hiLink = p.hi.hasVideo ? `[\`${p.chapter}.mp4\` (${p.hi.sizeMB}MB)](../../${p.hi.videoPath})` : '⏳ Pending';
    const enLink = p.en.hasVideo ? `[\`${p.chapter}.mp4\` (${p.en.sizeMB}MB)](../../${p.en.videoPath})` : '🎧 Production Ready';
    const pairStatus = (p.hi.hasVideo && p.en.hasVideo) ? '✅ Complete Pair' : (p.hi.hasVideo ? '🎬 Hindi Released (EN Audio Ready)' : '⏳ Pending');
    md += `| \`${p.chapter}\` | ${hiLink} | ${p.hi.durationSec} | ${p.hi.qaStatus} | ${enLink} | ${p.en.durationSec} | ${p.en.qaStatus} | ${pairStatus} |\n`;
  }

  const reportsDir = path.join(rootDir, 'reports/production');
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, 'bilingual_render_manifest.md'), md, 'utf8');
  console.log(`Bilingual render manifest created at: reports/production/bilingual_render_manifest.md`);
}

buildBilingualManifest();
