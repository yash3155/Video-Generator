// scripts/validate_bilingual_alignment.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function validateBilingualPair(courseBase, chapterSlug) {
  const hiDir = path.join(rootDir, 'src/data/chapters', courseBase, chapterSlug);
  const enDir = path.join(rootDir, 'src/data/chapters', `${courseBase}_en`, chapterSlug);

  const report = {
    courseBase,
    chapterSlug,
    hindiExists: fs.existsSync(hiDir),
    englishExists: fs.existsSync(enDir),
    factAlignment: { match: false, hiCount: 0, enCount: 0, sharedFacts: [] },
    sceneAlignment: { match: false, hiSceneCount: 0, enSceneCount: 0, templateParity: true },
    learningObjectiveParity: true,
    assessmentParity: true,
    findings: [],
    status: 'PASS'
  };

  if (!report.hindiExists || !report.englishExists) {
    report.status = 'INCOMPLETE_PAIR';
    report.findings.push(`Missing workspace: Hindi (${report.hindiExists}) | English (${report.englishExists})`);
    return report;
  }

  // 1. Facts comparison
  const hiFactsPath = path.join(hiDir, 'source_facts.json');
  const enFactsPath = path.join(enDir, 'source_facts.json');
  if (fs.existsSync(hiFactsPath) && fs.existsSync(enFactsPath)) {
    const hiFacts = JSON.parse(fs.readFileSync(hiFactsPath, 'utf8'));
    const enFacts = JSON.parse(fs.readFileSync(enFactsPath, 'utf8'));
    const hiIds = new Set((hiFacts.facts || []).map(f => f.factId || f.id));
    const enIds = new Set((enFacts.facts || []).map(f => f.factId || f.id));

    report.factAlignment.hiCount = hiIds.size;
    report.factAlignment.enCount = enIds.size;

    const intersection = [...hiIds].filter(id => enIds.has(id));
    report.factAlignment.sharedFacts = intersection;
    report.factAlignment.match = (intersection.length === hiIds.size && hiIds.size === enIds.size);

    if (!report.factAlignment.match) {
      report.findings.push(`Fact count discrepancy: Hindi has ${hiIds.size}, English has ${enIds.size}`);
    }
  }

  // 2. Storyboard & Scene Parity
  const hiSbPath = path.join(hiDir, 'storyboard.json');
  const enSbPath = path.join(enDir, 'storyboard.json');
  if (fs.existsSync(hiSbPath) && fs.existsSync(enSbPath)) {
    const hiSb = JSON.parse(fs.readFileSync(hiSbPath, 'utf8'));
    const enSb = JSON.parse(fs.readFileSync(enSbPath, 'utf8'));

    const hiScenes = hiSb.scenes || [];
    const enScenes = enSb.scenes || [];

    report.sceneAlignment.hiSceneCount = hiScenes.length;
    report.sceneAlignment.enSceneCount = enScenes.length;

    if (hiScenes.length !== enScenes.length) {
      report.sceneAlignment.match = false;
      report.findings.push(`Scene count mismatch: Hindi has ${hiScenes.length}, English has ${enScenes.length}`);
    } else {
      report.sceneAlignment.match = true;
      for (let i = 0; i < hiScenes.length; i++) {
        if (hiScenes[i].template !== enScenes[i].template) {
          report.sceneAlignment.templateParity = false;
          report.findings.push(`Scene ${i} template mismatch: Hindi=${hiScenes[i].template} vs English=${enScenes[i].template}`);
        }
      }
    }
  }

  // 3. Lesson plan objectives parity
  const hiLpPath = path.join(hiDir, 'lesson_plan.json');
  const enLpPath = path.join(enDir, 'lesson_plan.json');
  if (fs.existsSync(hiLpPath) && fs.existsSync(enLpPath)) {
    const hiLp = JSON.parse(fs.readFileSync(hiLpPath, 'utf8'));
    const enLp = JSON.parse(fs.readFileSync(enLpPath, 'utf8'));

    const hiOutcomes = hiLp.learningOutcomes?.length || 0;
    const enOutcomes = enLp.learningOutcomes?.length || 0;
    if (hiOutcomes !== enOutcomes) {
      report.learningObjectiveParity = false;
      report.findings.push(`Learning outcomes count mismatch: Hindi=${hiOutcomes} vs English=${enOutcomes}`);
    }
  }

  if (report.findings.length > 0) {
    report.status = report.findings.some(f => f.includes('Missing workspace') || f.includes('Scene count mismatch'))
      ? 'FAIL'
      : 'CONDITIONAL_PASS';
  }

  return report;
}

export function validateAllPairs() {
  const chaptersRoot = path.join(rootDir, 'src/data/chapters');
  const hullChapters = fs.readdirSync(path.join(chaptersRoot, 'hull_derivatives'))
    .filter(d => fs.statSync(path.join(chaptersRoot, 'hull_derivatives', d)).isDirectory() && !d.includes('backup'));

  const murphyChapters = fs.readdirSync(path.join(chaptersRoot, 'murphy_technical_analysis'))
    .filter(d => fs.statSync(path.join(chaptersRoot, 'murphy_technical_analysis', d)).isDirectory() && d !== 'test_run' && !d.includes('backup'));

  const allReports = [];

  console.log(`\n======================================================`);
  console.log(`🔎 VALIDATING BILINGUAL FACTUAL & PEDAGOGICAL ALIGNMENT`);
  console.log(`======================================================\n`);

  for (const ch of hullChapters) {
    const rep = validateBilingualPair('hull_derivatives', ch);
    allReports.push(rep);
    console.log(`[hull_derivatives] ${ch.padEnd(16)} -> ${rep.status} (${rep.findings.length} findings)`);
  }

  for (const ch of murphyChapters) {
    const rep = validateBilingualPair('murphy_technical_analysis', ch);
    allReports.push(rep);
    console.log(`[murphy_technical_analysis] ${ch.padEnd(16)} -> ${rep.status} (${rep.findings.length} findings)`);
  }

  let md = `# Bilingual Factual and Pedagogical Alignment Report\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `## Summary\n\n`;
  const passCount = allReports.filter(r => r.status === 'PASS').length;
  const condCount = allReports.filter(r => r.status === 'CONDITIONAL_PASS').length;
  const failCount = allReports.filter(r => r.status === 'FAIL' || r.status === 'INCOMPLETE_PAIR').length;

  md += `- **Total Evaluated Pairs**: ${allReports.length}\n`;
  md += `- **Strict Alignment PASS**: ${passCount}\n`;
  md += `- **Conditional PASS**: ${condCount}\n`;
  md += `- **Incomplete / Discrepancy**: ${failCount}\n\n`;

  md += `## Detailed Alignment Matrix\n\n`;
  md += `| Base Course | Chapter | Facts (HI / EN) | Shared Facts | Scenes (HI / EN) | Template Parity | Status | Findings |\n`;
  md += `| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n`;

  for (const r of allReports) {
    md += `| \`${r.courseBase}\` | \`${r.chapterSlug}\` | ${r.factAlignment.hiCount} / ${r.factAlignment.enCount} | ${r.factAlignment.sharedFacts.length} | ${r.sceneAlignment.hiSceneCount} / ${r.sceneAlignment.enSceneCount} | ${r.sceneAlignment.templateParity ? '✅ Yes' : '❌ No'} | **${r.status}** | ${r.findings.join('; ') || 'None'} |\n`;
  }

  const reportsDir = path.join(rootDir, 'reports/production');
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, 'bilingual_alignment_report.md'), md, 'utf8');
  console.log(`\nBilingual alignment report written to: reports/production/bilingual_alignment_report.md\n`);
}

validateAllPairs();

