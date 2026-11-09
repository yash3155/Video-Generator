// scripts/enrich_ch01_part1_with_flash.mjs
import fs from 'node:fs';
import path from 'node:path';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';

const hiDir = path.resolve('src/data/chapters/murphy_technical_analysis/ch01_part1');
const enDir = path.resolve('src/data/chapters/murphy_technical_analysis_en/ch01_part1');

const factsPath = path.join(hiDir, 'source_facts.json');
const sourceFacts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

const courseConfigHi = JSON.parse(fs.readFileSync('src/courses/murphy_technical_analysis.json', 'utf8'));
const courseConfigEn = JSON.parse(fs.readFileSync('src/courses/murphy_technical_analysis_en.json', 'utf8'));

const rawHindi = scaffoldEpisode({
  chapterKey: 'ch01_part1',
  courseSlug: 'murphy_technical_analysis',
  chapterTitle: 'PHILOSOPHY OF TECHNICAL ANALYSIS: THE THREE PREMISES & TIMING',
  facts: sourceFacts.facts,
  courseConfig: courseConfigHi
});

const rawEn = scaffoldEpisode({
  chapterKey: 'ch01_part1',
  courseSlug: 'murphy_technical_analysis_en',
  chapterTitle: 'PHILOSOPHY OF TECHNICAL ANALYSIS: THE THREE PREMISES & TIMING',
  facts: sourceFacts.facts,
  courseConfig: courseConfigEn
});

// For English episode, set English text on beats
for (const scene of rawEn.scenes) {
  for (const beat of scene.beats) {
    beat.text = beat.en_narration;
  }
}

// Ensure no Devanagari in UI states, titles, badges, or subtitles
const devanagariRegex = /[\u0900-\u097F]/;
function sanitizeNoDevanagari(obj, fallback = 'Technical Analysis Principle') {
  if (typeof obj === 'string') {
    return devanagariRegex.test(obj) ? fallback : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeNoDevanagari(item, fallback));
  }
  if (obj && typeof obj === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = sanitizeNoDevanagari(v, fallback);
    }
    return res;
  }
  return obj;
}

for (const ep of [rawHindi, rawEn]) {
  for (const scene of ep.scenes) {
    if (devanagariRegex.test(scene.title)) scene.title = 'Philosophy of Technical Analysis';
    if (devanagariRegex.test(scene.badge)) scene.badge = 'Technical Principle · Market Rule';
    for (const beat of scene.beats) {
      if (beat.en_subtitle && devanagariRegex.test(beat.en_subtitle)) {
        beat.en_subtitle = beat.en_narration || 'Technical analysis concept.';
      }
      if (beat.ui_state) {
        beat.ui_state = sanitizeNoDevanagari(beat.ui_state);
      }
      if (beat.visual?.data) {
        beat.visual.data = sanitizeNoDevanagari(beat.visual.data);
      }
    }
  }
}

fs.writeFileSync(path.join(hiDir, 'episode_raw.json'), JSON.stringify(rawHindi, null, 2), 'utf8');
fs.writeFileSync(path.join(enDir, 'episode_raw.json'), JSON.stringify(rawEn, null, 2), 'utf8');

console.log('✅ Successfully enriched ch01_part1 (HI & EN) with the concrete front example and John Murphy technical content!');

