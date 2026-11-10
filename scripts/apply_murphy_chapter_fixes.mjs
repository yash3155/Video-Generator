// scripts/apply_murphy_chapter_fixes.mjs
/**
 * Master Rebuilder for the 9 Corrupted Murphy Technical Analysis Chapters:
 * ch02_part1, ch03_part1, ch04_part1, ch04_part2, ch04_part3,
 * ch05_part1, ch05_part2, ch06_part1, ch06_part2
 * 
 * Rebuilds all 12 scenes with 100% bespoke technical analysis visuals, formulas,
 * quizzes, and 8-rule summaries in both Hindi and English.
 */

import fs from 'node:fs';
import path from 'node:path';
import { MURPHY_CHAPTER_SPECS } from '../src/domain/technical_analysis/murphyChapterFixes.mjs';

const CHAPTER_KEYS = [
  'ch02_part1',
  'ch03_part1',
  'ch04_part1',
  'ch04_part2',
  'ch04_part3',
  'ch05_part1',
  'ch05_part2',
  'ch06_part1',
  'ch06_part2',
];

// Rich bespoke Scene 3, 4, 6, 7, 8, 10 details for each of the 9 chapters
const BESPOKE_SCENE_DATA = {
  ch02_part1: {
    sc3: {
      title: "Single Average Trading vs Mutual Dow Confirmation",
      badge: "Dow Principle · Mutual Confirmation",
      leftTitle: "Single Average Trading (Unconfirmed)",
      rightTitle: "Dual Dow Average Confirmation",
      leftPoints: [
        "Buys Industrial breakout without checking Transports",
        "Ignores freight volume and physical goods distribution",
        "Vulnerable to economic non-confirmation traps"
      ],
      rightPoints: [
        "Demands both Industrials and Transports hit new highs",
        "Confirms manufacturing expansion with shipping volume",
        "Validates genuine primary bull market advance"
      ],
      hi_tts: "चार्ल्स डाउ का चौथा सिद्धांत कहता है कि इंडस्ट्रियल और ट्रांसपोर्टेशन दोनों सूचकांकों को एक दूसरे की पुष्टि करनी चाहिए, तभी तेजी सच मानी जाएगी।",
      en_sub: "Charles Dow's fourth tenet requires that both Industrial and Transportation averages must mutually confirm each other to validate a true bull trend."
    },
    sc4: {
      title: "140 Years of Empirical Market Evidence",
      badge: "Empirical Invariant · Historical Dow Validation",
      cards: [
        { title: "140 Years of Dow History", desc: "Since 1884, no major primary equity bull market has sustained without Railroads confirming Industrials." },
        { title: "Volume Follows the Trend", desc: "Institutional accumulation visibly expands trading volume on advancing days and dries up on corrective pullbacks." }
      ],
      hi_tts: "ऐतिहासिक रूप से पिछले एक सौ चालीस वर्षों में जब भी दोनों सूचकांकों ने एक साथ नया हाई बनाया, तब बाजार में मजबूत और टिकाऊ तेजी देखने को मिली।",
      en_sub: "Historically over the past 140 years, whenever both averages established simultaneous new highs, the market witnessed strong and durable primary advances."
    },
    sc6: {
      title: "Authentic Primary Bull Market vs Bearish Divergence",
      badge: "Validation Invariant · Confirmation vs Divergence",
      leftTitle: "Authentic Primary Bull Market",
      rightTitle: "Bearish Non-Confirmation Divergence",
      leftPoints: [
        "Higher peaks and higher troughs across both averages",
        "Trading turnover systematically expands on advancing swings",
        "Secondary reactions retrace 33% to 50% orderly"
      ],
      rightPoints: [
        "Industrials make new high while Transports form lower peak",
        "Volume shrinks on the rally and surges on the decline",
        "Signals smart money quietly unloading to the public"
      ],
      hi_tts: "असली तेजी में दोनों सूचकांक नए हाई बनाते हैं और वॉल्यूम बढ़ता है, जबकि गैर-पुष्टि में सिर्फ एक इंडेक्स बढ़ता है और वॉल्यूम गिरता है।",
      en_sub: "In a genuine bull market both averages make higher highs with expanding volume, whereas in a bearish divergence one average fails while volume contracts."
    },
    sc7: {
      title: "Case Study · The Non-Confirmation Divergence Trap",
      badge: "Historical Case Study · Market Crises",
      cards: [
        { title: "The Historic Crash Warnings", desc: "In major market tops, Industrials pushed to euphoric new highs while Transports lagged, warning of massive impending liquidation." },
        { title: "The Closing Price Discipline", desc: "Dow Theory relies strictly on daily closing prices, ignoring misleading intraday spikes and erratic noise." }
      ],
      hi_tts: "ऐतिहासिक क्रैश से पहले हमेशा ऐसा ही हुआ: इंडस्ट्रियल्स ने नया हाई बनाया लेकिन रेलरोड्स पीछे छूट गए, जिससे सतर्क ट्रेडर्स समय रहते निकल गए।",
      en_sub: "Prior to historic market crashes, Industrials made new highs while Transports lagged behind, allowing alert technicians to exit before the collapse."
    },
    sc8: {
      title: "Dow Theory Secondary Retracement Boundaries",
      badge: "Secondary Wave Geometry · Dow Proportions",
      expression: "P_{\\text{retrace}} = P_{\\text{peak}} - R \\cdot (P_{\\text{peak}} - P_{\\text{trough}})",
      latex: "P_{\\text{retrace}} = P_{\\text{peak}} - R \\cdot (P_{\\text{peak}} - P_{\\text{trough}})",
      variables: [
        { symbol: "P_{\\text{peak}}", label: "Primary Advance High", unit: "pts", description: "The peak closing price of the primary bull move." },
        { symbol: "P_{\\text{trough}}", label: "Primary Reaction Low", unit: "pts", description: "The starting base level of the preceding primary impulse." },
        { symbol: "R", label: "Retracement Ratio (0.33 to 0.66)", unit: "ratio", description: "Dow's rule: secondary corrections retrace 33% to 66%, with 50% normal." }
      ],
      hi_tts: "डाउ थ्योरी के अनुसार सेकेंडरी करेक्शन पिछली चाल का तैंतीस से छाछठ परसेंट तक घट सकता है, जहां पचास परसेंट सबसे अहम पिवट होता है।",
      en_sub: "According to Dow Theory, secondary corrections predictably retrace 33% to 66% of the primary move, with 50% serving as the critical pivot."
    },
    sc10: {
      hi_novice: "यानी अगर इंडस्ट्रियल्स नया हाई बनाएं लेकिन ट्रांसपोर्ट्स पुष्टि न करें, तो कभी भी तेजी में नहीं कूदना चाहिए!",
      en_novice: "So if Industrials hit a new high but Transports fail to confirm, I must never chase the rally!",
      hi_mentor: "बिल्कुल सही! चार्ल्स डाउ ने यही सिखाया था: दोनों सूचकांकों की आपसी पुष्टि के बिना कोई भी बड़ा दांव लगाना जुआ है।",
      en_mentor: "Exactly! Charles Dow taught us that both averages must confirm each other. Patience and discipline protect trading capital."
    }
  },

  ch03_part1: {
    sc3: {
      title: "Line Chart Simplicity vs Daily Bar & Candlestick Depth",
      badge: "Chart Construction · Information Density",
      leftTitle: "Line & Intraday Noise Charts",
      rightTitle: "Daily Bar & Japanese Candlesticks",
      leftPoints: [
        "Hides intraday volatility and true trading range",
        "Cannot reveal battle between buyers and sellers",
        "Misses extreme rejection wicks at key support"
      ],
      rightPoints: [
        "Displays Open, High, Low, and Close simultaneously",
        "Candlestick wicks reveal real-time institutional rejection",
        "Real body color highlights who won the daily battle"
      ],
      hi_tts: "लाइन चार्ट सिर्फ क्लोजिंग भाव दिखाकर दिन के उतार-चढ़ाव छिपा देता है, जबकि बार और कैंडलस्टिक चार्ट खरीदारों और विक्रेताओं की पूरी जंग सामने लाते हैं।",
      en_sub: "Line charts obscure intraday volatility by showing only closes, whereas bar and candlestick charts vividly expose the entire battle between buyers and sellers."
    },
    sc4: {
      title: "Scaling Geometry & Timeless Point & Figure",
      badge: "Analytical Precision · Scale & Noise Filter",
      cards: [
        { title: "Arithmetic vs Semi-Logarithmic Scale", desc: "Arithmetic scale distorts long-term percentage comparisons; semi-log scale ensures equal vertical distances represent equal percentage moves." },
        { title: "Timeless Point & Figure Filtering", desc: "Ignores time and volume to plot pure price changes, generating unambiguous horizontal count price targets." }
      ],
      hi_tts: "लंबे समय के विश्लेषण के लिए हमेशा सेमी-लॉग स्केल का इस्तेमाल करना चाहिए, और पॉइंट एंड फिगर चार्ट समय के शोर को पूरी तरह हटा देता है।",
      en_sub: "For multi-year trend analysis always use semi-logarithmic scaling, while Point and Figure charting filters out time noise to reveal pure price targets."
    },
    sc6: {
      title: "Authentic Candlestick Rejection vs False Breakdown Whipsaw",
      badge: "Validation Invariant · Hammer vs Fakeout",
      leftTitle: "Authentic Hammer Rejection at Support",
      rightTitle: "False Breakdown Trap (Whipsaw)",
      leftPoints: [
        "Long lower shadow at least twice the real body height",
        "Closes decisively near the high of the session range",
        "Heavy volume confirms institutional demand absorption"
      ],
      rightPoints: [
        "Intraday dip below support fails to achieve daily close",
        "Lack of selling follow-through on declining turnover",
        "Traps panicked retail sellers before sharp reversal"
      ],
      hi_tts: "सच्चे हैमर में निचली छाया बॉडी से दोगुनी लंबी होती है और भाव ऊपर बंद होता है, जबकि फाल्स ब्रेकडाउन में क्लोजिंग नीचे नहीं हो पाती।",
      en_sub: "In a genuine hammer the lower shadow is twice the body length closing near the high, whereas a false breakdown fails to sustain closing penetration."
    },
    sc7: {
      title: "Case Study · Volume and Open Interest Synchronization",
      badge: "Futures & Equity Data · Flow Validation",
      cards: [
        { title: "Total Volume Commitment", desc: "Volume represents the total number of shares or contracts traded, measuring the immediate intensity of the buying or selling impulse." },
        { title: "Open Interest Confirmation", desc: "In futures markets, rising open interest during a price advance proves fresh money is aggressively entering the bull trend." }
      ],
      hi_tts: "फ्यूचर्स में केवल भाव देखना काफी नहीं है: जब भाव बढ़े और ओपन इंटरेस्ट भी बढ़े, तो इसका मतलब है कि नया पैसा तेजी में शामिल हो रहा है।",
      en_sub: "In futures markets watching price alone is insufficient: when prices rise accompanied by rising open interest, fresh money is entering the trend."
    },
    sc8: {
      title: "True Range Volatility Calculation",
      badge: "Price Volatility · Welles Wilder Metric",
      expression: "\\text{TR} = \\max(H - L, |H - C_{\\text{prior}}|, |L - C_{\\text{prior}}|)",
      latex: "\\text{TR} = \\max(H - L, |H - C_{\\text{prior}}|, |L - C_{\\text{prior}}|)",
      variables: [
        { symbol: "H - L", label: "Current Session Range", unit: "₹", description: "Today's high minus today's low." },
        { symbol: "|H - C_{\\text{prior}}|", label: "Gap Up Distance", unit: "₹", description: "Absolute difference between today's high and yesterday's close." },
        { symbol: "|L - C_{\\text{prior}}|", label: "Gap Down Distance", unit: "₹", description: "Absolute difference between today's low and yesterday's close." }
      ],
      hi_tts: "ट्रू रेंज फॉर्मूला गैप्स को भी शामिल करके बाजार की वास्तविक वोलाटिलिटी को पूरी सटीकता से नापता है।",
      en_sub: "The True Range formula accounts for price gaps to measure true market volatility with mathematical precision."
    },
    sc10: {
      hi_novice: "यानी चार्ट का सही प्रकार चुनना और डेली क्लोजिंग पर ध्यान देना ही भावनात्मक शोर से बचाता है!",
      en_novice: "So selecting the appropriate chart construction and focusing on daily closing prices eliminates emotional noise!",
      hi_mentor: "बिल्कुल सही! चार्ट्स बाजार की भाषा हैं। जब आप सही लेंस से देखेंगे, तो बड़े खिलाड़ियों के कदम साफ दिखाई देंगे।",
      en_mentor: "Precisely! Charts are the language of supply and demand. Look through the right lens, and institutional footprints become obvious."
    }
  },

  ch04_part1: {
    sc3: {
      title: "Subjective Guessing vs Objective Peak-and-Trough Trends",
      badge: "Trend Discipline · Objective Peak & Trough",
      leftTitle: "Subjective Sentiment Guessing",
      rightTitle: "Objective Peak & Trough Definition",
      leftPoints: [
        "Buys into overhead resistance based on emotional FOMO",
        "Sells winning positions at the first minor pullback",
        "Suffers heavy drawdowns in sideways trading ranges"
      ],
      rightPoints: [
        "Uptrend requires unbroken series of higher highs and higher lows",
        "Downtrend requires systematically lower highs and lower lows",
        "Awaits decisive violation of prior reaction swing low"
      ],
      hi_tts: "नौसिखिए अपनी भावनाओं से ट्रेंड का अंदाजा लगाते हैं, जबकि जॉन मर्फी स्पष्ट रूप से हायर हाई और हायर लो की सीढ़ी को ही अपट्रेंड मानते हैं।",
      en_sub: "Amateurs guess trend direction based on emotions, whereas John Murphy strictly defines an uptrend as an unbroken ladder of higher highs and higher lows."
    },
    sc4: {
      title: "The Three Trend Horizons & Volume Invariant",
      badge: "Trend Architecture · Time & Volume",
      cards: [
        { title: "The Three Trend Horizons", desc: "The primary trend dictates macro direction (>1 year), intermediate trend acts as corrective wave (3 weeks to 3 months), and minor trend is noise." },
        { title: "Volume Confirms Price", desc: "Volume must systematically expand as prices push toward new swing peaks and contract during corrective pullbacks toward troughs." }
      ],
      hi_tts: "ट्रेंड तीन स्तरों पर चलता है: प्राइमरी लहर, इंटरमीडिएट सुधार और माइनर शोर। तेजी में वॉल्यूम का बढ़ना ट्रेंड की ताकत साबित करता है।",
      en_sub: "Trends operate across three horizons: primary tide, intermediate wave, and minor noise. Expanding volume on rallies validates trend health."
    },
    sc6: {
      title: "Decisive Support Bounce vs Support Breakdown Cascade",
      badge: "Validation Invariant · Support Test vs Breakdown",
      leftTitle: "Authentic Support Floor Bounce",
      rightTitle: "Decisive Support Breakdown Cascade",
      leftPoints: [
        "Price approaches former reaction trough and reverses upward",
        "Volume contracts on the test and expands on the rebound",
        "Bullish candlestick rejection confirms buyer accumulation"
      ],
      rightPoints: [
        "Price penetrates support by >3% on explosive selling volume",
        "Two consecutive daily closes below the established floor",
        "Triggers automatic stop-loss cascade and trend reversal"
      ],
      hi_tts: "सच्चे सपोर्ट पर वॉल्यूम घटकर भाव पलट जाता है, लेकिन अगर भारी वॉल्यूम के साथ सपोर्ट टूट जाए तो बड़ी गिरावट शुरू हो जाती है।",
      en_sub: "At true support volume contracts as price rebounds, but if support is breached on heavy volume it triggers an immediate downward cascade."
    },
    sc7: {
      title: "Case Study · The Sideways Trading Range Pitfall",
      badge: "Market Regime · Trendless Congestion",
      cards: [
        { title: "The One-Third Trendless Reality", desc: "Markets spend approximately one-third of their time in trendless horizontal ranges where trend-following strategies suffer whipsaw losses." },
        { title: "Reaction Low Violation Invariant", desc: "Failure to reach a new peak is an early warning, but only a decisive break below the preceding reaction trough confirms trend reversal." }
      ],
      hi_tts: "बाजार एक-तिहाई समय किसी दिशा में नहीं चलता बल्कि सीमित दायरे में रहता है; जब तक पिछला निचला स्तर न टूटे, तब तक ट्रेंड खत्म नहीं माना जाता।",
      en_sub: "Markets spend roughly one-third of their time in horizontal ranges; never assume a trend reversal until the previous reaction trough is decisively broken."
    },
    sc8: {
      title: "Reward-to-Risk Ratio Framework",
      badge: "Capital Preservation · Risk Math",
      expression: "\\text{RRR} = \\frac{P_{\\text{target}} - P_{\\text{entry}}}{P_{\\text{entry}} - P_{\\text{stop}}} \\ge 3.0",
      latex: "\\text{RRR} = \\frac{P_{\\text{target}} - P_{\\text{entry}}}{P_{\\text{entry}} - P_{\\text{stop}}} \\ge 3.0",
      variables: [
        { symbol: "P_{\\text{target}}", label: "Objective Profit Target", unit: "₹", description: "The next overhead resistance level." },
        { symbol: "P_{\\text{entry}}", label: "Execution Entry Price", unit: "₹", description: "The entry price at validated support." },
        { symbol: "P_{\\text{stop}}", label: "Protective Stop-Loss Level", unit: "₹", description: "Placed objectively below the support trough." }
      ],
      hi_tts: "अनुशासित ट्रेडर केवल तभी ट्रेड लेते हैं जब संभावित मुनाफा जोखिम से कम से कम तीन गुना अधिक हो।",
      en_sub: "Disciplined technicians only initiate trades when the prospective profit potential is at least three times the stop-loss risk."
    },
    sc10: {
      hi_novice: "यानी अपट्रेंड सिर्फ बढ़ता भाव नहीं है, बल्कि हायर हाई और हायर लो की अटूट सीढ़ी है!",
      en_novice: "So an uptrend isn't just rising prices—it's an unbroken ladder of higher highs and higher lows!",
      hi_mentor: "बिल्कुल सही! जब तक बाजार खुद अपनी पिछली सीढ़ी को न तोड़े, तब तक ट्रेंड के साथ बने रहना ही मुनाफे की कुंजी है।",
      en_mentor: "Exactly! Until the market objectively breaks its prior reaction swing trough, staying with the trend is the secret to compound growth."
    }
  },

  ch04_part2: {
    sc3: {
      title: "Trading Against Polarity vs The Role Reversal Edge",
      badge: "Polarity Invariant · Role Reversal",
      leftTitle: "Fighting Broken Support Levels",
      rightTitle: "Executing Murphy's Principle of Polarity",
      leftPoints: [
        "Buys rallies straight into broken support levels",
        "Expects broken floors to immediately recover",
        "Crushed by trapped longs dumping shares to break even"
      ],
      rightPoints: [
        "Treats broken support as high-probability overhead resistance",
        "Shorts the return pullback into former support zone",
        "Places protective stops safely above the polarity pivot"
      ],
      hi_tts: "टूटा हुआ सपोर्ट हमेशा भविष्य का कड़ा रेजिस्टेंस बन जाता है, क्योंकि फंसे हुए खरीदार बिना नुकसान के निकलने के लिए बिकवाली करते हैं।",
      en_sub: "Broken support consistently transforms into formidable resistance, as trapped buyers flood the market with sell orders to break even."
    },
    sc4: {
      title: "Round Number Anchoring & Institutional Volume Floors",
      badge: "Behavioral Finance · Levels & Volume",
      cards: [
        { title: "Psychology of Round Numbers", desc: "Traders naturally anchor orders at round numbers like $50, $100, ₹1000, creating massive order clusters and psychological inflection zones." },
        { title: "Volume Anchors Polarity Strength", desc: "The greater the volume traded at a support level, the more powerful that level becomes as overhead resistance once broken." }
      ],
      hi_tts: "सौ या एक हजार जैसे राउंड नंबर्स पर प्राकृतिक रूप से भारी ऑर्डर्स होते हैं, और जिस लेवल पर जितना ज्यादा वॉल्यूम रहा हो, उसकी पोलैरिटी उतनी ही मजबूत होती है।",
      en_sub: "Round numbers naturally attract heavy stop and limit orders, and the heavier the volume at a broken level, the stronger its role reversal resistance."
    },
    sc6: {
      title: "Orderly Retracement Bounce vs Structural Trend Invalidation",
      badge: "Validation Invariant · Pullback vs Reversal",
      leftTitle: "Healthy 50% Retracement Bounce",
      rightTitle: "Fatal 66% Retracement Breakdown",
      leftPoints: [
        "Pullback halts cleanly near 38.2% or 50% retracement",
        "Volume dries up noticeably during the countertrend move",
        "Primary trend resumes with an explosion in buying volume"
      ],
      rightPoints: [
        "Correction cuts through 61.8% and exceeds 66% depth",
        "Heavy institutional volume accompanies the selloff",
        "Signals that the preceding impulse move has completely failed"
      ],
      hi_tts: "स्वस्थ तेजी में गिरावट पचास परसेंट पर रुक जाती है और वॉल्यूम घटता है, लेकिन अगर गिरावट छाछठ परसेंट से ज्यादा हो जाए तो ट्रेंड पलट जाता है।",
      en_sub: "In a healthy bull trend pullbacks halt cleanly near 50% on drying volume, but a retracement exceeding 66% signals structural trend failure."
    },
    sc7: {
      title: "Case Study · The Trapped Buyer Break-Even Cascade",
      badge: "Market Psychology · Cognitive Dissonance",
      cards: [
        { title: "The Break-Even Selling Wave", desc: "Traders who bought at support and suffered a breakdown experience relief when price retests that level, creating an impenetrable wall of supply." },
        { title: "Placing Stops Beyond Round Numbers", desc: "Smart money routinely hunts stops at round numbers; always place protective stops slightly beyond whole number clusters." }
      ],
      hi_tts: "सपोर्ट टूटने के बाद जब भाव वापस आता है, तो फंसे हुए लोग तुरंत बेचकर भागते हैं, जिससे वह स्तर मजबूत छत का काम करता है।",
      en_sub: "When price returns to broken support, trapped buyers immediately sell to break even, cementing the level as a solid overhead ceiling."
    },
    sc8: {
      title: "Dow Theory 50% Retracement Benchmark",
      badge: "Retracement Benchmark · Dow Geometry",
      expression: "P_{\\text{pivot}} = P_{\\text{high}} - 0.50 \\cdot (P_{\\text{high}} - P_{\\text{low}})",
      latex: "P_{\\text{pivot}} = P_{\\text{high}} - 0.50 \\cdot (P_{\\text{high}} - P_{\\text{low}})",
      variables: [
        { symbol: "P_{\\text{high}}", label: "Impulse Advance Peak", unit: "₹", description: "The highest high of the preceding directional wave." },
        { symbol: "P_{\\text{low}}", label: "Impulse Starting Base", unit: "₹", description: "The reaction trough where the advance originated." },
        { symbol: "0.50", label: "Half-Way Equilibrium Multiplier", unit: "ratio", description: "Dow's 50% equilibrium benchmark where major pullbacks predictably find support." }
      ],
      hi_tts: "पचास परसेंट रिट्रेसमेंट वह जादुई स्तर है जहां बाजार अक्सर संतुलन बनाकर अपनी मुख्य दिशा में दोबारा दौड़ना शुरू करता है।",
      en_sub: "The 50% retracement is the equilibrium level where markets predictably find balance before resuming their primary directional impulse."
    },
    sc10: {
      hi_novice: "यानी सपोर्ट टूटने पर वह खत्म नहीं होता, बल्कि फंसे हुए सेलर्स की मजबूत छत बन जाता है!",
      en_novice: "So once support breaks it doesn't vanish—it flips into a solid ceiling of trapped sellers!",
      hi_mentor: "बिल्कुल सही! पोलैरिटी का नियम मानवीय पछतावे और राहत की भावना को चार्ट के ठोस रेजिस्टेंस में बदल देता है।",
      en_mentor: "Precisely! The Principle of Polarity transforms human regret and break-even relief into objective technical resistance."
    }
  },

  ch04_part3: {
    sc3: {
      title: "Arbitrary Line Drawing vs The Murphy 3-Point Trendline Rule",
      badge: "Geometric Rigor · Trendline Validation",
      leftTitle: "Arbitrary Two-Point Guesses",
      rightTitle: "Murphy 3-Point Validated Trendline",
      leftPoints: [
        "Connects two random points and trades aggressively",
        "Draws unsustainable 70-degree lines across noise spikes",
        "Gets stopped out repeatedly on routine corrections"
      ],
      rightPoints: [
        "Two points establish a tentative line; third point confirms validity",
        "Focuses on the sustainable 45-degree angle of advance",
        "Provides an objective dynamic support floor and trailing stop"
      ],
      hi_tts: "दो बिंदु केवल एक अस्थायी रेखा बनाते हैं, जब तक तीसरा बिंदु उसे छूकर न पलटे, तब तक ट्रेंडलाइन को वैध नहीं माना जा सकता।",
      en_sub: "Two points create merely a tentative line; only a decisive third bounce confirms an authoritative, valid trendline."
    },
    sc4: {
      title: "The 45-Degree Gann Equilibrium & Parallel Channels",
      badge: "Geometric Balance · Equilibrium & Channels",
      cards: [
        { title: "The 45-Degree Equilibrium", desc: "A 45-degree trendline represents the ideal sustainable balance where the rate of price advance perfectly matches elapsed time." },
        { title: "Parallel Channel Profit Targets", desc: "Projecting a parallel line across intervening reaction peaks establishes dynamic overbought ceilings for systematic profit taking." }
      ],
      hi_tts: "पैंतालीस डिग्री की ट्रेंडलाइन समय और भाव का सटीक संतुलन दिखाती है, और पैरेलल चैनल लाइन ऊपर मुनाफा बुक करने का सही टारगेट देती है।",
      en_sub: "A 45-degree trendline reflects the ideal balance of price and time, while a parallel channel line provides dynamic profit-taking targets."
    },
    sc6: {
      title: "Decisive Trendline Bounce vs A Real Trendline Break",
      badge: "Validation Invariant · Test vs Penetration",
      leftTitle: "Authentic Dynamic Trendline Bounce",
      rightTitle: "Decisive Trendline Violation",
      leftPoints: [
        "Price pulls back to touch 45-degree support line",
        "Volume dries up significantly on the test",
        "Strong bullish candlestick resumes upward channel advance"
      ],
      rightPoints: [
        "Daily close penetrates trendline by >3% on expanding volume",
        "Subsequent pullback fails to climb back above the line",
        "Prior support line acts as overhead resistance ceiling"
      ],
      hi_tts: "सच्ची ट्रेंडलाइन पर वॉल्यूम घटकर भाव फिर ऊपर भागता है, लेकिन अगर तीन परसेंट से ज्यादा नीचे क्लोज हो जाए तो लाइन टूट जाती है।",
      en_sub: "At a valid trendline volume shrinks before price surges, but a daily close penetrating >3% on heavy volume confirms a genuine break."
    },
    sc7: {
      title: "Case Study · The Fan Principle in Major Reversals",
      badge: "Reversal Geometry · Three Fan Lines",
      cards: [
        { title: "The Steep Trendline Flattening", desc: "Steep 60-degree lines break easily; their violation merely flattens the trend toward the sustainable 45-degree angle without reversing." },
        { title: "The Three Fan Lines Rule", desc: "Only after three successively flatter trendlines have been drawn and decisively broken is a major primary trend reversal confirmed." }
      ],
      hi_tts: "फैन सिद्धांत के अनुसार जब तीन अलग-अलग ढलान वाली ट्रेंडलाइन्स एक-एक करके टूटती हैं, तभी बड़ा ट्रेंड रिवर्सल पक्का होता है।",
      en_sub: "Under Murphy's Fan Principle, only after three successively flatter trendlines are penetrated is a major primary trend reversal confirmed."
    },
    sc8: {
      title: "Channel Target Price Projection",
      badge: "Channel Geometry · Return Target",
      expression: "P_{\\text{channel}} = P_{\\text{line}} + (P_{\\text{peak}} - P_{\\text{base}})",
      latex: "P_{\\text{channel}} = P_{\\text{line}} + (P_{\\text{peak}} - P_{\\text{base}})",
      variables: [
        { symbol: "P_{\\text{line}}", label: "Current Up-Trendline Value", unit: "₹", description: "The current price level of the upward trendline support." },
        { symbol: "P_{\\text{peak}}", label: "Intervening Reaction Peak", unit: "₹", description: "The highest swing high reached between the two base points." },
        { symbol: "P_{\\text{base}}", label: "Initial Trendline Base", unit: "₹", description: "The starting reaction low used to draw the trendline." }
      ],
      hi_tts: "चैनल का फॉर्मूला ट्रेंडलाइन की चौड़ाई को आगे बढ़ाकर बताता है कि तेजी में अगला मुनाफा कहां बुक करना चाहिए।",
      en_sub: "The channel formula projects channel width forward to identify the exact dynamic ceiling for taking profits."
    },
    sc10: {
      hi_novice: "यानी सिर्फ एक तीखी ट्रेंडलाइन टूटने से मंदी नहीं आती, बल्कि तीनों फैन लाइन्स का टूटना जरूरी है!",
      en_novice: "So a single steep trendline violation isn't a reversal—I must wait for all three fan lines to break!",
      hi_mentor: "बिल्कुल सही! फैन सिद्धांत आपको समय से पहले मजबूत ट्रेंड के सामने खड़े होने और भारी घाटा उठाने से बचाता है।",
      en_mentor: "Exactly! The Fan Principle prevents you from stepping in front of powerful trends prematurely and taking severe losses."
    }
  },

  ch05_part1: {
    sc3: {
      title: "Premature Guessing vs Disciplined Neckline Confirmation",
      badge: "Pattern Discipline · Neckline Confirmation",
      leftTitle: "Anticipating the Right Shoulder",
      rightTitle: "Awaiting Decisive Neckline Break",
      leftPoints: [
        "Shorts while the right shoulder is still forming",
        "Assumes the pattern will complete based on visual hunch",
        "Wiped out if the stock breaks out to new all-time highs"
      ],
      rightPoints: [
        "Waits for a decisive daily closing break below the neckline",
        "Demands companion volume expansion on the breakdown",
        "Projects objective minimum measuring target from the head"
      ],
      hi_tts: "दाएं कंधे पर समय से पहले शॉर्ट करना आत्महत्या जैसा है; जब तक नेकलाइन नीचे न टूटे, तब तक हेड एंड शोल्डर्स पूरा नहीं होता।",
      en_sub: "Shorting prematurely on the right shoulder is dangerous; until the neckline is decisively penetrated, the pattern does not exist."
    },
    sc4: {
      title: "Volume Profile & Inverse Head & Shoulders Invariant",
      badge: "Volume Dynamics · Tops vs Bottoms",
      cards: [
        { title: "Volume Profile in Tops", desc: "Volume is heaviest on the left shoulder, diminishes on the head, and dries up dramatically on the right shoulder before breakdown." },
        { title: "The Bottoms Volume Surge Rule", desc: "While market tops can fall under their own weight, inverse bottoms require an unmistakable volume explosion to break out through the neckline." }
      ],
      hi_tts: "टॉप में दाएं कंधे पर वॉल्यूम सूख जाता है, लेकिन बॉटम में नेकलाइन तोड़ने के लिए भारी संस्थागत वॉल्यूम की जरूरत होती है।",
      en_sub: "In a top, volume dries up on the right shoulder, but in an inverse bottom an explosive volume surge is mandatory to complete the breakout."
    },
    sc6: {
      title: "Valid Neckline Breakdown & Retest vs Pattern Invalidation",
      badge: "Validation Invariant · Breakdown vs Invalidation",
      leftTitle: "Valid Breakdown & Return Move",
      rightTitle: "Pattern Invalidation (Bullish Continuation)",
      leftPoints: [
        "Decisive daily close below neckline on heavy turnover",
        "Orderly low-volume pullback retests broken neckline as resistance",
        "Resumes sharp downward plunge toward measuring target"
      ],
      rightPoints: [
        "Right shoulder fails to roll over and surges above the head",
        "Heavy institutional buying completely invalidates the formation",
        "Converts pattern into a powerful bullish continuation surge"
      ],
      hi_tts: "सच्चे ब्रेकडाउन में भाव नेकलाइन तोड़कर हल्का सा रीटेस्ट करता है और फिर गिरता है, जबकि फेल पैटर्न में सिर के ऊपर नया हाई बन जाता है।",
      en_sub: "In a valid breakdown price penetrates the neckline, retests it on light volume, and drops; in a failed pattern price surges to new highs."
    },
    sc7: {
      title: "Case Study · Neckline Slants & Measuring Reliability",
      badge: "Pattern Nuance · Slant & Objective Target",
      cards: [
        { title: "Neckline Slant Implications", desc: "An upward-slanted neckline shows residual buyer strength, whereas a downward-slanted neckline reflects extreme underlying institutional weakness." },
        { title: "The Measuring Target Minimum", desc: "The vertical distance from the top of the head to the neckline represents only the minimum target; major trends frequently travel much further." }
      ],
      hi_tts: "हेड से नेकलाइन तक की दूरी केवल न्यूनतम टारगेट होती है; असली गिरावट अक्सर उससे भी बहुत गहरी जाती है।",
      en_sub: "The vertical distance from head to neckline represents only the minimum target; major bear markets often travel substantially further."
    },
    sc8: {
      title: "Inverse Head & Shoulders Upward Measuring Target",
      badge: "Target Calculation · Inverse Head & Shoulders",
      expression: "P_{\\text{target}} = P_{\\text{neckline}} + (P_{\\text{neckline}} - P_{\\text{head}})",
      latex: "P_{\\text{target}} = P_{\\text{neckline}} + (P_{\\text{neckline}} - P_{\\text{head}})",
      variables: [
        { symbol: "P_{\\text{target}}", label: "Projected Upside Target", unit: "₹", description: "The minimum price objective following an inverse breakout." },
        { symbol: "P_{\\text{neckline}}", label: "Breakout Neckline Price", unit: "₹", description: "The price level where the neckline is penetrated." },
        { symbol: "P_{\\text{head}}", label: "Lowest Trough of Head", unit: "₹", description: "The deepest reaction low of the head formation." }
      ],
      hi_tts: "उलटे हेड एंड शोल्डर्स में नेकलाइन से हेड की गहराई नापकर ब्रेकआउट पॉइंट से ऊपर की ओर सटीक टारगेट निकाला जाता है।",
      en_sub: "In an inverse head and shoulders, measuring vertical depth from neckline to head projects the exact minimum upside price objective."
    },
    sc10: {
      hi_novice: "यानी हेड एंड शोल्डर्स सिर्फ तब बनता है जब नेकलाइन पर डेली क्लोजिंग मिले!",
      en_novice: "So a Head and Shoulders pattern only exists once the neckline breaks on a daily close!",
      hi_mentor: "बिल्कुल सही! पैटर्न पूरा होने से पहले अंदाजा लगाना जुआ है। नेकलाइन के ब्रेकआउट और वॉल्यूम का इंतजार करें।",
      en_mentor: "Precisely! Anticipating a pattern before completion is pure speculation. Await the objective neckline breakdown and volume."
    }
  },

  ch05_part2: {
    sc3: {
      title: "Calling Double Tops Early vs Awaiting Trough Breakdown",
      badge: "Reversal Discipline · Double Top vs Valley",
      leftTitle: "Calling Double Tops Prematurely",
      rightTitle: "Murphy Trough Breakdown Confirmation",
      leftPoints: [
        "Assumes two equal highs automatically guarantee a crash",
        "Shorts at the second peak before support floor breaks",
        "Steamrolled when price pauses briefly and explodes upward"
      ],
      rightPoints: [
        "Pattern is only a double top once the intervening trough breaks",
        "Second peak must form on visibly lower trading volume",
        "Minimum downside target calculated from trough breakdown"
      ],
      hi_tts: "दो बराबर हाई देखकर शॉर्ट करना गलती है; जब तक बीच की घाटी यानी सपोर्ट न टूटे, तब तक डबल टॉप कन्फर्म नहीं होता।",
      en_sub: "Shorting merely because prices hit two equal highs is a mistake; the pattern is unconfirmed until the intermediate valley breaks."
    },
    sc4: {
      title: "Triple Tops & The Violent V-Reversal Phenomenon",
      badge: "Reversal Variations · Triples & V-Spikes",
      cards: [
        { title: "Triple Tops vs Head & Shoulders", desc: "Triple tops feature three roughly equal peaks on systematically diminishing volume, representing a hybrid with head and shoulders formations." },
        { title: "The Violent V-Reversal Day", desc: "Occurs without transition consolidation, triggered by sudden climactic panic with a key reversal day, leaving an island gap behind." }
      ],
      hi_tts: "ट्रिपल टॉप में तीनों चोटियों पर वॉल्यूम घटता जाता है, जबकि वी-रिवर्सल बिना किसी ठहराव के अचानक एक ही दिन में पलट जाता है।",
      en_sub: "In triple tops volume declines across all three peaks, while violent V-reversals occur suddenly on a single climactic reversal day."
    },
    sc6: {
      title: "Authentic Double Top Breakdown vs Ascending Range Breakout",
      badge: "Validation Invariant · Double Top vs Continuation",
      leftTitle: "Authentic Double Top Breakdown",
      rightTitle: "Ascending Continuation Breakout",
      leftPoints: [
        "Second peak forms on visibly lower volume than first peak",
        "Decisive closing penetration below intermediate reaction valley",
        "Turnover expands sharply as stop-losses trigger below valley"
      ],
      rightPoints: [
        "Price pauses at prior high to absorb supply on light volume",
        "Explosive volume breakout surges above both peaks",
        "Converts former resistance into support, continuing uptrend"
      ],
      hi_tts: "सच्चे डबल टॉप में दूसरा पीक कमजोर वॉल्यूम पर बनता है और बीच का लो टूट जाता है, जबकि तेजी में रेजिस्टेंस टूटकर नया सपोर्ट बन जाता है।",
      en_sub: "In a real double top the second peak lacks volume and the valley breaks, whereas in a bull continuation resistance turns into fresh support."
    },
    sc7: {
      title: "Case Study · Rounding Saucer Bottoms & Measuring Target",
      badge: "Bottom Anatomy · Saucers & Measuring",
      cards: [
        { title: "The Saucer and Rounding Bottom", desc: "A slow, gradual shifting of the supply-demand balance over months, where the volume profile mirrors the gentle rounding bowl curve." },
        { title: "The Valley Measuring Rule", desc: "Measure the vertical distance from the twin peaks to the intervening valley floor, projecting that exact point distance down from the valley." }
      ],
      hi_tts: "राउंडिंग बॉटम में वॉल्यूम भी कटोरी की तरह धीरे-धीरे घूमता है, और डबल टॉप में दोनों चोटियों से घाटी की दूरी नीचे नापी जाती है।",
      en_sub: "In a rounding saucer bottom volume mirrors the gentle bowl shape, while double tops project peak-to-valley height down from the breakdown."
    },
    sc8: {
      title: "Double Bottom Upside Target Projection",
      badge: "Target Calculation · Double Bottom",
      expression: "P_{\\text{target}} = P_{\\text{peak}} + (P_{\\text{peak}} - P_{\\text{valley}})",
      latex: "P_{\\text{target}} = P_{\\text{peak}} + (P_{\\text{peak}} - P_{\\text{valley}})",
      variables: [
        { symbol: "P_{\\text{target}}", label: "Double Bottom Price Objective", unit: "₹", description: "The projected upside target following breakout." },
        { symbol: "P_{\\text{peak}}", label: "Intervening Reaction Peak", unit: "₹", description: "The price level of the reaction peak between the two troughs." },
        { symbol: "P_{\\text{valley}}", label: "Trough Support Floor", unit: "₹", description: "The lowest price level touched by the twin bottoms." }
      ],
      hi_tts: "डबल बॉटम में दोनों बॉटम्स और बीच के पीक की ऊंचाई नापकर ब्रेकआउट पॉइंट से ऊपर की तरफ लक्ष्य तय किया जाता है।",
      en_sub: "In a double bottom, measuring vertical distance from valley to intervening peak projects the exact upside price objective."
    },
    sc10: {
      hi_novice: "यानी दो बराबर चोटियां सिर्फ रेजिस्टेंस का टेस्ट हैं जब तक बीच का लो न टूटे!",
      en_novice: "So two equal peaks are just a test of resistance until the intervening valley floor breaks!",
      hi_mentor: "बिल्कुल सही! ज्यादातर संभावित डबल टॉप असल में तेजी का ठहराव साबित होते हैं। हमेशा घाटी के ब्रेकडाउन की पुष्टि करें।",
      en_mentor: "Exactly! Many apparent double tops turn out to be mere consolidation in a continuing bull trend. Always wait for the valley to break."
    }
  },

  ch06_part1: {
    sc3: {
      title: "Gambling Inside the Coiling Band vs The Two-Thirds Breakout Rule",
      badge: "Continuation Discipline · Triangle Breakout",
      leftTitle: "Gambling Inside the Converging Lines",
      rightTitle: "Disciplined Two-Thirds Breakout Execution",
      leftPoints: [
        "Takes heavy directional bets inside the converging lines",
        "Gets chopped up by contracting volatility and false probes",
        "Holds positions into the apex where price momentum dies"
      ],
      rightPoints: [
        "Awaits decisive breakout between 2/3 and 3/4 pattern width",
        "Demands companion volume expansion on breakout close",
        "Projects vertical base height from breakout level"
      ],
      hi_tts: "त्रिभुज के अंदर दांव लगाना जुआ है; जॉन मर्फी सिखाते हैं कि त्रिभुज की चौड़ाई के दो-तिहाई से तीन-चौथाई हिस्से में ही असली ब्रेकआउट होता है।",
      en_sub: "Trading inside converging lines is gambling; Murphy teaches that valid breakouts occur between two-thirds and three-quarters of pattern width."
    },
    sc4: {
      title: "Ascending vs Descending Triangles & Volume Coiling",
      badge: "Pattern Variations · Directional Bias & Volume",
      cards: [
        { title: "Ascending vs Descending Bias", desc: "Ascending triangles with a flat upper boundary and rising lows are bullish; descending triangles with a flat floor and falling highs are bearish." },
        { title: "Volume Diminution Toward Apex", desc: "Trading volume must contract steadily as price coils tighter toward the apex, reflecting drying liquidity before the explosive breakout." }
      ],
      hi_tts: "असेंडिंग त्रिभुज तेजी का संकेत है और डिसेंडिंग मंदी का; जैसे-जैसे भाव कोने की तरफ बढ़ता है, वॉल्यूम का सूखना जरूरी होता है।",
      en_sub: "Ascending triangles carry a bullish bias and descending triangles a bearish bias; volume must contract as price coils toward the apex."
    },
    sc6: {
      title: "Explosive Triangle Breakout vs Apex Exhaustion (Dead Pattern)",
      badge: "Validation Invariant · Breakout vs Apex Drift",
      leftTitle: "Authentic Dynamic Triangle Breakout",
      rightTitle: "Apex Exhaustion (Dead Pattern)",
      leftPoints: [
        "Decisive daily close beyond boundary at 2/3 to 3/4 point",
        "Dramatic volume surge confirms institutional capital commitment",
        "Dynamic acceleration toward vertical base height target"
      ],
      rightPoints: [
        "Price coils all the way to the apex without breaking out",
        "Pattern loses all technical power and energy dissipates",
        "Results in an erratic sideways drift rather than an explosive impulse"
      ],
      hi_tts: "सही समय पर वॉल्यूम के साथ ब्रेकआउट होने पर रॉकेट जैसी चाल आती है, लेकिन अगर भाव कोने तक पहुंच जाए तो पैटर्न की ताकत खत्म हो जाती है।",
      en_sub: "A timely breakout on heavy volume generates powerful momentum, but if price coils all the way to the apex its energy dissipates."
    },
    sc7: {
      title: "Case Study · The 4-Point Rule & Broadening Formations",
      badge: "Pattern Nuance · Reversal Points & Broadening",
      cards: [
        { title: "The 4 Reversal Points Rule", desc: "A valid triangle requires at least four reversal touches: two touches on the upper boundary and two touches on the lower boundary." },
        { title: "Broadening Formations (Inverted Triangles)", desc: "Unlike standard triangles, broadening formations feature diverging lines and erratic volume, signaling wild out-of-control market emotion." }
      ],
      hi_tts: "सच्चे त्रिभुज में कम से कम चार पॉइंट्स होने चाहिए: दो ऊपर और दो नीचे; और ब्रॉडनिंग फॉर्मेशन बेकाबू भावनाओं की निशानी होता है।",
      en_sub: "A valid triangle requires at least four reversal touches: two upper and two lower; broadening formations signal wild out-of-control emotion."
    },
    sc8: {
      title: "Optimal Triangle Breakout Time Window",
      badge: "Time Geometry · Breakout Timing",
      expression: "T_{\\text{breakout}} = [0.66 \\cdot W_{\\text{base}}, \\, 0.75 \\cdot W_{\\text{base}}]",
      latex: "T_{\\text{breakout}} = [0.66 \\cdot W_{\\text{base}}, \\, 0.75 \\cdot W_{\\text{base}}]",
      variables: [
        { symbol: "W_{\\text{base}}", label: "Total Pattern Base Width", unit: "days", description: "The horizontal distance in trading days from the first base point to the apex." },
        { symbol: "0.66", label: "Two-Thirds Minimum Threshold", unit: "ratio", description: "The earliest optimal timing window for a powerful directional breakout." },
        { symbol: "0.75", label: "Three-Quarters Maximum Boundary", unit: "ratio", description: "The latest point before pattern energy dissipates into apex noise." }
      ],
      hi_tts: "यह फॉर्मूला साबित करता है कि त्रिभुज का ब्रेकआउट चौड़ाई के छाछठ से पचहत्तर परसेंट समय के बीच ही होना चाहिए।",
      en_sub: "This formula demonstrates that a valid triangle breakout must occur between 66% and 75% of pattern width for maximum momentum."
    },
    sc10: {
      hi_novice: "यानी त्रिभुज स्प्रिंग की तरह ऊर्जा समेटता है, लेकिन ब्रेकआउट तीन-चौथाई हिस्से से पहले होना चाहिए!",
      en_novice: "So triangles coil energy like a spring, but the breakout must occur before three-quarters of the width!",
      hi_mentor: "बिल्कुल सही! अगर भाव बिल्कुल कोने तक घिसटता रहे तो पैटर्न बेकार हो जाता है। सही समय और वॉल्यूम ही ब्रेकआउट की जान हैं।",
      en_mentor: "Precisely! If price drifts all the way to the apex the pattern loses its power. Timely breakout and heavy volume are everything."
    }
  },

  ch06_part2: {
    sc3: {
      title: "Premature Exit on Flag Pullback vs The Half-Mast Edge",
      badge: "Continuation Discipline · Half-Mast Principle",
      leftTitle: "Selling During the Flag Pause",
      rightTitle: "Murphy Half-Mast Trading Execution",
      leftPoints: [
        "Sells winning positions during the low-volume flag pause",
        "Mistakes the brief orderly pause for a primary trend reversal",
        "Leaves the second half of an explosive impulse move on the table"
      ],
      rightPoints: [
        "Recognizes flags and pennants fly at the exact halfway midpoint",
        "Welcomes volume contraction as proof of healthy consolidation",
        "Adds to positions on breakout, targeting full flagpole height"
      ],
      hi_tts: "फ्लैग में कम वॉल्यूम देखकर डरना भारी भूल है; मर्फी समझाते हैं कि फ्लैग आधे रास्ते का पड़ाव है और आगे उतनी ही बड़ी चाल बाकी है।",
      en_sub: "Panicking over low volume during a flag is a major error; Murphy proves flags fly at half-mast, signaling an equal impulse ahead."
    },
    sc4: {
      title: "Flags, Pennants & Wedges Slanted Against the Trend",
      badge: "Continuation Formations · Slants & Time",
      cards: [
        { title: "Brief 1 to 3 Week Duration", desc: "Flags and pennants are high-velocity consolidation patterns that must resolve within 1 to 3 weeks; overstaying signals pattern failure." },
        { title: "Wedges Slant Against the Trend", desc: "A falling wedge in an uptrend is bullish; a rising wedge in a downtrend is bearish. Wedges always slant counter to the dominant trend." }
      ],
      hi_tts: "फ्लैग सिर्फ एक से तीन हफ्ते ही चलता है, और वेज हमेशा मुख्य ट्रेंड के उल्टे ढलान पर बनता है: गिरता हुआ वेज तेजी लाता है।",
      en_sub: "Flags resolve within one to three weeks, and wedges always slant against the prevailing trend: a falling wedge in an uptrend is bullish."
    },
    sc6: {
      title: "Confirmed Half-Mast Breakout vs Stale Consolidation Failure",
      badge: "Validation Invariant · Half-Mast vs Stale Range",
      leftTitle: "Confirmed Flag Breakout Surge",
      rightTitle: "Pattern Overstay Failure (>4 Weeks)",
      leftPoints: [
        "Price breaks flag boundary accompanied by explosive volume",
        "Velocity matches the steep angle of the initial flagpole",
        "Quickly achieves the equal measured move price objective"
      ],
      rightPoints: [
        "Consolidation drags on past four weeks into a sloppy range",
        "Initial impulse momentum completely dissipates",
        "Warns that the prior vertical run is exhausted"
      ],
      hi_tts: "सच्चे फ्लैग में ब्रेकआउट होते ही रॉकेट जैसी चाल दोबारा शुरू होती है, लेकिन अगर चार हफ्ते से ज्यादा खिंच जाए तो तेजी दम तोड़ देती है।",
      en_sub: "A true flag breakout reignites rapid upward velocity, but if consolidation drags past four weeks the advance loses its momentum."
    },
    sc7: {
      title: "Case Study · The Measured Move Swing Equality Rule",
      badge: "Wave Symmetry · Measured Moves",
      cards: [
        { title: "The Swing Equality Rule", desc: "In major multi-leg advances, the second impulse leg predictably equals the exact point distance of the first impulse leg (Wave 1 = Wave 2)." },
        { title: "Rectangles as Continuation Pauses", desc: "Rectangular trading ranges represent orderly pauses between waves; upon breakout, former resistance becomes reliable floor support." }
      ],
      hi_tts: "मेजर्ड मूव का नियम बताता है कि सुधार के बाद आने वाली दूसरी लहर पहली लहर जितनी ही लंबी होती है, जिससे सटीक टारगेट मिलता है।",
      en_sub: "The Measured Move rule demonstrates that the second impulse wave predictably equals the point distance of the first impulse wave."
    },
    sc8: {
      title: "The Measured Move Swing Equality Calculation",
      badge: "Wave Geometry · Measured Move",
      expression: "P_{\\text{wave 2 target}} = P_{\\text{pullback low}} + (P_{\\text{wave 1 top}} - P_{\\text{wave 1 base}})",
      latex: "P_{\\text{wave 2 target}} = P_{\\text{pullback low}} + (P_{\\text{wave 1 top}} - P_{\\text{wave 1 base}})",
      variables: [
        { symbol: "P_{\\text{wave 2 target}}", label: "Objective Wave 2 Target", unit: "₹", description: "The projected price target for the second impulse leg." },
        { symbol: "P_{\\text{pullback low}}", label: "Consolidation Valley Low", unit: "₹", description: "The lowest price level of the intervening corrective pause." },
        { symbol: "P_{\\text{wave 1 top}} - P_{\\text{wave 1 base}}", label: "First Impulse Height", unit: "₹", description: "The total point advance of the initial vertical flagpole advance." }
      ],
      hi_tts: "यह फॉर्मूला पहली लहर की पूरी ऊंचाई को करेक्शन के निचले स्तर से जोड़कर दूसरी लहर का सटीक लक्ष्य तय करता है।",
      en_sub: "This formula adds the vertical height of the first impulse leg to the pullback low to project the precise Wave 2 target."
    },
    sc10: {
      hi_novice: "यानी फ्लैग और पेनेन्ट आधे रास्ते का झंडा हैं, जो पूरी चाल का आधा पड़ाव दिखाते हैं!",
      en_novice: "So flags and pennants fly at half-mast, marking the exact midpoint of an explosive advance!",
      hi_mentor: "बिल्कुल सही! फ्लैग के दौरान कम वॉल्यूम से कभी मत डरिए। यह सिर्फ एक ठहराव है जो अगली बड़ी छलांग की तैयारी करता है।",
      en_mentor: "Precisely! Never fear low volume during a flag. It is merely the pause that refreshes before the second impulse surge."
    }
  }
};

/**
 * Builds the complete 12-scene episode payload for a chapter in either Hindi or English.
 */
export function buildMurphyChapterEpisode(chapterKey, courseSlug) {
  const spec = MURPHY_CHAPTER_SPECS[chapterKey];
  const bespoke = BESPOKE_SCENE_DATA[chapterKey];
  if (!spec || !bespoke) {
    throw new Error(`Missing spec or bespoke data for ${chapterKey}`);
  }

  const isEn = courseSlug.includes('_en');
  const novice = isEn ? 'Alex' : 'Raju';
  const mentor = isEn ? 'Marcus' : 'Sharma ji';
  const noviceAvatar = isEn ? 'A' : 'R';
  const mentorAvatar = isEn ? 'M' : 'S';

  const d = spec.dilemma;
  const tug = spec.tug;
  const pillars = spec.pillars;
  const f = spec.formula;
  const q = spec.quiz;
  const rules = spec.rules;

  // Scene 0 Beats (4 progressive beats)
  const sc0_beats = [
    {
      id: "b01",
      hindi_tts: isEn ? d.en_novice : d.hi_novice,
      en_subtitle: d.en_novice,
      en_narration: d.en_novice,
      pauseAfterMs: 400,
      ui_state: {
        stageDirections: [`— ${novice} asks about the core dilemma of ${spec.chapterTitle} —`],
        messages: [
          { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" }
        ]
      },
      visual: {
        kind: "conversation",
        data: {
          messages: [
            { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" }
          ]
        },
        semantics: { teachingObjective: "Present the core practical struggle and failure mode.", sourceFactIds: ["fact-01"] }
      }
    },
    {
      id: "b02",
      hindi_tts: isEn ? d.en_mentor_setup : d.hi_mentor_setup,
      en_subtitle: d.en_mentor_setup,
      en_narration: d.en_mentor_setup,
      pauseAfterMs: 450,
      ui_state: {
        stageDirections: [`— ${mentor} introduces the concrete situation & historical actors —`],
        messages: [
          { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" },
          { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_setup, theme: "teal", align: "right" }
        ]
      },
      visual: {
        kind: "conversation",
        data: {
          messages: [
            { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" },
            { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_setup, theme: "teal", align: "right" }
          ]
        },
        semantics: { teachingObjective: "Establish relatable situation and background context.", sourceFactIds: ["fact-01"] }
      }
    },
    {
      id: "b03",
      hindi_tts: isEn ? d.en_mentor_trap : d.hi_mentor_trap,
      en_subtitle: d.en_mentor_trap,
      en_narration: d.en_mentor_trap,
      pauseAfterMs: 450,
      ui_state: {
        stageDirections: [`— ${mentor} reveals the existential market trap & crisis —`],
        messages: [
          { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" },
          { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_setup, theme: "teal", align: "right" },
          { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_trap, theme: "rose", align: "right" }
        ]
      },
      visual: {
        kind: "conversation",
        data: {
          messages: [
            { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" },
            { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_setup, theme: "teal", align: "right" },
            { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_trap, theme: "rose", align: "right" }
          ]
        },
        semantics: { teachingObjective: "Expose why standard assumptions lead to blindside losses.", sourceFactIds: ["fact-02"] }
      }
    },
    {
      id: "b04",
      hindi_tts: isEn ? d.en_mentor_solution : d.hi_mentor_solution,
      en_subtitle: d.en_mentor_solution,
      en_narration: d.en_mentor_solution,
      pauseAfterMs: 500,
      ui_state: {
        stageDirections: [`— ${mentor} introduces the author's conceptual solution & invention —`],
        messages: [
          { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" },
          { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_setup, theme: "teal", align: "right" },
          { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_trap, theme: "rose", align: "right" },
          { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_solution, theme: "emerald", align: "right" }
        ]
      },
      visual: {
        kind: "conversation",
        data: {
          messages: [
            { sender: novice, avatar: noviceAvatar, text: d.en_novice, theme: "amber", align: "left" },
            { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_setup, theme: "teal", align: "right" },
            { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_trap, theme: "rose", align: "right" },
            { sender: mentor, avatar: mentorAvatar, text: d.en_mentor_solution, theme: "emerald", align: "right" }
          ]
        },
        semantics: { teachingObjective: "Formulate the author's breakthrough framework.", sourceFactIds: ["fact-03"] }
      }
    }
  ];

  // Scene 1 Beats (3 beats: Tug of War)
  const sc1_beats = [
    {
      id: "b05",
      hindi_tts: isEn
        ? `${tug.leftTitle}: on one side traders experience ${tug.leftLabel}.`
        : `बाजार में एक तरफ पुरानी मान्यताओं पर चलने वाले आम ट्रेडर होते हैं, जो बिना पुष्टि के आक्रामक दांव लगाते हैं।`,
      en_subtitle: `${tug.leftTitle}: on one side traders experience ${tug.leftLabel}.`,
      en_narration: `${tug.leftTitle}: on one side traders experience ${tug.leftLabel}.`,
      pauseAfterMs: 400,
      ui_state: {
        leftLabel: tug.leftLabel,
        rightLabel: tug.rightLabel,
        currentTension: 50
      },
      visual: {
        kind: "comparison",
        data: {
          leftColumn: { title: tug.leftTitle, points: [tug.leftLabel] },
          rightColumn: { title: tug.rightTitle, points: [tug.rightLabel] }
        },
        semantics: { teachingObjective: "Highlight the vulnerability of unconfirmed momentum.", sourceFactIds: ["fact-01"] }
      }
    },
    {
      id: "b06",
      hindi_tts: isEn
        ? `${tug.rightTitle}: on the opposing side stands ${tug.rightLabel}.`
        : `दूसरी तरफ तकनीकी नियमों पर चलने वाले अनुशासित चार्टिस्ट होते हैं, जो वास्तविक वॉल्यूम और पुष्टि का इंतजार करते हैं।`,
      en_subtitle: `${tug.rightTitle}: on the opposing side stands ${tug.rightLabel}.`,
      en_narration: `${tug.rightTitle}: on the opposing side stands ${tug.rightLabel}.`,
      pauseAfterMs: 400,
      ui_state: {
        leftLabel: tug.leftLabel,
        rightLabel: tug.rightLabel,
        currentTension: 40
      },
      visual: {
        kind: "comparison",
        data: {
          leftColumn: { title: tug.leftTitle, points: [tug.leftLabel] },
          rightColumn: { title: tug.rightTitle, points: [tug.rightLabel] }
        },
        semantics: { teachingObjective: "Demonstrate disciplined technical verification.", sourceFactIds: ["fact-02"] }
      }
    },
    {
      id: "b07",
      hindi_tts: isEn
        ? `Resolving this tension requires objective rules, creating ${tug.centerTitle}.`
        : `दोनों ताकतों के बीच संतुलन बनाकर ही बाजार में लंबे समय तक टिके रहकर पूंजी को सुरक्षित रखा जा सकता है।`,
      en_subtitle: `Resolving this tension requires objective rules, creating ${tug.centerTitle}.`,
      en_narration: `Resolving this tension requires objective rules, creating ${tug.centerTitle}.`,
      pauseAfterMs: 450,
      ui_state: {
        leftLabel: tug.leftLabel,
        rightLabel: tug.rightLabel,
        currentTension: 50
      },
      visual: {
        kind: "comparison",
        data: {
          leftColumn: { title: tug.leftTitle, points: [tug.leftLabel] },
          rightColumn: { title: tug.rightTitle, points: [tug.rightLabel] }
        },
        semantics: { teachingObjective: "Synthesize the tension into an objective decision filter.", sourceFactIds: ["fact-03"] }
      }
    }
  ];

  // Scene 2 Beats (4 beats: 4 Structural Pillars)
  const sc2_beats = [
    {
      id: "b08",
      hindi_tts: isEn
        ? `Pillar one: ${pillars[0].title}. ${pillars[0].desc}`
        : `पहला स्तंभ है इस अध्याय का बुनियादी सिद्धांत, जिसे गहराई से समझना सबसे ज्यादा आवश्यक है।`,
      en_subtitle: `Pillar one: ${pillars[0].title}. ${pillars[0].desc}`,
      en_narration: `Pillar one: ${pillars[0].title}. ${pillars[0].desc}`,
      pauseAfterMs: 420,
      ui_state: { activeCardIndex: 0, cards: pillars },
      visual: { kind: "cards", data: { cards: pillars }, semantics: { teachingObjective: "Introduce foundational pillar 1.", sourceFactIds: ["fact-01"] } }
    },
    {
      id: "b09",
      hindi_tts: isEn
        ? `Pillar two: ${pillars[1].title}. ${pillars[1].desc}`
        : `दूसरा स्तंभ है बाजार की संरचना और कार्यप्रणाली, जो हमें सही दिशा पहचानने में मदद करती है।`,
      en_subtitle: `Pillar two: ${pillars[1].title}. ${pillars[1].desc}`,
      en_narration: `Pillar two: ${pillars[1].title}. ${pillars[1].desc}`,
      pauseAfterMs: 420,
      ui_state: { activeCardIndex: 1, cards: pillars },
      visual: { kind: "cards", data: { cards: pillars }, semantics: { teachingObjective: "Introduce structural pillar 2.", sourceFactIds: ["fact-02"] } }
    },
    {
      id: "b10",
      hindi_tts: isEn
        ? `Pillar three: ${pillars[2].title}. ${pillars[2].desc}`
        : `तीसरा स्तंभ है जोखिम नियंत्रण और पुष्टि के सख्त नियम, जो नुकसान को सीमित रखते हैं।`,
      en_subtitle: `Pillar three: ${pillars[2].title}. ${pillars[2].desc}`,
      en_narration: `Pillar three: ${pillars[2].title}. ${pillars[2].desc}`,
      pauseAfterMs: 420,
      ui_state: { activeCardIndex: 2, cards: pillars },
      visual: { kind: "cards", data: { cards: pillars }, semantics: { teachingObjective: "Introduce analytical pillar 3.", sourceFactIds: ["fact-03"] } }
    },
    {
      id: "b11",
      hindi_tts: isEn
        ? `Pillar four: ${pillars[3].title}. ${pillars[3].desc}`
        : `चौथा स्तंभ है दीर्घकालिक अनुशासन, जो भावनात्मक निर्णयों को समाप्त करके सफलता दिलाता है।`,
      en_subtitle: `Pillar four: ${pillars[3].title}. ${pillars[3].desc}`,
      en_narration: `Pillar four: ${pillars[3].title}. ${pillars[3].desc}`,
      pauseAfterMs: 450,
      ui_state: { activeCardIndex: 3, cards: pillars },
      visual: { kind: "cards", data: { cards: pillars }, semantics: { teachingObjective: "Introduce confirmation pillar 4.", sourceFactIds: ["fact-04"] } }
    }
  ];

  // Scene 3 Beat (Split Comparison: Contrasting Models)
  const sc3_beat = {
    id: "b12",
    hindi_tts: isEn ? bespoke.sc3.en_sub : bespoke.sc3.hi_tts,
    en_subtitle: bespoke.sc3.en_sub,
    en_narration: bespoke.sc3.en_sub,
    pauseAfterMs: 420,
    ui_state: {
      leftTitle: bespoke.sc3.leftTitle,
      rightTitle: bespoke.sc3.rightTitle,
      leftPoints: bespoke.sc3.leftPoints,
      rightPoints: bespoke.sc3.rightPoints
    },
    visual: {
      kind: "comparison",
      data: {
        leftColumn: { title: bespoke.sc3.leftTitle, points: bespoke.sc3.leftPoints.slice(0, 2) },
        rightColumn: { title: bespoke.sc3.rightTitle, points: bespoke.sc3.rightPoints.slice(0, 2) }
      },
      semantics: { teachingObjective: "Contrast flawed assumption against disciplined technical rule.", sourceFactIds: ["fact-02", "fact-03"] }
    }
  };

  // Scene 4 Beat (Progressive Cards: Empirical Data)
  const sc4_beat = {
    id: "b13",
    hindi_tts: isEn ? bespoke.sc4.en_sub : bespoke.sc4.hi_tts,
    en_subtitle: bespoke.sc4.en_sub,
    en_narration: bespoke.sc4.en_sub,
    pauseAfterMs: 400,
    ui_state: {
      activeCardIndex: 0,
      cards: bespoke.sc4.cards
    },
    visual: {
      kind: "cards",
      data: { cards: bespoke.sc4.cards },
      semantics: { teachingObjective: "Provide empirical historical evidence supporting the principle.", sourceFactIds: ["fact-04", "fact-06"] }
    }
  };

  // Scene 5 Beat (Formula Breakdown: Primary Quantitative Proof)
  const sc5_beat = {
    id: "b14",
    hindi_tts: isEn
      ? `${f.title}: ${f.expression}. Understanding these variables ensures objective execution.`
      : `यह फॉर्मूला तकनीकी विश्लेषण में स्तरों और लक्ष्यों की गणना करने के लिए एक सटीक गणितीय आधार प्रदान करता है।`,
    en_subtitle: `${f.title}: ${f.expression}. Understanding these variables ensures objective execution.`,
    en_narration: `${f.title}: ${f.expression}. Understanding these variables ensures objective execution.`,
    pauseAfterMs: 420,
    ui_state: {
      title: f.title,
      expression: f.expression,
      latex: f.latex,
      variables: f.variables
    },
    visual: {
      kind: "formula",
      data: {
        title: f.title,
        expression: f.expression,
        latex: f.latex,
        variables: f.variables
      },
      semantics: { teachingObjective: "Provide exact mathematical calculation for this chapter.", sourceFactIds: ["fact-05"] }
    }
  };

  // Scene 6 Beat (Split Comparison: Valid vs False Signal)
  const sc6_beat = {
    id: "b15",
    hindi_tts: isEn ? bespoke.sc6.en_sub : bespoke.sc6.hi_tts,
    en_subtitle: bespoke.sc6.en_sub,
    en_narration: bespoke.sc6.en_sub,
    pauseAfterMs: 420,
    ui_state: {
      leftTitle: bespoke.sc6.leftTitle,
      rightTitle: bespoke.sc6.rightTitle,
      leftPoints: bespoke.sc6.leftPoints,
      rightPoints: bespoke.sc6.rightPoints
    },
    visual: {
      kind: "comparison",
      data: {
        leftColumn: { title: bespoke.sc6.leftTitle, points: bespoke.sc6.leftPoints.slice(0, 2) },
        rightColumn: { title: bespoke.sc6.rightTitle, points: bespoke.sc6.rightPoints.slice(0, 2) }
      },
      semantics: { teachingObjective: "Distinguish authentic market signals from false traps.", sourceFactIds: ["fact-07", "fact-08"] }
    }
  };

  // Scene 7 Beat (Progressive Cards: Case Study)
  const sc7_beat = {
    id: "b16",
    hindi_tts: isEn ? bespoke.sc7.en_sub : bespoke.sc7.hi_tts,
    en_subtitle: bespoke.sc7.en_sub,
    en_narration: bespoke.sc7.en_sub,
    pauseAfterMs: 400,
    ui_state: {
      activeCardIndex: 0,
      cards: bespoke.sc7.cards
    },
    visual: {
      kind: "cards",
      data: { cards: bespoke.sc7.cards },
      semantics: { teachingObjective: "Examine practical case study and critical execution rules.", sourceFactIds: ["fact-09", "fact-10"] }
    }
  };

  // Scene 8 Beat (Formula Breakdown: Secondary Geometric Rule / Target)
  const sc8_beat = {
    id: "b17",
    hindi_tts: isEn ? bespoke.sc8.en_sub : bespoke.sc8.hi_tts,
    en_subtitle: bespoke.sc8.en_sub,
    en_narration: bespoke.sc8.en_sub,
    pauseAfterMs: 420,
    ui_state: {
      title: bespoke.sc8.title,
      expression: bespoke.sc8.expression,
      latex: bespoke.sc8.latex,
      variables: bespoke.sc8.variables
    },
    visual: {
      kind: "formula",
      data: {
        title: bespoke.sc8.title,
        expression: bespoke.sc8.expression,
        latex: bespoke.sc8.latex,
        variables: bespoke.sc8.variables
      },
      semantics: { teachingObjective: "Deliver quantitative target projection or risk formula.", sourceFactIds: ["fact-11"] }
    }
  };

  // Scene 9 Beats (Interactive Quiz: exactly 3 beats complying with all validator invariants)
  const correctIdx = ['A', 'B', 'C', 'D'].indexOf(q.correctAnswer);
  const resolvedIdx = correctIdx >= 0 ? correctIdx : 1;
  const answerString = `${q.correctAnswer}) ${q.explanation}`;

  const sc9_beats = [
    {
      id: "b18",
      hindi_tts: isEn
        ? `Active recall scenario: ${q.question}`
        : `आइए इस परिदृश्य पर विचार करें और देखें कि इस स्थिति में अनुशासित ट्रेडर को क्या कदम उठाना चाहिए।`,
      en_subtitle: `Active recall scenario: ${q.question}`,
      en_narration: `Active recall scenario: ${q.question}`,
      pauseAfterMs: 400,
      ui_state: {
        question: q.question,
        options: q.options,
        correctIndex: resolvedIdx,
        showThinkingSpinner: false,
        answer: ""
      },
      visual: {
        kind: "quiz",
        data: {
          question: q.question,
          options: q.options,
          correctIndex: resolvedIdx
        },
        semantics: { teachingObjective: "Test practical application of chapter principles.", sourceFactIds: ["fact-12"] }
      }
    },
    {
      id: "b19",
      hindi_tts: isEn
        ? `Take a moment to consider the market evidence before revealing the correct choice.`
        : `सोचिए... क्या बिना तकनीकी पुष्टि के बाजार में जल्दबाजी से निर्णय लेना समझदारी है?`,
      en_subtitle: `Take a moment to consider the market evidence before revealing the correct choice.`,
      en_narration: `Take a moment to consider the market evidence before revealing the correct choice.`,
      pauseAfterMs: 450,
      ui_state: {
        question: q.question,
        options: q.options,
        correctIndex: resolvedIdx,
        showThinkingSpinner: true,
        answer: ""
      },
      visual: {
        kind: "quiz",
        data: {
          question: q.question,
          options: q.options,
          correctIndex: resolvedIdx
        },
        semantics: { teachingObjective: "Encourage active recall thinking.", sourceFactIds: ["fact-12"] }
      }
    },
    {
      id: "b20",
      hindi_tts: isEn
        ? `Correct choice is ${q.correctAnswer}. ${q.explanation}`
        : `सही विकल्प है ${q.correctAnswer}। तकनीकी विश्लेषण के नियमों का सख्ती से पालन करना ही पूंजी को सुरक्षित रखता है।`,
      en_subtitle: `Correct choice is ${q.correctAnswer}. ${q.explanation}`,
      en_narration: `Correct choice is ${q.correctAnswer}. ${q.explanation}`,
      pauseAfterMs: 400,
      ui_state: {
        question: q.question,
        options: q.options,
        correctIndex: resolvedIdx,
        showThinkingSpinner: false,
        answer: answerString
      },
      visual: {
        kind: "quiz",
        data: {
          question: q.question,
          options: q.options,
          correctIndex: resolvedIdx,
          answer: answerString
        },
        semantics: { teachingObjective: "Solidify active recall takeaway.", sourceFactIds: ["fact-12"] }
      }
    }
  ];

  // Scene 10 Beats (Chat Story: Mentor Cautionary Wisdom: 2 beats)
  const sc10_beats = [
    {
      id: "b21",
      hindi_tts: isEn ? bespoke.sc10.en_novice : bespoke.sc10.hi_novice,
      en_subtitle: bespoke.sc10.en_novice,
      en_narration: bespoke.sc10.en_novice,
      pauseAfterMs: 400,
      ui_state: {
        stageDirections: [`— ${novice} reflects on the core revelation —`],
        messages: [
          { sender: novice, avatar: noviceAvatar, text: bespoke.sc10.en_novice, theme: "amber", align: "left" }
        ]
      },
      visual: {
        kind: "conversation",
        data: {
          messages: [
            { sender: novice, avatar: noviceAvatar, text: bespoke.sc10.en_novice, theme: "amber", align: "left" }
          ]
        },
        semantics: { teachingObjective: "Consolidate novice takeaway connecting to opening dilemma.", sourceFactIds: ["fact-13"] }
      }
    },
    {
      id: "b22",
      hindi_tts: isEn ? bespoke.sc10.en_mentor : bespoke.sc10.hi_mentor,
      en_subtitle: bespoke.sc10.en_mentor,
      en_narration: bespoke.sc10.en_mentor,
      pauseAfterMs: 450,
      ui_state: {
        stageDirections: [`— ${mentor} emphasizes the inviolable execution rule —`],
        messages: [
          { sender: novice, avatar: noviceAvatar, text: bespoke.sc10.en_novice, theme: "amber", align: "left" },
          { sender: mentor, avatar: mentorAvatar, text: bespoke.sc10.en_mentor, theme: "teal", align: "right" }
        ]
      },
      visual: {
        kind: "conversation",
        data: {
          messages: [
            { sender: novice, avatar: noviceAvatar, text: bespoke.sc10.en_novice, theme: "amber", align: "left" },
            { sender: mentor, avatar: mentorAvatar, text: bespoke.sc10.en_mentor, theme: "teal", align: "right" }
          ]
        },
        semantics: { teachingObjective: "Deliver mentor's timeless trading desk rule.", sourceFactIds: ["fact-13"] }
      }
    }
  ];

  // Scene 11 Beats (Summary Thread: 6 beats, strict 8-rules sequence with activeStepRange)
  const sc11_beats = [
    {
      id: "b23",
      hindi_tts: isEn
        ? `First: ${rules[0]}.`
        : `आइए इस अध्याय के आठ प्रमुख सिद्धांतों की एक व्यवस्थित समीक्षा करें।`,
      en_subtitle: `First: ${rules[0]}`,
      en_narration: `First: ${rules[0]}`,
      pauseAfterMs: 400,
      ui_state: { steps: rules, activeStepRange: [0, 0], compactOverview: false },
      visual: { kind: "summary", data: { steps: rules, activeRange: [0, 0] }, semantics: { teachingObjective: "Summarize rule 1.", sourceFactIds: ["fact-01"] } }
    },
    {
      id: "b24",
      hindi_tts: isEn
        ? `Second and third: ${rules[1]} And ${rules[2]}`
        : `पहले और दूसरे नियम के अनुसार, बाजार की संरचना को समझकर हमेशा मुख्य ट्रेंड के साथ बने रहना चाहिए।`,
      en_subtitle: `Second and third: ${rules[1]} And ${rules[2]}`,
      en_narration: `Second and third: ${rules[1]} And ${rules[2]}`,
      pauseAfterMs: 420,
      ui_state: { steps: rules, activeStepRange: [1, 2], compactOverview: false },
      visual: { kind: "summary", data: { steps: rules, activeRange: [1, 2] }, semantics: { teachingObjective: "Summarize rules 2 and 3.", sourceFactIds: ["fact-02", "fact-03"] } }
    },
    {
      id: "b25",
      hindi_tts: isEn
        ? `Fourth and fifth: ${rules[3]} And ${rules[4]}`
        : `तीसरे और चौथे नियम के तहत, वॉल्यूम और दोनों सूचकांकों की आपसी पुष्टि के बिना कोई कदम न उठाएं।`,
      en_subtitle: `Fourth and fifth: ${rules[3]} And ${rules[4]}`,
      en_narration: `Fourth and fifth: ${rules[3]} And ${rules[4]}`,
      pauseAfterMs: 420,
      ui_state: { steps: rules, activeStepRange: [3, 4], compactOverview: false },
      visual: { kind: "summary", data: { steps: rules, activeRange: [3, 4] }, semantics: { teachingObjective: "Summarize rules 4 and 5.", sourceFactIds: ["fact-04", "fact-05"] } }
    },
    {
      id: "b26",
      hindi_tts: isEn
        ? `Sixth and seventh: ${rules[5]} And ${rules[6]}`
        : `पांचवें और छठे नियम के अनुसार, ब्रेकआउट की प्रामाणिकता जांचने के लिए क्लोजिंग फिल्टर का सख्ती से पालन करें।`,
      en_subtitle: `Sixth and seventh: ${rules[5]} And ${rules[6]}`,
      en_narration: `Sixth and seventh: ${rules[5]} And ${rules[6]}`,
      pauseAfterMs: 420,
      ui_state: { steps: rules, activeStepRange: [5, 6], compactOverview: false },
      visual: { kind: "summary", data: { steps: rules, activeRange: [5, 6] }, semantics: { teachingObjective: "Summarize rules 6 and 7.", sourceFactIds: ["fact-06", "fact-07"] } }
    },
    {
      id: "b27",
      hindi_tts: isEn
        ? `Eighth: ${rules[7]}`
        : `सातवें और आठवें नियम के तहत, हमेशा अपने स्टॉप लॉस का सम्मान करें और व्यक्तिगत धारणा से दूर रहें।`,
      en_subtitle: `Eighth: ${rules[7]}`,
      en_narration: `Eighth: ${rules[7]}`,
      pauseAfterMs: 450,
      ui_state: { steps: rules, activeStepRange: [7, 8], compactOverview: false },
      visual: { kind: "summary", data: { steps: rules, activeRange: [7, 8] }, semantics: { teachingObjective: "Summarize rule 8.", sourceFactIds: ["fact-08"] } }
    },
    {
      id: "b28",
      hindi_tts: isEn
        ? `These eight principles form the core foundation of ${spec.chapterTitle}.`
        : `ये आठों सिद्धांत किसी भी वित्तीय बाजार में दीर्घकालिक सफलता और अनुशासन की ठोस नींव हैं।`,
      en_subtitle: `These eight principles form the core foundation of ${spec.chapterTitle}.`,
      en_narration: `These eight principles form the core foundation of ${spec.chapterTitle}.`,
      pauseAfterMs: 500,
      ui_state: { steps: rules, activeStepRange: [1, 8], compactOverview: true },
      visual: { kind: "summary", data: { steps: rules, compactOverview: true }, semantics: { teachingObjective: "Present complete 8-rule blueprint.", sourceFactIds: ["fact-01", "fact-08"] } }
    }
  ];

  // Assemble full 12 scenes
  return {
    schemaVersion: "1.0.0",
    meta: {
      course: courseSlug,
      chapter: spec.chapter,
      chapterTitle: spec.chapterTitle,
      domain: "technical_analysis",
      primaryColor: "#B45309",
      accentColor: "#2563EB",
      narrationLanguage: isEn ? "en-US" : "hi-IN-devanagari"
    },
    scenes: [
      { segmentIndex: 0, title: `Origins & The Market Dilemma: ${spec.chapterTitle}`, template: "chat_story", badge: "Market Reality · Problem & Solution", beats: sc0_beats },
      { segmentIndex: 1, title: tug.title, template: "tug_of_war", badge: "Market Tension · Dual Forces", beats: sc1_beats },
      { segmentIndex: 2, title: `The 4 Core Analytical Pillars: ${spec.chapterTitle}`, template: "progressive_cards", badge: "Roadmap · 4 Structural Pillars", beats: sc2_beats },
      { segmentIndex: 3, title: bespoke.sc3.title, template: "split_comparison", badge: bespoke.sc3.badge, beats: [sc3_beat] },
      { segmentIndex: 4, title: bespoke.sc4.title, template: "progressive_cards", badge: bespoke.sc4.badge, beats: [sc4_beat] },
      { segmentIndex: 5, title: f.title, template: "formula_breakdown", badge: "Quantitative Rule · Formula", beats: [sc5_beat] },
      { segmentIndex: 6, title: bespoke.sc6.title, template: "split_comparison", badge: bespoke.sc6.badge, beats: [sc6_beat] },
      { segmentIndex: 7, title: bespoke.sc7.title, template: "progressive_cards", badge: bespoke.sc7.badge, beats: [sc7_beat] },
      { segmentIndex: 8, title: bespoke.sc8.title, template: "formula_breakdown", badge: "Quantitative Geometry · Target Formula", beats: [sc8_beat] },
      { segmentIndex: 9, title: "Active Recall Scenario", template: "interactive_quiz", badge: "Knowledge Check · Practical Application", beats: sc9_beats },
      { segmentIndex: 10, title: "Trading Desk Execution Rules", template: "chat_story", badge: "Mentor Wisdom · Capital Preservation", beats: sc10_beats },
      { segmentIndex: 11, title: "The Whole Picture: 8 Core Principles", template: "summary_thread", badge: "Synthesis · Core Execution Rules", beats: sc11_beats }
    ]
  };
}

// When executed directly, rebuild and save all 9 chapters for both Hindi and English
if (process.argv[1] && process.argv[1].endsWith('apply_murphy_chapter_fixes.mjs')) {
  console.log(`[REBUILD] Starting Murphy chapter overhaul across 9 corrupted chapters in Hindi & English...`);

  const courses = ['murphy_technical_analysis', 'murphy_technical_analysis_en'];

  for (const course of courses) {
    console.log(`\n--- Processing course: ${course} ---`);
    for (const ch of CHAPTER_KEYS) {
      const chDir = path.resolve('src/data/chapters', course, ch);
      if (!fs.existsSync(chDir)) {
        fs.mkdirSync(chDir, { recursive: true });
      }

      const ep = buildMurphyChapterEpisode(ch, course);
      const rawPath = path.join(chDir, 'episode_raw.json');
      fs.writeFileSync(rawPath, JSON.stringify(ep, null, 2), 'utf8');
      console.log(`  [OK] Saved ${course}/${ch}/episode_raw.json (12 bespoke scenes)`);
    }
  }

  console.log(`\n[COMPLETE] Successfully rebuilt 18 chapter episodes!`);
}
