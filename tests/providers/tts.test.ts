import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { MockTts } from "../../src/tts/mock";
import { EdgeTts, voiceLocale, type EdgeClientFactory } from "../../src/tts/edge";
import { FallbackTts, createTtsProvider } from "../../src/tts/index";
import { wordsFromCharAlignment } from "../../src/tts/cloud";
import { piperModelFor } from "../../src/tts/piper";
import { estimateWordTimings, tokenizeWords, type TtsProvider, type TtsRequest } from "../../src/tts/types";
import { wavDurationMs } from "../../src/tts/wav";

let dir: string;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "ol-tts-"));
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

const req = (over: Partial<TtsRequest> = {}): TtsRequest => ({ text: "Interest is the price of using money for one year", voice: "en-US-AriaNeural", lang: "en", outBase: path.join(dir, "b1"), ...over });

describe("mock TTS", () => {
  it("writes a WAV of words / 2.6 seconds with evenly spaced boundaries and the mock stamp", async () => {
    const r = await new MockTts().synthesize(req());
    const words = tokenizeWords(req().text).length;
    expect(r.mock).toBe(true);
    expect(r.timingSource).toBe("boundary");
    expect(r.words).toHaveLength(words);
    expect(Math.abs(wavDurationMs(r.audioPath) - (words / 2.6) * 1000)).toBeLessThan(5);
    const gaps = r.words.slice(1).map((w, i) => w.startMs - r.words[i].startMs);
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(1);
  });

  it("is deterministic", async () => {
    const a = await new MockTts().synthesize(req({ outBase: path.join(dir, "a") }));
    const b = await new MockTts().synthesize(req({ outBase: path.join(dir, "b") }));
    expect(fs.readFileSync(a.audioPath).equals(fs.readFileSync(b.audioPath))).toBe(true);
  });
});

function fakeEdge(behaviour: "ok" | "fail" | "no-boundaries", calls: { n: number; cfg?: unknown }): EdgeClientFactory {
  return (cfg) => {
    calls.n++;
    calls.cfg = cfg;
    return {
      async *streamAudio(text: string) {
        if (behaviour === "fail") throw new Error("websocket closed");
        let t = 50;
        for (const w of text.split(" ")) {
          yield Buffer.alloc(400, 1);
          if (behaviour === "ok") yield { part: w, start: t, end: t + 200 };
          t += 250;
        }
      },
    };
  };
}

describe("edge TTS", () => {
  it("collects audio and word-boundary events", async () => {
    const calls = { n: 0, cfg: undefined as unknown };
    const r = await new EdgeTts(fakeEdge("ok", calls)).synthesize(req());
    expect(r.timingSource).toBe("boundary");
    expect(r.words[0]).toEqual({ text: "Interest", startMs: 50, endMs: 250 });
    expect(fs.statSync(r.audioPath).size).toBeGreaterThan(1000);
    expect(r.audioPath.endsWith(".mp3")).toBe(true);
    expect(calls.cfg).toMatchObject({ voice: "en-US-AriaNeural", lang: "en-US", rate: "+0%" });
  });

  it("retries six times (rate limits), then fails", async () => {
    const calls = { n: 0 };
    await expect(new EdgeTts(fakeEdge("fail", calls), { backoffMs: 1 }).synthesize(req())).rejects.toThrow(/websocket/);
    expect(calls.n).toBe(6);
  });

  it("passes the proxy from HTTPS_PROXY", async () => {
    const saved = process.env.HTTPS_PROXY;
    process.env.HTTPS_PROXY = "http://proxy.example:8080";
    try {
      const calls = { n: 0, cfg: undefined as unknown };
      await new EdgeTts(fakeEdge("ok", calls)).synthesize(req());
      expect((calls.cfg as { proxy: string }).proxy).toBe("http://proxy.example:8080");
    } finally {
      if (saved === undefined) delete process.env.HTTPS_PROXY;
      else process.env.HTTPS_PROXY = saved;
    }
  });

  it("derives the locale from the voice name", () => {
    expect(voiceLocale("hi-IN-MadhurNeural", "hi")).toBe("hi-IN");
    expect(voiceLocale("custom", "en")).toBe("en");
  });
});

describe("fallback", () => {
  it("switches to the fallback after the primary fails and records the reason", async () => {
    const bad: TtsProvider = { id: "edge", mock: false, synthesize: async () => Promise.reject(new Error("rate limited")) };
    let primaryCalls = 0;
    const counting: TtsProvider = { ...bad, synthesize: async (r) => (primaryCalls++, bad.synthesize(r)) };
    const f = new FallbackTts(counting, new MockTts());
    const r1 = await f.synthesize(req({ outBase: path.join(dir, "x1") }));
    const r2 = await f.synthesize(req({ outBase: path.join(dir, "x2") }));
    expect(f.fallbackUsed).toBe(true);
    expect(r1.provider).toBe("mock");
    expect(r2.fallbackReason).toMatch(/rate limited/);
    expect(primaryCalls).toBe(1);
  });

  it("rethrows when there is no fallback", async () => {
    const bad: TtsProvider = { id: "edge", mock: false, synthesize: async () => Promise.reject(new Error("down")) };
    await expect(new FallbackTts(bad, null).synthesize(req())).rejects.toThrow(/down/);
  });

  it("the factory knows every provider id", () => {
    for (const id of ["edge", "piper", "mock", "openai", "elevenlabs", "google"]) expect(createTtsProvider(id).id).toBe(id);
    expect(() => createTtsProvider("nope")).toThrow(/unknown TTS provider/);
  });
});

describe("timing helpers", () => {
  it("estimates monotonic word timings inside the duration", () => {
    const w = estimateWordTimings("one two three four", 2000);
    expect(w).toHaveLength(4);
    for (let i = 1; i < w.length; i++) expect(w[i].startMs).toBeGreaterThanOrEqual(w[i - 1].endMs);
    expect(w[3].endMs).toBeLessThanOrEqual(2000);
  });

  it("turns ElevenLabs character alignment into words", () => {
    const chars = [..."hi there"];
    const starts = chars.map((_c, i) => i * 0.1);
    const ends = chars.map((_c, i) => i * 0.1 + 0.08);
    expect(wordsFromCharAlignment(chars, starts, ends)).toEqual([
      { text: "hi", startMs: 0, endMs: 180 },
      { text: "there", startMs: 300, endMs: 780 },
    ]);
  });

  it("finds Piper models in PIPER_VOICES_DIR, by name or language default", () => {
    const saved = process.env.PIPER_VOICES_DIR;
    process.env.PIPER_VOICES_DIR = dir;
    try {
      fs.writeFileSync(path.join(dir, "en_US-lessac-medium.onnx"), "");
      expect(piperModelFor("en-US-AriaNeural", "en")).toBe(path.join(dir, "en_US-lessac-medium.onnx"));
      expect(piperModelFor("x", "hi")).toBeNull();
    } finally {
      if (saved === undefined) delete process.env.PIPER_VOICES_DIR;
      else process.env.PIPER_VOICES_DIR = saved;
    }
  });
});
