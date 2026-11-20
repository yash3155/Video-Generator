/* Pipeline stages S0-S14 (Part D). Each stage declares its input files and parameters (the cache fingerprint) and its outputs. */
import fs from "node:fs";
import path from "node:path";
import { ensureDir, exists, hashOf, readJson, readText, sha256File, writeJson, writeText } from "../core/fsutil";
import { bookDir, partDir as partDirOf, researchDir, workspaceDir } from "../core/paths";
import { mediaDurationSec } from "../core/proc";
import { log } from "../core/log";
import { BookConfig } from "../schemas/book";
import { CourseGlossary, CourseMap, type PartKind } from "../schemas/course";
import { SourceFacts } from "../schemas/facts";
import { ContentAudit } from "../schemas/audit";
import { ConceptRegister } from "../schemas/register";
import { LessonPlan } from "../schemas/plan";
import { TeachingScript } from "../schemas/script";
import { Storyboard, VisualBrief } from "../schemas/storyboard";
import { Episode, type EpisodeFill } from "../schemas/episode";
import { EpisodeCompiled, type CompiledBeat, type LanguageTimeline } from "../schemas/compiled";
import { QaReport, type QaReview } from "../schemas/qa";
import { formatResearch, gateResearch, parseResearch } from "../research/gate";
import { prepareManualResearch, extractionVars, renderExtractionPrompt } from "../research/manual";
import { createTtsProvider, FallbackTts, type TtsProvider } from "../tts";
import { postProcessBeat } from "../tts/post";
import { buildCaptions, matchAnchor, spokenText } from "../tts/speech";
import { beatAudioHash, beatVoice } from "../tts/voices";
import { TEMPLATE_REGISTRY, templateJsonSchema } from "../remotion/templates/registry";
import type { TemplateId } from "../remotion/templates/schemas";
import { rendererHash } from "../render/bundle";
import { contactSheet, pruneBundles, renderLessonStills, renderLessonVideo, type LessonStill } from "../render/lesson";
import { mergeRuns, screenStrings, type CheckRun, type OtherPart } from "../qa/content";
import { ARTIFACT_SCHEMAS, runPartChecks } from "../qa/part";
import { buildReport, releaseChecks, writeReport, type ReportStill } from "../qa/report";
import { factsGate } from "./gates";
import { buildScaffold, mergeEpisode, type ScaffoldMeta } from "./episode";
import { fixedScenesText, fixedTemplatesText, kindLayout } from "./layout";
import { llmCall } from "./llm-stage";
import {
  A,
  audioDir,
  bookConfigFile,
  courseMapFile,
  exampleDirFor,
  glossaryFile,
  loadJson,
  outDir,
  p,
  qaDir,
  renderFile,
  repairFile,
  researchFile,
  videoBase,
} from "./artifacts";
import { AwaitingResearchError, StageGateError, type PartContext, type Stage, type StageId } from "./types";

const FPS = 30;
const base = (lang: string) => lang.split("-")[0];

export function kindOf(chapterId: string): PartKind {
  if (chapterId === "orientation") return "orientation";
  if (chapterId === "synthesis") return "synthesis";
  return "chapter_part";
}

/* ---------- shared helpers ---------- */

function cfgSubset(ctx: PartContext) {
  const c = ctx.cfg;
  return { audience: c.audience, displayLanguage: c.displayLanguage, allowedTemplates: c.allowedTemplates, boilerplateDenylist: c.boilerplateDenylist };
}

function availableTemplates(ctx: PartContext) {
  const allowed = ctx.cfg.allowedTemplates;
  return TEMPLATE_REGISTRY.filter((t) => !allowed || allowed.includes(t.id)).map((t) => ({ id: t.id, title: t.title, description: t.description, topologies: t.topologies, animationTargets: t.animationTargets, level: t.level }));
}

function personaNames(ctx: PartContext) {
  const p0 = ctx.cfg.personas[ctx.cfg.displayLanguage] ?? Object.values(ctx.cfg.personas)[0];
  return { noviceName: p0?.novice.name ?? "Learner", mentorName: p0?.mentor.name ?? "Mentor" };
}

export interface PartInfo {
  map: CourseMap;
  chapter: CourseMap["chapters"][number];
  part: CourseMap["chapters"][number]["parts"][number];
  progress: { index: number; total: number };
  chapterLabel: string;
  partLabel: string;
}

export function partInfo(ctx: Pick<PartContext, "bookId" | "chapterId" | "partId">): PartInfo {
  const map = CourseMap.parse(loadJson(courseMapFile(ctx.bookId)));
  const chapter = map.chapters.find((c) => c.id === ctx.chapterId);
  if (!chapter) throw new Error(`chapter ${ctx.chapterId} is not in the course map (chapters: ${map.chapters.map((c) => c.id).join(", ")})`);
  const pi = chapter.parts.findIndex((x) => x.id === ctx.partId);
  if (pi < 0) throw new Error(`part ${ctx.partId} is not in chapter ${ctx.chapterId} (parts: ${chapter.parts.map((x) => x.id).join(", ")})`);
  const all = map.chapters.flatMap((c) => c.parts.map((x) => `${c.id}/${x.id}`));
  const chapterLabel = chapter.kind === "orientation" ? "Orientation" : chapter.kind === "synthesis" ? "Synthesis" : `Chapter ${chapter.number}`;
  return { map, chapter, part: chapter.parts[pi], progress: { index: all.indexOf(`${ctx.chapterId}/${ctx.partId}`), total: all.length }, chapterLabel, partLabel: `Part ${pi + 1}` };
}

function gate(stage: StageId, problems: string[]): void {
  if (problems.length) throw new StageGateError(stage, problems);
}

function selectedScenes<T extends { index: number }>(ctx: PartContext, scenes: T[]): T[] {
  if (!ctx.scenes?.length) return scenes;
  const out = scenes.filter((s) => ctx.scenes!.includes(s.index));
  const missing = ctx.scenes.filter((i) => !scenes.some((s) => s.index === i));
  if (missing.length) throw new Error(`--scenes ${missing.join(",")} not in the episode (scenes 0-${scenes.length - 1})`);
  return out;
}

function scriptMarkdown(script: TeachingScript, title: string): string {
  const lines = [`# ${title}`, ""];
  for (const s of script.scenes) {
    lines.push(`## Scene ${s.index}: ${s.title}`, "", `_${s.purpose}_`, "");
    for (const b of s.beats) {
      lines.push(`**${b.id}** (${b.speaker}; facts ${b.sourceFactIds.join(", ") || "none"})`, "");
      for (const l of script.languages) if (b.narration[l]) lines.push(`- ${l}: ${b.narration[l].display}`);
      lines.push(`- on screen: ${b.onScreenIntent}`, "");
    }
  }
  return lines.join("\n");
}

/* ---------- S0 book config ---------- */

const S0: Stage = {
  id: "S0",
  name: "book config",
  version: 1,
  inputs: (ctx) => {
    const ex = exampleDirFor(ctx.bookId);
    return { files: ex ? [path.join(ex, "book.config.json")] : [], params: {} };
  },
  outputs: (ctx) => [bookConfigFile(ctx.bookId)],
  run: async (ctx) => {
    const f = bookConfigFile(ctx.bookId);
    if (!exists(f)) {
      const ex = exampleDirFor(ctx.bookId);
      if (!ex) throw new Error(`no book config at ${f}; run \`openlectern start\` to create book "${ctx.bookId}"`);
      ensureDir(path.dirname(f));
      fs.copyFileSync(path.join(ex, "book.config.json"), f);
      log.info(`copied the example book config from ${path.relative(process.cwd(), ex) || ex}`);
    }
    const r = BookConfig.safeParse(readJson(f));
    if (!r.success) throw new StageGateError("S0", r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
  },
};

/* ---------- S1 research ---------- */

function exampleResearch(bookId: string, chapterId: string, partId: string): string | null {
  const ex = exampleDirFor(bookId);
  if (!ex) return null;
  const f = path.join(ex, "research", chapterId, partId, "notebook_context.md");
  return exists(f) ? f : null;
}

/** Research files of every chapter part (examples for the demo connector, else the workspace), for orientation and synthesis. */
function chapterResearchFiles(ctx: PartContext): string[] {
  const demo = ctx.cfg.research.connector === "demo";
  const out: string[] = [];
  for (const c of ctx.cfg.chapters) {
    const root = demo ? path.join(exampleDirFor(ctx.bookId) ?? "", "research", c.id) : path.join(bookDir(ctx.bookId), "chapters", c.id);
    if (!exists(root)) continue;
    for (const part of fs.readdirSync(root).sort()) {
      const f = demo ? path.join(root, part, "notebook_context.md") : path.join(researchDir(ctx.bookId, c.id, part), "notebook_context.md");
      if (exists(f)) out.push(f);
    }
  }
  return out;
}

function demote(md: string): string {
  return md.replace(/^(#{1,5})\s/gm, (_m, h: string) => `#${h} `);
}

const S1: Stage = {
  id: "S1",
  name: "research",
  version: 1,
  inputs: (ctx) => {
    const kind = kindOf(ctx.chapterId);
    const files = kind !== "chapter_part" ? chapterResearchFiles(ctx) : [exampleResearch(ctx.bookId, ctx.chapterId, ctx.partId)].filter((x): x is string => !!x);
    return { files, params: { mode: ctx.cfg.research.mode, connector: ctx.cfg.research.connector ?? null, notebookId: ctx.cfg.research.notebookId ?? null, localFile: ctx.cfg.research.localFile ?? null, kind } };
  },
  outputs: (ctx) => [researchFile(ctx)],
  run: async (ctx) => {
    const out = researchFile(ctx);
    const kind = kindOf(ctx.chapterId);
    const r = ctx.cfg.research;
    if (kind !== "chapter_part") {
      const files = chapterResearchFiles(ctx);
      if (!files.length) throw new Error(`the ${kind} lesson is built from the chapters' research; run the chapters' S1 first`);
      const body = files
        .map((f) => {
          const parsed = parseResearch(readText(f));
          const h = parsed.header;
          const ch = ctx.cfg.chapters.find((c) => c.id === h?.chapterId);
          return `## Chapter ${ch?.number ?? "?"}: ${ch?.title ?? h?.chapterId ?? path.basename(path.dirname(f))} (${h?.partId ?? ""})\n\n${demote(parsed.body).trim()}`;
        })
        .join("\n\n");
      const header = { bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId, connector: (r.connector === "demo" ? "demo" : "local-file") as "demo" | "local-file", sourceIds: [], query: `${kind}: the research of every chapter, concatenated`, timestamp: new Date().toISOString() };
      writeText(out, formatResearch(header, `# ${kind === "orientation" ? "Orientation" : "Synthesis"} research: ${ctx.cfg.title}\n\n${body}`));
    } else if (r.connector === "demo") {
      const src = exampleResearch(ctx.bookId, ctx.chapterId, ctx.partId);
      if (!src) throw new Error(`the demo connector has no research for ${ctx.chapterId}/${ctx.partId}`);
      ensureDir(path.dirname(out));
      fs.copyFileSync(src, out);
    } else if (exists(out) && gateResearch(readText(out)).ok) {
      log.info(`using the existing research at ${out}`);
    } else if (r.mode === "local-file" && r.localFile) {
      const { extractBookText, splitChapters } = await import("../research/local-file");
      const text = await extractBookText(r.localFile);
      const ch = ctx.cfg.chapters.find((c) => c.id === ctx.chapterId);
      if (!ch) throw new Error(`chapter ${ctx.chapterId} is not in the book config`);
      const chText = splitChapters(text, ctx.cfg.chapters).get(ch.number);
      if (!chText) throw new Error(`could not find chapter ${ch.number} (${ch.title}) in ${r.localFile}`);
      const next = ctx.cfg.chapters.find((c) => c.number === ch.number + 1);
      const prompt = renderExtractionPrompt(extractionVars(ctx.cfg, ctx.chapterId, ctx.partId, ch.title, next?.title ?? "the end of the book"));
      const res = await llmCall<{ markdown: string }>(ctx, { stage: "S1", kind: "research_extract", input: { chapterId: ctx.chapterId, partId: ctx.partId, chapterText: chText }, vars: { extractionPrompt: prompt } });
      const header = { bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId, connector: "local-file" as const, sourceIds: [], query: "chapter_extraction", timestamp: new Date().toISOString() };
      writeText(out, formatResearch(header, res.markdown));
    } else {
      const ch = ctx.cfg.chapters.find((c) => c.id === ctx.chapterId);
      const next = ch ? ctx.cfg.chapters.find((c) => c.number === ch.number + 1) : undefined;
      if (r.mode === "notebooklm" && r.notebookId) {
        const { detectNlm, NlmCli } = await import("../research/connectors");
        const nlm = detectNlm();
        if (nlm) {
          const prompt = renderExtractionPrompt(extractionVars(ctx.cfg, ctx.chapterId, ctx.partId, ch?.title ?? ctx.chapterId, next?.title ?? "the end of the book"));
          const answer = new NlmCli(nlm.bin, nlm.flavor).query(r.notebookId, prompt);
          const header = { bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId, connector: "nlm-cli" as const, notebookId: r.notebookId, sourceIds: [], query: "chapter_extraction", timestamp: new Date().toISOString() };
          writeText(out, formatResearch(header, answer));
        }
      }
      if (!exists(out) || !gateResearch(readText(out)).ok) {
        const m = prepareManualResearch(ctx.cfg, ctx.chapterId, ctx.partId, ch?.title ?? ctx.chapterId, next?.title ?? "the end of the book");
        throw new AwaitingResearchError(m.dropFile, m.pasteFile, `paste the NotebookLM answer for ${ctx.chapterId}/${ctx.partId}`);
      }
    }
    const g = gateResearch(readText(out));
    gate("S1", g.problems);
  },
};

/* ---------- S2 course map (book level) ---------- */

function withSpecialParts(map: CourseMap, cfg: BookConfig): CourseMap {
  const chapters = map.chapters.filter((c) => c.kind === "chapter_part" && c.id !== "orientation" && c.id !== "synthesis");
  const modules = map.modules.filter((m) => m.id !== "orientation" && m.id !== "synthesis").map((m) => ({ ...m, chapterIds: m.chapterIds.filter((id) => chapters.some((c) => c.id === id)) }));
  const sections = chapters.map((c) => c.id);
  if (cfg.deliverables.orientation) {
    modules.unshift({ id: "orientation", title: "Orientation", chapterIds: ["orientation"] });
    chapters.unshift({ id: "orientation", number: 0, title: "Orientation", moduleId: "orientation", summary: `Why ${map.courseTitle} matters, its biggest myth, the reading journey and one formula demystified.`, kind: "orientation", parts: [{ id: "p1", title: `Why ${map.courseTitle} matters`, sections, estimatedMinutes: 8 }], prerequisites: [] });
  }
  if (cfg.deliverables.synthesis) {
    const n = Math.max(...chapters.map((c) => c.number)) + 1;
    modules.push({ id: "synthesis", title: "Synthesis", chapterIds: ["synthesis"] });
    chapters.push({ id: "synthesis", number: n, title: "Synthesis", moduleId: "synthesis", summary: `How the chapters of ${map.courseTitle} fit together.`, kind: "synthesis", parts: [{ id: "p1", title: "Putting it all together", sections, estimatedMinutes: 8 }], prerequisites: chapters.filter((c) => c.kind === "chapter_part").map((c) => c.id) });
  }
  return CourseMap.parse({ ...map, modules, chapters });
}

function courseMapInput(ctx: PartContext) {
  return { bookId: ctx.bookId, title: ctx.cfg.title, author: ctx.cfg.author, domain: ctx.cfg.domain, audience: ctx.cfg.audience, chapters: ctx.cfg.chapters, targetMinutes: ctx.cfg.targetMinutes };
}

const S2: Stage = {
  id: "S2",
  name: "course map",
  version: 1,
  inputs: (ctx) => ({ files: [repairFile(ctx, "S2")], params: { input: courseMapInput(ctx), deliverables: ctx.cfg.deliverables, llmMock: ctx.llmMock } }),
  outputs: (ctx) => [courseMapFile(ctx.bookId)],
  run: async (ctx) => {
    const f = courseMapFile(ctx.bookId);
    const shaFile = path.join(bookDir(ctx.bookId), ".pipeline", "course_map.input.sha");
    const key = hashOf({ input: courseMapInput(ctx), deliverables: ctx.cfg.deliverables, llmMock: ctx.llmMock, repair: exists(repairFile(ctx, "S2")) ? readText(repairFile(ctx, "S2")) : null });
    if (exists(f) && exists(shaFile) && readText(shaFile).trim() === key) {
      log.info("course map is current (built by another part)");
      const st = exists(path.join(bookDir(ctx.bookId), ".pipeline", "course_map.mock")) ? true : false;
      if (st) ctx.mockStages.add("S2");
    } else {
      const map = await llmCall<CourseMap>(ctx, {
        stage: "S2",
        kind: "course_map",
        input: courseMapInput(ctx),
        vars: { minMinutes: ctx.cfg.targetMinutes.min, maxMinutes: ctx.cfg.targetMinutes.max },
        standards: ["LEARNING_PROGRESSION", "ORIENTATION_AND_SYNTHESIS"],
        chapterId: "book",
        partId: "map",
      });
      writeJson(f, withSpecialParts(map, ctx.cfg));
      writeText(shaFile, key);
      const mockMark = path.join(bookDir(ctx.bookId), ".pipeline", "course_map.mock");
      if (ctx.mockStages.has("S2")) writeText(mockMark, "mock");
      else if (exists(mockMark)) fs.rmSync(mockMark);
    }
    partInfo(ctx);
  },
};

/* ---------- S3 source facts ---------- */

const S3: Stage = {
  id: "S3",
  name: "source facts",
  version: 1,
  inputs: (ctx) => ({ files: [researchFile(ctx), courseMapFile(ctx.bookId), repairFile(ctx, "S3")], params: { llmMock: ctx.llmMock } }),
  outputs: (ctx) => [p(ctx, A.facts)],
  run: async (ctx) => {
    const info = partInfo(ctx);
    const research = parseResearch(readText(researchFile(ctx)));
    const facts = await llmCall<SourceFacts>(ctx, {
      stage: "S3",
      kind: "source_facts",
      input: { bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId, kind: info.chapter.kind, partTitle: info.part.title, sections: info.part.sections, research: research.body },
      vars: { partTitle: info.part.title },
      standards: ["SOURCE_GROUNDING", "FORMULA_RULES"],
    });
    writeJson(p(ctx, A.facts), facts);
  },
};

/* ---------- S4 content audit (deterministic) ---------- */

const S4: Stage = {
  id: "S4",
  name: "content audit",
  version: 1,
  inputs: (ctx) => ({ files: [p(ctx, A.facts)], params: {} }),
  outputs: (ctx) => [p(ctx, A.audit)],
  run: async (ctx) => {
    const facts = SourceFacts.parse(loadJson(p(ctx, A.facts)));
    const problems = factsGate(facts, { bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId });
    const categories: Record<string, number> = {};
    for (const f of facts.facts) categories[f.category] = (categories[f.category] ?? 0) + 1;
    const audit: ContentAudit = {
      status: problems.length ? "FAIL" : "PASS",
      factCount: facts.facts.length,
      categories,
      formulasCompiled: facts.facts.filter((f) => f.formula).length,
      numbersRecomputed: facts.facts.filter((f) => f.numbers).length,
      issues: problems.map((m) => ({ severity: "HIGH" as const, code: "S4", message: m, factId: m.match(/^(F\d+)/)?.[1] })),
    };
    writeJson(p(ctx, A.audit), ContentAudit.parse(audit));
    gate("S4", problems);
  },
};

/* ---------- S5 concept register (+ course glossary) ---------- */

function priorGlossary(ctx: PartContext) {
  const f = glossaryFile(ctx.bookId);
  if (!exists(f)) return [];
  const g = CourseGlossary.safeParse(readJson(f));
  if (!g.success) return [];
  return g.data.concepts.filter((c) => !(c.introducedIn.chapterId === ctx.chapterId && c.introducedIn.partId === ctx.partId));
}

const S5: Stage = {
  id: "S5",
  name: "concept register",
  version: 1,
  inputs: (ctx) => ({ files: [p(ctx, A.facts), repairFile(ctx, "S5")], params: { llmMock: ctx.llmMock, glossary: priorGlossary(ctx) } }),
  outputs: (ctx) => [p(ctx, A.register)],
  run: async (ctx) => {
    const facts = SourceFacts.parse(loadJson(p(ctx, A.facts)));
    const prior = priorGlossary(ctx);
    const reg = await llmCall<ConceptRegister>(ctx, {
      stage: "S5",
      kind: "concept_register",
      input: { chapterId: ctx.chapterId, partId: ctx.partId, kind: kindOf(ctx.chapterId), facts, glossary: prior },
      standards: ["JIT_CONCEPT_CLARIFICATION"],
    });
    writeJson(p(ctx, A.register), reg);
    const added = reg.concepts
      .filter((c) => c.familiarity === "new")
      .map((c) => ({ term: c.term, fullForm: c.fullForm, definition: c.plainMeaning, introducedIn: { chapterId: ctx.chapterId, partId: ctx.partId }, aliases: c.aliases }));
    const gf = glossaryFile(ctx.bookId);
    const old = exists(gf) ? CourseGlossary.safeParse(readJson(gf)) : null;
    const analogies = (old?.success ? old.data.analogies : []).filter((a) => !(a.chapterId === ctx.chapterId && a.partId === ctx.partId));
    for (const c of reg.concepts) if (c.analogy && c.familiarity === "new") analogies.push({ chapterId: ctx.chapterId, partId: ctx.partId, conceptTerm: c.term, analogy: c.analogy });
    writeJson(gf, CourseGlossary.parse({ bookId: ctx.bookId, concepts: [...prior, ...added], analogies }));
  },
};

/* ---------- S6 lesson plan ---------- */

const S6: Stage = {
  id: "S6",
  name: "lesson plan",
  version: 1,
  inputs: (ctx) => ({ files: [p(ctx, A.facts), p(ctx, A.register), repairFile(ctx, "S6")], params: { llmMock: ctx.llmMock, kind: kindOf(ctx.chapterId) } }),
  outputs: (ctx) => [p(ctx, A.plan)],
  run: async (ctx) => {
    const kind = kindOf(ctx.chapterId);
    const layout = kindLayout(kind);
    const facts = SourceFacts.parse(loadJson(p(ctx, A.facts)));
    const register = ConceptRegister.parse(loadJson(p(ctx, A.register)));
    const standards = ["LEARNING_PROGRESSION", "SCENE_STRUCTURE", "ASSESSMENT", ...(kind !== "chapter_part" ? ["ORIENTATION_AND_SYNTHESIS"] : [])];
    const plan = await llmCall<LessonPlan>(ctx, {
      stage: "S6",
      kind: "lesson_plan",
      input: { kind, facts, register },
      vars: { kind, sceneCount: layout.sceneCount, lastScene: layout.sceneCount - 1, sceneStructure: layout.structure },
      standards,
    });
    writeJson(p(ctx, A.plan), plan);
  },
};

/* ---------- S7 teaching script ---------- */

function scriptParams(ctx: PartContext) {
  return { kind: kindOf(ctx.chapterId), languages: ctx.cfg.narrationLanguages, cfg: cfgSubset(ctx), personas: ctx.cfg.personas };
}

const S7: Stage = {
  id: "S7",
  name: "teaching script",
  version: 1,
  inputs: (ctx) => ({ files: [p(ctx, A.facts), p(ctx, A.register), p(ctx, A.plan), courseMapFile(ctx.bookId), repairFile(ctx, "S7")], params: { llmMock: ctx.llmMock, ...scriptParams(ctx) } }),
  outputs: (ctx) => [p(ctx, A.scriptJson), p(ctx, A.scriptMd)],
  run: async (ctx) => {
    const sp = scriptParams(ctx);
    const facts = SourceFacts.parse(loadJson(p(ctx, A.facts)));
    const register = ConceptRegister.parse(loadJson(p(ctx, A.register)));
    const plan = LessonPlan.parse(loadJson(p(ctx, A.plan)));
    const names = personaNames(ctx);
    const script = await llmCall<TeachingScript>(ctx, {
      stage: "S7",
      kind: "teaching_script",
      input: { ...sp, facts, register, plan },
      vars: { ...names, languages: sp.languages.join(", "), fixedScenes: fixedScenesText(kindLayout(sp.kind)) },
      standards: ["NARRATION_CRAFT", "JIT_CONCEPT_CLARIFICATION", "SCENE_STRUCTURE", "ASSESSMENT"],
    });
    writeJson(p(ctx, A.scriptJson), script);
    writeText(p(ctx, A.scriptMd), scriptMarkdown(script, partInfo(ctx).part.title));
  },
};

/* ---------- S8 visual brief + storyboard ---------- */

const S8: Stage = {
  id: "S8",
  name: "storyboard",
  version: 1,
  inputs: (ctx) => ({ files: [p(ctx, A.scriptJson), p(ctx, A.plan), repairFile(ctx, "S8")], params: { llmMock: ctx.llmMock, kind: kindOf(ctx.chapterId), templates: availableTemplates(ctx).map((t) => t.id), displayLanguage: ctx.cfg.displayLanguage } }),
  outputs: (ctx) => [p(ctx, A.brief), p(ctx, A.storyboard)],
  run: async (ctx) => {
    const kind = kindOf(ctx.chapterId);
    const script = TeachingScript.parse(loadJson(p(ctx, A.scriptJson)));
    const plan = LessonPlan.parse(loadJson(p(ctx, A.plan)));
    const dl = ctx.cfg.displayLanguage;
    const slim = {
      scenes: script.scenes.map((s) => ({
        index: s.index,
        title: s.title,
        purpose: s.purpose,
        beats: s.beats.map((b) => ({ id: b.id, speaker: b.speaker, onScreenIntent: b.onScreenIntent, narration: (b.narration[dl] ?? Object.values(b.narration)[0]).display, sourceFactIds: b.sourceFactIds })),
      })),
    };
    const out = await llmCall<{ visualBrief: VisualBrief; storyboard: Storyboard }>(ctx, {
      stage: "S8",
      kind: "storyboard",
      input: { kind, script: slim, plan, availableTemplates: availableTemplates(ctx) },
      vars: { fixedTemplates: fixedTemplatesText(kindLayout(kind)) },
      standards: ["VISUAL_DESIGN", "SCENE_STRUCTURE"],
    });
    writeJson(p(ctx, A.brief), out.visualBrief);
    writeJson(p(ctx, A.storyboard), out.storyboard);
  },
};

/* ---------- S9 episode ---------- */

function scaffoldMeta(ctx: PartContext): ScaffoldMeta {
  const info = partInfo(ctx);
  const langs = ctx.cfg.narrationLanguages;
  return {
    bookId: ctx.bookId,
    chapterId: ctx.chapterId,
    partId: ctx.partId,
    kind: info.chapter.kind,
    courseTitle: info.map.courseTitle,
    chapterLabel: info.chapterLabel,
    partLabel: info.partLabel,
    title: info.part.title,
    displayLanguage: ctx.cfg.displayLanguage,
    languages: langs,
    personas: Object.fromEntries(langs.filter((l) => ctx.cfg.personas[l]).map((l) => [l, ctx.cfg.personas[l]])),
    progress: info.progress,
    theme: ctx.cfg.theme,
  };
}

function templateSchemasText(ids: string[]): string {
  return [...new Set(ids)]
    .sort()
    .map((id) => `### ${id}\n\n\`\`\`json\n${JSON.stringify(templateJsonSchema(id as TemplateId))}\n\`\`\``)
    .join("\n\n");
}

const S9: Stage = {
  id: "S9",
  name: "episode",
  version: 1,
  inputs: (ctx) => ({
    files: [p(ctx, A.scriptJson), p(ctx, A.brief), p(ctx, A.storyboard), p(ctx, A.facts), p(ctx, A.register), p(ctx, A.plan), courseMapFile(ctx.bookId), repairFile(ctx, "S9")],
    params: { llmMock: ctx.llmMock, cfg: cfgSubset(ctx), personas: ctx.cfg.personas, theme: ctx.cfg.theme, languages: ctx.cfg.narrationLanguages },
  }),
  outputs: (ctx) => [p(ctx, A.episode)],
  run: async (ctx) => {
    const kind = kindOf(ctx.chapterId);
    const script = TeachingScript.parse(loadJson(p(ctx, A.scriptJson)));
    const brief = VisualBrief.parse(loadJson(p(ctx, A.brief)));
    const board = Storyboard.parse(loadJson(p(ctx, A.storyboard)));
    const facts = SourceFacts.parse(loadJson(p(ctx, A.facts)));
    const register = ConceptRegister.parse(loadJson(p(ctx, A.register)));
    const plan = LessonPlan.parse(loadJson(p(ctx, A.plan)));
    const scaffold = buildScaffold(scaffoldMeta(ctx), script, brief, board, kindLayout(kind).quiz);
    const fill = await llmCall<EpisodeFill>(ctx, {
      stage: "S9",
      kind: "episode_fill",
      input: { kind, cfg: cfgSubset(ctx), scaffold, facts, register, plan },
      vars: { displayLanguage: ctx.cfg.displayLanguage, templateSchemas: templateSchemasText(board.scenes.map((s) => s.template)) },
      standards: ["VISUAL_DESIGN", "FORMULA_RULES", "ASSESSMENT", "SOURCE_GROUNDING"],
    });
    const mock = [...ctx.mockStages].length > 0;
    const merged = mergeEpisode(scaffold, fill, mock);
    if (!merged.ok) throw new StageGateError("S9", merged.problems);
    writeJson(p(ctx, A.episode), merged.episode);
  },
};

/* ---------- S10 TTS + compile ---------- */

interface BeatAudioMeta {
  hash: string;
  file: string;
  provider: string;
  voice: string;
  mock: boolean;
  timingSource: "boundary" | "aligned" | "estimated";
  durationMs: number;
  words: { text: string; startMs: number; endMs: number }[];
  fallbackReason?: string;
}

async function beatAudio(ctx: PartContext, tts: TtsProvider, lang: string, beatId: string, spoken: string, voice: string): Promise<BeatAudioMeta> {
  const dir = ensureDir(audioDir(ctx, lang));
  const baseFile = path.join(dir, beatId);
  const hash = beatAudioHash(spoken, voice, ctx.cfg.tts.rate, ctx.ttsId);
  const metaFile = `${baseFile}.json`;
  if (exists(metaFile) && exists(`${baseFile}.hash`)) {
    const m = readJson<BeatAudioMeta>(metaFile);
    if (m.hash === hash && readText(`${baseFile}.hash`).trim() === hash && exists(path.join(dir, m.file)) && !m.fallbackReason) return m;
  }
  const raw = await tts.synthesize({ text: spoken, voice, lang, rate: ctx.cfg.tts.rate, outBase: `${baseFile}.raw` });
  for (const ext of [".mp3", ".wav"]) if (exists(baseFile + ext)) fs.rmSync(baseFile + ext);
  let file: string;
  let words = raw.words;
  let durationMs: number;
  if (raw.mock) {
    file = baseFile + path.extname(raw.audioPath);
    fs.renameSync(raw.audioPath, file);
    durationMs = Math.round(mediaDurationSec(file) * 1000);
  } else {
    file = `${baseFile}.mp3`;
    const pp = postProcessBeat(raw.audioPath, words, file);
    fs.rmSync(raw.audioPath, { force: true });
    words = pp.words;
    durationMs = pp.durationMs;
  }
  const meta: BeatAudioMeta = { hash, file: path.basename(file), provider: raw.provider, voice: raw.voice, mock: raw.mock, timingSource: raw.timingSource, durationMs, words, ...(raw.fallbackReason ? { fallbackReason: raw.fallbackReason } : {}) };
  writeJson(metaFile, meta);
  writeText(`${baseFile}.hash`, hash);
  return meta;
}

async function compileLanguage(ctx: PartContext, ep: Episode, lang: string): Promise<{ timeline: LanguageTimeline; files: string[] }> {
  const lex = ctx.cfg.pronunciation[lang] ?? ctx.cfg.pronunciation[base(lang)] ?? {};
  const tts = createTtsProvider(ctx.ttsId);
  const scenes = selectedScenes(ctx, ep.scenes);
  const jobs = scenes.flatMap((s) => s.beats.map((b) => ({ s, b })));
  const metas = new Map<string, BeatAudioMeta>();
  let next = 0;
  const workers = Array.from({ length: Math.min(3, jobs.length) }, async () => {
    while (next < jobs.length) {
      const { b } = jobs[next++];
      const n = b.narration[lang];
      if (!n) throw new Error(`${b.id} has no ${lang} narration`);
      const spoken = spokenText(n, lang, lex);
      metas.set(b.id, await beatAudio(ctx, tts, lang, b.id, spoken, beatVoice(ctx.ttsId, ctx.cfg, lang, b.speaker)));
    }
  });
  await Promise.all(workers);
  let frame = 0;
  const beats: CompiledBeat[] = [];
  const tScenes: LanguageTimeline["scenes"] = [];
  const files: string[] = [];
  for (const s of scenes) {
    const sceneStart = frame;
    for (const b of s.beats) {
      const m = metas.get(b.id)!;
      const fileAbs = path.join(audioDir(ctx, lang), m.file);
      files.push(fileAbs);
      const durationInFrames = Math.max(1, Math.ceil(((m.durationMs + b.pauseAfterMs) / 1000) * FPS));
      const cues: CompiledBeat["cues"] = [];
      const unresolved: string[] = [];
      for (const c of b.visualCues) {
        const anchor = c.anchor[lang] ?? c.anchor[base(lang)];
        const ms = anchor ? matchAnchor(m.words, anchor, lang, lex) : null;
        if (ms === null) unresolved.push(c.target);
        cues.push({ target: c.target, anchor: anchor ?? "", atMs: ms ?? 0, frame: frame + Math.round(((ms ?? 0) / 1000) * FPS) });
      }
      beats.push({
        beatId: b.id,
        sceneId: s.id,
        startFrame: frame,
        durationInFrames,
        audio: { file: path.relative(ctx.partDir, fileAbs).split(path.sep).join("/"), durationMs: m.durationMs, textHash: m.hash, provider: m.provider, voice: m.voice, mock: m.mock },
        pauseAfterMs: b.pauseAfterMs,
        timingSource: m.timingSource,
        words: m.words,
        captions: buildCaptions(m.words, b.narration[lang].display),
        cues,
        unresolvedCues: unresolved,
      });
      frame += durationInFrames;
    }
    tScenes.push({ sceneId: s.id, startFrame: sceneStart, durationInFrames: frame - sceneStart });
  }
  const fb = tts instanceof FallbackTts && tts.fallbackUsed;
  const reason = [...metas.values()].find((m) => m.fallbackReason)?.fallbackReason;
  return {
    timeline: { lang, durationInFrames: Math.max(1, frame), ttsProvider: ctx.ttsId, fallbackUsed: fb || Boolean(reason), ...(reason ? { fallbackReason: reason } : {}), scenes: tScenes, beats },
    files,
  };
}

const S10: Stage = {
  id: "S10",
  name: "speech + timeline",
  version: 1,
  inputs: (ctx) => ({ files: [p(ctx, A.episode)], params: { tts: ctx.ttsId, langs: ctx.langs, scenes: ctx.scenes ?? null, pronunciation: ctx.cfg.pronunciation, rate: ctx.cfg.tts.rate, personas: ctx.cfg.personas } }),
  outputs: (ctx) => [p(ctx, A.compiled)],
  run: async (ctx) => {
    const epFile = p(ctx, A.episode);
    const ep = Episode.parse(loadJson(epFile));
    const timelines: Record<string, LanguageTimeline> = {};
    const files: string[] = [];
    for (const lang of ctx.langs) {
      if (!ep.languages.includes(lang)) throw new Error(`language ${lang} is not in the episode (${ep.languages.join(", ")})`);
      log.info(`speech ${lang}: ${ctx.ttsId}`);
      const r = await compileLanguage(ctx, ep, lang);
      timelines[lang] = r.timeline;
      files.push(...r.files);
    }
    const compiled = EpisodeCompiled.parse({ fps: FPS, width: 1920, height: 1080, episodeHash: sha256File(epFile), episode: ep, timelines });
    writeJson(p(ctx, A.compiled), compiled);
    return { outputs: [p(ctx, A.compiled), ...files] };
  },
};

/* ---------- S11 render ---------- */

function framesDir(ctx: PartContext, lang: string): string {
  return path.join(qaDir(ctx), "frames", lang);
}
function stillsIndex(ctx: PartContext, lang: string): string {
  return path.join(framesDir(ctx, lang), "stills.json");
}
function contactFile(ctx: PartContext, lang: string): string {
  return path.join(qaDir(ctx), `contact_sheet_${lang}.png`);
}

const S11: Stage = {
  id: "S11",
  name: "render",
  version: 2,
  inputs: (ctx) => ({ files: [p(ctx, A.compiled)], params: { draft: ctx.draft, langs: ctx.langs, renderer: rendererHash() } }),
  outputs: (ctx) => ctx.langs.flatMap((l) => [renderFile(ctx, l), stillsIndex(ctx, l), contactFile(ctx, l)]),
  run: async (ctx) => {
    const compiled = EpisodeCompiled.parse(loadJson(p(ctx, A.compiled)));
    const outputs: string[] = [];
    for (const lang of ctx.langs) {
      if (!compiled.timelines[lang]) throw new Error(`no ${lang} timeline in the compiled episode; re-run S10`);
      const out = renderFile(ctx, lang);
      log.info(`render ${lang}${ctx.draft ? " (draft)" : ""}`);
      await renderLessonVideo({ partDir: ctx.partDir, compiled, lang, output: out, draft: ctx.draft });
      const fd = framesDir(ctx, lang);
      if (exists(fd)) fs.rmSync(fd, { recursive: true, force: true });
      log.info(`beat stills ${lang}`);
      const stills = await renderLessonStills({ partDir: ctx.partDir, compiled, lang, outDir: fd, draft: ctx.draft });
      const rel = stills.map((s) => ({ ...s, png: path.relative(ctx.partDir, s.png).split(path.sep).join("/") }));
      writeJson(stillsIndex(ctx, lang), rel);
      contactSheet(
        stills.filter((s) => s.kind === "end").map((s) => s.png),
        contactFile(ctx, lang),
      );
      outputs.push(out, stillsIndex(ctx, lang), contactFile(ctx, lang));
    }
    pruneBundles(3);
    return { outputs };
  },
};

/* ---------- S12 QA ---------- */

export function loadStills(ctx: PartContext, lang: string): LessonStill[] {
  const f = stillsIndex(ctx, lang);
  if (!exists(f)) return [];
  return readJson<LessonStill[]>(f).map((s) => ({ ...s, png: path.join(ctx.partDir, s.png) }));
}

/** Other parts in the workspace (all books) for the bespoke and similarity checks. */
export function otherParts(ctx: Pick<PartContext, "partDir">): OtherPart[] {
  const root = path.join(workspaceDir(), "books");
  const out: OtherPart[] = [];
  if (!exists(root)) return out;
  for (const book of fs.readdirSync(root)) {
    const chRoot = path.join(root, book, "chapters");
    if (!exists(chRoot)) continue;
    for (const ch of fs.readdirSync(chRoot))
      for (const part of fs.readdirSync(path.join(chRoot, ch))) {
        const dir = partDirOf(book, ch, part);
        if (path.resolve(dir) === path.resolve(ctx.partDir)) continue;
        const f = path.join(dir, A.episode);
        if (!exists(f)) continue;
        const ep = Episode.safeParse(readJson(f));
        if (!ep.success) continue;
        out.push({
          id: `${book}/${ch}/${part}`,
          screen: ep.data.scenes.flatMap((s) => screenStrings(s).map((x) => x.text)),
          narration: ep.data.scenes.flatMap((s) => s.beats.map((b) => b.narration[ep.data.displayLanguage]?.display ?? "")).join(" "),
        });
      }
  }
  return out;
}

function reviewSkipReason(ctx: PartContext): string | null {
  if (ctx.opts.noReview) return "--no-review";
  if (ctx.llmMock || ctx.mockStages.size) return "mock LLM (no reviewer)";
  if (ctx.draft || ctx.scenes?.length) return "draft or scene-subset render";
  return null;
}

const S12: Stage = {
  id: "S12",
  name: "QA",
  version: 1,
  inputs: (ctx) => ({
    files: [...ARTIFACT_SCHEMAS.map(([n]) => p(ctx, n)), ...ctx.langs.flatMap((l) => [renderFile(ctx, l), stillsIndex(ctx, l)]), repairFile(ctx, "S12")],
    params: { draft: ctx.draft, scenes: ctx.scenes ?? null, langs: ctx.langs, llmMock: ctx.llmMock, mock: [...ctx.mockStages].sort(), review: reviewSkipReason(ctx), cfg: cfgSubset(ctx), pronunciation: ctx.cfg.pronunciation, others: otherParts(ctx).map((o) => o.id) },
  }),
  outputs: (ctx) => [path.join(qaDir(ctx), "report.json"), path.join(qaDir(ctx), "report.html")],
  run: async (ctx) => {
    const artifacts: Record<string, unknown> = {};
    for (const [n] of ARTIFACT_SCHEMAS) if (exists(p(ctx, n))) artifacts[n] = readJson(p(ctx, n));
    const parsedEp = Episode.safeParse(artifacts[A.episode]);
    const beatById = new Map(parsedEp.success ? parsedEp.data.scenes.flatMap((s) => s.beats.map((b) => [b.id, b] as const)) : []);
    const lexOf = (lang: string) => ctx.cfg.pronunciation[lang] ?? ctx.cfg.pronunciation[base(lang)] ?? {};
    const qa = runPartChecks({
      artifacts,
      episodeHash: exists(p(ctx, A.episode)) ? sha256File(p(ctx, A.episode)) : "",
      cfg: cfgSubset(ctx),
      kind: kindOf(ctx.chapterId),
      langs: ctx.langs,
      scenes: ctx.scenes,
      others: otherParts(ctx),
      partDir: ctx.partDir,
      draft: ctx.draft,
      spoken: (lang, id) => {
        const eb = beatById.get(id);
        return eb?.narration[lang] ? spokenText(eb.narration[lang], lang, lexOf(lang)) : null;
      },
      expectedHash: (lang, id, spoken) => beatAudioHash(spoken, beatVoice(ctx.ttsId, ctx.cfg, lang, beatById.get(id)!.speaker), ctx.cfg.tts.rate, ctx.ttsId),
      renderFile: (lang) => renderFile(ctx, lang),
      stills: (lang) => loadStills(ctx, lang),
    });
    const runs: CheckRun[] = [qa.run];
    const compiled = qa.compiled;
    const skip = reviewSkipReason(ctx);
    let reviews: QaReview[] | undefined;
    if (!skip) {
      reviews = [];
      for (const lang of ctx.langs)
        reviews.push(
          await llmCall<QaReview>(ctx, {
            stage: "S12",
            kind: "review",
            input: { bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId, lang, episodeHash: compiled?.episodeHash ?? null, render: exists(renderFile(ctx, lang)) ? sha256File(renderFile(ctx, lang)) : null },
            vars: { lang, partDir: ctx.partDir },
            scope: `review_${lang}`,
          }),
        );
      writeJson(path.join(qaDir(ctx), "review.json"), { reviews });
    }
    const ttsMock = Object.values(compiled?.timelines ?? {}).some((t) => t.beats.some((b) => b.audio.mock));
    const fallback = Object.values(compiled?.timelines ?? {})
      .filter((t) => t.fallbackUsed)
      .map((t) => ({ lang: t.lang, reason: t.fallbackReason }));
    const flags = { draft: ctx.draft, scenes: ctx.scenes, llmMock: ctx.llmMock || ctx.mockStages.size > 0, ttsMock, fallback, reviews, reviewSkipped: skip ?? undefined };
    runs.push(releaseChecks(flags));
    const all = mergeRuns(...runs);
    const report = buildReport({ bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId, languages: ctx.langs }, all, flags);
    const stills: ReportStill[] = ctx.langs.flatMap((lang) =>
      loadStills(ctx, lang)
        .filter((s) => s.kind === "end")
        .map((s) => ({ png: s.png, lang, sceneId: s.sceneId, beatId: s.beatId, narration: beatById.get(s.beatId)?.narration[lang]?.display ?? "" })),
    );
    writeReport(qaDir(ctx), report, { contactSheets: ctx.langs.map((lang) => ({ lang, png: contactFile(ctx, lang) })), stills });
    const s = report.summary;
    log.info(`QA: ${report.release.releasable ? "releasable" : "not releasable"} (BLOCKER ${s.BLOCKER}, HIGH ${s.HIGH}, MEDIUM ${s.MEDIUM}, LOW ${s.LOW})`);
  },
};

/* ---------- S13 package ---------- */

function packagedFiles(ctx: PartContext, releasable: boolean): string[] {
  const dir = outDir(ctx, releasable);
  return [...ctx.langs.map((l) => path.join(dir, `${videoBase(ctx, l)}.mp4`)), path.join(dir, `${ctx.chapterId}_${ctx.partId}_qa.html`), path.join(dir, `${ctx.chapterId}_${ctx.partId}_qa.json`)];
}

function reportReleasable(ctx: PartContext): boolean {
  const f = path.join(qaDir(ctx), "report.json");
  return exists(f) ? QaReport.parse(readJson(f)).release.releasable : false;
}

const S13: Stage = {
  id: "S13",
  name: "package",
  version: 1,
  inputs: (ctx) => ({ files: [path.join(qaDir(ctx), "report.json"), path.join(qaDir(ctx), "report.html"), ...ctx.langs.map((l) => renderFile(ctx, l))], params: { langs: ctx.langs } }),
  outputs: (ctx) => packagedFiles(ctx, reportReleasable(ctx)),
  run: async (ctx) => {
    const rel = reportReleasable(ctx);
    for (const f of packagedFiles(ctx, !rel)) if (exists(f)) fs.rmSync(f);
    const dest = ensureDir(outDir(ctx, rel));
    for (const l of ctx.langs) fs.copyFileSync(renderFile(ctx, l), path.join(dest, `${videoBase(ctx, l)}.mp4`));
    fs.copyFileSync(path.join(qaDir(ctx), "report.html"), path.join(dest, `${ctx.chapterId}_${ctx.partId}_qa.html`));
    fs.copyFileSync(path.join(qaDir(ctx), "report.json"), path.join(dest, `${ctx.chapterId}_${ctx.partId}_qa.json`));
    log.ok(`packaged into ${dest}${rel ? "" : " (not releasable: drafts)"}`);
  },
};

/* ---------- S14 course index ---------- */

function listVideos(ctx: PartContext): { rel: string; size: number }[] {
  const root = outDir(ctx, true);
  const out: { rel: string; size: number }[] = [];
  for (const sub of ["", "drafts"]) {
    const d = path.join(root, sub);
    if (!exists(d)) continue;
    for (const f of fs.readdirSync(d).sort()) if (f.endsWith(".mp4") || f.endsWith("_qa.html")) out.push({ rel: sub ? `${sub}/${f}` : f, size: fs.statSync(path.join(d, f)).size });
  }
  return out;
}

const S14: Stage = {
  id: "S14",
  name: "course index",
  version: 1,
  inputs: (ctx) => ({ files: exists(courseMapFile(ctx.bookId)) ? [courseMapFile(ctx.bookId)] : [], params: { videos: listVideos(ctx), title: ctx.cfg.title } }),
  outputs: (ctx) => [path.join(outDir(ctx, true), "index.html")],
  run: async (ctx) => {
    const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
    const map = exists(courseMapFile(ctx.bookId)) ? CourseMap.parse(readJson(courseMapFile(ctx.bookId))) : null;
    const vids = listVideos(ctx);
    const sections = (map?.chapters ?? []).map((c) => {
      const items = c.parts
        .map((part) => {
          const files = vids.filter((v) => path.basename(v.rel).startsWith(`${c.id}_${part.id}_`));
          if (!files.length) return `<li>${esc(part.title)} <em>(not built)</em></li>`;
          const links = files.map((v) => `<a href="${esc(v.rel)}">${esc(path.basename(v.rel))}</a>${v.rel.startsWith("drafts/") ? " (draft)" : ""}`).join(" | ");
          return `<li>${esc(part.title)}: ${links}</li>`;
        })
        .join("\n");
      return `<h2>${esc(c.kind === "chapter_part" ? `Chapter ${c.number}: ${c.title}` : c.title)}</h2>\n<ul>\n${items}\n</ul>`;
    });
    const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>${esc(ctx.cfg.title)}</title>\n<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:32px auto;padding:0 16px;background:#111;color:#eee}a{color:#8ac}</style></head><body>\n<h1>${esc(map?.courseTitle ?? ctx.cfg.title)}</h1>\n<p>${esc(ctx.cfg.title)} by ${esc(ctx.cfg.author)}. Generated by OpenLectern.</p>\n${sections.join("\n")}\n</body></html>\n`;
    writeText(path.join(ensureDir(outDir(ctx, true)), "index.html"), html);
  },
};

export const STAGES: Stage[] = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14];
