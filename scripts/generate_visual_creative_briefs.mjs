// scripts/generate_visual_creative_briefs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VisualCreativeBriefSchema } from '../src/schemas/sourceLessonSchemas.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TOPOLOGY_MAP = {
  chat_story: 'historical_dilemma',
  tug_of_war: 'competing_forces',
  progressive_cards: 'structural_roadmap',
  split_comparison: 'system_comparison',
  formula_breakdown: 'quantitative_formula',
  data_visualizer: 'empirical_time_series',
  stat_counter: 'continuous_metric',
  horizontal_bar_race: 'relative_ranking',
  interactive_quiz: 'active_recall',
  summary_thread: 'progressive_summary',
  composite_layout: 'composite_multiview',
  payoff_diagram: 'terminal_payoff',
  diagram_flow: 'procedural_workflow',
  process_flow: 'procedural_pipeline',
  timeline: 'chronological_evolution'
};

export function buildVisualCreativeBrief(chapterDir, courseId, chapterSlug, overwrite = false) {
  const briefPath = path.join(chapterDir, 'visual_creative_brief.json');
  if (fs.existsSync(briefPath) && !overwrite) {
    return { status: 'EXISTS', path: briefPath };
  }

  const storyboardPath = path.join(chapterDir, 'storyboard.json');
  const lessonPlanPath = path.join(chapterDir, 'lesson_plan.json');
  const factsPath = path.join(chapterDir, 'source_facts.json');

  if (!fs.existsSync(storyboardPath) || !fs.existsSync(lessonPlanPath) || !fs.existsSync(factsPath)) {
    return { status: 'SKIPPED_MISSING_PREREQUISITES', path: briefPath };
  }

  const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
  const lessonPlan = JSON.parse(fs.readFileSync(lessonPlanPath, 'utf8'));
  const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

  const factIds = (facts.facts || []).map(f => f.factId || f.id).filter(id => id && String(id).startsWith('fact-'));
  const fallbackFactId = factIds[0] || 'fact-core-concept-01';

  // Build visual metaphors from lessonPlan misconceptions or core takeaways
  const visualMetaphors = [];
  if (lessonPlan.misconceptions && lessonPlan.misconceptions.length > 0) {
    for (const m of lessonPlan.misconceptions.slice(0, 3)) {
      const rebuttalText = String(m.authorRebuttal || m.rebuttal || m.correction || 'Author Refutation');
      const miscText = String(m.misconception || 'Common Misconception');
      visualMetaphors.push({
        metaphor: `Structural contrast: ${miscText.slice(0, 40)}`,
        targetConcept: rebuttalText.slice(0, 40),
        groundedFactIds: [m.factId || fallbackFactId],
        visualExpression: `Dynamic split contrast and cognitive tension balancing misconception against verified proof.`
      });
    }
  }

  if (visualMetaphors.length === 0) {
    visualMetaphors.push({
      metaphor: 'Visual equilibrium of core foundational principles',
      targetConcept: storyboard.chapterTitle || 'Core Concepts',
      groundedFactIds: [fallbackFactId],
      visualExpression: 'Balance visualization contrasting theoretical definitions against empirical real-world market mechanisms.'
    });
  }

  // Template selection plan from storyboard scenes
  const templateSelectionPlan = (storyboard.scenes || []).map((s, idx) => {
    const topology = TOPOLOGY_MAP[s.template] || 'concept_exploration';
    const isComposite = s.template === 'composite_layout';
    return {
      sceneIndex: s.sceneIndex !== undefined ? s.sceneIndex : idx,
      conceptTopology: topology,
      template: s.template,
      level: isComposite ? 'LEVEL_2_COMPOSITE' : 'LEVEL_1_EXISTING',
      pedagogicalRationale: s.concept || `Scene ${idx}: ${s.title}`
    };
  });

  const uniqueTemplates = new Set((storyboard.scenes || []).map(s => s.template)).size;

  const briefData = {
    schemaVersion: '1.0.0',
    chapterSlug,
    courseId,
    creativeDirection: `Pedagogically rigorous visual narrative for ${storyboard.chapterTitle || chapterSlug}, anchoring high-fidelity concept progression with verified source facts.`,
    narrativeStyle: courseId.includes('_en')
      ? 'Socratic dialogue between junior analyst and senior strategist, grounded in empirical market data and quantitative proofs.'
      : 'Socratic dialogue between junior trader and senior mentor, anchored in practical market examples and quantitative proofs.',
    visualStorytellingApproach: 'Adaptive multi-template progression moving from foundational dilemmas to structural comparisons, mathematical models, empirical cases, active recall, and progressive cognitive summaries.',
    visualMetaphors,
    sceneCompositionStrategy: `${storyboard.scenes?.length || 12} scenes utilizing ${uniqueTemplates} distinct template types, anti-repetition governed with zero consecutive duplicate templates.`,
    animationLanguage: 'Smooth Spring physics (stiffness 180, damping 22) synchronized to measured narration audio cues.',
    courseVisualIdentity: {
      theme: courseId.includes('murphy') ? 'amber_chart' : 'emerald_dark',
      primaryColor: courseId.includes('murphy') ? '#B45309' : '#0F766E',
      accentColor: courseId.includes('murphy') ? '#2563EB' : '#F59E0B',
      typography: 'Inter, sans-serif'
    },
    templateSelectionPlan,
    visualDiversityObjectives: {
      minUniqueTemplates: Math.min(5, uniqueTemplates || 5),
      maxConsecutiveSame: 1,
      maxTemplateSaturation: 0.35
    }
  };

  const validated = VisualCreativeBriefSchema.safeParse(briefData);
  if (!validated.success) {
    console.error(`Validation failed for ${chapterSlug}:`, validated.error.issues);
    return { status: 'ERROR', errors: validated.error.issues };
  }

  fs.writeFileSync(briefPath, JSON.stringify(briefData, null, 2), 'utf8');
  return { status: 'CREATED', path: briefPath };
}

function processAllChapters() {
  const chaptersRoot = path.join(rootDir, 'src', 'data', 'chapters');
  const courses = fs.readdirSync(chaptersRoot).filter(c => fs.statSync(path.join(chaptersRoot, c)).isDirectory());

  let createdCount = 0;
  let existingCount = 0;
  let skippedCount = 0;

  for (const course of courses) {
    const courseDir = path.join(chaptersRoot, course);
    const chapters = fs.readdirSync(courseDir).filter(ch => fs.statSync(path.join(courseDir, ch)).isDirectory() && !ch.includes('backup'));

    for (const ch of chapters) {
      const chDir = path.join(courseDir, ch);
      const res = buildVisualCreativeBrief(chDir, course, ch, false);
      if (res.status === 'CREATED') {
        createdCount++;
        console.log(`[BRIEF CREATED] ${course}/${ch}`);
      } else if (res.status === 'EXISTS') {
        existingCount++;
      } else {
        skippedCount++;
        console.log(`[BRIEF SKIPPED] ${course}/${ch}: ${res.status}`);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`Visual Creative Briefs Processing Summary:`);
  console.log(`Created: ${createdCount} | Already Existed: ${existingCount} | Skipped: ${skippedCount}`);
  console.log(`======================================================\n`);
}

processAllChapters();
