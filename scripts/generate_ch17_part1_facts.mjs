import fs from "fs";
import path from "path";

const facts = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch17_part1",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Financial institutions that write OTC options manage market risk through dynamic hedging rather than speculative holding.",
    "A delta-neutral portfolio is immune to small instantaneous changes in the underlying asset price.",
    "Delta changes continuously as time elapses and the asset price fluctuates, requiring periodic rebalancing.",
    "Standard exchange option contracts cover 100 shares, while institutional OTC positions often cover 100,000 shares."
  ],
  facts: [
    {
      id: "fact-01",
      category: "claim",
      topic: "Naked and Covered Positions and Their Asymmetric Risks",
      statement: "A naked position involves writing an option with zero hedge, exposing the institution to catastrophic upside losses if the stock surges. A covered position involves buying 100% of underlying shares upfront; while protecting against upside surges, a covered position suffers massive equity depletion if the stock crashes.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "A naked position involves doing nothing. A covered position involves buying the shares. Neither strategy provides a good hedge.",
        provenance: "notebooklm_query"
      },
      tags: ["naked_writing", "covered_writing", "unhedged_risk"]
    },
    {
      id: "fact-02",
      category: "claim",
      topic: "Structural Flaws of the Stop-Loss Hedging Strategy",
      statement: "The stop-loss strategy attempts to hold shares whenever spot price S is above strike K and liquidate whenever S falls below K. In practice, volatile markets cause frequent whipsaws around K, forcing the trader to buy at K + epsilon and sell at K - epsilon, accumulating severe transaction costs and guaranteed cash leakage.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "A stop-loss strategy involves holding shares when S > K and holding cash when S < K. The strategy fails because in practice buying high and selling low repeatedly creates huge trading losses.",
        provenance: "notebooklm_query"
      },
      tags: ["stop_loss_flaws", "whipsaw_losses", "discontinuous_trading"]
    },
    {
      id: "fact-03",
      category: "formula",
      topic: "Delta Definition and Call/Put Analytical Formulas",
      statement: "The delta of an option is the first partial derivative of its price with respect to the underlying asset price: Delta = dC / dS. For a European call on a non-dividend stock, Delta_call = N(d1). For a European put, Delta_put = N(d1) - 1. When an asset pays continuous dividend yield q, Delta_call = e^(-q*T) * N(d1).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "The delta of an option is defined as the rate of change of the option price with respect to the price of the underlying asset: Delta = dC/dS. For a call option on a non-dividend-paying stock, Delta = N(d1).",
        provenance: "notebooklm_query"
      },
      tags: ["delta_definition", "delta_call", "delta_put"],
      formulaDetails: {
        name: "Option Delta Analytical Formulas",
        latex: "\\Delta_{call} = e^{-qT} N(d_1), \\quad \\Delta_{put} = e^{-qT} [N(d_1) - 1]",
        variables: [
          { symbol: "\\Delta_{call}", definition: "Delta of European call option (hedge ratio)", unit: "dimensionless" },
          { symbol: "\\Delta_{put}", definition: "Delta of European put option", unit: "dimensionless" },
          { symbol: "N(d_1)", definition: "Cumulative standard normal distribution value at d1", unit: "dimensionless" },
          { symbol: "e^{-qT}", definition: "Continuous dividend discount factor", unit: "dimensionless" },
          { symbol: "q", definition: "Continuous dividend yield per annum", unit: "percent" }
        ]
      }
    },
    {
      id: "fact-04",
      category: "market_rule",
      topic: "Delta Neutrality and Dynamic Rebalancing Ratio",
      statement: "A financial institution that writes Q call options achieves delta neutrality by purchasing Q * Delta shares of underlying stock. Because Delta shifts continuously with stock price movements and the passage of time, the hedge ratio must be dynamically adjusted through periodic share purchases or sales.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "To create a delta-neutral position, an institution that has written Q call options must purchase Q*Delta shares of the underlying stock.",
        provenance: "notebooklm_query"
      },
      tags: ["delta_neutrality", "hedge_ratio", "rebalancing_shares"],
      numericalDetails: {
        values: { optionsWritten: 100000, initialDelta: 0.522, sharesPurchased: 52200 },
        units: "shares",
        contractSize: 100000,
        context: "Short 100,000 calls with Delta 0.522 requires purchasing 52,200 shares to establish delta neutrality."
      }
    },
    {
      id: "fact-05",
      category: "numerical_example",
      topic: "Hull Example 17.1: Dynamic Hedging of a 100,000 Call Option Position",
      statement: "Consider a bank writing 100,000 European call options with K = $50, S0 = $49, r = 5%, sigma = 20%, and T = 20 weeks (0.3846 yr). Initial delta is 0.522, requiring buying 52,200 shares at $49 ($2,557,800). By week 1, if stock falls to $48.12, delta drops to 0.458, prompting the bank to sell 6,400 shares at $48.12 ($307,968) to maintain delta neutrality.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "Table 17.2 Simulation of delta hedging for a short call position. The initial hedge requires buying 52,200 shares at $49. In week 1, 6,400 shares are sold at $48.12.",
        provenance: "notebooklm_query"
      },
      tags: ["hull_table_17_2", "dynamic_hedging_simulation", "rebalancing_table"],
      numericalDetails: {
        values: { S0: 49, K: 50, initialDelta: 0.522, week1Stock: 48.12, week1Delta: 0.458, sharesSold: 6400, proceeds: 307968 },
        units: "$",
        contractSize: 100000,
        context: "S0=49, initial buy 52,200 shares; week 1 S=48.12, sell 6,400 shares at $48.12 maintaining neutrality."
      }
    },
    {
      id: "fact-06",
      category: "case_study",
      topic: "Business Snapshot 17.1: Dynamic Hedging in Practice",
      statement: "In real-world trading, rebalancing continuously is impossible due to trading commissions and bid-ask spreads. Financial institutions maintain 'tolerance bands' around target delta (e.g., +/- 0.05) or rebalance at fixed calendar intervals (e.g., daily market close), trading off gamma curvature slippage against cumulative transaction friction.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "Business Snapshot 17.1: Dynamic Hedging in Practice. Traders do not rebalance continuously because of transaction costs. They rebalance at discrete intervals or when delta drifts outside a band.",
        provenance: "notebooklm_query"
      },
      tags: ["business_snapshot_17_1", "tolerance_bands", "discrete_rebalancing"],
      numericalDetails: {
        values: { deltaToleranceBand: 0.05, rebalanceIntervalHours: 24 },
        units: "delta",
        contractSize: 100,
        context: "Desk policy triggers rebalancing only when delta deviates by more than +/- 0.05 from neutral."
      }
    },
    {
      id: "fact-07",
      category: "definition",
      topic: "The Five Greek Letters: Sensitivity Taxonomy",
      statement: "The Greek letters measure distinct dimensions of option risk: Delta measures sensitivity to asset price (dC/dS), Gamma measures curvature (d^2C/dS^2), Theta measures time decay (dC/dt), Vega measures volatility sensitivity (dC/d_sigma), and Rho measures interest rate sensitivity (dC/dr).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "The Greek letters are Delta, Theta, Gamma, Vega, and Rho. Each measures a different aspect of the risk in an option position.",
        provenance: "notebooklm_query"
      },
      tags: ["greeks_taxonomy", "delta", "gamma", "theta", "vega", "rho"]
    },
    {
      id: "fact-08",
      category: "claim",
      topic: "Why Delta Hedging Alone Leaves Curvature (Gamma) Risk",
      statement: "Delta hedging is a purely linear approximation valid only for infinitesimal price moves. If the underlying asset makes a large discrete jump, delta itself changes, creating non-linear portfolio P&L drift that can only be measured and controlled through gamma.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "Delta hedging assumes that the stock price makes only small changes. For large changes, the hedge performance depends on gamma.",
        provenance: "notebooklm_query"
      },
      tags: ["linear_approximation", "gamma_curvature", "jump_risk"]
    },
    {
      id: "fact-09",
      category: "formula",
      topic: "Taylor Series Expansion for Option Price Changes",
      statement: "The change in option value delta_C for a price move delta_S and elapsed time delta_t is approximated via second-order Taylor series: delta_C = Delta * delta_S + 0.5 * Gamma * (delta_S)^2 + Theta * delta_t. Delta hedging neutralizes the first linear term, but leaves the quadratic Gamma term exposed.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "Using Taylor series expansion: delta_C = Delta * delta_S + 0.5 * Gamma * (delta_S)^2 + Theta * delta_t.",
        provenance: "notebooklm_query"
      },
      tags: ["taylor_series", "quadratic_term", "pnl_attribution"],
      formulaDetails: {
        name: "Second-Order Taylor Series P&L Approximation",
        latex: "\\Delta C \\approx \\Delta \\cdot \\Delta S + \\frac{1}{2} \\Gamma (\\Delta S)^2 + \\Theta \\Delta t",
        variables: [
          { symbol: "\\Delta C", definition: "Change in option price", unit: "$" },
          { symbol: "\\Delta", definition: "Option delta", unit: "dimensionless" },
          { symbol: "\\Delta S", definition: "Change in underlying stock price", unit: "$" },
          { symbol: "\\Gamma", definition: "Option gamma (curvature)", unit: "1/$" },
          { symbol: "\\Theta", definition: "Option theta (time decay per calendar day)", unit: "$/day" },
          { symbol: "\\Delta t", definition: "Elapsed time interval", unit: "days" }
        ]
      }
    },
    {
      id: "fact-10",
      category: "market_rule",
      topic: "Cost of Hedging vs Net Option Premium Invariant",
      statement: "In a Black-Scholes-Merton world without arbitrage, the expected present value of the cumulative costs incurred from dynamic delta hedging exactly equals the theoretical option premium received upfront. Delta hedging does not generate free alpha; it transforms market directional exposure into cost-of-carry and rebalancing friction.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "The cost of hedging in a risk-neutral world should equal the theoretical Black-Scholes-Merton option price.",
        provenance: "notebooklm_query"
      },
      tags: ["hedging_cost_equality", "no_free_alpha", "friction_transformation"]
    },
    {
      id: "fact-11",
      category: "definition",
      topic: "Payoff versus Profit Distinction for Delta-Hedged Portfolios",
      statement: "For a delta-hedged short option portfolio, the gross terminal payoff is the option payoff netted against stock liquidation proceeds. True net trading profit must deduct initial stock financing interest costs, option premium received compounded at rate r, and cumulative transaction commissions: Profit = Liquidation Payoff - Net Debt.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch17_part1",
        excerpt: "The terminal profit must take into account the cost of borrowing to buy shares, trading commissions, and interest on the initial option premium.",
        provenance: "notebooklm_query"
      },
      tags: ["payoff_vs_profit", "hedging_profit_accounting", "financing_costs"],
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "Option Cashflow + Shares * S_T",
        formulaProfit: "Option Cashflow + Shares * S_T - Loan * e^(r*T)"
      }
    }
  ]
};

const targetDir = path.resolve("src/data/chapters/hull_derivatives/ch17_part1");
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, "source_facts.json"), JSON.stringify(facts, null, 2), "utf8");
console.log("Successfully wrote source_facts.json to " + targetDir);

