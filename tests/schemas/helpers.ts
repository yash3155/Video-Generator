import { expect } from "vitest";
import type { z } from "zod";

export function expectValid(schema: z.ZodType, value: unknown): void {
  const r = schema.safeParse(value);
  if (!r.success) throw new Error("expected valid, got: " + JSON.stringify(r.error.issues, null, 2));
  expect(r.success).toBe(true);
}

/** Asserts the value fails and that at least one issue path starts with `pathPrefix` (when given). */
export function expectInvalid(schema: z.ZodType, value: unknown, pathPrefix?: (string | number)[]): void {
  const r = schema.safeParse(value);
  expect(r.success).toBe(false);
  if (!r.success && pathPrefix) {
    const hit = r.error.issues.some((i) => pathPrefix.every((p, k) => i.path[k] === p));
    if (!hit) throw new Error(`no issue at ${pathPrefix.join(".")}: ` + JSON.stringify(r.error.issues.map((i) => i.path)));
  }
}
