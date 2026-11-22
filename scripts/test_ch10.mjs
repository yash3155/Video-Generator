import fs from 'node:fs';

const en1 = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_10/Part_01/script.md', 'utf8');
const hi1 = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_10/Part_01/script_hi.md', 'utf8');

const enMatches1 = [...en1.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches1 = [...hi1.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches1.length === 0) {
  hiMatches1 = [...hi1.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

console.log('Ch10 P1 EN beats:', enMatches1.length, 'HI beats:', hiMatches1.length);

const en2 = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_10/Part_02/script.md', 'utf8');
const hi2 = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_10/Part_02/script_hi.md', 'utf8');

const enMatches2 = [...en2.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches2 = [...hi2.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches2.length === 0) {
  hiMatches2 = [...hi2.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

console.log('Ch10 P2 EN beats:', enMatches2.length, 'HI beats:', hiMatches2.length);
