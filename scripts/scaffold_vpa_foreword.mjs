// scripts/scaffold_vpa_foreword.mjs
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { scaffoldEpisode } from "../src/orchestrator/scaffoldingEngine.mjs";

const chapterSlug = "vpa_foreword";
const hindiDir = path.resolve(`src/data/chapters/coulling_vpa/${chapterSlug}`);
const englishDir = path.resolve(`src/data/chapters/coulling_vpa_en/${chapterSlug}`);

const sourceFacts = JSON.parse(fs.readFileSync(path.join(hindiDir, "source_facts.json"), "utf8"));
const courseConfigHindi = JSON.parse(fs.readFileSync("src/courses/coulling_vpa.json", "utf8"));
const courseConfigEn = JSON.parse(fs.readFileSync("src/courses/coulling_vpa_en.json", "utf8"));

console.log("Scaffolding 12-scene episodes for vpa_foreword (0 tokens)...");
const rawHindi = scaffoldEpisode({
  chapterKey: chapterSlug,
  courseSlug: "coulling_vpa",
  chapterTitle: "Foreword: The 100-Year Heritage of Volume Trading",
  facts: sourceFacts.facts,
  courseConfig: courseConfigHindi
});

const rawEn = scaffoldEpisode({
  chapterKey: chapterSlug,
  courseSlug: "coulling_vpa_en",
  chapterTitle: "Foreword: The 100-Year Heritage of Volume Trading",
  facts: sourceFacts.facts,
  courseConfig: courseConfigEn
});

// Scene 0: Introduction aboard HMS President
rawHindi.scenes[0].title = "Origins: The HMS President Seminar (1998)";
rawHindi.scenes[0].concept = "Albert Labos and the discovery of institutional volume trading on the River Thames";
rawHindi.scenes[0].beats[0].text = "Sharma ji, trading me price action dekh kar sab decision lena kafi nahi hota kya?";
rawHindi.scenes[0].beats[0].hindi_tts = "शर्मा जी, ट्रेडिंग में प्राइस एक्शन देख कर सब फैसला लेना काफी नहीं होता क्या?";
rawHindi.scenes[0].beats[1].text = "Raju, 1998 me HMS President jahaaz par Albert Labos ne sikhaya tha ki price akela ek dhokha ho sakta hai, lekin volume kabhi jhooth nahi bolta.";
rawHindi.scenes[0].beats[1].hindi_tts = "राजू, 1998 में एचएमएस प्रेसिडेंट जहाज पर अल्बर्ट लाबोस ने सिखाया था कि प्राइस अकेला एक धोखा हो सकता है, लेकिन वॉल्यूम कभी झूठ नहीं बोलता।";

rawEn.scenes[0].title = "Origins: The HMS President Seminar (1998)";
rawEn.scenes[0].concept = "Albert Labos and the discovery of institutional volume trading on the River Thames";
rawEn.scenes[0].beats[0].text = "Anna, isn't studying pure price action enough to navigate financial markets profitably?";
rawEn.scenes[0].beats[1].text = "Alex, back in 1998 aboard the HMS President, Albert Labos proved that price alone can mislead, but volume never lies.";

// Scene 1: 100-Year Lineage of Tape Reading
rawHindi.scenes[1].title = "The 100-Year Lineage of Tape Reading";
rawHindi.scenes[1].concept = "Charles Dow, Jesse Livermore, and Richard Wyckoff foundational principles";
rawHindi.scenes[1].beats[0].text = "Charles Dow, Jesse Livermore aur Richard Wyckoff ne 100 saal pehle ticker tape se yahi volume siddhant banaye the.";
rawHindi.scenes[1].beats[0].hindi_tts = "चार्ल्स डाउ, जेसी लिवरमोर और रिचर्ड विकॉफ ने 100 साल पहले टिकर टेप से यही वॉल्यूम सिद्धांत बनाए थे।";

rawEn.scenes[1].title = "The 100-Year Lineage of Tape Reading";
rawEn.scenes[1].concept = "Charles Dow, Jesse Livermore, and Richard Wyckoff foundational principles";
rawEn.scenes[1].beats[0].text = "Charles Dow, Jesse Livermore, and Richard Wyckoff mastered these exact tape reading principles over a century ago.";

// Scene 2: 4 Pillars of Volume Price Analysis
const cardsPillars = [
  { title: "1. The 100-Year Lineage", body: "Dow, Wyckoff, and Livermore ticker tape principles." },
  { title: "2. The Two Leading Indicators", body: "Price spread and volume are the only leading signals." },
  { title: "3. Market Manipulation", body: "Institutions engineer false spikes to hunt retail liquidity." },
  { title: "4. Volume Cannot Be Hidden", body: "Physical capital commitments must register on the tape." }
];
rawHindi.scenes[2].title = "Core Architecture: 4 Pillars of Volume Price Analysis";
rawHindi.scenes[2].beats[0].ui_state.cards = cardsPillars;
if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = cardsPillars;
rawHindi.scenes[2].beats[0].text = "Hum chaar mukhya stambho par charcha karenge: sadiyo purana itihas, do leading indicators, market manipulation, aur volume ki sachai.";
rawHindi.scenes[2].beats[0].hindi_tts = "हम चार मुख्य स्तंभों पर चर्चा करेंगे: सदियों पुराना इतिहास, दो लीडिंग इंडिकेटर्स, मार्केट मैनिपुलेशन, और वॉल्यूम की सच्चाई।";

rawEn.scenes[2].title = "Core Architecture: 4 Pillars of Volume Price Analysis";
rawEn.scenes[2].beats[0].ui_state.cards = cardsPillars;
if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = cardsPillars;
rawEn.scenes[2].beats[0].text = "We examine four pillars: the 100-year heritage, the two leading indicators, insider manipulation, and volume transparency.";

// Scene 3: Price Alone vs Price Combined with Volume
const leftBlind = {
  title: "Price Action Alone (Blind)",
  items: ["Sees breakout rally but cannot confirm buyer conviction", "Vulnerable to false breakout traps engineered by insiders", "Relies on lagging oscillators like RSI and MACD"]
};
const rightIlluminated = {
  title: "Price + Volume (VPA Illuminated)",
  items: ["Volume reveals physical capital committed to the move", "Effort versus Result confirms authentic institutional accumulation", "Exposes low-volume traps before price collapses"]
};
rawHindi.scenes[3].title = "Price Alone vs Price Combined with Volume";
rawHindi.scenes[3].concept = "Contrasting pure price blindness with volume validation";
rawHindi.scenes[3].beats[0].ui_state.left = leftBlind;
rawHindi.scenes[3].beats[0].ui_state.right = rightIlluminated;
if (rawHindi.scenes[3].beats[0].visual?.data) {
  rawHindi.scenes[3].beats[0].visual.data.left = leftBlind;
  rawHindi.scenes[3].beats[0].visual.data.right = rightIlluminated;
}
rawHindi.scenes[3].beats[0].text = "Akela price chart trader ko andha bana deta hai, jabki volume institutional smart money ke har kadam ko roshan karta hai.";
rawHindi.scenes[3].beats[0].hindi_tts = "अकेला प्राइस चार्ट ट्रेडर को अंधा बना देता है, जबकि वॉल्यूम इंस्टीट्यूशनल स्मार्ट मनी के हर कदम को रोशन करता है।";

rawEn.scenes[3].title = "Price Alone vs Price Combined with Volume";
rawEn.scenes[3].concept = "Contrasting pure price blindness with volume validation";
rawEn.scenes[3].beats[0].ui_state.left = leftBlind;
rawEn.scenes[3].beats[0].ui_state.right = rightIlluminated;
if (rawEn.scenes[3].beats[0].visual?.data) {
  rawEn.scenes[3].beats[0].visual.data.left = leftBlind;
  rawEn.scenes[3].beats[0].visual.data.right = rightIlluminated;
}
rawEn.scenes[3].beats[0].text = "A naked price chart blinds traders to insider traps, whereas volume illuminates genuine institutional order flow.";

// Scene 4: HMS President Seminar Metrics
rawHindi.scenes[4].title = "HMS President 1998 Seminar Metrics";
rawHindi.scenes[4].concept = "Tuition outlay, course duration, and historic naval venue";
rawHindi.scenes[4].beats[0].ui_state.stats = [
  { label: "Tuition Fee (£)", value: 5000, suffix: "£" },
  { label: "Course Duration", value: 14, suffix: " Days" },
  { label: "Ship Built", value: 1918, suffix: "" }
];
if (rawHindi.scenes[4].beats[0].visual?.data) rawHindi.scenes[4].beats[0].visual.data.stats = rawHindi.scenes[4].beats[0].ui_state.stats;
rawHindi.scenes[4].beats[0].text = "Anna Coulling ne 1998 me paanch hazaar pounds dekar chauda dino ka seminar liya, jisme unhone volume ka gyan seekha.";
rawHindi.scenes[4].beats[0].hindi_tts = "अन्ना कूलिंग ने 1998 में पाँच हज़ार पाउंड्स देकर चौदह दिनों का सेमिनार लिया, जिसमें उन्होंने वॉल्यूम का ज्ञान सीखा।";

rawEn.scenes[4].title = "HMS President 1998 Seminar Metrics";
rawEn.scenes[4].concept = "Tuition outlay, course duration, and historic naval venue";
rawEn.scenes[4].beats[0].ui_state.stats = [
  { label: "Tuition Fee (£)", value: 5000, suffix: "£" },
  { label: "Course Duration", value: 14, suffix: " Days" },
  { label: "Ship Built", value: 1918, suffix: "" }
];
if (rawEn.scenes[4].beats[0].visual?.data) rawEn.scenes[4].beats[0].visual.data.stats = rawEn.scenes[4].beats[0].ui_state.stats;
rawEn.scenes[4].beats[0].text = "In 1998, Anna Coulling invested five thousand pounds for a two-week seminar aboard the HMS President to master volume.";

// Scene 5: Leading Indicators vs Lagging Oscillators
rawHindi.scenes[5].title = "The Two Leading Indicators vs Lagging Oscillators";
rawHindi.scenes[5].concept = "Why price spread and volume lead, while derived formulas lag";
rawHindi.scenes[5].beats[0].text = "Financial markets me keval price aur volume hi leading indicators hote hain; RSI aur moving averages hamesha lag karte hain.";
rawHindi.scenes[5].beats[0].hindi_tts = "फाइनेंशियल मार्केट्स में केवल प्राइस और वॉल्यूम ही लीडिंग इंडिकेटर्स होते हैं; आरएसआई और मूविंग एवरेजेस हमेशा लैग करते हैं।";

rawEn.scenes[5].title = "The Two Leading Indicators vs Lagging Oscillators";
rawEn.scenes[5].concept = "Why price spread and volume lead, while derived formulas lag";
rawEn.scenes[5].beats[0].text = "Price spread and volume are the sole leading indicators; all derived formulas like moving averages and RSI lag behind order flow.";

// Scene 6: Specialist Wholesalers vs Retail Traders
rawHindi.scenes[6].title = "Specialist Wholesalers vs Retail Traders";
rawHindi.scenes[6].concept = "Institutional warehouse merchants accumulating at wholesale and distributing at retail";
rawHindi.scenes[6].beats[0].text = "Institutions warehouse vyapari ki tarah panic me saste daam par maal jama karte hain aur rally me retail ko mehanga bechte hain.";
rawHindi.scenes[6].beats[0].hindi_tts = "इंस्टीट्यूशंस वेयरहाउस व्यापारी की तरह पैनिक में सस्ते दाम पर माल जमा करते हैं और रैली में रिटेल को महंगा बेचते हैं।";

rawEn.scenes[6].title = "Specialist Wholesalers vs Retail Traders";
rawEn.scenes[6].concept = "Institutional warehouse merchants accumulating at wholesale and distributing at retail";
rawEn.scenes[6].beats[0].text = "Institutions act like wholesalers, accumulating inventory at panic wholesale discounts and selling to retail at euphoric markups.";

// Scene 7: Tape Reading Principles
rawHindi.scenes[7].title = "Tape Reading Rules: Wyckoff & Coulling Principles";
rawHindi.scenes[7].concept = "Interpreting volume bars beneath candlestick spreads";
rawHindi.scenes[7].beats[0].text = "Har candlestick ke spread ko uske volume bar ke sath jod kar dekhiye taaki insider manipulation pakdi ja sake.";
rawHindi.scenes[7].beats[0].hindi_tts = "हर कैंडलस्टिक के स्प्रेड को उसके वॉल्यूम बार के साथ जोड़ कर देखिए ताकि इनसाइडर मैनिपुलेशन पकड़ी जा सके।";

rawEn.scenes[7].title = "Tape Reading Rules: Wyckoff & Coulling Principles";
rawEn.scenes[7].concept = "Interpreting volume bars beneath candlestick spreads";
rawEn.scenes[7].beats[0].text = "Always cross-examine every candlestick spread against its underlying volume bar to uncover institutional intentions.";

// Scene 8: Wyckoff's Effort vs Result
rawHindi.scenes[8].title = "Core Validation Law: Effort vs Result";
rawHindi.scenes[8].concept = "Wyckoffs fundamental law: Volume is Effort, Price Spread is Result";
rawHindi.scenes[8].beats[0].text = "Wyckoff ka teesra niyam kehta hai: Volume koshish hai aur price spread natija; dono me santulan hona chahiye.";
rawHindi.scenes[8].beats[0].hindi_tts = "विकॉफ का तीसरा नियम कहता है: वॉल्यूम कोशिश है और प्राइस स्प्रेड नतीजा; दोनों में संतुलन होना चाहिए।";

rawEn.scenes[8].title = "Core Validation Law: Effort vs Result";
rawEn.scenes[8].concept = "Wyckoffs fundamental law: Volume is Effort, Price Spread is Result";
rawEn.scenes[8].beats[0].text = "Wyckoff's third law dictates that volume represents effort while spread represents result; disparity warns of an insider trap.";

// Scene 9: Interactive Quiz
const quizQuestion = "Why does a wide spread upward price surge accompanied by unusually low transaction volume indicate an institutional bull trap rather than genuine demand?";
const quizAnswer = "Volume measures physical institutional effort; low volume proves smart money is not buying, meaning insiders are marking up prices to trap retail buyers.";

rawHindi.scenes[9].title = "Active Recall: The Low-Volume Breakout Anomaly";
rawHindi.scenes[9].concept = "Evaluating low volume rallies as institutional traps";
for (let b = 0; b < 3; b++) {
  rawHindi.scenes[9].beats[b].ui_state.question = quizQuestion;
  if (rawHindi.scenes[9].beats[b].visual?.data) rawHindi.scenes[9].beats[b].visual.data.question = quizQuestion;
}
rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
rawHindi.scenes[9].beats[0].text = "Agar stock tezi se chaar percent upar jaye lekin volume ek mahine ke sabse nichle star par ho, toh yeh kya darshata hai?";
rawHindi.scenes[9].beats[0].hindi_tts = "अगर स्टॉक तेजी से चार प्रतिशत ऊपर जाए लेकिन वॉल्यूम एक महीने के सबसे निचले स्तर पर हो, तो यह क्या दर्शाता है?";

rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
rawHindi.scenes[9].beats[1].text = "Sochiye: agar buyers me sach me dum hai, toh volume itna kam kyu hai?";
rawHindi.scenes[9].beats[1].hindi_tts = "सोचिए: अगर बायर्स में सच में दम है, तो वॉल्यूम इतना कम क्यों है?";

rawHindi.scenes[9].beats[2].ui_state.showThinkingSpinner = false;
rawHindi.scenes[9].beats[2].ui_state.answer = quizAnswer;
if (rawHindi.scenes[9].beats[2].visual?.data) rawHindi.scenes[9].beats[2].visual.data.answer = quizAnswer;
rawHindi.scenes[9].beats[2].text = "Kam volume ka matlab hai institutions khareed nahi rahe; wo retail ko phansane ke liye daam badha rahe hain.";
rawHindi.scenes[9].beats[2].hindi_tts = "कम वॉल्यूम का मतलब है इंस्टीट्यूशंस खरीद नहीं रहे; वो रिटेल को फंसाने के लिए दाम बढ़ा रहे हैं।";

rawEn.scenes[9].title = "Active Recall: The Low-Volume Breakout Anomaly";
rawEn.scenes[9].concept = "Evaluating low volume rallies as institutional traps";
for (let b = 0; b < 3; b++) {
  rawEn.scenes[9].beats[b].ui_state.question = quizQuestion;
  if (rawEn.scenes[9].beats[b].visual?.data) rawEn.scenes[9].beats[b].visual.data.question = quizQuestion;
}
rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
rawEn.scenes[9].beats[0].text = "When an asset surges four percent on thirty-day low volume, what does that effort-result mismatch warn traders about?";

rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
rawEn.scenes[9].beats[1].text = "Evaluate the scenario: if genuine institutional demand exists, why is volume absent from the clearing tape?";

rawEn.scenes[9].beats[2].ui_state.showThinkingSpinner = false;
rawEn.scenes[9].beats[2].ui_state.answer = quizAnswer;
if (rawEn.scenes[9].beats[2].visual?.data) rawEn.scenes[9].beats[2].visual.data.answer = quizAnswer;
rawEn.scenes[9].beats[2].text = "Low volume reveals that smart money is absent; insiders are artificially marking up quotes to lure retail buyers.";

// Scene 10: 3 Key Lessons from Syndicate Traders
const cardsLessons = [
  { title: "1. Ride Insider Coattails", body: "Never combat syndicate pools; align positions with their accumulation phases." },
  { title: "2. Verify Every Breakout", body: "Demand high volume confirmation before trusting any resistance breach." },
  { title: "3. Volume Is Unalterable", body: "Quotes and news can deceive, but executed share volume cannot be concealed." }
];
rawHindi.scenes[10].title = "Three Enduring Lessons from Syndicate Traders";
rawHindi.scenes[10].beats[0].ui_state.cards = cardsLessons;
if (rawHindi.scenes[10].beats[0].visual?.data) rawHindi.scenes[10].beats[0].visual.data.cards = cardsLessons;
rawHindi.scenes[10].beats[0].text = "Syndicate traders se teen sabak yaad rakhiye: smart money ka sath dijiye, volume se breakout check kariye, aur volume par bharosa rakhiye.";
rawHindi.scenes[10].beats[0].hindi_tts = "सिंडिकेट ट्रेडर्स से तीन सबक याद रखिए: स्मार्ट मनी का साथ दीजिए, वॉल्यूम से ब्रेकआउट चेक करिए, और वॉल्यूम पर भरोसा रखिए।";
rawHindi.scenes[10].beats[1].text = "Sharma ji pushti karte hain: bilkul! Volume ko samajh kar chalenge toh kabhi dhokha nahi khayenge.";
rawHindi.scenes[10].beats[1].hindi_tts = "शर्मा जी पुष्टि करते हैं: बिल्कुल! वॉल्यूम को समझ कर चलेंगे तो कभी धोखा नहीं खाएंगे।";

rawEn.scenes[10].title = "Three Enduring Lessons from Syndicate Traders";
rawEn.scenes[10].beats[0].ui_state.cards = cardsLessons;
if (rawEn.scenes[10].beats[0].visual?.data) rawEn.scenes[10].beats[0].visual.data.cards = cardsLessons;
rawEn.scenes[10].beats[0].text = "Three essential lessons from syndicate traders: ride institutional coattails, verify breakouts with volume, and trust the exchange tape.";
rawEn.scenes[10].beats[1].text = "Anna emphasizes: exactly! By aligning with institutional volume footprints, retail traders protect capital and trade with certainty.";

// Scene 11: 8 Master Rules Summary Thread
const vpaSummarySteps = [
  "1. Combine candlestick price spread and transaction volume to validate authenticity.",
  "2. Respect the 100-year tape reading heritage established by Dow, Wyckoff, and Livermore.",
  "3. Recognize that institutional banking syndicates systematically manipulate financial markets.",
  "4. Study ex-syndicate trader techniques to decode hidden block accumulation campaigns.",
  "5. Apply classic ticker-tape laws: speculation is as old as the hills and patterns repeat.",
  "6. Invariant truth: market makers can manipulate quotes, but physical volume cannot be hidden.",
  "7. Treat price and volume as the only two true leading indicators; avoid lagging indicators.",
  "8. Act like a warehouse partner: buy wholesale at panic lows and sell retail at euphoric peaks."
];

// Configure Summary Steps on Scene 11
for (let sc of [rawHindi.scenes[11], rawEn.scenes[11]]) {
  sc.beats[0].ui_state.activeIndices = [0, 0];
  sc.beats[1].ui_state.activeIndices = [1, 2];
  sc.beats[2].ui_state.activeIndices = [3, 4];
  sc.beats[3].ui_state.activeIndices = [5, 6];
  sc.beats[4].ui_state.activeIndices = [7, 8];
  sc.beats[5].ui_state.compactOverview = true;
  for (let b of sc.beats) {
    b.ui_state.steps = vpaSummarySteps;
    if (b.visual?.data) b.visual.data.steps = vpaSummarySteps;
  }
}

rawHindi.scenes[11].beats[0].text = "Niyam ek aur do: Volume Price Analysis price aur volume ko jodta hai, jo sadiyo purana anubhavi siddhant hai.";
rawHindi.scenes[11].beats[0].hindi_tts = "नियम 1 और 2: वॉल्यूम प्राइस एनालिसिस प्राइस और वॉल्यूम को जोड़ता है, जो सदियों पुराना अनुभवी सिद्धांत है।";

rawHindi.scenes[11].beats[1].text = "Niyam teen aur char: Markets me syndicate manipulation hoti hai, isliye Tom Williams jaise specialist footprints ko pehchaniye.";
rawHindi.scenes[11].beats[1].hindi_tts = "नियम 3 और 4: मार्केट्स में सिंडिकेट मैनिपुलेशन होती है, इसलिए टॉम विलियम्स जैसे स्पेशलिस्ट फुटप्रिंट्स को पहचानिए।";

rawHindi.scenes[11].beats[2].text = "Niyam paanch aur chhah: Jesse Livermore ke anusaar market cycles dohrati hain, aur volume ko kabhi chhupaya nahi ja sakta.";
rawHindi.scenes[11].beats[2].hindi_tts = "नियम 5 और 6: जेसी लिवरमोर के अनुसार मार्केट साइकिल्स दोहराती हैं, और वॉल्यूम को कभी छुपाया नहीं जा सकता।";

rawHindi.scenes[11].beats[3].text = "Niyam saat aur aath: Keval price aur volume leading signals hain; wholesalers ki tarah panic me khareediye aur rally me bechiye.";
rawHindi.scenes[11].beats[3].hindi_tts = "नियम 7 और 8: केवल प्राइस और वॉल्यूम लीडिंग सिग्नल्स हैं; होलसेलर्स की तरह पैनिक में खरीदिए और रैली में बेचिए।";

rawHindi.scenes[11].beats[4].text = "Hamesha smart money ke footprints par chaliye taaki aap kabhi insider traps ka shikar na banein.";
rawHindi.scenes[11].beats[4].hindi_tts = "हमेशा स्मार्ट मनी के फुटप्रिंट्स पर चलिए ताकि आप कभी इनसाइडर ट्रैप्स का शिकार न बनें।";

rawHindi.scenes[11].beats[5].text = "Volume Price Analysis ke sath aap market ke har bade badlav ko pehle se bhaap sakte hain.";
rawHindi.scenes[11].beats[5].hindi_tts = "वॉल्यूम प्राइस एनालिसिस के साथ आप मार्केट के हर बड़े बदलाव को पहले से भांप सकते हैं।";

rawEn.scenes[11].beats[0].text = "Rules one and two: Volume Price Analysis merges spread and volume, rooted in century-tested market wisdom.";

rawEn.scenes[11].beats[1].text = "Rules three and four: Markets are manipulated by syndicates; study Tom Williams order flow footprints to protect capital.";

rawEn.scenes[11].beats[2].text = "Rules five and six: Speculation patterns repeat across centuries, and exchange clearing volume can never be concealed.";

rawEn.scenes[11].beats[3].text = "Rules seven and eight: Only price and volume lead; act like warehouse merchants, buying wholesale panic and selling retail euphoria.";

rawEn.scenes[11].beats[4].text = "Follow institutional order flow footprints to avoid retail traps and trade aligned with smart money.";

rawEn.scenes[11].beats[5].text = "Mastering Volume Price Analysis enables traders to anticipate institutional turning points with clarity and confidence.";

// Synchronize English beats
for (const sc of rawEn.scenes) {
  for (const b of sc.beats) {
    b.en_narration = b.text;
    b.en_subtitle = b.text;
    b.dialogue = b.text;
  }
}

// Synchronize Hindi beats
for (const sc of rawHindi.scenes) {
  for (const b of sc.beats) {
    b.dialogue = b.text;
    if (!b.hindi_tts) b.hindi_tts = b.text;
  }
}

rawHindi.meta.chapter = "FOREWORD";
rawEn.meta.chapter = "FOREWORD";

fs.writeFileSync(path.join(hindiDir, "episode_raw.json"), JSON.stringify(rawHindi, null, 2), "utf8");
fs.writeFileSync(path.join(englishDir, "episode_raw.json"), JSON.stringify(rawEn, null, 2), "utf8");

console.log("✅ Scaffolding complete for both Hindi & English!");

// Validate with Zod
execSync(`node scripts/validate_episode.mjs --dir="${hindiDir}"`, { stdio: "inherit" });
execSync(`node scripts/validate_episode.mjs --dir="${englishDir}"`, { stdio: "inherit" });
console.log("✅ Both episodes passed Zod schema validation!");
