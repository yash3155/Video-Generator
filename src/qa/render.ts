/* L5 render checks (R-xx) over one rendered language: ffprobe, black and frozen frames, layout diagnostics, OCR, theme pixels, quiz states. */
import fs from "node:fs";
import { PNG } from "pngjs";
import type { EpisodeCompiled } from "../schemas/compiled";
import { ffmpeg, ffprobeJson, runSync, which } from "../core/proc";
import { getTheme } from "../theme/tokens";
import type { LessonStill } from "../render/lesson";
import { finding, type QaFinding } from "./finding";
import { emptyRun, type CheckRun } from "./content";

export interface RenderQaContext {
  compiled: EpisodeCompiled;
  lang: string;
  renderFile: string;
  draft: boolean;
  stills: LessonStill[];
  /** OCR override for R-05 (default: the Tesseract CLI when installed). */
  ocr?: (png: string, lang: string) => string | null;
}

const FPS = 30;

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

const pngCache = new Map<string, PNG>();
function readPng(file: string): PNG {
  let p = pngCache.get(file);
  if (!p) {
    p = PNG.sync.read(fs.readFileSync(file));
    pngCache.set(file, p);
    if (pngCache.size > 64) pngCache.delete(pngCache.keys().next().value!);
  }
  return p;
}

/** Mean colour of a rectangle given in composition (1920x1080) coordinates. */
export function meanColor(png: PNG, x: number, y: number, w: number, h: number): [number, number, number] {
  const s = png.width / 1920;
  const x0 = Math.max(0, Math.floor(x * s)),
    y0 = Math.max(0, Math.floor(y * s));
  const x1 = Math.min(png.width, Math.ceil((x + w) * s)),
    y1 = Math.min(png.height, Math.ceil((y + h) * s));
  let r = 0,
    g = 0,
    b = 0,
    n = 0;
  for (let yy = y0; yy < y1; yy++)
    for (let xx = x0; xx < x1; xx++) {
      const i = (yy * png.width + xx) * 4;
      r += png.data[i];
      g += png.data[i + 1];
      b += png.data[i + 2];
      n++;
    }
  return n ? [r / n, g / n, b / n] : [0, 0, 0];
}

/** Share of pixels inside a composition-space box within `tol` (sum of channel differences) of a colour. */
export function colorShare(png: PNG, box: { x: number; y: number; w: number; h: number }, rgb: [number, number, number], tol = 60): number {
  const s = png.width / 1920;
  const x0 = Math.max(0, Math.floor(box.x * s)),
    y0 = Math.max(0, Math.floor(box.y * s));
  const x1 = Math.min(png.width, Math.ceil((box.x + box.w) * s)),
    y1 = Math.min(png.height, Math.ceil((box.y + box.h) * s));
  let hit = 0,
    n = 0;
  for (let yy = y0; yy < y1; yy++)
    for (let xx = x0; xx < x1; xx++) {
      const i = (yy * png.width + xx) * 4;
      if (Math.abs(png.data[i] - rgb[0]) + Math.abs(png.data[i + 1] - rgb[1]) + Math.abs(png.data[i + 2] - rgb[2]) <= tol) hit++;
      n++;
    }
  return n ? hit / n : 0;
}

function intervals(stderr: string, startKey: string, endKey: string): { start: number; end: number }[] {
  const out: { start: number; end: number }[] = [];
  const re = new RegExp(`${startKey}[:=]\\s*([\\d.]+)`, "g");
  const reEnd = new RegExp(`${endKey}[:=]\\s*([\\d.]+)`, "g");
  const starts = [...stderr.matchAll(re)].map((m) => Number(m[1]));
  const ends = [...stderr.matchAll(reEnd)].map((m) => Number(m[1]));
  starts.forEach((s, i) => out.push({ start: s, end: ends[i] ?? Number.POSITIVE_INFINITY }));
  return out;
}

const isProbe = (name: string | undefined, id: string) => !!name && new RegExp(`(^|:)${id}$`).test(name);
const JUNK = [/\\text/, /\\frac/, /\/text/, /\\left/, /\^\{/, /_\{/, /\[object Object\]/, /\bundefined\b/, /\bNaN\b/, /\bTODO\b/];

function tesseractText(png: string, lang: string): string | null {
  const r = runSync("tesseract", [png, "-", "-l", lang.startsWith("hi") ? "eng+hin" : "eng"], { timeoutMs: 60000 });
  return r.code === 0 ? r.stdout : null;
}

export function renderChecks(ctx: RenderQaContext): CheckRun {
  const run = emptyRun();
  const f: QaFinding[] = run.findings;
  const { lang } = ctx;
  const t = ctx.compiled.timelines[lang];
  const expectSec = t.durationInFrames / FPS;

  run.ran.push("R-01");
  if (!fs.existsSync(ctx.renderFile)) {
    f.push(finding("R-01", "BLOCKER", `rendered video ${ctx.renderFile} is missing`, "S11 did not finish.", "Re-render the part.", { lang }));
    for (const id of ["R-02", "R-03"]) run.skipped[id] = "no rendered video";
  } else {
    const info = ffprobeJson(ctx.renderFile);
    const v = (info.streams ?? []).find((s: any) => s.codec_type === "video");
    const a = (info.streams ?? []).find((s: any) => s.codec_type === "audio");
    const [w, h] = ctx.draft ? [960, 540] : [1920, 1080];
    const problems: string[] = [];
    if (!v) problems.push("no video stream");
    else {
      if (v.codec_name !== "h264") problems.push(`video codec ${v.codec_name}`);
      if (v.width !== w || v.height !== h) problems.push(`size ${v.width}x${v.height} (want ${w}x${h})`);
      if (v.pix_fmt !== "yuv420p") problems.push(`pixel format ${v.pix_fmt}`);
      const [n, d] = String(v.r_frame_rate ?? "0/1").split("/").map(Number);
      if (Math.abs(n / (d || 1) - FPS) > 0.01) problems.push(`frame rate ${v.r_frame_rate}`);
    }
    if (!a) problems.push("no audio stream");
    else if (a.codec_name !== "aac") problems.push(`audio codec ${a.codec_name}`);
    const dur = Number(info.format?.duration ?? 0);
    if (Math.abs(dur - expectSec) > 0.5) problems.push(`duration ${dur.toFixed(2)} s (compiled ${expectSec.toFixed(2)} s)`);
    for (const p of problems) f.push(finding("R-01", "BLOCKER", `video stream check failed: ${p}`, "The render settings or the timeline are wrong.", "Re-render the part.", { lang }));

    const r = ffmpeg(["-i", ctx.renderFile, "-an", "-vf", "blackdetect=d=0.5:pix_th=0.05,freezedetect=n=-60dB:d=20", "-f", "null", "-"], 30 * 60 * 1000);
    run.ran.push("R-02", "R-03");
    if (r.code !== 0) f.push(finding("R-02", "HIGH", "black and freeze detection failed to decode the video", r.stderr.slice(-200), "Re-render the part.", { lang }));
    for (const b of intervals(r.stderr, "black_start", "black_end"))
      f.push(finding("R-02", "HIGH", `black frames ${b.start.toFixed(2)}-${b.end.toFixed(2)} s`, "A scene rendered empty or faded to black.", "Re-render; check scenes that render empty.", { lang }));
    for (const z of intervals(r.stderr, "freeze_start", "freeze_end")) {
      const end = Number.isFinite(z.end) ? z.end : expectSec;
      for (const b of t.beats) {
        const bs = b.startFrame / FPS,
          be = (b.startFrame + b.durationInFrames) / FPS;
        if (b.cues.length && z.start < be && end > bs && Math.min(be, end) - Math.max(bs, z.start) > 1)
          f.push(finding("R-03", "HIGH", `picture frozen ${z.start.toFixed(1)}-${end.toFixed(1)} s while a beat with visual cues plays`, "The cues did not change the picture.", "Add visual cues or split the beat so the picture changes.", { lang, sceneId: b.sceneId, beatId: b.beatId }));
      }
    }
  }

  if (!ctx.stills.length) {
    for (const id of ["R-04", "R-05", "R-06", "R-07", "R-08"]) run.skipped[id] = "no beat stills";
    return run;
  }

  run.ran.push("R-04", "R-06");
  for (const s of ctx.stills) {
    const where = { lang, sceneId: s.sceneId, beatId: s.beatId };
    if (!s.diag) {
      f.push(finding("R-04", "HIGH", `no layout diagnostics for the ${s.kind} still at frame ${s.frame}`, "The diagnostics reporter did not log for this frame.", "Re-render the stills.", where));
      continue;
    }
    for (const it of s.diag.items)
      f.push(finding("R-04", "BLOCKER", `text overflows "${it.id}" (${it.axis}: ${it.scrollWidth}x${it.scrollHeight} in ${it.clientWidth}x${it.clientHeight})`, `${s.kind} still at frame ${s.frame}`, "Shorten the text that overflows its box.", where));
    for (const l of s.diag.layout) {
      if (l.kind === "offcanvas") f.push(finding("R-04", "HIGH", `"${l.a}" is outside the canvas (${l.detail})`, `${s.kind} still at frame ${s.frame}`, "Shorten or re-lay out the content.", where));
      else if (l.kind === "tiny") f.push(finding("R-04", "MEDIUM", `"${l.a}" text is too small (${l.detail})`, `${s.kind} still at frame ${s.frame}`, "Shorten the content so it fits at a readable size.", where));
      else if (l.kind === "contrast") f.push(finding("R-04", "MEDIUM", `"${l.a}" has low contrast (${l.detail})`, `${s.kind} still at frame ${s.frame}`, "Use a theme colour with enough contrast.", where));
      else if (l.kind === "collision") {
        const cap = isProbe(l.a, "caption") || isProbe(l.b, "caption");
        f.push(finding("R-06", cap ? "HIGH" : "MEDIUM", `"${l.a}" overlaps "${l.b}" (${l.detail})`, `${s.kind} still at frame ${s.frame}`, "Shorten the panel content or the caption phrase.", where));
      }
    }
  }

  const ocr = ctx.ocr ?? (which("tesseract") ? tesseractText : null);
  if (!ocr) run.skipped["R-05"] = "Tesseract not found";
  else {
    run.ran.push("R-05");
    for (const s of ctx.stills.filter((x) => x.kind === "end")) {
      const text = ocr(s.png, lang);
      if (text === null) continue;
      for (const re of JUNK)
        if (re.test(text)) f.push(finding("R-05", "HIGH", `still shows junk token ${re.source}`, `OCR of frame ${s.frame}`, "Fix the visual data that renders junk.", { lang, sceneId: s.sceneId, beatId: s.beatId }));
    }
  }

  run.ran.push("R-07");
  const theme = getTheme(ctx.compiled.episode.theme);
  const bg = hexRgb(theme.colors.background);
  const bad: number[] = [];
  const ends = ctx.stills.filter((x) => x.kind === "end");
  for (const s of ends) {
    const png = readPng(s.png);
    const c = meanColor(png, 14, 420, 22, 240);
    const d = Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]);
    if (d > 60) bad.push(s.frame);
  }
  if (bad.length > ends.length / 4)
    f.push(finding("R-07", "HIGH", `background of ${bad.length}/${ends.length} stills does not match theme ${theme.id} (${theme.colors.background})`, `frames ${bad.slice(0, 6).join(", ")}`, "Re-render with the book theme.", { lang }));

  const quizScenes = ctx.compiled.episode.scenes.filter((s) => s.template === "interactive_quiz" && t.scenes.some((x) => x.sceneId === s.id));
  if (!quizScenes.length) run.skipped["R-08"] = "no quiz scene rendered";
  else {
    run.ran.push("R-08");
    const green = hexRgb(theme.colors.green);
    for (const q of quizScenes) {
      const correct = (q.data as { correctIndex?: number }).correctIndex ?? -1;
      for (const s of ctx.stills.filter((x) => x.sceneId === q.id && x.kind === "end" && x.diag)) {
        const beat = q.beats.find((b) => b.id === s.beatId);
        const phase = (beat?.visual as { phase?: string } | undefined)?.phase ?? "question";
        const where = { lang, sceneId: q.id, beatId: s.beatId };
        const boxes = [0, 1, 2, 3].map((i) => s.diag!.boxes.find((b) => isProbe(b.id, `option-${i}`)));
        if (boxes.some((b) => !b || b.w < 40 || b.h < 20)) {
          f.push(finding("R-08", "HIGH", `quiz still shows ${boxes.filter(Boolean).length} of 4 option cards`, `${phase} phase at frame ${s.frame}`, "Fix the quiz phases and options.", where));
          continue;
        }
        const png = readPng(s.png);
        const lit = boxes.map((b, i) => ({ i, share: colorShare(png, b!, green) })).filter((x) => x.share > 0.004);
        if (phase === "reveal") {
          if (lit.length !== 1 || lit[0].i !== correct)
            f.push(finding("R-08", "HIGH", `reveal highlights ${lit.length ? lit.map((x) => "ABCD"[x.i]).join(",") : "no option"} (correct ${"ABCD"[correct] ?? "?"})`, `frame ${s.frame}`, "Fix the quiz phases and correctIndex.", where));
        } else if (lit.length) f.push(finding("R-08", "HIGH", `an option is highlighted before the reveal (${lit.map((x) => "ABCD"[x.i]).join(",")})`, `${phase} phase at frame ${s.frame}`, "Highlight the answer only in the reveal beat.", where));
      }
    }
  }
  return run;
}
