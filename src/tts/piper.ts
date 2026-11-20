import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runSync, which } from "../core/proc";
import { wavDurationMs } from "./wav";
import { estimateWordTimings, type TtsProvider, type TtsRequest, type TtsResult } from "./types";

/** Default Piper voices per language when the persona voice is not a Piper model name. */
export const PIPER_DEFAULT_VOICES: Record<string, string> = {
  en: "en_US-lessac-medium",
  hi: "hi_IN-pratham-medium",
  de: "de_DE-thorsten-medium",
  es: "es_ES-davefx-medium",
  fr: "fr_FR-siwis-medium",
};

export function piperBinary(): string | null {
  const env = process.env.PIPER_BINARY;
  if (env && fs.existsSync(env)) return env;
  return which("piper");
}

export function piperVoicesDir(): string {
  return process.env.PIPER_VOICES_DIR || path.join(os.homedir(), ".local", "share", "piper");
}

/** Resolve a persona voice to a Piper .onnx model path, or null when none is installed. */
export function piperModelFor(voice: string, lang: string): string | null {
  const dir = piperVoicesDir();
  const base = lang.split("-")[0];
  for (const name of [voice, PIPER_DEFAULT_VOICES[base]]) {
    if (!name) continue;
    const f = name.endsWith(".onnx") ? name : path.join(dir, `${name}.onnx`);
    if (fs.existsSync(f)) return f;
  }
  return null;
}

/** Piper: open-source, offline neural TTS. Word timings are estimated (forced alignment happens in S10 when whisper.cpp is present). */
export class PiperTts implements TtsProvider {
  readonly id = "piper";
  readonly mock = false;

  static available(): boolean {
    return piperBinary() !== null;
  }

  async synthesize(req: TtsRequest): Promise<TtsResult> {
    const bin = piperBinary();
    if (!bin) throw new Error("piper is not installed (set PIPER_BINARY or put piper on PATH)");
    const model = piperModelFor(req.voice, req.lang);
    if (!model) throw new Error(`no Piper voice model for ${req.voice} / ${req.lang} in ${piperVoicesDir()}`);
    const audioPath = req.outBase + ".wav";
    fs.mkdirSync(path.dirname(audioPath), { recursive: true });
    const r = runSync(bin, ["--model", model, "--output_file", audioPath], { input: req.text, timeoutMs: 5 * 60 * 1000 });
    if (r.code !== 0 || !fs.existsSync(audioPath)) throw new Error(`piper failed: ${r.stderr.slice(-300)}`);
    const durationMs = wavDurationMs(audioPath);
    return { audioPath, words: estimateWordTimings(req.text, durationMs), timingSource: "estimated", provider: this.id, voice: path.basename(model, ".onnx"), mock: false, durationMs };
  }
}
