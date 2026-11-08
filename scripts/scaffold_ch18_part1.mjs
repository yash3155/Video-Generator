import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch18_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch18_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Binomial Trees in Practice",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Binomial Trees in Practice",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Introduction to Practical Binomial Trees
  rawHindi.scenes[0].title = "Origins: Discrete Tree Discretization in Practice";
  rawHindi.scenes[0].concept = "Why continuous formulas fail on American early exercise and how trees solve it";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, American options me beech me kabhi bhi exercise kiya ja sakta hai, isliye Black-Scholes ka closed-form formula yahan kaam nahi karta.";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, अमेरिकन ऑप्शंस में बीच में कभी भी एक्सरसाइज किया जा सकता है, इसलिए ब्लैक-शोल्स का फॉर्मूला यहाँ काम नहीं करता।";
  rawHindi.scenes[0].beats[1].text = "Iske liye hum Cox-Ross-Rubinstein binomial trees aur Monte Carlo simulation jaise numerical tareeqon ka istemal karte hain.";
  rawHindi.scenes[0].beats[1].hindi_tts = "इसके लिए हम कॉक्स-रॉस-रुबिनस्टीन बाइनोमियल ट्रीज और मोंटे कार्लो सिमुलेशन जैसे न्यूमेरिकल तरीकों का इस्तेमाल करते हैं।";

  rawEn.scenes[0].title = "Origins: Discrete Tree Discretization in Practice";
  rawEn.scenes[0].concept = "Why continuous formulas fail on American early exercise and how trees solve it";
  rawEn.scenes[0].beats[0].text = "Dr. Vance, because American options permit early exercise at any intermediate moment, analytical BSM closed-form formulas break down.";
  rawEn.scenes[0].beats[1].text = "Instead, institutions employ discrete Cox-Ross-Rubinstein binomial trees and Monte Carlo simulation for exact numerical valuation.";

  // Scene 1: Analytical Closed Form vs Backward Induction Trees
  rawHindi.scenes[1].title = "Analytical Formulas vs Backward Induction Trees";
  rawHindi.scenes[1].concept = "Why backward induction checks optimal exercise at every node";
  rawHindi.scenes[1].beats[0].text = "Analytical formulas sirf maturity par payoff dekhte hain, jabki binomial trees backward induction se har node par early exercise check karte hain.";
  rawHindi.scenes[1].beats[0].hindi_tts = "एनालिटिकल फॉर्मूले सिर्फ मैच्योरिटी पर पेऑफ देखते हैं, जबकि बाइनोमियल ट्रीज बैकवर्ड इंडक्शन से हर नोड पर अर्ली एक्सरसाइज चेक करते हैं।";

  rawEn.scenes[1].title = "Analytical Formulas vs Backward Induction Trees";
  rawEn.scenes[1].concept = "Why backward induction checks optimal exercise at every node";
  rawEn.scenes[1].beats[0].text = "While analytical formulas only observe expiration payoffs, binomial trees use backward induction to evaluate exercise boundaries at every single node.";

  // Scene 2: Roadmap
  const cardsPillars = [
    { title: "1. CRR Parameterization", body: "u = e^(sigma*sqrt(dt)), d = 1/u, and risk-neutral p." },
    { title: "2. Backward Induction", body: "Comparing immediate intrinsic payoff with continuation value." },
    { title: "3. Control Variates", body: "f_A = f_A(tree) + [f_E(BSM) - f_E(tree)] 10x error reduction." },
    { title: "4. Monte Carlo Paths", body: "Simulating geometric Brownian motion paths for exotic claims." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Numerical Valuation";
  rawHindi.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: CRR tree parameters, backward induction, control variate technique, aur Monte Carlo simulation.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: सीआरआर ट्री पैरामीटर्स, बैकवर्ड इंडक्शन, कंट्रोल वेरिएट तकनीक, और मोंटे कार्लो सिमुलेशन।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Numerical Valuation";
  rawEn.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: CRR parameterization, backward induction early exercise checks, the control variate technique, and Monte Carlo path simulation.";

  // Scene 3: Binomial Trees vs Monte Carlo Simulation
  const leftTrees = {
    title: "Binomial Trees Architecture",
    items: ["Steps backward from terminal expiration", "Cleanly values American options with early exercise", "Node count grows as N(N+1)/2 for recombining trees"]
  };
  const rightMonte = {
    title: "Monte Carlo Simulation Architecture",
    items: ["Steps forward along simulated random paths", "Excels at path-dependent European exotics (Asian, barrier)", "Handles dozens of correlated underlying assets cleanly"]
  };
  rawHindi.scenes[3].title = "Binomial Trees vs Monte Carlo Simulation";
  rawHindi.scenes[3].concept = "Backward induction for American early exercise vs forward paths for path-dependent exotics";
  rawHindi.scenes[3].beats[0].ui_state.left = leftTrees;
  rawHindi.scenes[3].beats[0].ui_state.right = rightMonte;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftTrees;
    rawHindi.scenes[3].beats[0].visual.data.right = rightMonte;
  }
  rawHindi.scenes[3].beats[0].text = "Binomial trees American options ke early exercise ke liye perfect hain, jabki Monte Carlo simulation complex path-dependent exotic options ke liye best hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "बाइनोमियल ट्रीज अमेरिकन ऑप्शंस के अर्ली एक्सरसाइज के लिए परफेक्ट हैं, जबकि मोंटे कार्लो सिमुलेशन कॉम्प्लेक्स पाथ-डिपेंडेंट एग्जॉटिक ऑप्शंस के लिए बेस्ट है।";

  rawEn.scenes[3].title = "Binomial Trees vs Monte Carlo Simulation";
  rawEn.scenes[3].concept = "Backward induction for American early exercise vs forward paths for path-dependent exotics";
  rawEn.scenes[3].beats[0].ui_state.left = leftTrees;
  rawEn.scenes[3].beats[0].ui_state.right = rightMonte;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftTrees;
    rawEn.scenes[3].beats[0].visual.data.right = rightMonte;
  }
  rawEn.scenes[3].beats[0].text = "Binomial trees excel at backward induction for American early exercise, while Monte Carlo simulation excels at forward path-dependent exotic derivatives.";

  // Scene 4: Cox-Ross-Rubinstein Up/Down Step Geometry
  const cardsCrr = [
    { title: "Up Step Factor", body: "u = e^(sigma * sqrt(dt)) matches stock diffusion variance." },
    { title: "Down Step Invariant", body: "d = 1 / u guarantees tree branches recombine perfectly." },
    { title: "Risk-Neutral Drift", body: "p = (e^((r-q)dt) - d) / (u - d) matches risk-neutral expectation." }
  ];
  rawHindi.scenes[4].title = "Cox-Ross-Rubinstein (CRR) Tree Geometry";
  rawHindi.scenes[4].beats[0].ui_state.cards = cardsCrr;
  if (rawHindi.scenes[4].beats[0].visual?.data) rawHindi.scenes[4].beats[0].visual.data.cards = cardsCrr;
  rawHindi.scenes[4].beats[0].text = "CRR model me u barabar e^(sigma*sqrt(dt)) aur d barabar 1/u hota hai, jisse tree recombine hoti hai aur calculation exponentially blast nahi hoti.";
  rawHindi.scenes[4].beats[0].hindi_tts = "सीआरआर मॉडल में यू बराबर ई की घात सिग्मा रूट डीटी और डी बराबर 1/यू होता है, जिससे ट्री रीकंबाइन होती है और नोड्स सीमित रहते हैं।";

  rawEn.scenes[4].title = "Cox-Ross-Rubinstein (CRR) Tree Geometry";
  rawEn.scenes[4].beats[0].ui_state.cards = cardsCrr;
  if (rawEn.scenes[4].beats[0].visual?.data) rawEn.scenes[4].beats[0].visual.data.cards = cardsCrr;
  rawEn.scenes[4].beats[0].text = "The CRR parameterization sets u equals e to the sigma root dt and d equals 1/u, ensuring tree paths recombine into an efficient lattice.";

  // Scene 5: Control Variate Technique Formula Breakdown
  const cvFormula = "f_A = f_A^{tree} + \\left(f_E^{BSM} - f_E^{tree}\\right)";
  const cvParts = [
    { label: "Raw American Tree Estimate", formula: "f_A^{tree}", explanation: "American option value computed on an N-step binomial tree" },
    { label: "Discretization Error Correction", formula: "f_E^{BSM} - f_E^{tree}", explanation: "Exact analytical BSM European price minus European price evaluated on the same tree" }
  ];
  rawHindi.scenes[5].title = "The Control Variate Error Reduction Technique";
  rawHindi.scenes[5].concept = "f_A = f_A(tree) + [f_E(BSM) - f_E(tree)]";
  rawHindi.scenes[5].beats[0].ui_state.formula = cvFormula;
  rawHindi.scenes[5].beats[0].ui_state.parts = cvParts;
  if (rawHindi.scenes[5].beats[0].visual?.data) {
    rawHindi.scenes[5].beats[0].visual.data.formula = cvFormula;
    rawHindi.scenes[5].beats[0].visual.data.parts = cvParts;
  }
  rawHindi.scenes[5].beats[0].text = "Control variate technique me European option ke analytical BSM error ko American tree estimate me jod kar 50-step tree ko 500-step tree jaisi accuracy di jati hai.";
  rawHindi.scenes[5].beats[0].hindi_tts = "कंट्रोल वेरिएट तकनीक में यूरोपियन ऑप्शन के एनालिटिकल एरर को अमेरिकन ट्री में जोड़कर 50-स्टेप ट्री को 500-स्टेप जितनी सटीकता दी जाती है।";

  rawEn.scenes[5].title = "The Control Variate Error Reduction Technique";
  rawEn.scenes[5].concept = "f_A = f_A(tree) + [f_E(BSM) - f_E(tree)]";
  rawEn.scenes[5].beats[0].ui_state.formula = cvFormula;
  rawEn.scenes[5].beats[0].ui_state.parts = cvParts;
  if (rawEn.scenes[5].beats[0].visual?.data) {
    rawEn.scenes[5].beats[0].visual.data.formula = cvFormula;
    rawEn.scenes[5].beats[0].visual.data.parts = cvParts;
  }
  rawEn.scenes[5].beats[0].text = "The control variate technique isolates discretization error via European closed-form BSM pricing, elevating a 50-step tree to 500-step precision.";

  // Scene 6: Hull Figure 18.2: Two-Step American Put Tree
  const leftTreeParams = {
    title: "Tree Parameters (Figure 18.2)",
    items: ["Spot S0 = $50, Strike K = $52, r = 5.0%, sigma = 30%", "Maturity T = 2 years, Steps = 2 (dt = 1 year)", "u = 1.3499, d = 0.7408, p = 0.5097"]
  };
  const rightTreeResult = {
    title: "Backward Induction Node Analysis",
    items: ["Node (1, 0): Stock S = $37.04", "Immediate exercise profit: $52 - $37.04 = $14.96", "Continuation value: $12.36 -> Early exercise optimal!", "Initial American Put Price: $7.43"]
  };
  rawHindi.scenes[6].title = "Two-Step American Put Tree (Hull Figure 18.2)";
  rawHindi.scenes[6].concept = "S0=$50, K=$52, dt=1 yr -> early exercise at node (1, 0) yields $14.96, Put=$7.43";
  rawHindi.scenes[6].beats[0].ui_state.left = leftTreeParams;
  rawHindi.scenes[6].beats[0].ui_state.right = rightTreeResult;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftTreeParams;
    rawHindi.scenes[6].beats[0].visual.data.right = rightTreeResult;
  }
  rawHindi.scenes[6].beats[0].text = "John Hull ke Figure 18.2 me 50 dollar stock par 2-step tree me node B par stock 37.04 dollar hone par turant exercise karke 14.96 dollar realize hota hai.";
  rawHindi.scenes[6].beats[0].hindi_tts = "जॉन हल के फिगर 18.2 में 50 डॉलर स्टॉक पर 2-स्टेप ट्री में नोड बी पर स्टॉक 37.04 डॉलर होने पर तुरंत एक्सरसाइज करके 14.96 डॉलर मिलते हैं।";

  rawEn.scenes[6].title = "Two-Step American Put Tree (Hull Figure 18.2)";
  rawEn.scenes[6].concept = "S0=$50, K=$52, dt=1 yr -> early exercise at node (1, 0) yields $14.96, Put=$7.43";
  rawEn.scenes[6].beats[0].ui_state.left = leftTreeParams;
  rawEn.scenes[6].beats[0].ui_state.right = rightTreeResult;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftTreeParams;
    rawEn.scenes[6].beats[0].visual.data.right = rightTreeResult;
  }
  rawEn.scenes[6].beats[0].text = "In Hull's benchmark Figure 18.2 tree, at node (1, 0) where stock falls to $37.04, early exercise realizes $14.96 versus $12.36 continuation, pricing the put at $7.43.";

  // Scene 7: Recombining vs Non-Recombining Trees for Discrete Dividends
  const cardsDividends = [
    { title: "Dividend Escrow Method", body: "S* = S - PV(dividends) keeps tree recombining with N(N+1)/2 nodes." },
    { title: "Non-Recombining Explosion", body: "Direct dollar drops create 2^N nodes, crashing computer memory." },
    { title: "Continuous Yield q", body: "Adjusts growth factor a = e^((r - q)dt) cleanly with zero node expansion." }
  ];
  rawHindi.scenes[7].title = "Discrete Dividends & Recombining Tree Architecture";
  rawHindi.scenes[7].beats[0].ui_state.cards = cardsDividends;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = cardsDividends;
  rawHindi.scenes[7].beats[0].text = "Discrete dividend aane par direct minus karne se tree bikhar jati hai. Isliye Hull stock ko escrow component S* me baant kar tree ko recombining rakhte hain.";
  rawHindi.scenes[7].beats[0].hindi_tts = "डिस्क्रीट डिविडेंड आने पर डायरेक्ट घटाने से ट्री बिखर जाती है। इसलिए जॉन हल स्टॉक को एस्क्रो कंपोनेंट में बाँटकर ट्री को रीकंबाइन रखते हैं।";

  rawEn.scenes[7].title = "Discrete Dividends & Recombining Tree Architecture";
  rawEn.scenes[7].beats[0].ui_state.cards = cardsDividends;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = cardsDividends;
  rawEn.scenes[7].beats[0].text = "To prevent discrete dollar dividends from shattering the recombining lattice into two to the N nodes, Hull defines volatile stock as S minus the present value of dividends.";

  // Scene 8: Monte Carlo Path Generation Formula Breakdown
  const mcFormula = "S_{t+\\Delta t} = S_t \\exp\\left[\\left(r - q - \\frac{\\sigma^2}{2}\\right)\\Delta t + \\sigma \\sqrt{\\Delta t} \\epsilon\\right]";
  const mcParts = [
    { label: "Risk-Neutral Drift", formula: "\\left(r - q - \\frac{\\sigma^2}{2}\\right)\\Delta t", explanation: "Expected continuous capital appreciation under risk-neutral probability" },
    { label: "Stochastic Shock", formula: "\\sigma \\sqrt{\\Delta t} \\epsilon", explanation: "Random standard normal diffusion perturbation with epsilon ~ N(0, 1)" }
  ];
  rawHindi.scenes[8].title = "Monte Carlo Geometric Brownian Motion Simulation";
  rawHindi.scenes[8].concept = "S(t+dt) = S(t)*exp[(r - q - 0.5*sigma^2)dt + sigma*sqrt(dt)*epsilon]";
  rawHindi.scenes[8].beats[0].ui_state.formula = mcFormula;
  rawHindi.scenes[8].beats[0].ui_state.parts = mcParts;
  if (rawHindi.scenes[8].beats[0].visual?.data) {
    rawHindi.scenes[8].beats[0].visual.data.formula = mcFormula;
    rawHindi.scenes[8].beats[0].visual.data.parts = mcParts;
  }
  rawHindi.scenes[8].beats[0].text = "Monte Carlo simulation me geometric Brownian motion formula se hazaron random paths banaye jate hain aur unke discounted payoff ka average nikala jata hai.";
  rawHindi.scenes[8].beats[0].hindi_tts = "मोंटे कार्लो सिमुलेशन में जियोमेट्रिक ब्राउनियन मोशन से हज़ारों रैंडम पाथ्स बनाए जाते हैं और उनके डिस्काउंटेड पेऑफ का एवरेज निकाला जाता है।";

  rawEn.scenes[8].title = "Monte Carlo Geometric Brownian Motion Simulation";
  rawEn.scenes[8].concept = "S(t+dt) = S(t)*exp[(r - q - 0.5*sigma^2)dt + sigma*sqrt(dt)*epsilon]";
  rawEn.scenes[8].beats[0].ui_state.formula = mcFormula;
  rawEn.scenes[8].beats[0].ui_state.parts = mcParts;
  if (rawEn.scenes[8].beats[0].visual?.data) {
    rawEn.scenes[8].beats[0].visual.data.formula = mcFormula;
    rawEn.scenes[8].beats[0].visual.data.parts = mcParts;
  }
  rawEn.scenes[8].beats[0].text = "Monte Carlo simulation generates risk-neutral paths via geometric Brownian motion, averaging discounted terminal payoffs across thousands of iterations.";

  // Scene 9: Interactive Quiz (Word count >= 18 words)
  const quizQuestion = "Why does pairing a 50-step binomial tree with the control variate technique achieve accuracy comparable to a 500-step raw tree without computational latency?";
  const quizOptions = [
    "A) It measures the known discretization error on European options via exact Black-Scholes-Merton formulas and adds it to the American tree price",
    "B) It eliminates all implied volatility estimation requirements across exchange order books",
    "C) It forces the risk-neutral probability p to equal exactly 0.5000 at all tree nodes",
    "D) It converts the underlying binomial tree into a continuous futures option contract"
  ];
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].concept = "Why control variate achieves 10x computational speedup";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawHindi.scenes[9].beats[0].text = "Why does pairing a 50-step binomial tree with the control variate technique achieve accuracy comparable to a 500-step raw tree without computational latency?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए क्या 50-स्टेप ट्री में यूरोपियन ऑप्शन के एनालिटिकल ब्लैक-शोल्स एरर को जोड़ने से 500-स्टेप जितनी सटीकता बिना कंप्यूटर को स्लो किए मिल जाती है?";
  rawHindi.scenes[9].beats[1].text = "Sochiye kya European closed-form BSM error American tree discretization error ke lagbhag barabar hota hai.";
  rawHindi.scenes[9].beats[1].hindi_tts = "सोचिए क्या यूरोपियन एनालिटिकल फॉर्मूले का एरर अमेरिकन ट्री के एरर को पूरी तरह ऑफसेट कर देता है।";
  rawHindi.scenes[9].beats[2].text = "Sahi uttar A hai. Control variate method European options ke known error f_E(BSM) minus f_E(tree) ko American estimate me add karke error mita deta hai.";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। कंट्रोल वेरिएट तकनीक यूरोपियन ऑप्शंस के नोन एरर को जोड़कर ट्री को 10 गुना तेज़ और सटीक बना देती है।";

  rawEn.scenes[9].title = "Active Recall Challenge";
  rawEn.scenes[9].concept = "Why control variate achieves 10x computational speedup";
  rawEn.scenes[9].beats[0].ui_state.question = quizQuestion;
  rawEn.scenes[9].beats[0].ui_state.options = quizOptions;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQuestion;
    rawEn.scenes[9].beats[0].visual.data.options = quizOptions;
  }
  rawEn.scenes[9].beats[0].text = "Why does pairing a 50-step binomial tree with the control variate technique achieve accuracy comparable to a 500-step raw tree without computational latency?";
  rawEn.scenes[9].beats[1].text = "Evaluate how analytical European closed-form error offsets lattice discretization.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Adding the European BSM closed-form error correction elevates a 50-step lattice to 500-step precision instantly.";

  // Scene 10: Trading Desk Narrative (Desk Implementation Choice)
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].concept = "Desk Choice: Binomial Trees for American vs Monte Carlo for Multi-Asset Exotics";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, trading desk par American equity options ke liye 50 se 100 steps ki CRR trees control variates ke sath standard hain.";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, ट्रेडिंग डेस्क पर अमेरिकन इक्विटी ऑप्शंस के लिए 50 से 100 स्टेप्स की सीआरआर ट्रीज कंट्रोल वेरिएट्स के साथ स्टैंडर्ड हैं।";
  rawHindi.scenes[10].beats[1].text = "Aur multi-asset Asian ya barrier options ke liye Monte Carlo simulation lagaya jata hai.";
  rawHindi.scenes[10].beats[1].hindi_tts = "और मल्टी-एसेट एशियन या बैरियर ऑप्शंस के लिए मोंटे कार्लो सिमुलेशन लगाया जाता है।";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].concept = "Desk Choice: Binomial Trees for American vs Monte Carlo for Multi-Asset Exotics";
  rawEn.scenes[10].beats[0].text = "Dr. Vance, production trading desks deploy 50 to 100 step CRR trees with control variates for sub-second American equity pricing.";
  rawEn.scenes[10].beats[1].text = "Conversely, multi-asset basket and path-dependent Asian options are routed to GPU-accelerated Monte Carlo simulation engines.";

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
    taskId: "hull_ch18_part1_dialogue_refine",
    chapterSlug,
    targetFiles: [
      path.join(hindiDir, "episode_raw.json"),
      path.join(englishDir, "episode_raw.json")
    ],
    status: "COMPLETED",
    description: "Scaffolded 12-scene episode for Chapter 18 Part 1 covering Binomial Trees in Practice, CRR parameters, Backward Induction, Control Variate, and Monte Carlo."
  };
  fs.mkdirSync(".cline/tasks", { recursive: true });
  fs.writeFileSync(".cline/tasks/hull_ch18_part1_dialogue_refine.json", JSON.stringify(clineTask, null, 2), "utf8");
  console.log("Saved Cline task manifest to .cline/tasks/hull_ch18_part1_dialogue_refine.json");
}

main().catch(err => {
  console.error("Scaffolding failed:", err);
  process.exit(1);
});

