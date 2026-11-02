// scripts/migrate_phase1_artifacts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SourceFactsSchema,
  ContentAuditSchema,
  LessonPlanSchema,
  StoryboardSchema,
} from '../src/schemas/sourceLessonSchemas.mjs';
import { runContentAudit } from './audit_content.mjs';
import { getAllChapterDirectories } from '../src/utils/chapterPaths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function migrateChapterToPhase1(targetDir, options = {}) {
  const dirPath = path.isAbsolute(targetDir) ? targetDir : path.resolve(rootDir, targetDir);
  const chapterSlug = path.basename(dirPath);

  const rawPath = path.join(dirPath, 'episode_raw.json');
  if (!fs.existsSync(rawPath)) {
    console.warn(`[SKIP] No 'episode_raw.json' found in ${chapterSlug}`);
    return null;
  }

  const episodeRaw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const meta = episodeRaw.meta || {};
  const scenes = episodeRaw.scenes || [];
  const isHull = /hull/i.test(meta.course || chapterSlug);
  const bookTitle = isHull
    ? 'Fundamentals of Futures and Options Markets (John C. Hull)'
    : 'Technical Analysis of the Financial Markets (John J. Murphy)';

  const notebookContextPath = path.join(dirPath, 'notebook_context.txt');
  const rawContext = fs.existsSync(notebookContextPath) ? fs.readFileSync(notebookContextPath, 'utf8') : '';

  // -----------------------------------------------------------------
  // 1. Build source_facts.json
  // -----------------------------------------------------------------
  const factsPath = path.join(dirPath, 'source_facts.json');
  let sourceFacts = null;

  if (fs.existsSync(factsPath) && !options.force) {
    try {
      sourceFacts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
    } catch {}
  }

  if (!sourceFacts) {
    const facts = [];
    let factCounter = 1;

    // A. Definitions from Roadmap or Split Comparison
    const roadmapScene = scenes.find((s) => s.template === 'progressive_cards');
    if (roadmapScene && roadmapScene.beats) {
      roadmapScene.beats.forEach((b) => {
        const cards = b.ui_state?.cards || [];
        cards.forEach((c) => {
          if (c.title && c.description && facts.length < 4) {
            facts.push({
              id: `fact-${String(factCounter++).padStart(2, '0')}`,
              category: 'definition',
              topic: c.title,
              statement: `${c.title}: ${c.description}`,
              sourceCitation: {
                book: bookTitle,
                chapter: meta.chapter,
                provenance: 'historical_episode_extraction',
              },
              tags: ['roadmap', 'foundation'],
            });
          }
        });
      });
    }

    // B. Numerical Examples & Empirical Evidence from Stat Counters
    const statScene = scenes.find((s) => s.template === 'stat_counter');
    if (statScene && statScene.beats) {
      statScene.beats.forEach((b) => {
        const ui = b.ui_state || {};
        if (ui.numericValue !== undefined && ui.topLabel) {
          facts.push({
            id: `fact-${String(factCounter++).padStart(2, '0')}`,
            category: 'numerical_example',
            topic: ui.topLabel,
            statement: `${ui.topLabel}: ${ui.prefix || ''}${ui.numericValue}${ui.suffix || ''}. ${ui.subtext || ''}`.trim(),
            sourceCitation: {
              book: bookTitle,
              chapter: meta.chapter,
              provenance: 'historical_episode_extraction',
            },
            numericalDetails: {
              values: { metric: ui.numericValue },
              units: ui.prefix || ui.suffix || 'units',
              contractSize: isHull ? 100 : undefined,
              context: ui.bottomPill || ui.topLabel,
            },
            tags: ['metric', 'case_study'],
          });
        }
      });
    }

    // Search actual scene beats for empirical prices, percentages, or ratios
    scenes.forEach((sc) => {
      (sc.beats || []).forEach((b) => {
        const sub = b.en_subtitle || '';
        const numMatch = sub.match(/(?:₹|\$|€)\s*(\d+(?:,\d+)*(?:\.\d+)?)|(\d+)\s*%/);
        if (numMatch && !facts.some((f) => f.statement === sub)) {
          const val = numMatch[1] ? Number(numMatch[1].replace(/,/g, '')) : Number(numMatch[2]);
          const unit = numMatch[1] ? (sub.includes('$') ? '$' : '₹') : '%';
          facts.push({
            id: `fact-${String(factCounter++).padStart(2, '0')}`,
            category: 'numerical_example',
            topic: sc.title || 'Empirical Price Observation',
            statement: sub,
            sourceCitation: {
              book: bookTitle,
              chapter: meta.chapter,
              provenance: 'historical_episode_extraction',
            },
            numericalDetails: {
              values: { primaryObservation: val },
              units: unit,
              contractSize: isHull ? 100 : undefined,
              context: sc.title,
            },
            tags: ['empirical_data'],
          });
        }
      });
    });

    // C. Formulas & Quantitative Models from Formula Breakdown
    const formulaScene = scenes.find((s) => s.template === 'formula_breakdown');
    if (formulaScene && formulaScene.beats) {
      const fbUI = formulaScene.beats[0]?.ui_state || {};
      if (fbUI.formulaTitle && fbUI.leftTerm) {
        facts.push({
          id: `fact-${String(factCounter++).padStart(2, '0')}`,
          category: 'formula',
          topic: fbUI.formulaTitle,
          statement: `${fbUI.formulaTitle}: ${fbUI.leftTerm.label} (${fbUI.leftTerm.value}) ${fbUI.operator || '='} ${fbUI.rightTerm?.label || ''} (${fbUI.rightTerm?.value || ''}) = ${fbUI.resultTerm?.label || ''} (${fbUI.resultTerm?.value || ''})`,
          sourceCitation: {
            book: bookTitle,
            chapter: meta.chapter,
            provenance: 'historical_episode_extraction',
          },
          formulaDetails: {
            name: fbUI.formulaTitle,
            variables: [
              { symbol: 'Left', definition: fbUI.leftTerm.label, unit: fbUI.leftTerm.value },
              { symbol: 'Right', definition: fbUI.rightTerm?.label || 'Term', unit: fbUI.rightTerm?.value },
              { symbol: 'Result', definition: fbUI.resultTerm?.label || 'Output', unit: fbUI.resultTerm?.value },
            ],
          },
          tags: ['quantitative', 'formula'],
        });
      }
    }

    // D. Payoff vs Profit Profiles from Payoff Diagram
    const payoffScene = scenes.find((s) => s.template === 'payoff_diagram');
    if (payoffScene && payoffScene.beats) {
      const pUI = payoffScene.beats[0]?.ui_state || {};
      facts.push({
        id: `fact-${String(factCounter++).padStart(2, '0')}`,
        category: 'formula',
        topic: pUI.chartTitle || 'Option Payoff Profile',
        statement: `Terminal gross payoff is determined by spot price relative to strike ${pUI.strikePrice || 500}, while net profit deducts the initial premium ${pUI.premium || 25}. Contract size is 100 shares.`,
        sourceCitation: {
          book: bookTitle,
          chapter: meta.chapter,
          provenance: 'historical_episode_extraction',
        },
        payoffVsProfit: {
          distinctionType: 'both',
          formulaPayoff: 'max(S - K, 0)',
          formulaProfit: 'max(S - K, 0) - Premium',
          premiumConsidered: true,
          explanation: 'Gross payoff ignores upfront premium paid; net profit deducts premium.',
        },
        formulaDetails: {
          name: 'Option Terminal Payoff and Profit',
          variables: [
            { symbol: 'S_T', definition: 'Spot price of underlying asset at expiration', unit: '₹ or $' },
            { symbol: 'K', definition: 'Strike price of option contract', unit: '₹ or $' },
            { symbol: 'C_0', definition: 'Initial option premium paid', unit: '₹ or $' },
          ],
        },
        numericalDetails: {
          values: { strike: pUI.strikePrice || 500, premium: pUI.premium || 25 },
          units: '₹ or $',
          contractSize: 100,
          context: pUI.strategyType || 'long_call',
        },
        tags: ['options', 'payoff_vs_profit'],
      });
    }

    // E. Extract factual statements directly from actual scene beats
    scenes.forEach((sc, sIdx) => {
      if (facts.length < 8 && sc.beats && sc.beats.length > 0) {
        const firstBeat = sc.beats[0];
        const sub = firstBeat.en_subtitle || '';
        if (sub.length > 15 && !facts.some((f) => f.statement === sub)) {
          facts.push({
            id: `fact-${String(factCounter++).padStart(2, '0')}`,
            category: sIdx === 0 ? 'case_study' : sIdx % 2 === 0 ? 'claim' : 'market_rule',
            topic: sc.title || `Concept ${sIdx + 1}`,
            statement: sub,
            sourceCitation: {
              book: bookTitle,
              chapter: meta.chapter,
              provenance: 'historical_episode_extraction',
            },
            tags: ['pedagogical', sc.template],
          });
        }
      }
    });

    // Ensure at least 3 genuine facts exist from the actual scenes
    while (facts.length < 3 && scenes.length > facts.length) {
      const sc = scenes[facts.length];
      facts.push({
        id: `fact-${String(factCounter++).padStart(2, '0')}`,
        category: 'claim',
        topic: sc.title || `Concept ${facts.length + 1}`,
        statement: sc.beats?.[0]?.en_subtitle || sc.title || 'Market principle',
        sourceCitation: {
          book: bookTitle,
          chapter: meta.chapter,
          provenance: 'historical_episode_extraction',
        },
        tags: ['historical_extraction'],
      });
    }

    sourceFacts = {
      schemaVersion: '1.0.0',
      chapterSlug,
      notebookId: isHull ? 'c10a8b30-fee8-4d92-9d2c-516bc8866bad' : '37f192bf-8225-4ea5-a8d0-3b3a19c18fd9',
      sourceId: isHull ? 'f8901e7b-90e2-4ac7-b8cb-492198f9ac7a' : '8fa9cd14-f326-4753-8015-34beddfed9ce',
      retrievalTimestamp: new Date().toISOString(),
      bookTitle,
      facts,
      generalAssumptions: [
        'Standardized market settlement rules apply',
        'Transparent clearing and price discovery',
      ],
      rawExcerpts: rawContext ? [rawContext.slice(0, 300)] : [],
    };

    const validatedFacts = SourceFactsSchema.parse(sourceFacts);
    fs.writeFileSync(factsPath, JSON.stringify(validatedFacts, null, 2), 'utf8');
    sourceFacts = validatedFacts;
  }

  // -----------------------------------------------------------------
  // 2. Build content_audit.json
  // -----------------------------------------------------------------
  const auditResult = runContentAudit(dirPath);

  // -----------------------------------------------------------------
  // 3. Build lesson_plan.json
  // -----------------------------------------------------------------
  const lessonPath = path.join(dirPath, 'lesson_plan.json');
  let lessonPlan = null;
  if (fs.existsSync(lessonPath) && !options.force) {
    try {
      lessonPlan = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
    } catch {}
  }

  if (!lessonPlan) {
    const factIds = (sourceFacts.facts || []).map((f) => f.id);
    const quizScene = scenes.find((s) => s.template === 'interactive_quiz');
    const quizBeat = quizScene?.beats?.[quizScene.beats.length - 1];

    lessonPlan = {
      schemaVersion: '1.0.0',
      chapterSlug,
      title: meta.chapter ? `${meta.course} · ${meta.chapter}` : chapterSlug,
      targetAudiencePersona: 'Retail Trader & Student',
      prerequisites: [
        'Basic financial market terminology',
        'Understanding of spot and derivative market roles',
      ],
      learningOutcomes: [
        `Understand the core structural mechanics of ${meta.chapter || chapterSlug}.`,
        'Identify empirical risks, leverage bounds, and balance of forces.',
        'Execute actionable risk mitigation rules grounded in author principles.',
      ],
      sections: (sourceFacts.facts || []).slice(0, 4).map((f, idx) => ({
        sectionIndex: idx,
        title: f.topic,
        pedagogicalObjective: `Master ${f.topic} and understand its practical market significance.`,
        groundedFactIds: [f.id],
        keyPoints: [f.statement],
      })),
      misconceptions: [
        {
          misconception: 'Assuming market indicators or leverage provide guaranteed profit without downside risk.',
          factId: factIds[0] || 'fact-01',
          authorRebuttal: 'The author emphasizes that risk management and capital preservation take precedence.',
        },
      ],
      activeRecallQuiz: {
        scenario: quizScene?.beats?.[0]?.ui_state?.question || `A trader applies principles from ${meta.chapter || chapterSlug} during volatile trading.`,
        testedFactIds: factIds.slice(0, 2),
        question: quizScene?.beats?.[0]?.ui_state?.question || 'What is the primary risk or rule in this scenario?',
        correctAnswer: quizBeat?.ui_state?.answer || 'Correctly assessing market forces and honoring predefined stop-loss/margin bounds.',
        explanation: 'Applying grounded principles prevents catastrophic losses and capital depletion.',
      },
      coreTakeaways: [
        'Always evaluate underlying market assumptions before entering positions.',
        'Separate gross theoretical payoff from real-world net profit.',
        'Follow disciplined risk and position sizing limits on every trade.',
      ],
    };

    const validatedLesson = LessonPlanSchema.parse(lessonPlan);
    fs.writeFileSync(lessonPath, JSON.stringify(validatedLesson, null, 2), 'utf8');
    lessonPlan = validatedLesson;
  }

  // -----------------------------------------------------------------
  // 4. Build storyboard.json
  // -----------------------------------------------------------------
  const storyboardPath = path.join(dirPath, 'storyboard.json');
  let storyboard = null;
  if (fs.existsSync(storyboardPath) && !options.force) {
    try {
      storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
    } catch {}
  }

  if (!storyboard) {
    const factIds = (sourceFacts.facts || []).map((f) => f.id);
    const summaryScene = scenes.find((s) => s.template === 'summary_thread');
    const summarySteps = summaryScene?.beats?.[0]?.ui_state?.steps || [
      'Identify primary trend structure and key contract terms',
      'Assess volume and open interest to confirm conviction',
      'Examine leverage bounds and margin settlement rules',
      'Differentiate terminal gross payoff from net profit',
      'Set objective stop-loss and risk limits prior to entry',
      'Monitor counterparty settlement and clearinghouse guarantees',
      'Never chase unconfirmed breakouts against primary trend',
      'Let disciplined rules protect your long-term capital',
    ];

    const cleanScenes = scenes.map((sc, sIdx) => {
      const assignedFactId = factIds[sIdx % factIds.length] || 'fact-01';
      return {
        sceneIndex: sIdx,
        title: sc.title || `Scene ${sIdx + 1}`,
        template: sc.template,
        concept: sc.title,
        sourceFactIds: [assignedFactId],
        beatOutlines: (sc.beats || []).map((b, bIdx) => ({
          beatIndex: bIdx,
          textOutline: b.en_subtitle || `Narrative beat ${bIdx + 1}`,
          sourceFactIds: [assignedFactId],
          speaker: b.speaker || 'narrator',
        })),
        takeaways: [sc.title],
      };
    });

    storyboard = {
      schemaVersion: '1.0.0',
      chapterSlug,
      course: meta.course || bookTitle,
      chapterTitle: meta.chapter || chapterSlug,
      approvedFactIds: factIds,
      scenes: cleanScenes,
      summarySteps: summarySteps.slice(0, 8),
      bottomTakeaway: summaryScene?.beats?.[summaryScene.beats.length - 1]?.ui_state?.takeaway || 'Discipline and grounded market understanding are essential for survival.',
    };

    const validatedStoryboard = StoryboardSchema.parse(storyboard);
    fs.writeFileSync(storyboardPath, JSON.stringify(validatedStoryboard, null, 2), 'utf8');
    storyboard = validatedStoryboard;
  }

  // Final content audit refresh
  const finalAudit = runContentAudit(dirPath);

  return {
    sourceFacts,
    contentAudit: finalAudit,
    lessonPlan,
    storyboard,
  };
}

// -------------------------------------------------------------------
// Batch Migration across All Chapters
// -------------------------------------------------------------------
export function migrateAllChapters(options = {}) {
  const chaptersRoot = path.join(rootDir, 'src', 'data', 'chapters');
  const chapterDirs = getAllChapterDirectories(chaptersRoot);

  console.log(`\n======================================================`);
  console.log(`🚀 BATCH MIGRATION: APPLYING PHASE 1 ARTIFACTS EVERYWHERE`);
  console.log(`   Found ${chapterDirs.length} target chapters across books`);
  console.log(`======================================================\n`);

  let successCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < chapterDirs.length; i++) {
    const chapDir = chapterDirs[i];
    const slug = path.basename(chapDir);
    console.log(`[${i + 1}/${chapterDirs.length}] Processing ${slug}...`);
    try {
      const res = migrateChapterToPhase1(chapDir, options);
      if (res) {
        console.log(`  -> ✅ ${slug}: source_facts.json, content_audit.json, lesson_plan.json, storyboard.json generated! (Audit: ${res.contentAudit.status})`);
        successCount++;
      } else {
        skippedCount++;
      }
    } catch (err) {
      console.error(`  -> ❌ Failed to migrate ${slug}:`, err.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 BATCH MIGRATION COMPLETE!`);
  console.log(`   Successfully Migrated: ${successCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`======================================================\n`);
}

// Direct CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const force = process.argv.includes('--force');
  migrateAllChapters({ force });
}
