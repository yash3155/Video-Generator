// src/orchestrator/taskClassifier.mjs
/**
 * Task Classifier for Token-Efficient Microkernel
 * Analyzes incoming production tasks and determines complexity,
 * execution tier, and deterministic feasibility to minimize token consumption.
 */

export const TASK_CATEGORIES = {
  // Tier 1: 100% Deterministic (0 LLM Tokens)
  CONTENT_AUDIT: 'CONTENT_AUDIT',
  SCHEMA_VALIDATION: 'SCHEMA_VALIDATION',
  LESSON_VALIDATION: 'LESSON_VALIDATION',
  EPISODE_SCAFFOLDING: 'EPISODE_SCAFFOLDING',
  AUDIO_COMPILATION: 'AUDIO_COMPILATION',
  AUDIO_ALIGNMENT: 'AUDIO_ALIGNMENT',
  REMOTION_RENDER: 'REMOTION_RENDER',
  QA_RELEASE_GATE: 'QA_RELEASE_GATE',
  CURRICULUM_LOOKUP: 'CURRICULUM_LOOKUP',
  TEXT_SANITIZATION: 'TEXT_SANITIZATION',
  SUMMARY_THREAD_BUILD: 'SUMMARY_THREAD_BUILD',

  // Tier 2: Mechanical Development (Cline / Free Providers)
  BUILDER_SCAFFOLD_AUTHORING: 'BUILDER_SCAFFOLD_AUTHORING',
  MECHANICAL_REFACTORING: 'MECHANICAL_REFACTORING',
  TEST_GENERATION: 'TEST_GENERATION',
  DOCUMENTATION_SYNC: 'DOCUMENTATION_SYNC',
  LINT_OR_TYPE_FIX: 'LINT_OR_TYPE_FIX',

  // Tier 3: Targeted Micro-Reasoning (Gemini 4 Argon Proxy / Antigravity Flash Fallback)
  SOURCE_FACT_STRUCTURING: 'SOURCE_FACT_STRUCTURING',
  LESSON_PLAN_PEDAGOGY: 'LESSON_PLAN_PEDAGOGY',
  STORYBOARD_PEDAGOGY: 'STORYBOARD_PEDAGOGY',
  DIALOGUE_SYNTHESIS: 'DIALOGUE_SYNTHESIS',
  ACTIVE_RECALL_QUIZ: 'ACTIVE_RECALL_QUIZ',
  CRISIS_MODEL_FORMULA: 'CRISIS_MODEL_FORMULA',
  MATHEMATICAL_PROOF: 'MATHEMATICAL_PROOF',
};

export const EXECUTION_TIERS = {
  DETERMINISTIC: 'DETERMINISTIC',     // 0 tokens (Node.js, Edge-TTS, Remotion)
  CLINE: 'CLINE',                     // Free/Local Inference (NVIDIA NIM / OpenRouter / Ollama)
  ARGON_LOW: 'ARGON_LOW',             // Gemini 4 Argon Low Reasoning via local proxy
  ARGON_MEDIUM: 'ARGON_MEDIUM',       // Gemini 4 Argon Medium Reasoning
  ARGON_HIGH: 'ARGON_HIGH',           // Gemini 4 Argon High Reasoning
  ANTIGRAVITY_FLASH: 'ANTIGRAVITY_FLASH' // Approved fallback strictly in Antigravity IDE
};

/**
 * Classifies a task and produces an actionable routing recommendation.
 * @param {string} taskType - Key from TASK_CATEGORIES
 * @param {object} context - Additional metadata (e.g. chapterKey, files, estimatedTokens)
 * @returns {object} - Classification result
 */
export function classifyTask(taskType, context = {}) {
  const category = TASK_CATEGORIES[taskType] || taskType;

  // 1. Check for Deterministic Tasks (Tier 1)
  const deterministicCategories = [
    TASK_CATEGORIES.CONTENT_AUDIT,
    TASK_CATEGORIES.SCHEMA_VALIDATION,
    TASK_CATEGORIES.LESSON_VALIDATION,
    TASK_CATEGORIES.EPISODE_SCAFFOLDING,
    TASK_CATEGORIES.AUDIO_COMPILATION,
    TASK_CATEGORIES.AUDIO_ALIGNMENT,
    TASK_CATEGORIES.REMOTION_RENDER,
    TASK_CATEGORIES.QA_RELEASE_GATE,
    TASK_CATEGORIES.CURRICULUM_LOOKUP,
    TASK_CATEGORIES.TEXT_SANITIZATION,
    TASK_CATEGORIES.SUMMARY_THREAD_BUILD,
  ];

  if (deterministicCategories.includes(category)) {
    return {
      taskId: context.taskId || `task_${Date.now()}`,
      category,
      complexity: 'DETERMINISTIC',
      tier: EXECUTION_TIERS.DETERMINISTIC,
      requiresLLM: false,
      expectedTokens: 0,
      deterministicHandler: getDeterministicHandlerName(category),
      rationale: 'Task can be fully satisfied deterministically with 0 LLM tokens.'
    };
  }

  // 2. Check for Mechanical Development Tasks (Tier 2 - Cline)
  const clineCategories = [
    TASK_CATEGORIES.BUILDER_SCAFFOLD_AUTHORING,
    TASK_CATEGORIES.MECHANICAL_REFACTORING,
    TASK_CATEGORIES.TEST_GENERATION,
    TASK_CATEGORIES.DOCUMENTATION_SYNC,
    TASK_CATEGORIES.LINT_OR_TYPE_FIX,
  ];

  if (clineCategories.includes(category)) {
    return {
      taskId: context.taskId || `task_cline_${Date.now()}`,
      category,
      complexity: 'MECHANICAL_DEV',
      tier: EXECUTION_TIERS.CLINE,
      requiresLLM: false, // Does not consume engine Argon/Flash quota
      delegatedTo: 'CLINE',
      expectedTokens: 0,
      rationale: 'Mechanical task delegated to Cline via free/local inference provider.'
    };
  }

  // 3. Deep Mathematical Proofs / Crisis Models (Tier 3 - Argon High)
  if (category === TASK_CATEGORIES.MATHEMATICAL_PROOF || category === TASK_CATEGORIES.CRISIS_MODEL_FORMULA) {
    return {
      taskId: context.taskId || `task_math_${Date.now()}`,
      category,
      complexity: 'DEEP_REASONING',
      tier: EXECUTION_TIERS.ARGON_HIGH,
      requiresLLM: true,
      expectedTokens: 1500,
      rationale: 'Requires rigorous mathematical proof and derivation depth.'
    };
  }

  // 4. Pedagogical Blueprints (Tier 3 - Argon Medium)
  if (category === TASK_CATEGORIES.LESSON_PLAN_PEDAGOGY) {
    return {
      taskId: context.taskId || `task_lesson_${Date.now()}`,
      category,
      complexity: 'HIGH_PEDAGOGY',
      tier: EXECUTION_TIERS.ARGON_MEDIUM,
      requiresLLM: true,
      expectedTokens: 3500,
      rationale: 'Requires deep pedagogical sequence and misconception rebuttal.'
    };
  }

  // 5. Targeted Micro-Reasoning (Tier 3 - Argon Low)
  return {
    taskId: context.taskId || `task_micro_${Date.now()}`,
    category,
    complexity: 'MICRO_REASONING',
    tier: EXECUTION_TIERS.ARGON_LOW,
    requiresLLM: true,
    expectedTokens: 1200,
    rationale: 'Targeted synthesis of dialogues or quiz options with bounded context.'
  };
}

function getDeterministicHandlerName(category) {
  switch (category) {
    case TASK_CATEGORIES.CONTENT_AUDIT: return 'audit_content.mjs';
    case TASK_CATEGORIES.SCHEMA_VALIDATION: return 'validate_episode.mjs';
    case TASK_CATEGORIES.LESSON_VALIDATION: return 'validate_lesson_architecture.mjs';
    case TASK_CATEGORIES.EPISODE_SCAFFOLDING: return 'scaffoldingEngine.mjs';
    case TASK_CATEGORIES.AUDIO_COMPILATION: return 'compile_tts_audio.mjs';
    case TASK_CATEGORIES.REMOTION_RENDER: return 'remotion.render';
    case TASK_CATEGORIES.QA_RELEASE_GATE: return 'run_qa.mjs';
    default: return 'deterministic_script';
  }
}

