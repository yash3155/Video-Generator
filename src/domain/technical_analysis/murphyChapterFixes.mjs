// src/domain/technical_analysis/murphyChapterFixes.mjs
/**
 * Authoritative 100% Bespoke Chapter Rebuilder for the 9 Corrupted Murphy Chapters:
 * ch02_part1, ch03_part1, ch04_part1, ch04_part2, ch04_part3,
 * ch05_part1, ch05_part2, ch06_part1, ch06_part2
 * 
 * Rebuilds all 12 scenes with zero derivative leakage, matching the authentic facts
 * extracted from John J. Murphy's Technical Analysis of the Financial Markets.
 */

import fs from 'node:fs';
import path from 'node:path';

export const MURPHY_CHAPTER_SPECS = {
  ch02_part1: {
    chapter: "CHAPTER 2 · PART 1",
    chapterTitle: "DOW THEORY: THE 6 BASIC TENETS & 3 TREND CLASSIFICATIONS",
    hindiTitle: "डाउ थ्योरी: छह मूलभूत सिद्धांत और तीन ट्रेंड श्रेणियां",
    // Scene 0: Dilemma
    dilemma: {
      en_novice: "Marcus, why do so many retail traders buy stocks on record industrial earnings, only to watch the market roll over and crash?",
      hi_novice: "शर्मा जी! कई ट्रेडर्स रिकॉर्ड इंडस्ट्रियल अर्निंग्स पर शेयर खरीदते हैं, फिर भी बाजार अचानक पलटकर क्रैश क्यों हो जाता है?",
      en_mentor_setup: "Alex, in 1884 Charles Dow realized individual stock news is noise. He created two separate averages—Industrials and Railroads—to measure the true physical flow of the economy.",
      hi_mentor_setup: "राजू, 1884 में चार्ल्स डाउ ने समझा कि कंपनियों की खबरें भ्रामक हो सकती हैं। उन्होंने असल अर्थव्यवस्था को नापने के लिए इंडस्ट्रियल्स और रेलरोड्स के दो अलग सूचकांक बनाए।",
      en_mentor_trap: "The trap is divergence: factories produce goods, but if railroads stop shipping them, corporate earnings are a lagging illusion. A primary bear market begins silently before earnings drop!",
      hi_mentor_trap: "खतरा डाइवर्जेंस का है: फैक्ट्रियां माल बनाती हैं, लेकिन अगर रेलगाड़ियां उन्हें ढोना बंद कर दें, तो अर्निंग्स सिर्फ एक छलावा हैं। बिना रेल की पुष्टि के बड़ी गिरावट शुरू हो जाती है!",
      en_mentor_solution: "Dow established the Principle of Mutual Confirmation: Industrials and Transports must confirm each other. Watching both averages warns you weeks before the crash!",
      hi_mentor_solution: "डाउ ने आपसी पुष्टि (म्यूचुअल कन्फर्मेशन) का नियम बनाया: दोनों सूचकांकों को एक साथ नया हाई बनाना चाहिए, तभी तेजी सच मानी जाएगी!"
    },
    // Scene 1: Tug of War
    tug: {
      title: "Dow Industrials vs Dow Transportation Confirmation",
      leftTitle: "Unconfirmed Industrial Rally",
      rightTitle: "Dual Average Confirmation",
      leftLabel: "Retail Euphoria & Divergence",
      rightLabel: "Real Economic Volume Flow",
      centerTitle: "The Dow Divide"
    },
    // Scene 2: 4 Pillars
    pillars: [
      { title: "1. The Averages Discount Everything", desc: "Prices instantaneously assimilate all fundamental knowledge, rumors, and supply-demand forces.", badge: "First Principle" },
      { title: "2. The Three Trend Classifications", desc: "Primary trend is an ocean tide (>1 yr); secondary trends are waves (3 wks-3 mos); minor trends are ripples (<3 wks).", badge: "Trend Hierarchy" },
      { title: "3. Three Phases of Primary Trends", desc: "Accumulation by informed smart money, public participation by trend followers, and final distribution to the euphoric public.", badge: "Market Phases" },
      { title: "4. Mutual Confirmation & Volume", desc: "Dow Industrials and Transports must confirm each other; trading volume must definitively expand in the trend direction.", badge: "Confirmation" }
    ],
    // Scene 5: Formula
    formula: {
      title: "Dow Theory 50% Retracement Benchmark Formula",
      expression: "Retracement Target = Peak Price - 0.50 * (Peak Price - Trough Price)",
      latex: "P_{\\text{retrace}} = P_{\\text{peak}} - 0.50 \\cdot (P_{\\text{peak}} - P_{\\text{trough}})",
      variables: [
        { symbol: "P_{\\text{peak}}", label: "Primary Peak", description: "The highest high of the preceding bull market wave." },
        { symbol: "P_{\\text{trough}}", label: "Reaction Trough", description: "The lowest starting level of the primary advance." },
        { symbol: "0.50", label: "Retracement Benchmark", description: "Dow Theory's geometric rule: secondary corrections predictably retrace 33% to 66% (with 50% as the critical pivot)." }
      ]
    },
    // Scene 9: Quiz
    quiz: {
      question: "The Dow Jones Industrial Average hits a decisive new all-time high of 38,000 points. However, the Dow Jones Transportation Average fails to breach its previous swing high and forms a lower peak on contracting volume. According to classic Dow Theory, how must a technical analyst interpret this market behavior?",
      options: [
        "A) Initiate aggressive leveraged long positions because Industrials have proven supreme strength.",
        "B) It constitutes a major non-confirmation warning that smart money is distributing; the bull trend is suspect until Transports confirm.",
        "C) The transportation sector no longer has any relevance to modern stock market averages.",
        "D) Immediately sell short transportation stocks without waiting for confirmed trend reversal."
      ],
      correctAnswer: "B",
      explanation: "Dow Theory requires mutual confirmation. If Industrials make a new high but Transports fail to confirm, it signals goods are not being shipped, warning of major distribution."
    },
    // Scene 11: 8 Rules
    rules: [
      "1. The averages discount everything: all news, sentiment, and unexpected events are reflected in price.",
      "2. The market has three trends: the primary ocean tide, secondary wave corrections, and minor noise ripples.",
      "3. Primary trends have three phases: smart money accumulation, public participation, and final distribution.",
      "4. The averages must confirm each other: a trend in Industrials is invalid without confirmation from Transports.",
      "5. Volume must confirm the trend: turnover must expand in the trend direction and contract on pullbacks.",
      "6. A trend is assumed in effect until it gives definitive reversal signals: never preempt a reversal.",
      "7. Secondary corrections retrace 33% to 66% of the primary move, with 50% as the normal benchmark.",
      "8. Closing prices are supreme: Dow Theory relies strictly on daily closing prices, ignoring intraday spikes."
    ]
  },

  ch03_part1: {
    chapter: "CHAPTER 3 · PART 1",
    chapterTitle: "CHART CONSTRUCTION: DAILY BAR, LINE, CANDLESTICK & POINT AND FIGURE",
    hindiTitle: "चार्ट निर्माण: दैनिक बार, लाइन, कैंडलस्टिक और पॉइंट एंड फिगर",
    dilemma: {
      en_novice: "Marcus, with so many chart types available—bar charts, line charts, candlesticks, and Point & Figure—how do professional analysts filter market noise from true price signals?",
      hi_novice: "शर्मा जी! बार चार्ट, लाइन चार्ट, कैंडलस्टिक्स और पॉइंट एंड फिगर में से प्रोफेशनल एनालिस्ट सही सिग्नल कैसे पहचानते हैं और शोर से कैसे बचते हैं?",
      en_mentor_setup: "Alex, novice traders stare at intraday ticks and get whipsawed by noise. In Chapter 3, John Murphy establishes that each chart construction modality serves a distinct analytical purpose.",
      hi_mentor_setup: "राजू, नौसिखिए दिन भर के टिक-बाय-टिक उतार-चढ़ाव देखकर घबरा जाते हैं। मर्फी समझाते हैं कि हर चार्ट टाइप का एक खास तकनीकी मकसद होता है।",
      en_mentor_trap: "The trap is using the wrong lens: line charts hide intraday volatility, while noisy bar charts obscure pure price trends. Traders miss institutional accumulation!",
      hi_mentor_trap: "गलती गलत लेंस चुनने से होती है: लाइन चार्ट दिन के उतार-चढ़ाव छिपा देता है, जबकि बार चार्ट में शोर बहुत होता है। लोग स्मार्ट मनी की खरीद को देख ही नहीं पाते!",
      en_mentor_solution: "Murphy teaches Point & Figure for timeless horizontal price targets, and Japanese Candlesticks for immediate supply-demand psychology at key support!",
      hi_mentor_solution: "मर्फी पॉइंट एंड फिगर चार्ट से समय-रहित सटीक टारगेट निकालना और जापानी कैंडलस्टिक्स से खरीदारों-विक्रेताओं का मनोविज्ञान पढ़ना सिखाते हैं!"
    },
    tug: {
      title: "Noisy Intraday Bar Flips vs Timeless Point & Figure Pure Price",
      leftTitle: "Noisy Daily Bar Chart",
      rightTitle: "Timeless Point & Figure (P&F)",
      leftLabel: "Time-Bound Daily Whipsaws",
      rightLabel: "Pure Price Movement & Box Reversals",
      centerTitle: "The Visual Lens"
    },
    pillars: [
      { title: "1. The Daily Bar Chart (OHLC)", desc: "Plots price vertically and time horizontally; the closing tick represents the final institutional consensus valuation of the session.", badge: "Core Blueprint" },
      { title: "2. Line Charts & Noise Filtering", desc: "Connects closing prices only; eliminates intraday false breakouts to reveal the clean underlying trend structure.", badge: "Noise Filter" },
      { title: "3. Point and Figure (P&F) Mechanics", desc: "Completely timeless charting plotting rising X columns and falling O columns based strictly on predefined box sizes and 3-box reversal thresholds.", badge: "Pure Price" },
      { title: "4. Japanese Candlesticks", desc: "Highlights the real body between open and close with upper and lower shadows, revealing instantaneous battle lines between bulls and bears.", badge: "Psychology" }
    ],
    formula: {
      title: "Point & Figure 3-Box Horizontal Count Target Formula",
      expression: "P&F Target Price = Base Low + (Horizontal Columns Count * Box Size * Reversal Number)",
      latex: "P_{\\text{target}} = P_{\\text{base}} + (N_{\\text{columns}} \\cdot \\text{Box Size} \\cdot R)",
      variables: [
        { symbol: "P_{\\text{base}}", label: "Base Low Level", description: "The lowest price box of the horizontal consolidation fulcrum." },
        { symbol: "N_{\\text{columns}}", label: "Column Width Count", description: "The number of vertical P&F columns across the horizontal base pattern." },
        { symbol: "\\text{Box Size}", label: "Box Size Increment", description: "The dollar or point threshold assigned per box (e.g. $1.00)." },
        { symbol: "R", label: "Reversal Multiplier", description: "The box reversal requirement (standard 3-box reversal multiplier)." }
      ]
    },
    quiz: {
      question: "On a timeless Point and Figure chart with a $1.00 box size and a standard 3-box reversal rule, an accumulation base spans 12 horizontal columns before generating an upside breakout above $50.00 from a base low of $42.00. What is the projected horizontal count price target?",
      options: [
        "A) $54.00 (adding the 12 columns directly to the base low)",
        "B) $78.00 (calculating 12 columns multiplied by $1.00 box size times 3-box reversal added to the $42.00 base low)",
        "C) $62.00 (adding 12 columns to the $50.00 breakout point)",
        "D) Point and Figure charts cannot calculate price targets."
      ],
      correctAnswer: "B",
      explanation: "Under Murphy's P&F horizontal count method: Target = Base Low ($42) + (Columns (12) * Box Size ($1) * Reversal (3)) = $42 + $36 = $78.00."
    },
    rules: [
      "1. The closing price is the most critical price of the day: it represents institutional commitment.",
      "2. Use line charts to filter intraday noise and confirm higher-timeframe trend continuity.",
      "3. Point & Figure charts filter out elapsed time to focus exclusively on pure price movements.",
      "4. The 3-box reversal rule requires a 3-box price counter-move before starting a new column.",
      "5. Use the horizontal P&F count to project precise minimum price targets from base formations.",
      "6. Candlestick real bodies reflect the true strength of conviction between the open and close.",
      "7. Long shadows on candlesticks reveal rejected price levels and aggressive institutional defense.",
      "8. Combine chart types: use bar charts for structure, P&F for targets, and candlesticks for triggers."
    ]
  },

  ch04_part1: {
    chapter: "CHAPTER 4 · PART 1",
    chapterTitle: "BASIC CONCEPTS OF TREND: PEAKS, TROUGHS & SUPPORT/RESISTANCE MECHANICS",
    hindiTitle: "ट्रेंड की मूल अवधारणाएं: चोटियां, गर्त और सपोर्ट व रेजिस्टेंस की कार्यप्रणाली",
    dilemma: {
      en_novice: "Marcus, why do trend-following strategies suffer so many painful losses when prices enter a sideways channel?",
      hi_novice: "शर्मा जी! जब बाजार किसी दायरे में फंसता है, तो ट्रेंड-फॉलोइंग स्ट्रेटेजीज में लगातार नुकसान क्यों होता है?",
      en_mentor_setup: "Alex, amateur traders assume markets move only up or down. In Chapter 4, John Murphy reveals that prices move in three directions: up, down, and sideways—and markets spend one-third of their time in horizontal ranges!",
      hi_mentor_setup: "राजू, नए ट्रेडर सोचते हैं कि बाजार सिर्फ ऊपर या नीचे जाता है। मर्फी बताते हैं कि बाजार एक-तिहाई समय एक दायरे (साइडवेज) में बिताता है!",
      en_mentor_trap: "The trap is entering trend-following breakout systems inside a trendless equilibrium. Without successive higher peaks and troughs, traders get chopped to pieces!",
      hi_mentor_trap: "खतरा साइडवेज बाजार में ब्रेकआउट चेज करना है। जब तक लगातार हायर हाई और हायर लो न बनें, तब तक ट्रेंड ट्रेडिंग सिर्फ घाटा कराती है!",
      en_mentor_solution: "Murphy defines a trend strictly as zigzag waves of peaks and troughs, establishing support at prior reaction lows and resistance at prior reaction highs.",
      hi_mentor_solution: "मर्फी ट्रेंड को चोटियों और गर्तों के क्रम से परिभाषित करते हैं: पिछले निचले स्तर पर सपोर्ट और पिछले ऊपरी स्तर पर रेजिस्टेंस बनता है!"
    },
    tug: {
      title: "Active Directional Trend vs Horizontal Trading Range Equilibrium",
      leftTitle: "Sideways Trading Range (1/3 of Time)",
      rightTitle: "Directional Trend (Higher Highs & Lows)",
      leftLabel: "Trendless Equilibrium & Chop",
      rightLabel: "Zigzag Momentum & Institutional Edge",
      centerTitle: "The Trend Spectrum"
    },
    pillars: [
      { title: "1. Zigzag Definition of Trend", desc: "An uptrend is a series of successively higher peaks and higher troughs; a downtrend requires systematically lower peaks and lower troughs.", badge: "Trend Structure" },
      { title: "2. Three Directions of Movement", desc: "Markets move up, down, and sideways. Recognizing a trendless horizontal equilibrium prevents devastating trend-following drawdown.", badge: "Market Equilibrium" },
      { title: "3. Three Hierarchical Degrees", desc: "Trends operate across three degrees: Major/Primary (>6 months), Intermediate/Secondary (3 weeks to 3 months), and Near-Term/Minor (<3 weeks).", badge: "Fractal Hierarchy" },
      { title: "4. Support & Resistance Mechanics", desc: "Support is a price trough where demand overcomes selling pressure; resistance is a peak where supply overcomes buying pressure.", badge: "Supply & Demand" }
    ],
    formula: {
      title: "Trend Invalidation Peak-and-Trough Threshold",
      expression: "Uptrend Broken = Current Reaction Low < Preceding Reaction Low",
      latex: "\\text{Trend Status} = \\begin{cases} \\text{Uptrend}, & \\text{if } P_{\\text{trough}, t} > P_{\\text{trough}, t-1} \\text{ and } P_{\\text{peak}, t} > P_{\\text{peak}, t-1} \\\\ \\text{Reversal / Range}, & \\text{if } P_{\\text{trough}, t} \\le P_{\\text{trough}, t-1} \\end{cases}",
      variables: [
        { symbol: "P_{\\text{peak}, t}", label: "Current Peak", description: "The most recent swing high price level." },
        { symbol: "P_{\\text{trough}, t}", label: "Current Trough", description: "The most recent reaction low price level." },
        { symbol: "P_{\\text{trough}, t-1}", label: "Preceding Trough", description: "The prior reaction low acting as the inviolable support threshold." }
      ]
    },
    quiz: {
      question: "A stock in an established multi-month uptrend advances to a new high of ₹450, but pulls back sharply to ₹390, dropping below its previous swing reaction low of ₹405. How should a disciplined technician classify the trend status of this stock?",
      options: [
        "A) The uptrend remains 100% intact because the stock hit ₹450 earlier.",
        "B) The uptrend has been formally broken and neutralized; the trend has shifted to sideways or a potential downtrend.",
        "C) The drop below ₹405 is an immediate screaming buy signal.",
        "D) Peaks and troughs have no bearing on trend classification."
      ],
      correctAnswer: "B",
      explanation: "Under Murphy's trend definition, an uptrend requires higher peaks and higher troughs. Breaking below a prior trough (₹405 to ₹390) invalidates the uptrend structure."
    },
    rules: [
      "1. An uptrend requires successively higher peaks and higher troughs; downtrends require lower peaks and troughs.",
      "2. Markets spend at least one-third of the time in sideways trading ranges: adjust your tools accordingly.",
      "3. Every trend is part of a larger trend degree: always align with the intermediate and primary directions.",
      "4. Support is formed at prior reaction troughs where demand overcomes selling pressure.",
      "5. Resistance is formed at prior reaction peaks where supply overcomes buying pressure.",
      "6. The more times a support or resistance level is tested, the more significant and authoritative it becomes.",
      "7. High volume at a support or resistance level confirms heavy institutional commitment at that price.",
      "8. Never assume a trend has reversed until prices decisively violate the preceding reaction swing pivot."
    ]
  },

  ch04_part2: {
    chapter: "CHAPTER 4 · PART 2",
    chapterTitle: "SUPPORT & RESISTANCE: ROLE REVERSAL, ROUND NUMBERS & RETRACEMENTS",
    hindiTitle: "सपोर्ट और रेजिस्टेंस: पोलैरिटी का नियम, राउंड नंबर्स और रिट्रेसमेंट",
    dilemma: {
      en_novice: "Marcus, why do traders who buy a stock after it breaks below support suffer catastrophic losses when the stock rallies back to their entry price?",
      hi_novice: "शर्मा जी! जब कोई शेयर सपोर्ट तोड़कर नीचे जाता है, तो वापस ऊपर आने पर ट्रेडर्स का भारी नुकसान क्यों बढ़ जाता है?",
      en_mentor_setup: "Alex, amateur traders do not understand human psychology at price levels. In Part 2, John Murphy explains the Principle of Polarity: once support is broken, it reverses roles to become impenetrable resistance!",
      hi_mentor_setup: "राजू, आम ट्रेडर यह नहीं समझते कि सपोर्ट टूटने पर खरीदारों की क्या हालत होती है। मर्फी समझाते हैं कि टूटा हुआ सपोर्ट भविष्य का कड़ा रेजिस्टेंस बन जाता है—इसे पोलैरिटी कहते हैं!",
      en_mentor_trap: "The trap is cognitive dissonance: trapped buyers who bought at support pray for prices to return so they can get out even. When the retest hits, they flood the market with sell orders, crushing the rally!",
      hi_mentor_trap: "गलती उम्मीद में बैठे रहने की है: जो लोग सपोर्ट पर फंसे थे, वे भाव वापस आने पर बिना नुकसान के निकलने के लिए बिकवाली का सैलाब ला देते हैं, जिससे शेयर वहीं से गिर जाता है!",
      en_mentor_solution: "Murphy establishes that former support becomes future resistance, round numbers create psychological barriers, and pullbacks predictably retrace 38.2%, 50%, or 61.8%.",
      hi_mentor_solution: "मर्फी सिखाते हैं कि पुराने सपोर्ट पर बिकवाली करें, पचास परसेंट रिट्रेसमेंट का सम्मान करें और सौ जैसे राउंड नंबर्स पर अलर्ट रहें!"
    },
    tug: {
      title: "Broken Support (New Supply Ceiling) vs Fresh Buying Floor",
      leftTitle: "Broken Support (Trapped Longs Selling)",
      rightTitle: "Role-Reversed Resistance Ceiling",
      leftLabel: "Trapped Supply Flooding Market",
      rightLabel: "Principle of Polarity Enforced",
      centerTitle: "Polarity Invariant"
    },
    pillars: [
      { title: "1. The Principle of Polarity", desc: "A broken support level becomes a formidable future resistance ceiling; a decisively broken resistance level becomes an authoritative future support floor.", badge: "Role Reversal" },
      { title: "2. The Three-Cohort Psychology", desc: "At support, longs want to add, shorts regret not covering, and sideline cash waits to enter; upon breakdown, all three cohorts become desperate sellers.", badge: "Crowd Psychology" },
      { title: "3. Round Number Psychological Barriers", desc: "Market participants naturally anchor stop orders, profit targets, and mental limits at round numbers like $50, $100, ₹1000, creating self-fulfilling zones.", badge: "Psychological Levels" },
      { title: "4. Percentage Retracement Ratios", desc: "Countertrend pullbacks predictably retrace calculable geometric proportions of the prior wave: 33%, 38.2%, 50%, and 61.8% (Fibonacci/Dow).", badge: "Fibonacci Geometry" }
    ],
    formula: {
      title: "Fibonacci 61.8% Golden Ratio Retracement Formula",
      expression: "Golden Retracement Target = Wave High - 0.618 * (Wave High - Wave Low)",
      latex: "P_{\\text{retrace}, 61.8\\%} = P_{\\text{high}} - 0.618 \\cdot (P_{\\text{high}} - P_{\\text{low}})",
      variables: [
        { symbol: "P_{\\text{high}}", label: "Impulse Wave High", description: "The crest peak of the directional advance." },
        { symbol: "P_{\\text{low}}", label: "Impulse Wave Low", description: "The starting reaction trough of the advance." },
        { symbol: "0.618", label: "Golden Ratio Multiplier", description: "The critical maximum normal corrective retracement threshold before trend invalidation." }
      ]
    },
    quiz: {
      question: "A stock traded between a horizontal support floor of ₹200 and a resistance ceiling of ₹240 for six months before decisively breaking below ₹200 on heavy volume to ₹175. Weeks later, the stock rallies back up to touch ₹198. How should a technician apply Murphy's Principle of Polarity?",
      options: [
        "A) Buy aggressively because the stock is about to break back into its former range.",
        "B) Expect former support at ₹200 to act as a formidable new resistance ceiling where trapped buyers will sell to break even.",
        "C) Ignore the ₹200 level because prior price history is deleted after a breakdown.",
        "D) Polarity only applies in commodity markets, not equity stocks."
      ],
      correctAnswer: "B",
      explanation: "Under Murphy's Principle of Polarity, broken support at ₹200 becomes future overhead resistance. Trapped buyers who suffered the drop to ₹175 sell at ₹198-₹200 to escape with zero loss."
    },
    rules: [
      "1. The Principle of Polarity is inviolable: broken support becomes resistance; broken resistance becomes support.",
      "2. The greater the volume on a support breakdown, the stronger that level will act as overhead resistance.",
      "3. The longer prices trade at a support or resistance zone, the more significant its role reversal becomes.",
      "4. Trapped longs sell on the first return move to broken support to break even: use this as a short entry pivot.",
      "5. Round numbers like $50, $100, and ₹1000 act as natural psychological stopping points for trend moves.",
      "6. Never place stop-loss orders directly at round numbers; place them slightly above or below the psychological level.",
      "7. Standard trend pullbacks predictably retrace 38.2%, 50%, or 61.8% of the preceding impulse wave.",
      "8. A retracement exceeding 66% (or 61.8%) warns that the prior trend is undergoing a major structural reversal."
    ]
  },

  ch04_part3: {
    chapter: "CHAPTER 4 · PART 3",
    chapterTitle: "TRENDLINES, CHANNELS & THE FAN PRINCIPLE",
    hindiTitle: "ट्रेंडलाइन्स, चैनल्स और फैन सिद्धांत",
    dilemma: {
      en_novice: "Marcus, why do so many traders lose money trying to draw trendlines and picking reversal tops on steep upward rallies?",
      hi_novice: "शर्मा जी! तेज चढ़ते बाजार में जब ट्रेडर्स ट्रेंडलाइन खींचकर टॉप पकड़ने की कोशिश करते हैं, तो वे बार-बार घाटा क्यों उठाते हैं?",
      en_mentor_setup: "Alex, amateur traders connect any two random dots and call it a trendline. In Part 3, John Murphy establishes rigorous geometric rules: two points make a tentative line, but only a third touch validates an authoritative trendline!",
      hi_mentor_setup: "राजू, नौसिखिए किन्हीं भी दो बिंदुओं को जोड़कर ट्रेंडलाइन मान लेते हैं। मर्फी बताते हैं कि दो बिंदु सिर्फ अस्थायी रेखा बनाते हैं, जब तक तीसरा बिंदु उसे न छुए, तब तक ट्रेंडलाइन मान्य नहीं होती!",
      en_mentor_trap: "The trap is premature fading: traders sell when a steep 60-degree trendline breaks, only to be run over when the trend flattens to a sustainable 45-degree angle. They fight momentum without the Fan Principle!",
      hi_mentor_trap: "गलती समय से पहले ट्रेंड के सामने खड़े होने की है: जब 60 डिग्री की तीखी लाइन टूटती है, तो लोग शॉर्ट कर देते हैं, जबकि बाजार सिर्फ सुधरकर 45 डिग्री के सामान्य ढलान पर आ रहा होता है!",
      en_mentor_solution: "Murphy establishes the 3-point trendline rule, parallel channel lines, the 45-degree normal trendline equilibrium, and the Fan Principle (three fan lines breaking before major reversal).",
      hi_mentor_solution: "मर्फी तीन बिंदुओं का नियम, पैरेलल चैनल और फैन सिद्धांत सिखाते हैं—जब तीन अलग-अलग ट्रेंडलाइन्स टूटें, तभी असली रिवर्सल की पुष्टि होती है!"
    },
    tug: {
      title: "Steep Unsustainable Trendlines vs The 45-Degree Equilibrium Line",
      leftTitle: "Steep 60-Degree Line (Accelerated Pace)",
      rightTitle: "45-Degree Normal Trendline (Sustainable Pace)",
      leftLabel: "Fragile Euphoria & Early Violation",
      rightLabel: "Long-Term Trend Balance of Supply & Demand",
      centerTitle: "The Geometric Angle"
    },
    pillars: [
      { title: "1. The 3-Point Validation Rule", desc: "Two reaction lows establish a tentative trendline; a decisive third reaction bounce confirms an authoritative, valid up-trendline.", badge: "Validation Rule" },
      { title: "2. The 45-Degree Equilibrium Angle", desc: "A 45-degree trendline represents the ideal sustainable balance where price advances at a pace equal to elapsed time (Gann equilibrium).", badge: "Equilibrium Angle" },
      { title: "3. Parallel Trend Channels", desc: "Drawing a parallel channel line across intervening reaction highs creates a dynamic target ceiling; failure to reach the channel line warns of trend weakness.", badge: "Channel Boundaries" },
      { title: "4. The Fan Principle Reversal", desc: "When an up-trendline breaks, prices rally to form a second and third flatter trendline; a decisive break of the third fan line signals an undeniable trend reversal.", badge: "The Fan Principle" }
    ],
    formula: {
      title: "Parallel Channel Return Target Projection",
      expression: "Channel Target Price = Trendline Value + Vertical Peak Distance",
      latex: "P_{\\text{channel}} = P_{\\text{trendline}} + (P_{\\text{peak}} - P_{\\text{trendline, base}})",
      variables: [
        { symbol: "P_{\\text{channel}}", label: "Channel Ceiling Target", description: "The upper channel boundary where profit taking should be executed." },
        { symbol: "P_{\\text{trendline}}", label: "Current Trendline Value", description: "The current price level of the lower upward trendline support." },
        { symbol: "P_{\\text{peak}}", label: "Intervening Reaction Peak", description: "The highest high reached between the two reaction lows used to draw the trendline." }
      ]
    },
    quiz: {
      question: "An aggressive stock rallies steeply along a 65-degree trendline before breaking below it to consolidate sideways. The technician draws a second flatter trendline connecting the new reaction low, which also breaks, followed by a third trendline at a 30-degree angle. The stock then breaks decisively below this third trendline on heavy volume. Under Murphy's Fan Principle, what does this indicate?",
      options: [
        "A) The stock is merely taking a minor rest and will instantly rally to new highs.",
        "B) The violation of the third trendline constitutes an undeniable, definitive major trend reversal from bullish to bearish.",
        "C) The Fan Principle requires at least five trendlines before confirming a reversal.",
        "D) Trendlines cannot be drawn at flatter angles."
      ],
      correctAnswer: "B",
      explanation: "Under Murphy's classic Fan Principle, the decisive breaking of the third flatter fan line signals that the entire trend structure has reversed from bull to bear."
    },
    rules: [
      "1. Two points create a tentative trendline; it requires a decisive third test and bounce to confirm validity.",
      "2. The longer a trendline has been in effect and the more times it has been tested, the greater its significance.",
      "3. Steep trendlines (e.g. >60 degrees) indicate unsustainable momentum and are prone to early violations.",
      "4. A 45-degree trendline represents the golden equilibrium where price advance matches elapsed time.",
      "5. Channel lines create dynamic boundaries: failure to reach the channel line warns of upcoming trend exhaustion.",
      "6. A decisive breakout above an upper channel line signals trend acceleration, requiring a steeper trendline.",
      "7. The Fan Principle: three successively flatter trendlines must break before confirming a definitive trend reversal.",
      "8. Upon breaking a trendline, previous support becomes future resistance on the subsequent pullback retest."
    ]
  },

  ch05_part1: {
    chapter: "CHAPTER 5 · PART 1",
    chapterTitle: "MAJOR REVERSAL PATTERNS: HEAD AND SHOULDERS TOP & BOTTOM",
    hindiTitle: "प्रमुख रिवर्सल पैटर्न्स: हेड एंड शोल्डर्स टॉप और बॉटम",
    dilemma: {
      en_novice: "Marcus, why do retail traders get wiped out buying what looks like a healthy dip on a stock that has formed a massive Head and Shoulders top?",
      hi_novice: "शर्मा जी! जब कोई शेयर हेड एंड शोल्डर्स टॉप बनाता है, तो आम ट्रेडर उसे एक सामान्य गिरावट समझकर खरीदकर कंगाल क्यों हो जाते हैं?",
      en_mentor_setup: "Alex, amateur traders look only at price levels and ignore volume behavior. In Chapter 5, John Murphy explains the classic Head and Shoulders pattern—the most reliable major topping formation in technical analysis!",
      hi_mentor_setup: "राजू, नौसिखिए सिर्फ भाव देखते हैं और वॉल्यूम का व्यवहार भूल जाते हैं। मर्फी समझाते हैं कि हेड एंड शोल्डर्स दुनिया का सबसे भरोसेमंद रिवर्सल पैटर्न है!",
      en_mentor_trap: "The trap is volume divergence: the left shoulder has heavy volume, the head makes a higher high on lighter volume, and the right shoulder rallies feebly on dying volume. Smart money has already dumped shares!",
      hi_mentor_trap: "खतरा वॉल्यूम के सूखने का है: बाएं कंधे पर भारी वॉल्यूम था, सिर पर वॉल्यूम घट गया, और दाएं कंधे पर वॉल्यूम बिल्कुल सूख गया। स्मार्ट मनी पहले ही निकल चुका है!",
      en_mentor_solution: "Murphy establishes that the pattern is completed only upon a decisive closing violation of the neckline, allowing technicians to project an exact minimum price objective.",
      hi_mentor_solution: "मर्फी सिखाते हैं कि जब तक नेकलाइन न टूटे तब तक शॉर्ट न करें, और नेकलाइन टूटते ही हेड की ऊंचाई नापकर सटीक टारगेट निकालें!"
    },
    tug: {
      title: "Exhausted Buying Climax (Right Shoulder) vs Aggressive Distribution",
      leftTitle: "Right Shoulder (Feeble Buying & Dying Volume)",
      rightTitle: "Neckline Breakdown (Institutional Selloff)",
      leftLabel: "Trapped Retail Longs Expecting Rally",
      rightLabel: "Decisive Neckline Penetration & Measuring Target",
      centerTitle: "The Reversal Pivot"
    },
    pillars: [
      { title: "1. The Three Peak Anatomy", desc: "A Head and Shoulders top features a prominent central peak (head) flanked by two lower, roughly symmetrical crests (left and right shoulders).", badge: "Pattern Anatomy" },
      { title: "2. The Volume Confirmation Pattern", desc: "Volume is heaviest on the left shoulder, noticeably lighter on the head, contracts sharply on the right shoulder, and explodes on the neckline breakdown.", badge: "Volume Divergence" },
      { title: "3. The Neckline Trigger", desc: "The neckline connects the intervening reaction lows; the reversal pattern is formally completed only when prices close decisively below this neckline support.", badge: "Completion Trigger" },
      { title: "4. The Minimum Price Objective", desc: "Calculated by measuring the vertical distance from the head peak down to the neckline, and projecting that exact distance downward from the breakout point.", badge: "Price Objective" }
    ],
    formula: {
      title: "Head & Shoulders Minimum Price Target Formula",
      expression: "Minimum Price Target = Neckline Breakout Price - (Head Peak Price - Neckline Price)",
      latex: "P_{\\text{target}} = P_{\\text{neckline}} - (P_{\\text{head}} - P_{\\text{neckline}})",
      variables: [
        { symbol: "P_{\\text{target}}", label: "Minimum Price Objective", description: "The projected price target following a valid neckline breakdown." },
        { symbol: "P_{\\text{neckline}}", label: "Neckline Level", description: "The price floor connecting the reaction troughs between the shoulders and head." },
        { symbol: "P_{\\text{head}}", label: "Head Peak Price", description: "The highest crest of the entire topping formation." },
        { symbol: "H_{\\text{head}}", label: "Vertical Head Height", description: "The absolute vertical distance from head to neckline: (P_head - P_neckline)." }
      ]
    },
    quiz: {
      question: "A stock completes a textbook Head and Shoulders top. The head reached a peak of ₹180, while the horizontal neckline connects reaction lows at ₹140. The stock then breaks decisively below the neckline at ₹140 on heavy volume. What is the minimum price objective projected by Murphy's measuring formula?",
      options: [
        "A) ₹120 (subtracting half the distance)",
        "B) ₹100 (measuring the ₹40 height from ₹180 to ₹140 and projecting it down from the ₹140 neckline)",
        "C) ₹140 (the neckline itself is the target)",
        "D) Head and Shoulders patterns cannot project price targets."
      ],
      correctAnswer: "B",
      explanation: "Height = Head (₹180) - Neckline (₹140) = ₹40. Projected Target = Neckline (₹140) - Height (₹40) = ₹100.00."
    },
    rules: [
      "1. A prior trend must exist for a reversal pattern to take place: you cannot reverse what is not there.",
      "2. The first warning of a Head & Shoulders top is when the head makes a new high on noticeably lighter volume.",
      "3. The right shoulder must fail to exceed the head peak, signaling exhausted buyer demand.",
      "4. The formation is complete only upon a decisive closing violation beneath the neckline support.",
      "5. A return move (pullback) back up to test the broken neckline is common, but volume must remain light.",
      "6. The minimum measuring price target is the vertical distance from the head to neckline projected from breakout.",
      "7. Inverse Head & Shoulders bottoms require a significant surge in trading volume on the neckline breakout.",
      "8. If the right shoulder rallies above the head peak, the entire reversal pattern is immediately invalidated."
    ]
  },

  ch05_part2: {
    chapter: "CHAPTER 5 · PART 2",
    chapterTitle: "DOUBLE & TRIPLE TOPS/BOTTOMS, SAUCERS & V-REVERSALS",
    hindiTitle: "डबल और ट्रिपल टॉप व बॉटम, सॉसर और वी-रिवर्सल",
    dilemma: {
      en_novice: "Marcus, why do so many traders buy a stock the moment it touches a prior low, claiming it is an unshakeable Double Bottom, only to be crushed by a breakdown?",
      hi_novice: "शर्मा जी! जब कोई शेयर पुराने लो को छूता है, तो लोग उसे तुरंत डबल बॉटम मानकर खरीद लेते हैं और बाद में भारी नुकसान क्यों उठाते हैं?",
      en_mentor_setup: "Alex, touching a prior low does NOT make a Double Bottom! In Part 2, John Murphy emphasizes that a Double Bottom (W-pattern) is formally completed ONLY when price closes above the intervening peak!",
      hi_mentor_setup: "राजू, सिर्फ पुराने लो को छूना डबल बॉटम नहीं होता! मर्फी साफ कहते हैं कि जब तक बीच की चोटी के ऊपर ब्रेकआउट न हो, तब तक पैटर्न पूरा नहीं माना जाता!",
      en_mentor_trap: "The trap is jumping the gun: prices test a prior trough, form an M-pattern or sideways range, and then plunge to new lows. Premature buyers catch a falling knife!",
      hi_mentor_trap: "खतरा समय से पहले कूदने का है: लोग गिरते चाकू को पकड़ने की कोशिश करते हैं और सपोर्ट टूटते ही उनका स्टॉप लॉस उड़ जाता है!",
      en_mentor_solution: "Murphy establishes strict confirmation rules for Double Tops (M-patterns), Triple Formations, Saucer/Rounding bases, and abrupt V-pattern spike reversals.",
      hi_mentor_solution: "मर्फी डबल टॉप, ट्रिपल बॉटम, सॉसर बेस और वी-रिवर्सल की पुष्टि के कड़े नियम और सटीक मापने के तरीके सिखाते हैं!"
    },
    tug: {
      title: "Premature Guessing at Support vs Confirmed Breakout Above Intervening Peak",
      leftTitle: "Unconfirmed Double Bottom (Falling Knife)",
      rightTitle: "Confirmed W-Pattern Breakout",
      leftLabel: "Guessing Bottoms Without Confirmation",
      rightLabel: "Decisive Close Above Intervening Crest",
      centerTitle: "Confirmation Filter"
    },
    pillars: [
      { title: "1. Double Tops & Bottoms (M & W Patterns)", desc: "Features two prominent peaks or troughs at roughly the same price level; completed ONLY upon a decisive close beyond the intervening reaction pivot.", badge: "M & W Anatomy" },
      { title: "2. Triple Tops and Bottoms", desc: "A hybrid variation where three distinct peaks or troughs test a key barrier; volume diminishes on each successive peak, signaling exhaustion.", badge: "Triple Formations" },
      { title: "3. Saucers and Rounding Turns", desc: "A gradual, gentle bowl-shaped transition where price and volume curve upward together in tandem from distribution to accumulation.", badge: "Rounding Bases" },
      { title: "4. V-Reversals and Island Clusters", desc: "Sudden, violent trend reversals triggered by abrupt surprises or panic selling, often featuring exhaustion gaps and breakaway reversal gaps.", badge: "Spike Reversals" }
    ],
    formula: {
      title: "Double Bottom Minimum Measuring Price Objective",
      expression: "Target Price = Intervening Peak Price + (Intervening Peak Price - Trough Low Price)",
      latex: "P_{\\text{target}} = P_{\\text{peak}} + (P_{\\text{peak}} - P_{\\text{trough}})",
      variables: [
        { symbol: "P_{\\text{target}}", label: "Minimum Upside Target", description: "The projected price target following a decisive close above the intervening peak." },
        { symbol: "P_{\\text{peak}}", label: "Intervening Peak Price", description: "The middle reaction high separating the two bottom troughs." },
        { symbol: "P_{\\text{trough}}", label: "Trough Low Price", description: "The average price level of the two bottom reaction troughs." },
        { symbol: "H_{\\text{pattern}}", label: "Pattern Vertical Height", description: "The vertical distance from intervening peak to trough base: (P_peak - P_trough)." }
      ]
    },
    quiz: {
      question: "A stock in a downtrend drops to ₹100, rallies to an intervening peak of ₹125, pulls back to test ₹100 on lighter volume, and then surges to close at ₹128 on massive trading volume. What is the minimum upside price target projected under Murphy's Double Bottom measuring rule?",
      options: [
        "A) ₹135 (a minor 10-point rally)",
        "B) ₹150 (adding the ₹25 pattern height from ₹100 to ₹125 to the ₹125 breakout level)",
        "C) ₹125 (the intervening peak itself)",
        "D) Double bottoms cannot project upside targets."
      ],
      correctAnswer: "B",
      explanation: "Height = Intervening Peak (₹125) - Trough Low (₹100) = ₹25. Target = Intervening Peak (₹125) + Height (₹25) = ₹150.00."
    },
    rules: [
      "1. A Double Top or Bottom is never complete until prices close decisively beyond the intervening reaction pivot.",
      "2. In a Double Top, the second peak must show noticeably lighter volume than the first peak.",
      "3. In a Double Bottom, the breakout above the intervening peak must be accompanied by heavy volume expansion.",
      "4. Minimum measuring objective: vertical height from peak to trough projected from the breakout point.",
      "5. Triple Tops and Bottoms are completed only when support or resistance across both intervening pivots is broken.",
      "6. Rounding/Saucer bottoms require volume to mirror the bowl shape of price, expanding on the right side.",
      "7. V-reversals are marked by high volatility, runaway gaps, and an absence of horizontal base building.",
      "8. If a Double Top retest rallies above the two peaks, the reversal pattern is instantly invalidated."
    ]
  },

  ch06_part1: {
    chapter: "CHAPTER 6 · PART 1",
    chapterTitle: "CONTINUATION PATTERNS: SYMMETRICAL, ASCENDING & DESCENDING TRIANGLES",
    hindiTitle: "कंटिन्यूएशन पैटर्न्स: सममित, आरोही और अवरोही त्रिकोण",
    dilemma: {
      en_novice: "Marcus, why do traders who buy inside a tightening triangle pattern get whipsawed and trapped right before the real trend continuation takes off?",
      hi_novice: "शर्मा जी! त्रिकोण (ट्रायंगल) के अंदर ट्रेड करने वाले लोग असली तेजी शुरू होने से ठीक पहले घाटा क्यों उठा बैठते हैं?",
      en_mentor_setup: "Alex, amateur traders trade inside the coil without waiting for breakout confirmation! In Chapter 6, John Murphy reveals that triangles are continuation pauses—not reversal signals!",
      hi_mentor_setup: "राजू, नौसिखिए त्रिकोण के अंदर ही दांव लगाने लगते हैं। मर्फी समझाते हैं कि त्रिकोण ट्रेंड के रुकने का संकेत हैं, उलटने का नहीं!",
      en_mentor_trap: "The trap is the Apex Time Limit: if price wanders past three-quarters of the distance to the apex, the triangle loses its explosive energy and degenerates into meaningless chop!",
      hi_mentor_trap: "खतरा एपेक्स टाइम लिमिट का है: अगर भाव त्रिकोण के अंतिम चौथाई हिस्से (एपेक्स) तक पहुंच जाए, तो उसकी सारी ताकत खत्म हो जाती है और सिर्फ साइडवेज शोर बचता है!",
      en_mentor_solution: "Murphy establishes that valid triangle breakouts occur between two-thirds and three-quarters of pattern width, with ascending triangles carrying bullish bias and descending triangles carrying bearish bias.",
      hi_mentor_solution: "मर्फी दो-तिहाई समय पर ब्रेकआउट पकड़ना, असेंडिंग ट्रायंगल में तेजी और डिसेंडिंग में मंदी की पहचान करना सिखाते हैं!"
    },
    tug: {
      title: "Ascending Bullish Accumulation vs Descending Bearish Distribution",
      leftTitle: "Descending Triangle (Bearish Distribution)",
      rightTitle: "Ascending Triangle (Bullish Accumulation)",
      leftLabel: "Flat Support Floor & Lower Highs",
      rightLabel: "Flat Resistance Ceiling & Higher Lows",
      centerTitle: "The Triangle Bias"
    },
    pillars: [
      { title: "1. The Symmetrical Triangle (Coil)", desc: "A neutral continuation pattern formed by two converging trendlines: lower highs and higher lows converging toward an apex; requires at least four reversal points.", badge: "Symmetrical Coil" },
      { title: "2. The Ascending Triangle (Bullish)", desc: "Features a flat horizontal upper resistance ceiling and a rising lower support trendline, signaling that buyers are increasingly aggressive.", badge: "Bullish Ascending" },
      { title: "3. The Descending Triangle (Bearish)", desc: "Features a flat horizontal lower support floor and a declining upper resistance trendline, signaling persistent institutional distribution.", badge: "Bearish Descending" },
      { title: "4. The Apex Time Limit Rule", desc: "Breakouts must occur between two-thirds (66%) and three-quarters (75%) of the horizontal pattern width; breakouts near the apex lose technical authority.", badge: "Apex Time Limit" }
    ],
    formula: {
      title: "Triangle Vertical Base Measuring Target Formula",
      expression: "Triangle Target Price = Breakout Level +/- Base Vertical Height",
      latex: "P_{\\text{target}} = P_{\\text{breakout}} \\pm H_{\\text{base}}",
      variables: [
        { symbol: "P_{\\text{target}}", label: "Price Objective", description: "The projected price target following a valid trendline breakout." },
        { symbol: "P_{\\text{breakout}}", label: "Breakout Level", description: "The exact price point where price decisively penetrates the bounding trendline." },
        { symbol: "H_{\\text{base}}", label: "Base Vertical Height", description: "The maximum vertical distance measured at the widest initial base of the triangle." }
      ]
    },
    quiz: {
      question: "A stock in an established uptrend forms a bullish ascending triangle with a flat horizontal upper resistance ceiling at ₹300 and a rising lower trendline. The widest vertical base of the triangle measures ₹50. The stock then breaks decisively above ₹300 on expanding volume at the two-thirds point of the pattern. What is the minimum price objective?",
      options: [
        "A) ₹325 (half of the pattern base)",
        "B) ₹350 (adding the ₹50 vertical base height to the ₹300 breakout level)",
        "C) ₹300 (the breakout point itself)",
        "D) Triangles cannot project vertical price targets."
      ],
      correctAnswer: "B",
      explanation: "Under Murphy's triangle measuring rule: Target = Breakout Level (₹300) + Base Height (₹50) = ₹350.00."
    },
    rules: [
      "1. Triangles are continuation patterns: trade in the direction of the trend preceding pattern entry.",
      "2. A valid triangle requires at least four reversal points: two highs and two lows touching the trendlines.",
      "3. Trading volume must contract noticeably as price coils tighter toward the triangle apex.",
      "4. The breakout must occur between two-thirds and three-quarters of the pattern width for maximum momentum.",
      "5. If price reaches the final quarter toward the apex without breaking out, the pattern loses technical power.",
      "6. Ascending triangles are inherently bullish; descending triangles are inherently bearish.",
      "7. Valid upside breakouts require a decisive closing penetration accompanied by an unmistakable volume surge.",
      "8. Minimum target: measure the widest vertical base height and project it from the breakout level."
    ]
  },

  ch06_part2: {
    chapter: "CHAPTER 6 · PART 2",
    chapterTitle: "FLAGS, PENNANTS, WEDGES, RECTANGLES & MEASURED MOVES",
    hindiTitle: "फ्लैग्स, पेनेन्ट्स, वेजेज, रेक्टेंगल्स और मेजर्ड मूव्स",
    dilemma: {
      en_novice: "Marcus, why do traders who buy a stock after an explosive vertical rally exit their winning position too early during a brief consolidation flag?",
      hi_novice: "शर्मा जी! जब कोई शेयर रॉकेट की तरह तेजी से भागता है और थोड़ा रुकता है, तो लोग डरकर बहुत जल्दी अपनी प्रॉफिटेबल पोजीशन से क्यों निकल जाते हैं?",
      en_mentor_setup: "Alex, amateur traders do not understand the 'half-mast' principle! In Part 2, John Murphy explains that flags and pennants are brief consolidation pauses that mark the exact midpoint of an explosive run!",
      hi_mentor_setup: "राजू, आम ट्रेडर 'हाफ-मास्ट' (आधे रास्ते) के सिद्धांत को नहीं जानते! मर्फी समझाते हैं कि फ्लैग और पेनेन्ट सिर्फ सांस लेने का ठहराव हैं और वे पूरी चाल का आधा रास्ता दिखाते हैं!",
      en_mentor_trap: "The trap is leaving multi-point gains on the table: traders sell during the tight flag pullback because volume dried up, completely blind to the fact that volume contraction inside a flag is healthy!",
      hi_mentor_trap: "गलती कम वॉल्यूम देखकर डरने की है: फ्लैग के अंदर वॉल्यूम का सूखना तेजी की ताकत दिखाता है, कमजोरी नहीं!",
      en_mentor_solution: "Murphy establishes that flags project the entire vertical height of the flagpole from the breakout point, wedges slant against the prevailing trend, and measured moves feature equal wave lengths.",
      hi_mentor_solution: "मर्फी फ्लैगपोल की पूरी लंबाई को ब्रेकआउट से आगे नापना और मेजर्ड मूव्स में दोनों तरंगों की बराबरी का नियम सिखाते हैं!"
    },
    tug: {
      title: "Steep Dynamic Impulse (Flagpole) vs Tight Low-Volume Flag Consolidation",
      leftTitle: "Steep Dynamic Flagpole Advance",
      rightTitle: "Tight Low-Volume Flag Pause",
      leftLabel: "Explosive Institutional Surge & Heavy Volume",
      rightLabel: "Orderly Retracement on Drying Turnover",
      centerTitle: "The Half-Mast Midpoint"
    },
    pillars: [
      { title: "1. Flags and Pennants (Half-Mast Principle)", desc: "Brief, high-velocity continuation formations lasting 1 to 3 weeks that represent the exact halfway midpoint of a steep, dynamic market impulse.", badge: "Half-Mast Principle" },
      { title: "2. The Volume Contraction Invariant", desc: "Volume must contract sharply during pattern formation as liquidity dries up, followed by an explosive volume surge on the decisive breakout.", badge: "Volume Profile" },
      { title: "3. Wedges (Slanted Against Trend)", desc: "Convergence between two trendlines that slants counter to the prevailing trend: a falling wedge in an uptrend is bullish; a rising wedge in a downtrend is bearish.", badge: "Wedge Slant" },
      { title: "4. The Measured Move Rule (Swing Equality)", desc: "In major trend advances, the secondary corrective consolidation wave is followed by a second impulse advance of equal point distance (Wave 1 = Wave 2).", badge: "Measured Move" }
    ],
    formula: {
      title: "Flagpole Half-Mast Projection Formula",
      expression: "Flagpole Target Price = Breakout Level + (Flagpole Top Price - Flagpole Base Price)",
      latex: "P_{\\text{target}} = P_{\\text{breakout}} + (P_{\\text{pole\\_top}} - P_{\\text{pole\\_base}})",
      variables: [
        { symbol: "P_{\\text{target}}", label: "Projected Price Objective", description: "The price target calculated under the half-mast principle." },
        { symbol: "P_{\\text{breakout}}", label: "Flag Breakout Price", description: "The exact price where price penetrates the upper boundary of the flag channel." },
        { symbol: "P_{\\text{pole\\_top}}", label: "Flagpole Peak", description: "The top of the steep vertical preceding impulse run." },
        { symbol: "P_{\\text{pole\\_base}}", label: "Flagpole Starting Base", description: "The starting support level of the preceding dynamic vertical run." }
      ]
    },
    quiz: {
      question: "A stock in a fierce bull market surges vertically from ₹200 to ₹260 on massive volume in 5 days, and then drifts downward in a tight, orderly parallel flag channel to ₹245 over 2 weeks on drying volume. The stock then breaks decisively above the flag's upper boundary at ₹250 on heavy volume. Under Murphy's half-mast principle, what is the price objective?",
      options: [
        "A) ₹265 (a minor retest of the prior high)",
        "B) ₹310 (calculating the ₹60 flagpole height from ₹200 to ₹260 and adding it to the ₹250 breakout point)",
        "C) ₹260 (the flagpole top itself)",
        "D) Flags cannot project price targets."
      ],
      correctAnswer: "B",
      explanation: "Flagpole Height = Top (₹260) - Base (₹200) = ₹60. Projected Target = Breakout Level (₹250) + Flagpole Height (₹60) = ₹310.00."
    },
    rules: [
      "1. Flags and pennants are high-velocity continuation patterns that typically fly at 'half-mast'.",
      "2. The pattern must be preceded by a steep, nearly vertical price advance (the flagpole) on heavy volume.",
      "3. Formation duration is brief: flags typically resolve within one to three weeks in daily charts.",
      "4. Volume must dry up noticeably during the flag pause; expanding volume inside the flag warns of failure.",
      "5. The breakout from the flag must be accompanied by an explosive expansion in trading volume.",
      "6. Falling wedges in an uptrend are bullish; rising wedges in a downtrend are bearish (wedges slant against trend).",
      "7. The Measured Move rule: the second impulse leg of a major advance predictably equals the point distance of the first leg.",
      "8. Upon breaking out of a rectangular trading range, former resistance becomes future support on pullbacks."
    ]
  }
};
