// src/adapters/legacyVisualAdapter.ts
import {
  Beat,
  Scene,
  VisualSpec,
  ChartSpec,
  ChartSeries,
  FormulaSpec,
  DiagramSpec,
} from '../types';
import { FINANCE_CHART_PRESETS } from '../domain/finance/financePresets';

/**
 * Adapts any beat to guarantee a valid, structured VisualSpec.
 * If the beat already provides a structured `visual`, it is returned directly.
 * Otherwise, legacy `ui_state` is adapted deterministically without mutating original data.
 */
export function adaptBeatToVisualSpec(
  beat: Beat,
  scene: Scene,
  domain = 'finance'
): VisualSpec {
  if (beat.visual) {
    return beat.visual;
  }

  const template = scene.template;
  const ui = (beat.ui_state || {}) as Record<string, any>;
  const baseSemantics = {
    teachingObjective: scene.title || 'Core pedagogical concept',
    sourceFactIds: [],
  };

  switch (template) {
    case 'data_visualizer': {
      const presetName = ui.preset || 'uptrend_then_drop';
      const presetData = FINANCE_CHART_PRESETS[presetName] || FINANCE_CHART_PRESETS.uptrend_then_drop;
      const unit = ui.yAxisUnit || presetData.unit || (domain === 'finance' ? '₹' : '');

      let series: ChartSeries[] = [];
      if (presetData.candlesticks && presetData.candlesticks.length > 0) {
        series.push({
          id: 'series-candles',
          name: ui.chartTitle || scene.title || 'Market Action',
          type: 'candlestick',
          data: presetData.candlesticks.map((c, idx) => ({
            x: c.label || idx,
            y: c.close,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            label: c.label,
          })),
        });
      }

      const annotations = (ui.annotations || []).map((ann: any) => ({
        type: ann.type || 'callout',
        text: ann.text || '',
        x: ann.candleIndex !== undefined ? ann.candleIndex : ann.x,
        y: ann.value !== undefined ? ann.value : ann.y,
        color: ann.color,
      }));

      const chartSpec: ChartSpec = {
        chartType: presetData.type === 'candlestick' ? 'candlestick' : 'line',
        title: ui.chartTitle || scene.title,
        subtitle: ui.chartSubtitle,
        xAxis: {
          label: 'Timeline',
        },
        yAxis: {
          unit,
          min: presetData.minY,
          max: presetData.maxY,
        },
        series,
        annotations,
        accessibilityText: `${ui.chartTitle || scene.title} data chart`,
      };

      return {
        kind: 'chart',
        data: chartSpec,
        semantics: {
          ...baseSemantics,
          teachingObjective: `Visualize trend dynamics for ${scene.title}`,
        },
      };
    }

    case 'formula_breakdown': {
      const left = ui.leftTerm || { label: 'Spot', value: 'S' };
      const right = ui.rightTerm || { label: 'Strike', value: 'K' };
      const res = ui.resultTerm || { label: 'Payoff', value: 'C' };
      const op = ui.operator || '-';

      const formulaSpec: FormulaSpec = {
        title: ui.formulaTitle || scene.title || 'Formula Mechanics',
        subtitle: ui.formulaSubtitle,
        badge: ui.badge || scene.badge,
        expression: `${res.value} = ${left.value} ${op} ${right.value}`,
        variables: [
          { symbol: left.value, label: left.label, description: left.label },
          { symbol: right.value, label: right.label, description: right.label },
          { symbol: res.value, label: res.label, description: res.label },
        ],
        steps: [
          {
            stepIndex: 1,
            label: 'Governing Relationship',
            equation: `${res.value} = ${left.value} ${op} ${right.value}`,
          },
        ],
        activeStepIndex: 1,
      };

      return {
        kind: 'formula',
        data: formulaSpec,
        semantics: {
          ...baseSemantics,
          teachingObjective: `Explain formula mechanics for ${scene.title}`,
        },
      };
    }

    case 'diagram_flow':
    case 'process_flow':
    case 'timeline': {
      const diagramSpec: DiagramSpec = {
        title: ui.title || scene.title,
        subtitle: ui.subtitle,
        badge: scene.badge,
        layout: ui.layout || 'linear_horizontal',
        nodes: ui.nodes || [],
        edges: ui.edges || [],
        activeNodeIds: ui.activeNodeIds || [],
        activeEdgeIds: ui.activeEdgeIds || [],
      };

      return {
        kind: template === 'timeline' ? 'timeline' : 'diagram',
        data: diagramSpec,
        semantics: {
          ...baseSemantics,
          teachingObjective: `Illustrate sequential process for ${scene.title}`,
        },
      };
    }

    case 'progressive_cards': {
      return {
        kind: 'cards',
        data: {
          sectionHeader: ui.sectionHeader,
          layout: ui.layout || 'grid',
          cards: ui.cards || [],
        },
        semantics: {
          ...baseSemantics,
          teachingObjective: `Structured concepts for ${scene.title}`,
        },
      };
    }

    case 'split_comparison': {
      return {
        kind: 'comparison',
        data: {
          showVsBadge: ui.showVsBadge,
          leftColumn: ui.leftColumn,
          rightColumn: ui.rightColumn,
        },
        semantics: {
          ...baseSemantics,
          teachingObjective: `Comparative contrast for ${scene.title}`,
        },
      };
    }

    case 'chat_story': {
      return {
        kind: 'conversation',
        data: {
          messages: ui.messages || [],
          timeline: ui.timeline || [],
        },
        semantics: {
          ...baseSemantics,
          teachingObjective: `Practical scenario exploration for ${scene.title}`,
        },
      };
    }

    case 'interactive_quiz': {
      return {
        kind: 'quiz',
        data: {
          question: ui.question,
          answer: ui.answer,
          showThinkingSpinner: ui.showThinkingSpinner,
        },
        semantics: {
          ...baseSemantics,
          teachingObjective: `Active recall test for ${scene.title}`,
        },
      };
    }

    case 'summary_thread': {
      return {
        kind: 'summary',
        data: {
          headerBadge: ui.headerBadge,
          heading: ui.heading,
          steps: ui.steps || [],
          activeStepRange: ui.activeStepRange,
          bottomTakeaway: ui.bottomTakeaway,
        },
        semantics: {
          ...baseSemantics,
          teachingObjective: `Thread recap for ${scene.title}`,
        },
      };
    }

    default: {
      return {
        kind: 'cards',
        data: {
          sectionHeader: scene.title,
          cards: [
            {
              title: scene.title,
              subtitle: beat.en_subtitle || 'Educational takeaway',
              state: 'active_blue',
            },
          ],
        },
        semantics: {
          ...baseSemantics,
          teachingObjective: `Clarify ${scene.title}`,
        },
      };
    }
  }
}

