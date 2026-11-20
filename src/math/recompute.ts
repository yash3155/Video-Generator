/* Recompute numbers with mathjs over declared variables (checks C-13 and C-14). */
import { create, all, type MathNode, type SymbolNode } from "mathjs";
import type { Formula, NumbersBlock } from "../schemas/common";
import { approxEqual } from "./numbers";

const math = create(all, {});
const evaluateExpr = math.evaluate.bind(math);
const parseExpr = math.parse.bind(math);

// Expressions come from model output: block the few mathjs functions that can change the instance or define code.
math.import(
  {
    import: () => {
      throw new Error("import is disabled");
    },
    createUnit: () => {
      throw new Error("createUnit is disabled");
    },
    evaluate: () => {
      throw new Error("evaluate is disabled");
    },
    parse: () => {
      throw new Error("parse is disabled");
    },
    simplify: () => {
      throw new Error("simplify is disabled");
    },
    derivative: () => {
      throw new Error("derivative is disabled");
    },
  },
  { override: true },
);

const BUILTIN_SYMBOLS = new Set(["e", "E", "pi", "PI", "Infinity", "true", "false"]);

function parse(expression: string): MathNode {
  return parseExpr(expression);
}

/** Free variables of an expression (function names and built-in constants excluded). */
export function symbolsOf(expression: string): string[] {
  const node = parse(expression);
  const found = new Set<string>();
  node.traverse((n: MathNode, _path: string, parent: MathNode | null) => {
    if ((n as SymbolNode).isSymbolNode) {
      const name = (n as SymbolNode).name;
      const isFn = parent && (parent as { isFunctionNode?: boolean }).isFunctionNode && (parent as unknown as { fn: MathNode }).fn === n;
      if (!isFn && !BUILTIN_SYMBOLS.has(name)) found.add(name);
    }
  });
  return [...found];
}

export function evaluateExpression(expression: string, scope: Record<string, number>): number {
  if (/[=;]|\bfunction\b|=>/.test(expression)) throw new Error(`expression must be a pure formula: ${expression}`);
  const missing = symbolsOf(expression).filter((s) => !(s in scope));
  if (missing.length) throw new Error(`no value for ${missing.join(", ")} in "${expression}"`);
  const v = evaluateExpr(expression, { ...scope }) as unknown;
  const n = typeof v === "number" ? v : Number((v as { valueOf?: () => unknown })?.valueOf?.());
  if (!Number.isFinite(n)) throw new Error(`"${expression}" did not evaluate to a finite number`);
  return n;
}

export interface FormulaIssue {
  code: "undeclared-variable" | "missing-unit" | "bad-expression" | "solves-for-undeclared";
  detail: string;
}

/** C-14: every symbol used by the formula is declared with a meaning and a unit. */
export function checkFormulaVariables(formula: Formula): FormulaIssue[] {
  const issues: FormulaIssue[] = [];
  const declared = new Map(formula.variables.map((v) => [v.symbol, v]));
  for (const v of formula.variables) if (!v.unit.trim()) issues.push({ code: "missing-unit", detail: `variable ${v.symbol} has no unit` });
  if (formula.expression) {
    try {
      for (const s of symbolsOf(formula.expression)) if (!declared.has(s)) issues.push({ code: "undeclared-variable", detail: `symbol ${s} in "${formula.expression}" is not declared in variables` });
    } catch (e) {
      issues.push({ code: "bad-expression", detail: `cannot parse "${formula.expression}": ${(e as Error).message}` });
    }
  }
  if (formula.solvesFor && !declared.has(formula.solvesFor)) issues.push({ code: "solves-for-undeclared", detail: `solvesFor ${formula.solvesFor} is not declared in variables` });
  return issues;
}

export interface RecomputeMismatch {
  what: string;
  expected: number;
  computed: number;
}

export interface RecomputeResult {
  computed: Record<string, number>;
  mismatches: RecomputeMismatch[];
  errors: string[];
}

/** Recompute a fact's NumbersBlock: each step with an expression and the result (via the formula when given). */
export function recomputeNumbers(block: NumbersBlock, formula?: Formula): RecomputeResult {
  const scope: Record<string, number> = {};
  for (const i of block.inputs) if (i.symbol) scope[i.symbol] = i.value;
  const res: RecomputeResult = { computed: {}, mismatches: [], errors: [] };
  block.steps.forEach((st, idx) => {
    if (!st.expr) return;
    try {
      const v = evaluateExpression(st.expr, scope);
      res.computed[`step${idx + 1}`] = v;
      if (!approxEqual(v, st.value, block.rounding)) res.mismatches.push({ what: `step ${idx + 1} (${st.label})`, expected: st.value, computed: v });
    } catch (e) {
      res.errors.push(`step ${idx + 1}: ${(e as Error).message}`);
    }
  });
  if (formula?.expression) {
    try {
      const v = evaluateExpression(formula.expression, scope);
      res.computed.result = v;
      if (!approxEqual(v, block.result.value, block.rounding)) res.mismatches.push({ what: `result (${block.result.label})`, expected: block.result.value, computed: v });
    } catch (e) {
      res.errors.push(`result: ${(e as Error).message}`);
    }
  }
  return res;
}

export interface SeriesGenerator {
  expression: string;
  variable: string;
  from: number;
  to: number;
  step: number;
  scope?: Record<string, number>;
}

/** Chart curves are computed from the formula, never hand-typed. */
export function generateSeries(g: SeriesGenerator, maxPoints = 400): { x: number; y: number }[] {
  if (!(g.step > 0) || g.to < g.from) throw new Error("generator needs step > 0 and to >= from");
  const n = Math.floor((g.to - g.from) / g.step + 1e-9) + 1;
  if (n > maxPoints) throw new Error(`generator would produce ${n} points (max ${maxPoints})`);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = +(g.from + i * g.step).toPrecision(12);
    pts.push({ x, y: evaluateExpression(g.expression, { ...(g.scope ?? {}), [g.variable]: x }) });
  }
  return pts;
}
