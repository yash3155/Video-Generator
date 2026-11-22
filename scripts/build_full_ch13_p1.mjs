import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch13/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_13/Part_01/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap13_part01/episode_raw.json', 'utf8'));

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

// 1. Facts with full numerical grounding from Chapter 13 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch13",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "market_rule",
      statement: "The One-Step Binomial Model assumes a stock price S0 can move over discrete time interval delta_t to either S0 * u (up state) or S0 * d (down state), where u > 1 and d < 1.",
      citation: { chapter: "13", section: "13.1", page: "311" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "No-Arbitrage Delta Hedging Ratio: A riskless portfolio consists of long delta shares of stock and short one call option. To ensure identical portfolio value across states, delta = (c_u - c_d) / (S0 * u - S0 * d).",
      citation: { chapter: "13", section: "13.1", page: "312" }
    },
    {
      id: "F03",
      category: "market_rule",
      statement: "Risk-Neutral Valuation Principle: Derivative payoffs can be priced by discounting their expected future payoffs at the risk-free rate r, assuming all assets earn the risk-free return in expectation.",
      citation: { chapter: "13", section: "13.2", page: "314" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Risk-Neutral Probability: The synthetic probability of an upward move is p = (exp(r * delta_t) - d) / (u - d), where 0 < p < 1.",
      citation: { chapter: "13", section: "13.2", page: "315" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "One-Step Call Option Valuation: European call price is c = exp(-r * delta_t) * [p * c_u + (1 - p) * c_d]. Option value is invariant to real-world subjective probabilities.",
      citation: { chapter: "13", section: "13.2", page: "315" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Cox, Ross & Rubinstein (CRR) Volatility Calibration: Parameters match continuous lognormal diffusion: u = exp(sigma * sqrt(delta_t)) and d = 1 / u = exp(-sigma * sqrt(delta_t)).",
      citation: { chapter: "13", section: "13.4", page: "320" }
    },
    {
      id: "F07",
      category: "market_rule",
      statement: "Two-Step Recombining Trees: Price moves over 2 periods produce three terminal states (u^2, ud, d^2) rather than four because u*d = d*u, keeping computational complexity linear O(N).",
      citation: { chapter: "13", section: "13.3", page: "317" }
    },
    {
      id: "F08",
      category: "algorithm",
      statement: "Backward Induction Rollback: Option terminal payoffs are computed at expiration t = 2*delta_t and discounted recursively backward node-by-node to determine the fair initial option price at t = 0.",
      citation: { chapter: "13", section: "13.3", page: "318" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson Plan
const lessonPlan = {
  chapterId: "ch13",
  partId: "p1",
  title: "Binomial Trees - Part 1: One-Step Model & Risk-Neutral Valuation",
  estimatedDurationSec: 840,
  scenes: [
    { sceneId: "s00", title: "The Discrete Revolution: The Binomial Tree Breakthrough", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "The One-Step Model: Geometry of the Discrete World", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "The Replicating Portfolio: Deriving Delta", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "The Riskless Portfolio & Discrete Option Valuation", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "The Risk-Neutral Valuation Principle: The Grand Paradigm Shift", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "The Risk-Neutral Probability: Mathematical Formulation", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "Numerical Walkthrough: Pricing a European Call", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "Extending to Two Steps: The Recombining Lattice", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "Backward Induction: Multi-Period Rollback Algorithm", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: One-Step Binomial Call Valuation", beats: ["s09b1", "s09b2", "s09b3", "s09b4"] },
    { sceneId: "s10", title: "Put Options & Recombining Efficiency on Trees", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Binomial Option Valuation", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Math Blueprint
const mathBlueprint = {
  chapterId: "ch13",
  partId: "p1",
  formulas: [
    { id: "M01", latex: "S_u = S_0 u, \\quad S_d = S_0 d \\quad (u > 1, d < 1)", description: "Stock Price Evolution" },
    { id: "M02", latex: "\\Delta = \\frac{c_u - c_d}{S_0 u - S_0 d}", description: "Hedge Ratio Delta" },
    { id: "M03", latex: "p = \\frac{e^{r \\Delta t} - d}{u - d}", description: "Risk-Neutral Probability" },
    { id: "M04", latex: "c = e^{-r \\Delta t} [p c_u + (1 - p) c_d]", description: "One-Step Call Option Value" },
    { id: "M05", latex: "u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = e^{-\\sigma \\sqrt{\\Delta t}} = \\frac{1}{u}", description: "CRR Volatility Calibration" }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical Script
const pedagogicalScript = {
  chapterId: "ch13",
  partId: "p1",
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
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 13",
  partLabel: "Part 1",
  title: "Binomial Trees - Part 1: One-Step Model & Risk-Neutral Valuation",
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
    // Scene 0: Discrete Revolution (b01-b04)
    {
      id: "s00",
      index: 0,
      title: "The Discrete Revolution: The Binomial Tree Breakthrough",
      purpose: "Establish how Cox, Ross, and Rubinstein simplified continuous option calculus into discrete algebra",
      takeaways: [
        "In 1979, Cox, Ross, and Rubinstein introduced binomial trees, transforming option calculus into discrete algebra",
        "Continuous Black-Scholes equations are derived cleanly as the continuous limit of discrete binomial trees",
        "Binomial lattices allow transparent valuation of American early exercise and path-dependent options"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Evolution of Quantitative Option Pricing",
        steps: [
          { label: "1. Black-Scholes Calculus (1973)", detail: "Continuous stochastic differential equations and partial differential equations" },
          { label: "2. Binomial Discrete Model (1979)", detail: "Cox-Ross-Rubinstein discrete lattice converting calculus into high school algebra" },
          { label: "3. No-Arbitrage Replication", detail: "Construct riskless hedging portfolio eliminating underlying price uncertainty" },
          { label: "4. Multi-Step Diffusion Limit", detail: "As time step delta_t approaches zero, tree converges exactly to Black-Scholes-Merton" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "Introduce the 1979 Cox-Ross-Rubinstein breakthrough",
          sourceFactIds: ["F01"],
          newTerms: ["Binomial tree"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "Contrast continuous calculus with intuitive discrete lattice trees",
          sourceFactIds: ["F01"],
          newTerms: ["Discrete lattice"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "Highlight why binomial models handle American early exercise where formulas fail",
          sourceFactIds: ["F01"],
          newTerms: ["Early exercise"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Outline Part 1 roadmap: delta hedging, risk-neutral valuation, and rollback",
          sourceFactIds: ["F01"],
          newTerms: ["Risk-neutral valuation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 1: One-Step Model (b05-b08)
    {
      id: "s01",
      index: 1,
      title: "The One-Step Model: Geometry of the Discrete World",
      purpose: "Define the fundamental one-step binomial geometry and price multipliers u and d",
      takeaways: [
        "In one step delta_t, stock price S0 can only branch to S0 * u (up state) or S0 * d (down state)",
        "Parameters satisfy u > 1 and d < 1, spanning both upward and downward price trajectories",
        "Option payoffs c_u and c_d at expiration are known with deterministic precision"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "up-state",
          heading: "Upward Node (S0 * u)",
          tone: "positive",
          points: [
            "Stock climbs to S0 * u where u > 1",
            "Call option payoff is c_u = max(S0 * u - K, 0)",
            "Upside state represents bullish market realization"
          ]
        },
        right: {
          id: "down-state",
          heading: "Downward Node (S0 * d)",
          tone: "trap",
          points: [
            "Stock drops to S0 * d where d < 1",
            "Call option payoff is c_d = max(S0 * d - K, 0)",
            "Downside state represents bearish market realization"
          ]
        },
        verdict: {
          id: "geometry-verdict",
          text: "Discrete branching simplifies continuous price dispersion into two deterministic terminal payoff outcomes."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Set up the one-step stock price branching structure",
          sourceFactIds: ["F01"],
          newTerms: ["Up multiplier u", "Down multiplier d"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Define call payoffs c_u and c_d at the terminal branches",
          sourceFactIds: ["F01"],
          newTerms: ["Terminal call payoff"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Emphasize how simplicity unlocks rigorous no-arbitrage replication",
          sourceFactIds: ["F01"],
          newTerms: ["No-arbitrage replication"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Preview replicating portfolio derivation in the next scene",
          sourceFactIds: ["F01"],
          newTerms: ["Delta hedge"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: The Replicating Portfolio & Delta (b09-b12)
    {
      id: "s02",
      index: 2,
      title: "The Replicating Portfolio: Deriving Delta",
      purpose: "Derive the exact formula for delta by equating portfolio payoffs across up and down states",
      takeaways: [
        "A hedging portfolio consists of long delta shares of stock and short one call option",
        "Equating up payoff (S0*u*delta - c_u) and down payoff (S0*d*delta - c_d) completely eliminates market risk",
        "Delta is strictly the ratio of option payoff spread to stock price spread: delta = (c_u - c_d)/(S0*u - S0*d)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The No-Arbitrage Delta Hedging Equation",
        formula: {
          latex: "\\Delta = \\frac{c_u - c_d}{S_0 u - S_0 d}",
          expression: "Delta = (c_u - c_d) / (S0 * u - S0 * d)",
          solvesFor: "Delta",
          variables: [
            { symbol: "Delta", latex: "\\Delta", meaning: "Number of Underlying Shares Purchased", unit: "shares" },
            { symbol: "c_u - c_d", latex: "c_u - c_d", meaning: "Spread in Option Terminal Payoffs", unit: "USD" },
            { symbol: "S_0 u - S_0 d", latex: "S_0 u - S_0 d", meaning: "Spread in Underlying Stock Prices", unit: "USD" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "S_0 u \\Delta - c_u", meaning: "Terminal portfolio value in the up state", unit: "USD" },
          { id: "p2", symbolLatex: "S_0 d \\Delta - c_d", meaning: "Terminal portfolio value in the down state", unit: "USD" },
          { id: "p3", symbolLatex: "\\Delta = \\frac{c_u - c_d}{S_0(u - d)}", meaning: "Exact share quantity that renders portfolio completely riskless", unit: "shares" }
        ],
        note: "Delta measures option price sensitivity per dollar move in underlying stock, establishing perfect state replication."
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Set up the portfolio: long delta shares of stock and short one call option",
          sourceFactIds: ["F02"],
          newTerms: ["Hedge portfolio"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Express terminal portfolio payoffs in up and down branches",
          sourceFactIds: ["F02"],
          newTerms: ["Terminal state value"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Equate up and down payoffs to eliminate randomness and solve for delta",
          sourceFactIds: ["F02"],
          newTerms: ["Riskless hedge condition"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "State delta ratio: payoff difference divided by stock price difference",
          sourceFactIds: ["F02"],
          newTerms: ["Delta hedge ratio"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Riskless Portfolio & Discrete Valuation (b13-b16)
    {
      id: "s03",
      index: 3,
      title: "The Riskless Portfolio & Discrete Option Valuation",
      purpose: "Discount the riskless portfolio payoff at the risk-free rate to isolate the fair call option price",
      takeaways: [
        "Because the portfolio payoff is identical in both states, it is 100% riskless and must earn risk-free rate r",
        "Present value of the portfolio at t=0 equals terminal payoff discounted by exp(-r * delta_t)",
        "Rearranging yields the option price without making any assumption about investor risk preferences"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "portfolio-cost",
          heading: "Initial Setup Cost (t = 0)",
          tone: "neutral",
          points: [
            "Portfolio value is S0 * Delta - c",
            "Requires purchasing Delta shares at price S0",
            "Offset by cash premium received from selling call c"
          ]
        },
        right: {
          id: "guaranteed-payoff",
          heading: "Guaranteed Payoff (t = delta_t)",
          tone: "positive",
          points: [
            "Certain terminal cash flow: S0 * u * Delta - c_u",
            "Risk is zero: exactly identical in down state",
            "Must discount to present at risk-free rate exp(-r * delta_t)"
          ]
        },
        verdict: {
          id: "valuation-verdict",
          text: "No-arbitrage enforces S0 * Delta - c = (S0 * u * Delta - c_u) * exp(-r * delta_t), locking in option value c."
        }
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Demonstrate that the hedged portfolio has zero variance and zero market risk",
          sourceFactIds: ["F02"],
          newTerms: ["Zero variance portfolio"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Apply no-arbitrage rule: riskless portfolio must grow exactly at risk-free rate r",
          sourceFactIds: ["F02", "F03"],
          newTerms: ["No-arbitrage pricing"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Discount terminal payoff to t=0 using continuous discounting exp(-r * delta_t)",
          sourceFactIds: ["F02"],
          newTerms: ["Continuous discounting"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Rearrange terms to isolate option price c as a function of S0, u, d, r, and payoffs",
          sourceFactIds: ["F02"],
          newTerms: ["Option price isolation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Risk-Neutral Valuation Principle (b17-b20)
    {
      id: "s04",
      index: 4,
      title: "The Risk-Neutral Valuation Principle: The Grand Paradigm Shift",
      purpose: "Unpack why option prices do not depend on real-world subjective probabilities or risk aversion",
      takeaways: [
        "Dynamic delta hedging immunizes the option against stock direction, rendering real-world probabilities irrelevant",
        "Investors may be risk-averse, risk-seeking, or risk-neutral, but option prices remain identical",
        "We can mathematically price derivatives assuming everyone is risk-neutral and all assets earn rate r"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Logic of Risk-Neutral Pricing",
        steps: [
          { label: "1. Perfect Replication", detail: "Option payoff is identically replicated by stock and risk-free cash borrowing" },
          { label: "2. Subjective Independence", detail: "Real-world bullish/bearish probability p_real drops out of the equation entirely" },
          { label: "3. Synthetic Risk-Neutral World", detail: "Assume expected asset return equals risk-free rate r across all securities" },
          { label: "4. Discounted Expectation", detail: "Fair option value is expected payoff under synthetic probability p discounted at r" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Reveal the astonishing mathematical result: real-world probability does not enter formula",
          sourceFactIds: ["F03", "F08"],
          newTerms: ["Real-world probability independence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Explain why replication hedges away subjective market beliefs and optimism",
          sourceFactIds: ["F03"],
          newTerms: ["Dynamic hedging invariance"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Define the risk-neutral world where expected stock return equals risk-free rate r",
          sourceFactIds: ["F03"],
          newTerms: ["Risk-neutral measure Q"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "State the core pricing law: option price equals discounted expected risk-neutral payoff",
          sourceFactIds: ["F03"],
          newTerms: ["Discounted expected payoff"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Risk-Neutral Probability (b21-b24)
    {
      id: "s05",
      index: 5,
      title: "The Risk-Neutral Probability: Mathematical Formulation",
      purpose: "Formulate synthetic probability p and the one-step option pricing equation",
      takeaways: [
        "Synthetic probability p = (exp(r * delta_t) - d) / (u - d) ensures expected stock price grows at rate r",
        "Probability p is not a real-world forecast; it is an internal mathematical pricing weight",
        "One-step option formula is c = exp(-r * delta_t) * [p * c_u + (1 - p) * c_d]"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Risk-Neutral Probability & Option Valuation Formula",
        formula: {
          latex: "p = \\frac{e^{r \\Delta t} - d}{u - d}, \\quad c = e^{-r \\Delta t} [p c_u + (1 - p) c_d]",
          expression: "p = (exp(r * dt) - d) / (u - d); c = exp(-r * dt) * (p * c_u + (1 - p) * c_d)",
          solvesFor: "p and c",
          variables: [
            { symbol: "p", latex: "p", meaning: "Synthetic Risk-Neutral Upward Probability", unit: "probability" },
            { symbol: "e^(r*dt)", latex: "e^{r \\Delta t}", meaning: "Risk-Free Compounding Factor over Period", unit: "factor" },
            { symbol: "u, d", latex: "u, d", meaning: "Up and Down Price Multipliers", unit: "ratio" },
            { symbol: "c", latex: "c", meaning: "Fair European Call Option Price", unit: "USD" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "e^{r \\Delta t} - d", meaning: "Excess growth over the down state", unit: "ratio" },
          { id: "p2", symbolLatex: "u - d", meaning: "Total price dispersion range", unit: "ratio" },
          { id: "p3", symbolLatex: "p c_u + (1 - p) c_d", meaning: "Expected option terminal payoff under measure Q", unit: "USD" }
        ],
        note: "Synthetic probability p satisfies 0 < p < 1 whenever d < exp(r * delta_t) < u, which prevents riskless arbitrage."
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Define synthetic risk-neutral probability p mathematically",
          sourceFactIds: ["F04"],
          newTerms: ["Synthetic probability p"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Clarify that p is a mathematical pricing parameter, not real subjective probability",
          sourceFactIds: ["F04"],
          newTerms: ["Pricing weight"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Present the general one-step option valuation equation",
          sourceFactIds: ["F05"],
          newTerms: ["One-step binomial formula"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Emphasize how this simple equation scales seamlessly into complex multi-period trees",
          sourceFactIds: ["F05"],
          newTerms: ["Lattice scaling"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Numerical Walkthrough (b25-b28)
    {
      id: "s06",
      index: 6,
      title: "Numerical Walkthrough: Pricing a European Call",
      purpose: "Execute a concrete numerical example with John Hull parameters: S0=$20, u=1.1, d=0.9, K=$21, r=12%",
      takeaways: [
        "Given S0=$20, u=1.1, d=0.9, K=$21, r=12%, T=0.25 years: up price is $22 (c_u=$1), down price is $18 (c_d=$0)",
        "Delta ratio is ($1 - $0) / ($22 - $18) = 0.25 shares",
        "Risk-neutral probability p = 0.6523; discounted option value is c = $0.633"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Hull Numerical Example: Valuation of $21 Call",
        formula: {
          latex: "c = e^{-0.12 \\times 0.25} [0.6523 \\times 1 + (1 - 0.6523) \\times 0] = \\$0.633",
          expression: "c = exp(-0.12 * 0.25) * (0.6523 * 1 + 0.3477 * 0) = 0.633",
          solvesFor: "c = $0.633",
          variables: [
            { symbol: "S0", latex: "S_0 = \\$20", meaning: "Initial Stock Price", unit: "USD" },
            { symbol: "u, d", latex: "u = 1.10, d = 0.90", meaning: "Price Moves to $22 and $18", unit: "ratio" },
            { symbol: "K, r, T", latex: "K = \\$21, r = 12\\%, T = 3\\text{ mo}", meaning: "Contract Terms", unit: "terms" },
            { symbol: "Delta", latex: "\\Delta = 0.25", meaning: "Hedge: Buy 0.25 Shares per Call Shorted", unit: "shares" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "S_u = \\$22, c_u = \\$1; \\quad S_d = \\$18, c_d = \\$0", meaning: "Terminal payoffs at 3-month expiration", unit: "USD" },
          { id: "p2", symbolLatex: "p = \\frac{e^{0.12 \\times 0.25} - 0.90}{1.10 - 0.90} = 0.6523", meaning: "Synthetic risk-neutral up probability", unit: "probability" },
          { id: "p3", symbolLatex: "c = e^{-0.03} \\times 0.6523 = \\$0.633", meaning: "Fair call option market premium", unit: "USD" }
        ],
        note: "Arbitrage proof: At c = $0.633, purchasing 0.25 shares ($5.00) funded by selling 1 call ($0.633) and borrowing $4.367 yields zero risk."
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Present the numerical problem parameters from John Hull Chapter 13",
          sourceFactIds: ["F01", "F02"],
          newTerms: ["Numerical parameters"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Calculate delta: ($1 - $0) / ($22 - $18) = 0.25 shares",
          sourceFactIds: ["F02"],
          newTerms: ["Calculated delta"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Calculate risk-neutral probability p = 0.6523",
          sourceFactIds: ["F04"],
          newTerms: ["Calculated probability"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Discount expected payoff to arrive at exact call price $0.633",
          sourceFactIds: ["F05"],
          newTerms: ["Calculated call premium"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Extending to Two Steps (b29-b32)
    {
      id: "s07",
      index: 7,
      title: "Extending to Two Steps: The Recombining Lattice",
      purpose: "Demonstrate how branching over two periods creates a recombining lattice where u*d = d*u",
      takeaways: [
        "In a two-step tree, stock price evolves over 2 periods: up-up (u^2), up-down (ud), and down-down (d^2)",
        "Because multiplication commutes (u * d = d * u), intermediate nodes recombine, producing 3 terminal nodes instead of 4",
        "Recombining lattices grow linearly with time steps (N+1 nodes), avoiding exponential explosion"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "recombining-lattice",
          heading: "Recombining Lattice (u * d = d * u)",
          tone: "positive",
          points: [
            "Up then down lands at exactly same price as down then up",
            "Node count at step N is strictly N + 1 (linear growth)",
            "Computationally efficient for 100+ steps"
          ]
        },
        right: {
          id: "non-recombining",
          heading: "Non-Recombining Tree (Path Dependent)",
          tone: "trap",
          points: [
            "Paths do not merge; each node branches independently",
            "Node count at step N explodes to 2^N (exponential)",
            "Becomes computationally impossible beyond 25 steps"
          ]
        },
        verdict: {
          id: "lattice-verdict",
          text: "Cox-Ross-Rubinstein recombining lattices make multi-period option pricing practical and lightning-fast."
        }
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Extend analysis from one single step to a two-step multi-period tree",
          sourceFactIds: ["F07"],
          newTerms: ["Two-step tree"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Explain why u*d = d*u causes middle nodes to recombine into a single price",
          sourceFactIds: ["F07"],
          newTerms: ["Recombining property"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Contrast linear N+1 node growth with exponential 2^N explosion",
          sourceFactIds: ["F07"],
          newTerms: ["Computational efficiency"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Show terminal payoffs at the three nodes: u^2, ud, and d^2",
          sourceFactIds: ["F07"],
          newTerms: ["Terminal tree nodes"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Backward Induction (b33-b36)
    {
      id: "s08",
      index: 8,
      title: "Backward Induction: Multi-Period Rollback Algorithm",
      purpose: "Explain the backward induction algorithm rolling values from expiration back to initial time t=0",
      takeaways: [
        "Option pricing runs backward in time: evaluate intrinsic payoffs at expiration t=T first",
        "Roll backward node-by-node by applying one-step risk-neutral discounting recursively",
        "Backward induction dynamically updates hedge ratio delta at every step and node"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Backward Induction Rollback Algorithm",
        steps: [
          { label: "Step 1: Forward Stock Lattice", detail: "Generate stock prices S_0 u^j d^(i-j) forward from t=0 to expiration t=T" },
          { label: "Step 2: Terminal Payoffs", detail: "Compute final intrinsic option values max(S_T - K, 0) at all terminal nodes" },
          { label: "Step 3: Recursive Rollback", detail: "At each preceding node, compute c = exp(-r * dt) * [p * c_up + (1-p) * c_down]" },
          { label: "Step 4: Initial Option Price", detail: "Rolling all paths back to root node t=0 yields the exact fair option value" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Introduce the backward induction rollback principle",
          sourceFactIds: ["F08"],
          newTerms: ["Backward induction"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Calculate option values at step 1 intermediate nodes using risk-neutral formula",
          sourceFactIds: ["F08"],
          newTerms: ["Intermediate node valuation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Roll back from step 1 to step 0 root node to determine initial option price",
          sourceFactIds: ["F08"],
          newTerms: ["Root node convergence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Explain how delta changes across nodes, reflecting dynamic rehedging requirements",
          sourceFactIds: ["F08"],
          newTerms: ["Dynamic rehedging"],
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
      title: "Active Recall Scenario: One-Step Binomial Call Valuation",
      purpose: "Test student mastery of delta hedging, risk-neutral probability, and no-arbitrage bounds",
      takeaways: [
        "Delta is determined purely by the ratio of option payoff spread to stock price spread",
        "Subjective probabilities do not affect option fair value because hedging eliminates risk",
        "Risk-neutral probability p is a synthetic mathematical weight ensuring no arbitrage"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "Why does the fair price of an option NOT depend on the real-world probability of the stock rising?",
        options: [
          { id: "opt-a", text: "Because market makers adjust stock prices until up and down probabilities become 50%", correct: false },
          { id: "opt-b", text: "Because dynamic delta hedging creates a riskless portfolio that eliminates directional market risk entirely", correct: true },
          { id: "opt-c", text: "Because investors are required by securities law to act with risk-neutral risk preferences", correct: false },
          { id: "opt-d", text: "Because continuous compounding cancels out subjective investor probabilities", correct: false }
        ],
        explanation: "By holding Delta shares and shorting the option, the portfolio payoff is identical whether the stock rises or falls. Because all risk is hedged away, subjective market beliefs cannot influence fair price."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Pose conceptual challenge on why real-world probability disappears",
          sourceFactIds: ["F03", "F08"],
          newTerms: ["Challenge scenario"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Highlight common beginner misconception that bullish beliefs increase call value",
          sourceFactIds: ["F03"],
          newTerms: ["Subjective belief fallacy"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Reveal answer: dynamic replication completely eliminates directional exposure",
          sourceFactIds: ["F02", "F03"],
          newTerms: ["Replication proof"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Reinforce that risk-neutral probability p is an internal mathematical weighting tool",
          sourceFactIds: ["F04"],
          newTerms: ["Mathematical weight reinforcement"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Put Options & Recombining Efficiency (b41-b44)
    {
      id: "s10",
      index: 10,
      title: "Put Options & Recombining Efficiency on Trees",
      purpose: "Apply binomial tree valuation to put options and examine negative delta dynamics",
      takeaways: [
        "Put option payoffs p_u = max(K - S0*u, 0) and p_d = max(K - S0*d, 0) yield negative delta",
        "Negative delta signifies a short stock position is required to hedge a short put",
        "The identical risk-neutral probability p applies to both calls and puts, ensuring put-call parity holds"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "call-dynamics",
          heading: "Call Option Dynamics",
          tone: "positive",
          points: [
            "Terminal payoff c = max(S - K, 0)",
            "Delta is strictly positive: 0 <= Delta <= 1",
            "Hedge short call by buying Delta shares of stock"
          ]
        },
        right: {
          id: "put-dynamics",
          heading: "Put Option Dynamics",
          tone: "trap",
          points: [
            "Terminal payoff p = max(K - S, 0)",
            "Delta is strictly negative: -1 <= Delta <= 0",
            "Hedge short put by shorting |Delta| shares of stock"
          ]
        },
        verdict: {
          id: "parity-verdict",
          text: "Both calls and puts share identical risk-neutral probability p, perfectly obeying discrete put-call parity."
        }
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b41 }, hi: { display: hiBeats.b41 } },
          onScreenIntent: "Apply the binomial lattice framework to European put options",
          sourceFactIds: ["F01", "F05"],
          newTerms: ["Binomial put option"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b42 }, hi: { display: hiBeats.b42 } },
          onScreenIntent: "Examine negative delta: put payoffs are higher in down state, producing delta < 0",
          sourceFactIds: ["F02"],
          newTerms: ["Negative delta"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b43 }, hi: { display: hiBeats.b43 } },
          onScreenIntent: "Verify that synthetic probability p is universal and prices puts identically",
          sourceFactIds: ["F04", "F05"],
          newTerms: ["Universal pricing measure"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b44 }, hi: { display: hiBeats.b44 } },
          onScreenIntent: "Demonstrate that tree prices satisfy discrete put-call parity at every node",
          sourceFactIds: ["F05"],
          newTerms: ["Discrete put-call parity"],
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
      title: "Summary Thread: Four Pillars of Binomial Option Valuation",
      purpose: "Consolidate the 8 foundational rules of discrete option valuation and preview Part 2",
      takeaways: [
        "Binomial lattices simplify continuous option pricing into transparent discrete algebra",
        "Risk-neutral probability p weights future states so expected return equals risk-free rate r",
        "Part 2 masters multi-step CRR calibration, American early exercise, and dividend lattices"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The 8 Laws of Binomial Option Pricing",
        rules: [
          { id: "r1", title: "1. One-Step Branching", summary: "Stock moves to S0*u or S0*d over delta_t where u > 1 and d < 1." },
          { id: "r2", title: "2. Delta Hedge Ratio", summary: "Delta = (c_u - c_d) / (S0*u - S0*d) perfectly immunizes portfolio risk." },
          { id: "r3", title: "3. Zero Risk Portfolio", summary: "Holding Delta shares and shorting 1 call earns exactly risk-free rate r." },
          { id: "r4", title: "4. Belief Independence", summary: "Option prices are strictly invariant to subjective real-world probabilities." },
          { id: "r5", title: "5. Risk-Neutral Probability", summary: "p = (exp(r*delta_t) - d) / (u - d) satisfies 0 < p < 1 to prevent arbitrage." },
          { id: "r6", title: "6. Valuation Formula", summary: "Option price c = exp(-r*delta_t) * [p * c_u + (1-p) * c_d] under measure Q." },
          { id: "r7", title: "7. Recombining Efficiency", summary: "u*d = d*u limits node growth to N+1, avoiding exponential explosion." },
          { id: "r8", title: "8. Backward Induction", summary: "Recursive rollback from terminal expiration values t=T solves initial value at t=0." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b45 }, hi: { display: hiBeats.b45 } },
          onScreenIntent: "Synthesize the core breakthrough of Cox-Ross-Rubinstein discrete pricing",
          sourceFactIds: ["F01"],
          newTerms: ["Executive summary"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b46 }, hi: { display: hiBeats.b46 } },
          onScreenIntent: "Review Rules 1 and 2: branching geometry and delta hedge ratio",
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
          narration: { en: { display: enBeats.b47 }, hi: { display: hiBeats.b47 } },
          onScreenIntent: "Review Rules 3 and 4: no-arbitrage portfolio growth and belief independence",
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
          onScreenIntent: "Review Rules 5 and 6: risk-neutral probability p and one-step pricing formula",
          sourceFactIds: ["F04", "F05"],
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
          onScreenIntent: "Review Rules 7 and 8: recombining efficiency and backward induction rollback",
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
          onScreenIntent: "Conclude Part 1 and bridge to Part 2: CRR volatility calibration and American options",
          sourceFactIds: ["F06"],
          newTerms: ["Part 2 bridge"],
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

// Update book.config.json & course_map.json
const bookConfigPath = 'c:/code/openlectern/workspace/books/hull/book.config.json';
const bookConfig = JSON.parse(fs.readFileSync(bookConfigPath, 'utf8'));
if (!bookConfig.chapters.some(c => c.id === 'ch13')) {
  bookConfig.chapters.push({
    id: 'ch13',
    number: 13,
    title: 'Binomial Trees'
  });
  fs.writeFileSync(bookConfigPath, JSON.stringify(bookConfig, null, 2));
}

const courseMapPath = 'c:/code/openlectern/workspace/books/hull/course_map.json';
const courseMap = JSON.parse(fs.readFileSync(courseMapPath, 'utf8'));
if (!courseMap.chapters.some(c => c.id === 'ch13')) {
  courseMap.chapters.push({
    id: 'ch13',
    number: 13,
    title: 'Binomial Trees',
    parts: [
      { id: 'p1', title: 'Part 1: One-Step Model & Risk-Neutral Valuation' },
      { id: 'p2', title: 'Part 2: Multi-Step Trees & American Options' }
    ]
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

console.log('Chapter 13 Part 1 successfully built and registered in course_map!');
