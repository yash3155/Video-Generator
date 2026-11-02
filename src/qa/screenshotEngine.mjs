// src/qa/screenshotEngine.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

/**
 * Calculates target frame numbers for beat starts, key cue triggers, and scene completions.
 */
export function planScreenshotFrames(episode, fps = 30) {
  const plans = [];
  let currentRunningFrame = 0;

  (episode.scenes || []).forEach((scene, sIdx) => {
    const sceneStartFrame = currentRunningFrame;
    const beats = scene.beats || [];

    beats.forEach((beat, bIdx) => {
      const beatStartFrame = currentRunningFrame;
      const beatDurFrames = beat.durationInFrames || Math.round((beat.audioDurationSec || 5) * fps) + 12;

      // 1. Beat start frame
      plans.push({
        sceneIndex: sIdx,
        beatId: beat.id || `s${sIdx}_b${bIdx}`,
        type: 'beat_start',
        frame: beatStartFrame,
        timestampMs: Math.round((beatStartFrame / fps) * 1000),
      });

      // 2. Important cues within beat
      if (Array.isArray(beat.visualCues)) {
        beat.visualCues.forEach((cue) => {
          const cueOffsetFrames = Math.round((cue.atMs / 1000) * fps);
          const cueAbsoluteFrame = Math.min(
            beatStartFrame + beatDurFrames - 1,
            beatStartFrame + cueOffsetFrames
          );

          plans.push({
            sceneIndex: sIdx,
            beatId: beat.id || `s${sIdx}_b${bIdx}`,
            type: 'cue_trigger',
            frame: cueAbsoluteFrame,
            timestampMs: cue.atMs,
            cueTarget: cue.target,
          });
        });
      }

      currentRunningFrame += beatDurFrames;
    });

    // 3. Scene end frame
    if (beats.length > 0) {
      plans.push({
        sceneIndex: sIdx,
        beatId: beats[beats.length - 1]?.id || `s${sIdx}_end`,
        type: 'scene_end',
        frame: Math.max(0, currentRunningFrame - 1),
        timestampMs: Math.round(((currentRunningFrame - 1) / fps) * 1000),
      });
    }
  });

  return plans;
}

/**
 * Captures still screenshots via Remotion for representative key frames.
 */
export function captureScreenshots(options) {
  const {
    episode,
    propsPath,
    outputDir,
    chapterSlug,
    maxScreenshots = 6,
    rootDir = process.cwd(),
  } = options;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allPlans = planScreenshotFrames(episode, 30);
  if (allPlans.length === 0) return [];

  // Filter down to a representative subset to keep QA fast and bounded
  // Prioritize: 1 beat_start from scene 0, key cue triggers, and 1 scene_end
  const selected = [];
  const cueTriggers = allPlans.filter((p) => p.type === 'cue_trigger');
  const beatStarts = allPlans.filter((p) => p.type === 'beat_start');
  const sceneEnds = allPlans.filter((p) => p.type === 'scene_end');

  if (beatStarts.length > 0) selected.push(beatStarts[0]);
  if (cueTriggers.length > 0) selected.push(cueTriggers[0]);
  if (cueTriggers.length > 1) selected.push(cueTriggers[Math.floor(cueTriggers.length / 2)]);
  if (beatStarts.length > 1) selected.push(beatStarts[Math.floor(beatStarts.length / 2)]);
  if (sceneEnds.length > 0) selected.push(sceneEnds[sceneEnds.length - 1]);

  const uniqueSelected = [];
  const seenFrames = new Set();
  for (const item of selected) {
    if (!seenFrames.has(item.frame) && uniqueSelected.length < maxScreenshots) {
      seenFrames.add(item.frame);
      uniqueSelected.push(item);
    }
  }

  const captured = [];

  for (let i = 0; i < uniqueSelected.length; i++) {
    const item = uniqueSelected[i];
    const fileName = `shot_${i + 1}_f${item.frame}_${item.type}.png`;
    const fullPath = path.join(outputDir, fileName);
    const relUrl = `screenshots/${chapterSlug}/${fileName}`;

    try {
      console.log(`  📸 Capturing QA still frame ${item.frame} (${item.type}) -> ${fileName}...`);
      execSync(
        `npx remotion still src/index.ts EpisodeComposition "${fullPath}" --props="${propsPath}" --frame=${item.frame} --log=error`,
        { cwd: rootDir, stdio: 'pipe', timeout: 45000 }
      );

      if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1000) {
        captured.push({
          ...item,
          filePath: fullPath,
          relativeUrl: relUrl,
        });
      }
    } catch (err) {
      console.warn(`  [WARN] Remotion screenshot failed for frame ${item.frame}: ${err.message}`);
    }
  }

  return captured;
}
