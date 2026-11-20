import { z } from "zod";

const StageRef = z.object({ sceneIndex: z.number().int().min(0), note: z.string().min(1) });

export const LessonPlan = z.object({
  outcomes: z.array(z.string().min(1)).min(2).max(6),
  coreConcepts: z
    .array(
      z.object({
        conceptId: z.string().min(1),
        term: z.string().min(1),
        stages: z.object({
          intuition: StageRef,
          why: StageRef,
          what: StageRef,
          how: StageRef,
          workedExample: StageRef,
          guided: StageRef,
          independent: StageRef,
          limitations: StageRef,
        }),
      }),
    )
    .min(1),
  misconception: z.object({ myth: z.string().min(1), reality: z.string().min(1), factIds: z.array(z.string()).min(1), sceneIndex: z.number().int() }),
  predictionQuestions: z.array(z.object({ question: z.string().min(1), sceneIndex: z.number().int().min(0), revealBeat: z.string().optional() })).min(1),
  causalChain: z.object({
    condition: z.string().min(1),
    action: z.string().min(1),
    mechanism: z.string().min(1),
    result: z.string().min(1),
    consequence: z.string().min(1),
    factIds: z.array(z.string()).min(1),
    sceneIndex: z.number().int().min(0),
  }),
  sceneOutline: z.array(z.object({ index: z.number().int().min(0), purpose: z.string().min(1), concepts: z.array(z.string()), factIds: z.array(z.string()) })).min(3),
});
export type LessonPlan = z.infer<typeof LessonPlan>;
