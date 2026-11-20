import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SourceFacts } from "../../src/schemas/facts";
import { ConceptRegister } from "../../src/schemas/register";
import { LessonPlan } from "../../src/schemas/plan";
import { factsGate, planGate, registerGate } from "../../src/pipeline/gates";

const fx = (kind: string) => JSON.parse(fs.readFileSync(path.join(__dirname, "..", "fixtures", "llm", kind, "ch01_p1.json"), "utf8"));
const facts = SourceFacts.parse(fx("source_facts"));
const register = ConceptRegister.parse(fx("concept_register"));
const plan = LessonPlan.parse(fx("lesson_plan"));

describe("pipeline gates on the mock fixtures", () => {
  it("accept the hand-authored ch01 p1 facts, register and plan", () => {
    expect(factsGate(facts, { bookId: "demo", chapterId: "ch01", partId: "p1" })).toEqual([]);
    expect(registerGate(register, { facts })).toEqual([]);
    expect(planGate(plan, { kind: "chapter_part", facts, register })).toEqual([]);
  });

  it("reject a numerical example without a recomputable numbers block", () => {
    const bad = structuredClone(facts);
    const ex = bad.facts.find((f) => f.category === "numerical_example")!;
    delete ex.numbers;
    expect(factsGate(bad, { bookId: "demo", chapterId: "ch01", partId: "p1" }).join("\n")).toMatch(/numerical example without a numbers block/);
  });

  it("reject numbers that do not recompute", () => {
    const bad = structuredClone(facts);
    const ex = bad.facts.find((f) => f.numbers?.steps.some((s) => s.expr))!;
    ex.numbers!.steps.find((s) => s.expr)!.value += 10;
    expect(factsGate(bad, { bookId: "demo", chapterId: "ch01", partId: "p1" }).join("\n")).toMatch(/recomputed/);
  });

  it("reject wrong ids and a plan with missing scenes", () => {
    expect(factsGate(facts, { bookId: "other", chapterId: "ch01", partId: "p1" })).toContain('bookId must be "other"');
    const short = { ...plan, sceneOutline: plan.sceneOutline.slice(0, 5) };
    expect(planGate(short, { kind: "chapter_part", facts, register }).join("\n")).toMatch(/sceneOutline indexes/);
  });
});
