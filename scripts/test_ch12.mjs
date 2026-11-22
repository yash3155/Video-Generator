import fs from 'node:fs';

const en1 = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_12/Part_01/script.md', 'utf8');
const epRaw1 = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap12_part01/episode_raw.json', 'utf8'));

const enMatches1 = [...en1.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const rawBeats1 = [];
epRaw1.scenes.forEach(s => s.beats.forEach(b => rawBeats1.push(b)));

console.log('Ch12 P1 EN script beats:', enMatches1.length, 'epRaw beats:', rawBeats1.length);

const en2 = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_12/Part_02/script.md', 'utf8');
const epRaw2 = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap12_part02/episode_raw.json', 'utf8'));

const enMatches2 = [...en2.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const rawBeats2 = [];
epRaw2.scenes.forEach(s => s.beats.forEach(b => rawBeats2.push(b)));

console.log('Ch12 P2 EN script beats:', enMatches2.length, 'epRaw beats:', rawBeats2.length);
