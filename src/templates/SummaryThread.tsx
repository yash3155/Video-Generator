import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, SummaryThreadUI } from '../types';
import { Sparkles } from 'lucide-react';

interface SummaryThreadProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

export const SummaryThread: React.FC<SummaryThreadProps> = ({
  beat,
  beatIndexInScene = 0,
  beatFrame = 0,
  allBeatsInScene = [],
}) => {
  const { fps } = useVideoConfig();

  const uiState: SummaryThreadUI = beat.ui_state || {
    heading: "Today's thread",
    steps: [],
    activeStepIndex: 1,
  };

  const headerBadge = uiState.headerBadge || 'CHAPTER 1 · THE WHOLE PICTURE';
  const steps = uiState.steps || [];

  // Determine active step range [start, end]
  const range = uiState.activeStepRange;
  const startStep = range ? range[0] : (uiState.activeStepIndex || 1);
  const endStep = range ? range[1] : (uiState.activeStepIndex || 1);

  // Show bottom takeaway box ONLY on the final takeaway beat of the recap scene
  const isFinalBeat =
    allBeatsInScene.length > 0 &&
    beatIndexInScene === allBeatsInScene.length - 1;

  const showTakeaway =
    Boolean(uiState.bottomTakeaway) && (isFinalBeat || startStep > steps.length);

  const takeawayEntrance = spring({
    frame: beatFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div className="w-full h-full flex flex-col justify-between relative z-10 max-w-4xl mx-auto px-6 py-2 my-auto">
      {/* Top Header Section */}
      <div className="text-left flex flex-col items-start shrink-0 mb-2">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#FFFBEB] text-[#D97706] border border-[#FCD34D] shadow-xs">
          {headerBadge}
        </span>
        <h2 className="text-3xl font-black text-[#1E1E1E] mt-1.5 tracking-tight">
          {uiState.heading}
        </h2>
      </div>

      {/* Clean, Left-Aligned Vertical List (No Card Borders) */}
      <div className="flex-1 flex flex-col justify-center space-y-2 my-auto">
        {steps.map((stepText, idx) => {
          const stepNumber = idx + 1;

          // On final beat, all steps are completed
          const isCompletedAll = isFinalBeat || startStep > steps.length;
          const isIntro = startStep === 0 && endStep === 0;
          const isActive = !isIntro && !isCompletedAll && stepNumber >= startStep && stepNumber <= endStep;
          const isPassed = !isIntro && (isCompletedAll || stepNumber < startStep);

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3.5 py-1 px-1 transition-all ${
                isActive
                  ? 'opacity-100 font-bold'
                  : isPassed
                    ? 'opacity-90'
                    : 'opacity-40'
              }`}
            >
              {/* Step Number Circle */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#F59E0B] text-white shadow-xs'
                    : isPassed
                      ? 'bg-[#FEF3C7] text-[#B45309]'
                      : 'bg-[#F3F4F6] text-[#9CA3AF]'
                }`}
              >
                {stepNumber}
              </div>

              {/* Step Text */}
              <p
                className={`text-base tracking-tight leading-snug break-words ${
                  isActive
                    ? 'text-[#92400E] font-bold text-[17px]'
                    : isPassed
                      ? 'text-[#262626] font-medium'
                      : 'text-[#6B7280] font-normal'
                }`}
              >
                {stepText}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Takeaway Box: Hidden during steps 1 to 8, only enters on final beat */}
      {showTakeaway && (
        <div
          style={{
            opacity: takeawayEntrance,
            transform: `translateY(${(1 - takeawayEntrance) * 12}px)`,
          }}
          className="w-full bg-[#FFFDF7] border-2 border-[#F59E0B] rounded-xl p-3.5 flex items-center space-x-3.5 shadow-sm shrink-0 mt-3"
        >
          <div className="p-2 bg-[#FEF3C7] rounded-lg text-[#D97706] shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B45309] block">
              TAKEAWAY PRINCIPLE
            </span>
            <p className="text-base font-extrabold text-[#78350F] leading-snug break-words">
              {uiState.bottomTakeaway}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
