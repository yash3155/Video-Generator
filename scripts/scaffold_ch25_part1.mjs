import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch25_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch25_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Derivatives Mishaps: Lessons for All Users",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Derivatives Mishaps: Lessons for All Users",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: The Rogue Trader Phenomenon";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, bade bade pratishthit bank derivatives me arbon dollar ka nuksan karke diwaliya kyu ho jate hain?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, बड़े बड़े प्रतिष्ठित बैंक डेरिवेटिव्स में अरबों डॉलर का नुकसान करके दिवालिया क्यों हो जाते हैं?";
  rawHindi.scenes[0].beats[1].text = "Raju, adhikatam disasters market risk se nahi, balki internal controls aur front-back office separation ke fail hone se hote hain!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, अधिकतम डिज़ास्टर्स मार्केट रिस्क से नहीं, बल्कि इंटरनल कंट्रोल्स और फ्रंट-बैक ऑफिस सेपरेशन के फेल होने से होते हैं!";

  rawEn.scenes[0].title = "Origins: The Rogue Trader Phenomenon";
  rawEn.scenes[0].beats[0].text = "Sharma ji, why do prestigious global financial institutions collapse from catastrophic multi-billion-dollar derivatives losses?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, why do prestigious global financial institutions collapse from catastrophic multi-billion-dollar derivatives losses?";
  rawEn.scenes[0].beats[1].text = "Raju, massive derivatives catastrophes almost never stem from market bad luck, but from operational control failures and rogue trading.";
  rawEn.scenes[0].beats[1].dialogue = "Raju, massive derivatives catastrophes almost never stem from market bad luck, but from operational control failures and rogue trading.";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Independent Back-Office Verification vs Trader Self-Marking";
  rawHindi.scenes[1].beats[0].text = "Back-office ko swatantra broker quotes se daily mark-to-market karna chahiye, traders ko kabhi khud positions value nahi karne dena chahiye.";
  rawHindi.scenes[1].beats[0].hindi_tts = "बैक-ऑफिस को स्वतंत्र ब्रोकर कोट्स से डेली मार्क-टू-मार्केट करना चाहिए, ट्रेडर्स को कभी खुद पोजीशन्स वैल्यू नहीं करने देना चाहिए।";

  rawEn.scenes[1].title = "Independent Back-Office Verification vs Trader Self-Marking";
  rawEn.scenes[1].beats[0].text = "Independent middle and back offices must verify positions with external quotes; allowing traders to self-mark creates fatal moral hazard.";
  rawEn.scenes[1].beats[0].dialogue = "Independent middle and back offices must verify positions with external quotes; allowing traders to self-mark creates fatal moral hazard.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Segregation of Duties", body: "Strict firewall separating trading execution from trade confirmation and settlement." },
    { title: "2. Independent MTM", body: "Mandatory daily mark-to-market using third-party quotes; zero discretionary reserves." },
    { title: "3. Outperformance Fallacy", body: "Abnormal long-term returns signal hidden catastrophic short option tail exposure." },
    { title: "4. Multi-Factor Stress Testing", body: "Simulating extreme liquidity freezes, basis blowouts, and margin spikes beyond VaR." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Risk Governance";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya niyam sikhenge: segregation of duties, independent mark-to-market, outperformance fallacy, aur stress testing.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य नियम सीखेंगे: सेग्रिगेशन ऑफ ड्यूटीज, इंडिपेंडेंट मार्क-टू-मार्केट, आउटपरफॉर्मेंस फैलेसी, और स्ट्रेस टेस्टिंग।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Risk Governance";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We establish four non-negotiable pillars: strict segregation of duties, independent MTM, the outperformance fallacy, and stress testing.";
  rawEn.scenes[2].beats[0].dialogue = "We establish four non-negotiable pillars: strict segregation of duties, independent MTM, the outperformance fallacy, and stress testing.";

  // Scene 3: Comparison - Model Flaws vs Operational Failure
  const leftModel = {
    title: "Quantitative Model Risk",
    items: [
      "Flawed distribution assumptions (Gaussian copula correlation error)",
      "Underestimating volatility smile dynamics and fat-tail kurtosis",
      "Responsible for ~10% of systemic market crisis losses"
    ]
  };
  const rightOp = {
    title: "Operational Control Failure",
    items: [
      "Rogue trading and lack of dual controls (front-back office overlap)",
      "Fictitious trade offsetting and unhedged directional gambling",
      "Responsible for over 90% of individual financial institution bankruptcies"
    ]
  };
  rawHindi.scenes[3].title = "Model Formulation Errors vs Operational Control Failure";
  rawHindi.scenes[3].beats[0].ui_state.left = leftModel;
  rawHindi.scenes[3].beats[0].ui_state.right = rightOp;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftModel;
    rawHindi.scenes[3].beats[0].visual.data.right = rightOp;
  }
  rawHindi.scenes[3].beats[0].text = "संस्थान मॉडल की गणितीय गलतियों से कम, बल्कि इंटरनल कंट्रोल्स और डुअल ऑथराइजेशन के अभाव से 90 परसेंट ज्यादा बर्बाद होते हैं।";
  rawHindi.scenes[3].beats[0].hindi_tts = "संस्थान मॉडल की गणितीय गलतियों से कम, बल्कि इंटरनल कंट्रोल्स और डुअल ऑथराइजेशन के अभाव से 90 परसेंट ज्यादा बर्बाद होते हैं।";

  rawEn.scenes[3].title = "Model Formulation Errors vs Operational Control Failure";
  rawEn.scenes[3].beats[0].ui_state.left = leftModel;
  rawEn.scenes[3].beats[0].ui_state.right = rightOp;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftModel;
    rawEn.scenes[3].beats[0].visual.data.right = rightOp;
  }
  rawEn.scenes[3].beats[0].text = "While mathematical model flaws occur, over 90% of monumental derivatives bankruptcies stem directly from operational control failures.";
  rawEn.scenes[3].beats[0].dialogue = "While mathematical model flaws occur, over 90% of monumental derivatives bankruptcies stem directly from operational control failures.";

  // Scene 4: Formula Breakdown - Leverage Multiplier
  rawHindi.scenes[4].title = "Leverage Multipliers & Sudden Capital Wipeouts";
  rawHindi.scenes[4].beats[0].text = "उच्च लेवरेज में एसेट वैल्यू में केवल कुछ परसेंट की मामूली गिरावट भी पूरे इक्विटी कैपिटल को शून्य कर देती है।";
  rawHindi.scenes[4].beats[0].hindi_tts = "उच्च लेवरेज में एसेट वैल्यू में केवल कुछ परसेंट की मामूली गिरावट भी पूरे इक्विटी कैपिटल को शून्य कर देती है।";

  rawEn.scenes[4].title = "Leverage Multipliers & Sudden Capital Wipeouts";
  rawEn.scenes[4].beats[0].text = "At 25 to 1 leverage, a mere 4% asset drawdown wipes out 100% of an institution's equity base, triggering immediate insolvency.";
  rawEn.scenes[4].beats[0].dialogue = "At 25 to 1 leverage, a mere 4% asset drawdown wipes out 100% of an institution's equity base, triggering immediate insolvency.";

  // Scene 5: Case Study - The Classic Disasters
  rawHindi.scenes[5].title = "The Hall of Derivatives Disasters: 1995 to 2008";
  rawHindi.scenes[5].beats[0].text = "1995 में बेयरिंग्स बैंक, 1998 में एलटीसीएम, 2002 में अलाइड आइरिश और 2008 में सोसिएटे जेनेराल ने अरबों डॉलर के अनधिकृत घाटे झेले।";
  rawHindi.scenes[5].beats[0].hindi_tts = "1995 में बेयरिंग्स बैंक, 1998 में एलटीसीएम, 2002 में अलाइड आइरिश और 2008 में सोसिएटे जेनेराल ने अरबों डॉलर के अनधिकृत घाटे झेले।";

  rawEn.scenes[5].title = "The Hall of Derivatives Disasters: 1995 to 2008";
  rawEn.scenes[5].beats[0].text = "From Barings Bank in 1995 to LTCM in 1998 and SocGen in 2008, unhedged positions and rogue trading repeatedly caused multi-billion-dollar ruin.";
  rawEn.scenes[5].beats[0].dialogue = "From Barings Bank in 1995 to LTCM in 1998 and SocGen in 2008, unhedged positions and rogue trading repeatedly caused multi-billion-dollar ruin.";

  // Scene 6: Split Comparison - VaR vs Stress Testing
  const leftVaR = {
    title: "Daily Statistical VaR (99%)",
    items: [
      "Evaluates potential losses under standard bell-curve market conditions",
      "Completely blind to tail dislocations, liquidity freezes, and gap risk",
      "Fosters a false sense of institutional security before market panics"
    ]
  };
  const rightStress = {
    title: "Extreme Scenario Stress Testing",
    items: [
      "Replays historical crisis scenarios (1987 crash, 1998 Russian default, 2008 crisis)",
      "Models widening bid-ask spreads, zero market liquidity, and margin spikes",
      "Mandates unencumbered capital buffers sufficient to survive extreme panics"
    ]
  };
  rawHindi.scenes[6].title = "Statistical Value at Risk (VaR) vs Extreme Stress Testing";
  rawHindi.scenes[6].beats[0].ui_state.left = leftVaR;
  rawHindi.scenes[6].beats[0].ui_state.right = rightStress;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftVaR;
    rawHindi.scenes[6].beats[0].visual.data.right = rightStress;
  }
  rawHindi.scenes[6].beats[0].text = "सामान्य दिनों का वार मॉडल टेल रिस्क नहीं पकड़ पाता, इसलिए 1987 और 2008 जैसे ऐतिहासिक क्रैश की स्ट्रेस टेस्टिंग अनिवार्य है।";
  rawHindi.scenes[6].beats[0].hindi_tts = "सामान्य दिनों का वार मॉडल टेल रिस्क नहीं पकड़ पाता, इसलिए 1987 और 2008 जैसे ऐतिहासिक क्रैश की स्ट्रेस टेस्टिंग अनिवार्य है।";

  rawEn.scenes[6].title = "Statistical Value at Risk (VaR) vs Extreme Stress Testing";
  rawEn.scenes[6].beats[0].ui_state.left = leftVaR;
  rawEn.scenes[6].beats[0].ui_state.right = rightStress;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftVaR;
    rawEn.scenes[6].beats[0].visual.data.right = rightStress;
  }
  rawEn.scenes[6].beats[0].text = "While 99% VaR captures routine day-to-day fluctuations, extreme scenario stress testing reveals catastrophic tail liquidity wipeouts.";
  rawEn.scenes[6].beats[0].dialogue = "While 99% VaR captures routine day-to-day fluctuations, extreme scenario stress testing reveals catastrophic tail liquidity wipeouts.";

  // Scene 7: Progressive Cards - Barings Bank by the Numbers
  const baringsCards = [
    { title: "27,000 SIMEX Contracts: $7 Billion Exposure", body: "Nick Leeson accumulated 27,000 long Nikkei futures via 500-yen multiplier." },
    { title: "Short Straddles: Infinite Tail Risk", body: "Sold put and call options collecting small upfront premiums, betting market would stay calm." },
    { title: "£827 Million ($1.4B) Terminal Loss", body: "Kobe earthquake dropped Nikkei 15%, wiping out Barings' entire £440 million equity base." }
  ];
  rawHindi.scenes[7].title = "Case Study: The Barings Bank Collapse by the Numbers";
  rawHindi.scenes[7].beats[0].ui_state.cards = baringsCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = baringsCards;
  rawHindi.scenes[7].beats[0].text = "बेयरिंग्स बैंक में निक लीसन ने 27000 निकेई फ्यूचर्स और शॉर्ट स्ट्रैडल्स से 1.4 बिलियन डॉलर का नुकसान करके 233 साल पुराना बैंक डुबो दिया।";
  rawHindi.scenes[7].beats[0].hindi_tts = "बेयरिंग्स बैंक में निक लीसन ने 27000 निकेई फ्यूचर्स और शॉर्ट स्ट्रैडल्स से 1.4 बिलियन डॉलर का नुकसान करके 233 साल पुराना बैंक डुबो दिया।";

  rawEn.scenes[7].title = "Case Study: The Barings Bank Collapse by the Numbers";
  rawEn.scenes[7].beats[0].ui_state.cards = baringsCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = baringsCards;
  rawEn.scenes[7].beats[0].text = "Nick Leeson's 27,000 unhedged Nikkei contracts and short straddles generated a $1.4 billion loss, bankrupting 233-year-old Barings Bank.";
  rawEn.scenes[7].beats[0].dialogue = "Nick Leeson's 27,000 unhedged Nikkei contracts and short straddles generated a $1.4 billion loss, bankrupting 233-year-old Barings Bank.";

  // Scene 8: Formula Breakdown - Incentive Alignment
  rawHindi.scenes[8].title = "Trader Bonus Incentive Alignment & Clawback Structures";
  rawHindi.scenes[8].beats[0].text = "शॉर्ट-टर्म अकाउंटिंग प्रॉफिट पर दिए जाने वाले तात्कालिक बोनस ट्रेडर्स को छिपा हुआ टेल रिस्क लेने के लिए उकसाते हैं।";
  rawHindi.scenes[8].beats[0].hindi_tts = "शॉर्ट-टर्म अकाउंटिंग प्रॉफिट पर दिए जाने वाले तात्कालिक बोनस ट्रेडर्स को छिपा हुआ टेल रिस्क लेने के लिए उकसाते हैं।";

  rawEn.scenes[8].title = "Trader Bonus Incentive Alignment & Clawback Structures";
  rawEn.scenes[8].beats[0].text = "Compensation based solely on immediate annual profits creates moral hazard; multi-year bonus deferrals and clawbacks are essential.";
  rawEn.scenes[8].beats[0].dialogue = "Compensation based solely on immediate annual profits creates moral hazard; multi-year bonus deferrals and clawbacks are essential.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "If a rogue trader secretly enters fictitious offsetting forward contracts to circumvent position limits while running massive directional bets, which organizational safeguard fundamentally prevents this concealment?";
  const quizOpts = [
    "A: Strict physical separation of front-office execution from back-office trade confirmation with direct counterparty verification",
    "B: Increasing the trader's annual profit bonus percentage to encourage voluntary ethical disclosure",
    "C: Relying solely on internal Value at Risk models without requiring independent broker price verification",
    "D: Allowing traders to maintain discretionary off-balance-sheet reserve accounts to smooth quarterly earnings volatility"
  ];
  const quizAns = "A: Strict physical separation of front-office execution from back-office trade confirmation with direct counterparty verification";

  rawHindi.scenes[9].title = "Active Recall Challenge";
  for (let b = 0; b < 3; b++) {
    rawHindi.scenes[9].beats[b].ui_state.question = quizQ;
    rawHindi.scenes[9].beats[b].ui_state.options = quizOpts;
    if (b < 2) {
      rawHindi.scenes[9].beats[b].ui_state.showThinkingSpinner = b === 1;
      rawHindi.scenes[9].beats[b].ui_state.answer = undefined;
    } else {
      rawHindi.scenes[9].beats[b].ui_state.showThinkingSpinner = false;
      rawHindi.scenes[9].beats[b].ui_state.answer = quizAns;
    }
  }
  rawHindi.scenes[9].beats[0].text = "सोचिए कि यदि कोई ट्रेडर फर्जी ऑफसेटिंग ट्रेड्स डालकर भारी अनधिकृत पोजीशन छिपाता है, तो कौन सा संगठनात्मक नियंत्रण इसे रोकेगा?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि यदि कोई ट्रेडर फर्जी ऑफसेटिंग ट्रेड्स डालकर भारी अनधिकृत पोजीशन छिपाता है, तो कौन सा संगठनात्मक नियंत्रण इसे रोकेगा?";
  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या फ्रंट और बैक ऑफिस की सख्त सेपरेशन और थर्ड-पार्टी कन्फर्मेशन से ही धोखाधड़ी पकड़ी जा सकती है।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या फ्रंट और बैक ऑफिस की सख्त सेपरेशन और थर्ड-पार्टी कन्फर्मेशन से ही धोखाधड़ी पकड़ी जा सकती है।";
  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। फ्रंट-ऑफिस और बैक-ऑफिस का पूर्ण विभाजन और स्वतंत्र काउंटरपार्टी वेरिफिकेशन फर्जी ट्रेड्स को तुरंत पकड़ लेता है।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। फ्रंट-ऑफिस और बैक-ऑफिस का पूर्ण विभाजन और स्वतंत्र काउंटरपार्टी वेरिफिकेशन फर्जी ट्रेड्स को तुरंत पकड़ लेता है।";

  rawEn.scenes[9].title = "Active Recall Challenge";
  for (let b = 0; b < 3; b++) {
    rawEn.scenes[9].beats[b].ui_state.question = quizQ;
    rawEn.scenes[9].beats[b].ui_state.options = quizOpts;
    if (b < 2) {
      rawEn.scenes[9].beats[b].ui_state.showThinkingSpinner = b === 1;
      rawEn.scenes[9].beats[b].ui_state.answer = undefined;
    } else {
      rawEn.scenes[9].beats[b].ui_state.showThinkingSpinner = false;
      rawEn.scenes[9].beats[b].ui_state.answer = quizAns;
    }
  }
  rawEn.scenes[9].beats[0].text = "Consider an institution attempting to prevent rogue traders from concealing unauthorized exposures through fictitious mirror trades.";
  rawEn.scenes[9].beats[0].dialogue = "Consider an institution attempting to prevent rogue traders from concealing unauthorized exposures through fictitious mirror trades.";
  rawEn.scenes[9].beats[1].text = "Evaluate why independent trade confirmation directly with external counterparties makes internal trade fabrication impossible.";
  rawEn.scenes[9].beats[1].dialogue = "Evaluate why independent trade confirmation directly with external counterparties makes internal trade fabrication impossible.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Strict separation of front and back office functions ensures independent settlement and confirmation.";
  rawEn.scenes[9].beats[2].dialogue = "The correct answer is A. Strict separation of front and back office functions ensures independent settlement and confirmation.";

  // Scene 10: Chat Story
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, in sabhi ghatnao se ek aam trader aur risk manager ke liye sabse bada sabak kya hai?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, इन सभी घटनाओं से एक आम ट्रेडर और रिस्क मैनेजर के लिए सबसे बड़ा सबक क्या है?";
  rawHindi.scenes[10].beats[1].text = "Raju, kabhi kisi trader ko basic rules se upar mat samjho, aur asadharan munafa hamesha asadharan risk chupaye hota hai!";
  rawHindi.scenes[10].beats[1].hindi_tts = "राजू, कभी किसी ट्रेडर को बेसिक रूल्स से ऊपर मत समझो, और असाधारण मुनाफा हमेशा असाधारण रिस्क छुपाए होता है!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, what is the ultimate pedagogical takeaway for corporate treasurers and bank risk managers from these crises?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, what is the ultimate pedagogical takeaway for corporate treasurers and bank risk managers from these crises?";
  rawEn.scenes[10].beats[1].text = "Raju, never allow anyone to bypass basic internal controls, and remember that abnormal profits always conceal unhedged tail risk.";
  rawEn.scenes[10].beats[1].dialogue = "Raju, never allow anyone to bypass basic internal controls, and remember that abnormal profits always conceal unhedged tail risk.";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Derivatives Risk Management ke aath mukhya siddhanton ko dohraayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए डेरिवेटिव्स रिस्क मैनेजमेंट के आठ मुख्य सिद्धांतों को दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: Front aur back office ka purna vibhajan anivarya hai aur independent MTM bina kisi chhoot ke hona chahiye.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: फ्रंट और बैक ऑफिस का पूर्ण विभाजन अनिवार्य है और इंडिपेंडेंट मार्क-टू-मार्केट बिना किसी छूट के होना चाहिए।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: Lagatar asadharan munafa hidden tail risk ka sanket hai aur leverage equity wipeout ka mukhya karan hai.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: लगातार असाधारण मुनाफा हिडन टेल रिस्क का संकेत है और लेवरेज इक्विटी वाइपआउट का मुख्य कारण है।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: VaR ke sath scenario stress testing anivarya hai aur model flaws se jyada operational failure ghatak hote hain.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: वार मॉडल के साथ सिनेरियो स्ट्रेस टेस्टिंग अनिवार्य है और ऑपरेशनल गलतियां सबसे घातक होती हैं।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: Bonus clawbacks moral hazard rokte hain aur terminal payoff ko net profit se alag rakhna chahiye.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: बोनस क्लॉबैक मोरल हैजार्ड रोकते हैं और टर्मिनल पेऑफ को नेट प्रॉफिट से हमेशा अलग रखना चाहिए।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam institutional risk governance aur derivatives trading ke sthir stambh hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम इंस्टीट्यूशनल रिस्क गवर्नेंस और डेरिवेटिव्स ट्रेडिंग के स्थिर स्तंभ हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of derivatives risk governance and institutional control.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of derivatives risk governance and institutional control.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: Enforce strict segregation of duties and mandatory independent daily mark-to-market.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: Enforce strict segregation of duties and mandatory independent daily mark-to-market.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: Beware the outperformance fallacy, and recognize that leverage multiplies drawdown velocity.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: Beware the outperformance fallacy, and recognize that leverage multiplies drawdown velocity.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Supplement VaR with multi-factor stress tests, addressing operational and model risks.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Supplement VaR with multi-factor stress tests, addressing operational and model risks.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: Align compensation through clawback structures, and maintain the payoff versus profit distinction.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: Align compensation through clawback structures, and maintain the payoff versus profit distinction.";
  rawEn.scenes[11].beats[5].text = "These eight principles form the essential bedrock of institutional trading survival.";
  rawEn.scenes[11].beats[5].dialogue = "These eight principles form the essential bedrock of institutional trading survival.";

  // Sync en_narration and en_subtitle for English beats
  for (const scene of rawEn.scenes) {
    for (const beat of scene.beats) {
      beat.en_narration = beat.dialogue || beat.text;
      beat.en_subtitle = beat.text || beat.dialogue;
    }
  }

  // Write out episode_raw.json
  fs.writeFileSync(path.join(hindiDir, "episode_raw.json"), JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(path.join(englishDir, "episode_raw.json"), JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English ch25_part1!");

  // Validate episodes
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");
}

main().catch(err => {
  console.error("Scaffolding error:", err);
  process.exit(1);
});

