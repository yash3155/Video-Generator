# Chapter 5 Part 1

## Scene 0: The Replication Engine: No-Arbitrage Over Forecasting

_Problem-first hook showing forward prices depend on replication cost, not spot forecasts_

**s00b1** (novice; facts F01)

- en: Do forward quotes simply reflect what traders expect a stock to be worth next year?
- hi: क्या फॉरवर्ड कोट्स केवल यह बताते हैं कि ट्रेडर्स को अगले साल स्टॉक की कीमत कितनी लगती है?
- on screen: Novice asks if forward quotes are spot forecasts

**s00b2** (mentor; facts F01, F03)

- en: Desks lose millions believing that myth. On institutional floors, forward prices depend strictly on today's replication cost, never speculative forecasts.
- hi: इस भ्रम के कारण डेस्क लाखों डॉलर गंवा देते हैं। संस्थागत स्तर पर फॉरवर्ड कीमतें सट्टेबाजी के बजाय आज की रेप्लिकेशन कॉस्ट पर निर्भर करती हैं।
- on screen: Mentor exposes forecasting myth vs replication cost

**s00b3** (mentor; facts F04)

- en: This discipline rests on arbitrage, which means locking guaranteed riskless profit whenever equivalent portfolios trade at different prices.
- hi: यह अनुशासन आर्बिट्राज पर टिका है, जिसका अर्थ है समान कैश फ्लो वाले पोर्टफोलियो के अलग-अलग दाम होने पर बिना जोखिम मुनाफा कमाना।
- on screen: Define arbitrage clearly on first mention

**s00b4** (mentor; facts F01, F03, F06)

- en: In Part 1, we master investment versus consumption bounds, non-income forward pricing, dividend adjustments, and contract valuation.
- hi: पार्ट 1 में हम इन्वेस्टमेंट बनाम कंजम्प्शन सीमाएं, नॉन-इनकम फॉरवर्ड प्राइसिंग, डिविडेंड एडजस्टमेंट और कॉन्ट्रैक्ट वैल्यूएशन में महारत हासिल करेंगे।
- on screen: Preview Part 1 learning roadmap

## Scene 1: Investment Assets vs. Consumption Assets

_Contrast investment assets and consumption assets to explain two-sided vs upper bounds_

**s01b1** (mentor; facts F01)

- en: Before applying pricing formulas, John Hull classifies markets cleanly. An investment asset means an asset held purely for financial return, such as gold or stocks.
- hi: प्राइसिंग फॉर्मूले लगाने से पहले जॉन हल एसेट्स को बांटते हैं। इन्वेस्टमेंट एसेट का अर्थ है वह संपत्ति जिसे सोना या शेयर की तरह निवेश के लिए रखा जाता है।
- on screen: Define investment asset and highlight examples

**s01b2** (mentor; facts F01)

- en: Because investors hold these securities purely for wealth, traders can buy or borrow and sell them easily, enforcing tight two-sided parity.
- hi: चूंकि निवेशक इन्हें केवल मुनाफे के लिए रखते हैं, ट्रेडर्स इन्हें आसानी से खरीद या उधार लेकर बेच सकते हैं, जिससे सटीक समानता बनी रहती है।
- on screen: Explain short-selling ease on investment assets

**s01b3** (mentor; facts F02)

- en: By contrast, a consumption asset means a commodity like oil or corn held for industrial processing. Short-sale barriers leave only an upper bound.
- hi: इसके विपरीत, कंजम्प्शन एसेट का अर्थ है कच्चा तेल या मक्का जिसे उपयोग के लिए रखा जाता है। शॉर्ट सेलिंग कठिन होने से केवल ऊपरी सीमा लागू होती है।
- on screen: Define consumption asset and upper-bound arbitrage limit

## Scene 2: Short Selling Mechanics & Dividend Rules

_Causal chain of borrowing shares, paying intermediate dividends, and closing the short_

**s02b1** (mentor; facts F05)

- en: How do arbitrageurs profit when a forward quote looks too cheap? They use short selling, which means borrowing shares from a custodian to sell today.
- hi: जब फॉरवर्ड कीमत सस्ती हो, तो आर्बिट्राजर्स मुनाफा कैसे कमाते हैं? वे शॉर्ट सेलिंग करते हैं, जिसका अर्थ है कस्टोडियन से शेयर उधार लेकर आज बेचना।
- on screen: Trigger condition and define short selling

**s02b2** (mentor; facts F05)

- en: While the short position remains open, the cash proceeds earn risk-free interest, and the trader must pass every intermediate dividend back to the lender.
- hi: शॉर्ट पोजीशन खुले रहने तक, नकद राशि पर रिस्क-फ्री ब्याज मिलता है और ट्रेडर को हर अंतरिम डिविडेंड मूल ऋणदाता को वापस देना पड़ता है।
- on screen: Pass intermediate dividends back to original stock lender

**s02b3** (mentor; facts F05)

- en: At contract expiration, the trader buys shares through the forward contract and returns them to the lender, sealing riskless profit and restoring parity.
- hi: कॉन्ट्रैक्ट समाप्त होने पर ट्रेडर फॉरवर्ड कॉन्ट्रैक्ट से शेयर लेकर ऋणदाता को लौटा देता है, जिससे बिना जोखिम मुनाफा और सही कीमत सुनिश्चित होती है।
- on screen: Return shares and close short position at maturity

## Scene 3: Core Forward Formula: Non-Income Assets

_Derive F0 = S0 exp(rT) and define cash-and-carry arbitrage_

**s03b1** (mentor; facts F03)

- en: For an investment asset paying no income, the fair forward price F zero equals today's spot price S zero multiplied by e to the r T.
- hi: बिना इनकम वाले इन्वेस्टमेंट एसेट के लिए, सही फॉरवर्ड प्राइस एफ जीरो बराबर आज का स्पॉट प्राइस एस जीरो गुणा ई की पावर आर टी होता है।
- on screen: Present non-income formula F0 = S0 exp(rT)

**s03b2** (mentor; facts F04)

- en: If a quoted forward trades above this fair benchmark, desks trigger cash-and-carry arbitrage, which means borrowing cash, buying spot, and shorting the overpriced forward.
- hi: यदि बाजार कोट इस स्तर से ऊपर ट्रेड करे, तो डेस्क कैश-एंड-कैरी आर्बिट्राज करते हैं, जिसका अर्थ है उधार लेकर स्पॉट खरीदना और महंगा फॉरवर्ड बेचना।
- on screen: Define cash-and-carry arbitrage condition

**s03b3** (mentor; facts F04)

- en: Delivering the purchased asset settles the short forward, repays the risk-free loan completely, and leaves pure riskless cash profit.
- hi: खरीदे गए एसेट की डिलीवरी से शॉर्ट फॉरवर्ड सेटल होता है, लोन पूरा चुकता है और बिना किसी जोखिम के शुद्ध नकद मुनाफा बचता है।
- on screen: Explain riskless arbitrage settlement

## Scene 4: Worked Example: Dividend-Adjusted Forward Price

_Compute exact 1-year forward price on a dividend-paying stock with prediction prompt_

**s04b1** (mentor; facts F06, F10)

- en: Let us compute a real forward quote. Suppose a stock trades at $60.00, expected dividends have present value $2.00, and the continuous risk-free rate is 5.0% for 1 year.
- hi: आइए एक वास्तविक फॉरवर्ड कोट की गणना करें। मान लीजिए एक स्टॉक $60.00 पर ट्रेड कर रहा है, डिविडेंड की प्रेजेंट वैल्यू $2.00 है और रिस्क-फ्री दर 1 वर्ष के लिए 5.0% है।
- on screen: Present inputs S0=$60, I=$2, r=5.0%, T=1

**s04b2** (mentor; facts F06, F10)

- en: Before multiplying by our compounding factor, pause and predict: why must we subtract the $2.00 dividend from the $60.00 spot price first?
- hi: कम्पाउंडिंग फैक्टर से गुणा करने से पहले सोचें और अनुमान लगाएं: हमें पहले $60.00 स्पॉट प्राइस में से $2.00 डिविडेंड क्यों घटाना होगा?
- on screen: Prediction prompt on dividend deduction step

**s04b3** (mentor; facts F06, F10)

- en: Because forward buyers receive no cash dividends before delivery. Deducting $2.00 yields $58.00 net spot investment, and compounding 1 year at 5.0% gives exactly $60.97.
- hi: क्योंकि फॉरवर्ड खरीदार को डिलीवरी से पहले कोई डिविडेंड नहीं मिलता। $2.00 घटाने पर शुद्ध निवेश $58.00 बचता है, जिसे 5.0% पर 1 वर्ष कम्पाउंड करने से ठीक $60.97 मिलता है।
- on screen: Reveal final fair price $60.97 and conclusion

## Scene 5: Reverse Cash-and-Carry: Lower Bound Flow

_Trace step-by-step reverse cash-and-carry arbitrage when F0 < S0 exp(rT)_

**s05b1** (mentor; facts F05)

- en: When market forwards trade too cheaply below fair value, desks run reverse cash-and-carry, which means shorting the spot stock and buying the underpriced forward.
- hi: जब फॉरवर्ड बाजार में सही मूल्य से सस्ता ट्रेड करे, तो डेस्क रिवर्स कैश-एंड-कैरी करते हैं, जिसका अर्थ है स्पॉट स्टॉक शॉर्ट करना और सस्ता फॉरवर्ड खरीदना।
- on screen: Define reverse cash-and-carry trade initiation

**s05b2** (mentor; facts F05)

- en: First, short sell the spot asset to collect S zero today and invest those proceeds at risk-free rate r while buying the forward contract.
- hi: पहले स्पॉट एसेट शॉर्ट सेल करके आज एस जीरो नकद प्राप्त करें और उस राशि को रिस्क-फ्री दर आर पर निवेश कर फॉरवर्ड कॉन्ट्रैक्ट खरीदें।
- on screen: Lend short proceeds and go long forward

**s05b3** (mentor; facts F05)

- en: At maturity, the growing cash account pays the low forward price to retrieve the shares, return them to the lender, and pocket a riskless profit.
- hi: मेच्योरिटी पर बढ़ा हुआ नकद खाता कम फॉरवर्ड दाम चुकाकर शेयर वापस लेता है, ऋणदाता को लौटाता है और बिना जोखिम मुनाफा सुरक्षित रखता है।
- on screen: Show settlement surplus forcing lower parity

## Scene 6: Known Cash Income & Continuous Dividend Yield

_Compare discrete dividend PV adjustment I against continuous dividend yield q_

**s06b1** (mentor; facts F06)

- en: For single stocks with known payout dates, we subtract discrete cash present value I directly from spot price S zero before compounding.
- hi: निश्चित डिविडेंड तारीख वाले स्टॉक्स के लिए, हम कम्पाउंडिंग से पहले स्पॉट प्राइस एस जीरो में से नकद डिविडेंड की प्रेजेंट वैल्यू आई घटाते हैं।
- on screen: Contrast discrete dividend PV deduction formula

**s06b2** (mentor; facts F07)

- en: For equity indexes, continuous dividend yield means a steady annualized payout stream that reduces net financing cost to rate r minus q.
- hi: बड़े इक्विटी इंडेक्स के लिए कंटीन्यूअस डिविडेंड यील्ड का अर्थ है पूरे वर्ष क्यू दर से मिलने वाला सतत डिविडेंड प्रवाह।
- on screen: Define continuous dividend yield and net carry (r - q)

**s06b3** (mentor; facts F07)

- en: Notice that holding the spot index captures dividend yield q while saving interest r. Whenever q exceeds r, forward prices trade below spot.
- hi: ध्यान दें कि स्पॉट इंडेक्स रखने पर डिविडेंड यील्ड क्यू मिलता है। जब भी क्यू दर आर से अधिक होती है, फॉरवर्ड कीमत स्पॉट से कम रहती है।
- on screen: Show backwardation condition when dividend yield q > r

## Scene 7: Delivery Price K vs. Contract Value f

_Distinguish contractual delivery price K, market forward F0, and mark-to-market value f_

**s07b1** (mentor; facts F08)

- en: Every practitioner must separate delivery price from paper value. Delivery price K means the fixed contractual price locked when you sign the forward agreement.
- hi: हर ट्रेडर को डिलीवरी प्राइस और पेपर वैल्यू में अंतर समझना चाहिए। डिलीवरी प्राइस के का अर्थ है कॉन्ट्रैक्ट साइन करते समय तय की गई निश्चित कीमत।
- on screen: Define delivery price K and inception f = 0

**s07b2** (mentor; facts F08)

- en: At initiation, K equals F zero so both parties enter freely at zero cost. Later, market spot shifts change new forward quote F zero.
- hi: शुरुआत में के और एफ जीरो बराबर होने से कॉन्ट्रैक्ट बिना किसी लागत के शुरू होता है। बाद में स्पॉट बदलने पर नया फॉरवर्ड कोट एफ जीरो बदल जाता है।
- on screen: Show market forward quote divergence over time

**s07b3** (mentor; facts F08)

- en: Contract value f means the mark-to-market worth of that existing contract today, computed by discounting F zero minus K back at the risk-free rate.
- hi: कॉन्ट्रैक्ट वैल्यू एफ का अर्थ है उस पुराने कॉन्ट्रैक्ट का आज का बाजार मूल्य, जिसे एफ जीरो माइनस के को रिस्क-फ्री दर से डिस्काउंट करके निकाला जाता है।
- on screen: Define contract value f and show valuation formula

## Scene 8: Misconceptions & Deterministic vs. Stochastic Rates

_Contrast novice pricing myths against no-arbitrage replication and forward-futures convergence_

**s08b1** (mentor; facts F03, F08)

- en: A common novice trap treats forward quotes as market forecasts or confuses locked delivery price K with mark-to-market contract value f.
- hi: नौसिखियों का एक आम भ्रम फॉरवर्ड कोट को भविष्य की कीमत का अनुमान मानना या तय डिलीवरी प्राइस के को कॉन्ट्रैक्ट वैल्यू एफ समझ लेना है।
- on screen: Highlight common novice misconceptions on left split panel

**s08b2** (mentor; facts F11)

- en: In institutional reality, replication cost governs forward quotes directly, and John Hull proves that forward and futures prices equal one another when interest rates are constant.
- hi: वास्तविकता में, रेप्लिकेशन कॉस्ट फॉरवर्ड कोट्स तय करती है और जॉन हल साबित करते हैं कि ब्याज दरें स्थिर होने पर फॉरवर्ड व फ्यूचर्स कीमतें बराबर होती हैं।
- on screen: Contrast institutional no-arbitrage reality on right panel

**s08b3** (mentor; facts F11)

- en: Futures diverge marginally from forwards only when asset price changes correlate strongly with interest rate reinvestment rates during daily settlement.
- hi: फ्यूचर्स की कीमतें फॉरवर्ड से तभी थोड़ा अलग होती हैं जब एसेट की कीमत में बदलाव दैनिक सेटलमेंट की ब्याज दरों से गहरा संबंध रखता हो।
- on screen: Reveal verdict on stochastic rate correlation divergence

## Scene 9: Active Recall: Detecting Cash-and-Carry Arbitrage

_3-beat interactive quiz calculating arbitrage profit on a $100 stock quoted at $108.00_

**s09b1** (mentor; facts F09)

- en: Test your replication instincts. A non-dividend stock trades at $100 with a 5.0% continuous risk-free rate, while its 1-year forward quotes at $108.00. Which trade wins?
- hi: अपनी समझ परखें। एक नॉन-डिविडेंड स्टॉक $100 पर है और रिस्क-फ्री दर 5.0% है, जबकि 1-वर्ष का फॉरवर्ड $108.00 पर कोट है। सही ट्रेड क्या होगा?
- on screen: Quiz question phase presenting arbitrage setup

**s09b2** (mentor; facts F04, F09)

- en: Pause and calculate first: compare today's compounded spot cost against the $108.00 forward quote, then decide which leg to buy and which to sell.
- hi: रुकें और गणना करें: आज की कम्पाउंडेड स्पॉट कॉस्ट की तुलना $108.00 फॉरवर्ड कोट से करें और सही विकल्प चुनें।
- on screen: Thinking timer phase while learner computes fair forward

**s09b3** (mentor; facts F04, F09)

- en: Option A is correct. Fair forward value is $105.13, so $108.00 is overpriced. Borrow $100, buy spot, and short forward at $108.00 to lock $2.87 riskless profit.
- hi: विकल्प ए सही है। सही फॉरवर्ड मूल्य $105.13 है, इसलिए $108.00 महंगा है। $100 उधार लेकर स्पॉट खरीदें और $108.00 पर शॉर्ट फॉरवर्ड बेचकर $2.87 मुनाफा कमाएं।
- on screen: Reveal Option A with $105.13 and $2.87 explanation

## Scene 10: Replication Synthesis & Bridge to Part 2

_Synthesize Part 1 valuation principles and bridge forward to Chapter 5 Part 2 macro assets_

**s10b1** (mentor; facts F01, F03, F04)

- en: Institutional replication discipline sets strict arbitrage bounds: two-sided equality governs stocks, while physical commodities obey only upper forward ceilings.
- hi: संस्थागत रेप्लिकेशन अनुशासन सख्त आर्बिट्राज सीमाएं तय करता है: शेयरों पर दोतरफा समानता लागू होती है, जबकि कमोडिटीज पर केवल ऊपरी सीमा रहती है।
- on screen: Highlight replication discipline synthesis

**s10b2** (mentor; facts F06, F07, F08)

- en: Cash dividends and continuous yields lower net carrying costs, while mark-to-market value f tracks paper gains against your initial delivery price K.
- hi: नकद डिविडेंड और सतत यील्ड कैरी कॉस्ट घटाते हैं, जबकि मार्क-टू-मार्केट वैल्यू एफ शुरुआती डिलीवरी प्राइस के की तुलना में पेपर मुनाफा मापती है।
- on screen: Highlight dividend adjustment and value tracking

**s10b3** (mentor; facts F07)

- en: Next in Part 2, we apply these tools to macro markets: stock index arbitrage, Covered Interest Parity for foreign currencies, and commodity storage with convenience yield.
- hi: आगे पार्ट 2 में, हम इन सिद्धांतों को मैक्रो बाजारों पर लागू करेंगे: स्टॉक इंडेक्स आर्बिट्राज, फॉरेन करेंसी के लिए कवर्ड इंटरेस्ट पैरिटी और कमोडिटी स्टोरेज।
- on screen: Highlight Part 2 forward bridge on roadmap

## Scene 11: Summary Thread: Eight Rules of Forward Valuation

_Fixed 6-beat summary codifying all 8 core forward pricing rules taught in Part 1_

**s11b1** (mentor; facts F01)

- en: Let us lock in the eight foundational rules of forward valuation from Part 1 before exploring global macro markets in Part 2.
- hi: पार्ट 2 में मैक्रो बाजारों को समझने से पहले आइए पार्ट 1 के फॉरवर्ड वैल्यूएशन के आठ बुनियादी नियमों को पक्का करें।
- on screen: Overview header of 8 forward valuation rules

**s11b2** (mentor; facts F01, F02)

- en: Rule 1 prices forwards by replication cost rather than subjective forecasts. Rule 2 enforces two-sided equality for investment assets and upper bounds for consumption assets.
- hi: नियम 1 फॉरवर्ड को अनुमान के बजाय रेप्लिकेशन कॉस्ट से आंकता है। नियम 2 इन्वेस्टमेंट एसेट्स पर दोतरफा समानता और कंजम्प्शन एसेट्स पर ऊपरी सीमा लागू करता है।
- on screen: Rules 1 and 2 displayed side by side

**s11b3** (mentor; facts F05, F03)

- en: Rule 3 reminds short sellers to return all intermediate dividends to lenders. Rule 4 sets non-income forward prices via F zero equals S zero exp(rT).
- hi: नियम 3 शॉर्ट सेलर्स को अंतरिम डिविडेंड ऋणदाता को लौटाने का निर्देश देता है। नियम 4 बिना आय वाले एसेट्स के लिए एफ जीरो बराबर एस जीरो ई की पावर आरटी तय करता है।
- on screen: Rules 3 and 4 displayed side by side

**s11b4** (mentor; facts F04, F06, F07)

- en: Rule 5 pairs cash-and-carry against overpriced quotes with reverse carry against cheap quotes. Rule 6 deducts cash dividend present value I or continuous yield q from financing.
- hi: नियम 5 महंगे कोट्स पर कैश-एंड-कैरी और सस्ते कोट्स पर रिवर्स कैरी लागू करता है। नियम 6 कैरी से नकद डिविडेंड वैल्यू आई या यील्ड क्यू घटाता है।
- on screen: Rules 5 and 6 displayed side by side

**s11b5** (mentor; facts F08, F11)

- en: Rule 7 computes contract value f from discounted F zero minus K, starting at zero. Rule 8 confirms constant rates make forward and futures prices equal.
- hi: नियम 7 कॉन्ट्रैक्ट वैल्यू एफ को डिस्काउंटेड एफ जीरो माइनस के से निकालता है। नियम 8 पुष्टि करता है कि स्थिर दरों पर फॉरवर्ड और फ्यूचर्स कीमतें बराबर होती हैं।
- on screen: Rules 7 and 8 displayed side by side

**s11b6** (mentor; facts F01, F04, F08)

- en: Keep all 8 rules ready. In Part 2 next, we scale this engine to index arbitrage, Covered Interest Parity in currencies, and commodity storage costs.
- hi: इन सभी 8 नियमों को याद रखें। अगले पार्ट 2 में हम इस मॉडल को इंडेक्स आर्बिट्राज, फॉरेन करेंसी में कवर्ड इंटरेस्ट पैरिटी और कमोडिटी स्टोरेज तक बढ़ाएंगे।
- on screen: Compact overview of all 8 rules + Part 2 preview

