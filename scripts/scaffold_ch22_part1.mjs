import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch22_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch22_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Exotic Options & Nonstandard Swaps",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Exotic Options & Nonstandard Swaps",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: Beyond Plain Vanilla Options";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, corporations standard vanilla options ki jagah exotic options kyu pasand karti hain?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, कॉरपोरेशन्स स्टैंडर्ड वैनिला ऑप्शंस की जगह एग्जॉटिक ऑप्शंस क्यों पसंद करती हैं?";
  rawHindi.scenes[0].beats[1].text = "Raju, exotic options customized hote hain, jinme premium sasta hota hai aur company ke cash flows ke saath perfect match banta hai!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, एग्जॉटिक ऑप्शंस कस्टमाइज्ड होते हैं, जिनमें प्रीमियम सस्ता होता है और कंपनी के कैश फ्लो के साथ परफेक्ट मैच बनता है!";

  rawEn.scenes[0].title = "Origins: Beyond Plain Vanilla Options";
  rawEn.scenes[0].beats[0].text = "Sharma ji, why do institutional treasurers choose customized exotic options over standard exchange-traded vanilla contracts?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, why do institutional treasurers choose customized exotic options over standard exchange-traded vanilla contracts?";
  rawEn.scenes[0].beats[1].text = "Raju, exotic options offer cheaper premiums and tailor payoff profiles directly to underlying business risks.";
  rawEn.scenes[0].beats[1].dialogue = "Raju, exotic options offer cheaper premiums and tailor payoff profiles directly to underlying business risks.";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Standard Exchange Contracts vs Tailored OTC Exotics";
  rawHindi.scenes[1].beats[0].text = "Standard options high liquidity dete hain, jabki exotic options tailored payoffs ke saath premium cost kam karte hain.";
  rawHindi.scenes[1].beats[0].hindi_tts = "स्टैंडर्ड ऑप्शंस हाई लिक्विडिटी देते हैं, जबकि एग्जॉटिक ऑप्शंस टेलर्ड पेऑफ के साथ प्रीमियम कॉस्ट कम करते हैं।";

  rawEn.scenes[1].title = "Standard Exchange Contracts vs Tailored OTC Exotics";
  rawEn.scenes[1].beats[0].text = "While vanilla exchange contracts maximize liquidity, exotic options minimize premium expense through customized boundaries.";
  rawEn.scenes[1].beats[0].dialogue = "While vanilla exchange contracts maximize liquidity, exotic options minimize premium expense through customized boundaries.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Barrier Options", body: "Knock-in and knock-out structures activated or extinguished at boundary H." },
    { title: "2. Asian Options", body: "Payoffs tied to average price S_avg, dampening volatility and lowering premium." },
    { title: "3. Binary & Chooser", body: "Discontinuous all-or-nothing digital cashflows and flexible post-launch choice." },
    { title: "4. Leveraged Swaps", body: "Complex non-linear spread formulas introducing severe tail sensitivity." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Exotic Derivatives";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: barrier options, Asian options, binary/chooser options, aur leveraged swaps.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: बैरियर ऑप्शंस, एशियन ऑप्शंस, बाइनरी और चूजर ऑप्शंस, और लीवरेज्ड स्वैप्स।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Exotic Derivatives";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: barrier options, Asian averaging, binary choices, and non-linear leveraged swaps.";
  rawEn.scenes[2].beats[0].dialogue = "We explore four foundational pillars: barrier options, Asian averaging, binary choices, and non-linear leveraged swaps.";

  // Scene 3: Comparison - Barrier vs Lookback
  const leftBarrier = {
    title: "Barrier Options (Path Triggered)",
    items: [
      "Knock-in activates when asset touches H",
      "Knock-out extinguishes when asset touches H",
      "Substantially cheaper premium than plain vanilla"
    ]
  };
  const rightLookback = {
    title: "Lookback Options (Extremum Path)",
    items: [
      "Floating strike: pays S_T - S_min at expiration",
      "Fixed strike: pays max(S_max - K, 0)",
      "Significantly more expensive due to ideal market timing"
    ]
  };
  rawHindi.scenes[3].title = "Barrier Options (In-Out Parity) vs Lookback Extremum Options";
  rawHindi.scenes[3].beats[0].ui_state.left = leftBarrier;
  rawHindi.scenes[3].beats[0].ui_state.right = rightLookback;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftBarrier;
    rawHindi.scenes[3].beats[0].visual.data.right = rightLookback;
  }
  rawHindi.scenes[3].beats[0].text = "बैरियर ऑप्शंस रास्ते में एक लेवल छूने पर ऑन या ऑफ होते हैं, जबकि लुकबैक ऑप्शन पूरे जीवन के सबसे ऊंचे या निचले दाम का फायदा देते हैं।";
  rawHindi.scenes[3].beats[0].hindi_tts = "बैरियर ऑप्शंस रास्ते में एक लेवल छूने पर ऑन या ऑफ होते हैं, जबकि लुकबैक ऑप्शन पूरे जीवन के सबसे ऊंचे या निचले दाम का फायदा देते हैं।";

  rawEn.scenes[3].title = "Barrier Options (In-Out Parity) vs Lookback Extremum Options";
  rawEn.scenes[3].beats[0].ui_state.left = leftBarrier;
  rawEn.scenes[3].beats[0].ui_state.right = rightLookback;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftBarrier;
    rawEn.scenes[3].beats[0].visual.data.right = rightLookback;
  }
  rawEn.scenes[3].beats[0].text = "Barrier options activate or extinguish upon touching trigger level H, while lookbacks exploit historical price extrema at premium cost.";
  rawEn.scenes[3].beats[0].dialogue = "Barrier options activate or extinguish upon touching trigger level H, while lookbacks exploit historical price extrema at premium cost.";

  // Scene 4: Formula Breakdown - Barrier In-Out Parity
  rawHindi.scenes[4].title = "Barrier Option In-Out Parity Law";
  rawHindi.scenes[4].beats[0].text = "इन-आउट पैरिटी नियम के अनुसार, नॉक-इन ऑप्शन और नॉक-आउट ऑप्शन की कीमतों का जोड़ ठीक वैनिला ऑप्शन की कीमत के बराबर होता है।";
  rawHindi.scenes[4].beats[0].hindi_tts = "इन-आउट पैरिटी नियम के अनुसार, नॉक-इन ऑप्शन और नॉक-आउट ऑप्शन की कीमतों का जोड़ ठीक वैनिला ऑप्शन की कीमत के बराबर होता है।";

  rawEn.scenes[4].title = "Barrier Option In-Out Parity Law";
  rawEn.scenes[4].beats[0].text = "In-out parity states that the sum of a knock-in option and an otherwise identical knock-out option precisely equals the plain vanilla price.";
  rawEn.scenes[4].beats[0].dialogue = "In-out parity states that the sum of a knock-in option and an otherwise identical knock-out option precisely equals the plain vanilla price.";

  // Scene 5: Case Study - Snapshot 22.4 P&G Swap
  rawHindi.scenes[5].title = "Business Snapshot 22.4: Procter & Gamble's $157M Leveraged Swap Disaster";
  rawHindi.scenes[5].beats[0].text = "1993 में प्रॉक्टर एंड गैंबल ने बैंकर्स ट्रस्ट के साथ 200 मिलियन का कॉम्प्लेक्स लीवरेज्ड स्वैप किया, जिसमें 1994 में ब्याज दरें बढ़ते ही 157 मिलियन डॉलर का नुकसान हुआ।";
  rawHindi.scenes[5].beats[0].hindi_tts = "1993 में प्रॉक्टर एंड गैंबल ने बैंकर्स ट्रस्ट के साथ 200 मिलियन का कॉम्प्लेक्स लीवरेज्ड स्वैप किया, जिसमें 1994 में ब्याज दरें बढ़ते ही 157 मिलियन डॉलर का नुकसान हुआ।";

  rawEn.scenes[5].title = "Business Snapshot 22.4: Procter & Gamble's $157M Leveraged Swap Disaster";
  rawEn.scenes[5].beats[0].text = "In Business Snapshot 22.4, Procter & Gamble lost $157 million on a Bankers Trust leveraged swap when rising 1994 rates triggered non-linear gearing.";
  rawEn.scenes[5].beats[0].dialogue = "In Business Snapshot 22.4, Procter & Gamble lost $157 million on a Bankers Trust leveraged swap when rising 1994 rates triggered non-linear gearing.";

  // Scene 6: Split Comparison - Asian vs Vanilla
  const leftAsian = {
    title: "Asian Options (Average Price)",
    items: [
      "Payoff based on average asset price S_avg",
      "Variance of average is strictly lower: sigma / sqrt(3)",
      "Eliminates expiration date pinning and market manipulation"
    ]
  };
  const rightVanilla = {
    title: "Vanilla European Options",
    items: [
      "Payoff based solely on terminal spot price S_T",
      "Full underlying market volatility sigma",
      "Higher premium cost for corporate hedgers"
    ]
  };
  rawHindi.scenes[6].title = "Asian Average Options vs Vanilla European Volatility Damping";
  rawHindi.scenes[6].beats[0].ui_state.left = leftAsian;
  rawHindi.scenes[6].beats[0].ui_state.right = rightVanilla;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftAsian;
    rawHindi.scenes[6].beats[0].visual.data.right = rightVanilla;
  }
  rawHindi.scenes[6].beats[0].text = "एशियन ऑप्शंस में एवरेज प्राइस लेने से वोलैटिलिटी कम हो जाती है, जिससे ऑप्शन सस्ता मिलता है और एक्सपायरी के दिन मार्केट मैनिपुलेशन का खतरा खत्म होता है।";
  rawHindi.scenes[6].beats[0].hindi_tts = "एशियन ऑप्शंस में एवरेज प्राइस लेने से वोलैटिलिटी कम हो जाती है, जिससे ऑप्शन सस्ता मिलता है और एक्सपायरी के दिन मार्केट मैनिपुलेशन का खतरा खत्म होता है।";

  rawEn.scenes[6].title = "Asian Average Options vs Vanilla European Volatility Damping";
  rawEn.scenes[6].beats[0].ui_state.left = leftAsian;
  rawEn.scenes[6].beats[0].ui_state.right = rightVanilla;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftAsian;
    rawEn.scenes[6].beats[0].visual.data.right = rightVanilla;
  }
  rawEn.scenes[6].beats[0].text = "Averaging in Asian options dampens volatility by one over square root of three, reducing cost and immunizing against settlement manipulation.";
  rawEn.scenes[6].beats[0].dialogue = "Averaging in Asian options dampens volatility by one over square root of three, reducing cost and immunizing against settlement manipulation.";

  // Scene 7: Progressive Cards - Hull Section 22.8
  const asianCards = [
    { title: "Spot $50 vs Strike $50", body: "1-year call with 40% initial volatility and 10% risk-free rate." },
    { title: "Adjusted Vol: 23.09%", body: "Continuous geometric averaging scales volatility down by sigma / sqrt(3)." },
    { title: "Price: $5.62 vs $9.64 Vanilla", body: "Hedgers capture identical insurance for 42% lower cash premium expenditure." }
  ];
  rawHindi.scenes[7].title = "Hull Section 22.8: Asian Geometric vs Arithmetic Pricing";
  rawHindi.scenes[7].beats[0].ui_state.cards = asianCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = asianCards;
  rawHindi.scenes[7].beats[0].text = "हल के उदाहरण में 40 परसेंट वोलैटिलिटी वाला वैनिला कॉल 9.64 डॉलर का था, जबकि एशियन कॉल सिर्फ 5.62 डॉलर में मिल गया।";
  rawHindi.scenes[7].beats[0].hindi_tts = "हल के उदाहरण में 40 परसेंट वोलैटिलिटी वाला वैनिला कॉल 9.64 डॉलर का था, जबकि एशियन कॉल सिर्फ 5.62 डॉलर में मिल गया।";

  rawEn.scenes[7].title = "Hull Section 22.8: Asian Geometric vs Arithmetic Pricing";
  rawEn.scenes[7].beats[0].ui_state.cards = asianCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = asianCards;
  rawEn.scenes[7].beats[0].text = "In Hull Section 22.8, geometric averaging lowers the 1-year call from $9.64 to $5.62, delivering a 42% discount to hedgers.";
  rawEn.scenes[7].beats[0].dialogue = "In Hull Section 22.8, geometric averaging lowers the 1-year call from $9.64 to $5.62, delivering a 42% discount to hedgers.";

  // Scene 8: Formula Breakdown - Binary Options
  rawHindi.scenes[8].title = "Binary (Digital) Options: Cash-or-Nothing vs Asset-or-Nothing";
  rawHindi.scenes[8].beats[0].text = "बाइनरी ऑप्शंस में कैश-ऑर-नथिंग ऑप्शन फिक्स्ड अमाउंट पे करता है, जबकि एसेट-ऑर-नथिंग ऑप्शन एसेट की पूरी वैल्यू डिलीवर करता है।";
  rawHindi.scenes[8].beats[0].hindi_tts = "बाइनरी ऑप्शंस में कैश-ऑर-नथिंग ऑप्शन फिक्स्ड अमाउंट पे करता है, जबकि एसेट-ऑर-नथिंग ऑप्शन एसेट की पूरी वैल्यू डिलीवर करता है।";

  rawEn.scenes[8].title = "Binary (Digital) Options: Cash-or-Nothing vs Asset-or-Nothing";
  rawEn.scenes[8].beats[0].text = "Cash-or-nothing binary options pay a fixed sum Q conditioned on finishing in the money, whereas asset-or-nothing options deliver spot value S_T.";
  rawEn.scenes[8].beats[0].dialogue = "Cash-or-nothing binary options pay a fixed sum Q conditioned on finishing in the money, whereas asset-or-nothing options deliver spot value S_T.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "Why does holding an identical portfolio of a knock-in barrier option and a knock-out barrier option always equal a plain vanilla option?";
  const quizOpts = [
    "A: In-out parity guarantees that the option either hits the barrier and pays knock-in, or misses and pays knock-out",
    "B: Barrier options are illegal on US exchanges unless bundled into symmetrical packages",
    "C: Knock-in options have zero delta while knock-out options have zero gamma at all asset levels",
    "D: The Black-Scholes formula is only mathematically defined when barrier levels equal the strike price"
  ];
  const quizAns = "A: In-out parity guarantees that the option either hits the barrier and pays knock-in, or misses and pays knock-out";

  // Hindi Scene 9
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].beats[0].text = "सोचिए कि समान स्ट्राइक और मैच्योरिटी वाले नॉक-इन बैरियर ऑप्शन और नॉक-आउट बैरियर ऑप्शन को एक साथ रखने पर वैनिला ऑप्शन क्यों बन जाता है?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि समान स्ट्राइक और मैच्योरिटी वाले नॉक-इन बैरियर ऑप्शन और नॉक-आउट बैरियर ऑप्शन को एक साथ रखने पर वैनिला ऑप्शन क्यों बन जाता है?";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या बैरियर छूने या न छूने के अलावा मार्केट में कोई तीसरा रास्ता संभव है।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या बैरियर छूने या न छूने के अलावा मार्केट में कोई तीसरा रास्ता संभव है।";
  rawHindi.scenes[9].beats[1].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[1].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawHindi.scenes[9].beats[1].visual?.data) {
    rawHindi.scenes[9].beats[1].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। इन-आउट पैरिटी यह पक्का करती है कि या तो बैरियर टच होगा या नहीं, इसलिए दोनों का सम हमेशा वैनिला के बराबर रहेगा।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। इन-आउट पैरिटी यह पक्का करती है कि या तो बैरियर टच होगा या नहीं, इसलिए दोनों का सम हमेशा वैनिला के बराबर रहेगा।";
  rawHindi.scenes[9].beats[2].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[2].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[2].ui_state.showThinkingSpinner = false;
  rawHindi.scenes[9].beats[2].ui_state.answer = quizAns;
  if (rawHindi.scenes[9].beats[2].visual?.data) {
    rawHindi.scenes[9].beats[2].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[2].visual.data.options = quizOpts;
    rawHindi.scenes[9].beats[2].visual.data.answer = quizAns;
  }

  // English Scene 9
  rawEn.scenes[9].title = "Active Recall Challenge";
  rawEn.scenes[9].beats[0].text = "Why does holding an identical portfolio of a knock-in barrier option and a knock-out barrier option always equal a plain vanilla option?";
  rawEn.scenes[9].beats[0].dialogue = "Why does holding an identical portfolio of a knock-in barrier option and a knock-out barrier option always equal a plain vanilla option?";
  rawEn.scenes[9].beats[0].ui_state.question = quizQ;
  rawEn.scenes[9].beats[0].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQ;
    rawEn.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[1].text = "Pause and consider how the asset price either hits the barrier or never touches it, covering all possible future paths.";
  rawEn.scenes[9].beats[1].dialogue = "Pause and consider how the asset price either hits the barrier or never touches it, covering all possible future paths.";
  rawEn.scenes[9].beats[1].ui_state.question = quizQ;
  rawEn.scenes[9].beats[1].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawEn.scenes[9].beats[1].visual?.data) {
    rawEn.scenes[9].beats[1].visual.data.question = quizQ;
    rawEn.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[2].text = "Correct answer is A: By in-out parity, either the knock-in triggers or the knock-out survives, replicating the unconditional vanilla payoff.";
  rawEn.scenes[9].beats[2].dialogue = "Correct answer is A: By in-out parity, either the knock-in triggers or the knock-out survives, replicating the unconditional vanilla payoff.";
  rawEn.scenes[9].beats[2].ui_state.question = quizQ;
  rawEn.scenes[9].beats[2].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[2].ui_state.showThinkingSpinner = false;
  rawEn.scenes[9].beats[2].ui_state.answer = quizAns;
  if (rawEn.scenes[9].beats[2].visual?.data) {
    rawEn.scenes[9].beats[2].visual.data.question = quizQ;
    rawEn.scenes[9].beats[2].visual.data.options = quizOpts;
    rawEn.scenes[9].beats[2].visual.data.answer = quizAns;
  }

  // Scene 10: Chat Story
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, exotic barrier options ko dynamically hedge karna itna kathin kyu hota hai?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, एग्जॉटिक बैरियर ऑप्शंस को डायनेमिकली हेज करना इतना कठिन क्यों होता है?";
  rawHindi.scenes[10].beats[1].text = "Raju, barrier ke paas delta aur gamma discontinuous ho jate hain, isliye traders static options replication use karte hain!";
  rawHindi.scenes[10].beats[1].hindi_tts = "राजू, बैरियर के पास डेल्टा और गामा डिसकंटीन्यूअस हो जाते हैं, इसलिए ट्रेडर्स स्टैटिक ऑप्शंस रेप्लिकेशन इस्तेमाल करते हैं!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, why is continuous dynamic delta hedging so notoriously unstable near an exotic barrier boundary?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, why is continuous dynamic delta hedging so notoriously unstable near an exotic barrier boundary?";
  rawEn.scenes[10].beats[1].text = "Raju, discontinuous Greek spikes near the barrier force desks to employ static options replication using vanilla portfolios!";
  rawEn.scenes[10].beats[1].dialogue = "Raju, discontinuous Greek spikes near the barrier force desks to employ static options replication using vanilla portfolios!";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Exotic Options aur Nonstandard Swaps ke aath mukhya siddhanton ko dohraayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए एग्जॉटिक ऑप्शंस और नॉनस्टैंडर्ड स्वैप्स के आठ मुख्य सिद्धांतों को दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: Exotic options tailored hedging dete hain aur forward start options future date par strike fix karte hain.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: एग्जॉटिक ऑप्शंस टेलर्ड हेजिंग देते हैं और फॉरवर्ड स्टार्ट ऑप्शंस फ्यूचर डेट पर स्ट्राइक फिक्स करते हैं।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: Barrier in-out parity vanilla option deti hai aur lookback extreme prices capture karte hain.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: बैरियर इन-आउट पैरिटी वैनिला ऑप्शन देती है और लुकबैक एक्सट्रीम प्राइसेस कैप्चर करते हैं।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: Asian options volatility damp karke premium kam karte hain aur binary options digital cashflows dete hain.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: एशियन ऑप्शंस वोलैटिलिटी डैम्प करके प्रीमियम कम करते हैं और बाइनरी ऑप्शंस डिजिटल कैश फ्लो देते हैं।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: Leveraged swaps me non-linear risk hota hai aur static replication barrier Greeks ko stabilize karta hai.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: लीवरेज्ड स्वैप्स में नॉन-लीनियर रिस्क होता है और स्टैटिक रेप्लिकेशन बैरियर ग्रीक्स को स्टेबलाइज करता है।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam structured products aur quantitative exotic trading ke stambh hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम स्ट्रक्चर्ड प्रोडक्ट्स और क्वांटिटेटिव एग्जॉटिक ट्रेडिंग के स्तंभ हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of exotic options and nonstandard swaps.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of exotic options and nonstandard swaps.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: Exotic options provide tailored corporate hedging, and forward starts establish strikes on future dates.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: Exotic options provide tailored corporate hedging, and forward starts establish strikes on future dates.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: Barrier options obey in-out parity, while lookbacks harvest extreme historical path prices.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: Barrier options obey in-out parity, while lookbacks harvest extreme historical path prices.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Asian averaging damps volatility by one over root three, and binary contracts deliver digital cashflows.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Asian averaging damps volatility by one over root three, and binary contracts deliver digital cashflows.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: Leveraged swaps harbor extreme non-linear convexity, and static replication stabilizes barrier boundaries.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: Leveraged swaps harbor extreme non-linear convexity, and static replication stabilizes barrier boundaries.";
  rawEn.scenes[11].beats[5].text = "These eight rules govern exotic structuring and institutional risk immunization.";
  rawEn.scenes[11].beats[5].dialogue = "These eight rules govern exotic structuring and institutional risk immunization.";

  // Save raw episodes
  const outHindi = path.join(hindiDir, "episode_raw.json");
  const outEnglish = path.join(englishDir, "episode_raw.json");
  fs.writeFileSync(outHindi, JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(outEnglish, JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English ch22_part1!");

  // Validate
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");
}

main().catch(console.error);

