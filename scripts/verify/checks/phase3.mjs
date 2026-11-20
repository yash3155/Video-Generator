import fs from "node:fs";
import path from "node:path";
import { check, exists, run, cli, tail, parseJsonLoose, VERIFY_DIR, rmrf } from "../lib.mjs";

export const checks = [
  check("unit-tests", "provider and connector unit tests pass", () => {
    const need = ["tests/providers", "tests/connectors"];
    const miss = need.filter((d) => !exists(d));
    if (miss.length) return { ok: false, detail: "missing " + miss.join(",") };
    const r = run("npx", ["vitest", "run", "tests/providers", "tests/connectors", "--reporter=dot"], { timeout: 15 * 60 * 1000 });
    return { ok: r.code === 0, detail: r.code === 0 ? "exit 0" : tail(r.out, 15) };
  }),
  check("tts-mock", "openlectern tts:test --provider mock writes audio + word boundaries", () => {
    const out = path.join(VERIFY_DIR, "tts-mock");
    rmrf(out);
    const r = cli(["tts:test", "--provider", "mock", "--out", out, "--json"], { timeout: 5 * 60 * 1000 });
    if (r.code !== 0) return { ok: false, detail: tail(r.out, 8) };
    const j = parseJsonLoose(r.stdout);
    const audioOk = j.audioPath && fs.existsSync(j.audioPath) && fs.statSync(j.audioPath).size > 1000;
    const words = j.wordsPath && fs.existsSync(j.wordsPath) ? JSON.parse(fs.readFileSync(j.wordsPath, "utf8")) : [];
    const wb = Array.isArray(words) ? words : words.words || [];
    return { ok: Boolean(audioOk) && wb.length > 3, detail: `audio=${Boolean(audioOk)} words=${wb.length}` };
  }),
  check(
    "tts-edge",
    "openlectern tts:test --provider edge (live network)",
    () => {
      const out = path.join(VERIFY_DIR, "tts-edge");
      rmrf(out);
      const r = cli(["tts:test", "--provider", "edge", "--out", out, "--json"], { timeout: 3 * 60 * 1000 });
      if (r.code !== 0) {
        if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network|offline|EAI_AGAIN|websocket/i.test(r.out)) return { ok: false, skip: true, detail: "offline: " + tail(r.out, 2) };
        return { ok: false, detail: tail(r.out, 8) };
      }
      const j = parseJsonLoose(r.stdout);
      const words = j.wordsPath && fs.existsSync(j.wordsPath) ? JSON.parse(fs.readFileSync(j.wordsPath, "utf8")) : [];
      const wb = Array.isArray(words) ? words : words.words || [];
      return { ok: fs.existsSync(j.audioPath) && wb.length > 3, detail: `words=${wb.length} timing=${j.timingSource}` };
    },
    { optional: true },
  ),
  check("research-detect", "openlectern research:detect --json returns detected connectors", () => {
    const r = cli(["research:detect", "--json"], { timeout: 2 * 60 * 1000 });
    try {
      const j = parseJsonLoose(r.stdout);
      const ids = (j.connectors || []).map((c) => c.id);
      const need = ["notebooklm-mcp", "nlm-cli", "manual", "local-file"];
      const miss = need.filter((n) => !ids.includes(n));
      return { ok: r.code === 0 && miss.length === 0, detail: miss.length ? "missing " + miss.join(",") : ids.join(",") };
    } catch {
      return { ok: false, detail: tail(r.out, 8) };
    }
  }),
  check("handoff-exit-test", "--handoff exit returns code 75 with AWAITING_AGENT lines (fixture test)", () => {
    const file = "tests/providers/handoff-exit.test.ts";
    if (!exists(file)) return { ok: false, detail: "missing " + file };
    const src = fs.readFileSync(file, "utf8");
    if (!/75/.test(src) || !/AWAITING_AGENT/.test(src)) return { ok: false, detail: "test does not assert 75 and AWAITING_AGENT" };
    const r = run("npx", ["vitest", "run", file, "--reporter=dot"], { timeout: 10 * 60 * 1000 });
    return { ok: r.code === 0, detail: r.code === 0 ? "exit 0" : tail(r.out, 12) };
  }),
];
