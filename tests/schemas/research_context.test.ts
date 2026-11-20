import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ResearchContext } from "../../src/schemas";
import { parseResearch } from "../../src/research/gate";
import { clone, researchContext } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("research_context schema", () => {
  it("accepts a minimal context", () => expectValid(ResearchContext, researchContext()));

  it("accepts the parsed demo research file", () => {
    const file = path.join(__dirname, "..", "..", "examples", "demo-book", "research", "ch01", "p1", "notebook_context.md");
    const parsed = parseResearch(fs.readFileSync(file, "utf8"));
    expect(parsed).toBeTruthy();
    expectValid(ResearchContext, parsed);
  });

  it("rejects an unknown connector", () => {
    const r = clone(researchContext()) as { header: { connector: string } };
    r.header.connector = "carrier-pigeon";
    expectInvalid(ResearchContext, r, ["header", "connector"]);
  });

  it("rejects a malformed sha256", () => {
    const r = clone(researchContext());
    r.header.sha256 = "xyz";
    expectInvalid(ResearchContext, r, ["header", "sha256"]);
  });

  it("rejects an empty body", () => {
    const r = clone(researchContext());
    r.body = "";
    expectInvalid(ResearchContext, r, ["body"]);
  });
});
