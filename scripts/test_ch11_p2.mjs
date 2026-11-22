import fs from 'node:fs';

const en = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_11/Part_02/script.md', 'utf8');
const hi = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_11/Part_02/script_hi.md', 'utf8');

const enMatches = [...en.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches = [...hi.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hi.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

console.log('EN beats:', enMatches.map(m => m[1]));
console.log('HI beats:', hiMatches.map(m => m[1]));
