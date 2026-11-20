import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { z } from "zod";
import { TASK_SCHEMAS, registerTaskGate } from "../../src/llm/kinds";
import { runTask } from "../../src/llm/runner";
import { buildTask } from "../../src/llm/task";
import { AgentHandoffProvider } from "../../src/llm/providers/handoff";
import { ReplayProvider } from "../../src/llm/providers/replay";
import { MockProvider } from "../../src/llm/providers/mock";
import { OpenAiCompatibleProvider, OllamaProvider } from "../../src/llm/providers/http";
import { AnthropicProvider, GeminiProvider } from "../../src/llm/providers/sdk";
import { createLlmProvider } from "../../src/llm/index";
import { AwaitingAgentError, isAwaitingAgent, type LlmProvider, type LlmTask } from "../../src/llm/types";

TASK_SCHEMAS.test_formula = z.object({ latex: z.string().min(1), note: z.string() });
registerTaskGate("test_formula", (o) => ((o as { note: string }).note.includes("TODO") ? ["placeholder TODO"] : []));

let home: string;
let savedHome: string | undefined;
beforeEach(() => {
  savedHome = process.env.OPENLECTERN_HOME;
  home = fs.mkdtempSync(path.join(os.tmpdir(), "ol-llm-"));
  process.env.OPENLECTERN_HOME = home;
});
afterEach(() => {
  if (savedHome === undefined) delete process.env.OPENLECTERN_HOME;
  else process.env.OPENLECTERN_HOME = savedHome;
  fs.rmSync(home, { recursive: true, force: true });
});

const formulaTask = (input: unknown = { x: 1 }): LlmTask => ({
  id: "ch01-p1-test_formula-abcd",
  kind: "test_formula",
  hash: "h" + JSON.stringify(input).length,
  templateVersion: "v1",
  bookId: "demo",
  chapterId: "ch01",
  partId: "p1",
  prompt: "give a formula",
  input,
  schema: TASK_SCHEMAS.test_formula,
});

class ScriptedProvider implements LlmProvider {
  id = "scripted";
  model = "m";
  cacheable = true;
  calls: (string[] | undefined)[] = [];
  constructor(private readonly replies: string[]) {}
  async complete(_task: LlmTask, feedback?: string[]) {
    this.calls.push(feedback);
    return { text: this.replies[Math.min(this.calls.length - 1, this.replies.length - 1)], provider: this.id, model: this.model, durationMs: 1 };
  }
}

describe("task building", () => {
  it("hashes kind, template version and input only", () => {
    const a = buildTask({ kind: "ping", bookId: "b", chapterId: "c1", partId: "p1", input: { q: 1 } });
    const b = buildTask({ kind: "ping", bookId: "other", chapterId: "c1", partId: "p1", input: { q: 1 } });
    const c = buildTask({ kind: "ping", bookId: "b", chapterId: "c1", partId: "p1", input: { q: 2 } });
    expect(a.hash).toBe(b.hash);
    expect(a.hash).not.toBe(c.hash);
    expect(a.prompt).toContain("## Input");
    expect(a.prompt).toContain('"q": 1');
  });
});

describe("runTask", () => {
  it("repairs swallowed LaTeX backslashes from raw model text", async () => {
    const p = new ScriptedProvider(['```json\n{"latex": "\\frac{a}{b} \\times \\text{rate}", "note": "ok"}\n```']);
    const r = await runTask<{ latex: string }>(formulaTask() as LlmTask<{ latex: string }>, { provider: p });
    expect(r.output.latex).toBe("\\frac{a}{b} \\times \\text{rate}");
  });

  it("retries with validation feedback, at most twice", async () => {
    const p = new ScriptedProvider(['{"latex": ""}', '{"latex": "x", "note": "TODO"}', '{"latex": "x", "note": "fine"}']);
    const r = await runTask(formulaTask(), { provider: p });
    expect(r.output).toEqual({ latex: "x", note: "fine" });
    expect(p.calls).toHaveLength(3);
    expect(p.calls[1]?.join(" ")).toMatch(/schema/);
    expect(p.calls[2]?.join(" ")).toMatch(/placeholder TODO/);
  });

  it("fails after the repair budget", async () => {
    const p = new ScriptedProvider(['{"latex": ""}']);
    await expect(runTask(formulaTask(), { provider: p })).rejects.toThrow(/failed validation after 2 repairs/);
    expect(p.calls).toHaveLength(3);
  });

  it("caches successful outputs, writes the ledger, records and reports the task", async () => {
    const p = new ScriptedProvider(['{"latex": "x", "note": "fine"}']);
    const recordDir = path.join(home, "rec");
    const seen: string[] = [];
    await runTask(formulaTask(), { provider: p, recordDir, onTask: (t) => seen.push(t.kind) });
    const again = await runTask(formulaTask(), { provider: p, recordDir });
    expect(again.cacheHit).toBe(true);
    expect(p.calls).toHaveLength(1);
    expect(seen).toEqual(["test_formula"]);
    const ledger = fs.readFileSync(path.join(home, "workspace", "ledger.jsonl"), "utf8").trim().split("\n");
    expect(ledger).toHaveLength(2);
    expect(JSON.parse(ledger[1]).cacheHit).toBe(true);
    const rec = JSON.parse(fs.readFileSync(path.join(recordDir, `${formulaTask().hash}.json`), "utf8"));
    expect(rec).toMatchObject({ kind: "test_formula", output: { latex: "x" } });
  });

  it("replays recordings and names the hash when one is missing", async () => {
    const dir = path.join(home, "recorded");
    const t = formulaTask();
    await expect(runTask(t, { provider: new ReplayProvider(dir) })).rejects.toThrow(t.hash);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${t.hash}.json`), JSON.stringify({ kind: "test_formula", output: { latex: "y", note: "n" } }));
    const r = await runTask(t, { provider: new ReplayProvider(dir) });
    expect(r.output).toEqual({ latex: "y", note: "n" });
    expect(r.mock).toBe(false);
  });

  it("mock provider reads fixtures by kind and chapter and stamps mock", async () => {
    const dir = path.join(home, "fixtures");
    fs.mkdirSync(path.join(dir, "test_formula"), { recursive: true });
    fs.writeFileSync(path.join(dir, "test_formula", "ch01.json"), JSON.stringify({ latex: "z", note: "n" }));
    const r = await runTask(formulaTask(), { provider: new MockProvider(dir) });
    expect(r.mock).toBe(true);
    expect(r.output).toEqual({ latex: "z", note: "n" });
    await expect(runTask({ ...formulaTask(), chapterId: "ch09" }, { provider: new MockProvider(dir) })).rejects.toThrow(/no mock fixture/);
  });

  it("agent hand-off in exit mode raises AwaitingAgentError with the task folder", async () => {
    const t = buildTask({ kind: "ping", bookId: "b", chapterId: "c1", partId: "p1", input: {} });
    const p = new AgentHandoffProvider({ mode: "exit" });
    const err = await runTask(t, { provider: p }).catch((e) => e);
    expect(isAwaitingAgent(err)).toBe(true);
    expect((err as AwaitingAgentError).exitCode).toBe(75);
    expect((err as AwaitingAgentError).tasks[0].id).toBe(t.id);
    expect(fs.existsSync(path.join(home, "workspace", ".tasks", t.id, "prompt.md"))).toBe(true);
  });

  it("agent hand-off in poll mode waits for output.json", async () => {
    const t = buildTask({ kind: "ping", bookId: "b", chapterId: "c2", partId: "p1", input: {} });
    const p = new AgentHandoffProvider({ mode: "poll", pollMs: 20, timeoutMs: 5000 });
    setTimeout(() => fs.writeFileSync(path.join(home, "workspace", ".tasks", t.id, "output.json"), '{"answer":"pong"}'), 100);
    const r = await runTask<{ answer: string }>(t as LlmTask<{ answer: string }>, { provider: p });
    expect(r.output.answer).toBe("pong");
  });
});

describe("network providers", () => {
  let server: http.Server;
  let url = "";
  let lastBody: any;
  beforeEach(async () => {
    server = http.createServer((req, res) => {
      let body = "";
      req.on("data", (d) => (body += d));
      req.on("end", () => {
        lastBody = { path: req.url, auth: req.headers.authorization, json: JSON.parse(body) };
        res.setHeader("content-type", "application/json");
        if (req.url === "/v1/chat/completions") res.end(JSON.stringify({ choices: [{ message: { content: '{"answer":"pong"}' } }], usage: { prompt_tokens: 10, completion_tokens: 3 } }));
        else if (req.url === "/api/chat") res.end(JSON.stringify({ message: { content: '{"answer":"pong"}' }, prompt_eval_count: 9, eval_count: 2 }));
        else {
          res.statusCode = 404;
          res.end("{}");
        }
      });
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  });
  afterEach(() => new Promise<void>((r) => server.close(() => r())));

  it("openai-compatible posts a chat completion with JSON mode", async () => {
    const p = new OpenAiCompatibleProvider({ baseUrl: url + "/v1", apiKey: "k", model: "test-model" });
    const t = buildTask({ kind: "ping", bookId: "b", chapterId: "c3", partId: "p1", input: {} });
    const r = await runTask<{ answer: string }>(t as LlmTask<{ answer: string }>, { provider: p });
    expect(r.output.answer).toBe("pong");
    expect(lastBody.auth).toBe("Bearer k");
    expect(lastBody.json.model).toBe("test-model");
    expect(lastBody.json.response_format).toEqual({ type: "json_object" });
  });

  it("ollama posts to /api/chat with format json", async () => {
    const p = new OllamaProvider({ host: url, model: "llama-test" });
    const res = await p.complete(buildTask({ kind: "ping", bookId: "b", chapterId: "c4", partId: "p1", input: {} }));
    expect(res.text).toContain("pong");
    expect(res.tokensIn).toBe(9);
    expect(lastBody.json.format).toBe("json");
  });

  it("anthropic and gemini require keys from the environment", async () => {
    const saved = { a: process.env.ANTHROPIC_API_KEY, g: process.env.GEMINI_API_KEY };
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      const t = buildTask({ kind: "ping", bookId: "b", chapterId: "c5", partId: "p1", input: {} });
      await expect(new AnthropicProvider().complete(t)).rejects.toThrow(/ANTHROPIC_API_KEY/);
      await expect(new GeminiProvider().complete(t)).rejects.toThrow(/GEMINI_API_KEY/);
    } finally {
      if (saved.a !== undefined) process.env.ANTHROPIC_API_KEY = saved.a;
      if (saved.g !== undefined) process.env.GEMINI_API_KEY = saved.g;
    }
  });

  it("the factory knows every provider id", () => {
    for (const id of ["agent-handoff", "mock", "openai-compatible", "anthropic", "gemini", "ollama"]) expect(createLlmProvider(id, { handoff: "exit" }).id).toBe(id);
    expect(createLlmProvider("replay", { recordDir: home }).id).toBe("replay");
    expect(() => createLlmProvider("replay")).toThrow(/recordings/);
    expect(() => createLlmProvider("nope")).toThrow(/unknown LLM provider/);
  });
});
