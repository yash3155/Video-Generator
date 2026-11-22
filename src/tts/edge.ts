import fs from "node:fs";
import path from "node:path";
import { mediaDurationSec } from "../core/proc";
import { estimateWordTimings, withRetries, type TtsProvider, type TtsRequest, type TtsResult, type WordBoundary } from "./types";

/** Minimal surface of node-edge-tts that we use; injectable for tests. */
export interface EdgeClient {
  streamAudio(text: string): AsyncGenerator<Buffer | { part: string; start: number; end: number }>;
}
export type EdgeClientFactory = (cfg: { voice: string; lang: string; rate: string; proxy?: string; timeout: number }) => EdgeClient | Promise<EdgeClient>;

const defaultFactory: EdgeClientFactory = async (cfg) => {
  const { EdgeTTS } = await import("node-edge-tts");
  return new EdgeTTS({ voice: cfg.voice, lang: cfg.lang, rate: cfg.rate, proxy: cfg.proxy, outputFormat: "audio-24khz-48kbitrate-mono-mp3", saveSubtitles: true, timeout: cfg.timeout });
};

/** "en-US-AriaNeural" -> "en-US". */
export function voiceLocale(voice: string, fallbackLang: string): string {
  const m = voice.match(/^([a-z]{2,3}-[A-Z]{2})-/);
  return m ? m[1] : fallbackLang;
}

/**
 * Microsoft Edge online voices through node-edge-tts (unofficial endpoint, no key).
 * Captures word-boundary events. Each request is retried 3 times with backoff; HTTPS_PROXY is honoured.
 */
export class EdgeTts implements TtsProvider {
  readonly id = "edge";
  readonly mock = false;

  constructor(
    private readonly factory: EdgeClientFactory = defaultFactory,
    private readonly opts: { attempts?: number; backoffMs?: number; timeoutMs?: number } = {},
  ) {}

  async synthesize(req: TtsRequest): Promise<TtsResult> {
    const audioPath = req.outBase + ".mp3";
    const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || undefined;
    const { audio, words } = await withRetries(
      async () => {
        const client = await this.factory({ voice: req.voice, lang: voiceLocale(req.voice, req.lang), rate: req.rate || "+0%", proxy, timeout: this.opts.timeoutMs ?? 60000 });
        const chunks: Buffer[] = [];
        const ws: WordBoundary[] = [];
        for await (const x of client.streamAudio(req.text)) {
          if (Buffer.isBuffer(x)) chunks.push(x);
          else ws.push({ text: x.part, startMs: x.start, endMs: x.end });
        }
        const audio = Buffer.concat(chunks);
        if (audio.length < 1000) throw new Error(`Edge TTS returned no audio for voice ${req.voice}`);
        return { audio, words: ws };
      },
      this.opts.attempts ?? 8,
      this.opts.backoffMs ?? 2000,
    );
    fs.mkdirSync(path.dirname(audioPath), { recursive: true });
    fs.writeFileSync(audioPath, audio);
    if (words.length > 0) return { audioPath, words, timingSource: "boundary", provider: this.id, voice: req.voice, mock: false };
    let durationMs: number;
    try {
      durationMs = mediaDurationSec(audioPath) * 1000;
    } catch {
      durationMs = (audio.length / 6000) * 1000;
    }
    return { audioPath, words: estimateWordTimings(req.text, durationMs), timingSource: "estimated", provider: this.id, voice: req.voice, mock: false, durationMs };
  }
}
