// scripts/generate_ch11_part2_phase1.mjs
import fs from 'fs';
import path from 'path';

const sourceFactsData = {
  "schemaVersion": "1.0.0",
  "chapterSlug": "ch11_part2",
  "notebookId": "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  "sourceId": "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  "retrievalTimestamp": new Date().toISOString(),
  "bookTitle": "Fundamentals of Futures and Options Markets (John C. Hull)",
  "generalAssumptions": [
    "European style option exercise conventions unless explicitly designated as American.",
    "Frictionless financial markets with zero transaction costs and zero bid-ask spread.",
    "Constant risk-free interest rate r across all contract maturities."
  ],
  "facts": [
    {
      "id": "fact-01",
      "category": "definition",
      "topic": "Calendar Spread Construction and Mechanics",
      "statement": "A calendar spread is constructed by simultaneously selling a short-dated option with expiration T1 and buying a longer-dated option with expiration T2 (where T2 > T1) at the same strike price K. It exploits the faster time decay (theta) of the near-term contract. Each standard contract size represents 100 shares of the underlying equity.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "A calendar spread involves buying an option with a longer expiration date and selling an option with a shorter expiration date, both with the same strike price",
        "provenance": "notebooklm_query"
      },
      "tags": ["calendar_spread", "theta_decay"]
    },
    {
      "id": "fact-02",
      "category": "claim",
      "topic": "Neutral, Bullish, and Bearish Calendar Spreads",
      "statement": "Calendar spreads can be neutral, bullish, or bearish depending on strike selection: a neutral spread uses strike K near spot S0, a bullish spread selects a higher strike K > S0, and a bearish spread selects a lower strike K < S0. Maximum profit is achieved at T1 if the asset price settles exactly at K.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "A neutral calendar spread uses a strike price close to the current stock price; a bullish spread uses a higher strike and a bearish spread uses a lower strike",
        "provenance": "notebooklm_query"
      },
      "tags": ["calendar_spread", "directional_bias"]
    },
    {
      "id": "fact-03",
      "category": "definition",
      "topic": "Bottom Straddle (Long Straddle) Definition",
      "statement": "A bottom straddle (or long straddle) involves simultaneously buying a European call and a European put with the same strike price K and same expiration date T. It is chosen when an investor expects a large price movement but does not know the direction.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "A bottom straddle involves buying a call and a put with the same strike price and expiration date",
        "provenance": "notebooklm_query"
      },
      "tags": ["straddle", "volatility_trading"]
    },
    {
      "id": "fact-04",
      "category": "formula",
      "topic": "Straddle Payoff and Break-Even Formulas",
      "statement": "The terminal gross payoff of a long straddle is max(S_T - K, 0) + max(K - S_T, 0) = |S_T - K|. Crucially, Net Profit = Payoff - Premium paid, where initial premium paid equals c + p. Upside break-even is K + c + p, downside break-even is K - (c + p), and maximum loss equals total premium paid c + p, occurring when S_T = K.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "The straddle payoff is |S_T - K|. Net profit is payoff minus initial premium paid. The break-even points are K + c + p and K - (c + p)",
        "provenance": "notebooklm_query"
      },
      "formulaDetails": {
        "name": "Long Straddle Payoff and Profit Formulas",
        "latex": "\\text{Payoff} = |S_T - K|, \\quad \\text{Profit} = |S_T - K| - (c + p), \\quad \\text{BE}_{\\text{up}} = K + (c + p), \\quad \\text{BE}_{\\text{down}} = K - (c + p)",
        "variables": [
          { "symbol": "S_T", "definition": "Stock price at expiration", "unit": "$" },
          { "symbol": "K", "definition": "Common strike price", "unit": "$" },
          { "symbol": "c + p", "definition": "Total premium paid for call and put", "unit": "$" }
        ]
      },
      "payoffVsProfit": {
        "distinctionType": "both",
        "formulaPayoff": "Payoff = |S_T - K|",
        "formulaProfit": "Profit = Payoff - (c + p)"
      },
      "tags": ["straddle", "payoff_formula"]
    },
    {
      "id": "fact-05",
      "category": "definition",
      "topic": "Top Straddle (Short Straddle) Exposure",
      "statement": "A top straddle (short straddle) involves selling a call and a put with the same strike price K and expiration date T. The seller collects maximum profit equal to total premium c + p if S_T = K, but faces unlimited risk if a significant price movement occurs in either direction.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "A top straddle or short straddle involves selling both a call and a put with the same strike and expiration, carrying unlimited risk",
        "provenance": "notebooklm_query"
      },
      "tags": ["short_straddle", "tail_risk"]
    },
    {
      "id": "fact-06",
      "category": "definition",
      "topic": "Strips and Straps Volatility Asymmetry",
      "statement": "A strip consists of a long position in 1 call and 2 puts with the same strike K and expiration T, expressing a bearish volatility view. A strap consists of a long position in 2 calls and 1 put with the same strike K and expiration T, expressing a bullish volatility view.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "A strip consists of a long position in one call and two puts. A strap consists of a long position in two calls and one put",
        "provenance": "notebooklm_query"
      },
      "tags": ["strip", "strap", "asymmetric_volatility"]
    },
    {
      "id": "fact-07",
      "category": "definition",
      "topic": "Bottom Strangle Structure and Trade-Off",
      "statement": "A bottom strangle involves buying an out-of-the-money put with strike K1 and an out-of-the-money call with strike K2 (where K1 < K2) with the same expiration date. It is cheaper to construct than a straddle but requires a larger move in the underlying asset before profit is realized.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "A strangle involves buying a put and a call with different strike prices and the same expiration date, with put strike less than call strike",
        "provenance": "notebooklm_query"
      },
      "tags": ["strangle", "otm_options"]
    },
    {
      "id": "fact-08",
      "category": "formula",
      "topic": "Strangle Payoff and Break-Even Formulas",
      "statement": "The terminal gross payoff of a strangle is max(K1 - S_T, 0) + max(S_T - K2, 0). Net Profit equals terminal payoff minus initial net debit. Upside break-even is K2 + Net Debit, downside break-even is K1 - Net Debit, and maximum loss equals the total net debit paid, realized if the stock price finishes between K1 and K2.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "Payoff is max(K1 - S_T, 0) + max(S_T - K2, 0). Profit is Payoff - Debit. Break-even points are K2 + cost and K1 - cost",
        "provenance": "notebooklm_query"
      },
      "formulaDetails": {
        "name": "Strangle Payoff and Break-Evens",
        "latex": "\\text{Payoff} = \\max(K_1 - S_T, 0) + \\max(S_T - K_2, 0), \\quad \\text{BE}_{\\text{up}} = K_2 + \\text{Debit}, \\quad \\text{BE}_{\\text{down}} = K_1 - \\text{Debit}",
        "variables": [
          { "symbol": "K_1", "definition": "Put strike price", "unit": "$" },
          { "symbol": "K_2", "definition": "Call strike price", "unit": "$" },
          { "symbol": "Debit", "definition": "Total premium paid for strangle", "unit": "$" }
        ]
      },
      "payoffVsProfit": {
        "distinctionType": "both",
        "formulaPayoff": "Payoff = max(K1 - S_T, 0) + max(S_T - K2, 0)",
        "formulaProfit": "Profit = Payoff - Net Debit"
      },
      "tags": ["strangle", "payoff_formula"]
    },
    {
      "id": "fact-09",
      "category": "case_study",
      "topic": "Business Snapshot 11.2: How to Make Money from Trading Straddles",
      "statement": "Business Snapshot 11.2 demonstrates that trading straddles around earnings announcements often traps retail buyers due to implied volatility crush: implied volatility surges prior to earnings and plunges immediately post-announcement, causing option values to collapse even when the stock moves substantially.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "Business Snapshot 11.2: How to Make Money from Trading Straddles illustrates that implied volatility tends to collapse after major corporate announcements, penalizing long straddles",
        "provenance": "notebooklm_query"
      },
      "tags": ["snapshot_11_2", "iv_crush", "earnings"]
    },
    {
      "id": "fact-10",
      "category": "numerical_example",
      "topic": "Numerical Example: Long Straddle Arithmetic",
      "statement": "An investor buys a 6-month call at $4.00 and a 6-month put at $3.00 with common strike K = $50.00 (total debit $7.00 per share, or $700.00 per 100-share contract). Downside break-even is $43.00, upside break-even is $57.00, maximum loss is $700.00 at S_T = $50.00, and if the stock reaches $65.00 at expiration, net profit is ($65.00 - $50.00) - $7.00 = $8.00 per share ($800.00 total).",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "Consider a 6-month call with strike $50 costing $4 and a 6-month put with strike $50 costing $3. Total investment is $7. Break-even points are $43 and $57",
        "provenance": "notebooklm_query"
      },
      "numericalDetails": {
        "values": {
          "strike": 50,
          "callPremium": 4,
          "putPremium": 3,
          "totalDebit": 7,
          "downsideBreakEven": 43,
          "upsideBreakEven": 57,
          "contractSize": 100,
          "maxLoss": 700,
          "terminalPrice": 65,
          "netProfit": 800
        },
        "units": "$",
        "contractSize": 100,
        "context": "Hull Section 11.4 long straddle payoff, break-even, and profit calculation."
      },
      "tags": ["numerical_example", "straddle_calculation"]
    },
    {
      "id": "fact-11",
      "category": "numerical_example",
      "topic": "Numerical Example: Strangle Arithmetic",
      "statement": "With a stock trading at $50.00, an investor buys an October 45 put for $2.00 and an October 55 call for $1.50 (total cost $3.50 per share, or $350.00 per 100-share contract). Downside break-even is $45.00 - $3.50 = $41.50, upside break-even is $55.00 + $3.50 = $58.50, and maximum loss is $350.00 occurring anywhere between $45.00 and $55.00.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch11_part2",
        "excerpt": "A trader buys a put with strike $45 for $2 and a call with strike $55 for $1.50. Total cost is $3.50. Break-even points are $41.50 and $58.50",
        "provenance": "notebooklm_query"
      },
      "numericalDetails": {
        "values": {
          "stockSpot": 50,
          "putStrike": 45,
          "callStrike": 55,
          "putPremium": 2,
          "callPremium": 1.5,
          "totalCost": 3.5,
          "downsideBreakEven": 41.5,
          "upsideBreakEven": 58.5,
          "contractSize": 100,
          "maxLoss": 350
        },
        "units": "$",
        "contractSize": 100,
        "context": "Hull Section 11.4 strangle payoff and break-even calculation across 100 shares."
      },
      "tags": ["numerical_example", "strangle_calculation"]
    }
  ]
};

const dirs = [
  'src/data/chapters/hull_derivatives/ch11_part2',
  'src/data/chapters/hull_derivatives_en/ch11_part2'
];

for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'source_facts.json'), JSON.stringify(sourceFactsData, null, 2), 'utf8');
  console.log(`✅ Saved fully-compliant source_facts.json to ${dir}`);
}
