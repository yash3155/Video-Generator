import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch15/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_15/Part_01/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap15_part01/episode_raw.json', 'utf8'));

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
const enBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());

const rawBeats = [];
epRaw.scenes.forEach(s => s.beats.forEach(b => rawBeats.push(b)));

const hiBeats = {};
rawBeats.forEach((b, idx) => {
  const k = 'b' + String(idx + 1).padStart(2, '0');
  hiBeats[k] = (b.hi_narration || "").trim();
});

if (!hiBeats.b39) {
  hiBeats.b39 = "f = S aur uske partial derivatives ko Black-Scholes-Merton PDE mein substitute karke dekhiye.";
}
if (!enBeats.b39 || enBeats.b39.startsWith('[')) {
  enBeats.b39 = "Take a moment to substitute f = S and its partial derivatives into the Black-Scholes-Merton PDE.";
}

for (let i = 1; i <= 50; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 15 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch15",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "market_rule",
      statement: "Core BSM Assumptions: Continuous trading, constant volatility sigma, constant risk-free rate r, Geometric Brownian Motion for stock prices, no transaction costs or taxes, and no arbitrage opportunities.",
      citation: { chapter: "15", section: "15.1", page: "360" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "Delta-Neutral Hedging Portfolio: A riskless portfolio Pi is constructed by shorting 1 derivative f and buying delta = df/dS shares of stock S: Pi = -f + (df/dS) * S.",
      citation: { chapter: "15", section: "15.2", page: "362" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "Itô Shock Cancellation: Expanding df via Itô's Lemma reveals that the stochastic Wiener term sigma * S * (df/dS) * dz in derivative return exactly cancels against the stock price shock (df/dS) * dS, making portfolio change dPi completely deterministic.",
      citation: { chapter: "15", section: "15.2", page: "363" }
    },
    {
      id: "F04",
      category: "market_rule",
      statement: "No-Arbitrage Growth on Riskless Portfolio: Because portfolio Pi carries zero stochastic risk over time interval dt, no-arbitrage equilibrium dictates that it must earn the risk-free rate r: dPi = r * Pi * dt.",
      citation: { chapter: "15", section: "15.2", page: "363" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "The Black-Scholes-Merton PDE: Equating portfolio return to the risk-free rate produces the governing BSM PDE: df/dt + r * S * (df/dS) + 0.5 * sigma^2 * S^2 * (d^2f/dS^2) = r * f. Expected stock drift mu is completely absent.",
      citation: { chapter: "15", section: "15.2", page: "364" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Boundary Conditions: The BSM PDE applies to all claims dependent on stock S. Specific prices require terminal boundary conditions: f(S, T) = max(S - K, 0) for calls, and f(S, T) = max(K - S, 0) for puts.",
      citation: { chapter: "15", section: "15.3", page: "365" }
    },
    {
      id: "F07",
      category: "market_rule",
      statement: "Continuous Risk-Neutral Valuation: Because expected stock return mu does not enter the BSM PDE, derivative prices are invariant to investor risk aversion. Prices can be calculated by assuming a risk-neutral world where expected stock return is r and discounting expected payoffs at r.",
      citation: { chapter: "15", section: "15.4", page: "366" }
    },
    {
      id: "F08",
      category: "formula",
      statement: "Linear Asset Solutions: Any linear combination of underlying asset S and riskless cash bond exp(r(T-t)) satisfies the BSM PDE identically, confirming the mathematical consistency of the framework.",
      citation: { chapter: "15", section: "15.2", page: "364" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson Plan
const lessonPlan = {
  chapterId: "ch15",
  partId: "p1",
  title: "The Black-Scholes-Merton Model - Part 1: The Governing Differential Equation",
  estimatedDurationSec: 840,
  scenes: [
    { sceneId: "s00", title: "The Subjectivity Dilemma: The Nobel-Winning Mystery", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "The Six Governing Assumptions of the BSM Model", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "The Architecture of the Hedging Portfolio Π", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "Expanding df via Itô's Lemma", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "The Miracle of Cancellation: Eradicating Market Risk", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "The No-Arbitrage Law: Earning the Risk-Free Rate", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "The Black-Scholes-Merton Partial Differential Equation", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "The Vanishing Mu: Why Investor Beliefs Don't Matter", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "Boundary Conditions: Calls, Puts & Binary Contracts", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: BSM PDE Verification for Underlying Stock & Cash Bond", beats: ["s09b1", "s09b2", "s09b3", "s09b4", "s09b5"] },
    { sceneId: "s10", title: "Institutional Production PDE Solvers on Wall Street", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of the Black-Scholes-Merton PDE", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Math Blueprint
const mathBlueprint = {
  chapterId: "ch15",
  partId: "p1",
  formulas: [
    { id: "M01", latex: "\\Pi = -f + \\frac{\\partial f}{\\partial S} S", description: "Delta-Neutral Replicating Portfolio" },
    { id: "M02", latex: "d\\Pi = -df + \\frac{\\partial f}{\\partial S} dS = -\\left( \\frac{\\partial f}{\\partial t} + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} \\sigma^2 S^2 \\right) dt", description: "Riskless Portfolio Differential" },
    { id: "M03", latex: "\\frac{\\partial f}{\\partial t} + r S \\frac{\\partial f}{\\partial S} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 f}{\\partial S^2} = r f", description: "Black-Scholes-Merton Master PDE" },
    { id: "M04", latex: "f(S, T) = \\max(S - K, 0) \\quad \\text{or} \\quad \\max(K - S, 0)", description: "Terminal Payoff Boundary Conditions" }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical Script
const pedagogicalScript = {
  chapterId: "ch15",
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
  chapterId: "ch15",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 15",
  partLabel: "Part 1",
  title: "The Black-Scholes-Merton Model - Part 1: The Governing Differential Equation",
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
    // Scene 0: Subjectivity Dilemma (b01-b04)
    {
      id: "s00",
      index: 0,
      title: "The Subjectivity Dilemma: The Nobel-Winning Mystery",
      purpose: "Establish why option valuation puzzled economists for 70 years until Black, Scholes, and Merton in 1973",
      takeaways: [
        "Prior to 1973, economists believed option pricing required knowing investor risk aversion and expected stock return mu",
        "Fischer Black, Myron Scholes, and Robert Merton discovered that dynamic delta hedging eliminates risk entirely",
        "Their 1973 breakthrough was awarded the 1997 Nobel Memorial Prize in Economic Sciences"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Historical Quest for Option Valuation",
        steps: [
          { label: "1. Louis Bachelier (1900)", detail: "First mathematical model of Brownian motion applied to Paris Bourse options" },
          { label: "2. The Risk Premium Impasse", detail: "Early quants could not price options without guessing investor risk aversion" },
          { label: "3. Black-Scholes-Merton (1973)", detail: "Dynamic replication eliminates risk entirely; subjective return mu vanishes" },
          { label: "4. The Global Derivatives Boom", detail: "Chicago Board Options Exchange (CBOE) launches, igniting modern quantitative finance" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "Introduce the Nobel-winning mystery of option valuation",
          sourceFactIds: ["F01"],
          newTerms: ["Subjectivity dilemma"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "Explain why economists thought expected stock growth mu was mandatory",
          sourceFactIds: ["F05"],
          newTerms: ["Risk premium impasse"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "Highlight the genius of Fischer Black, Myron Scholes, and Robert Merton",
          sourceFactIds: ["F02", "F03"],
          newTerms: ["Black-Scholes-Merton breakthrough"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Outline Part 1 roadmap: assumptions, portfolio Pi, noise eradication, and the PDE",
          sourceFactIds: ["F01", "F05"],
          newTerms: ["BSM PDE roadmap"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 1: Six Governing Assumptions (b05-b08)
    {
      id: "s01",
      index: 1,
      title: "The Six Governing Assumptions of the BSM Model",
      purpose: "Define the six structural market assumptions required for continuous no-arbitrage replication",
      takeaways: [
        "Asset price S follows Geometric Brownian Motion dS = mu*S*dt + sigma*S*dz with constant volatility sigma",
        "Continuous frictionless trading with no transaction costs, no taxes, and continuous short selling permitted",
        "Risk-free interest rate r is constant across all maturities; no arbitrage opportunities exist"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Six Pillars of the BSM Framework",
        steps: [
          { label: "1. Asset Dynamics", detail: "Stock price follows Geometric Brownian Motion with constant volatility sigma" },
          { label: "2. Frictionless Trading", detail: "No transaction fees, bid-ask spreads, or taxes; full use of short proceeds" },
          { label: "3. Continuous Liquidity", detail: "Trading takes place continuously in time with no market gaps or halts" },
          { label: "4. Constant Interest Rate", detail: "Risk-free borrowing and lending rate r is constant and identical for all maturities" }
        ]
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Present the core assumptions governing the Black-Scholes-Merton derivation",
          sourceFactIds: ["F01"],
          newTerms: ["BSM assumptions"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Explain Geometric Brownian Motion and constant volatility assumption",
          sourceFactIds: ["F01"],
          newTerms: ["Constant volatility assumption"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Clarify frictionless market conditions: zero transaction costs and short-sale freedom",
          sourceFactIds: ["F01"],
          newTerms: ["Frictionless market assumption"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Emphasize how ideal frictionless assumptions unlock pure mathematical replication",
          sourceFactIds: ["F01"],
          newTerms: ["Pure replication benchmark"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Hedging Portfolio Pi (b09-b12)
    {
      id: "s02",
      index: 2,
      title: "The Architecture of the Hedging Portfolio Π",
      purpose: "Construct the delta-neutral hedging portfolio Pi = -f + (df/dS)*S",
      takeaways: [
        "Construct portfolio Pi by shorting exactly 1 derivative contract f and longing delta = (df/dS) shares of stock",
        "The dollar value of portfolio Pi at any instant is Pi = -f + (df/dS) * S",
        "The short option position creates negative risk exposure that perfectly mirrors the long stock position"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "short-derivative",
          heading: "Short Derivative Position (-1 f)",
          tone: "trap",
          points: [
            "Liable to pay derivative terminal payoff f(S, T)",
            "Exposed to stochastic price jumps: df contains Brownian noise dz",
            "Creates negative delta exposure -(df/dS)"
          ]
        },
        right: {
          id: "long-hedge-stock",
          heading: "Long Delta Shares (+(df/dS) S)",
          tone: "positive",
          points: [
            "Purchase exactly Delta = df/dS shares of underlying stock",
            "Generates positive dollar exposure +(df/dS) dS",
            "Perfectly offsets derivative directional price risk"
          ]
        },
        verdict: {
          id: "portfolio-verdict",
          text: "Portfolio Pi = -f + (df/dS) S is delta-neutral; any instantaneous market shock cancels out identically."
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Assemble the Nobel-winning hedging portfolio Pi",
          sourceFactIds: ["F02"],
          newTerms: ["Portfolio Pi"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Specify the exact share quantity: delta = df/dS",
          sourceFactIds: ["F02"],
          newTerms: ["Derivative delta df/dS"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Examine portfolio value: Pi = -f + (df/dS)*S",
          sourceFactIds: ["F02"],
          newTerms: ["Delta-neutral balance"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Preview the differential dPi over infinitesimal time dt",
          sourceFactIds: ["F02"],
          newTerms: ["Portfolio differential dPi"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Expanding df via Itô (b13-b16)
    {
      id: "s03",
      index: 3,
      title: "Expanding df via Itô's Lemma",
      purpose: "Apply Itô's Lemma to the derivative function f(S, t) under stock GBM dS = mu S dt + sigma S dz",
      takeaways: [
        "Applying Itô's Lemma yields df = [(df/dS)*mu*S + df/dt + 0.5*(d^2f/dS^2)*sigma^2*S^2] dt + (df/dS)*sigma*S dz",
        "The stochastic shock in the derivative is strictly (df/dS) * sigma * S * dz",
        "The drift contains expected stock drift (df/dS)*mu*S alongside theta time decay and gamma convexity"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Stochastic Derivative Differential df",
        formula: {
          latex: "df = \\left( \\frac{\\partial f}{\\partial S} \\mu S + \\frac{\\partial f}{\\partial t} + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} \\sigma^2 S^2 \\right) dt + \\frac{\\partial f}{\\partial S} \\sigma S \\, dz",
          expression: "df = (df/dS * mu * S + df/dt + 0.5 * d2f/dS2 * sigma^2 * S^2) * dt + (df/dS * sigma * S) * dz",
          solvesFor: "Derivative Price Change df",
          variables: [
            { symbol: "df", latex: "df", meaning: "Instantaneous Change in Derivative Value", unit: "USD" },
            { symbol: "df/dS", latex: "\\frac{\\partial f}{\\partial S}", meaning: "Delta Sensitivity", unit: "shares" },
            { symbol: "df/dt", latex: "\\frac{\\partial f}{\\partial t}", meaning: "Theta Time Decay", unit: "USD/yr" },
            { symbol: "d^2f/dS^2", latex: "\\frac{\\partial^2 f}{\\partial S^2}", meaning: "Gamma Convexity Curvature", unit: "1/USD" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "\\frac{\\partial f}{\\partial S} \\mu S \\, dt", meaning: "Drift inherited from expected underlying stock return mu", unit: "drift" },
          { id: "p2", symbolLatex: "\\left( \\frac{\\partial f}{\\partial t} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 f}{\\partial S^2} \\right) dt", meaning: "Intrinsic theta decay and Ito gamma convexity correction", unit: "convexity" },
          { id: "p3", symbolLatex: "\\frac{\\partial f}{\\partial S} \\sigma S \\, dz", meaning: "Brownian random shock scaling directly with delta", unit: "noise" }
        ],
        note: "Notice that derivative noise dz is identical to underlying stock noise dz, scaled by delta df/dS."
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Apply Itô's Lemma to the contingent claim f(S, t)",
          sourceFactIds: ["F03"],
          newTerms: ["Itô derivative expansion"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Identify the deterministic drift components: stock drift, theta, and gamma",
          sourceFactIds: ["F03"],
          newTerms: ["Drift component breakdown"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Isolate the stochastic diffusion term: (df/dS) * sigma * S * dz",
          sourceFactIds: ["F03"],
          newTerms: ["Isolated Brownian noise"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Set the stage for substitution into portfolio change dPi",
          sourceFactIds: ["F03"],
          newTerms: ["Substitution setup"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Miracle of Cancellation (b17-b20)
    {
      id: "s04",
      index: 4,
      title: "The Miracle of Cancellation: Eradicating Market Risk",
      purpose: "Demonstrate the mathematical miracle: Brownian noise dz and stock drift mu cancel out completely",
      takeaways: [
        "In portfolio differential dPi = -df + (df/dS) dS, substitute df and dS = mu*S*dt + sigma*S*dz",
        "The noise term -(df/dS)*sigma*S*dz cancels +(df/dS)*sigma*S*dz identically to zero",
        "The drift term -(df/dS)*mu*S*dt cancels +(df/dS)*mu*S*dt identically to zero: mu disappears!",
        "Resulting differential dPi = -[df/dt + 0.5*sigma^2*S^2*(d^2f/dS^2)] dt is 100% deterministic"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Shock Cancellation Derivation",
        formula: {
          latex: "d\\Pi = -\\left( \\frac{\\partial f}{\\partial t} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 f}{\\partial S^2} \\right) dt",
          expression: "dPi = -(df/dt + 0.5 * sigma^2 * S^2 * d2f/dS2) * dt",
          solvesFor: "Deterministic Portfolio Differential dPi",
          variables: [
            { symbol: "dPi", latex: "d\\Pi", meaning: "Instantaneous Return of Hedged Portfolio", unit: "USD" },
            { symbol: "df/dt", latex: "\\frac{\\partial f}{\\partial t}", meaning: "Theta Time Decay", unit: "USD/yr" },
            { symbol: "sigma^2 S^2 d^2f/dS^2", latex: "\\sigma^2 S^2 \\frac{\\partial^2 f}{\\partial S^2}", meaning: "Dollar Gamma Curvature Volatility", unit: "USD/yr" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "-\\frac{\\partial f}{\\partial S} \\sigma S \\, dz + \\frac{\\partial f}{\\partial S} \\sigma S \\, dz = 0", meaning: "Stochastic noise dz eradicated identically", unit: "cancellation" },
          { id: "p2", symbolLatex: "-\\frac{\\partial f}{\\partial S} \\mu S \\, dt + \\frac{\\partial f}{\\partial S} \\mu S \\, dt = 0", meaning: "Subjective stock drift mu eradicated identically", unit: "cancellation" },
          { id: "p3", symbolLatex: "\\text{Var}(d\\Pi) = 0", meaning: "Portfolio return has strictly zero variance over interval dt", unit: "zero risk" }
        ],
        note: "This cancellation is the mathematical foundation of modern derivatives pricing: risk has been completely engineered away."
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Formulate the portfolio differential: dPi = -df + (df/dS) dS",
          sourceFactIds: ["F03"],
          newTerms: ["Portfolio differential formula"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Show the cancellation of Brownian motion dz: noise vanishes to zero",
          sourceFactIds: ["F03"],
          newTerms: ["Brownian eradication"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Show the miraculous cancellation of drift mu: subjective expected return disappears",
          sourceFactIds: ["F03", "F05"],
          newTerms: ["Drift cancellation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "State the resulting deterministic differential: dPi has zero risk and zero variance",
          sourceFactIds: ["F03", "F04"],
          newTerms: ["Deterministic differential"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: No-Arbitrage Law (b21-b24)
    {
      id: "s05",
      index: 5,
      title: "The No-Arbitrage Law: Earning the Risk-Free Rate",
      purpose: "Enforce no-arbitrage equilibrium: any riskless portfolio must grow at the risk-free rate r",
      takeaways: [
        "Because dPi contains no dz, it is completely risk-free and carries zero variance",
        "If dPi earned more than risk-free rate r, arbitrageurs would borrow at r and buy Pi, earning free riskless profit",
        "If dPi earned less than r, arbitrageurs would short Pi and invest in riskless bonds",
        "Therefore, equilibrium strictly enforces dPi = r * Pi * dt"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "excess-return",
          heading: "If dPi > r * Pi * dt (Free Money)",
          tone: "trap",
          points: [
            "Borrow capital at risk-free rate r",
            "Invest in hedged portfolio Pi",
            "Pocket riskless arbitrage profit with zero capital"
          ]
        },
        right: {
          id: "sub-return",
          heading: "If dPi < r * Pi * dt (Reverse Arbitrage)",
          tone: "trap",
          points: [
            "Short portfolio Pi",
            "Lend capital at risk-free rate r",
            "Pocket riskless arbitrage profit until prices correct"
          ]
        },
        verdict: {
          id: "arbitrage-verdict",
          text: "No-arbitrage equilibrium strictly locks in dPi = r * Pi * dt: riskless assets must earn the risk-free rate."
        }
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "State the iron law of finance: riskless portfolios must earn the risk-free rate r",
          sourceFactIds: ["F04"],
          newTerms: ["No-arbitrage growth rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Formulate the arbitrage proof if dPi exceeded r * Pi * dt",
          sourceFactIds: ["F04"],
          newTerms: ["Positive arbitrage proof"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Formulate the reverse arbitrage proof if dPi fell below r * Pi * dt",
          sourceFactIds: ["F04"],
          newTerms: ["Reverse arbitrage proof"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Equate expressions: -[df/dt + 0.5*sigma^2*S^2*d2f/dS2] dt = r * [-f + (df/dS)*S] dt",
          sourceFactIds: ["F04", "F05"],
          newTerms: ["Master equation assembly"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: The BSM PDE (b25-b28)
    {
      id: "s06",
      index: 6,
      title: "The Black-Scholes-Merton Partial Differential Equation",
      purpose: "Rearrange terms into the canonical Black-Scholes-Merton partial differential equation",
      takeaways: [
        "Rearranging yields: df/dt + r*S*(df/dS) + 0.5*sigma^2*S^2*(d^2f/dS^2) = r*f",
        "This parabolic PDE governs the price of ANY contingent claim dependent on underlying stock S",
        "It combines Theta time decay, Delta underlying growth, and Gamma volatility convexity"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Black-Scholes-Merton Master PDE",
        formula: {
          latex: "\\frac{\\partial f}{\\partial t} + r S \\frac{\\partial f}{\\partial S} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 f}{\\partial S^2} = r f",
          expression: "df/dt + r * S * df/dS + 0.5 * sigma^2 * S^2 * d2f/dS2 = r * f",
          solvesFor: "Fair Derivative Price f(S, t)",
          variables: [
            { symbol: "df/dt", latex: "\\frac{\\partial f}{\\partial t}", meaning: "Theta: Sensitivity to Elapsed Time", unit: "USD/yr" },
            { symbol: "r S df/dS", latex: "r S \\frac{\\partial f}{\\partial S}", meaning: "Delta Drift under Risk-Free Growth r", unit: "USD/yr" },
            { symbol: "0.5 sigma^2 S^2 d^2f/dS^2", latex: "\\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 f}{\\partial S^2}", meaning: "Gamma Convexity Volatility Contribution", unit: "USD/yr" },
            { symbol: "r f", latex: "r f", meaning: "Required Risk-Free Return on Derivative Capital", unit: "USD/yr" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "\\frac{\\partial f}{\\partial t}", meaning: "Time decay: option loses extrinsic value as expiration approaches", unit: "theta" },
          { id: "p2", symbolLatex: "r S \\frac{\\partial f}{\\partial S}", meaning: "Drift term where stock grows exactly at risk-free rate r", unit: "delta drift" },
          { id: "p3", symbolLatex: "\\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 f}{\\partial S^2}", meaning: "Convexity term where volatility generates positive drift for gamma > 0", unit: "gamma" }
        ],
        note: "Every European option, American option, binary option, and barrier option satisfies this identical differential equation."
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Present the canonical Black-Scholes-Merton Partial Differential Equation",
          sourceFactIds: ["F05"],
          newTerms: ["Black-Scholes-Merton PDE"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Dissect each of the three left-hand terms: Theta, Delta, and Gamma",
          sourceFactIds: ["F05"],
          newTerms: ["Greek PDE dissection"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Explain right-hand side r*f: the required opportunity cost of option capital",
          sourceFactIds: ["F05"],
          newTerms: ["Required return r*f"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Highlight universal universality: the PDE applies to ALL derivative contracts",
          sourceFactIds: ["F05", "F06"],
          newTerms: ["Universal PDE validity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: The Vanishing Mu (b29-b32)
    {
      id: "s07",
      index: 7,
      title: "The Vanishing Mu: Why Investor Beliefs Don't Matter",
      purpose: "Examine the profound philosophical implication: stock drift mu does not appear anywhere in the PDE",
      takeaways: [
        "Expected stock return mu does not enter the BSM PDE; only volatility sigma matters",
        "Two investors with wildly different views on stock direction (bullish vs bearish) agree on option fair value",
        "Option pricing is governed by the cost of replication, not subjective directional forecasting"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "bullish-trader",
          heading: "Ultra-Bullish Investor (mu = +30%)",
          tone: "positive",
          points: [
            "Expects stock to skyrocket 30% per year",
            "Must delta-hedge call with long stock shares",
            "Replication cost is identical: Call Price = $5.25"
          ]
        },
        right: {
          id: "bearish-trader",
          heading: "Ultra-Bearish Investor (mu = -15%)",
          tone: "trap",
          points: [
            "Expects stock to crash 15% per year",
            "Must delta-hedge call with long stock shares",
            "Replication cost is identical: Call Price = $5.25"
          ]
        },
        verdict: {
          id: "mu-verdict",
          text: "Because delta hedging continuously immunizes directional market risk, subjective expected return mu is completely irrelevant."
        }
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Draw attention to the most astonishing feature of the PDE: mu is completely missing",
          sourceFactIds: ["F05", "F07"],
          newTerms: ["Vanishing mu mystery"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Explain why bull and bear traders agree on option price: identical replication cost",
          sourceFactIds: ["F07"],
          newTerms: ["Belief-independent pricing"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Contrast stock forecasting (estimating mu) with option pricing (estimating sigma)",
          sourceFactIds: ["F07"],
          newTerms: ["Directional vs volatility trading"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Conclude: the absence of mu is the birth certificate of continuous risk-neutral pricing",
          sourceFactIds: ["F07"],
          newTerms: ["Birth of risk-neutral pricing"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Boundary Conditions (b33-b36)
    {
      id: "s08",
      index: 8,
      title: "Boundary Conditions: Calls, Puts & Binary Contracts",
      purpose: "Show how imposing terminal and spatial boundary conditions transforms the general PDE into specific contracts",
      takeaways: [
        "The BSM PDE has infinite possible solutions; specific derivative prices are pinned down by boundary conditions",
        "European Call boundary: f(S, T) = max(S - K, 0); European Put boundary: f(S, T) = max(K - S, 0)",
        "Spatial boundaries: as S -> 0, call c -> 0; as S -> infinity, call c -> S - K*exp(-r(T-t))"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Boundary Conditions Pinning Down Contract Prices",
        steps: [
          { label: "1. The Master PDE", detail: "General differential law shared by all stock derivative contracts" },
          { label: "2. Terminal Payoff Condition", detail: "At expiration t=T, option value must equal intrinsic payoff: max(S - K, 0) for calls" },
          { label: "3. Lower Spatial Boundary (S -> 0)", detail: "If stock hits $0, it remains dead forever: call c(0, t) = 0; put p(0, t) = K*exp(-r(T-t))" },
          { label: "4. Upper Spatial Boundary (S -> inf)", detail: "As stock becomes infinitely valuable: call c(S, t) -> S - K*exp(-r(T-t))" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Explain why boundary conditions are needed to isolate specific option prices",
          sourceFactIds: ["F06"],
          newTerms: ["Boundary condition role"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Specify terminal payoff boundary condition for European calls and puts at t=T",
          sourceFactIds: ["F06"],
          newTerms: ["Terminal boundary condition"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Examine spatial boundary condition at S = 0: bankruptcy absorbing state",
          sourceFactIds: ["F06"],
          newTerms: ["Zero stock boundary"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Examine spatial boundary condition as S approaches infinity: deep ITM call behaves like forward",
          sourceFactIds: ["F06"],
          newTerms: ["Infinite stock boundary"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 9: Active Recall Scenario (b37-b41)
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: BSM PDE Verification for Underlying Stock & Cash Bond",
      purpose: "Test student mastery by proving that stock f = S and cash bond f = exp(r*t) satisfy the BSM PDE identically",
      takeaways: [
        "For f = S: df/dt = 0, df/dS = 1, d^2f/dS^2 = 0; Left side: 0 + r*S(1) + 0 = r*S; Right side: r*S. Verified!",
        "For cash bond f = exp(rt): df/dt = r*exp(rt), df/dS = 0, d^2f/dS^2 = 0; Left side: r*exp(rt); Right side: r*exp(rt). Verified!",
        "Proves that underlying assets and risk-free cash bonds are simply trivial special cases of the BSM PDE"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "Does the underlying stock itself (f = S) satisfy the Black-Scholes-Merton PDE: df/dt + r*S*(df/dS) + 0.5*sigma^2*S^2*(d^2f/dS^2) = r*f?",
        options: [
          { id: "opt-a", text: "Yes: df/dt=0, df/dS=1, d^2f/dS^2=0, yielding r*S = r*S identically", correct: true },
          { id: "opt-b", text: "No: The BSM PDE applies strictly to non-linear option contracts, not linear stocks", correct: false },
          { id: "opt-c", text: "No: Stock satisfies the PDE only if volatility sigma equals zero", correct: false },
          { id: "opt-d", text: "Yes: But only if expected stock return mu equals the risk-free rate r", correct: false }
        ],
        explanation: "Evaluating partial derivatives for f = S: df/dt = 0 (no time decay), df/dS = 1 (delta is 1), and d^2f/dS^2 = 0 (gamma is 0). Substituting into the PDE: 0 + r*S*(1) + 0 = r*S, which identically equals r*f = r*S. The stock satisfies the PDE unconditionally!"
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Present conceptual verification challenge: does stock f = S satisfy the PDE?",
          sourceFactIds: ["F08"],
          newTerms: ["PDE verification challenge"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Calculate derivatives for f = S: df/dt = 0, df/dS = 1, d^2f/dS^2 = 0",
          sourceFactIds: ["F08"],
          newTerms: ["Linear stock derivatives"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Substitute into left-hand side: r*S*1 = r*S",
          sourceFactIds: ["F08"],
          newTerms: ["LHS substitution"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Compare with right-hand side r*f = r*S: exact mathematical identity",
          sourceFactIds: ["F08"],
          newTerms: ["Identity verification"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b41 }, hi: { display: hiBeats.b41 } },
          onScreenIntent: "Reinforce universal consistency: underlying stock and cash bonds obey BSM PDE",
          sourceFactIds: ["F08"],
          newTerms: ["Framework consistency"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Production PDE Solvers (b42-b45)
    {
      id: "s10",
      index: 10,
      title: "Institutional Production PDE Solvers on Wall Street",
      purpose: "Examine how quantitative trading desks solve the BSM PDE numerically using Crank-Nicolson finite difference schemes",
      takeaways: [
        "While closed-form formulas exist for vanilla European options, exotic and American options require numerical PDE solvers",
        "The Crank-Nicolson implicit-explicit finite difference scheme discretizes S and t onto a computational grid",
        "Tridiagonal matrix algorithms solve the PDE grid with unconditional numerical stability and O(dt^2 + dS^2) accuracy"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Industrial PDE Engine Pipeline",
        steps: [
          { label: "1. Spatial-Temporal Grid", detail: "Discretize stock price S into M price nodes and time t into N time steps" },
          { label: "2. Crank-Nicolson Stencil", detail: "Average implicit future step and explicit current step to guarantee unconditional stability" },
          { label: "3. Tridiagonal Matrix Solve", detail: "Execute Thomas algorithm in O(M) operations per time step" },
          { label: "4. American Early Exercise Check", detail: "Apply nodal condition f = max(Intrinsic, Solution) at every grid step backward in time" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b42 }, hi: { display: hiBeats.b42 } },
          onScreenIntent: "Examine industrial Wall Street applications: numerical PDE solvers for exotic options",
          sourceFactIds: ["F05"],
          newTerms: ["Numerical PDE solvers"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b43 }, hi: { display: hiBeats.b43 } },
          onScreenIntent: "Introduce the Crank-Nicolson finite difference grid architecture",
          sourceFactIds: ["F05"],
          newTerms: ["Crank-Nicolson scheme"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b44 }, hi: { display: hiBeats.b44 } },
          onScreenIntent: "Explain tridiagonal matrix execution in production C++ and GPU environments",
          sourceFactIds: ["F05"],
          newTerms: ["Tridiagonal solver"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b45 }, hi: { display: hiBeats.b45 } },
          onScreenIntent: "Bridge to Part 2: closed-form analytical solution of the BSM PDE for European options",
          sourceFactIds: ["F05"],
          newTerms: ["Part 2 closed-form bridge"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 11: Summary Thread (b46-b50)
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of the Black-Scholes-Merton PDE",
      purpose: "Consolidate the 8 foundational laws governing the derivation of the Black-Scholes-Merton PDE",
      takeaways: [
        "Delta hedging Pi = -f + (df/dS)*S eradicates market noise dz and expected drift mu",
        "The governing PDE df/dt + r*S*(df/dS) + 0.5*sigma^2*S^2*(d^2f/dS^2) = r*f applies to all derivatives",
        "Part 2 solves this PDE to derive the analytical formulas c = S*N(d1) - K*exp(-rT)*N(d2)"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The 8 Laws of the BSM PDE",
        rules: [
          { id: "r1", title: "1. BSM Market Pillars", summary: "Continuous trading, constant r and sigma, and frictionless markets unlock replication." },
          { id: "r2", title: "2. Delta Replicating Portfolio", summary: "Shorting 1 option and buying df/dS shares constructs delta-neutral portfolio Pi." },
          { id: "r3", title: "3. Itô Shock Cancellation", summary: "Derivative Brownian noise cancels stock price noise identically: dz vanishes." },
          { id: "r4", title: "4. Drift Vanishing Miracle", summary: "Subjective stock drift mu cancels identically from portfolio change dPi." },
          { id: "r5", title: "5. No-Arbitrage Law", summary: "Because portfolio Pi has zero variance, equilibrium enforces dPi = r * Pi * dt." },
          { id: "r6", title: "6. Master BSM PDE", summary: "df/dt + r*S*(df/dS) + 0.5*sigma^2*S^2*(d^2f/dS^2) = r*f governs all contingent claims." },
          { id: "r7", title: "7. Boundary Conditions", summary: "Terminal payoffs f(S, T) pin down specific prices for calls, puts, and exotics." },
          { id: "r8", title: "8. Continuous Risk-Neutrality", summary: "Absence of mu proves derivative values are invariant to investor risk preferences." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b46 }, hi: { display: hiBeats.b46 } },
          onScreenIntent: "Synthesize the historical triumph of the Black-Scholes-Merton PDE",
          sourceFactIds: ["F05"],
          newTerms: ["Executive synthesis"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b47 }, hi: { display: hiBeats.b47 } },
          onScreenIntent: "Review Rules 1 and 2: market assumptions and delta-neutral portfolio architecture",
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
          narration: { en: { display: enBeats.b48 }, hi: { display: hiBeats.b48 } },
          onScreenIntent: "Review Rules 3, 4, and 5: shock cancellation, vanishing mu, and no-arbitrage return",
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
          narration: { en: { display: enBeats.b49 }, hi: { display: hiBeats.b49 } },
          onScreenIntent: "Review Rules 6, 7, and 8: the master PDE, boundary conditions, and continuous risk-neutrality",
          sourceFactIds: ["F05", "F06", "F07"],
          newTerms: [],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s11b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b50 }, hi: { display: hiBeats.b50 } },
          onScreenIntent: "Conclude Part 1 and bridge to Part 2: Solving the PDE for European Call & Put Formulas",
          sourceFactIds: ["F05"],
          newTerms: ["Part 2 closed-form preview"],
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
if (!bookConfig.chapters.some(c => c.id === 'ch15')) {
  bookConfig.chapters.push({
    id: 'ch15',
    number: 15,
    title: 'The Black-Scholes-Merton Model'
  });
  fs.writeFileSync(bookConfigPath, JSON.stringify(bookConfig, null, 2));
}

const courseMapPath = 'c:/code/openlectern/workspace/books/hull/course_map.json';
const courseMap = JSON.parse(fs.readFileSync(courseMapPath, 'utf8'));
if (!courseMap.chapters.some(c => c.id === 'ch15')) {
  courseMap.chapters.push({
    id: 'ch15',
    number: 15,
    title: 'The Black-Scholes-Merton Model',
    parts: [
      { id: 'p1', title: 'Part 1: The Governing Differential Equation' },
      { id: 'p2', title: 'Part 2: Analytical Valuation & Cumulative Normals' }
    ]
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

console.log('Chapter 15 Part 1 successfully built and registered in course_map!');
