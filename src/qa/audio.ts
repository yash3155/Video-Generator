/* L4 audio checks (A-xx) over one language timeline of a compiled episode. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { CompiledBeat, EpisodeCompiled } from "../schemas/compiled";
import { mediaDurationSec, runSync, which } from "../core/proc";
import { detectSilences, measureLoudness } from "../tts/post";
import { foldText } from "../tts/speech";
import { finding, type QaFinding } from "./finding";
import { emptyRun, type CheckRun } from "./content";

export interface AudioQaContext {
  partDir: string;
  compiled: EpisodeCompiled;
  lang: string;
  /** Hash of the beat's current spoken text, voice, rate and provider (null when the beat is gone from the episode). */
  expectedHash: (beat: CompiledBeat) => string | null;
  /** Current spoken text of a beat (A-07). */
  spoken: (beat: CompiledBeat) => string | null;
  /** Rendered video of this language (A-04 measures its mixed audio). */
  renderFile?: string;
  /** Scene ids that were rendered (subset renders). */
  sceneIds?: string[];
  /** ASR override for A-07 (default: the Whisper CLI when installed). */
  transcribe?: (file: string, lang: string) => string | null;
}

const FPS = 30;

/** Word error rate between a reference and a hypothesis (Levenshtein over folded words). */
export function wordErrorRate(ref: string, hyp: string): number {
  const a = foldText(ref).split(/\s+/).filter(Boolean);
  const b = foldText(hyp).split(/\s+/).filter(Boolean);
  if (!a.length) return b.length ? 1 : 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length] / a.length;
}

function whisperTranscript(file: string, lang: string): string | null {
  const bin = which("whisper");
  if (!bin) return null;
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "ol-asr-"));
  try {
    const r = runSync(bin, [file, "--model", "tiny", "--language", lang.split("-")[0], "--output_format", "txt", "--output_dir", out, "--fp16", "False"], { timeoutMs: 180000 });
    if (r.code !== 0) return null;
    const txt = fs.readdirSync(out).find((f) => f.endsWith(".txt"));
    return txt ? fs.readFileSync(path.join(out, txt), "utf8") : null;
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
}

export function audioChecks(ctx: AudioQaContext): CheckRun {
  const run = emptyRun();
  const f: QaFinding[] = run.findings;
  const lang = ctx.lang;
  const t = ctx.compiled.timelines[lang];
  if (!t) {
    f.push(finding("A-01", "BLOCKER", `no compiled timeline for ${lang}`, "S10 did not produce this language.", "Re-run S10.", { lang }));
    run.ran.push("A-01");
    for (const id of ["A-02", "A-03", "A-04", "A-05", "A-06", "A-07"]) run.skipped[id] = "no timeline";
    return run;
  }
  const scenes = ctx.sceneIds ? t.scenes.filter((s) => ctx.sceneIds!.includes(s.sceneId)) : t.scenes;
  const beats = t.beats.filter((b) => scenes.some((s) => s.sceneId === b.sceneId));
  const mock = beats.some((b) => b.audio.mock);
  const measured = new Map<string, number>();
  const where = (b: CompiledBeat) => ({ lang, sceneId: b.sceneId, beatId: b.beatId });

  run.ran.push("A-01");
  for (const b of beats) {
    const file = path.join(ctx.partDir, b.audio.file);
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      f.push(finding("A-01", "BLOCKER", `beat audio ${b.audio.file} is missing or empty`, "The TTS output was not written.", "Re-run S10 for this beat.", where(b)));
      continue;
    }
    let sec: number;
    try {
      sec = mediaDurationSec(file);
    } catch (e) {
      f.push(finding("A-01", "BLOCKER", `beat audio ${b.audio.file} does not decode`, String((e as Error).message).slice(0, 200), "Re-synthesize the beat.", where(b)));
      continue;
    }
    measured.set(b.beatId + "@" + b.sceneId, sec * 1000);
    if (sec <= 0.5) f.push(finding("A-01", "BLOCKER", `beat audio lasts ${sec.toFixed(2)} s (<= 0.5 s)`, "TTS returned a truncated clip.", "Re-synthesize the beat.", where(b)));
  }

  run.ran.push("A-02");
  for (const b of beats) {
    const want = ctx.expectedHash(b);
    const side = path.join(ctx.partDir, b.audio.file.replace(/\.[a-z0-9]+$/i, ".hash"));
    const have = fs.existsSync(side) ? fs.readFileSync(side, "utf8").trim() : null;
    if (want === null) f.push(finding("A-02", "BLOCKER", "the compiled beat no longer exists in 08_episode.json", "The episode changed after S10.", "Re-run S10.", where(b)));
    else if (have !== want || b.audio.textHash !== want)
      f.push(finding("A-02", "BLOCKER", "audio is stale: its hash does not match the current spoken text", `expected ${want}, .hash ${have ?? "missing"}, compiled ${b.audio.textHash}`, "Re-run S10 to regenerate the stale audio.", where(b)));
  }

  run.ran.push("A-03");
  let total = 0;
  for (const s of scenes) {
    let want = 0;
    let complete = true;
    for (const b of beats.filter((x) => x.sceneId === s.sceneId)) {
      const ms = measured.get(b.beatId + "@" + b.sceneId);
      if (ms === undefined) complete = false;
      else want += ms + b.pauseAfterMs;
      const frames = Math.ceil((((ms ?? b.audio.durationMs) + b.pauseAfterMs) / 1000) * FPS);
      if (ms !== undefined && Math.abs(frames - b.durationInFrames) > 1)
        f.push(finding("A-03", "HIGH", `beat lasts ${b.durationInFrames} frames but audio + pause needs ${frames}`, "The compiled timeline was measured from different audio.", "Re-run S10 to re-measure the audio.", where(b)));
    }
    if (!complete) continue;
    const drift = Math.abs(s.durationInFrames / FPS - want / 1000);
    total += s.durationInFrames / FPS - want / 1000;
    if (drift > 10) f.push(finding("A-03", "BLOCKER", `scene timeline drifts ${drift.toFixed(2)} s from its audio`, "The compiled timeline does not match the audio files.", "Re-run S10.", { lang, sceneId: s.sceneId }));
    else if (drift >= 0.5) f.push(finding("A-03", "HIGH", `scene timeline drifts ${drift.toFixed(2)} s from its audio (limit 0.5 s)`, "The compiled timeline does not match the audio files.", "Re-run S10.", { lang, sceneId: s.sceneId }));
  }
  if (Math.abs(total) >= 1) f.push(finding("A-03", Math.abs(total) > 10 ? "BLOCKER" : "HIGH", `total timeline drift ${Math.abs(total).toFixed(2)} s (limit 1.0 s)`, "The compiled timeline does not match the audio files.", "Re-run S10.", { lang }));

  if (mock) run.skipped["A-04"] = "mock TTS audio is a synthetic tone";
  else if (!ctx.renderFile || !fs.existsSync(ctx.renderFile)) run.skipped["A-04"] = "no rendered video to measure";
  else {
    run.ran.push("A-04");
    const l = measureLoudness(ctx.renderFile);
    if (Math.abs(l.integrated + 16) > 1) f.push(finding("A-04", "HIGH", `integrated loudness ${l.integrated.toFixed(1)} LUFS (target -16 +/- 1)`, "Beat audio was not normalized.", "Re-normalize the beat audio (two-pass loudnorm).", { lang }));
    if (l.truePeak > -1) f.push(finding("A-04", "HIGH", `true peak ${l.truePeak.toFixed(1)} dBTP (limit -1)`, "The audio clips or is too hot.", "Re-normalize the beat audio with TP -1.5.", { lang }));
  }

  if (mock) run.skipped["A-05"] = "mock TTS audio is a synthetic tone";
  else {
    run.ran.push("A-05");
    for (const b of beats) {
      if (!measured.has(b.beatId + "@" + b.sceneId)) continue;
      const file = path.join(ctx.partDir, b.audio.file);
      const sec = measured.get(b.beatId + "@" + b.sceneId)! / 1000;
      for (const s of detectSilences(file, 1.5))
        if (s.start > 0.05 && s.end < sec - 0.05)
          f.push(finding("A-05", "MEDIUM", `internal silence ${s.start.toFixed(1)}-${s.end.toFixed(1)} s`, "The TTS paused inside the beat.", "Re-synthesize the beat; check the spoken text for long pauses.", where(b)));
    }
  }

  run.ran.push("A-06");
  for (const b of beats) {
    for (const target of b.unresolvedCues)
      f.push(finding("A-06", "BLOCKER", `visual cue "${target}" has no anchor word in the spoken audio`, "The anchor word is not in the TTS word timings.", "Anchor the cue on a word that is spoken in that beat.", where(b)));
    const endMs = b.audio.durationMs;
    for (const c of b.cues)
      if (c.atMs > endMs + 1) f.push(finding("A-06", "BLOCKER", `visual cue "${c.target}" fires after the beat audio ends`, `cue at ${c.atMs} ms, audio ${endMs} ms`, "Anchor the cue on a word inside the beat.", where(b)));
  }

  const transcribe = ctx.transcribe ?? (which("whisper") ? whisperTranscript : null);
  if (!transcribe) run.skipped["A-07"] = "Whisper CLI not found";
  else if (mock) run.skipped["A-07"] = "mock TTS audio has no speech";
  else {
    run.ran.push("A-07");
    for (const b of beats) {
      const ref = ctx.spoken(b);
      if (!ref) continue;
      const hyp = transcribe(path.join(ctx.partDir, b.audio.file), lang);
      if (hyp === null) continue;
      const wer = wordErrorRate(ref, hyp);
      if (wer > 0.2) f.push(finding("A-07", "HIGH", `ASR word error rate ${(wer * 100).toFixed(0)}% (limit 12%)`, `heard: ${hyp.trim().slice(0, 160)}`, "Fix the spoken text or the pronunciation lexicon.", where(b)));
      else if (wer >= 0.12) f.push(finding("A-07", "MEDIUM", `ASR word error rate ${(wer * 100).toFixed(0)}% (limit 12%)`, `heard: ${hyp.trim().slice(0, 160)}`, "Fix the spoken text or the pronunciation lexicon.", where(b)));
    }
  }
  return run;
}
