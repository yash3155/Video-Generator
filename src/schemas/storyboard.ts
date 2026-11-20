import { z } from "zod";
import { TEMPLATE_IDS } from "../remotion/templates/schemas";

export const Topology = z.enum([
  "hook",
  "tension",
  "pillars",
  "process",
  "comparison",
  "formula",
  "quantity_over_time",
  "worked_example",
  "definition",
  "statistic",
  "table",
  "timeline",
  "quiz",
  "wisdom",
  "summary",
  "roadmap",
  "mixed",
]);
export type Topology = z.infer<typeof Topology>;

export const VisualBrief = z.object({
  scenes: z
    .array(
      z.object({
        index: z.number().int().min(0),
        topology: Topology,
        visualIntent: z.string().min(1),
        keyElements: z.array(z.string().min(1)).min(1),
        factIds: z.array(z.string()).default([]),
      }),
    )
    .min(3),
});
export type VisualBrief = z.infer<typeof VisualBrief>;

export const Storyboard = z.object({
  scenes: z
    .array(
      z.object({
        index: z.number().int().min(0),
        template: z.enum(TEMPLATE_IDS),
        justification: z.string().min(1),
        pedagogicalContinuation: z.boolean().default(false),
        beats: z.array(z.object({ id: z.string().min(1), visualIntent: z.string().min(1) })).min(1),
      }),
    )
    .min(3),
});
export type Storyboard = z.infer<typeof Storyboard>;
