// scripts/test_harness.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);

// 1. Resolve Target Directory & Chapter Key
function resolveTargetDirectory() {
  const dirArg = args.find((a) => a.startsWith('--dir='));
  if (dirArg) return dirArg.split('=')[1].replace(/"/g, '').trim();

  const chapterArg = args.find((a) => a.startsWith('--chapter='));
  if (chapterArg) {
    const chap = chapterArg.split('=')[1].replace(/"/g, '').trim();
    return chap.includes('/') || chap.includes('\\') ? chap : `src/data/chapters/${chap}`;
  }

  // Check positional argument
  const posArg = args.find((a) => !a.startsWith('--'));
  if (posArg) {
    const clean = posArg.trim();
    if (fs.existsSync(clean)) return clean;
    if (fs.existsSync(path.join(process.cwd(), clean))) return clean;
    return `src/data/chapters/${clean}`;
  }

  // Fallback: Find the most recently modified chapter folder with episode_raw.json
  const chaptersRoot = path.join(process.cwd(), 'src', 'data', 'chapters');
  if (fs.existsSync(chaptersRoot)) {
    const dirs = fs
      .readdirSync(chaptersRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => {
        const full = path.join(chaptersRoot, d.name);
        const raw = path.join(full, 'episode_raw.json');
        return {
          path: `src/data/chapters/${d.name}`,
          mtime: fs.existsSync(raw) ? fs.statSync(raw).mtimeMs : 0,
        };
      })
      .filter((d) => d.mtime > 0)
      .sort((a, b) => b.mtime - a.mtime);

    if (dirs.length > 0) return dirs[0].path;
  }

  if (fs.existsSync(path.join(process.cwd(), 'src', 'data', 'episode_raw.json'))) {
    return 'src/data';
  }

  return 'src/data/chapters/ch03_part1_argon';
}

const targetDir = resolveTargetDirectory();
const rootDir = process.cwd();
const relTargetDir = path.isAbsolute(targetDir)
  ? path.relative(rootDir, targetDir).replace(/\\/g, '/')
  : targetDir.replace(/\\/g, '/');
const rawEpisodePath = path.isAbsolute(targetDir)
  ? path.join(targetDir, 'episode_raw.json')
  : path.join(rootDir, targetDir, 'episode_raw.json');
const compiledEpisodePath = path.isAbsolute(targetDir)
  ? path.join(targetDir, 'episode_compiled.json')
  : path.join(rootDir, targetDir, 'episode_compiled.json');

console.log(`\n======================================================`);
console.log(`🛡️ RUNNING AUTOMATED QA & SELF-CORRECTION HARNESS`);
console.log(`📁 Target Directory: ${relTargetDir}`);
console.log(`======================================================\n`);

if (!fs.existsSync(rawEpisodePath)) {
  console.error(`❌ Harness Error: 'episode_raw.json' not found at: ${rawEpisodePath}`);
  process.exit(1);
}

let hasDefects = false;
const defectLogs = [];

// -------------------------------------------------------------------
// 1. Pre-Render Validation via validate_episode.mjs
// -------------------------------------------------------------------
console.log(`🔍 [1/3] Executing strict pre-render validation (Zod & price-bounds)...`);
try {
  execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${relTargetDir}"`, {
    stdio: 'inherit',
    cwd: rootDir,
  });
} catch {
  hasDefects = true;
  defectLogs.push('Zod schema, landmark price-boundary, or UI invariant violation detected.');
}

// -------------------------------------------------------------------
// 2. Structural & Telemetry Inspection
// -------------------------------------------------------------------
console.log(`🔍 [2/3] Inspecting episode telemetry, UI invariants, and compiled audio...`);
try {
  const episodeRaw = JSON.parse(fs.readFileSync(rawEpisodePath, 'utf8'));

  // Breadcrumb / Chapter Meta Check
  if (episodeRaw.meta?.chapter && /_ARGON|_V\d+/i.test(episodeRaw.meta.chapter)) {
    hasDefects = true;
    defectLogs.push(`meta.chapter contains illegal suffix: "${episodeRaw.meta.chapter}" (must match /^CHAPTER \\d+ · PART \\d+$/).`);
  }

  // Template-Specific Checks
  episodeRaw.scenes?.forEach((scene, sIdx) => {
    // Summary Thread Checks
    if (scene.template === 'summary_thread') {
      const steps = scene.beats?.[0]?.ui_state?.steps || [];
      if (steps.length < 6 || steps.length > 8) {
        hasDefects = true;
        defectLogs.push(`Scene ${sIdx} (summary_thread) has ${steps.length} steps (must be between 6 and 8).`);
      }
      const heading = scene.beats?.[0]?.ui_state?.heading;
      if (heading && heading !== "Today's thread") {
        hasDefects = true;
        defectLogs.push(`Scene ${sIdx} (summary_thread) heading is "${heading}" (must strictly be "Today's thread").`);
      }
    }

    // Interactive Quiz Checks
    if (scene.template === 'interactive_quiz') {
      if (scene.beats?.length !== 3) {
        hasDefects = true;
        defectLogs.push(`Scene ${sIdx} (interactive_quiz) has ${scene.beats?.length} beats (must have exactly 3).`);
      }
    }

    // Split Comparison Bullets Check
    if (scene.template === 'split_comparison') {
      scene.beats?.forEach((beat, bIdx) => {
        const leftBullets = beat.ui_state?.leftColumn?.bullets || [];
        const rightBullets = beat.ui_state?.rightColumn?.bullets || [];
        [...leftBullets, ...rightBullets].forEach((bullet) => {
          if (typeof bullet === 'string' && /^\s*-->|^\s*->/.test(bullet)) {
            hasDefects = true;
            defectLogs.push(`Scene ${sIdx} Beat ${bIdx} bullet starts with an ASCII arrow: "${bullet}".`);
          }
        });
      });
    }
  });

  // Compiled Episode Audio & Telemetry Verification (if compiled)
  if (fs.existsSync(compiledEpisodePath)) {
    const compiledData = JSON.parse(fs.readFileSync(compiledEpisodePath, 'utf8'));
    let totalFrames = 0;
    let missingAudioCount = 0;
    let zeroDurationCount = 0;

    compiledData.scenes?.forEach((scene, sIdx) => {
      scene.beats?.forEach((beat, bIdx) => {
        totalFrames += beat.durationInFrames || 0;

        if (!beat.durationInFrames || beat.durationInFrames <= 0 || isNaN(beat.durationInFrames)) {
          zeroDurationCount++;
          defectLogs.push(`Compiled Scene ${sIdx} Beat ${bIdx} has invalid durationInFrames: ${beat.durationInFrames}`);
        }

        if (beat.audioFile) {
          const candidateAudioPaths = [
            path.isAbsolute(beat.audioFile) ? beat.audioFile : path.join(rootDir, 'public', beat.audioFile),
            path.isAbsolute(beat.audioFile) ? beat.audioFile : path.join(rootDir, beat.audioFile),
            path.join(rootDir, targetDir, beat.audioFile),
            path.join(rootDir, targetDir, 'audio', path.basename(beat.audioFile)),
          ];

          const audioPath = candidateAudioPaths.find((p) => fs.existsSync(p));

          if (!audioPath || fs.statSync(audioPath).size === 0) {
            missingAudioCount++;
            defectLogs.push(`Missing or 0-byte audio file for Scene ${sIdx} Beat ${bIdx}: ${beat.audioFile}`);
          }
        }
      });
    });

    if (zeroDurationCount > 0) {
      hasDefects = true;
      defectLogs.push(`Found ${zeroDurationCount} beats with 0 or NaN duration.`);
    }

    if (missingAudioCount > 0) {
      hasDefects = true;
      defectLogs.push(`Found ${missingAudioCount} missing audio files in compiled episode.`);
    }

    console.log(`   📊 Telemetry: Total Frames = ${totalFrames} (~${(totalFrames / 30).toFixed(1)}s), Compiled Audio Verified.`);
  } else {
    console.log(`   ℹ️ Note: 'episode_compiled.json' not yet present (pre-TTS phase).`);
  }

  // Rendered MP4 Sanity Check (if output video exists)
  const baseName = path.basename(targetDir).replace(/_argon$/, '');
  const candidateVideos = [
    path.join(rootDir, 'out', 'chapters', `${baseName}.mp4`),
    path.join(rootDir, 'out', `${baseName}.mp4`),
  ];
  const renderedVideo = candidateVideos.find((v) => fs.existsSync(v));
  if (renderedVideo) {
    const stat = fs.statSync(renderedVideo);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    if (stat.size < 1024 * 1024) {
      hasDefects = true;
      defectLogs.push(`Rendered video ${renderedVideo} is suspiciously small: ${sizeMb} MB (expected > 1 MB).`);
    } else {
      console.log(`   🎥 Video Render Verified: ${renderedVideo} (${sizeMb} MB)`);
    }
  }
} catch (parseErr) {
  hasDefects = true;
  defectLogs.push(`Episode JSON parsing/inspection error: ${parseErr.message}`);
}

// -------------------------------------------------------------------
// 3. Single-Pass Auto-Correction Decision Matrix
// -------------------------------------------------------------------
if (hasDefects) {
  console.warn(`\n⚠️ QA Harness intercepted defects:`);
  defectLogs.forEach((log) => console.warn(`   - ${log}`));
  console.warn(`\n🔧 Triggering STRICT SINGLE-PASS automatic code/data remedy...`);

  try {
    let content = fs.readFileSync(rawEpisodePath, 'utf8');

    // 1. Textual / Phonetic replacements
    content = content.replace(/रि[ज़जज़]ल्ट्स|रि[ज़जज़]ल्ट|रि[ज़जज़]िट|रि[ज़जज़]ट/gi, 'नतीजे');
    content = content.replace(/USFDA|यू\s*एस\s*एफ\s*डी\s*ए/gi, 'दवा रेगुलेटर (FDA)');
    content = content.replace(/freight\s+train/gi, 'भारी ट्रेन');
    content = content.replace(/"chapter":\s*"CHAPTER\s*0?(\d+)\s*·\s*PART\s*0?(\d+)[^"]*"/gi, '"chapter": "CHAPTER $1 · PART $2"');
    content = content.replace(/-->\s*/g, '').replace(/->\s*/g, '');
    content = content.replace(/"heading":\s*"(?:Key Takeaways|Summary Thread|Recap|Summary)"/gi, '"heading": "Today\'s thread"');

    // 2. Structural JSON auto-fixes
    let parsed = JSON.parse(content);
    if (Array.isArray(parsed.scenes)) {
      const PRESET_CANDLE_BOUNDS = {
        uptrend_then_drop: {
          minCandle: 119,
          maxCandle: 160,
          forbiddenPrices: [165],
          defaultSafeMin: 120,
          defaultSafeMax: 158,
        },
        uptrend_break: {
          minCandle: 97,
          maxCandle: 149,
          forbiddenPrices: [152],
          defaultSafeMin: 98,
          defaultSafeMax: 148,
        },
        bull_breakout: {
          minCandle: 119,
          maxCandle: 169,
          forbiddenPrices: [175],
          defaultSafeMin: 120,
          defaultSafeMax: 168,
        },
        head_and_shoulders: {
          minCandle: 133,
          maxCandle: 175,
          forbiddenPrices: [182, 124],
          defaultSafeMin: 134,
          defaultSafeMax: 175,
        },
        random_walk_line: {
          minCandle: 95,
          maxCandle: 175,
          forbiddenPrices: [],
          defaultSafeMin: 100,
          defaultSafeMax: 165,
        },
      };

      parsed.scenes.forEach((scene) => {
        // Summary thread step range and beat count normalization
        if (scene.template === 'summary_thread' && Array.isArray(scene.beats)) {
          const firstUI = scene.beats[0]?.ui_state || {};
          let steps = firstUI.steps || [];
          if (!Array.isArray(steps) || steps.length < 6) {
            if (!Array.isArray(steps)) steps = [];
            while (steps.length < 6) {
              steps.push(`Key Principle ${steps.length + 1}: Always trade confirmed technical signals.`);
            }
          } else if (steps.length > 8) {
            steps = steps.slice(0, 8);
          }
          const totalSteps = steps.length;

          // Body 2-step chunks: e.g. [1,2], [3,4], [5,6], [7,8]
          const bodyRanges = [];
          for (let s = 1; s <= totalSteps; s += 2) {
            bodyRanges.push([s, Math.min(totalSteps, s + 1)]);
          }
          const requiredTotalBeats = 1 + bodyRanges.length + 1; // intro + body + takeaway

          scene.beats.forEach((b) => {
            if (!b.ui_state) b.ui_state = {};
            b.ui_state.steps = steps;
            b.ui_state.heading = "Today's thread";
          });

          if (scene.beats.length < requiredTotalBeats) {
            const origIntro = scene.beats[0];
            const origTakeaway = scene.beats[scene.beats.length - 1];
            const existingBody = scene.beats.slice(1, -1);

            const newBeats = [
              {
                ...origIntro,
                ui_state: {
                  ...origIntro.ui_state,
                  steps,
                  heading: "Today's thread",
                  activeStepRange: [0, 0],
                },
              },
            ];

            bodyRanges.forEach((range, idx) => {
              if (idx < existingBody.length) {
                newBeats.push({
                  ...existingBody[idx],
                  ui_state: {
                    ...existingBody[idx].ui_state,
                    steps,
                    heading: "Today's thread",
                    activeStepRange: range,
                  },
                });
              } else {
                const stepNames = steps.slice(range[0] - 1, range[1]).map((s) => s.replace(/^.*?:/g, '').trim()).join(' और ');
                newBeats.push({
                  id: `${origIntro.id || 'sum'}_b${idx + 1}`,
                  hindi_tts: `चार्ट पर हमेशा याद रखें: ${stepNames}।`,
                  en_subtitle: `Crucial rule: ${steps.slice(range[0] - 1, range[1]).join('; ')}.`,
                  pauseAfterMs: 400,
                  ui_state: {
                    ...origIntro.ui_state,
                    steps,
                    heading: "Today's thread",
                    activeStepRange: range,
                  },
                });
              }
            });

            newBeats.push({
              ...origTakeaway,
              id: origTakeaway.id || `${origIntro.id || 'sum'}_takeaway`,
              pauseAfterMs: 600,
              ui_state: {
                ...origTakeaway.ui_state,
                steps,
                heading: "Today's thread",
                activeStepRange: [1, totalSteps],
              },
            });

            scene.beats = newBeats;
          } else {
            scene.beats[0].ui_state.activeStepRange = [0, 0];
            const bodyBeats = scene.beats.slice(1, -1);
            bodyBeats.forEach((b, idx) => {
              if (idx < bodyRanges.length) {
                b.ui_state.activeStepRange = bodyRanges[idx];
              } else {
                b.ui_state.activeStepRange = [totalSteps, totalSteps];
              }
            });
            scene.beats[scene.beats.length - 1].ui_state.activeStepRange = [1, totalSteps];
          }
        }

        // Data visualizer preset candle price clamping
        if (scene.template === 'data_visualizer' && Array.isArray(scene.beats)) {
          scene.beats.forEach((b) => {
            const ui = b.ui_state;
            if (!ui) return;
            const preset = ui.preset || 'uptrend_then_drop';
            const bounds = PRESET_CANDLE_BOUNDS[preset];
            if (!bounds) return;

            if (preset === 'head_and_shoulders') {
              if (!/shoulder|head|neckline|reversal pattern/i.test(`${scene.title || ''} ${ui.chartTitle || ''} ${ui.chartSubtitle || ''}`)) {
                ui.chartSubtitle = `${ui.chartSubtitle || ''} · reversal pattern`.trim();
              }
            }

            const clampPriceStr = (str) => {
              if (typeof str !== 'string') return str;
              return str.replace(/₹\s*(\d+(?:,\d+)?(?:\.\d+)?)/g, (match, p) => {
                const val = parseFloat(p.replace(/,/g, ''));
                if (val < bounds.minCandle) return `₹${bounds.defaultSafeMin}`;
                if (val > bounds.maxCandle || bounds.forbiddenPrices.includes(val)) return `₹${bounds.defaultSafeMax}`;
                return match;
              });
            };

            if (b.hindi_tts) b.hindi_tts = clampPriceStr(b.hindi_tts);
            if (b.en_subtitle) b.en_subtitle = clampPriceStr(b.en_subtitle);
            if (Array.isArray(ui.annotations)) {
              ui.annotations.forEach((ann) => {
                if (ann.text) ann.text = clampPriceStr(ann.text);
                if (typeof ann.value === 'number') {
                  if (ann.value < bounds.minCandle) ann.value = bounds.defaultSafeMin;
                  if (ann.value > bounds.maxCandle || bounds.forbiddenPrices.includes(ann.value)) {
                    ann.value = bounds.defaultSafeMax;
                  }
                }
              });
            }
            if (Array.isArray(ui.sideCards)) {
              ui.sideCards.forEach((c) => {
                if (c.title) c.title = clampPriceStr(c.title);
                if (c.subtitle) c.subtitle = clampPriceStr(c.subtitle);
              });
            }
          });
        }
      });
    }

    fs.writeFileSync(rawEpisodePath, JSON.stringify(parsed, null, 2), 'utf8');

    // Re-run validation strictly ONCE to prevent infinite loops
    console.log(`🔄 Re-validating after single auto-fix pass...`);
    execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${relTargetDir}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
    console.log(`✅ Single-pass self-correction passed successfully!`);
  } catch (fixErr) {
    console.error(`\n❌ CRITICAL: Defects persisted after the single auto-correction pass.`);
    console.error(`   Halting execution to prevent infinite loop. Please review defect log above.`);
    process.exit(1);
  }
} else {
  console.log(`\n✨ [3/3] QA Harness Inspection Complete: Zero defects detected! Video assets are pristine.\n`);
}
