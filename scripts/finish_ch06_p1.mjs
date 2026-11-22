import fs from 'node:fs';
import path from 'node:path';
import { runS12WithHandoff, runCmd, log } from './pipeline_daemon.mjs';

log('Starting S12 QA for ch06 p1...');
const s12Ok = runS12WithHandoff('ch06', 'p1');
if (!s12Ok) {
  throw new Error('S12 QA failed for ch06 p1');
}

log('Running S13 Packaging for ch06 p1...');
const s13Res = runCmd('node bin/openlectern.mjs run S13 --book hull --chapter ch06 --part p1');
log(`S13 result: ${s13Res.stdout}`);

// Copy deliverables to out/hull
const outHullDir = 'c:/code/openlectern/out/hull';
fs.mkdirSync(outHullDir, { recursive: true });

const renderDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch06/p1/render';
const enSrc = path.join(renderDir, 'en.mp4');
const hiSrc = path.join(renderDir, 'hi.mp4');

const enDst = path.join(outHullDir, 'ch06_p1_en.mp4');
const hiDst = path.join(outHullDir, 'ch06_p1_hi.mp4');

fs.copyFileSync(enSrc, enDst);
fs.copyFileSync(hiSrc, hiDst);

log(`Successfully copied deliverables to:
- ${enDst} (${fs.statSync(enDst).size} bytes)
- ${hiDst} (${fs.statSync(hiDst).size} bytes)`);
