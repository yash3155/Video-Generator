# Interest Rate Mechanics, Zero Curves & The Bootstrap Method

## Scene 0: The Single Rate Trap

_Hook: The single-rate discount trap and the real-world demand for zero curves_

**s00b1** (novice; facts F01, F06)

- en: How can a bank price a multi-year corporate derivative contract when cash flows stretch across ten years? Can we simply discount every cash flow using a single yield to maturity?
- hi: जब किसी बैंक को दस साल में फैले कैश फ्लो वाले कॉर्पोरेट डेरिवेटिव की कीमत तय करनी हो, तो क्या हम सभी कैश फ्लो को केवल एक ही यील्ड टू मैच्योरिटी से डिस्काउंट कर सकते हैं?
- on screen: Opening novice struggle: pricing 10-year cash flows with single flat yield

**s00b2** (mentor; facts F06)

- en: A novice analyst might use a single yield to maturity, but that is a dangerous trap. Yield to maturity is a single internal rate that assumes flat interest rates across all maturities.
- hi: एक नौसिखिया विश्लेषक एकल यील्ड टू मैच्योरिटी का उपयोग कर सकता है, लेकिन यह एक खतरनाक जाल है। यील्ड टू मैच्योरिटी वह एकल आंतरिक दर है जो सभी मैच्योरिटी पर फ्लैट ब्याज दरें मानती है।
- on screen: Mentor response: flat yield to maturity assumption causes severe pricing distortion

**s00b3** (novice; facts F06)

- en: What goes wrong when yield curves slope upward? Do arbitrage traders exploit the pricing mismatch and create severe trading losses for the bank?
- hi: जब यील्ड कर्व ऊपर की ओर ढलान वाला होता है तो क्या गलत होता है? क्या आर्बिट्राज ट्रेडर कीमत के इस अंतर का फायदा उठाकर बैंक को भारी नुकसान पहुंचाते हैं?
- on screen: Novice question: arbitrage exploitation and trading losses on upward curves

**s00b4** (mentor; facts F01, F08)

- en: Yes, severe losses occur. A Treasury rate is the interest rate a government pays to borrow its currency without default. Desks construct the spot zero curve using sovereign Treasury rates and recursive bootstrapping techniques.
- hi: हाँ, भारी नुकसान होता है। ट्रेजरी रेट वह ब्याज दर है जो सरकार बिना डिफॉल्ट के अपनी मुद्रा उधार लेने के लिए चुकाती है। डेस्क सॉवरेन ट्रेजरी रेट्स और रिकर्सिव बूटस्ट्रैपिंग से स्पॉट जीरो कर्व बनाते हैं।
- on screen: Show resolution: constructing sovereign zero curve from Treasury rates

## Scene 1: Discrete vs Continuous Compounding

_Tension: Discrete compounding conventions versus continuous compounding mathematical reality_

**s01b1** (narrator; facts F02)

- en: Commercial banks quote interest on a discrete compounding basis. Discrete compounding means interest is calculated and added at fixed calendar intervals like semiannually or monthly.
- hi: कमर्शियल बैंक डिस्क्रीट कंपाउंडिंग के आधार पर ब्याज कोट करते हैं। डिस्क्रीट कंपाउंडिंग का मतलब है कि ब्याज अर्धवार्षिक या मासिक जैसे निश्चित कैलेंडर अंतरालों पर जोड़ा जाता है।
- on screen: Show commercial banking discrete compounding intervals on a calendar timeline

**s01b2** (narrator; facts F02)

- en: In derivatives modeling, financial economists require continuous compounding. Continuous compounding means interest is added continuously at every infinitesimal fraction of a second.
- hi: डेरिवेटिव्स मॉडलिंग में वित्तीय अर्थशास्त्रियों को कंटीन्यूअस कंपाउंडिंग की आवश्यकता होती है। कंटीन्यूअस कंपाउंडिंग का मतलब है कि ब्याज हर पल लगातार जुड़ता रहता है।
- on screen: Show analytical continuous compounding curve smoothly expanding terminal value

**s01b3** (narrator; facts F03)

- en: Can we switch seamlessly between discrete banking quotes and continuous quantitative formulas? The natural logarithm provides an exact mathematical bridge between both worlds.
- hi: क्या हम डिस्क्रीट बैंकिंग कोट्स और कंटीन्यूअस क्वांटिटेटिव फॉर्मूलों के बीच आसानी से स्विच कर सकते हैं? नेचुरल लॉगरिदम दोनों दुनिया के बीच एक सटीक गणितीय पुल प्रदान करता है।
- on screen: Show mathematical conversion bridge linking discrete rates to continuous rates

## Scene 2: Four Pillars of Interest Rate Mechanics

_Pillars: The Four Pillars of Interest Rate Mechanics: Rates, Compounding, Zero Curve, and Forward Rates_

**s02b1** (narrator; facts F01)

- en: Pillar 1 establishes benchmark rates. Sovereign Treasury rates reflect default-free borrowing, while the repo rate is collateralized borrowing secured by government debt securities.
- hi: पहला पिलर बेंचमार्क दरों को स्थापित करता है। सॉवरेन ट्रेजरी दरें डिफॉल्ट-मुक्त उधार को दर्शाती हैं, जबकि रेपो रेट सरकारी ऋण प्रतिभूतियों द्वारा सुरक्षित उधार दर है।
- on screen: Card 1: Benchmark Rates showing Treasury rates and repo rate collateralization

**s02b2** (narrator; facts F04)

- en: Pillar 2 defines continuous discounting. A discount factor is the current value today of one dollar received at a future date. Present cash flow values multiply future payments by exponential discount factor e to the power minus R T.
- hi: दूसरा पिलर कंटीन्यूअस डिस्काउंटिंग को परिभाषित करता है। डिस्काउंट फैक्टर भविष्य की तारीख पर मिलने वाले एक डॉलर का आज का वर्तमान मूल्य है। वर्तमान कैश फ्लो मूल्य भविष्य के भुगतानों को घातीय डिस्काउंट फैक्टर e की घात माइनस R T से गुणा करते हैं।
- on screen: Card 2: Continuous Discounting showing exponential discount factor PV = B * e^(-RT)

**s02b3** (narrator; facts F05, F08)

- en: Pillar 3 constructs the zero curve. A zero rate is the return on an investment with no intermediate coupons, extracted recursively from coupon bonds using bootstrapping.
- hi: तीसरा पिलर जीरो कर्व का निर्माण करता है। जीरो रेट बिना किसी मध्यवर्ती कूपन के निवेश पर रिटर्न है, जिसे बूटस्ट्रैपिंग का उपयोग करके कूपन बॉन्ड से निकाला जाता है।
- on screen: Card 3: Zero Curve showing zero rate spot yields stripped from bond prices

**s02b4** (narrator; facts F09)

- en: Pillar 4 derives forward rates. A forward rate is the future interest rate implied today by zero rates for borrowing between two upcoming dates.
- hi: चौथा पिलर फॉरवर्ड दरों को प्राप्त करता है। फॉरवर्ड रेट दो आने वाली तारीखों के बीच उधार लेने के लिए आज जीरो दरों द्वारा निहित भविष्य की ब्याज दर है।
- on screen: Card 4: Forward Rates showing future implied interest rate extraction

## Scene 3: Continuous Compounding Mechanics

_Formula: Continuous compounding and present value discount factors_

**s03b1** (narrator; facts F03)

- en: Let us examine the conversion formula. To transform a rate R m compounded m times into continuous rate R c, we calculate m times the natural logarithm of one plus R m over m.
- hi: आइए रूपांतरण सूत्र की जांच करें। m बार कंपाउंड की गई दर R m को कंटीन्यूअस दर R c में बदलने के लिए, हम m गुना एक प्लस R m बटे m के नेचुरल लॉग की गणना करते हैं।
- on screen: Show formula breakdown for continuous rate conversion R_c = m * ln(1 + R_m / m)

**s03b2** (narrator; facts F11)

- en: Consider a concrete numerical example. A bank quotes an annual rate of 10% compounded semiannually, meaning frequency m equals 2. The periodic six-month rate is 5%.
- hi: एक ठोस संख्यात्मक उदाहरण पर विचार करें। एक बैंक अर्धवार्षिक रूप से 10% वार्षिक दर कोट करता है, जिसका अर्थ है आवृत्ति m 2 के बराबर है। छह महीने की दर 5% है।
- on screen: Display given numbers: R_m = 0.10, compounding frequency m = 2, periodic rate 1.05

**s03b3** (narrator; facts F02, F11)

- en: Taking 2 times the natural logarithm of 1.05 gives 0.09758, or 9.758%. Compounding continuously requires a lower stated interest rate to achieve the exact same final balance.
- hi: 1.05 का नेचुरल लॉग लेकर 2 से गुणा करने पर 0.09758, यानी 9.758% प्राप्त होता है। समान अंतिम बैलेंस प्राप्त करने के लिए कंटीन्यूअस कंपाउंडिंग में कम दर की आवश्यकता होती है।
- on screen: Show calculated result: R_c = 0.09758 (9.758%) with terminal value equality

## Scene 4: Causal Architecture of the Bootstrap

_Causal Chain: The recursive Bootstrap method for stripping coupons_

**s04b1** (narrator; facts F06)

- en: The market presents coupon bond prices across maturities. Because each bond pays periodic coupons, market prices bundle multiple maturities into one package.
- hi: बाजार विभिन्न मैच्योरिटी के कूपन बॉन्ड की कीमतें पेश करता है। चूंकि प्रत्येक बॉन्ड समय-समय पर कूपन का भुगतान करता है, बाजार कीमतें कई मैच्योरिटी को एक पैकेज में बंडल करती हैं।
- on screen: Node 1: Market bond prices observed containing bundled periodic cash flows

**s04b2** (narrator; facts F08)

- en: The bootstrap algorithm strips prior known coupon cash flows recursively. Each intermediate coupon is discounted using the previously solved zero rates.
- hi: बूटस्ट्रैप एल्गोरिदम पहले से ज्ञात कूपन कैश फ्लो को रिकर्सिव तरीके से अलग करता है। प्रत्येक मध्यवर्ती कूपन को पहले हल किए गए जीरो रेट्स का उपयोग करके डिस्काउंट किया जाता है।
- on screen: Node 2: Recursive coupon stripping discounting earlier payments with known zero rates

**s04b3** (narrator; facts F06, F08)

- en: Subtracting discounted coupons isolates the final principal and interest. We solve directly for the next zero rate, unlocking accurate pricing across all corporate derivatives.
- hi: डिस्काउंटेड कूपन घटाने से अंतिम मूलधन और ब्याज अलग हो जाता है। हम सीधे अगले जीरो रेट को हल करते हैं, जिससे सभी कॉर्पोरेट डेरिवेटिव्स की सटीक कीमत संभव हो जाती है।
- on screen: Node 3: Final cash flow isolated to solve next zero rate and complete spot curve

## Scene 5: Bootstrapping Treasury Zero Rates

_Worked Example: Bootstrapping Treasury zero rates from bill and coupon bond prices_

**s05b1** (narrator; facts F08, F12)

- en: Let us bootstrap the six-month zero rate from a Treasury bill. A Treasury bill is a short-term government debt security that pays no regular coupon. A bill with face value 100 dollars and maturity 0.5 years trades at 97.50 dollars.
- hi: आइए ट्रेजरी बिल से छह महीने के जीरो रेट को बूटस्ट्रैप करें। ट्रेजरी बिल एक शॉर्ट-टर्म सरकारी ऋण प्रतिभूति है जो कोई नियमित कूपन नहीं देती है। 100 डॉलर फेस वैल्यू और 0.5 वर्ष मैच्योरिटी वाला बिल 97.50 डॉलर पर ट्रेड करता है।
- on screen: Show given bill parameters: Price = 97.50, Face = 100, Maturity T = 0.5 years

**s05b2** (narrator; facts F04, F12)

- en: Setting price 97.50 equal to 100 times e to the power minus 0.5 R yields discount ratio 0.975. Taking natural logarithm and dividing by minus 0.5 solves for rate R.
- hi: कीमत 97.50 को 100 गुना e की घात माइनस 0.5 R के बराबर रखने पर डिस्काउंट रेश्यो 0.975 प्राप्त होता है। नेचुरल लॉग लेकर माइनस 0.5 से भाग देने पर दर R प्राप्त होती है।
- on screen: Step 1: Compute ratio 0.975 and apply continuous rate formula -ln(0.975) / 0.5

**s05b3** (narrator; facts F05, F12)

- en: The continuously compounded six-month zero rate equals 0.05064, or 5.064%. This exact rate now discounts six-month coupons on all longer-dated coupon bonds.
- hi: कंटीन्यूअसली कंपाउंडेड छह महीने की जीरो दर 0.05064, यानी 5.064% के बराबर है। यह सटीक दर अब लंबी अवधि के कूपन बॉन्ड पर छह महीने के कूपन को डिस्काउंट करती है।
- on screen: Result: 6-month zero rate = 0.05064 (5.064%) used to discount subsequent coupons

## Scene 6: Flat YTM vs Spot Zero Curve

_Misconception: Flat Yield to Maturity versus the true zero curve_

**s06b1** (narrator; facts F06)

- en: A common novice misconception assumes that discounting all cash flows with a single flat yield to maturity accurately prices fixed income instruments.
- hi: एक आम नौसिखिया गलत धारणा यह मानती है कि सभी कैश फ्लो को एक ही फ्लैट यील्ड टू मैच्योरिटी से डिस्काउंट करने से सही कीमत मिलती है।
- on screen: Novice trap panel: Flat Yield to Maturity assumption applied across all tenors

**s06b2** (narrator; facts F05, F06)

- en: In reality, each coupon cash flow must be discounted at the unique spot zero rate matching its exact maturity. Yield to maturity is merely a weighted average.
- hi: वास्तव में प्रत्येक कूपन कैश फ्लो को उसकी सटीक मैच्योरिटी से मेल खाने वाले अद्वितीय स्पॉट जीरो रेट पर डिस्काउंट किया जाना चाहिए। यील्ड टू मैच्योरिटी केवल एक भारित औसत है।
- on screen: Professional reality panel: Unique zero rates discounting each cash flow independently

**s06b3** (narrator; facts F07)

- en: The par yield is the coupon rate that makes the bond price equal to face value. Par yields reflect the shape of the zero curve without replacing spot rates.
- hi: पार यील्ड वह कूपन दर है जो बॉन्ड की कीमत को फेस वैल्यू के बराबर बनाती है। पार यील्ड स्पॉट दरों की जगह लिए बिना जीरो कर्व के आकार को दर्शाती है।
- on screen: Show Par Yield definition F07 and comparison with spot zero curve

## Scene 7: Extracting Implied Forward Rates

_Formula Breakdown: Implied forward interest rate calculation_

**s07b1** (narrator; facts F09)

- en: Forward rates represent borrowing costs implied between future dates T 1 and T 2. The formula calculates R 2 times T 2 minus R 1 times T 1, divided by T 2 minus T 1.
- hi: फॉरवर्ड दरें भविष्य की तारीखों T 1 और T 2 के बीच निहित उधार लागत का प्रतिनिधित्व करती हैं। फॉर्मूला R 2 गुना T 2 माइनस R 1 गुना T 1, बटे T 2 माइनस T 1 की गणना करता है।
- on screen: Formula breakdown: R_F = (R_2*T_2 - R_1*T_1) / (T_2 - T_1)

**s07b2** (narrator; facts F09, F10)

- en: If the 1-year zero rate is 3% and the 2-year zero rate is 4%, what must the 1-year forward rate starting at year 1 be? The numerator is 0.04 times 2 minus 0.03 times 1.
- hi: यदि 1-वर्ष की जीरो दर 3% है और 2-वर्ष की जीरो दर 4% है, तो वर्ष 1 से शुरू होने वाली 1-वर्षीय फॉरवर्ड दर क्या होनी चाहिए? अंश 0.04 गुना 2 माइनस 0.03 गुना 1 है।
- on screen: Prediction Question: Calculate forward rate with R_1 = 3%, T_1 = 1, R_2 = 4%, T_2 = 2

**s07b3** (narrator; facts F10)

- en: Subtracting 0.03 from 0.04 times 2 leaves 0.05, and dividing by 1 year gives exactly 5.0%. The forward rate must be 5.0% to prevent profitable multi-year borrowing arbitrage.
- hi: 0.04 गुना 2 में से 0.03 घटाने पर 0.05 बचता है, और 1 वर्ष से भाग देने पर ठीक 5.0% प्राप्त होता है। बहु-वर्षीय आर्बिट्राज को रोकने के लिए फॉरवर्ड दर 5.0% होनी चाहिए।
- on screen: Show reveal: Forward rate R_F = 5.0% with no-arbitrage proof

## Scene 8: Zero Rates vs Forward Curve

_Data Chart: The term structure relationship between forward rates and zero rates_

**s08b1** (narrator; facts F05, F09)

- en: When the zero curve slopes upward, implied forward rates must lie strictly above the zero curve. Each incremental year pulls up the cumulative average rate.
- hi: जब जीरो कर्व ऊपर की ओर ढलान वाला होता है, तो निहित फॉरवर्ड दरें निश्चित रूप से जीरो कर्व के ऊपर स्थित होनी चाहिए। प्रत्येक अतिरिक्त वर्ष संचयी औसत दर को ऊपर खींचता है।
- on screen: Display chart: Upward sloping zero curve with forward curve plotted strictly above it

**s08b2** (narrator; facts F10)

- en: At year 1 the zero rate is 3.0%, while at year 2 the zero rate rises to 4.0%. The implied forward rate for that second year reaches 5.0%.
- hi: वर्ष 1 पर जीरो दर 3.0% है, जबकि वर्ष 2 पर जीरो दर बढ़कर 4.0% हो जाती है। उस दूसरे वर्ष के लिए निहित फॉरवर्ड दर 5.0% तक पहुंच जाती है।
- on screen: Highlight data points: Year 1 at 3%, Year 2 at 4%, Forward rate Year 2 at 5%

**s08b3** (narrator; facts F09)

- en: Conversely, if the zero curve slopes downward, forward rates lie below zero rates. Understanding this geometric relationship is essential for bond portfolio management.
- hi: इसके विपरीत यदि जीरो कर्व नीचे की ओर ढलान वाला है, तो फॉरवर्ड दरें जीरो दरों से नीचे होती हैं। इस ज्यामितीय संबंध को समझना बॉन्ड पोर्टफोलियो प्रबंधन के लिए आवश्यक है।
- on screen: Contrast with inverted zero curve showing forward rate below spot rate

## Scene 9: Interactive Assessment

_Interactive Quiz: Testing forward rate calculation and compounding mechanics_

**s09b1** (narrator; facts F09, F10)

- en: Suppose a sovereign zero curve quotes a 1-year zero rate of 3.0% and a 2-year zero rate of 4.0%. What is the implied 1-year forward rate starting at year 1?
- hi: मान लीजिए कि एक सॉवरेन जीरो कर्व 1-वर्षीय जीरो दर 3.0% और 2-वर्षीय जीरो दर 4.0% कोट करता है। वर्ष 1 से शुरू होने वाली निहित 1-वर्षीय फॉरवर्ड दर क्या है?
- on screen: Quiz question presented with four options A to D in 2x2 grid

**s09b2** (narrator; facts F09)

- en: Pause and calculate the forward rate using the continuous formula. Multiply 4% by 2 years, subtract 3% times 1 year, and divide by the 1-year time difference.
- hi: रुकें और कंटीन्यूअस फॉर्मूले का उपयोग करके फॉरवर्ड दर की गणना करें। 4% को 2 साल से गुणा करें, 3% गुना 1 साल घटाएं, और 1 साल के अंतर से भाग दें।
- on screen: Thinking pause with countdown timer and visible formula hint

**s09b3** (narrator; facts F10)

- en: The correct answer is Option C: 5.0%. Subtracting 0.03 from 0.04 times 2 leaves 0.05, and dividing by 1 year yields exactly 5.0%, preventing arbitrage between consecutive investments.
- hi: सही उत्तर Option C: 5.0% है। 0.04 गुना 2 में से 0.03 घटाकर 1 से भाग देने पर ठीक 5.0% प्राप्त होता है, जो आर्बिट्राज को रोकता है।
- on screen: Reveal correct option: Option C (5.0%) highlights green with explanation

## Scene 10: Where We Are on the Journey

_Roadmap: Where we are on the interest rate mastery journey_

**s10b1** (narrator; facts F01, F08)

- en: We have mastered the foundational mechanics of interest rates. We progressed from Treasury benchmark rates to continuous discounting and recursive zero curve bootstrapping.
- hi: हमने ब्याज दरों के बुनियादी तंत्र में महारत हासिल कर ली है। हम ट्रेजरी बेंचमार्क दरों से कंटीन्यूअस डिस्काउंटिंग और रिकर्सिव जीरो कर्व बूटस्ट्रैपिंग की ओर बढ़े हैं।
- on screen: Roadmap step 1 to 3 completed: Benchmarks, Compounding, and Zero Curve Bootstrap

**s10b2** (narrator; facts F09)

- en: We also extracted forward interest rates from spot zero curves. These implied forward rates dictate fair pricing for forward rate agreements and multi-period interest rate swaps.
- hi: हमने स्पॉट जीरो कर्व्स से फॉरवर्ड ब्याज दरें भी निकाली हैं। ये निहित फॉरवर्ड दरें फॉरवर्ड रेट एग्रीमेंट्स और मल्टी-पीरियड इंटरेस्ट रेट स्वैप के लिए उचित मूल्य तय करती हैं।
- on screen: Roadmap step 4: Forward Rates unlocked for derivative pricing

**s10b3** (narrator; facts F01)

- en: In Part 2, we will apply these zero curves to Forward Rate Agreements, bond portfolio duration, convexity hedging, and theories of the term structure.
- hi: भाग 2 में, हम इन जीरो कर्व्स को फॉरवर्ड रेट एग्रीमेंट्स, बॉन्ड पोर्टफोलियो ड्यूरेशन, कन्वेक्सिटी हेजिंग और टर्म स्ट्रक्चर के सिद्धांतों पर लागू करेंगे।
- on screen: Bridge to Part 2: FRAs, Duration, Convexity, and Term Structure Theories

## Scene 11: The 8 Golden Rules

_Summary Thread: The 8 Golden Rules of Interest Rates and Zero Curves_

**s11b1** (narrator; facts F01)

- en: Here are the eight golden rules that govern interest rate mechanics, zero curves, and forward rate calculations in fixed income markets.
- hi: यहाँ आठ सुनहरे नियम हैं जो निश्चित आय बाजारों में ब्याज दर तंत्र, जीरो कर्व्स और फॉरवर्ड दर गणनाओं को नियंत्रित करते हैं।
- on screen: Summary header: The 8 Golden Rules of Interest Rates and Zero Curves

**s11b2** (narrator; facts F01, F02)

- en: Rule 1: Treasury rates represent default-free sovereign borrowing. Rule 2: Continuous compounding provides terminal value A times e to the power R n.
- hi: नियम 1: ट्रेजरी दरें डिफॉल्ट-मुक्त सॉवरेन उधार का प्रतिनिधित्व करती हैं। नियम 2: कंटीन्यूअस कंपाउंडिंग टर्मिनल मूल्य A गुना e की घात R n प्रदान करती है।
- on screen: Show Rule 1 (Treasury Rates) and Rule 2 (Continuous Compounding)

**s11b3** (narrator; facts F03, F04)

- en: Rule 3: Converting discrete rate R m to continuous rate R c uses m times natural logarithm of one plus R m over m. Rule 4: Present value discount factor is e to the power minus R T.
- hi: नियम 3: डिस्क्रीट दर को कंटीन्यूअस दर में बदलने के लिए m गुना नेचुरल लॉग का उपयोग किया जाता है। नियम 4: वर्तमान मूल्य डिस्काउंट फैक्टर e की घात माइनस R T है।
- on screen: Show Rule 3 (Rate Conversion) and Rule 4 (Discount Factors)

**s11b4** (narrator; facts F05, F07)

- en: Rule 5: Zero rates discount single cash flows with zero intermediate coupons. Rule 6: Par yield is the coupon rate causing bond price to equal face value.
- hi: नियम 5: जीरो दरें बिना किसी मध्यवर्ती कूपन के एकल कैश फ्लो को डिस्काउंट करती हैं। नियम 6: पार यील्ड वह कूपन दर है जिससे बॉन्ड की कीमत फेस वैल्यू के बराबर होती है।
- on screen: Show Rule 5 (Zero-Coupon Rates) and Rule 6 (Par Yields)

**s11b5** (narrator; facts F08, F09)

- en: Rule 7: The Bootstrap method strips prior coupons recursively to build the spot curve. Rule 8: Implied forward rates equal the difference in rate-time products over time difference.
- hi: नियम 7: बूटस्ट्रैप विधि स्पॉट कर्व बनाने के लिए पहले के कूपनों को रिकर्सिव तरीके से अलग करती है। नियम 8: निहित फॉरवर्ड दरें समय अंतर पर दर-समय उत्पादों के अंतर के बराबर होती हैं।
- on screen: Show Rule 7 (Bootstrap Stripping) and Rule 8 (Forward Rate Formula)

**s11b6** (narrator; facts F01, F08, F09)

- en: Review all eight rules from Rule 1 through Rule 8. Mastering these foundations prepares you to price complex derivatives, swaps, and manage interest rate risk.
- hi: नियम 1 से नियम 8 तक सभी आठ नियमों की समीक्षा करें। इन बुनियादी बातों में महारत हासिल करने से आप जटिल डेरिवेटिव्स और स्वैप्स की सही कीमत तय कर सकते हैं।
- on screen: Show full 8-rule summary grid from Rule 1 to Rule 8
