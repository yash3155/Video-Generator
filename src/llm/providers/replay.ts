import path from "node:path";
import { exists, readJson } from "../../core/fsutil";
import type { LlmProvider, LlmResult, LlmTask } from "../types";

/** Replays recorded outputs from <recordDir>/<task_hash>.json. A missing recording is an error naming the hash. */
export class ReplayProvider implements LlmProvider {
  readonly id = "replay";
  readonly model = "recorded";
  readonly cacheable = false;

  constructor(private readonly recordDir: string) {}

  async complete(task: LlmTask): Promise<LlmResult> {
    const file = path.join(this.recordDir, `${task.hash}.json`);
    if (!exists(file)) {
      const e = new Error(`no recording for task ${task.kind} (${task.chapterId}/${task.partId}) hash ${task.hash}; expected ${file}`);
      (e as Error & { exitCode: number }).exitCode = 3;
      throw e;
    }
    const rec = readJson<{ kind: string; output: unknown }>(file);
    if (rec.kind !== task.kind) throw new Error(`recording ${task.hash} is for kind ${rec.kind}, not ${task.kind}`);
    return { value: rec.output, provider: this.id, model: this.model, durationMs: 0 };
  }
}
