import fs from 'node:fs';
import path from 'node:path';
import { Episode } from '../src/schemas/episode.ts';

const chapDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap16_part01';
const epRaw = JSON.parse(fs.readFileSync(path.join(chapDir, 'episode_raw.json'), 'utf8'));

// Check English script if available
const scriptMdPath = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_16/Part_01/script.md';
let enBeats = {};
if (fs.existsSync(scriptMdPath)) {
  const enScriptText = fs.readFileSync(scriptMdPath, 'utf8');
  const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
  enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
}

const rawBeats = [];
epRaw.scenes.forEach(s => s.beats.forEach(b => rawBeats.push(b)));

const hiBeats = {};
rawBeats.forEach((b, idx) => {
  const k = b.id || ('b' + String(idx + 1).padStart(2, '0'));
  hiBeats[k] = (b.hi_narration || "").trim();
  if (!enBeats[k]) {
    enBeats[k] = (b.en_subtitle || "").trim();
  }
});

console.log('Total raw beats:', rawBeats.length);
console.log('Sample beat b01 EN:', enBeats['b01']);
console.log('Sample beat b01 HI:', hiBeats['b01']);
