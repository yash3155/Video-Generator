import fs from 'node:fs';

const en = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_03/Part_02/script.md', 'utf8');
const hi = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_03/Part_02/script_hi.md', 'utf8');

const enBeats = {};
const hiBeats = {};

const enMatches = [...en.matchAll(/### Beat (b\d+)[\s\S]*?\*\*Instructor Narration:\*\*\s*\r?\n"([^"]+)"/g)];
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());

const hiBlocks = hi.split(/\*\s+\*\*`?(b\d+)`?\*\*/);
for (let i = 1; i < hiBlocks.length; i += 2) {
  const bId = hiBlocks[i];
  const block = hiBlocks[i + 1];
  const m = block.match(/\*Hindi Narration:\*\s*\"([^\"]+)\"/);
  if (m) hiBeats[bId] = m[1].trim();
}

console.log('Ch03 P2 EN beats:', Object.keys(enBeats).length, 'HI beats:', Object.keys(hiBeats).length);
for (let i = 1; i <= 40; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k]) console.log('Missing EN:', k);
  if (!hiBeats[k]) console.log('Missing HI:', k);
}
