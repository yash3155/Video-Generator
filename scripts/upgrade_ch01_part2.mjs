import fs from 'fs';

const rawPath = 'src/data/chapters/hull_derivatives/ch01_part2/episode_raw.json';
const ep = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

// 1. Fix subtitles > 16 words
const subFixes = {
  b25: 'Buying in NY and selling in London pushes prices rapidly toward cross-border parity.',
  b30: 'Compare $2,000 in stock ($20) versus 2,000 calls ($22.50 strike at $1) at $27 and $15.',
  b32: 'At $27, calls return $7,000 (10x stock); at $15, the entire $2,000 premium is lost.'
};

ep.scenes.forEach((s) => {
  s.beats.forEach((b) => {
    if (subFixes[b.id]) {
      b.en_subtitle = subFixes[b.id];
    }
  });
});

// 2. Fix Scene 7 FormulaBreakdown
const sc7 = ep.scenes[7];
sc7.badge = 'John C. Hull · Example 1.3';

sc7.beats[0].ui_state = {
  title: 'Cross-Border Dual-Listed Stock Arbitrage',
  badge: 'John C. Hull · Example 1.3',
  subtitle: 'Example 1.3 · Dual-Listed Stock in New York and London',
  expression: 'Profit = N · [(FX · P_{London}) - P_{NY}]',
  purpose: 'Lock in riskless profit from cross-market price discrepancies across currency borders',
  variables: [
    {
      symbol: 'P_{London}',
      label: 'London Price',
      value: '£100.00',
      unit: 'GBP/share',
      description: 'Stock price quoted on London exchange',
    },
    {
      symbol: 'FX',
      label: 'Exchange Rate',
      value: '1.5500',
      unit: 'USD/GBP',
      description: 'Spot exchange rate USD per GBP',
    },
    {
      symbol: 'P_{NY}',
      label: 'New York Price',
      value: '$152.00',
      unit: 'USD/share',
      description: 'Stock price quoted on NYSE',
    },
    {
      symbol: 'N',
      label: 'Share Quantity',
      value: '100',
      unit: 'shares',
      description: 'Arbitrage transaction volume',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'London USD Equivalent',
      equation: 'FX · P_{London} = 1.5500 · £100 = $155.00/sh',
      note: 'London price converted to USD',
    },
  ],
  activeStepIndex: 0,
  assumptions: ['Zero transaction costs', 'Instantaneous cross-border order execution'],
  interpretation:
    'London USD equivalent ($155) exceeds NY price ($152), creating an actionable $3.00/share spread.',
};
sc7.beats[0].visual = {
  kind: 'formula',
  data: sc7.beats[0].ui_state,
  semantics: {
    teachingObjective: 'Establish cross-border dual-listed pricing disparity formula',
    sourceFactIds: ['fact-09'],
  },
};

sc7.beats[1].ui_state = {
  title: 'Executing 100-Share Riskless Arbitrage',
  badge: 'John C. Hull · Example 1.3 Execution',
  subtitle: 'Simultaneous 100-Share Long NY & Short London Execution',
  expression: 'Profit = 100 · [($1.5500 · 100) - $152.00] = +$300.00',
  purpose: 'Simultaneous execution eliminates directional market risk across both exchanges',
  variables: [
    {
      symbol: 'London Sale',
      label: 'Cash Inflow',
      value: '£10,000 = $15,500',
      unit: 'USD',
      description: 'Proceeds from selling in London',
    },
    {
      symbol: 'NY Buy',
      label: 'Cash Outflow',
      value: '$15,200',
      unit: 'USD',
      description: 'Cost of purchasing in New York',
    },
    {
      symbol: 'Spread',
      label: 'Per-Share Gain',
      value: '$3.00',
      unit: 'USD/share',
      description: 'Gross spread captured',
    },
    {
      symbol: 'Net Profit',
      label: 'Total Cash Gain',
      value: '+$300.00',
      unit: 'USD',
      description: 'Riskless profit locked in',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'London USD Equivalent',
      equation: 'FX · P_{London} = 1.5500 · £100 = $155.00/sh',
      note: 'London price in USD',
    },
    {
      stepIndex: 1,
      label: 'Per-Share Spread',
      equation: 'Spread = $155.00 - $152.00 = $3.00/sh',
      note: 'Riskless spread per share',
    },
    {
      stepIndex: 2,
      label: 'Total Portfolio Gain',
      equation: 'Profit = 100 · $3.00 = +$300.00',
      note: 'Immediate risk-free locked profit',
    },
  ],
  activeStepIndex: 2,
  assumptions: [
    'Simultaneous order execution',
    'Zero borrowing or exchange settlement delay',
  ],
  interpretation:
    'Buy 100 shares in NY for $15,200 and sell 100 shares in London for $15,500 to net $300 profit instantly.',
};
sc7.beats[1].visual = {
  kind: 'formula',
  data: sc7.beats[1].ui_state,
  semantics: {
    teachingObjective: 'Demonstrate worked numerical profit calculation for dual-listed arbitrage',
    sourceFactIds: ['fact-09'],
  },
};

sc7.beats[2].ui_state = {
  title: 'Self-Correcting Market Equilibrium',
  badge: 'Law of One Price',
  subtitle: 'Arbitrage Order Flow Restores Market Efficiency',
  expression: 'P_{NY} ↑ + P_{London} ↓ ⇒ Arbitrage Spread → $0',
  purpose: 'Arbitrage order flow naturally restores equilibrium between separated markets',
  variables: [
    {
      symbol: 'NY Demand ↑',
      label: 'Buying Pressure in NY',
      value: 'Bids P_{NY} Up',
      unit: 'USD',
      description: 'Arbitrageurs buy in cheaper venue',
    },
    {
      symbol: 'UK Supply ↑',
      label: 'Selling Pressure in London',
      value: 'Pushes P_{London} Down',
      unit: 'GBP',
      description: 'Arbitrageurs sell in expensive venue',
    },
    {
      symbol: 'Equilibrium',
      label: 'Final Spread',
      value: '$0.00',
      unit: 'USD',
      description: 'Window closes rapidly',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'Equilibrium Condition',
      equation: 'P_{NY} = FX · P_{London}',
      note: 'No further arbitrage profit possible',
    },
  ],
  activeStepIndex: 0,
  assumptions: [
    'Liquid electronic markets',
    'Competitive algorithmic participants',
  ],
  interpretation:
    'Competitive buying in NY and selling in London forces prices to converge, closing the spread.',
};
sc7.beats[2].visual = {
  kind: 'formula',
  data: sc7.beats[2].ui_state,
  semantics: {
    teachingObjective: 'Show how arbitrage restores law of one price across financial markets',
    sourceFactIds: ['fact-09'],
  },
};

// 3. Fix Scene 11 SummaryThread
const sc11 = ep.scenes[11];
const conciseSteps = [
  'Call options give the right to buy; put options give the right to sell at strike price before expiration.',
  'Calls gain value as strikes fall; puts gain value as strikes rise; both gain value with longer maturity.',
  'Dec $550 calls cap loss at $2,900; writing Sept $525 puts risks large loss if stock falls below $480.',
  'Forwards lock exact future cashflows; protective puts establish a firm price floor while preserving upside.',
  'Futures provide large symmetric leverage with unlimited risk; options cap maximum downside to premium paid.',
  'Simultaneous cross-market trades capture riskless pricing discrepancies and restore the law of one price.',
  'Hedge funds charge management and incentive fees to deliver absolute returns across diverse macro strategies.',
  'Jerome Kerviel €4.9B loss demonstrates that internal controls must strictly enforce unauthorized trade limits.',
];

sc11.badge = '8-Step Synthesis';
const stepRanges = [
  [0, 0],
  [1, 2],
  [3, 4],
  [5, 6],
  [6, 7],
  [0, 7],
];

sc11.beats.forEach((b, idx) => {
  const isFinalOverview = idx === 5;
  b.ui_state = {
    headerBadge: 'CHAPTER 1 · PART 2 · COMPLETE SYNTHESIS',
    heading: isFinalOverview
      ? 'Master Takeaway: Chapter 1 · Part 2'
      : "Today's Thread: Core Principles",
    steps: conciseSteps,
    activeStepRange: stepRanges[idx],
    compactOverview: isFinalOverview,
  };
  b.visual = {
    kind: 'summary',
    data: b.ui_state,
    semantics: {
      teachingObjective:
        'Synthesize chapter core principles with progressive focus and compact overview',
      sourceFactIds: [
        'fact-09',
        'fact-11',
      ],
    },
  };
});

fs.writeFileSync(rawPath, JSON.stringify(ep, null, 2), 'utf8');
console.log('Successfully updated ch01_part2 episode_raw.json!');
