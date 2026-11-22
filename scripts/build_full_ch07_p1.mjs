import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch07/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_07/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_07/Part_01/script_hi.md', 'utf8');

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
    throw new Error(`Missing beat ${k} in source scripts!`);
  }
}

// 1. Facts with full numerical grounding from Chapter 7 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch07",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "An Interest Rate Swap (IRS) is an over-the-counter agreement between two counterparties to exchange periodic interest rate cash flows based on a specified notional principal amount without principal exchange.",
      citation: { chapter: "7", section: "7.1", page: "153" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "Net periodic payment exchanged on settlement date is: Net Cash Flow = Notional L * (Floating Rate - Fixed Rate) * tau, where tau is day count fraction.",
      citation: { chapter: "7", section: "7.1", page: "154" }
    },
    {
      id: "F03",
      category: "definition",
      statement: "The Comparative Advantage Argument exploits the Quality Spread Differential (QSD): the spread difference between fixed and floating borrowing rates across credit ratings (e.g. AAA vs. BBB).",
      citation: { chapter: "7", section: "7.3", page: "157" }
    },
    {
      id: "F04",
      category: "rule",
      statement: "Comparative advantage is often an illusion: synthetic fixed borrowing via short-term floating debt exposes the lower-rated borrower to rollover refinancing risk and spread widening.",
      citation: { chapter: "7", section: "7.3", page: "160" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Swap Valuation Method 1 (Bond Portfolio): To fixed payer, V_swap = B_floating - B_fixed. Immediately after a reset, B_floating = Notional L.",
      citation: { chapter: "7", section: "7.4", page: "162" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Swap Valuation Method 2 (FRA Strip): V_swap = sum of discounted cash flows L * (F_i - R_K) * tau * e^(-r_i * t_i), treating forward rates F_i as realized rates.",
      citation: { chapter: "7", section: "7.5", page: "164" }
    },
    {
      id: "F07",
      category: "definition",
      statement: "The Par Swap Rate is the fixed coupon rate that equates the initial value of the swap to zero (V_swap = 0), setting fixed bond value to par 100.",
      citation: { chapter: "7", section: "7.6", page: "166" }
    },
    {
      id: "F08",
      category: "numerical_example",
      statement: "Active recall scenario: $100M notional swap, fixed rate = 4.50%, 6-month floating benchmark = 5.20%, tau = 0.50. Net payment = $100M * (0.0520 - 0.0450) * 0.50 = $100M * 0.0070 * 0.50 = $350,000 paid by floating payer.",
      citation: { chapter: "7", section: "7.1", page: "155" }
    }
  ],
  realWorldProblem: {
    actors: "Corporate treasurers, swap dealers at global investment banks, and institutional asset managers",
    situation: "Transforming corporate debt cash flow profiles between fixed and floating liabilities and bootstrapping benchmark swap zero curves",
    failure: "Misunderstanding rollover refinancing risk or miscalculating mark-to-market swap values leads to catastrophic balance sheet default",
    invention: "Plain Vanilla Interest Rate Swap, Quality Spread Differential structuring, and Dual Bond / FRA valuation models",
    factIds: ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch07",
  partId: "p1",
  title: "Swaps - Part 1",
  subtitle: "Mechanics, Comparative Advantage & Valuation of Interest Rate Swaps",
  targetAudience: "Corporate treasurers, fixed income traders, and quantitative risk analysts",
  prerequisites: ["Compounding conventions", "Zero rates and discount factors", "Forward rate agreements (FRAs)"],
  scenes: [
    { sceneId: "s00", title: "The Multi-Trillion Dollar Cash Flow Exchange: The Interest Rate Swap", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Plain Vanilla Swaps: Fixed vs. Floating Cash Flow Mechanics", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Financial Intermediation: How Swap Dealers Warehouse Risk", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "The Comparative Advantage Argument: The Quality Spread Differential", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "Numerical Walkthrough: Hull's Classic AAA vs. BBB Swap Structuring", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "Hull's Cautionary Analysis: Why Comparative Advantage is an Illusion", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Institutional Plumbing: The ISDA Master Agreement & Confirmations", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Swap Valuation Method 1: The Bond Portfolio Formulation", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Swap Valuation Method 2: The FRA Forward Rate Discounting Model", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Calculating Swap Net Cash Flows", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "The Term Structure of Swap Rates & Zero-Curve Bootstrapping", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Interest Rate Swaps", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch07",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "Swap Net Cash Flow",
      latex: "\\text{Net Payment} = L \\times (R_{\\text{floating}} - R_{\\text{fixed}}) \\times \\tau",
      variables: [
        { symbol: "L", description: "Notional principal amount", unit: "currency" },
        { symbol: "R_floating", description: "Observed floating benchmark interest rate", unit: "decimal/year" },
        { symbol: "R_fixed", description: "Agreed fixed swap coupon rate", unit: "decimal/year" },
        { symbol: "tau", description: "Day count accrual fraction", unit: "years" }
      ]
    },
    {
      id: "M02",
      name: "Swap Valuation: Bond Portfolio Model",
      latex: "V_{\\text{swap}} = B_{\\text{floating}} - B_{\\text{fixed}}",
      variables: [
        { symbol: "V_swap", description: "Market value of interest rate swap to fixed payer", unit: "currency" },
        { symbol: "B_floating", description: "Value of floating-rate bond leg (par L at resets)", unit: "currency" },
        { symbol: "B_fixed", description: "Value of fixed-rate bond leg discounted at zero rates", unit: "currency" }
      ]
    },
    {
      id: "M03",
      name: "Swap Valuation: FRA Strip Model",
      latex: "V_{\\text{swap}} = \\sum_{i=1}^{n} L (F_i - R_K) \\tau e^{-r_i t_i}",
      variables: [
        { symbol: "F_i", description: "Forward interest rate for period i", unit: "decimal/year" },
        { symbol: "R_K", description: "Fixed swap rate agreed at inception", unit: "decimal/year" },
        { symbol: "r_i", description: "Zero rate for maturity t_i", unit: "decimal/year" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch07",
  partId: "p1",
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
  chapterId: "ch07",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 7",
  partLabel: "Part 1",
  title: "Swaps - Part 1",
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
    // Scene 0: Chat story (4 beats: opening dilemma + b01, b02, b03)
    {
      id: "s00",
      index: 0,
      title: "The Multi-Trillion Dollar Cash Flow Exchange: The Interest Rate Swap",
      purpose: "Introduce Interest Rate Swaps as bilateral OTC tools resolving fixed vs. floating debt mismatches",
      takeaways: [
        "Corporate borrowers frequently face structural fixed vs. floating debt mismatches",
        "An IRS exchanges periodic cash flows without ever transferring principal",
        "Chapter 7 Part 1 masters swap plumbing, intermediation, comparative advantage, and valuation"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "How can a company transform a floating-rate bank loan into a fixed-rate obligation without refinancing the debt?" },
          { id: "m2", speaker: "mentor", text: "Global financial markets trade hundreds of trillions in debt. To solve fixed vs. floating mismatches, financial engineering invented the Interest Rate Swap." },
          { id: "m3", speaker: "mentor", text: "An Interest Rate Swap is a bilateral OTC agreement to exchange periodic interest cash flows based on a notional principal without ever transferring principal." },
          { id: "m4", speaker: "mentor", text: "In Chapter 7, we master plain vanilla swap plumbing, dealer risk intermediation, Comparative Advantage, and dual valuation models." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Swap Intro", "Plain Vanilla Mechanics", "Dealer Intermediation", "Comparative Advantage", "Refinancing Risk", "Bond & FRA Valuation"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "How can a company transform a floating-rate bank loan into a fixed-rate obligation without refinancing the debt?" },
            hi: { display: "क्या कोई कंपनी बिना लोन रिफाइनेंस किए अपने फ्लोटिंग-रेट लोन को फिक्स्ड-रेट में बदल सकती है?" }
          },
          onScreenIntent: "Opening dilemma question on corporate liability transformation",
          sourceFactIds: ["F01"],
          newTerms: ["interest rate swap"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor highlights the multi-trillion dollar scope of interest rate swaps",
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
          onScreenIntent: "The mentor defines the bilateral IRS agreement and notional principal",
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
          onScreenIntent: "The mentor outlines Chapter 7 Part 1 masterclass objectives",
          sourceFactIds: ["F03", "F05", "F06"],
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
      title: "Plain Vanilla Swaps: Fixed vs. Floating Cash Flow Mechanics",
      purpose: "Define Plain Vanilla IRS counterparties, notional principal, and bilateral cash flow netting",
      takeaways: [
        "Fixed Rate Payer pays fixed coupon and receives floating benchmark rate",
        "Principal amount is purely notional and never exchanged at inception or maturity",
        "Only the net interest difference transfers on settlement dates: L * (R_floating - R_fixed) * tau"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-fixed-payer",
          heading: "Fixed Rate Payer",
          tone: "positive",
          points: [
            "Agrees to pay predetermined fixed swap rate R_K on all payment dates",
            "Receives floating benchmark rate (e.g. SOFR) from counterparty",
            "Transforms floating debt into synthetic fixed liability",
            "Profits when floating interest rates rise above fixed rate R_K"
          ]
        },
        right: {
          id: "cmp-floating-payer",
          heading: "Floating Rate Payer",
          tone: "neutral",
          points: [
            "Agrees to pay floating benchmark rate reset at start of period",
            "Receives predetermined fixed swap rate R_K from counterparty",
            "Transforms fixed debt into synthetic floating liability",
            "Profits when market interest rates fall below fixed rate R_K"
          ]
        },
        verdict: {
          id: "vrd-netting",
          text: "Principal is purely notional; only the net interest spread is transferred on reset dates."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce Plain Vanilla swap structure and counterparties",
          sourceFactIds: ["F01"],
          newTerms: ["plain vanilla swap", "fixed rate payer", "floating rate payer"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Emphasize notional principal concept: zero initial principal outlay",
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
          onScreenIntent: "Explain bilateral cash flow netting formula: L * (R_floating - R_fixed) * tau",
          sourceFactIds: ["F02"],
          newTerms: ["cash flow netting"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Causal Chain (b07, b08, b09)
    {
      id: "s02",
      index: 2,
      title: "Financial Intermediation: How Swap Dealers Warehouse Risk",
      purpose: "Examine why corporations use financial intermediaries and how swap dealers warehouse risk",
      takeaways: [
        "End-user corporations almost never trade swaps directly due to search and credit frictions",
        "Swap dealers warehouse interest rate risk onto their own trading books",
        "By matching offsetting swaps with two clients, dealers neutralize market risk and earn bid-ask spreads"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        title: "Swap Dealer Risk Intermediation Mechanics",
        links: [
          {
            id: "sd1",
            role: "condition",
            text: "Company A seeks fixed rate protection while Company B seeks floating rate debt"
          },
          {
            id: "sd2",
            role: "action",
            text: "Search frictions prevent direct trading; Swap Dealer steps in between counterparties"
          },
          {
            id: "sd3",
            role: "mechanism",
            text: "Dealer enters bilateral swap with Company A (receives fixed, pays floating)"
          },
          {
            id: "sd4",
            role: "result",
            text: "Dealer enters offsetting swap with Company B (pays fixed, receives floating)"
          },
          {
            id: "sd5",
            role: "consequence",
            text: "Net market risk drops to zero; dealer captures clean 3-6 bps bid-ask spread"
          }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Explain why corporations rely on intermediaries rather than direct trades",
          sourceFactIds: ["F01"],
          newTerms: ["search frictions"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Describe swap dealers warehousing risk on trading desks",
          sourceFactIds: ["F01"],
          newTerms: ["swap dealer", "warehousing risk"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Trace offsetting swap execution and bid-ask spread capture",
          sourceFactIds: ["F01"],
          newTerms: ["bid-ask spread"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Table Compare (b10, b11, b12)
    {
      id: "s03",
      index: 3,
      title: "The Comparative Advantage Argument: The Quality Spread Differential",
      purpose: "Analyze credit spread asymmetry and calculate the 70 bps Quality Spread Differential (QSD)",
      takeaways: [
        "Comparative advantage arises from credit rating spread asymmetries across fixed and floating markets",
        "Fixed market credit spread (120 bps) exceeds floating market spread (50 bps)",
        "The difference is the Quality Spread Differential (QSD = 70 bps), representing total economic surplus"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        title: "The Quality Spread Differential (QSD) Matrix",
        columns: ["Borrower", "Fixed Borrowing Rate", "Floating Borrowing Rate", "Market Comparative Advantage"],
        rows: [
          {
            id: "row-aaa",
            cells: ["Company A (AAA)", "4.00% fixed", "SOFR + 0.10% floating", "Fixed market (+120 bps spread advantage)"]
          },
          {
            id: "row-bbb",
            cells: ["Company B (BBB)", "5.20% fixed", "SOFR + 0.60% floating", "Floating market (lower spread penalty)"]
          },
          {
            id: "row-spread",
            cells: ["Credit Spread", "1.20% (120 bps)", "0.50% (50 bps)", "QSD = 120 bps - 50 bps = 70 bps Surplus"]
          }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Introduce the classical Comparative Advantage argument",
          sourceFactIds: ["F03"],
          newTerms: ["comparative advantage", "quality spread differential"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Present AAA vs BBB borrowing rate schedules",
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
          onScreenIntent: "Calculate QSD = 120 bps - 50 bps = 70 bps economic surplus",
          sourceFactIds: ["F03"],
          newTerms: ["economic surplus"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Technical Panel (b13, b14, b15)
    {
      id: "s04",
      index: 4,
      title: "Numerical Walkthrough: Hull's Classic AAA vs. BBB Swap Structuring",
      purpose: "Trace step-by-step how the 70 bps surplus is shared among AAA firm, BBB firm, and swap dealer",
      takeaways: [
        "Company A issues fixed bonds at 4.00% and swaps to synthetic floating at SOFR - 0.10% (saves 20 bps)",
        "Company B borrows floating at SOFR + 0.60% and swaps to synthetic fixed at 4.90% (saves 30 bps)",
        "Swap dealer captures an intermediation spread of 20 bps, perfectly exhausting the 70 bps surplus"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Hull's Classic 70 bps Swap Structuring",
        subtitle: "Bespoke Surplus Distribution Across Parties",
        sections: [
          {
            id: "struct-aaa",
            title: "Company A (AAA) Leg: 20 bps Saving",
            content: "Issues fixed at 4.00%. Receives 3.95% fixed from dealer and pays SOFR. Net cost: SOFR + 0.05% (saves 20 bps vs direct SOFR + 0.25%)."
          },
          {
            id: "struct-bbb",
            title: "Company B (BBB) Leg: 30 bps Saving",
            content: "Borrows floating at SOFR + 0.60%. Pays 4.30% fixed to dealer and receives SOFR. Net cost: 4.90% fixed (saves 30 bps vs direct 5.20%)."
          },
          {
            id: "struct-dealer",
            title: "Swap Dealer Spread: 20 bps Margin",
            content: "Receives 4.30% fixed from BBB and pays 4.10% fixed to AAA. Captures clean 20 bps riskless intermediation margin."
          }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Introduce Hull's step-by-step structuring of the 70 bps surplus",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Detail Company A structuring and 20 bps saving",
          sourceFactIds: ["F03"],
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
          onScreenIntent: "Detail Company B structuring (30 bps saving) and dealer spread (20 bps)",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Split Comparison (b16, b17, b18)
    {
      id: "s05",
      index: 5,
      title: "Hull's Cautionary Analysis: Why Comparative Advantage is an Illusion",
      purpose: "Examine John Hull's critique: why comparative advantage is driven by hidden rollover refinancing risk",
      takeaways: [
        "Comparative advantage is not a free lunch; it reflects different contractual credit commitments",
        "Fixed bond investors lock credit risk for 5 years; floating bank lenders review credit every 6 months",
        "If Company B's credit deteriorates, floating rollover spreads widen or loans are called"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-fixed-market",
          heading: "5-Year Fixed Market",
          tone: "positive",
          points: [
            "Bond investors commit capital and lock credit spread for full 5-year duration",
            "Borrower cannot have loan recalled if credit rating declines mid-tenor",
            "Investor demands substantial 120 bps spread upfront to compensate for default risk",
            "True fixed financing with zero mid-stream refinancing uncertainty"
          ]
        },
        right: {
          id: "cmp-floating-market",
          heading: "6-Month Floating Loan",
          tone: "trap",
          points: [
            "Commercial bank reviews borrower creditworthiness every 6-month rollover",
            "If credit deteriorates, bank widens floating spread or refuses loan renewal",
            "Lower 50 bps initial spread reflects short 6-month exposure, not genuine savings",
            "Synthetic fixed rate collapses if borrower cannot roll over short-term bank debt"
          ]
        },
        verdict: {
          id: "vrd-illusion",
          text: "Comparative advantage reflects rollover refinancing risk, not a free lunch."
        }
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Present Hull's critique: comparative advantage is an illusion",
          sourceFactIds: ["F04"],
          newTerms: ["comparative advantage critique"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Contrast 5-year fixed commitment against 6-month floating reviews",
          sourceFactIds: ["F04"],
          newTerms: ["rollover refinancing risk"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Explain why synthetic fixed rate collapses under credit deterioration",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Technical Panel (b19, b20, b21)
    {
      id: "s06",
      index: 6,
      title: "Institutional Plumbing: The ISDA Master Agreement & Confirmations",
      purpose: "Examine ISDA Master Agreements, bilateral netting, and trade Confirmations",
      takeaways: [
        "Over-the-counter swaps are legally anchored by the standardized ISDA Master Agreement",
        "The Master Agreement defines default, termination events, cross-defaults, and bilateral netting",
        "Individual swap transactions are documented via a trade Confirmation specifying commercial terms"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "The ISDA Institutional Infrastructure",
        subtitle: "Master Agreements, Confirmations & Bilateral Netting",
        sections: [
          {
            id: "isda-master",
            title: "ISDA Master Agreement",
            content: "Standardized contract published by International Swaps and Derivatives Association governing all OTC trades between two counterparties."
          },
          {
            id: "isda-netting",
            title: "Close-Out Bilateral Netting",
            content: "In counterparty insolvency, all active swap transactions are immediately terminated and netted into a single net cash sum."
          },
          {
            id: "isda-confirm",
            title: "Trade Confirmation",
            content: "A short legal document specifying exact commercial terms: notional principal, trade date, fixed rate, floating benchmark, and reset calendar."
          }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Introduce ISDA institutional documentation standards",
          sourceFactIds: ["F01"],
          newTerms: ["ISDA Master Agreement"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Detail Master Agreement clauses: default events, cross-defaults, and netting",
          sourceFactIds: ["F01"],
          newTerms: ["bilateral netting"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Explain Business Snapshot 7.1 and trade Confirmations",
          sourceFactIds: ["F01"],
          newTerms: ["trade confirmation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Formula Breakdown (b22, b23, b24)
    {
      id: "s07",
      index: 7,
      title: "Swap Valuation Method 1: The Bond Portfolio Formulation",
      purpose: "Formulate swap valuation as the difference between floating and fixed bonds: V_swap = B_floating - B_fixed",
      takeaways: [
        "Method 1 models the swap as a portfolio of a floating bond and a fixed bond",
        "To fixed payer: V_swap = B_floating - B_fixed",
        "Immediately following any reset date, B_floating equals exactly par notional L"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Swap Valuation: The Bond Portfolio Formulation",
        formula: {
          latex: "V_{\\text{swap}} = B_{\\text{floating}} - B_{\\text{fixed}}",
          expression: "Swap Value = Floating Bond Value - Fixed Bond Value",
          solvesFor: "Mark-to-Market Swap Value to Fixed Payer (V_swap)",
          variables: [
            { symbol: "V_swap", latex: "V_{\\text{swap}}", meaning: "Mark-to-market value of swap to fixed-rate payer", unit: "currency" },
            { symbol: "B_floating", latex: "B_{\\text{floating}}", meaning: "Value of floating-rate bond leg receiving SOFR", unit: "currency" },
            { symbol: "B_fixed", latex: "B_{\\text{fixed}}", meaning: "Value of fixed-rate bond leg paying fixed coupon R_K", unit: "currency" },
            { symbol: "L", latex: "L", meaning: "Notional principal amount", unit: "currency" }
          ]
        },
        parts: [
          { id: "bp1", symbolLatex: "B_{\\text{floating}} = (L + k^*) e^{-r_1 t_1}", meaning: "Floating leg equals par L plus next coupon discounted from next payment date", unit: "currency" },
          { id: "bp2", symbolLatex: "B_{\\text{floating}} = L", meaning: "Immediately after a coupon reset date, floating bond trades exactly at par", unit: "par condition" },
          { id: "bp3", symbolLatex: "B_{\\text{fixed}} = \\sum c_i e^{-r_i t_i} + L e^{-r_n t_n}", meaning: "Fixed bond discounted at risk-free zero rates", unit: "currency" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Introduce swap valuation and the Bond Portfolio Formulation",
          sourceFactIds: ["F05"],
          newTerms: ["bond portfolio valuation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Formulate V_swap = B_floating - B_fixed for fixed payer",
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
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Explain floating par property: B_floating = L immediately after reset",
          sourceFactIds: ["F05"],
          newTerms: ["par property"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Formula Breakdown (b25, b26, b27)
    {
      id: "s08",
      index: 8,
      title: "Swap Valuation Method 2: The FRA Forward Rate Discounting Model",
      purpose: "Formulate swap valuation as a portfolio of discounted Forward Rate Agreements",
      takeaways: [
        "Method 2 decomposes the swap into an explicit strip of Forward Rate Agreements (FRAs)",
        "Forward rates F_i are extracted from the zero curve and treated as realized floating rates",
        "V_swap = sum of L * (F_i - R_K) * tau * e^(-r_i * t_i); initial swap rate sets V_swap = 0"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Swap Valuation: The Discounted FRA Strip Model",
        formula: {
          latex: "V_{\\text{swap}} = \\sum_{i=1}^{n} L (F_i - R_K) \\tau e^{-r_i t_i}",
          expression: "Swap Value = Sum of Discounted FRA Cash Flows",
          solvesFor: "Present Value of All Future Swap Net Exchanges (V_swap)",
          variables: [
            { symbol: "V_swap", latex: "V_{\\text{swap}}", meaning: "Mark-to-market value of swap to fixed-rate payer", unit: "currency" },
            { symbol: "L", latex: "L", meaning: "Notional principal amount", unit: "currency" },
            { symbol: "F_i", latex: "F_i", meaning: "Forward benchmark interest rate for period i", unit: "decimal/year" },
            { symbol: "R_K", latex: "R_K", meaning: "Predetermined fixed swap coupon rate", unit: "decimal/year" },
            { symbol: "tau", latex: "\\tau", meaning: "Day count accrual fraction for period i", unit: "years" },
            { symbol: "r_i", latex: "r_i", meaning: "Continuous zero rate for discounting payment at t_i", unit: "decimal/year" }
          ]
        },
        parts: [
          { id: "fra1", symbolLatex: "L (F_i - R_K) \\tau", meaning: "Expected net cash flow for payment period i", unit: "currency" },
          { id: "fra2", symbolLatex: "e^{-r_i t_i}", meaning: "Zero-coupon discount factor back to valuation date", unit: "dimensionless" },
          { id: "fra3", symbolLatex: "V_{\\text{swap}} = 0 \\text{ at } t=0", meaning: "Par swap rate R_K equates total present value to exactly zero at inception", unit: "equilibrium" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce the FRA Strip Model decomposing swaps into forward agreements",
          sourceFactIds: ["F06"],
          newTerms: ["FRA strip model"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Explain steps: extract forward rates F_i and compute expected net cash flows",
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
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Formulate present value sum and zero inception value condition",
          sourceFactIds: ["F06"],
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
      title: "Active Recall Scenario: Calculating Swap Net Cash Flows",
      purpose: "Test student ability to compute the exact net cash exchange on a $100M swap reset",
      takeaways: [
        "Notional L = $100M, Fixed rate = 4.50%, Floating rate = 5.20%, tau = 0.50 yrs",
        "Rate spread = 5.20% - 4.50% = 0.70% (70 bps)",
        "Net payment = $100,000,000 * 0.0070 * 0.50 = $350,000 paid by floating payer"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        title: "Active Recall: Swap Cash Flow Netting Calculation",
        question: "A semi-annual swap has Notional L = $100M. Fixed rate is 4.50% and 6-month floating benchmark resets at 5.20% (tau = 0.50). What is the net payment exchanged?",
        options: [
          "$700,000 paid by the fixed rate payer to the floating rate payer.",
          "$350,000 paid by the floating rate payer to the fixed rate payer.",
          "$350,000 paid by the fixed rate payer to the floating rate payer.",
          "$5,200,000 gross transfer from floating payer, $4,500,000 gross transfer from fixed payer."
        ],
        correctIndex: 1,
        explanation: "Net Payment = L * (Floating Rate - Fixed Rate) * tau = $100,000,000 * (0.0520 - 0.0450) * 0.50 = $100,000,000 * 0.0070 * 0.50 = $350,000. Because the floating benchmark (5.20%) exceeds the fixed rate (4.50%), the floating rate payer pays the net difference of $350,000 to the fixed rate payer."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Present the swap cash flow netting challenge",
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
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Prompt calculation of 70 bps spread on $100M over 0.50 years",
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
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Reveal Option B: $350,000 paid by floating rate payer",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Formula Breakdown (b31, b32, b33)
    {
      id: "s10",
      index: 10,
      title: "The Term Structure of Swap Rates & Zero-Curve Bootstrapping",
      purpose: "Define Par Swap Rates and formulate zero curve bootstrapping from the swap curve",
      takeaways: [
        "Major financial institutions use the Par Swap Curve as the primary pricing benchmark",
        "The Par Swap Rate is the fixed coupon equating swap value to zero (fixed bond to par 100)",
        "Quantitative desks bootstrap continuous risk-free zero curves directly from quoted par swap rates"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Par Swap Rate & Zero-Curve Bootstrapping",
        formula: {
          latex: "R_{\\text{swap}} = \\frac{1 - e^{-r_n t_n}}{\\sum_{i=1}^{n} \\tau e^{-r_i t_i}}",
          expression: "Par Swap Rate = (1 - Discount Factor to Maturity) / Sum of Discount Factors",
          solvesFor: "Par Swap Benchmark Fixed Coupon Rate (R_swap)",
          variables: [
            { symbol: "R_swap", latex: "R_{\\text{swap}}", meaning: "Quoted par swap fixed coupon rate setting initial swap value to zero", unit: "decimal/year" },
            { symbol: "e^{-r_n t_n}", latex: "d_n", meaning: "Risk-free discount factor to the final swap maturity date", unit: "dimensionless" },
            { symbol: "tau", latex: "\\tau", meaning: "Day count accrual fraction for each payment period", unit: "years" },
            { symbol: "e^{-r_i t_i}", latex: "d_i", meaning: "Discount factor corresponding to each intermediate payment date", unit: "dimensionless" }
          ]
        },
        parts: [
          { id: "psr1", symbolLatex: "B_{\\text{fixed}} = 100", meaning: "Par swap rate sets fixed bond value exactly equal to face par", unit: "par condition" },
          { id: "psr2", symbolLatex: "1 - d_n", meaning: "Present value of principal repayment obligation at maturity", unit: "dimensionless" },
          { id: "psr3", symbolLatex: "\\sum \\tau d_i", meaning: "Annuity factor summing all discount factors across the swap lifespan", unit: "years" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Introduce the Par Swap Curve as the definitive interbank benchmark",
          sourceFactIds: ["F07"],
          newTerms: ["par swap curve"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Define Par Swap Rate equating initial swap value to zero",
          sourceFactIds: ["F07"],
          newTerms: ["par swap rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Explain bootstrapping continuous zero curves directly from swap rates",
          sourceFactIds: ["F07"],
          newTerms: ["swap zero bootstrapping"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b34, b35, b36, b37, b38, b39)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Interest Rate Swaps",
      purpose: "Consolidate Chapter 7 Part 1 foundational pillars before advancing to Currency Swaps in Part 2",
      takeaways: [
        "Principal is purely notional and never exchanged; only net interest transfers",
        "Swap dealers warehouse risk to earn dependable bid-ask spreads",
        "Swaps are valued identically via the bond portfolio model or discounted FRA strip"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The Four Pillars of Plain Vanilla Swaps",
        rules: [
          {
            id: "rul-1",
            title: "Notional Principal Netting",
            text: "Principal is purely reference notional; only the net interest spread transfers on reset dates."
          },
          {
            id: "rul-2",
            title: "Swap Dealer Intermediation",
            text: "Dealers match offsetting bilateral swaps, neutralizing market risk to capture bid-ask spreads."
          },
          {
            id: "rul-3",
            title: "Quality Spread Differential",
            text: "QSD equals the credit spread gap between fixed and floating markets, defining total economic surplus."
          },
          {
            id: "rul-4",
            title: "Rollover Refinancing Risk",
            text: "Comparative advantage is an illusion; floating bank reviews expose borrowers to rollover default."
          },
          {
            id: "rul-5",
            title: "ISDA Legal Infrastructure",
            text: "Standardized Master Agreements govern default and close-out netting; Confirmations specify trade terms."
          },
          {
            id: "rul-6",
            title: "Bond Portfolio Valuation",
            text: "V_swap = B_floating - B_fixed; floating bond trades at par L immediately following resets."
          },
          {
            id: "rul-7",
            title: "FRA Strip Model",
            text: "V_swap = sum of discounted expected forward cash flows; par swap rate sets inception value to zero."
          },
          {
            id: "rul-8",
            title: "Swap Zero Bootstrapping",
            text: "Quoted par swap rates provide the market benchmark to bootstrap continuous institutional zero curves."
          }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Introduce consolidation of the four structural pillars",
          sourceFactIds: ["F01", "F03", "F05", "F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Review Pillar One: Notional Principal Netting",
          sourceFactIds: ["F01", "F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Review Pillar Two: Dealer Intermediation",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Review Pillar Three: Refinancing Risk Reality",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Review Pillar Four: Dual Valuation Equivalence",
          sourceFactIds: ["F05", "F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b6",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Preview Chapter 7 Part 2: Currency swaps and credit risk",
          sourceFactIds: ["F01"],
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
if (!courseMap.chapters.some(c => c.chapterId === 'ch07' && c.partId === 'p1')) {
  courseMap.chapters.push({
    chapterId: "ch07",
    partId: "p1",
    title: "Swaps - Part 1",
    status: "in_progress"
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

const bookConfigPath = 'c:/code/openlectern/workspace/books/hull/book.config.json';
const bookConfig = JSON.parse(fs.readFileSync(bookConfigPath, 'utf8'));
let ch07 = bookConfig.chapters.find(c => c.id === 'ch07');
if (!ch07) {
  ch07 = {
    id: "ch07",
    number: 7,
    title: "Swaps"
  };
  bookConfig.chapters.push(ch07);
  fs.writeFileSync(bookConfigPath, JSON.stringify(bookConfig, null, 2));
}

console.log('Chapter 7 Part 1 successfully built and registered in course_map and book.config!');
