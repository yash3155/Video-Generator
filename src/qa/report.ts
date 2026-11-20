/* S12 QA report: merges check runs into qa/report.json (QaReport) and a self-contained qa/report.html (embedded PNGs, no external references). */
import fs from "node:fs";
import path from "node:path";
import { QaReport, type QaFinding, type QaReview } from "../schemas/qa";
import { writeJson, writeText, ensureDir } from "../core/fsutil";
import { QA_CHECKS } from "./registry";
import { finding } from "./finding";
import type { CheckRun } from "./content";
import { thumbnail } from "../render/lesson";

export interface ReleaseFlags {
  draft: boolean;
  /** Rendered scene subset (--scenes); a subset is never releasable. */
  scenes?: number[];
  llmMock: boolean;
  ttsMock: boolean;
  fallback: { lang: string; reason?: string }[];
  /** L6 reviews; undefined when the review was skipped. */
  reviews?: QaReview[];
  reviewSkipped?: string;
}

/** Adds the Q-xx release checks to a run. */
export function releaseChecks(flags: ReleaseFlags): CheckRun {
  const findings: QaFinding[] = [];
  const ran = ["Q-MOCK", "Q-DRAFT", "Q-FALLBACK"];
  const skipped: Record<string, string> = {};
  if (flags.llmMock || flags.ttsMock) {
    const what = [flags.llmMock ? "mock LLM" : "", flags.ttsMock ? "mock TTS" : ""].filter(Boolean).join(" and ");
    findings.push(finding("Q-MOCK", "BLOCKER", `built with ${what}`, "Mock providers produce placeholder content and audio.", "Run with a real LLM (or agent hand-off) and a real TTS provider."));
  }
  if (flags.draft || flags.scenes?.length) {
    const what = [flags.draft ? "draft quality" : "", flags.scenes?.length ? `scenes ${flags.scenes.join(",")} only` : ""].filter(Boolean).join(", ");
    findings.push(finding("Q-DRAFT", "HIGH", `rendered as ${what}`, "Drafts and scene subsets are previews.", "Render without --draft and --scenes."));
  }
  for (const fb of flags.fallback) findings.push(finding("Q-FALLBACK", "LOW", `TTS fell back to another provider for ${fb.lang}`, fb.reason ?? "primary provider failed", "Check the network or Edge TTS; the fallback output is releasable but noted.", { lang: fb.lang }));
  if (flags.reviews) {
    ran.push("Q-REVIEW");
    for (const r of flags.reviews)
      for (const [axis, score] of Object.entries(r.scores))
        if (score < 4) findings.push(finding("Q-REVIEW", "HIGH", `review score ${axis} = ${score} (< 4)`, r.summary, r.findings.filter((x) => x.axis === axis).map((x) => x.suggestion).join(" ") || "Apply the reviewer's suggestions.", { lang: r.lang }));
  } else skipped["Q-REVIEW"] = flags.reviewSkipped ?? "review not run";
  return { findings, ran, skipped };
}

export function buildReport(meta: { bookId: string; chapterId: string; partId: string; languages: string[] }, run: CheckRun, flags: ReleaseFlags): QaReport {
  const summary = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const x of run.findings) summary[x.severity]++;
  const checks = QA_CHECKS.map((c) => {
    const failing = run.findings.some((x) => x.id === c.id);
    if (failing) return { id: c.id, title: c.title, layer: c.layer, status: "fail" as const };
    if (run.ran.includes(c.id)) return { id: c.id, title: c.title, layer: c.layer, status: "pass" as const };
    return { id: c.id, title: c.title, layer: c.layer, status: "skipped" as const, reason: run.skipped[c.id] ?? "not evaluated in this run" };
  });
  const releasable = summary.BLOCKER === 0 && summary.HIGH === 0;
  const blocking = [...new Set(run.findings.filter((x) => x.severity === "BLOCKER" || x.severity === "HIGH").map((x) => x.id))];
  const report: QaReport = {
    bookId: meta.bookId,
    chapterId: meta.chapterId,
    partId: meta.partId,
    languages: meta.languages,
    generatedAt: new Date().toISOString(),
    ...(flags.scenes?.length ? { scenesRendered: flags.scenes } : {}),
    release: {
      releasable,
      draft: flags.draft || Boolean(flags.scenes?.length),
      mock: flags.llmMock || flags.ttsMock,
      reason: releasable ? "0 BLOCKER and 0 HIGH findings" : `blocked by ${blocking.join(", ")}`,
    },
    summary,
    checks,
    findings: run.findings,
  };
  return QaReport.parse(report);
}

export interface ReportStill {
  png: string;
  lang: string;
  sceneId: string;
  beatId: string;
  narration: string;
}

export interface ReportMedia {
  contactSheets: { lang: string; png: string }[];
  stills: ReportStill[];
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const dataUri = (buf: Buffer) => `data:image/png;base64,${buf.toString("base64")}`;

export function reportHtml(report: QaReport, media: ReportMedia): string {
  const sev = (s: string) => `<span class="sev ${s}">${s}</span>`;
  const rows = report.findings
    .map((f) => `<tr><td>${sev(f.severity)}</td><td>${esc(f.id)}</td><td>${esc([f.lang, f.sceneId, f.beatId].filter(Boolean).join(" / "))}</td><td>${esc(f.message)}</td><td>${esc(f.cause)}</td><td>${esc(f.repair)}</td></tr>`)
    .join("\n");
  const checks = report.checks.map((c) => `<tr class="${c.status}"><td>${esc(c.id)}</td><td>${c.layer}</td><td>${esc(c.title)}</td><td>${c.status}</td><td>${esc(c.reason ?? "")}</td></tr>`).join("\n");
  const sheets = media.contactSheets
    .filter((c) => fs.existsSync(c.png))
    .map((c) => `<h3>Contact sheet (${esc(c.lang)})</h3><img class="sheet" alt="contact sheet ${esc(c.lang)}" src="${dataUri(fs.readFileSync(c.png))}">`)
    .join("\n");
  const stills = media.stills
    .filter((s) => fs.existsSync(s.png))
    .map((s) => `<figure><img alt="${esc(s.sceneId)} ${esc(s.beatId)}" src="${dataUri(thumbnail(s.png, 480))}"><figcaption><b>${esc(s.lang)} ${esc(s.sceneId)}/${esc(s.beatId)}</b> ${esc(s.narration)}</figcaption></figure>`)
    .join("\n");
  const r = report.release;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>QA ${esc(report.bookId)} ${esc(report.chapterId)} ${esc(report.partId)}</title>
<style>
body{font-family:system-ui,sans-serif;margin:24px;background:#111;color:#eee}
table{border-collapse:collapse;width:100%;margin:12px 0;font-size:14px}td,th{border:1px solid #333;padding:4px 8px;vertical-align:top;text-align:left}
.sev{font-weight:700;padding:1px 6px;border-radius:4px}.BLOCKER{background:#a11}.HIGH{background:#c60}.MEDIUM{background:#875}.LOW{background:#455}
tr.fail td{color:#f99}tr.skipped td{color:#999}
.verdict{font-size:20px;padding:12px;border-radius:8px;background:${r.releasable ? "#163" : "#611"}}
.sheet{max-width:100%;border:1px solid #333}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(480px,1fr));gap:16px}figure{margin:0}figure img{width:100%;border:1px solid #333}figcaption{font-size:13px;color:#ccc;margin-top:4px}
</style></head><body>
<h1>QA report: ${esc(report.bookId)} ${esc(report.chapterId)} ${esc(report.partId)}</h1>
<p class="verdict">${r.releasable ? "Releasable" : "Not releasable"}: ${esc(r.reason)}${r.mock ? " (mock)" : ""}${r.draft ? " (draft)" : ""}</p>
<p>Languages: ${esc(report.languages.join(", "))}. Generated ${esc(report.generatedAt)}. BLOCKER ${report.summary.BLOCKER}, HIGH ${report.summary.HIGH}, MEDIUM ${report.summary.MEDIUM}, LOW ${report.summary.LOW}.</p>
<h2>Findings</h2>
<table><tr><th>Severity</th><th>Check</th><th>Where</th><th>Finding</th><th>Cause</th><th>Repair</th></tr>
${rows || '<tr><td colspan="6">No findings.</td></tr>'}
</table>
<h2>Checks</h2>
<table><tr><th>Id</th><th>Layer</th><th>Check</th><th>Status</th><th>Note</th></tr>
${checks}
</table>
<h2>Frames</h2>
${sheets}
<div class="grid">
${stills}
</div>
</body></html>
`;
}

export function writeReport(qaDir: string, report: QaReport, media: ReportMedia): { json: string; html: string } {
  ensureDir(qaDir);
  const json = path.join(qaDir, "report.json");
  const html = path.join(qaDir, "report.html");
  writeJson(json, report);
  writeText(html, reportHtml(report, media));
  return { json, html };
}
