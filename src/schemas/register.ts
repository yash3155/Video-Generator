import { z } from "zod";

export const Depth = z.enum(["L1", "L2", "L3", "L4"]);

export const RegisteredConcept = z.object({
  id: z.string().regex(/^K\d{2,3}$/, "concept ids look like K01"),
  term: z.string().min(1),
  fullForm: z.string().optional(),
  kind: z.enum(["acronym", "term", "symbol", "concept"]),
  plainMeaning: z.string().min(1),
  roleHere: z.string().min(1),
  connectsTo: z.string().optional(),
  analogy: z.string().optional(),
  depth: Depth,
  familiarity: z.enum(["new", "introduced_earlier", "assumed_known"]),
  introducedIn: z.object({ chapterId: z.string(), partId: z.string() }).optional(),
  aliases: z.array(z.string()).default([]),
  factIds: z.array(z.string()).default([]),
});
export type RegisteredConcept = z.infer<typeof RegisteredConcept>;

export const ConceptRegister = z.object({
  concepts: z.array(RegisteredConcept).min(1),
});
export type ConceptRegister = z.infer<typeof ConceptRegister>;
