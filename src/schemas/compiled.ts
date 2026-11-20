import { z } from "zod";
import { Episode } from "./episode";

export const WordTiming = z.object({ text: z.string(), startMs: z.number().min(0), endMs: z.number().min(0) });
export type WordTiming = z.infer<typeof WordTiming>;

export const CaptionPhrase = z.object({ startMs: z.number().min(0), endMs: z.number().min(0), words: z.array(WordTiming).min(1).max(16) });
export type CaptionPhrase = z.infer<typeof CaptionPhrase>;

export const CompiledBeat = z.object({
  beatId: z.string(),
  sceneId: z.string(),
  startFrame: z.number().int().min(0),
  durationInFrames: z.number().int().min(1),
  audio: z.object({
    file: z.string().min(1).describe("path relative to the part directory"),
    durationMs: z.number().min(0),
    textHash: z.string().min(1),
    provider: z.string().min(1),
    voice: z.string().min(1),
    mock: z.boolean(),
  }),
  pauseAfterMs: z.number().int().min(0),
  timingSource: z.enum(["boundary", "aligned", "estimated"]),
  words: z.array(WordTiming),
  captions: z.array(CaptionPhrase),
  cues: z.array(z.object({ target: z.string(), anchor: z.string(), atMs: z.number().min(0), frame: z.number().int().min(0) })),
  /** Cue targets whose anchor word was not found in the spoken words (A-06 BLOCKER; the cue fires at the beat start). */
  unresolvedCues: z.array(z.string()).default([]),
});
export type CompiledBeat = z.infer<typeof CompiledBeat>;

export const LanguageTimeline = z.object({
  lang: z.string(),
  durationInFrames: z.number().int().min(1),
  ttsProvider: z.string(),
  fallbackUsed: z.boolean().default(false),
  fallbackReason: z.string().optional(),
  scenes: z.array(z.object({ sceneId: z.string(), startFrame: z.number().int().min(0), durationInFrames: z.number().int().min(1) })),
  beats: z.array(CompiledBeat).min(1),
});
export type LanguageTimeline = z.infer<typeof LanguageTimeline>;

export const EpisodeCompiled = z.object({
  fps: z.literal(30),
  width: z.literal(1920),
  height: z.literal(1080),
  episodeHash: z.string().min(1),
  episode: Episode,
  timelines: z.record(z.string(), LanguageTimeline),
});
export type EpisodeCompiled = z.infer<typeof EpisodeCompiled>;
