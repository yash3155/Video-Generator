/* Template registry metadata (Node-safe; no React). Each template has a Zod data schema, a view-model mapper, animation targets and a fallback (E.3). */
import { z } from "zod";
import { NESTABLE, TEMPLATE_DATA_SCHEMAS, TEMPLATE_IDS, type TemplateId } from "./schemas";
import type { Topology } from "../../schemas/storyboard";

export interface TemplateMeta {
  id: TemplateId;
  title: string;
  description: string;
  /** Element ids that beats can reveal with visual.show / visualCues. */
  animationTargets: string;
  topologies: Topology[];
  nestable: boolean;
  /** Template used when the data cannot be rendered by this one (repair loop, L1/L2 fallback). */
  fallback: TemplateId;
  level: 1 | 2;
}

const META: Record<TemplateId, Omit<TemplateMeta, "id" | "nestable" | "level">> = {
  chat_story: { title: "Chat story", description: "Collegiate masterclass technical panel or structured presentation layout with an optional WHERE WE ARE panel.", animationTargets: "messages[].id", topologies: ["hook", "wisdom"], fallback: "progressive_cards" },
  technical_panel: { title: "Technical panel", description: "Collegiate masterclass presentation layout: two-party economic mechanism or 4-pillar institutional framework.", animationTargets: "twoParty.left, twoParty.right, twoParty.contractConduit, twoParty.causalFailure, pillars.primaryCard", topologies: ["hook", "process", "comparison", "pillars"], fallback: "progressive_cards" },
  tug_of_war: { title: "Tug of war", description: "Two opposing sides with up to 3 points each and a resolution card.", animationTargets: "left.id, right.id, resolution.id", topologies: ["tension", "comparison"], fallback: "split_comparison" },
  progressive_cards: { title: "Progressive cards", description: "2-6 numbered cards revealed one by one.", animationTargets: "cards[].id", topologies: ["pillars", "process"], fallback: "progressive_cards" },
  split_comparison: { title: "Split comparison", description: "Trap vs reality (or any two sides) with tone icons and a verdict.", animationTargets: "left.id, right.id, verdict.id", topologies: ["tension", "comparison"], fallback: "table_compare" },
  formula_breakdown: { title: "Formula breakdown", description: "Hero KaTeX formula with every symbol's meaning and unit.", animationTargets: "parts[].id, formula, note", topologies: ["formula"], fallback: "progressive_cards" },
  causal_chain: { title: "Causal chain", description: "Condition -> action -> mechanism -> result -> consequence.", animationTargets: "links[].id", topologies: ["process"], fallback: "diagram_flow" },
  diagram_flow: { title: "Diagram flow", description: "Nodes and labelled edges, or a timeline.", animationTargets: "nodes[].id", topologies: ["process", "timeline"], fallback: "progressive_cards" },
  data_chart: { title: "Data chart", description: "Line, bar, area or scatter chart with labelled axes and units, curves generated from the formula, key-point markers, ILLUSTRATIVE MODEL watermark for hypothetical data.", animationTargets: "series[].id, markers[].id", topologies: ["quantity_over_time", "statistic"], fallback: "table_compare" },
  stat_counter: { title: "Stat counter", description: "1-4 large numbers that count up, with labels.", animationTargets: "stats[].id", topologies: ["statistic", "quantity_over_time"], fallback: "progressive_cards" },
  table_compare: { title: "Table compare", description: "Up to 5 columns and 6 rows with an optional highlighted row.", animationTargets: "rows[].id", topologies: ["table", "comparison"], fallback: "split_comparison" },
  concept_clarification: { title: "Concept clarification", description: "Term, full form, simple meaning, role here, connection and example.", animationTargets: "id", topologies: ["definition"], fallback: "progressive_cards" },
  worked_example: { title: "Worked example", description: "Formula, given values, stepwise substitution in KaTeX, result and conclusion.", animationTargets: "given[].id, steps[].id, result.id, conclusion", topologies: ["worked_example", "formula"], fallback: "formula_breakdown" },
  interactive_quiz: { title: "Interactive quiz", description: "Question, four options, a thinking timer and the reveal with explanation (phase question/thinking/reveal).", animationTargets: "visual.phase", topologies: ["quiz"], fallback: "interactive_quiz" },
  summary_thread: { title: "Summary thread", description: "Eight numbered rules; beats emphasise ranges and the last beat shows all titles compactly.", animationTargets: "rules[].id, visual.range, visual.compact", topologies: ["summary"], fallback: "progressive_cards" },
  roadmap: { title: "Roadmap", description: "Course or chapter steps marked done, current and next.", animationTargets: "items[].id", topologies: ["roadmap", "timeline"], fallback: "diagram_flow" },
  composite_layout: { title: "Composite layout", description: "Two nestable templates side by side or stacked (Level 2, pure JSON).", animationTargets: "ids of both panels", topologies: ["mixed", "comparison", "worked_example", "quantity_over_time"], fallback: "split_comparison" },
};

export const TEMPLATE_REGISTRY: TemplateMeta[] = TEMPLATE_IDS.map((id) => ({
  id,
  ...META[id],
  nestable: (NESTABLE as readonly string[]).includes(id),
  level: id === "composite_layout" ? 2 : 1,
}));

export function templateMeta(id: string): TemplateMeta | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}

/** JSON Schema of a template's data, for prompts and `openlectern templates --json`. */
export function templateJsonSchema(id: TemplateId): unknown {
  return z.toJSONSchema(TEMPLATE_DATA_SCHEMAS[id], { io: "input", unrepresentable: "any" });
}
