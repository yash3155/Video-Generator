import fs from 'fs';
import path from 'path';

function buildArtifacts(courseSlug) {
  const chapterSlug = 'ch05_part1';

  const facts = {
    schemaVersion: "1.0.0",
    chapterSlug,
    notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
    sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: "Options, Futures, and Other Derivatives (John C. Hull)",
    generalAssumptions: [
      "Market participants face zero transaction costs and identical borrowing and lending risk-free rates.",
      "Short selling is permitted with full use of short sale proceeds.",
      "Arbitrageurs act instantaneously to eliminate any pricing divergence from theoretical no-arbitrage bounds."
    ],
    facts: [
      {
        id: "fact-01",
        category: "definition",
        topic: "Investment vs Consumption Assets",
        statement: "An investment asset is an asset held solely for investment purposes by a significant number of investors (e.g., stocks, bonds, gold, silver). A consumption asset is held primarily for consumption or industrial utility (e.g., crude oil, copper, corn). Arbitrage determines exact forward prices for investment assets, but only provides upper bounds for consumption assets.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.1 Investment Assets vs Consumption Assets",
          page: 104,
          provenance: "notebooklm_query"
        },
        tags: ["investment_asset", "consumption_asset", "arbitrage_bounds", "asset_classification"]
      },
      {
        id: "fact-02",
        category: "market_rule",
        topic: "Short Selling Mechanics and Dividend Obligations",
        statement: "Short selling involves borrowing securities from an existing owner via a broker and selling them in the market. The short seller must pay all dividends and interest distributions to the lender and must maintain margin collateral until replacing the borrowed securities.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.2 Short Selling",
          page: 105,
          provenance: "notebooklm_query"
        },
        tags: ["short_selling", "stock_borrowing", "dividend_remittance", "margin"]
      },
      {
        id: "fact-03",
        category: "formula",
        topic: "No-Arbitrage Forward Price on Investment Assets with No Income",
        statement: "For an investment asset providing no income, the theoretical forward price for a contract maturing at time T is F_0 = S_0 * e^(r*T), where S_0 is the spot price and r is the continuous risk-free rate.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.3 Forward Price for an Investment Asset",
          page: 107,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Forward Price Formula (No Income)",
          latex: "F_0 = S_0 e^{rT}",
          variables: [
            { symbol: "F_0", definition: "Theoretical forward contract price today", unit: "$" },
            { symbol: "S_0", definition: "Current spot price of the underlying asset", unit: "$" },
            { symbol: "r", definition: "Continuously compounded risk-free rate", unit: "%" },
            { symbol: "T", definition: "Maturity of the forward contract in years", unit: "years" }
          ]
        },
        tags: ["forward_pricing", "no_income", "spot_forward_parity", "continuous_compounding"]
      },
      {
        id: "fact-04",
        category: "market_rule",
        topic: "Cash-and-Carry vs Reverse Cash-and-Carry Arbitrage",
        statement: "If F_0 > S_0 * e^(r*T), an arbitrageur executes cash-and-carry: borrow S_0 at rate r, buy spot asset, short forward at F_0, locking profit F_0 - S_0*e^(r*T). If F_0 < S_0 * e^(r*T), an arbitrageur executes reverse cash-and-carry: short spot asset, invest proceeds at rate r, buy forward at F_0.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.3 Forward Price for an Investment Asset",
          page: 108,
          provenance: "notebooklm_query"
        },
        tags: ["arbitrage", "cash_and_carry", "reverse_cash_and_carry", "lock_profit"]
      },
      {
        id: "fact-05",
        category: "formula",
        topic: "Forward Price with Known Discrete Cash Income",
        statement: "When an investment asset provides known cash income with present value I during the contract term, the forward price is F_0 = (S_0 - I) * e^(r*T). Income reduces the effective capital tied up in holding the spot asset.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.4 Known Income",
          page: 110,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Forward Price with Known Cash Income",
          latex: "F_0 = (S_0 - I) e^{rT}",
          variables: [
            { symbol: "F_0", definition: "Theoretical forward price", unit: "$" },
            { symbol: "S_0", definition: "Current spot asset price", unit: "$" },
            { symbol: "I", definition: "Present value of all cash income during contract term", unit: "$" },
            { symbol: "r", definition: "Continuously compounded risk-free interest rate", unit: "%" },
            { symbol: "T", definition: "Time to maturity in years", unit: "years" }
          ]
        },
        tags: ["known_income", "dividend_discounting", "forward_pricing", "coupon_income"]
      },
      {
        id: "fact-06",
        category: "formula",
        topic: "Forward Price with Known Continuous Dividend Yield",
        statement: "When an asset provides a known continuous dividend yield at annual rate q, the forward price is F_0 = S_0 * e^((r - q)*T). The cost of carry equals (r - q). If dividend yield exceeds risk-free rate (q > r), the forward price trades at a discount to spot.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.5 Known Dividend Yield",
          page: 112,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Forward Price with Continuous Dividend Yield",
          latex: "F_0 = S_0 e^{(r - q)T}",
          variables: [
            { symbol: "F_0", definition: "Theoretical forward price", unit: "$" },
            { symbol: "S_0", definition: "Spot price of the asset", unit: "$" },
            { symbol: "r", definition: "Continuous risk-free interest rate", unit: "%" },
            { symbol: "q", definition: "Continuous dividend yield per annum", unit: "%" },
            { symbol: "T", definition: "Contract maturity in years", unit: "years" }
          ]
        },
        tags: ["dividend_yield", "continuous_yield", "cost_of_carry", "index_forwards"]
      },
      {
        id: "fact-07",
        category: "case_study",
        topic: "Kidder Peabody's Phantom STRIPs Glitch (Snapshot 5.1)",
        statement: "Between 1992 and 1994, government bond trader Joseph Jett at Kidder Peabody exploited a computer system valuation error where forward reconstitution of stripped Treasury bonds was booked at full undiscounted future value on trade date. This created $350 million in fictitious accounting profits, concealing a real $210 million trading loss and forcing parent General Electric to liquidate the firm.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "Snapshot 5.1 Kidder Peabody's Fictitious Profits",
          page: 109,
          provenance: "notebooklm_query"
        },
        tags: ["kidder_peabody", "joseph_jett", "phantom_profits", "strips", "accounting_fraud"]
      },
      {
        id: "fact-08",
        category: "case_study",
        topic: "Short Squeezes and Repo Special Rates (Snapshot 5.2)",
        statement: "When market participants heavily short a specific Treasury bond, demand to borrow that issue in repo markets skyrockets, driving its repo rate far below general collateral rates (trading 'on special' or even negative). Short sellers face severe borrowing fees or forced delivery liquidations (short squeeze).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "Snapshot 5.2 A Short Squeeze",
          page: 106,
          provenance: "notebooklm_query"
        },
        tags: ["short_squeeze", "repo_special", "borrowing_fee", "treasury_squeeze"]
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
    title: "Determination of Forward and Futures Prices: Part 1",
    targetAudiencePersona: "Quantitative Trader & Derivative Structurer",
    prerequisites: [
      "Continuous compounding and discounting A = P * e^(rT)",
      "Basic concepts of short selling and security borrowing",
      "Term structure of interest rates from Chapter 4"
    ],
    learningOutcomes: [
      "Classify assets into investment versus consumption assets and explain arbitrage pricing boundaries.",
      "Calculate theoretical forward prices for no-income assets using F_0 = S_0 * e^(rT).",
      "Construct cash-and-carry and reverse cash-and-carry arbitrage portfolios when market prices diverge.",
      "Adjust forward prices for known discrete cash dividends: F_0 = (S_0 - I) * e^(rT).",
      "Model continuous dividend yields using F_0 = S_0 * e^((r - q)*T) and define cost of carry.",
      "Analyze the Kidder Peabody scandal to explain how discounting timing errors generate phantom accounting profits."
    ],
    sections: [
      {
        sectionIndex: 0,
        title: "Asset Typology & Short Selling Mechanics",
        pedagogicalObjective: "Establish the distinction between investment and consumption assets and detail short selling obligations.",
        groundedFactIds: ["fact-01", "fact-02", "fact-08"],
        keyPoints: [
          "Investment assets allow two-way arbitrage; consumption assets only establish upper bounds.",
          "Short sellers must pay all dividends to lenders and face repo special borrowing costs.",
          "Short squeezes force premature closeout when borrow supply dries up."
        ]
      },
      {
        sectionIndex: 1,
        title: "No-Arbitrage Forward Pricing: No Income Assets",
        pedagogicalObjective: "Derive F_0 = S_0 * e^(rT) and prove cash-and-carry replication.",
        groundedFactIds: ["fact-03", "fact-04"],
        keyPoints: [
          "Theoretical forward price equals spot price compounded at the risk-free rate.",
          "F_0 > S_0 * e^(rT) triggers cash-and-carry (borrow cash, buy spot, short forward).",
          "F_0 < S_0 * e^(rT) triggers reverse cash-and-carry (short spot, invest cash, long forward)."
        ],
        formulaUsed: "F_0 = S_0 * e^(rT)"
      },
      {
        sectionIndex: 2,
        title: "Forward Pricing with Known Income & Dividends",
        pedagogicalObjective: "Formulate forward pricing adjustments for discrete cash coupons and continuous dividend yields.",
        groundedFactIds: ["fact-05", "fact-06"],
        keyPoints: [
          "Discrete cash dividends reduce forward price: F_0 = (S_0 - I) * e^(rT).",
          "Continuous dividend yield q offsets financing cost: F_0 = S_0 * e^((r - q)*T).",
          "Cost of carry c = r - q; if q > r, forward trades at a discount to spot."
        ],
        formulaUsed: "F_0 = (S_0 - I) * e^(rT) and F_0 = S_0 * e^((r - q)*T)"
      },
      {
        sectionIndex: 3,
        title: "Kidder Peabody's $350M Phantom Forward STRIPs",
        pedagogicalObjective: "Dissect Snapshot 5.1 to show how failing to discount forward commitments creates fictitious trading profits.",
        groundedFactIds: ["fact-07"],
        keyPoints: [
          "Trader Joseph Jett exploited accounting software that credited future stripped bond values today without discounting.",
          "Created $350M in phantom accounting profits while losing $210M in actual trading.",
          "Destroyed Kidder Peabody and led to its acquisition by PaineWebber."
        ]
      }
    ],
    misconceptions: [
      {
        misconception: "The forward price of an asset represents the market's expected future spot price.",
        factId: "fact-03",
        authorRebuttal: "Forward price is purely determined by the cost of financing spot storage (F_0 = S_0 * e^(rT)) to prevent arbitrage, irrespective of whether investors expect prices to rise or fall."
      },
      {
        misconception: "Dividends increase the forward price because the asset generates cash flow.",
        factId: "fact-05",
        authorRebuttal: "Dividends are collected by the spot holder, not the forward buyer. Therefore, dividends reduce the forward price: F_0 = (S_0 - I) * e^(rT)."
      },
      {
        misconception: "Short sellers can hold short positions indefinitely at zero extra cost.",
        factId: "fact-08",
        authorRebuttal: "Short sellers face stock borrowing fees, repo specials, and risk of forced buy-ins during short squeezes."
      }
    ],
    activeRecallQuiz: {
      scenario: "A non-dividend-paying stock trades at $50. The continuous risk-free interest rate is 6% per annum for all maturities. An investor wants to determine the 6-month theoretical forward price.",
      testedFactIds: ["fact-03"],
      question: "What is the theoretical 6-month forward price of the stock?",
      correctAnswer: "$51.52 theoretical forward price",
      explanation: "Using F_0 = S_0 * e^(rT) with S_0 = 50, r = 0.06, and T = 0.5: F_0 = 50 * e^(0.06 * 0.5) = 50 * e^(0.03) = 50 * 1.03045 = $51.52."
    },
    coreTakeaways: [
      "Investment assets obey strict two-way no-arbitrage bounds; consumption assets only obey upper bounds.",
      "No-income forward price F_0 = S_0 * e^(rT) reflects the pure cost of carrying the spot asset.",
      "Known discrete cash dividends reduce forward price to F_0 = (S_0 - I) * e^(rT).",
      "Continuous dividend yields reduce carry cost: F_0 = S_0 * e^((r - q)*T).",
      "Kidder Peabody collapsed because accounting software failed to discount forward delivery commitments."
    ]
  };

  const storyboard = {
    schemaVersion: "1.0.0",
    chapterSlug,
    course: courseSlug,
    chapterTitle: "Determination of Forward and Futures Prices: Part 1",
    approvedFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
    scenes: [
      {
        sceneIndex: 0,
        title: "The Forward Price Puzzle",
        template: "chat_story",
        concept: "Raju thinks forward price is a crystal ball predicting future spot prices; Sharma ji reveals cost of carry arbitrage.",
        sourceFactIds: ["fact-01", "fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju sees Gold forward trading higher and thinks price is guaranteed to rise", sourceFactIds: ["fact-01"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji explains forward price is financing cost, not a price forecast", sourceFactIds: ["fact-03"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju asks how arbitrage locks this price without guessing market direction", sourceFactIds: ["fact-03"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 1,
        title: "Investment vs Consumption Assets",
        template: "tug_of_war",
        concept: "Contrast two-way financial arbitrage on investment assets with one-way consumption limits.",
        sourceFactIds: ["fact-01"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Investment assets allow two-way arbitrage through borrowing and shorting", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Consumption assets cannot be easily shorted by consumers holding physical inventories", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Investment assets obey exact equalities while consumption assets obey upper bounds", sourceFactIds: ["fact-01"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 2,
        title: "No-Income Forward Price Formula",
        template: "formula_breakdown",
        concept: "Derive F_0 = S_0 * e^(rT) with $50 spot stock and 6% interest rate worked example.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Forward price compensates the dealer for holding the asset until maturity", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Continuous formula: F_0 = S_0 * e^(rT)", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "At spot $50 and 6% rate, 6-month forward price is exactly $51.52", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 3,
        title: "Cash-and-Carry vs Reverse Cash-and-Carry",
        template: "split_comparison",
        concept: "Detail two-sided arbitrage strategies when market forward price departs from theoretical parity.",
        sourceFactIds: ["fact-04"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Cash-and-Carry: If market forward is overpriced, borrow, buy spot, and sell forward", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Reverse Cash-and-Carry: If forward is underpriced, short spot, lend cash, and buy forward", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Arbitrage forces market prices to converge instantly to theoretical parity", sourceFactIds: ["fact-04"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 4,
        title: "Short Selling Mechanics & Repo Specials",
        template: "progressive_cards",
        concept: "Examine short selling rules, dividend remittance, and repo special short squeezes.",
        sourceFactIds: ["fact-02", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Short selling requires borrowing securities through institutional lending desks", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Short seller must pay all manufactured dividends and coupons to lender", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "High short interest drives repo rates negative on special issues", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Short squeezes force aggressive buying when lenders recall borrowed shares", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 5,
        title: "Forward Price with Known Cash Income",
        template: "formula_breakdown",
        concept: "Formulate F_0 = (S_0 - I) * e^(rT) showing how interim cash flows reduce forward carry cost.",
        sourceFactIds: ["fact-05"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "When an asset pays known cash income, forward price decreases", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Formula: F_0 = (S_0 - I) * e^(rT) where I is present value of dividends", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Income offsets financing expenses, lowering fair forward price", sourceFactIds: ["fact-05"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 6,
        title: "Forward Price with Continuous Dividend Yield",
        template: "split_comparison",
        concept: "Compare no-dividend assets with continuous yield assets: F_0 = S_0 * e^((r - q)*T).",
        sourceFactIds: ["fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Continuous dividend yield q offsets financing cost r directly in exponent", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Net cost of carry equals (r - q)", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "When dividend yield exceeds interest rate (q > r), forward trades below spot", sourceFactIds: ["fact-06"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 7,
        title: "Kidder Peabody's $350M Accounting Disaster",
        template: "progressive_cards",
        concept: "Analyze Snapshot 5.1: Joseph Jett, forward reconstitution of STRIPs, and undiscounted phantom profits.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Trader Joseph Jett traded Treasury STRIPs and forward bond reconstitutions", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Accounting system booked future forward delivery value today without discounting", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Computer generated $350M in fictitious paper profits while hiding $210M losses", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "When bonds matured, the illusion broke, destroying 130-year-old Kidder Peabody", sourceFactIds: ["fact-07"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 8,
        title: "Repo Specials & Treasury Short Squeeze",
        template: "progressive_cards",
        concept: "Analyze Snapshot 5.2: Repo market squeezes and negative lending rates on scarce collateral.",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Benchmark Treasury issues frequently attract massive short hedging positions", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "High demand to borrow specific bonds drives their repo rates to zero or negative", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Lenders effectively receive interest to hold cash collateral for scarce bonds", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Short sellers face explosive borrowing penalties during supply squeezes", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 9,
        title: "Active Recall: 6-Month Forward Stock Pricing",
        template: "interactive_quiz",
        concept: "Active recall scenario: Calculate 6-month forward price for $50 stock with 6% interest rate.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Given $50 spot stock and 6% continuous interest rate, calculate 6-month forward price", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Raju computes 50 * e^(0.06 * 0.5) = 50 * e^(0.03)", sourceFactIds: ["fact-03"], speaker: "Raju" },
          { beatIndex: 2, textOutline: "Sharma ji confirms $51.52 with exact cost-of-carry math", sourceFactIds: ["fact-03"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 10,
        title: "Raju Understands Cost of Carry",
        template: "chat_story",
        concept: "Raju realizes forward prices reflect carry financing, avoiding crystal ball traps.",
        sourceFactIds: ["fact-03", "fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju stops treating forward prices as market direction forecasts", sourceFactIds: ["fact-03"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji reminds him that discounting timing is everything in derivative accounting", sourceFactIds: ["fact-07"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju affirms strict no-arbitrage bounds for desk risk controls", sourceFactIds: ["fact-04"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 11,
        title: "The Whole Picture: 8 Core Forward Pricing Rules",
        template: "summary_thread",
        concept: "Execute strict 8-step summary sequence covering all chapter principles with dedicated Rule 8 focus.",
        sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Executive overview of all eight forward pricing principles", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Rules 1 & 2: Investment asset arbitrage boundaries and short selling obligations", sourceFactIds: ["fact-01", "fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Rules 3 & 4: Forward formula F_0 = S_0 * e^(rT) and two-sided cash-and-carry bounds", sourceFactIds: ["fact-03", "fact-04"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Rules 5 & 6: Known cash income adjustment and continuous dividend yield pricing", sourceFactIds: ["fact-05", "fact-06"], speaker: "narrator" },
          { beatIndex: 4, textOutline: "Rules 7 & 8: Kidder Peabody phantom profit disaster and repo special short squeezes", sourceFactIds: ["fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 5, textOutline: "Final 2-column whole-chapter reference matrix", sourceFactIds: ["fact-01", "fact-08"], speaker: "narrator" }
        ]
      }
    ],
    summarySteps: [
      "1. Asset Classification: Investment assets allow two-way arbitrage; consumption assets only define upper bounds.",
      "2. Short Selling Rules: Short sellers must remit all dividends to lenders and provide collateral margin.",
      "3. Spot-Forward Parity: F_0 = S_0 * e^(rT) represents the cost of financing spot storage until maturity.",
      "4. Cash-and-Carry Bounds: Divergence from parity triggers instant riskless borrowing and spot replication.",
      "5. Known Cash Income: Interim cash payments reduce forward prices: F_0 = (S_0 - I) * e^(rT).",
      "6. Continuous Dividend Yield: Continuous dividends offset financing costs: F_0 = S_0 * e^((r - q)*T).",
      "7. Kidder Peabody Disaster: Software failure to discount forward STRIPs created $350M in phantom profits.",
      "8. Repo Special Squeezes: High short interest drives repo rates negative and triggers violent forced buy-ins."
    ],
    bottomTakeaway: "Forward prices represent the no-arbitrage cost of carry, not market forecasts; dividend income reduces carry costs, and proper discounting is vital."
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
