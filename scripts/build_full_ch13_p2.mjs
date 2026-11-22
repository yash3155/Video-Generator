import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch13/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_13/Part_02/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap13_part02/episode_raw.json', 'utf8'));

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const enBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());

const rawBeats = [];
epRaw.scenes.forEach(s => s.beats.forEach(b => rawBeats.push(b)));

const hiBeats = {};
rawBeats.forEach((b, idx) => {
  const k = 'b' + String(idx + 1).padStart(2, '0');
  hiBeats[k] = b.hi_narration.trim();
});

for (let i = 1; i <= 50; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 13 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch13",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "formula",
      statement: "American Option Pricing via Backward Induction: At each intermediate tree node, American option value equals max(Intrinsic Value, Discounted Expected Continuation Value). Early exercise is optimal if intrinsic exceeds continuation.",
      citation: { chapter: "13", section: "13.5", page: "322" }
    },
    {
      id: "F02",
      category: "market_rule",
      statement: "American Put Early Exercise Boundary: Early exercise becomes optimal at low stock price nodes where the interest earned on cash strike K exceeds the downside insurance value.",
      citation: { chapter: "13", section: "13.5", page: "323" }
    },
    {
      id: "F03",
      category: "market_rule",
      statement: "Dynamic Delta Hedging: Delta = (f_u - f_d) / (S_u - S_d) changes continuously across space and time (gamma effect), requiring continuous rebalancing of hedge shares to maintain riskless immunization.",
      citation: { chapter: "13", section: "13.6", page: "325" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Continuous Dividend Yield Extension: When an underlying asset provides continuous dividend yield q, the risk-neutral growth rate is (r - q), and risk-neutral probability p = (exp((r - q) * delta_t) - d) / (u - d).",
      citation: { chapter: "13", section: "13.8", page: "328" }
    },
    {
      id: "F05",
      category: "market_rule",
      statement: "Discrete Dividend Non-Recombining Dilemma: Known cash dividends drop stock price by dollar amount D, causing tree paths to diverge. Trees are built on dividend-adjusted stock price S* = S - PV(dividends) to preserve recombination.",
      citation: { chapter: "13", section: "13.9", page: "330" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Currency & Futures Option Extensions: Setting dividend yield q equal to foreign risk-free rate r_f prices currency options (Garman-Kohlhagen); setting drift to zero (q = r) prices futures options (Black-76).",
      citation: { chapter: "13", section: "13.10", page: "332" }
    },
    {
      id: "F07",
      category: "market_rule",
      statement: "Asymptotic Convergence: As the number of binomial steps N approaches infinity (delta_t -> 0), the Central Limit Theorem ensures the binomial distribution converges smoothly to the lognormal Black-Scholes-Merton model.",
      citation: { chapter: "13", section: "13.11", page: "334" }
    },
    {
      id: "F08",
      category: "market_rule",
      statement: "Computational Complexity: A recombining binomial tree with N steps has (N + 1)(N + 2) / 2 nodes and O(N^2) computational complexity, enabling real-time valuation on trading desks.",
      citation: { chapter: "13", section: "13.11", page: "335" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson Plan
const lessonPlan = {
  chapterId: "ch13",
  partId: "p2",
  title: "Binomial Trees - Part 2: Multi-Step Trees & American Options",
  estimatedDurationSec: 840,
  scenes: [
    { sceneId: "s00", title: "Breaking the European Barrier: The American Option Challenge", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "The Nodal Early Exercise Rule: Intrinsic vs Continuation Value", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "American Calls on Non-Dividend Stocks: Why Early Exercise Is Suboptimal", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "American Puts: The Optimal Early Exercise Boundary", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "Dynamic Delta Hedging on Trees: Rebalancing Across Space and Time", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Cox-Ross-Rubinstein (CRR) Volatility Calibration", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "Multi-Asset Lattice Generalization: Parameter a", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "Continuous Limit Convergence: Binomial to Black-Scholes-Merton", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "Lattice Granularity Trade-Off: Precision vs Computational Latency", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: American Put Early Exercise Decision", beats: ["s09b1", "s09b2", "s09b3", "s09b4"] },
    { sceneId: "s10", title: "Institutional Derivatives Architecture: Production Tree Engines", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Multi-Step Trees & American Options", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Math Blueprint
const mathBlueprint = {
  chapterId: "ch13",
  partId: "p2",
  formulas: [
    { id: "M01", latex: "f = \\max\\left( \\text{Payoff}_{\\text{early}}, \\, e^{-r \\Delta t}[p f_u + (1 - p) f_d] \\right)", description: "American Nodal Valuation Rule" },
    { id: "M02", latex: "u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = e^{-\\sigma \\sqrt{\\Delta t}} = \\frac{1}{u}", description: "CRR Volatility Parameterization" },
    { id: "M03", latex: "p = \\frac{a - d}{u - d}, \\quad a = e^{(r - q) \\Delta t}", description: "Generalized Risk-Neutral Probability" },
    { id: "M04", latex: "\\lim_{N \\to \\infty} c_{\\text{binomial}} = c_{\\text{Black-Scholes}}", description: "Continuous Limit Diffusion Convergence" }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical Script
const pedagogicalScript = {
  chapterId: "ch13",
  partId: "p2",
  scenes: lessonPlan.scenes.map(s => ({
    sceneId: s.sceneId,
    title: s.title,
    beats: s.beats.map(b => ({
      beatId: b,
      narrationEn: enBeats['b' + b.slice(-2)] || "Narration text",
      narrationHi: hiBeats['b' + b.slice(-2)] || "Narration text"
    }))
  }))
};
fs.writeFileSync(path.join(targetDir, '04_pedagogical_script.json'), JSON.stringify(pedagogicalScript, null, 2));

// 5. Episode Compliant Structure
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch13",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 13",
  partLabel: "Part 2",
  title: "Binomial Trees - Part 2: Multi-Step Trees & American Options",
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
    // Scene 0: Breaking the European Barrier (b01-b04)
    {
      id: "s00",
      index: 0,
      title: "Breaking the European Barrier: The American Option Challenge",
      purpose: "Establish why closed-form analytical formulas fail for American early exercise and how trees solve it",
      takeaways: [
        "American options grant the holder the right to exercise early at any point up to expiration",
        "Early exercise creates a moving free boundary problem that cannot be solved by simple closed-form integrals",
        "Binomial trees evaluate early exercise decision rules at every individual node via backward induction"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The American Option Valuation Landscape",
        steps: [
          { label: "1. European Restrictions", detail: "Exercise permitted only at final expiration t=T; analytically solved by Black-Scholes" },
          { label: "2. The American Freedom", detail: "Exercise allowed at any time t <= T; optimal stopping boundary must be discovered" },
          { label: "3. Analytical Breakdown", detail: "Early exercise creates a complex free boundary problem lacking simple closed-form formulas" },
          { label: "4. Discrete Lattice Solution", detail: "Binomial trees test optimal early exercise node-by-node backward in time" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "Introduce the American option early exercise dilemma",
          sourceFactIds: ["F01"],
          newTerms: ["American option"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "Explain why Black-Scholes formulas cannot handle early exercise",
          sourceFactIds: ["F01"],
          newTerms: ["Free boundary problem"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "Highlight the genius of backward induction on discrete lattices",
          sourceFactIds: ["F01"],
          newTerms: ["Nodal exercise check"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Outline Part 2 roadmap: nodal rules, puts vs calls, CRR calibration, and convergence",
          sourceFactIds: ["F01"],
          newTerms: ["Lattice engine roadmap"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 1: Nodal Early Exercise Rule (b05-b08)
    {
      id: "s01",
      index: 1,
      title: "The Nodal Early Exercise Rule: Intrinsic vs Continuation Value",
      purpose: "Formulate the fundamental node comparison: option value equals max of intrinsic payoff and continuation value",
      takeaways: [
        "At every intermediate node, compare intrinsic payoff (S - K for calls, K - S for puts) against continuation value",
        "Continuation value is discounted risk-neutral expectation: exp(-r * dt) * [p * f_u + (1 - p) * f_d]",
        "If intrinsic payoff exceeds continuation value, early exercise is optimal and sets the nodal value"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "continuation-val",
          heading: "Continuation Value (Hold)",
          tone: "neutral",
          points: [
            "Keep option alive to preserve remaining time value",
            "Discounted risk-neutral expected value from future nodes",
            "Formula: exp(-r * dt) * [p * f_u + (1 - p) * f_d]"
          ]
        },
        right: {
          id: "intrinsic-val",
          heading: "Immediate Exercise (Cash In)",
          tone: "positive",
          points: [
            "Exercise option right now and pocket cash payoff",
            "Call payoff: max(S - K, 0); Put payoff: max(K - S, 0)",
            "Optimal whenever intrinsic strictly exceeds continuation"
          ]
        },
        verdict: {
          id: "nodal-verdict",
          text: "Nodal value f = max(Intrinsic, Continuation) guarantees no American option trades below its immediate exercise value."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Formulate the universal nodal decision rule for American options",
          sourceFactIds: ["F01"],
          newTerms: ["Continuation value", "Intrinsic value"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Show how continuation value is calculated from future child nodes",
          sourceFactIds: ["F01"],
          newTerms: ["Discounted continuation expectation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Explain when early exercise triggers: intrinsic > continuation",
          sourceFactIds: ["F01"],
          newTerms: ["Early exercise trigger"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Summarize: the lattice automatically traces out the optimal early exercise boundary",
          sourceFactIds: ["F01"],
          newTerms: ["Optimal stopping discovery"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: American Calls on Non-Dividend Stocks (b09-b12)
    {
      id: "s02",
      index: 2,
      title: "American Calls on Non-Dividend Stocks: Why Early Exercise Is Suboptimal",
      purpose: "Prove why American calls on non-dividend paying stocks should never be exercised prior to expiration",
      takeaways: [
        "Exercising an American call early forfeits the remaining time value of the option",
        "Delaying payment of cash strike K earns risk-free interest, and provides downside stock protection",
        "On trees without dividends, American call continuation value strictly exceeds intrinsic value at every node"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Why American Calls Never Exercise Early (No Dividends)",
        steps: [
          { label: "1. Strike Payment Delay", detail: "Paying strike K today loses interest compared to paying K at final expiration t=T" },
          { label: "2. Downside Crash Protection", detail: "Holding call caps loss at premium paid; holding stock suffers unlimited downside crash" },
          { label: "3. Time Value Forfeiture", detail: "Immediate exercise surrenders all remaining volatility and time value" },
          { label: "4. Universal Theorem", detail: "American Call Price = European Call Price (C = c) at every node prior to expiration" }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "State the famous financial theorem: never exercise American calls early without dividends",
          sourceFactIds: ["F01"],
          newTerms: ["Call early exercise suboptimality"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Explain interest advantage: keep cash strike K invested earning risk-free rate r",
          sourceFactIds: ["F01"],
          newTerms: ["Strike payment deferral"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Demonstrate downside insurance protection retained by keeping the call alive",
          sourceFactIds: ["F01"],
          newTerms: ["Insurance retention"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Verify on binomial lattice: C equals c at every node, confirming equivalence",
          sourceFactIds: ["F01"],
          newTerms: ["Lattice call equivalence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: American Puts & Early Exercise Boundary (b13-b16)
    {
      id: "s03",
      index: 3,
      title: "American Puts: The Optimal Early Exercise Boundary",
      purpose: "Examine why American puts frequently exercise early and identify the critical price boundary S*",
      takeaways: [
        "Exercising a put early delivers cash strike K immediately, allowing the holder to earn interest at rate r",
        "When stock price S drops very low, downside price gains are capped (stock cannot drop below zero)",
        "At sufficiently low stock prices, interest earned on K outweighs time value, making early exercise optimal"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "deep-in-money",
          heading: "Deep-In-The-Money Put (S << K)",
          tone: "positive",
          points: [
            "Stock price is near zero; downside expansion is exhausted",
            "Immediate exercise collects strike K in cash right now",
            "Interest earned on K > remaining option insurance value -> Exercise!"
          ]
        },
        right: {
          id: "near-the-money",
          heading: "At-Or-Out-Of-The-Money Put (S >= K)",
          tone: "neutral",
          points: [
            "Option possesses substantial volatility time value",
            "Continuation value exceeds intrinsic payoff",
            "Optimal action: Keep holding option alive"
          ]
        },
        verdict: {
          id: "put-boundary-verdict",
          text: "Critical stock boundary S*(t) separates the early exercise region from the continuation region."
        }
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Contrast American puts with calls: puts DO benefit from early exercise",
          sourceFactIds: ["F02"],
          newTerms: ["American put early exercise"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Explain interest motivation: receiving cash strike K early and investing at risk-free rate",
          sourceFactIds: ["F02"],
          newTerms: ["Strike cash acceleration"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Examine deep-in-the-money put node where intrinsic payoff K - S dominates continuation",
          sourceFactIds: ["F02"],
          newTerms: ["Deep ITM put node"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Formulate the optimal early exercise boundary S*(t) discovered on the lattice",
          sourceFactIds: ["F02"],
          newTerms: ["Optimal early exercise boundary"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Dynamic Delta Hedging on Trees (b17-b20)
    {
      id: "s04",
      index: 4,
      title: "Dynamic Delta Hedging on Trees: Rebalancing Across Space and Time",
      purpose: "Explain how hedge ratio delta shifts at each node, demonstrating the necessity of dynamic rehedging",
      takeaways: [
        "Delta is calculated locally at every tree node: delta = (f_u - f_d) / (S_u - S_d)",
        "Because delta changes as stock price moves (gamma), the hedge must be continuously rebalanced",
        "Discrete binomial hedging converges to continuous delta-neutral hedging in the diffusion limit"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Dynamic Delta Rebalancing Workflow",
        steps: [
          { label: "1. Initial Hedge Setup (t = 0)", detail: "Calculate delta_0 = (f_u - f_d)/(S_u - S_d); buy delta_0 shares to hedge short option" },
          { label: "2. State Move Realization", detail: "Stock jumps to either S_u or S_d over step delta_t" },
          { label: "3. Gamma Delta Shift", detail: "Option delta changes to delta_u or delta_d; portfolio is no longer perfectly hedged" },
          { label: "4. Dynamic Rebalancing", detail: "Buy or sell shares to restore delta balance; rebalancing cost is funded by mark-to-market cash" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Demonstrate that delta is not static across tree nodes",
          sourceFactIds: ["F03"],
          newTerms: ["Nodal delta variation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Calculate delta at up node and down node, revealing curvature (gamma)",
          sourceFactIds: ["F03"],
          newTerms: ["Gamma curvature on lattice"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Explain why trading desks must execute rebalancing trades at every step",
          sourceFactIds: ["F03"],
          newTerms: ["Rebalancing transaction"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Connect discrete lattice rehedging to continuous Black-Scholes dynamic hedging",
          sourceFactIds: ["F03"],
          newTerms: ["Continuous rehedging limit"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: CRR Volatility Calibration (b21-b24)
    {
      id: "s05",
      index: 5,
      title: "Cox-Ross-Rubinstein (CRR) Volatility Calibration",
      purpose: "Derive the mathematical matching of u and d to match continuous volatility sigma: u = exp(sigma * sqrt(dt))",
      takeaways: [
        "To match continuous lognormal diffusion, tree parameters u and d must match variance sigma^2 * dt",
        "Cox, Ross, and Rubinstein set u = exp(sigma * sqrt(dt)) and d = 1 / u = exp(-sigma * sqrt(dt))",
        "Symmetric geometry ensures recombining condition u * d = 1 holds perfectly, anchoring center nodes"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The CRR Parameter Calibration Equations",
        formula: {
          latex: "u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = e^{-\\sigma \\sqrt{\\Delta t}} = \\frac{1}{u}",
          expression: "u = exp(sigma * sqrt(dt)); d = exp(-sigma * sqrt(dt)) = 1 / u",
          solvesFor: "u and d",
          variables: [
            { symbol: "u", latex: "u", meaning: "Upward Price Multiplier", unit: "ratio" },
            { symbol: "d", latex: "d", meaning: "Downward Price Multiplier", unit: "ratio" },
            { symbol: "sigma", latex: "\\sigma", meaning: "Annualized Underlying Asset Volatility", unit: "pct" },
            { symbol: "Delta t", latex: "\\Delta t", meaning: "Time Step Length in Years", unit: "years" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "\\sigma \\sqrt{\\Delta t}", meaning: "Diffusion volatility dispersion over interval delta_t", unit: "ratio" },
          { id: "p2", symbolLatex: "u \\cdot d = 1", meaning: "Recombining condition: upward move cancelled by downward move returns to original price", unit: "ratio" },
          { id: "p3", symbolLatex: "p = \\frac{e^{r \\Delta t} - d}{u - d}", meaning: "Risk-neutral probability matching expected risk-free drift", unit: "probability" }
        ],
        note: "As delta_t -> 0, the discrete binomial return variance exactly converges to the continuous variance sigma^2 * delta_t."
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Pose the calibration challenge: how to choose u and d to match real-world volatility",
          sourceFactIds: ["F07"],
          newTerms: ["Volatility calibration"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Present the Cox-Ross-Rubinstein parameterization: u = exp(sigma * sqrt(dt))",
          sourceFactIds: ["F07"],
          newTerms: ["CRR parameters"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Show why d = 1/u creates symmetric recombining lattices",
          sourceFactIds: ["F07"],
          newTerms: ["Symmetric lattice centering"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Explain how higher volatility sigma widens the tree branching cone",
          sourceFactIds: ["F07"],
          newTerms: ["Volatility cone dispersion"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Multi-Asset Lattice Generalization: Parameter a (b25-b28)
    {
      id: "s06",
      index: 6,
      title: "Multi-Asset Lattice Generalization: Parameter a",
      purpose: "Generalize the risk-neutral probability p = (a - d)/(u - d) to incorporate dividends, currencies, and futures",
      takeaways: [
        "Parameter a represents the risk-neutral expected growth factor: a = exp((r - q) * dt)",
        "For non-dividend stock: q = 0 -> a = exp(r * dt)",
        "For dividend stock q > 0; for currency options q = r_f; for futures options q = r (a = 1)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Universal Drift Parameter a",
        formula: {
          latex: "p = \\frac{a - d}{u - d}, \\quad a = e^{(r - q) \\Delta t}",
          expression: "p = (a - d) / (u - d); a = exp((r - q) * dt)",
          solvesFor: "Universal p and a",
          variables: [
            { symbol: "a", latex: "a", meaning: "Risk-Neutral Growth Factor Over Step", unit: "factor" },
            { symbol: "r", latex: "r", meaning: "Domestic Risk-Free Interest Rate", unit: "rate" },
            { symbol: "q", latex: "q", meaning: "Continuous Dividend Yield or Cost-of-Carry", unit: "rate" },
            { symbol: "p", latex: "p", meaning: "Universal Synthetic Risk-Neutral Probability", unit: "probability" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "a = e^{r \\Delta t}", meaning: "Standard non-dividend paying stock (q = 0)", unit: "factor" },
          { id: "p2", symbolLatex: "a = e^{(r - r_f) \\Delta t}", meaning: "Currency options: dividend yield replaced by foreign rate r_f", unit: "factor" },
          { id: "p3", symbolLatex: "a = 1", meaning: "Futures options: futures cost nothing to enter and have zero drift (q = r)", unit: "factor" }
        ],
        note: "Parameter a cleanly unifies stock options, dividend indexes, foreign currencies, and commodity futures into one identical tree engine."
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce parameter a as the unified risk-neutral drift factor",
          sourceFactIds: ["F04", "F06"],
          newTerms: ["Parameter a", "Unified drift factor"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Apply parameter a to continuous dividend yields: a = exp((r - q)*dt)",
          sourceFactIds: ["F04"],
          newTerms: ["Continuous dividend drift"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Extend to FX options: replace q with foreign interest rate r_f",
          sourceFactIds: ["F06"],
          newTerms: ["Currency tree drift"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Extend to futures contracts: set a = 1 since futures earn zero cost-of-carry",
          sourceFactIds: ["F06"],
          newTerms: ["Futures tree drift a=1"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Continuous Limit Convergence (b29-b32)
    {
      id: "s07",
      index: 7,
      title: "Continuous Limit Convergence: Binomial to Black-Scholes-Merton",
      purpose: "Demonstrate that as step size delta_t approaches zero (N -> infinity), binomial prices converge to Black-Scholes",
      takeaways: [
        "As time step delta_t approaches zero (number of steps N -> infinity), tree converges to continuous diffusion",
        "The discrete binomial probability distribution converges to the continuous lognormal distribution by the Central Limit Theorem",
        "European option prices computed on trees converge exactly to the analytical Black-Scholes-Merton formula"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "discrete-lattice",
          heading: "Discrete Binomial Lattice",
          tone: "neutral",
          points: [
            "Time evolves in discrete steps delta_t",
            "Price branches to u and d states",
            "Produces discrete binomial distribution",
            "Solves American early exercise naturally"
          ]
        },
        right: {
          id: "continuous-bsm",
          heading: "Continuous Black-Scholes-Merton",
          tone: "positive",
          points: [
            "Continuous geometric Brownian motion (dt -> 0)",
            "Lognormal continuous price probability density",
            "Instantaneous closed-form formulas",
            "Limited primarily to European exercises"
          ]
        },
        verdict: {
          id: "convergence-verdict",
          text: "Binomial pricing is not an approximation of Black-Scholes; Black-Scholes is the continuous limit of binomial trees."
        }
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Explore the continuous limit as step count N increases from 10 to 1,000",
          sourceFactIds: ["F07"],
          newTerms: ["Continuous limit"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Show binomial distribution smoothing into continuous lognormal bell curve",
          sourceFactIds: ["F07"],
          newTerms: ["Lognormal distribution convergence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Confirm European call price on tree converges to exact Black-Scholes value",
          sourceFactIds: ["F07"],
          newTerms: ["Black-Scholes convergence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Highlight profound insight: discrete lattice is the foundational parent of continuous pricing",
          sourceFactIds: ["F07"],
          newTerms: ["Foundational parent theory"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Lattice Granularity Trade-Off (b33-b36)
    {
      id: "s08",
      index: 8,
      title: "Lattice Granularity Trade-Off: Precision vs Computational Latency",
      purpose: "Analyze convergence oscillations, node count complexity O(N^2), and industrial trade-offs",
      takeaways: [
        "Binomial tree prices oscillate around the true price as strike K shifts across discrete terminal nodes",
        "Node count scales quadratically: (N + 1)(N + 2) / 2 nodes requires O(N^2) computational time",
        "Production trading desks typically utilize N = 50 to 200 steps to balance sub-cent accuracy with sub-millisecond execution"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Computational Scaling Curve",
        steps: [
          { label: "N = 30 Steps (496 nodes)", detail: "Execution < 0.1 ms; error +/- 1.5 cents; introduces visible pricing oscillation" },
          { label: "N = 100 Steps (5,151 nodes)", detail: "Execution ~ 1 ms; error +/- 0.1 cent; institutional standard for vanilla American options" },
          { label: "N = 500 Steps (125,751 nodes)", detail: "Execution ~ 25 ms; error < 0.01 cent; used for high-precision model validation" },
          { label: "Trinomial / Crank-Nicolson", detail: "Three-branch lattices or implicit finite difference PDE solvers accelerate convergence" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Examine tree price oscillations around the true continuous value",
          sourceFactIds: ["F07", "F08"],
          newTerms: ["Sawtooth oscillation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Quantify computational complexity: (N+1)(N+2)/2 nodes grows as O(N^2)",
          sourceFactIds: ["F08"],
          newTerms: ["Quadratic complexity O(N^2)"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Present industrial sweet spot: N = 50 to 150 steps for sub-millisecond pricing",
          sourceFactIds: ["F08"],
          newTerms: ["Industrial step sweet spot"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Preview advanced alternatives: trinomial trees and finite difference PDE engines",
          sourceFactIds: ["F08"],
          newTerms: ["Trinomial trees", "Finite difference"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 9: Active Recall Scenario (b37-b40)
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: American Put Early Exercise Decision",
      purpose: "Test student ability to compute continuation value and determine whether early exercise is optimal",
      takeaways: [
        "Early exercise is optimal if and only if Intrinsic Value > Continuation Value",
        "Intrinsic value for a put is max(K - S, 0); continuation value is discounted expected child payoff",
        "Early exercise captures cash strike immediately, avoiding the loss of interest"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A stock is at S = $40. Strike K = $50. If child node option values are f_u = $8 and f_d = $12 with p = 0.50, r = 6%, dt = 0.5, should the American put be exercised?",
        options: [
          { id: "opt-a", text: "No: Intrinsic is $10 while continuation value is $10.50, so keep holding", correct: false },
          { id: "opt-b", text: "Yes: Intrinsic is $10.00 while discounted continuation value is $9.70, so exercise immediately", correct: true },
          { id: "opt-c", text: "No: American options should never be exercised early regardless of intrinsic value", correct: false },
          { id: "opt-d", text: "Yes: Because put delta is always negative, it must be exercised at every step", correct: false }
        ],
        explanation: "Immediate exercise delivers K - S = $50 - $40 = $10.00. Continuation value is exp(-0.06 * 0.5) * [0.5 * 8 + 0.5 * 12] = exp(-0.03) * 10 = $9.704. Because $10.00 > $9.704, immediate early exercise is optimal!"
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Present the numerical challenge: S=$40, K=$50, child payoffs $8 and $12",
          sourceFactIds: ["F01", "F02"],
          newTerms: ["Nodal decision challenge"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Calculate intrinsic value: $50 - $40 = $10.00",
          sourceFactIds: ["F01"],
          newTerms: ["Calculated intrinsic payoff"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Calculate discounted continuation value: exp(-0.03) * $10 = $9.704",
          sourceFactIds: ["F01"],
          newTerms: ["Calculated continuation value"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Conclude: $10.00 > $9.70 triggers immediate early exercise, unlocking $0.30 surplus",
          sourceFactIds: ["F01", "F02"],
          newTerms: ["Optimal exercise decision"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Institutional Architecture: Production Tree Engines (b41-b44)
    {
      id: "s10",
      index: 10,
      title: "Institutional Derivatives Architecture: Production Tree Engines",
      purpose: "Examine how investment banks build vectorized C++/CUDA binomial engines to price thousands of options",
      takeaways: [
        "Trading desks implement trees using vectorized rolling arrays rather than allocating millions of pointer objects",
        "Backward induction updates an in-place 1D array of size N+1 from terminal payoffs back to root index 0",
        "GPU parallelism and CUDA compute thousands of binomial trees simultaneously in real time"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "naive-oop",
          heading: "Naive Object-Oriented Tree",
          tone: "trap",
          points: [
            "Allocates heap Node objects with pointers",
            "Suffers massive cache misses and memory overhead",
            "Incurs gigabytes of RAM for large trees"
          ]
        },
        right: {
          id: "vectorized-engine",
          heading: "Vectorized Production Engine",
          tone: "positive",
          points: [
            "Single contiguous 1D array of length N + 1",
            "In-place backward rollback: values[j] updated in loop",
            "Fits inside CPU L1 cache; easily accelerated on GPU CUDA"
          ]
        },
        verdict: {
          id: "architecture-verdict",
          text: "In-place 1D memory buffers transform binomial pricing into lightning-fast sub-microsecond computations."
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b41 }, hi: { display: hiBeats.b41 } },
          onScreenIntent: "Explore how Wall Street quantitative trading desks implement production tree engines",
          sourceFactIds: ["F08"],
          newTerms: ["Production tree engine"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b42 }, hi: { display: hiBeats.b42 } },
          onScreenIntent: "Highlight the memory architecture: 1D array rollback replacing naive node objects",
          sourceFactIds: ["F08"],
          newTerms: ["In-place 1D buffer"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b43 }, hi: { display: hiBeats.b43 } },
          onScreenIntent: "Showcase SIMD vectorization and GPU CUDA acceleration for portfolio-wide risk",
          sourceFactIds: ["F08"],
          newTerms: ["GPU CUDA tree pricing"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b44 }, hi: { display: hiBeats.b44 } },
          onScreenIntent: "Summarize: software engineering mastery bridges financial theory into trading execution",
          sourceFactIds: ["F08"],
          newTerms: ["Quantitative software engineering"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b45-b50)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Multi-Step Trees & American Options",
      purpose: "Consolidate the 8 foundational laws of multi-step trees, American options, and numerical calibration",
      takeaways: [
        "American options are valued via backward induction with nodal rule f = max(Intrinsic, Continuation)",
        "CRR parameterization u = exp(sigma * sqrt(dt)) guarantees continuous variance matching and recombination",
        "Chapter 14 advances into continuous stochastic calculus, Ito's Lemma, and the Black-Scholes-Merton PDE"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The 8 Laws of Multi-Step Binomial Trees",
        rules: [
          { id: "r1", title: "1. American Nodal Rule", summary: "Option value f = max(Intrinsic, Continuation) discovers optimal exercise boundary." },
          { id: "r2", title: "2. Call Suboptimality", summary: "American calls on non-dividend stocks should never be exercised early (C = c)." },
          { id: "r3", title: "3. Put Acceleration", summary: "Deep ITM American puts exercise early to collect cash strike K and earn risk-free rate." },
          { id: "r4", title: "4. Dynamic Rehedging", summary: "Delta changes across space and time, requiring continuous share rebalancing." },
          { id: "r5", title: "5. CRR Calibration", summary: "u = exp(sigma * sqrt(dt)) and d = 1/u match continuous variance and keep lattice symmetric." },
          { id: "r6", title: "6. Universal Drift a", summary: "Parameter a = exp((r - q)*dt) unifies stocks, dividends, FX, and futures." },
          { id: "r7", title: "7. Asymptotic Convergence", summary: "As step size dt -> 0, binomial distribution converges to continuous Black-Scholes." },
          { id: "r8", title: "8. Quadratic Complexity", summary: "(N+1)(N+2)/2 nodes creates O(N^2) complexity, executed via in-place 1D buffers." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b45 }, hi: { display: hiBeats.b45 } },
          onScreenIntent: "Synthesize the comprehensive multi-step American option framework",
          sourceFactIds: ["F01"],
          newTerms: ["Executive synthesis"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b46 }, hi: { display: hiBeats.b46 } },
          onScreenIntent: "Review Rules 1 and 2: American nodal rule and call early exercise suboptimality",
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
          narration: { en: { display: enBeats.b47 }, hi: { display: hiBeats.b47 } },
          onScreenIntent: "Review Rules 3 and 4: put early exercise boundary and dynamic delta rebalancing",
          sourceFactIds: ["F02", "F03"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b48 }, hi: { display: hiBeats.b48 } },
          onScreenIntent: "Review Rules 5 and 6: CRR volatility calibration and universal drift parameter a",
          sourceFactIds: ["F04", "F06", "F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b49 }, hi: { display: hiBeats.b49 } },
          onScreenIntent: "Review Rules 7 and 8: asymptotic Black-Scholes convergence and quadratic complexity",
          sourceFactIds: ["F07", "F08"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b6",
          speaker: "mentor",
          narration: { en: { display: enBeats.b50 }, hi: { display: hiBeats.b50 } },
          onScreenIntent: "Conclude Chapter 13 and preview Chapter 14: Wiener Processes and Ito's Lemma",
          sourceFactIds: ["F07"],
          newTerms: ["Chapter 14 preview"],
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

console.log('Chapter 13 Part 2 successfully built and registered!');
