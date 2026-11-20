/* Number extraction and comparison for six-way agreement and narration/visual checks. */

export interface FoundNumber {
  raw: string;
  value: number;
  /** Digits after the decimal point as written (display precision). */
  decimals: number;
  percent: boolean;
  index: number;
}

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

export function normalizeDigits(text: string): string {
  return text.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d))).replace(/\u2212/g, "-");
}

/**
 * Numbers written with digits: 1,210.50 / 1,00,000 / 5% / -3.2 / $1,157.63. Years and plain integers are
 * included; callers decide which ones matter.
 */
export function extractNumbers(text: string): FoundNumber[] {
  const s = normalizeDigits(text);
  const out: FoundNumber[] = [];
  const re = /(^|[^\w.])(-?)(\d{1,3}(?:,\d{2,3})+|\d+)(\.\d+)?(\s?%)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const intPart = m[3].replace(/,/g, "");
    const frac = m[4] ?? "";
    const value = Number(`${m[2]}${intPart}${frac}`);
    if (!Number.isFinite(value)) continue;
    out.push({ raw: m[0].slice(m[1].length), value, decimals: frac ? frac.length - 1 : 0, percent: !!m[5], index: m.index + m[1].length });
  }
  return out;
}

/** Tolerance for "equal within declared rounding": the coarser of the declared rounding and the written precision. */
export function tolerance(rounding: number, writtenDecimals = rounding): number {
  const r = Math.min(rounding, writtenDecimals);
  return 0.5 * Math.pow(10, -r) + 1e-9;
}

export function approxEqual(a: number, b: number, rounding = 2, writtenDecimals = rounding): boolean {
  const tol = tolerance(rounding, writtenDecimals);
  return Math.abs(a - b) <= tol + 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
}

/** Does a written number denote `target`? Percent signs match both 5 and 0.05. */
export function numberMatches(n: FoundNumber, target: number, rounding = 2): boolean {
  if (approxEqual(n.value, target, rounding, n.decimals)) return true;
  if (n.percent && approxEqual(n.value / 100, target, rounding + 2, n.decimals + 2)) return true;
  if (!n.percent && Math.abs(target) < 1 && approxEqual(n.value, target * 100, rounding, n.decimals)) return true;
  return false;
}

export function textMentionsNumber(text: string, target: number, rounding = 2): boolean {
  return extractNumbers(text).some((n) => numberMatches(n, target, rounding));
}

/** A written number that is close to the target (within 25%) but does not match it: a likely typo or stale value. */
export function nearMisses(text: string, target: number, rounding = 2): FoundNumber[] {
  if (target === 0) return [];
  return extractNumbers(text).filter((n) => {
    if (numberMatches(n, target, rounding)) return false;
    const v = n.percent && Math.abs(target) < 1 ? n.value / 100 : n.value;
    const rel = Math.abs(v - target) / Math.abs(target);
    return rel > 0 && rel < 0.25;
  });
}

export function roundTo(v: number, digits: number): number {
  const f = Math.pow(10, digits);
  return Math.round(v * f) / f;
}
