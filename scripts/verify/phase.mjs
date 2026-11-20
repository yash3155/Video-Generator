#!/usr/bin/env node
// Usage: node scripts/verify/phase.mjs <n>   (npm run verify:phase -- <n>)
import { runChecks, loadPhaseChecks, PHASES } from "./lib.mjs";

const arg = process.argv[2];
const phase = arg === "done" ? "done" : Number(arg);
if (arg === undefined || (phase !== "done" && !PHASES.includes(phase))) {
  console.error("[FAIL] usage: npm run verify:phase -- <0..9>");
  process.exit(2);
}
const checks = await loadPhaseChecks(phase);
console.log(`== verify phase ${phase}: ${checks.length} checks ==`);
const rec = await runChecks(phase, checks);
const failed = rec.checks.filter((c) => !c.ok);
console.log(rec.ok ? `[OK] phase ${phase} verified` : `[FAIL] phase ${phase}: ${failed.length} failing check(s): ${failed.map((c) => c.id).join(", ")}`);
process.exit(rec.ok ? 0 : 1);
