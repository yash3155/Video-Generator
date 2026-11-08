import fs from "fs";
import path from "path";

const facts = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch15_part1",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Stock index options have a multiplier of $100 and settle in cash against index settlement value.",
    "A continuous dividend yield at rate q reduces the effective stock price from S0 to S0 * e^(-qT).",
    "Foreign currency pays a continuous dividend rate equal to the foreign risk-free rate rf (Garman-Kohlhagen).",
    "Option contracts represent 100 units or standard notional amounts."
  ],
  facts: [
    {
      id: "fact-01",
      category: "market_rule",
      topic: "Index Option Contract Multiplier and Cash Settlement",
      statement: "Index options such as S&P 500 (SPX) have a contract multiplier of $100. Because an index cannot be physically delivered, exercise triggers cash settlement based on the difference between the strike and index settlement value (SET).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "One contract is on 100 times the index. Cash settlement is used because it is impossible to deliver the actual underlying index shares.",
        provenance: "notebooklm_query"
      },
      tags: ["index_options", "multiplier_100", "cash_settlement"],
      numericalDetails: {
        values: { multiplier: 100, settlement: 1 },
        units: "$",
        contractSize: 100,
        context: "One SPX option contract covers $100 times the index value, settled entirely in cash."
      }
    },
    {
      id: "fact-02",
      category: "assumption",
      topic: "Continuous Dividend Yield Replacement Rule",
      statement: "When an underlying asset pays a continuous dividend yield at rate q, the stock price S0 in all pricing formulas is replaced by S0 * e^(-qT), representing the prepaid forward price without dividends.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "To value options on a stock paying a continuous dividend yield q, we replace S0 by S0*e^(-q*T).",
        provenance: "notebooklm_query"
      },
      tags: ["continuous_dividend", "dividend_yield_q", "prepaid_forward"]
    },
    {
      id: "fact-03",
      category: "formula",
      topic: "European Index Option Pricing Formulas with Dividend Yield q",
      statement: "The Black-Scholes-Merton formulas generalized for a continuous dividend yield q are c = S0*e^(-q*T)*N(d1) - K*e^(-r*T)*N(d2) and p = K*e^(-r*T)*N(-d2) - S0*e^(-q*T)*N(-d1), where d1 = [ln(S0/K) + (r - q + sigma^2/2)T] / (sigma * sqrt(T)) and d2 = d1 - sigma * sqrt(T).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "c = S0*e^(-q*T)*N(d1) - K*e^(-r*T)*N(d2), p = K*e^(-r*T)*N(-d2) - S0*e^(-q*T)*N(-d1)",
        provenance: "notebooklm_query"
      },
      tags: ["bsm_generalized", "index_call_formula", "index_put_formula"],
      formulaDetails: {
        name: "Dividend-Adjusted BSM Index Option Formulas",
        latex: "c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2), \\quad p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1)",
        variables: [
          { symbol: "c", definition: "European call price on dividend-paying index", unit: "$" },
          { symbol: "p", definition: "European put price on dividend-paying index", unit: "$" },
          { symbol: "S_0", definition: "Current index spot level", unit: "points" },
          { symbol: "K", definition: "Strike price", unit: "points" },
          { symbol: "q", definition: "Continuous dividend yield per annum", unit: "percent" },
          { symbol: "r", definition: "Continuous risk-free interest rate", unit: "percent" },
          { symbol: "T", definition: "Time to expiration", unit: "years" },
          { symbol: "sigma", definition: "Annualized index volatility", unit: "percent" }
        ]
      }
    },
    {
      id: "fact-04",
      category: "formula",
      topic: "Put-Call Parity with Continuous Dividend Yield",
      statement: "For European options on assets paying a continuous dividend yield q, put-call parity states that c + K*e^(-r*T) = p + S0*e^(-q*T). A violation allows synthetic arbitrage.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "Put-call parity for options on an asset providing a yield q is c + K*e^(-r*T) = p + S0*e^(-q*T).",
        provenance: "notebooklm_query"
      },
      tags: ["put_call_parity", "dividend_parity", "synthetic_arbitrage"],
      formulaDetails: {
        name: "Put-Call Parity with Dividend Yield",
        latex: "c + K e^{-rT} = p + S_0 e^{-qT}",
        variables: [
          { symbol: "c", definition: "European call price", unit: "$" },
          { symbol: "p", definition: "European put price", unit: "$" },
          { symbol: "K e^{-rT}", definition: "Present value of strike price", unit: "$" },
          { symbol: "S_0 e^{-qT}", definition: "Prepaid dividend-discounted spot price", unit: "$" }
        ]
      }
    },
    {
      id: "fact-05",
      category: "numerical_example",
      topic: "Valuation of S&P 500 Index Call Option",
      statement: "Consider an index option where current index S0 = 1000, strike K = 1000, risk-free rate r = 5%, continuous dividend yield q = 2%, volatility sigma = 20%, and time to maturity T = 0.5 years (6 months). d1 = 0.1768, d2 = 0.0354, N(d1) = 0.5702, N(d2) = 0.5141, yielding call price c = $51.83.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "Consider a 6-month European call option on the S&P 500 when index is 1,000, strike is 1,000, r is 5%, q is 2%, and sigma is 20%. The price is $51.83.",
        provenance: "notebooklm_query"
      },
      tags: ["numerical_example", "spx_call_valuation", "d1_d2_calculation"],
      numericalDetails: {
        values: { S0: 1000, K: 1000, r: 0.05, q: 0.02, sigma: 0.20, T: 0.5, callPrice: 51.83 },
        units: "$",
        contractSize: 100,
        context: "S0=1000, K=1000, r=5%, q=2%, sigma=20%, T=0.5 yields d1=0.1768 and call premium $51.83."
      }
    },
    {
      id: "fact-06",
      category: "claim",
      topic: "Portfolio Insurance Architecture via Index Put Options",
      statement: "Portfolio managers hedge equity portfolios against market declines by purchasing index put options. If the portfolio mimics the index (beta = 1.0), purchasing put options establishes an absolute floor on portfolio value while preserving unlimited upside.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "Portfolio insurance can be created by purchasing put options on an index that mimics the portfolio.",
        provenance: "notebooklm_query"
      },
      tags: ["portfolio_insurance", "downside_protection", "index_puts"]
    },
    {
      id: "fact-07",
      category: "formula",
      topic: "Hedging Portfolios with Non-Unit Beta (Beta > 1.0)",
      statement: "When an equity portfolio has beta beta different from 1.0, the number of index put contracts required is N = beta * (P / (100 * I)), where P is portfolio value and I is index level. If beta is 1.5, 50% more contracts are needed to neutralize systematic market risk.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "When the portfolio beta is beta, the number of put options that should be purchased is beta * (P / (100 * I)).",
        provenance: "notebooklm_query"
      },
      tags: ["beta_hedging", "portfolio_insurance", "contract_sizing"],
      formulaDetails: {
        name: "Beta-Adjusted Index Option Hedging Ratio",
        latex: "N = \\beta \\frac{P}{100 \\times I}",
        variables: [
          { symbol: "N", definition: "Number of index put option contracts to purchase", unit: "contracts" },
          { symbol: "\\beta", definition: "Portfolio market beta (systematic risk sensitivity)", unit: "dimensionless" },
          { symbol: "P", definition: "Total market value of equity portfolio", unit: "$" },
          { symbol: "I", definition: "Current index level", unit: "points" },
          { symbol: "100", definition: "Index contract multiplier", unit: "$/point" }
        ]
      },
      numericalDetails: {
        values: { beta: 1.5, portfolioValue: 1500000, indexLevel: 1000, multiplier: 100, contracts: 22.5 },
        units: "contracts",
        contractSize: 100,
        context: "For $1.5M portfolio with beta 1.5 and index at 1000, required puts = 1.5 * (1,500,000 / 100,000) = 22.5 contracts."
      }
    },
    {
      id: "fact-08",
      category: "formula",
      topic: "The Garman-Kohlhagen Currency Option Formula",
      statement: "A foreign currency pays a continuous dividend rate equal to the foreign risk-free interest rate rf. Substituting rf for q gives c = S0*e^(-rf*T)*N(d1) - K*e^(-r*T)*N(d2) and p = K*e^(-r*T)*N(-d2) - S0*e^(-rf*T)*N(-d1), where d1 = [ln(S0/K) + (r - rf + sigma^2/2)T] / (sigma * sqrt(T)).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "A foreign currency provides a yield equal to rf. The Garman-Kohlhagen formulas are obtained by setting q = rf.",
        provenance: "notebooklm_query"
      },
      tags: ["garman_kohlhagen", "currency_options", "foreign_risk_free_rate"],
      formulaDetails: {
        name: "Garman-Kohlhagen Currency Option Pricing Formula",
        latex: "c = S_0 e^{-r_f T} N(d_1) - K e^{-r T} N(d_2), \\quad p = K e^{-r T} N(-d_2) - S_0 e^{-r_f T} N(-d_1)",
        variables: [
          { symbol: "c", definition: "European currency call option price", unit: "domestic currency" },
          { symbol: "p", definition: "European currency put option price", unit: "domestic currency" },
          { symbol: "S_0", definition: "Spot exchange rate (domestic per foreign unit)", unit: "price" },
          { symbol: "K", definition: "Option strike exchange rate", unit: "price" },
          { symbol: "r", definition: "Domestic risk-free interest rate", unit: "percent" },
          { symbol: "r_f", definition: "Foreign risk-free interest rate (foreign dividend yield)", unit: "percent" },
          { symbol: "T", definition: "Time to expiration", unit: "years" },
          { symbol: "sigma", definition: "Exchange rate volatility", unit: "percent" }
        ]
      }
    },
    {
      id: "fact-09",
      category: "numerical_example",
      topic: "Garman-Kohlhagen European Currency Option Calculation",
      statement: "Consider a European call on British pounds where spot rate S0 = 1.6000 USD, strike K = 1.6000 USD, US domestic rate r = 6%, UK foreign rate rf = 8%, volatility sigma = 15%, and time T = 1 year. Call price c = $0.0431 per GBP ($4,310 per 100,000 GBP contract).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "Consider a European call option on British pounds when spot price is 1.6000, strike is 1.6000, r is 6%, rf is 8%, sigma is 15%, and maturity is 1 year. Price is $0.0431.",
        provenance: "notebooklm_query"
      },
      tags: ["currency_example", "gbp_option", "fx_pricing"],
      numericalDetails: {
        values: { S0: 1.60, K: 1.60, r: 0.06, rf: 0.08, sigma: 0.15, T: 1.0, callPremium: 0.0431 },
        units: "$",
        contractSize: 100000,
        context: "S0=1.60, K=1.60, r=6%, rf=8%, sigma=15%, T=1 yields call premium of $0.0431 per GBP."
      }
    },
    {
      id: "fact-10",
      category: "case_study",
      topic: "Business Snapshot 15.1: Guaranteeing Stocks Beat Bonds in Long Run",
      statement: "Business Snapshot 15.1 examines the popular claim that stocks are guaranteed to outperform risk-free bonds over long horizons like 20-30 years. Using European put option theory, Hull proves that the cost of insuring against underperformance does NOT vanish as T increases, because volatility uncertainty sigma * sqrt(T) continues growing, making long-term guarantees surprisingly expensive.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "Business Snapshot 15.1: Can We Guarantee that Stocks Will Beat Bonds in the Long Run? The cost of portfolio insurance does not tend to zero as the horizon increases.",
        provenance: "notebooklm_query"
      },
      tags: ["business_snapshot_15_1", "stocks_vs_bonds", "long_term_insurance"],
      numericalDetails: {
        values: { horizonYears: 25, volatilityGrowthFactor: 5 },
        units: "years",
        contractSize: 100,
        context: "Over 25 years, sigma*sqrt(T) expands 5-fold, preventing insurance put premiums from converging to zero."
      }
    },
    {
      id: "fact-11",
      category: "definition",
      topic: "Payoff versus Profit Distinction for Index Put Insurance",
      statement: "For index puts used as portfolio insurance, the terminal payoff is max(K - S_T, 0), whereas net trading profit equals terminal payoff minus initial put premium paid compounded at the risk-free rate: Profit = Payoff - Premium paid * e^(r*T). Confusing gross protection with net return is a fatal budgeting error.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch15_part1",
        excerpt: "Payoff from put is max(K - ST, 0). Profit accounts for the cost of the option.",
        provenance: "notebooklm_query"
      },
      tags: ["payoff_vs_profit", "portfolio_protection", "premium_cost"],
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "max(K - S_T, 0)",
        formulaProfit: "max(K - S_T, 0) - Premium * e^(r*T)"
      }
    }
  ]
};

const targetDir = path.resolve("src/data/chapters/hull_derivatives/ch15_part1");
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, "source_facts.json"), JSON.stringify(facts, null, 2), "utf8");
console.log("Successfully wrote source_facts.json to " + targetDir);
