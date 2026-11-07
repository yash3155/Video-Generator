// src/orchestrator/diversityEngine.mjs
/**
 * Visual Diversity & Anti-Repetition Engine
 * Evaluates template recurrence across scenes, prevents visual monotony,
 * and dynamically recommends adaptive compositions based on concept topology.
 */

import { TEMPLATE_REGISTRY } from '../schemas/templateRegistrySchema.mjs';

export const CONCEPT_TOPOLOGIES = {
  HISTORICAL_DILEMMA: 'historical_dilemma',
  COMPETING_FORCES: 'competing_forces',
  STRUCTURAL_ROADMAP: 'structural_roadmap',
  SYSTEM_COMPARISON: 'system_comparison',
  CONTINUOUS_METRIC: 'continuous_metric',
  QUANTITATIVE_FORMULA: 'quantitative_formula',
  PAYOFF_PROFILE: 'payoff_profile',
  PROCEDURAL_WORKFLOW: 'procedural_workflow',
  SYSTEMIC_CRISIS: 'systemic_crisis',
  ACTIVE_RECALL: 'active_recall',
  PRACTICAL_SYNTHESIS: 'practical_synthesis',
  PROGRESSIVE_SUMMARY: 'progressive_summary'
};

/**
 * Evaluates the visual diversity of a sequence of scenes.
 * @param {object[]} scenes - Array of scene objects with .template property
 * @param {object} options - Optional configuration overrides
 * @returns {object} - Diversity audit report
 */
export function evaluateVisualDiversity(scenes = [], options = {}) {
  const maxSaturation = options.maxSaturation ?? 0.30; // Max 30% for any single template
  const minUniqueTemplates = options.minUniqueTemplates ?? 5; // At least 5 distinct formats per chapter
  const findings = [];

  if (!Array.isArray(scenes) || scenes.length === 0) {
    return {
      status: 'EMPTY',
      diversityScore: 0,
      uniqueTemplateCount: 0,
      findings: ['No scenes provided for diversity analysis.']
    };
  }

  const templateCounts = {};
  const consecutiveIdentical = [];

  scenes.forEach((scene, idx) => {
    const tId = scene.template || 'unknown';
    templateCounts[tId] = (templateCounts[tId] || 0) + 1;

    // Check consecutive identical templates
    if (idx > 0) {
      const prev = scenes[idx - 1];
      if (prev.template === tId && !scene.pedagogicalContinuation && !prev.pedagogicalContinuation) {
        consecutiveIdentical.push({
          sceneIndex: idx,
          template: tId,
          sceneTitles: [prev.title, scene.title]
        });
      }
    }
  });

  const uniqueTemplates = Object.keys(templateCounts);
  const totalScenes = scenes.length;

  // 1. Consecutive Duplicates Check
  if (consecutiveIdentical.length > 0) {
    consecutiveIdentical.forEach((dup) => {
      findings.push({
        code: 'DIV_CONSECUTIVE_DUPLICATE',
        severity: 'WARNING',
        message: `Consecutive identical template "${dup.template}" in Scene ${dup.sceneIndex} ("${dup.sceneTitles[1]}") following Scene ${dup.sceneIndex - 1}.`
      });
    });
  }

  // 2. Minimum Unique Formats Check
  if (uniqueTemplates.length < minUniqueTemplates) {
    findings.push({
      code: 'DIV_LOW_VARIETY',
      severity: 'WARNING',
      message: `Only ${uniqueTemplates.length} distinct visual templates used across ${totalScenes} scenes (minimum recommended is ${minUniqueTemplates}).`
    });
  }

  // 3. Template Saturation Check
  uniqueTemplates.forEach((tId) => {
    const ratio = templateCounts[tId] / totalScenes;
    if (ratio > maxSaturation) {
      findings.push({
        code: 'DIV_TEMPLATE_SATURATION',
        severity: 'WARNING',
        message: `Template "${tId}" represents ${Math.round(ratio * 100)}% of the chapter (exceeds ${Math.round(maxSaturation * 100)}% saturation limit).`
      });
    }
  });

  // Calculate composite diversity score (0.0 to 1.0)
  const varietyScore = Math.min(1.0, uniqueTemplates.length / 7);
  const consecutivePenalty = consecutiveIdentical.length * 0.15;
  const saturationPenalty = findings.filter((f) => f.code === 'DIV_TEMPLATE_SATURATION').length * 0.1;
  const rawScore = varietyScore - consecutivePenalty - saturationPenalty;
  const diversityScore = Math.max(0.1, Math.min(1.0, Math.round(rawScore * 100) / 100));

  let status = 'OPTIMAL';
  if (diversityScore < 0.6) status = 'REPETITIVE';
  else if (diversityScore < 0.8) status = 'ACCEPTABLE';

  return {
    status,
    diversityScore,
    uniqueTemplateCount: uniqueTemplates.length,
    totalScenes,
    templateDistribution: templateCounts,
    consecutiveDuplicateCount: consecutiveIdentical.length,
    findings
  };
}

/**
 * Recommends an adaptive visual template or composite composition for a given concept topology.
 * Filters out recently used templates to prevent consecutive monotony.
 * @param {object} params
 * @param {string} params.topology - Key from CONCEPT_TOPOLOGIES
 * @param {string} params.domain - e.g. 'finance', 'technical_analysis', 'computer_science'
 * @param {string[]} params.recentlyUsedTemplates - Last 1-2 templates used in preceding scenes
 * @param {string[]} params.allowedTemplates - From course JSON configuration
 * @returns {object} - Recommended visual direction
 */
export function recommendAdaptiveVisual({
  topology,
  domain = 'finance',
  recentlyUsedTemplates = [],
  allowedTemplates = ['*']
}) {
  const isAllowed = (t) => allowedTemplates.includes('*') || allowedTemplates.includes(t);
  const lastUsed = recentlyUsedTemplates[recentlyUsedTemplates.length - 1];

  // Candidates mapped by concept topology
  const topologyCandidateMap = {
    [CONCEPT_TOPOLOGIES.HISTORICAL_DILEMMA]: ['chat_story', 'progressive_cards', 'stat_counter'],
    [CONCEPT_TOPOLOGIES.COMPETING_FORCES]: ['tug_of_war', 'split_comparison', 'horizontal_bar_race'],
    [CONCEPT_TOPOLOGIES.STRUCTURAL_ROADMAP]: ['progressive_cards', 'diagram_flow', 'timeline'],
    [CONCEPT_TOPOLOGIES.SYSTEM_COMPARISON]: ['split_comparison', 'tug_of_war', 'horizontal_bar_race'],
    [CONCEPT_TOPOLOGIES.CONTINUOUS_METRIC]: ['data_visualizer', 'payoff_diagram', 'stat_counter'],
    [CONCEPT_TOPOLOGIES.QUANTITATIVE_FORMULA]: ['formula_breakdown', 'progressive_cards'],
    [CONCEPT_TOPOLOGIES.PAYOFF_PROFILE]: domain === 'finance' ? ['payoff_diagram', 'data_visualizer', 'formula_breakdown'] : ['data_visualizer', 'formula_breakdown'],
    [CONCEPT_TOPOLOGIES.PROCEDURAL_WORKFLOW]: ['diagram_flow', 'progressive_cards', 'timeline'],
    [CONCEPT_TOPOLOGIES.SYSTEMIC_CRISIS]: ['progressive_cards', 'data_visualizer', 'stat_counter'],
    [CONCEPT_TOPOLOGIES.ACTIVE_RECALL]: ['interactive_quiz'],
    [CONCEPT_TOPOLOGIES.PRACTICAL_SYNTHESIS]: ['chat_story', 'progressive_cards', 'split_comparison'],
    [CONCEPT_TOPOLOGIES.PROGRESSIVE_SUMMARY]: ['summary_thread']
  };

  const candidateList = topologyCandidateMap[topology] || ['progressive_cards', 'data_visualizer'];
  const allowedCandidates = candidateList.filter(isAllowed);

  // Avoid consecutive duplicate
  let selected = allowedCandidates.find((t) => t !== lastUsed) || allowedCandidates[0] || 'progressive_cards';

  // Check if Level 2 Dynamic Composition is advantageous
  let composition = null;
  if (topology === CONCEPT_TOPOLOGIES.QUANTITATIVE_FORMULA && isAllowed('composite_layout')) {
    composition = {
      isLevel2Composite: true,
      layoutMode: 'split_horizontal',
      left: { template: 'data_visualizer', weight: 0.55 },
      right: { template: 'formula_breakdown', weight: 0.45 }
    };
  }

  return {
    topology,
    recommendedTemplate: selected,
    level: composition ? 2 : 1,
    composition,
    candidatePool: allowedCandidates,
    avoidedConsecutive: selected !== lastUsed
  };
}

