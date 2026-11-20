import fs from "node:fs";
import path from "node:path";
import { check, cli, run, tail, parseJsonLoose, VERIFY_DIR, rmrf, exists } from "../lib.mjs";

let ids = [];
const OUT = path.join(VERIFY_DIR, "qa-clean");

export const checks = [
  check("registry", "QA check registry is listed", () => {
    const r = cli(["qa:checks", "--json"], { timeout: 2 * 60 * 1000 });
    try {
      ids = (parseJsonLoose(r.stdout).checks || []).map((c) => c.id);
    } catch {
      return { ok: false, detail: tail(r.out, 6) };
    }
    const prefixes = ["S-", "P-", "C-", "A-", "R-", "Q-"];
    const missingFamilies = prefixes.filter((p) => !ids.some((i) => i.startsWith(p)));
    return { ok: ids.length >= 40 && missingFamilies.length === 0, detail: `${ids.length} checks` };
  }),
  check("bad-fixtures-exist", "every QA check id has a bad fixture directory", () => {
    const miss = ids.filter((id) => !exists(`tests/fixtures/bad/${id}`));
    const pct = ids.length ? Math.round(((ids.length - miss.length) / ids.length) * 100) : 0;
    return { ok: ids.length > 0 && miss.length === 0, detail: `coverage ${pct}%` + (miss.length ? " missing " + miss.join(",") : "") };
  }),
  check("bad-fixtures-fail", "each bad fixture fails with exactly its id (vitest, coverage 100%)", () => {
    const r = run("npx", ["vitest", "run", "tests/qa", "--reporter=verbose"], { timeout: 20 * 60 * 1000 });
    const cov = /QA fixture coverage: 100% \((\d+)\/(\d+)\)/.exec(r.out);
    if (cov) console.log(`    ${cov[0]}`);
    return { ok: r.code === 0 && Boolean(cov) && Number(cov[1]) === ids.length, detail: r.code === 0 ? (cov ? cov[0] : "coverage line missing") : tail(r.out, 15) };
  }),
  check("clean-fixture", "clean fixture passes L1-L4 and the L5 checks on its draft render", () => {
    rmrf(OUT);
    const r = cli(["qa", "--fixture", "tests/fixtures/qa/clean", "--draft", "--out", OUT, "--json"], { timeout: 40 * 60 * 1000 });
    fs.writeFileSync(path.join(VERIFY_DIR, "phase7-qa.log"), r.out, "utf8");
    const f = path.join(OUT, "qa", "report.json");
    if (!fs.existsSync(f)) return { ok: false, detail: "report missing: " + tail(r.out, 6) };
    const rep = JSON.parse(fs.readFileSync(f, "utf8"));
    const failing = [...new Set((rep.findings || []).filter((x) => x.severity === "BLOCKER" || x.severity === "HIGH").map((x) => x.id))];
    const unexpected = failing.filter((x) => x !== "Q-MOCK" && x !== "Q-DRAFT");
    const ran = (rep.checks || []).filter((c) => c.status !== "skipped").map((c) => c.id);
    const l5ran = ran.filter((x) => x.startsWith("R-"));
    return {
      ok: unexpected.length === 0 && failing.includes("Q-MOCK") && l5ran.length >= 4,
      detail: `failing=${failing.join(",")} L5 ran=${l5ran.join(",")}`,
    };
  }),
  check("report-html", "qa/report.html is generated and self-contained", () => {
    const f = path.join(OUT, "qa", "report.html");
    if (!fs.existsSync(f)) return { ok: false, detail: "missing" };
    const html = fs.readFileSync(f, "utf8");
    const external = html.match(/(?:src|href)=["'](?!data:|#)[^"']+["']/gi) || [];
    return { ok: html.length > 2000 && external.length === 0 && /<img[^>]+data:image\/png;base64/i.test(html), detail: external.length ? "external refs: " + external.slice(0, 3).join(" ") : `${Math.round(html.length / 1024)} KB` };
  }),
];
