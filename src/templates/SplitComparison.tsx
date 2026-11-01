import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, SplitComparisonUI, ComparisonColumn } from '../types';
import { DynamicIcon } from '../components/DynamicIcon';

interface SplitComparisonProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

const columnThemeStyles: Record<
  string,
  {
    activeBorder: string;
    activeBg: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  blue: {
    activeBorder: 'border-[#3B82F6] border-2 shadow-[0_8px_30px_rgba(59,130,246,0.12)]',
    activeBg: 'bg-[#F8FAFC]',
    iconBg: 'bg-[#DBEAFE]',
    iconColor: '#2563EB',
    titleColor: 'text-[#1E40AF]',
  },
  amber: {
    activeBorder: 'border-[#F59E0B] border-2 shadow-[0_8px_30px_rgba(245,158,11,0.12)]',
    activeBg: 'bg-[#FFFDF9]',
    iconBg: 'bg-[#FEF3C7]',
    iconColor: '#D97706',
    titleColor: 'text-[#92400E]',
  },
  green: {
    activeBorder: 'border-[#10B981] border-2 shadow-[0_8px_30px_rgba(16,185,129,0.12)]',
    activeBg: 'bg-[#F0FDF4]',
    iconBg: 'bg-[#DCFCE7]',
    iconColor: '#10B981',
    titleColor: 'text-[#166534]',
  },
  purple: {
    activeBorder: 'border-[#8B5CF6] border-2 shadow-[0_8px_30px_rgba(139,92,246,0.12)]',
    activeBg: 'bg-[#FAF5FF]',
    iconBg: 'bg-[#F3E8FF]',
    iconColor: '#8B5CF6',
    titleColor: 'text-[#6B21A8]',
  },
};

const renderColumn = (
  col: ComparisonColumn,
  isLeft: boolean,
  frame: number,
  fps: number,
  shouldAnimateEntrance: boolean,
  isHidden: boolean
) => {
  if (isHidden) {
    return (
      <div className="flex-1 h-full opacity-0 pointer-events-none" aria-hidden="true" />
    );
  }

  const theme =
    columnThemeStyles[col.theme || (isLeft ? 'blue' : 'amber')] ||
    columnThemeStyles.blue;
  const isActive = col.active !== false;

  let opacity = 1;
  let translateY = 0;

  if (shouldAnimateEntrance) {
    const colEntrance = spring({
      frame,
      fps,
      config: { damping: 16, stiffness: 100 },
    });
    opacity = colEntrance;
    translateY = (1 - colEntrance) * 16;
  }

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
      className={`flex-1 h-full rounded-3xl p-8 flex flex-col justify-between transition-all ${
        isActive
          ? `${theme.activeBg} ${theme.activeBorder}`
          : 'bg-[#FAFAF9] border border-[#E5E7EB] opacity-60'
      }`}
    >
      {/* Column Header */}
      <div>
        <div className="flex items-center space-x-4 mb-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-black/5 shadow-sm ${theme.iconBg}`}
          >
            <DynamicIcon name={col.icon} size={28} color={theme.iconColor} />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold tracking-tight ${
                isActive ? theme.titleColor : 'text-[#404040]'
              }`}
            >
              {col.title}
            </h2>
            {col.subtitle && (
              <p className="text-sm text-[#737373] font-medium mt-0.5">
                {col.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="h-0.5 w-full bg-[#EAE8E1] my-3" />
      </div>

      {/* Bullets List */}
      <div className="flex-1 flex flex-col justify-center space-y-3.5 my-2">
        {col.bullets.map((bullet, bIdx) => {
          return (
            <div
              key={bIdx}
              className="flex items-start space-x-3 bg-white/85 p-3.5 rounded-xl border border-[#EFECE6] shadow-xs"
            >
              <span className="text-lg font-semibold text-[#1E1E1E] leading-snug">
                {bullet}
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-1" />
    </div>
  );
};

export const SplitComparison: React.FC<SplitComparisonProps> = ({
  beat,
  beatIndexInScene = 0,
  beatFrame = 0,
}) => {
  const { fps } = useVideoConfig();

  const uiState: SplitComparisonUI = beat.ui_state || {
    showVsBadge: true,
    leftColumn: { title: 'Left', bullets: [] },
    rightColumn: { title: 'Right', bullets: [] },
  };

  const isFirstBeat = beatIndexInScene === 0;

  // If on beat 0 and right column is inactive with empty bullets, hide it completely
  const isRightHidden =
    beatIndexInScene === 0 &&
    uiState.rightColumn.active === false &&
    (!uiState.rightColumn.bullets || uiState.rightColumn.bullets.length === 0);

  // Right column animates entrance when it first reveals (on beat 1 if hidden on beat 0)
  const shouldAnimateRight =
    beatIndexInScene === 1 || (beatIndexInScene === 0 && !isRightHidden);

  const vsEntrance = spring({
    frame: beatFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div className="w-full h-full flex items-center justify-between gap-8 relative z-10 px-4 py-2">
      {/* Left Column */}
      {renderColumn(uiState.leftColumn, true, beatFrame, fps, isFirstBeat, false)}

      {/* Center VS Badge (only when both columns are visible) */}
      {uiState.showVsBadge && !isRightHidden && (
        <div
          style={{
            opacity: vsEntrance,
            transform: `translate(-50%, -50%) scale(${vsEntrance})`,
          }}
          className="absolute left-1/2 top-1/2 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="w-14 h-14 rounded-full bg-[#C86D51] text-white font-black text-xl flex items-center justify-center shadow-[0_8px_25px_rgba(200,109,81,0.4)] border-4 border-white tracking-widest font-mono">
            VS
          </div>
        </div>
      )}

      {/* Right Column */}
      {renderColumn(uiState.rightColumn, false, beatFrame, fps, shouldAnimateRight, isRightHidden)}
    </div>
  );
};
