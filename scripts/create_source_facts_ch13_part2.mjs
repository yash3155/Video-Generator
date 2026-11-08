import fs from 'fs';
import path from 'path';

const sourceFactsCh13Part2 = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch13_part2",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Stock price evolves according to geometric Brownian motion with constant volatility sigma and constant risk-free rate r.",
    "Frictionless financial markets with no transaction costs, continuous trading, and short selling with full use of proceeds.",
    "Dividends are either zero or modeled as a continuous yield q (or discrete dividend D paid at known ex-dividend dates).",
    "Standard exchange option contracts represent exactly 100 shares of the underlying equity."
  ],
  facts: [
    {
      id: "fact-01",
      category: "formula",
      topic: "The Black-Scholes-Merton European Call Pricing Formula",
      statement: "The Black-Scholes-Merton formula for a European call option on a non-dividend-paying stock is: c = S0 * N(d1) - K * exp(-r * T) * N(d2). Here S0 * N(d1) represents the expected present value of receiving the stock conditional on S_T > K, and K * exp(-r * T) * N(d2) represents the present value of paying the strike price. Standard exchange option contracts represent 100 shares of the underlying stock.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "The Black-Scholes-Merton pricing formula for a European call option is c = S0*N(d1) - K*exp(-rT)*N(d2)",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Black-Scholes-Merton Call Formula",
        latex: "c = S_0 N(d_1) - K e^{-rT} N(d_2)",
        variables: [
          { symbol: "c", definition: "European call option price", unit: "$" },
          { symbol: "S_0", definition: "Current stock price", unit: "$" },
          { symbol: "K", definition: "Option strike price", unit: "$" },
          { symbol: "r", definition: "Continuously compounded risk-free rate", unit: "%/year" },
          { symbol: "T", definition: "Time to expiration in years", unit: "years" },
          { symbol: "N(x)", definition: "Cumulative standard normal distribution function", unit: "probability" }
        ]
      },
      tags: ["bsm_call", "option_pricing", "analytical_solution"]
    },
    {
      id: "fact-02",
      category: "formula",
      topic: "The Black-Scholes-Merton European Put Pricing Formula",
      statement: "The Black-Scholes-Merton formula for a European put option on a non-dividend-paying stock is: p = K * exp(-r * T) * N(-d2) - S0 * N(-d1). Using Put-Call Parity c + K * exp(-r * T) = p + S0, the put price reflects the present value of receiving strike K minus the expected stock cost conditional on expiration below strike.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "The Black-Scholes-Merton formula for a European put option is p = K*exp(-rT)*N(-d2) - S0*N(-d1)",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Black-Scholes-Merton Put Formula",
        latex: "p = K e^{-rT} N(-d_2) - S_0 N(-d_1)",
        variables: [
          { symbol: "p", definition: "European put option price", unit: "$" },
          { symbol: "K", definition: "Option strike price", unit: "$" },
          { symbol: "S_0", definition: "Current stock price", unit: "$" },
          { symbol: "r", definition: "Continuously compounded risk-free rate", unit: "%/year" },
          { symbol: "T", definition: "Time to expiration in years", unit: "years" },
          { symbol: "N(-d)", definition: "Lower tail standard normal cumulative probability", unit: "probability" }
        ]
      },
      tags: ["bsm_put", "put_pricing", "put_call_parity"]
    },
    {
      id: "fact-03",
      category: "formula",
      topic: "Formulas for d1 and d2 Parameters",
      statement: "The dimensionless standardized variables d1 and d2 in the Black-Scholes-Merton model are defined as: d1 = [ln(S0 / K) + (r + sigma^2 / 2) * T] / [sigma * sqrt(T)], and d2 = d1 - sigma * sqrt(T) = [ln(S0 / K) + (r - sigma^2 / 2) * T] / [sigma * sqrt(T)]. They measure how many standard deviations the log strike is from the expected terminal stock price.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "d1 = [ln(S0/K) + (r + sigma^2/2)*T] / (sigma*sqrt(T)) and d2 = d1 - sigma*sqrt(T)",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Standardized Parameters d1 and d2",
        latex: "d_1 = \\frac{\\ln(S_0 / K) + \\left(r + \\frac{\\sigma^2}{2}\\right)T}{\\sigma \\sqrt{T}}, \\quad d_2 = d_1 - \\sigma \\sqrt{T}",
        variables: [
          { symbol: "d_1", definition: "Standardized upper moneyness parameter (call delta proxy)", unit: "dimensionless" },
          { symbol: "d_2", definition: "Standardized risk-neutral exercise threshold", unit: "dimensionless" },
          { symbol: "S_0 / K", definition: "Moneyness ratio", unit: "dimensionless" },
          { symbol: "\\sigma", definition: "Annualized stock price volatility", unit: "%" },
          { symbol: "T", definition: "Time horizon in years", unit: "years" }
        ]
      },
      tags: ["d1_d2", "moneyness", "standard_normal_arguments"]
    },
    {
      id: "fact-04",
      category: "definition",
      topic: "Intuition of N(d1) and N(d2)",
      statement: "In risk-neutral pricing theory, N(d2) has a direct probabilistic meaning: it is the exact probability that the European call option will be exercised in a risk-neutral world, P(S_T > K). Meanwhile, N(d1) represents the partial derivative of option price with respect to stock price, dc/dS0, which is the dynamic Delta (hedge ratio) needed to replicate the call option.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "N(d2) is the probability that the option will be exercised in a risk-neutral world. N(d1) is the delta of the call option",
        provenance: "notebooklm_query"
      },
      tags: ["n_d1", "n_d2", "delta_hedging", "risk_neutral_probability"]
    },
    {
      id: "fact-05",
      category: "numerical_example",
      topic: "Hull Benchmark BSM Option Pricing Calculation",
      statement: "Consider Hull's benchmark numerical example: stock price S0 = $42.00, strike K = $40.00, risk-free rate r = 10% per annum, volatility sigma = 20% per annum, and maturity T = 0.5 years (6 months). Here ln(42 / 40) = 0.04879, (r + sigma^2 / 2)*T = (0.10 + 0.02)*0.5 = 0.06, and sigma*sqrt(T) = 0.20*sqrt(0.5) = 0.14142. Thus d1 = (0.04879 + 0.06) / 0.14142 = 0.7693 and d2 = 0.7693 - 0.14142 = 0.6279. Cumulative probabilities are N(d1) = 0.7791 and N(d2) = 0.7350. The European call price is c = 42 * 0.7791 - 40 * exp(-0.05) * 0.7350 = $32.722 - $27.966 = $4.76 per share ($476 per 100-share contract). The European put price is p = 40 * exp(-0.05) * (1 - 0.7350) - 42 * (1 - 0.7791) = $0.81 per share ($81 per contract).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "Consider a 6-month European call with strike $40 on a stock with S0 = $42, r = 10%, sigma = 20%. d1 = 0.7693, d2 = 0.6279, N(d1) = 0.7791, N(d2) = 0.7350, c = $4.76, p = $0.81",
        provenance: "notebooklm_query"
      },
      numericalDetails: {
        values: {
          stockSpot: 42,
          strike: 40,
          riskFreeRate: 0.10,
          volatility: 0.20,
          maturityYears: 0.5,
          d1: 0.7693,
          d2: 0.6279,
          Nd1: 0.7791,
          Nd2: 0.7350,
          callPrice: 4.76,
          putPrice: 0.81,
          contractSize: 100
        },
        units: "$",
        contractSize: 100,
        context: "Hull Section 13.7 Black-Scholes-Merton numerical benchmark calculation."
      },
      tags: ["numerical_example", "bsm_benchmark", "hull_calculation"]
    },
    {
      id: "fact-06",
      category: "definition",
      topic: "Implied Volatility and the CBOE VIX Index",
      statement: "Implied volatility is the volatility value that equates the Black-Scholes-Merton theoretical option price to its active market price. Calculated using iterative root-finding (such as Newton-Raphson), implied volatility represents market consensus on future uncertainty. The CBOE VIX Index aggregates implied volatilities across a wide band of 30-day S&P 500 index options, providing a real-time gauge of expected near-term market turbulence ('the fear index').",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "Implied volatility is the volatility implied by an option price observed in the market. The CBOE VIX index is an index of the implied volatility of 30-day options on the S&P 500",
        provenance: "notebooklm_query"
      },
      tags: ["implied_volatility", "cboe_vix", "market_fear_gauge"]
    },
    {
      id: "fact-07",
      category: "formula",
      topic: "Continuous Dividend Yield (q) Adjustment in BSM",
      statement: "When an underlying stock pays a continuous dividend yield at rate q, the stock price discounted at expiration is S0 * exp(-q * T). The generalized Black-Scholes-Merton call and put formulas become: c = S0 * exp(-q * T) * N(d1) - K * exp(-r * T) * N(d2), and p = K * exp(-r * T) * N(-d2) - S0 * exp(-q * T) * N(-d1), where d1 = [ln(S0 / K) + (r - q + sigma^2 / 2) * T] / [sigma * sqrt(T)].",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "When dividends are paid continuously at rate q, we replace S0 by S0*exp(-q*T) in the Black-Scholes-Merton formulas",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Dividend-Adjusted BSM Formulas",
        latex: "c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2), \\quad d_1 = \\frac{\\ln(S_0 / K) + \\left(r - q + \\frac{\\sigma^2}{2}\\right)T}{\\sigma \\sqrt{T}}",
        variables: [
          { symbol: "q", definition: "Continuous dividend yield per annum", unit: "%/year" },
          { symbol: "S_0 e^{-qT}", definition: "Dividend-discounted stock price", unit: "$" },
          { symbol: "c", definition: "Dividend-adjusted European call price", unit: "$" },
          { symbol: "p", definition: "Dividend-adjusted European put price", unit: "$" }
        ]
      },
      tags: ["dividend_yield", "continuous_dividend", "merton_extension"]
    },
    {
      id: "fact-08",
      category: "definition",
      topic: "American Call Early Exercise Prior to Ex-Dividend Dates",
      statement: "On non-dividend-paying stocks, American calls should never be exercised early (C = c) because holding preserves time value and insurance against price drops. However, on dividend-paying stocks, an American call holder may optimally exercise immediately prior to the ex-dividend date t1 if the anticipated cash dividend D exceeds the interest lost on delaying payment of strike K: D > K * [1 - exp(-r * (T - t1))].",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "It is never optimal to exercise an American call on a non-dividend paying stock early. On dividend-paying stocks, early exercise is optimal immediately prior to an ex-dividend date if D > K*[1 - exp(-r*(T - t1))]",
        provenance: "notebooklm_query"
      },
      tags: ["american_call", "early_exercise", "ex_dividend_boundary"]
    },
    {
      id: "fact-09",
      category: "formula",
      topic: "Gross Payoff versus Net Trading Profit for European Options",
      statement: "A cornerstone risk invariant across all option pricing is distinguishing terminal Gross Payoff from Net Trading Profit: Profit = Payoff - Premium paid. For Hull's benchmark call option bought for premium c0 = $4.76 with strike K = $40.00: if stock finishes at S_T = $50.00, terminal Gross Payoff is max(S_T - K, 0) = $10.00 per share ($1,000 per contract), but net trading profit realized is Payoff - Premium = $10.00 - $4.76 = $5.24 per share ($524 per 100-share contract). Profit = Payoff - Premium paid.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "Payoff is the gross terminal cash flow. Net profit subtracts the original premium paid: Profit = Payoff - Premium paid",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Gross Payoff vs Net Trading Profit Invariant",
        latex: "\\text{Net Profit}_{call} = \\max(S_T - K, 0) - c_0",
        variables: [
          { symbol: "S_T - K", definition: "Terminal gross cash payoff", unit: "$" },
          { symbol: "c_0", definition: "Initial BSM option premium paid", unit: "$" },
          { symbol: "\\text{Net Profit}", definition: "Net economic profit", unit: "$" }
        ]
      },
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "Payoff = max(S_T - K, 0)",
        formulaProfit: "Profit = Payoff - Premium paid"
      },
      tags: ["payoff_vs_profit", "risk_invariant", "trading_profit"]
    },
    {
      id: "fact-10",
      category: "case_study",
      topic: "Black's Approximation for American Calls on Dividend-Paying Stocks",
      statement: "Fischer Black proposed an elegant practical approximation for valuing American call options with discrete dividends: evaluate two European options—one expiring just before the ex-dividend date t1, and one expiring at final maturity T—and set the American call price equal to the greater of the two values. Black's approximation provides institutional desks with a fast, accurate proxy without building full numerical lattices.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "Black's approximation involves calculating European option prices with maturities t1 and T and taking the maximum. It is widely used by traders for American calls",
        provenance: "notebooklm_query"
      },
      tags: ["blacks_approximation", "american_calls", "discrete_dividends"]
    },
    {
      id: "fact-11",
      category: "definition",
      topic: "Put-Call Parity with Continuous Dividends",
      statement: "For European options on assets paying a continuous dividend yield q, Put-Call Parity is generalized to: c + K * exp(-r * T) = p + S0 * exp(-q * T). Any violation of this equality enables immediate arbitrage by buying the underpriced side and shorting the overpriced synthetic portfolio.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch13_part2",
        excerpt: "Put-call parity for options on a stock paying a continuous dividend yield q is c + K*exp(-rT) = p + S0*exp(-qT)",
        provenance: "notebooklm_query"
      },
      tags: ["put_call_parity", "dividend_parity", "no_arbitrage"]
    }
  ]
};

const dirs = [
  path.resolve('src/data/chapters/hull_derivatives/ch13_part2'),
  path.resolve('src/data/chapters/hull_derivatives_en/ch13_part2')
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'source_facts.json');
  fs.writeFileSync(filePath, JSON.stringify(sourceFactsCh13Part2, null, 2), 'utf8');
  console.log(`Saved source_facts.json to: ${filePath}`);
}
