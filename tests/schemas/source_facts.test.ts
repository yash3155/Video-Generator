import { describe, it } from "vitest";
import { SourceFacts } from "../../src/schemas";
import { clone, sourceFacts } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("source_facts schema", () => {
  it("accepts minimal source facts with a formula", () => expectValid(SourceFacts, sourceFacts()));

  it("rejects malformed fact ids", () => {
    const s = clone(sourceFacts());
    s.facts[0].id = "fact1";
    expectInvalid(SourceFacts, s, ["facts", 0, "id"]);
  });

  it("rejects an unknown category", () => {
    const s = clone(sourceFacts()) as { facts: { category: string }[] };
    s.facts[0].category = "opinion";
    expectInvalid(SourceFacts, s, ["facts", 0, "category"]);
  });

  it("requires a citation", () => {
    const s = clone(sourceFacts()) as { facts: Record<string, unknown>[] };
    delete s.facts[0].citation;
    expectInvalid(SourceFacts, s, ["facts", 0, "citation"]);
  });

  it("requires every formula variable to have a unit", () => {
    const s = clone(sourceFacts()) as { facts: { formula?: { variables: Record<string, unknown>[] } }[] };
    delete s.facts[1].formula!.variables[0].unit;
    expectInvalid(SourceFacts, s, ["facts", 1, "formula", "variables", 0, "unit"]);
  });

  it("allows at most two quotes", () => {
    const s = clone(sourceFacts()) as { quotes: unknown[] };
    const q = { text: "q", citation: { chapter: "1" } };
    s.quotes = [q, q, q];
    expectInvalid(SourceFacts, s, ["quotes"]);
  });

  it("requires a real-world problem tied to facts", () => {
    const s = clone(sourceFacts());
    s.realWorldProblem.factIds = [];
    expectInvalid(SourceFacts, s, ["realWorldProblem", "factIds"]);
  });
});
