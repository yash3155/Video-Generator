import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const LOG_FILE = path.join(REPO_ROOT, 'workspace', 'missing_s10.log');

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
  } catch {}
}

const targets = [
  { ch: 'ch13', part: 'p2' },
  { ch: 'ch14', part: 'p1' },
  { ch: 'ch14', part: 'p2' },
  { ch: 'ch15', part: 'p1' },
  { ch: 'ch15', part: 'p2' },
];

for (const { ch, part } of targets) {
  const compPath = path.join(REPO_ROOT, 'workspace', 'books', 'hull', 'chapters', ch, part, '09_episode_compiled.json');
  if (fs.existsSync(compPath)) {
    log(`Already compiled: ${ch} ${part}`);
    continue;
  }
  log(`Starting S10 for ${ch} ${part}...`);
  try {
    const stdout = execSync(`node bin/openlectern.mjs run S10 --book hull --chapter ${ch} --part ${part}`, {
      cwd: REPO_ROOT,
      stdio: 'pipe',
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });
    log(`[SUCCESS] S10 completed for ${ch} ${part}!`);
  } catch (err) {
    log(`[ERROR] S10 failed for ${ch} ${part}: ${err.stderr || err.stdout}`);
  }
}

log('All missing S10 chapters finished!');
