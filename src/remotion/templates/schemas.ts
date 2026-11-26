import { z } from "zod";
import { Formula } from "../../schemas/common";

/** Rich text: plain string, or a list of text and inline-math segments. LaTeX never lives inside free text. */
export const Segment = z.union([z.object({ type: z.literal("text"), text: z.string().min(1) }), z.object({ type: z.literal("math"), latex: z.string().min(1) })]);
export const RichText = z.union([z.string().min(1), z.array(Segment).min(1)]);
export type RichText = z.infer<typeof RichText>;

const ElId = z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i);

export const ConceptPanel = z.object({
  term: z.string().min(1),
  fullForm: z.string().optional(),
  simpleMeaning: z.string().min(1),
  roleHere: z.string().min(1),
  connectsTo: z.string().optional(),
});
export type ConceptPanel = z.infer<typeof ConceptPanel>;

export const WhereWeAre = z.object({
  label: z.string().min(1).default("WHERE WE ARE"),
  items: z.array(z.string().min(1)).min(2).max(8),
  current: z.number().int().min(0),
});

export const TwoPartyMechanismData = z.object({
  left: z.object({
    role: z.string().min(1),
    color: z.string().default("#59BFC3"),
    obligation: z.string().min(1),
    motivation: z.string().min(1),
  }),
  right: z.object({
    role: z.string().min(1),
    color: z.string().default("#E5C45B"),
    obligation: z.string().min(1),
    motivation: z.string().min(1),
  }),
  contractConduit: z.object({
    title: z.string().min(1).default("Central Contract Conduit"),
    specs: z.string().min(1),
  }),
  causalFailure: z
    .object({
      title: z.string().min(1).default("Causal Failure Callout"),
      breakdown: z.string().min(1),
    })
    .optional(),
});
export type TwoPartyMechanismData = z.infer<typeof TwoPartyMechanismData>;

export const FourPillarFrameworkData = z.object({
  primaryCard: z.object({
    title: z.string().min(1).default("4-Pillar Institutional Framework"),
    pillars: z.array(
      z.object({
        id: ElId.default("p1"),
        title: z.string().min(1),
        description: z.string().min(1),
      })
    ).min(2).max(6),
  }),
  riskPanel: z
    .object({
      title: z.string().min(1).default("Risk Architecture & Controls"),
      architecture: z.string().min(1),
    })
    .optional(),
});
export type FourPillarFrameworkData = z.infer<typeof FourPillarFrameworkData>;

export const TechnicalPanelData = z.object({
  presentation: z.enum(["two_party_mechanism", "single_concept", "structured_cards"]).optional(),
  twoParty: TwoPartyMechanismData.optional(),
  pillars: FourPillarFrameworkData.optional(),
  messages: z.array(z.object({ id: ElId, speaker: z.string().min(1), text: RichText, label: z.string().min(1).optional() })).optional(),
  whereWeAre: WhereWeAre.optional(),
});
export type TechnicalPanelData = z.infer<typeof TechnicalPanelData>;

export const ChatStoryData = z.object({
  messages: z.array(z.object({ id: ElId, speaker: z.string().min(1), text: RichText, label: z.string().min(1).optional() })).min(1).max(6),
  whereWeAre: WhereWeAre.optional(),
  presentation: z.enum(["two_party_mechanism", "single_concept", "structured_cards", "chat_bubbles"]).optional(),
  twoParty: TwoPartyMechanismData.optional(),
  pillars: FourPillarFrameworkData.optional(),
});

export const TugOfWarData = z.object({
  left: z.object({ id: ElId, label: z.string().min(1), points: z.array(z.string().min(1)).min(1).max(3) }),
  right: z.object({ id: ElId, label: z.string().min(1), points: z.array(z.string().min(1)).min(1).max(3) }),
  resolution: z.object({ id: ElId, label: z.string().min(1), text: RichText }),
});

export const ProgressiveCardsData = z.object({
  cards: z.array(z.object({ id: ElId, title: z.string().min(1), body: RichText, icon: z.string().optional() })).min(2).max(6),
});

export const SplitComparisonData = z.object({
  left: z.object({ id: ElId, heading: z.string().min(1), tone: z.enum(["trap", "neutral", "positive"]), points: z.array(RichText).min(1).max(4) }),
  right: z.object({ id: ElId, heading: z.string().min(1), tone: z.enum(["trap", "neutral", "positive"]), points: z.array(RichText).min(1).max(4) }),
  verdict: z.object({ id: ElId, text: RichText }).optional(),
});

export const FormulaBreakdownData = z.object({
  title: z.string().min(1),
  formula: Formula,
  parts: z.array(z.object({ id: ElId, symbolLatex: z.string().min(1), meaning: z.string().min(1), unit: z.string().min(1) })).min(1).max(6),
  note: RichText.optional(),
});

export const CausalChainData = z.object({
  links: z
    .array(z.object({ id: ElId, role: z.enum(["condition", "action", "mechanism", "result", "consequence"]), text: RichText }))
    .min(3)
    .max(5),
});

export const DiagramFlowData = z.object({
  mode: z.enum(["flow", "timeline"]),
  nodes: z.array(z.object({ id: ElId, label: z.string().min(1), sublabel: z.string().optional() })).min(2).max(7),
  edges: z.array(z.object({ from: ElId, to: ElId, label: z.string().optional() })).default([]),
});

export const ChartSeries = z.object({
  id: ElId,
  label: z.string().min(1),
  color: z.enum(["gold", "teal", "green", "coral", "blue", "purple"]).default("teal"),
  points: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
  generator: z
    .object({ expression: z.string().min(1), variable: z.string().min(1), from: z.number(), to: z.number(), step: z.number().positive(), scope: z.record(z.string(), z.number()).default({}) })
    .optional(),
});
export const DataChartData = z.object({
  kind: z.enum(["line", "bar", "area", "scatter", "candlestick"]),
  title: z.string().min(1),
  xAxis: z.object({ label: z.string().min(1), unit: z.string().min(1) }),
  yAxis: z.object({ label: z.string().min(1), unit: z.string().min(1) }),
  series: z.array(ChartSeries).min(1).max(4),
  markers: z.array(z.object({ id: ElId, x: z.number(), y: z.number(), label: z.string().min(1) })).default([]),
  isHypothetical: z.boolean().default(false),
});

export const StatCounterData = z.object({
  stats: z
    .array(
      z.object({
        id: ElId,
        value: z.number(),
        decimals: z.number().int().min(0).max(4).default(0),
        prefix: z.string().optional(),
        suffix: z.string().optional(),
        label: z.string().min(1),
        sublabel: z.string().optional(),
      }),
    )
    .min(1)
    .max(4),
});

export const TableCompareData = z.object({
  columns: z.array(z.string().min(1)).min(2).max(5),
  rows: z.array(z.object({ id: ElId, cells: z.array(z.string().min(1)).min(2).max(5) })).min(1).max(6),
  highlightRowId: z.string().optional(),
});

export const ConceptClarificationData = ConceptPanel.extend({
  id: ElId.default("concept"),
  example: RichText.optional(),
});

export const WorkedExampleData = z.object({
  title: z.string().min(1),
  formula: Formula.optional(),
  given: z.array(z.object({ id: ElId, symbol: z.string().optional(), label: z.string().min(1), value: z.number(), unit: z.string().optional(), display: z.string().min(1) })).min(1).max(5),
  steps: z.array(z.object({ id: ElId, label: z.string().min(1), latex: z.string().min(1), expr: z.string().optional(), value: z.number().optional() })).min(1).max(5),
  result: z.object({ id: ElId, label: z.string().min(1), value: z.number(), unit: z.string().min(1), display: z.string().min(1), rounding: z.number().int().min(0).max(6).default(2) }),
  conclusion: RichText,
  isHypothetical: z.boolean().default(false),
});

export const InteractiveQuizData = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
});

export const SummaryThreadData = z.object({
  title: z.string().min(1),
  rules: z.array(z.object({ id: ElId, title: z.string().min(1), text: z.string().min(1) })).length(8),
});

export const RoadmapData = z.object({
  title: z.string().min(1),
  items: z.array(z.object({ id: ElId, label: z.string().min(1), sublabel: z.string().optional(), status: z.enum(["done", "current", "next"]) })).min(2).max(8),
});

export const NESTABLE = [
  "progressive_cards",
  "split_comparison",
  "formula_breakdown",
  "causal_chain",
  "diagram_flow",
  "data_chart",
  "stat_counter",
  "table_compare",
  "concept_clarification",
  "worked_example",
  "roadmap",
] as const;

export const NestedPanel = z.discriminatedUnion("template", [
  z.object({ template: z.literal("progressive_cards"), data: ProgressiveCardsData }),
  z.object({ template: z.literal("split_comparison"), data: SplitComparisonData }),
  z.object({ template: z.literal("formula_breakdown"), data: FormulaBreakdownData }),
  z.object({ template: z.literal("causal_chain"), data: CausalChainData }),
  z.object({ template: z.literal("diagram_flow"), data: DiagramFlowData }),
  z.object({ template: z.literal("data_chart"), data: DataChartData }),
  z.object({ template: z.literal("stat_counter"), data: StatCounterData }),
  z.object({ template: z.literal("table_compare"), data: TableCompareData }),
  z.object({ template: z.literal("concept_clarification"), data: ConceptClarificationData }),
  z.object({ template: z.literal("worked_example"), data: WorkedExampleData }),
  z.object({ template: z.literal("roadmap"), data: RoadmapData }),
]);

export const CompositeLayoutData = z.object({
  arrangement: z.enum(["side_by_side", "stacked"]),
  panels: z.array(NestedPanel).length(2),
});

export const TEMPLATE_IDS = [
  "chat_story",
  "technical_panel",
  "tug_of_war",
  "progressive_cards",
  "split_comparison",
  "formula_breakdown",
  "causal_chain",
  "diagram_flow",
  "data_chart",
  "stat_counter",
  "table_compare",
  "concept_clarification",
  "worked_example",
  "interactive_quiz",
  "summary_thread",
  "roadmap",
  "composite_layout",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const TEMPLATE_DATA_SCHEMAS = {
  chat_story: ChatStoryData,
  technical_panel: TechnicalPanelData,
  tug_of_war: TugOfWarData,
  progressive_cards: ProgressiveCardsData,
  split_comparison: SplitComparisonData,
  formula_breakdown: FormulaBreakdownData,
  causal_chain: CausalChainData,
  diagram_flow: DiagramFlowData,
  data_chart: DataChartData,
  stat_counter: StatCounterData,
  table_compare: TableCompareData,
  concept_clarification: ConceptClarificationData,
  worked_example: WorkedExampleData,
  interactive_quiz: InteractiveQuizData,
  summary_thread: SummaryThreadData,
  roadmap: RoadmapData,
  composite_layout: CompositeLayoutData,
} as const;

export type ChatStoryData = z.infer<typeof ChatStoryData>;
export type TugOfWarData = z.infer<typeof TugOfWarData>;
export type ProgressiveCardsData = z.infer<typeof ProgressiveCardsData>;
export type SplitComparisonData = z.infer<typeof SplitComparisonData>;
export type FormulaBreakdownData = z.infer<typeof FormulaBreakdownData>;
export type CausalChainData = z.infer<typeof CausalChainData>;
export type DiagramFlowData = z.infer<typeof DiagramFlowData>;
export type DataChartData = z.infer<typeof DataChartData>;
export type StatCounterData = z.infer<typeof StatCounterData>;
export type TableCompareData = z.infer<typeof TableCompareData>;
export type ConceptClarificationData = z.infer<typeof ConceptClarificationData>;
export type WorkedExampleData = z.infer<typeof WorkedExampleData>;
export type InteractiveQuizData = z.infer<typeof InteractiveQuizData>;
export type SummaryThreadData = z.infer<typeof SummaryThreadData>;
export type RoadmapData = z.infer<typeof RoadmapData>;
export type CompositeLayoutData = z.infer<typeof CompositeLayoutData>;
export type NestedPanel = z.infer<typeof NestedPanel>;
