import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch11/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_11/Part_02/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap11_part02/episode_raw.json', 'utf8'));

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const enBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());

const rawBeats = [];
epRaw.scenes.forEach(s => s.beats.forEach(b => rawBeats.push(b)));

const hiBeats = {};
rawBeats.forEach((b, idx) => {
  const k = 'b' + String(idx + 1).padStart(2, '0');
  hiBeats[k] = b.hi_narration.trim();
});

for (let i = 1; i <= 50; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 11 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "formula",
      statement: "Put-Call Parity for European Options on Non-Dividend Stock: c + K * exp(-r*T) = p + S0. Portfolio A (1 European call + cash K*exp(-rT)) exactly replicates Portfolio B (1 European put + 1 share of stock) with identical terminal payoff max(S_T, K).",
      citation: { chapter: "11", section: "11.4", page: "272" }
    },
    {
      id: "F02",
      category: "case_study",
      statement: "Parity Arbitrage Example (Overpriced Call): S0 = $31, K = $30, r = 10%, T = 0.25 yrs, c = $3.00, p = $2.25. Replicating cost c + K*exp(-rT) = 3 + 30*exp(-0.025) = 3 + 29.26 = $32.26. Portfolio B cost p + S0 = 2.25 + 31 = $33.25. Parity violated ($32.26 != $33.25), triggering arbitrage: sell put, short stock, buy call, invest cash.",
      citation: { chapter: "11", section: "11.4", page: "273" }
    },
    {
      id: "F03",
      category: "market_rule",
      statement: "Early Exercise Theorem: It is never optimal to exercise an American call option early on a non-dividend-paying stock (C = c). By exercising early, the holder forfeits remaining time value and pays strike K prematurely, losing interest.",
      citation: { chapter: "11", section: "11.5", page: "275" }
    },
    {
      id: "F04",
      category: "market_rule",
      statement: "Early Exercise of American Puts: Unlike calls, it CAN be optimal to exercise an American put early when the option is deep in the money and interest earned on received strike cash K exceeds remaining put insurance value.",
      citation: { chapter: "11", section: "11.6", page: "278" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Put-Call Parity with Discrete Dividends: c + D + K * exp(-r*T) = p + S0, where D is the present value of all dividends paid during the life of the options.",
      citation: { chapter: "11", section: "11.7", page: "280" }
    },
    {
      id: "F06",
      category: "market_rule",
      statement: "Dividend Exception for American Calls: The ONLY time it can be optimal to exercise an American call early is immediately prior to an ex-dividend date, if the dividend D exceeds the strike time value lost: D > K * [1 - exp(-r*(T - t_ex))].",
      citation: { chapter: "11", section: "11.7", page: "281" }
    },
    {
      id: "F07",
      category: "formula",
      statement: "Synthetic Positions via Parity: Synthetic Stock = c - p + K*exp(-rT); Synthetic Long Call = p + S0 - K*exp(-rT); Synthetic Long Put = c - S0 + K*exp(-rT).",
      citation: { chapter: "11", section: "11.4", page: "274" }
    },
    {
      id: "F08",
      category: "case_study",
      statement: "Business Snapshot 11.1 (Merton Capital Structure Model): A firm's equity can be viewed as a European call option on the firm's assets with strike equal to the face value of debt D: Equity = Call(Assets, D). Debt holders effectively sell a put option to equity holders.",
      citation: { chapter: "11", section: "11.8", page: "283" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p2",
  title: "Properties of Stock Options - Part 2",
  subtitle: "Put-Call Parity, Early Exercise Theorems, Discrete Dividends & Synthetic Replications",
  targetAudience: "Derivatives traders, quantitative structurers, risk managers, and arbitrage desk analysts",
  prerequisites: ["Part 1 Bounds and Factors", "Continuous compounding", "No-arbitrage replication"],
  scenes: [
    { sceneId: "s00", title: "The Parity Invariant: Unifying Options & Stock", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Equilibrium vs Arbitrage: The Two Parity Forces", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "The Replicating Portfolios: Defining Portfolio A & B", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "Proof of Put-Call Parity: Terminal Payoff Dominance", beats: ["s03b1", "s03b2", "s03b3", "s03b4", "s03b5"] },
    { sceneId: "s04", title: "Arbitrage Strategy 1: Exploiting an Overpriced Call", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Arbitrage Strategy 2: Exploiting an Underpriced Call", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "Early Exercise Theorem: American Calls on Non-Dividend Stocks", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "American Puts: Why Deep In-The-Money Puts MUST Be Exercised Early", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "Put-Call Parity with Discrete Dividends", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Put-Call Parity Arbitrage Detection", beats: ["s09b1", "s09b2", "s09b3", "s09b4"] },
    { sceneId: "s10", title: "The Synthetics Matrix: Replicating Any Financial Position", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Laws of Put-Call Parity & Exercise Dynamics", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p2",
  formulas: [
    {
      id: "M01",
      name: "Put-Call Parity (European, Non-Dividend)",
      latex: "c + K e^{-rT} = p + S_0",
      variables: [
        { symbol: "c", description: "European call price", unit: "currency" },
        { symbol: "p", description: "European put price", unit: "currency" },
        { symbol: "S_0", description: "Spot stock price", unit: "currency" },
        { symbol: "K", description: "Strike price", unit: "currency" },
        { symbol: "r", description: "Continuously compounded risk-free rate", unit: "decimal per annum" },
        { symbol: "T", description: "Time to expiration", unit: "years" }
      ]
    },
    {
      id: "M02",
      name: "Dividend-Adjusted Put-Call Parity",
      latex: "c + D + K e^{-rT} = p + S_0",
      variables: [
        { symbol: "D", description: "Present value of all dividends paid during option life", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p2",
  scenes: lessonPlan.scenes.map(s => ({
    sceneId: s.sceneId,
    title: s.title,
    beats: s.beats.map(b => ({
      beatId: b,
      narrationEn: enBeats[b.replace('s', 'b').replace(/s\d{2}/, '')] || enBeats['b' + b.slice(-2)] || "Narration text",
      narrationHi: hiBeats[b.replace('s', 'b').replace(/s\d{2}/, '')] || hiBeats['b' + b.slice(-2)] || "Narration text"
    }))
  }))
};
fs.writeFileSync(path.join(targetDir, '04_pedagogical_script.json'), JSON.stringify(pedagogicalScript, null, 2));

// 5. Episode Compliant Structure
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch11",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 11",
  partLabel: "Part 2",
  title: "Properties of Stock Options - Part 2",
  displayLanguage: "en",
  languages: ["en", "hi"],
  personas: {
    en: {
      novice: { name: "Professor", voice: "en-US-ChristopherNeural" },
      mentor: { name: "Professor", voice: "en-US-ChristopherNeural" }
    },
    hi: {
      novice: { name: "Professor", voice: "hi-IN-MadhurNeural" },
      mentor: { name: "Professor", voice: "hi-IN-MadhurNeural" }
    }
  },
  progress: { index: 2, total: 2 },
  theme: "dark-classroom",
  provenance: { mock: false },
  scenes: [
    // Scene 0: The Parity Invariant
    {
      id: "s00",
      index: 0,
      title: "The Parity Invariant: Unifying Options & Stock",
      purpose: "Introduce Put-Call Parity as the master mathematical invariant unifying Calls, Puts, Stock, and Cash",
      takeaways: [
        "Put-Call Parity binds Calls, Puts, Stock, and Cash in an unbreakable no-arbitrage equilibrium",
        "European call plus cash K*exp(-rT) equals European put plus underlying stock",
        "Part 2 masters replication proofs, dual arbitrage executions, early exercise theorems, and synthetics"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Master Parity Invariant Architecture",
        steps: [
          { label: "1. The Four Instruments", detail: "European Call (c), European Put (p), Underlying Stock (S0), and Zero-Coupon Cash (K*exp(-rT))" },
          { label: "2. The Parity Equation", detail: "c + K * exp(-r*T) = p + S0; hold identically for any asset without arbitrage" },
          { label: "3. Universal Equilibrium", detail: "Enforced continuously by algorithmic market makers and quantitative arbitrage desks" },
          { label: "4. Synthetic Universality", detail: "Any instrument can be replicated perfectly using the remaining three instruments" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "mathematical bridge", hi: "mathematical bridge" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Put-Call Parity", hi: "Put-Call Parity" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "no-arbitrage equilibrium", hi: "equilibrium" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Part Two roadmap", hi: "Part Two roadmap" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: Equilibrium vs Arbitrage
    {
      id: "s01",
      index: 1,
      title: "Equilibrium vs Arbitrage: The Two Parity Forces",
      purpose: "Examine the dynamic interaction between market equilibrium and arbitrage forces enforcing parity",
      takeaways: [
        "In equilibrium, prices reflect fundamental cash flow equivalence",
        "If market prices diverge by even pennies, arbitrageurs execute instant self-financing trades",
        "Arbitrage buying and selling immediately forces prices back into exact mathematical alignment"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Market Equilibrium vs. Arbitrage Correction Forces",
        left: {
          title: "Equilibrium State (Parity Holds)",
          items: [
            "c + K * exp(-r*T) equals p + S0 exactly",
            "Zero risk-free profit available after transaction costs",
            "Market makers quote two-sided markets aligned with theoretical curves",
            "Hedging costs across calls and puts are perfectly balanced"
          ]
        },
        right: {
          title: "Arbitrage Correction (Dislocation)",
          items: [
            "Temporary imbalance: c + K*exp(-rT) != p + S0",
            "Arbitrage desks buy cheap side and sell expensive side simultaneously",
            "Self-financing trade locking in instant risk-free cash profit",
            "Massive order flow snaps market prices back to parity within milliseconds"
          ]
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Equilibrium", hi: "Equilibrium" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "left_items", anchor: { en: "parity holds", hi: "parity holds" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "right_title", anchor: { en: "arbitrage forces", hi: "arbitrage forces" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "right_items", anchor: { en: "speed of modern algorithmic trading", hi: "algorithmic trading" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: Replicating Portfolios
    {
      id: "s02",
      index: 2,
      title: "The Replicating Portfolios: Defining Portfolio A & B",
      purpose: "Define Portfolio A (Call + Cash K*exp(-rT)) and Portfolio B (Put + Stock S0) for the formal parity proof",
      takeaways: [
        "Portfolio A consists of 1 European call and cash K * exp(-rT) invested at rate r",
        "Portfolio B consists of 1 European put and 1 share of underlying stock S0",
        "Both portfolios require specific upfront capital and mature at the exact same expiration T"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "The Replicating Portfolios Composition",
        left: {
          title: "Portfolio A (Fiduciary Call)",
          items: [
            "1 European call option with strike K and expiration T (price c)",
            "Cash amount K * exp(-r*T) invested at continuously compounded rate r",
            "Initial Cost A0 = c + K * exp(-r*T)",
            "At time T, cash grows with certainty to exactly K"
          ]
        },
        right: {
          title: "Portfolio B (Protective Put)",
          items: [
            "1 European put option with strike K and expiration T (price p)",
            "1 share of underlying stock S0",
            "Initial Cost B0 = p + S0",
            "At time T, stock is worth S_T and put pays max(K - S_T, 0)"
          ]
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "left_title", anchor: { en: "replicating portfolios", hi: "replicating portfolios" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Portfolio A", hi: "Portfolio A" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "right_items", anchor: { en: "Portfolio B", hi: "Portfolio B" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "right_title", anchor: { en: "Fiduciary Call and Protective Put", hi: "Fiduciary Call and Protective Put" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: Proof of Put-Call Parity
    {
      id: "s03",
      index: 3,
      title: "Proof of Put-Call Parity: Terminal Payoff Dominance",
      purpose: "Complete the formal mathematical demonstration proving Portfolio A and B have identical payoffs in all states",
      takeaways: [
        "If S_T > K: Call pays S_T - K, cash is K => Portfolio A pays S_T; Put expires worthless => Portfolio B pays S_T",
        "If S_T <= K: Call expires worthless, cash is K => Portfolio A pays K; Put pays K - S_T => Portfolio B pays K",
        "Since Payoff A = Payoff B = max(S_T, K) in all states, their initial costs MUST be equal: c + K*exp(-rT) = p + S0"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Put-Call Parity Payoff Equivalence Table",
        formula: "c + K e^{-rT} = p + S_0",
        steps: [
          { label: "State 1: S_T > K (In The Money Call)", detail: "Portfolio A: (S_T - K) + K = S_T; Portfolio B: 0 + S_T = S_T. Payoff A = Payoff B = S_T!" },
          { label: "State 2: S_T <= K (In The Money Put)", detail: "Portfolio A: 0 + K = K; Portfolio B: (K - S_T) + S_T = K. Payoff A = Payoff B = K!" },
          { label: "Universal Terminal Identity", detail: "\\text{Payoff}_A(T) = \\text{Payoff}_B(T) = \\max(S_T, K) \\quad \\forall \\, S_T \\in [0, \\infty)." },
          { label: "Law of One Price Deduction", detail: "\\text{Cost}_A(0) = \\text{Cost}_B(0) \\implies c + K e^{-rT} = p + S_0. \\quad \\text{Q.E.D.}" }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "rigorous payoff analysis", hi: "payoff analysis" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Case One", hi: "Case One" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Case Two", hi: "Case Two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "step_2", anchor: { en: "identical in every conceivable economic universe", hi: "identical in every universe" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b5",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Law of One Price", hi: "Law of One Price" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: Arbitrage 1: Overpriced Call
    {
      id: "s04",
      index: 4,
      title: "Arbitrage Strategy 1: Exploiting an Overpriced Call",
      purpose: "Execute Hull Section 11.4 arbitrage when call is overpriced relative to put and stock: c + K*exp(-rT) > p + S0",
      takeaways: [
        "If c + K*exp(-rT) > p + S0: Call is overpriced (Portfolio A is expensive, Portfolio B is cheap)",
        "Arbitrage: Sell Call, Borrow K*exp(-rT), Buy Put, Buy Stock",
        "Locks in positive cash at inception; perfectly neutral terminal cash flow at expiration"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Overpriced Call Arbitrage Execution Lifecycle",
        steps: [
          { label: "1. Violation Identified", detail: "c + K*exp(-rT) > p + S0; Portfolio A trades higher than replicating Portfolio B" },
          { label: "2. Short Expensive Portfolio A", detail: "Sell 1 call (receive c) and borrow K*exp(-rT) in cash (receive K*exp(-rT))" },
          { label: "3. Long Cheap Portfolio B", detail: "Buy 1 put (pay p) and buy 1 share of stock (pay S0)" },
          { label: "4. Risk-Free Profit Capture", detail: "Net upfront cash = [c + K*exp(-rT)] - [p + S0] > 0; terminal obligations cancel exactly" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] }, hi: { display: hiBeats['b18'] } },
          visualCues: [{ target: "step_0", anchor: { en: "first arbitrage condition", hi: "first arbitrage condition" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Sell Portfolio A", hi: "Sell Portfolio A" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Buy Portfolio B", hi: "Buy Portfolio B" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "step_3", anchor: { en: "locked-in profit", hi: "locked-in profit" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: Arbitrage 2: Underpriced Call
    {
      id: "s05",
      index: 5,
      title: "Arbitrage Strategy 2: Exploiting an Underpriced Call",
      purpose: "Execute reverse arbitrage when call is underpriced relative to put: c + K*exp(-rT) < p + S0",
      takeaways: [
        "If c + K*exp(-rT) < p + S0: Portfolio A is cheap and Portfolio B is expensive",
        "Arbitrage: Buy Call, Invest K*exp(-rT), Sell Put, Short Stock",
        "Generates net cash inflow today with zero net cash obligation at expiration T"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Reverse Parity Arbitrage Trade Architecture",
        steps: [
          { label: "1. Violation Identified", detail: "p + S0 > c + K*exp(-rT); Portfolio B trades higher than Portfolio A" },
          { label: "2. Short Expensive Portfolio B", detail: "Sell 1 put (receive p) and short 1 share of stock (receive S0)" },
          { label: "3. Long Cheap Portfolio A", detail: "Buy 1 call (pay c) and lend cash K*exp(-rT) at risk-free rate r" },
          { label: "4. Net Cash Inflow", detail: "Net cash pocketed today = [p + S0] - [c + K*exp(-rT)] > 0; terminal flows net to $0.00" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "step_0", anchor: { en: "reverse parity condition", hi: "reverse parity condition" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "step_1", anchor: { en: "short Portfolio B", hi: "short Portfolio B" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "step_2", anchor: { en: "buy Portfolio A", hi: "buy Portfolio A" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "step_3", anchor: { en: "two-way arbitrage bounds", hi: "arbitrage bounds" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Early Exercise Theorem: American Calls
    {
      id: "s06",
      index: 6,
      title: "Early Exercise Theorem: American Calls on Non-Dividend Stocks",
      purpose: "Prove why it is never optimal to exercise an American call option early on non-dividend stock (C = c)",
      takeaways: [
        "Exercising an American call early destroys time value and pays strike K prematurely",
        "An unexercised call provides downside insurance: if stock collapses, holder loses only premium",
        "If an investor wants to exit, selling the call on exchange always captures more value than exercising"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Three Pillars of Call Retention (Never Exercise Early)",
        steps: [
          { label: "1. Forfeiture of Time Value", detail: "Option value C >= c >= S0 - K*exp(-rT) > S0 - K (immediate exercise value)" },
          { label: "2. Loss of Interest on Strike K", detail: "Holding call keeps strike K in bank earning interest until final expiration T" },
          { label: "3. Downside Insurance Protection", detail: "If stock plunges below K before expiry, call holder is insulated; stock owner suffers full loss" },
          { label: "4. Better Alternative: Sell", detail: "Market sale yields C > S0 - K; exercising captures only S0 - K, leaving money on table" }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Early Exercise Theorem", hi: "Early Exercise Theorem" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_1", anchor: { en: "two major advantages", hi: "two major advantages" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b28'] }, hi: { display: hiBeats['b28'] } },
          visualCues: [{ target: "step_2", anchor: { en: "downside insurance", hi: "downside insurance" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b29'] }, hi: { display: hiBeats['b29'] } },
          visualCues: [{ target: "step_3", anchor: { en: "American call equals European call", hi: "American call equals European call" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: American Puts Early Exercise
    {
      id: "s07",
      index: 7,
      title: "American Puts: Why Deep In-The-Money Puts MUST Be Exercised Early",
      purpose: "Explain why American puts CAN be optimal to exercise early when deep in the money",
      takeaways: [
        "Unlike calls, exercising a put early receives cash strike K immediately, earning interest",
        "When put is deep ITM (e.g. S near 0), intrinsic value is capped at K and time value turns negative",
        "Hence American put price P can strictly exceed European put price p: P > p"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "American Put Early Exercise Decision Framework",
        steps: [
          { label: "1. Cash Inflow Incentive", detail: "Exercising put delivers stock and receives cash K today; cash immediately earns interest r*K" },
          { label: "2. Deep ITM Bankruptcy Case", detail: "If stock price drops to near zero, maximum put payoff is K; cannot gain further upside" },
          { label: "3. Negative Time Value", detail: "European put trades below intrinsic value: p < K - S0; American put exercises immediately" },
          { label: "4. American Put Premium", detail: "Early exercise flexibility creates strictly positive premium: P >= p and P >= K - S0" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b30'] }, hi: { display: hiBeats['b30'] } },
          visualCues: [{ target: "step_0", anchor: { en: "American puts behave very differently", hi: "American puts" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_1", anchor: { en: "interest earned on cash", hi: "interest earned on cash" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_2", anchor: { en: "deep in-the-money", hi: "deep in-the-money" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "step_3", anchor: { en: "P is strictly greater than p", hi: "P is strictly greater than p" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: Put-Call Parity with Discrete Dividends
    {
      id: "s08",
      index: 8,
      title: "Put-Call Parity with Discrete Dividends",
      purpose: "Extend Put-Call Parity to dividend-paying equities: c + D + K*exp(-rT) = p + S0",
      takeaways: [
        "Dividends paid during option life reduce terminal stock value by D * exp(rT)",
        "The generalized Put-Call Parity formula becomes: c + D + K * exp(-r*T) = p + S0",
        "D is the present value of all discrete dividends ex-dividend prior to expiration T"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Dividend-Adjusted Put-Call Parity Formula",
        formula: "c + D + K e^{-rT} = p + S_0",
        steps: [
          { label: "Step 1: Dividend Present Value", detail: "D = \\sum_{i=1}^{M} d_i \\cdot e^{-r \\cdot t_i} \\quad \\text{for all ex-dates } t_i \\le T." },
          { label: "Step 2: Portfolio A Formulation", detail: "1 European call + cash [D + K * exp(-r*T)]. Pays all dividends in cash + max(S_T, K)." },
          { label: "Step 3: Portfolio B Formulation", detail: "1 European put + 1 share of stock. Stock pays dividends D during life + put pays max(K - S_T, 0)." },
          { label: "Step 4: Parity Equilibrium", detail: "\\text{Cost}_A(0) = \\text{Cost}_B(0) \\implies c + D + K e^{-rT} = p + S_0." }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b34'] }, hi: { display: hiBeats['b34'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "discrete dividends", hi: "discrete dividends" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b35'] }, hi: { display: hiBeats['b35'] } },
          visualCues: [{ target: "step_1", anchor: { en: "present value D", hi: "present value D" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b36'] }, hi: { display: hiBeats['b36'] } },
          visualCues: [{ target: "step_3", anchor: { en: "dividend-adjusted Put-Call Parity equation", hi: "dividend-adjusted Put-Call Parity" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Put-Call Parity Arbitrage Detection",
      purpose: "Test quantitative calculation of parity divergence and arbitrage profit extraction",
      takeaways: [
        "Given S0 = $31, K = $30, r = 10%, T = 3 months (0.25 yrs): discount factor exp(-0.025) = 0.9753",
        "If c = $3.00 and p = $2.25: c + K*exp(-rT) = 3 + 29.26 = $32.26, while p + S0 = 2.25 + 31 = $33.25",
        "Parity is violated ($32.26 != $33.25): Buy call, short stock, sell put, invest cash, capturing $0.99 profit"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A stock trades at S0 = $31. A 3-month European call with strike K = $30 trades at $3.00. The 3-month European put with strike $30 trades at $2.25. The risk-free rate is 10% (K*exp(-rT) = $29.26). What arbitrage action should you take?",
        options: [
          { label: "Option A", text: "No arbitrage; parity holds within $1.00 tolerance" },
          { label: "Option B", text: "Buy call and lend cash; short stock and sell put, locking in $0.99 profit" },
          { label: "Option C", text: "Sell call and borrow cash; buy stock and buy put, locking in $0.99 profit" },
          { label: "Option D", text: "Exercise the call immediately to capture intrinsic value" }
        ],
        correctIndex: 1,
        explanation: "Portfolio A cost = c + K*exp(-rT) = $3.00 + $29.26 = $32.26. Portfolio B cost = p + S0 = $2.25 + $31.00 = $33.25. Since Portfolio A is cheaper than Portfolio B, buy Portfolio A (buy call, lend $29.26) and short Portfolio B (short stock for $31, sell put for $2.25). Net cash generated today = $33.25 - $32.26 = $0.99 risk-free profit."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b37'] }, hi: { display: hiBeats['b37'] } },
          visualCues: [{ target: "question_box", anchor: { en: "test your quantitative mastery", hi: "quantitative mastery" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b38'] }, hi: { display: hiBeats['b38'] } },
          visualCues: [{ target: "options_grid", anchor: { en: "thirty-one dollars", hi: "thirty-one dollars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b39'] }, hi: { display: hiBeats['b39'] } },
          visualCues: [{ target: "options_grid", anchor: { en: "pause and calculate", hi: "pause and calculate" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b40'] }, hi: { display: hiBeats['b40'] } },
          visualCues: [{ target: "explanation_box", anchor: { en: "Option B", hi: "Option B" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 10: Synthetics Matrix
    {
      id: "s10",
      index: 10,
      title: "The Synthetics Matrix: Replicating Any Financial Position",
      purpose: "Demonstrate algebraic rearrangement of parity to create synthetic stocks, synthetic calls, and synthetic puts",
      takeaways: [
        "Synthetic Stock = Long Call + Short Put + Cash Bond: S0 = c - p + K*exp(-rT)",
        "Synthetic Long Call = Long Put + Long Stock + Loan: c = p + S0 - K*exp(-rT)",
        "Synthetic Long Put = Long Call + Short Stock + Cash Bond: p = c - S0 + K*exp(-rT)"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Synthetic Position Generation via Parity Algebra",
        steps: [
          { label: "Synthetic Stock (S0)", detail: "S0 = c - p + K*exp(-rT); Buy Call, Sell Put, Lend Cash" },
          { label: "Synthetic Call (c)", detail: "c = p + S0 - K*exp(-rT); Buy Put, Buy Stock, Borrow Cash (Protective Put)" },
          { label: "Synthetic Put (p)", detail: "p = c - S0 + K*exp(-rT); Buy Call, Short Stock, Lend Cash" },
          { label: "Synthetic Bond (Cash)", detail: "K*exp(-rT) = p + S0 - c; Buy Put, Buy Stock, Sell Call (Conversion Trade)" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b41'] }, hi: { display: hiBeats['b41'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Synthetics Matrix", hi: "Synthetics Matrix" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b42'] }, hi: { display: hiBeats['b42'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Synthetic Stock", hi: "Synthetic Stock" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b43'] }, hi: { display: hiBeats['b43'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Synthetic Call", hi: "Synthetic Call" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b44'] }, hi: { display: hiBeats['b44'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Synthetic Put and Conversion", hi: "Synthetic Put and Conversion" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Laws of Put-Call Parity & Exercise Dynamics",
      purpose: "Synthesize the 8 essential structural rules of Put-Call Parity, early exercise theorems, and Merton equity model",
      takeaways: [
        "Put-Call Parity is an unbreakable equilibrium: c + K*exp(-rT) = p + S0",
        "American calls on non-dividend stocks should never be exercised early (C = c)",
        "Deep ITM American puts should be exercised early; Chapter 12 advances into Trading Strategies",
        "Dividends require adding D to call side: c + D + K*exp(-rT) = p + S0"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Core Laws of Put-Call Parity & Option Exercise",
        rules: [
          { number: 1, title: "Universal Parity", text: "European options satisfy c + K*exp(-rT) = p + S0 based on terminal payoff equivalence." },
          { number: 2, title: "Two-Way Arbitrage", text: "Parity violations trigger immediate self-financing arbitrage enforcing market equilibrium." },
          { number: 3, title: "Call Retention Law", text: "Never exercise an American call early on non-dividend stock; selling always captures more." },
          { number: 4, title: "Put Early Exercise", text: "Deep in-the-money American puts should be exercised early to earn interest on cash strike." },
          { number: 5, title: "Dividend Adjustment", text: "Discrete dividends modify parity to c + D + K*exp(-rT) = p + S0." },
          { number: 6, title: "Dividend Call Exception", text: "American calls should only be exercised early immediately prior to an ex-dividend date." },
          { number: 7, title: "Synthetic Replicability", text: "Any position (stock, call, put, bond) can be synthetically replicated using the other three." },
          { number: 8, title: "Trading Strategies Advance", text: "In Chapter 12, we assemble options into Spreads, Straddles, Strangles, and Butterflies." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b45'] }, hi: { display: hiBeats['b45'] } },
          visualCues: [{ target: "rule_1", anchor: { en: "four foundational pillars", hi: "chaar foundational pillars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b46'] }, hi: { display: hiBeats['b46'] } },
          visualCues: [{ target: "rule_2", anchor: { en: "Pillar One", hi: "Pillar One" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b47'] }, hi: { display: hiBeats['b47'] } },
          visualCues: [{ target: "rule_3", anchor: { en: "Pillar Two", hi: "Pillar Two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b48'] }, hi: { display: hiBeats['b48'] } },
          visualCues: [{ target: "rule_5", anchor: { en: "Pillar Three", hi: "Pillar Three" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b5",
          speaker: "instructor",
          narration: { en: { display: enBeats['b49'] }, hi: { display: hiBeats['b49'] } },
          visualCues: [{ target: "rule_7", anchor: { en: "Pillar Four", hi: "Pillar Four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b6",
          speaker: "instructor",
          narration: { en: { display: enBeats['b50'] }, hi: { display: hiBeats['b50'] } },
          visualCues: [{ target: "rule_8", anchor: { en: "Chapter Twelve", hi: "Chapter Twelve" } }],
          pauseAfterMs: 600
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));
console.log('Chapter 11 Part 2 successfully built!');
