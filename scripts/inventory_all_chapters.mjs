import fs from 'node:fs';
import path from 'node:path';

const enChaptersDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition';
const hiChaptersDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi';
const rawDataDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives_en';

const entries = fs.readdirSync(enChaptersDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.startsWith('Chapter_'))
  .map(d => d.name)
  .sort();

console.log(`Found ${entries.length} chapters in Hull_English_Edition.`);

const inventory = [];

for (const ch of entries) {
  const chNum = parseInt(ch.replace('Chapter_', ''), 10);
  const chDir = path.join(enChaptersDir, ch);
  const parts = fs.readdirSync(chDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('Part_'))
    .map(d => d.name)
    .sort();

  for (const p of parts) {
    const pNum = parseInt(p.replace('Part_', ''), 10);
    const enScriptPath = path.join(chDir, p, 'script.md');
    const hiScriptPath = path.join(hiChaptersDir, ch, p, 'script_hi.md');

    // Also check rawDataDir
    const rawFolder = `chap${String(chNum).padStart(2, '0')}_part${String(pNum).padStart(2, '0')}`;
    const rawPath = path.join(rawDataDir, rawFolder);

    inventory.push({
      chapterId: `ch${String(chNum).padStart(2, '0')}`,
      partId: `p${pNum}`,
      chapterFolder: ch,
      partFolder: p,
      hasEnScript: fs.existsSync(enScriptPath),
      hasHiScript: fs.existsSync(hiScriptPath),
      hasRawData: fs.existsSync(rawPath),
      enScriptPath,
      hiScriptPath,
      rawPath
    });
  }
}

console.log(`Total inventory items (parts): ${inventory.length}`);
const readyBoth = inventory.filter(x => x.hasEnScript && x.hasHiScript);
console.log(`Parts with both English and Hindi scripts: ${readyBoth.length}`);
console.log('Sample first 5 parts:', inventory.slice(0, 5));
