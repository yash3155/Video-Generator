import fs from "node:fs";
import path from "node:path";
import { check, cli, tail, VERIFY_DIR, rmrf } from "../lib.mjs";

const HOME = path.join(VERIFY_DIR, "home-phase6");
const PART = path.join(HOME, "workspace", "books", "demo", "chapters", "ch01", "p1");
const RUN_LOG = path.join(HOME, "workspace", "books", "demo", "runs", "last.json");
const ARGS = ["make", "--book", "demo", "--chapter", "ch01", "--part", "p1", "--llm", "mock", "--tts", "mock", "--draft", "--scenes", "0,9,11", "--non-interactive"];
const env = { OPENLECTERN_HOME: HOME };

function runLog() {
  if (!fs.existsSync(RUN_LOG)) return null;
  return JSON.parse(fs.readFileSync(RUN_LOG, "utf8"));
}
let firstOk = false;

export const checks = [
  check("make", "make --llm mock --tts mock --draft --scenes 0,9,11 exits 0", () => {
    rmrf(HOME);
    fs.mkdirSync(HOME, { recursive: true });
    const r = cli(ARGS, { env, timeout: 40 * 60 * 1000 });
    fs.writeFileSync(path.join(VERIFY_DIR, "phase6-make.log"), r.out, "utf8");
    firstOk = r.code === 0;
    return { ok: r.code === 0, detail: `exit ${r.code}: ${tail(r.out, 4)}` };
  }),
  check("artifacts", "compiled episode and draft MP4 produced", () => {
    const compiled = path.join(PART, "09_episode_compiled.json");
    const mp4 = path.join(HOME, "out", "demo", "drafts", "ch01_p1_en.mp4");
    const ok = fs.existsSync(compiled) && fs.existsSync(mp4) && fs.statSync(mp4).size > 10000;
    return { ok, detail: `compiled=${fs.existsSync(compiled)} mp4=${fs.existsSync(mp4)}` };
  }),
  check("qa-mock-only-blocker", "QA report lists Q-MOCK as the only BLOCKER", () => {
    const f = path.join(PART, "qa", "report.json");
    if (!fs.existsSync(f)) return { ok: false, detail: "qa/report.json missing" };
    const rep = JSON.parse(fs.readFileSync(f, "utf8"));
    const blockers = [...new Set((rep.findings || []).filter((x) => x.severity === "BLOCKER").map((x) => x.id))];
    return { ok: blockers.length === 1 && blockers[0] === "Q-MOCK", detail: "BLOCKER ids: " + blockers.join(",") };
  }),
  check("fully-cached", "second run is fully cached (no stage re-executed)", () => {
    if (!firstOk) return { ok: false, detail: "first run failed" };
    const r = cli(ARGS, { env, timeout: 20 * 60 * 1000 });
    if (r.code !== 0) return { ok: false, detail: tail(r.out, 6) };
    const log = runLog();
    if (!log || !Array.isArray(log.stages)) return { ok: false, detail: "runs/last.json missing" };
    const ran = log.stages.filter((s) => s.status !== "cached").map((s) => s.id);
    return { ok: ran.length === 0 && log.stages.length >= 14, detail: ran.length ? "re-ran " + ran.join(",") : `${log.stages.length} stages cached` };
  }),
  check("resume-dependents", "--resume after deleting one artifact re-runs only dependent stages", () => {
    if (!firstOk) return { ok: false, detail: "first run failed" };
    const victim = path.join(PART, "07_storyboard.json");
    if (!fs.existsSync(victim)) return { ok: false, detail: "07_storyboard.json missing" };
    fs.rmSync(victim);
    const r = cli([...ARGS, "--resume"], { env, timeout: 30 * 60 * 1000 });
    if (r.code !== 0) return { ok: false, detail: tail(r.out, 6) };
    const log = runLog();
    const ran = log.stages.filter((s) => s.status !== "cached").map((s) => s.id);
    const order = ["S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13", "S14"];
    const early = ran.filter((s) => order.indexOf(s) < order.indexOf("S8"));
    const ok = ran.includes("S8") && early.length === 0 && fs.existsSync(victim);
    return { ok, detail: `re-ran ${ran.join(",") || "nothing"}` };
  }),
];
