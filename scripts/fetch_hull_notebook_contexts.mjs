// scripts/fetch_hull_notebook_contexts.mjs
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const NOTEBOOK_ID = 'c10a8b30-fee8-4d92-9d2c-516bc8866bad';
const NLM_EXE = 'C:\\Users\\YashAggarwal\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\nlm.exe';

const CHAPTER_QUERIES = [
  {
    key: 'ch04_part1',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 4 Part 1 on: Treasury, LIBOR, Repo, and OIS Risk-Free Rates, Continuous Compounding vs Discrete Compounding (Rc = m*ln(1 + Rm/m)), Zero Rates, Bond Pricing (P = sum c*e^(-r_i*t_i) + M*e^(-r_n*t_n)), and Bootstrap Zero-Curve Construction step-by-step table. Include exact numbers, formulas, contract examples, and citations.'
  },
  {
    key: 'ch04_part2',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 4 Part 2 on: Forward Interest Rates (R_F = (R2*T2 - R1*T1)/(T2 - T1)), Forward Rate Agreements (FRAs, payoff formula L*(R_K - R_M)*(T2 - T1)/(1 + R_M*(T2 - T1))), Theories of the Term Structure (Expectations Theory, Market Segmentation, Liquidity Preference Theory), Business Snapshot 4.1 on Orange County bankruptcy (Bob Citron, inverse floaters, 1.6 billion loss), and Business Snapshot 4.2 on the 2007-2009 Liquidity Freeze and LIBOR-OIS spread. Include exact numbers, formulas, and citations.'
  },
  {
    key: 'ch05_part1',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 5 Part 1 on: Investment vs Consumption Assets, Short Selling Mechanics (borrowing shares, paying dividends, short squeeze), No-Arbitrage Forward Pricing (F0 = S0*e^(rT)), Known Cash Income (F0 = (S0 - I)*e^(rT)), Known Dividend Yield (F0 = S0*e^((r-q)T)), Business Snapshot 5.1 on Kidder Peabody (Joseph Jett phantom profits), and Business Snapshot 5.2 on A Systems Error. Include exact numbers, formulas, and citations.'
  },
  {
    key: 'ch05_part2',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 5 Part 2 on: Valuing Forward Contracts Mid-Life (f = S0 - K*e^(-rT)), Stock Index Futures & Index Arbitrage (program trading, triple witching hour, October 1987 crash Business Snapshot 5.4), Currency Forwards (Interest Rate Parity F0 = S0*e^((r - r_f)T)), Commodity Cost of Carry & Convenience Yield (F0 = S0*e^((r + u - y)T)). Include exact numbers, formulas, and citations.'
  },
  {
    key: 'ch06_part1',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 6 Part 1 on: Day Count Conventions (Actual/Actual vs 30/360, Business Snapshot 6.1 The Day Count Trap), Treasury Bond Futures, Conversion Factors, Clean vs Dirty/Cash Bond Price (Cash = Quoted + Accrued Interest), Cheapest-to-Deliver (CTD) Bond formula (Quoted Price - Futures Price * CF), and The Wild Card Play (Business Snapshot 6.2). Include exact numbers, formulas, and citations.'
  },
  {
    key: 'ch06_part2',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 6 Part 2 on: Eurodollar Futures / SOFR futures, Convexity Adjustments (Forward = Futures - 0.5*sigma^2*T1*T2), Macaulay Duration, Modified Duration (D* = D/(1 + y/m)), Duration-Based Hedging Ratio (N* = (P*D_P)/(V_F*D_F)), and Bank Asset-Liability Management (Business Snapshot 6.3). Include exact numbers, formulas, and citations.'
  },
  {
    key: 'ch07_part1',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 7 Part 1 on: Mechanics of Plain Vanilla Interest Rate Swaps, Transforming a Floating Rate Liability to Fixed Rate, Transforming Assets, The Comparative-Advantage Argument (Quality Spread Differential), Role of Financial Intermediary (bank spread), and Valuation of Interest Rate Swaps using Forward Rates and OIS Discounting. Include exact numbers, formulas, and citations.'
  },
  {
    key: 'ch07_part2',
    query: 'Extract all authoritative facts, definitions, numerical examples, formulas, tables, and case studies from John C. Hull Chapter 7 Part 2 on: Fixed-for-Fixed Currency Swaps (principal exchange at inception and maturity at spot rate), Comparative Advantage in Foreign Borrowing, Valuation of Currency Swaps as Bond Portfolios (V_swap = B_B - S0*B_A) and Forward FX Contracts, Credit Risk Asymmetry (why currency swaps have more credit risk than IRS), Credit Default Swaps (CDS, default payoff (1 - R)*Notional), and The Hammersmith and Fulham Local Authority Swap Scandal (Business Snapshot 7.2, ultra vires nullification). Include exact numbers, formulas, and citations.'
  }
];

async function main() {
  console.log(`\n======================================================`);
  console.log(`📚 FETCHING AUTHORITATIVE NOTEBOOK CONTEXTS VIA NOTEBOOKLM`);
  console.log(`   Notebook: ${NOTEBOOK_ID}`);
  console.log(`   Chapters to Process: ${CHAPTER_QUERIES.length}`);
  console.log(`======================================================\n`);

  for (const item of CHAPTER_QUERIES) {
    const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${item.key}`);
    const enDir = path.resolve(`src/data/chapters/hull_derivatives_en/${item.key}`);

    fs.mkdirSync(hindiDir, { recursive: true });
    fs.mkdirSync(enDir, { recursive: true });

    const hindiFile = path.join(hindiDir, 'notebook_context.txt');
    const enFile = path.join(enDir, 'notebook_context.txt');

    if (fs.existsSync(hindiFile) && fs.statSync(hindiFile).size > 500) {
      console.log(`✅ [SKIP] ${item.key} already has valid notebook_context.txt (${fs.statSync(hindiFile).size} bytes)`);
      if (!fs.existsSync(enFile)) {
        fs.copyFileSync(hindiFile, enFile);
      }
      continue;
    }

    console.log(`🔍 [QUERYING] ${item.key} from NotebookLM...`);
    try {
      const res = spawnSync(
        NLM_EXE,
        ['query', 'notebook', NOTEBOOK_ID, item.query, '--new-conversation', '--json'],
        { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, timeout: 180000 }
      );

      if (res.status === 0 && res.stdout && res.stdout.length > 200) {
        fs.writeFileSync(hindiFile, res.stdout, 'utf8');
        fs.writeFileSync(enFile, res.stdout, 'utf8');
        console.log(`   -> ✅ Saved ${res.stdout.length} chars to ${item.key}/notebook_context.txt (Hindi & English)!`);
      } else {
        console.error(`   ❌ Failed for ${item.key}. Status: ${res.status}. Stderr: ${res.stderr}`);
      }
    } catch (err) {
      console.error(`❌ Exception querying NotebookLM for ${item.key}:`, err.message);
    }
  }

  console.log(`\n🎉 All missing notebook contexts successfully processed!\n`);
}

main();
