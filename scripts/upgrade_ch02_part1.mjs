import fs from 'fs';

const rawPath = 'src/data/chapters/hull_derivatives/ch02_part1/episode_raw.json';
const ep = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

// 1. Fix subtitles > 16 words
const subFixes = {
  b06: 'With no nearby auction until Tuesday, the firm housed and fed 80,000 pounds for a week.',
  b18: 'Contract sizes are standardized: CME Cattle is 40,000 lbs, and E-mini Nasdaq is 20 times index.',
  b32: 'Traders short futures at 412 and buy spot at 400, pocketing 12 cents risk-free.',
};

ep.scenes.forEach((s) => {
  s.beats.forEach((b) => {
    if (subFixes[b.id]) {
      b.en_subtitle = subFixes[b.id];
    }
  });
});

// 2. Fix Scene 4: Calculating Futures Gain & Loss (formula_breakdown)
const sc4 = ep.scenes[4];
sc4.badge = 'John C. Hull · Contract PnL Mechanics';

sc4.beats[0].ui_state = {
  title: 'Long Futures Gain & Loss Mechanics',
  badge: 'John C. Hull · Section 2.1',
  subtitle: 'Cash Settlement for Long Futures Contracts',
  expression: '\\text{PnL}_{\\text{Long}} = Q \\cdot (F_t - F_0)',
  purpose: 'Calculate cash gain or loss on an exchange-standard long futures position',
  variables: [
    {
      symbol: 'Q',
      label: 'Contract Size',
      value: '40,000 lbs',
      unit: 'lbs/contract',
      description: 'Physical commodity quantity or index multiplier',
    },
    {
      symbol: 'F_t',
      label: 'Exit Futures Price',
      value: '1.4500',
      unit: 'USD/lb',
      description: 'Price at which long position is closed or settled',
    },
    {
      symbol: 'F_0',
      label: 'Entry Futures Price',
      value: '1.4000',
      unit: 'USD/lb',
      description: 'Initial agreed transaction price on exchange',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'Initial Contract Position',
      equation: 'F_0 = \\$1.4000/\\text{lb} \\quad (Q = 40,000\\text{ lbs})',
      note: 'Long position entered at initial market quote',
    },
    {
      stepIndex: 1,
      label: 'Market Price Movement',
      equation: '\\Delta F = F_t - F_0 = +\\$0.0500/\\text{lb}',
      note: 'Futures price rises above entry level',
    },
    {
      stepIndex: 2,
      label: 'Net Cash Settlement',
      equation: '\\text{PnL} = 40,000 \\cdot (\\$1.45 - \\$1.40) = +\\$2,000',
      note: 'Immediate cash credit credited to margin balance',
    },
  ],
  activeStepIndex: 2,
  assumptions: [
    'Exchange standard contract specifications',
    'Daily marking to market across trading days',
  ],
  interpretation:
    'A price rise (F_t > F_0) generates positive cash flow; a price decline incurs a margin cash debit.',
};
sc4.beats[0].visual = {
  kind: 'formula',
  data: sc4.beats[0].ui_state,
  semantics: {
    teachingObjective: 'Define standardized PnL equation for long futures contracts',
    sourceFactIds: ['fact-05'],
  },
};

sc4.beats[1].ui_state = {
  title: 'Short Futures Gain & Loss Mechanics',
  badge: 'John C. Hull · Section 2.1',
  subtitle: 'Cash Settlement for Short Futures Contracts',
  expression: '\\text{PnL}_{\\text{Short}} = Q \\cdot (F_0 - F_t)',
  purpose: 'Calculate cash gain or loss on an exchange-standard short futures position',
  variables: [
    {
      symbol: 'Q',
      label: 'Contract Size',
      value: '5,000 bu',
      unit: 'bushels',
      description: 'Standard grain contract size (CME Corn)',
    },
    {
      symbol: 'F_0',
      label: 'Entry Short Price',
      value: '4.2000',
      unit: 'USD/bu',
      description: 'Futures price where short agreement was opened',
    },
    {
      symbol: 'F_t',
      label: 'Exit Buying Price',
      value: '4.0500',
      unit: 'USD/bu',
      description: 'Futures price where position was bought back to close',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'Initial Short Position',
      equation: 'F_0 = \\$4.2000/\\text{bu} \\quad (Q = 5,000\\text{ bu})',
      note: 'Short entered at agreed delivery price',
    },
    {
      stepIndex: 1,
      label: 'Market Price Decline',
      equation: 'F_0 - F_t = \\$4.20 - \\$4.05 = +\\$0.1500/\\text{bu}',
      note: 'Falling price benefits short position holder',
    },
    {
      stepIndex: 2,
      label: 'Net Cash Settlement',
      equation: '\\text{PnL} = 5,000 \\cdot (\\$4.20 - \\$4.05) = +\\$750',
      note: 'Profit credited directly to short trader account',
    },
  ],
  activeStepIndex: 2,
  assumptions: [
    'Exchange standard contract specifications',
    'Timely offset executed before first notice day',
  ],
  interpretation:
    'For shorts, falling prices deliver cash gains, while rising prices produce margin cash debits.',
};
sc4.beats[1].visual = {
  kind: 'formula',
  data: sc4.beats[1].ui_state,
  semantics: {
    teachingObjective: 'Define standardized PnL equation for short futures contracts',
    sourceFactIds: ['fact-05'],
  },
};

sc4.beats[2].ui_state = {
  title: 'Cumulative Futures Cash Flow & Offset',
  badge: 'John C. Hull · Section 2.1',
  subtitle: 'Early Offset Replaces Physical Delivery',
  expression: '\\text{Cash Flow} = \\sum [Q \\cdot \\Delta F]',
  purpose: 'Demonstrate cumulative cash settlement achieved through early offsetting trades',
  variables: [
    {
      symbol: 'Q',
      label: 'Contract Size Multiplier',
      value: 'Fixed Scale',
      unit: 'units',
      description: 'Uniform exchange-standard specification',
    },
    {
      symbol: '\\Delta F_i',
      label: 'Daily Price Delta',
      value: 'Settlement Delta',
      unit: 'USD/unit',
      description: 'Daily marking-to-market variation',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'Early Offsetting Principle',
      equation: '\\text{Long} + \\text{Short (Same Month)} = 0',
      note: 'Clearinghouse cancels mutual obligations',
    },
    {
      stepIndex: 1,
      label: 'Cash Flow Equivalence',
      equation: '\\sum \\Delta F_i = F_{\\text{exit}} - F_{\\text{entry}}',
      note: 'Net sum of daily MTM equals terminal price delta',
    },
  ],
  activeStepIndex: 1,
  assumptions: [
    'Over 99% of futures contracts are closed out prior to delivery',
    'Offset executes in identical contract month and exchange',
  ],
  interpretation:
    'Closing early via an equal opposite transaction captures exact net cash delta without physical delivery burden.',
};
sc4.beats[2].visual = {
  kind: 'formula',
  data: sc4.beats[2].ui_state,
  semantics: {
    teachingObjective: 'Show cumulative cash flow equivalence and offset mechanics',
    sourceFactIds: ['fact-05'],
  },
};

// 3. Fix Scene 7: Tug of war badge
const sc7 = ep.scenes[7];
sc7.badge = 'HYPOTHETICAL DESK EXAMPLE · LAW OF ONE PRICE';
sc7.beats.forEach((b) => {
  b.ui_state.badge = 'HYPOTHETICAL DESK EXAMPLE';
  b.visual = {
    kind: 'comparison',
    data: b.ui_state,
    semantics: {
      teachingObjective:
        'Illustrate spot-futures convergence pressure using hypothetical desk pricing example',
      sourceFactIds: ['fact-04', 'fact-10'],
    },
  };
});

// 4. Fix Scene 8: Visualizing Convergence & Arbitrage Profit (formula_breakdown)
const sc8 = ep.scenes[8];
sc8.badge = 'John C. Hull · Section 2.3 Arbitrage Proof';

sc8.beats[0].ui_state = {
  title: 'Maturity Arbitrage Profit Equation',
  badge: 'John C. Hull · Section 2.3',
  subtitle: 'Delivery-Period Discrepancy Arbitrage',
  expression: '\\text{Profit}_{\\text{Arb}} = Q \\cdot (F_T - S_T) > 0',
  purpose: 'Prove risk-free profit potential if futures price exceeds spot during delivery period',
  variables: [
    {
      symbol: 'Q',
      label: 'Contract Size',
      value: '5,000 bu',
      unit: 'bushels',
      description: 'Commodity physical delivery quantity',
    },
    {
      symbol: 'F_T',
      label: 'Maturity Futures Price',
      value: '$4.12',
      unit: 'USD/bu',
      description: 'Overvalued futures price during delivery window',
    },
    {
      symbol: 'S_T',
      label: 'Maturity Spot Price',
      value: '$4.00',
      unit: 'USD/bu',
      description: 'Cash commodity purchase price in spot market',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'Price Divergence Observed',
      equation: 'F_T > S_T \\quad (\\$4.12 > \\$4.00)',
      note: 'Futures trades at premium during delivery window',
    },
    {
      stepIndex: 1,
      label: 'Simultaneous Arbitrage Execution',
      equation: '\\text{Buy Spot } S_T + \\text{Sell Futures } F_T',
      note: 'Immediately stand to deliver spot into futures',
    },
    {
      stepIndex: 2,
      label: 'Locked Profit Calculation',
      equation: '\\text{Profit} = 5,000 \\cdot (\\$4.12 - \\$4.00) = +\\$600',
      note: 'Riskless profit captured via physical delivery',
    },
  ],
  activeStepIndex: 2,
  assumptions: ['Delivery window active', 'Zero storage or transport penalty during window'],
  interpretation:
    'Arbitrageurs short overvalued futures, purchase physical spot commodity, and deliver to pocket riskless spread.',
};
sc8.beats[0].visual = {
  kind: 'formula',
  data: sc8.beats[0].ui_state,
  semantics: {
    teachingObjective: 'Demonstrate mathematical arbitrage profit when futures exceeds spot at maturity',
    sourceFactIds: ['fact-04', 'fact-10'],
  },
};

sc8.beats[1].ui_state = {
  title: 'Mathematical Limit of Basis Convergence',
  badge: 'Law of One Price',
  subtitle: 'Asymptotic Collapse of Spot-Futures Basis',
  expression: '\\lim_{t \\to T} |F_t - S_t| = 0',
  purpose: 'Model mathematical convergence of futures price to spot price as time reaches maturity',
  variables: [
    {
      symbol: 't \\to T',
      label: 'Time Horizon',
      value: 'Expiry Approach',
      unit: 'days',
      description: 'Holding time reaches final contract settlement',
    },
    {
      symbol: '|F_t - S_t|',
      label: 'Absolute Basis Gap',
      value: 'Collapses to $0.00',
      unit: 'USD/unit',
      description: 'Difference between futures quote and cash price',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'Arbitrage Pressure Applied',
      equation: '\\text{Heavy Selling of } F_t \\implies F_t \\downarrow',
      note: 'Arbitrageurs dump overvalued futures',
    },
    {
      stepIndex: 1,
      label: 'Spot Buying Pressure',
      equation: '\\text{Heavy Buying of } S_t \\implies S_t \\uparrow',
      note: 'Arbitrageurs buy physical commodity to deliver',
    },
    {
      stepIndex: 2,
      label: 'Terminal Convergence',
      equation: '|F_T - S_T| = 0 \\implies F_T = S_T',
      note: 'Law of one price fully re-established',
    },
  ],
  activeStepIndex: 2,
  assumptions: [
    'Competitive algorithmic arbitrageurs active in market',
    'Standard exchange delivery mechanism enforceable',
  ],
  interpretation:
    'Selling overvalued futures and buying physical goods drives basis to zero as expiration is reached.',
};
sc8.beats[1].visual = {
  kind: 'formula',
  data: sc8.beats[1].ui_state,
  semantics: {
    teachingObjective: 'Illustrate mathematical limit of basis convergence driven by arbitrage',
    sourceFactIds: ['fact-04'],
  },
};

sc8.beats[2].ui_state = {
  title: 'The Legal Delivery Price Anchor',
  badge: 'John C. Hull · Section 2.3',
  subtitle: 'Physical Delivery Enforces Contract Integrity',
  expression: 'F_T = S_T \\quad (\\text{At Expiration})',
  purpose: 'Highlight the delivery option as the fundamental anchor linking financial futures to real economy',
  variables: [
    {
      symbol: 'F_T',
      label: 'Terminal Futures Price',
      value: 'Market Close',
      unit: 'USD/unit',
      description: 'Final exchange closing settlement',
    },
    {
      symbol: 'S_T',
      label: 'Terminal Spot Price',
      value: 'Physical Cash Price',
      unit: 'USD/unit',
      description: 'Real-world spot value of physical commodity',
    },
  ],
  steps: [
    {
      stepIndex: 0,
      label: 'The 1% Paradox',
      equation: '\\text{Deliveries} < 1\\% \\text{ of volume}',
      note: 'Almost all traders close out early',
    },
    {
      stepIndex: 1,
      label: 'The Invisible Anchor',
      equation: '\\text{Legal Delivery Option} \\implies F_T = S_T',
      note: 'The threat of delivery enforces 100% price parity',
    },
  ],
  activeStepIndex: 1,
  assumptions: [
    'Contract specifications clearly define delivery terms and locations',
    'Clearinghouse guarantees delivery performance without credit default',
  ],
  interpretation:
    'Even though physical deliveries account for under 1% of volume, the legal delivery right ties paper markets to physical reality.',
};
sc8.beats[2].visual = {
  kind: 'formula',
  data: sc8.beats[2].ui_state,
  semantics: {
    teachingObjective: 'Explain why delivery mechanism anchors paper contracts to real economy',
    sourceFactIds: ['fact-04', 'fact-10'],
  },
};

// 5. Update Scene 11 summary_thread with compactOverview on last beat
const sc11 = ep.scenes[11];
sc11.beats.forEach((b, idx) => {
  const isFinalOverview = idx === sc11.beats.length - 1;
  b.ui_state.compactOverview = isFinalOverview;
  b.visual = {
    kind: 'summary',
    data: b.ui_state,
    semantics: {
      teachingObjective: 'Synthesize chapter core principles with progressive focus and compact overview',
      sourceFactIds: ['fact-01', 'fact-04', 'fact-07', 'fact-10'],
    },
  };
});

fs.writeFileSync(rawPath, JSON.stringify(ep, null, 2), 'utf8');
console.log('Successfully updated ch02_part1 episode_raw.json!');
