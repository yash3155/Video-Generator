/*
 * LaTeX-safe JSON parsing for LLM output (docs/standards/FORMULA_RULES.md).
 *
 * LLMs often write LaTeX inside JSON with a single backslash. JSON then reads `\frac` as form feed + "rac",
 * `\text` as tab + "ext", and rejects `\v` or `\underline`. We repair the raw text before parsing
 * (doubling backslashes that start a known LaTeX command or an invalid escape) and then scan every
 * parsed string for leftover control characters.
 */

/** LaTeX commands whose first letter collides with a JSON escape (b, f, n, r, t, u). */
const COLLIDING_COMMANDS = new Set([
  "bar", "beta", "begin", "big", "bigg", "bigl", "bigr", "binom", "bmod", "boldsymbol", "bot", "boxed", "bullet",
  "frac", "forall", "flat", "frak", "footnotesize",
  "nabla", "ne", "neq", "newline", "ni", "not", "nu", "nolimits", "notin", "nleq", "ngeq",
  "rangle", "rceil", "rfloor", "rho", "right", "rightarrow", "rm", "rbrace", "rvert",
  "tan", "tanh", "tau", "text", "textbf", "textit", "textrm", "textsf", "texttt", "tfrac", "theta", "therefore", "tilde", "times", "to", "top", "triangle",
  "underbrace", "underline", "uparrow", "upsilon", "updownarrow",
]);

const CONTROL_TO_LETTER: Record<string, string> = { "\t": "t", "\f": "f", "\b": "b", "\r": "r", "\n": "n" };

export interface ParseRepair {
  kind: "raw-escape" | "control-char";
  detail: string;
}

export interface ParseProblem {
  path: string;
  detail: string;
}

export interface SafeParseResult {
  value: unknown;
  repairs: ParseRepair[];
  /** Control characters that could not be repaired (C-10 BLOCKER). */
  problems: ParseProblem[];
}

function alphaRun(s: string, i: number): string {
  let j = i;
  while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
  return s.slice(i, j);
}

/** Double backslashes inside JSON string literals that would otherwise swallow a LaTeX command or be invalid escapes. */
export function repairRawJsonEscapes(raw: string): { text: string; repairs: ParseRepair[] } {
  const repairs: ParseRepair[] = [];
  let out = "";
  let inString = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (!inString) {
      if (c === '"') inString = true;
      out += c;
      continue;
    }
    if (c === '"') {
      inString = false;
      out += c;
      continue;
    }
    if (c !== "\\") {
      out += c;
      continue;
    }
    const n = raw[i + 1];
    if (n === undefined) {
      out += c;
      continue;
    }
    if (n === '"' || n === "\\" || n === "/") {
      out += c + n;
      i++;
      continue;
    }
    if (n === "u" && /^[0-9a-fA-F]{4}$/.test(raw.slice(i + 2, i + 6)) && !COLLIDING_COMMANDS.has(alphaRun(raw, i + 1))) {
      out += c + n;
      i++;
      continue;
    }
    if ("bfnrt".includes(n)) {
      const run = alphaRun(raw, i + 1);
      if (COLLIDING_COMMANDS.has(run)) {
        repairs.push({ kind: "raw-escape", detail: `\\${run}` });
        out += "\\\\" + n;
      } else out += c + n;
      i++;
      continue;
    }
    repairs.push({ kind: "raw-escape", detail: `\\${alphaRun(raw, i + 1) || n}` });
    out += "\\\\" + n;
    i++;
  }
  return { text: out, repairs };
}

/** Recursively repair control characters that are clearly swallowed LaTeX commands; report the rest. */
export function scanControlChars(value: unknown, pathPrefix = "$"): { value: unknown; repairs: ParseRepair[]; problems: ParseProblem[] } {
  const repairs: ParseRepair[] = [];
  const problems: ParseProblem[] = [];
  const walk = (v: unknown, p: string, key: string): unknown => {
    if (typeof v === "string") {
      const isLatex = key === "latex";
      const s = v.replace(/[\t\f\b\r\n]([A-Za-z]+)/g, (m, letters: string) => {
        const cmd = CONTROL_TO_LETTER[m[0]] + letters;
        if (COLLIDING_COMMANDS.has(cmd) && (isLatex || m[0] !== "\n")) {
          repairs.push({ kind: "control-char", detail: `${p}: \\${cmd}` });
          return "\\" + cmd;
        }
        return m;
      });
      const bad = isLatex ? /[\u0000-\u001f]/ : /[\u0000-\u0009\u000b-\u001f]/;
      if (bad.test(s)) {
        const code = s.match(bad)![0].charCodeAt(0);
        problems.push({ path: p, detail: `control character U+${code.toString(16).padStart(4, "0").toUpperCase()} in ${isLatex ? "latex field" : "text"}` });
      }
      return s;
    }
    if (Array.isArray(v)) return v.map((x, i) => walk(x, `${p}[${i}]`, key));
    if (v && typeof v === "object") {
      const o: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) o[k] = walk(x, `${p}.${k}`, k);
      return o;
    }
    return v;
  };
  return { value: walk(value, pathPrefix, ""), repairs, problems };
}

/** Find the outermost JSON object or array in model output (handles ```json fences and chatter). */
export function extractJsonText(text: string): string {
  const fence = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  const body = fence ? fence[1] : text;
  const start = body.search(/[[{]/);
  if (start < 0) throw new Error("no JSON object found in model output");
  const open = body[start];
  const close = open === "{" ? "}" : "]";
  const end = body.lastIndexOf(close);
  if (end <= start) throw new Error("unterminated JSON in model output");
  return body.slice(start, end + 1);
}

/** Parse LLM JSON output with LaTeX escape repair. Throws on unparseable text. */
export function safeParseJson(text: string): SafeParseResult {
  const raw = extractJsonText(text);
  const { text: fixed, repairs } = repairRawJsonEscapes(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(fixed);
  } catch (e) {
    throw new Error(`invalid JSON: ${(e as Error).message}`, { cause: e });
  }
  const scan = scanControlChars(parsed);
  return { value: scan.value, repairs: [...repairs, ...scan.repairs], problems: scan.problems };
}
