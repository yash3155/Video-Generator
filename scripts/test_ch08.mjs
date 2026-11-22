import fs from 'node:fs';

const en = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_08/Part_01/script.md', 'utf8');
const hi = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_08/Part_01/script_hi.md', 'utf8');

const enMatches = [...en.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches = [...hi.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hi.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

const enSet = new Set(enMatches.map(m => m[1]));
const hiSet = new Set(hiMatches.map(m => m[1]));

console.log('EN beats:', [...enSet].sort());
console.log('HI beats:', [...hiSet].sort());
for (const b of hiSet) {
  if (!enSet.has(b)) console.log('Missing in EN:', b);
}
for (const b of enSet) {
  if (!hiSet.has(b)) console.log('Missing in HI:', b);
}
