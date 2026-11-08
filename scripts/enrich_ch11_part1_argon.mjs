// scripts/enrich_ch11_part1_argon.mjs
import fs from 'fs';
import path from 'path';

async function queryArgon(prompt) {
  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const res = await fetch('http://127.0.0.1:8001/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test' },
        body: JSON.stringify({
          model: 'argon-low',
          messages: [
            { role: 'system', content: 'You are the Master Educational Dialogue Architect. Return ONLY valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2
        }),
        signal: AbortSignal.timeout(30000)
      });
      if (!res.ok) throw new Error(`Argon HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const text = data.choices[0].message.content.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (err) {
      console.warn(`⚠️ Argon query attempt ${attempts} failed: ${err.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('All Argon query attempts failed');
}

async function main() {
  console.log('Querying Gemini 4 Argon for Chapter 11 Part 1 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 11 Part 1 (Principal-Protected Notes, Covered Calls & Protective Puts, Bull Spreads, Bear Spreads, Box Spreads, Butterfly Spreads):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks how an investor can participate in stock market rallies without risking losing their initial capital. Sharma ji explains Principal-Protected Notes (PPNs): invest the discounted present value in a zero-coupon bond to guarantee principal, and use the remaining funds to buy upside index call options!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks Sharma ji how a trader decides between directional vertical spreads and neutral strategies like butterfly or box spreads. Sharma ji explains: vertical spreads cap both risk and reward for directional views, butterfly spreads target low volatility at the middle strike, and box spreads exploit interest rate or mispricing arbitrage!
Beats:
b31: Raju speaking
b32: Sharma ji speaking
b33: Raju speaking

Return ONLY a JSON object:
{
  "scene0": [
    { "id": "b01", "sender": "Raju", "hindi_tts": "...", "en_subtitle": "..." },
    { "id": "b02", "sender": "Sharma ji", "hindi_tts": "...", "en_subtitle": "..." },
    { "id": "b03", "sender": "Raju", "hindi_tts": "...", "en_subtitle": "..." }
  ],
  "scene10": [
    { "id": "b31", "sender": "Raju", "hindi_tts": "...", "en_subtitle": "..." },
    { "id": "b32", "sender": "Sharma ji", "hindi_tts": "...", "en_subtitle": "..." },
    { "id": "b33", "sender": "Raju", "hindi_tts": "...", "en_subtitle": "..." }
  ]
}
`;

  console.log('Requesting Argon dialogue synthesis for Hindi...');
  const dialogueHi = await queryArgon(promptHi);
  console.log('✅ Received Argon dialogue synthesis for Hindi!');

  const promptEn = `
For John C. Hull Chapter 11 Part 1 (Principal-Protected Notes, Covered Calls & Protective Puts, Bull Spreads, Bear Spreads, Box Spreads, Butterfly Spreads):
Provide 2 scenes of dialogue between Alex (inquisitive novice trader) and Marcus (veteran institutional risk manager) in crisp English narration and subtitles (<= 14 words per beat).

Scene 0: Alex asks how cautious clients can gain equity upside without risking their capital. Marcus reveals the architecture of Principal-Protected Notes (PPNs): combine a zero-coupon bond ensuring 100% principal return with call options to capture index growth.
Beats:
b01: Alex speaking (theme: "amber", avatar: "A")
b02: Marcus speaking (theme: "teal", avatar: "M")
b03: Alex speaking

Scene 10: Alex asks how institutional desks choose between vertical spreads and non-directional structures like box or butterfly spreads. Marcus breaks it down: vertical spreads define capped directional risk, butterfly spreads capture range-bound neutrality, and box spreads enforce pure interest-rate arbitrage.
Beats:
b31: Alex speaking
b32: Marcus speaking
b33: Alex speaking

Return ONLY a JSON object:
{
  "scene0": [
    { "id": "b01", "sender": "Alex", "en_tts": "...", "en_subtitle": "..." },
    { "id": "b02", "sender": "Marcus", "en_tts": "...", "en_subtitle": "..." },
    { "id": "b03", "sender": "Alex", "en_tts": "...", "en_subtitle": "..." }
  ],
  "scene10": [
    { "id": "b31", "sender": "Alex", "en_tts": "...", "en_subtitle": "..." },
    { "id": "b32", "sender": "Marcus", "en_tts": "...", "en_subtitle": "..." },
    { "id": "b33", "sender": "Alex", "en_tts": "...", "en_subtitle": "..." }
  ]
}
`;

  console.log('Requesting Argon dialogue synthesis for English...');
  const dialogueEn = await queryArgon(promptEn);
  console.log('✅ Received Argon dialogue synthesis for English!');

  const quizScenario = 'If an investor buys a stock at $49 and simultaneously sells a $50 call option for $6, what is their downside break-even price and maximum possible profit per share?';
  const quizOptions = [
    'A) Break-even is $43.00 and maximum profit is capped at $7.00 per share',
    'B) Break-even is $49.00 and maximum profit is unlimited on the upside',
    'C) Break-even is $55.00 and maximum profit is capped at $6.00 per share',
    'D) Break-even is $44.00 and maximum profit is capped at $1.00 per share'
  ];
  const quizAnswer = 'A) Break-even is $43.00 and maximum profit is $7.00 ($700 per 100-share contract). Downside break-even is S0 - c = $49 - $6 = $43; maximum profit is (K - S0) + c = ($50 - $49) + $6 = $7.';

  // -------------------------------------------------------------
  // UPDATE HINDI EPISODE
  // -------------------------------------------------------------
  const pHi = 'src/data/chapters/hull_derivatives/ch11_part1/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  epHi.scenes[0].title = "Origins: Zero-Risk Engineering with PPNs";
  epHi.scenes[0].badge = "Market Desk · Principal Protection";
  epHi.scenes[0].beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju seeks capital preservation with equity upside —' : '— Sharma ji explains the zero-coupon bond plus call option design —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce Principal-Protected Notes combining zero-coupon bonds with call options.', sourceFactIds: ['fact-01'] }
    }
  }));

  epHi.scenes[10].title = "Trading Desk Execution Rules";
  epHi.scenes[10].badge = "Desk Debrief · Strategy Selection";
  epHi.scenes[10].beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju reviews when to deploy directional versus neutral spreads —' : '— Sharma ji summarizes tactical deployment of spreads and arbitrage —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Provide practical desk guidelines for vertical spreads, butterflies, and arbitrage boxes.', sourceFactIds: ['fact-04', 'fact-08', 'fact-09'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9Hi = epHi.scenes[9];
  s9Hi.title = "Active Recall Challenge";
  s9Hi.badge = "Strategy Metrics Check";
  s9Hi.beats[0].hindi_tts = "यदि आप उनचास डॉलर पर शेयर खरीदकर पचास स्ट्राइक की कॉल छह डॉलर में बेचते हैं, तो ब्रेक ईवन और अधिकतम लाभ क्या होगा?";
  s9Hi.beats[0].en_subtitle = "Buying stock at $49 and selling $50 call at $6: what is the break-even and max profit?";
  s9Hi.beats[0].en_narration = "Calculate break-even and maximum profit for buying stock at $49 and selling a $50 call at $6.";
  s9Hi.beats[0].ui_state.question = quizScenario;
  s9Hi.beats[0].ui_state.options = quizOptions;
  s9Hi.beats[0].visual.data.question = quizScenario;
  s9Hi.beats[0].visual.data.options = quizOptions;

  s9Hi.beats[1].hindi_tts = "ध्यान से सोचिए... प्रीमियम इनफ्लो आपके डाउनसाइड रिस्क को कैसे कम करता है?";
  s9Hi.beats[1].en_subtitle = "Think carefully... How does the call premium cushion downside break-even?";
  s9Hi.beats[1].en_narration = "Consider how premium inflow lowers downside break-even.";
  s9Hi.beats[1].ui_state.question = quizScenario;
  if (s9Hi.beats[1].visual?.data) s9Hi.beats[1].visual.data.question = quizScenario;

  s9Hi.beats[2].hindi_tts = "सही उत्तर ए है! ब्रेक ईवन तैंतालीस डॉलर है और अधिकतम लाभ सात डॉलर प्रति शेयर पर सीमित है।";
  s9Hi.beats[2].en_subtitle = "Correct answer is A! Break-even is $43 and maximum profit is capped at $7.";
  s9Hi.beats[2].en_narration = "Correct answer is A: Break-even is $43 and maximum profit is $7 per share.";
  s9Hi.beats[2].ui_state.question = quizScenario;
  s9Hi.beats[2].ui_state.answer = quizAnswer;
  s9Hi.beats[2].ui_state.correctIndex = 0;
  if (s9Hi.beats[2].visual?.data) {
    s9Hi.beats[2].visual.data.question = quizScenario;
    s9Hi.beats[2].visual.data.answer = quizAnswer;
    s9Hi.beats[2].visual.data.correctIndex = 0;
  }

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log('✅ Updated Hindi episode_raw.json for ch11_part1');

  // -------------------------------------------------------------
  // UPDATE ENGLISH EPISODE
  // -------------------------------------------------------------
  const pEn = 'src/data/chapters/hull_derivatives_en/ch11_part1/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "Origins: Zero-Risk Engineering with PPNs";
  epEn.scenes[0].badge = "Market Desk · Principal Protection";
  epEn.scenes[0].beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex asks how to achieve upside while guaranteeing capital —' : '— Marcus details the zero-coupon bond plus call option architecture —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce Principal-Protected Notes combining zero-coupon bonds with call options.', sourceFactIds: ['fact-01'] }
    }
  }));

  epEn.scenes[10].title = "Trading Desk Execution Rules";
  epEn.scenes[10].badge = "Desk Debrief · Strategy Selection";
  epEn.scenes[10].beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex asks how to select between directional and non-directional spreads —' : '— Marcus provides institutional framework for spreads, butterflies, and arbitrage —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Provide practical desk guidelines for vertical spreads, butterflies, and arbitrage boxes.', sourceFactIds: ['fact-04', 'fact-08', 'fact-09'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9En = epEn.scenes[9];
  s9En.title = "Active Recall Challenge";
  s9En.badge = "Strategy Metrics Check";
  s9En.beats[0].en_tts = "If you purchase a stock at $49 and simultaneously sell a $50 strike call for $6, what is your downside break-even price and maximum possible profit per share?";
  s9En.beats[0].en_subtitle = "Buying stock at $49 and selling $50 call at $6: what is the break-even and max profit?";
  s9En.beats[0].en_narration = "Calculate break-even and maximum profit for buying stock at $49 and selling a $50 call at $6.";
  s9En.beats[0].ui_state.question = quizScenario;
  s9En.beats[0].ui_state.options = quizOptions;
  s9En.beats[0].visual.data.question = quizScenario;
  s9En.beats[0].visual.data.options = quizOptions;

  s9En.beats[1].en_tts = "Pause and consider... How does the received call premium cushion your downside break-even?";
  s9En.beats[1].en_subtitle = "Think carefully... How does the call premium cushion downside break-even?";
  s9En.beats[1].en_narration = "Consider how premium inflow lowers downside break-even.";
  s9En.beats[1].ui_state.question = quizScenario;
  if (s9En.beats[1].visual?.data) s9En.beats[1].visual.data.question = quizScenario;

  s9En.beats[2].en_tts = "Correct answer is A! Downside break-even is $43 and maximum profit is capped at $7 per share.";
  s9En.beats[2].en_subtitle = "Correct answer is A! Break-even is $43 and maximum profit is capped at $7.";
  s9En.beats[2].en_narration = "Correct answer is A: Break-even is $43 and maximum profit is $7 per share.";
  s9En.beats[2].ui_state.question = quizScenario;
  s9En.beats[2].ui_state.answer = quizAnswer;
  s9En.beats[2].ui_state.correctIndex = 0;
  if (s9En.beats[2].visual?.data) {
    s9En.beats[2].visual.data.question = quizScenario;
    s9En.beats[2].visual.data.answer = quizAnswer;
    s9En.beats[2].visual.data.correctIndex = 0;
  }

  fs.writeFileSync(pEn, JSON.stringify(epEn, null, 2), 'utf8');
  console.log('✅ Updated English episode_raw.json for ch11_part1');
}

main().catch(err => {
  console.error('❌ Enrichment failed:', err);
  process.exit(1);
});
