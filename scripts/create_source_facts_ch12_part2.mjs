import fs from 'fs';
import path from 'path';

const sourceFactsCh12Part2 = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch12_part2",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Stock price follows a discrete multiplicative two-step binomial tree over total maturity T with step duration dt = T/2.",
    "Frictionless financial markets with zero transaction costs, no margin interest penalties, and unrestricted short selling.",
    "Constant risk-free borrowing and lending interest rate r compounded continuously.",
    "Standard exchange option contracts represent exactly 100 shares of the underlying equity."
  ],
  facts: [
    {
      id: "fact-01",
      category: "definition",
      topic: "Two-Step Binomial Tree Framework",
      statement: "A two-step binomial tree models the stock price path over two discrete time intervals of length dt = T/2. From initial price S0, the stock can transition to up-state S0*u or down-state S0*d at step 1, and to three terminal states at step 2: up-up (S0*u^2), up-down (S0*u*d), or down-down (S0*d^2). Standard option contracts represent 100 shares of the underlying stock.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "A two-step tree can be used to value options over two time steps of length delta_t. The terminal stock prices are S0*u^2, S0*u*d, and S0*d^2",
        provenance: "notebooklm_query"
      },
      tags: ["two_step_tree", "recombining_tree", "discrete_lattice"]
    },
    {
      id: "fact-02",
      category: "formula",
      topic: "Two-Step Backward Induction Valuation Formula",
      statement: "The value of an option at any intermediate node is determined by discounting the risk-neutral expected payoff from the next period: f = exp(-r*dt) * [p * fu + (1 - p) * fd]. For a two-step European option at time zero, direct compounding yields f = exp(-2*r*dt) * [p^2 * fuu + 2*p*(1-p) * fud + (1-p)^2 * fdd].",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "Repeated application of the risk-neutral valuation argument shows that f = exp(-2*r*dt)*[p^2*fuu + 2*p*(1-p)*fud + (1-p)^2*fdd]",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Two-Step Option Pricing Formula",
        latex: "f = e^{-2r\\Delta t} \\left[ p^2 f_{uu} + 2p(1-p) f_{ud} + (1-p)^2 f_{dd} \\right]",
        variables: [
          { symbol: "f", definition: "Option price at time zero", unit: "$" },
          { symbol: "r", definition: "Risk-free interest rate", unit: "%" },
          { symbol: "\\Delta t", definition: "Length of each time step", unit: "years" },
          { symbol: "p", definition: "Risk-neutral probability of an up move", unit: "unitless" },
          { symbol: "f_{uu}", definition: "Terminal option payoff in double-up state", unit: "$" },
          { symbol: "f_{ud}", definition: "Terminal option payoff in up-down state", unit: "$" },
          { symbol: "f_{dd}", definition: "Terminal option payoff in double-down state", unit: "$" }
        ]
      },
      tags: ["backward_induction", "risk_neutral_pricing", "binomial_formula"]
    },
    {
      id: "fact-03",
      category: "formula",
      topic: "Node-by-Node Dynamic Delta Hedging Formula",
      statement: "Because the hedge ratio changes across nodes as stock prices evolve, Delta must be dynamically recalculated at each node: Delta = (fu - fd) / (S_up - S_down). At node A (initial), Delta_0 = (f_u - f_d) / (S0*u - S0*d); at node B (up), Delta_u = (f_uu - f_ud) / (S0*u^2 - S0*u*d); and at node C (down), Delta_d = (f_ud - f_dd) / (S0*u*d - S0*d^2).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "The value of Delta changes as we move through the tree. At node A, Delta = (fu - fd)/(Su - Sd). At node B, Delta = (fuu - fud)/(Suu - Sud)",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Node-Specific Delta Hedge Ratio",
        latex: "\\Delta_{node} = \\frac{f_{up} - f_{down}}{S_{up} - S_{down}}",
        variables: [
          { symbol: "\\Delta_{node}", definition: "Shares needed to hedge option at specific node", unit: "shares" },
          { symbol: "f_{up}", definition: "Option value at subsequent upper node", unit: "$" },
          { symbol: "f_{down}", definition: "Option value at subsequent lower node", unit: "$" },
          { symbol: "S_{up}", definition: "Stock price at subsequent upper node", unit: "$" },
          { symbol: "S_{down}", definition: "Stock price at subsequent lower node", unit: "$" }
        ]
      },
      tags: ["dynamic_hedging", "delta_replication", "node_delta"]
    },
    {
      id: "fact-04",
      category: "numerical_example",
      topic: "Two-Step European Call Valuation Example",
      statement: "Consider Hull's benchmark two-step European call option example with S0 = $50, strike K = $52, risk-free rate r = 5% per annum, total maturity T = 2 years, step duration dt = 1 year, up factor u = 1.2, and down factor d = 0.8. Risk-neutral probability p = (exp(0.05*1) - 0.8)/(1.2 - 0.8) = (1.0513 - 0.8)/0.4 = 0.6282, and 1 - p = 0.3718. For 1 standard contract of 100 shares, the initial option value is $7.14 per share, giving a contract value of $714.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "Figure 12.4 shows a two-step tree for valuing a two-year European call with K = 52 on a stock with S0 = 50, u = 1.2, d = 0.8, r = 5%. The option price is 7.14",
        provenance: "notebooklm_query"
      },
      numericalDetails: {
        values: {
          contractSize: 100,
          initialStockPrice: 50,
          strikePrice: 52,
          riskFreeRate: 0.05,
          totalTimeYears: 2,
          stepTimeYears: 1,
          upFactor: 1.2,
          downFactor: 0.8,
          riskNeutralProb: 0.6282,
          step1UpStockPrice: 60,
          step1DownStockPrice: 40,
          terminalStockUU: 72,
          terminalStockUD: 48,
          terminalStockDD: 32,
          payoffUU: 20,
          payoffUD: 0,
          payoffDD: 0,
          step1CallU: 11.95,
          step1CallD: 0,
          initialCallValue: 7.14,
          deltaNodeA: 0.5975,
          deltaNodeB: 0.8333,
          deltaNodeC: 0
        },
        units: "$",
        contractSize: 100,
        context: "Hull Section 12.3 Two-step European call valuation and backward induction."
      },
      tags: ["two_step_call", "hull_example", "numerical_benchmark"]
    },
    {
      id: "fact-05",
      category: "definition",
      topic: "American Option Early Exercise Decision Rule",
      statement: "At every node in a binomial tree, an American option holder compares the immediate early exercise intrinsic value against the continuation value obtained from holding the option. The node value equals max(Immediate Exercise Value, Continuation Value). For an American put option, early exercise occurs whenever K - S exceeds exp(-r*dt) * [p * fu + (1 - p) * fd].",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "At each node, the American option price is the greater of the value given by risk-neutral discounting and the payoff from early exercise: max(K - S, continuation)",
        provenance: "notebooklm_query"
      },
      tags: ["american_option", "early_exercise", "optimal_stopping"]
    },
    {
      id: "fact-06",
      category: "numerical_example",
      topic: "American Put Early Exercise and Valuation Example",
      statement: "Consider Hull's two-step American put option example with S0 = $50, K = $52, r = 5%, T = 2 years, dt = 1 year, u = 1.2, d = 0.8, p = 0.6282. At maturity (step 2), payoffs are: fuu = $0, fud = $4 ($52 - $48), and fdd = $20 ($52 - $32). At step 1, node B (S = $60): continuation value is exp(-0.05)*[0.6282*0 + 0.3718*4] = $1.414, intrinsic value is max(52 - 60, 0) = $0, so node B = $1.414 (no early exercise). At node C (S = $40): continuation value is exp(-0.05)*[0.6282*4 + 0.3718*20] = $9.463, but intrinsic value is $52 - $40 = $12.00! Because $12.00 > $9.463, early exercise is optimal at node C, setting node C value to $12.00. At time zero (node A): continuation value is exp(-0.05)*[0.6282*1.414 + 0.3718*12.00] = $5.088 ($5.09), exceeding intrinsic value max(52 - 50, 0) = $2.00. Thus, American put value is $5.09, compared to only $4.19 for a European put, demonstrating a $0.90 early exercise premium.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "At node C, the value from continuing is 9.46, but the value from immediate exercise is 12.00. Early exercise is therefore optimal at node C, making the American put worth 5.09 at node A",
        provenance: "notebooklm_query"
      },
      numericalDetails: {
        values: {
          contractSize: 100,
          initialStockPrice: 50,
          strikePrice: 52,
          riskFreeRate: 0.05,
          totalTimeYears: 2,
          stepTimeYears: 1,
          upFactor: 1.2,
          downFactor: 0.8,
          riskNeutralProb: 0.6282,
          step1UpStockPrice: 60,
          step1DownStockPrice: 40,
          terminalPutUU: 0,
          terminalPutUD: 4,
          terminalPutDD: 20,
          nodeBContinuation: 1.414,
          nodeBIntrinsic: 0,
          nodeBChosenValue: 1.414,
          nodeCContinuation: 9.463,
          nodeCIntrinsic: 12.00,
          nodeCChosenValue: 12.00,
          nodeCEarlyExerciseOptimal: 1,
          americanPutInitialValue: 5.09,
          europeanPutInitialValue: 4.19,
          earlyExercisePremium: 0.90
        },
        units: "$",
        contractSize: 100,
        context: "Hull Section 12.5 American put option early exercise decision at node C."
      },
      tags: ["american_put", "early_exercise", "numerical_proof", "hull_example"]
    },
    {
      id: "fact-07",
      category: "formula",
      topic: "Gross Payoff versus Net Trading Profit for Put Options",
      statement: "A fundamental risk rule in option trading is distinguishing terminal Gross Payoff from Net Trading Profit: Profit = Payoff - Premium paid. For a long American put option with strike K = $52 purchased at premium P0 = $5.09, exercising early at S = $40 generates a gross cash payoff of K - S = $12.00, but the net profit realized is Payoff - Premium = $12.00 - $5.09 = $6.91 per share ($691 per 100-share contract). Profit = Payoff - Premium paid.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "The payoff from an option is the gross terminal cash flow. The net profit must account for the initial option premium paid: Profit = Payoff - Premium",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Gross Payoff vs Net Profit Distinction",
        latex: "\\text{Net Profit}_{put} = \\max(K - S_t, 0) - P_0",
        variables: [
          { symbol: "K - S_t", definition: "Gross terminal or early exercise cash payoff", unit: "$" },
          { symbol: "P_0", definition: "Initial option premium paid", unit: "$" },
          { symbol: "\\text{Net Profit}", definition: "Realized financial profit", unit: "$" }
        ]
      },
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "Payoff = max(K - S_t, 0)",
        formulaProfit: "Profit = Payoff - Premium paid"
      },
      tags: ["payoff_vs_profit", "risk_management", "option_economics"]
    },
    {
      id: "fact-08",
      category: "formula",
      topic: "Cox-Ross-Rubinstein (CRR) Volatility Parameter Matching",
      statement: "To match the volatility sigma of a stock in continuous time over small time steps dt, Cox, Ross, and Rubinstein set the tree parameters as: u = exp(sigma * sqrt(dt)), d = 1/u = exp(-sigma * sqrt(dt)), and risk-neutral probability p = (exp(r*dt) - d)/(u - d). This parameterization matches both the expected drift and the variance of the underlying lognormal stock price distribution.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "Cox, Ross, and Rubinstein proposed setting u = exp(sigma*sqrt(delta_t)) and d = 1/u. This ensures that the tree matches the volatility of the stock price process",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Cox-Ross-Rubinstein Volatility Parameterization",
        latex: "u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = \\frac{1}{u} = e^{-\\sigma \\sqrt{\\Delta t}}, \\quad p = \\frac{e^{r\\Delta t} - d}{u - d}",
        variables: [
          { symbol: "u", definition: "Multiplicative up step factor", unit: "unitless" },
          { symbol: "d", definition: "Multiplicative down step factor", unit: "unitless" },
          { symbol: "\\sigma", definition: "Annualized stock price volatility", unit: "%" },
          { symbol: "\\Delta t", definition: "Length of discrete time step", unit: "years" },
          { symbol: "r", definition: "Risk-free interest rate", unit: "%" },
          { symbol: "p", definition: "Risk-neutral probability of up move", unit: "unitless" }
        ]
      },
      tags: ["crr_parameters", "volatility_matching", "discrete_continuous_convergence"]
    },
    {
      id: "fact-09",
      category: "definition",
      topic: "Lattice Convergence to Black-Scholes-Merton Continuous Limit",
      statement: "As the number of binomial steps N approaches infinity and step duration dt approaches zero (dt = T/N -> 0), the discrete binomial distribution of log stock prices converges to the continuous normal distribution under the Central Limit Theorem. Consequently, the binomial tree European option price converges smoothly to the exact continuous-time Black-Scholes-Merton formula value.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "As the number of time steps N is increased, the binomial tree model converges to the Black-Scholes-Merton model",
        provenance: "notebooklm_query"
      },
      tags: ["convergence", "black_scholes_limit", "central_limit_theorem"]
    },
    {
      id: "fact-10",
      category: "definition",
      topic: "Dividend-Yield Adjustment in Two-Step Binomial Trees",
      statement: "When an underlying stock pays a continuous dividend yield q, the growth rate of the stock under risk-neutral expectations becomes r - q instead of r. The parameter a in the risk-neutral probability formula adjusts to a = exp((r - q)*dt), yielding p = (exp((r - q)*dt) - d)/(u - d), while u and d remain defined by stock volatility sigma.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "When a stock pays a continuous dividend yield at rate q, the parameter a becomes a = exp((r - q)*delta_t), and p = (a - d)/(u - d)",
        provenance: "notebooklm_query"
      },
      tags: ["continuous_dividend", "dividend_yield", "tree_adjustment"]
    },
    {
      id: "fact-11",
      category: "case_study",
      topic: "Dynamic Delta Hedging Breakdown in Market Gaps",
      statement: "Binomial tree replication assumes continuous or discrete liquidity at every node. During market crashes such as Black Monday (October 1987), stock prices gapped downwards past intermediate tree nodes before delta hedges could be adjusted. Without continuous trading liquidity, dynamic delta hedging portfolios suffered severe slippage, demonstrating that discrete jump risk violates continuous lattice assumptions.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch12_part2",
        excerpt: "In practice, dynamic hedging is imperfect because prices jump and trading cannot occur continuously, as seen during market crashes",
        provenance: "notebooklm_query"
      },
      tags: ["jump_risk", "dynamic_hedging_slippage", "market_gaps"]
    }
  ]
};

const dirs = [
  path.resolve('src/data/chapters/hull_derivatives/ch12_part2'),
  path.resolve('src/data/chapters/hull_derivatives_en/ch12_part2')
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'source_facts.json');
  fs.writeFileSync(filePath, JSON.stringify(sourceFactsCh12Part2, null, 2), 'utf8');
  console.log(`Saved source_facts.json to: ${filePath}`);
}
