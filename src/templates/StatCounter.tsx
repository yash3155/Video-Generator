import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { Scene, Beat, StatCounterUI } from '../types';

interface StatCounterProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

export const StatCounter: React.FC<StatCounterProps> = ({
  scene,
  beat,
  beatFrame = 0,
}) => {
  const { fps } = useVideoConfig();
  const ui: StatCounterUI = beat.ui_state || {
    topLabel: scene.title || 'Key Metric',
    numericValue: 100,
    prefix: '',
    suffix: '',
  };

  const countProgress = interpolate(beatFrame, [0, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const targetVal = Number(ui.numericValue) || 0;
  const isDecimal = !Number.isInteger(targetVal);
  const currentVal = isDecimal
    ? (targetVal * countProgress).toFixed(1)
    : Math.round(targetVal * countProgress).toLocaleString('en-IN');

  const cardSpring = spring({
    frame: beatFrame,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative z-10 px-12 py-6">
      <div
        style={{
          opacity: cardSpring,
          transform: `translateY(${(1 - cardSpring) * 18}px)`,
        }}
        className="max-w-4xl w-full flex flex-col items-start justify-center my-auto bg-[#FCFCFA] border border-[#ECEAE3] rounded-3xl p-12 shadow-sm"
      >
        {(ui.sectionTag || scene.badge) && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-6 h-0.5 bg-[#B45309]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355]">
              {ui.sectionTag || scene.badge}
            </span>
          </div>
        )}

        <p className="text-2xl font-medium text-[#525252] mb-3 leading-snug">
          {ui.topLabel}
        </p>

        <div className="text-8xl font-black tracking-tight text-[#B45309] font-mono leading-none py-2">
          {ui.prefix || ''}
          {currentVal}
          {ui.suffix ? ` ${ui.suffix}` : ''}
        </div>

        {ui.subtext && (
          <p className="text-xl font-semibold text-[#1E1E1E] mt-5 leading-relaxed">
            {ui.subtext}
          </p>
        )}

        {ui.bottomPill && (
          <div className="mt-6 inline-flex items-center px-4 py-2 rounded-xl bg-[#FFFBEB] border border-[#FCD34D] text-sm font-mono font-bold text-[#92400E]">
            {ui.bottomPill}
          </div>
        )}
      </div>
    </div>
  );
};

