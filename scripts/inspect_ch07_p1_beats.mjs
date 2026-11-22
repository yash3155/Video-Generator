import fs from 'node:fs';

const enText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_07/Part_01/script.md', 'utf8');
const enMatches = [...enText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
enMatches.forEach(m => console.log(m[1] + ': ' + m[2]));
