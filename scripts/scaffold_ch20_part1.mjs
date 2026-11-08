import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

async function main() {
  const chapterSlug = "ch20_part1";
  const hindiDir = path.resolve(`src/data/chapters/hull_derivatives/${chapterSlug}`);
  const englishDir = path.resolve(`src/data/chapters/hull_derivatives_en/${chapterSlug}`);

  const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
  const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/hull_derivatives.json", "utf8"));
  const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/hull_derivatives_en.json", "utf8"));

  console.log("Scaffolding 12-scene episodes for ch20_part1 (0 tokens)...");
  const rawHindi = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives",
    chapterTitle: "Value at Risk & Expected Shortfall",
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: chapterSlug,
    courseSlug: "hull_derivatives_en",
    chapterTitle: "Value at Risk & Expected Shortfall",
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Scene 0: Chat Story
  rawHindi.scenes[0].title = "Origins: Defining Market Loss & Confidence Limits";
  rawHindi.scenes[0].beats[0].text = "Sharma ji, Value at Risk ka seedha matlab kya hota hai aur bank ise regulatory capital ke liye kyu use karte hain?";
  rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, वैल्यू एट रिस्क का सीधा मतलब क्या होता है और बैंक इसे रेगुलेटरी कैपिटल के लिए क्यों इस्तेमाल करते हैं?";
  rawHindi.scenes[0].beats[1].text = "Raju, VaR ek single number me batata hai ki ek nishchit confidence level par hamara nuksan kitne dollar se zyada nahi hoga!";
  rawHindi.scenes[0].beats[1].hindi_tts = "राजू, वार एक सिंगल नंबर में बताता है कि एक निश्चित कॉन्फिडेंस लेवल पर हमारा नुकसान कितने डॉलर से ज्यादा नहीं होगा!";

  rawEn.scenes[0].title = "Origins: Defining Market Loss & Confidence Limits";
  rawEn.scenes[0].beats[0].text = "Sharma ji, what is the precise definition of Value at Risk and why did global banks standardize on it?";
  rawEn.scenes[0].beats[0].dialogue = "Sharma ji, what is the precise definition of Value at Risk and why did global banks standardize on it?";
  rawEn.scenes[0].beats[1].text = "Raju, VaR summarizes maximum expected portfolio loss at a given confidence level over a specific holding period.";
  rawEn.scenes[0].beats[1].dialogue = "Raju, VaR summarizes maximum expected portfolio loss at a given confidence level over a specific holding period.";

  // Scene 1: Tug of War
  rawHindi.scenes[1].title = "VaR vs Expected Shortfall: Subadditivity & Coherence";
  rawHindi.scenes[1].beats[0].text = "VaR subadditivity ko todta hai, jabki Expected Shortfall ek coherent metric hai jo tail risk ko poori tarah capture karta hai.";
  rawHindi.scenes[1].beats[0].hindi_tts = "वार सब-एडिटिविटी नियम को तोड़ता है, जबकि एक्सपेक्टेड शॉर्टफॉल एक कोहेरेंट मेट्रिक है जो टेल रिस्क को पूरी तरह मापता है।";

  rawEn.scenes[1].title = "VaR vs Expected Shortfall: Subadditivity & Coherence";
  rawEn.scenes[1].beats[0].text = "While VaR violates subadditivity and ignores tail severity, Expected Shortfall is a coherent metric that integrates the entire tail loss.";
  rawEn.scenes[1].beats[0].dialogue = "While VaR violates subadditivity and ignores tail severity, Expected Shortfall is a coherent metric that integrates the entire tail loss.";

  // Scene 2: 4 Pillars
  const pillars = [
    { title: "1. Value at Risk (VaR)", body: "Dollar loss threshold not exceeded with X% confidence over N days." },
    { title: "2. Expected Shortfall (ES)", body: "Average severity of losses conditional on breaching the VaR threshold." },
    { title: "3. Historical Simulation", body: "Non-parametric valuation applying past 500 trading day market shocks." },
    { title: "4. Volatility Updating", body: "Hull-White scaling adjusting historical moves to current market volatility." }
  ];
  rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Market Risk Measurement";
  rawHindi.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = pillars;
  rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya vishayo par charcha karenge: VaR ki paribhasha, Expected Shortfall, historical simulation, aur volatility updating.";
  rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य विषयों पर चर्चा करेंगे: वार की परिभाषा, एक्सपेक्टेड शॉर्टफॉल, हिस्टोरिकल सिमुलेशन, और वोलैटिलिटी अपडेटिंग।";

  rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Market Risk Measurement";
  rawEn.scenes[2].beats[0].ui_state.cards = pillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = pillars;
  rawEn.scenes[2].beats[0].text = "We explore four foundational pillars: VaR thresholds, Expected Shortfall coherence, historical simulation, and volatility updating.";
  rawEn.scenes[2].beats[0].dialogue = "We explore four foundational pillars: VaR thresholds, Expected Shortfall coherence, historical simulation, and volatility updating.";

  // Scene 3: Comparison - VaR vs ES
  const leftVaR = {
    title: "Value at Risk (VaR)",
    items: [
      "Only identifies the loss cutoff boundary",
      "Completely blind to the magnitude of catastrophic tail losses",
      "Fails subadditivity: VaR(A+B) can exceed VaR(A) + VaR(B)"
    ]
  };
  const rightES = {
    title: "Expected Shortfall (ES / CVaR)",
    items: [
      "Calculates the conditional expected loss beyond the cutoff",
      "Directly measures catastrophic tail events and black swans",
      "Satisfies subadditivity: always rewards portfolio diversification"
    ]
  };
  rawHindi.scenes[3].title = "Value at Risk vs Expected Shortfall Architecture";
  rawHindi.scenes[3].beats[0].ui_state.left = leftVaR;
  rawHindi.scenes[3].beats[0].ui_state.right = rightES;
  if (rawHindi.scenes[3].beats[0].visual?.data) {
    rawHindi.scenes[3].beats[0].visual.data.left = leftVaR;
    rawHindi.scenes[3].beats[0].visual.data.right = rightES;
  }
  rawHindi.scenes[3].beats[0].text = "VaR sirf cutoff point dekhta hai aur tail losses ko ignore karta hai, jabki Expected Shortfall tail ke andar hone wale ausat nuksan ko mapta hai.";
  rawHindi.scenes[3].beats[0].hindi_tts = "वार सिर्फ कटऑफ पॉइंट देखता है और टेल लॉसेस को नजरअंदाज करता है, जबकि एक्सपेक्टेड शॉर्टफॉल टेल के अंदर होने वाले औसत नुकसान को मापता है।";

  rawEn.scenes[3].title = "Value at Risk vs Expected Shortfall Architecture";
  rawEn.scenes[3].beats[0].ui_state.left = leftVaR;
  rawEn.scenes[3].beats[0].ui_state.right = rightES;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftVaR;
    rawEn.scenes[3].beats[0].visual.data.right = rightES;
  }
  rawEn.scenes[3].beats[0].text = "VaR is blind to losses beyond the cutoff threshold, whereas Expected Shortfall directly measures the expected severity of tail breaches.";
  rawEn.scenes[3].beats[0].dialogue = "VaR is blind to losses beyond the cutoff threshold, whereas Expected Shortfall directly measures the expected severity of tail breaches.";

  // Scene 4: Formula Breakdown - Expected Shortfall
  rawHindi.scenes[4].title = "Expected Shortfall Integrated Tail Expectation Formula";
  rawHindi.scenes[4].beats[0].text = "एक्सपेक्टेड शॉर्टफॉल फॉर्मूला वार थ्रेशोल्ड से आगे के सभी लॉसेस का इंटीग्रल लेकर कंडीशनल एक्सपेक्टेशन निकालता है।";
  rawHindi.scenes[4].beats[0].hindi_tts = "एक्सपेक्टेड शॉर्टफॉल फॉर्मूला वार थ्रेशोल्ड से आगे के सभी लॉसेस का इंटीग्रल लेकर कंडीशनल एक्सपेक्टेशन निकालता है।";

  rawEn.scenes[4].title = "Expected Shortfall Integrated Tail Expectation Formula";
  rawEn.scenes[4].beats[0].text = "The Expected Shortfall formula computes the conditional expectation by integrating all losses exceeding the VaR boundary.";
  rawEn.scenes[4].beats[0].dialogue = "The Expected Shortfall formula computes the conditional expectation by integrating all losses exceeding the VaR boundary.";

  // Scene 5: Case Study - Snapshot 20.1 Basel FRTB Shift
  rawHindi.scenes[5].title = "Business Snapshot 20.1: Basel FRTB Shift from 99% VaR to 97.5% ES";
  rawHindi.scenes[5].beats[0].text = "बासेल कमेटी ने फंडामेंटल रिव्यू ऑफ द ट्रेडिंग बुक में 99 परसेंट वार को हटाकर 97.5 परसेंट एक्सपेक्टेड शॉर्टफॉल लागू किया।";
  rawHindi.scenes[5].beats[0].hindi_tts = "बासेल कमेटी ने फंडामेंटल रिव्यू ऑफ द ट्रेडिंग बुक में 99 परसेंट वार को हटाकर 97.5 परसेंट एक्सपेक्टेड शॉर्टफॉल लागू किया।";

  rawEn.scenes[5].title = "Business Snapshot 20.1: Basel FRTB Shift from 99% VaR to 97.5% ES";
  rawEn.scenes[5].beats[0].text = "In Business Snapshot 20.1, the Basel Committee transitioned market risk capital from 99% VaR to 97.5% Expected Shortfall to capture tail risk.";
  rawEn.scenes[5].beats[0].dialogue = "In Business Snapshot 20.1, the Basel Committee transitioned market risk capital from 99% VaR to 97.5% Expected Shortfall to capture tail risk.";

  // Scene 6: Split Comparison - Time Scaling
  rawHindi.scenes[6].title = "Square-Root-of-Time Rule vs Volatility Clustering";
  rawHindi.scenes[6].beats[0].text = "स्क्वायर रूट ऑफ टाइम नियम तभी सही रहता है जब रिटर्न्स नॉर्मल और इंडिपेंडेंट हों, लेकिन असल बाजारों में वोलैटिलिटी क्लस्टरिंग होती है।";
  rawHindi.scenes[6].beats[0].hindi_tts = "स्क्वायर रूट ऑफ टाइम नियम तभी सही रहता है जब रिटर्न्स नॉर्मल और इंडिपेंडेंट हों, लेकिन असल बाजारों में वोलैटिलिटी क्लस्टरिंग होती है।";

  rawEn.scenes[6].title = "Square-Root-of-Time Rule vs Volatility Clustering";
  rawEn.scenes[6].beats[0].text = "The square-root-of-time rule assumes i.i.d. returns, underestimating multi-day risk when volatility clustering and serial autocorrelation exist.";
  rawEn.scenes[6].beats[0].dialogue = "The square-root-of-time rule assumes i.i.d. returns, underestimating multi-day risk when volatility clustering and serial autocorrelation exist.";

  // Scene 7: Progressive Cards - Hull Table 20.1
  const simCards = [
    { title: "500 Historical Days", body: "Portfolio of $10M equity + $5M forex simulated under 500 daily market percentage moves." },
    { title: "99% 1-Day VaR: $253,385", body: "The 5th worst sorted loss establishes the 99% confidence dollar boundary." },
    { title: "99% 1-Day ES: $282,204", body: "Average of the 5 worst losses ($253k, $260k, $275k, $301k, $321k) reflects tail severity." }
  ];
  rawHindi.scenes[7].title = "Hull Table 20.1: 500-Day Historical Simulation in Action";
  rawHindi.scenes[7].beats[0].ui_state.cards = simCards;
  if (rawHindi.scenes[7].beats[0].visual?.data) rawHindi.scenes[7].beats[0].visual.data.cards = simCards;
  rawHindi.scenes[7].beats[0].text = "जॉन हल के टेबल 20.1 में 500 ऐतिहासिक दिनों के आधार पर 1-डे 99 परसेंट वार 253,385 डॉलर और एक्सपेक्टेड शॉर्टफॉल 282,204 डॉलर निकला।";
  rawHindi.scenes[7].beats[0].hindi_tts = "जॉन हल के टेबल 20.1 में 500 ऐतिहासिक दिनों के आधार पर 1-डे 99 परसेंट वार 253,385 डॉलर और एक्सपेक्टेड शॉर्टफॉल 282,204 डॉलर निकला।";

  rawEn.scenes[7].title = "Hull Table 20.1: 500-Day Historical Simulation in Action";
  rawEn.scenes[7].beats[0].ui_state.cards = simCards;
  if (rawEn.scenes[7].beats[0].visual?.data) rawEn.scenes[7].beats[0].visual.data.cards = simCards;
  rawEn.scenes[7].beats[0].text = "In Hull Table 20.1, a 500-day simulation yields a 99% 1-day VaR of $253,385 and an Expected Shortfall of $282,204 across the worst 5 scenarios.";
  rawEn.scenes[7].beats[0].dialogue = "In Hull Table 20.1, a 500-day simulation yields a 99% 1-day VaR of $253,385 and an Expected Shortfall of $282,204 across the worst 5 scenarios.";

  // Scene 8: Formula Breakdown - Volatility Updating
  rawHindi.scenes[8].title = "Hull-White Volatility-Updating Historical Return Adjustment";
  rawHindi.scenes[8].beats[0].text = "हल-व्हाइट वोलैटिलिटी अपडेटिंग विधि में ऐतिहासिक रिटर्न्स को करेंट वोलैटिलिटी और पास्ट वोलैटिलिटी के अनुपात से स्केल किया जाता है।";
  rawHindi.scenes[8].beats[0].hindi_tts = "हल-व्हाइट वोलैटिलिटी अपडेटिंग विधि में ऐतिहासिक रिटर्न्स को करेंट वोलैटिलिटी और पास्ट वोलैटिलिटी के अनुपात से स्केल किया जाता है।";

  rawEn.scenes[8].title = "Hull-White Volatility-Updating Historical Return Adjustment";
  rawEn.scenes[8].beats[0].text = "The Hull-White approach scales historical percentage changes by the ratio of current volatility to historical volatility on that date.";
  rawEn.scenes[8].beats[0].dialogue = "The Hull-White approach scales historical percentage changes by the ratio of current volatility to historical volatility on that date.";

  // Scene 9: Active Recall Quiz (>= 18 words)
  const quizQ = "Why is Expected Shortfall considered a coherent risk measure under modern risk theory while Value at Risk fails subadditivity?";
  const quizOpts = [
    "A: Expected Shortfall satisfies subadditivity by ensuring portfolio risk never exceeds the sum of individual risks",
    "B: Value at Risk requires historical simulations while Expected Shortfall only uses closed form equations",
    "C: Regulators only allow Expected Shortfall for credit derivatives and ban it for equity portfolios",
    "D: Value at Risk models fail because they cannot calculate percentage returns on foreign exchange rates"
  ];
  const quizAns = "A: Expected Shortfall satisfies subadditivity by ensuring portfolio risk never exceeds the sum of individual risks";

  // Hindi Scene 9
  rawHindi.scenes[9].title = "Active Recall Challenge";
  rawHindi.scenes[9].beats[0].text = "सोचिए कि आधुनिक रिस्क थ्योरी के तहत एक्सपेक्टेड शॉर्टफॉल को कोहेरेंट रिस्क मेट्रिक क्यों माना जाता है जबकि वार सब-एडिटिविटी में फेल हो जाता है?";
  rawHindi.scenes[9].beats[0].hindi_tts = "सोचिए कि आधुनिक रिस्क थ्योरी के तहत एक्सपेक्टेड शॉर्टफॉल को कोहेरेंट रिस्क मेट्रिक क्यों माना जाता है जबकि वार सब-एडिटिविटी में फेल हो जाता है?";
  rawHindi.scenes[9].beats[0].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[0].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawHindi.scenes[9].beats[0].visual?.data) {
    rawHindi.scenes[9].beats[0].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[1].text = "विचार कीजिए कि क्या डाइवर्सिफिकेशन का लाभ पोर्टफोलियो रिस्क को कम करता है।";
  rawHindi.scenes[9].beats[1].hindi_tts = "विचार कीजिए कि क्या डाइवर्सिफिकेशन का लाभ पोर्टफोलियो रिस्क को कम करता है।";
  rawHindi.scenes[9].beats[1].ui_state.question = quizQ;
  rawHindi.scenes[9].beats[1].ui_state.options = quizOpts;
  rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawHindi.scenes[9].beats[1].visual?.data) {
    rawHindi.scenes[9].beats[1].visual.data.question = quizQ;
    rawHindi.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawHindi.scenes[9].beats[2].text = "सही उत्तर ए है। एक्सपेक्टेड शॉर्टफॉल सब-एडिटिविटी का पालन करता है और हमेशा डाइवर्सिफिकेशन को प्रोत्साहित करता है।";
  rawHindi.scenes[9].beats[2].hindi_tts = "सही उत्तर ए है। एक्सपेक्टेड शॉर्टफॉल सब-एडिटिविटी का पालन करता है और हमेशा डाइवर्सिफिकेशन को प्रोत्साहित करता है।";
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
  rawEn.scenes[9].beats[0].text = "Why is Expected Shortfall considered a coherent risk measure under modern risk theory while Value at Risk fails subadditivity?";
  rawEn.scenes[9].beats[0].dialogue = "Why is Expected Shortfall considered a coherent risk measure under modern risk theory while Value at Risk fails subadditivity?";
  rawEn.scenes[9].beats[0].ui_state.question = quizQ;
  rawEn.scenes[9].beats[0].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  if (rawEn.scenes[9].beats[0].visual?.data) {
    rawEn.scenes[9].beats[0].visual.data.question = quizQ;
    rawEn.scenes[9].beats[0].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[1].text = "Pause and consider how subadditivity guarantees that portfolio diversification always reduces total calculated risk.";
  rawEn.scenes[9].beats[1].dialogue = "Pause and consider how subadditivity guarantees that portfolio diversification always reduces total calculated risk.";
  rawEn.scenes[9].beats[1].ui_state.question = quizQ;
  rawEn.scenes[9].beats[1].ui_state.options = quizOpts;
  rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  if (rawEn.scenes[9].beats[1].visual?.data) {
    rawEn.scenes[9].beats[1].visual.data.question = quizQ;
    rawEn.scenes[9].beats[1].visual.data.options = quizOpts;
  }

  rawEn.scenes[9].beats[2].text = "Correct answer is A: Expected Shortfall satisfies subadditivity, guaranteeing that combined portfolio risk never exceeds individual asset risks.";
  rawEn.scenes[9].beats[2].dialogue = "Correct answer is A: Expected Shortfall satisfies subadditivity, guaranteeing that combined portfolio risk never exceeds individual asset risks.";
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
  rawHindi.scenes[10].beats[0].text = "Sharma ji, agar koi trader sirf VaR limit par kaam kare toh kya moral hazard ka khatra paida ho sakta hai?";
  rawHindi.scenes[10].beats[0].hindi_tts = "शर्मा जी, अगर कोई ट्रेडर सिर्फ वार लिमिट पर काम करे तो क्या मोरल हैजार्ड का खतरा पैदा हो सकता है?";
  rawHindi.scenes[10].beats[1].text = "Bilkul Raju, trader deep out-of-the-money puts bechkar premium kama sakta hai, jisse VaR nahi badhta lekin tail risk explosive ho jata hai!";
  rawHindi.scenes[10].beats[1].hindi_tts = "बिल्कुल राजू, ट्रेडर डीप आउट-ऑफ-द-मनी पुट्स बेचकर प्रीमियम कमा सकता है, जिससे वार नहीं बढ़ता लेकिन टेल रिस्क एक्सप्लोसिव हो जाता है!";

  rawEn.scenes[10].title = "Trading Desk Execution Rules";
  rawEn.scenes[10].beats[0].text = "Sharma ji, how does relying solely on VaR limits create trader moral hazard on an institutional desk?";
  rawEn.scenes[10].beats[0].dialogue = "Sharma ji, how does relying solely on VaR limits create trader moral hazard on an institutional desk?";
  rawEn.scenes[10].beats[1].text = "Raju, traders can write deep OTM puts to collect steady premium without breaching 99% VaR, hiding catastrophic blowup risk!";
  rawEn.scenes[10].beats[1].dialogue = "Raju, traders can write deep OTM puts to collect steady premium without breaching 99% VaR, hiding catastrophic blowup risk!";

  // Scene 11: Summary Thread (8 rules)
  rawHindi.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawHindi.scenes[11].beats[0].text = "Aaiye Value at Risk aur Expected Shortfall ke aath mukhya siddhanton ko samjhein.";
  rawHindi.scenes[11].beats[0].hindi_tts = "आइए वैल्यू एट रिस्क और एक्सपेक्टेड शॉर्टफॉल के आठ मुख्य सिद्धांतों को समझें।";
  rawHindi.scenes[11].beats[1].text = "Niyam 1 aur 2: VaR ek cutoff threshold hai jabki Expected Shortfall tail ke andar hone wale ausat nuksan ko mapta hai.";
  rawHindi.scenes[11].beats[1].hindi_tts = "नियम एक और दो: वार एक कटऑफ थ्रेशोल्ड है जबकि एक्सपेक्टेड शॉर्टफॉल टेल के अंदर होने वाले औसत नुकसान को मापता है।";
  rawHindi.scenes[11].beats[2].text = "Niyam 3 aur 4: VaR subadditivity todta hai jabki Expected Shortfall ek coherent risk metric hai.";
  rawHindi.scenes[11].beats[2].hindi_tts = "नियम तीन और चार: वार सब-एडिटिविटी तोड़ता है जबकि एक्सपेक्टेड शॉर्टफॉल एक कोहेरेंट रिस्क मेट्रिक है।";
  rawHindi.scenes[11].beats[3].text = "Niyam 5 aur 6: Basel FRTB ne 99% VaR ko 97.5% Expected Shortfall se replace kiya hai.";
  rawHindi.scenes[11].beats[3].hindi_tts = "नियम पांच और छह: बासेल एफआरटीबी ने 99 परसेंट वार को 97.5 परसेंट एक्सपेक्टेड शॉर्टफॉल से रिप्लेस किया है।";
  rawHindi.scenes[11].beats[4].text = "Niyam 7 aur 8: Historical simulation aur volatility updating market regimes ko capture karte hain.";
  rawHindi.scenes[11].beats[4].hindi_tts = "नियम सात और आठ: हिस्टोरिकल सिमुलेशन और वोलैटिलिटी अपडेटिंग मार्केट रिजीम्स को कैप्चर करते हैं।";
  rawHindi.scenes[11].beats[5].text = "Yeh aath niyam banking regulation aur risk management ke aadharstambh hain.";
  rawHindi.scenes[11].beats[5].hindi_tts = "यह आठ नियम बैंकिंग रेगुलेशन और रिस्क मैनेजमेंट के आधारस्तंभ हैं।";

  rawEn.scenes[11].title = "The Whole Picture: 8 Core Principles";
  rawEn.scenes[11].beats[0].text = "Let us review the eight core principles of Value at Risk and Expected Shortfall.";
  rawEn.scenes[11].beats[0].dialogue = "Let us review the eight core principles of Value at Risk and Expected Shortfall.";
  rawEn.scenes[11].beats[1].text = "Rules 1 and 2: VaR sets the loss threshold, while Expected Shortfall measures conditional tail severity.";
  rawEn.scenes[11].beats[1].dialogue = "Rules 1 and 2: VaR sets the loss threshold, while Expected Shortfall measures conditional tail severity.";
  rawEn.scenes[11].beats[2].text = "Rules 3 and 4: VaR violates subadditivity, whereas Expected Shortfall satisfies coherence and rewards diversification.";
  rawEn.scenes[11].beats[2].dialogue = "Rules 3 and 4: VaR violates subadditivity, whereas Expected Shortfall satisfies coherence and rewards diversification.";
  rawEn.scenes[11].beats[3].text = "Rules 5 and 6: Basel FRTB regulations standardized on 97.5% Expected Shortfall to protect against extreme tail events.";
  rawEn.scenes[11].beats[3].dialogue = "Rules 5 and 6: Basel FRTB regulations standardized on 97.5% Expected Shortfall to protect against extreme tail events.";
  rawEn.scenes[11].beats[4].text = "Rules 7 and 8: Historical simulation and Hull-White volatility updating provide robust non-parametric risk estimates.";
  rawEn.scenes[11].beats[4].dialogue = "Rules 7 and 8: Historical simulation and Hull-White volatility updating provide robust non-parametric risk estimates.";
  rawEn.scenes[11].beats[5].text = "These eight principles govern institutional risk capital and safeguard global financial stability.";
  rawEn.scenes[11].beats[5].dialogue = "These eight principles govern institutional risk capital and safeguard global financial stability.";

  // Save raw episodes
  const outHindi = path.join(hindiDir, "episode_raw.json");
  const outEnglish = path.join(englishDir, "episode_raw.json");
  fs.writeFileSync(outHindi, JSON.stringify(rawHindi, null, 2), "utf8");
  fs.writeFileSync(outEnglish, JSON.stringify(rawEn, null, 2), "utf8");
  console.log("Successfully wrote episode_raw.json for Hindi and English ch20_part1!");

  // Validate
  console.log("Validating raw Hindi episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
  console.log("✅ Hindi episode valid!");

  console.log("Validating raw English episode...");
  execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
  console.log("✅ English episode valid!");
}

main().catch(console.error);
