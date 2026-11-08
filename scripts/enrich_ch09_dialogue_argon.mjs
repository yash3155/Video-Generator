// scripts/enrich_ch09_dialogue_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 9 Part 1 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 9 Part 1 (Mechanics of Options Markets: Call vs Put, Strike Price K, Expiration T, Upfront Premium, Right vs Obligation):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju wants to buy a stock call option because he thinks the price will rise, but worries about losing everything. Sharma ji explains that a call option gives the right, not the obligation, to buy at strike price K; the max loss is strictly capped at the premium paid!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks what happens if the stock price drops below the strike price at expiration. Sharma ji explains that the option simply expires worthless (out-of-the-money), so he loses only the premium, unlike futures where losses are unlimited!
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

  console.log('Requesting Argon dialogue synthesis...');
  const dialogueHi = await queryArgon(promptHi);
  console.log('✅ Received Argon dialogue synthesis for Hindi!');

  // Now update Hindi episode_raw.json
  const pHi = 'src/data/chapters/hull_derivatives/ch09_part1/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  // Scene 0
  const s0 = epHi.scenes[0];
  s0.title = "The Option Buyer Dilemma";
  s0.badge = "Desk Dilemma · Options Intro";
  s0.beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju reviews the options chain with hesitation —' : '— Sharma ji clarifies option rights vs obligations —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: {
        teachingObjective: "Introduce call option rights versus obligations and capped downside risk.",
        sourceFactIds: ["fact-01", "fact-02"]
      }
    }
  }));

  // Scene 10
  const s10 = epHi.scenes[10];
  s10.title = "Practical Application: Limited Loss vs Unlimited Upside";
  s10.badge = "Application · Strike Mechanics";
  s10.beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju calculates the expiration scenario —' : '— Sharma ji highlights asymmetric risk —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: {
        teachingObjective: "Demonstrate options expiration outcome when spot is below strike price.",
        sourceFactIds: ["fact-01", "fact-02"]
      }
    }
  }));

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log('✅ Updated Hindi episode_raw.json with Argon dialogue!');

  // Now create English version for Alex & Marcus
  const pEn = 'src/data/chapters/hull_derivatives_en/ch09_part1/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "The Option Buyer Dilemma";
  epEn.scenes[0].badge = "Desk Dilemma · Options Intro";
  epEn.scenes[0].beats = dialogueHi.scene0.map(b => {
    const sender = b.sender === 'Raju' ? 'Alex' : 'Marcus';
    const avatar = b.sender === 'Raju' ? 'A' : 'M';
    const text = b.en_subtitle;
    return {
      id: b.id,
      hindi_tts: text,
      en_subtitle: text,
      en_narration: text,
      pauseAfterMs: 400,
      ui_state: {
        stageDirections: [sender === 'Alex' ? '— Alex inspects the options board —' : '— Marcus explains the right vs obligation contract —'],
        messages: [{ sender, avatar, text, theme: sender === 'Alex' ? 'amber' : 'teal', align: sender === 'Alex' ? 'left' : 'right' }]
      },
      visual: {
        kind: 'conversation',
        data: {
          messages: [{ sender, avatar, text, theme: sender === 'Alex' ? 'amber' : 'teal', align: sender === 'Alex' ? 'left' : 'right' }]
        },
        semantics: {
          teachingObjective: "Introduce call option rights versus obligations and capped downside risk.",
          sourceFactIds: ["fact-01", "fact-02"]
        }
      }
    };
  });

  epEn.scenes[10].title = "Practical Application: Limited Loss vs Unlimited Upside";
  epEn.scenes[10].badge = "Application · Strike Mechanics";
  epEn.scenes[10].beats = dialogueHi.scene10.map(b => {
    const sender = b.sender === 'Raju' ? 'Alex' : 'Marcus';
    const avatar = b.sender === 'Raju' ? 'A' : 'M';
    const text = b.en_subtitle;
    return {
      id: b.id,
      hindi_tts: text,
      en_subtitle: text,
      en_narration: text,
      pauseAfterMs: 400,
      ui_state: {
        stageDirections: [sender === 'Alex' ? '— Alex checks expiration payout asymmetry —' : '— Marcus reinforces the option asymmetry principle —'],
        messages: [{ sender, avatar, text, theme: sender === 'Alex' ? 'amber' : 'teal', align: sender === 'Alex' ? 'left' : 'right' }]
      },
      visual: {
        kind: 'conversation',
        data: {
          messages: [{ sender, avatar, text, theme: sender === 'Alex' ? 'amber' : 'teal', align: sender === 'Alex' ? 'left' : 'right' }]
        },
        semantics: {
          teachingObjective: "Demonstrate options expiration outcome when spot is below strike price.",
          sourceFactIds: ["fact-01", "fact-02"]
        }
      }
    };
  });

  fs.writeFileSync(pEn, JSON.stringify(epEn, null, 2), 'utf8');
  console.log('✅ Updated English episode_raw.json with Argon dialogue!');
}

main().catch(console.error);
