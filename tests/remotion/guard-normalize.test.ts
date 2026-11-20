import { describe, expect, it } from "vitest";
import { RenderDataError, scanRenderable, text } from "../../src/remotion/mappers/guard";
import { chartViewModel, coerceTemplateData, normalizeTemplateData, parseNumberedLine } from "../../src/remotion/mappers/normalize";
import { DataChartData } from "../../src/remotion/templates/schemas";

describe("render-data guard", () => {
  it("never turns an object into on-screen text", () => {
    expect(() => text({ a: 1 }, "data.x")).toThrow(/\[object Object\]/);
    expect(() => text(undefined, "data.x")).toThrow(RenderDataError);
    expect(() => text(Number.NaN, "data.x")).toThrow(/NaN/);
    expect(() => text("   ", "data.x")).toThrow(/empty/);
    expect(text("Compound interest", "data.x")).toBe("Compound interest");
    expect(text(42, "data.x")).toBe("42");
  });

  it("finds junk tokens deep in template data but ignores ids and LaTeX", () => {
    const issues = scanRenderable({ cards: [{ id: "null", title: "[object Object]", body: "ok" }, { title: "TODO later", body: "fine" }], formula: { latex: "\\text{undefined}" } });
    expect(issues.map((i) => i.token)).toEqual(["[object Object]", "TODO"]);
    expect(issues[0].path).toBe("data.cards[0].title");
  });

  it("does not flag words that merely contain a token", () => {
    expect(scanRenderable({ title: "Nullify the annulled TODOS? No: nullable" })).toEqual([]);
  });
});

describe("template data normalization", () => {
  it("parses numbered summary lines", () => {
    expect(parseNumberedLine("3. Compound: interest on interest")).toEqual({ title: "Compound", text: "interest on interest" });
    expect(parseNumberedLine("4) Start early and let time work")).toEqual({ title: "Start early and let", text: "Start early and let time work" });
  });

  it("coerces polymorphic model output into the schema shape", () => {
    const rules = Array.from({ length: 8 }, (_, i) => `${i + 1}. Rule ${i + 1}: explanation ${i + 1}`);
    const d = normalizeTemplateData("summary_thread", { title: "Rules", rules });
    expect(d.rules[2]).toEqual({ id: "rule-3", title: "Rule 3", text: "explanation 3" });
    const chat = coerceTemplateData("chat_story", { messages: ["novice: Why?", "Mentor: Because."] }) as { messages: { speaker: string; text: string }[] };
    expect(chat.messages.map((m) => m.speaker)).toEqual(["novice", "mentor"]);
    const nested = normalizeTemplateData("composite_layout", {
      arrangement: "stacked",
      panels: [
        { template: "progressive_cards", data: { cards: ["1. One: first", "2. Two: second"] } },
        { template: "causal_chain", data: { links: ["rate rises", "payments rise", "budget shrinks"] } },
      ],
    });
    expect(nested.panels[1].template).toBe("causal_chain");
  });

  it("rejects bad data with a path", () => {
    expect(() => normalizeTemplateData("progressive_cards", { cards: [{ id: "a", title: "A", body: "x" }] })).toThrow();
    expect(() => normalizeTemplateData("tug_of_war", { left: { id: "l", label: "undefined", points: ["a"] }, right: { id: "r", label: "R", points: ["b"] }, resolution: { id: "z", label: "Z", text: "t" } })).toThrow(/undefined/);
  });

  it("generates chart curves from the formula and picks nice domains", () => {
    const data = DataChartData.parse({
      kind: "line",
      title: "Growth",
      xAxis: { label: "Years", unit: "years" },
      yAxis: { label: "Balance", unit: "dollars" },
      series: [{ id: "c", label: "Compound", generator: { expression: "P * (1 + r)^t", variable: "t", from: 0, to: 10, step: 1, scope: { P: 1000, r: 0.1 } } }],
      markers: [{ id: "m", x: 10, y: 2593.74, label: "$2,594" }],
    });
    const vm = chartViewModel(data);
    expect(vm.series[0].points).toHaveLength(11);
    expect(vm.series[0].points[10].y).toBeCloseTo(2593.74, 1);
    expect(vm.yDomain[0]).toBe(0);
    expect(vm.yDomain[1]).toBeGreaterThanOrEqual(2593.74);
    expect(vm.xDomain).toEqual([0, 10]);
  });
});
