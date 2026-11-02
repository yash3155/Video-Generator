// scripts/validate_episode.mjs
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const dirArg = args.find((a) => a.startsWith('--dir='));
const targetDir = dirArg ? dirArg.split('=')[1] : 'src/data';
const rawPath = path.join(process.cwd(), targetDir, 'episode_raw.json');

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

      checkNoDevanagariInUI(beat.ui_state, `${bPrefix}.ui_state`, errors);
    });

    if (scene.template === 'data_visualizer') {
      const sceneTitleCombo = `${scene.title || ''} ${beats[0]?.ui_state?.chartTitle || ''} ${beats[0]?.ui_state?.chartSubtitle || ''}`;
      const isActualHS = /head\s*(?:&|and)\s*shoulders|neckline/i.test(sceneTitleCombo);

      beats.forEach((beat, bIdx) => {
        const ui = beat.ui_state || {};
        const preset = ui.preset || 'uptrend_then_drop';

        if (!VALID_PRESETS.includes(preset)) {
          errors.push(
            `${sPrefix} Beat ${bIdx}: Unknown chart preset "${preset}". Use one of: ${VALID_PRESETS.join(', ')}`
          );
        }

        if (preset === 'head_and_shoulders' && !isActualHS) {
          errors.push(
            `${sPrefix} Beat ${bIdx}: Do NOT use "head_and_shoulders" preset on a non-H&S scene ("${scene.title}"). Use "uptrend_then_drop" or "bull_breakout".`
          );
        }

        // Generic Directional Sanity Check (e.g., never say "bought at ₹500 and dropped to ₹550")
        const sub = beat.en_subtitle || '';
        const dropMatch = sub.match(
          /(?:bought|entered|chased).*?₹\s*(\d+(?:,\d+)?).*?(?:drop|slump|fell|sink|crash).*?₹\s*(\d+(?:,\d+)?)/i
        );
        if (dropMatch) {
          const buyPrice = Number(dropMatch[1].replace(/,/g, ''));
          const dropPrice = Number(dropMatch[2].replace(/,/g, ''));
          if (dropPrice >= buyPrice) {
            errors.push(
              `${sPrefix} Beat ${bIdx}: Illogical price drop! Cannot buy at ₹${buyPrice} and drop to a higher/equal price ₹${dropPrice}.`
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