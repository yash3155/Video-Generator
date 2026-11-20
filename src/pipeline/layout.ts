/* Scene layouts per part kind (SCENE_STRUCTURE and ORIENTATION_AND_SYNTHESIS standards): scene count, fixed scenes, templates and beat counts. */
import type { PartKind } from "../schemas/course";
import type { TemplateId } from "../remotion/templates/schemas";

export interface KindLayout {
  kind: PartKind;
  sceneCount: number;
  hook: number;
  quiz: number;
  summary: number;
  /** Templates that are fixed for a scene index. */
  fixedTemplates: Record<number, TemplateId>;
  /** Beat counts that are fixed for a scene index. */
  beatCounts: Record<number, number>;
  /** One-paragraph scene structure for the lesson-plan prompt. */
  structure: string;
}

const CHAPTER: KindLayout = {
  kind: "chapter_part",
  sceneCount: 12,
  hook: 0,
  quiz: 9,
  summary: 11,
  fixedTemplates: { 0: "chat_story", 9: "interactive_quiz", 11: "summary_thread" },
  beatCounts: { 0: 4, 9: 3, 11: 6 },
  structure:
    "scene 0 problem-first hook (chat_story, 4 beats), 1 tension, 2 pillars, 3 to 8 deep dive (formula, causal chain, worked example, misconception split, chart, statistic as the topology requires), 9 quiz (3 beats), 10 wisdom and bridge with the WHERE WE ARE roadmap, 11 eight-rule summary (6 beats).",
};

const ORIENTATION: KindLayout = {
  kind: "orientation",
  sceneCount: 7,
  hook: 0,
  quiz: 5,
  summary: 6,
  fixedTemplates: { 0: "chat_story", 2: "progressive_cards", 3: "roadmap", 4: "formula_breakdown", 5: "interactive_quiz", 6: "summary_thread" },
  beatCounts: { 0: 4, 5: 3, 6: 6 },
  structure:
    "scene 0 hook and myth (chat_story, 4 beats: the biggest myth about the subject, busted with a fact), 1 why this matters (a real person pays for not knowing), 2 four superpowers the book gives (progressive_cards), 3 the reading journey through the modules and chapters (roadmap), 4 the scariest formula demystified (formula_breakdown), 5 quiz (3 beats), 6 eight reader's commandments (summary_thread, 6 beats).",
};

const SYNTHESIS: KindLayout = {
  kind: "synthesis",
  sceneCount: 5,
  hook: 0,
  quiz: 3,
  summary: 4,
  fixedTemplates: { 1: "table_compare", 3: "interactive_quiz", 4: "summary_thread" },
  beatCounts: { 3: 3, 4: 6 },
  structure:
    "scene 0 the dialectical chain across the chapters (causal_chain or diagram_flow), 1 side-by-side toolkit (table_compare), 2 one worked scenario that needs several chapters' tools (worked_example), 3 quiz (3 beats), 4 eight master laws (summary_thread, 6 beats).",
};

export function kindLayout(kind: PartKind | string | undefined): KindLayout {
  if (kind === "orientation") return ORIENTATION;
  if (kind === "synthesis") return SYNTHESIS;
  return CHAPTER;
}

/** Sentence for the teaching-script prompt describing the fixed scenes. */
export function fixedScenesText(l: KindLayout): string {
  const parts: string[] = [];
  if (l.beatCounts[l.hook]) parts.push(`Scene ${l.hook} has ${l.beatCounts[l.hook]} beats in hook order and never opens with a definition.`);
  parts.push(`Scene ${l.quiz} has exactly 3 beats (question, thinking pause, reveal).`);
  parts.push(`Scene ${l.summary} has exactly 6 beats that name the rule numbers shown ([0,0], [1,2], [3,4], [5,6], [7,8], [1,8]).`);
  return parts.join(" ");
}

export function fixedTemplatesText(l: KindLayout): string {
  return `Fixed templates for this lesson: ${Object.entries(l.fixedTemplates)
    .map(([i, t]) => `scene ${i} uses ${t}`)
    .join(", ")}.`;
}
