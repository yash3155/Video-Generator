import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const jobs = [
  {
    name: 'hull_derivatives/ch03_part1 (Hindi)',
    props: 'src/data/chapters/hull_derivatives/ch03_part1/episode_compiled.json',
    out: 'out/chapters/hull_derivatives/ch03_part1.mp4',
    dir: 'src/data/chapters/hull_derivatives/ch03_part1'
  },
  {
    name: 'hull_derivatives/ch03_part2 (Hindi)',
    props: 'src/data/chapters/hull_derivatives/ch03_part2/episode_compiled.json',
    out: 'out/chapters/hull_derivatives/ch03_part2.mp4',
    dir: 'src/data/chapters/hull_derivatives/ch03_part2'
  },
  {
    name: 'hull_derivatives_en/ch03_part2 (English)',
    props: 'src/data/chapters/hull_derivatives_en/ch03_part2/episode_compiled.json',
    out: 'out/chapters/hull_derivatives_en/ch03_part2.mp4',
    dir: 'src/data/chapters/hull_derivatives_en/ch03_part2'
  }
];

for (const job of jobs) {
  console.log(`\n======================================================`);
  console.log(`🎬 STARTING RENDER: ${job.name}`);
  console.log(`   Props: ${job.props}`);
  console.log(`   Output: ${job.out}`);
  console.log(`======================================================\n`);

  const outDir = path.dirname(path.resolve(job.out));
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const renderCmd = `npx remotion render src/index.ts EpisodeComposition "${job.out}" --props="${job.props}" --crf=16 --pixel-format=yuv420p`;
  console.log(`Executing: ${renderCmd}`);
  execSync(renderCmd, { stdio: 'inherit' });

  console.log(`\n✅ Render complete: ${job.out}`);
  console.log(`🔎 Running Release Gate QA on ${job.dir}...`);

  const qaCmd = `node scripts/run_qa.mjs --dir="${job.dir}" --allow-high`;
  execSync(qaCmd, { stdio: 'inherit' });
  console.log(`✅ QA check finished for ${job.name}\n`);
}

console.log(`\n🎉 ALL SCHEDULED RENDERS AND QA CHECKS COMPLETED SUCCESSFULLY!\n`);

