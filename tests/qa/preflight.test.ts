import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readJson, writeJson } from "../../src/core/fsutil";
import { Episode } from "../../src/schemas/episode";

const CLEAN_FIXTURE = path.resolve(__dirname, "..", "fixtures", "qa", "clean");

describe("runPreflight", () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ol-preflight-"));
    vi.stubEnv("OPENLECTERN_HOME", tmpRoot);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  function copyCleanPart() {
    const bookDir = path.join(tmpRoot, "workspace", "books", "clean");
    const partDir = path.join(bookDir, "chapters", "ch01", "p1");
    fs.mkdirSync(partDir, { recursive: true });
    for (const f of ["book.config.json", "course_map.json"]) {
      const src = path.join(CLEAN_FIXTURE, "book", f);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(bookDir, f));
    }
    for (const f of fs.readdirSync(path.join(CLEAN_FIXTURE, "part"))) {
      fs.copyFileSync(path.join(CLEAN_FIXTURE, "part", f), path.join(partDir, f));
    }
    return { bookDir, partDir };
  }

  it("passes cleanly on the canonical QA clean fixture", async () => {
    copyCleanPart();
    const { runPreflight } = await import("../../src/qa/preflight");
    const res = await runPreflight({ bookId: "clean", chapterId: "ch01", partId: "p1", langs: ["en"] });
    expect(res.findings.filter((f) => f.severity === "BLOCKER" || f.severity === "HIGH")).toEqual([]);
    expect(res.ok).toBe(true);
  });

  it("rejects deprecated legacy files and quiz show mistakes", async () => {
    const { partDir } = copyCleanPart();
    writeJson(path.join(partDir, "02_lesson_plan.json"), { legacy: true });
    const ep = Episode.parse(readJson(path.join(partDir, "08_episode.json")));
    const quiz = ep.scenes.find((s) => s.template === "interactive_quiz");
    if (!quiz) throw new Error("clean fixture has no interactive_quiz");
    quiz.beats[0].visual.show = ["question"];
    writeJson(path.join(partDir, "08_episode.json"), ep);

    const { runPreflight } = await import("../../src/qa/preflight");
    const res = await runPreflight({ bookId: "clean", chapterId: "ch01", partId: "p1", langs: ["en"] });
    expect(res.ok).toBe(false);
    expect(res.findings.some((f) => f.message.includes("02_lesson_plan.json"))).toBe(true);
    expect(res.findings.some((f) => f.id === "A-06" && f.message.includes("visual.show"))).toBe(true);
  });
});
