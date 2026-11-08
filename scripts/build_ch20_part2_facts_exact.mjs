import fs from 'fs';
import path from 'path';

const ch20Part2Facts = {
  "schemaVersion": "1.0.0",
  "chapterSlug": "ch20_part2",
  "notebookId": "c10a8b30-fee8-4d92-9d2c-516bc8866bad",
  "sourceId": "f8901e7b-90e2-4ac7-b8cb-492198f9ac7a",
  "retrievalTimestamp": new Date().toISOString(),
  "bookTitle": "Fundamentals of Futures and Options Markets (John C. Hull)",
  "generalAssumptions": [
    "The model-building (variance-covariance) approach assumes that asset returns follow a multivariate normal distribution.",
    "Linear delta approximations work well for linear derivatives (futures, forwards) but produce severe pricing errors for option portfolios with high gamma curvature.",
    "The Exponentially Weighted Moving Average (EWMA) model updates variance daily with exponential weighting (decay factor lambda = 0.94).",
    "GARCH(1,1) models incorporate mean-reversion toward long-term variance V_L alongside recent market shocks."
  ],
  "facts": [
    {
      "id": "fact-01",
      "category": "definition",
      "topic": "The Model-Building (Variance-Covariance) VaR Approach",
      "statement": "The model-building approach (also known as the variance-covariance approach) calculates portfolio risk parametrically by assuming that individual asset daily returns follow a multivariate normal distribution. Portfolio variance is calculated as sigma_P^2 = sum_i sum_j w_i w_j sigma_i sigma_j rho_ij = w^T Sigma w.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "The model-building approach assumes that the returns on assets have a multivariate normal distribution. The portfolio variance is computed directly from asset variances and covariances.",
        "provenance": "notebooklm_query"
      },
      "tags": ["model_building_var", "variance_covariance", "multivariate_normal", "portfolio_variance"]
    },
    {
      "id": "fact-02",
      "category": "formula",
      "topic": "Two-Asset Portfolio Standard Deviation and VaR Formula",
      "statement": "For a two-asset portfolio with positions X and Y, individual volatilities sigma_X and sigma_Y, and correlation rho, the portfolio standard deviation is sigma_P = sqrt(sigma_X^2 + sigma_Y^2 + 2*rho*sigma_X*sigma_Y). The one-day 99% VaR is given by VaR_99 = 2.326 * sigma_P, and 95% VaR is 1.645 * sigma_P.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "The standard deviation of the portfolio value change is given by sigma_P = sqrt(sigma_X^2 + sigma_Y^2 + 2*rho*sigma_X*sigma_Y). For a 99% confidence level, VaR = 2.326 * sigma_P.",
        "provenance": "notebooklm_query"
      },
      "tags": ["two_asset_var", "correlation_benefit", "confidence_multipliers"],
      "formulaDetails": {
        "name": "Two-Asset Portfolio VaR Formula",
        "latex": "\\sigma_P = \\sqrt{\\sigma_X^2 + \\sigma_Y^2 + 2\\rho \\sigma_X \\sigma_Y}, \\quad \\text{VaR}_{99} = 2.326 \\, \\sigma_P",
        "variables": [
          { "symbol": "\\sigma_P", "definition": "Portfolio daily standard deviation in dollar terms", "unit": "currency ($)" },
          { "symbol": "\\sigma_X", "definition": "Dollar standard deviation of asset position X", "unit": "currency ($)" },
          { "symbol": "\\sigma_Y", "definition": "Dollar standard deviation of asset position Y", "unit": "currency ($)" },
          { "symbol": "\\rho", "definition": "Correlation coefficient between daily returns of X and Y", "unit": "dimensionless (-1 to +1)" },
          { "symbol": "\\text{VaR}_{99}", "definition": "99% confidence one-day Value at Risk", "unit": "currency ($)" }
        ]
      }
    },
    {
      "id": "fact-03",
      "category": "claim",
      "topic": "Linear (Delta-Normal) Approximation for Derivatives Portfolios",
      "statement": "For portfolios containing options and derivatives, the linear model approximates the portfolio value change Delta P using the Greek Delta of each position: Delta P = sum_i (delta_i * Delta S_i), where delta_i = dP / dS_i. While highly tractable and computationally instantaneous, this linear approximation completely ignores non-linear curvature.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "When a portfolio includes options, the change in portfolio value is approximated by Delta P = sum delta_i * Delta S_i.",
        "provenance": "notebooklm_query"
      },
      "tags": ["delta_normal", "linear_approximation", "first_order_greeks"]
    },
    {
      "id": "fact-04",
      "category": "formula",
      "topic": "Quadratic (Delta-Gamma) Approximation for Non-linear Portfolios",
      "statement": "To capture option curvature, the quadratic model uses the second-order Taylor series expansion: Delta P = delta * Delta S + (1/2) * Gamma * (Delta S)^2 + Theta * Delta t. Gamma captures the convex curvature of option values, ensuring significant price jumps do not produce catastrophic linear VaR underestimation.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "A Taylor series expansion gives the delta-gamma approximation: Delta P = delta * Delta S + 0.5 * Gamma * (Delta S)^2 + Theta * Delta t.",
        "provenance": "notebooklm_query"
      },
      "tags": ["delta_gamma", "quadratic_var", "taylor_series", "gamma_curvature"],
      "formulaDetails": {
        "name": "Delta-Gamma Portfolio Value Approximation",
        "latex": "\\Delta P = \\delta \\Delta S + \\frac{1}{2} \\Gamma (\\Delta S)^2 + \\Theta \\Delta t",
        "variables": [
          { "symbol": "\\Delta P", "definition": "Change in portfolio value over time interval Delta t", "unit": "currency ($)" },
          { "symbol": "\\delta", "definition": "Portfolio Delta (first derivative with respect to underlying S)", "unit": "dimensionless" },
          { "symbol": "\\Delta S", "definition": "Change in underlying asset price", "unit": "currency ($)" },
          { "symbol": "\\Gamma", "definition": "Portfolio Gamma (second derivative curvature with respect to S)", "unit": "1/currency ($^-1)" },
          { "symbol": "\\Theta", "definition": "Portfolio Theta (time decay rate per day)", "unit": "currency/day ($/day)" },
          { "symbol": "\\Delta t", "definition": "Time horizon step", "unit": "days" }
        ]
      }
    },
    {
      "id": "fact-05",
      "category": "numerical_example",
      "topic": "Hull Section 20.3: Diversification Benefit in Two-Stock Portfolio",
      "statement": "In Hull Section 20.3, a portfolio contains $10,000,000 in Microsoft shares (daily vol 2%) and $5,000,000 in AT&T shares (daily vol 1%) with correlation 0.3. Individual 99% VaRs are $465,200 for Microsoft and $116,300 for AT&T (sum = $581,500). Due to correlation 0.3, total portfolio 99% VaR is only $496,600, yielding an exact diversification benefit of $84,900. Profit = Payoff - Premium paid.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "Consider a portfolio of $10M in Microsoft and $5M in AT&T. The 10-day 99% VaR for Microsoft is $465,200 and for AT&T is $116,300. The portfolio 10-day 99% VaR is $496,600, illustrating diversification savings of $84,900.",
        "provenance": "notebooklm_query"
      },
      "tags": ["numerical_diversification", "section_20_3", "microsoft_att_portfolio"],
      "numericalDetails": {
        "values": {
          "msftPosition": 10000000,
          "attPosition": 5000000,
          "msftDailyVol": 0.02,
          "attDailyVol": 0.01,
          "correlation": 0.3,
          "msftVaR": 465200,
          "attVaR": 116300,
          "portfolioVaR": 496600,
          "diversificationBenefit": 84900
        },
        "units": "$",
        "contractSize": 1,
        "context": "Hull Section 20.3 empirical two-stock diversification example"
      },
      "payoffVsProfit": {
        "distinctionType": "both",
        "formulaPayoff": "max(S_T - K, 0)",
        "formulaProfit": "max(S_T - K, 0) - c"
      }
    },
    {
      "id": "fact-06",
      "category": "formula",
      "topic": "Exponentially Weighted Moving Average (EWMA) Model",
      "statement": "The Exponentially Weighted Moving Average (EWMA) model (standardized in J.P. Morgan's 1996 RiskMetrics) updates volatility recursively: sigma_n^2 = lambda * sigma_{n-1}^2 + (1 - lambda) * u_{n-1}^2. The parameter lambda is the decay factor (typically set to lambda = 0.94 for daily data), giving exponentially declining weights to older return shocks.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "In the EWMA model, the variance rate is updated as sigma_n^2 = lambda * sigma_{n-1}^2 + (1 - lambda) * u_{n-1}^2. RiskMetrics uses lambda = 0.94 for daily data.",
        "provenance": "notebooklm_query"
      },
      "tags": ["ewma_model", "riskmetrics", "decay_factor_0_94", "recursive_volatility"],
      "formulaDetails": {
        "name": "EWMA Volatility Updating Formula",
        "latex": "\\sigma_n^2 = \\lambda \\sigma_{n-1}^2 + (1-\\lambda) u_{n-1}^2",
        "variables": [
          { "symbol": "\\sigma_n^2", "definition": "Updated variance estimate for day n", "unit": "variance (dimensionless)" },
          { "symbol": "\\lambda", "definition": "Decay factor parameter (typically 0.94)", "unit": "dimensionless (0 < lambda < 1)" },
          { "symbol": "\\sigma_{n-1}^2", "definition": "Variance estimate from previous day n-1", "unit": "variance (dimensionless)" },
          { "symbol": "u_{n-1}^2", "definition": "Squared percentage return on day n-1", "unit": "squared return (dimensionless)" }
        ]
      }
    },
    {
      "id": "fact-07",
      "category": "formula",
      "topic": "GARCH(1,1) Volatility Forecasting and Mean-Reversion Model",
      "statement": "The GARCH(1,1) model updates variance incorporating mean reversion: sigma_n^2 = gamma * V_L + alpha * u_{n-1}^2 + beta * sigma_{n-1}^2, where gamma + alpha + beta = 1 and V_L is the long-run average variance rate. Setting omega = gamma * V_L yields the standard representation sigma_n^2 = omega + alpha * u_{n-1}^2 + beta * sigma_{n-1}^2.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "In GARCH(1,1), sigma_n^2 = gamma * V_L + alpha * u_{n-1}^2 + beta * sigma_{n-1}^2 where gamma + alpha + beta = 1.",
        "provenance": "notebooklm_query"
      },
      "tags": ["garch_1_1", "mean_reversion", "long_run_variance", "engle_bollerslev"],
      "formulaDetails": {
        "name": "GARCH(1,1) Variance Equation",
        "latex": "\\sigma_n^2 = \\omega + \\alpha u_{n-1}^2 + \\beta \\sigma_{n-1}^2, \\quad \\omega = \\gamma V_L",
        "variables": [
          { "symbol": "\\sigma_n^2", "definition": "Forecasted conditional variance for day n", "unit": "variance (dimensionless)" },
          { "symbol": "\\omega", "definition": "Constant baseline variance component (gamma * V_L)", "unit": "variance (dimensionless)" },
          { "symbol": "\\alpha", "definition": "Weight assigned to the most recent squared return shock", "unit": "dimensionless" },
          { "symbol": "u_{n-1}^2", "definition": "Squared return observed on day n-1", "unit": "dimensionless" },
          { "symbol": "\\beta", "definition": "Weight assigned to the previous variance estimate (persistence)", "unit": "dimensionless" },
          { "symbol": "V_L", "definition": "Long-run average variance rate", "unit": "variance (dimensionless)" }
        ]
      }
    },
    {
      "id": "fact-08",
      "category": "claim",
      "topic": "Mean-Reverting Term Structure of Volatility in GARCH(1,1)",
      "statement": "A key mathematical property of GARCH(1,1) is that future expected variance reverts to the long-run average V_L according to E[sigma_{n+k}^2] = V_L + (alpha + beta)^k * (sigma_n^2 - V_L). When current volatility is elevated above V_L, the term structure of volatility is downward-sloping; when current volatility is below V_L, it is upward-sloping.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "In GARCH(1,1), the expected future variance rate reverts to the long-run average at rate 1 - alpha - beta: E[sigma_{n+k}^2] = V_L + (alpha + beta)^k * (sigma_n^2 - V_L).",
        "provenance": "notebooklm_query"
      },
      "tags": ["volatility_term_structure", "garch_forecasting", "mean_reversion_rate"]
    },
    {
      "id": "fact-09",
      "category": "claim",
      "topic": "Backtesting Models and Kupiec's POF Test",
      "statement": "To validate whether a VaR model is statistically accurate, institutions backtest the model against historical data by counting exceptions (days where actual loss exceeded predicted VaR). Kupiec's Proportion of Failures (POF) likelihood ratio test formally tests the null hypothesis that the observed failure rate equals the theoretical probability p = 1 - X.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "Backtesting involves testing how well the VaR estimates would have performed in the past. Kupiec developed a likelihood ratio test to determine if the number of exceptions is acceptable.",
        "provenance": "notebooklm_query"
      },
      "tags": ["kupiec_pof_test", "backtesting_validation", "likelihood_ratio", "hypothesis_testing"]
    },
    {
      "id": "fact-10",
      "category": "case_study",
      "topic": "Failure of Variance-Covariance Models in Crisis Regimes (The 1998 LTCM Collapse)",
      "statement": "In the 1998 Long-Term Capital Management (LTCM) collapse, traditional variance-covariance VaR models failed disastrously because historical correlations jumped toward 1.0 during market panic, eliminating anticipated diversification benefits. Normal distribution assumptions severely understated the probability of the 10-sigma flight-to-liquidity shock.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "During extreme crises such as 1998, correlations tend to increase toward 1.0, destroying the diversification benefits predicted by variance-covariance models.",
        "provenance": "notebooklm_query"
      },
      "tags": ["ltcm_crisis", "correlation_breakdown", "fat_tail_failure", "crisis_regimes"]
    },
    {
      "id": "fact-11",
      "category": "claim",
      "topic": "Comprehensive Model Comparison: Historical Simulation vs Model-Building VaR",
      "statement": "Historical simulation requires no distributional assumptions and naturally incorporates non-linear option payoffs and fat tails, but relies heavily on the historical sample and cannot adapt quickly to sudden volatility changes. The model-building approach allows rapid analytical computation and volatility updating (EWMA, GARCH), but is vulnerable to distribution misspecification and non-linear delta-gamma errors.",
      "sourceCitation": {
        "book": "Fundamentals of Futures and Options Markets (John C. Hull)",
        "chapter": "ch20_part2",
        "excerpt": "Historical simulation has the advantage of not requiring distributional assumptions, while model building allows analytical results and easier incorporation of volatility updating.",
        "provenance": "notebooklm_query"
      },
      "tags": ["model_comparison", "tradeoffs", "parametric_vs_non_parametric"]
    }
  ]
};

const dirs = [
  "src/data/chapters/hull_derivatives/ch20_part2",
  "src/data/chapters/hull_derivatives_en/ch20_part2"
];

for (const d of dirs) {
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, "source_facts.json"), JSON.stringify(ch20Part2Facts, null, 2), "utf8");
  console.log(`Wrote exact source_facts.json to ${d}`);
}

