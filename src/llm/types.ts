import type { z } from "zod";

/** A typed LLM task. `hash` identifies the task independent of provider, model, time and machine. */
export interface LlmTask<T = unknown> {
  id: string;
  kind: string;
  hash: string;
  templateVersion: string;
  bookId: string;
  chapterId: string;
  partId: string;
  prompt: string;
  input: unknown;
  schema: z.ZodType<T>;
}

export interface LlmResult {
  /** Raw model text (network providers, agent hand-off) or an already-structured value (replay, mock). */
  text?: string;
  value?: unknown;
  provider: string;
  model: string;
  tokensIn?: number;
  tokensOut?: number;
  costUsd?: number;
  durationMs: number;
  mock?: boolean;
}

export interface LlmProvider {
  id: string;
  model: string;
  /** Interactive providers (agent hand-off) get validation feedback written to the task folder instead of automatic retries. */
  interactive?: boolean;
  /** Whether successful outputs are cached under workspace/.cache/llm. */
  cacheable: boolean;
  complete(task: LlmTask, feedback?: string[]): Promise<LlmResult>;
}

export interface PendingTask {
  id: string;
  kind: string;
  dir: string;
}

export const AWAITING_AGENT_EXIT_CODE = 75;

/** Thrown when the agent hand-off provider needs the host agent to answer one or more tasks. */
export class AwaitingAgentError extends Error {
  readonly exitCode = AWAITING_AGENT_EXIT_CODE;
  constructor(readonly tasks: PendingTask[]) {
    super(`awaiting agent answers for ${tasks.length} task(s): ${tasks.map((t) => t.id).join(", ")}`);
    this.name = "AwaitingAgentError";
  }

  static merge(errors: AwaitingAgentError[]): AwaitingAgentError {
    const seen = new Map<string, PendingTask>();
    for (const e of errors) for (const t of e.tasks) seen.set(t.id, t);
    return new AwaitingAgentError([...seen.values()]);
  }
}

export function isAwaitingAgent(e: unknown): e is AwaitingAgentError {
  return e instanceof AwaitingAgentError || (e as { name?: string })?.name === "AwaitingAgentError";
}

/** Lines the CLI prints for each pending task (stdout), one per task. */
export function awaitingLines(e: AwaitingAgentError): string[] {
  return e.tasks.map((t) => `AWAITING_AGENT ${t.id} ${t.dir}`);
}

export class LlmTaskError extends Error {
  constructor(
    message: string,
    readonly problems: string[] = [],
  ) {
    super(message);
    this.name = "LlmTaskError";
  }
}
