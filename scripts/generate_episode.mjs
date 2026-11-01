import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { validateEpisodeData } from './validate_episode.mjs';

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
4. PROGRESSIVE CARDS INVARIANT:
   - In 'progressive_cards', the number of cards in 'cards' MUST NEVER exceed the number of beats in the scene ('cards.length <= beats.length').
   - Reveal at most 1 new card per beat ('beat 0 -> 1 card visible, beat 1 -> 2 cards visible', etc.).
   - Card copy ('title' and 'subtitle') must remain strictly identical across all beats of the scene.
5. INTERACTIVE QUIZ INVARIANT:
   - 'ui_state.answer' MUST be a single plain string (e.g. "No — Transport index did not confirm."), NEVER a JSON object or dictionary.
   - 'ui_state.question' must be self-contained (min 18 words) and stay 100% identical across all beats of the scene.
6. TUG OF WAR INVARIANT:
   - Always include 'centerTitle', 'centerMetric', and 'trend' ('up', 'down', or 'neutral').
   - Keep 'leftCount' and 'rightCount' between 0 and 25.
7. SUMMARY THREAD INVARIANT:
   - Must contain between 6 and 8 sequential numbered steps ('steps.length >= 6 && steps.length <= 8').
   - 'heading' must remain constant ('Today\\'s thread') across all beats.
8. 12-SCENE PEDAGOGICAL RHYTHM:
   - Scene 1: Novice Flawed Trade/Action (chat_story)
   - Scene 2: Market Paradox / Unexpected Drop (data_visualizer)
   - Scene 3: The Roadmap (progressive_cards)
   - Scene 4-9: Mental Models & Dynamics (alternating data_visualizer, tug_of_war, progressive_cards, split_comparison)
   - Scene 10: Active Recall Quiz with 4000ms thinking pause (interactive_quiz)
   - Scene 11: Application Dialogue (chat_story)
   - Scene 12: Chapter Thread & Key Takeaway (summary_thread with 6-8 numbered steps)
9. RESPONSE FORMAT: Return ONLY a valid JSON object matching the episode schema. No Markdown wrapper, no thoughts outside JSON.
`;

const curriculumText = curriculumArg
  ? curriculumArg.slice('--curriculum='.length)
  : promptArg
    ? promptArg.slice('--prompt='.length)
    : '';

const prompt = `
Generate a complete episode for:
- Course: ${topicArg ? topicArg.split('=')[1] : 'TECHNICAL ANALYSIS · MURPHY'}
- Chapter: ${chapterSlug.toUpperCase()}
- Domain: ${domainArg ? domainArg.split('=')[1] : 'Finance / Trading'}
${curriculumText ? `\nCurriculum Directives & Scope:\n${curriculumText}\n` : ''}
${contextText ? `\nInput Context:\n${contextText}\n` : ''}

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

export async function generateEpisode() {
  if (dryRun) {
    console.log('[DRY RUN] Prompt prepared. Exiting without making API call.');
    return;
  }

  let responseText = null;

  // Route A: If Argon requested or cookies available, use direct authenticated Gemini 4 Argon engine
  const cookiePath = path.resolve(rootDir, '..', 'free-gemini-api', 'cookies', 'cookies.json');
  const hasCookies = fs.existsSync(cookiePath);
  const isArgonTarget = targetModel.toLowerCase().includes('argon');

  if (isArgonTarget || hasCookies) {
    console.log(`[GENERATOR] Invoking Gemini 4 Argon via authenticated web session...`);
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

      // 2. Interactive Quiz Immutability & Answer Object-to-String Normalization
      if (scene.template === 'interactive_quiz' && Array.isArray(scene.beats)) {
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
      }

      // 3. Phonetic TTS Sanitation
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

  // Zod Guardrail Validation
  console.log(`[VALIDATION] Running Zod guardrails on generated episode payload...`);
  let validation = validateEpisodeData(episodeData);

  if (!validation.valid) {
    console.warn(`\n⚠️ Initial validation detected ${validation.errors.length} schema error(s). Applying automated self-correction...`);
    validation.errors.forEach((err, idx) => console.warn(`  ${idx + 1}. ${err}`));

    // Apply self-correction remedies
    if (Array.isArray(episodeData.scenes)) {
      episodeData.scenes.forEach((scene) => {
        // Fallback for tug_of_war fields
        if (scene.template === 'tug_of_war') {
          scene.beats?.forEach((b) => {
            if (b.ui_state) {
              b.ui_state.centerTitle = b.ui_state.centerTitle || 'Tug of War';
              b.ui_state.centerMetric = b.ui_state.centerMetric || 'Balance';
              b.ui_state.trend = b.ui_state.trend || 'neutral';
            }
          });
        }
      });
    }

    // Re-validate strictly once
    validation = validateEpisodeData(episodeData);
    if (validation.valid) {
      console.log(`✅ Single-pass automated self-correction succeeded!\n`);
    } else {
      console.error(`[VALIDATION FAILED] Generated JSON still has ${validation.errors.length} schema errors after self-correction:`);
      validation.errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
      const errorDumpPath = path.join(chapterDir, 'episode_generation_error.json');
      fs.writeFileSync(errorDumpPath, JSON.stringify(episodeData, null, 2), 'utf8');
      console.error(`[DUMP] Raw output saved to: ${errorDumpPath}`);
      throw new Error('Episode validation failed.');
    }
  }

  const outputPath = path.join(chapterDir, 'episode_raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(episodeData, null, 2), 'utf8');

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

