import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chapters = [
  // Hindi chapters
  { courseId: 'hull_derivatives', chapterId: 'ch10_part1' },
  { courseId: 'hull_derivatives', chapterId: 'ch10_part2' },
  { courseId: 'hull_derivatives', chapterId: 'ch12_part2' },
  { courseId: 'hull_derivatives', chapterId: 'ch13_part1' },
  { courseId: 'hull_derivatives', chapterId: 'ch13_part2' },
  { courseId: 'hull_derivatives', chapterId: 'ch14_part1' },
  // English chapters
  { courseId: 'hull_derivatives_en', chapterId: 'ch09_part2' },
  { courseId: 'hull_derivatives_en', chapterId: 'ch10_part1' },
  { courseId: 'hull_derivatives_en', chapterId: 'ch10_part2' },
  { courseId: 'hull_derivatives_en', chapterId: 'ch12_part2' },
  { courseId: 'hull_derivatives_en', chapterId: 'ch13_part1' },
  { courseId: 'hull_derivatives_en', chapterId: 'ch13_part2' },
  { courseId: 'hull_derivatives_en', chapterId: 'ch14_part1' },
];

function runCommand(cmdLine) {
  return new Promise((resolve, reject) => {
    console.log(`\n======================================================`);
    console.log(`▶️ EXECUTING: ${cmdLine}`);
    console.log(`======================================================\n`);
    const proc = spawn(cmdLine, {
      shell: true,
      stdio: 'inherit'
    });
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
    proc.on('error', err => reject(err));
  });
}

async function main() {
  console.log(`Starting Batch Re-render of remaining ${chapters.length} Hull Chapters with Bespoke Cards...`);
  const startTime = Date.now();

  for (let i = 0; i < chapters.length; i++) {
    const { courseId, chapterId } = chapters[i];
    console.log(`\n------------------------------------------------------`);
    console.log(`🎬 [${i + 1}/${chapters.length}] Rendering ${courseId}/${chapterId}...`);
    console.log(`------------------------------------------------------`);

    const propsRel = `src/data/chapters/${courseId}/${chapterId}/episode_compiled.json`;
    const outRel = `out/chapters/${courseId}/${chapterId}.mp4`;
    const qaDir = `src/data/chapters/${courseId}/${chapterId}`;

    if (!fs.existsSync(propsRel)) {
      console.error(`❌ Props file not found: ${propsRel}`);
      continue;
    }

    try {
      const renderCmd = `npx remotion render src/index.ts EpisodeComposition ${outRel} --props=${propsRel} --crf=16 --pixel-format=yuv420p`;
      await runCommand(renderCmd);
      console.log(`✅ Successfully rendered ${outRel}`);

      // Run QA verification
      const qaCmd = `node scripts/run_qa.mjs --dir=${qaDir} --allow-high`;
      await runCommand(qaCmd);
    } catch (err) {
      console.error(`❌ Error rendering ${courseId}/${chapterId}:`, err.message);
    }
  }

  const durationMin = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`\n🎉 Batch Re-rendering Complete in ${durationMin} minutes!`);
}

main().catch(err => {
  console.error('Fatal batch rendering error:', err);
  process.exit(1);
});
