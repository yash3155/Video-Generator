// src/schemas/bookOrientationSchema.mjs
import { z } from 'zod';

/**
 * Schema for Book Orientation & Beginner's Inspiration Chapter:
 * Designed to make a student fall in love with the book before reading Chapter 1.
 * Dismantles intimidation, answers "Why read this?", reveals the 4 superpowers unlocked,
 * and sets an inspiring pedagogical roadmap.
 */
export const CoreSuperpowerSchema = z.object({
  superpowerIndex: z.number().int().min(1).max(10),
  name: z.string().min(3),
  retailMyth: z.string().min(15),     // e.g. "Derivatives are dangerous gambling"
  quantReality: z.string().min(15),   // e.g. "Derivatives are the mathematical engineering of risk immunity"
  practicalMarketApplication: z.string().min(20),
});

export const IntimidationBusterSchema = z.object({
  barrier: z.string().min(10),       // e.g. "Heavy stochastic calculus and Greek symbols"
  reassurance: z.string().min(20),   // e.g. "Hull builds from simple coin tosses and fruit stand forward contracts"
  firstPrinciplesAnalogy: z.string().min(20),
});

export const BookOrientationSchema = z.object({
  courseId: z.string().min(3),
  bookTitle: z.string().min(3),
  author: z.string().min(3),
  bookReputation: z.string().min(20), // "The Bible of Wall Street"
  targetReaderJourney: z.object({
    startingState: z.string().min(20), // Confused, intimidated retail participant
    transformedState: z.string().min(20), // Confident risk engineer thinking in payoffs and the Greeks
    ultimatePayoff: z.string().min(20),
  }),
  coreSuperpowers: z.array(CoreSuperpowerSchema).min(3),
  intimidationBusters: z.array(IntimidationBusterSchema).min(2),
  recommendedStudyPillars: z.array(z.string()).min(3),
  inspirationalManifesto: z.string().min(50),
  metadata: z.object({
    generatedAt: z.string(),
    engine: z.string().default('gemini-4-argon'),
    version: z.string().default('1.0.0'),
  }),
});

export default BookOrientationSchema;

