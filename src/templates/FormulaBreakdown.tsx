import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { Scene, Beat, FormulaBreakdownUI } from '../types';

interface FormulaBreakdownProps {
  scene: Scene;
  beat: Beat;
  beatFrame?: number;
}

export const FormulaBreakdown: React.FC<FormulaBreakdownProps> = ({
  scene,
  beat,
  beatFrame = 0,
}) => {
  const { fps } = useVideoConfig();
  const ui: FormulaBreakdownUI = beat.ui_state || {
    formulaTitle: scene.title || 'Core Quantitative Relationship',
    leftTerm: { label: 'Spot Asset', value: 'S₀' },
    operator: '×',
    rightTerm: { label: 'Compounding Factor', value: 'e^(rT)' },
    resultTerm: { label: 'Forward Price', value: 'F₀' },
    bullets: [],
  };

  const s1 = spring({ frame: beatFrame, fps, config: { damping: 14, stiffness: 120 } });
  const s2 = spring({ frame: beatFrame - 8, fps, config: { damping: 14, stiffness: 120 } });
  const s3 = spring({ frame: beatFrame - 16, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative z-10 px-8 py-4">
      <div className="max-w-5xl w-full bg-[#FCFCFA] border border-[#ECEAE3] rounded-3xl p-10 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-6 h-0.5 bg-[#B45309]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355]">
              {ui.badge || scene.badge || 'QUANTITATIVE MECHANICS'}
            </span>
          </div>
          <div className="flex items-baseline space-x-4">
            <h2 className="text-4xl font-black text-[#1E1E1E] tracking-tight">
              {ui.formulaTitle}
            </h2>
            {ui.formulaSubtitle && (
              <span className="text-lg font-medium text-[#737373]">
                {ui.formulaSubtitle}
              </span>
            )}
          </div>
        </div>

        {/* Equation Blocks */}
        <div className="my-8 flex items-center justify-start space-x-5 flex-wrap">
          {/* Left Term */}
          <div
            style={{ opacity: s1, transform: `translateY(${(1 - s1) * 14}px)` }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#525252] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 rounded-md mb-2 self-start">
              {ui.leftTerm?.label}
            </span>
            <div className="px-7 py-5 rounded-2xl bg-[#F8FAFC] border-2 border-[#CBD5E1] text-4xl font-black font-mono text-[#1E293B] text-center shadow-2xs">
              {ui.leftTerm?.value}
            </div>
          </div>

          <span className="text-3xl font-black text-[#8B7355] mt-6 px-1">
            {ui.operator || '+'}
          </span>

          {/* Right Term */}
          <div
            style={{ opacity: s2, transform: `translateY(${(1 - s2) * 14}px)` }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#525252] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 rounded-md mb-2 self-start">
              {ui.rightTerm?.label}
            </span>
            <div className="px-7 py-5 rounded-2xl bg-[#F8FAFC] border-2 border-[#CBD5E1] text-4xl font-black font-mono text-[#1E293B] text-center shadow-2xs">
              {ui.rightTerm?.value}
            </div>
          </div>

          <span className="text-3xl font-black text-[#8B7355] mt-6 px-1">
            {ui.equalsSign || '='}
          </span>

          {/* Result Term */}
          <div
            style={{ opacity: s3, transform: `translateY(${(1 - s3) * 14}px)` }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#92400E] bg-[#FEF3C7] border border-[#FCD34D] px-3 py-1 rounded-md mb-2 self-start">
              {ui.resultTerm?.label}
            </span>
            <div className="px-8 py-5 rounded-2xl bg-[#B45309] text-white text-4xl font-black font-mono text-center shadow-md">
              {ui.resultTerm?.value}
            </div>
          </div>
        </div>

        {/* Bottom Insight Pills */}
        {ui.bullets && ui.bullets.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#ECEAE3]">
            {ui.bullets.map((bText, idx) => (
              <div
                key={idx}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-sm font-semibold text-[#78350F]"
              >
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <span>{bText}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

