// scripts/enrich_ch12_part1_argon.mjs
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
  console.log('Querying Gemini 4 Argon for Chapter 12 Part 1 dialogue enrichment...');

  const promptHi = `
For John C. Hull Chapter 12 Part 1 (One-Step Binomial Trees, Delta Hedging Portfolio, Risk-Neutral Valuation Principle p = (e^(rT) - d)/(u - d)):
Provide 2 scenes of dialogue between Raju (inquisitive retail trader) and Sharma ji (veteran derivatives mentor) in natural conversational Hindi (Devanagari script) with English subtitles (<= 14 words per beat).

Scene 0: Raju asks how an option can have an exact fair price when market direction is totally uncertain. Sharma ji explains the One-Step Binomial Tree and Delta Hedging: by combining Delta shares with a short option, you build a perfectly riskless portfolio that pays the exact same amount in both up and down states!
Beats:
b01: Raju speaking (theme: "amber", avatar: "R")
b02: Sharma ji speaking (theme: "teal", avatar: "S")
b03: Raju speaking

Scene 10: Raju asks why the investor's subjective view on whether the stock will rise or fall doesn't matter in option pricing. Sharma ji explains the Risk-Neutral Valuation Principle: because the option is replicated by stock and risk-free cash, risk preferences vanish! We price options using risk-neutral probability p = (e^(rT) - d)/(u - d)!
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
For John C. Hull Chapter 12 Part 1 (One-Step Binomial Trees, Delta Hedging Portfolio, Risk-Neutral Valuation Principle p = (e^(rT) - d)/(u - d)):
Provide 2 scenes of dialogue between Alex (inquisitive novice trader) and Marcus (veteran institutional risk manager) in crisp English narration and subtitles (<= 14 words per beat).

Scene 0: Alex asks how an option can be definitively priced when nobody can forecast future stock price direction. Marcus explains the One-Step Binomial Tree and Delta Hedging: by combining Delta shares with a short option, we construct a perfectly riskless replicating portfolio whose value is identical in both states.
Beats:
b01: Alex speaking (theme: "amber", avatar: "A")
b02: Marcus speaking (theme: "teal", avatar: "M")
b03: Alex speaking

Scene 10: Alex asks why an investor's personal bullish or bearish conviction doesn't affect the option's fair value. Marcus reveals the Risk-Neutral Valuation Principle: replication eliminates risk preferences entirely; options are simply the discounted expected payoff under risk-neutral probability p = (e^(rT) - d)/(u - d).
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

  const quizScenario = 'Given a stock at $20.00 moving to $22.00 or $18.00 in 3 months with a $21.00 strike call, what is the exact delta hedge ratio and risk-neutral option price at a 12% risk-free rate?';
  const quizOptions = [
    'A) Delta is 0.25 shares per option (25 shares per contract) and the call price is $0.633 per share ($63.30 per contract)',
    'B) Delta is 0.50 shares per option (50 shares per contract) and the call price is $1.000 per share ($100.00 per contract)',
    'C) Delta is 0.10 shares per option (10 shares per contract) and the call price is $0.350 per share ($35.00 per contract)',
    'D) Delta is 0.75 shares per option (75 shares per contract) and the call price is $1.250 per share ($125.00 per contract)'
  ];
  const quizAnswer = 'A) Delta is 0.25 shares per option (25 shares per 100-share contract) and the call price is $0.633 ($63.30 per contract). Delta = (1 - 0)/(22 - 18) = 0.25. Risk-neutral probability p = (e^0.03 - 0.90)/(1.10 - 0.90) = 0.6523, yielding f = e^(-0.03) * 0.6523 * $1.00 = $0.633.';

  // -------------------------------------------------------------
  // UPDATE HINDI EPISODE
  // -------------------------------------------------------------
  const pHi = 'src/data/chapters/hull_derivatives/ch12_part1/episode_raw.json';
  const epHi = JSON.parse(fs.readFileSync(pHi, 'utf8'));

  epHi.scenes[0].title = "Origins: Pricing Options Without Guessing";
  epHi.scenes[0].badge = "Market Desk · One-Step Binomial Model";
  epHi.scenes[0].beats = dialogueHi.scene0.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks how options can be priced without predicting market direction —' : '— Sharma ji explains the no-arbitrage replicating portfolio and delta hedging —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce one-step binomial tree and no-arbitrage delta hedging.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  epHi.scenes[10].title = "Trading Desk Execution Rules";
  epHi.scenes[10].badge = "Desk Debrief · Risk-Neutral Valuation";
  epHi.scenes[10].beats = dialogueHi.scene10.map(b => ({
    id: b.id,
    hindi_tts: b.hindi_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Raju' ? '— Raju asks why investor optimism does not change option value —' : '— Sharma ji explains risk-neutral probability and expected return irrelevance —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Raju' ? 'R' : 'S', text: b.en_subtitle, theme: b.sender === 'Raju' ? 'amber' : 'teal', align: b.sender === 'Raju' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove the Risk-Neutral Valuation Principle and irrelevance of subjective drift mu.', sourceFactIds: ['fact-05', 'fact-08'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9Hi = epHi.scenes[9];
  s9Hi.title = "Active Recall Challenge";
  s9Hi.badge = "Delta Hedge & Binomial Pricing";
  s9Hi.beats[0].hindi_tts = "यदि बीस डॉलर का स्टॉक बाइस या अठारह पर जा सकता है और इक्कीस की कॉल का पेऑफ एक या शून्य है, तो डेल्टा और फेयर प्राइस क्या होगी?";
  s9Hi.beats[0].en_subtitle = "Stock at $20 moving to $22 or $18: what is delta and fair call price at r=12%?";
  s9Hi.beats[0].en_narration = "Calculate the delta hedge ratio and risk-neutral call option price for the Hull one-step example.";
  s9Hi.beats[0].ui_state.question = quizScenario;
  s9Hi.beats[0].ui_state.options = quizOptions;
  s9Hi.beats[0].visual.data.question = quizScenario;
  s9Hi.beats[0].visual.data.options = quizOptions;

  s9Hi.beats[1].hindi_tts = "ध्यान से सोचिए... डेल्टा स्प्रेड पेऑफ बटे स्टॉक स्प्रेड होता है, और रिस्क न्यूट्रल संभावना पी क्या होगी?";
  s9Hi.beats[1].en_subtitle = "Think carefully... Delta = (fu - fd)/(Su - Sd). What is risk-neutral probability p?";
  s9Hi.beats[1].en_narration = "Consider the delta ratio formula and risk-neutral probability formula.";
  s9Hi.beats[1].ui_state.question = quizScenario;
  if (s9Hi.beats[1].visual?.data) s9Hi.beats[1].visual.data.question = quizScenario;

  s9Hi.beats[2].hindi_tts = "सही उत्तर ए है! डेल्टा पच्चीस प्रतिशत यानी शून्य दशमलव दो पांच है, और कॉल का मूल्य शून्य दशमलव छह तैंतीस डॉलर है।";
  s9Hi.beats[2].en_subtitle = "Correct answer is A! Delta is 0.25 shares and call price is $0.633.";
  s9Hi.beats[2].en_narration = "Correct answer is A: Delta is 0.25 shares per option and option price is $0.633.";
  s9Hi.beats[2].ui_state.question = quizScenario;
  s9Hi.beats[2].ui_state.answer = quizAnswer;
  s9Hi.beats[2].ui_state.correctIndex = 0;
  if (s9Hi.beats[2].visual?.data) {
    s9Hi.beats[2].visual.data.question = quizScenario;
    s9Hi.beats[2].visual.data.answer = quizAnswer;
    s9Hi.beats[2].visual.data.correctIndex = 0;
  }

  fs.writeFileSync(pHi, JSON.stringify(epHi, null, 2), 'utf8');
  console.log('✅ Updated Hindi episode_raw.json for ch12_part1');

  // -------------------------------------------------------------
  // UPDATE ENGLISH EPISODE
  // -------------------------------------------------------------
  const pEn = 'src/data/chapters/hull_derivatives_en/ch12_part1/episode_raw.json';
  const epEn = JSON.parse(fs.readFileSync(pEn, 'utf8'));

  epEn.scenes[0].title = "Origins: Pricing Options Without Guessing";
  epEn.scenes[0].badge = "Market Desk · One-Step Binomial Model";
  epEn.scenes[0].beats = dialogueEn.scene0.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex asks how options are priced without directional forecasting —' : '— Marcus reveals the no-arbitrage delta hedging portfolio —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Introduce one-step binomial tree and no-arbitrage delta hedging.', sourceFactIds: ['fact-01', 'fact-02'] }
    }
  }));

  epEn.scenes[10].title = "Trading Desk Execution Rules";
  epEn.scenes[10].badge = "Desk Debrief · Risk-Neutral Valuation";
  epEn.scenes[10].beats = dialogueEn.scene10.map(b => ({
    id: b.id,
    en_tts: b.en_tts,
    en_subtitle: b.en_subtitle,
    en_narration: b.en_subtitle,
    pauseAfterMs: 400,
    ui_state: {
      stageDirections: [b.sender === 'Alex' ? '— Alex asks why trader market beliefs do not alter option value —' : '— Marcus proves the risk-neutral valuation theorem and drift mu cancellation —'],
      messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
    },
    visual: {
      kind: 'conversation',
      data: {
        messages: [{ sender: b.sender, avatar: b.sender === 'Alex' ? 'A' : 'M', text: b.en_subtitle, theme: b.sender === 'Alex' ? 'amber' : 'teal', align: b.sender === 'Alex' ? 'left' : 'right' }]
      },
      semantics: { teachingObjective: 'Prove the Risk-Neutral Valuation Principle and irrelevance of subjective drift mu.', sourceFactIds: ['fact-05', 'fact-08'] }
    }
  }));

  // Update Scene 9 Quiz beats (keep all 3 beats intact!)
  const s9En = epEn.scenes[9];
  s9En.title = "Active Recall Challenge";
  s9En.badge = "Delta Hedge & Binomial Pricing";
  s9En.beats[0].en_tts = "Given a stock at $20.00 moving to $22.00 or $18.00 in 3 months with a $21.00 strike call, what is the exact delta hedge ratio and risk-neutral option price at a 12% risk-free rate?";
  s9En.beats[0].en_subtitle = "Stock at $20 moving to $22 or $18: what is delta and fair call price at r=12%?";
  s9En.beats[0].en_narration = "Calculate the delta hedge ratio and risk-neutral call option price for the Hull one-step example.";
  s9En.beats[0].ui_state.question = quizScenario;
  s9En.beats[0].ui_state.options = quizOptions;
  s9En.beats[0].visual.data.question = quizScenario;
  s9En.beats[0].visual.data.options = quizOptions;

  s9En.beats[1].en_tts = "Pause and consider... Delta equals the payoff difference divided by the stock spread. What is risk-neutral probability p?";
  s9En.beats[1].en_subtitle = "Think carefully... Delta = (fu - fd)/(Su - Sd). What is risk-neutral probability p?";
  s9En.beats[1].en_narration = "Consider the delta ratio formula and risk-neutral probability formula.";
  s9En.beats[1].ui_state.question = quizScenario;
  if (s9En.beats[1].visual?.data) s9En.beats[1].visual.data.question = quizScenario;

  s9En.beats[2].en_tts = "Correct answer is A! Delta is 0.25 shares per option and the fair call option price is $0.633.";
  s9En.beats[2].en_subtitle = "Correct answer is A! Delta is 0.25 shares and call price is $0.633.";
  s9En.beats[2].en_narration = "Correct answer is A: Delta is 0.25 shares per option and option price is $0.633.";
  s9En.beats[2].ui_state.question = quizScenario;
  s9En.beats[2].ui_state.answer = quizAnswer;
  s9En.beats[2].ui_state.correctIndex = 0;
  if (s9En.beats[2].visual?.data) {
    s9En.beats[2].visual.data.question = quizScenario;
    s9En.beats[2].visual.data.answer = quizAnswer;
    s9En.beats[2].visual.data.correctIndex = 0;
  }

  fs.writeFileSync(pEn, JSON.stringify(epEn, null, 2), 'utf8');
  console.log('✅ Updated English episode_raw.json for ch12_part1');
}

main().catch(err => {
  console.error('❌ Enrichment failed:', err);
  process.exit(1);
});

