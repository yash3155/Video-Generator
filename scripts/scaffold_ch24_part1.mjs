import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch24_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch24_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Weather, Energy, & Insurance Derivatives",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Weather, Energy, & Insurance Derivatives",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: Non-Storable Risks & Incomplete Markets";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, mausam aur bijli ke derivatives ko hum standard Black-Scholes formula se price kyu nahi kar sakte?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, मौसम और बिजली के डेरिवेटिव्स को हम स्टैंडर्ड ब्लैक-शोल्स फॉर्मूले से प्राइस क्यों नहीं कर सकते?";
  rawHindi.scenes[0].beats[1].text = "Raju, तापमान ya bijli ko warehouse me store nahi kiya ja sakta, isliye cash-and-carry arbitrage fail ho jata hai!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, तापमान या बिजली को वेयरहाउस में स्टोर नहीं किया जा सकता, इसलिए कैश-एंड-कैरी आर्बिट्राज फेल हो जाता है!";

  rawEn.scenes[0].title = "Origins: Non-Storable Risks & Incomplete Markets";
  rawEn.scenes[0].beats[0].text = "Sharma ji, why does standard Black-Scholes no-arbitrage pricing break down for weather and electricity derivatives?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, why does standard Black-Scholes no-arbitrage pricing break down for weather and electricity derivatives?";
  rawEn.scenes[0].beats[1].text = "Raju, temperatures and electrical power cannot be stored in warehouses, invalidating continuous delta-hedging arbitrage.";
  rawEn.scenes[0].beats[1].dialogue = "Raju, temperatures and electrical power cannot be stored in warehouses, invalidating continuous delta-hedging arbitrage.";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "Storable Financial Assets vs Non-Storable Energy & Weather";
  rawHindi.scenes[1].beats[0].text = "Storable assets me arbitrage pricing chalti hai, jabki weather aur electricity me actuarial pricing aur burn analysis lagta hai.";
  rawHindi.scenes[1].beats[0].hindi_tts = "स्टोरेबल एसेट्स में आर्बिट्राज प्राइसिंग चलती है, जबकि वेदर और इलेक्ट्रिसिटी में एक्चुरियल प्राइसिंग और बर्न एनालिसिस लगता है।";

  rawEn.scenes[1].title = "Storable Financial Assets vs Non-Storable Energy & Weather";
  rawEn.scenes[1].beats[0].text = "While storable assets enforce exact no-arbitrage bounds, non-storable weather and power rely on historical actuarial burn analysis.";
  rawEn.scenes[1].beats[0].dialogue = "While storable assets enforce exact no-arbitrage bounds, non-storable weather and power rely on historical actuarial burn analysis.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Weather Indices", body: "Cumulative Heating Degree Days (HDD) and Cooling Degree Days (CDD) temperature options." },
    { title: "2. Electricity Dynamics", body: "Instantaneous grid balancing, non-storability, violent price spikes, and negative spot rates." },
    { title: "3. Mean Reversion", body: "Energy price drift dS = a(L - S)dt returning spot to long-run marginal extraction costs." },
    { title: "4. Catastrophe Bonds", body: "SPVs transferring hurricane and earthquake tail risk from insurers directly to capital markets." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Alternative Risk Transfer";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: weather indices, electricity dynamics, mean reversion, aur catastrophe bonds.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: वेदर इंडिसेस, इलेक्ट्रिसिटी डायनेमिक्स, मीन रिवर्जन, और कैटास्ट्रॉफी बॉन्ड्स।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Alternative Risk Transfer";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We master four foundational pillars: weather indices, electricity spot dynamics, mean-reverting energy pricing, and CAT bonds.";
  rawEn.scenes[2].beats[0].dialogue = "We master four foundational pillars: weather indices, electricity spot dynamics, mean-reverting energy pricing, and CAT bonds.";

  // Scene 3: Comparison - HDD vs CDD
  const leftHDD = {
    title: "Heating Degree Days (HDD)",
    items: [
      "Formula: HDD = max(0, 65 - A) where A is daily mean temperature",
      "Measures winter heating demand for gas and heating oil utilities",
      "Traded heavily during November to March winter contracts"
    ]
  };
  const rightCDD = {
    title: "Cooling Degree Days (CDD)",
    items: [
      "Formula: CDD = max(0, A - 65) where A is daily mean temperature",
      "Measures summer air-conditioning load for electric power utilities",
      "Traded heavily during May to September summer contracts"
    ]
  };
  rawHindi.scenes[3].title = "Heating Degree Days (HDD) vs Cooling Degree Days (CDD)";
  rawHindi.scenes[3].beats[0].ui_state.left = leftHDD;
  rawHindi.scenes[3].beats[0].ui_state.right = rightCDD;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftHDD;
    rawHindi.scenes[3].beats[0].visual.data.right = rightCDD;
  }
  rawHindi.scenes[3].beats[0].text = "सर्दियों में गैस की खपत नापने के लिए हीटिंग डिग्री डेज और गर्मियों में एसी बिजली नापने के लिए कूलिंग डिग्री डेज का उपयोग होता है।";
  rawHindi.scenes[3].beats[0].hindi_tts = "सर्दियों में गैस की खपत नापने के लिए हीटिंग डिग्री डेज और गर्मियों में एसी बिजली नापने के लिए कूलिंग डिग्री डेज का उपयोग होता है।";

  rawEn.scenes[3].title = "Heating Degree Days (HDD) vs Cooling Degree Days (CDD)";
  rawEn.scenes[3].beats[0].ui_state.left = leftHDD;
  rawEn.scenes[3].beats[0].ui_state.right = rightCDD;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftHDD;
    rawEn.scenes[3].beats[0].visual.data.right = rightCDD;
  }
  rawEn.scenes[3].beats[0].text = "Heating Degree Days quantify winter heating demand below 65°F, while Cooling Degree Days track summer air-conditioning electricity loads.";
  rawEn.scenes[3].beats[0].dialogue = "Heating Degree Days quantify winter heating demand below 65°F, while Cooling Degree Days track summer air-conditioning electricity loads.";

  // Scene 4: Formula Breakdown - Mean Reversion
  rawHindi.scenes[4].title = "Mean-Reverting Spot Dynamics in Energy Markets";
  rawHindi.scenes[4].beats[0].text = "एनर्जी बाजारों में स्पॉट प्राइस हमेशा लॉन्ग-रन मार्जिनल प्रोडक्शन कॉस्ट एल की ओर वापस खिंचती है।";
  rawHindi.scenes[4].beats[0].hindi_tts = "एनर्जी बाजारों में स्पॉट प्राइस हमेशा लॉन्ग-रन मार्जिनल प्रोडक्शन कॉस्ट एल की ओर वापस खिंचती है।";

  rawEn.scenes[4].title = "Mean-Reverting Spot Dynamics in Energy Markets";
  rawEn.scenes[4].beats[0].text = "In energy commodities, supply responses force spot prices back toward the long-run marginal cost of production through mean reversion.";
  rawEn.scenes[4].beats[0].dialogue = "In energy commodities, supply responses force spot prices back toward the long-run marginal cost of production through mean reversion.";

  // Scene 5: Case Study - Electricity Grid Volatility
  rawHindi.scenes[5].title = "Electricity Grid Bottlenecks & Extreme Price Spikes";
  rawHindi.scenes[5].beats[0].text = "बिजली को भारी मात्रा में स्टोर न कर पाने के कारण ट्रांसमिशन बाधाओं के दौरान कीमतें 30 डॉलर से उछलकर 7000 डॉलर तक पहुंच जाती हैं।";
  rawHindi.scenes[5].beats[0].hindi_tts = "बिजली को भारी मात्रा में स्टोर न कर पाने के कारण ट्रांसमिशन बाधाओं के दौरान कीमतें 30 डॉलर से उछलकर 7000 डॉलर तक पहुंच जाती हैं।";

  rawEn.scenes[5].title = "Electricity Grid Bottlenecks & Extreme Price Spikes";
  rawEn.scenes[5].beats[0].text = "Because electrical grids require instant physical balancing, transmission bottlenecks produce extreme price spikes from $30 to $7,000 per megawatt-hour.";
  rawEn.scenes[5].beats[0].dialogue = "Because electrical grids require instant physical balancing, transmission bottlenecks produce extreme price spikes from $30 to $7,000 per megawatt-hour.";

  // Scene 6: Split Comparison - BSM vs Burn Analysis
  const leftBSM = {
    title: "Black-Scholes Arbitrage",
    items: [
      "Assumes asset can be held and traded costlessly in cash-and-carry",
      "Dynamic delta replication perfectly eliminates market risk",
      "Fails entirely for non-storable temperature, wind, and electricity"
    ]
  };
  const rightBurn = {
    title: "Historical Burn Analysis",
    items: [
      "Simulates option payouts over 20-30 historical weather seasons",
      "Adjusts for global warming trends and urban heat island expansions",
      "Adds actuarial risk loading for unhedgeable market temperature variance"
    ]
  };
  rawHindi.scenes[6].title = "Black-Scholes Arbitrage vs Historical Burn Analysis";
  rawHindi.scenes[6].beats[0].ui_state.left = leftBSM;
  rawHindi.scenes[6].beats[0].ui_state.right = rightBurn;
  if (rawHindi.scenes[6].beats[0].visual?.data) {
    rawHindi.scenes[6].beats[0].visual.data.left = leftBSM;
    rawHindi.scenes[6].beats[0].visual.data.right = rightBurn;
  }
  rawHindi.scenes[6].beats[0].text = "नॉन-स्टोरेबल वेदर कांट्रैक्ट्स में ब्लैक-शोल्स की जगह 30 साल के हिस्टोरिकल बर्न एनालिसिस और रिस्क प्रीमियम लोडिंग से प्राइसिंग होती है।";
  rawHindi.scenes[6].beats[0].hindi_tts = "नॉन-स्टोरेबल वेदर कांट्रैक्ट्स में ब्लैक-शोल्स की जगह 30 साल के हिस्टोरिकल बर्न एनालिसिस और रिस्क प्रीमियम लोडिंग से प्राइसिंग होती है।";

  rawEn.scenes[6].title = "Black-Scholes Arbitrage vs Historical Burn Analysis";
  rawEn.scenes[6].beats[0].ui_state.left = leftBSM;
  rawEn.scenes[6].beats[0].ui_state.right = rightBurn;
  if (rawEn.scenes[6].beats[0].visual?.data) {
    rawEn.scenes[6].beats[0].visual.data.left = leftBSM;
    rawEn.scenes[6].beats[0].visual.data.right = rightBurn;
  }
  rawEn.scenes[6].beats[0].text = "While Black-Scholes fails without storable inventory, historical burn analysis prices weather options using 30-year trend-adjusted distributions.";
  rawEn.scenes[6].beats[0].dialogue = "While Black-Scholes fails without storable inventory, historical burn analysis prices weather options using 30-year trend-adjusted distributions.";

  // Scene 7: Progressive Cards - Hull Section 24.2
  const weatherCards = [
    { title: "Expected Payout: $250,000", body: "30-year historical average payout of 25 CDDs above strike at $10,000 per degree-day." },
    { title: "Risk Premium: 10% ($25,000)", body: "Actuarial loading compensating the seller for bearing unhedgeable non-diversifiable weather risk." },
    { title: "Equilibrium Price: $275,000", body: "Market clearing option premium reflecting expected burn plus capital risk charge." }
  ];
  rawHindi.scenes[7].title = "Hull Section 24.2: Chicago CDD Call Option Benchmark";
  rawHindi.scenes[7].beats[0].ui_state.cards = weatherCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = weatherCards;
  rawHindi.scenes[7].beats[0].text = "हल के सेक्शन 24.2 में शिकागो सीडीडी कॉल ऑप्शन का 30 साल का एवरेज पेआउट ढाई लाख डॉलर और 10 परसेंट रिस्क प्रीमियम के साथ पौने तीन लाख डॉलर आता है।";
  rawHindi.scenes[7].beats[0].hindi_tts = "हल के सेक्शन 24.2 में शिकागो सीडीडी कॉल ऑप्शन का 30 साल का एवरेज पेआउट ढाई लाख डॉलर और 10 परसेंट रिस्क प्रीमियम के साथ पौने तीन लाख डॉलर आता है।";

  rawEn.scenes[7].title = "Hull Section 24.2: Chicago CDD Call Option Benchmark";
  rawEn.scenes[7].beats[0].ui_state.cards = weatherCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = weatherCards;
  rawEn.scenes[7].beats[0].text = "In Hull Section 24.2, a Chicago summer CDD call averages $250,000 in historical payouts, trading at $275,000 after a 10% risk margin.";
  rawEn.scenes[7].beats[0].dialogue = "In Hull Section 24.2, a Chicago summer CDD call averages $250,000 in historical payouts, trading at $275,000 after a 10% risk margin.";

  // Scene 8: Formula Breakdown - CAT Bond Structure
  rawHindi.scenes[8].title = "Catastrophe (CAT) Bond Special Purpose Vehicle (SPV) Mechanics";
  rawHindi.scenes[8].beats[0].text = "कैटास्ट्रॉफी बॉन्ड्स में एसपीवी इंश्योरेंस कंपनी से रिस्क लेकर निवेशकों को ट्रेजरी यील्ड प्लस हाई कूपन देती है, जो आपदा आने पर फॉरफीट हो जाता है।";
  rawHindi.scenes[8].beats[0].hindi_tts = "कैटास्ट्रॉफी बॉन्ड्स में एसपीवी इंश्योरेंस कंपनी से रिस्क लेकर निवेशकों को ट्रेजरी यील्ड प्लस हाई कूपन देती है, जो आपदा आने पर फॉरफीट हो जाता है।";

  rawEn.scenes[8].title = "Catastrophe (CAT) Bond Special Purpose Vehicle (SPV) Mechanics";
  rawEn.scenes[8].beats[0].text = "CAT bonds route hurricane risks through collateralized SPVs, paying investors rich coupons that are forfeited if disaster triggers trip.";
  rawEn.scenes[8].beats[0].dialogue = "CAT bonds route hurricane risks through collateralized SPVs, paying investors rich coupons that are forfeited if disaster triggers trip.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "If an electric utility seeks to hedge against a severe summer heatwave causing power demand surges while bulk electricity cannot be stored, which derivative structure best isolates this temperature risk?";
  const quizOpts = [
    "A: Cumulative Cooling Degree Day (CDD) call options or temperature swing options settled against weather station indices",
    "B: Standard physical delivery forward contracts on stored kilowatt-hours in corporate battery warehouses",
    "C: Black-Scholes equity index put options because electricity demand is perfectly correlated with stock market returns",
    "D: Credit default swaps on local residential consumers to offset unpaid utility bills during peak summer"
  ];
  const quizAns = "A: Cumulative Cooling Degree Day (CDD) call options or temperature swing options settled against weather station indices";

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
  rawHindi.scenes[9].beats[0].text = "सोचिए कि यदि एक बिजली कंपनी अत्यधिक गर्मी में एसी की मांग बढ़ने से होने वाले नुकसान से बचना चाहती है, तो कौन सा डेरिवेटिव सबसे उपयुक्त होगा?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि यदि एक बिजली कंपनी अत्यधिक गर्मी में एसी की मांग बढ़ने से होने वाले नुकसान से बचना चाहती है, तो कौन सा डेरिवेटिव सबसे उपयुक्त होगा?";
  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या बिजली को स्टोर किया जा सकता है या मौसम इंडेक्स पर सेटल होने वाला कॉल ऑप्शन ही सटीक सुरक्षा देगा।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या बिजली को स्टोर किया जा सकता है या मौसम इंडेक्स पर सेटल होने वाला कॉल ऑप्शन ही सटीक सुरक्षा देगा।";
  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। कूलिंग डिग्री डेज कॉल ऑप्शन तापमान के 65 डिग्री से ऊपर बढ़ने पर कैश पेआउट देकर पावर जनरेशन लागत को हेज करता है।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। कूलिंग डिग्री डेज कॉल ऑप्शन तापमान के 65 डिग्री से ऊपर बढ़ने पर कैश पेआउट देकर पावर जनरेशन लागत को हेज करता है।";

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
  rawEn.scenes[9].beats[0].text = "Consider an electric utility managing volumetric cash flow risk from extreme summer heat waves where power storage is impossible.";
  rawEn.scenes[9].beats[0].dialogue = "Consider an electric utility managing volumetric cash flow risk from extreme summer heat waves where power storage is impossible.";
  rawEn.scenes[9].beats[1].text = "Evaluate why weather derivatives linked to cumulative Cooling Degree Days offer direct protection without basis mismatch.";
  rawEn.scenes[9].beats[1].dialogue = "Evaluate why weather derivatives linked to cumulative Cooling Degree Days offer direct protection without basis mismatch.";
  rawEn.scenes[9].beats[2].text = "The correct answer is A. Cumulative CDD call options pay cash proportionate to temperature spikes above 65°F, offsetting generation costs.";
  rawEn.scenes[9].beats[2].dialogue = "The correct answer is A. Cumulative CDD call options pay cash proportionate to temperature spikes above 65°F, offsetting generation costs.";

  // Scene 10: Chat Story
  rawHindi.scenes[10].title = "Trading Desk Execution Rules";
  rawHindi.scenes[10].beats[0].text = "Sharma ji, mausam aur CAT bonds ko portfolio me add karne se diversification ka kya fayda hota hai?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, मौसम और कैट बॉन्ड्स को पोर्टफोलियो में जोड़ने से डाइवर्सिफिकेशन का क्या फायदा होता है?";
  rawHindi.scenes[10].beats[1].text = "Raju, प्राकृतिक आपदाएं शेयर बाजार के क्रैश या ब्याज दरों से बिल्कुल असंबद्ध होती हैं, इसलिए इनमें जीरो बीटा होता है!";
  rawHindi.scenes[10].beats[1].hindi_tts = "राजू, प्राकृतिक आपदाएं शेयर बाजार के क्रैश या ब्याज दरों से बिल्कुल असंबद्ध होती हैं, इसलिए इनमें जीरो बीटा होता है!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, why do institutional asset allocators actively buy catastrophe bonds despite total principal risk?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, why do institutional asset allocators actively buy catastrophe bonds despite total principal risk?";
  rawEn.scenes[10].beats[1].text = "Raju, weather and earthquake disasters exhibit near-zero correlation with macroeconomic cycles, providing pure non-beta alpha.";
  rawEn.scenes[10].beats[1].dialogue = "Raju, weather and earthquake disasters exhibit near-zero correlation with macroeconomic cycles, providing pure non-beta alpha.";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Alternative Derivatives ke aath mukhya siddhanton ko dohraayein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए अल्टरनेटिव डेरिवेटिव्स के आठ मुख्य सिद्धांतों को दोहराएं।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: Weather aur electricity non-storable hain, isliye BSM no-arbitrage replication yahan fail ho jata hai.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: वेदर और इलेक्ट्रिसिटी नॉन-स्टोरेबल हैं, इसलिए ब्लैक-शोल्स नो-आर्बिट्राज रेप्लिकेशन यहां फेल हो जाता है।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: HDD aur CDD 65 degree Fahrenheit reference temperature par cumulative degree days calculate karte hain.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: हीटिंग और कूलिंग डिग्री डेज पैंसठ डिग्री फॉरेनहाइट के आधार पर क्युमुलेटिव डिग्री डेज नापते हैं।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: Bijli me real-time transmission bottlenecks ke karan violent price spikes aate hain.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: बिजली में रियल-टाइम ट्रांसमिशन बाधाओं के कारण अत्यधिक प्राइस स्पाइक्स आते हैं।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: CAT bonds uncorrelated yield dete hain aur natural gas storage ek American swing option hai.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: कैट बॉन्ड्स अनकोरिलेटेड यील्ड देते हैं और नेचुरल गैस स्टोरेज एक अमेरिकन स्विंग ऑप्शन है।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam alternative risk management aur energy trading ke buniyadi sutra hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम अल्टरनेटिव रिस्क मैनेजमेंट और एनर्जी ट्रेडिंग के बुनियादी सूत्र हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of alternative risk transfer and energy derivatives.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of alternative risk transfer and energy derivatives.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: Non-storability breaks cash-and-carry arbitrage, requiring actuarial burn analysis.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: Non-storability breaks cash-and-carry arbitrage, requiring actuarial burn analysis.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: HDD and CDD measure cumulative temperature deviations against a 65°F baseline.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: HDD and CDD measure cumulative temperature deviations against a 65°F baseline.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Power grid transmission bottlenecks produce violent price spikes and mean reversion.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Power grid transmission bottlenecks produce violent price spikes and mean reversion.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: CAT bonds provide zero-beta diversification, while gas storage behaves as an American swing option.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: CAT bonds provide zero-beta diversification, while gas storage behaves as an American swing option.";
  rawEn.scenes[11].beats[5].text = "These eight principles form the core foundation of alternative and weather derivatives.";
  rawEn.scenes[11].beats[5].dialogue = "These eight principles form the core foundation of alternative and weather derivatives.";

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
  console.log("Successfully wrote episode_raw.json for Hindi and English ch24_part1!");

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
