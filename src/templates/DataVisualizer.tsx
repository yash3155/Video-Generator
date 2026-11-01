import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { Scene, Beat, DataVisualizerUI, SideCard } from '../types';
import { getPresetData } from './chartPresets';

interface DataVisualizerProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

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

export const DataVisualizer: React.FC<DataVisualizerProps> = ({
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

  const presetData = getPresetData(uiState.preset);
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

  const yUnit = uiState.yAxisUnit || presetData.unit || '₹';

  // Chart layout dimensions — reserve generous bottom space above volume bars so bottom pills never collide with wicks
  const svgW = 1100;
  const svgH = 580;
  const padLeft = 70;
  const padRight = 110;
  const padTop = 65;
  const padBottom = 115; // Increased from 80 to 115 so candles sit higher and bottom callouts have a dedicated 50px clear lane
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

  const prevCandleTarget = Math.round((prevStep / totalSteps) * totalCandles);
  const currentCandleTarget = Math.max(
    1,
    Math.round((currentStep / totalSteps) * totalCandles)
  );

  const revealDuration = Math.max(15, Math.round(beatDuration * 0.7));
  const animatedCandleCount =
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
    cards.forEach((c) => {
      if (!seenCardTitles.has(c.title)) {
        seenCardTitles.add(c.title);
        accumulatedSideCards.push({
          title: c.title,
          subtitle: c.subtitle,
          state: isCurrentBeat ? c.state || 'default' : 'muted',
        });
      } else {
        const existingIdx = accumulatedSideCards.findIndex((x) => x.title === c.title);
        if (existingIdx !== -1) {
          accumulatedSideCards[existingIdx] = {
            title: c.title,
            subtitle: c.subtitle,
            state: isCurrentBeat ? c.state || 'default' : 'muted',
          };
        }
      }
    });
  });

  const displaySideCards = accumulatedSideCards.slice(-5);

  return (
    <div className="w-full h-full flex items-center justify-between gap-8 relative z-10">
      {/* LEFT 68%: Deterministic SVG Chart Canvas */}
      <div className="w-[68%] h-full flex flex-col justify-between bg-[#FCFCFA] rounded-2xl border border-[#ECEAE3] p-4 shadow-sm relative overflow-hidden">
        {/* Top Header with live ticker & OHLC readout */}
        <div className="flex items-center justify-between px-3 pt-1 border-b border-[#F0ECE1] pb-2.5">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-[#1E1E1E] tracking-tight">
              {uiState.chartTitle}
            </h2>
            <span className="text-xs font-mono font-bold text-[#8B7355] uppercase tracking-wider bg-[#F3EFE6] px-2.5 py-0.5 rounded-md border border-[#E5DFD3]">
              {uiState.chartSubtitle || 'DAILY · FICTIONAL'}
            </span>
          </div>

          {latestCandle && (
            <div className="flex items-center space-x-3 font-mono text-xs">
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
                  {yUnit}{latestCandle.close}
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
                  {yUnit}{gl.val}
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

                  // Volume bar anchored near bottom above X-axis dates
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

                {/* 2. Head and Shoulders On-Chart Geometry */}
                {uiState.preset === 'head_and_shoulders' && (
                  <g>
                    {/* Left Shoulder Peak (index 4) */}
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

                    {/* Head Peak (index 12) */}
                    {visibleCandles.length >= 12 && allCandles[12] && (() => {
                      const cx = padLeft + 12 * slotW + slotW / 2;
                      const cy = getYPos(allCandles[12].high);
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={18} stroke="#D97706" strokeWidth={2.5} fill="none" />
                          <rect x={cx - 42} y={cy - 40} width={84} height={20} rx={10} fill="#FFFBEB" stroke="#D97706" strokeWidth={1.5} />
                          <text x={cx} y={cy - 26} textAnchor="middle" fill="#92400E" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                            HEAD ({yUnit}175)
                          </text>
                        </g>
                      );
                    })()}

                    {/* Right Shoulder Peak (index 20) */}
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

                    {/* Neckline connecting trough after Left Shoulder (idx 7) to right edge */}
                    {visibleCandles.length >= 17 && (() => {
                      const yNeckline = getYPos(142);
                      const xTrough1 = padLeft + 7 * slotW + slotW / 2;
                      const xEnd = padLeft + plotW;

                      // Place compact neckline badge at the FAR RIGHT above the neckline (zero candles live at xEnd - 115, yNeckline - 26!)
                      const neckPillW = 110;
                      const neckPillH = 20;
                      const neckPillX = xEnd - neckPillW - 8;
                      const neckPillY = yNeckline - neckPillH - 6;

                      // Breakdown pill below breakdown candle (index 25) on Beat 3
                      const showBreakdown = visibleCandles.length >= 26 && allCandles[25];
                      let breakdownRender = null;
                      if (showBreakdown) {
                        const xBreak = padLeft + 25 * slotW + slotW / 2;
                        const yBreakLow = getYPos(allCandles[25].low);
                        const breakSpan = allCandles.slice(Math.max(0, 25 - 6), visibleCandles.length);
                        const localLowestYBreak = Math.max(...breakSpan.map((c) => getYPos(c.low)));
                        const breakPillH = 22;
                        const breakPillW = 104;
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
                              BREAK · {yUnit}142
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
                            neckline · {yUnit}142
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
                      width="58"
                      height="24"
                      rx="12"
                      fill={livePriceColor}
                    />
                    <text
                      x={padLeft + plotW + 33}
                      y={latestCloseY + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {latestCandle.close}
                    </text>
                  </g>
                )}

                {/* 5. Dynamic Overlays from ui_state */}
                {uiState.overlays &&
                  uiState.overlays.map((ov, oIdx) => {
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
                      if (uiState.preset === 'head_and_shoulders') return null;

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
                              {ov.label} ({yUnit}{ov.priceLevel})
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
                      : ptTarget;
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
                            THRESHOLD SLA ({yUnit}{threshold})
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
                        stroke={
                          presetData.type === 'behavioral'
                            ? '#8B5CF6'
                            : '#2563EB'
                        }
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {coords.map((c, idx) => {
                        const barMetric = c.point.barMetric || 0;
                        const maxBarH = 38;
                        const barH = (barMetric / 100) * maxBarH;
                        const barY = svgH - 28 - barH;

                        return (
                          <g key={idx}>
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r="5"
                              fill="#FFFFFF"
                              stroke={
                                presetData.type === 'behavioral'
                                  ? '#8B5CF6'
                                  : '#2563EB'
                              }
                              strokeWidth="3"
                            />
                            {barMetric > 0 && (
                              <rect
                                x={c.x - 10}
                                y={barY}
                                width="20"
                                height={barH}
                                fill={barMetric > 85 ? '#EF4444' : '#3B82F6'}
                                opacity={0.35}
                                rx="1.5"
                              />
                            )}
                            {c.point.xLabel && (
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
                    </>
                  );
                })()}
              </g>
            )}

            {/* ANNOTATIONS CALLOUT PILLS — FULL HORIZONTAL FOOTPRINT CLEARANCE */}
            {uiState.annotations &&
              uiState.annotations.map((ann, idx) => {
                // Suppress redundant neckline annotation if head_and_shoulders preset already renders it
                if (
                  uiState.preset === 'head_and_shoulders' &&
                  /neckline/i.test(ann.text)
                ) {
                  return null;
                }

                let targetIdx = ann.candleIndex;
                if (targetIdx === undefined && ann.value !== undefined) {
                  const nearestIdx = allCandles.findIndex(
                    (c) =>
                      Math.abs(c.close - ann.value!) <= 2 ||
                      Math.abs(c.open - ann.value!) <= 2
                  );
                  if (nearestIdx >= 0) {
                    targetIdx = nearestIdx;
                  }
                }

                if (targetIdx !== undefined && animatedCandleCount < targetIdx) {
                  return null;
                }

                const isRed = ann.color === 'red';
                const isAmber = ann.color === 'amber';
                const bg = isRed ? '#FEE2E2' : isAmber ? '#FEF3C7' : '#EFF6FF';
                const stroke = isRed ? '#EF4444' : isAmber ? '#F59E0B' : '#3B82F6';
                const textCol = isRed ? '#991B1B' : isAmber ? '#92400E' : '#1E40AF';

                const isBottom = isRed;

                const pillW = Math.max(130, ann.text.length * 8 + 26);
                const pillH = 28;

                let anchorX = padLeft + plotW * 0.5;
                if (targetIdx !== undefined && allCandles[targetIdx]) {
                  anchorX = padLeft + targetIdx * slotW + slotW / 2;
                }

                const pillX = Math.min(
                  padLeft + plotW - pillW - 10,
                  Math.max(padLeft + 10, anchorX - pillW / 2)
                );

                // Find EVERY candle whose X position falls underneath [pillX - 12, pillX + pillW + 12]
                const firstSpannedIdx = Math.max(
                  0,
                  Math.floor((pillX - 12 - padLeft) / slotW)
                );
                const lastSpannedIdx = Math.min(
                  visibleCandles.length - 1,
                  Math.ceil((pillX + pillW + 12 - padLeft) / slotW)
                );
                const spannedCandles = visibleCandles.slice(
                  firstSpannedIdx,
                  Math.max(firstSpannedIdx + 1, lastSpannedIdx + 1)
                );

                let anchorY = padTop + plotH * 0.5;
                let pillY: number;
                let lineConnectY: number;

                if (targetIdx !== undefined && allCandles[targetIdx] && spannedCandles.length > 0) {
                  const c = allCandles[targetIdx];

                  if (isBottom) {
                    anchorY = getYPos(c.low);
                    // Place pill strictly below the lowest wick across the ENTIRE horizontal width of the pill
                    const lowestWickYAcrossPill = Math.max(
                      ...spannedCandles.map((sc) => getYPos(sc.low))
                    );
                    const maxAllowedBottomY = svgH - 72 - pillH; // Above volume bars
                    pillY = Math.min(maxAllowedBottomY, lowestWickYAcrossPill + 16);
                    lineConnectY = pillY;
                  } else {
                    anchorY = getYPos(c.high);
                    // Place pill strictly above the highest wick across the ENTIRE horizontal width of the pill
                    const highestWickYAcrossPill = Math.min(
                      ...spannedCandles.map((sc) => getYPos(sc.high))
                    );
                    pillY = Math.max(12, highestWickYAcrossPill - 16 - pillH);
                    lineConnectY = pillY + pillH;
                  }
                } else if (ann.value !== undefined) {
                  anchorY = getYPos(ann.value);
                  pillY = isBottom
                    ? Math.min(svgH - 72 - pillH, anchorY + 24)
                    : Math.max(12, anchorY - 24 - pillH);
                  lineConnectY = isBottom ? pillY : pillY + pillH;
                } else {
                  pillY = anchorY;
                  lineConnectY = pillY;
                }

                return (
                  <g key={idx}>
                    <circle cx={anchorX} cy={anchorY} r="3.5" fill={stroke} />
                    <line
                      x1={anchorX}
                      y1={anchorY}
                      x2={anchorX}
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