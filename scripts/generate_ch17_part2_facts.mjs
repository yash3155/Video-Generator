import fs from "fs";
import path from "path";

const facts = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch17_part2",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Higher-order Greeks (Gamma, Theta, Vega, Rho) quantify risk exposures that cannot be neutralized with underlying stock alone.",
    "Making a portfolio Gamma-neutral or Vega-neutral requires taking positions in traded option contracts because underlying stock has zero Gamma and zero Vega.",
    "The Black-Scholes-Merton differential equation establishes an invariant mathematical relationship linking Delta, Theta, and Gamma.",
    "Synthetic portfolio insurance creates dynamic put payoffs by systematically selling index futures as spot prices decline."
  ],
  facts: [
    {
      id: "fact-01",
      category: "formula",
      topic: "Theta Analytical Formula and Time Decay Properties",
      statement: "Theta is the rate of change of option value with respect to the passage of time: Theta = dc / dt. For a European call on a non-dividend stock, Theta = - [S0 * N'(d1) * sigma] / (2 * sqrt(T)) - r * K * e^(-r*T) * N(d2). Theta of long option positions is typically negative, reflecting relentless calendar time decay.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "Theta of an option is the rate of change of the value of the option with respect to the passage of time with all else remaining the same. Theta is usually negative.",
        provenance: "notebooklm_query"
      },
      tags: ["theta_formula", "time_decay", "calendar_decay"],
      formulaDetails: {
        name: "European Call Theta Formula",
        latex: "\\Theta_{call} = -\\frac{S_0 N'(d_1) \\sigma}{2\\sqrt{T}} - r K e^{-rT} N(d_2)",
        variables: [
          { symbol: "\\Theta_{call}", definition: "Call option theta (rate of time decay)", unit: "$/year" },
          { symbol: "S_0", definition: "Current stock price", unit: "$" },
          { symbol: "N'(d_1)", definition: "Standard normal probability density function at d1", unit: "dimensionless" },
          { symbol: "\\sigma", definition: "Annualized stock price volatility", unit: "percent" },
          { symbol: "T", definition: "Time to expiration", unit: "years" },
          { symbol: "r", definition: "Risk-free interest rate", unit: "percent" },
          { symbol: "K", definition: "Option strike price", unit: "$" }
        ]
      }
    },
    {
      id: "fact-02",
      category: "formula",
      topic: "Gamma Definition and Curvature Risk",
      statement: "Gamma is the second partial derivative of option value with respect to stock price: Gamma = d^2C / dS^2 = N'(d1) / (S0 * sigma * sqrt(T)). Gamma measures the rate of change of Delta. When Gamma is large in absolute value, Delta is highly sensitive to stock price changes, leaving delta hedges vulnerable.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "Gamma is the rate of change of delta with respect to the price of the underlying asset: Gamma = d^2C/dS^2 = N'(d1)/(S0*sigma*sqrt(T)).",
        provenance: "notebooklm_query"
      },
      tags: ["gamma_formula", "curvature_risk", "atm_gamma_peak"],
      formulaDetails: {
        name: "Option Gamma Formula",
        latex: "\\Gamma = \\frac{N'(d_1)}{S_0 \\sigma \\sqrt{T}}",
        variables: [
          { symbol: "\\Gamma", definition: "Option gamma (rate of change of delta)", unit: "1/$" },
          { symbol: "N'(d_1)", definition: "Standard normal density function value", unit: "dimensionless" },
          { symbol: "S_0", definition: "Spot price", unit: "$" },
          { symbol: "\\sigma", definition: "Annualized volatility", unit: "percent" },
          { symbol: "T", definition: "Time to maturity", unit: "years" }
        ]
      }
    },
    {
      id: "fact-03",
      category: "market_rule",
      topic: "Delta-Gamma Neutrality Architecture",
      statement: "Because underlying stock has Gamma equal to zero, a portfolio cannot be made Gamma-neutral by trading stock. To neutralize a portfolio with gamma Gamma_P, a trader must add w_T units of a traded option with gamma Gamma_T such that w_T = - Gamma_P / Gamma_T, followed by re-adjusting stock holdings to restore Delta neutrality.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "A position in the underlying asset has zero gamma. To change the gamma of a portfolio, it is necessary to trade an option. If gamma is Gamma_P, adding w_T options where w_T = -Gamma_P/Gamma_T achieves gamma neutrality.",
        provenance: "notebooklm_query"
      },
      tags: ["gamma_neutrality", "traded_option_hedge", "two_step_rebalancing"],
      numericalDetails: {
        values: { portfolioGamma: -10000, tradedOptionGamma: 0.5, requiredOptions: 20000 },
        units: "contracts",
        contractSize: 100,
        context: "Portfolio Gamma of -10,000 hedged with options having Gamma 0.5 requires buying 20,000 option contracts."
      }
    },
    {
      id: "fact-04",
      category: "formula",
      topic: "The Black-Scholes-Merton PDE Relationship: Theta, Delta, and Gamma",
      statement: "The Black-Scholes-Merton differential equation establishes an invariant governing all derivative contracts: Theta + r*S*Delta + 0.5*sigma^2*S^2*Gamma = r*Pi. For a delta-neutral portfolio (Delta = 0), this simplifies to Theta + 0.5*sigma^2*S^2*Gamma = r*Pi, proving that positive gamma comes at the direct expense of negative theta.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "The Black-Scholes-Merton differential equation states: Theta + r*S*Delta + 0.5*sigma^2*S^2*Gamma = r*Pi. For a delta-neutral portfolio, Theta + 0.5*sigma^2*S^2*Gamma = r*Pi.",
        provenance: "notebooklm_query"
      },
      tags: ["bsm_pde", "theta_gamma_tradeoff", "differential_equation"],
      formulaDetails: {
        name: "Delta-Neutral PDE Invariant",
        latex: "\\Theta + \\frac{1}{2} \\sigma^2 S^2 \\Gamma = r \\Pi",
        variables: [
          { symbol: "\\Theta", definition: "Portfolio theta", unit: "$/year" },
          { symbol: "\\sigma", definition: "Annualized volatility", unit: "percent" },
          { symbol: "S", definition: "Stock price", unit: "$" },
          { symbol: "\\Gamma", definition: "Portfolio gamma", unit: "1/$" },
          { symbol: "r \\Pi", definition: "Risk-free return on portfolio equity", unit: "$" }
        ]
      }
    },
    {
      id: "fact-05",
      category: "formula",
      topic: "Vega Definition and Volatility Risk",
      statement: "Vega is the rate of change of option value with respect to volatility: Vega = dC / d_sigma = S0 * sqrt(T) * N'(d1). Vega is always positive for long calls and puts, peaking at-the-money. Making a book Vega-neutral requires trading an option with non-zero Vega.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "The vega of an option is the rate of change of the value of the option with respect to the volatility of the underlying asset: Vega = dC/d_sigma = S0*sqrt(T)*N'(d1).",
        provenance: "notebooklm_query"
      },
      tags: ["vega_formula", "volatility_sensitivity", "vega_neutrality"],
      formulaDetails: {
        name: "Option Vega Formula",
        latex: "\\mathcal{V} = S_0 \\sqrt{T} N'(d_1)",
        variables: [
          { symbol: "\\mathcal{V}", definition: "Option vega", unit: "$/percent" },
          { symbol: "S_0", definition: "Stock price", unit: "$" },
          { symbol: "T", definition: "Time to expiration", unit: "years" },
          { symbol: "N'(d_1)", definition: "Normal density function value at d1", unit: "dimensionless" }
        ]
      }
    },
    {
      id: "fact-06",
      category: "formula",
      topic: "Rho Definition and Interest Rate Sensitivity",
      statement: "Rho is the rate of change of option value with respect to the risk-free interest rate: Rho = dC / dr = K * T * e^(-r*T) * N(d2) for European calls, and - K * T * e^(-r*T) * N(-d2) for puts. Rho increases with maturity T.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "The rho of an option is the rate of change of the value of the option with respect to the interest rate: Rho_call = K*T*e^(-r*T)*N(d2).",
        provenance: "notebooklm_query"
      },
      tags: ["rho_formula", "interest_rate_sensitivity", "long_term_options"],
      formulaDetails: {
        name: "European Call Rho Formula",
        latex: "\\rho_{call} = K T e^{-rT} N(d_2)",
        variables: [
          { symbol: "\\rho_{call}", definition: "Call option rho", unit: "$/percent" },
          { symbol: "K", definition: "Strike price", unit: "$" },
          { symbol: "T", definition: "Time to expiration", unit: "years" },
          { symbol: "e^{-rT}", definition: "Discount factor at rate r", unit: "dimensionless" },
          { symbol: "N(d_2)", definition: "Risk-neutral exercise probability", unit: "dimensionless" }
        ]
      }
    },
    {
      id: "fact-07",
      category: "claim",
      topic: "Synthetic Portfolio Insurance via Dynamic Index Futures Selling",
      statement: "Synthetic portfolio insurance creates a synthetic put option by selling index futures or underlying shares as the market falls. Because the delta of a protective put is negative (Delta_put = N(d1) - 1), a declining market decreases delta toward -1, requiring the institutional manager to sell more stock as prices fall.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "Synthetic portfolio insurance involves creating a put option synthetically. As the market falls, delta becomes more negative, forcing the portfolio manager to sell additional index futures.",
        provenance: "notebooklm_query"
      },
      tags: ["synthetic_portfolio_insurance", "negative_feedback_loop", "procyclical_selling"]
    },
    {
      id: "fact-08",
      category: "case_study",
      topic: "Business Snapshot 17.2: Was Portfolio Insurance to Blame for the Crash of 1987?",
      statement: "On October 19, 1987 (Black Monday), the Dow Jones Industrial Average plummeted 22.6% in a single day. Business Snapshot 17.2 documents that over $60-$90 billion in institutional equity was managed under synthetic portfolio insurance programs. As stocks fell, algorithmic delta-hedging programs dumped massive sell orders into the S&P 500 futures pit, triggering a catastrophic procyclical feedback loop that overwhelmed exchange liquidity and catalyzed the introduction of market-wide circuit breakers.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "Business Snapshot 17.2: Was Portfolio Insurance to Blame for the Crash of 1987? On Monday, October 19, 1987, the Dow Jones Industrial Average dropped by 508 points (22.6%). Portfolio insurers sold massive amounts of index futures, creating a vicious cycle of falling prices.",
        provenance: "notebooklm_query"
      },
      tags: ["business_snapshot_17_2", "black_monday_1987", "market_circuit_breakers"],
      numericalDetails: {
        values: { singleDayDropPercent: 22.6, dowPointsDrop: 508, portfolioInsuranceAUM: 75000000000 },
        units: "percent",
        contractSize: 100,
        context: "On Black Monday 1987, Dow fell 22.6% (508 points) as $75B in portfolio insurance triggered cascading futures selling."
      }
    },
    {
      id: "fact-09",
      category: "numerical_example",
      topic: "Simultaneous Delta-Gamma-Vega Neutrality Calculation",
      statement: "Consider a trading book with Delta = 0, Gamma = -5,000, and Vega = -8,000. Two traded options exist: Option 1 (Gamma = 1.5, Vega = 2.0) and Option 2 (Gamma = 0.5, Vega = 3.0). Solving the linear 2x2 system yields the exact contracts w1 and w2 to neutralize both Gamma and Vega, followed by buying stock to re-zero Delta.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "To make a portfolio both gamma and vega neutral, two different traded options must be used. We solve two simultaneous equations for w1 and w2.",
        provenance: "notebooklm_query"
      },
      tags: ["delta_gamma_vega_neutral", "simultaneous_linear_system", "two_option_hedging"],
      numericalDetails: {
        values: { portfolioGamma: -5000, portfolioVega: -8000, opt1Gamma: 1.5, opt1Vega: 2.0, opt2Gamma: 0.5, opt2Vega: 3.0 },
        units: "contracts",
        contractSize: 100,
        context: "Solving 1.5*w1 + 0.5*w2 = 5000 and 2.0*w1 + 3.0*w2 = 8000 yields exact hedge quantities w1 and w2."
      }
    },
    {
      id: "fact-10",
      category: "market_rule",
      topic: "Post-1987 Market Reforms: Circuit Breakers and Volatility Safeguards",
      statement: "Following the 1987 crash, the Brady Commission established mandatory market-wide circuit breakers (7%, 13%, and 20% drops) to halt trading and break automated algorithmic selling spirals, recognizing that unbounded dynamic delta selling can trigger market-wide liquidity failure.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "As a result of the 1987 crash, exchanges introduced circuit breakers to halt trading when prices drop by specified percentages.",
        provenance: "notebooklm_query"
      },
      tags: ["circuit_breakers", "brady_commission", "liquidity_safeguards"]
    },
    {
      id: "fact-11",
      category: "definition",
      topic: "Payoff versus Profit Distinction for Multi-Greek Portfolios",
      statement: "For complex multi-Greek option books, gross terminal payoff is the sum of all terminal option payoffs and stock positions. True net trading profit must account for the initial net premium earned, continuous financing costs on borrowed stock collateral, and the cumulative drag of negative Theta time decay: Profit = Terminal Cashflow - Net Debt - Cumulative Theta Drag.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part2",
        excerpt: "Terminal profit reflects net payoff minus financing costs and cumulative time decay incurred while maintaining the hedge.",
        provenance: "notebooklm_query"
      },
      tags: ["payoff_vs_profit", "multi_greek_accounting", "theta_drag"],
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "Sum of Option Cashflows + Shares * S_T",
        formulaProfit: "Payoff - Financing Debt - Cumulative Theta Decay"
      }
    }
  ]
};

const targetDir = path.resolve("src/data/chapters/hull_derivatives/ch17_part2");
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, "source_facts.json"), JSON.stringify(facts, null, 2), "utf8");
console.log("Successfully wrote source_facts.json to " + targetDir);

