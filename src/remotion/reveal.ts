/* Reveal state for one frame: elements appear when a beat lists them in visual.show or when their cue word is spoken (E.4). */
import type { BeatVisual } from "../schemas/episode";

export interface RevealBeat {
  visual: BeatVisual;
  visualCues: { target: string }[];
  /** First frame of the beat, relative to the scene start. */
  startFrame: number;
  /** Cue frames relative to the scene start (from the compiled timeline). */
  cues?: { target: string; frame: number }[];
}

export interface Reveal {
  /** Frame relative to the scene start. */
  frame: number;
  beatIndex: number;
  visual: BeatVisual;
  /** Was the element revealed at or before this frame? Elements no beat manages are always shown. */
  shown(id: string): boolean;
  /** 0..1 entrance progress (ease-out over REVEAL_FRAMES). */
  amount(id: string): number;
  focused(id: string): boolean;
}

export const REVEAL_FRAMES = 12;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function computeReveal(beats: RevealBeat[], beatIndex: number, frame: number): Reveal {
  const managed = new Set<string>();
  for (const b of beats) {
    for (const id of b.visual.show) managed.add(id);
    for (const c of b.visualCues) managed.add(c.target);
  }
  const revealAt = new Map<string, number>();
  const mark = (id: string, f: number) => {
    const prev = revealAt.get(id);
    if (prev === undefined || f < prev) revealAt.set(id, f);
  };
  beats.forEach((b, i) => {
    if (i > beatIndex) return;
    for (const id of b.visual.show) mark(id, b.startFrame);
    for (const c of b.cues ?? []) if (c.frame <= frame) mark(c.target, c.frame);
    // Cues without timing (stills, previews) reveal at the beat start.
    if (!b.cues) for (const c of b.visualCues) mark(c.target, b.startFrame);
  });
  const visual = beats[beatIndex]?.visual ?? { show: [] };
  const at = (id: string) => (managed.has(id) ? revealAt.get(id) : -Infinity);
  return {
    frame,
    beatIndex,
    visual,
    shown: (id) => {
      const f = at(id);
      return f !== undefined && f <= frame;
    },
    amount: (id) => {
      const f = at(id);
      if (f === undefined || f > frame) return 0;
      if (f === -Infinity) return 1;
      return easeOut(Math.min(1, (frame - f) / REVEAL_FRAMES));
    },
    focused: (id) => visual.focus === id,
  };
}

/** Everything visible, as in a fixture still. */
export function revealAll(visual: BeatVisual = { show: [] }): Reveal {
  return { frame: 0, beatIndex: 0, visual, shown: () => true, amount: () => 1, focused: (id) => visual.focus === id };
}
