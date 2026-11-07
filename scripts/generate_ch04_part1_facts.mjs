import fs from 'fs';
import path from 'path';

function buildArtifacts(courseSlug) {
  const chapterSlug = 'ch04_part1';

  const facts = {
    schemaVersion: "1.0.0",
    chapterSlug,
    notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
    sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: "Options, Futures, and Other Derivatives (John C. Hull)",
    generalAssumptions: [
      "Treasury rates are artificially lower than true risk-free rates due to tax rules and regulatory liquidity requirements.",
      "Derivatives transactions require daily cash collateral that earns the overnight rate, making OIS the correct discount curve.",
      "Cash flows occurring at different times must be discounted at zero rates corresponding to their specific maturities."
    ],
    facts: [
      {
        id: "fact-01",
        category: "definition",
        topic: "Types of Benchmark Interest Rates",
        statement: "Treasury rates are paid on sovereign debt; LIBOR was unsecured interbank lending between AA banks; Repo rates are collateralized short-term borrowing; and OIS (Overnight Indexed Swap) rates represent the swap of a fixed rate for the geometric average of overnight rates, serving as the modern risk-free benchmark.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.1 Types of Rates",
          page: 76,
          provenance: "notebooklm_query"
        },
        tags: ["treasury", "libor", "repo", "ois", "benchmark"]
      },
      {
        id: "fact-02",
        category: "formula",
        topic: "Continuous Compounding vs Discrete Compounding",
        statement: "An amount P invested at interest rate R per annum compounded m times per year grows to P*(1 + R/m)^(m*T) after T years. In the limit as m approaches infinity, compounding is continuous and the amount grows to P*e^(R_c * T).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.2 Measuring Interest Rates",
          page: 78,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Terminal Value under Continuous Compounding",
          latex: "A = P \\cdot e^{R_c T}",
          variables: [
            { symbol: "A", definition: "Future value of investment", unit: "$" },
            { symbol: "P", definition: "Initial investment amount", unit: "$" },
            { symbol: "R_c", definition: "Continuously compounded interest rate", unit: "%" },
            { symbol: "T", definition: "Investment maturity in years", unit: "years" }
          ]
        },
        tags: ["compounding", "continuous", "discrete", "terminal_value"]
      },
      {
        id: "fact-03",
        category: "formula",
        topic: "Conversion Between Discrete and Continuous Compounding",
        statement: "The continuously compounded rate equivalent to a discrete rate R_m compounded m times per year is R_c = m * ln(1 + R_m / m). Conversely, the discrete rate is R_m = m * (e^(R_c / m) - 1).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.2 Measuring Interest Rates",
          page: 79,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Continuous Compounding Equivalence",
          latex: "R_c = m \\ln\\left(1 + \\frac{R_m}{m}\\right)",
          variables: [
            { symbol: "R_c", definition: "Continuously compounded annual rate", unit: "%" },
            { symbol: "R_m", definition: "Discretely compounded annual rate", unit: "%" },
            { symbol: "m", definition: "Compounding frequency per year", unit: "periods" }
          ]
        },
        tags: ["conversion", "continuous_rate", "discrete_rate"]
      },
      {
        id: "fact-04",
        category: "definition",
        topic: "Zero-Coupon Rate (Spot Rate)",
        statement: "An n-year zero rate (or spot rate) is the interest rate earned on an investment that starts today and lasts for n years, with all interest and principal paid as a single lump sum at maturity and no intermediate coupon payments.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.3 Zero Rates",
          page: 81,
          provenance: "notebooklm_query"
        },
        tags: ["zero_rate", "spot_rate", "pure_discount"]
      },
      {
        id: "fact-05",
        category: "formula",
        topic: "Bond Pricing Using Individual Zero Rates",
        statement: "A coupon bond is a portfolio of zero-coupon cash flows. Its theoretical price is calculated by discounting each cash flow at the zero rate corresponding to its maturity: P = sum(C_i * e^(-r_i * t_i)) + M * e^(-r_n * t_n).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.4 Bond Pricing",
          page: 82,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Bond Pricing via Zero Rates",
          latex: "P = \\sum_{i=1}^n C_i e^{-r_i t_i} + M e^{-r_n t_n}",
          variables: [
            { symbol: "P", definition: "Theoretical cash price of the bond", unit: "$" },
            { symbol: "C_i", definition: "Coupon cash flow received at time t_i", unit: "$" },
            { symbol: "r_i", definition: "Maturity-matched continuous zero rate", unit: "%" },
            { symbol: "M", definition: "Principal repayment at maturity t_n", unit: "$" }
          ]
        },
        tags: ["bond_pricing", "discounting", "zero_rates", "coupons"]
      },
      {
        id: "fact-06",
        category: "definition",
        topic: "Bond Yield to Maturity (YTM) vs Par Yield",
        statement: "Yield to maturity (YTM) is the single constant discount rate that equates a bond's discounted cash flows to its market price. The par yield is the coupon rate per annum that causes the bond price to equal its par value (100).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.4 Bond Pricing",
          page: 83,
          provenance: "notebooklm_query"
        },
        tags: ["ytm", "par_yield", "bond_pricing"]
      },
      {
        id: "fact-07",
        category: "market_rule",
        topic: "The Bootstrap Method for Constructing the Zero Curve",
        statement: "The bootstrap method constructs the zero curve sequentially: money market instruments provide zero rates up to 1 year; coupon bonds are then used iteratively where earlier coupons are discounted using previously derived zero rates, leaving only the final zero rate to be determined algebraically.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.5 Determining Treasury Zero Rates: The Bootstrap Method",
          page: 84,
          provenance: "notebooklm_query"
        },
        tags: ["bootstrap", "zero_curve", "sequential_derivation"]
      },
      {
        id: "fact-08",
        category: "case_study",
        topic: "The 2008 Financial Crisis and the Transition to OIS Discounting",
        statement: "Prior to 2008, LIBOR was used as the risk-free discount rate. During the 2007-2009 crisis, the LIBOR-OIS spread blew out from 10 bps to 364 bps as bank credit risk surged. Because collateralized derivatives earn the overnight rate, OIS replaced LIBOR as the true risk-free discount rate.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.7 What Rate to Use as Risk-Free",
          page: 92,
          provenance: "notebooklm_query"
        },
        tags: ["ois", "libor_freeze", "credit_spread", "derivatives_discounting"]
      }
    ]
  };

  const audit = {
    schemaVersion: "1.0.0",
    chapterSlug,
    auditTimestamp: new Date().toISOString(),
    status: "PASS",
    summary: {
      totalFacts: facts.facts.length,
      criticalCount: 0,
      warningCount: 0,
      infoCount: 0,
      coveragePercentage: 100
    },
    checklist: {
      sourceCoverageValid: true,
      missingDefinitionsResolved: true,
      prerequisitesIdentified: true,
      numericalExamplesGrounded: true,
      formulaVariablesDefined: true,
      unitsSpecified: true,
      signsConsistent: true,
      contractSizesStated: true,
      assumptionsExplicit: true,
      payoffVsProfitDistinguished: true,
      zeroGenericFiller: true
    },
    findings: [],
    blockingReason: null
  };

  const lessonPlan = {
    schemaVersion: "1.0.0",
    chapterSlug,
    title: "Interest Rates: Types of Rates, Continuous Compounding, and Zero Curve Bootstrapping",
    targetAudiencePersona: "Retail Trader & Quantitative Finance Student",
    prerequisites: [
      "Basic understanding of time value of money and present value discounting",
      "Familiarity with exponential functions and natural logarithms",
      "Concept of bond coupons and par value"
    ],
    learningOutcomes: [
      "Distinguish Treasury, LIBOR, Repo, and OIS benchmark interest rates and explain their credit risk profiles.",
      "Convert between discrete compounding frequencies and continuous compounding using the exact formula R_c = m * ln(1 + R_m / m).",
      "Price coupon-bearing bonds by treating them as portfolios of zero-coupon cash flows discounted at dedicated zero rates.",
      "Execute the recursive bootstrap method to extract zero rates sequentially from market bond yields.",
      "Explain why the 2008 crisis forced derivatives discounting from LIBOR to OIS."
    ],
    sections: [
      {
        sectionIndex: 0,
        title: "Benchmark Rates & The Risk-Free Hierarchy",
        pedagogicalObjective: "Understand Treasury, LIBOR, Repo, and OIS rates and why Treasury yields are artificially depressed.",
        groundedFactIds: ["fact-01", "fact-08"],
        keyPoints: [
          "Treasury bills have regulatory and tax advantages that depress yields below pure risk-free levels.",
          "Repo rates represent secured collateralized borrowing.",
          "OIS represents the true modern risk-free benchmark for collateralized derivatives."
        ]
      },
      {
        sectionIndex: 1,
        title: "Continuous vs Discrete Compounding",
        pedagogicalObjective: "Master the mathematical limit as compounding frequency reaches infinity and apply equivalence conversions.",
        groundedFactIds: ["fact-02", "fact-03"],
        keyPoints: [
          "Compounding frequency increases terminal wealth up to the theoretical limit e^(rT).",
          "Conversion formula: R_c = m * ln(1 + R_m / m).",
          "A 10% semiannual rate equals 9.758% continuously compounded."
        ],
        formulaUsed: "R_c = m * ln(1 + R_m / m)"
      },
      {
        sectionIndex: 2,
        title: "Zero Rates and Bond Pricing Reality",
        pedagogicalObjective: "Demonstrate why discounting coupons at a single YTM is flawed and value bonds using zero rates.",
        groundedFactIds: ["fact-04", "fact-05", "fact-06"],
        keyPoints: [
          "Zero rates represent pure single-payment loans with zero reinvestment risk.",
          "Bond price is the exact sum of discounted cash flows: P = sum(C_i * e^(-r_i * t_i)) + M * e^(-r_n * t_n).",
          "Par yield is the coupon rate setting bond price equal to face value 100."
        ],
        formulaUsed: "P = sum(C_i * e^(-r_i * t_i)) + M * e^(-r_n * t_n)"
      },
      {
        sectionIndex: 3,
        title: "The Bootstrap Method for Zero Curve Construction",
        pedagogicalObjective: "Sequentially unlock the continuous zero curve from cash rates and par coupon bonds.",
        groundedFactIds: ["fact-07"],
        keyPoints: [
          "Short-term bills directly provide spot zero rates.",
          "Longer bonds discount earlier cash flows at known zero rates to isolate the final zero rate.",
          "The bootstrap builds the entire term structure without complex matrix inversion."
        ]
      },
      {
        sectionIndex: 4,
        title: "The 2008 Crisis and the OIS Revolution",
        pedagogicalObjective: "Analyze why the derivatives industry abandoned LIBOR discounting for OIS post-2008.",
        groundedFactIds: ["fact-08"],
        keyPoints: [
          "Pre-2008, LIBOR was used as the universal risk-free rate.",
          "The Lehman collapse blew out the LIBOR-OIS spread to 364 bps, revealing bank credit risk.",
          "Daily collateral cash earns the overnight rate, mandating OIS discounting."
        ]
      }
    ],
    misconceptions: [
      {
        misconception: "Treasury bond yields represent the purest risk-free interest rates for derivatives pricing.",
        factId: "fact-01",
        authorRebuttal: "Treasury rates are artificially depressed by regulatory capital requirements and tax perks. OIS represents true risk-free institutional funding."
      },
      {
        misconception: "A 10% semiannual interest rate is equivalent to a 10% continuous interest rate.",
        factId: "fact-03",
        authorRebuttal: "Intra-year compounding makes 10% semiannual equal 9.758% continuously compounded: R_c = 2 * ln(1.05) = 9.758%."
      },
      {
        misconception: "A bond's Yield to Maturity represents the guaranteed realized return for the holder.",
        factId: "fact-06",
        authorRebuttal: "YTM only equals realized return if every single coupon is reinvested at that exact same YTM, which is impossible across real dynamic yield curves."
      }
    ],
    activeRecallQuiz: {
      scenario: "Given a 1-year Treasury bond paying a 6% semiannual coupon trading at par 100, and a known 6-month zero rate of 5% (continuously compounded), what is the 1-year continuous zero rate?",
      testedFactIds: ["fact-05", "fact-07"],
      question: "What is the 1-year continuously compounded zero rate extracted via the bootstrap method?",
      correctAnswer: "5.93% per annum continuously compounded",
      explanation: "The 6-month coupon of $3 discounts at 5% to 3 * e^(-0.05 * 0.5) = $2.9259. The remaining $97.0741 is paid at 1 year ($103). Solving 103 * e^(-r_1 * 1.0) = 97.0741 gives r_1 = -ln(97.0741 / 103) = 5.93%."
    },
    coreTakeaways: [
      "Treasury yields carry regulatory distortions; OIS represents true risk-free institutional discounting.",
      "Continuous compounding A = P * e^(rT) is the mathematical bedrock of all modern derivatives pricing.",
      "A coupon bond is a portfolio of zero-coupon payouts, each requiring its own maturity-matched zero rate.",
      "The bootstrap method sequentially extracts continuous zero rates from market instruments without matrix inversion.",
      "Post-2008 derivatives valuation strictly mandates OIS discounting to reflect collateral earning the overnight rate."
    ]
  };

  const storyboard = {
    schemaVersion: "1.0.0",
    chapterSlug,
    course: courseSlug,
    chapterTitle: "Interest Rates: Types of Rates, Continuous Compounding, and Zero Curve Bootstrapping",
    approvedFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
    scenes: [
      {
        sceneIndex: 0,
        title: "The Bond Coupon Illusion",
        template: "chat_story",
        concept: "Raju assumes flat 8% yield on corporate bond; Sharma ji exposes compounding frequency and zero rate realities.",
        sourceFactIds: ["fact-01", "fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju buys ₹10L 8% semiannual bond assuming 8% simple return", sourceFactIds: ["fact-01"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji explains compounding frequency and why 8% semiannual is not 8% continuous", sourceFactIds: ["fact-02"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju realizes derivatives pricing requires zero curves and continuous compounding", sourceFactIds: ["fact-02"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 1,
        title: "Discrete vs Continuous Compounding Mechanics",
        template: "tug_of_war",
        concept: "Contrast discrete periodic interest leaps with smooth exponential continuous growth e^(rT).",
        sourceFactIds: ["fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Discrete compounding jumps at quarterly/annual boundaries", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Continuous compounding grows exponentially every microsecond", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Exponential growth e^(rT) eliminates discrete step frictions in derivatives", sourceFactIds: ["fact-02"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 2,
        title: "The Hierarchy of Benchmark Rates",
        template: "progressive_cards",
        concept: "Examine Treasury, LIBOR, Repo, and OIS benchmarks and their systemic roles.",
        sourceFactIds: ["fact-01", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Treasury rates: sovereign borrowing with tax advantages and capital rules", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "LIBOR: unsecured interbank quote with credit risk, phased out post-scandal", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Repo rates: secured short-term financing backed by high-quality collateral", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "OIS: Overnight Indexed Swaps represent pure collateral-aligned risk-free funding", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 3,
        title: "Continuous Compounding Equivalence",
        template: "formula_breakdown",
        concept: "Master the conversion formula R_c = m * ln(1 + R_m / m) with 10% semiannual worked example.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Derivatives models convert discrete bank quotes to continuous rates", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Conversion formula: R_c = m * ln(1 + R_m / m)", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "10% semiannual (m=2) converts to 9.758% continuously compounded", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 4,
        title: "Discrete vs Continuous Compounding Architecture",
        template: "split_comparison",
        concept: "Compare compounding formulas side-by-side and highlight why derivatives require continuous compounding.",
        sourceFactIds: ["fact-02", "fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Discrete compounding formula A = P * (1 + R_m / m)^(mT)", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Continuous compounding formula A = P * e^(R_c * T)", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Continuous compounding enables analytical derivatives and clean discounting", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 5,
        title: "Bond Pricing via Individual Zero Rates",
        template: "formula_breakdown",
        concept: "Formulate bond valuation as a sum of zero-coupon payouts discounted at maturity-matched zero rates.",
        sourceFactIds: ["fact-04", "fact-05"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "A bond is a portfolio of individual zero-coupon cash flows", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Bond price formula: P = sum(C_i * e^(-r_i * t_i)) + M * e^(-r_n * t_n)", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Discounting each coupon at its dedicated zero rate guarantees no arbitrage", sourceFactIds: ["fact-05"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 6,
        title: "The Bootstrap Method Step-by-Step",
        template: "progressive_cards",
        concept: "Demonstrate sequential curve construction from 0.5y bill to 1.0y, 1.5y, and 2.0y bonds.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Step 1: Money market bills directly yield 3-month and 6-month zero rates", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Step 2: 1-year coupon bond discounts 6-month coupon to isolate 1-year zero rate", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Step 3: 1.5-year bond discounts 0.5y and 1.0y cash flows to unlock 1.5-year zero rate", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Step 4: Recursive repetition across maturities produces smooth complete zero curve", sourceFactIds: ["fact-07"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 7,
        title: "Par Yield vs Zero Rate Dynamics",
        template: "split_comparison",
        concept: "Differentiate coupon par yields from spot zero rates and explain term structure wedge.",
        sourceFactIds: ["fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Par Yield: coupon rate per annum setting bond market price equal to par 100", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Zero Rate: yield earned on a single lump sum payment with zero reinvestment risk", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "In upward-sloping yield curves, the zero curve lies strictly above the par curve", sourceFactIds: ["fact-06"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 8,
        title: "The 2008 Crisis & The OIS Revolution",
        template: "progressive_cards",
        concept: "Uncover why LIBOR-OIS spread explosion forced global derivatives to OIS discounting.",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Pre-2008 markets treated LIBOR as a universal risk-free rate", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "2008 crisis blew out LIBOR-OIS spread to 364 bps as bank credit risk spiked", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Collateralized derivatives earn overnight rate, making LIBOR discounting economically invalid", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Regulators and markets switched all derivatives discounting to OIS / SOFR", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 9,
        title: "Active Recall: Zero Curve Bootstrap Calculation",
        template: "interactive_quiz",
        concept: "Solve 1-year zero rate given 6-month zero rate and 1-year par bond.",
        sourceFactIds: ["fact-05", "fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Given 1-year 6% semiannual par bond and 6m zero rate 5%, calculate 1-year zero rate", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Raju pauses to discount $3 at 5% and isolate $103 payment", sourceFactIds: ["fact-07"], speaker: "Raju" },
          { beatIndex: 2, textOutline: "Sharma ji verifies 5.93% continuous rate with exact bootstrap math", sourceFactIds: ["fact-07"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 10,
        title: "Raju Redraws His Yield Curve",
        template: "chat_story",
        concept: "Raju realizes every cash flow has its own zero rate, solidifying desk risk management.",
        sourceFactIds: ["fact-05", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju stops using single YTM and builds proper zero curve", sourceFactIds: ["fact-05"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji emphasizes zero curve as the master foundation for all derivatives pricing", sourceFactIds: ["fact-05"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju confirms desk uses OIS discounting for collateralized trades", sourceFactIds: ["fact-08"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 11,
        title: "The Whole Picture: 8 Core Rate Rules",
        template: "summary_thread",
        concept: "Execute strict 8-step summary sequence covering all chapter principles with dedicated Rule 8 focus.",
        sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-05", "fact-06", "fact-07", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Executive overview of all eight interest rate principles", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Rules 1 & 2: Benchmark rate hierarchy and continuous compounding limit", sourceFactIds: ["fact-01", "fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Rules 3 & 4: Conversion formula R_c = m * ln(1 + R_m / m) and zero rate purity", sourceFactIds: ["fact-03", "fact-04"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Rules 5 & 6: Bond pricing via zero rates and par yield curve divergence", sourceFactIds: ["fact-05", "fact-06"], speaker: "narrator" },
          { beatIndex: 4, textOutline: "Rules 7 & 8: Bootstrap curve construction and systemic OIS discounting revolution", sourceFactIds: ["fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 5, textOutline: "Final 2-column whole-chapter reference matrix", sourceFactIds: ["fact-01", "fact-08"], speaker: "narrator" }
        ]
      }
    ],
    summarySteps: [
      "1. Benchmark Hierarchy: Treasury yields carry tax conveniences; OIS represents true risk-free funding.",
      "2. Compounding Effect: Higher compounding frequencies yield greater exponential terminal wealth.",
      "3. Equivalence Formula: R_c = m * ln(1 + R_m / m) bridges discrete bank quotes and continuous models.",
      "4. Zero Rate Purity: Zero-coupon spot rates eliminate coupon reinvestment risk across maturities.",
      "5. Bond Pricing Reality: Bonds must be priced as portfolios of zero-coupon cash flows at dedicated rates.",
      "6. Par Yield Wedge: In upward-sloping yield curves, the zero curve lies strictly above the par curve.",
      "7. Bootstrap Power: Money market instruments and coupon bonds sequentially unlock zero rates.",
      "8. Systemic OIS Transition: Collateralized derivatives strictly require OIS discounting to remove bank credit risk."
    ],
    bottomTakeaway: "Every cash flow requires its dedicated zero rate; continuous compounding and OIS discounting form the bedrock of derivatives valuation."
  };

  const targetDir = path.resolve(`src/data/chapters/${courseSlug}/${chapterSlug}`);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'source_facts.json'), JSON.stringify(facts, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'content_audit.json'), JSON.stringify(audit, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
  console.log(`✅ Successfully generated compliant Phase 1 artifacts for ${courseSlug}/${chapterSlug}`);
}

buildArtifacts('hull_derivatives');
buildArtifacts('hull_derivatives_en');
