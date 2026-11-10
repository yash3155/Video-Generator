// src/qa/qaEngine.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parseFile } from 'music-metadata';
import { validateEpisodeData } from '../../scripts/validate_episode.mjs';
import { hashNarration } from '../../scripts/compile_tts_audio.mjs';
import { TEMPLATE_REGISTRY } from '../schemas/templateRegistrySchema.mjs';
import { runDomainValidators } from './domainValidators.mjs';
import { captureScreenshots } from './screenshotEngine.mjs';
import { generateJsonReport, generateHtmlReport } from './reportGenerator.mjs';
import { getBookSlug } from '../utils/chapterPaths.mjs';

/**
 * Runs the comprehensive QA Release Gate on a target workspace.
 */
export async function runQaEngine(options) {
  const {
    targetDir,
    allowHigh = false,
    takeScreenshots = false,
    maxScreenshots = 6,
    rootDir = process.cwd(),
  } = options;

  const resolvedTarget = path.isAbsolute(targetDir) ? targetDir : path.resolve(rootDir, targetDir);
  const isDirectFile = fs.existsSync(resolvedTarget) && fs.statSync(resolvedTarget).isFile();
  const resolvedDir = isDirectFile ? path.dirname(resolvedTarget) : resolvedTarget;
  const isFixture = resolvedTarget.includes('fixtures') || resolvedDir.includes('fixtures');
  const chapterSlug = isDirectFile
    ? path.basename(resolvedTarget, path.extname(resolvedTarget)).replace(/_argon$/i, '')
    : path.basename(resolvedDir).replace(/_argon$/i, '');
  const findings = [];

  const rawPath = isDirectFile ? resolvedTarget : path.join(resolvedDir, 'episode_raw.json');
  const compiledPath = isDirectFile ? resolvedTarget : path.join(resolvedDir, 'episode_compiled.json');
  const sourceFactsPath = path.join(resolvedDir, 'source_facts.json');
  const contentAuditPath = path.join(resolvedDir, 'content_audit.json');
  const lessonPlanPath = path.join(resolvedDir, 'lesson_plan.json');
  const storyboardPath = path.join(resolvedDir, 'storyboard.json');

  if (!fs.existsSync(rawPath)) {
    throw new Error(`Episode file not found: ${rawPath}`);
  }

  const rawEpisode = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const meta = rawEpisode.meta || {};
  const courseSlug = getBookSlug(resolvedDir, meta);
  const isEnCourse = courseSlug.includes('_en') ||
    (meta?.narrationLanguage && String(meta.narrationLanguage).startsWith('en')) ||
    (meta?.course && /_en\b|english/i.test(meta.course));
  const course = meta.course || 'Unknown Course';
  const chapter = meta.chapter || chapterSlug;
  const domain = meta.domain || (course.toLowerCase().includes('hull') || course.toLowerCase().includes('murphy') ? 'finance' : 'general');

  let sourceFacts = null;
  let contentAudit = null;
  let compiledEpisode = null;

  // -----------------------------------------------------------------
  // 0. Zero Serialization Leak Invariant: Detect '[object Object]'
  // -----------------------------------------------------------------
  const rawEpisodeString = JSON.stringify(rawEpisode || {});
  if (rawEpisodeString.includes('[object Object]') || rawEpisodeString.includes('[object object]')) {
    findings.push({
      id: 'qa_object_serialization_leak',
      category: 'schema_validity',
      severity: 'BLOCKER',
      message: "Fatal serialization leak: detected literal '[object Object]' in episode payload.",
      target: 'episode_raw.json',
      cause: "A React/JSON property was stringified without unpacking its fields, resulting in '[object Object]'.",
      suggestedRepair: "Check UI state steps/cards/messages and format objects as title/description or unpack their properties.",
    });
  }

  // -----------------------------------------------------------------
  // 1. Source-Fact Coverage & Lesson Architecture
  // -----------------------------------------------------------------
  const isChapterDir = resolvedDir.includes('chapters');
  if (isChapterDir) {
    if (!fs.existsSync(sourceFactsPath)) {
      findings.push({
        id: 'qa_missing_source_facts',
        category: 'source_traceability',
        severity: 'BLOCKER',
        message: 'Missing source_facts.json artifact.',
        cause: 'Phase 1 source-grounded architecture requires source_facts.json in chapter workspace.',
        suggestedRepair: 'Run nlm query or migration to generate source_facts.json.',
      });
    } else {
      try {
        sourceFacts = JSON.parse(fs.readFileSync(sourceFactsPath, 'utf8'));
      } catch (e) {
        findings.push({
          id: 'qa_corrupt_source_facts',
          category: 'source_traceability',
          severity: 'BLOCKER',
          message: `source_facts.json is corrupt: ${e.message}`,
          cause: 'JSON parsing failure.',
          suggestedRepair: 'Re-format source_facts.json.',
        });
      }
    }

    if (!fs.existsSync(contentAuditPath)) {
      findings.push({
        id: 'qa_missing_content_audit',
        category: 'source_traceability',
        severity: 'BLOCKER',
        message: 'Missing content_audit.json artifact.',
        cause: 'Phase 1 requires content_audit.json.',
        suggestedRepair: 'Run node scripts/audit_content.mjs to generate audit report.',
      });
    } else {
      try {
        contentAudit = JSON.parse(fs.readFileSync(contentAuditPath, 'utf8'));
        if (contentAudit.status === 'FAIL') {
          findings.push({
            id: 'qa_audit_fail',
            category: 'source_traceability',
            severity: 'BLOCKER',
            message: 'Phase 1 Content Audit status is FAIL.',
            cause: `Audit found ${contentAudit.findings?.filter((f) => f.severity === 'CRITICAL').length || 0} critical findings.`,
            suggestedRepair: 'Resolve critical audit findings in source_facts and storyboard.',
          });
        }
      } catch (e) {
        findings.push({
          id: 'qa_corrupt_content_audit',
          category: 'source_traceability',
          severity: 'BLOCKER',
          message: `content_audit.json is corrupt: ${e.message}`,
          cause: 'JSON parsing failure.',
          suggestedRepair: 'Regenerate content_audit.json.',
        });
      }
    }

    if (!fs.existsSync(lessonPlanPath) || !fs.existsSync(storyboardPath)) {
      findings.push({
        id: 'qa_missing_lesson_artifacts',
        category: 'source_traceability',
        severity: 'HIGH',
        message: 'Missing lesson_plan.json or storyboard.json.',
        cause: 'Lesson architecture artifacts missing.',
        suggestedRepair: 'Generate lesson_plan.json and storyboard.json from approved source facts.',
      });
    }
  }

  // Source fact traceability check on beats
  const validFactIds = new Set(sourceFacts?.facts?.map((f) => f.id) || []);
  if (validFactIds.size > 0) {
    (rawEpisode.scenes || []).forEach((scene, sIdx) => {
      (scene.beats || []).forEach((beat, bIdx) => {
        const citedIds = beat.visual?.semantics?.sourceFactIds || [];
        const invalidIds = citedIds.filter((id) => !validFactIds.has(id));
        if (invalidIds.length > 0) {
          findings.push({
            id: `qa_invalid_fact_${beat.id}`,
            category: 'source_traceability',
            severity: 'HIGH',
            message: `Beat ${beat.id} cites unknown sourceFactId(s): ${invalidIds.join(', ')}.`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'visual.semantics.sourceFactIds',
            cause: 'Beat references facts not present in source_facts.json.',
            suggestedRepair: 'Update beat to cite registered source facts from source_facts.json.',
          });
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // 2. Template & Visual-Data Schema Validity
  // -----------------------------------------------------------------
  const schemaRes = validateEpisodeData(rawEpisode);
  if (!schemaRes.valid) {
    schemaRes.errors.forEach((err, idx) => {
      findings.push({
        id: `qa_schema_err_${idx}`,
        category: 'schema_validity',
        severity: 'BLOCKER',
        message: err,
        cause: 'Zod or invariant schema rule violation.',
        suggestedRepair: 'Resolve reported schema invariant in episode_raw.json.',
      });
    });
  }

  // -----------------------------------------------------------------
  // 3. Audio Existence, Hash, Measured Duration, & Cue Timing
  // -----------------------------------------------------------------
  let totalAuthoredMs = 0;
  let totalCompiledMs = 0;
  let audioFilesPresent = 0;
  let audioFilesMissing = 0;

  if (fs.existsSync(compiledPath) && !isFixture) {
    try {
      compiledEpisode = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));
    } catch (e) {
      findings.push({
        id: 'qa_corrupt_compiled',
        category: 'audio_timing',
        severity: 'BLOCKER',
        message: `episode_compiled.json is corrupt: ${e.message}`,
        cause: 'JSON parsing failure.',
        suggestedRepair: 'Re-compile audio using node scripts/compile_tts_audio.mjs.',
      });
    }
  } else if (isFixture) {
    compiledEpisode = rawEpisode;
  } else {
    findings.push({
      id: 'qa_missing_compiled',
      category: 'audio_timing',
      severity: 'BLOCKER',
      message: 'episode_compiled.json does not exist. Audio has not been compiled.',
      cause: 'Audio compilation pipeline has not been executed.',
      suggestedRepair: 'Run node scripts/compile_tts_audio.mjs --dir=' + resolvedDir,
    });
  }

  const activeEpisode = compiledEpisode || rawEpisode;

  for (let sIdx = 0; sIdx < (activeEpisode.scenes || []).length; sIdx++) {
    const scene = activeEpisode.scenes[sIdx];
    const templateDef = TEMPLATE_REGISTRY[scene.template];
    const allowedTargets = [...(templateDef?.animationTargets || []), 'subtitle', 'general'];

    for (let bIdx = 0; bIdx < (scene.beats || []).length; bIdx++) {
      const beat = scene.beats[bIdx];
      const pauseMs = beat.pauseAfterMs ?? 260;

      // Audio verification
      if (beat.audioFile) {
        const candidateAudioPaths = [
          path.isAbsolute(beat.audioFile) ? beat.audioFile : path.join(rootDir, 'public', beat.audioFile),
          path.isAbsolute(beat.audioFile) ? beat.audioFile : path.join(rootDir, beat.audioFile),
          path.join(resolvedDir, beat.audioFile),
          path.join(resolvedDir, 'audio', path.basename(beat.audioFile)),
        ];

        const foundPath = candidateAudioPaths.find((p) => fs.existsSync(p));
        if (foundPath && fs.statSync(foundPath).size > 1000) {
          audioFilesPresent++;
        } else {
          audioFilesMissing++;
          findings.push({
            id: `qa_missing_audio_${beat.id}`,
            category: 'audio_timing',
            severity: 'BLOCKER',
            message: `Audio file for beat ${beat.id} is missing or empty (${beat.audioFile}).`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'audioFile',
            cause: 'Audio file not found on disk or size < 1000 bytes.',
            suggestedRepair: 'Re-synthesize audio for this chapter.',
          });
        }
      } else if (compiledEpisode && !isFixture) {
        audioFilesMissing++;
        findings.push({
          id: `qa_no_audio_prop_${beat.id}`,
          category: 'audio_timing',
          severity: 'BLOCKER',
          message: `Beat ${beat.id} has no audioFile property populated in compiled episode.`,
          sceneIndex: sIdx,
          beatId: beat.id,
          target: 'audioFile',
          cause: 'Audio compiler did not populate audioFile.',
          suggestedRepair: 'Run compile_tts_audio.mjs to generate and assign audio clips.',
        });
      }

      // Hash freshness
      const textToHash = isEnCourse
        ? (beat.en_narration || beat.en_subtitle || beat.narration || beat.text || beat.hindi_tts || '')
        : (beat.hindi_tts || '');

      if (textToHash && beat.narrationHash) {
        const expectedHash = hashNarration(textToHash);
        if (beat.narrationHash !== expectedHash) {
          findings.push({
            id: `qa_stale_hash_${beat.id}`,
            category: 'audio_timing',
            severity: 'HIGH',
            message: `Narration text has changed but audio has not been regenerated (hash mismatch on beat ${beat.id}).`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'narrationHash',
            cause: 'Narration text was edited without re-compiling audio.',
            suggestedRepair: 'Re-run compile_tts_audio.mjs to refresh audio.',
          });
        }
      }

      const durSec = beat.audioDurationSec || 0;
      totalAuthoredMs += durSec * 1000 + pauseMs;
      totalCompiledMs += ((beat.durationInFrames || 0) / 30) * 1000;

      // Cue timing & target checks
      if (Array.isArray(beat.visualCues)) {
        const maxAllowedMs = durSec > 0 ? durSec * 1000 + pauseMs + 100 : 30000;

        beat.visualCues.forEach((cue, cIdx) => {
          if (templateDef && !allowedTargets.includes(cue.target)) {
            findings.push({
              id: `qa_unsupported_cue_${beat.id}_${cIdx}`,
              category: 'audio_timing',
              severity: 'BLOCKER',
              message: `Cue target "${cue.target}" is not supported by template "${scene.template}".`,
              sceneIndex: sIdx,
              beatId: beat.id,
              target: 'visualCues',
              cause: `Template registry allows: ${allowedTargets.join(', ')}.`,
              suggestedRepair: `Use one of the supported animation targets for ${scene.template}.`,
            });
          }

          if (durSec > 0 && cue.atMs > maxAllowedMs) {
            findings.push({
              id: `qa_cue_past_dur_${beat.id}_${cIdx}`,
              category: 'audio_timing',
              severity: 'HIGH',
              message: `Cue atMs (${cue.atMs}ms) exceeds beat audio duration (${Math.round(maxAllowedMs)}ms).`,
              sceneIndex: sIdx,
              beatId: beat.id,
              target: 'visualCues',
              cause: 'Cue timestamp scheduled after speech has ended.',
              suggestedRepair: 'Adjust cue.atMs to occur inside the spoken audio window.',
            });
          }
        });
      }

      // ---------------------------------------------------------------
      // 4. Subtitle Alignment Availability / Fallback
      // ---------------------------------------------------------------
      if (compiledEpisode && !isFixture) {
        if (!beat.subtitlePhrases || beat.subtitlePhrases.length === 0) {
          findings.push({
            id: `qa_no_subtitle_phrases_${beat.id}`,
            category: 'subtitle_alignment',
            severity: 'MEDIUM',
            message: `Beat ${beat.id} has no phrase-level subtitle alignment (falling back to sentence-level).`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'subtitlePhrases',
            cause: 'Subtitle alignment data was not generated.',
            suggestedRepair: 'Re-run compile_tts_audio.mjs with phrase segmentation enabled.',
          });
        } else {
          beat.subtitlePhrases.forEach((p, pIdx) => {
            if (p.endMs < p.startMs) {
              findings.push({
                id: `qa_inverted_phrase_${beat.id}_${pIdx}`,
                category: 'subtitle_alignment',
                severity: 'HIGH',
                message: `Subtitle phrase ${pIdx} has inverted timing (startMs: ${p.startMs}, endMs: ${p.endMs}).`,
                sceneIndex: sIdx,
                beatId: beat.id,
                target: 'subtitlePhrases',
                cause: 'Invalid phrase timing boundary.',
                suggestedRepair: 'Ensure endMs >= startMs.',
              });
            }
          });
        }
      }

      // ---------------------------------------------------------------
      // 5. Visual Layout & Text Constraints
      // ---------------------------------------------------------------
      const words = (beat.en_subtitle || '').trim().split(/\s+/).filter(Boolean);
      if (words.length > 16) {
        findings.push({
          id: `qa_sub_word_count_${beat.id}`,
          category: 'visual_layout',
          severity: 'MEDIUM',
          message: `Subtitle has ${words.length} words (guideline is <= 16 words per beat).`,
          sceneIndex: sIdx,
          beatId: beat.id,
          target: 'en_subtitle',
          cause: 'Long subtitle risks multi-line visual overflow in layout.',
          suggestedRepair: 'Condense subtitle to 14-16 words.',
        });
      }

      if (scene.template === 'interactive_quiz') {
        const qWords = (beat.ui_state?.question || '').trim().split(/\s+/).filter(Boolean);
        if (qWords.length < 18) {
          findings.push({
            id: `qa_quiz_q_len_${beat.id}`,
            category: 'visual_layout',
            severity: 'HIGH',
            message: `Quiz question has only ${qWords.length} words (rule requires >= 18 words scenario).`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'ui_state.question',
            cause: 'Scenario description is too brief to provide context.',
            suggestedRepair: 'Expand question into a complete real-world scenario (18+ words).',
          });
        }

        // Validate multiple-choice options invariant
        const opts = beat.ui_state?.options;
        if (opts !== undefined && (!Array.isArray(opts) || opts.length !== 4)) {
          findings.push({
            id: `qa_quiz_options_count_${beat.id}`,
            category: 'visual_layout',
            severity: 'BLOCKER',
            message: `Quiz beat ${beat.id} has ${Array.isArray(opts) ? opts.length : 0} options (must be exactly 4 choices: A, B, C, D).`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'ui_state.options',
            cause: 'Incomplete or malformed multiple-choice options array.',
            suggestedRepair: 'Provide exactly 4 distinct multiple choice options in ui_state.options.',
          });
        }
      }

      if (scene.template === 'formula_breakdown') {
        const formulaData = beat.visual?.data || beat.ui_state || {};
        const expr = String(formulaData.expression || '');
        const exprLen = expr.length;

        // Check for placeholder physics formula in non-physics courses
        const isPhysicsDomain =
          /physics/i.test(domain) ||
          /mechanics|kinematics/i.test(course);

        if (!isPhysicsDomain && /\bF\s*=\s*m\s*[·*x]?\s*a\b/i.test(expr)) {
          findings.push({
            id: `qa_placeholder_formula_${beat.id}`,
            category: 'pedagogical_alignment',
            severity: 'BLOCKER',
            message: `Unrelated placeholder formula "${expr}" (Newton's second law) found in non-physics course.`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'expression',
            cause: 'Template fallback or ungrounded formula generation.',
            suggestedRepair: 'Replace with course-grounded formula specification from source facts.',
          });
        }

        if (exprLen > 55) {
          findings.push({
            id: `qa_formula_len_${beat.id}`,
            category: 'visual_layout',
            severity: 'MEDIUM',
            message: `Formula expression is ${exprLen} characters long (may wrap awkwardly).`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'expression',
            cause: 'Long unformatted formula string.',
            suggestedRepair: 'Split formula into separate definition steps or shorten expression.',
          });
        }
      }

      // Check hypothetical scenario badging
      const sub = beat.en_subtitle || '';
      const tts = beat.hindi_tts || '';
      if (/₹\s*250|250\s*रुपए/i.test(`${sub} ${tts}`)) {
        const badgeCombo = `${scene.badge || ''} ${scene.title || ''} ${beat.ui_state?.badge || ''} ${beat.visual?.data?.badge || ''}`.toLowerCase();
        if (!/hypothetical|desk example|scenario|retail trap/i.test(badgeCombo)) {
          findings.push({
            id: `qa_unlabelled_hypothetical_${beat.id}`,
            category: 'pedagogical_alignment',
            severity: 'HIGH',
            message: `Beat ${beat.id} references illustrative ₹250 trade without explicit 'HYPOTHETICAL' or 'DESK EXAMPLE' badge.`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'badge',
            cause: 'Illustrative desk scenarios must be clearly distinguished from book source facts.',
            suggestedRepair: 'Add badge: "HYPOTHETICAL DESK EXAMPLE" to scene or beat ui_state.',
          });
        }
      }

      if (scene.template === 'summary_thread') {
        const steps = beat.ui_state?.steps || [];
        steps.forEach((stepText, stIdx) => {
          const wCount = String(stepText).trim().split(/\s+/).length;
          if (wCount > 30) {
            findings.push({
              id: `qa_summary_step_len_${beat.id}_${stIdx}`,
              category: 'visual_layout',
              severity: 'MEDIUM',
              message: `Summary step ${stIdx + 1} has ${wCount} words (> 30 words guideline).`,
              sceneIndex: sIdx,
              beatId: beat.id,
              target: `ui_state.steps[${stIdx}]`,
              cause: 'Verbose summary step causes cognitive overload.',
              suggestedRepair: 'Condense summary step to concise takeaway (< 25 words).',
            });
          }
        });

        // Strict 8-Rule Focus Invariant: Never skip Rule 8 before whole-chapter overview
        const range = beat.ui_state?.activeStepRange;
        if (steps.length >= 8 && Array.isArray(range) && range.length === 2) {
          if (range[0] === 6 && range[1] === 7) {
            findings.push({
              id: `qa_summary_skipped_rule_8_${beat.id}`,
              category: 'pedagogical_alignment',
              severity: 'HIGH',
              message: `Beat ${beat.id} has activeStepRange [6, 7], which repeats Step 6 and skips dedicated focus on Rule 8. Must be [7, 8].`,
              sceneIndex: sIdx,
              beatId: beat.id,
              target: 'ui_state.activeStepRange',
              cause: 'Legacy indexing error where Rule 8 was omitted before compactOverview.',
              suggestedRepair: 'Update activeStepRange to [7, 8] with narration explicitly reviewing Rule 7 and Rule 8.',
            });
          }
        }
      }

      if (scene.template === 'data_visualizer') {
        const sideCards = beat.ui_state?.sideCards || [];
        if (sideCards.length > 4) {
          findings.push({
            id: `qa_sidecards_overflow_${beat.id}`,
            category: 'visual_layout',
            severity: 'HIGH',
            message: `Scene has ${sideCards.length} sideCards (maximum 4 to avoid vertical overflow).`,
            sceneIndex: sIdx,
            beatId: beat.id,
            target: 'ui_state.sideCards',
            cause: 'Too many sideCards cause clipping against bottom boundary.',
            suggestedRepair: 'Reduce sideCards to at most 4.',
          });
        }
      }
    }

    // Scene-level validation for summary_thread: mandatory dedicated Rule 8 focus
    if (scene.template === 'summary_thread' && Array.isArray(scene.beats) && scene.beats.length > 0) {
      const firstUI = scene.beats[0]?.ui_state || {};
      const steps = firstUI.steps || [];
      if (steps.length >= 8) {
        const hasRule8Focus = scene.beats.some((b) => {
          const r = b.ui_state?.activeStepRange;
          return Array.isArray(r) && r[1] === 8 && r[0] >= 6 && !b.ui_state?.compactOverview;
        });
        if (!hasRule8Focus) {
          findings.push({
            id: `qa_summary_missing_rule_8_scene_${sIdx}`,
            category: 'pedagogical_alignment',
            severity: 'HIGH',
            message: `Summary scene ${sIdx} lacks dedicated progressive focus on Rule 8 before whole-chapter overview.`,
            sceneIndex: sIdx,
            cause: 'Summary sequence jumps from Rules 6/7 directly into whole-chapter overview without highlighting Rule 8.',
            suggestedRepair: 'Add or update Beat 4 with activeStepRange: [7, 8] and narration reviewing Rule 7 and Rule 8.',
          });
        }
      }
    }
  }

  // -----------------------------------------------------------------
  // 6. Scene & Final Video Duration Drift
  // -----------------------------------------------------------------
  const durationDriftMs = isFixture ? 0 : Math.round(totalCompiledMs - totalAuthoredMs);
  if (Math.abs(durationDriftMs) > 1000) {
    findings.push({
      id: 'qa_duration_drift_high',
      category: 'duration_drift',
      severity: 'HIGH',
      message: `Duration drift between audio and video frames is ${durationDriftMs}ms (> 1.0s).`,
      cause: 'Sum of compiled beat frames diverges from audio duration + authored pause.',
      suggestedRepair: 'Recompile audio to sync frame counts strictly to measured durations.',
    });
  } else if (Math.abs(durationDriftMs) > 500) {
    findings.push({
      id: 'qa_duration_drift_med',
      category: 'duration_drift',
      severity: 'MEDIUM',
      message: `Duration drift is ${durationDriftMs}ms (> 0.5s).`,
      cause: 'Frame rounding drift.',
      suggestedRepair: 'Check authored pauses and FPS calculations.',
    });
  }

  // -----------------------------------------------------------------
  // 7. Video / Audio Streams and MP4 Integrity
  // -----------------------------------------------------------------
  let hasMp4 = false;
  let mp4Path = null;
  let mp4SizeBytes = 0;
  let mp4Metadata = null;

  const bookSlug = getBookSlug(resolvedDir || chapterSlug, meta);
  const candidateMp4Paths = [
    path.join(rootDir, 'out', 'chapters', bookSlug, `${chapterSlug}.mp4`),
    path.join(rootDir, 'out', 'chapters', bookSlug, `${path.basename(resolvedDir)}.mp4`),
    path.join(rootDir, 'out', bookSlug, `${chapterSlug}.mp4`),
    path.join(rootDir, 'out', 'chapters', `${chapterSlug}.mp4`),
    path.join(rootDir, 'out', `${chapterSlug}.mp4`),
    path.join(rootDir, 'out', 'chapters', `${path.basename(resolvedDir)}.mp4`),
    path.join(rootDir, 'out', `${path.basename(resolvedDir)}.mp4`),
  ];

  const foundMp4 = candidateMp4Paths.find((p) => fs.existsSync(p));
  if (foundMp4) {
    hasMp4 = true;
    mp4Path = foundMp4;
    mp4SizeBytes = fs.statSync(foundMp4).size;

    if (mp4SizeBytes < 1024 * 1024) {
      findings.push({
        id: 'qa_mp4_size_too_small',
        category: 'media_integrity',
        severity: 'BLOCKER',
        message: `Rendered MP4 file size is only ${(mp4SizeBytes / 1024).toFixed(1)} KB (< 1 MB).`,
        target: mp4Path,
        cause: 'Render failure or premature termination produced an empty or corrupt video file.',
        suggestedRepair: 'Re-render episode using npx remotion render.',
      });
    }

    try {
      mp4Metadata = await parseFile(foundMp4);
      const videoTrack = mp4Metadata.format.trackInfo?.find((t) => t.video);
      const audioTrack = mp4Metadata.format.trackInfo?.find((t) => t.audio);

      if (!videoTrack) {
        findings.push({
          id: 'qa_no_video_track',
          category: 'media_integrity',
          severity: 'BLOCKER',
          message: 'Rendered MP4 has no video stream.',
          target: mp4Path,
          cause: 'Missing H.264 video track in container.',
          suggestedRepair: 'Re-render video with valid video codec.',
        });
      } else {
        const { displayWidth, displayHeight, frameRate } = videoTrack.video || {};
        if (displayWidth !== 1920 || displayHeight !== 1080) {
          findings.push({
            id: 'qa_wrong_resolution',
            category: 'media_integrity',
            severity: 'HIGH',
            message: `Video resolution is ${displayWidth}x${displayHeight} (expected 1920x1080).`,
            target: mp4Path,
            cause: 'Render composition dimensions mismatch.',
            suggestedRepair: 'Ensure Remotion composition width=1920, height=1080.',
          });
        }
        if (frameRate && Math.round(frameRate) !== 30) {
          findings.push({
            id: 'qa_wrong_fps',
            category: 'media_integrity',
            severity: 'HIGH',
            message: `Video frame rate is ${frameRate} fps (expected 30 fps).`,
            target: mp4Path,
            cause: 'Frame rate configuration mismatch.',
            suggestedRepair: 'Ensure Composition fps is set to 30.',
          });
        }
      }

      if (!audioTrack) {
        findings.push({
          id: 'qa_no_audio_track',
          category: 'media_integrity',
          severity: 'BLOCKER',
          message: 'Rendered MP4 has no audio stream.',
          target: mp4Path,
          cause: 'Missing AAC audio track in container.',
          suggestedRepair: 'Ensure Remotion render includes audio tracks.',
        });
      }
    } catch (parseErr) {
      findings.push({
        id: 'qa_mp4_parse_error',
        category: 'media_integrity',
        severity: 'BLOCKER',
        message: `Failed to inspect MP4 container: ${parseErr.message}`,
        target: mp4Path,
        cause: 'Corrupt MP4 container or header structure.',
        suggestedRepair: 'Re-render MP4 cleanly.',
      });
    }
  } else {
    findings.push({
      id: 'qa_pending_render',
      category: 'media_integrity',
      severity: 'LOW',
      message: 'Rendered MP4 does not exist yet (pending release render).',
      cause: 'Video has not been rendered to out/chapters/',
      suggestedRepair: 'Execute npx remotion render when ready to release.',
    });
  }

  // -----------------------------------------------------------------
  // 8. Modular Domain Checks
  // -----------------------------------------------------------------
  const domainContext = {
    workspaceDir: resolvedDir,
    domain,
    course,
    domainModules: meta.domainModules || [domain],
    rawEpisode,
    compiledEpisode,
    sourceFacts,
    contentAudit,
  };
  const domainFindings = runDomainValidators(domainContext);
  findings.push(...domainFindings);

  // -----------------------------------------------------------------
  // 9. Screenshot Engine Execution (if requested)
  // -----------------------------------------------------------------
  let screenshots = [];
  const qaCourseSlug = isFixture ? 'fixtures' : (bookSlug || getBookSlug(resolvedDir || chapterSlug, meta));
  const reportsDir = path.join(rootDir, 'reports', 'qa', qaCourseSlug, chapterSlug);
  fs.mkdirSync(reportsDir, { recursive: true });

  if (takeScreenshots) {
    const screenshotDir = path.join(reportsDir, 'screenshots');
    screenshots = captureScreenshots({
      episode: activeEpisode,
      propsPath: fs.existsSync(compiledPath) ? compiledPath : rawPath,
      outputDir: screenshotDir,
      chapterSlug,
      maxScreenshots,
      rootDir,
    });
  }

  // -----------------------------------------------------------------
  // 10. Summary & Release Gate Decision
  // -----------------------------------------------------------------
  const blockerCount = findings.filter((f) => f.severity === 'BLOCKER').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;
  const lowCount = findings.filter((f) => f.severity === 'LOW').length;

  let overallStatus = 'PASS';
  if (blockerCount > 0) {
    overallStatus = 'FAIL';
  } else if (highCount > 0) {
    overallStatus = allowHigh ? 'CONDITIONAL_PASS' : 'FAIL';
  } else if (mediumCount > 0) {
    overallStatus = 'CONDITIONAL_PASS';
  }

  const videoTrackInfo = mp4Metadata?.format?.trackInfo?.find((t) => t.video);
  const audioTrackInfo = mp4Metadata?.format?.trackInfo?.find((t) => t.audio);

  const report = {
    chapter,
    course,
    domain,
    workspaceDir: resolvedDir,
    generatedAt: new Date().toISOString(),
    status: overallStatus,
    metrics: {
      totalScenes: (activeEpisode.scenes || []).length,
      totalBeats: (activeEpisode.scenes || []).reduce((acc, s) => acc + (s.beats || []).length, 0),
      totalFrames: (activeEpisode.scenes || []).reduce(
        (acc, s) => acc + (s.beats || []).reduce((bAcc, b) => bAcc + (b.durationInFrames || 0), 0),
        0
      ),
      totalAudioDurationSec: parseFloat((totalAuthoredMs / 1000).toFixed(2)),
      compiledDurationSec: parseFloat((totalCompiledMs / 1000).toFixed(2)),
      durationDriftMs,
      audioFilesPresent,
      audioFilesMissing,
      sourceFactsCount: sourceFacts?.facts?.length || 0,
      hasMp4,
      mp4Path: mp4Path || undefined,
      mp4SizeBytes,
      mp4DurationSec: mp4Metadata?.format?.duration,
      videoCodec: videoTrackInfo?.codecName || videoTrackInfo?.codecId,
      audioCodec: audioTrackInfo?.codecName || audioTrackInfo?.codecId,
      resolution: videoTrackInfo?.video ? `${videoTrackInfo.video.displayWidth}x${videoTrackInfo.video.displayHeight}` : undefined,
      fps: videoTrackInfo?.video?.frameRate,
    },
    summary: {
      blockerCount,
      highCount,
      mediumCount,
      lowCount,
      totalFindings: findings.length,
      status: overallStatus,
    },
    findings,
    screenshots,
  };

  // Generate Reports
  const jsonPath = path.join(reportsDir, 'qa_report.json');
  const htmlPath = path.join(reportsDir, 'qa_report.html');

  generateJsonReport(report, jsonPath);
  generateHtmlReport(report, htmlPath);

  // Write top-level report copy for fixtures
  if (isFixture) {
    const rootReportsDir = path.join(rootDir, 'reports', 'qa');
    try {
      fs.copyFileSync(jsonPath, path.join(rootReportsDir, `${chapterSlug}_qa.json`));
      fs.copyFileSync(htmlPath, path.join(rootReportsDir, `${chapterSlug}_qa.html`));
    } catch {}
  }

  return {
    report,
    jsonPath,
    htmlPath,
  };
}
