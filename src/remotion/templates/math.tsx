/* Math and data templates: formula_breakdown, worked_example, data_chart, stat_counter, table_compare. */
import React, { useMemo } from "react";
import type { FormulaBreakdownData, WorkedExampleData, DataChartData, StatCounterData, TableCompareData } from "./schemas";
import { Badge, Body, Card, Fit, Heading, Icon, Label, MathTex, Rich, formatNumber, revealStyle, useRc } from "../components/ui";
import { text } from "../mappers/guard";
import { chartViewModel } from "../mappers/normalize";
import { ui } from "../i18n";

const col = (gap: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", flexDirection: "column", gap, minHeight: 0, minWidth: 0, ...extra });
const row = (gap: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", flexDirection: "row", gap, minHeight: 0, minWidth: 0, ...extra });

export const FormulaBreakdown: React.FC<{ data: FormulaBreakdownData }> = ({ data }) => {
  const { theme, size } = useRc();
  const n = data.parts.length;
  const cols = size === "half" ? 2 : Math.min(n, 4);
  return (
    <div style={col(theme.space.gap, { height: "100%" })}>
      <div style={row(theme.space.gap, { alignItems: "center" })}>
        <Heading style={{ flex: "none", maxWidth: "34%" }}>{text(data.title, "data.title")}</Heading>
        <Fit id="formula" style={{ flex: 1, background: theme.colors.background, border: `2px solid ${theme.colors.gold}`, borderRadius: theme.radius.card, padding: size === "half" ? "16px 24px" : "26px 40px", display: "flex", justifyContent: "center" }}>
          <MathTex latex={data.formula.latex} size={size === "half" ? 48 : 76} color={theme.colors.text} />
        </Fit>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: "minmax(0, 1fr)", gap: 18, flex: 1, minHeight: 0 }}>
        {data.parts.map((p, i) => (
          <Card key={p.id} id={p.id} accent={theme.colors.teal} style={size === "half" ? undefined : { justifyContent: "center", gap: 16 }}>
            <div style={row(16, { alignItems: "center" })}>
              <MathTex latex={p.symbolLatex} size={size === "half" ? 44 : 64} color={theme.colors.gold} />
              <Label color={theme.colors.teal}>{text(p.unit, `data.parts[${i}].unit`)}</Label>
            </div>
            <Body size={size === "half" ? undefined : n <= 4 ? 30 : 27}>{text(p.meaning, `data.parts[${i}].meaning`)}</Body>
          </Card>
        ))}
      </div>
      {data.note ? (
        <Fit id="note" style={row(14, { alignItems: "center", flex: "none" })}>
          <Icon name="bulb" color={theme.colors.gold} size={32} />
          <Body color={theme.colors.textMuted}>
            <Rich value={data.note} path="data.note" />
          </Body>
        </Fit>
      ) : null}
    </div>
  );
};

export const WorkedExample: React.FC<{ data: WorkedExampleData }> = ({ data }) => {
  const { theme, reveal, lang, size } = useRc();
  const L = ui(lang);
  const half = size === "half";
  const manyGiven = data.given.length > 3;
  const manySteps = data.steps.length >= 3;
  return (
    <div style={{ display: "flex", flexDirection: half ? "column" : "row", gap: theme.space.gap, height: "100%" }}>
      <div style={col(manyGiven ? 12 : 18, { width: half ? "auto" : "38%", flex: half ? "none" : undefined, justifyContent: half ? "flex-start" : "center" })}>
        <Heading size={half ? 26 : manyGiven ? 28 : 32}>{text(data.title, "data.title")}</Heading>
        {data.formula ? (
          <Fit id="formula" style={{ flexShrink: 0, background: theme.colors.background, border: `2px solid ${theme.colors.gold}`, borderRadius: theme.radius.card, padding: manyGiven ? "10px 16px" : "14px 20px", display: "flex", justifyContent: "center" }}>
            <MathTex latex={data.formula.latex} size={half ? 40 : manyGiven ? 40 : 42} color={theme.colors.text} />
          </Fit>
        ) : null}
        {!half ? <Label color={theme.colors.teal}>{L.given}</Label> : null}
        <div style={{ display: "flex", flexDirection: half ? "row" : "column", gap: manyGiven ? 8 : 12 }}>
          {data.given.map((g, i) => (
            <Fit key={g.id} id={g.id} style={{ ...row(14, { alignItems: "center", background: theme.colors.panelRaised, borderRadius: 12, padding: half ? "10px 16px" : manyGiven ? "10px 14px" : "14px 18px", flex: half ? 1 : undefined }), ...revealStyle(reveal, g.id) }}>
              {g.symbol ? <MathTex latex={g.symbol} size={half ? 30 : manyGiven ? 28 : 34} color={theme.colors.gold} /> : null}
              <Body size={half ? 24 : manyGiven ? 24 : 27} color={theme.colors.textMuted}>
                {text(g.label, `data.given[${i}].label`)}
              </Body>
              <Body size={half ? 26 : manyGiven ? 26 : 30} style={{ fontWeight: 700, marginLeft: "auto" }}>
                {text(g.display, `data.given[${i}].display`)}
              </Body>
            </Fit>
          ))}
        </div>
      </div>
      <div style={col(manySteps ? 12 : 18, { flex: 1, justifyContent: half ? "flex-start" : "center" })}>
        {data.steps.map((s, i) => (
          <Fit key={s.id} id={s.id} style={{ ...row(18, { alignItems: "center", background: theme.colors.panelRaised, borderRadius: 12, padding: half ? "10px 18px" : manySteps ? "12px 20px" : "16px 22px", border: `2px solid ${reveal.focused(s.id) ? theme.colors.gold : "transparent"}` }), ...revealStyle(reveal, s.id) }}>
            <Badge color={theme.colors.blue} size={half ? 34 : manySteps ? 36 : 42}>
              {i + 1}
            </Badge>
            <Label color={theme.colors.blue} style={{ width: half ? 120 : 150, flex: "none" }}>
              {text(s.label, `data.steps[${i}].label`)}
            </Label>
            <MathTex latex={s.latex} size={half ? 32 : manySteps ? 36 : 40} color={theme.colors.text} />
          </Fit>
        ))}
        <Fit id={data.result.id} style={{ ...row(18, { alignItems: "center", background: theme.colors.background, border: `3px solid ${theme.colors.gold}`, borderRadius: theme.radius.card, padding: half ? "12px 20px" : manySteps ? "14px 22px" : "18px 24px" }), ...revealStyle(reveal, data.result.id) }}>
          <Icon name="check" color={theme.colors.gold} size={manySteps ? 32 : 36} />
          <Body color={theme.colors.textMuted} size={half ? undefined : manySteps ? 28 : 30}>{text(data.result.label, "data.result.label")}</Body>
          <div style={{ marginLeft: "auto", fontSize: half ? 44 : manySteps ? 48 : 56, fontWeight: 700, color: theme.colors.gold }}>{text(data.result.display, "data.result.display")}</div>
        </Fit>
        <Fit id="conclusion" style={{ ...row(14, { alignItems: "flex-start" }), ...revealStyle(reveal, "conclusion") }}>
          <Icon name="bulb" color={theme.colors.teal} size={30} style={{ marginTop: 2 }} />
          <Body size={half ? undefined : manySteps ? 26 : 29}>
            <Rich value={data.conclusion} path="data.conclusion" />
          </Body>
        </Fit>
      </div>
    </div>
  );
};

function ticks([lo, hi]: [number, number], count: number): number[] {
  const span = hi - lo;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) out.push(+v.toPrecision(12));
  return out;
}

function tickLabel(v: number, lang: string): string {
  const abs = Math.abs(v);
  const decimals = abs !== 0 && abs < 1 ? 2 : Number.isInteger(v) ? 0 : 1;
  return formatNumber(v, decimals, lang);
}

export const DataChart: React.FC<{ data: DataChartData }> = ({ data }) => {
  const { theme, reveal, lang, size } = useRc();
  const vm = useMemo(() => chartViewModel(data), [data]);
  const W = size === "half" ? 860 : 1360;
  const H = size === "half" ? 470 : 560;
  const m = { l: 120, r: 40, t: 24, b: 88 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const sx = (x: number) => m.l + ((x - vm.xDomain[0]) / (vm.xDomain[1] - vm.xDomain[0])) * pw;
  const sy = (y: number) => m.t + ph - ((y - vm.yDomain[0]) / (vm.yDomain[1] - vm.yDomain[0])) * ph;
  const xt = ticks(vm.xDomain, 6);
  const yt = ticks(vm.yDomain, 5);
  const barSeries = vm.series.length;
  return (
    <div style={row(theme.space.gap, { height: "100%" })}>
      <div style={col(10, { flex: "none" })}>
        <Heading size={size === "half" ? 26 : 30}>{text(data.title, "data.title")}</Heading>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
          {yt.map((v) => (
            <g key={`y${v}`}>
              <line x1={m.l} x2={W - m.r} y1={sy(v)} y2={sy(v)} stroke={theme.colors.border} strokeWidth={1.5} strokeDasharray="4 6" />
              <text x={m.l - 14} y={sy(v) + 7} textAnchor="end" fontSize={20} fill={theme.colors.textMuted}>
                {tickLabel(v, lang)}
              </text>
            </g>
          ))}
          {xt.map((v) => (
            <text key={`x${v}`} x={sx(v)} y={m.t + ph + 32} textAnchor="middle" fontSize={20} fill={theme.colors.textMuted}>
              {tickLabel(v, lang)}
            </text>
          ))}
          <line x1={m.l} x2={W - m.r} y1={m.t + ph} y2={m.t + ph} stroke={theme.colors.textMuted} strokeWidth={2} />
          <line x1={m.l} x2={m.l} y1={m.t} y2={m.t + ph} stroke={theme.colors.textMuted} strokeWidth={2} />
          <text x={m.l + pw / 2} y={H - 12} textAnchor="middle" fontSize={22} fontWeight={600} fill={theme.colors.text}>
            {`${text(data.xAxis.label, "data.xAxis.label")} (${text(data.xAxis.unit, "data.xAxis.unit")})`}
          </text>
          <text transform={`translate(26 ${m.t + ph / 2}) rotate(-90)`} textAnchor="middle" fontSize={22} fontWeight={600} fill={theme.colors.text}>
            {`${text(data.yAxis.label, "data.yAxis.label")} (${text(data.yAxis.unit, "data.yAxis.unit")})`}
          </text>
          {vm.series.map((s, si) => {
            const color = theme.colors[s.color];
            const a = reveal.amount(s.id);
            if (data.kind === "bar") {
              const bw = Math.max(6, (pw / (vm.xDomain[1] - vm.xDomain[0])) * 0.7) / barSeries;
              return (
                <g key={s.id} opacity={a}>
                  {s.points.map((p, i) => (
                    <rect key={i} x={sx(p.x) - (bw * barSeries) / 2 + si * bw} width={bw - 2} y={sy(Math.max(p.y, 0))} height={Math.abs(sy(p.y) - sy(0))} fill={color} rx={3} />
                  ))}
                </g>
              );
            }
            if (data.kind === "scatter" || data.kind === "candlestick") {
              return (
                <g key={s.id} opacity={a}>
                  {s.points.map((p, i) => (
                    <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={7} fill={color} />
                  ))}
                </g>
              );
            }
            const d = s.points.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");
            const area = `${d} L${sx(s.points[s.points.length - 1].x).toFixed(1)} ${sy(vm.yDomain[0]).toFixed(1)} L${sx(s.points[0].x).toFixed(1)} ${sy(vm.yDomain[0]).toFixed(1)} Z`;
            return (
              <g key={s.id} opacity={a > 0 ? 1 : 0}>
                {data.kind === "area" ? <path d={area} fill={color} opacity={0.22 * a} /> : null}
                <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
              </g>
            );
          })}
          {vm.markers.map((mk, i) => {
            const a = reveal.amount(mk.id);
            const x = sx(mk.x);
            const y = sy(mk.y);
            const label = text(mk.label, `data.markers[${i}].label`);
            const w = Math.min(420, 16 + label.length * 12.5);
            const left = x + w + 24 > W ? x - w - 18 : x + 18;
            return (
              <g key={mk.id} opacity={a}>
                <circle cx={x} cy={y} r={11} fill={theme.colors.background} stroke={theme.colors.gold} strokeWidth={4} />
                <rect x={left} y={y - 22} width={w} height={40} rx={8} fill={theme.colors.background} stroke={theme.colors.gold} strokeWidth={2} />
                <text x={left + w / 2} y={y + 6} textAnchor="middle" fontSize={21} fontWeight={600} fill={theme.colors.gold}>
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <Fit id="legend" style={col(16, { flex: 1, justifyContent: "center" })}>
        {vm.series.map((s, i) => (
          <div key={s.id} style={{ ...row(14, { alignItems: "center" }), ...revealStyle(reveal, s.id, 0) }}>
            <div style={{ width: 36, height: 8, borderRadius: 4, background: theme.colors[s.color], flex: "none" }} />
            <Body size={24}>{text(s.label, `data.series[${i}].label`)}</Body>
          </div>
        ))}
      </Fit>
    </div>
  );
};

export const StatCounter: React.FC<{ data: StatCounterData }> = ({ data }) => {
  const { theme, reveal, lang } = useRc();
  const accents = ["gold", "teal", "green", "blue"] as const;
  return (
    <div style={row(theme.space.gap, { height: "100%", alignItems: "stretch" })}>
      {data.stats.map((s, i) => {
        const color = theme.colors[accents[i % accents.length]];
        const a = reveal.amount(s.id);
        const shown = formatNumber(s.value * a, s.decimals, lang);
        const prefixStr = s.prefix ? text(s.prefix, `data.stats[${i}].prefix`) : "";
        const suffixStr = s.suffix ? text(s.suffix, `data.stats[${i}].suffix`) : "";
        const totalLen = prefixStr.length + shown.length + suffixStr.length;
        const baseSize = data.stats.length > 3 ? 56 : (data.stats.length === 3 ? 68 : 80);
        const numFontSize = totalLen > 15 ? 36 : totalLen > 11 ? 46 : totalLen > 7 ? 56 : baseSize;
        return (
          <Card key={s.id} id={s.id} accent={color} style={{ flex: 1, justifyContent: "center", alignItems: "center", textAlign: "center", gap: 16, padding: "20px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 6,
                maxWidth: "100%",
                color,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.15,
              }}
            >
              <span style={{ fontSize: numFontSize, fontWeight: 700, whiteSpace: "nowrap" }}>
                {prefixStr}
                {shown}
              </span>
              {suffixStr ? (
                <span
                  style={{
                    fontSize: suffixStr.length > 3 ? Math.max(22, Math.round(numFontSize * 0.55)) : numFontSize,
                    fontWeight: suffixStr.length > 3 ? 600 : 700,
                    whiteSpace: suffixStr.length > 8 ? "normal" : "nowrap",
                  }}
                >
                  {suffixStr}
                </span>
              ) : null}
            </div>
            <Body size={data.stats.length > 3 ? 24 : 26} style={{ fontWeight: 600, maxWidth: "100%", lineHeight: 1.3 }}>
              {text(s.label, `data.stats[${i}].label`)}
            </Body>
            {s.sublabel ? (
              <Body size={20} color={theme.colors.textMuted} style={{ maxWidth: "100%", lineHeight: 1.35 }}>
                {text(s.sublabel, `data.stats[${i}].sublabel`)}
              </Body>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
};

export const TableCompare: React.FC<{ data: TableCompareData }> = ({ data }) => {
  const { theme, reveal, size } = useRc();
  const cols = data.columns.length;
  const grid = `minmax(0, 1.1fr) repeat(${cols - 1}, minmax(0, 1fr))`;
  const full = size === "full";
  return (
    <Fit id="table" style={col(10, { height: "100%", justifyContent: "center" })}>
      <div style={{ display: "grid", gridTemplateColumns: grid, gap: 10, flex: "none" }}>
        {data.columns.map((c, i) => (
          <div key={i} style={{ padding: "14px 18px", background: theme.colors.background, borderRadius: 10, borderBottom: `4px solid ${theme.colors.gold}` }}>
            <Label color={theme.colors.gold} style={full ? { fontSize: 23 } : undefined}>
              {text(c, `data.columns[${i}]`)}
            </Label>
          </div>
        ))}
      </div>
      {data.rows.map((r, ri) => {
        const hl = r.id === data.highlightRowId || reveal.focused(r.id);
        return (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: grid, gap: 10, flex: "1 1 0", minHeight: 0, maxHeight: full ? 112 : 84, ...revealStyle(reveal, r.id) }}>
            {r.cells.slice(0, cols).map((cell, ci) => (
              <Fit
                key={ci}
                id={`${r.id}-${ci}`}
                style={{ display: "flex", alignItems: "center", padding: "10px 18px", background: hl ? `${theme.colors.gold}22` : theme.colors.panelRaised, border: `2px solid ${hl ? theme.colors.gold : "transparent"}`, borderRadius: 10 }}
              >
                <Body size={full ? (ci === 0 ? 31 : 29) : ci === 0 ? 26 : 24} style={{ fontWeight: ci === 0 || hl ? 700 : 400 }}>
                  {text(cell, `data.rows[${ri}].cells[${ci}]`)}
                </Body>
              </Fit>
            ))}
          </div>
        );
      })}
    </Fit>
  );
};
