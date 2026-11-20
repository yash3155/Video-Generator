/* `openlectern qa --fixture <dir>`: runs S10-S12 (mock TTS, mock LLM provenance) on a hand-made part fixture in an isolated folder. */
import fs from "node:fs";
import path from "node:path";
import { copyDir, ensureDir, exists, readJson, rmrf } from "../core/fsutil";
import { bookDir } from "../core/paths";
import { log } from "../core/log";
import { createContext, executeStage, loadConfig, readReport, type StageLogEntry } from "../pipeline/runner";
import { loadState } from "../pipeline/state";
import { STAGES } from "../pipeline/stages";
import { registerPipelineGates } from "../pipeline/gates";

export interface FixtureManifest {
  bookId: string;
  chapterId: string;
  partId: string;
  langs?: string[];
  /** Scene indices to compile and render (keeps the fixture render short). */
  scenes?: number[];
}

export interface FixtureQaOptions {
  fixture: string;
  out: string;
  draft: boolean;
  json: boolean;
  langs?: string[];
}

/**
 * Fixture layout: fixture.json ({bookId, chapterId, partId, langs?, scenes?}), book/ (book.config.json and the book-level
 * artifacts) and part/ (01..08 artifacts). The part is copied to <out>, the book files to <out>/.home, and the
 * report is written to <out>/qa/report.json.
 */
export async function runFixtureQa(o: FixtureQaOptions): Promise<number> {
  const manifestFile = path.join(o.fixture, "fixture.json");
  if (!exists(manifestFile)) throw new Error(`${manifestFile} is missing`);
  const m = readJson<FixtureManifest>(manifestFile);
  rmrf(o.out);
  ensureDir(o.out);
  const home = path.join(o.out, ".home");
  process.env.OPENLECTERN_HOME = home;
  copyDir(path.join(o.fixture, "book"), ensureDir(bookDir(m.bookId)));
  copyDir(path.join(o.fixture, "part"), o.out);
  registerPipelineGates();
  const ctx = createContext({ bookId: m.bookId, chapterId: m.chapterId, partId: m.partId, langs: o.langs ?? m.langs, scenes: m.scenes, llm: "mock", tts: "mock", draft: o.draft, noReview: true, nonInteractive: true });
  ctx.partDir = o.out;
  loadConfig(ctx);
  const state = loadState(ctx);
  const entries: StageLogEntry[] = [];
  for (const id of ["S10", "S11", "S12"] as const) await executeStage(ctx, state, entries, STAGES.find((s) => s.id === id)!, true);
  const report = readReport(ctx);
  if (!report) throw new Error("QA did not write a report");
  if (o.json) process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  log.info(`report: ${path.join(o.out, "qa", "report.html")}`);
  const unexpected = report.findings.filter((f) => (f.severity === "BLOCKER" || f.severity === "HIGH") && f.id !== "Q-MOCK" && f.id !== "Q-DRAFT");
  for (const f of unexpected) log.fail(`${f.id} ${f.severity}: ${f.message}`);
  if (fs.existsSync(path.join(home, "out"))) rmrf(path.join(home, "out"));
  return unexpected.length ? 2 : 0;
}
