import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const chapters = ['ch13', 'ch14', 'ch15'];
for (const ch of chapters) {
  const chDir = path.join('c:/code/openlectern/workspace/books/hull/chapters', ch);
  if (!fs.existsSync(chDir)) continue;
  for (const part of fs.readdirSync(chDir)) {
    const epPath = path.join(chDir, part, '08_episode.json');
    if (fs.existsSync(epPath)) {
      console.log(`Sanitizing ${epPath}...`);
      try {
        execSync(`node --import tsx scripts/fix_episode.mjs "${epPath}"`, { stdio: 'inherit' });
      } catch (err) {
        console.error(`Failed to sanitize ${epPath}:`, err.message);
      }
    }
  }
}
console.log('Sanitization of 13-15 complete!');
