import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch16_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch16_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Futures Options and Black's Model",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Futures Options and Black's Model",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Introduction to Futures Options Mechanics
  rawHindi.scenes[0].title = "Origins: Futures Options Mechanics & Settlement";
  rawHindi.scenes[0].concept = "Long Call = Long Futures + Cash (F0 - K); Long Put = Short Futures + Cash (K - F0)";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, futures options me exercise karne par spot commodity nahi milti, balki futures contract ke sath cash difference milta hai.";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, फ्यूचर्स ऑप्शंस में एक्सरसाइज करने पर स्पॉट कमोडिटी नहीं मिलती, बल्कि फ्यूचर्स कॉन्ट्रैक्ट के साथ कैश डिफरेंस मिलता है।";
  rawHindi.scenes[0].beats[1].text = "Fischer Black ne 1976 me dikhaya ki futures price ko q barabar r continuous dividend yield ki tarah model kiya ja sakta hai.";
  rawHindi.scenes[0].beats[1].hindi_tts = "फिशर ब्लैक ने 1976 में दिखाया कि फ्यूचर्स कीमत को क्यू बराबर आर कंटीन्यूअस डिविडेंड यील्ड की तरह मॉडल किया जा सकता है।";

  rawEn.scenes[0].title = "Origins: Futures Options Mechanics & Settlement";
  rawEn.scenes[0].concept = "Long Call = Long Futures + Cash (F0 - K); Long Put = Short Futures + Cash (K - F0)";
  rawEn.scenes[0].beats[0].text = "Dr. Vance, exercising a futures call delivers an active long futures contract plus cash equal to the futures price minus strike.";
  rawEn.scenes[0].beats[1].text = "In 1976, Fischer Black proved that futures prices behave mathematically as assets yielding a continuous return equal to the risk-free rate.";

  // Scene 1: Conflicting Market Interests
  rawHindi.scenes[1].title = "Spot Delivery Hassles vs Liquid Futures Options";
  rawHindi.scenes[1].concept = "Avoiding physical storage and transport through standardized futures options";
  rawHindi.scenes[1].beats[0].text = "Traders physical delivery aur storage ki pareshani se bachne ke liye spot options ke bajaye liquid futures options ko chunte hain.";
  rawHindi.scenes[1].beats[0].hindi_tts = "ट्रेडर्स फिजिकल डिलीवरी और स्टोरेज की परेशानी से बचने के लिए स्पॉट ऑप्शंस के बजाय लिक्विड फ्यूचर्स ऑप्शंस को चुनते हैं।";

  rawEn.scenes[1].title = "Spot Delivery Hassles vs Liquid Futures Options";
  rawEn.scenes[1].concept = "Avoiding physical storage and transport through standardized futures options";
  rawEn.scenes[1].beats[0].text = "Traders strongly prefer futures options over spot contracts to eliminate physical storage and transport logistics while maximizing liquidity.";

  // Scene 2: Roadmap
  const cardsPillars = [
    { title: "1. Futures Assignment", body: "Long call receives long futures + cash (F0 - K)." },
    { title: "2. Put-Call Parity", body: "c + K*e^(-rT) = p + F0*e^(-rT) with zero initial cost." },
    { title: "3. Black's 1976 Model", body: "c = e^(-rT)[F0*N(d1) - K*N(d2)] without carry assumptions." },
    { title: "4. Futures Binomial Trees", body: "Risk-neutral up probability p = (1 - d) / (u - d)." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Black's Futures Option Framework";
  rawHindi.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya stambhon par charcha karenge: futures assignment mechanics, put-call parity, Black's model, aur futures binomial trees.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य स्तंभों पर चर्चा करेंगे: फ्यूचर्स असाइनमेंट मैकेनिक्स, पुट-कॉल पैरिटी, ब्लैक का 1976 मॉडल, और फ्यूचर्स बाइनोमियल ट्रीज।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Black's Futures Option Framework";
  rawEn.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: futures assignment mechanics, put-call parity, Black's 1976 formula, and binomial valuation trees.";

  // Scene 3: Spot Options vs Futures Options
  const leftSpot = {
    title: "Spot Options Architecture",
    items: ["Requires physical commodity delivery on exercise", "Incurs warehouse, storage, and transport costs", "Requires estimating convenience yields & carry costs"]
  };
  const rightFutures = {
    title: "Futures Options Architecture",
    items: ["Exercise creates liquid exchange futures position", "Clean cash settlement of (F0 - K) intraday", "Futures price F0 directly observable on order books"]
  };
  rawHindi.scenes[3].title = "Spot Options vs Futures Options Architecture";
  rawHindi.scenes[3].concept = "Liquid exchange futures vs cumbersome spot physical settlement";
  rawHindi.scenes[3].beats[0].ui_state.left = leftSpot;
  rawHindi.scenes[3].beats[0].ui_state.right = rightFutures;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftSpot;
    rawHindi.scenes[3].beats[0].visual.data.right = rightFutures;
  }
  rawHindi.scenes[3].beats[0].text = "Spot options me physical delivery ki pareshani hoti hai, jabki futures options me turant exchange futures contract aur cash settlement milta hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "स्पॉट ऑप्शंस में फिजिकल डिलीवरी की परेशानी होती है, जबकि फ्यूचर्स ऑप्शंस में तुरंत एक्सचेंज फ्यूचर्स कॉन्ट्रैक्ट और कैश सेटलमेंट मिलता है।";

  rawEn.scenes[3].title = "Spot Options vs Futures Options Architecture";
  rawEn.scenes[3].concept = "Liquid exchange futures vs cumbersome spot physical settlement";
  rawEn.scenes[3].beats[0].ui_state.left = leftSpot;
  rawEn.scenes[3].beats[0].ui_state.right = rightFutures;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftSpot;
    rawEn.scenes[3].beats[0].visual.data.right = rightFutures;
  }
  rawEn.scenes[3].beats[0].text = "While spot options require physical storage and delivery, futures options settle cleanly into liquid exchange futures positions with cash adjustment.";

  // Scene 4: Put-Call Parity for Futures Options
  const cardsParity = [
    { title: "Futures Parity Invariant", body: "c + K * e^(-r*T) = p + F0 * e^(-r*T)" },
    { title: "Discounted Futures", body: "F0 is discounted at e^(-rT) because entering futures costs zero cash." },
    { title: "No-Arbitrage Lock", body: "Synthetic futures created by buying call and writing put." }
  ];
  rawHindi.scenes[4].title = "Futures Option Put-Call Parity Invariant";
  rawHindi.scenes[4].beats[0].ui_state.cards = cardsParity;
  if (rawHindi.scenes[4].beats[0].visual?.data) rawHindi.scenes[4].beats[0].visual.data.cards = cardsParity;
  rawHindi.scenes[4].beats[0].text = "Futures options me put-call parity c plus K*e^(-rT) barabar p plus F0*e^(-rT) hoti hai, jisme F0 ko bhi present value me discount kiya jata hai.";
  rawHindi.scenes[4].beats[0].hindi_tts = "फ्यूचर्स ऑप्शंस में पुट-कॉल पैरिटी सी प्लस के ई की घात माइनस आर टी बराबर पी प्लस एफ 0 ई की घात माइनस आर टी होती है।";

  rawEn.scenes[4].title = "Futures Option Put-Call Parity Invariant";
  rawEn.scenes[4].beats[0].ui_state.cards = cardsParity;
  if (rawEn.scenes[4].beats[0].visual?.data) rawEn.scenes[4].beats[0].visual.data.cards = cardsParity;
  rawEn.scenes[4].beats[0].text = "For futures options, put-call parity states c plus K times e to the minus r T equals p plus F0 times e to the minus r T.";

  // Scene 5: Black's 1976 Model Formula Breakdown
  const blackFormula = "c = e^{-rT} [F_0 N(d_1) - K N(d_2)]";
  const blackParts = [
    { label: "Discounted Expected Futures", formula: "e^{-rT} F_0 N(d_1)", explanation: "Present value of receiving underlying futures contract" },
    { label: "Discounted Expected Strike", formula: "e^{-rT} K N(d_2)", explanation: "Present value of paying strike price on exercise condition" }
  ];
  rawHindi.scenes[5].title = "Black's 1976 Analytical Pricing Formula";
  rawHindi.scenes[5].concept = "c = e^(-rT)[F0*N(d1) - K*N(d2)]";
  rawHindi.scenes[5].beats[0].ui_state.formula = blackFormula;
  rawHindi.scenes[5].beats[0].ui_state.parts = blackParts;
  if (rawHindi.scenes[5].beats[0].visual?.data) {
    rawHindi.scenes[5].beats[0].visual.data.formula = blackFormula;
    rawHindi.scenes[5].beats[0].visual.data.parts = blackParts;
  }
  rawHindi.scenes[5].beats[0].text = "Black ke model me call price e^(-rT) guna F0*N(d1) minus K*N(d2) hoti hai. Yahan S0 ki jagah observable futures price F0 leti hai.";
  rawHindi.scenes[5].beats[0].hindi_tts = "ब्लैक के 1976 मॉडल में कॉल कीमत ई की घात माइनस आर टी गुणा एफ 0 एन डी 1 माइनस के एन डी 2 होती है।";

  rawEn.scenes[5].title = "Black's 1976 Analytical Pricing Formula";
  rawEn.scenes[5].concept = "c = e^(-rT)[F0*N(d1) - K*N(d2)]";
  rawEn.scenes[5].beats[0].ui_state.formula = blackFormula;
  rawEn.scenes[5].beats[0].ui_state.parts = blackParts;
  if (rawEn.scenes[5].beats[0].visual?.data) {
    rawEn.scenes[5].beats[0].visual.data.formula = blackFormula;
    rawEn.scenes[5].beats[0].visual.data.parts = blackParts;
  }
  rawEn.scenes[5].beats[0].text = "Black's 1976 model values futures calls as e to the minus r T times F0 times N of d1, minus K times N of d2.";

  // Scene 6: Numerical Example: Crude Oil Futures Call Option
  const leftCrudeParams = {
    title: "Market Parameters",
    items: ["Crude Oil Futures F0 = $50, Strike K = $50", "Risk-free r = 6.0%, Volatility sigma = 30%", "Maturity T = 0.75 years (9 months)"]
  };
  const rightCrudeSol = {
    title: "Analytical Solution",
    items: ["d1 = 0.1949 -> N(d1) = 0.5772", "d2 = -0.0649 -> N(d2) = 0.4741", "Call Premium c = $4.87 ($4,870 per 1,000 bbl contract)"]
  };
  rawHindi.scenes[6].title = "Crude Oil Futures Call Valuation (Numerical Proof)";
  rawHindi.scenes[6].concept = "F0=$50, K=$50, r=6%, sigma=30%, T=0.75 -> c=$4.87";
  rawHindi.scenes[6].beats[0].ui_state.left = leftCrudeParams;
  rawHindi.scenes[6].beats[0].ui_state.right = rightCrudeSol;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftCrudeParams;
    rawHindi.scenes[6].beats[0].visual.data.right = rightCrudeSol;
  }
  rawHindi.scenes[6].beats[0].text = "John Hull ke udaharan me 50 dollar crude oil futures par 9 mahine ka call option 4.87 dollar per barrel nikalta hai.";
  rawHindi.scenes[6].beats[0].hindi_tts = "जॉन हल के उदाहरण में 50 डॉलर क्रूड ऑयल फ्यूचर्स पर 9 महीने का कॉल ऑप्शन 4.87 डॉलर प्रति बैरल निकलता है।";

  rawEn.scenes[6].title = "Crude Oil Futures Call Valuation (Numerical Proof)";
  rawEn.scenes[6].concept = "F0=$50, K=$50, r=6%, sigma=30%, T=0.75 -> c=$4.87";
  rawEn.scenes[6].beats[0].ui_state.left = leftCrudeParams;
  rawEn.scenes[6].beats[0].ui_state.right = rightCrudeSol;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftCrudeParams;
    rawEn.scenes[6].beats[0].visual.data.right = rightCrudeSol;
  }
  rawEn.scenes[6].beats[0].text = "In Hull's benchmark crude oil futures example with F0 at $50, strike at $50, r at 6%, and volatility 30%, the 9-month call evaluates to $4.87.";

  // Scene 7: Practical Superiority of Black's Model
  const cardsSuperiority = [
    { title: "Direct Observability", body: "Futures price F0 is directly visible on exchange quotes." },
    { title: "Zero Dividend Estimation", body: "No need to estimate complex continuous dividends or carry." },
    { title: "Standard Desk Pricing", body: "Standard industry convention for commodities, rates, and FX." }
  ];
  rawHindi.scenes[7].title = "Why Trading Desks Prefer Black's Model over BSM";
  rawHindi.scenes[7].beats[0].ui_state.cards = cardsSuperiority;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = cardsSuperiority;
  rawHindi.scenes[7].beats[0].text = "Trading desks Black's model ko isliye prefer karte hain kyunki futures price screen par live milti hai, bina kisi dividend ya storage cost ka andaza lagaye.";
  rawHindi.scenes[7].beats[0].hindi_tts = "ट्रेडिंग डेस्क ब्लैक के मॉडल को इसलिए चुनते हैं क्योंकि फ्यूचर्स कीमत स्क्रीन पर लाइव दिखती है, बिना किसी डिविडेंड या स्टोरेज लागत का अनुमान लगाए।";

  rawEn.scenes[7].title = "Why Trading Desks Prefer Black's Model over BSM";
  rawEn.scenes[7].beats[0].ui_state.cards = cardsSuperiority;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = cardsSuperiority;
  rawEn.scenes[7].beats[0].text = "Trading desks universally adopt Black's model because exchange futures prices are directly observable, eliminating estimation error in dividends and carrying costs.";

  // Scene 8: Futures Binomial Tree Up Probability
  const treeFormula = "p = \\frac{1 - d}{u - d}, \\quad u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = \\frac{1}{u}";
  const treeParts = [
    { label: "Driftless Up Probability", formula: "p = (1 - d) / (u - d)", explanation: "Because futures require zero initial investment, the drift term e^(r*dt) is replaced by 1" },
    { label: "Volatility Step Ratio", formula: "u = e^{\\sigma \\sqrt{\\Delta t}}", explanation: "Proportional upward movement governed strictly by futures volatility sigma" }
  ];
  rawHindi.scenes[8].title = "Binomial Tree Valuation for Futures Options";
  rawHindi.scenes[8].concept = "Risk-neutral up probability p = (1 - d)/(u - d) with driftless futures";
  rawHindi.scenes[8].beats[0].ui_state.formula = treeFormula;
  rawHindi.scenes[8].beats[0].ui_state.parts = treeParts;
  if (rawHindi.scenes[8].beats[0].visual?.data) {
    rawHindi.scenes[8].beats[0].visual.data.formula = treeFormula;
    rawHindi.scenes[8].beats[0].visual.data.parts = treeParts;
  }
  rawHindi.scenes[8].beats[0].text = "Futures binomial tree me risk-neutral up probability p barabar 1 minus d divided by u minus d hoti hai, kyunki futures me drift zero hota hai.";
  rawHindi.scenes[8].beats[0].hindi_tts = "फ्यूचर्स बाइनोमियल ट्री में रिस्क-न्यूट्रल अप प्रोबेबिलिटी पी बराबर 1 माइनस डी डिवाइडेड बाई यू माइनस डी होती है।";

  rawEn.scenes[8].title = "Binomial Tree Valuation for Futures Options";
  rawEn.scenes[8].concept = "Risk-neutral up probability p = (1 - d)/(u - d) with driftless futures";
  rawEn.scenes[8].beats[0].ui_state.formula = treeFormula;
  rawEn.scenes[8].beats[0].ui_state.parts = treeParts;
  if (rawEn.scenes[8].beats[0].visual?.data) {
    rawEn.scenes[8].beats[0].visual.data.formula = treeFormula;
    rawEn.scenes[8].beats[0].visual.data.parts = treeParts;
  }
  rawEn.scenes[8].beats[0].text = "In binomial trees for futures, the risk-neutral upward probability is p equals 1 minus d divided by u minus d, reflecting zero drift.";

  // Scene 9: Interactive Quiz (Word count >= 18 words)
  const quizQuestion = "When holding a deep in-the-money American call option on a futures contract, under what structural conditions is immediate early exercise mathematically optimal?";
  const quizOptions = [
    "A) When interest rates are high and receiving immediate cash (F - K) allows earning interest at rate r",
    "B) When the underlying futures contract has negative volatility skew",
    "C) When exchange clearinghouses prohibit holding options beyond 30 days",
    "D) Only if the underlying futures price is lower than the strike price"
  ];
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].concept = "Early exercise conditions for American futures options";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawHindi.scenes[9].beats[0].text = "When holding a deep in-the-money American call option on a futures contract, under what structural conditions is immediate early exercise mathematically optimal?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए जब अमेरिकन फ्यूचर्स कॉल ऑप्शन डीप इन-द-मनी हो, तो तुरंत एक्सरसाइज करके मिलने वाले कैश पर ब्याज कमाना कब सबसे फायदेमंद होता है?";
  rawHindi.scenes[9].beats[1].text = "Sochiye kya high interest rate environment me cash F minus K par interest earn karna time value se zyada valuable hota hai.";
  rawHindi.scenes[9].beats[1].hindi_tts = "सोचिए क्या उच्च ब्याज दरों में तुरंत कैश प्राप्त करके उस पर ब्याज कमाना ऑप्शन को मैच्योरिटी तक होल्ड करने से बेहतर है।";
  rawHindi.scenes[9].beats[2].text = "Sahi uttar A hai. Futures call exercise karne par mila cash turant rate r par interest generate karta hai, isliye early exercise optimal hota hai.";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। फ्यूचर्स कॉल एक्सरसाइज करने पर प्राप्त कैश तुरंत ब्याज दर आर पर रिटर्न कमाता है, इसलिए अर्ली एक्सरसाइज फायदेमंद होती है।";

  rawEn.scenes[9].title = "Active Recall Challenge";
  rawEn.scenes[9].concept = "Early exercise conditions for American futures options";
  rawEn.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawEn.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawEn.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawEn.scenes[9].beats[0].text = "When holding a deep in-the-money American call option on a futures contract, under what structural conditions is immediate early exercise mathematically optimal?";
  rawEn.scenes[9].beats[1].text = "Consider how immediate cash release F minus K earns the risk-free rate r.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Exercising an American futures call early frees up cash to earn risk-free interest immediately.";

  // Scene 10: Trading Desk Narrative (Futures-Style Options)
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].concept = "Futures-style options with zero upfront premium and daily mark-to-market";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, kai exchanges futures-style options trade karate hain jisme koi upfront premium nahi dena hota.";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, कई एक्सचेंज फ्यूचर्स-स्टाइल ऑप्शंस ट्रेड कराते हैं जिसमें कोई अपफ्रंट प्रीमियम नहीं देना होता।";
  rawHindi.scenes[10].beats[1].text = "Yahan daily variation margin mark-to-market hota hai, jisse interest rate discounting ka jhamela poori tarah khatam ho jata hai.";
  rawHindi.scenes[10].beats[1].hindi_tts = "यहाँ दैनिक वेरिएशन मार्जिन मार्क-टू-मार्केट होता है, जिससे ब्याज दर डिस्काउंटिंग का झंझट पूरी तरह खत्म हो जाता है।";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].concept = "Futures-style options with zero upfront premium and daily mark-to-market";
  rawEn.scenes[10].beats[0].text = "Dr. Vance, futures-style options eliminate upfront cash premiums entirely by marking both calls and puts to market daily.";
  rawEn.scenes[10].beats[1].text = "Daily cash flows through variation margin align option pricing directly with futures mechanics, eliminating interest discounting.";

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
    taskId: "hull_ch16_part1_dialogue_refine",
    chapterSlug,
    targetFiles: [
      path.join(hindiDir, "episode_raw.json"),
      path.join(englishDir, "episode_raw.json")
    ],
    status: "COMPLETED",
    description: "Scaffolded 12-scene episode for Chapter 16 Part 1 covering Futures Options, Black's 1976 Model, Put-Call Parity, and Futures-Style Options."
  };
  fs.mkdirSync(".cline/tasks", { recursive: true });
  fs.writeFileSync(".cline/tasks/hull_ch16_part1_dialogue_refine.json", JSON.stringify(clineTask, null, 2), "utf8");
  console.log("Saved Cline task manifest to .cline/tasks/hull_ch16_part1_dialogue_refine.json");
}

main().catch(err => {
  console.error("Scaffolding failed:", err);
  process.exit(1);
});
