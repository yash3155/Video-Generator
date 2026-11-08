import fs from 'fs';

const paths = [
  'src/data/chapters/hull_derivatives/ch15_part1/episode_compiled.json',
  'src/data/chapters/hull_derivatives/ch15_part1/episode_raw.json',
  'src/data/chapters/hull_derivatives_en/ch15_part1/episode_compiled.json',
  'src/data/chapters/hull_derivatives_en/ch15_part1/episode_raw.json'
];

for (const p of paths) {
  if (fs.existsSync(p)) {
    const ep = JSON.parse(fs.readFileSync(p, 'utf8'));
    const q0 = ep.scenes[9].beats[0].ui_state.question || "Consider an equity portfolio manager seeking long-term insurance over a 25-year horizon. Why does the annual cost of put option protection fail to converge to zero?";
    ep.scenes[9].beats.forEach(b => {
      if (b.ui_state) b.ui_state.question = q0;
      if (b.visual && b.visual.data) b.visual.data.question = q0;
    });
    // Fix b18 subtitle if length > 16
    const b18 = ep.scenes[11].beats[2];
    if (b18 && b18.subtitle) {
      b18.subtitle = "Rules 3 and 4: Continuous dividends lower forward prices and modify option bounds.";
    }
    fs.writeFileSync(p, JSON.stringify(ep, null, 2), 'utf8');
    console.log(`Updated ${p}`);
  }
}

