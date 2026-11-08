// scripts/build_bilingual_inventory.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function checkChapter(courseId, chapterId) {
  const chapterDir = path.join(rootDir, 'src', 'data', 'chapters', courseId, chapterId);
  const exists = fs.existsSync(chapterDir);
  if (!exists) {
    return {
      exists: false,
      missingArtifacts: REQUIRED_ARTIFACTS,
      hasAllArtifacts: false,
      audioCount: 0,
      hasVideo: false,
      qaStatus: 'MISSING',
      driftMs: null,
      blockers: null,
      highs: null,
      durationSec: null
    };
  }

  const missingArtifacts = REQUIRED_ARTIFACTS.filter(a => !fs.existsSync(path.join(chapterDir, a)));
  const hasAllArtifacts = missingArtifacts.length === 0;

  // Audio check
  const publicAudioDir = path.join(rootDir, 'public', 'audio', courseId, chapterId);
  const mirroredAudioDir = path.join(chapterDir, 'audio');
  let audioCount = 0;
  if (fs.existsSync(publicAudioDir)) {
    audioCount = fs.readdirSync(publicAudioDir).filter(f => f.endsWith('.mp3')).length;
  } else if (fs.existsSync(mirroredAudioDir)) {
    audioCount = fs.readdirSync(mirroredAudioDir).filter(f => f.endsWith('.mp3')).length;
  }

  // Video check
  const videoPath = path.join(rootDir, 'out', 'chapters', courseId, `${chapterId}.mp4`);
  const hasVideo = fs.existsSync(videoPath);

  // QA check
  const qaPath = path.join(rootDir, 'reports', 'qa', courseId, chapterId, 'qa_report.json');
  let qaStatus = 'NO_QA';
  let driftMs = null;
  let blockers = null;
  let highs = null;
  let durationSec = null;

  if (fs.existsSync(qaPath)) {
    try {
      const qa = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
      qaStatus = qa.status || 'UNKNOWN';
      driftMs = qa.telemetry?.durationDriftMs ?? null;
      blockers = qa.summary?.blockerCount ?? 0;
      highs = qa.summary?.highCount ?? 0;
      durationSec = qa.telemetry?.actualAudioDurationSec ?? null;
    } catch {}
  }

  return {
    exists: true,
    missingArtifacts,
    hasAllArtifacts,
    audioCount,
    hasVideo,
    qaStatus,
    driftMs,
    blockers,
    highs,
    durationSec
  };
}

async function run() {
  const coursesDir = path.join(rootDir, 'src', 'courses');
  const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.json'));

  const courseConfigs = {};
  for (const cf of courseFiles) {
    const raw = JSON.parse(fs.readFileSync(path.join(coursesDir, cf), 'utf8'));
    courseConfigs[raw.courseId] = raw;
  }

  // Find all chapters in src/data/chapters
  const chaptersRoot = path.join(rootDir, 'src', 'data', 'chapters');
  const courseFolders = fs.readdirSync(chaptersRoot).filter(f => {
    return fs.statSync(path.join(chaptersRoot, f)).isDirectory();
  });

  const inventory = [];

  // 1. Hull Derivatives (Hindi: hull_derivatives, English: hull_derivatives_en)
  const hullHindiChapters = fs.readdirSync(path.join(chaptersRoot, 'hull_derivatives'))
    .filter(d => fs.statSync(path.join(chaptersRoot, 'hull_derivatives', d)).isDirectory() && !d.includes('backup'));

  for (const chId of hullHindiChapters) {
    const hi = checkChapter('hull_derivatives', chId);
    const en = checkChapter('hull_derivatives_en', chId);
    inventory.push({
      baseCourse: 'hull_derivatives',
      chapterId: chId,
      hiCourseId: 'hull_derivatives',
      enCourseId: 'hull_derivatives_en',
      hi,
      en
    });
  }

  // 2. Murphy Technical Analysis (Hindi: murphy_technical_analysis, English: murphy_technical_analysis_en)
  const murphyChapters = fs.readdirSync(path.join(chaptersRoot, 'murphy_technical_analysis'))
    .filter(d => fs.statSync(path.join(chaptersRoot, 'murphy_technical_analysis', d)).isDirectory() && d !== 'test_run');

  for (const chId of murphyChapters) {
    const hi = checkChapter('murphy_technical_analysis', chId);
    const en = checkChapter('murphy_technical_analysis_en', chId);
    inventory.push({
      baseCourse: 'murphy_technical_analysis',
      chapterId: chId,
      hiCourseId: 'murphy_technical_analysis',
      enCourseId: 'murphy_technical_analysis_en',
      hi,
      en
    });
  }

  // 3. Coulling Volume Price Analysis (Hindi: coulling_vpa, English: coulling_vpa_en)
  const vpaRoot = path.join(chaptersRoot, 'coulling_vpa');
  if (fs.existsSync(vpaRoot)) {
    const vpaChapters = fs.readdirSync(vpaRoot)
      .filter(d => fs.statSync(path.join(vpaRoot, d)).isDirectory() && !d.includes('backup'));

    for (const chId of vpaChapters) {
      const hi = checkChapter('coulling_vpa', chId);
      const en = checkChapter('coulling_vpa_en', chId);
      inventory.push({
        baseCourse: 'coulling_vpa',
        chapterId: chId,
        hiCourseId: 'coulling_vpa',
        enCourseId: 'coulling_vpa_en',
        hi,
        en
      });
    }
  }

  // 4. Other configured courses (classical_mechanics, world_history)
  // Check if they have any directories
  for (const cId of ['classical_mechanics', 'world_history']) {
    const p = path.join(chaptersRoot, cId);
    if (fs.existsSync(p)) {
      const chs = fs.readdirSync(p).filter(d => fs.statSync(path.join(p, d)).isDirectory());
      for (const chId of chs) {
        const hi = checkChapter(cId, chId);
        const en = checkChapter(`${cId}_en`, chId);
        inventory.push({
          baseCourse: cId,
          chapterId: chId,
          hiCourseId: cId,
          enCourseId: `${cId}_en`,
          hi,
          en
        });
      }
    }
  }

  // Generate Markdown report
  let md = `# Bilingual Course Production Inventory & Audit Matrix\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `## Executive Summary\n\n`;

  const totalPairs = inventory.length;
  const hullPairs = inventory.filter(i => i.baseCourse === 'hull_derivatives').length;
  const murphyPairs = inventory.filter(i => i.baseCourse === 'murphy_technical_analysis').length;
  const vpaPairs = inventory.filter(i => i.baseCourse === 'coulling_vpa').length;

  const bothCompleteData = inventory.filter(i => i.hi.hasAllArtifacts && i.en.hasAllArtifacts).length;
  const bothRendered = inventory.filter(i => i.hi.hasVideo && i.en.hasVideo).length;
  const isReleaseGatePassed = (item) => item.qaStatus === 'PASS' || item.qaStatus === 'CONDITIONAL_PASS';
  const bothQAPass = inventory.filter(i => isReleaseGatePassed(i.hi) && isReleaseGatePassed(i.en)).length;
  const bothStrictPass = inventory.filter(i => i.hi.qaStatus === 'PASS' && i.en.qaStatus === 'PASS').length;

  md += `- **Total Tracked Chapter Pairs**: ${totalPairs}\n`;
  md += `  - **John C. Hull (Derivatives)**: ${hullPairs} chapters\n`;
  md += `  - **John J. Murphy (Technical Analysis)**: ${murphyPairs} chapters\n`;
  if (vpaPairs > 0) {
    md += `  - **Anna Coulling (Volume Price Analysis)**: ${vpaPairs} chapters\n`;
  }
  md += `- **Bilingual Data Complete (7/7 Artifacts in both Hindi & English)**: ${bothCompleteData} / ${totalPairs}\n`;
  md += `- **Both Videos Rendered**: ${bothRendered} / ${totalPairs}\n`;
  md += `- **Both QA Passed Phase 2C Release Gate (0 Blockers, 0 Highs)**: ${bothQAPass} / ${totalPairs}\n`;
  md += `- **Both QA Strict Clean Pass (0 Defects of Any Severity)**: ${bothStrictPass} / ${totalPairs}\n\n`;

  md += `## Detailed Bilingual Audit Table\n\n`;
  md += `| Base Course | Chapter ID | Hindi Data (7 Artifacts) | Hindi Audio / Video | English Data (7 Artifacts) | English Audio / Video | Bilingual Alignment & QA |\n`;
  md += `| :--- | :--- | :---: | :---: | :---: | :---: | :---: |\n`;

  for (const item of inventory) {
    const hiDataStr = item.hi.hasAllArtifacts 
      ? '✅ Complete (7/7)' 
      : item.hi.exists 
        ? `⚠️ Incomplete (${7 - item.hi.missingArtifacts.length}/7: missing ${item.hi.missingArtifacts.join(', ')})`
        : '❌ Missing Workspace';
    
    const hiMediaStr = `${item.hi.audioCount} audio | ${item.hi.hasVideo ? '🎬 Rendered' : '❌ No Video'}`;

    const enDataStr = item.en.hasAllArtifacts
      ? '✅ Complete (7/7)'
      : item.en.exists
        ? `⚠️ Incomplete (${7 - item.en.missingArtifacts.length}/7: missing ${item.en.missingArtifacts.join(', ')})`
        : '❌ Missing Workspace';

    const enMediaStr = `${item.en.audioCount} audio | ${item.en.hasVideo ? '🎬 Rendered' : '❌ No Video'}`;

    let qaSummary = `HI: ${item.hi.qaStatus} | EN: ${item.en.qaStatus}`;
    if (item.hi.blockers > 0 || item.en.blockers > 0) {
      qaSummary += ` 🛑 (${item.hi.blockers + item.en.blockers} Blockers)`;
    } else if (item.hi.highs > 0 || item.en.highs > 0) {
      qaSummary += ` ⚠️ (${item.hi.highs + item.en.highs} Highs)`;
    } else if (item.hi.qaStatus === 'PASS' && item.en.qaStatus === 'PASS') {
      qaSummary += ` ✅ Release Ready`;
    }

    md += `| \`${item.baseCourse}\` | \`${item.chapterId}\` | ${hiDataStr} | ${hiMediaStr} | ${enDataStr} | ${enMediaStr} | ${qaSummary} |\n`;
  }

  const reportsDir = path.join(rootDir, 'reports', 'production');
  fs.mkdirSync(reportsDir, { recursive: true });
  const outPath = path.join(reportsDir, 'bilingual_course_inventory.md');
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`Bilingual inventory successfully generated at: ${outPath}`);
}

run().catch(console.error);

