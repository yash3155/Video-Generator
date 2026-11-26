# Chapter 5 Part 2

## Scene 0: Macro Markets: Indices, Currencies & Commodities

_Problem-first hook extending no-arbitrage pricing to indices, FX, and physical commodities_

**s00b1** (novice; facts F01, F02)

- en: How can arbitrage desks replicate a 500-stock index, global currencies, and crude oil barrels in seconds?
- hi: आर्बिट्राज डेस्क कुछ ही सेकंड में 500 स्टॉक्स के इंडेक्स, विदेशी मुद्राओं और कच्चे तेल को कैसे रेप्लिकेट करते हैं?
- on screen: Novice raises macro replication problem

**s00b2** (mentor; facts F02, F05)

- en: Most derivatives volume trades macro markets, where desks confront 500-stock baskets, foreign money-market rates, and physical storage vaults.
- hi: डेरिवेटिव्स का अधिकांश कारोबार मैक्रो बाजारों में होता है, जहां 500 शेयरों के बास्केट, विदेशी ब्याज दरों और भौतिक गोदामों की चुनौती होती है।
- on screen: Mentor frames operational obstacles in macro markets

**s00b3** (mentor; facts F07)

- en: Automated baskets, foreign rates, and warehouse vaults all simplify under cost of carry. Cost of carry means the net rate unifying financing, storage, and yields.
- hi: ऑटोमेटेड बास्केट, विदेशी दरें और गोदाम सब कॉस्ट ऑफ कैरी से जुड़ते हैं, जिसका अर्थ है ब्याज, स्टोरेज और यील्ड को जोड़ने वाली शुद्ध दर।
- on screen: Define cost of carry early to anchor architecture

**s00b4** (mentor; facts F02, F03, F08)

- en: In Part 2, we master 500-stock basket replication, foreign interest rates for global currencies, physical warehouse commodities, and one master Cost of Carry formula.
- hi: पार्ट 2 में हम 500 स्टॉक्स की बास्केट रेप्लिकेशन, ग्लोबल करेंसी फॉरवर्ड्स, कमोडिटी स्टोरेज और एकीकृत कॉस्ट ऑफ कैरी फॉर्मूले में महारत हासिल करेंगे।
- on screen: Preview Part 2 learning map

## Scene 1: Stock Index Futures & Program Trading

_Explain how index arbitrage and automated program trading replicate constituent stock baskets_

**s01b1** (mentor; facts F01)

- en: Stock index futures follow our continuous yield formula F zero equals S zero exp(r minus q times T), aggregating index dividends smoothly.
- hi: स्टॉक इंडेक्स फ्यूचर्स हमारे फॉर्मूले एफ जीरो बराबर एस जीरो ई की पावर आर माइनस क्यू टी पर चलते हैं, जहां क्यू कुल डिविडेंड यील्ड है।
- on screen: Connect Part 1 continuous yield formula to index futures

**s01b2** (mentor; facts F02)

- en: When index quotes drift apart, desks launch index arbitrage, which means trading index futures against weighted baskets of all 500 stocks.
- hi: जब इंडेक्स कोट भटकते हैं, तो डेस्क इंडेक्स आर्बिट्राज करते हैं, जिसका अर्थ है फ्यूचर्स के साथ 500 शेयरों के बास्केट का एक साथ व्यापार करना।
- on screen: Define index arbitrage on 500-stock basket

**s01b3** (mentor; facts F02)

- en: Humans cannot route 500 tickets fast enough. Instead, firms deploy program trading, which means computerized order engines hitting every stock simultaneously.
- hi: इंसान 500 ऑर्डर इतनी तेजी से नहीं लगा सकते। इसके लिए कंपनियां प्रोग्राम ट्रेडिंग का इस्तेमाल करती हैं, जिसका अर्थ है कंप्यूटर द्वारा एक साथ सभी शेयर ट्रेड करना।
- on screen: Define program trading millisecond execution

## Scene 2: Arbitrage Bands, FX Myths & Triple Witching

_Contrast frictionless textbook myths with arbitrage bands and quarterly expiration surges_

**s02b1** (mentor; facts F02)

- en: Real markets are not zero-fee. Commissions and spreads form an arbitrage band, which means a narrow zone around fair value where trading loses money.
- hi: असली बाजार बिना शुल्क के नहीं होते। कमीशन और स्प्रेड एक आर्बिट्राज बैंड बनाते हैं, जिसका अर्थ है सही मूल्य के आसपास वह दायरा जहां ट्रेडिंग घाटे का सौदा है।
- on screen: Define arbitrage band caused by trading costs

**s02b2** (mentor; facts F02)

- en: Beyond the band, program orders flood exchanges, especially during quarterly Triple Witching Hour expirations when huge arbitrage baskets unwind together.
- hi: बैंड से बाहर निकलते ही प्रोग्राम ऑर्डर बाढ़ ला देते हैं, खासकर तिमाही ट्रिपल विचिंग आवर पर जब बड़े बास्केट एक साथ अनवाइंड होते हैं।
- on screen: Highlight Triple Witching expiration volume surges

**s02b3** (mentor; facts F03, F09)

- en: Avoid the currency trap too: higher foreign rates do not lift currency forwards higher. Arbitrage forces high-interest currencies to a forward discount.
- hi: विदेशी मुद्रा के भ्रम से भी बचें: ऊंची विदेशी ब्याज दरें फॉरवर्ड कोट को ऊपर नहीं धकेलतीं, बल्कि ऊंचे ब्याज वाली मुद्रा को फॉरवर्ड डिस्काउंट पर लाती हैं।
- on screen: Reveal misconception verdict on FX forward discount

## Scene 3: Currency Forwards: Covered Interest Parity

_Derive Covered Interest Parity by modeling foreign interest rf as continuous dividend yield_

**s03b1** (mentor; facts F03)

- en: Hold foreign cash in London or Tokyo, and it earns the foreign risk-free interest rate rf continuously, behaving just like a dividend yield.
- hi: लंदन या टोक्यो में रखी विदेशी मुद्रा लगातार विदेशी रिस्क-फ्री दर आरएफ कमाती है, जो बिल्कुल डिविडेंड यील्ड की तरह काम करती है।
- on screen: Model foreign currency interest rf as continuous yield

**s03b2** (mentor; facts F03)

- en: Replacing q with rf produces Covered Interest Parity, which means currency forward rates strictly mirror the domestic minus foreign interest rate spread.
- hi: क्यू की जगह आरएफ रखने से कवर्ड इंटरेस्ट पैरिटी बनता है, जिसका अर्थ है करेंसी फॉरवर्ड दरें घरेलू और विदेशी ब्याज अंतर के बराबर रहती हैं।
- on screen: Define Covered Interest Parity formula and spread

**s03b3** (mentor; facts F03)

- en: When domestic interest r beats foreign rate rf, the foreign currency trades at a premium; when foreign rf exceeds r, it trades at a discount.
- hi: जब घरेलू दर आर विदेशी दर आरएफ से अधिक हो, तो विदेशी मुद्रा प्रीमियम पर ट्रेड करती है; अन्यथा वह डिस्काउंट पर ट्रेड करती है।
- on screen: Explain forward premium and discount regimes

## Scene 4: Covered Interest Arbitrage Mechanics

_Trace the causal chain enforcing Covered Interest Parity across global money markets_

**s04b1** (mentor; facts F04)

- en: Whenever currency quotes violate parity, desks fire covered interest arbitrage, which means borrowing one currency, converting spot, investing abroad, and hedging forward.
- hi: जब करेंसी कोट पैरिटी तोड़ते हैं, तो डेस्क कवर्ड इंटरेस्ट आर्बिट्राज करते हैं, जिसका अर्थ है एक मुद्रा उधार लेकर दूसरी में निवेश करना और फॉरवर्ड हेज लगाना।
- on screen: Trigger condition and define covered interest arbitrage

**s04b2** (mentor; facts F04)

- en: While foreign treasury bills earn rf, locking the forward sale price today completely removes any exchange rate fluctuation risk.
- hi: विदेशी बिल पर आरएफ ब्याज कमाते हुए आज ही फॉरवर्ड बिक्री मूल्य लॉक करने से करेंसी उतार-चढ़ाव का सारा जोखिम खत्म हो जाता है।
- on screen: Lock forward conversion eliminating currency exposure

**s04b3** (mentor; facts F04)

- en: At delivery, converted domestic funds exceed the initial loan repayment, locking riskless spread and snapping currency quotes right back to parity.
- hi: डिलीवरी पर कनवर्ट की गई घरेलू राशि शुरुआती लोन से अधिक होती है, जिससे बिना जोखिम मुनाफा मिलता है और कोट तुरंत पैरिटी पर लौट आता है।
- on screen: Repay domestic loan and close arbitrage spread

## Scene 5: Worked Example: USD/GBP Forward Discount

_Solve textbook numerical example calculating 1-year USD/GBP forward rate at 1.4557_

**s05b1** (mentor; facts F03, F09)

- en: Let us price a currency forward directly. Spot exchange trades at 1.5000 dollars per British pound, US rates sit at 5.0%, and UK rates pay 8.0% for 1 year.
- hi: आइए एक करेंसी फॉरवर्ड की गणना करें। स्पॉट दर 1.5000 डॉलर प्रति पाउंड है, अमेरिकी दर 5.0% है और यूके दर 1 वर्ष के लिए 8.0% है।
- on screen: Display spot S0=1.5000, r=5.0%, rf=8.0%, T=1

**s05b2** (mentor; facts F03, F09)

- en: Compute rate spread r minus rf first: UK rate 8.0% minus US 5.0% makes spread negative. Will the forward pound trade at a premium or discount?
- hi: पहले ब्याज दर अंतर आर माइनस आरएफ निकालें: यूके दर 8.0% अमेरिकी 5.0% से ज्यादा है, तो क्या फॉरवर्ड पाउंड प्रीमियम पर होगा या डिस्काउंट पर?
- on screen: Prediction prompt on rate spread r - rf = -0.03

**s05b3** (mentor; facts F03, F09)

- en: A discount. Multiplying 1.5000 by e to the minus 0.03 yields 1.4557 dollars per pound, neutralizing the extra 3% British interest.
- hi: डिस्काउंट पर। 1.5000 को ई की पावर माइनस 0.03 से गुणा करने पर 1.4557 डॉलर प्रति पाउंड आता है, जो अतिरिक्त 3% यूके ब्याज को बराबर कर देता है।
- on screen: Reveal result 1.4557 dollars per GBP

## Scene 6: Commodities: Storage Costs & Convenience Yield

_Derive commodity carry adding storage u and subtracting physical convenience yield y_

**s06b1** (mentor; facts F05)

- en: Turning to commodities, holding gold or silver incurs storage costs, which means vault warehousing and insurance expenses u added directly onto financing rate r.
- hi: कमोडिटीज में सोना या चांदी रखने पर स्टोरेज कॉस्ट लगती है, जिसका अर्थ है गोदाम और बीमा खर्च यू जिसे फाइनेंसिंग दर आर में जोड़ा जाता है।
- on screen: Define storage costs u as negative dividend

**s06b2** (mentor; facts F06)

- en: Alongside vault storage outlays u, firms holding oil or copper earn convenience yield, which means the operational security benefit y of keeping physical inventory.
- hi: गोदाम स्टोरेज खर्च यू के साथ तेल या तांबे में कंपनियों को कन्वीनिएंस यील्ड मिलता है, जिसका अर्थ है सप्लाई की कमी के समय भौतिक स्टॉक पास रखने का परिचालन लाभ वाई।
- on screen: Define convenience yield y on consumption goods

**s06b3** (mentor; facts F06)

- en: Because refineries cannot easily short oil barrels in storage, futures obey only an upper bound below compounded storage cost r plus u.
- hi: क्योंकि रिफाइनरी भंडारित तेल के बैरल आसानी से शॉर्ट नहीं कर सकतीं, इसलिए फ्यूचर्स केवल आर प्लस यू की ऊपरी सीमा का पालन करते हैं।
- on screen: Highlight upper bound F0 <= S0 exp((r + u)T)

## Scene 7: Unified Cost of Carry Architecture

_Synthesize all asset classes inside Hull's single Cost of Carry equation_

**s07b1** (mentor; facts F07)

- en: John Hull unites non-income stocks, equity indexes, and every market inside one equation: F zero equals S zero exp(cT), where continuous financing and yield define cost of carry c.
- hi: जॉन हल नॉन-इनकम स्टॉक, इक्विटी इंडेक्स और सभी बाजारों को एक समीकरण में समेटते हैं: एफ जीरो बराबर एस जीरो ई की पावर सीटी, जिसे नेट कॉस्ट ऑफ कैरी सी चलाती है।
- on screen: Introduce unified table for F0 = S0 exp(cT)

**s07b2** (mentor; facts F01, F03, F07)

- en: For zero-income stocks c equals r, for equity indices c equals r minus q, and for global currencies c equals r minus rf.
- hi: बिना आय वाले शेयरों के लिए सी बराबर आर, इंडेक्स के लिए आर माइनस क्यू और विदेशी मुद्राओं के लिए आर माइनस आरएफ होता है।
- on screen: Map stocks, indices, and foreign exchange carry c

**s07b3** (mentor; facts F05, F06, F07)

- en: Physical metals add storage cost u, while industrial commodities subtract convenience yield y. One unified carry architecture powers every global desk.
- hi: धातुओं में स्टोरेज खर्च यू जुड़ता है, जबकि औद्योगिक कमोडिटीज में कन्वीनिएंस यील्ड वाई घटता है। यह एकीकृत ढांचा हर ग्लोबल डेस्क चलाता है।
- on screen: Highlight metal and commodity carry rows

## Scene 8: Contango, Backwardation & Delivery Options

_Contrast upward contango carry forces against downward backwardation and short delivery options_

**s08b1** (mentor; facts F08)

- en: Every commodity forward curve reflects a tug of war. Contango means futures prices trade above current spot prices because financing and storage dominate.
- hi: हर कमोडिटी कर्व दो ताकतों के बीच खींचतान दिखाता है। कॉन्टैंगो का अर्थ है जब ब्याज और स्टोरेज खर्च हावी होने से फ्यूचर्स दाम स्पॉट से ऊपर रहते हैं।
- on screen: Define contango on left tug-of-war side

**s08b2** (mentor; facts F08)

- en: Conversely, tight supply yields and hedger selling create normal backwardation below spot, reinforced by delivery options, which means short-seller rights over timing, location, and cheapest grade.
- hi: इसके विपरीत, सप्लाई संकट और हेजर्स की बिक्री नॉर्मल बैकवर्डेशन बनाती है, जिसे डिलीवरी ऑप्शंस मजबूत करते हैं जिनका अर्थ है शॉर्ट विक्रेता के समय, स्थान और ग्रेड चुनने के अधिकार।
- on screen: Define delivery options and backwardation on right panel

**s08b3** (mentor; facts F08)

- en: Because exchange delivery options favor the short seller, buyers demand slightly lower futures prices relative to custom forwards.
- hi: क्योंकि एक्सचेंज के डिलीवरी ऑप्शंस शॉर्ट विक्रेता के पक्ष में होते हैं, खरीदार कस्टम फॉरवर्ड की तुलना में फ्यूचर्स पर थोड़ी कम कीमत मांगते हैं।
- on screen: Reveal equilibrium resolution panel

## Scene 9: Active Recall: EUR/USD Covered Interest Parity

_3-beat interactive quiz solving 1-year EUR/USD forward premium 1.2753_

**s09b1** (mentor; facts F03, F10)

- en: Now apply Covered Interest Parity yourself. Spot euro trades at 1.2500 dollars per euro, US rates pay 6.0%, and Eurozone rates pay 4.0%. Find the 1-year forward rate.
- hi: अब स्वयं कवर्ड इंटरेस्ट पैरिटी लागू करें। स्पॉट यूरो 1.2500 डॉलर प्रति यूरो है, अमेरिकी दर 6.0% और यूरोजोन दर 4.0% है। 1-वर्ष की फॉरवर्ड दर निकालें।
- on screen: Present euro/dollar quiz parameters

**s09b2** (mentor; facts F03, F10)

- en: Pause and evaluate: subtract the 4.0% foreign rate from the 6.0% US rate, check the sign, and apply exponential compounding to 1.2500.
- hi: रुकें और हल करें: 6.0% अमेरिकी दर में से 4.0% विदेशी दर घटाएं, चिन्ह जांचें और 1.2500 पर एक्सपोनेन्शियल कम्पाउंडिंग लागू करें।
- on screen: Thinking pause while learner evaluates 4 options

**s09b3** (mentor; facts F03, F10)

- en: Option B is right: 1.2753 dollars per euro. Since US rate 6.0% beats Eurozone 4.0%, positive carry compounds 1.2500 up to a forward premium of 1.2753.
- hi: विकल्प बी सही है: 1.2753 डॉलर प्रति यूरो। चूंकि अमेरिकी दर 6.0% यूरोजोन की 4.0% से अधिक है, इसलिए सकारात्मक कैरी से 1.2753 का फॉरवर्ड प्रीमियम बनता है।
- on screen: Reveal Option B: 1.2753 dollars per euro forward premium

## Scene 10: Macro Carry Synthesis & Bridge to Chapter 6

_Synthesize Chapter 5 macro forward pricing and bridge clearly to Chapter 6 Interest Rate Futures_

**s10b1** (mentor; facts F01, F03, F07)

- en: Chapter 5 unifies equities, metals, and industrial goods inside one carry model, while brokerage spreads form arbitrage bands limiting program trading.
- hi: अध्याय 5 इक्विटी, धातुओं और औद्योगिक वस्तुओं को एक कैरी मॉडल में जोड़ता है, जबकि ब्रोकरेज स्प्रेड प्रोग्राम ट्रेडिंग की आर्बिट्राज सीमाएं तय करते हैं।
- on screen: Highlight global carry unification synthesis

**s10b2** (mentor; facts F02, F06, F08)

- en: In practice, transaction bands limit micro-arbitrage, while operational convenience yields and short delivery options pull physical commodity futures curves away from textbook ideals.
- hi: व्यवहार में, लेन-देन बैंड छोटे आर्बिट्राज को रोकते हैं, जबकि कन्वीनिएंस यील्ड और डिलीवरी ऑप्शंस कमोडिटी कर्व को किताबी आदर्श से थोड़ा अलग रखते हैं।
- on screen: Highlight friction bands and physical inventory reality

**s10b3** (mentor; facts F07)

- en: Looking ahead on our roadmap, Chapter 6 covers Interest Rate Futures: day count conventions, Treasury bond cheapest-to-deliver pricing, Eurodollar futures, and convexity adjustments.
- hi: हमारे रोडमैप पर आगे, अध्याय 6 में हम इंटरेस्ट रेट फ्यूचर्स पढ़ेंगे: डे काउंट कन्वेंशन, ट्रेजरी बॉन्ड फ्यूचर्स, यूरोडॉलर फ्यूचर्स और कॉन्वेक्सिटी एडजस्टमेंट।
- on screen: Roadmap bridge to Chapter 6 Interest Rate Futures

## Scene 11: Summary Thread: Eight Macro Pricing Rules

_Fixed 6-beat summary thread consolidating all 8 macro forward pricing principles from Part 2_

**s11b1** (mentor; facts F01)

- en: Let us summarize all eight macro forward pricing rules from Chapter 5 Part 2 before moving onward to Interest Rate Futures.
- hi: इंटरेस्ट रेट फ्यूचर्स की ओर बढ़ने से पहले आइए अध्याय 5 पार्ट 2 के सभी आठ मैक्रो फॉरवर्ड प्राइसिंग नियमों को संक्षेप में दोहराएं।
- on screen: Overview header of 8 macro pricing rules

**s11b2** (mentor; facts F01, F02)

- en: Rule 1 executes index arbitrage across 500-stock baskets via program trading. Rule 2 recognizes transaction arbitrage bands and Triple Witching unwind spikes.
- hi: नियम 1 प्रोग्राम ट्रेडिंग से 500 शेयरों के बास्केट पर इंडेक्स आर्बिट्राज करता है। नियम 2 आर्बिट्राज बैंड और ट्रिपल विचिंग उतार-चढ़ाव को स्पष्ट करता है।
- on screen: Rules 1 and 2 displayed

**s11b3** (mentor; facts F03, F04, F09)

- en: Rule 3 applies Covered Interest Parity using domestic minus foreign interest rates. Rule 4 proves high foreign rates create a forward currency discount.
- hi: नियम 3 घरेलू व विदेशी ब्याज अंतर से कवर्ड इंटरेस्ट पैरिटी लागू करता है। नियम 4 दिखाता है कि अधिक विदेशी ब्याज से फॉरवर्ड डिस्काउंट बनता है।
- on screen: Rules 3 and 4 displayed

**s11b4** (mentor; facts F05, F06)

- en: Rule 5 lifts precious metal forwards by storage cost u. Rule 6 deducts physical convenience yield y on consumption goods, enforcing an upper bound.
- hi: नियम 5 स्टोरेज खर्च यू से धातुओं के फॉरवर्ड बढ़ाता है। नियम 6 कंजम्प्शन कमोडिटीज से कन्वीनिएंस यील्ड वाई घटाकर ऊपरी सीमा तय करता है।
- on screen: Rules 5 and 6 displayed

**s11b5** (mentor; facts F07, F08)

- en: Rule 7 creates a unified framework under Cost of Carry c. Rule 8 balances upward contango against normal backwardation and short delivery edge options.
- hi: नियम 7 सभी बाजारों को यूनिफाइड कॉस्ट ऑफ कैरी सी में जोड़ता है। नियम 8 कॉन्टैंगो और नॉर्मल बैकवर्डेशन तथा शॉर्ट डिलीवरी ऑप्शंस को संतुलित करता है।
- on screen: Rules 7 and 8 displayed

**s11b6** (mentor; facts F07, F08)

- en: Review all 8 rules from Chapter 5 carefully. Next in Chapter 6: Interest Rate Futures, we master Treasury bond contracts and Eurodollar hedging.
- hi: अध्याय 5 के इन सभी 8 नियमों की अच्छी तरह समीक्षा करें। अगले अध्याय 6 यानी इंटरेस्ट रेट फ्यूचर्स में हम ट्रेजरी बॉन्ड और यूरोडॉलर हेजिंग सीखेंगे।
- on screen: Compact 8-rule overview and transition to Chapter 6

