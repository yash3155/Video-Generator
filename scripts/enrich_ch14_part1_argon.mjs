// scripts/enrich_ch14_part1_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 14 Part 1 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 14 (Employee Stock Options, Vesting & Forfeiture, FAS 123R / ASC 718, Dilution Snapshot 14.1, Backdating Scandals, and Hull-White Valuation):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks Sharma ji how employee stock options differ from regular exchange-traded call options. Sharma ji explains: ESOs are non-transferable, require 3-4 years vesting, and forfeit immediately if an employee leaves the company!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks why corporate backdating caused such a major scandal on Wall Street. Sharma ji explains: companies secretly backdated grants to past stock price dips for instant profits, avoiding proper FAS 123R compensation expense reporting!
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
For John C. Hull Chapter 14 (Employee Stock Options, Vesting & Forfeiture, FAS 123R / ASC 718, Dilution Snapshot 14.1, Backdating Scandals, and Hull-White Valuation):
Provide 2 scenes of dialogue between Marcus (inquisitive quantitative analyst) and Dr. Vance (veteran market director) in crisp, professional English (<= 14 words per beat).

Scene 0: Marcus asks how employee stock options differ fundamentally from listed exchange options. Dr. Vance explains: ESOs are completely non-transferable, require multi-year vesting, and face total forfeiture if the employee leaves early.
Beats:
b01: Marcus speaking (theme: "amber", avatar: "M")
b02: Dr. Vance speaking (theme: "teal", avatar: "V")
b03: Marcus speaking

Scene 10: Marcus asks why option backdating sparked such widespread corporate governance investigations. Dr. Vance explains: firms picked past stock price troughs to award in-the-money options, evading mandatory FAS 123R compensation expensing.
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
  const pHi = 'src/data/chapters/hull_derivatives/ch14_part1/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  epHi.scenes[0].title = "Origins: Corporate Incentive Architecture";
  epHi.scenes[0].badge = "Market Desk · Employee Stock Options";
  epHi.scenes[0].beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks how employee stock options differ from market contracts —' : '— Sharma ji explains non-transferability, vesting schedules, and forfeiture —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Establish ESO contractual design, vesting, and forfeiture mechanics.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  epHi.scenes[10].title = "Trading Desk Execution Rules";
  epHi.scenes[10].badge = "Desk Debrief · Backdating & Governance";
  epHi.scenes[10].beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks why backdating options created corporate fraud scandals —' : '— Sharma ji explains historical strike manipulation and FAS 123R compliance —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Examine corporate option backdating scandals and FAS 123R expensing.', sourceFactIds: ['fact-04', 'fact-06'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9Hi = epHi.scenes[9];
  s9Hi.title = "Active Recall Challenge";
  s9Hi.badge = "BSM vs Hull-White ESO Valuation";
  s9Hi.beats[0].hindi_tts = "स्टैंडर्ड ब्लैक-शोल्स मॉडल कर्मचारी स्टॉक विकल्पों का मूल्य हल-व्हाइट मॉडल की तुलना में अधिक क्यों आंकता है?";
  s9Hi.beats[0].en_subtitle = "Why does standard BSM overvalue ESOs compared to the Hull-White modified model?";
  s9Hi.beats[0].ui_state.question = "Why does the standard Black-Scholes model overvalue Employee Stock Options compared to the Hull-White modified binomial model?";
  s9Hi.beats[0].ui_state.options = [
    { label: "A", text: "BSM assumes options are held to maturity without forfeiture, ignoring employee departure rates and non-transferable early exercise." },
    { label: "B", text: "BSM uses continuous compounding instead of daily compounding." },
    { label: "C", text: "BSM assumes volatility is zero for employee compensation." },
    { label: "D", text: "BSM only applies to commodities and foreign currencies." }
  ];
  s9Hi.beats[0].ui_state.correctAnswer = "A";
  s9Hi.beats[0].visual.kind = 'quiz';
  s9Hi.beats[0].visual.data = {
    question: s9Hi.beats[0].ui_state.question,
    options: s9Hi.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9Hi.beats[1].hindi_tts = "सोचिए क्या कर्मचारी नौकरी छोड़ने पर विकल्प गंवा देते हैं और जल्दी मुनाफा बुक करते हैं?";
  s9Hi.beats[1].en_subtitle = "Consider whether non-diversified employees exercise early or forfeit options upon departure.";
  s9Hi.beats[1].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[1].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[1].ui_state.correctAnswer = "A";
  s9Hi.beats[1].visual.kind = 'quiz';
  s9Hi.beats[1].visual.data = s9Hi.beats[0].visual.data;

  s9Hi.beats[2].hindi_tts = "सही उत्तर ए है। बीएसएम मैच्योरिटी तक होल्डिंग मानता है जबकि हल-व्हाइट मॉडल जल्दी एग्जिट और जब्ती शामिल करता है।";
  s9Hi.beats[2].en_subtitle = "Correct is A: BSM ignores early exercise and forfeiture, overstating true ESO fair value.";
  s9Hi.beats[2].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[2].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[2].ui_state.correctAnswer = "A";
  s9Hi.beats[2].ui_state.explanation = "BSM assumes transferable options held to maturity. The Hull-White model accounts for post-vesting early exercise at multiple M and annual employee forfeiture rate lambda.";
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
  const pEn = 'src/data/chapters/hull_derivatives_en/ch14_part1/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "Origins: Corporate Incentive Architecture";
  epEn.scenes[0].badge = "Market Desk · Employee Stock Options";
  epEn.scenes[0].beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks how employee stock options differ from market contracts —' : '— Dr. Vance explains non-transferability, vesting schedules, and forfeiture —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Establish ESO contractual design, vesting, and forfeiture mechanics.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  epEn.scenes[10].title = "Trading Desk Execution Rules";
  epEn.scenes[10].badge = "Desk Debrief · Backdating & Governance";
  epEn.scenes[10].beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks why backdating options created corporate fraud scandals —' : '— Dr. Vance explains historical strike manipulation and FAS 123R compliance —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Examine corporate option backdating scandals and FAS 123R expensing.', sourceFactIds: ['fact-04', 'fact-06'] }
    }
  }));

  // Update Scene 9 Quiz beats for English
  const s9En = epEn.scenes[9];
  s9En.title = "Active Recall Challenge";
  s9En.badge = "BSM vs Hull-White ESO Valuation";
  s9En.beats[0].en_narration = "Evaluate why the standard Black-Scholes model overvalues Employee Stock Options relative to the Hull-White model.";
  s9En.beats[0].en_subtitle = "Why does standard BSM overvalue ESOs compared to the Hull-White model?";
  s9En.beats[0].ui_state.question = "Why does the standard Black-Scholes model overvalue Employee Stock Options compared to the Hull-White modified binomial model?";
  s9En.beats[0].ui_state.options = [
    { label: "A", text: "BSM assumes options are held to maturity without forfeiture, ignoring employee departure rates and non-transferable early exercise." },
    { label: "B", text: "BSM uses continuous compounding instead of daily compounding." },
    { label: "C", text: "BSM assumes volatility is zero for employee compensation." },
    { label: "D", text: "BSM only applies to commodities and foreign currencies." }
  ];
  s9En.beats[0].ui_state.correctAnswer = "A";
  s9En.beats[0].visual.kind = 'quiz';
  s9En.beats[0].visual.data = {
    question: s9En.beats[0].ui_state.question,
    options: s9En.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9En.beats[1].en_narration = "Consider how non-diversified employees exercise early or forfeit unvested options when leaving the company.";
  s9En.beats[1].en_subtitle = "Consider whether non-diversified employees exercise early or forfeit options upon departure.";
  s9En.beats[1].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[1].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[1].ui_state.correctAnswer = "A";
  s9En.beats[1].visual.kind = 'quiz';
  s9En.beats[1].visual.data = s9En.beats[0].visual.data;

  s9En.beats[2].en_narration = "The correct answer is A. BSM ignores early exercise and forfeiture, significantly overstating the option's fair value.";
  s9En.beats[2].en_subtitle = "Correct is A: BSM ignores early exercise and forfeiture, overstating true ESO fair value.";
  s9En.beats[2].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[2].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[2].ui_state.correctAnswer = "A";
  s9En.beats[2].ui_state.explanation = "BSM assumes transferable options held to maturity. The Hull-White model accounts for post-vesting early exercise at multiple M and annual employee forfeiture rate lambda.";
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
    path.join(clineDir, 'hull_ch14_part1_dialogue_refine.json'),
    JSON.stringify({
      task: "Refine dialogues and validation for hull ch14_part1",
      dialogueHi,
      dialogueEn,
      status: "COMPLETED",
      timestamp: new Date().toISOString()
    }, null, 2),
    'utf8'
  );
  console.log('✅ Cline task manifest written: .cline/tasks/hull_ch14_part1_dialogue_refine.json');
}

main().catch(err => {
  console.error('❌ Error during dialogue enrichment:', err);
  process.exit(1);
});

