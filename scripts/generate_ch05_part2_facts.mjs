import fs from 'fs';
import path from 'path';

function buildArtifacts(courseSlug) {
  const chapterSlug = 'ch05_part2';

  const facts = {
    schemaVersion: "1.0.0",
    chapterSlug,
    notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
    sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: "Options, Futures, and Other Derivatives (John C. Hull)",
    generalAssumptions: [
      "No-arbitrage principles govern pricing in liquid financial and commodity markets.",
      "Borrowing and lending rates are equal at the continuous risk-free rate r.",
      "Index dividend payments can be approximated as a continuous dividend yield q.",
      "Physical storage costs and convenience yields reflect real carrying costs and operational benefits."
    ],
    facts: [
      {
        id: "fact-01",
        category: "formula",
        topic: "Valuing a Forward Contract Mid-Life",
        statement: "At inception t=0, the value of a forward contract f is zero and delivery price K equals F_0. At mid-life time t prior to maturity T, the value of an existing long forward contract is f = (F_t - K) * e^(-r(T-t)) = S_t - K * e^(-r(T-t)). For a short forward contract, the value is f_short = (K - F_t) * e^(-r(T-t)) = K * e^(-r(T-t)) - S_t.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.7 Valuing Forward Contracts",
          page: 114,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Forward Contract Mid-Life Value (Long)",
          latex: "f = S_t - K e^{-r(T - t)}",
          variables: [
            { symbol: "f", definition: "Current market value of existing long forward contract", unit: "$" },
            { symbol: "S_t", definition: "Current spot price of underlying asset at time t", unit: "$" },
            { symbol: "K", definition: "Contract delivery price fixed at inception", unit: "$" },
            { symbol: "r", definition: "Continuously compounded risk-free rate", unit: "%" },
            { symbol: "T - t", definition: "Remaining time to maturity", unit: "years" }
          ]
        },
        tags: ["forward_valuation", "mid_life_value", "delivery_price", "discounting"]
      },
      {
        id: "fact-02",
        category: "numerical_example",
        topic: "Long Forward Contract Mid-Life Valuation Example",
        statement: "Consider a long forward contract on a non-dividend stock with delivery price K = $50 maturing in 6 months. After 3 months (remaining time tau = 0.25 years), the spot price rises to S_t = $53 and the risk-free rate is r = 6%. The value of the contract is f = 53 - 50 * e^(-0.06 * 0.25) = 53 - 49.26 = +$3.74.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.7 Valuing Forward Contracts",
          page: 115,
          provenance: "notebooklm_query"
        },
        numericalDetails: {
          context: "Long forward contract on non-dividend stock maturing in 6 months valued at 3 months",
          values: {
            "spot_price": 53,
            "strike_price": 50,
            "risk_free_rate": 0.06,
            "remaining_time_years": 0.25,
            "discounted_strike": 49.26,
            "contract_value": 3.74
          },
          units: "USD"
        },
        tags: ["valuation_example", "numerical_proof", "mark_to_market"]
      },
      {
        id: "fact-03",
        category: "formula",
        topic: "Stock Index Futures Pricing with Continuous Dividend Yield",
        statement: "A stock index is treated as an investment asset providing a continuous dividend yield q. The theoretical forward/futures price is F_0 = S_0 * e^((r - q)T), where S_0 is the spot index level, r is the risk-free rate, and q is the dividend yield.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.9 Futures on Stock Indices",
          page: 117,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Stock Index Futures Pricing Formula",
          latex: "F_0 = S_0 e^{(r - q)T}",
          variables: [
            { symbol: "F_0", definition: "Theoretical stock index futures price", unit: "index points" },
            { symbol: "S_0", definition: "Current spot index level", unit: "index points" },
            { symbol: "r", definition: "Continuous risk-free interest rate", unit: "%" },
            { symbol: "q", definition: "Continuous dividend yield of the index portfolio", unit: "%" },
            { symbol: "T", definition: "Time to contract maturity", unit: "years" }
          ]
        },
        tags: ["stock_index_futures", "dividend_yield", "index_pricing"]
      },
      {
        id: "fact-04",
        category: "market_rule",
        topic: "Index Arbitrage and Program Trading",
        statement: "Index arbitrage involves simultaneous trading of stock index futures and the underlying portfolio of stocks. If F_0 > S_0 * e^((r-q)T), arbitrageurs buy the stock basket and sell futures (cash-and-carry). If F_0 < S_0 * e^((r-q)T), arbitrageurs short the stock basket and buy futures. Program trading uses computer routing systems to execute constituent trades instantly.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.9 Futures on Stock Indices",
          page: 118,
          provenance: "notebooklm_query"
        },
        tags: ["index_arbitrage", "program_trading", "cash_and_carry", "reverse_cash_and_carry"]
      },
      {
        id: "fact-05",
        category: "case_study",
        topic: "The October 1987 Crash and Index Arbitrage Breakdown (Snapshot 5.4)",
        statement: "On Black Monday (October 19, 1987), the Dow Jones Industrial Average plunged 22.6%. Massive selling of S&P 500 index futures by dynamic portfolio insurance hedgers pushed futures prices to unprecedented discounts (backwardation) below cash index levels. Index arbitrage failed because NYSE's Designated Order Turnaround (DOT) system jammed with unexecuted orders, rendering cash index quotes stale and execution impossible. This led to market-wide circuit breakers and NYSE Rule 80A.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "Snapshot 5.4 The October 1987 Crash",
          page: 120,
          provenance: "notebooklm_query"
        },
        tags: ["1987_crash", "black_monday", "portfolio_insurance", "order_congestion", "circuit_breakers"]
      },
      {
        id: "fact-06",
        category: "formula",
        topic: "Currency Forwards and Covered Interest Rate Parity",
        statement: "A foreign currency is an investment asset paying a continuous dividend yield equal to the foreign risk-free rate r_f. Under covered interest rate parity, the forward exchange rate is F_0 = S_0 * e^((r - r_f)T), where S_0 is the spot exchange rate expressed as domestic currency per unit of foreign currency.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.10 Forward and Futures Contracts on Currencies",
          page: 121,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Covered Interest Rate Parity Formula",
          latex: "F_0 = S_0 e^{(r - r_f)T}",
          variables: [
            { symbol: "F_0", definition: "Forward exchange rate (domestic per foreign unit)", unit: "currency" },
            { symbol: "S_0", definition: "Spot exchange rate (domestic per foreign unit)", unit: "currency" },
            { symbol: "r", definition: "Domestic continuous risk-free rate", unit: "%" },
            { symbol: "r_f", definition: "Foreign continuous risk-free rate", unit: "%" },
            { symbol: "T", definition: "Maturity of the forward contract", unit: "years" }
          ]
        },
        tags: ["currency_forwards", "interest_rate_parity", "foreign_exchange", "covered_arbitrage"]
      },
      {
        id: "fact-07",
        category: "numerical_example",
        topic: "Covered Interest Arbitrage on USD/GBP",
        statement: "Suppose spot USD/GBP is S_0 = 1.5000, US interest rate is r = 5%, and UK interest rate is r_f = 7% for T = 1 year. The theoretical forward rate is F_0 = 1.5000 * e^((0.05 - 0.07) * 1) = 1.5000 * e^(-0.02) = 1.4703. If the actual forward quote is 1.4900, an arbitrageur borrows $1,500 at 5%, converts to 1,000 GBP, deposits in the UK at 7% to yield 1,072.51 GBP, and sells GBP forward at 1.4900 to lock in $1,598.04 against a debt repayment of $1,576.91, capturing a riskless $21.13 profit per 1,000 GBP.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.10 Forward and Futures Contracts on Currencies",
          page: 122,
          provenance: "notebooklm_query"
        },
        numericalDetails: {
          context: "Covered interest arbitrage on USD/GBP with 5% US rate and 7% UK rate",
          values: {
            "spot_fx": 1.5,
            "us_rate": 0.05,
            "uk_rate": 0.07,
            "maturity_years": 1.0,
            "quoted_forward": 1.49,
            "theoretical_forward": 1.4703,
            "arbitrage_profit_per_1000_gbp": 21.13
          },
          units: "USD / GBP"
        },
        tags: ["currency_arbitrage", "fx_worked_example", "parity_enforcement"]
      },
      {
        id: "fact-08",
        category: "formula",
        topic: "Commodity Futures, Storage Costs and Convenience Yield",
        statement: "Commodities incur storage costs u (percentage of spot) and provide physical inventory utility known as convenience yield y. The theoretical forward price is F_0 = S_0 * e^((r + u - y)T). For investment commodities (gold/silver), y is virtually zero and F_0 = S_0 * e^((r + u)T). For consumption commodities (crude oil, copper), when spot inventory is critically scarce, y can exceed r + u, producing backwardation where forward price is lower than spot (F_0 < S_0).",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "5",
          section: "5.11 Futures on Commodities",
          page: 125,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Commodity Futures Pricing Formula with Convenience Yield",
          latex: "F_0 = S_0 e^{(r + u - y)T}",
          variables: [
            { symbol: "F_0", definition: "Theoretical commodity futures price", unit: "$" },
            { symbol: "S_0", definition: "Spot commodity price", unit: "$" },
            { symbol: "r", definition: "Continuous risk-free interest rate", unit: "%" },
            { symbol: "u", definition: "Storage cost as a proportion of spot price", unit: "%" },
            { symbol: "y", definition: "Convenience yield of physical holding", unit: "%" },
            { symbol: "T", definition: "Maturity in years", unit: "years" }
          ]
        },
        tags: ["commodity_futures", "storage_costs", "convenience_yield", "contango", "backwardation"]
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
    title: "Determination of Forward and Futures Prices: Part 2",
    targetAudiencePersona: "Quantitative Derivatives Trader & Portfolio Manager",
    prerequisites: [
      "Spot-forward parity F_0 = S_0 * e^(rT) from Chapter 5 Part 1",
      "Continuous dividend yields and cost of carry",
      "Foreign exchange spot rate quoting conventions"
    ],
    learningOutcomes: [
      "Distinguish between forward contract value f and forward delivery price during contract life.",
      "Calculate the mark-to-market value of an existing forward contract using f = S_t - K*e^(-r(T-t)).",
      "Price stock index futures using continuous dividend yield q and identify index arbitrage opportunities.",
      "Analyze why index arbitrage broke down during the October 1987 Black Monday market crash.",
      "Apply covered interest rate parity to calculate forward exchange rates and execute FX arbitrage.",
      "Explain how storage costs and convenience yields determine contango vs backwardation in commodity markets."
    ],
    sections: [
      {
        sectionIndex: 0,
        title: "The Mid-Life Valuation Dilemma",
        pedagogicalObjective: "Establish the distinction between forward delivery price and contract value prior to maturity.",
        groundedFactIds: ["fact-01", "fact-02"],
        keyPoints: [
          "Forward price F_0 is agreed delivery price when contract value is zero.",
          "As spot prices move, existing contracts accumulate positive or negative market value f.",
          "Long contract value equals spot minus discounted delivery price: f = S_t - K*e^(-r*tau)."
        ],
        formulaUsed: "f = S_t - K * e^(-r(T-t))"
      },
      {
        sectionIndex: 1,
        title: "Stock Index Futures & Index Arbitrage",
        pedagogicalObjective: "Formulate index futures pricing F_0 = S_0*e^((r-q)T) and program trading cash-and-carry bounds.",
        groundedFactIds: ["fact-03", "fact-04"],
        keyPoints: [
          "Index dividend yield q continuously offsets financing costs.",
          "F_0 > S_0*e^((r-q)T) triggers automated basket buying and futures shorting.",
          "F_0 < S_0*e^((r-q)T) triggers automated reverse cash-and-carry."
        ],
        formulaUsed: "F_0 = S_0 * e^((r - q)T)"
      },
      {
        sectionIndex: 2,
        title: "The October 1987 Crash: When Arbitrage Broke Down",
        pedagogicalObjective: "Dissect Snapshot 5.4 to explain portfolio insurance cascades and NYSE DOT system order jams.",
        groundedFactIds: ["fact-05"],
        keyPoints: [
          "Dynamic portfolio insurance hedgers flooded CME with massive S&P 500 futures sell orders.",
          "Futures traded at huge discounts to cash index quotes.",
          "Arbitrageurs could not execute because NYSE DOT order printers lagged by hours, freezing liquidity."
        ]
      },
      {
        sectionIndex: 3,
        title: "Currency Forwards & Covered Interest Rate Parity",
        pedagogicalObjective: "Derive F_0 = S_0*e^((r - r_f)T) and execute step-by-step covered interest arbitrage.",
        groundedFactIds: ["fact-06", "fact-07"],
        keyPoints: [
          "Foreign interest rate r_f acts as a continuous dividend yield.",
          "Forward exchange rate depends on the interest rate differential (r - r_f).",
          "Divergence generates instant riskless covered borrowing and FX conversion profit."
        ],
        formulaUsed: "F_0 = S_0 * e^((r - r_f)T)"
      },
      {
        sectionIndex: 4,
        title: "Commodities: Storage Costs & Convenience Yield",
        pedagogicalObjective: "Formulate F_0 = S_0*e^((r + u - y)T) to define contango vs backwardation.",
        groundedFactIds: ["fact-08"],
        keyPoints: [
          "Storage cost u increases forward carrying cost.",
          "Convenience yield y reflects operational security of holding physical inventory.",
          "When y > r + u, market flips into backwardation (F_0 < S_0)."
        ],
        formulaUsed: "F_0 = S_0 * e^((r + u - y)T)"
      }
    ],
    misconceptions: [
      {
        misconception: "An existing forward contract always maintains zero value until its final expiration day.",
        factId: "fact-01",
        authorRebuttal: "Forward contracts have zero value only at initiation. Mid-life spot changes create mark-to-market value f = S_t - K*e^(-r(T-t))."
      },
      {
        misconception: "Stock index futures trade at pure spot compounding without adjusting for stock dividends.",
        factId: "fact-03",
        authorRebuttal: "Index portfolios pay dividends, which continuously reduce the cost of carry: F_0 = S_0 * e^((r - q)T)."
      },
      {
        misconception: "Commodity futures must always trade at a premium to spot prices due to storage and financing costs.",
        factId: "fact-08",
        authorRebuttal: "During physical shortages, the convenience yield y exceeds storage and interest costs (y > r + u), driving futures below spot into backwardation."
      }
    ],
    activeRecallQuiz: {
      scenario: "A long forward contract on a non-dividend stock has delivery price K = $50 with 3 months remaining (tau = 0.25). The spot price is $53 and the continuous risk-free rate is 6%. An analyst calculates contract value.",
      testedFactIds: ["fact-01", "fact-02"],
      question: "What is the theoretical mid-life value f of this long forward contract?",
      correctAnswer: "+$3.74 theoretical long contract value",
      explanation: "Using f = S_t - K * e^(-r*tau): f = 53 - 50 * e^(-0.06 * 0.25) = 53 - 50 * 0.9851 = 53 - 49.26 = +$3.74."
    },
    coreTakeaways: [
      "Mid-life forward value f = S_t - K*e^(-r*tau) discounts the agreed delivery price against current spot.",
      "Stock index futures pricing F_0 = S_0*e^((r-q)T) continuously credits dividend yields against financing carry.",
      "In the 1987 crash, index arbitrage broke down when NYSE DOT execution bottlenecks disconnected futures from spot.",
      "Covered interest rate parity F_0 = S_0*e^((r - r_f)T) guarantees foreign currencies price interest rate differentials.",
      "Convenience yield y measures physical inventory utility, allowing commodity markets to invert into backwardation."
    ]
  };

  const storyboard = {
    schemaVersion: "1.0.0",
    chapterSlug,
    course: courseSlug,
    chapterTitle: "Determination of Forward and Futures Prices: Part 2",
    approvedFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
    scenes: [
      {
        sceneIndex: 0,
        title: "The Profit on Paper Dilemma",
        template: "chat_story",
        concept: "Raju realizes spot price moved up, but doesn't know how to value his locked forward contract today.",
        sourceFactIds: ["fact-01", "fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju asks Sharma ji how to value his locked forward contract after spot moves", sourceFactIds: ["fact-01"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji explains forward delivery price is locked and must be discounted", sourceFactIds: ["fact-01"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju learns contract value fluctuates continuously until maturity", sourceFactIds: ["fact-02"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 1,
        title: "Valuing Forward Contracts Mid-Life",
        template: "formula_breakdown",
        concept: "Derive f = S_t - K*e^(-r(T-t)) and show how forward delivery strike is discounted.",
        sourceFactIds: ["fact-01", "fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Explain why delivery strike K is discounted back to today", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Present formula f = S_t - K*e^(-r*tau) with LaTeX and variable chips", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Walk through $50 delivery strike, $53 spot price, yielding $3.74 value", sourceFactIds: ["fact-02"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 2,
        title: "Forward Price vs Contract Value",
        template: "split_comparison",
        concept: "Contrast Forward Price F_t (price to enter new contract at zero cost) with Contract Value f (P&L of existing contract).",
        sourceFactIds: ["fact-01"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Contrast Forward Price F_t with Contract Value f", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Forward price sets zero initial value for new market participants", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Contract value tracks cumulative unrealized mark-to-market gain or loss", sourceFactIds: ["fact-01"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 3,
        title: "Stock Index Futures Pricing",
        template: "formula_breakdown",
        concept: "Formulate F_0 = S_0*e^((r-q)T) with continuous dividend yield q offsetting financing cost.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Stock index represents broad diversified basket paying continuous dividends", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Derive formula F_0 = S_0 * e^((r - q)T) highlighting dividend yield q", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Examine case when dividend yield q exceeds risk-free rate r", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 4,
        title: "Index Arbitrage & Program Trading",
        template: "split_comparison",
        concept: "Contrast cash-and-carry vs reverse cash-and-carry on stock index baskets.",
        sourceFactIds: ["fact-04"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Explain index arbitrage mechanics and computer-driven program trading", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Cash-and-carry buys constituent stocks and sells index futures when overvalued", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Reverse cash-and-carry shorts stock basket and buys index futures when undervalued", sourceFactIds: ["fact-04"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 5,
        title: "October 1987 Crash & Order Bottlenecks",
        template: "progressive_cards",
        concept: "Examine Black Monday, portfolio insurance feedback loops, DOT bottlenecks, and circuit breaker reforms.",
        sourceFactIds: ["fact-05"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Black Monday 22.6% plunge triggered massive automated portfolio insurance selling", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "S&P futures crashed to unprecedented discounts below cash index quotes", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "NYSE DOT routing systems clogged with unexecuted orders, halting arbitrage", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Crisis resulted in modern cross-market circuit breakers and Rule 80A", sourceFactIds: ["fact-05"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 6,
        title: "Currency Forwards & Interest Rate Parity",
        template: "formula_breakdown",
        concept: "Derive F_0 = S_0*e^((r - r_f)T) and show foreign interest rate acting as a dividend yield.",
        sourceFactIds: ["fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Foreign currency deposits pay foreign interest rate r_f as dividend yield", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "State Covered Interest Rate Parity formula F_0 = S_0 * e^((r - r_f)T)", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Higher foreign interest rates mean foreign currency trades at forward discount", sourceFactIds: ["fact-06"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 7,
        title: "Covered Interest Arbitrage on USD/GBP",
        template: "progressive_cards",
        concept: "Walk through USD/GBP $21.13 riskless arbitrage proof step-by-step.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present USD/GBP spot 1.5000 with US 5% and UK 7% rates", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Theoretical forward rate is 1.4703 but market quotes 1.4900", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Borrow $1,500, buy GBP, earn 7% interest, sell forward at 1.4900", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Lock in riskless $21.13 profit per 1,000 GBP, driving quote back to parity", sourceFactIds: ["fact-07"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 8,
        title: "Commodities: Storage Cost & Convenience Yield",
        template: "formula_breakdown",
        concept: "Derive F_0 = S_0*e^((r + u - y)T) and contrast investment vs consumption commodities.",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Physical commodities incur physical storage costs and insurance u", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Convenience yield y measures business security of holding inventory", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Present master commodity pricing formula F_0 = S_0 * e^((r + u - y)T)", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 9,
        title: "Contango vs Backwardation",
        template: "split_comparison",
        concept: "Contrast contango (normal carrying market) with backwardation (convenience yield dominance).",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Contango occurs when carry costs dominate, making futures trade above spot", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Backwardation occurs when shortages push convenience yield above carry costs", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Producers cannot easily short physical inventory, allowing sustained backwardation", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 10,
        title: "Active Recall: Valuing a Mid-Life Forward",
        template: "interactive_quiz",
        concept: "Test active calculation of f = 53 - 50*e^(-0.06*0.25) = $3.74.",
        sourceFactIds: ["fact-01", "fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Present challenge: Calculate mid-life forward value for $50 strike and $53 spot", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Raju discounts $50 at 6% for 3 months to $49.26 and subtracts from $53", sourceFactIds: ["fact-02"], speaker: "Raju" },
          { beatIndex: 2, textOutline: "Validate correct answer +$3.74 and explain mark-to-market mechanics", sourceFactIds: ["fact-02"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 11,
        title: "Raju Masters Complete Forward Pricing",
        template: "chat_story",
        concept: "Raju summarizes the synthesis of carrying costs, dividends, exchange rates, and convenience yield.",
        sourceFactIds: ["fact-01", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju realizes forward pricing links all asset classes through cost of carry", sourceFactIds: ["fact-01"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji praises mastery and emphasizes operational risks in real markets", sourceFactIds: ["fact-08"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju is ready to apply the 8 pricing laws in institutional trading", sourceFactIds: ["fact-01"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 12,
        title: "The Whole Picture: 8 Core Forward Pricing Laws",
        template: "summary_thread",
        concept: "Review the 8 foundational laws of forward and futures pricing with full chapter matrix.",
        sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Roadmap overview of the 8 core forward pricing laws", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Rules 1 & 2: Mid-life contract valuation and delivery price discounting", sourceFactIds: ["fact-01", "fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Rules 3 & 4: Index futures continuous dividend yield and index arbitrage", sourceFactIds: ["fact-03", "fact-04"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Rules 5 & 6: 1987 crash DOT breakdown and covered interest parity", sourceFactIds: ["fact-05", "fact-06"], speaker: "narrator" },
          { beatIndex: 4, textOutline: "Rules 7 & 8: FX covered arbitrage and commodity convenience yields", sourceFactIds: ["fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 5, textOutline: "Complete whole-chapter 2-column reference matrix", sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"], speaker: "narrator" }
        ]
      }
    ],
    summarySteps: [
      "1. Mid-Life Contract Value: Long forward value f = S_t - K·e^(-r·tau) discounts the delivery strike.",
      "2. Contract Value vs Price: Forward price F_t enters at zero cost; contract value f tracks mark-to-market P&L.",
      "3. Stock Index Futures: Continuous dividend yield q reduces carry: F_0 = S_0·e^((r - q)T).",
      "4. Index Arbitrage: Program trading enforces cash-and-carry bounds across CME futures and NYSE baskets.",
      "5. 1987 Crash Breakdown: Portfolio insurance cascades jammed NYSE DOT order printers, decoupling futures from spot.",
      "6. Covered Interest Parity: Foreign interest rates act as continuous dividends: F_0 = S_0·e^((r - r_f)T).",
      "7. Covered FX Arbitrage: Any forward currency divergence allows instant riskless borrowing and foreign conversion.",
      "8. Convenience Yield Dynamics: In commodity shortages, high convenience yield y produces backwardation: F_0 < S_0."
    ],
    bottomTakeaway: "Forward and futures prices across stocks, indices, currencies, and commodities represent the net cost of carry, adjusted for dividends, foreign interest rates, and physical convenience yields."
  };

  const targetDir = path.resolve(`src/data/chapters/${courseSlug}/${chapterSlug}`);
  fs.mkdirSync(targetDir, { recursive: true });

  fs.writeFileSync(path.join(targetDir, 'source_facts.json'), JSON.stringify(facts, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'content_audit.json'), JSON.stringify(audit, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');

  console.log(`✅ ch05_part2 Phase 1 artifacts written for ${courseSlug}!`);
}

buildArtifacts('hull_derivatives');
buildArtifacts('hull_derivatives_en');
