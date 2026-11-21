/* Pure mappers from raw template data to typed, render-ready view-models (E.5). Used in Node (pre-render validation) and in the browser. */
import { TEMPLATE_DATA_SCHEMAS, type TemplateId, type DataChartData, type RichText } from "../templates/schemas";
import { generateSeries } from "../../math/recompute";
import { assertRenderable, RenderDataError } from "./guard";

export type TemplateDataOf<T extends TemplateId> = ReturnType<(typeof TEMPLATE_DATA_SCHEMAS)[T]["parse"]>;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const slug = (s: string, i: number) => `${s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "item"}-${i + 1}`;

/** "3. Compound: interest on interest" -> { title: "Compound", text: "interest on interest" } */
export function parseNumberedLine(line: string): { title: string; text: string } {
  const m = /^\s*(?:\d+[.)]\s*)?([^:]{1,60}):\s*(.+)$/.exec(line);
  if (m) return { title: m[1].trim(), text: m[2].trim() };
  const body = line.replace(/^\s*\d+[.)]\s*/, "").trim();
  return { title: body.split(/\s+/).slice(0, 4).join(" "), text: body };
}

/** Accept the polymorphic shapes models produce and convert them to the schema shape before validation. */
export function coerceTemplateData(template: TemplateId, raw: unknown): unknown {
  if (!isObj(raw)) return raw;
  const d: Record<string, unknown> = { ...raw };
  switch (template) {
    case "summary_thread":
      if (Array.isArray(d.rules)) d.rules = d.rules.map((r, i) => (typeof r === "string" ? { id: `rule-${i + 1}`, ...parseNumberedLine(r) } : r));
      break;
    case "chat_story":
    case "technical_panel":
      if (Array.isArray(d.messages))
        d.messages = d.messages.map((m, i) => {
          if (typeof m !== "string") return m;
          const mm = /^\s*(novice|mentor|instructor|narrator)\s*:\s*(.+)$/i.exec(m);
          return { id: `m${i + 1}`, speaker: (mm?.[1].toLowerCase() ?? (i % 2 ? "mentor" : "novice")) as string, text: mm ? mm[2] : m };
        });
      break;
    case "progressive_cards":
      if (Array.isArray(d.cards)) d.cards = d.cards.map((c, i) => (typeof c === "string" ? { id: slug("card", i), ...(({ title, text }) => ({ title, body: text }))(parseNumberedLine(c)) } : c));
      break;
    case "causal_chain":
      if (Array.isArray(d.links)) {
        const roles = ["condition", "action", "mechanism", "result", "consequence"];
        d.links = d.links.map((l, i) => (typeof l === "string" ? { id: `link-${i + 1}`, role: roles[i] ?? "consequence", text: l } : l));
      }
      break;
    case "composite_layout":
      if (Array.isArray(d.panels)) d.panels = d.panels.map((p) => (isObj(p) && typeof p.template === "string" ? { ...p, data: coerceTemplateData(p.template as TemplateId, p.data) } : p));
      break;
    default:
      break;
  }
  return d;
}

export interface ResolvedSeries {
  id: string;
  label: string;
  color: DataChartData["series"][number]["color"];
  points: { x: number; y: number }[];
}

export interface ChartViewModel extends Omit<DataChartData, "series"> {
  series: ResolvedSeries[];
  xDomain: [number, number];
  yDomain: [number, number];
}

function niceDomain(min: number, max: number, zero: boolean): [number, number] {
  let lo = zero ? Math.min(0, min) : min;
  let hi = max;
  if (hi === lo) hi = lo + 1;
  const span = hi - lo;
  const step = 10 ** Math.floor(Math.log10(span / 5));
  const unit = [1, 2, 2.5, 5, 10].map((m) => m * step).find((u) => span / u <= 6) ?? step * 10;
  lo = Math.floor(lo / unit) * unit;
  hi = Math.ceil(hi / unit) * unit;
  return [lo, hi];
}

/** Chart curves are computed from the formula generator, never hand-typed (E.4). */
export function chartViewModel(data: DataChartData): ChartViewModel {
  const series = data.series.map((s, i) => {
    const points = s.points?.length ? s.points : s.generator ? generateSeries(s.generator) : [];
    if (!points.length) throw new RenderDataError(`chart series ${s.id} has no points and no generator`, `data.series[${i}]`);
    return { id: s.id, label: s.label, color: s.color, points };
  });
  const xs = [...series.flatMap((s) => s.points.map((p) => p.x)), ...data.markers.map((m) => m.x)];
  const ys = [...series.flatMap((s) => s.points.map((p) => p.y)), ...data.markers.map((m) => m.y)];
  const xDomain: [number, number] = [Math.min(...xs), Math.max(...xs)];
  if (xDomain[0] === xDomain[1]) xDomain[1] += 1;
  return { ...data, series, xDomain: data.kind === "bar" ? [xDomain[0] - 0.5, xDomain[1] + 0.5] : xDomain, yDomain: niceDomain(Math.min(...ys), Math.max(...ys), data.kind !== "scatter") };
}

/** Coerce, validate and guard one template's data. Throws RenderDataError (or a ZodError) with the offending path. */
export function normalizeTemplateData<T extends TemplateId>(template: T, raw: unknown): TemplateDataOf<T> {
  const schema = TEMPLATE_DATA_SCHEMAS[template];
  if (!schema) throw new RenderDataError(`unknown template "${String(template)}"`, "template");
  assertRenderable(raw);
  const parsed = schema.parse(coerceTemplateData(template, raw)) as TemplateDataOf<T>;
  assertRenderable(parsed);
  if (template === "data_chart") chartViewModel(parsed as DataChartData);
  return parsed;
}

/** Plain text of a RichText value (for measuring and alt text); math segments keep their LaTeX. */
export function richPlain(v: RichText): string {
  return typeof v === "string" ? v : v.map((s) => (s.type === "text" ? s.text : s.latex)).join("");
}

/** Count words a learner reads on the main panel (E.4 density cap of about 45 words). */
export function countPanelWords(value: unknown): number {
  let n = 0;
  const walk = (v: unknown, key: string) => {
    if (typeof v === "string") {
      if (["id", "template", "kind", "role", "tone", "color", "mode", "speaker", "status", "arrangement", "type", "expression", "expr", "variable", "latex", "symbolLatex", "solvesFor"].includes(key)) return;
      n += v.split(/\s+/).filter(Boolean).length;
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
    else if (isObj(v)) for (const [k, x] of Object.entries(v)) if (k !== "generator") walk(x, k);
  };
  walk(value, "");
  return n;
}
