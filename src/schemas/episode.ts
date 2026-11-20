import { z } from "zod";
import { BeatId, NarrationText, Speaker } from "./script";
import { PartKind } from "./course";
import { Persona } from "./book";
import {
  ConceptPanel,
  ChatStoryData,
  TugOfWarData,
  ProgressiveCardsData,
  SplitComparisonData,
  FormulaBreakdownData,
  CausalChainData,
  DiagramFlowData,
  DataChartData,
  StatCounterData,
  TableCompareData,
  ConceptClarificationData,
  WorkedExampleData,
  InteractiveQuizData,
  SummaryThreadData,
  RoadmapData,
  CompositeLayoutData,
} from "../remotion/templates/schemas";

export const VisualCue = z.object({
  target: z.string().min(1).describe("element id revealed when the anchor word is spoken"),
  anchor: z.record(z.string(), z.string().min(1)).describe("anchor word per narration language"),
});
export type VisualCue = z.infer<typeof VisualCue>;

export const BeatVisual = z.object({
  show: z.array(z.string()).default([]),
  focus: z.string().optional(),
  range: z.tuple([z.number().int().min(0).max(8), z.number().int().min(0).max(8)]).optional(),
  compact: z.boolean().optional(),
  phase: z.enum(["question", "thinking", "reveal"]).optional(),
  concept: ConceptPanel.optional(),
  hypothetical: z.boolean().optional(),
});
export type BeatVisual = z.infer<typeof BeatVisual>;

export const EpisodeBeat = z.object({
  id: BeatId,
  speaker: Speaker,
  narration: z.record(z.string(), NarrationText),
  onScreenIntent: z.string().min(1),
  sourceFactIds: z.array(z.string()).default([]),
  newTerms: z.array(z.string()).default([]),
  pauseAfterMs: z.number().int().min(0),
  transition: z.boolean().default(false),
  visual: BeatVisual.default({ show: [] }),
  visualCues: z.array(VisualCue).default([]),
});
export type EpisodeBeat = z.infer<typeof EpisodeBeat>;

const sceneBase = {
  id: z.string().regex(/^s\d{2}$/, "scene ids look like s03"),
  index: z.number().int().min(0),
  title: z.string().min(1),
  purpose: z.string().min(1),
  takeaways: z.array(z.string().min(1)).max(3).default([]),
  pedagogicalContinuation: z.boolean().default(false),
  beats: z.array(EpisodeBeat).min(1),
};

export const Scene = z.discriminatedUnion("template", [
  z.object({ ...sceneBase, template: z.literal("chat_story"), data: ChatStoryData }),
  z.object({ ...sceneBase, template: z.literal("tug_of_war"), data: TugOfWarData }),
  z.object({ ...sceneBase, template: z.literal("progressive_cards"), data: ProgressiveCardsData }),
  z.object({ ...sceneBase, template: z.literal("split_comparison"), data: SplitComparisonData }),
  z.object({ ...sceneBase, template: z.literal("formula_breakdown"), data: FormulaBreakdownData }),
  z.object({ ...sceneBase, template: z.literal("causal_chain"), data: CausalChainData }),
  z.object({ ...sceneBase, template: z.literal("diagram_flow"), data: DiagramFlowData }),
  z.object({ ...sceneBase, template: z.literal("data_chart"), data: DataChartData }),
  z.object({ ...sceneBase, template: z.literal("stat_counter"), data: StatCounterData }),
  z.object({ ...sceneBase, template: z.literal("table_compare"), data: TableCompareData }),
  z.object({ ...sceneBase, template: z.literal("concept_clarification"), data: ConceptClarificationData }),
  z.object({ ...sceneBase, template: z.literal("worked_example"), data: WorkedExampleData }),
  z.object({ ...sceneBase, template: z.literal("interactive_quiz"), data: InteractiveQuizData }),
  z.object({ ...sceneBase, template: z.literal("summary_thread"), data: SummaryThreadData }),
  z.object({ ...sceneBase, template: z.literal("roadmap"), data: RoadmapData }),
  z.object({ ...sceneBase, template: z.literal("composite_layout"), data: CompositeLayoutData }),
]);
export type Scene = z.infer<typeof Scene>;

export const Episode = z.object({
  schemaVersion: z.literal(1).default(1),
  bookId: z.string().min(1),
  chapterId: z.string().min(1),
  partId: z.string().min(1),
  kind: PartKind,
  courseTitle: z.string().min(1),
  chapterLabel: z.string().min(1),
  partLabel: z.string().min(1),
  title: z.string().min(1),
  displayLanguage: z.string().min(1),
  languages: z.array(z.string()).min(1),
  personas: z.record(z.string(), z.object({ novice: Persona, mentor: Persona })),
  progress: z.object({ index: z.number().int().min(0), total: z.number().int().min(1) }),
  theme: z.string().default("dark-classroom"),
  provenance: z.object({ mock: z.boolean() }),
  scenes: z.array(Scene).min(1),
});
export type Episode = z.infer<typeof Episode>;

/** What the S9 LLM task returns: per-scene visual content and per-beat visual state; narration comes from S7. */
export const EpisodeFill = z.object({
  scenes: z
    .array(
      z.object({
        index: z.number().int().min(0),
        title: z.string().min(1),
        takeaways: z.array(z.string().min(1)).max(3),
        data: z.record(z.string(), z.unknown()),
        beats: z.array(z.object({ id: BeatId, visual: BeatVisual.default({ show: [] }), visualCues: z.array(VisualCue).default([]) })).min(1),
      }),
    )
    .min(1),
});
export type EpisodeFill = z.infer<typeof EpisodeFill>;
