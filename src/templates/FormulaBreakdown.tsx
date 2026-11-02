// src/templates/FormulaBreakdown.tsx
import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { Scene, Beat, FormulaSpec, FormulaVariable, FormulaStep } from '../types';

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

  // Normalize from either visual.data (FormulaSpec) or legacy ui_state
  const visualData = beat.visual?.data as FormulaSpec | undefined;
  const legacyUI = (beat.ui_state || {}) as any;

  const formulaSpec: FormulaSpec = visualData || {
    title: legacyUI.formulaTitle || scene.title || 'Quantitative Mechanics',
    subtitle: legacyUI.formulaSubtitle,
    badge: legacyUI.badge || scene.badge || 'EQUATION MECHANICS',
    expression:
      legacyUI.expression ||
      (legacyUI.resultTerm && legacyUI.leftTerm && legacyUI.rightTerm
        ? `${legacyUI.resultTerm.value} = ${legacyUI.leftTerm.value} ${legacyUI.operator || '+'} ${legacyUI.rightTerm.value}`
        : 'F = m · a'),
    variables: legacyUI.variables || [
      ...(legacyUI.leftTerm
        ? [{ symbol: legacyUI.leftTerm.value, label: legacyUI.leftTerm.label }]
        : [{ symbol: 'm', label: 'Mass', unit: 'kg' }]),
      ...(legacyUI.rightTerm
        ? [{ symbol: legacyUI.rightTerm.value, label: legacyUI.rightTerm.label }]
        : [{ symbol: 'a', label: 'Acceleration', unit: 'm/s²' }]),
      ...(legacyUI.resultTerm
        ? [{ symbol: legacyUI.resultTerm.value, label: legacyUI.resultTerm.label }]
        : [{ symbol: 'F', label: 'Net Force', unit: 'N' }]),
    ],
    steps: legacyUI.steps || [
      {
        stepIndex: 1,
        label: 'Fundamental Equation',
        equation:
          legacyUI.expression ||
          (legacyUI.resultTerm && legacyUI.leftTerm && legacyUI.rightTerm
            ? `${legacyUI.resultTerm.value} = ${legacyUI.leftTerm.value} ${legacyUI.operator || '+'} ${legacyUI.rightTerm.value}`
            : 'F = m · a'),
      },
    ],
    activeStepIndex: legacyUI.activeStepIndex || 1,
  };

  const titleSpring = spring({
    frame: beatFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const eqSpring = spring({
    frame: beatFrame - 4,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const activeStepIdx = formulaSpec.activeStepIndex || 1;

  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative z-10 px-8 py-4">
      {/* Top Header Card */}
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 10}px)`,
        }}
        className="w-full max-w-5xl flex items-center justify-between mb-4 shrink-0"
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-0.5 bg-[#B45309]" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355]">
            {formulaSpec.badge || scene.badge || 'EQUATION MECHANICS'}
          </span>
        </div>
        <div className="flex items-baseline space-x-3">
          <h2 className="text-3xl font-black text-[#1E1E1E] tracking-tight">
            {formulaSpec.title}
          </h2>
          {formulaSpec.subtitle && (
            <span className="text-base font-medium text-[#737373]">
              {formulaSpec.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Center Container: Expression + Variables + Progressive Steps */}
      <div className="w-full max-w-5xl flex-1 bg-[#FCFCFA] border border-[#ECEAE3] rounded-3xl p-8 shadow-xs flex flex-col justify-between overflow-hidden">
        {/* 1. Master Formula Expression Block */}
        <div
          style={{
            opacity: eqSpring,
            transform: `scale(${0.96 + eqSpring * 0.04})`,
          }}
          className="w-full py-5 px-8 rounded-2xl bg-[#F8FAFC] border-2 border-[#CBD5E1] shadow-2xs flex items-center justify-center"
        >
          <span className="font-mono text-4xl font-black text-[#0F172A] tracking-wider text-center">
            {formulaSpec.expression}
          </span>
        </div>

        {/* 2. Structured Variable Definitions Chips */}
        <div className="my-5 w-full flex items-center justify-center flex-wrap gap-3">
          {formulaSpec.variables.map((v: FormulaVariable, idx: number) => {
            const vSpring = spring({
              frame: beatFrame - 8 - idx * 3,
              fps,
              config: { damping: 14, stiffness: 120 },
            });
            return (
              <div
                key={v.symbol}
                style={{
                  opacity: vSpring,
                  transform: `translateY(${(1 - vSpring) * 8}px)`,
                }}
                className="flex items-center bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 shadow-2xs space-x-2"
              >
                <span className="font-mono text-lg font-black text-[#1E293B] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md">
                  {v.symbol}
                </span>
                <span className="text-sm font-bold text-[#334155]">{v.label}</span>
                {v.value !== undefined && (
                  <span className="text-sm font-mono font-semibold text-[#B45309]">
                    = {v.value}
                  </span>
                )}
                {v.unit && (
                  <span className="text-xs font-mono font-medium text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded-sm">
                    {v.unit}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Progressive Substitution Steps */}
        <div className="w-full flex items-center justify-center space-x-4">
          {(formulaSpec.steps || []).map((step: FormulaStep, sIdx: number) => {
            const isStepActive = step.stepIndex === activeStepIdx;
            const stepSpring = spring({
              frame: beatFrame - 12 - sIdx * 4,
              fps,
              config: { damping: 14, stiffness: 120 },
            });

            return (
              <div
                key={step.stepIndex}
                style={{
                  opacity: stepSpring,
                  transform: `scale(${0.96 + stepSpring * 0.04})`,
                }}
                className={`flex-1 p-5 rounded-2xl border-2 transition-all duration-300 shadow-2xs ${
                  isStepActive
                    ? 'bg-[#FEF3C7]/40 border-[#F59E0B] ring-2 ring-[#FCD34D]/50'
                    : 'bg-[#F8FAFC] border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      isStepActive
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    STEP {step.stepIndex}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B]">
                    {step.label}
                  </span>
                </div>
                <div className="font-mono text-xl font-black text-[#1E293B] text-center my-1">
                  {step.equation}
                </div>
                {step.note && (
                  <p className="text-xs text-center text-[#78716C] mt-2 font-medium">
                    {step.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
