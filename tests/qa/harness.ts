/* Bad-fixture harness: synthesizes the media of the clean QA fixture (audio, render, stills), applies a bad fixture's patches and media overrides, and runs the QA layers. */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PNG } from "pngjs";
import { A } from "../../src/pipeline/artifacts";
import { runPartChecks } from "../../src/qa/part";
import { releaseChecks, type ReleaseFlags } from "../../src/qa/report";
import { mergeRuns, type OtherPart } from "../../src/qa/content";
import { checkMeta } from "../../src/qa/registry";
import type { QaFinding } from "../../src/qa/finding";
import { BookConfig } from "../../src/schemas/book";
import { Episode } from "../../src/schemas/episode";
import type { CompiledBeat, EpisodeCompiled, LanguageTimeline } from "../../src/schemas/compiled";
import type { LessonStill } from "../../src/render/lesson";
import { buildCaptions, matchAnchor, spokenText } from "../../src/tts/speech";
import { estimateWordTimings } from "../../src/tts/types";
import { writeWav } from "../../src/tts/wav";
import { ffmpeg } from "../../src/core/proc";
import { getTheme } from "../../src/theme/tokens";

export const ROOT = path.resolve(__dirname, "..", "..");
export const CLEAN_DIR = path.join(ROOT, "tests", "fixtures", "qa", "clean");
export const BAD_DIR = path.join(ROOT, "tests", "fixtures", "bad");
const BOOK_CONFIG = "book.config.json";
const FPS = 30;
const RATE = 24000;
/** Sine amplitude whose AAC mix measures about -16 LUFS. */
const AMP = 0.24;
const TONE_HZ = 440;

export interface Patch {
  /** Artifact file name (01..09) or book.config.json. */
  file: string;
  op: "set" | "remove" | "push" | "replace";
  /** JSON pointer for set, remove and push. */
  path?: string;
  value?: unknown;
  /** Text replacement over the serialized artifact (all occurrences). */
  find?: string;
  replace?: string;
}

export interface BadFixture {
  id: string;
  description: string;
  patches?: Patch[];
  /** Other parts of the workspace (C-05, C-06). */
  others?: OtherPart[];
  flags?: Partial<ReleaseFlags>;
  audio?: { beat?: string; missing?: boolean; gapMs?: number; staleHash?: boolean; renderGainDb?: number };
  video?: { size?: string; black?: [number, number]; freeze?: [number, number] };
  stills?: { overflow?: string; collision?: string; background?: string; revealHighlights?: number[] };
  ocr?: { beat: string; text: string };
  asr?: { beat: string; text: string };
}

interface Manifest {
  langs: string[];
  scenes: number[];
}

interface Clean {
  manifest: Manifest;
  artifacts: Record<string, unknown>;
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const readJson = (f: string) => JSON.parse(fs.readFileSync(f, "utf8")) as unknown;

export function episodeHashOf(ep: unknown): string {
  return sha(JSON.stringify(ep));
}

function audioHash(lang: string, spoken: string): string {
  return sha(`${lang}|${spoken}`).slice(0, 24);
}

export function loadClean(): Clean {
  const manifest = readJson(path.join(CLEAN_DIR, "fixture.json")) as Manifest;
  const artifacts: Record<string, unknown> = { [BOOK_CONFIG]: readJson(path.join(CLEAN_DIR, "book", BOOK_CONFIG)) };
  for (const name of Object.values(A)) {
    const f = path.join(CLEAN_DIR, "part", name);
    if (name.endsWith(".json") && fs.existsSync(f)) artifacts[name] = readJson(f);
  }
  return { manifest, artifacts };
}

function lexicon(cfg: BookConfig, lang: string): Record<string, string> {
  return cfg.pronunciation[lang] ?? cfg.pronunciation[lang.split("-")[0]] ?? {};
}

/** Synthetic durations: about 380 ms per word, at least 1.5 s. */
function beatMs(spoken: string): number {
  return Math.max(1500, spoken.split(/\s+/).filter(Boolean).length * 380);
}

/** Compiles the selected scenes of the clean episode into a timeline with synthetic (non-mock) audio metadata. */
export function synthCompiled(clean: Clean): EpisodeCompiled {
  const cfg = BookConfig.parse(clean.artifacts[BOOK_CONFIG]);
  const ep = Episode.parse(clean.artifacts[A.episode]);
  const timelines: Record<string, LanguageTimeline> = {};
  for (const lang of clean.manifest.langs) {
    const lex = lexicon(cfg, lang);
    let frame = 0;
    const beats: CompiledBeat[] = [];
    const scenes: LanguageTimeline["scenes"] = [];
    for (const s of ep.scenes.filter((x) => clean.manifest.scenes.includes(x.index))) {
      const start = frame;
      for (const b of s.beats) {
        const spoken = spokenText(b.narration[lang], lang, lex);
        const durationMs = beatMs(spoken);
        const words = estimateWordTimings(spoken, durationMs, 80);
        const durationInFrames = Math.ceil(((durationMs + b.pauseAfterMs) / 1000) * FPS);
        const cues = b.visualCues.map((c) => {
          const anchor = c.anchor[lang] ?? "";
          const ms = matchAnchor(words, anchor, lang, lex) ?? 0;
          return { target: c.target, anchor, atMs: ms, frame: frame + Math.round((ms / 1000) * FPS) };
        });
        beats.push({
          beatId: b.id,
          sceneId: s.id,
          startFrame: frame,
          durationInFrames,
          audio: { file: `audio/${lang}/${b.id}.wav`, durationMs, textHash: audioHash(lang, spoken), provider: "edge", voice: "harness", mock: false },
          pauseAfterMs: b.pauseAfterMs,
          timingSource: "estimated",
          words,
          captions: buildCaptions(words, b.narration[lang].display),
          cues,
          unresolvedCues: [],
        });
        frame += durationInFrames;
      }
      scenes.push({ sceneId: s.id, startFrame: start, durationInFrames: frame - start });
    }
    timelines[lang] = { lang, durationInFrames: frame, ttsProvider: "edge", fallbackUsed: false, scenes, beats };
  }
  return { fps: 30, width: 1920, height: 1080, episodeHash: episodeHashOf(clean.artifacts[A.episode]), episode: ep, timelines };
}

/* ---------- patches ---------- */

function pointer(p: string): string[] {
  return p
    .split("/")
    .slice(1)
    .map((x) => x.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function applyPatch(doc: unknown, patch: Patch): unknown {
  if (patch.op === "replace") {
    const text = JSON.stringify(doc).split(patch.find!).join(JSON.stringify(patch.replace!).slice(1, -1));
    return JSON.parse(text);
  }
  const keys = pointer(patch.path!);
  let parent = doc as Record<string, unknown>;
  for (const k of keys.slice(0, -1)) {
    if (parent[k] === undefined) throw new Error(`patch path ${patch.path} not found at ${k}`);
    parent = parent[k] as Record<string, unknown>;
  }
  const last = keys[keys.length - 1];
  if (patch.op === "set") parent[last] = clone(patch.value);
  else if (patch.op === "remove") {
    if (Array.isArray(parent)) parent.splice(Number(last), 1);
    else delete parent[last];
  } else if (patch.op === "push") (parent[last] as unknown[]).push(clone(patch.value));
  return doc;
}

/** Applies patches; when 08_episode.json changes and 09 is not patched, the compiled episode follows it (a consistent re-compile). */
export function patchedArtifacts(base: Record<string, unknown>, patches: Patch[] = []): Record<string, unknown> {
  const out = clone(base);
  for (const p of patches) {
    if (!(p.file in out)) throw new Error(`patch targets unknown file ${p.file}`);
    out[p.file] = applyPatch(out[p.file], p);
  }
  const epPatched = patches.some((p) => p.file === A.episode);
  const compiledPatched = patches.some((p) => p.file === A.compiled);
  if (epPatched && !compiledPatched) {
    const c = out[A.compiled] as Record<string, unknown>;
    c.episode = clone(out[A.episode]);
    c.episodeHash = episodeHashOf(out[A.episode]);
  }
  return out;
}

/* ---------- media ---------- */

export interface Media {
  dir: string;
  render: string;
  stills: LessonStill[];
  /** Spoken text per beat audio file (for the injected ASR). */
  spokenByFile: Map<string, string>;
}

function sine(ms: number, gap?: { atMs: number; ms: number }): Float32Array {
  const n = Math.round((ms / 1000) * RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = (i / RATE) * 1000;
    out[i] = gap && t >= gap.atMs && t < gap.atMs + gap.ms ? 0 : AMP * Math.sin((2 * Math.PI * TONE_HZ * i) / RATE);
  }
  return out;
}

function fillPng(
  file: string,
  rgb: [number, number, number],
  boxes: { x: number; y: number; w: number; h: number; rgb: [number, number, number] }[] = [],
): void {
  const w = 960;
  const h = 540;
  const png = new PNG({ width: w, height: h });
  for (let i = 0; i < w * h; i++) {
    png.data[i * 4] = rgb[0];
    png.data[i * 4 + 1] = rgb[1];
    png.data[i * 4 + 2] = rgb[2];
    png.data[i * 4 + 3] = 255;
  }
  for (const b of boxes)
    for (let y = Math.floor(b.y / 2); y < Math.floor((b.y + b.h) / 2); y++)
      for (let x = Math.floor(b.x / 2); x < Math.floor((b.x + b.w) / 2); x++) {
        const i = (y * w + x) * 4;
        png.data[i] = b.rgb[0];
        png.data[i + 1] = b.rgb[1];
        png.data[i + 2] = b.rgb[2];
      }
  fs.writeFileSync(file, PNG.sync.write(png));
}

const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const OPTION_BOX = (i: number) => ({ x: 160 + i * 410, y: 560, w: 360, h: 140 });

/** Builds (or reuses) the media of one variant: per-beat WAVs with .hash sidecars, the draft render and the beat stills. */
export function buildMedia(compiled: EpisodeCompiled, fx: Pick<BadFixture, "audio" | "video" | "stills"> = {}, tag = "base"): Media {
  const key = sha(JSON.stringify({ v: 3, compiled: compiled.timelines, fx: { a: fx.audio, v: fx.video, s: fx.stills } })).slice(0, 16);
  const dir = path.join(os.tmpdir(), "openlectern-qa-harness", `${tag}-${key}`);
  const done = path.join(dir, "done.json");
  const theme = getTheme(compiled.episode.theme);
  const lang = Object.keys(compiled.timelines)[0];
  const t = compiled.timelines[lang];
  const spokenByFile = new Map<string, string>();
  const ep = compiled.episode;
  const beatsById = new Map(ep.scenes.flatMap((s) => s.beats.map((b) => [b.id, b] as const)));
  for (const b of t.beats) spokenByFile.set(path.join(dir, b.audio.file), b.words.map((w) => w.text).join(" "));
  const stills: LessonStill[] = [];
  const bg = hex(fx.stills?.background ?? theme.colors.background);
  const green = hex(theme.colors.green);
  for (const b of t.beats) {
    const scene = t.scenes.find((s) => s.sceneId === b.sceneId)!;
    const frame = b.startFrame + b.durationInFrames - 2;
    const epScene = ep.scenes.find((s) => s.id === b.sceneId)!;
    const phase = (beatsById.get(b.beatId)?.visual as { phase?: string } | undefined)?.phase;
    const quiz = epScene.template === "interactive_quiz";
    const correct = (epScene.data as { correctIndex?: number }).correctIndex ?? 0;
    const lit = quiz && phase === "reveal" ? (fx.stills?.revealHighlights ?? [correct]) : [];
    const pngName = quiz ? `still_quiz_${lit.join("-") || "none"}.png` : "still_plain.png";
    const items =
      fx.stills?.overflow === b.beatId
        ? [{ id: "main:main", axis: "y" as const, scrollWidth: 1748, clientWidth: 1748, scrollHeight: 700, clientHeight: 608 }]
        : [];
    const layout = fx.stills?.collision === b.beatId ? [{ kind: "collision" as const, a: "caption", b: "main:card", detail: "overlap 48 px" }] : [];
    const boxes = quiz
      ? [0, 1, 2, 3].map((i) => ({ id: `${b.sceneId}:option-${i}`, ...OPTION_BOX(i) }))
      : [{ id: "main:main", x: 86, y: 240, w: 1748, h: 608 }];
    stills.push({
      name: `${b.sceneId}_${b.beatId}_end`,
      frame,
      sceneId: b.sceneId,
      beatId: b.beatId,
      sceneFrame: frame - scene.startFrame,
      kind: "end",
      png: path.join(dir, "stills", pngName),
      diag: { kind: "overflow", label: `${b.sceneId}/${b.beatId}`, frame: frame - scene.startFrame, items, layout, boxes },
    });
  }
  const media: Media = { dir, render: path.join(dir, "render", `${lang}.mp4`), stills, spokenByFile };
  if (fs.existsSync(done)) return media;

  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "stills"), { recursive: true });
  fs.mkdirSync(path.join(dir, "render"), { recursive: true });
  const parts: Float32Array[] = [];
  for (const b of t.beats) {
    const file = path.join(dir, b.audio.file);
    const hit = fx.audio?.beat === b.beatId;
    const samples = sine(b.audio.durationMs, hit && fx.audio?.gapMs ? { atMs: 500, ms: fx.audio.gapMs } : undefined);
    if (!(hit && fx.audio?.missing)) writeWav(file, samples, RATE);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file.replace(/\.wav$/, ".hash"), hit && fx.audio?.staleHash ? "stale0000" : b.audio.textHash);
    parts.push(samples, new Float32Array(Math.round(((b.durationInFrames / FPS) * 1000 - b.audio.durationMs) * (RATE / 1000))));
  }
  const total = parts.reduce((n, p) => n + p.length, 0);
  const mix = new Float32Array(total);
  let o = 0;
  for (const p of parts) {
    mix.set(p, o);
    o += p.length;
  }
  const mixFile = path.join(dir, "render", "mix.wav");
  writeWav(mixFile, mix, RATE);

  const sec = t.durationInFrames / FPS;
  const size = fx.video?.size ?? "960x540";
  const vf: string[] = [];
  if (fx.video?.freeze)
    vf.push(`loop=loop=${(fx.video.freeze[1] - fx.video.freeze[0]) * FPS}:size=1:start=${fx.video.freeze[0] * FPS}`, "setpts=N/FRAME_RATE/TB");
  if (fx.video?.black) vf.push(`drawbox=x=0:y=0:w=iw:h=ih:color=black:t=fill:enable='between(t,${fx.video.black[0]},${fx.video.black[1]})'`);
  const af = fx.audio?.renderGainDb ? ["-af", `volume=${fx.audio.renderGainDb}dB`] : [];
  const r = ffmpeg(
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `testsrc2=size=${size}:rate=${FPS}:duration=${sec.toFixed(3)}`,
      "-i",
      mixFile,
      ...(vf.length ? ["-vf", vf.join(",")] : []),
      ...af,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-t",
      sec.toFixed(3),
      media.render,
    ],
    5 * 60 * 1000,
  );
  if (r.code !== 0) throw new Error(`ffmpeg failed: ${r.stderr.slice(-600)}`);
  fs.rmSync(mixFile);

  fillPng(path.join(dir, "stills", "still_plain.png"), bg);
  for (const s of stills) {
    if (fs.existsSync(s.png)) continue;
    const lit = /still_quiz_(.*)\.png$/.exec(s.png)![1];
    const idx = lit === "none" ? [] : lit.split("-").map(Number);
    fillPng(
      s.png,
      bg,
      idx.map((i) => ({ ...OPTION_BOX(i), rgb: green })),
    );
  }
  fs.writeFileSync(done, JSON.stringify({ key }));
  return media;
}

/* ---------- evaluation ---------- */

export const CLEAN_FLAGS: ReleaseFlags = {
  draft: false,
  llmMock: false,
  ttsMock: false,
  fallback: [],
  reviews: [
    {
      lang: "en",
      scores: { accuracy: 5, clarity: 5, vividness: 4, sync: 5, visual_quality: 4, freshness: 4 },
      findings: [],
      summary: "Clear, accurate and well paced.",
    },
  ],
};

export interface EvalOptions {
  audio: boolean;
  render: boolean;
}

export function evaluate(clean: Clean, compiled: EpisodeCompiled, fx: Partial<BadFixture>, media: Media | null, o: EvalOptions): QaFinding[] {
  const arts = patchedArtifacts({ ...clean.artifacts, [A.compiled]: compiled }, fx.patches);
  const cfg = BookConfig.parse(arts[BOOK_CONFIG]);
  const ep = Episode.safeParse(arts[A.episode]);
  const beatById = new Map(ep.success ? ep.data.scenes.flatMap((s) => s.beats.map((b) => [b.id, b] as const)) : []);
  const res = runPartChecks({
    artifacts: arts,
    episodeHash: episodeHashOf(arts[A.episode]),
    cfg: { audience: cfg.audience, displayLanguage: cfg.displayLanguage, allowedTemplates: cfg.allowedTemplates, boilerplateDenylist: cfg.boilerplateDenylist },
    kind: "chapter_part",
    langs: clean.manifest.langs,
    scenes: clean.manifest.scenes,
    others: fx.others ?? [],
    partDir: media?.dir ?? os.tmpdir(),
    draft: true,
    spoken: (lang, id) => {
      const b = beatById.get(id);
      return b?.narration[lang] ? spokenText(b.narration[lang], lang, lexicon(cfg, lang)) : null;
    },
    expectedHash: (lang, _id, spoken) => audioHash(lang, spoken),
    renderFile: () => media?.render ?? path.join(os.tmpdir(), "missing.mp4"),
    stills: () => media?.stills ?? [],
    audio: o.audio,
    render: o.render,
    transcribe: (file) => {
      if (fx.asr && path.basename(file).startsWith(fx.asr.beat + ".")) return fx.asr.text;
      return media?.spokenByFile.get(file) ?? null;
    },
    ocr: (png) => {
      const still = media?.stills.find((s) => s.png === png);
      if (fx.ocr && still && media!.stills.some((s) => s.png === png && s.beatId === fx.ocr!.beat)) return fx.ocr.text;
      return "Compound interest grows on the growing balance.";
    },
  });
  const flags = { ...CLEAN_FLAGS, ...(fx.flags ?? {}) };
  return mergeRuns(res.run, releaseChecks(flags)).findings;
}

export const findingKey = (f: QaFinding) => [f.id, f.severity, f.lang ?? "", f.sceneId ?? "", f.beatId ?? "", f.message].join("|");

export function loadBadFixtures(): { dir: string; fx: BadFixture }[] {
  if (!fs.existsSync(BAD_DIR)) return [];
  return fs
    .readdirSync(BAD_DIR)
    .filter((d) => fs.existsSync(path.join(BAD_DIR, d, "fixture.json")))
    .sort()
    .map((d) => ({ dir: path.join(BAD_DIR, d), fx: readJson(path.join(BAD_DIR, d, "fixture.json")) as BadFixture }));
}

export function layersFor(id: string): EvalOptions {
  const layer = checkMeta(id)?.layer;
  return { audio: layer === "L4", render: layer === "L5" };
}
