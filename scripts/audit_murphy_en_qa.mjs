// scripts/audit_murphy_en_qa.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const baseDir = path.resolve('src/data/chapters/murphy_technical_analysis_en');
const chs = fs.readdirSync(baseDir).filter(d => fs.statSync(path.join(baseDir, d)).isDirectory());

console.log(`Running QA Release Gate check on ${chs.length} Murphy English chapters...`);
let passCount = 0;
let failCount = 0;
const results = [];

for (let i = 0; i < chs.length; i++) {
  const ch = chs[i];
  const targetDir = path.join(baseDir, ch);
  try {
    const cmd = `node scripts/run_qa.mjs --dir="${targetDir}"`;
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const isPass = out.includes('RESULT: RELEASE GATE PASS');
    const isCond = out.includes('RESULT: RELEASE GATE CONDITIONAL PASS');
    passCount++;
    results.push({ chapter: ch, status: isPass ? 'PASS' : 'CONDITIONAL_PASS' });
    console.log(`[${i + 1}/${chs.length}] ${ch}: ${isPass ? '✅ PASS' : '⚠️ CONDITIONAL_PASS'}`);
  } catch (err) {
    failCount++;
    results.push({ chapter: ch, status: 'FAIL', error: err.message });
    console.error(`[${i + 1}/${chs.length}] ${ch}: ❌ FAIL`);
  }
}

console.log('\n========================================');
console.log(`MURPHY EN QA AUDIT SUMMARY:`);
console.log(`Passed (PASS / CONDITIONAL_PASS): ${passCount} / ${chs.length}`);
console.log(`Failed:                           ${failCount} / ${chs.length}`);
console.log('========================================');

