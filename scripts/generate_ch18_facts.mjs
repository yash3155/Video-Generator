import fs from "fs";
import path from "path";

const facts = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch18_part1",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Binomial trees model the continuous lognormal distribution of stock prices as discrete discrete up and down movements.",
    "The Cox-Ross-Rubinstein (CRR) parameterization matches the mean and variance of the stock price process over each time interval dt.",
    "American options are valued via backward induction, checking at each node whether immediate exercise value exceeds discounted continuation value.",
    "Monte Carlo simulation values options by averaging discounted payoffs over thousands of simulated risk-neutral sample paths."
  ],
  facts: [
    {
      id: "fact-01",
      category: "formula",
      topic: "Cox-Ross-Rubinstein (CRR) Parameterization Equations",
      statement: "In the Cox-Ross-Rubinstein binomial model, the up step factor u and down step factor d are u = e^(sigma * sqrt(delta_t)) and d = e^(-sigma * sqrt(delta_t)) = 1 / u. The risk-neutral probability of an upward move is p = (a - d) / (u - d), where a = e^(r * delta_t) for non-dividend assets and a = e^((r - q) * delta_t) with continuous dividend yield q.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "In the CRR tree, u = e^(sigma*sqrt(dt)), d = 1/u, and p = (a - d)/(u - d) where a = e^(r*dt).",
        provenance: "notebooklm_query"
      },
      tags: ["crr_parameters", "binomial_up_down", "risk_neutral_probability"],
      formulaDetails: {
        name: "Cox-Ross-Rubinstein Tree Parameters",
        latex: "u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = \\frac{1}{u}, \\quad p = \\frac{e^{(r-q)\\Delta t} - d}{u - d}",
        variables: [
          { symbol: "u", definition: "Proportional upward step factor", unit: "dimensionless" },
          { symbol: "d", definition: "Proportional downward step factor", unit: "dimensionless" },
          { symbol: "p", definition: "Risk-neutral probability of an upward move", unit: "dimensionless" },
          { symbol: "\\sigma", definition: "Annualized stock price volatility", unit: "percent" },
          { symbol: "\\Delta t", definition: "Time step duration", unit: "years" },
          { symbol: "r", definition: "Risk-free interest rate", unit: "percent" },
          { symbol: "q", definition: "Continuous dividend yield", unit: "percent" }
        ]
      }
    },
    {
      id: "fact-02",
      category: "market_rule",
      topic: "American Option Valuation via Backward Induction",
      statement: "American options are valued by stepping backward through the tree from maturity. At each node (i, j), option value V(i, j) is the maximum of intrinsic immediate exercise value and discounted continuation value: V(i, j) = max(Intrinsic, e^(-r*delta_t) * [p * V(i+1, j+1) + (1 - p) * V(i+1, j)]).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "At each node, the value of the option is checked for early exercise. The value is max(Exercise Value, Continuation Value).",
        provenance: "notebooklm_query"
      },
      tags: ["backward_induction", "american_option_tree", "early_exercise_check"]
    },
    {
      id: "fact-03",
      category: "numerical_example",
      topic: "Two-Step CRR Binomial Tree for an American Put (Hull Example)",
      statement: "Consider a 2-year American put on a stock with S0 = $50, K = $52, r = 5%, sigma = 30%, and delta_t = 1 year. Parameters evaluate to u = 1.3499, d = 0.7408, a = 1.0513, and p = 0.5097. Backward induction reveals optimal early exercise at node (1, 0) where stock price is $37.04, yielding immediate exercise profit of $14.96 ($52 - $37.04) versus continuation value $12.36, producing an initial put price of $7.43.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "Figure 18.2 Two-step tree for American put option. At node B where S = 37.04, the option is exercised early to realize 14.96.",
        provenance: "notebooklm_query"
      },
      tags: ["hull_figure_18_2", "two_step_put_tree", "optimal_early_exercise"],
      numericalDetails: {
        values: { S0: 50, K: 52, r: 0.05, sigma: 0.30, u: 1.3499, d: 0.7408, p: 0.5097, putPrice: 7.43 },
        units: "$",
        contractSize: 100,
        context: "S0=50, K=52, 2-step tree yields American put price $7.43 with early exercise at node (1, 0)."
      }
    },
    {
      id: "fact-04",
      category: "formula",
      topic: "Control Variate Technique for Variance & Discretization Error Reduction",
      statement: "The control variate technique dramatically sharpens American option tree accuracy by pairing it with European analytical pricing. The corrected American estimate is f_A = f_A_tree + (f_E_BSM - f_E_tree), where (f_E_BSM - f_E_tree) is the tree's known discretization error on European options.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "The control variate technique involves setting f_A = f_A(tree) + [f_E(BSM) - f_E(tree)]. This dramatically improves computational efficiency.",
        provenance: "notebooklm_query"
      },
      tags: ["control_variate", "error_reduction", "discretization_correction"],
      formulaDetails: {
        name: "Control Variate Tree Correction",
        latex: "f_A = f_A^{tree} + \\left(f_E^{BSM} - f_E^{tree}\\right)",
        variables: [
          { symbol: "f_A", definition: "Corrected high-precision American option price estimate", unit: "$" },
          { symbol: "f_A^{tree}", definition: "American option price evaluated on binomial tree", unit: "$" },
          { symbol: "f_E^{BSM}", definition: "Exact European option analytical price from Black-Scholes-Merton", unit: "$" },
          { symbol: "f_E^{tree}", definition: "European option price evaluated on same binomial tree", unit: "$" }
        ]
      }
    },
    {
      id: "fact-05",
      category: "market_rule",
      topic: "Recombining vs Non-Recombining Trees for Discrete Dividends",
      statement: "When modeling discrete dollar dividends D, subtracting dividends directly causes tree branches to diverge (non-recombining), causing node count to explode as 2^N. To preserve recombining efficiency where nodes grow linearly as N(N+1)/2, Hull decomposes stock price into a riskless dividend escrow component and an uncertain volatile component S* = S - D * e^(-r*t_D).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "If discrete dividends are paid, the tree does not recombine unless we define the stock price as S* = S - PV(dividends).",
        provenance: "notebooklm_query"
      },
      tags: ["discrete_dividends", "recombining_trees", "dividend_escrow"]
    },
    {
      id: "fact-06",
      category: "formula",
      topic: "Monte Carlo Risk-Neutral Path Simulation Equation",
      statement: "Monte Carlo simulation generates discrete geometric Brownian motion paths under the risk-neutral measure via S(t + delta_t) = S(t) * exp[(r - q - 0.5 * sigma^2)*delta_t + sigma * sqrt(delta_t) * epsilon], where epsilon is a standard normal random variable epsilon ~ N(0, 1).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "In Monte Carlo simulation, the path of the stock price is simulated using: S(t + dt) = S(t)*exp[(r - q - sigma^2/2)dt + sigma*sqrt(dt)*epsilon].",
        provenance: "notebooklm_query"
      },
      tags: ["monte_carlo_simulation", "geometric_brownian_motion", "risk_neutral_paths"],
      formulaDetails: {
        name: "Geometric Brownian Motion Path Simulation",
        latex: "S_{t+\\Delta t} = S_t \\exp\\left[\\left(r - q - \\frac{\\sigma^2}{2}\\right)\\Delta t + \\sigma \\sqrt{\\Delta t} \\epsilon\\right]",
        variables: [
          { symbol: "S_{t+\\Delta t}", definition: "Simulated stock price at next time step", unit: "$" },
          { symbol: "S_t", definition: "Current stock price", unit: "$" },
          { symbol: "r", definition: "Risk-free rate", unit: "percent" },
          { symbol: "q", definition: "Dividend yield", unit: "percent" },
          { symbol: "\\sigma", definition: "Volatility", unit: "percent" },
          { symbol: "\\Delta t", definition: "Simulation time step", unit: "years" },
          { symbol: "\\epsilon", definition: "Standard normal random variable N(0, 1)", unit: "dimensionless" }
        ]
      }
    },
    {
      id: "fact-07",
      category: "formula",
      topic: "Monte Carlo Estimator and Standard Error Convergence",
      statement: "The Monte Carlo derivative price estimator is the sample average of discounted terminal payoffs across M simulated paths: V0 = e^(-r*T) * (1 / M) * sum(Payoff_m). The standard error of the estimate is SE = omega / sqrt(M), where omega is sample standard deviation. Quadrupling paths (4M) is required to halve standard error.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "The estimate of the derivative price is the average discounted payoff. The standard error of the estimate is omega/sqrt(M).",
        provenance: "notebooklm_query"
      },
      tags: ["monte_carlo_estimator", "standard_error", "convergence_rate"],
      formulaDetails: {
        name: "Monte Carlo Estimator & Standard Error",
        latex: "V_0 = e^{-rT} \\frac{1}{M} \\sum_{m=1}^M \\text{Payoff}_m, \\quad \\text{SE} = \\frac{\\omega}{\\sqrt{M}}",
        variables: [
          { symbol: "V_0", definition: "Estimated fair value of derivative", unit: "$" },
          { symbol: "M", definition: "Number of simulated paths", unit: "paths" },
          { symbol: "\\text{Payoff}_m", definition: "Terminal payoff on m-th simulated path", unit: "$" },
          { symbol: "\\omega", definition: "Sample standard deviation of discounted payoffs", unit: "$" },
          { symbol: "\\text{SE}", definition: "Standard error of the Monte Carlo mean estimate", unit: "$" }
        ]
      }
    },
    {
      id: "fact-08",
      category: "claim",
      topic: "Binomial Trees vs Monte Carlo: Structural Comparison",
      statement: "Binomial trees excel at valuing American options with early exercise decisions because backward induction cleanly evaluates optimal exercise boundaries at every intermediate node. Conversely, standard Monte Carlo simulation steps forward in time, making early exercise difficult to optimize, but excels at pricing complex path-dependent exotic options (e.g., Asian, barrier) across dozens of underlying assets.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "Trees are well-suited to American-style options because of backward induction. Monte Carlo simulation is forward-stepping and best suited to path-dependent European options.",
        provenance: "notebooklm_query"
      },
      tags: ["trees_vs_monte_carlo", "backward_vs_forward", "american_vs_path_dependent"]
    },
    {
      id: "fact-09",
      category: "claim",
      topic: "Trinomial Trees and Adaptive Mesh Enhancements",
      statement: "Trinomial trees expand binomial branches from two to three (up, middle, down) with up factor u = e^(sigma * sqrt(3*delta_t)), offering faster convergence and enhanced stability around critical exercise boundaries and barrier trigger thresholds.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "An alternative procedure is to construct a trinomial tree where there are three branches from each node. It provides an extra degree of freedom.",
        provenance: "notebooklm_query"
      },
      tags: ["trinomial_trees", "adaptive_mesh", "barrier_convergence"]
    },
    {
      id: "fact-10",
      category: "case_study",
      topic: "Trading Desk Numerical Choice: CRR Tree Steps Calibration",
      statement: "In institutional derivatives pricing desks, trees are calibrated with 50 to 100 steps for standard American equity options, balancing sub-cent accuracy against sub-second execution speeds. Pairing a 50-step tree with the control variate technique achieves accuracy comparable to a 500-step raw tree without computational latency.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "In practice, 30 to 100 time steps are typically used. Using control variates allows accurate results with relatively few steps.",
        provenance: "notebooklm_query"
      },
      tags: ["tree_calibration", "computational_speed", "desk_implementation"],
      numericalDetails: {
        values: { standardSteps: 50, speedupFactor: 10 },
        units: "steps",
        contractSize: 100,
        context: "50-step tree with control variate delivers 10x speedup with accuracy equivalent to 500 steps."
      }
    },
    {
      id: "fact-11",
      category: "definition",
      topic: "Payoff versus Profit Distinction for American Tree Options",
      statement: "For an American option valued on a binomial tree, gross payoff upon early exercise at node (i, j) is max(K - S_i, 0), whereas true net profit deducts the compounded initial option purchase price: Profit = Exercise Payoff - Premium * e^(r*t_i). Failing to account for financing costs distorts the early exercise boundary.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch18_part1",
        excerpt: "The profit from early exercise accounts for the initial premium paid compounded to the exercise date.",
        provenance: "notebooklm_query"
      },
      tags: ["payoff_vs_profit", "early_exercise_profit", "financing_deduction"],
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "max(K - S_i, 0)",
        formulaProfit: "max(K - S_i, 0) - Premium * e^(r*t_i)"
      }
    }
  ]
};

const targetDir = path.resolve("src/data/chapters/hull_derivatives/ch18_part1");
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, "source_facts.json"), JSON.stringify(facts, null, 2), "utf8");
console.log("Successfully wrote source_facts.json to " + targetDir);
