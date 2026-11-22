import fs from 'node:fs';
import path from 'node:path';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import { getBundle } from '../src/render/bundle.ts';
import { syncPublicDir } from '../src/render/lesson.ts';

const partDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch03/p1';
const compiled = JSON.parse(fs.readFileSync(path.join(partDir, '09_episode_compiled.json'), 'utf8'));

const pub = syncPublicDir(partDir, compiled);
const serveUrl = await getBundle({ publicDir: pub });
const inputProps = { compiled, lang: 'en' };
const browserOpts = { chromiumOptions: { gl: "swangle" }, logLevel: "error" };
const composition = await selectComposition({ serveUrl, id: "Lesson", inputProps, ...browserOpts });

const outPath = 'c:/code/openlectern/workspace/.cache/test_s08_fixed.png';
await renderStill({
  serveUrl,
  composition,
  inputProps,
  frame: 17820,
  output: outPath,
  ...browserOpts
});

console.log('Still rendered to:', outPath);
