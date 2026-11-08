// scripts/enrich_ch09_part2_argon.mjs
import fs from 'fs';
import path from 'path';

async function queryArgon(prompt) {
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
    })
  });
  if (!res.ok) throw new Error(`Argon HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.choices[0].message.content.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

async function main() {
  console.log('Querying Gemini 4 Argon for Chapter 9 Part 2 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 9 Part 2 (Mechanics of Options Markets: Market Makers & Spreads, Margin Requirements for Writers, OCC Clearing, Warrants vs Options, ESOs & Convertibles):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju wants to sell naked call options to collect "free premium", thinking market makers make guaranteed profits from spreads. Sharma ji warns him about huge margin requirements (20% of stock plus premium) and the Options Clearing Corporation (OCC)'s daily mark-to-market.
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks why companies issue warrants and employee stock options (ESOs) instead of regular exchange-traded options. Sharma ji explains that warrants and ESOs create new shares and dilute equity, while exchange-traded options are zero-sum contracts cleared by the OCC!
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
For John C. Hull Chapter 9 Part 2 (Mechanics of Options Markets: Market Makers & Spreads, Margin Requirements for Writers, OCC Clearing, Warrants vs Options, ESOs & Convertibles):
Provide 2 scenes of dialogue between Alex (inquisitive novice trader) and Marcus (veteran institutional risk manager) in crisp English narration and subtitles (<= 14 words per beat).

Scene 0: Alex wants to write naked call options to capture easy premium from bid-ask spreads. Marcus warns him that option writing requires heavy margin collateral (20% stock value plus premium) and strict OCC clearinghouse daily mark-to-market.
Beats:
b01: Alex speaking (theme: "amber", avatar: "A")
b02: Marcus speaking (theme: "teal", avatar: "M")
b03: Alex speaking

Scene 10: Alex asks why corporations issue corporate warrants and employee stock options instead of regular exchange-traded options. Marcus explains that warrants and ESOs dilute equity and inject fresh corporate capital, whereas exchange-traded options are zero-sum contracts cleared by the OCC.
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

  // Update Hindi episode_raw.json
  const pHi = 'src/data/chapters/hull_derivatives/ch09_part2/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  const s0Hi = epHi.scenes[0];
  s0Hi.title = "The Option Writer Margin Shock";
  s0Hi.badge = "Desk Dilemma · Writing & Margin";
  s0Hi.beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju considers writing naked calls for premium —' : '— Sharma ji warns about margin collateral rules —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'chat_story',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { role: 'dialogue_exchange', focus: b.sender }
    }
  }));

  const s10Hi = epHi.scenes[10];
  s10Hi.title = "Practical Application: Corporate Warrants vs Exchange Options";
  s10Hi.badge = "Desk Debrief · Equity Dilution";
  s10Hi.beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju analyzes corporate warrant dilution —' : '— Sharma ji distinguishes warrants from exchange options —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'chat_story',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { role: 'dialogue_exchange', focus: b.sender }
    }
  }));

  // Ensure interactive quiz question is >= 18 words scenario in both data & ui_state
  const quizScenario = 'When an institutional investor writes a naked uncovered call option on stock, how does the Options Clearing Corporation calculate the required initial margin collateral?';
  epHi.scenes.forEach(s => {
    s.beats?.forEach(b => {
      if (s.template === 'interactive_quiz' || b.visual?.kind === 'interactive_quiz' || b.ui_state?.question || b.visual?.data?.question) {
        if (b.visual?.data) b.visual.data.question = quizScenario;
        if (b.ui_state) b.ui_state.question = quizScenario;
      }
    });
  });

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log('✅ Updated Hindi episode_raw.json for ch09_part2');

  // Update English episode_raw.json
  const pEn = 'src/data/chapters/hull_derivatives_en/ch09_part2/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  const s0En = epEn.scenes[0];
  s0En.title = "The Option Writer Margin Shock";
  s0En.badge = "Desk Dilemma · Writing & Margin";
  s0En.beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex plans to collect option premium —' : '— Marcus explains OCC margin collateral rules —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'chat_story',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { role: 'dialogue_exchange', focus: b.sender }
    }
  }));

  const s10En = epEn.scenes[10];
  s10En.title = "Practical Application: Corporate Warrants vs Exchange Options";
  s10En.badge = "Desk Debrief · Equity Dilution";
  s10En.beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex compares warrants with exchange options —' : '— Marcus explains dilution and capital injection —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'chat_story',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { role: 'dialogue_exchange', focus: b.sender }
    }
  }));

  epEn.scenes.forEach(s => {
    s.beats?.forEach(b => {
      if (s.template === 'interactive_quiz' || b.visual?.kind === 'interactive_quiz' || b.ui_state?.question || b.visual?.data?.question) {
        if (b.visual?.data) b.visual.data.question = quizScenario;
        if (b.ui_state) b.ui_state.question = quizScenario;
      }
    });
  });

  fs.writeFileSync(pEn, JSON.stringify(epEn, null, 2), 'utf8');
  console.log('✅ Updated English episode_raw.json for ch09_part2');
}

main().catch(err => {
  console.error('❌ Enrichment failed:', err);
  process.exit(1);
});

