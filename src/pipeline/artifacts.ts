/* Artifact paths of a part (Part C workspace layout) and shared loaders. */
import fs from "node:fs";
import path from "node:path";
import { exists, readJson, readText } from "../core/fsutil";
import { REPO_ROOT, bookDir, outBookDir, researchDir } from "../core/paths";
import type { PartContext } from "./types";

export const A = {
  facts: "01_source_facts.json",
  audit: "02_content_audit.json",
  register: "03_concept_register.json",
  plan: "04_lesson_plan.json",
  scriptJson: "05_teaching_script.json",
  scriptMd: "05_teaching_script.md",
  brief: "06_visual_brief.json",
  storyboard: "07_storyboard.json",
  episode: "08_episode.json",
  compiled: "09_episode_compiled.json",
} as const;

export const p = (ctx: Pick<PartContext, "partDir">, name: string) => path.join(ctx.partDir, name);

export function bookConfigFile(bookId: string): string {
  return path.join(bookDir(bookId), "book.config.json");
}
export function courseMapFile(bookId: string): string {
  return path.join(bookDir(bookId), "course_map.json");
}
export function glossaryFile(bookId: string): string {
  return path.join(bookDir(bookId), "course_glossary.json");
}
export function researchFile(ctx: Pick<PartContext, "bookId" | "chapterId" | "partId">): string {
  return path.join(researchDir(ctx.bookId, ctx.chapterId, ctx.partId), "notebook_context.md");
}
export function pipelineDir(ctx: Pick<PartContext, "partDir">): string {
  return path.join(ctx.partDir, ".pipeline");
}
export function repairFile(ctx: Pick<PartContext, "partDir">, stage: string): string {
  return path.join(pipelineDir(ctx), "repair", `${stage}.json`);
}
export function audioDir(ctx: Pick<PartContext, "partDir">, lang: string): string {
  return path.join(ctx.partDir, "audio", lang);
}
export function renderFile(ctx: Pick<PartContext, "partDir">, lang: string): string {
  return path.join(ctx.partDir, "render", `${lang}.mp4`);
}
export function qaDir(ctx: Pick<PartContext, "partDir">): string {
  return path.join(ctx.partDir, "qa");
}
export function outDir(ctx: Pick<PartContext, "bookId">, releasable: boolean): string {
  return outBookDir(ctx.bookId, !releasable);
}
export function videoBase(ctx: Pick<PartContext, "chapterId" | "partId">, lang: string): string {
  return `${ctx.chapterId}_${ctx.partId}_${lang}`;
}

export function loadJson<T>(file: string): T {
  if (!exists(file)) throw new Error(`missing artifact ${file}; run the earlier stages first`);
  return readJson<T>(file);
}

/** Concatenated Markdown of the named standards (docs/standards/<NAME>.md) for prompts. */
export function standardsText(names: string[]): string {
  return names
    .map((n) => path.join(REPO_ROOT, "docs", "standards", `${n}.md`))
    .filter(exists)
    .map((f) => readText(f).trim())
    .join("\n\n");
}

/** The shipped example folder whose book.config.json id matches the book (examples/demo-book for "demo"). */
export function exampleDirFor(bookId: string): string | undefined {
  const root = path.join(REPO_ROOT, "examples");
  if (!exists(root)) return undefined;
  for (const d of fs.readdirSync(root, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const f = path.join(root, d.name, "book.config.json");
    if (exists(f)) {
      try {
        if (readJson<{ id?: string }>(f).id === bookId) return path.join(root, d.name);
      } catch {
        /* ignore malformed examples */
      }
    }
  }
  return undefined;
}
