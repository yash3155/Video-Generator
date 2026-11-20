import { describe, it } from "vitest";
import { BookConfig } from "../../src/schemas";
import { clone, demoConfig } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("book_config schema", () => {
  it("accepts the demo book config", () => expectValid(BookConfig, demoConfig()));

  it("requires confirmed rights", () => {
    const c = clone(demoConfig());
    c.rights.confirmed = false;
    expectInvalid(BookConfig, c, ["rights", "confirmed"]);
  });

  it("rejects malformed language codes", () => {
    const c = clone(demoConfig());
    c.narrationLanguages = ["English"];
    expectInvalid(BookConfig, c, ["narrationLanguages"]);
  });

  it("rejects target minutes with max below min", () => {
    const c = clone(demoConfig());
    c.targetMinutes = { min: 12, max: 5 };
    expectInvalid(BookConfig, c, ["targetMinutes"]);
  });

  it("requires at least one chapter", () => {
    const c = clone(demoConfig());
    c.chapters = [];
    expectInvalid(BookConfig, c, ["chapters"]);
  });
});
