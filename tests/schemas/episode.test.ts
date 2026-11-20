import { describe, it } from "vitest";
import { Episode } from "../../src/schemas";
import { clone, episode } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("episode schema", () => {
  it("accepts a minimal episode", () => expectValid(Episode, episode()));

  it("rejects template data that does not match the template", () => {
    const e = clone(episode()) as { scenes: { template: string }[] };
    e.scenes[0].template = "tug_of_war";
    expectInvalid(Episode, e, ["scenes", 0, "data"]);
  });

  it("rejects an unknown template", () => {
    const e = clone(episode()) as { scenes: { template: string }[] };
    e.scenes[0].template = "freeform_html";
    expectInvalid(Episode, e, ["scenes", 0]);
  });

  it("rejects malformed scene ids", () => {
    const e = clone(episode());
    e.scenes[0].id = "scene0";
    expectInvalid(Episode, e, ["scenes", 0, "id"]);
  });

  it("allows at most three takeaways", () => {
    const e = clone(episode());
    e.scenes[0].takeaways = ["a", "b", "c", "d"];
    expectInvalid(Episode, e, ["scenes", 0, "takeaways"]);
  });

  it("requires pauseAfterMs on every beat", () => {
    const e = clone(episode()) as { scenes: { beats: Record<string, unknown>[] }[] };
    delete e.scenes[0].beats[0].pauseAfterMs;
    expectInvalid(Episode, e, ["scenes", 0, "beats", 0, "pauseAfterMs"]);
  });

  it("rejects non-text chat messages", () => {
    const e = clone(episode()) as { scenes: { data: { messages: { text: unknown }[] } }[] };
    e.scenes[0].data.messages[0].text = { value: 1 };
    expectInvalid(Episode, e, ["scenes", 0, "data", "messages", 0, "text"]);
  });

  it("requires provenance", () => {
    const e = clone(episode()) as Record<string, unknown>;
    delete e.provenance;
    expectInvalid(Episode, e, ["provenance"]);
  });
});
