import type { LlmProvider, LlmResult, LlmTask } from "../types";
import { feedbackBlock } from "../runner";
import { SYSTEM_PROMPT } from "./http";

/** Anthropic via the official SDK. Key from ANTHROPIC_API_KEY (.env). */
export class AnthropicProvider implements LlmProvider {
  readonly id = "anthropic";
  readonly cacheable = true;
  readonly model: string;

  constructor(opts: { model?: string } = {}) {
    this.model = opts.model || process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
  }

  async complete(task: LlmTask, feedback?: string[]): Promise<LlmResult> {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set (add it to .env)");
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const started = Date.now();
    const msg = await client.messages.create({
      model: this.model,
      max_tokens: 32000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: task.prompt + feedbackBlock(feedback) }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return { text, provider: this.id, model: this.model, tokensIn: msg.usage?.input_tokens, tokensOut: msg.usage?.output_tokens, durationMs: Date.now() - started };
  }
}

/** Google Gemini via the official @google/genai SDK. Key from GEMINI_API_KEY (.env). */
export class GeminiProvider implements LlmProvider {
  readonly id = "gemini";
  readonly cacheable = true;
  readonly model: string;

  constructor(opts: { model?: string } = {}) {
    this.model = opts.model || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async complete(task: LlmTask, feedback?: string[]): Promise<LlmResult> {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set (add it to .env)");
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const started = Date.now();
    const res = await ai.models.generateContent({
      model: this.model,
      contents: task.prompt + feedbackBlock(feedback),
      config: { systemInstruction: SYSTEM_PROMPT, responseMimeType: "application/json", temperature: 0.3 },
    });
    return {
      text: res.text ?? "",
      provider: this.id,
      model: this.model,
      tokensIn: res.usageMetadata?.promptTokenCount,
      tokensOut: res.usageMetadata?.candidatesTokenCount,
      durationMs: Date.now() - started,
    };
  }
}
