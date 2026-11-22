import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch03/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_03/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_03/Part_01/script_hi.md', 'utf8');

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

// Ensure all 40 beats exist
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
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "definition",
      statement: "Corporate hedging is deployed to neutralize commercial price risk and minimize cash flow variance rather than seek speculative trading profits.",
      citation: { chapter: "3", section: "3.1", page: "49" }
    },
    {
      id: "F02",
      category: "numerical_example",
      statement: "An oil producer hedging 1,000,000 barrels at $79 August NYMEX futures locks in $79M net proceeds even if spot crashes from $80 to $75 ($75M physical + $4M futures gain).",
      citation: { chapter: "3", section: "3.1", page: "50" }
    },
    {
      id: "F03",
      category: "numerical_example",
      statement: "A copper fabricator needing 100,000 lbs buys 4 May COMEX contracts at 320 cents per pound, locking net outlay at $320,000 even if spot rises to 325 cents ($325,000 physical - $5,000 futures gain).",
      citation: { chapter: "3", section: "3.1", page: "51" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Basis is defined as Spot Price of asset to be hedged minus Futures Price of contract used: b = S - F.",
      citation: { chapter: "3", section: "3.3", page: "53" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "The net price realized for a short hedger is F1 + b2, where F1 is initial futures price and b2 is terminal basis at closeout.",
      citation: { chapter: "3", section: "3.3", page: "54" }
    },
    {
      id: "F06",
      category: "rule",
      statement: "Strengthening of the basis increases net proceeds for a short hedger; weakening of the basis reduces net acquisition costs for a long hedger.",
      citation: { chapter: "3", section: "3.3", page: "55" }
    },
    {
      id: "F07",
      category: "rule",
      statement: "Hedgers must select a delivery month as close as possible to, but strictly later than, the anticipated hedge expiration to avoid delivery month illiquidity.",
      citation: { chapter: "3", section: "3.3", page: "58" }
    },
    {
      id: "F08",
      category: "claim",
      statement: "While CAPM asserts shareholders can diversify away commodity risks, real-world distress costs, credit ratings, and debt covenants justify corporate hedging.",
      citation: { chapter: "3", section: "3.2", page: "52" }
    },
    {
      id: "F09",
      category: "case_study",
      statement: "North American gold producers like American Barrick hedged aggressively in bear markets but severely lagged during the 2000s gold bull market due to isolated mark-to-market losses.",
      citation: { chapter: "3", section: "Snapshot 3.1", page: "52" }
    },
    {
      id: "F10",
      category: "numerical_example",
      statement: "In a quiz scenario, an oil producer shorts futures at $90. At closeout, spot is $85 and futures is $87, resulting in a basis of -$2 ($85 - $87) and net price realized of $88 ($90 + (-$2)).",
      citation: { chapter: "3", section: "3.3", page: "54" }
    },
    {
      id: "F11",
      category: "rule",
      statement: "COMEX copper contracts are 25,000 lbs each, so 4 contracts cover exactly 100,000 lbs of physical copper.",
      citation: { chapter: "3", section: "3.1", page: "51" }
    }
  ],
  realWorldProblem: {
    actors: "Crude oil producers and copper manufacturing fabricators",
    situation: "Holding unhedged inventory or future production facing volatile spot commodity crashes",
    failure: "Severe spot market downturns produce catastrophic cash flow deficits and corporate bankruptcy",
    invention: "Short and long futures contracts creating offsetting financial gains to lock in deterministic revenue",
    factIds: ["F01", "F02", "F03"]
  },
  dependencies: {
    earlier: [],
    later: ["ch03-p2"]
  }
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');

// 2. Lesson plan
const lessonPlan = {
  outcomes: [
    "Differentiate corporate hedging from speculative financial trading",
    "Construct short hedges for inventory and long hedges for raw material purchases",
    "Calculate basis and net realized prices using b = S - F and Net = F1 + b2",
    "Analyze directional gains and losses from strengthening and weakening basis"
  ],
  coreConcepts: [
    {
      conceptId: "K05",
      term: "basis risk",
      stages: {
        intuition: { sceneIndex: 0, note: "Why companies trade futures without intending delivery" },
        why: { sceneIndex: 1, note: "Commercial producers face natural price exposure" },
        what: { sceneIndex: 3, note: "Basis is spot minus futures price" },
        how: { sceneIndex: 4, note: "Hedging substitutes outright price risk with basis risk" },
        workedExample: { sceneIndex: 5, note: "NYMEX crude oil short hedge calculation" },
        guided: { sceneIndex: 7, note: "Evaluate strengthening versus weakening basis" },
        independent: { sceneIndex: 9, note: "Calculate net realized price in the quiz" },
        limitations: { sceneIndex: 8, note: "Gold miners caught by mark-to-market futures losses in a bull market" }
      }
    }
  ],
  misconception: {
    myth: "Hedging is a tool to beat the market and generate extra trading profits",
    reality: "Hedging minimizes cash flow variance and guarantees corporate solvency",
    factIds: ["F01"],
    sceneIndex: 6
  },
  predictionQuestions: [
    {
      question: "If spot oil plunges by five dollars, does the producer lose money?",
      sceneIndex: 5,
      revealBeat: "s05b3"
    }
  ],
  causalChain: {
    condition: "Enterprise holds unhedged physical commodity inventory",
    action: "Firm short sells futures contracts matching expected production",
    mechanism: "Cash gains on futures offset revenue deficits on physical sales",
    result: "Net corporate cash flow variance is compressed to near zero",
    consequence: "Operating solvency and enterprise credit ratings are fully preserved",
    factIds: ["F01", "F02"],
    sceneIndex: 4
  },
  sceneOutline: [
    { index: 0, purpose: "Problem-first hook", concepts: ["hedging"], factIds: ["F01"] },
    { index: 1, purpose: "Short vs long hedge tension", concepts: ["short hedge", "long hedge"], factIds: ["F02", "F03"] },
    { index: 2, purpose: "Four pillars roadmap", concepts: ["hedging"], factIds: ["F01", "F04", "F06", "F07"] },
    { index: 3, purpose: "Basis equation and net price", concepts: ["basis risk"], factIds: ["F04", "F05"] },
    { index: 4, purpose: "Causal mechanism of variance reduction", concepts: ["short hedge"], factIds: ["F01", "F02"] },
    { index: 5, purpose: "Crude oil worked example", concepts: ["short hedge"], factIds: ["F02"] },
    { index: 6, purpose: "Novice speculation trap vs corporate reality", concepts: ["hedging"], factIds: ["F01", "F08"] },
    { index: 7, purpose: "Strengthening vs weakening basis table", concepts: ["basis risk"], factIds: ["F06"] },
    { index: 8, purpose: "Delivery month choice and gold miner lessons", concepts: ["basis risk"], factIds: ["F07", "F09"] },
    { index: 9, purpose: "Interactive quiz", concepts: ["basis risk"], factIds: ["F04", "F05", "F10"] },
    { index: 10, purpose: "Synthesis and bridge to part 2", concepts: ["hedging"], factIds: ["F01", "F04"] },
    { index: 11, purpose: "Eight rules summary thread", concepts: ["hedging", "basis risk"], factIds: ["F01", "F02", "F03", "F04", "F05", "F06", "F07"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '04_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');

// 3. Assemble full 41-beat episode
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch03",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 3",
  partLabel: "Part 1",
  title: "Basic Principles, Short/Long Hedges & Basis Risk",
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
  progress: { index: 1, total: 1 },
  theme: "dark-classroom",
  provenance: { mock: false },
  scenes: [
    // Scene 0: Chat story (4 beats)
    {
      id: "s00",
      index: 0,
      title: "The Corporate Dilemma: Why Companies Hedge",
      purpose: "Problem-first hook: why commercial enterprises trade futures without seeking speculative profit",
      takeaways: [
        "Corporations hedge to neutralize price risk, not to speculate",
        "Hedging minimizes cash flow variance and guarantees solvency",
        "Core hedge types are the Short Hedge and Long Hedge"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m1", speaker: "novice", text: "Why do commercial enterprises trade millions in futures contracts if they never intend to take physical delivery or seek trading profits? Is hedging really worth the capital?" },
          { id: "m2", speaker: "mentor", text: "Commercial enterprises do not enter futures markets to engage in speculation; rather, they deploy futures to neutralize severe commercial price risks and safeguard enterprise solvency." },
          { id: "m3", speaker: "mentor", text: "The foundational philosophy of corporate hedging is straightforward: its purpose is never to generate speculative trading profits, but to minimize the variance and unpredictability of corporate cash flows." },
          { id: "m4", speaker: "mentor", text: "In Section 3.1, John Hull establishes the two core categories: the Short Hedge, deployed to protect physical inventories, and the Long Hedge, utilized to lock in acquisition costs for essential raw materials." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Basic Principles", "Short & Long Hedges", "Basis Risk", "Hedge Ratio (Part 2)", "Index Hedges (Part 3)"],
          current: 0
        }
      },
      beats: [
        {
          id: "s00b1",
          speaker: "novice",
          narration: {
            en: { display: "Why do commercial enterprises trade millions in futures contracts if they never intend to take physical delivery or seek trading profits? Is hedging really worth the capital?" },
            hi: { display: "कमर्शियल कंपनियाँ फ्यूचर्स में करोड़ों का ट्रेड क्यों करती हैं जब उन्हें डिलीवरी भी नहीं लेनी होती? क्या हेजिंग सच में कंपनियों के लिए फायदेमंद है?" }
          },
          onScreenIntent: "Opening dilemma question on corporate hedging motivations",
          sourceFactIds: ["F01"],
          newTerms: ["hedging"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b01 },
            hi: { display: hiBeats.b01 }
          },
          onScreenIntent: "The mentor sets the economic objective of derivatives",
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
          narration: {
            en: { display: enBeats.b02 },
            hi: { display: hiBeats.b02 }
          },
          onScreenIntent: "Variance minimization as the foundational corporate philosophy",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b03 },
            hi: { display: hiBeats.b03 }
          },
          onScreenIntent: "Introduction of Short Hedge and Long Hedge categories",
          sourceFactIds: ["F01"],
          newTerms: ["short hedge", "long hedge"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m1", "m2", "m3", "m4"] },
          visualCues: []
        }
      ]
    },

    // Scene 1: Tug of War (4 beats: b04, b05, b06, b07)
    {
      id: "s01",
      index: 1,
      title: "The Mechanics of Short and Long Hedges",
      purpose: "Contrasting physical commercial exposure with offsetting futures contracts",
      takeaways: [
        "Short hedges lock in selling prices for natural longs",
        "Long hedges lock in purchase costs for natural shorts",
        "Offsetting positions eliminate market price exposure"
      ],
      pedagogicalContinuation: false,
      template: "tug_of_war",
      data: {
        left: {
          id: "short_hedge",
          label: "Short Hedger (Natural Long)",
          points: [
            "Owns inventory or future production",
            "Exposed to falling market spot prices",
            "Shorts futures to lock in floor revenue"
          ]
        },
        right: {
          id: "long_hedge",
          label: "Long Hedger (Natural Short)",
          points: [
            "Needs to buy raw materials in future",
            "Exposed to rising market spot prices",
            "Buys futures to cap acquisition costs"
          ]
        },
        resolution: {
          id: "offset",
          label: "Offsetting Mechanism",
          text: "Physical market exposure and financial futures move in exact opposite directions."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b04 },
            hi: { display: hiBeats.b04 }
          },
          onScreenIntent: "Defining the short hedger natural long exposure",
          sourceFactIds: ["F01", "F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["short_hedge"] },
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b05 },
            hi: { display: hiBeats.b05 }
          },
          onScreenIntent: "Crude oil producer example initial setup",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["short_hedge"] },
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b06 },
            hi: { display: hiBeats.b06 }
          },
          onScreenIntent: "Defining the long hedger natural short exposure",
          sourceFactIds: ["F01", "F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["short_hedge", "long_hedge"] },
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b07 },
            hi: { display: hiBeats.b07 }
          },
          onScreenIntent: "Copper fabricator example capping raw material costs",
          sourceFactIds: ["F03", "F11"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["short_hedge", "long_hedge", "offset"] },
          visualCues: []
        }
      ]
    },

    // Scene 2: Progressive Cards (3 beats: b08, b09, b10)
    {
      id: "s02",
      index: 2,
      title: "Four Pillars of Corporate Hedging",
      purpose: "Architectural principles underpinning corporate derivatives usage",
      takeaways: [
        "Duality aligns physical exposure with futures direction",
        "Hedging substitutes price risk with basis risk",
        "Delivery month selection protects against liquidity squeezes"
      ],
      pedagogicalContinuation: false,
      template: "progressive_cards",
      data: {
        cards: [
          { id: "c1", title: "Pillar 1: Position Duality", body: "Physical asset owners short futures; physical asset buyers long futures." },
          { id: "c2", title: "Pillar 2: Basis Risk Substitution", body: "Corporate hedging replaces outright price risk with smaller, manageable basis risk." },
          { id: "c3", title: "Pillar 3: Directional Symmetry", body: "Strengthening basis benefits short hedgers; weakening basis benefits long hedgers." },
          { id: "c4", title: "Pillar 4: Delivery Month Rule", body: "Choose a delivery month later than expiration to eliminate physical delivery hazards." }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b08 },
            hi: { display: hiBeats.b08 }
          },
          onScreenIntent: "Pillar 1 and 2 introduction",
          sourceFactIds: ["F01", "F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2"] },
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b09 },
            hi: { display: hiBeats.b09 }
          },
          onScreenIntent: "Pillar 3 basis dynamics",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2", "c3"] },
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b10 },
            hi: { display: hiBeats.b10 }
          },
          onScreenIntent: "Pillar 4 delivery month selection",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["c1", "c2", "c3", "c4"] },
          visualCues: []
        }
      ]
    },

    // Scene 3: Formula Breakdown (3 beats: b11, b12, b13)
    {
      id: "s03",
      index: 3,
      title: "The Concept of Basis: Measuring Market Divergence",
      purpose: "Mathematical definition of basis and the net realized price formula",
      takeaways: [
        "Basis is Spot minus Futures: b = S - F",
        "Net realized price for a short hedger is F1 + b2",
        "At maturity, spot converges to futures and basis becomes zero"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Basis Equation",
        formula: {
          latex: "b = S - F",
          expression: "S - F",
          solvesFor: "b",
          variables: [
            { symbol: "b", latex: "b", meaning: "Basis", unit: "USD per barrel" },
            { symbol: "S", latex: "S", meaning: "Spot Price of Asset Hedged", unit: "USD per barrel" },
            { symbol: "F", latex: "F", meaning: "Futures Price of Contract", unit: "USD per barrel" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "b", meaning: "Basis: difference between spot and futures", unit: "USD/bbl" },
          { id: "p2", symbolLatex: "S", meaning: "Spot price of the asset being hedged", unit: "USD/bbl" },
          { id: "p3", symbolLatex: "F", meaning: "Futures price of the contract used", unit: "USD/bbl" }
        ],
        note: [
          { type: "text", text: "Net Realized Price for Short Hedger: " },
          { type: "math", latex: "\\text{Price} = F_1 + b_2" },
          { type: "text", text: " where b2 is terminal basis." }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b11 },
            hi: { display: hiBeats.b11 }
          },
          onScreenIntent: "Formal definition of basis b = S - F",
          sourceFactIds: ["F04"],
          newTerms: ["basis"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1"] },
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b12 },
            hi: { display: hiBeats.b12 }
          },
          onScreenIntent: "Net realized price formula Net = F1 + b2",
          sourceFactIds: ["F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2"] },
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b13 },
            hi: { display: hiBeats.b13 }
          },
          onScreenIntent: "Basis convergence and substitution insight",
          sourceFactIds: ["F04", "F05"],
          newTerms: ["basis risk"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["p1", "p2", "p3"] },
          visualCues: []
        }
      ]
    },

    // Scene 4: Causal Chain (4 beats: b14, b15, b16, b17)
    {
      id: "s04",
      index: 4,
      title: "The Causal Architecture of Corporate Hedging",
      purpose: "Tracing the end-to-end mechanism from exposure to solvency preservation",
      takeaways: [
        "Inventory exposure creates severe downside vulnerability",
        "Short futures generate offsetting cash gains during market crashes",
        "Cash flow variance is compressed to near zero"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        links: [
          { id: "l1", role: "condition", text: "Physical exposure: 1,000,000 barrels crude oil in production" },
          { id: "l2", role: "action", text: "Short hedge: Sell 1,000 August NYMEX futures contracts at $79" },
          { id: "l3", role: "mechanism", text: "Offsetting cash flows: $4/bbl futures gain absorbs $5/bbl spot decline" },
          { id: "l4", role: "result", text: "Deterministic outcome: $79,000,000 net proceeds locked in" },
          { id: "l5", role: "consequence", text: "Enterprise solvency and operating stability fully guaranteed" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b14 },
            hi: { display: hiBeats.b14 }
          },
          onScreenIntent: "Condition and action in causal chain",
          sourceFactIds: ["F01", "F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["l1", "l2"] },
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b15 },
            hi: { display: hiBeats.b15 }
          },
          onScreenIntent: "Market shock and offsetting cash flow mechanism",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["l1", "l2", "l3"] },
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b16 },
            hi: { display: hiBeats.b16 }
          },
          onScreenIntent: "Deterministic revenue outcome",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["l1", "l2", "l3", "l4"] },
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b17 },
            hi: { display: hiBeats.b17 }
          },
          onScreenIntent: "Enterprise solvency preservation consequence",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["l1", "l2", "l3", "l4", "l5"] },
          visualCues: []
        }
      ]
    },

    // Scene 5: Worked Example (3 beats: b18, b19, b20)
    {
      id: "s05",
      index: 5,
      title: "Worked Example: Crude Oil Short Hedge",
      purpose: "Step-by-step mathematical demonstration of NYMEX short hedge payoff",
      takeaways: [
        "Spot sale yields $75M during a market crash",
        "Short futures gain yields $4M to offset spot drop",
        "Total net proceeds exactly equal $79,000,000"
      ],
      pedagogicalContinuation: false,
      template: "worked_example",
      data: {
        title: "Worked Example: Crude Oil Short Hedge",
        formula: {
          latex: "R = S + G",
          expression: "S + G",
          solvesFor: "R",
          variables: [
            { symbol: "R", latex: "R", meaning: "Net Realized Revenue", unit: "USD" },
            { symbol: "S", latex: "S", meaning: "Spot Physical Revenue", unit: "USD" },
            { symbol: "G", latex: "G", meaning: "Futures Trading Gain", unit: "USD" }
          ]
        },
        given: [
          { id: "g1", label: "Physical Production", value: 1000000, unit: "barrels", display: "1,000,000 bbl" },
          { id: "g2", label: "Initial Spot Price", value: 80, unit: "USD/bbl", display: "$80.00" },
          { id: "g3", label: "August Futures Price", value: 79, unit: "USD/bbl", display: "$79.00" }
        ],
        steps: [
          { id: "st1", label: "Spot Physical Revenue", latex: "1{,}000{,}000 \\times 75 = 75{,}000{,}000", value: 75000000 },
          { id: "st2", label: "Short Futures Gain", latex: "1{,}000{,}000 \\times (79 - 75) = 4{,}000{,}000", value: 4000000 },
          { id: "st3", label: "Total Net Proceeds", latex: "75{,}000{,}000 + 4{,}000{,}000 = 79{,}000{,}000", value: 79000000 }
        ],
        result: {
          id: "res",
          label: "Net Revenue Realized",
          value: 79000000,
          unit: "USD",
          display: "$79,000,000",
          rounding: 0
        },
        conclusion: "The $4M futures gain offsets the physical crash, locking net revenue at exactly $79M ($79/bbl).",
        isHypothetical: false
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b18 },
            hi: { display: hiBeats.b18 }
          },
          onScreenIntent: "Givens: 1M barrels, $80 spot, $79 August futures",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["g1", "g2", "g3"] },
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b19 },
            hi: { display: hiBeats.b19 }
          },
          onScreenIntent: "Market shock: spot crashes to $75; calculate spot and futures cash flows",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["g1", "g2", "g3", "st1", "st2"] },
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b20 },
            hi: { display: hiBeats.b20 }
          },
          onScreenIntent: "Combined net revenue of $79M proves perfect hedge neutralization",
          sourceFactIds: ["F02"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["g1", "g2", "g3", "st1", "st2", "st3", "res"] },
          visualCues: []
        }
      ]
    },

    // Scene 6: Split Comparison (3 beats: b21, b22, b23)
    {
      id: "s06",
      index: 6,
      title: "Hedging vs Speculation: The Novice Trap",
      purpose: "Debunking the myth that hedging exists to beat market price trends",
      takeaways: [
        "Speculators seek market gains; hedgers seek risk elimination",
        "Regretting a hedge during price rallies is an institutional error",
        "Deterministic cash flows preserve enterprise valuation"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "novice_trap",
          heading: "COMMON NOVICE TRAP",
          tone: "trap",
          points: [
            "Expects hedging to outperform spot rallies",
            "Views hedging losses as wasted money",
            "Treats treasury department as profit center"
          ]
        },
        right: {
          id: "corporate_reality",
          heading: "CORPORATE REALITY",
          tone: "positive",
          points: [
            "Minimizes variance and operational volatility",
            "Locks in margins regardless of price trend",
            "Eliminates bankruptcy risk and distress costs"
          ]
        },
        verdict: {
          id: "verdict",
          text: "Hedging trades speculative upside for complete cash flow certainty."
        }
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b21 },
            hi: { display: hiBeats.b21 }
          },
          onScreenIntent: "The novice trap of treating treasury as profit center",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["novice_trap"] },
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b22 },
            hi: { display: hiBeats.b22 }
          },
          onScreenIntent: "The corporate reality of variance reduction",
          sourceFactIds: ["F01", "F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["corporate_reality"] },
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b23 },
            hi: { display: hiBeats.b23 }
          },
          onScreenIntent: "Synthesis: corporate solvency over speculative greed",
          sourceFactIds: ["F01"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["novice_trap", "corporate_reality", "verdict"] },
          visualCues: []
        }
      ]
    },

    // Scene 7: Table Compare (3 beats: b24, b25, b26)
    {
      id: "s07",
      index: 7,
      title: "Strengthening vs. Weakening Basis",
      purpose: "Comparative matrix of basis movements and party payoffs",
      takeaways: [
        "Strengthening basis (b rises) benefits the short hedger",
        "Weakening basis (b falls) benefits the long hedger",
        "Basis shifts alter net realized price via Net = F1 + b2"
      ],
      pedagogicalContinuation: false,
      template: "table_compare",
      data: {
        columns: ["Shift Type", "Basis Move", "Beneficiary", "Net Realized Impact"],
        rows: [
          { id: "r_str", cells: ["Strengthening", "Basis Increases (S - F rises)", "Short Hedger", "Higher net realized selling price"] },
          { id: "r_wk", cells: ["Weakening", "Basis Decreases (S - F falls)", "Long Hedger", "Lower net acquisition purchase cost"] }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b24 },
            hi: { display: hiBeats.b24 }
          },
          onScreenIntent: "Strengthening basis row highlighted",
          sourceFactIds: ["F06"],
          newTerms: ["strengthening basis"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r_str"] },
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b25 },
            hi: { display: hiBeats.b25 }
          },
          onScreenIntent: "Weakening basis row highlighted",
          sourceFactIds: ["F06"],
          newTerms: ["weakening basis"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r_wk"] },
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b26 },
            hi: { display: hiBeats.b26 }
          },
          onScreenIntent: "Summary matrix of directional basis sensitivity",
          sourceFactIds: ["F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r_str", "r_wk"] },
          visualCues: []
        }
      ]
    },

    // Scene 8: Stat Counter (3 beats: b27, b28, b29)
    {
      id: "s08",
      index: 8,
      title: "Delivery Month Selection & The Gold Miner Trap",
      purpose: "Contract selection rules and historical lessons from gold producer hedging",
      takeaways: [
        "Select contract delivery month strictly later than hedge expiration",
        "Avoid trading during the delivery month to prevent liquidity crunches",
        "Gold producers suffered severe mark-to-market losses during bull markets"
      ],
      pedagogicalContinuation: false,
      template: "stat_counter",
      data: {
        stats: [
          { id: "st_month", value: 1, prefix: "+", suffix: " Mo", label: "Delivery Month Buffer", sublabel: "Contract month later than expiration" },
          { id: "st_risk", value: 0, suffix: "%", label: "Delivery Squeeze Hazard", sublabel: "Avoid physical delivery month trading" },
          { id: "st_gold", value: 100, suffix: "%", label: "Bull Market Regret Risk", sublabel: "Unhedged peers outperform during gold rallies" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b27 },
            hi: { display: hiBeats.b27 }
          },
          onScreenIntent: "The golden rule of contract delivery month selection",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["st_month"] },
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b28 },
            hi: { display: hiBeats.b28 }
          },
          onScreenIntent: "Liquidity hazards during the actual delivery month",
          sourceFactIds: ["F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["st_month", "st_risk"] },
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b29 },
            hi: { display: hiBeats.b29 }
          },
          onScreenIntent: "Historical case study: Gold miners bull market hedge dilemma",
          sourceFactIds: ["F09"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["st_month", "st_risk", "st_gold"] },
          visualCues: []
        }
      ]
    },

    // Scene 9: Interactive Quiz (3 beats: b30, b31, b32)
    {
      id: "s09",
      index: 9,
      title: "Active Recall: Net Realized Price Calculation",
      purpose: "Check student mastery of basis calculation and net realized price",
      takeaways: [
        "Basis b2 equals S2 minus F2 ($85 - $87 = -$2)",
        "Net realized price equals initial futures F1 plus basis b2 ($90 + (-$2) = $88)",
        "Hedging converts volatile spot swings into deterministic revenue"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A producer shorts crude oil futures at $90. At hedge closeout, the spot price is $85 and the futures price is $87. What is the net price realized per barrel?",
        options: [
          "A) $85 per barrel",
          "B) $88 per barrel",
          "C) $90 per barrel",
          "D) $92 per barrel"
        ],
        correctIndex: 1,
        explanation: "Terminal basis b2 = S2 - F2 = $85 - $87 = -$2. Net price realized = F1 + b2 = $90 + (-$2) = $88 per barrel (or $85 physical + $3 futures gain)."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b30 },
            hi: { display: hiBeats.b30 }
          },
          onScreenIntent: "Quiz question presented with numbers $90 futures, $85 spot, $87 closeout",
          sourceFactIds: ["F04", "F05", "F10"],
          newTerms: [],
          pauseAfterMs: 3200,
          transition: false,
          visual: { show: [] },
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b31 },
            hi: { display: hiBeats.b31 }
          },
          onScreenIntent: "Thinking interval and formula reminder",
          sourceFactIds: ["F04", "F05"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: [] },
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b32 },
            hi: { display: hiBeats.b32 }
          },
          onScreenIntent: "Reveal Option B ($88) with complete mathematical walkthrough",
          sourceFactIds: ["F05", "F10"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: [] },
          visualCues: []
        }
      ]
    },

    // Scene 10: Chat Story / Bridge (2 beats: b33, b34)
    {
      id: "s10",
      index: 10,
      title: "Where We Are: Synthesis & Bridge to Part 2",
      purpose: "Synthesis of Part 1 and intellectual bridge to minimum variance hedge ratio",
      takeaways: [
        "Hedging converts outright price volatility into basis risk",
        "Part 2 introduces cross hedging and imperfect correlation",
        "The minimum variance hedge ratio h* will optimize hedge sizing"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          { id: "m10_1", speaker: "mentor", text: "Hedging does not eliminate uncertainty entirely; it transforms severe price volatility into smaller, manageable basis risk." },
          { id: "m10_2", speaker: "mentor", text: "In Part 2, we tackle Cross Hedging: when the physical asset differs from the futures contract, requiring the Minimum Variance Hedge Ratio (h* = ρ × σS / σF)." }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: ["Basic Principles", "Short & Long Hedges", "Basis Risk", "Hedge Ratio (Part 2)", "Index Hedges (Part 3)"],
          current: 2
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b33 },
            hi: { display: hiBeats.b33 }
          },
          onScreenIntent: "Core pedagogical synthesis: risk transformation into basis risk",
          sourceFactIds: ["F01", "F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m10_1"] },
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b34 },
            hi: { display: hiBeats.b34 }
          },
          onScreenIntent: "Roadmap preview and intellectual bridge to Part 2",
          sourceFactIds: ["F01"],
          newTerms: ["cross hedging"],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["m10_1", "m10_2"] },
          visualCues: []
        }
      ]
    },

    // Scene 11: Summary Thread (6 beats: b35, b36, b37, b38, b39, b40)
    {
      id: "s11",
      index: 11,
      title: "Eight Rules to Remember",
      purpose: "Institutional rules codifying hedging strategies and basis mechanics",
      takeaways: [
        "Hedging reduces variance; short hedges protect sellers, long hedges protect buyers",
        "Basis is Spot minus Futures; net price for short hedger is F1 + b2",
        "Select a delivery month later than the closeout date to avoid delivery hazards"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Corporate Hedging in 8 Rules",
        rules: [
          { id: "r1", title: "Objective is variance reduction", text: "Hedging reduces cash flow variance; its purpose is never to seek speculative trading profit." },
          { id: "r2", title: "Short hedge protects sellers", text: "Short hedges protect physical inventory and expected production against falling market prices." },
          { id: "r3", title: "Long hedge secures input costs", text: "Long hedges cap raw material acquisition costs for commercial manufacturers against price surges." },
          { id: "r4", title: "Basis formula", text: "Basis is defined as Spot Price minus Futures Price: b = S - F." },
          { id: "r5", title: "Net realized selling price", text: "The net realized price per unit for a short hedger equals initial futures price plus terminal basis: F1 + b2." },
          { id: "r6", title: "Strengthening basis benefits short hedger", text: "When basis increases unexpectedly, the short hedger realizes higher net revenue than anticipated." },
          { id: "r7", title: "Weakening basis benefits long hedger", text: "When basis decreases unexpectedly, the long hedger achieves lower net acquisition costs." },
          { id: "r8", title: "Delivery month selection rule", text: "Always choose a delivery month later than the closeout date to avoid physical delivery squeezes." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b35 },
            hi: { display: hiBeats.b35 }
          },
          onScreenIntent: "Overview of the 8 rules",
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
          narration: {
            en: { display: enBeats.b36 },
            hi: { display: hiBeats.b36 }
          },
          onScreenIntent: "Rules 1 and 2 highlighted",
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
          narration: {
            en: { display: enBeats.b37 },
            hi: { display: hiBeats.b37 }
          },
          onScreenIntent: "Rules 3 and 4 highlighted",
          sourceFactIds: ["F03", "F04"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r3", "r4"], range: [3, 4] },
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b38 },
            hi: { display: hiBeats.b38 }
          },
          onScreenIntent: "Rules 5 and 6 highlighted",
          sourceFactIds: ["F05", "F06"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: { show: ["r5", "r6"], range: [5, 6] },
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: {
            en: { display: enBeats.b39 },
            hi: { display: hiBeats.b39 }
          },
          onScreenIntent: "Rules 7 and 8 highlighted",
          sourceFactIds: ["F06", "F07"],
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
            en: { display: enBeats.b40 },
            hi: { display: hiBeats.b40 }
          },
          onScreenIntent: "Compact summary overview of all 8 rules",
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
let md = `# Hedging Strategies Using Futures\n\n`;
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
    { index: 0, topology: "hook", visualIntent: "Problem-first hook: why commercial enterprises hedge instead of speculating", keyElements: ["Opening question", "Risk neutralization", "Cash flow variance", "Short vs Long hedge"], factIds: ["F01"] },
    { index: 1, topology: "tension", visualIntent: "Short hedger vs Long hedger: opposing exposures resolved by futures", keyElements: ["Short hedger natural long", "Long hedger natural short", "Offsetting positions"], factIds: ["F01", "F02", "F03"] },
    { index: 2, topology: "pillars", visualIntent: "The four architectural pillars of corporate hedging", keyElements: ["Position Duality", "Basis Concept", "Directional Dynamics", "Delivery Month Rule"], factIds: ["F01", "F04", "F06", "F07"] },
    { index: 3, topology: "formula", visualIntent: "Define basis b = S - F and net price Net = F1 + b2", keyElements: ["Formula b = S - F", "Formula Net = F1 + b2", "Basis risk substitution"], factIds: ["F04", "F05"] },
    { index: 4, topology: "process", visualIntent: "Step-by-step causal chain of corporate hedging", keyElements: ["Physical exposure", "Short matching futures", "Futures gains offset physical loss", "Solvency guaranteed"], factIds: ["F01", "F02"] },
    { index: 5, topology: "worked_example", visualIntent: "Worked example of crude oil producer short hedge", keyElements: ["Givens: 1M barrels, $80 spot, $79 futures", "Market shock: spot drops to $75", "Offset calculation: $75M + $4M = $79M"], factIds: ["F02"] },
    { index: 6, topology: "comparison", visualIntent: "Novice speculation trap vs corporate risk reality", keyElements: ["Novice speculation trap", "Variance minimization reality", "Deterministic cash flows"], factIds: ["F01"] },
    { index: 7, topology: "comparison", visualIntent: "Strengthening vs weakening basis matrix", keyElements: ["Strengthening basis benefits short hedger", "Weakening basis benefits long hedger", "Directional payoff verdict"], factIds: ["F06"] },
    { index: 8, topology: "quantity_over_time", visualIntent: "Delivery month choice and gold miners bull market trap", keyElements: ["Delivery month buffer", "Liquidity hazard avoidance", "Gold miners mark-to-market dilemma"], factIds: ["F07", "F09"] },
    { index: 9, topology: "quiz", visualIntent: "Active recall quiz on net realized price calculation", keyElements: ["Oil short hedge at $90", "Thinking interval with countdown", "Option B revealed with terminal basis rationale"], factIds: ["F04", "F05", "F10"] },
    { index: 10, topology: "hook", visualIntent: "Synthesis and bridge to Part 2 cross hedging", keyElements: ["Risk transformation into basis risk", "Preview of Minimum Variance Hedge Ratio", "Where we are milestone marker"], factIds: ["F01", "F04"] },
    { index: 11, topology: "pillars", visualIntent: "Eight fundamental rules of futures hedging", keyElements: ["Rule 1-2: Objective & Short Hedge", "Rule 3-4: Long Hedge & Basis Formula", "Rule 5-6: Realized Price & Strengthening Basis", "Rule 7-8: Weakening Basis & Delivery Month", "Compact 2-column final overview"], factIds: ["F01", "F02", "F03", "F04", "F05", "F06", "F07"] }
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

console.log('Successfully generated full collegiate 41-beat episode!');
console.log('Scenes count:', episode.scenes.length);
console.log('Total beats:', episode.scenes.reduce((acc, sc) => acc + sc.beats.length, 0));
