/* Lesson rendering (S11): the Lesson composition to H.264/AAC MP4, per-beat QA stills with layout diagnostics, and a contact sheet. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PNG } from "pngjs";
import { openBrowser, renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { ensureDir, rmrf } from "../core/fsutil";
import { log } from "../core/log";
import type { EpisodeCompiled } from "../schemas/compiled";
import { DIAG_PREFIX, type DiagnosticsMessage } from "../remotion/diagnostics";
import { bundleCacheRoot, getBundle } from "./bundle";

/** Mirrors the audio files a compiled episode references into `<partDir>/.pipeline/public` (mtimes preserved so the bundle cache key is stable). */
export function syncPublicDir(partDir: string, compiled: EpisodeCompiled): string {
  const pub = ensureDir(path.join(partDir, ".pipeline", "public"));
  const want = new Set<string>();
  for (const t of Object.values(compiled.timelines))
    for (const b of t.beats) {
      const rel = b.audio.file.split("/").join(path.sep);
      want.add(rel);
      const src = path.join(partDir, rel);
      const dst = path.join(pub, rel);
      const ss = fs.statSync(src);
      const ds = fs.existsSync(dst) ? fs.statSync(dst) : null;
      if (!ds || ds.size !== ss.size || Math.abs(ds.mtimeMs - ss.mtimeMs) > 1) {
        ensureDir(path.dirname(dst));
        fs.copyFileSync(src, dst);
        fs.utimesSync(dst, ss.atime, ss.mtime);
      }
    }
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (!want.has(path.relative(pub, p))) fs.rmSync(p, { force: true });
    }
  };
  walk(pub);
  return pub;
}

/** Keeps the most recent `keep` bundles that embed a public dir (each holds a copy of the audio). */
export function pruneBundles(keep = 3): void {
  const root = bundleCacheRoot();
  if (!fs.existsSync(root)) return;
  const dirs = fs
    .readdirSync(root)
    .filter((d) => d.startsWith("bundle-pub-"))
    .map((d) => ({ d: path.join(root, d), t: fs.statSync(path.join(root, d)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  for (const x of dirs.slice(keep)) rmrf(x.d);
}

const browserOpts = { chromiumOptions: { gl: "swangle" as const }, logLevel: "error" as const };

export interface RenderVideoOptions {
  partDir: string;
  compiled: EpisodeCompiled;
  lang: string;
  output: string;
  draft: boolean;
}

export async function renderLessonVideo(o: RenderVideoOptions): Promise<void> {
  const pub = syncPublicDir(o.partDir, o.compiled);
  const serveUrl = await getBundle({ publicDir: pub });
  const inputProps = { compiled: o.compiled, lang: o.lang };
  const composition = await selectComposition({ serveUrl, id: "Lesson", inputProps, ...browserOpts });
  ensureDir(path.dirname(o.output));
  const tmp = o.output.replace(/\.mp4$/, ".part.mp4");
  let last = -1;
  const t0 = Date.now();
  const render = () =>
    renderMedia({
      serveUrl,
      composition,
      inputProps,
      codec: "h264",
      crf: o.draft ? 28 : 17,
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      audioCodec: "aac",
      audioBitrate: "192k",
      scale: o.draft ? 0.5 : 1,
      outputLocation: tmp,
      overwrite: true,
      timeoutInMilliseconds: 120000,
      ...browserOpts,
      onProgress: ({ progress }) => {
        const pct = Math.floor(progress * 10) * 10;
        if (pct !== last) {
          last = pct;
          log.info(`render ${o.lang}: ${pct}%`);
        }
      },
    });
  try {
    await render();
  } catch (e) {
    // Remotion's temp asset folders are occasionally removed mid-render (antivirus, temp cleanup); one retry recovers.
    log.warn(
      `render ${o.lang} failed (${String((e as Error).message)
        .split("\n")[0]
        .slice(0, 160)}); retrying once`,
    );
    last = -1;
    await render();
  }
  fs.renameSync(tmp, o.output);
  log.info(`rendered ${path.basename(o.output)} (${composition.durationInFrames} frames) in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

export interface StillSpec {
  /** File name without extension. */
  name: string;
  frame: number;
  sceneId: string;
  beatId: string;
  /** Frame relative to the scene start (what the diagnostics reporter logs). */
  sceneFrame: number;
  kind: "mid" | "end";
}

/** One still at the middle of each beat and one at its end (after its last cue), for every timeline beat. */
export function stillSpecs(compiled: EpisodeCompiled, lang: string): StillSpec[] {
  const t = compiled.timelines[lang];
  const out: StillSpec[] = [];
  for (const b of t.beats) {
    const scene = t.scenes.find((s) => s.sceneId === b.sceneId)!;
    const lastCue = b.cues.reduce((m, c) => Math.max(m, c.frame), b.startFrame);
    const mid = b.startFrame + Math.floor(b.durationInFrames / 2);
    const end = Math.min(b.startFrame + b.durationInFrames - 2, Math.max(lastCue + 18, mid));
    out.push({ name: `${b.sceneId}_${b.beatId}_mid`, frame: mid, sceneId: b.sceneId, beatId: b.beatId, sceneFrame: mid - scene.startFrame, kind: "mid" });
    out.push({
      name: `${b.sceneId}_${b.beatId}_end`,
      frame: Math.max(mid, end),
      sceneId: b.sceneId,
      beatId: b.beatId,
      sceneFrame: Math.max(mid, end) - scene.startFrame,
      kind: "end",
    });
  }
  return out;
}

export interface LessonStill extends StillSpec {
  png: string;
  diag?: DiagnosticsMessage;
}

export async function renderLessonStills(o: {
  partDir: string;
  compiled: EpisodeCompiled;
  lang: string;
  outDir: string;
  draft: boolean;
  concurrency?: number;
}): Promise<LessonStill[]> {
  const specs = stillSpecs(o.compiled, o.lang);
  const pub = syncPublicDir(o.partDir, o.compiled);
  const serveUrl = await getBundle({ publicDir: pub });
  ensureDir(o.outDir);
  const props = { compiled: o.compiled, lang: o.lang, diagnostics: true };
  const browser = await openBrowser("chrome", browserOpts);
  const diags = new Map<string, DiagnosticsMessage>();
  const out: LessonStill[] = [];
  try {
    const composition = await selectComposition({ serveUrl, id: "Lesson", inputProps: props, puppeteerInstance: browser, logLevel: "error" });
    let i = 0;
    const n = o.concurrency ?? Math.max(1, Math.min(4, Math.floor(os.cpus().length / 2)));
    const worker = async () => {
      while (i < specs.length) {
        const s = specs[i++];
        const png = path.join(o.outDir, `${s.name}.png`);
        await renderStill({
          serveUrl,
          composition: { ...composition, props },
          output: png,
          frame: s.frame,
          imageFormat: "png",
          inputProps: props,
          puppeteerInstance: browser,
          scale: o.draft ? 0.5 : 1,
          logLevel: "error",
          onBrowserLog: (l) => {
            if (!l.text.startsWith(DIAG_PREFIX)) return;
            const msg = JSON.parse(l.text.slice(DIAG_PREFIX.length)) as DiagnosticsMessage;
            diags.set(`${msg.label}@${msg.frame}`, msg);
          },
        });
        out.push({ ...s, png });
      }
    };
    await Promise.all(Array.from({ length: n }, worker));
  } finally {
    await browser.close({ silent: true });
  }
  for (const s of out) s.diag = diags.get(`${s.sceneId}/${s.beatId}@${s.sceneFrame}`);
  return out.sort((a, b) => a.frame - b.frame || a.name.localeCompare(b.name));
}

/** Box-filter downscale of a decoded PNG to w x h. */
export function downscale(img: PNG, tw: number, th: number): PNG {
  const out = new PNG({ width: tw, height: th });
  const sx = img.width / tw;
  const sy = img.height / th;
  for (let y = 0; y < th; y++)
    for (let x = 0; x < tw; x++) {
      let r = 0,
        g = 0,
        b = 0,
        n = 0;
      const x0 = Math.floor(x * sx),
        x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      const y0 = Math.floor(y * sy),
        y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
      for (let yy = y0; yy < y1; yy++)
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * img.width + xx) * 4;
          r += img.data[i];
          g += img.data[i + 1];
          b += img.data[i + 2];
          n++;
        }
      const o = (y * tw + x) * 4;
      out.data[o] = r / n;
      out.data[o + 1] = g / n;
      out.data[o + 2] = b / n;
      out.data[o + 3] = 255;
    }
  return out;
}

/** PNG bytes of a file scaled to width `w` (16:9). */
export function thumbnail(file: string, w = 480): Buffer {
  const img = PNG.sync.read(fs.readFileSync(file));
  return PNG.sync.write(downscale(img, w, Math.round((w * img.height) / img.width)));
}

/** Downscales PNGs into one grid image. */
export function contactSheet(pngs: string[], output: string, opts: { cols?: number; thumbW?: number } = {}): void {
  const cols = opts.cols ?? 6;
  const tw = opts.thumbW ?? 320;
  const th = Math.round((tw * 9) / 16);
  const gap = 8;
  const rows = Math.max(1, Math.ceil(pngs.length / cols));
  const sheet = new PNG({ width: cols * tw + (cols + 1) * gap, height: rows * th + (rows + 1) * gap });
  sheet.data.fill(0);
  for (let k = 3; k < sheet.data.length; k += 4) sheet.data[k] = 255;
  pngs.forEach((file, idx) => {
    const t = downscale(PNG.sync.read(fs.readFileSync(file)), tw, th);
    PNG.bitblt(t, sheet, 0, 0, tw, th, gap + (idx % cols) * (tw + gap), gap + Math.floor(idx / cols) * (th + gap));
  });
  ensureDir(path.dirname(output));
  fs.writeFileSync(output, PNG.sync.write(sheet));
}
