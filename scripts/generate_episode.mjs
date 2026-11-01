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

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!geminiApiKey) {
  console.error('[ERROR] GEMINI_API_KEY is not set in environment or .env.');
  process.exit(1);
}

const clientOptions = { apiKey: geminiApiKey };
if (geminiBaseUrl) {
  clientOptions.httpOptions = { baseUrl: geminiBaseUrl };
}
const aiClient = new GoogleGenAI(clientOptions);

const systemInstruction = `
You are the Lead Pedagogical Storyboard Architect for an autonomous educational video engine built in Remotion.
You synthesize dense technical or domain knowledge into a 12-slide, 35-50 beat episode payload conforming to the exact schema specification.

CRITICAL INVARIANTS:
1. 100% ENGLISH UI TEXT: Every field inside 'ui_state' (questions, card titles, subtitles, badge copy, annotations, steps, headings) MUST be English. Devanagari characters are strictly forbidden in 'ui_state' and will fail automated Zod validation.
2. HINDI TTS NARRATION: 'hindi_tts' must be natural, warm, conversational Hinglish in Devanagari script. Use natural words ('नियम', 'बातें', 'सिद्धांत', 'नतीजे') instead of rigid translations. Format numbers and currencies as digits ('₹152', '40%', '200ms').
3. EN_SUBTITLE: Short, concise English subtitles under 16 words per beat.
4. 12-SCENE PEDAGOGICAL RHYTHM:
   - Scene 1: Novice Flawed Trade/Action (chat_story)
   - Scene 2: Market Paradox / Unexpected Drop (data_visualizer)
   - Scene 3: The Roadmap (progressive_cards)
   - Scene 4-9: Mental Models & Dynamics (alternating data_visualizer, tug_of_war, progressive_cards, split_comparison)
   - Scene 10: Active Recall Quiz with 4000ms thinking pause (interactive_quiz)
   - Scene 11: Application Dialogue (chat_story)
   - Scene 12: Chapter Thread & Key Takeaway (summary_thread with 6-8 numbered steps)
5. RESPONSE FORMAT: Return ONLY a valid JSON object matching the episode schema. No Markdown wrapper, no thoughts outside JSON.
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

export async function generateEpisode() {
  if (dryRun) {
    console.log('[DRY RUN] Prompt prepared. Exiting without making API call.');
    return;
  }

  console.log(`[GENERATOR] Calling ${targetModel}...`);

  const response = await aiClient.models.generateContent({
    model: targetModel,
    contents: prompt,
    config: {
      temperature,
      systemInstruction,
      responseMimeType: 'application/json',
    },
  });

  const responseText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
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

  // Zod Guardrail Validation
  console.log(`[VALIDATION] Running Zod guardrails on generated episode payload...`);
  const validation = validateEpisodeData(episodeData);

  if (!validation.valid) {
    console.error(`[VALIDATION FAILED] Generated JSON has ${validation.errors.length} schema errors:`);
    validation.errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    const errorDumpPath = path.join(chapterDir, 'episode_generation_error.json');
    fs.writeFileSync(errorDumpPath, JSON.stringify(episodeData, null, 2), 'utf8');
    console.error(`[DUMP] Raw output saved to: ${errorDumpPath}`);
    throw new Error('Episode validation failed.');
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

