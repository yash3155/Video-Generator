import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, SummaryThreadUI } from '../types';
import { Sparkles } from 'lucide-react';
import { getLatestCue } from '../utils/cueUtils';

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

  const headerBadge = uiState.headerBadge || 'CHAPTER SUMMARY · THE WHOLE PICTURE';
  const steps = uiState.steps || [];
  const totalStepsCount = steps.length || 8;
  const totalBeats = allBeatsInScene.length;

  const isFinalBeat = totalBeats > 1 && beatIndexInScene === totalBeats - 1;
  const isFirstBeat = beatIndexInScene === 0;

  // Determine active step range [startStep, endStep] (1-based)
  let startStep = 1;
  let endStep = 2;

  const rawRange = uiState.activeStepRange;
  // Phase 2B: Visual cue-driven active step range
  const rangeCue = getLatestCue(beat, 'activeStepRange', beatFrame, fps);
  if (
    rangeCue &&
    Array.isArray(rangeCue.payload) &&
    rangeCue.payload.length === 2
  ) {
    startStep = Number(rangeCue.payload[0]);
    endStep = Number(rangeCue.payload[1]);
  } else if (isFirstBeat && rawRange && rawRange[0] === 0 && rawRange[1] === 0) {
    // Dedicated intro beat: all steps muted
    startStep = 0;
    endStep = 0;
  } else if (isFinalBeat) {
    // Final takeaway beat: all steps completed
    startStep = 1;
    endStep = totalStepsCount;
  } else if (totalBeats >= 4 && beatIndexInScene > 0 && !isFinalBeat) {
    // Deterministically partition steps across the body beats [1 .. totalBeats - 2]
    // so no step is EVER skipped and 4 steps never light up when there are enough beats!
    const bodyBeatsCount = totalBeats - 2; // excluding Beat 0 (intro) and Final Beat (takeaway)
    const bodyBeatIdx = beatIndexInScene - 1; // 0-indexed body beat

    // Check if the rawRange in JSON is already a valid 1-or-2 step 1-based range
    const isValidNarrowRange =
      rawRange &&
      rawRange[0] >= 1 &&
      rawRange[1] >= rawRange[0] &&
      rawRange[1] - rawRange[0] <= 2 &&
      rawRange[1] <= totalStepsCount;

    if (isValidNarrowRange && bodyBeatsCount >= 3) {
      startStep = rawRange![0];
      endStep = rawRange![1];
    } else {
      const stepsPerBodyBeat = totalStepsCount / Math.max(1, bodyBeatsCount);
      startStep = Math.floor(bodyBeatIdx * stepsPerBodyBeat) + 1;
      endStep =
        bodyBeatIdx === bodyBeatsCount - 1
          ? totalStepsCount
          : Math.min(
              totalStepsCount,
              Math.floor((bodyBeatIdx + 1) * stepsPerBodyBeat)
            );
    }
  } else if (rawRange) {
    startStep = rawRange[0];
    endStep = rawRange[1];
  }

  const showTakeaway = Boolean(uiState.bottomTakeaway) && isFinalBeat;

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
          {uiState.heading || "Today's thread"}
        </h2>
      </div>

      {/* Clean, Left-Aligned Vertical List */}
      <div className="flex-1 flex flex-col justify-center space-y-2 my-auto">
        {steps.map((stepText, idx) => {
          const stepNumber = idx + 1;
          // Strip any leading "1. " or "2. " if the LLM duplicated step numbers inside stepText
          const cleanStepText = String(stepText).replace(/^\d+\.\s*/, '');

          const isCompletedAll = isFinalBeat;
          const isIntro = startStep === 0 && endStep === 0;
          const isActive =
            !isIntro &&
            !isCompletedAll &&
            stepNumber >= startStep &&
            stepNumber <= endStep;
          const isPassed =
            !isIntro && (isCompletedAll || stepNumber < startStep);

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

              <p
                className={`text-base tracking-tight leading-snug break-words ${
                  isActive
                    ? 'text-[#92400E] font-bold text-[17px]'
                    : isPassed
                      ? 'text-[#262626] font-medium'
                      : 'text-[#6B7280] font-normal'
                }`}
              >
                {cleanStepText}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Takeaway Box */}
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