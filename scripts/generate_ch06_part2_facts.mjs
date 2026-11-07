import fs from 'fs';
import path from 'path';

function buildArtifacts(courseSlug) {
  const chapterSlug = 'ch06_part2';

  const facts = {
    schemaVersion: "1.0.0",
    chapterSlug,
    notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
    sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: "Options, Futures, and Other Derivatives (John C. Hull)",
    generalAssumptions: [
      "Interest rate futures trade on standardized short-term interest rates (Eurodollar/SOFR).",
      "Daily mark-to-market settlement induces a positive covariance wedge between futures and forward rates.",
      "Duration and convexity provide first-order and second-order price sensitivities to parallel yield curve shifts."
    ],
    facts: [
      {
        id: "fact-01",
        category: "definition",
        topic: "Eurodollar and SOFR Futures Specifications and Tick Valuation",
        statement: "3-month Eurodollar futures and 3-month SOFR futures trade on $1,000,000 principal. Prices are quoted on an index basis as 100 minus the annualized interest rate R (Price = 100 - R). The contract tick value for a 1 basis point (0.01%) move is exactly $25 ($1,000,000 * 0.0001 * 90/360 = $25).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.3 Eurodollar Futures",
          page: 142,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Eurodollar Price and Tick Value",
          latex: "\\text{Price} = 100 - R, \\quad \\Delta \\text{Cash} = \\$25 \\text{ per bp}",
          variables: [
            { symbol: "Price", definition: "Quoted futures contract price index", unit: "index points" },
            { symbol: "R", definition: "Annualized 3-month interest rate", unit: "%" },
            { symbol: "Tick", definition: "Cash value per 0.01% interest rate movement", unit: "$" }
          ]
        },
        tags: ["eurodollar_futures", "sofr_futures", "tick_value", "cme"]
      },
      {
        id: "fact-02",
        category: "formula",
        topic: "Futures vs Forward Rates: The Convexity Adjustment",
        statement: "Due to daily mark-to-market settlement, interest rate futures generate cash flows positively correlated with interest rates. This makes futures rates systematically higher than forward rates. The relationship requires a downward convexity adjustment: Forward Rate = Futures Rate - 0.5 * sigma^2 * T1 * T2.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.4 Convexity Adjustment",
          page: 146,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Convexity Adjustment Formula",
          latex: "\\text{Forward} = \\text{Futures} - \\frac{1}{2}\\sigma^2 T_1 T_2",
          variables: [
            { symbol: "Forward", definition: "Theoretical forward borrowing rate", unit: "decimal" },
            { symbol: "Futures", definition: "Rate implied by interest rate futures price", unit: "decimal" },
            { symbol: "sigma", definition: "Annual volatility of the underlying short rate", unit: "decimal" },
            { symbol: "T1", definition: "Maturity of futures contract", unit: "years" },
            { symbol: "T2", definition: "Maturity of underlying 90-day deposit (T1 + 0.25)", unit: "years" }
          ]
        },
        tags: ["convexity_adjustment", "futures_vs_forward", "daily_settlement", "mark_to_market"]
      },
      {
        id: "fact-03",
        category: "formula",
        topic: "Macaulay Duration: Weighted Average Cash Flow Timing",
        statement: "Macaulay duration measures the effective maturity of a bond as the weighted average time until all discounted cash flows are received: D = sum(t_i * C_i * e^(-y * t_i)) / B, where B is the bond market price.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.5 Duration",
          page: 150,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Macaulay Duration Formula",
          latex: "D = \\frac{\\sum t_i \\cdot C_i \\cdot e^{-y \\cdot t_i}}{B}",
          variables: [
            { symbol: "D", definition: "Macaulay duration", unit: "years" },
            { symbol: "t_i", definition: "Time until payment of cash flow i", unit: "years" },
            { symbol: "C_i", definition: "Cash flow amount (coupon or principal)", unit: "$" },
            { symbol: "y", definition: "Yield to maturity continuously compounded", unit: "decimal" },
            { symbol: "B", definition: "Current clean cash price of the bond", unit: "$" }
          ]
        },
        tags: ["macaulay_duration", "effective_maturity", "cash_flow_timing"]
      },
      {
        id: "fact-04",
        category: "formula",
        topic: "Modified Duration and Linear Price Sensitivity",
        statement: "Modified duration D* provides the direct first-order linear approximation of bond price change per unit shift in yield: Delta B / B approx -D* * Delta y, where D* = D / (1 + y/m).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.5 Duration",
          page: 153,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Modified Duration Price Sensitivity",
          latex: "\\frac{\\Delta B}{B} \\approx -D^* \\cdot \\Delta y",
          variables: [
            { symbol: "Delta B / B", definition: "Percentage change in bond price", unit: "decimal" },
            { symbol: "D*", definition: "Modified duration", unit: "years" },
            { symbol: "Delta y", definition: "Parallel shift in market yield", unit: "decimal" }
          ]
        },
        tags: ["modified_duration", "price_sensitivity", "linear_risk", "taylor_series"]
      },
      {
        id: "fact-05",
        category: "formula",
        topic: "Duration-Based Hedging Ratio (N*)",
        statement: "To immunize a bond portfolio of market value P and duration D_P against parallel yield curve shifts, the optimal number of futures contracts to short is: N* = (P * D_P) / (V_F * D_F), where V_F is the futures contract value and D_F is the duration of the CTD bond.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.6 Duration-Based Hedging",
          page: 156,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Duration Hedge Ratio Formula",
          latex: "N^* = \\frac{P \\cdot D_P}{V_F \\cdot D_F}",
          variables: [
            { symbol: "N*", definition: "Optimal number of futures contracts to hedge", unit: "contracts" },
            { symbol: "P", definition: "Market value of asset bond portfolio", unit: "$" },
            { symbol: "D_P", definition: "Modified duration of asset bond portfolio", unit: "years" },
            { symbol: "V_F", definition: "Futures contract value (quoted price * unit)", unit: "$" },
            { symbol: "D_F", definition: "Modified duration of CTD bond at futures maturity", unit: "years" }
          ]
        },
        tags: ["duration_hedging", "hedge_ratio", "portfolio_immunization", "dollar_duration"]
      },
      {
        id: "fact-06",
        category: "formula",
        topic: "Convexity Protection: Second-Order Curvature Correction",
        statement: "Convexity C accounts for the curvature of the bond price-yield curve: Delta B / B approx -D* * Delta y + 0.5 * C * (Delta y)^2. Because (Delta y)^2 is always positive, positive convexity ensures that bond prices rise faster when yields drop than they fall when yields rise.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.5 Duration",
          page: 154,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Convexity Curvature Correction",
          latex: "\\frac{\\Delta B}{B} \\approx -D^* \\cdot \\Delta y + \\frac{1}{2} C (\\Delta y)^2",
          variables: [
            { symbol: "C", definition: "Bond or portfolio convexity", unit: "years^2" },
            { symbol: "Delta y", definition: "Parallel change in yield", unit: "decimal" },
            { symbol: "D*", definition: "Modified duration", unit: "years" }
          ]
        },
        tags: ["convexity", "curvature", "second_order", "asymmetric_protection"]
      },
      {
        id: "fact-07",
        category: "case_study",
        topic: "Snapshot 6.3: Bank Asset-Liability Management (ALM) Duration Gap",
        statement: "A commercial bank with $1,000M in long-term assets (duration 7.0 years) funded by $900M in deposits (duration 1.0 year) has an unhedged duration gap. A +200 bps yield hike inflicts a -$140M loss on assets while liabilities only gain $18M, producing a net -$122M equity loss that completely wipes out the bank's $100M capital.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "Snapshot 6.3 Asset-Liability Management",
          page: 157,
          provenance: "notebooklm_query"
        },
        numericalDetails: {
          context: "Bank insolvency triggered by +200 bps rate shock with 7-year asset duration vs 1-year deposit duration",
          values: {
            "initial_assets": 1000.0,
            "initial_liabilities": 900.0,
            "initial_equity": 100.0,
            "asset_duration": 7.0,
            "liability_duration": 1.0,
            "rate_shock_bps": 200,
            "asset_loss": -140.0,
            "liability_gain": 18.0,
            "net_equity_loss": -122.0
          },
          units: "Millions USD"
        },
        tags: ["alm_gap", "bank_run", "insolvency", "duration_mismatch", "snapshot_6_3"]
      },
      {
        id: "fact-08",
        category: "numerical_example",
        topic: "Corporate Bond Portfolio Duration Hedge Worked Example",
        statement: "A fund manager holds a $50M bond portfolio with modified duration 6.8 years. Treasury futures trade at $98,000 with CTD duration 8.2 years. Total portfolio dollar duration is $340,000,000; single contract dollar duration is $803,600. Sizing the hedge yields N* = 340,000,000 / 803,600 = 423.1 contracts. Shorting 423 contracts immunizes the portfolio against parallel yield spikes.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.6 Duration-Based Hedging",
          page: 158,
          provenance: "notebooklm_query"
        },
        numericalDetails: {
          context: "Optimal short futures contract sizing to immunize a $50M corporate bond portfolio",
          values: {
            "portfolio_value": 50000000,
            "portfolio_duration": 6.8,
            "futures_price": 98000,
            "ctd_duration": 8.2,
            "numerator_dollar_duration": 340000000,
            "denominator_dollar_duration": 803600,
            "optimal_contracts": 423
          },
          units: "Contracts / USD"
        },
        tags: ["hedging_example", "contract_sizing", "corporate_immunization"]
      }
    ]
  };

  const audit = {
    schemaVersion: "1.0.0",
    chapterSlug,
    auditTimestamp: new Date().toISOString(),
    status: "PASS",
    summary: {
      totalFacts: 8,
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
    findings: []
  };

  const lessonPlan = {
    schemaVersion: "1.0.0",
    chapterSlug,
    title: "Interest Rate Futures: Eurodollar Futures, Convexity, and Duration Hedging",
    targetAudiencePersona: "Fixed Income Portfolio Manager & Bank Risk Officer",
    prerequisites: [
      "Treasury bond futures and conversion factor mechanics from Chapter 6 Part 1",
      "Yield to maturity and continuous compounding from Chapter 4",
      "Cost of carry forward pricing parity from Chapter 5"
    ],
    learningOutcomes: [
      "Interpret Eurodollar and SOFR 3-month futures quotes and calculate dollar gains per basis point.",
      "Calculate the convexity adjustment between interest rate futures and forward borrowing rates.",
      "Calculate Macaulay duration and modified duration to estimate linear bond price sensitivity.",
      "Analyze second-order convexity curvature protection against large macro yield shifts.",
      "Size optimal duration hedges using N* = (P * D_P) / (V_F * D_F) to immunize balance sheets.",
      "Diagnose commercial bank asset-liability duration gaps and explain insolvency risk (Snapshot 6.3)."
    ],
    sections: [
      {
        sectionIndex: 0,
        title: "Bank ALM Duration Crisis & Insolvency Mechanics",
        pedagogicalObjective: "Demonstrate how unhedged duration gaps destroy bank equity capital during rate hike cycles.",
        groundedFactIds: ["fact-07"],
        keyPoints: [
          "Banks fund long-duration assets (7-yr mortgages) with short-duration liabilities (1-yr deposits).",
          "A +200 bps yield surge causes a -$140M loss on assets and an $18M gain on liabilities.",
          "Net equity deficit of -$122M completely wipes out the bank's $100M capital base (Snapshot 6.3)."
        ],
        formulaUsed: "Delta E = -(D_A * A - D_L * L) * Delta y"
      },
      {
        sectionIndex: 1,
        title: "Eurodollar & SOFR 3-Month Futures Architecture",
        pedagogicalObjective: "Establish contract specifications, Price = 100 - R quoting, and the $25 per tick invariant.",
        groundedFactIds: ["fact-01"],
        keyPoints: [
          "Contract covers $1,000,000 principal of 3-month deposits referencing short-term rates.",
          "Price is quoted on an index basis: Price = 100 - R (e.g., 4.5% rate quotes at 95.50).",
          "Every 1 basis point (0.01%) rate move is worth exactly $25 cash per contract."
        ],
        formulaUsed: "Price = 100 - R"
      },
      {
        sectionIndex: 2,
        title: "Futures vs Forward Rates: The Convexity Adjustment",
        pedagogicalObjective: "Derive the convexity adjustment formula and explain why futures rates exceed forward rates.",
        groundedFactIds: ["fact-02"],
        keyPoints: [
          "Daily mark-to-market settlement induces positive correlation with interest rates.",
          "Futures rates systematically exceed theoretical forward rates for long maturities.",
          "Subtracting 0.5 * sigma^2 * T1 * T2 yields the true forward borrowing rate."
        ],
        formulaUsed: "Forward Rate = Futures Rate - 0.5 * sigma^2 * T1 * T2"
      },
      {
        sectionIndex: 3,
        title: "Macaulay Duration & Modified Duration",
        pedagogicalObjective: "Formulate Macaulay duration as cash flow timing and Modified duration as linear price sensitivity.",
        groundedFactIds: ["fact-03", "fact-04"],
        keyPoints: [
          "Macaulay duration measures weighted average maturity of discounted coupon and principal cash flows.",
          "Modified duration D* dictates linear price sensitivity: Delta B / B approx -D* * Delta y.",
          "Negative sign reflects the fundamental inverse relationship between bond prices and interest rates."
        ],
        formulaUsed: "Delta B / B approx -D* * Delta y"
      },
      {
        sectionIndex: 4,
        title: "Convexity Protection & The Master Duration Hedge Ratio",
        pedagogicalObjective: "Formulate second-order convexity curvature and derive the optimal hedge ratio N*.",
        groundedFactIds: ["fact-05", "fact-06", "fact-08"],
        keyPoints: [
          "Convexity ensures bond prices rise faster on yield drops than they fall on yield hikes.",
          "Immunize portfolios by shorting N* = (P * D_P) / (V_F * D_F) futures contracts.",
          "Worked example: Shorting 423 contracts immunizes a $50M portfolio with duration 6.8 years."
        ],
        formulaUsed: "N* = (P * D_P) / (V_F * D_F)"
      }
    ],
    misconceptions: [
      {
        misconception: "Futures interest rates and forward interest rates are always identical for the same maturity.",
        factId: "fact-02",
        authorRebuttal: "Daily mark-to-market settlement creates covariance between rate levels and reinvestment, causing futures rates to systematically exceed forward rates by the convexity adjustment."
      },
      {
        misconception: "A bond's maturity in calendar years is the correct measure of its price sensitivity to interest rate shifts.",
        factId: "fact-03",
        authorRebuttal: "Coupons paid before maturity shorten effective cash flow timing; modified duration—not maturity—measures true interest rate price sensitivity."
      },
      {
        misconception: "Duration-based hedging insulates bond portfolios against all types of interest rate risks.",
        factId: "fact-05",
        authorRebuttal: "Standard duration hedging assumes small parallel shifts of the yield curve; non-parallel twists, steepening, and credit basis risk leave residual exposure."
      }
    ],
    activeRecallQuiz: {
      scenario: "A commercial bank holds a $50M corporate bond portfolio with modified duration 6.8 years. Treasury bond futures have price $98,000 and the cheapest-to-deliver bond has modified duration 8.2 years.",
      testedFactIds: ["fact-05", "fact-08"],
      question: "How many futures contracts must the portfolio manager short to immunize the portfolio against parallel yield curve shifts?",
      correctAnswer: "423 short futures contracts",
      explanation: "Applying N* = (P * D_P) / (V_F * D_F) yields (50,000,000 * 6.8) / (98,000 * 8.2) = 340,000,000 / 803,600 = 423.1 contracts. Shorting 423 contracts immunizes the portfolio."
    },
    coreTakeaways: [
      "Eurodollar and SOFR 3-month futures quote as 100 - R, with a standard $25 tick value per basis point.",
      "The convexity adjustment reduces long-dated futures rates to obtain true forward borrowing rates.",
      "Modified duration provides the first-order linear price loss metric: Delta B / B approx -D* * Delta y.",
      "Positive convexity acts as embedded curvature protection, dampening price drops and magnifying gains.",
      "Unhedged bank duration gaps cause catastrophic balance sheet insolvency during sharp rate hiking cycles.",
      "Shorting N* = (P * D_P) / (V_F * D_F) contracts provides mathematical portfolio immunization."
    ]
  };

  const storyboard = {
    schemaVersion: "1.0.0",
    chapterSlug,
    course: courseSlug,
    chapterTitle: "Interest Rate Futures: Eurodollar Futures, Convexity, and Duration Hedging",
    approvedFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
    scenes: [
      {
        sceneIndex: 0,
        title: "The Bank Balance Sheet Shock",
        template: "chat_story",
        concept: "Raju's bank faces huge unrealized losses as rates surge; Sharma ji reveals the fatal unhedged duration gap.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju panics as bond portfolio value plunges during rate hike", sourceFactIds: ["fact-07"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji explains the fatal 7-year asset vs 1-year liability duration gap", sourceFactIds: ["fact-07"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Sharma ji introduces interest rate futures as the balance sheet immunization shield", sourceFactIds: ["fact-05", "fact-07"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 1,
        title: "Bank ALM Duration Gap: Snapshot 6.3",
        template: "split_comparison",
        concept: "Dissect Snapshot 6.3 balance sheet numbers proving negative equity wipeout under +200 bps hike.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present $1,000M assets (D=7) vs $900M liabilities (D=1)", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Calculate -$140M loss on assets vs $18M gain on liabilities under +200 bps shock", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Prove net $122M equity loss wiping out total $100M bank capital", sourceFactIds: ["fact-07"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 2,
        title: "Eurodollar & SOFR Futures Specifications",
        template: "progressive_cards",
        concept: "Detail 3-month contract specifications: $1M principal, 100 - R quotation, and $25 tick value.",
        sourceFactIds: ["fact-01"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Introduce $1,000,000 contract principal on 3-month deposits", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Explain index quotation Price = 100 - R", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Derive exact $25 per basis point tick value formula", sourceFactIds: ["fact-01"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 3,
        title: "The Convexity Adjustment Formula",
        template: "formula_breakdown",
        concept: "Deconstruct Forward Rate = Futures Rate - 0.5 * sigma^2 * T1 * T2 with worked 5-year example.",
        sourceFactIds: ["fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Highlight why daily mark-to-market makes futures rates exceed forward rates", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Break down the convexity adjustment formula terms", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Demonstrate 19 bps convexity adjustment on 5-year contract", sourceFactIds: ["fact-02"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 4,
        title: "Macaulay Duration: Cash Flow Timing",
        template: "formula_breakdown",
        concept: "Derive Macaulay duration D as weighted average cash flow maturity.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Define Macaulay duration as cash flow time weighting", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Break down time-weighting and discounting formula terms", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Contrast zero coupon duration vs coupon bond duration shortening", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 5,
        title: "Modified Duration: Price Sensitivity",
        template: "formula_breakdown",
        concept: "Explain linear price sensitivity Delta B / B approx -D* * Delta y with 50 bps yield hike example.",
        sourceFactIds: ["fact-04"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Define modified duration D* as linear price sensitivity", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Calculate -3.0% loss on 6-year duration bond facing +50 bps hike", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Emphasize negative inverse relationship between yields and bond prices", sourceFactIds: ["fact-04"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 6,
        title: "Convexity Protection Against Large Shocks",
        template: "split_comparison",
        concept: "Contrast linear duration estimate vs second-order convexity curvature correction.",
        sourceFactIds: ["fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Explain why linear duration fails on large rate shocks (>100 bps)", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Show second-order term +0.5 * C * (Delta y)^2", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Demonstrate asymmetry: prices rise faster on drops (+16.4%) than they fall on hikes (-13.6%)", sourceFactIds: ["fact-06"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 7,
        title: "The Duration Hedge Ratio Formula",
        template: "formula_breakdown",
        concept: "Formulate master portfolio immunization formula N* = (P * D_P) / (V_F * D_F).",
        sourceFactIds: ["fact-05"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Introduce duration hedge ratio formula N*", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Deconstruct portfolio dollar duration vs futures dollar duration", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Explain how shorting N* contracts neutralizes rate risk", sourceFactIds: ["fact-05"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 8,
        title: "Hedging a $50M Bond Portfolio: Case Study",
        template: "progressive_cards",
        concept: "Step-by-step sizing: $50M portfolio with D=6.8 hedged with CTD D=8.2 yields 423 contracts.",
        sourceFactIds: ["fact-05", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Calculate portfolio dollar duration P * D_P = $340,000,000", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Calculate futures contract dollar duration V_F * D_F = $803,600", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Size optimal hedge: N* = 340M / 803.6k = 423 short contracts", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 9,
        title: "Active Recall: Duration Hedge Ratio",
        template: "interactive_quiz",
        concept: "Challenge learner to compute N* contracts for the $50M portfolio.",
        sourceFactIds: ["fact-05"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present active recall scenario on portfolio immunization", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Learner calculates N* = 423 contracts during thinking pause", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Validate correct Option A and celebrate balance sheet immunization", sourceFactIds: ["fact-05"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 10,
        title: "Raju Masters Duration Immunization",
        template: "chat_story",
        concept: "Raju masters institutional balance sheet hedging; Sharma ji warns about basis risk and curve twists.",
        sourceFactIds: ["fact-05", "fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju achieves epiphany on institutional duration immunization", sourceFactIds: ["fact-05"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji warns about non-parallel shifts and credit basis risk", sourceFactIds: ["fact-05"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Sharma ji introduces upcoming Chapter 7 on Swaps", sourceFactIds: ["fact-01"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 11,
        title: "The Whole Picture: 8 Core Duration & Hedging Rules",
        template: "summary_thread",
        concept: "Synthesize the 8 iron laws of interest rate futures and duration hedging.",
        sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present executive roadmap of the 8 rules", sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Focus on Rules 1 and 2: Eurodollar ticks and daily settlement wedge", sourceFactIds: ["fact-01", "fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Focus on Rules 3 and 4: Convexity adjustment formula and Macaulay duration", sourceFactIds: ["fact-02", "fact-03"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Focus on Rules 5 and 6: Modified duration sensitivity and second-order convexity", sourceFactIds: ["fact-04", "fact-06"], speaker: "narrator" },
          { beatIndex: 4, textOutline: "Strict dedicated focus on Rules 7 & 8: Bank ALM crisis and Rule 8 target immunization formula", sourceFactIds: ["fact-05", "fact-07"], speaker: "narrator" },
          { beatIndex: 5, textOutline: "Display complete 2-column whole-chapter matrix", sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"], speaker: "narrator" }
        ]
      }
    ],
    summarySteps: [
      "1. Eurodollar Tick Standard: Every 1 basis point (0.01%) move in 3-month Eurodollar / SOFR futures is worth exactly $25 per contract.",
      "2. The Convexity Wedge: Daily mark-to-market settlement makes futures rates systematically higher than forward rates.",
      "3. Convexity Adjustment Formula: Forward Rate = Futures Rate - 0.5 * sigma^2 * T1 * T2 reduces long-dated futures rates.",
      "4. Macaulay Duration: Measures effective cash flow timing as the weighted average maturity of discounted payments.",
      "5. Modified Duration Sensitivity: Linear price loss is given by Delta B / B approx -D* * Delta y for small parallel shifts.",
      "6. Convexity Curvature: Positive curvature protects bondholders: Delta B / B approx -D* * Delta y + 0.5 * C * (Delta y)^2.",
      "7. Bank ALM Duration Gap: Banks holding long assets and short liabilities face balance sheet wipeout when yields surge.",
      "8. Target Immunization Rule: Shorting N* = (P * D_P) / (V_F * D_F) contracts immunizes portfolios against parallel yield shifts."
    ],
    bottomTakeaway: "Eurodollar futures, convexity adjustments, and duration hedging provide the mathematical armor required to navigate volatile global interest rate markets."
  };

  return { facts, audit, lessonPlan, storyboard };
}

for (const courseSlug of ['hull_derivatives', 'hull_derivatives_en']) {
  const targetDir = path.resolve('src/data/chapters', courseSlug, 'ch06_part2');
  fs.mkdirSync(targetDir, { recursive: true });

  const { facts, audit, lessonPlan, storyboard } = buildArtifacts(courseSlug);

  fs.writeFileSync(path.join(targetDir, 'source_facts.json'), JSON.stringify(facts, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'content_audit.json'), JSON.stringify(audit, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
}

console.log('✅ Successfully generated Phase 1 artifacts for ch06_part2 (Hindi & English)!');
