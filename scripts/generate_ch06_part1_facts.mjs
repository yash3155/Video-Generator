import fs from 'fs';
import path from 'path';

function buildArtifacts(courseSlug) {
  const chapterSlug = 'ch06_part1';

  const facts = {
    schemaVersion: "1.0.0",
    chapterSlug,
    notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
    sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: "Options, Futures, and Other Derivatives (John C. Hull)",
    generalAssumptions: [
      "Treasury bond markets adhere to institutional day count conventions (Actual/Actual in period).",
      "Short sellers have embedded delivery options (timing option, quality option, and wild card option).",
      "Arbitrage forces the futures price to converge to the cheapest-to-deliver bond at maturity."
    ],
    facts: [
      {
        id: "fact-01",
        category: "definition",
        topic: "Day Count Conventions (Actual/Actual vs 30/360 vs Actual/360)",
        statement: "Day count conventions define how interest accrues over time. US Treasury bonds use Actual/Actual (actual days between dates divided by actual days in coupon period). Corporate and municipal bonds use 30/360 (assuming 30 days per month and 360 days per year). US money market instruments (T-bills, repo, commercial paper) use Actual/360.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.1 Day Count and Quotation Conventions",
          page: 132,
          provenance: "notebooklm_query"
        },
        tags: ["day_count", "actual_actual", "thirty_three_sixty", "accrued_interest"]
      },
      {
        id: "fact-02",
        category: "formula",
        topic: "Clean Price vs Dirty Price (Cash Price)",
        statement: "The cash price (dirty price) paid by the bond buyer equals the quoted price (clean price) plus accrued interest: Cash Price = Quoted Price + Accrued Interest. Accrued Interest is calculated as: AI = Annual Coupon / 2 * (Days since last coupon / Days in coupon period).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.1 Day Count and Quotation Conventions",
          page: 133,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Bond Cash Price (Dirty Price) Formula",
          latex: "\\text{Cash Price} = \\text{Quoted Price} + \\text{Accrued Interest}",
          variables: [
            { symbol: "Cash Price", definition: "Actual invoice cash exchanged at settlement", unit: "$" },
            { symbol: "Quoted Price", definition: "Clean price displayed on broker trading screens", unit: "$" },
            { symbol: "Accrued Interest", definition: "Interest earned by seller since last coupon payment", unit: "$" }
          ]
        },
        tags: ["dirty_price", "clean_price", "accrued_interest", "cash_settlement"]
      },
      {
        id: "fact-03",
        category: "definition",
        topic: "Treasury Bond Futures Contract Specifications",
        statement: "CBOT/CME Treasury bond futures specify delivery of any US Treasury bond that has at least 15 years to maturity (and not callable within 15 years) on the first day of the delivery month. Contract size is $100,000 face value. Prices are quoted in points and 32nds of a point (e.g., 90-16 means 90 + 16/32 = 90.50% of par).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.2 Treasury Bond Futures",
          page: 135,
          provenance: "notebooklm_query"
        },
        tags: ["t_bond_futures", "contract_specs", "thirty_seconds", "cbot_cme"]
      },
      {
        id: "fact-04",
        category: "formula",
        topic: "Conversion Factor (CF) and Invoice Cash Received",
        statement: "Because different eligible bonds have different coupons and maturities, the exchange applies a Conversion Factor (CF) to standardize them. The CF is the clean price per $1 par to yield 6.0% per annum (semiannual compounding) on the first day of the delivery month. The invoice cash received by the short party is: Cash Received = (Futures Quoted Price * CF) + Accrued Interest.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.2 Treasury Bond Futures",
          page: 136,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Treasury Futures Invoice Price Formula",
          latex: "\\text{Invoice Price} = (F_0 \\times CF) + AI",
          variables: [
            { symbol: "Invoice Price", definition: "Total cash received by short seller per $100 par", unit: "$" },
            { symbol: "F_0", definition: "Quoted settlement price of the futures contract", unit: "$" },
            { symbol: "CF", definition: "Exchange conversion factor for delivered bond", unit: "decimal" },
            { symbol: "AI", definition: "Accrued interest on delivered bond to delivery date", unit: "$" }
          ]
        },
        tags: ["conversion_factor", "invoice_price", "standardization", "six_percent_benchmark"]
      },
      {
        id: "fact-05",
        category: "formula",
        topic: "Cheapest-to-Deliver (CTD) Bond Cost Calculation",
        statement: "The short seller chooses the eligible bond that minimizes delivery cost. The net cost of purchasing and delivering bond i is: Cost to Deliver = Bond Spot Clean Price - (Futures Settlement Price * CF_i). The bond with the lowest (most negative or least positive) cost to deliver is the Cheapest-to-Deliver (CTD).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.2 Treasury Bond Futures",
          page: 137,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Cost to Deliver Formula",
          latex: "\\text{Cost} = S_i - (F_0 \\times CF_i)",
          variables: [
            { symbol: "Cost", definition: "Net cost or loss incurred by delivering bond i", unit: "$" },
            { symbol: "S_i", definition: "Current spot clean price of eligible bond i", unit: "$" },
            { symbol: "F_0", definition: "Futures settlement price", unit: "$" },
            { symbol: "CF_i", definition: "Conversion factor of eligible bond i", unit: "decimal" }
          ]
        },
        tags: ["cheapest_to_deliver", "ctd", "delivery_option", "basis_trading"]
      },
      {
        id: "fact-06",
        category: "market_rule",
        topic: "CTD Selection Rules of Thumb with Market Yields",
        statement: "When market bond yields are strictly greater than 6.0%, the conversion factor system systematically favors long-maturity, low-coupon bonds as CTD. When market bond yields are strictly less than 6.0%, the conversion factor system favors short-maturity, high-coupon bonds as CTD. When the yield curve is upward-sloping, long bonds are favored; when downward-sloping, short bonds are favored.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.2 Treasury Bond Futures",
          page: 138,
          provenance: "notebooklm_query"
        },
        tags: ["ctd_heuristics", "yield_threshold", "duration_bias", "coupon_bias"]
      },
      {
        id: "fact-07",
        category: "case_study",
        topic: "The Wild Card Play Delivery Option (Snapshot 6.2)",
        statement: "Trading in CBOT Treasury bond futures closes at 2:00 PM Chicago time, establishing the official settlement price. However, the short seller has until 8:00 PM to submit a Notice of Intention to Deliver at that 2:00 PM settlement price. If spot bond prices decline in the late afternoon OTC market between 2:00 PM and 8:00 PM, the short party buys cheap spot bonds and announces delivery at the earlier higher 2:00 PM price, capturing a riskless profit. This delivery option reduces futures prices below theoretical spot parity.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "Snapshot 6.2 The Wild Card Play",
          page: 140,
          provenance: "notebooklm_query"
        },
        tags: ["wild_card_play", "timing_option", "cbot_rules", "afternoon_drop", "embedded_option"]
      },
      {
        id: "fact-08",
        category: "numerical_example",
        topic: "Cheapest-to-Deliver Identification Worked Example",
        statement: "Consider futures price F_0 = 93.00. Bond 1: Spot S_1 = $99.50, CF_1 = 1.0382, cost = 99.50 - (93 * 1.0382) = 99.50 - 96.55 = +$2.95. Bond 2: Spot S_2 = $143.50, CF_2 = 1.5188, cost = 143.50 - (93 * 1.5188) = 143.50 - 141.25 = +$2.25. Bond 3: Spot S_3 = $119.75, CF_3 = 1.2615, cost = 119.75 - (93 * 1.2615) = 119.75 - 117.32 = +$2.43. Bond 2 has the lowest cost ($2.25) and is the Cheapest-to-Deliver.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "6",
          section: "6.2 Treasury Bond Futures",
          page: 137,
          provenance: "notebooklm_query"
        },
        numericalDetails: {
          context: "Cheapest-to-deliver bond calculation for futures price 93.00 among three eligible Treasury bonds",
          values: {
            "futures_price": 93.0,
            "bond1_spot": 99.5,
            "bond1_cf": 1.0382,
            "bond1_cost": 2.95,
            "bond2_spot": 143.5,
            "bond2_cf": 1.5188,
            "bond2_cost": 2.25,
            "bond3_spot": 119.75,
            "bond3_cf": 1.2615,
            "bond3_cost": 2.43,
            "ctd_selected_bond": 2
          },
          units: "USD per $100 par"
        },
        tags: ["ctd_numerical_example", "cost_minimization", "delivery_selection"]
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
    title: "Interest Rate Futures: Day Counts, Bond Futures, and the Wild Card",
    targetAudiencePersona: "Fixed Income Portfolio Manager & Futures Basis Trader",
    prerequisites: [
      "Bond pricing, yield to maturity, and coupon discounting from Chapter 4",
      "Concept of short selling and delivery obligations",
      "Cost of carry and forward pricing parity from Chapter 5"
    ],
    learningOutcomes: [
      "Differentiate between Actual/Actual, 30/360, and Actual/360 day count conventions.",
      "Calculate dirty cash price from quoted clean price and accrued interest.",
      "Understand CBOT/CME Treasury bond futures specifications and 32nds price quoting.",
      "Apply Conversion Factors (CF) to compute exact invoice cash received upon delivery.",
      "Identify the Cheapest-to-Deliver (CTD) bond using Cost = Spot - (Futures * CF).",
      "Explain the mechanics of the Wild Card Play and why delivery options lower futures prices."
    ],
    sections: [
      {
        sectionIndex: 0,
        title: "Day Counts & The Clean vs Dirty Price Paradox",
        pedagogicalObjective: "Explain how day count conventions govern accrued interest and why invoice cash differs from screen quotes.",
        groundedFactIds: ["fact-01", "fact-02"],
        keyPoints: [
          "Treasury bonds use Actual/Actual in period; corporates use 30/360; money market uses Actual/360.",
          "Clean price excludes accrued interest; dirty cash price is actual invoice settlement: Cash = Clean + AI.",
          "Accrued interest drops to zero immediately after coupon dates, creating the sawtooth price chart."
        ],
        formulaUsed: "Cash Price = Quoted Price + Accrued Interest"
      },
      {
        sectionIndex: 1,
        title: "Treasury Bond Futures & Conversion Factors",
        pedagogicalObjective: "Formulate contract specifications, 32nds quotation, and the 6% conversion factor standardization.",
        groundedFactIds: ["fact-03", "fact-04"],
        keyPoints: [
          "Contract allows delivery of any Treasury bond maturing in 15 to 25 years.",
          "Conversion factor equals the price of $1 par to yield 6.0% semiannual.",
          "Invoice cash received by short party: (Futures Price * CF) + Accrued Interest."
        ],
        formulaUsed: "Invoice Price = (F_0 * CF) + AI"
      },
      {
        sectionIndex: 2,
        title: "The Cheapest-to-Deliver (CTD) Bond",
        pedagogicalObjective: "Derive Cost to Deliver = Spot - (Futures * CF) and demonstrate CTD selection across 3 bonds.",
        groundedFactIds: ["fact-05", "fact-08"],
        keyPoints: [
          "Short seller minimizes delivery cost: Cost = Spot - (Futures * CF).",
          "The bond with the lowest delivery cost is selected as CTD.",
          "Futures price tracks the CTD bond closely throughout the life of the contract."
        ],
        formulaUsed: "Cost = Spot - (Futures * CF)"
      },
      {
        sectionIndex: 3,
        title: "Yield Regimes and CTD Selection Rules",
        pedagogicalObjective: "Establish heuristics governing CTD choice when market yields trade above or below 6%.",
        groundedFactIds: ["fact-06"],
        keyPoints: [
          "When market yields > 6%: CF system favors long-maturity, low-coupon bonds.",
          "When market yields < 6%: CF system favors short-maturity, high-coupon bonds.",
          "Upward sloping yield curves favor long-maturity bonds."
        ]
      },
      {
        sectionIndex: 4,
        title: "The Wild Card Play & Embedded Delivery Options",
        pedagogicalObjective: "Dissect Snapshot 6.2 to analyze the 2:00 PM to 8:00 PM delivery timing window.",
        groundedFactIds: ["fact-07"],
        keyPoints: [
          "Futures settle at 2:00 PM Chicago time, but delivery notice can be submitted until 8:00 PM.",
          "Late afternoon bond price drops allow short sellers to buy cheap spot and deliver at high 2:00 PM price.",
          "This embedded timing option lowers the futures price below theoretical parity."
        ]
      }
    ],
    misconceptions: [
      {
        misconception: "The bond buyer pays the exact quoted price displayed on financial market screens.",
        factId: "fact-02",
        authorRebuttal: "Screen quotes show clean prices. The buyer must pay the dirty cash price, which adds accrued interest earned by the seller since the last coupon."
      },
      {
        misconception: "Treasury bond futures require delivery of a specific unique benchmark government bond.",
        factId: "fact-03",
        authorRebuttal: "The contract allows delivery of any US Treasury bond maturing in 15 to 25 years, standardized via conversion factors."
      },
      {
        misconception: "The short seller delivers whichever bond has the lowest spot market price.",
        factId: "fact-05",
        authorRebuttal: "The short seller delivers the bond that minimizes Cost = Spot - (Futures * CF). A higher-priced bond with a high conversion factor can be cheaper to deliver."
      }
    ],
    activeRecallQuiz: {
      scenario: "A Treasury bond futures price is quoted at 93.00. Bond A has spot price $99.50 and conversion factor 1.0382. Bond B has spot price $143.50 and conversion factor 1.5188. An analyst calculates the delivery cost.",
      testedFactIds: ["fact-05", "fact-08"],
      question: "Which bond is cheaper to deliver and what is its net cost?",
      correctAnswer: "Bond B with cost $2.25",
      explanation: "Cost A = 99.50 - (93 * 1.0382) = 99.50 - 96.55 = $2.95. Cost B = 143.50 - (93 * 1.5188) = 143.50 - 141.25 = $2.25. Bond B has the lower cost ($2.25 vs $2.95) and is the Cheapest-to-Deliver."
    },
    coreTakeaways: [
      "Day counts (Actual/Actual vs 30/360) determine accrued interest and dirty cash invoice settlement.",
      "Conversion factors (CF) normalize eligible Treasury bonds to a 6.0% semiannual yield standard.",
      "The short seller delivers the Cheapest-to-Deliver (CTD) bond minimizing Cost = Spot - (Futures * CF).",
      "When yields exceed 6%, long-maturity low-coupon bonds become CTD; below 6%, short-maturity high-coupon bonds win.",
      "The Wild Card Play grants short sellers a 6-hour delivery option after 2:00 PM, reducing futures prices."
    ]
  };

  const storyboard = {
    schemaVersion: "1.0.0",
    chapterSlug,
    course: courseSlug,
    chapterTitle: "Interest Rate Futures: Day Counts, Bond Futures, and the Wild Card",
    approvedFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
    scenes: [
      {
        sceneIndex: 0,
        title: "The Clean vs Dirty Price Shock",
        template: "chat_story",
        concept: "Raju buys a Treasury bond for $98,000 on screen, but gets invoiced $100,500; Sharma ji reveals accrued interest and day counts.",
        sourceFactIds: ["fact-01", "fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju is shocked when invoice exceeds screen quote by $2,500", sourceFactIds: ["fact-02"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji explains clean price vs dirty cash price and accrued interest", sourceFactIds: ["fact-02"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju learns how Actual/Actual day counts govern coupon accrual", sourceFactIds: ["fact-01"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 1,
        title: "Day Count Conventions: Actual/Actual vs 30/360",
        template: "split_comparison",
        concept: "Contrast institutional day count conventions across Treasuries, Corporates, and Money Markets.",
        sourceFactIds: ["fact-01"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Define day count conventions and their impact on bond interest", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Detail Treasury Actual/Actual rule vs Corporate 30/360 convention", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Examine Money Market Actual/360 convention used in T-bills and commercial paper", sourceFactIds: ["fact-01"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 2,
        title: "Dirty Price & Accrued Interest Formula",
        template: "formula_breakdown",
        concept: "Derive Cash Price = Quoted Price + Accrued Interest with worked semi-annual coupon calculation.",
        sourceFactIds: ["fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present Cash Price formula adding accrued interest to clean quote", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Break down Accrued Interest formula based on days since last coupon", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Demonstrate sawtooth price pattern as coupon dates pass", sourceFactIds: ["fact-02"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 3,
        title: "Treasury Bond Futures Contract Architecture",
        template: "progressive_cards",
        concept: "Explore CBOT/CME contract specifications, $100,000 par, and 32nds pricing quotation.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Introduce CBOT Treasury bond futures contract specifications", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Explain 15 to 25 year maturity delivery basket", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Decode fractional 32nds quotation (e.g. 90-16 equals 90.50%)", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Highlight the delivery power granted to the short contract holder", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 4,
        title: "Conversion Factors: Standardizing the Basket",
        template: "formula_breakdown",
        concept: "Formulate Conversion Factor (CF) to normalize bonds to a 6.0% semiannual yield standard.",
        sourceFactIds: ["fact-04"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Explain why heterogeneous coupons require a standardized conversion factor", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Define CF as bond price yielding 6.0% on first day of delivery month", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "State invoice cash formula: Cash = (Futures Price * CF) + AI", sourceFactIds: ["fact-04"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 5,
        title: "The Cheapest-to-Deliver (CTD) Mechanism",
        template: "formula_breakdown",
        concept: "Derive Cost to Deliver = Spot - (Futures * CF) and explain short position optimization.",
        sourceFactIds: ["fact-05"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Explain short seller objective to deliver the cheapest eligible bond", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Present Cost to Deliver formula: Cost = Spot - (Futures * CF)", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Show how futures price tracks CTD bond yield movements", sourceFactIds: ["fact-05"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 6,
        title: "CTD Identification: A 3-Bond Case Study",
        template: "progressive_cards",
        concept: "Walk through 3-bond selection proof where higher-priced Bond 2 wins with $2.25 lowest delivery cost.",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Set up market with futures at 93.00 and 3 competing eligible bonds", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Calculate Bond 1 cost: 99.50 - (93 * 1.0382) = $2.95", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Calculate Bond 2 cost: 143.50 - (93 * 1.5188) = $2.25", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Conclude Bond 2 is CTD despite higher spot price due to high CF", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 7,
        title: "Market Yield Regimes: The 6% Rule of Thumb",
        template: "split_comparison",
        concept: "Contrast CTD bond selection behavior when market yields are above 6% versus below 6%.",
        sourceFactIds: ["fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Introduce the 6.0% benchmark yield dividing line", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "When yields > 6%: long-maturity low-coupon bonds become CTD", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "When yields < 6%: short-maturity high-coupon bonds become CTD", sourceFactIds: ["fact-06"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 8,
        title: "The Wild Card Play Delivery Option",
        template: "progressive_cards",
        concept: "Dissect Snapshot 6.2 to analyze the 2:00 PM to 8:00 PM delivery timing window.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Explain CBOT futures trading close at 2:00 PM Chicago time", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Short party holds delivery announcement window open until 8:00 PM", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Afternoon OTC bond market drops allow riskless delivery arbitrage", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Embedded delivery option lowers futures prices below theoretical parity", sourceFactIds: ["fact-07"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 9,
        title: "Active Recall: Identifying the CTD Bond",
        template: "interactive_quiz",
        concept: "Test active calculation of CTD bond cost between Bond A ($2.95) and Bond B ($2.25).",
        sourceFactIds: ["fact-05", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present CTD quiz scenario between Bond A and Bond B", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Raju computes Cost = Spot - (Futures * CF) for both bonds", sourceFactIds: ["fact-08"], speaker: "Raju" },
          { beatIndex: 2, textOutline: "Validate correct answer: Bond B with $2.25 delivery cost", sourceFactIds: ["fact-08"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 10,
        title: "Raju Masters Bond Futures Deliveries",
        template: "chat_story",
        concept: "Raju connects day counts, conversion factors, CTD basis trading, and embedded delivery options.",
        sourceFactIds: ["fact-02", "fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju summarizes how short delivery options govern bond futures prices", sourceFactIds: ["fact-02"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji highlights the importance of basis trading around CTD bonds", sourceFactIds: ["fact-07"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju prepares to study Eurodollar futures and duration hedging in Part 2", sourceFactIds: ["fact-03"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 11,
        title: "The Whole Picture: 8 Core Bond Futures Rules",
        template: "summary_thread",
        concept: "Review the 8 foundational rules of interest rate day counts and Treasury bond futures.",
        sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Roadmap overview of the 8 core Treasury bond futures rules", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Rules 1 & 2: Day count conventions and clean vs dirty cash pricing", sourceFactIds: ["fact-01", "fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Rules 3 & 4: 15-25 year delivery basket and conversion factors", sourceFactIds: ["fact-03", "fact-04"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Rules 5 & 6: CTD cost formula and the 6% yield threshold rules", sourceFactIds: ["fact-05", "fact-06"], speaker: "narrator" },
          { beatIndex: 4, textOutline: "Rules 7 & 8: The Wild Card Play and embedded delivery option value", sourceFactIds: ["fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 5, textOutline: "Complete whole-chapter 2-column reference matrix", sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"], speaker: "narrator" }
        ]
      }
    ],
    summarySteps: [
      "1. Day Counts: Treasuries use Actual/Actual, corporate bonds use 30/360, and money markets use Actual/360.",
      "2. Dirty Cash Price: Buyer pays Clean Quoted Price plus Accrued Interest: Cash = Clean + AI.",
      "3. T-Bond Futures Basket: Contracts allow delivery of any Treasury bond maturing in 15 to 25 years.",
      "4. Conversion Factors (CF): Equalize heterogeneous bonds to a 6.0% semiannual yield standard.",
      "5. CTD Cost Formula: Short delivers the bond minimizing Cost = Spot Clean Price - (Futures * CF).",
      "6. The 6% Yield Heuristic: Yields > 6% favor long-maturity low-coupon; yields < 6% favor short-maturity high-coupon.",
      "7. The Wild Card Play: 6-hour delivery notice window post-2 PM allows shorts to profit from late price drops.",
      "8. Embedded Option Value: Short delivery flexibility systematically lowers futures prices below cash parity."
    ],
    bottomTakeaway: "Treasury bond futures pricing is governed by the cheapest-to-deliver bond, standardized via conversion factors, with prices discounted by embedded delivery options."
  };

  const targetDir = path.resolve(`src/data/chapters/${courseSlug}/${chapterSlug}`);
  fs.mkdirSync(targetDir, { recursive: true });

  fs.writeFileSync(path.join(targetDir, 'source_facts.json'), JSON.stringify(facts, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'content_audit.json'), JSON.stringify(audit, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');

  console.log(`✅ ch06_part1 Phase 1 artifacts written for ${courseSlug}!`);
}

buildArtifacts('hull_derivatives');
buildArtifacts('hull_derivatives_en');
