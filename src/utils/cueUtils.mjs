// src/utils/cueUtils.mjs

/**
 * Returns all visual cues that have fired up to the current beat frame.
 */
export function getActiveCues(beat, beatFrame, fps = 30) {
  if (!beat || !beat.visualCues || !Array.isArray(beat.visualCues)) {
    return [];
  }
  const currentMs = (beatFrame / fps) * 1000;
  return beat.visualCues.filter((c) => c.atMs <= currentMs);
}

/**
 * Returns the most recent cue for a specific target that has fired.
 */
export function getLatestCue(beat, target, beatFrame, fps = 30) {
  const active = getActiveCues(beat, beatFrame, fps);
  for (let i = active.length - 1; i >= 0; i--) {
    if (active[i].target === target) {
      return active[i];
    }
  }
  return undefined;
}

/**
 * Returns whether any cue for a specific target has fired.
 */
export function isTargetActive(beat, target, beatFrame, fps = 30) {
  return Boolean(getLatestCue(beat, target, beatFrame, fps));
}

/**
 * Returns smooth 0..1 transition progress for a cue from its trigger timestamp.
 */
export function getCueProgress(cue, beatFrame, fps = 30, durationMs = 350) {
  if (!cue) return 0;
  const currentMs = (beatFrame / fps) * 1000;
  if (currentMs < cue.atMs) return 0;
  const elapsed = currentMs - cue.atMs;
  return Math.min(1, Math.max(0, elapsed / Math.max(1, durationMs)));
}

/**
 * Segments an English subtitle into natural semantic phrases with proportional timing.
 * Falls back safely to a single sentence-level phrase if text cannot be cleanly split.
 */
export function segmentSubtitleIntoPhrases(subtitle, audioDurationSec) {
  if (!subtitle || typeof subtitle !== 'string') {
    return [];
  }

  const cleanText = subtitle.trim();
  if (!cleanText) return [];

  const totalMs = Math.max(500, Math.round(audioDurationSec * 1000));

  let rawChunks = [];
  if (/[,;—–]/.test(cleanText)) {
    rawChunks = cleanText
      .split(/(?<=[,;—–])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (rawChunks.length <= 1) {
    const words = cleanText.split(/\s+/);
    if (words.length <= 5) {
      return [{ text: cleanText, startMs: 0, endMs: totalMs }];
    }
    const numPhrases = words.length >= 12 ? 3 : 2;
    const wordsPerPhrase = Math.ceil(words.length / numPhrases);
    rawChunks = [];
    for (let i = 0; i < words.length; i += wordsPerPhrase) {
      rawChunks.push(words.slice(i, i + wordsPerPhrase).join(' '));
    }
  }

  const totalChars = rawChunks.reduce((acc, c) => acc + c.length, 0);
  let currentStart = 0;

  return rawChunks.map((chunk, idx) => {
    const proportion = totalChars > 0 ? chunk.length / totalChars : 1 / rawChunks.length;
    const phraseDuration = Math.round(proportion * totalMs);
    const startMs = currentStart;
    const endMs = idx === rawChunks.length - 1 ? totalMs : Math.min(totalMs, currentStart + phraseDuration);
    currentStart = endMs;
    return {
      text: chunk,
      startMs,
      endMs,
    };
  });
}
