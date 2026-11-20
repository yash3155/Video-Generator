/* The make runner: walks S0-S14 with caching, writes runs/last.json, and runs the QA repair loop (max 3 iterations, then NEEDS_HUMAN). */
import fs from "node:fs";
import path from "node:path";
import { ensureDir, exists, readJson, writeJson, writeText } from "../core/fsutil";
import { bookDir, partDir } from "../core/paths";
import { log } from "../core/log";
import { createLlmProvider, type LlmProvider } from "../llm";
import { BookConfig } from "../schemas/book";
import { QaReport, type QaFinding } from "../schemas/qa";
import { checkMeta } from "../qa/registry";
import { bookConfigFile, exampleDirFor, pipelineDir, qaDir, repairFile } from "./artifacts";
import { fingerprint, hashOutputs, isCached, loadState, saveState, type PipelineState } from "./state";
import { STAGES } from "./stages";
import { registerPipelineGates } from "./gates";
import { NEEDS_HUMAN_EXIT_CODE, STAGE_IDS, type MakeOptions, type PartContext, type Stage, type StageId } from "./types";

export const MAX_REPAIR_ITERATIONS = 3;
/** Findings that never trigger repairs: they describe how the run was configured, not the content. */
export const CONFIG_FINDINGS = new Set(["Q-MOCK", "Q-DRAFT"]);

export interface StageLogEntry {
  id: StageId;
  name: string;
  status: "ran" | "cached" | "failed";
  ms: number;
}

export function createContext(opts: MakeOptions): PartContext {
  const ex = exampleDirFor(opts.bookId);
  return {
    opts,
    bookId: opts.bookId,
    chapterId: opts.chapterId,
    partId: opts.partId,
    bookDir: bookDir(opts.bookId),
    partDir: partDir(opts.bookId, opts.chapterId, opts.partId),
    cfg: undefined as unknown as BookConfig,
    langs: [],
    llm: undefined as unknown as LlmProvider,
    llmMock: false,
    ttsId: "",
    draft: Boolean(opts.draft),
    scenes: opts.scenes?.length ? [...opts.scenes].sort((a, b) => a - b) : undefined,
    recordDir: ex ? path.join(ex, "recorded") : path.join(bookDir(opts.bookId), "recorded"),
    mockStages: new Set<StageId>(),
  };
}

/** Loads the book config into the context (after S0) and creates the providers. */
export function loadConfig(ctx: PartContext): void {
  const cfg = BookConfig.parse(readJson(bookConfigFile(ctx.bookId)));
  ctx.cfg = cfg;
  const langs = ctx.opts.langs?.length ? ctx.opts.langs : cfg.narrationLanguages;
  for (const l of langs) if (!cfg.narrationLanguages.includes(l)) throw new Error(`--lang ${l} is not a narration language of the book (${cfg.narrationLanguages.join(", ")})`);
  ctx.langs = langs;
  const llmId = ctx.opts.llm ?? cfg.llm.provider;
  ctx.llm = createLlmProvider(llmId, { handoff: ctx.opts.handoff, recordDir: ctx.recordDir, model: ctx.opts.model ?? cfg.llm.model });
  ctx.llmMock = ctx.llm.id === "mock";
  ctx.ttsId = ctx.opts.tts ?? cfg.tts.provider;
}

export function readReport(ctx: PartContext): QaReport | null {
  const f = path.join(qaDir(ctx), "report.json");
  return exists(f) ? QaReport.parse(readJson(f)) : null;
}

/** BLOCKER and HIGH findings that are about content (not about mock or draft configuration). */
export function contentFailures(report: QaReport): QaFinding[] {
  return report.findings.filter((f) => (f.severity === "BLOCKER" || f.severity === "HIGH") && !CONFIG_FINDINGS.has(f.id));
}

function needsHumanFile(ctx: PartContext): string {
  return path.join(pipelineDir(ctx), "NEEDS_HUMAN.md");
}

function writeNeedsHuman(ctx: PartContext, failing: QaFinding[], why: string): void {
  const lines = [
    `# NEEDS_HUMAN: ${ctx.chapterId}/${ctx.partId}`,
    "",
    why,
    "",
    "Open qa/report.html for the stills and the full report. Failing findings:",
    "",
    ...failing.map((f) => `- ${f.id} ${f.severity}${f.lang ? ` [${f.lang}]` : ""}${f.beatId ? ` ${f.beatId}` : f.sceneId ? ` ${f.sceneId}` : ""}: ${f.message}. Repair: ${f.repair}`),
    "",
  ];
  writeText(needsHumanFile(ctx), lines.join("\n"));
}

/** Writes .pipeline/repair/<stage>.json for each stage that owns a failing finding; returns the earliest such stage. */
function writeRepairs(ctx: PartContext, failing: QaFinding[], iteration: number): StageId | null {
  const byStage = new Map<StageId, QaFinding[]>();
  for (const f of failing) {
    const st = checkMeta(f.id)?.repairStage;
    if (!st) continue;
    byStage.set(st, [...(byStage.get(st) ?? []), f]);
  }
  if (!byStage.size) return null;
  for (const [st, list] of byStage) {
    const file = repairFile(ctx, st);
    ensureDir(path.dirname(file));
    writeJson(file, { iteration, instructions: "Fix every finding below in your new output; keep everything else unchanged.", findings: list.map((f) => ({ id: f.id, severity: f.severity, lang: f.lang, sceneId: f.sceneId, beatId: f.beatId, message: f.message, cause: f.cause, repair: f.repair })) });
  }
  return [...byStage.keys()].sort((a, b) => STAGE_IDS.indexOf(a) - STAGE_IDS.indexOf(b))[0];
}

export async function executeStage(ctx: PartContext, state: PipelineState, entries: StageLogEntry[], stage: Stage, force: boolean): Promise<void> {
  if (stage.id !== "S0" && !ctx.cfg) loadConfig(ctx);
  const fp = fingerprint(stage, ctx);
  if (!force && isCached(stage, ctx, state, fp)) {
    if (state.stages[stage.id]?.mock) ctx.mockStages.add(stage.id);
    entries.push({ id: stage.id, name: stage.name, status: "cached", ms: 0 });
    log.stage(`${stage.id} ${stage.name}: cached`);
    return;
  }
  log.stage(`${stage.id} ${stage.name}`);
  const t0 = Date.now();
  ctx.mockStages.delete(stage.id);
  try {
    const r = (await stage.run(ctx)) || {};
    if (r.mock) ctx.mockStages.add(stage.id);
    const outputs = r.outputs ?? stage.outputs(ctx);
    state.stages[stage.id] = { fingerprint: fingerprint(stage, ctx), outputs: hashOutputs(outputs), mock: ctx.mockStages.has(stage.id), finishedAt: new Date().toISOString() };
    saveState(ctx, state);
    entries.push({ id: stage.id, name: stage.name, status: "ran", ms: Date.now() - t0 });
  } catch (e) {
    delete state.stages[stage.id];
    saveState(ctx, state);
    entries.push({ id: stage.id, name: stage.name, status: "failed", ms: Date.now() - t0 });
    throw e;
  }
  if (stage.id === "S0") loadConfig(ctx);
}

function writeRunLog(ctx: PartContext, entries: StageLogEntry[]): void {
  const runs = ensureDir(path.join(ctx.bookDir, "runs"));
  writeJson(path.join(runs, "last.json"), { bookId: ctx.bookId, chapterId: ctx.chapterId, partId: ctx.partId, finishedAt: new Date().toISOString(), stages: entries });
}

/** Runs one stage alone (forced), for `openlectern run <stage>` and `openlectern qa`. Earlier artifacts must exist. */
export async function runSingleStage(opts: MakeOptions, id: StageId): Promise<QaReport | null> {
  registerPipelineGates();
  const ctx = createContext(opts);
  ensureDir(pipelineDir(ctx));
  const state = loadState(ctx);
  const entries: StageLogEntry[] = [];
  for (const s of Object.keys(state.stages) as StageId[]) if (state.stages[s]?.mock) ctx.mockStages.add(s);
  const stage = STAGES.find((s) => s.id === id);
  if (!stage) throw new Error(`unknown stage ${id}`);
  if (id !== "S0") {
    if (!exists(bookConfigFile(ctx.bookId))) throw new Error(`no book config at ${bookConfigFile(ctx.bookId)}; run \`openlectern make\` or \`openlectern start\` first`);
    loadConfig(ctx);
  }
  try {
    await executeStage(ctx, state, entries, stage, true);
  } finally {
    writeRunLog(ctx, entries);
  }
  return id === "S12" ? readReport(ctx) : null;
}

export interface MakeOutcome {
  code: number;
  stages: StageLogEntry[];
  report: QaReport | null;
}

export async function runMake(opts: MakeOptions): Promise<MakeOutcome> {
  registerPipelineGates();
  const ctx = createContext(opts);
  ensureDir(pipelineDir(ctx));
  const state = loadState(ctx);
  const entries: StageLogEntry[] = [];
  const untilIdx = opts.until ? STAGE_IDS.indexOf(opts.until) : STAGE_IDS.length - 1;
  const stages = STAGES.slice(0, untilIdx + 1);
  const forced = new Set<StageId>(opts.force === true ? STAGE_IDS : (opts.force ?? []));
  const repairable = !["mock", "replay"].includes(opts.llm ?? "");

  const runStage = (stage: Stage, force: boolean) => executeStage(ctx, state, entries, stage, force);

  let needsHuman = false;
  try {
    let iteration = 0;
    let i = 0;
    const forceNow = new Set(forced);
    while (i < stages.length) {
      const stage = stages[i];
      await runStage(stage, forceNow.has(stage.id));
      if (stage.id === "S12") {
        const report = readReport(ctx);
        const failing = report ? contentFailures(report) : [];
        if (failing.length) {
          if (!repairable || ctx.llmMock) {
            needsHuman = true;
            writeNeedsHuman(ctx, failing, "The repair loop does not run with mock or replay LLM providers.");
          } else if (iteration >= MAX_REPAIR_ITERATIONS) {
            needsHuman = true;
            writeNeedsHuman(ctx, failing, `${MAX_REPAIR_ITERATIONS} repair iterations did not clear these findings.`);
          } else {
            const from = writeRepairs(ctx, failing, iteration + 1);
            if (!from) {
              needsHuman = true;
              writeNeedsHuman(ctx, failing, "No pipeline stage can repair these findings automatically.");
            } else {
              iteration++;
              log.warn(`QA found ${failing.length} blocking findings; repair iteration ${iteration}/${MAX_REPAIR_ITERATIONS} from ${from}`);
              forceNow.clear();
              forceNow.add(from);
              i = stages.findIndex((s) => s.id === from);
              continue;
            }
          }
        } else if (exists(needsHumanFile(ctx))) fs.rmSync(needsHumanFile(ctx));
      }
      i++;
    }
  } finally {
    writeRunLog(ctx, entries);
  }

  const report = untilIdx >= STAGE_IDS.indexOf("S12") ? readReport(ctx) : null;
  const ran = entries.filter((e) => e.status === "ran").length;
  log.ok(`make ${ctx.chapterId}/${ctx.partId}: ${ran} stages ran, ${entries.length - ran} cached`);
  if (needsHuman) {
    log.fail(`NEEDS_HUMAN: see ${needsHumanFile(ctx)}`);
    return { code: NEEDS_HUMAN_EXIT_CODE, stages: entries, report };
  }
  return { code: 0, stages: entries, report };
}
