import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch05/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_05/Part_02/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_05/Part_02/script_hi.md', 'utf8');

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

// 1. Facts with full numerical grounding from Chapter 5 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch05",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "formula",
      statement: "Stock index futures are priced using continuous dividend yield: F_0 = S_0 * e^((r - q) * T), where q is annualized dividend yield of the index.",
      citation: { chapter: "5", section: "5.4", page: "111" }
    },
    {
      id: "F02",
      category: "definition",
      statement: "Index arbitrage involves trading index futures and a basket of constituent stocks via program trading when the spread exceeds transaction costs (arbitrage band).",
      citation: { chapter: "5", section: "5.4", page: "112" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "Covered Interest Parity (CIP) states that forward foreign exchange rate is F_0 = S_0 * e^((r - r_f) * T), where S_0 is domestic currency per foreign currency, r is domestic risk-free rate, and r_f is foreign risk-free rate.",
      citation: { chapter: "5", section: "5.7", page: "116" }
    },
    {
      id: "F04",
      category: "definition",
      statement: "Covered interest arbitrage exploits CIP deviations: borrowing currency with lower synthetic cost and lending in higher yielding currency, fully hedged via forward contracts.",
      citation: { chapter: "5", section: "5.7", page: "117" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "For investment commodities with storage cost rate u as a fraction of price, F_0 = S_0 * e^((r + u) * T). Storage costs act like negative dividend yield.",
      citation: { chapter: "5", section: "5.10", page: "121" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "For consumption commodities, convenience yield y reflects non-monetary benefit of physical custody: F_0 = S_0 * e^((r + u - y) * T). Arbitrage enforces only upper bound F_0 <= S_0 * e^((r + u) * T).",
      citation: { chapter: "5", section: "5.11", page: "123" }
    },
    {
      id: "F07",
      category: "formula",
      statement: "The master Cost of Carry equation is F_0 = S_0 * e^(c * T), where c = r for non-income assets, c = r - q for indices, c = r - r_f for foreign currencies, and c = r + u - y for commodities.",
      citation: { chapter: "5", section: "5.12", page: "125" }
    },
    {
      id: "F08",
      category: "definition",
      statement: "Delivery options (timing, grade, location) benefit the short party, slightly depressing futures prices relative to forward prices.",
      citation: { chapter: "5", section: "5.13", page: "126" }
    },
    {
      id: "F09",
      category: "numerical_example",
      statement: "With S_0 = 1.5000 USD/GBP, r_US = 5.0%, r_UK = 8.0%, T = 1 yr, forward rate is F_0 = 1.5000 * e^((0.05 - 0.08) * 1) = 1.5000 * e^(-0.03) = 1.4558 USD/GBP (forward discount).",
      citation: { chapter: "5", section: "5.7", page: "117" }
    }
  ],
  realWorldProblem: {
    actors: "Macro FX trading desks, commodity trading houses, and algorithmic index arbitrageurs",
    situation: "Pricing futures contracts and enforcing no-arbitrage bounds across global equity indices, foreign exchange, and physical commodities",
    failure: "Ignoring storage costs, convenience yields, or foreign interest rates causes mispriced hedges and millions in trading losses",
    invention: "Covered Interest Parity, Program Trading algorithms, and the Unified Cost of Carry model",
    factIds: ["F01", "F03", "F05", "F06", "F07", "F09"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch05",
  partId: "p2",
  title: "Determination of Forward and Futures Prices - Part 2",
  subtitle: "Index Futures, Covered Interest Parity, Commodity Carry, and Term Structures",
  targetAudience: "Quantitative finance students, risk analysts, and derivative traders",
  prerequisites: ["Part 1 No-Arbitrage Principle", "Continuous compounding", "Dividend yield modeling"],
  scenes: [
    { sceneId: "s00", title: "Beyond Individual Equities: Macro Asset Pricing", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Stock Index Futures & The Program Trading Engine", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Index Arbitrage Bounds & The Triple Witching Hour", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "Foreign Currency Forwards: Covered Interest Parity", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "Covered Interest Arbitrage: Exploiting FX Mispricings", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Commodity Futures: Storage Costs on Investment Metals", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Consumption Commodities & The Convenience Yield", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "The Unified Cost of Carry Framework", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Delivery Options: The Short Seller's Edge", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Calculating Currency Forward Rate", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Contango, Backwardation & Keynes' Risk Hypothesis", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Global Forward Pricing", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch05",
  partId: "p2",
  formulas: [
    {
      id: "M01",
      name: "Covered Interest Parity (FX Forward)",
      latex: "F_0 = S_0 e^{(r - r_f)T}",
      variables: [
        { symbol: "F_0", description: "Forward exchange rate today", unit: "domestic/foreign" },
        { symbol: "S_0", description: "Spot exchange rate today", unit: "domestic/foreign" },
        { symbol: "r", description: "Domestic continuously compounded risk-free rate", unit: "decimal/year" },
        { symbol: "r_f", description: "Foreign continuously compounded risk-free rate", unit: "decimal/year" },
        { symbol: "T", description: "Time to contract maturity", unit: "years" }
      ]
    },
    {
      id: "M02",
      name: "Commodity Futures with Storage Costs",
      latex: "F_0 = S_0 e^{(r + u)T}",
      variables: [
        { symbol: "u", description: "Continuous storage cost per year as fraction of spot", unit: "decimal/year" },
        { symbol: "r", description: "Risk-free financing rate", unit: "decimal/year" },
        { symbol: "S_0", description: "Spot commodity price", unit: "currency" },
        { symbol: "T", description: "Time to maturity", unit: "years" }
      ]
    },
    {
      id: "M03",
      name: "Consumption Commodity with Convenience Yield",
      latex: "F_0 = S_0 e^{(r + u - y)T}",
      variables: [
        { symbol: "y", description: "Convenience yield of physical holding", unit: "decimal/year" },
        { symbol: "u", description: "Storage cost rate", unit: "decimal/year" },
        { symbol: "r", description: "Risk-free interest rate", unit: "decimal/year" }
      ]
    },
    {
      id: "M04",
      name: "Master Cost of Carry Model",
      latex: "F_0 = S_0 e^{cT}",
      variables: [
        { symbol: "c", description: "Net cost of carry parameter", unit: "decimal/year" },
        { symbol: "S_0", description: "Spot price", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch05",
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
  chapterId: "ch05",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 5",
  partLabel: "Part 2",
  title: "Determination of Forward and Futures Prices - Part 2",
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
      title: "Beyond Individual Equities: Macro Asset Pricing",
      purpose: "Extend forward pricing from single stocks to broad indices, currencies, and physical commodities",
      takeaways: [
        "Global derivatives volume concentrates in macro assets: indices, FX, and commodities",
        "Replication algorithms manage hundreds of constituent equities simultaneously",
        "Part 2 derives Covered Interest Parity and physical commodity carrying costs"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "How do trading desks execute arbitrage across five hundred index stocks, foreign currencies, and physical oil barrels?" },
          { id: "m2", speaker: "mentor", text: "In Part One, we mastered individual equities. But global volume concentrates in macro assets: indices, foreign exchange, and physical commodities." },
          { id: "m3", speaker: "mentor", text: "How do algorithmic systems trade 500 stocks in milliseconds? How do rate differentials govern FX forwards? How do storage and convenience yields price commodities?" },
          { id: "m4", speaker: "mentor", text: "In Part Two, we master index arbitrage algorithms, Covered Interest Parity, physical commodity storage, and the master Cost of Carry framework." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Macro Pricing Intro", "Index Futures", "CIP & FX Forwards", "Covered Arbitrage", "Commodity Carry", "Cost of Carry Framework"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "How do trading desks execute arbitrage across five hundred index stocks, foreign currencies, and physical oil barrels?" },
            hi: { display: "ट्रेडिंग डेस्क 500 स्टॉक्स, फॉरेन करेंसीज और फिजिकल कमोडिटीज पर एक साथ आर्बिट्राज कैसे एग्जीक्यूट करते हैं?" }
          },
          onScreenIntent: "Opening dilemma question on macro asset replication",
          sourceFactIds: ["F01", "F03"],
          newTerms: ["macro asset pricing"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor highlights global trading focus on macro asset classes",
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
          onScreenIntent: "The mentor poses core quantitative questions across indices, FX, and commodities",
          sourceFactIds: ["F03", "F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "The mentor outlines Part 2 roadmap and learning objectives",
          sourceFactIds: ["F07"],
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
      title: "Stock Index Futures & The Program Trading Engine",
      purpose: "Examine index pricing formula and automated program trading execution",
      takeaways: [
        "Index futures price with continuous dividend yield: F_0 = S_0 * e^((r - q)*T)",
        "Index arbitrage involves trading index futures against underlying equity baskets",
        "Program trading systems execute basket orders across hundreds of shares in milliseconds"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Index Arbitrage & Algorithmic Program Trading",
        subtitle: "Mechanical Replication of Multi-Asset Baskets",
        sections: [
          {
            id: "sec-formula",
            title: "Index Valuation Formula",
            content: "F_0 = S_0 * e^((r - q)*T), where continuous dividend yield q aggregates payouts across all index constituents."
          },
          {
            id: "sec-basket",
            title: "Replication Basket Execution",
            content: "Because an index cannot be physically purchased directly, traders trade a synthetic portfolio mimicking exact index weights."
          },
          {
            id: "sec-program",
            title: "Automated Program Trading",
            content: "Automated routing engines slice and route orders across hundreds of stocks simultaneously within microseconds of price divergence."
          }
        ]
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "State the index continuous dividend yield pricing formula",
          sourceFactIds: ["F01"],
          newTerms: ["continuous dividend yield"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Explain why index replication requires multi-stock baskets",
          sourceFactIds: ["F02"],
          newTerms: ["index arbitrage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Introduce program trading automated computer execution",
          sourceFactIds: ["F02"],
          newTerms: ["program trading"],
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
      title: "Index Arbitrage Bounds & The Triple Witching Hour",
      purpose: "Detail arbitrage bands caused by transaction costs and quarterly expiration dynamics",
      takeaways: [
        "Bid-ask spreads and brokerage fees create an Arbitrage Band around fair value",
        "Program trading triggers only when price disparities exceed trading friction",
        "Quarterly contract expirations create high market volatility (Triple Witching)"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-band",
          heading: "Arbitrage Band Dynamics",
          tone: "neutral",
          points: [
            "Broker commissions, bid-ask spreads, and market impact cost create an inert price zone",
            "Inside the band, theoretical mispricings yield negative net trading return",
            "Algorithmic execution activates instantly upon breach of upper or lower threshold",
            "Tighter exchange liquidity narrows the arbitrage corridor over time"
          ]
        },
        right: {
          id: "cmp-witching",
          heading: "Triple Witching Hour",
          tone: "trap",
          points: [
            "Simultaneous quarterly expiration of index futures, index options, and stock options",
            "Huge volumes of program arbitrage positions must be unwound or rolled over",
            "Cash-settlement mechanics trigger sharp spikes in intraday trading volatility",
            "Modern exchange closing-cross auctions help manage order imbalances"
          ]
        },
        verdict: {
          id: "vrd-band",
          text: "Arbitrage bands prevent continuous friction-free trading; unwinding positions creates expiration volume surges."
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Define the Arbitrage Band created by transaction costs",
          sourceFactIds: ["F02"],
          newTerms: ["arbitrage band"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Analyze program order flood when band thresholds are breached",
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
          onScreenIntent: "Explain Triple Witching Hour volume surges and market dynamics",
          sourceFactIds: ["F02"],
          newTerms: ["triple witching hour"],
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
      title: "Foreign Currency Forwards: Covered Interest Parity",
      purpose: "Derive Covered Interest Parity treating foreign currency as a dividend-paying asset",
      takeaways: [
        "Foreign currency acts analytically as an asset paying continuous dividend yield r_f",
        "Covered Interest Parity formula: F_0 = S_0 * e^((r - r_f)*T)",
        "When domestic rate exceeds foreign rate (r > r_f), foreign currency trades at a forward premium"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Covered Interest Parity (CIP) Equation",
        formula: {
          latex: "F_0 = S_0 e^{(r - r_f)T}",
          expression: "Forward Rate = Spot Rate * exp((Domestic Rate - Foreign Rate) * Time)",
          solvesFor: "Theoretical Forward FX Exchange Rate (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Forward exchange rate agreed today", unit: "domestic/foreign" },
            { symbol: "S_0", latex: "S_0", meaning: "Spot exchange rate today (domestic per 1 unit foreign)", unit: "domestic/foreign" },
            { symbol: "r", latex: "r", meaning: "Domestic continuously compounded risk-free rate", unit: "decimal/year" },
            { symbol: "r_f", latex: "r_f", meaning: "Foreign continuously compounded risk-free rate", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Time to forward contract maturity", unit: "years" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "r - r_f > 0", meaning: "Forward Premium: Foreign currency trades above spot rate", unit: "regime" },
          { id: "p2", symbolLatex: "r - r_f < 0", meaning: "Forward Discount: Foreign currency trades below spot rate", unit: "regime" },
          { id: "p3", symbolLatex: "e^{(r - r_f)T}", meaning: "Interest rate differential growth factor", unit: "dimensionless" }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Model foreign currency as an asset yielding foreign interest rate r_f",
          sourceFactIds: ["F03"],
          newTerms: ["covered interest parity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Formulate Covered Interest Parity equation F_0 = S_0 * e^((r - r_f)*T)",
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
          onScreenIntent: "Explain forward premium and forward discount regimes",
          sourceFactIds: ["F03"],
          newTerms: ["forward premium", "forward discount"],
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
      title: "Covered Interest Arbitrage: Exploiting FX Mispricings",
      purpose: "Trace the 4-step execution of covered interest arbitrage when market forward rates diverge",
      takeaways: [
        "Deviations from CIP trigger Covered Interest Arbitrage across money markets",
        "Borrow domestic currency, convert to foreign spot, and invest in foreign paper",
        "Selling foreign proceeds forward guarantees repayment and pure riskless profit"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        title: "Covered Interest Arbitrage Execution Steps",
        links: [
          {
            id: "cia1",
            role: "condition",
            text: "Market forward rate diverges from theoretical CIP: F_0 > S_0 * e^((r - r_f)*T)"
          },
          {
            id: "cia2",
            role: "action",
            text: "Step 1: Borrow domestic currency at rate r and convert immediately to foreign at spot S_0"
          },
          {
            id: "cia3",
            role: "mechanism",
            text: "Step 2: Invest foreign currency at foreign rate r_f; sell future proceeds forward at F_0"
          },
          {
            id: "cia4",
            role: "result",
            text: "Step 3: At maturity T, foreign investment matures with interest to principal * e^(r_f*T)"
          },
          {
            id: "cia5",
            role: "consequence",
            text: "Deliver foreign funds into forward contract: convert to domestic, repay loan, pocket cash profit"
          }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Introduce Covered Interest Arbitrage across global banks",
          sourceFactIds: ["F04"],
          newTerms: ["covered interest arbitrage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Step 1: Borrowing domestic currency and converting spot",
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
          onScreenIntent: "Step 2: Investing foreign currency and selling proceeds forward",
          sourceFactIds: ["F04"],
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
          onScreenIntent: "Step 3: Delivering into forward contract and pocketing riskless profit",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Formula Breakdown (b17, b18, b19)
    {
      id: "s05",
      index: 5,
      title: "Commodity Futures: Storage Costs on Investment Metals",
      purpose: "Formulate commodity futures pricing incorporating storage cost rate u",
      takeaways: [
        "Physical commodities incur warehousing, insurance, and custodial storage costs u",
        "Storage costs act as a negative dividend: F_0 = S_0 * e^((r + u)*T)",
        "Carrying costs lift theoretical commodity futures prices above spot"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Investment Commodity Futures Pricing",
        formula: {
          latex: "F_0 = S_0 e^{(r + u)T}",
          expression: "Futures Price = Spot Price * exp((Financing Rate + Storage Rate) * Time)",
          solvesFor: "Investment Commodity Futures Price (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Futures price for investment metal", unit: "currency" },
            { symbol: "S_0", latex: "S_0", meaning: "Spot price of the commodity today", unit: "currency" },
            { symbol: "r", latex: "r", meaning: "Continuously compounded risk-free rate", unit: "decimal/year" },
            { symbol: "u", latex: "u", meaning: "Continuous storage cost per year as fraction of price", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Time to contract expiration", unit: "years" }
          ]
        },
        parts: [
          { id: "u1", symbolLatex: "r + u", meaning: "Total carrying cost: interest financing plus physical storage", unit: "decimal/year" },
          { id: "u2", symbolLatex: "e^{(r + u)T}", meaning: "Compounded carry growth factor", unit: "dimensionless" },
          { id: "u3", symbolLatex: "U = \\text{PV of dollar storage}", meaning: "Discrete alternative: F_0 = (S_0 + U) * e^(r*T)", unit: "currency" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Introduce physical commodity storage costs parameter u",
          sourceFactIds: ["F05"],
          newTerms: ["storage costs"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Formulate investment commodity equation F_0 = S_0 * e^((r + u)*T)",
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
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Explain why storage acts as a negative dividend lifting futures price",
          sourceFactIds: ["F05"],
          newTerms: ["negative dividend"],
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
      title: "Consumption Commodities & The Convenience Yield",
      purpose: "Introduce convenience yield y and formulate consumption commodity pricing",
      takeaways: [
        "Consumption commodities provide non-monetary operational utility (convenience yield y)",
        "Convenience yield measures the benefit of holding inventory against supply shocks",
        "Consumption commodity formula: F_0 = S_0 * e^((r + u - y)*T)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Consumption Commodity Pricing with Convenience Yield",
        formula: {
          latex: "F_0 = S_0 e^{(r + u - y)T}",
          expression: "Futures Price = Spot * exp((Financing + Storage - Convenience Yield) * Time)",
          solvesFor: "Consumption Commodity Equilibrium Futures Price (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Consumption commodity futures price", unit: "currency" },
            { symbol: "S_0", latex: "S_0", meaning: "Current spot commodity price", unit: "currency" },
            { symbol: "r", latex: "r", meaning: "Risk-free financing rate", unit: "decimal/year" },
            { symbol: "u", latex: "u", meaning: "Physical storage and warehousing cost rate", unit: "decimal/year" },
            { symbol: "y", latex: "y", meaning: "Convenience yield of holding physical inventory", unit: "decimal/year" }
          ]
        },
        parts: [
          { id: "y1", symbolLatex: "y", meaning: "Non-monetary operational buffer against unexpected supply disruptions", unit: "decimal/year" },
          { id: "y2", symbolLatex: "r + u - y", meaning: "Net carrying cost of physical consumption goods", unit: "decimal/year" },
          { id: "y3", symbolLatex: "F_0 \\le S_0 e^{(r + u)T}", meaning: "Upper no-arbitrage boundary (shorting inventory is impractical)", unit: "boundary" }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Introduce consumption commodities and the convenience yield parameter y",
          sourceFactIds: ["F06"],
          newTerms: ["convenience yield"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Explain operational benefits of holding physical oil or metal inventories",
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
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Derive consumption commodity formula F_0 = S_0 * e^((r + u - y)*T)",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Table Compare (b23, b24, b25)
    {
      id: "s07",
      index: 7,
      title: "The Unified Cost of Carry Framework",
      purpose: "Unify all global asset classes under the master Cost of Carry formula F_0 = S_0 * e^(c*T)",
      takeaways: [
        "Master cost of carry formula F_0 = S_0 * e^(c*T) unifies all asset classes",
        "Carry c evaluates to r, r - q, r - r_f, or r + u - y depending on asset type",
        "Global derivatives desks rely on this single mathematical architecture"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        title: "The Unified Cost of Carry Architecture",
        columns: ["Asset Category", "Cost of Carry (c)", "Pricing Formula", "Key Economic Factors"],
        rows: [
          {
            id: "row-stock",
            cells: ["Non-Income Stock", "c = r", "F_0 = S_0 * e^(r*T)", "Pure financing interest cost"]
          },
          {
            id: "row-index",
            cells: ["Stock Index", "c = r - q", "F_0 = S_0 * e^((r-q)*T)", "Financing cost minus dividend yield"]
          },
          {
            id: "row-fx",
            cells: ["Foreign Currency", "c = r - r_f", "F_0 = S_0 * e^((r - r_f)*T)", "Domestic rate minus foreign rate (CIP)"]
          },
          {
            id: "row-metal",
            cells: ["Investment Commodity", "c = r + u", "F_0 = S_0 * e^((r+u)*T)", "Financing plus vault storage/insurance"]
          },
          {
            id: "row-comm",
            cells: ["Consumption Commodity", "c = r + u - y", "F_0 = S_0 * e^((r+u-y)*T)", "Storage minus physical convenience yield"]
          }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Introduce John Hull's master Cost of Carry formula F_0 = S_0 * e^(c*T)",
          sourceFactIds: ["F07"],
          newTerms: ["unified cost of carry"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Map carry parameter c across equities, indices, FX, and commodities",
          sourceFactIds: ["F07"],
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
          onScreenIntent: "Highlight universal role of cost of carry in global quantitative finance",
          sourceFactIds: ["F07"],
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
      title: "Delivery Options: The Short Seller's Edge",
      purpose: "Examine embedded delivery options and their price impact on futures contracts",
      takeaways: [
        "Futures exchanges grant delivery options exclusively to the short position",
        "Shorts choose delivery timing, warehouse location, and cheapest grade",
        "Embedded delivery options slightly depress futures prices relative to forwards"
      ],
      pedagogicalContinuation: false,
      template: "technical_panel",
      data: {
        title: "Embedded Delivery Options in Futures Contracts",
        subtitle: "Why Futures Prices Trade Slightly Below Forward Quotes",
        sections: [
          {
            id: "opt-timing",
            title: "Timing Option",
            content: "The short party decides which business day during the delivery month to issue notice of delivery."
          },
          {
            id: "opt-location",
            title: "Location Option",
            content: "Where contracts allow multiple approved delivery points, the short selects the most logistically advantageous facility."
          },
          {
            id: "opt-quality",
            title: "Quality Option (Cheapest-to-Deliver)",
            content: "The short selects among permissible commodity grades or deliverable bonds, choosing the cheapest asset relative to conversion factors."
          }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Introduce exchange delivery rules and short position privileges",
          sourceFactIds: ["F08"],
          newTerms: ["delivery options"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Detail timing, location, and cheapest-to-deliver options",
          sourceFactIds: ["F08"],
          newTerms: ["cheapest-to-deliver"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Explain why delivery options depress futures prices below forward quotes",
          sourceFactIds: ["F08"],
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
      title: "Active Recall Scenario: Calculating Currency Forward Rate",
      purpose: "Test student mastery of Covered Interest Parity and FX forward calculations",
      takeaways: [
        "S_0 = 1.5000 USD/GBP, r_US = 5.0%, r_UK = 8.0%, T = 1 yr",
        "Differential r - r_f = 0.05 - 0.08 = -0.03 (negative carry)",
        "Theoretical forward rate is F_0 = 1.5000 * e^(-0.03) = 1.4558 USD/GBP"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        title: "Active Recall: Covered Interest Parity Calculation",
        question: "The spot exchange rate is S_0 = 1.5000 USD per GBP. The continuous US rate is r = 5.0%, and the UK rate is r_f = 8.0%. What is the 1-year theoretical forward exchange rate F_0?",
        options: [
          "1.5458 USD per GBP: The pound trades at a premium because UK yields are higher.",
          "1.4558 USD per GBP: The pound trades at a forward discount because foreign rate r_f exceeds domestic rate r.",
          "1.5000 USD per GBP: Forward rates equal spot rates in efficient global foreign exchange markets.",
          "1.6250 USD per GBP: The forward rate reflects simple linear interest rate differentials."
        ],
        correctIndex: 1,
        explanation: "Using Covered Interest Parity: F_0 = S_0 * e^((r - r_f) * T) = 1.5000 * e^((0.05 - 0.08) * 1) = 1.5000 * e^(-0.03) ≈ 1.5000 * 0.970446 = 1.4558 USD/GBP. Because the UK interest rate (8.0%) exceeds the US interest rate (5.0%), the pound must trade at a forward discount of approximately 3% to eliminate riskless arbitrage."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Present the Covered Interest Parity recall challenge",
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
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Prompt calculation of exponential rate differential e^(-0.03)",
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
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Reveal Option B: 1.4558 USD/GBP and forward discount mechanics",
          sourceFactIds: ["F09"],
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
      title: "Contango, Backwardation & Keynes' Risk Hypothesis",
      purpose: "Contrast Contango and Backwardation term structure regimes and explain Keynesian risk transfer",
      takeaways: [
        "Contango: Futures prices trade above spot (carrying costs dominate)",
        "Backwardation: Futures trade below spot (convenience yields or hedging pressure dominate)",
        "Keynes' Normal Backwardation explains futures discount as insurance premium to speculators"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-contango",
          heading: "Contango Regime",
          tone: "neutral",
          points: [
            "Futures price F_0 trades higher than current spot price S_0",
            "Upward-sloping forward curve typical when financing and storage costs dominate",
            "Common in gold, silver, and well-supplied physical commodity markets",
            "Roll yield for long futures holders is negative as contracts converge down to spot"
          ]
        },
        right: {
          id: "cmp-backwardation",
          heading: "Backwardation Regime",
          tone: "positive",
          points: [
            "Futures price F_0 trades lower than current spot price S_0",
            "Downward-sloping curve occurs when physical convenience yield y exceeds carry costs",
            "Keynes-Hicks Normal Backwardation: commercial hedgers sell futures at a discount to transfer risk",
            "Speculators earn a positive expected risk premium by providing liquidity"
          ]
        },
        verdict: {
          id: "vrd-regimes",
          text: "Contango reflects cost of carry dominance; Backwardation reflects inventory scarcity and hedger risk transfer."
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Introduce term structure regimes: Contango and Backwardation",
          sourceFactIds: ["F06"],
          newTerms: ["term structure regimes"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Define Contango when carrying costs exceed convenience yields",
          sourceFactIds: ["F06"],
          newTerms: ["contango"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Explain Backwardation and Keynes-Hicks Normal Backwardation theory",
          sourceFactIds: ["F06"],
          newTerms: ["normal backwardation"],
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
      title: "Summary Thread: Four Pillars of Global Forward Pricing",
      purpose: "Consolidate Chapter 5 Part 2 global forward pricing principles before advancing to Chapter 6",
      takeaways: [
        "Program trading enforces index arbitrage parity within transaction cost bands",
        "Covered Interest Parity models currency forwards as continuous foreign rate dividends",
        "The unified Cost of Carry equation F_0 = S_0 * e^(c*T) governs all derivatives"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The Four Macro Pillars of Forward Pricing",
        rules: [
          {
            id: "rul-1",
            title: "Index Arbitrage & Program Trading",
            text: "High-speed algorithms trade cash equity baskets against index futures within arbitrage cost bands."
          },
          {
            id: "rul-2",
            title: "Triple Witching Expirations",
            text: "Simultaneous quarterly contract settlements create intense volume spikes as arbitrage positions unwind."
          },
          {
            id: "rul-3",
            title: "Covered Interest Parity (CIP)",
            text: "Currencies price as dividend assets: F_0 = S_0 * e^((r - r_f)*T), locking forward FX differentials."
          },
          {
            id: "rul-4",
            title: "Covered Interest Arbitrage",
            text: "Deviations from CIP trigger cross-currency borrowing and lending hedged with forward contracts."
          },
          {
            id: "rul-5",
            title: "Investment Commodity Storage",
            text: "Storage costs u act as negative dividends, lifting forward prices via F_0 = S_0 * e^((r + u)*T)."
          },
          {
            id: "rul-6",
            title: "Convenience Yield in Commodities",
            text: "Operational value of physical holding lowers consumption futures: F_0 = S_0 * e^((r + u - y)*T)."
          },
          {
            id: "rul-7",
            title: "Master Cost of Carry Model",
            text: "F_0 = S_0 * e^(c*T) unifies all assets, mapping carry c to r, r - q, r - r_f, and r + u - y."
          },
          {
            id: "rul-8",
            title: "Contango & Normal Backwardation",
            text: "Carry dominance creates contango; inventory scarcity and hedger risk transfer drive backwardation."
          }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Introduce the synthesis of the four macro pillars",
          sourceFactIds: ["F01", "F03", "F05", "F07"],
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
          onScreenIntent: "Review Pillar One: Index Arbitrage and Program Trading",
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
          onScreenIntent: "Review Pillar Two: Covered Interest Parity",
          sourceFactIds: ["F03", "F04"],
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
          onScreenIntent: "Review Pillar Three: Storage Costs and Convenience Yield",
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
          onScreenIntent: "Review Pillar Four: Unified Cost of Carry and preview Chapter 6",
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
if (!courseMap.chapters.some(c => c.chapterId === 'ch05' && c.partId === 'p2')) {
  courseMap.chapters.push({
    chapterId: "ch05",
    partId: "p2",
    title: "Determination of Forward and Futures Prices - Part 2",
    status: "in_progress"
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

console.log('Chapter 5 Part 2 successfully built and registered in course_map!');
