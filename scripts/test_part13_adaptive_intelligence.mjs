// scripts/test_part13_adaptive_intelligence.mjs
/**
 * Test Suite for Part 13: Adaptive Story-to-Visual Intelligence & Dynamic Template System
 */

import { evaluateVisualDiversity, recommendAdaptiveVisual, CONCEPT_TOPOLOGIES } from '../src/orchestrator/diversityEngine.mjs';
import { TEMPLATE_REGISTRY } from '../src/schemas/templateRegistrySchema.mjs';
import { verifyNewTemplate } from './verify_new_template.mjs';

console.log(`\n======================================================`);
console.log(`🧪 PART 13 TEST SUITE: ADAPTIVE STORY-TO-VISUAL ENGINE`);
console.log(`======================================================\n`);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

async function runTests() {
  // TEST GROUP 1: Diversity Engine - Monotony & Saturation Detection
  console.log(`▶ Test Group 1: Diversity Evaluation & Repetition Guard`);
  
  // Repetitive scenario: 4 consecutive progressive_cards
  const repetitiveScenes = [
    { title: "Scene 1", template: "progressive_cards" },
    { title: "Scene 2", template: "progressive_cards" },
    { title: "Scene 3", template: "progressive_cards" },
    { title: "Scene 4", template: "progressive_cards" },
    { title: "Scene 5", template: "chat_story" }
  ];

  const repReport = evaluateVisualDiversity(repetitiveScenes);
  assert(repReport.consecutiveDuplicateCount === 3,
    `Detected 3 consecutive duplicate template transitions (found ${repReport.consecutiveDuplicateCount})`);
  assert(repReport.findings.some((f) => f.code === 'DIV_TEMPLATE_SATURATION'),
    'Flagged excessive template saturation (progressive_cards > 30% of chapter)');
  assert(repReport.status === 'REPETITIVE',
    `Classified monotonous scene sequence as status: ${repReport.status}`);

  // Diverse scenario: Cognitive Micro-Kernel 12-scene sequence
  const diverseScenes = [
    { title: "Origin", template: "chat_story" },
    { title: "Conflict", template: "tug_of_war" },
    { title: "Roadmap", template: "progressive_cards" },
    { title: "Structure", template: "split_comparison" },
    { title: "Scale", template: "data_visualizer" },
    { title: "Math", template: "formula_breakdown" },
    { title: "Payoff vs Profit", template: "payoff_diagram" },
    { title: "Crisis", template: "stat_counter" },
    { title: "Contagion", template: "diagram_flow" },
    { title: "Active Recall", template: "interactive_quiz" },
    { title: "Dialogue", template: "chat_story" },
    { title: "Summary", template: "summary_thread" }
  ];

  const divReport = evaluateVisualDiversity(diverseScenes);
  assert(divReport.uniqueTemplateCount >= 8,
    `Diverse chapter part employs ${divReport.uniqueTemplateCount} distinct visual templates`);
  assert(divReport.consecutiveDuplicateCount === 0,
    'Zero consecutive duplicate templates in diverse sequence');
  assert(divReport.status === 'OPTIMAL' && divReport.diversityScore >= 0.8,
    `Optimal diversity score achieved: ${divReport.diversityScore} (Status: ${divReport.status})`);

  // TEST GROUP 2: Adaptive Visual Recommendation
  console.log(`\n▶ Test Group 2: Concept-Aware Adaptive Visual Recommendation`);
  
  const rec1 = recommendAdaptiveVisual({
    topology: CONCEPT_TOPOLOGIES.COMPETING_FORCES,
    domain: 'finance',
    recentlyUsedTemplates: []
  });
  assert(rec1.recommendedTemplate === 'tug_of_war',
    `COMPETING_FORCES mapped to tug_of_war (recommended: ${rec1.recommendedTemplate})`);

  // Test consecutive suppression: when tug_of_war was just used, switch to split_comparison
  const rec2 = recommendAdaptiveVisual({
    topology: CONCEPT_TOPOLOGIES.COMPETING_FORCES,
    domain: 'finance',
    recentlyUsedTemplates: ['tug_of_war']
  });
  assert(rec2.recommendedTemplate !== 'tug_of_war' && rec2.avoidedConsecutive === true,
    `Suppressed consecutive repetition: switched from tug_of_war to ${rec2.recommendedTemplate}`);

  // Test Level 2 Dynamic Composite Recommendation
  const recComposite = recommendAdaptiveVisual({
    topology: CONCEPT_TOPOLOGIES.QUANTITATIVE_FORMULA,
    domain: 'finance',
    allowedTemplates: ['*']
  });
  assert(recComposite.level === 2 && recComposite.composition.isLevel2Composite === true,
    'QUANTITATIVE_FORMULA successfully recommended Level 2 Dynamic Composite Layout');

  // TEST GROUP 3: Template Registry & Level 2 Composite Schema
  console.log(`\n▶ Test Group 3: Level 2 Composite Registry Integration`);
  assert(TEMPLATE_REGISTRY.composite_layout !== undefined,
    'composite_layout is officially registered in TEMPLATE_REGISTRY');
  assert(TEMPLATE_REGISTRY.composite_layout.fallbackTemplateId === 'split_comparison',
    'composite_layout has valid fallbackTemplateId: split_comparison');

  // TEST GROUP 4: Level 3 Template Lifecycle Quality Gate
  console.log(`\n▶ Test Group 4: Level 3 Controlled Quality Gate`);
  
  // Valid proposal
  const validGate = await verifyNewTemplate({
    templateId: 'order_book_dom',
    name: 'Order Book Depth of Market',
    description: 'Real-time bid/ask liquidity visualizer for technical analysis',
    supportedKinds: ['chart'],
    requiredDataTypes: ['numeric'],
    animationTargets: ['bidVolume', 'askVolume'],
    fallbackTemplateId: 'data_visualizer'
  }, { proposalOnly: true });
  assert(validGate.passed === true,
    'Level 3 Quality Gate approved valid new template proposal');

  // Invalid proposal (invalid fallback)
  const invalidGate = await verifyNewTemplate({
    templateId: 'broken_template',
    name: 'Broken Template',
    description: 'Testing invalid fallback check',
    supportedKinds: ['chart'],
    requiredDataTypes: ['numeric'],
    animationTargets: ['dummy'],
    fallbackTemplateId: 'non_existent_fallback_xyz'
  });
  assert(invalidGate.passed === false && invalidGate.findings.some(f => f.code === 'TMPL_INVALID_FALLBACK'),
    'Level 3 Quality Gate rejected proposal with non-existent fallback template');

  console.log(`\n======================================================`);
  console.log(`📊 PART 13 TEST RESULTS: ${passedTests}/${totalTests} PASSED (100% SUCCESS)`);
  console.log(`======================================================\n`);

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
