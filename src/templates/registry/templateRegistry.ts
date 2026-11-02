// src/templates/registry/templateRegistry.ts
import { TemplateType, VisualKind } from '../../types';

export type DataType =
  | 'numeric'
  | 'formula'
  | 'nodes_edges'
  | 'timeline_events'
  | 'cards'
  | 'comparison_columns'
  | 'dialogue'
  | 'quiz'
  | 'steps'
  | 'domain_finance';

export interface TemplateDefinition {
  templateId: TemplateType;
  name: string;
  description: string;
  supportedKinds: VisualKind[];
  requiredDataTypes: DataType[];
  animationTargets: string[];
  fallbackTemplateId: TemplateType;
  isDomainExtension?: boolean;
  domain?: string;
}

export const TEMPLATE_REGISTRY: Record<TemplateType, TemplateDefinition> = {
  data_visualizer: {
    templateId: 'data_visualizer',
    name: 'Data Visualizer',
    description: 'Generic data charting engine supporting lines, bars, areas, scatters, and telemetry curves.',
    supportedKinds: ['chart'],
    requiredDataTypes: ['numeric'],
    animationTargets: ['progressStep', 'activeSeriesIndex', 'annotationReveal'],
    fallbackTemplateId: 'progressive_cards',
  },
  formula_breakdown: {
    templateId: 'formula_breakdown',
    name: 'Formula Breakdown',
    description: 'Structured mathematical, scientific, and financial equations with variable chips and step substitutions.',
    supportedKinds: ['formula'],
    requiredDataTypes: ['formula'],
    animationTargets: ['activeStepIndex', 'stepEquation', 'variableHighlight'],
    fallbackTemplateId: 'progressive_cards',
  },
  diagram_flow: {
    templateId: 'diagram_flow',
    name: 'Diagram & Process Flow',
    description: 'Node-edge graphs, chronological timelines, architectures, and biological/system pipelines.',
    supportedKinds: ['diagram', 'process', 'timeline'],
    requiredDataTypes: ['nodes_edges'],
    animationTargets: ['activeNodeIds', 'activeEdgeIds', 'stepIndex'],
    fallbackTemplateId: 'progressive_cards',
  },
  process_flow: {
    templateId: 'process_flow',
    name: 'Process Flow (Alias)',
    description: 'Alias for diagram_flow focused on sequential operational workflows.',
    supportedKinds: ['process', 'diagram'],
    requiredDataTypes: ['nodes_edges'],
    animationTargets: ['activeNodeIds', 'activeEdgeIds'],
    fallbackTemplateId: 'progressive_cards',
  },
  timeline: {
    templateId: 'timeline',
    name: 'Chronological Timeline',
    description: 'Alias for diagram_flow focused on historical or milestone time sequences.',
    supportedKinds: ['timeline', 'diagram'],
    requiredDataTypes: ['nodes_edges', 'timeline_events'],
    animationTargets: ['activeNodeIds', 'stepIndex'],
    fallbackTemplateId: 'progressive_cards',
  },
  progressive_cards: {
    templateId: 'progressive_cards',
    name: 'Progressive Cards',
    description: 'Step-by-step sequential or grid concept cards with progressive reveals.',
    supportedKinds: ['cards', 'process'],
    requiredDataTypes: ['cards'],
    animationTargets: ['cardStates', 'activeCardIndex'],
    fallbackTemplateId: 'chat_story',
  },
  split_comparison: {
    templateId: 'split_comparison',
    name: 'Split Comparison',
    description: 'Side-by-side contrast of competing mental models, systems, or perspectives.',
    supportedKinds: ['comparison'],
    requiredDataTypes: ['comparison_columns'],
    animationTargets: ['rightColumnActive', 'bulletPoints'],
    fallbackTemplateId: 'progressive_cards',
  },
  chat_story: {
    templateId: 'chat_story',
    name: 'Chat Story Dialogue',
    description: 'Socratic dialogue between persona avatars exploring practical scenarios or novice errors.',
    supportedKinds: ['conversation'],
    requiredDataTypes: ['dialogue'],
    animationTargets: ['timelineReveal', 'messageIndex'],
    fallbackTemplateId: 'progressive_cards',
  },
  interactive_quiz: {
    templateId: 'interactive_quiz',
    name: 'Interactive Quiz',
    description: 'Scenario question with active recall pause spinner and praise-driven answer reveal.',
    supportedKinds: ['quiz'],
    requiredDataTypes: ['quiz'],
    animationTargets: ['showThinkingSpinner', 'answerReveal'],
    fallbackTemplateId: 'chat_story',
  },
  summary_thread: {
    templateId: 'summary_thread',
    name: 'Summary Thread',
    description: '8-step structured recap sequence with takeaways and teaser.',
    supportedKinds: ['summary'],
    requiredDataTypes: ['steps'],
    animationTargets: ['activeStepRange', 'activeStepIndex'],
    fallbackTemplateId: 'progressive_cards',
  },
  tug_of_war: {
    templateId: 'tug_of_war',
    name: 'Tug of War Balance',
    description: 'Visual balance between two competing forces, pressures, or participant groups.',
    supportedKinds: ['comparison'],
    requiredDataTypes: ['numeric'],
    animationTargets: ['trend', 'leftCount', 'rightCount'],
    fallbackTemplateId: 'split_comparison',
  },
  horizontal_bar_race: {
    templateId: 'horizontal_bar_race',
    name: 'Horizontal Bar Comparison',
    description: 'Side-by-side metric bar comparison.',
    supportedKinds: ['chart', 'comparison'],
    requiredDataTypes: ['numeric'],
    animationTargets: ['leftWeight', 'rightWeight'],
    fallbackTemplateId: 'split_comparison',
  },
  stat_counter: {
    templateId: 'stat_counter',
    name: 'Stat Counter Callout',
    description: 'Focused highlight of an impactful single statistic or threshold.',
    supportedKinds: ['chart'],
    requiredDataTypes: ['numeric'],
    animationTargets: ['numericValue'],
    fallbackTemplateId: 'progressive_cards',
  },
  payoff_diagram: {
    templateId: 'payoff_diagram',
    name: 'Option Payoff Profile (Finance Extension)',
    description: 'Derivatives profit/loss profile diagram across underlying spot prices.',
    supportedKinds: ['chart'],
    requiredDataTypes: ['numeric', 'domain_finance'],
    animationTargets: ['spotPrice', 'strikePrice'],
    fallbackTemplateId: 'data_visualizer',
    isDomainExtension: true,
    domain: 'finance',
  },
};

/**
 * Returns whether a template is allowed for a given course configuration.
 */
export function isTemplateAllowedForCourse(
  templateId: TemplateType,
  allowedTemplates: string[],
  activeDomainModules: string[] = []
): boolean {
  const def = TEMPLATE_REGISTRY[templateId];
  if (!def) return false;

  // Domain extension check
  if (def.isDomainExtension && def.domain) {
    if (!activeDomainModules.includes(def.domain)) {
      return false;
    }
  }

  return allowedTemplates.includes(templateId) || allowedTemplates.includes('*');
}

/**
 * Returns fallback template if requested template cannot be satisfied.
 */
export function getFallbackTemplate(templateId: TemplateType): TemplateType {
  const def = TEMPLATE_REGISTRY[templateId];
  return def ? def.fallbackTemplateId : 'progressive_cards';
}
