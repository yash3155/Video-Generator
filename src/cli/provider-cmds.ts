import fs from "node:fs";
import path from "node:path";
import { writeJson, ensureDir } from "../core/fsutil";
import { cacheDir } from "../core/paths";
import { log } from "../core/log";
import { DEFAULT_VOICES } from "../tts/voices";

export async function runResearchDetect(json: boolean): Promise<number> {
  const { detectConnectors } = await import("../research/connectors");
  const list = detectConnectors();
  if (json) process.stdout.write(JSON.stringify({ connectors: list }, null, 2) + "\n");
  else for (const c of list) (c.available ? log.ok : log.info)(`${c.id}: ${c.available ? "available" : "not available"} - ${c.detail}`);
  return 0;
}


const SAMPLE_TEXT: Record<string, string> = {
  en: "Compound interest means the interest you earned last year starts earning interest of its own.",
  hi: "चक्रवृद्धि ब्याज का मतलब है कि पिछले साल का ब्याज भी इस साल ब्याज कमाने लगता है।",
};

export async function runTtsTest(opts: { provider: string; voice?: string; lang: string; text?: string; out?: string; json?: boolean }): Promise<number> {
  const { createTtsProvider } = await import("../tts/index");
  const provider = createTtsProvider(opts.provider, { fallback: false });
  const base = opts.lang.split("-")[0];
  const voice = opts.voice || DEFAULT_VOICES[opts.provider]?.[base] || DEFAULT_VOICES[opts.provider]?.en || "default";
  const text = opts.text || SAMPLE_TEXT[base] || SAMPLE_TEXT.en;
  const out = path.resolve(opts.out || path.join(cacheDir(), "tts-test"));
  ensureDir(out);
  const started = Date.now();
  const r = await provider.synthesize({ text, voice, lang: opts.lang, outBase: path.join(out, "tts-test") });
  const wordsPath = path.join(out, "tts-test.words.json");
  writeJson(wordsPath, { provider: r.provider, voice: r.voice, timingSource: r.timingSource, words: r.words });
  const result = {
    provider: r.provider,
    voice: r.voice,
    audioPath: r.audioPath,
    audioBytes: fs.statSync(r.audioPath).size,
    wordsPath,
    words: r.words.length,
    timingSource: r.timingSource,
    mock: r.mock,
    elapsedMs: Date.now() - started,
  };
  if (opts.json) process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  else log.ok(`${r.provider} wrote ${r.audioPath} (${result.audioBytes} bytes, ${r.words.length} words, timing ${r.timingSource})`);
  return 0;
}

export async function runLlmTest(opts: { provider: string; handoff?: "exit" | "poll"; json?: boolean }): Promise<number> {
  const { createLlmProvider, buildTask, runTask } = await import("../llm/index");
  const provider = createLlmProvider(opts.provider, { handoff: opts.handoff });
  const task = buildTask<{ answer: string }>({ kind: "ping", bookId: "openlectern", chapterId: "check", partId: "p1", input: { question: "ping" } });
  const r = await runTask(task, { provider });
  if (opts.json) process.stdout.write(JSON.stringify({ provider: provider.id, model: provider.model, task: task.id, answer: r.output.answer, cacheHit: r.cacheHit }, null, 2) + "\n");
  else log.ok(`${provider.id} answered ${task.id}: ${r.output.answer}`);
  return 0;
}

export async function runTaskValidate(ids: string[], json: boolean): Promise<number> {
  const { validateTaskFolder } = await import("../llm/index");
  const results = ids.map((id) => ({ id, ...validateTaskFolder(id) }));
  if (json) process.stdout.write(JSON.stringify({ results: results.map(({ value: _v, ...r }) => r) }, null, 2) + "\n");
  else
    for (const r of results) {
      if (r.ok) log.ok(`${r.id}: output.json is valid; re-run the same openlectern command to continue`);
      else {
        log.fail(`${r.id}: ${r.problems.length} problem(s)`);
        for (const p of r.problems) process.stderr.write(`  - ${p}\n`);
      }
    }
  return results.every((r) => r.ok) ? 0 : 1;
}

export async function runTaskList(json: boolean): Promise<number> {
  const { listTaskFolders } = await import("../llm/index");
  const { taskDir } = await import("../llm/task");
  const tasks = listTaskFolders().map((t) => ({ ...t, dir: taskDir(t.id), answered: fs.existsSync(path.join(taskDir(t.id), "output.json")) }));
  if (json) process.stdout.write(JSON.stringify({ tasks }, null, 2) + "\n");
  else for (const t of tasks) process.stdout.write(`${t.answered ? "answered" : "pending "} ${t.id} ${t.dir}\n`);
  return 0;
}
