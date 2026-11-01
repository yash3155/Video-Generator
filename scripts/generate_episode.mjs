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
   - 'uptrend_then_drop': Bounds [115, 165] (starts ~₹120, peaks at ₹158 on candle 18–23, drops to ₹141 on candle 27)
   - 'uptrend_break': Bounds [92, 152] (climbs from ₹98 to ₹148 on candle 16, breaks support at ₹140, drops to ₹134)
   - 'head_and_shoulders': Bounds [124, 182] (Left Shoulder ₹158 at idx 4, Head ₹175 at idx 12, Right Shoulder ₹156 at idx 20, Neckline ₹142 breaks at idx 25)
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
10. SUMMARY THREAD INVARIANT:
   - Scene must have at least 4 beats ('scene.beats.length >= 4').
   - Beat 0 must have 'activeStepRange: [0, 0]' and introduce the recap thread.
   - Intermediate beats sequentially cover steps from 1 to 'steps.length'.
   - Final beat displays all steps with 'bottomTakeaway'.
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
    responseText = await callGeminiArgonViaProxy(prompt, targetModel, temperature);
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
  if (cleanedJson.startsWith('```json')) {
    cleanedJson = cleanedJson.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleanedJson.startsWith('```')) {
    cleanedJson = cleanedJson.replace(/^```/, '').replace(/```$/, '').trim();
  }

  const episodeData = JSON.parse(cleanedJson);

  // Auto-normalize scene card immutability & phonetics before validation
  if (Array.isArray(episodeData.scenes)) {
    episodeData.scenes.forEach((scene) => {
      // 1. Progressive Cards Immutability & Single Reveal Enforcement
      if (scene.template === 'progressive_cards' && Array.isArray(scene.beats)) {
        const numBeats = scene.beats.length;

        // If cards exceed beats, merge excess cards into the last reveal card
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

        // Synchronize canonical titles/subtitles from beat 0 and enforce single-card progressive reveal
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
        // If LLM returned 2 beats (thinking spinner + answer), synthesize the missing scenario intro beat
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
          // Normalize answer if LLM returned an object instead of string
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

      // 4. Data Visualizer Price Clamping to Preset Bounds
      if (scene.template === 'data_visualizer' && Array.isArray(scene.beats)) {
        const PRESET_BOUNDS = {
          uptrend_then_drop: { min: 115, max: 165 },
          uptrend_break: { min: 92, max: 152 },
          head_and_shoulders: { min: 124, max: 182 },
          random_walk_line: { min: 70, max: 185 },
        };
        const preset = scene.beats[0]?.ui_state?.preset;
        const bounds = PRESET_BOUNDS[preset];
        if (bounds) {
          const clampPriceStr = (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/₹\s*(\d+(?:\.\d+)?)/g, (match, p) => {
              const val = parseFloat(p);
              if (val < bounds.min) return `₹${bounds.min}`;
              if (val > bounds.max) return `₹${bounds.max}`;
              return match;
            });
          };

          scene.beats.forEach((b) => {
            if (b.hindi_tts) b.hindi_tts = clampPriceStr(b.hindi_tts);
            if (b.en_subtitle) b.en_subtitle = clampPriceStr(b.en_subtitle);
            if (b.ui_state) {
              if (Array.isArray(b.ui_state.annotations)) {
                b.ui_state.annotations.forEach((ann) => {
                  if (ann.text) ann.text = clampPriceStr(ann.text);
                  if (typeof ann.value === 'number') {
                    ann.value = Math.min(bounds.max, Math.max(bounds.min, ann.value));
                  }
                });
              }
              if (Array.isArray(b.ui_state.sideCards)) {
                b.ui_state.sideCards.forEach((c) => {
                  if (c.title) c.title = clampPriceStr(c.title);
                  if (c.subtitle) c.subtitle = clampPriceStr(c.subtitle);
                });
              }
            }
          });
        }
      }

      // 5. Split Comparison ASCII Arrow Removal
      if (scene.template === 'split_comparison' && Array.isArray(scene.beats)) {
        scene.beats.forEach((b) => {
          ['leftColumn', 'rightColumn'].forEach((col) => {
            if (b.ui_state?.[col]?.bullets && Array.isArray(b.ui_state[col].bullets)) {
              b.ui_state[col].bullets = b.ui_state[col].bullets.map((bullet) =>
                typeof bullet === 'string' ? bullet.replace(/^(-->|->|→)\s*/, '') : bullet
              );
            }
          });
        });
      }

      // 6. Summary Thread Heading, Steps Count (6-8), & Beat Expansion
      if (scene.template === 'summary_thread' && Array.isArray(scene.beats)) {
        // Ensure steps array length is between 6 and 8
        scene.beats.forEach((b) => {
          if (b.ui_state && Array.isArray(b.ui_state.steps)) {
            while (b.ui_state.steps.length < 6) {
              b.ui_state.steps.push(
                `Key Takeaway ${b.ui_state.steps.length + 1}: Always trade the confirmed evidence, not emotional assumptions`
              );
            }
            if (b.ui_state.steps.length > 8) {
              b.ui_state.steps = b.ui_state.steps.slice(0, 8);
            }
          }
        });

        const totalSteps = scene.beats[0]?.ui_state?.steps?.length || 6;

        // If fewer than 4 beats, expand into standard 4-beat summary progression
        if (scene.beats.length < 4 && scene.beats.length > 0) {
          const orig = scene.beats[0];
          const mid = Math.floor(totalSteps / 2);
          scene.beats = [
            {
              id: `${orig.id || 'sum'}_b0`,
              hindi_tts: 'आइए आज के पूरे चैप्टर की सभी जरूरी बातों को एक साथ दोहराते हैं।',
              en_subtitle: "Let's review the cornerstone principles and lessons covered in today's session.",
              pauseAfterMs: 400,
              ui_state: {
                ...orig.ui_state,
                heading: "Today's thread",
                activeStepRange: [0, 0],
              },
            },
            {
              id: `${orig.id || 'sum'}_b1`,
              hindi_tts: 'चार्ट के प्रकार और सही टाइमफ्रेम का चुनाव ही आपकी शुरुआती बढ़त तय करता है।',
              en_subtitle: 'Selecting the appropriate chart resolution establishes your foundational market edge.',
              pauseAfterMs: 400,
              ui_state: {
                ...orig.ui_state,
                heading: "Today's thread",
                activeStepRange: [1, mid],
              },
            },
            {
              id: `${orig.id || 'sum'}_b2`,
              hindi_tts: 'वॉल्यूम और ओपन इंटरेस्ट से ब्रेकआउट की पुष्टि किए बिना कभी ट्रेड में न उतरें।',
              en_subtitle: 'Never enter positions without volume and open interest confirming the move.',
              pauseAfterMs: 400,
              ui_state: {
                ...orig.ui_state,
                heading: "Today's thread",
                activeStepRange: [mid + 1, totalSteps],
              },
            },
            {
              id: `${orig.id || 'sum'}_b3`,
              hindi_tts: orig.hindi_tts || 'प्राइस एक्शन और वॉल्यूम का यह संगम आपको अनचाहे नुकसान से बचाएगा।',
              en_subtitle: orig.en_subtitle || 'Aligning price with volume ensures sustainable trading success.',
              pauseAfterMs: 600,
              ui_state: {
                ...orig.ui_state,
                heading: "Today's thread",
                activeStepRange: [1, totalSteps],
              },
            },
          ];
        } else {
          const numIntermediate = scene.beats.length - 2;
          scene.beats.forEach((b, bIdx) => {
            if (b.ui_state) {
              b.ui_state.heading = "Today's thread";
              if (bIdx === 0) {
                b.ui_state.activeStepRange = [0, 0];
              } else if (bIdx === scene.beats.length - 1) {
                b.ui_state.activeStepRange = [1, totalSteps];
              } else if (
                !Array.isArray(b.ui_state.activeStepRange) ||
                b.ui_state.activeStepRange.length !== 2 ||
                b.ui_state.activeStepRange[1] === 0
              ) {
                const stepChunk = Math.ceil(totalSteps / numIntermediate);
                const start = (bIdx - 1) * stepChunk + 1;
                const end = Math.min(totalSteps, bIdx * stepChunk);
                b.ui_state.activeStepRange = [start, end];
              }
            }
          });
        }
      }

      // 5. Phonetic TTS Sanitation
      if (Array.isArray(scene.beats)) {
        scene.beats.forEach((b) => {
          if (b.hindi_tts) {
            b.hindi_tts = b.hindi_tts
              .replace(/रि[ज़जज़]ल्ट्स|रि[ज़जज़]ल्ट|रि[ज़जज़]िट|रि[ज़जज़]ट/gi, 'नतीजे')
              .replace(/USFDA|यू\s*एस\s*एफ\s*डी\s*ए/gi, 'दवा रेगुलेटर (FDA)');
          }
        });
      }
    });
  }

  // Normalize Chapter Breadcrumb in Meta
  if (episodeData.meta) {
    episodeData.meta.chapter = formatChapterBreadcrumb(episodeData.meta.chapter || chapterSlug);
  }

  const outputPath = path.join(chapterDir, 'episode_raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(episodeData, null, 2), 'utf8');

  // Zod Guardrail Validation via scripts/validate_episode.mjs
  console.log(`[VALIDATION] Running Zod guardrails on generated episode payload...`);
  try {
    execSync(`node "${path.join(__dirname, 'validate_episode.mjs')}" --dir="${chapterDir}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
  } catch (err) {
    console.warn(`\n⚠️ Initial validation detected issues. Applying automated self-correction...`);
    episodeData = normalizeAndRemedyEpisode(episodeData, chapterSlug);
    fs.writeFileSync(outputPath, JSON.stringify(episodeData, null, 2), 'utf8');

    // Re-validate strictly once
    try {
      execSync(`node "${path.join(__dirname, 'validate_episode.mjs')}" --dir="${chapterDir}"`, {
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

