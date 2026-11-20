import { describe, expect, it } from "vitest";
import { applyLexicon, buildCaptions, foldText, matchAnchor, normalizeSpoken, spokenText } from "../../src/tts/speech";
import { wordErrorRate } from "../../src/qa/audio";
import { beatAudioHash, beatVoice, defaultVoice } from "../../src/tts/voices";

const words = (s: string, step = 300) => s.split(" ").map((text, i) => ({ text, startMs: i * step, endMs: i * step + step - 20 }));

describe("spoken text", () => {
  it("spells out currency, percent and operators", () => {
    expect(normalizeSpoken("Put $1,000 at 5% so I = P × r × t", "en")).toBe("Put 1,000 dollars at 5 percent so I equals P times r times t");
    expect(normalizeSpoken("₹500 पर 5%", "hi")).toBe("500 रुपये पर 5 प्रतिशत");
  });
  it("applies the pronunciation lexicon on whole tokens only", () => {
    expect(applyLexicon("APR and APY, not APRIL", { APR: "A P R", APY: "A P Y" })).toBe("A P R and A P Y, not APRIL");
  });
  it("prefers the script's explicit spoken text", () => {
    expect(spokenText({ display: "5% p.a.", spoken: "five percent a year" }, "en")).toBe("five percent a year");
  });
});

describe("cue anchors", () => {
  const w = words("In 1790 Benjamin Franklin left money, and it grew.");
  it("finds single and multi-word anchors", () => {
    expect(matchAnchor(w, "1790", "en")).toBe(300);
    expect(matchAnchor(w, "Benjamin Franklin", "en")).toBe(600);
    expect(matchAnchor(w, "grew", "en")).toBe(w[w.length - 1].startMs);
  });
  it("returns null when the anchor is not spoken", () => {
    expect(matchAnchor(w, "Philadelphia", "en")).toBeNull();
  });
  it("folds Devanagari nukta and punctuation", () => {
    expect(foldText("फ़ंड, ज़्यादा!")).toBe(foldText("फंड ज्यादा"));
  });
});

describe("captions", () => {
  it("never exceed 16 words and break at sentence ends", () => {
    const text = Array.from({ length: 40 }, (_, i) => (i === 9 ? "end." : `w${i}`)).join(" ");
    const caps = buildCaptions(words(text));
    expect(caps.every((c) => c.words.length <= 16)).toBe(true);
    expect(caps[0].words.at(-1)!.text).toBe("end.");
    expect(caps.flatMap((c) => c.words).length).toBe(40);
  });
  it("show the display form when token counts match", () => {
    const caps = buildCaptions(words("five percent"), "5% interest");
    expect(caps[0].words.map((x) => x.text)).toEqual(["5%", "interest"]);
  });
});

describe("word error rate", () => {
  it("is 0 for identical text and counts substitutions and deletions", () => {
    expect(wordErrorRate("The bank pays interest.", "the bank pays interest")).toBe(0);
    expect(wordErrorRate("one two three four", "one two four")).toBeCloseTo(0.25);
    expect(wordErrorRate("one two three four", "one too three for")).toBeCloseTo(0.5);
  });
});

describe("voices", () => {
  const cfg = { personas: { en: { novice: { name: "Alex", voice: "en-US-AriaNeural" }, mentor: { name: "Dr. Rivera", voice: "en-US-ChristopherNeural" } } } };
  it("use persona voices for edge and defaults elsewhere", () => {
    expect(beatVoice("edge", cfg, "en", "novice")).toBe("en-US-AriaNeural");
    expect(beatVoice("edge", cfg, "en", "narrator")).toBe("en-US-ChristopherNeural");
    expect(beatVoice("piper", cfg, "en", "novice")).toBe(defaultVoice("piper", "en"));
  });
  it("hash changes with text, voice, rate and provider", () => {
    const h = beatAudioHash("hi", "v", "+0%", "edge");
    expect(h).toHaveLength(24);
    expect(new Set([h, beatAudioHash("hi!", "v", "+0%", "edge"), beatAudioHash("hi", "w", "+0%", "edge"), beatAudioHash("hi", "v", "+5%", "edge"), beatAudioHash("hi", "v", "+0%", "piper")]).size).toBe(5);
  });
});
