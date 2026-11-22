import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch10/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_10/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_10/Part_01/script_hi.md', 'utf8');

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

// 1. Facts with full numerical grounding from Chapter 10 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch10",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "An option contract grants the buyer the right, but not the obligation, to buy (call) or sell (put) an underlying asset at a predetermined strike price on or before a specified expiration date, in exchange for an upfront non-refundable option premium.",
      citation: { chapter: "10", section: "10.1", page: "239" }
    },
    {
      id: "F02",
      category: "definition",
      statement: "The four foundational option positions comprise: Long Call (right to buy, limited loss / unlimited gain), Short Call (obligation to sell, capped premium / unlimited loss), Long Put (right to sell, limited loss / substantial gain), and Short Put (obligation to buy, capped premium / substantial downside risk).",
      citation: { chapter: "10", section: "10.1", page: "240" }
    },
    {
      id: "F03",
      category: "definition",
      statement: "American options can be exercised at any point up to expiration. European options can only be exercised on the expiration date itself. Almost all US exchange-traded equity options are American style.",
      citation: { chapter: "10", section: "10.1", page: "241" }
    },
    {
      id: "F04",
      category: "definition",
      statement: "Moneyness: Call options are in-the-money (ITM) when S > K, at-the-money (ATM) when S = K, and out-of-the-money (OTM) when S < K. Puts are ITM when S < K and OTM when S > K.",
      citation: { chapter: "10", section: "10.2", page: "243" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Stock Split Option Adjustment: For an N-for-M split, the post-split strike K' = K * (M / N), and the number of shares covered by the contract increases to 100 * (N / M). Total contract value (Strike * Shares) remains invariant.",
      citation: { chapter: "10", section: "10.4", page: "248" }
    },
    {
      id: "F06",
      category: "case_study",
      statement: "For a 3-for-1 stock split on a contract with strike $150 covering 100 shares: New Strike K' = 150 * (1/3) = $50, and shares per contract become 100 * 3 = 300 shares. Total strike value = $50 * 300 = $15,000, identical to pre-split $150 * 100.",
      citation: { chapter: "10", section: "10.4", page: "249" }
    },
    {
      id: "F07",
      category: "market_rule",
      statement: "Exchange-traded options are unprotected against ordinary cash dividends. Stock price drops by the dividend amount on the ex-dividend date, benefiting put holders and hurting call holders without contractual adjustment.",
      citation: { chapter: "10", section: "10.4", page: "250" }
    },
    {
      id: "F08",
      category: "case_study",
      statement: "In 2004, Gucci paid a massive extraordinary dividend of 13.50 EUR. Under exchange rules, extraordinary dividends exceeding a specific threshold (e.g. 10% of stock price) trigger strike reductions to protect option holders.",
      citation: { chapter: "10", section: "10.4", page: "251" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch10",
  partId: "p1",
  title: "Mechanics of Options Markets - Part 1",
  subtitle: "Contract Specifications, Moneyness, Stock Split Adjustments & The Dividend Dilemma",
  targetAudience: "Options traders, derivatives structurers, and portfolio risk managers",
  prerequisites: ["Equity market operations", "Basic payoff functions", "Corporate actions"],
  scenes: [
    { sceneId: "s00", title: "Asymmetric Power: Rights Without Obligations", beats: ["s00b1", "s00b2", "s00b3"] },
    { sceneId: "s01", title: "The Four Foundational Option Positions", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Exercise Style: American vs. European Options", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "The Moneyness Spectrum: ITM, ATM, and OTM", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "Underlying Asset Classes: Equities, Currencies, Indices & Futures", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "Exchange Specifications: Strike Intervals & Expiration Cycles", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Corporate Actions: Mathematical Adjustment for Stock Splits", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "The Cash Dividend Dilemma: Why Regular Dividends are Unprotected", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Case Study: The Gucci Extraordinary Dividend Exception", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Calculating Post-Split Option Adjustments", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Option Symbols & Quote Reading: Navigating Option Chains", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Option Contract Specifications", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch10",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "Stock Split Option Strike Adjustment",
      latex: "K' = K \\times \\frac{M}{N}",
      variables: [
        { symbol: "K'", description: "Adjusted post-split strike price", unit: "currency" },
        { symbol: "K", description: "Original pre-split strike price", unit: "currency" },
        { symbol: "N", description: "Number of post-split shares per M pre-split shares (N-for-M split)", unit: "dimensionless" },
        { symbol: "M", description: "Number of original pre-split shares", unit: "dimensionless" }
      ]
    },
    {
      id: "M02",
      name: "Stock Split Contract Size Adjustment",
      latex: "Q' = Q \\times \\frac{N}{M}",
      variables: [
        { symbol: "Q'", description: "Adjusted number of shares covered per option contract", unit: "shares" },
        { symbol: "Q", description: "Standard pre-split contract size (typically 100 shares)", unit: "shares" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch10",
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
  chapterId: "ch10",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 10",
  partLabel: "Part 1",
  title: "Mechanics of Options Markets - Part 1",
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
    // Scene 0: Asymmetric Power
    {
      id: "s00",
      index: 0,
      title: "Asymmetric Power: Rights Without Obligations",
      purpose: "Establish the fundamental asymmetry of options contracts and compare them to linear futures",
      takeaways: [
        "Futures impose mutual symmetric obligations; options grant unilateral rights without obligation",
        "The option buyer pays an upfront premium to buy asymmetric upside with capped downside",
        "Chapter 10 explores exchange contract specifications, splits, dividends, and margin plumbing"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Linear vs. Non-Linear Derivative Architecture",
        steps: [
          { label: "Linear Derivatives (Futures/Forwards)", detail: "Mutual obligation; zero upfront premium; symmetric upside and downside risk" },
          { label: "Non-Linear Derivatives (Options)", detail: "Unilateral right for buyer; seller carries obligation; non-linear payoff profile" },
          { label: "Upfront Premium", detail: "Buyer pays non-refundable premium to purchase downside insurance and optionality" },
          { label: "Contractual Enforcement", detail: "Exercise dictated entirely by buyer; seller is completely passive" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "fundamental asymmetry", hi: "fundamental asymmetry" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "unilateral right", hi: "unilateral right" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "masterclass on Chapter Ten", hi: "Chapter Ten" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: Four Foundational Positions
    {
      id: "s01",
      index: 1,
      title: "The Four Foundational Option Positions",
      purpose: "Define Long Call, Short Call, Long Put, and Short Put payoff profiles and risk boundaries",
      takeaways: [
        "Long Call: right to buy (capped loss = premium, unlimited upside potential)",
        "Short Call: obligation to sell (capped gain = premium, unlimited downside liability)",
        "Long Put: right to sell (downside hedge), Short Put: obligation to buy (downside exposure)"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "The Four Fundamental Option Building Blocks",
        left: {
          title: "Call Options (Right to Buy)",
          items: [
            "Long Call: Payoff = max(S - K, 0) - Premium; maximum loss strictly capped at premium paid",
            "Short Call: Payoff = -max(S - K, 0) + Premium; maximum profit capped at premium, unlimited loss",
            "Long Call profits when underlying asset rises significantly above strike K + Premium",
            "Short Call earns decay when asset stays below strike K"
          ]
        },
        right: {
          title: "Put Options (Right to Sell)",
          items: [
            "Long Put: Payoff = max(K - S, 0) - Premium; maximum profit capped at K - Premium (when S=0)",
            "Short Put: Payoff = -max(K - S, 0) + Premium; maximum profit capped at premium, large downside",
            "Long Put provides portfolio downside crash insurance",
            "Short Put absorbs underlying asset downside risk below strike K"
          ]
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "left_title", anchor: { en: "four foundational positions", hi: "four foundational positions" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Long Call", hi: "Long Call" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "right_items", anchor: { en: "Long Put", hi: "Long Put" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: Exercise Style
    {
      id: "s02",
      index: 2,
      title: "Exercise Style: American vs. European Options",
      purpose: "Distinguish American early-exercise flexibility from European expiration-only exercise",
      takeaways: [
        "American options can be exercised on any trading day prior to and including expiration",
        "European options can only be exercised on the final expiration date itself",
        "Exchange-traded equity options in the US are American; broad-market index options are European"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "American vs. European Exercise Rules",
        left: {
          title: "American Style Options",
          items: [
            "Exercise permitted on any valid trading day up to final expiration",
            "Grants early exercise optionality (crucial for dividend-paying stocks and deep ITM puts)",
            "Worth at least as much as an otherwise identical European option: C_A >= C_E, P_A >= P_E",
            "Standard for individual US stock options traded on CBOE"
          ]
        },
        right: {
          title: "European Style Options",
          items: [
            "Exercise permitted only on the expiration date itself at market close",
            "No early exercise flexibility; simpler analytic pricing via Black-Scholes formula",
            "Standard for broad-market equity index options (e.g. S&P 500 SPX, Euro Stoxx 50)",
            "Settled almost exclusively in cash rather than physical delivery"
          ]
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "left_title", anchor: { en: "exercise style", hi: "exercise style" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "left_items", anchor: { en: "American options", hi: "American options" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "right_items", anchor: { en: "European options", hi: "European options" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: Moneyness Spectrum
    {
      id: "s03",
      index: 3,
      title: "The Moneyness Spectrum: ITM, ATM, and OTM",
      purpose: "Define intrinsic value, time value, and categorise options into ITM, ATM, and OTM",
      takeaways: [
        "Intrinsic value is the immediate exercise payoff: max(S - K, 0) for calls, max(K - S, 0) for puts",
        "Option price equals Intrinsic Value plus Time Value",
        "OTM options have zero intrinsic value and trade purely on the probability of reaching the strike"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Option Value Decomposition & Moneyness Criteria",
        formula: "\\text{Option Price} = \\text{Intrinsic Value} + \\text{Time Value}",
        steps: [
          { label: "Call Intrinsic Value", detail: "\\text{IV}_{\\text{call}} = \\max(S - K, 0); \\quad \\text{ITM when } S > K, \\text{ ATM when } S = K, \\text{ OTM when } S < K." },
          { label: "Put Intrinsic Value", detail: "\\text{IV}_{\\text{put}} = \\max(K - S, 0); \\quad \\text{ITM when } S < K, \\text{ ATM when } S = K, \\text{ OTM when } S > K." },
          { label: "Time Value Dynamics", detail: "Reflects the expected volatility and time remaining before expiration; decays toward zero at expiry." },
          { label: "OTM Option Structure", detail: "When IV = 0, the entire option price consists of speculative or insurance Time Value." }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "moneyness spectrum", hi: "moneyness spectrum" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Intrinsic value", hi: "Intrinsic value" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Out-of-the-money", hi: "Out-of-the-money" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: Underlying Asset Classes
    {
      id: "s04",
      index: 4,
      title: "Underlying Asset Classes: Equities, Currencies, Indices & Futures",
      purpose: "Survey option underlyings: stocks, ETFs, currencies, indices, and commodity futures",
      takeaways: [
        "Equity options cover 100 shares per contract and settle via physical share delivery",
        "Index options (SPX, NDX) settle in cash based on index closing levels",
        "Futures options give the right to enter a futures contract at strike K with immediate mark-to-market"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Major Option Contract Classes & Settlement Mechanisms",
        steps: [
          { label: "Stock Options", detail: "100 shares of underlying stock; physical delivery of shares upon exercise" },
          { label: "Index Options", detail: "Cash settled; exercise payoff = (Index - K) * Multiplier ($100)" },
          { label: "Foreign Currency Options", detail: "Exchange-traded on PHLX or OTC; right to buy/sell foreign sovereign currency" },
          { label: "Futures Options", detail: "Right to enter long/short futures contract; delivers underlying futures position + cash MTM" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "step_0", anchor: { en: "underlying asset classes", hi: "underlying asset classes" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Index options", hi: "Index options" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Futures options", hi: "Futures options" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: Exchange Specifications
    {
      id: "s05",
      index: 5,
      title: "Exchange Specifications: Strike Intervals & Expiration Cycles",
      purpose: "Examine CBOE listing rules, standardized strike price intervals, and expiration cycles",
      takeaways: [
        "Strikes are spaced at standardized intervals ($0.50, $1.00, $2.50, $5.00) around current stock price",
        "Expiration cycles include near-term months plus rotating quarterly cycle months (Jan/Feb/Mar)",
        "Standard monthly options expire on the third Friday of each calendar month"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "CBOE Exchange Listing Conventions",
        steps: [
          { label: "Standard Multiplier", detail: "One standard equity option contract represents exactly 100 shares" },
          { label: "Strike Spacing", detail: "$2.50 intervals for stocks under $25; $5.00 for stocks $25-$200; $10 for over $200" },
          { label: "Expiration Cadence", detail: "Short-term weeklies + current month, next month, and quarterly cycle months" },
          { label: "LEAPS Architecture", detail: "Long-term Equity Anticipation Securities with maturities extending up to 3 years" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "step_0", anchor: { en: "exchange specifications", hi: "exchange specifications" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "step_1", anchor: { en: "standardized intervals", hi: "standardized intervals" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] }, hi: { display: hiBeats['b18'] } },
          visualCues: [{ target: "step_3", anchor: { en: "LEAPS", hi: "LEAPS" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Corporate Actions & Stock Splits
    {
      id: "s06",
      index: 6,
      title: "Corporate Actions: Mathematical Adjustment for Stock Splits",
      purpose: "Derive the exact mathematical formulas used by OCC to adjust option strikes and contract sizes for splits",
      takeaways: [
        "For an N-for-M stock split, post-split strike K' = K * (M / N)",
        "The number of shares covered by the option increases to 100 * (N / M)",
        "The total economic commitment (Strike * Shares) remains completely unchanged"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "OCC Stock Split Adjustment Mathematics",
        formula: "K' = K \\times \\frac{M}{N}, \\quad Q' = Q \\times \\frac{N}{M}",
        steps: [
          { label: "Step 1: Identify Split Ratio", detail: "In an N-for-M split, an investor receives N shares for every M shares previously held." },
          { label: "Step 2: Strike Price Scaling", detail: "Multiply pre-split strike K by (M / N) to scale down strike in exact proportion to stock price." },
          { label: "Step 3: Contract Size Adjustment", detail: "Multiply share size Q (100) by (N / M) so total deliverable shares scale up." },
          { label: "Step 4: Economic Invariance Check", detail: "Pre-split commitment = K * Q; Post-split commitment = K' * Q' = [K*(M/N)] * [Q*(N/M)] = K * Q." }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Corporate actions", hi: "Corporate actions" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "step_1", anchor: { en: "N-for-M stock split", hi: "N-for-M stock split" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "step_3", anchor: { en: "economic commitment", hi: "economic commitment" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: Cash Dividend Dilemma
    {
      id: "s07",
      index: 7,
      title: "The Cash Dividend Dilemma: Why Regular Dividends are Unprotected",
      purpose: "Explain why options are not adjusted for regular cash dividends and how ex-dividend drops affect option values",
      takeaways: [
        "Exchange options are not adjusted for ordinary cash dividends",
        "On the ex-dividend date, the stock drops by the dividend amount",
        "This ex-dividend drop decreases call values and increases put values, pricing into market premiums"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Dividend Impact on Unprotected Option Contracts",
        left: {
          title: "Impact on Call Options",
          items: [
            "Stock price drops by dividend D on ex-dividend date: S_ex = S - D",
            "Call option intrinsic value falls: max(S - D - K, 0) < max(S - K, 0)",
            "Call holders do not receive the dividend cash payment",
            "Creates powerful incentive for deep ITM calls to be exercised early before ex-date"
          ]
        },
        right: {
          title: "Impact on Put Options",
          items: [
            "Stock price drop increases put intrinsic value: max(K - (S - D), 0) > max(K - S, 0)",
            "Put options gain value from dividend distributions",
            "Market prices reflect anticipated dividends, lowering call premiums and raising put premiums",
            "No contractual strike adjustment is made by the OCC"
          ]
        }
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "left_title", anchor: { en: "cash dividend dilemma", hi: "cash dividend dilemma" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "left_items", anchor: { en: "ex-dividend date", hi: "ex-dividend date" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "right_items", anchor: { en: "early exercise incentive", hi: "early exercise incentive" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: Case Study: Gucci Extraordinary Dividend
    {
      id: "s08",
      index: 8,
      title: "Case Study: The Gucci Extraordinary Dividend Exception",
      purpose: "Examine the extraordinary dividend exception to option protection rules using the Gucci 2004 case",
      takeaways: [
        "When cash dividends exceed a major threshold (e.g. 10% of stock price), they qualify as extraordinary",
        "In 2004, Gucci paid a huge 13.50 EUR extraordinary cash dividend",
        "The exchange adjusted option strikes downwards by the extraordinary cash dividend amount to prevent unfair loss"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Gucci 2004 Extraordinary Dividend Ruling",
        steps: [
          { label: "1. Massive Distribution", detail: "Gucci announced a special extraordinary cash dividend of 13.50 EUR per share" },
          { label: "2. Unfair Harm Threat", detail: "Unadjusted calls would lose up to 13.50 EUR instantly without compensation" },
          { label: "3. Exchange Committee Ruling", detail: "Derivatives exchange committee classified payment as extraordinary corporate restructuring" },
          { label: "4. Strike Reduction Remedy", detail: "All option strikes adjusted downward by the exact 13.50 EUR extraordinary dividend" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "step_0", anchor: { en: "fascinating real-world exception", hi: "real-world exception" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Gucci", hi: "Gucci" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_3", anchor: { en: "exchange committee", hi: "exchange committee" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Calculating Post-Split Option Adjustments",
      purpose: "Test student mastery of stock split adjustments for strike and deliverable share quantity",
      takeaways: [
        "A 3-for-1 split reduces a $150 strike option to $50",
        "The number of shares covered triples from 100 to 300 shares",
        "Total exercise commitment remains exactly $50 * 300 = $15,000"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "An investor holds a call option contract covering 100 shares of stock with a strike price of $150. The company executes a 3-for-1 stock split. What are the adjusted strike price and number of shares covered?",
        options: [
          { label: "Option A", text: "Strike $50, covering 100 shares" },
          { label: "Option B", text: "Strike $50, covering 300 shares" },
          { label: "Option C", text: "Strike $150, covering 300 shares" },
          { label: "Option D", text: "Strike $450, covering 33.3 shares" }
        ],
        correctIndex: 1,
        explanation: "In a 3-for-1 split: K' = $150 * (1/3) = $50. Deliverable shares Q' = 100 * (3/1) = 300 shares. Total value = $50 * 300 = $15,000, identical to pre-split $150 * 100."
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
          visualCues: [{ target: "options_grid", anchor: { en: "three-for-one stock split", hi: "three-for-one stock split" } }],
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

    // Scene 10: Option Symbols & Quote Reading
    {
      id: "s10",
      index: 10,
      title: "Option Symbols & Quote Reading: Navigating Option Chains",
      purpose: "Deconstruct the standardized 21-character OCC option symbology and explain option chain reading",
      takeaways: [
        "The OCC option symbol encapsulates root ticker, expiration date, option type (C/P), and strike",
        "Option chains display bid, ask, last price, volume, and open interest for call and put strikes",
        "Open interest measures active outstanding contracts, indicating institutional liquidity"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Standard OCC Option Symbology Deconstruction",
        steps: [
          { label: "Root Symbol", detail: "Up to 6 letters representing underlying stock (e.g. AAPL)" },
          { label: "Expiration Date", detail: "6 digits YYMMDD representing exact expiration date (e.g. 260320 for March 20, 2026)" },
          { label: "Option Type", detail: "Single character: 'C' for Call or 'P' for Put" },
          { label: "Strike Price", detail: "8 digits: 5 digits dollar value + 3 digits decimal cents (e.g. 00150000 = $150.00)" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_0", anchor: { en: "standardized symbology", hi: "standardized symbology" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_1", anchor: { en: "twenty-one character OCC symbol", hi: "twenty-one character OCC symbol" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Open interest", hi: "Open interest" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Option Contract Specifications",
      purpose: "Consolidate the 8 essential rules of option contract mechanics, adjustments, and trading rules",
      takeaways: [
        "Options give unilateral rights to buyers while writers carry legal fulfillment obligations",
        "Stock splits scale strikes down and shares up to maintain total dollar invariance",
        "Ordinary cash dividends are unprotected, creating powerful early-exercise incentives on calls"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Core Rules of Option Contract Specifications",
        rules: [
          { number: 1, title: "Asymmetric Right", text: "Option buyers purchase rights; option writers carry binding performance obligations." },
          { number: 2, title: "Style Flexibility", text: "American options permit early exercise anytime; European options exercise only at expiry." },
          { number: 3, title: "Moneyness Deconstruction", text: "Option price equals Intrinsic Value plus Time Value; OTM options hold zero intrinsic value." },
          { number: 4, title: "Underlying Multiplier", text: "Standard equity contracts cover exactly 100 shares of underlying stock." },
          { number: 5, title: "Split Invariance", text: "N-for-M splits multiply strike by (M/N) and shares by (N/M), preserving contract value." },
          { number: 6, title: "Unprotected Dividends", text: "Ordinary cash dividends reduce stock price without contract adjustment, hurting calls." },
          { number: 7, title: "Extraordinary Exceptions", text: "Special restructuring dividends trigger exchange committee strike price reductions." },
          { number: 8, title: "Plumbing Mastery", text: "Navigate OCC option chains and open interest to evaluate market liquidity and depth." }
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
console.log('Chapter 10 Part 1 successfully built!');
