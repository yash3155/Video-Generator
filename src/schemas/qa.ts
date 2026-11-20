import { z } from "zod";
import { Severity } from "./common";

export const QaLayer = z.enum(["L0", "L1", "L2", "L3", "L4", "L5", "L6", "Q"]);

export const QaFinding = z.object({
  id: z.string().min(1),
  severity: Severity,
  layer: QaLayer,
  message: z.string().min(1),
  cause: z.string().min(1),
  repair: z.string().min(1),
  lang: z.string().optional(),
  sceneId: z.string().optional(),
  beatId: z.string().optional(),
});
export type QaFinding = z.infer<typeof QaFinding>;

export const QaReport = z.object({
  bookId: z.string().min(1),
  chapterId: z.string().min(1),
  partId: z.string().min(1),
  languages: z.array(z.string()).min(1),
  generatedAt: z.string().min(1),
  scenesRendered: z.array(z.number().int()).optional(),
  release: z.object({ releasable: z.boolean(), draft: z.boolean(), mock: z.boolean(), reason: z.string() }),
  summary: z.object({ BLOCKER: z.number().int(), HIGH: z.number().int(), MEDIUM: z.number().int(), LOW: z.number().int() }),
  checks: z.array(z.object({ id: z.string(), title: z.string(), layer: QaLayer, status: z.enum(["pass", "fail", "skipped"]), reason: z.string().optional() })),
  findings: z.array(QaFinding),
});
export type QaReport = z.infer<typeof QaReport>;

export const ReviewAxis = z.enum(["accuracy", "clarity", "vividness", "sync", "visual_quality", "freshness"]);
export const QaReview = z.object({
  lang: z.string().min(1),
  scores: z.object({
    accuracy: z.number().int().min(1).max(5),
    clarity: z.number().int().min(1).max(5),
    vividness: z.number().int().min(1).max(5),
    sync: z.number().int().min(1).max(5),
    visual_quality: z.number().int().min(1).max(5),
    freshness: z.number().int().min(1).max(5),
  }),
  findings: z.array(z.object({ sceneId: z.string().optional(), beatId: z.string().optional(), axis: ReviewAxis, issue: z.string().min(1), suggestion: z.string().min(1) })).default([]),
  summary: z.string().min(1),
});
export type QaReview = z.infer<typeof QaReview>;
