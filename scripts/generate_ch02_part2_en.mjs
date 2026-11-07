import fs from 'fs';
import path from 'path';

const targetDir = 'src/data/chapters/hull_derivatives_en/ch02_part2';
fs.mkdirSync(targetDir, { recursive: true });

// 1. Lesson Plan
const lessonPlan = {
  schemaVersion: '1.0.0',
  chapterSlug: 'ch02_part2',
  title: 'Operation of Margin Accounts, Marking-to-Market, and Clearing Mechanics',
  targetAudiencePersona: 'Finance Students & Global Derivatives Traders',
  prerequisites: [
    'Futures contract definition and standardized specifications',
    'Long vs short position mechanics and basic PnL calculation',
  ],
  learningOutcomes: [
    'Explain the operation of futures margin accounts and the 75% maintenance threshold rule',
    'Calculate daily marking-to-market settlements, margin account balances, and variation margin calls',
    'Contrast central counterparty (CCP) clearing with bilateral OTC clearing, ISDA agreements, and collateral haircuts',
    'Analyze the systemic collapse of Long-Term Capital Management ($4B loss) driven by extreme leverage and collateral drains',
  ],
  sections: [
    {
      sectionIndex: 0,
      title: 'The Purpose and Operation of Margin Accounts',
      pedagogicalObjective: 'Explain why futures exchanges require performance bond deposits to eliminate party default risk.',
      groundedFactIds: ['fact-01', 'fact-02'],
      keyPoints: [
        'Margin accounts act as collateral performance bonds rather than borrowed money loans.',
        'Long and short positions face symmetric margin requirements set by the clearinghouse.',
        'Brokers accept Treasury bills at 90% face value and shares at 50% market value as initial collateral.',
      ],
    },
    {
      sectionIndex: 1,
      title: 'Daily Settlement and Marking to Market (MTM)',
      pedagogicalObjective: 'Master the end-of-day re-pricing mechanism that resets contract values to zero daily.',
      groundedFactIds: ['fact-03', 'fact-04'],
      keyPoints: [
        'Each trading day, contracts are settled at closing price and rewritten at the new settlement level.',
        'Daily profits are credited in cash to the winning account; losses are debited immediately.',
        'Maintenance margin is set at approximately 75% of initial margin to absorb daily volatility.',
      ],
    },
    {
      sectionIndex: 2,
      title: 'Example 2.1: 16-Day Gold Futures Margin Walkthrough',
      pedagogicalObjective: 'Follow day-by-day cash flows in a 200 oz gold position to calculate exact margin call obligations.',
      groundedFactIds: ['fact-04', 'fact-05'],
      keyPoints: [
        'Two gold contracts require $12,000 initial margin and $9,000 maintenance margin.',
        'On Day 7, gold drops to $1,226.90, dipping account balance to $7,380 ($1,620 below maintenance).',
        'Crucial rule: The investor must deposit $4,620 variation margin to restore balance to initial $12,000.',
      ],
    },
    {
      sectionIndex: 3,
      title: 'Central Counterparty (CCP) vs Bilateral OTC Clearing',
      pedagogicalObjective: 'Contrast clearinghouse multilateral netting and default funds with OTC bilateral ISDA CSA rules.',
      groundedFactIds: ['fact-06', 'fact-07', 'fact-08'],
      keyPoints: [
        'CCPs act as legal counterparty to every trade through novation, eliminating bilateral credit risk.',
        'Bilateral OTC trades rely on ISDA master agreements and Credit Support Annexes with collateral thresholds.',
        'Post-2008 Dodd-Frank and Basel regulations mandate standardized OTC derivatives clear through CCPs.',
      ],
    },
    {
      sectionIndex: 4,
      title: 'Business Snapshot 2.2: The LTCM $4B Collapse',
      pedagogicalObjective: 'Demonstrate how excessive leverage and flight-to-quality spread widening caused $4B in liquidation losses.',
      groundedFactIds: ['fact-09'],
      keyPoints: [
        'LTCM traded convergence arbitrage, assuming liquid and illiquid bond spreads would narrow.',
        'The August 1998 Russian debt default triggered a flight to quality, blowing spreads wide open.',
        'LTCM suffered simultaneous collateral drains on both legs, forcing fire-sale liquidation of $4 billion.',
      ],
    },
  ],
  misconceptions: [
    {
      misconception: 'A margin call only requires depositing enough money to get back above the maintenance margin.',
      factId: 'fact-04',
      authorRebuttal: 'John C. Hull emphasizes that when a margin call occurs, the investor must deposit variation margin to bring the account balance all the way back up to the INITIAL margin level, not merely the maintenance level.',
    },
    {
      misconception: 'Short futures positions require borrowing the underlying asset like stock short sales.',
      factId: 'fact-01',
      authorRebuttal: 'In futures markets, entering a short position is completely symmetric to entering a long position, requiring identical initial margin with no borrowing of physical goods.',
    },
  ],
  activeRecallQuiz: {
    scenario: 'An investor enters 2 gold futures contracts (200 oz total). Initial margin is $6,000/contract ($12,000 total) and maintenance margin is $4,500/contract ($9,000 total). After adverse price moves, the account balance drops to $7,800.',
    testedFactIds: ['fact-04', 'fact-05'],
    question: 'How much variation margin cash must the investor deposit by the close of the next business day?',
    correctAnswer: '$4,200 (to restore the account balance back to the initial margin of $12,000)',
    explanation: 'Because the $7,800 balance is below the $9,000 maintenance margin, a margin call is triggered. The variation margin required is $12,000 - $7,800 = $4,200, restoring the account to the full initial margin.',
  },
  coreTakeaways: [
    'Margin accounts and daily marking-to-market eliminate default risk in futures trading.',
    'Maintenance margin is typically 75% of initial margin; a margin call requires restoring balance to 100% of initial margin.',
    'Over 99% of futures avoid delivery because daily cash settlement continuously resolves obligations.',
    'LTCM collapsed because high leverage left zero buffer when flight to quality triggered collateral calls on both sides.',
  ],
};

// 2. Storyboard
const storyboard = {
  schemaVersion: '1.0.0',
  chapterSlug: 'ch02_part2',
  course: 'hull_derivatives_en',
  chapterTitle: 'Operation of Margin Accounts, Marking-to-Market, and Clearing Mechanics',
  approvedFactIds: [
    'fact-01',
    'fact-02',
    'fact-03',
    'fact-04',
    'fact-05',
    'fact-06',
    'fact-07',
    'fact-08',
    'fact-09',
  ],
  scenes: [
    {
      sceneIndex: 0,
      title: 'The Margin Call Shock',
      template: 'chat_story',
      concept: 'Alex experiences an adverse gold futures move and learns how initial and maintenance margins work.',
      sourceFactIds: ['fact-01', 'fact-04', 'fact-05'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Alex notices an $1,800 loss on Day 1 of his 2 gold futures contracts.', sourceFactIds: ['fact-01', 'fact-05'] },
        { beatIndex: 1, textOutline: 'Marcus explains the $9,000 maintenance margin threshold and why no call was issued yet.', sourceFactIds: ['fact-04'] },
        { beatIndex: 2, textOutline: 'Marcus warns of the rule: violating maintenance margin requires full top-up to initial margin.', sourceFactIds: ['fact-04', 'fact-05'] },
      ],
    },
    {
      sceneIndex: 1,
      title: "LTCM's $4 Billion Collapse",
      template: 'stat_counter',
      concept: 'The 1998 Russian default triggered extreme collateral calls, wiping out Long-Term Capital Management.',
      sourceFactIds: ['fact-09'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Highlight LTCM massive convergence arbitrage scale and extreme leverage.', sourceFactIds: ['fact-09'] },
        { beatIndex: 1, textOutline: 'Explain the 1998 Russian default flight to quality widening bond spreads.', sourceFactIds: ['fact-09'] },
        { beatIndex: 2, textOutline: 'Show how simultaneous collateral outflows forced liquidation, losing $4 billion.', sourceFactIds: ['fact-09'] },
      ],
    },
    {
      sceneIndex: 2,
      title: 'The 4 Pillars of Margin Accounts',
      template: 'progressive_cards',
      concept: 'The core architecture protecting exchange participants from contract defaults.',
      sourceFactIds: ['fact-01', 'fact-03', 'fact-04'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Pillar 1: Initial Margin as upfront performance bond.', sourceFactIds: ['fact-01'] },
        { beatIndex: 1, textOutline: 'Pillar 2: Marking to market and daily contract value reset.', sourceFactIds: ['fact-03'] },
        { beatIndex: 2, textOutline: 'Pillar 3: Maintenance margin set at 75% of initial margin.', sourceFactIds: ['fact-04'] },
        { beatIndex: 3, textOutline: 'Pillar 4: Variation margin cash top-up mechanics.', sourceFactIds: ['fact-04'] },
      ],
    },
    {
      sceneIndex: 3,
      title: 'CCPs vs Bilateral OTC Clearing',
      template: 'split_comparison',
      concept: 'Contrast exchange central counterparty novation with OTC ISDA Credit Support Annex agreements.',
      sourceFactIds: ['fact-06', 'fact-07', 'fact-08'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Explain central clearinghouse novation and multilateral netting.', sourceFactIds: ['fact-06', 'fact-07'] },
        { beatIndex: 1, textOutline: 'Examine bilateral OTC credit risk, ISDA master contracts, and CSA terms.', sourceFactIds: ['fact-07'] },
        { beatIndex: 2, textOutline: 'Highlight the post-2008 regulatory shift mandating standardized OTC central clearing.', sourceFactIds: ['fact-07', 'fact-08'] },
      ],
    },
    {
      sceneIndex: 4,
      title: '16-Day Gold Margin Account Walkthrough',
      template: 'data_visualizer',
      concept: 'Detailed numerical tracking of Example 2.1 in John C. Hull across 16 trading days.',
      sourceFactIds: ['fact-04', 'fact-05'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Establish starting parameters: 2 contracts, $12,000 initial margin, $9,000 maintenance.', sourceFactIds: ['fact-04', 'fact-05'] },
        { beatIndex: 1, textOutline: 'Track Day 7 drop to $1,226.90, dipping balance to $7,380 and issuing a $4,620 call.', sourceFactIds: ['fact-05'] },
        { beatIndex: 2, textOutline: 'Demonstrate Day 8 deposit restoring balance to $12,000 initial margin.', sourceFactIds: ['fact-05'] },
      ],
    },
    {
      sceneIndex: 5,
      title: 'Variation Margin & Threshold Formula',
      template: 'formula_breakdown',
      concept: 'Mathematical formula governing daily account balance updates and variation margin calls.',
      sourceFactIds: ['fact-04', 'fact-05'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'State the daily balance accumulation equation with price deltas.', sourceFactIds: ['fact-04'] },
        { beatIndex: 1, textOutline: 'Formalize the margin call trigger condition and top-up calculation.', sourceFactIds: ['fact-04', 'fact-05'] },
        { beatIndex: 2, textOutline: 'Interpret why restoration goes to initial margin rather than maintenance.', sourceFactIds: ['fact-04'] },
      ],
    },
    {
      sceneIndex: 6,
      title: 'Collateral Valuation & Haircuts',
      template: 'tug_of_war',
      concept: 'Haircuts applied to non-cash securities deposited to meet initial margin requirements.',
      sourceFactIds: ['fact-02'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Show cash deposited receives full value and earns overnight interest.', sourceFactIds: ['fact-02'] },
        { beatIndex: 1, textOutline: 'Explain Treasury bills accepted at 90% of face value (10% haircut).', sourceFactIds: ['fact-02'] },
        { beatIndex: 2, textOutline: 'Contrast with shares accepted at 50% of market value (50% haircut).', sourceFactIds: ['fact-02'] },
      ],
    },
    {
      sceneIndex: 7,
      title: 'Active Recall: Variation Margin Calculation',
      template: 'interactive_quiz',
      concept: 'Learner scenario testing variation margin calculation under Hull 75% rule.',
      sourceFactIds: ['fact-04', 'fact-05'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Present problem: balance at $7,800, initial $12,000, maintenance $9,000.', sourceFactIds: ['fact-04', 'fact-05'] },
        { beatIndex: 1, textOutline: 'Allow 3-second pause for learner reflection.', sourceFactIds: ['fact-04'] },
        { beatIndex: 2, textOutline: 'Reveal correct answer: $4,200 cash deposit required.', sourceFactIds: ['fact-04', 'fact-05'] },
      ],
    },
    {
      sceneIndex: 8,
      title: "Trader's Risk & Margin Checklist",
      template: 'chat_story',
      concept: 'Alex and Marcus establish institutional risk rules to avoid liquidation.',
      sourceFactIds: ['fact-01', 'fact-04', 'fact-06'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Rule 1: Always maintain a cash buffer beyond initial margin.', sourceFactIds: ['fact-01'] },
        { beatIndex: 1, textOutline: 'Rule 2: Prepare for full initial margin restoration when calls arrive.', sourceFactIds: ['fact-04'] },
        { beatIndex: 2, textOutline: 'Rule 3: Understand automatic forced close-out occurs if calls are unmet.', sourceFactIds: ['fact-06'] },
      ],
    },
    {
      sceneIndex: 9,
      title: "Today's Thread: Chapter 2 Part 2 Summary",
      template: 'summary_thread',
      concept: 'Synthesize chapter principles into progressive 2-item reveal and whole-chapter overview grid.',
      sourceFactIds: ['fact-01', 'fact-03', 'fact-04', 'fact-07', 'fact-09'],
      beatOutlines: [
        { beatIndex: 0, textOutline: 'Review Steps 1 & 2: Purpose of margins and daily marking-to-market.', sourceFactIds: ['fact-01', 'fact-03'] },
        { beatIndex: 1, textOutline: 'Review Steps 3 & 4: 75% maintenance rule and full initial top-up requirement.', sourceFactIds: ['fact-04'] },
        { beatIndex: 2, textOutline: 'Review Steps 5 & 6: CCP multilateral netting and collateral haircut schedules.', sourceFactIds: ['fact-02', 'fact-07'] },
        { beatIndex: 3, textOutline: 'Review Steps 7 & 8: LTCM leverage lessons and automated liquidation discipline.', sourceFactIds: ['fact-06', 'fact-09'] },
        { beatIndex: 4, textOutline: 'Display compact 2-column whole-chapter overview grid.', sourceFactIds: ['fact-01', 'fact-09'] },
        { beatIndex: 5, textOutline: 'Final takeaway: Margins ensure contract trust across global markets.', sourceFactIds: ['fact-01'] },
      ],
    },
  ],
  summarySteps: [
    'Margin accounts act as performance bonds ensuring traders never default on futures obligations.',
    'Daily marking to market settles gains and losses each afternoon, resetting contract value to zero.',
    'Maintenance margin is set at roughly 75% of initial margin to provide a safe buffer.',
    'A margin call requires depositing variation margin to restore the balance to 100% initial margin.',
    'Central clearinghouses (CCPs) eliminate counterparty risk through novation and multilateral netting.',
    'Brokers accept Treasury bills at 90% value and shares at 50% value as initial collateral.',
    'LTCM collapsed after $4 billion in losses when extreme leverage met simultaneous collateral calls.',
    'Failing to meet a variation margin call by next morning triggers automatic position liquidation.',
  ],
  bottomTakeaway: 'Margin accounts and daily marking-to-market are the foundation of futures market stability, transforming counterparty default risk into daily cash discipline.',
};

fs.writeFileSync(path.join(targetDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
fs.writeFileSync(path.join(targetDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
console.log('Successfully written lesson_plan.json and storyboard.json for ch02_part2 (English)!');
