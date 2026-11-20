#!/usr/bin/env node
// Clone the committed repository into a temp folder, install with `npm ci`, and run the README
// quick start in non-interactive replay mode. Exits 0 only if the demo run succeeds and its
// 08_episode.json matches the recorded hash.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT, run, tmpDir, rmrf, tail, BUILD_DIR } from "./lib.mjs";
import { QUICKSTART } from "./checks/phase9.mjs";

const keep = process.argv.includes("--keep");
const logDir = path.join(BUILD_DIR, "logs");
fs.mkdirSync(logDir, { recursive: true });
const log = (m) => console.log(m);
const tmp = tmpDir("openlectern-clone-");
const repo = path.join(tmp, "repo");
let code = 1;
try {
  log(`[INFO] cloning into ${repo}`);
  let r = run("git", ["clone", "--quiet", "--no-hardlinks", ROOT, repo], { timeout: 10 * 60 * 1000 });
  if (r.code !== 0) throw new Error("git clone failed: " + tail(r.out, 5));

  log("[INFO] npm ci");
  r = run("npm", ["ci", "--no-audit", "--no-fund"], { cwd: repo, timeout: 40 * 60 * 1000 });
  fs.writeFileSync(path.join(logDir, "clean-clone-npm-ci.log"), r.out, "utf8");
  if (r.code !== 0) throw new Error("npm ci failed: " + tail(r.out, 10));

  log(`[INFO] ${QUICKSTART}`);
  const args = QUICKSTART.split(" ").slice(1);
  r = run("npm", args, { cwd: repo, timeout: 60 * 60 * 1000, env: { OPENLECTERN_HOME: "" } });
  fs.writeFileSync(path.join(logDir, "clean-clone-quickstart.log"), r.out, "utf8");
  if (r.code !== 0) throw new Error("quick start failed: " + tail(r.out, 15));

  const part = path.join(repo, "workspace", "books", "demo", "chapters", "ch01", "p1");
  const episode = path.join(part, "08_episode.json");
  const mp4 = path.join(repo, "out", "demo", "drafts", "ch01_p1_en.mp4");
  if (!fs.existsSync(episode)) throw new Error("08_episode.json missing");
  if (!fs.existsSync(mp4)) throw new Error("draft MP4 missing");
  const report = JSON.parse(fs.readFileSync(path.join(part, "qa", "report.json"), "utf8"));
  const failing = [...new Set(report.findings.filter((f) => f.severity === "BLOCKER" || f.severity === "HIGH").map((f) => f.id))];
  const unexpected = failing.filter((id) => id !== "Q-MOCK" && id !== "Q-DRAFT");
  if (unexpected.length) throw new Error("unexpected QA failures in replay run: " + unexpected.join(","));

  const manifestFile = path.join(repo, "examples", "demo-book", "recorded", "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  const hash = crypto.createHash("sha256").update(fs.readFileSync(episode)).digest("hex");
  const expected = manifest.episodeHashes && manifest.episodeHashes["ch01/p1"];
  if (hash !== expected) throw new Error(`08_episode.json hash ${hash.slice(0, 12)} != recorded ${String(expected).slice(0, 12)}`);
  log(`[OK] clean clone quick start reproduced the recorded episode (${hash.slice(0, 12)})`);
  code = 0;
} catch (e) {
  console.log("[FAIL] " + (e && e.message ? e.message : String(e)));
} finally {
  if (!keep) rmrf(tmp);
}
process.exit(code);
