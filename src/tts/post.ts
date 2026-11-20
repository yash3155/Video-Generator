/* Beat audio post-processing for real voices (S10): trim leading/trailing silence, two-pass EBU R128 loudnorm to -16 LUFS / -1.5 dBTP, MP3 out. */
import fs from "node:fs";
import { ffmpeg, mediaDurationSec } from "../core/proc";
import type { WordTiming } from "../schemas/compiled";

export interface Silence {
  start: number;
  end: number;
}

/** Silent intervals (seconds) of at least `minSec` below `noiseDb`. */
export function detectSilences(file: string, minSec: number, noiseDb = -45): Silence[] {
  const r = ffmpeg(["-i", file, "-af", `silencedetect=n=${noiseDb}dB:d=${minSec}`, "-f", "null", "-"]);
  if (r.code !== 0) throw new Error(`silencedetect failed for ${file}: ${r.stderr.slice(-300)}`);
  const out: Silence[] = [];
  let start: number | null = null;
  for (const line of r.stderr.split(/\r?\n/)) {
    const s = line.match(/silence_start:\s*(-?[\d.]+)/);
    if (s) start = Math.max(0, Number(s[1]));
    const e = line.match(/silence_end:\s*([\d.]+)/);
    if (e && start !== null) {
      out.push({ start, end: Number(e[1]) });
      start = null;
    }
  }
  if (start !== null) out.push({ start, end: mediaDurationSec(file) });
  return out;
}

export interface Loudness {
  integrated: number;
  truePeak: number;
  lra: number;
  threshold: number;
  offset: number;
}

/** Measures loudness with the loudnorm filter's analysis pass. */
export function measureLoudness(file: string, filterPrefix = ""): Loudness {
  const r = ffmpeg(["-i", file, "-af", `${filterPrefix}loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json`, "-f", "null", "-"]);
  if (r.code !== 0) throw new Error(`loudness analysis failed for ${file}: ${r.stderr.slice(-300)}`);
  const m = r.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/);
  if (!m) throw new Error(`loudnorm printed no measurement for ${file}`);
  const j = JSON.parse(m[0]) as Record<string, string>;
  return { integrated: Number(j.input_i), truePeak: Number(j.input_tp), lra: Number(j.input_lra), threshold: Number(j.input_thresh), offset: Number(j.target_offset) };
}

const KEEP_LEAD_S = 0.08;
const KEEP_TAIL_S = 0.15;

/**
 * Trims silence and normalizes loudness into `outFile` (.mp3). Word timings are shifted by the trimmed lead.
 * Returns the new duration in ms.
 */
export function postProcessBeat(inFile: string, words: WordTiming[], outFile: string): { words: WordTiming[]; durationMs: number } {
  const dur = mediaDurationSec(inFile);
  const sil = detectSilences(inFile, 0.05);
  const lead = sil.length && sil[0].start <= 0.01 ? Math.max(0, sil[0].end - KEEP_LEAD_S) : 0;
  const last = sil[sil.length - 1];
  const tailStart = last && last.end >= dur - 0.02 && last.start > lead ? last.start : dur;
  const end = Math.min(dur, tailStart + KEEP_TAIL_S);
  const trim = `atrim=start=${lead.toFixed(3)}:end=${end.toFixed(3)},asetpts=PTS-STARTPTS,`;
  const m = measureLoudness(inFile, trim);
  const ln = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.integrated}:measured_TP=${m.truePeak}:measured_LRA=${m.lra}:measured_thresh=${m.threshold}:offset=${m.offset}:linear=true`;
  const tmp = `${outFile}.tmp.mp3`;
  const r = ffmpeg(["-y", "-i", inFile, "-af", `${trim}${ln}`, "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k", tmp]);
  if (r.code !== 0) throw new Error(`loudnorm failed for ${inFile}: ${r.stderr.slice(-300)}`);
  fs.renameSync(tmp, outFile);
  const shift = lead * 1000;
  const durationMs = Math.round(mediaDurationSec(outFile) * 1000);
  return {
    words: words.map((w) => ({ text: w.text, startMs: Math.max(0, Math.round(w.startMs - shift)), endMs: Math.min(durationMs, Math.max(0, Math.round(w.endMs - shift))) })),
    durationMs,
  };
}
