import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, runS12WithHandoff, runCmd, log } from './pipeline_daemon.mjs';

const chaptersRoot = path.join(REPO_ROOT, 'workspace', 'books', 'hull', 'chapters');
const outHullDir = path.join(REPO_ROOT, 'out', 'hull');
fs.mkdirSync(outHullDir, { recursive: true });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  log('Starting Master Continuous Render Queue...');

  while (true) {
    let pendingCount = 0;
    if (!fs.existsSync(chaptersRoot)) {
      log(`Chapters root not found at ${chaptersRoot}, waiting...`);
      await sleep(15000);
      continue;
    }
    const chDirs = fs.readdirSync(chaptersRoot).sort();

    for (const ch of chDirs) {
      const chPath = path.join(chaptersRoot, ch);
      if (!fs.statSync(chPath).isDirectory()) continue;
      const pDirs = fs.readdirSync(chPath).sort();
      for (const part of pDirs) {
        const enOut = path.join(outHullDir, `${ch}_${part}_en.mp4`);
        const hiOut = path.join(outHullDir, `${ch}_${part}_hi.mp4`);

        if (fs.existsSync(enOut) && fs.existsSync(hiOut) && fs.statSync(enOut).size > 10_000_000 && fs.statSync(hiOut).size > 10_000_000) {
          continue; // Already finished
        }

        pendingCount++;
        const partDir = path.join(chaptersRoot, ch, part);
        const compPath = path.join(partDir, '09_episode_compiled.json');

        if (!fs.existsSync(compPath)) {
          // Waiting for speech queue to finish this chapter
          continue;
        }

        log(`========================================`);
        log(`PROCESSING DELIVERABLE: ${ch} ${part}`);
        log(`========================================`);

        // 1. S11 Render
        log(`Running S11 Render for ${ch} ${part}...`);
        const s11Res = await runCmd(`node bin/openlectern.mjs run S11 --book hull --chapter ${ch} --part ${part}`);
        if (!s11Res.success) {
          log(`[ERROR] S11 Render failed for ${ch} ${part}: ${s11Res.stderr || s11Res.stdout}`);
          continue;
        }

        // 2. S12 QA
        log(`Running S12 QA for ${ch} ${part}...`);
        const s12Ok = await runS12WithHandoff(ch, part);
        if (!s12Ok) {
          log(`[ERROR] S12 QA failed for ${ch} ${part}`);
          continue;
        }

        // 3. S13 Packaging
        log(`Running S13 Packaging for ${ch} ${part}...`);
        const s13Res = await runCmd(`node bin/openlectern.mjs run S13 --book hull --chapter ${ch} --part ${part}`);
        log(`S13 result: ${s13Res.stdout}`);

        // 4. Copy deliverables to out/hull
        const renderDir = path.join(partDir, 'render');
        const enSrc = path.join(renderDir, 'en.mp4');
        const hiSrc = path.join(renderDir, 'hi.mp4');

        if (fs.existsSync(enSrc) && fs.existsSync(hiSrc)) {
          fs.copyFileSync(enSrc, enOut);
          fs.copyFileSync(hiSrc, hiOut);
          log(`[SUCCESS] Deliverable completed for ${ch} ${part}:`);
          log(`- ${enOut} (${fs.statSync(enOut).size} bytes)`);
          log(`- ${hiOut} (${fs.statSync(hiOut).size} bytes)`);
        } else {
          log(`[ERROR] Rendered mp4 files missing in ${renderDir}`);
        }
      }
    }

    if (pendingCount === 0) {
      log('ALL CHAPTERS AND PARTS IN THE TEXTBOOK ARE 100% COMPLETE!');
      break;
    }

    log(`Iteration complete. ${pendingCount} parts pending. Pausing 30 seconds before next check...`);
    await sleep(30000);
  }
}

main().catch(err => {
  log(`Fatal error in render queue: ${err.stack || err.message}`);
});
