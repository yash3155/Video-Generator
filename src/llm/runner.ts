import fs from "node:fs";
import path from "node:path";
import { exists, hashOf, readJson, writeJson, ensureDir, writeText } from "../core/fsutil";
import { cacheDir, ledgerFile } from "../core/paths";
import { log } from "../core/log";
import { validateOutput, taskDir } from "./task";
import { AwaitingAgentError, LlmTaskError, type LlmProvider, type LlmTask } from "./types";

export interface TaskRecord {
  id: string;
  kind: string;
  hash: string;
}

export interface RunTaskOptions {
  provider: LlmProvider;
  /** When set, successful non-mock outputs are written to <recordDir>/<hash>.json for replay. */
  recordDir?: string;
  /** Called once per completed task (used to maintain the part's tasks.json). */
  onTask?: (rec: TaskRecord) => void;
  maxRepairs?: number;
}

export interface TaskOutcome<T> {
  output: T;
  mock: boolean;
  cacheHit: boolean;
}

interface CacheEntry {
  taskHash: string;
  kind: string;
  provider: string;
  model: string;
  mock: boolean;
  output: unknown;
}

function cacheFile(task: LlmTask, provider: LlmProvider): string {
  return path.join(cacheDir(), "llm", `${hashOf({ task: task.hash, provider: provider.id, model: provider.model })}.json`);
}

function ledger(entry: Record<string, unknown>): void {
  ensureDir(path.dirname(ledgerFile()));
  fs.appendFileSync(ledgerFile(), JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n");
}

/**
 * Run one typed LLM task: cache lookup, provider call, LaTeX-safe parse, Zod validation, content gates,
 * up to `maxRepairs` schema-repair retries (network providers), ledger entry, optional recording.
 */
export async function runTask<T>(task: LlmTask<T>, opts: RunTaskOptions): Promise<TaskOutcome<T>> {
  const { provider } = opts;
  const maxRepairs = opts.maxRepairs ?? 2;
  const done = (output: T, mock: boolean, cacheHit: boolean): TaskOutcome<T> => {
    opts.onTask?.({ id: task.id, kind: task.kind, hash: task.hash });
    if (opts.recordDir && !mock) {
      const rec = path.join(opts.recordDir, `${task.hash}.json`);
      if (!exists(rec)) writeJson(rec, { kind: task.kind, templateVersion: task.templateVersion, output });
    }
    return { output, mock, cacheHit };
  };

  const cf = cacheFile(task, provider);
  if (provider.cacheable && exists(cf)) {
    const entry = readJson<CacheEntry>(cf);
    const v = validateOutput(task.kind, undefined, entry.output, task.input);
    if (v.ok) {
      ledger({ task: task.id, kind: task.kind, provider: provider.id, model: provider.model, cacheHit: true });
      return done(v.value as T, entry.mock, true);
    }
  }

  let feedback: string[] | undefined;
  for (let attempt = 0; attempt <= maxRepairs; attempt++) {
    const res = await provider.complete(task, feedback);
    const v = validateOutput(task.kind, res.text, res.value, task.input);
    ledger({
      task: task.id,
      kind: task.kind,
      provider: res.provider,
      model: res.model,
      tokensIn: res.tokensIn ?? null,
      tokensOut: res.tokensOut ?? null,
      costUsd: res.costUsd ?? null,
      durationMs: res.durationMs,
      cacheHit: false,
      valid: v.ok,
    });
    if (v.ok) {
      if (provider.cacheable) {
        const entry: CacheEntry = { taskHash: task.hash, kind: task.kind, provider: provider.id, model: provider.model, mock: Boolean(res.mock), output: v.value };
        writeJson(cf, entry);
      }
      return done(v.value as T, Boolean(res.mock), false);
    }
    if (provider.interactive) {
      const dir = taskDir(task.id);
      const out = path.join(dir, "output.json");
      if (exists(out)) fs.renameSync(out, path.join(dir, "output.rejected.json"));
      writeText(
        path.join(dir, "feedback.md"),
        ["# Your previous answer was rejected", "", "Fix these problems and write a new output.json (the rejected answer is in output.rejected.json):", "", ...v.problems.map((p) => `- ${p}`), ""].join("\n"),
      );
      log.warn(`task ${task.id} answer rejected (${v.problems.length} problems); see ${path.join(dir, "feedback.md")}`);
      throw new AwaitingAgentError([{ id: task.id, kind: task.kind, dir }]);
    }
    feedback = v.problems;
    log.warn(`task ${task.id} attempt ${attempt + 1} invalid: ${v.problems.slice(0, 3).join("; ")}`);
  }
  throw new LlmTaskError(`task ${task.id} (${task.kind}) failed validation after ${maxRepairs} repairs`, feedback ?? []);
}

/** Prompt suffix that network providers append on a repair retry. */
export function feedbackBlock(feedback?: string[]): string {
  if (!feedback || feedback.length === 0) return "";
  return ["", "## Your previous answer was invalid", "", "Fix every problem below and reply with the full corrected JSON object:", "", ...feedback.map((p) => `- ${p}`), ""].join("\n");
}
