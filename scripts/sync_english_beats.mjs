import fs from "fs";
import path from "path";

const enBaseDir = path.resolve("src/data/chapters/hull_derivatives_en");
const chapters = fs.readdirSync(enBaseDir).filter(f => fs.statSync(path.join(enBaseDir, f)).isDirectory() && f.startsWith("ch"));

console.log(`Auditing and synchronizing ${chapters.length} English chapters...`);

for (const ch of chapters) {
  const rawPath = path.join(enBaseDir, ch, "episode_raw.json");
  if (!fs.existsSync(rawPath)) continue;

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
  } catch (e) {
    console.error(`Error parsing ${rawPath}:`, e.message);
    continue;
  }

  let modified = false;
  for (const scene of raw.scenes || []) {
    for (const beat of scene.beats || []) {
      const canonicalText = beat.dialogue || beat.text;
      if (canonicalText) {
        if (beat.en_narration !== canonicalText) {
          beat.en_narration = canonicalText;
          modified = true;
        }
        if (beat.en_subtitle !== canonicalText) {
          beat.en_subtitle = canonicalText;
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(rawPath, JSON.stringify(raw, null, 2), "utf8");
    console.log(`[SYNCED] ${ch}: Updated en_narration and en_subtitle to match dialogue/text`);
  } else {
    console.log(`[CLEAN] ${ch}: Already in sync`);
  }
}
