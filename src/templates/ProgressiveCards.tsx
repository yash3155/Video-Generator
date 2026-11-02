import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, ProgressiveCardsUI, ProgressiveCardItem } from '../types';
import { DynamicIcon } from '../components/DynamicIcon';
import { getLatestCue } from '../utils/cueUtils';

interface ProgressiveCardsProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

const cardColorMap: Record<
  string,
  { border: string; bg: string; iconBg: string; iconColor: string; titleColor: string }
> = {
  active_amber: {
    border: 'border-[#F59E0B] border-2 shadow-[0_4px_24px_rgba(245,158,11,0.18)]',
    bg: 'bg-[#FFFBEB]',
    iconBg: 'bg-[#FEF3C7]',
    iconColor: '#D97706',
    titleColor: 'text-[#92400E]',
  },
  active_blue: {
    border: 'border-[#3B82F6] border-2 shadow-[0_4px_24px_rgba(59,130,246,0.18)]',
    bg: 'bg-[#EFF6FF]',
    iconBg: 'bg-[#DBEAFE]',
    iconColor: '#2563EB',
    titleColor: 'text-[#1E40AF]',
  },
  active_green: {
    border: 'border-[#10B981] border-2 shadow-[0_4px_24px_rgba(16,185,129,0.18)]',
    bg: 'bg-[#F0FDF4]',
    iconBg: 'bg-[#DCFCE7]',
    iconColor: '#10B981',
    titleColor: 'text-[#166534]',
  },
  active_purple: {
    border: 'border-[#8B5CF6] border-2 shadow-[0_4px_24px_rgba(139,92,246,0.18)]',
    bg: 'bg-[#FAF5FF]',
    iconBg: 'bg-[#F3E8FF]',
    iconColor: '#8B5CF6',
    titleColor: 'text-[#6B21A8]',
  },
  active_red: {
    border: 'border-[#EF4444] border-2 shadow-[0_4px_24px_rgba(239,68,68,0.18)]',
    bg: 'bg-[#FEF2F2]',
    iconBg: 'bg-[#FEE2E2]',
    iconColor: '#EF4444',
    titleColor: 'text-[#991B1B]',
  },
  muted: {
    border: 'border-[#E5E7EB]',
    bg: 'bg-[#FAFAF9]',
    iconBg: 'bg-[#F3F4F6]',
    iconColor: '#6B7280',
    titleColor: 'text-[#1F2937]',
  },
  default: {
    border: 'border-[#E5E7EB]',
    bg: 'bg-white',
    iconBg: 'bg-[#F7F6F2]',
    iconColor: '#8B7355',
    titleColor: 'text-[#1E1E1E]',
  },
};

const activeColorCycle = [
  'active_amber',
  'active_blue',
  'active_green',
  'active_purple',
];

function resolveCardThemeKey(state: string | undefined, idx: number): string {
  if (!state) return activeColorCycle[idx % activeColorCycle.length];
  if (cardColorMap[state]) return state;
  const s = state.toLowerCase();
  if (s === 'active') return activeColorCycle[idx % activeColorCycle.length];
  if (s === 'visible' || s === 'completed' || s === 'done') return 'muted';
  if (s === 'warning' || s === 'amber') return 'active_amber';
  if (s === 'danger' || s === 'red') return 'active_red';
  if (s === 'blue') return 'active_blue';
  if (s === 'green' || s === 'teal') return 'active_green';
  if (s === 'purple') return 'active_purple';
  return activeColorCycle[idx % activeColorCycle.length];
}

export const ProgressiveCards: React.FC<ProgressiveCardsProps> = ({
  beat,
  beatIndexInScene = 0,
  beatFrame = 0,
  allBeatsInScene = [],
}) => {
  const { fps } = useVideoConfig();

  const uiState: ProgressiveCardsUI = beat.ui_state || {
    cards: [],
  };

  const isGrid = uiState.layout === 'grid';
  const allCards = uiState.cards || [];

  // Phase 2B: Visual cue-driven active card highlighting
  const activeCardCue = getLatestCue(beat, 'activeCardIndex', beatFrame, fps);
  const activeCardIdx =
    activeCardCue && activeCardCue.payload !== undefined
      ? Number(activeCardCue.payload)
      : -1;

  return (
    <div className="w-full h-full flex flex-col justify-center relative z-10 px-8 py-2 my-auto">
      <div
        className={
          isGrid
            ? 'w-full max-w-5xl mx-auto my-auto flex flex-col justify-center'
            : 'w-full max-w-4xl mx-auto my-auto flex flex-col justify-center'
        }
      >
        {uiState.sectionHeader && (
          <div className="mb-4 flex items-center justify-start">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355] bg-[#F3EFE6] px-4 py-1.5 rounded-full border border-[#E5DFD3]">
              {uiState.sectionHeader}
            </span>
          </div>
        )}

        <div
          className={
            isGrid
              ? 'grid grid-cols-2 gap-6 w-full'
              : 'flex flex-col space-y-4 w-full'
          }
        >
          {allCards.map((card: ProgressiveCardItem, idx: number) => {
            const isHidden = card.state === 'hidden';

            if (isGrid && isHidden) {
              return (
                <div
                  key={idx}
                  className="invisible pointer-events-none p-5 rounded-2xl border border-transparent min-h-[96px]"
                  aria-hidden="true"
                />
              );
            }

            if (!isGrid && isHidden) {
              return null;
            }

            let wasAlreadyVisible = false;
            if (beatIndexInScene > 0 && allBeatsInScene[beatIndexInScene - 1]) {
              const prevCards =
                (allBeatsInScene[beatIndexInScene - 1].ui_state as ProgressiveCardsUI)
                  ?.cards || [];
              if (prevCards[idx] && prevCards[idx].state !== 'hidden') {
                wasAlreadyVisible = true;
              }
            }

            let opacity = 1;
            let translateY = 0;
            let scale = 1;

            if (!wasAlreadyVisible || (beatIndexInScene === 0 && idx === 0)) {
              const delay = beatIndexInScene === 0 ? idx * 6 : 0;
              const entrance = spring({
                frame: beatFrame - delay,
                fps,
                config: { damping: 14, stiffness: 110 },
              });
              opacity = entrance;
              translateY = (1 - entrance) * 16;
              scale = 0.98 + entrance * 0.02;
            }

            // If this card is newly revealed on this beat and state was left as 'default', highlight it automatically
            const isExplicitlyActive = activeCardIdx >= 0 && idx === activeCardIdx;
            const isExplicitlyMuted = activeCardIdx >= 0 && idx !== activeCardIdx;

            const effectiveStateKey = isExplicitlyActive
              ? activeColorCycle[idx % activeColorCycle.length]
              : isExplicitlyMuted
                ? 'muted'
                : !wasAlreadyVisible && (!card.state || card.state === 'default')
                  ? activeColorCycle[idx % activeColorCycle.length]
                  : resolveCardThemeKey(card.state, idx);

            const colorTheme =
              cardColorMap[effectiveStateKey] || cardColorMap.default;

            return (
              <div
                key={idx}
                style={{
                  opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                }}
                className={`p-5 rounded-2xl border transition-all flex items-center space-x-6 min-h-[96px] ${colorTheme.bg} ${colorTheme.border}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-black/5 shadow-sm ${colorTheme.iconBg}`}
                >
                  <DynamicIcon
                    name={card.icon}
                    size={28}
                    color={colorTheme.iconColor}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3
                    className={`text-xl font-bold tracking-tight ${colorTheme.titleColor}`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-base text-[#525252] font-medium mt-0.5">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};