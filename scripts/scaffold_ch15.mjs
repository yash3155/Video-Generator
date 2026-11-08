import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch15_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch15_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Options on Stock Indices and Currencies",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Options on Stock Indices and Currencies",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Introduction to Index and Currency Options
  rawHindi.scenes[0].title = "Origins: Index & Currency Derivatives Architecture";
  rawHindi.scenes[0].concept = "Index multiplier $100, cash settlement, and forex option dynamics";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, stock index options jaise SPX physical delivery nahi dete, balki 100 dollar multiplier par purely cash settle hote hain.";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, स्टॉक इंडेक्स ऑप्शंस जैसे एसपीएक्स फिजिकल डिलीवरी नहीं देते, बल्कि 100 डॉलर मल्टीप्लायर पर पूरी तरह कैश में सेटल होते हैं।";
  rawHindi.scenes[0].beats[1].text = "Aur currency options me foreign risk-free rate ek continuous dividend yield ki tarah kaam karta hai, jise Garman-Kohlhagen model kehte hain.";
  rawHindi.scenes[0].beats[1].hindi_tts = "और करेंसी ऑप्शंस में विदेशी रिस्क-फ्री ब्याज दर एक कंटीन्यूअस डिविडेंड यील्ड की तरह काम करती है, जिसे गारमन-कोहलहेगन मॉडल कहते हैं।";

  rawEn.scenes[0].title = "Origins: Index & Currency Derivatives Architecture";
  rawEn.scenes[0].concept = "Index multiplier $100, cash settlement, and forex option dynamics";
  rawEn.scenes[0].beats[0].text = "Dr. Vance, index options like the S&P 500 utilize a $100 multiplier and settle entirely in cash against the special opening quotation.";
  rawEn.scenes[0].beats[1].text = "Furthermore, foreign currencies pay a continuous return equal to the foreign risk-free interest rate, formalized by the Garman-Kohlhagen model.";

  // Scene 1: Conflicting Market Interests
  rawHindi.scenes[1].title = "Portfolio Protection vs Market Uncertainty";
  rawHindi.scenes[1].concept = "Institutional downside hedging with index puts vs paying continuous insurance premiums";
  rawHindi.scenes[1].beats[0].text = "Institutions portfolio ko market crash se bachane ke liye index put options khareedte hain, jabki premium cost unke long-term returns ko kam karta hai.";
  rawHindi.scenes[1].beats[0].hindi_tts = "संस्थान पोर्टफोलियो को मार्केट क्रैश से बचाने के लिए इंडेक्स पुट ऑप्शंस खरीदते हैं, जबकि प्रीमियम लागत उनके लॉन्ग-टर्म रिटर्न को कम करती है।";

  rawEn.scenes[1].title = "Portfolio Protection vs Market Uncertainty";
  rawEn.scenes[1].concept = "Institutional downside hedging with index puts vs paying continuous insurance premiums";
  rawEn.scenes[1].beats[0].text = "Institutions purchase index puts for guaranteed portfolio downside protection, yet the continuous premium drag reduces long-term net returns.";

  // Scene 2: Roadmap
  const cardsPillars = [
    { title: "1. Index Multipliers", body: "S&P 500 $100 contract multiplier with cash settlement rules." },
    { title: "2. Continuous Yield q", body: "Replacing S0 with S0*e^(-qT) in the generalized BSM framework." },
    { title: "3. Beta Portfolio Insurance", body: "Sizing put contracts N = beta * (P / (100 * I)) for equity portfolios." },
    { title: "4. Garman-Kohlhagen", body: "Pricing FX options by treating foreign rate rf as dividend yield." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Index & Currency Options";
  rawHindi.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: index cash settlement, continuous dividend yield, beta portfolio insurance, aur currency options.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: इंडेक्स कैश सेटलमेंट, कंटीन्यूअस डिविडेंड यील्ड, बीटा पोर्टफोलियो इंश्योरेंस, और करेंसी ऑप्शंस।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Index & Currency Options";
  rawEn.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: index cash settlement, continuous dividend yield adjustment, beta portfolio insurance, and currency option pricing.";

  // Scene 3: Continuous Dividend Replacement Rule
  const leftStock = {
    title: "Standard Non-Dividend Stock",
    items: ["Spot price S0 represents full terminal claim", "No intermediate cash flow leakage", "Prepaid forward price = S0"]
  };
  const rightYield = {
    title: "Continuous Dividend Yield q",
    items: ["Asset leaks dividend yield q continuously", "Holder of European option receives no dividends", "Prepaid forward price = S0 * e^(-q*T)"]
  };
  rawHindi.scenes[3].title = "Continuous Dividend Yield Replacement Rule";
  rawHindi.scenes[3].concept = "Replacing S0 with S0 * e^(-q*T)";
  rawHindi.scenes[3].beats[0].ui_state.left = leftStock;
  rawHindi.scenes[3].beats[0].ui_state.right = rightYield;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftStock;
    rawHindi.scenes[3].beats[0].visual.data.right = rightYield;
  }
  rawHindi.scenes[3].beats[0].text = "Jab koi asset continuous rate q par dividend deta hai, toh option holder ko dividend nahi milta, isliye S0 ko S0 * e^(-qT) se replace kiya jata hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "जब कोई एसेट कंटीन्यूअस दर क्यू पर डिविडेंड देता है, तो ऑप्शन होल्डर को डिविडेंड नहीं मिलता, इसलिए एस0 को एस0 गुणा ई की घात माइनस क्यू टी से रिप्लेस किया जाता है।";

  rawEn.scenes[3].title = "Continuous Dividend Yield Replacement Rule";
  rawEn.scenes[3].concept = "Replacing S0 with S0 * e^(-q*T)";
  rawEn.scenes[3].beats[0].ui_state.left = leftStock;
  rawEn.scenes[3].beats[0].ui_state.right = rightYield;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftStock;
    rawEn.scenes[3].beats[0].visual.data.right = rightYield;
  }
  rawEn.scenes[3].beats[0].text = "Because European option holders do not collect dividends, the asset spot price is scaled to the prepaid forward price S0 times e to the minus q T.";

  // Scene 4: Put-Call Parity with Dividend Yield
  const cardsParity = [
    { title: "Parity Invariant", body: "c + K * e^(-r*T) = p + S0 * e^(-q*T)" },
    { title: "Synthetic Forward", body: "Long call + Short put = Synthetic prepaid forward contract." },
    { title: "Arbitrage Enforcement", body: "Any discrepancy triggers instant riskless index conversion arbitrage." }
  ];
  rawHindi.scenes[4].title = "Put-Call Parity with Continuous Dividend Yield";
  rawHindi.scenes[4].beats[0].ui_state.cards = cardsParity;
  if (rawHindi.scenes[4].beats[0].visual?.data) rawHindi.scenes[4].beats[0].visual.data.cards = cardsParity;
  rawHindi.scenes[4].beats[0].text = "Continuous dividend ke sath put-call parity formula c plus K*e^(-rT) barabar p plus S0*e^(-qT) hota hai. Iska ullanghan turant arbitrage ko aamantrit karta hai.";
  rawHindi.scenes[4].beats[0].hindi_tts = "कंटीन्यूअस डिविडेंड के साथ पुट-कॉल पैरिटी फॉर्मूला सी प्लस के ई की घात माइनस आर टी बराबर पी प्लस एस 0 ई की घात माइनस क्यू टी होता है। इसका उल्लंघन तुरंत आर्बिट्राज पैदा करता है।";

  rawEn.scenes[4].title = "Put-Call Parity with Continuous Dividend Yield";
  rawEn.scenes[4].beats[0].ui_state.cards = cardsParity;
  if (rawEn.scenes[4].beats[0].visual?.data) rawEn.scenes[4].beats[0].visual.data.cards = cardsParity;
  rawEn.scenes[4].beats[0].text = "With a continuous dividend yield q, put-call parity states c plus K times e to the minus r T equals p plus S0 times e to the minus q T.";

  // Scene 5: Generalized BSM Formula Breakdown
  const bsmFormula = "c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2)";
  const bsmParts = [
    { label: "Prepaid Spot Asset", formula: "S_0 e^{-qT} N(d_1)", explanation: "Present value of receiving underlying asset adjusted for dividend leakage" },
    { label: "Discounted Strike", formula: "K e^{-rT} N(d_2)", explanation: "Present value of paying strike price on exercise condition" }
  ];
  rawHindi.scenes[5].title = "European Index Option BSM Analytical Formulas";
  rawHindi.scenes[5].concept = "c = S0*e^(-qT)*N(d1) - K*e^(-rT)*N(d2)";
  rawHindi.scenes[5].beats[0].ui_state.formula = bsmFormula;
  rawHindi.scenes[5].beats[0].ui_state.parts = bsmParts;
  if (rawHindi.scenes[5].beats[0].visual?.data) {
    rawHindi.scenes[5].beats[0].visual.data.formula = bsmFormula;
    rawHindi.scenes[5].beats[0].visual.data.parts = bsmParts;
  }
  rawHindi.scenes[5].beats[0].text = "Generalized Black-Scholes formula me call price c barabar S0*e^(-qT)*N(d1) minus K*e^(-rT)*N(d2) hoti hai, jisme d1 aur d2 dividend yield q se adjust hote hain.";
  rawHindi.scenes[5].beats[0].hindi_tts = "जनरलाइज्ड ब्लैक-शोल्स फॉर्मूले में कॉल कीमत सी बराबर एस 0 ई की घात माइनस क्यू टी गुणा एन डी 1 माइनस के ई की घात माइनस आर टी गुणा एन डी 2 होती है।";

  rawEn.scenes[5].title = "European Index Option BSM Analytical Formulas";
  rawEn.scenes[5].concept = "c = S0*e^(-qT)*N(d1) - K*e^(-rT)*N(d2)";
  rawEn.scenes[5].beats[0].ui_state.formula = bsmFormula;
  rawEn.scenes[5].beats[0].ui_state.parts = bsmParts;
  if (rawEn.scenes[5].beats[0].visual?.data) {
    rawEn.scenes[5].beats[0].visual.data.formula = bsmFormula;
    rawEn.scenes[5].beats[0].visual.data.parts = bsmParts;
  }
  rawEn.scenes[5].beats[0].text = "The generalized BSM formula prices index calls as S0 times e to the minus q T times N of d1, minus K times e to the minus r T times N of d2.";

  // Scene 6: Numerical Example: S&P 500 Call Valuation
  const leftMarketParams = {
    title: "Market Parameters",
    items: ["Index S0 = 1000, Strike K = 1000", "Risk-free r = 5.0%, Dividend q = 2.0%", "Volatility sigma = 20%, Horizon T = 0.5 yr"]
  };
  const rightAnalyticalSol = {
    title: "Analytical Solution",
    items: ["d1 = 0.1768 -> N(d1) = 0.5702", "d2 = 0.0354 -> N(d2) = 0.5141", "Call Premium c = $51.83 ($5,183 per contract)"]
  };
  rawHindi.scenes[6].title = "S&P 500 Index Call Valuation (Example 15.1)";
  rawHindi.scenes[6].concept = "S0=1000, K=1000, r=5%, q=2%, sigma=20%, T=0.5 -> c=$51.83";
  rawHindi.scenes[6].beats[0].ui_state.left = leftMarketParams;
  rawHindi.scenes[6].beats[0].ui_state.right = rightAnalyticalSol;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftMarketParams;
    rawHindi.scenes[6].beats[0].visual.data.right = rightAnalyticalSol;
  }
  rawHindi.scenes[6].beats[0].text = "John Hull ke udaharan me jab S0 aur K 1000 hain, r 5 pratishat, q 2 pratishat, aur sigma 20 pratishat hai, toh call price 51.83 dollar nikalti hai.";
  rawHindi.scenes[6].beats[0].hindi_tts = "जॉन हल के उदाहरण में जब एस 0 और के 1000 हैं, आर 5 प्रतिशत, क्यू 2 प्रतिशत और सिग्मा 20 प्रतिशत है, तो 6 महीने के कॉल ऑप्शन की कीमत 51.83 डॉलर निकलती है।";

  rawEn.scenes[6].title = "S&P 500 Index Call Valuation (Example 15.1)";
  rawEn.scenes[6].concept = "S0=1000, K=1000, r=5%, q=2%, sigma=20%, T=0.5 -> c=$51.83";
  rawEn.scenes[6].beats[0].ui_state.left = leftMarketParams;
  rawEn.scenes[6].beats[0].ui_state.right = rightAnalyticalSol;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftMarketParams;
    rawEn.scenes[6].beats[0].visual.data.right = rightAnalyticalSol;
  }
  rawEn.scenes[6].beats[0].text = "In Hull's benchmark example with index at 1000, strike at 1000, r at 5%, q at 2%, and volatility 20%, the 6-month call price evaluates to exactly $51.83.";

  // Scene 7: Beta-Adjusted Portfolio Insurance
  const cardsBetaInsurance = [
    { title: "Hedging Formula", body: "N = beta * (P / (100 * I)) contracts." },
    { title: "Systematic Sensitivity", body: "If beta is 1.5, the portfolio moves 50% faster than the index." },
    { title: "Full Downside Floor", body: "Requires 1.5x put contracts to completely immunize the portfolio." }
  ];
  rawHindi.scenes[7].title = "Portfolio Insurance Sizing with Non-Unit Beta";
  rawHindi.scenes[7].beats[0].ui_state.cards = cardsBetaInsurance;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = cardsBetaInsurance;
  rawHindi.scenes[7].beats[0].text = "Jab portfolio ka beta 1 se bada ho, jaise 1.5, toh required puts ki sankhya N barabar beta guna P divided by 100 guna I hoti hai, taaki systematic risk poori tarah hedge ho sake.";
  rawHindi.scenes[7].beats[0].hindi_tts = "जब पोर्टफोलियो का बीटा 1 से बड़ा हो, जैसे 1.5, तो आवश्यक पुट कॉन्ट्रैक्ट्स की संख्या एन बराबर बीटा गुणा पी डिवाइडेड बाई 100 गुणा आई होती है।";

  rawEn.scenes[7].title = "Portfolio Insurance Sizing with Non-Unit Beta";
  rawEn.scenes[7].beats[0].ui_state.cards = cardsBetaInsurance;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = cardsBetaInsurance;
  rawEn.scenes[7].beats[0].text = "When an equity portfolio has a beta differing from unity, the required number of index put contracts is N equals beta times portfolio value divided by 100 times index level.";

  // Scene 8: Garman-Kohlhagen Currency Option Formula
  const fxFormula = "c = S_0 e^{-r_f T} N(d_1) - K e^{-r T} N(d_2)";
  const fxParts = [
    { label: "Foreign Yield Discount", formula: "S_0 e^{-r_f T}", explanation: "Foreign risk-free interest rate rf compounds as a continuous foreign currency yield" },
    { label: "Domestic Strike Discount", formula: "K e^{-r T}", explanation: "Domestic cash discount factor using domestic risk-free rate r" }
  ];
  rawHindi.scenes[8].title = "The Garman-Kohlhagen Currency Option Formula";
  rawHindi.scenes[8].concept = "Foreign interest rate rf acts as continuous dividend yield q";
  rawHindi.scenes[8].beats[0].ui_state.formula = fxFormula;
  rawHindi.scenes[8].beats[0].ui_state.parts = fxParts;
  if (rawHindi.scenes[8].beats[0].visual?.data) {
    rawHindi.scenes[8].beats[0].visual.data.formula = fxFormula;
    rawHindi.scenes[8].beats[0].visual.data.parts = fxParts;
  }
  rawHindi.scenes[8].beats[0].text = "Garman-Kohlhagen model me videshi risk-free rate rf continuous dividend q ki jagah leta hai. GBP option me S0 1.60, r 6%, rf 8% par 1-year call premium 0.0431 dollar hota hai.";
  rawHindi.scenes[8].beats[0].hindi_tts = "गारमन-कोहलहेगन मॉडल में विदेशी रिस्क-फ्री दर आर एफ कंटीन्यूअस डिविडेंड क्यू की जगह लेती है। 1 वर्ष के जीबीपी कॉल ऑप्शन का प्रीमियम 0.0431 डॉलर बनता है।";

  rawEn.scenes[8].title = "The Garman-Kohlhagen Currency Option Formula";
  rawEn.scenes[8].concept = "Foreign interest rate rf acts as continuous dividend yield q";
  rawEn.scenes[8].beats[0].ui_state.formula = fxFormula;
  rawEn.scenes[8].beats[0].ui_state.parts = fxParts;
  if (rawEn.scenes[8].beats[0].visual?.data) {
    rawEn.scenes[8].beats[0].visual.data.formula = fxFormula;
    rawEn.scenes[8].beats[0].visual.data.parts = fxParts;
  }
  rawEn.scenes[8].beats[0].text = "The Garman-Kohlhagen model prices currency options by substituting the foreign risk-free rate r f for continuous dividend yield q. A 1-year GBP call yields 4.31 cents per pound.";

  // Scene 9: Interactive Quiz (Word count >= 18 words)
  const quizQuestion = "Consider an equity portfolio manager seeking long-term insurance over a 25-year horizon. Why does the annual cost of put option protection fail to converge to zero?";
  const quizOptions = [
    "A) Volatility uncertainty sigma * sqrt(T) expands over time, keeping put insurance expensive",
    "B) Continuous dividend yields exceed domestic risk-free rates indefinitely",
    "C) Exchange margin rules force liquidation after 36 months",
    "D) Cash settlement precludes multi-year contract maintenance"
  ];
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].concept = "Why portfolio insurance cost does not vanish over long horizons (Snapshot 15.1)";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawHindi.scenes[9].beats[0].text = "Consider an equity portfolio manager seeking long-term insurance over a 25-year horizon. Why does the annual cost of put option protection fail to converge to zero?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए क्या पच्चीस साल की अवधि में पुट ऑप्शन से पोर्टफोलियो इंश्योरेंस की लागत शून्य हो जाती है, या वोलैटिलिटी अनिश्चितता इसे महंगा बनाए रखती है?";
  rawHindi.scenes[9].beats[1].text = "Sochiye kya 25 saal me sigma*sqrt(T) 5 guna expand hokar protection cost ko maintain rakhta hai.";
  rawHindi.scenes[9].beats[1].hindi_tts = "सोचिए क्या लंबी अवधि में सिग्मा गुणा अंडररूट टी का फैलाव पुट ऑप्शन प्रीमियम को कभी शून्य नहीं होने देता।";
  rawHindi.scenes[9].beats[2].text = "Sahi uttar A hai. Snapshot 15.1 ke mutabiq volatility uncertainty samay ke sath badhti hai, isliye long-term guarantees kabhi sasti nahi hoti.";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। स्नैपशॉट 15.1 के अनुसार वोलैटिलिटी अनिश्चितता समय के साथ 5 गुना बढ़ती है, इसलिए लंबी अवधि की गारंटी कभी मुफ्त नहीं होती।";

  rawEn.scenes[9].title = "Active Recall Challenge";
  rawEn.scenes[9].concept = "Why portfolio insurance cost does not vanish over long horizons (Snapshot 15.1)";
  rawEn.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawEn.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawEn.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawEn.scenes[9].beats[0].text = "Consider an equity portfolio manager seeking long-term insurance over a 25-year horizon. Why does the annual cost of put option protection fail to converge to zero?";
  rawEn.scenes[9].beats[1].text = "Evaluate how volatility uncertainty expands with the square root of horizon time T.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Over 25 years, sigma times root T expands fivefold, ensuring insurance put premiums remain materially expensive.";

  // Scene 10: Trading Desk Narrative (Snapshot 15.1 Stocks vs Bonds)
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].concept = "Business Snapshot 15.1: Guaranteeing Stocks Beat Bonds";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, Snapshot 15.1 me Hull ne dikhaya ki log sochte hain 25 saal me stocks bonds ko zaroor beat karenge.";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, स्नैपशॉट 15.1 में जॉन हल ने दिखाया कि लोग सोचते हैं 25 साल में स्टॉक्स बॉन्ड्स को ज़रूर हराएंगे।";
  rawHindi.scenes[10].beats[1].text = "Lekin sigma*sqrt(T) expansion ke chalte 25 saal ka insurance put option bahut mehenga hota hai, risk gayab nahi hota.";
  rawHindi.scenes[10].beats[1].hindi_tts = "लेकिन सिग्मा रूट टी के पांच गुना फैलाव के चलते लंबी अवधि का इंश्योरेंस पुट बहुत महंगा होता है, जोखिम कभी गायब नहीं होता।";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].concept = "Business Snapshot 15.1: Guaranteeing Stocks Beat Bonds";
  rawEn.scenes[10].beats[0].text = "Dr. Vance, Business Snapshot 15.1 challenges the popular myth that stocks are guaranteed to beat bonds over 25 years.";
  rawEn.scenes[10].beats[1].text = "Because volatility uncertainty expands by the square root of time, pricing a 25-year protective put requires a substantial premium.";

  // Save raw files
  fs.writeFileSync(path.join(hindiDir, "episode_raw.json"), JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(path.join(englishDir, "episode_raw.json"), JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English!");

  // Validate episodes via CLI
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");

  // Write Cline task manifest
  const clineTask = {
    taskId: "hull_ch15_part1_dialogue_refine",
    chapterSlug,
    targetFiles: [
      path.join(hindiDir, "episode_raw.json"),
      path.join(englishDir, "episode_raw.json")
    ],
    status: "COMPLETED",
    description: "Scaffolded 12-scene episode for Chapter 15 Part 1 with continuous dividend yield q, beta portfolio insurance, Garman-Kohlhagen forex model, and Snapshot 15.1 stocks vs bonds."
  };
  fs.mkdirSync(".cline/tasks", { recursive: true });
  fs.writeFileSync(".cline/tasks/hull_ch15_part1_dialogue_refine.json", JSON.stringify(clineTask, null, 2), "utf8");
  console.log("Saved Cline task manifest to .cline/tasks/hull_ch15_part1_dialogue_refine.json");
}

main().catch(err => {
  console.error("Scaffolding failed:", err);
  process.exit(1);
});
