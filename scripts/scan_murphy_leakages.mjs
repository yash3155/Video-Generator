import fs from 'node:fs';
import path from 'node:path';

const bannedTerms = [
  'farmer', 'corn', 'harvest', 'cbot', 'chicago board', '1848',
  'over-the-counter', 'bilateral', 'naked option', 'black-scholes',
  'bsm', 'strike price', 'call option', 'put option', 'metallgesellschaft',
  'delta hedging', 'vega crush', 'contango', 'backwardation'
];

['murphy_technical_analysis', 'murphy_technical_analysis_en'].forEach(courseId => {
  const dir = path.resolve('src/data/chapters', courseId);
  if (!fs.existsSync(dir)) return;
  const chs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory() && f !== 'test_run');
  console.log(`\n=== Checking ${courseId} (${chs.length} chapters) for leakages ===`);

  let leakCount = 0;
  chs.forEach(ch => {
    const rawP = path.join(dir, ch, 'episode_raw.json');
    if (!fs.existsSync(rawP)) return;
    const ep = JSON.parse(fs.readFileSync(rawP, 'utf8'));

    ep.scenes.forEach((sc, scIdx) => {
      const scStr = JSON.stringify(sc).toLowerCase();
      bannedTerms.forEach(term => {
        if (scStr.includes(term)) {
          leakCount++;
          console.log(`[LEAK] ${courseId}/${ch} Scene ${scIdx} (${sc.template}): contains '${term}'`);
        }
      });
    });
  });

  console.log(`Total leakages in ${courseId}: ${leakCount}`);
});

