import { z } from "zod";

export const Speaker = z.enum(["novice", "mentor", "narrator"]);
export type Speaker = z.infer<typeof Speaker>;

export const BeatId = z.string().regex(/^s\d{2}b\d{1,2}$/, "beat ids look like s03b2");

/** Narration in one language: `display` is the written form (digits, symbols) used for subtitles; `spoken` is the TTS form. */
export const NarrationText = z.object({
  display: z.string().min(1),
  spoken: z.string().optional(),
});
export type NarrationText = z.infer<typeof NarrationText>;

export const ScriptBeat = z.object({
  id: BeatId,
  speaker: Speaker,
  narration: z.record(z.string(), NarrationText),
  onScreenIntent: z.string().min(1),
  sourceFactIds: z.array(z.string()).default([]),
  newTerms: z.array(z.string()).default([]),
  pauseAfterMs: z.number().int().min(0).optional(),
  transition: z.boolean().default(false),
});
export type ScriptBeat = z.infer<typeof ScriptBeat>;

export const TeachingScript = z.object({
  languages: z.array(z.string()).min(1),
  scenes: z
    .array(
      z.object({
        index: z.number().int().min(0),
        title: z.string().min(1),
        purpose: z.string().min(1),
        beats: z.array(ScriptBeat).min(1),
      }),
    )
    .min(3),
});
export type TeachingScript = z.infer<typeof TeachingScript>;
