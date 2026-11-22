import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch05/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_05/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_05/Part_01/script_hi.md', 'utf8');

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

// 1. Facts with full numerical grounding from Chapter 5 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch05",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "An investment asset is an asset held for investment purposes by significant numbers of investors (e.g., gold, silver, stocks, bonds). Arbitrageurs can readily buy or sell them, enforcing two-sided no-arbitrage bounds.",
      citation: { chapter: "5", section: "5.1", page: "103" }
    },
    {
      id: "F02",
      category: "definition",
      statement: "A consumption asset is an asset held primarily for commercial consumption or manufacturing (e.g., crude oil, copper, corn). Because short selling physical inventory is difficult, arbitrage enforces only an upper price bound.",
      citation: { chapter: "5", section: "5.1", page: "103" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "For an investment asset providing no income, the forward price is F_0 = S_0 * e^(r * T), where S_0 is spot price, r is risk-free rate, and T is time to maturity.",
      citation: { chapter: "5", section: "5.2", page: "105" }
    },
    {
      id: "F04",
      category: "definition",
      statement: "Cash-and-carry arbitrage occurs when F_0 > S_0 * e^(r * T): the trader borrows S_0 at rate r, buys spot asset, and shorts forward contract at F_0, locking in riskless profit F_0 - S_0 * e^(r * T).",
      citation: { chapter: "5", section: "5.2", page: "106" }
    },
    {
      id: "F05",
      category: "definition",
      statement: "Reverse cash-and-carry arbitrage occurs when F_0 < S_0 * e^(r * T): the trader short sells the spot asset, invests proceeds at rate r, and buys the forward contract at F_0, locking in profit S_0 * e^(r * T) - F_0.",
      citation: { chapter: "5", section: "5.2", page: "107" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "For an investment asset providing known cash income with present value I, the forward price is F_0 = (S_0 - I) * e^(r * T).",
      citation: { chapter: "5", section: "5.3", page: "108" }
    },
    {
      id: "F07",
      category: "formula",
      statement: "For an investment asset providing a known continuous dividend yield q, the forward price is F_0 = S_0 * e^((r - q) * T).",
      citation: { chapter: "5", section: "5.4", page: "111" }
    },
    {
      id: "F08",
      category: "formula",
      statement: "The value f of a long forward contract with delivery price K is f = (F_0 - K) * e^(-r * T) = S_0 - I - K * e^(-r * T). At contract initiation when K = F_0, f = 0.",
      citation: { chapter: "5", section: "5.5", page: "114" }
    },
    {
      id: "F09",
      category: "numerical_example",
      statement: "Consider a 1-year forward on a non-dividend stock trading at $100 with r = 5.0%. Theoretical forward price is $100 * e^(0.05 * 1) = $105.13. If market forward price is $108.00, cash-and-carry locks in $2.87 riskless profit.",
      citation: { chapter: "5", section: "5.2", page: "106" }
    }
  ],
  realWorldProblem: {
    actors: "Equity index arbitrageurs, institutional derivatives desks, and corporate hedging officers",
    situation: "Pricing forward and futures contracts and enforcing no-arbitrage bounds across equities, indices, and bonds",
    failure: "Mispricing forwards or misunderstanding short-sale dividend obligations creates fatal tracking errors and massive trading losses",
    invention: "Cash-and-carry replication, reverse cash-and-carry, and continuous dividend yield pricing models",
    factIds: ["F01", "F03", "F04", "F05", "F06", "F07", "F08"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch05",
  partId: "p1",
  title: "Determination of Forward and Futures Prices - Part 1",
  subtitle: "The No-Arbitrage Principle, Investment vs. Consumption Assets, and Cost of Carry",
  targetAudience: "Quantitative finance students, risk analysts, and derivative traders",
  prerequisites: ["Compounding frequencies", "Zero rates and discount factors", "Basic mechanics of forward contracts"],
  scenes: [
    { sceneId: "s00", title: "The Engine of Valuation: The No-Arbitrage Principle", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Asset Taxonomy: Investment Assets vs. Consumption Assets", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Short Selling: The Arbitrageur's Essential Weapon", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "The Core Forward Formula: Assets with No Income", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "Reverse Cash-and-Carry: Enforcing the Lower Bound", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "The Cost of Carry Framework: A Unified Perspective", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Forward Pricing with Known Cash Income", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Continuous Dividend Yield: Index & Equity Pricing", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "Forward Value vs. Forward Price: Mark-to-Market Valuation", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Detecting Cash-and-Carry Arbitrage", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "Forward vs. Futures Prices: When Do They Diverge?", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Forward Pricing", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch05",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "Forward Price (No Income)",
      latex: "F_0 = S_0 e^{rT}",
      variables: [
        { symbol: "F_0", description: "Forward price today", unit: "currency" },
        { symbol: "S_0", description: "Spot price today", unit: "currency" },
        { symbol: "r", description: "Continuously compounded risk-free rate", unit: "decimal/year" },
        { symbol: "T", description: "Time to contract maturity", unit: "years" }
      ]
    },
    {
      id: "M02",
      name: "Forward Price (Known Cash Income)",
      latex: "F_0 = (S_0 - I) e^{rT}",
      variables: [
        { symbol: "I", description: "Present value of intermediate cash income", unit: "currency" },
        { symbol: "S_0", description: "Spot price today", unit: "currency" },
        { symbol: "r", description: "Continuously compounded risk-free rate", unit: "decimal/year" },
        { symbol: "T", description: "Time to contract maturity", unit: "years" }
      ]
    },
    {
      id: "M03",
      name: "Forward Price (Continuous Dividend Yield)",
      latex: "F_0 = S_0 e^{(r - q)T}",
      variables: [
        { symbol: "q", description: "Continuous dividend yield", unit: "decimal/year" },
        { symbol: "r", description: "Risk-free rate", unit: "decimal/year" },
        { symbol: "S_0", description: "Spot price today", unit: "currency" },
        { symbol: "T", description: "Time to contract maturity", unit: "years" }
      ]
    },
    {
      id: "M04",
      name: "Forward Contract Value",
      latex: "f = (F_0 - K) e^{-rT} = S_0 - I - K e^{-rT}",
      variables: [
        { symbol: "f", description: "Value of long forward contract today", unit: "currency" },
        { symbol: "K", description: "Contract delivery price agreed at inception", unit: "currency" },
        { symbol: "F_0", description: "Current forward price for maturity T", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch05",
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

// 5. Episode Schema Compliant Episode
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch05",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 5",
  partLabel: "Part 1",
  title: "Determination of Forward and Futures Prices - Part 1",
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
      title: "The Engine of Valuation: The No-Arbitrage Principle",
      purpose: "Establish that forward pricing is replication cost rather than speculative forecasting",
      takeaways: [
        "Forward pricing is replication, not forecasting",
        "The Principle of No-Arbitrage dictates identical prices for identical cash flows",
        "Chapter 5 derives valuation across investment and consumption assets"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "Do forward prices represent what the market expects the asset will be worth in the future?" },
          { id: "m2", speaker: "mentor", text: "A widespread misconception in derivatives trading is that forward and futures prices represent market forecasts. Forward pricing is an exact mathematical equality dictated by replication cost." },
          { id: "m3", speaker: "mentor", text: "This framework is the Principle of No-Arbitrage: if two strategies generate identical cash flows at all future dates, they must have the exact same price today." },
          { id: "m4", speaker: "mentor", text: "In Chapter 5, we master forward pricing across non-income assets, discrete dividends, and continuous yields." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["No-Arbitrage Engine", "Asset Taxonomy", "Short Selling", "Core Formula", "Reverse Carry", "Carry Framework"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "Do forward prices represent what the market expects the asset will be worth in the future?" },
            hi: { display: "क्या फॉरवर्ड प्राइस वो एक्सपेक्टेड प्राइस होती है जो मार्केट फ्यूचर में प्रेडिक्ट करता है?" }
          },
          onScreenIntent: "Opening question challenging the forecasting fallacy",
          sourceFactIds: ["F01"],
          newTerms: ["forward pricing"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor refutes forecasting and introduces mechanical replication",
          sourceFactIds: ["F01"],
          newTerms: ["replication"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2"] },
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "The mentor formalizes the Principle of No-Arbitrage",
          sourceFactIds: ["F01"],
          newTerms: ["no-arbitrage principle"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "The mentor outlines Chapter 5 mathematical architecture",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3", "m4"] },
          visualCues: []
        }
      ]
    },
    // Scene 1: Table Compare (b04, b05, b06)
    {
      id: "s01",
      index: 1,
      title: "Asset Taxonomy: Investment Assets vs. Consumption Assets",
      purpose: "Categorize underlying assets and understand two-sided vs. upper-bound arbitrage",
      takeaways: [
        "Investment assets are held for wealth storage and investment return",
        "Consumption assets are held for manufacturing and commercial processing",
        "Two-sided arbitrage holds tightly only for investment assets"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        title: "Underlying Asset Classification",
        columns: ["Feature / Dimension", "Investment Assets", "Consumption Assets"],
        rows: [
          {
            id: "r1",
            cells: ["Primary Purpose", "Wealth storage & capital return", "Industrial processing & consumption"]
          },
          {
            id: "r2",
            cells: ["Representative Assets", "Gold, Silver, Equities, Sovereign Bonds", "Crude Oil, Copper, Wheat, Natural Gas"]
          },
          {
            id: "r3",
            cells: ["Short Selling Feasibility", "Readily borrowed & shorted via liquid repo", "Extremely difficult / impossible to short physical stock"]
          },
          {
            id: "r4",
            cells: ["Arbitrage Bound", "Two-sided equality: F_0 = S_0 * e^(r*T)", "Upper bound only: F_0 <= S_0 * e^((r+u)*T)"]
          },
          {
            id: "r5",
            cells: ["Convenience Yield", "Zero (no benefit to physical custody)", "Significant non-monetary benefit y of physical inventory"]
          }
        ]
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce asset taxonomy before applying forward models",
          sourceFactIds: ["F01", "F02"],
          newTerms: ["investment assets", "consumption assets"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Define investment assets and two-sided arbitrage",
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
          onScreenIntent: "Define consumption assets and upper-bound-only arbitrage",
          sourceFactIds: ["F02"],
          newTerms: ["convenience yield"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Causal Chain (b07, b08, b09, b10)
    {
      id: "s02",
      index: 2,
      title: "Short Selling: The Arbitrageur's Essential Weapon",
      purpose: "Examine the three-step mechanics of borrowing, selling, and returning shares",
      takeaways: [
        "Short selling allows traders to monetize an overvalued spot or undervalued forward",
        "Short sellers must pass all intermediate dividends directly to the share lender",
        "Shorts are closed by buying shares in open market or taking forward delivery"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        title: "Short Selling Mechanics & Arbitrage Execution",
        links: [
          {
            id: "l1",
            role: "condition",
            text: "Forward contract trades below fair replication value: F_0 < S_0 * e^(r*T)"
          },
          {
            id: "l2",
            role: "action",
            text: "Borrow shares from institutional custodian and sell immediately at spot price S_0"
          },
          {
            id: "l3",
            role: "mechanism",
            text: "Invest cash proceeds S_0 at risk-free rate r while going long forward at F_0"
          },
          {
            id: "l4",
            role: "result",
            text: "Pass any intermediate dividends or corporate distributions back to original lender"
          },
          {
            id: "l5",
            role: "consequence",
            text: "At maturity T, take forward delivery at F_0, return borrowed shares, keep riskless profit"
          }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Introduce short selling as the key arbitrage mechanism",
          sourceFactIds: ["F05"],
          newTerms: ["short selling"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Step 1: Borrowing shares and selling for cash",
          sourceFactIds: ["F05"],
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
          onScreenIntent: "Step 2: Passing intermediate dividends back to lender",
          sourceFactIds: ["F05"],
          newTerms: ["manufactured dividend"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Step 3: Closing the short position at maturity",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Formula Breakdown (b11, b12, b13)
    {
      id: "s03",
      index: 3,
      title: "The Core Forward Formula: Assets with No Income",
      purpose: "Derive the fundamental pricing formula F_0 = S_0 * e^(r*T) and Cash-and-Carry arbitrage",
      takeaways: [
        "Theoretical forward price equals compounded spot price: F_0 = S_0 * e^(r*T)",
        "Overpriced forwards (F_0 > S_0 * e^(r*T)) trigger Cash-and-Carry arbitrage",
        "Arbitrageurs borrow cash, buy spot stock, and short the forward contract"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Fundamental No-Arbitrage Forward Price",
        formula: {
          latex: "F_0 = S_0 e^{rT}",
          expression: "Forward Price = Spot Price * exp(Risk-Free Rate * Time)",
          solvesFor: "Theoretical Forward Delivery Price (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Theoretical forward price agreed today", unit: "currency" },
            { symbol: "S_0", latex: "S_0", meaning: "Spot price of the underlying asset today", unit: "currency" },
            { symbol: "r", latex: "r", meaning: "Continuously compounded annual risk-free rate", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Time to forward maturity in years", unit: "years" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "S_0", meaning: "Spot acquisition cost paid today", unit: "currency" },
          { id: "p2", symbolLatex: "e^{rT}", meaning: "Continuous compounding financing factor", unit: "dimensionless" },
          { id: "p3", symbolLatex: "F_0 - S_0 e^{rT}", meaning: "Arbitrage profit if market forward trades at a premium", unit: "currency" }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Derive the fundamental forward price formula for non-income assets",
          sourceFactIds: ["F03"],
          newTerms: ["forward price formula"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Analyze conditions for Cash-and-Carry Arbitrage when F_0 is high",
          sourceFactIds: ["F04"],
          newTerms: ["cash-and-carry arbitrage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Trace trade execution steps and riskless profit capture",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Causal Chain (b14, b15, b16, b17)
    {
      id: "s04",
      index: 4,
      title: "Reverse Cash-and-Carry: Enforcing the Lower Bound",
      purpose: "Establish how underpriced forwards trigger Reverse Cash-and-Carry to enforce lower price bound",
      takeaways: [
        "Underpriced forwards (F_0 < S_0 * e^(r*T)) trigger reverse cash-and-carry arbitrage",
        "Traders short spot, lend proceeds at rate r, and buy forward contracts",
        "Compound proceeds S_0 * e^(r*T) exceed delivery obligation F_0"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        title: "Reverse Cash-and-Carry Execution Steps",
        links: [
          {
            id: "rc1",
            role: "condition",
            text: "Market forward price trades below theoretical no-arbitrage bound: F_0 < S_0 * e^(r*T)"
          },
          {
            id: "rc2",
            role: "action",
            text: "Step 1: Short sell the spot asset today, collecting immediate proceeds S_0"
          },
          {
            id: "rc3",
            role: "mechanism",
            text: "Step 2: Invest proceeds S_0 at risk-free rate r and enter long forward contract at price F_0"
          },
          {
            id: "rc4",
            role: "result",
            text: "Step 3: At maturity T, cash investment grows to S_0 * e^(r*T)"
          },
          {
            id: "rc5",
            role: "consequence",
            text: "Pay F_0 to take delivery, return borrowed shares to lender, keep net profit: S_0 * e^(r*T) - F_0"
          }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Introduce condition where market forward price is underpriced",
          sourceFactIds: ["F05"],
          newTerms: ["reverse cash-and-carry"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Step 1: Short selling spot asset to raise cash",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Step 2: Investing proceeds and locking forward purchase",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Step 3: Taking delivery, returning borrowed shares, and pocketing profit",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Formula Breakdown (b18, b19, b20)
    {
      id: "s05",
      index: 5,
      title: "The Cost of Carry Framework: A Unified Perspective",
      purpose: "Unify forward pricing under generalized cost of carry c",
      takeaways: [
        "Cost of carry c measures net cost of financing, storage, and holding",
        "For non-income assets, carry cost c equals financing rate r",
        "Trading algorithms execute arbitrage trades in milliseconds to maintain parity"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Generalized Cost of Carry Equation",
        formula: {
          latex: "F_0 = S_0 e^{cT}",
          expression: "Forward Price = Spot Price * exp(Cost of Carry * Time)",
          solvesFor: "Generalized Forward Price across All Asset Classes (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Forward or futures market equilibrium price", unit: "currency" },
            { symbol: "S_0", latex: "S_0", meaning: "Current spot asset market price", unit: "currency" },
            { symbol: "c", latex: "c", meaning: "Net cost of carry: financing r + storage u - yield q", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Contract time to expiration", unit: "years" }
          ]
        },
        parts: [
          { id: "c1", symbolLatex: "c = r", meaning: "Non-dividend investment asset (pure financing)", unit: "decimal/year" },
          { id: "c2", symbolLatex: "c = r - q", meaning: "Dividend-paying stock or equity index", unit: "decimal/year" },
          { id: "c3", symbolLatex: "c = r + u - y", meaning: "Physical commodity with storage u and convenience yield y", unit: "decimal/year" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Introduce the unifying Cost of Carry framework",
          sourceFactIds: ["F03"],
          newTerms: ["cost of carry"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Formulate forward price as F_0 = S_0 * e^(c*T)",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Highlight algorithmic execution enforcing cost of carry equilibrium",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Formula Breakdown (b21, b22, b23)
    {
      id: "s06",
      index: 6,
      title: "Forward Pricing with Known Cash Income",
      purpose: "Formulate forward pricing when underlying assets distribute discrete cash dividends",
      takeaways: [
        "Forward contract holders do not receive intermediate spot dividends",
        "Present value of intermediate income I must be subtracted from spot price",
        "Adjusted forward formula: F_0 = (S_0 - I) * e^(r*T)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Forward Pricing with Discrete Income Distributions",
        formula: {
          latex: "F_0 = (S_0 - I) e^{rT}",
          expression: "Forward Price = (Spot Price - PV of Cash Income) * exp(r * T)",
          solvesFor: "Forward Price with Discrete Cash Dividends (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Forward price for asset with discrete income", unit: "currency" },
            { symbol: "S_0", latex: "S_0", meaning: "Current spot price of the dividend-paying asset", unit: "currency" },
            { symbol: "I", latex: "I", meaning: "Present value of all dividends received before maturity T", unit: "currency" },
            { symbol: "r", latex: "r", meaning: "Continuously compounded risk-free rate", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Time to contract expiration", unit: "years" }
          ]
        },
        parts: [
          { id: "i1", symbolLatex: "I = \\sum D_i e^{-r t_i}", meaning: "Sum of discrete dividends discounted to today", unit: "currency" },
          { id: "i2", symbolLatex: "S_0 - I", meaning: "Effective spot investment net of future dividend cash flows", unit: "currency" },
          { id: "i3", symbolLatex: "e^{rT}", meaning: "Financing growth factor over time T", unit: "dimensionless" }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Introduce dividend-paying securities and coupon bonds",
          sourceFactIds: ["F06"],
          newTerms: ["known cash income"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Explain why dividend present value I must be deducted from spot",
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
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Present full mathematical equation F_0 = (S_0 - I) * e^(r*T)",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Formula Breakdown (b24, b25, b26)
    {
      id: "s07",
      index: 7,
      title: "Continuous Dividend Yield: Index & Equity Pricing",
      purpose: "Formulate continuous dividend yield pricing for stock indices like S&P 500",
      takeaways: [
        "Broad market indices are modeled with a continuous dividend yield q",
        "Net financing rate becomes (r - q), giving F_0 = S_0 * e^((r - q)*T)",
        "When q > r, forward price trades at a discount to spot (backwardation)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Index Forward Pricing with Continuous Yield",
        formula: {
          latex: "F_0 = S_0 e^{(r - q)T}",
          expression: "Index Forward Price = Spot * exp((Risk-Free Rate - Dividend Yield) * Time)",
          solvesFor: "Equity Index Forward / Futures Price (F_0)",
          variables: [
            { symbol: "F_0", latex: "F_0", meaning: "Index forward price agreed today", unit: "currency" },
            { symbol: "S_0", latex: "S_0", meaning: "Current equity index level", unit: "currency" },
            { symbol: "r", latex: "r", meaning: "Risk-free financing rate", unit: "decimal/year" },
            { symbol: "q", latex: "q", meaning: "Continuous dividend yield paid by index components", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Time to expiration", unit: "years" }
          ]
        },
        parts: [
          { id: "q1", symbolLatex: "r - q > 0", meaning: "Contango: Forward trades at a premium above spot price", unit: "regime" },
          { id: "q2", symbolLatex: "r - q < 0", meaning: "Backwardation: Forward trades at a discount below spot price", unit: "regime" },
          { id: "q3", symbolLatex: "e^{(r - q)T}", meaning: "Net carrying factor adjusting for financing cost and dividend inflow", unit: "dimensionless" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Introduce continuous dividend yield modeling for broad indices",
          sourceFactIds: ["F07"],
          newTerms: ["continuous dividend yield"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Derive index formula F_0 = S_0 * e^((r - q)*T)",
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
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Examine backwardation when dividend yield q exceeds risk-free rate r",
          sourceFactIds: ["F07"],
          newTerms: ["backwardation", "contango"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Formula Breakdown (b27, b28, b29)
    {
      id: "s08",
      index: 8,
      title: "Forward Value vs. Forward Price: Mark-to-Market Valuation",
      purpose: "Distinguish delivery price K, forward quote F_0, and contract value f",
      takeaways: [
        "Forward price F_0 is agreed delivery price; forward value f is current paper worth",
        "At inception K = F_0, so contract value f = 0",
        "Subsequent long forward value: f = (F_0 - K) * e^(-r*T)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Valuation of Existing Forward Contracts",
        formula: {
          latex: "f = (F_0 - K) e^{-rT}",
          expression: "Contract Value = (Current Forward Price - Delivery Price) * exp(-r * T)",
          solvesFor: "Mark-to-Market Long Forward Contract Value (f)",
          variables: [
            { symbol: "f", latex: "f", meaning: "Current mark-to-market value of long forward contract", unit: "currency" },
            { symbol: "F_0", latex: "F_0", meaning: "Current forward price available in market for delivery at T", unit: "currency" },
            { symbol: "K", latex: "K", meaning: "Predetermined delivery price contracted at inception", unit: "currency" },
            { symbol: "r", latex: "r", meaning: "Current risk-free interest rate for remaining maturity T", unit: "decimal/year" },
            { symbol: "T", latex: "T", meaning: "Remaining time to expiration", unit: "years" }
          ]
        },
        parts: [
          { id: "f1", symbolLatex: "K = F_0 \\implies f = 0", meaning: "Contract inception condition (costless entry)", unit: "boundary" },
          { id: "f2", symbolLatex: "F_0 - K", meaning: "Payoff at maturity T", unit: "currency" },
          { id: "f3", symbolLatex: "e^{-rT}", meaning: "Zero-coupon discount factor back to valuation date", unit: "dimensionless" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Clarify difference between delivery price K, forward price F_0, and value f",
          sourceFactIds: ["F08"],
          newTerms: ["contract value", "delivery price"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Explain why initial forward value is zero at inception",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Formulate mark-to-market forward valuation f = (F_0 - K) * e^(-r*T)",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 9: Interactive Quiz (b30, b31, b32)
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Detecting Cash-and-Carry Arbitrage",
      purpose: "Test student calculation of theoretical forward price and trade execution",
      takeaways: [
        "Spot = $100, r = 5.0%, T = 1 yr -> Theoretical F_0 = $105.13",
        "Market quote $108.00 > $105.13 indicates an overpriced forward contract",
        "Borrow $100, buy spot, short forward -> locks in $2.87 riskless cash profit"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        title: "Active Recall: Executing Cash-and-Carry Arbitrage",
        question: "A non-dividend stock has spot price S_0 = $100. The continuous risk-free rate is r = 5.0%. A 1-year forward contract is quoted at $108.00. What is the optimal arbitrage strategy?",
        options: [
          "Cash-and-Carry: Borrow $100, buy spot stock, short forward at $108.00; lock in $2.87 profit.",
          "Reverse Cash-and-Carry: Short spot stock at $100, invest cash at 5%, buy forward at $108.00.",
          "Do nothing: The market is in equilibrium because $108.00 accounts for investor risk tolerance.",
          "Buy spot stock and buy forward contract to double exposure to upside price appreciation."
        ],
        correctIndex: 0,
        explanation: "Theoretical fair forward price is F_0 = 100 * e^(0.05 * 1) = $105.13. Because the market forward price ($108.00) exceeds $105.13, the forward is overpriced. An arbitrageur borrows $100 at 5% to buy the spot stock and sells the forward contract at $108. At T = 1, delivering the stock repays loan principal and interest of $105.13, pocketing $108.00 - $105.13 = $2.87 in pure riskless arbitrage profit."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Present the active recall arbitrage scenario",
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
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Prompt calculation of theoretical forward price $105.13",
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
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Reveal Cash-and-Carry execution and $2.87 profit capture",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Split Comparison (b33, b34, b35)
    {
      id: "s10",
      index: 10,
      title: "Forward vs. Futures Prices: When Do They Diverge?",
      purpose: "Compare theoretical pricing equivalence under deterministic rates vs daily settlement dynamics",
      takeaways: [
        "With constant interest rates, theoretical forward and futures prices are identical",
        "Daily mark-to-market introduces interest rate reinvestment effects",
        "Positive correlation with rates favors futures, negative correlation favors forwards"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "cmp-const-rate",
          heading: "Deterministic Rates",
          tone: "neutral",
          points: [
            "Interest rates are known or constant over contract lifespan",
            "Mark-to-market daily cash flows can be reinvested at deterministic rates",
            "Forward price F_0 and Futures price G_0 are mathematically identical",
            "Contract settlement timing differences have zero net financial consequence"
          ]
        },
        right: {
          id: "cmp-stoch-rate",
          heading: "Stochastic Rates",
          tone: "positive",
          points: [
            "Asset prices correlate with interest rate shifts across market cycles",
            "Positive correlation: futures daily profits earned when rates are high and reinvested favorably",
            "Daily margin gains reinvested at higher rates make futures price G_0 > forward price F_0",
            "Negative correlation makes forward contracts slightly more attractive than futures"
          ]
        },
        verdict: {
          id: "vrd-fwd-fut",
          text: "For short maturities (< 1 yr), price differences are negligible; for long horizons, correlation divergence matters."
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Pose the fundamental question: are forward and futures prices identical?",
          sourceFactIds: ["F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Demonstrate exact equality under deterministic interest rates",
          sourceFactIds: ["F03"],
          newTerms: ["deterministic rates"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Analyze daily settlement reinvestment and correlation divergence",
          sourceFactIds: ["F03"],
          newTerms: ["interest rate correlation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b36, b37, b38, b39, b40)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Forward Pricing",
      purpose: "Consolidate the core forward valuation frameworks before proceeding to Part 2",
      takeaways: [
        "No-arbitrage replication dictates exact pricing equality",
        "Cash-and-carry bounds enforce upper and lower price boundaries",
        "Dividends deduct present value I or continuous yield q from carry cost"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The Four Pillars of Forward Valuation",
        rules: [
          {
            id: "rul-1",
            title: "Replication over Prediction",
            text: "Forward prices reflect mechanical replication financing costs, not subjective expectations."
          },
          {
            id: "rul-2",
            title: "Investment vs. Consumption Bounds",
            text: "Two-sided equality holds strictly for investment assets; consumption assets enforce only an upper bound."
          },
          {
            id: "rul-3",
            title: "Non-Income Forward Formula",
            text: "The fundamental base formula is F_0 = S_0 * e^(r*T), growing spot at the continuous risk-free rate."
          },
          {
            id: "rul-4",
            title: "Cash-and-Carry Bounds",
            text: "Overpriced forwards trigger cash-and-carry (borrow, buy spot, short forward); underpriced trigger reverse carry."
          },
          {
            id: "rul-5",
            title: "Discrete Dividend Adjustment",
            text: "For assets with known cash dividends, deduct present value I: F_0 = (S_0 - I) * e^(r*T)."
          },
          {
            id: "rul-6",
            title: "Continuous Dividend Yield",
            text: "For equity indices, carrying cost becomes r - q: F_0 = S_0 * e^((r - q)*T)."
          },
          {
            id: "rul-7",
            title: "Mark-to-Market Valuation",
            text: "Initial long forward value f = 0 with K = F_0; subsequent value f = (F_0 - K) * e^(-r*T)."
          },
          {
            id: "rul-8",
            title: "Forward vs. Futures Convergence",
            text: "Identical under deterministic interest rates; daily margin correlation creates slight divergence for long maturities."
          }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Introduce the consolidation of the four structural pillars",
          sourceFactIds: ["F01", "F03", "F06", "F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Review Pillar One: The No-Arbitrage Principle",
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
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Review Pillar Two: Cash-and-Carry Arbitrage Bounds",
          sourceFactIds: ["F04", "F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Review Pillar Three: Dividend Adjustments",
          sourceFactIds: ["F06", "F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Review Pillar Four: Contract Value Evolution and preview Part 2",
          sourceFactIds: ["F08"],
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
if (!courseMap.chapters.some(c => c.chapterId === 'ch05' && c.partId === 'p1')) {
  courseMap.chapters.push({
    chapterId: "ch05",
    partId: "p1",
    title: "Determination of Forward and Futures Prices - Part 1",
    status: "in_progress"
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

const bookConfigPath = 'c:/code/openlectern/workspace/books/hull/book.config.json';
const bookConfig = JSON.parse(fs.readFileSync(bookConfigPath, 'utf8'));
let ch05 = bookConfig.chapters.find(c => c.id === 'ch05');
if (!ch05) {
  ch05 = {
    id: "ch05",
    number: 5,
    title: "Determination of Forward and Futures Prices"
  };
  bookConfig.chapters.push(ch05);
  fs.writeFileSync(bookConfigPath, JSON.stringify(bookConfig, null, 2));
}

console.log('Chapter 5 Part 1 successfully built and registered in course_map and book.config!');
