import fs from 'node:fs';

const enScript = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_11/Part_02/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap11_part02/episode_raw.json', 'utf8'));

const enMatches = [...enScript.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
console.log('EN script matches:', enMatches.length);

const rawBeats = [];
epRaw.scenes.forEach(s => s.beats.forEach(b => rawBeats.push(b)));
console.log('epRaw total beats:', rawBeats.length);

console.log('Sample beat 1:');
console.log('EN script:', enMatches[0][2].slice(0, 60));
console.log('HI raw:', rawBeats[0].hi_narration.slice(0, 60));
