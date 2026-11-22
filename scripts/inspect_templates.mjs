import fs from 'node:fs';
import path from 'node:path';

const baseDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives';
const entries = fs.readdirSync(baseDir).filter(e => e.startsWith('chap')).sort();

const allTemplates = new Set();
for (const entry of entries) {
  const p = path.join(baseDir, entry, 'episode_raw.json');
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.scenes.forEach(s => allTemplates.add(s.template));
  }
}

console.log('All templates used across all chapters:');
console.log([...allTemplates].sort());
