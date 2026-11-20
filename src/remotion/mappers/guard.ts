/* Render-data guard (E.5): nothing empty, undefined, null, NaN or "[object Object]" may reach the screen. */

export class RenderDataError extends Error {
  constructor(
    message: string,
    readonly path: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "RenderDataError";
  }
}

/** Tokens that mean a value was stringified by mistake or left as a placeholder (E.4, C-09). */
export const BAD_TEXT_TOKENS = ["[object Object]", "undefined", "null", "NaN", "TODO", "TBD", "lorem", "{{", "}}", "[insert", "XXX", "PLACEHOLDER", "Example Title"] as const;

const WORD_TOKENS = new Set(["undefined", "null", "NaN", "TODO", "TBD", "XXX", "PLACEHOLDER"]);

export interface RenderIssue {
  path: string;
  token: string;
  value: string;
}

function tokenIn(text: string): string | undefined {
  for (const t of BAD_TEXT_TOKENS) {
    if (WORD_TOKENS.has(t)) {
      if (new RegExp(`(^|[^A-Za-z])${t}([^A-Za-z]|$)`).test(text)) return t;
    } else if (t === "lorem" ? /\blorem\b/i.test(text) : text.includes(t)) return t;
  }
  return undefined;
}

/** Keys whose values are identifiers or settings, not on-screen text. */
const NON_TEXT_KEYS = new Set(["id", "template", "kind", "role", "tone", "color", "mode", "speaker", "status", "arrangement", "type", "expression", "expr", "variable", "generator", "scope", "from", "to", "target", "anchor", "highlightRowId", "icon", "solvesFor", "latex", "symbolLatex"]);

/** Deep scan of template data for values that would render as junk. */
export function scanRenderable(value: unknown, path = "data"): RenderIssue[] {
  const out: RenderIssue[] = [];
  const walk = (v: unknown, p: string, key: string) => {
    if (v === undefined || v === null) {
      out.push({ path: p, token: String(v), value: String(v) });
      return;
    }
    if (typeof v === "number") {
      if (!Number.isFinite(v)) out.push({ path: p, token: "NaN", value: String(v) });
      return;
    }
    if (typeof v === "string") {
      if (NON_TEXT_KEYS.has(key)) return;
      if (!v.trim()) out.push({ path: p, token: "empty", value: v });
      const t = tokenIn(v);
      if (t) out.push({ path: p, token: t, value: v });
      return;
    }
    if (Array.isArray(v)) {
      v.forEach((x, i) => walk(x, `${p}[${i}]`, key));
      return;
    }
    if (typeof v === "object") {
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
        if (k === "generator" || k === "scope") continue;
        if (x === undefined) continue;
        walk(x, `${p}.${k}`, k);
      }
    }
  };
  walk(value, path, "");
  return out;
}

export function assertRenderable(value: unknown, path = "data"): void {
  const issues = scanRenderable(value, path);
  if (issues.length) {
    const first = issues[0];
    throw new RenderDataError(`render data at ${first.path} would show "${first.token}" on screen (value: ${JSON.stringify(first.value).slice(0, 80)})`, first.path);
  }
}

/** The only way a template turns a value into visible text. Never calls String() on objects. */
export function text(value: unknown, path: string): string {
  if (typeof value === "string") {
    const t = tokenIn(value);
    if (!value.trim()) throw new RenderDataError(`empty text at ${path}`, path);
    if (t) throw new RenderDataError(`text at ${path} would show "${t}" on screen`, path);
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new RenderDataError(`text at ${path} would show "NaN" on screen`, path);
    return String(value);
  }
  if (value === undefined || value === null) throw new RenderDataError(`text at ${path} would show "${String(value)}" on screen`, path);
  throw new RenderDataError(`text at ${path} is an object and would show "[object Object]" on screen`, path);
}
