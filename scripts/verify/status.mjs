#!/usr/bin/env node
// Prints the per-phase status table and NEXT_PHASE=<n> (or NEXT_PHASE=done).
// A cached phase result is reused only if it was recorded at the current HEAD on a clean tree.
import fs from "node:fs";
import path from "node:path";
import { runChecks, loadPhaseChecks, PHASES, VERIFY_DIR, gitHead } from "./lib.mjs";

const head = gitHead();
const rows = [];
let next = "done";
for (const p of PHASES) {
  const file = path.join(VERIFY_DIR, `phase-${p}.json`);
  let rec = null;
  let source = "run";
  if (fs.existsSync(file)) {
    try {
      const cached = JSON.parse(fs.readFileSync(file, "utf8"));
      if (cached.ok && head && cached.head === head && cached.dirty === false) {
        rec = cached;
        source = "cached";
      }
    } catch {
      /* re-run */
    }
  }
  if (!rec) {
    let checks;
    try {
      checks = await loadPhaseChecks(p);
    } catch (e) {
      rows.push({ p, status: "error", detail: String(e).slice(0, 120) });
      next = String(p);
      break;
    }
    console.log(`-- running phase ${p} checks --`);
    rec = await runChecks(p, checks, { quiet: false });
  }
  const failing = rec.checks.filter((c) => !c.ok).map((c) => c.id);
  rows.push({ p, status: rec.ok ? "verified" : "failing", detail: rec.ok ? source : failing.join(",") });
  if (!rec.ok) {
    next = String(p);
    break;
  }
}
for (const p of PHASES) {
  if (!rows.find((r) => r.p === p)) rows.push({ p, status: "not checked", detail: "earlier phase not verified" });
}
console.log("\nPhase | Status      | Detail");
console.log("----- | ----------- | ------");
for (const r of rows) console.log(`${String(r.p).padEnd(5)} | ${r.status.padEnd(11)} | ${r.detail}`);
console.log(`\nNEXT_PHASE=${next}`);
