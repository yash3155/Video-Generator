import fs from 'node:fs';

const enText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_04/Part_02/script.md', 'utf8');
const hiText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_04/Part_02/script_hi.md', 'utf8');

const enMatches = [...enText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
console.log('EN beats count:', enMatches.length);
enMatches.slice(0, 5).forEach(m => console.log(m[1], ':', m[2].slice(0, 60)));

const hiMatches = [...hiText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
console.log('HI beats count:', hiMatches.length);
hiMatches.slice(0, 5).forEach(m => console.log(m[1], ':', m[2].slice(0, 60)));

const sceneBlocks = enText.split(/### Scene (\d+):/);
console.log('Found scene blocks:', (sceneBlocks.length - 1) / 2);

for (let i = 1; i < sceneBlocks.length; i += 2) {
  const sceneNum = parseInt(sceneBlocks[i]);
  const content = sceneBlocks[i + 1];
  const titleLine = content.split('\n')[0].trim();
  const beats = [...content.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*/g)].map(m => m[1]);
  console.log(`Scene ${sceneNum}: "${titleLine}" -> ${beats.join(', ')}`);
}
