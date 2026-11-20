/* S9 deterministic scaffold (scenes, templates, beats, narration from S7/S8) and the merge with the LLM's visual fill into 08_episode.json. */
import { Episode, type EpisodeFill } from "../schemas/episode";
import type { PartKind } from "../schemas/course";
import type { Persona } from "../schemas/book";
import type { TeachingScript } from "../schemas/script";
import type { Storyboard, Topology, VisualBrief } from "../schemas/storyboard";
import type { z } from "zod";

export interface ScaffoldMeta {
  bookId: string;
  chapterId: string;
  partId: string;
  kind: PartKind;
  courseTitle: string;
  chapterLabel: string;
  partLabel: string;
  title: string;
  displayLanguage: string;
  languages: string[];
  personas: Record<string, { novice: z.infer<typeof Persona>; mentor: z.infer<typeof Persona> }>;
  progress: { index: number; total: number };
  theme: string;
}

export interface ScaffoldScene {
  index: number;
  id: string;
  template: string;
  purpose: string;
  scriptTitle: string;
  pedagogicalContinuation: boolean;
  topology: Topology;
  visualIntent: string;
  keyElements: string[];
  factIds: string[];
  beats: {
    id: string;
    speaker: "novice" | "mentor" | "narrator";
    narration: Record<string, { display: string; spoken?: string }>;
    onScreenIntent: string;
    visualIntent: string;
    sourceFactIds: string[];
    newTerms: string[];
    pauseAfterMs: number;
    transition: boolean;
  }[];
}

export interface EpisodeScaffold {
  meta: ScaffoldMeta;
  scenes: ScaffoldScene[];
}

export const sceneId = (i: number) => `s${String(i).padStart(2, "0")}`;

/** Default pauses (NARRATION_CRAFT): 260 ms between beats, 450 ms at a scene end, 3200 ms for the quiz thinking beat. */
function defaultPause(isLastInScene: boolean, isThinking: boolean): number {
  if (isThinking) return 3200;
  return isLastInScene ? 450 : 260;
}

export function buildScaffold(meta: ScaffoldMeta, script: TeachingScript, brief: VisualBrief, board: Storyboard, quizIndex: number): EpisodeScaffold {
  const scenes: ScaffoldScene[] = script.scenes.map((s) => {
    const sb = board.scenes.find((x) => x.index === s.index);
    const vb = brief.scenes.find((x) => x.index === s.index);
    if (!sb || !vb) throw new Error(`storyboard or visual brief is missing scene ${s.index}`);
    return {
      index: s.index,
      id: sceneId(s.index),
      template: sb.template,
      purpose: s.purpose,
      scriptTitle: s.title,
      pedagogicalContinuation: sb.pedagogicalContinuation,
      topology: vb.topology,
      visualIntent: vb.visualIntent,
      keyElements: vb.keyElements,
      factIds: vb.factIds,
      beats: s.beats.map((b, i) => {
        const thinking = s.index === quizIndex && i === 1;
        const pause = b.pauseAfterMs ?? defaultPause(i === s.beats.length - 1, thinking);
        return {
          id: b.id,
          speaker: b.speaker,
          narration: Object.fromEntries(meta.languages.map((l) => [l, b.narration[l]])),
          onScreenIntent: b.onScreenIntent,
          visualIntent: sb.beats.find((x) => x.id === b.id)?.visualIntent ?? b.onScreenIntent,
          sourceFactIds: b.sourceFactIds,
          newTerms: b.newTerms,
          pauseAfterMs: thinking ? Math.max(3200, pause) : pause,
          transition: b.transition,
        };
      }),
    };
  });
  return { meta, scenes };
}

export type MergeResult = { ok: true; episode: Episode } | { ok: false; problems: string[] };

export function mergeEpisode(scaffold: EpisodeScaffold, fill: EpisodeFill, mock = false): MergeResult {
  const problems: string[] = [];
  const scenes: unknown[] = [];
  for (const s of scaffold.scenes) {
    const f = fill.scenes.find((x) => x.index === s.index);
    if (!f) {
      problems.push(`scene ${s.index} (${s.template}) has no fill`);
      continue;
    }
    for (const b of f.beats) if (!s.beats.some((x) => x.id === b.id)) problems.push(`scene ${s.index} fill has unknown beat ${b.id}`);
    scenes.push({
      id: s.id,
      index: s.index,
      title: f.title,
      purpose: s.purpose,
      takeaways: f.takeaways,
      pedagogicalContinuation: s.pedagogicalContinuation,
      template: s.template,
      data: f.data,
      beats: s.beats.map((b) => {
        const fb = f.beats.find((x) => x.id === b.id);
        return {
          id: b.id,
          speaker: b.speaker,
          narration: b.narration,
          onScreenIntent: b.onScreenIntent,
          sourceFactIds: b.sourceFactIds,
          newTerms: b.newTerms,
          pauseAfterMs: b.pauseAfterMs,
          transition: b.transition,
          visual: fb?.visual ?? { show: [] },
          visualCues: fb?.visualCues ?? [],
        };
      }),
    });
  }
  for (const f of fill.scenes) if (!scaffold.scenes.some((s) => s.index === f.index)) problems.push(`fill has unknown scene ${f.index}`);
  if (problems.length) return { ok: false, problems };
  const m = scaffold.meta;
  const parsed = Episode.safeParse({ schemaVersion: 1, ...m, provenance: { mock }, scenes });
  if (!parsed.success) return { ok: false, problems: parsed.error.issues.slice(0, 40).map((i) => `schema ${i.path.join(".")}: ${i.message}`) };
  return { ok: true, episode: parsed.data };
}
