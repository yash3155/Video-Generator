/* Per-part pipeline state: a stage is cached when its input fingerprint is unchanged and its outputs still have the recorded hashes. */
import fs from "node:fs";
import path from "node:path";
import { exists, hashOf, readJson, sha256File, writeJson } from "../core/fsutil";
import { homeDir } from "../core/paths";
import type { Stage, PartContext, StageId } from "./types";
import { pipelineDir } from "./artifacts";

export interface StageState {
  fingerprint: string;
  outputs: Record<string, string>;
  mock: boolean;
  finishedAt: string;
}

export interface PipelineState {
  stages: Partial<Record<StageId, StageState>>;
}

export function stateFile(ctx: Pick<PartContext, "partDir">): string {
  return path.join(pipelineDir(ctx), "state.json");
}

export function loadState(ctx: Pick<PartContext, "partDir">): PipelineState {
  const f = stateFile(ctx);
  if (!exists(f)) return { stages: {} };
  try {
    return readJson<PipelineState>(f);
  } catch {
    return { stages: {} };
  }
}

export function saveState(ctx: Pick<PartContext, "partDir">, s: PipelineState): void {
  writeJson(stateFile(ctx), s);
}

/** Paths in state are relative to OPENLECTERN_HOME (or the repo for shipped files) so a workspace can move. */
export function relKey(file: string): string {
  return path.relative(homeDir(), file).split(path.sep).join("/");
}

function fileSha(file: string): string | null {
  if (!exists(file)) return null;
  const st = fs.statSync(file);
  if (st.isDirectory()) return null;
  return sha256File(file);
}

export function fingerprint(stage: Stage, ctx: PartContext): string {
  const inp = stage.inputs(ctx);
  return hashOf({ id: stage.id, version: stage.version, params: inp.params ?? null, files: inp.files.map((f) => [relKey(f), fileSha(f)]) });
}

export function hashOutputs(files: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of files) {
    const h = fileSha(f);
    if (h) out[relKey(f)] = h;
  }
  return out;
}

/** Whether a stage can be skipped: same fingerprint and every recorded output present with the same hash. */
export function isCached(stage: Stage, ctx: PartContext, state: PipelineState, fp: string): boolean {
  const s = state.stages[stage.id];
  if (!s || s.fingerprint !== fp) return false;
  const expected = stage.outputs(ctx);
  for (const f of expected) if (!(relKey(f) in s.outputs)) return false;
  for (const [rel, sha] of Object.entries(s.outputs)) {
    const abs = path.resolve(homeDir(), rel);
    if (fileSha(abs) !== sha) return false;
  }
  return true;
}
