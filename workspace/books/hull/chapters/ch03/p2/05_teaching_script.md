# Cross Hedging, Beta Hedging & Metallgesellschaft

## Scene 0: Beyond Identical Assets: The Cross-Hedging Dilemma

_Problem-first hook: why airlines and treasurers must hedge with non-identical contracts_

**s00b1** (novice; facts F01)

- en: What happens when a company needs to hedge a commercial commodity, like jet fuel, that has no actively traded futures contract on any global exchange? Can hedging still work?
- hi: अगर किसी कंपनी को जेट फ्यूल जैसी कमोडिटी को हेज करना हो जिसका कोई डायरेक्ट फ्यूचर्स कॉन्ट्रैक्ट एक्सचेंज पर ट्रेड ही नहीं होता, तो कंपनी क्या करेगी? क्या हेजिंग तब भी मुमकिन है?
- on screen: Opening dilemma question on cross hedging without direct contracts

**s00b2** (mentor; facts F01)

- en: In Part 1 of Chapter 3, we examined hedging when the underlying physical asset and the futures contract are identical. In those baseline cases, basis risk is modest. However, in the vast majority of real-world commercial operations, an exchange-traded futures contract matching the company's precise physical commodity simply does not exist.
- hi: Part One mein humne dekha ki jab physical asset aur futures contract identical hon—jaise crude oil ko crude oil futures se hedge karna—toh basis risk kaafi manageable hota hai. Lekin real world commercial markets mein aksar ek critical problem aati hai: har physical commodity ka exact futures contract exchange par available nahi hota.
- on screen: The mentor defines the cross hedging imperative

**s00b3** (mentor; facts F01, F02)

- en: This operational reality introduces Cross Hedging: the practice of hedging an exposure in one physical asset by taking a futures position in a different, but economically correlated, financial or commodity contract. A classic example is a commercial airline hedging millions of gallons of jet fuel using exchange-traded NYMEX heating oil futures.
- hi: Is situation ko Cross Hedging kehte hain. Jab ek company kisi physical asset ki price volatility ko protect karne ke liye kisi doosre correlated asset ke futures contract ko use karti hai—jaise jet fuel price ko hedge karne ke liye heating oil futures use karna.
- on screen: Dangers of naive one-to-one hedging across differing volatilities

**s00b4** (mentor; facts F02)

- en: This raises a fundamental quantitative question: if the two assets do not move in perfect one-to-one lockstep, exactly how many futures contracts should the corporate treasurer trade? The mathematical solution to this challenge is the Minimum Variance Hedge Ratio, derived through statistical calculus.
- hi: Lekin ab ek fundamental quantitative sawal samne aata hai: agar do assets ke price movements perfectly match nahi karte, toh hume kitne contracts trade karne chahiye? Is sawal ka jawab deta hai Minimum Variance Hedge Ratio.
- on screen: Introduction of the Minimum Variance Hedge Ratio formula

## Scene 1: The Minimum Variance Hedge Ratio Formula

_Mathematical breakdown of h* = rho * (sigma_S / sigma_F)_

**s01b1** (mentor; facts F02)

- en: By applying statistical optimization to minimize the variance of the hedged portfolio's value changes, John Hull derives the optimal Minimum Variance Hedge Ratio, denoted as h star. The formula states: h star equals rho multiplied by sigma S divided by sigma F.
- hi: Statistical calculus apply karke John C. Hull ne Minimum Variance Hedge Ratio ka exact formula derive kiya hai: h star barabar rho guna sigma S divided by sigma F.
- on screen: Formula definition and mathematical derivation overview

**s01b2** (mentor; facts F02)

- en: Let us define each variable carefully: rho is the linear correlation coefficient between the change in spot price delta S and the change in futures price delta F over the hedging horizon. Sigma S is the standard deviation of spot price changes, and sigma F is the standard deviation of futures price changes.
- hi: Yahan rho spot price change delta S aur futures price change delta F ke beech ka statistical correlation coefficient hai. Sigma S spot price change ka standard deviation hai, aur sigma F futures price change ka standard deviation hai.
- on screen: Explaining correlation rho and standard deviation ratio

**s01b3** (mentor; facts F02)

- en: Notice the intuitive economics: if the futures contract is more volatile than the underlying spot asset—meaning sigma F exceeds sigma S—each futures contract exhibits larger price swings. Consequently, fewer futures contracts are required to offset spot movements, driving h star below one.
- hi: Is formula ka intuition samajhiye. Agar futures contract spot asset ke comparison mein zyada volatile ho—yaani sigma F bada ho—toh futures ka har contract zyada dollar movement produce karega. Isliye hume kam futures contracts ki zaroorat padegi, aur h star ek se kam ho jayega.
- on screen: Regression interpretation: slope coefficient of OLS fit

**s01b4** (mentor; facts F02, F03)

- en: Once the optimal hedge ratio h star is determined, the required number of futures contracts, N star, is computed as h star multiplied by Q sub A divided by Q sub F, where Q sub A is the total physical units of the commercial exposure, and Q sub F is the standardized volume of a single futures contract.
- hi: Ek baar h star calculate ho jaye, toh total optimal contracts N star ka formula hota hai: h star guna Q A divided by Q F, jahan Q A physical exposure size hai aur Q F ek futures contract ka size hai.
- on screen: Hedge effectiveness formula R2 = rho squared

## Scene 2: Worked Example: The Airline Jet Fuel Hedge

_Numerical calculation of optimal contracts for airline hedging jet fuel with heating oil_

**s02b1** (mentor; facts F04)

- en: Let us walk through John Hull's renowned textbook example: a commercial airline must purchase two million gallons of jet fuel in one month. Because jet fuel futures do not trade with sufficient exchange liquidity, the airline's treasury desk decides to cross-hedge using NYMEX heating oil futures.
- hi: Aaiye Hull ke famous airline jet fuel example ko step-by-step calculate karte hain. Ek airline company ko ek mahine baad twenty lakh gallons jet fuel purchase karna hai. Lekin jet fuel ka koi liquid futures contract exist nahi karta, isliye wo NYMEX heating oil futures select karti hai.
- on screen: Givens setup: 2M gallons jet fuel, 42k contract size, volatilities

**s02b2** (mentor; facts F04)

- en: Analyzing historical monthly price changes over the past eighteen months yields the following statistical parameters: the standard deviation of jet fuel price changes sigma S is zero point zero two six three dollars; the standard deviation of heating oil futures changes sigma F is zero point zero three one three dollars; and their statistical correlation rho is zero point nine two eight.
- hi: Historical statistical data ke mutabik: spot jet fuel volatility sigma S zero point zero two six three hai, heating oil futures volatility sigma F zero point zero three one three hai, aur dono ke beech correlation rho zero point nine two eight hai.
- on screen: Step 1: Calculate h* = 0.7777

**s02b3** (mentor; facts F03, F04)

- en: Substituting these values into the minimum variance formula gives: h star equals zero point nine two eight multiplied by zero point zero two six three divided by zero point zero three one three, which equals zero point seven seven seven seven. Because one NYMEX heating oil contract represents forty-two thousand gallons, N star equals zero point seven seven seven seven multiplied by two million divided by forty-two thousand, yielding thirty-seven point zero three, or exactly thirty-seven contracts.
- hi: Hedge ratio calculate kijiye: zero point nine two eight guna zero point zero two six three divided by zero point zero three one three barabar zero point seven seven seven seven. NYMEX heating oil ka contract size forty-two thousand gallons hota hai. Isliye N star barabar zero point seven seven seven seven guna twenty lakh divided by forty-two thousand equals thirty-seven point zero three, yaani exactly thirty-seven contracts.
- on screen: Step 2: Calculate N* = 37.03, rounded to 37 contracts

## Scene 3: Marking-to-Market Friction & Tailing the Hedge

_Contrasting forward contract theoretical hedging with daily futures margin settlement_

**s03b1** (mentor; facts F01)

- en: There is a subtle institutional distinction that quantitative asset managers must account for: daily settlement friction. In theoretical forward contracts, payoff occurs in a single lump sum at final maturity. But in futures markets, cash flows are realized and credited or debited every single afternoon through daily marking to market.
- hi: Lekin theoretical hedge ratio mein ek subtle institutional detail abhi bhi baaki hai: daily settlement. Futures contracts mein profit aur loss har sham cash mein settle hota hai jise marking-to-market kehte hain.
- on screen: Forward contracts versus daily marking to market contrast

**s03b2** (mentor; facts F01)

- en: Incorporating the interest rate discounting and reinvestment effects of these daily cash flows is known as Tailing the Hedge. When a hedge is tailed, the optimal hedge ratio is estimated using percentage returns on spot and futures rather than absolute dollar changes.
- hi: Is daily cash flow ke interest aur reinvestment impact ko incorporate karne ki process ko Tailing the Hedge kaha jata hai. Isme raw price changes ki jagah percentage returns use kiye jate hain.
- on screen: Daily interest drag and reinvestment friction

**s03b3** (mentor; facts F01, F03)

- en: Under a tailed hedge framework, the optimal number of contracts is formulated using total portfolio dollar values: N star equals h hat multiplied by V sub A divided by V sub F, where V sub A is the current dollar value of the hedged asset, and V sub F is the current dollar notional value of one futures contract. This adjustment provides enhanced precision in institutional portfolio risk management.
- hi: Tailed hedge ratio h-hat ke tahat optimal contracts ka formula dollar values par base ho jata hai: h-hat guna portfolio value V A divided by futures contract value V F. Ye practical asset management mein precision provide karta hai.
- on screen: Tailing formula resolution: N* = h* * (V_A / V_F)

## Scene 4: Stock Index Futures: Neutralizing Market Exposure

_Mathematical derivation of portfolio beta hedging using index futures_

**s04b1** (mentor; facts F05)

- en: Now let us transition from physical commodities to equity portfolios. Suppose an institutional fund manager oversees a multi-million dollar equity portfolio. If the manager anticipates an impending macroeconomic downturn, how can they protect the portfolio against a severe market crash without liquidating their underlying stocks?
- hi: Ab commodity markets se moving out karke hum equity markets mein enter karte hain. Agar ek fund manager ke paas multi-million dollar equity portfolio ho, toh wo broad market crash se kaise bachega?
- on screen: Introduction to equity index hedging and portfolio risk breakdown

**s04b2** (mentor; facts F05)

- en: John Hull explains that rather than selling individual shares, the fund manager hedges by shorting Stock Index Futures, such as the S&P 500 futures contract. The optimal number of contracts to completely immunize the portfolio is given by N star equals beta multiplied by V sub A divided by V sub F.
- hi: John C. Hull explain karte hain ki portfolio ko hedge karne ke liye individual shares sell karne ki zaroorat nahi hoti. Manager stock index futures use karta hai. Optimal contracts ka formula hota hai: N star barabar beta guna V A divided by V F.
- on screen: Deconstructing systematic risk versus specific company alpha

**s04b3** (mentor; facts F05)

- en: In this formula, beta represents the portfolio's systematic sensitivity relative to the equity index, V sub A is the total market value of the equity portfolio, and V sub F is the notional value of one index futures contract—calculated as the current futures price multiplied by the exchange contract multiplier.
- hi: Yahan beta Capital Asset Pricing Model ke mutabik portfolio ki systematic market sensitivity hai, V A portfolio ki total dollar value hai, aur V F ek futures contract ki notional value hai yaani index futures price guna contract multiplier.
- on screen: Formula N* = beta * (P / A) derivation

**s04b4** (mentor; facts F05)

- en: Shorting index futures instead of selling individual equities delivers immense operational advantages: it dramatically slashes trading commissions, completely avoids market price impact, eliminates disruptive capital gains taxes, and preserves the manager's stock-picking alpha while neutralizing broad market beta.
- hi: Stocks bechne ki jagah index futures short karne ka sabse bada benefit ye hai ki brokerage commissions aur transaction costs drastically kam hoti hain, aur manager ka stock-picking excess return yaani alpha hundred percent intact rehta hai.
- on screen: Contract value A = Index Price x Multiplier (e.g. S&P 500 x 250)

## Scene 5: Tactical Beta Adjustment: Changing Market Sensitivity

_Step-by-step mechanism for adjusting portfolio beta without liquidating underlying stocks_

**s05b1** (mentor; facts F06)

- en: Index futures provide another extraordinary institutional capability: Tactical Beta Adjustment. Fund managers do not have to eliminate market risk entirely; they can dynamically increase or decrease their portfolio's beta without buying or selling a single share of stock.
- hi: Futures market fund managers ko ek aur powerful ability deti hai jise Tactical Beta Adjustment kehte hain. Bina ek bhi stock khareede ya beche, manager portfolio ke market risk ko systematically modify kar sakta hai.
- on screen: The dilemma: why managers avoid selling high-conviction stocks

**s05b2** (mentor; facts F06)

- en: If a manager wishes to reduce a portfolio's beta from an existing level of beta to a more conservative target level beta star—for example, reducing beta from one point four down to zero point seven—the manager simply shorts beta minus beta star multiplied by V sub A divided by V sub F contracts.
- hi: Agar current beta se target beta star kam karna ho—jaise beta one point four se zero point seven par lana ho—toh manager beta minus beta star guna V A divided by V F contracts short kar deta hai.
- on screen: The formula N* = (beta - beta*) * (P / A) mechanism

**s05b3** (mentor; facts F06)

- en: Conversely, ahead of an anticipated market rally, if the manager wishes to amplify market exposure by raising beta from zero point eight up to one point two, the manager goes long beta star minus beta multiplied by V sub A divided by V sub F contracts. Futures enable frictionless, instantaneous portfolio rebalancing.
- hi: Iske opposite, agar market mein bullish rally expected ho aur beta badhana ho—jaise zero point eight se one point two karna ho—toh manager beta star minus beta guna V A divided by V F contracts long kar leta hai.
- on screen: Synthetic beta adjustment advantages: zero tax, zero slippage

## Scene 6: Hedging Individual Equities & Market Risk

_Analyzing how index futures insulate individual high-conviction stock bets_

**s06b1** (mentor; facts F05)

- en: This powerful hedging framework applies directly to individual stock investments. Suppose an investor identifies a company with exceptional corporate earnings potential, but fears that broader macroeconomic headwinds could drag the entire stock market down.
- hi: Ye same principle individual stocks par bhi apply hota hai. Agar aap kisi specific stock par highly bullish hain lekin overall market direction ke baare mein uncertain hain, toh aap stock ko buy karke uske beta ke proportionate index futures short kar sakte hain.
- on screen: Card 1: Risk decomposition into systematic and unsystematic

**s06b2** (mentor; facts F05)

- en: The investor can purchase the individual stock and simultaneously short index futures in an amount proportional to the stock's beta. This strategy is known as Alpha Isolation: broad market systematic noise is filtered out, leaving the investor exposed purely to the company's idiosyncratic outperformance.
- hi: Is strategy ko Alpha Isolation kehte hain. Market chahe crash kare ya rally kare, market ka systematic component neutralize ho jata hai, aur aapko sirf company ki outperformance ka pure profit milta hai.
- on screen: Card 2: Stripping broad market swings with index futures

**s06b3** (mentor; facts F05)

- en: Now, let us examine a sophisticated corporate hedging strategy that resulted in one of the most famous and catastrophic risk management failures in financial history: Stack and Roll.
- hi: Lekin ab aate hain corporate finance ke ek aise dangerous strategy par jisne global financial history ka sabse bada hedging breakdown create kiya: Stack and Roll.
- on screen: Card 3: Pure alpha isolation across bull or bear markets

## Scene 7: Stack and Roll: Rolling Front-Month Contracts

_Comparative matrix of Stack-and-Roll versus Strip Hedging for long-dated exposures_

**s07b1** (mentor; facts F07)

- en: Commercial enterprises frequently sign fixed-price supply agreements with customers spanning five to ten years into the future. However, liquid exchange-traded futures contracts rarely trade with substantial volume beyond a few months or a year.
- hi: Aksar ek enterprise ke paas five ya ten years ke long-term commercial commitments hote hain. Lekin futures contracts exchange par sirf six months tak hi heavily liquid hote hain.
- on screen: Stack and roll strategy row highlighted

**s07b2** (mentor; facts F07)

- en: To bridge this immense maturity mismatch, corporations implement a strategy known as Stack and Roll: the firm concentrates, or 'stacks', a massive volume of short-dated front-month futures contracts to match the total long-term physical commitment.
- hi: Is maturity gap ko bridge karne ke liye companies Stack and Roll strategy use karti hain. Total long-term exposure ke barabar short-dated liquid futures contracts khareede jate hain, jise Stacking kehte hain.
- on screen: Strip hedge strategy row highlighted

**s07b3** (mentor; facts F07)

- en: As the front-month contracts approach expiration, the firm closes them out via offsetting trades and immediately re-establishes the positions in the subsequent contract month—effectively 'rolling' the hedge forward in time. When markets remain in backwardation, this roll yields consistent profits; but when markets flip into contango, rolling produces severe rollover losses.
- hi: Jab ye short-dated contracts expire hone wale hote hain, toh unhe closeout karke immediately agle front-month contracts mein shift kar diya jata hai, jise Rolling the hedge forward kehte hain.
- on screen: Comparative summary matrix: liquidity versus rollover risk

## Scene 8: Case Study: Metallgesellschaft's $1.33B Disaster

_Historical post-mortem of how stack-and-roll triggered liquidity insolvency_

**s08b1** (mentor; facts F08)

- en: In Business Snapshot 3.2, John Hull dissects the historic one-point-three-three billion dollar collapse of German industrial conglomerate Metallgesellschaft in 1993. Its American subsidiary, MGRM, sold long-term fixed-price delivery contracts covering one hundred and sixty million barrels of refined oil over five to ten years.
- hi: Nineteen ninety-three mein German conglomerate Metallgesellschaft ki US subsidiary MGRM ne independent retailers ko ten years ke liye fixed price par sixteen crore barrels heating oil aur gasoline supply karne ka contract sign kiya.
- on screen: Metallgesellschaft initial setup: 160M barrels guaranteed

**s08b2** (mentor; facts F08)

- en: To hedge this colossal exposure, MGRM stacked fifty-five million barrels of front-month NYMEX crude oil, heating oil, and gasoline futures, planning to roll the contracts forward month after month. On paper, the long-term physical sales and short-term futures hedges appeared balanced.
- hi: Is exposure ko hedge karne ke liye MGRM ne NYMEX par massive short-dated futures buy karke unhe stack-and-roll karna shuru kiya. Paper par ye hedge perfectly balanced dikh raha tha.
- on screen: The maturity mismatch: 10-year contracts hedged with 1-month futures

**s08b3** (mentor; facts F08)

- en: However, in late 1993, global oil prices experienced a catastrophic collapse. Because futures contracts settle daily through marking to market, the NYMEX clearinghouse issued hundreds of millions of dollars in immediate cash margin calls against MGRM's stacked long positions.
- hi: Lekin late nineteen ninety-three mein crude oil prices unexpectedly collapse ho gaye. NYMEX clearing house ne daily marking-to-market par hundreds of millions of dollars ka cash variation margin demand kiya.
- on screen: Market shifts into contango; rollover losses trigger catastrophic margin calls

**s08b4** (mentor; facts F08)

- en: Here was the fatal vulnerability: Cash Flow Timing Mismatch. MGRM's physical customers paid their revenues gradually over ten years, but NYMEX required hundreds of millions in hard cash immediately! Facing severe liquidity exhaustion, parent company banks panicked, fired management, and forcibly liquidated all futures contracts into a depressed market, crystallizing an astronomical one-point-three-three billion dollar net cash loss.
- hi: Problem ye thi ki customers se revenue agle ten years mein cash aana tha, lekin futures losses aaj cash mein pay karne the. Is Cash Flow Timing Mismatch ne MGRM par one point three three billion dollars ka cash drain create kiya, aur supervisory board ne panic hokar bottom par sabhi positions liquidate kar di.
- on screen: The $1.33B final liquidation: lesson on cash flow timing versus accounting hedge

## Scene 9: Active Recall: Calculating the Hedge Ratio

_Check student mastery of minimum variance hedge ratio calculation_

**s09b1** (mentor; facts F02, F09)

- en: Let us now test your practical mastery of minimum variance calculations. Suppose an institutional risk manager measures the historical standard deviation of spot price changes to be zero point zero three zero, and the standard deviation of futures price changes to be zero point zero four zero. If the correlation between spot and futures changes is zero point eight zero, what is the optimal Minimum Variance Hedge Ratio, h star?
- hi: Chaliye ab aapki quantitative calculation test karte hain. Ek commodity spot price ka standard deviation zero point zero three zero hai, futures ka standard deviation zero point zero four zero hai, aur correlation zero point eight zero hai. Minimum variance hedge ratio kya hoga?
- on screen: Quiz question presented with sigma_S = 0.04, sigma_F = 0.05, rho = 0.80

**s09b2** (mentor; facts F02)

- en: Pause the video and calculate carefully... Recall the formula h star equals rho multiplied by sigma S divided by sigma F. What is the resulting optimal ratio?
- hi: Formula apply kijiye aur chaar options ko closely evaluate kijiye. Pause and consider.
- on screen: Thinking interval and formula reminder

**s09b3** (mentor; facts F02, F09)

- en: The correct answer is Option C: zero point six zero. Applying the formula: zero point eight zero multiplied by zero point zero three zero divided by zero point zero four zero yields zero point eight zero multiplied by zero point seven five, which equals zero point six zero. This indicates that for every one thousand units of physical exposure, exactly six hundred units of futures contracts must be traded to achieve the variance-minimizing hedge.
- hi: Correct answer hai Option C: Zero point six zero. Calculation dekhiye: h star barabar rho guna sigma S divided by sigma F, yaani zero point eight zero guna zero point zero three zero divided by zero point zero four zero barabar zero point six zero. Iska matlab spot position ke har one thousand units ke liye six hundred units futures contract ki zaroorat hogi.
- on screen: Reveal Option B (0.64) with complete mathematical walkthrough

## Scene 10: Where We Are: Liquidity vs. Basis Risk

_Synthesize quantitative hedging lessons and bridge to Chapter 4 Interest Rates_

**s10b1** (mentor; facts F01, F07)

- en: Synthesizing both parts of Chapter 3 delivers an indispensable truth for every risk professional: hedging is never merely about calculating theoretical basis spreads; it is fundamentally about actively managing cash flow liquidity.
- hi: Chapter Three ke dono parts ko unite karne par hume ek profound corporate risk management lesson milta hai: Hedging sirf theoretical spread calculate karne ka naam nahi hai; hedging cash liquidity manage karne ka naam hai.
- on screen: Core pedagogical synthesis: managing basis risk versus liquidity risk

**s10b2** (mentor; facts F01)

- en: Without dedicated, committed credit lines capable of withstanding severe marking-to-market margin calls, even a mathematically perfect hedge can force a solvent corporation into bankruptcy, exactly as witnessed in the Metallgesellschaft disaster.
- hi: Agar aapki company ke paas marking-to-market margin calls jhelne ke liye committed credit lines nahi hain, toh mathematically correct hedge bhi aapko bankruptcy ke kagaar par khada kar sakta hai, jaisa Metallgesellschaft ke sath hua.
- on screen: Roadmap milestone marker and intellectual bridge to Chapter 4

## Scene 11: Eight Rules to Remember

_Institutional rules codifying cross hedging, beta adjustments, and roll risk_

**s11b1** (mentor; facts F01)

- en: Let us codify the four quantitative pillars of Chapter 3 that will govern your institutional risk management practice.
- hi: Aaiye Chapter Three ke final chaar quantitative pillars ko summarize karte hain jo aapko hamesha yaad rakhne hain.
- on screen: Overview of the 8 quantitative hedging rules

**s11b2** (mentor; facts F01, F02)

- en: First Pillar: Minimum Variance Hedge Ratio. When cross-hedging non-identical assets, contract sizing is statistically optimized through h star equals rho multiplied by sigma S divided by sigma F.
- hi: Pehla pillar: Minimum Variance Hedge Ratio. Jab underlying assets alag hon, h star barabar rho guna sigma S divided by sigma F se optimal hedge sizing nikala jata hai.
- on screen: Rules 1 and 2 highlighted: Cross hedge definition & h* formula

**s11b3** (mentor; facts F02, F03)

- en: Second Pillar: Equity Beta Hedging. Shorting N star equals beta multiplied by V sub A divided by V sub F index contracts immunizes stock portfolios against systematic market downturns while preserving stock-picking alpha.
- hi: Dusra pillar: Equity Beta Hedging. N star barabar beta guna V A divided by V F stock portfolio ke systematic market risk ko zero karta hai bina underlying shares beche.
- on screen: Rules 3 and 4 highlighted: Contract count N* & R2 effectiveness

**s11b4** (mentor; facts F05)

- en: Third Pillar: Tactical Beta Adjustment. Futures allow investment managers to dynamically raise or lower portfolio market sensitivity without buying or selling a single physical share.
- hi: Teesra pillar: Tactical Beta Adjustment. Index futures long ya short karke fund manager portfolio beta ko desired target beta star par smoothly steer kar sakta hai.
- on screen: Rules 5 and 6 highlighted: Tailing adjustment & beta hedging

**s11b5** (mentor; facts F06, F08)

- en: Fourth Pillar: The Metallgesellschaft Rule. Cash flow timing mismatches can turn sound hedges fatal. Always back futures positions with robust liquid reserves to survive daily marking-to-market calls. In Chapter 4, we will master Interest Rates, Zero Rates, Forward Rates, and the Yield Curve!
- hi: Chautha pillar: Metallgesellschaft Liquidity Rule. Stack-and-roll hedging mein cash flow timing mismatch sabse bada killer hai. Hamesha margin liquidity ko hedge ka hissa maniye.
- on screen: Rules 7 and 8 highlighted: Tactical beta shift & stack and roll discipline

**s11b6** (mentor; facts none)

- en: Master these eight quantitative principles to navigate real-world derivatives risk with complete institutional rigor. You are now prepared for Chapter 4.
- hi: इन आठ नियमों को अच्छी तरह समझकर आप रियल-वर्ल्ड डेरिवेटिव्स रिस्क को पूरी सूझबूझ के साथ मैनेज कर सकते हैं। अब आप चैप्टर 4 के लिए तैयार हैं।
- on screen: Compact final summary overview of all 8 rules

