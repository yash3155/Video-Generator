// src/schemas/sourceLessonSchemas.mjs
import { z } from 'zod';

// ===================================================================
// 1. Source Facts Schema (source_facts.json)
// ===================================================================
export const SourceFactItemSchema = z.object({
  id: z.string().regex(/^fact-[a-z0-9_-]+$/i, 'Fact ID must match fact-<id> format'),
  category: z.enum([
    'definition',
    'claim',
    'formula',
    'numerical_example',
    'case_study',
    'assumption',
    'market_rule',
  ]),
  topic: z.string().min(3),
  statement: z.string().min(10),
  sourceCitation: z.object({
    book: z.string().min(3),
    chapter: z.string().optional(),
    section: z.string().optional(),
    page: z.union([z.number(), z.string()]).optional(),
    excerpt: z.string().optional(),
    provenance: z
      .enum(['notebooklm_query', 'historical_episode_extraction', 'verified_book_excerpt'])
      .default('notebooklm_query'),
  }),
  formulaDetails: z
    .object({
      name: z.string(),
      latex: z.string().optional(),
      variables: z.array(
        z.object({
          symbol: z.string(),
          definition: z.string(),
          unit: z.string().optional(),
        })
      ),
      assumptions: z.array(z.string()).optional(),
    })
    .optional(),
  numericalDetails: z
    .object({
      values: z.record(z.union([z.number(), z.string()])),
      units: z.string().optional(),
      contractSize: z.union([z.number(), z.string()]).optional(),
      context: z.string(),
    })
    .optional(),
  payoffVsProfit: z
    .object({
      distinctionType: z.enum(['payoff', 'profit', 'both', 'not_applicable']),
      formulaPayoff: z.string().optional(),
      formulaProfit: z.string().optional(),
      premiumConsidered: z.boolean().optional(),
      explanation: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
});

export const SourceFactsSchema = z.object({
  schemaVersion: z.literal('1.0.0').default('1.0.0'),
  chapterSlug: z.string().min(2),
  notebookId: z.string().min(4),
  sourceId: z.string().min(4),
  retrievalTimestamp: z.string().datetime(),
  bookTitle: z.string().min(3),
  facts: z.array(SourceFactItemSchema).min(3, 'At least 3 source facts are required'),
  generalAssumptions: z.array(z.string()).default([]),
  rawExcerpts: z.array(z.string()).optional(),
});

// ===================================================================
// 2. Content Audit Schema (content_audit.json)
// ===================================================================
export const AuditFindingSchema = z.object({
  code: z.string(),
  severity: z.enum(['CRITICAL', 'WARNING', 'INFO']),
  category: z.enum([
    'source_coverage',
    'missing_definitions',
    'prerequisites',
    'numerical_examples',
    'formula_variables',
    'units',
    'signs',
    'contract_sizes',
    'assumptions',
    'payoff_vs_profit',
    'generic_filler',
  ]),
  message: z.string(),
  targetFactId: z.string().optional(),
  targetSceneIndex: z.number().optional(),
  suggestedRemedy: z.string().optional(),
});

export const ContentAuditSchema = z.object({
  schemaVersion: z.literal('1.0.0').default('1.0.0'),
  chapterSlug: z.string().min(2),
  auditTimestamp: z.string().datetime(),
  status: z.enum(['PASS', 'CONDITIONAL_PASS', 'FAIL']),
  summary: z.object({
    totalFacts: z.number().nonnegative(),
    criticalCount: z.number().nonnegative(),
    warningCount: z.number().nonnegative(),
    infoCount: z.number().nonnegative(),
    coveragePercentage: z.number().min(0).max(100),
  }),
  checklist: z.object({
    sourceCoverageValid: z.boolean(),
    missingDefinitionsResolved: z.boolean(),
    prerequisitesIdentified: z.boolean(),
    numericalExamplesGrounded: z.boolean(),
    formulaVariablesDefined: z.boolean(),
    unitsSpecified: z.boolean(),
    signsConsistent: z.boolean(),
    contractSizesStated: z.boolean(),
    assumptionsExplicit: z.boolean(),
    payoffVsProfitDistinguished: z.boolean(),
    zeroGenericFiller: z.boolean(),
  }),
  findings: z.array(AuditFindingSchema),
  blockingReason: z.string().nullable().optional(),
});

// ===================================================================
// 3. Lesson Plan Schema (lesson_plan.json)
// ===================================================================
export const LessonPlanSectionSchema = z.object({
  sectionIndex: z.number().nonnegative(),
  title: z.string().min(3),
  pedagogicalObjective: z.string().min(10),
  groundedFactIds: z.array(z.string().regex(/^fact-/i)).min(1),
  keyPoints: z.array(z.string().min(5)).min(1),
  formulaUsed: z.string().optional(),
  numericalApplication: z.string().optional(),
});

export const LessonPlanSchema = z.object({
  schemaVersion: z.literal('1.0.0').default('1.0.0'),
  chapterSlug: z.string().min(2),
  title: z.string().min(3),
  targetAudiencePersona: z.string().default('Retail Trader & Student'),
  prerequisites: z.array(z.string()).min(1),
  learningOutcomes: z.array(z.string().min(10)).min(3),
  sections: z.array(LessonPlanSectionSchema).min(3),
  misconceptions: z
    .array(
      z.object({
        misconception: z.string(),
        factId: z.string().regex(/^fact-/i),
        authorRebuttal: z.string(),
      })
    )
    .min(1),
  activeRecallQuiz: z.object({
    scenario: z.string().min(20),
    testedFactIds: z.array(z.string().regex(/^fact-/i)).min(1),
    question: z.string().min(10),
    correctAnswer: z.string().min(10),
    explanation: z.string().min(20),
  }),
  coreTakeaways: z.array(z.string().min(10)).min(3),
});

// ===================================================================
// 4. Storyboard Schema (storyboard.json)
// ===================================================================
export const StoryboardBeatOutlineSchema = z.object({
  beatIndex: z.number().nonnegative(),
  textOutline: z.string().min(5),
  sourceFactIds: z.array(z.string().regex(/^fact-/i)).min(1, 'Every factual beat must reference at least one source fact ID'),
  speaker: z.string().default('narrator'),
  visualNote: z.string().optional(),
});

export const StoryboardSceneSchema = z.object({
  sceneIndex: z.number().nonnegative(),
  title: z.string().min(3),
  template: z.enum([
    'chat_story',
    'data_visualizer',
    'tug_of_war',
    'progressive_cards',
    'split_comparison',
    'interactive_quiz',
    'summary_thread',
    'stat_counter',
    'horizontal_bar_race',
    'formula_breakdown',
    'payoff_diagram',
    'diagram_flow',
    'process_flow',
    'timeline',
    'composite_layout',
  ]),
  concept: z.string().min(5),
  sourceFactIds: z.array(z.string().regex(/^fact-/i)).min(1, 'Every scene must trace to source facts'),
  beatOutlines: z.array(StoryboardBeatOutlineSchema).min(1),
  takeaways: z.array(z.string()).optional(),
});

export const StoryboardSchema = z.object({
  schemaVersion: z.literal('1.0.0').default('1.0.0'),
  chapterSlug: z.string().min(2),
  course: z.string().min(3),
  chapterTitle: z.string().min(3),
  approvedFactIds: z.array(z.string().regex(/^fact-/i)).min(3),
  scenes: z.array(StoryboardSceneSchema).min(8, 'Storyboard must contain at least 8 scenes'),
  summarySteps: z.array(z.string().min(10)).min(6).max(8),
  bottomTakeaway: z.string().min(15),
});

// ===================================================================
// 5. Visual Creative Brief Schema (visual_creative_brief.json)
// ===================================================================
export const VisualMetaphorItemSchema = z.object({
  metaphor: z.string().min(5),
  targetConcept: z.string().min(3),
  groundedFactIds: z.array(z.string().regex(/^fact-/i)).min(1),
  visualExpression: z.string().optional(),
});

export const TemplateSelectionPlanItemSchema = z.object({
  sceneIndex: z.number().nonnegative(),
  conceptTopology: z.string().min(3),
  template: z.string().min(3),
  level: z.enum(['LEVEL_1_EXISTING', 'LEVEL_2_COMPOSITE', 'LEVEL_3_NEW_PROPOSAL']).default('LEVEL_1_EXISTING'),
  compositionProps: z.record(z.any()).optional(),
  pedagogicalRationale: z.string().optional(),
});

export const VisualCreativeBriefSchema = z.object({
  schemaVersion: z.literal('1.0.0').default('1.0.0'),
  chapterSlug: z.string().min(2),
  courseId: z.string().min(2),
  creativeDirection: z.string().min(10),
  narrativeStyle: z.string().min(5),
  visualStorytellingApproach: z.string().min(10),
  visualMetaphors: z.array(VisualMetaphorItemSchema).min(1),
  sceneCompositionStrategy: z.string().min(10),
  animationLanguage: z.string().min(5),
  courseVisualIdentity: z
    .object({
      theme: z.string().optional(),
      primaryColor: z.string().optional(),
      accentColor: z.string().optional(),
      typography: z.string().optional(),
    })
    .optional(),
  templateSelectionPlan: z.array(TemplateSelectionPlanItemSchema).min(3),
  visualDiversityObjectives: z.object({
    minUniqueTemplates: z.number().default(5),
    maxConsecutiveSame: z.number().default(1),
    maxTemplateSaturation: z.number().default(0.3),
  }),
});

