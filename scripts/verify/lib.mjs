// Shared helpers for the OpenLectern build verifiers (Part L of docs/BOOTSTRAP_PROMPT.md).
// Plain Node, no dependencies required for Phase 0. Cross-platform: Windows, macOS, Linux.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const BUILD_DIR = path.join(ROOT, ".build");
export const VERIFY_DIR = path.join(BUILD_DIR, "verify");
export const IS_WIN = process.platform === "win32";

export function rel(...p) {
  return path.join(ROOT, ...p);
}

export function exists(p) {
  return fs.existsSync(path.isAbsolute(p) ? p : rel(p));
}

export function readText(p) {
  return fs.readFileSync(path.isAbsolute(p) ? p : rel(p), "utf8");
}

export function readJson(p) {
  return JSON.parse(readText(p));
}

export function writeJson(p, data) {
  const abs = path.isAbsolute(p) ? p : rel(p);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function tail(text, n = 40) {
  const lines = String(text || "").split(/\r?\n/);
  return lines.slice(-n).join("\n");
}

/**
 * Run a command. `cmd` is either "node" (uses the current Node binary) or a tool name.
 * npm/npx/git are resolved through the shell on Windows because .cmd shims need it.
 */
export function run(cmd, args = [], opts = {}) {
  const timeout = opts.timeout ?? 30 * 60 * 1000;
  const env = { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1", ...(opts.env || {}) };
  let res;
  if (cmd === "node") {
    res = spawnSync(process.execPath, args, { cwd: opts.cwd || ROOT, env, encoding: "utf8", timeout, maxBuffer: 256 * 1024 * 1024 });
  } else if (IS_WIN && (cmd === "npm" || cmd === "npx")) {
    const line = [cmd, ...args.map(quoteWin)].join(" ");
    res = spawnSync(line, { cwd: opts.cwd || ROOT, env, encoding: "utf8", timeout, shell: true, maxBuffer: 256 * 1024 * 1024 });
  } else {
    res = spawnSync(cmd, args, { cwd: opts.cwd || ROOT, env, encoding: "utf8", timeout, maxBuffer: 256 * 1024 * 1024 });
  }
  const out = (res.stdout || "") + (res.stderr ? "\n" + res.stderr : "");
  return { code: res.status === null ? -1 : res.status, stdout: res.stdout || "", stderr: res.stderr || "", out, error: res.error };
}

function quoteWin(a) {
  if (a === "") return '""';
  if (/[\s"&|<>^]/.test(a)) return '"' + a.replace(/"/g, '\\"') + '"';
  return a;
}

/** Run the project CLI through its bin entry (equivalent to `npx openlectern ...`). */
export function cli(args, opts = {}) {
  return run("node", [rel("bin", "openlectern.mjs"), ...args], opts);
}

export function gitHead() {
  const r = run("git", ["rev-parse", "HEAD"]);
  return r.code === 0 ? r.stdout.trim() : null;
}

export function gitDirty() {
  const r = run("git", ["status", "--porcelain"]);
  if (r.code !== 0) return true;
  return r.stdout.trim().length > 0;
}

export function gitBranch() {
  const r = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (r.code === 0) return r.stdout.trim();
  const s = run("git", ["symbolic-ref", "--short", "HEAD"]);
  return s.code === 0 ? s.stdout.trim() : null;
}

export function trackedFiles() {
  const r = run("git", ["ls-files", "-z"]);
  if (r.code !== 0) return [];
  return r.stdout.split("\0").filter(Boolean);
}

/** Recursively list files under a directory (relative to ROOT). */
export function listFiles(dir, filter = () => true) {
  const abs = path.isAbsolute(dir) ? dir : rel(dir);
  const outList = [];
  if (!fs.existsSync(abs)) return outList;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (filter(p)) outList.push(p);
    }
  };
  walk(abs);
  return outList;
}

export function tmpDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function rmrf(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    /* ignore */
  }
}

/** Parse the first JSON object found in a string (tolerates log lines before it). */
export function parseJsonLoose(text) {
  const s = String(text || "").trim();
  try {
    return JSON.parse(s);
  } catch {
    const i = s.indexOf("{");
    const j = s.lastIndexOf("}");
    if (i >= 0 && j > i) return JSON.parse(s.slice(i, j + 1));
    throw new Error("no JSON found");
  }
}

/** Resolve ffprobe: system binary first, then ffprobe-static. */
export async function ffprobePath() {
  const sys = run(IS_WIN ? "where" : "which", ["ffprobe"]);
  if (sys.code === 0 && sys.stdout.trim()) return sys.stdout.trim().split(/\r?\n/)[0];
  try {
    const mod = await import("ffprobe-static");
    const p = (mod.default || mod).path;
    if (p && fs.existsSync(p)) return p;
  } catch {
    /* not installed */
  }
  return null;
}

/** Decode a PNG and report whether it has more than one colour (uses pngjs once installed). */
export async function pngStats(file) {
  const { PNG } = await import("pngjs");
  const png = PNG.sync.read(fs.readFileSync(file));
  const seen = new Set();
  const { data, width, height } = png;
  const step = Math.max(1, Math.floor((width * height) / 20000));
  for (let i = 0; i < width * height; i += step) {
    const o = i * 4;
    seen.add((data[o] << 16) | (data[o + 1] << 8) | data[o + 2]);
    if (seen.size > 8) break;
  }
  return { width, height, colours: seen.size };
}

export function check(id, title, fn, { optional = false } = {}) {
  return { id, title, fn, optional };
}

/** Execute a list of checks for a phase and persist the result. */
export async function runChecks(phase, checks, { quiet = false } = {}) {
  const results = [];
  for (const c of checks) {
    let r;
    const t0 = Date.now();
    try {
      r = await c.fn();
      if (typeof r === "boolean") r = { ok: r };
      if (!r || typeof r !== "object") r = { ok: false, detail: "check returned nothing" };
    } catch (e) {
      r = { ok: false, detail: "exception: " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join(" | ") : String(e)) };
    }
    const skipped = Boolean(r.skip) && c.optional;
    const ok = skipped ? true : Boolean(r.ok);
    const detail = String(r.detail || (ok ? "ok" : "failed")).replace(/\s+/g, " ").slice(0, 400);
    const tag = skipped ? "[SKIP]" : ok ? "[OK]" : c.optional ? "[WARN]" : "[FAIL]";
    if (!quiet) console.log(`${tag} ${phase}.${c.id} ${c.title} - ${detail} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    results.push({ id: c.id, title: c.title, ok: ok || c.optional, rawOk: ok, optional: c.optional, skipped, detail });
  }
  const ok = results.every((r) => r.ok);
  const record = { phase, ok, checks: results, head: gitHead(), dirty: gitDirty(), ts: new Date().toISOString() };
  writeJson(path.join(VERIFY_DIR, `phase-${phase}.json`), record);
  return record;
}

export async function loadPhaseChecks(phase) {
  const file = path.join(ROOT, "scripts", "verify", "checks", phase === "done" ? "done.mjs" : `phase${phase}.mjs`);
  const mod = await import(pathToFileURL(file).href);
  return mod.checks;
}

export const PHASES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
