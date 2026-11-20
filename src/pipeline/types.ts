import type { HandoffMode } from "../llm/providers/handoff";
import type { LlmProvider } from "../llm/types";
import type { BookConfig } from "../schemas/book";

export const STAGE_IDS = ["S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13", "S14"] as const;
export type StageId = (typeof STAGE_IDS)[number];

export interface MakeOptions {
  bookId: string;
  chapterId: string;
  partId: string;
  /** Narration languages; defaults to the book's narrationLanguages. */
  langs?: string[];
  llm?: string;
  model?: string;
  tts?: string;
  handoff?: HandoffMode;
  draft?: boolean;
  /** Scene indexes to synthesize and render (draft subsets, repair loops). */
  scenes?: number[];
  /** Stop after this stage. */
  until?: StageId;
  /** Re-run these stages even if cached (true = all). */
  force?: StageId[] | true;
  resume?: boolean;
  /** Write non-mock LLM outputs to examples/<book>/recorded for replay. */
  record?: boolean;
  nonInteractive?: boolean;
  /** Skip the L6 expert review even when an LLM is available. */
  noReview?: boolean;
}

export interface PartContext {
  opts: MakeOptions;
  bookId: string;
  chapterId: string;
  partId: string;
  bookDir: string;
  partDir: string;
  /** Loaded after S0. */
  cfg: BookConfig;
  langs: string[];
  llm: LlmProvider;
  llmMock: boolean;
  ttsId: string;
  draft: boolean;
  scenes?: number[];
  /** Folder that replay reads and --record writes (examples/<book>/recorded), if the book ships with examples. */
  recordDir?: string;
  /** Mock provenance of each LLM stage in this run (cached stages restore it from state). */
  mockStages: Set<StageId>;
}

export interface StageRunResult {
  /** Files the stage wrote (absolute); hashed for the cache. Defaults to Stage.outputs(). */
  outputs?: string[];
  /** The stage used mock LLM outputs. */
  mock?: boolean;
  note?: string;
}

export interface Stage {
  id: StageId;
  name: string;
  /** Bump to invalidate caches when the stage logic changes. */
  version: number;
  /** Input files (absolute) and parameters that determine the output. */
  inputs(ctx: PartContext): { files: string[]; params?: unknown };
  /** Expected output files (absolute). A missing output forces a re-run. */
  outputs(ctx: PartContext): string[];
  run(ctx: PartContext): Promise<StageRunResult | void>;
}

export class StageGateError extends Error {
  constructor(
    readonly stage: StageId,
    readonly problems: string[],
  ) {
    super(`${stage} gate failed:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "StageGateError";
  }
}

export const AWAITING_RESEARCH_EXIT_CODE = 76;
export const NEEDS_HUMAN_EXIT_CODE = 2;

/** Thrown by S1 when the manual research flow is waiting for the user to paste the NotebookLM answer. */
export class AwaitingResearchError extends Error {
  readonly exitCode = AWAITING_RESEARCH_EXIT_CODE;
  constructor(
    readonly dropFile: string,
    readonly pasteFile: string,
    readonly reason: string,
  ) {
    super(`research needed: ${reason}`);
    this.name = "AwaitingResearchError";
  }
}
