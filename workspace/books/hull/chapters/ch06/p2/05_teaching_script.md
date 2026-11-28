# Chapter 6 Part 2

## Scene 0: Short-Rate Futures: Eurodollar, SOFR & Duration

_Problem-first hook transitioning from Treasury delivery to short-rate hedging and duration_

**s00b1** (novice; facts F01, F04)

- en: How do global banks hedge billions in short-term interest rates, and why do futures rates diverge from forward rates?
- hi: वैश्विक बैंक शॉर्ट-टर्म ब्याज दरों के अरबों डॉलर के जोखिम को कैसे हेज करते हैं, और फ्यूचर्स व फॉरवर्ड दरें अलग क्यों होती हैं?
- on screen: Novice raises short-rate hedging and rate gap question

**s00b2** (mentor; facts F01)

- en: Eurodollar futures mean 3-month $1,000,000 dollar rate futures quoted cleanly via 100 minus R, and SOFR, which stands for Secured Overnight Financing Rate, powers modern 3-month contracts.
- hi: यूरोडॉलर फ्यूचर्स का अर्थ है $1,000,000 के तीन-माह ब्याज दर कॉन्ट्रैक्ट, और एसओएफआर यानी सिक्योर्ड ओवरनाइट फाइनेंसिंग रेट आज का आधुनिक मानक है।
- on screen: Define Eurodollar futures and expand SOFR acronym

**s00b3** (mentor; facts F04)

- en: At long maturities, daily clearinghouse settlement lifts futures rates slightly above custom forward rates unless desks subtract a clean volatility correction.
- hi: लंबी अवधि पर दैनिक क्लियरिंगहाउस सेटलमेंट फ्यूचर्स दरों को फॉरवर्ड दरों से थोड़ा ऊपर ले जाता है, जिसे सुधारना जरूरी होता है।
- on screen: Preview daily settlement futures-forward bias

**s00b4** (mentor; facts F01, F02, F03)

- en: In Part 2, we learn 100 minus R quoting, the futures-to-forward adjustment, zero-curve extension, and bond duration hedging.
- hi: पार्ट 2 में हम 100 माइनस आर कोटिंग, फ्यूचर्स-टू-फॉरवर्ड एडजस्टमेंट, जीरो-कर्व विस्तार और बॉन्ड ड्यूरेशन हेजिंग सीखेंगे।
- on screen: Preview Part 2 roadmap topics cleanly

## Scene 1: Index Quoting Mechanics & The $25 Tick

_Teach 100 - R price quotation and $25 value per basis point per contract_

**s01b1** (mentor; facts F01, F10)

- en: Each Eurodollar or SOFR contract covers a 3-month rate on $1,000,000 notional, quoted via 100 minus R so a 95.00 quote means 5.00% interest.
- hi: प्रत्येक यूरोडॉलर या एसओएफआर कॉन्ट्रैक्ट $1,000,000 मूलधन पर 3-माह की दर कवर करता है, जहां 95.00 का कोट 5.00% ब्याज दर्शाता है।
- on screen: Present $1,000,000 contract size and 95.00 = 5.00% example

**s01b2** (mentor; facts F01)

- en: Because price equals 100 minus R, quotes move inversely to yields: rising interest rates push the futures index down and benefit short sellers.
- hi: क्योंकि कोट 100 माइनस आर है, कीमतें ब्याज के विपरीत चलती हैं: बढ़ती दरें फ्यूचर्स कोट को नीचे धकेलती हैं और शॉर्ट्स को लाभ देती हैं।
- on screen: Highlight inverse price-rate relationship

**s01b3** (mentor; facts F01)

- en: Every 0.01% basis point rate change alters one $1,000,000 contract value by $25 per contract, matching 90 over 360 notional interest.
- hi: हर एक 0.01% बेसिस पॉइंट दर बदलाव $1,000,000 कॉन्ट्रैक्ट मूल्य में $25 प्रति कॉन्ट्रैक्ट का अंतर लाता है।
- on screen: Highlight exact $25 tick calculation

## Scene 2: Why Futures Rates Exceed Forward Rates

_Misconception split showing how daily variation margin reinvestment splits futures from forwards_

**s02b1** (mentor; facts F04)

- en: A classic novice trap assumes 3-month futures interest rates match forward rates identically at every horizon out to 10 years.
- hi: नौसिखियों का एक आम भ्रम यह मानना है कि 10 वर्ष तक की अवधि में 3-माह की फ्यूचर्स दरें और फॉरवर्ड दरें हमेशा बिल्कुल बराबर होती हैं।
- on screen: Present parity misconception on left panel

**s02b2** (mentor; facts F04)

- en: Futures involve variation margin, which means daily cash profit or loss settled every evening. When interest rates climb, short futures collect cash immediately and reinvest at higher rates.
- hi: फ्यूचर्स में वेरिएशन मार्जिन होता है, जिसका अर्थ है कीमत बदलने पर प्रतिदिन होने वाला नकद लाभ-हानि सेटलमेंट। दरें बढ़ने पर मिली नकदी ऊंचे ब्याज पर दोबारा निवेश होती है।
- on screen: Define variation margin and favorable reinvestment

**s02b3** (mentor; facts F04)

- en: That asymmetric reinvestment perk attracts borrowers to short futures at higher implied yields, forcing futures rates above unbiased forward rates.
- hi: दैनिक पुनर्निवेश का यह लाभ फ्यूचर्स दरों को वास्तविक फॉरवर्ड दरों से व्यवस्थित रूप से थोड़ा ऊपर ले जाता है।
- on screen: Reveal verdict explaining upward bias

## Scene 3: The Convexity Adjustment Formula

_Deconstruct ForwardRate = FuturesRate - 0.5 * sigma^2 * T1 * T2_

**s03b1** (mentor; facts F02)

- en: Quant desks apply the Convexity Adjustment, which means subtracting a rate variance daily margin reinvestment correction over multi-year horizons.
- hi: क्वांट डेस्क कॉन्वेक्सिटी एडजस्टमेंट लागू करते हैं, जिसका अर्थ है बहु-वर्षीय अवधि में दैनिक मार्जिन पुनर्निवेश सुधार घटाकर सही फॉरवर्ड दर पाना।
- on screen: Define Convexity Adjustment formula cleanly

**s03b2** (mentor; facts F02)

- en: The deduction equals half sigma squared times T1 times T2, where rate volatility sigma drives variation margin swings squared.
- hi: यह कटौती आधा सिग्मा स्क्वायर गुणा टी1 टी2 होती है, जहां ब्याज दर अस्थिरता सिग्मा दैनिक मार्जिन लाभ को बढ़ाती है।
- on screen: Highlight sigma squared margin sensitivity

**s03b3** (mentor; facts F02)

- en: Because horizon factor T1 times T2 scales quadratically, the adjustment stays tiny inside 1 year but becomes substantial over 5 to 10 years.
- hi: चूंकि अवधि गुणनफल टी1 गुणा टी2 तेजी से बढ़ता है, यह सुधार 1 वर्ष में नगण्य पर 5 से 10 वर्षों में बेहद महत्वपूर्ण हो जाता है।
- on screen: Highlight multi-year T1 * T2 quadratic growth

## Scene 4: Extending the Zero Curve Beyond 2 Years

_Causal chain stripping adjusted Eurodollar and SOFR futures into zero curves_

**s04b1** (mentor; facts F01, F09)

- en: With short-term Treasury bills sparse past 1 year, desks rely on liquid 5 to 10 year rate futures quoted via 100 minus R.
- hi: 1 वर्ष के बाद कम ट्रेजरी बिल्स होने के कारण, डेस्क 5 से 10 वर्ष तक 100 माइनस आर पर कोट होने वाले रेट फ्यूचर्स का उपयोग करते हैं।
- on screen: Show liquid 5-10 year futures quotes as condition

**s04b2** (mentor; facts F02, F09)

- en: Next, analysts convert quotes to continuous compounding and subtract the Convexity Adjustment before plugging rates into zero-curve bootstrapping.
- hi: इसके बाद विश्लेषक कोट्स को सतत कम्पाउंडिंग में बदलकर कॉन्वेक्सिटी एडजस्टमेंट घटाते हैं और जीरो-कर्व बूटस्ट्रैपिंग करते हैं।
- on screen: Highlight convexity subtraction step in pipeline

**s04b3** (mentor; facts F09)

- en: Linking each unbiased forward rate sequentially builds a smooth 5 to 10 year continuous zero discount curve for institutional pricing.
- hi: हर शुद्ध फॉरवर्ड दर को क्रमिक रूप से जोड़ने पर संस्थागत वैल्यूएशन के लिए 5 से 10 वर्ष का सटीक जीरो डिस्काउंट कर्व तैयार हो जाता है।
- on screen: Complete continuous zero curve construction flow

## Scene 5: The Duration-Based Hedge Ratio N*

_Deconstruct N* = (P * DP) / (FC * DF) matching portfolio dollar duration_

**s05b1** (mentor; facts F03)

- en: To protect a bond portfolio against yield spikes, managers compute dollar duration, which means market price multiplied by duration to measure interest sensitivity.
- hi: बॉन्ड पोर्टफोलियो को ब्याज उछाल से बचाने के लिए मैनेजर डॉलर ड्यूरेशन निकालते हैं, जिसका अर्थ है बाजार मूल्य गुणा ड्यूरेशन से संवेदनशीलता मापना।
- on screen: Define dollar duration on numerator P * DP

**s05b2** (mentor; facts F03)

- en: Optimal futures contracts N star divide total portfolio dollar duration by one futures contract value times its cheapest-to-deliver, or CTD, bond duration.
- hi: सर्वोत्तम फ्यूचर्स कॉन्ट्रैक्ट्स एन स्टार निकालने के लिए कुल पोर्टफोलियो डॉलर ड्यूरेशन को एक कॉन्ट्रैक्ट मूल्य व चीपेस्ट-टू-डिलीवर यानी सीटीडी ड्यूरेशन के गुणनफल से बांटते हैं।
- on screen: Contrast portfolio vs CTD contract dollar duration

**s05b3** (mentor; facts F03)

- en: If yields jump evenly, gains on short futures contracts offset portfolio bond losses nearly dollar for dollar.
- hi: यदि ब्याज दरें एक साथ ऊपर जाती हैं, तो शॉर्ट फ्यूचर्स से होने वाला मुनाफा पोर्टफोलियो के बॉन्ड नुकसान की लगभग पूरी भरपाई कर देता है।
- on screen: Summarize duration neutralization across N* contracts

## Scene 6: Worked Example: Hedging a $10M Bond Portfolio

_Solve Hull's $10,000,000 corporate bond duration hedge requiring short 79 contracts_

**s06b1** (mentor; facts F03, F05)

- en: Follow John Hull's classic case: a $10,000,000 bond portfolio has duration 6.80 years, while Treasury futures trade at $93,187.50 with CTD duration 9.20 years.
- hi: जॉन हल का प्रसिद्ध उदाहरण देखें: $10,000,000 बॉन्ड पोर्टफोलियो का ड्यूरेशन 6.80 वर्ष है, और फ्यूचर्स कीमत $93,187.50 तथा सीटीडी ड्यूरेशन 9.20 वर्ष है।
- on screen: Present Hull inputs $10M, 6.80y, $93,187.50, 9.20y

**s06b2** (mentor; facts F03, F05)

- en: Portfolio dollar duration equals $68,000,000. Before finishing, predict: why does our 6.80-year portfolio divide by CTD duration 9.20 years inside N*?
- hi: पोर्टफोलियो डॉलर ड्यूरेशन $68,000,000 आता है। पूरा करने से पहले अनुमान लगाएं: हम 6.80 वर्ष वाले पोर्टफोलियो को 9.20 वर्ष के सीटीडी ड्यूरेशन से क्यों बांटते हैं?
- on screen: Prediction prompt on CTD duration scaling

**s06b3** (mentor; facts F03, F05)

- en: Because the 9.20-year CTD bond moves more per dollar than our 6.80-year portfolio. Dividing $68,000,000 by $857,325 gives 79.32, so short 79 contracts.
- hi: क्योंकि 9.20 वर्ष वाला सीटीडी बॉन्ड प्रति डॉलर ज्यादा संवेदनशील है। $68,000,000 को $857,325 से बांटने पर 79.32 आता है, यानी 79 कॉन्ट्रैक्ट शॉर्ट करें।
- on screen: Reveal final hedge ratio 79.32 -> short 79 contracts

## Scene 7: Bank ALM & The Balance Sheet Duration Gap

_Illustrate Asset-Liability Management immunization using interest rate futures_

**s07b1** (mentor; facts F06)

- en: Commercial banks rely on Asset-Liability Management, called ALM, which means matching the duration of long fixed loans against short-term deposits.
- hi: वाणिज्यिक बैंक एसेट-लायबिलिटी मैनेजमेंट यानी एएलएम का उपयोग करते हैं, जिसका अर्थ है लंबी अवधि के ऋणों और कम अवधि की जमाओं के ड्यूरेशन का मिलान करना।
- on screen: Define Asset-Liability Management and loan vs deposit durations

**s07b2** (mentor; facts F06)

- en: Because long-dated mortgages outlast checking deposits, banks carry a wide duration gap that hurts net equity whenever rates climb sharply.
- hi: चूंकि लंबी अवधि के लोन जमाओं से अधिक समय के होते हैं, इसलिए दरों में उछाल आने पर ड्यूरेशन गैप बैंक की इक्विटी को नुकसान पहुंचाता है।
- on screen: Highlight balance-sheet duration gap exposure

**s07b3** (mentor; facts F06)

- en: Instead of turning away depositors, banks short Treasury or SOFR futures directly to bring balance-sheet duration gap smoothly to zero.
- hi: ग्राहक जमा रोकने के बजाय, बैंक सीधे ट्रेजरी या एसओएफआर फ्यूचर्स शॉर्ट करके इस ड्यूरेशन गैप को शून्य पर ले आते हैं।
- on screen: Show futures closing duration gap to zero

## Scene 8: Duration Hedge Imperfections & Real Curves

_Contrast ideal parallel shifts against real curve steepening, credit spreads, and CTD shifts_

**s08b1** (mentor; facts F07)

- en: Every basic duration hedge assumes a parallel shift, which means every yield along the curve moves by the exact same basis points.
- hi: हर बुनियादी ड्यूरेशन हेज पैरेलल शिफ्ट मानता है, जिसका अर्थ है कर्व की हर अवधि की ब्याज दर में बिल्कुल एक जैसा बदलाव होना।
- on screen: Define parallel shift assumption cleanly

**s08b2** (mentor; facts F07)

- en: In real crises, yield curves steepen or invert non-parallelly, corporate credit spreads widen independently, and CTD bonds switch abruptly.
- hi: असली संकट में यील्ड कर्व असमान रूप से मुड़ते हैं, कॉर्पोरेट क्रेडिट स्प्रेड अलग से बढ़ते हैं और सीटीडी बॉन्ड अचानक बदल जाते हैं।
- on screen: Highlight curve twist, credit spread, and CTD switching

**s08b3** (mentor; facts F07)

- en: Because curve twists, credit spreads, and CTD switching shift risk regimes, active rebalancing is required continuously.
- hi: क्योंकि कर्व बदलाव, क्रेडिट स्प्रेड और सीटीडी स्विचिंग जोखिम बदलते हैं, इसलिए लगातार सक्रिय रीबैलेंसिंग आवश्यक होती है।
- on screen: Reveal continuous rebalancing resolution

## Scene 9: Active Recall: Sizing a $50M Portfolio Hedge

_3-beat quiz sizing N* for $50M portfolio (5.0y duration) vs $100,000 contract (8.0y CTD)_

**s09b1** (mentor; facts F03, F08)

- en: Size a hedge yourself. Portfolio value is $50,000,000 with 5.0 years duration. Futures trade at $100,000 with 8.0 years CTD duration. Find N star.
- hi: स्वयं हेज अनुपात निकालें। पोर्टफोलियो मूल्य $50,000,000 और ड्यूरेशन 5.0 वर्ष है। फ्यूचर्स कीमत $100,000 और सीटीडी ड्यूरेशन 8.0 वर्ष है। एन स्टार ज्ञात करें।
- on screen: Present $50M quiz inputs

**s09b2** (mentor; facts F03, F08)

- en: Pause and calculate first: multiply portfolio value by 5.0, divide by $100,000 times 8.0, then choose the nearest contract count.
- hi: रुकें और हल करें: पहले पोर्टफोलियो मूल्य को 5.0 से गुणा करें, फिर $100,000 गुणा 8.0 से भाग देकर सही विकल्प चुनें।
- on screen: Thinking timer phase

**s09b3** (mentor; facts F03, F08)

- en: Option B is right: 313 contracts. Dividing 250,000,000 by 800,000 equals 312.50 exact contracts, rounding cleanly to short 313 contracts.
- hi: विकल्प बी सही है: 313 कॉन्ट्रैक्ट। 250,000,000 को 800,000 से भाग देने पर 312.50 आता है, जिसे पूर्णांक में 313 शॉर्ट कॉन्ट्रैक्ट चुनते हैं।
- on screen: Reveal Option B: 313 contracts solution

## Scene 10: Chapter 6 Synthesis & Bridge to Chapter 7

_Synthesize Chapter 6 short-rate & duration hedging and bridge forward to Chapter 7 Swaps_

**s10b1** (mentor; facts F01, F02, F03)

- en: By deducting Convexity Adjustment bias from 100 minus R futures, institutions unlock reliable 5 to 10 year zero curves and exact hedge sizing N*.
- hi: 100 माइनस आर फ्यूचर्स से कॉन्वेक्सिटी एडजस्टमेंट घटाकर संस्थाएं 5 से 10 वर्ष का सटीक जीरो कर्व और हेज अनुपात एन स्टार प्राप्त करती हैं।
- on screen: Highlight convexity and duration immunizer pillars

**s10b2** (mentor; facts F06, F07)

- en: Yet duration hedges remain dynamic: desks must watch balance-sheet ALM gaps, credit spreads, curve twists, and CTD switching continuously.
- hi: फिर भी ड्यूरेशन हेजिंग गतिशील रहती है: डेस्क को लगातार एएलएम गैप, क्रेडिट स्प्रेड, कर्व बदलाव और सीटीडी स्विचिंग पर ध्यान देना होता है।
- on screen: Highlight dynamic risk monitoring pillar

**s10b3** (mentor; facts F06)

- en: Next on our course roadmap, Chapter 7 introduces Swaps: fixed-for-floating interest rate swaps, comparative advantage, credit risk, and swap valuation.
- hi: हमारे कोर्स रोडमैप पर आगे, अध्याय 7 में हम स्वैप्स सीखेंगे: इंटरेस्ट रेट स्वैप्स की कार्यप्रणाली, तुलनात्मक लाभ, क्रेडिट रिस्क और स्वैप वैल्यूएशन।
- on screen: Roadmap bridge to Chapter 7 Interest Rate and Currency Swaps

## Scene 11: Summary Thread: Eight Short-Rate & Duration Rules

_Fixed 6-beat summary codifying all 8 rules taught in Chapter 6 Part 2_

**s11b1** (mentor; facts F01)

- en: Let us summarize all eight quantitative rules of Eurodollar futures and duration hedging from Chapter 6 Part 2 before Chapter 7 Swaps.
- hi: अध्याय 7 स्वैप्स से पहले आइए अध्याय 6 पार्ट 2 के यूरोडॉलर फ्यूचर्स और ड्यूरेशन हेजिंग के सभी आठ नियमों का सार दोहराएं।
- on screen: Overview header of 8 rules

**s11b2** (mentor; facts F01, F10)

- en: Rule 1 quotes Eurodollar and SOFR contracts at 100 minus R, moving inverse to rates. Rule 2 values each 1 basis point move at $25.
- hi: नियम 1 यूरोडॉलर और एसओएफआर को 100 माइनस आर पर कोट करता है। नियम 2 हर 1 बेसिस पॉइंट बदलाव को $25 के बराबर आंकता है।
- on screen: Rules 1 and 2 displayed side by side

**s11b3** (mentor; facts F02, F04)

- en: Rule 3 recognizes daily variation margin lifts futures rates above forwards. Rule 4 applies the Convexity Adjustment deduction half sigma squared T1 T2.
- hi: नियम 3 बताता है कि वेरिएशन मार्जिन से फ्यूचर्स दरें फॉरवर्ड से ऊपर रहती हैं। नियम 4 आधा सिग्मा स्क्वायर टी1 टी2 का कॉन्वेक्सिटी एडजस्टमेंट लागू करता है।
- on screen: Rules 3 and 4 displayed side by side

**s11b4** (mentor; facts F03, F09)

- en: Rule 5 uses convexity-adjusted futures to extend continuous zero curves out 5 to 10 years. Rule 6 calculates N star matching portfolio dollar duration.
- hi: नियम 5 समायोजित फ्यूचर्स से 5 से 10 वर्ष का जीरो कर्व विस्तार करता है। नियम 6 पोर्टफोलियो डॉलर ड्यूरेशन के बराबर एन स्टार निकालता है।
- on screen: Rules 5 and 6 displayed side by side

**s11b5** (mentor; facts F06, F07)

- en: Rule 7 immunizes bank ALM duration gaps using short rate futures. Rule 8 flags non-parallel curve twists, credit spreads, and CTD shifts requiring rebalancing.
- hi: नियम 7 फ्यूचर्स से बैंक एएलएम ड्यूरेशन गैप समाप्त करता है। नियम 8 असमान कर्व बदलाव, क्रेडिट स्प्रेड और सीटीडी बदलाव से सतर्क करता है।
- on screen: Rules 7 and 8 displayed side by side

**s11b6** (mentor; facts F01, F03, F06)

- en: Review all 8 rules from Chapter 6 carefully. Next in Chapter 7: Swaps, we master fixed-for-floating swaps, comparative advantage, and valuation.
- hi: अध्याय 6 के इन सभी 8 नियमों की समीक्षा करें। अगले अध्याय 7 यानी स्वैप्स में हम इंटरेस्ट रेट स्वैप्स, तुलनात्मक लाभ और वैल्यूएशन सीखेंगे।
- on screen: Compact overview of all 8 rules and Chapter 7 transition

