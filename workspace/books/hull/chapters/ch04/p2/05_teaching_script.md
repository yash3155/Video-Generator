# FRAs, Duration, Convexity & Term Structure Theories

## Scene 0: Corporate Rate Risk & Municipal Bankruptcy

_Problem-first hook: Corporate interest rate risk and the Orange County municipal bankruptcy dilemma_

**s00b1** (novice; facts F01, F08)

- en: Why do corporate treasurers panic when central banks raise interest rates, even when current cash balances look healthy? Can an unexpected rate hike wipe out years of corporate profit?
- hi: जब सेंट्रल बैंक इंटरेस्ट रेट्स बढ़ाते हैं, तो कॉर्पोरेट ट्रेजरर्स इतना परेशान क्यों होते हैं? क्या एक अचानक रेट हाइक सालों के कॉर्पोरेट प्रॉफिट को पूरी तरह खत्म कर सकता है?
- on screen: Show corporate treasurer looking at interest rate volatility chart and sudden rate hike announcement.

**s00b2** (mentor; facts F08)

- en: Consider Orange County in 1994. Treasurer Robert Citron ran a 20 billion dollar leveraged repo portfolio with securities averaging 7.4 years to payout. When the Federal Reserve raised benchmark interest rates by 300 basis points, the portfolio lost 1.6 billion dollars in months.
- hi: नाइंटीन नाइनटी फोर में ऑरेंज काउंटी का उदाहरण देखिए। ट्रेजरर रॉबर्ट सिट्रॉन ने 7.4 इयर्स के एवरेज पेआउट समय वाला 20 बिलियन डॉलर का लीवरेज्ड रेपो पोर्टफोलियो चलाया था। जब फेडरल रिजर्व ने इंटरेस्ट रेट्स को 300 बेसिस पॉइंट्स बढ़ाया, तो पोर्टफोलियो को 1.6 बिलियन डॉलर का नुकसान हुआ।
- on screen: Display Orange County 1994 bankruptcy card with $20B repo portfolio, 7.4-year payout horizon, 300 bps hike, and $1.6B loss.

**s00b3** (narrator; facts F01, F08)

- en: This catastrophic breakdown occurred because unhedged bond positions multiply rate hikes into massive capital losses. Simultaneously, corporations needing to borrow in six months face unpredictable financing costs without forward rate protection.
- hi: यह भारी नुकसान इसलिए हुआ क्योंकि अनहेज्ड बॉन्ड पोजीशन्स रेट हाइक्स को सीधे बड़े कैपिटल लॉसेस में बदल देती हैं। साथ ही, जिन कंपनियों को भविष्य में फंड्स बॉरो करने होते हैं, वे बिना फॉरवर्ड प्रोटेक्शन के अनिश्चित फाइनेंसिंग कॉस्ट्स का सामना करती हैं।
- on screen: Show unhedged bond exposure multiplying rate spikes into capital destruction alongside future borrowing rate uncertainty.

**s00b4** (mentor; facts F01, F10)

- en: To solve these twin dilemmas, institutional finance invented Forward Rate Agreements to lock future borrowing costs and bond portfolio hedging. A Forward Rate Agreement is an over-the-counter contract where counterparties lock an interest rate over a future period.
- hi: इन दोनों समस्याओं को हल करने के लिए, इंस्टीट्यूशनल फाइनेंस ने फ्यूचर बॉरोइंग कॉस्ट्स को लॉक करने के लिए फॉरवर्ड रेट एग्रीमेंट्स बनाए। फॉरवर्ड रेट एग्रीमेंट एक ऐसा ओवर-द-काउंटर कॉन्ट्रैक्ट है जहां दोनों पक्ष भविष्य की अवधि के लिए ब्याज दर तय करते हैं।
- on screen: Display Course Roadmap highlighting Chapter 4 Part 2: FRAs, Duration, Convexity, and Term Structure.

## Scene 1: Borrower Certainty vs Floating Return

_Tension: Fixed rate borrowers seeking cost certainty versus floating rate market lenders_

**s01b1** (narrator; facts F01)

- en: Every interest rate transaction contains a natural tug of war between two opposing economic forces. On one side, corporate borrowers seek guaranteed borrowing costs to fund operations without fear of rising interest rates.
- hi: हर इंटरेस्ट रेट ट्रांजैक्शन में दो विरोधी ताकतों के बीच खिंचाव होता है। एक तरफ, कॉर्पोरेट बॉरोअर्स बढ़ती ब्याज दरों के डर के बिना अपने ऑपरेशंस चलाने के लिए गारंटीड बॉरोइंग कॉस्ट्स चाहते हैं।
- on screen: Show Tug of War left side: Corporate Borrower wanting fixed borrowing cost certainty.

**s01b2** (narrator; facts F01)

- en: On the opposing side, commercial lenders demand floating market returns to protect themselves from inflation. If interest rates climb, fixed loans trap lenders in below-market yields, while falling rates penalize borrowers.
- hi: दूसरी तरफ, कमर्शियल लेंडर्स इन्फ्लेशन से बचने के लिए फ्लोटिंग मार्केट रिटर्न्स की मांग करते हैं। यदि ब्याज दरें बढ़ती हैं, तो फिक्स्ड लेंडर्स नुकसान में रहते हैं, जबकि दरें गिरने पर बॉरोअर्स को नुकसान होता है।
- on screen: Show Tug of War right side: Commercial Lender demanding floating market return.

**s01b3** (narrator; facts F01)

- en: A Forward Rate Agreement, abbreviated as FRA, reconciles this conflict cleanly. FRA means Forward Rate Agreement, which fixes a future borrowing rate on a principal amount without exchanging the principal.
- hi: एक फॉरवर्ड रेट एग्रीमेंट, जिसे संक्षेप में एफआरए कहा जाता है, इस टकराव को आसानी से हल करता है। एफआरए का अर्थ फॉरवर्ड रेट एग्रीमेंट है, जो प्रिंसिपल बदले बिना भविष्य की बॉरोइंग रेट को तय करता है।
- on screen: Highlight central synthesis: FRA contract locking future rate RK on principal L between T1 and T2.

## Scene 2: Four Pillars of Term Structure & Duration

_Roadmap: The Four Pillars of Forward Rates, Duration, Convexity, and Term Structure_

**s02b1** (narrator; facts F01, F02)

- en: Pillar 1 introduces Forward Rate Agreements, where counterparties lock future borrowing rates. Cash settlement means transferring only the net interest difference at settlement date rather than borrowing the full principal.
- hi: पिलर 1 फॉरवर्ड रेट एग्रीमेंट्स को पेश करता है, जहां दोनों पक्ष भविष्य की बॉरोइंग रेट्स लॉक करते हैं। कैश सेटलमेंट का अर्थ है पूरा प्रिंसिपल बॉरो करने के बजाय केवल नेट इंटरेस्ट अंतर ट्रांसफर करना।
- on screen: Reveal Card 1: Pillar 1 - Forward Rate Agreements & Cash Settlement.

**s02b2** (narrator; facts F04, F05)

- en: Pillar 2 establishes Macaulay duration and Modified duration. Macaulay duration is the weighted average time until bond cash flows arrive. Modified duration means duration adjusted for compounding, measuring percentage price change per yield shift.
- hi: पिलर 2 मैकॉले ड्यूरेशन और मॉडिफाइड ड्यूरेशन स्थापित करता है। मैकॉले ड्यूरेशन बॉन्ड कैश फ्लोज़ मिलने का वेटेड एवरेज समय है। मॉडिफाइड ड्यूरेशन का अर्थ है यील्ड शिफ्ट पर पर्सेंटेज प्राइस चेंज मापने के लिए कंपाउंडिंग से एडजस्टेड ड्यूरेशन।
- on screen: Reveal Card 2: Pillar 2 - Macaulay & Modified Duration.

**s02b3** (narrator; facts F06)

- en: Pillar 3 develops convexity. Convexity captures the non-linear curvature in bond prices, refining linear duration estimates when market yields experience large unexpected shifts across the cycle.
- hi: पिलर 3 कॉन्वेक्सिटी को विकसित करता है। कॉन्वेक्सिटी बॉन्ड की कीमतों में नॉन-लीनियर कर्वेचर को मापती है, जो यील्ड्स में बड़े बदलाव होने पर लीनियर ड्यूरेशन के अनुमानों को अधिक सटीक बनाती है।
- on screen: Reveal Card 3: Pillar 3 - Convexity & Curvature Adjustment.

**s02b4** (narrator; facts F07, F12)

- en: Pillar 4 analyzes two major term structure theories. Expectations Theory states that long rates equal the average of expected future short rates. Liquidity Preference Theory states that forward rates exceed expected zero rates because lenders demand risk premiums.
- hi: पिलर 4 दो प्रमुख टर्म स्ट्रक्चर थ्योरीज का विश्लेषण करता है। एक्सपेक्टेशंस थ्योरी कहती है कि लॉन्ग रेट्स भविष्य के अपेक्षित शॉर्ट रेट्स के औसत के बराबर होते हैं। लिक्विडिटी प्रेफरेंस थ्योरी कहती है कि फॉरवर्ड रेट्स अपेक्षित दरों से अधिक होते हैं क्योंकि लेंडर्स रिस्क प्रीमियम मांगते हैं।
- on screen: Reveal Card 4: Pillar 4 - Term Structure Theories & Liquidity Preference.

## Scene 3: FRA Mechanics & Settlement Formula

_Deep Dive: Forward Rate Agreement mechanics and in-advance cash settlement formula_

**s03b1** (narrator; facts F01)

- en: Let us examine how a Forward Rate Agreement operates. The contract specifies an agreed fixed rate R sub K and a notional principal L. Notional principal means the reference face amount used solely to calculate interest payments without being exchanged. The agreement covers a future borrowing window from settlement date T1 to maturity T2.
- hi: आइए देखें कि फॉरवर्ड रेट एग्रीमेंट कैसे काम करता है। कॉन्ट्रैक्ट में एक सहमत फिक्स्ड रेट आर सब के और एक नोशनल प्रिंसिपल एल तय होता है। नोशनल प्रिंसिपल का अर्थ है वह संदर्भ राशि जिसका उपयोग बिना बदले केवल ब्याज गणना के लिए किया जाता है। यह सेटलमेंट डेट टी1 से मैच्योरिटी टी2 तक वैध होता है।
- on screen: Display FRA Timeline from T0 to settlement T1 and end of borrowing period T2 with principal L.

**s03b2** (narrator; facts F01, F02)

- en: At settlement date T1, counterparties observe the prevailing market reference rate R sub M. The fixed rate payer receives the interest rate difference, scaled by principal and time, if market rates have risen above the contract rate.
- hi: सेटलमेंट डेट टी1 पर, दोनों पक्ष मौजूदा मार्केट रेफरेंस रेट आर सब एम को देखते हैं। यदि मार्केट रेट कॉन्ट्रैक्ट रेट से अधिक हो जाती है, तो फिक्स्ड रेट पेयर को इंटरेस्ट डिफरेंस का भुगतान मिलता है।
- on screen: Show rate comparison RM versus RK and undiscounted cash flow L * (RM - RK) * (T2 - T1).

**s03b3** (narrator; facts F02)

- en: Because the contract settles at time T1 instead of maturity T2, the payoff is discounted in advance. The cash transfer equals principal times rate difference times time, divided by one plus market rate times time.
- hi: चूंकि कॉन्ट्रैक्ट मैच्योरिटी टी2 के बजाय समय टी1 पर सेटल होता है, इसलिए पेऑफ को एडवांस में डिस्काउंट किया जाता है। कैश ट्रांसफर प्रिंसिपल गुना रेट डिफरेंस गुना टाइम, भागे एक प्लस मार्केट रेट गुना टाइम के बराबर होता है।
- on screen: Display FRA Payoff Formula: Payoff = L * (RM - RK) * (T2 - T1) / [1 + RM * (T2 - T1)].

## Scene 4: Worked Example: $100M FRA Payoff

_Worked Example: Step-by-step 100M dollar FRA cash settlement payoff calculation_

**s04b1** (narrator; facts F11)

- en: Let us work through a concrete numerical example from the textbook. A company enters an FRA with notional principal L of 100,000,000 dollars, agreeing to pay a fixed contract rate of 4.0%.
- hi: आइए टेक्स्टबुक से एक वास्तविक संख्यात्मक उदाहरण देखें। एक कंपनी 100,000,000 डॉलर के नोशनल प्रिंसिपल एल के साथ एक एफआरए में प्रवेश करती है, और 4.0% फिक्स्ड रेट देने पर सहमत होती है।
- on screen: Show Worked Example Inputs: Principal L = $100,000,000, Fixed Rate RK = 4.0%, Period = 0.25 years.

**s04b2** (narrator; facts F02, F11)

- en: The contract covers a three-month period of 0.25 years. At settlement date T1, the market reference rate R sub M fixes at 5.0%. The undiscounted interest difference is 100,000,000 times 0.01 times 0.25, which equals 250,000 dollars.
- hi: यह कॉन्ट्रैक्ट 0.25 इयर्स यानी तीन महीने की अवधि का है। सेटलमेंट डेट टी1 पर, मार्केट रेट आर सब एम 5.0% पर तय होती है। अनडिस्काउंटेड इंटरेस्ट अंतर 100,000,000 गुना 0.01 गुना 0.25 यानी 250,000 डॉलर बनता है।
- on screen: Display Step 1: 100,000,000 * (0.05 - 0.04) * 0.25 = $250,000 undiscounted difference.

**s04b3** (narrator; facts F02, F11)

- en: Next, we compute the in-advance discount divisor. Dividing 250,000 dollars by one plus 0.05 times 0.25, which is 1.0125, yields a final cash settlement payoff of 246,913.58 dollars to the fixed rate payer.
- hi: इसके बाद, हम डिस्काउंट डिवाइजर की गणना करते हैं। 250,000 डॉलर को एक प्लस 0.05 गुना 0.25 यानी 1.0125 से विभाजित करने पर, फिक्स्ड रेट पेयर को 246,913.58 डॉलर का फाइनल कैश पेऑफ मिलता है।
- on screen: Display Step 2 & Result: 250,000 / 1.0125 = $246,913.58 net cash settlement payoff.

## Scene 5: Macaulay Duration & Cash Flow Timing

_Deep Dive: Macaulay duration as the weighted average maturity of cash flows_

**s05b1** (narrator; facts F04)

- en: Now we transition from single borrowing contracts to whole bond portfolios. A bond promises a stream of coupon payments before returning its face value at maturity. But when do those cash flows actually arrive?
- hi: अब हम सिंगल बॉरोइंग कॉन्ट्रैक्ट्स से पूरे बॉन्ड पोर्टफोलियो की ओर बढ़ते हैं। एक बॉन्ड मैच्योरिटी पर फेस वैल्यू लौटाने से पहले कूपन पेमेंट्स की एक श्रृंखला देता है। लेकिन वे कैश फ्लोज़ वास्तव में कब प्राप्त होते हैं?
- on screen: Show Bond Cash Flow Stream over time with coupon bars and principal redemption.

**s05b2** (narrator; facts F04)

- en: Macaulay duration, denoted D, answers this question. It calculates the weighted average maturity of all bond cash flows, weighting each payment time by the present value of that cash flow divided by the bond price.
- hi: मैकॉले ड्यूरेशन, जिसे डी से दर्शाया जाता है, इस सवाल का उत्तर देता है। यह बॉन्ड के सभी कैश फ्लोज़ की वेटेड एवरेज मैच्योरिटी की गणना करता है, जहां प्रत्येक समय को उसके प्रेजेंट वैल्यू वेट से गुणा किया जाता है।
- on screen: Display Macaulay Duration Formula: D = sum(ti * ci * exp(-y * ti)) / B.

**s05b3** (narrator; facts F04)

- en: Picture a physical seesaw with cash payments placed at their payment dates. Macaulay duration represents the exact balance point or fulcrum where the weighted cash flow bricks balance out evenly.
- hi: एक सीसॉ की कल्पना करें जिस पर भुगतान की तारीखों पर कैश पेमेंट्स रखे हैं। मैकॉले ड्यूरेशन वह सटीक संतुलन बिंदु यानी फलक्रम है जहाँ सभी वेटेड कैश फ्लोज़ पूरी तरह संतुलित होते हैं।
- on screen: Display Seesaw Analogy: Cash flow bricks along time axis balanced at fulcrum D.

## Scene 6: Modified Duration & Price Sensitivity

_Deep Dive & Worked Example: Modified duration price sensitivity and 50 bps yield hike calculation_

**s06b1** (narrator; facts F05)

- en: To connect duration directly to bond price movements, we divide Macaulay duration by one plus yield over compounding frequency. This produces modified duration, denoted D star, measuring percentage price change per unit yield shift.
- hi: ड्यूरेशन को सीधे बॉन्ड प्राइस मूवमेंट्स से जोड़ने के लिए, हम मैकॉले ड्यूरेशन को वन प्लस यील्ड से विभाजित करते हैं। इससे मॉडिफाइड ड्यूरेशन डी स्टार प्राप्त होता है, जो यील्ड बदलाव पर पर्सेंटेज प्राइस चेंज मापता है।
- on screen: Display Modified Duration Formula: Delta B / B ≈ -D* * Delta y.

**s06b2** (narrator; facts F05, F09)

- en: Consider our prediction question. A bond portfolio has a modified duration of 5.0 years. If market interest rates rise by 50 basis points, or 0.005, what is the estimated percentage change in the bond price?
- hi: हमारे प्रेडिक्शन प्रश्न पर विचार करें। एक बॉन्ड पोर्टफोलियो का मॉडिफाइड ड्यूरेशन 5.0 इयर्स है। यदि बाजार की ब्याज दरें 50 बेसिस पॉइंट्स यानी 0.005 बढ़ जाती हैं, तो बॉन्ड की कीमत में कितने प्रतिशत का बदलाव होगा?
- on screen: Display Prediction Question: D* = 5.0 years, Delta y = +50 bps (+0.005). Predict Delta B / B.

**s06b3** (narrator; facts F05, F09)

- en: Applying our linear formula, Delta B over B equals minus D star times Delta y. Multiplying minus 5.0 by 0.005 gives exactly minus 0.025, or a 2.50% drop in bond price.
- hi: फॉर्मूले के अनुसार, डेल्टा बी बटा बी बराबर माइनस डी स्टार गुना डेल्टा वाई होता है। माइनस 5.0 को 0.005 से गुणा करने पर ठीक माइनस 0.025 मिलता है, यानी बॉन्ड की कीमत में 2.50% की गिरावट होती है।
- on screen: Display Calculation: Delta B / B = -5.0 * 0.005 = -0.025 (-2.50% price decline).

## Scene 7: Orange County Collapse & Futures Hedging

_Case Study & Hedging: Orange County 1.6B dollar loss and duration-based futures hedging formula_

**s07b1** (narrator; facts F08)

- en: Recall Orange County in 1994. Holding 20 billion dollars in leveraged repo positions with an effective duration of 7.4 years exposed the municipality to staggering interest rate risk.
- hi: नाइंटीन नाइनटी फोर में ऑरेंज काउंटी को याद करें। 7.4 इयर्स के ड्यूरेशन के साथ लीवरेज्ड रेपो में 20 बिलियन डॉलर रखने से वे अत्यधिक इंटरेस्ट रेट रिस्क के संपर्क में आ गए थे।
- on screen: Show Orange County Causal Chain Step 1: Condition - Leveraged $20B repo portfolio with 7.4y duration.

**s07b2** (narrator; facts F08, F05)

- en: When the Federal Reserve raised benchmark interest rates by 300 basis points, that 7.4 year duration inflicted massive capital losses, resulting in a 1.6 billion dollar disaster and municipal bankruptcy.
- hi: जब फेडरल रिजर्व ने दरों को 300 बेसिस पॉइंट्स बढ़ाया, तो 7.4 वर्ष के ड्यूरेशन ने भारी नुकसान पहुंचाया, जिससे 1.6 बिलियन डॉलर का नुकसान हुआ और म्यूनिसिपल बैंकरप्सी हो गई।
- on screen: Show Causal Chain Steps 2-5: 300 bps hike -> Duration multiplier -> $1.6B loss -> Bankruptcy.

**s07b3** (narrator; facts F10)

- en: To hedge such portfolios, managers use duration hedging with interest rate futures. Duration hedging means matching portfolio duration against futures contracts to neutralize interest rate risk. The optimal number of contracts N star equals portfolio value P times portfolio duration D sub P, divided by futures price F sub C times futures duration D sub F.
- hi: ऐसे पोर्टफोलियो को हेज करने के लिए मैनेजर्स ड्यूरेशन हेजिंग का उपयोग करते हैं। ड्यूरेशन हेजिंग का अर्थ है इंटरेस्ट रेट रिस्क को समाप्त करने के लिए फ्यूचर्स कॉन्ट्रैक्ट्स से पोर्टफोलियो ड्यूरेशन का मिलान करना। कॉन्ट्रैक्ट्स की संख्या एन स्टार बराबर पी गुना डीपी, भागे एफसी गुना डीएफ होती है।
- on screen: Display Duration Hedging Formula: N* = (P * DP) / (FC * DF).

## Scene 8: Convexity Curvature & Term Structure

_Deep Dive: Convexity curvature adjustment and Liquidity Preference vs Expectations Theory_

**s08b1** (narrator; facts F06)

- en: Modified duration provides only a first-order linear approximation. For large interest rate shifts, bond prices follow a curved line. Convexity C measures this second-order curvature, adding a positive adjustment of half C times Delta y squared.
- hi: मॉडिफाइड ड्यूरेशन केवल एक लीनियर अनुमान प्रदान करता है। बड़े इंटरेस्ट रेट बदलावों के लिए, बॉन्ड की कीमतें एक कर्व का पालन करती हैं। कॉन्वेक्सिटी सी इस कर्वेचर को मापती है और आधा सी गुना डेल्टा वाई स्क्वेयर्ड का पॉजिटिव एडजस्टमेंट जोड़ती है।
- on screen: Display Convexity Adjustment Formula: Delta B / B ≈ -D* * Delta y + 0.5 * C * (Delta y)^2.

**s08b2** (narrator; facts F03)

- en: Prior to maturity, an existing FRA is valued by discounting the forward rate gap: principal times forward rate minus contract rate times time, multiplied by the zero discount factor exponential minus R2 times T2.
- hi: मैच्योरिटी से पहले, मौजूदा एफआरए का मूल्यांकन फॉरवर्ड रेट गैप को डिस्काउंट करके किया जाता है: प्रिंसिपल गुना फॉरवर्ड रेट माइनस कॉन्ट्रैक्ट रेट गुना टाइम, गुना जीरो डिस्काउंट फैक्टर ई की पावर माइनस आर टू गुना टी टू।
- on screen: Display FRA Valuation Formula: V_FRA = L * (RF - RK) * (T2 - T1) * exp(-R2 * T2).

**s08b3** (narrator; facts F07, F12)

- en: Finally, why do zero curves slope upward? Expectations Theory claims long rates equal expected future spot rates. But Liquidity Preference Theory proves forward rates exceed expected spot rates because lenders demand positive risk premiums for long maturities.
- hi: अंत में, जीरो कर्व ऊपर की ओर क्यों झुकता है? एक्सपेक्टेशंस थ्योरी का दावा है कि लॉन्ग रेट्स भविष्य के अपेक्षित स्पॉट रेट्स के बराबर होते हैं। लेकिन लिक्विडिटी प्रेफरेंस थ्योरी साबित करती है कि फॉरवर्ड रेट्स अपेक्षित दरों से अधिक होते हैं क्योंकि लेंडर्स लिक्विडिटी प्रीमियम मांगते हैं।
- on screen: Compare Curves: Expectations Theory flat forward expectation vs Liquidity Preference upward slope with term premium.

## Scene 9: Interactive Knowledge Assessment

_Independent Application: Interactive quiz testing modified duration bond price drop_

**s09b1** (narrator; facts F05, F09)

- en: A fixed income manager holds a bond portfolio with a modified duration of 5.0 years. If market interest rates rise unexpectedly by 50 basis points, what is the estimated percentage change in the portfolio price?
- hi: एक फिक्स्ड इनकम मैनेजर 5.0 इयर्स के मॉडिफाइड ड्यूरेशन वाला बॉन्ड पोर्टफोलियो रखता है। यदि बाजार की ब्याज दरें अप्रत्याशित रूप से 50 बेसिस पॉइंट्स बढ़ जाती हैं, तो पोर्टफोलियो की कीमत में अनुमानित प्रतिशत परिवर्तन क्या होगा?
- on screen: Display Quiz Question and 4 Options in 2x2 grid.

**s09b2** (narrator; facts F05, F09)

- en: Pause the video and compute the estimated percentage price move using the modified duration formula. Commit to your choice among the four options before we reveal the complete institutional solution.
- hi: वीडियो को रोकें और मॉडिफाइड ड्यूरेशन फॉर्मूले का उपयोग करके अनुमानित पर्सेंटेज प्राइस मूव की गणना करें। पूरा समाधान देखने से पहले चार विकल्पों में से अपना उत्तर चुनें।
- on screen: Display Thinking Pause: Timer and spinner active with all 4 options visible.

**s09b3** (narrator; facts F05, F09)

- en: The correct answer is Option A, a price decline of 2.50%. Multiplying minus 5.0 by 0.005 yields minus 2.50%. Confusing rate hikes with price increases or ignoring duration leads novices to incorrect estimates.
- hi: सही उत्तर विकल्प ए है, कीमत में 2.50% की गिरावट। माइनस 5.0 को 0.005 से गुणा करने पर माइनस 2.50% प्राप्त होता है। रेट हाइक को प्राइस गेन समझना नौसिखियों की आम गलती है।
- on screen: Highlight Option A with green check badge; fade wrong options to 45% opacity; show explanation banner.

## Scene 10: Mastery, Curvature & Course Horizon

_Wisdom & Bridge: Non-linear curvature risk, immunization discipline, and course roadmap_

**s10b1** (mentor; facts F10)

- en: Professional fixed income managers never rely on single-point interest rate forecasts. They recognize that duration immunization must be continuously rebalanced as interest rates and bond cash flow timings evolve over time.
- hi: पेशेवर फिक्स्ड इनकम मैनेजर्स कभी भी सिंगल-पॉइंट रेट पूर्वानुमानों पर भरोसा नहीं करते हैं। वे जानते हैं कि समय के साथ ब्याज दरों और कैश फ्लो टाइमिंग बदलने पर ड्यूरेशन इम्यूनाइजेशन को लगातार रीबैलेंस करना पड़ता है।
- on screen: Display Mentor Wisdom Panel: Continuous duration rebalancing and immunization discipline.

**s10b2** (mentor; facts F05, F06)

- en: A common novice trap is assuming modified duration works perfectly for any yield shift. In reality, large rate shocks trigger significant convexity curvature, protecting bondholders during rate drops and cushioning them during rate hikes.
- hi: नौसिखियों का एक आम भ्रम यह मानना है कि मॉडिफाइड ड्यूरेशन हर यील्ड शिफ्ट के लिए सटीक काम करता है। वास्तव में, बड़े बदलाव महत्वपूर्ण कॉन्वेक्सिटी कर्वेचर लाते हैं, जो बॉन्डहोल्डर्स को सुरक्षा प्रदान करता है।
- on screen: Display Misconception Split: Common Novice Trap vs Professional Reality on convexity curvature.

**s10b3** (mentor; facts F01, F04, F10)

- en: Looking at our course roadmap, we have mastered forward rate agreements, duration, and convexity. Next, in Chapter 5, we derive Forward and Futures Prices using no-arbitrage replication and cost of carry.
- hi: हमारे कोर्स रोडमैप पर, हमने फॉरवर्ड रेट एग्रीमेंट्स, ड्यूरेशन और कॉन्वेक्सिटी में महारत हासिल कर ली है। इसके बाद, चैप्टर 5 में हम नो-आर्बिट्राज रेप्लिकेशन और कॉस्ट ऑफ कैरी से फॉरवर्ड एंड फ्यूचर्स प्राइसेस का अध्ययन करेंगे।
- on screen: Display Course Roadmap: ch04/p2 complete -> Chapter 5 Forward and Futures Prices preview.

## Scene 11: Summary of Eight Core Principles

_Summary Thread: Eight fundamental rules of forward rate agreements, duration, and convexity_

**s11b1** (narrator; facts F01, F04)

- en: Welcome to the summary thread. We consolidate the eight fundamental rules governing forward rate agreements, portfolio duration, and convexity curvature across modern fixed income management.
- hi: समरी थ्रेड में आपका स्वागत है। हम मॉडर्न फिक्स्ड इनकम मैनेजमेंट में फॉरवर्ड रेट एग्रीमेंट्स, पोर्टफोलियो ड्यूरेशन और कॉन्वेक्सिटी कर्वेचर के आठ मौलिक नियमों को समेकित करते हैं।
- on screen: Display Summary Thread Roadmap view [0, 0] introducing the 8 Core Rules.

**s11b2** (narrator; facts F01, F02)

- en: Rule 1 states that a Forward Rate Agreement locks borrowing rates on future principal. Rule 2 dictates that cash settlement occurs at settlement date T1, discounting interest savings in advance.
- hi: रूल 1 कहता है कि एक एफआरए भविष्य के प्रिंसिपल पर बॉरोइंग रेट्स लॉक करता है। रूल 2 यह निर्देशित करता है कि कैश सेटलमेंट सेटलमेंट डेट टी1 पर होता है, जो इंटरेस्ट सेविंग्स को एडवांस में डिस्काउंट करता है।
- on screen: Display Rule 1 and Rule 2 cards side by side [1, 2].

**s11b3** (narrator; facts F04, F05)

- en: Rule 3 defines Macaulay duration as the weighted average maturity of cash flows. Rule 4 shows that modified duration scales fractional price change against interest rate yield shocks.
- hi: रूल 3 मैकॉले ड्यूरेशन को कैश फ्लोज़ की वेटेड एवरेज मैच्योरिटी के रूप में परिभाषित करता है। रूल 4 दिखाता है कि मॉडिफाइड ड्यूरेशन यील्ड शॉक्स के विरुद्ध आंशिक मूल्य परिवर्तन को मापता है।
- on screen: Display Rule 3 and Rule 4 cards side by side [3, 4].

**s11b4** (narrator; facts F09, F06)

- en: Rule 5 demonstrates that a 50 basis point hike on 5.0 year duration causes a 2.50% drop. Rule 6 establishes that positive convexity cushions price declines during large interest rate increases.
- hi: रूल 5 दर्शाता है कि 5.0 वर्ष के ड्यूरेशन पर 50 बेसिस पॉइंट्स की वृद्धि से 2.50% की गिरावट होती है। रूल 6 स्थापित करता है कि पॉजिटिव कॉन्वेक्सिटी बड़ी ब्याज दर वृद्धि के दौरान प्राइस गिरावट को कम करती है।
- on screen: Display Rule 5 and Rule 6 cards side by side [5, 6].

**s11b5** (narrator; facts F10, F07)

- en: Rule 7 provides the futures hedging formula N star to immunize portfolio duration. Rule 8 shows that Liquidity Preference Theory creates upward-sloping curves because lenders demand liquidity premiums.
- hi: रूल 7 पोर्टफोलियो ड्यूरेशन को इम्यूनाइज करने के लिए फ्यूचर्स हेजिंग फॉर्मूला एन स्टार प्रदान करता है। रूल 8 दिखाता है कि लिक्विडिटी प्रेफरेंस थ्योरी ऊपर की ओर झुकते कर्व बनाती है क्योंकि लेंडर्स लिक्विडिटी प्रीमियम मांगते हैं।
- on screen: Display Rule 7 and Rule 8 cards side by side [7, 8].

**s11b6** (narrator; facts F01, F04, F05, F06, F07, F08, F09, F10)

- en: Review all eight rules in your practice. Mastering forward rates, duration immunization, and convexity curvature equips you to manage interest rate risk with institutional precision.
- hi: अपने अभ्यास में इन सभी आठ नियमों की समीक्षा करें। फॉरवर्ड रेट्स, ड्यूरेशन इम्यूनाइजेशन और कॉन्वेक्सिटी में महारत आपको संस्थागत सटीकता के साथ इंटरेस्ट रेट रिस्क मैनेज करने में सक्षम बनाती है।
- on screen: Display All 8 Rules in compact two-column overview [1, 8].
