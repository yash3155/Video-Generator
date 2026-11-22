import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch03/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Load teaching script
const script = JSON.parse(fs.readFileSync(path.join(targetDir, '05_teaching_script.json'), 'utf8'));

// 1. Generate 05_teaching_script.md
let md = `# Hedging Strategies Using Futures\n\n`;
for (const s of script.scenes) {
  md += `## Scene ${s.index}: ${s.title}\n\n_${s.purpose}_\n\n`;
  for (const b of s.beats) {
    md += `**${b.id}** (${b.speaker}; facts ${b.sourceFactIds.join(', ') || 'none'})\n\n`;
    md += `- en: ${b.narration.en.display}\n`;
    md += `- hi: ${b.narration.hi.display}\n`;
    md += `- on screen: ${b.onScreenIntent}\n\n`;
  }
}
fs.writeFileSync(path.join(targetDir, '05_teaching_script.md'), md, 'utf8');

// 2. Generate 06_visual_brief.json
const visualBrief = {
  scenes: [
    {
      index: 0,
      topology: "hook",
      visualIntent: "Problem-first hook: why commercial enterprises hedge instead of speculating",
      keyElements: [
        "Opening question appears as first message bubble",
        "Risk neutralization appears as mentor response",
        "Cash flow variance minimization highlighted",
        "Dual hedge classification (Short vs Long)"
      ],
      factIds: ["F01"]
    },
    {
      index: 1,
      topology: "tension",
      visualIntent: "Short hedger vs Long hedger: opposing commercial exposures resolved by futures",
      keyElements: [
        "The short hedger side lights up",
        "The long hedger side lights up",
        "Offsetting financial position resolves commercial risk"
      ],
      factIds: ["F01", "F02", "F03"]
    },
    {
      index: 2,
      topology: "pillars",
      visualIntent: "The four architectural pillars of corporate hedging",
      keyElements: [
        "Pillar 1: Position Duality",
        "Pillar 2: Basis Concept",
        "Pillar 3: Directional Dynamics",
        "Pillar 4: Delivery Month Rule"
      ],
      factIds: ["F01", "F04", "F06", "F07"]
    },
    {
      index: 3,
      topology: "formula",
      visualIntent: "Define basis and the net realized price formula",
      keyElements: [
        "Formula b = S - F",
        "Formula Net Realized Price = F1 + b2",
        "Basis risk substitution insight"
      ],
      factIds: ["F04", "F05"]
    },
    {
      index: 4,
      topology: "process",
      visualIntent: "Step-by-step causal chain of corporate hedging",
      keyElements: [
        "Condition: Physical commodity exposure",
        "Action: Short matching futures volume",
        "Mechanism: Futures cash gains offset physical loss",
        "Consequence: Operating solvency guaranteed"
      ],
      factIds: ["F01", "F02"]
    },
    {
      index: 5,
      topology: "worked_example",
      visualIntent: "Worked example of crude oil producer short hedge",
      keyElements: [
        "Givens: 1M barrels, $80 spot, $79 futures",
        "Market shock: spot drops to $75",
        "Offset calculation: $75M spot + $4M futures = $79M"
      ],
      factIds: ["F02"]
    },
    {
      index: 6,
      topology: "comparison",
      visualIntent: "Common novice speculation trap vs corporate risk reality",
      keyElements: [
        "The novice speculation trap",
        "The variance minimization reality",
        "Verdict on deterministic cash flows"
      ],
      factIds: ["F01"]
    },
    {
      index: 7,
      topology: "comparison",
      visualIntent: "Strengthening vs weakening basis directional impact",
      keyElements: [
        "Strengthening basis benefits short hedger",
        "Weakening basis benefits long hedger",
        "Directional payoff verdict"
      ],
      factIds: ["F06"]
    },
    {
      index: 8,
      topology: "quantity_over_time",
      visualIntent: "Gold miners bull market trap and mark-to-market losses",
      keyElements: [
        "Bear market hedge protection",
        "Bull market margin calls",
        "Unhedged peers outperforming"
      ],
      factIds: ["F08", "F09"]
    },
    {
      index: 9,
      topology: "quiz",
      visualIntent: "Active recall quiz on net realized price calculation",
      keyElements: [
        "Oil short hedge scenario at $90 futures",
        "Cognitive thinking interval with countdown",
        "Option B revealed with terminal basis rationale"
      ],
      factIds: ["F04", "F05", "F06"]
    },
    {
      index: 10,
      topology: "hook",
      visualIntent: "Synthesis and bridge to Part 2 cross hedging",
      keyElements: [
        "Risk transformation into basis risk",
        "Preview of Minimum Variance Hedge Ratio",
        "Where we are milestone marker"
      ],
      factIds: ["F01", "F04"]
    },
    {
      index: 11,
      topology: "pillars",
      visualIntent: "Eight fundamental rules of futures hedging",
      keyElements: [
        "Rule 1-2: Objective & Short Hedge",
        "Rule 3-4: Long Hedge & Basis Formula",
        "Rule 5-6: Realized Price & Strengthening Basis",
        "Rule 7-8: Weakening Basis & Delivery Month",
        "Compact 2-column final overview"
      ],
      factIds: ["F01", "F02", "F03", "F04", "F05", "F06", "F07"]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '06_visual_brief.json'), JSON.stringify(visualBrief, null, 2), 'utf8');

// 3. Generate 07_storyboard.json
const storyboard = {
  scenes: [
    {
      index: 0,
      template: "chat_story",
      justification: "hook topology: why commercial enterprises hedge instead of speculating",
      pedagogicalContinuation: false,
      beats: script.scenes[0].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 1,
      template: "tug_of_war",
      justification: "tension topology: short hedger natural long vs long hedger natural short",
      pedagogicalContinuation: false,
      beats: script.scenes[1].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 2,
      template: "progressive_cards",
      justification: "pillars topology: the four core pillars of corporate hedging",
      pedagogicalContinuation: false,
      beats: script.scenes[2].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 3,
      template: "formula_breakdown",
      justification: "formula topology: basis definition b = S - F and Net Price = F1 + b2",
      pedagogicalContinuation: false,
      beats: script.scenes[3].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 4,
      template: "causal_chain",
      justification: "process topology: step-by-step risk neutralization mechanism",
      pedagogicalContinuation: false,
      beats: script.scenes[4].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 5,
      template: "worked_example",
      justification: "worked_example topology: Hull's crude oil producer short hedge",
      pedagogicalContinuation: false,
      beats: script.scenes[5].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 6,
      template: "split_comparison",
      justification: "comparison topology: speculation trap vs variance minimization reality",
      pedagogicalContinuation: false,
      beats: script.scenes[6].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 7,
      template: "split_comparison",
      justification: "comparison topology: strengthening vs weakening basis directional payoffs",
      pedagogicalContinuation: false,
      beats: script.scenes[7].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 8,
      template: "stat_counter",
      justification: "quantity_over_time topology: gold miners bull market trap metrics",
      pedagogicalContinuation: false,
      beats: script.scenes[8].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 9,
      template: "interactive_quiz",
      justification: "quiz topology: independent calculation of short hedge realized price",
      pedagogicalContinuation: false,
      beats: script.scenes[9].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 10,
      template: "chat_story",
      justification: "hook topology: collegiate synthesis and bridge to Part 2",
      pedagogicalContinuation: false,
      beats: script.scenes[10].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    },
    {
      index: 11,
      template: "summary_thread",
      justification: "pillars topology: eight institutional rules of corporate hedging",
      pedagogicalContinuation: false,
      beats: script.scenes[11].beats.map(b => ({ id: b.id, visualIntent: b.onScreenIntent }))
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '07_storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');

// 4. Generate 08_episode.json
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
    {
      id: "s00",
      index: 0,
      title: "The Corporate Dilemma: Why Companies Hedge",
      purpose: "Problem-first hook: why firms trade futures without seeking profits",
      takeaways: [
        "Firms trade futures to neutralize commercial price risks, not speculate",
        "The objective of hedging is to minimize cash flow variance",
        "Short hedges protect inventory; Long hedges lock raw material costs"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          {
            id: "m1",
            speaker: "novice",
            text: "Why do companies trade futures if they never take physical delivery?"
          },
          {
            id: "m2",
            speaker: "mentor",
            text: "They trade to neutralize severe price risk and safeguard enterprise solvency."
          },
          {
            id: "m3",
            speaker: "mentor",
            text: "The primary purpose is never speculation, but minimizing cash flow variance."
          },
          {
            id: "m4",
            speaker: "mentor",
            text: "Hull categorizes strategies into Short Hedges for inventory and Long Hedges for inputs."
          }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: [
            "Why companies hedge",
            "Short vs Long hedges",
            "Basis risk mechanics",
            "Minimum variance hedge"
          ],
          current: 1
        }
      },
      beats: [
        {
          ...script.scenes[0].beats[0],
          visual: { show: ["m1"] },
          visualCues: []
        },
        {
          ...script.scenes[0].beats[1],
          visual: { show: ["m1", "m2"] },
          visualCues: []
        },
        {
          ...script.scenes[0].beats[2],
          visual: { show: ["m1", "m2", "m3"] },
          visualCues: []
        },
        {
          ...script.scenes[0].beats[3],
          visual: { show: ["m1", "m2", "m3", "m4"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s01",
      index: 1,
      title: "Short Hedge vs Long Hedge",
      purpose: "Contrasting natural commercial exposure with offsetting futures positions",
      takeaways: [
        "Short Hedgers protect physical inventory and future production",
        "Long Hedgers cap potential upside raw material purchase costs",
        "Physical exposures and financial positions move in opposite directions"
      ],
      pedagogicalContinuation: false,
      template: "tug_of_war",
      data: {
        left: {
          id: "short_hedger",
          label: "Short Hedger (Producer)",
          points: [
            "Holds physical inventory or production",
            "Fears falling market spot prices",
            "Short sells futures to lock minimum price"
          ]
        },
        right: {
          id: "long_hedger",
          label: "Long Hedger (Manufacturer)",
          points: [
            "Needs to buy raw materials later",
            "Fears rising commodity prices",
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
          ...script.scenes[1].beats[0],
          visual: { show: ["short_hedger"] },
          visualCues: []
        },
        {
          ...script.scenes[1].beats[1],
          visual: { show: ["short_hedger", "long_hedger"] },
          visualCues: []
        },
        {
          ...script.scenes[1].beats[2],
          visual: { show: ["short_hedger", "long_hedger", "offset"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s02",
      index: 2,
      title: "Four Pillars of Corporate Hedging",
      purpose: "Establishing the architectural foundations of futures hedging",
      takeaways: [
        "Position duality: Short hedges protect sellers, Long hedges protect buyers",
        "Basis is defined as Spot Price minus Futures Price: b = S - F",
        "Strengthening basis benefits short hedgers; weakening benefits long hedgers"
      ],
      pedagogicalContinuation: false,
      template: "progressive_cards",
      data: {
        cards: [
          {
            id: "c1",
            title: "Position Duality",
            body: "Short hedges protect inventory sellers; Long hedges protect raw material buyers."
          },
          {
            id: "c2",
            title: "Basis Concept",
            body: "Basis equals Spot Price minus Futures Price: b = S - F."
          },
          {
            id: "c3",
            title: "Directional Dynamics",
            body: "Strengthening basis benefits short hedgers; weakening benefits long hedgers."
          },
          {
            id: "c4",
            title: "Delivery Month Rule",
            body: "Choose a contract month later than the closeout date to avoid delivery hazards."
          }
        ]
      },
      beats: [
        {
          ...script.scenes[2].beats[0],
          visual: { show: ["c1"] },
          visualCues: []
        },
        {
          ...script.scenes[2].beats[1],
          visual: { show: ["c1", "c2"] },
          visualCues: []
        },
        {
          ...script.scenes[2].beats[2],
          visual: { show: ["c1", "c2", "c3"] },
          visualCues: []
        },
        {
          ...script.scenes[2].beats[3],
          visual: { show: ["c1", "c2", "c3", "c4"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s03",
      index: 3,
      title: "The Mathematical Definition of Basis",
      purpose: "Deconstructing the formula b = S - F and Net Realized Price",
      takeaways: [
        "Basis equals Spot Price minus Futures Price: b = S - F",
        "At maturity, spot converges to futures and basis becomes zero",
        "Realized price for short hedger is F1 + b2; hedging replaces price risk with basis risk"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Basis Formula",
        formula: {
          latex: "b_t = S_t - F_t",
          expression: "S - F",
          solvesFor: "b_t",
          variables: [
            { symbol: "b_t", meaning: "basis at time t", unit: "dollars per unit" },
            { symbol: "S_t", meaning: "spot price of hedged asset", unit: "dollars per unit" },
            { symbol: "F_t", meaning: "futures price of contract", unit: "dollars per unit" }
          ]
        },
        parts: [
          { id: "p-b", symbolLatex: "b_t", meaning: "basis at time t", unit: "dollars per unit" },
          { id: "p-s", symbolLatex: "S_t", meaning: "spot price of hedged asset", unit: "dollars per unit" },
          { id: "p-f", symbolLatex: "F_t", meaning: "futures price of contract", unit: "dollars per unit" }
        ],
        note: [
          { type: "text", text: "Net Realized Price for Short Hedger: " },
          { type: "math", latex: "\\text{Price} = F_1 + b_2" },
          { type: "text", text: " where b2 is terminal basis." }
        ]
      },
      beats: [
        {
          ...script.scenes[3].beats[0],
          visual: { show: ["p-b"] },
          visualCues: []
        },
        {
          ...script.scenes[3].beats[1],
          visual: { show: ["p-b", "p-s", "p-f"] },
          visualCues: []
        },
        {
          ...script.scenes[3].beats[2],
          visual: { show: ["p-b", "p-s", "p-f"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s04",
      index: 4,
      title: "How Hedging Operates Step by Step",
      purpose: "Causal chain of commercial risk neutralization",
      takeaways: [
        "Unhedged physical inventories are vulnerable to market price collapse",
        "Selling futures creates an offsetting cash inflow if market falls",
        "Net revenue is locked, protecting enterprise credit ratings and solvency"
      ],
      pedagogicalContinuation: false,
      template: "causal_chain",
      data: {
        links: [
          {
            id: "condition",
            role: "condition",
            text: "Enterprise holds unhedged physical commodity inventory"
          },
          {
            id: "action",
            role: "action",
            text: "Firm short sells futures contracts matching expected production"
          },
          {
            id: "mechanism",
            role: "mechanism",
            text: "Cash gains on futures offset revenue deficits on physical sales"
          },
          {
            id: "result",
            role: "result",
            text: "Net corporate cash flow variance is compressed to near zero"
          },
          {
            id: "consequence",
            role: "consequence",
            text: "Operating solvency and enterprise credit ratings are fully preserved"
          }
        ]
      },
      beats: [
        {
          ...script.scenes[4].beats[0],
          visual: { show: ["condition", "action"] },
          visualCues: []
        },
        {
          ...script.scenes[4].beats[1],
          visual: { show: ["condition", "action", "mechanism"] },
          visualCues: []
        },
        {
          ...script.scenes[4].beats[2],
          visual: { show: ["condition", "action", "mechanism", "result"] },
          visualCues: []
        },
        {
          ...script.scenes[4].beats[3],
          visual: { show: ["condition", "action", "mechanism", "result", "consequence"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s05",
      index: 5,
      title: "Worked Example: NYMEX Crude Oil Short Hedge",
      purpose: "Numerical calculation of crude oil hedge from Hull Section 3.1",
      takeaways: [
        "Producer hedges 1M barrels with 1,000 August NYMEX futures contracts",
        "Futures target locked selling price at $79 per barrel ($79M total)",
        "Physical spot crash to $75 is fully offset by $4M futures cash gain"
      ],
      pedagogicalContinuation: false,
      template: "worked_example",
      data: {
        title: "NYMEX Crude Oil Short Hedge",
        formula: {
          latex: "\\text{Revenue} = \\text{Spot Sale} + \\text{Futures Gain}",
          expression: "spot_sale + futures_gain",
          solvesFor: "Revenue",
          variables: [
            { symbol: "Spot Sale", meaning: "physical market proceeds", unit: "dollars" },
            { symbol: "Futures Gain", meaning: "cash profit on short futures", unit: "dollars" }
          ]
        },
        given: [
          { id: "g-vol", symbol: "Q", label: "Inventory Volume", value: 1000000, unit: "barrels", display: "1,000,000 bbl" },
          { id: "g-s1", symbol: "S1", label: "May Spot Price", value: 80, unit: "$/bbl", display: "$80.00" },
          { id: "g-f1", symbol: "F1", label: "August Futures", value: 79, unit: "$/bbl", display: "$79.00" }
        ],
        steps: [
          { id: "step1", label: "Physical Sale at $75", latex: "1{,}000{,}000 \\times \\$75 = \\$75{,}000{,}000", expr: "Q * 75", value: 75000000 },
          { id: "step2", label: "Short Futures Gain", latex: "1{,}000{,}000 \\times (\\$79 - \\$75) = \\$4{,}000{,}000", expr: "Q * (79 - 75)", value: 4000000 },
          { id: "step3", label: "Combined Revenue", latex: "\\$75{,}000{,}000 + \\$4{,}000{,}000 = \\$79{,}000{,}000", expr: "75000000 + 4000000", value: 79000000 }
        ],
        result: {
          id: "res",
          label: "Total Net Revenue",
          value: 79000000,
          unit: "dollars",
          display: "$79,000,000",
          rounding: 0
        },
        conclusion: "The $4M futures gain offsets the physical crash, locking net revenue at exactly $79M ($79/bbl).",
        isHypothetical: false
      },
      beats: [
        {
          ...script.scenes[5].beats[0],
          visual: { show: ["g-vol", "g-s1", "g-f1", "step1"] },
          visualCues: []
        },
        {
          ...script.scenes[5].beats[1],
          visual: { show: ["g-vol", "g-s1", "g-f1", "step1", "step2", "step3", "res"] },
          visualCues: []
        },
        {
          ...script.scenes[5].beats[2],
          visual: { show: ["g-vol", "g-s1", "g-f1", "step1", "step2", "step3", "res", "conclusion"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s06",
      index: 6,
      title: "Common Novice Trap vs Corporate Reality",
      purpose: "Contrasting the speculation myth with enterprise risk management reality",
      takeaways: [
        "Hedging is never meant to beat spot prices or generate speculative gains",
        "A hedge succeeds when cash flows are stabilized, guaranteeing business survival",
        "Surrendering windfall upside is a deliberate corporate trade-off"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "trap",
          heading: "COMMON NOVICE TRAP",
          tone: "trap",
          points: [
            "Hedging is meant to beat the market and generate extra trading profits",
            "A hedge failed if spot prices rose and physical made more unhedged"
          ]
        },
        right: {
          id: "reality",
          heading: "PROFESSIONAL REALITY",
          tone: "positive",
          points: [
            "Hedging minimizes cash flow variance and guarantees corporate solvency",
            "A hedge is 100% successful when target cash flows are locked deterministically"
          ]
        },
        verdict: {
          id: "verdict",
          text: [
            { type: "text", text: "Hedging deliberately trades speculative windfall upside for " },
            { type: "math", latex: "\\sigma^2 \\to 0" },
            { type: "text", text: " cash flow certainty." }
          ]
        }
      },
      beats: [
        {
          ...script.scenes[6].beats[0],
          visual: { show: ["trap"] },
          visualCues: []
        },
        {
          ...script.scenes[6].beats[1],
          visual: { show: ["trap", "reality", "verdict"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s07",
      index: 7,
      title: "Strengthening vs Weakening Basis",
      purpose: "Analyzing directional impact on short and long hedges",
      takeaways: [
        "Strengthening basis means basis increases, raising realized selling prices for short hedgers",
        "Weakening basis means basis decreases, lowering net purchase costs for long hedgers",
        "Basis shifts determine whether actual realized prices beat or lag the initial futures price"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "strengthening",
          heading: "STRENGTHENING BASIS (b increases)",
          tone: "positive",
          points: [
            "Spot price rises faster than futures, or falls slower",
            "Realized price for short hedger: F1 + b2 rises",
            "Directly benefits Short Hedgers (Producers/Sellers)"
          ]
        },
        right: {
          id: "weakening",
          heading: "WEAKENING BASIS (b decreases)",
          tone: "positive",
          points: [
            "Spot price falls faster than futures, or rises slower",
            "Realized price for long hedger: F1 + b2 falls",
            "Directly benefits Long Hedgers (Manufacturers/Buyers)"
          ]
        },
        verdict: {
          id: "verdict",
          text: [
            { type: "text", text: "Basis direction determines which side of the trade gains relative to " },
            { type: "math", latex: "F_1" }
          ]
        }
      },
      beats: [
        {
          ...script.scenes[7].beats[0],
          visual: { show: ["strengthening"] },
          visualCues: []
        },
        {
          ...script.scenes[7].beats[1],
          visual: { show: ["strengthening", "weakening", "verdict"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s08",
      index: 8,
      title: "Limitations & The Bull Market Trap",
      purpose: "Case study of American Barrick and gold hedgers in the 2000s",
      takeaways: [
        "American Barrick short hedged gold production successfully during 1990s bear markets",
        "During the 2000s gold bull market, massive futures margin calls created severe friction",
        "Evaluating derivatives in isolation from physical business creates corporate traps"
      ],
      pedagogicalContinuation: false,
      template: "stat_counter",
      data: {
        stats: [
          {
            id: "s1",
            value: 80,
            decimals: 0,
            prefix: "$",
            label: "NYMEX Crude Hedge Target",
            sublabel: "Locked selling price per barrel"
          },
          {
            id: "s2",
            value: 4,
            decimals: 0,
            prefix: "$",
            suffix: "M",
            label: "Futures Cash Gain",
            sublabel: "Offsetting spot market decline"
          },
          {
            id: "s3",
            value: 79,
            decimals: 0,
            prefix: "$",
            suffix: "M",
            label: "Guaranteed Net Proceeds",
            sublabel: "100% variance reduction achieved"
          }
        ]
      },
      beats: [
        {
          ...script.scenes[8].beats[0],
          visual: { show: ["s1", "s2"] },
          visualCues: []
        },
        {
          ...script.scenes[8].beats[1],
          visual: { show: ["s1", "s2", "s3"] },
          visualCues: []
        }
      ]
    },
    {
      id: "s09",
      index: 9,
      title: "Active Recall: Short Hedge Calculation",
      purpose: "Independent active recall quiz calculating net realized selling price",
      takeaways: [
        "Calculate terminal basis b2 = S2 - F2: $85 - $87 = -$2",
        "Compute net realized price for short hedger: F1 + b2 = $90 + (-$2) = $88",
        "A weakening basis reduces net proceeds by $2 below initial futures price"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "An independent oil producer enters a Short Hedge by selling August crude oil futures at ninety dollars per barrel. In August, the spot price is eighty-five dollars and futures trades at eighty-seven dollars. What is the net realized price per barrel?",
        options: [
          "$85.00 per barrel",
          "$88.00 per barrel",
          "$90.00 per barrel",
          "$92.00 per barrel"
        ],
        correctIndex: 1,
        explanation: "Terminal basis b2 is S2 minus F2, or $85 minus $87, which equals -$2. The net realized price for a short hedger equals F1 plus b2: $90 plus -$2 equals $88 per barrel."
      },
      beats: [
        {
          ...script.scenes[9].beats[0],
          visual: { show: [], phase: "question" },
          visualCues: []
        },
        {
          ...script.scenes[9].beats[1],
          visual: { show: [], phase: "thinking" },
          visualCues: []
        },
        {
          ...script.scenes[9].beats[2],
          visual: { show: [], phase: "reveal" },
          visualCues: []
        }
      ]
    },
    {
      id: "s10",
      index: 10,
      title: "Synthesis & The Road to Part 2",
      purpose: "Reflecting on hedging principles and previewing Minimum Variance Hedge Ratio",
      takeaways: [
        "Corporate hedging transforms outright price risk into manageable basis risk",
        "Cross hedging arises when the asset being hedged differs from the contract asset",
        "Part 2 introduces the Minimum Variance Hedge Ratio and Metallgesellschaft"
      ],
      pedagogicalContinuation: false,
      template: "chat_story",
      data: {
        messages: [
          {
            id: "w1",
            speaker: "mentor",
            text: "Hedging does not eliminate risk; it transforms price risk into basis risk."
          },
          {
            id: "w2",
            speaker: "mentor",
            text: "When the hedged asset differs from the futures contract, cross hedging applies."
          },
          {
            id: "w3",
            speaker: "mentor",
            text: "In Part 2, we will master the Minimum Variance Hedge Ratio and beta hedging."
          }
        ],
        whereWeAre: {
          label: "WHERE WE ARE",
          items: [
            "Why companies hedge",
            "Short vs Long hedges",
            "Basis risk mechanics",
            "Minimum variance hedge"
          ],
          current: 2
        }
      },
      beats: [
        {
          ...script.scenes[10].beats[0],
          visual: { show: ["w1"] },
          visualCues: []
        },
        {
          ...script.scenes[10].beats[1],
          visual: { show: ["w1", "w2", "w3"] },
          visualCues: []
        }
      ]
    },
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
          { id: "r6", title: "Strengthening basis", text: "A strengthening basis increases the net realized selling price, benefiting short hedgers." },
          { id: "r7", title: "Weakening basis", text: "A weakening basis lowers the net acquisition cost, benefiting long hedgers." },
          { id: "r8", title: "Delivery month rule", text: "Always select a contract delivery month later than the hedge closeout to avoid delivery hazards." }
        ]
      },
      beats: [
        {
          ...script.scenes[11].beats[0],
          visual: { show: [], range: [0, 0] },
          visualCues: []
        },
        {
          ...script.scenes[11].beats[1],
          visual: { show: ["r1", "r2"], range: [1, 2] },
          visualCues: []
        },
        {
          ...script.scenes[11].beats[2],
          visual: { show: ["r3", "r4"], range: [3, 4] },
          visualCues: []
        },
        {
          ...script.scenes[11].beats[3],
          visual: { show: ["r5", "r6"], range: [5, 6] },
          visualCues: []
        },
        {
          ...script.scenes[11].beats[4],
          visual: { show: ["r7", "r8"], range: [7, 8], focus: "r8" },
          visualCues: []
        },
        {
          ...script.scenes[11].beats[5],
          visual: {
            show: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"],
            range: [1, 8],
            compact: true
          },
          visualCues: []
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2), 'utf8');
console.log('All artifacts written successfully');
