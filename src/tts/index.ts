import { log } from "../core/log";
import { EdgeTts } from "./edge";
import { MockTts } from "./mock";
import { PiperTts } from "./piper";
import { OpenAiTts, ElevenLabsTts, GoogleTts } from "./cloud";
import type { TtsProvider, TtsRequest, TtsResult } from "./types";

export const TTS_PROVIDER_IDS = ["edge", "piper", "mock", "openai", "elevenlabs", "google"] as const;

/**
 * Wraps a primary provider with an automatic fallback. The primary retries each request (Edge: 6 attempts with
 * exponential backoff, enough to ride out a 429 rate limit); when that still fails, every later request goes to
 * the fallback and the reason is recorded on each result.
 */
export class FallbackTts implements TtsProvider {
  readonly id: string;
  readonly mock: boolean;
  private switched = false;
  reason?: string;

  constructor(
    private readonly primary: TtsProvider,
    private readonly fallback: TtsProvider | null,
  ) {
    this.id = primary.id;
    this.mock = primary.mock;
  }

  get fallbackUsed(): boolean {
    return this.switched;
  }

  async synthesize(req: TtsRequest): Promise<TtsResult> {
    if (!this.switched) {
      try {
        return await this.primary.synthesize(req);
      } catch (e) {
        if (!this.fallback) throw e;
        this.switched = true;
        this.reason = `${this.primary.id} failed 3 times in a row: ${(e as Error).message}`;
        log.warn(`TTS fallback to ${this.fallback.id}: ${this.reason}`);
      }
    }
    const r = await this.fallback!.synthesize(req);
    return { ...r, fallbackReason: this.reason };
  }
}

export function createTtsProvider(id: string, opts: { fallback?: boolean } = {}): TtsProvider {
  switch (id) {
    case "edge": {
      const edge = new EdgeTts();
      return opts.fallback === false ? edge : new FallbackTts(edge, PiperTts.available() ? new PiperTts() : null);
    }
    case "piper":
      return new PiperTts();
    case "mock":
      return new MockTts();
    case "openai":
      return new OpenAiTts();
    case "elevenlabs":
      return new ElevenLabsTts();
    case "google":
      return new GoogleTts();
    default:
      throw new Error(`unknown TTS provider "${id}" (choose one of ${TTS_PROVIDER_IDS.join(", ")})`);
  }
}

export * from "./types";
