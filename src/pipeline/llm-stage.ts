/* LLM calls from pipeline stages: repair feedback, the part's tasks.json, recording and mock provenance. */
import path from "node:path";
import { buildTask, runTask } from "../llm";
import { exists, readJson, writeJson } from "../core/fsutil";
import { repairFile, standardsText } from "./artifacts";
import type { PartContext, StageId } from "./types";

export function tasksFile(ctx: Pick<PartContext, "partDir">): string {
  return path.join(ctx.partDir, "tasks.json");
}

function recordTask(ctx: PartContext, rec: { id: string; kind: string; hash: string }, scope: string): void {
  const f = tasksFile(ctx);
  const data = exists(f) ? readJson<{ tasks: { kind: string; scope: string; id: string; hash: string }[] }>(f) : { tasks: [] };
  data.tasks = data.tasks.filter((t) => !(t.kind === rec.kind && t.scope === scope));
  data.tasks.push({ kind: rec.kind, scope, id: rec.id, hash: rec.hash });
  writeJson(f, data);
}

export interface LlmCallArgs {
  stage: StageId;
  kind: string;
  input: Record<string, unknown>;
  vars?: Record<string, string | number>;
  standards?: string[];
  /** Task scope (defaults to the part); S2 uses "book". */
  chapterId?: string;
  partId?: string;
  /** Distinguishes several tasks of one kind in a part (review per language). */
  scope?: string;
}

/** Runs one typed task for a stage; a repair feedback file for the stage is added to the input. */
export async function llmCall<T>(ctx: PartContext, a: LlmCallArgs): Promise<T> {
  const rf = repairFile(ctx, a.stage);
  const input = exists(rf) ? { ...a.input, repairFeedback: readJson(rf) } : a.input;
  const vars = { ...(a.vars ?? {}) };
  if (a.standards) vars.standards = standardsText(a.standards);
  const task = buildTask<T>({ kind: a.kind, bookId: ctx.bookId, chapterId: a.chapterId ?? ctx.chapterId, partId: a.partId ?? ctx.partId, input, vars });
  const r = await runTask(task, {
    provider: ctx.llm,
    recordDir: ctx.opts.record ? ctx.recordDir : undefined,
    onTask: (rec) => recordTask(ctx, rec, a.scope ?? a.kind),
  });
  if (r.mock) ctx.mockStages.add(a.stage);
  return r.output;
}
