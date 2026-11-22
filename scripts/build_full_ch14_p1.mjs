import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch14/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_14/Part_01/script.md', 'utf8');
const epRaw = JSON.parse(fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap14_part01/episode_raw.json', 'utf8'));

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
  hiBeats.b39 = "Expected mean aur standard deviation calculate karne ke liye thoda samay lijiye.";
}
if (!enBeats.b39 || enBeats.b39.startsWith('[')) {
  enBeats.b39 = "Take a moment to calculate the expected mean and standard deviation.";
}

for (let i = 1; i <= 50; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 14 Part 1
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch14",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "market_rule",
      statement: "A Markov process is a memoryless stochastic process where only the current value of the variable is relevant for predicting future distributions; historical price paths carry no predictive power.",
      citation: { chapter: "14", section: "14.1", page: "341" }
    },
    {
      id: "F02",
      category: "formula",
      statement: "Standard Wiener Process: Change delta_z across interval delta_t satisfies delta_z = epsilon * sqrt(delta_t) where epsilon ~ N(0, 1), and increments across disjoint intervals are statistically independent.",
      citation: { chapter: "14", section: "14.2", page: "342" }
    },
    {
      id: "F03",
      category: "formula",
      statement: "Generalized Wiener Process: dx = a * dt + b * dz has constant expected drift rate a and constant variance rate b^2. Across finite time T, the change (x_T - x_0) ~ N(a * T, b^2 * T).",
      citation: { chapter: "14", section: "14.3", page: "344" }
    },
    {
      id: "F04",
      category: "formula",
      statement: "Itô Process: Generalized continuous-time process dx = a(x, t) * dt + b(x, t) * dz where drift and variance rate are functions of underlying asset price x and time t.",
      citation: { chapter: "14", section: "14.4", page: "345" }
    },
    {
      id: "F05",
      category: "formula",
      statement: "Geometric Brownian Motion (GBM): Stock price dynamics satisfy dS = mu * S * dt + sigma * S * dz, ensuring percentage returns dS/S are scale-invariant and prices cannot become negative.",
      citation: { chapter: "14", section: "14.5", page: "346" }
    },
    {
      id: "F06",
      category: "market_rule",
      statement: "Square-Root of Time Dispersion Law: While expected drift accumulates linearly with time t, uncertainty (standard deviation) accumulates with the square root of time sqrt(t).",
      citation: { chapter: "14", section: "14.2", page: "343" }
    },
    {
      id: "F07",
      category: "market_rule",
      statement: "Path Roughness: Brownian motion sample paths are continuous everywhere but differentiable nowhere, possessing infinite total variation and finite quadratic variation [z, z]_t = t.",
      citation: { chapter: "14", section: "14.2", page: "343" }
    },
    {
      id: "F08",
      category: "algorithm",
      statement: "Monte Carlo Discrete Propagation: Asset price paths are simulated via S(t + delta_t) = S(t) * [1 + mu * delta_t + sigma * epsilon * sqrt(delta_t)] where epsilon ~ N(0, 1).",
      citation: { chapter: "14", section: "14.5", page: "348" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson Plan
const lessonPlan = {
  chapterId: "ch14",
  partId: "p1",
  title: "Wiener Processes & Ito's Lemma - Part 1: Stochastic Processes & Brownian Motion",
  estimatedDurationSec: 840,
  scenes: [
    { sceneId: "s00", title: "The Calculus Crisis: The Stochastic Wall", beats: ["s00b1", "s00b2", "s00b3", "s00b4"] },
    { sceneId: "s01", title: "The Markov Property: Memoryless Markets", beats: ["s01b1", "s01b2", "s01b3", "s01b4"] },
    { sceneId: "s02", title: "From Discrete Steps to Continuous Time", beats: ["s02b1", "s02b2", "s02b3", "s02b4"] },
    { sceneId: "s03", title: "The Standard Wiener Process: Two Axioms", beats: ["s03b1", "s03b2", "s03b3", "s03b4"] },
    { sceneId: "s04", title: "Why Square-Root of Time? The Dispersion Law", beats: ["s04b1", "s04b2", "s04b3", "s04b4"] },
    { sceneId: "s05", title: "Path Geometry: Continuous Everywhere, Differentiable Nowhere", beats: ["s05b1", "s05b2", "s05b3", "s05b4"] },
    { sceneId: "s06", title: "The Generalized Wiener Process: Drift + Diffusion", beats: ["s06b1", "s06b2", "s06b3", "s06b4"] },
    { sceneId: "s07", title: "Statistical Moments & Probability Distribution", beats: ["s07b1", "s07b2", "s07b3", "s07b4"] },
    { sceneId: "s08", title: "The Fatal Defect: Why Arithmetic Diffusion Fails for Stocks", beats: ["s08b1", "s08b2", "s08b3", "s08b4"] },
    { sceneId: "s09", title: "Active Recall Scenario: 6-Month Generalized Process Confidence Interval", beats: ["s09b1", "s09b2", "s09b3", "s09b4", "s09b5"] },
    { sceneId: "s10", title: "Institutional Quantitative Modeling: Foundations of Modern Quants", beats: ["s10b1", "s10b2", "s10b3", "s10b4"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Continuous Stochastic Modeling", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Math Blueprint
const mathBlueprint = {
  chapterId: "ch14",
  partId: "p1",
  formulas: [
    { id: "M01", latex: "\\Delta z = \\epsilon \\sqrt{\\Delta t}, \\quad \\epsilon \\sim N(0, 1)", description: "Wiener Process Increment" },
    { id: "M02", latex: "dx = a \\, dt + b \\, dz", description: "Generalized Wiener Process" },
    { id: "M03", latex: "x_T - x_0 \\sim N(a T, \\, b^2 T)", description: "Finite Time Change Distribution" },
    { id: "M04", latex: "\\frac{dS}{S} = \\mu \\, dt + \\sigma \\, dz", description: "Geometric Brownian Motion Relative Return" }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical Script
const pedagogicalScript = {
  chapterId: "ch14",
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
  chapterId: "ch14",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 14",
  partLabel: "Part 1",
  title: "Wiener Processes & Ito's Lemma - Part 1: Stochastic Processes & Brownian Motion",
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
    // Scene 0: Calculus Crisis (b01-b04)
    {
      id: "s00",
      index: 0,
      title: "The Calculus Crisis: The Stochastic Wall",
      purpose: "Establish why classical Newtonian calculus breaks down when modeling financial asset price randomness",
      takeaways: [
        "Classical calculus relies on smooth deterministic functions where dy = f'(x) dx",
        "Asset price paths are jagged, erratic, and exhibit infinite total variation in continuous time",
        "Chapter 14 introduces stochastic calculus: the rigorous mathematical language of modern quantitative finance"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Mathematical Evolution Toward Stochastic Calculus",
        steps: [
          { label: "1. Deterministic World (Newton)", detail: "Calculus assumes smooth, differentiable curves where velocity dy/dt is finite" },
          { label: "2. The Financial Reality", detail: "Market prices fluctuate randomly at every millisecond, defying smooth slopes" },
          { label: "3. The Stochastic Wall", detail: "Ratio Delta_x / Delta_t explodes to infinity as Delta_t approaches zero" },
          { label: "4. The Wiener Breakthrough", detail: "Model noise via Brownian motion: increments scale with the square root of time sqrt(dt)" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b01 }, hi: { display: hiBeats.b01 } },
          onScreenIntent: "Introduce the fundamental breakdown of classical calculus in volatile markets",
          sourceFactIds: ["F01", "F07"],
          newTerms: ["Stochastic wall"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b02 }, hi: { display: hiBeats.b02 } },
          onScreenIntent: "Explain why ordinary derivatives dy/dt fail on jagged market price paths",
          sourceFactIds: ["F07"],
          newTerms: ["Non-differentiability"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b03 }, hi: { display: hiBeats.b03 } },
          onScreenIntent: "Present the historical journey from Robert Brown and Louis Bachelier to Kiyoshi Ito",
          sourceFactIds: ["F02"],
          newTerms: ["Brownian motion history"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s00b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b04 }, hi: { display: hiBeats.b04 } },
          onScreenIntent: "Outline Part 1 roadmap: Markov processes, Wiener axioms, and Generalized diffusion",
          sourceFactIds: ["F01", "F03"],
          newTerms: ["Stochastic roadmap"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 1: Markov Property (b05-b08)
    {
      id: "s01",
      index: 1,
      title: "The Markov Property: Memoryless Markets",
      purpose: "Define the Markov property and establish weak-form market efficiency in asset price modeling",
      takeaways: [
        "A Markov process is memoryless: future price distributions depend solely on current price, not history",
        "Historical patterns, chart trends, and past prices carry zero predictive power for future price innovations",
        "The Markov assumption underpins weak-form market efficiency and simplifies stochastic differential equations"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "markov-process",
          heading: "Markov Process (Memoryless)",
          tone: "positive",
          points: [
            "Future distribution P(S_{t+dt} | S_t, S_{t-1}, ...) = P(S_{t+dt} | S_t)",
            "Only the current price S_t encapsulates all known information",
            "Consistent with weak-form Efficient Market Hypothesis"
          ]
        },
        right: {
          id: "path-dependent",
          heading: "Path-Dependent Process (Memory)",
          tone: "trap",
          points: [
            "Future states depend on entire historical trajectory",
            "Requires tracking continuous path history S(u) for 0 <= u <= t",
            "Creates severe analytical and computational complexity"
          ]
        },
        verdict: {
          id: "markov-verdict",
          text: "Assuming stock prices are Markovian enables tractable, rigorous mathematical modeling of derivative contracts."
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b05 }, hi: { display: hiBeats.b05 } },
          onScreenIntent: "Define the Markov property in probability theory",
          sourceFactIds: ["F01"],
          newTerms: ["Markov property"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b06 }, hi: { display: hiBeats.b06 } },
          onScreenIntent: "Connect the Markov property to weak-form Efficient Market Hypothesis",
          sourceFactIds: ["F01"],
          newTerms: ["Weak-form efficiency"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b07 }, hi: { display: hiBeats.b07 } },
          onScreenIntent: "Contrast Markov memorylessness with technical analysis chartist beliefs",
          sourceFactIds: ["F01"],
          newTerms: ["Chartist fallacy"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s01b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b08 }, hi: { display: hiBeats.b08 } },
          onScreenIntent: "Emphasize why Markov modeling makes continuous option pricing mathematically tractable",
          sourceFactIds: ["F01"],
          newTerms: ["Analytical tractability"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 2: Discrete Steps to Continuous Time (b09-b12)
    {
      id: "s02",
      index: 2,
      title: "From Discrete Steps to Continuous Time",
      purpose: "Bridge the discrete binomial random walk to the continuous Wiener process limit",
      takeaways: [
        "A discrete random walk jumps by +sqrt(dt) or -sqrt(dt) with equal probability 0.5",
        "Over finite interval T with N steps, expected total change is 0 and variance is strictly N * dt = T",
        "Taking the limit as dt approaches 0 produces the continuous standard Wiener process dz"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Convergence from Random Walk to Wiener Process",
        steps: [
          { label: "1. Discrete Step Definition", detail: "At each step dt, jump Delta_z = +sqrt(dt) or -sqrt(dt) with probability 0.5" },
          { label: "2. Variance Preservation", detail: "Var(Delta_z) = (1/2)(sqrt(dt))^2 + (1/2)(-sqrt(dt))^2 = dt exactly" },
          { label: "3. Multi-Step Accumulation", detail: "Over N steps where T = N*dt, total variance Var(z_T - z_0) = N * dt = T" },
          { label: "4. Continuous Limit (dt -> 0)", detail: "Sum of independent microscopic jumps converges to continuous Gaussian Wiener process" }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b09 }, hi: { display: hiBeats.b09 } },
          onScreenIntent: "Set up the discrete random walk with step size sqrt(dt)",
          sourceFactIds: ["F02"],
          newTerms: ["Discrete random walk"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b10 }, hi: { display: hiBeats.b10 } },
          onScreenIntent: "Calculate the variance of an individual jump: exactly dt",
          sourceFactIds: ["F02"],
          newTerms: ["Jump variance dt"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b11 }, hi: { display: hiBeats.b11 } },
          onScreenIntent: "Sum variances across N steps: Var = N * dt = T, independent of step count",
          sourceFactIds: ["F02"],
          newTerms: ["Variance accumulation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s02b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b12 }, hi: { display: hiBeats.b12 } },
          onScreenIntent: "Invoke Central Limit Theorem to prove convergence to normal distribution",
          sourceFactIds: ["F02"],
          newTerms: ["Continuous Gaussian limit"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 3: Standard Wiener Process Axioms (b13-b16)
    {
      id: "s03",
      index: 3,
      title: "The Standard Wiener Process: Two Axioms",
      purpose: "Formulate the two mathematical axioms defining the standard Wiener process (Brownian Motion)",
      takeaways: [
        "Axiom 1: Increments Delta_z over Delta_t satisfy Delta_z = epsilon * sqrt(Delta_t) where epsilon ~ N(0, 1)",
        "Axiom 2: Increments across any two non-overlapping disjoint time intervals are statistically independent",
        "The standard Wiener process has zero initial value z(0)=0, zero mean E[z(t)]=0, and variance Var[z(t)]=t"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Fundamental Wiener Process Axiom",
        formula: {
          latex: "\\Delta z = \\epsilon \\sqrt{\\Delta t}, \\quad \\epsilon \\sim N(0, 1)",
          expression: "Delta_z = epsilon * sqrt(Delta_t); epsilon ~ N(0, 1)",
          solvesFor: "Wiener increment Delta_z",
          variables: [
            { symbol: "Delta z", latex: "\\Delta z", meaning: "Wiener Process Step Innovation", unit: "innovation" },
            { symbol: "epsilon", latex: "\\epsilon", meaning: "Standard Normal Random Variable N(0, 1)", unit: "z-score" },
            { symbol: "Delta t", latex: "\\Delta t", meaning: "Elapsed Time Interval in Years", unit: "years" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "E[\\Delta z] = 0", meaning: "Zero expected drift: pure symmetric martingale innovation", unit: "mean" },
          { id: "p2", symbolLatex: "\\text{Var}(\\Delta z) = \\Delta t", meaning: "Variance grows strictly linearly with elapsed time interval", unit: "variance" },
          { id: "p3", symbolLatex: "\\text{Cov}(\\Delta z_1, \\Delta z_2) = 0", meaning: "Independent increments across disjoint intervals (Axiom 2)", unit: "covariance" }
        ],
        note: "Axioms 1 and 2 define mathematical Brownian motion, establishing the foundational building block for all continuous asset pricing."
      },
      beats: [
        {
          id: "s03b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b13 }, hi: { display: hiBeats.b13 } },
          onScreenIntent: "State Axiom 1: Delta_z = epsilon * sqrt(Delta_t) with standard normal epsilon",
          sourceFactIds: ["F02"],
          newTerms: ["Wiener Axiom 1"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b14 }, hi: { display: hiBeats.b14 } },
          onScreenIntent: "State Axiom 2: Independent increments across disjoint time intervals",
          sourceFactIds: ["F02"],
          newTerms: ["Wiener Axiom 2", "Independent increments"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b15 }, hi: { display: hiBeats.b15 } },
          onScreenIntent: "Summarize the statistical moments: mean zero and variance t",
          sourceFactIds: ["F02"],
          newTerms: ["Wiener statistical moments"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s03b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b16 }, hi: { display: hiBeats.b16 } },
          onScreenIntent: "Transition to the critical question: why must noise scale with the square root of time?",
          sourceFactIds: ["F02", "F06"],
          newTerms: ["Square root puzzle"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 4: Square-Root of Time Dispersion Law (b17-b20)
    {
      id: "s04",
      index: 4,
      title: "Why Square-Root of Time? The Dispersion Law",
      purpose: "Explain the profound physical and mathematical reason why standard deviation scales with sqrt(t)",
      takeaways: [
        "Variances add linearly across independent time periods: Var(t1 + t2) = Var(t1) + Var(t2)",
        "Because variance is linear in time (Var = t), standard deviation must scale as sqrt(t)",
        "Over small interval dt, noise of order sqrt(dt) massively dominates deterministic drift of order dt"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Square-Root of Time Dispersion Hierarchy",
        steps: [
          { label: "1. Additivity of Variance", detail: "Independent random shocks mean variances sum: Var(A + B) = Var(A) + Var(B)" },
          { label: "2. Linear Variance Scaling", detail: "If 1 day has variance sigma^2, then 252 trading days has variance 252 * sigma^2" },
          { label: "3. Square-Root Standard Deviation", detail: "Taking square root reveals annual volatility sigma_annual = sigma_daily * sqrt(252)" },
          { label: "4. Microscopic Dominance", detail: "As dt -> 0, sqrt(dt) >> dt; randomness completely overpowers deterministic drift" }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b17 }, hi: { display: hiBeats.b17 } },
          onScreenIntent: "Explore why standard deviation scales as the square root of time",
          sourceFactIds: ["F06"],
          newTerms: ["Square-root scaling law"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b18 }, hi: { display: hiBeats.b18 } },
          onScreenIntent: "Demonstrate that variance is the fundamental additive property in probability",
          sourceFactIds: ["F06"],
          newTerms: ["Variance additivity"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b19 }, hi: { display: hiBeats.b19 } },
          onScreenIntent: "Show practical financial consequence: 16-day volatility is 4x 1-day volatility (sqrt(16) = 4)",
          sourceFactIds: ["F06"],
          newTerms: ["Volatility annualization rule"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s04b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b20 }, hi: { display: hiBeats.b20 } },
          onScreenIntent: "Reveal the microscopic secret: sqrt(dt) is infinitely larger than dt as dt approaches zero",
          sourceFactIds: ["F06", "F07"],
          newTerms: ["Microscopic noise dominance"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 5: Path Geometry (b21-b24)
    {
      id: "s05",
      index: 5,
      title: "Path Geometry: Continuous Everywhere, Differentiable Nowhere",
      purpose: "Examine the fractal geometry of Brownian paths: continuous everywhere but differentiable nowhere",
      takeaways: [
        "Brownian motion paths are continuous (no teleportation jumps across space)",
        "The ratio dz / dt scales as 1 / sqrt(dt), which blows up to infinity as dt approaches zero",
        "Sample paths have infinite total variation but finite quadratic variation: (dz)^2 = dt"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "smooth-path",
          heading: "Smooth Classical Path (Calculus)",
          tone: "neutral",
          points: [
            "Difference ratio Delta_y / Delta_t approaches finite derivative f'(t)",
            "Finite total path length (finite total variation)",
            "Curvature vanishes over microscopic intervals (dz)^2 -> 0"
          ]
        },
        right: {
          id: "brownian-path",
          heading: "Brownian Fractal Path (Wiener)",
          tone: "positive",
          points: [
            "Difference ratio Delta_z / Delta_t explodes to infinity as dt -> 0",
            "Infinite total path length between any two time points",
            "Non-zero quadratic variation: (dz)^2 = dt exactly"
          ]
        },
        verdict: {
          id: "geometry-verdict",
          text: "Because (dz)^2 = dt is of first-order magnitude dt, stochastic Taylor expansions require keeping second derivatives."
        }
      },
      beats: [
        {
          id: "s05b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b21 }, hi: { display: hiBeats.b21 } },
          onScreenIntent: "Examine the astonishing fractal geometry of a continuous Wiener trajectory",
          sourceFactIds: ["F07"],
          newTerms: ["Fractal path geometry"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b22 }, hi: { display: hiBeats.b22 } },
          onScreenIntent: "Prove non-differentiability: dz/dt = epsilon / sqrt(dt) diverges to infinity",
          sourceFactIds: ["F07"],
          newTerms: ["Everywhere non-differentiable"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b23 }, hi: { display: hiBeats.b23 } },
          onScreenIntent: "Explain infinite total variation: path length between any two points is infinite",
          sourceFactIds: ["F07"],
          newTerms: ["Infinite total variation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s05b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b24 }, hi: { display: hiBeats.b24 } },
          onScreenIntent: "Reveal the magical rule of stochastic calculus: (dz)^2 = dt",
          sourceFactIds: ["F07"],
          newTerms: ["Quadratic variation law"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 6: Generalized Wiener Process (b25-b28)
    {
      id: "s06",
      index: 6,
      title: "The Generalized Wiener Process: Drift + Diffusion",
      purpose: "Add deterministic drift rate a and variance rate b^2 to construct the Generalized Wiener Process dx = a dt + b dz",
      takeaways: [
        "A Generalized Wiener Process dx = a * dt + b * dz combines deterministic trend a with stochastic noise b",
        "Parameter a represents the drift rate (expected growth per unit time)",
        "Parameter b represents the diffusion rate (volatility multiplier scaling Brownian innovations)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "The Generalized Wiener Process Equation",
        formula: {
          latex: "dx = a \\, dt + b \\, dz",
          expression: "dx = a * dt + b * dz",
          solvesFor: "dx",
          variables: [
            { symbol: "dx", latex: "dx", meaning: "Instantaneous Change in Stochastic Variable x", unit: "units" },
            { symbol: "a", latex: "a", meaning: "Constant Expected Drift Rate per Unit Time", unit: "units/yr" },
            { symbol: "dt", latex: "dt", meaning: "Infinitesimal Time Increment", unit: "years" },
            { symbol: "b", latex: "b", meaning: "Constant Volatility Diffusion Rate", unit: "units/sqrt(yr)" },
            { symbol: "dz", latex: "dz", meaning: "Standard Wiener Process Innovation dz = epsilon * sqrt(dt)", unit: "innovation" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "a \\, dt", meaning: "Deterministic drift component: predictable deterministic trend", unit: "units" },
          { id: "p2", symbolLatex: "b \\, dz = b \\epsilon \\sqrt{dt}", meaning: "Stochastic diffusion component: zero-mean unpredictable noise", unit: "units" },
          { id: "p3", symbolLatex: "E[dx] = a \\, dt, \\quad \\text{Var}(dx) = b^2 \\, dt", meaning: "Expected instantaneous drift and variance", unit: "moments" }
        ],
        note: "The Generalized Wiener process models variables exhibiting steady directional drift accompanied by symmetric random Gaussian dispersion."
      },
      beats: [
        {
          id: "s06b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b25 }, hi: { display: hiBeats.b25 } },
          onScreenIntent: "Introduce the Generalized Wiener process dx = a dt + b dz",
          sourceFactIds: ["F03"],
          newTerms: ["Generalized Wiener process"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b26 }, hi: { display: hiBeats.b26 } },
          onScreenIntent: "Dissect drift term a dt as the expected deterministic trajectory",
          sourceFactIds: ["F03"],
          newTerms: ["Drift rate a"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b27 }, hi: { display: hiBeats.b27 } },
          onScreenIntent: "Dissect diffusion term b dz as the stochastic Gaussian dispersion",
          sourceFactIds: ["F03"],
          newTerms: ["Diffusion rate b"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s06b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b28 }, hi: { display: hiBeats.b28 } },
          onScreenIntent: "Formulate discrete simulation form: Delta_x = a * Delta_t + b * epsilon * sqrt(Delta_t)",
          sourceFactIds: ["F03", "F08"],
          newTerms: ["Discrete generalized step"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 7: Statistical Moments (b29-b32)
    {
      id: "s07",
      index: 7,
      title: "Statistical Moments & Probability Distribution",
      purpose: "Integrate dx across finite time T to prove the total change is normally distributed: N(a*T, b^2*T)",
      takeaways: [
        "Integrating constant drift a over time T yields expected change E[x_T - x_0] = a * T",
        "Integrating independent diffusion increments yields total variance Var[x_T - x_0] = b^2 * T",
        "The finite-time variable change follows an exact normal distribution: (x_T - x_0) ~ N(a * T, b^2 * T)"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Finite Time Change Distribution",
        formula: {
          latex: "x_T - x_0 \\sim N(a T, \\, b^2 T)",
          expression: "(x_T - x_0) ~ N(a * T, b^2 * T)",
          solvesFor: "Distribution of x_T - x_0",
          variables: [
            { symbol: "x_T - x_0", latex: "x_T - x_0", meaning: "Total Cumulative Change from Time 0 to T", unit: "units" },
            { symbol: "a T", latex: "a T", meaning: "Expected Mean Cumulative Drift", unit: "units" },
            { symbol: "b^2 T", latex: "b^2 T", meaning: "Cumulative Total Variance", unit: "variance" },
            { symbol: "b sqrt(T)", latex: "b \\sqrt{T}", meaning: "Standard Deviation of Cumulative Change", unit: "units" }
          ]
        },
        parts: [
          { id: "p1", symbolLatex: "E[x_T] = x_0 + a T", meaning: "Expected future value of variable x at horizon T", unit: "units" },
          { id: "p2", symbolLatex: "\\text{SD}(x_T) = b \\sqrt{T}", meaning: "Confidence cone width expanding with square-root of horizon T", unit: "units" },
          { id: "p3", symbolLatex: "x_T = x_0 + a T \\pm 1.96 \\, b \\sqrt{T}", meaning: "95% statistical confidence interval at time T", unit: "interval" }
        ],
        note: "Because drift scales as T while volatility scales as sqrt(T), drift dominates over long horizons while volatility dominates over short horizons."
      },
      beats: [
        {
          id: "s07b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b29 }, hi: { display: hiBeats.b29 } },
          onScreenIntent: "Integrate dx across finite time horizon from t=0 to t=T",
          sourceFactIds: ["F03"],
          newTerms: ["Finite time integration"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b30 }, hi: { display: hiBeats.b30 } },
          onScreenIntent: "State the expected total drift: a * T",
          sourceFactIds: ["F03"],
          newTerms: ["Total expected drift"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b31 }, hi: { display: hiBeats.b31 } },
          onScreenIntent: "State the cumulative variance: b^2 * T, and standard deviation b * sqrt(T)",
          sourceFactIds: ["F03"],
          newTerms: ["Total variance b^2*T"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s07b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b32 }, hi: { display: hiBeats.b32 } },
          onScreenIntent: "Formulate the 95% confidence interval: x_0 + a*T +/- 1.96*b*sqrt(T)",
          sourceFactIds: ["F03"],
          newTerms: ["Confidence interval"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 8: Fatal Defect (b33-b36)
    {
      id: "s08",
      index: 8,
      title: "The Fatal Defect: Why Arithmetic Diffusion Fails for Stocks",
      purpose: "Demonstrate why arithmetic generalized Wiener processes fail for equity prices (negative stock prices and scale invariance)",
      takeaways: [
        "In arithmetic diffusion dx = a dt + b dz, dollar volatility b is constant regardless of stock price level",
        "Because normal distributions have infinite negative tails, arithmetic diffusion predicts negative stock prices with positive probability",
        "Equities require proportional percentage returns: dS = mu * S * dt + sigma * S * dz (Geometric Brownian Motion)"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        left: {
          id: "arithmetic-defect",
          heading: "Arithmetic Wiener Process dx = a dt + b dz",
          tone: "trap",
          points: [
            "Dollar volatility is constant: $5 move whether stock is $10 or $1,000",
            "Left tail extends to -infinity: predicts negative stock prices!",
            "Violates limited liability of corporate equity holders"
          ]
        },
        right: {
          id: "geometric-gbm",
          heading: "Geometric Brownian Motion dS = mu S dt + sigma S dz",
          tone: "positive",
          points: [
            "Volatility is proportional: percentage return dS/S scales with price",
            "Stock price is strictly non-negative: S(t) > 0 for all t",
            "Naturally reflects investor return expectations"
          ]
        },
        verdict: {
          id: "defect-verdict",
          text: "Replacing constant dollar increments with percentage returns dS/S solves the negative price defect and establishes GBM."
        }
      },
      beats: [
        {
          id: "s08b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b33 }, hi: { display: hiBeats.b33 } },
          onScreenIntent: "Pose the fundamental question: can we model stock prices using dx = a dt + b dz?",
          sourceFactIds: ["F03", "F05"],
          newTerms: ["Stock price modeling dilemma"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b34 }, hi: { display: hiBeats.b34 } },
          onScreenIntent: "Expose Fatal Defect 1: scale dependence (constant dollar jump across different price levels)",
          sourceFactIds: ["F05"],
          newTerms: ["Scale dependence defect"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b35 }, hi: { display: hiBeats.b35 } },
          onScreenIntent: "Expose Fatal Defect 2: positive probability of negative stock prices violating limited liability",
          sourceFactIds: ["F05"],
          newTerms: ["Negative price defect", "Limited liability violation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s08b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b36 }, hi: { display: hiBeats.b36 } },
          onScreenIntent: "Introduce the cure: Geometric Brownian Motion where percentage return dS/S is Brownian",
          sourceFactIds: ["F05"],
          newTerms: ["Geometric Brownian Motion"],
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
      title: "Active Recall Scenario: 6-Month Generalized Process Confidence Interval",
      purpose: "Test student ability to compute mean, variance, and 95% confidence interval for a generalized Wiener process",
      takeaways: [
        "Given x_0 = 50, a = 2.0/year, b = 4.0/year over T = 0.5 years: expected mean is 50 + 2(0.5) = 51.0",
        "Variance is b^2 * T = 16 * 0.5 = 8.0; standard deviation is sqrt(8) = 2.828",
        "95% confidence interval is 51.0 +/- 1.96 * 2.828 = [45.46, 56.54]"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A generalized Wiener process has x_0 = 50, drift rate a = 2.0 per year, and variance rate b^2 = 16.0 per year. What is the 95% confidence interval for x after 6 months (T = 0.5 years)?",
        options: [
          { id: "opt-a", text: "51.00 +/- 1.96 * 4.00 = [43.16, 58.84]", correct: false },
          { id: "opt-b", text: "51.00 +/- 1.96 * 2.83 = [45.46, 56.54]", correct: true },
          { id: "opt-c", text: "52.00 +/- 1.96 * 2.00 = [48.08, 55.92]", correct: false },
          { id: "opt-d", text: "50.00 +/- 1.96 * 8.00 = [34.32, 65.68]", correct: false }
        ],
        explanation: "Expected value is x_0 + a * T = 50 + 2.0 * 0.5 = 51.00. Variance is b^2 * T = 16.0 * 0.5 = 8.00. Standard deviation is sqrt(8.00) = 2.828. The 95% interval is 51.00 +/- 1.96 * 2.828 = [45.46, 56.54]!"
      },
      beats: [
        {
          id: "s09b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b37 }, hi: { display: hiBeats.b37 } },
          onScreenIntent: "Present the numerical problem: x_0=50, a=2.0, b^2=16.0, T=0.5 years",
          sourceFactIds: ["F03"],
          newTerms: ["Numerical scenario"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b38 }, hi: { display: hiBeats.b38 } },
          onScreenIntent: "Calculate the expected mean after 6 months: 50 + 2(0.5) = 51.0",
          sourceFactIds: ["F03"],
          newTerms: ["Calculated mean"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b39 }, hi: { display: hiBeats.b39 } },
          onScreenIntent: "Calculate the variance (8.0) and standard deviation: sqrt(8) = 2.828",
          sourceFactIds: ["F03"],
          newTerms: ["Calculated standard deviation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b40 }, hi: { display: hiBeats.b40 } },
          onScreenIntent: "Apply 1.96 standard normal z-score to construct 95% interval: [45.46, 56.54]",
          sourceFactIds: ["F03"],
          newTerms: ["Calculated confidence interval"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s09b5",
          speaker: "mentor",
          narration: { en: { display: enBeats.b41 }, hi: { display: hiBeats.b41 } },
          onScreenIntent: "Reinforce how Gaussian statistical distributions provide quantitative risk bounds",
          sourceFactIds: ["F03"],
          newTerms: ["Quantitative risk bounds"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        }
      ]
    },
    // Scene 10: Institutional Modeling (b42-b45)
    {
      id: "s10",
      index: 10,
      title: "Institutional Quantitative Modeling: Foundations of Modern Quants",
      purpose: "Examine how quantitative desks calibrate volatility and simulate paths via Monte Carlo",
      takeaways: [
        "Historical volatility is estimated by standard deviation of logarithmic returns normalized by sqrt(tau)",
        "Monte Carlo engines propagate paths using discrete Gaussian increments epsilon * sqrt(dt)",
        "Stochastic processes form the backbone of modern derivatives risk management and algorithmic execution"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "The Production Quantitative Engine Architecture",
        steps: [
          { label: "1. Return Sampling", detail: "Sample daily closing prices S_i and compute periodic log returns u_i = ln(S_i / S_{i-1})" },
          { label: "2. Volatility Annualization", detail: "Compute sample standard deviation s and annualize: sigma = s / sqrt(tau)" },
          { label: "3. Pseudorandom Generation", detail: "Generate uncorrelated standard normal variates epsilon via Mersenne Twister or Sobol sequences" },
          { label: "4. Multi-Path Simulation", detail: "Propagate 100,000 asset paths forward to evaluate non-linear option payoffs and Greeks" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b42 }, hi: { display: hiBeats.b42 } },
          onScreenIntent: "Introduce institutional volatility estimation from empirical historical returns",
          sourceFactIds: ["F08"],
          newTerms: ["Empirical volatility estimation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b2",
          speaker: "mentor",
          narration: { en: { display: enBeats.b43 }, hi: { display: hiBeats.b43 } },
          onScreenIntent: "Formulate annualization factor: divide sample standard deviation by sqrt(tau)",
          sourceFactIds: ["F08"],
          newTerms: ["Annualization factor"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b3",
          speaker: "mentor",
          narration: { en: { display: enBeats.b44 }, hi: { display: hiBeats.b44 } },
          onScreenIntent: "Explain Monte Carlo simulation of millions of Brownian paths on trading desks",
          sourceFactIds: ["F08"],
          newTerms: ["Monte Carlo path simulation"],
          pauseAfterMs: 300,
          transition: false,
          visual: {},
          visualCues: []
        },
        {
          id: "s10b4",
          speaker: "mentor",
          narration: { en: { display: enBeats.b45 }, hi: { display: hiBeats.b45 } },
          onScreenIntent: "Bridge to Part 2: how Ito's Lemma differentiates functions of stochastic processes",
          sourceFactIds: ["F04"],
          newTerms: ["Bridge to Ito Lemma"],
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
      title: "Summary Thread: Four Pillars of Continuous Stochastic Modeling",
      purpose: "Consolidate the 8 foundational laws of Brownian motion and stochastic processes",
      takeaways: [
        "Wiener process dz = epsilon * sqrt(dt) defines continuous randomness with linear variance accumulation",
        "Arithmetic diffusion dx = a dt + b dz fails for equities, motivating Geometric Brownian Motion",
        "Part 2 masters Ito's Lemma: the chain rule of stochastic calculus that derives the Black-Scholes PDE"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Executive Synthesis: The 8 Laws of Stochastic Processes",
        rules: [
          { id: "r1", title: "1. Markov Memorylessness", summary: "Future distributions depend exclusively on current state, ignoring past history." },
          { id: "r2", title: "2. Wiener Increment", summary: "Delta_z = epsilon * sqrt(Delta_t) with epsilon ~ N(0, 1) and independent disjoint steps." },
          { id: "r3", title: "3. Linear Variance Growth", summary: "Variances sum linearly over time: Var(Delta_z) = Delta_t, preserving total variance T." },
          { id: "r4", title: "4. Square-Root Scaling", summary: "Standard deviation accumulates with sqrt(t), making volatility scale as sigma * sqrt(T)." },
          { id: "r5", title: "5. Path Non-Differentiability", summary: "Brownian paths are continuous everywhere but differentiable nowhere: dz/dt diverges." },
          { id: "r6", title: "6. Quadratic Variation", summary: "Microscopic noise satisfies (dz)^2 = dt, retaining second derivatives in calculus." },
          { id: "r7", title: "7. Generalized Wiener Process", summary: "dx = a dt + b dz yields Gaussian finite-time change: (x_T - x_0) ~ N(a*T, b^2*T)." },
          { id: "r8", title: "8. Geometric Requirement", summary: "Stock prices require proportional returns dS = mu*S*dt + sigma*S*dz to prevent negative prices." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "mentor",
          narration: { en: { display: enBeats.b46 }, hi: { display: hiBeats.b46 } },
          onScreenIntent: "Synthesize the core continuous stochastic framework",
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
          onScreenIntent: "Review Rules 1, 2, and 3: Markov property, Wiener axioms, and linear variance growth",
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
          onScreenIntent: "Review Rules 4, 5, and 6: square-root scaling, non-differentiability, and (dz)^2 = dt",
          sourceFactIds: ["F06", "F07"],
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
          onScreenIntent: "Review Rules 7 and 8: generalized drift/diffusion and Geometric Brownian Motion",
          sourceFactIds: ["F03", "F05"],
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
          onScreenIntent: "Conclude Part 1 and bridge to Part 2: Ito's Lemma and the derivation of Black-Scholes",
          sourceFactIds: ["F04"],
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
if (!bookConfig.chapters.some(c => c.id === 'ch14')) {
  bookConfig.chapters.push({
    id: 'ch14',
    number: 14,
    title: 'Wiener Processes & Ito\'s Lemma'
  });
  fs.writeFileSync(bookConfigPath, JSON.stringify(bookConfig, null, 2));
}

const courseMapPath = 'c:/code/openlectern/workspace/books/hull/course_map.json';
const courseMap = JSON.parse(fs.readFileSync(courseMapPath, 'utf8'));
if (!courseMap.chapters.some(c => c.id === 'ch14')) {
  courseMap.chapters.push({
    id: 'ch14',
    number: 14,
    title: 'Wiener Processes & Ito\'s Lemma',
    parts: [
      { id: 'p1', title: 'Part 1: Stochastic Processes & Brownian Motion' },
      { id: 'p2', title: 'Part 2: Ito\'s Lemma & Geometric Brownian Motion' }
    ]
  });
  fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2));
}

console.log('Chapter 14 Part 1 successfully built and registered in course_map!');
