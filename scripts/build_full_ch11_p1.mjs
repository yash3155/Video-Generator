import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch11/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_11/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_11/Part_01/script_hi.md', 'utf8');

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches = [...hiScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hiScriptText.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

const enBeats = {};
const hiBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
hiMatches.forEach(m => hiBeats[m[1]] = m[2].trim());

for (let i = 1; i <= 39; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 11 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "market_rule",
      statement: "Hull Table 11.1 formalizes the six core market variables governing option values: Stock price S0 (+ call, - put), Strike price K (- call, + put), Time to expiration T (+ American call/put), Volatility sigma (+ call, + put), Risk-free rate r (+ call, - put), and Present value of dividends D (- call, + put).",
      citation: { chapter: "11", section: "11.1", page: "265" }
    },
    {
      id: "F02",
      category: "definition",
      statement: "Volatility Asymmetry: Because option owners have limited downside (capped at premium paid) but unlimited upside potential, higher volatility expands the probability of extreme positive outcomes without worsening downside loss, strictly increasing option values.",
      citation: { chapter: "11", section: "11.1", page: "267" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "Absolute Upper Bounds: A call option can never exceed the underlying stock: c <= S0 and C <= S0. A European put option cannot exceed the discounted strike: p <= K * exp(-r*T), while an American put satisfies P <= K.",
      citation: { chapter: "11", section: "11.2", page: "268" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Lower Bound for European Calls on Non-Dividend Stock: c >= max(S0 - K * exp(-r*T), 0). Proof via portfolio dominance: Portfolio A (1 call + K*exp(-r*T) cash) >= Portfolio B (1 share of stock) at time T.",
      citation: { chapter: "11", section: "11.3", page: "270" }
    },
    {
      id: "F05",
      category: "case_study",
      statement: "Hull Section 11.3 Arbitrage Example: Stock S0 = $20, Strike K = $18, r = 10% per annum, T = 1 year, Call price c = $3.00. Lower bound = 20 - 18*exp(-0.10) = 20 - 16.29 = $3.71. Because c = $3.00 < $3.71, arbitrageur buys call for $3.00, shorts stock for $20, invests $17 at 10%, locking in a guaranteed risk-free profit of $0.71.",
      citation: { chapter: "11", section: "11.3", page: "271" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Lower Bound for European Puts on Non-Dividend Stock: p >= max(K * exp(-r*T) - S0, 0). Proof via portfolio dominance: Portfolio C (1 put + 1 share) >= Portfolio D (K*exp(-r*T) cash) at time T.",
      citation: { chapter: "11", section: "11.4", page: "273" }
    },
    {
      id: "F07",
      category: "case_study",
      statement: "Put Lower Bound Arbitrage: Stock S0 = $37, Strike K = $40, r = 5%, T = 0.5 years, Put price p = $1.00. Lower bound = 40*exp(-0.025) - 37 = 39.01 - 37 = $2.01. Arbitrageur buys put for $1.00, buys stock for $37, borrows $38 at 5%, locking in guaranteed $1.01 profit.",
      citation: { chapter: "11", section: "11.4", page: "274" }
    },
    {
      id: "F08",
      category: "formula",
      statement: "Dividend-Adjusted Lower Bounds: When stock pays dividends with present value D, the lower bounds become c >= max(S0 - D - K * exp(-r*T), 0) and p >= max(D + K * exp(-r*T) - S0, 0).",
      citation: { chapter: "11", section: "11.5", page: "276" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p1",
  title: "Properties of Stock Options - Part 1",
  subtitle: "The Six Pricing Factors, Upper/Lower Bounds & Portfolio Dominance Arbitrage",
  targetAudience: "Derivatives pricing analysts, quant researchers, market makers, and arbitrage traders",
  prerequisites: ["Continuous compounding", "Hull Chapter 10 Options Mechanics", "Arbitrage principles"],
  scenes: [
    { sceneId: "s00", title: "The Boundary Conditions of Finance: Option Bounds", beats: ["s00b1", "s00b2", "s00b3"] },
    { sceneId: "s01", title: "The Six Fundamental Factors: Sensitivity Matrix", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Volatility Asymmetry: Why Volatility is an Option's Best Friend", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "No-Arbitrage Upper Bounds: Calls and Puts", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "The Portfolio Dominance Method: Setting Up the Proof", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "Proof of the European Call Lower Bound: Hull Section 11.3", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Arbitrage Execution: Exploiting an Underpriced Call", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Lower Bound for European Puts on Non-Dividend Stocks", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Arbitrage Execution: Exploiting an Underpriced Put", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Detecting Call Lower Bound Violations", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Extension to Dividend-Paying Stocks: The Dividend Floor", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Option Bounds & Arbitrage", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "European Call Lower Bound (Non-Dividend)",
      latex: "c \\ge \\max(S_0 - K e^{-rT}, 0)",
      variables: [
        { symbol: "c", description: "European call option price", unit: "currency" },
        { symbol: "S_0", description: "Current spot stock price", unit: "currency" },
        { symbol: "K", description: "Option strike price", unit: "currency" },
        { symbol: "r", description: "Continuously compounded risk-free rate", unit: "decimal per annum" },
        { symbol: "T", description: "Time to option expiration in years", unit: "years" }
      ]
    },
    {
      id: "M02",
      name: "European Put Lower Bound (Non-Dividend)",
      latex: "p \\ge \\max(K e^{-rT} - S_0, 0)",
      variables: [
        { symbol: "p", description: "European put option price", unit: "currency" },
        { symbol: "S_0", description: "Current spot stock price", unit: "currency" },
        { symbol: "K", description: "Option strike price", unit: "currency" },
        { symbol: "r", description: "Continuously compounded risk-free rate", unit: "decimal per annum" },
        { symbol: "T", description: "Time to option expiration in years", unit: "years" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch11",
  partId: "p1",
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
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 11",
  partLabel: "Part 1",
  title: "Properties of Stock Options - Part 1",
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
  progress: { index: 1, total: 2 },
  theme: "dark-classroom",
  provenance: { mock: false },
  scenes: [
    // Scene 0: Boundary Conditions of Finance
    {
      id: "s00",
      index: 0,
      title: "The Boundary Conditions of Finance: Option Bounds",
      purpose: "Establish model-independent boundary conditions that option prices must satisfy to prevent arbitrage",
      takeaways: [
        "Before applying complex pricing models, option prices must satisfy model-independent boundaries",
        "If market prices violate these bounds, pure risk-free arbitrage opportunities arise immediately",
        "Part 1 explores the 6 pricing factors, upper bounds, portfolio dominance, and lower bounds"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Model-Independent Arbitrage Boundaries",
        steps: [
          { label: "1. Six Pricing Factors", detail: "Stock price, Strike, Time to expiry, Volatility, Risk-free rate, and Dividends" },
          { label: "2. Absolute Upper Bounds", detail: "Calls cannot exceed stock price (c <= S0); European puts cannot exceed PV of strike" },
          { label: "3. Portfolio Dominance Proofs", detail: "Construct portfolios that guarantee value >= benchmark at maturity without risk" },
          { label: "4. Lower Bound Enforcement", detail: "Violations trigger immediate short-stock or borrowing arbitrage trades" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "boundary conditions", hi: "boundary conditions" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "model-independent", hi: "model-independent" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "masterclass on Chapter Eleven", hi: "Chapter Eleven" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: Six Factors Sensitivity Matrix
    {
      id: "s01",
      index: 1,
      title: "The Six Fundamental Factors: Sensitivity Matrix",
      purpose: "Examine Hull Table 11.1 detailing directional impact of the 6 core pricing factors",
      takeaways: [
        "Stock price increases call value (+) and decreases put value (-)",
        "Strike price decreases call value (-) and increases put value (+)",
        "Volatility strictly increases both call and put values (+, +)"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Hull Table 11.1: Option Price Sensitivity Matrix",
        steps: [
          { label: "Stock Price (S0)", detail: "Call: Positive (+), Put: Negative (-)" },
          { label: "Strike Price (K)", detail: "Call: Negative (-), Put: Positive (+)" },
          { label: "Time to Expiry (T)", detail: "American Call: (+), American Put: (+); European generally (+)" },
          { label: "Volatility (sigma)", detail: "Call: Strictly (+), Put: Strictly (+)" }
        ]
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "step_0", anchor: { en: "six fundamental market variables", hi: "fundamental variables" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Hull Table eleven point one", hi: "Table eleven point one" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "step_3", anchor: { en: "interest rates and dividends", hi: "interest rates and dividends" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: Volatility Asymmetry
    {
      id: "s02",
      index: 2,
      title: "Volatility Asymmetry: Why Volatility is an Option's Best Friend",
      purpose: "Explain truncated downside and why volatility expands option values symmetrically for calls and puts",
      takeaways: [
        "Option owners have limited downside (capped at premium) but unlimited upside",
        "Higher volatility expands the distribution tails, boosting upside payoff probability",
        "Extreme downside moves do not increase owner loss once the option is out of the money"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Asymmetric Volatility Transmission Architecture",
        steps: [
          { label: "Payoff Truncation", detail: "Downside is strictly truncated at zero; owner cannot lose more than initial premium" },
          { label: "Tail Expansion", detail: "Higher volatility widens the terminal stock probability distribution in both directions" },
          { label: "Upside Participation", detail: "Option owner captures 100% of favorable right-tail extreme stock moves" },
          { label: "Convexity Benefit", detail: "Jensen's Inequality: E[max(S_T - K, 0)] strictly increases with variance" }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "step_0", anchor: { en: "volatility asymmetry", hi: "volatility asymmetry" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "step_1", anchor: { en: "limited downside", hi: "limited downside" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "step_3", anchor: { en: "volatility is an option's best friend", hi: "volatility is an option's best friend" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: No-Arbitrage Upper Bounds
    {
      id: "s03",
      index: 3,
      title: "No-Arbitrage Upper Bounds: Calls and Puts",
      purpose: "Establish intuitive and rigorous upper bounds for calls (c <= S0) and European puts (p <= K * exp(-rT))",
      takeaways: [
        "A call option can never be worth more than the underlying stock: c <= S0 and C <= S0",
        "If c > S0, an arbitrageur shorts the call and buys the stock, capturing risk-free cash upfront",
        "A European put can never exceed K * exp(-rT); an American put can never exceed K"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Absolute No-Arbitrage Upper Bounds",
        formula: "c \\le S_0, \\quad C \\le S_0, \\quad p \\le K e^{-rT}, \\quad P \\le K",
        steps: [
          { label: "Call Upper Bound Logic", detail: "A call gives the right to buy stock for K. Buying the stock directly gives the stock with K=0, so Call <= Stock." },
          { label: "Call Upper Bound Arbitrage", detail: "If c > S0: Sell call, buy stock. Initial cash flow = c - S0 > 0. At expiry, deliver stock if exercised, profit = c - S0 + K." },
          { label: "European Put Upper Bound", detail: "Maximum payoff at expiry is K. The present value of K today is K * exp(-r*T), so European put cannot exceed K*exp(-rT)." },
          { label: "American Put Upper Bound", detail: "American put can be exercised immediately today for at most strike K, so American Put <= K." }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "no-arbitrage upper bounds", hi: "upper bounds" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "step_0", anchor: { en: "call option can never be worth more", hi: "call option" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "step_2", anchor: { en: "European put upper bound", hi: "European put upper bound" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: Portfolio Dominance Method
    {
      id: "s04",
      index: 4,
      title: "The Portfolio Dominance Method: Setting Up the Proof",
      purpose: "Introduce the cornerstone portfolio dominance theorem: if Portfolio A >= Portfolio B at T, then A_0 >= B_0",
      takeaways: [
        "Portfolio Dominance: If Portfolio A >= Portfolio B in all future states, then A0 must >= B0 today",
        "To prove call lower bounds, construct Portfolio A (Call + Cash K*exp(-rT)) and Portfolio B (1 share)",
        "At maturity T, Portfolio A pays max(S_T, K), strictly dominating or matching Portfolio B (S_T)"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Portfolio Dominance Framework: Call Lower Bound Proof",
        left: {
          title: "Portfolio A (Call + Cash)",
          items: [
            "1 European call option (current price c)",
            "Cash amount K * exp(-r*T) invested at risk-free rate r",
            "At expiration T, cash grows deterministically to exactly K",
            "Terminal payoff = max(S_T - K, 0) + K = max(S_T, K)"
          ]
        },
        right: {
          title: "Portfolio B (Underlying Stock)",
          items: [
            "1 share of non-dividend underlying stock (current price S0)",
            "Zero additional cash holdings",
            "Terminal value at expiration T equals exactly S_T",
            "Comparison: max(S_T, K) >= S_T in all economic states!"
          ]
        }
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Portfolio Dominance method", hi: "Portfolio Dominance method" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Portfolio A", hi: "Portfolio A" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "right_items", anchor: { en: "terminal payoff comparison", hi: "payoff comparison" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: Proof of Call Lower Bound
    {
      id: "s05",
      index: 5,
      title: "Proof of the European Call Lower Bound: Hull Section 11.3",
      purpose: "Complete the formal mathematical proof establishing c >= S0 - K * exp(-rT)",
      takeaways: [
        "Since Portfolio A >= Portfolio B at T, initial cost A0 >= B0: c + K * exp(-rT) >= S0",
        "Rearranging yields the lower bound: c >= S0 - K * exp(-rT)",
        "Because an option price cannot be negative, c >= max(S0 - K * exp(-rT), 0)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "European Call Lower Bound Derivation",
        formula: "c \\ge \\max(S_0 - K e^{-rT}, 0)",
        steps: [
          { label: "Step 1: Terminal Dominance", detail: "\\text{Payoff}_A = \\max(S_T, K) \\ge S_T = \\text{Payoff}_B \\quad \\forall \\, S_T." },
          { label: "Step 2: No-Arbitrage Valuation", detail: "\\text{Value}_A(0) \\ge \\text{Value}_B(0) \\implies c + K e^{-rT} \\ge S_0." },
          { label: "Step 3: Algebraic Isolation", detail: "c \\ge S_0 - K e^{-rT}." },
          { label: "Step 4: Non-Negativity Floor", detail: "Since call buyers can always discard worthless contracts, c \\ge \\max(S_0 - K e^{-rT}, 0)." }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "formal mathematical proof", hi: "mathematical proof" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "step_1", anchor: { en: "initial cost of Portfolio A", hi: "Portfolio A" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] }, hi: { display: hiBeats['b18'] } },
          visualCues: [{ target: "step_3", anchor: { en: "non-negativity floor", hi: "non-negativity floor" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Arbitrage Execution: Underpriced Call
    {
      id: "s06",
      index: 6,
      title: "Arbitrage Execution: Exploiting an Underpriced Call",
      purpose: "Walk through Hull's exact numerical arbitrage trade when a call violates the lower bound",
      takeaways: [
        "In Hull's example: S0 = $20, K = $18, r = 10%, T = 1 yr; Lower Bound = $3.71",
        "If market call trades at $3.00, buy call for $3.00, short stock for $20, invest $17 at 10%",
        "At maturity, payoff is guaranteed risk-free profit of $0.71 in all market states"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Underpriced Call Arbitrage Trade Mechanics (Hull Section 11.3)",
        steps: [
          { label: "1. Violation Detection", detail: "Lower bound = 20 - 18*exp(-0.10) = $3.71. Market call price c = $3.00 < $3.71" },
          { label: "2. Inception Trade (t=0)", detail: "Buy 1 call for $3.00, Short 1 stock for $20.00. Net cash generated = $20 - $3 = $17.00" },
          { label: "3. Cash Investment", detail: "Lend $17.00 at 10% risk-free rate for 1 year. Terminal cash = $17 * exp(0.10) = $18.79" },
          { label: "4. Terminal Settlement (t=1)", detail: "If S_T >= 18: exercise call to buy stock at 18; net profit = $18.79 - $18 = $0.79 profit!" }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "step_0", anchor: { en: "exact numerical arbitrage", hi: "numerical arbitrage" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "step_1", anchor: { en: "twenty dollars", hi: "twenty dollars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "step_3", anchor: { en: "guaranteed risk-free profit", hi: "risk-free profit" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: Lower Bound for European Puts
    {
      id: "s07",
      index: 7,
      title: "Lower Bound for European Puts on Non-Dividend Stocks",
      purpose: "Formulate and prove the European put lower bound p >= max(K * exp(-rT) - S0, 0)",
      takeaways: [
        "For European puts: p >= max(K * exp(-rT) - S0, 0)",
        "Proof via Portfolio C (Put + Stock) vs Portfolio D (Cash K * exp(-rT))",
        "Terminal value of Portfolio C is max(K, S_T), dominating Portfolio D (K)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "European Put Lower Bound Derivation",
        formula: "p \\ge \\max(K e^{-rT} - S_0, 0)",
        steps: [
          { label: "Portfolio C Structure", detail: "1 European put (price p) + 1 share of stock (price S0). Initial cost = p + S0." },
          { label: "Terminal Payoff C", detail: "\\text{Payoff}_C = \\max(K - S_T, 0) + S_T = \\max(K, S_T)." },
          { label: "Portfolio D Structure", detail: "Cash K * exp(-r*T) invested at r. Terminal payoff = K." },
          { label: "Dominance Deduction", detail: "\\max(K, S_T) \\ge K \\implies p + S_0 \\ge K e^{-rT} \\implies p \\ge K e^{-rT} - S_0." }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "European put lower bound", hi: "European put lower bound" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Portfolio C", hi: "Portfolio C" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "step_3", anchor: { en: "dominance deduction", hi: "dominance deduction" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: Arbitrage Execution: Underpriced Put
    {
      id: "s08",
      index: 8,
      title: "Arbitrage Execution: Exploiting an Underpriced Put",
      purpose: "Walk through step-by-step arbitrage trade exploiting a put lower bound violation",
      takeaways: [
        "In Hull's example: S0 = $37, K = $40, r = 5%, T = 0.5 yr; Lower Bound = $2.01",
        "If put trades at $1.00, buy put for $1.00, buy stock for $37, borrow $38 at 5%",
        "At maturity, cash repayment is $38.96 while position pays at least $40, locking in profit"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Underpriced Put Arbitrage Trade Mechanics (Hull Section 11.4)",
        steps: [
          { label: "1. Violation Detection", detail: "Lower bound = 40*exp(-0.025) - 37 = 39.01 - 37 = $2.01. Market price p = $1.00 < $2.01" },
          { label: "2. Inception Trade (t=0)", detail: "Buy 1 put for $1.00, Buy 1 share for $37.00. Total funding required = $38.00" },
          { label: "3. Financing via Borrowing", detail: "Borrow $38.00 at 5% for 6 months. Loan repayment due at T = $38 * exp(0.025) = $38.96" },
          { label: "4. Guaranteed Profit", detail: "At T, position pays max(40, S_T) >= $40.00. Net profit >= $40.00 - $38.96 = $1.04!" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "step_0", anchor: { en: "underpriced put arbitrage", hi: "underpriced put arbitrage" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_1", anchor: { en: "thirty-seven dollars", hi: "thirty-seven dollars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_3", anchor: { en: "net risk-free profit", hi: "risk-free profit" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Detecting Call Lower Bound Violations",
      purpose: "Test quantitative calculation of call lower bound and arbitrage detection",
      takeaways: [
        "Given S0 = $50, K = $45, r = 6%, T = 6 months (0.5 yrs): discount factor exp(-0.03) = 0.9704",
        "Lower bound = $50 - $45 * 0.9704 = $50 - $43.67 = $6.33",
        "If market call trades at $5.50, it is underpriced by $0.83, creating pure arbitrage"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A stock trades at S0 = $50. A 6-month European call option has strike K = $45. The risk-free rate is 6% continuously compounded (exp(-0.03) = 0.9704). If the call trades at $5.50, is there an arbitrage opportunity, and what is the call lower bound?",
        options: [
          { label: "Option A", text: "No arbitrage; lower bound is $5.00" },
          { label: "Option B", text: "Arbitrage exists; lower bound is $6.33" },
          { label: "Option C", text: "Arbitrage exists; lower bound is $7.15" },
          { label: "Option D", text: "No arbitrage; lower bound is $5.50" }
        ],
        correctIndex: 1,
        explanation: "Lower bound = S0 - K*exp(-rT) = 50 - 45*0.9704 = 50 - 43.67 = $6.33. Because market price $5.50 < $6.33, the call violates the lower bound, creating an immediate risk-free arbitrage of $0.83."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b28'] }, hi: { display: hiBeats['b28'] } },
          visualCues: [{ target: "question_box", anchor: { en: "test your quantitative command", hi: "quantitative command" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b29'] }, hi: { display: hiBeats['b29'] } },
          visualCues: [{ target: "options_grid", anchor: { en: "fifty dollars", hi: "fifty dollars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b30'] }, hi: { display: hiBeats['b30'] } },
          visualCues: [{ target: "explanation_box", anchor: { en: "Option B", hi: "Option B" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 10: Extension to Dividend-Paying Stocks
    {
      id: "s10",
      index: 10,
      title: "Extension to Dividend-Paying Stocks: The Dividend Floor",
      purpose: "Extend lower bounds to dividend-paying equities by deducting present value of dividends D",
      takeaways: [
        "When stock pays dividends with present value D, stock price S0 drops to S0 - D",
        "Adjusted European Call Lower Bound: c >= max(S0 - D - K * exp(-rT), 0)",
        "Adjusted European Put Lower Bound: p >= max(D + K * exp(-rT) - S0, 0)"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Dividend-Adjusted Option Bound Formulations",
        steps: [
          { label: "1. Dividend PV Calculation", detail: "D = sum [ d_i * exp(-r * t_i) ] for all ex-dividend dates t_i <= T" },
          { label: "2. Net Stock Price", detail: "Stock price net of dividend escrow: S_0^* = S_0 - D" },
          { label: "3. Call Dividend Floor", detail: "c >= max(S0 - D - K * exp(-r*T), 0); dividends reduce call lower bounds" },
          { label: "4. Put Dividend Floor", detail: "p >= max(D + K * exp(-r*T) - S0, 0); dividends increase put lower bounds" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_0", anchor: { en: "dividend-paying stocks", hi: "dividend-paying stocks" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_1", anchor: { en: "present value of all dividends", hi: "present value of all dividends" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "step_3", anchor: { en: "dividend floor", hi: "dividend floor" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Option Bounds & Arbitrage",
      purpose: "Synthesize the 8 foundational rules of option bounds, portfolio dominance, and arbitrage enforcement",
      takeaways: [
        "Model-independent upper bounds: c <= S0, p <= K*exp(-rT), P <= K",
        "Lower bounds derived via portfolio dominance: c >= S0 - K*exp(-rT), p >= K*exp(-rT) - S0",
        "Dividends reduce call bounds by D and increase put bounds by D; Part 2 tackles Put-Call Parity"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Foundational Rules of Option Boundary Conditions",
        rules: [
          { number: 1, title: "Model Independence", text: "Option boundary conditions hold under pure no-arbitrage without parametric models." },
          { number: 2, title: "Call Upper Bound", text: "A call option can never be worth more than the underlying stock: c <= S0, C <= S0." },
          { number: 3, title: "Put Upper Bound", text: "European puts cannot exceed discounted strike K*exp(-rT); American puts cannot exceed K." },
          { number: 4, title: "Portfolio Dominance", text: "If Portfolio A >= Portfolio B in all future states, then A0 must >= B0 today." },
          { number: 5, title: "Call Lower Bound", text: "European calls satisfy c >= max(S0 - K*exp(-rT), 0); underpricing triggers cash arbitrage." },
          { number: 6, title: "Put Lower Bound", text: "European puts satisfy p >= max(K*exp(-rT) - S0, 0); underpricing triggers borrowing arbitrage." },
          { number: 7, title: "Dividend Adjustments", text: "Dividends deduct D from call lower bounds and add D to put lower bounds." },
          { number: 8, title: "Part Two Roadmap", text: "In Part Two, we master Early Exercise of American Options and Put-Call Parity." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b34'] }, hi: { display: hiBeats['b34'] } },
          visualCues: [{ target: "rule_1", anchor: { en: "four foundational pillars", hi: "chaar foundational pillars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b35'] }, hi: { display: hiBeats['b35'] } },
          visualCues: [{ target: "rule_2", anchor: { en: "Pillar One", hi: "Pillar One" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b36'] }, hi: { display: hiBeats['b36'] } },
          visualCues: [{ target: "rule_4", anchor: { en: "Pillar Two", hi: "Pillar Two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b37'] }, hi: { display: hiBeats['b37'] } },
          visualCues: [{ target: "rule_5", anchor: { en: "Pillar Three", hi: "Pillar Three" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b5",
          speaker: "instructor",
          narration: { en: { display: enBeats['b38'] }, hi: { display: hiBeats['b38'] } },
          visualCues: [{ target: "rule_7", anchor: { en: "Pillar Four", hi: "Pillar Four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b6",
          speaker: "instructor",
          narration: { en: { display: enBeats['b39'] }, hi: { display: hiBeats['b39'] } },
          visualCues: [{ target: "rule_8", anchor: { en: "Part Two", hi: "Part Two" } }],
          pauseAfterMs: 600
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));
console.log('Chapter 11 Part 1 successfully built!');
