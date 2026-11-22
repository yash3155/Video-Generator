import fs from 'node:fs';
import { execSync } from 'node:child_process';

const enDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives_en/chap03_part01/audio';
const hiDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_03/Part_01/temporary-assets/audio';

function check(dir, label) {
  let total = 0;
  for (let i = 1; i <= 40; i++) {
    const id = 'b' + String(i).padStart(2, '0');
    const p = `${dir}/${id}.mp3`;
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${p}"`).toString().trim();
    const sec = parseFloat(out);
    total += sec;
  }
  console.log(`${label} total: ${total.toFixed(2)}s (${(total/60).toFixed(2)} min)`);
}

check(enDir, 'EN');
check(hiDir, 'HI');
