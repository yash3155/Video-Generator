import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { Scene, Beat } from '../types';

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
  const rawUI = (beat.ui_state || {}) as any;

  const title = rawUI.title || rawUI.chartTitle || scene.title || 'Side by Side Comparison';
  const leftHeader = rawUI.leftHeader || rawUI.leftBar?.label || 'Side A';
  const rightHeader = rawUI.rightHeader || rawUI.rightBar?.label || 'Side B';
  const leftWeight = Number(rawUI.leftWeight ?? rawUI.leftBar?.value ?? 50);
  const rightWeight = Number(rawUI.rightWeight ?? rawUI.rightBar?.value ?? 50);
  const leftValueText =
    rawUI.leftValueText ||
    (rawUI.leftBar?.unit ? `${leftWeight}${rawUI.leftBar.unit}` : `${leftWeight}%`);
  const rightValueText =
    rawUI.rightValueText ||
    (rawUI.rightBar?.unit ? `${rightWeight}${rawUI.rightBar.unit}` : `${rightWeight}%`);
  const leftAnnotation = rawUI.leftBar?.annotation || '';
  const rightAnnotation = rawUI.rightBar?.annotation || '';
  const bottomNote = rawUI.bottomNote || rawUI.centerNote || '';

  const progress = spring({
    frame: beatFrame,
    fps,
    config: { damping: 16, stiffness: 95 },
  });

  const maxWeight = Math.max(leftWeight || 1, rightWeight || 1, 1);

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
              {rawUI.sectionTag || scene.badge || 'SIDE BY SIDE'}
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
            <div className="flex flex-col items-end pr-4 w-full">
              <div className="flex items-center justify-end w-full">
                <span className="text-2xl font-black font-mono text-[#15803D] mr-4 whitespace-nowrap">
                  {leftValueText}
                </span>
                <div
                  style={{
                    width: `${Math.max(10, Math.min(85, (leftWeight / maxWeight) * 85 * progress))}%`,
                  }}
                  className="h-12 bg-[#16A34A] rounded-l-xl shadow-xs transition-all"
                />
              </div>
              {leftAnnotation && (
                <span className="text-xs font-mono font-medium text-[#64748B] mt-1 text-right">
                  {leftAnnotation}
                </span>
              )}
            </div>

            {/* Right Side (Grows Rightward from Center) */}
            <div className="flex flex-col items-start pl-4 w-full">
              <div className="flex items-center justify-start w-full">
                <div
                  style={{
                    width: `${Math.max(10, Math.min(85, (rightWeight / maxWeight) * 85 * progress))}%`,
                  }}
                  className="h-12 bg-[#D97706] rounded-r-xl shadow-xs transition-all"
                />
                <span className="text-2xl font-black font-mono text-[#B45309] ml-4 whitespace-nowrap">
                  {rightValueText}
                </span>
              </div>
              {rightAnnotation && (
                <span className="text-xs font-mono font-medium text-[#64748B] mt-1 text-left">
                  {rightAnnotation}
                </span>
              )}
            </div>
          </div>
        </div>

        {bottomNote && (
          <div className="pt-4 border-t border-[#ECEAE3] flex items-center justify-center">
            <span className="text-base font-semibold text-[#525252]">
              {bottomNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

