import { describe, it } from "vitest";
import { TeachingScript } from "../../src/schemas";
import { clone, teachingScript } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("teaching_script schema", () => {
  it("accepts a minimal script", () => expectValid(TeachingScript, teachingScript()));

  it("rejects malformed beat ids", () => {
    const s = clone(teachingScript());
    s.scenes[0].beats[0].id = "beat-1";
    expectInvalid(TeachingScript, s, ["scenes", 0, "beats", 0, "id"]);
  });

  it("rejects an unknown speaker", () => {
    const s = clone(teachingScript()) as { scenes: { beats: { speaker: string }[] }[] };
    s.scenes[0].beats[0].speaker = "host";
    expectInvalid(TeachingScript, s, ["scenes", 0, "beats", 0, "speaker"]);
  });

  it("requires display narration text", () => {
    const s = clone(teachingScript());
    s.scenes[0].beats[0].narration.en.display = "";
    expectInvalid(TeachingScript, s, ["scenes", 0, "beats", 0, "narration", "en", "display"]);
  });

  it("requires at least one beat per scene", () => {
    const s = clone(teachingScript());
    s.scenes[1].beats = [];
    expectInvalid(TeachingScript, s, ["scenes", 1, "beats"]);
  });
});
