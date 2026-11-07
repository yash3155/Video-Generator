// scripts/generate_data_validation_report.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateChapterLessonArchitecture } from './validate_lesson_architecture.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_ARTIFACTS = [
  'source_facts.json',
  'content_audit.json',
  'lesson_plan.json',
  'visual_creative_brief.json',
  'storyboard.json',
  'episode_raw.json',
  'episode_compiled.json'
];

function inspectChapter(courseId, chapterSlug) {
  const chDir = path.join(rootDir, 'src/data/chapters', courseId, chapterSlug);
  const exists = fs.existsSync(chDir);
  if (!exists) {
    return {
      courseId,
      chapterSlug,
      exists: false,
      presentArtifacts: 0,
      missingArtifacts: REQUIRED_ARTIFACTS,
      lessonArchPass: false,
      episodeRawValid: false,
      audioPresent: false,
      videoPresent: false,
      status: 'MISSING_DIR'
    };
  }

  const missing = REQUIRED_ARTIFACTS.filter(a => !fs.existsSync(path.join(chDir, a)));
  const presentCount = REQUIRED_ARTIFACTS.length - missing.length;

  const archResult = validateChapterLessonArchitecture(chDir);
  const lessonArchPass = archResult.allValid;

  // Check raw validation
  const rawPath = path.join(chDir, 'episode_raw.json');
  let episodeRawValid = false;
  if (fs.existsSync(rawPath)) {
    try {
      JSON.parse(fs.readFileSync(rawPath, 'utf8'));
      episodeRawValid = true;
    } catch {}
  }

  // Audio check
  const pubAudio = path.join(rootDir, 'public/audio', courseId, chapterSlug);
  const locAudio = path.join(chDir, 'audio');
  const audioCount = fs.existsSync(pubAudio) 
    ? fs.readdirSync(pubAudio).filter(f => f.endsWith('.mp3')).length
    : (fs.existsSync(locAudio) ? fs.readdirSync(locAudio).filter(f => f.endsWith('.mp3')).length : 0);

  // Video check
  const videoPath = path.join(rootDir, 'out/chapters', courseId, `${chapterSlug}.mp4`);
  const videoPresent = fs.existsSync(videoPath);

  // QA check
  const qaPath = path.join(rootDir, 'reports/qa', courseId, chapterSlug, 'qa_report.json');
  let qaStatus = 'NO_QA';
  let blockers = 0;
  let highs = 0;
  if (fs.existsSync(qaPath)) {
    try {
      const q = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
      qaStatus = q.status || 'UNKNOWN';
      blockers = q.summary?.blockerCount || 0;
      highs = q.summary?.highCount || 0;
    } catch {}
  }

  let status = 'VALIDATED';
  if (presentCount < 7) status = 'INCOMPLETE_DATA';
  else if (blockers > 0) status = 'QA_BLOCKERS';
  else if (!videoPresent) status = 'RENDER_PENDING';

  return {
    courseId,
    chapterSlug,
    exists: true,
    presentArtifacts: presentCount,
    missingArtifacts: missing,
    lessonArchPass,
    episodeRawValid,
    audioCount,
    videoPresent,
    qaStatus,
    blockers,
    highs,
    status
  };
}

function run() {
  const chaptersRoot = path.join(rootDir, 'src/data/chapters');
  const courses = fs.readdirSync(chaptersRoot).filter(c => {
    return fs.statSync(path.join(chaptersRoot, c)).isDirectory() && !c.includes('backup');
  });

  const allRecords = [];

  for (const c of courses) {
    const chs = fs.readdirSync(path.join(chaptersRoot, c)).filter(ch => {
      return fs.statSync(path.join(chaptersRoot, c, ch)).isDirectory() && ch !== 'test_run' && !ch.includes('backup');
    });

    for (const ch of chs) {
      allRecords.push(inspectChapter(c, ch));
    }
  }

  let md = `# Full Project Course Production Data Validation Report\n\n`;
  md += `**Generated**: ${new Date().toISOString()}  \n`;
  md += `**Scope**: All configured courses and chapter directories in \`src/data/chapters/\`  \n\n`;

  const total = allRecords.length;
  const complete7 = allRecords.filter(r => r.presentArtifacts === 7).length;
  const zeroBlockers = allRecords.filter(r => r.blockers === 0).length;
  const rendered = allRecords.filter(r => r.videoPresent).length;

  md += `## Executive Summary\n\n`;
  md += `- **Total Workspaces Tracked**: ${total}\n`;
  md += `- **7/7 Mandatory Core Artifacts Present**: ${complete7} / ${total} (${((complete7 / total) * 100).toFixed(1)}%)\n`;
  md += `- **Zero Blocker Compliance (Phase 2C Gate)**: ${zeroBlockers} / ${total} (${((zeroBlockers / total) * 100).toFixed(1)}%)\n`;
  md += `- **Rendered MP4 Videos**: ${rendered} / ${total}\n\n`;

  md += `## Validation Ledger by Course\n\n`;

  for (const c of courses) {
    const courseRecords = allRecords.filter(r => r.courseId === c);
    md += `### Course: \`${c}\` (${courseRecords.length} chapters)\n\n`;
    md += `| Chapter | Artifacts (7/7) | Lesson Arch | Raw Schema | Audio Count | MP4 Video | QA Status | Gate Decision |\n`;
    md += `| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

    for (const r of courseRecords) {
      const artBadge = r.presentArtifacts === 7 ? '✅ 7/7' : `⚠️ ${r.presentArtifacts}/7`;
      const archBadge = r.lessonArchPass ? '✅ PASS' : '❌ FAIL';
      const rawBadge = r.episodeRawValid ? '✅ Valid' : '❌ Invalid';
      const vidBadge = r.videoPresent ? '🎬 Yes' : '⏳ Pending';
      let gateBadge = '✅ Release Ready';
      if (r.blockers > 0) gateBadge = `🛑 ${r.blockers} Blockers`;
      else if (r.highs > 0) gateBadge = `⚠️ ${r.highs} Highs`;
      else if (r.qaStatus === 'NO_QA') gateBadge = '⏳ Unrendered';

      md += `| \`${r.chapterSlug}\` | ${artBadge} | ${archBadge} | ${rawBadge} | ${r.audioCount} clips | ${vidBadge} | ${r.qaStatus} | ${gateBadge} |\n`;
    }
    md += `\n`;
  }

  const reportsDir = path.join(rootDir, 'reports/production');
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, 'full_course_data_validation_report.md'), md, 'utf8');
  console.log(`Report written to: reports/production/full_course_data_validation_report.md`);
}

run();
