// src/utils/cueUtils.ts
import type { Beat, VisualCue, SubtitlePhrase } from '../types';
// @ts-expect-error mjs import without declaration
import * as mjsUtils from './cueUtils.mjs';

export const getActiveCues: (
  beat: Beat,
  beatFrame: number,
  fps?: number
) => VisualCue[] = mjsUtils.getActiveCues;

export const getLatestCue: (
  beat: Beat,
  target: string,
  beatFrame: number,
  fps?: number
) => VisualCue | undefined = mjsUtils.getLatestCue;

export const isTargetActive: (
  beat: Beat,
  target: string,
  beatFrame: number,
  fps?: number
) => boolean = mjsUtils.isTargetActive;

export const getCueProgress: (
  cue: VisualCue | undefined,
  beatFrame: number,
  fps?: number,
  durationMs?: number
) => number = mjsUtils.getCueProgress;

export const segmentSubtitleIntoPhrases: (
  subtitle: string,
  audioDurationSec: number
) => SubtitlePhrase[] = mjsUtils.segmentSubtitleIntoPhrases;
