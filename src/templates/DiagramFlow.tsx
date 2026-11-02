// src/templates/DiagramFlow.tsx
import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { Scene, Beat, DiagramSpec, DiagramNode } from '../types';
import { DynamicIcon } from '../components/DynamicIcon';

interface DiagramFlowProps {
  scene: Scene;
  beat: Beat;
  beatFrame?: number;
}

const nodeStateStyles: Record<
  string,
  { bg: string; border: string; text: string; subtext: string; badgeBg: string; ring: string }
> = {
  active: {
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#3B82F6]',
    text: 'text-[#1E40AF]',
    subtext: 'text-[#2563EB]',
    badgeBg: 'bg-[#DBEAFE]',
    ring: 'ring-4 ring-[#93C5FD]/40',
  },
  success: {
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#10B981]',
    text: 'text-[#166534]',
    subtext: 'text-[#059669]',
    badgeBg: 'bg-[#DCFCE7]',
    ring: 'ring-4 ring-[#86EFAC]/40',
  },
  warning: {
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#F59E0B]',
    text: 'text-[#92400E]',
    subtext: 'text-[#D97706]',
    badgeBg: 'bg-[#FEF3C7]',
    ring: 'ring-4 ring-[#FDE68A]/40',
  },
  error: {
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#EF4444]',
    text: 'text-[#991B1B]',
    subtext: 'text-[#DC2626]',
    badgeBg: 'bg-[#FEE2E2]',
    ring: 'ring-4 ring-[#FCA5A5]/40',
  },
  muted: {
    bg: 'bg-[#F9FAFB]',
    border: 'border-[#E5E7EB]',
    text: 'text-[#9CA3AF]',
    subtext: 'text-[#D1D5DB]',
    badgeBg: 'bg-[#F3F4F6]',
    ring: '',
  },
  default: {
    bg: 'bg-[#FFFFFF]',
    border: 'border-[#E5E7EB]',
    text: 'text-[#1F2937]',
    subtext: 'text-[#6B7280]',
    badgeBg: 'bg-[#F3F4F6]',
    ring: '',
  },
};

export const DiagramFlow: React.FC<DiagramFlowProps> = ({
  scene,
  beat,
  beatFrame = 0,
}) => {
  const { fps } = useVideoConfig();

  // Support either beat.visual?.data (typed) or beat.ui_state (legacy/direct)
  const diagramSpec: DiagramSpec = (beat.visual?.data as DiagramSpec) ||
    beat.ui_state || {
      title: scene.title || 'System Workflow',
      layout: 'linear_horizontal',
      nodes: [
        { id: 'n1', label: 'Input State', subtitle: 'Initial Condition', state: 'default' },
        { id: 'n2', label: 'Transformation', subtitle: 'Processing Rule', state: 'active' },
        { id: 'n3', label: 'Output State', subtitle: 'Terminal Result', state: 'default' },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: 'Process' },
        { from: 'n2', to: 'n3', label: 'Result' },
      ],
      activeNodeIds: ['n2'],
      activeEdgeIds: [],
    };

  const nodes = diagramSpec.nodes || [];
  const edges = diagramSpec.edges || [];
  const activeNodeSet = new Set(diagramSpec.activeNodeIds || []);
  const layout = diagramSpec.layout || 'linear_horizontal';

  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative z-10 px-8 py-4">
      {/* Header Info */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-0.5 bg-[#C86D51]" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B7355]">
            {diagramSpec.badge || scene.badge || 'PROCESS ARCHITECTURE'}
          </span>
        </div>
        {diagramSpec.subtitle && (
          <span className="text-sm font-semibold text-[#737373] bg-[#EAE8E1]/40 px-3 py-1 rounded-full">
            {diagramSpec.subtitle}
          </span>
        )}
      </div>

      {/* Main Diagram Canvas */}
      <div className="w-full max-w-6xl flex-1 flex items-center justify-center relative overflow-hidden bg-[#FAFAF8] border border-[#ECEAE3] rounded-3xl p-8 shadow-xs">
        {layout === 'timeline' ? (
          <TimelineLayout
            nodes={nodes}
            activeNodeSet={activeNodeSet}
            beatFrame={beatFrame}
            fps={fps}
          />
        ) : (
          <FlowLayout
            nodes={nodes}
            edges={edges}
            activeNodeSet={activeNodeSet}
            layout={layout}
            beatFrame={beatFrame}
            fps={fps}
          />
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// Flow & Horizontal Pipeline Layout
// -------------------------------------------------------------------
interface FlowLayoutProps {
  nodes: DiagramNode[];
  edges: DiagramSpec['edges'];
  activeNodeSet: Set<string>;
  layout: string;
  beatFrame: number;
  fps: number;
}

const FlowLayout: React.FC<FlowLayoutProps> = ({
  nodes,
  edges,
  activeNodeSet,
  beatFrame,
  fps,
}) => {
  return (
    <div className="w-full flex items-center justify-center space-x-6 flex-wrap gap-y-8">
      {nodes.map((node, idx) => {
        const isActive = activeNodeSet.has(node.id) || node.state === 'active';
        const effectiveState = isActive ? 'active' : node.state || 'default';
        const st = nodeStateStyles[effectiveState] || nodeStateStyles.default;

        const nodeSpring = spring({
          frame: beatFrame - idx * 4,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const connectedEdge = edges.find((e) => e.from === node.id);

        return (
          <React.Fragment key={node.id}>
            {/* Node Card */}
            <div
              style={{
                opacity: nodeSpring,
                transform: `scale(${0.9 + nodeSpring * 0.1}) translateY(${(1 - nodeSpring) * 12}px)`,
              }}
              className={`min-w-[220px] max-w-[280px] p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm flex flex-col justify-between ${st.bg} ${st.border} ${st.ring}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${st.badgeBg} ${st.text}`}>
                  {node.group || `STEP ${idx + 1}`}
                </span>
                {node.icon && (
                  <DynamicIcon name={node.icon} className={`w-5 h-5 ${st.text}`} />
                )}
              </div>

              <div>
                <h3 className={`text-xl font-bold leading-tight ${st.text}`}>
                  {node.label}
                </h3>
                {node.subtitle && (
                  <p className={`text-sm mt-1 font-medium ${st.subtext}`}>
                    {node.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Connecting Edge Arrow */}
            {idx < nodes.length - 1 && (
              <div className="flex flex-col items-center justify-center px-1">
                {connectedEdge?.label && (
                  <span className="text-xs font-mono font-semibold text-[#737373] mb-1">
                    {connectedEdge.label}
                  </span>
                )}
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                  <path
                    d="M2 12H34M34 12L24 4M34 12L24 20"
                    stroke={isActive ? '#3B82F6' : '#9CA3AF'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// -------------------------------------------------------------------
// Chronological Timeline Layout
// -------------------------------------------------------------------
interface TimelineLayoutProps {
  nodes: DiagramNode[];
  activeNodeSet: Set<string>;
  beatFrame: number;
  fps: number;
}

const TimelineLayout: React.FC<TimelineLayoutProps> = ({
  nodes,
  activeNodeSet,
  beatFrame,
  fps,
}) => {
  return (
    <div className="w-full relative flex flex-col justify-center items-center py-6">
      {/* Central horizontal line */}
      <div className="absolute w-[90%] h-1.5 bg-[#E5E7EB] rounded-full top-[50%] -translate-y-1/2 z-0" />

      {/* Nodes arranged along track */}
      <div className="w-full flex items-center justify-between relative z-10 px-4">
        {nodes.map((node, idx) => {
          const isActive = activeNodeSet.has(node.id) || node.state === 'active';
          const effectiveState = isActive ? 'active' : node.state || 'default';
          const st = nodeStateStyles[effectiveState] || nodeStateStyles.default;

          const nodeSpring = spring({
            frame: beatFrame - idx * 6,
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const isTop = idx % 2 === 0;

          return (
            <div
              key={node.id}
              style={{
                opacity: nodeSpring,
                transform: `translateY(${(1 - nodeSpring) * (isTop ? -15 : 15)}px)`,
              }}
              className="flex flex-col items-center max-w-[200px]"
            >
              {/* Top Card (if alternate) */}
              {isTop && (
                <div
                  className={`mb-4 p-4 rounded-xl border-2 shadow-xs text-center ${st.bg} ${st.border} ${st.ring}`}
                >
                  <span className="text-xs font-mono font-bold text-[#8B7355] block mb-1">
                    {node.group || `T-${idx + 1}`}
                  </span>
                  <h4 className={`text-base font-bold ${st.text}`}>{node.label}</h4>
                  {node.subtitle && (
                    <p className={`text-xs mt-1 ${st.subtext}`}>{node.subtitle}</p>
                  )}
                </div>
              )}

              {/* Central Timeline Milestone Pin */}
              <div
                className={`w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-md ${
                  isActive ? 'bg-[#3B82F6] scale-125' : 'bg-[#9CA3AF]'
                } transition-all duration-300`}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Bottom Card (if alternate) */}
              {!isTop && (
                <div
                  className={`mt-4 p-4 rounded-xl border-2 shadow-xs text-center ${st.bg} ${st.border} ${st.ring}`}
                >
                  <span className="text-xs font-mono font-bold text-[#8B7355] block mb-1">
                    {node.group || `T-${idx + 1}`}
                  </span>
                  <h4 className={`text-base font-bold ${st.text}`}>{node.label}</h4>
                  {node.subtitle && (
                    <p className={`text-xs mt-1 ${st.subtext}`}>{node.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
