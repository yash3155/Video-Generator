// scripts/enrich_ch13_part2_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 13 Part 2 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 13 Part 2 (Black-Scholes-Merton Pricing Formulas, N(d1) and N(d2) Intuition, Implied Volatility VIX, Dividend Adjustments, and American Call Early Exercise):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks Sharma ji what the cumulative normal terms N(d1) and N(d2) actually signify in the BSM formula. Sharma ji explains: N(d2) is the probability of expiring in-the-money, while N(d1) is the dynamic delta hedge ratio!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks when an American call option on a dividend-paying stock should be exercised early. Sharma ji explains the rule: only immediately prior to an ex-dividend date, when the dividend cash D exceeds the interest lost on paying strike K early!
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
For John C. Hull Chapter 13 Part 2 (Black-Scholes-Merton Pricing Formulas, N(d1) and N(d2) Intuition, Implied Volatility VIX, Dividend Adjustments, and American Call Early Exercise):
Provide 2 scenes of dialogue between Marcus (inquisitive quantitative analyst) and Dr. Vance (veteran market director) in crisp, professional English (<= 14 words per beat).

Scene 0: Marcus asks what N(d1) and N(d2) represent intuitively in the Black-Scholes-Merton equation. Dr. Vance explains: N(d2) is the risk-neutral probability of expiring in-the-money, while N(d1) is the option's dynamic delta hedge ratio.
Beats:
b01: Marcus speaking (theme: "amber", avatar: "M")
b02: Dr. Vance speaking (theme: "teal", avatar: "V")
b03: Marcus speaking

Scene 10: Marcus asks when it is optimal to exercise an American call early on a dividend-paying equity. Dr. Vance explains the ex-dividend rule: exercise immediately before ex-date only if dividend D exceeds interest lost on early strike payment.
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
  const pHi = 'src/data/chapters/hull_derivatives/ch13_part2/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  epHi.scenes[0].title = "Origins: The Analytical BSM Equation";
  epHi.scenes[0].badge = "Market Desk · BSM Option Mechanics";
  epHi.scenes[0].beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks what cumulative probabilities N(d1) and N(d2) represent —' : '— Sharma ji explains exercise probability N(d2) and delta replication N(d1) —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Explain N(d1) delta and N(d2) exercise probability in Black-Scholes-Merton.', sourceFactIds: ['fact-01', 'fact-04'] }
    }
  }));

  epHi.scenes[10].title = "Trading Desk Execution Rules";
  epHi.scenes[10].badge = "Desk Debrief · American Call Early Exercise";
  epHi.scenes[10].beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks when American calls are exercised early on dividend stocks —' : '— Sharma ji explains dividend capture versus interest loss on strike K —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove American call early exercise conditions prior to ex-dividend dates.', sourceFactIds: ['fact-07', 'fact-08'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9Hi = epHi.scenes[9];
  s9Hi.title = "Active Recall Challenge";
  s9Hi.badge = "BSM Call Valuation Calculation";
  s9Hi.beats[0].hindi_tts = "हल के बीएसएम उदाहरण में बयालीस के स्टॉक और चालीस की स्ट्राइक पर कॉल ऑप्शन का फेयर प्राइस क्या होगा?";
  s9Hi.beats[0].en_subtitle = "In Hull benchmark BSM example with stock $42 and strike $40, what is the fair call price?";
  s9Hi.beats[0].ui_state.question = "In Hull's benchmark BSM example with S0=$42, strike K=$40, r=10%, sigma=20%, T=0.5 years: if N(d1)=0.7791 and N(d2)=0.7350, what is the European call option price?";
  s9Hi.beats[0].ui_state.options = [
    { label: "A", text: "The European call price is $4.76 per share ($476 per 100-share contract)." },
    { label: "B", text: "The European call price is $2.00 per share based solely on intrinsic value." },
    { label: "C", text: "The European call price is $10.00 per share due to high volatility." },
    { label: "D", text: "The European call price is $0.81 per share matching the put option." }
  ];
  s9Hi.beats[0].ui_state.correctAnswer = "A";
  s9Hi.beats[0].visual.kind = 'quiz';
  s9Hi.beats[0].visual.data = {
    question: s9Hi.beats[0].ui_state.question,
    options: s9Hi.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9Hi.beats[1].hindi_tts = "सोचिए बयालीस गुना एन डी वन में से चालीस का डिस्काउंटेड एन डी टू घटाने पर क्या मान आता है?";
  s9Hi.beats[1].en_subtitle = "Subtract discounted strike times N(d2) from spot times N(d1).";
  s9Hi.beats[1].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[1].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[1].ui_state.correctAnswer = "A";
  s9Hi.beats[1].visual.kind = 'quiz';
  s9Hi.beats[1].visual.data = s9Hi.beats[0].visual.data;

  s9Hi.beats[2].hindi_tts = "सही उत्तर ए है। बत्तीस दशमलव बहत्तर में से सत्ताईस दशमलव छियानवे घटाने पर चार दशमलव छिहत्तर डॉलर प्राप्त होता है।";
  s9Hi.beats[2].en_subtitle = "Correct is A: $32.72 minus $27.96 yields $4.76 per share ($476 per contract).";
  s9Hi.beats[2].ui_state.question = s9Hi.beats[0].ui_state.question;
  s9Hi.beats[2].ui_state.options = s9Hi.beats[0].ui_state.options;
  s9Hi.beats[2].ui_state.correctAnswer = "A";
  s9Hi.beats[2].ui_state.explanation = "c = 42*0.7791 - 40*exp(-0.05)*0.7350 = 32.722 - 27.966 = $4.756 ($4.76 per share).";
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
  const pEn = 'src/data/chapters/hull_derivatives_en/ch13_part2/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "Origins: The Analytical BSM Equation";
  epEn.scenes[0].badge = "Market Desk · BSM Option Mechanics";
  epEn.scenes[0].beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks what cumulative probabilities N(d1) and N(d2) represent —' : '— Dr. Vance explains exercise probability N(d2) and delta replication N(d1) —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Explain N(d1) delta and N(d2) exercise probability in Black-Scholes-Merton.', sourceFactIds: ['fact-01', 'fact-04'] }
    }
  }));

  epEn.scenes[10].title = "Trading Desk Execution Rules";
  epEn.scenes[10].badge = "Desk Debrief · American Call Early Exercise";
  epEn.scenes[10].beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_narration: b.en_narration,
    en_subtitle: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Marcus' ? '— Marcus asks when American calls are exercised early on dividend stocks —' : '— Dr. Vance explains dividend capture versus interest loss on strike K —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Marcus' ? 'M' : 'V', text: b.en_subtitle, theme: b.sender === 'Marcus' ? 'amber' : 'teal', align: b.sender === 'Marcus' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove American call early exercise conditions prior to ex-dividend dates.', sourceFactIds: ['fact-07', 'fact-08'] }
    }
  }));

  // Update Scene 9 Quiz beats for English
  const s9En = epEn.scenes[9];
  s9En.title = "Active Recall Challenge";
  s9En.badge = "BSM Call Valuation Calculation";
  s9En.beats[0].en_narration = "In Hull's benchmark BSM example with stock at $42 and strike $40, calculate the fair European call price.";
  s9En.beats[0].en_subtitle = "Evaluate the European call option price for S0=$42, K=$40, and r=10%.";
  s9En.beats[0].ui_state.question = "In Hull's benchmark BSM example with S0=$42, strike K=$40, r=10%, sigma=20%, T=0.5 years: if N(d1)=0.7791 and N(d2)=0.7350, what is the European call option price?";
  s9En.beats[0].ui_state.options = [
    { label: "A", text: "The European call price is $4.76 per share ($476 per 100-share contract)." },
    { label: "B", text: "The European call price is $2.00 per share based solely on intrinsic value." },
    { label: "C", text: "The European call price is $10.00 per share due to high volatility." },
    { label: "D", text: "The European call price is $0.81 per share matching the put option." }
  ];
  s9En.beats[0].ui_state.correctAnswer = "A";
  s9En.beats[0].visual.kind = 'quiz';
  s9En.beats[0].visual.data = {
    question: s9En.beats[0].ui_state.question,
    options: s9En.beats[0].ui_state.options,
    correctAnswer: "A"
  };

  s9En.beats[1].en_narration = "Subtract the discounted strike payment from the stock delta component to find the fair price.";
  s9En.beats[1].en_subtitle = "Subtract discounted strike times N(d2) from spot times N(d1).";
  s9En.beats[1].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[1].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[1].ui_state.correctAnswer = "A";
  s9En.beats[1].visual.kind = 'quiz';
  s9En.beats[1].visual.data = s9En.beats[0].visual.data;

  s9En.beats[2].en_narration = "The correct answer is A. The European call price is four dollars and seventy-six cents per share.";
  s9En.beats[2].en_subtitle = "Correct is A: $32.72 minus $27.96 yields $4.76 per share ($476 per contract).";
  s9En.beats[2].ui_state.question = s9En.beats[0].ui_state.question;
  s9En.beats[2].ui_state.options = s9En.beats[0].ui_state.options;
  s9En.beats[2].ui_state.correctAnswer = "A";
  s9En.beats[2].ui_state.explanation = "c = 42*0.7791 - 40*exp(-0.05)*0.7350 = 32.722 - 27.966 = $4.756 ($4.76 per share).";
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
    path.join(clineDir, 'hull_ch13_part2_dialogue_refine.json'),
    JSON.stringify({
      task: "Refine dialogues and validation for hull ch13_part2",
      dialogueHi,
      dialogueEn,
      status: "COMPLETED",
      timestamp: new Date().toISOString()
    }, null, 2),
    'utf8'
  );
  console.log('✅ Cline task manifest written: .cline/tasks/hull_ch13_part2_dialogue_refine.json');
}

main().catch(err => {
  console.error('❌ Error during dialogue enrichment:', err);
  process.exit(1);
});

