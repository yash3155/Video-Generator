import React from 'react';
import { Scene, Beat, TemplateType } from '../types';
import { ChatStory } from './ChatStory';
import { DataVisualizer } from './DataVisualizer';
import { TugOfWar } from './TugOfWar';
import { ProgressiveCards } from './ProgressiveCards';
import { SplitComparison } from './SplitComparison';
import { InteractiveQuiz } from './InteractiveQuiz';
import { SummaryThread } from './SummaryThread';
import { StatCounter } from './StatCounter';
import { HorizontalBarRace } from './HorizontalBarRace';
import { FormulaBreakdown } from './FormulaBreakdown';
import { PayoffDiagram } from './PayoffDiagram';
import { DiagramFlow } from './DiagramFlow';

export interface CompositeComponentConfig {
  template: TemplateType;
  title?: string;
  badge?: string;
  weight?: number;
  ui_state?: any;
  visual?: any;
}

export interface CompositeLayoutData {
  layoutMode?: 'split_horizontal' | 'split_vertical';
  splitRatio?: number; // e.g. 0.55 (left is 55%)
  leftComponent?: CompositeComponentConfig;
  rightComponent?: CompositeComponentConfig;
  topComponent?: CompositeComponentConfig;
  bottomComponent?: CompositeComponentConfig;
}

export interface CompositeLayoutProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

function renderChildTemplate(template: TemplateType, props: CompositeLayoutProps) {
  switch (template) {
    case 'data_visualizer': return <DataVisualizer {...props} />;
    case 'formula_breakdown': return <FormulaBreakdown {...props} />;
    case 'progressive_cards': return <ProgressiveCards {...props} />;
    case 'split_comparison': return <SplitComparison {...props} />;
    case 'chat_story': return <ChatStory {...props} />;
    case 'tug_of_war': return <TugOfWar {...props} />;
    case 'payoff_diagram': return <PayoffDiagram {...props} />;
    case 'stat_counter': return <StatCounter {...props} />;
    case 'horizontal_bar_race': return <HorizontalBarRace {...props} />;
    case 'interactive_quiz': return <InteractiveQuiz {...props} />;
    case 'summary_thread': return <SummaryThread {...props} />;
    case 'diagram_flow':
    case 'process_flow':
    case 'timeline':
      return <DiagramFlow {...props} />;
    default:
      return <ProgressiveCards {...props} />;
  }
}

export const CompositeLayout: React.FC<CompositeLayoutProps> = (props) => {
  const { scene, beat } = props;
  const config: CompositeLayoutData =
    beat.ui_state?.compositeConfig ||
    beat.visual?.data?.compositeConfig ||
    scene.ui_state?.compositeConfig ||
    {};

  const isVertical = config.layoutMode === 'split_vertical';
  const ratio = typeof config.splitRatio === 'number' ? config.splitRatio : 0.5;

  const leftCfg = config.leftComponent || config.topComponent || {
    template: 'data_visualizer',
    title: 'Visual Representation'
  };

  const rightCfg = config.rightComponent || config.bottomComponent || {
    template: 'formula_breakdown',
    title: 'Analytical Model'
  };

  const createChildProps = (childCfg: CompositeComponentConfig): CompositeLayoutProps => {
    const subScene: Scene = {
      ...scene,
      title: childCfg.title || scene.title,
      badge: childCfg.badge || scene.badge,
      template: childCfg.template
    };

    const subBeat: Beat = {
      ...beat,
      ui_state: childCfg.ui_state || beat.ui_state,
      visual: childCfg.visual || beat.visual
    };

    return {
      ...props,
      scene: subScene,
      beat: subBeat
    };
  };

  const leftProps = createChildProps(leftCfg);
  const rightProps = createChildProps(rightCfg);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '16px',
        gap: '20px'
      }}
    >
      {/* Primary / Left Pane */}
      <div
        style={{
          flex: isVertical ? 'none' : `0 0 ${ratio * 100}%`,
          height: isVertical ? `${ratio * 100}%` : '100%',
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          position: 'relative'
        }}
      >
        {renderChildTemplate(leftCfg.template, leftProps)}
      </div>

      {/* Secondary / Right Pane */}
      <div
        style={{
          flex: isVertical ? 'none' : `0 0 ${(1 - ratio) * 100}%`,
          height: isVertical ? `${(1 - ratio) * 100}%` : '100%',
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          position: 'relative'
        }}
      >
        {renderChildTemplate(rightCfg.template, rightProps)}
      </div>
    </div>
  );
};
