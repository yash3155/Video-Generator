// scripts/enrich_ch12_part2_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 12 Part 2 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 12 Part 2 (Two-Step Binomial Trees, Dynamic Delta Replication, and American Put Early Exercise):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks Sharma ji how the binomial model extends across multiple time periods and whether delta stays constant. Sharma ji explains the two-step tree: terminal nodes (uu, ud, dd) recombine, and delta dynamically updates at every node because stock price changes!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks why American puts are ever exercised early before expiration. Sharma ji explains backward induction at Node C (S=$40): intrinsic payoff is $12.00 while holding continuation value is only $9.46. Immediate cash now earns interest, making early exercise optimal!
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
For John C. Hull Chapter 12 Part 2 (Two-Step Binomial Trees, Dynamic Delta Replication, and American Put Early Exercise):
Provide 2 scenes of dialogue between Marcus (inquisitive quantitative analyst) and Dr. Vance (veteran market director) in crisp, professional English (<= 14 words per beat).

Scene 0: Marcus asks how the binomial model extends across multiple steps and if delta remains constant. Dr. Vance explains the two-step recombining tree: terminal nodes (uu, ud, dd) emerge, and delta must be dynamically recalculated at each node as stock prices move.
Beats:
b01: Marcus speaking (theme: "amber", avatar: "M")
b02: Dr. Vance speaking (theme: "teal", avatar: "V")
b03: Marcus speaking

Scene 10: Marcus asks why American puts are ever exercised early before maturity. Dr. Vance explains backward induction at Node C (S=$40): intrinsic exercise payoff is $12.00 while continuation value is only $9.46. Immediate cash now earns interest, making early exercise optimal!
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
  const pHi = 'src/data/chapters/hull_derivatives/ch12_part2/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  epHi.scenes[0].title = "Origins: Multi-Step Trees & Dynamic Delta";
  epHi.scenes[0].badge = "Market Desk · Two-Step Lattice";
  epHi.scenes[0].beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks how trees handle multiple steps and evolving delta —' : '— Sharma ji explains recombining nodes and node-by-node delta hedging —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce two-step binomial trees and dynamic delta hedging.', sourceFactIds: ['fact-01', 'fact-03'] }
    }
  }));

  epHi.scenes[10].title = "Trading Desk Execution Rules";
  epHi.scenes[10].badge = "Desk Debrief · American Put Early Exercise";
  epHi.scenes[10].beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks why deep in-the-money American puts are exercised early —' : '— Sharma ji explains intrinsic value exceeding continuation value at node C —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove the American put early exercise condition and backward induction.', sourceFactIds: ['fact-05', 'fact-06'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9Hi = epHi.scenes[9];
  s9Hi.title = "Active Recall Challenge";
  s9Hi.badge = "Two-Step Trees & Early Exercise";
  s9Hi.beats[0].hindi_tts = "हल के टू-स्टेप अमेरिकन पुट ट्री में स्ट्राइक बावन और स्टॉक चालीस होने पर क्या शीघ्र निष्पादन करना उचित है?";
  s9Hi.beats[0].en_subtitle = "In Hull two-step American put tree with strike $52 and stock at $40, is early exercise optimal?";
  s9Hi.beats[0].ui_state.question = "In Hull's two-step American put tree with S0=$50, strike K=$52, r=5%, dt=1 year, at node C where stock drops to $40: continuation value is $9.46. What is the optimal decision and why?";
  s9Hi.beats[0].ui_state.options = [
    { label: "A", text: "Exercise early immediately because intrinsic value $12.00 exceeds continuation value $9.46." },
    { label: "B", text: "Hold until expiration because time value always protects options." },
    { label: "C", text: "Convert to a call option via put-call parity." },
    { label: "D", text: "Short additional delta shares to lock in the hedge." }
  ];
  s9Hi.beats[0].ui_state.correctAnswer = "A";
  s9Hi.beats[0].visual.kind = 'quiz';
  s9Hi.beats[0].visual.data = {
    question: s9Hi.beats[0].ui_state.question,
    options: s9Hi.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9Hi.beats[1].hindi_tts = "सोचिए क्या तुरंत मिलने वाले बारह डॉलर आगे जारी रखने के नौ दशमलव छियालीस डॉलर से अधिक हैं?";
  s9Hi.beats[1].en_subtitle = "Compare immediate intrinsic cashflow $12 against continuation value $9.46.";
  s9Hi.beats[1].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[1].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[1].ui_state.correctAnswer = "A";
  s9Hi.beats[1].visual.kind = 'quiz';
  s9Hi.beats[1].visual.data = s9Hi.beats[0].visual.data;

  s9Hi.beats[2].hindi_tts = "सही उत्तर ए है। बारह डॉलर का इंट्रिन्सिक कैशफ्लो नौ दशमलव छियालीस डॉलर के होल्डिंग मूल्य से अधिक है।";
  s9Hi.beats[2].en_subtitle = "Correct is A: Intrinsic value $12.00 exceeds continuation value $9.46, triggering early exercise.";
  s9Hi.beats[2].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[2].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[2].ui_state.correctAnswer = "A";
  s9Hi.beats[2].ui_state.explanation = "At node C, immediate exercise delivers K - S = $52 - $40 = $12.00, which strictly exceeds the discounted continuation value of $9.4636.";
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
  const pEn = 'src/data/chapters/hull_derivatives_en/ch12_part2/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "Origins: Multi-Step Trees & Dynamic Delta";
  epEn.scenes[0].badge = "Market Desk · Two-Step Lattice";
  epEn.scenes[0].beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks how trees handle multiple steps and evolving delta —' : '— Dr. Vance explains recombining nodes and dynamic delta hedging —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce two-step binomial trees and dynamic delta hedging.', sourceFactIds: ['fact-01', 'fact-03'] }
    }
  }));

  epEn.scenes[10].title = "Trading Desk Execution Rules";
  epEn.scenes[10].badge = "Desk Debrief · American Put Early Exercise";
  epEn.scenes[10].beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks why deep in-the-money American puts are exercised early —' : '— Dr. Vance explains intrinsic value exceeding continuation value at node C —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove the American put early exercise condition and backward induction.', sourceFactIds: ['fact-05', 'fact-06'] }
    }
  }));

  // Update Scene 9 Quiz beats for English
  const s9En = epEn.scenes[9];
  s9En.title = "Active Recall Challenge";
  s9En.badge = "Two-Step Trees & Early Exercise";
  s9En.beats[0].en_narration = "In Hull's two-step American put tree with strike $52 and stock at $40, evaluate whether early exercise is optimal.";
  s9En.beats[0].en_subtitle = "Evaluate if early exercise is optimal when stock is at $40 with strike $52.";
  s9En.beats[0].ui_state.question = "In Hull's two-step American put tree with S0=$50, strike K=$52, r=5%, dt=1 year, at node C where stock drops to $40: continuation value is $9.46. What is the optimal decision and why?";
  s9En.beats[0].ui_state.options = [
    { label: "A", text: "Exercise early immediately because intrinsic value $12.00 exceeds continuation value $9.46." },
    { label: "B", text: "Hold until expiration because time value always protects options." },
    { label: "C", text: "Convert to a call option via put-call parity." },
    { label: "D", text: "Short additional delta shares to lock in the hedge." }
  ];
  s9En.beats[0].ui_state.correctAnswer = "A";
  s9En.beats[0].visual.kind = 'quiz';
  s9En.beats[0].visual.data = {
    question: s9En.beats[0].ui_state.question,
    options: s9En.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9En.beats[1].en_narration = "Consider whether the immediate cash payout of twelve dollars exceeds the continuation value of nine dollars and forty-six cents.";
  s9En.beats[1].en_subtitle = "Compare immediate intrinsic cashflow $12 against continuation value $9.46.";
  s9En.beats[1].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[1].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[1].ui_state.correctAnswer = "A";
  s9En.beats[1].visual.kind = 'quiz';
  s9En.beats[1].visual.data = s9En.beats[0].visual.data;

  s9En.beats[2].en_narration = "The correct answer is A. Immediate exercise delivers twelve dollars intrinsic value, exceeding the nine point forty-six dollar holding value.";
  s9En.beats[2].en_subtitle = "Correct is A: Intrinsic value $12.00 exceeds continuation value $9.46, triggering early exercise.";
  s9En.beats[2].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[2].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[2].ui_state.correctAnswer = "A";
  s9En.beats[2].ui_state.explanation = "At node C, immediate exercise delivers K - S = $52 - $40 = $12.00, which strictly exceeds the discounted continuation value of $9.4636.";
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
    path.join(clineDir, 'hull_ch12_part2_dialogue_refine.json'),
    JSON.stringify({
      task: "Refine dialogues and validation for hull ch12_part2",
      dialogueHi,
      dialogueEn,
      status: "COMPLETED",
      timestamp: new Date().toISOString()
    }, null, 2),
    'utf8'
  );
  console.log('✅ Cline task manifest written: .cline/tasks/hull_ch12_part2_dialogue_refine.json');
}

main().catch(err => {
  console.error('❌ Error during dialogue enrichment:', err);
  process.exit(1);
});

