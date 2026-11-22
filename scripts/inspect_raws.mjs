import fs from 'node:fs';
import path from 'node:path';

const baseDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives';
const entries = fs.readdirSync(baseDir).filter(e => e.startsWith('chap'));

console.log('Total entries:', entries.length);
for (const entry of entries) {
  const p = path.join(baseDir, entry, 'episode_raw.json');
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      let beatCount = 0;
      data.scenes.forEach(s => beatCount += s.beats.length);
      console.log(`${entry}: ${data.scenes.length} scenes, ${beatCount} beats. Title: ${data.title}`);
    } catch (err) {
      console.error(`Error in ${entry}:`, err.message);
    }
  } else {
    console.log(`${entry}: No episode_raw.json found!`);
  }
}
