// scripts/standardize_all_murphy_chapters.mjs
/**
 * Master Standardizer for ALL 35 Murphy Technical Analysis Chapters in both Hindi and English.
 * 
 * 1. English Course (murphy_technical_analysis_en):
 *    - Fully standardizes personas to Alex & Marcus across all dialogue, narration, stage directions, and cards.
 *    - Replaces all raw Devanagari or Hinglish in English episodes with clean, broadcast-grade English text.
 *    - Sets correct chapter titles, themes, and language codes.
 * 
 * 2. Hindi Course (murphy_technical_analysis):
 *    - Standardizes all on-screen UI presentation cards and chat bubbles into clean presentation English.
 *    - Eliminates all Romanized Hinglish from UI states.
 *    - Preserves pure Devanagari Hindi for spoken narration (hindi_tts) with Raju & Sharma ji.
 */

import fs from 'node:fs';
import path from 'node:path';

export const MURPHY_CHAPTER_TITLES = {
  orientation: "WHY READ THIS BOOK: BEGINNER'S GUIDE TO TECHNICAL ANALYSIS (JOHN J. MURPHY)",
  ch01_part1: "PHILOSOPHY OF TECHNICAL ANALYSIS: THE THREE PREMISES & TIMING",
  ch01_part2: "PHILOSOPHY: FLEXIBILITY, CHARTIST VS. TECHNICIAN & CRITICISMS",
  ch02_part1: "DOW THEORY: THE 6 BASIC TENETS & 3 TREND CLASSIFICATIONS",
  ch02_part2: "DOW THEORY: CONFIRMATION, VOLUME & REVERSAL SWINGS",
  ch03_part1: "CHART CONSTRUCTION: DAILY BAR, LINE, CANDLESTICK & POINT AND FIGURE",
  ch04_part1: "BASIC CONCEPTS OF TREND: PEAKS, TROUGHS & SUPPORT/RESISTANCE MECHANICS",
  ch04_part2: "SUPPORT & RESISTANCE: ROLE REVERSAL, ROUND NUMBERS & RETRACEMENTS",
  ch04_part3: "TRENDLINES, CHANNELS & THE FAN PRINCIPLE",
  ch05_part1: "MAJOR REVERSAL PATTERNS: HEAD AND SHOULDERS TOP & BOTTOM",
  ch05_part2: "DOUBLE & TRIPLE TOPS/BOTTOMS, SAUCERS & V-REVERSALS",
  ch06_part1: "CONTINUATION PATTERNS: SYMMETRICAL, ASCENDING & DESCENDING TRIANGLES",
  ch06_part2: "FLAGS, PENNANTS, WEDGES, RECTANGLES & MEASURED MOVES",
  ch07_part1: "VOLUME AND OPEN INTEREST: VOLUME PRECEDES PRICE & ACCUMULATION",
  ch07_part2: "VOLUME AND OPEN INTEREST: OPEN INTEREST DYNAMICS & FLOW CONFIRMATION",
  ch08_part1: "LONG-TERM CHARTS: SECULAR TRENDS, MONTHLY/WEEKLY CHARTS & SCALING",
  ch09_part1: "MOVING AVERAGES: SMA VS EMA, GOLDEN CROSS & TIME FILTERS",
  ch09_part2: "MOVING AVERAGES: BOLLINGER BANDS, ENVELOPES & ADAPTIVE SMOOTHING",
  ch10_part1: "OSCILLATORS & MOMENTUM: RSI, STOCHASTIC & OVERBOUGHT/OVERSOLD TRAPS",
  ch10_part2: "OSCILLATORS & MOMENTUM: MACD DIVERGENCES & CENTERLINE CROSSINGS",
  ch11_part1: "POINT AND FIGURE CHARTING: 3-BOX REVERSAL & HORIZONTAL COUNTS",
  ch12_part1: "JAPANESE CANDLESTICKS: REVERSAL & CONTINUATION FORMATIONS",
  ch13_part1: "ELLIOTT WAVE PRINCIPLE: 5-WAVE IMPULSE & 3-WAVE CORRECTIONS",
  ch13_part2: "ELLIOTT WAVE PRINCIPLE: FIBONACCI WAVE RATIOS & PRICE TARGETS",
  ch14_part1: "TIME CYCLES: DOMINANT CYCLES, HARMONIC RATIOS & SYNCHRONICITY",
  ch15_part1: "COMPUTERS AND TRADING SYSTEMS: WELLES WILDER'S ADX & PARABOLIC SAR",
  ch16_part1: "MONEY MANAGEMENT AND TRADING TACTICS: RISK CONTROL & 1:3 RRR",
  ch16_part2: "MONEY MANAGEMENT: POSITION SIZING & PROTECTIVE STOPS",
  ch17_part1: "INTERMARKET TECHNICAL ANALYSIS: STOCKS, BONDS, COMMODITIES & CURRENCIES",
  ch17_part2: "INTERMARKET ANALYSIS: SECTOR ROTATION & RELATIVE STRENGTH RATIOS",
  ch18_part1: "STOCK MARKET INDICATORS: ADVANCE-DECLINE LINE & MARKET BREADTH",
  ch19_part1: "COMPREHENSIVE REVIEW: JOHN MURPHY'S 20-POINT TRADING CHECKLIST",
  appendix_ab: "TECHNICAL TRADING SYSTEMS & CONTINUOUS FUTURES CONTRACTS",
  appendix_cd: "POINT AND FIGURE CONSTRUCTION & OPTIONS MARKET INDICATORS",
  synthesis: "DIALECTICAL SYNTHESIS: THE UNIFIED ARCHITECTURE OF TECHNICAL ANALYSIS"
};

// Precise translation map for all Romanized Hinglish strings across Murphy chapters
const HINGLISH_TRANSLATION_MAP = {
  // ch07_part1
  "Sharma ji! ₹450 resistance break ho gaya. Main full quantity buy kar raha hoon!":
    "The ₹450 resistance level has broken. I am buying full quantity!",
  "Ruko Raju! Price to upar gaya, par niche volume bars dekhe? Fuel ke bina gaadi kitni door chalegi?":
    "Wait! Price advanced, but look at the volume bars below. How far can a car travel without fuel?",
  "Sharma ji, breakout fail ho gaya! Price ₹432 pe close hua. Maine volume dekha hi nahi tha.":
    "The breakout failed! Price closed at ₹432. I never checked the volume confirmation.",
  "Hamesha yaad rakhna Raju: Price accelerator hai, par Volume petrol hai. Khali tanki ke saath breakout nahi, accident hota hai!":
    "Always remember: Price is the accelerator, but Volume is the fuel. A breakout on an empty tank causes a crash!",

  // ch07_part2
  "Sharma ji, market full bullish lag raha hai! Price lagatar upar jaa raha hai, fresh breakout pakka hai!":
    "The market looks strongly bullish! Prices are surging continuously toward a breakout!",
  "Raju, aankh khol ke Open Interest dekh! Price badh raha hai par total contracts 18 lakh kam ho gaye. Ye nayi buying nahi, majboor short sellers ki covering hai!":
    "Examine the Open Interest! Prices rose while open interest dropped by 1.8M contracts. This is short covering, not fresh institutional accumulation!",
  "Sharma ji, main breakout dekhte hi price ke peeche bhagta tha. Aaj samajh aaya ki OI dekhe bina trade lena andhere mein teer chalane jaisa hai.":
    "I used to chase breakouts blindly. Trading without open interest confirmation is operating in the dark.",
  "Bilkul Raju! Price dikhata hai ki market kahan hai, Volume batata hai kitni halchal hai, aur Open Interest batata hai ki naya paisa lene kaun khada hai!":
    "Price reveals location, Volume measures activity, and Open Interest proves whether fresh capital is entering the trend!",

  // ch08_part1
  "Sharma ji, daily chart pe clear breakout hai! Stock ₹620 cross kar gaya, ab to rocket banega!":
    "The daily chart shows a clean breakout above ₹620 resistance!",
  "Raju, zoom out karo! ₹625 par 10 saal purana secular multi-year resistance khada hai. Daily chart ka breakout monthly chart ki deewar se takra raha hai!":
    "Zoom out! Major 10-year secular resistance sits at ₹625. A daily breakout is colliding with a massive monthly barrier!",
  "Sharma ji, main hamesha 5-minute aur daily chart mein uljha rehta tha. Aaj pehli baar 10 saal ka monthly chart dekha to samajh aaya ki main kahan galat tha!":
    "I was trapped in intraday noise. Viewing the 10-year monthly chart exposed the major secular trend.",
  "Shaabash Raju! Telescope se rasta dekho aur microscope se pair rakho. Monthly chart tumhara telescope hai, aur daily chart microscope!":
    "Use the telescope to see the horizon, and the microscope for entry timing. The monthly chart is your telescope, and the daily chart is your microscope!",
  "Telescope se rasta, microscope se kadam! Ab bina Monthly aur Weekly level mark kiye ek bhi daily trade nahi loonga.":
    "Telescope for trend, microscope for execution! I will never take a daily trade without marking weekly and monthly levels.",
  "Yahi ek disciplined chartist ki pehchan hai!":
    "That is the defining mark of a disciplined chartist!",

  // ch09_part1
  "Sharma ji, 5-day moving average cross ho gaya! Maine turant buy order daal diya!":
    "The 5-day moving average just crossed over! I immediately placed a buy order!",
  "Sabar karo Raju! Itni chhoti moving average market ki har hichki pe signal degi. Ye smoothing device hai, koi magic crystal ball nahi!":
    "Patience! Such a short moving average generates whipsaws on minor noise. It is a smoothing tool, not a crystal ball!",
  "Sharma ji, aaj samajh aaya ki moving average trend batati hai, par konsa indicator whipsaw se bachayega?":
    "I understand moving averages follow trends, but which filter prevents costly whipsaw losses?",
  "Rule seedha hai Raju: Trend ke bina moving average andha indicator hai. Hamesha pehle trend confirm karo, double crossover ya time filter lagao, aur range mein ise chhooona bhi mat!":
    "Without an underlying trend, moving averages fail. Confirm the trend, apply dual crossovers or time filters, and avoid ranges!",

  // ch09_part2
  "Ise optimization nahi Raju, curve-fitting kehte hain! Market static nahi hai, badalti volatility ke liye dynamic bands aur adaptive tools chahiye!":
    "That is curve-fitting, not optimization! Markets are dynamic; shifting volatility demands adaptive bands and filters!",
  "Sharma ji, maine wo 19.3-day wali curve-fitted average hata di! Par real trading mein konsa band system sabse bharosemand hai?":
    "I removed the curve-fitted parameters. Which volatility band framework is most robust for live trading?",
  "Murphy kahta hai: Hamesha robust rules chuno! Bollinger Bands volatility cycle bataenge, Donchian's 4-week rule trend breakout pakadwayega, aur KAMA chop market mein tumhara account bachaega!":
    "Murphy advises choosing robust rules: Bollinger Bands gauge volatility cycles, Donchian channels confirm breakouts, and KAMA protects in chop!",

  // ch10_part1
  "Sharma ji, RSI 76 ho gaya! Textbook kehti hai 70 ke upar overbought hota hai. Maine top pe short maar diya!":
    "RSI reached 76! Textbooks state above 70 is overbought, so I initiated a short position at the top!",
  "Are Raju, shaktishaali uptrend mein RSI 80 ke upar hafton tak reh sakta hai! Oscillator ko trend ke khilaaf trade karna account khali karne ka sabse tezi rasta hai!":
    "In a powerful bull impulse, RSI can remain overbought for weeks! Trading oscillators against the primary trend depletes capital rapidly!",
  "Sharma ji, meri position kat gayi! Stock 4% aur upar chala gaya. Overbought dekh kar short karna itna bhari padega socha nahi tha.":
    "My position was stopped out! The stock rallied another 4%. Shorting purely on an overbought reading was a major error.",
  "Murphy ka golden rule yaad rakhna Raju: Bull market mein overbought signal ko ignore karo, sirf oversold dips pe buying dhundo. Trend hi tumhara sabse bada suraksha kavach hai!":
    "Murphy's rule: In a bull market, ignore overbought extremes and buy oversold pullbacks. The primary trend is your greatest protective shield!",
  "Are Raju, shaktishaali uptrend mein RSI hafte bhar 70-80 ke upar naach sakta hai! Trend ke khilaaf sirf overbought dekh kar short karna aatmghati hai!":
    "In a strong uptrend, RSI can remain above 70 for weeks! Shorting against the primary trend purely on an overbought reading is disastrous!",
  "Sharma ji! aaj ka loss mujhe hamesha yaad rahega. RSI 70 ke upar dekh kar andhadhundh short karna kitna bada bewakoofi bhara kadam tha!":
    "I will never forget today's lesson: blindly shorting an overbought reading without trend confirmation was a major mistake!",
  "Bas teen baatein yaad rakho Raju: Pehle Trend tay karo, phir Divergence ka intezar karo, aur aakhir mein Failure Swing ya Trendline break par hi trigger dabao!":
    "Remember three rules: Confirm the primary trend first, await clear divergence second, and execute only on a verified failure swing or trendline break!",

  // ch10_part2
  "Sharma ji, MACD line ne signal line ko niche cross kiya hai! Fresh sell signal hai, kya put options le loon?":
    "The MACD line crossed below the signal line! A fresh sell signal has formed; should I exit long positions?",
  "Raju, zero line dekho! Jab tak MACD zero line ke upar hai, trend bullish hai. Har crossover pe trade karoge to whipsaw mein phas jaoge!":
    "Check the centerline! While MACD remains above zero, the broader trend is bullish. Trading every crossover generates severe whipsaws!",
  "Sharma ji, MACD histogram ne zero line cross kar li aur divergence confirm ho gaya. Maine short position bana li hai.":
    "The MACD histogram crossed the zero line and confirmed bearish divergence. I initiated a disciplined short position.",
  "Shabash Raju! Crossover + Divergence + Zero Line confirmation—yahi triple filter setup high probability trades deta hai!":
    "Excellent! Crossover, divergence, and centerline confirmation together establish high-probability technical setups!",
  "Sharma ji! daily chart pe Stochastics %K ne %D ko cross kiya aur MACD histogram green ho gaya! Full quantity buy kar li!":
    "The daily Stochastics %K crossed above %D and MACD histogram turned green! I bought full quantity!",
  "Raju! Dailies ko akele dekhoge to andhere mein phasoge. Weekly chart par MACD zero line ke neeche dhal raha hai. Badi wave neeche ho to chhoti wave pe tairna jokhim hai!":
    "Looking at daily charts alone creates traps. Weekly MACD is sinking below the zero line. Swimming against the major tide is dangerous!",
  "Sharma ji! aaj sabak mil gaya. Main daily stochastic cross dekh kar khush ho raha tha, jabki weekly chart cheekh-cheekh kar mana kar raha tha!":
    "Lesson learned: I was chasing a daily stochastic cross while the weekly chart was screaming danger!",
  "Murphy kahta hai Raju: Weekly chart compass hai, daily oscillator ghadi hai. Pehle compass se disha dekho, phir ghadi se sahi waqt pe kadam badhao!":
    "Murphy teaches: The weekly chart is your compass, the daily oscillator is your watch. Use the compass for direction, and the watch for execution timing!",

  // ch11_part1
  "Sharma ji, Point and Figure chart pe double top breakout hua hai! Kya yahan direct buy kar sakte hain?":
    "Point and Figure chart shows a double top breakout! Can we initiate a long entry here?",
  "Raju, horizontal count calculate kiya? P&F ka sabse bada faayda target projection hai. Pehle target aur risk calculate karo!":
    "Have you calculated the horizontal count? The greatest advantage of Point and Figure is projecting objective price targets!",
  "Sharma ji, horizontal count se target ₹480 aaya aur stop loss ₹410 ke niche ban raha hai. Risk-reward 1:3 hai!":
    "The horizontal count projects a target of ₹480 with stop loss below ₹410, offering a 1:3 reward-to-risk ratio!",
  "Bahut badiya Raju! P&F time ko eliminate karke pure price action dikhata hai. Yahi timeless trading ka essence hai!":
    "Outstanding! Point and Figure filters out time noise to display pure price action, revealing timeless structural targets!",
  "Sharma ji! ₹640 par har minute candle badal rahi hai. Konsa breakout sachha hai aur konsa jhootha, kuch samajh nahi aa raha!":
    "Every minute candle is fluctuating wildly around ₹640. How do we filter genuine breakouts from noise?",
  "Yahi iska jaadu hai: jab tak price tay box size nahi badalta, chart ek inch aage nahi badhta!":
    "That is the power of Point & Figure: until price moves by the defined box size, the chart never moves forward!",
  "Samay chhod kar sirf daam dekhna seekh gaya main. Ab breakout tabhi manunga jab pura box bharega!":
    "I have learned to ignore time and focus purely on price. A breakout requires a complete box penetration!",

  // ch12_part1
  "Sharma ji, support par hammer bana hai! Kya main market order se turant buy kar loon?":
    "A hammer candlestick formed at key support! Should I buy immediately on a market order?",
  "Raju ruko! Hammer rejection dikhata hai par agle din ka confirmation candle zaroori hai. Bina confirmation candle ke entry lena jaldbaazi hai!":
    "Patience! A hammer signals potential demand rejection, but requires next-day confirmation before committing capital!",
  "Sharma ji, agle din bullish candle ne hammer ke high ko cross kar diya aur volume bhi badha! Maine stop loss hammer ke low ke niche lagaya hai.":
    "The next session crossed above the hammer's high on expanding volume! I placed my protective stop below the hammer low.",
  "Shaabash Raju! Candlestick psychology aur confirmation ka yeh combo hi professional chartists ko retail se alag karta hai!":
    "Superb! Combining candlestick psychology with objective confirmation distinguishes professional technicians from retail amateurs!",
  "Raju, pehle trend dekho! Uptrend ke top par lamba lower shadow hammer nahi, hanging man hota hai.":
    "Check the prior trend! A long lower shadow at the peak of an uptrend is a hanging man, not a hammer.",
  "Maine ₹420 pe long le liya hai, Sharma ji. Dekhte hain!":
    "I entered long at ₹420. Let's see how it plays out!",
  "Aaj meri aankhen khul gayi, Sharma ji! Maine sirf candle ka rang dekha, uska pichhla trend aur location bhool gaya.":
    "I only looked at the candlestick color, completely ignoring its preceding trend and location!",
  "Yahi farak hai retail trader aur disciplined chartist mein. Japani patterns ko hamesha Western support aur moving averages se filter karo.":
    "That is what separates professionals from amateurs. Always filter Japanese patterns through Western support and moving averages.",
  "Trend dictates the name, and Western filters confirm the trade. Kal se bina confirmation koi trade nahi!":
    "Trend dictates the name, and Western filters confirm the trade. No trade without confirmation!",

  // ch13_part1
  "Sharma ji, stock 5 wave bana chuka hai! Ab to yahan se guaranteed crash hoga na?":
    "The stock has completed 5 impulse waves! Is a major downward crash guaranteed from here?",
  "Raju, Elliott Wave mein Wave 5 extension bhi ho sakti hai! Pehle corrective wave ka confirmation dekho, blind prediction mat karo!":
    "Wave 5 can extend! Await clear corrective wave confirmation before assuming the entire advance has ended!",
  "Sharma ji, Wave 5 ke baad clear ABC correction shuru ho gaya hai. Wave A 5-wave structure mein breakdown de chuki hai.":
    "A clean ABC corrective structure has begun after Wave 5, with Wave A breaking down in a 5-wave impulse sequence.",
  "Sahi pakde Raju! Elliott Wave trend ki anatomy batata hai. Wave 3 sabse lambi hoti hai aur correction hamesha 3 waves mein hota hai!":
    "Precisely! Elliott Wave reveals trend anatomy: Wave 3 is typically the longest impulse, followed by a 3-wave correction!",
  "Par Sharma ji breakout clean hai... dekhiye ₹580 par order placed!":
    "The breakout looked clean at ₹580. Order placed!",
  "Samajh gaya Sharma ji! Wave 5 par greed me nahi, balki A-B-C complete hone par Wave 4 support par entry leni chahiye.":
    "I understand: avoid greed at Wave 5, and enter near Wave 4 support once the A-B-C correction completes.",

  // ch13_part2
  "Sharma ji, Wave 1 ₹100 ki thi aur Wave 2 ne 61.8% retrace kiya. Kya Wave 3 ka target ₹161.8 points ka hoga?":
    "Wave 1 was ₹100 and Wave 2 retraced 61.8%. Does Wave 3 project an objective target of 1.618 times Wave 1?",
  "Bilkul sahi Raju! Elliott Wave aur Fibonacci ka sangam yahi hai: Wave 3 aksar Wave 1 ka 1.618 guna hoti hai!":
    "Exactly! The union of Elliott Wave and Fibonacci confirms Wave 3 typically extends to 1.618 times Wave 1!",
  "Sharma ji, pehle main andhere mein target lagata tha, ab samajh aaya ki Wave 3 ka target 1.618 kyu hota hai!":
    "I used to guess price targets subjectively; now I understand why Wave 3 projects to the 1.618 Fibonacci ratio!",
  "Hamesha yaad rakhna Raju: Pehle Pattern pehchano, Ratio se level nikalo, aur Time se ghadi milao. Teenon milenge tabhi bada paisa banega!":
    "Remember: Identify pattern, calculate ratios, and measure time. When all three align, high-probability trades emerge!",
  "Raju, 'lagta hai' se market nahi chalta! Elliott Wave mein har target Fibonacci ratio se tay hota hai.":
    "Markets do not operate on subjective feelings! In Elliott Wave, price targets are strictly calculated using Fibonacci ratios.",
  "Kya Fibonacci sach mein bata sakta hai ki correction kahan thamegi?":
    "Can Fibonacci ratios objectively forecast where a market correction will terminate?",

  // ch14_part1
  "Sharma ji, Kesar Paints ₹450 par breakout de raha hai! Abhi enter kar leta hoon na?":
    "The stock is breaking out at ₹450 resistance! Should I enter immediately?",
  "Raju ruko! Price breakout dikha raha hai par time cycle peak par hai. Cycle top par buying hamesha fasati hai!":
    "Wait! Price shows a breakout, but the dominant time cycle is at its crest. Buying at cycle tops traps capital!",
  "Par volume dekhiye Sharma ji, maine ₹450 par buy order laga diya!":
    "Look at the volume; I placed the buy order at ₹450!",
  "Sharma ji, stock exact Day 40 par ₹395 ke trough par support le raha hai. Kya yeh buy zone hai?":
    "The stock is finding support at the ₹395 trough on Day 40. Is this an optimal cycle buy zone?",
  "Shabash Raju! Synchronicity rule ke hisaab se 20-day aur 40-day cycle ek sath bottom bana rahi hain. Yahan stop loss chota aur reward bada hota hai!":
    "Outstanding! Under the principle of synchronicity, 20-day and 40-day cycles are troughing simultaneously, providing low risk and high reward!",
  "Aage se main Price ke saath Time Cycle bhi dekhunga: Buy the synchronized trough, sell the crest!":
    "From now on I will harmonize price with time cycles: Buy the synchronized trough, sell the crest!",

  // ch15_part1
  "Sharma ji, maine 6 indicators combine karke perfect bot banaya hai. Kesar Paints ₹320 par buy signal de raha hai!":
    "I combined six indicators into a trading model. It is flashing a buy signal at ₹320!",
  "Raju ruko! Market sideways hai aur tum trend-following tools use kar rahe ho. ADX dekhe bina entry whipsaw degi!":
    "Wait! The market is in a horizontal range, yet you are applying trend tools. Without ADX confirmation, whipsaws are inevitable!",
  "Par system mechanical hai Sharma ji, emotionless execution! Order ₹320 par chala gaya.":
    "The system is mechanical and emotionless! The order was executed at ₹320.",
  "Bahut badiya Raju! Wilder ka yahi magic hai. ADX trend confirm karta hai, aur Parabolic SAR trailing stop ko protect karta hai.":
    "That is Welles Wilder's breakthrough: ADX confirms trend strength, while Parabolic SAR dynamically trails protective stops.",

  // ch17_part2
  "Sharma ji! Kesar Paints ka chart dekhiye! ₹340 par perfect double bottom breakout hua hai, maine full quantity buy kar li!":
    "Look at this chart! A double bottom breakout formed at ₹340, and I bought full quantity!",
  "Raju, stock chart dekhne se pehle sector dekha? Crude oil 10% ucchal chuka hai aur pura Paints sector breakdown ho raha hai!":
    "Did you check the sector first? Crude oil surged 10%, causing the entire industry group to break down!",
  "Lekin company badhiya hai sir! Kya akele share ka pattern pure sector ko beat nahi kar sakta?":
    "The stock is fundamentally strong! Can an isolated stock pattern override negative sector momentum?",
  "Sharma ji, maine galti samajh li! Kesar Paints ₹340 par akela pattern bana raha tha, par Paints vs Nifty ratio pichle 2 mahine se downtrend mein tha!":
    "I realize my error: the individual stock looked fine, but its relative strength ratio against the benchmark index was declining!",
  "Kal se pakka rule: Nifty trend -> Sector RS breakout -> Leader stock pattern. Flow ke saath chalunga, flow ke khilaaf nahi!":
    "The rule is strict: Market trend first, industry group relative strength second, leading stock pattern third!",

  // ch19_part1
  "Raju, sirf ek moving average dekh kar trade le liya? Weekly trend, volume aur resistance checklist check ki?":
    "Did you enter purely on a single moving average? Did you review the weekly trend, volume, and resistance checklist?",
  "Checklist? Mujhe laga signal milte hi buy karna kafi hota hai!":
    "Checklist? I assumed entering on a moving average crossover was sufficient!",
  "Sharma ji, ab maine Murphy ki 20-point checklist print karke desk par laga li hai!":
    "I have printed John Murphy's 20-point trading checklist and placed it directly on my trading desk!",
  "Shabash Raju! Technical analysis prediction ka jadu nahi, disciplined checklist aur risk management ka science hai.":
    "Well done! Technical analysis is not fortune-telling; it is the discipline of checklists and rigorous risk control.",
  "Bilkul Sharma ji! Jab tak poori checklist green na ho, main ek rupya bhi risk par nahi lagaunga.":
    "Agreed! Until every critical checklist filter is verified, I will not commit trading capital."
};

/**
 * Deep recursive string replacer / cleaner
 */
function deepCleanObject(obj, isEn) {
  if (typeof obj === 'string') {
    let s = obj;
    if (HINGLISH_TRANSLATION_MAP[s]) {
      s = HINGLISH_TRANSLATION_MAP[s];
    }
    if (isEn) {
      s = s.replace(/\bRaju\b/g, 'Alex')
           .replace(/\bSharma ji\b/gi, 'Marcus')
           .replace(/\bSharmaji\b/gi, 'Marcus');
    }
    return s;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepCleanObject(item, isEn));
  }
  if (obj && typeof obj === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
      if (isEn && k === 'avatar') {
        if (v === 'R') res[k] = 'A';
        else if (v === 'S') res[k] = 'M';
        else res[k] = v;
      } else if (isEn && k === 'sender') {
        if (/raju/i.test(v)) res[k] = 'Alex';
        else if (/sharma/i.test(v)) res[k] = 'Marcus';
        else res[k] = deepCleanObject(v, isEn);
      } else {
        res[k] = deepCleanObject(v, isEn);
      }
    }
    return res;
  }
  return obj;
}

/**
 * Standardize an episode for either Hindi or English.
 */
export function standardizeEpisode(episode, courseSlug, chapterKey) {
  const isEn = courseSlug.includes('_en');
  const formattedTitle = MURPHY_CHAPTER_TITLES[chapterKey] || episode.meta?.chapterTitle || chapterKey.toUpperCase();

  const match = chapterKey.match(/ch0?(\d+)[_.-]*(?:part|p)0?(\d+)/i);
  const chapterDisplay = match
    ? `CHAPTER ${parseInt(match[1], 10)} · PART ${parseInt(match[2], 10)}`
    : (chapterKey.toLowerCase().includes('orientation') ? 'ORIENTATION' : chapterKey.toLowerCase().includes('synthesis') ? 'SYNTHESIS' : chapterKey.toUpperCase().replace(/_/g, ' '));

  episode.schemaVersion = "1.0.0";
  episode.meta = {
    ...episode.meta,
    course: courseSlug,
    chapter: chapterDisplay,
    chapterTitle: formattedTitle,
    domain: "technical_analysis",
    primaryColor: "#B45309",
    accentColor: "#2563EB",
    narrationLanguage: isEn ? "en-US" : "hi-IN-devanagari"
  };

  // Perform deep clean across all scenes
  episode.scenes = deepCleanObject(episode.scenes, isEn);

  // Additional pass for beats in English to fix hindi_tts
  if (isEn) {
    (episode.scenes || []).forEach(scene => {
      (scene.beats || []).forEach(beat => {
        if (/[\u0900-\u097F]/.test(beat.hindi_tts || '')) {
          beat.hindi_tts = beat.en_narration || beat.en_subtitle || beat.dialogue || beat.text || '';
        }
        if (beat.hindi_tts) {
          beat.hindi_tts = beat.hindi_tts
            .replace(/\bRaju\b/g, 'Alex')
            .replace(/\bSharma ji\b/gi, 'Marcus')
            .replace(/\bSharmaji\b/gi, 'Marcus');
        }
      });
    });
  }

  return episode;
}

// CLI Execution
if (process.argv[1] && process.argv[1].endsWith('standardize_all_murphy_chapters.mjs')) {
  console.log(`[STANDARDIZE] Processing ALL 35 chapters across Murphy Hindi & English courses...`);

  const courses = ['murphy_technical_analysis', 'murphy_technical_analysis_en'];

  for (const course of courses) {
    const baseDir = path.resolve('src/data/chapters', course);
    if (!fs.existsSync(baseDir)) continue;

    const chs = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory() && f !== 'test_run');
    console.log(`\n=== Course: ${course} (${chs.length} chapters) ===`);

    for (const ch of chs) {
      const rawPath = path.join(baseDir, ch, 'episode_raw.json');
      if (!fs.existsSync(rawPath)) continue;

      const ep = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
      const standardized = standardizeEpisode(ep, course, ch);

      fs.writeFileSync(rawPath, JSON.stringify(standardized, null, 2), 'utf8');
      console.log(`  [OK] Standardized ${course}/${ch}`);
    }
  }

  console.log(`\n[COMPLETE] Standardized all 70 Murphy course chapter files!`);
}
