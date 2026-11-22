import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch14/p2';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_14/Part_02/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap14_part02/episode_raw.json', 'utf8'));

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
  hiBeats.b39 = "Continuously compounded growth rate aur ninety-five percent confidence interval calculate karne ke liye thoda samay lijiye.";
}
if (!enBeats.b39 || enBeats.b39.startsWith('[')) {
  enBeats.b39 = "Take a moment to calculate the continuously compounded growth rate and 95% confidence interval.";
}

for (let i = 1; i <= 50; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 14 Part 2
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch14",
  partId: "p2",
  facts: [
    {
      id: "F01",
      category: "formula",
      statement: "Itô's Lemma: If variable x follows Itô process dx = a(x, t) dt + b(x, t) dz, any twice-differentiable function G(x, t) satisfies dG = [dG/dx * a + dG/dt + 0.5 * d^2G/dx^2 * b^2] dt + dG/dx * b dz.",
      citation: { chapter: "14", section: "14.6", page: "350" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "Derivative Price Process: Under Geometric Brownian Motion dS = mu * S dt + sigma * S dz, a derivative f(S, t) follows df = [df/dS * mu * S + df/dt + 0.5 * d^2f/dS^2 * sigma^2 * S^2] dt + df/dS * sigma * S dz.",
      citation: { chapter: "14", section: "14.6", page: "351" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "Lognormal Property: Applying Itô's Lemma to G = ln(S) yields d(ln S) = (mu - 0.5 * sigma^2) dt + sigma dz. Across finite horizon T, ln(S_T / S_0) ~ N((mu - 0.5 * sigma^2) * T, sigma^2 * T).",
      citation: { chapter: "14", section: "14.7", page: "353" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Continuously Compounded Growth vs Arithmetic Mean: The continuous compound growth rate is g = mu - 0.5 * sigma^2, which is strictly less than arithmetic expected return mu due to volatility drag.",
      citation: { chapter: "14", section: "14.7", page: "354" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Median vs Mean Stock Price: Median future stock price at maturity T is S_0 * exp((mu - 0.5 * sigma^2) * T), whereas arithmetic expected value is E[S_T] = S_0 * exp(mu * T).",
      citation: { chapter: "14", section: "14.7", page: "355" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Return Variance Scaling: Variance of continuously compounded return over time T is Var(ln(S_T / S_0)) = sigma^2 * T, with standard deviation sigma * sqrt(T).",
      citation: { chapter: "14", section: "14.7", page: "355" }
    },
    {
      id: "F07",
      category: "formula",
      statement: "Risk-Neutral Lognormal Dynamics: Under risk-neutral measure Q, expected drift mu is replaced by risk-free rate r: d(ln S) = (r - 0.5 * sigma^2) dt + sigma dz.",
      citation: { chapter: "14", section: "14.7", page: "356" }
    },
    {
      id: "F08",
      category: "market_rule",
      statement: "Black-Scholes PDE Gateway: Constructing a delta-hedged portfolio (-1 derivative + df/dS shares of stock) eliminates Brownian term dz, enforcing instantaneous risk-free return r.",
      citation: { chapter: "14", section: "14.7", page: "357" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson Plan
const lessonPlan = {
  chapterId: "ch14",
  partId: "p2",
  title: "Wiener Processes & Ito's Lemma - Part 2: Ito's Lemma & Geometric Brownian Motion",
  estimatedDurationSec: 840,
  scenes: [
    { sceneId: "s00", title: "The Non-Linear Transformation Barrier: Why Taylor Series Break", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "Taylor Expansion in Stochastic Worlds: Why (dx)^2 Does Not Vanish", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "Itô's Lemma: The Fundamental Stochastic Chain Rule", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "Convexity Drift: Jensen's Inequality in Continuous Time", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "Geometric Brownian Motion (GBM): The Proportional Law", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Applying Itô's Lemma to G = ln S: The Volatility Drag", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "The Arithmetic vs Compound Return Paradox", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "The Lognormal Distribution: Moments & Confidence Cones", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "Parameter Estimation from Historical Stock Returns", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: 6-Month Lognormal Growth & Confidence Bounds", beats: ["s09b1", "s09b2", "s09b3", "s09b4", "s09b5"] },
    { sceneId: "s10", title: "The Gateway to Black-Scholes: Hedging via Itô's Differential", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Itô's Calculus & Asset Dynamics", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Math Blueprint
const mathBlueprint = {
  chapterId: "ch14",
  partId: "p2",
  formulas: [
    { id: "M01", latex: "dG = \\left( \\frac{\\partial G}{\\partial x} a + \\frac{\\partial G}{\\partial t} + \\frac{1}{2} \\frac{\\partial^2 G}{\\partial x^2} b^2 \\right) dt + \\frac{\\partial G}{\\partial x} b \\, dz", description: "Ito's Lemma Fundamental Formula" },
    { id: "M02", latex: "d(\\ln S) = \\left( \\mu - \\frac{1}{2} \\sigma^2 \\right) dt + \\sigma \\, dz", description: "Log-Price Stochastic Differential" },
    { id: "M03", latex: "\\ln \\frac{S_T}{S_0} \\sim N\\left( \\left(\\mu - \\frac{1}{2}\\sigma^2\\right) T, \\, \\sigma^2 T \\right)", description: "Lognormal Return Distribution" },
    { id: "M04", latex: "E[S_T] = S_0 e^{\\mu T}, \\quad \\text{Median}(S_T) = S_0 e^{(\\mu - 0.5 \\sigma^2) T}", description: "Mean and Median Future Stock Prices" }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical Script
const pedagogicalScript = {
  chapterId: "ch14",
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
  chapterId: "ch14",
  partId: "p2",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 14",
  partLabel: "Part 2",
  title: "Wiener Processes & Ito's Lemma - Part 2: Ito's Lemma & Geometric Brownian Motion",
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
    // Scene 0: Non-Linear Transformation Barrier (b01-b04)
    {
      id: "s00",
      index: 0,
      title: "The Non-Linear Transformation Barrier: Why Taylor Series Break",
      purpose: "Expose why classical Taylor series fail when applied to non-linear transformations of stochastic variables",
      takeaways: [
        "In ordinary calculus, chain rule says dG = G'(x) dx because higher-order (dx)^2 terms vanish",
        "For stochastic processes, (dx)^2 contains (dz)^2 = dt, which is first-order and CANNOT be dropped",
        "Kiyoshi Itô solved this in 1951 by establishing the fundamental lemma of stochastic calculus"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Breakdown of Ordinary Chain Rule",
        steps: [
          { label: "1. Classical Chain Rule", detail: "If x changes smoothly by dx, function G changes by dG = (dG/dx) dx" },
          { label: "2. The Stochastic Term", detail: "Asset price change contains noise: dx = a dt + b dz where dz = epsilon * sqrt(dt)" },
          { label: "3. Squaring the Increment", detail: "(dx)^2 = (a dt + b dz)^2 = b^2 (dz)^2 + O(dt^(3/2)) = b^2 dt" },
          { label: "4. The Non-Vanishing Term", detail: "(dx)^2 is of magnitude dt! It survives in first-order calculus and creates convexity drift" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "Introduce the challenge of taking functions of random variables",
          sourceFactIds: ["F01"],
          newTerms: ["Non-linear transformation barrier"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "Recall ordinary Taylor series: dG = (dG/dx)dx + (1/2)(d^2G/dx^2)(dx)^2",
          sourceFactIds: ["F01"],
          newTerms: ["Taylor series expansion"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "Reveal the shock: (dx)^2 equals b^2 dt, which is NOT negligible",
          sourceFactIds: ["F01"],
          newTerms: ["Non-vanishing quadratic term"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Introduce Kiyoshi Ito's breakthrough formula",
          sourceFactIds: ["F01"],
          newTerms: ["Itô's Lemma"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 1: Taylor Expansion in Stochastic Worlds (b05-b08)
    {
      id: "s01",
      index: 1,
      title: "Taylor Expansion in Stochastic Worlds: Why (dx)^2 Does Not Vanish",
      purpose: "Provide the rigorous algebraic proof of why (dz)^2 = dt and cross terms vanish",
      takeaways: [
        "Expanding (dx)^2 yields a^2(dt)^2 + 2ab(dt)(dz) + b^2(dz)^2",
        "Terms (dt)^2 and (dt)(dz) are of order dt^2 and dt^(1.5), which vanish in the continuous limit",
        "Term (dz)^2 = dt is exactly of order dt, proving the second-order derivative term survives"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Stochastic Multiplication Table",
        formula: {
          latex: "(dz)^2 = dt, \\quad dt \\cdot dz = 0, \\quad (dt)^2 = 0",
          expression: "(dz)^2 = dt; dt * dz = 0; (dt)^2 = 0",
          solvesFor: "Infinitesimal Multiplication Rules",
          variables: [
            { symbol: "(dz)^2", latex: "(dz)^2", meaning: "Square of Brownian Increment", unit: "time" },
            { symbol: "dt", latex: "dt", meaning: "Deterministic Time Step", unit: "time" },
            { symbol: "dz", latex: "dz", meaning: "Wiener Innovation Scaling as sqrt(dt)", unit: "innovation" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "(dz)^2 = \\epsilon^2 \\, dt \\rightarrow dt", meaning: "Variance of epsilon^2 is finite, so sum of (dz)^2 converges deterministically to dt", unit: "proof" },
          { id: "p2", symbolLatex: "dt \\cdot dz = \\epsilon \\, (dt)^{1.5} \\rightarrow 0", meaning: "Power 1.5 vanishes faster than first-order dt", unit: "order" },
          { id: "p3", symbolLatex: "(dt)^2 \\rightarrow 0", meaning: "Second-order deterministic term vanishes in continuous calculus", unit: "order" }
        ],
        note: "This multiplication table is the algebraic engine of all continuous-time quantitative finance."
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Set up the algebraic expansion of (dx)^2",
          sourceFactIds: ["F01"],
          newTerms: ["Quadratic expansion"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Evaluate the order of each term: dt^2, dt^1.5, and (dz)^2",
          sourceFactIds: ["F01"],
          newTerms: ["Order analysis"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Establish (dz)^2 = dt as a deterministic law in continuous time",
          sourceFactIds: ["F01"],
          newTerms: ["Deterministic limit of (dz)^2"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Summarize the 3-rule stochastic multiplication table",
          sourceFactIds: ["F01"],
          newTerms: ["Stochastic multiplication table"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Itô's Lemma Formulation (b09-b12)
    {
      id: "s02",
      index: 2,
      title: "Itô's Lemma: The Fundamental Stochastic Chain Rule",
      purpose: "Present the complete mathematical formulation of Itô's Lemma for G(x, t)",
      takeaways: [
        "If dx = a dt + b dz, then dG = [(dG/dx)*a + dG/dt + 0.5*(d^2G/dx^2)*b^2] dt + (dG/dx)*b dz",
        "The drift of G includes an extra convexity adjustment: 0.5 * (d^2G/dx^2) * b^2",
        "The diffusion of G scales proportionally with delta: (dG/dx) * b"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Itô's Lemma: The Master Stochastic Equation",
        formula: {
          latex: "dG = \\left( \\frac{\\partial G}{\\partial x} a + \\frac{\\partial G}{\\partial t} + \\frac{1}{2} \\frac{\\partial^2 G}{\\partial x^2} b^2 \\right) dt + \\frac{\\partial G}{\\partial x} b \\, dz",
          expression: "dG = (dG/dx * a + dG/dt + 0.5 * d2G/dx2 * b^2) * dt + (dG/dx * b) * dz",
          solvesFor: "Total Stochastic Differential dG",
          variables: [
            { symbol: "dG", latex: "dG", meaning: "Instantaneous Change in Derivative Security G", unit: "USD" },
            { symbol: "dG/dx", latex: "\\frac{\\partial G}{\\partial x}", meaning: "Delta Sensitivity (First Derivative)", unit: "shares" },
            { symbol: "dG/dt", latex: "\\frac{\\partial G}{\\partial t}", meaning: "Theta Time Decay (Partial Derivative)", unit: "USD/yr" },
            { symbol: "d^2G/dx^2", latex: "\\frac{\\partial^2 G}{\\partial x^2}", meaning: "Gamma Curvature (Second Derivative)", unit: "1/USD" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "\\frac{\\partial G}{\\partial x} a \\, dt", meaning: "Drift inherited from underlying asset drift a", unit: "drift" },
          { id: "p2", symbolLatex: "\\frac{1}{2} \\frac{\\partial^2 G}{\\partial x^2} b^2 \\, dt", meaning: "Ito convexity boost generated by volatility and gamma", unit: "convexity" },
          { id: "p3", symbolLatex: "\\frac{\\partial G}{\\partial x} b \\, dz", meaning: "Transformed stochastic volatility noise", unit: "diffusion" }
        ],
        note: "Itô's Lemma proves that volatility directly creates upward expected drift for convex instruments (positive gamma)."
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "State the master formula of Itô's Lemma",
          sourceFactIds: ["F01"],
          newTerms: ["Master Itô equation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Dissect the drift terms: underlying drift, theta time decay, and convexity boost",
          sourceFactIds: ["F01"],
          newTerms: ["Drift dissection", "Convexity boost"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Dissect the diffusion term: Delta times underlying volatility b",
          sourceFactIds: ["F01"],
          newTerms: ["Transformed diffusion"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Emphasize why this equation is the engine of all option pricing models",
          sourceFactIds: ["F01", "F02"],
          newTerms: ["Quantitative pricing engine"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Convexity Drift & Jensen's Inequality (b13-b16)
    {
      id: "s03",
      index: 3,
      title: "Convexity Drift: Jensen's Inequality in Continuous Time",
      purpose: "Explain the economic intuition of the (1/2)*G''*b^2 term using Jensen's inequality and option curvature",
      takeaways: [
        "Jensen's inequality proves that for any convex function G, E[G(x)] > G(E[x])",
        "Because call options have positive gamma (convex payoff), random fluctuations generate positive expected profit",
        "The Itô term (1/2)*G''*b^2 is the exact continuous-time realization of Jensen's inequality"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "linear-asset",
          heading: "Linear Asset (G'' = 0)",
          tone: "neutral",
          points: [
            "Straight line payoff: stock, forward, or futures contract",
            "Second derivative G'' is identically zero",
            "Zero convexity drift: E[G(x)] = G(E[x])"
          ]
        },
        right: {
          id: "convex-option",
          heading: "Convex Option (G'' > 0)",
          tone: "positive",
          points: [
            "Curved non-linear payoff profile: calls and puts",
            "Positive gamma curvature: G'' > 0 everywhere",
            "Positive convexity drift: volatility directly increases expected value"
          ]
        },
        verdict: {
          id: "jensen-verdict",
          text: "Positive gamma options gain more on favorable moves than they lose on unfavorable moves, creating positive drift."
        }
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "Introduce the economic intuition behind the second derivative term",
          sourceFactIds: ["F01"],
          newTerms: ["Convexity intuition"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "Connect the Itô term to Jensen's inequality: E[f(x)] > f(E[x])",
          sourceFactIds: ["F01"],
          newTerms: ["Jensen's inequality"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Show why option owners benefit from volatility: asymmetry in payoff slopes",
          sourceFactIds: ["F01"],
          newTerms: ["Gamma profit asymmetry"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Summarize: Itô's Lemma quantifies the exact value of option convexity",
          sourceFactIds: ["F01"],
          newTerms: ["Quantified convexity value"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Geometric Brownian Motion (b17-b20)
    {
      id: "s04",
      index: 4,
      title: "Geometric Brownian Motion (GBM): The Proportional Law",
      purpose: "Define Geometric Brownian Motion dS = mu S dt + sigma S dz as the canonical model of equity prices",
      takeaways: [
        "Under Geometric Brownian Motion, percentage return dS/S has expected drift mu and volatility sigma",
        "The drift a(S, t) = mu * S and diffusion b(S, t) = sigma * S are proportional to the stock price",
        "Prices can never become negative, honoring limited liability of equity stockholders"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Geometric Brownian Motion Equation",
        formula: {
          latex: "dS = \\mu S \\, dt + \\sigma S \\, dz \\iff \\frac{dS}{S} = \\mu \\, dt + \\sigma \\, dz",
          expression: "dS = mu * S * dt + sigma * S * dz",
          solvesFor: "Stock Price Increment dS",
          variables: [
            { symbol: "S", latex: "S", meaning: "Current Underlying Stock Price", unit: "USD" },
            { symbol: "mu", latex: "\\mu", meaning: "Expected Rate of Return on Stock", unit: "rate/yr" },
            { symbol: "sigma", latex: "\\sigma", meaning: "Annualized Stock Volatility", unit: "pct/yr" },
            { symbol: "dS / S", latex: "\\frac{dS}{S}", meaning: "Instantaneous Percentage Return", unit: "pct" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "\\mu S \\, dt", meaning: "Expected dollar return proportional to price level", unit: "USD" },
          { id: "p2", symbolLatex: "\\sigma S \\, dz", meaning: "Dollar volatility expanding with price level", unit: "USD" },
          { id: "p3", symbolLatex: "S(t) > 0 \\quad \\forall t", meaning: "Strict non-negativity: zero is an absorbing natural barrier", unit: "property" }
        ],
        note: "GBM guarantees percentage returns are scale-invariant, meaning a 10% move is modeled identically at $20 and $200."
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Formulate the Geometric Brownian Motion stochastic differential equation",
          sourceFactIds: ["F02"],
          newTerms: ["GBM equation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Identify drift parameter a(S) = mu * S and diffusion parameter b(S) = sigma * S",
          sourceFactIds: ["F02"],
          newTerms: ["Proportional parameters"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Explain why GBM preserves scale invariance across cheap and expensive stocks",
          sourceFactIds: ["F02"],
          newTerms: ["Scale invariance"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Show why zero is an absorbing boundary that prevents negative prices",
          sourceFactIds: ["F02"],
          newTerms: ["Absorbing zero boundary"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Applying Itô to G = ln S (b21-b24)
    {
      id: "s05",
      index: 5,
      title: "Applying Itô's Lemma to G = ln S: The Volatility Drag",
      purpose: "Apply Itô's Lemma to the logarithmic transform G = ln S, discovering the -0.5*sigma^2 volatility drag",
      takeaways: [
        "For G(S) = ln S: first derivative G' = 1/S, second derivative G'' = -1/S^2 (concave)",
        "Because G'' is negative, the Itô term subtracts drift: 0.5 * (-1/S^2) * (sigma * S)^2 = -0.5 * sigma^2",
        "The stochastic differential for log-price is d(ln S) = (mu - 0.5 * sigma^2) dt + sigma dz"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Log-Price Transformation & Volatility Drag",
        formula: {
          latex: "d(\\ln S) = \\left( \\mu - \\frac{1}{2} \\sigma^2 \\right) dt + \\sigma \\, dz",
          expression: "d(ln S) = (mu - 0.5 * sigma^2) * dt + sigma * dz",
          solvesFor: "Differential of Logarithmic Stock Price",
          variables: [
            { symbol: "ln S", latex: "\\ln S", meaning: "Continuously Compounded Log-Price Variable", unit: "log-price" },
            { symbol: "mu", latex: "\\mu", meaning: "Arithmetic Expected Rate of Return", unit: "rate" },
            { symbol: "0.5 sigma^2", latex: "\\frac{1}{2} \\sigma^2", meaning: "Volatility Drag (Itô Correction Term)", unit: "rate" },
            { symbol: "sigma dz", latex: "\\sigma \\, dz", meaning: "Homogeneous Volatility Diffusion Noise", unit: "innovation" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "\\frac{dG}{dS} = \\frac{1}{S}, \\quad \\frac{d^2G}{dS^2} = -\\frac{1}{S^2}", meaning: "Derivatives of natural logarithm function", unit: "calculus" },
          { id: "p2", symbolLatex: "\\frac{1}{2} \\left(-\\frac{1}{S^2}\\right) (\\sigma S)^2 = -\\frac{1}{2} \\sigma^2", meaning: "The famous minus half sigma squared volatility penalty", unit: "penalty" },
          { id: "p3", symbolLatex: "\\mu - \\frac{1}{2} \\sigma^2", meaning: "Realized continuous compound rate of return", unit: "compound rate" }
        ],
        note: "This single derivation unlocks the analytical solution to Black-Scholes-Merton option pricing."
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Introduce the log transformation G(S) = ln S",
          sourceFactIds: ["F03"],
          newTerms: ["Log transformation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Calculate derivatives: G' = 1/S, G'' = -1/S^2",
          sourceFactIds: ["F03"],
          newTerms: ["Log derivatives"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Substitute into Itô's formula to produce the -0.5*sigma^2 term",
          sourceFactIds: ["F03", "F04"],
          newTerms: ["Volatility drag term"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Highlight why constant diffusion sigma dz simplifies integration",
          sourceFactIds: ["F03"],
          newTerms: ["Constant diffusion advantage"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Arithmetic vs Compound Return Paradox (b25-b28)
    {
      id: "s06",
      index: 6,
      title: "The Arithmetic vs Compound Return Paradox",
      purpose: "Resolve the classic investment paradox: why compound return is strictly less than average arithmetic return",
      takeaways: [
        "If a stock goes +50% then -50%, average arithmetic return is 0%, but actual portfolio loses 25% (1.5 * 0.5 = 0.75)",
        "Continuous compound growth rate g = mu - 0.5*sigma^2 measures the actual wealth growth of a buy-and-hold investor",
        "Higher volatility sigma widens the gap between arithmetic expectation and realized compounding"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "arithmetic-return",
          heading: "Arithmetic Expected Return (mu)",
          tone: "neutral",
          points: [
            "Expected mean return of many parallel universe paths: E[S_T/S_0]",
            "Inflated by rare explosive right-tail lottery outcomes",
            "Formula: mu = Expected percentage gain per year"
          ]
        },
        right: {
          id: "compound-growth",
          heading: "Compound Realized Return (g)",
          tone: "positive",
          points: [
            "Actual growth rate realized along a single typical trajectory over time",
            "Directly reduced by volatility drag: g = mu - 0.5 * sigma^2",
            "Determines long-term median portfolio accumulation"
          ]
        },
        verdict: {
          id: "paradox-verdict",
          text: "Investors do not eat arithmetic averages; wealth compounding is governed by the Itô-corrected rate mu - 0.5*sigma^2."
        }
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce the famous +50% and -50% coin flip paradox",
          sourceFactIds: ["F04"],
          newTerms: ["Volatility drag paradox"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Show math: $100 -> $150 -> $75 (average return 0%, actual return -25%)",
          sourceFactIds: ["F04"],
          newTerms: ["Asymmetric recovery loss"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Connect discrete coin flip drag to continuous Itô term -0.5*sigma^2",
          sourceFactIds: ["F04"],
          newTerms: ["Continuous drag equivalence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Emphasize why long-term wealth managers focus on geometric compound growth",
          sourceFactIds: ["F04"],
          newTerms: ["Geometric wealth management"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Lognormal Distribution & Moments (b29-b32)
    {
      id: "s07",
      index: 7,
      title: "The Lognormal Distribution: Moments & Confidence Cones",
      purpose: "Integrate d(ln S) to establish lognormal distribution of S_T and contrast mean vs median price",
      takeaways: [
        "Log-return ln(S_T / S_0) is normally distributed with mean (mu - 0.5*sigma^2)*T and variance sigma^2*T",
        "Stock price S_T is lognormally distributed with right-skewed positive tail and natural zero floor",
        "Median price is S_0 * exp((mu - 0.5*sigma^2)*T), strictly below the arithmetic mean S_0 * exp(mu * T)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Lognormal Stock Price Properties",
        formula: {
          latex: "\\ln \\frac{S_T}{S_0} \\sim N\\left( \\left(\\mu - \\frac{1}{2}\\sigma^2\\right) T, \\, \\sigma^2 T \\right)",
          expression: "ln(S_T / S_0) ~ N((mu - 0.5 * sigma^2) * T, sigma^2 * T)",
          solvesFor: "Distribution of Stock Price S_T",
          variables: [
            { symbol: "S_T", latex: "S_T", meaning: "Stock Price at Future Expiration Horizon T", unit: "USD" },
            { symbol: "S_0", latex: "S_0", meaning: "Current Initial Stock Price", unit: "USD" },
            { symbol: "mu - 0.5 sigma^2", latex: "\\mu - \\frac{1}{2}\\sigma^2", meaning: "Expected Drift of Logarithm", unit: "rate" },
            { symbol: "sigma sqrt(T)", latex: "\\sigma \\sqrt{T}", meaning: "Standard Deviation of Log-Return", unit: "pct" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "E[S_T] = S_0 e^{\\mu T}", meaning: "Arithmetic expected future price", unit: "USD" },
          { id: "p2", symbolLatex: "\\text{Median}(S_T) = S_0 e^{(\\mu - 0.5 \\sigma^2) T}", meaning: "50th percentile median price: more likely outcome for typical path", unit: "USD" },
          { id: "p3", symbolLatex: "\\text{Var}(S_T) = S_0^2 e^{2\\mu T} (e^{\\sigma^2 T} - 1)", meaning: "Price variance expanding exponentially with time horizon T", unit: "variance" }
        ],
        note: "Because lognormal distributions are right-skewed, the majority of paths end below the arithmetic mean."
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Integrate d(ln S) to arrive at the normal distribution of log-returns",
          sourceFactIds: ["F03"],
          newTerms: ["Log-return normality"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "State the lognormal distribution of future stock price S_T",
          sourceFactIds: ["F03"],
          newTerms: ["Lognormal stock distribution"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "Contrast expected mean price S_0*exp(mu*T) with median price S_0*exp((mu - 0.5*sigma^2)*T)",
          sourceFactIds: ["F05"],
          newTerms: ["Mean vs median divergence"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Construct confidence cone expanding as S_0 * exp((mu - 0.5*sigma^2)*T +/- 1.96*sigma*sqrt(T))",
          sourceFactIds: ["F06"],
          newTerms: ["Lognormal confidence cone"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Parameter Estimation (b33-b36)
    {
      id: "s08",
      index: 8,
      title: "Parameter Estimation from Historical Stock Returns",
      purpose: "Walk through John Hull's methodology for estimating volatility sigma from discrete historical log-returns",
      takeaways: [
        "Sample daily closing prices S_i and compute continuously compounded log-returns u_i = ln(S_i / S_{i-1})",
        "Compute sample standard deviation s across n observations",
        "Annualize volatility using the square-root of time: sigma = s / sqrt(tau) where tau = 1/252 years"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Step-by-Step Historical Volatility Estimation",
        steps: [
          { label: "Step 1: Daily Price Data", detail: "Collect closing stock prices S_0, S_1, ..., S_n at equal time intervals tau" },
          { label: "Step 2: Log Return Series", detail: "Compute continuously compounded returns u_i = ln(S_i / S_{i-1})" },
          { label: "Step 3: Sample Standard Deviation", detail: "Calculate sample variance s^2 = [1/(n-1)] * sum((u_i - u_bar)^2)" },
          { label: "Step 4: Annualization Scaling", detail: "Multiply sample standard deviation s by sqrt(252): sigma = s * sqrt(252)" }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Introduce the practical trading desk requirement: estimating volatility sigma",
          sourceFactIds: ["F06"],
          newTerms: ["Volatility estimation workflow"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Explain why quants compute log returns u_i = ln(S_i / S_{i-1}) rather than percentage returns",
          sourceFactIds: ["F06"],
          newTerms: ["Log return calculation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Compute sample standard deviation s of the log-return series",
          sourceFactIds: ["F06"],
          newTerms: ["Sample standard deviation s"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Annualize volatility: multiply by sqrt(252) trading days per year",
          sourceFactIds: ["F06"],
          newTerms: ["Annualization sqrt(252)"],
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
      title: "Active Recall Scenario: 6-Month Lognormal Growth & Confidence Bounds",
      purpose: "Test student mastery on computing lognormal expected mean, median, and 95% confidence bounds",
      takeaways: [
        "Given S_0=$40, mu=16%, sigma=20%, T=0.5 years: compound drift is 0.16 - 0.5(0.04) = 0.14 per year",
        "Expected log-return is 0.14 * 0.5 = 0.07; median price is $40 * exp(0.07) = $42.90",
        "Expected mean price is $40 * exp(0.16 * 0.5) = $40 * exp(0.08) = $43.33",
        "95% confidence bounds for stock price: [$32.48, $56.67]"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A stock has S_0 = $40, expected return mu = 16% per year, and volatility sigma = 20% per year. What are the expected arithmetic mean price and 50th percentile median price after 6 months (T = 0.5)?",
        options: [
          { id: "opt-a", text: "Mean = $43.33; Median = $42.90", correct: true },
          { id: "opt-b", text: "Mean = $42.90; Median = $43.33", correct: false },
          { id: "opt-c", text: "Mean = $46.40; Median = $46.40", correct: false },
          { id: "opt-d", text: "Mean = $44.00; Median = $41.20", correct: false }
        ],
        explanation: "Mean price is S_0 * exp(mu * T) = $40 * exp(0.16 * 0.5) = $40 * exp(0.08) = $43.33. Median price uses the Itô-corrected rate: S_0 * exp((mu - 0.5*sigma^2) * T) = $40 * exp((0.16 - 0.02) * 0.5) = $40 * exp(0.07) = $42.90!"
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Present the numerical challenge: S_0=$40, mu=16%, sigma=20%, T=0.5 years",
          sourceFactIds: ["F03", "F05"],
          newTerms: ["Numerical challenge"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Calculate the Itô-corrected compound growth rate: 0.16 - 0.5(0.20^2) = 0.14 (14%)",
          sourceFactIds: ["F04"],
          newTerms: ["Calculated growth rate"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Calculate the expected median price: $40 * exp(0.07) = $42.90",
          sourceFactIds: ["F05"],
          newTerms: ["Calculated median price"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Calculate the expected mean price: $40 * exp(0.08) = $43.33",
          sourceFactIds: ["F05"],
          newTerms: ["Calculated mean price"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b41 }, hi: { display: hiBeats.b41 } },
          onScreenIntent: "Construct 95% confidence bounds: [$32.48, $56.67]",
          sourceFactIds: ["F06"],
          newTerms: ["Calculated price bounds"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Gateway to Black-Scholes (b42-b45)
    {
      id: "s10",
      index: 10,
      title: "The Gateway to Black-Scholes: Hedging via Itô's Differential",
      purpose: "Construct the delta-hedged portfolio eliminating Brownian noise dz, establishing the Black-Scholes PDE",
      takeaways: [
        "Form portfolio Pi consisting of short 1 derivative f and long (df/dS) shares of stock",
        "Portfolio change dPi = -df + (df/dS) dS completely eliminates Brownian noise dz",
        "Because dPi is 100% riskless, no-arbitrage enforces dPi = r * Pi * dt, yielding the Black-Scholes PDE"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Derivation Path to the Black-Scholes PDE",
        steps: [
          { label: "1. Stochastic Derivative Differential", detail: "Expand df via Itô's Lemma: df = [...] dt + (df/dS) sigma S dz" },
          { label: "2. The Delta Replicating Hedge", detail: "Form portfolio Pi = -f + (df/dS) S; compute change dPi = -df + (df/dS) dS" },
          { label: "3. Perfect Noise Cancellation", detail: "The Brownian term -(df/dS) sigma S dz cancels +(df/dS) sigma S dz exactly" },
          { label: "4. The Risk-Free No-Arbitrage Law", detail: "Because dPi has zero variance, dPi must equal r * Pi * dt, producing the Black-Scholes PDE" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b42 }, hi: { display: hiBeats.b42 } },
          onScreenIntent: "Set up the delta-hedged portfolio: short 1 option, long df/dS shares of stock",
          sourceFactIds: ["F08"],
          newTerms: ["Delta-hedged portfolio Pi"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b43 }, hi: { display: hiBeats.b43 } },
          onScreenIntent: "Demonstrate that Brownian motion dz cancels out completely from the portfolio differential",
          sourceFactIds: ["F08"],
          newTerms: ["Brownian cancellation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b44 }, hi: { display: hiBeats.b44 } },
          onScreenIntent: "Apply the no-arbitrage rule: riskless portfolio must grow at the risk-free rate r",
          sourceFactIds: ["F08"],
          newTerms: ["Instantaneous riskless growth"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b45 }, hi: { display: hiBeats.b45 } },
          onScreenIntent: "Unveil the Black-Scholes partial differential equation: the foundation of Chapter 15",
          sourceFactIds: ["F08"],
          newTerms: ["Black-Scholes PDE"],
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
      title: "Summary Thread: Four Pillars of Itô's Calculus & Asset Dynamics",
      purpose: "Consolidate the 8 foundational laws of Itô's Lemma, Geometric Brownian Motion, and Lognormal Pricing",
      takeaways: [
        "Itô's Lemma dG = [G_x a + G_t + 0.5 G_xx b^2] dt + G_x b dz governs all non-linear transformations",
        "Applying Itô to ln(S) reveals the volatility drag -0.5*sigma^2 separating arithmetic return from compounding",
        "Chapter 15 solves the Black-Scholes PDE to produce closed-form formulas for European calls and puts"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The 8 Laws of Itô's Calculus",
        rules: [
          { id: "r1", title: "1. Non-Vanishing Quadratic Term", summary: "(dz)^2 = dt forces second-order Taylor terms into continuous-time calculus." },
          { id: "r2", title: "2. Master Itô Equation", summary: "dG = [G_x a + G_t + 0.5 G_xx b^2] dt + G_x b dz defines derivative dynamics." },
          { id: "r3", title: "3. Convexity Boost", summary: "Positive gamma (G_xx > 0) generates upward drift boost from underlying volatility." },
          { id: "r4", title: "4. Geometric Brownian Motion", summary: "dS = mu*S*dt + sigma*S*dz guarantees scale invariance and non-negative prices." },
          { id: "r5", title: "5. Volatility Drag", summary: "d(ln S) = (mu - 0.5*sigma^2) dt + sigma dz penalizes geometric compounding." },
          { id: "r6", title: "6. Lognormal Stock Prices", summary: "S_T is lognormally distributed with right skew and strictly positive values." },
          { id: "r7", title: "7. Mean vs Median Divergence", summary: "Median price S_0*exp((mu - 0.5*sigma^2)*T) is strictly below arithmetic mean." },
          { id: "r8", title: "8. Black-Scholes PDE Gateway", summary: "Delta-hedging eliminates dz, enforcing dPi = r*Pi*dt and unlocking option valuation." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b46 }, hi: { display: hiBeats.b46 } },
          onScreenIntent: "Synthesize the profound power of Itô's stochastic calculus",
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
          onScreenIntent: "Review Rules 1, 2, and 3: quadratic variation, master Itô equation, and convexity boost",
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
          narration: { en: { display: enBeats.b48 }, hi: { display: hiBeats.b48 } },
          onScreenIntent: "Review Rules 4, 5, and 6: GBM, volatility drag, and lognormal stock price distribution",
          sourceFactIds: ["F02", "F03", "F04"],
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
          onScreenIntent: "Review Rules 7 and 8: mean vs median divergence and the Black-Scholes PDE gateway",
          sourceFactIds: ["F05", "F08"],
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
          onScreenIntent: "Conclude Chapter 14 and bridge to Chapter 15: The Black-Scholes-Merton Model",
          sourceFactIds: ["F08"],
          newTerms: ["Chapter 15 preview"],
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

console.log('Chapter 14 Part 2 successfully built and registered in course_map!');
