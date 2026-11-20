import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { check, exists, readText, run, cli, tail, trackedFiles, rel, listFiles } from "../lib.mjs";

export const QUICKSTART = "npm start -- --non-interactive --book demo --chapter ch01 --part p1 --lang en --llm replay --tts mock --draft";

const TEXT_EXT = /\.(m?[jt]sx?|cjs|json|md|ya?ml|txt|html|css|ps1|sh|env|example|editorconfig|nvmrc|gitignore|gitattributes|npmrc)$/i;
const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{24,}/,
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /AIza[0-9A-Za-z_-]{35}/,
  /sk-ant-[A-Za-z0-9_-]{20,}/,
];
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

export function scanTracked() {
  const user = (() => {
    try {
      return os.userInfo().username;
    } catch {
      return "";
    }
  })();
  const findings = [];
  const personal = [/[A-Za-z]:\\Users\\(?!<|\.\.\.|Public\\|Default\\)[A-Za-z0-9._-]+/i, /\/Users\/(?!<|\.\.\.|Shared\/)[a-z0-9._-]+\//, /\/home\/(?!<|\.\.\.|runner\/|user\/|node\/)[a-z0-9._-]+\//];
  for (const f of trackedFiles()) {
    const base = path.basename(f);
    if (!TEXT_EXT.test(base) && !["LICENSE", "NOTICE", ".gitignore", ".gitattributes", ".npmrc", ".editorconfig", ".nvmrc"].includes(base)) continue;
    if (f === "package-lock.json") continue;
    let t;
    try {
      t = fs.readFileSync(rel(f), "utf8");
    } catch {
      continue;
    }
    for (const re of SECRET_PATTERNS) if (re.test(t)) findings.push(`${f}:secret:${re.source.slice(0, 12)}`);
    const isPrompt = f === "docs/BOOTSTRAP_PROMPT.md";
    if (!isPrompt) for (const re of personal) if (re.test(t)) findings.push(`${f}:personal-path:${(t.match(re) || [""])[0]}`);
    if (user && user.length >= 3 && new RegExp(`\\b${user.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(t)) findings.push(`${f}:username`);
    if (EMOJI.test(t)) findings.push(`${f}:emoji`);
    if (/\.(ya?ml)$/i.test(f) && !(t.endsWith("\n") && !t.endsWith("\n\n"))) findings.push(`${f}:yaml-trailing-newline`);
  }
  return findings;
}

export const checks = [
  check("clean-clone", "node scripts/verify/clean-clone.mjs exits 0", () => {
    const r = run("node", [rel("scripts", "verify", "clean-clone.mjs")], { timeout: 90 * 60 * 1000 });
    return { ok: r.code === 0, detail: r.code === 0 ? tail(r.stdout, 1) : tail(r.out, 10) };
  }),
  check("scan", "secret / personal-path / emoji / YAML scan of tracked files is clean", () => {
    const f = scanTracked();
    return { ok: f.length === 0, detail: f.length ? f.slice(0, 10).join(" ") : "clean" };
  }),
  check("audit", "npm audit --audit-level=high is clean", () => {
    const r = run("npm", ["audit", "--audit-level=high"], { timeout: 5 * 60 * 1000 });
    return { ok: r.code === 0, detail: r.code === 0 ? "clean" : tail(r.out, 8) };
  }),
  check("readme-commands", "README quick start present and every README CLI command exists in the CLI help", () => {
    if (!exists("README.md")) return { ok: false, detail: "README missing" };
    const readme = readText("README.md");
    if (!readme.includes(QUICKSTART)) return { ok: false, detail: "README lacks the quick-start command: " + QUICKSTART };
    const help = cli(["--help"]).out;
    const cmds = new Set();
    for (const m of readme.matchAll(/openlectern\s+([a-z][a-z0-9:-]*)/g)) cmds.add(m[1]);
    const missing = [...cmds].filter((c) => !new RegExp(`(^|\\s)${c.replace(/[:-]/g, (x) => "\\" + x)}(\\s|\\[|$)`, "m").test(help));
    return { ok: cmds.size >= 5 && missing.length === 0, detail: missing.length ? "not in help: " + missing.join(",") : `${cmds.size} commands documented` };
  }),
  check("docs", "Part G docs and repository files exist", () => {
    const need = [
      "docs/ARCHITECTURE.md",
      "docs/DECISIONS.md",
      "docs/BUILD_LOG.md",
      "docs/ADDING_A_BOOK.md",
      "docs/PROVIDERS.md",
      "docs/QA.md",
      "docs/TROUBLESHOOTING.md",
      "AGENTS.md",
      "CLAUDE.md",
      ".github/copilot-instructions.md",
      ".github/pull_request_template.md",
      ".github/dependabot.yml",
      ".editorconfig",
      ".nvmrc",
      "public/fonts",
      "prompts/research/chapter_extraction.md",
    ];
    const miss = need.filter((f) => !exists(f));
    const issueTemplates = listFiles(".github/ISSUE_TEMPLATE");
    if (issueTemplates.length === 0) miss.push(".github/ISSUE_TEMPLATE/*");
    const fontLicenses = listFiles("public/fonts", (p) => /OFL|LICENSE/i.test(path.basename(p)));
    if (fontLicenses.length === 0) miss.push("public/fonts OFL licenses");
    return { ok: miss.length === 0, detail: miss.length ? "missing " + miss.join(",") : "all present" };
  }),
  check("media", "README screenshots under docs/media (< 1 MB each, no MP4)", () => {
    const media = listFiles("docs/media");
    const imgs = media.filter((p) => /\.(png|gif|jpg)$/i.test(p));
    const big = media.filter((p) => fs.statSync(p).size >= 1024 * 1024 || /\.mp4$/i.test(p));
    const readme = exists("README.md") ? readText("README.md") : "";
    const referenced = imgs.filter((p) => readme.includes("docs/media/" + path.basename(p)));
    return { ok: imgs.length >= 1 && big.length === 0 && referenced.length >= 1, detail: `${imgs.length} images, ${referenced.length} referenced, ${big.length} too big` };
  }),
  check("changelog", "CHANGELOG.md has v0.1.0", () => ({ ok: exists("CHANGELOG.md") && /0\.1\.0/.test(readText("CHANGELOG.md")), detail: "checked" })),
  check("ci-replay", "CI runs --llm replay --tts mock --draft", () => {
    if (!exists(".github/workflows/ci.yml")) return { ok: false, detail: "missing ci.yml" };
    const t = readText(".github/workflows/ci.yml");
    const ok = /--llm replay/.test(t) && /--tts mock/.test(t) && /--draft/.test(t) && /ubuntu/.test(t) && /windows/.test(t) && /macos/.test(t);
    return { ok, detail: ok ? "replay on 3 OS" : "ci.yml lacks replay mode or OS matrix" };
  }),
];
