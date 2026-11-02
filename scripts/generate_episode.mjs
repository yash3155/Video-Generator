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

// Determine Chapter Slug & Directory
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

console.log(`\n========================================`);
console.log(`[EPISODE GENERATOR] Pipeline Execution`);
console.log(`  Target Model:      ${targetModel}`);
console.log(`  Proxy Base URL:    ${geminiBaseUrl || 'Default Gemini API'}`);
console.log(`  Reasoning Level:   ${thinkingLevel}`);
console.log(`  Temperature:       ${temperature} (Strict schema adherence)`);
console.log(`  Target Directory:  ${chapterDir}`);
console.log(`  Chapter Slug:      ${chapterSlug}`);
console.log(`========================================\n`);

// Ensure isolated directory exists
if (!fs.existsSync(chapterDir)) {
  fs.mkdirSync(chapterDir, { recursive: true });
}

// Load Schema Reference & Personas
const schemaRefPath = path.join(rootDir, 'src', 'data', 'schema_reference.json');
const personasPath = path.join(rootDir, 'src', 'data', 'personas.json');

const schemaRef = JSON.parse(fs.readFileSync(schemaRefPath, 'utf8'));
const personas = JSON.parse(fs.readFileSync(personasPath, 'utf8'));

// Optional Notes/Input Context
let contextText = '';
if (notesArg) {
  const notesPath = path.resolve(rootDir, notesArg.split('=')[1]);
  if (fs.existsSync(notesPath)) {
    contextText = fs.readFileSync(notesPath, 'utf8');
    console.log(`[INFO] Loaded input context from: ${notesPath}`);
  }
}

const systemInstruction = `
You are the Lead Pedagogical Storyboard Architect for an autonomous educational video engine built in Remotion.
You synthesize dense technical or domain knowledge into a 12-slide, 35-50 beat episode payload conforming to the exact schema specification.

CRITICAL INVARIANTS:
1. 100% ENGLISH UI TEXT: Every field inside 'ui_state' (questions, card titles, subtitles, badge copy, annotations, steps, headings) MUST be English. Devanagari characters are strictly forbidden in 'ui_state' and will fail automated Zod validation.
2. HINDI TTS NARRATION: 'hindi_tts' must be natural, warm, conversational Hinglish in Devanagari script. Use natural words ('नियम', 'बातें', 'सिद्धांत', 'नतीजे') instead of rigid translations. Format numbers and currencies as digits ('₹152', '40%', '200ms'). Never use 'रिज़ल्ट' (always 'नतीजे').
3. EN_SUBTITLE: Short, concise English subtitles under 16 words per beat.
4. EXACT CHAPTER BREADCRUMB: 'meta.chapter' must strictly follow the format: 'CHAPTER X · PART Y' (or 'APPENDIX ...'). Never include '_ARGON' or underscores.
5. DETERMINISTIC CHART PRESET PRICE TABLE (CRITICAL):
   When creating scenes with 'data_visualizer', you MUST adhere to the exact candle price bounds of the chosen preset across all spoken beats ('hindi_tts', 'en_subtitle'), annotations, and side cards:
   - 'uptrend_then_drop': Candle High is ₹158 (starts ~₹120, peaks at ₹158 on candle 18–23, drops to ₹141 on candle 27). NEVER mention ₹165 (165 is only the empty Y-axis top border)!
   - 'uptrend_break': Candle High is ₹148 (climbs from ₹98 to ₹148 on candle 16, breaks support at ₹140, drops to ₹134). NEVER mention ₹150 or ₹152 (152 is only the empty Y-axis top border)!
   - 'bull_breakout': Breaks resistance at ₹150 on expanding volume, rallies to ₹168 (Bounds [119, 168]).
   - 'head_and_shoulders': Left Shoulder ₹158 at idx 4, Head ₹175 at idx 12, Right Shoulder ₹156 at idx 20, Neckline breaks at ₹142 to ₹134.
   - 'random_walk_line': Bounds [70, 185]
   Mentioning any price outside these ranges is strictly forbidden and immediately fails validation.
6. PROGRESSIVE CARDS INVARIANT:
   - In 'progressive_cards', the number of cards in 'cards' MUST NEVER exceed the number of beats in the scene ('cards.length <= beats.length').
   - Reveal at most 1 new card per beat ('beat 0 -> 1 card visible, beat 1 -> 2 cards visible', etc.).
   - Card copy ('title' and 'subtitle') must remain strictly identical across all beats of the scene.
7. INTERACTIVE QUIZ 3-BEAT INVARIANT:
   - The scene MUST contain exactly 3 beats:
     * Beat 0: Scenario introduction ('showThinkingSpinner: false', 'answer: null')
     * Beat 1: Thinking pause ('showThinkingSpinner: true', 'answer: null', 'pauseAfterMs: 3200')
     * Beat 2: Answer reveal ('showThinkingSpinner: false', 'answer: "..."' as a non-empty string)
   - 'ui_state.answer' MUST be a single plain string, NEVER a JSON object or dictionary.
   - 'ui_state.question' must be a self-contained scenario + question (min 18 words) and stay 100% identical across all 3 beats.
8. SPLIT COMPARISON INVARIANT:
   - Bullets must NOT start with ASCII arrows ('-->' or '->').
9. TUG OF WAR INVARIANT:
   - Always include 'centerTitle', 'centerMetric', and 'trend' ('up', 'down', or 'neutral').
   - Keep 'leftCount' and 'rightCount' between 0 and 25.
10. SUMMARY THREAD INVARIANT (2-STEP LOCK):
   - Scene must have at least 4 beats ('scene.beats.length >= 4'). For 7-8 steps, use 5-6 beats.
   - Beat 0 must have 'activeStepRange: [0, 0]' and introduce the recap thread.
   - Body beats must highlight AT MOST 2 steps per beat (e.g. [1, 2], [3, 4], [5, 6], [7, 8]). NEVER highlight 3 steps at once (e.g. [1, 3] or [4, 6] strictly fails validation!).
   - Final beat displays all steps ([1, totalSteps]) with 'bottomTakeaway'.
   - 'steps' array must contain 6 to 8 items ('steps.length >= 6 && steps.length <= 8').
   - 'heading' must remain constant ('Today\\'s thread') across all beats.
11. 12-SCENE PEDAGOGICAL RHYTHM:
   - Scene 1: Novice Flawed Trade/Action (chat_story)
   - Scene 2: Market Paradox / Unexpected Drop (data_visualizer)
   - Scene 3: The Roadmap (progressive_cards)
   - Scene 4-9: Mental Models & Dynamics (alternating data_visualizer, tug_of_war, progressive_cards, split_comparison)
   - Scene 10: Active Recall Quiz with 3200ms thinking pause (interactive_quiz, 3 beats)
   - Scene 11: Application Dialogue (chat_story)
   - Scene 12: Chapter Thread & Key Takeaway (summary_thread, >= 4 beats)
12. RESPONSE FORMAT: Return ONLY a valid JSON object matching the episode schema. No Markdown wrapper, no thoughts outside JSON.
`;

const curriculumText = curriculumArg
  ? curriculumArg.slice('--curriculum='.length)
  : promptArg
    ? promptArg.slice('--prompt='.length)
    : '';

function formatChapterBreadcrumb(slug) {
  if (!slug) return 'CHAPTER 1 · PART 1';
  const match = slug.match(/ch(\d+)_part(\d+)/i);
  if (match) {
    return `CHAPTER ${parseInt(match[1], 10)} · PART ${parseInt(match[2], 10)}`;
  }
  if (slug.toLowerCase().includes('appendix')) {
    return 'APPENDIX';
  }
  return slug.replace(/_argon/i, '').replace(/_/g, ' ').toUpperCase();
}

const prompt = `
Generate a complete, high-fidelity episode for:
- Course: ${topicArg ? topicArg.split('=')[1] : 'TECHNICAL ANALYSIS · MURPHY'}
- Chapter: ${formatChapterBreadcrumb(chapterSlug)}
- Domain: ${domainArg ? domainArg.split('=')[1] : 'Finance / Trading'}
${curriculumText ? `\nCurriculum Directives & Scope:\n${curriculumText}\n` : ''}
${contextText ? `\nInput Context:\n${contextText}\n` : ''}

CRITICAL STRUCTURAL REQUIREMENTS:
You MUST generate EXACTLY 11 to 12 distinct scenes and at least 35 total beats. Do NOT compress into a brief 5-7 scene summary:
- Scene 0: Hook Part 1 (chat_story, 2-3 beats)
- Scene 1: Hook Part 2 (data_visualizer, 3 beats, e.g. price drops or unexpected action)
- Scene 2: The Roadmap (progressive_cards, 3-4 beats)
- Scenes 3-8: Deep Dives into Core Concepts (alternating data_visualizer, progressive_cards, split_comparison, tug_of_war, 2-3 beats each)
- Scene 9: Active Recall Quiz (interactive_quiz, EXACTLY 3 beats: Beat 0 intro, Beat 1 thinking pause with showThinkingSpinner: true & pauseAfterMs: 3200, Beat 2 answer reveal with showThinkingSpinner: false)
- Scene 10: Practical Application Dialogue (chat_story, 2-3 beats)
- Scene 11: The Whole Picture (summary_thread, EXACTLY 4-5 beats, with 6 to 8 numbered steps and heading "Today's thread")

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

  // Argon Header (ModeID 95a4c0abcba24364)
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
  const proxyHealthUrl = (process.env.GEMINI_BASE_URL || 'http://127.0.0.1:8001')
    .replace(/\/v1\/chat\/completions\/?$/, '')
    .replace(/\/+$/, '') + '/health';

  try {
    const res = await fetch(proxyHealthUrl, { signal: AbortSignal.timeout(1200) });
    if (res.ok) return true;
  } catch {}

  const exePath = path.resolve(rootDir, '..', 'free-gemini-api', 'gemini-core-windows-amd64.exe');
  if (fs.existsSync(exePath)) {
    console.log('[PROXY] Local free-gemini-api proxy is not running. Launching in background...');
    const subprocess = spawn(exePath, [], {
      cwd: path.dirname(exePath),
      detached: true,
      stdio: 'ignore',
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
      } catch {}
    }
  }
  return false;
}

async function callGeminiArgonViaProxy(promptText, model = 'gemini-4-argon', temp = 0.2) {
  const baseUrl = process.env.GEMINI_BASE_URL || 'http://127.0.0.1:8001/v1/chat/completions';
  const completionsUrl = baseUrl.endsWith('/v1/chat/completions')
    ? baseUrl
    : `${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`;

  console.log(`[ARGON PROXY] Routing generation request through: ${completionsUrl} (model: ${model})...`);
  const res = await fetch(completionsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer none',
    },
    signal: AbortSignal.timeout(360000), // 360s: Allow full deep-reasoning and JSON synthesis
    body: JSON.stringify({
      model: model,
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

const PRESET_CANDLE_BOUNDS = {
  uptrend_then_drop: {
    minCandle: 119,
    maxCandle: 160,
    forbiddenPrices: [165],
    defaultSafeMin: 120,
    defaultSafeMax: 158,
  },
  uptrend_break: {
    minCandle: 97,
    maxCandle: 149,
    forbiddenPrices: [152],
    defaultSafeMin: 98,
    defaultSafeMax: 148,
  },
  bull_breakout: {
    minCandle: 119,
    maxCandle: 169,
    forbiddenPrices: [175],
    defaultSafeMin: 120,
    defaultSafeMax: 168,
  },
  head_and_shoulders: {
    minCandle: 133,
    maxCandle: 175,
    forbiddenPrices: [182, 124],
    defaultSafeMin: 134,
    defaultSafeMax: 175,
  },
  random_walk_line: {
    minCandle: 95,
    maxCandle: 175,
    forbiddenPrices: [],
    defaultSafeMin: 100,
    defaultSafeMax: 165,
  },
};

function normalizeAndRemedyEpisode(data, slug) {
  if (!data || !Array.isArray(data.scenes)) return data;

  if (data.meta) {
    data.meta.chapter = formatChapterBreadcrumb(data.meta.chapter || slug);
  }

  data.scenes.forEach((scene) => {
    // 1. Progressive Cards Immutability & Single Reveal Enforcement
    if (scene.template === 'progressive_cards' && Array.isArray(scene.beats)) {
      const numBeats = scene.beats.length;
      scene.beats.forEach((b) => {
        if (b.ui_state && Array.isArray(b.ui_state.cards) && b.ui_state.cards.length > numBeats) {
          const keep = b.ui_state.cards.slice(0, numBeats - 1);
          const tail = b.ui_state.cards.slice(numBeats - 1);
          const merged = {
            ...tail[0],
            title: tail.map((c) => c.title).join(' & ').slice(0, 50),
            subtitle: tail.map((c) => c.subtitle).join(' · ').slice(0, 90),
          };
          b.ui_state.cards = [...keep, merged];
        }
      });

      const firstCards = scene.beats[0]?.ui_state?.cards || [];
      scene.beats.forEach((b, bIdx) => {
        if (b.ui_state && Array.isArray(b.ui_state.cards)) {
          b.ui_state.cards = firstCards.map((c, cIdx) => {
            let state = 'hidden';
            if (cIdx < bIdx) state = 'muted';
            else if (cIdx === bIdx) state = 'active_amber';
            return {
              title: c.title,
              subtitle: c.subtitle,
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
          hindi_tts: 'ध्यान से सोचिए और बताइए कि डाउ थ्योरी और चार्ट विश्लेषण के हिसाब से सही फैसला क्या होगा।',
          en_subtitle: 'Carefully analyze the market scenario and predict the confirmed technical signal.',
          pauseAfterMs: 400,
          ui_state: {
            badge: bSpin.ui_state?.badge || 'Concept Check',
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
            b.ui_state.leftCount = Math.min(25, Math.max(0, Math.round(b.ui_state.leftCount)));
          }
          if (typeof b.ui_state.rightCount === 'number') {
            b.ui_state.rightCount = Math.min(25, Math.max(0, Math.round(b.ui_state.rightCount)));
          }
          b.ui_state.centerTitle = b.ui_state.centerTitle || 'Tug of War';
          b.ui_state.centerMetric = b.ui_state.centerMetric || 'Balance';
          b.ui_state.trend = b.ui_state.trend || 'neutral';
        }
      });
    }

    // 4. Data Visualizer Price Clamping to Exact Preset Bounds
    if (scene.template === 'data_visualizer' && Array.isArray(scene.beats)) {
      scene.beats.forEach((b) => {
        const ui = b.ui_state;
        if (!ui) return;
        const preset = ui.preset || 'uptrend_then_drop';
        const bounds = PRESET_CANDLE_BOUNDS[preset];
        if (!bounds) return;

        if (preset === 'head_and_shoulders') {
          if (!/shoulder|head|neckline|reversal pattern/i.test(`${scene.title || ''} ${ui.chartTitle || ''} ${ui.chartSubtitle || ''}`)) {
            ui.chartSubtitle = `${ui.chartSubtitle || ''} · reversal pattern`.trim();
          }
        }

        const clampPriceStr = (str) => {
          if (typeof str !== 'string') return str;
          return str.replace(/₹\s*(\d+(?:,\d+)?(?:\.\d+)?)/g, (match, p) => {
            const val = parseFloat(p.replace(/,/g, ''));
            if (val < bounds.minCandle) return `₹${bounds.defaultSafeMin}`;
            if (val > bounds.maxCandle || bounds.forbiddenPrices.includes(val)) return `₹${bounds.defaultSafeMax}`;
            return match;
          });
        };

        if (b.hindi_tts) b.hindi_tts = clampPriceStr(b.hindi_tts);
        if (b.en_subtitle) b.en_subtitle = clampPriceStr(b.en_subtitle);
        if (Array.isArray(ui.annotations)) {
          ui.annotations.forEach((ann) => {
            if (ann.text) ann.text = clampPriceStr(ann.text);
            if (typeof ann.value === 'number') {
              if (ann.value < bounds.minCandle) ann.value = bounds.defaultSafeMin;
              if (ann.value > bounds.maxCandle || bounds.forbiddenPrices.includes(ann.value)) {
                ann.value = bounds.defaultSafeMax;
              }
            }
          });
        }
        if (Array.isArray(ui.sideCards)) {
          ui.sideCards.forEach((c) => {
            if (c.title) c.title = clampPriceStr(c.title);
            if (c.subtitle) c.subtitle = clampPriceStr(c.subtitle);
          });
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

    // 6. Summary Thread Heading, Steps Count (6-8), & 2-Step Sequential Beats
    if (scene.template === 'summary_thread' && Array.isArray(scene.beats)) {
      const firstUI = scene.beats[0]?.ui_state || {};
      let steps = firstUI.steps || [];
      if (!Array.isArray(steps) || steps.length < 6) {
        if (!Array.isArray(steps)) steps = [];
        while (steps.length < 6) {
          steps.push(`Key Principle ${steps.length + 1}: Always trade the confirmed evidence, not emotional assumptions.`);
        }
      } else if (steps.length > 8) {
        steps = steps.slice(0, 8);
      }
      const totalSteps = steps.length;

      // Body 2-step chunks: e.g. [1,2], [3,4], [5,6], [7,8]
      const bodyRanges = [];
      for (let s = 1; s <= totalSteps; s += 2) {
        bodyRanges.push([s, Math.min(totalSteps, s + 1)]);
      }
      const requiredTotalBeats = 1 + bodyRanges.length + 1; // intro + body + takeaway

      scene.beats.forEach((b) => {
        if (!b.ui_state) b.ui_state = {};
        b.ui_state.steps = steps;
        b.ui_state.heading = "Today's thread";
      });

      if (scene.beats.length < requiredTotalBeats) {
        const origIntro = scene.beats[0];
        const origTakeaway = scene.beats[scene.beats.length - 1];
        const existingBody = scene.beats.slice(1, -1);

        const newBeats = [
          {
            ...origIntro,
            ui_state: {
              ...origIntro.ui_state,
              steps,
              heading: "Today's thread",
              activeStepRange: [0, 0],
            },
          },
        ];

        bodyRanges.forEach((range, idx) => {
          if (idx < existingBody.length) {
            newBeats.push({
              ...existingBody[idx],
              ui_state: {
                ...existingBody[idx].ui_state,
                steps,
                heading: "Today's thread",
                activeStepRange: range,
              },
            });
          } else {
            const stepNames = steps.slice(range[0] - 1, range[1]).map((s) => s.replace(/^.*?:/g, '').trim()).join(' और ');
            newBeats.push({
              id: `${origIntro.id || 'sum'}_b${idx + 1}`,
              hindi_tts: `चार्ट पर हमेशा याद रखें: ${stepNames}।`,
              en_subtitle: `Crucial rule: ${steps.slice(range[0] - 1, range[1]).join('; ')}.`,
              pauseAfterMs: 400,
              ui_state: {
                ...origIntro.ui_state,
                steps,
                heading: "Today's thread",
                activeStepRange: range,
              },
            });
          }
        });

        newBeats.push({
          ...origTakeaway,
          id: origTakeaway.id || `${origIntro.id || 'sum'}_takeaway`,
          pauseAfterMs: 600,
          ui_state: {
            ...origTakeaway.ui_state,
            steps,
            heading: "Today's thread",
            activeStepRange: [1, totalSteps],
          },
        });

        scene.beats = newBeats;
      } else {
        scene.beats[0].ui_state.activeStepRange = [0, 0];
        const bodyBeats = scene.beats.slice(1, -1);
        bodyBeats.forEach((b, idx) => {
          if (idx < bodyRanges.length) {
            b.ui_state.activeStepRange = bodyRanges[idx];
          } else {
            b.ui_state.activeStepRange = [totalSteps, totalSteps];
          }
        });
        scene.beats[scene.beats.length - 1].ui_state.activeStepRange = [1, totalSteps];
      }
    }

    // 7. Phonetic TTS Sanitation
    if (Array.isArray(scene.beats)) {
      scene.beats.forEach((b) => {
        if (b.hindi_tts) {
          b.hindi_tts = b.hindi_tts
            .replace(/रि[ज़जज़]ल्ट्स|रि[ज़जज़]ल्ट|रि[ज़जज़]िट|रि[ज़जज़]ट/gi, 'नतीजे')
            .replace(/USFDA|यू\s*एस\s*एफ\s*डी\s*ए/gi, 'दवा रेगुलेटर (FDA)')
            .replace(/freight\s+train/gi, 'भारी ट्रेन');
        }
      });
    }
  });

  return data;
}

export async function generateEpisode() {
  if (dryRun) {
    console.log('[DRY RUN] Prompt prepared. Exiting without making API call.');
    return;
  }

  let responseText = null;

  // Route A: Check if local proxy is online or can be started
  const isArgonTarget = targetModel.toLowerCase().includes('argon');
  const proxyOnline = await ensureProxyRunning();

  if (proxyOnline && (isArgonTarget || !process.env.GEMINI_API_KEY)) {
    console.log(`[GENERATOR] Using active free-gemini-api proxy with model ${targetModel}...`);
    try {
      responseText = await callGeminiArgonViaProxy(prompt, targetModel, temperature);
    } catch (proxyErr) {
      console.warn(`[WARN] Proxy attempt failed (${proxyErr.message}). Falling back to direct authenticated session...`);
      const fullSystemPrompt = `${systemInstruction}\n\nTask Instructions:\n${prompt}`;
      responseText = await callGeminiArgonDirect(fullSystemPrompt);
    }
  } else if (isArgonTarget || fs.existsSync(path.resolve(rootDir, '..', 'free-gemini-api', 'cookies', 'cookies.json'))) {
    console.log(`[GENERATOR] Invoking Gemini 4 Argon via authenticated web session fallback...`);
    const fullSystemPrompt = `${systemInstruction}\n\nTask Instructions:\n${prompt}`;
    responseText = await callGeminiArgonDirect(fullSystemPrompt);
  } else {
    // Route B: GoogleGenAI SDK Fallback
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
    responseText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  if (!responseText) {
    throw new Error('No text returned in Gemini response.');
  }

  let cleanedJson = responseText.trim();
  if (cleanedJson.includes('```json')) {
    const start = cleanedJson.indexOf('```json') + 7;
    const end = cleanedJson.lastIndexOf('```');
    if (end > start) {
      cleanedJson = cleanedJson.substring(start, end).trim();
    }
  } else if (cleanedJson.includes('```')) {
    const start = cleanedJson.indexOf('```') + 3;
    const end = cleanedJson.lastIndexOf('```');
    if (end > start) {
      cleanedJson = cleanedJson.substring(start, end).trim();
    }
  } else if (cleanedJson.includes('{') && cleanedJson.lastIndexOf('}') > cleanedJson.indexOf('{')) {
    cleanedJson = cleanedJson.substring(cleanedJson.indexOf('{'), cleanedJson.lastIndexOf('}') + 1).trim();
  }

  let episodeData = JSON.parse(cleanedJson);

  // Pre-normalize and remedy known edge cases before writing
  episodeData = normalizeAndRemedyEpisode(episodeData, chapterSlug);

  const outputPath = path.join(chapterDir, 'episode_raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(episodeData, null, 2), 'utf8');

  // Zod Guardrail Validation via scripts/validate_episode.mjs
  console.log(`[VALIDATION] Running Zod guardrails on generated episode payload...`);
  const relTargetDir = path.relative(rootDir, chapterDir).replace(/\\/g, '/');
  try {
    execSync(`node "${path.join(__dirname, 'validate_episode.mjs')}" --dir="${relTargetDir}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
  } catch (err) {
    console.warn(`\n⚠️ Initial validation detected issues. Applying automated self-correction...`);
    episodeData = normalizeAndRemedyEpisode(episodeData, chapterSlug);
    fs.writeFileSync(outputPath, JSON.stringify(episodeData, null, 2), 'utf8');

    // Re-validate strictly once
    try {
      execSync(`node "${path.join(__dirname, 'validate_episode.mjs')}" --dir="${relTargetDir}"`, {
        stdio: 'inherit',
        cwd: rootDir,
      });
      console.log(`✅ Single-pass automated self-correction succeeded!\n`);
    } catch (reErr) {
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

// Execute when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateEpisode().catch((err) => {
    console.error('[FATAL] Episode generation failed:', err);
    process.exit(1);
  });
}

