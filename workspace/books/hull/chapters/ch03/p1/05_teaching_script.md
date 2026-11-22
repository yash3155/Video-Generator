# Hedging Strategies Using Futures

## Scene 0: The Corporate Dilemma: Why Companies Hedge

_Problem-first hook: why commercial enterprises trade futures without seeking speculative profit_

**s00b1** (novice; facts F01)

- en: Why do commercial enterprises trade millions in futures contracts if they never intend to take physical delivery or seek trading profits? Is hedging really worth the capital?
- hi: कमर्शियल कंपनियाँ फ्यूचर्स में करोड़ों का ट्रेड क्यों करती हैं जब उन्हें डिलीवरी भी नहीं लेनी होती? क्या हेजिंग सच में कंपनियों के लिए फायदेमंद है?
- on screen: Opening dilemma question on corporate hedging motivations

**s00b2** (mentor; facts F01)

- en: In Chapter 2, we examined the daily operational machinery of futures markets and the discipline of margin accounts. But what is the primary economic objective of financial derivatives? Commercial enterprises do not enter futures markets to engage in speculation; rather, they deploy futures to neutralize severe commercial price risks and safeguard enterprise solvency.
- hi: Chapter Two mein humne futures exchange ki operational machinery, margin accounts aur daily marking-to-market ko closely analyze kiya tha. Lekin derivatives markets ka primary economic purpose kya hai? Ek commercial enterprise futures contracts ko speculate karne ke liye use nahi karti, balki risk ko neutralize karne ke liye use karti hai.
- on screen: The mentor sets the economic objective of derivatives

**s00b3** (mentor; facts F01)

- en: The foundational philosophy of corporate hedging is straightforward: its purpose is never to generate speculative trading profits, but to minimize the variance and unpredictability of corporate cash flows. By stabilizing revenues and raw material input costs, a company can focus on its core operating activities without fearing catastrophic market price swings.
- hi: Hedging ka fundamental rule samajhna bahut zaroori hai. Hedging ka maksad spot market se outsmart karke extra profit kamana nahi hota. Iska sole objective corporate cash flows ki variance ko minimize karna hai, taaki ek business predictable prices par safely operate kar sake.
- on screen: Variance minimization as the foundational corporate philosophy

**s00b4** (mentor; facts F01)

- en: In Section 3.1, John Hull establishes the two core categories of corporate hedging strategies: the Short Hedge, deployed to protect physical inventories and future production against falling market prices, and the Long Hedge, utilized to lock in acquisition costs for essential raw materials. Let us explore the mechanics of both strategies.
- hi: John C. Hull ne corporate hedging ko do core categories mein classify kiya hai: pehla, Short Hedge, jo existing inventory ya future production ko protect karta hai; aur doosra, Long Hedge, jo raw material purchase costs ko lock karta hai.
- on screen: Introduction of Short Hedge and Long Hedge categories

## Scene 1: The Mechanics of Short and Long Hedges

_Contrasting physical commercial exposure with offsetting futures contracts_

**s01b1** (mentor; facts F01, F02)

- en: A Short Hedge is implemented when a commercial enterprise already owns an asset, or expects to produce a commodity in the future, and fears that market prices might decline before the asset can be sold in the physical marketplace. To eliminate downside price risk, the company takes a short position in futures contracts.
- hi: Short Hedge tab lagaya jata hai jab kisi company ke paas koi physical asset already maujood ho, ya wo future date par use produce karne wali ho, aur use darr ho ki selling date tak market prices gir na jayein.
- on screen: Defining the short hedger natural long exposure

**s01b2** (mentor; facts F02)

- en: Consider John Hull's classic crude oil producer example: on May 15, an independent oil company anticipates having one million barrels of crude oil ready for physical sale in mid-August. The current spot price is eighty dollars per barrel, and the August NYMEX crude oil futures contract trades at seventy-nine dollars per barrel.
- hi: John C. Hull ka classic crude oil producer example dekhiye. May ke mahine mein ek oil company ke paas ten lakh barrels crude oil hai, jise use August mein sell karna hai. Current spot price eighty dollars per barrel hai, aur August futures contract NYMEX par seventy-nine dollars per barrel quote ho raha hai.
- on screen: Crude oil producer example initial setup

**s01b3** (mentor; facts F01, F03)

- en: Because one NYMEX crude oil contract represents exactly one thousand barrels, the producer hedges its one-million-barrel production by short selling exactly one thousand August contracts. Now, observe how this short hedge performs regardless of which direction world oil markets move over the summer.
- hi: NYMEX ka standard contract size one thousand barrels hota hai. Isliye company August ke one thousand futures contracts short, yaani sell kar deti hai. Ab dekhiye ki market chahe kisi bhi direction mein move kare, kya result nikalta hai.
- on screen: Defining the long hedger natural short exposure

**s01b4** (mentor; facts F03, F11)

- en: Suppose by August 15, global spot crude prices have plunged to seventy-five dollars per barrel. The producer sells its physical oil in the spot market for seventy-five million dollars, suffering a five-million-dollar loss relative to May. However, the short futures position is bought back at seventy-five dollars, generating a four-dollar-per-barrel profit, or four million dollars cash. Adding the four-million-dollar futures gain to the seventy-five-million-dollar physical sale locks in an effective selling price of exactly seventy-nine million dollars, completely immunizing the firm against the market crash.
- hi: Agar August aate-aate crude oil ka spot price girkar seventy-five dollars ho jata hai, toh physical oil seventy-five million dollars mein bikega. Lekin futures position par company ko four dollars per barrel ka profit hoga, yaani four million dollars. Dono milakar total revenue exactly seventy-nine million dollars par lock ho gayi.
- on screen: Copper fabricator example capping raw material costs

## Scene 2: Four Pillars of Corporate Hedging

_Architectural principles underpinning corporate derivatives usage_

**s02b1** (mentor; facts F01, F04)

- en: Conversely, a Long Hedge is deployed when a commercial manufacturer knows it must purchase a physical commodity or raw material in the future, and fears that an unexpected market price surge might squeeze profit margins or cause severe operational losses.
- hi: Doosri taraf, Long Hedge tab use hota hai jab kisi company ko future mein koi raw material purchase karna ho, aur use darr ho ki input prices tezi se surge ho sakti hain.
- on screen: Pillar 1 and 2 introduction

**s02b2** (mentor; facts F06)

- en: Analyze John Hull's copper fabricator example: on January 15, a copper manufacturing company wins a commercial contract to supply pipe fittings in mid-May. Fulfilling the order requires purchasing one hundred thousand pounds of physical copper on May 15. The current spot price is three dollars and forty cents per pound, and the May COMEX copper futures contract trades at three dollars and twenty cents per pound.
- hi: Hull ke copper fabricator example ko analyze kijiye. January fifteenth ko ek manufacturing company ko pata chalta hai ki May fifteenth ko use one lakh pounds copper ki zaroorat padegi. Current spot price three hundred forty cents per pound hai, aur May COMEX futures three hundred twenty cents per pound chal raha hai.
- on screen: Pillar 3 basis dynamics

**s02b3** (mentor; facts F07)

- en: Because one COMEX copper futures contract represents twenty-five thousand pounds, the fabricator purchases exactly four May contracts. If spot copper surges to three dollars and twenty-five cents by May, the firm pays three hundred and twenty-five thousand dollars in the spot market. However, closing the long futures position yields a five-cent-per-pound gain, or five thousand dollars, reducing the net cash outlay to exactly three hundred and twenty thousand dollars—locking in the planned three-dollar-and-twenty-cent cost.
- hi: COMEX copper contract twenty-five thousand pounds ka hota hai. Company May ke four futures contracts buy, yaani long kar leti hai. Agar May mein copper ka price badhkar three hundred twenty-five cents ho jaye, toh physical purchase par three hundred twenty-five thousand dollars kharch honge, lekin futures par five thousand dollars ka gain hoga. Net outlay exactly three hundred twenty thousand dollars rahega.
- on screen: Pillar 4 delivery month selection

## Scene 3: The Concept of Basis: Measuring Market Divergence

_Mathematical definition of basis and the net realized price formula_

**s03b1** (mentor; facts F04)

- en: The structural comparison between these two hedging archetypes is symmetrical and elegant. The Short Hedger has a natural long commercial position—they hold physical inventory or future production—and therefore enters a short futures position to construct an offsetting downside buffer.
- hi: Dono strategies ki comparison clear hai. Short Hedger spot market mein natural long position rakhta hai, aur futures market mein short position lekar downside protection secure karta hai.
- on screen: Formal definition of basis b = S - F

**s03b2** (mentor; facts F05)

- en: In contrast, the Long Hedger is a future commercial buyer with a natural short liability, and therefore initiates a long futures position to cap potential upside cost surges. In both instances, physical market exposures and financial exchange positions move in exact opposite directions.
- hi: Iske opposite, Long Hedger spot market mein future buyer hota hai, yaani natural short exposure par hota hai, aur futures market mein long position lekar upside price surge ke khilaf ceiling create karta hai.
- on screen: Net realized price formula Net = F1 + b2

**s03b3** (mentor; facts F04, F05)

- en: However, this raises a crucial practical question: are real-world corporate hedges always mathematically perfect? In real commercial markets, the answer is almost never. Real-world corporate treasurers face an unavoidable financial reality known as Basis Risk.
- hi: Lekin ab ek critical sawal uthta hai: kya real world mein ye hedges hamesha hundred percent perfect hote hain? Bilkul nahi. Real world mein hume face karna padta hai Basis Risk.
- on screen: Basis convergence and substitution insight

## Scene 4: The Causal Architecture of Corporate Hedging

_Tracing the end-to-end mechanism from exposure to solvency preservation_

**s04b1** (mentor; facts F01, F02)

- en: In quantitative financial analysis, Basis is formally defined as the Spot Price of the asset being hedged minus the Futures Price of the contract used. Mathematically, Basis b equals Spot Price S minus Futures Price F.
- hi: Finance mein Basis ka matlab hota hai: asset ka local Spot Price minus use hone wale contract ka Futures Price. Yaani b barabar S minus F.
- on screen: Condition and action in causal chain

**s04b2** (mentor; facts F02)

- en: If a corporate hedge is maintained until the contract's delivery maturity date, and the physical asset is identical to the futures contract grade, the basis converges strictly to zero. But in everyday corporate practice, hedges are frequently closed out well before contract expiration, and the physical asset may differ in grade or delivery location, causing the basis to fluctuate unpredictably.
- hi: Agar hedge exact delivery date par close ho aur physical asset futures contract ke standard se perfectly match kare, toh maturity par basis zero ho jata hai. Lekin practical trading mein hedge expiration date se pehle close karna padta hai, jahan basis constantly fluctuate karta hai.
- on screen: Market shock and offsetting cash flow mechanism

**s04b3** (mentor; facts F02)

- en: Let us formalize this with equations: at hedge inception time one, the initial basis is b one, equal to S one minus F one. At hedge closeout time two, the terminal basis is b two, equal to S two minus F two. For a short hedger, the net realized selling price per unit equals the initial futures price F one plus the terminal basis b two.
- hi: Isko mathematical equation mein dekhiye. Hedge initiation par basis b-one barabar S-one minus F-one tha. Closeout time two par basis b-two barabar S-two minus F-two hota hai. Dono cases mein corporate hedger ka realized price F-one plus b-two ke barabar nikalta hai.
- on screen: Deterministic revenue outcome

**s04b4** (mentor; facts F01)

- en: This equation reveals the fundamental nature of hedging: corporate hedging does not eliminate risk; rather, it replaces outright price risk with Basis Risk. Because basis volatility is vastly smaller than outright spot price volatility, overall enterprise risk is drastically compressed.
- hi: Iska matlab ye hai ki futures hedging ne outright price risk ko completely eliminate karke use Basis Risk se replace kar diya hai. Kyunki basis ka variance spot price ke variance se bahut chhota hota hai, overall financial risk drastically reduce ho jata hai.
- on screen: Enterprise solvency preservation consequence

## Scene 5: Worked Example: Crude Oil Short Hedge

_Step-by-step mathematical demonstration of NYMEX short hedge payoff_

**s05b1** (mentor; facts F02)

- en: In financial risk management, two standard technical terms describe basis movements over time: Strengthening of the Basis and Weakening of the Basis.
- hi: Basis ke behavior ko describe karne ke liye finance mein do standard terms use hoti hain: Strengthening of Basis aur Weakening of Basis.
- on screen: Givens: 1M barrels, $80 spot, $79 August futures

**s05b2** (mentor; facts F02)

- en: A Strengthening of the Basis occurs when the basis increases—meaning the spot price rises faster than the futures price, or the spot price falls more slowly than the futures price. Because the net realized price for a short hedger is F one plus b two, a strengthening basis directly benefits the short hedger, resulting in a higher net realized selling price.
- hi: Strengthening of Basis ka matlab hai basis ka increase hona. Yaani spot price futures price ke comparison mein tezi se badha hai, ya kam gira hai. Ye situation Short Hedger ke liye favorable hoti hai kyunki realized price F-one plus b-two badh jata hai.
- on screen: Market shock: spot crashes to $75; calculate spot and futures cash flows

**s05b3** (mentor; facts F02)

- en: Conversely, a Weakening of the Basis occurs when the basis decreases—meaning the spot price falls faster than futures, or rises more slowly. A weakening basis benefits the long hedger by lowering the net acquisition price paid for raw materials. Understanding basis direction is essential for corporate treasurers.
- hi: Doosri taraf, Weakening of Basis ka matlab hai basis ka decrease hona. Yaani spot price futures price ke comparison mein kam badha hai ya zyada gira hai. Ye situation Long Hedger ke liye favorable hoti hai kyunki purchase cost reduce ho jati hai.
- on screen: Combined net revenue of $79M proves perfect hedge neutralization

## Scene 6: Hedging vs Speculation: The Novice Trap

_Debunking the myth that hedging exists to beat market price trends_

**s06b1** (mentor; facts F01)

- en: In Section 3.2, John Hull explores a profound academic debate in corporate finance: should non-financial corporations hedge price risks at all? Theoretical finance presents a skeptical view rooted in the Capital Asset Pricing Model, or CAPM.
- hi: Ab ek important academic debate ko samajhte hain jo corporate finance mein aksar puchi jati hai: Kya companies ko sach mein hedge karna chahiye?
- on screen: The novice trap of treating treasury as profit center

**s06b2** (mentor; facts F01, F08)

- en: Under modern portfolio theory, well-diversified shareholders have already eliminated unsystematic, company-specific risks across their investment portfolios. If corporate management spends shareholder money hedging commodity price fluctuations, they may simply be duplicating risk management that investors could execute themselves at lower cost.
- hi: Capital Asset Pricing Model ke mutabik, agar ek investor ke paas diversified equity portfolio hai, toh company-specific ya unsystematic risk portfolio level par automatically eliminate ho jata hai. Hedging karne par company brokerage fees aur transaction costs incur karti hai.
- on screen: The corporate reality of variance reduction

**s06b3** (mentor; facts F01)

- en: However, real-world corporate practice vigorously rejects pure academic theory. In reality, bankruptcy and financial distress costs are immense, debt covenants restrict cash volatility, and unpredictable earnings disrupt capital investment plans. Hedging stabilizes operating cash flows, protects corporate credit ratings, and preserves long-term shareholder value.
- hi: Lekin practical corporate reality is theory se agree nahi karti. Real world mein financial distress aur bankruptcy costs bahut high hoti hain. Agar commodity price swing hone se company cash crunch mein chali jaye, toh franchise value destroy ho sakti hai. Isliye cash flow stability direct shareholder value protect karti hai.
- on screen: Synthesis: corporate solvency over speculative greed

## Scene 7: Strengthening vs. Weakening Basis

_Comparative matrix of basis movements and party payoffs_

**s07b1** (mentor; facts F06)

- en: John Hull highlights an intense corporate psychological trap known as The Worse Outcome Dilemma. Imagine a corporate treasurer hedges crude oil at eighty dollars. If oil subsequent rallies to one hundred and twenty dollars, the physical oil is highly profitable, but the futures hedging account incurs massive, multi-million dollar cash margin calls.
- hi: Hull ek behad interesting psychological trap highlight karte hain jise The Worse Outcome Dilemma kaha jata hai. Sochiye agar ek corporate treasurer oil ko seventy-nine dollars par hedge karta hai, aur spot price ninety dollars tak surge kar jaye.
- on screen: Strengthening basis row highlighted

**s07b2** (mentor; facts F06)

- en: Corporate executives and board directors frequently fall into the trap of evaluating the futures hedge in complete isolation. Management criticizes the treasurer for 'losing forty dollars a barrel on speculative derivatives', completely ignoring that the physical business made a record profit. This internal friction often creates destructive pressure to abandon hedging programs altogether.
- hi: Physical oil par company ne profit kamaya, lekin futures account mein daily marking-to-market par million dollars ka cash margin pay karna pada. Internal meetings mein management aksar puchti hai ki derivatives mein ye loss kyun hua? Is psychological pressure ki wajah se kayi treasurers hedging chhod dete hain.
- on screen: Weakening basis row highlighted

**s07b3** (mentor; facts F06)

- en: In Business Snapshot 3.1, Hull details the classic case of North American gold mining companies, such as American Barrick. In the 1980s and 1990s, extensive forward selling and short hedging protected producers during bear markets. However, during the historic 2000s gold bull market, hedged producers severely lagged behind their unhedged peers, forcing companies to spend billions of dollars buying back their hedges at massive losses.
- hi: Business Snapshot three point one mein John C. Hull ne American Barrick ka case study quote kiya hai. 1980s aur 1990s mein Barrick Gold ne gold production ko heavily hedge karke profitable operations ensure kiye. Lekin 2000s mein jab gold bull market shuru hua, toh unhedged competitors ke stock prices tezi se bhage, aur Barrick ko heavy cost par apne hedges unwind karne pade.
- on screen: Summary matrix of directional basis sensitivity

## Scene 8: Delivery Month Selection & The Gold Miner Trap

_Contract selection rules and historical lessons from gold producer hedging_

**s08b1** (mentor; facts F07)

- en: To minimize basis risk, a hedger must make two critical strategic decisions: selecting the most suitable futures contract underlying the exposure, and choosing the optimal Delivery Month.
- hi: Basis risk ko minimize karne ke liye do critical decisions lene hote hain: Pehla, sahi underlying asset select karna; aur doosra, sahi Delivery Month choose karna.
- on screen: The golden rule of contract delivery month selection

**s08b2** (mentor; facts F07)

- en: John Hull articulates the golden rule of delivery month selection: always choose a delivery month that is as close as possible to, but strictly later than, the anticipated hedge closeout date. For example, if a company expects to sell a commodity in May, it should select the June futures contract rather than the May contract.
- hi: Delivery Month ka golden rule yaad rakhiye: Hamesha aisa futures contract choose kijiye jiska delivery month hedge closeout date ke sabse paas ho, lekin closeout date ke baad aaye.
- on screen: Liquidity hazards during the actual delivery month

**s08b3** (mentor; facts F09)

- en: Corporate hedgers strictly avoid holding positions into the contract's delivery month itself. During the delivery month, trading liquidity dries up rapidly, prices exhibit erratic fluctuations, and the risk of receiving an unexpected physical delivery notice creates severe logistical liabilities.
- hi: Hedgers kabhi bhi delivery month ke dauran trade karna pasand nahi karte. Delivery month aate hi futures prices erratic ho jate hain, liquidity drop ho sakti hai, aur unintended physical delivery notice milne ka risk rehta hai. Isliye delivery month shuru hone se pehle hi position close kar di jati hai.
- on screen: Historical case study: Gold miners bull market hedge dilemma

## Scene 9: Active Recall: Net Realized Price Calculation

_Check student mastery of basis calculation and net realized price_

**s09b1** (mentor; facts F04, F05, F10)

- en: Let us now test your practical mastery of basis risk calculations. Suppose an independent oil producer enters a Short Hedge in June by selling crude oil futures at F one equals ninety dollars per barrel. In August, when the producer sells physical oil, the spot price is S two equals eighty-five dollars per barrel, and the futures price trades at F two equals eighty-seven dollars. What is the net realized price per barrel?
- hi: Chaliye ab ek practical knowledge check ke zariye aapki understanding test karte hain. Ek crude oil producer June mein ninety dollars par Short Hedge place karta hai. August mein closeout ke samay spot price eighty-five dollars hai aur futures price eighty-seven dollars hai. Realized selling price kya hoga?
- on screen: Quiz question presented with numbers $90 futures, $85 spot, $87 closeout

**s09b2** (mentor; facts F04, F05)

- en: Pause the video and calculate carefully... The physical market yields eighty-five dollars, while the short futures position entered at ninety is closed at eighty-seven. What is the terminal basis b two, and what is the net combined price?
- hi: Screen par diye gaye chaar options ko dhyan se analyze kijiye aur formula apply kijiye. Pause and consider.
- on screen: Thinking interval and formula reminder

**s09b3** (mentor; facts F05, F10)

- en: The correct answer is Option B: eighty-eight dollars per barrel. The terminal basis b two is S two minus F two, or eighty-five minus eighty-seven, which equals negative two dollars. The net realized price for a short hedger is F one plus b two, which is ninety plus negative two, yielding eighty-eight dollars. Physically, the oil sold for eighty-five dollars, and the short futures gained three dollars, locking in eighty-eight dollars. The basis weakened by two dollars, reducing net proceeds.
- hi: Correct answer hai Option B: Eighty-eight dollars per barrel. Calculation dekhiye: b-two barabar S-two minus F-two, yaani eighty-five minus eighty-seven equals minus two dollars. Net realized price F-one plus b-two hai, yaani ninety minus two barabar eighty-eight dollars. Basis do dollars se weaken hua tha, isliye short hedger ka realized price ninety se girkar eighty-eight ho gaya.
- on screen: Reveal Option B ($88) with complete mathematical walkthrough

## Scene 10: Where We Are: Synthesis & Bridge to Part 2

_Synthesis of Part 1 and intellectual bridge to minimum variance hedge ratio_

**s10b1** (mentor; facts F01, F04)

- en: The central lesson of Part 1 is clear: in real-world corporate risk management, risk is never completely extinguished—it is transformed. Corporate hedging successfully replaces catastrophic outright price volatility with smaller, manageable Basis Risk.
- hi: Is lesson se hume ek central takeaway milta hai: Real-world financial markets mein risk kabhi complete vanish nahi hota, wo transform hota hai. Futures hedging outright price volatility ko remove karke use manageable Basis Risk mein convert kar deti hai.
- on screen: Core pedagogical synthesis: risk transformation into basis risk

**s10b2** (mentor; facts F01)

- en: However, when the asset being hedged differs from the asset underlying the futures contract—such as an airline hedging jet fuel with heating oil futures—we encounter Cross Hedging. In Part 2, we will develop the mathematical formulas for the Minimum Variance Hedge Ratio, portfolio beta hedging, and the infamous one-point-three-billion-dollar collapse of Metallgesellschaft.
- hi: Lekin jab hedged asset aur futures contract ka underlying asset identical na ho—jaise jet fuel ko heating oil futures se hedge karna—toh hume Cross Hedging aur minimum variance hedge ratio calculate karna padta hai. Is mathematical optimization ko hum Part Two mein explore karenge.
- on screen: Roadmap preview and intellectual bridge to Part 2

## Scene 11: Eight Rules to Remember

_Institutional rules codifying hedging strategies and basis mechanics_

**s11b1** (mentor; facts F01)

- en: Let us summarize the four structural pillars of corporate hedging that every quantitative finance student and risk manager must remember.
- hi: Aaiye aaj ke lesson ke chaar essential pillars ko summarize karte hain jo har finance professional ko hamesha yaad rakhne chahiye.
- on screen: Overview of the 8 rules

**s11b2** (mentor; facts F01, F02)

- en: First Pillar: Short versus Long Hedging. Producers enter short hedges to lock in selling prices for physical inventory; manufacturers enter long hedges to cap raw material acquisition costs.
- hi: Pehla pillar: Short Hedge versus Long Hedge. Producer price drop ke risk ko lock karne ke liye futures sell karta hai; manufacturer raw material price hike se bachne ke liye futures buy karta hai.
- on screen: Rules 1 and 2 highlighted

**s11b3** (mentor; facts F03, F04)

- en: Second Pillar: Nature of Basis. Basis is defined as Spot Price minus Futures Price. Hedging substitutes extreme spot price volatility with manageable basis risk.
- hi: Dusra pillar: The Nature of Basis. Basis spot aur futures price ka spread hai. Hedging price uncertainty ko basis risk se substitute karti hai.
- on screen: Rules 3 and 4 highlighted

**s11b4** (mentor; facts F05, F06)

- en: Third Pillar: Strengthening versus Weakening Basis. A strengthening basis increases net realized proceeds for a short hedger, whereas a weakening basis reduces net acquisition costs for a long hedger.
- hi: Teesra pillar: Strengthening versus Weakening. Strengthening basis short hedger ko reward karta hai, jabki weakening basis long hedger ke favor mein kaam karta hai.
- on screen: Rules 5 and 6 highlighted

**s11b5** (mentor; facts F06, F07)

- en: Fourth Pillar: The Delivery Month Rule. Hedgers must always select a futures contract maturing after the hedge closeout date to avoid delivery month illiquidity and unexpected delivery notices.
- hi: Chautha pillar: Delivery Month Rule. Contract hamesha closeout date ke baad ka select kijiye taaki delivery month ke liquidity traps aur physical notice se bacha ja sake.
- on screen: Rules 7 and 8 highlighted

**s11b6** (mentor; facts none)

- en: In Part 2, we will master the Minimum Variance Hedge Ratio, optimal contract calculation, stock index beta hedging, and Metallgesellschaft's multi-billion dollar rollover disaster.
- hi: Next part mein hum cross-hedging formulas, stock portfolio beta adjustments, aur Metallgesellschaft ke famous one point three billion dollar hedging disaster ko dissect karenge.
- on screen: Compact summary overview of all 8 rules

