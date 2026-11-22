import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const IS_WIN = process.platform === "win32";

export interface ProcResult {
  code: number;
  stdout: string;
  stderr: string;
}

/** Find an executable on PATH. Returns the absolute path or null. */
export function which(name: string): string | null {
  const exts = IS_WIN ? [".exe", ".cmd", ".bat", ".com"] : [""];
  const searchDirs = (process.env.PATH || "").split(path.delimiter).filter(Boolean);
  if (process.platform === "darwin") {
    // Ensure Apple Silicon Homebrew and Intel Mac paths are searched even if GUI IDE has minimal PATH
    const macDirs = ["/opt/homebrew/bin", "/usr/local/bin", "/opt/homebrew/sbin", "/usr/local/sbin", "/usr/bin", "/bin"];
    for (const d of macDirs) {
      if (!searchDirs.includes(d)) searchDirs.push(d);
    }
  }
  for (const dir of searchDirs) {
    for (const ext of exts) {
      const p = path.join(dir, name + ext.toLowerCase());
      const p2 = path.join(dir, name + ext);
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
      if (fs.existsSync(p2) && fs.statSync(p2).isFile()) return p2;
    }
  }
  return null;
}

let ffmpegCache: string | null | undefined;
let ffprobeCache: string | null | undefined;

/** ffmpeg: system binary first, then ffmpeg-static. */
export function ffmpegPath(): string | null {
  if (ffmpegCache !== undefined) return ffmpegCache;
  let p = which("ffmpeg");
  if (!p) {
    try {
      const s = require("ffmpeg-static") as string | null;
      if (s && fs.existsSync(s)) p = s;
    } catch {
      p = null;
    }
  }
  ffmpegCache = p;
  return p;
}

/** ffprobe: system binary first, then ffprobe-static. */
export function ffprobePath(): string | null {
  if (ffprobeCache !== undefined) return ffprobeCache;
  let p = which("ffprobe");
  if (!p) {
    try {
      const s = (require("ffprobe-static") as { path: string }).path;
      if (s && fs.existsSync(s)) p = s;
    } catch {
      p = null;
    }
  }
  ffprobeCache = p;
  return p;
}

export function runSync(cmd: string, args: string[], opts: { cwd?: string; timeoutMs?: number; input?: string } = {}): ProcResult {
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd,
    encoding: "utf8",
    timeout: opts.timeoutMs ?? 10 * 60 * 1000,
    input: opts.input,
    maxBuffer: 512 * 1024 * 1024,
    windowsHide: true,
  });
  return { code: r.status ?? -1, stdout: r.stdout || "", stderr: (r.stderr || "") + (r.error ? String(r.error) : "") };
}

export function runAsync(cmd: string, args: string[], opts: { cwd?: string; timeoutMs?: number } = {}): Promise<ProcResult> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: opts.cwd, windowsHide: true });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill(), opts.timeoutMs ?? 30 * 60 * 1000);
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (e) => {
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: stderr + String(e) });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? -1, stdout, stderr });
    });
  });
}

export function ffmpeg(args: string[], timeoutMs?: number): ProcResult {
  const bin = ffmpegPath();
  if (!bin) return { code: -1, stdout: "", stderr: "ffmpeg not available" };
  return runSync(bin, ["-hide_banner", "-nostdin", ...args], { timeoutMs });
}

export function ffprobeJson(file: string): any {
  const bin = ffprobePath();
  if (!bin) throw new Error("ffprobe not available");
  const r = runSync(bin, ["-v", "error", "-show_streams", "-show_format", "-of", "json", file]);
  if (r.code !== 0) throw new Error(`ffprobe failed for ${file}: ${r.stderr.slice(-300)}`);
  return JSON.parse(r.stdout);
}

export function mediaDurationSec(file: string): number {
  const j = ffprobeJson(file);
  return Number(j.format?.duration ?? 0);
}
