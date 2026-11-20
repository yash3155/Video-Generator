import { z } from "zod";
import { Id } from "./common";

export const PartKind = z.enum(["chapter_part", "orientation", "synthesis"]);
export type PartKind = z.infer<typeof PartKind>;

export const CoursePart = z.object({
  id: Id,
  title: z.string().min(1),
  sections: z.array(z.string().min(1)).min(1),
  estimatedMinutes: z.number().positive(),
});

export const CourseChapter = z.object({
  id: Id,
  number: z.number().int().min(0),
  title: z.string().min(1),
  moduleId: Id,
  summary: z.string().min(1),
  kind: PartKind.default("chapter_part"),
  parts: z.array(CoursePart).min(1),
  prerequisites: z.array(Id).default([]),
});

export const CourseMap = z.object({
  bookId: Id,
  courseTitle: z.string().min(1),
  modules: z.array(z.object({ id: Id, title: z.string().min(1), chapterIds: z.array(Id).min(1) })).min(1),
  chapters: z.array(CourseChapter).min(1),
});
export type CourseMap = z.infer<typeof CourseMap>;

/** LLM output for S2 (the deterministic part adds orientation/synthesis entries and validates). */
export const CourseMapDraft = CourseMap;

export const GlossaryConcept = z.object({
  term: z.string().min(1),
  fullForm: z.string().optional(),
  definition: z.string().min(1),
  introducedIn: z.object({ chapterId: z.string().min(1), partId: z.string().min(1) }),
  aliases: z.array(z.string()).default([]),
});

export const CourseGlossary = z.object({
  bookId: Id,
  concepts: z.array(GlossaryConcept),
  analogies: z.array(z.object({ chapterId: z.string(), partId: z.string(), conceptTerm: z.string(), analogy: z.string().min(1) })).default([]),
});
export type CourseGlossary = z.infer<typeof CourseGlossary>;
