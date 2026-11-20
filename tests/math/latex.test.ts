import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { safeParseJson } from "../../src/math/escapes";
import { checkLatexSource, checkPlainText, mathIssuesToFindings, sanitizeLatex, scanMathText } from "../../src/math/latex-sanitize";
import { checkKatex, collectLatex, compileLatex } from "../../src/math/katex-compile";

const dir = path.join(__dirname, "..", "fixtures", "math");
const raw = (name: string) => fs.readFileSync(path.join(dir, name), "utf8");

const SWALLOWED: [file: string, latex: string][] = [
  ["swallowed-t.json", "\\text{Profit} = R \\times Q - C"],
  ["swallowed-f.json", "A = \\frac{P}{n}"],
  ["swallowed-b.json", "\\beta = \\bar{x}"],
  ["swallowed-r.json", "\\rho = m / V"],
  ["swallowed-n.json", "a \\neq b"],
];

describe("swallowed backslashes (C-10)", () => {
  for (const [file, latex] of SWALLOWED) {
    it(`${file}: a naive parse is caught, safeParseJson repairs it, KaTeX compiles`, () => {
      const naive = JSON.parse(raw(file)) as { latex: string };
      expect(naive.latex).not.toBe(latex);
      expect(naive.latex).toMatch(/[\t\f\b\r\n]/);
      const issues = scanMathText(naive);
      expect(issues.some((i) => i.code === "control-char")).toBe(true);
      const findings = mathIssuesToFindings(issues, { sceneId: "s03" });
      expect(findings.map((f) => f.id)).toContain("C-10");
      expect(findings.every((f) => f.severity === "BLOCKER")).toBe(true);

      const safe = safeParseJson(raw(file));
      expect(safe.problems).toEqual([]);
      expect(safe.repairs.length).toBeGreaterThan(0);
      expect((safe.value as { latex: string }).latex).toBe(latex);
      expect(scanMathText(safe.value)).toEqual([]);
      expect(compileLatex(latex).ok).toBe(true);
    });
  }
});

describe("invalid JSON escapes", () => {
  it.each([
    ["parse-u.txt", "\\underline{x} + y"],
    ["parse-v.txt", "\\vec{v} = \\vec{a} t"],
  ])("%s: JSON.parse throws, safeParseJson repairs", (file, latex) => {
    expect(() => JSON.parse(raw(file))).toThrow();
    const safe = safeParseJson(raw(file));
    expect((safe.value as { latex: string }).latex).toBe(latex);
    expect(compileLatex(latex).ok).toBe(true);
  });

  it("extracts JSON from a fenced model reply", () => {
    const safe = safeParseJson("Here you go:\n```json\n" + raw("swallowed-f.json") + "```\n");
    expect((safe.value as { latex: string }).latex).toBe("A = \\frac{P}{n}");
  });
});

describe("LaTeX source and display text (C-11)", () => {
  it("slash-text.json: /text and /times are reported and sanitized", () => {
    const value = JSON.parse(raw("slash-text.json")) as { latex: string; display: string };
    const issues = scanMathText(value, "$", { onScreen: true });
    expect(issues.filter((i) => i.code === "slash-command").map((i) => i.path).sort()).toEqual(["$.display", "$.latex"]);
    expect(mathIssuesToFindings(issues).map((f) => f.id)).toContain("C-11");
    const fixed = sanitizeLatex(value.latex);
    expect(fixed.changed).toBe(true);
    expect(fixed.latex).toBe("\\text{Revenue} = P \\times Q");
    expect(checkLatexSource(fixed.latex)).toEqual([]);
    expect(compileLatex(fixed.latex).ok).toBe(true);
  });

  it("doubled-backslash.json: a doubled command is reported and sanitized", () => {
    const value = JSON.parse(raw("doubled-backslash.json")) as { latex: string };
    expect(value.latex).toBe("\\\\frac{a}{b}");
    expect(checkLatexSource(value.latex).map((i) => i.code)).toContain("doubled-backslash");
    const fixed = sanitizeLatex(value.latex);
    expect(fixed.latex).toBe("\\frac{a}{b}");
    expect(compileLatex(fixed.latex).ok).toBe(true);
  });

  it("unbalanced-braces.json: reported as C-11 and fails KaTeX as C-12", () => {
    const value = JSON.parse(raw("unbalanced-braces.json")) as { latex: string };
    expect(checkLatexSource(value.latex).map((i) => i.code)).toContain("unbalanced-braces");
    expect(mathIssuesToFindings(scanMathText(value)).map((f) => f.id)).toContain("C-11");
    expect(compileLatex(value.latex).ok).toBe(false);
    const k = checkKatex(value, "$", { sceneId: "s05" });
    expect(k).toHaveLength(1);
    expect(k[0]).toMatchObject({ id: "C-12", severity: "BLOCKER", sceneId: "s05" });
  });

  it("dollar signs inside latex are reported and stripped", () => {
    expect(checkLatexSource("$x^2$").map((i) => i.code)).toContain("dollar-in-latex");
    expect(sanitizeLatex("$x^2$").latex).toBe("x^2");
  });

  it("raw LaTeX and raw scripts in on-screen text are reported", () => {
    expect(checkPlainText("the \\frac of two").map((i) => i.code)).toContain("raw-latex-in-text");
    expect(checkPlainText("x^2 grows", { onScreen: true }).map((i) => i.code)).toContain("raw-script-in-text");
    expect(checkPlainText("plain words, $1,000 and 5%", { onScreen: true })).toEqual([]);
  });

  it("non-display keys are not scanned", () => {
    expect(scanMathText({ id: "a_b", template: "x^y", title: "Fine" }, "$", { onScreen: true })).toEqual([]);
  });

  it("collects LaTeX from nested data and compiles good formulas", () => {
    const refs = collectLatex({ formula: { latex: "A = P(1 + r)^{t}" }, steps: [{ latex: "1000 \\times 1.05 = 1050" }] });
    expect(refs.map((r) => r.path)).toEqual(["$.formula.latex", "$.steps[0].latex"]);
    expect(checkKatex({ formula: { latex: "A = P(1 + r)^{t}" } })).toEqual([]);
  });
});
