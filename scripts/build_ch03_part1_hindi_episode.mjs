import fs from 'fs';
import path from 'path';

const enPath = path.resolve('src/data/chapters/hull_derivatives_en/ch03_part1/episode_raw.json');
const enEp = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const hindiEp = JSON.parse(JSON.stringify(enEp));

// Update metadata
hindiEp.meta.course = 'hull_derivatives';
hindiEp.meta.narrationLanguage = 'hi-IN-devanagari';

// Hindi narration mappings for all 33 beats
const hindiNarration = {
  b01: "शर्मा जी! हमारे एक क्लाइंट के पास सौ एकड़ मक्के की फसल है। अगर सितंबर तक भाव चार डॉलर बीस सेंट से बढ़कर पांच डॉलर हो सकता है, तो वो आज ही फ्यूचर्स बेचकर चार बीस पर लॉक क्यों करे?",
  b02: "राजू, किसान का काम खेती करना है, सट्टेबाजी नहीं। अगर फसल आते समय भाव गिरकर साढ़े तीन डॉलर रह गया, तो किसान दिवालिया हो जाएगा। शॉर्ट हेज उस भारी गिरावट के जोखिम को पूरी तरह खत्म करता है।",
  b03: "और आटा मिल या फूड मैन्युफैक्चरर का रिस्क बिल्कुल उलटा है! अगर अनाज महंगा हुआ तो उनकी खरीद लागत बढ़ जाएगी, इसलिए वो फ्यूचर्स खरीदकर लॉन्ग हेज करते हैं!",
  b04: "इस पाठ में हम हेजिंग के तीन मुख्य सिद्धांतों को समझेंगे। पहला स्तंभ: कमर्शियल एक्सपोज़र के आधार पर शॉर्ट हेज और लॉन्ग हेज का सटीक चुनाव।",
  b05: "दूसरा स्तंभ: कॉर्पोरेट हेजिंग का विरोधाभास—शेयरहोल्डर डायवर्सिफिकेशन बनाम वित्तीय संकट से बचाव, और गोल्ड माइनर्स का ऐतिहासिक केस स्टडी।",
  b06: "तीसरा स्तंभ: बेसिस रिस्क का गणितीय मॉडल—बी बराबर एस माइनस एफ, कन्वर्जेंस नियम, और नेट रियलाइज्ड प्राइस फॉर्मूला।",
  b07: "शॉर्ट हेज: जब कंपनी के पास कोई एसेट पहले से हो या भविष्य में पैदा होने वाली हो, जैसे किसान की फसल या क्रूड ऑयल उत्पादन। फ्यूचर्स बेचकर भाव गिरने के जोखिम को लॉक किया जाता है।",
  b08: "लॉन्ग हेज: जब कंपनी को भविष्य में कोई कमोडिटी खरीदनी हो, जैसे एयरलाइन के लिए जेट फ्यूल या बेकर के लिए गेहूं। फ्यूचर्स खरीदकर भाव बढ़ने के रिस्क को खत्म किया जाता है।",
  b09: "मूल सिद्धांत यह है कि हाजिर बाजार का नुकसान फ्यूचर्स मार्केट के मुनाफे से कट जाता है, जिससे शुद्ध कैश फ्लो पूरी तरह सुरक्षित और पूर्व-निर्धारित रहता है।",
  b10: "शेयरहोल्डर डायवर्सिफिकेशन का तर्क: निवेशक खुद अपना पोर्टफोलियो डायवर्सिफाई कर सकते हैं। अगर कंपनी हेजिंग पर लागत खर्च करती है, तो क्या इससे शेयरहोल्डर वेल्थ बढ़ती है?",
  b11: "प्रबंधन का पक्ष: हेजिंग करने से कैश फ्लो स्थिर रहता है, दिवालिया होने का रिस्क टलता है, और जरूरी कैपिटल प्रोजेक्ट्स के लिए महंगा बाहरी कर्ज नहीं लेना पड़ता।",
  b12: "प्रतिस्पर्धी जोखिम: यदि इंडस्ट्री की प्रतिस्पर्धी कंपनियां हेज नहीं करतीं और बाजार में तेजी आती है, तो हेज की हुई कंपनी को लाभ नहीं मिलता और मार्जिन पिछड़ जाता है।",
  b13: "केस स्टडी तीन दशमलव एक: उन्नीस सौ नब्बे के दशक में सोने की माइनिंग कंपनियों ने कई सालों का भविष्य का उत्पादन बैंकों के साथ फॉरवर्ड बिक्री में लॉक कर दिया।",
  b14: "बैंकों ने इस जोखिम को हेज करने के लिए सेंट्रल बैंकों से सोने की लीज रेट पर सोना उधार लिया, उसे हाजिर बाजार में बेचा और नकदी को ब्याज पर निवेश किया।",
  b15: "लेकिन जब सोने में भारी ऐतिहासिक तेजी आई, तो कंपनियों का मुनाफा चार सौ डॉलर पर ही बंद रह गया। नाराज शेयरहोल्डर्स के दबाव में कंपनियों को भारी लागत पर हेज बंद करने पड़े।",
  b16: "आइये बेसिस के गणित को समझें। बेसिस की परिभाषा है: हेज किए जाने वाले एसेट का स्पॉट प्राइस माइनस उपयोग किए गए फ्यूचर्स का भाव—यानी बी टी बराबर एस टी माइनस एफ टी।",
  b17: "कॉन्ट्रैक्ट मैच्योरिटी पर, आर्बिट्राज के कारण हाजिर भाव और फ्यूचर्स भाव बिल्कुल बराबर हो जाते हैं, जिससे एक्सपायरी पर बेसिस शून्य हो जाता है।",
  b18: "लेकिन व्यावहारिक रूप से हेजर मैच्योरिटी से पहले ही पोजीशन काट लेते हैं। समय टी टू पर बेसिस के इस अनिश्चित उतार-चढ़ाव को ही बेसिस रिस्क कहा जाता है।",
  b19: "शॉर्ट हेजर के लिए मिलने वाला नेट भाव होता है: हाजिर बाजार की बिक्री एस टू, प्लस फ्यूचर्स का मुनाफा एफ वन माइनस एफ टू।",
  b20: "जब हम इसे पुनर्व्यवस्थित करते हैं, तो सूत्र बनता है: पी नेट बराबर एफ वन प्लस बी टू। यानी आपकी अंतिम प्राप्ति केवल लॉक किए गए फ्यूचर्स भाव और अंतिम बेसिस पर निर्भर है।",
  b21: "इसका मुख्य निष्कर्ष यह है: हेजिंग अनियंत्रित स्पॉट मूल्य जोखिम को खत्म करके उसे बहुत छोटे और नियंत्रित बेसिस रिस्क में बदल देती है।",
  b22: "जब समय के साथ बेसिस बढ़ता है—यानी बी टू का मान बी वन से ज्यादा होता है—तो इसे स्ट्रेंथनिंग ऑफ द बेसिस कहा जाता है।",
  b23: "बेसिस का मजबूत होना शॉर्ट हेजर के लिए फायदेमंद होता है क्योंकि नेट सेलिंग प्राइस बढ़ जाता है, लेकिन यह लॉन्ग हेजर की लागत को बढ़ा देता है।",
  b24: "इसके विपरीत, बेसिस का कमजोर होना यानी घटना लॉन्ग हेजर को फायदा पहुंचाता है और शॉर्ट हेजर की अंतिम प्राप्ति को कम कर देता है।",
  b25: "आइये जॉन हल का उदाहरण देखें: एक किसान चार डॉलर बीस सेंट पर सितंबर फ्यूचर्स बेचता है। सितंबर में हाजिर भाव तीन अस्सी और फ्यूचर्स तीन बयासी है। किसान को क्या नेट भाव मिला?",
  b26: "राजू सोचता है: बेसिस है तीन अस्सी माइनस तीन बयासी यानी माइनस दो सेंट। अब एफ वन प्लस बी टू करें: चार डॉलर बीस सेंट माइनस दो सेंट।",
  b27: "ऑप्शन बी बिल्कुल सही है! किसान को चार डॉलर अट्ठारह सेंट मिले। हाजिर में चालीस सेंट का नुकसान फ्यूचर्स के अड़तीस सेंट के मुनाफे से लगभग पूरी तरह कट गया!",
  b28: "आइये चैप्टर तीन पार्ट एक के पांच मुख्य सिद्धांतों को दोहराएं। पहला: शॉर्ट हेज विक्रेता की सुरक्षा करता है, और लॉन्ग हेज खरीदार की लागत लॉक करता है।",
  b29: "दूसरा: कॉर्पोरेट हेजिंग दिवालियापन से बचाती है, लेकिन प्रतिस्पर्धी उद्योग डायनेमिक्स को भी ध्यान में रखना आवश्यक है।",
  b30: "तीसरा: बेसिस की परिभाषा स्पॉट माइनस फ्यूचर्स है, जो कॉन्ट्रैक्ट एक्सपायरी पर शून्य पर कन्वर्ज हो जाती है।",
  b31: "चौथा: बेसिस का मजबूत होना शॉर्ट हेजर के पक्ष में होता है, जबकि कमजोर बेसिस लॉन्ग हेजर को लाभ देता है।",
  b32: "पांचवां: हेजिंग मूल्य के बड़े अनिश्चित जोखिम को छोटे बेसिस रिस्क में तब्दील कर देती है, जिससे निश्चितता मिलती है।",
  b33: "यह रहा चैप्टर तीन पार्ट एक का पूरा समरी ग्रिड। अगले भाग में हम समझेंगे मिनिमम वेरियंस हेज रेशियो और पोर्टफोलियो बीटा हेजिंग।"
};

// Update Scene 0 to Raju & Sharma ji persona
const s0 = hindiEp.scenes[0];
s0.beats[0].ui_state.stageDirections = ["— Raju questions the commercial logic of forward selling —"];
s0.beats[0].ui_state.messages = [
  {
    sender: "Raju",
    avatar: "R",
    text: "Sharma ji! A farming client harvests 100,000 bushels of corn in September. September futures are $4.20. Why lock in $4.20 today if spot prices might soar?",
    theme: "amber",
    align: "left"
  }
];
s0.beats[0].visual.data.messages = s0.beats[0].ui_state.messages;

s0.beats[1].ui_state.stageDirections = ["— Sharma ji explains commercial risk neutralization —"];
s0.beats[1].ui_state.messages = [
  {
    sender: "Raju",
    avatar: "R",
    text: "Sharma ji! A farming client harvests 100,000 bushels of corn in September. September futures are $4.20. Why lock in $4.20 today if spot prices might soar?",
    theme: "amber",
    align: "left"
  },
  {
    sender: "Sharma ji",
    avatar: "S",
    text: "Because a farmer produces crops, Raju, not speculative bets. If corn drops to $3.50, the farm faces bankruptcy. Selling futures locks in revenue and guarantees survival.",
    theme: "teal",
    align: "right"
  }
];
s0.beats[1].visual.data.messages = s0.beats[1].ui_state.messages;

s0.beats[2].ui_state.stageDirections = ["— Raju connects producer risk to processor procurement —"];
s0.beats[2].ui_state.messages = [
  {
    sender: "Raju",
    avatar: "R",
    text: "Sharma ji! A farming client harvests 100,000 bushels of corn in September. September futures are $4.20. Why lock in $4.20 today if spot prices might soar?",
    theme: "amber",
    align: "left"
  },
  {
    sender: "Sharma ji",
    avatar: "S",
    text: "Because a farmer produces crops, Raju, not speculative bets. If corn drops to $3.50, the farm faces bankruptcy. Selling futures locks in revenue and guarantees survival.",
    theme: "teal",
    align: "right"
  },
  {
    sender: "Raju",
    avatar: "R",
    text: "Understood! And cereal manufacturers face the opposite risk—if grain surges, input costs blow up. They execute a long hedge by buying futures!",
    theme: "amber",
    align: "left"
  }
];
s0.beats[2].visual.data.messages = s0.beats[2].ui_state.messages;

// Replace all hindi_tts with proper Hindi Devanagari
hindiEp.scenes.forEach(scene => {
  scene.beats.forEach(beat => {
    if (hindiNarration[beat.id]) {
      beat.hindi_tts = hindiNarration[beat.id];
    }
  });
});

const outDir = path.resolve('src/data/chapters/hull_derivatives/ch03_part1');
fs.writeFileSync(path.join(outDir, 'episode_raw.json'), JSON.stringify(hindiEp, null, 2), 'utf8');

console.log('✅ Generated episode_raw.json for hull_derivatives/ch03_part1 Hindi (33 beats, 10 scenes)');

