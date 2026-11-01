import React from 'react';
import { Scene, Beat } from '../types';
import { ChatStory } from './ChatStory';
import { DataVisualizer } from './DataVisualizer';
import { TugOfWar } from './TugOfWar';
import { ProgressiveCards } from './ProgressiveCards';
import { SplitComparison } from './SplitComparison';
import { InteractiveQuiz } from './InteractiveQuiz';
import { SummaryThread } from './SummaryThread';

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
};
