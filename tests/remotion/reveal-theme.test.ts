import { describe, expect, it } from "vitest";
import { computeReveal, REVEAL_FRAMES, revealAll, type RevealBeat } from "../../src/remotion/reveal";
import { contrastRatio, DARK_CLASSROOM, getTheme, LIGHT_CLASSROOM } from "../../src/theme/tokens";

const beats: RevealBeat[] = [
  { visual: { show: ["a"] }, visualCues: [], startFrame: 0 },
  { visual: { show: ["b"], focus: "b" }, visualCues: [{ target: "c" }], startFrame: 100, cues: [{ target: "c", frame: 130 }] },
];

describe("reveal", () => {
  it("shows managed elements from their beat or cue word, and unmanaged elements always", () => {
    const r = computeReveal(beats, 0, 50);
    expect(r.shown("a")).toBe(true);
    expect(r.shown("b")).toBe(false);
    expect(r.shown("c")).toBe(false);
    expect(r.shown("unmanaged")).toBe(true);
    expect(r.amount("unmanaged")).toBe(1);
    const r2 = computeReveal(beats, 1, 120);
    expect(r2.shown("b")).toBe(true);
    expect(r2.shown("c")).toBe(false);
    expect(r2.focused("b")).toBe(true);
    const r3 = computeReveal(beats, 1, 130 + REVEAL_FRAMES);
    expect(r3.shown("c")).toBe(true);
    expect(r3.amount("c")).toBe(1);
    const mid = computeReveal(beats, 1, 130 + REVEAL_FRAMES / 2).amount("c");
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });

  it("reveals cues without timing at the beat start (stills)", () => {
    const r = computeReveal([{ visual: { show: [] }, visualCues: [{ target: "x" }], startFrame: 10 }], 0, 10);
    expect(r.shown("x")).toBe(true);
  });

  it("revealAll shows everything", () => {
    const r = revealAll({ show: [], focus: "k" });
    expect(r.shown("anything")).toBe(true);
    expect(r.focused("k")).toBe(true);
  });
});

describe("themes", () => {
  it("meets WCAG AA for body text and AA-large for muted labels on every surface", () => {
    for (const t of [DARK_CLASSROOM, LIGHT_CLASSROOM]) {
      for (const surface of [t.colors.background, t.colors.panel, t.colors.panelRaised]) {
        expect(contrastRatio(t.colors.text, surface), `${t.id} text`).toBeGreaterThanOrEqual(7);
        expect(contrastRatio(t.colors.textMuted, surface), `${t.id} muted`).toBeGreaterThanOrEqual(4.5);
        for (const accent of ["gold", "teal", "green", "coral", "blue", "purple"] as const) {
          expect(contrastRatio(t.colors[accent], surface), `${t.id} ${accent}`).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it("resolves ids and aliases, falling back to the dark classroom", () => {
    expect(getTheme("light").id).toBe(LIGHT_CLASSROOM.id);
    expect(getTheme(undefined).id).toBe(DARK_CLASSROOM.id);
    expect(getTheme("no-such-theme").id).toBe(DARK_CLASSROOM.id);
  });
});
