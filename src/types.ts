export type DomainType = 'finance' | 'coding' | 'psychology';

export type TemplateType =
  | 'chat_story'
  | 'data_visualizer'
  | 'tug_of_war'
  | 'progressive_cards'
  | 'split_comparison'
  | 'interactive_quiz'
  | 'summary_thread';

export interface Meta {
  domain: DomainType | string;
  course: string;
  chapter: string;
  totalSegments: number;
}

export type ThemeColor = 'amber' | 'teal' | 'blue' | 'purple' | 'green' | 'red' | 'gray';

// 1. Chat Story UI Types
export interface ChatMessage {
  sender: string;
  avatar: string;
  text: string;
  theme?: ThemeColor | string;
  align?: 'left' | 'right';
}

export interface ChatTimelineItem {
  type: 'note' | 'message';
  text: string;
  sender?: string;
  avatar?: string;
  theme?: ThemeColor | string;
  align?: 'left' | 'right';
}

export interface ChatStoryUI {
  stageDirections?: string[];
  messages?: ChatMessage[];
  timeline?: ChatTimelineItem[];
}

// 2. Data Visualizer UI Types
export interface Annotation {
  type: 'price_label' | 'callout' | 'arrow' | 'label' | string;
  text: string;
  value?: number;
  candleIndex?: number;
  color?: string;
  x?: number;
  y?: number;
}

export type CardState =
  | 'active_red'
  | 'active_blue'
  | 'active_green'
  | 'active_amber'
  | 'active_purple'
  | 'muted'
  | 'default'
  | 'hidden';

export interface SideCard {
  title: string;
  subtitle: string;
  state?: CardState;
}

export interface ChartOverlay {
  type: 'trendline' | 'horizontal_level' | 'pattern_circles';
  startIndex?: number;
  endIndex?: number;
  priceLevel?: number;
  color?: string;
  label?: string;
  points?: Array<{ candleIndex: number; label?: string }>;
}

export interface DataVisualizerUI {
  chartTitle: string;
  chartSubtitle?: string;
  ticker?: string;
  timeframe?: string;
  preset: string;
  progressStep?: number;
  totalSteps?: number;
  yAxisUnit?: string;
  annotations?: Annotation[];
  sideCards?: SideCard[];
  overlays?: ChartOverlay[];
}

// 3. Tug of War UI Types
export interface BottomPill {
  text: string;
  color?: string;
}

export interface TugOfWarUI {
  leftLabel: string;
  leftCount: number;
  rightLabel: string;
  rightCount: number;
  centerTitle: string;
  centerMetric: string;
  startMetric?: string;
  trend: 'up' | 'down';
  bottomPill?: BottomPill;
}

// 4. Progressive Cards UI Types
export interface ProgressiveCardItem {
  icon?: string;
  title: string;
  subtitle: string;
  state?: 'active_amber' | 'active_blue' | 'active_green' | 'active_purple' | 'active_red' | 'muted' | 'hidden' | string;
}

export interface ProgressiveCardsUI {
  sectionHeader?: string;
  layout?: 'stack' | 'grid';
  cards: ProgressiveCardItem[];
}

// 5. Split Comparison UI Types
export interface ComparisonColumn {
  icon?: string;
  title: string;
  subtitle?: string;
  theme?: string;
  active?: boolean;
  bullets: string[];
}

export interface SplitComparisonUI {
  showVsBadge?: boolean;
  leftColumn: ComparisonColumn;
  rightColumn: ComparisonColumn;
}

// 6. Interactive Quiz UI Types
export interface InteractiveQuizUI {
  badge?: string;
  question: string;
  showThinkingSpinner?: boolean;
  answer?: string | null;
}

// 7. Summary Thread UI Types
export interface SummaryThreadUI {
  headerBadge?: string;
  heading: string;
  activeStepIndex?: number;
  activeStepRange?: [number, number];
  steps: string[];
  bottomTakeaway?: string;
}

export type UIState =
  | ChatStoryUI
  | DataVisualizerUI
  | TugOfWarUI
  | ProgressiveCardsUI
  | SplitComparisonUI
  | InteractiveQuizUI
  | SummaryThreadUI
  | any;

export interface Beat {
  id: string;
  hindi_tts?: string;
  en_subtitle: string;
  pauseAfterMs?: number;
  audioFile?: string;
  audioDurationSec?: number;
  durationInFrames?: number;
  ui_state: UIState;
}

export interface Scene {
  segmentIndex: number;
  title: string;
  template: TemplateType;
  badge?: string;
  beats: Beat[];
}

export interface Episode {
  meta: Meta;
  scenes: Scene[];
}

export interface PersonaProfile {
  name: string;
  avatar: string;
  role: string;
  theme: string;
}

export interface DomainPersona {
  novice: PersonaProfile;
  mentor: PersonaProfile;
  context: string;
  visualizerPresets: string[];
  keepEnglishTerms: string[];
}
