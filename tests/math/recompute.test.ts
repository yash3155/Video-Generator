import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { checkFormulaVariables, evaluateExpression, generateSeries, recomputeNumbers, symbolsOf } from "../../src/math/recompute";
import { approxEqual, extractNumbers, normalizeDigits, numberMatches, textMentionsNumber } from "../../src/math/numbers";
import { SourceFacts } from "../../src/schemas/facts";

const facts = SourceFacts.parse(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "fixtures", "good", "demo-ch01-p1", "source_facts.json"), "utf8")));
const fact = (id: string) => facts.facts.find((f) => f.id === id)!;

describe("recompute (C-14)", () => {
  it("finds the free symbols of an expression", () => {
    expect(symbolsOf("P * (1 + r)^t").sort()).toEqual(["P", "r", "t"]);
    expect(symbolsOf("sqrt(x) + pi")).toEqual(["x"]);
  });

  it("recomputes the demo facts' numbers blocks", () => {
    const compound = recomputeNumbers(fact("F12").numbers!, fact("F10").formula);
    expect(compound.errors).toEqual([]);
    expect(compound.mismatches).toEqual([]);
    expect(compound.computed.result).toBeCloseTo(1157.625, 6);
    const simple = recomputeNumbers(fact("F13").numbers!);
    expect(simple.mismatches).toEqual([]);
  });

  it("reports a step that does not recompute", () => {
    const block = { ...fact("F12").numbers!, steps: [{ label: "year 1", expr: "P * (1 + r)", value: 1060 }] };
    expect(recomputeNumbers(block).mismatches).toHaveLength(1);
  });

  it("reports undeclared variables and missing units", () => {
    const f = fact("F10").formula!;
    expect(checkFormulaVariables(f)).toEqual([]);
    const issues = checkFormulaVariables({ ...f, expression: "P * (1 + r)^n", variables: f.variables.map((v) => (v.symbol === "P" ? { ...v, unit: " " } : v)) });
    expect(issues.map((i) => i.code).sort()).toEqual(["missing-unit", "undeclared-variable"]);
  });

  it("refuses assignments, missing values and disabled functions", () => {
    expect(() => evaluateExpression("x = 2", {})).toThrow();
    expect(() => evaluateExpression("P * r", { P: 1 })).toThrow(/no value for r/);
    expect(() => evaluateExpression('import({}, {})', {})).toThrow();
    expect(() => evaluateExpression('evaluate("1+1")', {})).toThrow();
    expect(evaluateExpression("P * (1 + r)^t", { P: 1000, r: 0.05, t: 3 })).toBeCloseTo(1157.625, 6);
  });

  it("generates chart series from the formula", () => {
    const pts = generateSeries({ expression: "P * (1 + r)^t", variable: "t", from: 0, to: 30, step: 1, scope: { P: 1000, r: 0.05 } });
    expect(pts).toHaveLength(31);
    expect(pts[30].y).toBeCloseTo(4321.94, 2);
    expect(() => generateSeries({ expression: "t", variable: "t", from: 0, to: 1, step: 0 })).toThrow();
  });
});

describe("number extraction", () => {
  it("reads commas, Indian grouping, percents and Devanagari digits", () => {
    expect(extractNumbers("1,157.63 dollars").map((n) => n.value)).toEqual([1157.63]);
    expect(extractNumbers("1,00,000 rupees").map((n) => n.value)).toEqual([100000]);
    expect(extractNumbers("at 5% a year")[0]).toMatchObject({ value: 5, percent: true });
    expect(extractNumbers(normalizeDigits("१,०००")).map((n) => n.value)).toEqual([1000]);
  });

  it("matches with rounding tolerance and percent equivalence", () => {
    expect(approxEqual(1157.625, 1157.63, 2)).toBe(true);
    expect(approxEqual(1157.625, 1158, 2)).toBe(false);
    expect(numberMatches(extractNumbers("5%")[0], 0.05, 2)).toBe(true);
    expect(textMentionsNumber("about 1,157.63 dollars", 1157.63, 2)).toBe(true);
  });
});
