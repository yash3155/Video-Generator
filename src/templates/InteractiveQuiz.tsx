import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, InteractiveQuizUI } from '../types';
import { CheckCircle2, HelpCircle } from 'lucide-react';
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

  const badgeText = uiState.badge || 'YOUR TURN';

  // Phase 2B: Visual cue-driven quiz state transitions
  const spinnerCue = getLatestCue(beat, 'showThinkingSpinner', beatFrame, fps);
  const answerCue = getLatestCue(beat, 'answerReveal', beatFrame, fps);

  const hasAnswerCue = Boolean(answerCue);
  const hasAnswer =
    Boolean(uiState.answer) &&
    (beat.visualCues && beat.visualCues.some((c) => c.target === 'answerReveal')
      ? hasAnswerCue
      : Boolean(uiState.answer));

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

  const spinDegrees = (beatFrame * 6) % 360;

  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative z-10 max-w-4xl mx-auto px-6 py-6">
      {/* Top Badge */}
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-mono font-bold tracking-wider uppercase bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] shadow-sm">
          <HelpCircle size={18} className="text-[#16A34A]" />
          <span>{badgeText}</span>
        </span>
      </div>

      {/* Main Question Card */}
      <div className="my-auto w-full bg-[#FAF9F5] border-2 border-[#E8E4DA] rounded-3xl p-10 shadow-sm text-center relative overflow-hidden">
        <span className="absolute -top-6 left-6 text-9xl text-[#E8E4DA]/60 font-serif select-none pointer-events-none">
          “
        </span>

        <p className="text-2xl lg:text-3xl font-bold text-[#1E1E1E] leading-snug relative z-10 max-w-3xl mx-auto">
          {uiState.question}
        </p>
      </div>

      {/* Bottom Area: Either Thinking Spinner OR Answer Reveal */}
      <div className="w-full flex justify-center items-center min-h-[90px]">
        {hasAnswer ? (
          /* Answer Reveal Box */
          <div
            style={{
              opacity: answerEntrance,
              transform: `translateY(${(1 - answerEntrance) * 14}px)`,
            }}
            className="w-full bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-2xl p-6 flex items-start space-x-4 shadow-[0_8px_30px_rgba(16,185,129,0.1)]"
          >
            <div className="p-2 bg-[#DCFCE7] rounded-xl text-[#15803D] shrink-0">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#166534]">
                KEY INSIGHT / ANSWER
              </span>
              <p className="text-xl font-bold text-[#14532D] mt-0.5 leading-snug">
                {(answerCue?.payload as string) || uiState.answer}
              </p>
            </div>
          </div>
        ) : showSpinner ? (
          /* Animated Thinking Spinner */
          <div className="flex items-center space-x-4 bg-white px-8 py-3.5 rounded-full border border-[#E5E0D5] shadow-sm">
            <svg
              className="w-7 h-7 text-[#16A34A]"
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
            <span className="text-lg font-mono font-semibold text-[#8B7355] tracking-wide uppercase">
              PAUSE AND THINK
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
