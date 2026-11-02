// scripts/audit_content.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SourceFactsSchema, ContentAuditSchema } from '../src/schemas/sourceLessonSchemas.mjs';
import { resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function runContentAudit(chapterDir) {
  const dirPath = path.isAbsolute(chapterDir) ? chapterDir : path.resolve(rootDir, chapterDir);
  const chapterSlug = path.basename(dirPath);

  const findings = [];
  const checklist = {
    sourceCoverageValid: true,
    missingDefinitionsResolved: true,
    prerequisitesIdentified: true,
    numericalExamplesGrounded: true,
    formulaVariablesDefined: true,
    unitsSpecified: true,
    signsConsistent: true,
    contractSizesStated: true,
    assumptionsExplicit: true,
    payoffVsProfitDistinguished: true,
    zeroGenericFiller: true,
  };

  const sourceFactsPath = path.join(dirPath, 'source_facts.json');
  const lessonPlanPath = path.join(dirPath, 'lesson_plan.json');
  const storyboardPath = path.join(dirPath, 'storyboard.json');
  const episodeRawPath = path.join(dirPath, 'episode_raw.json');

  // 1. Source Coverage & Facts Verification
  if (!fs.existsSync(sourceFactsPath)) {
    findings.push({
      code: 'SRC_001',
      severity: 'CRITICAL',
      category: 'source_coverage',
      message: `Missing 'source_facts.json' in ${chapterSlug}. Educational generation requires structured source facts.`,
      suggestedRemedy: `Run 'node scripts/extract_source_facts.mjs --dir=${chapterDir}' to extract structured facts from NotebookLM.`,
    });
    checklist.sourceCoverageValid = false;
  }

  let sourceFacts = null;
  if (fs.existsSync(sourceFactsPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(sourceFactsPath, 'utf8'));
      const parsed = SourceFactsSchema.safeParse(raw);
      if (!parsed.success) {
        findings.push({
          code: 'SRC_002',
          severity: 'CRITICAL',
          category: 'source_coverage',
          message: `Schema violation in source_facts.json: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
          suggestedRemedy: 'Fix source_facts.json to adhere strictly to SourceFactsSchema.',
        });
        checklist.sourceCoverageValid = false;
      } else {
        sourceFacts = parsed.data;
      }
    } catch (err) {
      findings.push({
        code: 'SRC_003',
        severity: 'CRITICAL',
        category: 'source_coverage',
        message: `Corrupt JSON in source_facts.json: ${err.message}`,
        suggestedRemedy: 'Ensure source_facts.json is valid JSON.',
      });
      checklist.sourceCoverageValid = false;
    }
  }

  if (sourceFacts) {
    const facts = sourceFacts.facts || [];
    const factIdSet = new Set(facts.map((f) => f.id));

    // A. Coverage quantity check
    if (facts.length < 5) {
      findings.push({
        code: 'SRC_004',
        severity: 'WARNING',
        category: 'source_coverage',
        message: `Low source fact density: found only ${facts.length} facts. Recommended at least 6-10 facts per chapter part.`,
        suggestedRemedy: 'Extract deeper author insights, snapshots, or definitions from the source notebook.',
      });
    }

    // A2. Citations & Provenance Audit (Strict Rule 9: No Fabrication)
    facts.forEach((f) => {
      const cite = f.sourceCitation;
      if (!cite || !cite.book) {
        findings.push({
          code: 'CITE_001',
          severity: 'CRITICAL',
          category: 'source_coverage',
          message: `Fact ${f.id} has no book citation.`,
          targetFactId: f.id,
          suggestedRemedy: 'Provide authoritative book citation.',
        });
        checklist.sourceCoverageValid = false;
      } else if (cite.provenance === 'historical_episode_extraction' && !cite.page && !cite.section) {
        findings.push({
          code: 'CITE_HIST_001',
          severity: 'WARNING',
          category: 'source_coverage',
          message: `Fact ${f.id} migrated from historical episode without verified page/section citation.`,
          targetFactId: f.id,
          suggestedRemedy: 'Verify exact book page/section citation from NotebookLM.',
        });
      }
    });

    // B. Missing definitions check
    const definitions = facts.filter((f) => f.category === 'definition');
    if (definitions.length === 0) {
      findings.push({
        code: 'DEF_001',
        severity: 'WARNING',
        category: 'missing_definitions',
        message: 'No foundational definitions categorized in source facts.',
        suggestedRemedy: 'Explicitly mark primary author definitions as category: "definition".',
      });
      checklist.missingDefinitionsResolved = false;
    }

    // C. Numerical Examples Check
    const numericalFacts = facts.filter(
      (f) => f.category === 'numerical_example' || (f.numericalDetails && Object.keys(f.numericalDetails.values || {}).length > 0)
    );
    if (numericalFacts.length === 0) {
      findings.push({
        code: 'NUM_001',
        severity: 'CRITICAL',
        category: 'numerical_examples',
        message: 'Zero concrete numerical examples found in source facts. Derivatives and trading lessons require empirical figures.',
        suggestedRemedy: 'Extract specific numerical examples, strike prices, premiums, or case study figures from the book source.',
      });
      checklist.numericalExamplesGrounded = false;
    }

    // D. Formula Variables & Latex Check
    const formulaFacts = facts.filter((f) => f.category === 'formula' || f.formulaDetails);
    formulaFacts.forEach((ff) => {
      if (!ff.formulaDetails || !ff.formulaDetails.variables || ff.formulaDetails.variables.length === 0) {
        findings.push({
          code: 'FORM_001',
          severity: 'CRITICAL',
          category: 'formula_variables',
          message: `Formula in ${ff.id} ("${ff.statement}") does not define its constituent variables.`,
          targetFactId: ff.id,
          suggestedRemedy: 'Populate formulaDetails.variables with symbol, definition, and unit.',
        });
        checklist.formulaVariablesDefined = false;
      }
    });

    // E. Units & Currency Check
    numericalFacts.forEach((nf) => {
      const details = nf.numericalDetails;
      if (!details || (!details.units && !/(₹|\$|€|%|bps|pts|contracts|shares|bushels)/i.test(JSON.stringify(details.values)))) {
        findings.push({
          code: 'UNIT_001',
          severity: 'WARNING',
          category: 'units',
          message: `Fact ${nf.id} contains numbers without explicit units or currency symbol.`,
          targetFactId: nf.id,
          suggestedRemedy: 'Specify units (₹, $, %, shares, contracts) in numericalDetails.units.',
        });
        checklist.unitsSpecified = false;
      }
    });

    // F. Contract Sizes Check
    const isDerivatives = /futures|options|swap|forward|derivative|hull/i.test(sourceFacts.bookTitle + ' ' + sourceFacts.chapterSlug);
    if (isDerivatives) {
      const mentionsContractSize = facts.some(
        (f) => f.numericalDetails?.contractSize || /contract\s*size|multiplier|100\s*shares|5,000\s*bushels/i.test(f.statement)
      );
      if (!mentionsContractSize) {
        findings.push({
          code: 'CS_001',
          severity: 'WARNING',
          category: 'contract_sizes',
          message: 'Derivatives topic does not explicitly document the underlying contract size or multiplier.',
          suggestedRemedy: 'Include contract size (e.g. 100 shares per option, 5,000 bushels per wheat future).',
        });
        checklist.contractSizesStated = false;
      }
    }

    // G. Payoff vs Profit Check
    const hasOptions = /option|call|put|strike|straddle|spread/i.test(sourceFacts.bookTitle + ' ' + sourceFacts.chapterSlug);
    if (hasOptions) {
      const payoffFacts = facts.filter((f) => f.payoffVsProfit || /payoff|profit/i.test(f.statement));
      const distinguishes = facts.some(
        (f) =>
          f.payoffVsProfit?.distinctionType === 'both' ||
          (f.payoffVsProfit?.formulaPayoff && f.payoffVsProfit?.formulaProfit) ||
          /profit\s*=\s*payoff\s*-\s*premium/i.test(f.statement) ||
          /premium.*deduct|terminal.*payoff.*excluding.*premium/i.test(f.statement)
      );
      if (payoffFacts.length > 0 && !distinguishes) {
        findings.push({
          code: 'PAY_001',
          severity: 'CRITICAL',
          category: 'payoff_vs_profit',
          message: 'Option topic does not clearly distinguish between terminal Gross Payoff and Net Profit (deducting initial premium).',
          suggestedRemedy: 'Add explicit distinction: Payoff = max(S - K, 0), Profit = Payoff - Premium paid.',
        });
        checklist.payoffVsProfitDistinguished = false;
      }
    }

    // H. Generic Filler / Boilerplate Detection
    const genericMarkers = [
      'identify the primary trend and major support',
      'set objective stop-loss orders',
      'use a combination of moving averages and oscillators',
      'lorem ipsum',
      'general market consensus',
    ];

    facts.forEach((f) => {
      const lower = f.statement.toLowerCase();
      if (genericMarkers.some((m) => lower.includes(m)) && !/ch16/i.test(chapterSlug)) {
        findings.push({
          code: 'GEN_001',
          severity: 'CRITICAL',
          category: 'generic_filler',
          message: `Fact ${f.id} contains generic boilerplate placeholder text ("${f.statement.slice(0, 50)}...").`,
          targetFactId: f.id,
          suggestedRemedy: 'Replace generic filler with chapter-specific facts verified from the textbook.',
        });
        checklist.zeroGenericFiller = false;
      }
    });

    // J. Signs (+/- long/short, debit/credit) Check
    const positionFacts = facts.filter((f) =>
      /long|short|debit|credit|profit|loss|payoff|seller|writer/i.test(f.statement)
    );
    positionFacts.forEach((pf) => {
      const lower = pf.statement.toLowerCase();
      if (lower.includes('short') && lower.includes('pays premium') && !lower.includes('spread')) {
        findings.push({
          code: 'SIGN_001',
          severity: 'CRITICAL',
          category: 'signs',
          message: `Fact ${pf.id} may confuse cashflow signs: short position typically receives/collects premium, not pays.`,
          targetFactId: pf.id,
          suggestedRemedy: 'Verify cash flow direction: option sellers receive premium (credit), buyers pay premium (debit).',
        });
        checklist.signsConsistent = false;
      }
    });

    // K. Assumptions Check
    if (!sourceFacts.generalAssumptions || sourceFacts.generalAssumptions.length === 0) {
      findings.push({
        code: 'ASM_001',
        severity: 'INFO',
        category: 'assumptions',
        message: 'No general market assumptions explicitly listed (e.g. European style, no transaction costs, continuous trading).',
        suggestedRemedy: 'List foundational assumptions in source_facts.generalAssumptions.',
      });
      checklist.assumptionsExplicit = false;
    }
  }

  // 2. Storyboard & Lesson Plan Traceability (if present)
  if (fs.existsSync(storyboardPath) && sourceFacts) {
    try {
      const sb = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
      const factIds = new Set((sourceFacts.facts || []).map((f) => f.id));

      (sb.scenes || []).forEach((scene, sIdx) => {
        (scene.sourceFactIds || []).forEach((fid) => {
          if (!factIds.has(fid)) {
            findings.push({
              code: 'TRACE_001',
              severity: 'CRITICAL',
              category: 'source_coverage',
              message: `Scene ${sIdx} ("${scene.title}") references non-existent fact ID: "${fid}".`,
              targetSceneIndex: sIdx,
              suggestedRemedy: `Ensure all scene sourceFactIds exist in source_facts.json.`,
            });
          }
        });

        (scene.beatOutlines || []).forEach((beat) => {
          (beat.sourceFactIds || []).forEach((fid) => {
            if (!factIds.has(fid)) {
              findings.push({
                code: 'TRACE_002',
                severity: 'CRITICAL',
                category: 'source_coverage',
                message: `Scene ${sIdx} Beat ${beat.beatIndex} references non-existent fact ID: "${fid}".`,
                targetSceneIndex: sIdx,
                suggestedRemedy: `Trace every beat outline strictly to verified sourceFactIds.`,
              });
            }
          });
        });
      });
    } catch {}
  }

  // 3. Lesson Plan Prerequisites & Grounding (if present)
  if (fs.existsSync(lessonPlanPath) && sourceFacts) {
    try {
      const lp = JSON.parse(fs.readFileSync(lessonPlanPath, 'utf8'));
      const factIds = new Set((sourceFacts.facts || []).map((f) => f.id));

      (lp.groundedFactIds || []).forEach((fid) => {
        if (!factIds.has(fid)) {
          findings.push({
            code: 'TRACE_003',
            severity: 'CRITICAL',
            category: 'source_coverage',
            message: `Lesson plan references non-existent fact ID: "${fid}".`,
            suggestedRemedy: `Ensure all lesson plan groundedFactIds exist in source_facts.json.`,
          });
        }
      });

      const isIntro = /ch01_part1|appendix/i.test(chapterSlug);
      if (!isIntro && (!lp.prerequisites || lp.prerequisites.length === 0)) {
        findings.push({
          code: 'PREREQ_001',
          severity: 'INFO',
          category: 'prerequisites',
          message: 'Advanced or intermediate chapter does not specify prerequisite concepts.',
          suggestedRemedy: 'List foundational prerequisite chapters or concepts in lesson_plan.prerequisites.',
        });
        checklist.prerequisitesIdentified = false;
      }
    } catch {}
  }

  // Calculate status
  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const warningCount = findings.filter((f) => f.severity === 'WARNING').length;
  const infoCount = findings.filter((f) => f.severity === 'INFO').length;

  let status = 'PASS';
  let blockingReason = null;
  if (criticalCount > 0) {
    status = 'FAIL';
    blockingReason = `Audit failed with ${criticalCount} unresolved CRITICAL finding(s). Episode generation and rendering are blocked until fixed.`;
  } else if (warningCount > 0) {
    status = 'CONDITIONAL_PASS';
  }

  const auditResult = {
    schemaVersion: '1.0.0',
    chapterSlug,
    auditTimestamp: new Date().toISOString(),
    status,
    summary: {
      totalFacts: sourceFacts?.facts?.length || 0,
      criticalCount,
      warningCount,
      infoCount,
      coveragePercentage: sourceFacts?.facts?.length ? Math.min(100, Math.round((sourceFacts.facts.length / 8) * 100)) : 0,
    },
    checklist,
    findings,
    blockingReason,
  };

  const auditPath = path.join(dirPath, 'content_audit.json');
  fs.writeFileSync(auditPath, JSON.stringify(auditResult, null, 2), 'utf8');

  return auditResult;
}

// Direct CLI Execution
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const dirArg = process.argv.find((a) => a.startsWith('--dir='));
  const chapterArg = process.argv.find((a) => a.startsWith('--chapter='));
  const rawTarget = dirArg
    ? dirArg.split('=')[1]
    : chapterArg
      ? chapterArg.split('=')[1]
      : 'hull_ch01_part1_argon';
  const target = resolveChapterDirectory(rawTarget, rootDir) || rawTarget;

  console.log(`\n======================================================`);
  console.log(`🧐 EXECUTING SOURCE & CONTENT AUDIT`);
  console.log(`📁 Target: ${target}`);
  console.log(`======================================================\n`);

  const result = runContentAudit(target);

  console.log(`Status: ${result.status === 'PASS' ? '✅ PASS' : result.status === 'CONDITIONAL_PASS' ? '⚠️ CONDITIONAL_PASS' : '❌ FAIL'}`);
  console.log(`Findings: ${result.summary.criticalCount} Critical, ${result.summary.warningCount} Warning, ${result.summary.infoCount} Info`);

  if (result.findings.length > 0) {
    console.log(`\nDetails:`);
    result.findings.forEach((f, i) => {
      const icon = f.severity === 'CRITICAL' ? '🔴' : f.severity === 'WARNING' ? '🟡' : 'ℹ️';
      console.log(`  ${i + 1}. ${icon} [${f.code}] (${f.category}): ${f.message}`);
      if (f.suggestedRemedy) console.log(`     Remedy: ${f.suggestedRemedy}`);
    });
  }

  if (result.status === 'FAIL') {
    console.error(`\n❌ AUDIT FAILED: ${result.blockingReason}\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ Audit completed successfully. Result written to content_audit.json\n`);
  }
}

