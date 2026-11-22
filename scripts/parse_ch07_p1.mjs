import fs from 'node:fs';

const enText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_07/Part_01/script.md', 'utf8');
const hiText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_07/Part_01/script_hi.md', 'utf8');

const enMatches = [...enText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
console.log('EN beats count:', enMatches.length);

let hiMatches = [...hiText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hiText.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}
console.log('HI beats count:', hiMatches.length);
hiMatches.slice(0, 5).forEach(m => console.log(m[1], ':', m[2].slice(0, 60)));
