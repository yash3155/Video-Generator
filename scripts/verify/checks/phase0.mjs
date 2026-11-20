import { check, exists, readText, readJson, run, gitBranch } from "../lib.mjs";

export const checks = [
  check("node", "node >= 20", () => {
    const major = Number(process.versions.node.split(".")[0]);
    return { ok: major >= 20, detail: `node ${process.versions.node}` };
  }),
  check("git-main", "git repository on branch main", () => {
    const b = gitBranch();
    return { ok: b === "main", detail: `branch=${b}` };
  }),
  check("build-ignored", ".build/ is git-ignored", () => {
    const r = run("git", ["check-ignore", "-q", ".build/state.json"]);
    return { ok: r.code === 0, detail: r.code === 0 ? "ignored" : "not ignored" };
  }),
  check("prompt", "docs/BOOTSTRAP_PROMPT.md exists and contains PART L", () => {
    if (!exists("docs/BOOTSTRAP_PROMPT.md")) return { ok: false, detail: "missing" };
    return { ok: readText("docs/BOOTSTRAP_PROMPT.md").includes("PART L"), detail: "present" };
  }),
  check("logs", "docs/BUILD_LOG.md and docs/DECISIONS.md exist", () => {
    const miss = ["docs/BUILD_LOG.md", "docs/DECISIONS.md"].filter((f) => !exists(f));
    return { ok: miss.length === 0, detail: miss.length ? "missing " + miss.join(",") : "present" };
  }),
  check("verify-scripts", "verify:* scripts present", () => {
    const pkg = readJson("package.json");
    const need = ["verify:phase", "verify:status", "verify:done"];
    const miss = need.filter((s) => !pkg.scripts || !pkg.scripts[s]);
    const files = ["scripts/verify/phase.mjs", "scripts/verify/status.mjs", "scripts/verify/done.mjs", "scripts/verify/clean-clone.mjs"].filter((f) => !exists(f));
    return { ok: miss.length === 0 && files.length === 0, detail: miss.concat(files).join(",") || "present" };
  }),
];
