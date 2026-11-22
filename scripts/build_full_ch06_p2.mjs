import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch06/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_06/Part_02/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_06/Part_02/script_hi.md', 'utf8');

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const hiMatches = [...hiScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];

const enBeats = {};
const hiBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
hiMatches.forEach(m => hiBeats[m[1]] = m[2].trim());

for (let i = 1; i <= 40; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts!`);
  }
}

// 1. Facts with full numerical grounding from Chapter 6 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Eurodollar and SOFR futures utilize price index quotation 100 - R, where R is annualized 3-month interest rate percentage. A 1 bp move equals $25 per $1,000,000 contract ($1M * 0.0001 * 90/360).",
      citation: { chapter: "6", section: "6.3", page: "139" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "The Convexity Adjustment formula reconciling futures and forward rates is: Forward Rate = Futures Rate - 0.5 * sigma^2 * T_1 * T_2, where sigma is rate volatility, T_1 is futures expiry, and T_2 = T_1 + 0.25.",
      citation: { chapter: "6", section: "6.4", page: "142" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "The optimal number of futures contracts for duration-based hedging is: N* = (P * D_P) / (F_C * D_F), where P is portfolio value, D_P is portfolio duration, F_C is contract price, and D_F is CTD bond duration.",
      citation: { chapter: "6", section: "6.5", page: "145" }
    },
    {
      id: "F04",
      category: "definition",
      statement: "Daily marking to market makes futures rates systematically higher than forward rates because positive variation margin is received and reinvested when interest rates rise.",
      citation: { chapter: "6", section: "6.4", page: "141" }
    },
    {
      id: "F05",
      category: "numerical_example",
      statement: "John Hull's example: hedging a $10,000,000 portfolio with duration 6.80 years using futures trading at 93-06 ($93,187.50) with CTD duration 9.20 years requires N* = ($10M * 6.80) / ($93,187.50 * 9.20) = 79.31 (short 79 contracts).",
      citation: { chapter: "6", section: "6.5", page: "146" }
    },
    {
      id: "F06",
      category: "definition",
      statement: "Asset-Liability Management (ALM) manages the Duration Gap between long-term bank assets (loans) and short-term liabilities (deposits) using interest rate futures.",
      citation: { chapter: "6", section: "6.5", page: "147" }
    },
    {
      id: "F07",
      category: "definition",
      statement: "Hedging imperfections include non-parallel yield curve shifts (curve steepening/inversion), credit spread divergence, and CTD bond switching risk.",
      citation: { chapter: "6", section: "6.5", page: "148" }
    },
    {
      id: "F08",
      category: "numerical_example",
      statement: "Active recall scenario: $50,000,000 portfolio with duration 5.0 years hedged with futures contract price $100,000 and CTD duration 8.0 years requires N* = ($50M * 5.0) / ($100k * 8.0) = 250M / 800k = 312.5 (short 313 contracts).",
      citation: { chapter: "6", section: "6.5", page: "146" }
    }
  ],
  realWorldProblem: {
    actors: "Bank ALM committees, fixed income portfolio managers, and short-term interest rate traders",
    situation: "Immunizing corporate bond portfolios against interest rate spikes and managing bank balance sheet duration gaps",
    failure: "Neglecting the convexity adjustment when constructing swap curves or miscalculating duration hedge ratios creates catastrophic capital losses",
    invention: "Eurodollar index quotation, Convexity Adjustment formula, and Duration-Based Hedging ratio N*",
    factIds: ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p2",
  title: "Interest Rate Futures - Part 2",
  subtitle: "Eurodollar / SOFR Futures, Convexity Adjustments, and Duration-Based Hedging",
  targetAudience: "Fixed income portfolio managers, treasury officers, and derivative traders",
  prerequisites: ["Treasury bond futures mechanics", "Conversion factors", "Macaulay and Modified duration"],
  scenes: [
    { sceneId: "s00", title: "The Short End of the Curve: Introducing Eurodollar Futures", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Contract Mechanics: $100 - R$ Pricing & The $25 Tick Value", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Futures vs. Forwards: The Daily Marking-to-Market Divergence", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "The Convexity Adjustment Formula: Correcting the Futures Rate", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "Extending the Zero Curve via Adjusted Futures Rates", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Duration-Based Hedging: Matching Dollar Duration", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "The Optimal Number of Contracts Formula: $N^*$", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Worked Hedging Example: Protecting a $10M Corporate Bond Portfolio", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Asset-Liability Management (ALM) & The Duration Gap", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Calculating the Optimal Hedge Ratio", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Hedging Imperfections: Basis Risk & Non-Parallel Shifts", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Short-Rate Futures & Hedging", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p2",
  formulas: [
    {
      id: "M01",
      name: "Eurodollar Tick Value",
      latex: "\\text{Tick Value} = \\$1,000,000 \\times 0.0001 \\times \\frac{90}{360} = \\$25",
      variables: [
        { symbol: "Principal", description: "Standard notional principal", unit: "currency" },
        { symbol: "Tick", description: "One basis point change (0.01%)", unit: "decimal" },
        { symbol: "Tenor", description: "3-month interest period (90/360)", unit: "years" }
      ]
    },
    {
      id: "M02",
      name: "Convexity Adjustment",
      latex: "\\text{Forward Rate} = \\text{Futures Rate} - \\frac{1}{2} \\sigma^2 T_1 T_2",
      variables: [
        { symbol: "sigma", description: "Annualized interest rate change volatility", unit: "decimal/year" },
        { symbol: "T_1", description: "Time to contract maturity", unit: "years" },
        { symbol: "T_2", description: "Maturity of underlying rate (T_1 + 0.25)", unit: "years" }
      ]
    },
    {
      id: "M03",
      name: "Duration-Based Hedge Ratio",
      latex: "N^* = \\frac{P \\cdot D_P}{F_C \\cdot D_F}",
      variables: [
        { symbol: "N^*", description: "Optimal number of futures contracts to trade", unit: "contracts" },
        { symbol: "P", description: "Market value of bond portfolio being hedged", unit: "currency" },
        { symbol: "D_P", description: "Modified duration of bond portfolio", unit: "years" },
        { symbol: "F_C", description: "Dollar contract price of futures contract", unit: "currency" },
        { symbol: "D_F", description: "Modified duration of CTD bond underlying futures", unit: "years" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch06",
  partId: "p2",
  scenes: lessonPlan.scenes.map(s => ({
    sceneId: s.sceneId,
    title: s.title,
    beats: s.beats.map(b => ({
      beatId: b,
      narrationEn: enBeats[b] || "Narration text",
      narrationHi: hiBeats[b] || "Narration text"
    }))
  }))
};
fs.writeFileSync(path.join(targetDir, '04_pedagogical_script.json'), JSON.stringify(pedagogicalScript, null, 2));

// 5. Build Episode Schema Compliant Episode
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch06",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 6",
  partLabel: "Part 2",
  title: "Interest Rate Futures - Part 2",
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
    // Scene 0: Chat story (4 beats: opening dilemma + b01, b02, b03)
    {
      id: "s00",
      index: 0,
      title: "The Short End of the Curve: Introducing Eurodollar Futures",
      purpose: "Transition from long-term bond futures to short-term money market derivatives and duration hedging",
      takeaways: [
        "The largest global derivative trading volumes trade on short-term rates (Eurodollar & SOFR)",
        "Contracts feature a standardized $1,000,000 notional principal on 3-month rates",
        "Part 2 masters quotation mechanics, convexity adjustments, and duration-based hedging"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "How do trading desks hedge billions in short-term interest rates, and why do futures rates differ from forward rates?" },
          { id: "m2", speaker: "mentor", text: "In Part One, we mastered long-term Treasury bond futures. But the most massive derivative trading volume in history trades on short-term rates: Eurodollar and SOFR futures." },
          { id: "m3", speaker: "mentor", text: "Eurodollar futures are based on 3-month dollar deposits with a $1,000,000 notional principal, providing liquid instruments to fix borrowing costs." },
          { id: "m4", speaker: "mentor", text: "In Part Two, we master 100 - R quotation, the mathematical Convexity Adjustment, and institutional Duration-Based Hedging." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Short-Rate Intro", "100 - R Quotation", "Mark-to-Market Divergence", "Convexity Adjustment", "Zero Curve Extension", "Duration Hedging"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "How do trading desks hedge billions in short-term interest rates, and why do futures rates differ from forward rates?" },
            hi: { display: "ट्रेडिंग डेस्क शॉर्ट-टर्म इंटरेस्ट रेट्स को कैसे हेज करते हैं, और फ्यूचर्स और फॉरवर्ड रेट्स में फर्क क्यों होता है?" }
          },
          onScreenIntent: "Opening dilemma question on short-rate hedging and rate divergence",
          sourceFactIds: ["F01", "F02"],
          newTerms: ["short-term rate hedging"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor highlights massive global volume in Eurodollar and SOFR futures",
          sourceFactIds: ["F01"],
          newTerms: ["Eurodollar futures", "SOFR futures"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2"] },
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "The mentor details $1M notional principal and 3-month deposit foundation",
          sourceFactIds: ["F01"],
          newTerms: ["notional principal"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "The mentor outlines Part 2 learning objectives and mathematical topics",
          sourceFactIds: ["F02", "F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3", "m4"] },
          visualCues: []
        }
      ]
    },
    // Scene 1: Technical Panel (b04, b05, b06)
    {
      id: "s01",
      index: 1,
      title: "Contract Mechanics: $100 - R$ Pricing & The $25 Tick Value",
      purpose: "Examine the 100 - R quotation index and derive the $25 basis point tick value",
      takeaways: [
        "Eurodollar/SOFR futures quote as 100 - R, where R is annualized interest rate percentage",
        "The formula preserves bond inverse pricing: rising rates produce falling futures quotes",
        "A 1 basis point (0.01%) move equals exactly $25 per contract ($1M * 0.0001 * 90/360)"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Short-Rate Futures Quotation & Valuation",
        subtitle: "100 - R Index Pricing & The Exact $25 Tick Derivation",
        sections: [
          {
            id: "quote-formula",
            title: "Index Price Formula",
            content: "Quoted Price = 100 - R. For example, if 3-month interest rate R = 4.25%, the futures contract trades at exactly 95.75."
          },
          {
            id: "quote-inverse",
            title: "Inverse Fixed Income Dynamics",
            content: "When rates increase, futures price drops. When rates decrease, futures price climbs, matching standard bond exposure."
          },
          {
            id: "quote-tick",
            title: "Exact $25 Tick Derivation",
            content: "1 bp change = $1,000,000 principal * 0.0001 * (90 days / 360 days) = $25.00 cash profit/loss per contract."
          }
        ]
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce 100 - R quotation convention",
          sourceFactIds: ["F01"],
          newTerms: ["100 - R quotation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Explain why inverse relationship aligns with standard fixed-income intuition",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Derive exact $25 cash tick value per basis point",
          sourceFactIds: ["F01"],
          newTerms: ["$25 tick value"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Split Comparison (b07, b08, b09)
    {
      id: "s02",
      index: 2,
      title: "Futures vs. Forwards: The Daily Marking-to-Market Divergence",
      purpose: "Contrast daily settled futures cash flows with terminal settled FRAs to explain rate disparity",
      takeaways: [
        "Futures interest rates systematically exceed corresponding FRA forward rates",
        "Daily marking-to-market reinvests positive variation margin at prevailing higher rates",
        "FRAs settle with zero interim cash flow, requiring a mathematical convexity adjustment"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-futures-rate",
          heading: "Futures Rate Dynamics",
          tone: "positive",
          points: [
            "Settles cash variation margin every business day based on closing prices",
            "When interest rates rise, short futures gain cash that is immediately reinvested at higher yields",
            "Positive correlation between cash flow and reinvestment rates elevates futures rates",
            "Systematically trades at higher theoretical interest yields than forwards"
          ]
        },
        right: {
          id: "cmp-forward-rate",
          heading: "Forward Rate (FRA) Dynamics",
          tone: "neutral",
          points: [
            "Over-the-counter contract with zero interim cash variation margin payments",
            "Single cash settlement occurs at inception T_1 discounted for in-advance settlement",
            "No interim cash flow reinvestment benefit during the holding period",
            "Represents the true unencumbered forward rate needed for zero curve bootstrapping"
          ]
        },
        verdict: {
          id: "vrd-divergence",
          text: "Daily marking-to-market reinvestment raises futures rates above forward rates: Futures > Forwards."
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Address misconception that futures rates and forward rates are identical",
          sourceFactIds: ["F04"],
          newTerms: ["futures-forward disparity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Explain daily mark-to-market cash reinvestment mechanics",
          sourceFactIds: ["F04"],
          newTerms: ["daily marking-to-market"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Contrast terminal settled FRAs and introduce convexity adjustment",
          sourceFactIds: ["F04"],
          newTerms: ["convexity adjustment"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Formula Breakdown (b10, b11, b12)
    {
      id: "s03",
      index: 3,
      title: "The Convexity Adjustment Formula: Correcting the Futures Rate",
      purpose: "Formulate the exact mathematical deduction: Forward Rate = Futures Rate - 0.5 * sigma^2 * T_1 * T_2",
      takeaways: [
        "Convexity adjustment formula: Forward Rate = Futures Rate - 0.5 * sigma^2 * T_1 * T_2",
        "Sigma is interest rate change volatility; T_2 = T_1 + 0.25 years",
        "Adjustment grows quadratically with maturity, reaching 50-100 bps for 8-10 year horizons"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Hull-White Convexity Adjustment Formula",
        formula: {
          latex: "\\text{Forward Rate} = \\text{Futures Rate} - \\frac{1}{2} \\sigma^2 T_1 T_2",
          expression: "Forward Rate = Futures Rate - 0.5 * sigma^2 * T_1 * T_2",
          solvesFor: "True Continuous Forward Rate (R_F)",
          variables: [
            { symbol: "R_F", latex: "\\text{Forward Rate}", meaning: "True unencumbered forward interest rate", unit: "decimal/year" },
            { symbol: "R_G", latex: "\\text{Futures Rate}", meaning: "Quoted futures rate: (100 - Quoted Price) / 100", unit: "decimal/year" },
            { symbol: "sigma", latex: "\\sigma", meaning: "Annualized standard deviation of interest rate changes", unit: "decimal/year" },
            { symbol: "T_1", latex: "T_1", meaning: "Time to contract expiration in years", unit: "years" },
            { symbol: "T_2", latex: "T_2", meaning: "Maturity of underlying rate: T_1 + 0.25 years", unit: "years" }
          ]
        },
        parts: [
          { id: "ca1", symbolLatex: "\\frac{1}{2} \\sigma^2 T_1 T_2", meaning: "Quadratic convexity correction factor deducted from futures quote", unit: "decimal/year" },
          { id: "ca2", symbolLatex: "T_2 = T_1 + 0.25", meaning: "Underlying 3-month borrowing horizon (+ 90/360 years)", unit: "years" },
          { id: "ca3", symbolLatex: "T_1 > 5 \\implies 50\\text{--}100\\text{ bps}", meaning: "Significant correction factor for multi-year interest rate swaps", unit: "impact" }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Formulate Convexity Adjustment: Forward = Futures - 0.5 * sigma^2 * T_1 * T_2",
          sourceFactIds: ["F02"],
          newTerms: ["convexity deduction"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Define parameters: rate volatility sigma, expiry T_1, and rate maturity T_2",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Demonstrate quadratic growth of adjustment: reaching 50 to 100 bps at 8-10 years",
          sourceFactIds: ["F02"],
          newTerms: ["quadratic growth"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Causal Chain (b13, b14, b15, b16)
    {
      id: "s04",
      index: 4,
      title: "Extending the Zero Curve via Adjusted Futures Rates",
      purpose: "Trace the 3-step bootstrapping methodology extending smooth zero curves via convexity-adjusted futures",
      takeaways: [
        "Trading desks use convexity-adjusted futures to bootstrap zero curves up to 10 years",
        "Convexity deduction of 0.5 * sigma^2 * T_1 * T_2 isolates true forward rates",
        "Forward rates are chained recursively to build the continuous discount curve"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        title: "Bootstrapping Zero Curves from Short-Rate Futures",
        links: [
          {
            id: "boot1",
            role: "condition",
            text: "Liquid money market futures prices trade across consecutive quarterly expirations up to 10 years"
          },
          {
            id: "boot2",
            role: "action",
            text: "Step 1: Collect quoted settlement prices and extract raw futures interest rates: (100 - Price) / 100"
          },
          {
            id: "boot3",
            role: "mechanism",
            text: "Step 2: Subtract exact convexity adjustment 0.5 * sigma^2 * T_1 * T_2 to yield true forward rates"
          },
          {
            id: "boot4",
            role: "result",
            text: "Step 3: Recursively link continuous forward rates to compute zero-coupon spot rates"
          },
          {
            id: "boot5",
            role: "consequence",
            text: "Generate institutional benchmark zero curve for pricing swaps and multi-billion-dollar debt"
          }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Introduce bootstrapping smooth zero curves up to 10 years",
          sourceFactIds: ["F02"],
          newTerms: ["zero curve bootstrapping"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Step 1: Collecting consecutive active quarterly futures rates",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Step 2: Deducting convexity adjustment to isolate true forward rates",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Step 3: Chaining forward rates into continuous zero discount curves",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Split Comparison (b17, b18, b19)
    {
      id: "s05",
      index: 5,
      title: "Duration-Based Hedging: Matching Dollar Duration",
      purpose: "Define dollar duration and establish the principle of equalizing portfolio and futures dollar duration",
      takeaways: [
        "Dollar loss from interest rate shifts is governed by Dollar Duration: P * D_P",
        "Duration-based hedging equalizes portfolio dollar duration with aggregate futures dollar duration",
        "Net balance sheet sensitivity to parallel yield curve shifts is fully neutralized"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-unhedged-risk",
          heading: "Unhedged Portfolio Risk",
          tone: "trap",
          points: [
            "Exposed to capital losses whenever market yields shift upward",
            "Loss magnitude governed by Dollar Duration: Delta P ≈ -P * D_P * Delta y",
            "A 100 bps rate surge causes immediate severe balance sheet equity contraction",
            "Violates fiduciary risk limits for pension funds and insurance balance sheets"
          ]
        },
        right: {
          id: "cmp-hedged-neutral",
          heading: "Dollar-Duration Immunization",
          tone: "positive",
          points: [
            "Positions futures contracts to match dollar sensitivity: F_C * D_F * N*",
            "Portfolio losses are offset dollar-for-dollar by futures margin gains",
            "Net sensitivity to parallel yield curve shifts becomes exactly zero",
            "Preserves asset holdings while completely insulating portfolio capital value"
          ]
        },
        verdict: {
          id: "vrd-immunize",
          text: "Matching Dollar Duration neutralizes interest rate risk: P * D_P = N* * F_C * D_F."
        }
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Introduce Duration-Based Hedging across institutional desks",
          sourceFactIds: ["F03"],
          newTerms: ["duration-based hedging"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Define Dollar Duration: Portfolio Market Value P multiplied by Duration D_P",
          sourceFactIds: ["F03"],
          newTerms: ["dollar duration"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Establish objective: equalizing portfolio and futures dollar durations",
          sourceFactIds: ["F03"],
          newTerms: ["duration immunization"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Formula Breakdown (b20, b21, b22)
    {
      id: "s06",
      index: 6,
      title: "The Optimal Number of Contracts Formula: $N^*$",
      purpose: "Derive the universal duration-based hedging equation N* = (P * D_P) / (F_C * D_F)",
      takeaways: [
        "Optimal contract sizing equation: N* = (P * D_P) / (F_C * D_F)",
        "P * D_P is portfolio dollar duration; F_C * D_F is single contract dollar duration",
        "Rising rates cause bond price drops offset by cash gains on short futures"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Optimal Duration-Based Hedge Ratio Equation",
        formula: {
          latex: "N^* = \\frac{P \\cdot D_P}{F_C \\cdot D_F}",
          expression: "N* = (Portfolio Value * Portfolio Duration) / (Futures Contract Price * CTD Duration)",
          solvesFor: "Optimal Number of Futures Contracts (N*)",
          variables: [
            { symbol: "N^*", latex: "N^*", meaning: "Number of futures contracts required to immunize portfolio", unit: "contracts" },
            { symbol: "P", latex: "P", meaning: "Current market value of the bond portfolio being hedged", unit: "currency" },
            { symbol: "D_P", latex: "D_P", meaning: "Modified duration of the bond portfolio", unit: "years" },
            { symbol: "F_C", latex: "F_C", meaning: "Current contract dollar price of one futures contract", unit: "currency" },
            { symbol: "D_F", latex: "D_F", meaning: "Modified duration of the CTD bond underlying the futures contract", unit: "years" }
          ]
        },
        parts: [
          { id: "hf1", symbolLatex: "P \\cdot D_P", meaning: "Total portfolio dollar duration (risk being hedged)", unit: "currency * years" },
          { id: "hf2", symbolLatex: "F_C \\cdot D_F", meaning: "Dollar duration delivered per individual futures contract", unit: "currency * years" },
          { id: "hf3", symbolLatex: "\\text{Short } N^*", meaning: "Short position shields against rate rises; Long shields against rate falls", unit: "direction" }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Present the universal hedge ratio equation N* = (P * D_P) / (F_C * D_F)",
          sourceFactIds: ["F03"],
          newTerms: ["hedge ratio formula"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Define each variable: portfolio value P, duration D_P, futures price F_C, CTD duration D_F",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Explain how short futures gains balance portfolio bond depreciation",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Worked Example (b23, b24, b25)
    {
      id: "s07",
      index: 7,
      title: "Worked Hedging Example: Protecting a $10M Corporate Bond Portfolio",
      purpose: "Work through John Hull's numerical hedging case step-by-step: P = $10M, D_P = 6.80 yrs -> N* = 79 contracts",
      takeaways: [
        "P = $10,000,000, D_P = 6.80 yrs -> Portfolio dollar duration = $68,000,000",
        "Futures at 93-06 ($93,187.50) with CTD duration 9.20 yrs -> Contract dollar duration = $857,325",
        "N* = $68,000,000 / $857,325 = 79.31 contracts -> Short 79 Treasury bond futures"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Duration Hedging: Sizing the $10M Portfolio Shield",
        formula: {
          latex: "N^* = \\frac{P \\cdot D_P}{F_C \\cdot D_F}",
          expression: "N_star = (P * D_P) / (F_C * D_F)",
          solvesFor: "N*",
          variables: [
            { symbol: "N*", latex: "N^*", meaning: "Optimal Number of Futures Contracts", unit: "contracts" },
            { symbol: "P * D_P", latex: "P \\cdot D_P", meaning: "Portfolio Dollar Duration ($68,000,000)", unit: "USD" },
            { symbol: "F_C * D_F", latex: "F_C \\cdot D_F", meaning: "Futures Contract Dollar Duration ($857,325)", unit: "USD" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "P \\cdot D_P = \\$10\\text{M} \\times 6.80 = \\$68\\text{M}", meaning: "Dollar duration of bond asset portfolio", unit: "USD" },
          { id: "p2", symbolLatex: "F_C \\cdot D_F = \\$93,187.50 \\times 9.20 = \\$857,325", meaning: "Dollar duration of one CBOT futures contract", unit: "USD" },
          { id: "p3", symbolLatex: "N^* = \\frac{\\$68,000,000}{\\$857,325} = 79.31 \\rightarrow 79", meaning: "Optimal hedge: short 79 CBOT contracts", unit: "contracts" }
        ],
        note: "Shorting 79 contracts immunizes the $10,000,000 corporate bond portfolio against parallel yield curve shifts."
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Introduce John Hull's $10M portfolio hedging problem",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Specify futures contract parameters: quote 93-06 and CTD duration 9.20 yrs",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Walk through division: $68M / $857,325 = 79.31 -> short 79 contracts",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Technical Panel (b26, b27, b28)
    {
      id: "s08",
      index: 8,
      title: "Asset-Liability Management (ALM) & The Duration Gap",
      purpose: "Examine commercial bank balance sheet duration gaps and immunization using futures",
      takeaways: [
        "Commercial banks face structural interest rate risk: long-duration loans vs. short-duration deposits",
        "Rising rates cause asset values to drop faster than liabilities shrink, eroding bank equity",
        "Shorting interest rate futures immunizes the duration gap without forcing loan liquidations"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Asset-Liability Management (ALM) in Banking",
        subtitle: "Closing the Balance Sheet Duration Gap with Futures",
        sections: [
          {
            id: "alm-structure",
            title: "Structural Duration Mismatch",
            content: "Banks borrow short-term retail deposits (duration ~0-1 yr) and fund long-term mortgages and fixed corporate loans (duration ~5-10 yrs)."
          },
          {
            id: "alm-gap",
            title: "The Duration Gap Danger",
            content: "Positive Duration Gap = D_Assets - (Liabilities / Assets) * D_Liabilities > 0. When market yields rise, equity capital collapses."
          },
          {
            id: "alm-futures",
            title: "Synthetic Futures Immunization",
            content: "By shorting interest rate futures, banks generate variation margin cash during rate hikes, neutralizing the duration gap off-balance-sheet."
          }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Introduce bank balance sheet structural interest rate exposure",
          sourceFactIds: ["F06"],
          newTerms: ["asset-liability management", "duration gap"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Explain why short-term deposits and long-term loans create positive duration gaps",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Detail how shorting futures immunizes bank equity without selling physical loans",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 9: Interactive Quiz (b29, b30, b31)
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Calculating the Optimal Hedge Ratio",
      purpose: "Test student calculation of N* for a $50M portfolio with duration 5.0 yrs",
      takeaways: [
        "P = $50,000,000, D_P = 5.0 yrs -> Portfolio dollar duration = $250,000,000",
        "Futures price = $100,000, D_F = 8.0 yrs -> Contract dollar duration = $800,000",
        "N* = $250,000,000 / $800,000 = 312.5 -> Short 313 contracts"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        title: "Active Recall: Sizing the Institutional Duration Hedge",
        question: "A bond portfolio has market value P = $50,000,000 and duration D_P = 5.0 years. Futures price F_C = $100,000 and CTD duration D_F = 8.0 years. How many futures contracts must be shorted?",
        options: [
          "Short 250 contracts: Matching portfolio duration directly to futures contracts.",
          "Short 313 contracts: ($50M * 5.0) / ($100k * 8.0) = $250M / $800k = 312.5 contracts.",
          "Short 400 contracts: Sized by dividing portfolio value by futures contract price alone.",
          "Short 160 contracts: Inverting the ratio between portfolio and contract durations."
        ],
        correctIndex: 1,
        explanation: "Using the optimal duration hedge formula: N* = (P * D_P) / (F_C * D_F) = ($50,000,000 * 5.0) / ($100,000 * 8.0) = $250,000,000 / $800,000 = 312.5. Rounding to the nearest integer requires shorting exactly 313 contracts to fully immunize the portfolio."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Present the $50M portfolio hedge sizing challenge",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Prompt calculation of numerator $250M and denominator $800k",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Reveal Option B: 313 short contracts and trace duration cancellation",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Split Comparison (b32, b33, b34)
    {
      id: "s10",
      index: 10,
      title: "Hedging Imperfections: Basis Risk & Non-Parallel Shifts",
      purpose: "Examine three real-world limitations of duration hedging: non-parallel shifts, credit spreads, and CTD switches",
      takeaways: [
        "Duration assumes strictly parallel yield curve shifts; curve twists introduce basis risk",
        "Corporate bond credit spreads are uncorrelated with sovereign Treasury yields",
        "Large yield moves can trigger CTD bond switching, abruptly altering hedge duration"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-theory-model",
          heading: "Theoretical Assumptions",
          tone: "neutral",
          points: [
            "Assumes parallel yield curve shifts where all maturities shift by exact same Delta y",
            "Assumes underlying portfolio bonds possess zero credit spread volatility against Treasuries",
            "Assumes the identity of the CTD deliverable bond remains permanently constant",
            "Guarantees mathematically perfect cancellation in friction-free continuous models"
          ]
        },
        right: {
          id: "cmp-market-reality",
          heading: "Real-World Imperfections",
          tone: "trap",
          points: [
            "Non-parallel shifts: yield curve steepening, flattening, and butterfly twists create basis risk",
            "Credit spread widening: corporate bond yields rise while Treasuries rally to safety",
            "CTD bond switching: large yield moves abruptly change deliverable bond and hedge duration",
            "Requires continuous algorithmic dynamic rebalancing by institutional trading desks"
          ]
        },
        verdict: {
          id: "vrd-imperfection",
          text: "Duration hedging protects against parallel shocks; basis risk, credit spreads, and CTD switches require dynamic rebalancing."
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Introduce the three real-world imperfections of duration hedging",
          sourceFactIds: ["F07"],
          newTerms: ["hedging imperfections"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Examine limitation one: non-parallel curve shifts and basis risk",
          sourceFactIds: ["F07"],
          newTerms: ["non-parallel shifts", "basis risk"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Examine limitations two and three: corporate credit spreads and CTD switching",
          sourceFactIds: ["F07"],
          newTerms: ["credit spread risk", "CTD switching"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b35, b36, b37, b38, b39, b40)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Short-Rate Futures & Hedging",
      purpose: "Consolidate Chapter 6 Part 2 short-rate derivatives and duration hedging before Chapter 7 Swaps",
      takeaways: [
        "Money market futures quote as 100 - R with a $25 tick value per basis point",
        "Convexity adjustments deduct 0.5 * sigma^2 * T_1 * T_2 to isolate true forward rates",
        "Optimal duration hedging equation N* = (P * D_P) / (F_C * D_F) insulates balance sheets"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The Four Pillars of Rates Futures & Hedging",
        rules: [
          {
            id: "rul-1",
            title: "Money Market 100 - R Quotation",
            text: "Eurodollar and SOFR contracts quote as 100 - R, preserving the inverse bond price-rate relationship."
          },
          {
            id: "rul-2",
            title: "The $25 Tick Value",
            text: "1 basis point change corresponds to exactly $25 cash gain/loss per $1,000,000 contract."
          },
          {
            id: "rul-3",
            title: "Futures vs. Forward Disparity",
            text: "Daily marking to market elevates futures rates above forward rates via positive reinvestment correlation."
          },
          {
            id: "rul-4",
            title: "The Convexity Adjustment",
            text: "Forward Rate = Futures Rate - 0.5 * sigma^2 * T_1 * T_2 corrects futures rates for zero curve bootstrapping."
          },
          {
            id: "rul-5",
            title: "Matching Dollar Duration",
            text: "Hedging equalizes portfolio dollar duration with aggregate futures duration: P * D_P = N* * F_C * D_F."
          },
          {
            id: "rul-6",
            title: "Optimal Sizing Equation N*",
            text: "N* = (P * D_P) / (F_C * D_F) specifies the exact number of contracts required to immunize portfolio capital."
          },
          {
            id: "rul-7",
            title: "Asset-Liability Management (ALM)",
            text: "Banks deploy interest rate futures to neutralize duration gaps between long-term loans and short deposits."
          },
          {
            id: "rul-8",
            title: "Hedging Imperfections",
            text: "Non-parallel shifts, corporate credit spread widening, and CTD bond switches require active dynamic rebalancing."
          }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Introduce synthesis of the four structural pillars",
          sourceFactIds: ["F01", "F02", "F03", "F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Review Pillar One: Money Market Futures and the $25 Tick Value",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Review Pillar Two: Convexity Adjustment",
          sourceFactIds: ["F02", "F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Review Pillar Three: Duration-Based Hedging and N* sizing",
          sourceFactIds: ["F03", "F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Review Pillar Four: ALM Duration Gap and preview Chapter 7 Swaps",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));

// 6. Register in course_map.json and book.config.json
const courseMapPath = 'c:/code/openlectern/workspace/books/hull/course_map.json';
const courseMap = JSON.parse(fs.readFileSync(courseMapPath, 'utf8'));
if (!courseMap.chapters.some(c => c.chapterId === 'ch06' && c.partId === 'p2')) {
  courseMap.chapters.push({
    chapterId: "ch06",
    partId: "p2",
    title: "Interest Rate Futures - Part 2",
    status: "in_progress"
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

console.log('Chapter 6 Part 2 successfully built and registered in course_map!');
