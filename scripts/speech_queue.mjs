import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const LOG_FILE = path.join(REPO_ROOT, 'workspace', 'speech_queue.log');

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
  } catch {}
}

function runCmd(cmd) {
  log(`Executing: ${cmd}`);
  try {
    const stdout = execSync(cmd, { cwd: REPO_ROOT, stdio: 'pipe', encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    return { success: true, stdout };
  } catch (err) {
    return { success: false, stdout: err.stdout || '', stderr: err.stderr || '', status: err.status };
  }
}

const chaptersRoot = path.join(REPO_ROOT, 'workspace', 'books', 'hull', 'chapters');
if (fs.existsSync(chaptersRoot)) {
  const chDirs = fs.readdirSync(chaptersRoot).sort();

  for (const ch of chDirs) {
    const chPath = path.join(chaptersRoot, ch);
    if (!fs.statSync(chPath).isDirectory()) continue;
    const pDirs = fs.readdirSync(chPath).sort();
    for (const part of pDirs) {
      const partDir = path.join(chaptersRoot, ch, part);
      const epPath = path.join(partDir, '08_episode.json');
      const compPath = path.join(partDir, '09_episode_compiled.json');
      if (!fs.existsSync(epPath)) continue;
      if (fs.existsSync(compPath)) {
        log(`Already compiled: ${ch} ${part}`);
        continue;
      }

      log(`Starting S10 Speech Synthesis for ${ch} ${part}...`);
      let ok = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        log(`Attempt ${attempt} for ${ch} ${part}...`);
        const res = runCmd(`node bin/openlectern.mjs run S10 --book hull --chapter ${ch} --part ${part}`);
        if (res.success && fs.existsSync(compPath)) {
          log(`[SUCCESS] S10 completed for ${ch} ${part}!`);
          ok = true;
          break;
        }
        log(`Attempt ${attempt} failed for ${ch} ${part}: ${res.stderr || res.stdout}`);
      }
      if (!ok) {
        log(`[WARN] S10 could not complete after 3 attempts for ${ch} ${part}, continuing to next...`);
      }
    }
  }
}

log('Speech queue finished all chapters!');
