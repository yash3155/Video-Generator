import path from "node:path";
import { fileURLToPath } from "node:url";

/** Repository root (where package.json lives). */
export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Base folder for workspace/ and out/. `OPENLECTERN_HOME` overrides it; empty means the current directory. */
export function homeDir(): string {
  const env = process.env.OPENLECTERN_HOME;
  return env && env.trim() ? path.resolve(env.trim()) : process.cwd();
}

export function workspaceDir(): string {
  return path.join(homeDir(), "workspace");
}

export function outRoot(): string {
  return path.join(homeDir(), "out");
}

export function bookDir(bookId: string): string {
  return path.join(workspaceDir(), "books", bookId);
}

export function partDir(bookId: string, chapterId: string, partId: string): string {
  return path.join(bookDir(bookId), "chapters", chapterId, partId);
}

export function researchDir(bookId: string, chapterId: string, partId: string): string {
  return path.join(partDir(bookId, chapterId, partId), "research");
}

export function tasksDir(): string {
  return path.join(workspaceDir(), ".tasks");
}

export function cacheDir(): string {
  return path.join(workspaceDir(), ".cache");
}

export function ledgerFile(): string {
  return path.join(workspaceDir(), "ledger.jsonl");
}

export function outBookDir(bookId: string, draft: boolean): string {
  return draft ? path.join(outRoot(), bookId, "drafts") : path.join(outRoot(), bookId);
}

export function examplesDir(): string {
  return path.join(REPO_ROOT, "examples");
}

export function promptsDir(): string {
  return path.join(REPO_ROOT, "prompts");
}
