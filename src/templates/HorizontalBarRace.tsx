import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { Scene, Beat, HorizontalBarRaceUI } from '../types';

interface HorizontalBarRaceProps {
  scene: Scene;
  beat: Beat;
  beatFrame?: number;
}

export const HorizontalBarRace: React.FC<HorizontalBarRaceProps> = ({
  scene,
  beat,
  beatFrame = 0,
}) => {
  const { fps } = useVideoConfig();
  const ui: HorizontalBarRaceUI = beat.ui_state || ({} as any);

  const title = ui.title || scene.title || 'Side by Side Comparison';
  const leftHeader = ui.leftHeader || 'Side A';
  const rightHeader = ui.rightHeader || 'Side B';
  const leftValueText = ui.leftValueText || String(ui.leftWeight || 50);
  const rightValueText = ui.rightValueText || String(ui.rightWeight || 50);

  const progress = spring({
    frame: beatFrame,
    fps,
    config: { damping: 16, stiffness: 95 },
  });

  const maxWeight = Math.max(ui.leftWeight || 1, ui.rightWeight || 1, 1);
  const leftWidthPct = Math.max(8, Math.min(100, ((ui.leftWeight || 10) / maxWeight) * 100)) * progress;
  const rightWidthPct = Math.max(8, Math.min(100, ((ui.rightWeight || 10) / maxWeight) * 100)) * progress;

  const entrance = interpolate(beatFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative z-10 px-10 py-6">
      <div
        style={{ opacity: entrance }}
        className="max-w-5xl w-full bg-[#FCFCFA] border border-[#ECEAE3] rounded-3xl p-10 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-6 h-0.5 bg-[#8B7355]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355]">
              {ui.sectionTag || scene.badge || 'SIDE BY SIDE'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
            {title}
          </h2>
        </div>

        {/* Center Axis & Dual Horizontal Bars */}
        <div className="my-10 w-full flex flex-col">
          {/* Column Labels */}
          <div className="grid grid-cols-2 gap-0 w-full mb-3">
            <div className="text-right pr-6 text-base font-bold text-[#525252]">
              {leftHeader}
            </div>
            <div className="text-left pl-6 text-base font-bold text-[#525252]">
              {rightHeader}
            </div>
          </div>

          {/* Opposing Bars Row */}
          <div className="grid grid-cols-2 gap-0 w-full items-center relative min-h-[76px]">
            {/* Center Vertical Divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1E1E1E] -translate-x-1/2 z-20" />

            {/* Left Side (Grows Leftward from Center) */}
            <div className="flex items-center justify-end pr-1">
              <span className="text-3xl font-black font-mono text-[#15803D] mr-4 whitespace-nowrap">
                {leftValueText}
              </span>
              <div
                style={{ width: `${leftWidthPct * 0.55}%` }}
                className="h-12 bg-[#16A34A] rounded-l-lg shadow-xs transition-all"
              />
            </div>

            {/* Right Side (Grows Rightward from Center) */}
            <div className="flex items-center justify-start pl-1">
              <div
                style={{ width: `${rightWidthPct * 0.55}%` }}
                className="h-12 bg-[#D97706] rounded-r-lg shadow-xs transition-all"
              />
              <span className="text-3xl font-black font-mono text-[#B45309] ml-4 whitespace-nowrap">
                {rightValueText}
              </span>
            </div>
          </div>
        </div>

        {ui.bottomNote && (
          <div className="pt-4 border-t border-[#ECEAE3] flex items-center justify-center">
            <span className="text-base font-semibold text-[#525252]">
              {ui.bottomNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

