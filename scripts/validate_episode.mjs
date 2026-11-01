import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Regex to reject Devanagari Hindi characters in UI fields
const devanagariRegex = /[\u0900-\u097F]/;
const englishOnlyString = (fieldName) =>
  z.string().refine((val) => !devanagariRegex.test(val), {
    message: `${fieldName} must be 100% English. Devanagari characters are strictly forbidden in UI text.`,
  });

// ----------------------------------------------------
// PRESET PRICE BOUNDS & UTILITIES
// ----------------------------------------------------
export const PRESET_PRICE_BOUNDS = {
  uptrend_then_drop: {
    min: 115,
    max: 165,
    desc: 'starts ~₹120, peaks at ₹158 on candle 18–23, drops to ₹141 on candle 27',
  },
  uptrend_break: {
    min: 92,
    max: 152,
    desc: 'climbs from ₹98 to ₹148 on candle 16, support at ₹140 breaks on candle 18–21, drops to ₹134',
  },
  head_and_shoulders: {
    min: 124,
    max: 182,
    desc: 'Left Shoulder ₹158 at idx 4, Head ₹175 at idx 12, Right Shoulder ₹156 at idx 20, Neckline ₹142 breaks at idx 25',
  },
  random_walk_line: {
    min: 70,
    max: 185,
    desc: 'range from ₹70 to ₹185',
  },
};

export function extractRupeePrices(text) {
  if (!text || typeof text !== 'string') return [];
  const matches = [];
  const regex = /₹\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const numStr = m[1].replace(/,/g, '');
    const val = parseFloat(numStr);
    if (!isNaN(val)) matches.push(val);
  }
  return matches;
}

// ----------------------------------------------------
// ZOD SCHEMAS FOR TEMPLATE UI STATES
// ----------------------------------------------------

// 1. Chat Story
const ChatStoryUISchema = z
  .object({
    stageDirections: z.array(englishOnlyString('stageDirection')).optional(),
    messages: z
      .array(
        z.object({
          sender: englishOnlyString('sender').min(1),
          avatar: z.string().min(1),
          text: englishOnlyString('message text').min(1),
          theme: z.string().optional(),
          align: z.enum(['left', 'right']).optional(),
        })
      )
      .optional(),
    timeline: z
      .array(
        z.object({
          type: z.enum(['note', 'message']),
          text: englishOnlyString('timeline text').min(1),
          sender: englishOnlyString('sender').optional(),
          avatar: z.string().optional(),
          theme: z.string().optional(),
          align: z.enum(['left', 'right']).optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) =>
      (data.messages && data.messages.length > 0) ||
      (data.timeline && data.timeline.length > 0),
    {
      message: 'At least one chat message or timeline item is required',
    }
  );

// 2. Data Visualizer
const AnnotationSchema = z.object({
  type: z.string(),
  text: englishOnlyString('annotation text').min(1),
  value: z.number().optional(),
  candleIndex: z.number().optional(),
  color: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
});

const SideCardSchema = z.object({
  title: englishOnlyString('sideCard title').min(1),
  subtitle: englishOnlyString('sideCard subtitle'),
  state: z.string().optional(),
});

const OverlaySchema = z.object({
  type: z.enum(['trendline', 'horizontal_level', 'pattern_circles']),
  startIndex: z.number().optional(),
  endIndex: z.number().optional(),
  priceLevel: z.number().optional(),
  color: z.string().optional(),
  label: englishOnlyString('overlay label').optional(),
  points: z
    .array(
      z.object({
        candleIndex: z.number(),
        label: englishOnlyString('point label').optional(),
      })
    )
    .optional(),
});

const DataVisualizerUISchema = z.object({
  chartTitle: englishOnlyString('chartTitle').min(1),
  chartSubtitle: englishOnlyString('chartSubtitle').optional(),
  ticker: englishOnlyString('ticker').optional(),
  timeframe: englishOnlyString('timeframe').optional(),
  preset: z.string().min(1, 'preset is required'),
  progressStep: z.number().optional(),
  totalSteps: z.number().optional(),
  yAxisUnit: z.string().optional(),
  annotations: z.array(AnnotationSchema).optional(),
  sideCards: z.array(SideCardSchema).optional(),
  overlays: z.array(OverlaySchema).optional(),
});

// 3. Tug of War
const TugOfWarUISchema = z.object({
  leftLabel: englishOnlyString('leftLabel').min(1),
  leftCount: z.number().min(0).max(25, 'leftCount must be between 0 and 25'),
  rightLabel: englishOnlyString('rightLabel').min(1),
  rightCount: z.number().min(0).max(25, 'rightCount must be between 0 and 25'),
  centerTitle: englishOnlyString('centerTitle').min(1),
  centerMetric: englishOnlyString('centerMetric').min(1),
  startMetric: englishOnlyString('startMetric').optional(),
  trend: z.enum(['up', 'down']),
  bottomPill: z
    .object({
      text: englishOnlyString('bottomPill text').min(1),
      color: z.string().optional(),
    })
    .optional(),
});

// 4. Progressive Cards
const ProgressiveCardItemSchema = z.object({
  icon: z.string().optional(),
  title: englishOnlyString('card title').min(1),
  subtitle: englishOnlyString('card subtitle'),
  state: z.string().optional(),
});

const ProgressiveCardsUISchema = z.object({
  sectionHeader: englishOnlyString('sectionHeader').optional(),
  layout: z.enum(['stack', 'grid']).optional(),
  cards: z.array(ProgressiveCardItemSchema).min(1),
});

// 5. Split Comparison
const ComparisonColumnSchema = z.object({
  icon: z.string().optional(),
  title: englishOnlyString('column title').min(1),
  subtitle: englishOnlyString('column subtitle').optional(),
  theme: z.string().optional(),
  active: z.boolean().optional(),
  bullets: z.array(englishOnlyString('bullet')),
});

const SplitComparisonUISchema = z.object({
  showVsBadge: z.boolean().optional(),
  leftColumn: ComparisonColumnSchema,
  rightColumn: ComparisonColumnSchema,
});

// 6. Interactive Quiz
const InteractiveQuizUISchema = z.object({
  badge: englishOnlyString('quiz badge').optional(),
  question: englishOnlyString('quiz question').min(1),
  showThinkingSpinner: z.boolean().optional(),
  answer: englishOnlyString('quiz answer').nullable().optional(),
});

// 7. Summary Thread
const SummaryThreadUISchema = z.object({
  headerBadge: englishOnlyString('headerBadge').optional(),
  heading: englishOnlyString('heading').min(1),
  activeStepIndex: z.number().optional(),
  activeStepRange: z.tuple([z.number(), z.number()]).optional(),
  steps: z.array(englishOnlyString('step')).min(1),
  bottomTakeaway: englishOnlyString('bottomTakeaway').optional(),
});

const TemplateUiSchemaMap = {
  chat_story: ChatStoryUISchema,
  data_visualizer: DataVisualizerUISchema,
  tug_of_war: TugOfWarUISchema,
  progressive_cards: ProgressiveCardsUISchema,
  split_comparison: SplitComparisonUISchema,
  interactive_quiz: InteractiveQuizUISchema,
  summary_thread: SummaryThreadUISchema,
};

// Common Episode Envelope
const MetaSchema = z.object({
  domain: z.string().min(1, 'meta.domain is required'),
  course: englishOnlyString('meta.course').min(1),
  chapter: englishOnlyString('meta.chapter').min(1),
  totalSegments: z.number().positive(),
});

const BeatBaseSchema = z.object({
  id: z.string().min(1, 'beat.id is required'),
  hindi_tts: z.string().min(1, 'beat.hindi_tts is required'),
  en_subtitle: englishOnlyString('beat.en_subtitle').min(1),
  pauseAfterMs: z.number().nonnegative().optional(),
});

// ----------------------------------------------------
// VALIDATION LOGIC
// ----------------------------------------------------

export function validateEpisodeData(data) {
  const errors = [];

  // Validate Meta
  const metaResult = MetaSchema.safeParse(data?.meta);
  if (!metaResult.success) {
    metaResult.error.issues.forEach((issue) => {
      errors.push(`[META ERROR] meta.${issue.path.join('.')}: ${issue.message}`);
    });
  }

  // Validate Meta Chapter format (Breadcrumb Cleanliness Lock)
  if (data?.meta?.chapter) {
    const chap = String(data.meta.chapter).trim();
    if (chap.includes('_ARGON') || chap.includes('_')) {
      errors.push(
        `[META ERROR] meta.chapter must NOT contain "_ARGON" or underscores. Got "${chap}". Must match format: "CHAPTER X · PART Y" or "APPENDIX ..."`
      );
    }
    const validChapterRegex = /^(?:CHAPTER\s+\d+\s*·\s*PART\s+\d+|APPENDIX.*)$/i;
    if (!validChapterRegex.test(chap)) {
      errors.push(
        `[META ERROR] meta.chapter "${chap}" does not match required format: "CHAPTER X · PART Y" or "APPENDIX ..."`
      );
    }
  }

  // Validate Scenes array
  if (!Array.isArray(data?.scenes) || data.scenes.length === 0) {
    errors.push(`[SCENE ERROR] 'scenes' must be a non-empty array`);
    return { valid: false, errors };
  }

  data.scenes.forEach((scene, sIdx) => {
    const scenePrefix = `Scene[${sIdx}] (segmentIndex: ${scene.segmentIndex}, title: "${scene.title || 'Untitled'}")`;

    if (scene.segmentIndex === undefined || typeof scene.segmentIndex !== 'number') {
      errors.push(`${scenePrefix}: missing or invalid 'segmentIndex'`);
    }

    if (!scene.title || typeof scene.title !== 'string') {
      errors.push(`${scenePrefix}: missing or invalid 'title'`);
    }

    if (!TemplateUiSchemaMap[scene.template]) {
      errors.push(
        `${scenePrefix}: unknown template '${scene.template}'. Must be one of: ${Object.keys(
          TemplateUiSchemaMap
        ).join(', ')}`
      );
      return;
    }

    const templateUiSchema = TemplateUiSchemaMap[scene.template];

    if (!Array.isArray(scene.beats) || scene.beats.length === 0) {
      errors.push(`${scenePrefix}: 'beats' must be a non-empty array`);
      return;
    }

    // PRESET PRICE RANGE LOCK:
    if (scene.template === 'data_visualizer') {
      const preset = scene.beats[0]?.ui_state?.preset;
      const bounds = PRESET_PRICE_BOUNDS[preset];
      if (bounds) {
        scene.beats.forEach((beat, bIdx) => {
          const beatPrefix = `${scenePrefix} -> Beat[${bIdx}]`;
          const pricesToCheck = [];

          pricesToCheck.push(...extractRupeePrices(beat.hindi_tts));
          pricesToCheck.push(...extractRupeePrices(beat.en_subtitle));

          if (Array.isArray(beat.ui_state?.annotations)) {
            beat.ui_state.annotations.forEach((ann) => {
              pricesToCheck.push(...extractRupeePrices(ann.text));
              if (typeof ann.value === 'number') {
                pricesToCheck.push(ann.value);
              }
            });
          }

          if (Array.isArray(beat.ui_state?.sideCards)) {
            beat.ui_state.sideCards.forEach((card) => {
              pricesToCheck.push(...extractRupeePrices(card.title));
              pricesToCheck.push(...extractRupeePrices(card.subtitle));
            });
          }

          pricesToCheck.forEach((price) => {
            if (price < bounds.min || price > bounds.max) {
              errors.push(
                `${beatPrefix}: price ₹${price} is out of bounds [${bounds.min}, ${bounds.max}] for preset "${preset}". Valid bounds for ${preset} are [${bounds.min}, ${bounds.max}] (${bounds.desc}).`
              );
            }
          });
        });
      }
    }

    // IMMUTABLE CARD TEXT & MAX 1 CARD REVEAL CHECK:
    if (scene.template === 'progressive_cards') {
      let baselineCards = null;
      let prevNonHiddenCount = 0;
      scene.beats.forEach((beat, bIdx) => {
        const cards = beat?.ui_state?.cards;
        if (Array.isArray(cards)) {
          // Check max 1 new card revealed per beat
          const nonHiddenCount = cards.filter((c) => c.state !== 'hidden').length;
          if (bIdx > 0 && nonHiddenCount - prevNonHiddenCount > 1) {
            errors.push(
              `${scenePrefix} -> Beat[${bIdx}]: revealed ${nonHiddenCount - prevNonHiddenCount} new cards. A progressive_cards scene must reveal at most 1 new card per beat.`
            );
          }
          prevNonHiddenCount = nonHiddenCount;

          if (!baselineCards) {
            baselineCards = cards.map((c) => ({ title: c.title, subtitle: c.subtitle }));
          } else {
            cards.forEach((c, cIdx) => {
              if (baselineCards[cIdx]) {
                if (baselineCards[cIdx].title !== c.title) {
                  errors.push(
                    `${scenePrefix} -> Beat[${bIdx}]: card[${cIdx}] title mutated from "${baselineCards[cIdx].title}" to "${c.title}". Card copy must stay immutable within a scene.`
                  );
                }
                if (baselineCards[cIdx].subtitle !== c.subtitle) {
                  errors.push(
                    `${scenePrefix} -> Beat[${bIdx}]: card[${cIdx}] subtitle mutated from "${baselineCards[cIdx].subtitle}" to "${c.subtitle}". Card copy must stay immutable within a scene.`
                  );
                }
              }
            });
          }
        }
      });
    }

    // INTERACTIVE QUIZ: 3-BEAT LOCK & IMMUTABLE QUESTION CHECK:
    if (scene.template === 'interactive_quiz') {
      if (scene.beats.length !== 3) {
        errors.push(
          `${scenePrefix}: interactive_quiz must have exactly 3 beats (got ${scene.beats.length}). Expected: Beat 0 (scenario intro), Beat 1 (thinking pause), Beat 2 (answer reveal).`
        );
      } else {
        const [b0, b1, b2] = scene.beats;

        // Beat 0: showThinkingSpinner: false, answer: null/falsy
        if (b0.ui_state?.showThinkingSpinner) {
          errors.push(
            `${scenePrefix} -> Beat[0]: showThinkingSpinner must be false on the scenario intro beat.`
          );
        }
        if (b0.ui_state?.answer) {
          errors.push(
            `${scenePrefix} -> Beat[0]: answer must be null on the scenario intro beat.`
          );
        }

        // Beat 1: showThinkingSpinner: true, answer: null/falsy, pauseAfterMs >= 3000
        if (!b1.ui_state?.showThinkingSpinner) {
          errors.push(
            `${scenePrefix} -> Beat[1]: showThinkingSpinner must be true on the thinking pause beat.`
          );
        }
        if (b1.ui_state?.answer) {
          errors.push(
            `${scenePrefix} -> Beat[1]: answer must be null on the thinking pause beat.`
          );
        }
        const pause = b1.pauseAfterMs ?? 0;
        if (pause < 3000) {
          errors.push(
            `${scenePrefix} -> Beat[1]: pauseAfterMs must be at least 3000ms for thinking pause (got ${pause}ms).`
          );
        }

        // Beat 2: showThinkingSpinner: false, answer: non-empty string
        if (b2.ui_state?.showThinkingSpinner) {
          errors.push(
            `${scenePrefix} -> Beat[2]: showThinkingSpinner must be false on the answer reveal beat.`
          );
        }
        if (
          !b2.ui_state?.answer ||
          typeof b2.ui_state.answer !== 'string' ||
          b2.ui_state.answer.trim().length === 0
        ) {
          errors.push(
            `${scenePrefix} -> Beat[2]: answer must be a non-empty string on the answer reveal beat.`
          );
        }
      }

      let baselineQuestion = null;
      scene.beats.forEach((beat, bIdx) => {
        const q = beat?.ui_state?.question;
        if (q) {
          const wordCount = q.trim().split(/\s+/).length;
          if (wordCount < 18) {
            errors.push(
              `${scenePrefix} -> Beat[${bIdx}]: quiz question must be a complete self-contained scenario + question (minimum 18 words, got ${wordCount}).`
            );
          }
          if (!baselineQuestion) {
            baselineQuestion = q;
          } else if (baselineQuestion !== q) {
            errors.push(
              `${scenePrefix} -> Beat[${bIdx}]: quiz question mutated from "${baselineQuestion}" to "${q}". Quiz question must stay 100% identical across all beats.`
            );
          }
        }
      });
    }

    // SUMMARY THREAD: >= 4 BEATS, SEQUENTIAL STEP COMPLETENESS & IMMUTABLE HEADING CHECK:
    if (scene.template === 'summary_thread') {
      if (scene.beats.length < 4) {
        errors.push(
          `${scenePrefix}: summary_thread must have at least 4 beats (got ${scene.beats.length}).`
        );
      }

      // Beat 0 activeStepRange must be [0, 0]
      const b0Range = scene.beats[0]?.ui_state?.activeStepRange;
      if (!Array.isArray(b0Range) || b0Range[0] !== 0 || b0Range[1] !== 0) {
        errors.push(
          `${scenePrefix} -> Beat[0]: activeStepRange must be [0, 0] for the intro beat (got ${JSON.stringify(b0Range)}).`
        );
      }

      // Check heading: must be exactly "Today's thread"
      scene.beats.forEach((beat, bIdx) => {
        const heading = beat?.ui_state?.heading;
        if (heading !== "Today's thread") {
          errors.push(
            `${scenePrefix} -> Beat[${bIdx}]: heading must be exactly "Today's thread" (got "${heading}").`
          );
        }
      });

      // Steps count between 6 and 8
      scene.beats.forEach((beat, bIdx) => {
        const steps = beat?.ui_state?.steps;
        if (Array.isArray(steps)) {
          if (steps.length < 6 || steps.length > 8) {
            errors.push(
              `${scenePrefix} -> Beat[${bIdx}]: steps array length is ${steps.length}. Summary thread must contain between 6 and 8 steps.`
            );
          }
        }
      });

      // Sequential coverage check
      const totalSteps = scene.beats[0]?.ui_state?.steps?.length || 0;
      if (totalSteps > 0 && scene.beats.length >= 4) {
        let maxCovered = 0;
        scene.beats.slice(1, scene.beats.length - 1).forEach((beat) => {
          const range = beat?.ui_state?.activeStepRange;
          if (Array.isArray(range) && range.length === 2) {
            if (range[1] > maxCovered) maxCovered = range[1];
          }
        });

        const finalRange = scene.beats[scene.beats.length - 1]?.ui_state?.activeStepRange;
        const finalCovered = Array.isArray(finalRange) ? finalRange[1] : 0;
        if (maxCovered < totalSteps && finalCovered < totalSteps) {
          errors.push(
            `${scenePrefix}: steps were skipped before the final takeaway beat. Steps must cover 1 to ${totalSteps} (max reached was ${Math.max(maxCovered, finalCovered)}).`
          );
        }
      }
    }

    // SPLIT COMPARISON: NO ASCII ARROWS (--> or ->) IN BULLETS & IMMUTABLE COLUMN TITLES:
    if (scene.template === 'split_comparison') {
      let baselineLeft = null;
      let baselineRight = null;
      scene.beats.forEach((beat, bIdx) => {
        const left = beat?.ui_state?.leftColumn;
        const right = beat?.ui_state?.rightColumn;

        const checkBullets = (colName, bullets) => {
          if (Array.isArray(bullets)) {
            bullets.forEach((bullet, idx) => {
              if (typeof bullet === 'string' && /^(-->|->)/.test(bullet.trim())) {
                errors.push(
                  `${scenePrefix} -> Beat[${bIdx}]: ${colName}.bullets[${idx}] starts with an ASCII arrow ("${bullet}"). Bullets must NOT start with "-->" or "->".`
                );
              }
            });
          }
        };
        checkBullets('leftColumn', left?.bullets);
        checkBullets('rightColumn', right?.bullets);

        if (left && right) {
          if (!baselineLeft) {
            baselineLeft = { title: left.title, subtitle: left.subtitle };
            baselineRight = { title: right.title, subtitle: right.subtitle };
          } else {
            if (baselineLeft.title !== left.title) {
              errors.push(
                `${scenePrefix} -> Beat[${bIdx}]: leftColumn.title mutated from "${baselineLeft.title}" to "${left.title}". Copy must stay immutable within a scene.`
              );
            }
            if (baselineRight.title !== right.title) {
              errors.push(
                `${scenePrefix} -> Beat[${bIdx}]: rightColumn.title mutated from "${baselineRight.title}" to "${right.title}". Copy must stay immutable within a scene.`
              );
            }
          }
        }
      });
    }

    scene.beats.forEach((beat, bIdx) => {
      const beatPrefix = `${scenePrefix} -> Beat[${bIdx}] (id: "${beat?.id || 'unidentified'}")`;

      // Base fields check
      const baseResult = BeatBaseSchema.safeParse(beat);
      if (!baseResult.success) {
        baseResult.error.issues.forEach((issue) => {
          errors.push(`${beatPrefix}: field '${issue.path.join('.')}' is invalid: ${issue.message}`);
        });
      }

      // Template specific UI state check
      const uiResult = templateUiSchema.safeParse(beat?.ui_state);
      if (!uiResult.success) {
        uiResult.error.issues.forEach((issue) => {
          errors.push(
            `${beatPrefix}: ui_state.${issue.path.join('.') || 'root'}: ${issue.message}`
          );
        });
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

// CLI Execution
export function runCli() {
  const args = process.argv.slice(2);
  let targetFile = null;

  const dirArg = args.find((a) => a.startsWith('--dir='));
  const chapterArg = args.find((a) => a.startsWith('--chapter='));
  const fileArg = args.find((a) => !a.startsWith('--'));

  if (dirArg) {
    const customDir = dirArg.split('=')[1];
    const resolvedDir = path.isAbsolute(customDir) ? customDir : path.resolve(rootDir, customDir);
    targetFile = path.extname(resolvedDir) === '.json'
      ? resolvedDir
      : path.join(resolvedDir, 'episode_raw.json');
  } else if (chapterArg) {
    const slug = chapterArg.split('=')[1];
    targetFile = path.resolve(rootDir, 'src', 'data', 'chapters', slug, 'episode_raw.json');
  } else if (fileArg) {
    const resolved = path.isAbsolute(fileArg) ? fileArg : path.resolve(rootDir, fileArg);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      targetFile = path.join(resolved, 'episode_raw.json');
    } else {
      targetFile = resolved;
    }
  } else {
    targetFile = path.join(rootDir, 'src', 'data', 'episode_raw.json');
  }

  console.log(`[VALIDATION] Validating episode file: ${targetFile}`);

  if (!fs.existsSync(targetFile)) {
    console.error(`[ERROR] File does not exist: ${targetFile}`);
    process.exit(1);
  }

  let rawContent;
  try {
    rawContent = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
  } catch (err) {
    console.error(`[ERROR] Failed to parse JSON from ${targetFile}: ${err.message}`);
    process.exit(1);
  }

  const { valid, errors } = validateEpisodeData(rawContent);

  if (!valid) {
    console.error(`\n========================================`);
    console.error(`[VALIDATION FAILED] Found ${errors.length} schema error(s):`);
    console.error(`========================================`);
    errors.forEach((err, idx) => {
      console.error(`  ${idx + 1}. ${err}`);
    });
    console.error(`========================================\n`);
    process.exit(1);
  } else {
    console.log(`\n========================================`);
    console.log(`[VALIDATION SUCCESS] All ${rawContent.scenes.length} scenes and their beats conform 100% to the schema!`);
    console.log(`Course: "${rawContent.meta?.course}" | Chapter: "${rawContent.meta?.chapter}"`);
    console.log(`========================================\n`);
    process.exit(0);
  }
}

// Only invoke CLI if executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  runCli();
}
