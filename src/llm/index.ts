import { AgentHandoffProvider, defaultHandoffMode, type HandoffMode } from "./providers/handoff";
import { ReplayProvider } from "./providers/replay";
import { MockProvider } from "./providers/mock";
import { OpenAiCompatibleProvider, OllamaProvider } from "./providers/http";
import { AnthropicProvider, GeminiProvider } from "./providers/sdk";
import type { LlmProvider } from "./types";

export const LLM_PROVIDER_IDS = ["agent-handoff", "replay", "mock", "openai-compatible", "anthropic", "gemini", "ollama"] as const;
export type LlmProviderId = (typeof LLM_PROVIDER_IDS)[number];

export interface CreateLlmOptions {
  handoff?: HandoffMode;
  /** Folder with recorded outputs (replay). */
  recordDir?: string;
  model?: string;
  mockDir?: string;
}

export function createLlmProvider(id: string, opts: CreateLlmOptions = {}): LlmProvider {
  switch (id) {
    case "agent-handoff":
    case "agent":
      return new AgentHandoffProvider({ mode: opts.handoff ?? defaultHandoffMode(), timeoutMs: Number(process.env.OPENLECTERN_HANDOFF_TIMEOUT_S || 3600) * 1000 });
    case "replay":
      if (!opts.recordDir) throw new Error("replay provider needs a recordings folder (examples/<book>/recorded)");
      return new ReplayProvider(opts.recordDir);
    case "mock":
      return new MockProvider(opts.mockDir);
    case "openai-compatible":
    case "openai":
      return new OpenAiCompatibleProvider({ model: opts.model });
    case "anthropic":
      return new AnthropicProvider({ model: opts.model });
    case "gemini":
      return new GeminiProvider({ model: opts.model });
    case "ollama":
      return new OllamaProvider({ model: opts.model });
    default:
      throw new Error(`unknown LLM provider "${id}" (choose one of ${LLM_PROVIDER_IDS.join(", ")})`);
  }
}

export * from "./types";
export { runTask } from "./runner";
export { buildTask, validateTaskFolder, writeTaskFolder, listTaskFolders } from "./task";
