// scripts/validate_episode.mjs
import fs from 'fs';
import path from 'path';
import {
  VisualSpecSchema,
  ChartSpecSchema,
  FormulaSpecSchema,
  DiagramSpecSchema,
  VisualCueSchema,
  SubtitlePhraseSchema,
} from '../src/schemas/visualSpecSchema.mjs';
import { TEMPLATE_REGISTRY } from '../src/schemas/templateRegistrySchema.mjs';
import {
  validateFinancialDirectionalConsistency,
  validateHeadAndShouldersEligibility,
} from '../src/domain/finance/financeValidation.mjs';
import { resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

const args = process.argv.slice(2);
const dirArg = args.find((a) => a.startsWith('--dir='));
const chapterArg = args.find((a) => a.startsWith('--chapter='));
let targetDir = 'src/data';
if (dirArg) {
  targetDir = dirArg.split('=')[1];
} else if (chapterArg) {
  const chap = chapterArg.split('=')[1];
  const found = resolveChapterDirectory(chap, process.cwd());
  targetDir = found ? path.relative(process.cwd(), found) : `src/data/chapters/${chap}`;
}
const rawPath = path.isAbsolute(targetDir) ? path.join(targetDir, 'episode_raw.json') : path.join(process.cwd(), targetDir, 'episode_raw.json');

const devanagariRegex = /[\u0900-\u097F]/;
const forbiddenHindiRegex = /रि[ज़जज़]ल्ट|रि[ज़जज़]िट|रि[ज़जज़]ट|एकसपायरी|वॉल्क|वाल्क|\bUSFDA\b/i;

const VALID_PRESETS = [
  'uptrend_then_drop',
  'uptrend_break',
  'bull_breakout',
  'support_bounce',
  'head_and_shoulders',
  'random_walk_line',
  'telemetry_line',
];

function checkNoDevanagariInUI(obj, keyPath, errors) {
  if (typeof obj === 'string') {
    if (devanagariRegex.test(obj)) {
      errors.push(`Devanagari detected in UI string at ${keyPath}: "${obj}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => checkNoDevanagariInUI(item, `${keyPath}[${idx}]`, errors));
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) =>
      checkNoDevanagariInUI(v, `${keyPath}.${k}`, errors)
    );
  }
}

export function validateEpisodeData(episode) {
  const errors = [];

  // 1. Meta validation
  if (!episode.meta || !episode.meta.chapter) {
    errors.push('Missing meta.chapter');
  } else if (/_ARGON|_/i.test(episode.meta.chapter)) {
    errors.push(
      `meta.chapter ("${episode.meta.chapter}") must not contain folder names or underscores (use "CHAPTER X · PART Y").`
    );
  }

  // 2. Scene & Beat validation
  (episode.scenes || []).forEach((scene, sIdx) => {
    const sPrefix = `Scene ${sIdx} ("${scene.title}", template: ${scene.template})`;
    const beats = scene.beats || [];

    beats.forEach((beat, bIdx) => {
      const bPrefix = `${sPrefix} -> Beat ${bIdx} (${beat.id})`;
      const tts = beat.hindi_tts || '';

      if (forbiddenHindiRegex.test(tts)) {
        errors.push(
          `${bPrefix}: hindi_tts contains forbidden/slurred phonetic spelling (रिज़ल्ट/रिज़िट/एकसपायरी/वॉल्क/USFDA).`
        );
      }

      // Block synthetic English sentences inside hindi_tts
      const strippedTts = tts.replace(
        /\b(RSI|MACD|OBV|SMA|EMA|SMAs|EMAs|PCR|COT|CCI|ROC|VPT|KAMA|ETF|ETFs|ATR|ADX|SAR|NSE|BSE|SEBI|FDA|IPO|OHLC)\b/gi,
        ''
      );
      const englishWords = strippedTts.match(/[A-Za-z]{4,}/g) || [];
      if (englishWords.length >= 3) {
        errors.push(
          `${bPrefix}: hindi_tts contains raw Latin English words (${englishWords.slice(0, 4).join(', ')}). Write hindi_tts in 100% Devanagari script!`
        );
      }

      // If structured visual specification is supplied, validate it
      if (beat.visual) {
        const vParsed = VisualSpecSchema.safeParse(beat.visual);
        if (!vParsed.success) {
          errors.push(
            `${bPrefix}: Invalid visual spec: ${vParsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
          );
        }
      }

      // Phase 2B: Validate visual cues against template registry and timing boundaries
      if (beat.visualCues) {
        if (!Array.isArray(beat.visualCues)) {
          errors.push(`${bPrefix}: visualCues must be an array.`);
        } else {
          const templateDef = TEMPLATE_REGISTRY[scene.template];
          const allowedTargets = [
            ...(templateDef?.animationTargets || []),
            'subtitle',
            'general',
          ];

          beat.visualCues.forEach((cue, cIdx) => {
            const cParsed = VisualCueSchema.safeParse(cue);
            if (!cParsed.success) {
              errors.push(
                `${bPrefix} cue ${cIdx}: Invalid VisualCue: ${cParsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
              );
            }

            if (templateDef && !allowedTargets.includes(cue.target)) {
              errors.push(
                `${bPrefix} cue ${cIdx}: Target "${cue.target}" is not supported by template "${scene.template}". Allowed: ${allowedTargets.join(', ')}`
              );
            }

            if (beat.audioDurationSec) {
              const maxAllowedMs = beat.audioDurationSec * 1000 + (beat.pauseAfterMs ?? 260) + 150;
              if (cue.atMs > maxAllowedMs) {
                errors.push(
                  `${bPrefix} cue ${cIdx}: atMs (${cue.atMs}ms) exceeds measured beat duration (${Math.round(maxAllowedMs)}ms).`
                );
              }
            }
          });

          for (let i = 1; i < beat.visualCues.length; i++) {
            if (beat.visualCues[i].atMs < beat.visualCues[i - 1].atMs) {
              errors.push(
                `${bPrefix}: visualCues must be sorted in non-decreasing order of atMs (${beat.visualCues[i].atMs}ms appears after ${beat.visualCues[i - 1].atMs}ms).`
              );
            }
          }
        }
      }

      // Phase 2B: Validate subtitle phrases if present
      if (beat.subtitlePhrases) {
        if (!Array.isArray(beat.subtitlePhrases)) {
          errors.push(`${bPrefix}: subtitlePhrases must be an array.`);
        } else {
          beat.subtitlePhrases.forEach((p, pIdx) => {
            const pParsed = SubtitlePhraseSchema.safeParse(p);
            if (!pParsed.success) {
              errors.push(
                `${bPrefix} subtitle phrase ${pIdx}: Invalid phrase: ${pParsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
              );
            }
            if (p.endMs < p.startMs) {
              errors.push(
                `${bPrefix} subtitle phrase ${pIdx}: endMs (${p.endMs}) cannot be less than startMs (${p.startMs}).`
              );
            }
          });
        }
      }

      checkNoDevanagariInUI(beat.ui_state, `${bPrefix}.ui_state`, errors);
    });

    if (scene.template === 'data_visualizer') {
      const isFinanceDomain =
        /finance/i.test(episode.meta?.domain || '') ||
        /hull|murphy|options|futures|trading/i.test(episode.meta?.course || '');

      beats.forEach((beat, bIdx) => {
        const ui = beat.ui_state || {};
        const preset = ui.preset;

        // If no visual spec is given and a preset is specified, check against valid presets
        if (!beat.visual && preset) {
          if (!VALID_PRESETS.includes(preset)) {
            errors.push(
              `${sPrefix} Beat ${bIdx}: Unknown chart preset "${preset}". Use one of: ${VALID_PRESETS.join(', ')}`
            );
          }
        }

        // Domain-isolated Finance Checks
        if (isFinanceDomain) {
          const sceneTitleCombo = `${scene.title || ''} ${beats[0]?.ui_state?.chartTitle || ''} ${beats[0]?.ui_state?.chartSubtitle || ''}`;
          if (preset) {
            const hsIssues = validateHeadAndShouldersEligibility(sceneTitleCombo, preset);
            hsIssues.forEach((iss) => errors.push(`${sPrefix} Beat ${bIdx}: ${iss.message}`));
          }

          const dirIssues = validateFinancialDirectionalConsistency(beat.en_subtitle || '');
          dirIssues.forEach((iss) => errors.push(`${sPrefix} Beat ${bIdx}: ${iss.message}`));
        } else {
          // In non-finance domain, reject ₹ currency symbols
          const sub = beat.en_subtitle || '';
          if (/₹/.test(sub)) {
            errors.push(
              `${sPrefix} Beat ${bIdx}: Non-finance domain must not include '₹' currency symbol in subtitles ("${sub}").`
            );
          }
        }
      });
    }

    if (scene.template === 'diagram_flow' || scene.template === 'timeline' || scene.template === 'process_flow') {
      beats.forEach((beat, bIdx) => {
        const diagramData = beat.visual?.data || beat.ui_state;
        if (diagramData && typeof diagramData === 'object' && diagramData.nodes) {
          const dParsed = DiagramSpecSchema.safeParse(diagramData);
          if (!dParsed.success) {
            errors.push(
              `${sPrefix} Beat ${bIdx}: Invalid DiagramSpec: ${dParsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
            );
          }
        }
      });
    }

    if (scene.template === 'formula_breakdown') {
      beats.forEach((beat, bIdx) => {
        const formulaData = beat.visual?.data || beat.ui_state;
        if (formulaData && formulaData.expression && formulaData.variables) {
          const fParsed = FormulaSpecSchema.safeParse(formulaData);
          if (!fParsed.success) {
            errors.push(
              `${sPrefix} Beat ${bIdx}: Invalid FormulaSpec: ${fParsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
            );
          }
        }
      });
    }

    if (scene.template === 'interactive_quiz') {
      if (beats.length !== 3) {
        errors.push(`${sPrefix}: interactive_quiz MUST have exactly 3 beats. Found ${beats.length}.`);
      } else {
        if (beats[0].ui_state?.showThinkingSpinner !== false) {
          errors.push(`${sPrefix} Beat 0: showThinkingSpinner must be false.`);
        }
        if (beats[1].ui_state?.showThinkingSpinner !== true) {
          errors.push(`${sPrefix} Beat 1: showThinkingSpinner must be true.`);
        }
        if (!beats[2].ui_state?.answer) {
          errors.push(`${sPrefix} Beat 2: answer must be a non-empty string.`);
        }
      }
    }

    if (scene.template === 'summary_thread') {
      const firstUI = beats[0]?.ui_state || {};
      const steps = firstUI.steps || [];
      if (steps.length < 6 || steps.length > 8) {
        errors.push(`${sPrefix}: summary_thread must have between 6 and 8 steps (found ${steps.length}).`);
      }
      const joinedSteps = steps.join(' ').toLowerCase();
      if (
        !/CHAPTER 16/i.test(episode.meta?.chapter || '') &&
        joinedSteps.includes('identify the primary trend and major support') &&
        joinedSteps.includes('set objective stop-loss orders')
      ) {
        errors.push(
          `${sPrefix}: summary_thread steps contain generic boilerplate from schema_reference.json instead of chapter-specific steps!`
        );
      }
      if (beats.length < 5) {
        errors.push(`${sPrefix}: summary_thread MUST have at least 5 beats. Found ${beats.length}.`);
      }
      const r0 = firstUI.activeStepRange;
      if (!r0 || r0[0] !== 0 || r0[1] !== 0) {
        errors.push(`${sPrefix} Beat 0: First beat of summary_thread MUST have activeStepRange: [0, 0].`);
      }
      for (let i = 1; i < beats.length - 1; i++) {
        const r = beats[i].ui_state?.activeStepRange;
        if (!r || r[1] - r[0] > 2 || r[0] < 1) {
          errors.push(`${sPrefix} Beat ${i} (${beats[i].id}): activeStepRange [${r}] is invalid.`);
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Run via CLI if invoked directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(process.cwd(), 'scripts', 'validate_episode.mjs')) {
  if (!fs.existsSync(rawPath)) {
    console.error(`❌ Validation Error: File not found at ${rawPath}`);
    process.exit(1);
  }
  const episode = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const result = validateEpisodeData(episode);
  if (!result.valid) {
    console.error(`\n❌ ZOD / INVARIANT VALIDATION FAILED (${result.errors.length} errors):\n`);
    result.errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
    process.exit(1);
  }
  console.log(`✅ Validation passed cleanly for ${rawPath}!`);
}