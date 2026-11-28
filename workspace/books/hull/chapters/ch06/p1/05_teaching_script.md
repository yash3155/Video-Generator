# Chapter 6 Part 1

## Scene 0: Treasury Bond Futures: Solving Multi-Bond Delivery

_Problem-first hook introducing CBOT bond futures and multi-bond basket complexity_

**s00b1** (novice; facts F03)

- en: How can one Treasury bond futures contract stay fairly priced when sellers can deliver dozens of different bonds?
- hi: जब विक्रेता दर्जनों अलग-अलग ट्रेजरी बॉन्ड डिलीवर कर सकते हैं, तो एक ही फ्यूचर्स कॉन्ट्रैक्ट की सही कीमत कैसे तय होती है?
- on screen: Novice raises multi-bond delivery pricing dilemma

**s00b2** (mentor; facts F03, F04)

- en: Without strict math, sellers would dump low-coupon bonds onto buyers for full face value, destroying market trust.
- hi: सख्त गणित के बिना, विक्रेता खरीदारों को कम कूपन वाले बॉन्ड देकर पूरा भुगतान ले लेंगे, जिससे बाजार का भरोसा टूट जाएगा।
- on screen: Mentor explains basket adverse selection danger

**s00b3** (mentor; facts F01, F03)

- en: Therefore the Chicago Board of Trade, or CBOT, meaning the major derivatives exchange for Treasury futures, enforces day count accruals and coupon conversion rules.
- hi: इसलिए शिकागो बोर्ड ऑफ ट्रेड यानी सीबीओटी, जो ट्रेजरी फ्यूचर्स का मुख्य एक्सचेंज है, डे काउंट और कूपन कन्वर्जन नियम लागू करता है।
- on screen: Expand CBOT acronym and preview mechanism

**s00b4** (mentor; facts F01, F05, F08)

- en: In Part 1, we master day counts, dirty pricing, invoice formulas, bond delivery selection, and the late-day timing option.
- hi: पार्ट 1 में हम डे काउंट, डर्टी प्राइस, इनवॉइस फॉर्मूला, बॉन्ड डिलीवरी चयन और लेट-डे टाइमिंग विकल्प सीखेंगे।
- on screen: Preview Part 1 roadmap topics cleanly

## Scene 1: Day Count Conventions Across Debt Markets

_Compare Actual/Actual, 30/360, and Actual/360 day count rules_

**s01b1** (mentor; facts F01)

- en: Every bond pays coupons periodically, so pricing requires a day count convention, which means the market rule counting days to compute accrued interest.
- hi: हर बॉन्ड समय-समय पर कूपन देता है, इसलिए डे काउंट कन्वेंशन आवश्यक है, जिसका अर्थ है अर्जित ब्याज की गणना के लिए दिन गिनने का नियम।
- on screen: Define day count convention and show Treasury row

**s01b2** (mentor; facts F01)

- en: Treasury bonds use exact Actual/Actual calendar ratios, whereas corporate and municipal bonds simplify every month to 30 days under 30/360.
- hi: ट्रेजरी बॉन्ड सटीक एक्चुअल/एक्चुअल अनुपात उपयोग करते हैं, जबकि कॉर्पोरेट और म्यूनिसिपल बॉन्ड 30/360 नियम से हर माह को 30 दिन मानते हैं।
- on screen: Highlight Treasury vs Corporate day count rows

**s01b3** (mentor; facts F01)

- en: Meanwhile, short-term money market paper quotes actual elapsed days divided by a 360-day year. Mixing conventions creates costly settlement errors.
- hi: वहीं शॉर्ट-टर्म मनी मार्केट में वास्तविक दिनों को 360 दिनों के वर्ष से बांटा जाता है। गलत नियम लगाने से भुगतान में बड़ी चूक हो सकती है।
- on screen: Show Actual/360 money market convention row

## Scene 2: Clean Price vs. Dirty Price: Accrual Reality

_Clarify clean screen quotes versus dirty cash settlement prices_

**s02b1** (mentor; facts F02)

- en: Beginners often fall into a cash trap: thinking the quoted screen price is the total cash wired when buying a bond.
- hi: नौसिखिए अक्सर एक जाल में फंसते हैं: वे स्क्रीन पर दिखने वाली कीमत को ही बॉन्ड खरीदने की कुल नकद लागत मान लेते हैं।
- on screen: Highlight clean-price misconception on left split

**s02b2** (mentor; facts F02)

- en: On exchanges, clean price means the quoted bond price excluding accrued coupon interest, while accrued interest means coupon interest earned since the last payment.
- hi: एक्सचेंज पर क्लीन प्राइस का अर्थ है बिना अर्जित ब्याज वाली कीमत, जबकि एक्रूड इंटरेस्ट का अर्थ है पिछली तारीख से कमाया गया कूपन ब्याज।
- on screen: Define clean price and accrued interest cleanly

**s02b3** (mentor; facts F02)

- en: Dirty price means the actual cash price paid, adding accrued interest to clean price so sellers receive every day of earned coupon.
- hi: डर्टी प्राइस का अर्थ है खरीदार द्वारा चुकाई जाने वाली वास्तविक नकद कीमत, जिसमें क्लीन प्राइस के साथ अर्जित ब्याज भी शामिल होता है।
- on screen: Define dirty price and display cash verdict

## Scene 3: CBOT Contract Specs & The Conversion Factor

_Explain the 15-year delivery basket and 6.0% yield Conversion Factor calibration_

**s03b1** (mentor; facts F03)

- en: Under CBOT Treasury bond futures rules, shorts can deliver any non-callable Treasury bond with at least 15 years remaining maturity, quoted in points and 32nds.
- hi: सीबीओटी ट्रेजरी बॉन्ड फ्यूचर्स में कम से कम 15 वर्ष शेष अवधि वाला कोई भी नॉन-कॉलेबल बॉन्ड डिलीवर हो सकता है, जो पॉइंट्स और 32वें हिस्से में कोट होता है।
- on screen: Introduce 15-year CBOT delivery basket and 32nds quote

**s03b2** (mentor; facts F04)

- en: To adjust for different coupons, exchanges assign a Conversion Factor, which means the theoretical clean bond price per $1.00 face value discounted at a 6.0% semi-annual yield.
- hi: अलग-अलग कूपन को बराबर करने के लिए कन्वर्जन फैक्टर तय होता है, जिसका अर्थ है 6.0% अर्धवार्षिक यील्ड पर प्रति $1.00 फेस वैल्यू की सैद्धांतिक कीमत।
- on screen: Define Conversion Factor 6.0% semi-annual standard

**s03b3** (mentor; facts F04)

- en: Bonds paying coupons above 6.0% earn Conversion Factors above one, while low-coupon bonds get factors below one so deliveries stay roughly fair.
- hi: 6.0% से ज्यादा कूपन वाले बॉन्ड का फैक्टर एक से बड़ा और कम कूपन वाले बॉन्ड का फैक्टर एक से छोटा होता है ताकि डिलीवरी संतुलित रहे।
- on screen: Show CF equalization across high vs low coupon bonds

## Scene 4: The Invoice Price Equation

_Deconstruct CBOT physical delivery cash equation_

**s04b1** (mentor; facts F05)

- en: On physical delivery, Invoice Price means total cash proceeds wired by the buyer, equal to clean bond settlement times conversion factor plus unscaled earned coupon interest.
- hi: बॉन्ड डिलीवरी पर इनवॉइस प्राइस का अर्थ खरीदार द्वारा चुकाई जाने वाली कुल नकद राशि है, यानी क्लीन सेटलमेंट गुणा कन्वर्जन फैक्टर प्लस अर्जित कूपन ब्याज।
- on screen: Define Invoice Price and show full equation

**s04b2** (mentor; facts F04, F05)

- en: Multiplying settlement by Conversion Factor standardizes the clean bond principal, accounting for higher or lower coupons relative to the 6.0% baseline.
- hi: सेटलमेंट को कन्वर्जन फैक्टर से गुणा करने पर 6.0% आधार की तुलना में बॉन्ड के कूपन के अनुसार मुख्य मूल्य समायोजित हो जाता है।
- on screen: Explain Settlement * CF clean scaling factor

**s04b3** (mentor; facts F02, F05)

- en: Finally, add exact accrued interest without multiplying it by Conversion Factor, since coupon cash transfers dollar-for-dollar on settlement day.
- hi: अंत में, कन्वर्जन फैक्टर से गुणा किए बिना ठीक अर्जित ब्याज जोड़ें, क्योंकि कूपन ब्याज डॉलर-के-बदले-डॉलर दिया जाता है।
- on screen: Highlight unscaled Accrued addition

## Scene 5: Worked Example: CBOT Invoice Price Calculation

_Compute Invoice Price for $90.00 settlement, CF 1.2000, and $2.50 accrued interest_

**s05b1** (mentor; facts F05, F09)

- en: Let us calculate an exact invoice wire. Futures settle at $90.00, your chosen bond has Conversion Factor 1.2000, and accrued interest stands at $2.50.
- hi: आइए सटीक इनवॉइस राशि निकालें। फ्यूचर्स $90.00 पर सेटल हुए हैं, बॉन्ड का कन्वर्जन फैक्टर 1.2000 है और अर्जित ब्याज $2.50 है।
- on screen: Present inputs $90.00, 1.2000, $2.50

**s05b2** (mentor; facts F05, F09)

- en: First scale the $90.00 settlement price by the 1.2000 conversion factor to get $108.00. Predict: why add the $2.50 accrued interest afterwards without multiplying by the factor?
- hi: पहले $90.00 सेटलमेंट कीमत को 1.2000 कन्वर्जन फैक्टर से गुणा करने पर $108.00 आता है। अनुमान लगाएं: हमें $2.50 अर्जित ब्याज को बिना फैक्टर गुणा किए क्यों जोड़ना होगा?
- on screen: Prediction prompt on accrued coupon addition

**s05b3** (mentor; facts F05, F09)

- en: Because accrued coupon days belong dollar-for-dollar to the seller. Adding $2.50 onto $108.00 gives the exact invoice price of $110.50 per $100 par.
- hi: क्योंकि अर्जित कूपन ब्याज पूरा-का-पूरा विक्रेता का होता है। $108.00 में $2.50 जोड़ने पर ठीक $110.50 प्रति $100 पार मूल्य प्राप्त होता है।
- on screen: Reveal final invoice result $110.50

## Scene 6: The Cheapest-to-Deliver (CTD) Bond

_Causal chain explaining how shorts identify the CTD bond in the basket_

**s06b1** (mentor; facts F06)

- en: Because dozens of bonds qualify in the basket, shorts hunt for the Cheapest-to-Deliver bond, which means the eligible bond minimizing net delivery cost.
- hi: बास्केट में दर्जनों बॉन्ड पात्र होने के कारण, विक्रेता चीपेस्ट-टू-डिलीवर बॉन्ड चुनते हैं, जिसका अर्थ है डिलीवरी लागत को न्यूनतम रखने वाला बॉन्ड।
- on screen: Define Cheapest-to-Deliver bond minimization

**s06b2** (mentor; facts F04, F06)

- en: Whenever market yields diverge from the fixed 6.0% baseline, Conversion Factors fail to equalize every bond identically, creating profit gaps.
- hi: जब भी बाजार की यील्ड स्थिर 6.0% आधार से अलग होती है, तो कन्वर्जन फैक्टर सभी बॉन्ड्स को बिल्कुल बराबर नहीं रख पाते, जिससे अंतर पैदा होता है।
- on screen: Show divergence from 6.0% calibration creating gaps

**s06b3** (mentor; facts F06)

- en: Shorts minimize Quoted minus Settlement times CF, buy that winning Cheapest-to-Deliver bond, and pin futures prices closely to it.
- hi: शॉर्ट्स कोटेड प्राइस माइनस सेटलमेंट गुणा सीएफ को न्यूनतम रखकर उस विजयी सीटीडी बॉन्ड को डिलीवर करते हैं, जिससे फ्यूचर्स कीमत उसी से जुड़ जाती है।
- on screen: Reveal CTD bond convergence outcome

## Scene 7: Yield Regimes: Above vs. Below 6.0%

_Contrast which bond types become CTD when market yields rise above or fall below 6.0%_

**s07b1** (mentor; facts F07)

- en: Which bond wins CTD status? When market yields sit above 6.0%, high-duration low-coupon long-maturity bonds fall fastest in price, becoming cheapest to deliver.
- hi: कौन सा बॉन्ड सीटीडी बनता है? जब बाजार यील्ड 6.0% से ऊपर हो, तो कम कूपन और लंबी अवधि वाले बॉन्ड सबसे सस्ते पड़ते हैं और डिलीवरी जीतते हैं।
- on screen: Highlight yields > 6.0% low-coupon long-bond rule

**s07b2** (mentor; facts F07)

- en: Conversely, when market yields drop below 6.0%, high-coupon short-maturity bonds gain less value and dominate delivery across Treasury desks.
- hi: इसके विपरीत, जब बाजार यील्ड 6.0% से नीचे हो, तो उच्च कूपन और कम अवधि वाले बॉन्ड सबसे किफायती डिलीवरी विकल्प बन जाते हैं।
- on screen: Highlight yields < 6.0% high-coupon short-bond rule

**s07b3** (mentor; facts F07)

- en: Remember 6.0% is the tipping point: large yield swings across that threshold rotate the cheapest bond mid-contract.
- hi: याद रखें कि 6.0% मुख्य मोड़ बिंदु है: इसके आर-पार बड़े ब्याज बदलाव से कॉन्ट्रैक्ट के बीच सीटीडी बॉन्ड बदल सकता है।
- on screen: Reveal 6.0% tipping point resolution

## Scene 8: The Wild Card Play: After-Hours Timing Edge

_Illustrate the 2:00 PM settlement to 8:00 PM delivery notice Wild Card option_

**s08b1** (mentor; facts F08)

- en: Beyond choosing which bond to ship, shorts also hold the Wild Card play, which means an option between 2:00 PM settlement and 8:00 PM notice cutoff.
- hi: सही बॉन्ड चुनने के अलावा, विक्रेताओं के पास वाइल्ड कार्ड प्ले भी होता है, जिसका अर्थ है दोपहर 2:00 बजे के सेटलमेंट और रात 8:00 बजे तक डिलीवरी सूचना के बीच का विकल्प।
- on screen: Define Wild Card play 2:00 PM to 8:00 PM window

**s08b2** (mentor; facts F08)

- en: CBOT freezes futures settlement at 2:00 PM Chicago time, while Treasury cash bonds keep trading later into the afternoon.
- hi: सीबीओटी दोपहर 2:00 बजे शिकागो समय पर फ्यूचर्स सेटलमेंट लॉक कर देता है, जबकि नकद ट्रेजरी बॉन्ड शाम तक ट्रेड होते रहते हैं।
- on screen: Highlight afternoon cash market drop after 2:00 PM freeze

**s08b3** (mentor; facts F08)

- en: If spot bonds fall sharply before 8:00 PM, the short buys cash bonds cheaply, files notice, and bills at the higher 2:00 PM price.
- hi: यदि रात 8:00 बजे से पहले स्पॉट बॉन्ड गिर जाएं, तो शॉर्ट सस्ता बॉन्ड खरीदकर डिलीवरी नोटिस देता है और 2:00 बजे की ऊंची कीमत वसूलता है।
- on screen: Reveal Wild Card delivery profit at 8:00 PM

## Scene 9: Active Recall: Computing CBOT Invoice Price

_3-beat quiz calculating Invoice Price for $95.00, CF 1.1000, Accrued $1.50_

**s09b1** (mentor; facts F05, F10)

- en: Apply our delivery formula yourself. Futures settle at $95.00, Conversion Factor equals 1.1000, and accrued interest equals $1.50. What is the Invoice Price?
- hi: अब स्वयं डिलीवरी फॉर्मूला लगाएं। फ्यूचर्स $95.00 पर सेटल हैं, कन्वर्जन फैक्टर 1.1000 है और अर्जित ब्याज $1.50 है। कुल इनवॉइस प्राइस क्या होगी?
- on screen: Present quiz inputs $95.00, 1.1000, $1.50

**s09b2** (mentor; facts F05, F10)

- en: Pause and calculate cleanly: scale settlement $95.00 by 1.1000 first, then add accrued interest $1.50 before selecting your option.
- hi: रुकें और गणना करें: पहले $95.00 सेटलमेंट को 1.1000 से गुणा करें और फिर $1.50 अर्जित ब्याज जोड़कर सही विकल्प चुनें।
- on screen: Thinking timer phase with 4 options displayed

**s09b3** (mentor; facts F05, F10)

- en: Option B is right: $106.00. Scaling $95.00 by 1.1000 gives $104.50, and adding $1.50 accrued interest yields $106.00 total cash.
- hi: विकल्प बी सही है: $106.00। $95.00 को 1.1000 से गुणा करने पर $104.50 आता है, और $1.50 अर्जित ब्याज जोड़ने पर $106.00 बनता है।
- on screen: Reveal Option B: $106.00 complete solution

## Scene 10: Treasury Delivery Synthesis & Bridge to Part 2

_Synthesize Part 1 bond futures delivery rules and bridge to Part 2 Eurodollar & Duration Hedging_

**s10b1** (mentor; facts F01, F02, F04)

- en: Institutional bond traders always separate clean quotes from dirty cash via day count rules and apply Conversion Factors calibrated at 6.0%.
- hi: संस्थागत बॉन्ड ट्रेडर्स हमेशा डे काउंट नियमों से क्लीन व डर्टी प्राइस अलग रखते हैं और 6.0% पर आधारित कन्वर्जन फैक्टर लागू करते हैं।
- on screen: Highlight accrual hygiene and conversion calibration

**s10b2** (mentor; facts F06, F08)

- en: Short sellers exploit CTD basket selection and the 2:00 PM to 8:00 PM Wild Card window, slightly lowering fair Treasury futures prices.
- hi: शॉर्ट विक्रेता सीटीडी बास्केट और दोपहर 2:00 से रात 8:00 बजे की वाइल्ड कार्ड विंडो का लाभ उठाते हैं, जिससे फ्यूचर्स मूल्य थोड़े कम रहते हैं।
- on screen: Highlight short optionality edge

**s10b3** (mentor; facts F05)

- en: Next in Part 2, we move to short-term rates: Eurodollar and Secured Overnight Financing Rate futures pricing, Convexity Adjustment, and duration-based portfolio hedging.
- hi: आगे पार्ट 2 में हम शॉर्ट-टर्म दरों पर बढ़ेंगे: यूरोडॉलर और सिक्योर्ड ओवरनाइट फाइनेंसिंग रेट फ्यूचर्स प्राइसिंग, कॉन्वेक्सिटी एडजस्टमेंट और ड्यूरेशन-बेस्ड पोर्टफोलियो हेजिंग।
- on screen: Roadmap bridge to Part 2 Eurodollar, Secured Rate, Convexity & Duration Hedging

## Scene 11: Summary Thread: Eight Rules of Bond Futures

_Fixed 6-beat summary codifying all 8 rules of day counts and Treasury futures taught in Part 1_

**s11b1** (mentor; facts F01)

- en: Let us lock in all eight foundational rules of Treasury bond futures from Part 1 before exploring Eurodollar futures in Part 2.
- hi: पार्ट 2 में यूरोडॉलर फ्यूचर्स पढ़ने से पहले आइए पार्ट 1 के ट्रेजरी बॉन्ड फ्यूचर्स के सभी आठ बुनियादी नियमों को दोहराएं।
- on screen: Header overview of 8 rules

**s11b2** (mentor; facts F01, F02)

- en: Rule 1 matches day count conventions across Treasury, corporate, and money markets. Rule 2 adds accrued interest onto clean quotes to produce dirty cash prices.
- hi: नियम 1 ट्रेजरी, कॉर्पोरेट और मनी मार्केट में डे काउंट नियम तय करता है। नियम 2 क्लीन प्राइस में अर्जित ब्याज जोड़कर डर्टी कैश प्राइस बनाता है।
- on screen: Rules 1 and 2 displayed side by side

**s11b3** (mentor; facts F03, F04)

- en: Rule 3 limits CBOT delivery baskets to 15-year Treasuries quoted in 32nds. Rule 4 calibrates each bond's Conversion Factor at a 6.0% semi-annual yield.
- hi: नियम 3 सीबीओटी डिलीवरी बास्केट को 15 वर्ष के ट्रेजरी बॉन्ड तक सीमित रखता है। नियम 4 6.0% अर्धवार्षिक यील्ड पर कन्वर्जन फैक्टर तय करता है।
- on screen: Rules 3 and 4 displayed side by side

**s11b4** (mentor; facts F05, F06)

- en: Rule 5 computes Invoice Price cash as Settlement times CF plus accrued interest. Rule 6 selects the CTD bond minimizing Quoted minus Settlement times CF.
- hi: नियम 5 इनवॉइस प्राइस को सेटलमेंट गुणा सीएफ प्लस अर्जित ब्याज से निकालता है। नियम 6 न्यूनतम लागत वाला सीटीडी बॉन्ड चुनता है।
- on screen: Rules 5 and 6 displayed side by side

**s11b5** (mentor; facts F07, F08)

- en: Rule 7 flags 6.0% as the CTD tipping yield between low and high coupons. Rule 8 captures Wild Card timing between 2:00 PM settlement and 8:00 PM cutoff.
- hi: नियम 7 कम और अधिक कूपन बॉन्ड्स के बीच 6.0% मोड़ को दर्शाता है। नियम 8 दोपहर 2:00 बजे और रात 8:00 बजे के बीच वाइल्ड कार्ड समय विकल्प बताता है।
- on screen: Rules 7 and 8 displayed side by side

**s11b6** (mentor; facts F01, F05, F08)

- en: Keep all 8 rules ready. Next in Part 2, we cover Eurodollar and secured short-rate futures, Convexity Adjustment, and duration hedging.
- hi: इन सभी 8 नियमों को याद रखें। अगले पार्ट 2 में हम यूरोडॉलर और सिक्योर्ड शॉर्ट-रेट फ्यूचर्स, कॉन्वेक्सिटी एडजस्टमेंट और ड्यूरेशन हेजिंग सीखेंगे।
- on screen: Compact 8-rule overview and Part 2 transition

