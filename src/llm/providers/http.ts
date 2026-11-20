import type { LlmProvider, LlmResult, LlmTask } from "../types";
import { feedbackBlock } from "../runner";

export const SYSTEM_PROMPT =
  "You are the content engine of OpenLectern, which turns books into lesson videos. Follow the task instructions exactly, use only the facts provided, and reply with a single JSON object that matches the requested schema. No prose outside the JSON.";

async function postJson(url: string, body: unknown, headers: Record<string, string>, timeoutMs: number): Promise<any> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs) });
  const text = await res.text();
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

/** Any OpenAI-compatible chat completions endpoint (OpenAI, OpenRouter, Groq, Together, LM Studio, vLLM, Ollama /v1). */
export class OpenAiCompatibleProvider implements LlmProvider {
  readonly id = "openai-compatible";
  readonly cacheable = true;
  readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(opts: { baseUrl?: string; apiKey?: string; model?: string } = {}) {
    this.baseUrl = (opts.baseUrl || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
    this.apiKey = opts.apiKey ?? process.env.OPENAI_API_KEY ?? "";
    this.model = opts.model || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  }

  async complete(task: LlmTask, feedback?: string[]): Promise<LlmResult> {
    const started = Date.now();
    const headers: Record<string, string> = this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {};
    const j = await postJson(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: task.prompt + feedbackBlock(feedback) },
        ],
      },
      headers,
      10 * 60 * 1000,
    );
    return {
      text: String(j.choices?.[0]?.message?.content ?? ""),
      provider: this.id,
      model: this.model,
      tokensIn: j.usage?.prompt_tokens,
      tokensOut: j.usage?.completion_tokens,
      durationMs: Date.now() - started,
    };
  }
}

/** Native Ollama API (local models). */
export class OllamaProvider implements LlmProvider {
  readonly id = "ollama";
  readonly cacheable = true;
  readonly model: string;
  private readonly host: string;

  constructor(opts: { host?: string; model?: string } = {}) {
    this.host = (opts.host || process.env.OLLAMA_HOST || "http://127.0.0.1:11434").replace(/\/+$/, "");
    this.model = opts.model || process.env.OLLAMA_MODEL || "llama3.1";
  }

  async complete(task: LlmTask, feedback?: string[]): Promise<LlmResult> {
    const started = Date.now();
    const j = await postJson(
      `${this.host}/api/chat`,
      {
        model: this.model,
        stream: false,
        format: "json",
        options: { temperature: 0.3 },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: task.prompt + feedbackBlock(feedback) },
        ],
      },
      {},
      30 * 60 * 1000,
    );
    return { text: String(j.message?.content ?? ""), provider: this.id, model: this.model, tokensIn: j.prompt_eval_count, tokensOut: j.eval_count, durationMs: Date.now() - started };
  }
}
