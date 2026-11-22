import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch04/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_04/Part_02/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_04/Part_02/script_hi.md', 'utf8');

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

// 1. Facts with full numerical grounding from Chapter 4 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch04",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "A Forward Rate Agreement (FRA) is an over-the-counter contract where two counterparties agree that a fixed interest rate R_K will be paid on a principal L over a future period from T_1 to T_2.",
      citation: { chapter: "4", section: "4.7", page: "88" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "The cash settlement payoff of an FRA at time T_1 to the fixed rate payer is L * (R_M - R_K) * (T_2 - T_1) / [1 + R_M * (T_2 - T_1)], reflecting in-advance settlement discounting.",
      citation: { chapter: "4", section: "4.7", page: "89" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "The value of an existing FRA prior to maturity is V_FRA = L * (R_F - R_K) * (T_2 - T_1) * e^(-R_2 * T_2), where R_F is current market forward rate and e^(-R_2 * T_2) is zero discount factor.",
      citation: { chapter: "4", section: "4.7", page: "90" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Macaulay duration D is the weighted average maturity of bond cash flows: D = sum(t_i * c_i * e^(-y * t_i)) / B, measuring cash flow timing.",
      citation: { chapter: "4", section: "4.8", page: "92" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Modified duration D* = D / (1 + y/m) directly relates fractional price change to yield shift: Delta B / B ≈ -D* * Delta y.",
      citation: { chapter: "4", section: "4.8", page: "93" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Convexity C measures curvature: C = (1 / B) * (d^2 B / dy^2). The second-order Taylor price change is Delta B / B ≈ -D* * Delta y + 0.5 * C * (Delta y)^2.",
      citation: { chapter: "4", section: "4.9", page: "95" }
    },
    {
      id: "F07",
      category: "definition",
      statement: "Liquidity Preference Theory states that forward rates exceed expected future zero rates because lenders prefer short-term liquidity while borrowers prefer locking long-term debt, giving upward-sloping yield curves.",
      citation: { chapter: "4", section: "4.10", page: "98" }
    },
    {
      id: "F08",
      category: "case_study",
      statement: "In 1994, Orange County treasurer Robert Citron lost $1.6 billion when a $20 billion leveraged repo portfolio with duration of ~7.4 years collapsed as the Federal Reserve raised rates by 300 bps.",
      citation: { chapter: "4", section: "Snapshot 4.1", page: "94" }
    },
    {
      id: "F09",
      category: "numerical_example",
      statement: "A bond with modified duration of 5.0 years experiences a 0.50% (50 bps) increase in yield, causing an estimated price drop of Delta B / B = -5.0 * 0.005 = -2.50%.",
      citation: { chapter: "4", section: "4.8", page: "93" }
    }
  ],
  realWorldProblem: {
    actors: "Corporate treasurers, fixed income portfolio managers, and pension fund asset-liability managers",
    situation: "Managing interest rate duration mismatches and locking forward borrowing costs across interest rate cycles",
    failure: "Ignoring duration exposure or convexity under sharp rate hikes creates catastrophic multi-billion dollar capital losses (e.g., Orange County)",
    invention: "Forward Rate Agreements (FRAs), Macaulay and Modified Duration immunization, and Convexity hedging",
    factIds: ["F01", "F02", "F04", "F05", "F06", "F08"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch04",
  partId: "p2",
  title: "FRAs, Duration, Convexity & Term Structure Theories",
  targetMinutes: 14,
  prerequisites: ["Hull Chapter 4 Part 1: Compounding, Zero Rates & The Bootstrap Method"],
  learningOutcomes: [
    "Structure Forward Rate Agreements (FRAs) and calculate cash settlement payoffs with in-advance discounting",
    "Mark-to-market value existing FRAs prior to expiration using current forward rates and zero discount factors",
    "Calculate Macaulay and Modified duration to immunize bond portfolios against parallel yield curve shifts",
    "Apply convexity corrections Delta B / B ≈ -D*Delta y + 0.5*C*(Delta y)^2 for large interest rate shocks",
    "Analyze Liquidity Preference Theory and examine the 1994 Orange County $1.6B leveraged repo collapse"
  ],
  causalChain: [
    "Corporate borrowing creates future rate exposure -> FRAs lock borrowing rates between T1 and T2 to eliminate uncertainty",
    "Interest rates shift -> Bond prices respond inversely proportional to Modified duration",
    "Large yield shifts create non-linear price curvature -> Convexity correction restores pricing precision and protects hedged portfolios"
  ],
  predictionQuestions: [
    {
      question: "If a bond portfolio has a modified duration of 5 years and yields rise by 50 basis points (0.5%), what is the approximate percentage price change?",
      answer: "-2.50%, calculated as Delta B / B = -D* * Delta y = -5.0 * 0.0050 = -0.0250 (-2.50%)."
    }
  ],
  sceneOutline: [
    { sceneIndex: 0, title: "The Over-the-Counter Rate Lock: Introducing FRAs", beats: ["b01", "b02", "b03"] },
    { sceneIndex: 1, title: "FRA Mechanics: Payer vs. Receiver Profiles", beats: ["b04", "b05", "b06"] },
    { sceneIndex: 2, title: "The FRA Cash Settlement Formula & In-Advance Discounting", beats: ["b07", "b08", "b09"] },
    { sceneIndex: 3, title: "Valuing an Existing FRA Prior to Maturity", beats: ["b10", "b11", "b12"] },
    { sceneIndex: 4, title: "Macaulay Duration: The Weighted Average Horizon", beats: ["b13", "b14", "b15"] },
    { sceneIndex: 5, title: "Modified Duration & Price Sensitivity", beats: ["b16", "b17", "b18"] },
    { sceneIndex: 6, title: "Convexity: Correcting the Linear Approximation", beats: ["b19", "b20", "b21"] },
    { sceneIndex: 7, title: "Theories of the Term Structure: Expectations vs. Segmentation", beats: ["b22", "b23", "b24"] },
    { sceneIndex: 8, title: "Liquidity Preference Theory: Why Curves Slope Upward", beats: ["b25", "b26", "b27"] },
    { sceneIndex: 9, title: "Active Recall Scenario: Calculating Bond Price Move via Duration", beats: ["b28", "b29", "b30"] },
    { sceneIndex: 10, title: "Case Study: The $1.6B Orange County Bankruptcy", beats: ["b31", "b32", "b33", "b34"] },
    { sceneIndex: 11, title: "Summary Thread: Four Pillars of Fixed Income Risk Management", beats: ["b35", "b36", "b37", "b38", "b39", "b40"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '04_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Complete 08_episode.json compliant with OpenLectern Zod schema
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch04",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 4",
  partLabel: "Part 2",
  title: "FRAs, Duration, Convexity & Term Structure Theories",
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
    // Scene 0: Chat story (4 beats: dilemma + b01, b02, b03)
    {
      id: "s00",
      index: 0,
      title: "The Over-the-Counter Rate Lock: Introducing FRAs",
      purpose: "Introduce FRAs as bespoke OTC instruments to lock future borrowing costs",
      takeaways: [
        "FRAs are bespoke OTC contracts designed to lock in an interest rate over a future window",
        "Market convention quotes FRAs as X by Y (e.g., 3x9 denotes 6-month borrowing starting in 3 months)",
        "At inception, agreed rate R_K equals market forward rate R_F, making contract value zero"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "How can a corporation lock in borrowing rates for a future 6-month loan starting in 3 months?" },
          { id: "m2", speaker: "mentor", text: "They enter a Forward Rate Agreement (FRA), an OTC contract that guarantees a fixed borrowing rate between two future dates." },
          { id: "m3", speaker: "mentor", text: "In market terminology, this is a 3 by 9 FRA: borrowing starts at month 3 and matures at month 9, locking the 6-month rate." },
          { id: "m4", speaker: "mentor", text: "In Part 2, we master FRA pricing, cash settlement discounting, duration immunization, convexity, and term structure theories." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Zero Curves (Part 1)", "FRAs & Payoffs", "Valuing FRAs", "Macaulay Duration", "Convexity", "Orange County Case"],
          current: 1
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "How can a corporation lock in borrowing rates for a future 6-month loan starting in 3 months?" },
            hi: { display: "अगर किसी कंपनी को 3 महीने बाद 6 महीने के लिए लोन लेना हो, तो वो आज ही इंटरेस्ट रेट कैसे लॉक कर सकती है?" }
          },
          onScreenIntent: "Opening dilemma question on forward rate hedging",
          sourceFactIds: ["F01"],
          newTerms: ["forward rate agreement"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor connects zero curves to forward contract rate locks",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2"] },
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "The mentor defines FRA bilateral mechanics and principal",
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
          onScreenIntent: "The mentor explains market quotation convention X by Y",
          sourceFactIds: ["F01"],
          newTerms: ["X by Y convention"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3", "m4"] },
          visualCues: []
        }
      ]
    },
    // Scene 1: Split Comparison (b04, b05, b06)
    {
      id: "s01",
      index: 1,
      title: "FRA Mechanics: Payer vs. Receiver Profiles",
      purpose: "Contrast Fixed Rate Payer (borrower hedge) and Fixed Rate Receiver (lender hedge)",
      takeaways: [
        "Fixed Rate Payer pays R_K and receives floating R_M (hedges against rising interest rates)",
        "Fixed Rate Receiver pays floating R_M and receives fixed R_K (hedges against falling interest rates)",
        "Payoffs are zero-sum between counterparties, with cash settlement settling the net difference"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "payer_side",
          heading: "Fixed Rate Payer (Borrower)",
          tone: "positive",
          points: [
            "Agrees to pay fixed contract rate R_K and receive floating benchmark R_M",
            "Protects against rising borrowing costs on future debt issuance",
            "Profits when market rate R_M exceeds agreed fixed rate R_K at expiration"
          ]
        },
        right: {
          id: "receiver_side",
          heading: "Fixed Rate Receiver (Lender)",
          tone: "neutral",
          points: [
            "Agrees to pay floating benchmark R_M and receive fixed contract rate R_K",
            "Protects cash investors and lenders against falling interest yields",
            "Profits when market rate R_M drops below agreed fixed rate R_K at expiration"
          ]
        },
        verdict: {
          id: "verdict_fra",
          text: "Fixed payer locks maximum borrowing cost; fixed receiver guarantees minimum investment yield."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce the two counterparties in an FRA transaction",
          sourceFactIds: ["F01"],
          newTerms: ["fixed rate payer", "fixed rate receiver"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Examine Fixed Rate Payer payoff profile and protection",
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
          onScreenIntent: "Examine Fixed Rate Receiver payoff profile and cash settlement",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Formula Breakdown (b07, b08, b09)
    {
      id: "s02",
      index: 2,
      title: "The FRA Cash Settlement Formula & In-Advance Discounting",
      purpose: "Derive in-advance FRA cash settlement discounting formula",
      takeaways: [
        "FRA payoffs normally earned at T2 are settled at T1 when borrowing begins",
        "Cash settlement requires discounting by [1 + R_M * (T2 - T1)] back to T1",
        "Payoff = L * (R_M - R_K) * (T2 - T1) / [1 + R_M * (T2 - T1)]"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "FRA In-Advance Cash Settlement Payoff Formula",
        formula: {
          latex: "\\text{Payoff} = \\frac{L (R_M - R_K)(T_2 - T_1)}{1 + R_M(T_2 - T_1)}",
          expression: "L * (R_M - R_K) * (T_2 - T_1) / (1 + R_M * (T_2 - T_1))",
          solvesFor: "Payoff",
          variables: [
            { symbol: "L", latex: "L", meaning: "Notional Principal Amount", unit: "USD" },
            { symbol: "R_M", latex: "R_M", meaning: "Actual Realized Market Rate at T1", unit: "rate" },
            { symbol: "R_K", latex: "R_K", meaning: "Agreed Contract Fixed Rate", unit: "rate" },
            { symbol: "T_2 - T_1", latex: "T_2 - T_1", meaning: "Borrowing Interval in Years", unit: "years" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "L (R_M - R_K)(T_2 - T_1)", meaning: "Interest differential earned over period", unit: "USD" },
          { id: "p2", symbolLatex: "1 + R_M(T_2 - T_1)", meaning: "In-advance discount divisor to date T1", unit: "factor" },
          { id: "p3", symbolLatex: "T_2 - T_1", meaning: "Fractional year tenor (e.g., 0.5 for 6 months)", unit: "years" }
        ],
        note: "Settlement occurs at date T1 rather than T2, requiring division by the spot money market factor."
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Explain why cash settlement occurs at inception date T1",
          sourceFactIds: ["F02"],
          newTerms: ["in-advance settlement"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Formulate the exact FRA payoff formula with discount divisor",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Walk through economic intuition of in-advance cash discounting",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Worked Example (b10, b11, b12)
    {
      id: "s03",
      index: 3,
      title: "Valuing an Existing FRA Prior to Maturity",
      purpose: "Calculate mark-to-market value of an existing FRA using current forward rates",
      takeaways: [
        "Prior to expiration, FRA value is determined by comparing R_K with forward rate R_F",
        "Future cash flow difference is discounted back using continuous zero discount factor e^(-R_2*T_2)",
        "V_FRA = L * (R_F - R_K) * (T2 - T1) * e^(-R_2*T_2)"
      ],
      pedagogicalContinuation: false,
      template: "worked_example",
      data: {
        title: "Mark-to-Market Valuation of an Existing FRA",
        formula: {
          latex: "V_{\\text{FRA}} = L (R_F - R_K)(T_2 - T_1) e^{-R_2 T_2}",
          expression: "L * (R_F - R_K) * (T_2 - T_1) * exp(-R_2 * T_2)",
          solvesFor: "V_{\\text{FRA}}",
          variables: [
            { symbol: "V_{\\text{FRA}}", latex: "V_{\\text{FRA}}", meaning: "Mark-to-Market FRA Value", unit: "USD" },
            { symbol: "L", latex: "L", meaning: "Principal Amount ($100 Million)", unit: "USD" },
            { symbol: "R_F", latex: "R_F", meaning: "Current Market Forward Rate (5.0%)", unit: "rate" },
            { symbol: "R_K", latex: "R_K", meaning: "Agreed Contract Fixed Rate (4.0%)", unit: "rate" },
            { symbol: "T_2", latex: "T_2", meaning: "Final Maturity Date (1.0 Year)", unit: "years" }
          ]
        },
        given: [
          { id: "g1", label: "Notional Principal (L)", value: 100000000, unit: "USD", display: "$100,000,000" },
          { id: "g2", label: "Fixed Rate (R_K)", value: 0.04, unit: "rate", display: "4.00%" },
          { id: "g3", label: "Current Forward (R_F)", value: 0.05, unit: "rate", display: "5.00%" },
          { id: "g4", label: "Period (T_2 - T_1)", value: 0.5, unit: "years", display: "0.50 Years" }
        ],
        steps: [
          { id: "st1", label: "Rate Differential", latex: "0.050 - 0.040 = 0.010 \\text{ (100 bps)}", value: 0.01 },
          { id: "st2", label: "Undiscounted Cash Flow", latex: "100{,}000{,}000 \\times 0.010 \\times 0.5 = \\$500{,}000", value: 500000 },
          { id: "st3", label: "Discount Factor (e^-R2*T2)", latex: "e^{-0.045 \\times 1.0} = 0.955997", value: 0.955997 }
        ],
        result: { id: "res", label: "FRA Market Value", value: 477999, unit: "USD", display: "$477,999", rounding: 0 },
        conclusion: "The fixed rate payer has an unrealized mark-to-market gain of $477,999 because market borrowing rates rose above the locked rate.",
        isHypothetical: false
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Formulate mark to market valuation equation for existing FRAs",
          sourceFactIds: ["F03"],
          newTerms: ["mark-to-market value"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Walk through numerical parameters for $100M FRA valuation",
          sourceFactIds: ["F03"],
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
          onScreenIntent: "Calculate continuous present value and conclude with gain",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Progressive Cards (b13, b14, b15)
    {
      id: "s04",
      index: 4,
      title: "Macaulay Duration: The Weighted Average Horizon",
      purpose: "Define Macaulay duration as cash flow weighted maturity",
      takeaways: [
        "Macaulay duration measures the effective time needed to recover bond cash flows",
        "Zero-coupon bonds have Macaulay duration exactly equal to maturity T",
        "Coupon payments pull cash flow weights earlier, reducing duration below maturity"
      ],
      pedagogicalContinuation: false,
      template: "progressive_cards",
      data: {
        cards: [
          { id: "c1", title: "Cash Flow Weighted Maturity", body: "Macaulay duration weights each cash flow date t_i by the present value proportion of that cash flow relative to total bond price B." },
          { id: "c2", title: "Zero-Coupon Benchmark", body: "For a zero-coupon bond paying full principal at maturity T, Macaulay duration equals maturity T exactly (D = T)." },
          { id: "c3", title: "Coupon Pull Effect", body: "Because coupon bonds distribute cash flows prior to maturity, their Macaulay duration is strictly less than their maturity horizon." }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Define Macaulay duration and weighted cash flow concept",
          sourceFactIds: ["F04"],
          newTerms: ["Macaulay duration"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1"] },
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Contrast zero coupon duration against coupon bond duration",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2"] },
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Summarize how coupon size and yield affect effective maturity",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2", "c3"] },
          visualCues: []
        }
      ]
    },
    // Scene 5: Formula Breakdown (b16, b17, b18)
    {
      id: "s05",
      index: 5,
      title: "Modified Duration & Price Sensitivity",
      purpose: "Formulate Modified duration as first-order percentage price sensitivity",
      takeaways: [
        "Modified duration D* = D / (1 + y/m) measures price sensitivity directly",
        "First-order price response: Delta B / B ≈ -D* * Delta y",
        "Higher duration implies greater capital vulnerability to interest rate increases"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Modified Duration Price Sensitivity Equation",
        formula: {
          latex: "\\frac{\\Delta B}{B} \\approx -D^* \\Delta y",
          expression: "Delta_B / B = -D_star * Delta_y",
          solvesFor: "Delta B / B",
          variables: [
            { symbol: "Delta B / B", latex: "\\frac{\\Delta B}{B}", meaning: "Percentage Change in Bond Price", unit: "pct" },
            { symbol: "D*", latex: "D^*", meaning: "Modified Duration (Years)", unit: "years" },
            { symbol: "Delta y", latex: "\\Delta y", meaning: "Parallel Shift in Yield to Maturity", unit: "rate" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "D^* = \\frac{D}{1 + y/m}", meaning: "Modified duration adjusted for discrete compounding", unit: "years" },
          { id: "p2", symbolLatex: "-\\Delta y", meaning: "Inverse price-yield direction (yield up -> price down)", unit: "rate" },
          { id: "p3", symbolLatex: "\\frac{\\Delta B}{B}", meaning: "Percentage capital change in portfolio value", unit: "pct" }
        ],
        note: "Modified duration provides a linear first-order approximation accurate for small yield shocks."
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Introduce Modified duration and differentiate from Macaulay form",
          sourceFactIds: ["F05"],
          newTerms: ["Modified duration"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Formulate percentage price move equation Delta B / B ≈ -D* Delta y",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Explain portfolio immunization: matching asset and liability duration",
          sourceFactIds: ["F05"],
          newTerms: ["immunization"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Table Compare (b19, b20, b21)
    {
      id: "s06",
      index: 6,
      title: "Convexity: Correcting the Linear Approximation",
      purpose: "Illustrate second-order curvature correction via Convexity",
      takeaways: [
        "Duration is a linear tangent approximation that underestimates price gains and overestimates drops",
        "Convexity C = (1/B)*(d^2 B/dy^2) measures curvature of the price-yield relationship",
        "Full Taylor expansion: Delta B / B ≈ -D* * Delta y + 0.5 * C * (Delta y)^2"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        columns: ["Approximation Order", "Mathematical Formula", "Accuracy Profile & Curvature"],
        rows: [
          {
            id: "r1",
            cells: ["1st Order (Duration Only)", "Delta B / B ≈ -D* * Delta y", "Linear tangent; accurate only for infinitesimal yield moves (e.g., < 10 bps)"]
          },
          {
            id: "r2",
            cells: ["2nd Order (Duration + Convexity)", "Delta B / B ≈ -D* * Delta y + 0.5 * C * (Delta y)^2", "Captures curvature; highly accurate for large market rate shocks (e.g., > 100 bps)"]
          },
          {
            id: "r3",
            cells: ["Convexity Advantage", "+0.5 * C * (Delta y)^2 is always positive", "Bonds gain more when yields fall than they lose when yields rise by same amount"]
          }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Explain the limitation of linear duration for large rate shocks",
          sourceFactIds: ["F06"],
          newTerms: ["convexity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Present the second order Taylor series expansion including convexity",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Explain why positive convexity is inherently desirable for investors",
          sourceFactIds: ["F06"],
          newTerms: ["positive convexity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Progressive Cards (b22, b23, b24)
    {
      id: "s07",
      index: 7,
      title: "Theories of the Term Structure: Expectations vs. Segmentation",
      purpose: "Contrast Expectations Theory and Market Segmentation Theory",
      takeaways: [
        "Expectations Theory states forward rates equal expected future spot zero rates",
        "Market Segmentation Theory asserts supply and demand within maturity buckets dictate rates",
        "Neither theory alone explains why yield curves are predominantly upward-sloping"
      ],
      pedagogicalContinuation: false,
      template: "progressive_cards",
      data: {
        cards: [
          { id: "c1", title: "Expectations Theory", body: "Hypothesizes that long-term interest rates reflect market consensus forecasts of future short-term rates. Assumes investors are risk-neutral across maturities." },
          { id: "c2", title: "Market Segmentation Theory", body: "Argues institutional investors (like pension funds vs commercial banks) have rigid maturity preferences, creating independent supply-demand equilibria in each bucket." },
          { id: "c3", title: "The Empirical Gap", body: "Expectations theory implies curves should slope downward as often as upward; empirical reality shows upward slopes occur > 85% of the time." }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Introduce theories explaining the shape of the yield curve",
          sourceFactIds: ["F07"],
          newTerms: ["expectations theory"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1"] },
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Explain Expectations Theory assumptions and implications",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2"] },
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Introduce Market Segmentation Theory and maturity clienteles",
          sourceFactIds: ["F07"],
          newTerms: ["market segmentation theory"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2", "c3"] },
          visualCues: []
        }
      ]
    },
    // Scene 8: Causal Chain (b25, b26, b27)
    {
      id: "s08",
      index: 8,
      title: "Liquidity Preference Theory: Why Curves Slope Upward",
      purpose: "Explain Liquidity Preference Theory and liquidity premium mechanics",
      takeaways: [
        "Borrowers prefer locking long-term debt while investors prefer liquid short-term assets",
        "Borrowers must pay a liquidity premium to induce investors to hold long-term debt",
        "Forward rates exceed expected future spot rates: R_F = E(spot) + Liquidity Premium"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        links: [
          { id: "l1", role: "condition", text: "Lenders seek short-term liquidity while corporate borrowers demand long-term funding" },
          { id: "l2", role: "action", text: "Long-term borrowers must offer higher yields to incentivize investors to surrender liquidity" },
          { id: "l3", role: "mechanism", text: "A positive liquidity risk premium is embedded across ascending maturity horizons" },
          { id: "l4", role: "result", text: "Forward rates systematically exceed market expectations of future spot zero rates" },
          { id: "l5", role: "consequence", text: "Produces the persistently upward-sloping yield curve observed in global bond markets" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce Liquidity Preference Theory to resolve empirical gaps",
          sourceFactIds: ["F07"],
          newTerms: ["liquidity preference theory"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Explain maturity mismatch between borrowers and lenders",
          sourceFactIds: ["F07"],
          newTerms: ["liquidity premium"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Prove why forward rates exceed expected future spot rates",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 9: Interactive Quiz (b28, b29, b30)
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Calculating Bond Price Move via Duration",
      purpose: "Test understanding of Modified duration percentage price move calculation",
      takeaways: [
        "Percentage price move: Delta B / B = -D* * Delta y",
        "A 5-year duration bond drops by 2.5% when yields rise by 50 basis points",
        "Sign check: yield increase always produces negative capital return"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A bond portfolio has a modified duration of 5.0 years. If interest rate yields rise by 50 basis points (+0.50%), what is the approximate percentage price change?",
        options: [
          "A) +2.50%",
          "B) -0.50%",
          "C) -2.50%",
          "D) -5.00%"
        ],
        correctIndex: 2,
        explanation: "Delta B / B ≈ -D* * Delta y = -5.0 * (+0.0050) = -0.0250 (-2.50%). Option C is correct."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Present the student with active recall duration question",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Work through algebraic calculation: -5.0 * 0.0050 = -2.50%",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Reinforce intuition: inverse price-yield relationship",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Stat Counter (b31, b32, b33, b34)
    {
      id: "s10",
      index: 10,
      title: "Case Study: The $1.6B Orange County Bankruptcy",
      purpose: "Analyze 1994 Orange County collapse due to extreme duration and leverage",
      takeaways: [
        "Orange County geared a $7.5B equity base into a $20B portfolio using reverse repos",
        "Portfolio duration reached ~7.4 years, leaving it defenseless against rate hikes",
        "When the Fed raised rates by 300 bps, collateral calls triggered $1.6B insolvency"
      ],
      pedagogicalContinuation: false,
      template: "stat_counter",
      data: {
        stats: [
          { id: "s1", value: 1.6, decimals: 1, prefix: "$", suffix: "B", label: "Realized Loss", sublabel: "December 1994 Bankruptcy" },
          { id: "s2", value: 20.0, decimals: 1, prefix: "$", suffix: "B", label: "Leveraged Portfolio", sublabel: "Financed via Short Repo" },
          { id: "s3", value: 7.4, decimals: 1, suffix: " Yrs", label: "Macaulay Duration", sublabel: "Extreme rate sensitivity" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Introduce the 1994 Orange County bankruptcy case study",
          sourceFactIds: ["F08"],
          newTerms: ["Orange County collapse"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Examine reverse repo leverage structure and duration mismatch",
          sourceFactIds: ["F08"],
          newTerms: ["reverse repo leverage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Explain Fed 300 bps rate hikes and margin call spiral",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Summarize risk management lessons on leverage and duration limits",
          sourceFactIds: ["F08"],
          newTerms: [],
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
      title: "Summary Thread: Four Pillars of Fixed Income Risk Management",
      purpose: "Synthesize the core risk management principles of Chapter 4 Part 2",
      takeaways: [
        "FRAs lock forward borrowing costs with in-advance cash settlement discounting",
        "Modified duration predicts linear price moves and immunizes asset-liability portfolios",
        "Convexity captures second-order curvature essential during large market rate shocks"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Fixed Income Risk in 8 Rules",
        rules: [
          { id: "r1", title: "FRA forward locks", text: "FRAs are bespoke OTC contracts allowing counterparties to lock borrowing rates over future windows." },
          { id: "r2", title: "In-advance cash settlement", text: "FRA settlement occurs at date T1, requiring discounting by [1 + R_M * (T2 - T1)] back to inception." },
          { id: "r3", title: "Mark-to-market valuation", text: "Prior to expiry, FRA value is determined by comparing R_K with forward rate R_F discounted by e^(-R_2*T_2)." },
          { id: "r4", title: "Macaulay duration horizon", text: "Macaulay duration measures the weighted average maturity of all present-value discounted cash flows." },
          { id: "r5", title: "Modified duration sensitivity", text: "Modified duration D* = D / (1 + y/m) quantifies percentage price move via Delta B / B ≈ -D* * Delta y." },
          { id: "r6", title: "Portfolio immunization", text: "Matching asset and liability duration immunizes equity against parallel yield curve shifts." },
          { id: "r7", title: "Convexity curvature correction", text: "Convexity restores precision for large shocks via Delta B / B ≈ -D* * Delta y + 0.5 * C * (Delta y)^2." },
          { id: "r8", title: "Liquidity preference premium", text: "Borrower demand for long-term debt creates positive liquidity premiums, producing upward-sloping yield curves." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Recap Pillar 1: Forward Rate Agreements and OTC locks",
          sourceFactIds: ["F01", "F02"],
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
          onScreenIntent: "Recap Pillar 2: Macaulay and Modified Duration",
          sourceFactIds: ["F04", "F05"],
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
          onScreenIntent: "Recap Pillar 3: Convexity and Taylor Series expansions",
          sourceFactIds: ["F06"],
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
          onScreenIntent: "Recap Pillar 4: Term structure theories and liquidity premiums",
          sourceFactIds: ["F07"],
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
          onScreenIntent: "Reflect on Orange County and failure of risk governance",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b6",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Conclude Chapter 4 and preview Chapter 5: Determination of Forward Prices",
          sourceFactIds: [],
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
console.log('Successfully generated complete compliant artifacts for Chapter 4 Part 2!');
