# Cross Hedging, Minimum Variance, Beta Hedging & Metallgesellschaft

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

- en: In this part, we examine the quantitative mechanics of cross hedging. The minimum variance hedge ratio means the ratio of futures to spot that minimizes price variance. Treasurers calculate this ratio to protect non-standard commercial assets.
- hi: Is part mein hum cross hedging ke quantitative calculations master karenge. Minimum variance hedge ratio ka matlab hai futures aur spot ka wo ratio jo price variance ko minimize karta hai. Treasurers is formula se non-standard assets ko protect karte hain.
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

- en: Once the optimal hedge ratio h star is determined, calculate the contracts. The required number N star equals h star multiplied by Q A divided by Q F. Here, Q A is the size of the physical asset, and Q F is the size of one futures contract.
- hi: Optimal hedge ratio h star milne ke baad required contracts calculate kijiye. Total contracts N star barabar h star guna Q A divided by Q F hota hai. Yahan Q A physical exposure ka size hai, aur Q F ek futures contract ka size hai.
- on screen: Hedge effectiveness formula R2 = rho squared

## Scene 2: Worked Example: The Airline Jet Fuel Hedge

_Numerical calculation of optimal contracts for airline hedging jet fuel with heating oil_

**s02b1** (mentor; facts F04)

- en: Let us walk through John Hull's renowned textbook example: a commercial airline must purchase two million gallons of jet fuel in one month. Because jet fuel futures do not trade with sufficient exchange liquidity, the airline's treasury desk decides to cross-hedge using NYMEX heating oil futures.
- hi: Aaiye Hull ke famous airline jet fuel example ko step-by-step calculate karte hain. Ek airline company ko ek mahine baad twenty lakh gallons jet fuel purchase karna hai. Lekin jet fuel ka koi liquid futures contract exist nahi karta, isliye wo NYMEX heating oil futures select karti hai.
- on screen: Givens setup: 2M gallons jet fuel, 42k contract size, volatilities

**s02b2** (mentor; facts F04)

- en: Historical price changes yield the necessary statistical parameters. The standard deviation of jet fuel price changes is zero point zero two six three. Futures standard deviation is zero point zero three one three. Their statistical correlation rho is zero point nine two eight.
- hi: Historical price changes se statistical parameters milte hain. Spot jet fuel volatility sigma S zero point zero two six three hai. Futures volatility sigma F zero point zero three one three hai. Dono ke beech correlation rho zero point nine two eight hai.
- on screen: Step 1: Calculate h* = 0.7777

**s02b3** (mentor; facts F03, F04)

- en: Substituting these parameters into the formula gives h star equals zero point seven eight. Because one NYMEX contract represents forty-two thousand gallons, the airline calculates thirty-seven point one four contracts. Rounding gives thirty-seven contracts.
- hi: Parameters ko formula mein rakhne par h star zero point seven eight milta hai. NYMEX contract forty-two thousand gallons ka hone se airline ko thirty-seven point one four contracts milte hain. Isko round karke exactly thirty-seven contracts bante hain.
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

- en: Under a tailed hedge framework, contract sizing uses total dollar values. The optimal number N star equals h star multiplied by portfolio value divided by futures value. This small adjustment neutralizes daily interest earned or paid on variation margin.
- hi: Tailed hedge framework mein contract sizing total dollar value par hoti hai. Optimal contracts N star barabar h star guna portfolio value divided by futures value hota hai. Ye adjustment daily margin par milne ya dene wale interest ko neutralize karta hai.
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

- en: In this formula, beta represents the portfolio's systematic sensitivity to the equity index. P is the total market value of the investment portfolio. A denotes the current market value of one index futures contract.
- hi: Is formula mein beta stock portfolio ki market sensitivity ko represent karta hai. P investment portfolio ki total current market value hai. A ek stock index futures contract ki current market value hoti hai.
- on screen: Formula N* = beta * (P / A) derivation

**s04b4** (mentor; facts F05)

- en: Shorting index futures instead of selling individual equities delivers immense operational advantages. It slashes transaction costs and avoids disruptive tax consequences. Managers preserve their chosen stock selections.
- hi: Direct shares bechne ke bajaye index futures short karna behtar hota hai. Ye transaction costs ko dramatically kam karta hai aur capital gains taxes bachata hai. Portfolio manager apne chosen stocks ko retain karta hai.
- on screen: Contract value A = Index Price x Multiplier (e.g. S&P 500 x 250)

## Scene 5: Tactical Beta Adjustment: Changing Market Sensitivity

_Step-by-step mechanism for adjusting portfolio beta without liquidating underlying stocks_

**s05b1** (mentor; facts F06)

- en: Hedging equity portfolios is not always about eliminating every drop of market risk. Market risk means market-wide volatility that affects all publicly traded stocks. Often, investment managers want to steer portfolio sensitivity dynamically.
- hi: Equity portfolios ko hedge karne ka matlab hamesha market risk ko zero karna nahi hota. Market risk यानी market-wide volatility hoti hai jo sabhi stocks ko affect karti hai. Aksar fund managers portfolio sensitivity ko dynamically adjust karna chahte hain.
- on screen: The dilemma: why managers avoid selling high-conviction stocks

**s05b2** (mentor; facts F06)

- en: To reduce portfolio beta from beta to a lower target beta star, short index contracts. The required number equals beta minus beta star, multiplied by portfolio value divided by futures value. This defensiveness cushions potential market drops.
- hi: Agar portfolio beta ko lower target beta star par lana ho, toh index futures short kijiye. Contracts ka number beta minus beta star, guna portfolio value divided by futures value hota hai. Ye strategy market decline ke dauran downside buffer deti hai.
- on screen: The formula N* = (beta - beta*) * (P / A) mechanism

**s05b3** (mentor; facts F06)

- en: Conversely, to amplify exposure ahead of a rally, raise beta to a higher target beta star. The manager goes long futures contracts. The formula remains identical, generating a negative short position which represents buying futures.
- hi: Iske opposite, market rally se pehle exposure badhane ke liye beta ko target beta star tak raise kijiye. Manager index futures buy karta hai. Formula bilkul same rehta hai aur negative sign futures buy karne ko indicate karta hai.
- on screen: Synthetic beta adjustment advantages: zero tax, zero slippage

## Scene 6: Hedging Individual Equities & Market Risk

_Analyzing how index futures insulate individual high-conviction stock bets_

**s06b1** (mentor; facts F05)

- en: This powerful hedging framework applies directly to individual stock investments. Suppose an investor identifies a company with exceptional corporate earnings potential, but fears that broader macroeconomic headwinds could drag the entire stock market down.
- hi: Ye same principle individual stocks par bhi apply hota hai. Agar aap kisi specific stock par highly bullish hain lekin overall market direction ke baare mein uncertain hain, toh aap stock ko buy karke uske beta ke proportionate index futures short kar sakte hain.
- on screen: Card 1: Risk decomposition into systematic and unsystematic

**s06b2** (mentor; facts F05)

- en: This strategy enables alpha isolation. Alpha isolation means removing broad market swings so returns depend entirely on superior stock picking. If an asset manager picks equities that outperform the index, shorting futures extracts excess alpha.
- hi: Ye strategy alpha isolation enable karti hai. Alpha isolation ka matlab hai market swings ko remove karke returns ko pure stock picking par depend karwana. Agar manager ke shares index se behtar perform karte hain, toh short futures pure alpha deliver karta hai.
- on screen: Card 2: Stripping broad market swings with index futures

**s06b3** (mentor; facts F05)

- en: What happens when corporate exposures extend over multiple years, but long-dated futures lack liquidity? Hedgers use stack and roll. Stack and roll means rolling front-month futures contracts forward periodically to maintain long-dated hedges.
- hi: Jab corporate commitments kai saalon tak extend hoti hain aur long-dated futures liquid nahi hote, tab kya karein? Treasurers stack and roll deploy karte hain. Stack and roll ka matlab hai front-month contracts ko bar-bar roll karke long hedge maintain karna.
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

- en: The fatal flaw of stack and roll is rollover basis risk. Contango means distant futures trade above spot, while backwardation means spot trades above distant futures. In contango, rolling contracts generates persistent cash losses and margin calls.
- hi: Stack and roll ki sabse badi weakness rollover basis risk hoti hai. Contango यानी distant futures spot se mehnga hona, jabki backwardation यानी spot distant futures se mehnga hota hai. Contango mein roll karne par cash drain aur margin calls face karni padti hain.
- on screen: Comparative summary matrix: liquidity versus rollover risk

## Scene 8: Case Study: Metallgesellschaft's $1.33B Disaster

_Historical post-mortem of how stack-and-roll triggered liquidity insolvency_

**s08b1** (mentor; facts F08)

- en: Consider Business Snapshot 3.2: the 1993 collapse of German conglomerate Metallgesellschaft. Its American subsidiary, MGRM, Metallgesellschaft Refining and Marketing, sold ten-year fixed-price heating oil and gasoline supply contracts covering 160 million barrels.
- hi: Business Snapshot 3.2 mein German conglomerate Metallgesellschaft ka 1993 collapse dekhiye. Unki US subsidiary, MGRM, Metallgesellschaft Refining and Marketing ne customers ko ten-year fixed price par 160 million barrels oil supply karne ke contracts beche.
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

- en: Let us test your understanding with an active recall calculation. Spot price standard deviation is zero point zero four zero. Futures standard deviation is zero point zero five zero. Their correlation rho is zero point eight zero.
- hi: Aaiye active recall calculation se aapka understanding test karte hain. Spot price standard deviation sigma S zero point zero four zero hai. Futures standard deviation sigma F zero point zero five zero hai. Dono ke beech correlation rho zero point eight zero hai.
- on screen: Quiz question presented with sigma_S = 0.04, sigma_F = 0.05, rho = 0.80

**s09b2** (mentor; facts F02)

- en: Pause the video and calculate carefully... Recall the formula h star equals rho multiplied by sigma S divided by sigma F. What is the resulting optimal ratio?
- hi: Formula apply kijiye aur chaar options ko closely evaluate kijiye. Pause and consider.
- on screen: Thinking interval and formula reminder

**s09b3** (mentor; facts F02, F09)

- en: The correct answer is Option B: zero point six four. Multiply zero point eight zero by zero point zero four zero, then divide by zero point zero five zero. This yields zero point six four, hedging sixty-four percent of exposure.
- hi: Sahi answer Option B hai: zero point six four. Formula lagaiye: zero point eight zero guna zero point zero four zero divided by zero point zero five zero. Result zero point six four aata hai, jo sixty-four percent optimal hedge ratio hai.
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
- on screen: Committed credit lines survival lesson

**s10b3** (mentor; facts F01)

- en: Looking ahead on our course roadmap, Chapter 4 turns to Interest Rates. You will learn continuous compounding, treasury zero rates, and how treasurers bootstrap the zero curve from coupon bonds.
- hi: Hamare course roadmap par aage, Chapter 4 mein hum Interest Rates padhenge. Aap continuous compounding, treasury zero rates, aur coupon bonds se zero curve bootstrap karna seekhenge.
- on screen: Roadmap milestone marker and intellectual bridge to Chapter 4 Interest Rates

## Scene 11: Eight Rules to Remember

_Institutional rules codifying cross hedging, beta adjustments, and roll risk_

**s11b1** (mentor; facts F01)

- en: Let us codify the eight quantitative rules of cross hedging and portfolio risk management that govern institutional practice.
- hi: Aaiye cross hedging aur portfolio risk management ke eight quantitative rules ko systematically summarize karte hain.
- on screen: Overview of the 8 quantitative hedging rules

**s11b2** (mentor; facts F01, F02)

- en: Rule 1 optimizes cross hedge sizing using the minimum variance hedge ratio formula. Rule 2 calculates optimal futures contracts by scaling the hedge ratio by relative exposure sizes.
- hi: Rule 1 minimum variance hedge ratio se optimal cross hedge sizing karta hai. Rule 2 relative position sizes ko scale karke total contracts calculate karta hai.
- on screen: Rules 1 and 2 highlighted: Cross hedge definition & h* formula

**s11b3** (mentor; facts F02, F03)

- en: Rule 3 dictates that tailing the hedge adjusts contract counts for daily interest on margin cash flows. Rule 4 uses stock index futures to immunize equity portfolios against systematic market risk.
- hi: Rule 3 daily margin interest ke liye contract count ko tailing adjustment deta hai. Rule 4 stock index futures se equity portfolio ke systematic market risk ko immunize karta hai.
- on screen: Rules 3 and 4 highlighted: Contract count N* & R2 effectiveness

**s11b4** (mentor; facts F05)

- en: Rule 5 dynamically adjusts portfolio market beta using the beta differential formula. Rule 6 enables alpha isolation by removing index movements to isolate stock picking gains.
- hi: Rule 5 beta differential formula se portfolio beta ko dynamically steer karta hai. Rule 6 market index moves ko eliminate karke pure stock selection alpha isolate karta hai.
- on screen: Rules 5 and 6 highlighted: Tailing adjustment & beta hedging

**s11b5** (mentor; facts F06, F08)

- en: Rule 7 utilizes stack and roll strategies to hedge multi-year exposures with liquid front-month contracts. Rule 8 warns that contango markets turn stack and roll into catastrophic margin call drains.
- hi: Rule 7 liquid front-month contracts ko stack and roll karke long-dated commitments hedge karta hai. Rule 8 warn karta hai ki contango markets mein rollover massive cash margin deficits create karta hai.
- on screen: Rules 7 and 8 highlighted: Tactical beta shift & stack and roll discipline

**s11b6** (mentor; facts F01, F02, F08)

- en: Master these eight rules to navigate real-world cross hedging with complete institutional discipline. Next in Chapter 4, we explore interest rates, compounding conventions, and bootstrapping zero curves.
- hi: इन 8 rules ko yaad rakhkar aap real-world cross hedging ko puri discipline ke saath manage kar sakte hain. Next Chapter 4 mein hum interest rates, compounding, aur zero curve bootstrapping seekhenge.
- on screen: Compact final summary overview of all 8 rules
