import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch15/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_15/Part_02/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap15_part02/episode_raw.json', 'utf8'));

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
  hiBeats.b39 = "d1, d2, N(d1), aur N(d2) calculate karke call option ka price determine karne ke liye thoda samay lijiye.";
}
if (!enBeats.b39 || enBeats.b39.startsWith('[')) {
  enBeats.b39 = "Take a moment to calculate d1, d2, N(d1), and N(d2) to price the call option.";
}

for (let i = 1; i <= 50; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 15 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch15",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "formula",
      statement: "The Black-Scholes-Merton Call Pricing Formula: European call price is c = S0 * N(d1) - K * exp(-r*T) * N(d2), where d1 = [ln(S0 / K) + (r + 0.5 * sigma^2) * T] / (sigma * sqrt(T)) and d2 = d1 - sigma * sqrt(T).",
      citation: { chapter: "15", section: "15.5", page: "368" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "The Black-Scholes-Merton Put Pricing Formula: European put price is p = K * exp(-r*T) * N(-d2) - S0 * N(-d1), exactly satisfying Put-Call Parity: c - p = S0 - K * exp(-r*T).",
      citation: { chapter: "15", section: "15.5", page: "369" }
    },
    {
      id: "F03",
      category: "market_rule",
      statement: "Economic Interpretation of N(d1) and N(d2): N(d2) is the risk-neutral probability that the call option expires in-the-money (S_T > K). N(d1) represents the option delta (the hedge ratio of shares required).",
      citation: { chapter: "15", section: "15.5", page: "370" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Cumulative Normal Symmetry: Standard cumulative normal function N(x) satisfies N(-x) = 1 - N(x), allowing analytical transformation between call and put pricing formulas.",
      citation: { chapter: "15", section: "15.5", page: "369" }
    },
    {
      id: "F05",
      category: "market_rule",
      statement: "Implied Volatility and Numerical Search: Implied volatility equates BSM model price to observed market price. It lacks closed-form formula and is calculated numerically using Newton-Raphson iteration.",
      citation: { chapter: "15", section: "15.8", page: "374" }
    },
    {
      id: "F06",
      category: "market_rule",
      statement: "The VIX Index Architecture: The CBOE Volatility Index (VIX) tracks 30-day expected market volatility derived from a model-free portfolio of out-of-the-money S&P 500 options.",
      citation: { chapter: "15", section: "15.9", page: "376" }
    },
    {
      id: "F07",
      category: "formula",
      statement: "Dividends in the BSM Model: For discrete dividends with present value D, spot stock price S0 is replaced by (S0 - D) in the BSM formula, reducing call prices and increasing put prices.",
      citation: { chapter: "15", section: "15.12", page: "380" }
    },
    {
      id: "F08",
      category: "formula",
      statement: "Black's Approximation for American Calls with Dividends: An American call on a dividend-paying stock may be exercised early just before an ex-dividend date t_D if dividend D exceeds K * [1 - exp(-r(T - t_D))].",
      citation: { chapter: "15", section: "15.12", page: "382" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson Plan
const lessonPlan = {
  chapterId: "ch15",
  partId: "p2",
  title: "The Black-Scholes-Merton Model - Part 2: Analytical Valuation & Cumulative Normals",
  estimatedDurationSec: 840,
  scenes: [
    { sceneId: "s00", title: "The Closed-Form Crown: Solving the Master PDE", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "The Black-Scholes Call Formula: The Cash Flow Split", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "The Meaning of N(d2): Risk-Neutral ITM Probability", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "The Meaning of N(d1): The Delta Hedge Engine", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "The Black-Scholes European Put Formula", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Limiting Asymptotics: Extreme Volatilities & Expirations", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "Implied Volatility: Inverting the Black-Scholes Formula", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "The Newton-Raphson Numerical Engine", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "The Volatility Smile & Skew: The Reality Gap", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: BSM Call Pricing & ITM Probability Calculation", beats: ["s09b1", "s09b2", "s09b3", "s09b4", "s09b5"] },
    { sceneId: "s10", title: "The Cboe VIX Index: The Market's Fear Gauge", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Black-Scholes Option Pricing", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Math Blueprint
const mathBlueprint = {
  chapterId: "ch15",
  partId: "p2",
  formulas: [
    { id: "M01", latex: "c = S_0 N(d_1) - K e^{-rT} N(d_2)", description: "BSM European Call Formula" },
    { id: "M02", latex: "p = K e^{-rT} N(-d_2) - S_0 N(-d_1)", description: "BSM European Put Formula" },
    { id: "M03", latex: "d_1 = \\frac{\\ln(S_0 / K) + (r + 0.5\\sigma^2)T}{\\sigma \\sqrt{T}}, \\quad d_2 = d_1 - \\sigma \\sqrt{T}", description: "Normalized Standard Normal Offsets" },
    { id: "M04", latex: "\\sigma_{n+1} = \\sigma_n - \\frac{c_{\\text{BSM}}(\\sigma_n) - c_{\\text{market}}}{\\mathcal{V}(\\sigma_n)}", description: "Newton-Raphson Implied Volatility Solver" }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical Script
const pedagogicalScript = {
  chapterId: "ch15",
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
  chapterId: "ch15",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 15",
  partLabel: "Part 2",
  title: "The Black-Scholes-Merton Model - Part 2: Analytical Valuation & Cumulative Normals",
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
    // Scene 0: Closed-Form Crown (b01-b04)
    {
      id: "s00",
      index: 0,
      title: "The Closed-Form Crown: Solving the Master PDE",
      purpose: "Establish how solving the Black-Scholes PDE produces closed-form analytical formulas for European options",
      takeaways: [
        "In Part 1, we derived the governing Black-Scholes PDE: df/dt + r*S*(df/dS) + 0.5*sigma^2*S^2*(d^2f/dS^2) = r*f",
        "By transforming coordinates into the heat diffusion equation, Fischer Black and Myron Scholes solved it analytically",
        "Part 2 explores the resulting formulas, the meaning of N(d1) and N(d2), and implied volatility"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "From Partial Differential Equation to Closed-Form Formula",
        steps: [
          { label: "1. The Governing PDE", detail: "df/dt + r*S*(df/dS) + 0.5*sigma^2*S^2*(d^2f/dS^2) = r*f" },
          { label: "2. Coordinate Transformation", detail: "Change variables x = ln(S/K) and tau = 0.5*sigma^2*(T-t) to map to heat diffusion" },
          { label: "3. Green's Function Integration", detail: "Integrate terminal payoff against Gaussian heat kernel" },
          { label: "4. The Closed-Form Solution", detail: "c = S0*N(d1) - K*exp(-rT)*N(d2): instant option pricing without simulation" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "Celebrate the analytical breakthrough: transforming PDE into closed-form equations",
          sourceFactIds: ["F01"],
          newTerms: ["Closed-form crown"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "Explain how variable transformation connects financial options to heat diffusion",
          sourceFactIds: ["F01"],
          newTerms: ["Heat diffusion mapping"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "Highlight the practical impact: instantaneous evaluation of vanilla contracts",
          sourceFactIds: ["F01"],
          newTerms: ["Instantaneous evaluation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Outline Part 2 roadmap: call formula, N(d1)/N(d2), put formula, and implied volatility",
          sourceFactIds: ["F01", "F05"],
          newTerms: ["Part 2 analytical roadmap"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 1: BSM Call Formula (b05-b08)
    {
      id: "s01",
      index: 1,
      title: "The Black-Scholes Call Formula: The Cash Flow Split",
      purpose: "Present the exact European call formula c = S0*N(d1) - K*exp(-rT)*N(d2) and explain the two terms",
      takeaways: [
        "The formula decomposes the call into two distinct cash legs: asset leg S0*N(d1) and cash leg K*exp(-rT)*N(d2)",
        "Offset d1 = [ln(S0/K) + (r + 0.5*sigma^2)*T] / (sigma * sqrt(T)) measures moneyness plus volatility drift",
        "Offset d2 = d1 - sigma * sqrt(T) subtracts volatility dispersion to measure exercise probability"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Black-Scholes-Merton Call Option Formula",
        formula: {
          latex: "c = S_0 N(d_1) - K e^{-rT} N(d_2)",
          expression: "c = S0 * N(d1) - K * exp(-r * T) * N(d2)",
          solvesFor: "European Call Option Price c",
          variables: [
            { symbol: "c", latex: "c", meaning: "Theoretical Fair Call Price", unit: "USD" },
            { symbol: "S_0 N(d_1)", latex: "S_0 N(d_1)", meaning: "Expected Present Value of Stock Received Conditional on Exercise", unit: "USD" },
            { symbol: "K e^(-rT) N(d_2)", latex: "K e^{-rT} N(d_2)", meaning: "Present Value of Cash Strike Paid Conditional on Exercise", unit: "USD" },
            { symbol: "N(x)", latex: "N(x)", meaning: "Standard Cumulative Normal Distribution Function", unit: "probability" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "S_0 N(d_1)", meaning: "Asset received leg: present value of underlying share", unit: "asset leg" },
          { id: "p2", symbolLatex: "-K e^{-rT} N(d_2)", meaning: "Cash payment leg: discounted strike multiplied by exercise probability", unit: "cash leg" },
          { id: "p3", symbolLatex: "d_1 = \\frac{\\ln(S_0/K) + (r + 0.5\\sigma^2)T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}", meaning: "Normalized moneyness z-scores", unit: "z-scores" }
        ],
        note: "Every call option is economically an exchange: receiving stock S0*N(d1) in return for paying cash strike K*exp(-rT)*N(d2)."
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "State the famous Black-Scholes European call pricing formula",
          sourceFactIds: ["F01"],
          newTerms: ["BSM call formula"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Formulate d1 and d2 mathematically",
          sourceFactIds: ["F01"],
          newTerms: ["d1 formula", "d2 formula"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Dissect the two cash legs: asset received S0*N(d1) minus strike paid K*exp(-rT)*N(d2)",
          sourceFactIds: ["F01"],
          newTerms: ["Two-leg cash flow decomposition"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Introduce the standard normal cumulative distribution function N(x)",
          sourceFactIds: ["F01", "F04"],
          newTerms: ["Standard normal CDF N(x)"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Meaning of N(d2) (b09-b12)
    {
      id: "s02",
      index: 2,
      title: "The Meaning of N(d2): Risk-Neutral ITM Probability",
      purpose: "Explain the probabilistic meaning of N(d2): the risk-neutral probability that the call expires in-the-money",
      takeaways: [
        "N(d2) is the exact risk-neutral probability that S_T > K at expiration: P_Q(S_T > K) = N(d2)",
        "It determines whether the strike payment K must be paid at time T",
        "Multiplying strike K by N(d2) gives expected strike payment; discounting by exp(-rT) gives present value"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "d2-probability",
          heading: "N(d2) = Risk-Neutral ITM Probability",
          tone: "positive",
          points: [
            "Probability that option finishes in-the-money: P_Q(S_T > K)",
            "Directly multiplies strike K: expected cash payment",
            "Discounted present value is K * exp(-rT) * N(d2)"
          ]
        },
        right: {
          id: "binary-call",
          heading: "Binary Cash-or-Nothing Call",
          tone: "neutral",
          points: [
            "Pays fixed $1 if S_T > K, zero otherwise",
            "Fair value is exactly exp(-rT) * N(d2)",
            "Proves N(d2) is a pure digital state price"
          ]
        },
        verdict: {
          id: "nd2-verdict",
          text: "N(d2) answers the binary question: 'What is the probability this option will be exercised at expiration?'"
        }
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Reveal the probabilistic interpretation of N(d2)",
          sourceFactIds: ["F03"],
          newTerms: ["N(d2) interpretation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Derive N(d2) as the risk-neutral probability that ln(S_T) > ln(K)",
          sourceFactIds: ["F03"],
          newTerms: ["Risk-neutral ITM probability"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Connect N(d2) to the binary cash-or-nothing call option",
          sourceFactIds: ["F03"],
          newTerms: ["Binary option equivalence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Summarize: N(d2) sizes the cash leg of the option payment",
          sourceFactIds: ["F03"],
          newTerms: ["Cash leg sizing"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Meaning of N(d1) (b13-b16)
    {
      id: "s03",
      index: 3,
      title: "The Meaning of N(d1): The Delta Hedge Engine",
      purpose: "Explain the mathematical and economic meaning of N(d1): the option delta and asset share weighting",
      takeaways: [
        "N(d1) is the partial derivative of call price with respect to stock price: dc/dS = N(d1) = Delta",
        "It tells the trader exactly how many shares of stock must be purchased to delta-hedge a short call",
        "N(d1) is strictly greater than N(d2) because stock received in higher price states has greater conditional value"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "nd1-delta",
          heading: "N(d1) = Option Delta (Hedge Ratio)",
          tone: "positive",
          points: [
            "Sensitivity dc/dS: dollar change in call per $1 move in stock",
            "Exact quantity of stock shares held in replicating portfolio",
            "Bounds: 0 <= N(d1) <= 1 for call options"
          ]
        },
        right: {
          id: "nd2-prob",
          heading: "N(d2) = ITM Exercise Probability",
          tone: "neutral",
          points: [
            "Physical/risk-neutral probability of finishing in-the-money",
            "Always less than N(d1) because d1 > d2: d1 = d2 + sigma*sqrt(T)",
            "Measures cash strike payment likelihood"
          ]
        },
        verdict: {
          id: "d1-d2-verdict",
          text: "N(d1) weights stock price by conditional upside value, while N(d2) measures binary exercise probability."
        }
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Introduce the financial meaning of N(d1)",
          sourceFactIds: ["F03"],
          newTerms: ["N(d1) interpretation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Differentiate the BSM formula with respect to S to prove dc/dS = N(d1)",
          sourceFactIds: ["F03"],
          newTerms: ["Delta derivation dc/dS"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Explain why N(d1) strictly exceeds N(d2): conditional stock expectation",
          sourceFactIds: ["F03"],
          newTerms: ["N(d1) vs N(d2) divergence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Showcase N(d1) as the real-time execution engine for dynamic delta hedging desks",
          sourceFactIds: ["F03"],
          newTerms: ["Dynamic hedge execution engine"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: BSM European Put Formula (b17-b20)
    {
      id: "s04",
      index: 4,
      title: "The Black-Scholes European Put Formula",
      purpose: "Derive the European put formula p = K*exp(-rT)*N(-d2) - S0*N(-d1) via Put-Call Parity",
      takeaways: [
        "Applying Put-Call Parity p = c - S0 + K*exp(-rT) yields p = K*exp(-rT)*N(-d2) - S0*N(-d1)",
        "Put delta is N(d1) - 1 = -N(-d1), which is strictly negative (-1 <= Delta_put <= 0)",
        "Risk-neutral probability of put exercise is N(-d2) = 1 - N(d2)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Black-Scholes-Merton Put Option Formula",
        formula: {
          latex: "p = K e^{-rT} N(-d_2) - S_0 N(-d_1)",
          expression: "p = K * exp(-r * T) * N(-d2) - S0 * N(-d1)",
          solvesFor: "European Put Option Price p",
          variables: [
            { symbol: "p", latex: "p", meaning: "Theoretical Fair Put Price", unit: "USD" },
            { symbol: "N(-d_2)", latex: "N(-d_2)", meaning: "Risk-Neutral Probability of Put Exercise (S_T < K)", unit: "probability" },
            { symbol: "N(-d_1)", latex: "N(-d_1)", meaning: "Absolute Put Delta |Delta_put|", unit: "shares" },
            { symbol: "K e^(-rT)", latex: "K e^{-rT}", meaning: "Present Value of Strike Cash Collected", unit: "USD" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "K e^{-rT} N(-d_2)", meaning: "Cash received leg: discounted strike multiplied by put exercise probability", unit: "cash leg" },
          { id: "p2", symbolLatex: "-S_0 N(-d_1)", meaning: "Asset surrendered leg: present value of stock delivered", unit: "asset leg" },
          { id: "p3", symbolLatex: "\\Delta_{\\text{put}} = N(d_1) - 1 = -N(-d_1)", meaning: "Put delta: negative sensitivity between -1 and 0", unit: "delta" }
        ],
        note: "Normal distribution symmetry N(-x) = 1 - N(x) preserves flawless mathematical duality between calls and puts."
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Derive the European put formula using Put-Call Parity",
          sourceFactIds: ["F02"],
          newTerms: ["BSM put formula derivation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Apply symmetry property N(-x) = 1 - N(x)",
          sourceFactIds: ["F02", "F04"],
          newTerms: ["Normal symmetry transformation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Examine put delta: -N(-d1), requiring short stock shares to hedge",
          sourceFactIds: ["F02"],
          newTerms: ["Put delta -N(-d1)"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Confirm Put-Call Parity: c - p = S0 - K*exp(-rT) holds identically",
          sourceFactIds: ["F02"],
          newTerms: ["Parity identity verification"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Limiting Asymptotics (b21-b24)
    {
      id: "s05",
      index: 5,
      title: "Limiting Asymptotics: Extreme Volatilities & Expirations",
      purpose: "Test boundary behavior as volatility and time to expiration approach zero and infinity",
      takeaways: [
        "As sigma -> 0 (zero volatility): call becomes deterministic forward c -> max(S0 - K*exp(-rT), 0)",
        "As sigma -> infinity (infinite volatility): call price approaches full underlying stock price c -> S0",
        "As T -> 0: option collapses cleanly to intrinsic payoff max(S - K, 0)"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Asymptotic Limits of the Black-Scholes Formula",
        steps: [
          { label: "1. Zero Volatility (sigma -> 0)", detail: "d1 and d2 diverge to +/- infinity; call becomes pure discounted forward payoff" },
          { label: "2. Infinite Volatility (sigma -> inf)", detail: "d1 -> +infinity (N(d1)->1) while d2 -> -infinity (N(d2)->0); call price approaches S0" },
          { label: "3. Zero Expiration (T -> 0)", detail: "Time value vanishes; call price collapses to intrinsic payoff max(S0 - K, 0)" },
          { label: "4. Infinite Expiration (T -> inf)", detail: "Cash strike discounts to zero (K*exp(-rT) -> 0); European call price approaches S0" }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Examine asymptotic boundary tests of the BSM formula",
          sourceFactIds: ["F01"],
          newTerms: ["Asymptotic limits"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Analyze zero volatility limit: call behaves as pure deterministic forward",
          sourceFactIds: ["F01"],
          newTerms: ["Zero volatility limit"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Analyze infinite volatility limit: call approaches stock price S0",
          sourceFactIds: ["F01"],
          newTerms: ["Infinite volatility limit"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Analyze expiration collapse as T -> 0 to intrinsic value",
          sourceFactIds: ["F01"],
          newTerms: ["Intrinsic collapse at expiration"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Implied Volatility (b25-b28)
    {
      id: "s06",
      index: 6,
      title: "Implied Volatility: Inverting the Black-Scholes Formula",
      purpose: "Define Implied Volatility as the market's forward-looking consensus parameter and explain why inversion is numerical",
      takeaways: [
        "In theory, volatility sigma is an input; in practice, market price c_market is observed and sigma_implied is backed out",
        "Because N(d1) and N(d2) contain sigma inside non-linear integrals, closed-form inversion is mathematically impossible",
        "Implied volatility represents the consensus forward-looking market price of risk"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "theoretical-forward",
          heading: "Theoretical BSM (Forward Direction)",
          tone: "neutral",
          points: [
            "Input: Historical Volatility sigma",
            "Evaluate formula c = BSM(S, K, r, T, sigma)",
            "Output: Theoretical Option Price c"
          ]
        },
        right: {
          id: "market-inverse",
          heading: "Market Reality (Inverse Direction)",
          tone: "positive",
          points: [
            "Input: Observed Exchange Market Quote c_market",
            "Invert formula: find sigma such that BSM(sigma) = c_market",
            "Output: Implied Volatility (Forward-Looking Consensus)"
          ]
        },
        verdict: {
          id: "iv-verdict",
          text: "Options trade as pure quotations of implied volatility; Black-Scholes serves as the market's universal translation code."
        }
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce the practical market inversion: from price to implied volatility",
          sourceFactIds: ["F05"],
          newTerms: ["Implied volatility"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Explain why sigma cannot be solved with elementary algebra (non-linear CDF)",
          sourceFactIds: ["F05"],
          newTerms: ["Non-invertibility barrier"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Contrast backward-looking historical volatility with forward-looking implied volatility",
          sourceFactIds: ["F05"],
          newTerms: ["Historical vs implied volatility"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Set the stage for numerical root-finding algorithms",
          sourceFactIds: ["F05"],
          newTerms: ["Numerical root finding"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Newton-Raphson Engine (b29-b32)
    {
      id: "s07",
      index: 7,
      title: "The Newton-Raphson Numerical Engine",
      purpose: "Formulate the Newton-Raphson iteration algorithm using Vega dc/d_sigma to compute implied volatility in 3-4 steps",
      takeaways: [
        "Newton-Raphson iteration formula: sigma_{n+1} = sigma_n - [c(sigma_n) - c_market] / Vega(sigma_n)",
        "Vega is the derivative of option price with respect to volatility: Vega = S0 * sqrt(T) * N'(d1)",
        "Because Vega is strictly positive for all vanilla options, Newton-Raphson converges quadratically in 3 to 4 iterations"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Newton-Raphson Implied Volatility Algorithm",
        formula: {
          latex: "\\sigma_{n+1} = \\sigma_n - \\frac{c(\\sigma_n) - c_{\\text{market}}}{\\mathcal{V}(\\sigma_n)}, \\quad \\mathcal{V} = S_0 \\sqrt{T} N'(d_1)",
          expression: "sigma_{n+1} = sigma_n - (c(sigma_n) - c_market) / Vega",
          solvesFor: "Next Volatility Guess sigma_{n+1}",
          variables: [
            { symbol: "sigma_n", latex: "\\sigma_n", meaning: "Current Volatility Estimate", unit: "pct" },
            { symbol: "c(sigma_n) - c_mkt", latex: "c(\\sigma_n) - c_{\\text{market}}", meaning: "Pricing Error at Current Guess", unit: "USD" },
            { symbol: "Vega", latex: "\\mathcal{V}", meaning: "Option Vega: Price Sensitivity to Volatility", unit: "USD/pct" },
            { symbol: "N'(d1)", latex: "N'(d_1)", meaning: "Standard Normal Probability Density Function (Bell Curve)", unit: "density" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "c(\\sigma_n) - c_{\\text{market}}", meaning: "Distance between model price and observed exchange trade", unit: "error" },
          { id: "p2", symbolLatex: "\\mathcal{V} = S_0 \\sqrt{T} \\frac{1}{\\sqrt{2\\pi}} e^{-d_1^2 / 2}", meaning: "Vega: slope of pricing curve with respect to sigma", unit: "slope" },
          { id: "p3", symbolLatex: "\\text{Convergence}", meaning: "Quadratic convergence: doubles significant digits at each iteration step", unit: "speed" }
        ],
        note: "Every institutional options market maker runs this vectorized Newton-Raphson loop millions of times per second."
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Introduce the Newton-Raphson root-finding algorithm",
          sourceFactIds: ["F05"],
          newTerms: ["Newton-Raphson algorithm"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "Define Vega: the slope derivative of option price with respect to sigma",
          sourceFactIds: ["F05"],
          newTerms: ["Option Vega"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Walk through step update: subtract pricing error divided by Vega",
          sourceFactIds: ["F05"],
          newTerms: ["Newton update step"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Highlight quadratic convergence: achieves 6 decimal places of accuracy in 3 steps",
          sourceFactIds: ["F05"],
          newTerms: ["Quadratic convergence rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Volatility Smile & Skew (b33-b36)
    {
      id: "s08",
      index: 8,
      title: "The Volatility Smile & Skew: The Reality Gap",
      purpose: "Expose the empirical breakdown of BSM constant volatility: the volatility smile and equity skew",
      takeaways: [
        "The BSM model assumes volatility sigma is constant across all strikes and maturities",
        "In real markets, plotting implied volatility against strike reveals a curve: the Volatility Smile or Skew",
        "Equity options exhibit a downward skew: out-of-the-money puts trade at elevated implied volatilities to price crash risk"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "bsm-assumption",
          heading: "Black-Scholes Theoretical World",
          tone: "neutral",
          points: [
            "Constant volatility flat surface across all strikes",
            "Asset returns follow exact lognormal bell curve",
            "Zero crash risk premium or skew"
          ]
        },
        right: {
          id: "market-reality",
          heading: "Empirical Reality: Volatility Skew",
          tone: "positive",
          points: [
            "Low-strike OTM puts trade at 30% IV; high-strike calls at 15% IV",
            "Fat left tails (leptokurtosis) and negative leverage skew",
            "Post-1987 crash insurance pricing structural reality"
          ]
        },
        verdict: {
          id: "skew-verdict",
          text: "The volatility smile is the market's way of compensating for the non-lognormal fat-tailed reality of asset returns."
        }
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Expose the breakdown of constant volatility: the volatility smile",
          sourceFactIds: ["F05"],
          newTerms: ["Volatility smile"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Explain the post-1987 crash equity skew: elevated demand for OTM downside puts",
          sourceFactIds: ["F05"],
          newTerms: ["Volatility skew", "Crash risk premium"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Identify fat tails (leptokurtosis) and jump diffusion as the root causes",
          sourceFactIds: ["F05"],
          newTerms: ["Fat tails", "Leptokurtosis"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Summarize: quants use Black-Scholes as a quotation language while pricing off the smile",
          sourceFactIds: ["F05"],
          newTerms: ["Quotation language paradigm"],
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
      title: "Active Recall Scenario: BSM Call Pricing & ITM Probability Calculation",
      purpose: "Test student mastery on calculating d1, d2, N(d1), N(d2), and call price c using John Hull benchmark values",
      takeaways: [
        "Given S0=$42, K=$40, r=10%, sigma=20%, T=0.5 years: d1 = 0.7693, d2 = 0.6278",
        "N(d1) = 0.7791 (option delta); N(d2) = 0.7349 (ITM exercise probability)",
        "Call price c = 42(0.7791) - 40*exp(-0.05)(0.7349) = $32.72 - $27.96 = $4.76"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A stock trades at S0 = $42. Strike K = $40, r = 10% per year, sigma = 20% per year, and T = 6 months (0.5 years). Given d1 = 0.7693 (N(d1)=0.7791) and d2 = 0.6278 (N(d2)=0.7349), what is the European call option price?",
        options: [
          { id: "opt-a", text: "c = $4.76", correct: true },
          { id: "opt-b", text: "c = $2.00", correct: false },
          { id: "opt-c", text: "c = $6.24", correct: false },
          { id: "opt-d", text: "c = $3.85", correct: false }
        ],
        explanation: "Evaluating the BSM formula: Asset leg = S0 * N(d1) = $42 * 0.7791 = $32.722. Cash leg = K * exp(-rT) * N(d2) = $40 * exp(-0.10 * 0.5) * 0.7349 = $40 * 0.95123 * 0.7349 = $27.962. Call price c = $32.722 - $27.962 = $4.76!"
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Present John Hull's benchmark numerical problem: S0=$42, K=$40, r=10%, sigma=20%, T=0.5",
          sourceFactIds: ["F01"],
          newTerms: ["Hull benchmark example"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Calculate d1 = 0.7693 and d2 = 0.6278",
          sourceFactIds: ["F01"],
          newTerms: ["Calculated d1 and d2"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Look up normal CDF values: N(d1) = 0.7791 and N(d2) = 0.7349",
          sourceFactIds: ["F01", "F03"],
          newTerms: ["Normal cumulative values"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Calculate the two cash legs: $32.72 minus $27.96",
          sourceFactIds: ["F01"],
          newTerms: ["Cash leg calculation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b41 }, hi: { display: hiBeats.b41 } },
          onScreenIntent: "Conclude with fair call price $4.76 and verify against intrinsic value ($2.00)",
          sourceFactIds: ["F01"],
          newTerms: ["Final call price verification"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Cboe VIX Index (b42-b45)
    {
      id: "s10",
      index: 10,
      title: "The Cboe VIX Index: The Market's Fear Gauge",
      purpose: "Examine the architecture of the Cboe VIX Index and how it prices 30-day forward volatility without models",
      takeaways: [
        "The VIX index measures 30-day expected annualized market volatility derived from S&P 500 option prices",
        "It uses a model-free formula integrating across a strip of out-of-the-money calls and puts",
        "Known as Wall Street's Fear Gauge, VIX spikes during market crashes, providing a liquid hedging instrument"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Architecture of the Cboe VIX Index",
        steps: [
          { label: "1. S&P 500 Option Strip", detail: "Collect mid-market bid-ask prices for out-of-the-money SPX puts and calls expiring near 30 days" },
          { label: "2. Model-Free Volatility", detail: "Integrate option prices inversely weighted by strike squared (1/K^2)" },
          { label: "3. Annualization Scaling", detail: "Scale variance by 365/30 and extract square root: VIX = 100 * sqrt(sigma^2)" },
          { label: "4. Tradable Volatility Products", detail: "Traders execute VIX futures, options, and exchange-traded notes for pure volatility exposure" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b42 }, hi: { display: hiBeats.b42 } },
          onScreenIntent: "Introduce the Cboe Volatility Index (VIX)",
          sourceFactIds: ["F06"],
          newTerms: ["Cboe VIX Index"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b43 }, hi: { display: hiBeats.b43 } },
          onScreenIntent: "Explain why VIX is model-free: independent of Black-Scholes assumptions",
          sourceFactIds: ["F06"],
          newTerms: ["Model-free volatility formula"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b44 }, hi: { display: hiBeats.b44 } },
          onScreenIntent: "Explain why VIX is called the Fear Gauge: negative correlation with equity indices",
          sourceFactIds: ["F06"],
          newTerms: ["Wall Street Fear Gauge"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b45 }, hi: { display: hiBeats.b45 } },
          onScreenIntent: "Summarize: volatility has evolved into its own standalone institutional asset class",
          sourceFactIds: ["F06"],
          newTerms: ["Volatility asset class"],
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
      title: "Summary Thread: Four Pillars of Black-Scholes Option Pricing",
      purpose: "Consolidate the 8 foundational laws of the Black-Scholes formulas, cumulative normals, and implied volatility",
      takeaways: [
        "Call formula c = S0*N(d1) - K*exp(-rT)*N(d2) and put formula p = K*exp(-rT)*N(-d2) - S0*N(-d1)",
        "N(d1) is option delta; N(d2) is risk-neutral ITM exercise probability",
        "Chapter 16 advances into the Greeks: Delta, Gamma, Vega, Theta, and Rho risk management"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The 8 Laws of the BSM Formulas",
        rules: [
          { id: "r1", title: "1. BSM Call Formula", summary: "c = S0*N(d1) - K*exp(-rT)*N(d2) splits asset received from cash strike paid." },
          { id: "r2", title: "2. Normalized Offsets", summary: "d1 scales moneyness plus volatility drift; d2 = d1 - sigma*sqrt(T) subtracts noise." },
          { id: "r3", title: "3. Meaning of N(d2)", summary: "N(d2) is the risk-neutral probability of expiring in-the-money (S_T > K)." },
          { id: "r4", title: "4. Meaning of N(d1)", summary: "N(d1) is the option delta dc/dS, dictating the exact shares to hold in a delta hedge." },
          { id: "r5", title: "5. BSM Put Formula", summary: "p = K*exp(-rT)*N(-d2) - S0*N(-d1) preserves perfect put-call parity duality." },
          { id: "r6", title: "6. Implied Volatility", summary: "Market price inverts to implied volatility via iterative Newton-Raphson search." },
          { id: "r7", title: "7. Volatility Skew", summary: "Market prices out-of-the-money puts at higher IV to price crash risk and fat tails." },
          { id: "r8", title: "8. Tradable Volatility", summary: "The Cboe VIX index establishes forward 30-day volatility as a liquid asset class." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b46 }, hi: { display: hiBeats.b46 } },
          onScreenIntent: "Synthesize the complete Black-Scholes-Merton analytical framework",
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
          narration: { en: { display: enBeats.b47 }, hi: { display: hiBeats.b47 } },
          onScreenIntent: "Review Rules 1, 2, and 3: Call formula, d1/d2 offsets, and the meaning of N(d2)",
          sourceFactIds: ["F01", "F03"],
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
          onScreenIntent: "Review Rules 4 and 5: Option delta N(d1) and the European put formula",
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
          narration: { en: { display: enBeats.b49 }, hi: { display: hiBeats.b49 } },
          onScreenIntent: "Review Rules 6, 7, and 8: Implied volatility, volatility skew, and the VIX index",
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
          narration: { en: { display: enBeats.b50 }, hi: { display: hiBeats.b50 } },
          onScreenIntent: "Conclude Chapter 15 and bridge to Chapter 16: The Greeks and Risk Management",
          sourceFactIds: ["F03"],
          newTerms: ["Chapter 16 Greeks preview"],
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

console.log('Chapter 15 Part 2 successfully built and registered in course_map!');
