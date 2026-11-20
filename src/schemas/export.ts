import path from "node:path";
import { z } from "zod";
import { ARTIFACT_SCHEMAS } from "./index";
import { writeJson } from "../core/fsutil";

/** JSON Schema for one Zod schema (input side, so defaulted fields are optional for LLM output). */
export function toJsonSchema(schema: z.ZodType): Record<string, unknown> {
  return z.toJSONSchema(schema, { io: "input", unrepresentable: "any" }) as Record<string, unknown>;
}

export function exportSchemas(outDir: string): number {
  let n = 0;
  for (const [name, { schema }] of Object.entries(ARTIFACT_SCHEMAS)) {
    writeJson(path.join(outDir, `${name}.schema.json`), toJsonSchema(schema));
    n++;
  }
  return n;
}
