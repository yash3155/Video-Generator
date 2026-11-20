/*
 * LaTeX hygiene for every string in an artifact (checks C-10 and C-11, docs/standards/FORMULA_RULES.md).
 *
 * LaTeX may only live in `latex` fields (Formula.latex, symbolLatex, math segments). Everything else is
 * plain text shown on screen or spoken, so a backslash command, `/text`, `_` or `^` there means a formula
 * leaked into free text.
 */
import { NON_DISPLAY_KEYS } from "../core/richtext";
import { finding, type QaFinding, type FindingContext } from "../qa/finding";

export type MathIssueCode =
  | "control-char"
  | "slash-command"
  | "raw-latex-in-text"
  | "doubled-backslash"
  | "dollar-in-latex"
  | "unbalanced-braces"
  | "raw-script-in-text";

export interface MathIssue {
  code: MathIssueCode;
  path: string;
  detail: string;
}

const LATEX_KEYS = new Set(["latex", "symbolLatex"]);
const CONTROL_NAMES: Record<string, string> = { "\t": "\\t (tab)", "\f": "\\f (form feed)", "\b": "\\b (backspace)", "\r": "\\r (carriage return)", "\n": "\\n (newline)" };
const SWALLOWED: Record<string, string> = { "\t": "t", "\f": "f", "\b": "b", "\r": "r", "\n": "n" };

export function isLatexKey(key: string): boolean {
  return LATEX_KEYS.has(key);
}

function describeControl(s: string, isLatex: boolean): string | undefined {
  const re = isLatex ? /[\u0000-\u001f]/ : /[\u0000-\u0009\u000b-\u001f]/;
  const m = re.exec(s);
  if (!m) return undefined;
  const c = m[0];
  const after = s.slice(m.index + 1).match(/^[A-Za-z]*/)?.[0] ?? "";
  const name = CONTROL_NAMES[c] ?? `U+${c.charCodeAt(0).toString(16).padStart(4, "0").toUpperCase()}`;
  const guess = SWALLOWED[c] && after ? ` - looks like \\${SWALLOWED[c]}${after} lost its backslash to a JSON escape` : "";
  return `control character ${name} before "${after.slice(0, 12)}"${guess}`;
}

function bracesBalanced(latex: string): boolean {
  let depth = 0;
  for (let i = 0; i < latex.length; i++) {
    const c = latex[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

const SLASH_COMMAND = /\/(text|frac|left|right|times|cdot|sqrt|mathrm|textbf|sum|int|alpha|beta|theta|sigma|Delta|delta|pi)\b/;
const DOUBLED = /\\\\[A-Za-z]/;
const RAW_LATEX = /\\[A-Za-z]{2,}/;
const RAW_SCRIPT = /[A-Za-z0-9)\]}][_^][A-Za-z0-9{(]/;

/** Problems in one LaTeX source string. */
export function checkLatexSource(latex: string): { code: MathIssueCode; detail: string }[] {
  const out: { code: MathIssueCode; detail: string }[] = [];
  const ctl = describeControl(latex, true);
  if (ctl) out.push({ code: "control-char", detail: ctl });
  const slash = SLASH_COMMAND.exec(latex);
  if (slash) out.push({ code: "slash-command", detail: `"${slash[0]}" uses a forward slash instead of a backslash` });
  const dbl = DOUBLED.exec(latex);
  if (dbl) out.push({ code: "doubled-backslash", detail: `doubled backslash "${dbl[0]}" (over-escaped JSON)` });
  if (latex.includes("$")) out.push({ code: "dollar-in-latex", detail: "`$` delimiter inside a latex field" });
  if (!bracesBalanced(latex)) out.push({ code: "unbalanced-braces", detail: "unbalanced braces" });
  return out;
}

/** Problems in one plain-text string (shown on screen or spoken). */
export function checkPlainText(text: string, opts: { onScreen?: boolean } = {}): { code: MathIssueCode; detail: string }[] {
  const out: { code: MathIssueCode; detail: string }[] = [];
  const ctl = describeControl(text, false);
  if (ctl) out.push({ code: "control-char", detail: ctl });
  const slash = SLASH_COMMAND.exec(text);
  if (slash) out.push({ code: "slash-command", detail: `"${slash[0]}" is broken LaTeX in plain text` });
  const raw = RAW_LATEX.exec(text);
  if (raw) out.push({ code: "raw-latex-in-text", detail: `raw LaTeX "${raw[0]}" outside a latex field` });
  if (opts.onScreen !== false) {
    const sc = RAW_SCRIPT.exec(text);
    if (sc) out.push({ code: "raw-script-in-text", detail: `raw subscript/superscript "${sc[0]}" in plain text; use a math segment` });
  }
  return out;
}

/** Walk any JSON value and report LaTeX hygiene problems with JSON paths. */
export function scanMathText(value: unknown, pathPrefix = "$", opts: { onScreen?: boolean } = {}): MathIssue[] {
  const issues: MathIssue[] = [];
  const walk = (v: unknown, p: string, key: string) => {
    if (NON_DISPLAY_KEYS.has(key)) return;
    if (typeof v === "string") {
      const found = isLatexKey(key) ? checkLatexSource(v) : checkPlainText(v, opts);
      for (const f of found) issues.push({ ...f, path: p });
      return;
    }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) walk(x, `${p}.${k}`, k);
  };
  walk(value, pathPrefix, "");
  return issues;
}

/** Deterministic repairs that are always safe; anything else stays a finding. */
export function sanitizeLatex(latex: string): { latex: string; changed: boolean } {
  let s = latex;
  s = s.replace(/[\t\f\b\r\n]([A-Za-z]+)/g, (m, letters: string) => (SWALLOWED[m[0]] ? `\\${SWALLOWED[m[0]]}${letters}` : m));
  s = s.replace(new RegExp(SLASH_COMMAND.source, "g"), (_m, cmd: string) => `\\${cmd}`);
  s = s.replace(/\\\\([A-Za-z])/g, "\\$1");
  s = s.trim().replace(/^\$+|\$+$/g, "").trim();
  return { latex: s, changed: s !== latex };
}

const REPAIR: Record<MathIssueCode, string> = {
  "control-char": "Re-escape the LaTeX backslash in the model output (write \\\\text in JSON) or re-run the stage; the parser auto-repairs known commands.",
  "slash-command": "Replace the forward slash with a backslash and move the formula into a latex field.",
  "raw-latex-in-text": "Move the formula into a Formula.latex field or an inline math segment; plain text must not contain LaTeX.",
  "doubled-backslash": "Use a single LaTeX backslash in the parsed string (one level of JSON escaping).",
  "dollar-in-latex": "Remove $ delimiters; latex fields hold bare LaTeX.",
  "unbalanced-braces": "Balance the braces in the LaTeX source.",
  "raw-script-in-text": "Use an inline math segment {type: math, latex: 'S_T'} instead of raw _ or ^ in text.",
};

export function mathIssuesToFindings(issues: MathIssue[], ctx: FindingContext = {}): QaFinding[] {
  return issues.map((i) =>
    finding(
      i.code === "control-char" ? "C-10" : "C-11",
      "BLOCKER",
      `${i.path}: ${i.detail}`,
      i.code === "control-char" ? "A JSON escape swallowed a LaTeX backslash." : "Formula text is malformed or outside a latex field.",
      REPAIR[i.code],
      ctx,
    ),
  );
}
