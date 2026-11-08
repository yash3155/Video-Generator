import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch20_part2";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch20_part2 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Model-Building VaR & Volatility Updating",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Model-Building VaR & Volatility Updating",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: Multivariate Model-Building Assumptions";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, model-building approach me portfolio VaR nikaalne ke liye kya assumptions lene padte hain?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, मॉडल-बिल्डिंग अप्रोच में पोर्टफोलियो वार निकालने के लिए क्या मान्यताएं माननी पड़ती हैं?";
  rawHindi.scenes[0].beats[1].text = "Raju, hum assume karte hain ki sabhi assets ke daily returns multivariate normal distribution follow karte hain!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, हम मानते हैं कि सभी एसेट्स के डेली रिटर्न्स मल्टीवैरिएट नॉर्मल डिस्ट्रीब्यूशन का पालन करते हैं!";

  rawEn.scenes[0].title = "Origins: Multivariate Model-Building Assumptions";
  rawEn.scenes[0].beats[0].text = "Sharma ji, what core statistical assumptions underpin the model-building variance-covariance approach?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, what core statistical assumptions underpin the model-building variance-covariance approach?";
  rawEn.scenes[0].beats[1].text = "Raju, the model assumes that individual daily asset returns follow a joint multivariate normal distribution.";
  rawEn.scenes[0].beats[1].dialogue = "Raju, the model assumes that individual daily asset returns follow a joint multivariate normal distribution.";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Historical Simulation vs Parametric Model-Building";
  rawHindi.scenes[1].beats[0].text = "Historical simulation distribution assumption nahi maangta, jabki model-building fast analytical formulas deta hai.";
  rawHindi.scenes[1].beats[0].hindi_tts = "हिस्टोरिकल सिमुलेशन डिस्ट्रीब्यूशन का कोई फॉर्मूला नहीं थोपता, जबकि मॉडल-बिल्डिंग फास्ट एनालिटिकल फॉर्मूले प्रदान करता है।";

  rawEn.scenes[1].title = "Historical Simulation vs Parametric Model-Building";
  rawEn.scenes[1].beats[0].text = "While historical simulation requires zero distributional assumptions, model-building yields rapid analytical variance formulas.";
  rawEn.scenes[1].beats[0].dialogue = "While historical simulation requires zero distributional assumptions, model-building yields rapid analytical variance formulas.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Variance-Covariance", body: "Analytically aggregating correlated asset risks via covariance matrix w^T Sigma w." },
    { title: "2. Delta-Gamma Expansion", body: "Taylor series capturing option curvature Gamma alongside linear Delta." },
    { title: "3. EWMA RiskMetrics", body: "Exponential variance updating with decay factor lambda = 0.94." },
    { title: "4. GARCH(1,1)", body: "Mean-reverting volatility forecasting toward long-term variance rate V_L." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Parametric Risk Modeling";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: covariance matrix, delta-gamma model, EWMA, aur GARCH volatility forecasting.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: कोवैरिएंस मैट्रिक्स, डेल्टा-गामा मॉडल, ईडब्ल्यूएमए, और गार्च वोलैटिलिटी फोरकास्टिंग।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Parametric Risk Modeling";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: covariance aggregation, delta-gamma expansions, EWMA updating, and GARCH mean-reversion.";
  rawEn.scenes[2].beats[0].dialogue = "We explore four foundational pillars: covariance aggregation, delta-gamma expansions, EWMA updating, and GARCH mean-reversion.";

  // Scene 3: Comparison - Delta-Normal vs Delta-Gamma
  const leftLin = {
    title: "Linear (Delta-Normal) Model",
    items: [
      "Approximation: Delta P = sum delta_i * Delta S_i",
      "Fast and closed-form normal distribution",
      "Fails on options: completely ignores gamma curvature"
    ]
  };
  const rightQuad = {
    title: "Quadratic (Delta-Gamma) Model",
    items: [
      "Taylor expansion: delta*Delta S + 0.5*Gamma*(Delta S)^2 + Theta*Delta t",
      "Captures non-linear option convexities and jump risks",
      "Requires Cornish-Fisher or Monte Carlo for exact percentiles"
    ]
  };
  rawHindi.scenes[3].title = "Linear Delta-Normal vs Quadratic Delta-Gamma Approximation";
  rawHindi.scenes[3].beats[0].ui_state.left = leftLin;
  rawHindi.scenes[3].beats[0].ui_state.right = rightQuad;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftLin;
    rawHindi.scenes[3].beats[0].visual.data.right = rightQuad;
  }
  rawHindi.scenes[3].beats[0].text = "Linear model options ke curvature ko chhod deta hai, jabki delta-gamma approximation second derivative gamma ko jodkar convex risk capture karta hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "लीनियर मॉडल ऑप्शंस के कर्वेचर को छोड़ देता है, जबकि डेल्टा-गामा अप्रोच सेकंड डेरिवेटिव गामा को जोड़कर कॉन्वेक्स रिस्क को पकड़ती है।";

  rawEn.scenes[3].title = "Linear Delta-Normal vs Quadratic Delta-Gamma Approximation";
  rawEn.scenes[3].beats[0].ui_state.left = leftLin;
  rawEn.scenes[3].beats[0].ui_state.right = rightQuad;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftLin;
    rawEn.scenes[3].beats[0].visual.data.right = rightQuad;
  }
  rawEn.scenes[3].beats[0].text = "Linear models ignore option convexities, whereas the delta-gamma expansion incorporates second-order gamma curvature.";
  rawEn.scenes[3].beats[0].dialogue = "Linear models ignore option convexities, whereas the delta-gamma expansion incorporates second-order gamma curvature.";

  // Scene 4: Formula Breakdown - Two-Asset VaR
  rawHindi.scenes[4].title = "Two-Asset Correlation & Portfolio Standard Deviation Formula";
  rawHindi.scenes[4].beats[0].text = "Do assets ke portfolio ki standard deviation correlation coefficient rho par depend karti hai aur 99 percent VaR 2.326 guna sigma P hoti hai.";
  rawHindi.scenes[4].beats[0].hindi_tts = "दो एसेट्स के पोर्टफोलियो की स्टैंडर्ड डेविएशन कोरिलेशन कोएफिशिएंट रो पर निर्भर करती है और 99 परसेंट वार 2.326 गुना सिग्मा पी होती है।";

  rawEn.scenes[4].title = "Two-Asset Correlation & Portfolio Standard Deviation Formula";
  rawEn.scenes[4].beats[0].text = "The two-asset portfolio standard deviation incorporates correlation rho, scaling by 2.326 for 99% one-day VaR.";
  rawEn.scenes[4].beats[0].dialogue = "The two-asset portfolio standard deviation incorporates correlation rho, scaling by 2.326 for 99% one-day VaR.";

  // Scene 5: Case Study - Hull Section 20.3 Microsoft & AT&T
  rawHindi.scenes[5].title = "Hull Section 20.3: Microsoft & AT&T Portfolio Diversification Benefit";
  rawHindi.scenes[5].beats[0].text = "हल के उदाहरण में माइक्रोसॉफ्ट और एटीएंडटी के अलग-अलग वार का जोड़ 581,500 डॉलर था, लेकिन कोरिलेशन 0.3 होने से पोर्टफोलियो वार सिर्फ 496,600 डॉलर आया।";
  rawHindi.scenes[5].beats[0].hindi_tts = "हल के उदाहरण में माइक्रोसॉफ्ट और एटीएंडटी के अलग-अलग वार का जोड़ 581,500 डॉलर था, लेकिन कोरिलेशन 0.3 होने से पोर्टफोलियो वार सिर्फ 496,600 डॉलर आया।";

  rawEn.scenes[5].title = "Hull Section 20.3: Microsoft & AT&T Portfolio Diversification Benefit";
  rawEn.scenes[5].beats[0].text = "In Hull Section 20.3, individual VaRs sum to $581,500, but a 0.3 correlation produces a portfolio VaR of $496,600—an $84,900 diversification benefit.";
  rawEn.scenes[5].beats[0].dialogue = "In Hull Section 20.3, individual VaRs sum to $581,500, but a 0.3 correlation produces a portfolio VaR of $496,600—an $84,900 diversification benefit.";

  // Scene 6: Split Comparison - EWMA vs GARCH
  const leftEWMA = {
    title: "EWMA Model (RiskMetrics)",
    items: [
      "sigma_n^2 = lambda*sigma_{n-1}^2 + (1-lambda)*u_{n-1}^2",
      "No long-run mean reversion",
      "Simpler parameterization (lambda = 0.94)"
    ]
  };
  const rightGARCH = {
    title: "GARCH(1,1) Model",
    items: [
      "sigma_n^2 = gamma*V_L + alpha*u_{n-1}^2 + beta*sigma_{n-1}^2",
      "Explicit mean-reversion toward long-run variance V_L",
      "Produces upward or downward sloping volatility term structures"
    ]
  };
  rawHindi.scenes[6].title = "EWMA Decay vs GARCH(1,1) Mean-Reversion Architecture";
  rawHindi.scenes[6].beats[0].ui_state.left = leftEWMA;
  rawHindi.scenes[6].beats[0].ui_state.right = rightGARCH;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftEWMA;
    rawHindi.scenes[6].beats[0].visual.data.right = rightGARCH;
  }
  rawHindi.scenes[6].beats[0].text = "ईडब्ल्यूएमए में कोई लॉन्ग-रन मीन रिवर्जन नहीं होता, जबकि गार्च मॉडल वोलैटिलिटी को लॉन्ग-टर्म एवरेज की तरफ वापस खींचता है।";
  rawHindi.scenes[6].beats[0].hindi_tts = "ईडब्ल्यूएमए में कोई लॉन्ग-रन मीन रिवर्जन नहीं होता, जबकि गार्च मॉडल वोलैटिलिटी को लॉन्ग-टर्म एवरेज की तरफ वापस खींचता है।";

  rawEn.scenes[6].title = "EWMA Decay vs GARCH(1,1) Mean-Reversion Architecture";
  rawEn.scenes[6].beats[0].ui_state.left = leftEWMA;
  rawEn.scenes[6].beats[0].ui_state.right = rightGARCH;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftEWMA;
    rawEn.scenes[6].beats[0].visual.data.right = rightGARCH;
  }
  rawEn.scenes[6].beats[0].text = "While EWMA models lack long-term mean reversion, GARCH(1,1) explicitly anchors forecasts to the long-run average variance.";
  rawEn.scenes[6].beats[0].dialogue = "While EWMA models lack long-term mean reversion, GARCH(1,1) explicitly anchors forecasts to the long-run average variance.";

  // Scene 7: Progressive Cards - GARCH Term Structure
  const garchCards = [
    { title: "Current Vol > Long-Run Vol", body: "Term structure is downward sloping; future expected volatility drops toward V_L." },
    { title: "Current Vol < Long-Run Vol", body: "Term structure is upward sloping; future expected volatility rises toward V_L." },
    { title: "Reversion Speed 1 - alpha - beta", body: "Governs how rapidly volatility shocks dissipate across forward horizons." }
  ];
  rawHindi.scenes[7].title = "GARCH(1,1) Volatility Forecasting & Term Structure";
  rawHindi.scenes[7].beats[0].ui_state.cards = garchCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = garchCards;
  rawHindi.scenes[7].beats[0].text = "गार्च मॉडल में अगर करेंट वोलैटिलिटी औसत से ज्यादा है तो टर्म स्ट्रक्चर डाउनवर्ड-स्लोपिंग होता है, और कम होने पर अपवर्ड-स्लोपिंग होता है।";
  rawHindi.scenes[7].beats[0].hindi_tts = "गार्च मॉडल में अगर करेंट वोलैटिलिटी औसत से ज्यादा है तो टर्म स्ट्रक्चर डाउनवर्ड-स्लोपिंग होता है, और कम होने पर अपवर्ड-स्लोपिंग होता है।";

  rawEn.scenes[7].title = "GARCH(1,1) Volatility Forecasting & Term Structure";
  rawEn.scenes[7].beats[0].ui_state.cards = garchCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = garchCards;
  rawEn.scenes[7].beats[0].text = "Under GARCH(1,1), elevated current volatility creates a downward-sloping term structure, while subdued volatility produces an upward curve.";
  rawEn.scenes[7].beats[0].dialogue = "Under GARCH(1,1), elevated current volatility creates a downward-sloping term structure, while subdued volatility produces an upward curve.";

  // Scene 8: Formula Breakdown - EWMA Formula
  rawHindi.scenes[8].title = "EWMA Recursive Variance Updating (RiskMetrics lambda=0.94)";
  rawHindi.scenes[8].beats[0].text = "रिस्कमेट्रिक्स ईडब्ल्यूएमए फॉर्मूला लैम्ब्डा 0.94 के साथ पुराने वोलैटिलिटी डेटा को एक्सपोनेंशियल वेट देता है।";
  rawHindi.scenes[8].beats[0].hindi_tts = "रिस्कमेट्रिक्स ईडब्ल्यूएमए फॉर्मूला लैम्ब्डा 0.94 के साथ पुराने वोलैटिलिटी डेटा को एक्सपोनेंशियल वेट देता है।";

  rawEn.scenes[8].title = "EWMA Recursive Variance Updating (RiskMetrics lambda=0.94)";
  rawEn.scenes[8].beats[0].text = "The RiskMetrics EWMA formula recursively updates variance using decay factor lambda 0.94, placing exponentially declining weights on past days.";
  rawEn.scenes[8].beats[0].dialogue = "The RiskMetrics EWMA formula recursively updates variance using decay factor lambda 0.94, placing exponentially declining weights on past days.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "Why does the linear delta-normal VaR model severely underestimate risk when applied to option portfolios with large positive or negative gamma?";
  const quizOpts = [
    "A: Linear delta models ignore non-linear curvature, failing to capture extreme payoffs during large price jumps",
    "B: Option trading is prohibited under Basel regulations unless variance-covariance models are used",
    "C: Delta values can only be computed for forward contracts and are mathematically undefined for options",
    "D: The linear model assumes zero interest rates which invalidates option dividend adjustments"
  ];
  const quizAns = "A: Linear delta models ignore non-linear curvature, failing to capture extreme payoffs during large price jumps";

  // Hindi Scene 9
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].beats[0].text = "सोचिए कि लीनियर डेल्टा-नॉर्मल वार मॉडल ऐसे ऑप्शन पोर्टफोलियो में भारी नुकसान को कम क्यों आंकता है जहां गामा बहुत ज्यादा हो?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि लीनियर डेल्टा-नॉर्मल वार मॉडल ऐसे ऑप्शन पोर्टफोलियो में भारी नुकसान को कम क्यों आंकता है जहां गामा बहुत ज्यादा हो?";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या ऑप्शन प्राइसिंग में सेकंड डेरिवेटिव कर्वेचर को नजरअंदाज करना खतरनाक हो सकता है।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या ऑप्शन प्राइसिंग में सेकंड डेरिवेटिव कर्वेचर को नजरअंदाज करना खतरनाक हो सकता है।";
  rawHindi.scenes[9].beats[1].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[1].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawHindi.scenes[9].beats[1].visual?.data) {
    rawHindi.scenes[9].beats[1].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। लीनियर मॉडल सिर्फ पहली ढलान को देखता है, इसलिए बड़े मार्केट जंप में डेल्टा-गामा मॉडल जरूरी होता है।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। लीनियर मॉडल सिर्फ पहली ढलान को देखता है, इसलिए बड़े मार्केट जंप में डेल्टा-गामा मॉडल जरूरी होता है।";
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
  rawEn.scenes[9].beats[0].text = "Why does the linear delta-normal VaR model severely underestimate risk when applied to option portfolios with large positive or negative gamma?";
  rawEn.scenes[9].beats[0].dialogue = "Why does the linear delta-normal VaR model severely underestimate risk when applied to option portfolios with large positive or negative gamma?";
  rawEn.scenes[9].beats[0].ui_state.question = quizQ;
  rawEn.scenes[9].beats[0].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQ;
    rawEn.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[1].text = "Pause and consider how option curvature causes actual portfolio value changes to diverge sharply from linear tangent approximations.";
  rawEn.scenes[9].beats[1].dialogue = "Pause and consider how option curvature causes actual portfolio value changes to diverge sharply from linear tangent approximations.";
  rawEn.scenes[9].beats[1].ui_state.question = quizQ;
  rawEn.scenes[9].beats[1].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawEn.scenes[9].beats[1].visual?.data) {
    rawEn.scenes[9].beats[1].visual.data.question = quizQ;
    rawEn.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[2].text = "Correct answer is A: Linear models omit second-order curvature, failing to anticipate non-linear payoff accelerations during market shocks.";
  rawEn.scenes[9].beats[2].dialogue = "Correct answer is A: Linear models omit second-order curvature, failing to anticipate non-linear payoff accelerations during market shocks.";
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
  rawHindi.scenes[10].beats[0].text = "Sharma ji, trading desk par VaR model ko validate karne ke liye backtesting kaise ki jaati hai?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, ट्रेडिंग डेस्क पर वार मॉडल को वैलिडेट करने के लिए बैकटेस्टिंग कैसे की जाती है?";
  rawHindi.scenes[10].beats[1].text = "Raju, hum pichhle 250 dino ke exceptions count karte hain aur Kupiec test se check karte hain ki model fail toh nahi ho raha!";
  rawHindi.scenes[10].beats[1].hindi_tts = "राजू, हम पिछले 250 दिनों के एक्सेप्शन्स गिनते हैं और क्यूपिक टेस्ट से चेक करते हैं कि मॉडल फेल तो नहीं हो रहा!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, how do quantitative risk desks statistically backtest their daily internal VaR models?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, how do quantitative risk desks statistically backtest their daily internal VaR models?";
  rawEn.scenes[10].beats[1].text = "Raju, desks track daily exceptions across a 250-day window, applying Kupiec's POF test to detect model failure.";
  rawEn.scenes[10].beats[1].dialogue = "Raju, desks track daily exceptions across a 250-day window, applying Kupiec's POF test to detect model failure.";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Model-Building VaR aur Volatility Updating ke aath mukhya siddhanton ko dohraayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए मॉडल-बिल्डिंग वार और वोलैटिलिटी अपडेटिंग के आठ मुख्य सिद्धांतों को दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: Model-building multivariate normal distribution assume karta hai aur correlation se diversification benefit milta hai.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: मॉडल-बिल्डिंग मल्टीवैरिएट नॉर्मल डिस्ट्रीब्यूशन मानती है और कोरिलेशन से डाइवर्सिफिकेशन बेनिफिट मिलता है।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: Linear delta model options me fail hota hai, isliye quadratic delta-gamma Taylor expansion zaroori hai.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: लीनियर डेल्टा मॉडल ऑप्शंस में फेल होता है, इसलिए क्वाड्रेटिक डेल्टा-गामा टेलर एक्सपेंशन जरूरी है।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: RiskMetrics EWMA lambda 0.94 ke saath variance update karta hai jabki GARCH mean-reversion capture karta hai.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: रिस्कमेट्रिक्स ईडब्ल्यूएमए लैम्ब्डा 0.94 के साथ वैरियेंस अपडेट करता है जबकि गार्च मीन-रिवर्जन पकड़ता है।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: Kupiec backtesting exceptions verify karti hai aur crisis me correlations 1.0 ke kareeb pahunch jati hain.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: क्यूपिक बैकटेस्टिंग एक्सेप्शन्स वेरीफाई करती है और क्राइसिस में कोरिलेशन 1.0 के करीब पहुंच जाती हैं।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam quantitative risk modeling ke sarvashrestha siddhant hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम क्वांटिटेटिव रिस्क मॉडलिंग के सर्वश्रेष्ठ सिद्धांत हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of model-building VaR and volatility updating.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of model-building VaR and volatility updating.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: The model-building approach assumes multivariate normality, where correlation unlocks portfolio diversification.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: The model-building approach assumes multivariate normality, where correlation unlocks portfolio diversification.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: Linear delta approximations break down for options, requiring quadratic delta-gamma Taylor expansions.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: Linear delta approximations break down for options, requiring quadratic delta-gamma Taylor expansions.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: EWMA updates daily variance via exponential decay, while GARCH(1,1) incorporates long-term mean reversion.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: EWMA updates daily variance via exponential decay, while GARCH(1,1) incorporates long-term mean reversion.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: Rigorous backtesting with Kupiec POF tests ensures integrity, while stress tests guard against correlation breakdown.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: Rigorous backtesting with Kupiec POF tests ensures integrity, while stress tests guard against correlation breakdown.";
  rawEn.scenes[11].beats[5].text = "These eight rules constitute the standard quantitative framework for market risk management.";
  rawEn.scenes[11].beats[5].dialogue = "These eight rules constitute the standard quantitative framework for market risk management.";

  // Save raw episodes
  const outHindi = path.join(hindiDir, "episode_raw.json");
  const outEnglish = path.join(englishDir, "episode_raw.json");
  fs.writeFileSync(outHindi, JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(outEnglish, JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English ch20_part2!");

  // Validate
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");
}

main().catch(console.error);
