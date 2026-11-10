// src/templates/SummaryThread.tsx
import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, SummaryThreadUI, SummaryStepObject } from '../types';
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

interface ParsedStep {
  stepNumber: number;
  title: string;
  description: string;
  rule: string;
  fullText: string;
}

function parseStep(rawStep: string | SummaryStepObject, index: number): ParsedStep {
  const stepNumber = index + 1;
  if (!rawStep) {
    return { stepNumber, title: `Rule ${stepNumber}`, description: '', rule: '', fullText: '' };
  }

  if (typeof rawStep === 'object') {
    const num = rawStep.number || stepNumber;
    const title = rawStep.title || rawStep.rule || `Rule ${num}`;
    const description = rawStep.description || '';
    const rule = rawStep.rule || '';
    const fullText = title && description ? `${title}: ${description}` : (title || description || rule);
    return { stepNumber: num, title, description, rule, fullText };
  }

  // String case: "1. Title: Description" or "1. Rule text"
  const cleanStr = String(rawStep).replace(/^\d+[\.\)]\s*/, '').trim();
  const colonSplit = cleanStr.split(/:\s*|—\s*|-\s*/);
  if (colonSplit.length > 1) {
    const title = colonSplit[0].trim();
    const description = colonSplit.slice(1).join(' - ').trim();
    return { stepNumber, title, description, rule: '', fullText: cleanStr };
  }

  return { stepNumber, title: cleanStr, description: '', rule: '', fullText: cleanStr };
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
  const rawSteps = uiState.steps || [];
  const parsedSteps: ParsedStep[] = rawSteps.map((s, idx) => parseStep(s, idx));
  const totalStepsCount = parsedSteps.length || 8;
  const totalBeats = allBeatsInScene.length;

  const isFinalBeat = totalBeats > 1 && beatIndexInScene === totalBeats - 1;
  const isIntro = beatIndexInScene === 0;

  // Determine active step range [startStep, endStep] (1-based)
  let startStep = 1;
  let endStep = 2;

  const rawRange = uiState.activeStepRange;
  const rangeCue = getLatestCue(beat, 'activeStepRange', beatFrame, fps);

  if (rangeCue && Array.isArray(rangeCue.payload) && rangeCue.payload.length === 2) {
    startStep = Number(rangeCue.payload[0]);
    endStep = Number(rangeCue.payload[1]);
  } else if (isIntro && rawRange && rawRange[0] === 0 && rawRange[1] === 0) {
    startStep = 0;
    endStep = 0;
  } else if (isFinalBeat) {
    startStep = 1;
    endStep = totalStepsCount;
  } else if (totalBeats >= 4 && beatIndexInScene > 0 && !isFinalBeat) {
    const bodyBeatsCount = totalBeats - 2;
    const bodyBeatIdx = beatIndexInScene - 1;

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
          : Math.min(totalStepsCount, Math.floor((bodyBeatIdx + 1) * stepsPerBodyBeat));
    }
  } else if (rawRange) {
    startStep = rawRange[0];
    endStep = rawRange[1];
  }

  const showTakeaway = Boolean(uiState.bottomTakeaway) && isFinalBeat;

  const entranceSpring = spring({
    frame: beatFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const takeawayEntrance = spring({
    frame: beatFrame - 6,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Calculate current active items for progressive mode
  const activeItems = parsedSteps.filter(
    (item) => item.stepNumber >= startStep && item.stepNumber <= endStep
  );

  return (
    <div className="w-full h-full flex flex-col justify-between relative z-10 max-w-5xl mx-auto px-8 py-5">
      {/* Top Header Section */}
      <div
        style={{
          opacity: entranceSpring,
          transform: `translateY(${(1 - entranceSpring) * 10}px)`,
        }}
        className="w-full text-left flex flex-col items-start shrink-0 mb-3"
      >
        <div className="w-full flex items-center justify-between">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#FFFBEB] text-[#D97706] border border-[#FCD34D] shadow-xs">
            {headerBadge}
          </span>
          <span className="text-xs font-mono font-semibold text-[#8B7355]">
            {isFinalBeat
              ? 'WHOLE CHAPTER SYNTHESIS'
              : startStep === 0
              ? 'EXECUTIVE OVERVIEW'
              : `FOCUS: RULES ${startStep}–${endStep} OF ${totalStepsCount}`}
          </span>
        </div>
        <h2 className="text-3xl font-black text-[#1E1E1E] mt-2 tracking-tight">
          {uiState.heading || "Today's thread"}
        </h2>
      </div>

      {/* Mode A: Progressive 2-Item Focus Group (During body beats) */}
      {!isFinalBeat && (
        <div className="flex-1 flex flex-col justify-center space-y-4 my-auto w-full">
          {isIntro ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm text-center">
              <span className="text-xs font-mono font-bold text-[#D97706] uppercase tracking-wider block mb-2">
                Executive Roadmap
              </span>
              <p className="text-2xl font-bold text-[#1E293B] max-w-2xl mx-auto leading-relaxed">
                Reviewing the foundational principles and market mechanisms established in this chapter.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-2 text-xs font-mono text-[#64748B]">
                <span>{totalStepsCount} Core Takeaways</span>
                <span>•</span>
                <span>Structured Sequence</span>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {activeItems.map((item, idx) => {
                const cardSpring = spring({
                  frame: beatFrame - idx * 4,
                  fps,
                  config: { damping: 14, stiffness: 120 },
                });
                return (
                  <div
                    key={item.stepNumber}
                    style={{
                      opacity: cardSpring,
                      transform: `translateY(${(1 - cardSpring) * 12}px)`,
                    }}
                    className="w-full p-6 rounded-2xl bg-white border-2 border-[#F59E0B] shadow-md flex items-start space-x-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center font-mono font-black text-lg shrink-0 shadow-xs">
                      {item.stepNumber}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[#B45309] uppercase tracking-wider">
                          Core Rule {item.stepNumber}
                        </span>
                        {item.rule && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">
                            {item.rule}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-[#1E293B] leading-snug">
                        {item.title}
                      </h4>
                      {item.description ? (
                        <p className="text-sm font-medium text-[#475569] mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mode B: Compact Whole-Chapter 2-Column Overview (Final beat only) */}
      {isFinalBeat && (
        <div
          style={{
            opacity: entranceSpring,
            transform: `scale(${0.98 + entranceSpring * 0.02})`,
          }}
          className="flex-1 grid grid-cols-2 gap-3 my-auto w-full content-center"
        >
          {parsedSteps.map((stepItem, idx) => {
            const itemSpring = spring({
              frame: beatFrame - idx * 2,
              fps,
              config: { damping: 14, stiffness: 120 },
            });

            return (
              <div
                key={idx}
                style={{
                  opacity: itemSpring,
                  transform: `translateY(${(1 - itemSpring) * 6}px)`,
                }}
                className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs"
              >
                <div className="w-5 h-5 rounded-md bg-[#FEF3C7] text-[#B45309] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {stepItem.stepNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1E293B] block leading-tight">
                    {stepItem.title}
                  </span>
                  {stepItem.description ? (
                    <span className="text-[11px] font-medium text-[#64748B] block mt-0.5 leading-snug line-clamp-1">
                      {stepItem.description}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Takeaway Box */}
      {showTakeaway && (
        <div
          style={{
            opacity: takeawayEntrance,
            transform: `translateY(${(1 - takeawayEntrance) * 10}px)`,
          }}
          className="w-full bg-[#FFFDF7] border-2 border-[#F59E0B] rounded-2xl p-4 flex items-center space-x-4 shadow-sm shrink-0 mt-3"
        >
          <div className="p-2.5 bg-[#FEF3C7] rounded-xl text-[#D97706] shrink-0">
            <Sparkles size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B45309] block">
              FINAL TAKEAWAY PRINCIPLE
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
