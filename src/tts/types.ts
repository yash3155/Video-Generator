export interface WordBoundary {
  text: string;
  startMs: number;
  endMs: number;
}

export type TimingSource = "boundary" | "aligned" | "estimated";

export interface TtsRequest {
  /** Spoken text (already normalized for speech). */
  text: string;
  voice: string;
  lang: string;
  /** Edge-style rate such as "+0%" or "-5%". */
  rate?: string;
  /** Output path without extension; the provider adds .mp3 or .wav. */
  outBase: string;
}

export interface TtsResult {
  audioPath: string;
  words: WordBoundary[];
  timingSource: TimingSource;
  provider: string;
  voice: string;
  mock: boolean;
  durationMs?: number;
  fallbackReason?: string;
}

export interface TtsProvider {
  id: string;
  mock: boolean;
  synthesize(req: TtsRequest): Promise<TtsResult>;
}

/** Split spoken text into the words a caption shows. */
export function tokenizeWords(text: string): string[] {
  return text.split(/\s+/).map((w) => w.trim()).filter(Boolean);
}

/** Evenly distribute words over a duration, weighted by word length (used when no boundaries are available). */
export function estimateWordTimings(text: string, durationMs: number, leadMs = 0): WordBoundary[] {
  const words = tokenizeWords(text);
  if (words.length === 0) return [];
  const weights = words.map((w) => Math.max(2, w.length) + 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const span = Math.max(1, durationMs - leadMs);
  const out: WordBoundary[] = [];
  let t = leadMs;
  words.forEach((w, i) => {
    const d = (weights[i] / total) * span;
    out.push({ text: w, startMs: Math.round(t), endMs: Math.round(t + d * 0.92) });
    t += d;
  });
  return out;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retry with exponential backoff; rethrows the last error. */
export async function withRetries<T>(fn: (attempt: number) => Promise<T>, attempts = 3, baseMs = 800): Promise<T> {
  let last: unknown;
  for (let a = 0; a < attempts; a++) {
    try {
      return await fn(a);
    } catch (e) {
      last = e;
      if (a < attempts - 1) await sleep(baseMs * 2 ** a);
    }
  }
  throw last;
}
