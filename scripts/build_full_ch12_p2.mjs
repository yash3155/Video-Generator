import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch12/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_12/Part_02/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap12_part02/episode_raw.json', 'utf8'));

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

// 1. Facts with full numerical grounding from Chapter 12 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch12",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Calendar Spread (Time Spread): Strategy pairing options of the same strike price K but different expiration dates. Sells short-dated option to harvest accelerated Theta decay while buying longer-dated option.",
      citation: { chapter: "12", section: "12.3", page: "300" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "Long Straddle: Simultaneously buying a call and a put with the same strike K and expiration date T. Initial Cost = c + p. Payoff = max(S_T - K, K - S_T) = |S_T - K|. Maximum Loss = c + p (at S_T = K). Upper Breakeven = K + (c + p); Lower Breakeven = K - (c + p).",
      citation: { chapter: "12", section: "12.4", page: "303" }
    },
    {
      id: "F03",
      category: "case_study",
      statement: "Hull Section 12.4 Straddle Example: S0 = $69, K = $70, c = $4.00, p = $3.00. Total Cost = $7.00. Max loss = $7.00. Upper Breakeven = $70 + $7 = $77.00. Lower Breakeven = $70 - $7 = $63.00.",
      citation: { chapter: "12", section: "12.4", page: "304" }
    },
    {
      id: "F04",
      category: "definition",
      statement: "Strips and Straps (Asymmetric Straddles): A Strip combines 1 Call + 2 Puts (bearish volatility bias). A Strap combines 2 Calls + 1 Put (bullish volatility bias), both sharing the same strike K and expiration T.",
      citation: { chapter: "12", section: "12.4", page: "306" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Long Strangle: Buying an out-of-the-money put with strike K1 and an out-of-the-money call with strike K2 (K1 < K2) with same expiration T. Costs strictly less than a straddle (c2 + p1 < c + p), but requires a larger price move to reach profitability. Upper Breakeven = K2 + (c2 + p1); Lower Breakeven = K1 - (c2 + p1).",
      citation: { chapter: "12", section: "12.4", page: "308" }
    },
    {
      id: "F06",
      category: "case_study",
      statement: "Hull Section 12.4 Strangle Example: S0 = $54, Put strike K1 = $50 (p = $1.50), Call strike K2 = $60 (c = $2.00). Total Cost = $3.50. Max Loss = $3.50 (if $50 <= S_T <= $60). Upper Breakeven = $60 + $3.50 = $63.50. Lower Breakeven = $50 - $3.50 = $46.50.",
      citation: { chapter: "12", section: "12.4", page: "309" }
    },
    {
      id: "F07",
      category: "market_rule",
      statement: "Business Snapshot 12.2: Earnings Announcements & Implied Volatility Crush: Prior to major earnings releases, implied volatility spikes sharply as uncertainty mounts. Immediately post-announcement, volatility collapses ('IV Crush'), causing long straddles and strangles to lose value even if the stock makes a significant move.",
      citation: { chapter: "12", section: "12.4", page: "311" }
    },
    {
      id: "F08",
      category: "market_rule",
      statement: "Master Strategy Matrix: Straddles maximize gamma and vega for explosive event moves; Strangles reduce dollar cost at the expense of a wider breakeven corridor; Calendar spreads monetize theta decay under range-bound consolidation.",
      citation: { chapter: "12", section: "12.5", page: "313" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch12",
  partId: "p2",
  title: "Trading Strategies Involving Options - Part 2",
  subtitle: "Calendar Spreads, Straddles, Strangles, Strips/Straps & The Earnings IV Crush",
  targetAudience: "Quantitative volatility traders, hedge fund portfolio managers, and derivatives risk specialists",
  prerequisites: ["Part 1 Spreads", "Option Greeks (Delta, Theta, Vega)", "Put-Call Parity"],
  scenes: [
    { sceneId: "s00", title: "The Non-Directional Edge: Trading Time and Volatility", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Directional Speculation vs Pure Volatility Trading", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "The Calendar Spread Engine: Exploiting Theta Acceleration", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "Neutral, Bullish & Bearish Calendar Spreads", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "The Long Straddle: Monetizing Explosive Market Disruption", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "The Short Straddle: High-Stakes Volatility Selling", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "Asymmetric Volatility Bets: Strips and Straps", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "The Strangle: Widening the Corridor to Slash Premium Outlay", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "Business Snapshot 12.2: Earnings Announcements & The IV Crush Trap", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: Straddle Breakeven & Payoff Calculation", beats: ["s09b1", "s09b2", "s09b3", "s09b4"] },
    { sceneId: "s10", title: "Master Strategy Matrix: Straddle vs Strangle vs Calendar", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Core Volatility & Time Trading Laws", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch12",
  partId: "p2",
  formulas: [
    {
      id: "M01",
      name: "Long Straddle Payoff and Breakevens",
      latex: "\\text{Payoff} = |S_T - K| - (c + p), \\quad \\text{BE}_{\\text{upper}} = K + (c + p), \\quad \\text{BE}_{\\text{lower}} = K - (c + p)",
      variables: [
        { symbol: "S_T", description: "Stock price at expiration", unit: "currency" },
        { symbol: "K", description: "Strike price of call and put", unit: "currency" },
        { symbol: "c + p", description: "Combined premium paid for straddle", unit: "currency" }
      ]
    },
    {
      id: "M02",
      name: "Long Strangle Payoff and Breakevens",
      latex: "\\text{Payoff} = \\max(S_T - K_2, 0) + \\max(K_1 - S_T, 0) - (c_2 + p_1)",
      variables: [
        { symbol: "K_1", description: "Lower put strike price", unit: "currency" },
        { symbol: "K_2", description: "Higher call strike price", unit: "currency" },
        { symbol: "c_2 + p_1", description: "Combined premium paid for strangle", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch12",
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
  chapterId: "ch12",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 12",
  partLabel: "Part 2",
  title: "Trading Strategies Involving Options - Part 2",
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
    // Scene 0: Non-Directional Edge
    {
      id: "s00",
      index: 0,
      title: "The Non-Directional Edge: Trading Time and Volatility",
      purpose: "Establish non-directional trading: isolating implied volatility and time decay from price direction",
      takeaways: [
        "Traditional investing requires predicting price direction; options allow trading volatility and time alone",
        "Traders can profit from the magnitude of a price move without knowing its direction",
        "Part 2 masters Calendar Spreads, Straddles, Strangles, Strips, Straps, and the Earnings IV Crush"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Volatility & Time Trading Architecture",
        steps: [
          { label: "1. Directional Neutrality", detail: "Construct Delta-neutral portfolios that eliminate reliance on market direction" },
          { label: "2. Volatility Monetization (Vega)", detail: "Trade Long Straddles/Strangles to profit from explosive realized volatility" },
          { label: "3. Time Decay Harvesting (Theta)", detail: "Execute Calendar Spreads to exploit non-linear time decay curvature" },
          { label: "4. Asymmetric Structuring", detail: "Deploy Strips (bearish bias) and Straps (bullish bias) for skewed volatility bets" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "non-directional edge", hi: "non-directional edge" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "magnitude of the move", hi: "magnitude of the move" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "time decay curvature", hi: "time decay curvature" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Part Two masterclass", hi: "Part Two masterclass" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: Directional vs Volatility
    {
      id: "s01",
      index: 1,
      title: "Directional Speculation vs Pure Volatility Trading",
      purpose: "Contrast directional trading (buying stock/calls) with delta-neutral volatility trading",
      takeaways: [
        "Directional bets require being right on both direction and timing",
        "Volatility bets profit purely on whether realized volatility exceeds implied volatility priced into premiums",
        "Delta neutrality insulates the portfolio against small underlying price oscillations"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Directional Speculation vs. Pure Volatility Trading",
        left: {
          title: "Directional Trading (Delta Dominant)",
          items: [
            "Trader predicts underlying asset will rise (Long Call/Stock) or fall (Long Put/Short)",
            "Profits depend directly on terminal price direction",
            "Suffers catastrophic losses if stock moves sharply in opposite direction",
            "Requires continuous forecasting of macroeconomic trend"
          ]
        },
        right: {
          title: "Pure Volatility Trading (Vega/Gamma Dominant)",
          items: [
            "Trader is completely agnostic to whether price rises or falls",
            "Profits depend strictly on whether price move exceeds option premium hurdle",
            "Captures huge gains from large explosive moves in either direction",
            "Delta neutral at inception; actively managed via gamma acceleration"
          ]
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Directional trading", hi: "Directional trading" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "left_items", anchor: { en: "directional bets", hi: "directional bets" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "right_title", anchor: { en: "Volatility trading", hi: "Volatility trading" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "right_items", anchor: { en: "Delta neutral at inception", hi: "Delta neutral" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: Calendar Spread Engine
    {
      id: "s02",
      index: 2,
      title: "The Calendar Spread Engine: Exploiting Theta Acceleration",
      purpose: "Explain the non-linear mechanics of time decay (Theta) and how Calendar Spreads monetize it",
      takeaways: [
        "Option time decay accelerates non-linearly in the final 30 to 45 days before expiration",
        "A Calendar Spread sells a near-term option and buys a longer-dated option of the same strike",
        "The short near-term option decays much faster than the long option, generating net positive Theta profit"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Non-Linear Theta Acceleration Engine",
        steps: [
          { label: "1. The Square-Root Time Decay Law", detail: "Option value decays proportional to sqrt(T); decay rate dV/dt explodes as T -> 0" },
          { label: "2. Front-Month Short Leg", detail: "Sell 30-day option experiencing maximum daily dollar decay (high negative Theta)" },
          { label: "3. Back-Month Long Leg", detail: "Buy 90-day option experiencing gentle, flat time decay (low negative Theta)" },
          { label: "4. Net Theta Harvesting", detail: "Net Theta is positive; trader pockets the differential rate of time decay" }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Calendar Spread engine", hi: "Calendar Spread engine" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Theta decay", hi: "Theta decay" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "step_2", anchor: { en: "differential decay rate", hi: "differential decay rate" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "step_3", anchor: { en: "neutral calendar spread", hi: "neutral calendar spread" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: Neutral, Bullish & Bearish Calendars
    {
      id: "s03",
      index: 3,
      title: "Neutral, Bullish & Bearish Calendar Spreads",
      purpose: "Examine strike selection across neutral (ATM), bullish (OTM call), and bearish (OTM put) calendars",
      takeaways: [
        "Neutral Calendar: Strike K set at-the-money (S0 = K); max profit achieved if stock closes exactly at K",
        "Bullish Calendar: Strike K set out-of-the-money above spot; profits if stock rises moderately to strike K",
        "Bearish Calendar: Strike K set out-of-the-money below spot using puts; profits if stock drifts down to strike K"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Calendar Spread Strike Positioning Architectures",
        formula: "\\text{Max Profit} = V_{\\text{long}}(T_1) - \\text{Net Initial Debit}",
        steps: [
          { label: "Neutral Calendar (ATM)", detail: "Strike K = S0. Front month expires worthless at T1; back month retains substantial time value." },
          { label: "Bullish Calendar (OTM Calls)", detail: "Strike K > S0. Lower initial cost; targets moderate rally up to strike K at near expiration T1." },
          { label: "Bearish Calendar (OTM Puts)", detail: "Strike K < S0. Targets moderate orderly decline down to put strike K at near expiration T1." },
          { label: "Vega Sensitivity", detail: "Calendar spreads have net positive Vega; benefit from rises in longer-term implied volatility." }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "strike price selection", hi: "strike price selection" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Neutral Calendar", hi: "Neutral Calendar" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Bullish and Bearish Calendars", hi: "Bullish and Bearish Calendars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Vega sensitivity", hi: "Vega sensitivity" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: The Long Straddle
    {
      id: "s04",
      index: 4,
      title: "The Long Straddle: Monetizing Explosive Market Disruption",
      purpose: "Define the Long Straddle, formulate its V-shaped payoff, and solve Hull Section 12.4 example",
      takeaways: [
        "A Long Straddle pairs 1 Call + 1 Put with identical strike K and expiration date T",
        "In Hull's example: S0 = $69, K = $70, c = $4.00, p = $3.00; Total Cost = $7.00 per share",
        "Maximum loss is capped at $7.00; Breakevens are $63.00 ($70 - $7) and $77.00 ($70 + $7)"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "Hull Section 12.4 Long Straddle Architecture",
        left: {
          title: "Position Specifications & Payoff",
          items: [
            "Buy 1 Call Strike $70 (cost $4.00) + Buy 1 Put Strike $70 (cost $3.00)",
            "Total Upfront Cost = $4.00 + $3.00 = $7.00 per share ($700 per contract)",
            "Terminal Payoff = |S_T - $70| - $7.00",
            "Maximum Loss = $7.00 (occurs if stock expires exactly at $70.00)"
          ]
        },
        right: {
          title: "Breakeven Corridors & Profit Zones",
          items: [
            "Upper Breakeven = $70.00 + $7.00 = $77.00 (profits unlimited above $77)",
            "Lower Breakeven = $70.00 - $7.00 = $63.00 (profits substantial down to $0)",
            "Profits from large explosive price moves in either direction",
            "Position is Delta neutral at inception with high positive Gamma and Vega"
          ]
        }
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Long Straddle", hi: "Long Straddle" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] }, hi: { display: hiBeats['b18'] } },
          visualCues: [{ target: "left_items", anchor: { en: "Hull Section twelve point four", hi: "Section twelve point four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "right_title", anchor: { en: "breakeven prices", hi: "breakeven prices" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "right_items", anchor: { en: "V-shaped payoff profile", hi: "V-shaped payoff" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: The Short Straddle
    {
      id: "s05",
      index: 5,
      title: "The Short Straddle: High-Stakes Volatility Selling",
      purpose: "Examine the Short Straddle: selling volatility, premium collection, and unlimited two-sided tail risk",
      takeaways: [
        "A Short Straddle sells 1 Call + 1 Put at the same strike K, collecting upfront premium c + p",
        "Maximum profit is capped at the premium collected ($7.00), realized if stock finishes at K",
        "Faces unlimited loss liability on upside rallies and severe loss on downside crashes"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Short Straddle Risk Anatomy & Asymmetry",
        steps: [
          { label: "1. Premium Inflow", detail: "Sell Call K + Sell Put K; collect $7.00 upfront cash ($700 per contract)" },
          { label: "2. The Peak Profit Apex", detail: "If S_T closes exactly at $70: both options expire worthless, seller pockets full $7.00" },
          { label: "3. Upside Uncapped Risk", detail: "If stock rallies to $100: short call loss = $100 - $70 - $7 = -$23.00 ($2,300 loss)" },
          { label: "4. Downside Crash Risk", detail: "If stock collapses to $30: short put loss = $70 - $30 - $7 = -$33.00 ($3,300 loss)" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Short Straddle", hi: "Short Straddle" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "step_1", anchor: { en: "maximum profit", hi: "maximum profit" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "step_2", anchor: { en: "unlimited loss potential", hi: "unlimited loss" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "step_3", anchor: { en: "strict stop-loss discipline", hi: "stop-loss discipline" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Strips and Straps
    {
      id: "s06",
      index: 6,
      title: "Asymmetric Volatility Bets: Strips and Straps",
      purpose: "Formulate Strips (1 Call + 2 Puts) and Straps (2 Calls + 1 Put) for directional volatility trading",
      takeaways: [
        "A Strip combines 1 Call + 2 Puts at strike K; profits more aggressively from downward price moves",
        "A Strap combines 2 Calls + 1 Put at strike K; profits more aggressively from upward rallies",
        "Both strategies capture volatility while reflecting asymmetric directional market views"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Asymmetric Volatility Architectures: Strips vs. Straps",
        formula: "\\text{Strip Payoff} = \\max(S_T - K, 0) + 2 \\max(K - S_T, 0) - (c + 2p)",
        steps: [
          { label: "The Strip Payoff Formula", detail: "1 Call + 2 Puts. Downside slope is 2x steeper than upside slope; targets downward crash." },
          { label: "The Strap Payoff Formula", detail: "\\text{Strap} = 2 \\max(S_T - K, 0) + \\max(K - S_T, 0) - (2c + p); 2x steeper upside slope." },
          { label: "Directional Skew Rationale", detail: "Used when trader expects a major volatility explosion but holds a clear directional tilt." },
          { label: "Hurdle Rate Impact", detail: "Requires larger total premium outlay, widening the break-even points relative to vanilla straddles." }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Strips and Straps", hi: "Strips and Straps" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Strip structure", hi: "Strip structure" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Strap structure", hi: "Strap structure" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b28'] }, hi: { display: hiBeats['b28'] } },
          visualCues: [{ target: "step_3", anchor: { en: "asymmetric breakeven hurdle", hi: "asymmetric breakeven" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: The Strangle
    {
      id: "s07",
      index: 7,
      title: "The Strangle: Widening the Corridor to Slash Premium Outlay",
      purpose: "Define the Long Strangle, compare costs with Straddles, and solve Hull Section 12.4 numerical example",
      takeaways: [
        "A Long Strangle buys an OTM put (strike K1) and an OTM call (strike K2) where K1 < K2",
        "In Hull's example: S0 = $54, Put K1=$50 ($1.50), Call K2=$60 ($2.00); Total Cost = $3.50 (vs $7 for straddle)",
        "Breakevens are $46.50 ($50 - $3.50) and $63.50 ($60 + $3.50); cheaper entry but requires wider move"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Hull Section 12.4 Strangle Architecture",
        steps: [
          { label: "1. Position Construction", detail: "Buy 1 Put Strike $50 (pay $1.50) + Buy 1 Call Strike $60 (pay $2.00)" },
          { label: "2. Reduced Premium Outlay", detail: "Total Cost = $1.50 + $2.00 = $3.50 per share ($350 per contract) - 50% cheaper than straddle" },
          { label: "3. Flat Bottom Loss Zone", detail: "If stock finishes between $50 and $60 at expiration, max loss is strictly $3.50 ($350)" },
          { label: "4. Profit Corridors", detail: "Profits start above $63.50 ($60 + $3.50) and below $46.50 ($50 - $3.50)" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b29'] }, hi: { display: hiBeats['b29'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Long Strangle", hi: "Long Strangle" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b30'] }, hi: { display: hiBeats['b30'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Hull Section twelve point four", hi: "Section twelve point four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_2", anchor: { en: "flat-bottomed loss zone", hi: "flat-bottomed loss" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_3", anchor: { en: "straddle versus strangle trade-off", hi: "trade-off" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: Earnings Announcements & IV Crush
    {
      id: "s08",
      index: 8,
      title: "Business Snapshot 12.2: Earnings Announcements & The IV Crush Trap",
      purpose: "Analyze Business Snapshot 12.2: pre-earnings IV spikes and post-earnings Implied Volatility crush",
      takeaways: [
        "Implied volatility surges into earnings as market makers price binary earnings event risk",
        "Immediately after earnings release, uncertainty vanishes and implied volatility collapses ('IV Crush')",
        "Even if the stock moves significantly, the collapse in Vega can cause long straddles to lose money"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Volatility Crush Mechanism (Business Snapshot 12.2)",
        formula: "\\Delta V_{\\text{option}} \\approx \\Delta \\text{Price} \\times \\Delta - \\text{Vega} \\times \\Delta \\sigma_{\\text{implied}}",
        steps: [
          { label: "Pre-Earnings Runup", detail: "Implied volatility expands dramatically from 30% to 90%, inflating option premiums" },
          { label: "Binary Event Release", detail: "Earnings numbers reported; binary outcome resolved; market uncertainty drops to zero" },
          { label: "Post-Earnings IV Crush", detail: "Implied volatility collapses instantly back to baseline 30% overnight" },
          { label: "Vega Destruction", detail: "Loss from IV collapse exceeds directional gain, inflicting severe losses on long straddle buyers" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Business Snapshot twelve point two", hi: "Snapshot twelve point two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b34'] }, hi: { display: hiBeats['b34'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Implied volatility expansion", hi: "Implied volatility" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b35'] }, hi: { display: hiBeats['b35'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Implied Volatility Crush", hi: "IV Crush" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b36'] }, hi: { display: hiBeats['b36'] } },
          visualCues: [{ target: "step_3", anchor: { en: "professional volatility traders", hi: "volatility traders" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Straddle Breakeven & Payoff Calculation",
      purpose: "Test quantitative calculation of straddle breakevens and terminal profit under price dislocation",
      takeaways: [
        "Given strike K = $100, Call premium c = $6.00, Put premium p = $4.00: Total Cost = $10.00",
        "Upper Breakeven = $100 + $10 = $110.00; Lower Breakeven = $100 - $10 = $90.00",
        "If stock price moves to $125 at expiration: Net Profit = ($125 - $100) - $10.00 = $15.00 per share"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "An investor purchases a 3-month Long Straddle with strike K = $100. The call costs $6.00 and the put costs $4.00. What are the Breakeven stock prices, and what is the net profit per share if the stock closes at $125 at expiration?",
        options: [
          { label: "Option A", text: "Breakevens $94 and $106; Net Profit $19.00" },
          { label: "Option B", text: "Breakevens $90 and $110; Net Profit $15.00" },
          { label: "Option C", text: "Breakevens $90 and $110; Net Profit $25.00" },
          { label: "Option D", text: "Breakevens $85 and $115; Net Profit $10.00" }
        ],
        correctIndex: 1,
        explanation: "Total Cost = $6.00 + $4.00 = $10.00. Upper Breakeven = $100 + $10 = $110.00; Lower Breakeven = $100 - $10 = $90.00. At S_T = $125, the call pays $125 - $100 = $25, and the put expires worthless ($0). Net Profit = $25 - $10 Total Cost = $15.00 per share ($1,500 per contract)."
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
          visualCues: [{ target: "options_grid", anchor: { en: "hundred dollars", hi: "hundred dollars" } }],
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

    // Scene 10: Master Strategy Matrix
    {
      id: "s10",
      index: 10,
      title: "Master Strategy Matrix: Straddle vs Strangle vs Calendar",
      purpose: "Provide a comparative decision matrix selecting between Straddles, Strangles, and Calendar Spreads",
      takeaways: [
        "Choose Straddles when anticipating massive, explosive volatility and tight breakeven timing",
        "Choose Strangles when volatility is anticipated but capital outlay must be minimized",
        "Choose Calendar Spreads when expecting range-bound consolidation and rising deferred volatility"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Volatility & Time Strategy Selection Matrix",
        steps: [
          { label: "1. Long Straddle", detail: "High capital cost; narrow breakevens; maximizes Gamma and Vega for sudden explosive news" },
          { label: "2. Long Strangle", detail: "Low capital cost; wide breakevens; requires extreme directional tail move to profit" },
          { label: "3. Calendar Spread", detail: "Net debit; positive Theta; profits from range-bound price action around strike K" },
          { label: "4. Iron Condor / Butterfly", detail: "Combine credit spreads to capture pure non-directional premium under tight range constraints" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b41'] }, hi: { display: hiBeats['b41'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Master Strategy Matrix", hi: "Master Strategy Matrix" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b42'] }, hi: { display: hiBeats['b42'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Straddle versus Strangle", hi: "Straddle versus Strangle" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b43'] }, hi: { display: hiBeats['b43'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Calendar Spread role", hi: "Calendar Spread role" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b44'] }, hi: { display: hiBeats['b44'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Iron Condors and Butterfly spreads", hi: "Iron Condors" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Core Volatility & Time Trading Laws",
      purpose: "Consolidate the 8 essential principles of volatility trading, time decay harvesting, and risk control",
      takeaways: [
        "Calendar spreads monetize non-linear Theta decay by selling front-month and buying back-month",
        "Straddles and strangles trade pure volatility magnitude, independent of market direction",
        "Beware the post-earnings IV crush; Chapter 13 advances into Binomial Option Trees"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Core Laws of Volatility & Time Trading Strategies",
        rules: [
          { number: 1, title: "Non-Directional Freedom", text: "Options allow traders to isolate and trade pure volatility and time decay without market direction." },
          { number: 2, title: "Theta Acceleration", text: "Calendar spreads capture positive net Theta by selling rapidly decaying near-term options." },
          { number: 3, title: "Calendar Vega", text: "Calendar spreads maintain net positive Vega, gaining from increases in longer-dated volatility." },
          { number: 4, title: "Straddle Explosiveness", text: "Long straddles maximize Gamma and Vega, profiting from explosive disruption in either direction." },
          { number: 5, title: "Short Straddle Tail Risk", text: "Short straddles harvest maximum premium at strike K but carry uncapped two-sided ruin risk." },
          { number: 6, title: "Strangle Cost Efficiency", text: "Strangles cut capital outlay in half by purchasing OTM legs, accepting wider breakeven hurdles." },
          { number: 7, title: "IV Crush Defense", text: "Never buy naked volatility immediately before earnings without accounting for Vega collapse." },
          { number: 8, title: "Binomial Trees Ahead", text: "In Chapter 13, we master Binomial Trees, Risk-Neutral Valuation, and American Option Pricing." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b45'] }, hi: { display: hiBeats['b45'] } },
          visualCues: [{ target: "rule_1", anchor: { en: "four core volatility and time trading laws", hi: "chaar trading laws" } }],
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
          visualCues: [{ target: "rule_6", anchor: { en: "Law Three", hi: "Law Three" } }],
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
          visualCues: [{ target: "rule_8", anchor: { en: "Chapter Thirteen", hi: "Chapter Thirteen" } }],
          pauseAfterMs: 600
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));
console.log('Chapter 12 Part 2 successfully built!');
