// src/schemas/bookSynthesisSchema.mjs
import { z } from 'zod';

/**
 * Schema for Book-Level Dialectical Synthesis:
 * Explains the holistic interconnectivity of an entire book:
 * Why each topic was invented, what limitation in prior tools forced its creation,
 * and how all chapters unite into a single coherent system.
 */
export const CausalEvolutionStepSchema = z.object({
  step: z.number().int().positive(),
  priorConcept: z.string().min(3),
  priorBreakthrough: z.string().min(10),
  fatalLimitation: z.string().min(15),
  failureScenario: z.string().min(15), // Concrete market struggle or loss
  authorSolution: z.string().min(10),  // Conceptual invention by the author
  succeedingConcept: z.string().min(3),
  breakthroughMechanism: z.string().min(15),
  sourceChapters: z.array(z.string()).min(1),
});

export const ComplementaryPairSchema = z.object({
  pairName: z.string().min(3),
  toolA: z.string().min(3),
  toolB: z.string().min(3),
  synergyExplanation: z.string().min(20),
  antiPatternWarning: z.string().min(15), // e.g. using two oscillators together creates redundant false confirmation
});

export const HolisticSynthesisRuleSchema = z.object({
  ruleNumber: z.number().int().min(1).max(12),
  title: z.string().min(3),
  corePrinciple: z.string().min(15),
  interconnectedChapters: z.array(z.string()),
  practicalExecutionDirective: z.string().min(20),
});

export const BookSynthesisSchema = z.object({
  courseId: z.string().min(3),
  bookTitle: z.string().min(3),
  author: z.string().min(3),
  macroThesis: z.string().min(20),
  openingDilemma: z.object({
    struggle: z.string().min(20),
    historicalContext: z.string().min(20),
    fatalMistake: z.string().min(20),
    authorInvention: z.string().min(20),
  }),
  causalEvolutionChain: z.array(CausalEvolutionStepSchema).min(4),
  complementaryPairs: z.array(ComplementaryPairSchema).min(2),
  holisticSynthesisRules: z.array(HolisticSynthesisRuleSchema).min(6).max(12),
  unifiedExecutionChecklist: z.array(z.string()).min(4),
  metadata: z.object({
    generatedAt: z.string(),
    engine: z.string().default('gemini-4-argon'),
    version: z.string().default('1.0.0'),
  }),
});

export default BookSynthesisSchema;

