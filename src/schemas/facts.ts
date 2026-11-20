import { z } from "zod";
import { Citation, Formula, NumbersBlock } from "./common";

export const FactCategory = z.enum([
  "definition",
  "claim",
  "rule",
  "formula",
  "numerical_example",
  "case_study",
  "historical_event",
  "assumption",
  "limitation",
  "misconception",
]);
export type FactCategory = z.infer<typeof FactCategory>;

export const Fact = z.object({
  id: z.string().regex(/^F\d{2,3}$/, "fact ids look like F01"),
  category: FactCategory,
  statement: z.string().min(10),
  citation: Citation,
  formula: Formula.optional(),
  numbers: NumbersBlock.optional(),
});
export type Fact = z.infer<typeof Fact>;

export const SourceFacts = z.object({
  bookId: z.string().min(1),
  chapterId: z.string().min(1),
  partId: z.string().min(1),
  facts: z.array(Fact).min(1),
  realWorldProblem: z.object({
    actors: z.string().min(1),
    situation: z.string().min(1),
    failure: z.string().min(1),
    invention: z.string().min(1),
    factIds: z.array(z.string()).min(1),
  }),
  terms: z.array(z.object({ term: z.string().min(1), fullForm: z.string().optional(), definition: z.string().min(1), factId: z.string().optional() })).default([]),
  dependencies: z.object({ earlier: z.array(z.string()).default([]), later: z.array(z.string()).default([]) }),
  quotes: z
    .array(z.object({ text: z.string().min(1), citation: Citation }))
    .max(2)
    .default([]),
});
export type SourceFacts = z.infer<typeof SourceFacts>;
