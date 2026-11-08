// scripts/enrich_ch11_part2_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 11 Part 2 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 11 Part 2 (Calendar Spreads, Bottom & Top Straddles, Strips, Straps, Strangles, Snapshot 11.2 Earnings Straddle Traps):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks how to trade when a huge market event is coming but the direction is unknown. Sharma ji explains the Bottom Straddle: buying both a call and a put at the same strike K profits from explosive movement in either direction!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks why so many retail traders lose money buying straddles before earnings announcements. Sharma ji reveals Business Snapshot 11.2: Implied Volatility Crush! Before earnings, IV is pumped sky-high; once results are out, IV collapses instantly, destroying both call and put values!
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
For John C. Hull Chapter 11 Part 2 (Calendar Spreads, Bottom & Top Straddles, Strips, Straps, Strangles, Snapshot 11.2 Earnings Straddle Traps):
Provide 2 scenes of dialogue between Alex (inquisitive novice trader) and Marcus (veteran institutional risk manager) in crisp English narration and subtitles (<= 14 words per beat).

Scene 0: Alex asks how to trade an impending explosive catalyst when market direction is completely unpredictable. Marcus reveals the Long Straddle: simultaneously buying a call and a put at the same strike K to harvest large moves in either direction.
Beats:
b01: Alex speaking (theme: "amber", avatar: "A")
b02: Marcus speaking (theme: "teal", avatar: "M")
b03: Alex speaking

Scene 10: Alex asks why buying straddles ahead of corporate earnings announcements so often results in painful losses. Marcus explains Business Snapshot 11.2: Implied Volatility Crush! Pre-earnings options are priced with extreme IV; post-announcement IV collapse wipes out both options despite stock movement.
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

  const quizScenario = 'If an investor purchases a 6-month call for $4.00 and a 6-month put for $3.00 with common strike $50.00, what are the exact break-even prices and the outcome if the stock reaches $65.00 at expiration?';
  const quizOptions = [
    'A) Downside break-even is $43.00, upside break-even is $57.00, and profit at $65.00 is $8.00 per share ($800.00 total)',
    'B) Downside break-even is $47.00, upside break-even is $54.00, and profit at $65.00 is $15.00 per share ($1,500.00 total)',
    'C) Downside break-even is $50.00, upside break-even is $60.00, and profit at $65.00 is $5.00 per share ($500.00 total)',
    'D) Downside break-even is $46.00, upside break-even is $53.00, and max loss occurs at $65.00'
  ];
  const quizAnswer = 'A) Downside break-even is $43.00, upside break-even is $57.00, and profit at $65.00 is $8.00 ($800 per 100-share contract). Total debit is $4 + $3 = $7. At $65, Call payoff is $15, Put payoff is $0, net profit is $15 - $7 = $8.';

  // -------------------------------------------------------------
  // UPDATE HINDI EPISODE
  // -------------------------------------------------------------
  const pHi = 'src/data/chapters/hull_derivatives/ch11_part2/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  epHi.scenes[0].title = "Origins: Trading Explosive Volatility";
  epHi.scenes[0].badge = "Market Desk · Non-Directional Trading";
  epHi.scenes[0].beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju seeks a strategy for uncertain explosive moves —' : '— Sharma ji explains the long straddle call plus put architecture —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce long straddles and non-directional volatility trading.', sourceFactIds: ['fact-03'] }
    }
  }));

  epHi.scenes[10].title = "Trading Desk Execution Rules";
  epHi.scenes[10].badge = "Desk Debrief · Snapshot 11.2 Traps";
  epHi.scenes[10].beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks why pre-earnings straddles often fail —' : '— Sharma ji explains implied volatility crush and post-earnings pricing —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Warn traders about implied volatility crush around corporate earnings (Snapshot 11.2).', sourceFactIds: ['fact-09'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9Hi = epHi.scenes[9];
  s9Hi.title = "Active Recall Challenge";
  s9Hi.badge = "Straddle Payoff & Break-Even";
  s9Hi.beats[0].hindi_tts = "यदि एक निवेशक पचास स्ट्राइक पर चार डॉलर की कॉल और तीन डॉलर की पुट खरीदता है, तो ब्रेक ईवन और पैंसठ डॉलर पर लाभ क्या होगा?";
  s9Hi.beats[0].en_subtitle = "Buying $50 strike call at $4 and put at $3: calculate break-evens and profit at $65.";
  s9Hi.beats[0].en_narration = "Calculate break-even points and net profit at $65 for a $50 straddle costing $7.";
  s9Hi.beats[0].ui_state.question = quizScenario;
  s9Hi.beats[0].ui_state.options = quizOptions;
  s9Hi.beats[0].visual.data.question = quizScenario;
  s9Hi.beats[0].visual.data.options = quizOptions;

  s9Hi.beats[1].hindi_tts = "सोचिए... दोनों ऑप्शंस का कुल प्रीमियम सात डॉलर है, तो ब्रेक ईवन दोनों तरफ कितना दूर होगा?";
  s9Hi.beats[1].en_subtitle = "Think carefully... Total premium is $7, how far are the break-evens from strike $50?";
  s9Hi.beats[1].en_narration = "Consider the total premium paid and the resulting break-even corridor.";
  s9Hi.beats[1].ui_state.question = quizScenario;
  if (s9Hi.beats[1].visual?.data) s9Hi.beats[1].visual.data.question = quizScenario;

  s9Hi.beats[2].hindi_tts = "सही उत्तर ए है! ब्रेक ईवन तैंतालीस और सत्तावन डॉलर हैं, और पैंसठ डॉलर पर आठ डॉलर प्रति शेयर का शुद्ध लाभ होगा।";
  s9Hi.beats[2].en_subtitle = "Correct answer is A! Break-evens are $43 and $57, with $8 profit at $65.";
  s9Hi.beats[2].en_narration = "Correct answer is A: Break-evens are $43 and $57, yielding $8 profit per share at $65.";
  s9Hi.beats[2].ui_state.question = quizScenario;
  s9Hi.beats[2].ui_state.answer = quizAnswer;
  s9Hi.beats[2].ui_state.correctIndex = 0;
  if (s9Hi.beats[2].visual?.data) {
    s9Hi.beats[2].visual.data.question = quizScenario;
    s9Hi.beats[2].visual.data.answer = quizAnswer;
    s9Hi.beats[2].visual.data.correctIndex = 0;
  }

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log('✅ Updated Hindi episode_raw.json for ch11_part2');

  // -------------------------------------------------------------
  // UPDATE ENGLISH EPISODE
  // -------------------------------------------------------------
  const pEn = 'src/data/chapters/hull_derivatives_en/ch11_part2/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "Origins: Trading Explosive Volatility";
  epEn.scenes[0].badge = "Market Desk · Non-Directional Trading";
  epEn.scenes[0].beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex asks how to trade unpredictable massive volatility —' : '— Marcus reveals the long straddle call plus put architecture —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce long straddles and non-directional volatility trading.', sourceFactIds: ['fact-03'] }
    }
  }));

  epEn.scenes[10].title = "Trading Desk Execution Rules";
  epEn.scenes[10].badge = "Desk Debrief · Snapshot 11.2 Traps";
  epEn.scenes[10].beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex asks why buying pre-earnings straddles so often fails —' : '— Marcus explains implied volatility crush and post-event option repricing —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Warn traders about implied volatility crush around corporate earnings (Snapshot 11.2).', sourceFactIds: ['fact-09'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9En = epEn.scenes[9];
  s9En.title = "Active Recall Challenge";
  s9En.badge = "Straddle Payoff & Break-Even";
  s9En.beats[0].en_tts = "If an investor purchases a 6-month call for $4.00 and a 6-month put for $3.00 with common strike $50.00, what are the exact break-even prices and the outcome if the stock reaches $65.00 at expiration?";
  s9En.beats[0].en_subtitle = "Buying $50 strike call at $4 and put at $3: calculate break-evens and profit at $65.";
  s9En.beats[0].en_narration = "Calculate break-even points and net profit at $65 for a $50 straddle costing $7.";
  s9En.beats[0].ui_state.question = quizScenario;
  s9En.beats[0].ui_state.options = quizOptions;
  s9En.beats[0].visual.data.question = quizScenario;
  s9En.beats[0].visual.data.options = quizOptions;

  s9En.beats[1].en_tts = "Pause and consider... The total premium paid is $7.00. How far must the stock move past the strike to break even?";
  s9En.beats[1].en_subtitle = "Think carefully... Total premium is $7, how far are the break-evens from strike $50?";
  s9En.beats[1].en_narration = "Consider the total premium paid and the resulting break-even corridor.";
  s9En.beats[1].ui_state.question = quizScenario;
  if (s9En.beats[1].visual?.data) s9En.beats[1].visual.data.question = quizScenario;

  s9En.beats[2].en_tts = "Correct answer is A! Downside break-even is $43.00, upside break-even is $57.00, and profit at $65.00 is $8.00 per share.";
  s9En.beats[2].en_subtitle = "Correct answer is A! Break-evens are $43 and $57, with $8 profit at $65.";
  s9En.beats[2].en_narration = "Correct answer is A: Break-evens are $43 and $57, yielding $8 profit per share at $65.";
  s9En.beats[2].ui_state.question = quizScenario;
  s9En.beats[2].ui_state.answer = quizAnswer;
  s9En.beats[2].ui_state.correctIndex = 0;
  if (s9En.beats[2].visual?.data) {
    s9En.beats[2].visual.data.question = quizScenario;
    s9En.beats[2].visual.data.answer = quizAnswer;
    s9En.beats[2].visual.data.correctIndex = 0;
  }

  fs.writeFileSync(pEn, JSON.stringify(epEn, null, 2), 'utf8');
  console.log('✅ Updated English episode_raw.json for ch11_part2');
}

main().catch(err => {
  console.error('❌ Enrichment failed:', err);
  process.exit(1);
});

