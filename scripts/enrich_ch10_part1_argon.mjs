// scripts/enrich_ch10_part1_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 10 Part 1 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 10 Part 1 (Properties of Stock Options: Six Factors S0, K, T, Volatility, r, Dividends; Upper & Lower Bounds; Arbitrage Violations):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks Sharma ji why his call option premium dropped even though the stock price did not change. Sharma ji explains that time decay (Theta) and falling volatility erode option prices; six interrelated factors govern every option contract.
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks what happens if a call option trades below its theoretical lower bound S0 - K*e^(-rT). Sharma ji explains the no-arbitrage proof: buy the underpriced call, borrow the discounted strike, short the stock, and lock in guaranteed riskless profit!
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
For John C. Hull Chapter 10 Part 1 (Properties of Stock Options: Six Factors S0, K, T, Volatility, r, Dividends; Upper & Lower Bounds; Arbitrage Violations):
Provide 2 scenes of dialogue between Alex (inquisitive novice trader) and Marcus (veteran institutional risk manager) in crisp English narration and subtitles (<= 14 words per beat).

Scene 0: Alex wonders why his call option lost value when the underlying stock stayed flat. Marcus explains that volatility contraction and calendar time decay eroded its extrinsic value; six key variables determine option prices.
Beats:
b01: Alex speaking (theme: "amber", avatar: "A")
b02: Marcus speaking (theme: "teal", avatar: "M")
b03: Alex speaking

Scene 10: Alex asks what occurs if a European call drops below the theoretical lower bound S0 - K*e^(-rT). Marcus outlines the classic arbitrage trade: buy the cheap call, borrow the discounted strike, short the stock, and capture riskless cash!
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
  const pHi = 'src/data/chapters/hull_derivatives/ch10_part1/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  const s0Hi = epHi.scenes[0];
  s0Hi.title = "The Option Pricing Mystery";
  s0Hi.badge = "Desk Dilemma · Six Factors";
  s0Hi.beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju inspects the decaying call premium —' : '— Sharma ji explains the six pricing forces —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce the six primary variables governing option prices.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  const s10Hi = epHi.scenes[10];
  s10Hi.title = "Practical Application: Arbitraging Lower Bound Violations";
  s10Hi.badge = "Desk Debrief · Bound Arbitrage";
  s10Hi.beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju identifies a call trading below lower bound —' : '— Sharma ji executes the synthetic replication arbitrage —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Demonstrate riskless arbitrage when call price violates lower theoretical bound.', sourceFactIds: ['fact-05', 'fact-06'] }
    }
  }));

  // Ensure interactive quiz question is >= 18 words scenario in both data & ui_state
  const quizScenario = 'If a European call option on a non-dividend stock trades below its theoretical lower bound of S0 minus discounted strike, how does an arbitrageur capture riskless profit?';
  epHi.scenes.forEach(s => {
    s.beats?.forEach(b => {
      if (s.template === 'interactive_quiz' || b.visual?.kind === 'interactive_quiz' || b.ui_state?.question || b.visual?.data?.question) {
        if (b.visual?.data) b.visual.data.question = quizScenario;
        if (b.ui_state) b.ui_state.question = quizScenario;
      }
    });
  });

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log('✅ Updated Hindi episode_raw.json for ch10_part1');

  // Update English episode_raw.json
  const pEn = 'src/data/chapters/hull_derivatives_en/ch10_part1/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  const s0En = epEn.scenes[0];
  s0En.title = "The Option Pricing Mystery";
  s0En.badge = "Desk Dilemma · Six Factors";
  s0En.beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex questions why his flat stock call lost value —' : '— Marcus highlights time decay and volatility contraction —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce the six primary variables governing option prices.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  const s10En = epEn.scenes[10];
  s10En.title = "Practical Application: Arbitraging Lower Bound Violations";
  s10En.badge = "Desk Debrief · Bound Arbitrage";
  s10En.beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex spot an underpriced European call —' : '— Marcus executes synthetic replication to lock profit —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Demonstrate riskless arbitrage when call price violates lower theoretical bound.', sourceFactIds: ['fact-05', 'fact-06'] }
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
  console.log('✅ Updated English episode_raw.json for ch10_part1');
}

main().catch(err => {
  console.error('❌ Enrichment failed:', err);
  process.exit(1);
});

