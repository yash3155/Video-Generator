// scripts/run_qa.mjs
import fs from 'node:fs';
import path from 'node:path';
import { runQaEngine } from '../src/qa/qaEngine.mjs';
import { getAllChapterDirectories, resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

const args = process.argv.slice(2);
const rootDir = process.cwd();

const isAll = args.includes('--all');
const allowHigh = args.includes('--allow-high');
const takeScreenshots = args.includes('--screenshots');

const dirArg = args.find((a) => a.startsWith('--dir='));
const chapterArg = args.find((a) => a.startsWith('--chapter='));

async function runSingle(targetDir) {
  console.log(`\n======================================================`);
  console.log(`🛡️ QA RELEASE GATE INSPECTION`);
  console.log(`📁 Target Directory: ${targetDir}`);
  console.log(`⚙️ Options: Allow High = ${allowHigh} | Screenshots = ${takeScreenshots}`);
  console.log(`======================================================\n`);

  const { report, jsonPath, htmlPath } = await runQaEngine({
    targetDir,
    allowHigh,
    takeScreenshots,
    rootDir,
  });

  const { status, summary, metrics, findings } = report;

  console.log(`📋 Chapter: ${report.chapter} (${report.course})`);
  console.log(`📊 Duration: ${(metrics.compiledDurationSec || 0).toFixed(1)}s (${metrics.totalFrames} frames)`);
  console.log(`⏱️ Duration Drift: ${metrics.durationDriftMs}ms`);
  console.log(`🎙️ Audio Assets: ${metrics.audioFilesPresent} / ${metrics.totalBeats} present`);
  if (metrics.hasMp4) {
    console.log(`🎬 MP4 Video: ${(metrics.mp4SizeBytes / (1024 * 1024)).toFixed(1)} MB (${metrics.resolution || '1080p'} @ ${metrics.fps || 30}fps, ${metrics.videoCodec}/${metrics.audioCodec})`);
  } else {
    console.log(`🎬 MP4 Video: Pending render`);
  }

  console.log(`\n🔍 Findings Summary:`);
  console.log(`   - BLOCKER: ${summary.blockerCount}`);
  console.log(`   - HIGH:    ${summary.highCount}`);
  console.log(`   - MEDIUM:  ${summary.mediumCount}`);
  console.log(`   - LOW:     ${summary.lowCount}`);

  if (findings.length > 0) {
    console.log(`\n⚠️ Detailed Defects:`);
    findings.forEach((f, idx) => {
      const loc = `${f.sceneIndex !== undefined ? `Scene ${f.sceneIndex}` : ''} ${f.beatId ? `(${f.beatId})` : ''}`.trim();
      console.log(`   ${idx + 1}. [${f.severity}] ${f.category} ${loc ? `at ${loc}` : ''}: ${f.message}`);
      console.log(`      Cause: ${f.cause}`);
      console.log(`      Repair: ${f.suggestedRepair}`);
    });
  }

  console.log(`\n------------------------------------------------------`);
  if (status === 'PASS') {
    console.log(`✅ RESULT: RELEASE GATE PASS (Ready for deployment)`);
  } else if (status === 'CONDITIONAL_PASS') {
    console.log(`⚠️ RESULT: RELEASE GATE CONDITIONAL PASS (Review findings)`);
  } else {
    console.log(`❌ RESULT: RELEASE GATE FAIL (Blockers must be resolved)`);
  }
  console.log(`📄 JSON Report: ${jsonPath}`);
  console.log(`🌐 HTML Report: ${htmlPath}`);
  console.log(`------------------------------------------------------\n`);

  return report;
}

async function runAll() {
  const chaptersRoot = path.join(rootDir, 'src', 'data', 'chapters');
  if (!fs.existsSync(chaptersRoot)) {
    console.error(`Chapters directory not found at: ${chaptersRoot}`);
    process.exit(1);
  }

  const chapterDirs = getAllChapterDirectories(chaptersRoot);

  console.log(`\n======================================================`);
  console.log(`🛡️ QA RELEASE GATE BATCH AUDIT ACROSS ALL CHAPTERS`);
  console.log(`📁 Scanning ${chapterDirs.length} chapter workspaces across books...`);
  console.log(`======================================================\n`);

  const results = [];
  let totalBlockers = 0;
  let totalHighs = 0;
  let totalMediums = 0;
  let totalPass = 0;
  let totalConditional = 0;
  let totalFail = 0;

  for (let i = 0; i < chapterDirs.length; i++) {
    const chapterDir = chapterDirs[i];
    const slug = path.basename(chapterDir);
    const rawPath = path.join(chapterDir, 'episode_raw.json');
    if (!fs.existsSync(rawPath)) continue;

    process.stdout.write(`[${i + 1}/${chapterDirs.length}] Auditing ${slug}... `);

    try {
      const { report } = await runQaEngine({
        targetDir: chapterDir,
        allowHigh,
        takeScreenshots: false, // Fast batch inspection
        rootDir,
      });

      results.push(report);
      totalBlockers += report.summary.blockerCount;
      totalHighs += report.summary.highCount;
      totalMediums += report.summary.mediumCount;

      if (report.status === 'PASS') {
        totalPass++;
        console.log(`✅ PASS`);
      } else if (report.status === 'CONDITIONAL_PASS') {
        totalConditional++;
        console.log(`⚠️ CONDITIONAL PASS (${report.summary.highCount}H, ${report.summary.mediumCount}M)`);
      } else {
        totalFail++;
        console.log(`❌ FAIL (${report.summary.blockerCount}B, ${report.summary.highCount}H)`);
      }
    } catch (err) {
      console.log(`💥 ERROR: ${err.message}`);
      totalFail++;
      results.push({
        chapter: slug,
        course: 'Unknown',
        domain: 'unknown',
        status: 'FAIL',
        summary: { blockerCount: 1, highCount: 0, mediumCount: 0, lowCount: 0 },
        findings: [
          {
            id: 'batch_err',
            category: 'schema_validity',
            severity: 'BLOCKER',
            message: `QA execution exception: ${err.message}`,
            cause: err.stack || err.message,
            suggestedRepair: 'Check chapter files validity.',
          },
        ],
      });
    }
  }

  // Generate markdown batch report
  const mdReportPath = path.join(rootDir, 'reports', 'phase2c_all_chapters_qa_report.md');
  const mdLines = [
    '# Phase 2C — Generic Render QA & Release Gate Batch Audit Report',
    '',
    `**Audit Date:** ${new Date().toISOString()}`,
    `**Total Workspaces Audited:** ${results.length}`,
    `**Status:** PASS: ${totalPass} | CONDITIONAL_PASS: ${totalConditional} | FAIL: ${totalFail}`,
    `**Total Defect Counts:** Blockers: ${totalBlockers} | High: ${totalHighs} | Medium: ${totalMediums}`,
    '',
    '---',
    '',
    '## Chapter Status Summary',
    '',
    '| Chapter Workspace | Status | Blockers | High | Medium | Key Findings & Suggested Repair |',
    '| :--- | :--- | :---: | :---: | :---: | :--- |',
  ];

  results.forEach((r) => {
    const slug = path.basename(r.workspaceDir || r.chapter);
    const keyFinding = r.findings && r.findings.length > 0
      ? `${r.findings[0].message} ➔ Repair: ${r.findings[0].suggestedRepair}`
      : 'All checks passed cleanly';

    const cleanFinding = keyFinding.replace(/\|/g, '\\|').slice(0, 140);
    mdLines.push(
      `| \`${slug}\` | **${r.status}** | ${r.summary?.blockerCount || 0} | ${r.summary?.highCount || 0} | ${r.summary?.mediumCount || 0} | ${cleanFinding} |`
    );
  });

  mdLines.push('', '---', '', '## Detailed Chapter Defect Breakdown', '');

  results.forEach((r) => {
    const slug = path.basename(r.workspaceDir || r.chapter);
    mdLines.push(`### \`${slug}\` — ${r.status}`);
    if (!r.findings || r.findings.length === 0) {
      mdLines.push('Zero defects. Pristine video and source compliance.', '');
      return;
    }

    mdLines.push('| Severity | Category | Location | Finding | Cause | Suggested Repair |');
    mdLines.push('| :--- | :--- | :--- | :--- | :--- | :--- |');

    r.findings.forEach((f) => {
      const loc = `${f.sceneIndex !== undefined ? `Scene ${f.sceneIndex}` : ''} ${f.beatId ? `Beat ${f.beatId}` : ''}`.trim() || 'Workspace';
      mdLines.push(
        `| **${f.severity}** | ${f.category} | ${loc} | ${f.message.replace(/\|/g, '\\|')} | ${f.cause.replace(/\|/g, '\\|')} | ${f.suggestedRepair.replace(/\|/g, '\\|')} |`
      );
    });
    mdLines.push('');
  });

  fs.writeFileSync(mdReportPath, mdLines.join('\n'), 'utf8');

  console.log(`\n======================================================`);
  console.log(`📊 BATCH AUDIT COMPLETE!`);
  console.log(`   - PASS:             ${totalPass}`);
  console.log(`   - CONDITIONAL PASS: ${totalConditional}`);
  console.log(`   - FAIL:             ${totalFail}`);
  console.log(`\n📄 Batch Report Saved to: ${mdReportPath}`);
  console.log(`======================================================\n`);

  if (totalFail > 0 && !allowHigh) {
    process.exit(1);
  }
}

async function main() {
  if (isAll) {
    await runAll();
  } else if (dirArg) {
    const customDir = dirArg.split('=')[1].replace(/"/g, '').trim();
    const rep = await runSingle(customDir);
    if (rep.status === 'FAIL') process.exit(1);
  } else if (chapterArg) {
    const chap = chapterArg.split('=')[1].replace(/"/g, '').trim();
    const resolved = resolveChapterDirectory(chap, rootDir);
    const target = resolved || path.join('src', 'data', 'chapters', chap);
    const rep = await runSingle(target);
    if (rep.status === 'FAIL') process.exit(1);
  } else {
    // Default to src/data or latest chapter
    const rep = await runSingle('src/data');
    if (rep.status === 'FAIL') process.exit(1);
  }
}

main().catch((err) => {
  console.error('[FATAL] QA Release Gate runner failed:', err);
  process.exit(1);
});

