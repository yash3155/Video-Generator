import { describe, it } from "vitest";
import { ConceptRegister } from "../../src/schemas";
import { clone, conceptRegister } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("concept_register schema", () => {
  it("accepts a minimal register", () => expectValid(ConceptRegister, conceptRegister()));

  it("requires at least one concept", () => expectInvalid(ConceptRegister, { concepts: [] }, ["concepts"]));

  it("rejects malformed concept ids", () => {
    const r = clone(conceptRegister());
    r.concepts[0].id = "C1";
    expectInvalid(ConceptRegister, r, ["concepts", 0, "id"]);
  });

  it("rejects an unknown depth", () => {
    const r = clone(conceptRegister()) as { concepts: { depth: string }[] };
    r.concepts[0].depth = "L9";
    expectInvalid(ConceptRegister, r, ["concepts", 0, "depth"]);
  });

  it("requires the plain meaning and role", () => {
    const r = clone(conceptRegister());
    r.concepts[0].plainMeaning = "";
    expectInvalid(ConceptRegister, r, ["concepts", 0, "plainMeaning"]);
  });
});
