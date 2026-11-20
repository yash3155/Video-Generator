import { RESEARCH_HEADER_RE, RESEARCH_TEMPLATE_MARKER, REQUIRED_RESEARCH_SECTIONS, ResearchHeader } from "../schemas/research";
import { sha256 } from "../core/fsutil";

export interface ParsedResearch {
  header: ResearchHeader | null;
  headerError?: string;
  body: string;
}

/** Split a notebook_context.md into its JSON header comment and the Markdown body (LF-normalized). */
export function parseResearch(text: string): ParsedResearch {
  const norm = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const m = norm.match(RESEARCH_HEADER_RE);
  if (!m || m.index === undefined) return { header: null, body: norm.trim() + "\n" };
  const body = (norm.slice(0, m.index) + norm.slice(m.index + m[0].length)).trim() + "\n";
  try {
    const parsed = ResearchHeader.safeParse(JSON.parse(m[1]));
    if (!parsed.success) return { header: null, headerError: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "), body };
    return { header: parsed.data, body };
  } catch (e) {
    return { header: null, headerError: `header JSON invalid: ${(e as Error).message}`, body };
  }
}

export function bodyHash(body: string): string {
  return sha256(body.replace(/\r\n/g, "\n").trim() + "\n");
}

/** Serialize a header + body back to notebook_context.md text. */
export function formatResearch(header: Omit<ResearchHeader, "sha256">, body: string): string {
  const full: ResearchHeader = { ...header, sha256: bodyHash(body) } as ResearchHeader;
  return `<!-- OPENLECTERN-RESEARCH ${JSON.stringify(full)} -->\n\n${body.replace(/\r\n/g, "\n").trim()}\n`;
}

export interface GateResult {
  ok: boolean;
  problems: string[];
  stats: { chars: number; citations: number; factLines: number; sections: string[] };
}

const CITATION_RE = /\b(?:p|pp)\.\s*\d+|\bpage\s+\d+|\u00a7\s*\d+/gi;
export const MIN_BODY_CHARS = 1500;
export const MIN_CITATIONS = 10;
export const MIN_FACT_LINES = 10;

function sectionText(body: string, name: string): string | null {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => /^#{1,4}\s/.test(l) && l.toLowerCase().includes(name.toLowerCase()));
  if (start < 0) return null;
  const level = (lines[start].match(/^#+/) as RegExpMatchArray)[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const h = lines[i].match(/^(#+)\s/);
    if (h && h[1].length <= level) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n");
}

/** S1 gate: the research file is filled in (not the template), long enough, cited, and has the required sections. */
export function gateResearch(text: string): GateResult {
  const problems: string[] = [];
  if (text.includes(RESEARCH_TEMPLATE_MARKER)) problems.push("the file is still the unfilled template; paste the NotebookLM answer below the header");
  const parsed = parseResearch(text);
  if (parsed.headerError) problems.push(`invalid OPENLECTERN-RESEARCH header: ${parsed.headerError}`);
  if (parsed.header && parsed.header.connector !== "manual" && parsed.header.sha256 !== bodyHash(parsed.body)) {
    problems.push("header sha256 does not match the body (the file was edited after capture; run `openlectern research:stamp <file>`)");
  }
  const body = parsed.body;
  const chars = body.trim().length;
  if (chars < MIN_BODY_CHARS) problems.push(`body is too short (${chars} chars, need >= ${MIN_BODY_CHARS})`);
  const citations = (body.match(CITATION_RE) || []).length;
  if (citations < MIN_CITATIONS) problems.push(`only ${citations} page/section citations (need >= ${MIN_CITATIONS})`);
  const sections: string[] = [];
  for (const s of REQUIRED_RESEARCH_SECTIONS) {
    if (sectionText(body, s) === null) problems.push(`missing section "${s}"`);
    else sections.push(s);
  }
  const ledger = sectionText(body, "Fact ledger") ?? "";
  const factLines = ledger.split("\n").filter((l) => /^\s*(?:[-*]|\d+[.)])\s+\S/.test(l)).length;
  if (factLines < MIN_FACT_LINES) problems.push(`fact ledger lists ${factLines} items (need >= ${MIN_FACT_LINES})`);
  return { ok: problems.length === 0, problems, stats: { chars, citations, factLines, sections } };
}
