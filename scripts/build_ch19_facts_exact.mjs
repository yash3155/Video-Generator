import fs from 'fs';
import path from 'path';

const ch19Facts = {
  "schemaVersion": "1.0.0",
  "chapterSlug": "ch19_part1",
  "notebookId": "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  "sourceId": "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  "retrievalTimestamp": new Date().toISOString(),
  "bookTitle": "Fundamentals of Futures and Options Markets (John C. Hull)",
  "generalAssumptions": [
    "The Black-Scholes-Merton model assumes that asset price returns are normally distributed with constant volatility across all strike prices and maturities.",
    "Real market prices depart systematically from the flat volatility assumption of Black-Scholes-Merton, producing empirical volatility smiles and skews.",
    "Currency options exhibit a symmetric U-shaped volatility smile caused by leptokurtic exchange rate distributions with fat tails.",
    "Equity options exhibit a steep downward-sloping volatility skew (smirk) caused by leverage effects and crashophobia post-1987."
  ],
  "facts": [
    {
      "id": "fact-01",
      "category": "definition",
      "topic": "Implied Volatility & Black-Scholes Inversion",
      "statement": "Implied volatility is the volatility parameter that, when substituted into the Black-Scholes-Merton pricing formula, equates the theoretical option price to the observed market price. If Black-Scholes held perfectly in reality, implied volatility would be constant across all strike prices K and times to expiration T.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "The implied volatility of an option is the volatility for which the Black-Scholes price equals the market price.",
        "provenance": "notebooklm_query"
      },
      "tags": ["implied_volatility", "bsm_inversion", "market_pricing"]
    },
    {
      "id": "fact-02",
      "category": "claim",
      "topic": "Put-Call Parity Invariant for Implied Volatility",
      "statement": "Put-call parity requires that a European call option and a European put option with the identical strike price K and time to maturity T must have the exact same implied volatility. A violation of this equality would create a direct riskless arbitrage opportunity via synthetic conversions or reversals.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "Put-call parity shows that the implied volatility of a European call option is the same as the implied volatility of a European put option with the same strike price and maturity.",
        "provenance": "notebooklm_query"
      },
      "tags": ["put_call_parity", "arbitrage_invariant", "identical_implied_vol"]
    },
    {
      "id": "fact-03",
      "category": "claim",
      "topic": "Foreign Currency Options and the U-Shaped Volatility Smile",
      "statement": "Foreign exchange currency options display a symmetric U-shaped volatility smile where both deep out-of-the-money puts and deep out-of-the-money calls trade at significantly higher implied volatilities than at-the-money options. This reflects leptokurtic exchange rate distributions with fatter tails and excess kurtosis compared to the standard lognormal model.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "For foreign currency options, implied volatility is relatively low for at-the-money options and increases as the option moves either into or out of the money, forming a U-shaped smile.",
        "provenance": "notebooklm_query"
      },
      "tags": ["currency_smile", "fat_tails", "leptokurtic", "u_shaped_smile"]
    },
    {
      "id": "fact-04",
      "category": "claim",
      "topic": "Equity Downward Volatility Skew (Smirk)",
      "statement": "Equity and stock index options display a pronounced downward-sloping volatility skew (or smirk), where implied volatility decreases monotonically as the strike price increases. Deep out-of-the-money puts (low strikes) trade at substantially higher implied volatilities than at-the-money options, which in turn trade higher than out-of-the-money calls (high strikes).",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "The volatility smile for equity options is downward sloping: volatility decreases as strike price increases.",
        "provenance": "notebooklm_query"
      },
      "tags": ["equity_skew", "volatility_smirk", "otm_puts", "downward_slope"]
    },
    {
      "id": "fact-05",
      "category": "claim",
      "topic": "The Leverage Effect Explanation for Equity Skew",
      "statement": "The leverage effect explains equity skew: as a corporation's stock price declines, its debt-to-equity ratio increases, making the firm more levered and its remaining equity riskier. This mechanical surge in financial risk causes stock volatility to rise as prices fall, producing negative skewness and fatter left tails in the stock price distribution.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "One explanation for the equity skew is the leverage effect: as equity declines, leverage increases, making the equity riskier and increasing its volatility.",
        "provenance": "notebooklm_query"
      },
      "tags": ["leverage_effect", "debt_to_equity", "financial_risk", "asymmetric_volatility"]
    },
    {
      "id": "fact-06",
      "category": "case_study",
      "topic": "Crashophobia & The October 1987 Structural Regime Shift (Business Snapshot 19.2)",
      "statement": "In Business Snapshot 19.2, Hull explains 'Crashophobia': prior to the October 19, 1987 stock market crash when the Dow plunged 22.6% in a single day, equity volatility smiles were virtually flat. Post-crash, institutional portfolio managers and market makers permanently bid up the implied volatility of deep out-of-the-money index put options to protect against catastrophic market plunges.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "Mark Rubinstein referred to this phenomenon as crashophobia: traders are concerned about another crash similar to October 1987 and price out-of-the-money puts accordingly.",
        "provenance": "notebooklm_query"
      },
      "tags": ["crashophobia", "snapshot_19_2", "october_1987_crash", "catastrophic_put_demand"]
    },
    {
      "id": "fact-07",
      "category": "formula",
      "topic": "Breeden-Litzenberger Implied Probability Density Function",
      "statement": "The risk-neutral probability density function g(K) of the underlying asset price at maturity T can be extracted directly from European call option market prices across strikes using the Breeden-Litzenberger formula: g(K) = e^(rT) * d^2c / dK^2. This proves that the market's implied distribution differs from lognormal whenever call prices exhibit curvature non-linearities across strike prices.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "The risk-neutral probability distribution of the stock price at time T is given by g(K) = e^(rT) * d^2c / dK^2.",
        "provenance": "notebooklm_query"
      },
      "tags": ["breeden_litzenberger", "risk_neutral_density", "second_derivative"],
      "formulaDetails": {
        "name": "Breeden-Litzenberger Density Formula",
        "latex": "g(K) = e^{rT} \\frac{\\partial^2 c}{\\partial K^2}",
        "variables": [
          { "symbol": "g(K)", "definition": "Risk-neutral probability density of the asset price equaling strike K at maturity T", "unit": "density (1/currency)" },
          { "symbol": "e^{rT}", "definition": "Risk-free compound future value discount factor", "unit": "dimensionless" },
          { "symbol": "c", "definition": "Market price of European call option as a function of strike K", "unit": "currency ($)" },
          { "symbol": "K", "definition": "Option strike price", "unit": "currency ($)" }
        ]
      }
    },
    {
      "id": "fact-08",
      "category": "numerical_example",
      "topic": "Hull Table 19.1 Empirical Implied Volatilities for Currency Options",
      "statement": "In Hull Table 19.1, empirical market data for 1-month foreign currency options demonstrates a textbook U-shaped smile: at-the-money options (delta = 0.50) trade at 13.5% implied volatility, while 0.25 delta deep OTM calls trade at 14.1% and 0.25 delta deep OTM puts trade at 14.2%, and 0.10 delta extreme tails reach 15.1% implied volatility. Profit = Payoff - Premium paid for all positions.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "Table 19.1 shows implied volatilities for 1-month options on foreign currencies, illustrating the U-shaped smile.",
        "provenance": "notebooklm_query"
      },
      "tags": ["table_19_1", "numerical_smile", "currency_quotes"],
      "numericalDetails": {
        "values": {
          "atmVol": 0.135,
          "callOtmVol": 0.141,
          "putOtmVol": 0.142,
          "tailVol": 0.151
        },
        "units": "%",
        "contractSize": 100000,
        "context": "Hull Table 19.1 empirical implied volatility across currency option moneyness"
      },
      "payoffVsProfit": {
        "distinctionType": "both",
        "formulaPayoff": "max(S_T - K, 0)",
        "formulaProfit": "max(S_T - K, 0) - c"
      }
    },
    {
      "id": "fact-09",
      "category": "definition",
      "topic": "Volatility Surfaces: Strike and Term Structure 3D Map",
      "statement": "A volatility surface combines the volatility smile across strike prices K with the volatility term structure across expiration maturities T into a complete continuous three-dimensional map sigma(K, T). Traders interpolate along the volatility surface to consistently price over-the-counter and exotic derivatives that have non-standard strikes or expiration dates.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "A volatility surface is a two-dimensional map of implied volatility as a function of both strike price and time to maturity.",
        "provenance": "notebooklm_query"
      },
      "tags": ["volatility_surface", "term_structure", "3d_pricing_map", "otm_interpolation"]
    },
    {
      "id": "fact-10",
      "category": "market_rule",
      "topic": "Making Options Fair: Using Smile Volatility in Delta Calculations",
      "statement": "When market makers price and hedge options in the presence of a volatility smile, using the flat Black-Scholes-Merton model formula directly produces severely miscalculated hedge ratios. Practitioners must price options using the strike-specific implied volatility sigma(K) and adjust Black-Scholes Greek formulas to account for the rate of change of implied volatility with respect to the asset price: d_sigma / d_S.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "When the volatility smile is used to price an option, the Greek letters must be calculated taking into account that volatility changes when the stock price changes.",
        "provenance": "notebooklm_query"
      },
      "tags": ["greek_adjustments", "smile_hedging", "delta_smile_correction"]
    },
    {
      "id": "fact-11",
      "category": "claim",
      "topic": "Advanced Smile Modeling: Local Volatility vs Stochastic Volatility",
      "statement": "To move beyond static Black-Scholes pricing, financial engineering uses Dupire's local volatility model where volatility is a deterministic function of asset price and time sigma(S, t), and Heston's stochastic volatility model where volatility itself follows a mean-reverting diffusion process dv = kappa(theta - v)dt + xi*sqrt(v)dz_v. Both models successfully calibrate to market-observed volatility smiles.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch19_part1",
        "excerpt": "Two main approaches to extending Black-Scholes to handle volatility smiles are local volatility models and stochastic volatility models.",
        "provenance": "notebooklm_query"
      },
      "tags": ["local_volatility", "dupire_model", "stochastic_volatility", "heston_model"]
    }
  ]
};

const dirs = [
  "src/data/chapters/hull_derivatives/ch19_part1",
  "src/data/chapters/hull_derivatives_en/ch19_part1"
];

for (const d of dirs) {
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, "source_facts.json"), JSON.stringify(ch19Facts, null, 2), "utf8");
  console.log(`Wrote exact source_facts.json to ${d}`);
}
