import fs from "node:fs";
import path from "node:path";
import { check, run, rel, tail, ffprobePath } from "../lib.mjs";

const BOOK = rel("workspace", "books", "demo");
const OUTDIR = rel("out", "demo");
const PARTS = [
  { chapter: "orientation", part: "p1" },
  { chapter: "ch01", part: "p1" },
];
const LANGS = ["en", "hi"];
const RUBRIC = ["accuracy", "clarity", "vividness", "sync", "visual_quality", "freshness"];

const partDir = (p) => path.join(BOOK, "chapters", p.chapter, p.part);

export const checks = [
  check("mp4s", "released MP4s exist for Orientation and ch01 p1 in en and hi", () => {
    const miss = [];
    for (const p of PARTS) for (const l of LANGS) {
      const f = path.join(OUTDIR, `${p.chapter}_${p.part}_${l}.mp4`);
      if (!fs.existsSync(f) || fs.statSync(f).size < 1_000_000) miss.push(path.basename(f));
    }
    return { ok: miss.length === 0, detail: miss.length ? "missing " + miss.join(",") : "4 MP4s" };
  }),
  check("qa-clean", "each QA report: released, non-draft, non-mock, 0 BLOCKER, 0 HIGH, en+hi", () => {
    const bad = [];
    for (const p of PARTS) {
      const f = path.join(partDir(p), "qa", "report.json");
      if (!fs.existsSync(f)) {
        bad.push(`${p.chapter}:missing`);
        continue;
      }
      const r = JSON.parse(fs.readFileSync(f, "utf8"));
      const sev = (s) => (r.findings || []).filter((x) => x.severity === s).length;
      if (sev("BLOCKER") || sev("HIGH")) bad.push(`${p.chapter}:B${sev("BLOCKER")}/H${sev("HIGH")}`);
      if (!r.release || r.release.releasable !== true || r.release.draft || r.release.mock) bad.push(`${p.chapter}:not-releasable`);
      const langs = r.languages || [];
      for (const l of LANGS) if (!langs.includes(l)) bad.push(`${p.chapter}:no-${l}`);
    }
    return { ok: bad.length === 0, detail: bad.join(",") || "all clean" };
  }),
  check("l6-rubric", "L6 rubric scores >= 4 on every axis", () => {
    const bad = [];
    for (const p of PARTS) {
      const f = path.join(partDir(p), "qa", "review.json");
      if (!fs.existsSync(f)) {
        bad.push(`${p.chapter}:missing`);
        continue;
      }
      const r = JSON.parse(fs.readFileSync(f, "utf8"));
      const per = Array.isArray(r.reviews) ? r.reviews : [r];
      for (const rev of per) for (const axis of RUBRIC) {
        const s = rev.scores ? rev.scores[axis] : undefined;
        if (typeof s !== "number" || s < 4) bad.push(`${p.chapter}/${rev.lang || "?"}:${axis}=${s}`);
      }
    }
    return { ok: bad.length === 0, detail: bad.join(",") || "all >= 4" };
  }),
  check("recorded", "recorded replay outputs exist for every demo task", () => {
    const recDir = rel("examples", "demo-book", "recorded");
    const miss = [];
    let total = 0;
    for (const p of PARTS) {
      const f = path.join(partDir(p), "tasks.json");
      if (!fs.existsSync(f)) {
        miss.push(`${p.chapter}:tasks.json`);
        continue;
      }
      const t = JSON.parse(fs.readFileSync(f, "utf8"));
      for (const task of t.tasks || []) {
        total++;
        if (!fs.existsSync(path.join(recDir, `${task.hash}.json`))) miss.push(`${task.kind}:${task.hash.slice(0, 10)}`);
      }
    }
    return { ok: miss.length === 0 && total >= 10, detail: miss.length ? "missing " + miss.slice(0, 8).join(",") : `${total} tasks recorded` };
  }),
  check("ffprobe", "ffprobe matches R-01 (H.264 1920x1080 30fps yuv420p + AAC, duration)", async () => {
    const probe = await ffprobePath();
    if (!probe) return { ok: false, detail: "ffprobe unavailable" };
    const bad = [];
    for (const p of PARTS) for (const l of LANGS) {
      const f = path.join(OUTDIR, `${p.chapter}_${p.part}_${l}.mp4`);
      if (!fs.existsSync(f)) {
        bad.push(path.basename(f) + ":missing");
        continue;
      }
      const r = run(probe, ["-v", "error", "-show_streams", "-show_format", "-of", "json", f]);
      if (r.code !== 0) {
        bad.push(path.basename(f) + ":probe-failed " + tail(r.out, 2));
        continue;
      }
      const j = JSON.parse(r.stdout);
      const v = j.streams.find((s) => s.codec_type === "video");
      const a = j.streams.find((s) => s.codec_type === "audio");
      const fps = v ? v.r_frame_rate : "";
      if (!v || v.codec_name !== "h264" || v.width !== 1920 || v.height !== 1080 || v.pix_fmt !== "yuv420p" || (fps !== "30/1" && fps !== "30000/1000")) bad.push(path.basename(f) + ":video");
      if (!a || a.codec_name !== "aac") bad.push(path.basename(f) + ":audio");
      const compiledFile = path.join(partDir(p), "09_episode_compiled.json");
      if (fs.existsSync(compiledFile)) {
        const c = JSON.parse(fs.readFileSync(compiledFile, "utf8"));
        const tl = c.timelines && c.timelines[l];
        const expected = tl ? tl.durationInFrames / (c.fps || 30) : null;
        const dur = Number(j.format.duration);
        if (expected === null || Math.abs(dur - expected) > 0.5) bad.push(`${path.basename(f)}:duration ${dur} vs ${expected}`);
      } else bad.push(path.basename(f) + ":no-compiled");
    }
    return { ok: bad.length === 0, detail: bad.join(",") || "4 files match" };
  }),
];
