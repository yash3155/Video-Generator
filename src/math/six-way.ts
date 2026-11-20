/*
 * Six-way agreement (FORMULA_RULES, check C-13): the typeset equation, the recomputed arithmetic, the chart
 * data, the on-screen annotations, the spoken narration numbers and the stated conclusion must agree within
 * the declared rounding. Any mismatch is a BLOCKER.
 */
import type { Formula } from "../schemas/common";
import type { DataChartData, WorkedExampleData } from "../remotion/templates/schemas";
import type { Episode, Scene } from "../schemas/episode";
import type { SourceFacts } from "../schemas/facts";
import { richTextToPlain } from "../core/richtext";
import { finding, type QaFinding } from "../qa/finding";
import { compileLatex } from "./katex-compile";
import { evaluateExpression } from "./recompute";
import { approxEqual, extractNumbers, nearMisses, numberMatches, textMentionsNumber, type FoundNumber } from "./numbers";

export type Leg = "equation" | "arithmetic" | "chart" | "annotations" | "narration" | "conclusion";
export type LegStatus = "agree" | "mismatch" | "n/a";

export interface SixWayInput {
  formula?: Formula;
  given: { symbol?: string; label: string; value: number; unit?: string; display?: string }[];
  steps: { label: string; latex?: string; expr?: string; value?: number }[];
  result: { label: string; value: number; unit?: string; display?: string; rounding: number };
  chart?: DataChartData;
  /** On-screen strings other than the result/given displays (step labels, card text). */
  annotations?: string[];
  narration: string[];
  conclusion?: string;
  /** Numbers stated in the part's source facts; they are never reported as near-misses. */
  knownNumbers?: number[];
}

export interface SixWayReport {
  ok: boolean;
  legs: Record<Leg, { status: LegStatus; detail: string }>;
}

/** The last number on the right-hand side of a typeset step (after the last =, \\approx or \\equiv). */
function latexRhs(latex: string): FoundNumber | undefined {
  const s = latex
    .replace(/\{,\}/g, ",")
    .replace(/\\(approx|simeq|equiv)(?![A-Za-z])/g, "=")
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/[{}]/g, " ");
  const rhs = s.includes("=") ? s.slice(s.lastIndexOf("=") + 1) : s;
  const nums = extractNumbers(rhs);
  return nums.length ? nums[nums.length - 1] : undefined;
}

const latexRhsNumber = (latex: string): number | undefined => latexRhs(latex)?.value;

export function sixWay(input: SixWayInput): SixWayReport {
  const r = input.result.rounding;
  const target = input.result.value;
  const scope: Record<string, number> = {};
  for (const g of input.given) if (g.symbol) scope[g.symbol] = g.value;
  const legs = {} as SixWayReport["legs"];
  const known = [...input.given.map((g) => g.value), ...input.steps.flatMap((s) => (s.value === undefined ? [] : [s.value])), ...(input.knownNumbers ?? [])];
  const isKnown = (n: FoundNumber) => known.some((k) => numberMatches(n, k, r));

  // 1. Equation: formula and step LaTeX compile, and the typeset right-hand sides show the step values and result.
  {
    const problems: string[] = [];
    if (input.formula) {
      const c = compileLatex(input.formula.latex);
      if (!c.ok) problems.push(`formula does not compile: ${c.error}`);
    }
    input.steps.forEach((s, i) => {
      if (!s.latex) return;
      const c = compileLatex(s.latex);
      if (!c.ok) problems.push(`step ${i + 1} does not compile: ${c.error}`);
      const shown = latexRhsNumber(s.latex);
      const expected = s.value;
      if (shown !== undefined && expected !== undefined && !approxEqual(shown, expected, r, decimalsOf(s.latex)))
        problems.push(`step ${i + 1} shows ${shown} but its value is ${expected}`);
    });
    const last = input.steps[input.steps.length - 1];
    if (last?.latex) {
      const shown = latexRhsNumber(last.latex);
      if (shown !== undefined && !approxEqual(shown, target, r, decimalsOf(last.latex))) problems.push(`final step shows ${shown} but the result is ${target}`);
    }
    legs.equation = input.formula || input.steps.some((s) => s.latex) ? { status: problems.length ? "mismatch" : "agree", detail: problems.join("; ") || "typeset steps match" } : { status: "n/a", detail: "no typeset formula" };
  }

  // 2. Arithmetic: recompute steps and the result from the declared variables.
  {
    const problems: string[] = [];
    let checked = 0;
    input.steps.forEach((s, i) => {
      if (!s.expr || s.value === undefined) return;
      try {
        const v = evaluateExpression(s.expr, scope);
        checked++;
        if (!approxEqual(v, s.value, r)) problems.push(`step ${i + 1}: ${s.expr} = ${v}, not ${s.value}`);
      } catch (e) {
        problems.push(`step ${i + 1}: ${(e as Error).message}`);
      }
    });
    if (input.formula?.expression) {
      try {
        const v = evaluateExpression(input.formula.expression, scope);
        checked++;
        if (!approxEqual(v, target, r)) problems.push(`${input.formula.expression} = ${v}, but the result says ${target}`);
      } catch (e) {
        problems.push(`result: ${(e as Error).message}`);
      }
    }
    legs.arithmetic = checked || problems.length ? { status: problems.length ? "mismatch" : "agree", detail: problems.join("; ") || `${checked} computations agree` } : { status: "n/a", detail: "nothing to recompute" };
  }

  // 3. Chart: markers sit on their generated curves, and a curve evaluated at the given inputs hits the result.
  {
    const problems: string[] = [];
    let checked = 0;
    const chart = input.chart;
    if (chart) {
      const curves = chart.series.flatMap((s) => {
        const g = s.generator;
        if (!g) return [];
        return [{ id: s.id, g, f: (x: number) => evaluateExpression(g.expression, { ...scope, ...g.scope, [g.variable]: x }) }];
      });
      for (const m of chart.markers) {
        const candidates = curves.filter((c) => m.x >= c.g.from && m.x <= c.g.to);
        if (!candidates.length) continue;
        const ys: number[] = [];
        for (const c of candidates) {
          try {
            ys.push(c.f(m.x));
          } catch {
            /* not evaluable at this point */
          }
        }
        if (!ys.length) continue;
        checked++;
        if (!ys.some((y) => approxEqual(y, m.y, r))) problems.push(`marker ${m.id} at x=${m.x} has y=${m.y}, but the curves give ${ys.map((y) => +y.toFixed(4)).join(" / ")}`);
      }
      for (const c of curves) {
        if (c.g.variable in scope && input.formula?.expression && sameExpression(c.g.expression, input.formula.expression)) {
          const y = c.f(scope[c.g.variable]);
          checked++;
          if (!approxEqual(y, target, r)) problems.push(`curve ${c.id} at ${c.g.variable}=${scope[c.g.variable]} gives ${y}, not ${target}`);
        }
      }
    }
    legs.chart = chart && (checked || problems.length) ? { status: problems.length ? "mismatch" : "agree", detail: problems.join("; ") || `${checked} chart points agree` } : { status: "n/a", detail: "no computed chart" };
  }

  // 4. On-screen annotations: the result and given displays show the declared values.
  {
    const problems: string[] = [];
    if (input.result.display !== undefined && !textMentionsNumber(input.result.display, target, r)) problems.push(`result display "${input.result.display}" does not show ${target}`);
    for (const g of input.given) if (g.display !== undefined && !textMentionsNumber(g.display, g.value, r)) problems.push(`given "${g.display}" does not show ${g.value}`);
    for (const a of input.annotations ?? []) for (const n of nearMisses(a, target, r)) if (!isKnown(n)) problems.push(`annotation "${a}" shows ${n.raw}, close to but not ${target}`);
    legs.annotations = { status: problems.length ? "mismatch" : "agree", detail: problems.join("; ") || "displays match values" };
  }

  // 5. Narration: the spoken text states the result and no near-miss of it.
  {
    const text = input.narration.join(" ");
    const problems: string[] = [];
    if (!textMentionsNumber(text, target, r)) problems.push(`narration never states the result ${target}`);
    for (const n of nearMisses(text, target, r)) if (!isKnown(n)) problems.push(`narration says ${n.raw}, close to but not the result ${target}`);
    legs.narration = text.trim() ? { status: problems.length ? "mismatch" : "agree", detail: problems.join("; ") || "narration states the result" } : { status: "n/a", detail: "no narration" };
  }

  // 6. Conclusion: any number it states is an input, a step value or the result.
  {
    const c = input.conclusion ?? "";
    const bad = extractNumbers(c).filter((n) => !numberMatches(n, target, r) && !isKnown(n));
    legs.conclusion = c.trim()
      ? { status: bad.length ? "mismatch" : "agree", detail: bad.length ? `conclusion states ${bad.map((b) => b.raw).join(", ")} which matches no computed value` : "conclusion agrees" }
      : { status: "n/a", detail: "no conclusion" };
  }

  return { ok: Object.values(legs).every((l) => l.status !== "mismatch"), legs };
}

function decimalsOf(latex: string): number {
  return latexRhs(latex)?.decimals ?? 6;
}

function sameExpression(a: string, b: string): boolean {
  return a.replace(/\s+/g, "") === b.replace(/\s+/g, "");
}

export function workedExampleInput(data: WorkedExampleData, narration: string[], chart?: DataChartData, knownNumbers: number[] = []): SixWayInput {
  return {
    formula: data.formula,
    given: data.given,
    steps: data.steps,
    result: data.result,
    chart,
    annotations: data.steps.map((s) => s.label),
    narration,
    conclusion: richTextToPlain(data.conclusion),
    knownNumbers,
  };
}

function panelsOf(scene: Scene): { template: string; data: unknown }[] {
  if (scene.template === "composite_layout") return scene.data.panels.map((p) => ({ template: p.template, data: p.data }));
  return [{ template: scene.template, data: scene.data }];
}

/** Run six-way agreement for every worked example in an episode, per narration language. `knownNumbers` are the part's fact numbers. */
export function checkSixWayEpisode(episode: Episode, opts: { knownNumbers?: number[] } = {}): QaFinding[] {
  const out: QaFinding[] = [];
  for (const scene of episode.scenes) {
    const panels = panelsOf(scene);
    const worked = panels.filter((p) => p.template === "worked_example").map((p) => p.data as WorkedExampleData);
    if (!worked.length) continue;
    const chart = panels.find((p) => p.template === "data_chart")?.data as DataChartData | undefined;
    for (const lang of episode.languages) {
      const narration = scene.beats.map((b) => b.narration[lang]?.display ?? "");
      for (const w of worked) {
        const rep = sixWay(workedExampleInput(w, narration, chart, opts.knownNumbers));
        for (const [leg, st] of Object.entries(rep.legs)) {
          if (st.status !== "mismatch") continue;
          out.push(
            finding(
              "C-13",
              "BLOCKER",
              `six-way agreement failed on ${leg}: ${st.detail}`,
              "The equation, arithmetic, chart, on-screen annotations, narration and conclusion disagree about the worked example.",
              "Recompute the example from the source fact numbers, then regenerate the scene so every leg shows the same values.",
              { lang, sceneId: scene.id },
            ),
          );
        }
      }
    }
  }
  return out;
}

/** Every number stated in the part's facts (statements, numbers blocks, formulas' worked values). */
export function factNumbers(facts: SourceFacts): number[] {
  const out: number[] = [];
  for (const f of facts.facts) {
    for (const n of extractNumbers(f.statement)) out.push(n.percent ? n.value / 100 : n.value, n.value);
    if (f.numbers) {
      out.push(...f.numbers.inputs.map((i) => i.value), ...f.numbers.steps.map((s) => s.value), f.numbers.result.value);
    }
  }
  return [...new Set(out)];
}
