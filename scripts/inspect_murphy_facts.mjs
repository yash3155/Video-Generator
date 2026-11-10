import fs from 'node:fs';
import path from 'node:path';

const chs = [
  'ch02_part1', 'ch03_part1', 'ch04_part1',
  'ch04_part2', 'ch04_part3', 'ch05_part1',
  'ch05_part2', 'ch06_part1', 'ch06_part2'
];

chs.forEach(ch => {
  const p = path.resolve('src/data/chapters/murphy_technical_analysis', ch, 'source_facts.json');
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log(`\n=== ${ch} (${data.facts?.length || 0} facts) ===`);
    data.facts?.forEach(f => {
      console.log(`  [${f.id}] ${f.topic}: ${f.statement.slice(0, 80)}...`);
    });
  } else {
    console.log(`MISSING source_facts.json in ${ch}`);
  }
});

