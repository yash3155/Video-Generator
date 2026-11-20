import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { checkNarrationCraft, countWords, fleschKincaidGrade, narrationMetrics, splitSentences, type CraftBeat } from "../../src/pedagogy/narration-metrics";

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "fixtures", "pedagogy", "long-sentence.json"), "utf8")) as { lang: string; audience: string; beats: CraftBeat[] };

const ok = (beatId: string, text: string): CraftBeat => ({ sceneId: "s01", beatId, text });

describe("narration craft (P-05)", () => {
  it("long-sentence.json: a sentence over the limit is a HIGH finding", () => {
    const f = checkNarrationCraft(fixture.beats, { lang: fixture.lang, audience: fixture.audience });
    const high = f.filter((x) => x.severity === "HIGH");
    expect(high).toHaveLength(1);
    expect(high[0]).toMatchObject({ id: "P-05", beatId: "s03b1" });
    expect(high[0].message).toMatch(/sentence of \d+ words/);
  });

  it("splitting the long sentence clears the HIGH finding", () => {
    const text =
      "When you save money, the bank pays you interest every year. That interest is added to your balance. Next year you earn interest on your first deposit. You also earn interest on the interest already added.";
    const f = checkNarrationCraft([ok("s03b1", text)], { lang: "en" });
    expect(f.filter((x) => x.severity === "HIGH")).toEqual([]);
  });

  it("flags banned fillers and beats outside the word budget", () => {
    const filler = ok("s01b1", "Let's dive in. Basically the bank pays you a small amount every year for keeping your money with it, and that amount grows over time.");
    const short = ok("s01b2", "Money grows over time.");
    const ids = checkNarrationCraft([filler, short], { lang: "en" }).map((x) => x.message);
    expect(ids.some((m) => m.includes("banned filler"))).toBe(true);
    expect(ids.some((m) => m.includes("only 4 words"))).toBe(true);
  });

  it("exempts transition and thinking beats from the word budget", () => {
    const f = checkNarrationCraft([{ ...ok("s09b2", "Take a moment and pick one answer."), exemptBudget: true }], { lang: "en" });
    expect(f.filter((x) => x.beatId === "s09b2")).toEqual([]);
  });

  it("gives Hindi narration a larger word budget", () => {
    const words = Array.from({ length: 80 }, () => "पैसा").join(" ");
    const text = words.split(" ").reduce((acc, w, i) => acc + w + ((i + 1) % 10 === 0 ? "। " : " "), "");
    expect(checkNarrationCraft([ok("s01b1", text)], { lang: "en" }).some((x) => x.message.includes("budget 25-75"))).toBe(true);
    expect(checkNarrationCraft([ok("s01b1", text)], { lang: "hi" }).some((x) => /\d+ words \(budget/.test(x.message) && x.severity === "HIGH")).toBe(false);
  });
});

describe("narration metrics", () => {
  it("splits sentences without breaking decimals or abbreviations", () => {
    expect(splitSentences("It grows to 1,157.63 dollars. Then it grows again, e.g. next year! Does it?")).toHaveLength(3);
    expect(splitSentences("पैसा बढ़ता है। फिर और बढ़ता है।")).toHaveLength(2);
  });

  it("counts words and grades readability", () => {
    expect(countWords("one two  three")).toBe(3);
    const easy = fleschKincaidGrade("The cat sat on the mat. The dog ran to the cat.");
    const hard = fleschKincaidGrade("Institutional heterogeneity complicates intertemporal macroeconomic comparisons considerably.");
    expect(easy).toBeLessThan(hard);
    const m = narrationMetrics("Money grows. It grows faster each year because interest earns interest.", "en");
    expect(m.sentences).toBe(2);
    expect(m.maxSentenceWords).toBe(9);
  });
});
