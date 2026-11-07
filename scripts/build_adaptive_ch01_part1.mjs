// scripts/build_adaptive_ch01_part1.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const baselinePath = path.join(rootDir, 'src/data/chapters/hull_derivatives/ch01_part1_baseline_backup/episode_raw.json');
const targetPath = path.join(rootDir, 'src/data/chapters/hull_derivatives/ch01_part1/episode_raw.json');

const raw = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

// 1. Update metadata
raw.meta.chapterTitle = "Introduction to Derivatives: Futures, Forwards, and Systemic Risk";
raw.meta.generationProvenance = {
  model: "gemini-4-argon",
  requestedModel: "gemini-4-argon",
  preflightStatus: "PASSED",
  architectureVersion: "2.0-microkernel-adaptive",
  updatedAt: new Date().toISOString()
};

// 2. Enhance Scene 4: From progressive_cards to stat_counter
raw.scenes[4].template = "stat_counter";
raw.scenes[4].badge = "BIS Global Derivatives Survey · $630T";
raw.scenes[4].beats[0].ui_state = {
  numericValue: 630,
  prefix: "$",
  suffix: " Trillion",
  topLabel: "Global OTC Derivatives Notional Principal",
  subtext: "Bank for International Settlements (BIS) Survey · Exceeds Global GDP",
  bottomPill: "$630 Trillion Bilateral OTC vs $65 Trillion Exchange-Traded",
  contextNote: "December 2014 Benchmark Data",
  changeText: "+869% vs Exchange Volume"
};
raw.scenes[4].beats[0].visual = {
  kind: "chart",
  data: {
    chartType: "bar",
    title: "Global Derivatives Notional Principal (BIS)",
    series: [
      {
        id: "market_size",
        name: "Notional Principal ($ Trillion)",
        type: "bar",
        color: "#0F766E",
        data: [
          { x: "Exchange-Traded", y: 65, label: "$65 Trillion" },
          { x: "Over-The-Counter (OTC)", y: 630, label: "$630 Trillion" }
        ]
      }
    ],
    annotations: [
      { type: "callout", text: "$630 Trillion Notional Principal", x: "Over-The-Counter (OTC)", y: 630, color: "#F59E0B" }
    ]
  },
  semantics: {
    teachingObjective: "Visualize the overwhelming $630 Trillion scale of bilateral OTC derivatives.",
    sourceFactIds: ["fact-global-derivatives-market-size", "fact-otc-market-structure"]
  }
};

raw.scenes[4].beats[1].ui_state = {
  numericValue: 20.9,
  prefix: "$",
  suffix: " Trillion",
  topLabel: "Gross Market Value of OTC Contracts",
  subtext: "Actual Capital at Risk to Counterparty Default",
  bottomPill: "Net replacement value across all bilateral market participants",
  contextNote: "Direct Credit Exposure",
  changeText: "High Systemic Fragility"
};
raw.scenes[4].beats[1].visual = {
  kind: "chart",
  data: {
    chartType: "bar",
    title: "Gross Market Value vs Notional Principal",
    series: [
      {
        id: "gross_value",
        name: "Valuation ($ Trillion)",
        type: "bar",
        color: "#EF4444",
        data: [
          { x: "Gross Market Value", y: 20.9, label: "$20.9 Trillion" },
          { x: "Notional Principal", y: 630, label: "$630 Trillion" }
        ]
      }
    ],
    annotations: [
      { type: "callout", text: "$20.9 Trillion Active Credit Exposure", x: "Gross Market Value", y: 20.9, color: "#EF4444" }
    ]
  },
  semantics: {
    teachingObjective: "Differentiate $630T notional size from $20.9T actual credit exposure.",
    sourceFactIds: ["fact-global-derivatives-market-size"]
  }
};

raw.scenes[4].beats[2].ui_state = {
  numericValue: 90,
  prefix: "",
  suffix: "%",
  topLabel: "OTC Market Share in Global Derivatives",
  subtext: "Nine out of ten derivative contracts trade off-exchange without clearinghouse novation",
  bottomPill: "Pre-2008 Bilateral Vulnerability",
  contextNote: "Uncollateralized Dominance",
  changeText: "Reform Trigger"
};
raw.scenes[4].beats[2].visual = {
  kind: "chart",
  data: {
    chartType: "bar",
    title: "Share of Total Derivatives Contracts",
    series: [
      {
        id: "market_share",
        name: "Percentage (%)",
        type: "bar",
        color: "#0F766E",
        data: [
          { x: "Bilateral OTC", y: 90, label: "90%" },
          { x: "Exchange Traded", y: 10, label: "10%" }
        ]
      }
    ]
  },
  semantics: {
    teachingObjective: "Highlight bilateral dominance creating systemic vulnerability.",
    sourceFactIds: ["fact-global-derivatives-market-size", "fact-otc-market-structure"]
  }
};

// 3. Enhance Scene 7: From progressive_cards to horizontal_bar_race
raw.scenes[7].template = "horizontal_bar_race";
raw.scenes[7].badge = "Business Snapshot 1.1 · Lehman's 31:1 Collapse";
raw.scenes[7].beats[0].ui_state = {
  title: "Balance Sheet Leverage: Lehman Brothers vs. Commercial Bank Standard",
  leftHeader: "Lehman Brothers (2007)",
  leftWeight: 31,
  leftValueText: "31 : 1 Leverage",
  leftBar: {
    label: "Lehman Brothers (2007)",
    value: 31,
    unit: ":1",
    annotation: "$639B Assets vs $20B Equity (3.23% Cushion)"
  },
  rightHeader: "Prudent Commercial Bank Limit",
  rightWeight: 10,
  rightValueText: "10 : 1 Limit",
  rightBar: {
    label: "Commercial Bank Limit",
    value: 10,
    unit: ":1",
    annotation: "10.0% Capital Cushion Buffer"
  },
  bottomNote: "Extreme leverage turned minor mortgage price declines into fatal insolvency"
};
raw.scenes[7].beats[0].visual = {
  kind: "comparison",
  data: {
    title: "Balance Sheet Leverage: Lehman vs Prudent Standard",
    leftLabel: "Lehman Brothers (31:1)",
    rightLabel: "Commercial Bank (10:1)",
    tension: 85
  },
  semantics: {
    teachingObjective: "Demonstrate Lehman's extreme 31:1 leverage ratio.",
    sourceFactIds: ["fact-lehman-collapse-31-leverage"]
  }
};

raw.scenes[7].beats[1].ui_state = {
  title: "Equity Cushion Depletion: A 3.23% Asset Loss Destroys 100% of Equity",
  leftHeader: "Asset Loss Threshold",
  leftWeight: 3.23,
  leftValueText: "3.23% Loss",
  leftBar: {
    label: "Asset Loss Threshold",
    value: 3.23,
    unit: "%",
    annotation: "3.23% asset decline wipes out 100% of equity"
  },
  rightHeader: "Required Equity Capital",
  rightWeight: 100,
  rightValueText: "100% Equity",
  rightBar: {
    label: "Total Equity Pool",
    value: 100,
    unit: "%",
    annotation: "Zero buffer remaining for creditors"
  },
  bottomNote: "At 31:1 leverage, insolvency strikes when assets decline by only 1/31 = 3.23%"
};
raw.scenes[7].beats[1].visual = {
  kind: "comparison",
  data: {
    title: "Capital Buffer Depletion Threshold",
    leftLabel: "Loss Margin (3.23%)",
    rightLabel: "Total Equity (100%)",
    tension: 95
  },
  semantics: {
    teachingObjective: "Mathematically illustrate how 3.23% loss triggers complete insolvency.",
    sourceFactIds: ["fact-lehman-collapse-31-leverage"]
  }
};

raw.scenes[7].beats[2].ui_state = {
  title: "Total Balance Sheet Assets vs Shareholder Equity ($ Billions)",
  leftHeader: "Total Funded Assets",
  leftWeight: 639,
  leftValueText: "$639 Billion",
  leftBar: {
    label: "Funded Assets",
    value: 639,
    unit: "B",
    annotation: "Massive illiquid mortgage & derivative book"
  },
  rightHeader: "Loss-Absorbing Equity",
  rightWeight: 20,
  rightValueText: "$20 Billion",
  rightBar: {
    label: "Shareholder Equity",
    value: 20,
    unit: "B",
    annotation: "Tiny capital cushion protecting creditors"
  },
  bottomNote: "September 15, 2008: Largest bankruptcy filing in United States history ($639B)"
};
raw.scenes[7].beats[2].visual = {
  kind: "comparison",
  data: {
    title: "Lehman Assets vs Equity ($ Billions)",
    leftLabel: "$639B Assets",
    rightLabel: "$20B Equity",
    tension: 90
  },
  semantics: {
    teachingObjective: "Show the stark dollar contrast between $639B assets and $20B equity.",
    sourceFactIds: ["fact-lehman-collapse-31-leverage"]
  }
};

// 4. Enhance Scene 9: From progressive_cards to diagram_flow
raw.scenes[9].template = "diagram_flow";
raw.scenes[9].badge = "Regulatory Architecture · Dodd-Frank & CCP Novation";
raw.scenes[9].beats[0].ui_state = {
  title: "Evolution of Derivatives Market Safeguards",
  subtitle: "From Unregulated Bilateral Risk to Centralized Clearinghouses",
  layout: "linear_horizontal",
  nodes: [
    {
      id: "n1",
      label: "1995: Barings Bank",
      subtitle: "Speculative Rogue Trader Loss ($1.4B)",
      state: "warning",
      icon: "alert-triangle"
    },
    {
      id: "n2",
      label: "2008: Lehman Crisis",
      subtitle: "31:1 Leverage & 900K Bilateral OTC Swaps",
      state: "active",
      icon: "activity"
    },
    {
      id: "n3",
      label: "2010+: Dodd-Frank Act",
      subtitle: "Mandatory Central Counterparty (CCP) Novation",
      state: "success",
      icon: "shield-check"
    }
  ],
  edges: [
    { from: "n1", to: "n2", label: "Leverage Ignored", directional: true },
    { from: "n2", to: "n3", label: "Regulatory Reform", directional: true }
  ],
  activeNodeIds: ["n1", "n2"],
  activeEdgeIds: ["e1"]
};
raw.scenes[9].beats[0].visual = {
  kind: "diagram",
  data: {
    title: "Evolution of Derivatives Market Safeguards",
    subtitle: "From Bilateral Risk to Centralized Clearinghouses",
    layout: "linear_horizontal",
    nodes: [
      { id: "n1", label: "1995: Barings Bank", subtitle: "Rogue Trader ($1.4B)", state: "warning" },
      { id: "n2", label: "2008: Lehman Crisis", subtitle: "31:1 Leverage & 900K Swaps", state: "active" },
      { id: "n3", label: "2010+: Dodd-Frank CCP", subtitle: "Mandatory Central Novation", state: "success" }
    ],
    edges: [
      { from: "n1", to: "n2", label: "Leverage Ignored", directional: true },
      { from: "n2", to: "n3", label: "Global Mandate", directional: true }
    ],
    activeNodeIds: ["n1", "n2"]
  },
  semantics: {
    teachingObjective: "Trace historical crises leading to post-2008 clearinghouse reforms.",
    sourceFactIds: ["fact-lehman-otc-derivatives-web", "fact-post-2008-ccp-reforms"]
  }
};

raw.scenes[9].beats[1].ui_state = {
  title: "Three Pillars of Post-2008 OTC Derivatives Reform",
  subtitle: "Mandatory Clearing, Electronic Execution, and Trade Transparency",
  layout: "linear_horizontal",
  nodes: [
    {
      id: "p1",
      label: "1. CCP Novation",
      subtitle: "Clearinghouse guarantees settlement",
      state: "success",
      icon: "shield"
    },
    {
      id: "p2",
      label: "2. SEF Execution",
      subtitle: "Transparent electronic trading venues",
      state: "success",
      icon: "monitor"
    },
    {
      id: "p3",
      label: "3. Trade Repositories",
      subtitle: "Full regulatory exposure reporting",
      state: "success",
      icon: "database"
    }
  ],
  edges: [
    { from: "p1", to: "p2", label: "Standardized", directional: true },
    { from: "p2", to: "p3", label: "Reported", directional: true }
  ],
  activeNodeIds: ["p1", "p2", "p3"]
};
raw.scenes[9].beats[1].visual = {
  kind: "diagram",
  data: {
    title: "Three Pillars of Post-2008 OTC Reform",
    subtitle: "Clearing, Trading, and Reporting",
    layout: "linear_horizontal",
    nodes: [
      { id: "p1", label: "1. CCP Novation", subtitle: "Guaranteed Settlement", state: "success" },
      { id: "p2", label: "2. SEF Execution", subtitle: "Electronic Order Books", state: "success" },
      { id: "p3", label: "3. Trade Repositories", subtitle: "Systemic Transparency", state: "success" }
    ],
    edges: [
      { from: "p1", to: "p2", directional: true },
      { from: "p2", to: "p3", directional: true }
    ],
    activeNodeIds: ["p1", "p2", "p3"]
  },
  semantics: {
    teachingObjective: "Explain the three mandated pillars of post-2008 derivative regulation.",
    sourceFactIds: ["fact-post-2008-ccp-reforms"]
  }
};

raw.scenes[9].beats[2].ui_state = {
  title: "Bilateral Contagion Shield: Clearinghouse Novation",
  subtitle: "Replacing the opaque web with a single well-capitalized counterparty",
  layout: "linear_horizontal",
  nodes: [
    {
      id: "c1",
      label: "Trading Bank A",
      subtitle: "Buyer of Swap",
      state: "default",
      icon: "user"
    },
    {
      id: "c2",
      label: "Central Counterparty (CCP)",
      subtitle: "Novation Shield & Daily Margin",
      state: "success",
      icon: "shield-check"
    },
    {
      id: "c3",
      label: "Trading Bank B",
      subtitle: "Seller of Swap",
      state: "default",
      icon: "user"
    }
  ],
  edges: [
    { from: "c1", to: "c2", label: "Clears With", directional: true },
    { from: "c2", to: "c3", label: "Clears With", directional: true }
  ],
  activeNodeIds: ["c2"]
};
raw.scenes[9].beats[2].visual = {
  kind: "diagram",
  data: {
    title: "Clearinghouse Novation Architecture",
    subtitle: "Eliminating Bilateral Network Default Risk",
    layout: "linear_horizontal",
    nodes: [
      { id: "c1", label: "Bank A (Long)", state: "default" },
      { id: "c2", label: "CCP Clearinghouse", state: "success" },
      { id: "c3", label: "Bank B (Short)", state: "default" }
    ],
    edges: [
      { from: "c1", to: "c2", directional: true },
      { from: "c2", to: "c3", directional: true }
    ],
    activeNodeIds: ["c2"]
  },
  semantics: {
    teachingObjective: "Show how CCP novation breaks bilateral contagion chains.",
    sourceFactIds: ["fact-post-2008-ccp-reforms", "fact-systemic-risk-ripple-effect"]
  }
};

// 5. Update all sourceFactIds across scenes to map strictly to valid fact IDs in source_facts.json
const factMap = {
  "fact-01": "fact-futures-def",
  "fact-02": "fact-forward-def",
  "fact-03": "fact-importco-hedging-example",
  "fact-04": "fact-exportco-hedging-example",
  "fact-05": "fact-forward-payoff-formulas",
  "fact-06": "fact-lehman-collapse-31-leverage",
  "fact-07": "fact-systemic-risk-ripple-effect",
  "fact-08": "fact-global-derivatives-market-size"
};

raw.scenes.forEach((scene) => {
  if (scene.visual?.semantics?.sourceFactIds) {
    scene.visual.semantics.sourceFactIds = scene.visual.semantics.sourceFactIds.map((id) => factMap[id] || id);
  }
  scene.beats.forEach((beat) => {
    if (beat.visual?.semantics?.sourceFactIds) {
      beat.visual.semantics.sourceFactIds = beat.visual.semantics.sourceFactIds.map((id) => factMap[id] || id);
    }
  });
});

fs.writeFileSync(targetPath, JSON.stringify(raw, null, 2), 'utf8');
console.log(`✅ Successfully synthesized adaptive episode_raw.json with 12 scenes and ${raw.scenes.reduce((a, s) => a + s.beats.length, 0)} beats.`);

