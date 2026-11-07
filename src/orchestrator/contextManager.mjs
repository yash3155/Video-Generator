// src/orchestrator/contextManager.mjs
/**
 * Context Manager for Token-Efficient Microkernel
 * Prevents prompt bloat by slicing schemas, isolating fact subsets,
 * and producing compact task manifests instead of monolithic context dumps.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Extracts a minimal subset of facts from source_facts.json matching requested IDs.
 * @param {string} sourceFactsPath - Path to source_facts.json
 * @param {string[]} targetFactIds - Array of fact IDs needed (e.g. ['fact-01', 'fact-02'])
 * @returns {object[]} - Array of matching fact objects
 */
export function sliceSourceFacts(sourceFactsPath, targetFactIds = []) {
  if (!fs.existsSync(sourceFactsPath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(sourceFactsPath, 'utf8'));
    const allFacts = raw.facts || [];
    if (!targetFactIds || targetFactIds.length === 0) {
      // Default to first 3 foundational facts if none specified
      return allFacts.slice(0, 3);
    }
    return allFacts.filter((f) => targetFactIds.includes(f.id));
  } catch {
    return [];
  }
}

/**
 * Provides a minimal, template-specific schema excerpt instead of the entire 6.5KB schema_reference.json.
 * @param {string} templateKind - e.g. 'chat_story', 'formula_breakdown', 'interactive_quiz', 'progressive_cards'
 * @returns {object} - Minimal JSON schema specification
 */
export function getTemplateSubSchema(templateKind) {
  const commonBeatSchema = {
    id: "b01",
    hindi_tts: "Clear, engaging Hindi explanation in Devanagari script",
    en_subtitle: "Concise English subtitle (under 14 words)",
    en_narration: "English reference narration",
    pauseAfterMs: 400
  };

  switch (templateKind) {
    case 'chat_story':
    case 'conversation':
      return {
        template: "chat_story",
        beatPayload: {
          ...commonBeatSchema,
          ui_state: {
            stageDirections: ["— Contextual stage cue —"],
            messages: [{ sender: "Raju", avatar: "R", text: "Question or dilemma", theme: "amber", align: "left" }]
          },
          visual: {
            kind: "conversation",
            data: {
              messages: [{ sender: "Raju", avatar: "R", text: "Question or dilemma", theme: "amber", align: "left" }]
            }
          }
        }
      };

    case 'interactive_quiz':
    case 'quiz':
      return {
        template: "interactive_quiz",
        beatCount: 3,
        structure: [
          { beatIndex: 0, role: "question_intro", showThinkingSpinner: false },
          { beatIndex: 1, role: "thinking_pause", showThinkingSpinner: true, pauseAfterMs: 3200 },
          { beatIndex: 2, role: "answer_reveal", correctOptionId: "opt_b", showExplanation: true }
        ]
      };

    case 'formula_breakdown':
    case 'formula':
      return {
        template: "formula_breakdown",
        beatPayload: {
          ...commonBeatSchema,
          visual: {
            kind: "formula",
            data: {
              title: "Formula Title",
              formulaLatex: "S_t - K",
              variables: [{ symbol: "S_t", name: "Spot Price", unit: "₹" }]
            }
          }
        }
      };

    default:
      return {
        template: templateKind,
        beatPayload: commonBeatSchema
      };
  }
}

/**
 * Creates a structured task manifest for Cline delegation.
 * Writes to .cline/tasks/ if writeToDisk is true.
 * @param {object} taskSpec
 * @returns {object} - Standardized task manifest
 */
export function buildClineTaskManifest(taskSpec, options = {}) {
  const manifest = {
    schemaVersion: "1.0.0",
    taskId: taskSpec.taskId || `cline_task_${Date.now()}`,
    category: taskSpec.category || "MECHANICAL_DEV",
    assignedWorker: "cline",
    objective: taskSpec.objective,
    inputFiles: taskSpec.inputFiles || [],
    outputFiles: taskSpec.outputFiles || [],
    constraints: [
      "Preserve all existing schema validations and Zod constraints",
      "Do NOT use external @google/genai SDK or API keys",
      "Ensure all generated JavaScript is valid ES module format",
      ...(taskSpec.constraints || [])
    ],
    validationCommand: taskSpec.validationCommand || "npm run validate:lesson",
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  if (options.writeToDisk) {
    const tasksDir = options.tasksDir || path.resolve(process.cwd(), '.cline', 'tasks');
    fs.mkdirSync(tasksDir, { recursive: true });
    const targetFile = path.join(tasksDir, `${manifest.taskId}.json`);
    fs.writeFileSync(targetFile, JSON.stringify(manifest, null, 2), 'utf8');
    manifest.filePath = targetFile;
  }

  return manifest;
}

/**
 * Builds a bounded micro-prompt for targeted dialogue or math synthesis (~400 tokens context).
 */
export function buildMicroPrompt({ sceneTitle, template, objective, facts, personas, language = 'hi-IN' }) {
  const factsSummary = (facts || []).map((f) => `- [${f.id}] ${f.statement}`).join('\n');
  const subSchema = getTemplateSubSchema(template);

  return `
You are the Master Educational Dialogue Architect.
Synthesize the narrative dialogue for a single educational video scene.

SCENE: "${sceneTitle}" (Template: ${template})
TEACHING OBJECTIVE: ${objective}
AUTHORITATIVE FACTS:
${factsSummary || 'Foundational market mechanics'}

CHARACTERS & PERSONAS:
${JSON.stringify(personas || { Raju: "Inquisitive retail trader", "Sharma ji": "Veteran mentor" }, null, 2)}

OUTPUT CONTRACT:
Return ONLY valid JSON matching this schema excerpt (no markdown fences, no filler):
${JSON.stringify(subSchema, null, 2)}
`.trim();
}

