import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { BookConfig } from "../../src/schemas/book";
import { CourseMap } from "../../src/schemas/course";
import { configFromFlags, defaultLlm, defaultPersonas, parseToc, slugify } from "../../src/cli/wizard";
import { deliverableParts, toMakeOptions } from "../../src/cli/make-cmds";

describe("wizard helpers", () => {
  it("parse a pasted table of contents", () => {
    expect(parseToc("1. Simple Interest\nChapter 2: Rates\n\n3) Inflation")).toEqual([
      { id: "ch01", number: 1, title: "Simple Interest" },
      { id: "ch02", number: 2, title: "Rates" },
      { id: "ch03", number: 3, title: "Inflation" },
    ]);
    expect(parseToc("Intro; Basics").map((c) => c.id)).toEqual(["ch01", "ch02"]);
  });

  it("build a valid config from flags and refuse without the rights confirmation", () => {
    const flags = { title: "My Book", author: "A. Writer", chapters: "1. One; 2. Two", lang: "en,hi", llm: "mock", tts: "mock" };
    expect(() => configFromFlags(flags)).toThrow(/rights/);
    const cfg = configFromFlags({ ...flags, iOwnThisBook: true });
    expect(BookConfig.parse(cfg).id).toBe("my-book");
    expect(cfg.personas.hi.mentor.name).toBe("Sharma ji");
    expect(cfg.chapters).toHaveLength(2);
  });

  it("edit an existing config instead of overwriting it", () => {
    const prev = BookConfig.parse(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "examples", "demo-book", "book.config.json"), "utf8")));
    const cfg = configFromFlags({ book: "demo", author: "Someone Else" }, prev);
    expect(cfg.author).toBe("Someone Else");
    expect(cfg.title).toBe(prev.title);
    expect(cfg.pronunciation).toEqual(prev.pronunciation);
    expect(cfg.research).toEqual(prev.research);
  });

  it("pick defaults", () => {
    expect(slugify("Hull: Options, Futures!")).toBe("hull-options-futures");
    expect(defaultPersonas("en").novice.name).toBe("Alex");
    expect(defaultPersonas("fr").novice.voice).toMatch(/\w/);
    expect(defaultLlm({}, false)).toBe("agent-handoff");
    expect(defaultLlm({ ANTHROPIC_API_KEY: "x" }, true)).toBe("anthropic");
  });
});

describe("make options", () => {
  it("parse scenes, languages, stages and review flags", () => {
    const o = toMakeOptions({ book: "demo", scenes: "0, 9,11", lang: "en", until: "s8", force: "S7,S8", review: false, nonInteractive: true }, "ch01", "p1");
    expect(o.scenes).toEqual([0, 9, 11]);
    expect(o.langs).toEqual(["en"]);
    expect(o.until).toBe("S8");
    expect(o.force).toEqual(["S7", "S8"]);
    expect(o.noReview).toBe(true);
    expect(o.handoff).toBe("exit");
    expect(() => toMakeOptions({ book: "demo", until: "S99" }, "ch01", "p1")).toThrow(/unknown stage/);
    expect(() => toMakeOptions({ book: "demo", scenes: "a" }, "ch01", "p1")).toThrow(/scene index/);
  });

  it("order deliverables: chapters, then orientation, then synthesis", () => {
    const prev = BookConfig.parse(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "examples", "demo-book", "book.config.json"), "utf8")));
    const part = (id: string) => [{ id, title: id, sections: ["x"], estimatedMinutes: 8 }];
    const ch = (id: string, number: number, kind: "chapter_part" | "orientation" | "synthesis") => ({ id, number, title: id, moduleId: "m", summary: "s", kind, parts: part("p1"), prerequisites: [] });
    const map = CourseMap.parse({ bookId: "demo", courseTitle: "T", modules: [{ id: "m", title: "M", chapterIds: ["orientation", "ch01", "ch02", "synthesis"] }], chapters: [ch("orientation", 0, "orientation"), ch("ch01", 1, "chapter_part"), ch("ch02", 2, "chapter_part"), ch("synthesis", 3, "synthesis")] });
    expect(deliverableParts(prev, map).map((x) => x.chapterId)).toEqual(["ch01", "ch02", "orientation"]);
    const only1 = { ...prev, deliverables: { orientation: false, synthesis: true, chapters: { from: 1, to: 1 } } };
    expect(deliverableParts(only1, map).map((x) => x.chapterId)).toEqual(["ch01", "synthesis"]);
  });
});
