// scripts/enrich_ch10_part2_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 10 Part 2 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 10 Part 2 (Put-Call Parity, Parity Arbitrage, Merton Capital Structure as Options, Why Never Exercise American Calls Early):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju notices that buying a call and selling a put with strike K replicates owning the stock. Sharma ji formalizes Put-Call Parity: c + K*e^(-rT) = p + S0; if this equation breaks, arbitrageurs lock in guaranteed riskless profit!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks why one should never exercise an American call early on a non-dividend stock. Sharma ji explains that exercising early throws away time value and insurance; plus Merton proved company equity is simply a call option on corporate assets!
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
For John C. Hull Chapter 10 Part 2 (Put-Call Parity, Parity Arbitrage, Merton Capital Structure as Options, Why Never Exercise American Calls Early):
Provide 2 scenes of dialogue between Alex (inquisitive novice trader) and Marcus (veteran institutional risk manager) in crisp English narration and subtitles (<= 14 words per beat).

Scene 0: Alex sees that holding a long call and short put creates synthetic stock. Marcus introduces Put-Call Parity: c + K*e^(-rT) = p + S0, explaining that any pricing gap triggers instantaneous riskless arbitrage.
Beats:
b01: Alex speaking (theme: "amber", avatar: "A")
b02: Marcus speaking (theme: "teal", avatar: "M")
b03: Alex speaking

Scene 10: Alex asks why exercising an American call early on a non-dividend stock is irrational. Marcus proves early exercise forfeits insurance and interest on strike cash, connecting this to Merton's model where equity is a call on firm assets.
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
  const pHi = 'src/data/chapters/hull_derivatives/ch10_part2/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  const s0Hi = epHi.scenes[0];
  s0Hi.title = "The Synthetic Stock Discovery";
  s0Hi.badge = "Desk Dilemma · Put-Call Parity";
  s0Hi.beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju compares synthetic forward to stock —' : '— Sharma ji states the Put-Call Parity equation —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Establish the Put-Call Parity relationship and synthetic stock replication.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  const s10Hi = epHi.scenes[10];
  s10Hi.title = "Practical Application: Why American Calls Are Never Exercised Early";
  s10Hi.badge = "Desk Debrief · Capital Structure & Exercise";
  s10Hi.beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju investigates early exercise versus selling —' : '— Sharma ji explains time value preservation and Merton model —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove why American calls on non-dividend stocks should never be exercised early.', sourceFactIds: ['fact-05', 'fact-06'] }
    }
  }));

  // Ensure interactive quiz question is >= 18 words scenario in both data & ui_state
  const quizScenario = 'If market prices violate European put-call parity such that call plus discounted strike exceeds put plus spot, which portfolio locks in riskless cash today?';
  epHi.scenes.forEach(s => {
    s.beats?.forEach(b => {
      if (s.template === 'interactive_quiz' || b.visual?.kind === 'interactive_quiz' || b.ui_state?.question || b.visual?.data?.question) {
        if (b.visual?.data) b.visual.data.question = quizScenario;
        if (b.ui_state) b.ui_state.question = quizScenario;
      }
    });
  });

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log('✅ Updated Hindi episode_raw.json for ch10_part2');

  // Update English episode_raw.json
  const pEn = 'src/data/chapters/hull_derivatives_en/ch10_part2/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  const s0En = epEn.scenes[0];
  s0En.title = "The Synthetic Stock Discovery";
  s0En.badge = "Desk Dilemma · Put-Call Parity";
  s0En.beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex constructs synthetic forward stock —' : '— Marcus details Put-Call Parity arbitrage bounds —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Establish the Put-Call Parity relationship and synthetic stock replication.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  const s10En = epEn.scenes[10];
  s10En.title = "Practical Application: Why American Calls Are Never Exercised Early";
  s10En.badge = "Desk Debrief · Capital Structure & Exercise";
  s10En.beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex weighs early exercise against selling to market —' : '— Marcus explains time value retention and Merton firm equity model —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove why American calls on non-dividend stocks should never be exercised early.', sourceFactIds: ['fact-05', 'fact-06'] }
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
  console.log('✅ Updated English episode_raw.json for ch10_part2');
}

main().catch(err => {
  console.error('❌ Enrichment failed:', err);
  process.exit(1);
});

