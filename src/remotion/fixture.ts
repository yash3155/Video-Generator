/* Template fixture format shared by the Still composition (browser) and render:stills (Node). */
import { z } from "zod";
import { BeatVisual } from "../schemas/episode";
import { TEMPLATE_IDS } from "./templates/schemas";

export const StillHeader = z.object({
  course: z.string().min(1),
  chapter: z.string().min(1),
  part: z.string().min(1),
  progress: z.object({ index: z.number().int().min(0), total: z.number().int().min(1) }),
});

export const StillFixture = z.object({
  template: z.enum(TEMPLATE_IDS),
  title: z.string().min(1),
  takeaways: z.array(z.string().min(1)).max(3).default([]),
  data: z.unknown(),
  visual: BeatVisual.default({ show: [] }),
  caption: z.string().optional(),
  lang: z.string().default("en"),
  theme: z.string().optional(),
  header: StillHeader.default({ course: "OpenLectern", chapter: "Template gallery", part: "Fixture", progress: { index: 0, total: 4 } }),
  names: z.object({ novice: z.string().min(1), mentor: z.string().min(1) }).default({ novice: "Learner", mentor: "Mentor" }),
});
export type StillFixture = z.infer<typeof StillFixture>;
export type StillFixtureInput = z.input<typeof StillFixture>;
