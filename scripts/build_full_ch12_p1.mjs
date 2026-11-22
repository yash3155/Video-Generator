import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch12/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_12/Part_01/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap12_part01/episode_raw.json', 'utf8'));

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

// 1. Facts with full numerical grounding from Chapter 12 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch12",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Principal-Protected Notes (PPNs): Structured product combining a zero-coupon bond guaranteeing return of principal at maturity T with a call option providing equity upside participation.",
      citation: { chapter: "12", section: "12.1", page: "287" }
    },
    {
      id: "F02",
      category: "case_study",
      statement: "In Hull Section 12.1 PPN example: Risk-free rate = 6%, 3-year term. Present value of $1,000 principal = 1000 * exp(-0.06 * 3) = $835.27. Remaining $164.73 ($1,000 - $835.27) purchases at-the-money call options.",
      citation: { chapter: "12", section: "12.1", page: "288" }
    },
    {
      id: "F03",
      category: "definition",
      statement: "Covered Call vs. Protective Put: Covered Call (Long Stock + Short Call) trades away upside above strike K in exchange for upfront income. Protective Put (Long Stock + Long Put) buys downside insurance while preserving upside.",
      citation: { chapter: "12", section: "12.1", page: "289" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Bull Call Spread: Long Call with lower strike K1 (cost c1) + Short Call with higher strike K2 (income c2). Max Profit = (K2 - K1) - Net Debit. Max Loss = Net Debit = c1 - c2. Breakeven = K1 + Net Debit.",
      citation: { chapter: "12", section: "12.2", page: "291" }
    },
    {
      id: "F05",
      category: "case_study",
      statement: "Hull Section 12.2 Bull Spread Example: Buy Call K1 = $30 for c1 = $3.00, Sell Call K2 = $35 for c2 = $1.00. Net Debit = $2.00. Max Profit = ($35 - $30) - $2 = $3.00. Max Loss = $2.00. Breakeven = $30 + $2 = $32.00.",
      citation: { chapter: "12", section: "12.2", page: "292" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Bear Spread: Designed to profit from moderately falling prices. Bear Put Spread (Debit): Buy Put K2, Sell Put K1. Bear Call Spread (Credit): Sell Call K1, Buy Call K2.",
      citation: { chapter: "12", section: "12.2", page: "294" }
    },
    {
      id: "F07",
      category: "formula",
      statement: "Box Spread: Combination of Bull Call Spread (strikes K1, K2) + Bear Put Spread (strikes K1, K2). Payoff is identically equal to K2 - K1 at maturity in ALL economic states, replicating a pure risk-free zero-coupon bond. Value today = (K2 - K1) * exp(-r*T).",
      citation: { chapter: "12", section: "12.2", page: "296" }
    },
    {
      id: "F08",
      category: "market_rule",
      statement: "Greeks Dynamics in Vertical Spreads: Delta is positive for Bull spreads, negative for Bear spreads. Gamma and Vega peak when underlying price is near active strikes and decay rapidly toward expiration.",
      citation: { chapter: "12", section: "12.2", page: "298" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch12",
  partId: "p1",
  title: "Trading Strategies Involving Options - Part 1",
  subtitle: "Principal-Protected Notes, Covered Calls, Vertical Spreads & Box Spread Arbitrage",
  targetAudience: "Options traders, structured product developers, risk managers, and quantitative strategists",
  prerequisites: ["Chapter 10 Options Mechanics", "Chapter 11 Put-Call Parity", "Payoff diagrams"],
  scenes: [
    { sceneId: "s00", title: "The Asymmetry Engine: Engineering Custom Risk Profiles", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Capital Preservation vs Upside Participation", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "Principal-Protected Notes: Zero-Coupon Bonds + Options", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "Covered Calls vs Protective Puts: Income vs Insurance", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "The Four Archetypes of Vertical Spreads", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Bull Call Spread: Mathematical Mechanics & Hull Example", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "Bull Put Spread: Credit Generation & Downside Cushion", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "Bear Put Spreads vs Bear Call Spreads", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "Box Spreads: Replicating a Pure Risk-Free Zero-Coupon Bond", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: Bull Call Spread Profit & Breakeven Calculation", beats: ["s09b1", "s09b2", "s09b3", "s09b4"] },
    { sceneId: "s10", title: "The Greeks Impact on Spreads: Delta, Theta, Vega Dynamics", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Core Strategy Laws", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch12",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "Bull Call Spread Maximum Profit & Loss",
      latex: "\\text{Max Profit} = (K_2 - K_1) - (c_1 - c_2), \\quad \\text{Max Loss} = c_1 - c_2",
      variables: [
        { symbol: "K_1", description: "Lower strike price bought", unit: "currency" },
        { symbol: "K_2", description: "Higher strike price sold", unit: "currency" },
        { symbol: "c_1", description: "Premium paid for lower strike call", unit: "currency" },
        { symbol: "c_2", description: "Premium received for higher strike call", unit: "currency" }
      ]
    },
    {
      id: "M02",
      name: "Box Spread Theoretical Valuation",
      latex: "V_{\\text{box}} = (K_2 - K_1) e^{-rT}",
      variables: [
        { symbol: "V_box", description: "No-arbitrage market value of box spread today", unit: "currency" },
        { symbol: "K_2 - K_1", description: "Guaranteed payoff difference between strikes", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch12",
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
  chapterId: "ch12",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 12",
  partLabel: "Part 1",
  title: "Trading Strategies Involving Options - Part 1",
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
    // Scene 0: Asymmetry Engine
    {
      id: "s00",
      index: 0,
      title: "The Asymmetry Engine: Engineering Custom Risk Profiles",
      purpose: "Establish how combining options, underlying assets, and cash creates custom payoff architectures",
      takeaways: [
        "Options are modular financial building blocks that can engineer any desired payoff profile",
        "Traders can sculpt non-linear returns to profit from directional moves, range-bound markets, or volatility",
        "Part 1 covers Principal-Protected Notes, Covered Calls, Bull/Bear Spreads, and Box Spreads"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Option Payoff Engineering Spectrum",
        steps: [
          { label: "1. Asset + Option Combos", detail: "Covered calls generate yield; protective puts provide portfolio crash insurance" },
          { label: "2. Structured Capital Notes", detail: "Zero-coupon bonds guarantee principal; embedded call options capture equity growth" },
          { label: "3. Vertical Spreads", detail: "Buy one strike, sell another strike in same expiration; cap risk and reduce entry cost" },
          { label: "4. Synthetic Arbitrage Boxes", detail: "Assemble 4 options to engineer a risk-free synthetic zero-coupon bond" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "modular financial building blocks", hi: "building blocks" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "sculpt any non-linear risk profile", hi: "risk profile" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "directional moves", hi: "directional moves" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "step_3", anchor: { en: "masterclass on Chapter Twelve", hi: "Chapter Twelve" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: Capital Preservation vs Upside
    {
      id: "s01",
      index: 1,
      title: "Capital Preservation vs Upside Participation",
      purpose: "Examine institutional asset allocation trade-off between downside capital protection and equity growth",
      takeaways: [
        "Conservative investors demand 100% capital preservation but refuse zero-yield cash",
        "Options enable structuring asymmetric instruments delivering guaranteed floor plus upside",
        "Understanding option payoffs allows structurers to create tailor-made risk products"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Traditional Fixed Income vs. Asymmetric Option Structuring",
        left: {
          title: "Traditional Fixed Income",
          items: [
            "Invest 100% in government Treasury bonds or cash deposits",
            "Guarantees return of principal at maturity",
            "Zero participation in equity market bull runs or technological growth",
            "Suffers purchasing power loss if inflation exceeds nominal bond yield"
          ]
        },
        right: {
          title: "Asymmetric Structured Product",
          items: [
            "Invest majority in zero-coupon bond to guarantee 100% principal repayment",
            "Invest remaining interest budget into equity call options",
            "Preserves 100% capital guarantee while unlocking equity upside",
            "Combines bond floor with non-linear option convex upside"
          ]
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "left_title", anchor: { en: "universal dilemma", hi: "universal dilemma" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Traditional fixed income", hi: "Traditional fixed income" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "right_title", anchor: { en: "Asymmetric Structured Products", hi: "Structured Products" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "right_items", anchor: { en: "convex upside", hi: "convex upside" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: Principal-Protected Notes
    {
      id: "s02",
      index: 2,
      title: "Principal-Protected Notes: Zero-Coupon Bonds + Options",
      purpose: "Formulate Principal-Protected Note mechanics and solve Hull Section 12.1 numerical example",
      takeaways: [
        "A PPN splits capital into a Zero-Coupon Bond (principal guarantee) and Call Option (equity participation)",
        "In Hull's example: at r=6%, 3 years, $1,000 note buys $835.27 zero-coupon bond",
        "The remaining $164.73 interest budget purchases at-the-money call options"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Hull Section 12.1 PPN Financial Engineering Blueprint",
        steps: [
          { label: "1. Total Capital Allocated", detail: "Investor deposits $1,000 principal for a 3-year term at risk-free rate r = 6%" },
          { label: "2. Zero-Coupon Bond Purchase", detail: "Cost = $1,000 * exp(-0.06 * 3) = $835.27. Grows deterministically to $1,000 at year 3" },
          { label: "3. Option Budget Generation", detail: "Surplus cash = $1,000 - $835.27 = $164.73 available for optionality" },
          { label: "4. Embedded Call Option", detail: "Spend $164.73 on stock index call options; delivers capital protection + equity gain" }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Principal-Protected Note", hi: "Principal-Protected Note" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "step_1", anchor: { en: "zero-coupon bond", hi: "zero-coupon bond" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "step_2", anchor: { en: "one hundred sixty-four dollars", hi: "one hundred sixty-four dollars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "step_3", anchor: { en: "equity participation", hi: "equity participation" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: Covered Calls vs Protective Puts
    {
      id: "s03",
      index: 3,
      title: "Covered Calls vs Protective Puts: Income vs Insurance",
      purpose: "Contrast the risk/reward profiles of Covered Calls (income-generating) and Protective Puts (hedging)",
      takeaways: [
        "Covered Call = Long Stock + Short Call; generates upfront premium income but caps upside at strike K",
        "Protective Put = Long Stock + Long Put; pays premium to lock in an unbreakable downside floor",
        "By Put-Call Parity, Covered Call is synthetically equivalent to Short Put; Protective Put is equivalent to Long Call"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Payoff Decomposition: Covered Calls vs. Protective Puts",
        formula: "\\text{Covered Call} = S_T - \\max(S_T - K, 0), \\quad \\text{Protective Put} = S_T + \\max(K - S_T, 0)",
        steps: [
          { label: "Covered Call Payoff", detail: "When S_T <= K: S_T + Premium; When S_T > K: K + Premium. Upside strictly capped at K." },
          { label: "Covered Call Parity Identity", detail: "Long Stock + Short Call = Short Put + Cash (via Put-Call Parity: S - c = K*exp(-rT) - p)." },
          { label: "Protective Put Payoff", detail: "When S_T <= K: K - Premium; When S_T > K: S_T - Premium. Downside strictly floored at K." },
          { label: "Protective Put Parity Identity", detail: "Long Stock + Long Put = Long Call + Cash (S + p = c + K*exp(-rT))." }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Covered Calls and Protective Puts", hi: "Covered Calls and Protective Puts" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Covered Call", hi: "Covered Call" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Protective Put", hi: "Protective Put" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Put-Call Parity equivalence", hi: "Put-Call Parity equivalence" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: Four Archetypes of Vertical Spreads
    {
      id: "s04",
      index: 4,
      title: "The Four Archetypes of Vertical Spreads",
      purpose: "Classify the four vertical spreads by market outlook and premium flow (debit vs credit)",
      takeaways: [
        "Vertical spreads combine long and short options of the same type and expiration with different strikes",
        "Bullish outlooks use Bull Call Spreads (debit) or Bull Put Spreads (credit)",
        "Bearish outlooks use Bear Put Spreads (debit) or Bear Call Spreads (credit)"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "The 2x2 Vertical Spread Taxonomy Matrix",
        left: {
          title: "Bullish Vertical Spreads",
          items: [
            "Bull Call Spread (Debit): Buy Call K1, Sell Call K2 (K1 < K2); pay upfront debit, profit on rise",
            "Bull Put Spread (Credit): Sell Put K2, Buy Put K1 (K1 < K2); collect upfront credit, profit if flat/up",
            "Both strategies benefit when underlying stock price rallies toward or above K2",
            "Capped upside matched with strictly capped maximum risk"
          ]
        },
        right: {
          title: "Bearish Vertical Spreads",
          items: [
            "Bear Put Spread (Debit): Buy Put K2, Sell Put K1 (K1 < K2); pay upfront debit, profit on drop",
            "Bear Call Spread (Credit): Sell Call K1, Buy Call K2 (K1 < K2); collect upfront credit, profit if flat/down",
            "Both strategies benefit when underlying stock price drops toward or below K1",
            "Downside profit capped below K1 with limited maximum loss above K2"
          ]
        }
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Vertical Spreads", hi: "Vertical Spreads" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] }, hi: { display: hiBeats['b18'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Bull spreads", hi: "Bull spreads" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "right_items", anchor: { en: "Bear spreads", hi: "Bear spreads" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "right_title", anchor: { en: "Debit versus Credit spreads", hi: "Debit versus Credit" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: Bull Call Spread Mechanics
    {
      id: "s05",
      index: 5,
      title: "Bull Call Spread: Mathematical Mechanics & Hull Example",
      purpose: "Examine the detailed payout formula and solve Hull Section 12.2 Bull Call Spread example",
      takeaways: [
        "In Hull's example: Buy K1=$30 call for $3.00, Sell K2=$35 call for $1.00; Net Debit = $2.00",
        "Maximum Profit = ($35 - $30) - $2.00 = $3.00 per share ($300 per contract)",
        "Maximum Loss = Net Debit = $2.00 per share ($200 per contract); Breakeven = $30 + $2 = $32.00"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Hull Section 12.2 Bull Call Spread Architecture",
        steps: [
          { label: "1. Position Construction", detail: "Buy 1 Call Strike $30 (pay $3.00), Sell 1 Call Strike $35 (receive $1.00)" },
          { label: "2. Net Investment Debit", detail: "Initial Cost = $3.00 - $1.00 = $2.00 per share ($200 per 100-share contract)" },
          { label: "3. Maximum Gain Cap", detail: "At S_T >= $35: Payoff = $35 - $30 = $5.00. Net Profit = $5.00 - $2.00 = $3.00 ($300)" },
          { label: "4. Maximum Loss Floor", detail: "At S_T <= $30: Both calls expire worthless. Net Loss = $2.00 ($200); Breakeven = $32.00" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Bull Call Spread", hi: "Bull Call Spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "step_1", anchor: { en: "John Hull's baseline example", hi: "baseline example" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Maximum profit", hi: "Maximum profit" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "step_3", anchor: { en: "breakeven stock price", hi: "breakeven" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Bull Put Spread Credit Generation
    {
      id: "s06",
      index: 6,
      title: "Bull Put Spread: Credit Generation & Downside Cushion",
      purpose: "Analyze the Bull Put Spread: credit generation, profit zones, and max loss formulas",
      takeaways: [
        "Bull Put Spread is an income-generating credit spread: sell put K2 (higher strike), buy put K1 (lower strike)",
        "Maximum Profit equals the net credit received upfront, captured if stock remains above K2",
        "Maximum Loss equals (K2 - K1) minus Net Credit; Breakeven equals K2 minus Net Credit"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Bull Put Credit Spread Valuation Mechanics",
        formula: "\\text{Max Profit} = \\text{Net Credit}, \\quad \\text{Max Loss} = (K_2 - K_1) - \\text{Net Credit}",
        steps: [
          { label: "Net Credit Inflow", detail: "\\text{Net Credit} = p_2 - p_1 > 0; writer collects upfront cash immediately upon entry." },
          { label: "Zone 1: S_T >= K2 (Full Profit)", detail: "Both puts expire worthless; trader retains 100% of upfront net credit." },
          { label: "Zone 2: K1 < S_T < K2 (Partial Loss)", detail: "Short put is assigned; net profit = Net Credit - (K2 - S_T); breakeven = K2 - Net Credit." },
          { label: "Zone 3: S_T <= K1 (Maximum Loss)", detail: "Both puts in the money; net loss capped at (K2 - K1) - Net Credit." }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Bull Put Spread", hi: "Bull Put Spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_0", anchor: { en: "credit spread", hi: "credit spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_1", anchor: { en: "maximum gain", hi: "maximum gain" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b28'] }, hi: { display: hiBeats['b28'] } },
          visualCues: [{ target: "step_3", anchor: { en: "maximum downside risk", hi: "maximum downside risk" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: Bear Spreads Comparison
    {
      id: "s07",
      index: 7,
      title: "Bear Put Spreads vs Bear Call Spreads",
      purpose: "Examine bearish strategies: Bear Put Spread (debit) vs Bear Call Spread (credit)",
      takeaways: [
        "Bear Put Spread buys higher strike put K2 and sells lower strike put K1 (pays net debit)",
        "Bear Call Spread sells lower strike call K1 and buys higher strike call K2 (collects net credit)",
        "Both strategies cap risk and profit from downward or stagnant underlying price movement"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Bear Spread Execution Architectures",
        steps: [
          { label: "1. Bear Put Spread (Debit)", detail: "Buy Put K2 (pay p2), Sell Put K1 (receive p1). Net Cost = p2 - p1 > 0" },
          { label: "2. Bear Put Payout", detail: "Max Profit = (K2 - K1) - Net Debit at S_T <= K1; Max Loss = Net Debit at S_T >= K2" },
          { label: "3. Bear Call Spread (Credit)", detail: "Sell Call K1 (receive c1), Buy Call K2 (pay c2). Net Credit = c1 - c2 > 0" },
          { label: "4. Bear Call Payout", detail: "Max Profit = Net Credit at S_T <= K1; Max Loss = (K2 - K1) - Net Credit at S_T >= K2" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b29'] }, hi: { display: hiBeats['b29'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Bear spreads", hi: "Bear spreads" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b30'] }, hi: { display: hiBeats['b30'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Bear Put Spread", hi: "Bear Put Spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Bear Call Spread", hi: "Bear Call Spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_3", anchor: { en: "credit buffer", hi: "credit buffer" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: Box Spreads
    {
      id: "s08",
      index: 8,
      title: "Box Spreads: Replicating a Pure Risk-Free Zero-Coupon Bond",
      purpose: "Deconstruct the Box Spread into Bull Call Spread + Bear Put Spread, proving risk-free payoff K2 - K1",
      takeaways: [
        "A Box Spread pairs a Bull Call Spread (strikes K1, K2) with a Bear Put Spread (strikes K1, K2)",
        "Terminal payoff is identically equal to K2 - K1 in ALL economic states with zero market risk",
        "No-arbitrage value today must equal (K2 - K1) * exp(-rT); deviations allow pure borrowing/lending arbitrage"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Box Spread Synthetic Bond Proof",
        formula: "V_{\\text{box}} = (K_2 - K_1) e^{-rT}",
        steps: [
          { label: "Component 1: Bull Call Spread", detail: "Buy Call K1, Sell Call K2. Payoff: 0 (if S<=K1), S-K1 (if K1<S<K2), K2-K1 (if S>=K2)." },
          { label: "Component 2: Bear Put Spread", detail: "Buy Put K2, Sell Put K1. Payoff: K2-K1 (if S<=K1), K2-S (if K1<S<K2), 0 (if S>=K2)." },
          { label: "Summed Payoff Everywhere", detail: "Payoff_box = (Payoff_CallSpread) + (Payoff_PutSpread) = K2 - K1 in ALL states!" },
          { label: "No-Arbitrage Valuation", detail: "A constant deterministic payoff of (K2 - K1) is a zero-coupon bond; Value = (K2 - K1)*exp(-rT)." }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Box Spread", hi: "Box Spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b34'] }, hi: { display: hiBeats['b34'] } },
          visualCues: [{ target: "step_0", anchor: { en: "four distinct option legs", hi: "four option legs" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b35'] }, hi: { display: hiBeats['b35'] } },
          visualCues: [{ target: "step_2", anchor: { en: "zero-coupon government bond", hi: "zero-coupon bond" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b36'] }, hi: { display: hiBeats['b36'] } },
          visualCues: [{ target: "step_3", anchor: { en: "borrowing or lending facility", hi: "borrowing or lending" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Bull Call Spread Profit & Breakeven Calculation",
      purpose: "Test quantitative calculation of max profit, max loss, and breakeven for a bull call spread",
      takeaways: [
        "Given K1 = $50 (c1 = $5.00) and K2 = $60 (c2 = $1.50): Net Debit = $5.00 - $1.50 = $3.50",
        "Max Profit = (K2 - K1) - Net Debit = ($60 - $50) - $3.50 = $6.50 per share ($650 per contract)",
        "Breakeven = K1 + Net Debit = $50 + $3.50 = $53.50"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A trader establishes a Bull Call Spread by buying a 6-month call with strike K1 = $50 for $5.00 and selling a 6-month call with strike K2 = $60 for $1.50. What are the Maximum Profit per share and Breakeven stock price?",
        options: [
          { label: "Option A", text: "Max Profit $10.00, Breakeven $50.00" },
          { label: "Option B", text: "Max Profit $6.50, Breakeven $53.50" },
          { label: "Option C", text: "Max Profit $3.50, Breakeven $55.00" },
          { label: "Option D", text: "Max Profit $8.50, Breakeven $51.50" }
        ],
        correctIndex: 1,
        explanation: "Net Debit = $5.00 - $1.50 = $3.50. Maximum Profit = Strike Difference ($60 - $50) - Net Debit ($3.50) = $6.50 per share ($650 per contract). Breakeven = K1 + Net Debit = $50 + $3.50 = $53.50."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b37'] }, hi: { display: hiBeats['b37'] } },
          visualCues: [{ target: "question_box", anchor: { en: "test your quantitative command", hi: "quantitative command" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b38'] }, hi: { display: hiBeats['b38'] } },
          visualCues: [{ target: "options_grid", anchor: { en: "fifty dollars", hi: "fifty dollars" } }],
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

    // Scene 10: Greeks Impact on Spreads
    {
      id: "s10",
      index: 10,
      title: "The Greeks Impact on Spreads: Delta, Theta, Vega Dynamics",
      purpose: "Examine Greek sensitivity profiles for vertical spreads: Delta, Theta decay, and Vega volatility exposure",
      takeaways: [
        "Net Delta of a Bull Spread is positive; Net Delta of a Bear Spread is negative",
        "Debit spreads suffer negative Theta when OTM and benefit from positive Theta when ITM",
        "Vega exposure is lower in spreads than single options because long and short legs offset each other"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Greeks Dynamics Across Vertical Spread Lifecycle",
        steps: [
          { label: "1. Net Delta Direction", detail: "Bull Spread has net positive Delta (benefits from rallies); Bear Spread has net negative Delta" },
          { label: "2. Delta Cushioning", detail: "Selling higher strike call dampens position Delta, reducing exposure to adverse moves" },
          { label: "3. Theta Time Decay", detail: "When underlying is between strikes, short option decays faster, creating favorable Theta drift" },
          { label: "4. Vega Hedging", detail: "Long Vega on K1 offset by Short Vega on K2; spreads are significantly more volatility-insulated" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b41'] }, hi: { display: hiBeats['b41'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Option Greeks", hi: "Option Greeks" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b42'] }, hi: { display: hiBeats['b42'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Net Delta", hi: "Net Delta" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b43'] }, hi: { display: hiBeats['b43'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Theta decay", hi: "Theta decay" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b44'] }, hi: { display: hiBeats['b44'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Vega sensitivity", hi: "Vega sensitivity" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Core Strategy Laws",
      purpose: "Consolidate the 8 essential rules of vertical spreads, structured notes, and box spreads",
      takeaways: [
        "PPNs fuse zero-coupon bonds with calls to guarantee principal while capturing equity upside",
        "Vertical spreads cap both risk and reward, reducing entry debit through leg offsetting",
        "Box spreads assemble four options to engineer a pure synthetic risk-free bond; Part 2 covers Straddles & Condors"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Foundational Laws of Option Trading Strategies",
        rules: [
          { number: 1, title: "Structured Protection", text: "PPNs allocate bond present value to floor principal and residual interest to options." },
          { number: 2, title: "Covered Call Income", text: "Covered calls harvest option premium by capping upside above strike K." },
          { number: 3, title: "Protective Put Insurance", text: "Protective puts buy downside crash protection while preserving upside." },
          { number: 4, title: "Bull Spread Architecture", text: "Buy low strike K1, sell high strike K2; max profit = (K2 - K1) minus net debit." },
          { number: 5, title: "Credit Spread Cushion", text: "Bull put spreads collect upfront credit, maximizing profit when asset stays above K2." },
          { number: 6, title: "Bearish Directionality", text: "Bear put (debit) and bear call (credit) spreads cap risk on declining assets." },
          { number: 7, title: "Box Spread Bond", text: "Box spreads generate fixed risk-free payoff K2 - K1, pricing identically to zero-coupon debt." },
          { number: 8, title: "Volatility Strategies Ahead", text: "In Part Two, we master Straddles, Strangles, Butterfly Spreads, and Condors." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b45'] }, hi: { display: hiBeats['b45'] } },
          visualCues: [{ target: "rule_1", anchor: { en: "four core strategy laws", hi: "chaar strategy laws" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b46'] }, hi: { display: hiBeats['b46'] } },
          visualCues: [{ target: "rule_2", anchor: { en: "Law One", hi: "Law One" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b47'] }, hi: { display: hiBeats['b47'] } },
          visualCues: [{ target: "rule_4", anchor: { en: "Law Two", hi: "Law Two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b48'] }, hi: { display: hiBeats['b48'] } },
          visualCues: [{ target: "rule_5", anchor: { en: "Law Three", hi: "Law Three" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b5",
          speaker: "instructor",
          narration: { en: { display: enBeats['b49'] }, hi: { display: hiBeats['b49'] } },
          visualCues: [{ target: "rule_7", anchor: { en: "Law Four", hi: "Law Four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b6",
          speaker: "instructor",
          narration: { en: { display: enBeats['b50'] }, hi: { display: hiBeats['b50'] } },
          visualCues: [{ target: "rule_8", anchor: { en: "Part Two", hi: "Part Two" } }],
          pauseAfterMs: 600
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));
console.log('Chapter 12 Part 1 successfully built!');
