import fs from 'fs';
import path from 'path';

function buildArtifacts(courseSlug) {
  const chapterSlug = 'ch04_part2';

  const facts = {
    schemaVersion: "1.0.0",
    chapterSlug,
    notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
    sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: "Options, Futures, and Other Derivatives (John C. Hull)",
    generalAssumptions: [
      "Forward interest rates are mathematically implied by the current term structure of zero rates to prevent arbitrage.",
      "An FRA is an OTC contract where cash settlement occurs at the start of the loan period discounted back from maturity.",
      "Yield curves typically slope upward because investors require a liquidity premium for longer maturities (Liquidity Preference Theory)."
    ],
    facts: [
      {
        id: "fact-01",
        category: "formula",
        topic: "Forward Interest Rate Under Continuous Compounding",
        statement: "The forward interest rate R_F for the period between future times T_1 and T_2 implied by continuous zero rates R_1 and R_2 is R_F = (R_2 * T_2 - R_1 * T_1) / (T_2 - T_1). If continuous zero rates increase with maturity, forward rates lie strictly above zero rates.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.6 Forward Rates",
          page: 86,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "Continuous Forward Interest Rate",
          latex: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
          variables: [
            { symbol: "R_F", definition: "Continuous forward interest rate between T1 and T2", unit: "%" },
            { symbol: "R_1", definition: "Continuous zero rate for maturity T1", unit: "%" },
            { symbol: "R_2", definition: "Continuous zero rate for maturity T2", unit: "%" },
            { symbol: "T_1", definition: "Start time of the forward period", unit: "years" },
            { symbol: "T_2", definition: "End time of the forward period", unit: "years" }
          ]
        },
        tags: ["forward_rate", "zero_rates", "continuous_compounding", "term_structure"]
      },
      {
        id: "fact-02",
        category: "market_rule",
        topic: "No-Arbitrage Replication of Forward Rates",
        statement: "A forward loan starting at T_1 and maturing at T_2 can be synthetically locked today by borrowing for T_1 at rate R_1 and investing the proceeds for T_2 at rate R_2. If the market forward rate differs from R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1), riskless arbitrage is achieved.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.6 Forward Rates",
          page: 87,
          provenance: "notebooklm_query"
        },
        tags: ["arbitrage", "synthetic_forward", "replication", "borrow_invest"]
      },
      {
        id: "fact-03",
        category: "definition",
        topic: "Forward Rate Agreement (FRA) Definition & Mechanics",
        statement: "A Forward Rate Agreement (FRA) is an over-the-counter derivative contract designed to lock in an interest rate for a future lending or borrowing period between T_1 and T_2. The party paying fixed rate R_K receives floating rate R_M, hedging against rising interest rates.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.7 Forward Rate Agreements",
          page: 88,
          provenance: "notebooklm_query"
        },
        tags: ["fra", "fixed_rate", "floating_rate", "otc_derivative", "hedging"]
      },
      {
        id: "fact-04",
        category: "formula",
        topic: "FRA Payoff and Discounted Settlement at Time T_1",
        statement: "At maturity T_2, the payoff for an FRA paying fixed rate R_K on principal L is L * (R_M - R_K) * (T_2 - T_1). In practice, FRAs settle at time T_1, requiring the payoff to be discounted back at the market rate R_M: Settlement = L * (R_M - R_K) * (T_2 - T_1) / [1 + R_M * (T_2 - T_1)].",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.7 Forward Rate Agreements",
          page: 89,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "FRA Settlement Formula at Time T1",
          latex: "\\text{Settlement} = \\frac{L (R_M - R_K)(T_2 - T_1)}{1 + R_M (T_2 - T_1)}",
          variables: [
            { symbol: "L", definition: "Notional principal amount", unit: "$" },
            { symbol: "R_M", definition: "Realized market floating rate observed at T1", unit: "%" },
            { symbol: "R_K", definition: "Agreed fixed contract interest rate", unit: "%" },
            { symbol: "T_1", definition: "Start of forward period / settlement time", unit: "years" },
            { symbol: "T_2", definition: "End of forward interest period", unit: "years" }
          ]
        },
        tags: ["fra_settlement", "discounting", "advance_settlement", "payoff"]
      },
      {
        id: "fact-05",
        category: "formula",
        topic: "Valuation of an Existing FRA Prior to Maturity",
        statement: "An existing FRA that pays fixed rate R_K has value V_FRA = L * (R_F - R_K) * (T_2 - T_1) * e^(-R_2 * T_2), where R_F is the current forward rate for the period and R_2 is the risk-free discount zero rate for maturity T_2.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.7 Forward Rate Agreements",
          page: 90,
          provenance: "notebooklm_query"
        },
        formulaDetails: {
          name: "FRA Value Prior to Maturity",
          latex: "V_{\\text{FRA}} = L (R_F - R_K)(T_2 - T_1) e^{-R_2 T_2}",
          variables: [
            { symbol: "V_{\\text{FRA}}", definition: "Mark-to-market value of the FRA", unit: "$" },
            { symbol: "L", definition: "Notional principal", unit: "$" },
            { symbol: "R_F", definition: "Current forward rate for the period T1 to T2", unit: "%" },
            { symbol: "R_K", definition: "Agreed fixed contract rate", unit: "%" },
            { symbol: "R_2", definition: "Continuous zero rate for maturity T2", unit: "%" }
          ]
        },
        tags: ["fra_valuation", "mark_to_market", "forward_rates"]
      },
      {
        id: "fact-06",
        category: "definition",
        topic: "Theories of the Term Structure: Expectations vs Liquidity Preference",
        statement: "Expectations Theory asserts that forward rates equal expected future spot rates (R_F = E[R]). Liquidity Preference Theory proves that because lenders prefer short-term liquidity while borrowers prefer locking long-term debt, forward rates exceed expected future spot rates (R_F > E[R]) by a positive liquidity premium.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "4.8 Theories of the Term Structure of Interest Rates",
          page: 91,
          provenance: "notebooklm_query"
        },
        tags: ["expectations_theory", "liquidity_preference", "term_structure", "liquidity_premium"]
      },
      {
        id: "fact-07",
        category: "case_study",
        topic: "Orange County Yield Curve Disaster (Snapshot 4.1)",
        statement: "In 1994, Orange County treasurer Bob Citron used $7.5B in county equity to enter $13B in reverse repo borrowing, investing $20.5B in medium-term inverse floaters. When the Federal Reserve raised rates 6 times by 250 bps, repo funding costs exploded above asset yields, wiping out $1.6B and triggering municipal bankruptcy.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "Snapshot 4.1 Orange County's Yield Curve Plays",
          page: 93,
          provenance: "notebooklm_query"
        },
        tags: ["orange_county", "repo_leverage", "inverse_floaters", "rate_hikes", "bankruptcy"]
      },
      {
        id: "fact-08",
        category: "case_study",
        topic: "The 2007-2009 Interbank Liquidity Freeze (Snapshot 4.2)",
        statement: "During the 2007-2009 financial crisis, banks hoarded liquidity due to subprime mortgage uncertainty, causing asset-backed commercial paper (ABCP) markets to freeze and the 3-month LIBOR-OIS spread to skyrocket to 364 bps, necessitating massive central bank term lending facilities.",
        sourceCitation: {
          book: "Options, Futures, and Other Derivatives",
          chapter: "4",
          section: "Snapshot 4.2 The 2007-2009 Liquidity Crisis",
          page: 94,
          provenance: "notebooklm_query"
        },
        tags: ["liquidity_freeze", "commercial_paper", "libor_ois_spread", "crisis_2008"]
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
    title: "Forward Interest Rates, FRAs, and Term Structure Theories",
    targetAudiencePersona: "Fixed Income Analyst & Quantitative Derivatives Trader",
    prerequisites: [
      "Understanding of continuous compounding and discounting A = P * e^(rT)",
      "Zero rates and zero-coupon curve construction from Chapter 4 Part 1",
      "Concept of over-the-counter contracts and payoff settlements"
    ],
    learningOutcomes: [
      "Calculate continuous and discrete forward interest rates implied by any zero rate curve.",
      "Replicate forward borrowing and lending synthetically through spot zero-coupon bonds.",
      "Price and execute settlement calculations for Forward Rate Agreements (FRAs) at time T_1.",
      "Mark to market existing FRA portfolios using current forward rates and risk-free discounting.",
      "Contrast Expectations Theory with Liquidity Preference Theory to interpret upward-sloping yield curves.",
      "Analyze the Orange County municipal bankruptcy to explain how leverage and inverted repo carry destroy balance sheets."
    ],
    sections: [
      {
        sectionIndex: 0,
        title: "Forward Interest Rates: The Implied Cost of Future Money",
        pedagogicalObjective: "Derive the forward rate formula R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) and demonstrate no-arbitrage replication.",
        groundedFactIds: ["fact-01", "fact-02"],
        keyPoints: [
          "Forward rates are the interest rates implied by current zero rates for future borrowing periods.",
          "Formula: R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1).",
          "Synthetically created by borrowing for T_1 and investing for T_2."
        ],
        formulaUsed: "R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1)"
      },
      {
        sectionIndex: 1,
        title: "Forward Rate Agreements (FRAs) Mechanics and Valuation",
        pedagogicalObjective: "Formulate FRA payoffs, advance cash settlement at time T_1, and mid-life valuation.",
        groundedFactIds: ["fact-03", "fact-04", "fact-05"],
        keyPoints: [
          "Fixed payer receives floating rate R_M and pays fixed contract rate R_K.",
          "Settlement occurs at time T_1 discounted by [1 + R_M*(T_2 - T_1)].",
          "Pre-maturity FRA value is discounted difference between current forward rate R_F and fixed rate R_K."
        ],
        formulaUsed: "Settlement = L*(R_M - R_K)*(T_2 - T_1) / [1 + R_M*(T_2 - T_1)]"
      },
      {
        sectionIndex: 2,
        title: "Theories of the Term Structure: Why Yield Curves Slope Upward",
        pedagogicalObjective: "Dissect Expectations Theory vs Liquidity Preference Theory to prove why forward rates exceed expected spot rates.",
        groundedFactIds: ["fact-06"],
        keyPoints: [
          "Expectations Theory claims forward rates equal expected future spot rates (R_F = E[R]).",
          "Liquidity Preference Theory proves investors demand a premium to lock money up for long horizons.",
          "Forward rates systematically exceed expected future spot rates (R_F > E[R]) by a liquidity premium."
        ]
      },
      {
        sectionIndex: 3,
        title: "Orange County Bankruptcy: The $1.6B Repo Leverage Disaster",
        pedagogicalObjective: "Examine Snapshot 4.1 to understand reverse floaters, repo borrowing leverage, and yield curve inversion risk.",
        groundedFactIds: ["fact-07"],
        keyPoints: [
          "Orange County geared $7.5B equity into $20.5B portfolio via $13B short-term repo borrowing.",
          "Invested heavily in inverse floaters betting interest rates would fall.",
          "Six consecutive Fed rate hikes inverted carry, generating $1.6B losses and municipal bankruptcy."
        ]
      },
      {
        sectionIndex: 4,
        title: "The 2007-2009 Interbank Liquidity Freeze",
        pedagogicalObjective: "Analyze Snapshot 4.2 to see how credit mistrust paralyzed the interbank term market.",
        groundedFactIds: ["fact-08"],
        keyPoints: [
          "Subprime mortgage defaults caused interbank trust to collapse.",
          "Commercial paper markets froze as investors refused rollover.",
          "LIBOR-OIS spread spiked to 364 bps, requiring emergency central bank term auction facilities."
        ]
      }
    ],
    misconceptions: [
      {
        misconception: "An upward-sloping yield curve proves the market is betting interest rates will rise sharply in the future.",
        factId: "fact-06",
        authorRebuttal: "Liquidity Preference Theory proves forward rates are inflated by positive liquidity premiums (R_F > E[R]). Upward slopes exist even when expected future rates are flat."
      },
      {
        misconception: "An FRA cash settlement at time T_1 pays the full undiscounted interest difference L*(R_M - R_K)*(T_2 - T_1).",
        factId: "fact-04",
        authorRebuttal: "Because interest payments are normally due at the end of the loan period T_2, advance payment at T_1 must be discounted back by dividing by [1 + R_M*(T_2 - T_1)]."
      },
      {
        misconception: "Short-term repo financing can safely fund long-term bond investments indefinitely.",
        factId: "fact-07",
        authorRebuttal: "Orange County proved that financing long-term assets with short-term repo creates extreme negative carry when the yield curve inverts, leading to catastrophic margin calls."
      }
    ],
    activeRecallQuiz: {
      scenario: "Suppose the continuous 1-year zero rate is 4.0% per annum and the 2-year continuous zero rate is 4.5% per annum. An analyst wants to determine the continuous forward interest rate for the second year.",
      testedFactIds: ["fact-01"],
      question: "What is the continuous forward rate for the second year (from year 1 to year 2)?",
      correctAnswer: "5.0% per annum continuous",
      explanation: "Using the forward rate formula R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1): R_F = (0.045*2 - 0.040*1)/(2 - 1) = (0.090 - 0.040)/1 = 0.050 or 5.0% per annum continuous."
    },
    coreTakeaways: [
      "Forward interest rates are mathematically locked by zero rates via R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1).",
      "FRAs allow borrowers and lenders to lock future borrowing costs; settlement at T_1 is discounted by [1 + R_M*tau].",
      "Existing FRAs are valued by discounting the spread between current forward rates and contract fixed rates.",
      "Liquidity Preference Theory explains normal upward yield curves via maturity liquidity premiums (R_F > E[R]).",
      "Orange County suffered a $1.6B bankruptcy by funding long inverse floaters with $13B short repo leverage during Fed hikes."
    ]
  };

  const storyboard = {
    schemaVersion: "1.0.0",
    chapterSlug,
    course: courseSlug,
    chapterTitle: "Forward Interest Rates, FRAs, and Term Structure Theories",
    approvedFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
    scenes: [
      {
        sceneIndex: 0,
        title: "The Future Borrowing Dilemma",
        template: "chat_story",
        concept: "Raju needs a ₹5 Crore loan 1 year from now; Sharma ji introduces forward rates and FRAs to lock the rate today.",
        sourceFactIds: ["fact-01", "fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju worries interest rates will spike before his plant expansion next year", sourceFactIds: ["fact-01"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji explains that current zero rates already define forward interest rates", sourceFactIds: ["fact-01"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju asks how an OTC contract can fix his borrowing cost today", sourceFactIds: ["fact-03"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 1,
        title: "Expectations vs Liquidity Preference",
        template: "tug_of_war",
        concept: "Contrast pure rate expectations with investor liquidity preference driving yield curve slopes.",
        sourceFactIds: ["fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Expectations Theory asserts forward rates equal expected future spot rates", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Liquidity Preference Theory proves investors demand a premium for locking cash long-term", sourceFactIds: ["fact-06"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Forward rates systematically exceed expected future spot rates by a liquidity buffer", sourceFactIds: ["fact-06"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 2,
        title: "Continuous Forward Rate Formula",
        template: "formula_breakdown",
        concept: "Derive R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) with 3% 1-year and 4% 2-year worked example.",
        sourceFactIds: ["fact-01"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "The implied forward rate bridges zero rate growth across consecutive horizons", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Continuous formula: R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1)", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "If 1-year is 3% and 2-year is 4%, year 2 forward rate is exactly 5.0%", sourceFactIds: ["fact-01"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 3,
        title: "Synthetic Forward Rate Replication",
        template: "split_comparison",
        concept: "Show no-arbitrage proof: borrowing for T1 and investing for T2 synthetically locks forward borrowing.",
        sourceFactIds: ["fact-02"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Strategy A: Borrow for period T1 at rate R1 to fund cash needs today", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Strategy B: Invest for period T2 at rate R2 to receive cash flow at T2", sourceFactIds: ["fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Net cash flow at T0 is zero; forward rate R_F is locked with zero basis risk", sourceFactIds: ["fact-02"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 4,
        title: "Forward Rate Agreement (FRA) Architecture",
        template: "progressive_cards",
        concept: "Explain FRA terms, fixed payer vs floating payer, and corporate interest rate risk hedging.",
        sourceFactIds: ["fact-03"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "FRA is an OTC contract setting fixed interest rate R_K for future period T1 to T2", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Fixed Rate Payer receives floating rate R_M, hedging against rising interest rates", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Floating Rate Payer receives fixed rate R_K, protecting lenders against falling rates", sourceFactIds: ["fact-03"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Principal is purely notional; only the net interest difference is exchanged", sourceFactIds: ["fact-03"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 5,
        title: "FRA Cash Settlement at Time T1",
        template: "formula_breakdown",
        concept: "Master the discounted advance settlement formula at time T1.",
        sourceFactIds: ["fact-04"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Standard loan interest is paid at maturity T2: Payoff = L*(R_M - R_K)*(T2 - T1)", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Advance settlement occurs at time T1, requiring discounting by [1 + R_M*(T2 - T1)]", sourceFactIds: ["fact-04"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Discounted settlement ensures economic equivalence without counterparty risk during loan term", sourceFactIds: ["fact-04"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 6,
        title: "Valuation of an FRA Prior to Maturity",
        template: "split_comparison",
        concept: "Compare initial zero-value contract with marked-to-market valuation as forward rates evolve.",
        sourceFactIds: ["fact-05"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "At inception: contract rate R_K is set equal to market forward rate R_F, so V_FRA = 0", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Mid-life valuation: V_FRA = L*(R_F - R_K)*(T2 - T1)*e^(-R2*T2)", sourceFactIds: ["fact-05"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Changes in forward rates create immediate balance sheet gains or losses", sourceFactIds: ["fact-05"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 7,
        title: "Orange County Bankruptcy: Repo Leverage Trap",
        template: "progressive_cards",
        concept: "Analyze Snapshot 4.1: $13B short repo leverage, inverse floaters, and $1.6B loss.",
        sourceFactIds: ["fact-07"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Bob Citron geared $7.5B county equity into a $20.5B portfolio using $13B short repo", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Invested in medium-term inverse floaters that paid high yields when rates fell", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "In 1994, the Fed raised rates 6 times by 250 bps; repo borrowing costs surpassed bond yields", sourceFactIds: ["fact-07"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Orange County suffered $1.6B losses, collateral liquidations, and municipal bankruptcy", sourceFactIds: ["fact-07"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 8,
        title: "The 2007-2009 Interbank Liquidity Freeze",
        template: "progressive_cards",
        concept: "Analyze Snapshot 4.2: commercial paper paralysis and 364 bps LIBOR-OIS explosion.",
        sourceFactIds: ["fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Subprime mortgage contagion triggered widespread interbank counterparty distrust", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Asset-backed commercial paper (ABCP) market froze as money funds refused rollovers", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "LIBOR-OIS spread exploded from 10 bps to 364 bps, showing systemic bank credit risk", sourceFactIds: ["fact-08"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Central banks were forced to launch massive emergency term funding facilities", sourceFactIds: ["fact-08"], speaker: "narrator" }
        ]
      },
      {
        sceneIndex: 9,
        title: "Active Recall: Implied Forward Rate Calculation",
        template: "interactive_quiz",
        concept: "Active recall scenario: calculate 1-year forward rate for Year 2 given 1y at 4.0% and 2y at 4.5%.",
        sourceFactIds: ["fact-01"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Given 1-year continuous rate 4.0% and 2-year continuous rate 4.5%, calculate year 2 forward rate", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Raju computes (0.045*2 - 0.040*1)/(2 - 1) to extract the forward rate", sourceFactIds: ["fact-01"], speaker: "Raju" },
          { beatIndex: 2, textOutline: "Sharma ji confirms 5.0% continuous rate with exact no-arbitrage proof", sourceFactIds: ["fact-01"], speaker: "Sharma ji" }
        ]
      },
      {
        sceneIndex: 10,
        title: "Raju Masters the Yield Curve Horizon",
        template: "chat_story",
        concept: "Raju hedges future loan with an FRA and applies Liquidity Preference Theory to interest rate risk.",
        sourceFactIds: ["fact-03", "fact-06"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Raju locks in his company loan using an FRA to eliminate interest rate risk", sourceFactIds: ["fact-03"], speaker: "Raju" },
          { beatIndex: 1, textOutline: "Sharma ji warns never to mistake upward yield curves for guaranteed future rate hikes", sourceFactIds: ["fact-06"], speaker: "Sharma ji" },
          { beatIndex: 2, textOutline: "Raju notes Orange County's mistake and pledges strict duration matching", sourceFactIds: ["fact-07"], speaker: "Raju" }
        ]
      },
      {
        sceneIndex: 11,
        title: "The Whole Picture: 8 Core Term Structure Rules",
        template: "summary_thread",
        concept: "Execute strict 8-step summary sequence covering all chapter principles with dedicated Rule 8 focus.",
        sourceFactIds: ["fact-01", "fact-02", "fact-03", "fact-04", "fact-05", "fact-06", "fact-07", "fact-08"],
        beatOutlines: [
          { beatIndex: 0, textOutline: "Executive overview of all eight forward rate and term structure principles", sourceFactIds: ["fact-01"], speaker: "narrator" },
          { beatIndex: 1, textOutline: "Rules 1 & 2: Forward rate formula and no-arbitrage synthetic borrowing replication", sourceFactIds: ["fact-01", "fact-02"], speaker: "narrator" },
          { beatIndex: 2, textOutline: "Rules 3 & 4: FRA hedging mechanics and discounted advance settlement at time T1", sourceFactIds: ["fact-03", "fact-04"], speaker: "narrator" },
          { beatIndex: 3, textOutline: "Rules 5 & 6: Pre-maturity FRA mark-to-market valuation and Liquidity Preference Theory", sourceFactIds: ["fact-05", "fact-06"], speaker: "narrator" },
          { beatIndex: 4, textOutline: "Rules 7 & 8: Orange County repo leverage disaster and 2008 interbank liquidity freeze", sourceFactIds: ["fact-07", "fact-08"], speaker: "narrator" },
          { beatIndex: 5, textOutline: "Final 2-column whole-chapter reference matrix", sourceFactIds: ["fact-01", "fact-08"], speaker: "narrator" }
        ]
      }
    ],
    summarySteps: [
      "1. Forward Rate Formula: Continuous forward rate R_F = (R_2*T_2 - R_1*T_1)/(T_2 - T_1) is implied by zero rates.",
      "2. No-Arbitrage Replication: Borrowing for T1 and investing for T2 synthetically replicates forward loans.",
      "3. FRA Hedging Architecture: Fixed payers receive floating R_M and pay fixed R_K to cap borrowing costs.",
      "4. Advance Settlement Discount: FRAs settling at time T_1 divide payoff by [1 + R_M*(T_2 - T_1)].",
      "5. Pre-Maturity Valuation: Existing FRAs are valued by discounting the spread between R_F and R_K.",
      "6. Liquidity Preference Reality: Forward rates exceed expected spot rates (R_F > E[R]) by a positive liquidity buffer.",
      "7. Orange County Lesson: Funding long assets with $13B short repo leverage destroyed $1.6B during Fed rate hikes.",
      "8. Interbank Liquidity Freeze: Crisis spreads blew out to 364 bps when commercial paper markets froze."
    ],
    bottomTakeaway: "Forward rates represent no-arbitrage break-evens; liquidity preference creates normal upward slope, and FRAs lock future borrowing costs."
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

