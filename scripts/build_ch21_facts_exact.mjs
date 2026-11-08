import fs from 'fs';
import path from 'path';

const ch21Facts = {
  "schemaVersion": "1.0.0",
  "chapterSlug": "ch21_part1",
  "notebookId": "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  "sourceId": "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  "retrievalTimestamp": new Date().toISOString(),
  "bookTitle": "Fundamentals of Futures and Options Markets (John C. Hull)",
  "generalAssumptions": [
    "Interest rate derivatives (caps, floors, swaptions) are standardized instruments designed to manage floating interest rate exposure.",
    "Black's 1976 model is the market standard for pricing European bond options, interest rate caplets, and swaptions by treating forward rates as lognormally distributed.",
    "A cap is equivalent to a portfolio of call options on forward interest rates (caplets), and a floor is a portfolio of put options (floorlets).",
    "Put-call parity establishes that a long cap combined with a short floor is mathematically equivalent to an interest rate swap."
  ],
  "facts": [
    {
      "id": "fact-01",
      "category": "definition",
      "topic": "Embedded Bond Options: Callable and Putable Bonds",
      "statement": "Many bonds contain embedded interest rate options: a callable bond grants the issuing corporation the right to buy back the bond at predetermined call prices prior to maturity when interest rates decline, whereas a putable bond grants the bondholder the right to demand early principal repayment at par when interest rates rise.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "A callable bond contains an embedded call option allowing the issuer to buy back the bond. A putable bond contains an embedded option allowing the holder to sell the bond back to the issuer.",
        "provenance": "notebooklm_query"
      },
      "tags": ["embedded_options", "callable_bonds", "putable_bonds", "issuer_rights"]
    },
    {
      "id": "fact-02",
      "category": "formula",
      "topic": "Black's Model for European Bond Options",
      "statement": "Black's 1976 model values a European call option on a coupon-bearing bond using forward bond price F_0: c = e^(-rT) * [F_0 * N(d_1) - K * N(d_2)], where F_0 is the forward cash (dirty) bond price at option maturity T, K is the strike price, and d_1 = [ln(F_0/K) + (sigma_B^2 * T)/2] / (sigma_B * sqrt(T)).",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "Under Black's model, the price of a European call option on a bond is c = e^(-rT) * [F_0 * N(d_1) - K * N(d_2)] where F_0 is the forward bond price.",
        "provenance": "notebooklm_query"
      },
      "tags": ["blacks_bond_model", "forward_bond_price", "european_bond_options"],
      "formulaDetails": {
        "name": "Black's European Bond Option Formula",
        "latex": "c = e^{-rT} \\left[ F_0 N(d_1) - K N(d_2) \\right], \\quad d_1 = \\frac{\\ln(F_0/K) + \\frac{1}{2}\\sigma_B^2 T}{\\sigma_B \\sqrt{T}}, \\quad d_2 = d_1 - \\sigma_B \\sqrt{T}",
        "variables": [
          { "symbol": "c", "definition": "Price of European call option on bond", "unit": "currency ($)" },
          { "symbol": "F_0", "definition": "Forward dirty cash bond price for settlement at option maturity T", "unit": "currency ($)" },
          { "symbol": "K", "definition": "Option strike price", "unit": "currency ($)" },
          { "symbol": "r", "definition": "Risk-free interest rate for maturity T", "unit": "per annum (%/yr)" },
          { "symbol": "T", "definition": "Time to option expiration", "unit": "years" },
          { "symbol": "\\sigma_B", "definition": "Volatility of the forward bond price", "unit": "per annum (%/yr)" }
        ]
      }
    },
    {
      "id": "fact-03",
      "category": "claim",
      "topic": "Clean Price vs Dirty Price (Cash Price) Convention in Bond Options",
      "statement": "In bond markets, price quotes are clean prices that exclude accrued interest: Cash Price (Dirty Price) = Quoted Price (Clean Price) + Accrued Interest. Black's option pricing formula strictly operates on the dirty cash forward price F_0. Failure to account for accrued interest at option exercise leads to severe mispricing.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "The price of a bond option must be calculated using the cash price (dirty price) of the bond. The cash price equals the quoted price plus accrued interest.",
        "provenance": "notebooklm_query"
      },
      "tags": ["clean_vs_dirty", "accrued_interest", "cash_price_convention"]
    },
    {
      "id": "fact-04",
      "category": "definition",
      "topic": "Interest Rate Caps and Caplets Architecture",
      "statement": "An interest rate cap is an over-the-counter derivative designed to protect floating-rate borrowers against rising interest rates above cap rate R_K. A cap is a portfolio of European call options on interest rates, where each individual component option is called a caplet, corresponding to a specific reset date and settlement period.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "An interest rate cap is designed to provide insurance against the rate of interest on a floating-rate note rising above a certain level. A cap is a portfolio of call options on interest rates, each known as a caplet.",
        "provenance": "notebooklm_query"
      },
      "tags": ["interest_rate_cap", "caplet_portfolio", "borrower_insurance", "otc_rates"]
    },
    {
      "id": "fact-05",
      "category": "formula",
      "topic": "Caplet Payoff and Black's Valuation Formula",
      "statement": "For principal L, reset date t_k, and payment date t_{k+1} with accrual fraction delta_k = t_{k+1} - t_k, the caplet payoff paid at t_{k+1} is delta_k * L * max(R_k - R_K, 0). Under Black's model, the caplet value is c_k = e^(-r * t_{k+1}) * delta_k * L * [F_k * N(d_1) - R_K * N(d_2)], where F_k is the forward interest rate for the period.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "The payoff from a caplet is delta_k * L * max(R_k - R_K, 0) paid at t_{k+1}. Black's formula values this caplet using the forward rate F_k.",
        "provenance": "notebooklm_query"
      },
      "tags": ["caplet_payoff", "blacks_caplet_formula", "forward_rate_call"],
      "formulaDetails": {
        "name": "Black's Caplet Pricing Formula",
        "latex": "\\text{Caplet}_k = e^{-r t_{k+1}} \\delta_k L \\left[ F_k N(d_1) - R_K N(d_2) \\right], \\quad d_1 = \\frac{\\ln(F_k/R_K) + \\frac{1}{2}\\sigma_k^2 t_k}{\\sigma_k \\sqrt{t_k}}",
        "variables": [
          { "symbol": "\\text{Caplet}_k", "definition": "Market price of the k-th caplet", "unit": "currency ($)" },
          { "symbol": "L", "definition": "Notional principal amount", "unit": "currency ($)" },
          { "symbol": "\\delta_k", "definition": "Accrual day-count fraction for period t_k to t_{k+1}", "unit": "years" },
          { "symbol": "F_k", "definition": "Forward interest rate for period t_k to t_{k+1}", "unit": "per annum (%/yr)" },
          { "symbol": "R_K", "definition": "Cap rate (strike interest rate)", "unit": "per annum (%/yr)" },
          { "symbol": "t_{k+1}", "definition": "Payment settlement date", "unit": "years" },
          { "symbol": "\\sigma_k", "definition": "Black implied volatility of the forward rate F_k", "unit": "per annum (%/yr)" }
        ]
      }
    },
    {
      "id": "fact-06",
      "category": "definition",
      "topic": "Interest Rate Floors and Floorlets",
      "statement": "An interest rate floor provides insurance to floating-rate lenders against falling interest rates below floor rate R_K. A floor consists of a sequence of European put options on interest rates, each termed a floorlet, paying delta_k * L * max(R_K - R_k, 0) at date t_{k+1}. Valued via Black's put formula: p_k = e^(-r*t_{k+1}) * delta_k * L * [R_K * N(-d_2) - F_k * N(-d_1)].",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "An interest rate floor is a portfolio of put options on interest rates, each known as a floorlet, providing insurance against rates falling below a specified level.",
        "provenance": "notebooklm_query"
      },
      "tags": ["interest_rate_floor", "floorlet_put", "lender_insurance"]
    },
    {
      "id": "fact-07",
      "category": "claim",
      "topic": "Interest Rate Collars and Zero-Cost Collars",
      "statement": "An interest rate collar combines the purchase of an interest rate cap with the sale of an interest rate floor, confining the borrower's effective floating rate to the corridor between floor rate R_floor and cap rate R_cap. In a zero-cost collar, R_floor is chosen such that the premium received from selling the floor exactly offsets the premium paid for the cap.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "A collar is an instrument created by buying an interest rate cap and selling an interest rate floor. In a zero-cost collar, the cap and floor premiums are equal.",
        "provenance": "notebooklm_query"
      },
      "tags": ["rate_collar", "zero_cost_collar", "corridor_hedging"]
    },
    {
      "id": "fact-08",
      "category": "claim",
      "topic": "Put-Call Parity Equivalence: Cap Minus Floor Equals Interest Rate Swap",
      "statement": "Put-call parity dictates that for identical strike rates R_K and payment schedules: Cap - Floor = Interest Rate Swap. Holding a long cap and short floor at rate R_K replicates paying fixed rate R_K and receiving floating rate R. If market prices diverge, synthetic swap arbitrage enforces the parity relation.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "A cap can be viewed as a portfolio of calls and a floor as a portfolio of puts. By put-call parity, a cap minus a floor equals an interest rate swap.",
        "provenance": "notebooklm_query"
      },
      "tags": ["cap_floor_swap_parity", "synthetic_swap", "arbitrage_enforcement"]
    },
    {
      "id": "fact-09",
      "category": "numerical_example",
      "topic": "Hull Section 21.2: Valuation of a 1-Year Caplet on 3-Month SOFR/LIBOR",
      "statement": "In Hull Section 21.2, a 3-month caplet resets at t_1 = 1.0 year and pays at t_2 = 1.25 years on notional L = $10,000,000. Forward rate F_1 = 5.0%, cap strike R_K = 4.0%, accrual delta = 0.25 years, volatility sigma = 20%, and discount rate r = 5.0%. Black's model calculates d_1 = 1.2157, d_2 = 1.0157, yielding caplet value of $23,980. Profit = Payoff - Premium paid.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "Consider a caplet on 3-month LIBOR with notional $10M, reset in 1 year, strike 4%, forward rate 5%, and vol 20%. Black's formula gives a value of $23,980.",
        "provenance": "notebooklm_query"
      },
      "tags": ["numerical_caplet", "section_21_2", "black_model_calculation"],
      "numericalDetails": {
        "values": {
          "notional": 10000000,
          "forwardRate": 0.05,
          "strikeRate": 0.04,
          "accrual": 0.25,
          "volatility": 0.20,
          "discountRate": 0.05,
          "capletValue": 23980
        },
        "units": "$",
        "contractSize": 1,
        "context": "Hull Section 21.2 numerical 1-year caplet valuation"
      },
      "payoffVsProfit": {
        "distinctionType": "both",
        "formulaPayoff": "max(R - R_K, 0) * L * delta",
        "formulaProfit": "max(R - R_K, 0) * L * delta - premium"
      }
    },
    {
      "id": "fact-10",
      "category": "definition",
      "topic": "Swaptions: Payer and Receiver Interest Rate Options",
      "statement": "A swaption is an option to enter into an interest rate swap at a future date T_0 at a predetermined fixed swap rate S_K. A payer swaption gives the buyer the right to pay fixed rate S_K and receive floating (benefiting when swap rates rise); a receiver swaption gives the right to receive fixed rate S_K and pay floating (benefiting when swap rates fall).",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "A swaption is an option to enter into an interest rate swap. A payer swaption is an option to pay a fixed rate; a receiver swaption is an option to receive a fixed rate.",
        "provenance": "notebooklm_query"
      },
      "tags": ["swaptions", "payer_swaption", "receiver_swaption", "fixed_rate_options"]
    },
    {
      "id": "fact-11",
      "category": "case_study",
      "topic": "Prepayment Options in US Mortgages and Negative Interest Rates (Snapshots 21.1 & 21.2)",
      "statement": "In Business Snapshot 21.1, Hull details how US 30-year fixed mortgages include embedded borrower prepayment options without penalties, exposing mortgage-backed securities (MBS) investors to negative convexity as rates fall. In Snapshot 21.2, European negative interest rates post-2015 broke standard lognormal Black models, forcing market adoption of shifted Black and Bachelier normal models.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch21_part1",
        "excerpt": "US mortgages give homeowners the right to prepay, creating negative convexity for investors. Negative interest rates in Europe required shifting to normal (Bachelier) models.",
        "provenance": "notebooklm_query"
      },
      "tags": ["mortgage_prepayment", "negative_convexity", "negative_interest_rates", "bachelier_model"]
    }
  ]
};

const dirs = [
  "src/data/chapters/hull_derivatives/ch21_part1",
  "src/data/chapters/hull_derivatives_en/ch21_part1"
];

for (const d of dirs) {
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, "source_facts.json"), JSON.stringify(ch21Facts, null, 2), "utf8");
  console.log(`Wrote exact source_facts.json to ${d}`);
}
