# Basic Principles, Short/Long Hedges & Basis Risk

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

- en: The foundational philosophy of corporate hedging is straightforward. Hedging means entering a financial position to neutralize severe commercial price risks and reduce cash flow variance. By stabilizing revenues and raw material costs, a company can operate safely.
- hi: Hedging ka fundamental rule samajhna bahut zaroori hai. Hedging ka matlab hai price risk ko neutralize karke cash flow variance ko kam karna. Iska objective cash flows ko stabilize karna hai taaki business safely operate kar sake.
- on screen: Variance minimization as the foundational corporate philosophy

**s00b4** (mentor; facts F01, F12)

- en: In Section 3.1, John Hull establishes the two core categories of corporate hedging. The Short Hedge protects physical inventories and future production against falling market prices. In contrast, the Long Hedge locks in acquisition costs for essential raw materials.
- hi: Section 3.1 mein John C. Hull ne do core categories classify ki hain. Pehla, Short Hedge, jo inventory ko falling prices se protect karta hai. Aur doosra, Long Hedge, jo raw material acquisition costs ko lock karta hai.
- on screen: Introduction of Short Hedge and Long Hedge categories

## Scene 1: The Mechanics of Short and Long Hedges

_Contrasting physical commercial exposure with offsetting futures contracts_

**s01b1** (mentor; facts F01, F02)

- en: A Short Hedge is implemented when a commercial enterprise owns an asset or expects to produce commodities. The firm fears that market prices might decline before physical sale. To eliminate downside price risk, the company sells futures contracts.
- hi: Short Hedge tab lagaya jata hai jab company ke paas physical asset ho ya wo commodity produce karne wali ho. Selling date tak market prices girne ka darr rehta hai. Is downside risk ko hatane ke liye company futures contracts short karti hai.
- on screen: Defining the short hedger natural long exposure

**s01b2** (mentor; facts F02)

- en: Consider John Hull's classic crude oil producer example. On May 15, an independent oil producer anticipates having one million barrels ready for physical sale in mid-August. Current spot is eighty dollars, and August futures on the NYMEX exchange trade at seventy-nine dollars.
- hi: John C. Hull ka classic crude oil producer example dekhiye. May 15 ko oil company ke paas ten lakh barrels crude oil hai jise August mein sell karna hai. Current spot price eighty dollars hai, aur NYMEX exchange par August futures seventy-nine dollars par quote ho raha hai.
- on screen: Crude oil producer example initial setup

**s01b3** (mentor; facts F01, F03)

- en: Because one NYMEX crude oil contract represents exactly one thousand barrels, the producer hedges its one-million-barrel production by short selling exactly one thousand August contracts. Now, observe how this short hedge performs regardless of which direction world oil markets move over the summer.
- hi: NYMEX ka standard contract size one thousand barrels hota hai. Isliye company August ke one thousand futures contracts short, yaani sell kar deti hai. Ab dekhiye ki market chahe kisi bhi direction mein move kare, kya result nikalta hai.
- on screen: Defining the long hedger natural short exposure

**s01b4** (mentor; facts F03, F11)

- en: Suppose by August 15, global spot crude plunges to seventy-five dollars per barrel. The producer sells physical oil for seventy-five million dollars, losing five million relative to May. However, the short futures gain four dollars per barrel, or four million dollars. Combined net revenue is exactly seventy-nine million dollars, locking in seventy-nine dollars per barrel.
- hi: Agar August 15 ko spot price girkar seventy-five dollars ho jata hai, toh physical oil seventy-five million dollars mein bikega. Lekin short futures position par four million dollars ka profit hoga. Dono milakar total revenue exactly seventy-nine million dollars par lock ho jati hai.
- on screen: Copper fabricator example capping raw material costs

## Scene 2: Four Pillars of Corporate Hedging

_Architectural principles underpinning corporate derivatives usage_

**s02b1** (mentor; facts F01, F04)

- en: Conversely, a Long Hedge is deployed when a commercial manufacturer must purchase raw materials in the future. The firm fears that an unexpected market price surge might squeeze profit margins. To eliminate upside risk, the company buys futures contracts.
- hi: Doosri taraf, Long Hedge tab use hota hai jab company ko future mein raw material purchase karna ho. Use darr hota hai ki market price surge profit margins squeeze kar dega. Upside risk ko hatane ke liye company futures buy karti hai.
- on screen: Pillar 1 and 2 introduction

**s02b2** (mentor; facts F06)

- en: Analyze John Hull's copper fabricator example. On January 15, a manufacturing company wins a contract for mid-May delivery, requiring one hundred thousand pounds of copper on May 15. Spot is 340 cents, and May futures on the COMEX exchange trade at 320 cents per pound.
- hi: Hull ke copper fabricator example ko analyze kijiye. January 15 ko company ko May 15 ke liye one lakh pounds copper ki zaroorat hoti hai. Current spot price 340 cents hai, aur COMEX exchange par May futures 320 cents per pound chal raha hai.
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

- en: Are real-world corporate hedges always mathematically perfect? In commercial markets, the answer is almost never. Treasurers face Basis Risk, which means the risk that spot and futures prices diverge unexpectedly before contract closeout.
- hi: Kya real world mein corporate hedges hamesha mathematically perfect hote hain? Bilkul nahi. Treasurers ko Basis Risk face karna padta hai, यानी which means spot aur futures prices ka unexpected divergence.
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

- en: If global spot oil plunges by five dollars, does the producer lose money? Let us examine the mechanics of strengthening and weakening basis to discover the exact answer.
- hi: Agar global spot oil paanch dollar gir jaye, toh kya producer ko loss hoga? Chaliye strengthening aur weakening basis ke mathematical concepts ko detail mein samajhte hain taaki answer mil sake.
- on screen: Givens: 1M barrels, $80 spot, $79 August futures

**s05b2** (mentor; facts F02)

- en: A Strengthening of the Basis occurs when the basis increases—meaning the spot price rises faster than the futures price, or the spot price falls more slowly than the futures price. Because the net realized price for a short hedger is F one plus b two, a strengthening basis directly benefits the short hedger, resulting in a higher net realized selling price.
- hi: Strengthening of Basis ka matlab hai basis ka increase hona. Yaani spot price futures price ke comparison mein tezi se badha hai, ya kam gira hai. Ye situation Short Hedger ke liye favorable hoti hai kyunki realized price F-one plus b-two badh jata hai.
- on screen: Market shock: spot crashes to $75; calculate spot and futures cash flows

**s05b3** (mentor; facts F02)

- en: Conversely, a Weakening of the Basis occurs when the basis decreases—meaning the spot price falls faster than futures. For this oil producer, the hedge locks in exactly 79 dollars per barrel. Understanding basis direction is essential for corporate treasurers.
- hi: Doosri taraf, Weakening of Basis ka matlab hai basis ka decrease hona. Yaani spot price futures price ke comparison mein kam badha hai ya zyada gira hai. Is short hedge se oil producer ko exactly 79 dollars per barrel lock ho jate hain.
- on screen: Combined net revenue of $79M proves perfect hedge neutralization

## Scene 6: Hedging vs Speculation: The Novice Trap

_Debunking the myth that hedging exists to beat market price trends_

**s06b1** (mentor; facts F01)

- en: In Section 3.2, John Hull explores an academic debate: should non-financial corporations hedge price risks at all? Theoretical finance presents a skeptical view rooted in the Capital Asset Pricing Model, which is called CAPM.
- hi: Section 3.2 mein John Hull academic debate explore karte hain: Kya companies ko hedge karna chahiye? Theoretical finance mein CAPM yaani Capital Asset Pricing Model ka matlab hota hai diversified investors ka portfolio model.
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

- en: The correct answer is Option B: eighty-eight dollars per barrel. Terminal basis b two is eighty-five minus eighty-seven, or negative two dollars. Net realized price is initial futures ninety plus negative two, yielding eighty-eight dollars. The two-dollar basis weakening reduced net proceeds.
- hi: Correct answer hai Option B: eighty-eight dollars per barrel. Terminal basis b-two eighty-five minus eighty-seven, yaani minus two dollars hai. Net realized price ninety minus two barabar eighty-eight dollars banta hai.
- on screen: Reveal Option B ($88) with complete mathematical walkthrough

## Scene 10: Where We Are: Synthesis & Bridge to Part 2

_Synthesis of Part 1 and intellectual bridge to minimum variance hedge ratio_

**s10b1** (mentor; facts F01, F04)

- en: The central lesson of Part 1 is clear: in real-world corporate risk management, risk is never completely extinguished—it is transformed. Corporate hedging successfully replaces catastrophic outright price volatility with smaller, manageable Basis Risk.
- hi: Is lesson se hume ek central takeaway milta hai: Real-world financial markets mein risk kabhi complete vanish nahi hota, wo transform hota hai. Futures hedging outright price volatility ko remove karke use manageable Basis Risk mein convert kar deti hai.
- on screen: Core pedagogical synthesis: risk transformation into basis risk

**s10b2** (mentor; facts F01, F13)

- en: When the exposure asset differs from the futures contract asset, we encounter cross hedging. In Part 2, we will develop the Minimum Variance Hedge Ratio and analyze the 1.3 billion dollar collapse of Metallgesellschaft.
- hi: Jab exposure asset futures contract se alag ho, use cross hedging kehte hain. Part 2 mein hum Minimum Variance Hedge Ratio aur Metallgesellschaft ke 1.3 billion dollar rollover disaster ko samjhenge.
- on screen: Roadmap preview and intellectual bridge to Part 2

## Scene 11: Eight Rules to Remember

_Institutional rules codifying hedging strategies and basis mechanics_

**s11b1** (mentor; facts F01)

- en: Let us now summarize the four foundational pillars and eight structural rules of corporate hedging that every quantitative risk manager and treasury professional must remember.
- hi: Aaiye ab corporate hedging ke chaar main pillars aur aath foundational rules ko summarize karte hain jo har finance professional aur treasury risk manager ko hamesha yaad rakhne chahiye.
- on screen: Overview of the 8 rules

**s11b2** (mentor; facts F01, F02)

- en: Rule 1 dictates that producers enter short hedges to lock in selling prices for physical inventory. Rule 2 establishes that commercial manufacturers enter long hedges to cap raw material acquisition costs.
- hi: Rule 1 ke mutabik producers inventory selling prices ko lock karne ke liye short hedge karte hain. Rule 2 ke mutabik manufacturers raw material costs ko cap karne ke liye long hedge deploy karte hain.
- on screen: Rules 1 and 2 highlighted

**s11b3** (mentor; facts F03, F04)

- en: Rule 3 defines basis as spot price minus futures price. Rule 4 shows that corporate hedging substitutes extreme outright price volatility with smaller, manageable basis risk across operating cycles.
- hi: Rule 3 basis ko spot price minus futures price ke roop mein define karta hai. Rule 4 kehta hai ki hedging outright price volatility ko chote aur manageable basis risk se substitute karti hai.
- on screen: Rules 3 and 4 highlighted

**s11b4** (mentor; facts F05, F06)

- en: Rule 5 demonstrates that a strengthening basis increases net realized selling prices for short hedgers. Rule 6 shows that a weakening basis reduces net acquisition costs for long hedgers during procurement.
- hi: Rule 5 dikhata hai ki strengthening basis short hedgers ke net realized price ko badhata hai. Rule 6 batata hai ki weakening basis long hedgers ke net procurement cost ko efficiently reduce karta hai.
- on screen: Rules 5 and 6 highlighted

**s11b5** (mentor; facts F06, F07)

- en: Rule 7 establishes the golden delivery month rule, selecting contracts maturing strictly after hedge closeout. Rule 8 warns against delivery month illiquidity and unexpected delivery notices from exchange clearinghouses.
- hi: Rule 7 golden delivery month rule establish karta hai jisme contract maturity closeout ke baad hoti hai. Rule 8 delivery month ki illiquidity aur exchange clearinghouse ke physical delivery notice se protect karta hai.
- on screen: Rules 7 and 8 highlighted

**s11b6** (mentor; facts F01, F02)

- en: Remember all 8 rules when structuring hedges. In Part 2, we will master the Minimum Variance Hedge Ratio, beta hedging, and Metallgesellschaft's multi-billion dollar rollover disaster.
- hi: In sabhi 8 rules ko hamesha dhyan mein rakhiye. Part 2 mein hum Minimum Variance Hedge Ratio, beta hedging, aur Metallgesellschaft ke multi-billion dollar disaster ko master karenge.
- on screen: Compact summary overview of all 8 rules
