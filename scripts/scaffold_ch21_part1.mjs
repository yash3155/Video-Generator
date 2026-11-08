import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch21_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch21_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Interest Rate Options & Swaptions",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Interest Rate Options & Swaptions",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: Embedded Bond Options & Callable Debt";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, callable bonds aur standard exchange-traded options me kya antar hota hai?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, कॉलेबल बॉन्ड्स और स्टैंडर्ड एक्सचेंज-ट्रेडेड ऑप्शंस में क्या अंतर होता है?";
  rawHindi.scenes[0].beats[1].text = "Raju, callable bonds me issuer ke paas option embedded hota hai ki interest rates girne par wo bond wapas khareed le!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, कॉलेबल बॉन्ड्स में जारीकर्ता के पास ऑप्शन एम्बेडेड होता है कि ब्याज दरें गिरने पर वो बॉन्ड वापस खरीद ले!";

  rawEn.scenes[0].title = "Origins: Embedded Bond Options & Callable Debt";
  rawEn.scenes[0].beats[0].text = "Sharma ji, how do embedded bond options differ from standalone exchange-traded interest rate options?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, how do embedded bond options differ from standalone exchange-traded interest rate options?";
  rawEn.scenes[0].beats[1].text = "Raju, callable bonds contain an embedded issuer right to redeem debt early when market yields decline!";
  rawEn.scenes[0].beats[1].dialogue = "Raju, callable bonds contain an embedded issuer right to redeem debt early when market yields decline!";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Clean Quoted Prices vs Dirty Cash Forward Prices";
  rawHindi.scenes[1].beats[0].text = "मार्केट में सिर्फ क्लीन प्राइस कोट होता है, लेकिन ऑप्शन फॉर्मूला हमेशा एक्रूड इंटरेस्ट वाले डर्टी कैश प्राइस का उपयोग करता है।";
  rawHindi.scenes[1].beats[0].hindi_tts = "मार्केट में सिर्फ क्लीन प्राइस कोट होता है, लेकिन ऑप्शन फॉर्मूला हमेशा एक्रूड इंटरेस्ट वाले डर्टी कैश प्राइस का उपयोग करता है।";

  rawEn.scenes[1].title = "Clean Quoted Prices vs Dirty Cash Forward Prices";
  rawEn.scenes[1].beats[0].text = "While markets quote clean prices excluding accrued interest, option valuation strictly operates on the dirty cash price.";
  rawEn.scenes[1].beats[0].dialogue = "While markets quote clean prices excluding accrued interest, option valuation strictly operates on the dirty cash price.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Bond Options", body: "European calls and puts on coupon bonds valued via Black's forward cash model." },
    { title: "2. Interest Rate Caps", body: "Portfolios of caplets protecting borrowers against rising floating rates." },
    { title: "3. Interest Rate Floors", body: "Portfolios of floorlets protecting lenders against declining floating yields." },
    { title: "4. Swaptions", body: "Options to enter into fixed-for-floating interest rate swaps at predetermined strike rates." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Interest Rate Options";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: bond options, interest rate caps, floors, aur swaptions.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: बॉन्ड ऑप्शंस, इंटरेस्ट रेट कैप्स, फ्लोर्स, और स्वैपशन्स।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Interest Rate Options";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: European bond options, interest rate caps, floors, and swaptions.";
  rawEn.scenes[2].beats[0].dialogue = "We explore four foundational pillars: European bond options, interest rate caps, floors, and swaptions.";

  // Scene 3: Comparison - Caps vs Floors
  const leftCap = {
    title: "Interest Rate Cap (Caplets)",
    items: [
      "Payoff: delta * L * max(R - R_K, 0)",
      "Protects floating-rate borrowers against rising benchmark yields",
      "Portfolio of European call options on future forward rates"
    ]
  };
  const rightFloor = {
    title: "Interest Rate Floor (Floorlets)",
    items: [
      "Payoff: delta * L * max(R_K - R, 0)",
      "Protects floating-rate lenders against falling benchmark yields",
      "Portfolio of European put options on future forward rates"
    ]
  };
  rawHindi.scenes[3].title = "Interest Rate Caps (Caplets) vs Interest Rate Floors (Floorlets)";
  rawHindi.scenes[3].beats[0].ui_state.left = leftCap;
  rawHindi.scenes[3].beats[0].ui_state.right = rightFloor;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftCap;
    rawHindi.scenes[3].beats[0].visual.data.right = rightFloor;
  }
  rawHindi.scenes[3].beats[0].text = "कैप फ्लोटिंग रेट उधारकर्ताओं को बढ़ती ब्याज दरों से बचाता है, जबकि फ्लोर लेंडर्स को गिरती दरों से सुरक्षा देता है।";
  rawHindi.scenes[3].beats[0].hindi_tts = "कैप फ्लोटिंग रेट उधारकर्ताओं को बढ़ती ब्याज दरों से बचाता है, जबकि फ्लोर लेंडर्स को गिरती दरों से सुरक्षा देता है।";

  rawEn.scenes[3].title = "Interest Rate Caps (Caplets) vs Interest Rate Floors (Floorlets)";
  rawEn.scenes[3].beats[0].ui_state.left = leftCap;
  rawEn.scenes[3].beats[0].ui_state.right = rightFloor;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftCap;
    rawEn.scenes[3].beats[0].visual.data.right = rightFloor;
  }
  rawEn.scenes[3].beats[0].text = "An interest rate cap protects borrowers against rate spikes, while a floor provides lenders a guaranteed minimum yield.";
  rawEn.scenes[3].beats[0].dialogue = "An interest rate cap protects borrowers against rate spikes, while a floor provides lenders a guaranteed minimum yield.";

  // Scene 4: Formula Breakdown - Black's Caplet
  rawHindi.scenes[4].title = "Black's 1976 Caplet Pricing Formula";
  rawHindi.scenes[4].beats[0].text = "ब्लैक का कैपलेट फॉर्मूला फॉरवर्ड रेट और डिस्काउंट फैक्टर के आधार पर कैपलेट का थ्योरिटिकल वैल्यू निकालता है।";
  rawHindi.scenes[4].beats[0].hindi_tts = "ब्लैक का कैपलेट फॉर्मूला फॉरवर्ड रेट और डिस्काउंट फैक्टर के आधार पर कैपलेट का थ्योरिटिकल वैल्यू निकालता है।";

  rawEn.scenes[4].title = "Black's 1976 Caplet Pricing Formula";
  rawEn.scenes[4].beats[0].text = "Black's caplet formula prices interest rate call options using the lognormal forward rate distribution and discount factors.";
  rawEn.scenes[4].beats[0].dialogue = "Black's caplet formula prices interest rate call options using the lognormal forward rate distribution and discount factors.";

  // Scene 5: Case Study - Snapshot 21.1 Mortgage Prepayment
  rawHindi.scenes[5].title = "Business Snapshot 21.1: US Mortgage Prepayment Negative Convexity";
  rawHindi.scenes[5].beats[0].text = "यूएस में 30 साल के फिक्स्ड मॉर्गेज में होमओनर के पास प्रीपेमेंट ऑप्शन होता है, जिससे इन्वेस्टर्स को नेगेटिव कॉन्वेक्सिटी झेलनी पड़ती है।";
  rawHindi.scenes[5].beats[0].hindi_tts = "यूएस में 30 साल के फिक्स्ड मॉर्गेज में होमओनर के पास प्रीपेमेंट ऑप्शन होता है, जिससे इन्वेस्टर्स को नेगेटिव कॉन्वेक्सिटी झेलनी पड़ती है।";

  rawEn.scenes[5].title = "Business Snapshot 21.1: US Mortgage Prepayment Negative Convexity";
  rawEn.scenes[5].beats[0].text = "In Business Snapshot 21.1, homeowner mortgage prepayment rights without penalty introduce severe negative convexity for MBS investors.";
  rawEn.scenes[5].beats[0].dialogue = "In Business Snapshot 21.1, homeowner mortgage prepayment rights without penalty introduce severe negative convexity for MBS investors.";

  // Scene 6: Split Comparison - Cap - Floor = Swap
  const leftParity = {
    title: "Put-Call Parity Equivalence",
    items: [
      "Cap - Floor = Plain Vanilla Interest Rate Swap",
      "Long cap (calls) + Short floor (puts) at rate R_K",
      "Replicates paying fixed R_K and receiving floating rate R"
    ]
  };
  const rightArbitrage = {
    title: "Synthetic Swap Arbitrage",
    items: [
      "If Cap - Floor > Swap, sell cap, buy floor, receive fixed",
      "If Cap - Floor < Swap, buy cap, sell floor, pay fixed",
      "Enforces exact no-arbitrage pricing across OTC desk"
    ]
  };
  rawHindi.scenes[6].title = "Put-Call Parity Equivalence: Cap Minus Floor Equals Plain Vanilla Swap";
  rawHindi.scenes[6].beats[0].ui_state.left = leftParity;
  rawHindi.scenes[6].beats[0].ui_state.right = rightArbitrage;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftParity;
    rawHindi.scenes[6].beats[0].visual.data.right = rightArbitrage;
  }
  rawHindi.scenes[6].beats[0].text = "पुट-कॉल पैरिटी के अनुसार कैप माइनस फ्लोर सीधे एक प्लेन वैनिला इंटरेस्ट रेट स्वैप के बराबर होता है।";
  rawHindi.scenes[6].beats[0].hindi_tts = "पुट-कॉल पैरिटी के अनुसार कैप माइनस फ्लोर सीधे एक प्लेन वैनिला इंटरेस्ट रेट स्वैप के बराबर होता है।";

  rawEn.scenes[6].title = "Put-Call Parity Equivalence: Cap Minus Floor Equals Plain Vanilla Swap";
  rawEn.scenes[6].beats[0].ui_state.left = leftParity;
  rawEn.scenes[6].beats[0].ui_state.right = rightArbitrage;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftParity;
    rawEn.scenes[6].beats[0].visual.data.right = rightArbitrage;
  }
  rawEn.scenes[6].beats[0].text = "By put-call parity, a long cap combined with a short floor at identical strike rates replicates an interest rate swap.";
  rawEn.scenes[6].beats[0].dialogue = "By put-call parity, a long cap combined with a short floor at identical strike rates replicates an interest rate swap.";

  // Scene 7: Progressive Cards - Hull Section 21.2
  const capletCards = [
    { title: "$10M Principal Caplet", body: "1-year reset date, 1.25-year payment date on 3-month benchmark rate." },
    { title: "Forward 5.0% vs Strike 4.0%", body: "In-the-money forward rate with 20% Black volatility and 5% discount rate." },
    { title: "Caplet Value: $23,980", body: "Black formula d_1=1.2157, d_2=1.0157 yields exact market valuation." }
  ];
  rawHindi.scenes[7].title = "Hull Section 21.2: Valuation of a 1-Year SOFR/LIBOR Caplet";
  rawHindi.scenes[7].beats[0].ui_state.cards = capletCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = capletCards;
  rawHindi.scenes[7].beats[0].text = "हल के सेक्शन 21.2 में 10 मिलियन डॉलर के 1-ईयर कैपलेट की वैल्यू ब्लैक फॉर्मूले से 23,980 डॉलर निकलती है।";
  rawHindi.scenes[7].beats[0].hindi_tts = "हल के सेक्शन 21.2 में 10 मिलियन डॉलर के 1-ईयर कैपलेट की वैल्यू ब्लैक फॉर्मूले से 23,980 डॉलर निकलती है।";

  rawEn.scenes[7].title = "Hull Section 21.2: Valuation of a 1-Year SOFR/LIBOR Caplet";
  rawEn.scenes[7].beats[0].ui_state.cards = capletCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = capletCards;
  rawEn.scenes[7].beats[0].text = "In Hull Section 21.2, Black's model prices a 1-year in-the-money caplet on $10 million principal at exactly $23,980.";
  rawEn.scenes[7].beats[0].dialogue = "In Hull Section 21.2, Black's model prices a 1-year in-the-money caplet on $10 million principal at exactly $23,980.";

  // Scene 8: Formula Breakdown - Bond Option
  rawHindi.scenes[8].title = "Black's European Bond Option Formula (Forward Dirty Price)";
  rawHindi.scenes[8].beats[0].text = "बॉन्ड ऑप्शंस में ब्लैक का फॉर्मूला फॉरवर्ड कैश प्राइस एफ-नॉट का उपयोग करके कूपन बॉन्ड पर कॉल की कीमत तय करता है।";
  rawHindi.scenes[8].beats[0].hindi_tts = "बॉन्ड ऑप्शंस में ब्लैक का फॉर्मूला फॉरवर्ड कैश प्राइस एफ-नॉट का उपयोग करके कूपन बॉन्ड पर कॉल की कीमत तय करता है।";

  rawEn.scenes[8].title = "Black's European Bond Option Formula (Forward Dirty Price)";
  rawEn.scenes[8].beats[0].text = "Black's bond option formula evaluates calls and puts on coupon bonds using the forward dirty cash price F_0.";
  rawEn.scenes[8].beats[0].dialogue = "Black's bond option formula evaluates calls and puts on coupon bonds using the forward dirty cash price F_0.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "Why does combining a long position in an interest rate cap with a short position in an interest rate floor replicate a swap?";
  const quizOpts = [
    "A: Put-call parity guarantees that long calls plus short puts at strike R_K equate to paying fixed and receiving floating",
    "B: Central bank regulations require caps and floors to cancel each other out on balance sheets",
    "C: Caplets and floorlets have zero volatility and therefore always equal fixed rate cash flows",
    "D: Interest rate floors cannot be traded unless backed by an identical offsetting caplet contract"
  ];
  const quizAns = "A: Put-call parity guarantees that long calls plus short puts at strike R_K equate to paying fixed and receiving floating";

  // Hindi Scene 9
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].beats[0].text = "सोचिए कि समान स्ट्राइक रेट पर एक लॉन्ग कैप और शॉर्ट फ्लोर को मिलाने पर प्लेन वैनिला इंटरेस्ट रेट स्वैप क्यों बन जाता है?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि समान स्ट्राइक रेट पर एक लॉन्ग कैप और शॉर्ट फ्लोर को मिलाने पर प्लेन वैनिला इंटरेस्ट रेट स्वैप क्यों बन जाता है?";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या पुट-कॉल पैरिटी फ्लोटिंग और फिक्स्ड कैश फ्लो को लॉक करती है।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या पुट-कॉल पैरिटी फ्लोटिंग और फिक्स्ड कैश फ्लो को लॉक करती है।";
  rawHindi.scenes[9].beats[1].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[1].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawHindi.scenes[9].beats[1].visual?.data) {
    rawHindi.scenes[9].beats[1].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। पुट-कॉल पैरिटी के अनुसार लॉन्ग कॉल और शॉर्ट पुट मिलकर ठीक एक पे-फिक्स्ड रिसीव-फ्लोटिंग स्वैप बनाते हैं।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। पुट-कॉल पैरिटी के अनुसार लॉन्ग कॉल और शॉर्ट पुट मिलकर ठीक एक पे-फिक्स्ड रिसीव-फ्लोटिंग स्वैप बनाते हैं।";
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
  rawEn.scenes[9].beats[0].text = "Why does combining a long position in an interest rate cap with a short position in an interest rate floor replicate a swap?";
  rawEn.scenes[9].beats[0].dialogue = "Why does combining a long position in an interest rate cap with a short position in an interest rate floor replicate a swap?";
  rawEn.scenes[9].beats[0].ui_state.question = quizQ;
  rawEn.scenes[9].beats[0].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQ;
    rawEn.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[1].text = "Pause and consider how put-call parity enforces identical cash flows between option combinations and swap legs.";
  rawEn.scenes[9].beats[1].dialogue = "Pause and consider how put-call parity enforces identical cash flows between option combinations and swap legs.";
  rawEn.scenes[9].beats[1].ui_state.question = quizQ;
  rawEn.scenes[9].beats[1].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawEn.scenes[9].beats[1].visual?.data) {
    rawEn.scenes[9].beats[1].visual.data.question = quizQ;
    rawEn.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[2].text = "Correct answer is A: Put-call parity dictates that long caplet calls plus short floorlet puts precisely match swap payment obligations.";
  rawEn.scenes[9].beats[2].dialogue = "Correct answer is A: Put-call parity dictates that long caplet calls plus short floorlet puts precisely match swap payment obligations.";
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
  rawHindi.scenes[10].beats[0].text = "Sharma ji, swaptions trading desk par negative interest rates aane se kya mushkil paida hui thi?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, स्वैपशन्स ट्रेडिंग डेस्क पर नेगेटिव इंटरेस्ट रेट्स आने से क्या मुश्किल पैदा हुई थी?";
  rawHindi.scenes[10].beats[1].text = "Raju, standard Black model lognormal rates assume karta hai, isliye negative rates aane par Bachelier normal model use karna pada!";
  rawHindi.scenes[10].beats[1].hindi_tts = "राजू, स्टैंडर्ड ब्लैक मॉडल लॉगनॉर्मल रेट्स मानता है, इसलिए नेगेटिव रेट्स आने पर बैचेलियर नॉर्मल मॉडल इस्तेमाल करना पड़ा!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, how did European negative interest rates disrupt standard lognormal Black swaption models?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, how did European negative interest rates disrupt standard lognormal Black swaption models?";
  rawEn.scenes[10].beats[1].text = "Raju, because lognormal models cannot accept negative rates, quantitative desks transitioned to Bachelier normal models!";
  rawEn.scenes[10].beats[1].dialogue = "Raju, because lognormal models cannot accept negative rates, quantitative desks transitioned to Bachelier normal models!";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Interest Rate Options aur Swaptions ke aath mukhya siddhanton ko dohraayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए इंटरेस्ट रेट ऑप्शंस और स्वैपशन्स के आठ मुख्य सिद्धांतों को दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: Callable bonds me issuer ke paas option hota hai aur bond options dirty cash price par value hote hain.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: कॉलेबल बॉन्ड्स में जारीकर्ता के पास ऑप्शन होता है और बॉन्ड ऑप्शंस डर्टी कैश प्राइस पर वैल्यू होते हैं।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: Caps caplets ke portfolio hote hain jo borrowers ko badhti ब्याज दरों se bachate hain.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: कैप्स कैपलेट्स के पोर्टफोलियो होते हैं जो उधारकर्ताओं को बढ़ती ब्याज दरों से बचाते हैं।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: Floors floorlets ke portfolio hote hain jo lenders ko minimum yield guarantee karte hain.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: फ्लोर्स फ्लोरलेट्स के पोर्टफोलियो होते हैं जो लेंडर्स को मिनिमम यील्ड गारंटी करते हैं।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: Cap minus floor ek swap banata hai aur payer swaption pay-fixed right deta hai.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: कैप माइनस फ्लोर एक स्वैप बनाता है और पेयर स्वैपशन पे-फिक्स्ड राइट देता है।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam fixed income aur interest rate derivatives ke sabse mahatvapoorna aadhar hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम फिक्स्ड इनकम और इंटरेस्ट रेट डेरिवेटिव्स के सबसे महत्वपूर्ण आधार हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of interest rate options and swaptions.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of interest rate options and swaptions.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: Callable bonds contain embedded issuer rights, and bond options evaluate dirty forward prices.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: Callable bonds contain embedded issuer rights, and bond options evaluate dirty forward prices.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: Caps consist of caplet call portfolios protecting floating-rate borrowers against yield spikes.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: Caps consist of caplet call portfolios protecting floating-rate borrowers against yield spikes.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Floors consist of floorlet put portfolios guaranteeing a minimum return to floating lenders.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Floors consist of floorlet put portfolios guaranteeing a minimum return to floating lenders.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: Cap minus floor replicates an interest rate swap, and swaptions provide flexible fixed-floating options.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: Cap minus floor replicates an interest rate swap, and swaptions provide flexible fixed-floating options.";
  rawEn.scenes[11].beats[5].text = "These eight rules underpin institutional fixed-income risk management and balance-sheet immunization.";
  rawEn.scenes[11].beats[5].dialogue = "These eight rules underpin institutional fixed-income risk management and balance-sheet immunization.";

  // Save raw episodes
  const outHindi = path.join(hindiDir, "episode_raw.json");
  const outEnglish = path.join(englishDir, "episode_raw.json");
  fs.writeFileSync(outHindi, JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(outEnglish, JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English ch21_part1!");

  // Validate
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");
}

main().catch(console.error);

