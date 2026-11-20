/* Renders one scene at one moment: normalizes the template data, computes the frame chrome and the template body. */
import React, { useMemo } from "react";
import type { BeatVisual } from "../schemas/episode";
import type { TemplateId } from "./templates/schemas";
import { TEMPLATE_COMPONENTS } from "./templates/components";
import { normalizeTemplateData } from "./mappers/normalize";
import { Ctx, type RenderContext } from "./components/ui";
import { LessonFrame, type CaptionWord, type HeaderInfo } from "./layout/Frame";
import type { Reveal } from "./reveal";
import { getTheme } from "../theme/tokens";

export interface SceneViewProps {
  template: TemplateId;
  data: unknown;
  title: string;
  takeaways: string[];
  header: HeaderInfo;
  reveal: Reveal;
  visual: BeatVisual;
  caption: CaptionWord[];
  lang: string;
  themeId?: string;
  names: { novice: string; mentor: string };
}

function isHypothetical(template: TemplateId, data: unknown, visual: BeatVisual): boolean {
  if (visual.hypothetical) return true;
  const d = data as { isHypothetical?: boolean; panels?: { data: { isHypothetical?: boolean } }[] };
  if (template === "composite_layout") return Boolean(d.panels?.some((p) => p.data.isHypothetical));
  return Boolean(d.isHypothetical);
}

export const SceneView: React.FC<SceneViewProps> = (p) => {
  const theme = getTheme(p.themeId);
  const data = useMemo(() => normalizeTemplateData(p.template, p.data), [p.template, p.data]);
  const C = TEMPLATE_COMPONENTS[p.template];
  const rc: RenderContext = { theme, reveal: p.reveal, lang: p.lang, names: p.names, scope: "main", size: p.visual.concept ? "half" : "full" };
  return (
    <Ctx.Provider value={rc}>
      <LessonFrame header={p.header} title={p.title} takeaways={p.takeaways} caption={p.caption} watermark={isHypothetical(p.template, data, p.visual)} concept={p.visual.concept}>
        <C data={data as never} />
      </LessonFrame>
    </Ctx.Provider>
  );
};
