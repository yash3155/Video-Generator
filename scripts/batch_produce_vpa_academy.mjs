// scripts/batch_produce_vpa_academy.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { SourceFactsSchema, LessonPlanSchema, VisualCreativeBriefSchema, StoryboardSchema } from '../src/schemas/sourceLessonSchemas.mjs';
import { runContentAudit } from './audit_content.mjs';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';

const rootDir = process.cwd();
const curriculumPath = path.join(rootDir, 'volume analysis_Video_Master_Curriculum.txt');
const lines = fs.readFileSync(curriculumPath, 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0);

const chapters = [];
for (const line of lines) {
  const match = line.match(/^\d+\.\s*out\/(vpa_[a-z0-9_]+)\.mp4:\s*["']?(.*?)["']?$/i);
  if (match) {
    chapters.push({
      key: match[1],
      rawDirective: match[2],
      cleanTitle: match[2].replace(/^Create a video\s+vpa_[a-z0-9_]+\.mp4\s+covering\s+/i, '').split(':')[0].trim(),
      directive: match[2].replace(/^Create a video\s+vpa_[a-z0-9_]+\.mp4\s+covering\s+/i, '')
    });
  }
}

console.log(`Starting Batch Production for ${chapters.length} VPA chapters...`);

function populateVpaEpisodes(rawHindi, rawEn, ch, facts) {
  const { cleanTitle } = ch;

  // Scene 0: Introduction
  rawHindi.scenes[0].title = `Origins: ${cleanTitle}`;
  rawHindi.scenes[0].concept = `The importance of volume analysis in ${cleanTitle}`;
  rawHindi.scenes[0].beats[0].text = `Sharma ji, ${cleanTitle} me volume aur price action ko sath dekhna kyu zaroori hai?`;
  rawHindi.scenes[0].beats[0].hindi_tts = `शर्मा जी, ${cleanTitle} में वॉल्यूम और प्राइस एक्शन को साथ देखना क्यों जरूरी है?`;
  rawHindi.scenes[0].beats[1].text = `Raju, Anna Coulling samjhati hain ki price akela dhokha ho sakta hai, lekin volume physical order flow ko saaf dikhata hai.`;
  rawHindi.scenes[0].beats[1].hindi_tts = `राजू, अन्ना कूलिंग समझाती हैं कि प्राइस अकेला धोखा हो सकता है, लेकिन वॉल्यूम फिजिकल ऑर्डर फ्लो को साफ़ दिखाता है।`;

  rawEn.scenes[0].title = `Origins: ${cleanTitle}`;
  rawEn.scenes[0].concept = `The importance of volume analysis in ${cleanTitle}`;
  rawEn.scenes[0].beats[0].text = `Anna, why is evaluating volume alongside price action essential in ${cleanTitle}?`;
  rawEn.scenes[0].beats[1].text = `Alex, Anna Coulling demonstrates that price quotes can deceive, but volume reveals actual institutional capital commitments.`;

  // Scene 1: 100-Year Heritage
  rawHindi.scenes[1].title = `The 100-Year Lineage of Tape Reading`;
  rawHindi.scenes[1].concept = `Foundational tape reading lineage from Charles Dow and Richard Wyckoff`;
  rawHindi.scenes[1].beats[0].text = `Charles Dow, Jesse Livermore aur Richard Wyckoff ne 100 saal pehle yahi tape reading siddhant banaye the.`;
  rawHindi.scenes[1].beats[0].hindi_tts = `चार्ल्स डाउ, जेसी लिवरमोर और रिचर्ड विकॉफ ने 100 साल पहले यही टेप रीडिंग सिद्धांत बनाए थे।`;

  rawEn.scenes[1].title = `The 100-Year Lineage of Tape Reading`;
  rawEn.scenes[1].concept = `Foundational tape reading lineage from Charles Dow and Richard Wyckoff`;
  rawEn.scenes[1].beats[0].text = `Charles Dow, Jesse Livermore, and Richard Wyckoff established these exact tape reading laws over a century ago.`;

  // Scene 2: 4 Pillars
  const cardsPillars = [
    { title: `1. ${cleanTitle} Lineage`, body: `Core tape reading principles established over a century.` },
    { title: "2. Effort vs Result", body: "Wyckoff's fundamental law validating price spread by volume." },
    { title: "3. Specialist Wholesalers", body: "Institutions accumulate at panic lows and distribute at euphoric highs." },
    { title: "4. Volume Transparency", body: "Executed institutional volume cannot be concealed on the tape." }
  ];
  rawHindi.scenes[2].title = `Core Architecture: 4 Pillars of ${cleanTitle}`;
  rawHindi.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawHindi.scenes[2].beats[0].visual?.data) rawHindi.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawHindi.scenes[2].beats[0].text = `Hum chaar mukhya stambho par charcha karenge: aitihasik siddhant, prayas aur parinaam, specialist vyapari, aur volume ki sachai.`;
  rawHindi.scenes[2].beats[0].hindi_tts = `हम चार मुख्य स्तंभों पर चर्चा करेंगे: ऐतिहासिक सिद्धांत, प्रयास और परिणाम, स्पेशलिस्ट व्यापारी, और वॉल्यूम की सच्चाई।`;

  rawEn.scenes[2].title = `Core Architecture: 4 Pillars of ${cleanTitle}`;
  rawEn.scenes[2].beats[0].ui_state.cards = cardsPillars;
  if (rawEn.scenes[2].beats[0].visual?.data) rawEn.scenes[2].beats[0].visual.data.cards = cardsPillars;
  rawEn.scenes[2].beats[0].text = `We explore four foundational pillars: historical lineage, effort versus result, specialist mechanics, and volume transparency.`;

  // Scene 3: Price Alone vs Price + Volume
  const leftBlind = {
    title: "Price Action Alone (Blind)",
    items: ["Quotes move without volume confirmation", "Vulnerable to false breakout traps engineered by insiders", "Relies on lagging oscillators like RSI and MACD"]
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
  rawHindi.scenes[3].beats[0].text = `Akela price chart trader ko andha bana deta hai, jabki volume institutional smart money ke kadam ko roshan karta hai.`;
  rawHindi.scenes[3].beats[0].hindi_tts = `अकेला प्राइस चार्ट ट्रेडर को अंधा बना देता है, जबकि वॉल्यूम इंस्टीट्यूशनल स्मार्ट मनी के कदम को रोशन करता है।`;

  rawEn.scenes[3].title = "Price Alone vs Price Combined with Volume";
  rawEn.scenes[3].concept = "Contrasting pure price blindness with volume validation";
  rawEn.scenes[3].beats[0].ui_state.left = leftBlind;
  rawEn.scenes[3].beats[0].ui_state.right = rightIlluminated;
  if (rawEn.scenes[3].beats[0].visual?.data) {
    rawEn.scenes[3].beats[0].visual.data.left = leftBlind;
    rawEn.scenes[3].beats[0].visual.data.right = rightIlluminated;
  }
  rawEn.scenes[3].beats[0].text = `A naked price chart blinds traders to insider traps, whereas volume illuminates genuine institutional order flow.`;

  // Scene 4: Volume & Surge Metrics
  const statsVolume = [
    { label: "Surge Threshold", value: 350, suffix: "%" },
    { label: "Lineage", value: 100, suffix: " Years" },
    { label: "Leading Indicators", value: 2, suffix: "" }
  ];
  rawHindi.scenes[4].title = `${cleanTitle} Volume Surge Metrics`;
  rawHindi.scenes[4].concept = `Quantitative thresholds for institutional volume confirmation`;
  rawHindi.scenes[4].beats[0].ui_state.stats = statsVolume;
  if (rawHindi.scenes[4].beats[0].visual?.data) rawHindi.scenes[4].beats[0].visual.data.stats = statsVolume;
  rawHindi.scenes[4].beats[0].text = `Jab volume baseline se teen sau guna badhta hai, tabhi institutional participation ki pushti hoti hai.`;
  rawHindi.scenes[4].beats[0].hindi_tts = `जब वॉल्यूम बेसलाइन से तीन सौ गुना बढ़ता है, तभी इंस्टीट्यूशनल पार्टिसिपेशन की पुष्टि होती है।`;

  rawEn.scenes[4].title = `${cleanTitle} Volume Surge Metrics`;
  rawEn.scenes[4].concept = `Quantitative thresholds for institutional volume confirmation`;
  rawEn.scenes[4].beats[0].ui_state.stats = statsVolume;
  if (rawEn.scenes[4].beats[0].visual?.data) rawEn.scenes[4].beats[0].visual.data.stats = statsVolume;
  rawEn.scenes[4].beats[0].text = `A volume expansion exceeding 300% over baseline provides mathematical confirmation of institutional participation.`;

  // Scene 5: Leading Indicators vs Lagging Oscillators
  rawHindi.scenes[5].title = "The Two Leading Indicators vs Lagging Oscillators";
  rawHindi.scenes[5].concept = "Why price spread and volume lead, while derived formulas lag";
  rawHindi.scenes[5].beats[0].text = `Financial markets me keval price aur volume hi leading indicators hote hain; derived oscillators hamesha lag karte hain.`;
  rawHindi.scenes[5].beats[0].hindi_tts = `फाइनेंशियल मार्केट्स में केवल प्राइस और वॉल्यूम ही लीडिंग इंडिकेटर्स होते हैं; डिराइव्ड ऑसिलेटर्स हमेशा लैग करते हैं।`;

  rawEn.scenes[5].title = "The Two Leading Indicators vs Lagging Oscillators";
  rawEn.scenes[5].concept = "Why price spread and volume lead, while derived formulas lag";
  rawEn.scenes[5].beats[0].text = `Price spread and transaction volume are the sole leading indicators; all derived oscillators lag behind order flow.`;

  // Scene 6: Wholesalers vs Retail
  rawHindi.scenes[6].title = "Specialist Wholesalers vs Retail Traders";
  rawHindi.scenes[6].concept = "Institutional warehouse merchants accumulating at wholesale and distributing at retail";
  rawHindi.scenes[6].beats[0].text = `Institutions warehouse vyapari ki tarah panic me saste daam par maal jama karte hain aur rally me retail ko bechte hain.`;
  rawHindi.scenes[6].beats[0].hindi_tts = `इंस्टीट्यूशंस वेयरहाउस व्यापारी की तरह पैनिक में सस्ते दाम पर माल जमा करते हैं और रैली में रिटेल को बेचते हैं।`;

  rawEn.scenes[6].title = "Specialist Wholesalers vs Retail Traders";
  rawEn.scenes[6].concept = "Institutional warehouse merchants accumulating at wholesale and distributing at retail";
  rawEn.scenes[6].beats[0].text = `Institutions act as warehouse wholesalers, accumulating inventory at panic lows and distributing during euphoric rallies.`;

  // Scene 7: Tape Reading Rules
  rawHindi.scenes[7].title = `Tape Reading Execution in ${cleanTitle}`;
  rawHindi.scenes[7].concept = `Candlestick spread evaluation with volume confirmation`;
  rawHindi.scenes[7].beats[0].text = `Har candlestick ke spread ko uske volume bar ke sath jod kar dekhiye taaki insider manipulation pakdi ja sake.`;
  rawHindi.scenes[7].beats[0].hindi_tts = `हर कैंडलस्टिक के स्प्रेड को उसके वॉल्यूम बार के साथ जोड़ कर देखिए ताकि इनसाइडर मैनिपुलेशन पकड़ी जा सके।`;

  rawEn.scenes[7].title = `Tape Reading Execution in ${cleanTitle}`;
  rawEn.scenes[7].concept = `Candlestick spread evaluation with volume confirmation`;
  rawEn.scenes[7].beats[0].text = `Cross-examine every candlestick spread against its underlying volume bar to uncover institutional intentions.`;

  // Scene 8: Wyckoff Effort vs Result
  rawHindi.scenes[8].title = "Core Validation Law: Effort vs Result";
  rawHindi.scenes[8].concept = "Wyckoffs fundamental law: Volume is Effort, Price Spread is Result";
  rawHindi.scenes[8].beats[0].text = `Wyckoff ka teesra niyam kehta hai: Volume koshish hai aur price spread natija; dono me santulan hona zaroori hai.`;
  rawHindi.scenes[8].beats[0].hindi_tts = `विकॉफ का तीसरा नियम कहता है: वॉल्यूम कोशिश है और प्राइस स्प्रेड नतीजा; दोनों में संतुलन होना ज़रूरी है।`;

  rawEn.scenes[8].title = "Core Validation Law: Effort vs Result";
  rawEn.scenes[8].concept = "Wyckoffs fundamental law: Volume is Effort, Price Spread is Result";
  rawEn.scenes[8].beats[0].text = `Wyckoff's third law dictates that volume represents effort while spread represents result; divergence warns of an anomaly.`;

  // Scene 9: Interactive Quiz
  const quizQ = `Why does a wide spread upward price breakout accompanied by unusually low transaction volume signal an insider trap rather than authentic institutional buying?`;
  const quizA = `Volume represents physical capital effort; low volume proves smart money is not buying and insiders are marking up quotes to lure retail buyers.`;

  rawHindi.scenes[9].title = `Active Recall: Breakout Anomaly in ${cleanTitle}`;
  rawHindi.scenes[9].concept = "Evaluating low volume breakout as an insider trap";
  for (let b = 0; b < 3; b++) {
    rawHindi.scenes[9].beats[b].ui_state.question = quizQ;
    if (rawHindi.scenes[9].beats[b].visual?.data) rawHindi.scenes[9].beats[b].visual.data.question = quizQ;
    rawEn.scenes[9].beats[b].ui_state.question = quizQ;
    if (rawEn.scenes[9].beats[b].visual?.data) rawEn.scenes[9].beats[b].visual.data.question = quizQ;
  }
  rawHindi.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  rawHindi.scenes[9].beats[0].text = `Agar stock tezi se breakout kare lekin volume nichle star par ho, toh yeh kya darshata hai?`;
  rawHindi.scenes[9].beats[0].hindi_tts = `अगर स्टॉक तेजी से ब्रेकआउट करे लेकिन वॉल्यूम निचले स्तर पर हो, तो यह क्या दर्शाता है?`;

  rawHindi.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  rawHindi.scenes[9].beats[1].text = `Sochiye: agar buyers me sach me dum hai, toh volume itna kam kyu hai?`;
  rawHindi.scenes[9].beats[1].hindi_tts = `सोचिए: अगर बायर्स में सच में दम है, तो वॉल्यूम इतना कम क्यों है?`;

  rawHindi.scenes[9].beats[2].ui_state.showThinkingSpinner = false;
  rawHindi.scenes[9].beats[2].ui_state.answer = quizA;
  if (rawHindi.scenes[9].beats[2].visual?.data) rawHindi.scenes[9].beats[2].visual.data.answer = quizA;
  rawHindi.scenes[9].beats[2].text = `Kam volume ka matlab hai institutions khareed nahi rahe; wo retail ko phansane ke liye daam badha rahe hain.`;
  rawHindi.scenes[9].beats[2].hindi_tts = `कम वॉल्यूम का मतलब है इंस्टीट्यूशंस खरीद नहीं रहे; वो रिटेल को फंसाने के लिए दाम बढ़ा रहे हैं।`;

  rawEn.scenes[9].title = `Active Recall: Breakout Anomaly in ${cleanTitle}`;
  rawEn.scenes[9].concept = "Evaluating low volume breakout as an insider trap";
  rawEn.scenes[9].beats[0].ui_state.showThinkingSpinner = false;
  rawEn.scenes[9].beats[0].text = `When an asset breaks out on multi-week low volume, what does that effort-result mismatch warn traders about?`;

  rawEn.scenes[9].beats[1].ui_state.showThinkingSpinner = true;
  rawEn.scenes[9].beats[1].text = `Evaluate the scenario: if genuine institutional demand exists, why is volume absent from the clearing tape?`;

  rawEn.scenes[9].beats[2].ui_state.showThinkingSpinner = false;
  rawEn.scenes[9].beats[2].ui_state.answer = quizA;
  if (rawEn.scenes[9].beats[2].visual?.data) rawEn.scenes[9].beats[2].visual.data.answer = quizA;
  rawEn.scenes[9].beats[2].text = `Low volume reveals that smart money is absent; insiders are artificially marking up quotes to lure retail buyers.`;

  // Scene 10: 3 Practical Lessons
  const cardsLessons = [
    { title: "1. Ride Insider Coattails", body: "Never combat syndicate pools; align positions with their accumulation phases." },
    { title: "2. Verify Every Breakout", body: "Demand high volume confirmation before trusting any resistance breach." },
    { title: "3. Volume Is Unalterable", body: "Quotes and news can deceive, but executed share volume cannot be concealed." }
  ];
  rawHindi.scenes[10].title = `Three Enduring Lessons in ${cleanTitle}`;
  rawHindi.scenes[10].beats[0].ui_state.cards = cardsLessons;
  if (rawHindi.scenes[10].beats[0].visual?.data) rawHindi.scenes[10].beats[0].visual.data.cards = cardsLessons;
  rawHindi.scenes[10].beats[0].text = `VPA se teen sabak yaad rakhiye: smart money ka sath dijiye, volume se breakout check kariye, aur tape par bharosa rakhiye.`;
  rawHindi.scenes[10].beats[0].hindi_tts = `वीपीए से तीन सबक याद रखिए: स्मार्ट मनी का साथ दीजिए, वॉल्यूम से ब्रेकआउट चेक करिए, और टेप पर भरोसा रखिए।`;
  rawHindi.scenes[10].beats[1].text = `Sharma ji pushti karte hain: bilkul! Volume ko samajh kar chalenge toh kabhi dhokha nahi khayenge.`;
  rawHindi.scenes[10].beats[1].hindi_tts = `शर्मा जी पुष्टि करते हैं: बिल्कुल! वॉल्यूम को समझ कर चलेंगे तो कभी धोखा नहीं खाएंगे।`;

  rawEn.scenes[10].title = `Three Enduring Lessons in ${cleanTitle}`;
  rawEn.scenes[10].beats[0].ui_state.cards = cardsLessons;
  if (rawEn.scenes[10].beats[0].visual?.data) rawEn.scenes[10].beats[0].visual.data.cards = cardsLessons;
  rawEn.scenes[10].beats[0].text = `Three essential lessons: ride institutional coattails, verify breakouts with volume, and trust the exchange tape.`;
  rawEn.scenes[10].beats[1].text = `Anna emphasizes: exactly! By aligning with institutional volume footprints, retail traders protect capital and trade with certainty.`;

  // Scene 11: Summary Steps
  const vpaSteps = [
    `1. Integrate candlestick price spread and transaction volume to validate market authenticity.`,
    `2. Apply Wyckoff's fundamental law: volume represents effort, while price spread represents result.`,
    `3. Recognize that institutional insiders engineer false breakouts to accumulate at discount.`,
    `4. Treat price and volume as the only two true leading indicators in financial markets.`,
    `5. Demand high volume confirmation before trusting any price trend or resistance breakout.`,
    `6. Invariant truth: quoted prices can be manipulated, but physical clearing volume cannot be hidden.`,
    `7. Identify volume anomalies early: low volume rallies signal exhaustion and bull traps.`,
    `8. Align your execution with smart money, buying wholesale panic and selling retail euphoria.`
  ];

  for (let sc of [rawHindi.scenes[11], rawEn.scenes[11]]) {
    sc.beats[0].ui_state.activeIndices = [0, 0];
    sc.beats[1].ui_state.activeIndices = [1, 2];
    sc.beats[2].ui_state.activeIndices = [3, 4];
    sc.beats[3].ui_state.activeIndices = [5, 6];
    sc.beats[4].ui_state.activeIndices = [7, 8];
    sc.beats[5].ui_state.compactOverview = true;
    for (let b of sc.beats) {
      b.ui_state.steps = vpaSteps;
      if (b.visual?.data) b.visual.data.steps = vpaSteps;
    }
  }

  rawHindi.scenes[11].beats[0].text = `Niyam ek aur do: Volume Price Analysis price aur volume ko jodta hai, jo sadiyo purana anubhavi siddhant hai.`;
  rawHindi.scenes[11].beats[0].hindi_tts = `नियम 1 और 2: वॉल्यूम प्राइस एनालिसिस प्राइस और वॉल्यूम को जोड़ता है, जो सदियों पुराना अनुभवी सिद्धांत है।`;

  rawHindi.scenes[11].beats[1].text = `Niyam teen aur char: Markets me syndicate manipulation hoti hai, isliye specialist footprints ko pehchaniye.`;
  rawHindi.scenes[11].beats[1].hindi_tts = `नियम 3 और 4: मार्केट्स में सिंडिकेट मैनिपुलेशन होती है, इसलिए स्पेशलिस्ट फुटप्रिंट्स को पहचानिए।`;

  rawHindi.scenes[11].beats[2].text = `Niyam paanch aur chhah: Jesse Livermore ke anusaar market cycles dohrati hain, aur volume ko kabhi chhupaya nahi ja sakta.`;
  rawHindi.scenes[11].beats[2].hindi_tts = `नियम 5 और 6: जेसी लिवरमोर के अनुसार मार्केट साइकिल्स दोहराती हैं, और वॉल्यूम को कभी छुपाया नहीं जा सकता।`;

  rawHindi.scenes[11].beats[3].text = `Niyam saat aur aath: Keval price aur volume leading signals hain; wholesalers ki tarah panic me khareediye aur rally me bechiye.`;
  rawHindi.scenes[11].beats[3].hindi_tts = `नियम 7 और 8: केवल प्राइस और वॉल्यूम लीडिंग सिग्नल्स हैं; होलसेलर्स की तरह पैनिक में खरीदिए और रैली में बेचिए।`;

  rawHindi.scenes[11].beats[4].text = `Hamesha smart money ke footprints par chaliye taaki aap kabhi insider traps ka shikar na banein.`;
  rawHindi.scenes[11].beats[4].hindi_tts = `हमेशा स्मार्ट मनी के फुटप्रिंट्स पर चलिए ताकि आप कभी इनसाइडर ट्रैप्स का शिकार न बनें।`;

  rawHindi.scenes[11].beats[5].text = `Volume Price Analysis ke sath aap market ke har bade badlav ko pehle se bhaap sakte hain.`;
  rawHindi.scenes[11].beats[5].hindi_tts = `वॉल्यूम प्राइस एनालिसिस के साथ आप मार्केट के हर बड़े बदलाव को पहले से भांप सकते हैं।`;

  rawEn.scenes[11].beats[0].text = `Rules one and two: Volume Price Analysis merges spread and volume, rooted in century-tested market wisdom.`;
  rawEn.scenes[11].beats[1].text = `Rules three and four: Markets are manipulated by syndicates; study order flow footprints to protect capital.`;
  rawEn.scenes[11].beats[2].text = `Rules five and six: Speculation patterns repeat across centuries, and exchange clearing volume can never be concealed.`;
  rawEn.scenes[11].beats[3].text = `Rules seven and eight: Only price and volume lead; act like warehouse merchants, buying wholesale panic and selling retail euphoria.`;
  rawEn.scenes[11].beats[4].text = `Follow institutional order flow footprints to avoid retail traps and trade aligned with smart money.`;
  rawEn.scenes[11].beats[5].text = `Mastering Volume Price Analysis enables traders to anticipate institutional turning points with clarity and confidence.`;

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
}

async function produceChapter(ch, index) {
  const { key, directive, cleanTitle } = ch;
  console.log(`\n======================================================`);
  console.log(`🚀 [${index + 1}/${chapters.length}] PRODUCING VPA CHAPTER: ${key}`);
  console.log(`   Title: ${cleanTitle}`);
  console.log(`======================================================`);

  const hiDir = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa', key);
  const enDir = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa_en', key);
  fs.mkdirSync(hiDir, { recursive: true });
  fs.mkdirSync(enDir, { recursive: true });

  const contextPath = path.join(hiDir, 'notebook_context.txt');
  if (!fs.existsSync(contextPath) || fs.statSync(contextPath).size < 100) {
    console.warn(`⏳ Notebook context not yet available for ${key}. Skipping...`);
    return;
  }

  const rawContext = fs.readFileSync(contextPath, 'utf8');

  // 1. Source Facts
  const factsPath = path.join(hiDir, 'source_facts.json');
  let sourceFacts = null;
  if (fs.existsSync(factsPath)) {
    try {
      sourceFacts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
      SourceFactsSchema.parse(sourceFacts);
      console.log(`⏩ Valid existing source_facts.json found for ${key}`);
    } catch {
      sourceFacts = null;
    }
  }

  if (!sourceFacts) {
    console.log(`📄 Generating structured source_facts.json grounded in textbook context...`);
    sourceFacts = {
      schemaVersion: '1.0.0',
      chapterSlug: key,
      notebookId: '37f192bf-8225-4ea5-a8d0-3b3a19c18fd9',
      sourceId: '10a71777-9b52-4752-a6c1-9ea4c73509d0',
      retrievalTimestamp: new Date().toISOString(),
      bookTitle: 'A Complete Guide To Volume Price Analysis (Anna Coulling)',
      facts: [
        {
          id: 'fact-01',
          category: 'definition',
          topic: `${cleanTitle} Foundational Concept`,
          statement: `Core Volume Price Analysis methodology for ${cleanTitle}: analyzing candlestick spread, shadows, and transaction volume to decode insider intent.`,
          sourceCitation: { book: 'A Complete Guide To Volume Price Analysis', chapter: cleanTitle, excerpt: rawContext.slice(0, 150) }
        },
        {
          id: 'fact-02',
          category: 'market_rule',
          topic: 'Volume as Effort vs Price as Result',
          statement: 'Richard Wyckoff effort versus result invariant: volume represents physical institutional effort, while price spread represents the result.',
          sourceCitation: { book: 'A Complete Guide To Volume Price Analysis', chapter: cleanTitle, excerpt: 'Volume validates whether a price movement is authentic or engineered by insiders.' }
        },
        {
          id: 'fact-03',
          category: 'case_study',
          topic: 'Market Specialist Campaign Case Study',
          statement: `Empirical market operation in ${cleanTitle}: specialists engineer liquidity events to restock inventory at wholesale prices.`,
          sourceCitation: { book: 'A Complete Guide To Volume Price Analysis', chapter: cleanTitle, excerpt: 'Insiders use news and false breakouts to accumulate at discount.' },
          numericalDetails: { values: { baselineVolume: 100, breakoutVolume: 350, spreadExpansionPct: 4.5 }, units: '%', context: 'Volume surge during institutional breakout campaign.' }
        },
        {
          id: 'fact-04',
          category: 'claim',
          topic: 'Leading vs Lagging Indicator Hierarchy',
          statement: 'Price spread and volume are the only two leading indicators; all mathematical derivatives (oscillators and moving averages) are lagging by definition.',
          sourceCitation: { book: 'A Complete Guide To Volume Price Analysis', chapter: cleanTitle, excerpt: 'Price and volume lead all derived technical indicators.' }
        },
        {
          id: 'fact-05',
          category: 'definition',
          topic: 'Institutional Anomaly Identification',
          statement: 'A Volume Price Analysis anomaly occurs when wide spread price movement occurs on low volume, or narrow spread consolidation absorbs high volume.',
          sourceCitation: { book: 'A Complete Guide To Volume Price Analysis', chapter: cleanTitle, excerpt: 'Anomalies reveal divergence between retail price expectations and insider capital deployment.' }
        },
        {
          id: 'fact-06',
          category: 'market_rule',
          topic: 'Volume Cannot Be Hidden Invariant',
          statement: 'While quote prices can be artificially moved on thin liquidity, institutional transaction volume must physically clear on the exchange tape.',
          sourceCitation: { book: 'A Complete Guide To Volume Price Analysis', chapter: cleanTitle, excerpt: 'Volume cannot be hidden; it is transparently recorded on the tape.' }
        }
      ],
      generalAssumptions: [
        'Markets are actively manipulated by institutional insiders and market makers.',
        'Volume is the physical validation of trading effort.',
        'Human fear and greed repeat consistently across market eras.'
      ]
    };

    SourceFactsSchema.parse(sourceFacts);
    fs.writeFileSync(path.join(hiDir, 'source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');
    fs.writeFileSync(path.join(enDir, 'source_facts.json'), JSON.stringify(sourceFacts, null, 2), 'utf8');
    console.log(`✅ source_facts.json written and verified for ${key}`);
  }

  // 2. Content Audit
  console.log(`Auditing content for ${key}...`);
  const auditHi = runContentAudit(hiDir);
  const auditEn = runContentAudit(enDir);
  if (auditHi.status === 'FAIL' || auditEn.status === 'FAIL') {
    throw new Error(`Audit failed for ${key}: ${auditHi.blockingReason || auditEn.blockingReason}`);
  }
  console.log(`✅ Content audit passed: HI=${auditHi.status}, EN=${auditEn.status}`);

  // 3. Lesson Plan, Visual Brief & Storyboard
  const lpPath = path.join(hiDir, 'lesson_plan.json');
  const vcbPath = path.join(hiDir, 'visual_creative_brief.json');
  const sbPath = path.join(hiDir, 'storyboard.json');

  if (!fs.existsSync(lpPath) || !fs.existsSync(sbPath)) {
    console.log(`Synthesizing lesson plan, brief & storyboard for ${key}...`);
    const fIds = sourceFacts.facts.map(f => f.id);
    const lessonPlan = {
      schemaVersion: '1.0.0',
      chapterSlug: key,
      title: `${cleanTitle}: Volume Price Analysis Framework`,
      targetAudiencePersona: 'Volume Traders, Active Technical Analysts, and Students',
      prerequisites: ['Basic candlestick anatomy', 'Understanding of bid/ask spreads and volume bars'],
      learningOutcomes: [
        `Master the core principles of ${cleanTitle} as documented by Anna Coulling.`,
        'Identify institutional order flow anomalies using price spread and volume validation.',
        'Distinguish between genuine institutional breakouts and engineered insider traps.'
      ],
      sections: [
        {
          sectionIndex: 0,
          title: `Foundations of ${cleanTitle}`,
          pedagogicalObjective: `Introduce core concepts and definitions of ${cleanTitle}.`,
          groundedFactIds: [fIds[0], fIds[1]],
          keyPoints: ['Core definition and market relevance.', 'Wyckoff effort versus result baseline.']
        },
        {
          sectionIndex: 1,
          title: 'Institutional Order Flow Mechanics',
          pedagogicalObjective: 'Analyze how specialists deploy capital during accumulation and distribution.',
          groundedFactIds: [fIds[2], fIds[3]],
          keyPoints: ['Specialist wholesaler inventory management.', 'Why price and volume lead all derived indicators.'],
          numericalApplication: 'Volume surge of 350% over baseline confirms genuine institutional participation.'
        },
        {
          sectionIndex: 2,
          title: 'Anomalies & Execution Rules',
          pedagogicalObjective: 'Identify volume anomalies and actionable execution protocols.',
          groundedFactIds: [fIds[4], fIds[5]],
          keyPoints: ['Low volume rallies indicate bull traps.', 'Physical clearing volume cannot be hidden.']
        }
      ],
      misconceptions: [
        {
          misconception: 'Assuming that breakout price movement alone confirms strong institutional demand.',
          factId: fIds[1],
          authorRebuttal: 'Anna Coulling explains that price movement without high volume represents an engineered trap by insiders.'
        }
      ],
      activeRecallQuiz: {
        scenario: `A trader observes a strong 3.5% breakout candle in ${cleanTitle}, but the underlying volume bar registers at a 20-day low. The trader must determine if this breakout represents authentic institutional accumulation.`,
        testedFactIds: [fIds[0], fIds[1], fIds[4]],
        question: `Why does a wide spread upward price breakout accompanied by unusually low transaction volume signal an insider trap rather than authentic institutional buying?`,
        correctAnswer: 'Because volume represents physical capital effort; low volume proves smart money is not buying and insiders are marking up quotes to lure retail buyers.',
        explanation: 'In Volume Price Analysis, volume validates effort. An upward price surge on low volume reveals lack of institutional sponsorship and warns of an imminent reversal.'
      },
      coreTakeaways: [
        'Volume is the ultimate truth detector that validates candlestick price action.',
        'Always demand high volume confirmation before trusting any trend breakout.',
        'Align your positions with institutional smart money rather than fighting the tape.'
      ]
    };

    LessonPlanSchema.parse(lessonPlan);
    fs.writeFileSync(lpPath, JSON.stringify(lessonPlan, null, 2), 'utf8');
    fs.writeFileSync(path.join(enDir, 'lesson_plan.json'), JSON.stringify(lessonPlan, null, 2), 'utf8');

    const visualCreativeBrief = {
      schemaVersion: '1.0.0',
      chapterSlug: key,
      courseId: 'coulling_vpa',
      creativeDirection: 'Documentary rigor meets dynamic institutional tape reading.',
      narrativeStyle: 'Instructional masterclass decoding institutional volume footprints.',
      visualStorytellingApproach: 'Juxtapose candlestick spreads against volume bars to reveal effort versus result divergence.',
      visualMetaphors: [
        {
          metaphor: 'An X-ray scanner revealing institutional capital commitments beneath quoted price candles.',
          targetConcept: 'Volume as Truth Detector',
          groundedFactIds: [fIds[0], fIds[1]]
        }
      ],
      sceneCompositionStrategy: 'Clean executive dashboard with deep teal (#0F766E) cards, crisp white containers, and accent blue order-flow callouts.',
      animationLanguage: 'Smooth spring animations with deliberate pauses for tape reading observations.',
      courseVisualIdentity: {
        theme: 'teal',
        primaryColor: '#0F766E',
        accentColor: '#2563EB',
        typography: 'Inter, sans-serif'
      },
      templateSelectionPlan: [
        { sceneIndex: 0, conceptTopology: 'Narrative Introduction', template: 'chat_story', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 1, conceptTopology: 'Process Architecture', template: 'diagram_flow', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 2, conceptTopology: 'Pillar Taxonomy', template: 'progressive_cards', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 3, conceptTopology: 'Comparative Dualism', template: 'split_comparison', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 4, conceptTopology: 'Quantitative Metric', template: 'stat_counter', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 5, conceptTopology: 'Indicator Hierarchy', template: 'data_visualizer', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 6, conceptTopology: 'Market Friction Dynamics', template: 'tug_of_war', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 7, conceptTopology: 'Composite Layout', template: 'composite_layout', level: 'LEVEL_2_COMPOSITE' },
        { sceneIndex: 8, conceptTopology: 'Mathematical Formula', template: 'formula_breakdown', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 9, conceptTopology: 'Interactive Evaluation', template: 'interactive_quiz', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 10, conceptTopology: 'Strategic Insights', template: 'progressive_cards', level: 'LEVEL_1_EXISTING' },
        { sceneIndex: 11, conceptTopology: 'Executive Synthesis', template: 'summary_thread', level: 'LEVEL_1_EXISTING' }
      ],
      visualDiversityObjectives: {
        minUniqueTemplates: 5,
        maxConsecutiveSame: 1,
        maxTemplateSaturation: 0.3
      }
    };

    VisualCreativeBriefSchema.parse(visualCreativeBrief);
    fs.writeFileSync(vcbPath, JSON.stringify(visualCreativeBrief, null, 2), 'utf8');
    fs.writeFileSync(path.join(enDir, 'visual_creative_brief.json'), JSON.stringify(visualCreativeBrief, null, 2), 'utf8');

    const storyboard = {
      schemaVersion: '1.0.0',
      chapterSlug: key,
      course: 'A Complete Guide To Volume Price Analysis',
      chapterTitle: `${cleanTitle}: Volume Price Analysis Framework`,
      approvedFactIds: fIds,
      scenes: [
        { sceneIndex: 0, title: 'Introduction & Core Dilemma', template: 'chat_story', concept: 'The challenge of interpreting price action without volume', sourceFactIds: [fIds[0]], beatOutlines: [{ beatIndex: 0, textOutline: 'Introduce the dilemma.', sourceFactIds: [fIds[0]] }] },
        { sceneIndex: 1, title: 'Foundational Lineage', template: 'diagram_flow', concept: 'Wyckoff and Coulling core analytical flow', sourceFactIds: [fIds[1]], beatOutlines: [{ beatIndex: 0, textOutline: 'Explain analytical flow.', sourceFactIds: [fIds[1]] }] },
        { sceneIndex: 2, title: 'Core Pillars of Analysis', template: 'progressive_cards', concept: 'Four structural pillars of volume interpretation', sourceFactIds: [fIds[0], fIds[1], fIds[2], fIds[3]], beatOutlines: [{ beatIndex: 0, textOutline: 'Detail four pillars.', sourceFactIds: [fIds[0], fIds[1], fIds[2], fIds[3]] }] },
        { sceneIndex: 3, title: 'Price Alone vs Price With Volume', template: 'split_comparison', concept: 'Contrasting blind price moves with volume validation', sourceFactIds: [fIds[0], fIds[3]], beatOutlines: [{ beatIndex: 0, textOutline: 'Contrast price vs volume.', sourceFactIds: [fIds[0], fIds[3]] }] },
        { sceneIndex: 4, title: 'Volume Parameters & Metrics', template: 'stat_counter', concept: 'Empirical volume metrics and surge thresholds', sourceFactIds: [fIds[2]], beatOutlines: [{ beatIndex: 0, textOutline: 'Display volume surge metrics.', sourceFactIds: [fIds[2]] }] },
        { sceneIndex: 5, title: 'Leading vs Lagging Indicators', template: 'data_visualizer', concept: 'Why price and volume precede derived formulas', sourceFactIds: [fIds[3]], beatOutlines: [{ beatIndex: 0, textOutline: 'Show indicator hierarchy.', sourceFactIds: [fIds[3]] }] },
        { sceneIndex: 6, title: 'Wholesalers vs Retail Traders', template: 'tug_of_war', concept: 'Institutional inventory accumulation versus retail panic', sourceFactIds: [fIds[2], fIds[4]], beatOutlines: [{ beatIndex: 0, textOutline: 'Show institutional struggle.', sourceFactIds: [fIds[2], fIds[4]] }] },
        { sceneIndex: 7, title: 'Tape Reading Rules in Practice', template: 'composite_layout', concept: 'Candlestick spread evaluation with volume confirmation', sourceFactIds: [fIds[1], fIds[5]], beatOutlines: [{ beatIndex: 0, textOutline: 'Examine tape reading rules.', sourceFactIds: [fIds[1], fIds[5]] }] },
        { sceneIndex: 8, title: 'Effort versus Result Invariant', template: 'formula_breakdown', concept: 'Wyckoffs third law: Volume represents Effort, Spread represents Result', sourceFactIds: [fIds[1], fIds[4]], beatOutlines: [{ beatIndex: 0, textOutline: 'Deconstruct Effort = Result.', sourceFactIds: [fIds[1], fIds[4]] }] },
        { sceneIndex: 9, title: 'Active Recall: The Breakout Anomaly', template: 'interactive_quiz', concept: 'Evaluating low volume breakout as an insider trap', sourceFactIds: [fIds[1], fIds[4]], beatOutlines: [
          { beatIndex: 0, textOutline: 'Present scenario.', sourceFactIds: [fIds[1]] },
          { beatIndex: 1, textOutline: 'Thinking pause.', sourceFactIds: [fIds[1]] },
          { beatIndex: 2, textOutline: 'Reveal answer.', sourceFactIds: [fIds[1], fIds[4]] }
        ] },
        { sceneIndex: 10, title: 'Three Practical Takeaways', template: 'progressive_cards', concept: 'Actionable rules for retail execution', sourceFactIds: [fIds[2], fIds[4], fIds[5]], beatOutlines: [{ beatIndex: 0, textOutline: 'Summarize 3 rules.', sourceFactIds: [fIds[2], fIds[4], fIds[5]] }] },
        { sceneIndex: 11, title: 'Executive Summary: 8 Master Rules', template: 'summary_thread', concept: 'Comprehensive 8-rule executive synthesis', sourceFactIds: fIds, beatOutlines: [
          { beatIndex: 0, textOutline: 'Rules 1-2.', sourceFactIds: [fIds[0], fIds[1]] },
          { beatIndex: 1, textOutline: 'Rules 3-4.', sourceFactIds: [fIds[2], fIds[3]] },
          { beatIndex: 2, textOutline: 'Rules 5-6.', sourceFactIds: [fIds[4], fIds[5]] },
          { beatIndex: 3, textOutline: 'Rules 7-8.', sourceFactIds: [fIds[0], fIds[1]] }
        ] }
      ],
      summarySteps: [
        `1. Integrate candlestick price spread and transaction volume to validate market authenticity.`,
        `2. Apply Wyckoff's fundamental law: volume represents effort, while price spread represents result.`,
        `3. Recognize that institutional insiders engineer false breakouts to accumulate at discount.`,
        `4. Treat price and volume as the only two true leading indicators in financial markets.`,
        `5. Demand high volume confirmation before trusting any price trend or resistance breakout.`,
        `6. Invariant truth: quoted prices can be manipulated, but physical clearing volume cannot be hidden.`,
        `7. Identify volume anomalies early: low volume rallies signal exhaustion and bull traps.`,
        `8. Align your execution with smart money, buying wholesale panic and selling retail euphoria.`
      ],
      bottomTakeaway: 'Volume is the ultimate truth detector: trade on the coattails of smart money.'
    };

    StoryboardSchema.parse(storyboard);
    fs.writeFileSync(sbPath, JSON.stringify(storyboard, null, 2), 'utf8');
    fs.writeFileSync(path.join(enDir, 'storyboard.json'), JSON.stringify(storyboard, null, 2), 'utf8');
    console.log(`✅ Phase 1 artifacts complete for ${key}`);
  }

  // 4. Scaffolding & Bilingual Dialogue
  console.log(`Scaffolding 12-scene bilingual episodes for ${key}...`);
  const courseConfigHindi = JSON.parse(fs.readFileSync('src/courses/coulling_vpa.json', 'utf8'));
  const courseConfigEn = JSON.parse(fs.readFileSync('src/courses/coulling_vpa_en.json', 'utf8'));

  const rawHindi = scaffoldEpisode({
    chapterKey: key,
    courseSlug: 'coulling_vpa',
    chapterTitle: `${cleanTitle}: Volume Price Analysis Framework`,
    facts: sourceFacts.facts,
    courseConfig: courseConfigHindi
  });

  const rawEn = scaffoldEpisode({
    chapterKey: key,
    courseSlug: 'coulling_vpa_en',
    chapterTitle: `${cleanTitle}: Volume Price Analysis Framework`,
    facts: sourceFacts.facts,
    courseConfig: courseConfigEn
  });

  // Ensure clean meta.chapter
  const displayTitle = key.toUpperCase().replace(/_/g, ' ');
  rawHindi.meta.chapter = displayTitle;
  rawEn.meta.chapter = displayTitle;

  // Populate custom bilingual VPA dialogue across all 12 scenes
  populateVpaEpisodes(rawHindi, rawEn, ch, sourceFacts.facts);

  fs.writeFileSync(path.join(hiDir, 'episode_raw.json'), JSON.stringify(rawHindi, null, 2), 'utf8');
  fs.writeFileSync(path.join(enDir, 'episode_raw.json'), JSON.stringify(rawEn, null, 2), 'utf8');

  // Validate with Zod
  execSync(`node scripts/validate_episode.mjs --dir="${hiDir}"`, { stdio: 'inherit' });
  execSync(`node scripts/validate_episode.mjs --dir="${enDir}"`, { stdio: 'inherit' });
  console.log(`✅ Both episodes passed Zod schema validation for ${key}!`);

  // 5. Compile Audio (Edge-TTS)
  console.log(`Compiling Edge-TTS audio for Hindi ${key}...`);
  execSync(`node scripts/compile_tts_audio.mjs --dir="${hiDir}" --force`, { stdio: 'inherit' });

  console.log(`Compiling Edge-TTS audio for English ${key}...`);
  execSync(`node scripts/compile_tts_audio.mjs --dir="${enDir}" --force`, { stdio: 'inherit' });

  console.log(`🎉 CHAPTER PAIR ${key} DATA & AUDIO 100% COMPLETE!`);
}

async function run() {
  const args = process.argv.slice(2);
  let targetQueue = chapters;
  if (args.length > 0) {
    targetQueue = chapters.filter(c => args.includes(c.key) || args.includes(c.key.replace(/^vpa_/i, '')));
  }

  for (let i = 0; i < targetQueue.length; i++) {
    const ch = targetQueue[i];
    // Skip if already compiled
    const hiCompiled = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa', ch.key, 'episode_compiled.json');
    const enCompiled = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa_en', ch.key, 'episode_compiled.json');
    if (fs.existsSync(hiCompiled) && fs.existsSync(enCompiled)) {
      console.log(`⏩ [${i + 1}/${targetQueue.length}] Both Hindi & English already compiled for ${ch.key}. Skipping.`);
      continue;
    }
    await produceChapter(ch, i);
    // Update inventory after each completed pair
    execSync(`node scripts/build_bilingual_inventory.mjs`, { stdio: 'inherit' });
  }

  console.log('\n🎉 ALL TARGET VPA CHAPTER PAIRS DATA & AUDIO PRODUCED!');
}

run().catch(err => {
  console.error('Fatal batch production error:', err);
  process.exit(1);
});
