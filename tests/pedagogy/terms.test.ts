import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ConceptRegister } from "../../src/schemas/register";
import { checkTermIntroductions, containsExpansion, explainsConcept, findConcept } from "../../src/pedagogy/concept-register";
import { detectTerms, wordPattern } from "../../src/pedagogy/term-detector";

type Beat = { sceneId: string; beatId: string; text: string };
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "fixtures", "pedagogy", "unexplained-acronym.json"), "utf8")) as { register: unknown; bad: Beat[]; good: Beat[] };
const register = ConceptRegister.parse(fixture.register);

describe("term detector", () => {
  it("finds acronyms, glossary terms and symbols once each, in order", () => {
    const hits = detectTerms("The APR and the APRs differ from simple interest when P grows.", { glossary: ["simple interest"], symbols: ["P"] });
    expect(hits.map((h) => [h.term, h.kind])).toEqual([
      ["APR", "acronym"],
      ["simple interest", "glossary"],
      ["P", "symbol"],
    ]);
  });

  it("ignores everyday acronyms, Roman numerals and contractions", () => {
    expect(detectTerms("It is OK to watch TV in Part II at 9 PM.")).toEqual([]);
    expect(detectTerms("You don't need it.", { symbols: ["t"] })).toEqual([]);
    expect(wordPattern("t", "u").test("over t years")).toBe(true);
  });

  it("matches Devanagari terms as whole words", () => {
    expect(wordPattern("ब्याज").test("साधारण ब्याज में")).toBe(true);
    expect(wordPattern("ब्याज").test("ब्याजदर")).toBe(false);
  });
});

describe("first-mention clarification (P-03)", () => {
  it("unexplained-acronym.json bad variant: the acronym is used without its expansion", () => {
    const f = checkTermIntroductions(fixture.bad, register, { lang: "en" });
    expect(f).toHaveLength(1);
    expect(f[0]).toMatchObject({ id: "P-03", severity: "HIGH", beatId: "s02b1" });
    expect(f[0].message).toContain("annual percentage rate");
  });

  it("unexplained-acronym.json good variant: expansion and plain meaning at first mention", () => {
    expect(checkTermIntroductions(fixture.good, register, { lang: "en" })).toEqual([]);
  });

  it("reports unregistered terms", () => {
    const f = checkTermIntroductions([{ sceneId: "s01", beatId: "s01b1", text: "Banks report an EMI every month for each loan they hold." }], register, { lang: "en" });
    expect(f.map((x) => x.message).join()).toContain("EMI");
    expect(f[0].severity).toBe("HIGH");
  });

  it("looks up concepts by term, full form and plural acronym", () => {
    expect(findConcept(register, "APRs")?.id).toBe("K01");
    expect(findConcept(register, "Annual Percentage Rate")?.id).toBe("K01");
    expect(containsExpansion("the rate, annual and percentage based", "annual percentage rate")).toBe(true);
    expect(explainsConcept("APR means the yearly cost of a loan.", register.concepts[0], "en")).toBe(true);
    expect(explainsConcept("APR is printed in large type.", register.concepts[0], "en")).toBe(false);
  });
});
