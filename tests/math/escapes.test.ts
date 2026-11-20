import { describe, expect, it } from "vitest";
import { extractJsonText, repairRawJsonEscapes, safeParseJson, scanControlChars } from "../../src/math/escapes";

describe("LaTeX-safe JSON parsing", () => {
  it.each([
    ["\\frac{a}{b}", "frac"],
    ["\\text{rate}", "text"],
    ["\\times", "times"],
    ["\\theta", "theta"],
    ["\\beta", "beta"],
    ["\\right)", "right"],
    ["\\neq", "neq"],
    ["\\underline{x}", "underline"],
  ])("keeps %s intact when the model forgot to double the backslash", (latex) => {
    const raw = `{"latex": "${latex}"}`;
    expect((safeParseJson(raw).value as { latex: string }).latex).toBe(latex);
  });

  it("doubles invalid escapes such as \\v and \\sqrt", () => {
    const r = safeParseJson('{"latex": "\\sqrt{x} + \\vec{v}"}');
    expect((r.value as { latex: string }).latex).toBe("\\sqrt{x} + \\vec{v}");
    expect(r.repairs.length).toBe(2);
  });

  it("leaves correct JSON escapes alone", () => {
    const r = safeParseJson('{"latex": "\\\\frac{1}{2}", "text": "line one\\nline two", "q": "say \\"hi\\""}');
    expect(r.value).toEqual({ latex: "\\frac{1}{2}", text: "line one\nline two", q: 'say "hi"' });
    expect(r.repairs).toEqual([]);
    expect(r.problems).toEqual([]);
  });

  it("repairs control characters left in parsed latex fields and reports the rest", () => {
    const parsed = { latex: "\frac{1}{2} \times 3", narration: "tab\there", other: "\u0007bell" };
    const r = scanControlChars(parsed);
    expect((r.value as { latex: string }).latex).toBe("\\frac{1}{2} \\times 3");
    expect(r.problems.map((p) => p.path).sort()).toEqual(["$.narration", "$.other"]);
  });

  it("allows newlines in text but not in latex", () => {
    expect(scanControlChars({ text: "a\nb" }).problems).toEqual([]);
    expect(scanControlChars({ latex: "a\nb" }).problems).toHaveLength(1);
  });

  it("extracts JSON from fenced or chatty output", () => {
    expect(extractJsonText('Sure!\n```json\n{"a": 1}\n```\nDone.')).toBe('{"a": 1}');
    expect(extractJsonText('Here: {"a": {"b": 2}} ok')).toBe('{"a": {"b": 2}}');
    expect(() => extractJsonText("no json")).toThrow();
  });

  it("does not touch backslashes outside strings", () => {
    expect(repairRawJsonEscapes('{"a": 1}').text).toBe('{"a": 1}');
  });
});
