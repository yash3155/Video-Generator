/** Plain-text view of a RichText value (string or text/math segments). Math segments become their LaTeX source in brackets only when asked. */
export function richTextToPlain(value: unknown, opts: { includeMath?: boolean } = {}): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value
    .map((seg) => {
      if (!seg || typeof seg !== "object") return "";
      const s = seg as { type?: string; text?: string; latex?: string };
      if (s.type === "text") return s.text ?? "";
      if (s.type === "math") return opts.includeMath ? (s.latex ?? "") : "";
      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every human-readable string in a JSON value, skipping keys that are ids or machine values. */
export function collectDisplayStrings(value: unknown, skipKeys: ReadonlySet<string> = NON_DISPLAY_KEYS): string[] {
  const out: string[] = [];
  const walk = (v: unknown, key: string) => {
    if (skipKeys.has(key)) return;
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) walk(x, k);
  };
  walk(value, "");
  return out;
}

/** Keys whose values are identifiers, enums or machine expressions, never shown as text on screen. */
export const NON_DISPLAY_KEYS: ReadonlySet<string> = new Set([
  "id",
  "target",
  "template",
  "kind",
  "role",
  "tone",
  "color",
  "mode",
  "speaker",
  "status",
  "from",
  "to",
  "expression",
  "expr",
  "variable",
  "symbol",
  "solvesFor",
  "phase",
  "focus",
  "show",
  "highlightRowId",
  "arrangement",
  "presentation",
  "type",
  "generator",
  "scope",
  "icon",
  "anchor",
]);
