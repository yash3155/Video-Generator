import { describe, expect, it } from "vitest";
import { Episode } from "../../src/schemas/episode";
import { checkHook, checkDiversity, checkSummary, isDefinitionFirst, mentionsNumber, SPOILER_RE, type DiversityScene } from "../../src/pedagogy/structure-rules";
import { rawEpisode, runAllChecks } from "./good-part";

const ids = (ep: unknown) => [...new Set(runAllChecks(ep).map((f) => f.id))].sort();

describe("the good part passes every Phase 4 engine", () => {
  it("demo-ch01-p1 episode has no findings", () => {
    const findings = runAllChecks(rawEpisode());
    expect(findings, JSON.stringify(findings, null, 1)).toEqual([]);
  });
});

describe("mutations of the good part fail with the expected ids", () => {
  it("a definition-first hook fails P-01", () => {
    const ep = rawEpisode();
    ep.scenes[0].beats[0].narration.en.display = "Compound interest is defined as interest on interest. Why does that matter for my savings?";
    expect(ids(ep)).toContain("P-01");
  });

  it("a spoiled quiz option fails", () => {
    const ep = rawEpisode();
    const quiz = ep.scenes.find((s) => s.template === "interactive_quiz")!;
    const options = quiz.data.options as string[];
    options[quiz.data.correctIndex as number] += " (correct)";
    const found = ids(ep);
    expect(found.some((id) => id === "P-06" || id === "P-09")).toBe(true);
  });

  it("a changed worked-example result fails C-13", () => {
    const ep = rawEpisode();
    const s = ep.scenes.find((x) => x.template === "worked_example")!;
    (s.data.result as { value: number }).value = 1175.63;
    expect(ids(ep)).toContain("C-13");
  });

  it("a swallowed backslash in a formula fails C-10", () => {
    const ep = rawEpisode();
    const s = ep.scenes.find((x) => x.template === "worked_example")!;
    (s.data.formula as { latex: string }).latex = "A = P\times(1 + r)^{t}";
    expect(ids(ep)).toContain("C-10");
  });

  it("an unexplained acronym in narration fails P-03", () => {
    const ep = rawEpisode();
    ep.scenes[2].beats[0].narration.en.display += " Banks print the APY next to every account.";
    expect(ids(ep)).toContain("P-03");
  });

  it("a long sentence fails P-05", () => {
    const ep = rawEpisode();
    ep.scenes[1].beats[1].narration.en.display =
      "The bank takes your money and lends it to other people who pay the bank for using it and the bank then shares a small part of that payment with you as interest which is added to your account at the end of every single year.";
    expect(ids(ep)).toContain("P-05");
  });
});

describe("structure helpers", () => {
  it("detects definition-first openings but not questions", () => {
    expect(isDefinitionFirst("Interest is defined as the price of money.")).toBe(true);
    expect(isDefinitionFirst("Compound interest is a way banks pay you.")).toBe(true);
    expect(isDefinitionFirst("Why did my savings barely grow?")).toBe(false);
  });

  it("matches the D.5 spoiler regex", () => {
    expect(SPOILER_RE.test("1,157.63 (correct)")).toBe(true);
    expect(SPOILER_RE.test("1,157.63")).toBe(false);
  });

  it("recognises number words", () => {
    expect(mentionsNumber("Rule three says", 3, "en")).toBe(true);
    expect(mentionsNumber("rule 3", 3, "en")).toBe(true);
    expect(mentionsNumber("नियम तीन", 3, "hi")).toBe(true);
  });

  it("flags repeated adjacent templates and low diversity", () => {
    const scenes: DiversityScene[] = Array.from({ length: 12 }, (_, i) => ({ index: i, template: i < 6 ? "progressive_cards" : "chat_story" }));
    const f = checkDiversity(scenes);
    expect(f.length).toBeGreaterThan(0);
    expect(new Set(f.map((x) => x.id))).toEqual(new Set(["P-10"]));
  });

  it("hook and summary checks run on the parsed good episode", () => {
    const ep = Episode.parse(rawEpisode());
    expect(checkHook(ep)).toEqual([]);
    expect(checkSummary(ep)).toEqual([]);
  });
});
