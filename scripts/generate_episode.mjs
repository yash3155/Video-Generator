// scripts/generate_episode.mjs
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// CLI Arguments
const args = process.argv.slice(2);
const chapterArg = args.find((a) => a.startsWith('--chapter='));
const dirArg = args.find((a) => a.startsWith('--dir='));
const topicArg = args.find((a) => a.startsWith('--topic='));
const domainArg = args.find((a) => a.startsWith('--domain='));
const notesArg = args.find((a) => a.startsWith('--notes='));
const tempArg = args.find((a) => a.startsWith('--temperature='));
const modelArg = args.find((a) => a.startsWith('--model='));
const curriculumArg = args.find((a) => a.startsWith('--curriculum='));
const promptArg = args.find((a) => a.startsWith('--prompt='));
const dryRun = args.includes('--dry-run');

let chapterSlug = 'ch01_argon_v1';
let chapterDir = null;

if (chapterArg) {
  chapterSlug = chapterArg.split('=')[1];
  chapterDir = path.resolve(rootDir, 'src', 'data', 'chapters', chapterSlug);
} else if (dirArg) {
  const customDir = dirArg.split('=')[1];
  chapterDir = path.isAbsolute(customDir) ? customDir : path.resolve(rootDir, customDir);
  chapterSlug = path.basename(chapterDir);
} else {
  chapterDir = path.resolve(rootDir, 'src', 'data', 'chapters', chapterSlug);
}

const targetModel = modelArg ? modelArg.split('=')[1] : (process.env.GEMINI_MODEL || 'gemini-4-argon');
const geminiBaseUrl = process.env.GEMINI_BASE_URL || process.env.GOOGLE_GEMINI_BASE_URL || process.env.FREE_GEMINI_BASE_URL;
const thinkingLevel = process.env.GEMINI_THINKING_LEVEL || 'medium';
const temperature = tempArg ? parseFloat(tempArg.split('=')[1]) : 0.2;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`\n========================================`);
  console.log(`[EPISODE GENERATOR] Pipeline Execution`);
  console.log(`  Target Model:      ${targetModel}`);
  console.log(`  Proxy Base URL:    ${geminiBaseUrl || 'Default Gemini API'}`);
  console.log(`  Reasoning Level:   ${thinkingLevel}`);
  console.log(`  Temperature:       ${temperature} (Strict schema adherence)`);
  console.log(`  Target Directory:  ${chapterDir}`);
  console.log(`  Chapter Slug:      ${chapterSlug}`);
  console.log(`========================================\n`);
}

if (!fs.existsSync(chapterDir)) {
  fs.mkdirSync(chapterDir, { recursive: true });
}

const schemaRefPath = path.join(rootDir, 'src', 'data', 'schema_reference.json');
const personasPath = path.join(rootDir, 'src', 'data', 'personas.json');

const schemaRef = JSON.parse(fs.readFileSync(schemaRefPath, 'utf8'));
const personas = JSON.parse(fs.readFileSync(personasPath, 'utf8'));

let contextText = '';
if (notesArg) {
  const rawPath = notesArg.slice('--notes='.length).replace(/^["']|["']$/g, '');
  const notesPath = path.resolve(rootDir, rawPath);
  if (fs.existsSync(notesPath)) {
    contextText = fs.readFileSync(notesPath, 'utf8');
    console.log(`[INFO] Loaded authoritative context from Gemini Notebook (${notesPath}, ${contextText.length} chars)`);
  } else {
    console.warn(`[WARN] Specified notes file does not exist: ${notesPath}`);
  }
}

const systemInstruction = `
You are the Lead Pedagogical Storyboard Architect for an autonomous educational video engine built in Remotion.
You synthesize dense technical or domain knowledge into a 12-slide, 38-50 beat episode payload conforming to the exact schema specification.

CRITICAL INVARIANTS:
1. 100% ENGLISH UI TEXT: Every field inside 'ui_state' (questions, card titles, subtitles, badge copy, annotations, steps, headings) MUST be English. Devanagari characters are strictly forbidden in 'ui_state'.
2. 100% DEVANAGARI HINDI TTS NARRATION: 'hindi_tts' must be natural, warm, conversational Hindi/Hinglish written in Devanagari script (e.g., 'मूविंग एवरेज', 'ओपन इंटरेस्ट', 'ब्रेकआउट', 'ट्रेंडलाइन'). NEVER put English sentences or Latin words longer than 3 letters inside 'hindi_tts'. Format numbers and currencies as digits ('₹158', '40%'). Never use 'रिज़ल्ट' (always 'नतीजे').
3. EN_SUBTITLE: Short, concise English subtitles under 16 words per beat.
4. EXACT CHAPTER BREADCRUMB: 'meta.chapter' must strictly follow the format: 'CHAPTER X · PART Y' (or 'APPENDIX'). Never include '_ARGON' or underscores.
5. DYNAMIC CHART PRESETS & DIRECTIONAL CONSISTENCY (CRITICAL):
   Our chart engine automatically scales its candlesticks and Y-axis to match whatever '₹<number>' prices you write in the scene! However, you MUST keep your prices and preset directions logically consistent:
   - Cross-Scene Price Continuity: If Raju buys or shorts a stock at a specific price in Scene 0 ('chat_story'), use that EXACT same entry price in Scene 1 ('data_visualizer') and Scene 10 ('chat_story')!
   - Directional Price Math:
     * If Raju buys a false breakout / bull trap and price drops, the drop price MUST be lower than the buy price (e.g. buys at ₹250, drops to ₹225) and you MUST use 'preset': 'uptrend_then_drop' (with Beat 0 at 'progressStep': 2 for the peak entry, and Beat 1 at 'progressStep': 3 for the drop).
     * If Raju shorts an uptrend and gets squeezed higher, or buys a true breakout that rallies higher, the second price MUST be higher than the first price (e.g. shorts at ₹240, rallies to ₹275) and you MUST use 'preset': 'bull_breakout' (Beat 0 at 'progressStep': 2, Beat 1 at 'progressStep': 3).
     * For trendline breakdowns, use 'preset': 'uptrend_break' (Beat 0 at 'progressStep': 2, Beat 1 at 'progressStep': 3).
     * ONLY use 'preset': 'head_and_shoulders' when the scene is explicitly teaching the Head and Shoulders pattern!
   - Always set 'yAxisUnit': '₹'.
6. PROGRESSIVE CARDS INVARIANT:
   - If a scene teaches 3 points, use 3 cards and 3 beats. If a scene teaches 4 points, use 4 cards ('layout: "grid"') and 4 beats!
   - NEVER cram two rules into one card title and NEVER exceed 45 characters in 'card.title'.
   - Reveal 1 card per beat: Beat 0 -> Card 0 active_amber (others hidden); Beat 1 -> Card 0 muted, Card 1 active_blue (others hidden), etc.
7. INTERACTIVE QUIZ 3-BEAT INVARIANT:
   - Exactly 3 beats:
     * Beat 0: Scenario introduction ('showThinkingSpinner: false', 'answer: null')
     * Beat 1: Thinking pause ('showThinkingSpinner: true', 'answer: null', 'pauseAfterMs: 3200')
     * Beat 2: Answer reveal ('showThinkingSpinner: false', 'answer: "..."' as a plain string)
   - 'ui_state.question' must be at least 18 words and stay 100% identical across all 3 beats.
8. SPLIT COMPARISON INVARIANT:
   - Bullets must NOT start with ASCII arrows ('-->' or '->').
9. TUG OF WAR INVARIANT:
   - Always include 'centerTitle', 'centerMetric' (max 14 characters), and 'trend' ('up' or 'down').
   - You may use actual market breadth counts (e.g. 1850 vs 860) or percentage counts; the UI proportionally scales silhouettes.
10. SUMMARY THREAD INVARIANT (STRICT 6-BEAT, 8-STEP LOCK):
   - Every 'summary_thread' scene MUST have EXACTLY 8 items in 'ui_state.steps' (plain English strings WITHOUT leading numbers like '1. ') and EXACTLY 6 beats:
     * Beat 0 ('activeStepRange: [0, 0]'): Intro sentence in Devanagari Hindi.
     * Beat 1 ('activeStepRange: [1, 2]'): 'hindi_tts' (100% Devanagari) & 'en_subtitle' summarize Steps 1 and 2 ONLY.
     * Beat 2 ('activeStepRange: [3, 4]'): 'hindi_tts' (100% Devanagari) & 'en_subtitle' summarize Steps 3 and 4 ONLY.
     * Beat 3 ('activeStepRange: [5, 6]'): 'hindi_tts' (100% Devanagari) & 'en_subtitle' summarize Steps 5 and 6 ONLY.
     * Beat 4 ('activeStepRange: [7, 8]'): 'hindi_tts' (100% Devanagari) & 'en_subtitle' summarize Steps 7 and 8 ONLY.
     * Beat 5 ('activeStepRange: [1, 8]'): Final takeaway beat with 'bottomTakeaway' and natural Devanagari Hindi conclusion.
   - 'ui_state.heading' MUST be "Today's thread" across all 6 beats.
11. ADDITIONAL VISUAL TEMPLATES:
   In addition to 'chat_story', 'data_visualizer', 'progressive_cards', 'split_comparison', 'tug_of_war', 'interactive_quiz', and 'summary_thread', you can also use:
   - 'stat_counter': To highlight a dramatic leverage ratio, loss stat, or key metric (e.g. Lehman 31:1 leverage, $4B collapse).
   - 'horizontal_bar_race': To compare two contrasting forces, weights, or strategies side by side with opposing animated bars.
   - 'formula_breakdown': To teach a quantitative pricing formula or mathematical relationship step by step (e.g. F0 = S0 * e^(rT), Put-Call Parity, BSM).
   - 'payoff_diagram': To illustrate an option payoff hockey-stick curve (e.g. 'long_call', 'short_call', 'long_put', 'short_put', 'bull_spread', 'bear_spread', 'straddle', 'strangle', 'protective_put', 'covered_call') with strike price K and premium.
12. RESPONSE FORMAT: Return ONLY a valid JSON object matching the episode schema. No Markdown wrapper, no thoughts outside JSON.
`;

const curriculumText = curriculumArg
  ? curriculumArg.slice('--curriculum='.length)
  : promptArg
    ? promptArg.slice('--prompt='.length)
    : '';

function formatChapterBreadcrumb(slug) {
  if (!slug) return 'CHAPTER 1 · PART 1';
  if (/^CHAPTER \d+ · PART \d+$/i.test(slug)) return slug.toUpperCase();
  const match = slug.match(/(?:hull_)?ch(\d+)_part(\d+)/i);
  if (match) {
    return `CHAPTER ${parseInt(match[1], 10)} · PART ${parseInt(match[2], 10)}`;
  }
  if (slug.toLowerCase().includes('appendix')) {
    return 'APPENDIX';
  }
  return slug.replace(/_argon/i, '').replace(/_/g, ' ').toUpperCase();
}

const resolvedTopic = topicArg
  ? topicArg.slice('--topic='.length).replace(/^["']|["']$/g, '')
  : (chapterSlug && /hull/i.test(chapterSlug) ? 'FUTURES & OPTIONS · JOHN C. HULL' : 'TECHNICAL ANALYSIS · MURPHY');

const prompt = `
Generate a complete, high-fidelity episode for:
- Course: ${resolvedTopic}
- Chapter: ${formatChapterBreadcrumb(chapterSlug)}
- Domain: ${domainArg ? domainArg.split('=')[1] : 'Finance / Trading'}
${curriculumText ? `\nCurriculum Directives & Scope:\n${curriculumText}\n` : ''}
${contextText ? `\nAUTHORITATIVE CONTEXT FROM GEMINI NOTEBOOK (SINGLE SOURCE OF TRUTH):\nExtract all concepts, definitions, formulas, real-world snapshot cases, numbers, and narrative points directly from this text. Do NOT search external sources or fabricate outside examples:\n${contextText}\n` : ''}

CRITICAL STRUCTURAL REQUIREMENTS:
You MUST generate 11 to 12 distinct scenes and 38 to 46 total beats:
- Scene 0: Hook Part 1 (chat_story, 2-3 beats)
- Scene 1: Hook Part 2 (data_visualizer, 3 beats — use the exact same stock price mentioned in Scene 0; Beat 0 at progressStep: 2 showing entry; Beat 1 at progressStep: 3 showing the drop on 'uptrend_then_drop' or rally on 'bull_breakout'; Beat 2 at progressStep: 3 showing the lesson)
- Scene 2: The Roadmap (progressive_cards, 3-4 beats — 1 beat per card)
- Scenes 3-8: Deep Dives into Core Concepts (alternating data_visualizer, progressive_cards, split_comparison, tug_of_war, 2-4 beats each)
- Scene 9: Active Recall Quiz (interactive_quiz, EXACTLY 3 beats: Beat 0 intro, Beat 1 thinking pause with showThinkingSpinner: true & pauseAfterMs: 3200, Beat 2 answer reveal)
- Scene 10: Practical Application Dialogue (chat_story, 2-3 beats)
- Scene 11: The Whole Picture (summary_thread, EXACTLY 6 beats: [0,0], [1,2], [3,4], [5,6], [7,8], [1,8] covering 8 steps in 100% Devanagari Hindi audio)

Schema Reference:
${JSON.stringify(schemaRef, null, 2)}

Domain Personas:
${JSON.stringify(personas, null, 2)}
`;

async function callGeminiArgonDirect(fullPrompt) {
  const cookiePath = path.resolve(rootDir, '..', 'free-gemini-api', 'cookies', 'cookies.json');
  if (!fs.existsSync(cookiePath)) {
    throw new Error(`cookies.json not found at: ${cookiePath}. Please ensure Chrome extension is loaded and active.`);
  }

  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
  const cookieStr = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  console.log(`[ARGON ENGINE] Connecting to gemini.google.com with authenticated session (${cookies.length} cookies)...`);
  const authRes = await fetch('https://gemini.google.com/app', {
    headers: {
      Cookie: cookieStr,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    },
  });

  const html = await authRes.text();
  const snMatch = html.match(/"SNlM0e":"(.*?)"/);
  const blMatch = html.match(/"cfb2h":"(.*?)"/);
  const fsidMatch = html.match(/"FdrFJe":"(.*?)"/);

  if (!snMatch) {
    throw new Error('Could not extract SNlM0e CSRF token from Gemini session. Please refresh gemini.google.com.');
  }

  const snlm0e = snMatch[1];
  const bl = blMatch ? blMatch[1] : 'boq_gemini-web-uiserver_20261029.22_p0';
  const fsid = fsidMatch ? fsidMatch[1] : '';

  console.log(`[ARGON ENGINE] Session verified! Calling Gemini 4 Argon frontier model...`);

  const reqId = Math.floor(Math.random() * 9000000) + 1000000;
  const msgInner = [fullPrompt, 0, null, [], null, null, 0];
  const msgLang = ['en-GB'];
  const msgContext = ['', '', '', null, null, null, null, null, null, ''];
  const msgStruct = [msgInner, msgLang, msgContext];
  const fReqVal = [null, JSON.stringify(msgStruct)];
  const fReqJSON = JSON.stringify(fReqVal);

  const bodyParams = new URLSearchParams();
  bodyParams.set('f.req', fReqJSON);
  bodyParams.set('at', snlm0e);

  const url = `https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=${encodeURIComponent(bl)}&_reqid=${reqId}&rt=c${fsid ? `&f.sid=${encodeURIComponent(fsid)}` : ''}`;

  const jspbHeader = `[1,null,null,null,"95a4c0abcba24364",null,null,null,[4,5,6,8,16,19,20],null,null,null,null,null,8,1,null,null,null,null]`;

  const genRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieStr,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      Origin: 'https://gemini.google.com',
      Referer: 'https://gemini.google.com/app',
      'X-Same-Domain': '1',
      'x-goog-ext-525001261-jspb': jspbHeader,
      'x-goog-ext-525005358-jspb': '["DIRECT-API-SESSION",1]',
      'x-goog-ext-73010989-jspb': '[0]',
    },
    body: bodyParams.toString(),
  });

  if (!genRes.ok) {
    throw new Error(`Gemini 4 Argon StreamGenerate failed with status: ${genRes.status}`);
  }

  const rawBody = await genRes.text();
  let generatedText = '';
  const lines = rawBody.split('\n');
  for (const line of lines) {
    if (!line.trim().startsWith('[[')) continue;
    try {
      const wrapper = JSON.parse(line.trim());
      for (const item of wrapper) {
        if (!Array.isArray(item) || item[0] !== 'wrb.fr') continue;
        const inner = JSON.parse(item[2]);
        if (inner && inner[4] && inner[4][0] && inner[4][0][1] && inner[4][0][1][0]) {
          generatedText = inner[4][0][1][0];
        }
      }
    } catch { }
  }

  if (!generatedText) {
    throw new Error('Gemini 4 Argon returned an empty response. Raw payload length: ' + rawBody.length);
  }

  return generatedText;
}

async function ensureProxyRunning() {
  const proxyHealthUrl =
    (process.env.GEMINI_BASE_URL || 'http://127.0.0.1:8001')
      .replace(/\/v1\/chat\/completions\/?$/, '')
      .replace(/\/+$/, '') + '/health';

  try {
    const res = await fetch(proxyHealthUrl, { signal: AbortSignal.timeout(1200) });
    if (res.ok) return true;
  } catch { }

  const exePath = path.resolve(rootDir, '..', 'free-gemini-api', 'gemini-core-windows-amd64.exe');
  if (fs.existsSync(exePath)) {
    console.log('[PROXY] Local free-gemini-api proxy is not running. Launching in background...');
    const subprocess = spawn(exePath, [], {
      cwd: path.dirname(exePath),
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, WS_PORT: '9999' },
    });
    subprocess.unref();

    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        const res = await fetch(proxyHealthUrl, { signal: AbortSignal.timeout(600) });
        if (res.ok) {
          console.log('[PROXY] Local proxy is online and ready!');
          return true;
        }
      } catch { }
    }
  }
  return false;
}

async function callGeminiArgonViaProxy(promptText, model = 'gemini-4-argon', temp = 0.2) {
  const baseUrl = process.env.GEMINI_BASE_URL || 'http://127.0.0.1:8001/v1/chat/completions';
  const completionsUrl = baseUrl.endsWith('/v1/chat/completions')
    ? baseUrl
    : `${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`;

  // Map to argon-low for rapid, reliable Level-1 thinking within proxy 5-minute timeout window
  const proxyModel = model.toLowerCase().includes('argon') ? 'argon-low' : model;

  const uniqueSession = `ep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[ARGON PROXY] Routing generation request through: ${completionsUrl} (model: ${proxyModel}, session: ${uniqueSession})...`);
  const res = await fetch(completionsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': uniqueSession,
      'X-Agent-ID': uniqueSession,
      Authorization: 'Bearer none',
    },
    signal: AbortSignal.timeout(450000), // 450 seconds (7.5 minutes)
    body: JSON.stringify({
      model: proxyModel,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: promptText },
      ],
      temperature: temp,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Argon Proxy request failed (status ${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Argon Proxy returned an empty response. Response payload: ' + JSON.stringify(data));
  }
  return content;
}

const activeColorCycle = ['active_amber', 'active_blue', 'active_green', 'active_purple'];

export function normalizeAndRemedyEpisode(data, slug) {
  if (!data || !Array.isArray(data.scenes)) return data;

  if (data.meta) {
    data.meta.chapter = formatChapterBreadcrumb(data.meta.chapter || slug);
    if (slug && /hull/i.test(slug)) {
      data.meta.course = 'FUTURES & OPTIONS · JOHN C. HULL';
    }
  }

  data.scenes.forEach((scene) => {
    // 1. Progressive Cards: NEVER truncate/merge cards with .slice(0, 50)!
    if (scene.template === 'progressive_cards' && Array.isArray(scene.beats) && scene.beats.length > 0) {
      const firstCards = scene.beats[0]?.ui_state?.cards || [];
      const totalCards = firstCards.length;
      const numBeats = scene.beats.length;

      scene.beats.forEach((b, bIdx) => {
        if (b.ui_state && Array.isArray(b.ui_state.cards)) {
          const isLastBeat = bIdx === numBeats - 1;
          b.ui_state.cards = firstCards.map((c, cIdx) => {
            let state = 'hidden';
            if (isLastBeat && totalCards > numBeats) {
              state = cIdx < bIdx ? 'muted' : activeColorCycle[cIdx % activeColorCycle.length];
            } else if (cIdx < bIdx) {
              state = 'muted';
            } else if (cIdx === bIdx) {
              state = activeColorCycle[cIdx % activeColorCycle.length];
            }
            return {
              icon: c.icon || 'Sparkles',
              title: String(c.title || '').trim(),
              subtitle: String(c.subtitle || '').trim(),
              state,
            };
          });
        }
      });
    }

    // 2. Interactive Quiz 3-Beat & Immutability Normalization
    if (scene.template === 'interactive_quiz' && Array.isArray(scene.beats)) {
      if (scene.beats.length === 2) {
        const bSpin = scene.beats[0];
        const bAns = scene.beats[1];
        const qText = bSpin.ui_state?.question || bAns.ui_state?.question || 'What is the correct market interpretation?';
        const introBeat = {
          id: `${bSpin.id || 'b'}_intro`,
          hindi_tts: 'अब आपकी बारी। इस स्थिति का ध्यान से विश्लेषण कीजिए।',
          en_subtitle: 'Now it is your turn. Carefully analyze this market scenario.',
          pauseAfterMs: 400,
          ui_state: {
            badge: bSpin.ui_state?.badge || 'ACTIVE RECALL',
            question: qText,
            showThinkingSpinner: false,
            answer: null,
          },
        };
        bSpin.ui_state.showThinkingSpinner = true;
        bSpin.ui_state.answer = null;
        bSpin.pauseAfterMs = Math.max(bSpin.pauseAfterMs || 0, 3200);
        bAns.ui_state.showThinkingSpinner = false;
        scene.beats = [introBeat, bSpin, bAns];
      }

      let canonicalQuestion = '';
      scene.beats.forEach((b) => {
        if (b.ui_state && b.ui_state.question && !canonicalQuestion) {
          canonicalQuestion = b.ui_state.question;
        }
        if (b.ui_state && b.ui_state.answer && typeof b.ui_state.answer === 'object') {
          const parts = [];
          if (b.ui_state.answer.verdict) parts.push(b.ui_state.answer.verdict);
          if (b.ui_state.answer.explanation) parts.push(b.ui_state.answer.explanation);
          b.ui_state.answer = parts.length > 0 ? parts.join(' — ') : JSON.stringify(b.ui_state.answer);
        }
      });
      if (canonicalQuestion) {
        scene.beats.forEach((b) => {
          if (b.ui_state) {
            b.ui_state.question = canonicalQuestion;
          }
        });
      }
      if (scene.beats.length >= 2 && (scene.beats[1].pauseAfterMs ?? 0) < 3000) {
        scene.beats[1].pauseAfterMs = 3200;
      }
    }

    // 3. Tug of War Silhouette Clamping & Defaults
    if (scene.template === 'tug_of_war' && Array.isArray(scene.beats)) {
      scene.beats.forEach((b) => {
        if (b.ui_state) {
          if (typeof b.ui_state.leftCount === 'number') {
            b.ui_state.leftCount = Math.max(0, Math.round(b.ui_state.leftCount));
          }
          if (typeof b.ui_state.rightCount === 'number') {
            b.ui_state.rightCount = Math.max(0, Math.round(b.ui_state.rightCount));
          }
          b.ui_state.centerTitle = b.ui_state.centerTitle || 'MARKET BALANCE';
          b.ui_state.centerMetric = String(b.ui_state.centerMetric || 'Order Flow').slice(0, 18);
          b.ui_state.trend = b.ui_state.trend || 'up';
        }
      });
    }

    // 4. Data Visualizer: Lock yAxisUnit to '₹', Prevent Non-H&S Presets, & Align progressStep
    if (scene.template === 'data_visualizer' && Array.isArray(scene.beats)) {
      const sceneTitleCombo = `${scene.title || ''} ${scene.beats[0]?.ui_state?.chartTitle || ''} ${scene.beats[0]?.ui_state?.chartSubtitle || ''}`;
      const isActualHeadAndShoulders = /head\s*(?:&|and)\s*shoulders|neckline/i.test(sceneTitleCombo);

      scene.beats.forEach((b, bIdx) => {
        const ui = b.ui_state;
        if (!ui) return;

        ui.yAxisUnit = '₹';

        if (ui.preset === 'head_and_shoulders' && !isActualHeadAndShoulders) {
          ui.preset = 'uptrend_then_drop';
        }

        if (
          (ui.preset === 'uptrend_break' || ui.preset === 'uptrend_then_drop') &&
          /staying overbought|short squeeze|walking the upper band|bandwidth explosion|volume leads/i.test(
            `${scene.title} ${ui.chartTitle} ${ui.chartSubtitle} ${b.en_subtitle}`
          )
        ) {
          ui.preset = 'bull_breakout';
        }

        const preset = ui.preset || 'uptrend_then_drop';

        if (
          preset === 'uptrend_then_drop' &&
          bIdx === 0 &&
          /bought|chased|breakout|shorted/i.test(`${b.en_subtitle} ${JSON.stringify(ui.sideCards || [])}`)
        ) {
          ui.progressStep = 2;
        }
        if (
          preset === 'uptrend_then_drop' &&
          bIdx >= 1 &&
          /drop|slump|collaps|sink|reversal|trap|whipsaw|exit|loss/i.test(
            `${b.en_subtitle} ${JSON.stringify(ui.sideCards || [])} ${JSON.stringify(ui.annotations || [])}`
          )
        ) {
          ui.progressStep = 3;
        }
      });
    }

    // 5. Split Comparison ASCII Arrow Removal
    if (scene.template === 'split_comparison' && Array.isArray(scene.beats)) {
      scene.beats.forEach((b) => {
        ['leftColumn', 'rightColumn'].forEach((colKey) => {
          if (b.ui_state?.[colKey]?.bullets && Array.isArray(b.ui_state[colKey].bullets)) {
            b.ui_state[colKey].bullets = b.ui_state[colKey].bullets.map((txt) =>
              typeof txt === 'string' ? txt.replace(/^\s*(-->|->|→)\s*/, '') : txt
            );
          }
        });
      });
    }

    // 6. Summary Thread: Strict 8 Steps, Exactly 6 Beats ([0,0], [1,2], [3,4], [5,6], [7,8], [1,8])
    if (scene.template === 'summary_thread' && Array.isArray(scene.beats) && scene.beats.length > 0) {
      const firstUI = scene.beats[0]?.ui_state || {};
      let steps = (firstUI.steps || []).map((s) => String(s).replace(/^\d+\.\s*/, '').trim());

      const joinedSteps = steps.join(' ').toLowerCase();
      const isBoilerplate =
        !/ch16/i.test(slug || '') &&
        joinedSteps.includes('identify the primary trend and major support') &&
        joinedSteps.includes('set objective stop-loss orders');

      if (isBoilerplate) {
        // Reconstruct 8 chapter-specific steps directly from the episode's scene titles & subtitles!
        const contentScenes = data.scenes.filter(
          (s) => s.template !== 'chat_story' && s.template !== 'interactive_quiz' && s.template !== 'summary_thread'
        );
        const derivedSteps = [];
        contentScenes.forEach((cs) => {
          (cs.beats || []).forEach((cb) => {
            if (cb.en_subtitle && derivedSteps.length < 8) {
              const cleanSub = cb.en_subtitle
                .replace(/^(According to John Murphy,|John Murphy writes:|Murphy's rule:|And finally,|First,|Second,|Third,)\s*/i, '')
                .replace(/\.$/, '')
                .trim();
              if (cleanSub.length > 15 && !derivedSteps.includes(cleanSub)) {
                derivedSteps.push(cleanSub.charAt(0).toUpperCase() + cleanSub.slice(1));
              }
            }
          });
        });
        if (derivedSteps.length >= 6) {
          steps = derivedSteps.slice(0, 8);
        }
      }

      const defaultSteps = [
        'Identify the primary trend and major support/resistance levels',
        'Confirm breakouts with volume expansion and open interest',
        'Use moving averages to ride trends and filter intraday noise',
        'Monitor momentum oscillators for divergence and exhaustion',
        'Align signals across daily, weekly, and monthly timeframes',
        'Set objective stop-loss orders before entering any trade',
        'Risk a fixed small percentage of capital on every position',
        'Let winning trades run until clear trend reversal appears',
      ];

      while (steps.length < 8) {
        steps.push(defaultSteps[steps.length]);
      }
      if (steps.length > 8) {
        steps = steps.slice(0, 8);
      }
      for (let i = 0; i < steps.length; i++) {
        if (/[\u0900-\u097F]/.test(steps[i])) {
          steps[i] = defaultSteps[i] || `Technical principle ${i + 1}`;
        }
      }

      // Remove any previously corrupted "Crucial rule:" synthetic beat if present
      scene.beats = scene.beats.filter(
        (b) =>
          !/^Crucial rule:/i.test(b.en_subtitle || '') &&
          !/चार्ट पर हमेशा याद रखें.*(?:[A-Za-z]{4,})/.test(b.hindi_tts || '')
      );

      const introBeat = scene.beats[0];
      const takeawayBeat = scene.beats[scene.beats.length - 1];

      const defaultPairs = [
        {
          hindi: 'पहले बुनियादी ट्रेंड और प्रमुख सपोर्ट-रेजिस्टेंस स्तरों को पहचानना सबसे पहला कदम है।',
          en: 'First identify primary trend structure and key support-resistance levels.',
          range: [1, 2],
        },
        {
          hindi: 'इसके बाद वॉल्यूम और मोमेंटम इंडिकेटर्स से ब्रेकआउट की मजबूती की पुष्टि करें।',
          en: 'Next confirm breakout strength using volume and momentum indicators.',
          range: [3, 4],
        },
        {
          hindi: 'गलत सिग्नल्स और व्हिपसॉ से बचने के लिए मल्टीपल टाइमफ्रेम और स्टॉपलॉस का पालन करें।',
          en: 'Adhere strictly to stop-loss rules and multiple timeframe confirmation.',
          range: [5, 6],
        },
        {
          hindi: 'आखिर में अनुशासन और रिस्क मैनेजमेंट ही बाजार में आपकी पूंजी की रक्षा करते हैं।',
          en: 'Finally discipline and risk management protect your capital in the market.',
          range: [7, 8],
        },
      ];

      // If beats are not 6, construct the clean 6-beat sequence
      let bodyBeats = scene.beats.slice(1, -1);
      if (bodyBeats.length !== 4) {
        const newBeats = [introBeat];
        for (let i = 0; i < 4; i++) {
          const existing = bodyBeats[i];
          if (existing && !/[A-Za-z]{4,}/.test(existing.hindi_tts || '')) {
            newBeats.push({
              ...existing,
              ui_state: {
                ...existing.ui_state,
                steps,
                heading: "Today's thread",
                activeStepRange: defaultPairs[i].range,
              },
            });
          } else {
            newBeats.push({
              id: `${introBeat.id || 'b'}_pair${i + 1}`,
              hindi_tts: defaultPairs[i].hindi,
              en_subtitle: defaultPairs[i].en,
              pauseAfterMs: 400,
              ui_state: {
                ...introBeat.ui_state,
                steps,
                heading: "Today's thread",
                activeStepRange: defaultPairs[i].range,
              },
            });
          }
        }
        newBeats.push(takeawayBeat);
        scene.beats = newBeats;
      }

      // Lock exact ranges across all 6 beats
      const targetRanges = [[0, 0], [1, 2], [3, 4], [5, 6], [7, 8], [1, 8]];
      scene.beats.forEach((b, idx) => {
        if (!b.ui_state) b.ui_state = {};
        b.ui_state.steps = steps;
        b.ui_state.heading = "Today's thread";
        b.ui_state.activeStepRange = targetRanges[idx] || [1, 8];
        if (b.ui_state.bottomTakeaway && /[\u0900-\u097F]/.test(b.ui_state.bottomTakeaway)) {
          b.ui_state.bottomTakeaway = "Always evaluate internal market breadth and volume before trusting index moves.";
        }
      });
    }

    // 7. Phonetic TTS Sanitation
    if (Array.isArray(scene.beats)) {
      scene.beats.forEach((b) => {
        if (b.hindi_tts) {
          b.hindi_tts = b.hindi_tts
            .replace(/रि[ज़जज़]ल्ट्स|रि[ज़जज़]ल्ट|रि[ज़जज़]िट|रि[ज़जज़]ट/gi, 'नतीजे')
            .replace(/USFDA|यू\s*एस\s*एफ\s*डी\s*ए/gi, 'दवा रेगुलेटर (FDA)')
            .replace(/व्हिपसॉ/g, 'विप-सॉ')
            .replace(/ब्लोफ/g, 'ब्लो-ऑफ')
            .replace(/ओआई/g, 'ओपन इंटरेस्ट')
            .replace(/ईएमए/g, 'ई एम ए')
            .replace(/एसएमए/g, 'एस एम ए')
            .replace(/\bKAMA\b/gi, 'कामा')
            .replace(/freight\s+train/gi, 'भारी ट्रेन');
        }
      });
    }

    // 8. General UI State Devanagari Guard: ui_state must be 100% English
    if (Array.isArray(scene.beats)) {
      scene.beats.forEach((b) => {
        if (b.ui_state && typeof b.ui_state === 'object') {
          function purgeDevanagari(obj) {
            for (const key of Object.keys(obj)) {
              const val = obj[key];
              if (typeof val === 'string' && /[\u0900-\u097F]/.test(val)) {
                if (key === 'bottomTakeaway') obj[key] = 'Strict discipline and technical confirmation protect your trading edge.';
                else if (key === 'heading') obj[key] = "Today's thread";
                else if (key === 'question') obj[key] = 'Analyze the technical setup and determine the valid market action:';
                else if (key === 'answer') obj[key] = 'Wait for confirmed breakout with expanding volume before entry.';
                else if (key === 'badge') obj[key] = 'TECHNICAL RULE';
                else if (key === 'title') obj[key] = 'Market Structure';
                else if (key === 'subtitle') obj[key] = 'Key Technical Insight';
                else obj[key] = val.replace(/[\u0900-\u097F]+/g, '').trim() || 'Technical Confirmation';
              } else if (Array.isArray(val)) {
                for (let i = 0; i < val.length; i++) {
                  if (typeof val[i] === 'string' && /[\u0900-\u097F]/.test(val[i])) {
                    val[i] = `Technical Checklist Item ${i + 1}`;
                  } else if (val[i] && typeof val[i] === 'object') {
                    purgeDevanagari(val[i]);
                  }
                }
              } else if (val && typeof val === 'object') {
                purgeDevanagari(val);
              }
            }
          }
          purgeDevanagari(b.ui_state);
        }
      });
    }
  });

  return data;
}

export function parseAndCleanEpisodeJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('No text returned in Gemini response.');
  }

  const text = rawText.trim();
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error(`Response does not contain a valid JSON object. Text preview: ${text.slice(0, 160)}...`);
  }

  const jsonSubstring = text.substring(firstBrace, lastBrace + 1).trim();
  return JSON.parse(jsonSubstring);
}

export async function generateEpisode() {
  if (dryRun) {
    console.log('[DRY RUN] Prompt prepared. Exiting without making API call.');
    return;
  }

  let episodeData = null;
  const isArgonTarget = targetModel.toLowerCase().includes('argon');
  const proxyOnline = await ensureProxyRunning();

  if (proxyOnline && (isArgonTarget || !process.env.GEMINI_API_KEY)) {
    console.log(`[GENERATOR] Using active free-gemini-api proxy with model ${targetModel}...`);
    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      try {
        const raw = await callGeminiArgonViaProxy(prompt, targetModel, temperature);
        episodeData = parseAndCleanEpisodeJson(raw);
        break;
      } catch (proxyErr) {
        console.warn(`[WARN] Proxy attempt ${attempts} failed (${proxyErr.message}). Re-verifying proxy and retrying in 8s...`);
        if (attempts >= 3) {
          throw new Error(`Argon proxy generation failed after 3 attempts: ${proxyErr.message}`);
        }
        await new Promise((r) => setTimeout(r, 8000));
        await ensureProxyRunning();
      }
    }
  } else {
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!geminiApiKey) {
      throw new Error('Neither Gemini session cookies (cookies/cookies.json) are present nor GEMINI_API_KEY is configured.');
    }
    console.log(`[GENERATOR] Calling Google GenAI SDK with model ${targetModel}...`);
    const clientOptions = { apiKey: geminiApiKey };
    const aiClient = new GoogleGenAI(clientOptions);
    const response = await aiClient.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        temperature,
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });
    const raw = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
    episodeData = parseAndCleanEpisodeJson(raw);
  }

  if (!episodeData) {
    throw new Error('Failed to generate episode payload.');
  }

  episodeData = normalizeAndRemedyEpisode(episodeData, chapterSlug);

  const outputPath = path.join(chapterDir, 'episode_raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(episodeData, null, 2), 'utf8');

  console.log(`[VALIDATION] Running Zod guardrails on generated episode payload...`);
  const relTargetDir = path.relative(rootDir, chapterDir).replace(/\\/g, '/');
  try {
    execSync(`node "${path.join(__dirname, 'validate_episode.mjs')}" --dir="${relTargetDir}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
  } catch {
    console.warn(`\n⚠️ Initial validation detected issues. Applying automated self-correction...`);
    episodeData = normalizeAndRemedyEpisode(episodeData, chapterSlug);
    fs.writeFileSync(outputPath, JSON.stringify(episodeData, null, 2), 'utf8');

    try {
      execSync(`node "${path.join(__dirname, 'validate_episode.mjs')}" --dir="${relTargetDir}"`, {
        stdio: 'inherit',
        cwd: rootDir,
      });
      console.log(`✅ Single-pass automated self-correction succeeded!\n`);
    } catch {
      console.error(`[VALIDATION FAILED] Validation still failed after self-correction.`);
      const errorDumpPath = path.join(chapterDir, 'episode_generation_error.json');
      fs.writeFileSync(errorDumpPath, JSON.stringify(episodeData, null, 2), 'utf8');
      console.error(`[DUMP] Raw output saved to: ${errorDumpPath}`);
      throw new Error('Episode validation failed.');
    }
  }

  console.log(`\n========================================`);
  console.log(`[SUCCESS] Episode successfully generated & validated!`);
  console.log(`  Saved to: ${outputPath}`);
  console.log(`  Scenes:   ${episodeData.scenes.length}`);
  console.log(`========================================\n`);

  return outputPath;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateEpisode().catch((err) => {
    console.error('[FATAL] Episode generation failed:', err);
    process.exit(1);
  });
}