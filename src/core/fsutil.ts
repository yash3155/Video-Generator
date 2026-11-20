import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/** Read a UTF-8 text file with normalized LF line endings (stable hashes across OS checkouts). */
export function readText(file: string): string {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

export function readJson<T = unknown>(file: string): T {
  return JSON.parse(readText(file)) as T;
}

export function exists(file: string): boolean {
  return fs.existsSync(file);
}

export function ensureDir(dir: string): string {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeText(file: string, text: string): void {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, text, "utf8");
}

/** Deterministic JSON: object keys keep insertion order, 2-space indent, trailing newline. */
export function writeJson(file: string, data: unknown): void {
  writeText(file, JSON.stringify(data, null, 2) + "\n");
}

export function sha256(data: string | Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function sha256File(file: string): string {
  return sha256(fs.readFileSync(file));
}

/** Stable stringify with sorted keys, used for hashing inputs. */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) out[k] = sortKeys((v as Record<string, unknown>)[k]);
    return out;
  }
  return v;
}

export function hashOf(value: unknown): string {
  return sha256(stableStringify(value));
}

export function copyDir(src: string, dest: string): void {
  ensureDir(dest);
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

export function listFilesRecursive(dir: string, filter: (p: string) => boolean = () => true): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (filter(p)) out.push(p);
    }
  };
  walk(dir);
  return out.sort();
}

export function rmrf(p: string): void {
  fs.rmSync(p, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
