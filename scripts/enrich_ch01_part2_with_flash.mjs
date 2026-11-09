// scripts/enrich_ch01_part2_with_flash.mjs
import fs from 'node:fs';
import path from 'node:path';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';

const hiDir = path.resolve('src/data/chapters/murphy_technical_analysis/ch01_part2');
const enDir = path.resolve('src/data/chapters/murphy_technical_analysis_en/ch01_part2');

const factsPath = path.join(hiDir, 'source_facts.json');
const sourceFacts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

const courseConfigHi = JSON.parse(fs.readFileSync('src/courses/murphy_technical_analysis.json', 'utf8'));
const courseConfigEn = JSON.parse(fs.readFileSync('src/courses/murphy_technical_analysis_en.json', 'utf8'));

const sceneOverrides = {
  scene0: {
    title: "The Specialization Trap & Market Flexibility",
    badge: "Market Reality · Flexibility & Adaptability",
    b01_raju: "Sharma ji, what happens when a fundamental analyst gets trapped in a dormant sector?",
    b02_sharma: "Consider an analyst mastering airline stocks for 10 years, only for the sector to stay flat for 5 years while tech surges 300%!",
    b03_sharma: "Specialized fundamentalists cannot rotate capital easily, watching their portfolio freeze in dead sideways ranges.",
    b04_sharma: "John Murphy proves: Chart principles apply universally across all markets, allowing seamless rotation into active trends!",
    b01_tts: "राजू पूछता है, शर्मा जी! जब कोई फंडामेंटल एनालिस्ट किसी एक सेक्टर में विशेषज्ञता हासिल करता है और वह सेक्टर सालों तक सुस्त पड़ा रहे, तो क्या होता है?",
    b02_tts: "शर्मा जी समझाते हैं, कल्पना करो एक विश्लेषक की, जिसने ऑटोमोबाइल सेक्टर का गहरा अध्ययन किया, लेकिन वह सेक्टर पांच साल तक साइडवेज रहा जबकि कमोडिटीज तीन सौ परसेंट बढ़ गईं!",
    b03_tts: "सेक्टर विशेषज्ञता के कारण वह अपनी पूंजी को कहीं और नहीं लगा सका और उसके फंड्स बिना किसी रिटर्न के निष्क्रिय पड़े रहे!",
    b04_tts: "इसलिए जॉन मर्फी समझाते हैं कि चार्ट के नियम हर बाजार पर समान रूप से लागू होते हैं, जिससे आप तुरंत उस बाजार में पूंजी घुमा सकते हैं जो ट्रेंड में हो!",
    b01_en: "Raju asks: Sharma ji, what happens when a fundamental analyst gets trapped in a dormant sector?",
    b02_en: "Sharma ji explains: Consider an analyst mastering one sector for a decade, only for it to stay flat while other sectors triple!",
    b03_en: "Due to rigid sector specialization, capital remains locked in stagnant sideways markets, missing massive opportunities elsewhere.",
    b04_en: "Thus, John Murphy proves chart principles apply universally across all markets, allowing seamless rotation into active trends."
  },
  scene1: {
    title: "Sector Specialization vs Universal Flexibility",
    badge: "Market Strategy · Trapped Capital vs Dynamic Rotation",
    leftLabel: "Sector Specialization (Locked in Sideways Drift)",
    rightLabel: "Universal Charting (Dynamic Capital Rotation)",
    b05_tts: "बाजार में एक तरफ वह ट्रेडर होते हैं जो सिर्फ एक शेयर या सेक्टर से चिपके रहते हैं, चाहे वह महीनों तक मरा पड़ा रहे।",
    b06_tts: "दूसरी तरफ चतुर चार्टिस्ट होते हैं जो चार्ट देखकर सुस्त बाजारों को छोड़ते हैं और तुरंत सक्रिय बुल ट्रेंड में पूंजी लगाते हैं।",
    b07_tts: "तकनीकी विश्लेषण किसी भी ट्रेडर को यह असाधारण स्वतंत्रता देता है कि वह किसी भी बाजार में बिना विशेषज्ञ बने काम कर सके।",
    b05_en: "On one side are traders emotionally married to a single stock, watching their capital stagnate in multi-year sideways ranges.",
    b06_en: "On the other side are disciplined chartists who readily abandon dead markets to redeploy capital into raging bull trends.",
    b07_en: "Universal technical analysis grants complete freedom to rotate across equities, commodities, and currencies effortlessly."
  },
  scene2: {
    title: "The 4 Pillars of Analytical Adaptability",
    badge: "Roadmap · 4 Methodological Pillars",
    cards: [
      { title: "Universal Applicability", desc: "Principles apply identically to stocks, commodities, forex, and bonds." },
      { title: "Multi-Timeframe Scope", desc: "Visual rules operate equally on 5-minute day trades and 20-year monthly charts." },
      { title: "Dynamic Capital Rotation", desc: "Systematically moving equity to trending assets while ignoring dormant ranges." },
      { title: "Refuting Criticisms", desc: "Debunking the self-fulfilling prophecy and random walk academic theories." }
    ],
    b08_tts: "पहला स्तंभ है सार्वभौमिक उपयोग: चार्ट के नियम शेयर, कमोडिटी, करेंसी और बॉन्ड्स सभी पर समान रूप से काम करते हैं।",
    b09_tts: "दूसरा स्तंभ है विभिन्न समय सीमाएं: यह सिद्धांत पांच मिनट के इंट्राडे चार्ट से लेकर बीस साल के मासिक चार्ट तक प्रभावी हैं।",
    b10_tts: "तीसरा स्तंभ है पूंजी का चक्रण: सक्रिय ट्रेंड वाले बाजारों में पैसा लगाना और सुस्त बाजारों को पूरी तरह नजरअंदाज करना।",
    b11_tts: "चौथा स्तंभ है आपत्तियों का समाधान: सेल्फ-फुलफिलिंग प्रोफेसी और रैंडम वॉक जैसी अकादमिक आपत्तियों का तर्कसंगत खंडन।",
    b08_en: "Pillar one is universal application: chart mechanics apply identically across stocks, futures, currencies, and fixed income.",
    b09_en: "Pillar two is multi-timeframe scope: the same geometric rules govern five-minute intraday bars and twenty-year secular trends.",
    b10_en: "Pillar three is dynamic rotation: moving capital into high-velocity trending assets while bypassing dormant ranges.",
    b11_en: "Pillar four is addressing criticisms: objectively answering the self-fulfilling prophecy and random walk academic theories."
  },
  scene9: {
    question: "In this Technical Analysis scenario based on Murphy Chapter 1 Part 2: A trader finds their primary market has entered an extended low-volatility sideways range. How should a disciplined technician respond?",
    options: [
      "A) Remain stubborn and hold capital in the dormant market hoping for a sudden move",
      "B) Apply technical screening across other asset classes and dynamically rotate capital to active trending markets",
      "C) Switch entirely to unproven fundamental rumors in the same dead sector",
      "D) Double position size to force profitability in the non-trending market"
    ],
    correctIndex: 1,
    answer: "B) Apply technical screening across other asset classes and dynamically rotate capital to active trending markets. Murphy emphasizes that technicians possess the adaptability to follow trends anywhere."
  },
  scene10: {
    rajuText: "So we never have to get stuck in a dead market when the entire financial world is open to us!",
    sharmaText: "Exactly! An informed technician follows price velocity and trends, moving capital dynamically wherever opportunity emerges."
  },
  scene11: {
    rules: [
      "1. Technical principles apply universally across equities, commodities, and currencies.",
      "2. Chart geometry functions identically across all timeframes from intraday to secular.",
      "3. Never marry a market; rotate capital to active trends and ignore dormant ranges.",
      "4. The chartist visualizes price action; the technician incorporates quantitative indicators.",
      "5. Price charts reflect actual supply and demand, refuting pure random walk theories.",
      "6. A self-fulfilling prophecy cannot sustain a major trend against genuine economic forces.",
      "7. Economic turning points appear on the price chart long before fundamental reports publish.",
      "8. Flexibility and emotional detachment are the technician's greatest competitive advantages."
    ]
  }
};

const rawHindi = scaffoldEpisode({
  chapterKey: 'ch01_part2',
  courseSlug: 'murphy_technical_analysis',
  chapterTitle: 'PHILOSOPHY: FLEXIBILITY, CHARTIST VS. TECHNICIAN & CRITICISMS',
  facts: sourceFacts.facts,
  courseConfig: courseConfigHi,
  sceneOverrides
});

const rawEn = scaffoldEpisode({
  chapterKey: 'ch01_part2',
  courseSlug: 'murphy_technical_analysis_en',
  chapterTitle: 'PHILOSOPHY: FLEXIBILITY, CHARTIST VS. TECHNICIAN & CRITICISMS',
  facts: sourceFacts.facts,
  courseConfig: courseConfigEn,
  sceneOverrides
});

for (const scene of rawEn.scenes) {
  for (const beat of scene.beats) {
    beat.text = beat.en_narration;
  }
}

// Sanitize Devanagari from UI strings
const devanagariRegex = /[\u0900-\u097F]/;
function sanitizeNoDevanagari(obj, fallback = 'Technical Analysis Principle') {
  if (typeof obj === 'string') {
    return devanagariRegex.test(obj) ? fallback : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeNoDevanagari(item, fallback));
  }
  if (obj && typeof obj === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = sanitizeNoDevanagari(v, fallback);
    }
    return res;
  }
  return obj;
}

for (const ep of [rawHindi, rawEn]) {
  for (const scene of ep.scenes) {
    if (devanagariRegex.test(scene.title)) scene.title = 'Philosophy: Flexibility & Criticisms';
    if (devanagariRegex.test(scene.badge)) scene.badge = 'Technical Principle · Market Rule';
    for (const beat of scene.beats) {
      if (beat.en_subtitle && devanagariRegex.test(beat.en_subtitle)) {
        beat.en_subtitle = beat.en_narration || 'Technical analysis concept.';
      }
      if (beat.ui_state) {
        beat.ui_state = sanitizeNoDevanagari(beat.ui_state);
      }
      if (beat.visual?.data) {
        beat.visual.data = sanitizeNoDevanagari(beat.visual.data);
      }
    }
  }
}

fs.writeFileSync(path.join(hiDir, 'episode_raw.json'), JSON.stringify(rawHindi, null, 2), 'utf8');
fs.writeFileSync(path.join(enDir, 'episode_raw.json'), JSON.stringify(rawEn, null, 2), 'utf8');

console.log('✅ Successfully enriched ch01_part2 (HI & EN) with the concrete front example and John Murphy technical content!');

