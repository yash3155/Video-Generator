import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rootDir = process.cwd();

function runCmd(cmd) {
  console.log(`\n>>> EXECUTING: ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: rootDir });
}

async function renderAndQa(courseSlug, chapterSlug) {
  const chapterDir = path.join(rootDir, "src", "data", "chapters", courseSlug, chapterSlug);
  const compiledPath = path.join(chapterDir, "episode_compiled.json");
  const outDir = path.join(rootDir, "out", "chapters", courseSlug);
  const outPath = path.join(outDir, `${chapterSlug}.mp4`);

  if (!fs.existsSync(compiledPath)) {
    throw new Error(`Missing compiled episode: ${compiledPath}`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n======================================================`);
  console.log(`🎬 RENDERING VIDEO: ${courseSlug} / ${chapterSlug}`);
  console.log(`======================================================`);
  runCmd(`npx remotion render src/index.ts EpisodeComposition "${outPath}" --props="${compiledPath}" --crf=16 --pixel-format=yuv420p`);

  console.log(`\n======================================================`);
  console.log(`🛡️ RUNNING QA RELEASE GATE: ${courseSlug} / ${chapterSlug}`);
  console.log(`======================================================`);
  runCmd(`node scripts/run_qa.mjs --dir="${chapterDir}"`);
}

async function main() {
  const args = process.argv.slice(2);
  let queue = [];

  if (args.length > 0) {
    queue = args;
  } else {
    // Default remaining unrendered queue
    queue = [
      "ch17_part2",
      "ch18_part1",
      "ch19_part1",
      "ch20_part1",
      "ch20_part2",
      "ch21_part1",
      "ch22_part1",
      "ch23_part1",
      "ch24_part1",
      "ch25_part1",
      "ch25_part2"
    ];
  }

  console.log(`\nStarting Autonomous Batch Render Runner for ${queue.length} chapters...`);
  console.log(`Queue: ${queue.join(", ")}\n`);

  for (const ch of queue) {
    console.log(`\n######################################################`);
    console.log(`🚀 PROCESSING CHAPTER PAIR: ${ch}`);
    console.log(`######################################################`);

    // 1. Check/Render Hindi
    const hiVideo = path.join(rootDir, "out", "chapters", "hull_derivatives", `${ch}.mp4`);
    if (!fs.existsSync(hiVideo)) {
      await renderAndQa("hull_derivatives", ch);
    } else {
      console.log(`⏩ Hindi video already rendered for ${ch}, running QA...`);
      runCmd(`node scripts/run_qa.mjs --dir="src/data/chapters/hull_derivatives/${ch}"`);
    }

    // 2. Check/Render English
    const enVideo = path.join(rootDir, "out", "chapters", "hull_derivatives_en", `${ch}.mp4`);
    if (!fs.existsSync(enVideo)) {
      await renderAndQa("hull_derivatives_en", ch);
    } else {
      console.log(`⏩ English video already rendered for ${ch}, running QA...`);
      runCmd(`node scripts/run_qa.mjs --dir="src/data/chapters/hull_derivatives_en/${ch}"`);
    }

    // 3. Update inventory after each completed pair
    runCmd(`node scripts/build_bilingual_inventory.mjs`);
  }

  console.log(`\n🎉 ALL CHAPTERS IN QUEUE COMPLETED AND QA VERIFIED!`);
}

main().catch(err => {
  console.error("Batch runner failed:", err);
  process.exit(1);
});
