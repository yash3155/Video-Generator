import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch17_part2";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch17_part2 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Advanced Greeks & Portfolio Insurance",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Advanced Greeks & Portfolio Insurance",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Introduction to Advanced Greeks
  rawHindi.scenes[0].title = "Origins: Higher-Order Greeks & Market Stability";
  rawHindi.scenes[0].concept = "Moving beyond delta to hedge curvature (Gamma), decay (Theta), and volatility (Vega)";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, delta hedging se chote jhatke toh sambhal jate hain, lekin Gamma curvature aur Vega volatility shocks book ko barbad kar sakte hain.";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, डेल्टा हेजिंग से छोटे झटके तो संभल जाते हैं, लेकिन गामा कर्वेचर और वेगा वोलैटिलिटी शॉक्स पूरी बुक को बर्बाद कर सकते हैं।";
  rawHindi.scenes[0].beats[1].text = "Aur stock ka Gamma aur Vega zero hota hai, isliye inhen hedge karne ke liye traded option contracts khareedna zaroori hota hai.";
  rawHindi.scenes[0].beats[1].hindi_tts = "और स्टॉक का गामा और वेगा शून्य होता है, इसलिए इन्हें हेज करने के लिए ट्रेडेड ऑप्शन कॉन्ट्रैक्ट्स का इस्तेमाल करना ज़रूरी होता है।";

  rawEn.scenes[0].title = "Origins: Higher-Order Greeks & Market Stability";
  rawEn.scenes[0].concept = "Moving beyond delta to hedge curvature (Gamma), decay (Theta), and volatility (Vega)";
  rawEn.scenes[0].beats[0].text = "Dr. Vance, delta neutrality only shields against infinitesimal price moves, leaving trading books completely vulnerable to Gamma curvature and Vega volatility.";
  rawEn.scenes[0].beats[1].text = "Because underlying stock carries zero Gamma and zero Vega, neutralizing these second-order risks requires trading supplementary option contracts.";

  // Scene 1: Delta-Neutral Books vs Volatility Shocks
  rawHindi.scenes[1].title = "Delta Neutrality vs Gamma Acceleration Risk";
  rawHindi.scenes[1].concept = "Why delta-neutral portfolios suffer sudden losses during market gap moves";
  rawHindi.scenes[1].beats[0].text = "Delta-neutral books me market freeze ya sudden gap open hone par negative Gamma ke chalte bhaari losses generate hote hain.";
  rawHindi.scenes[1].beats[0].hindi_tts = "डेल्टा-न्यूट्रल बुक्स में मार्केट गैप ओपन होने पर नेगेटिव गामा के चलते भारी नुकसान पैदा होता है।";

  rawEn.scenes[1].title = "Delta Neutrality vs Gamma Acceleration Risk";
  rawEn.scenes[1].concept = "Why delta-neutral portfolios suffer sudden losses during market gap moves";
  rawEn.scenes[1].beats[0].text = "Even perfectly delta-neutral books suffer devastating losses during market gaps if negative gamma curvature accelerates unhedged.";

  // Scene 2: Roadmap
  const cardsPillars = [
    { title: "1. Gamma Curvature", body: "d^2C/dS^2 measuring Delta's rate of acceleration." },
    { title: "2. Theta Decay & PDE", body: "Theta + 0.5*sigma^2*S^2*Gamma = r*Pi trade-off." },
    { title: "3. Vega & Rho Neutrality", body: "Immunizing books against implied volatility shifts." },
    { title: "4. The 1987 Crash", body: "How synthetic portfolio insurance caused Black Monday." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Advanced Greek Risk Management";
  rawHindi.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: Gamma curvature, Theta decay PDE sambhandh, Vega neutrality, aur 1987 ka crash.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: गामा कर्वेचर, थीटा डिके और पीडीई संबंध, वेगा न्यूट्रैलिटी, और 1987 का क्रैश।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Advanced Greek Risk Management";
  rawEn.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: Gamma curvature mechanics, the Theta-Gamma PDE invariant, Vega hedging, and the 1987 portfolio insurance crash.";

  // Scene 3: Gamma & Vega Hedging Architecture
  const leftStockOnly = {
    title: "Stock-Only Hedging (Delta Neutral)",
    items: ["Underlying stock has Gamma = 0 and Vega = 0", "Cannot change portfolio curvature or volatility risk", "Vulnerable to large discrete price jumps"]
  };
  const rightOptionHedge = {
    title: "Traded Option Hedging (Delta-Gamma-Vega)",
    items: ["Traded options possess non-zero Gamma and Vega", "Add wT options: wT = - Gamma_P / Gamma_T", "Re-adjust stock to re-establish Delta neutrality"]
  };
  rawHindi.scenes[3].title = "Stock vs Traded Option Hedging Capabilities";
  rawHindi.scenes[3].concept = "Stock has zero gamma and vega; options are mandatory to neutralize curvature";
  rawHindi.scenes[3].beats[0].ui_state.left = leftStockOnly;
  rawHindi.scenes[3].beats[0].ui_state.right = rightOptionHedge;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftStockOnly;
    rawHindi.scenes[3].beats[0].visual.data.right = rightOptionHedge;
  }
  rawHindi.scenes[3].beats[0].text = "Kyunki stock ka Gamma aur Vega zero hota hai, isliye inhen neutral karne ke liye extra option contracts trade karna anivarya hota hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "चूँकि स्टॉक का गामा और वेगा शून्य होता है, इसलिए इन्हें न्यूट्रल करने के लिए एक्स्ट्रा ऑप्शन कॉन्ट्रैक्ट्स ट्रेड करना अनिवार्य होता है।";

  rawEn.scenes[3].title = "Stock vs Traded Option Hedging Capabilities";
  rawEn.scenes[3].concept = "Stock has zero gamma and vega; options are mandatory to neutralize curvature";
  rawEn.scenes[3].beats[0].ui_state.left = leftStockOnly;
  rawEn.scenes[3].beats[0].ui_state.right = rightOptionHedge;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftStockOnly;
    rawEn.scenes[3].beats[0].visual.data.right = rightOptionHedge;
  }
  rawEn.scenes[3].beats[0].text = "Because shares possess zero Gamma and zero Vega, neutralizing curvature and volatility strictly requires trading secondary option contracts.";

  // Scene 4: The Black-Scholes-Merton PDE Invariant
  const cardsPde = [
    { title: "Fundamental PDE", body: "Theta + r*S*Delta + 0.5*sigma^2*S^2*Gamma = r*Pi" },
    { title: "Delta-Neutral Invariant", body: "Theta + 0.5*sigma^2*S^2*Gamma = r*Pi when Delta = 0." },
    { title: "The Inescapable Trade-Off", body: "Positive Gamma directly demands negative Theta decay." }
  ];
  rawHindi.scenes[4].title = "The Black-Scholes-Merton PDE Invariant";
  rawHindi.scenes[4].beats[0].ui_state.cards = cardsPde;
  if (rawHindi.scenes[4].beats[0].visual?.data) rawHindi.scenes[4].beats[0].visual.data.cards = cardsPde;
  rawHindi.scenes[4].beats[0].text = "BSM partial differential equation saaf batati hai: Delta-neutral book me positive Gamma pane ke liye negative Theta ki keemat chukani hi padti hai.";
  rawHindi.scenes[4].beats[0].hindi_tts = "ब्लैक-शोल्स-मर्टन पीडीई साफ बताती है: डेल्टा-न्यूट्रल बुक में पॉजिटिव गामा पाने के लिए नेगेटिव थीटा की कीमत चुकानी ही पड़ती है।";

  rawEn.scenes[4].title = "The Black-Scholes-Merton PDE Invariant";
  rawEn.scenes[4].beats[0].ui_state.cards = cardsPde;
  if (rawEn.scenes[4].beats[0].visual?.data) rawEn.scenes[4].beats[0].visual.data.cards = cardsPde;
  rawEn.scenes[4].beats[0].text = "The Black-Scholes PDE establishes an inescapable physical law: in delta-neutral portfolios, positive gamma curvature is paid for by negative theta decay.";

  // Scene 5: Gamma & Vega Formula Breakdown
  const gammaFormula = "\\Gamma = \\frac{N'(d_1)}{S_0 \\sigma \\sqrt{T}}, \\quad \\mathcal{V} = S_0 \\sqrt{T} N'(d_1)";
  const gammaParts = [
    { label: "Gamma Curvature", formula: "\\frac{N'(d_1)}{S_0 \\sigma \\sqrt{T}}", explanation: "Peaks sharply at-the-money as expiration approaches" },
    { label: "Vega Volatility Sensitivity", formula: "S_0 \\sqrt{T} N'(d_1)", explanation: "Measures absolute dollar change per 1% change in implied volatility" }
  ];
  rawHindi.scenes[5].title = "Analytical Gamma & Vega Formulas";
  rawHindi.scenes[5].concept = "Gamma = N'(d1)/(S0*sigma*sqrt(T)), Vega = S0*sqrt(T)*N'(d1)";
  rawHindi.scenes[5].beats[0].ui_state.formula = gammaFormula;
  rawHindi.scenes[5].beats[0].ui_state.parts = gammaParts;
  if (rawHindi.scenes[5].beats[0].visual?.data) {
    rawHindi.scenes[5].beats[0].visual.data.formula = gammaFormula;
    rawHindi.scenes[5].beats[0].visual.data.parts = gammaParts;
  }
  rawHindi.scenes[5].beats[0].text = "Gamma aur Vega dono at-the-money options me sabse zyada hote hain, jisme expiry ke kareeb aane par Gamma explode karta hai jabki Vega ghatata hai.";
  rawHindi.scenes[5].beats[0].hindi_tts = "गामा और वेगा दोनों एट-द-मनी ऑप्शंस में सबसे ज्यादा होते हैं, जिसमें एक्सपायरी के करीब आने पर गामा तेजी से बढ़ता है जबकि वेगा घटता है।";

  rawEn.scenes[5].title = "Analytical Gamma & Vega Formulas";
  rawEn.scenes[5].concept = "Gamma = N'(d1)/(S0*sigma*sqrt(T)), Vega = S0*sqrt(T)*N'(d1)";
  rawEn.scenes[5].beats[0].ui_state.formula = gammaFormula;
  rawEn.scenes[5].beats[0].ui_state.parts = gammaParts;
  if (rawEn.scenes[5].beats[0].visual?.data) {
    rawEn.scenes[5].beats[0].visual.data.formula = gammaFormula;
    rawEn.scenes[5].beats[0].visual.data.parts = gammaParts;
  }
  rawEn.scenes[5].beats[0].text = "Both Gamma and Vega peak at-the-money: as maturity approaches, Gamma explodes toward infinity while Vega decays to zero.";

  // Scene 6: Numerical Example: Simultaneous Delta-Gamma-Vega Neutrality
  const leftSysParams = {
    title: "Portfolio Risk Exposures",
    items: ["Initial Delta = 0, Gamma = -5,000, Vega = -8,000", "Option 1: Gamma = 1.5, Vega = 2.0", "Option 2: Gamma = 0.5, Vega = 3.0"]
  };
  const rightSysResult = {
    title: "Simultaneous System Solution",
    items: ["1.5*w1 + 0.5*w2 = 5,000", "2.0*w1 + 3.0*w2 = 8,000", "Result: w1 = 3,143 contracts, w2 = 571 contracts", "Finally trade stock to restore Delta = 0"]
  };
  rawHindi.scenes[6].title = "Simultaneous Delta-Gamma-Vega Neutrality";
  rawHindi.scenes[6].concept = "Solving 2x2 linear system to neutralize both Gamma and Vega";
  rawHindi.scenes[6].beats[0].ui_state.left = leftSysParams;
  rawHindi.scenes[6].beats[0].ui_state.right = rightSysResult;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftSysParams;
    rawHindi.scenes[6].beats[0].visual.data.right = rightSysResult;
  }
  rawHindi.scenes[6].beats[0].text = "Ek sath Gamma aur Vega ko zero karne ke liye do alag options ka 2 by 2 system solve karte hain, aur phir stock se delta ko wapas zero kiya jata hai.";
  rawHindi.scenes[6].beats[0].hindi_tts = "एक साथ गामा और वेगा को शून्य करने के लिए दो अलग ऑप्शंस का 2 बाई 2 सिस्टम सॉल्व करते हैं, और फिर स्टॉक से डेल्टा को वापस शून्य किया जाता है।";

  rawEn.scenes[6].title = "Simultaneous Delta-Gamma-Vega Neutrality";
  rawEn.scenes[6].concept = "Solving 2x2 linear system to neutralize both Gamma and Vega";
  rawEn.scenes[6].beats[0].ui_state.left = leftSysParams;
  rawEn.scenes[6].beats[0].ui_state.right = rightSysResult;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftSysParams;
    rawEn.scenes[6].beats[0].visual.data.right = rightSysResult;
  }
  rawEn.scenes[6].beats[0].text = "Neutralizing Gamma and Vega simultaneously requires solving a 2x2 linear system of traded options, followed by adjusting underlying stock to re-zero Delta.";

  // Scene 7: Synthetic Portfolio Insurance Mechanics
  const cardsInsurance = [
    { title: "Synthetic Put Replication", body: "Replicating put payoff by dynamically shorting futures." },
    { title: "Procyclical Negative Delta", body: "Delta drops toward -1 as market crashes, forcing more sales." },
    { title: "Liquidity Overload", body: "Mass dynamic selling strips bid liquidity during panics." }
  ];
  rawHindi.scenes[7].title = "Synthetic Portfolio Insurance & Procyclical Selling";
  rawHindi.scenes[7].beats[0].ui_state.cards = cardsInsurance;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = cardsInsurance;
  rawHindi.scenes[7].beats[0].text = "Synthetic portfolio insurance me girte hue market me futures bechna padta hai. Jab hazaron institutions ek sath bechte hain, toh liquidity khatam ho jati hai.";
  rawHindi.scenes[7].beats[0].hindi_tts = "सिंथेटिक पोर्टफोलियो इंश्योरेंस में गिरते हुए मार्केट में फ्यूचर्स बेचना पड़ता है। जब हज़ारों संस्थान एक साथ बेचते हैं, तो लिक्विडिटी खत्म हो जाती है।";

  rawEn.scenes[7].title = "Synthetic Portfolio Insurance & Procyclical Selling";
  rawEn.scenes[7].beats[0].ui_state.cards = cardsInsurance;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = cardsInsurance;
  rawEn.scenes[7].beats[0].text = "Synthetic portfolio insurance forces institutional managers to sell index futures into a falling market, triggering catastrophic procyclical feedback spirals.";

  // Scene 8: Theta Analytical Formula Breakdown
  const thetaFormula = "\\Theta_{call} = -\\frac{S_0 N'(d_1) \\sigma}{2\\sqrt{T}} - r K e^{-rT} N(d_2)";
  const thetaParts = [
    { label: "Volatility Time Decay", formula: "-\\frac{S_0 N'(d_1) \\sigma}{2\\sqrt{T}}", explanation: "Relentless decay of diffusion uncertainty over elapsed time" },
    { label: "Interest Discount Decay", formula: "-r K e^{-rT} N(d_2)", explanation: "Loss in present value advantage of delaying strike payment" }
  ];
  rawHindi.scenes[8].title = "Analytical Theta Time Decay Formula";
  rawHindi.scenes[8].concept = "Theta_call = -[S0*N'(d1)*sigma]/(2*sqrt(T)) - r*K*e^(-rT)*N(d2)";
  rawHindi.scenes[8].beats[0].ui_state.formula = thetaFormula;
  rawHindi.scenes[8].beats[0].ui_state.parts = thetaParts;
  if (rawHindi.scenes[8].beats[0].visual?.data) {
    rawHindi.scenes[8].beats[0].visual.data.formula = thetaFormula;
    rawHindi.scenes[8].beats[0].visual.data.parts = thetaParts;
  }
  rawHindi.scenes[8].beats[0].text = "Theta option ki time decay hoti hai. Long call ya put me har guzarte din ke sath option ka premium kam hota rehta hai, jo negative theta se napta hai.";
  rawHindi.scenes[8].beats[0].hindi_tts = "थीटा ऑप्शन की टाइम डिके होती है। लॉन्ग कॉल या पुट में हर गुज़रते दिन के साथ ऑप्शन का प्रीमियम कम होता रहता है, जो नेगेटिव थीटा से नापा जाता है।";

  rawEn.scenes[8].title = "Analytical Theta Time Decay Formula";
  rawEn.scenes[8].concept = "Theta_call = -[S0*N'(d1)*sigma]/(2*sqrt(T)) - r*K*e^(-rT)*N(d2)";
  rawEn.scenes[8].beats[0].ui_state.formula = thetaFormula;
  rawEn.scenes[8].beats[0].ui_state.parts = thetaParts;
  if (rawEn.scenes[8].beats[0].visual?.data) {
    rawEn.scenes[8].beats[0].visual.data.formula = thetaFormula;
    rawEn.scenes[8].beats[0].visual.data.parts = thetaParts;
  }
  rawEn.scenes[8].beats[0].text = "Theta quantifies the inevitable daily erosion of option premium, showing how calendar time relentlessly saps option extrinsic value.";

  // Scene 9: Interactive Quiz (Word count >= 18 words)
  const quizQuestion = "How did institutional reliance on synthetic portfolio insurance algorithms directly contribute to the historic 22.6% single-day Dow collapse on Black Monday 1987?";
  const quizOptions = [
    "A) Cascading computer-driven delta-hedging programs automatically dumped massive index futures sell orders into illiquid markets, driving prices into a freefall spiral",
    "B) Commercial clearinghouses completely ran out of physical paper stock certificates",
    "C) The Federal Reserve increased the federal funds rate by 800 basis points overnight",
    "D) All options contracts globally converted to cash settlement without exchange approval"
  ];
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].concept = "Why portfolio insurance exacerbated the 1987 market crash (Snapshot 17.2)";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawHindi.scenes[9].beats[0].text = "How did institutional reliance on synthetic portfolio insurance algorithms directly contribute to the historic 22.6% single-day Dow collapse on Black Monday 1987?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए क्या 1987 में 22.6% गिरावट इसलिए हुई क्योंकि कंप्यूटर एल्गोरिदम ने मार्केट गिरते ही खरबों डॉलर के फ्यूचर्स सेल ऑर्डर्स डंप कर दिए थे?";
  rawHindi.scenes[9].beats[1].text = "Sochiye kya cascading delta-hedging sell orders ne market liquidity ko overwhelm kar diya tha.";
  rawHindi.scenes[9].beats[1].hindi_tts = "सोचिए क्या ऑटोमेटेड डेल्टा हेजिंग सेलों ने एक दुष्चक्र बनाकर मार्केट को फ्री-फॉल में धकेल दिया था।";
  rawHindi.scenes[9].beats[2].text = "Sahi uttar A hai. Snapshot 17.2 ke mutabiq 75 billion dollar ke portfolio insurance programs ne futures pit me massive selling karke 1987 crash karwaya.";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। स्नैपशॉट 17.2 के अनुसार 75 अरब डॉलर के इंश्योरेंस प्रोग्राम्स की अंधाधुंध बिकवाली ने 1987 का क्रैश पैदा किया, जिससे सर्किट ब्रेकर्स बने।";

  rawEn.scenes[9].title = "Active Recall Challenge";
  rawEn.scenes[9].concept = "Why portfolio insurance exacerbated the 1987 market crash (Snapshot 17.2)";
  rawEn.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawEn.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawEn.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawEn.scenes[9].beats[0].text = "How did institutional reliance on synthetic portfolio insurance algorithms directly contribute to the historic 22.6% single-day Dow collapse on Black Monday 1987?";
  rawEn.scenes[9].beats[1].text = "Evaluate the mechanical feedback loop of algorithmic delta selling.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Over $75 billion in dynamic insurance dumped futures into crashing markets, triggering a 22.6% single-day collapse.";

  // Scene 10: Trading Desk Narrative (Snapshot 17.2 & Circuit Breakers)
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].concept = "Business Snapshot 17.2: 1987 Crash and Regulatory Circuit Breakers";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, 1987 ke crash ke baad exchanges ne circuit breakers banaye taaki automated dynamic selling se market fail na ho sake.";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, 1987 के क्रैश के बाद एक्सचेंजों ने सर्किट ब्रेकर्स बनाए ताकि ऑटोमेटेड डायनामिक सेलिंग से मार्केट फेल न हो सके।";
  rawHindi.scenes[10].beats[1].text = "Aur trading desks ko sikhaya gaya ki delta ke sath Gamma aur Vega neutrality rakhna zinda rehne ke liye zaroori hai.";
  rawHindi.scenes[10].beats[1].hindi_tts = "और ट्रेडिंग डेस्क को सिखाया गया कि डेल्टा के साथ गामा और वेगा न्यूट्रैलिटी रखना बाज़ार में ज़िंदा रहने के लिए ज़रूरी है।";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].concept = "Business Snapshot 17.2: 1987 Crash and Regulatory Circuit Breakers";
  rawEn.scenes[10].beats[0].text = "Dr. Vance, the 1987 crash proved that unbounded dynamic delta selling creates systemic liquidity panics, prompting market circuit breakers.";
  rawEn.scenes[10].beats[1].text = "Modern desks mandate simultaneous Gamma and Vega neutrality to ensure survival against extreme tail risk and sudden volatility spikes.";

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
    taskId: "hull_ch17_part2_dialogue_refine",
    chapterSlug,
    targetFiles: [
      path.join(hindiDir, "episode_raw.json"),
      path.join(englishDir, "episode_raw.json")
    ],
    status: "COMPLETED",
    description: "Scaffolded 12-scene episode for Chapter 17 Part 2 covering Gamma, Theta, Vega, Rho, BSM PDE, 1987 Crash, and Circuit Breakers."
  };
  fs.mkdirSync(".cline/tasks", { recursive: true });
  fs.writeFileSync(".cline/tasks/hull_ch17_part2_dialogue_refine.json", JSON.stringify(clineTask, null, 2), "utf8");
  console.log("Saved Cline task manifest to .cline/tasks/hull_ch17_part2_dialogue_refine.json");
}

main().catch(err => {
  console.error("Scaffolding failed:", err);
  process.exit(1);
});

