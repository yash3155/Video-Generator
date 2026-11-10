// src/templates/InteractiveQuiz.tsx
import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, InteractiveQuizUI } from '../types';
import { CheckCircle2, HelpCircle, Check } from 'lucide-react';
import { getLatestCue } from '../utils/cueUtils';

interface InteractiveQuizProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  beat,
  beatFrame = 0,
}) => {
  const { fps } = useVideoConfig();

  const uiState: InteractiveQuizUI = beat.ui_state || {
    question: 'Think about this concept.',
  };

  const badgeText = uiState.badge || 'YOUR TURN · ACTIVE RECALL';

  // Phase 2B: Visual cue-driven quiz state transitions
  const spinnerCue = getLatestCue(beat, 'showThinkingSpinner', beatFrame, fps);
  const answerCue = getLatestCue(beat, 'answerReveal', beatFrame, fps);

  const hasAnswerCue = Boolean(answerCue);
  const hasAnswer =
    Boolean(uiState.answer) ||
    Boolean(uiState.isRevealed) ||
    (beat.visualCues && beat.visualCues.some((c) => c.target === 'answerReveal')
      ? hasAnswerCue
      : Boolean(uiState.answer || uiState.isRevealed));

  const showSpinner =
    !hasAnswer &&
    (spinnerCue
      ? Boolean(spinnerCue.payload !== false)
      : Boolean(uiState.showThinkingSpinner));

  const answerFrameOffset = answerCue
    ? Math.round((answerCue.atMs / 1000) * fps)
    : 0;

  const answerEntrance = spring({
    frame: beatFrame - answerFrameOffset,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const entranceSpring = spring({
    frame: beatFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const spinDegrees = (beatFrame * 6) % 360;

  const options = Array.isArray(uiState.options) && uiState.options.length > 0
    ? uiState.options
    : null;

  // Determine correct answer letter (e.g. 'A', 'B', 'C', 'D')
  const rawCorrect = (uiState.correctAnswer || uiState.answer || '').trim();
  const correctMatch = rawCorrect.match(/^([A-D])\b/i);
  const correctLetter = correctMatch ? correctMatch[1].toUpperCase() : rawCorrect.length === 1 ? rawCorrect.toUpperCase() : '';

  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative z-10 max-w-5xl mx-auto px-8 py-5">
      {/* Top Badge */}
      <div
        style={{
          opacity: entranceSpring,
          transform: `translateY(${(1 - entranceSpring) * 8}px)`,
        }}
        className="flex items-center space-x-2 shrink-0 mb-2"
      >
        <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] shadow-xs">
          <HelpCircle size={16} className="text-[#16A34A]" />
          <span>{badgeText}</span>
        </span>
      </div>

      {/* Main Question Card */}
      <div
        style={{
          opacity: entranceSpring,
          transform: `scale(${0.98 + entranceSpring * 0.02})`,
        }}
        className="w-full bg-[#FAF9F5] border-2 border-[#E8E4DA] rounded-2xl px-8 py-5 shadow-xs text-center relative overflow-hidden shrink-0 mb-4"
      >
        <p className="text-xl lg:text-2xl font-bold text-[#1E1E1E] leading-snug relative z-10 max-w-4xl mx-auto">
          {uiState.question}
        </p>
      </div>

      {/* Middle Section: Multiple Choice Options (If Provided) */}
      {options ? (
        <div className="w-full grid grid-cols-2 gap-3.5 my-auto">
          {options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const optText = String(opt).replace(/^[A-D][\)\.:\-]\s*/i, '').trim();
            const isOptionLetterMatch = correctLetter === letter;
            const isOptionTextMatch = rawCorrect && optText.toLowerCase().includes(rawCorrect.toLowerCase());
            const isThisCorrect = isOptionLetterMatch || isOptionTextMatch;

            const optSpring = spring({
              frame: beatFrame - idx * 3,
              fps,
              config: { damping: 14, stiffness: 120 },
            });

            if (hasAnswer) {
              if (isThisCorrect) {
                return (
                  <div
                    key={idx}
                    style={{
                      opacity: optSpring,
                      transform: `scale(${0.98 + optSpring * 0.03})`,
                    }}
                    className="p-4 rounded-xl bg-[#ECFDF5] border-2 border-[#10B981] shadow-md flex items-start space-x-3.5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-xs">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="text-[11px] font-mono font-bold text-[#059669] uppercase tracking-wider block mb-0.5">
                        OPTION {letter} · CORRECT
                      </span>
                      <p className="text-sm lg:text-base font-bold text-[#064E3B] leading-snug">
                        {optText}
                      </p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={idx}
                    style={{
                      opacity: optSpring * 0.45,
                    }}
                    className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs flex items-start space-x-3.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      {letter}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="text-[11px] font-mono font-semibold text-[#94A3B8] uppercase tracking-wider block mb-0.5">
                        OPTION {letter}
                      </span>
                      <p className="text-sm lg:text-base font-medium text-[#64748B] leading-snug">
                        {optText}
                      </p>
                    </div>
                  </div>
                );
              }
            }

            // Normal state (before answer is revealed)
            return (
              <div
                key={idx}
                style={{
                  opacity: optSpring,
                  transform: `translateY(${(1 - optSpring) * 8}px)`,
                }}
                className="p-4 rounded-xl bg-white border-2 border-[#E2E8F0] shadow-xs flex items-start space-x-3.5 hover:border-[#CBD5E1]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {letter}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                    OPTION {letter}
                  </span>
                  <p className="text-sm lg:text-base font-semibold text-[#1E293B] leading-snug">
                    {optText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Bottom Area: Either Thinking Spinner OR Answer Reveal */}
      <div className="w-full flex justify-center items-center min-h-[80px] shrink-0 mt-3">
        {hasAnswer ? (
          /* Answer Reveal Box */
          <div
            style={{
              opacity: answerEntrance,
              transform: `translateY(${(1 - answerEntrance) * 10}px)`,
            }}
            className="w-full bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-2xl p-4 flex items-start space-x-4 shadow-[0_8px_30px_rgba(16,185,129,0.1)]"
          >
            <div className="p-2 bg-[#DCFCE7] rounded-xl text-[#15803D] shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#166534] block mb-0.5">
                CORRECT ANSWER: OPTION {correctLetter || 'B'} · EXPLANATION
              </span>
              <p className="text-sm lg:text-base font-bold text-[#14532D] leading-snug">
                {uiState.explanation || (answerCue?.payload as string) || uiState.answer}
              </p>
            </div>
          </div>
        ) : showSpinner ? (
          /* Animated Thinking Spinner */
          <div className="flex items-center space-x-4 bg-white px-7 py-3 rounded-full border border-[#E5E0D5] shadow-sm">
            <svg
              className="w-6 h-6 text-[#16A34A]"
              viewBox="0 0 24 24"
              fill="none"
              style={{ transform: `rotate(${spinDegrees}deg)` }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-mono font-bold text-[#8B7355] tracking-widest uppercase">
              PAUSE AND CONSIDER THE SCENARIO
            </span>
          </div>
        ) : (
          /* Initial question phase prompt */
          <div className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">
            EVALUATE THE FOUR CHOICES ABOVE
          </div>
        )}
      </div>
    </div>
  );
};
