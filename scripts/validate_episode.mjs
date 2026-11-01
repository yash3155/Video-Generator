// scripts/validate_episode.mjs
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const dirArg = args.find((a) => a.startsWith('--dir='));
const targetDir = dirArg ? dirArg.split('=')[1] : 'src/data';
const rawPath = path.join(process.cwd(), targetDir, 'episode_raw.json');

if (!fs.existsSync(rawPath)) {
  console.error(`❌ Validation Error: File not found at ${rawPath}`);
  process.exit(1);
}

const episode = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const errors = [];

const devanagariRegex = /[\u0900-\u097F]/;
const forbiddenHindiRegex = /रि[ज़जज़]ल्ट|रि[ज़जज़]िट|रि[ज़जज़]ट|एकसपायरी|वॉल्क|वाल्क|\bUSFDA\b/i;

// Exact candle price bounds (NOT axis bounds) for each preset
const PRESET_CANDLE_BOUNDS = {
  uptrend_then_drop: {
    minCandle: 119,
    maxCandle: 160, // Peak candle high is 160, close is 158; 165 is empty axis ceiling!
    forbiddenPrices: [165],
    hint: 'uptrend_then_drop candles start at ₹120, peak at ₹158 (candle 21), and drop to ₹141 (candle 27). Do NOT use ₹165 (165 is the empty Y-axis top border).',
  },
  uptrend_break: {
    minCandle: 97,
    maxCandle: 149,
    forbiddenPrices: [],
    hint: 'uptrend_break candles climb from ₹98 to ₹148 (candle 16), break ₹140 support (candle 18–21), and drop to ₹135 (candle 27).',
  },
  bull_breakout: {
    minCandle: 119,
    maxCandle: 169,
    forbiddenPrices: [],
    hint: 'bull_breakout candles climb from ₹120, break ₹148 resistance at candle 17, and rally to ₹168 (candle 27).',
  },
  head_and_shoulders: {
    minCandle: 133,
    maxCandle: 175,
    forbiddenPrices: [],
    hint: 'head_and_shoulders has Left Shoulder ₹158 (idx 4), Head ₹175 (idx 12), Right Shoulder ₹156 (idx 20), Neckline ₹142 (breaks at idx 25 to ₹134).',
  },
  random_walk_line: {
    minCandle: 95,
    maxCandle: 175,
    forbiddenPrices: [],
    hint: 'random_walk_line points move from 100 to 165.',
  },
};

function checkNoDevanagariInUI(obj, keyPath) {
  if (typeof obj === 'string') {
    if (devanagariRegex.test(obj)) {
      errors.push(`Devanagari detected in UI string at ${keyPath}: "${obj}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => checkNoDevanagariInUI(item, `${keyPath}[${idx}]`));
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) =>
      checkNoDevanagariInUI(v, `${keyPath}.${k}`)
    );
  }
}

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

    if (forbiddenHindiRegex.test(beat.hindi_tts || '')) {
      errors.push(
        `${bPrefix}: hindi_tts contains forbidden/slurred phonetic spelling (रिज़ल्ट/रिज़िट/एकसपायरी/वॉल्क/USFDA). Use नतीजे / एक्सपायरी / वॉक.`
      );
    }

    checkNoDevanagariInUI(beat.ui_state, `${bPrefix}.ui_state`);
  });

  // Template-specific rules
  if (scene.template === 'data_visualizer') {
    beats.forEach((beat, bIdx) => {
      const ui = beat.ui_state || {};
      const preset = ui.preset || 'uptrend_then_drop';
      const bounds = PRESET_CANDLE_BOUNDS[preset];

      if (!bounds) {
        errors.push(
          `${sPrefix} Beat ${bIdx}: Unknown chart preset "${preset}". Use one of: ${Object.keys(PRESET_CANDLE_BOUNDS).join(', ')}`
        );
        return;
      }

      // Extract all ₹<number> mentions from subtitle, annotations, and sideCards
      const textsToScan = [
        beat.en_subtitle || '',
        ...(ui.annotations || []).map((a) => a.text || ''),
        ...(ui.sideCards || []).map((c) => `${c.title} ${c.subtitle}`),
      ].join(' ');

      const priceMatches = [...textsToScan.matchAll(/₹\s*(\d+(?:,\d+)?)/g)];
      priceMatches.forEach((m) => {
        const val = Number(m[1].replace(/,/g, ''));
        if (
          val < bounds.minCandle ||
          val > bounds.maxCandle ||
          bounds.forbiddenPrices.includes(val)
        ) {
          errors.push(
            `${sPrefix} Beat ${bIdx} (${beat.id}): Mentioned price ₹${val} does NOT match preset "${preset}"! ${bounds.hint}`
          );
        }
      });

      // Prevent using head_and_shoulders on non-H&S scenes
      if (
        preset === 'head_and_shoulders' &&
        !/shoulder|head|neckline|reversal pattern/i.test(
          `${scene.title} ${ui.chartTitle} ${ui.chartSubtitle}`
        )
      ) {
        errors.push(
          `${sPrefix} Beat ${bIdx}: Do NOT use "head_and_shoulders" preset on a scene that is not about Head & Shoulders! Use "uptrend_then_drop" or "bull_breakout".`
        );
      }
    });
  }

  if (scene.template === 'interactive_quiz') {
    if (beats.length !== 3) {
      errors.push(
        `${sPrefix}: interactive_quiz MUST have exactly 3 beats (Beat 0: read question, Beat 1: pause & spinner, Beat 2: answer reveal). Found ${beats.length} beats.`
      );
    } else {
      const q0 = beats[0].ui_state?.question || '';
      if (q0.split(/\s+/).length < 18) {
        errors.push(`${sPrefix}: Quiz question must be at least 18 words.`);
      }
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
      errors.push(
        `${sPrefix}: summary_thread must have between 6 and 8 steps (found ${steps.length}).`
      );
    }
    const minRequiredBeats = steps.length >= 7 ? 5 : 4;
    if (beats.length < minRequiredBeats) {
      errors.push(
        `${sPrefix}: summary_thread with ${steps.length} steps MUST have at least ${minRequiredBeats} beats ([0,0] intro, 2-step body beats, and [1,${steps.length}] final takeaway). Found only ${beats.length} beats.`
      );
    }

    // Check Beat 0 is [0, 0]
    const r0 = firstUI.activeStepRange;
    if (!r0 || r0[0] !== 0 || r0[1] !== 0) {
      errors.push(
        `${sPrefix} Beat 0: First beat of summary_thread MUST have activeStepRange: [0, 0] for the intro sentence.`
      );
    }

    // Check body beats highlight at most 2 steps at a time and cover all steps sequentially
    for (let i = 1; i < beats.length - 1; i++) {
      const r = beats[i].ui_state?.activeStepRange;
      if (!r || r[1] - r[0] > 1 || r[0] < 1) {
        errors.push(
          `${sPrefix} Beat ${i} (${beats[i].id}): activeStepRange [${r}] highlights too many steps at once! Body beats may highlight at most 2 steps per beat (e.g. [1,2], [3,4], [5,6], [7,8]) so the voiceover matches the highlighted steps.`
        );
      }
    }
  }
});

if (errors.length > 0) {
  console.error(`\n❌ ZOD / INVARIANT VALIDATION FAILED (${errors.length} errors):\n`);
  errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
  console.error('\nFix the errors above in episode_raw.json before compiling audio.\n');
  process.exit(1);
}

console.log(`✅ Validation passed cleanly for ${rawPath}!`);