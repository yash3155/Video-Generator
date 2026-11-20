import { z } from "zod";
import { Severity } from "./common";

export const ContentAudit = z.object({
  status: z.enum(["PASS", "CONDITIONAL_PASS", "FAIL"]),
  factCount: z.number().int().min(0),
  categories: z.record(z.string(), z.number().int().min(0)),
  formulasCompiled: z.number().int().min(0),
  numbersRecomputed: z.number().int().min(0),
  issues: z.array(z.object({ severity: Severity, code: z.string().min(1), message: z.string().min(1), factId: z.string().optional() })),
});
export type ContentAudit = z.infer<typeof ContentAudit>;
