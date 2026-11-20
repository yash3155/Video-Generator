import { z } from "zod";

/** Header block stored at the top of research/notebook_context.md as an HTML comment with JSON. */
export const ResearchHeader = z.object({
  bookId: z.string().min(1),
  chapterId: z.string().min(1),
  partId: z.string().min(1),
  connector: z.enum(["notebooklm-mcp", "nlm-cli", "manual", "local-file", "demo"]),
  notebookId: z.string().optional(),
  sourceIds: z.array(z.string()).default([]),
  query: z.string().min(1),
  timestamp: z.string().min(1),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
});
export type ResearchHeader = z.infer<typeof ResearchHeader>;

export const RESEARCH_HEADER_RE = /<!--\s*OPENLECTERN-RESEARCH\s+(\{[\s\S]*?\})\s*-->/;
export const RESEARCH_TEMPLATE_MARKER = "OPENLECTERN-TEMPLATE-NOT-FILLED";

/** The parsed research context artifact (header + Markdown body). */
export const ResearchContext = z.object({
  header: ResearchHeader,
  body: z.string().min(1),
});
export type ResearchContext = z.infer<typeof ResearchContext>;

export const REQUIRED_RESEARCH_SECTIONS = ["Chapter scope", "Fact ledger", "Real-world problem", "Terms", "Dependencies"];
