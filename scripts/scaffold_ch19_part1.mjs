import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch19_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch19_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Volatility Smiles & Skew",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Volatility Smiles & Skew",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: The Flat Volatility Fallacy";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, kya Black-Scholes model ki yeh maanyata sach hai ki sabhi strike prices par volatility ekdam constant rehti hai?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, क्या ब्लैक-स्कोल्स मॉडल की यह मान्यता सच है कि सभी स्ट्राइक प्राइसेस पर वोलैटिलिटी एकदम कॉन्स्टेंट रहती है?";
  rawHindi.scenes[0].beats[1].text = "Raju, market ka data kuch aur hi kehta hai! Asal bazaron me volatility smile aur downward skew dekhne ko milta hai.";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, मार्केट का डेटा कुछ और ही कहता है! असल बाजारों में वोलैटिलिटी स्माइल और डाउनवर्ड स्क्यू देखने को मिलता है।";

  rawEn.scenes[0].title = "Origins: The Flat Volatility Fallacy";
  rawEn.scenes[0].beats[0].text = "Sharma ji, does the Black-Scholes assumption of constant volatility across all strikes actually hold true?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, does the Black-Scholes assumption of constant volatility across all strikes actually hold true?";
  rawEn.scenes[0].beats[1].text = "Raju, real market option prices show non-flat curves known as volatility smiles and skews!";
  rawEn.scenes[0].beats[1].dialogue = "Raju, real market option prices show non-flat curves known as volatility smiles and skews!";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Black-Scholes Inversion vs Real Market Pricing";
  rawHindi.scenes[1].beats[0].text = "Black-Scholes constant volatility assume karta hai, jabki market pricing strike aur maturity ke hisab se badalti hai.";
  rawHindi.scenes[1].beats[0].hindi_tts = "ब्लैक-स्कोल्स कॉन्स्टेंट वोलैटिलिटी मानकर चलता है, जबकि मार्केट प्राइसिंग स्ट्राइक और मैच्योरिटी के हिसाब से बदलती है।";

  rawEn.scenes[1].title = "Black-Scholes Inversion vs Real Market Pricing";
  rawEn.scenes[1].beats[0].text = "While Black-Scholes assumes constant volatility, real exchange prices dictate dynamic smile curves.";
  rawEn.scenes[1].beats[0].dialogue = "While Black-Scholes assumes constant volatility, real exchange prices dictate dynamic smile curves.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Currency Smile", body: "Symmetric U-shape due to leptokurtic fat tails in forex distributions." },
    { title: "2. Equity Skew", body: "Steep downward slope driven by corporate leverage and downside fear." },
    { title: "3. Crashophobia", body: "Post-1987 structural regime shift bidding up deep OTM puts permanently." },
    { title: "4. Volatility Surfaces", body: "Continuous 3D pricing map sigma(K, T) reconciling strikes and maturities." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Volatility Topography";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya stambhon par charcha karenge: currency smile, equity skew, crashophobia, aur 3D volatility surface.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य स्तंभों पर चर्चा करेंगे: करेंसी स्माइल, इक्विटी स्क्यू, क्रैशोफोबिया, और थ्री-डी वोलैटिलिटी सर्फेस।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Volatility Topography";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We examine four pillars: currency smiles, equity skews, crashophobia, and 3D volatility surfaces.";
  rawEn.scenes[2].beats[0].dialogue = "We examine four pillars: currency smiles, equity skews, crashophobia, and 3D volatility surfaces.";

  // Scene 3: Comparison - Currency vs Equity
  const leftCur = {
    title: "Currency Options (U-Smile)",
    items: [
      "Symmetric leptokurtic distribution",
      "Both deep OTM puts and calls have elevated implied vol",
      "Driven by jump risk and fat tails in exchange rates"
    ]
  };
  const rightEq = {
    title: "Equity Options (Downward Skew)",
    items: [
      "Negative skewness with heavy left tail",
      "Deep OTM puts trade at huge volatility premium",
      "Driven by corporate leverage and downside crash protection"
    ]
  };
  rawHindi.scenes[3].title = "Currency U-Shaped Smile vs Equity Downward Skew";
  rawHindi.scenes[3].beats[0].ui_state.left = leftCur;
  rawHindi.scenes[3].beats[0].ui_state.right = rightEq;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftCur;
    rawHindi.scenes[3].beats[0].visual.data.right = rightEq;
  }
  rawHindi.scenes[3].beats[0].text = "Currency options me dono taraf fat tails hone se U-smile banti hai, jabki equity me downward skew dikhta hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "करेंसी ऑप्शंस में दोनों तरफ फैट टेल्स होने से यू-शेप्ड स्माइल बनती है, जबकि इक्विटी में डाउनवर्ड स्क्यू दिखता है।";

  rawEn.scenes[3].title = "Currency U-Shaped Smile vs Equity Downward Skew";
  rawEn.scenes[3].beats[0].ui_state.left = leftCur;
  rawEn.scenes[3].beats[0].ui_state.right = rightEq;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftCur;
    rawEn.scenes[3].beats[0].visual.data.right = rightEq;
  }
  rawEn.scenes[3].beats[0].text = "Foreign currency options display a symmetric U-shaped smile, whereas equity options exhibit a persistent downward skew.";
  rawEn.scenes[3].beats[0].dialogue = "Foreign currency options display a symmetric U-shaped smile, whereas equity options exhibit a persistent downward skew.";

  // Scene 4: Breeden-Litzenberger Formula Breakdown
  rawHindi.scenes[4].title = "Breeden-Litzenberger Risk-Neutral Density Extraction";
  rawHindi.scenes[4].beats[0].text = "Breeden-Litzenberger formula ke anusaar, call price ka strike ke saapeksh second derivative risk-neutral probability density deta hai.";
  rawHindi.scenes[4].beats[0].hindi_tts = "ब्रीडन-लिट्जनबर्गर फॉर्मूले के अनुसार, कॉल प्राइस का स्ट्राइक के सापेक्ष सेकंड डेरिवेटिव रिस्क-न्यूट्रल प्रोबेबिलिटी डेंसिटी देता है।";

  rawEn.scenes[4].title = "Breeden-Litzenberger Risk-Neutral Density Extraction";
  rawEn.scenes[4].beats[0].text = "The Breeden-Litzenberger formula reveals that the second derivative of call prices with respect to strike yields the risk-neutral probability density.";
  rawEn.scenes[4].beats[0].dialogue = "The Breeden-Litzenberger formula reveals that the second derivative of call prices with respect to strike yields the risk-neutral probability density.";

  // Scene 5: Snapshot 19.2 Crashophobia
  rawHindi.scenes[5].title = "Business Snapshot 19.2: Crashophobia & October 1987 Plunge";
  rawHindi.scenes[5].beats[0].text = "October 1987 ke crash se pehle equity smile flat thi. Crash ke baad traders me crashophobia baith gaya aur put ki keematein hamesha ke liye badh gayin.";
  rawHindi.scenes[5].beats[0].hindi_tts = "अक्टूबर 1987 के क्रैश से पहले इक्विटी स्माइल फ्लैट थी। क्रैश के बाद ट्रेडर्स में क्रैशोफोबिया बैठ गया और पुट की कीमतें हमेशा के लिए बढ़ गईं।";

  rawEn.scenes[5].title = "Business Snapshot 19.2: Crashophobia & October 1987 Plunge";
  rawEn.scenes[5].beats[0].text = "Prior to October 1987, equity smiles were relatively flat. The crash created permanent crashophobia, structurally lifting OTM put premiums.";
  rawEn.scenes[5].beats[0].dialogue = "Prior to October 1987, equity smiles were relatively flat. The crash created permanent crashophobia, structurally lifting OTM put premiums.";

  // Scene 6: Put-Call Parity Invariant
  rawHindi.scenes[6].title = "Put-Call Parity Implied Volatility Invariant";
  rawHindi.scenes[6].beats[0].text = "Put-call parity ke kaaran ek hi strike aur maturity wale call aur put ki implied volatility bilkul ek samaan honi chahiye.";
  rawHindi.scenes[6].beats[0].hindi_tts = "पुट-कॉल पैरिटी के कारण एक ही स्ट्राइक और मैच्योरिटी वाले कॉल और पुट की इम्प्लाइड वोलैटिलिटी बिल्कुल एक समान होनी चाहिए।";

  rawEn.scenes[6].title = "Put-Call Parity Implied Volatility Invariant";
  rawEn.scenes[6].beats[0].text = "By Put-Call Parity, a European call and European put with the identical strike and expiration must have the exact same implied volatility.";
  rawEn.scenes[6].beats[0].dialogue = "By Put-Call Parity, a European call and European put with the identical strike and expiration must have the exact same implied volatility.";

  // Scene 7: 3D Volatility Surfaces
  rawHindi.scenes[7].title = "3D Volatility Surfaces: Strikes, Maturities & Moneyness";
  rawHindi.scenes[7].beats[0].text = "3D volatility surface strike aur maturity dono dimensions ko jodkar ek complete pricing map taiyar karti hai.";
  rawHindi.scenes[7].beats[0].hindi_tts = "थ्री-डी वोलैटिलिटी सर्फेस स्ट्राइक और मैच्योरिटी दोनों डायमेंशन्स को जोड़कर एक कम्पलीट प्राइसिंग मैप तैयार करती है।";

  rawEn.scenes[7].title = "3D Volatility Surfaces: Strikes, Maturities & Moneyness";
  rawEn.scenes[7].beats[0].text = "A volatility surface combines the strike-dimension smile with the term structure across maturities into a continuous 3D pricing map.";
  rawEn.scenes[7].beats[0].dialogue = "A volatility surface combines the strike-dimension smile with the term structure across maturities into a continuous 3D pricing map.";

  // Scene 8: Local Volatility vs Stochastic Volatility
  rawHindi.scenes[8].title = "Advanced Dynamics: Local Volatility vs Heston Stochastic Volatility";
  rawHindi.scenes[8].beats[0].text = "Dupire ka local volatility model aur Heston ka stochastic volatility model smile ki dynamics ko sateek roop se model karte hain.";
  rawHindi.scenes[8].beats[0].hindi_tts = "डुपायर का लोकल वोलैटिलिटी मॉडल और हेस्टन का स्टोकेस्टिक वोलैटिलिटी मॉडल स्माइल की डायनेमिक्स को सटीक रूप से मॉडल करते हैं।";

  rawEn.scenes[8].title = "Advanced Dynamics: Local Volatility vs Heston Stochastic Volatility";
  rawEn.scenes[8].beats[0].text = "Dupire local volatility and Heston stochastic volatility models dynamically capture real market volatility smile behavior.";
  rawEn.scenes[8].beats[0].dialogue = "Dupire local volatility and Heston stochastic volatility models dynamically capture real market volatility smile behavior.";

  // Scene 9: Active Recall Challenge (interactive_quiz)
  const quizQ = "Why must a European call and a European put option with the identical strike price and maturity date have exactly the same implied volatility?";
  const quizOpts = [
    "A: Put-Call Parity requires identical implied vol to prevent synthetic arbitrage",
    "B: Market makers only trade call options and ignore puts",
    "C: Black-Scholes formulas only calculate call volatility values",
    "D: Delta hedging requires put volatility to always equal zero"
  ];
  const quizAns = "A: Put-Call Parity requires identical implied vol to prevent synthetic arbitrage";

  // Hindi Scene 9
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].beats[0].text = "Sochiye agar kisi stock index option me strike 90 ka put 25 percent volatility par aur strike 90 ka call 20 percent volatility par trade kare toh kya hoga?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए अगर किसी स्टॉक इंडेक्स ऑप्शन में स्ट्राइक 90 का पुट 25 परसेंट वोलैटिलिटी पर और स्ट्राइक 90 का कॉल 20 परसेंट वोलैटिलिटी पर ट्रेड करे तो क्या होगा?";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[1].text = "Vichaar kijiye ki kya Put-Call Parity ke tehat yeh sthiti arbitrage ka avsar pradaan karti hai.";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या पुट-कॉल पैरिटी के तहत यह स्थिति आर्बिट्राज का अवसर प्रदान करती है।";
  rawHindi.scenes[9].beats[1].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[1].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawHindi.scenes[9].beats[1].visual?.data) {
    rawHindi.scenes[9].beats[1].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[2].text = "Sahi uttar A hai. Put-Call Parity ke anusaar samaan strike aur maturity wale call aur put ki implied volatility bilkul barabar honi chahiye.";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। पुट-कॉल पैरिटी के अनुसार समान स्ट्राइक और मैच्योरिटी वाले कॉल और पुट की इम्प्लाइड वोलैटिलिटी बिल्कुल बराबर होनी चाहिए।";
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
  rawEn.scenes[9].beats[0].text = "Why must a European call and a European put option with the identical strike price and maturity date have exactly the same implied volatility?";
  rawEn.scenes[9].beats[0].dialogue = "Why must a European call and a European put option with the identical strike price and maturity date have exactly the same implied volatility?";
  rawEn.scenes[9].beats[0].ui_state.question = quizQ;
  rawEn.scenes[9].beats[0].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQ;
    rawEn.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[1].text = "Pause and consider how Put-Call Parity guarantees identical implied volatilities across both contracts.";
  rawEn.scenes[9].beats[1].dialogue = "Pause and consider how Put-Call Parity guarantees identical implied volatilities across both contracts.";
  rawEn.scenes[9].beats[1].ui_state.question = quizQ;
  rawEn.scenes[9].beats[1].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawEn.scenes[9].beats[1].visual?.data) {
    rawEn.scenes[9].beats[1].visual.data.question = quizQ;
    rawEn.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[2].text = "Correct answer is A: Any discrepancy in implied volatilities violates Put-Call Parity and creates riskless synthetic arbitrage.";
  rawEn.scenes[9].beats[2].dialogue = "Correct answer is A: Any discrepancy in implied volatilities violates Put-Call Parity and creates riskless synthetic arbitrage.";
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
  rawHindi.scenes[10].beats[0].text = "Sharma ji, trading desk par volatility smile ko nazarandaz karke option book hedge karne se kya bada nuksan ho sakta hai?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, ट्रेडिंग डेस्क पर वोलैटिलिटी स्माइल को नजरअंदाज करके ऑप्शन बुक हेज करने से क्या बड़ा नुकसान हो सकता है?";
  rawHindi.scenes[10].beats[1].text = "Bilkul Raju, agar delta me volatility ka slope adjust nahi kiya gaya, toh book hedge nahi balki uncovered risk me phans jayegi!";
  rawHindi.scenes[10].beats[1].hindi_tts = "बिल्कुल राजू, अगर डेल्टा में वोलैटिलिटी का स्लोप एडजस्ट नहीं किया गया, तो बुक हेज नहीं बल्कि अनकवर्ड रिस्क में फंस जाएगी!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, what risk arises if a trading desk hedges options using flat Black-Scholes deltas instead of smile-adjusted deltas?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, what risk arises if a trading desk hedges options using flat Black-Scholes deltas instead of smile-adjusted deltas?";
  rawEn.scenes[10].beats[1].text = "Raju, unadjusted deltas lead to severe mishedging because implied volatility shifts dynamically as spot prices move!";
  rawEn.scenes[10].beats[1].dialogue = "Raju, unadjusted deltas lead to severe mishedging because implied volatility shifts dynamically as spot prices move!";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye volatility smile ke aath mukhya siddhanton ko sanksep me dohrayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए वोलैटिलिटी स्माइल के आठ मुख्य सिद्धांतों को संक्षेप में दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: Market me volatility kabhi flat nahi hoti, aur Put-Call Parity samaan implied volatility sunishchit karti hai.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: मार्केट में वोलैटिलिटी कभी फ्लैट नहीं होती, और पुट-कॉल पैरिटी समान इम्प्लाइड वोलैटिलिटी सुनिश्चित करती है।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: Currency options me U-smile aur equity options me downward skew dekhne ko milta hai.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: करेंसी ऑप्शंस में यू-स्माइल और इक्विटी ऑप्शंस में डाउनवर्ड स्क्यू देखने को मिलता है।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: Leverage effect aur 1987 ka crashophobia equity skew ke mukhya kaaran hain.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: लेवरेज इफेक्ट और 1987 का क्रैशोफोबिया इक्विटी स्क्यू के मुख्य कारण हैं।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: 3D volatility surface aur stochastic models sateek derivative pricing ke aadhar hain.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: थ्री-डी वोलैटिलिटी सर्फेस और स्टोकेस्टिक मॉडल्स सटीक डेरिवेटिव प्राइसिंग के आधार हैं।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam derivatives aur volatility trading ke sabse mahatvapoorna siddhant hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम डेरिवेटिव्स और वोलैटिलिटी ट्रेडिंग के सबसे महत्वपूर्ण सिद्धांत हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of volatility smiles and skews.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of volatility smiles and skews.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: Market implied volatility is non-flat, and Put-Call Parity mandates identical vol for calls and puts.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: Market implied volatility is non-flat, and Put-Call Parity mandates identical vol for calls and puts.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: Currencies exhibit symmetric U-smiles, while equities display steep downward skews.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: Currencies exhibit symmetric U-smiles, while equities display steep downward skews.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Leverage effects and post-1987 crashophobia drive structural demand for downside put protection.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Leverage effects and post-1987 crashophobia drive structural demand for downside put protection.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: 3D volatility surfaces and stochastic volatility models provide robust quantitative pricing.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: 3D volatility surfaces and stochastic volatility models provide robust quantitative pricing.";
  rawEn.scenes[11].beats[5].text = "These eight rules form the backbone of modern volatility trading and risk management.";
  rawEn.scenes[11].beats[5].dialogue = "These eight rules form the backbone of modern volatility trading and risk management.";

  // Save raw episodes
  const outHindi = path.join(hindiDir, "episode_raw.json");
  const outEnglish = path.join(englishDir, "episode_raw.json");
  fs.writeFileSync(outHindi, JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(outEnglish, JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English ch19_part1!");

  // Validate
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");
}

main().catch(console.error);
