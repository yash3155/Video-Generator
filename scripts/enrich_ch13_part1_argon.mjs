// scripts/enrich_ch13_part1_argon.mjs
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
          model: 'gemini-4-argon',
          messages: [
            { role: 'system', content: 'You are the Master Educational Dialogue Architect. Return ONLY valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2
        }),
        signal: AbortSignal.timeout(60000)
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
  console.log('Querying Gemini 4 Argon for Chapter 13 Part 1 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 13 Part 1 (Lognormal Property of Stock Prices, Arithmetic vs Geometric Returns Snapshot 13.1, Historical Volatility Estimation, and Trading Day Scaling Snapshot 13.2):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks why stock prices are modelled as lognormal rather than a normal distribution. Sharma ji explains: normal prices could turn negative; lognormal prices stay strictly positive with an Ito convexity adjustment of minus sigma squared over two!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks how a mutual fund can advertise a +25% average return when investors made zero profit. Sharma ji explains Business Snapshot 13.1: arithmetic average (+100% then -50% divided by 2 = +25%) distorts reality, while true geometric compound growth is 0%!
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

  const promptEn = `
For John C. Hull Chapter 13 Part 1 (Lognormal Property of Stock Prices, Arithmetic vs Geometric Returns Snapshot 13.1, Historical Volatility Estimation, and Trading Day Scaling Snapshot 13.2):
Provide 2 scenes of dialogue between Marcus (inquisitive quantitative analyst) and Dr. Vance (veteran market director) in crisp, professional English (<= 14 words per beat).

Scene 0: Marcus asks why option theory assumes lognormal stock prices instead of normal prices. Dr. Vance explains: normal distributions allow negative asset prices; lognormal modeling ensures positive prices with an Ito drift drag of minus sigma squared over two.
Beats:
b01: Marcus speaking (theme: "amber", avatar: "M")
b02: Dr. Vance speaking (theme: "teal", avatar: "V")
b03: Marcus speaking

Scene 10: Marcus asks how funds report a +25% average annual return when investors broke even. Dr. Vance explains Business Snapshot 13.1: arithmetic averaging (+100% then -50% gives 25%) misleads investors, whereas actual geometric compounding yields zero.
Beats:
b31: Marcus speaking
b32: Dr. Vance speaking
b33: Marcus speaking

Return ONLY a JSON object:
{
  "scene0": [
    { "id": "b01", "sender": "Marcus", "en_narration": "...", "en_subtitle": "..." },
    { "id": "b02", "sender": "Dr. Vance", "en_narration": "...", "en_subtitle": "..." },
    { "id": "b03", "sender": "Marcus", "en_narration": "...", "en_subtitle": "..." }
  ],
  "scene10": [
    { "id": "b31", "sender": "Marcus", "en_narration": "...", "en_subtitle": "..." },
    { "id": "b32", "sender": "Dr. Vance", "en_narration": "...", "en_subtitle": "..." },
    { "id": "b33", "sender": "Marcus", "en_narration": "...", "en_subtitle": "..." }
  ]
}
`;

  console.log('Requesting Argon dialogue synthesis for English...');
  const dialogueEn = await queryArgon(promptEn);

  // 1. Update Hindi episode
  const pHi = 'src/data/chapters/hull_derivatives/ch13_part1/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  epHi.scenes[0].title = "Origins: The Lognormal Price Invariant";
  epHi.scenes[0].badge = "Market Desk · Lognormal Asset Modeling";
  epHi.scenes[0].beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks why stock prices cannot follow simple normal distributions —' : '— Sharma ji explains positive price bounds and Ito drift adjustment —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Establish lognormal stock price behavior and Ito lemma adjustment.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  epHi.scenes[10].title = "Trading Desk Execution Rules";
  epHi.scenes[10].badge = "Desk Debrief · Arithmetic vs Geometric Returns";
  epHi.scenes[10].beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks how mutual funds report false double-digit gains —' : '— Sharma ji explains arithmetic bias versus true geometric compound returns —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Contrast arithmetic vs geometric compounding in financial performance.', sourceFactIds: ['fact-04', 'fact-05'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9Hi = epHi.scenes[9];
  s9Hi.title = "Active Recall Challenge";
  s9Hi.badge = "Arithmetic vs Geometric Compounding";
  s9Hi.beats[0].hindi_tts = "यदि एक फंड पहले साल सौ प्रतिशत लाभ और दूसरे साल पचास प्रतिशत हानि देता है, तो औसत रिटर्न क्या होगा?";
  s9Hi.beats[0].en_subtitle = "If a fund gains 100% then loses 50%, what are the arithmetic and geometric returns?";
  s9Hi.beats[0].ui_state.question = "If a stock portfolio starts at $100, gains 100% to $200 in year one, and loses 50% to $100 in year two: what are the arithmetic and geometric returns?";
  s9Hi.beats[0].ui_state.options = [
    { label: "A", text: "Arithmetic average is +25% per year, but the true geometric compound return is exactly 0%." },
    { label: "B", text: "Both arithmetic and geometric returns equal +25% per year." },
    { label: "C", text: "Arithmetic return is 0%, while geometric return is +50%." },
    { label: "D", text: "Arithmetic return is +100%, and geometric return is -50%." }
  ];
  s9Hi.beats[0].ui_state.correctAnswer = "A";
  s9Hi.beats[0].visual.kind = 'quiz';
  s9Hi.beats[0].visual.data = {
    question: s9Hi.beats[0].ui_state.question,
    options: s9Hi.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9Hi.beats[1].hindi_tts = "सोचिए क्या अंत में आपके पास शुरुआत की तरह ही केवल सौ डॉलर बचे हैं?";
  s9Hi.beats[1].en_subtitle = "Consider whether ending wealth equals original capital despite positive arithmetic mean.";
  s9Hi.beats[1].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[1].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[1].ui_state.correctAnswer = "A";
  s9Hi.beats[1].visual.kind = 'quiz';
  s9Hi.beats[1].visual.data = s9Hi.beats[0].visual.data;

  s9Hi.beats[2].hindi_tts = "सही उत्तर ए है। अंकगणितीय औसत पच्चीस प्रतिशत दिखता है लेकिन वास्तविक ज्यामितीय लाभ शून्य है।";
  s9Hi.beats[2].en_subtitle = "Correct is A: Arithmetic average is +25%, but actual geometric compound growth is 0%.";
  s9Hi.beats[2].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[2].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[2].ui_state.correctAnswer = "A";
  s9Hi.beats[2].ui_state.explanation = "Arithmetic average is (+100% - 50%)/2 = +25%. However, $100 -> $200 -> $100 represents zero net compound wealth growth (geometric return = 0%).";
  s9Hi.beats[2].visual.kind = 'quiz';
  s9Hi.beats[2].visual.data = {
    question: s9Hi.beats[0].ui_state.question,
    options: s9Hi.beats[0].ui_state.options,
    correctAnswer: "A",
    explanation: s9Hi.beats[2].ui_state.explanation
  };

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log(`✅ Saved enriched Hindi episode: ${pHi}`);

  // 2. Update English episode
  const pEn = 'src/data/chapters/hull_derivatives_en/ch13_part1/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "Origins: The Lognormal Price Invariant";
  epEn.scenes[0].badge = "Market Desk · Lognormal Asset Modeling";
  epEn.scenes[0].beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks why stock prices cannot follow simple normal distributions —' : '— Dr. Vance explains positive price bounds and Ito drift adjustment —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Establish lognormal stock price behavior and Ito lemma adjustment.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  epEn.scenes[10].title = "Trading Desk Execution Rules";
  epEn.scenes[10].badge = "Desk Debrief · Arithmetic vs Geometric Returns";
  epEn.scenes[10].beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks how mutual funds report false double-digit gains —' : '— Dr. Vance explains arithmetic bias versus true geometric compound returns —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Contrast arithmetic vs geometric compounding in financial performance.', sourceFactIds: ['fact-04', 'fact-05'] }
    }
  }));

  // Update Scene 9 Quiz beats for English
  const s9En = epEn.scenes[9];
  s9En.title = "Active Recall Challenge";
  s9En.badge = "Arithmetic vs Geometric Compounding";
  s9En.beats[0].en_narration = "If a portfolio starts at $100, gains 100% in year one, and loses 50% in year two, determine arithmetic and geometric returns.";
  s9En.beats[0].en_subtitle = "Evaluate arithmetic and geometric returns for a +100% then -50% sequence.";
  s9En.beats[0].ui_state.question = "If a stock portfolio starts at $100, gains 100% to $200 in year one, and loses 50% to $100 in year two: what are the arithmetic and geometric returns?";
  s9En.beats[0].ui_state.options = [
    { label: "A", text: "Arithmetic average is +25% per year, but the true geometric compound return is exactly 0%." },
    { label: "B", text: "Both arithmetic and geometric returns equal +25% per year." },
    { label: "C", text: "Arithmetic return is 0%, while geometric return is +50%." },
    { label: "D", text: "Arithmetic return is +100%, and geometric return is -50%." }
  ];
  s9En.beats[0].ui_state.correctAnswer = "A";
  s9En.beats[0].visual.kind = 'quiz';
  s9En.beats[0].visual.data = {
    question: s9En.beats[0].ui_state.question,
    options: s9En.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9En.beats[1].en_narration = "Consider whether ending portfolio wealth equals initial capital despite the reported positive arithmetic average.";
  s9En.beats[1].en_subtitle = "Compare ending capital $100 with starting capital $100.";
  s9En.beats[1].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[1].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[1].ui_state.correctAnswer = "A";
  s9En.beats[1].visual.kind = 'quiz';
  s9En.beats[1].visual.data = s9En.beats[0].visual.data;

  s9En.beats[2].en_narration = "The correct answer is A. The arithmetic average is +25%, but the true geometric compound growth rate is exactly zero.";
  s9En.beats[2].en_subtitle = "Correct is A: Arithmetic average is +25%, but true geometric compound growth is 0%.";
  s9En.beats[2].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[2].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[2].ui_state.correctAnswer = "A";
  s9En.beats[2].ui_state.explanation = "Arithmetic average is (+100% - 50%)/2 = +25%. However, $100 -> $200 -> $100 represents zero net compound wealth growth (geometric return = 0%).";
  s9En.beats[2].visual.kind = 'quiz';
  s9En.beats[2].visual.data = {
    question: s9En.beats[0].ui_state.question,
    options: s9En.beats[0].ui_state.options,
    correctAnswer: "A",
    explanation: s9En.beats[2].ui_state.explanation
  };

  fs.writeFileSync(pEn, JSON.stringify(epEn, null, 2), 'utf8');
  console.log(`✅ Saved enriched English episode: ${pEn}`);

  // 3. Save Cline mechanical manifest
  const clineDir = '.cline/tasks';
  if (!fs.existsSync(clineDir)) fs.mkdirSync(clineDir, { recursive: true });
  fs.writeFileSync(
    path.join(clineDir, 'hull_ch13_part1_dialogue_refine.json'),
    JSON.stringify({
      task: "Refine dialogues and validation for hull ch13_part1",
      dialogueHi,
      dialogueEn,
      status: "COMPLETED",
      timestamp: new Date().toISOString()
    }, null, 2),
    'utf8'
  );
  console.log('✅ Cline task manifest written: .cline/tasks/hull_ch13_part1_dialogue_refine.json');
}

main().catch(err => {
  console.error('❌ Error during dialogue enrichment:', err);
  process.exit(1);
});
