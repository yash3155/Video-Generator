import fs from 'node:fs';
import path from 'node:path';

const targetDir = 'c:/code/openlectern/workspace/books/hull/chapters/ch09/p1';
fs.mkdirSync(targetDir, { recursive: true });

// Read predecessor source texts
const enScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_09/Part_01/script.md', 'utf8');
const hiScriptText = fs.readFileSync('C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_Fundamentals/Updated_Book_Regeneration_Hindi/Chapter_09/Part_01/script_hi.md', 'utf8');

const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
let hiMatches = [...hiScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*Hindi Narration:\*\s*"([^"]+)"/g)];
if (hiMatches.length === 0) {
  hiMatches = [...hiScriptText.matchAll(/\*\*(b\d+):\*\*\s*"([^"]+)"/g)];
}

const enBeats = {};
const hiBeats = {};
enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
hiMatches.forEach(m => hiBeats[m[1]] = m[2].trim());

for (let i = 1; i <= 39; i++) {
  const k = 'b' + String(i).padStart(2, '0');
  if (!enBeats[k] || !hiBeats[k]) {
    throw new Error(`Missing beat ${k} in source scripts! (EN: ${Boolean(enBeats[k])}, HI: ${Boolean(hiBeats[k])})`);
  }
}

// 1. Facts with full numerical grounding from Chapter 9
const sourceFacts = {
  bookId: "hull",
  chapterId: "ch09",
  partId: "p1",
  facts: [
    {
      id: "F01",
      category: "claim",
      statement: "Prior to 2007, LIBOR was standardly used as the risk-free proxy for discounting. Because LIBOR is an unsecured bank borrowing rate carrying default and liquidity risk, the 2007-2008 crisis forced trading desks to adopt OIS discounting.",
      citation: { chapter: "9", section: "9.1", page: "217" }
    },
    {
      id: "F02",
      category: "definition",
      statement: "An Overnight Indexed Swap (OIS) exchanges a fixed interest rate for the geometric average of overnight central bank rates (Fed Funds in the US, SONIA in the UK, ESTR in Europe).",
      citation: { chapter: "9", section: "9.1", page: "218" }
    },
    {
      id: "F03",
      category: "market_rule",
      statement: "The LIBOR-OIS spread serves as a barometer of interbank credit and liquidity risk. In normal tranquil conditions it is 10 to 15 basis points; during the October 2008 Lehman collapse it spiked to 364 basis points.",
      citation: { chapter: "9", section: "9.1", page: "219" }
    },
    {
      id: "F04",
      category: "market_rule",
      statement: "Under standard ISDA Credit Support Annexes (CSAs), derivative cash flows must be discounted at the interest rate paid on posted cash collateral, which is strictly the overnight rate, making OIS discounting mathematically mandatory.",
      citation: { chapter: "9", section: "9.2", page: "221" }
    },
    {
      id: "F05",
      category: "market_rule",
      statement: "The Multi-Curve Framework decouples forward curve projections from discount curves: forward LIBOR/IBOR floating cash flows are projected using tenor-specific forward curves, but all cash flows are discounted back using the single continuous OIS zero curve.",
      citation: { chapter: "9", section: "9.3", page: "223" }
    },
    {
      id: "F06",
      category: "formula",
      statement: "Credit Valuation Adjustment: CVA = (1 - R) sum [ v(t_i) * EPE(t_i) * P(t_{i-1} < tau <= t_i) ], where R is recovery rate, v(t_i) is OIS discount factor, EPE is Expected Positive Exposure, and P is marginal default probability.",
      citation: { chapter: "9", section: "9.4", page: "226" }
    },
    {
      id: "F07",
      category: "formula",
      statement: "Holistic Total Derivative Valuation (XVA): Total Price = RiskFreeValue - CVA + DVA - FVA - MVA - KVA.",
      citation: { chapter: "9", section: "9.5", page: "230" }
    },
    {
      id: "F08",
      category: "regulation",
      statement: "Following the LIBOR manipulation scandal and market illiquidity, global regulators mandated the transition to Nearly Risk-Free Rates (RFRs): SOFR for USD, SONIA for GBP, ESTR for EUR, and TONOR for JPY, utilizing ISDA fallback spreads.",
      citation: { chapter: "9", section: "9.6", page: "234" }
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

// 2. Lesson plan
const lessonPlan = {
  bookId: "hull",
  chapterId: "ch09",
  partId: "p1",
  title: "OIS Discounting, Credit Issues, and Funding Costs",
  subtitle: "The Death of LIBOR, CSA Collateral Discounting, Multi-Curve Pricing & XVA Architecture",
  targetAudience: "Derivative structurers, quantitative analysts, credit risk managers, and Treasury desk heads",
  prerequisites: ["Hull Chapter 4 Interest Rates", "Hull Chapter 7 Swaps", "Counterparty credit risk basics"],
  scenes: [
    { sceneId: "s00", title: "The Risk-Free Revolution: The Death of LIBOR Discounting", beats: ["s00b1", "s00b2", "s00b3"] },
    { sceneId: "s01", title: "The LIBOR-OIS Spread: The Heartbeat of Financial Contagion", beats: ["s01b1", "s01b2", "s01b3"] },
    { sceneId: "s02", title: "Collateralized Pricing Mechanics: Why CSAs Demand OIS Discounting", beats: ["s02b1", "s02b2", "s02b3"] },
    { sceneId: "s03", title: "The Multi-Curve Paradigm: Decoupling Projections from Discounting", beats: ["s03b1", "s03b2", "s03b3"] },
    { sceneId: "s04", title: "Numerical Walkthrough: Pricing an Interest Rate Swap with OIS Discounting", beats: ["s04b1", "s04b2", "s04b3"] },
    { sceneId: "s05", title: "Credit Valuation Adjustment (CVA): Pricing Counterparty Default Risk", beats: ["s05b1", "s05b2", "s05b3"] },
    { sceneId: "s06", title: "Debit Valuation Adjustment (DVA): The Paradox of Own Credit Risk", beats: ["s06b1", "s06b2", "s06b3"] },
    { sceneId: "s07", title: "Funding Valuation Adjustment (FVA): The Cost of Margin Financing", beats: ["s07b1", "s07b2", "s07b3"] },
    { sceneId: "s08", title: "The Holistic XVA Architecture: Total Portfolio Valuation", beats: ["s08b1", "s08b2", "s08b3"] },
    { sceneId: "s09", title: "Active Recall Scenario: Evaluating CVA and Multi-Curve Discounting", beats: ["s09b1", "s09b2", "s09b3"] },
    { sceneId: "s10", title: "The Post-LIBOR Transition: SOFR, SONIA, and Fallback Spreads", beats: ["s10b1", "s10b2", "s10b3"] },
    { sceneId: "s11", title: "Summary Thread: Four Pillars of Modern Derivative Valuation", beats: ["s11b1", "s11b2", "s11b3", "s11b4", "s11b5", "s11b6"] }
  ]
};
fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

// 3. Mathematical blueprint
const mathBlueprint = {
  bookId: "hull",
  chapterId: "ch09",
  partId: "p1",
  formulas: [
    {
      id: "M01",
      name: "Credit Valuation Adjustment (CVA)",
      latex: "\\text{CVA} = (1 - R) \\sum_{i=1}^{N} v(t_i) \\cdot \\text{EPE}(t_i) \\cdot P(t_{i-1} < \\tau \\le t_i)",
      variables: [
        { symbol: "CVA", description: "Credit Valuation Adjustment deducted from derivative value", unit: "currency" },
        { symbol: "R", description: "Expected recovery rate in the event of counterparty default", unit: "percentage" },
        { symbol: "v(t_i)", description: "OIS discount factor to time t_i", unit: "dimensionless" },
        { symbol: "EPE(t_i)", description: "Expected Positive Exposure at time t_i", unit: "currency" },
        { symbol: "P(...)", description: "Marginal probability of counterparty default between t_{i-1} and t_i", unit: "percentage" }
      ]
    },
    {
      id: "M02",
      name: "Total Holistic XVA Valuation",
      latex: "V_{\\text{total}} = V_{\\text{risk-free}} - \\text{CVA} + \\text{DVA} - \\text{FVA} - \\text{MVA} - \\text{KVA}",
      variables: [
        { symbol: "V_total", description: "True comprehensive derivative economic value", unit: "currency" },
        { symbol: "V_risk-free", description: "Clean unadjusted OIS discounted present value", unit: "currency" },
        { symbol: "DVA", description: "Debit Valuation Adjustment (own credit risk gain)", unit: "currency" },
        { symbol: "FVA", description: "Funding Valuation Adjustment for uncollateralized hedges", unit: "currency" }
      ]
    }
  ]
};
fs.writeFileSync(path.join(targetDir, '03_math_blueprint.json'), JSON.stringify(mathBlueprint, null, 2));

// 4. Pedagogical script
const pedagogicalScript = {
  bookId: "hull",
  chapterId: "ch09",
  partId: "p1",
  scenes: lessonPlan.scenes.map(s => ({
    sceneId: s.sceneId,
    title: s.title,
    beats: s.beats.map(b => ({
      beatId: b,
      narrationEn: enBeats[b.replace('s', 'b').replace(/s\d{2}/, '')] || enBeats['b' + b.slice(-2)] || "Narration text",
      narrationHi: hiBeats[b.replace('s', 'b').replace(/s\d{2}/, '')] || hiBeats['b' + b.slice(-2)] || "Narration text"
    }))
  }))
};
fs.writeFileSync(path.join(targetDir, '04_pedagogical_script.json'), JSON.stringify(pedagogicalScript, null, 2));

// 5. Episode Compliant Structure
const episode = {
  schemaVersion: 1,
  bookId: "hull",
  chapterId: "ch09",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Options, Futures, and Other Derivatives",
  chapterLabel: "Chapter 9",
  partLabel: "Part 1",
  title: "OIS Discounting, Credit Issues, and Funding Costs",
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
    // Scene 0: Risk-Free Revolution
    {
      id: "s00",
      index: 0,
      title: "The Risk-Free Revolution: The Death of LIBOR Discounting",
      purpose: "Establish why the 2008 crisis shattered the single-curve LIBOR paradigm and forced OIS adoption",
      takeaways: [
        "Pre-2007 trading desks discounted all cash flows using unsecured LIBOR curves",
        "LIBOR incorporates commercial bank credit and liquidity risk; it is not truly risk-free",
        "Chapter 9 introduces OIS discounting, multi-curve frameworks, CVA, DVA, FVA, and SOFR"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Evolution of the Risk-Free Discounting Benchmark",
        steps: [
          { label: "Pre-2007 Single Curve", detail: "LIBOR treated as risk-free benchmark; all derivatives discounted at LIBOR" },
          { label: "2008 Credit Detonation", detail: "Interbank default risk exploded; LIBOR-OIS spread spiked to 364 bps" },
          { label: "OIS Adoption Mandate", detail: "Overnight index swaps adopted as true collateralized risk-free discount rate" },
          { label: "Modern Multi-Curve Era", detail: "Decoupled projection curves for floating tenors + single continuous OIS discount curve" }
        ]
      },
      beats: [
        {
          id: "s00b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b01'] }, hi: { display: hiBeats['b01'] } },
          visualCues: [{ target: "step_0", anchor: { en: "foundational paradigm shift", hi: "paradigm shift" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b02'] }, hi: { display: hiBeats['b02'] } },
          visualCues: [{ target: "step_1", anchor: { en: "commercial bank default risk", hi: "default risk" } }],
          pauseAfterMs: 400
        },
        {
          id: "s00b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b03'] }, hi: { display: hiBeats['b03'] } },
          visualCues: [{ target: "step_2", anchor: { en: "masterclass on Chapter Nine", hi: "Chapter Nine" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 1: LIBOR-OIS Spread
    {
      id: "s01",
      index: 1,
      title: "The LIBOR-OIS Spread: The Heartbeat of Financial Contagion",
      purpose: "Define Overnight Indexed Swaps and analyze the LIBOR-OIS spread as systemic stress gauge",
      takeaways: [
        "An OIS exchanges fixed rate for geometric average of daily overnight central bank rates",
        "Because principal is never exchanged and overnight loans roll daily, OIS carries negligible credit risk",
        "The LIBOR-OIS spread surged from 10 bps historically to 364 bps in October 2008"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "LIBOR-OIS Spread Dynamics",
        left: {
          title: "Tranquil Regime (Pre-Crisis)",
          items: [
            "LIBOR-OIS spread hovered at 10 to 15 basis points",
            "Banks viewed interbank unsecured credit risk as completely negligible",
            "LIBOR and OIS discount factors produced nearly identical present values",
            "Single-curve pricing errors were minor and unmonitored"
          ]
        },
        right: {
          title: "Lehman Crisis Spike (October 2008)",
          items: [
            "LIBOR-OIS spread exploded to historic peak of 364 basis points",
            "Unsecured 3-month lending froze as banks feared counterparty insolvency",
            "Using LIBOR for discounting caused multi-million dollar derivative mispricings",
            "Forced Wall Street to permanently discard the single-curve framework"
          ]
        }
      },
      beats: [
        {
          id: "s01b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b04'] }, hi: { display: hiBeats['b04'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Overnight Indexed Swap", hi: "Overnight Indexed Swap" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b05'] }, hi: { display: hiBeats['b05'] } },
          visualCues: [{ target: "left_items", anchor: { en: "LIBOR-OIS spread", hi: "LIBOR-OIS spread" } }],
          pauseAfterMs: 400
        },
        {
          id: "s01b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b06'] }, hi: { display: hiBeats['b06'] } },
          visualCues: [{ target: "right_items", anchor: { en: "October 2008", hi: "October 2008" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 2: Collateralized Pricing Mechanics & CSAs
    {
      id: "s02",
      index: 2,
      title: "Collateralized Pricing Mechanics: Why CSAs Demand OIS Discounting",
      purpose: "Prove why ISDA Credit Support Annexes mathematically mandate OIS discounting for collateralized trades",
      takeaways: [
        "Under ISDA CSAs, daily cash variation margin is posted to eliminate counterparty credit risk",
        "The collateral receiver pays the collateral poster interest at the overnight rate (Fed Funds/ESTR)",
        "No-arbitrage replication mandates discounting at the rate paid on posted collateral: OIS"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "CSA Collateral Discounting Proof Architecture",
        steps: [
          { label: "1. Perfect Daily Collateralization", detail: "Parties exchange cash variation margin equal to 100% of mark-to-market daily" },
          { label: "2. Interest on Collateral", detail: "Collateral receiver legally mandated to pay overnight rate to collateral poster" },
          { label: "3. Funding Replication", detail: "Bank financing derivative position borrows cash collateral earning the overnight rate" },
          { label: "4. Mathematical Imperative", detail: "Discount rate equals financing rate of replicating portfolio = OIS Zero Rate" }
        ]
      },
      beats: [
        {
          id: "s02b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b07'] }, hi: { display: hiBeats['b07'] } },
          visualCues: [{ target: "step_0", anchor: { en: "fundamental theoretical proof", hi: "theoretical proof" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b08'] }, hi: { display: hiBeats['b08'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Credit Support Annex", hi: "Credit Support Annex" } }],
          pauseAfterMs: 400
        },
        {
          id: "s02b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b09'] }, hi: { display: hiBeats['b09'] } },
          visualCues: [{ target: "step_3", anchor: { en: "no-arbitrage replication", hi: "no-arbitrage replication" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 3: The Multi-Curve Paradigm
    {
      id: "s03",
      index: 3,
      title: "The Multi-Curve Paradigm: Decoupling Projections from Discounting",
      purpose: "Formulate modern multi-curve architecture: separate forward projection curves vs single OIS discount curve",
      takeaways: [
        "Single-curve pricing assumed forward rates and discount rates came from the same curve",
        "Modern multi-curve framework builds separate projection curves for 1M, 3M, 6M tenors",
        "Every projected cash flow regardless of tenor is discounted back using the continuous OIS curve"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Multi-Curve Architecture Schema",
        steps: [
          { label: "Projection Curves", detail: "Tenor-specific forward curves (1M LIBOR/SOFR, 3M, 6M) used strictly to forecast cash flows" },
          { label: "Floating Cash Flow Generation", detail: "Forward cash flow = Notional * ForwardRate * YearFraction" },
          { label: "Discounting Curve", detail: "Single risk-free OIS continuous zero curve used strictly to discount all future cash flows" },
          { label: "Present Value Valuation", detail: "PV = sum [ Projected Cash Flow(t_i) * OIS_DiscountFactor(t_i) ]" }
        ]
      },
      beats: [
        {
          id: "s03b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b10'] }, hi: { display: hiBeats['b10'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Multi-Curve Framework", hi: "Multi-Curve Framework" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b11'] }, hi: { display: hiBeats['b11'] } },
          visualCues: [{ target: "step_1", anchor: { en: "tenor-specific forward curves", hi: "tenor-specific forward curves" } }],
          pauseAfterMs: 400
        },
        {
          id: "s03b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b12'] }, hi: { display: hiBeats['b12'] } },
          visualCues: [{ target: "step_3", anchor: { en: "two distinct roles", hi: "two distinct roles" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 4: Numerical Walkthrough
    {
      id: "s04",
      index: 4,
      title: "Numerical Walkthrough: Pricing an Interest Rate Swap with OIS Discounting",
      purpose: "Walk through step-by-step valuation of a 3-year plain vanilla swap using dual curves",
      takeaways: [
        "Forward floating cash flows are calculated using 3-month forward LIBOR/SOFR rates",
        "Discount factors are calculated using OIS continuous zero rates: v(t) = exp(-r_OIS * t)",
        "The swap fixed rate S equals the sum of OIS-discounted floating flows divided by OIS annuity"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Dual-Curve Swap Valuation Formula",
        formula: "V_{\\text{swap}} = \\sum_{i=1}^{N} F(t_{i-1}, t_i) \\cdot \\Delta t_i \\cdot v_{\\text{OIS}}(t_i) - S \\sum_{i=1}^{N} \\Delta t_i \\cdot v_{\\text{OIS}}(t_i)",
        steps: [
          { label: "Step 1: Forecast Forward Floating Rates", detail: "Generate forward rate F(t_{i-1}, t_i) from tenor-specific projection curve." },
          { label: "Step 2: Calculate OIS Discount Factors", detail: "Derive discount factor v_OIS(t_i) = exp(-R_OIS(t_i) * t_i) from OIS zero curve." },
          { label: "Step 3: Value Floating & Fixed Legs", detail: "PV(Floating) = sum[ F_i * dt * v_OIS(t_i) ]; PV(Fixed) = S * sum[ dt * v_OIS(t_i) ]." },
          { label: "Step 4: Solve Equilibrium Par Swap Rate", detail: "Par Swap Rate S = PV(Floating) / Annuity_OIS." }
        ]
      },
      beats: [
        {
          id: "s04b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b13'] }, hi: { display: hiBeats['b13'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "step-by-step numerical mechanics", hi: "numerical mechanics" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b14'] }, hi: { display: hiBeats['b14'] } },
          visualCues: [{ target: "step_1", anchor: { en: "forward projection curve", hi: "forward projection curve" } }],
          pauseAfterMs: 400
        },
        {
          id: "s04b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b15'] }, hi: { display: hiBeats['b15'] } },
          visualCues: [{ target: "step_3", anchor: { en: "equilibrium par swap rate", hi: "par swap rate" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 5: Credit Valuation Adjustment (CVA)
    {
      id: "s05",
      index: 5,
      title: "Credit Valuation Adjustment (CVA): Pricing Counterparty Default Risk",
      purpose: "Define CVA, Expected Positive Exposure, and formulate the exact credit discount deduction",
      takeaways: [
        "CVA is the present value of expected future losses due to counterparty default",
        "Loss is incurred only when derivative mark-to-market is positive (Expected Positive Exposure)",
        "CVA equals (1 - R) sum of OIS discount factors times EPE times marginal default probability"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Quantitative CVA Derivation",
        formula: "\\text{CVA} = (1 - R) \\sum_{i=1}^{N} v_{\\text{OIS}}(t_i) \\cdot \\text{EPE}(t_i) \\cdot P(t_{i-1} < \\tau \\le t_i)",
        steps: [
          { label: "Loss Given Default (1 - R)", detail: "Fraction of exposure lost upon default; typically 60% for senior unsecured (R = 40%)." },
          { label: "Expected Positive Exposure EPE(t_i)", detail: "Monte Carlo average of max(V(t_i), 0); only positive MTM represents counterparty credit risk." },
          { label: "Discount Factor v_OIS(t_i)", detail: "OIS discount factor discounting expected credit loss from time t_i back to today." },
          { label: "Marginal Default Probability", detail: "Derived directly from counterparty's Credit Default Swap (CDS) spread term structure." }
        ]
      },
      beats: [
        {
          id: "s05b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b16'] }, hi: { display: hiBeats['b16'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Credit Valuation Adjustment", hi: "Credit Valuation Adjustment" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b17'] }, hi: { display: hiBeats['b17'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Expected Positive Exposure", hi: "Expected Positive Exposure" } }],
          pauseAfterMs: 400
        },
        {
          id: "s05b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b18'] }, hi: { display: hiBeats['b18'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Credit Default Swap", hi: "Credit Default Swap" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 6: Debit Valuation Adjustment (DVA)
    {
      id: "s06",
      index: 6,
      title: "Debit Valuation Adjustment (DVA): The Paradox of Own Credit Risk",
      purpose: "Explain DVA, Expected Negative Exposure, and the controversial accounting paradox",
      takeaways: [
        "DVA represents the benefit to a bank from the possibility of its own default on negative MTM",
        "If a bank's own credit spreads widen (deteriorating credit), DVA rises, generating accounting profit",
        "During crisis quarters, troubled banks reported substantial paper profits due solely to DVA gains"
      ],
      pedagogicalContinuation: false,
      template: "split_comparison",
      data: {
        title: "CVA vs. DVA Bilateral Credit Adjustments",
        left: {
          title: "Credit Valuation Adjustment (CVA)",
          items: [
            "Prices risk of counterparty defaulting on bank",
            "Calculated on Expected Positive Exposure (EPE > 0)",
            "Direct deduction from risk-free derivative asset value",
            "Bank buys CDS on counterparty to dynamically hedge CVA"
          ]
        },
        right: {
          title: "Debit Valuation Adjustment (DVA)",
          items: [
            "Prices benefit of bank defaulting on its own liability",
            "Calculated on Expected Negative Exposure (ENE < 0)",
            "Addition to derivative asset value (reduces net liability)",
            "Creates paradox: bank's deteriorating credit increases accounting profits"
          ]
        }
      },
      beats: [
        {
          id: "s06b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b19'] }, hi: { display: hiBeats['b19'] } },
          visualCues: [{ target: "left_title", anchor: { en: "Debit Valuation Adjustment", hi: "Debit Valuation Adjustment" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b20'] }, hi: { display: hiBeats['b20'] } },
          visualCues: [{ target: "right_title", anchor: { en: "fascinating accounting paradox", hi: "accounting paradox" } }],
          pauseAfterMs: 400
        },
        {
          id: "s06b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b21'] }, hi: { display: hiBeats['b21'] } },
          visualCues: [{ target: "right_items", anchor: { en: "unhedgeable economic distortion", hi: "economic distortion" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 7: Funding Valuation Adjustment (FVA)
    {
      id: "s07",
      index: 7,
      title: "Funding Valuation Adjustment (FVA): The Cost of Margin Financing",
      purpose: "Examine funding costs when hedging uncollateralized client trades with collateralized interbank swaps",
      takeaways: [
        "Banks face funding asymmetries: client trades uncollateralized, interbank hedge collateralized",
        "If bank hedge requires posting variation margin, bank must borrow at unsecured borrowing spread",
        "FVA incorporates Funding Cost Adjustment (FCA) and Funding Benefit Adjustment (FBA)"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Funding Asymmetry & FVA Transmission Mechanism",
        steps: [
          { label: "1. Uncollateralized Client Trade", detail: "Corporate client does not post cash margin under non-CSA trade" },
          { label: "2. Collateralized Interbank Hedge", detail: "Bank executes offsetting hedge with Street dealer, posting daily cash margin" },
          { label: "3. Treasury Funding Spread", detail: "Bank Treasury borrows cash at bank's unsecured spread above OIS to fund margin" },
          { label: "4. FVA Charge", detail: "Net present value of future funding costs charged upfront to client as FVA" }
        ]
      },
      beats: [
        {
          id: "s07b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b22'] }, hi: { display: hiBeats['b22'] } },
          visualCues: [{ target: "step_0", anchor: { en: "Funding Valuation Adjustment", hi: "Funding Valuation Adjustment" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b23'] }, hi: { display: hiBeats['b23'] } },
          visualCues: [{ target: "step_1", anchor: { en: "funding asymmetry", hi: "funding asymmetry" } }],
          pauseAfterMs: 400
        },
        {
          id: "s07b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b24'] }, hi: { display: hiBeats['b24'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Treasury desk", hi: "Treasury desk" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 8: Holistic XVA Architecture
    {
      id: "s08",
      index: 8,
      title: "The Holistic XVA Architecture: Total Portfolio Valuation",
      purpose: "Unify CVA, DVA, FVA, MVA, and KVA into Hull's complete modern derivative valuation formula",
      takeaways: [
        "Holistic derivative price equals Risk-Free PV minus CVA plus DVA minus FVA minus MVA minus KVA",
        "MVA prices the lifetime financing cost of posting Initial Margin under regulatory rules",
        "KVA prices the opportunity cost of regulatory capital allocated under Basel III requirements"
      ],
      pedagogicalContinuation: false,
      template: "formula_breakdown",
      data: {
        title: "Complete Modern Holistic XVA Pricing Framework",
        formula: "V_{\\text{deal}} = V_{\\text{risk-free}} - \\text{CVA} + \\text{DVA} - \\text{FVA} - \\text{MVA} - \\text{KVA}",
        steps: [
          { label: "Risk-Free Base (V_rf)", detail: "Clean unadjusted present value discounted using continuous OIS zero curve." },
          { label: "Counterparty & Own Credit (CVA/DVA)", detail: "Deduct expected counterparty default loss; add expected own default relief." },
          { label: "Funding Cost (FVA)", detail: "Deduct present value of financing uncollateralized variation margin." },
          { label: "Margin & Capital (MVA / KVA)", detail: "MVA: cost of funding initial margin; KVA: cost of holding Basel III regulatory capital." }
        ]
      },
      beats: [
        {
          id: "s08b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b25'] }, hi: { display: hiBeats['b25'] } },
          visualCues: [{ target: "formula_box", anchor: { en: "Holistic XVA Architecture", hi: "XVA Architecture" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b26'] }, hi: { display: hiBeats['b26'] } },
          visualCues: [{ target: "step_2", anchor: { en: "Margin Valuation Adjustment", hi: "Margin Valuation Adjustment" } }],
          pauseAfterMs: 400
        },
        {
          id: "s08b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b27'] }, hi: { display: hiBeats['b27'] } },
          visualCues: [{ target: "step_3", anchor: { en: "Capital Valuation Adjustment", hi: "Capital Valuation Adjustment" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 9: Active Recall Quiz
    {
      id: "s09",
      index: 9,
      title: "Active Recall Scenario: Evaluating CVA and Multi-Curve Discounting",
      purpose: "Test quantitative reasoning on OIS discounting impact and CVA deduction calculation",
      takeaways: [
        "Switching from LIBOR to OIS discounting increases the present value of positive floating cash flows",
        "Given EPE of $10M, 60% LGD, 2% default prob, and 0.98 OIS DF: CVA equals $117,600",
        "Uncollateralized derivatives trade at a discount to collateralized derivatives due to CVA + FVA"
      ],
      pedagogicalContinuation: false,
      template: "interactive_quiz",
      data: {
        question: "A bank holds an uncollateralized swap with 1-year Expected Positive Exposure of $10,000,000. Counterparty default probability is 2.0%, Recovery Rate is 40% (LGD = 60%), and 1-year OIS discount factor is 0.98. What is the CVA deduction?",
        options: [
          { label: "Option A", text: "$58,800" },
          { label: "Option B", text: "$117,600" },
          { label: "Option C", text: "$196,000" },
          { label: "Option D", text: "$240,000" }
        ],
        correctIndex: 1,
        explanation: "CVA = (1 - R) * v_OIS * EPE * P = (1 - 0.40) * 0.98 * $10,000,000 * 0.02 = 0.60 * 0.98 * $200,000 = $117,600."
      },
      beats: [
        {
          id: "s09b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b28'] }, hi: { display: hiBeats['b28'] } },
          visualCues: [{ target: "question_box", anchor: { en: "mastery of modern valuation adjustments", hi: "valuation adjustments" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b29'] }, hi: { display: hiBeats['b29'] } },
          visualCues: [{ target: "options_grid", anchor: { en: "ten million dollars", hi: "ten million dollars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s09b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b30'] }, hi: { display: hiBeats['b30'] } },
          visualCues: [{ target: "explanation_box", anchor: { en: "Option B", hi: "Option B" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 10: Post-LIBOR Transition: SOFR, SONIA, and Fallbacks
    {
      id: "s10",
      index: 10,
      title: "The Post-LIBOR Transition: SOFR, SONIA, and Fallback Spreads",
      purpose: "Examine the permanent cessation of LIBOR and the global shift to backward-looking RFRs",
      takeaways: [
        "LIBOR manipulation and thin trading volume led global regulators to retire LIBOR globally",
        "New risk-free rates (SOFR, SONIA, ESTR) are overnight transaction-backed repo/unsecured benchmarks",
        "Legacy contracts converted using ISDA fallback spreads equal to 5-year historical median LIBOR-RFR spreads"
      ],
      pedagogicalContinuation: false,
      template: "process_flow",
      data: {
        title: "Global Risk-Free Rate (RFR) Infrastructure",
        steps: [
          { label: "USD: SOFR", detail: "Secured Overnight Financing Rate backed by over $1 trillion daily Treasury repo transactions" },
          { label: "GBP: SONIA", detail: "Sterling Overnight Index Average: unsecured overnight deposit transactions" },
          { label: "EUR: ESTR", detail: "Euro Short-Term Rate: ECB administered wholesale euro deposit rate replacing EONIA/Euribor" },
          { label: "ISDA Fallback Spreads", detail: "Fixed 5-year median spread added to compounded RFR (e.g. 26.16 bps for 3M USD LIBOR)" }
        ]
      },
      beats: [
        {
          id: "s10b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b31'] }, hi: { display: hiBeats['b31'] } },
          visualCues: [{ target: "step_0", anchor: { en: "permanent retirement of LIBOR", hi: "retirement of LIBOR" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b32'] }, hi: { display: hiBeats['b32'] } },
          visualCues: [{ target: "step_1", anchor: { en: "Risk-Free Rates", hi: "Risk-Free Rates" } }],
          pauseAfterMs: 400
        },
        {
          id: "s10b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b33'] }, hi: { display: hiBeats['b33'] } },
          visualCues: [{ target: "step_3", anchor: { en: "ISDA Fallback Spread", hi: "ISDA Fallback Spread" } }],
          pauseAfterMs: 600
        }
      ]
    },

    // Scene 11: Summary Thread
    {
      id: "s11",
      index: 11,
      title: "Summary Thread: Four Pillars of Modern Derivative Valuation",
      purpose: "Synthesize the 8 essential structural principles of OIS discounting, multi-curve pricing, and XVAs",
      takeaways: [
        "OIS is the true risk-free discount rate mandated by CSA collateral interest mechanics",
        "Multi-curve frameworks separate tenor forecasting from continuous OIS discounting",
        "Holistic derivative pricing incorporates CVA, DVA, FVA, MVA, and KVA under modern SOFR regimes"
      ],
      pedagogicalContinuation: false,
      template: "summary_thread",
      data: {
        title: "Eight Core Rules of Modern Derivative Valuation",
        rules: [
          { number: 1, title: "Risk-Free Mandate", text: "Discount collateralized derivative cash flows strictly at the overnight OIS rate." },
          { number: 2, title: "LIBOR-OIS Barometer", text: "The LIBOR-OIS spread quantifies interbank credit and liquidity risk across markets." },
          { number: 3, title: "Multi-Curve Separation", text: "Decouple tenor-specific forward rate forecasting from continuous OIS discounting." },
          { number: 4, title: "Credit Adjustment (CVA)", text: "Deduct expected losses from counterparty default based on Expected Positive Exposure." },
          { number: 5, title: "Own Credit Paradox (DVA)", text: "Recognize debit adjustments while hedging against accounting profit distortions." },
          { number: 6, title: "Funding Costs (FVA)", text: "Price the cost of financing collateral on hedges for uncollateralized client trades." },
          { number: 7, title: "Capital & Margin XVAs", text: "Account for Initial Margin (MVA) and regulatory capital requirements (KVA) under Basel III." },
          { number: 8, title: "RFR Era", text: "Operate in transaction-backed SOFR, SONIA, and ESTR frameworks using ISDA fallbacks." }
        ]
      },
      beats: [
        {
          id: "s11b1",
          speaker: "instructor",
          narration: { en: { display: enBeats['b34'] }, hi: { display: hiBeats['b34'] } },
          visualCues: [{ target: "rule_1", anchor: { en: "foundational pillars", hi: "chaar foundational pillars" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b2",
          speaker: "instructor",
          narration: { en: { display: enBeats['b35'] }, hi: { display: hiBeats['b35'] } },
          visualCues: [{ target: "rule_2", anchor: { en: "Pillar One", hi: "Pillar One" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b3",
          speaker: "instructor",
          narration: { en: { display: enBeats['b36'] }, hi: { display: hiBeats['b36'] } },
          visualCues: [{ target: "rule_3", anchor: { en: "Pillar Two", hi: "Pillar Two" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b4",
          speaker: "instructor",
          narration: { en: { display: enBeats['b37'] }, hi: { display: hiBeats['b37'] } },
          visualCues: [{ target: "rule_4", anchor: { en: "Pillar Three", hi: "Pillar Three" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b5",
          speaker: "instructor",
          narration: { en: { display: enBeats['b38'] }, hi: { display: hiBeats['b38'] } },
          visualCues: [{ target: "rule_6", anchor: { en: "Pillar Four", hi: "Pillar Four" } }],
          pauseAfterMs: 400
        },
        {
          id: "s11b6",
          speaker: "instructor",
          narration: { en: { display: enBeats['b39'] }, hi: { display: hiBeats['b39'] } },
          visualCues: [{ target: "rule_8", anchor: { en: "Chapter Ten", hi: "Chapter Ten" } }],
          pauseAfterMs: 600
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(episode, null, 2));
console.log('Chapter 9 Part 1 successfully built!');
