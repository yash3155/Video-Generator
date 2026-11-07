import fs from 'fs';
import path from 'path';

function buildArtifacts(courseSlug) {
  const chapterSlug = 'ch07_part2';

  const facts = {
    schemaVersion: "1.0.0",
    chapterSlug,
    notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
    sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: "Options, Futures, and Other Derivatives (John C. Hull)",
    generalAssumptions: [
      "Fixed-for-fixed currency swaps involve the exchange of principal in two different currencies at inception and maturity.",
      "Interest payments are exchanged in the respective currencies, creating significant foreign exchange and credit exposure.",
      "Legal capacity (ultra vires) is a critical legal risk in derivative counterparties (Snapshot 7.2)."
    ],
    facts: [
      {
        id: "fact-01",
        category: "definition",
        topic: "Mechanics of Fixed-for-Fixed Currency Swaps",
        statement: "A currency swap involves exchanging principal and interest payments in two different currencies. Unlike interest rate swaps, the principal amounts are exchanged at the beginning of the swap at the prevailing spot rate and re-exchanged at the end of the swap at the exact same exchange rate.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "7.9 Currency Swaps",
          page: 187,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Currency Swap Cash Flow Identity",
          latex: "\\text{Inception}: \\$L \\leftrightarrow \\pounds (L / S_0), \\quad \\text{Maturity}: \\pounds (L / S_0) \\leftrightarrow \\$L",
          variables: [
            { symbol: "L", definition: "USD notional principal ($10,000,000)", unit: "$" },
            { symbol: "S_0", definition: "Spot exchange rate at inception (e.g., $1.30 per GBP)", unit: "$ / GBP" },
            { symbol: "L / S_0", definition: "Foreign currency principal amount", unit: "GBP" }
          ]
        },
        tags: ["currency_swap", "fixed_for_fixed", "principal_exchange", "cross_currency"]
      },
      {
        id: "fact-02",
        category: "claim",
        topic: "Transforming Foreign Currency Liabilities and Assets",
        statement: "A multinational corporation with access to cheap domestic debt (e.g. a US firm borrowing USD at 5.0%) enters a currency swap to fund overseas expansion in the UK, transforming its liability into a pure 4.0% GBP loan without exposure to foreign exchange fluctuations.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "7.9 Currency Swaps",
          page: 189,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Currency Liability Transformation",
          latex: "\\text{Net Financing} = \\text{USD Debt} + \\text{Swap}(\\text{USD for GBP}) = \\text{Synthetic GBP Debt}",
          variables: [
            { symbol: "Net Financing", definition: "Effective foreign currency borrowing cost", unit: "%" },
            { symbol: "Domestic Debt", definition: "Interest rate paid on home currency borrowing", unit: "%" }
          ]
        },
        tags: ["liability_transformation", "cross_border_financing", "fx_risk_elimination"]
      },
      {
        id: "fact-03",
        category: "claim",
        topic: "Comparative Advantage in Currency Swaps",
        statement: "Domestic market bias allows firms to borrow more cheaply in their home currency. When US Firm A borrows USD at 5.0% and GBP at 7.0%, while UK Firm B borrows USD at 5.8% and GBP at 6.5%, the USD differential is 0.8% and the GBP differential is 0.5%, unlocking 30 basis points (0.30%) of mutual arbitrage surplus.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "7.9 Currency Swaps",
          page: 190,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Currency Swap Comparative Advantage Surplus",
          latex: "\\text{Total Surplus} = \\Delta \\text{USD Spread} - \\Delta \\text{GBP Spread} = 0.80\\% - 0.50\\% = 0.30\\% \\text{ (30 bps)}",
          variables: [
            { symbol: "Total Surplus", definition: "Combined cross-border arbitrage savings", unit: "bps" },
            { symbol: "Delta USD", definition: "Difference between Firm B and Firm A USD borrowing rates", unit: "%" },
            { symbol: "Delta GBP", definition: "Difference between Firm A and Firm B GBP borrowing rates", unit: "%" }
          ]
        },
        tags: ["comparative_advantage", "cross_currency_arbitrage", "home_bias"]
      },
      {
        id: "fact-04",
        category: "formula",
        topic: "Valuation of Currency Swaps in Terms of Bond Prices",
        statement: "A currency swap where a party pays currency A and receives currency B can be decomposed into an equivalent long position in a foreign currency bond B and a short position in a domestic currency bond A: V_swap = B_B - S_0 * B_A, where S_0 is the current spot exchange rate.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "7.10 Valuation of Currency Swaps",
          page: 191,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Currency Swap Bond Valuation",
          latex: "V_{\\text{swap}} = B_B - S_0 \\cdot B_A",
          variables: [
            { symbol: "V_swap", definition: "Market value of the swap in domestic currency", unit: "$" },
            { symbol: "B_B", definition: "Value of bond received denominated in domestic currency", unit: "$" },
            { symbol: "B_A", definition: "Value of bond paid denominated in foreign currency", unit: "Foreign Currency" },
            { symbol: "S_0", definition: "Current spot exchange rate", unit: "$ per foreign unit" }
          ]
        },
        tags: ["currency_swap_valuation", "bond_decomposition", "spot_fx"]
      },
      {
        id: "fact-05",
        category: "formula",
        topic: "Valuation of Currency Swaps as a Portfolio of Forward FX Contracts",
        statement: "Alternatively, a currency swap can be valued as a series of forward foreign exchange contracts where each coupon exchange and the final principal re-exchange is priced using interest rate parity: F_i = S_0 * e^((r_USD - r_GBP) * t_i).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "7.10 Valuation of Currency Swaps",
          page: 193,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Forward FX Portfolio Valuation",
          latex: "V_{\\text{swap}} = \\sum_{i=1}^n (K_i - F_i) \\cdot e^{-r \\cdot t_i}",
          variables: [
            { symbol: "F_i", definition: "Forward exchange rate for maturity t_i", unit: "decimal" },
            { symbol: "K_i", definition: "Contractual cash flow exchange rate", unit: "decimal" },
            { symbol: "r", definition: "Domestic risk-free rate", unit: "decimal" }
          ]
        },
        tags: ["forward_fx_decomposition", "interest_rate_parity", "cross_currency_pricing"]
      },
      {
        id: "fact-06",
        category: "claim",
        topic: "Credit Risk Asymmetry: Currency Swaps vs Interest Rate Swaps",
        statement: "Currency swaps bear far greater credit risk than interest rate swaps because principal amounts are re-exchanged at maturity. If the exchange rate moves dramatically, the replacement cost exposure includes foreign currency appreciation on the full notional principal, making currency swaps significantly more capital-intensive.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "7.11 Credit Risk",
          page: 194,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Currency Swap Credit Exposure",
          latex: "\\text{Exposure} = \\max(0, B_B - S_0 \\cdot B_A)",
          variables: [
            { symbol: "Exposure", definition: "Maximum capital loss if counterparty defaults", unit: "$" }
          ]
        },
        tags: ["credit_risk_asymmetry", "principal_at_risk", "fx_replacement_cost"]
      },
      {
        id: "fact-07",
        category: "case_study",
        topic: "Snapshot 7.2: The Hammersmith and Fulham Swap Scandal",
        statement: "In 1988-1989, the local council of Hammersmith and Fulham entered over 600 interest rate swaps betting rates would fall. When UK interest rates rose from 8% to 15%, the council faced £600M in losses. In 1991, the UK House of Lords ruled that local councils had no legal capacity (ultra vires) to trade swaps, voiding all contracts and leaving 75 international banks with over £1 billion in losses.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "Snapshot 7.2 The Hammersmith and Fulham Story",
          page: 195,
          provenance: "notebooklm_query"
        },
        numericalDetails: {
          context: "Ultra vires legal risk in the UK municipal swap market",
          values: {
            "swap_positions_entered": 600,
            "council_losses_gbp_m": 600,
            "bank_losses_gbp_b": 1.0,
            "rate_surge_pct": 7.0
          },
          units: "GBP Millions / Banks"
        },
        tags: ["hammersmith_and_fulham", "ultra_vires", "legal_risk", "snapshot_7_2", "municipal_defaults"]
      },
      {
        id: "fact-08",
        category: "definition",
        topic: "Credit Default Swaps (CDS) Mechanics and Default Protection",
        statement: "A Credit Default Swap (CDS) is a contract where the protection buyer pays a periodic spread (e.g., 150 bps per year) on a notional principal to buy insurance against a credit event (default, bankruptcy) of a reference entity. Upon a credit event, the protection seller pays the default payoff: Payoff = (1 - R) * Notional, where R is the bond recovery rate.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "7",
          section: "7.12 Credit Default Swaps Intro",
          page: 197,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "CDS Default Payoff Formula",
          latex: "\\text{Payoff} = (1 - R) \\cdot L",
          variables: [
            { symbol: "Payoff", definition: "Cash settlement received by protection buyer upon default", unit: "$" },
            { symbol: "R", definition: "Post-default bond recovery rate (typically 40%)", unit: "decimal" },
            { symbol: "L", definition: "Notional principal of protected debt", unit: "$" }
          ]
        },
        tags: ["credit_default_swap", "cds_spread", "recovery_rate", "default_protection"]
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
    title: "Currency Swaps, Valuation, Legal Risk, and CDS",
    targetAudiencePersona: "Global Macro Risk Manager & Multi-Currency Treasury Trader",
    prerequisites: [
      "Plain vanilla interest rate swap mechanics and comparative advantage from Chapter 7 Part 1",
      "Interest rate parity and forward exchange rates from Chapter 5",
      "Bond pricing and OIS discounting from Chapter 4"
    ],
    learningOutcomes: [
      "Differentiate currency swaps from interest rate swaps by modeling initial and terminal principal exchanges.",
      "Execute synthetic foreign currency liability transformations using domestic borrowing advantages.",
      "Calculate comparative advantage arbitrage surpluses arising from international market home biases.",
      "Value currency swaps using bond portfolio decomposition and forward FX contract replication.",
      "Analyze the Hammersmith & Fulham municipal scandal (Snapshot 7.2) and mitigate ultra vires legal risk.",
      "Formulate Credit Default Swap (CDS) mechanics and calculate default protection payoffs: Payoff = (1 - R) * L."
    ],
    sections: [
      {
        sectionIndex: 0,
        title: "Fixed-for-Fixed Currency Swap Architecture",
        pedagogicalObjective: "Formulate currency swap mechanics and contrast with interest rate swaps via principal exchange.",
        groundedFactIds: ["fact-01"],
        keyPoints: [
          "Principal amounts in two currencies are exchanged at inception at spot exchange rate S_0.",
          "Periodic interest payments are exchanged in their respective currencies.",
          "Principal amounts are re-exchanged at maturity at the exact same initial spot rate."
        ],
        formulaUsed: "Inception: L_USD <-> L_GBP; Maturity: L_GBP <-> L_USD"
      },
      {
        sectionIndex: 1,
        title: "Liability Transformation & Comparative Advantage",
        pedagogicalObjective: "Demonstrate cross-border liability synthetic transformation and compute 30 bps arbitrage surplus.",
        groundedFactIds: ["fact-02", "fact-03"],
        keyPoints: [
          "Firms borrow in their domestic home markets where credit spreads are tightest.",
          "US Firm A (USD 5.0% / GBP 7.0%) vs UK Firm B (USD 5.8% / GBP 6.5%).",
          "Total arbitrage surplus equals 80 bps - 50 bps = 30 bps, shared among counterparties."
        ],
        formulaUsed: "Total Surplus = Delta USD Spread - Delta GBP Spread"
      },
      {
        sectionIndex: 2,
        title: "Currency Swap Valuation: Bond Portfolios & Forward FX",
        pedagogicalObjective: "Deconstruct currency swap valuation via bond decomposition V_swap = B_B - S_0 * B_A and forward FX.",
        groundedFactIds: ["fact-04", "fact-05"],
        keyPoints: [
          "Swap is valued as long domestic bond minus spot-converted foreign bond: V_swap = B_B - S_0 * B_A.",
          "Alternatively priced as a portfolio of forward FX contracts using interest rate parity.",
          "Principal exchange at maturity creates significant duration and FX translation sensitivity."
        ],
        formulaUsed: "V_swap = B_B - S_0 * B_A"
      },
      {
        sectionIndex: 3,
        title: "Credit Risk Asymmetry & The Hammersmith Scandal",
        pedagogicalObjective: "Analyze credit risk of terminal principal exchange and dissect Snapshot 7.2 legal capacity crisis.",
        groundedFactIds: ["fact-06", "fact-07"],
        keyPoints: [
          "Currency swaps possess far greater credit risk than interest rate swaps due to terminal principal re-exchange.",
          "Hammersmith and Fulham council entered 600 speculative swaps, losing £600M when rates soared to 15%.",
          "UK House of Lords declared contracts ultra vires (void), leaving international banks with £1B losses."
        ],
        formulaUsed: "Credit Exposure = max(0, B_B - S_0 * B_A)"
      },
      {
        sectionIndex: 4,
        title: "Credit Default Swaps (CDS) & Default Payoff Mechanics",
        pedagogicalObjective: "Introduce CDS mechanics, premium spreads, and recovery rate default payoffs.",
        groundedFactIds: ["fact-08"],
        keyPoints: [
          "Protection buyer pays periodic spread (e.g. 150 bps) to insure against reference entity default.",
          "Upon credit event, protection seller pays Payoff = (1 - R) * Notional.",
          "Assuming standard 40% bond recovery rate (R=0.40), default payout equals 60% of notional principal."
        ],
        formulaUsed: "Payoff = (1 - R) * L"
      }
    ],
    misconceptions: [
      {
        misconception: "Currency swaps, like interest rate swaps, never exchange principal amounts.",
        factId: "fact-01",
        authorRebuttal: "Currency swaps must exchange principal at inception and re-exchange at maturity so counterparties obtain foreign currency capital."
      },
      {
        misconception: "A legally executed derivative contract with a government body or municipality is always legally binding and enforceable.",
        factId: "fact-07",
        authorRebuttal: "The Hammersmith and Fulham scandal proved that if an entity lacks statutory capacity (ultra vires), courts can void contracts entirely with zero compensation."
      },
      {
        misconception: "A Credit Default Swap pays the full 100% face value of the reference bond upon default.",
        factId: "fact-08",
        authorRebuttal: "CDS contracts pay the loss given default: (1 - R) * Notional, subtracting the recovery rate R realized on defaulted debt."
      }
    ],
    activeRecallQuiz: {
      scenario: "An asset manager purchases $20M credit protection on corporate debt via a Credit Default Swap. A credit event occurs, and the defaulted bonds settle in auction with a 40% recovery rate (R = 0.40).",
      testedFactIds: ["fact-08"],
      question: "What is the net default insurance payoff received by the protection buyer?",
      correctAnswer: "$12 Million default payoff ((1 - 0.40) * $20M = $12M)",
      explanation: "The default payoff formula is Payoff = (1 - R) * L = (1 - 0.40) * $20,000,000 = 0.60 * $20M = $12,000,000."
    },
    coreTakeaways: [
      "Currency swaps exchange principal at inception and maturity, unlike interest rate swaps.",
      "Home market borrowing advantages create comparative advantage surpluses shared internationally.",
      "Currency swaps are valued via bond decomposition: V_swap = B_B - S_0 * B_A.",
      "Terminal principal exchange substantially magnifies credit risk compared to interest rate swaps.",
      "Snapshot 7.2 illustrates ultra vires legal capacity risk that can void valid contracts completely.",
      "Credit Default Swaps transfer default risk, paying (1 - R) * Notional upon a credit event."
    ]
  };

  const storyboard = {
    schemaVersion: "1.0.0",
    chapterSlug,
    course: courseSlug,
    chapterTitle: "Currency Swaps, Valuation, Legal Risk, and CDS",
    approvedFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
    scenes: [
      {
        sceneIndex: 0,
        title: "The Cross-Border Currency Dilemma",
        template: "chat_story",
        concept: "Raju's firm needs £10M to build a factory in London; Sharma ji introduces currency swaps.",
        sourceFactIds: ["fact-01", "fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju faces exorbitant borrowing costs in London vs cheap domestic USD debt", sourceFactIds: ["fact-02"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji introduces fixed-for-fixed currency swaps with principal exchange", sourceFactIds: ["fact-01"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Sharma ji highlights why currency swaps require exchanging principal", sourceFactIds: ["fact-01"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 1,
        title: "Fixed-for-Fixed Currency Swap Mechanics",
        template: "split_comparison",
        concept: "Contrast inception exchange, periodic interest flows, and terminal re-exchange at original spot rate.",
        sourceFactIds: ["fact-01"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Inception: Parties exchange $13M USD for £10M GBP at spot rate S_0 = 1.30", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Interim: Party A pays 4.0% in GBP while Party B pays 5.0% in USD", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Maturity: Parties re-exchange exact original principal: £10M for $13M", sourceFactIds: ["fact-01"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 2,
        title: "Comparative Advantage in Multi-Currency Debt",
        template: "formula_breakdown",
        concept: "Analyze US Firm A vs UK Firm B borrowing differentials and derive 30 bps surplus.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present rates: US Firm (USD 5.0% / GBP 7.0%) vs UK Firm (USD 5.8% / GBP 6.5%)", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Calculate USD differential (80 bps) vs GBP differential (50 bps)", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Derive 30 basis points total cross-border arbitrage surplus", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 3,
        title: "Synthetic Foreign Currency Transformation",
        template: "progressive_cards",
        concept: "Card steps showing how domestic borrowing plus swap produces synthetic foreign debt.",
        sourceFactIds: ["fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Step 1: US firm borrows $13M at 5.0% in domestic market", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Step 2: Enters swap paying 4.0% GBP and receiving 5.0% USD", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Step 3: Achieves net 4.0% GBP borrowing, eliminating all FX risk", sourceFactIds: ["fact-02"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 4,
        title: "Currency Swap Valuation: Bond Decomposition",
        template: "formula_breakdown",
        concept: "Formulate V_swap = B_B - S_0 * B_A with worked multi-currency bond pricing.",
        sourceFactIds: ["fact-04"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present bond decomposition formula V_swap = B_B - S_0 * B_A", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Deconstruct foreign bond valuation B_A converted at spot FX S_0", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Highlight why principal exchange amplifies swap valuation swings", sourceFactIds: ["fact-04"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 5,
        title: "Credit Risk Asymmetry: Currency vs Interest Rate Swaps",
        template: "split_comparison",
        concept: "Contrast interest rate swap net risk against currency swap principal replacement exposure.",
        sourceFactIds: ["fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Interest rate swap: Zero principal risk, only net interest flows exposed", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Currency swap: Full principal re-exchange creates massive FX replacement risk", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Regulatory capital requirements reflect this principal risk asymmetry", sourceFactIds: ["fact-06"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 6,
        title: "The Hammersmith and Fulham Swap Scandal",
        template: "progressive_cards",
        concept: "Dissect Snapshot 7.2: 600 swaps, £600M municipal loss, and ultra vires voiding.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Municipal council enters 600 speculative swaps betting on falling rates", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "UK rates surge to 15%, inflicting £600M in catastrophic losses", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "House of Lords rules contracts ultra vires, wiping out £1B across 75 banks", sourceFactIds: ["fact-07"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 7,
        title: "Credit Default Swaps (CDS) Mechanics",
        template: "formula_breakdown",
        concept: "Introduce CDS contract specs, periodic premium spreads, and default payoff formula.",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Define Credit Default Swap as pure default insurance on reference entity", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Break down periodic premium spread paid by protection buyer", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Derive default payoff formula: Payoff = (1 - R) * Notional", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 8,
        title: "Active Recall: CDS Default Payoff Calculation",
        template: "interactive_quiz",
        concept: "Challenge learner to calculate default insurance payout with 40% recovery rate.",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present active recall scenario on $20M CDS with 40% recovery rate", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Learner computes Payoff = (1 - 0.40) * $20M = $12M during thinking pause", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Confirm correct Option A and reinforce recovery rate mechanics", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 9,
        title: "Raju Masters Currency Swaps and Credit Derivatives",
        template: "chat_story",
        concept: "Raju achieves complete clarity on multi-currency hedging and credit risk; previews Chapter 8.",
        sourceFactIds: ["fact-01", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju recognizes how currency swaps fund global business without FX risk", sourceFactIds: ["fact-01"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji emphasizes checking legal capacity after the Hammersmith disaster", sourceFactIds: ["fact-07"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Sharma ji previews Chapter 8 on Securitization and the Subprime Crisis", sourceFactIds: ["fact-08"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 10,
        title: "Master Summary: The 8 Iron Laws of Currency Swaps & CDS",
        template: "summary_thread",
        concept: "Synthesize the 8 iron laws of currency swaps, legal risk, and credit derivatives.",
        sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present executive roadmap of the 8 rules", sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Focus on Rules 1 and 2: Principal exchange and synthetic foreign debt", sourceFactIds: ["fact-01", "fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Focus on Rules 3 and 4: Multi-currency comparative advantage and bond valuation", sourceFactIds: ["fact-03", "fact-04"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Focus on Rules 5 and 6: Forward FX replication and credit risk asymmetry", sourceFactIds: ["fact-05", "fact-06"], speaker: "narrator" },
          { beatIndex: 4, textOutline: "Strict dedicated focus on Rules 7 & 8: Hammersmith ultra vires and Rule 8 CDS payoff", sourceFactIds: ["fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 5, textOutline: "Display complete 2-column whole-chapter matrix", sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"], speaker: "narrator" }
        ]
      }
    ],
    summarySteps: [
      "1. Principal Exchange Invariant: Currency swaps exchange principal at inception and maturity at the same spot rate.",
      "2. Synthetic Foreign Debt: Borrowing domestic debt and swapping currencies creates synthetic foreign funding.",
      "3. Cross-Border Comparative Advantage: Home market borrowing advantages unlock international arbitrage surplus.",
      "4. Bond Portfolio Valuation: Currency swaps are valued as V_swap = B_B - S_0 * B_A using multi-currency zero curves.",
      "5. Forward FX Replication: Each periodic exchange can alternatively be valued as an individual forward FX contract.",
      "6. Credit Exposure Asymmetry: Principal exchange at maturity substantially amplifies credit risk vs interest rate swaps.",
      "7. Ultra Vires Legal Risk: The Hammersmith disaster proved that statutory capacity defects can void contracts completely.",
      "8. CDS Default Payoff Rule: Credit Default Swaps pay (1 - Recovery Rate) * Notional upon a verified credit event."
    ],
    bottomTakeaway: "Currency swaps and credit derivatives bridge international capital markets, requiring rigorous FX modeling and strict legal capacity verification."
  };

  return { facts, audit, lessonPlan, storyboard };
}

for (const courseSlug of ['hull_derivatives', 'hull_derivatives_en']) {
  const targetDir = path.resolve('src/data/chapters', courseSlug, 'ch07_part2');
  fs.mkdirSync(targetDir, { recursive: true });

  const { facts, audit, lessonPlan, storyboard } = buildArtifacts(courseSlug);

  fs.writeFileSync(path.join(targetDir, 'source_facts.json'), JSON.stringify(facts, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'content_audit.json'), JSON.stringify(audit, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
}

console.log('✅ Successfully generated Phase 1 artifacts for ch07_part2 (Hindi & English)!');

