import { describe, it } from "vitest";
import { EpisodeCompiled } from "../../src/schemas";
import { clone, episodeCompiled } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("episode_compiled schema", () => {
  it("accepts a minimal compiled episode", () => expectValid(EpisodeCompiled, episodeCompiled()));

  it("requires 30 fps", () => {
    const c = clone(episodeCompiled()) as { fps: number };
    c.fps = 25;
    expectInvalid(EpisodeCompiled, c, ["fps"]);
  });

  it("requires 1920x1080", () => {
    const c = clone(episodeCompiled()) as { width: number };
    c.width = 1280;
    expectInvalid(EpisodeCompiled, c, ["width"]);
  });

  it("rejects an unknown timing source", () => {
    const c = clone(episodeCompiled()) as { timelines: Record<string, { beats: { timingSource: string }[] }> };
    c.timelines.en.beats[0].timingSource = "guessed";
    expectInvalid(EpisodeCompiled, c, ["timelines", "en", "beats", 0, "timingSource"]);
  });

  it("limits caption phrases to 16 words", () => {
    const c = clone(episodeCompiled());
    const w = { text: "w", startMs: 0, endMs: 10 };
    c.timelines.en.beats[0].captions = [{ startMs: 0, endMs: 10, words: Array.from({ length: 17 }, () => w) }];
    expectInvalid(EpisodeCompiled, c, ["timelines", "en", "beats", 0, "captions", 0, "words"]);
  });

  it("requires a positive beat duration", () => {
    const c = clone(episodeCompiled());
    c.timelines.en.beats[0].durationInFrames = 0;
    expectInvalid(EpisodeCompiled, c, ["timelines", "en", "beats", 0, "durationInFrames"]);
  });
});
