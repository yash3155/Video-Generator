export type DomainType = 'finance' | 'coding' | 'psychology';

export type TemplateType =
  | 'chat_story'
  | 'data_visualizer'
  | 'tug_of_war'
  | 'progressive_cards'
  | 'split_comparison'
  | 'interactive_quiz'
  | 'summary_thread'
  | 'stat_counter'
  | 'horizontal_bar_race'
  | 'formula_breakdown'
  | 'payoff_diagram'
  | 'diagram_flow'
  | 'process_flow'
  | 'timeline';

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
  | 'active_teal'
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

// 8. Stat Counter UI Types
export interface StatCounterUI {
  sectionTag?: string;
  topLabel: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  subtext?: string;
  bottomPill?: string;
}

// 9. Horizontal Bar Race UI Types
export interface HorizontalBarRaceUI {
  sectionTag?: string;
  title: string;
  leftHeader: string;
  leftValueText: string;
  leftWeight: number;
  rightHeader: string;
  rightValueText: string;
  rightWeight: number;
  bottomNote?: string;
}

// 10. Formula Breakdown UI Types
export interface FormulaBreakdownUI {
  badge?: string;
  formulaTitle: string;
  formulaSubtitle?: string;
  leftTerm: { label: string; value: string };
  operator: string;
  rightTerm: { label: string; value: string };
  equalsSign?: string;
  resultTerm: { label: string; value: string };
  bullets?: string[];
}

// 11. Payoff Diagram UI Types
export interface PayoffDiagramUI {
  chartTitle: string;
  chartSubtitle?: string;
  strategyType:
    | 'long_call'
    | 'short_call'
    | 'long_put'
    | 'short_put'
    | 'bull_spread'
    | 'bear_spread'
    | 'straddle'
    | 'strangle'
    | 'protective_put'
    | 'covered_call';
  strikePrice: number;
  premium: number;
  secondStrike?: number;
  secondPremium?: number;
  spotPrice?: number;
  sideCards?: SideCard[];
}

export type UIState =
  | ChatStoryUI
  | DataVisualizerUI
  | TugOfWarUI
  | ProgressiveCardsUI
  | SplitComparisonUI
  | InteractiveQuizUI
  | SummaryThreadUI
  | StatCounterUI
  | HorizontalBarRaceUI
  | FormulaBreakdownUI
  | PayoffDiagramUI
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
  visual?: VisualSpec;
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

// ===================================================================
// Phase 1 Source-Grounded Lesson Architecture Types
// ===================================================================

export interface SourceCitation {
  book: string;
  chapter?: string;
  section?: string;
  page?: number | string;
  excerpt?: string;
  provenance?: 'notebooklm_query' | 'historical_episode_extraction' | 'verified_book_excerpt';
}

export interface FormulaVariable {
  symbol: string;
  definition?: string;
  label?: string;
  value?: string | number;
  unit?: string;
  description?: string;
  color?: string;
}

export interface FormulaDetails {
  name: string;
  latex?: string;
  variables: FormulaVariable[];
  assumptions?: string[];
}

export interface NumericalDetails {
  values: Record<string, number | string>;
  units?: string;
  contractSize?: number | string;
  context: string;
}

export interface PayoffVsProfit {
  distinctionType: 'payoff' | 'profit' | 'both' | 'not_applicable';
  formulaPayoff?: string;
  formulaProfit?: string;
  premiumConsidered?: boolean;
  explanation?: string;
}

export interface SourceFactItem {
  id: string; // e.g. "fact-01"
  category:
    | 'definition'
    | 'claim'
    | 'formula'
    | 'numerical_example'
    | 'case_study'
    | 'assumption'
    | 'market_rule';
  topic: string;
  statement: string;
  sourceCitation: SourceCitation;
  formulaDetails?: FormulaDetails;
  numericalDetails?: NumericalDetails;
  payoffVsProfit?: PayoffVsProfit;
  tags?: string[];
}

export interface SourceFacts {
  schemaVersion: '1.0.0';
  chapterSlug: string;
  notebookId: string;
  sourceId: string;
  retrievalTimestamp: string;
  bookTitle: string;
  facts: SourceFactItem[];
  generalAssumptions: string[];
  rawExcerpts?: string[];
}

export interface AuditFinding {
  code: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category:
    | 'source_coverage'
    | 'missing_definitions'
    | 'prerequisites'
    | 'numerical_examples'
    | 'formula_variables'
    | 'units'
    | 'signs'
    | 'contract_sizes'
    | 'assumptions'
    | 'payoff_vs_profit'
    | 'generic_filler';
  message: string;
  targetFactId?: string;
  targetSceneIndex?: number;
  suggestedRemedy?: string;
}

export interface ContentAudit {
  schemaVersion: '1.0.0';
  chapterSlug: string;
  auditTimestamp: string;
  status: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';
  summary: {
    totalFacts: number;
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    coveragePercentage: number;
  };
  checklist: {
    sourceCoverageValid: boolean;
    missingDefinitionsResolved: boolean;
    prerequisitesIdentified: boolean;
    numericalExamplesGrounded: boolean;
    formulaVariablesDefined: boolean;
    unitsSpecified: boolean;
    signsConsistent: boolean;
    contractSizesStated: boolean;
    assumptionsExplicit: boolean;
    payoffVsProfitDistinguished: boolean;
    zeroGenericFiller: boolean;
  };
  findings: AuditFinding[];
  blockingReason?: string | null;
}

export interface LessonPlanSection {
  sectionIndex: number;
  title: string;
  pedagogicalObjective: string;
  groundedFactIds: string[];
  keyPoints: string[];
  formulaUsed?: string;
  numericalApplication?: string;
}

export interface LessonPlan {
  schemaVersion: '1.0.0';
  chapterSlug: string;
  title: string;
  targetAudiencePersona: string;
  prerequisites: string[];
  learningOutcomes: string[];
  sections: LessonPlanSection[];
  misconceptions: Array<{
    misconception: string;
    factId: string;
    authorRebuttal: string;
  }>;
  activeRecallQuiz: {
    scenario: string;
    testedFactIds: string[];
    question: string;
    correctAnswer: string;
    explanation: string;
  };
  coreTakeaways: string[];
}

export interface StoryboardBeatOutline {
  beatIndex: number;
  textOutline: string;
  sourceFactIds: string[];
  speaker?: string;
  visualNote?: string;
}

export interface StoryboardScene {
  sceneIndex: number;
  title: string;
  template: TemplateType;
  concept: string;
  sourceFactIds: string[];
  beatOutlines: StoryboardBeatOutline[];
  takeaways?: string[];
}

export interface Storyboard {
  schemaVersion: '1.0.0';
  chapterSlug: string;
  course: string;
  chapterTitle: string;
  approvedFactIds: string[];
  scenes: StoryboardScene[];
  summarySteps: string[];
  bottomTakeaway: string;
}

// ===================================================================
// Phase 2A: Generic Course Configuration & Structured Visual Engine
// ===================================================================

export interface CoursePersona {
  name: string;
  avatar: string;
  role: string;
  theme: string;
}

export interface CourseVisualTheme {
  primaryColor: string;
  accentColor: string;
  fontFamily?: string;
  backgroundColor?: string;
  cardBackground?: string;
  textColor?: string;
  mutedColor?: string;
}

export interface UnitsAndFormats {
  defaultUnit?: string;
  allowedUnits?: string[];
  numberNotation?: 'standard' | 'indian' | 'scientific';
  decimalPlaces?: number;
  formatters?: Record<string, string>;
}

export interface CourseConfig {
  schemaVersion: '1.0.0';
  courseId: string;
  bookTitle: string;
  subject: string;
  audience?: string;
  narrationLanguage?: string;
  visualTheme: CourseVisualTheme;
  allowedTemplates: string[];
  domainModules?: string[];
  terminologyGlossary?: Record<string, { definition: string; phoneticHint?: string }>;
  unitsAndFormats?: UnitsAndFormats;
  visualPreferences?: {
    gridDot?: boolean;
    animationSpeed?: 'standard' | 'snappy';
    cardRounding?: string;
  };
  persona?: {
    novice?: CoursePersona;
    mentor?: CoursePersona;
    contextDescription?: string;
  };
}

export type VisualKind =
  | 'chart'
  | 'formula'
  | 'diagram'
  | 'comparison'
  | 'timeline'
  | 'process'
  | 'cards'
  | 'conversation'
  | 'quiz'
  | 'summary';

export interface VisualSemantics {
  teachingObjective: string;
  sourceFactIds: string[];
  importantValues?: string[];
  relationships?: string[];
}

export interface ChartAxis {
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  categories?: string[];
  formatter?: string;
}

export interface ChartDataPoint {
  x: number | string;
  y: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  label?: string;
}

export interface ChartSeries {
  id: string;
  name: string;
  type?: 'line' | 'bar' | 'area' | 'scatter' | 'candlestick';
  color?: string;
  data: ChartDataPoint[];
}

export interface ChartAnnotation {
  type: 'label' | 'callout' | 'highlight' | 'threshold' | 'arrow' | 'pill';
  text: string;
  x?: number | string;
  y?: number;
  color?: string;
}

export interface ChartSpec {
  chartType: 'line' | 'bar' | 'area' | 'scatter' | 'candlestick' | 'histogram' | 'timeline' | 'custom';
  title?: string;
  subtitle?: string;
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  series: ChartSeries[];
  annotations?: ChartAnnotation[];
  accessibilityText?: string;
  domainExtension?: Record<string, unknown>;
}

export interface FormulaStep {
  stepIndex: number;
  label: string;
  equation: string;
  substitutions?: Record<string, string | number>;
  note?: string;
}

export interface FormulaSpec {
  title: string;
  badge?: string;
  subtitle?: string;
  expression: string;
  variables: FormulaVariable[];
  steps?: FormulaStep[];
  activeStepIndex?: number;
}

export interface DiagramNode {
  id: string;
  label: string;
  subtitle?: string;
  state?: 'default' | 'active' | 'success' | 'warning' | 'error' | 'muted';
  icon?: string;
  x?: number;
  y?: number;
  group?: string;
}

export interface DiagramEdge {
  id?: string;
  from: string;
  to: string;
  label?: string;
  directional?: boolean;
  style?: 'solid' | 'dashed';
  active?: boolean;
}

export interface DiagramSpec {
  title?: string;
  subtitle?: string;
  badge?: string;
  layout?: 'linear_horizontal' | 'linear_vertical' | 'grid' | 'timeline' | 'cyclic';
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  activeNodeIds?: string[];
  activeEdgeIds?: string[];
  highlights?: string[];
}

export interface VisualSpec<T = unknown> {
  kind: VisualKind;
  data: T;
  semantics: VisualSemantics;
}


