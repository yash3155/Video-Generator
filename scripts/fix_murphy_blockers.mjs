// scripts/fix_murphy_blockers.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. ch05_part1
{
  const p = path.join(rootDir, 'src/data/chapters/murphy_technical_analysis/ch05_part1/episode_raw.json');
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  const s11 = raw.scenes.find(s => s.segmentIndex === 11 || s.template === 'summary_thread');
  if (s11 && s11.beats) {
    if (s11.beats[3]) {
      s11.beats[3].hindi_tts = "चार्ट पर हमेशा याद रखें: पैटर्न पूरा होने के लिए नेकलाइन के नीचे क्लोजिंग जरूरी है, और पुलबैक टूटे हुए सपोर्ट को रेसिस्टेंस बनाकर दूसरी एंट्री देता है।";
    }
    if (s11.beats[4]) {
      s11.beats[4].hindi_tts = "चार्ट पर हमेशा याद रखें: ब्रेकआउट से हेड और नेकलाइन की वर्टिकल दूरी प्रोजेक्ट करें, और इनवर्स बॉटम्स में हमेशा भारी वॉल्यूम के साथ ब्रेकआउट होना चाहिए।";
    }
  }
  fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf8');
  console.log('Fixed ch05_part1 episode_raw.json');
}

// 2. ch05_part2
{
  const p = path.join(rootDir, 'src/data/chapters/murphy_technical_analysis/ch05_part2/episode_raw.json');
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  // Fix Scene 4 preset
  const s4 = raw.scenes.find(s => s.segmentIndex === 4 || s.title?.toLowerCase().includes('triple'));
  if (s4 && s4.beats) {
    for (const b of s4.beats) {
      if (b.ui_state && b.ui_state.preset === 'head_and_shoulders') {
        b.ui_state.preset = 'uptrend_then_drop';
      }
    }
  }

  // Fix Scene 11 summary thread
  const s11 = raw.scenes.find(s => s.segmentIndex === 11 || s.template === 'summary_thread');
  if (s11 && s11.beats) {
    if (s11.beats[3]) {
      s11.beats[3].hindi_tts = "चार्ट पर हमेशा याद रखें: कम वॉल्यूम पर बनने वाले मामूली नए हाई जल्दी ही धाराशायी हो जाते हैं, जबकि मजबूत डिप्स पिछले सपोर्ट से ऊपर संभलते हैं।";
    }
    if (s11.beats[4]) {
      s11.beats[4].hindi_tts = "चार्ट पर हमेशा याद रखें: धीमा एक्यूम्यूलेशन बेस जहां वॉल्यूम कर्व प्राइस का साथ देता है, और तेज ट्रेंडलाइन टूटने पर तुरंत एग्जिट करें।";
    }
  }
  fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf8');
  console.log('Fixed ch05_part2 episode_raw.json');
}

// 3. ch06_part1
{
  const p = path.join(rootDir, 'src/data/chapters/murphy_technical_analysis/ch06_part1/episode_raw.json');
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  const s11 = raw.scenes.find(s => s.segmentIndex === 11 || s.template === 'summary_thread');
  if (s11 && s11.beats) {
    if (s11.beats[3]) {
      s11.beats[3].hindi_tts = "चार्ट पर हमेशा याद रखें: फ्लैट ऊपरी रेसिस्टेंस और बढ़ती ट्रेंडलाइन बुलिश बायस बनाती है, जबकि फ्लैट सपोर्ट और गिरती ट्रेंडलाइन बेयरिश बायस दिखाती है।";
    }
    if (s11.beats[4]) {
      s11.beats[4].hindi_tts = "चार्ट पर हमेशा याद रखें: ब्रेकआउट पॉइंट से बेस की वर्टिकल ऊंचाई प्रोजेक्ट करें, और फैलती वॉल्यूम वाली डायवर्जिंग ट्रेंडलाइन्स खतरनाक टॉप्स का संकेत देती हैं।";
    }
  }
  fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf8');
  console.log('Fixed ch06_part1 episode_raw.json');
}

// 4. ch06_part2
{
  const p = path.join(rootDir, 'src/data/chapters/murphy_technical_analysis/ch06_part2/episode_raw.json');
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  const s11 = raw.scenes.find(s => s.segmentIndex === 11 || s.template === 'summary_thread');
  if (s11 && s11.beats) {
    if (s11.beats[4]) {
      s11.beats[4].hindi_tts = "चार्ट पर हमेशा याद रखें: इंडिकेटर्स की सहमति ट्रेंड को प्रमाणित करती है, जबकि डायवर्जेंस आने वाले रिवर्सल की चेतावनी देती है।";
    }
  }
  fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf8');
  console.log('Fixed ch06_part2 episode_raw.json');
}
