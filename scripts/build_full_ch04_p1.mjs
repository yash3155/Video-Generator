import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch04/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_04/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_04/Part_01/script_hi.md', 'utf8');

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const hiMatches = [...hiScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];

const enBeats = {};
const hiBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
hiMatches.forEach(m => hiBeats[m[1]] = m[2].trim());

for (let i = 1; i <= 41; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts!`);
  }
}

// 1. Facts with full numerical grounding from Chapter 4
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch04",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Treasury rates are sovereign default-free borrowing rates in national currency. Repo rates represent collateralized borrowing backed by government securities, trading slightly below unsecured benchmark rates.",
      citation: { chapter: "4", section: "4.1", page: "77" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "Discrete compounding terminal value is A*(1 + R/m)^(mn). As m approaches infinity, continuous compounding yields terminal value A*e^(Rn).",
      citation: { chapter: "4", section: "4.2", page: "79" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "The conversion between discrete rate R_m compounded m times per annum and continuous equivalent R_c is R_c = m * ln(1 + R_m / m), and conversely R_m = m * (e^(R_c / m) - 1).",
      citation: { chapter: "4", section: "4.2", page: "80" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "The continuous present value discount factor for cash flow B received at time T is PV = B * e^(-RT), where R is the zero rate for maturity T.",
      citation: { chapter: "4", section: "4.2", page: "81" }
    },
    {
      id: "F05",
      category: "definition",
      statement: "An n-year zero-coupon interest rate is the rate earned on an investment starting today and lasting for n years with no intermediate coupon payments.",
      citation: { chapter: "4", section: "4.3", page: "82" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Theoretical bond price is sum of discounted cash flows: P = sum(C * e^(-R_i * t_i)) + F * e^(-R_n * t_n), which must equal market price to avoid arbitrage.",
      citation: { chapter: "4", section: "4.4", page: "82" }
    },
    {
      id: "F07",
      category: "definition",
      statement: "The par yield is the coupon rate per year that causes the bond price to equal its par (face) value.",
      citation: { chapter: "4", section: "4.4", page: "83" }
    },
    {
      id: "F08",
      category: "process",
      statement: "The Bootstrap method determines zero rates recursively from Treasury bills and coupon bond market prices by stripping prior known coupon cash flows.",
      citation: { chapter: "4", section: "4.5", page: "84" }
    },
    {
      id: "F09",
      category: "formula",
      statement: "The forward rate R_F for the period between T_1 and T_2 implied by zero rates R_1 and R_2 is R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1).",
      citation: { chapter: "4", section: "4.6", page: "86" }
    },
    {
      id: "F10",
      category: "numerical_example",
      statement: "If zero rate for 1 year is 3.0% and for 2 years is 4.0%, the 1-year forward rate starting at year 1 is R_F = (0.04*2 - 0.03*1) / (2 - 1) = 5.0%.",
      citation: { chapter: "4", section: "4.6", page: "87" }
    }
  ],
  realWorldProblem: {
    actors: "Fixed income traders, quantitative pricing desks, and bank treasurers",
    situation: "Pricing multi-period derivative contracts and discounting corporate bond cash flows across diverse maturities",
    failure: "Discounting at flat Yield to Maturity instead of spot zero curves creates mispricing and severe arbitrage vulnerability",
    invention: "Continuous compounding, the recursive Bootstrap method, and forward curve extraction",
    factIds: ["F01", "F03", "F06", "F08", "F09"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch04",
  partId: "p1",
  title: "Interest Rate Mechanics, Zero Curves & The Bootstrap Method",
  targetMinutes: 14,
  prerequisites: ["Hull Chapter 1: Introduction", "Hull Chapter 3: Hedging Strategies"],
  learningOutcomes: [
    "Differentiate sovereign Treasury rates, unsecured bank rates, and collateralized Repo rates",
    "Convert between discrete and continuous compounding frequencies via R_c = m * ln(1 + R_m / m)",
    "Price coupon-bearing bonds using continuous zero discount factors PV = B * e^(-RT)",
    "Execute the recursive Bootstrap algorithm to extract continuous zero curves from bond prices",
    "Calculate implied forward interest rates R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1)"
  ],
  causalChain: [
    "Compounding frequency affects effective yields -> Continuous compounding simplifies discounting across multi-year cash flows",
    "Coupon bonds bundle multiple cash flows -> Bootstrapping unbundles coupons recursively to reveal true zero discount rates",
    "Spot zero rates determine spot discounting -> Forward rate formulas lock in future borrowing costs to eliminate arbitrage"
  ],
  predictionQuestions: [
    {
      question: "If the 1-year zero rate is 3% and the 2-year zero rate is 4%, what is the 1-year forward rate for Year 2?",
      answer: "5.0%, calculated as (4% * 2 - 3% * 1) / (2 - 1) = 5.0%."
    }
  ],
  sceneOutline: [
    { sceneIndex: 0, title: "The Cornerstone of Derivatives: Interest Rates", beats: ["b01", "b02", "b03"] },
    { sceneIndex: 1, title: "The Taxonomy of Rates: Treasury, LIBOR & Repo", beats: ["b04", "b05", "b06"] },
    { sceneIndex: 2, title: "Compounding Frequencies & Continuous Compounding", beats: ["b07", "b08", "b09", "b10"] },
    { sceneIndex: 3, title: "Present Value Discounting via Exponential Form", beats: ["b11", "b12", "b13"] },
    { sceneIndex: 4, title: "Zero Rates: The Pure Building Blocks of Yield", beats: ["b14", "b15", "b16", "b17"] },
    { sceneIndex: 5, title: "Bond Pricing, Yield to Maturity (YTM) & Par Yield", beats: ["b18", "b19", "b20", "b21"] },
    { sceneIndex: 6, title: "The Bootstrap Method: Extracting Zero Curves", beats: ["b22", "b23", "b24", "b25"] },
    { sceneIndex: 7, title: "Worked Bootstrap Example: Numerical Progression", beats: ["b26", "b27"] },
    { sceneIndex: 8, title: "Forward Rates: Implied Future Borrowing Costs", beats: ["b28", "b29", "b30"] },
    { sceneIndex: 9, title: "Active Recall Scenario: Calculating the Forward Rate", beats: ["b31", "b32", "b33"] },
    { sceneIndex: 10, title: "Yield Curve Anatomy: Upward vs. Downward Sloping", beats: ["b34", "b35", "b36"] },
    { sceneIndex: 11, title: "Summary Thread: Four Pillars of Interest Rate Mechanics", beats: ["b37", "b38", "b39", "b40", "b41"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '04_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Complete 08_episode.json compliant with OpenLectern Zod schema
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch04",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 4",
  partLabel: "Part 1",
  title: "Interest Rate Mechanics, Zero Curves & The Bootstrap Method",
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
    // Scene 0: Chat story (4 beats: dilemma + b01, b02, b03)
    {
      id: "s00",
      index: 0,
      title: "The Cornerstone of Derivatives: Interest Rates",
      purpose: "Establish interest rates as the fundamental pricing foundation for all derivative contracts",
      takeaways: [
        "Interest rates are the fundamental building block for pricing forwards, swaps, and options",
        "Multiple benchmark rates exist simultaneously reflecting credit risk, collateral, and maturity",
        "Chapter 4 masters rate taxonomy, continuous compounding, zero curves, and bootstrapping"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "Why do interest rates matter so critically for derivative valuation?" },
          { id: "m2", speaker: "mentor", text: "Every forward contract, swap, and option model relies on discounting future cash flows and financing underlying assets." },
          { id: "m3", speaker: "mentor", text: "Yet in real-world markets, no single universal interest rate exists. Rates vary by credit risk, collateral, and maturity." },
          { id: "m4", speaker: "mentor", text: "In Chapter 4, we master benchmark rates, continuous compounding mathematics, zero curves, and the Bootstrap method." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Rate Taxonomy", "Compounding Math", "Zero Curves", "Bond Pricing", "Bootstrap Method", "Forward Rates"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "Why do interest rates matter so critically for derivative valuation?" },
            hi: { display: "डेरिवेटिव्स वैल्यूएशन और ऑप्शन प्राइसिंग के लिए इंटरेस्ट रेट्स इतनी ज्यादा जरूरी क्यों हैं?" }
          },
          onScreenIntent: "Opening dilemma question on interest rates in derivatives",
          sourceFactIds: ["F01"],
          newTerms: ["interest rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor explains the fundamental building blocks of derivatives",
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
          onScreenIntent: "The mentor explains multiple benchmark rates in real markets",
          sourceFactIds: ["F01"],
          newTerms: ["benchmark rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "The mentor outlines Chapter 4 syllabus and core objectives",
          sourceFactIds: ["F01"],
          newTerms: [],
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
      title: "The Taxonomy of Rates: Treasury, LIBOR & Repo",
      purpose: "Contrast sovereign debt instruments and collateralized repo financing",
      takeaways: [
        "Treasury rates represent sovereign government debt, treated as default-free",
        "Repo rates represent collateralized money market financing backed by securities",
        "Collateralization allows repo rates to trade below unsecured interbank lending"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "left_col",
          heading: "Treasury Rates (Sovereign)",
          tone: "positive",
          points: [
            "Issued by national sovereign governments in domestic currency",
            "Traditionally viewed as free from credit default risk",
            "Regulatory bank liquidity requirements create artificial high demand"
          ]
        },
        right: {
          id: "right_col",
          heading: "Repo Rates (Collateralized)",
          tone: "neutral",
          points: [
            "Collateralized money market financing backed by government debt",
            "Borrower sells securities and repurchases at higher agreed price",
            "Collateral protection allows repo rates to trade below unsecured loans"
          ]
        },
        verdict: {
          id: "verdict_box",
          text: "Repo rates provide secured liquidity; Treasuries define sovereign credit-free benchmarks."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce the three global benchmark rates",
          sourceFactIds: ["F01"],
          newTerms: ["Treasury rate", "Repo rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Examine Treasury rate risk-free mechanics",
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
          onScreenIntent: "Examine Repo rate mechanics and collateral backing",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Formula Breakdown (b07, b08, b09, b10)
    {
      id: "s02",
      index: 2,
      title: "Compounding Frequencies & Continuous Compounding",
      purpose: "Derive continuous compounding limit and rate conversion formulas",
      takeaways: [
        "Compounding frequency m dictates capital growth via A*(1 + R/m)^(mn)",
        "Taking m to infinity produces continuous compounding governed by e^(Rn)",
        "Rate conversion formula R_c = m * ln(1 + R_m / m) provides exact equivalence"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Continuous Equivalent Compounding Rate",
        formula: {
          latex: "R_c = m \\ln\\left(1 + \\frac{R_m}{m}\\right)",
          expression: "m * ln(1 + R_m / m)",
          solvesFor: "R_c",
          variables: [
            { symbol: "R_c", latex: "R_c", meaning: "Continuously compounded annual interest rate", unit: "pct" },
            { symbol: "m", latex: "m", meaning: "Compounding frequency per annum", unit: "count" },
            { symbol: "R_m", latex: "R_m", meaning: "Discrete interest rate compounded m times per annum", unit: "pct" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "R_c", meaning: "Continuously compounded rate", unit: "pct" },
          { id: "p2", symbolLatex: "m", meaning: "Compounding intervals per year", unit: "count" },
          { id: "p3", symbolLatex: "R_m", meaning: "Nominal discrete rate", unit: "pct" }
        ],
        note: "As compounding frequency m approaches infinity, discrete capital growth converges to e^(Rn)."
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Explain compounding frequency and discrete terminal value",
          sourceFactIds: ["F02"],
          newTerms: ["compounding frequency"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Formulate continuous limit taking m to infinity",
          sourceFactIds: ["F02"],
          newTerms: ["continuous compounding"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Present exact discrete to continuous conversion formula",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Summarize mathematical convenience of continuous compounding",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Worked Example (b11, b12, b13)
    {
      id: "s03",
      index: 3,
      title: "Present Value Discounting via Exponential Form",
      purpose: "Demonstrate present value discounting with continuous discount factor PV = B * e^(-RT)",
      takeaways: [
        "Present value equals future payment B multiplied by discount factor e^(-RT)",
        "Continuous discount factors prevent rounding errors across irregular horizons",
        "Multi-period compounding simplifies to straightforward summation of exponents"
      ],
      pedagogicalContinuation: false,
      template: "worked_example",
      data: {
        title: "Continuous Present Value Discounting",
        formula: {
          latex: "PV = B e^{-RT}",
          expression: "B * exp(-R * T)",
          solvesFor: "PV",
          variables: [
            { symbol: "PV", latex: "PV", meaning: "Present Value", unit: "USD" },
            { symbol: "B", latex: "B", meaning: "Future Cash Flow", unit: "USD" },
            { symbol: "R", latex: "R", meaning: "Continuous Zero Rate", unit: "rate" },
            { symbol: "T", latex: "T", meaning: "Maturity Horizon", unit: "years" }
          ]
        },
        given: [
          { id: "g1", label: "Future Cash Flow (B)", value: 100, unit: "USD", display: "$100.00" },
          { id: "g2", label: "Maturity (T)", value: 2.5, unit: "years", display: "2.5 Years" },
          { id: "g3", label: "Continuous Zero Rate (R)", value: 0.045, unit: "rate", display: "4.50%" }
        ],
        steps: [
          { id: "st1", label: "Discount Exponent", latex: "-0.045 \\times 2.5 = -0.1125", value: -0.1125 },
          { id: "st2", label: "Discount Factor", latex: "e^{-0.1125} = 0.89360", value: 0.8936 },
          { id: "st3", label: "Present Value", latex: "100 \\times 0.89360 = \\$89.36", value: 89.36 }
        ],
        result: { id: "res", label: "Present Value", value: 89.36, unit: "USD", display: "$89.36", rounding: 2 },
        conclusion: "Continuous discounting yields exact, mathematically consistent present values across any fractional horizon.",
        isHypothetical: false
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Formulate the present value continuous discount factor",
          sourceFactIds: ["F04"],
          newTerms: ["discount factor"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Walk through step by step discounting calculation",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Conclude with analytical power of continuous discounting",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Progressive Cards (b14, b15, b16, b17)
    {
      id: "s04",
      index: 4,
      title: "Zero Rates: The Pure Building Blocks of Yield",
      purpose: "Define spot zero rates and contrast against flat yield assumptions",
      takeaways: [
        "Spot zero rate is the rate earned from today to maturity T with zero coupons",
        "Zero rates eliminate intermediate reinvestment rate uncertainty",
        "All derivative pricing unbundles instruments into pure spot zero cash flows"
      ],
      pedagogicalContinuation: false,
      template: "progressive_cards",
      data: {
        cards: [
          { id: "c1", title: "Spot Zero-Coupon Rate", body: "The rate earned on an investment starting today with zero intermediate cash flows, paying full principal and interest at maturity T." },
          { id: "c2", title: "Eliminating Reinvestment Risk", body: "Unlike coupon bonds whose yield assumes reinvestment at a constant rate, zero rates represent clean, uncontaminated spot discount prices." },
          { id: "c3", title: "The Foundation of the Yield Curve", body: "All derivative valuation models unbundle compound instruments into individual spot zero payments across the term structure." }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Define zero rates and spot discounting",
          sourceFactIds: ["F05"],
          newTerms: ["zero rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1"] },
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Contrast zero rates against reinvestment assumptions",
          sourceFactIds: ["F05"],
          newTerms: ["reinvestment risk"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2"] },
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Examine spot zero curve across different maturities",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2", "c3"] },
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Summarize why zero rates are true pricing atoms",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2", "c3"] },
          visualCues: []
        }
      ]
    },
    // Scene 5: Table Compare (b18, b19, b20, b21)
    {
      id: "s05",
      index: 5,
      title: "Bond Pricing, Yield to Maturity (YTM) & Par Yield",
      purpose: "Contrast zero curve valuation, Yield to Maturity, and Par Yields",
      takeaways: [
        "Bonds are bundles of individual zero-coupon payments discounted at spot zero rates",
        "Yield to Maturity is an internal rate of return averaging the term structure",
        "Par yield is the coupon rate causing bond price to equal face par value"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        columns: ["Valuation Metric", "Pricing Mechanism", "Risk & Curve Sensitivity"],
        rows: [
          {
            id: "r1",
            cells: ["Zero Curve Valuation", "Each cash flow discounted at its exact spot zero maturity rate", "Full curve sensitivity; arbitrage-free pricing"]
          },
          {
            id: "r2",
            cells: ["Yield to Maturity (YTM)", "Single constant discount rate equating price to cash flows", "Averages curve; assumes flat reinvestment rates"]
          },
          {
            id: "r3",
            cells: ["Par Yield", "Coupon rate causing bond price to equal 100% of par face value", "Benchmark for interest rate swap fixed leg pricing"]
          }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Explain theoretical bond valuation via zero curve",
          sourceFactIds: ["F06"],
          newTerms: ["theoretical bond price"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Define Yield to Maturity and its single-rate limitation",
          sourceFactIds: ["F06"],
          newTerms: ["yield to maturity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Contrast arbitrage-free zero pricing with flat YTM",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Define Par Yield and its relationship to par bonds",
          sourceFactIds: ["F07"],
          newTerms: ["par yield"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Diagram Flow (b22, b23, b24, b25)
    {
      id: "s06",
      index: 6,
      title: "The Bootstrap Method: Extracting Zero Curves",
      purpose: "Illustrate recursive coupon stripping in the Bootstrap method",
      takeaways: [
        "The bootstrap extracts zero rates sequentially from market prices of liquid bonds",
        "Treasury bills provide direct zero rates without intermediate coupon stripping",
        "The resulting zero curve reproduces the market price of every input benchmark bond"
      ],
      pedagogicalContinuation: false,
      template: "diagram_flow",
      data: {
        mode: "flow",
        nodes: [
          { id: "n1", label: "Step 1: T-Bills", sublabel: "Direct zero rates from 0.25y - 1.0y discount bills" },
          { id: "n2", label: "Step 2: Coupon Stripping", sublabel: "Discount known earlier cash flows using known zeros" },
          { id: "n3", label: "Step 3: Solve Final Zero", sublabel: "Isolate single unknown spot zero rate at maturity T" },
          { id: "n4", label: "Step 4: Curve Construction", sublabel: "Interpolate continuous zero curve across all tenors" }
        ],
        edges: [
          { from: "n1", to: "n2", label: "Base Zero Rates" },
          { from: "n2", to: "n3", label: "Recursive Strip" },
          { from: "n3", to: "n4", label: "Term Structure" }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Introduce the recursive Bootstrap method",
          sourceFactIds: ["F08"],
          newTerms: ["bootstrap method"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Step 1: Obtain short term zeros directly from T-bills",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Step 2 & 3: Strip earlier coupons and solve final spot zero",
          sourceFactIds: ["F08"],
          newTerms: ["coupon stripping"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Step 4: Complete continuous term structure across maturities",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Stat Counter (b26, b27)
    {
      id: "s07",
      index: 7,
      title: "Worked Bootstrap Example: Numerical Progression",
      purpose: "Present concrete bootstrap results with unclipped responsive typography",
      takeaways: [
        "0.25y, 0.5y, and 1.0y zero rates derived directly from money market instruments",
        "1.5y and 2.0y zero rates extracted after discounting prior semiannual coupons",
        "Ascending zero rates indicate an upward-sloping term structure"
      ],
      pedagogicalContinuation: false,
      template: "stat_counter",
      data: {
        stats: [
          { id: "s1", value: 3.0, decimals: 1, suffix: "%", label: "1.0-Year Zero Rate", sublabel: "Derived directly from T-Bill" },
          { id: "s2", value: 4.0, decimals: 1, suffix: "%", label: "2.0-Year Zero Rate", sublabel: "Extracted via coupon stripping" },
          { id: "s3", value: 5.0, decimals: 1, suffix: "%", label: "Year-2 Forward Rate", sublabel: "Implied forward rate (R_F)" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Walk through numerical progression of zero rates",
          sourceFactIds: ["F08", "F10"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Highlight continuous zero curve progression across tenors",
          sourceFactIds: ["F08", "F10"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Formula Breakdown (b28, b29, b30)
    {
      id: "s08",
      index: 8,
      title: "Forward Rates: Implied Future Borrowing Costs",
      purpose: "Formulate implied forward interest rate equation R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1)",
      takeaways: [
        "Forward rate is the borrowing rate implied today for a future period T1 to T2",
        "R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1) under continuous compounding",
        "Deviations between market and implied forward rates trigger risk-free cash-and-carry profits"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Implied Forward Interest Rate Formula",
        formula: {
          latex: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
          expression: "(R_2 * T_2 - R_1 * T_1) / (T_2 - T_1)",
          solvesFor: "R_F",
          variables: [
            { symbol: "R_F", latex: "R_F", meaning: "Forward rate between T1 and T2", unit: "pct" },
            { symbol: "R_1", latex: "R_1", meaning: "Zero rate for maturity T1", unit: "pct" },
            { symbol: "R_2", latex: "R_2", meaning: "Zero rate for maturity T2", unit: "pct" },
            { symbol: "delta_T", latex: "T_2 - T_1", meaning: "Forward interval", unit: "years" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "R_F", meaning: "Forward rate between T1 and T2", unit: "pct" },
          { id: "p2", symbolLatex: "R_1, R_2", meaning: "Spot zero rates for maturities T1 and T2", unit: "pct" },
          { id: "p3", symbolLatex: "T_2 - T_1", meaning: "Forward contract horizon", unit: "years" }
        ],
        note: "When zero curve rises, Forward Rate > Zero Rate > Par Yield."
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Define implied forward rates and their market role",
          sourceFactIds: ["F09"],
          newTerms: ["forward rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Formulate continuous forward rate formula",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Explain cash and carry arbitrage preventing deviations",
          sourceFactIds: ["F09"],
          newTerms: ["arbitrage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 9: Interactive Quiz (b31, b32, b33)
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Calculating the Forward Rate",
      purpose: "Test understanding of forward rate extraction from zero curves",
      takeaways: [
        "Forward rate math: multiply each spot rate by its tenor, subtract, and divide by the interval",
        "When zero curve rises, the forward rate must lie above both spot rates",
        "Forward rates form the pricing bedrock for Forward Rate Agreements (FRAs)"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "If the 1-year continuous zero rate is 3% and the 2-year continuous zero rate is 4%, what is the 1-year forward rate for Year 2?",
        options: [
          "A) 3.5% per annum",
          "B) 4.0% per annum",
          "C) 5.0% per annum",
          "D) 7.0% per annum"
        ],
        correctIndex: 2,
        explanation: "Using R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1) = (0.04*2 - 0.03*1) / (2 - 1) = (0.08 - 0.03) / 1 = 5.0%. Option C is correct."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Prompt the student with active recall question",
          sourceFactIds: ["F10"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Work through exact algebraic solution to the quiz",
          sourceFactIds: ["F10"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Reflect on intuition: forward rates lead zero curves",
          sourceFactIds: ["F10"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Causal Chain (b34, b35, b36)
    {
      id: "s10",
      index: 10,
      title: "Yield Curve Anatomy: Upward vs. Downward Sloping",
      purpose: "Demonstrate yield curve hierarchy: Forward > Zero > Par in rising curves",
      takeaways: [
        "In upward-sloping markets, Forward Rate > Zero Rate > Par Yield",
        "In inverted markets, Forward Rate < Zero Rate < Par Yield",
        "Curve inversion historically signals tight monetary policy and recession risk"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        links: [
          { id: "l1", role: "condition", text: "Spot zero yield curve is upward-sloping across maturities (R_2 > R_1)" },
          { id: "l2", role: "action", text: "Investor calculates implied future borrowing rate via forward formula" },
          { id: "l3", role: "mechanism", text: "Higher long-term yield requires higher forward rate to satisfy no-arbitrage" },
          { id: "l4", role: "result", text: "Forward rate is pulled above both short and long spot zero rates" },
          { id: "l5", role: "consequence", text: "Establishes definitive term structure hierarchy: Forward > Zero > Par" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Analyze upward-sloping yield curve hierarchy",
          sourceFactIds: ["F07", "F09"],
          newTerms: ["yield curve hierarchy"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Contrast with inverted downward-sloping curves",
          sourceFactIds: ["F07", "F09"],
          newTerms: ["inverted yield curve"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Conclude with macroeconomic implications of curve shape",
          sourceFactIds: ["F07", "F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b37, b38, b39, b40, b41)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Interest Rate Mechanics",
      purpose: "Synthesize the core principles of Chapter 4 Part 1",
      takeaways: [
        "Continuous compounding simplifies multi-period valuation to additive exponential math",
        "Zero rates eliminate reinvestment risk and provide uncontaminated discount factors",
        "The recursive bootstrap builds complete arbitrage-free curves from market coupon bonds"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Interest Rate Mechanics in 8 Rules",
        rules: [
          { id: "r1", title: "Benchmark rate taxonomy", text: "Treasury, Repo, and Unsecured rates form the benchmark taxonomy across global money markets." },
          { id: "r2", title: "Discrete terminal value", text: "Compounding frequency m governs capital growth via terminal equation A*(1 + R/m)^(mn)." },
          { id: "r3", title: "Continuous exponential limit", text: "Continuous compounding simplifies multi-period valuation to additive exponential math via A*e^(Rn)." },
          { id: "r4", title: "Exact rate conversion", text: "Conversion formula R_c = m*ln(1 + R_m/m) maps discrete compounding frequencies to continuous form." },
          { id: "r5", title: "Present value discount factor", text: "Continuous discount factor PV = B*e^(-RT) computes exact present values across any tenor." },
          { id: "r6", title: "Pure spot zero atoms", text: "Zero rates eliminate reinvestment risk and provide uncontaminated building blocks for the yield curve." },
          { id: "r7", title: "Recursive bootstrap standard", text: "The Bootstrap method unbundles coupon bonds recursively to build complete market zero curves." },
          { id: "r8", title: "Forward rates & yield hierarchy", text: "Forward rates R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) govern OTC forward locks and determine yield curve hierarchy." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Recap Pillar 1: Benchmark Rate Taxonomy",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Recap Pillar 2: Continuous Compounding Power",
          sourceFactIds: ["F02", "F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Recap Pillar 3: Zero Rates & The Bootstrap Method",
          sourceFactIds: ["F05", "F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Recap Pillar 4: Forward Rates & Curve Geometry",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b41 }, hi: { display: hiBeats.b41 } },
          onScreenIntent: "Preview Part 2: FRAs, Duration, Convexity, and Orange County",
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
console.log('Successfully generated complete compliant artifacts for Chapter 4 Part 1!');
