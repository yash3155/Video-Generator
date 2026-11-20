import type { QaFinding } from "../schemas/qa";
import type { Severity } from "../schemas/common";

export type { QaFinding };

export interface FindingContext {
  lang?: string;
  sceneId?: string;
  beatId?: string;
}

const LAYER_BY_PREFIX: Record<string, QaFinding["layer"]> = { S: "L1", P: "L2", C: "L3", A: "L4", R: "L5", L6: "L6", Q: "Q" };

export function layerOf(id: string): QaFinding["layer"] {
  if (id.startsWith("L6")) return "L6";
  return LAYER_BY_PREFIX[id.split("-")[0]] ?? "L1";
}

export function finding(id: string, severity: Severity, message: string, cause: string, repair: string, ctx: FindingContext = {}): QaFinding {
  const f: QaFinding = { id, severity, layer: layerOf(id), message, cause, repair };
  if (ctx.lang) f.lang = ctx.lang;
  if (ctx.sceneId) f.sceneId = ctx.sceneId;
  if (ctx.beatId) f.beatId = ctx.beatId;
  return f;
}
