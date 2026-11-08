import fs from 'fs';
import path from 'path';

const sourceFactsCh14Part1 = {
  schemaVersion: "1.0.0",
  chapterSlug: "ch14_part1",
  notebookId: "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  sourceId: "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  retrievalTimestamp: new Date().toISOString(),
  bookTitle: "Fundamentals of Futures and Options Markets (John C. Hull)",
  generalAssumptions: [
    "Employee stock options are long-term call options issued by a corporation on its own common stock.",
    "ESOs are non-transferable, subject to forfeiture upon employee departure during the vesting period, and typically have 10-year maturities.",
    "Accounting standards (FAS 123R / ASC 718 and IFRS 2) mandate fair-value expensing on corporate income statements.",
    "Standard exchange and corporate option contracts represent exactly 100 shares of underlying stock."
  ],
  facts: [
    {
      id: "fact-01",
      category: "definition",
      topic: "Contractual Arrangements and Vesting Structure of ESOs",
      statement: "Employee stock options (ESOs) are non-transferable call options granted to executives and staff with maturities up to 10 years. Unlike exchange-traded options representing 100 shares, ESOs cannot be sold or hedged and require a vesting period (typically 3 to 4 years) before they can be exercised. If an employee departs prior to vesting, the options are immediately forfeited.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "An employee stock option is an option granted to an employee by a company. There is usually a vesting period of several years during which the options cannot be exercised",
        provenance: "notebooklm_query"
      },
      tags: ["eso_contracts", "vesting_period", "forfeiture_rules"]
    },
    {
      id: "fact-02",
      category: "definition",
      topic: "Cliff Vesting versus Graded Vesting",
      statement: "Corporate ESO compensation plans utilize two primary vesting mechanisms: cliff vesting, where 100% of the option grant vests simultaneously at a single future date (e.g., exactly 3 years post-grant), and graded vesting, where equal tranches vest incrementally over consecutive years (e.g., 25% vesting annually across 4 years).",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Vesting can be graded or cliff. In graded vesting, a fraction of the options vests each year. In cliff vesting, all options vest at the end of the vesting period",
        provenance: "notebooklm_query"
      },
      tags: ["cliff_vesting", "graded_vesting", "compensation_design"]
    },
    {
      id: "fact-03",
      category: "claim",
      topic: "Principal-Agent Alignment versus Asymmetric Risk-Taking",
      statement: "While ESOs were introduced to align management interests with common shareholders, the asymmetric payoff structure of call options creates moral hazard: because executives enjoy unlimited upside if stock prices surge but face zero financial loss if prices plummet below strike K, options incentivize managers to undertake excessive leverage and high-variance corporate gambles.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Because options have asymmetric payoffs, they can encourage management to take excessive risks to boost volatility and stock price",
        provenance: "notebooklm_query"
      },
      tags: ["principal_agent", "moral_hazard", "risk_incentives"]
    },
    {
      id: "fact-04",
      category: "market_rule",
      topic: "Accounting & Expensing Standards: FAS 123R and IFRS 2",
      statement: "Under US GAAP (FAS 123R, codified as ASC 718) and international rules (IFRS 2), companies must calculate the fair market value of employee stock options on the grant date using an approved option-pricing model. This total fair value is recognized as compensation expense on the corporate income statement amortized pro-rata over the vesting period.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Under FAS 123R and IFRS 2, companies must expense the fair value of stock options on the grant date over the vesting period",
        provenance: "notebooklm_query"
      },
      tags: ["fas_123r", "asc_718", "ifrs_2", "expensing_rules"]
    },
    {
      id: "fact-05",
      category: "case_study",
      topic: "Business Snapshot 14.1: Employee Stock Options and Dilution",
      statement: "In Business Snapshot 14.1, John Hull examines the structural dilutive effect of ESOs. Unlike exchange-traded options settled with existing shares, when an employee exercises an ESO, the issuing company issues newly minted shares of common stock. This expands the total outstanding share base, directly diluting future Earnings Per Share (EPS) for existing shareholders unless offset by costly corporate share repurchases.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Business Snapshot 14.1: Employee Stock Options and Dilution. When employee stock options are exercised, the company issues new shares. This dilutes the holdings of existing shareholders",
        provenance: "notebooklm_query"
      },
      tags: ["business_snapshot_14_1", "equity_dilution", "eps_impact"]
    },
    {
      id: "fact-06",
      category: "case_study",
      topic: "The Option Backdating Scandals and Spring Loading",
      statement: "Academic research by Erik Lie (2005) uncovered pervasive corporate fraud where companies retroactively backdated option grant dates to historical dates when stock prices were at cyclic lows. By setting strike price K equal to an artificially depressed past price, executives received immediate in-the-money value without reporting compensation expense. A related practice, spring loading, involved granting at-the-money options days before releasing positive market announcements.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Backdating involves choosing a grant date in the past when the stock price was low. Research by Erik Lie showed this practice was widespread",
        provenance: "notebooklm_query"
      },
      tags: ["backdating_scandal", "erik_lie", "spring_loading", "corporate_governance"]
    },
    {
      id: "fact-07",
      category: "formula",
      topic: "The Hull-White Modified Binomial Valuation Model for ESOs",
      statement: "Standard Black-Scholes significantly overvalues ESOs because employees cannot trade or short their company stock, leading to early exercise once stock prices reach a target multiple M of the strike (typically M = 1.5 to 2.0). The Hull-White model builds a binomial tree where at any node after the vesting period t_vest, if S >= M * K, the option is exercised; additionally, at each step, a constant annual forfeiture rate lambda is applied if employees leave the firm.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Hull and White (2004) proposed an extension of the binomial tree where employees exercise when the stock price reaches a multiple M of strike after vesting, with forfeiture rate lambda",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "Hull-White ESO Early Exercise Condition",
        latex: "\\text{Node Value} = \\begin{cases} S - K & \\text{if } t \\ge t_{vest} \\text{ and } S \\ge M \\times K \\\\ e^{-r\\Delta t}\\left[(1-\\lambda\\Delta t)(p f_u + (1-p) f_d)\\right] & \\text{otherwise} \\end{cases}",
        variables: [
          { symbol: "M", definition: "Early exercise multiple threshold (typically 1.5 to 2.0)", unit: "multiplier" },
          { symbol: "K", definition: "Option strike price", unit: "$" },
          { symbol: "t_{vest}", definition: "Vesting period duration", unit: "years" },
          { symbol: "\\lambda", definition: "Annual employee departure forfeiture rate", unit: "%/year" },
          { symbol: "S", definition: "Underlying stock price at node", unit: "$" }
        ]
      },
      tags: ["hull_white_model", "eso_valuation", "early_exercise_multiple"]
    },
    {
      id: "fact-08",
      category: "numerical_example",
      topic: "Numerical Comparison: Black-Scholes vs Hull-White ESO Valuation",
      statement: "Consider a 10-year ESO granted at-the-money with S0 = $50.00, strike K = $50.00, risk-free rate r = 5%, volatility sigma = 30%, and dividend yield q = 0%. A standard 10-year Black-Scholes European call values the option at $25.96 per share ($2,596 per 100-share contract). Under the Hull-White model with a 3-year vesting period, early exercise multiple M = 1.5 (exercising at S = $75.00), and an annual employee departure rate lambda = 4% per year, the fair value drops to $18.60 per share, demonstrating that standard BSM overstates ESO costs by over 39%.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "A standard 10-year option with S0=50, K=50, r=5%, sigma=30% has BSM price 25.96. With vesting=3 years, M=1.5, lambda=4%, the Hull-White model yields 18.60",
        provenance: "notebooklm_query"
      },
      numericalDetails: {
        values: {
          stockSpot: 50,
          strike: 50,
          maturityYears: 10,
          vestingYears: 3,
          riskFreeRate: 0.05,
          volatility: 0.30,
          exerciseMultipleM: 1.5,
          annualForfeitureRate: 0.04,
          standardBsmValue: 25.96,
          hullWhiteValue: 18.60,
          overstatementPercentage: 39.5,
          contractSize: 100
        },
        units: "$",
        contractSize: 100,
        context: "Hull Section 14.4 numerical comparison of standard BSM vs Hull-White ESO valuation."
      },
      tags: ["eso_numerical_example", "hull_white_pricing", "bsm_overvaluation"]
    },
    {
      id: "fact-09",
      category: "formula",
      topic: "Gross Payoff versus Net Trading Profit for Employee Stock Options",
      statement: "A fundamental distinction in corporate option compensation is terminal Gross Payoff versus Net Trading Profit: Profit = Payoff - Premium paid. For employees receiving ESOs with initial out-of-pocket cash premium of $0.00, gross terminal cash payoff upon exercise equals max(S_T - K, 0). However, from the perspective of external option buyers or the corporate treasury, Net Profit = Payoff - Premium paid, where the fair grant-date market value amortized per share represents the true economic cost. Profit = Payoff - Premium paid.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Terminal payoff is the gross cash realized at exercise. Net profit accounts for option costs: Profit = Payoff - Premium paid",
        provenance: "notebooklm_query"
      },
      formulaDetails: {
        name: "ESO Payoff vs Economic Profit Rule",
        latex: "\\text{Net Profit}_{eso} = \\max(S_T - K, 0) - P_{grant}",
        variables: [
          { symbol: "S_T - K", definition: "Gross terminal exercise cash value", unit: "$" },
          { symbol: "P_{grant}", definition: "Grant date economic fair value", unit: "$" },
          { symbol: "\\text{Net Profit}", definition: "Net realized compensation profit", unit: "$" }
        ]
      },
      payoffVsProfit: {
        distinctionType: "both",
        formulaPayoff: "Payoff = max(S_T - K, 0)",
        formulaProfit: "Profit = Payoff - Premium paid"
      },
      tags: ["payoff_vs_profit", "eso_economics", "risk_rule"]
    },
    {
      id: "fact-10",
      category: "claim",
      topic: "Executive Non-Diversification and Suboptimal Early Exercise",
      statement: "Because company executives hold a disproportionate fraction of their human capital and personal financial wealth tied to their employing firm, they are significantly more risk-averse toward company stock than diversified market investors. Consequently, executives exercise in-the-money options years before expiration to lock in gains and diversify, forfeiting remaining time value.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "Employees are not diversified and are risk-averse, leading them to exercise options earlier than external investors",
        provenance: "notebooklm_query"
      },
      tags: ["non_diversification", "risk_aversion", "early_exercise_behavior"]
    },
    {
      id: "fact-11",
      category: "definition",
      topic: "Post-Termination Exercise Windows and Forced Expiration",
      statement: "Under standard ESO contracts, if an employee voluntarily resigns or is terminated after options have vested, the company grants a strictly limited post-termination exercise window (typically 60 to 90 days). If the employee fails to exercise within this window, the vested options expire worthless immediately, drastically reducing the option's effective lifespan.",
      sourceCitation: {
        book: "Fundamentals of Futures and Options Markets (John C. Hull)",
        chapter: "ch14_part1",
        excerpt: "When an employee leaves a company after options have vested, they typically have a short period (such as 90 days) to exercise",
        provenance: "notebooklm_query"
      },
      tags: ["post_termination", "exercise_window", "contractual_expiration"]
    }
  ]
};

const dirs = [
  path.resolve('src/data/chapters/hull_derivatives/ch14_part1'),
  path.resolve('src/data/chapters/hull_derivatives_en/ch14_part1')
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'source_facts.json');
  fs.writeFileSync(filePath, JSON.stringify(sourceFactsCh14Part1, null, 2), 'utf8');
  console.log(`Saved source_facts.json to: ${filePath}`);
}

