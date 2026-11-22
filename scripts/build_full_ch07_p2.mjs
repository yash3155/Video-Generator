import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch07/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_07/Part_02/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_07/Part_02/script_hi.md', 'utf8');

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

// 1. Facts with full numerical grounding from Chapter 7 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch07",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "A Currency Swap involves exchanging principal and periodic interest payments in two different currencies, with real physical principal exchange at inception and re-exchange at maturity at the original exchange rate S_0.",
      citation: { chapter: "7", section: "7.7", page: "168" }
    },
    {
      id: "F02",
      category: "rule",
      statement: "Because currency swap payments are denominated in two different sovereign currencies, periodic cash flows cannot be netted and must be paid in full gross amounts.",
      citation: { chapter: "7", section: "7.7", page: "169" }
    },
    {
      id: "F03",
      category: "case_study",
      statement: "In Hull's GE vs. Qantas model with spot rate 0.75 USD/AUD: GE exchanges 15M USD for 20M AUD at inception, pays AUD coupons and receives USD coupons, and re-exchanges 20M AUD for 15M USD at maturity.",
      citation: { chapter: "7", section: "7.7", page: "170" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Currency Swap Valuation (Dual Bond): V_swap = B_D - S_0 * B_F, where B_D is present value of domestic bond leg, B_F is foreign bond leg, and S_0 is current spot FX rate.",
      citation: { chapter: "7", section: "7.8", page: "172" }
    },
    {
      id: "F05",
      category: "definition",
      statement: "Currency swaps carry up to 10x greater credit default risk than interest rate swaps because of terminal physical principal re-exchange.",
      citation: { chapter: "7", section: "7.9", page: "174" }
    },
    {
      id: "F06",
      category: "definition",
      statement: "Credit Support Annexes (CSAs) mitigate swap credit risk through daily bilateral marking-to-market and collateral posting (cash/Treasuries), resetting uncollateralized risk to zero every 24 hours.",
      citation: { chapter: "7", section: "7.9", page: "175" }
    },
    {
      id: "F07",
      category: "case_study",
      statement: "In the 1980s Hammersmith and Fulham municipal swap disaster, UK courts ruled municipal swaps ultra vires (beyond statutory power) and legally void, causing bank losses exceeding £600 million.",
      citation: { chapter: "7", section: "Snapshot 7.2", page: "176" }
    },
    {
      id: "F08",
      category: "numerical_example",
      statement: "Active recall scenario: Bank receives USD bond B_D = $105M, pays GBP bond B_F = £70M, spot S_0 = 1.45 USD/GBP. V_swap = $105M - (1.45 * £70M) = $105M - $101.5M = +$3.5M.",
      citation: { chapter: "7", section: "7.8", page: "173" }
    }
  ],
  realWorldProblem: {
    actors: "Multinational corporate treasurers, cross-currency swap desks, and sovereign debt managers",
    situation: "Transforming foreign currency debt obligations and hedging multi-currency capital expenditures",
    failure: "Neglecting terminal principal default risk or failing to verify counterparty legal capacity leads to multi-hundred-million-dollar write-downs",
    invention: "Fixed-for-Fixed Currency Swap, Dual Bond Portfolio Valuation model, and Credit Support Annex (CSA) daily collateralization",
    factIds: ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch07",
  partId: "p2",
  title: "Swaps - Part 2",
  subtitle: "Cross-Currency Swaps, Dual Bond Valuation, Credit Risk & CSAs",
  targetAudience: "Multinational corporate treasurers, FX derivative traders, and risk officers",
  prerequisites: ["Part 1 Interest Rate Swaps", "Covered interest parity", "Bond portfolio valuation"],
  scenes: [
    { sceneId: "s00", title: "Cross-Border Cash Flow Transformation: The Currency Swap", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Fixed-for-Fixed Currency Swaps: Dual Principal Exchanges & Gross Payments", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Comparative Advantage in Global Capital Markets: Hull's GE vs. Qantas Model", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "Numerical Structuring: Step-by-Step USD/AUD Currency Swap", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "Currency Swap Valuation: The Dual Bond Portfolio Model", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "Credit Risk Asymmetry: Why Currency Swaps Carry 10x Greater Default Risk", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Credit Mitigation: Daily Collateralization Under Credit Support Annexes (CSAs)", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Other Swap Structures: Total Return Swaps & Equity Swaps", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Case Study: The Hammersmith & Fulham Municipal Swap Crisis", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Valuing an Existing USD/GBP Currency Swap", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Structural Risk Management Rules for Corporate Swap Users", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Currency Swaps & Credit Risk", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch07",
  partId: "p2",
  formulas: [
    {
      id: "M01",
      name: "Currency Swap Valuation (Dual Bond Model)",
      latex: "V_{\\text{swap}} = B_D - S_0 B_F",
      variables: [
        { symbol: "V_swap", description: "Market value of currency swap in domestic currency", unit: "domestic currency" },
        { symbol: "B_D", description: "Present value of domestic bond cash flows", unit: "domestic currency" },
        { symbol: "B_F", description: "Present value of foreign bond cash flows", unit: "foreign currency" },
        { symbol: "S_0", description: "Current spot exchange rate (domestic per foreign)", unit: "domestic/foreign" }
      ]
    },
    {
      id: "M02",
      name: "Total Return Swap Cash Flow",
      latex: "\\text{Payment} = L \\times [(\\text{Asset Return}) - (\\text{Benchmark Rate} + \\text{Spread})]",
      variables: [
        { symbol: "L", description: "Notional reference asset value", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch07",
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
  chapterId: "ch07",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 7",
  partLabel: "Part 2",
  title: "Swaps - Part 2",
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
      title: "Cross-Border Cash Flow Transformation: The Currency Swap",
      purpose: "Extend swaps from single-currency to cross-border multi-currency asset-liability management",
      takeaways: [
        "Multinationals earn revenues in one currency and finance capital expenditures in another",
        "A Currency Swap exchanges principal and interest across two completely different currencies",
        "Part 2 masters dual principal exchanges, GE vs. Qantas model, dual bond valuation, and CSAs"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "How can a US company finance a factory in Australia without bearing exchange rate volatility on foreign loans?" },
          { id: "m2", speaker: "mentor", text: "While plain vanilla swaps solve single-currency mismatches, modern multinationals operate across borders, earning revenue in one currency and financing in another." },
          { id: "m3", speaker: "mentor", text: "A Currency Swap is an OTC contract where counterparties exchange principal and periodic interest in two different currencies, transforming foreign debt synthetically." },
          { id: "m4", speaker: "mentor", text: "In Part Two, we master dual principal exchanges, Hull's GE vs. Qantas model, dual bond valuation, credit risk, and the Hammersmith & Fulham disaster." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Cross-Border Intro", "Dual Principal Rules", "GE vs Qantas Model", "Cash Flow Lifecycle", "Dual Bond Valuation", "Credit Risk & CSAs"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "How can a US company finance a factory in Australia without bearing exchange rate volatility on foreign loans?" },
            hi: { display: "क्या कोई अमेरिकी कंपनी बिना करेंसी रिस्क लिए ऑस्ट्रेलिया में फैक्ट्री के लिए लोन को हेज कर सकती है?" }
          },
          onScreenIntent: "Opening dilemma question on cross-border corporate borrowing",
          sourceFactIds: ["F01"],
          newTerms: ["currency swap"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor introduces cross-currency cash flow transformation",
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
          onScreenIntent: "The mentor defines the Currency Swap contract and dual currency flows",
          sourceFactIds: ["F01"],
          newTerms: ["cross-currency swap"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "The mentor outlines Part 2 roadmap and learning topics",
          sourceFactIds: ["F03", "F04", "F05", "F07"],
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
      title: "Fixed-for-Fixed Currency Swaps: Dual Principal Exchanges & Gross Payments",
      purpose: "Establish the two fundamental distinctions between currency swaps and interest rate swaps",
      takeaways: [
        "In currency swaps, principal is real: exchanged at inception and re-exchanged at maturity at S_0",
        "Because payments are in different sovereign currencies, periodic cash flows cannot be netted",
        "Counterparties must make full gross payments on every settlement date"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-irs-rules",
          heading: "Interest Rate Swap (IRS)",
          tone: "neutral",
          points: [
            "Principal is purely reference notional and is never exchanged",
            "Single sovereign currency denomination on both fixed and floating legs",
            "Cash flows are netted bilaterally: only the net interest spread transfers",
            "Zero initial capital outlay and low default replacement exposure"
          ]
        },
        right: {
          id: "cmp-currency-rules",
          heading: "Currency Swap",
          tone: "positive",
          points: [
            "Principal is real: full physical exchange at inception and re-exchange at maturity",
            "Two distinct sovereign currencies: e.g. USD leg vs. AUD leg",
            "Cash flow netting is impossible: counterparties transfer full gross payments",
            "Re-exchange of terminal principal creates up to 10x greater credit risk"
          ]
        },
        verdict: {
          id: "vrd-principal-rule",
          text: "Currency swaps feature real dual principal exchanges and gross non-netted periodic flows."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce the two core distinctions between currency and interest rate swaps",
          sourceFactIds: ["F01", "F02"],
          newTerms: ["principal exchange rules"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Explain physical principal exchange at inception and re-exchange at maturity at S_0",
          sourceFactIds: ["F01"],
          newTerms: ["terminal re-exchange"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Explain why different currencies make netting impossible, requiring gross payments",
          sourceFactIds: ["F02"],
          newTerms: ["gross payments"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Table Compare (b07, b08, b09)
    {
      id: "s02",
      index: 2,
      title: "Comparative Advantage in Global Capital Markets: Hull's GE vs. Qantas Model",
      purpose: "Examine global comparative advantage where GE and Qantas exploit domestic borrowing power",
      takeaways: [
        "Multinationals borrow cheaply in their domestic markets due to local brand recognition",
        "GE needs AUD for Sydney expansion; Qantas needs USD for Boeing aircraft",
        "Cross-currency swaps allow both firms to access cheaper foreign funding than direct foreign debt"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        title: "Global Comparative Advantage: GE vs. Qantas",
        columns: ["Corporation", "Domestic Market Advantage", "Foreign Currency Need", "Swap Economic Role"],
        rows: [
          {
            id: "row-ge",
            cells: ["General Electric (US)", "Issues cheap USD debt in US capital markets", "Needs Australian Dollars (AUD) for Sydney facility", "Borrows USD, swaps to synthetic AUD funding"]
          },
          {
            id: "row-qantas",
            cells: ["Qantas Airways (Australia)", "Issues cheap AUD debt in domestic Australian market", "Needs US Dollars (USD) for commercial Boeing aircraft", "Borrows AUD, swaps to synthetic USD funding"]
          },
          {
            id: "row-arbitrage",
            cells: ["Market Synergy", "Domestic borrowing power saves 40-60 bps", "Both obtain required foreign currency", "Swap locks exchange rates, eliminating FX risk"]
          }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Introduce John Hull's classic GE vs. Qantas corporate case study",
          sourceFactIds: ["F03"],
          newTerms: ["global comparative advantage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Specify corporate financing needs: GE in Sydney, Qantas for Boeing planes",
          sourceFactIds: ["F03"],
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
          onScreenIntent: "Detail how domestic borrowing combined with swaps yields cheaper funding",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Technical Panel (b10, b11, b12)
    {
      id: "s03",
      index: 3,
      title: "Numerical Structuring: Step-by-Step USD/AUD Currency Swap",
      purpose: "Trace the 3-phase lifecycle: inception principal swap, annual gross coupons, and terminal re-exchange",
      takeaways: [
        "Inception: GE transfers 15M USD, Qantas transfers 20M AUD at S_0 = 0.75 USD/AUD",
        "Interim: GE remits AUD coupons; Qantas remits USD coupons annually for 5 years",
        "Maturity: GE returns 20M AUD and receives back 15M USD, eliminating terminal FX risk"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Cash Flow Lifecycle: 5-Year USD/AUD Currency Swap",
        subtitle: "Spot Parity S_0 = 0.75 USD per 1 AUD ($15M USD = 20M AUD)",
        sections: [
          {
            id: "phase-inception",
            title: "Phase 1: Inception Principal Exchange (t = 0)",
            content: "GE transfers $15,000,000 USD to Qantas. Simultaneously, Qantas transfers 20,000,000 AUD to GE."
          },
          {
            id: "phase-annual",
            title: "Phase 2: Annual Gross Interest Payments (t = 1 to 5)",
            content: "GE pays agreed AUD fixed coupon to Qantas. Qantas pays agreed USD fixed coupon to GE. Payments are made in gross non-netted transfers."
          },
          {
            id: "phase-maturity",
            title: "Phase 3: Maturity Principal Re-Exchange (t = 5)",
            content: "GE returns 20,000,000 AUD to Qantas. Qantas returns 15,000,000 USD to GE at the exact original 0.75 parity."
          }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Specify spot exchange rate: S_0 = 0.75 USD per AUD",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Trace Phase 1 inception exchange: $15M USD for 20M AUD",
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
          onScreenIntent: "Trace Phase 2 annual gross coupons and Phase 3 terminal principal re-exchange",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Formula Breakdown (b13, b14, b15)
    {
      id: "s04",
      index: 4,
      title: "Currency Swap Valuation: The Dual Bond Portfolio Model",
      purpose: "Formulate currency swap valuation as domestic bond minus spot-converted foreign bond: V_swap = B_D - S_0 * B_F",
      takeaways: [
        "A currency swap is valued by decomposing into two separate sovereign currency bonds",
        "To the party receiving domestic and paying foreign: V_swap = B_D - S_0 * B_F",
        "B_D is discounted along domestic zero curve; B_F is discounted along foreign zero curve"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Currency Swap Valuation: The Dual Bond Model",
        formula: {
          latex: "V_{\\text{swap}} = B_D - S_0 B_F",
          expression: "Swap Value = Domestic Bond PV - (Spot Exchange Rate * Foreign Bond PV)",
          solvesFor: "Mark-to-Market Currency Swap Value in Domestic Currency (V_swap)",
          variables: [
            { symbol: "V_swap", latex: "V_{\\text{swap}}", meaning: "Mark-to-market value of swap in domestic currency", unit: "domestic currency" },
            { symbol: "B_D", latex: "B_D", meaning: "Present value of future domestic cash flows discounted along domestic zero curve", unit: "domestic currency" },
            { symbol: "B_F", latex: "B_F", meaning: "Present value of future foreign cash flows discounted along foreign zero curve", unit: "foreign currency" },
            { symbol: "S_0", latex: "S_0", meaning: "Current spot exchange rate: domestic currency per 1 unit foreign currency", unit: "domestic/foreign" }
          ]
        },
        parts: [
          { id: "cv1", symbolLatex: "B_D", meaning: "Present value of all received domestic coupons plus principal repayment", unit: "domestic currency" },
          { id: "cv2", symbolLatex: "S_0 B_F", meaning: "Foreign bond present value converted into domestic currency at prevailing spot FX", unit: "domestic currency" },
          { id: "cv3", symbolLatex: "V_{\\text{swap}} = 0 \\text{ at } t=0", meaning: "At inception, terms are chosen such that B_D = S_0 * B_F, making initial value zero", unit: "equilibrium" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Introduce currency swap valuation via two separate sovereign bonds",
          sourceFactIds: ["F04"],
          newTerms: ["dual bond model"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Model position as long domestic bond and short foreign bond",
          sourceFactIds: ["F04"],
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
          onScreenIntent: "Formulate master equation V_swap = B_D - S_0 * B_F",
          sourceFactIds: ["F04"],
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
      title: "Credit Risk Asymmetry: Why Currency Swaps Carry 10x Greater Default Risk",
      purpose: "Contrast credit exposure: interest rate swaps risk net interest vs. currency swaps risking terminal principal",
      takeaways: [
        "Currency swaps carry up to 10 times greater default risk than interest rate swaps",
        "In an IRS, default risks only the net interest spread (rarely exceeding 2-3% of notional)",
        "In a currency swap, terminal principal re-exchange can create replacement costs of 30-50%"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-irs-credit",
          heading: "Interest Rate Swap Credit Risk",
          tone: "positive",
          points: [
            "Principal is never exchanged; counterparties settle only net interest spreads",
            "In counterparty default, exposure is confined to discounted interest differential",
            "Maximum credit loss rarely exceeds 2% to 3% of total contract notional",
            "Low systemic credit risk and straightforward capital allocation"
          ]
        },
        right: {
          id: "cmp-currency-credit",
          heading: "Currency Swap Credit Risk",
          tone: "trap",
          points: [
            "Full physical re-exchange of principal occurs at final contract maturity",
            "Severe currency devaluations cause massive mark-to-market replacement exposure",
            "If counterparty defaults near maturity, replacement loss can reach 30% to 50% of principal",
            "Carries up to 10x greater credit risk, necessitating strict daily collateralization"
          ]
        },
        verdict: {
          id: "vrd-credit-risk",
          text: "Terminal principal re-exchange elevates currency swap default exposure up to 10x."
        }
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "State that currency swap default exposure is up to 10 times larger",
          sourceFactIds: ["F05"],
          newTerms: ["credit risk asymmetry"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Analyze IRS default: confined to 2-3% net interest spread",
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
          onScreenIntent: "Analyze currency swap default: terminal principal loss reaching 30-50%",
          sourceFactIds: ["F05"],
          newTerms: ["terminal principal risk"],
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
      title: "Credit Mitigation: Daily Collateralization Under Credit Support Annexes (CSAs)",
      purpose: "Examine Credit Support Annexes (CSAs), daily variation margin, and uncollateralized risk resetting",
      takeaways: [
        "Bilateral collateralization is legally governed by Credit Support Annexes (CSAs)",
        "Every swap is marked to market daily; the out-of-the-money party posts cash or Treasuries",
        "Daily variation margin resets uncollateralized credit risk back to zero every 24 hours"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Credit Mitigation via Credit Support Annexes (CSAs)",
        subtitle: "Daily Variation Margin & Zero-Risk Resetting",
        sections: [
          {
            id: "csa-framework",
            title: "Credit Support Annex (CSA)",
            content: "Legal document attached to ISDA Master Agreement specifying collateral eligibility, valuation hair cuts, and transfer thresholds."
          },
          {
            id: "csa-margin",
            title: "Daily Variation Margin",
            content: "Positions are marked to market at daily close. If counterparty exposure is positive, opposing party posts cash or sovereign bonds."
          },
          {
            id: "csa-reset",
            title: "24-Hour Credit Reset",
            content: "By transferring collateral every business day, net uncollateralized credit exposure is restored to zero every 24 hours."
          }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Introduce Credit Support Annexes (CSAs) and collateralization",
          sourceFactIds: ["F06"],
          newTerms: ["credit support annex"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Detail daily mark-to-market calculations and eligible collateral",
          sourceFactIds: ["F06"],
          newTerms: ["variation margin"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Explain how daily margin resets credit risk to zero, preventing contagion",
          sourceFactIds: ["F06"],
          newTerms: ["credit reset"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Table Compare (b22, b23, b24)
    {
      id: "s07",
      index: 7,
      title: "Other Swap Structures: Total Return Swaps & Equity Swaps",
      purpose: "Examine Total Return Swaps (TRS) and Equity Swaps transferring asset performance synthetically",
      takeaways: [
        "Total Return Swaps transfer total economic performance (coupons + capital gains) of reference assets",
        "Receiver pays floating interest benchmark plus spread and absorbs any capital depreciation",
        "Hedge funds deploy TRS to achieve high synthetic leverage without purchasing underlying bonds"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        title: "Advanced Synthetic Swap Structures",
        columns: ["Swap Structure", "Total Return Payer Transmits", "Total Return Receiver Transmits", "Primary Economic Application"],
        rows: [
          {
            id: "trs-bond",
            cells: ["Total Return Swap (TRS)", "Coupons, interest & capital appreciation of reference asset", "Floating benchmark rate + credit spread (reimburses losses)", "Synthetic leveraged exposure to illiquid loans or bonds"]
          },
          {
            id: "trs-equity",
            cells: ["Equity Swap", "Total return of stock index (dividends + price change)", "Fixed swap rate or floating SOFR benchmark", "Asset managers rebalancing equity portfolios synthetically"]
          },
          {
            id: "trs-commodity",
            cells: ["Commodity Swap", "Spot commodity price index return over horizon", "Fixed commodity strike price per unit delivered", "Industrial producers locking forward revenues"]
          }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Introduce Total Return Swaps and advanced synthetic structures",
          sourceFactIds: ["F06"],
          newTerms: ["total return swap"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Detail TRS cash flows: coupon payments and capital appreciation",
          sourceFactIds: ["F06"],
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
          onScreenIntent: "Explain hedge fund synthetic leverage applications without physical bond purchases",
          sourceFactIds: ["F06"],
          newTerms: ["synthetic leverage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Technical Panel (b25, b26, b27)
    {
      id: "s08",
      index: 8,
      title: "Case Study: The Hammersmith & Fulham Municipal Swap Crisis",
      purpose: "Examine the £6B Hammersmith & Fulham crisis and the legal risk of ultra vires contracts",
      takeaways: [
        "Hammersmith & Fulham municipal treasurers entered £6B in speculative swaps gambling on falling rates",
        "When rates surged, UK House of Lords ruled councils lacked statutory legal authority to trade swaps",
        "Contracts were declared ultra vires (void), forcing global banks to write off £600M in swap claims"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Case Study: Hammersmith & Fulham Municipal Crisis",
        subtitle: "The £600M Ultra Vires Legal Disaster",
        sections: [
          {
            id: "hf-gamble",
            title: "Speculative Municipal Gambling",
            content: "Local council treasurers entered over £6 billion notional in aggressive interest rate swaps, selling options to capture upfront premium."
          },
          {
            id: "hf-rate-spike",
            title: "Interest Rate Surge & Catastrophe",
            content: "UK interest rates surged sharply, inflicting hundreds of millions in mark-to-market swap losses on the municipal budget."
          },
          {
            id: "hf-ruling",
            title: "House of Lords Ultra Vires Ruling",
            content: "The House of Lords ruled local councils had no statutory capacity to trade derivatives. Swaps were declared void ab initio, inflicting £600M in bank losses."
          }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce Business Snapshot 7.2: Hammersmith & Fulham disaster",
          sourceFactIds: ["F07"],
          newTerms: ["Hammersmith & Fulham disaster"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Detail £6B speculative swap positions and rate decline bet",
          sourceFactIds: ["F07"],
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
          onScreenIntent: "Explain House of Lords ultra vires ruling and £600M banking write-off",
          sourceFactIds: ["F07"],
          newTerms: ["ultra vires"],
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
      title: "Active Recall Scenario: Valuing an Existing USD/GBP Currency Swap",
      purpose: "Test student calculation of currency swap value: B_D - S_0 * B_F",
      takeaways: [
        "B_D = $105M USD, B_F = £70M GBP, S_0 = 1.45 USD/GBP",
        "Spot-converted foreign bond: £70M * 1.45 = $101.5M USD",
        "V_swap = $105M - $101.5M = +$3,500,000 (positive $3.5M)"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        title: "Active Recall: Dual Bond Currency Swap Valuation",
        question: "An institution receives USD fixed (B_D = $105M) and pays GBP fixed (B_F = £70M). Spot rate S_0 = 1.45 USD/GBP. What is the value of this currency swap to the institution?",
        options: [
          "+$3,500,000: $105M domestic bond minus ($70M * 1.45 = $101.5M) foreign bond.",
          "-$3,500,000: The institution is in an out-of-the-money loss position.",
          "+$35,000,000: Subtracting foreign currency pounds directly from domestic dollars.",
          "$0.00: Currency swaps remain at zero value because original principal amounts are re-exchanged."
        ],
        correctIndex: 0,
        explanation: "Using the dual bond valuation formula: V_swap = B_D - S_0 * B_F. First convert the foreign GBP bond into USD: 70M GBP * 1.45 USD/GBP = $101.5M USD. Then subtract from the domestic USD bond: $105M - $101.5M = +$3.5M (positive $3,500,000)."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Present the currency swap pricing problem",
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
          onScreenIntent: "Prompt calculation: B_D = $105M, B_F = £70M, S_0 = 1.45",
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
          onScreenIntent: "Reveal Option A: +$3.5M and trace foreign bond conversion",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Split Comparison (b31, b32, b33, b34)
    {
      id: "s10",
      index: 10,
      title: "Structural Risk Management Rules for Corporate Swap Users",
      purpose: "Establish three imperative risk management rules: hedging vs. speculation, legal capacity, and CSAs",
      takeaways: [
        "Rule 1: Use swaps strictly to hedge underlying debt; macro speculation risks existential ruin",
        "Rule 2: Independently verify counterparty statutory legal capacity to prevent ultra vires voiding",
        "Rule 3: Enforce daily CSA variation margin to neutralize terminal principal default risk"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-prudent-hedging",
          heading: "Prudent Treasury Practice",
          tone: "positive",
          points: [
            "Swaps strictly matched to underlying commercial loans and operational revenues",
            "Independent legal verification of counterparty capacity within ISDA schedules",
            "Mandatory daily CSA variation margin collateralization in cash or Treasuries",
            "Eliminates FX and interest rate volatility without speculative balance sheet risk"
          ]
        },
        right: {
          id: "cmp-fatal-traps",
          heading: "Existential Failure Traps",
          tone: "trap",
          points: [
            "Using swaps speculatively to generate upfront premium income (e.g. Hammersmith)",
            "Assuming counterparties possess statutory authority without independent legal check",
            "Leaving cross-currency terminal principal re-exchanges uncollateralized",
            "Creates catastrophic multi-hundred-million-dollar default losses"
          ]
        },
        verdict: {
          id: "vrd-rules",
          text: "Prudent treasuries hedge commercial exposures, verify legal capacity, and collateralize daily via CSAs."
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Introduce three vital risk management rules for corporate swap users",
          sourceFactIds: ["F06", "F07"],
          newTerms: ["risk management rules"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "State Rule One: Swaps must hedge underlying debt, not speculate",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "State Rule Two: Independently verify counterparty statutory legal capacity",
          sourceFactIds: ["F07"],
          newTerms: ["statutory legal capacity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "State Rule Three: Collateralize all cross-currency exposures under bilateral CSAs",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b35, b36, b37, b38, b39)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Currency Swaps & Credit Risk",
      purpose: "Consolidate Chapter 7 Part 2 currency swap principles before Chapter 8 Securitization",
      takeaways: [
        "Currency swaps feature real principal exchange and gross periodic cash transfers",
        "Contracts are valued via the dual bond portfolio model: V_swap = B_D - S_0 * B_F",
        "Terminal principal default risk necessitates daily CSA variation margin collateralization"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The Four Pillars of Cross-Currency Swaps",
        rules: [
          {
            id: "rul-1",
            title: "Dual Principal Exchanges",
            text: "Full physical principal is exchanged at inception and re-exchanged at maturity at original S_0."
          },
          {
            id: "rul-2",
            title: "Gross Periodic Payments",
            text: "Because cash flows are in different sovereign currencies, payments cannot be netted."
          },
          {
            id: "rul-3",
            title: "Global Comparative Advantage",
            text: "Multinationals issue debt in domestic markets where they have brand advantage, swapping to foreign needs."
          },
          {
            id: "rul-4",
            title: "Dual Bond Portfolio Valuation",
            text: "V_swap = B_D - S_0 * B_F: domestic bond PV minus spot-converted foreign bond PV."
          },
          {
            id: "rul-5",
            title: "10x Greater Credit Risk",
            text: "Terminal principal re-exchange exposes counterparties to replacement losses of 30-50%."
          },
          {
            id: "rul-6",
            title: "Daily CSA Collateralization",
            text: "Credit Support Annexes mandate daily variation margin, resetting credit risk to zero every 24 hours."
          },
          {
            id: "rul-7",
            title: "Synthetic Total Return Swaps",
            text: "TRS structures transfer complete reference asset returns without cash asset purchases."
          },
          {
            id: "rul-8",
            title: "Statutory Capacity Enforceability",
            text: "Hammersmith & Fulham proves counterparty legal capacity must be verified to prevent ultra vires nullification."
          }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Introduce synthesis of the four structural pillars",
          sourceFactIds: ["F01", "F04", "F05", "F07"],
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
          onScreenIntent: "Review Pillar One: Dual Principal Exchanges",
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
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Review Pillar Two: Dual Bond Valuation",
          sourceFactIds: ["F04"],
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
          onScreenIntent: "Review Pillar Three: Principal Credit Risk and CSAs",
          sourceFactIds: ["F05", "F06"],
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
          onScreenIntent: "Review Pillar Four: Legal Capacity and preview Chapter 8 Securitization",
          sourceFactIds: ["F07"],
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
if (!courseMap.chapters.some(c => c.chapterId === 'ch07' && c.partId === 'p2')) {
  courseMap.chapters.push({
    chapterId: "ch07",
    partId: "p2",
    title: "Swaps - Part 2",
    status: "in_progress"
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

console.log('Chapter 7 Part 2 successfully built and registered in course_map!');
