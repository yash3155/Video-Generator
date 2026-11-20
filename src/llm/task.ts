import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { exists, hashOf, readJson, readText, writeJson, writeText, ensureDir } from "../core/fsutil";
import { promptsDir, tasksDir } from "../core/paths";
import { schemaForKind, runTaskGates } from "./kinds";
import { safeParseJson } from "../math/escapes";
import type { LlmTask } from "./types";

const TEMPLATE_HEADER = /^<!--\s*openlectern-template:\s*([a-z_]+)\s+v(\d+)\s*-->/;

export interface TaskTemplate {
  kind: string;
  version: string;
  text: string;
}

export function loadTemplate(kind: string): TaskTemplate {
  const file = path.join(promptsDir(), "tasks", `${kind}.md`);
  if (!exists(file)) throw new Error(`prompt template missing: prompts/tasks/${kind}.md`);
  const text = readText(file);
  const m = text.match(TEMPLATE_HEADER);
  if (!m || m[1] !== kind) throw new Error(`prompts/tasks/${kind}.md must start with <!-- openlectern-template: ${kind} v<N> -->`);
  return { kind, version: `v${m[2]}`, text: text.slice(m[0].length).trimStart() };
}

/** Replace {{name}} placeholders; unknown placeholders are an error so prompts never ship with holes. */
export function renderTemplate(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, name: string) => {
    if (!(name in vars)) throw new Error(`template variable "${name}" not provided`);
    return String(vars[name]);
  });
}

export function outputJsonSchema(kind: string): unknown {
  return z.toJSONSchema(schemaForKind(kind), { io: "input", unrepresentable: "any" });
}

export interface BuildTaskArgs {
  kind: string;
  bookId: string;
  chapterId: string;
  partId: string;
  input: unknown;
  vars?: Record<string, string | number>;
}

const safeId = (s: string) => s.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");

/** Build a task. The hash covers kind, template version and input only (no provider, model, time or path). */
export function buildTask<T = unknown>(args: BuildTaskArgs): LlmTask<T> {
  const tpl = loadTemplate(args.kind);
  const hash = hashOf({ kind: args.kind, templateVersion: tpl.version, input: args.input });
  const body = renderTemplate(tpl.text, args.vars ?? {});
  const prompt = [
    body.trimEnd(),
    "",
    "## Input",
    "",
    "The task input (also saved as input.json next to this prompt):",
    "",
    "```json",
    JSON.stringify(args.input, null, 2),
    "```",
    "",
    "## Output",
    "",
    "Reply with one JSON object only, valid against output.schema.json. Write LaTeX with escaped backslashes in JSON (\"\\\\frac\", not \"\\frac\").",
    "",
  ].join("\n");
  return {
    id: safeId(`${args.chapterId}-${args.partId}-${args.kind}-${hash.slice(0, 8)}`),
    kind: args.kind,
    hash,
    templateVersion: tpl.version,
    bookId: args.bookId,
    chapterId: args.chapterId,
    partId: args.partId,
    prompt,
    input: args.input,
    schema: schemaForKind(args.kind) as z.ZodType<T>,
  };
}

export interface TaskMeta {
  id: string;
  kind: string;
  hash: string;
  templateVersion: string;
  bookId: string;
  chapterId: string;
  partId: string;
}

export function taskDir(id: string): string {
  return path.join(tasksDir(), id);
}

/** Write prompt.md, input.json, output.schema.json and task.json for the agent. Idempotent. */
export function writeTaskFolder(task: LlmTask): string {
  const dir = ensureDir(taskDir(task.id));
  const metaFile = path.join(dir, "task.json");
  if (exists(metaFile) && readJson<TaskMeta>(metaFile).hash === task.hash) return dir;
  const meta: TaskMeta = { id: task.id, kind: task.kind, hash: task.hash, templateVersion: task.templateVersion, bookId: task.bookId, chapterId: task.chapterId, partId: task.partId };
  writeText(path.join(dir, "prompt.md"), task.prompt);
  writeJson(path.join(dir, "input.json"), task.input);
  writeJson(path.join(dir, "output.schema.json"), outputJsonSchema(task.kind));
  writeJson(metaFile, meta);
  return dir;
}

export interface ValidationResult {
  ok: boolean;
  problems: string[];
  value?: unknown;
}

/** Parse, schema-check and content-gate an output text for a task kind. */
export function validateOutput(kind: string, text: string | undefined, value: unknown, input: unknown): ValidationResult {
  let parsed: unknown = value;
  const problems: string[] = [];
  if (text !== undefined) {
    try {
      const r = safeParseJson(text);
      parsed = r.value;
      for (const p of r.problems) problems.push(`C-10 ${p.path}: ${p.detail}`);
    } catch (e) {
      return { ok: false, problems: [(e as Error).message] };
    }
  }
  const s = schemaForKind(kind).safeParse(parsed);
  if (!s.success) {
    for (const i of s.error.issues.slice(0, 40)) problems.push(`schema ${i.path.join(".") || "(root)"}: ${i.message}`);
    return { ok: false, problems };
  }
  problems.push(...runTaskGates(kind, s.data, input));
  return { ok: problems.length === 0, problems, value: s.data };
}

/** Validate the agent's answer in a task folder (`openlectern task:validate <id>`). */
export function validateTaskFolder(id: string): ValidationResult & { dir: string } {
  const dir = taskDir(id);
  if (!exists(path.join(dir, "task.json"))) return { ok: false, problems: [`no task folder ${dir}`], dir };
  const meta = readJson<TaskMeta>(path.join(dir, "task.json"));
  const outFile = path.join(dir, "output.json");
  if (!exists(outFile)) return { ok: false, problems: ["output.json not written yet"], dir };
  const input = readJson(path.join(dir, "input.json"));
  return { ...validateOutput(meta.kind, readText(outFile), undefined, input), dir };
}

export function listTaskFolders(): TaskMeta[] {
  const root = tasksDir();
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter((d) => exists(path.join(root, d, "task.json")))
    .map((d) => readJson<TaskMeta>(path.join(root, d, "task.json")));
}
