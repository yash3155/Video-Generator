// scripts/fetch_hull_ch09_context.mjs
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const NOTEBOOK_ID = 'c10a8b30-fee8-4d92-9d2c-516bc8866bad';
const NLM_EXE = 'C:\\Users\\YashAggarwal\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\nlm.exe';

const chKey = 'ch09_part1';
const query = `Extract all authoritative facts, definitions, formulas, payoff equations, and numerical case studies from John C. Hull Chapter 9 Part 1 on:
1. Call and Put options basics and definitions (European vs American).
2. The four basic option payoff profiles: Long Call (max(S_T - K, 0)), Short Call (-max(S_T - K, 0)), Long Put (max(K - S_T, 0)), Short Put (-max(K - S_T, 0)).
3. Distinction between gross payoff and net profit (accounting for premium c or p).
4. Moneyness definitions: In-the-Money (ITM), At-the-Money (ATM), Out-of-the-Money (OTM) for calls and puts.
5. Contract specifications: Strike price intervals, expiration months, position limits, exercise limits.
6. Stock splits and dividend adjustments (how strike and number of shares are adjusted for N-for-M splits and stock dividends).
7. Business Snapshot 9.1: The Gucci Group Takeover and options adjustments.
Include exact formulas, numerical examples, and quotes.`;

async function main() {
  console.log(`Querying NotebookLM for Hull ${chKey}...`);
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chKey}`);
  const enDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chKey}`);

  fs.mkdirSync(hindiDir, { recursive: true });
  fs.mkdirSync(enDir, { recursive: true });

  const hindiFile = path.join(hindiDir, 'notebook_context.txt');
  const enFile = path.join(enDir, 'notebook_context.txt');

  const res = spawnSync(
    NLM_EXE,
    ['query', 'notebook', NOTEBOOK_ID, query, '--new-conversation', '--json'],
    { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024, timeout: 240000 }
  );

  if (res.status === 0 && res.stdout) {
    let answer = res.stdout;
    try {
      const parsed = JSON.parse(res.stdout);
      answer = parsed.answer || res.stdout;
    } catch {}
    fs.writeFileSync(hindiFile, answer, 'utf8');
    fs.writeFileSync(enFile, answer, 'utf8');
    console.log(`✅ Saved ${answer.length} chars to notebook_context.txt!`);
  } else {
    console.error(`❌ Failed:`, res.stderr || res.stdout);
  }
}

main().catch(console.error);

