import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { BookConfig } from "../../src/schemas/book";
import { TeachingScript } from "../../src/schemas/script";
import { Storyboard, VisualBrief } from "../../src/schemas/storyboard";
import { EpisodeFill } from "../../src/schemas/episode";
import { buildScaffold, mergeEpisode, sceneId, type ScaffoldMeta } from "../../src/pipeline/episode";
import { kindLayout } from "../../src/pipeline/layout";

const root = path.join(__dirname, "..", "..");
const fx = (kind: string) => JSON.parse(fs.readFileSync(path.join(root, "tests", "fixtures", "llm", kind, "ch01_p1.json"), "utf8"));
const cfg = BookConfig.parse(JSON.parse(fs.readFileSync(path.join(root, "examples", "demo-book", "book.config.json"), "utf8")));
const script = TeachingScript.parse(fx("teaching_script"));
const sb = fx("storyboard");
const brief = VisualBrief.parse(sb.visualBrief);
const board = Storyboard.parse(sb.storyboard);
const fill = EpisodeFill.parse(fx("episode_fill"));
const meta: ScaffoldMeta = {
  bookId: "demo",
  chapterId: "ch01",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Money That Grows",
  chapterLabel: "Chapter 1",
  partLabel: "Part 1",
  title: "Simple and Compound Interest",
  displayLanguage: "en",
  languages: ["en", "hi"],
  personas: cfg.personas,
  progress: { index: 1, total: 4 },
  theme: "dark-classroom",
};
const quiz = kindLayout("chapter_part").quiz;

describe("S9 scaffold and merge", () => {
  const scaffold = buildScaffold(meta, script, brief, board, quiz);

  it("takes scenes, templates and narration from S7/S8 with default pauses", () => {
    expect(scaffold.scenes.map((s) => s.id)).toEqual(script.scenes.map((s) => sceneId(s.index)));
    const q = scaffold.scenes.find((s) => s.index === quiz)!;
    expect(q.beats[1].pauseAfterMs).toBeGreaterThanOrEqual(3200);
    expect(scaffold.scenes[0].template).toBe(board.scenes[0].template);
  });

  it("merges the fill into a valid episode stamped with mock provenance", () => {
    const r = mergeEpisode(scaffold, fill, true);
    if (!r.ok) throw new Error(r.problems.join("\n"));
    expect(r.episode.provenance.mock).toBe(true);
    expect(r.episode.scenes).toHaveLength(script.scenes.length);
    expect(r.episode.scenes[0].beats[0].narration.hi.display.length).toBeGreaterThan(10);
  });

  it("reports missing scenes and unknown beats", () => {
    const missing = { scenes: fill.scenes.slice(1) };
    const r1 = mergeEpisode(scaffold, missing);
    expect(r1.ok).toBe(false);
    if (!r1.ok) expect(r1.problems[0]).toMatch(/scene 0 .* has no fill/);
    const extra = structuredClone(fill);
    extra.scenes[0].beats.push({ ...extra.scenes[0].beats[0], id: "s00b99" });
    const r2 = mergeEpisode(scaffold, extra);
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.problems.join("\n")).toMatch(/unknown beat s00b99/);
  });
});
