import type { z } from "zod";
import { BookConfig } from "./book";
import { ResearchContext } from "./research";
import { CourseMap, CourseGlossary } from "./course";
import { SourceFacts } from "./facts";
import { ContentAudit } from "./audit";
import { ConceptRegister } from "./register";
import { LessonPlan } from "./plan";
import { TeachingScript } from "./script";
import { VisualBrief, Storyboard } from "./storyboard";
import { Episode } from "./episode";
import { EpisodeCompiled } from "./compiled";
import { QaReport } from "./qa";

/** Every artifact of Part C with its schema; used for JSON Schema export and schema tests. */
export const ARTIFACT_SCHEMAS: Record<string, { schema: z.ZodType; file: string }> = {
  book_config: { schema: BookConfig, file: "book.config.json" },
  research_context: { schema: ResearchContext, file: "research/notebook_context.md" },
  course_map: { schema: CourseMap, file: "course_map.json" },
  course_glossary: { schema: CourseGlossary, file: "course_glossary.json" },
  source_facts: { schema: SourceFacts, file: "01_source_facts.json" },
  content_audit: { schema: ContentAudit, file: "02_content_audit.json" },
  concept_register: { schema: ConceptRegister, file: "03_concept_register.json" },
  lesson_plan: { schema: LessonPlan, file: "04_lesson_plan.json" },
  teaching_script: { schema: TeachingScript, file: "05_teaching_script.json" },
  visual_brief: { schema: VisualBrief, file: "06_visual_brief.json" },
  storyboard: { schema: Storyboard, file: "07_storyboard.json" },
  episode: { schema: Episode, file: "08_episode.json" },
  episode_compiled: { schema: EpisodeCompiled, file: "09_episode_compiled.json" },
  qa_report: { schema: QaReport, file: "qa/report.json" },
};

export * from "./common";
export * from "./book";
export * from "./research";
export * from "./course";
export * from "./facts";
export * from "./audit";
export * from "./register";
export * from "./plan";
export * from "./script";
export * from "./storyboard";
export * from "./episode";
export * from "./compiled";
export * from "./qa";
