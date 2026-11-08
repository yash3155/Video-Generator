import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch17_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch17_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "The Greek Letters & Delta Hedging",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "The Greek Letters & Delta Hedging",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Introduction to Delta Hedging
  rawHindi.scenes[0].title = "Origins: The Institutional Hedging Dilemma";
  rawHindi.scenes[0].concept = "Writing 100,000 call options and neutralizing directional price exposure";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, jab koi bank ek laakh call options bechta hai, toh na wo naked reh sakta hai aur na hi poore shares khareed kar covered position le sakta hai.";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, जब कोई बैंक 1 लाख कॉल ऑप्शंस बेचता है, तो न वो नेकेड रह सकता है और न ही पूरे शेयर्स खरीद कर कवर्ड पोजीशन ले सकता है।";
  rawHindi.scenes[0].beats[1].text = "Sahi rasta hai dynamic delta hedging, jisme har hafte stock price aur delta ke badlav ke hisab se shares ko rebalance kiya jata hai.";
  rawHindi.scenes[0].beats[1].hindi_tts = "सही रास्ता है डायनामिक डेल्टा हेजिंग, जिसमें हर हफ्ते स्टॉक कीमत और डेल्टा के बदलाव के हिसाब से शेयर्स को रीबैलेंस किया जाता है।";

  rawEn.scenes[0].title = "Origins: The Institutional Hedging Dilemma";
  rawEn.scenes[0].concept = "Writing 100,000 call options and neutralizing directional price exposure";
  rawEn.scenes[0].beats[0].text = "Dr. Vance, when a financial institution writes 100,000 call options, neither leaving the position naked nor fully covering it with stock provides a safe hedge.";
  rawEn.scenes[0].beats[1].text = "The mathematically rigorous approach is dynamic delta hedging, continually adjusting the share position to maintain exact delta neutrality.";

  // Scene 1: Naked Writing vs Flawed Stop-Loss Strategies
  rawHindi.scenes[1].title = "Naked Exposure vs Flawed Stop-Loss Hedging";
  rawHindi.scenes[1].concept = "Catastrophic surge risk vs whipsaw buy-high-sell-low cash leakage";
  rawHindi.scenes[1].beats[0].text = "Naked writing me market rally hone par asimit nuksan hota hai, jabki stop-loss strategy choppy market me bar-bar whipsaw losses karwati hai.";
  rawHindi.scenes[1].beats[0].hindi_tts = "नेकेड राइटिंग में मार्केट रैली होने पर असीमित नुकसान होता है, जबकि स्टॉप-लॉस स्ट्रेटेजी चॉपी मार्केट में बार-बार व्हिपसॉ लॉसेस करवाती है।";

  rawEn.scenes[1].title = "Naked Exposure vs Flawed Stop-Loss Hedging";
  rawEn.scenes[1].concept = "Catastrophic surge risk vs whipsaw buy-high-sell-low cash leakage";
  rawEn.scenes[1].beats[0].text = "While naked option writing exposes banks to ruinous upside surges, naive stop-loss hedging guarantees whipsaw cash leakage around the strike.";

  // Scene 2: Roadmap
  const cardsPillars = [
    { title: "1. The 5 Greeks Taxonomy", body: "Delta, Gamma, Theta, Vega, and Rho risk dimensions." },
    { title: "2. Delta Formula N(d1)", body: "Analytical hedge ratio for non-dividend and dividend assets." },
    { title: "3. Dynamic Rebalancing", body: "Hull Table 17.2 simulation of weekly delta hedge adjustments." },
    { title: "4. Taylor Expansion & Gamma", body: "Why linear delta leaves quadratic curvature jump risk." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Delta Hedging Framework";
  rawHindi.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: paanch Greeks ka vargikaran, delta formula, dynamic rebalancing table, aur Taylor series curvature risk.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: पाँच ग्रीक्स का वर्गीकरण, डेल्टा फॉर्मूला, डायनामिक रीबैलेंसिंग टेबल, और टेलर सीरीज़ कर्वेचर रिस्क।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Delta Hedging Framework";
  rawEn.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: the five Greek letters taxonomy, analytical delta derivation, dynamic rebalancing simulations, and Taylor series curvature.";

  // Scene 3: Naked Writing vs Covered Writing vs Delta Hedging
  const leftWriting = {
    title: "Static Writing (Naked / Covered)",
    items: ["Naked writing: Zero shares, limitless loss if stock explodes", "Covered writing: 100% shares, massive equity loss if stock crashes", "No dynamic adaptation to changing moneyness"]
  };
  const rightDelta = {
    title: "Dynamic Delta Hedging",
    items: ["Hold exactly Q * Delta shares (e.g. 52,200 shares)", "Immune to small instantaneous stock price swings", "Continuously rebalanced as time and spot price evolve"]
  };
  rawHindi.scenes[3].title = "Static Writing vs Dynamic Delta Hedging";
  rawHindi.scenes[3].concept = "Comparing naked and covered flaws with dynamic delta neutrality";
  rawHindi.scenes[3].beats[0].ui_state.left = leftWriting;
  rawHindi.scenes[3].beats[0].ui_state.right = rightDelta;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftWriting;
    rawHindi.scenes[3].beats[0].visual.data.right = rightDelta;
  }
  rawHindi.scenes[3].beats[0].text = "Static naked ya covered positions dono me ek taraf ka bhaari khatra hota hai, jabki dynamic delta hedging portfolio ko har chote jhatke se bachati hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "स्टैटिक नेकेड या कवर्ड पोजीशंस दोनों में एक तरफ का भारी खतरा होता है, जबकि डायनामिक डेल्टा हेजिंग पोर्टफोलियो को हर छोटे झटके से बचाती है।";

  rawEn.scenes[3].title = "Static Writing vs Dynamic Delta Hedging";
  rawEn.scenes[3].concept = "Comparing naked and covered flaws with dynamic delta neutrality";
  rawEn.scenes[3].beats[0].ui_state.left = leftWriting;
  rawEn.scenes[3].beats[0].ui_state.right = rightDelta;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftWriting;
    rawEn.scenes[3].beats[0].visual.data.right = rightDelta;
  }
  rawEn.scenes[3].beats[0].text = "While naked and covered writing leave massive directional tail risk, dynamic delta hedging maintains neutral portfolio sensitivity.";

  // Scene 4: The 5 Greek Letters Sensitivity Taxonomy
  const cardsGreeks = [
    { title: "Delta (dC/dS)", body: "Hedge ratio measuring sensitivity to small stock price changes." },
    { title: "Gamma (d^2C/dS^2)", body: "Curvature measuring the rate of change of Delta." },
    { title: "Theta (dC/dt)", body: "Time decay measuring daily loss in option value." },
    { title: "Vega (dC/d_sigma)", body: "Sensitivity to shifts in market implied volatility." }
  ];
  rawHindi.scenes[4].title = "The Greek Letters Risk Sensitivity Matrix";
  rawHindi.scenes[4].beats[0].ui_state.cards = cardsGreeks;
  if (rawHindi.scenes[4].beats[0].visual?.data) rawHindi.scenes[4].beats[0].visual.data.cards = cardsGreeks;
  rawHindi.scenes[4].beats[0].text = "Option ke risk ko paanch dimensions me baanta jata hai: Delta stock price ke liye, Gamma curvature ke liye, Theta samay ke liye, aur Vega volatility ke liye.";
  rawHindi.scenes[4].beats[0].hindi_tts = "ऑप्शन के जोखिम को पाँच डाइमेंशन्स में बाँटा जाता है: डेल्टा स्टॉक कीमत के लिए, गामा कर्वेचर के लिए, थीटा समय के लिए, और वेगा वोलैटिलिटी के लिए।";

  rawEn.scenes[4].title = "The Greek Letters Risk Sensitivity Matrix";
  rawEn.scenes[4].beats[0].ui_state.cards = cardsGreeks;
  if (rawEn.scenes[4].beats[0].visual?.data) rawEn.scenes[4].beats[0].visual.data.cards = cardsGreeks;
  rawEn.scenes[4].beats[0].text = "Option risk is decoupled into five distinct dimensions: Delta for price, Gamma for curvature, Theta for time decay, and Vega for volatility.";

  // Scene 5: Taylor Series P&L Formula Breakdown
  const taylorFormula = "\\Delta C \\approx \\Delta \\cdot \\Delta S + \\frac{1}{2} \\Gamma (\\Delta S)^2 + \\Theta \\Delta t";
  const taylorParts = [
    { label: "Linear Delta Exposure", formula: "\\Delta \\cdot \\Delta S", explanation: "Neutralized by holding Delta shares of underlying asset" },
    { label: "Quadratic Gamma Curvature", formula: "\\frac{1}{2} \\Gamma (\\Delta S)^2", explanation: "Second-order jump risk that remains unhedged in delta-only strategies" }
  ];
  rawHindi.scenes[5].title = "Second-Order Taylor Series P&L Breakdown";
  rawHindi.scenes[5].concept = "Delta C approx Delta*Delta S + 0.5*Gamma*(Delta S)^2 + Theta*Delta t";
  rawHindi.scenes[5].beats[0].ui_state.formula = taylorFormula;
  rawHindi.scenes[5].beats[0].ui_state.parts = taylorParts;
  if (rawHindi.scenes[5].beats[0].visual?.data) {
    rawHindi.scenes[5].beats[0].visual.data.formula = taylorFormula;
    rawHindi.scenes[5].beats[0].visual.data.parts = taylorParts;
  }
  rawHindi.scenes[5].beats[0].text = "Taylor series dikhati hai ki option price change me pehla term linear Delta hota hai, lekin doosra term quadratic Gamma curvature ka hota hai jise ignore nahi kiya ja sakta.";
  rawHindi.scenes[5].beats[0].hindi_tts = "टेलर सीरीज़ दिखाती है कि ऑप्शन कीमत में पहला टर्म लीनियर डेल्टा होता है, लेकिन दूसरा टर्म क्वाड्रेटिक गामा कर्वेचर का होता है जिसे नज़रअंदाज़ नहीं किया जा सकता।";

  rawEn.scenes[5].title = "Second-Order Taylor Series P&L Breakdown";
  rawEn.scenes[5].concept = "Delta C approx Delta*Delta S + 0.5*Gamma*(Delta S)^2 + Theta*Delta t";
  rawEn.scenes[5].beats[0].ui_state.formula = taylorFormula;
  rawEn.scenes[5].beats[0].ui_state.parts = taylorParts;
  if (rawEn.scenes[5].beats[0].visual?.data) {
    rawEn.scenes[5].beats[0].visual.data.formula = taylorFormula;
    rawEn.scenes[5].beats[0].visual.data.parts = taylorParts;
  }
  rawEn.scenes[5].beats[0].text = "The Taylor expansion proves that while delta hedging eliminates the linear term, the quadratic gamma curvature term leaves jump risk exposed.";

  // Scene 6: Hull Example 17.1 Simulation Table
  const leftSimParams = {
    title: "Simulation Setup (Short 100k Calls)",
    items: ["Strike K = $50, Spot S0 = $49, r = 5.0%, sigma = 20%", "Initial Delta = 0.522 -> Buy 52,200 shares ($2,557,800)", "Cumulative financing cost tracked across 20 weeks"]
  };
  const rightSimResult = {
    title: "Week 1 Rebalancing Action",
    items: ["Stock falls to S1 = $48.12", "Delta drops from 0.522 to 0.458", "Sell 6,400 shares at $48.12 ($307,968) to re-align delta"]
  };
  rawHindi.scenes[6].title = "Dynamic Hedging Simulation (Hull Table 17.2)";
  rawHindi.scenes[6].concept = "Initial buy 52,200 shares at $49; Week 1 sell 6,400 shares at $48.12";
  rawHindi.scenes[6].beats[0].ui_state.left = leftSimParams;
  rawHindi.scenes[6].beats[0].ui_state.right = rightSimResult;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftSimParams;
    rawHindi.scenes[6].beats[0].visual.data.right = rightSimResult;
  }
  rawHindi.scenes[6].beats[0].text = "John Hull ke simulation me bank shuruat me 52,200 shares khareedta hai. Week 1 me stock 48.12 dollar girne par delta 0.458 ho jata hai, jisse 6,400 shares bechne padte hain.";
  rawHindi.scenes[6].beats[0].hindi_tts = "जॉन हल के सिमुलेशन में बैंक शुरुआत में 52,200 शेयर्स खरीदता है। पहले हफ्ते स्टॉक 48.12 डॉलर गिरने पर 6,400 शेयर्स बेचकर डेल्टा रीबैलेंस किया जाता है।";

  rawEn.scenes[6].title = "Dynamic Hedging Simulation (Hull Table 17.2)";
  rawEn.scenes[6].concept = "Initial buy 52,200 shares at $49; Week 1 sell 6,400 shares at $48.12";
  rawEn.scenes[6].beats[0].ui_state.left = leftSimParams;
  rawEn.scenes[6].beats[0].ui_state.right = rightSimResult;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftSimParams;
    rawEn.scenes[6].beats[0].visual.data.right = rightSimResult;
  }
  rawEn.scenes[6].beats[0].text = "In Hull's benchmark Table 17.2 simulation, the bank buys 52,200 shares initially, then sells 6,400 shares in week one at $48.12 as delta drops to 0.458.";

  // Scene 7: Why Delta Hedging Alone Leaves Gamma Jump Risk
  const cardsGamma = [
    { title: "Infinitesimal Scope", body: "Delta hedging is strictly valid only for small price moves." },
    { title: "Gamma Acceleration", body: "Large gap moves rapidly push the portfolio out of delta balance." },
    { title: "Hedging Cost Equality", body: "Hedging cost equals theoretical option premium received." }
  ];
  rawHindi.scenes[7].title = "Limitations of Delta Neutrality & Gamma Exposure";
  rawHindi.scenes[7].beats[0].ui_state.cards = cardsGamma;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = cardsGamma;
  rawHindi.scenes[7].beats[0].text = "Delta hedging sirf chote badlav par kaam karti hai. Badi market jump hone par Gamma portfolio ko asantulit kar deta hai, isliye gamma neutrality zaroori hoti hai.";
  rawHindi.scenes[7].beats[0].hindi_tts = "डेल्टा हेजिंग सिर्फ छोटे बदलाव पर काम करती है। बड़ी मार्केट जंप होने पर गामा पोर्टफोलियो को असंतुलित कर देता है, इसलिए गामा न्यूट्रैलिटी ज़रूरी होती है।";

  rawEn.scenes[7].title = "Limitations of Delta Neutrality & Gamma Exposure";
  rawEn.scenes[7].beats[0].ui_state.cards = cardsGamma;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = cardsGamma;
  rawEn.scenes[7].beats[0].text = "Delta hedging is valid only for infinitesimal price shifts; discrete market gaps rapidly alter delta, exposing the book to unmanaged gamma losses.";

  // Scene 8: Analytical Delta Derivation
  const deltaFormula = "\\Delta_{call} = e^{-qT} N(d_1), \\quad \\Delta_{put} = e^{-qT} [N(d_1) - 1]";
  const deltaParts = [
    { label: "Call Delta Hedge Ratio", formula: "e^{-qT} N(d_1)", explanation: "Ranges between 0 and 1, representing probability of finishing ITM discounted for dividend leakage" },
    { label: "Put Delta Ratio", formula: "e^{-qT} [N(d_1) - 1]", explanation: "Ranges between -1 and 0, requiring short underlying stock to hedge long puts" }
  ];
  rawHindi.scenes[8].title = "Analytical Delta Formulas for Calls and Puts";
  rawHindi.scenes[8].concept = "Delta_call = e^(-qT)*N(d1), Delta_put = e^(-qT)*[N(d1) - 1]";
  rawHindi.scenes[8].beats[0].ui_state.formula = deltaFormula;
  rawHindi.scenes[8].beats[0].ui_state.parts = deltaParts;
  if (rawHindi.scenes[8].beats[0].visual?.data) {
    rawHindi.scenes[8].beats[0].visual.data.formula = deltaFormula;
    rawHindi.scenes[8].beats[0].visual.data.parts = deltaParts;
  }
  rawHindi.scenes[8].beats[0].text = "Call ka delta N(d1) hota hai jo zero se ek ke beech rehta hai, jabki put ka delta N(d1) minus 1 hota hai jo minus ek se zero ke beech hota hai.";
  rawHindi.scenes[8].beats[0].hindi_tts = "कॉल का डेल्टा एन डी 1 होता है जो 0 से 1 के बीच रहता है, जबकि पुट का डेल्टा एन डी 1 माइनस 1 होता है जो माइनस 1 से 0 के बीच रहता है।";

  rawEn.scenes[8].title = "Analytical Delta Formulas for Calls and Puts";
  rawEn.scenes[8].concept = "Delta_call = e^(-qT)*N(d1), Delta_put = e^(-qT)*[N(d1) - 1]";
  rawEn.scenes[8].beats[0].ui_state.formula = deltaFormula;
  rawEn.scenes[8].beats[0].ui_state.parts = deltaParts;
  if (rawEn.scenes[8].beats[0].visual?.data) {
    rawEn.scenes[8].beats[0].visual.data.formula = deltaFormula;
    rawEn.scenes[8].beats[0].visual.data.parts = deltaParts;
  }
  rawEn.scenes[8].beats[0].text = "Call delta evaluates to e to the minus q T times N of d1, bounded between zero and one, while put delta is negative.";

  // Scene 9: Interactive Quiz (Word count >= 18 words)
  const quizQuestion = "Why is perfectly continuous delta hedging physically impossible for trading desks in practice, prompting institutions to establish discrete rebalancing tolerance bands?";
  const quizOptions = [
    "A) Continuous trading generates infinite transaction costs and bid-ask slippage that would completely wipe out option revenue",
    "B) Exchange regulations prohibit submitting more than 10 stock orders within a single trading day",
    "C) The Black-Scholes formula becomes invalid whenever underlying prices update continuously",
    "D) Margin clearinghouses refuse to hold both cash and stock collateral in the same hedging account"
  ];
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].concept = "Why continuous delta hedging is impossible in practice (Snapshot 17.1)";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawHindi.scenes[9].beats[0].text = "Why is perfectly continuous delta hedging physically impossible for trading desks in practice, prompting institutions to establish discrete rebalancing tolerance bands?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए क्या लगातार हर सेकंड डेल्टा रीबैलेंस करने से ट्रांजैक्शन कॉस्ट और ब्रोकरेज इतना बढ़ जाता है कि पूरा ऑप्शन प्रीमियम बर्बाद हो जाए?";
  rawHindi.scenes[9].beats[1].text = "Sochiye kya trading desks transaction costs ko control karne ke liye fixed delta tolerance bands rakhti hain.";
  rawHindi.scenes[9].beats[1].hindi_tts = "सोचिए क्या ट्रेडिंग डेस्क अनंत ब्रोकरेज लागत से बचने के लिए डिस्क्रीट रीबैलेंसिंग टॉलरेंस बैंड्स का इस्तेमाल करते हैं।";
  rawHindi.scenes[9].beats[2].text = "Sahi uttar A hai. Continuous trading se transaction costs infinite ho jayengi, isliye desks tolerance bands par discrete intervals par rebalance karti hain.";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। कंटीन्यूअस ट्रेडिंग से ट्रांजैक्शन लागत अनंत हो जाएगी, इसलिए बैंक टॉलरेंस बैंड्स पर ही रीबैलेंस करते हैं।";

  rawEn.scenes[9].title = "Active Recall Challenge";
  rawEn.scenes[9].concept = "Why continuous delta hedging is impossible in practice (Snapshot 17.1)";
  rawEn.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawEn.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawEn.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawEn.scenes[9].beats[0].text = "Why is perfectly continuous delta hedging physically impossible for trading desks in practice, prompting institutions to establish discrete rebalancing tolerance bands?";
  rawEn.scenes[9].beats[1].text = "Consider the trade-off between curvature tracking and market friction.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Continuous rebalancing incurs catastrophic transaction fees, requiring discrete bands like plus or minus 0.05.";

  // Scene 10: Trading Desk Narrative (Snapshot 17.1)
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].concept = "Business Snapshot 17.1: Dynamic Hedging in Practice";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, Snapshot 17.1 me Hull ne clear kiya ki real trading desks har pal rebalance nahi karte.";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, स्नैपशॉट 17.1 में जॉन हल ने स्पष्ट किया कि रियल ट्रेडिंग डेस्क हर पल रीबैलेंस नहीं करते।";
  rawHindi.scenes[10].beats[1].text = "Wo delta tolerance bands rakhte hain taaki transaction costs aur gamma tracking error ke beech optimal balance bana rahe.";
  rawHindi.scenes[10].beats[1].hindi_tts = "वे डेल्टा टॉलरेंस बैंड्स रखते हैं ताकि ट्रांजैक्शन लागत और गामा ट्रैकिंग एरर के बीच सही संतुलन बना रहे।";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].concept = "Business Snapshot 17.1: Dynamic Hedging in Practice";
  rawEn.scenes[10].beats[0].text = "Dr. Vance, Business Snapshot 17.1 emphasizes that trading desks balance gamma slippage against commission costs.";
  rawEn.scenes[10].beats[1].text = "Traders establish practical tolerance bands, ensuring rebalancing occurs only when delta drifts beyond acceptable thresholds.";

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
    taskId: "hull_ch17_part1_dialogue_refine",
    chapterSlug,
    targetFiles: [
      path.join(hindiDir, "episode_raw.json"),
      path.join(englishDir, "episode_raw.json")
    ],
    status: "COMPLETED",
    description: "Scaffolded 12-scene episode for Chapter 17 Part 1 covering Greeks Taxonomy, Delta Hedging Mechanics, Hull Simulation Table 17.2, and Snapshot 17.1."
  };
  fs.mkdirSync(".cline/tasks", { recursive: true });
  fs.writeFileSync(".cline/tasks/hull_ch17_part1_dialogue_refine.json", JSON.stringify(clineTask, null, 2), "utf8");
  console.log("Saved Cline task manifest to .cline/tasks/hull_ch17_part1_dialogue_refine.json");
}

main().catch(err => {
  console.error("Scaffolding failed:", err);
  process.exit(1);
});

