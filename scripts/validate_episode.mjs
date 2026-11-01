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

    // IMMUTABLE & SELF-CONTAINED QUIZ QUESTION CHECK:
    if (scene.template === 'interactive_quiz') {
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

    // SUMMARY THREAD: 6-8 STEPS & IMMUTABLE HEADING CHECK:
    if (scene.template === 'summary_thread') {
      let baselineHeading = null;
      scene.beats.forEach((beat, bIdx) => {
        const steps = beat?.ui_state?.steps;
        if (Array.isArray(steps)) {
          if (steps.length < 6 || steps.length > 8) {
            errors.push(
              `${scenePrefix} -> Beat[${bIdx}]: steps array length is ${steps.length}. Summary thread must contain between 6 and 8 steps.`
            );
          }
        }
        const heading = beat?.ui_state?.heading;
        if (heading) {
          if (!baselineHeading) {
            baselineHeading = heading;
          } else if (baselineHeading !== heading) {
            errors.push(
              `${scenePrefix} -> Beat[${bIdx}]: summary thread heading mutated from "${baselineHeading}" to "${heading}". Heading must stay constant across all beats.`
            );
          }
        }
      });
    }

    if (scene.template === 'split_comparison') {
      let baselineLeft = null;
      let baselineRight = null;
      scene.beats.forEach((beat, bIdx) => {
        const left = beat?.ui_state?.leftColumn;
        const right = beat?.ui_state?.rightColumn;
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
