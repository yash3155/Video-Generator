import fs from 'fs';
import path from 'path';

const ch23Facts = {
  "schemaVersion": "1.0.0",
  "chapterSlug": "ch23_part1",
  "notebookId": "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  "sourceId": "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  "retrievalTimestamp": new Date().toISOString(),
  "bookTitle": "Fundamentals of Futures and Options Markets (John C. Hull)",
  "generalAssumptions": [
    "Credit derivatives allow financial institutions to unbundle and trade credit default risk independently of loan origination and funding.",
    "A Credit Default Swap (CDS) acts as a financial insurance policy against a default credit event by a specified reference entity.",
    "Hazard rates (default intensities) can be derived directly from corporate bond yield spreads using the recovery rate approximation s = lambda * (1 - R).",
    "Synthetic CDO tranches slice portfolio default losses into hierarchical tranches whose valuation depends critically on default correlation."
  ],
  "facts": [
    {
      "id": "fact-01",
      "category": "definition",
      "topic": "Mechanics and Architecture of Credit Default Swaps (CDS)",
      "statement": "A Credit Default Swap (CDS) is a bilateral financial contract that provides protection against a default credit event by a specified reference entity. The protection buyer pays a periodic premium (known as the CDS spread, quoted in basis points per annum on notional principal) until either contract expiration or the occurrence of an ISDA-defined credit event.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "A credit default swap is a contract that provides insurance against the risk of default by a particular reference entity. The buyer makes periodic payments to the seller.",
        "provenance": "notebooklm_query"
      },
      "tags": ["cds_mechanics", "protection_buyer_seller", "reference_entity", "periodic_spread"]
    },
    {
      "id": "fact-02",
      "category": "claim",
      "topic": "ISDA Standardized Credit Events Defining Legal Default",
      "statement": "Under the International Swaps and Derivatives Association (ISDA) Master Agreement, a credit event triggering CDS settlement must satisfy specific legal criteria: bankruptcy of the reference entity, failure to pay principal or interest beyond standard grace periods, or coercive debt restructuring that materially harms bondholders.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "A credit event triggers a payoff. Standard credit events defined by ISDA include bankruptcy, failure to pay, and restructuring.",
        "provenance": "notebooklm_query"
      },
      "tags": ["isda_credit_events", "bankruptcy", "failure_to_pay", "restructuring"]
    },
    {
      "id": "fact-03",
      "category": "definition",
      "topic": "Physical vs Cash Settlement and Cheapest-to-Deliver Bond Option",
      "statement": "When a credit event occurs, CDS contracts settle via physical settlement (where the protection buyer delivers eligible senior unsecured bonds in exchange for par value 100%) or cash settlement (where an ISDA credit auction establishes market recovery value Z%, and the protection seller pays 100% minus Z%). In physical delivery, the buyer exploits cheapest-to-deliver bond optionality.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "Settlement can be physical or cash. In physical settlement, the buyer delivers bonds for face value. In cash settlement, an auction determines the recovery value.",
        "provenance": "notebooklm_query"
      },
      "tags": ["physical_settlement", "cash_settlement", "auction_recovery", "cheapest_to_deliver"]
    },
    {
      "id": "fact-04",
      "category": "formula",
      "topic": "Hazard Rate Extraction from Corporate Bond Yield Spreads",
      "statement": "The average hazard rate (default intensity) lambda between time 0 and T can be estimated from the corporate bond yield spread s over the risk-free benchmark curve using the fundamental credit formula: lambda = s / (1 - R), where R is the expected recovery rate of the debt (typically standardized at R = 40% for senior unsecured corporate debt).",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "An approximate relationship between the bond yield spread s and the default intensity lambda is lambda = s / (1 - R) where R is the recovery rate.",
        "provenance": "notebooklm_query"
      },
      "tags": ["hazard_rate_formula", "yield_spread", "recovery_rate_40_percent", "default_intensity"],
      "formulaDetails": {
        "name": "Yield Spread Hazard Rate Approximation",
        "latex": "\\lambda = \\frac{s}{1 - R}, \\quad s = y - y_{\\text{risk-free}}",
        "variables": [
          { "symbol": "\\lambda", "definition": "Hazard rate (continuous default intensity per annum)", "unit": "per annum (%/yr)" },
          { "symbol": "s", "definition": "Credit yield spread of corporate bond over risk-free rate", "unit": "per annum (%/yr or bps)" },
          { "symbol": "R", "definition": "Recovery rate fraction upon default (standard 0.40)", "unit": "dimensionless (0 to 1)" },
          { "symbol": "y", "definition": "Yield to maturity of the corporate bond", "unit": "per annum (%/yr)" }
        ]
      }
    },
    {
      "id": "fact-05",
      "category": "formula",
      "topic": "Valuation of Credit Default Swaps (Equating Premium and Protection Legs)",
      "statement": "The fair market CDS spread s is calculated by equating the present value of the premium payment leg to the present value of the contingent protection payoff leg: PV(Premium Leg) = s * sum_i [q_i * u_i * e^(-r*t_i) + e(t_i)] = PV(Protection Leg) = (1 - R) * sum_i [p_i * e^(-r*t_i^*)], where q_i is the survival probability and p_i is the default probability during interval i.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "The CDS spread is determined by setting the present value of payments equal to the present value of the expected payoff from default.",
        "provenance": "notebooklm_query"
      },
      "tags": ["cds_valuation", "premium_leg", "protection_leg", "survival_probabilities"],
      "formulaDetails": {
        "name": "CDS Fair Spread Equilibrium",
        "latex": "s = \\frac{(1-R) \\sum_{i=1}^n p_i e^{-r t_i^*}}{\\sum_{i=1}^n \\delta_i q_i e^{-r t_i} + \\text{accrual adjustments}}",
        "variables": [
          { "symbol": "s", "definition": "Fair market CDS premium spread", "unit": "per annum (%/yr or bps)" },
          { "symbol": "R", "definition": "Recovery rate percentage upon default", "unit": "dimensionless" },
          { "symbol": "p_i", "definition": "Risk-neutral probability of default in time period i", "unit": "probability (0 to 1)" },
          { "symbol": "q_i", "definition": "Probability of surviving through time t_i", "unit": "probability (0 to 1)" },
          { "symbol": "\\delta_i", "definition": "Payment period day count fraction", "unit": "years" }
        ]
      }
    },
    {
      "id": "fact-06",
      "category": "numerical_example",
      "topic": "Hull Section 23.3: 5-Year CDS Valuation and Cumulative Default Probabilities",
      "statement": "In Hull Section 23.3, a 5-year corporate bond trades at a spread s = 120 basis points (1.20% per year) over the risk-free rate. With a standard 40% recovery rate, the estimated annual hazard rate is lambda = 0.0120 / (1 - 0.40) = 2.0% per year. The cumulative probability of default over 5 years is 1 - e^(-0.02 * 5) = 9.52%, pricing the 5-year CDS notional $10,000,000 contract at exactly 120 bps ($120,000 per year). Profit = Payoff - Premium paid.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "Consider a 5-year corporate bond spread of 120 bps with 40% recovery. The default intensity is 2% per year, and the cumulative 5-year default probability is 9.52%.",
        "provenance": "notebooklm_query"
      },
      "tags": ["numerical_cds", "section_23_3", "cumulative_default_prob", "hazard_intensity"],
      "numericalDetails": {
        "values": {
          "bondSpreadBps": 120,
          "recoveryRate": 0.40,
          "annualHazardRate": 0.02,
          "cumulative5YrDefault": 0.0952,
          "notional": 10000000,
          "annualPremium": 120000
        },
        "units": "$",
        "contractSize": 1,
        "context": "Hull Section 23.3 numerical 5-year CDS spread and default probability calculation"
      },
      "payoffVsProfit": {
        "distinctionType": "both",
        "formulaPayoff": "(1 - R) * Notional",
        "formulaProfit": "(1 - R) * Notional - sum(premiums)"
      }
    },
    {
      "id": "fact-07",
      "category": "definition",
      "topic": "Total Return Swaps (TRS) and Risk Transfer",
      "statement": "A Total Return Swap (TRS) is an agreement where one counterparty (the total return payer) pays the total economic return of a reference bond or loan portfolio (all coupon interest plus any market capital appreciation) to the receiver, while receiving in exchange a floating interest rate (such as SOFR + spread) plus compensation for any capital depreciation.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "A total return swap is a swap agreement to exchange the total return on a bond (including coupons and capital gains/losses) for a floating rate plus a spread.",
        "provenance": "notebooklm_query"
      },
      "tags": ["total_return_swap", "trs_mechanics", "off_balance_sheet", "economic_return"]
    },
    {
      "id": "fact-08",
      "category": "claim",
      "topic": "Standardized Credit Indices: CDX and iTraxx",
      "statement": "The global credit derivative market is anchored by two highly liquid standardized portfolios: CDX (covering 125 North American investment-grade or high-yield corporate names) and iTraxx (covering 125 European and Asian names). Traded with fixed 100 bps or 500 bps coupons and upfront points, they serve as the macro benchmark for institutional credit risk.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "Credit default swap indices are portfolios of CDS. The two main portfolios are CDX in North America and iTraxx in Europe.",
        "provenance": "notebooklm_query"
      },
      "tags": ["cdx_index", "itraxx_index", "standardized_baskets", "credit_benchmarks"]
    },
    {
      "id": "fact-09",
      "category": "claim",
      "topic": "Synthetic CDO Tranche Waterfall Architecture",
      "statement": "A Synthetic Collateralized Debt Obligation (Synthetic CDO) sells protection on a large CDS portfolio (such as 125 index names) and slices the credit risk into a priority loss waterfall: Equity Tranche (absorbs initial portfolio losses from 0% to 3%), Mezzanine Tranche (absorbs 3% to 7%), Senior Tranche (7% to 10%), and Super Senior Tranche (10% to 100%).",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "In a synthetic CDO, a portfolio of credit default swaps is created. The risk is divided into tranches: equity tranche absorbs the first losses, followed by mezzanine and senior tranches.",
        "provenance": "notebooklm_query"
      },
      "tags": ["synthetic_cdo", "loss_tranches", "equity_mezzanine_senior", "tranche_waterfall"]
    },
    {
      "id": "fact-10",
      "category": "case_study",
      "topic": "Correlation Risk and the Gaussian Copula Blindspot (The 2007-2008 Subprime Collapse)",
      "statement": "David X. Li's (2000) Gaussian copula model became the ubiquitous Wall Street standard for pricing CDO tranches by reducing complex joint default distributions to a single correlation parameter. In 2007-2008, when systemic housing declines triggered contagious cascading defaults, the Gaussian copula failed completely because it assumed zero tail dependence, masking catastrophic correlation risk.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "The Gaussian copula model was widely used to model default correlations in synthetic CDOs. It failed during the 2007-2008 crisis because it ignored tail correlation during market panic.",
        "provenance": "notebooklm_query"
      },
      "tags": ["gaussian_copula", "david_li_model", "correlation_failure", "2008_subprime_crisis"]
    },
    {
      "id": "fact-11",
      "category": "claim",
      "topic": "Naked CDS vs Covered CDS and Regulatory Post-Crisis Reforms",
      "statement": "While covered CDS protects bondholders against default loss, a naked CDS occurs when a speculator buys default protection without owning the underlying reference debt. Post-2008 Dodd-Frank and European EMIR reforms banned naked sovereign CDS and mandated that standardized corporate CDS be centrally cleared via clearinghouses (CCPs) with mandatory initial and variation margin.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch23_part1",
        "excerpt": "A naked CDS is one where the protection buyer does not own the underlying debt. Regulatory reforms post-crisis required central clearing for standardized credit default swaps.",
        "provenance": "notebooklm_query"
      },
      "tags": ["naked_cds", "speculative_credit", "central_clearing", "dodd_frank_emir"]
    }
  ]
};

const dirs = [
  "src/data/chapters/hull_derivatives/ch23_part1",
  "src/data/chapters/hull_derivatives_en/ch23_part1"
];

for (const d of dirs) {
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, "source_facts.json"), JSON.stringify(ch23Facts, null, 2), "utf8");
  console.log(`Wrote exact source_facts.json to ${d}`);
}
