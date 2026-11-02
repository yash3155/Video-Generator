import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { Scene, Beat, PayoffDiagramUI, SideCard } from '../types';

interface PayoffDiagramProps {
  scene: Scene;
  beat: Beat;
  beatFrame?: number;
  beatDuration?: number;
}

export const PayoffDiagram: React.FC<PayoffDiagramProps> = ({
  scene,
  beat,
  beatFrame = 0,
  beatDuration = 180,
}) => {
  const { fps } = useVideoConfig();
  const ui: PayoffDiagramUI = beat.ui_state || ({} as any);

  const strategyType = ui.strategyType || 'long_call';
  const chartTitle = ui.chartTitle || scene.title || 'Option Payoff Profile';
  const chartSubtitle = ui.chartSubtitle || strategyType.replace(/_/g, ' ').toUpperCase();

  const K1 = Number(ui.strikePrice) || 500;
  const P1 = Number(ui.premium) || Math.round(K1 * 0.05);
  const K2 = Number(ui.secondStrike) || Math.round(K1 * 1.1);
  const P2 = Number(ui.secondPremium) || Math.round(P1 * 0.5);

  const minS = Math.round(K1 * 0.75);
  const maxS = Math.round((ui.secondStrike ? K2 : K1) * 1.25);
  const steps = 60;

  const computePayoff = (S: number): number => {
    switch (strategyType) {
      case 'long_call':
        return Math.max(S - K1, 0) - P1;
      case 'short_call':
        return P1 - Math.max(S - K1, 0);
      case 'long_put':
        return Math.max(K1 - S, 0) - P1;
      case 'short_put':
        return P1 - Math.max(K1 - S, 0);
      case 'bull_spread':
        return Math.max(S - K1, 0) - Math.max(S - K2, 0) - (P1 - P2);
      case 'bear_spread':
        return Math.max(K2 - S, 0) - Math.max(K1 - S, 0) - (P1 - P2);
      case 'straddle':
        return Math.max(S - K1, 0) + Math.max(K1 - S, 0) - P1 * 2;
      case 'strangle':
        return Math.max(K1 - S, 0) + Math.max(S - K2, 0) - (P1 + P2);
      case 'protective_put':
        return S - K1 + Math.max(K1 - S, 0) - P1;
      case 'covered_call':
        return S - K1 - Math.max(S - K2, 0) + P1;
      default:
        return Math.max(S - K1, 0) - P1;
    }
  };

  const pts = Array.from({ length: steps + 1 }).map((_, i) => {
    const S = minS + ((maxS - minS) * i) / steps;
    return { S, pnl: computePayoff(S) };
  });

  const maxAbsPnl = Math.max(
    ...pts.map((p) => Math.abs(p.pnl)),
    P1 * 2.5,
    20
  );
  const minY = -Math.ceil(maxAbsPnl * 1.2);
  const maxY = Math.ceil(maxAbsPnl * 1.2);

  const svgW = 1050;
  const svgH = 540;
  const padL = 75;
  const padR = 75;
  const padT = 60;
  const padB = 85;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const getX = (S: number) => padL + ((S - minS) / (maxS - minS || 1)) * plotW;
  const getY = (pnl: number) => padT + plotH - ((pnl - minY) / (maxY - minY || 1)) * plotH;
  const zeroY = getY(0);

  const revealCount = Math.max(
    2,
    Math.round(
      interpolate(beatFrame, [0, Math.round(beatDuration * 0.65)], [2, pts.length], {
        extrapolateRight: 'clamp',
      })
    )
  );
  const visiblePts = pts.slice(0, revealCount);

  const pathD = visiblePts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.S).toFixed(1)} ${getY(p.pnl).toFixed(1)}`)
    .join(' ');

  const strikeX = getX(K1);
  const strikeY = getY(computePayoff(K1));

  const cards: SideCard[] = ui.sideCards && ui.sideCards.length > 0
    ? ui.sideCards
    : [
        {
          title: `Strike Price (K = ₹${K1})`,
          subtitle: `Option Premium Paid/Received: ₹${P1}`,
          state: 'active_amber',
        },
        {
          title: 'Asymmetric Payoff',
          subtitle: 'Options cap downside risk while preserving upside.',
          state: 'active_teal',
        },
      ];

  return (
    <div className="w-full h-full flex items-center justify-between gap-8 relative z-10">
      <div className="w-[68%] h-full flex flex-col justify-between bg-[#FCFCFA] rounded-2xl border border-[#ECEAE3] p-4 shadow-sm">
        <div className="flex items-center justify-between px-3 pt-1 border-b border-[#F0ECE1] pb-2.5">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-[#1E1E1E] tracking-tight truncate">
              {chartTitle}
            </h2>
            <span className="text-xs font-mono font-bold text-[#8B7355] uppercase tracking-wider bg-[#F3EFE6] px-2.5 py-0.5 rounded-md border border-[#E5DFD3]">
              {chartSubtitle}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-[#8B7355]">
            K = ₹{K1} · Premium = ₹{P1}
          </span>
        </div>

        <div className="flex-1 w-full relative mt-2">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full">
            {/* Zero Profit Breakeven Line */}
            <line
              x1={padL}
              y1={zeroY}
              x2={padL + plotW}
              y2={zeroY}
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text
              x={padL + plotW + 10}
              y={zeroY + 4}
              fill="#475569"
              fontSize="12"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="bold"
            >
              ₹0 (BEP)
            </text>

            {/* Strike Vertical Marker */}
            <line
              x1={strikeX}
              y1={padT}
              x2={strikeX}
              y2={padT + plotH}
              stroke="#D97706"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={strikeX}
              y={padT + plotH + 24}
              textAnchor="middle"
              fill="#B45309"
              fontSize="12"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="bold"
            >
              Strike K = ₹{K1}
            </text>

            {/* Payoff Hockey-Stick Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#0D9488"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Kink Point Circle */}
            <circle
              cx={strikeX}
              cy={strikeY}
              r="6"
              fill="#FFFBEB"
              stroke="#D97706"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>

      {/* Right Column Side Cards */}
      <div className="w-[30%] h-full flex flex-col justify-center space-y-3.5 my-auto">
        {cards.map((c, idx) => {
          const cardEntrance = spring({
            frame: beatFrame - idx * 5,
            fps,
            config: { damping: 16, stiffness: 120 },
          });
          return (
            <div
              key={idx}
              style={{
                opacity: cardEntrance,
                transform: `translateY(${(1 - cardEntrance) * 16}px)`,
              }}
              className="py-4 px-5 rounded-2xl border-2 border-[#0D9488] bg-[#F0FDFA] shadow-xs"
            >
              <h3 className="text-lg font-bold text-[#115E59]">{c.title}</h3>
              <p className="text-sm font-medium text-[#0F766E] mt-1">{c.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

