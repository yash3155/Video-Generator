import path from "node:path";
import { exists, readJson } from "../../core/fsutil";
import { REPO_ROOT } from "../../core/paths";
import type { LlmProvider, LlmResult, LlmTask } from "../types";

export function mockFixturesDir(): string {
  return path.join(REPO_ROOT, "tests", "fixtures", "llm");
}

/**
 * Tests only: returns hand-authored fixtures from tests/fixtures/llm/<kind>/<chapter>[_<part>].json.
 * Everything it produces is stamped mock and can never be released (Q-MOCK).
 */
export class MockProvider implements LlmProvider {
  readonly id = "mock";
  readonly model = "fixtures";
  readonly cacheable = false;

  constructor(private readonly dir = mockFixturesDir()) {}

  fixtureFor(task: LlmTask): string | null {
    const base = path.join(this.dir, task.kind);
    for (const name of [`${task.chapterId}_${task.partId}.json`, `${task.chapterId}.json`, "default.json"]) {
      const f = path.join(base, name);
      if (exists(f)) return f;
    }
    return null;
  }

  async complete(task: LlmTask): Promise<LlmResult> {
    const f = this.fixtureFor(task);
    if (!f) throw new Error(`no mock fixture for ${task.kind} ${task.chapterId}/${task.partId} under ${path.join(this.dir, task.kind)}`);
    return { value: readJson(f), provider: this.id, model: this.model, durationMs: 0, mock: true };
  }
}
