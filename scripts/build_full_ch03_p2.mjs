import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch03/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_03/Part_02/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_03/Part_02/script_hi.md', 'utf8');

const enBeats = {};
const hiBeats = {};

const enMatches = [...enScriptText.matchAll(/### Beat (b\d+)[\s\S]*?\*\*Instructor Narration:\*\*\s*\r?\n"([^"]+)"/g)];
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());

const hiBlocks = hiScriptText.split(/\*\s+\*\*`?(b\d+)`?\*\*/);
for (let i = 1; i < hiBlocks.length; i += 2) {
  const bId = hiBlocks[i];
  const block = hiBlocks[i + 1];
  const m = block.match(/\*Hindi Narration:\*\s*\"([^\"]+)\"/);
  if (m) {
    hiBeats[bId] = m[1].trim();
  }
}

for (let i = 1; i <= 40; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts!`);
  }
}

// 1. Facts with full numerical grounding
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch03",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Cross hedging occurs when the asset being hedged differs from the asset underlying the futures contract, requiring a hedge ratio that accounts for relative price volatility and correlation.",
      citation: { chapter: "3", section: "3.4", page: "60" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "The minimum variance hedge ratio is h* = rho * (sigma_S / sigma_F), where rho is correlation between delta S and delta F, sigma_S is standard deviation of delta S, and sigma_F is standard deviation of delta F.",
      citation: { chapter: "3", section: "3.4", page: "60" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "The optimal number of futures contracts is N* = h* * (Q_A / Q_F), where Q_A is the size of the position being hedged and Q_F is the size of one futures contract.",
      citation: { chapter: "3", section: "3.4", page: "61" }
    },
    {
      id: "F04",
      category: "numerical_example",
      statement: "An airline hedging 2,000,000 gallons of jet fuel using heating oil futures (42,000 gallons per contract) with sigma_S = 0.0263, sigma_F = 0.0313, and rho = 0.928 calculates h* = 0.7777, requiring N* = 37 contracts.",
      citation: { chapter: "3", section: "3.4", page: "61" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "To hedge an equity portfolio against overall market risk using stock index futures, the optimal number of contracts is N* = beta * (P / A), where P is portfolio value, A is futures contract value, and beta is portfolio market sensitivity.",
      citation: { chapter: "3", section: "3.5", page: "63" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "To change portfolio beta from beta to a target beta*, the required number of index futures contracts is N* = (beta - beta*) * (P / A).",
      citation: { chapter: "3", section: "3.5", page: "64" }
    },
    {
      id: "F07",
      category: "definition",
      statement: "Stack and roll involves rolling front-month futures contracts forward periodically to hedge long-dated exposures when long-dated contracts lack liquidity.",
      citation: { chapter: "3", section: "3.6", page: "68" }
    },
    {
      id: "F08",
      category: "case_study",
      statement: "In 1993, German conglomerate Metallgesellschaft lost $1.33 billion when its US subsidiary hedged 160 million barrels of long-term customer commitments using stacked short-term futures that suffered massive margin calls as oil shifted into contango.",
      citation: { chapter: "3", section: "Snapshot 3.2", page: "69" }
    },
    {
      id: "F09",
      category: "numerical_example",
      statement: "In a quiz scenario, an asset with sigma_S = 0.04, sigma_F = 0.05, and rho = 0.80 yields a minimum variance hedge ratio of h* = 0.80 * (0.04 / 0.05) = 0.64.",
      citation: { chapter: "3", section: "3.4", page: "60" }
    }
  ],
  realWorldProblem: {
    actors: "Corporate treasurers, airline risk managers, and equity portfolio managers",
    situation: "Managing exposure to assets lacking direct futures contracts, requiring imperfect cross hedges and long-dated rollover strategies",
    failure: "Mismatched hedge ratios or severe margin roll friction trigger billions in liquidity insolvency",
    invention: "Minimum variance hedge ratios, beta hedging formulas, and stack-and-roll protocols",
    factIds: ["F01", "F02", "F03", "F04", "F08"]
  },
  dependencies: {
    earlier: ["ch03-p1"],
    later: ["ch04-p1"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');

// 2. Lesson plan
const lessonPlan = {
  outcomes: [
    "Derive and apply the minimum variance hedge ratio formula h* = rho * (sigma_S / sigma_F)",
    "Calculate optimal contracts for cross hedges using N* = h* * (Q_A / Q_F)",
    "Hedging equity portfolios and adjusting beta using stock index futures",
    "Analyze the liquidity and rollover mechanics of stack and roll, evaluating the Metallgesellschaft case study"
  ],
  coreConcepts: [
    {
      conceptId: "K06",
      term: "cross hedging",
      stages: {
        intuition: { sceneIndex: 0, note: "When no exact futures contract exists for the physical asset" },
        why: { sceneIndex: 1, note: "Variance minimization requires scaling by volatility ratio and correlation" },
        what: { sceneIndex: 1, note: "Minimum variance hedge ratio formula" },
        how: { sceneIndex: 2, note: "Airline jet fuel hedge worked calculation" },
        workedExample: { sceneIndex: 2, note: "Calculation of 37 heating oil contracts" },
        guided: { sceneIndex: 5, note: "Tactical beta adjustment using stock index futures" },
        independent: { sceneIndex: 9, note: "Calculate hedge ratio in the quiz" },
        limitations: { sceneIndex: 8, note: "Metallgesellschaft $1.33B stack and roll disaster" }
      }
    }
  ],
  misconception: {
    myth: "A hedge ratio should always be one-to-one (100% of physical volume)",
    reality: "The optimal hedge ratio balances relative asset volatilities and correlation to minimize variance",
    factIds: ["F01", "F02"],
    sceneIndex: 3
  },
  predictionQuestions: [
    {
      question: "If jet fuel is more volatile than heating oil, will the hedge ratio exceed the correlation coefficient?",
      sceneIndex: 1,
      revealBeat: "s01b3"
    }
  ],
  causalChain: {
    condition: "Airline needs 2M gallons jet fuel; no jet fuel futures exist",
    action: "Treasury calculates h* = 0.7777 and shorts 37 heating oil contracts",
    mechanism: "Heating oil futures cash flows correlate at 0.928 with jet fuel cost spikes",
    result: "Fuel cost volatility is compressed by the correlation squared (R2 = 86%)",
    consequence: "Airline locks in predictable operating margins and protects operating solvency",
    factIds: ["F02", "F03", "F04"],
    sceneIndex: 5
  },
  sceneOutline: [
    { index: 0, purpose: "Problem-first hook", concepts: ["cross hedging"], factIds: ["F01"] },
    { index: 1, purpose: "Minimum variance hedge ratio formula", concepts: ["cross hedging"], factIds: ["F02"] },
    { index: 2, purpose: "Airline worked example", concepts: ["cross hedging"], factIds: ["F03", "F04"] },
    { index: 3, purpose: "Tailing the hedge and marking to market", concepts: ["cross hedging"], factIds: ["F01", "F03"] },
    { index: 4, purpose: "Stock index futures formula", concepts: ["beta hedging"], factIds: ["F05"] },
    { index: 5, purpose: "Tactical beta adjustment causal chain", concepts: ["beta hedging"], factIds: ["F06"] },
    { index: 6, purpose: "Individual equity hedging progressive cards", concepts: ["beta hedging"], factIds: ["F05"] },
    { index: 7, purpose: "Stack and roll vs strip hedge table compare", concepts: ["stack and roll"], factIds: ["F07"] },
    { index: 8, purpose: "Metallgesellschaft stat counter", concepts: ["stack and roll"], factIds: ["F08"] },
    { index: 9, purpose: "Interactive quiz", concepts: ["cross hedging"], factIds: ["F02", "F09"] },
    { index: 10, purpose: "Synthesis: Liquidity risk vs basis risk", concepts: ["cross hedging", "stack and roll"], factIds: ["F01", "F07"] },
    { index: 11, purpose: "Eight rules summary thread", concepts: ["cross hedging", "beta hedging", "stack and roll"], factIds: ["F01", "F02", "F03", "F05", "F06", "F07", "F08"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '04_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');

// 3. Assemble full 41-beat episode
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch03",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 3",
  partLabel: "Part 2",
  title: "Cross Hedging, Minimum Variance, Beta Hedging & Metallgesellschaft",
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
    // Scene 0: Chat story (4 beats)
    {
      id: "s00",
      index: 0,
      title: "Beyond Identical Assets: The Cross-Hedging Dilemma",
      purpose: "Problem-first hook: why airlines and treasurers must hedge with non-identical contracts",
      takeaways: [
        "Cross hedging applies when no direct futures contract exists for the underlying",
        "A one-to-one hedge ratio fails when asset volatilities diverge",
        "The minimum variance hedge ratio optimizes risk reduction"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "What happens when a company needs to hedge a commercial asset, like jet fuel, that has no actively traded futures contract on any exchange?" },
          { id: "m2", speaker: "mentor", text: "In the real world, corporations rarely find perfectly matching futures contracts. They must execute a Cross Hedge using a related, highly correlated asset." },
          { id: "m3", speaker: "mentor", text: "However, simply hedging one-to-one is dangerous. Because price volatilities differ, a naïve hedge can actually increase portfolio risk rather than reduce it." },
          { id: "m4", speaker: "mentor", text: "In Section 3.4, John Hull introduces the Minimum Variance Hedge Ratio, mathematically calibrating contract volume to minimize cash flow variance." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Basic Principles", "Basis Risk", "Cross Hedging (Part 2)", "Beta Hedging", "Stack & Roll"],
          current: 2
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "What happens when a company needs to hedge a commercial commodity, like jet fuel, that has no actively traded futures contract on any global exchange? Can hedging still work?" },
            hi: { display: "अगर किसी कंपनी को जेट फ्यूल जैसी कमोडिटी को हेज करना हो जिसका कोई डायरेक्ट फ्यूचर्स कॉन्ट्रैक्ट एक्सचेंज पर ट्रेड ही नहीं होता, तो कंपनी क्या करेगी? क्या हेजिंग तब भी मुमकिन है?" }
          },
          onScreenIntent: "Opening dilemma question on cross hedging without direct contracts",
          sourceFactIds: ["F01"],
          newTerms: ["cross hedging"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "The mentor defines the cross hedging imperative",
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
          onScreenIntent: "Dangers of naive one-to-one hedging across differing volatilities",
          sourceFactIds: ["F01", "F02"],
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
          onScreenIntent: "Introduction of the Minimum Variance Hedge Ratio formula",
          sourceFactIds: ["F02"],
          newTerms: ["hedge ratio"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3", "m4"] },
          visualCues: []
        }
      ]
    },

    // Scene 1: Formula Breakdown (4 beats: b04, b05, b06, b07)
    {
      id: "s01",
      index: 1,
      title: "The Minimum Variance Hedge Ratio Formula",
      purpose: "Mathematical breakdown of h* = rho * (sigma_S / sigma_F)",
      takeaways: [
        "h* equals the slope coefficient of delta S regressed on delta F",
        "rho measures correlation; sigma ratio scales relative volatilities",
        "Optimal contracts N* equals h* * (Q_A / Q_F)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Minimum Variance Hedge Ratio",
        formula: {
          latex: "h^* = \\rho \\frac{\\sigma_S}{\\sigma_F}",
          expression: "rho * (sigma_S / sigma_F)",
          solvesFor: "h^*",
          variables: [
            { symbol: "h^*", latex: "h^*", meaning: "Minimum Variance Hedge Ratio", unit: "ratio" },
            { symbol: "rho", latex: "\\rho", meaning: "Correlation Coefficient between delta S and delta F", unit: "dimensionless" },
            { symbol: "sigma_S", latex: "\\sigma_S", meaning: "Standard Deviation of delta S", unit: "dollars" },
            { symbol: "sigma_F", latex: "\\sigma_F", meaning: "Standard Deviation of delta F", unit: "dollars" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "h^*", meaning: "Optimal hedge ratio minimizing variance", unit: "dimensionless" },
          { id: "p2", symbolLatex: "\\rho", meaning: "Correlation between spot and futures changes", unit: "[-1, 1]" },
          { id: "p3", symbolLatex: "\\sigma_S", meaning: "Historical volatility of physical asset", unit: "USD/unit" },
          { id: "p4", symbolLatex: "\\sigma_F", meaning: "Historical volatility of futures contract", unit: "USD/unit" }
        ],
        note: "Hedge Effectiveness = R^2 = rho^2"
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Formula definition and mathematical derivation overview",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1"] },
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Explaining correlation rho and standard deviation ratio",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2"] },
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Regression interpretation: slope coefficient of OLS fit",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2", "p3"] },
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Hedge effectiveness formula R2 = rho squared",
          sourceFactIds: ["F02", "F03"],
          newTerms: ["hedge effectiveness"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2", "p3", "p4"] },
          visualCues: []
        }
      ]
    },

    // Scene 2: Worked Example (3 beats: b08, b09, b10)
    {
      id: "s02",
      index: 2,
      title: "Worked Example: The Airline Jet Fuel Hedge",
      purpose: "Numerical calculation of optimal contracts for airline hedging jet fuel with heating oil",
      takeaways: [
        "h* = 0.928 * (0.0263 / 0.0313) = 0.7777",
        "Total contracts N* = 0.7777 * (2,000,000 / 42,000) = 37.03",
        "Rounding to 37 contracts achieves maximum variance reduction"
      ],
      pedagogicalContinuation: false,
      template: "worked_example",
      data: {
        title: "Airline Jet Fuel Cross Hedge",
        formula: {
          latex: "N^* = h^* \\frac{Q_A}{Q_F}",
          expression: "h * (Q_A / Q_F)",
          solvesFor: "N^*",
          variables: [
            { symbol: "N^*", latex: "N^*", meaning: "Optimal Number of Contracts", unit: "contracts" },
            { symbol: "h", latex: "h^*", meaning: "Hedge Ratio", unit: "ratio" },
            { symbol: "Q_A", latex: "Q_A", meaning: "Position Size to Hedge", unit: "gallons" },
            { symbol: "Q_F", latex: "Q_F", meaning: "Futures Contract Size", unit: "gallons" }
          ]
        },
        given: [
          { id: "g1", label: "Fuel Volume (Q_A)", value: 2000000, unit: "gallons", display: "2,000,000 gal" },
          { id: "g2", label: "Contract Size (Q_F)", value: 42000, unit: "gallons", display: "42,000 gal" },
          { id: "g3", label: "Correlation (rho)", value: 0.928, unit: "dimensionless", display: "0.928" },
          { id: "g4", label: "Vol Ratio (sigma_S / sigma_F)", value: 0.8402, unit: "ratio", display: "0.0263 / 0.0313" }
        ],
        steps: [
          { id: "st1", label: "Hedge Ratio h*", latex: "0.928 \\times \\frac{0.0263}{0.0313} = 0.7777", value: 0.7777 },
          { id: "st2", label: "Unrounded Contracts", latex: "0.7777 \\times \\frac{2{,}000{,}000}{42{,}000} = 37.03", value: 37.03 }
        ],
        result: {
          id: "res",
          label: "Optimal Contracts",
          value: 37,
          unit: "contracts",
          display: "37 Contracts",
          rounding: 0
        },
        conclusion: "The airline purchases 37 heating oil futures contracts, neutralizing 86% of jet fuel price variance.",
        isHypothetical: false
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Givens setup: 2M gallons jet fuel, 42k contract size, volatilities",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["g1", "g2", "g3", "g4"] },
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Step 1: Calculate h* = 0.7777",
          sourceFactIds: ["F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["g1", "g2", "g3", "g4", "st1"] },
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Step 2: Calculate N* = 37.03, rounded to 37 contracts",
          sourceFactIds: ["F03", "F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["g1", "g2", "g3", "g4", "st1", "st2", "res"] },
          visualCues: []
        }
      ]
    },

    // Scene 3: Tug of War (3 beats: b11, b12, b13)
    {
      id: "s03",
      index: 3,
      title: "Marking-to-Market Friction & Tailing the Hedge",
      purpose: "Contrasting forward contract theoretical hedging with daily futures margin settlement",
      takeaways: [
        "Daily marking to market generates daily interest cash flows",
        "Tailing the hedge scales down contract size by discounting spot value",
        "Standard practice adjusts N* by multiplying by S / F"
      ],
      pedagogicalContinuation: false,
      template: "tug_of_war",
      data: {
        left: {
          id: "theoretical_forward",
          label: "Theoretical Forward Hedge",
          points: [
            "Single cash settlement at terminal maturity",
            "No daily cash inflows or outflows",
            "Formula N* assumes unadjusted terminal payoff"
          ]
        },
        right: {
          id: "daily_futures_margin",
          label: "Daily Futures Margin Reality",
          points: [
            "Daily settlement generates interest reinvestment risk",
            "Positive margin gains earn interest; losses incur debt",
            "Tailing adjustment discounts contract count by S / F"
          ]
        },
        resolution: {
          id: "tailing_resolution",
          label: "Tailing Adjustment",
          text: "Multiply contract count by Spot / Futures price ratio to neutralize reinvestment drag."
        }
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Forward contracts versus daily marking to market contrast",
          sourceFactIds: ["F01"],
          newTerms: ["tailing the hedge"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["theoretical_forward"] },
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Daily interest drag and reinvestment friction",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["theoretical_forward", "daily_futures_margin"] },
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Tailing formula resolution: N* = h* * (V_A / V_F)",
          sourceFactIds: ["F01", "F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["theoretical_forward", "daily_futures_margin", "tailing_resolution"] },
          visualCues: []
        }
      ]
    },

    // Scene 4: Formula Breakdown (4 beats: b14, b15, b16, b17)
    {
      id: "s04",
      index: 4,
      title: "Stock Index Futures: Neutralizing Market Exposure",
      purpose: "Mathematical derivation of portfolio beta hedging using index futures",
      takeaways: [
        "Stock index futures hedge systematic market risk while preserving stock picking alpha",
        "Optimal contracts formula is N* = beta * (P / A)",
        "Contract value A equals futures price times index multiplier"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Stock Index Beta Hedge",
        formula: {
          latex: "N^* = \\beta \\frac{P}{A}",
          expression: "beta * (P / A)",
          solvesFor: "N^*",
          variables: [
            { symbol: "N^*", latex: "N^*", meaning: "Number of Index Contracts", unit: "contracts" },
            { symbol: "beta", latex: "\\beta", meaning: "Portfolio Market Beta", unit: "dimensionless" },
            { symbol: "P", latex: "P", meaning: "Current Portfolio Value", unit: "USD" },
            { symbol: "A", latex: "A", meaning: "Futures Contract Value (Price x Multiplier)", unit: "USD" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "N^*", meaning: "Number of index contracts to short", unit: "contracts" },
          { id: "p2", symbolLatex: "\\beta", meaning: "Portfolio systematic sensitivity to market index", unit: "dimensionless" },
          { id: "p3", symbolLatex: "P", meaning: "Current dollar value of equity portfolio", unit: "USD" },
          { id: "p4", symbolLatex: "A", meaning: "Dollar size of one index futures contract", unit: "USD" }
        ],
        note: "Shorting N* contracts converts portfolio beta to zero (risk-free yield)"
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Introduction to equity index hedging and portfolio risk breakdown",
          sourceFactIds: ["F05"],
          newTerms: ["beta hedging"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1"] },
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Deconstructing systematic risk versus specific company alpha",
          sourceFactIds: ["F05"],
          newTerms: ["systematic risk"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2"] },
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Formula N* = beta * (P / A) derivation",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2", "p3"] },
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Contract value A = Index Price x Multiplier (e.g. S&P 500 x 250)",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2", "p3", "p4"] },
          visualCues: []
        }
      ]
    },

    // Scene 5: Causal Chain (3 beats: b18, b19, b20)
    {
      id: "s05",
      index: 5,
      title: "Tactical Beta Adjustment: Changing Market Sensitivity",
      purpose: "Step-by-step mechanism for adjusting portfolio beta without liquidating underlying stocks",
      takeaways: [
        "Managers can adjust portfolio beta to a target beta* using N* = (beta - beta*) * (P / A)",
        "Lowering beta requires shorting futures; raising beta requires going long futures",
        "Eliminates capital gains taxation and massive transaction brokerage fees"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        links: [
          { id: "l1", role: "condition", text: "Manager anticipates market correction but loves stock holdings" },
          { id: "l2", role: "action", text: "Calculates N* = (beta - beta*) * (P / A) and shorts index contracts" },
          { id: "l3", role: "mechanism", text: "Market drop produces futures cash gains offsetting equity losses" },
          { id: "l4", role: "result", text: "Portfolio beta is synthetically reduced without selling a single share" },
          { id: "l5", role: "consequence", text: "Saves millions in capital gains taxes and trading commissions" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "The dilemma: why managers avoid selling high-conviction stocks",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["l1", "l2"] },
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "The formula N* = (beta - beta*) * (P / A) mechanism",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["l1", "l2", "l3"] },
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Synthetic beta adjustment advantages: zero tax, zero slippage",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["l1", "l2", "l3", "l4", "l5"] },
          visualCues: []
        }
      ]
    },

    // Scene 6: Progressive Cards (3 beats: b21, b22, b23)
    {
      id: "s06",
      index: 6,
      title: "Hedging Individual Equities & Market Risk",
      purpose: "Analyzing how index futures insulate individual high-conviction stock bets",
      takeaways: [
        "CAPM divides risk into systematic market risk and unsystematic specific risk",
        "Shorting beta-weighted index futures strips away broad market volatility",
        "The hedged position captures pure idiosyncratic company outperformance"
      ],
      pedagogicalContinuation: false,
      template: "progressive_cards",
      data: {
        cards: [
          { id: "c1", title: "Pillar 1: Risk Decomposition", body: "Total risk equals systematic market risk plus unsystematic company specific risk." },
          { id: "c2", title: "Pillar 2: Market Risk Stripping", body: "Shorting index futures neutralizes market swings, leaving only idiosyncratic alpha." },
          { id: "c3", title: "Pillar 3: Alpha Isolation", body: "If the chosen stock outperforms its beta expectation, the investor profits regardless of market direction." }
        ]
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Card 1: Risk decomposition into systematic and unsystematic",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1"] },
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Card 2: Stripping broad market swings with index futures",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2"] },
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Card 3: Pure alpha isolation across bull or bear markets",
          sourceFactIds: ["F05"],
          newTerms: ["alpha isolation"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2", "c3"] },
          visualCues: []
        }
      ]
    },

    // Scene 7: Table Compare (3 beats: b24, b25, b26)
    {
      id: "s07",
      index: 7,
      title: "Stack and Roll: Rolling Front-Month Contracts",
      purpose: "Comparative matrix of Stack-and-Roll versus Strip Hedging for long-dated exposures",
      takeaways: [
        "Stack-and-roll rolls liquid front-month contracts to hedge long-dated liabilities",
        "Strip hedging buys multiple contract maturities matching future dates",
        "Stack-and-roll creates rollover basis risk and severe cash margin timing mismatches"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        columns: ["Strategy", "Execution Method", "Liquidity Profile", "Primary Risk Exposure"],
        rows: [
          { id: "r_stack", cells: ["Stack and Roll", "Short-term contracts rolled forward periodically", "High liquidity in front months", "Roll risk & margin cash drain"] },
          { id: "r_strip", cells: ["Strip Hedge", "Series of contracts matching each delivery date", "Low liquidity in distant months", "Higher bid-ask spreads & illiquidity"] }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Stack and roll strategy row highlighted",
          sourceFactIds: ["F07"],
          newTerms: ["stack and roll"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r_stack"] },
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Strip hedge strategy row highlighted",
          sourceFactIds: ["F07"],
          newTerms: ["strip hedge"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r_strip"] },
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Comparative summary matrix: liquidity versus rollover risk",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r_stack", "r_strip"] },
          visualCues: []
        }
      ]
    },

    // Scene 8: Stat Counter (4 beats: b27, b28, b29, b30)
    {
      id: "s08",
      index: 8,
      title: "Case Study: Metallgesellschaft's $1.33B Disaster",
      purpose: "Historical post-mortem of how stack-and-roll triggered liquidity insolvency",
      takeaways: [
        "MG sold 160M barrels of 10-year fixed price oil guarantees",
        "Hedged using stacked front-month futures contracts",
        "Oil shifted from backwardation into contango, triggering $1.33B in margin calls"
      ],
      pedagogicalContinuation: false,
      template: "stat_counter",
      data: {
        stats: [
          { id: "st_loss", value: 1.33, prefix: "$", suffix: "B", decimals: 2, label: "Total Realized Loss", sublabel: "Cash margin insolvency liquidation" },
          { id: "st_volume", value: 160, suffix: "M bbl", label: "Fixed Price Volume", sublabel: "10-year customer delivery commitments" },
          { id: "st_mismatch", value: 10, suffix: " Years", label: "Maturity Mismatch", sublabel: "10-year physical vs 1-month futures" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Metallgesellschaft initial setup: 160M barrels guaranteed",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["st_volume"] },
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "The maturity mismatch: 10-year contracts hedged with 1-month futures",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["st_volume", "st_mismatch"] },
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Market shifts into contango; rollover losses trigger catastrophic margin calls",
          sourceFactIds: ["F08"],
          newTerms: ["contango", "backwardation"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["st_volume", "st_mismatch", "st_loss"] },
          visualCues: []
        },
        {
          id: "s08b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "The $1.33B final liquidation: lesson on cash flow timing versus accounting hedge",
          sourceFactIds: ["F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["st_volume", "st_mismatch", "st_loss"] },
          visualCues: []
        }
      ]
    },

    // Scene 9: Interactive Quiz (3 beats: b31, b32, b33)
    {
      id: "s09",
      index: 9,
      title: "Active Recall: Calculating the Hedge Ratio",
      purpose: "Check student mastery of minimum variance hedge ratio calculation",
      takeaways: [
        "h* = rho * (sigma_S / sigma_F) = 0.80 * (0.04 / 0.05) = 0.64",
        "Optimal hedge ratio reflects both correlation and relative volatility",
        "Naive 1.0 hedge ratio would severely over-hedge the physical asset"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "An asset has daily spot volatility of 0.04, the futures contract has daily volatility of 0.05, and correlation is 0.80. What is the minimum variance hedge ratio h*?",
        options: [
          "A) 0.50",
          "B) 0.64",
          "C) 0.80",
          "D) 1.00"
        ],
        correctIndex: 1,
        explanation: "h* = rho * (sigma_S / sigma_F) = 0.80 * (0.04 / 0.05) = 0.80 * 0.80 = 0.64. Option B is correct."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Quiz question presented with sigma_S = 0.04, sigma_F = 0.05, rho = 0.80",
          sourceFactIds: ["F02", "F09"],
          newTerms: [],
          pauseAfterMs: 3200,
          transition: false,
          visual: { show: [] },
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Thinking interval and formula reminder",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: [] },
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Reveal Option B (0.64) with complete mathematical walkthrough",
          sourceFactIds: ["F02", "F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: [] },
          visualCues: []
        }
      ]
    },

    // Scene 10: Chat Story / Bridge (2 beats: b34, b35)
    {
      id: "s10",
      index: 10,
      title: "Where We Are: Liquidity vs. Basis Risk",
      purpose: "Synthesize quantitative hedging lessons and bridge to Chapter 4 Interest Rates",
      takeaways: [
        "Effective hedging balances basis risk against liquidity and cash flow constraints",
        "Short-term contracts provide liquidity but demand disciplined margin reserves",
        "Chapter 4 introduces interest rates, yield curves, and bond duration"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m10_1", speaker: "mentor", text: "The lesson of quantitative hedging is clear: eliminating price risk always introduces basis risk or liquidity risk." },
          { id: "m10_2", speaker: "mentor", text: "In Chapter 4, we move from commodities and equities to Interest Rates: zero rates, forward rates, and bond yield curves." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Chapter 3 Part 1 (Basic Principles)", "Chapter 3 Part 2 (Cross & Beta Hedging)", "Chapter 4 (Interest Rates)", "Chapter 5 (Determination of Forward Prices)", "Chapter 6 (Interest Rate Futures)"],
          current: 1
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Core pedagogical synthesis: managing basis risk versus liquidity risk",
          sourceFactIds: ["F01", "F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m10_1"] },
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Roadmap milestone marker and intellectual bridge to Chapter 4",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m10_1", "m10_2"] },
          visualCues: []
        }
      ]
    },

    // Scene 11: Summary Thread (6 beats: b36, b37, b38, b39, b40, b41)
    {
      id: "s11",
      index: 11,
      title: "Eight Rules to Remember",
      purpose: "Institutional rules codifying cross hedging, beta adjustments, and roll risk",
      takeaways: [
        "h* = rho * (sigma_S / sigma_F) minimizes variance for cross hedges",
        "Beta hedging insulates equity portfolios using N* = (beta - beta*) * (P / A)",
        "Stack-and-roll requires massive cash liquidity buffers against contango margin calls"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Quantitative Hedging in 8 Rules",
        rules: [
          { id: "r1", title: "Cross hedging definition", text: "Cross hedging applies when the physical asset differs from the futures contract underlying." },
          { id: "r2", title: "Minimum variance formula", text: "Optimal hedge ratio h* = rho * (sigma_S / sigma_F) scales by correlation and relative volatility." },
          { id: "r3", title: "Optimal contract sizing", text: "Total contracts N* = h* * (Q_A / Q_F) calculates exact volume needed to minimize portfolio variance." },
          { id: "r4", title: "Hedge effectiveness", text: "Hedge effectiveness equals R^2 = rho^2, quantifying the percentage of price risk eliminated." },
          { id: "r5", title: "Tailing the hedge", text: "Tailing adjusts contract count for daily marking-to-market interest drag by multiplying by S / F." },
          { id: "r6", title: "Portfolio beta hedging", text: "Stock index futures eliminate market risk with N* = beta * (P / A), preserving individual stock alpha." },
          { id: "r7", title: "Tactical beta adjustment", text: "Target beta* is achieved without liquidating stocks using N* = (beta - beta*) * (P / A)." },
          { id: "r8", title: "Stack and roll liquidity discipline", text: "Rolling short-dated futures requires ample credit lines to withstand contango margin calls." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Overview of the 8 quantitative hedging rules",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: [], range: [0, 0] },
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Rules 1 and 2 highlighted: Cross hedge definition & h* formula",
          sourceFactIds: ["F01", "F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r1", "r2"], range: [1, 2] },
          visualCues: []
        },
        {
          id: "s11b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Rules 3 and 4 highlighted: Contract count N* & R2 effectiveness",
          sourceFactIds: ["F02", "F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r3", "r4"], range: [3, 4] },
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Rules 5 and 6 highlighted: Tailing adjustment & beta hedging",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r5", "r6"], range: [5, 6] },
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Rules 7 and 8 highlighted: Tactical beta shift & stack and roll discipline",
          sourceFactIds: ["F06", "F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r7", "r8"], range: [7, 8], focus: "r8" },
          visualCues: []
        },
        {
          id: "s11b6",
          speaker: "mentor",
          narration: {
            en: { display: "Master these eight quantitative principles to navigate real-world derivatives risk with complete institutional rigor. You are now prepared for Chapter 4." },
            hi: { display: "इन आठ नियमों को अच्छी तरह समझकर आप रियल-वर्ल्ड डेरिवेटिव्स रिस्क को पूरी सूझबूझ के साथ मैनेज कर सकते हैं। अब आप चैप्टर 4 के लिए तैयार हैं।" }
          },
          onScreenIntent: "Compact final summary overview of all 8 rules",
          sourceFactIds: [],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"], range: [1, 8], compact: true },
          visualCues: []
        }
      ]
    }
  ]
};

// 4. Generate 05_teaching_script.json
const scriptJson = {
  languages: ["en", "hi"],
  scenes: episode.scenes.map(s => ({
    index: s.index,
    title: s.title,
    purpose: s.purpose,
    beats: s.beats.map(b => ({
      id: b.id,
      speaker: b.speaker,
      narration: b.narration,
      onScreenIntent: b.onScreenIntent,
      sourceFactIds: b.sourceFactIds,
      newTerms: b.newTerms,
      pauseAfterMs: b.pauseAfterMs,
      transition: b.transition
    }))
  }))
};
fs.writeFileSync(path.join(targetDir, '05_teaching_script.json'), JSON.stringify(scriptJson, null, 2), 'utf8');

// 5. Generate 05_teaching_script.md
let md = `# Cross Hedging, Beta Hedging & Metallgesellschaft\n\n`;
for (const s of scriptJson.scenes) {
  md += `## Scene ${s.index}: ${s.title}\n\n_${s.purpose}_\n\n`;
  for (const b of s.beats) {
    md += `**${b.id}** (${b.speaker}; facts ${b.sourceFactIds.join(', ') || 'none'})\n\n`;
    md += `- en: ${b.narration.en.display}\n`;
    md += `- hi: ${b.narration.hi.display}\n`;
    md += `- on screen: ${b.onScreenIntent}\n\n`;
  }
}
fs.writeFileSync(path.join(targetDir, '05_teaching_script.md'), md, 'utf8');

// 6. Generate 06_visual_brief.json
const visualBrief = {
  scenes: [
    { index: 0, topology: "hook", visualIntent: "Problem-first hook: cross hedging without direct contracts", keyElements: ["Opening question", "Related asset cross hedge", "Volatility divergence hazard", "Minimum variance solution"], factIds: ["F01"] },
    { index: 1, topology: "formula", visualIntent: "Deconstruct h* = rho * (sigma_S / sigma_F)", keyElements: ["Formula h*", "Correlation rho", "Volatility ratio", "Hedge effectiveness R2"], factIds: ["F02"] },
    { index: 2, topology: "worked_example", visualIntent: "Worked example of airline jet fuel hedge", keyElements: ["Givens: 2M gallons, 42k contract, 0.928 rho", "h* = 0.7777", "N* = 37 contracts"], factIds: ["F04"] },
    { index: 3, topology: "tension", visualIntent: "Marking to market drag and tailing the hedge", keyElements: ["Theoretical forward hedge", "Daily futures margin reality", "Tailing adjustment S / F"], factIds: ["F01"] },
    { index: 4, topology: "formula", visualIntent: "Stock index beta hedge formula N* = beta * (P / A)", keyElements: ["Formula N*", "Portfolio beta", "Portfolio value P", "Contract value A"], factIds: ["F05"] },
    { index: 5, topology: "process", visualIntent: "Tactical beta adjustment causal chain", keyElements: ["High conviction stocks", "N* = (beta - beta*) * (P / A)", "Zero tax synthetic shift", "Capital preservation"], factIds: ["F06"] },
    { index: 6, topology: "pillars", visualIntent: "Individual equity risk stripping progressive cards", keyElements: ["Risk decomposition", "Market risk stripping", "Alpha isolation"], factIds: ["F05"] },
    { index: 7, topology: "comparison", visualIntent: "Stack and roll vs strip hedge matrix", keyElements: ["Stack and roll", "Strip hedge", "Rollover margin risk"], factIds: ["F07"] },
    { index: 8, topology: "quantity_over_time", visualIntent: "Metallgesellschaft $1.33B case study stat counter", keyElements: ["$1.33B loss", "160M barrels", "10-year maturity mismatch"], factIds: ["F08"] },
    { index: 9, topology: "quiz", visualIntent: "Active recall quiz on calculating h*", keyElements: ["sigma_S = 0.04, sigma_F = 0.05, rho = 0.80", "Thinking countdown", "Option B (0.64) reveal"], factIds: ["F02", "F09"] },
    { index: 10, topology: "hook", visualIntent: "Synthesis: Liquidity vs basis risk and bridge to Chapter 4", keyElements: ["Basis vs liquidity trade-off", "Where we are roadmap", "Chapter 4 interest rates preview"], factIds: ["F01", "F07"] },
    { index: 11, topology: "pillars", visualIntent: "Eight quantitative hedging rules", keyElements: ["Rule 1-2: Cross hedge & h*", "Rule 3-4: N* & R2", "Rule 5-6: Tailing & Beta hedge", "Rule 7-8: Tactical beta & Stack and roll", "Compact 2-column final summary"], factIds: ["F01", "F02", "F03", "F05", "F06", "F07", "F08"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '06_visual_brief.json'), JSON.stringify(visualBrief, null, 2), 'utf8');

// 7. Generate 07_storyboard.json
const storyboard = {
  scenes: episode.scenes.map(s => ({
    index: s.index,
    template: s.template,
    justification: `${s.title}: ${s.purpose}`,
    pedagogicalContinuation: s.pedagogicalContinuation,
    beats: s.beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
  }))
};
fs.writeFileSync(path.join(targetDir, '07_storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');

// 8. Generate 08_episode.json
fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2), 'utf8');

console.log('Successfully generated full collegiate 41-beat episode for Chapter 3 Part 2!');
console.log('Scenes count:', episode.scenes.length);
console.log('Total beats:', episode.scenes.reduce((acc, sc) => acc + sc.beats.length, 0));
