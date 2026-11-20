#!/usr/bin/env node
// Runs phases 0..9 and the Definition of Done checks. Only this script writes .build/BUILD_COMPLETE.
import fs from "node:fs";
import path from "node:path";
import { runChecks, loadPhaseChecks, PHASES, BUILD_DIR, gitHead, gitDirty, writeJson } from "./lib.mjs";

const sentinel = path.join(BUILD_DIR, "BUILD_COMPLETE");
if (fs.existsSync(sentinel)) fs.rmSync(sentinel);

if (gitDirty()) {
  console.log("[FAIL] working tree is not clean (git status --porcelain is not empty); commit first");
  process.exit(1);
}
const summary = {};
let ok = true;
for (const p of PHASES) {
  const checks = await loadPhaseChecks(p);
  console.log(`== phase ${p} ==`);
  const rec = await runChecks(p, checks);
  summary[p] = rec.ok;
  if (!rec.ok) ok = false;
}
console.log("== definition of done ==");
const dod = await runChecks("done", await loadPhaseChecks("done"));
summary.done = dod.ok;
if (!dod.ok) ok = false;

if (ok && !gitDirty()) {
  writeJson(sentinel, { head: gitHead(), ts: new Date().toISOString(), phases: summary });
  console.log("[OK] verify:done passed; wrote .build/BUILD_COMPLETE");
  process.exit(0);
}
console.log("[FAIL] verify:done failed: " + JSON.stringify(summary));
process.exit(1);
