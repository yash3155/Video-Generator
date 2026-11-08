import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch25_part2";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch25_part2 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Derivatives Mishaps: Lessons for Corporations",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Derivatives Mishaps: Lessons for Corporations",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: The Treasury Speculation Trap";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, Procter & Gamble aur Orange County jaise sansthano ne derivatives me itna bada nuksan kyu uthaya?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, प्रॉक्टर एंड गैंबल और ऑरेंज काउंटी जैसे संस्थानों ने डेरिवेटिव्स में इतना बड़ा नुकसान क्यों उठाया?";
  rawHindi.scenes[0].beats[1].text = "Raju, unhone treasury ko hedging ka cost center samajhne ke bajaye profit center banakar speculative juva khela!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, उन्होंने ट्रेजरी को हेजिंग का कॉस्ट सेंटर समझने के बजाय प्रॉफिट सेंटर बनाकर स्पेक्यूलेटिव जुआ खेला!";

  rawEn.scenes[0].title = "Origins: The Treasury Speculation Trap";
  rawEn.scenes[0].beats[0].text = "Sharma ji, why did corporate giants like Procter & Gamble and municipalities like Orange County suffer catastrophic losses in swaps?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, why did corporate giants like Procter & Gamble and municipalities like Orange County suffer catastrophic losses in swaps?";
  rawEn.scenes[0].beats[1].text = "Raju, they committed the cardinal sin of turning a risk-mitigating corporate treasury into a speculative yield-chasing profit center.";
  rawEn.scenes[0].beats[1].dialogue = "Raju, they committed the cardinal sin of turning a risk-mitigating corporate treasury into a speculative yield-chasing profit center.";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Treasury Cost Center Hedging vs Speculative Profit Centers";
  rawHindi.scenes[1].beats[0].text = "Corporate treasury ko operational risk kam karne wala cost center hona chahiye, munafa kamane wala trading desk nahi.";
  rawHindi.scenes[1].beats[0].hindi_tts = "कॉरपोरेट ट्रेजरी को ऑपरेशनल रिस्क कम करने वाला कॉस्ट सेंटर होना चाहिए, मुनाफा कमाने वाला ट्रेडिंग डेस्क नहीं।";

  rawEn.scenes[1].title = "Treasury Cost Center Hedging vs Speculative Profit Centers";
  rawEn.scenes[1].beats[0].text = "Corporate treasuries must operate strictly as cost centers to immunize cash flows, never as profit centers taking directional bets.";
  rawEn.scenes[1].beats[0].dialogue = "Corporate treasuries must operate strictly as cost centers to immunize cash flows, never as profit centers taking directional bets.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Treasuries as Cost Centers", body: "Evaluate treasuries purely on commercial exposure reduction, never on trading profit." },
    { title: "2. Understand Complex Contracts", body: "Never execute structured derivatives that corporate staff cannot model and stress-test in-house." },
    { title: "3. Liquidity vs Solvency", body: "Maintain liquid cash buffers to survive daily exchange margin calls and repo haircuts." },
    { title: "4. Ultra Vires Legal Authority", body: "Rigorously verify statutory counterparty authority to prevent swap contract invalidation." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Corporate Risk Governance";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar stambho ko samjhenge: treasury governance, model understanding, liquidity risk, aur ultra vires legal capacity.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार स्तंभों को समझेंगे: ट्रेजरी गवर्नेंस, मॉडल अंडरस्टैंडिंग, लिक्विडिटी रिस्क, और अल्ट्रा वायर्स लीगल कैपेसिटी।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Corporate Risk Governance";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We master four foundational pillars: treasury cost center governance, independent modeling, liquidity risk, and ultra vires legality.";
  rawEn.scenes[2].beats[0].dialogue = "We master four foundational pillars: treasury cost center governance, independent modeling, liquidity risk, and ultra vires legality.";

  // Scene 3: Comparison - Commercial Hedging vs Speculative Exotics
  const leftHedge = {
    title: "Commercial Operational Hedging",
    items: [
      "Offsets actual physical commodity inputs, currency receipts, or floating debt",
      "Reduces earnings volatility and guarantees corporate cash flow predictability",
      "Zero speculative leverage and transparent linear risk profiles"
    ]
  };
  const rightSpec = {
    title: "Speculative Yield Enhancement",
    items: [
      "Enters leveraged structured swaps to slightly lower immediate interest expense",
      "Sells catastrophic uncapped tail options in exchange for small upfront fee savings",
      "Transforms a nonfinancial manufacturing firm into an unhedged speculative hedge fund"
    ]
  };
  rawHindi.scenes[3].title = "Commercial Cash-Flow Hedging vs Speculative Yield Chasing";
  rawHindi.scenes[3].beats[0].ui_state.left = leftHedge;
  rawHindi.scenes[3].beats[0].ui_state.right = rightSpec;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftHedge;
    rawHindi.scenes[3].beats[0].visual.data.right = rightSpec;
  }
  rawHindi.scenes[3].beats[0].text = "सच्ची हेजिंग ऑपरेटिंग कैश फ्लो को स्थिर करती है, जबकि यील्ड बढ़ाने के लिए लेवरेज्ड स्वैप्स बेचना कंपनी को बर्बादी की ओर धकेलता है।";
  rawHindi.scenes[3].beats[0].hindi_tts = "सच्ची हेजिंग ऑपरेटिंग कैश फ्लो को स्थिर करती है, जबकि यील्ड बढ़ाने के लिए लेवरेज्ड स्वैप्स बेचना कंपनी को बर्बादी की ओर धकेलता है।";

  rawEn.scenes[3].title = "Commercial Cash-Flow Hedging vs Speculative Yield Chasing";
  rawEn.scenes[3].beats[0].ui_state.left = leftHedge;
  rawEn.scenes[3].beats[0].ui_state.right = rightSpec;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftHedge;
    rawEn.scenes[3].beats[0].visual.data.right = rightSpec;
  }
  rawEn.scenes[3].beats[0].text = "True hedging immunizes operating margins, whereas structured exotic swaps sell catastrophic tail options to subsidize borrowing costs.";
  rawEn.scenes[3].beats[0].dialogue = "True hedging immunizes operating margins, whereas structured exotic swaps sell catastrophic tail options to subsidize borrowing costs.";

  // Scene 4: Formula Breakdown - Orange County Repo Leverage
  rawHindi.scenes[4].title = "The Orange County Repo Leverage & Inverse Floater Cascade";
  rawHindi.scenes[4].beats[0].text = "ऑरेंज काउंटी ने साढ़े सात बिलियन डॉलर को रेपो से बीस बिलियन डॉलर में बदला; फेड के 300 बीपीएस हाइक ने 1.7 बिलियन डॉलर का दिवालियापन ला दिया।";
  rawHindi.scenes[4].beats[0].hindi_tts = "ऑरेंज काउंटी ने साढ़े सात बिलियन डॉलर को रेपो से बीस बिलियन डॉलर में बदला; फेड के 300 बीपीएस हाइक ने 1.7 बिलियन डॉलर का दिवालियापन ला दिया।";

  rawEn.scenes[4].title = "The Orange County Repo Leverage & Inverse Floater Cascade";
  rawEn.scenes[4].beats[0].text = "Orange County leveraged $7.5B into $20B using repos to buy inverse floaters; a 300 bps Fed hike triggered $1.7B in losses and bankruptcy.";
  rawEn.scenes[4].beats[0].dialogue = "Orange County leveraged $7.5B into $20B using repos to buy inverse floaters; a 300 bps Fed hike triggered $1.7B in losses and bankruptcy.";

  // Scene 5: Case Study - The Corporate Crises Timeline
  rawHindi.scenes[5].title = "The Landmark Corporate Crises: P&G, Orange County, & MG";
  rawHindi.scenes[5].beats[0].text = "1989 में हैमर्समिथ का अल्ट्रा वायर्स, 1993 में मेटलगैसेलशाफ्ट का स्टैक-एंड-रोल, और 1994 में पीएंडजी के 157 मिलियन डॉलर के घाटे ने कॉर्पोरेट जगत को हिला दिया।";
  rawHindi.scenes[5].beats[0].hindi_tts = "1989 में हैमर्समिथ का अल्ट्रा वायर्स, 1993 में मेटलगैसेलशाफ्ट का स्टैक-एंड-रोल, और 1994 में पीएंडजी के 157 मिलियन डॉलर के घाटे ने कॉर्पोरेट जगत को हिला दिया।";

  rawEn.scenes[5].title = "The Landmark Corporate Crises: P&G, Orange County, & MG";
  rawEn.scenes[5].beats[0].text = "From Hammersmith's ultra vires ruling in 1989 to Metallgesellschaft in 1993 and P&G's $157M swap loss in 1994, corporate derivatives require strict controls.";
  rawEn.scenes[5].beats[0].dialogue = "From Hammersmith's ultra vires ruling in 1989 to Metallgesellschaft in 1993 and P&G's $157M swap loss in 1994, corporate derivatives require strict controls.";

  // Scene 6: Split Comparison - Solvency vs Liquidity
  const leftSolv = {
    title: "Accounting Solvency",
    items: [
      "Total assets exceed liabilities according to present value discount models",
      "Long-term fundamentals and eventual cash recovery remain economically intact",
      "Completely irrelevant if the institution cannot meet immediate cash obligations"
    ]
  };
  const rightLiq = {
    title: "Cash Liquidity Exhaustion",
    items: [
      "Daily clearinghouse variation margin calls demand immediate wire transfers",
      "Repo lenders demand additional cash collateral due to asset value haircuts",
      "Failure to provide liquid cash triggers forced liquidation and immediate bankruptcy"
    ]
  };
  rawHindi.scenes[6].title = "Long-Term Solvency vs Daily Cash Liquidity Survival";
  rawHindi.scenes[6].beats[0].ui_state.left = leftSolv;
  rawHindi.scenes[6].beats[0].ui_state.right = rightLiq;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftSolv;
    rawHindi.scenes[6].beats[0].visual.data.right = rightLiq;
  }
  rawHindi.scenes[6].beats[0].text = "किताबों में सॉल्वेंट दिखने वाली कंपनी भी दैनिक मार्जिन कॉल्स और लिक्विडिटी की कमी के कारण 24 घंटे में दिवालिया हो सकती है।";
  rawHindi.scenes[6].beats[0].hindi_tts = "किताबों में सॉल्वेंट दिखने वाली कंपनी भी दैनिक मार्जिन कॉल्स और लिक्विडिटी की कमी के कारण 24 घंटे में दिवालिया हो सकती है।";

  rawEn.scenes[6].title = "Long-Term Solvency vs Daily Cash Liquidity Survival";
  rawEn.scenes[6].beats[0].ui_state.left = leftSolv;
  rawEn.scenes[6].beats[0].ui_state.right = rightLiq;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftSolv;
    rawEn.scenes[6].beats[0].visual.data.right = rightLiq;
  }
  rawEn.scenes[6].beats[0].text = "An institution can be entirely solvent on paper yet collapse overnight if daily variation margin calls drain liquid cash reserves.";
  rawEn.scenes[6].beats[0].dialogue = "An institution can be entirely solvent on paper yet collapse overnight if daily variation margin calls drain liquid cash reserves.";

  // Scene 7: Progressive Cards - Metallgesellschaft Stack-and-Roll
  const mgCards = [
    { title: "10-Year Fixed Supply Contracts", body: "MG sold forward oil supply to commercial customers at fixed prices over 10-year horizons." },
    { title: "Short-Term Futures Stack-and-Roll", body: "Hedged using liquid 1-month NYMEX futures, assuming perpetual backwardation roll yield." },
    { title: "Contango Inversion & Liquidity Crisis", body: "Market flipped to contango; rolling short contracts produced negative roll yield and $1.3B cash drain." }
  ];
  rawHindi.scenes[7].title = "Case Study: Metallgesellschaft's Stack-and-Roll Oil Crisis";
  rawHindi.scenes[7].beats[0].ui_state.cards = mgCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = mgCards;
  rawHindi.scenes[7].beats[0].text = "मेटलगैसेलशाफ्ट ने 10 साल के डिलीवरी कॉन्ट्रैक्ट्स को 1 महीने के फ्यूचर्स से हेज किया; कंटैंगो में बदलने से मार्जिन कॉल्स में 1.3 बिलियन डॉलर बह गए।";
  rawHindi.scenes[7].beats[0].hindi_tts = "मेटलगैसेलशाफ्ट ने 10 साल के डिलीवरी कॉन्ट्रैक्ट्स को 1 महीने के फ्यूचर्स से हेज किया; कंटैंगो में बदलने से मार्जिन कॉल्स में 1.3 बिलियन डॉलर बह गए।";

  rawEn.scenes[7].title = "Case Study: Metallgesellschaft's Stack-and-Roll Oil Crisis";
  rawEn.scenes[7].beats[0].ui_state.cards = mgCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = mgCards;
  rawEn.scenes[7].beats[0].text = "Metallgesellschaft hedged 10-year commitments with 1-month futures; contango inversion and daily margin calls produced a $1.3B disaster.";
  rawEn.scenes[7].beats[0].dialogue = "Metallgesellschaft hedged 10-year commitments with 1-month futures; contango inversion and daily margin calls produced a $1.3B disaster.";

  // Scene 8: Formula Breakdown - Prohibition on Exotic Structures
  rawHindi.scenes[8].title = "Corporate Prohibition on Asymmetric Exotic Derivatives";
  rawHindi.scenes[8].beats[0].text = "कॉरपोरेट बोर्ड्स को उन सभी डेरिवेटिव्स पर प्रतिबंध लगाना चाहिए जो मामूली फायदे के बदले असीमित नुकसान का जोखिम देते हैं।";
  rawHindi.scenes[8].beats[0].hindi_tts = "कॉरपोरेट बोर्ड्स को उन सभी डेरिवेटिव्स पर प्रतिबंध लगाना चाहिए जो मामूली फायदे के बदले असीमित नुकसान का जोखिम देते हैं।";

  rawEn.scenes[8].title = "Corporate Prohibition on Asymmetric Exotic Derivatives";
  rawEn.scenes[8].beats[0].text = "Corporate governance bylaws must prohibit asymmetric exotic contracts that trade small upfront savings for uncapped tail liabilities.";
  rawEn.scenes[8].beats[0].dialogue = "Corporate governance bylaws must prohibit asymmetric exotic contracts that trade small upfront savings for uncapped tail liabilities.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "If a corporate treasurer is tempted to enter a zero-cost leveraged swap that reduces debt interest by 50 basis points while creating extreme uncapped exposure if interest rates rise by more than 2%, how should the board evaluate this structure?";
  const quizOpts = [
    "A: Reject the transaction immediately because treasuries must operate strictly as risk-reducing cost centers rather than speculative profit centers",
    "B: Approve the transaction because interest rate reductions directly enhance reported quarterly accounting earnings",
    "C: Treat the derivative as free insurance because upfront premium cost is zero dollars",
    "D: Double the transaction notional to maximize the interest rate savings before the financial year ends"
  ];
  const quizAns = "A: Reject the transaction immediately because treasuries must operate strictly as risk-reducing cost centers rather than speculative profit centers";

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
  rawHindi.scenes[9].beats[0].text = "सोचिए कि यदि ट्रेजरी को 50 बीपीएस ब्याज बचाने के लिए ऐसा स्वैप ऑफर हो जिसमें दरें बढ़ने पर भारी अनकैप्ड नुकसान हो, तो बोर्ड को क्या करना चाहिए?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि यदि ट्रेजरी को 50 बीपीएस ब्याज बचाने के लिए ऐसा स्वैप ऑफर हो जिसमें दरें बढ़ने पर भारी अनकैप्ड नुकसान हो, तो बोर्ड को क्या करना चाहिए?";
  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या ट्रेजरी का काम रिस्क घटाना है या थोड़े से ब्याज के लिए कंपनी को जुए में झोंकना है।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या ट्रेजरी का काम रिस्क घटाना है या थोड़े से ब्याज के लिए कंपनी को जुए में झोंकना है।";
  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। ट्रेजरी को लागत केंद्र के रूप में ही काम करना चाहिए, थोड़े से मुनाफे के लिए अनकैप्ड टेल रिस्क लेना पूरी तरह गलत है।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। ट्रेजरी को लागत केंद्र के रूप में ही काम करना चाहिए, थोड़े से मुनाफे के लिए अनकैप्ड टेल रिस्क लेना पूरी तरह गलत है।";

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
  rawEn.scenes[9].beats[0].text = "Consider a corporate board evaluating a zero-cost swap proposal promising lower interest expenses in exchange for uncapped rate risk.";
  rawEn.scenes[9].beats[0].dialogue = "Consider a corporate board evaluating a zero-cost swap proposal promising lower interest expenses in exchange for uncapped rate risk.";
  rawEn.scenes[9].beats[1].text = "Evaluate why accepting catastrophic downside exposure to boost short-term earnings violates corporate treasury governance.";
  rawEn.scenes[9].beats[1].dialogue = "Evaluate why accepting catastrophic downside exposure to boost short-term earnings violates corporate treasury governance.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Corporate treasuries must function as risk-reducing cost centers, avoiding asymmetric speculative structures.";
  rawEn.scenes[9].beats[2].dialogue = "The correct answer is A. Corporate treasuries must function as risk-reducing cost centers, avoiding asymmetric speculative structures.";

  // Scene 10: Chat Story
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, nonfinancial corporations ke liye John Hull ka sabse mukhya niyam kya hai?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, नॉन-फाइनेंशियल कॉरपोरेशन्स के लिए जॉन हल का सबसे मुख्य नियम क्या है?";
  rawHindi.scenes[10].beats[1].text = "Raju, apne core business par focus karo, aur jin derivatives ko khud mathematically model na kar sako, unme kabhi mat pado!";
  rawHindi.scenes[10].beats[1].hindi_tts = "राजू, अपने कोर बिजनेस पर फोकस करो, और जिन डेरिवेटिव्स को खुद मैथेमैटिकली मॉडल न कर सको, उनमें कभी मत पड़ो!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, what is John Hull's definitive rule for nonfinancial corporations navigating derivative markets?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, what is John Hull's definitive rule for nonfinancial corporations navigating derivative markets?";
  rawEn.scenes[10].beats[1].text = "Raju, focus on your core operating business, and never enter complex derivative structures that you cannot independently model in-house.";
  rawEn.scenes[10].beats[1].dialogue = "Raju, focus on your core operating business, and never enter complex derivative structures that you cannot independently model in-house.";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Corporate Derivatives Risk ke aath mukhya siddhanton ko dohraayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए कॉरपोरेट डेरिवेटिव्स रिस्क के आठ मुख्य सिद्धांतों को दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: Treasury ko cost center rakhein aur jin structured contracts ko model na kar sakein unse bachein.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: ट्रेजरी को कॉस्ट सेंटर रखें और जिन स्ट्रक्चर्ड कॉन्ट्रैक्ट्स को मॉडल न कर सकें उनसे बचें।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: Accounting solvency ke sath daily cash liquidity margin calls ka dhyan rakhna anivarya hai.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: अकाउंटिंग सॉल्वेंसी के साथ डेली कैश लिक्विडिटी मार्जिन कॉल्स का ध्यान रखना अनिवार्य है।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: Stack-and-roll me contango risk hota hai aur municipal contracts me ultra vires capacity check karein.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: स्टैक-एंड-रोल में कंटैंगो रिस्क होता है और म्यूनिसिपल कॉन्ट्रैक्ट्स में अल्ट्रा वायर्स कैपेसिटी चेक करें।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: Asymmetric exotic options par pratibandh lagayein aur terminal payoff ko net profit se alag samjhein.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: एसिमेट्रिक एग्जॉटिक ऑप्शंस पर प्रतिबंध लगाएं और टर्मिनल पेऑफ को नेट प्रॉफिट से हमेशा अलग समझें।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam corporate treasury aur financial institutions ke suraksha kavach hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम कॉरपोरेट ट्रेजरी और फाइनेंशियल इंस्टीट्यूशंस के सुरक्षा कवच हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of corporate derivatives risk and treasury governance.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of corporate derivatives risk and treasury governance.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: Maintain treasuries as cost centers, and never buy structures you cannot independently model.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: Maintain treasuries as cost centers, and never buy structures you cannot independently model.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: Separate liquidity management from solvency, and maintain reserves for daily margin calls.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: Separate liquidity management from solvency, and maintain reserves for daily margin calls.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Guard against contango inversions in roll hedging, and verify counterparty ultra vires capacity.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Guard against contango inversions in roll hedging, and verify counterparty ultra vires capacity.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: Prohibit leveraged asymmetric exotic structures, and enforce the payoff versus profit distinction.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: Prohibit leveraged asymmetric exotic structures, and enforce the payoff versus profit distinction.";
  rawEn.scenes[11].beats[5].text = "These eight principles protect nonfinancial corporations and financial institutions from ruin.";
  rawEn.scenes[11].beats[5].dialogue = "These eight principles protect nonfinancial corporations and financial institutions from ruin.";

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
  console.log("Successfully wrote episode_raw.json for Hindi and English ch25_part2!");

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

