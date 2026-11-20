/* Term detector (check P-03, docs/standards/JIT_CONCEPT_CLARIFICATION.md). */

export type TermKind = "acronym" | "domain" | "glossary" | "symbol" | "newTerm";

export interface DetectedTerm {
  term: string;
  kind: TermKind;
  index: number;
}

export interface TermDetectorOptions {
  domainTerms?: string[];
  glossary?: string[];
  /** Formula symbols of this part (e.g. "APR", "S_T"); matched case-sensitively as standalone tokens. */
  symbols?: string[];
  newTerms?: string[];
  ignore?: string[];
}

export const ACRONYM_RE = /\b[A-Z]{2,6}s?\b/g;

/** Everyday all-caps words that are not technical acronyms. */
export const EVERYDAY_ACRONYMS: ReadonlySet<string> = new Set(["OK", "TV", "AM", "PM", "USA", "UK", "US", "FAQ", "PS", "AD", "BC", "CEO"]);
const ROMAN = /^(?=[IVXLCDM]+$)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const SINGLE_LETTER_WORDS = new Set(["a", "A", "I"]);

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-word, script-aware matcher (works for Devanagari, where \b does not). */
export function wordPattern(term: string, flags = "giu"): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}\\p{M}_'’])${escapeRe(term)}(?![\\p{L}\\p{N}\\p{M}_'’])`, flags);
}

export function normalizeAcronym(t: string): string {
  return /^[A-Z]{2,6}s$/.test(t) ? t.slice(0, -1) : t;
}

export function isIgnorableAcronym(t: string, ignore: ReadonlySet<string> = new Set()): boolean {
  const n = normalizeAcronym(t);
  return EVERYDAY_ACRONYMS.has(n) || ignore.has(n) || ROMAN.test(n);
}

/** Find every term in a text, in order of first appearance; each distinct term is reported once. */
export function detectTerms(text: string, opts: TermDetectorOptions = {}): DetectedTerm[] {
  const ignore = new Set(opts.ignore ?? []);
  const hits: DetectedTerm[] = [];
  const seen = new Set<string>();
  const add = (term: string, kind: TermKind, index: number) => {
    const key = term.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    hits.push({ term, kind, index });
  };
  const listMatch = (list: string[] | undefined, kind: TermKind, caseSensitive: boolean) => {
    for (const t of list ?? []) {
      if (!t.trim() || (kind === "symbol" && SINGLE_LETTER_WORDS.has(t))) continue;
      const m = wordPattern(t, caseSensitive ? "u" : "iu").exec(text);
      if (m) add(t, kind, m.index);
    }
  };
  listMatch(opts.newTerms, "newTerm", false);
  listMatch(opts.glossary, "glossary", false);
  listMatch(opts.domainTerms, "domain", false);
  listMatch(opts.symbols, "symbol", true);
  for (const m of text.matchAll(ACRONYM_RE)) {
    const t = normalizeAcronym(m[0]);
    if (!isIgnorableAcronym(t, ignore)) add(t, "acronym", m.index ?? 0);
  }
  return hits.sort((a, b) => a.index - b.index);
}
