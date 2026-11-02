import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, TugOfWarUI } from '../types';
import { User, TrendingUp, TrendingDown } from 'lucide-react';

interface TugOfWarProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

export const TugOfWar: React.FC<TugOfWarProps> = ({
  beat,
  beatFrame = 0,
}) => {
  const { fps } = useVideoConfig();

  const uiState: TugOfWarUI = beat.ui_state || {
    leftLabel: 'Buyers',
    leftCount: 20,
    rightLabel: 'Sellers',
    rightCount: 2,
    centerTitle: 'KESAR PAINTS',
    centerMetric: '₹158',
    trend: 'up',
  };

  const isUp = uiState.trend === 'up';

  const indicatorSpring = spring({
    frame: beatFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const scalePercent = isUp
    ? 50 - indicatorSpring * 26
    : 50 + indicatorSpring * 26;

  const rawLeft = Math.max(0, Number(uiState.leftCount) || 0);
  const rawRight = Math.max(0, Number(uiState.rightCount) || 0);
  const totalRaw = rawLeft + rawRight || 1;
  const leftCount =
    rawLeft > 25 || rawRight > 25
      ? Math.max(1, Math.round((rawLeft / totalRaw) * 24))
      : Math.min(25, rawLeft);
  const rightCount =
    rawLeft > 25 || rawRight > 25
      ? Math.max(1, Math.round((rawRight / totalRaw) * 24))
      : Math.min(25, rawRight);

  // Auto-scale centerMetric font size so multi-word strings ("Crowd Belief") never wrap or collide with the icon
  const metricText = String(uiState.centerMetric || '');
  const metricFontClass =
    metricText.length > 10
      ? 'text-xl font-extrabold'
      : metricText.length > 6
        ? 'text-2xl font-black'
        : 'text-4xl font-black';

  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative z-10 px-8 py-4">
      <div className="w-full flex-1 flex items-center justify-between gap-12">
        {/* LEFT COLUMN */}
        <div className="flex-1 h-full flex flex-col justify-between py-2">
          <div>
            <div className="flex items-baseline justify-between mb-2 pb-1 border-b border-[#E5E7EB]">
              <span className="text-3xl font-black tracking-tight text-[#166534]">
                {uiState.leftLabel}
              </span>
              <span className="text-4xl font-black font-mono text-[#16A34A]">
                {uiState.leftCount}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#16A34A] rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (uiState.leftCount /
                      (uiState.leftCount + uiState.rightCount || 1)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-y-4 gap-x-3 my-auto max-h-[320px] p-1">
            {Array.from({ length: leftCount }).map((_, idx) => {
              const iconEntrance = spring({
                frame: beatFrame - idx * 2,
                fps,
                config: { damping: 12, stiffness: 140 },
              });

              return (
                <div
                  key={idx}
                  style={{
                    opacity: iconEntrance,
                    transform: `scale(${iconEntrance})`,
                  }}
                  className="flex items-center justify-center text-[#16A34A]"
                >
                  <User size={38} strokeWidth={2.4} className="fill-[#16A34A]" />
                </div>
              );
            })}
          </div>

          <div className="h-4" />
        </div>

        {/* CENTER COLUMN */}
        <div className="w-72 h-full bg-[#FAFAF8] rounded-3xl border-2 border-[#E8E6DF] p-6 flex flex-col items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-center w-full">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355] block truncate">
              {uiState.centerTitle}
            </span>
            <div className="flex items-center justify-center space-x-2 mt-1.5">
              <span
                className={`${metricFontClass} font-mono tracking-tight text-[#1E1E1E] whitespace-nowrap`}
              >
                {metricText}
              </span>
              {isUp ? (
                <div className="bg-[#DCFCE7] p-1.5 rounded-full text-[#16A34A] shrink-0">
                  <TrendingUp size={22} strokeWidth={3} />
                </div>
              ) : (
                <div className="bg-[#FEE2E2] p-1.5 rounded-full text-[#DC2626] shrink-0">
                  <TrendingDown size={22} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>

          {/* Vertical Ladder / Scale with Motion Trail */}
          <div className="relative w-28 h-64 my-auto bg-white rounded-2xl border border-[#E5E5E0] flex items-center justify-center p-3 shadow-inner">
            <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-1.5 bg-[#EAE8E1] rounded-full" />

            <div
              className="absolute left-1/2 -translate-x-1/2 w-1.5 bg-[#CBD5E1] rounded-full"
              style={{
                top: isUp ? `${scalePercent}%` : '50%',
                height: `${Math.abs(scalePercent - 50)}%`,
              }}
            />

            <div className="absolute top-6 bottom-6 left-0 right-0 flex flex-col justify-between px-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full flex items-center justify-between ${
                    i === 4 ? 'opacity-90' : 'opacity-40'
                  }`}
                >
                  <div className="h-0.5 w-3 bg-[#8B7355] rounded-full" />
                  <div className="h-0.5 w-3 bg-[#8B7355] rounded-full" />
                </div>
              ))}
            </div>

            <div
              className="absolute left-0 right-0 flex items-center justify-center transition-all"
              style={{
                top: `${scalePercent}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <div
                className={`w-9 h-9 rounded-full border-4 shadow-lg flex items-center justify-center ${
                  isUp
                    ? 'bg-[#16A34A] border-white shadow-[#16A34A]/40'
                    : 'bg-[#DC2626] border-white shadow-[#DC2626]/40'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              isUp
                ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]'
                : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]'
            }`}
          >
            TREND: {uiState.trend.toUpperCase()}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 h-full flex flex-col justify-between py-2">
          <div>
            <div className="flex items-baseline justify-between mb-2 pb-1 border-b border-[#E5E7EB]">
              <span className="text-3xl font-black tracking-tight text-[#991B1B]">
                {uiState.rightLabel}
              </span>
              <span className="text-4xl font-black font-mono text-[#DC2626]">
                {uiState.rightCount}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#DC2626] rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (uiState.rightCount /
                      (uiState.leftCount + uiState.rightCount || 1)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-y-4 gap-x-3 my-auto max-h-[320px] p-1">
            {Array.from({ length: rightCount }).map((_, idx) => {
              const iconEntrance = spring({
                frame: beatFrame - idx * 2,
                fps,
                config: { damping: 12, stiffness: 140 },
              });

              return (
                <div
                  key={idx}
                  style={{
                    opacity: iconEntrance,
                    transform: `scale(${iconEntrance})`,
                  }}
                  className="flex items-center justify-center text-[#DC2626]"
                >
                  <User size={38} strokeWidth={2.4} className="fill-[#DC2626]" />
                </div>
              );
            })}
          </div>

          <div className="h-4" />
        </div>
      </div>

      {/* Bottom Pill Callout */}
      {uiState.bottomPill && (
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-6 py-2 rounded-full text-base font-semibold tracking-wide shadow-sm border ${
              uiState.bottomPill.color === 'green' || uiState.bottomPill.color === 'teal'
                ? 'bg-[#F0FDF4] text-[#166534] border-[#86EFAC]'
                : uiState.bottomPill.color === 'red'
                  ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]'
                  : 'bg-[#FFFBEB] text-[#92400E] border-[#FCD34D]'
            }`}
          >
            {uiState.bottomPill.text}
          </span>
        </div>
      )}
    </div>
  );
};