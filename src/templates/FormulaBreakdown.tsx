// src/templates/FormulaBreakdown.tsx
import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { Scene, Beat, FormulaSpec, FormulaVariable, FormulaStep } from '../types';
import { getLatestCue, getActiveCues } from '../utils/cueUtils';

/**
 * Universal mathematical text formatter.
 * Converts variable tokens like S_T, Payoff_Long, v_0, Q_foreign into proper subscripts,
 * and formats arithmetic operators into clean typography without raw underscores.
 */
export function formatMathText(input: string | number | undefined): React.ReactNode {
  if (input === undefined || input === null) return '';
  const str = String(input);

  // Match token with underscore notation: e.g. S_T, Payoff_Long, v_0, F_bid
  const parts = str.split(/(\b[A-Za-z0-9]+_[A-Za-z0-9]+\b)/g);
  return (
    <>
      {parts.map((part, pIdx) => {
        const subMatch = part.match(/^([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
        if (subMatch) {
          const [, base, sub] = subMatch;
          return (
            <span key={pIdx} className="inline-flex items-baseline font-mono">
              <span>{base}</span>
              <sub className="text-[0.68em] font-bold ml-[1px] relative -bottom-[0.16em] opacity-90">{sub}</sub>
            </span>
          );
        }
        // Normalize arithmetic operators for clean typography
        const normalized = part
          .replace(/\s*-\s*/g, ' − ')
          .replace(/\s*\*\s*/g, ' × ')
          .replace(/>=/g, ' ≥ ')
          .replace(/<=/g, ' ≤ ')
          .replace(/=>/g, ' ⟹ ');
        return <span key={pIdx}>{normalized}</span>;
      })}
    </>
  );
}

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

  // Normalize from either visual.data (FormulaSpec) or ui_state
  const visualData = beat.visual?.data as FormulaSpec | undefined;
  const legacyUI = (beat.ui_state || {}) as any;

  const rawExpression =
    visualData?.expression ||
    legacyUI.expression ||
    legacyUI.formula ||
    (legacyUI.resultTerm && legacyUI.leftTerm && legacyUI.rightTerm
      ? `${legacyUI.resultTerm.value || legacyUI.resultTerm.symbol || legacyUI.resultTerm.name} = ${legacyUI.leftTerm.value || legacyUI.leftTerm.symbol || legacyUI.leftTerm.name} ${legacyUI.operator || '+'} ${legacyUI.rightTerm.value || legacyUI.rightTerm.symbol || legacyUI.rightTerm.name}`
      : '');

  const rawVariables: FormulaVariable[] =
    visualData?.variables ||
    legacyUI.variables ||
    (Array.isArray(legacyUI.terms)
      ? legacyUI.terms.map((t: any) => ({
          symbol: t.symbol || t.name || 'x',
          label: t.name || t.label || t.symbol || 'Variable',
          description: t.meaning || t.description,
          value: t.value,
          unit: t.unit,
        }))
      : []);

  const rawSteps: FormulaStep[] =
    visualData?.steps ||
    legacyUI.steps ||
    (rawExpression
      ? [
          {
            stepIndex: 1,
            label: legacyUI.resultNote || 'Core Relationship',
            equation: rawExpression,
          },
        ]
      : []);

  const formulaSpec: FormulaSpec = {
    title: visualData?.title || legacyUI.formulaTitle || scene.title || 'Formula Mechanics',
    subtitle: visualData?.subtitle || legacyUI.formulaSubtitle,
    badge: visualData?.badge || legacyUI.badge || scene.badge || 'EQUATION SPECIFICATION',
    expression: rawExpression,
    variables: rawVariables,
    steps: rawSteps,
    activeStepIndex: visualData?.activeStepIndex || legacyUI.activeStepIndex || 1,
    purpose: visualData?.purpose || legacyUI.purpose || beat.visual?.semantics?.teachingObjective,
    assumptions: visualData?.assumptions || legacyUI.assumptions,
    interpretation: visualData?.interpretation || legacyUI.interpretation,
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

  // Visual cues synchronization
  const stepCue = getLatestCue(beat, 'activeStepIndex', beatFrame, fps);
  const activeStepIdx =
    stepCue && stepCue.payload !== undefined
      ? Number(stepCue.payload)
      : formulaSpec.activeStepIndex || 1;

  const activeCues = getActiveCues(beat, beatFrame, fps);
  const highlightedVars = new Set(
    activeCues
      .filter((c) => c.target === 'variableHighlight' || c.target === 'term')
      .map((c) => String(c.payload).trim())
  );

  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative z-10 px-8 py-4">
      {/* Top Header Card */}
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 10}px)`,
        }}
        className="w-full max-w-5xl flex items-center justify-between mb-3 shrink-0"
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-0.5 bg-[#B45309]" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355]">
            {formulaSpec.badge || 'EQUATION MECHANICS'}
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
      <div className="w-full max-w-5xl flex-1 bg-[#FCFCFA] border border-[#ECEAE3] rounded-3xl p-6 shadow-xs flex flex-col justify-between overflow-hidden">
        {/* Optional Purpose Banner */}
        {formulaSpec.purpose && (
          <div className="mb-3 px-4 py-1.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#92400E] uppercase tracking-wide">
              Objective:
            </span>
            <span className="text-xs font-medium text-[#78350F]">
              {formulaSpec.purpose}
            </span>
          </div>
        )}

        {/* 1. Master Formula Expression Block */}
        <div
          style={{
            opacity: eqSpring,
            transform: `scale(${0.96 + eqSpring * 0.04})`,
          }}
          className="w-full py-4 px-8 rounded-2xl bg-[#F8FAFC] border-2 border-[#CBD5E1] shadow-2xs flex items-center justify-center"
        >
          <span className="font-mono text-4xl font-black text-[#0F172A] tracking-wider text-center">
            {formatMathText(formulaSpec.expression)}
          </span>
        </div>

        {/* 2. Structured Variable Definitions Chips */}
        {formulaSpec.variables.length > 0 && (
          <div className="my-3 w-full flex items-center justify-center flex-wrap gap-2.5">
            {formulaSpec.variables.map((v: FormulaVariable, idx: number) => {
              const isVarHighlighted =
                highlightedVars.has(v.symbol) ||
                Boolean(v.label && highlightedVars.has(v.label));
              const vSpring = spring({
                frame: beatFrame - 6 - idx * 2,
                fps,
                config: { damping: 14, stiffness: 120 },
              });
              return (
                <div
                  key={v.symbol || idx}
                  style={{
                    opacity: vSpring,
                    transform: `translateY(${(1 - vSpring) * 6}px) ${isVarHighlighted ? 'scale(1.05)' : 'scale(1)'}`,
                  }}
                  className={`flex items-center rounded-xl px-3.5 py-1.5 space-x-2 transition-all duration-300 ${
                    isVarHighlighted
                      ? 'bg-[#FFFBEB] border-2 border-[#F59E0B] shadow-md ring-2 ring-[#FCD34D]/50'
                      : 'bg-white border border-[#E2E8F0] shadow-2xs'
                  }`}
                >
                  <span
                    className={`font-mono text-base font-black px-2 py-0.5 rounded-md ${
                      isVarHighlighted
                        ? 'bg-[#F59E0B] text-white'
                        : 'text-[#1E293B] bg-[#EFF6FF] border border-[#BFDBFE]'
                    }`}
                  >
                    {formatMathText(v.symbol)}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isVarHighlighted ? 'text-[#92400E]' : 'text-[#334155]'
                    }`}
                  >
                    {v.label}
                  </span>
                  {v.value !== undefined && (
                    <span className="text-xs font-mono font-semibold text-[#B45309]">
                      = {v.value}
                    </span>
                  )}
                  {v.unit && (
                    <span className="text-[11px] font-mono font-medium text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded-sm">
                      {v.unit}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Progressive Substitution Steps */}
        {formulaSpec.steps && formulaSpec.steps.length > 0 && (
          <div className="w-full flex items-center justify-center space-x-3 my-2">
            {formulaSpec.steps.map((step: FormulaStep, sIdx: number) => {
              const isStepActive = step.stepIndex === activeStepIdx;
              const stepCueForThis = getLatestCue(beat, 'activeStepIndex', beatFrame, fps);
              const cueFrameOffset =
                stepCueForThis && Number(stepCueForThis.payload) === step.stepIndex
                  ? Math.round((stepCueForThis.atMs / 1000) * fps)
                  : 10 + sIdx * 4;
              const stepSpring = spring({
                frame: beatFrame - cueFrameOffset,
                fps,
                config: { damping: 14, stiffness: 120 },
              });

              return (
                <div
                  key={step.stepIndex || sIdx}
                  style={{
                    opacity: stepSpring,
                    transform: `scale(${0.96 + stepSpring * 0.04})`,
                  }}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 shadow-2xs ${
                    isStepActive
                      ? 'bg-[#FEF3C7]/40 border-[#F59E0B] ring-2 ring-[#FCD34D]/50'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
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
                  <div className="font-mono text-lg font-black text-[#1E293B] text-center my-1">
                    {formatMathText(step.equation)}
                  </div>
                  {step.note && (
                    <p className="text-[11px] text-center text-[#78716C] mt-1 font-medium leading-tight">
                      {step.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Bottom Callout: Interpretation & Assumptions */}
        {(formulaSpec.interpretation || (formulaSpec.assumptions && formulaSpec.assumptions.length > 0)) && (
          <div className="mt-2 pt-2 border-t border-[#ECEAE3] flex items-center justify-between text-xs text-[#64748B]">
            {formulaSpec.interpretation && (
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#B45309] uppercase tracking-wider text-[10px] bg-[#FEF3C7] px-2 py-0.5 rounded-sm">
                  Interpretation:
                </span>
                <span className="font-medium text-[#334155]">{formulaSpec.interpretation}</span>
              </div>
            )}
            {formulaSpec.assumptions && formulaSpec.assumptions.length > 0 && (
              <div className="flex items-center space-x-1.5 text-[11px] text-[#78716C]">
                <span className="font-semibold text-[#475569]">Assumptions:</span>
                <span>{formulaSpec.assumptions.join(' · ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
