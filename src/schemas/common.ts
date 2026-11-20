import { z } from "zod";

export const LangCode = z.string().regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, "language code like en or hi");
export const Id = z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, "simple id");

export const Citation = z.object({
  chapter: z.string().min(1),
  section: z.string().optional(),
  page: z.string().optional(),
});
export type Citation = z.infer<typeof Citation>;

export const Variable = z.object({
  symbol: z.string().min(1).describe("plain identifier used in expression, e.g. P"),
  latex: z.string().optional().describe("LaTeX for the symbol, e.g. P or r_{real}"),
  meaning: z.string().min(1),
  unit: z.string().min(1).describe("unit, or 'dimensionless' / 'count'"),
});
export type Variable = z.infer<typeof Variable>;

export const Formula = z.object({
  id: z.string().optional(),
  latex: z.string().min(1).describe("LaTeX source only, no $ delimiters"),
  expression: z.string().optional().describe("mathjs expression for the right-hand side, e.g. P * (1 + r)^t"),
  solvesFor: z.string().optional().describe("symbol computed by expression, e.g. A"),
  variables: z.array(Variable).min(1),
});
export type Formula = z.infer<typeof Formula>;

export const NumberValue = z.object({
  symbol: z.string().optional(),
  label: z.string().min(1),
  value: z.number(),
  unit: z.string().optional(),
});
export type NumberValue = z.infer<typeof NumberValue>;

export const NumbersBlock = z.object({
  inputs: z.array(NumberValue).min(1),
  steps: z.array(z.object({ label: z.string().min(1), expr: z.string().optional(), value: z.number() })).default([]),
  result: NumberValue,
  rounding: z.number().int().min(0).max(6).default(2),
});
export type NumbersBlock = z.infer<typeof NumbersBlock>;

export const Severity = z.enum(["BLOCKER", "HIGH", "MEDIUM", "LOW"]);
export type Severity = z.infer<typeof Severity>;

export const Provenance = z.object({
  mock: z.boolean().default(false),
});
