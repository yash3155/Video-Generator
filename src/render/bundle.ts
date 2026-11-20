/* Bundles the Remotion entry once and reuses the bundle while the sources (and public dir) are unchanged. */
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { REPO_ROOT } from "../core/paths";
import { ensureDir, listFilesRecursive, rmrf, sha256 } from "../core/fsutil";
import { log } from "../core/log";

export const REMOTION_ENTRY = path.join(REPO_ROOT, "src", "remotion", "index.ts");

function sourceHash(publicDir?: string): string {
  const files = listFilesRecursive(path.join(REPO_ROOT, "src"), (p) => /\.(ts|tsx|css)$/.test(p)).sort();
  const parts: string[] = [fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")];
  for (const f of files) parts.push(path.relative(REPO_ROOT, f), fs.readFileSync(f, "utf8"));
  if (publicDir) {
    parts.push(path.resolve(publicDir));
    for (const f of listFilesRecursive(publicDir).sort()) {
      const st = fs.statSync(f);
      parts.push(path.relative(publicDir, f), String(st.size), String(st.mtimeMs));
    }
  }
  return sha256(parts.join("\u0000")).slice(0, 16);
}

/** Hash of the sources the Lesson composition is built from (S11 re-renders when templates change). */
export function rendererHash(): string {
  const dirs = ["remotion", "theme", "math", "schemas"].map((d) => path.join(REPO_ROOT, "src", d));
  const files = dirs.flatMap((d) => listFilesRecursive(d, (p) => /\.(ts|tsx|css)$/.test(p))).sort();
  return sha256(files.map((f) => path.relative(REPO_ROOT, f) + "\u0000" + fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n")).join("\u0000")).slice(0, 16);
}

export function bundleCacheRoot(): string {
  return path.join(REPO_ROOT, "node_modules", ".cache", "openlectern");
}

/** Returns a serve URL (a bundle folder). `publicDir` is the folder that `staticFile()` reads from (the part folder for lessons). */
export async function getBundle(opts: { publicDir?: string } = {}): Promise<string> {
  const key = sourceHash(opts.publicDir);
  const outDir = path.join(bundleCacheRoot(), `bundle-${opts.publicDir ? "pub-" : ""}${key}`);
  if (fs.existsSync(path.join(outDir, "index.html"))) return outDir;
  ensureDir(bundleCacheRoot());
  rmrf(outDir);
  log.info(`bundling Remotion project (${key})`);
  const t0 = Date.now();
  const serveUrl = await bundle({
    entryPoint: REMOTION_ENTRY,
    outDir,
    publicDir: opts.publicDir ?? null,
    enableCaching: true,
    onProgress: () => undefined,
  });
  log.info(`bundle ready in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  return serveUrl;
}
