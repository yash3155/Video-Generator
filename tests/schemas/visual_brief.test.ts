import { describe, it } from "vitest";
import { VisualBrief } from "../../src/schemas";
import { clone, visualBrief } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("visual_brief schema", () => {
  it("accepts a minimal brief", () => expectValid(VisualBrief, visualBrief()));

  it("rejects an unknown topology", () => {
    const b = clone(visualBrief()) as { scenes: { topology: string }[] };
    b.scenes[0].topology = "slideshow";
    expectInvalid(VisualBrief, b, ["scenes", 0, "topology"]);
  });

  it("requires key elements", () => {
    const b = clone(visualBrief());
    b.scenes[0].keyElements = [];
    expectInvalid(VisualBrief, b, ["scenes", 0, "keyElements"]);
  });

  it("requires at least three scenes", () => {
    const b = clone(visualBrief());
    b.scenes = b.scenes.slice(0, 1);
    expectInvalid(VisualBrief, b, ["scenes"]);
  });
});
