import fs from 'node:fs';

const enText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_04/Part_01/script.md', 'utf8');

const sceneBlocks = enText.split(/### Scene (\d+):/);
console.log('Found scene blocks:', (sceneBlocks.length - 1) / 2);

for (let i = 1; i < sceneBlocks.length; i += 2) {
  const sceneNum = parseInt(sceneBlocks[i]);
  const content = sceneBlocks[i + 1];
  const titleLine = content.split('\n')[0].trim();
  const beats = [...content.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*/g)].map(m => m[1]);
  console.log(`Scene ${sceneNum}: "${titleLine}" -> ${beats.join(', ')}`);
}
