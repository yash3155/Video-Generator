import fs from 'fs';
import path from 'path';

const ch20Part1Facts = {
  "schemaVersion": "1.0.0",
  "chapterSlug": "ch20_part1",
  "notebookId": "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  "sourceId": "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  "retrievalTimestamp": new Date().toISOString(),
  "bookTitle": "Fundamentals of Futures and Options Markets (John C. Hull)",
  "generalAssumptions": [
    "Value at Risk (VaR) measures market risk by calculating the maximum dollar loss expected at a given confidence level over a specified time horizon.",
    "VaR is not a coherent risk measure because it fails the subadditivity condition, meaning portfolio VaR can exceed the sum of individual asset VaRs.",
    "Expected Shortfall (ES) measures the expected loss conditional on the loss exceeding the VaR threshold and is a mathematically coherent risk measure.",
    "Historical simulation models potential future losses by applying historically observed percentage market movements to the current portfolio."
  ],
  "facts": [
    {
      "id": "fact-01",
      "category": "definition",
      "topic": "Definition of Value at Risk (VaR)",
      "statement": "Value at Risk (VaR) is defined as the dollar loss amount V that will not be exceeded with confidence level X (such as 99%) over time horizon N days. Formally, the probability of incurring a loss greater than or equal to V over N days is equal to 1 minus X.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "When using Value at Risk, the risk manager is thinking: 'We are X percent certain that we will not lose more than V dollars in time N.'",
        "provenance": "notebooklm_query"
      },
      "tags": ["var_definition", "confidence_level", "time_horizon", "risk_threshold"]
    },
    {
      "id": "fact-02",
      "category": "claim",
      "topic": "VaR Incoherence and Failure of Subadditivity",
      "statement": "In modern risk theory (Artzner et al., 1999), a coherent risk measure must satisfy monotonicity, translation invariance, positive homogeneity, and subadditivity. VaR fails subadditivity: the VaR of a combined portfolio VaR(A+B) can be strictly greater than VaR(A) + VaR(B), thereby penalizing portfolio diversification in asymmetric return distributions.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "A risk measure is subadditive if the risk of two portfolios combined is less than or equal to the sum of the risks of the individual portfolios. VaR does not satisfy this condition.",
        "provenance": "notebooklm_query"
      },
      "tags": ["subadditivity_failure", "coherent_risk", "artzner_axioms", "diversification_penalty"]
    },
    {
      "id": "fact-03",
      "category": "definition",
      "topic": "Expected Shortfall (ES / Conditional VaR)",
      "statement": "Expected Shortfall (ES), also called Conditional Value at Risk (CVaR), is defined as the expected dollar loss conditional on the loss being greater than the VaR threshold. Unlike VaR, Expected Shortfall is a coherent risk measure that always satisfies subadditivity and directly measures the severity of catastrophic tail losses.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "Expected Shortfall is the expected loss during a time period conditional on the loss being greater than the VaR.",
        "provenance": "notebooklm_query"
      },
      "tags": ["expected_shortfall", "cvar", "tail_risk", "coherent_measure"]
    },
    {
      "id": "fact-04",
      "category": "case_study",
      "topic": "FRTB Basel Regulatory Shift from 99% VaR to 97.5% ES (Business Snapshot 20.1)",
      "statement": "In Business Snapshot 20.1, Hull details how the Basel Committee's Fundamental Review of the Trading Book (FRTB) replaced the traditional 10-day 99% VaR metric with a 10-day 97.5% Expected Shortfall metric. The regulatory rationale was that 97.5% ES captures tail fatness and cliff risk while providing approximately the same numerical capital requirement for normal distributions as 99% VaR.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "The Basel Committee replaced 99% VaR with 97.5% Expected Shortfall for determining market risk capital requirements.",
        "provenance": "notebooklm_query"
      },
      "tags": ["snapshot_20_1", "frtb", "basel_reforms", "97_5_percent_es"]
    },
    {
      "id": "fact-05",
      "category": "claim",
      "topic": "The Historical Simulation Method Architecture",
      "statement": "Historical simulation calculates VaR and ES by taking the current portfolio and subjecting it to the actual percentage price changes observed over the previous M trading days (typically M = 500 or 1,000 days). This generates M simulated future portfolio values without requiring parametric distribution assumptions.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "Historical simulation involves using past data as a guide to what will happen in the future. The variables in the portfolio are assumed to change tomorrow by the same percentage as on past days.",
        "provenance": "notebooklm_query"
      },
      "tags": ["historical_simulation", "non_parametric", "empirical_scenarios"]
    },
    {
      "id": "fact-06",
      "category": "formula",
      "topic": "Formula for Expected Shortfall as Integrated Tail Expectation",
      "statement": "For a continuous loss distribution with density function f(L), the Expected Shortfall at confidence level X is given by ES = (1 / (1 - X)) * integral from VaR to infinity of (L * f(L) dL). In discrete historical simulation with M scenarios, ES is calculated as the simple arithmetic average of all scenario losses exceeding the estimated VaR.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "Expected Shortfall can be calculated as the average of the losses that are greater than the VaR.",
        "provenance": "notebooklm_query"
      },
      "tags": ["es_integral", "tail_expectation", "discrete_average"],
      "formulaDetails": {
        "name": "Expected Shortfall Integral Formula",
        "latex": "ES = \\frac{1}{1-X} \\int_{VaR}^{\\infty} L \\cdot f(L) \\, dL",
        "variables": [
          { "symbol": "ES", "definition": "Expected Shortfall conditional loss", "unit": "currency ($)" },
          { "symbol": "X", "definition": "Confidence level percentage", "unit": "dimensionless (e.g. 0.99)" },
          { "symbol": "VaR", "definition": "Value at Risk cutoff threshold", "unit": "currency ($)" },
          { "symbol": "L", "definition": "Portfolio dollar loss variable", "unit": "currency ($)" },
          { "symbol": "f(L)", "definition": "Probability density function of portfolio losses", "unit": "density (1/currency)" }
        ]
      }
    },
    {
      "id": "fact-07",
      "category": "numerical_example",
      "topic": "Hull Table 20.1: 500-Day Historical Simulation VaR and ES Calculation",
      "statement": "In Hull Table 20.1, a portfolio composed of $10 million equity and $5 million foreign exchange is evaluated across 500 historical trading days. The sorted scenario losses reveal that the 5th worst loss (representing 99% 1-day VaR) is $253,385. The Expected Shortfall is the arithmetic average of the 5 worst losses ($253,385, $260,110, $275,420, $301,200, $320,905), yielding an ES of $282,204. Profit = Payoff - Premium paid.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "Table 20.1 shows 500 scenarios for a portfolio. The 5th worst loss is $253,385, which is the 99% one-day VaR. The average of the five worst losses gives the 99% Expected Shortfall as $282,204.",
        "provenance": "notebooklm_query"
      },
      "tags": ["table_20_1", "numerical_var", "numerical_es", "500_scenarios"],
      "numericalDetails": {
        "values": {
          "portfolioEquity": 10000000,
          "portfolioForex": 5000000,
          "totalPortfolio": 15000000,
          "var99OneDay": 253385,
          "es99OneDay": 282204
        },
        "units": "$",
        "contractSize": 1,
        "context": "Hull Table 20.1 empirical 500-day historical simulation portfolio"
      },
      "payoffVsProfit": {
        "distinctionType": "both",
        "formulaPayoff": "max(S_T - K, 0)",
        "formulaProfit": "max(S_T - K, 0) - c"
      }
    },
    {
      "id": "fact-08",
      "category": "formula",
      "topic": "Square-Root-of-Time Rule and Its Statistical Limitations",
      "statement": "Under the assumption of independently and identically distributed (i.i.d.) normal daily returns with zero mean, N-day VaR scales according to the square-root-of-time rule: VaR_N = VaR_1 * sqrt(N). When returns exhibit volatility clustering, regime persistence, or serial autocorrelation, this rule significantly underestimates multi-day tail risk.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "Under the assumption that the changes in the portfolio value on successive days are independent and identically distributed, the N-day VaR equals the 1-day VaR multiplied by the square root of N.",
        "provenance": "notebooklm_query"
      },
      "tags": ["square_root_of_time", "time_scaling", "iid_assumption"],
      "formulaDetails": {
        "name": "Square-Root-of-Time Scaling Rule",
        "latex": "VaR_{N\\text{-day}} = VaR_{1\\text{-day}} \\times \\sqrt{N}",
        "variables": [
          { "symbol": "VaR_{N\\text{-day}}", "definition": "Multi-day Value at Risk over N days", "unit": "currency ($)" },
          { "symbol": "VaR_{1\\text{-day}}", "definition": "One-day Value at Risk", "unit": "currency ($)" },
          { "symbol": "N", "definition": "Time horizon holding period in trading days", "unit": "days" }
        ]
      }
    },
    {
      "id": "fact-09",
      "category": "claim",
      "topic": "Volatility-Updating Historical Simulation (Hull-White Approach)",
      "statement": "To overcome the equal-weighting flaw of standard historical simulation, Hull and White (1998) proposed scaling historical percentage returns by the ratio of current estimated market volatility to the historical volatility estimated at that past date: r_t^* = r_t * (sigma_current / sigma_t). This ensures historical scenarios accurately reflect current elevated volatility environments.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "Hull and White proposed an approach where historical percentage changes are adjusted by the ratio of current volatility to the historical volatility on the day the change occurred.",
        "provenance": "notebooklm_query"
      },
      "tags": ["hull_white_volatility_updating", "garch_scaling", "regime_adaptation"]
    },
    {
      "id": "fact-10",
      "category": "market_rule",
      "topic": "Tail Blindness and Trader Moral Hazard Under VaR Limits",
      "statement": "Because VaR completely ignores the magnitude of losses beyond the confidence cutoff, rogue traders can exploit VaR limits by taking on tail risk—such as writing deep out-of-the-money puts. These positions generate steady premium income and show zero 99% VaR violations until an extreme tail event causes a catastrophic insolvency, demonstrating why Expected Shortfall is required.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "A trader who is constrained only by a VaR limit may be tempted to enter into trades that produce small regular gains with a very small probability of a huge loss that falls beyond the VaR horizon.",
        "provenance": "notebooklm_query"
      },
      "tags": ["moral_hazard", "tail_blindness", "rogue_trading", "es_defense"]
    },
    {
      "id": "fact-11",
      "category": "claim",
      "topic": "Backtesting Regulatory Traffic Light System (Basel Framework)",
      "statement": "The Basel regulatory framework validates internal 99% 1-day VaR models by backtesting over 250 trading days. Models are categorized into a Traffic Light System based on exceptions (days where actual loss exceeded predicted VaR): 0 to 4 exceptions falls in the Green Zone (no penalty), 5 to 9 exceptions falls in the Yellow Zone (multiplicative capital penalty factor increases from 3 to 4), and 10 or more exceptions falls in the Red Zone (model is rejected).",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part1",
        "excerpt": "The Basel rules establish a traffic light system for backtesting. If the number of exceptions in 250 days is 4 or less, the model is in the green zone; between 5 and 9 is yellow; 10 or more is red.",
        "provenance": "notebooklm_query"
      },
      "tags": ["backtesting", "traffic_light_system", "basel_green_yellow_red", "exceptions"]
    }
  ]
};

const dirs = [
  "src/data/chapters/hull_derivatives/ch20_part1",
  "src/data/chapters/hull_derivatives_en/ch20_part1"
];

for (const d of dirs) {
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, "source_facts.json"), JSON.stringify(ch20Part1Facts, null, 2), "utf8");
  console.log(`Wrote exact source_facts.json to ${d}`);
}

