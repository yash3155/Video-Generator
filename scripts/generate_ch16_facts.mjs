import fs from "fs";
import path from "path";

const facts = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch16_part1",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "A futures option gives the holder the right to enter into a specified futures contract at a predetermined strike price.",
    "Exercising a call option results in a long futures position plus a cash payout equal to the excess of futures price over strike.",
    "Exercising a put option results in a short futures position plus a cash payout equal to the excess of strike over futures price.",
    "In risk-neutral valuation, a futures price behaves like an asset providing a continuous dividend yield equal to the risk-free rate (q = r)."
  ],
  facts: [
    {
      id: "fact-01",
      category: "market_rule",
      topic: "Mechanics of Futures Option Exercise and Settlement",
      statement: "When a futures call option is exercised, the holder acquires a long position in the underlying futures contract alongside a cash credit equal to the current futures settlement price minus the strike price (F0 - K). Conversely, exercising a put option delivers a short futures position plus cash equal to (K - F0).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "If a call futures option is exercised, the holder acquires a long position in the underlying futures contract plus a cash amount equal to the excess of the futures price over the strike price.",
        provenance: "notebooklm_query"
      },
      tags: ["futures_options_mechanics", "cash_settlement", "futures_delivery"],
      numericalDetails: {
        values: { futuresPrice: 105, strikePrice: 100, cashCredit: 5 },
        units: "$",
        contractSize: 100,
        context: "Exercising a call with strike 100 when futures are 105 credits $5 cash plus opens a long futures contract at 105."
      }
    },
    {
      id: "fact-02",
      category: "claim",
      topic: "Why Traders Prefer Futures Options to Spot Options",
      statement: "Derivatives traders widely prefer futures options over spot options for three core structural reasons: futures contracts are vastly more liquid than underlying spot commodities, physical delivery issues (storage, transport, insurance) are cleanly avoided via futures settlement, and exchange margin requirements are seamlessly netted across futures and options positions.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "Futures options are generally more popular than options on the underlying spot asset because futures markets are more liquid, transaction costs are lower, and delivery mechanics are standardized.",
        provenance: "notebooklm_query"
      },
      tags: ["liquidity_advantage", "settlement_efficiency", "margin_netting"]
    },
    {
      id: "fact-03",
      category: "formula",
      topic: "Put-Call Parity for European Futures Options",
      statement: "For European options on futures contracts, put-call parity states that c + K*e^(-r*T) = p + F0*e^(-r*T). Because creating a futures position requires zero initial investment, both the futures price F0 and the strike K are discounted to the present.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "Put-call parity for futures options is c + K*e^(-r*T) = p + F0*e^(-r*T).",
        provenance: "notebooklm_query"
      },
      tags: ["put_call_parity", "futures_options", "synthetic_futures"],
      formulaDetails: {
        name: "Futures Option Put-Call Parity",
        latex: "c + K e^{-rT} = p + F_0 e^{-rT}",
        variables: [
          { symbol: "c", definition: "European call price on futures", unit: "$" },
          { symbol: "p", definition: "European put price on futures", unit: "$" },
          { symbol: "F_0", definition: "Current futures price", unit: "$" },
          { symbol: "K", definition: "Option strike price", unit: "$" },
          { symbol: "r", definition: "Risk-free interest rate", unit: "percent" },
          { symbol: "T", definition: "Time to option maturity", unit: "years" }
        ]
      }
    },
    {
      id: "fact-04",
      category: "assumption",
      topic: "Futures Price as an Asset Providing a Continuous Dividend Yield Equal to r",
      statement: "In risk-neutral valuation, the drift of a futures contract is zero because it costs nothing to enter. Therefore, a futures contract can be treated mathematically as an asset that provides a continuous dividend yield q equal to the risk-free rate r (q = r).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "A futures price behaves like a stock paying a dividend yield equal to r. In Black-Scholes formulas, setting S0 = F0 and q = r gives Black's model.",
        provenance: "notebooklm_query"
      },
      tags: ["risk_neutral_drift", "dividend_yield_r", "zero_cost_entry"]
    },
    {
      id: "fact-05",
      category: "formula",
      topic: "Black's 1976 Model for European Futures Options",
      statement: "Fischer Black (1976) showed that European call and put options on futures are valued as c = e^(-r*T) * [F0 * N(d1) - K * N(d2)] and p = e^(-r*T) * [K * N(-d2) - F0 * N(-d1)], where d1 = [ln(F0/K) + (sigma^2 / 2)*T] / (sigma * sqrt(T)) and d2 = d1 - sigma * sqrt(T).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "Black's model gives c = e^(-r*T)[F0*N(d1) - K*N(d2)] and p = e^(-r*T)[K*N(-d2) - F0*N(-d1)].",
        provenance: "notebooklm_query"
      },
      tags: ["blacks_model_1976", "futures_call_formula", "futures_put_formula"],
      formulaDetails: {
        name: "Black's 1976 Futures Option Formulas",
        latex: "c = e^{-rT} [F_0 N(d_1) - K N(d_2)], \\quad p = e^{-rT} [K N(-d_2) - F_0 N(-d_1)]",
        variables: [
          { symbol: "c", definition: "European futures call price", unit: "$" },
          { symbol: "p", definition: "European futures put price", unit: "$" },
          { symbol: "F_0", definition: "Current futures contract price", unit: "$" },
          { symbol: "K", definition: "Strike price", unit: "$" },
          { symbol: "e^{-rT}", definition: "Discount factor at risk-free rate r over horizon T", unit: "dimensionless" },
          { symbol: "d_1", definition: "Upper standardized moneyness parameter", unit: "dimensionless" },
          { symbol: "d_2", definition: "Lower standardized risk-neutral exercise parameter", unit: "dimensionless" },
          { symbol: "sigma", definition: "Annualized volatility of futures price", unit: "percent" }
        ]
      }
    },
    {
      id: "fact-06",
      category: "numerical_example",
      topic: "Valuation of Crude Oil Futures Call Option via Black's Model",
      statement: "Consider a European call option on crude oil futures where current futures price F0 = $50, strike K = $50, risk-free rate r = 6%, futures volatility sigma = 30%, and time to option maturity T = 0.75 years (9 months). d1 = 0.1949, d2 = -0.0649, N(d1) = 0.5772, N(d2) = 0.4741, yielding call premium c = $4.87.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "Consider a 9-month European call on a commodity futures contract where F0 = 50, K = 50, r = 6%, and sigma = 30%. The call price is $4.87.",
        provenance: "notebooklm_query"
      },
      tags: ["crude_oil_example", "blacks_model_calculation", "at_the_money_call"],
      numericalDetails: {
        values: { F0: 50, K: 50, r: 0.06, sigma: 0.30, T: 0.75, d1: 0.1949, d2: -0.0649, callPrice: 4.87 },
        units: "$",
        contractSize: 1000,
        context: "F0=50, K=50, r=6%, sigma=30%, T=0.75 yields d1=0.1949 and call price $4.87 per barrel."
      }
    },
    {
      id: "fact-07",
      category: "claim",
      topic: "Practical Superiority of Black's Model over BSM",
      statement: "In practice, financial institutions prefer Black's model over standard Black-Scholes-Merton for interest rate, commodity, and currency options because futures prices F0 are observable directly on exchange order books, bypassing errors in calculating storage costs, convenience yields, or continuous dividend rates.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "Using Black's model instead of Black-Scholes-Merton is widespread because the futures price is directly observable and requires no assumptions about dividend yields or cost of carry.",
        provenance: "notebooklm_query"
      },
      tags: ["observable_futures", "no_carry_assumptions", "desk_convention"]
    },
    {
      id: "fact-08",
      category: "formula",
      topic: "Binomial Trees for Futures Options",
      statement: "When building a binomial tree for futures options, the risk-neutral probability of an up move is p = (1 - d) / (u - d), where u = e^(sigma * sqrt(delta_t)) and d = 1 / u. Because a futures contract requires no initial payment, the drift term e^(r*delta_t) is replaced by 1.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "In a binomial tree for a futures price, p = (1 - d)/(u - d) where u = e^(sigma*sqrt(dt)) and d = 1/u.",
        provenance: "notebooklm_query"
      },
      tags: ["binomial_tree", "risk_neutral_probability", "driftless_futures"],
      formulaDetails: {
        name: "Futures Binomial Tree Up Probability",
        latex: "p = \\frac{1 - d}{u - d}, \\quad u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = \\frac{1}{u}",
        variables: [
          { symbol: "p", definition: "Risk-neutral probability of an upward move in futures price", unit: "dimensionless" },
          { symbol: "u", definition: "Proportional upward step factor", unit: "dimensionless" },
          { symbol: "d", definition: "Proportional downward step factor", unit: "dimensionless" },
          { symbol: "\\Delta t", definition: "Length of binomial time step", unit: "years" }
        ]
      }
    },
    {
      id: "fact-09",
      category: "market_rule",
      topic: "American Futures Options Early Exercise Asymmetry",
      statement: "An American call on a futures contract should be exercised early when the futures price is sufficiently above the strike and the futures price is expected to decline or interest rates are high, because exercising immediately yields cash (F - K) that can earn interest at rate r, unlike spot calls where early exercise forfeits time value.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "American futures options can be exercised early. For a deep-in-the-money call, exercising early provides cash that earns interest.",
        provenance: "notebooklm_query"
      },
      tags: ["american_futures_options", "early_exercise", "interest_on_cash"]
    },
    {
      id: "fact-10",
      category: "case_study",
      topic: "Trading Desk Execution: Futures-Style Options Mechanics",
      statement: "Some exchanges trade 'futures-style options' where the buyer pays no upfront premium and both call and put positions are marked-to-market daily with margin variation like futures contracts. This eliminates interest rate discounting and aligns option cash flows directly with daily price changes.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "Futures-style options are options that are settled daily just like futures contracts. No premium is paid upfront.",
        provenance: "notebooklm_query"
      },
      tags: ["futures_style_options", "daily_marking_to_market", "zero_upfront_premium"],
      numericalDetails: {
        values: { upfrontPremium: 0, dailyVariationMargin: 1 },
        units: "$",
        contractSize: 100,
        context: "Futures-style options eliminate upfront cash outlay, settling 100% of P&L through daily variation margin."
      }
    },
    {
      id: "fact-11",
      category: "definition",
      topic: "Payoff versus Profit Distinction for Futures Options",
      statement: "For a futures call option, the terminal payoff at expiration is max(F_T - K, 0), while net trading profit equals terminal payoff minus initial option premium compounded at the risk-free rate: Profit = Payoff - Premium paid * e^(r*T). Failing to subtract option premium creates an illusion of riskless gains.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch16_part1",
        excerpt: "The payoff from a European call on futures is max(FT - K, 0). Profit deducts the future value of the premium paid.",
        provenance: "notebooklm_query"
      },
      tags: ["payoff_vs_profit", "futures_call_profit", "premium_deduction"],
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "max(F_T - K, 0)",
        formulaProfit: "max(F_T - K, 0) - Premium * e^(r*T)"
      }
    }
  ]
};

const targetDir = path.resolve("src/data/chapters/hull_derivatives/ch16_part1");
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, "source_facts.json"), JSON.stringify(facts, null, 2), "utf8");
console.log("Successfully wrote source_facts.json to " + targetDir);

