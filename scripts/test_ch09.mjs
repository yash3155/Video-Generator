import fs from 'node:fs';

const en = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_09/Part_01/script.md', 'utf8');
const hi = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_09/Part_01/script_hi.md', 'utf8');

const enMatches = [...en.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches = [...hi.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hi.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

console.log('Ch09 EN beats count:', enMatches.length);
console.log('Ch09 HI beats count:', hiMatches.length);
