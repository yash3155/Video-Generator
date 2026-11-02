// scripts/verify_phase2b.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateEpisodeData } from './validate_episode.mjs';
import {
  hashNarration,
  segmentSubtitleIntoPhrases,
} from './compile_tts_audio.mjs';
import {
  getActiveCues,
  getLatestCue,
  getCueProgress,
  isTargetActive,
} from '../src/utils/cueUtils.mjs';
import { TEMPLATE_REGISTRY } from '../src/schemas/templateRegistrySchema.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('===============================================================');
console.log('🔍 PHASE 2B VERIFICATION SUITE: Narration, Timing & Visual Sync');
console.log('===============================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------------
// 1. Authoritative Narration Hashing & Invalidation
// -------------------------------------------------------------------
console.log('Step 1: Authoritative Narration Hashing & Invalidation Tests');
const t1 = 'न्यूटन के दूसरे नियम के अनुसार बल द्रव्यमान और त्वरण का गुणनफल है।';
const t2 = 'न्यूटन के दूसरे नियम के अनुसार बल द्रव्यमान और त्वरण का गुणनफल है।  ';
const t3 = 'न्यूटन के दूसरे नियम में बदलाव किया गया है।';

const hash1 = hashNarration(t1);
const hash2 = hashNarration(t2);
const hash3 = hashNarration(t3);

assert(typeof hash1 === 'string' && hash1.length === 16, 'hashNarration returns 16-char hex hash');
assert(hash1 === hash2, 'Normalized whitespace yields identical narration hash');
assert(hash1 !== hash3, 'Changed narration text yields different hash triggering audio regeneration');

// -------------------------------------------------------------------
// 2. Phrase-Level Subtitle Alignment
// -------------------------------------------------------------------
console.log('\nStep 2: Phrase-Level Subtitle Alignment Tests');
const sub1 = 'Net force equals the product of inertial mass, and instantaneous acceleration.';
const phrases1 = segmentSubtitleIntoPhrases(sub1, 3.2);

assert(Array.isArray(phrases1) && phrases1.length >= 2, `Subtitle segmented into ${phrases1.length} phrases`);
assert(phrases1[0].startMs === 0, 'First phrase starts at 0ms');
assert(phrases1[phrases1.length - 1].endMs === 3200, 'Final phrase ends at total audio duration (3200ms)');
assert(phrases1.every((p) => p.endMs >= p.startMs), 'All phrase time intervals are non-negative and valid');

// Fallback test
const shortSub = 'Force.';
const shortPhrases = segmentSubtitleIntoPhrases(shortSub, 1.0);
assert(shortPhrases.length === 1 && shortPhrases[0].text === 'Force.', 'Graceful fallback to sentence-level phrase for short text');

// -------------------------------------------------------------------
// 3. Visual Cue Helper Utilities
// -------------------------------------------------------------------
console.log('\nStep 3: Visual Cue Utility Tests');
const mockBeat = {
  id: 'test_beat',
  en_subtitle: 'Test beat subtitle',
  audioDurationSec: 3.0,
  pauseAfterMs: 400,
  ui_state: {},
  visualCues: [
    { atMs: 500, action: 'reveal', target: 'progressStep', payload: 2 },
    { atMs: 1200, action: 'highlight', target: 'variableHighlight', payload: 'm' },
    { atMs: 2000, action: 'reveal', target: 'activeStepIndex', payload: 3 },
  ],
};

const cuesAtFrame10 = getActiveCues(mockBeat, 10, 30); // 333ms -> 0 cues
const cuesAtFrame20 = getActiveCues(mockBeat, 20, 30); // 666ms -> 1 cue (500ms)
const cuesAtFrame45 = getActiveCues(mockBeat, 45, 30); // 1500ms -> 2 cues (500ms, 1200ms)
const cuesAtFrame70 = getActiveCues(mockBeat, 70, 30); // 2333ms -> 3 cues (all)

assert(cuesAtFrame10.length === 0, 'At 333ms, 0 cues active');
assert(cuesAtFrame20.length === 1 && cuesAtFrame20[0].target === 'progressStep', 'At 666ms, progressStep cue active');
assert(cuesAtFrame45.length === 2, 'At 1500ms, 2 cues active');
assert(cuesAtFrame70.length === 3, 'At 2333ms, all 3 cues active');

const latestStep = getLatestCue(mockBeat, 'activeStepIndex', 70, 30);
assert(latestStep && latestStep.payload === 3, 'getLatestCue retrieves correct payload for activeStepIndex');

const isMHighlighted = isTargetActive(mockBeat, 'variableHighlight', 45, 30);
assert(isMHighlighted, 'isTargetActive returns true when variableHighlight cue has fired');

const progress = getCueProgress(mockBeat.visualCues[0], 20, 30, 200); // 666ms - 500ms = 166ms / 200ms = 0.83
assert(progress > 0.7 && progress < 0.9, `getCueProgress calculates smooth normalized transition: ${progress.toFixed(2)}`);

// -------------------------------------------------------------------
// 4. Validate All 4 Phase 2B Verification Fixtures
// -------------------------------------------------------------------
console.log('\nStep 4: Validating 4 Phase 2B Domain Fixtures');

const fixtureFiles = [
  { name: 'Finance Formula / Payoff Scene', file: 'hull_structured_scene.json' },
  { name: 'Generic Non-Finance Line Chart', file: 'physics_kinematics.json' },
  { name: 'Process Flow / Chronological Timeline', file: 'history_timeline.json' },
  { name: 'Interactive Quiz with Recall Cues', file: 'quiz_interactive.json' },
];

fixtureFiles.forEach(({ name, file }) => {
  const fPath = path.join(rootDir, 'src', 'data', 'fixtures', file);
  assert(fs.existsSync(fPath), `Fixture exists: ${file}`);
  const data = JSON.parse(fs.readFileSync(fPath, 'utf8'));
  const res = validateEpisodeData(data);
  assert(res.valid, `${name} (${file}) validates cleanly with zero errors`);
  if (!res.valid) {
    res.errors.forEach((e) => console.error(`    -> ${e}`));
  }
});

// -------------------------------------------------------------------
// 5. Template Registry Cue Target Validation
// -------------------------------------------------------------------
console.log('\nStep 5: Testing Cue Target Registry Enforcement');
const invalidCueBeat = {
  meta: { domain: 'physics', course: 'PHYSICS · NEWTON', chapter: 'CHAPTER 1 · LAWS', totalSegments: 1 },
  scenes: [
    {
      segmentIndex: 0,
      title: 'Invalid Cue Target Scene',
      template: 'data_visualizer',
      beats: [
        {
          id: 'b_invalid',
          hindi_tts: 'यह परीक्षण अवैध क्यू लक्ष्य की जाँच करता है।',
          en_subtitle: 'This test validates cue target enforcement against registry.',
          pauseAfterMs: 400,
          visualCues: [
            { atMs: 200, action: 'reveal', target: 'unsupportedTargetThatDoesNotExist', payload: 123 },
          ],
          ui_state: { chartTitle: 'Chart', preset: 'telemetry_line', progressStep: 1, totalSteps: 2 },
        },
      ],
    },
  ],
};

const invalidRes = validateEpisodeData(invalidCueBeat);
assert(!invalidRes.valid, 'Validator rejects unsupported cue target not defined in template registry');
assert(
  invalidRes.errors.some((e) => e.includes('Target "unsupportedTargetThatDoesNotExist" is not supported')),
  'Validator reports explicit error with allowed template targets'
);

// -------------------------------------------------------------------
// 6. Monotonic Timing Order Enforcement
// -------------------------------------------------------------------
console.log('\nStep 6: Testing Monotonic Timestamp Order Enforcement');
const outOfOrderCueBeat = {
  meta: { domain: 'physics', course: 'PHYSICS · NEWTON', chapter: 'CHAPTER 1 · LAWS', totalSegments: 1 },
  scenes: [
    {
      segmentIndex: 0,
      title: 'Out of Order Cues Scene',
      template: 'formula_breakdown',
      beats: [
        {
          id: 'b_ooo',
          hindi_tts: 'यह समय के क्रम की जाँच करता है।',
          en_subtitle: 'This test validates non-decreasing timestamp order.',
          pauseAfterMs: 400,
          visualCues: [
            { atMs: 1500, action: 'reveal', target: 'activeStepIndex', payload: 2 },
            { atMs: 500, action: 'highlight', target: 'variableHighlight', payload: 'm' }, // out of order!
          ],
          ui_state: {
            formulaTitle: 'Title',
            expression: 'F = m · a',
            variables: [{ symbol: 'F', label: 'Force' }],
            steps: [{ stepIndex: 1, label: 'Form', equation: 'F = m · a' }],
          },
        },
      ],
    },
  ],
};

const oooRes = validateEpisodeData(outOfOrderCueBeat);
assert(!oooRes.valid, 'Validator rejects visual cues that are out of chronological order');
assert(
  oooRes.errors.some((e) => e.includes('must be sorted in non-decreasing order')),
  'Validator reports explicit non-decreasing order violation'
);

// -------------------------------------------------------------------
// Summary
// -------------------------------------------------------------------
console.log('\n===============================================================');
console.log(`Results: ${passedTests} / ${totalTests} tests passed cleanly.`);
if (passedTests === totalTests) {
  console.log('🎉 ALL PHASE 2B VERIFICATION GATES PASSED CLEANLY!');
} else {
  console.error('❌ SOME CHECKS FAILED!');
  process.exit(1);
}
console.log('===============================================================\n');
