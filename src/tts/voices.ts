/* Default voices per TTS provider and language, and the voice choice for a beat. */
import type { BookConfig } from "../schemas/book";
import { sha256, stableStringify } from "../core/fsutil";

export const DEFAULT_VOICES: Record<string, Record<string, string>> = {
  edge: { en: "en-US-AriaNeural", hi: "hi-IN-SwaraNeural" },
  mock: { en: "mock-en", hi: "mock-hi" },
  piper: { en: "en_US-lessac-medium", hi: "hi_IN-pratham-medium" },
  openai: { en: "alloy", hi: "alloy" },
  elevenlabs: { en: process.env.ELEVENLABS_VOICE || "21m00Tcm4TlvDq8ikWAM", hi: process.env.ELEVENLABS_VOICE || "21m00Tcm4TlvDq8ikWAM" },
  google: { en: "en-US-Neural2-F", hi: "hi-IN-Neural2-A" },
};

export function defaultVoice(provider: string, lang: string): string {
  const base = lang.split("-")[0];
  return DEFAULT_VOICES[provider]?.[lang] || DEFAULT_VOICES[provider]?.[base] || DEFAULT_VOICES[provider]?.en || "default";
}

/**
 * Edge (and mock) use the book's persona voices: the novice's voice for novice beats, the mentor's for mentor and narrator beats.
 * Other providers use their default voice for the language.
 */
export function beatVoice(provider: string, cfg: Pick<BookConfig, "personas">, lang: string, speaker: string): string {
  if (provider === "edge" || provider === "mock") {
    const p = cfg.personas[lang] ?? cfg.personas[lang.split("-")[0]];
    if (p) return speaker === "novice" ? p.novice.voice : p.mentor.voice;
  }
  return defaultVoice(provider, lang);
}

/** Cache key of one beat's audio; written to the .hash sidecar and to the compiled timeline (A-02). */
export function beatAudioHash(spoken: string, voice: string, rate: string, provider: string): string {
  return sha256(stableStringify({ spoken, voice, rate, provider })).slice(0, 24);
}
