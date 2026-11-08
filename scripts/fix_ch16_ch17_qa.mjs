import fs from 'fs';

const chapters = ['ch16_part1', 'ch17_part1', 'ch17_part2'];

for (const ch of chapters) {
  const paths = [
    `src/data/chapters/hull_derivatives/${ch}/episode_compiled.json`,
    `src/data/chapters/hull_derivatives/${ch}/episode_raw.json`,
    `src/data/chapters/hull_derivatives_en/${ch}/episode_compiled.json`,
    `src/data/chapters/hull_derivatives_en/${ch}/episode_raw.json`
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      const ep = JSON.parse(fs.readFileSync(p, 'utf8'));
      const q0 = ep.scenes[9].beats[0].ui_state?.question;
      if (q0) {
        ep.scenes[9].beats.forEach(b => {
          if (b.ui_state) b.ui_state.question = q0;
          if (b.visual && b.visual.data) b.visual.data.question = q0;
        });
      }
      // Fix b18 subtitle if length > 16
      const b18 = ep.scenes[11].beats[2];
      if (b18 && b18.subtitle) {
        const words = b18.subtitle.split(/\s+/).filter(Boolean);
        if (words.length > 16) {
          b18.subtitle = "Rules 3 and 4: Continuous margin and settlement manage systemic counterparty risks.";
        }
      }
      fs.writeFileSync(p, JSON.stringify(ep, null, 2), 'utf8');
      console.log(`Updated ${p}`);
    }
  }
}
