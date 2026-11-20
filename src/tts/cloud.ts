import fs from "node:fs";
import path from "node:path";
import { mediaDurationSec } from "../core/proc";
import { estimateWordTimings, withRetries, type TtsProvider, type TtsRequest, type TtsResult, type WordBoundary } from "./types";

async function postForJsonOrAudio(url: string, body: unknown, headers: Record<string, string>): Promise<{ json?: any; audio?: Buffer }> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`${new URL(url).host} TTS HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const type = res.headers.get("content-type") || "";
  if (type.includes("json")) return { json: await res.json() };
  return { audio: Buffer.from(await res.arrayBuffer()) };
}

function finish(audioPath: string, audio: Buffer, req: TtsRequest, provider: string, words?: WordBoundary[]): TtsResult {
  fs.mkdirSync(path.dirname(audioPath), { recursive: true });
  fs.writeFileSync(audioPath, audio);
  if (words && words.length) return { audioPath, words, timingSource: "boundary", provider, voice: req.voice, mock: false };
  const durationMs = mediaDurationSec(audioPath) * 1000;
  return { audioPath, words: estimateWordTimings(req.text, durationMs), timingSource: "estimated", provider, voice: req.voice, mock: false, durationMs };
}

/** OpenAI speech API (OPENAI_API_KEY). Word timings are estimated. */
export class OpenAiTts implements TtsProvider {
  readonly id = "openai";
  readonly mock = false;

  async synthesize(req: TtsRequest): Promise<TtsResult> {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set (add it to .env)");
    const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
    const r = await withRetries(() => postForJsonOrAudio(`${base}/audio/speech`, { model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts", voice: req.voice, input: req.text, response_format: "mp3" }, { authorization: `Bearer ${key}` }));
    if (!r.audio) throw new Error("OpenAI TTS returned no audio");
    return finish(req.outBase + ".mp3", r.audio, req, this.id);
  }
}

/** Convert ElevenLabs character alignment into word boundaries. */
export function wordsFromCharAlignment(chars: string[], starts: number[], ends: number[]): WordBoundary[] {
  const out: WordBoundary[] = [];
  let cur: WordBoundary | null = null;
  chars.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      if (cur) out.push(cur);
      cur = null;
      return;
    }
    if (!cur) cur = { text: "", startMs: Math.round(starts[i] * 1000), endMs: Math.round(ends[i] * 1000) };
    cur.text += ch;
    cur.endMs = Math.round(ends[i] * 1000);
  });
  if (cur) out.push(cur);
  return out;
}

/** ElevenLabs with character timestamps (ELEVENLABS_API_KEY); voice is an ElevenLabs voice id. */
export class ElevenLabsTts implements TtsProvider {
  readonly id = "elevenlabs";
  readonly mock = false;

  async synthesize(req: TtsRequest): Promise<TtsResult> {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("ELEVENLABS_API_KEY is not set (add it to .env)");
    const r = await withRetries(() =>
      postForJsonOrAudio(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(req.voice)}/with-timestamps`, { text: req.text, model_id: process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2" }, { "xi-api-key": key }),
    );
    const j = r.json;
    if (!j?.audio_base64) throw new Error("ElevenLabs returned no audio");
    const a = j.alignment;
    const words = a ? wordsFromCharAlignment(a.characters, a.character_start_times_seconds, a.character_end_times_seconds) : undefined;
    return finish(req.outBase + ".mp3", Buffer.from(j.audio_base64, "base64"), req, this.id, words);
  }
}

/** Google Cloud Text-to-Speech REST (GOOGLE_TTS_API_KEY). Word timings are estimated. */
export class GoogleTts implements TtsProvider {
  readonly id = "google";
  readonly mock = false;

  async synthesize(req: TtsRequest): Promise<TtsResult> {
    const key = process.env.GOOGLE_TTS_API_KEY;
    if (!key) throw new Error("GOOGLE_TTS_API_KEY is not set (add it to .env)");
    const languageCode = req.voice.match(/^[a-z]{2,3}-[A-Z]{2}/)?.[0] ?? req.lang;
    const r = await withRetries(() =>
      postForJsonOrAudio(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, { input: { text: req.text }, voice: { languageCode, name: req.voice }, audioConfig: { audioEncoding: "MP3" } }, {}),
    );
    if (!r.json?.audioContent) throw new Error("Google TTS returned no audio");
    return finish(req.outBase + ".mp3", Buffer.from(r.json.audioContent, "base64"), req, this.id);
  }
}
