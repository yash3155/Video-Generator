import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch23_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch23_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Credit Derivatives & CDS",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Credit Derivatives & CDS",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: Unbundling Corporate Credit Risk";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, Credit Default Swap loan se alag hokar credit risk ko kaise trade karta hai?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, क्रेडिट डिफॉल्ट स्वैप लोन से अलग होकर क्रेडिट रिस्क को कैसे ट्रेड करता है?";
  rawHindi.scenes[0].beats[1].text = "Raju, CDS ek insurance policy ki tarah hai: borrower default kare toh seller bache hue loss ki bharpai karta hai!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, सीडीएस एक इंश्योरेंस पॉलिसी की तरह है: बॉरोअर डिफॉल्ट करे तो सेलर बचे हुए लॉस की भरपाई करता है!";

  rawEn.scenes[0].title = "Origins: Unbundling Corporate Credit Risk";
  rawEn.scenes[0].beats[0].text = "Sharma ji, how do Credit Default Swaps allow banks to unbundle default risk from underlying lending?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, how do Credit Default Swaps allow banks to unbundle default risk from underlying lending?";
  rawEn.scenes[0].beats[1].text = "Raju, CDS acts as pure default insurance: the protection seller covers terminal par losses upon an ISDA credit event.";
  rawEn.scenes[0].beats[1].dialogue = "Raju, CDS acts as pure default insurance: the protection seller covers terminal par losses upon an ISDA credit event.";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Physical Delivery vs Cash Auction CDS Settlement";
  rawHindi.scenes[1].beats[0].text = "Physical settlement me defaulted bond deliver hota hai, jabki cash settlement me ISDA auction se recovery price tay hota hai.";
  rawHindi.scenes[1].beats[0].hindi_tts = "फिजिकल सेटलमेंट में डिफॉल्टेड बॉन्ड डिलीवर होता है, जबकि कैश सेटलमेंट में इसडा ऑक्शन से रिकवरी प्राइस तय होता है।";

  rawEn.scenes[1].title = "Physical Delivery vs Cash Auction CDS Settlement";
  rawEn.scenes[1].beats[0].text = "While physical settlement exchanges defaulted bonds for par, cash settlement relies on ISDA industry auctions to establish recovery values.";
  rawEn.scenes[1].beats[0].dialogue = "While physical settlement exchanges defaulted bonds for par, cash settlement relies on ISDA industry auctions to establish recovery values.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. CDS Mechanics", body: "Periodic spread payments in exchange for contingent protection against ISDA credit events." },
    { title: "2. Hazard Rates", body: "Extracting annual default intensity lambda from bond yield spreads via s / (1 - R)." },
    { title: "3. Total Return Swaps", body: "Exchanging complete asset economic returns for floating financing rates off-balance sheet." },
    { title: "4. Synthetic CDOs", body: "Tranching portfolio default risk into hierarchical equity, mezzanine, and senior tranches." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Credit Derivatives";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: CDS mechanics, hazard rates, Total Return Swaps, aur synthetic CDOs.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: सीडीएस मैकेनिक्स, हैजार्ड रेट्स, टोटल रिटर्न स्वैप्स, और सिंथेटिक सीडीओ।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Credit Derivatives";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: CDS architecture, hazard rate estimation, Total Return Swaps, and synthetic CDO tranches.";
  rawEn.scenes[2].beats[0].dialogue = "We explore four foundational pillars: CDS architecture, hazard rate estimation, Total Return Swaps, and synthetic CDO tranches.";

  // Scene 3: Comparison - CDS vs TRS
  const leftCDS = {
    title: "Credit Default Swap (CDS)",
    items: [
      "Transfers only pure default credit risk",
      "Payoff contingent solely upon ISDA credit event",
      "No exchange of asset price changes prior to default"
    ]
  };
  const rightTRS = {
    title: "Total Return Swap (TRS)",
    items: [
      "Transfers complete economic return (interest + capital gain/loss)",
      "Receiver gains full synthetic exposure without owning the bond",
      "Payer completely removes market and credit risk off balance sheet"
    ]
  };
  rawHindi.scenes[3].title = "Credit Default Swaps vs Total Return Swaps (TRS)";
  rawHindi.scenes[3].beats[0].ui_state.left = leftCDS;
  rawHindi.scenes[3].beats[0].ui_state.right = rightTRS;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftCDS;
    rawHindi.scenes[3].beats[0].visual.data.right = rightTRS;
  }
  rawHindi.scenes[3].beats[0].text = "सीडीएस सिर्फ डिफॉल्ट के नुकसान से बचाता है, जबकि टोटल रिटर्न स्वैप बॉन्ड के ब्याज और मार्केट प्राइस दोनों के उतार-चढ़ाव को ट्रांसफर करता है।";
  rawHindi.scenes[3].beats[0].hindi_tts = "सीडीएस सिर्फ डिफॉल्ट के नुकसान से बचाता है, जबकि टोटल रिटर्न स्वैप बॉन्ड के ब्याज और मार्केट प्राइस दोनों के उतार-चढ़ाव को ट्रांसफर करता है।";

  rawEn.scenes[3].title = "Credit Default Swaps vs Total Return Swaps (TRS)";
  rawEn.scenes[3].beats[0].ui_state.left = leftCDS;
  rawEn.scenes[3].beats[0].ui_state.right = rightTRS;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftCDS;
    rawEn.scenes[3].beats[0].visual.data.right = rightTRS;
  }
  rawEn.scenes[3].beats[0].text = "A CDS isolates pure default events, whereas a Total Return Swap transfers full price movements and cash flows off-balance-sheet.";
  rawEn.scenes[3].beats[0].dialogue = "A CDS isolates pure default events, whereas a Total Return Swap transfers full price movements and cash flows off-balance-sheet.";

  // Scene 4: Formula Breakdown - Hazard Rate
  rawHindi.scenes[4].title = "Hazard Rate Extraction from Corporate Bond Yield Spreads";
  rawHindi.scenes[4].beats[0].text = "बॉन्ड यील्ड स्प्रेड एस को एक माइनस रिकवरी रेट से भाग देने पर एनुअल हैजार्ड रेट लैम्ब्डा निकल आता है।";
  rawHindi.scenes[4].beats[0].hindi_tts = "बॉन्ड यील्ड स्प्रेड एस को एक माइनस रिकवरी रेट से भाग देने पर एनुअल हैजार्ड रेट लैम्ब्डा निकल आता है।";

  rawEn.scenes[4].title = "Hazard Rate Extraction from Corporate Bond Yield Spreads";
  rawEn.scenes[4].beats[0].text = "Dividing the corporate credit spread s by one minus the expected recovery rate R yields the annual hazard rate lambda.";
  rawEn.scenes[4].beats[0].dialogue = "Dividing the corporate credit spread s by one minus the expected recovery rate R yields the annual hazard rate lambda.";

  // Scene 5: Case Study - 2008 Gaussian Copula
  rawHindi.scenes[5].title = "The 2007-2008 Subprime Collapse: The Gaussian Copula Blindspot";
  rawHindi.scenes[5].beats[0].text = "2008 के वित्तीय संकट में डेविड ली के गॉसियन कॉप्युला मॉडल ने डिफॉल्ट कोरिलेशन को कम आंका, जिससे ट्रिपल-ए सिंथेटिक सीडीओ ट्रैंच बर्बाद हो गईं।";
  rawHindi.scenes[5].beats[0].hindi_tts = "2008 के वित्तीय संकट में डेविड ली के गॉसियन कॉप्युला मॉडल ने डिफॉल्ट कोरिलेशन को कम आंका, जिससे ट्रिपल-ए सिंथेटिक सीडीओ ट्रैंच बर्बाद हो गईं।";

  rawEn.scenes[5].title = "The 2007-2008 Subprime Collapse: The Gaussian Copula Blindspot";
  rawEn.scenes[5].beats[0].text = "During the 2007-2008 crash, David Li's Gaussian copula failed to capture systemic tail correlation, triggering catastrophic subprime CDO losses.";
  rawEn.scenes[5].beats[0].dialogue = "During the 2007-2008 crash, David Li's Gaussian copula failed to capture systemic tail correlation, triggering catastrophic subprime CDO losses.";

  // Scene 6: Split Comparison - Single-Name vs CDX
  const leftSingle = {
    title: "Single-Name CDS",
    items: [
      "Customized protection on one corporate or sovereign issuer",
      "Less liquid, larger bid-ask spreads",
      "Idiosyncratic firm-specific credit risk"
    ]
  };
  const rightIndex = {
    title: "Credit Indices (CDX / iTraxx)",
    items: [
      "Standardized basket of 125 liquid reference entities",
      "Massive market liquidity with tight standardized spreads",
      "Systemic macro corporate credit exposure"
    ]
  };
  rawHindi.scenes[6].title = "Single-Name CDS vs Standardized Credit Indices (CDX / iTraxx)";
  rawHindi.scenes[6].beats[0].ui_state.left = leftSingle;
  rawHindi.scenes[6].beats[0].ui_state.right = rightIndex;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftSingle;
    rawHindi.scenes[6].beats[0].visual.data.right = rightIndex;
  }
  rawHindi.scenes[6].beats[0].text = "सिंगल-नेम सीडीएस एक कंपनी का रिस्क कवर करता है, जबकि सीडीएक्स और आईट्रैक्स इंडेक्स 125 कंपनियों के बास्केट में लिक्विड ट्रेडिंग देते हैं।";
  rawHindi.scenes[6].beats[0].hindi_tts = "सिंगल-नेम सीडीएस एक कंपनी का रिस्क कवर करता है, जबकि सीडीएक्स और आईट्रैक्स इंडेक्स 125 कंपनियों के बास्केट में लिक्विड ट्रेडिंग देते हैं।";

  rawEn.scenes[6].title = "Single-Name CDS vs Standardized Credit Indices (CDX / iTraxx)";
  rawEn.scenes[6].beats[0].ui_state.left = leftSingle;
  rawEn.scenes[6].beats[0].ui_state.right = rightIndex;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftSingle;
    rawEn.scenes[6].beats[0].visual.data.right = rightIndex;
  }
  rawEn.scenes[6].beats[0].text = "While single-name CDS targets idiosyncratic firm risk, standardized CDX and iTraxx indices provide liquid macro credit hedging.";
  rawEn.scenes[6].beats[0].dialogue = "While single-name CDS targets idiosyncratic firm risk, standardized CDX and iTraxx indices provide liquid macro credit hedging.";

  // Scene 7: Progressive Cards - Hull Section 23.3
  const cdsCards = [
    { title: "5-Year Spread: 120 bps", body: "Senior corporate debt trading at 1.20% spread over risk-free benchmark." },
    { title: "Hazard Rate: 2.0% / year", body: "lambda = 0.0120 / (1 - 0.40) assumes standardized 40% senior recovery." },
    { title: "5-Year Cumulative Default: 9.52%", body: "Probability 1 - e^(-0.02 * 5) requires $120,000 annual premium on $10M notional." }
  ];
  rawHindi.scenes[7].title = "Hull Section 23.3: 5-Year CDS Spread & Default Probability";
  rawHindi.scenes[7].beats[0].ui_state.cards = cdsCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = cdsCards;
  rawHindi.scenes[7].beats[0].text = "हल के सेक्शन 23.3 में 120 बीपीएस स्प्रेड और 40 परसेंट रिकवरी के साथ 5 साल की क्युमुलेटिव डिफॉल्ट प्रोबेबिलिटी 9.52 परसेंट निकलती है।";
  rawHindi.scenes[7].beats[0].hindi_tts = "हल के सेक्शन 23.3 में 120 बीपीएस स्प्रेड और 40 परसेंट रिकवरी के साथ 5 साल की क्युमुलेटिव डिफॉल्ट प्रोबेबिलिटी 9.52 परसेंट निकलती है।";

  rawEn.scenes[7].title = "Hull Section 23.3: 5-Year CDS Spread & Default Probability";
  rawEn.scenes[7].beats[0].ui_state.cards = cdsCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = cdsCards;
  rawEn.scenes[7].beats[0].text = "In Hull Section 23.3, a 120 bps spread with 40% recovery implies a 2.0% hazard rate and a 9.52% cumulative 5-year default probability.";
  rawEn.scenes[7].beats[0].dialogue = "In Hull Section 23.3, a 120 bps spread with 40% recovery implies a 2.0% hazard rate and a 9.52% cumulative 5-year default probability.";

  // Scene 8: Formula Breakdown - CDS Spread Equilibrium
  rawHindi.scenes[8].title = "CDS Fair Spread Equilibrium (Premium Leg vs Protection Leg)";
  rawHindi.scenes[8].beats[0].text = "सीडीएस का फेयर स्प्रेड तब तय होता है जब प्रीमियम पेमेंट लेग की प्रेजेंट वैल्यू प्रोटेक्शन पेऑफ लेग की प्रेजेंट वैल्यू के बराबर हो जाती है।";
  rawHindi.scenes[8].beats[0].hindi_tts = "सीडीएस का फेयर स्प्रेड तब तय होता है जब प्रीमियम पेमेंट लेग की प्रेजेंट वैल्यू प्रोटेक्शन पेऑफ लेग की प्रेजेंट वैल्यू के बराबर हो जाती है।";

  rawEn.scenes[8].title = "CDS Fair Spread Equilibrium (Premium Leg vs Protection Leg)";
  rawEn.scenes[8].beats[0].text = "The equilibrium CDS spread balances the expected discounted cash flows of the quarterly premium leg against the contingent default protection leg.";
  rawEn.scenes[8].beats[0].dialogue = "The equilibrium CDS spread balances the expected discounted cash flows of the quarterly premium leg against the contingent default protection leg.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "If a corporate bond's credit spread widens while its expected recovery rate increases from 30% to 50%, what is the net effect on its implied hazard rate?";
  const quizOpts = [
    "A: The hazard rate depends directly on the ratio of spread to loss-given-default, adjusting upward or downward based on parameter changes",
    "B: Credit default swaps ignore recovery rates because clearinghouses always guarantee par reimbursement",
    "C: Higher recovery rates mathematically force the hazard rate to zero regardless of market bond yields",
    "D: Corporate hazard rates are legally fixed by rating agencies and cannot adjust to market prices"
  ];
  const quizAns = "A: The hazard rate depends directly on the ratio of spread to loss-given-default, adjusting upward or downward based on parameter changes";

  // Hindi Scene 9
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].beats[0].text = "सोचिए कि यदि किसी कॉरपोरेट बॉन्ड का यील्ड स्प्रेड बढ़ जाए लेकिन रिकवरी रेट भी 30 परसेंट से बढ़कर 50 परसेंट हो जाए, तो हैजार्ड रेट पर क्या असर पड़ेगा?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि यदि किसी कॉरपोरेट बॉन्ड का यील्ड स्प्रेड बढ़ जाए लेकिन रिकवरी रेट भी 30 परसेंट से बढ़कर 50 परसेंट हो जाए, तो हैजार्ड रेट पर क्या असर पड़ेगा?";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या हैजार्ड रेट स्प्रेड और लॉस-गिवेन-डिफॉल्ट के अनुपात पर निर्भर करता है।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या हैजार्ड रेट स्प्रेड और लॉस-गिवेन-डिफॉल्ट के अनुपात पर निर्भर करता है।";
  rawHindi.scenes[9].beats[1].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[1].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawHindi.scenes[9].beats[1].visual?.data) {
    rawHindi.scenes[9].beats[1].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। हैजार्ड रेट सीधे स्प्रेड और एक माइनस रिकवरी रेट के अनुपात पर आधारित होता है।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। हैजार्ड रेट सीधे स्प्रेड और एक माइनस रिकवरी रेट के अनुपात पर आधारित होता है।";
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
  rawEn.scenes[9].beats[0].text = "If a corporate bond's credit spread widens while its expected recovery rate increases from 30% to 50%, what is the net effect on its implied hazard rate?";
  rawEn.scenes[9].beats[0].dialogue = "If a corporate bond's credit spread widens while its expected recovery rate increases from 30% to 50%, what is the net effect on its implied hazard rate?";
  rawEn.scenes[9].beats[0].ui_state.question = quizQ;
  rawEn.scenes[9].beats[0].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQ;
    rawEn.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[1].text = "Pause and consider how hazard intensity lambda scales directly with spread s divided by loss-given-default (1 - R).";
  rawEn.scenes[9].beats[1].dialogue = "Pause and consider how hazard intensity lambda scales directly with spread s divided by loss-given-default (1 - R).";
  rawEn.scenes[9].beats[1].ui_state.question = quizQ;
  rawEn.scenes[9].beats[1].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawEn.scenes[9].beats[1].visual?.data) {
    rawEn.scenes[9].beats[1].visual.data.question = quizQ;
    rawEn.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[2].text = "Correct answer is A: The hazard rate is determined by s / (1 - R), reflecting the exact mathematical interaction between yield spread and loss severity.";
  rawEn.scenes[9].beats[2].dialogue = "Correct answer is A: The hazard rate is determined by s / (1 - R), reflecting the exact mathematical interaction between yield spread and loss severity.";
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
  rawHindi.scenes[10].beats[0].text = "Sharma ji, 2008 ke baad naked CDS par ban kyu lagaya gaya aur central clearing kyu mandatory hui?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, 2008 के बाद नेकेड सीडीएस पर बैन क्यों लगाया गया और सेंट्रल क्लियरिंग क्यों जरूरी हुई?";
  rawHindi.scenes[10].beats[1].text = "Raju, speculative naked CDS se market panic badhta tha, isliye Dodd-Frank aur EMIR ne central clearinghouses compulsory kar diye!";
  rawHindi.scenes[10].beats[1].hindi_tts = "राजू, स्पेक्युलेटिव नेकेड सीडीएस से मार्केट पैनिक बढ़ता था, इसलिए डॉड-फ्रैंक और एमिर ने सेंट्रल क्लियरिंगहाउसेस जरूरी कर दिए!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, why did post-crisis regulations restrict naked CDS and mandate central clearinghouses for credit derivatives?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, why did post-crisis regulations restrict naked CDS and mandate central clearinghouses for credit derivatives?";
  rawEn.scenes[10].beats[1].text = "Raju, speculative naked buying accelerated sovereign panic, leading regulators to mandate CCP central clearing and collateralization.";
  rawEn.scenes[10].beats[1].dialogue = "Raju, speculative naked buying accelerated sovereign panic, leading regulators to mandate CCP central clearing and collateralization.";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Credit Derivatives aur CDS ke aath mukhya siddhanton ko dohraayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए क्रेडिट डेरिवेटिव्स और सीडीएस के आठ मुख्य सिद्धांतों को दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: CDS default risk ko loan se alag karta hai aur ISDA credit events payoff trigger karte hain.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: सीडीएस डिफॉल्ट रिस्क को लोन से अलग करता है और इसडा क्रेडिट इवेंट्स पेऑफ ट्रिगर करते हैं।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: Cash auction recovery tay karta hai aur hazard rate lambda = s / (1 - R) hota hai.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: कैश ऑक्शन रिकवरी तय करता है और हैजार्ड रेट लैम्ब्डा = स्प्रेड / (1 - आर) होता है।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: Total Return Swap complete economic return transfer karta hai aur CDX macro benchmark hai.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: टोटल रिटर्न स्वैप पूरा इकोनॉमिक रिटर्न ट्रांसफर करता है और सीडीएक्स मैक्रो बेंचमार्क है।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: Synthetic CDO me correlation risk critical hai aur central clearing counterparty risk rokti hai.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: सिंथेटिक सीडीओ में कोरिलेशन रिस्क बहुत क्रिटिकल है और सेंट्रल क्लियरिंग काउंटरपार्टी रिस्क रोकती है।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam corporate credit risk aur global debt markets ke aadharstambh hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम कॉरपोरेट क्रेडिट रिस्क और ग्लोबल डेट मार्केट्स के आधारस्तंभ हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of credit derivatives and CDS.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of credit derivatives and CDS.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: CDS contracts unbundle credit risk from loans, triggered strictly by ISDA credit events.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: CDS contracts unbundle credit risk from loans, triggered strictly by ISDA credit events.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: Industry auctions establish cash recovery, and hazard rates scale as spread divided by (1 - R).";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: Industry auctions establish cash recovery, and hazard rates scale as spread divided by (1 - R).";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Total Return Swaps transfer full asset economics, while CDX/iTraxx provide liquid macro hedging.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Total Return Swaps transfer full asset economics, while CDX/iTraxx provide liquid macro hedging.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: Synthetic CDO tranche pricing demands rigorous correlation models, backed by mandatory CCP clearing.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: Synthetic CDO tranche pricing demands rigorous correlation models, backed by mandatory CCP clearing.";
  rawEn.scenes[11].beats[5].text = "These eight rules form the bedrock of institutional credit risk management.";
  rawEn.scenes[11].beats[5].dialogue = "These eight rules form the bedrock of institutional credit risk management.";

  // Save raw episodes
  const outHindi = path.join(hindiDir, "episode_raw.json");
  const outEnglish = path.join(englishDir, "episode_raw.json");
  fs.writeFileSync(outHindi, JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(outEnglish, JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English ch23_part1!");

  // Validate
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");
}

main().catch(console.error);
