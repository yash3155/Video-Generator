// Definition of Done checks (Part J) beyond the per-phase matrix.
import fs from "node:fs";
import path from "node:path";
import { check, exists, readText, run, cli, listFiles, parseJsonLoose, tail, gitDirty } from "../lib.mjs";

const PHASE_NAMES = ["Phase 0", "Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 8", "Phase 9"];

export const checks = [
  check("no-chapter-code", "no chapter-specific code in src/", () => {
    const files = listFiles("src", (p) => /\.(ts|tsx|mjs|js)$/.test(p));
    const bad = [];
    const patterns = [/["'`]ch\d{2}["'`]/i, /chapter[_ -]?\d+\b/i, /\bch\d{1,2}_part\d/i, /\/hull\/i/, /build_ch\d+/i, /demo-book\/book\/ch\d/i];
    for (const f of files) {
      const t = fs.readFileSync(f, "utf8");
      for (const re of patterns) if (re.test(t)) bad.push(`${path.relative(process.cwd(), f)}:${re.source}`);
    }
    return { ok: bad.length === 0, detail: bad.slice(0, 6).join(" ") || `${files.length} files clean` };
  }),
  check("no-per-chapter-scripts", "no one-off per-chapter scripts", () => {
    const all = listFiles("scripts").concat(listFiles("src"));
    const bad = all.filter((p) => /(ch|chapter|video)[_-]?\d+/i.test(path.basename(p)));
    return { ok: bad.length === 0, detail: bad.map((p) => path.basename(p)).join(",") || "none" };
  }),
  check("licenses", "license files present (Apache-2.0 code, CC BY 4.0 demo, OFL fonts)", () => {
    const lic = exists("LICENSE") ? readText("LICENSE") : "";
    const pkg = JSON.parse(readText("package.json"));
    const ok = /Apache License/.test(lic) && /Version 2\.0/.test(lic) && pkg.license === "Apache-2.0" && pkg.private !== true && exists("NOTICE") && exists("examples/demo-book/LICENSE");
    return { ok, detail: `license=${pkg.license} private=${pkg.private}` };
  }),
  check("build-log", "BUILD_LOG.md shows every phase verified with command and result", () => {
    const t = readText("docs/BUILD_LOG.md");
    const miss = PHASE_NAMES.filter((p, i) => !new RegExp(`verify:phase -- ${i}\\b[^\\n]*(exit 0|verified|PASS)`, "i").test(t));
    return { ok: miss.length === 0, detail: miss.length ? "no verified evidence for " + miss.join(",") : "all phases logged" };
  }),
  check("decisions", "DECISIONS.md records assumptions", () => {
    const t = readText("docs/DECISIONS.md");
    const n = (t.match(/^## /gm) || []).length;
    return { ok: n >= 10, detail: `${n} decision entries` };
  }),
  check("qa-coverage", "every QA check has a failing fixture", () => {
    const r = cli(["qa:checks", "--json"]);
    const ids = (parseJsonLoose(r.stdout).checks || []).map((c) => c.id);
    const miss = ids.filter((id) => !exists(`tests/fixtures/bad/${id}`));
    return { ok: ids.length > 0 && miss.length === 0, detail: `${ids.length - miss.length}/${ids.length}` };
  }),
  check("ci-matrix", "CI workflow covers Linux, macOS, Windows and replay mode", () => {
    const t = exists(".github/workflows/ci.yml") ? readText(".github/workflows/ci.yml") : "";
    return { ok: /ubuntu-latest/.test(t) && /macos-latest/.test(t) && /windows-latest/.test(t) && /--llm replay --tts mock --draft/.test(t), detail: "checked" };
  }),
  check("verifier-integrity", "verifier changes after Phase 0 are additive or documented", () => {
    const log = run("git", ["log", "--format=%H %s", "--", "scripts/verify"]);
    const commits = log.stdout.trim().split(/\r?\n/).filter(Boolean);
    const decisions = readText("docs/DECISIONS.md");
    const fixes = commits.filter((c) => /^\w+ fix\(verify\)/.test(c));
    const ok = fixes.length === 0 || /Verifier change/i.test(decisions);
    return { ok, detail: `${commits.length} commits touch scripts/verify, ${fixes.length} fixes` };
  }),
  check("build-mode-left", "Part K: build-mode block and build prompt files removed", () => {
    const ci = exists(".github/copilot-instructions.md") ? readText(".github/copilot-instructions.md") : "";
    const left = /OPENLECTERN-BUILD-MODE:START/.test(ci) || exists(".github/prompts/start-build.prompt.md") || exists(".github/prompts/continue-build.prompt.md");
    return { ok: !left && /AWAITING_AGENT/.test(ci), detail: left ? "build mode still active (expected until Part K)" : "product instructions only" };
  }),
  check("clean-tree", "working tree is clean", () => ({ ok: !gitDirty(), detail: gitDirty() ? tail(run("git", ["status", "--porcelain"]).stdout, 5) : "clean" })),
];
