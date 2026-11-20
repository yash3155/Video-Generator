/* Template id -> React component. composite_layout renders two nestable templates side by side or stacked (Level 2). */
import React from "react";
import type { CompositeLayoutData, TemplateId } from "./schemas";
import { ChatStory, TugOfWar, ProgressiveCards, SplitComparison, CausalChain, DiagramFlow, ConceptClarification, Roadmap } from "./narrative";
import { FormulaBreakdown, WorkedExample, DataChart, StatCounter, TableCompare } from "./math";
import { InteractiveQuiz, SummaryThread } from "./assessment";
import { Ctx, useRc } from "../components/ui";

// Each component receives its own validated data type; the map erases it after normalizeTemplateData checked it.
type AnyTemplate = React.FC<{ data: never }>;

export const Composite: React.FC<{ data: CompositeLayoutData }> = ({ data }) => {
  const rc = useRc();
  const side = data.arrangement === "side_by_side";
  return (
    <div style={{ display: "flex", flexDirection: side ? "row" : "column", gap: rc.theme.space.gap, height: "100%" }}>
      {data.panels.map((p, i) => {
        const C = TEMPLATE_COMPONENTS[p.template] as AnyTemplate;
        return (
          <div key={i} style={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative", paddingLeft: side && i ? rc.theme.space.gap : 0, borderLeft: side && i ? `2px solid ${rc.theme.colors.border}` : "none" }}>
            <Ctx.Provider value={{ ...rc, scope: `${rc.scope}.p${i}`, size: "half" }}>
              <C data={p.data as never} />
            </Ctx.Provider>
          </div>
        );
      })}
    </div>
  );
};

export const TEMPLATE_COMPONENTS: Record<TemplateId, AnyTemplate> = {
  chat_story: ChatStory as AnyTemplate,
  tug_of_war: TugOfWar as AnyTemplate,
  progressive_cards: ProgressiveCards as AnyTemplate,
  split_comparison: SplitComparison as AnyTemplate,
  formula_breakdown: FormulaBreakdown as AnyTemplate,
  causal_chain: CausalChain as AnyTemplate,
  diagram_flow: DiagramFlow as AnyTemplate,
  data_chart: DataChart as AnyTemplate,
  stat_counter: StatCounter as AnyTemplate,
  table_compare: TableCompare as AnyTemplate,
  concept_clarification: ConceptClarification as AnyTemplate,
  worked_example: WorkedExample as AnyTemplate,
  interactive_quiz: InteractiveQuiz as AnyTemplate,
  summary_thread: SummaryThread as AnyTemplate,
  roadmap: Roadmap as AnyTemplate,
  composite_layout: Composite as AnyTemplate,
};
