/* render:stills: renders template fixtures (or any StillFixture JSON) to PNG with the Still composition and collects overflow diagnostics. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { REPO_ROOT } from "../core/paths";
import { ensureDir, readJson, writeJson } from "../core/fsutil";
import { log } from "../core/log";
import { StillFixture } from "../remotion/fixture";
import { normalizeTemplateData } from "../remotion/mappers/normalize";
import { assertRenderable, RenderDataError } from "../remotion/mappers/guard";
import { DIAG_PREFIX, type DiagnosticsMessage, type LayoutIssue, type OverflowItem, type ProbeBox } from "../remotion/diagnostics";
import { TEMPLATE_IDS } from "../remotion/templates/schemas";
import { getBundle } from "./bundle";

export const TEMPLATE_FIXTURE_DIR = path.join(REPO_ROOT, "tests", "fixtures", "templates");

export interface StillJob {
  /** Base name of the PNG (without extension) and the diagnostics label. */
  name: string;
  fixture: StillFixture;
  /** The fixture is designed to overflow (the overflow detector's own test). */
  expectOverflow: boolean;
}

export interface OverflowEntry {
  fixture: string;
  still: string;
  expected: boolean;
  items: OverflowItem[];
}

export interface LayoutEntry {
  fixture: string;
  issues: LayoutIssue[];
  boxes: ProbeBox[];
}

export interface StillsResult {
  pngs: string[];
  overflow: OverflowEntry[];
  layout: LayoutEntry[];
  /** Non-empty when a clean fixture overflowed, an overflow fixture did not, or diagnostics were missing. */
  problems: string[];
}

/** Parses and pre-validates one fixture in Node so bad data fails before any browser work (E.5 render-data guard). */
export function loadStillFixture(file: string, overrides: { theme?: string } = {}): StillFixture {
  const raw = readJson<Record<string, unknown>>(file);
  const parsed = StillFixture.safeParse(raw);
  if (!parsed.success) throw new RenderDataError(`${path.basename(file)}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`, "fixture");
  const f = parsed.data;
  try {
    assertRenderable({ title: f.title, takeaways: f.takeaways, header: f.header, names: f.names, ...(f.caption ? { caption: f.caption } : {}) }, "fixture");
    const data = normalizeTemplateData(f.template, f.data);
    assertRenderable(data, "data");
    if (f.visual.concept) assertRenderable(f.visual.concept, "visual.concept");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new RenderDataError(`${path.basename(file)}: ${msg}`, e instanceof RenderDataError ? e.path : "data", { cause: e });
  }
  return overrides.theme ? { ...f, theme: overrides.theme } : f;
}

/** The gallery: one fixture per registry template, every variant-*.json (rendered as _variant-*.png, must be clean) and every overflow*.json (rendered as _overflow*.png, must overflow). */
export function galleryJobs(dir = TEMPLATE_FIXTURE_DIR, overrides: { theme?: string } = {}): StillJob[] {
  const jobs: StillJob[] = [];
  for (const id of TEMPLATE_IDS) {
    const file = path.join(dir, `${id}.json`);
    if (!fs.existsSync(file)) throw new Error(`missing template fixture ${path.relative(REPO_ROOT, file)}`);
    const fixture = loadStillFixture(file, overrides);
    if (fixture.template !== id) throw new Error(`${id}.json uses template "${fixture.template}"`);
    jobs.push({ name: id, fixture, expectOverflow: false });
  }
  for (const f of fs.readdirSync(dir).filter((n) => /^(variant|overflow).*\.json$/.test(n)).sort()) {
    jobs.push({ name: `_${f.replace(/\.json$/, "")}`, fixture: loadStillFixture(path.join(dir, f), overrides), expectOverflow: f.startsWith("overflow") });
  }
  return jobs;
}

async function pool<T>(items: T[], n: number, fn: (item: T) => Promise<void>): Promise<void> {
  let i = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(n, items.length)) }, async () => {
    while (i < items.length) await fn(items[i++]);
  });
  await Promise.all(workers);
}

export function defaultConcurrency(): number {
  return Math.max(1, Math.min(6, Math.floor(os.cpus().length / 2)));
}

export async function renderStills(jobs: StillJob[], opts: { outDir: string; draft?: boolean; concurrency?: number }): Promise<StillsResult> {
  const outDir = ensureDir(path.resolve(opts.outDir));
  const serveUrl = await getBundle();
  const browser = await openBrowser("chrome", { chromiumOptions: { gl: "swangle" }, logLevel: "error" });
  const diags = new Map<string, DiagnosticsMessage>();
  const pngs: string[] = [];
  try {
    const first = { label: jobs[0]?.name ?? "default", fixture: jobs[0]?.fixture, diagnostics: true };
    const composition = await selectComposition({ serveUrl, id: "Still", inputProps: first, puppeteerInstance: browser, logLevel: "error" });
    const t0 = Date.now();
    await pool(jobs, opts.concurrency ?? defaultConcurrency(), async (job) => {
      const output = path.join(outDir, `${job.name}.png`);
      const props = { label: job.name, fixture: job.fixture, diagnostics: true };
      await renderStill({
        serveUrl,
        // The component receives composition.props (not inputProps), and Still has no calculateMetadata, so set them per job.
        composition: { ...composition, props },
        output,
        imageFormat: "png",
        inputProps: props,
        puppeteerInstance: browser,
        scale: opts.draft ? 0.5 : 1,
        logLevel: "error",
        onBrowserLog: (l) => {
          if (!l.text.startsWith(DIAG_PREFIX)) return;
          // Logs from a shared browser can arrive on another job's callback; the message carries its own label.
          const msg = JSON.parse(l.text.slice(DIAG_PREFIX.length)) as DiagnosticsMessage;
          diags.set(msg.label, msg);
        },
      });
      pngs.push(output);
    });
    log.info(`rendered ${jobs.length} stills in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  } finally {
    await browser.close({ silent: true });
  }
  const overflow: OverflowEntry[] = [];
  const layout: LayoutEntry[] = [];
  const problems: string[] = [];
  for (const job of jobs) {
    const d = diags.get(job.name);
    if (!d) {
      problems.push(`${job.name}: no diagnostics message was received from the browser`);
      continue;
    }
    layout.push({ fixture: job.name, issues: d.layout, boxes: d.boxes });
    if (d.layout.length && !job.expectOverflow) problems.push(`${job.name}: layout issues: ${d.layout.map((i) => `${i.kind} ${i.a}${i.b ? ` x ${i.b}` : ""} (${i.detail})`).join("; ")}`);
    if (d.items.length) overflow.push({ fixture: job.name, still: `${job.name}.png`, expected: job.expectOverflow, items: d.items });
    if (d.items.length && !job.expectOverflow) problems.push(`${job.name}: text overflows its box (${d.items.map((i) => `${i.id} ${i.axis}`).join(", ")})`);
    if (!d.items.length && job.expectOverflow) problems.push(`${job.name}: designed to overflow but the detector reported nothing`);
  }
  writeJson(path.join(outDir, "overflow.json"), { entries: overflow });
  writeJson(path.join(outDir, "layout.json"), { entries: layout });
  return { pngs: pngs.sort(), overflow, layout, problems };
}
