/* KaTeX compile of every formula in strict mode (check C-12). */
import katex from "katex";
import { finding, type QaFinding, type FindingContext } from "../qa/finding";
import { isLatexKey } from "./latex-sanitize";

export type CompileResult = { ok: true; html: string } | { ok: false; error: string };

const cache = new Map<string, CompileResult>();

export function compileLatex(latex: string, opts: { displayMode?: boolean } = {}): CompileResult {
  const key = `${opts.displayMode ? "D" : "I"}:${latex}`;
  const hit = cache.get(key);
  if (hit) return hit;
  let res: CompileResult;
  try {
    const html = katex.renderToString(latex, { throwOnError: true, strict: "error", displayMode: !!opts.displayMode, output: "html", trust: false });
    res = { ok: true, html };
  } catch (e) {
    res = { ok: false, error: (e as Error).message.replace(/\s+/g, " ").trim() };
  }
  if (cache.size > 5000) cache.clear();
  cache.set(key, res);
  return res;
}

export interface LatexRef {
  path: string;
  latex: string;
}

/** All LaTeX sources in a JSON value: `latex`/`symbolLatex` fields (Formula, steps, math segments). */
export function collectLatex(value: unknown, pathPrefix = "$"): LatexRef[] {
  const out: LatexRef[] = [];
  const walk = (v: unknown, p: string, key: string) => {
    if (typeof v === "string") {
      if (isLatexKey(key)) out.push({ path: p, latex: v });
      return;
    }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) walk(x, `${p}.${k}`, k);
  };
  walk(value, pathPrefix, "");
  return out;
}

export function checkKatex(value: unknown, pathPrefix = "$", ctx: FindingContext = {}): QaFinding[] {
  const out: QaFinding[] = [];
  for (const ref of collectLatex(value, pathPrefix)) {
    const r = compileLatex(ref.latex);
    if (!r.ok)
      out.push(
        finding(
          "C-12",
          "BLOCKER",
          `${ref.path}: KaTeX cannot compile "${ref.latex.slice(0, 60)}": ${r.error}`,
          "The formula is not valid LaTeX under KaTeX strict mode, so it would render as an error or raw text.",
          "Fix the LaTeX source (balanced braces, known commands, no $ delimiters) and re-run the episode fill stage.",
          ctx,
        ),
      );
  }
  return out;
}
