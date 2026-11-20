import path from "node:path";
import { exists, readText } from "../../core/fsutil";
import { log } from "../../core/log";
import { writeTaskFolder } from "../task";
import { AwaitingAgentError, type LlmProvider, type LlmResult, type LlmTask } from "../types";

export type HandoffMode = "exit" | "poll";

export interface HandoffOptions {
  mode: HandoffMode;
  pollMs?: number;
  timeoutMs?: number;
}

/** Default mode: `exit` when stdout is not a TTY (an agent runs us), `poll` for a human at a terminal. */
export function defaultHandoffMode(): HandoffMode {
  return process.stdout.isTTY ? "poll" : "exit";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Agent-as-LLM: writes the task to workspace/.tasks/<id>/ and lets the host coding agent answer it.
 * In `exit` mode a missing answer raises AwaitingAgentError (the CLI prints AWAITING_AGENT lines and exits 75).
 */
export class AgentHandoffProvider implements LlmProvider {
  readonly id = "agent-handoff";
  readonly model = "host-agent";
  readonly interactive = true;
  readonly cacheable = true;

  constructor(private readonly opts: HandoffOptions) {}

  async complete(task: LlmTask): Promise<LlmResult> {
    const started = Date.now();
    const dir = writeTaskFolder(task);
    const out = path.join(dir, "output.json");
    if (!exists(out)) {
      if (this.opts.mode === "exit") throw new AwaitingAgentError([{ id: task.id, kind: task.kind, dir }]);
      log.info(`Waiting for an answer to ${task.id}.`);
      log.info(`Read ${path.join(dir, "prompt.md")} and write the JSON answer to ${out}.`);
      const deadline = Date.now() + (this.opts.timeoutMs ?? 60 * 60 * 1000);
      while (!exists(out)) {
        if (Date.now() > deadline) throw new AwaitingAgentError([{ id: task.id, kind: task.kind, dir }]);
        await sleep(this.opts.pollMs ?? 2000);
      }
      await sleep(300);
    }
    return { text: readText(out), provider: this.id, model: this.model, durationMs: Date.now() - started };
  }
}
