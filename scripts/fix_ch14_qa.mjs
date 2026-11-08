import fs from 'fs';

const paths = [
  'src/data/chapters/hull_derivatives/ch14_part1/episode_compiled.json',
  'src/data/chapters/hull_derivatives/ch14_part1/episode_raw.json',
  'src/data/chapters/hull_derivatives_en/ch14_part1/episode_compiled.json',
  'src/data/chapters/hull_derivatives_en/ch14_part1/episode_raw.json'
];

for (const p of paths) {
  if (fs.existsSync(p)) {
    const ep = JSON.parse(fs.readFileSync(p, 'utf8'));
    // Fix quiz question in scene 9 across all beats
    const newQ = "Why does the standard Black-Scholes-Merton model overvalue long-term executive Employee Stock Options compared to the Hull-White modified binomial model?";
    ep.scenes[9].beats.forEach(b => {
      if (b.visual && b.visual.data) {
        b.visual.data.question = newQ;
      }
      if (b.ui_state) {
        b.ui_state.question = newQ;
      }
    });
    // Fix b18 subtitle if length > 16
    const b18 = ep.scenes[11].beats[2];
    if (b18 && b18.subtitle) {
      b18.subtitle = "Rules 3 and 4: OTC carries counterparty risk, while exchange trades feature daily mark to market.";
    }
    fs.writeFileSync(p, JSON.stringify(ep, null, 2), 'utf8');
    console.log(`Updated ${p}`);
  }
}
