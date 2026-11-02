import React from 'react';
import { Scene, Beat } from '../types';
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

export interface TemplateRendererProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = (props) => {
  const { scene } = props;
  switch (scene.template) {
    case 'chat_story':
      return <ChatStory {...props} />;
    case 'data_visualizer':
      return <DataVisualizer {...props} />;
    case 'tug_of_war':
      return <TugOfWar {...props} />;
    case 'progressive_cards':
      return <ProgressiveCards {...props} />;
    case 'split_comparison':
      return <SplitComparison {...props} />;
    case 'interactive_quiz':
      return <InteractiveQuiz {...props} />;
    case 'summary_thread':
      return <SummaryThread {...props} />;
    case 'stat_counter':
      return <StatCounter {...props} />;
    case 'horizontal_bar_race':
      return <HorizontalBarRace {...props} />;
    case 'formula_breakdown':
      return <FormulaBreakdown {...props} />;
    case 'payoff_diagram':
      return <PayoffDiagram {...props} />;
    case 'diagram_flow':
    case 'process_flow':
    case 'timeline':
      return <DiagramFlow {...props} />;
    default:
      return <ChatStory {...props} />;
  }
};

export {
  ChatStory,
  DataVisualizer,
  TugOfWar,
  ProgressiveCards,
  SplitComparison,
  InteractiveQuiz,
  SummaryThread,
  StatCounter,
  HorizontalBarRace,
  FormulaBreakdown,
  PayoffDiagram,
  DiagramFlow,
};
