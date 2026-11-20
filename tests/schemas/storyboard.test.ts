import { describe, it } from "vitest";
import { Storyboard } from "../../src/schemas";
import { clone, storyboard } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("storyboard schema", () => {
  it("accepts a minimal storyboard", () => expectValid(Storyboard, storyboard()));

  it("rejects a template outside the library", () => {
    const s = clone(storyboard()) as { scenes: { template: string }[] };
    s.scenes[0].template = "bullet_list";
    expectInvalid(Storyboard, s, ["scenes", 0, "template"]);
  });

  it("requires a justification", () => {
    const s = clone(storyboard());
    s.scenes[0].justification = "";
    expectInvalid(Storyboard, s, ["scenes", 0, "justification"]);
  });

  it("requires beats", () => {
    const s = clone(storyboard());
    s.scenes[2].beats = [];
    expectInvalid(Storyboard, s, ["scenes", 2, "beats"]);
  });
});
