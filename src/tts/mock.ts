import { writeWav } from "./wav";
import { tokenizeWords, type TtsProvider, type TtsRequest, type TtsResult, type WordBoundary } from "./types";

const SAMPLE_RATE = 24000;
const WORDS_PER_SECOND = 2.6;

/**
 * Tests and CI only: a deterministic soft tone lasting words / 2.6 seconds, with one short tone burst per word
 * and evenly spaced synthetic word boundaries. Always stamped mock (Q-MOCK blocks release).
 */
export class MockTts implements TtsProvider {
  readonly id = "mock";
  readonly mock = true;

  async synthesize(req: TtsRequest): Promise<TtsResult> {
    const words = tokenizeWords(req.text);
    const durationMs = Math.max(400, Math.round((Math.max(1, words.length) / WORDS_PER_SECOND) * 1000));
    const slot = durationMs / Math.max(1, words.length);
    const boundaries: WordBoundary[] = words.map((w, i) => ({ text: w, startMs: Math.round(i * slot), endMs: Math.round(i * slot + slot * 0.8) }));
    const n = Math.round((durationMs / 1000) * SAMPLE_RATE);
    const samples = new Float32Array(n);
    const freq = req.lang.startsWith("hi") ? 196 : 220;
    for (let i = 0; i < n; i++) {
      const tMs = (i / SAMPLE_RATE) * 1000;
      const inWord = (tMs % slot) < slot * 0.8 ? 1 : 0.15;
      samples[i] = 0.12 * inWord * Math.sin((2 * Math.PI * freq * i) / SAMPLE_RATE);
    }
    const audioPath = req.outBase + ".wav";
    writeWav(audioPath, samples, SAMPLE_RATE);
    return { audioPath, words: boundaries, timingSource: "boundary", provider: this.id, voice: req.voice, mock: true, durationMs };
  }
}
