import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ffmpegPath, ffprobePath, which, runSync } from "../core/proc";
import { REPO_ROOT, homeDir } from "../core/paths";

export interface DoctorCheck {
  id: string;
  title: string;
  status: "ok" | "warn" | "missing" | "fail";
  required: boolean;
  detail: string;
  fix?: string;
}

const osName = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "macos" : "linux";

function fixFor(tool: string): string {
  const table: Record<string, Record<string, string>> = {
    ffmpeg: { windows: "winget install Gyan.FFmpeg", macos: "brew install ffmpeg", linux: "sudo apt-get install ffmpeg" },
    tesseract: { windows: "winget install UB-Mannheim.TesseractOCR", macos: "brew install tesseract", linux: "sudo apt-get install tesseract-ocr" },
    whisper: { windows: "download whisper.cpp from https://github.com/ggerganov/whisper.cpp/releases and add it to PATH", macos: "brew install whisper-cpp", linux: "build whisper.cpp from source and add it to PATH" },
    piper: { windows: "download piper from https://github.com/rhasspy/piper/releases and add it to PATH", macos: "pip install piper-tts", linux: "pip install piper-tts" },
    nlm: { windows: "install a NotebookLM CLI (for example `pipx install notebooklm-cli`) and run `nlm login`", macos: "pipx install notebooklm-cli; nlm login", linux: "pipx install notebooklm-cli; nlm login" },
    chromium: { windows: "npx remotion browser ensure", macos: "npx remotion browser ensure", linux: "npx remotion browser ensure" },
  };
  return table[tool]?.[osName] ?? "";
}

/** Locate Remotion's downloaded headless Chrome (chrome-headless-shell) without downloading it. */
export function findRemotionBrowser(): string | null {
  const candidates = [path.join(REPO_ROOT, "node_modules", ".remotion"), path.join(process.cwd(), "node_modules", ".remotion")];
  for (const c of candidates) {
    if (!fs.existsSync(c)) continue;
    const stack = [c];
    while (stack.length) {
      const d = stack.pop() as string;
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) stack.push(p);
        else if (/^chrome-headless-shell(\.exe)?$/i.test(e.name)) return p;
      }
    }
  }
  return null;
}

export async function runDoctor(opts: { fix?: boolean } = {}): Promise<DoctorCheck[]> {
  const checks: DoctorCheck[] = [];
  const major = Number(process.versions.node.split(".")[0]);
  checks.push({ id: "node", title: "Node.js >= 20", status: major >= 20 ? "ok" : "fail", required: true, detail: process.versions.node, fix: "install Node.js 20 LTS or newer from https://nodejs.org" });

  const ff = ffmpegPath();
  checks.push({ id: "ffmpeg", title: "ffmpeg", status: ff ? "ok" : "fail", required: true, detail: ff ? ff : "not found (system or ffmpeg-static)", fix: fixFor("ffmpeg") });
  const fp = ffprobePath();
  checks.push({ id: "ffprobe", title: "ffprobe", status: fp ? "ok" : "fail", required: true, detail: fp ? fp : "not found (system or ffprobe-static)", fix: fixFor("ffmpeg") });

  let browser = findRemotionBrowser();
  if (!browser && opts.fix) {
    try {
      const { ensureBrowser } = await import("@remotion/renderer");
      await ensureBrowser();
      browser = findRemotionBrowser();
    } catch (e) {
      browser = null;
      checks.push({ id: "chromium-download", title: "Remotion browser download", status: "warn", required: false, detail: String(e).slice(0, 200) });
    }
  }
  checks.push({
    id: "chromium",
    title: "Chromium for Remotion (chrome-headless-shell)",
    status: browser ? "ok" : "warn",
    required: false,
    detail: browser ? browser : "not downloaded yet; it is downloaded automatically before the first render",
    fix: fixFor("chromium"),
  });

  let freeGb: number;
  try {
    const st = fs.statfsSync(homeDir());
    freeGb = (st.bavail * st.bsize) / 1024 ** 3;
  } catch {
    freeGb = -1;
  }
  checks.push({ id: "disk", title: "Free disk space >= 5 GB", status: freeGb < 0 ? "warn" : freeGb >= 5 ? "ok" : "warn", required: false, detail: freeGb < 0 ? "unknown" : `${freeGb.toFixed(1)} GB free` });

  const nlm = which("nlm");
  let nlmDetail = "not on PATH; the manual NotebookLM flow is used instead";
  if (nlm) {
    const r = runSync(nlm, ["--help"], { timeoutMs: 15000 });
    nlmDetail = `${nlm} (${r.code === 0 ? "responds to --help" : "--help failed"})`;
  }
  checks.push({ id: "nlm", title: "NotebookLM CLI (optional)", status: nlm ? "ok" : "missing", required: false, detail: nlmDetail, fix: fixFor("nlm") });
  checks.push({
    id: "notebooklm-mcp",
    title: "NotebookLM MCP server (optional, host agent)",
    status: process.env.OPENLECTERN_NOTEBOOKLM_MCP ? "ok" : "missing",
    required: false,
    detail: process.env.OPENLECTERN_NOTEBOOKLM_MCP ? "declared by OPENLECTERN_NOTEBOOKLM_MCP" : "set OPENLECTERN_NOTEBOOKLM_MCP=1 when your agent exposes NotebookLM MCP tools",
  });
  const piper = which("piper");
  checks.push({ id: "piper", title: "Piper TTS (optional, offline)", status: piper ? "ok" : "missing", required: false, detail: piper || "not found; Edge TTS is the default", fix: fixFor("piper") });
  const whisper = which("whisper-cli") || which("whisper");
  checks.push({ id: "whisper", title: "whisper.cpp (optional, ASR QA A-07)", status: whisper ? "ok" : "missing", required: false, detail: whisper || "not found; A-07 is skipped", fix: fixFor("whisper") });
  const tess = which("tesseract");
  checks.push({ id: "tesseract", title: "Tesseract (optional, OCR QA R-05)", status: tess ? "ok" : "missing", required: false, detail: tess || "not found; R-05 OCR is skipped", fix: fixFor("tesseract") });
  checks.push({ id: "cpus", title: "CPU cores", status: "ok", required: false, detail: `${os.cpus().length} cores; render concurrency ${Math.max(1, Math.floor(os.cpus().length / 2))}` });
  return checks;
}

export function printDoctor(checks: DoctorCheck[]): void {
  for (const c of checks) {
    const tag = c.status === "ok" ? "[OK]" : c.required ? "[FAIL]" : "[WARN]";
    process.stdout.write(`${tag} ${c.title}: ${c.detail}${c.status !== "ok" && c.fix ? `\n       fix: ${c.fix}` : ""}\n`);
  }
  const blocking = checks.filter((c) => c.required && c.status !== "ok");
  process.stdout.write(blocking.length ? `[FAIL] ${blocking.length} required tool(s) missing\n` : "[OK] the default path is ready (optional tools only add features)\n");
}
