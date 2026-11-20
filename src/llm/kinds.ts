/*
 * Task-kind registry: output schema per kind and the content gates `task:validate` runs.
 * Pipeline stages register their content gates here so the agent can validate an answer
 * with exactly the checks the pipeline will apply.
 */
import { z } from "zod";
import { CourseMapDraft } from "../schemas/course";
import { SourceFacts } from "../schemas/facts";
import { ConceptRegister } from "../schemas/register";
import { LessonPlan } from "../schemas/plan";
import { TeachingScript } from "../schemas/script";
import { VisualBrief, Storyboard } from "../schemas/storyboard";
import { EpisodeFill } from "../schemas/episode";
import { QaReview } from "../schemas/qa";

export const PingOutput = z.object({ answer: z.string().min(1) });
export const ResearchExtractOutput = z.object({ markdown: z.string().min(200) });
export const StoryboardOutput = z.object({ visualBrief: VisualBrief, storyboard: Storyboard });

export const TASK_SCHEMAS: Record<string, z.ZodType> = {
  ping: PingOutput,
  research_extract: ResearchExtractOutput,
  course_map: CourseMapDraft,
  source_facts: SourceFacts,
  concept_register: ConceptRegister,
  lesson_plan: LessonPlan,
  teaching_script: TeachingScript,
  storyboard: StoryboardOutput,
  episode_fill: EpisodeFill,
  review: QaReview,
};

/** A content gate returns human-readable problems; empty means pass. */
export type TaskGate = (output: unknown, input: unknown) => string[];

const gates = new Map<string, TaskGate[]>();

export function registerTaskGate(kind: string, gate: TaskGate): void {
  const list = gates.get(kind) ?? [];
  list.push(gate);
  gates.set(kind, list);
}

export function runTaskGates(kind: string, output: unknown, input: unknown): string[] {
  const out: string[] = [];
  for (const g of gates.get(kind) ?? []) {
    try {
      out.push(...g(output, input));
    } catch (e) {
      out.push(`gate error: ${(e as Error).message}`);
    }
  }
  return out;
}

export function schemaForKind(kind: string): z.ZodType {
  const s = TASK_SCHEMAS[kind];
  if (!s) throw new Error(`unknown task kind "${kind}"`);
  return s;
}

registerTaskGate("ping", (output) => {
  const a = (output as { answer?: string }).answer ?? "";
  return /\bpong\b/i.test(a) ? [] : ['answer must contain the word "pong"'];
});
