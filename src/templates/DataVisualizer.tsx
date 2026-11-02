// src/templates/DataVisualizer.tsx
import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { Scene, Beat, DataVisualizerUI, SideCard, CardState, ChartSpec } from '../types';
import { getLatestCue, getActiveCues } from '../utils/cueUtils';
import {
  FINANCE_CHART_PRESETS,
  PresetChartData,
  CandlestickPoint,
  TelemetryPoint,
} from '../domain/finance/financePresets';

interface DataVisualizerProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

const isPrefixUnit = (unit?: string) => (unit ? /^[₹$€£¥]/.test(unit.trim()) : false);
const formatUnitValue = (val: number | string, unit?: string) => {
  if (!unit) return `${val}`;
  const cleanUnit = unit.trim();
  return isPrefixUnit(cleanUnit) ? `${cleanUnit}${val}` : `${val} ${cleanUnit}`;
};

const sideCardStyles: Record<
  string,
  { border: string; bg: string; titleColor: string; subtitleColor: string }
> = {
  active_red: {
    border: 'border-[#EF4444] border-2 shadow-[0_4px_16px_rgba(239,68,68,0.12)]',
    bg: 'bg-[#FEF2F2]',
    titleColor: 'text-[#991B1B]',
    subtitleColor: 'text-[#B91C1C]',
  },
  active_blue: {
    border: 'border-[#3B82F6] border-2 shadow-[0_4px_16px_rgba(59,130,246,0.12)]',
    bg: 'bg-[#EFF6FF]',
    titleColor: 'text-[#1E40AF]',
    subtitleColor: 'text-[#2563EB]',
  },
  active_green: {
    border: 'border-[#10B981] border-2 shadow-[0_4px_16px_rgba(16,185,129,0.12)]',
    bg: 'bg-[#F0FDF4]',
    titleColor: 'text-[#166534]',
    subtitleColor: 'text-[#059669]',
  },
  active_teal: {
    border: 'border-[#0D9488] border-2 shadow-[0_4px_16px_rgba(13,148,136,0.12)]',
    bg: 'bg-[#F0FDFA]',
    titleColor: 'text-[#115E59]',
    subtitleColor: 'text-[#0F766E]',
  },
  active_amber: {
    border: 'border-[#F59E0B] border-2 shadow-[0_4px_16px_rgba(245,158,11,0.12)]',
    bg: 'bg-[#FFFBEB]',
    titleColor: 'text-[#92400E]',
    subtitleColor: 'text-[#D97706]',
  },
  active_purple: {
    border: 'border-[#8B5CF6] border-2 shadow-[0_4px_16px_rgba(139,92,246,0.12)]',
    bg: 'bg-[#FAF5FF]',
    titleColor: 'text-[#6B21A8]',
    subtitleColor: 'text-[#7C3AED]',
  },
  muted: {
    border: 'border-[#E5E7EB]',
    bg: 'bg-[#FAFAF9]',
    titleColor: 'text-[#4B5563]',
    subtitleColor: 'text-[#6B7280]',
  },
  default: {
    border: 'border-[#E5E7EB]',
    bg: 'bg-white',
    titleColor: 'text-[#1F2937]',
    subtitleColor: 'text-[#6B7280]',
  },
};

function normalizeSideCardState(rawState?: string, idx = 0): CardState {
  if (!rawState) return 'active_amber';
  if (sideCardStyles[rawState]) return rawState as CardState;
  const s = rawState.toLowerCase();
  if (s === 'warning' || s === 'amber') return 'active_amber';
  if (s === 'danger' || s === 'error' || s === 'red') return 'active_red';
  if (s === 'teal' || s === 'active_teal') return 'active_teal';
  if (s === 'green' || s === 'success') return 'active_green';
  if (s === 'purple') return 'active_purple';
  if (s === 'visible' || s === 'inactive') return 'muted';
  if (s === 'active') {
    const cycle: CardState[] = ['active_blue', 'active_teal', 'active_amber', 'active_purple'];
    return cycle[idx % cycle.length];
  }
  return 'default';
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({
  scene,
  beat,
  beatIndexInScene = 0,
  beatFrame = 0,
  beatDuration = 180,
  allBeatsInScene = [],
}) => {
  const { fps } = useVideoConfig();
  const uiState: DataVisualizerUI = beat.ui_state || {
    chartTitle: 'Telemetry Chart',
    preset: 'uptrend_then_drop',
  };

  const visualChart: ChartSpec | undefined =
    beat.visual?.kind === 'chart' ? (beat.visual.data as ChartSpec) : undefined;

  let presetData: PresetChartData;
  let yUnit = '';
  let chartTitle = uiState.chartTitle || scene.title || 'Data Visualizer';
  let chartSubtitle = uiState.chartSubtitle;

  if (visualChart) {
    chartTitle = visualChart.title || chartTitle;
    chartSubtitle = visualChart.subtitle || chartSubtitle;
    yUnit = visualChart.yAxis?.unit ?? (uiState.yAxisUnit || '');

    const firstSeries = visualChart.series[0];
    const isCandle = visualChart.chartType === 'candlestick';

    if (isCandle && firstSeries) {
      const candles: CandlestickPoint[] = firstSeries.data.map((d, idx) => ({
        open: d.open ?? d.y,
        high: d.high ?? d.y,
        low: d.low ?? d.y,
        close: d.close ?? d.y,
        volume: 100,
        label: typeof d.x === 'string' ? d.x : d.label || `P${idx + 1}`,
      }));
      const minVal = visualChart.yAxis?.min ?? Math.min(...candles.map((c) => c.low)) * 0.95;
      const maxVal = visualChart.yAxis?.max ?? Math.max(...candles.map((c) => c.high)) * 1.05;
      presetData = {
        type: 'candlestick',
        unit: yUnit,
        minY: Math.floor(minVal),
        maxY: Math.ceil(maxVal),
        candlesticks: candles,
      };
    } else if (firstSeries) {
      const points: TelemetryPoint[] = firstSeries.data.map((d) => ({
        value: d.y,
        xLabel: typeof d.x === 'string' ? d.x : d.label || `${d.x}`,
      }));
      const minVal = visualChart.yAxis?.min ?? Math.min(...points.map((p) => p.value)) * 0.95;
      const maxVal = visualChart.yAxis?.max ?? Math.max(...points.map((p) => p.value)) * 1.05;
      presetData = {
        type: 'line',
        unit: yUnit,
        minY: Math.floor(minVal),
        maxY: Math.ceil(maxVal),
        points,
      };
    } else {
      presetData = {
        type: 'line',
        unit: yUnit,
        minY: 0,
        maxY: 100,
        points: [],
      };
    }
  } else {
    // Pure structured preset lookup without narration text scraping
    const presetName = uiState.preset || 'uptrend_then_drop';
    const fallbackPreset =
      FINANCE_CHART_PRESETS[presetName] || FINANCE_CHART_PRESETS.uptrend_then_drop;
    yUnit = uiState.yAxisUnit || fallbackPreset.unit || '₹';
    presetData = fallbackPreset;
  }

  const totalSteps = uiState.totalSteps || 3;
  const currentStep =
    uiState.progressStep !== undefined ? uiState.progressStep : totalSteps;

  let prevStep = 0;
  if (beatIndexInScene > 0 && allBeatsInScene[beatIndexInScene - 1]) {
    const prevUI = allBeatsInScene[beatIndexInScene - 1].ui_state;
    if (prevUI && prevUI.progressStep !== undefined) {
      prevStep = prevUI.progressStep;
    }
  }

  // Only show LEFT SHOULDER / HEAD / RIGHT SHOULDER badges if the scene is actually teaching Head & Shoulders!
  const isActualHeadAndShoulders =
    (uiState.preset === 'head_and_shoulders' || visualChart?.chartType === 'candlestick') &&
    /head\s*(?:&|and)\s*shoulders/i.test(
      `${scene?.title || ''} ${chartTitle || ''} ${chartSubtitle || ''}`
    );

  // Chart layout dimensions
  const svgW = 1100;
  const svgH = 580;
  const padLeft = 70;
  const padRight = 110;
  const padTop = 65;
  const padBottom = 115;
  const plotW = svgW - padLeft - padRight;
  const plotH = svgH - padTop - padBottom;

  const minY = presetData.minY;
  const maxY = presetData.maxY;
  const rangeY = maxY - minY || 1;

  const getYPos = (val: number) => {
    return padTop + plotH - ((val - minY) / rangeY) * plotH;
  };

  const gridSteps = 4;
  const gridLines = Array.from({ length: gridSteps + 1 }).map((_, i) => {
    const val = Math.round(minY + (rangeY / gridSteps) * i);
    const y = getYPos(val);
    return { val, y };
  });

  const allCandles = presetData.candlesticks || [];
  const totalCandles = allCandles.length;

  const revealDuration = Math.max(15, Math.round(beatDuration * 0.7));
  const prevCandleTarget = Math.round((prevStep / totalSteps) * totalCandles);

  // Phase 2B: Visual cue-driven progress step
  const stepCue = getLatestCue(beat, 'progressStep', beatFrame, fps);
  const effectiveCurrentStep =
    stepCue && stepCue.payload !== undefined
      ? Number(stepCue.payload)
      : currentStep;

  const currentCandleTarget = Math.max(
    1,
    Math.round((effectiveCurrentStep / totalSteps) * totalCandles)
  );

  let animatedCandleCount: number;
  if (stepCue) {
    // Cue-driven: crisp 10-frame transition from cue trigger timestamp
    const cueFrame = Math.round((stepCue.atMs / 1000) * fps);
    if (beatFrame < cueFrame) {
      animatedCandleCount = prevCandleTarget;
    } else {
      const progress = Math.min(1, Math.max(0, (beatFrame - cueFrame) / 10));
      animatedCandleCount = Math.round(
        prevCandleTarget + (currentCandleTarget - prevCandleTarget) * progress
      );
    }
  } else {
    // Fallback when no visualCues provided (legacy backward compatibility)
    const revealDuration = Math.max(15, Math.round(beatDuration * 0.7));
    animatedCandleCount =
      beatIndexInScene === 0
        ? Math.round(
          interpolate(beatFrame, [0, revealDuration], [1, currentCandleTarget], {
            extrapolateRight: 'clamp',
          })
        )
        : Math.round(
          interpolate(
            beatFrame,
            [0, revealDuration],
            [prevCandleTarget, currentCandleTarget],
            { extrapolateRight: 'clamp' }
          )
        );
  }

  const visibleCandles = allCandles.slice(0, animatedCandleCount);
  const slotW = totalCandles > 0 ? plotW / totalCandles : 1;
  const candleBodyW = Math.max(6, slotW * 0.65);

  const latestCandle =
    visibleCandles.length > 0
      ? visibleCandles[visibleCandles.length - 1]
      : allCandles[0];

  const latestCandleIdx = visibleCandles.length - 1;
  const latestCx = padLeft + latestCandleIdx * slotW + slotW / 2;
  const latestCloseY = latestCandle ? getYPos(latestCandle.close) : padTop;
  const isLatestGreen = latestCandle ? latestCandle.close >= latestCandle.open : true;
  const livePriceColor = isLatestGreen ? '#16A34A' : '#DC2626';

  // Auto-inject support trendline if preset is 'uptrend_break' and overlays were omitted by LLM
  const effectiveOverlays =
    uiState.overlays && uiState.overlays.length > 0
      ? uiState.overlays
      : uiState.preset === 'uptrend_break'
        ? [{ type: 'trendline' as const, startIndex: 2, endIndex: 15, color: 'green' as const }]
        : [];

  // Accumulate Side Cards Across Beats within this Scene
  const accumulatedSideCards: SideCard[] = [];
  const seenCardTitles = new Set<string>();

  const beatsToScan =
    allBeatsInScene.length > 0
      ? allBeatsInScene.slice(0, beatIndexInScene + 1)
      : [beat];

  beatsToScan.forEach((b, bIdx) => {
    const isCurrentBeat = bIdx === beatIndexInScene;
    const cards = (b.ui_state as DataVisualizerUI)?.sideCards || [];
    cards.forEach((c, cIdx) => {
      const normalizedActive = normalizeSideCardState(c.state, bIdx + cIdx);
      if (!seenCardTitles.has(c.title)) {
        seenCardTitles.add(c.title);
        accumulatedSideCards.push({
          title: c.title,
          subtitle: c.subtitle,
          state: isCurrentBeat ? normalizedActive : 'muted',
        });
      } else {
        const existingIdx = accumulatedSideCards.findIndex((x) => x.title === c.title);
        if (existingIdx !== -1) {
          accumulatedSideCards[existingIdx] = {
            title: c.title,
            subtitle: c.subtitle,
            state: isCurrentBeat ? normalizedActive : 'muted',
          };
        }
      }
    });
  });

  const displaySideCards = accumulatedSideCards.slice(-5);

  const placedPills: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    anchorX: number;
    isBottom: boolean;
  }> = [];

  return (
    <div className="w-full h-full flex items-center justify-between gap-8 relative z-10">
      {/* LEFT 68%: Deterministic SVG Chart Canvas */}
      <div className="w-[68%] h-full flex flex-col justify-between bg-[#FCFCFA] rounded-2xl border border-[#ECEAE3] p-4 shadow-sm relative overflow-hidden">
        {/* Top Header with live ticker & OHLC readout (Protected against wrapping) */}
        <div className="flex items-center justify-between gap-3 px-3 pt-1 border-b border-[#F0ECE1] pb-2.5">
          <div className="flex items-center space-x-3 min-w-0 flex-1 overflow-hidden">
            <h2 className="text-xl font-bold text-[#1E1E1E] tracking-tight truncate">
              {uiState.chartTitle}
            </h2>
            <span className="text-xs font-mono font-bold text-[#8B7355] uppercase tracking-wider bg-[#F3EFE6] px-2.5 py-0.5 rounded-md border border-[#E5DFD3] truncate max-w-[260px] shrink-0">
              {uiState.chartSubtitle || 'DAILY · FICTIONAL'}
            </span>
          </div>

          {presetData.candlesticks && latestCandle && (
            <div className="flex items-center space-x-3 font-mono text-xs shrink-0 whitespace-nowrap">
              <span className="text-[#8B7355]">
                O <strong className="text-[#1E1E1E]">{latestCandle.open}</strong>
              </span>
              <span className="text-[#8B7355]">
                H <strong className="text-[#16A34A]">{latestCandle.high}</strong>
              </span>
              <span className="text-[#8B7355]">
                L <strong className="text-[#DC2626]">{latestCandle.low}</strong>
              </span>
              <span className="text-[#8B7355]">
                C{' '}
                <strong
                  className={
                    latestCandle.close >= latestCandle.open
                      ? 'text-[#16A34A]'
                      : 'text-[#DC2626]'
                  }
                >
                  {formatUnitValue(latestCandle.close, yUnit)}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* SVG Canvas */}
        <div className="flex-1 w-full relative mt-2">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="dopamineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal dashed grid lines & Right Y-axis labels */}
            {gridLines.map((gl, i) => (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={gl.y}
                  x2={padLeft + plotW}
                  y2={gl.y}
                  stroke="#E8E6DF"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft + plotW + 14}
                  y={gl.y + 4}
                  fill="#8B7355"
                  fontSize="13"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  {formatUnitValue(gl.val, yUnit)}
                </text>
              </g>
            ))}

            {/* CANDLESTICKS RENDERING */}
            {presetData.candlesticks && (
              <g>
                {/* 1. Candlesticks + Volume Bars */}
                {visibleCandles.map((c, idx) => {
                  const cx = padLeft + idx * slotW + slotW / 2;
                  const isGreen = c.close >= c.open;
                  const color = isGreen ? '#16A34A' : '#DC2626';
                  const yHigh = getYPos(c.high);
                  const yLow = getYPos(c.low);
                  const yOpen = getYPos(c.open);
                  const yClose = getYPos(c.close);
                  const topBody = Math.min(yOpen, yClose);
                  const bodyH = Math.max(3.5, Math.abs(yClose - yOpen));

                  const maxVolH = 38;
                  const volBarH = (c.volume / 250) * maxVolH;
                  const volBaselineY = svgH - 28;
                  const volY = volBaselineY - volBarH;

                  return (
                    <g key={idx}>
                      <line
                        x1={cx}
                        y1={yHigh}
                        x2={cx}
                        y2={yLow}
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <rect
                        x={cx - candleBodyW / 2}
                        y={topBody}
                        width={candleBodyW}
                        height={bodyH}
                        fill={color}
                        rx="1.5"
                      />
                      <rect
                        x={cx - candleBodyW / 2}
                        y={volY}
                        width={candleBodyW}
                        height={volBarH}
                        fill={color}
                        opacity={0.35}
                        rx="1"
                      />
                      {c.label &&
                        !/(shoulder|head|neckline|breakdown|break|peak|trough)/i.test(c.label) && (
                          <text
                            x={cx}
                            y={svgH - 10}
                            textAnchor="middle"
                            fill="#8B7355"
                            fontSize="11"
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight="600"
                          >
                            {c.label}
                          </text>
                        )}
                    </g>
                  );
                })}

                {/* 2. Head and Shoulders On-Chart Geometry (ONLY when scene is actually about H&S!) */}
                {isActualHeadAndShoulders && (
                  <g>
                    {visibleCandles.length >= 4 && allCandles[4] && (() => {
                      const cx = padLeft + 4 * slotW + slotW / 2;
                      const cy = getYPos(allCandles[4].high);
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={18} stroke="#D97706" strokeWidth={2.5} fill="none" />
                          <rect x={cx - 48} y={cy - 40} width={96} height={20} rx={10} fill="#FFFBEB" stroke="#D97706" strokeWidth={1.5} />
                          <text x={cx} y={cy - 26} textAnchor="middle" fill="#92400E" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                            LEFT SHOULDER
                          </text>
                        </g>
                      );
                    })()}

                    {visibleCandles.length >= 12 && allCandles[12] && (() => {
                      const cx = padLeft + 12 * slotW + slotW / 2;
                      const cy = getYPos(allCandles[12].high);
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={18} stroke="#D97706" strokeWidth={2.5} fill="none" />
                          <rect x={cx - 46} y={cy - 40} width={92} height={20} rx={10} fill="#FFFBEB" stroke="#D97706" strokeWidth={1.5} />
                          <text x={cx} y={cy - 26} textAnchor="middle" fill="#92400E" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                            HEAD ({formatUnitValue(allCandles[12].high, yUnit)})
                          </text>
                        </g>
                      );
                    })()}

                    {visibleCandles.length >= 20 && allCandles[20] && (() => {
                      const cx = padLeft + 20 * slotW + slotW / 2;
                      const cy = getYPos(allCandles[20].high);
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={18} stroke="#D97706" strokeWidth={2.5} fill="none" />
                          <rect x={cx - 52} y={cy - 40} width={104} height={20} rx={10} fill="#FFFBEB" stroke="#D97706" strokeWidth={1.5} />
                          <text x={cx} y={cy - 26} textAnchor="middle" fill="#92400E" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                            RIGHT SHOULDER
                          </text>
                        </g>
                      );
                    })()}

                    {visibleCandles.length >= 17 && (() => {
                      const neckPrice = presetData.necklinePrice || allCandles[7]?.low || 142;
                      const yNeckline = getYPos(neckPrice);
                      const xTrough1 = padLeft + 7 * slotW + slotW / 2;
                      const xEnd = padLeft + plotW;

                      const neckPillW = 114;
                      const neckPillH = 20;
                      const neckPillX = xEnd - neckPillW - 8;
                      const neckPillY = yNeckline - neckPillH - 6;

                      const showBreakdown = visibleCandles.length >= 26 && allCandles[25];
                      let breakdownRender = null;
                      if (showBreakdown) {
                        const xBreak = padLeft + 25 * slotW + slotW / 2;
                        const yBreakLow = getYPos(allCandles[25].low);
                        const breakSpan = allCandles.slice(Math.max(0, 25 - 6), visibleCandles.length);
                        const localLowestYBreak = Math.max(...breakSpan.map((c) => getYPos(c.low)));
                        const breakPillH = 22;
                        const breakPillW = 108;
                        const breakPillY = Math.min(svgH - 72, localLowestYBreak + 18);
                        const breakPillX = Math.min(padLeft + plotW - breakPillW - 8, Math.max(padLeft + 10, xBreak - breakPillW / 2));

                        breakdownRender = (
                          <g>
                            <circle cx={xBreak} cy={yBreakLow} r="3.5" fill="#DC2626" />
                            <line
                              x1={xBreak}
                              y1={yBreakLow}
                              x2={xBreak}
                              y2={breakPillY}
                              stroke="#DC2626"
                              strokeWidth="1.5"
                            />
                            <rect
                              x={breakPillX}
                              y={breakPillY}
                              width={breakPillW}
                              height={breakPillH}
                              rx={11}
                              fill="#FEF2F2"
                              stroke="#EF4444"
                              strokeWidth="1.5"
                            />
                            <text
                              x={breakPillX + breakPillW / 2}
                              y={breakPillY + 15}
                              textAnchor="middle"
                              fill="#B91C1C"
                              fontSize="11"
                              fontFamily="JetBrains Mono, monospace"
                              fontWeight="bold"
                            >
                              BREAK · {formatUnitValue(neckPrice, yUnit)}
                            </text>
                          </g>
                        );
                      }

                      return (
                        <g>
                          <line
                            x1={xTrough1}
                            y1={yNeckline}
                            x2={xEnd}
                            y2={yNeckline}
                            stroke="#0D9488"
                            strokeWidth="2.5"
                            strokeDasharray="6 4"
                          />
                          <rect
                            x={neckPillX}
                            y={neckPillY}
                            width={neckPillW}
                            height={neckPillH}
                            rx={10}
                            fill="#F0FDFA"
                            stroke="#0D9488"
                            strokeWidth="1.2"
                          />
                          <text
                            x={neckPillX + neckPillW / 2}
                            y={neckPillY + 14}
                            textAnchor="middle"
                            fill="#0F766E"
                            fontSize="10"
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight="bold"
                          >
                            neckline · {formatUnitValue(neckPrice, yUnit)}
                          </text>

                          {breakdownRender}
                        </g>
                      );
                    })()}
                  </g>
                )}

                {/* 4. Live Price Dashed Line & Tag on Right Y-Axis */}
                {latestCandle && visibleCandles.length > 0 && (
                  <g>
                    <line
                      x1={latestCx}
                      y1={latestCloseY}
                      x2={padLeft + plotW}
                      y2={latestCloseY}
                      stroke={livePriceColor}
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                    />
                    <rect
                      x={padLeft + plotW + 4}
                      y={latestCloseY - 12}
                      width="68"
                      height="24"
                      rx="12"
                      fill={livePriceColor}
                    />
                    <text
                      x={padLeft + plotW + 38}
                      y={latestCloseY + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {formatUnitValue(latestCandle.close, yUnit)}
                    </text>
                  </g>
                )}

                {/* 5. Dynamic Overlays from ui_state (or auto-fallback trendline) */}
                {effectiveOverlays.map((ov, oIdx) => {
                  if (ov.type === 'trendline' && ov.startIndex !== undefined && ov.endIndex !== undefined) {
                    const cStart = allCandles[ov.startIndex];
                    const cEnd = allCandles[ov.endIndex];
                    if (!cStart || !cEnd) return null;
                    if (visibleCandles.length <= ov.startIndex + 1) return null;

                    const x1 = padLeft + ov.startIndex * slotW + slotW / 2;
                    const y1 = getYPos(cStart.low);
                    const x2 = padLeft + ov.endIndex * slotW + slotW / 2;
                    const y2 = getYPos(cEnd.low);
                    const strokeCol = ov.color === 'red' ? '#DC2626' : '#16A34A';

                    const currentMaxX = padLeft + Math.min(plotW, (visibleCandles.length - 0.5) * slotW);

                    return (
                      <g key={oIdx}>
                        <defs>
                          <clipPath id={`trendlineClip-${oIdx}`}>
                            <rect x={padLeft} y={0} width={Math.max(0, currentMaxX - padLeft)} height={svgH} />
                          </clipPath>
                        </defs>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={strokeCol}
                          strokeWidth="3"
                          clipPath={`url(#trendlineClip-${oIdx})`}
                        />
                        <circle cx={x1} cy={y1} r="5" fill="#FFFFFF" stroke={strokeCol} strokeWidth="2.5" />
                        {visibleCandles.length > ov.endIndex && (
                          <circle cx={x2} cy={y2} r="5" fill="#FFFFFF" stroke={strokeCol} strokeWidth="2.5" />
                        )}
                      </g>
                    );
                  }
                  if (ov.type === 'horizontal_level' && ov.priceLevel) {
                    if (isActualHeadAndShoulders) return null;

                    const yPos = getYPos(ov.priceLevel);
                    const strokeCol = ov.color === 'red' ? '#DC2626' : '#F59E0B';
                    return (
                      <g key={oIdx}>
                        <line
                          x1={padLeft}
                          y1={yPos}
                          x2={padLeft + plotW}
                          y2={yPos}
                          stroke={strokeCol}
                          strokeWidth="2.5"
                          strokeDasharray="6 4"
                        />
                        {ov.label && (
                          <text
                            x={padLeft + plotW - 12}
                            y={yPos - 8}
                            textAnchor="end"
                            fill={strokeCol}
                            fontSize="12"
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight="bold"
                          >
                            {ov.label} ({formatUnitValue(ov.priceLevel, yUnit)})
                          </text>
                        )}
                      </g>
                    );
                  }
                  return null;
                })}
              </g>
            )}

            {/* TELEMETRY / LINE / BEHAVIORAL RENDERING */}
            {presetData.points && (
              <g>
                {(() => {
                  const allPts = presetData.points;
                  const totalPts = allPts.length;
                  const prevPtTarget = Math.max(2, Math.round((prevStep / totalSteps) * totalPts));
                  const ptTarget = Math.max(
                    2,
                    Math.round((currentStep / totalSteps) * totalPts)
                  );
                  const animPtsCount =
                    beatIndexInScene === 0
                      ? Math.round(
                        interpolate(beatFrame, [0, revealDuration], [2, ptTarget], {
                          extrapolateRight: 'clamp',
                        })
                      )
                      : Math.round(
                        interpolate(beatFrame, [0, revealDuration], [prevPtTarget, ptTarget], {
                          extrapolateRight: 'clamp',
                        })
                      );
                  const visiblePts = allPts.slice(0, animPtsCount);
                  const ptSlotW = plotW / (totalPts - 1 || 1);

                  const coords = visiblePts.map((p, idx) => ({
                    x: padLeft + idx * ptSlotW,
                    y: getYPos(p.value),
                    point: p,
                  }));

                  const pathD = coords.reduce((acc, curr, idx) => {
                    if (idx === 0) return `M ${curr.x} ${curr.y}`;
                    const prev = coords[idx - 1];
                    const cx = (prev.x + curr.x) / 2;
                    return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
                  }, '');

                  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${padTop + plotH} L ${coords[0].x} ${padTop + plotH} Z`;
                  const threshold = visiblePts[0]?.threshold;
                  const thresholdY = threshold ? getYPos(threshold) : null;
                  const latestPt = coords[coords.length - 1];
                  const lineStroke = presetData.type === 'behavioral' ? '#8B5CF6' : '#2563EB';

                  let lastLabelX = -999;

                  return (
                    <>
                      {thresholdY !== null && (
                        <g>
                          <line
                            x1={padLeft}
                            y1={thresholdY}
                            x2={padLeft + plotW}
                            y2={thresholdY}
                            stroke="#EF4444"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                          />
                          <text
                            x={padLeft + 10}
                            y={thresholdY - 8}
                            fill="#EF4444"
                            fontSize="12"
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight="bold"
                          >
                            THRESHOLD SLA ({formatUnitValue(threshold ?? '', yUnit)})
                          </text>
                        </g>
                      )}

                      <path
                        d={areaD}
                        fill={
                          presetData.type === 'behavioral'
                            ? 'url(#dopamineGrad)'
                            : 'url(#areaGrad)'
                        }
                      />

                      {coords.some((c) => c.point.secondaryValue !== undefined) && (
                        <path
                          d={coords.reduce((acc, curr, idx) => {
                            const ySec = getYPos(
                              curr.point.secondaryValue ?? curr.point.value
                            );
                            if (idx === 0) return `M ${curr.x} ${ySec}`;
                            return `${acc} L ${curr.x} ${ySec}`;
                          }, '')}
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2.5"
                          strokeDasharray="6 4"
                        />
                      )}

                      <path
                        d={pathD}
                        fill="none"
                        stroke={lineStroke}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {coords.map((c, idx) => {
                        const barMetric = c.point.barMetric || 0;
                        const maxBarH = 38;
                        const barH = (barMetric / 100) * maxBarH;
                        const barY = svgH - 28 - barH;

                        const canShowLabel =
                          Boolean(c.point.xLabel) && c.x - lastLabelX >= 72;
                        if (canShowLabel) {
                          lastLabelX = c.x;
                        }

                        return (
                          <g key={idx}>
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r="4.5"
                              fill="#FFFFFF"
                              stroke={lineStroke}
                              strokeWidth="2.5"
                            />
                            {barMetric > 0 && (
                              <rect
                                x={c.x - 6}
                                y={barY}
                                width="12"
                                height={barH}
                                fill={barMetric > 85 ? '#EF4444' : '#3B82F6'}
                                opacity={0.35}
                                rx="1.5"
                              />
                            )}
                            {canShowLabel && (
                              <text
                                x={c.x}
                                y={svgH - 10}
                                textAnchor="middle"
                                fill="#8B7355"
                                fontSize="11"
                                fontFamily="JetBrains Mono, monospace"
                                fontWeight="600"
                              >
                                {c.point.xLabel}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Live Right-Axis Value Pill for Line Charts */}
                      {latestPt && (
                        <g>
                          <line
                            x1={latestPt.x}
                            y1={latestPt.y}
                            x2={padLeft + plotW}
                            y2={latestPt.y}
                            stroke={lineStroke}
                            strokeWidth="1.6"
                            strokeDasharray="4 3"
                          />
                          <rect
                            x={padLeft + plotW + 4}
                            y={latestPt.y - 12}
                            width="68"
                            height="24"
                            rx="12"
                            fill={lineStroke}
                          />
                          <text
                            x={padLeft + plotW + 38}
                            y={latestPt.y + 4}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="11"
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight="bold"
                          >
                            {formatUnitValue(Math.round(latestPt.point.value), yUnit)}
                          </text>
                        </g>
                      )}
                    </>
                  );
                })()}
              </g>
            )}

            {/* ANNOTATIONS CALLOUT PILLS — FULL HORIZONTAL FOOTPRINT + MULTI-PILL COLLISION ENGINE */}
            {uiState.annotations &&
              uiState.annotations.map((ann, idx) => {
                if (
                  isActualHeadAndShoulders &&
                  /neckline/i.test(ann.text)
                ) {
                  return null;
                }

                // Phase 2B: Visual cue-driven annotation reveal
                const annotationCues = getActiveCues(beat, beatFrame, fps).filter(
                  (c) => c.target === 'annotationReveal'
                );
                const hasExplicitAnnotationCues =
                  Array.isArray(beat.visualCues) &&
                  beat.visualCues.some((c) => c.target === 'annotationReveal');
                if (hasExplicitAnnotationCues) {
                  const isRevealed = annotationCues.some(
                    (c) =>
                      c.payload === ann.text ||
                      Number(c.payload) === idx ||
                      c.payload === ann.type
                  );
                  if (!isRevealed) return null;
                }

                const seriesLength =
                  allCandles.length > 0
                    ? allCandles.length
                    : (presetData.points?.length || 0);
                const visibleLength =
                  allCandles.length > 0
                    ? animatedCandleCount
                    : Math.max(2, Math.round((currentStep / totalSteps) * seriesLength));
                const effectiveSlotW =
                  allCandles.length > 0
                    ? slotW
                    : plotW / Math.max(1, seriesLength - 1);

                let targetIdx = ann.candleIndex;

                // Use explicit ann.value or ann.candleIndex for coordinate positioning
                if (targetIdx === undefined && ann.value !== undefined && allCandles.length > 0) {
                  const targetPrice = Number(ann.value);
                  if (!isNaN(targetPrice)) {
                    let bestIdx = 0;
                    let bestDiff = Infinity;
                    const searchPool = allCandles.slice(0, Math.max(1, visibleLength));
                    searchPool.forEach((c, cIdx) => {
                      const diff = Math.min(
                        Math.abs(c.close - targetPrice),
                        Math.abs(c.high - targetPrice),
                        Math.abs(c.low - targetPrice)
                      );
                      if (diff < bestDiff) {
                        bestDiff = diff;
                        bestIdx = cIdx;
                      }
                    });
                    targetIdx = bestIdx;
                  }
                }

                if (
                  targetIdx !== undefined &&
                  allCandles.length === 0 &&
                  presetData.points &&
                  seriesLength > 35 &&
                  targetIdx <= 30
                ) {
                  targetIdx = Math.min(
                    seriesLength - 1,
                    Math.round((targetIdx / 30) * (seriesLength - 1))
                  );
                }

                if (targetIdx !== undefined && visibleLength < targetIdx) {
                  return null;
                }

                const isRed = ann.color === 'red';
                const isAmber = ann.color === 'amber';
                const isTeal = ann.color === 'teal' || ann.color === 'green';
                const bg = isRed
                  ? '#FEE2E2'
                  : isAmber
                    ? '#FEF3C7'
                    : isTeal
                      ? '#F0FDFA'
                      : '#EFF6FF';
                const stroke = isRed
                  ? '#EF4444'
                  : isAmber
                    ? '#F59E0B'
                    : isTeal
                      ? '#0D9488'
                      : '#3B82F6';
                const textCol = isRed
                  ? '#991B1B'
                  : isAmber
                    ? '#92400E'
                    : isTeal
                      ? '#115E59'
                      : '#1E40AF';

                const isBottom = isRed;
                const pillW = Math.max(130, ann.text.length * 7.8 + 26);
                const pillH = 28;

                let anchorX = padLeft + plotW * 0.5;
                if (targetIdx !== undefined) {
                  anchorX =
                    allCandles.length > 0
                      ? padLeft + targetIdx * effectiveSlotW + effectiveSlotW / 2
                      : padLeft + targetIdx * effectiveSlotW;
                }

                let pillX = Math.min(
                  padLeft + plotW - pillW - 10,
                  Math.max(padLeft + 10, anchorX - pillW / 2)
                );

                placedPills.forEach((prev) => {
                  if (prev.isBottom === isBottom) {
                    const xOverlap =
                      pillX < prev.x + prev.w + 10 && pillX + pillW + 10 > prev.x;
                    if (xOverlap) {
                      if (anchorX < prev.anchorX) {
                        pillX = Math.max(padLeft + 8, anchorX - pillW + 18);
                      } else {
                        pillX = Math.min(padLeft + plotW - pillW - 8, anchorX - 18);
                      }
                    }
                  }
                });

                const firstSpannedIdx = Math.max(
                  0,
                  Math.floor((pillX - 12 - padLeft) / effectiveSlotW)
                );
                const lastSpannedIdx = Math.min(
                  Math.max(0, visibleLength - 1),
                  Math.ceil((pillX + pillW + 12 - padLeft) / effectiveSlotW)
                );

                let anchorY = padTop + plotH * 0.5;
                let pillY: number;

                if (allCandles.length > 0 && targetIdx !== undefined && allCandles[targetIdx]) {
                  const spannedCandles = visibleCandles.slice(
                    firstSpannedIdx,
                    Math.max(firstSpannedIdx + 1, lastSpannedIdx + 1)
                  );
                  const c = allCandles[targetIdx];

                  if (isBottom) {
                    anchorY = getYPos(c.low);
                    const lowestWickYAcrossPill = Math.max(
                      ...spannedCandles.map((sc) => getYPos(sc.low))
                    );
                    pillY = Math.min(svgH - 70 - pillH, lowestWickYAcrossPill + 16);
                  } else {
                    anchorY = getYPos(c.high);
                    const highestWickYAcrossPill = Math.min(
                      ...spannedCandles.map((sc) => getYPos(sc.high))
                    );
                    pillY = Math.max(10, highestWickYAcrossPill - 16 - pillH);
                  }
                } else if (
                  presetData.points &&
                  targetIdx !== undefined &&
                  presetData.points[targetIdx]
                ) {
                  const spannedPts = presetData.points.slice(
                    firstSpannedIdx,
                    Math.max(firstSpannedIdx + 1, lastSpannedIdx + 1)
                  );
                  const pt = presetData.points[targetIdx];
                  anchorY = getYPos(pt.value);
                  if (isBottom) {
                    const lowestPtY = Math.max(...spannedPts.map((p) => getYPos(p.value)));
                    pillY = Math.min(svgH - 70 - pillH, lowestPtY + 18);
                  } else {
                    const highestPtY = Math.min(...spannedPts.map((p) => getYPos(p.value)));
                    pillY = Math.max(10, highestPtY - 18 - pillH);
                  }
                } else if (ann.value !== undefined) {
                  anchorY = getYPos(ann.value);
                  pillY = isBottom
                    ? Math.min(svgH - 70 - pillH, anchorY + 24)
                    : Math.max(10, anchorY - 24 - pillH);
                } else {
                  pillY = anchorY;
                }

                placedPills.forEach((prev) => {
                  const horizOverlap =
                    pillX < prev.x + prev.w + 8 && pillX + pillW + 8 > prev.x;
                  const vertOverlap =
                    pillY < prev.y + prev.h + 6 && pillY + pillH + 6 > prev.y;
                  if (horizOverlap && vertOverlap) {
                    if (isBottom) {
                      pillY = Math.min(svgH - 64 - pillH, prev.y + prev.h + 8);
                    } else {
                      pillY = Math.max(6, prev.y - pillH - 8);
                    }
                  }
                });

                placedPills.push({
                  x: pillX,
                  y: pillY,
                  w: pillW,
                  h: pillH,
                  anchorX,
                  isBottom,
                });

                const lineConnectY = isBottom ? pillY : pillY + pillH;
                const pointerTargetX = Math.min(
                  pillX + pillW - 14,
                  Math.max(pillX + 14, anchorX)
                );

                return (
                  <g key={idx}>
                    <circle cx={anchorX} cy={anchorY} r="3.5" fill={stroke} />
                    <line
                      x1={anchorX}
                      y1={anchorY}
                      x2={pointerTargetX}
                      y2={lineConnectY}
                      stroke={stroke}
                      strokeWidth="1.5"
                    />
                    <rect
                      x={pillX}
                      y={pillY}
                      width={pillW}
                      height={pillH}
                      rx="14"
                      fill={bg}
                      stroke={stroke}
                      strokeWidth="1.5"
                      filter="drop-shadow(0 2px 5px rgba(0,0,0,0.06))"
                    />
                    <text
                      x={pillX + pillW / 2}
                      y={pillY + 18}
                      textAnchor="middle"
                      fill={textCol}
                      fontSize="11.5"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {ann.text}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>
      </div>

      {/* RIGHT 30%: Vertically Stacked Side Cards */}
      <div className="w-[30%] h-full flex flex-col justify-center space-y-3.5 my-auto">
        {displaySideCards.length > 0 ? (
          displaySideCards.map((card: SideCard, idx: number) => {
            const cardStyle =
              sideCardStyles[card.state || 'default'] || sideCardStyles.default;
            const cardEntrance = spring({
              frame: beatFrame - idx * 5,
              fps,
              config: { damping: 16, stiffness: 120 },
            });
            const isActive = (card.state || '').startsWith('active');

            return (
              <div
                key={idx}
                style={{
                  opacity: cardEntrance,
                  transform: `translateY(${(1 - cardEntrance) * 18}px) scale(${isActive ? 1.02 : 1})`,
                }}
                className={`py-3.5 px-5 rounded-2xl border ${cardStyle.bg} ${cardStyle.border}`}
              >
                <h3 className={`text-lg font-bold tracking-tight ${cardStyle.titleColor}`}>
                  {card.title}
                </h3>
                <p className={`text-sm font-medium mt-1 leading-snug ${cardStyle.subtitleColor}`}>
                  {card.subtitle}
                </p>
              </div>
            );
          })
        ) : (
          <div className="py-4 px-5 rounded-2xl border border-[#E5E7EB] bg-white">
            <h3 className="text-base font-bold text-[#1E1E1E]">Key Insight</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Data reveals clear divergence before the major pivot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};