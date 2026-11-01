import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EdgeTTS } from 'node-edge-tts';
import { parseFile } from 'music-metadata';
import { GoogleGenAI } from '@google/genai';
import { validateEpisodeData } from './validate_episode.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// CLI Arguments
const args = process.argv.slice(2);
const force = args.includes('--force');
const ttsArg = args.find((a) => a.startsWith('--tts='));
let selectedMode = ttsArg ? ttsArg.split('=')[1].toLowerCase() : 'edge';

if (selectedMode !== 'gemini' && selectedMode !== 'edge') {
  console.warn(`[WARN] Unknown TTS mode '${selectedMode}'. Defaulting to 'edge'.`);
  selectedMode = 'edge';
}

const dirArg = args.find((a) => a.startsWith('--dir='));
const chapterArg = args.find((a) => a.startsWith('--chapter='));
let chapterSlug = null;
let chapterDir = null;

if (dirArg) {
  const customDir = dirArg.split('=')[1];
  chapterDir = path.isAbsolute(customDir) ? customDir : path.resolve(rootDir, customDir);
  if (path.extname(chapterDir) === '.json') {
    chapterDir = path.dirname(chapterDir);
  }
  chapterSlug = path.basename(chapterDir);
} else if (chapterArg) {
  chapterSlug = chapterArg.split('=')[1];
  chapterDir = path.resolve(rootDir, 'src', 'data', 'chapters', chapterSlug);
}

// Target Paths (Isolated chapter folder or root fallback)
const rawPath = chapterDir
  ? path.join(chapterDir, 'episode_raw.json')
  : path.join(rootDir, 'src', 'data', 'episode_raw.json');

const compiledPath = chapterDir
  ? path.join(chapterDir, 'episode_compiled.json')
  : path.join(rootDir, 'src', 'data', 'episode_compiled.json');

const audioDir = chapterSlug
  ? path.join(rootDir, 'public', 'audio', chapterSlug)
  : path.join(rootDir, 'public', 'audio');

const localAudioDir = chapterDir ? path.join(chapterDir, 'audio') : null;

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}
if (localAudioDir && !fs.existsSync(localAudioDir)) {
  fs.mkdirSync(localAudioDir, { recursive: true });
}

console.log(`[TTS] Compiler started. Target Mode: ${selectedMode.toUpperCase()} | Force overwrite: ${force}`);
if (chapterSlug) {
  console.log(`  -> Isolated Chapter: ${chapterSlug}`);
  console.log(`  -> Source: ${rawPath}`);
  console.log(`  -> Output: ${compiledPath}`);
  console.log(`  -> Audio Assets: ${audioDir}`);
}

if (!fs.existsSync(rawPath)) {
  console.error(`[ERROR] Raw episode file not found: ${rawPath}`);
  process.exit(1);
}

const episode = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

// Guardrail: Validate schema before running any TTS synthesis
const validationResult = validateEpisodeData(episode);
if (!validationResult.valid) {
  console.error(`\n========================================`);
  console.error(`[VALIDATION FAILED] Cannot compile audio. Raw episode has ${validationResult.errors.length} schema error(s):`);
  validationResult.errors.forEach((err, idx) => {
    console.error(`  ${idx + 1}. ${err}`);
  });
  console.error(`========================================\n`);
  process.exit(1);
}

// Initialize Edge TTS
const edgeTts = new EdgeTTS({
  voice: 'hi-IN-MadhurNeural',
  lang: 'hi-IN',
  outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
  rate: '+2%',
});

// Initialize Gemini Client with Gemini 4 Argon & proxy routing support
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const targetModel = process.env.GEMINI_MODEL || 'gemini-4-argon';
const geminiBaseUrl = process.env.GEMINI_BASE_URL || process.env.GOOGLE_GEMINI_BASE_URL;
const thinkingLevel = process.env.GEMINI_THINKING_LEVEL || 'medium';

let aiClient = null;
if (geminiApiKey) {
  const clientOptions = { apiKey: geminiApiKey };
  if (geminiBaseUrl) {
    clientOptions.httpOptions = { baseUrl: geminiBaseUrl };
    console.log(`  -> [Gemini Config] Routing via proxy base URL: ${geminiBaseUrl}`);
  }
  console.log(`  -> [Gemini Config] Model Engine: ${targetModel} | Reasoning: ${thinkingLevel}`);
  aiClient = new GoogleGenAI(clientOptions);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWavHeader(dataLength, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataLength, 40);

  return header;
}

export function sanitizeForHindiTTS(text) {
  if (!text) return '';
  let sanitized = text;

  // Fix Microsoft hi-IN-MadhurNeural slurring half-la (ल्) in रिज़ल्ट / रिजल्ट into "रिज़िट"
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट्स/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]िट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ट/gi, 'नतीजे');

  // Fix slurred English loanwords in Devanagari (Expiry, Walk, Self-fulfilling, Leverage)
  sanitized = sanitized.replace(/एकसपायरी/g, 'एक्सपायरी');
  sanitized = sanitized.replace(/वॉल्क|वाल्क/g, 'वॉक');
  sanitized = sanitized.replace(/सेल्[फ़फ][\s-]*अ[\s-]*फुलफिलिंग/g, 'सेल्फ-फुलफिलिंग');
  sanitized = sanitized.replace(/लेवरेज्ड/g, 'लीवरेज्ड');

  // Smooth out awkward regulatory & English clusters
  sanitized = sanitized.replace(/दवा रेगुलेटर\s*\(?FDA\)?/gi, 'दवा रेगुलेटर');
  sanitized = sanitized.replace(/\bUSFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/\bFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/यू\s*एस\s*एफ\s*डी\s*ए/g, 'एफ डी ए');

  // Currency & Mathematical Symbols
  sanitized = sanitized.replace(/₹(\d+)/g, '$1 रुपये');
  sanitized = sanitized.replace(/(\d+)%/g, '$1 परसेंट');
  sanitized = sanitized.replace(/\+(\d+)/g, 'प्लस $1');
  sanitized = sanitized.replace(/-(\d+)/g, 'माइनस $1');

  // Finance & Regulatory Acronyms
  sanitized = sanitized.replace(/[()]/g, '');
  sanitized = sanitized.replace(/\bIPO\b/gi, 'आई पी ओ');
  sanitized = sanitized.replace(/\bFII\b/gi, 'एफ आई आई');
  sanitized = sanitized.replace(/\bDII\b/gi, 'डी आई आई');
  sanitized = sanitized.replace(/\bOHLC\b/gi, 'ओ एच एल सी');
  sanitized = sanitized.replace(/\bNSE\b/gi, 'एन एस ई');
  sanitized = sanitized.replace(/\bBSE\b/gi, 'बी एस ई');
  sanitized = sanitized.replace(/\bSEBI\b/gi, 'सेबी');
  sanitized = sanitized.replace(/\bPE\b/gi, 'पी ई');
  sanitized = sanitized.replace(/\bRSI\b/gi, 'आर एस आई');
  sanitized = sanitized.replace(/\bMACD\b/gi, 'मैक डी');
  sanitized = sanitized.replace(/\bEMA\b/gi, 'ई एम ए');
  sanitized = sanitized.replace(/\bCMT\b/gi, 'सी एम टी');
  sanitized = sanitized.replace(/\bQ1\b/gi, 'क्यू वन');
  sanitized = sanitized.replace(/\bQ2\b/gi, 'क्यू टू');
  sanitized = sanitized.replace(/\bQ3\b/gi, 'क्यू थ्री');
  sanitized = sanitized.replace(/\bQ4\b/gi, 'क्यू फोर');

  // Tech & Systems Acronyms
  sanitized = sanitized.replace(/\bAPI\b/gi, 'ए पी आई');
  sanitized = sanitized.replace(/\bSQL\b/gi, 'सीक्वल');
  sanitized = sanitized.replace(/\bCPU\b/gi, 'सी पी यू');
  sanitized = sanitized.replace(/\bRAM\b/gi, 'रैम');
  sanitized = sanitized.replace(/\bJSON\b/gi, 'जेसन');
  sanitized = sanitized.replace(/\bP99\b/gi, 'पी नाइनटी नाइन');
  sanitized = sanitized.replace(/\bAWS\b/gi, 'ए डब्ल्यू एस');
  sanitized = sanitized.replace(/\bDNS\b/gi, 'डी एन एस');
  sanitized = sanitized.replace(/\bHTTP\b/gi, 'एच टी टी पी');
  sanitized = sanitized.replace(/\bms\b/gi, 'मिलीसेकंड');

  return sanitized;
}

async function synthesizeEdge(beat, maxRetries = 4) {
  const fileName = `${beat.id}.mp3`;
  const filePath = path.join(audioDir, fileName);
  const spokenText = sanitizeForHindiTTS(beat.hindi_tts);

  const isValidExisting = fs.existsSync(filePath) && fs.statSync(filePath).size > 1000;

  if (!isValidExisting || force) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        console.log(`  -> [Edge-TTS] Synthesizing beat "${beat.id}": "${spokenText.slice(0, 40)}..."`);
        await edgeTts.ttsPromise(spokenText, filePath);

        // Verify valid file was written
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
          break; // Success!
        } else {
          throw new Error('Generated audio file is 0 bytes or corrupt.');
        }
      } catch (err) {
        attempt++;
        if (fs.existsSync(filePath) && fs.statSync(filePath).size < 1000) {
          try { fs.unlinkSync(filePath); } catch {}
        }
        if (attempt >= maxRetries) throw err;
        const waitMs = attempt * 2500;
        console.warn(`  [Edge-TTS Rate Limit 429] Waiting ${waitMs}ms before retry ${attempt}/${maxRetries} for beat "${beat.id}"...`);
        await sleep(waitMs);
      }
    }
    // Polite pacing delay to prevent Edge-TTS socket disconnects
    await sleep(450);
  } else {
    console.log(`  -> [Edge-TTS] Using cached "${fileName}"`);
  }

  // Mirror to isolated chapter directory if configured
  if (localAudioDir && fs.existsSync(filePath)) {
    try {
      fs.copyFileSync(filePath, path.join(localAudioDir, fileName));
    } catch {}
  }

  const meta = await parseFile(filePath);
  const durationSec = meta.format.duration || 2.0;
  const relativeAudioPath = chapterSlug
    ? `audio/${chapterSlug}/${fileName}`
    : `audio/${fileName}`;

  return {
    audioFile: relativeAudioPath,
    durationSec,
  };
}

async function synthesizeGemini(beat) {
  const fileName = `${beat.id}.wav`;
  const filePath = path.join(audioDir, fileName);
  const relativeAudioPath = chapterSlug
    ? `audio/${chapterSlug}/${fileName}`
    : `audio/${fileName}`;

  if (fs.existsSync(filePath) && !force) {
    console.log(`  -> [Gemini-TTS] Using cached "${fileName}"`);
    const stats = fs.statSync(filePath);
    const pcmBytes = Math.max(0, stats.size - 44);
    const durationSec = pcmBytes / (24000 * 2);
    return {
      audioFile: relativeAudioPath,
      durationSec,
    };
  }

  if (!aiClient) {
    throw new Error('GEMINI_API_KEY is not set or invalid.');
  }

  const sanitizedText = sanitizeForHindiTTS(beat.hindi_tts);
  const ttsModel = process.env.GEMINI_TTS_MODEL || targetModel;
  console.log(`  -> [Gemini-TTS] Calling ${ttsModel} for "${beat.id}"...`);
  const prompt =
    'Read ONLY the following Hindi text aloud in a calm, warm, articulate Indian male mentor voice at a measured storytelling pace. Do not add any introductory words:\n\n' +
    sanitizedText;

  const response = await aiClient.models.generateContent({
    model: ttsModel,
    contents: prompt,
    config: {
      temperature: 0.2,
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: 'Charon',
          },
        },
      },
    },
  });

  const candidate = response.candidates?.[0];
  const audioPart = candidate?.content?.parts?.find(
    (p) => p.inlineData && p.inlineData.mimeType?.startsWith('audio/')
  );

  if (!audioPart || !audioPart.inlineData?.data) {
    throw new Error('No audio returned in Gemini response parts.');
  }

  const pcmBuffer = Buffer.from(audioPart.inlineData.data, 'base64');
  const wavHeader = createWavHeader(pcmBuffer.length, 24000, 1, 16);
  const fullWavBuffer = Buffer.concat([wavHeader, pcmBuffer]);

  fs.writeFileSync(filePath, fullWavBuffer);

  // Mirror to isolated chapter directory if configured
  if (localAudioDir) {
    try {
      fs.copyFileSync(filePath, path.join(localAudioDir, fileName));
    } catch {}
  }

  const durationSec = pcmBuffer.length / (24000 * 2);

  // Rate limiting delay
  console.log(`  -> [Gemini-TTS] Waiting 4s rate-limit pause...`);
  await sleep(4000);

  return {
    audioFile: relativeAudioPath,
    durationSec,
  };
}

async function run() {
  const FPS = 30;
  let fallbackToEdge = false;
  let totalDurationFrames = 0;
  let beatCount = 0;

  for (const scene of episode.scenes) {
    console.log(`\n[Scene ${scene.segmentIndex}] "${scene.title}" (${scene.template})`);

    for (const beat of scene.beats) {
      beatCount++;
      let audioResult = null;

      if (selectedMode === 'gemini' && !fallbackToEdge) {
        try {
          audioResult = await synthesizeGemini(beat);
        } catch (err) {
          console.warn(`[WARN] Gemini TTS failed for beat ${beat.id}: ${err.message}`);
          console.warn(`[FALLBACK] Switching to Edge-TTS for beat ${beat.id} and remaining beats.`);
          fallbackToEdge = true;
          audioResult = await synthesizeEdge(beat);
        }
      } else {
        audioResult = await synthesizeEdge(beat);
      }

      beat.audioFile = audioResult.audioFile;
      beat.audioDurationSec = parseFloat(audioResult.durationSec.toFixed(2));

      // Calibrated Pacing: Natural mentor delivery without rushed pauses
      const intendedPauseMs = beat.pauseAfterMs ?? 260;
      const pauseMs =
        intendedPauseMs >= 3000 ? 3200 : intendedPauseMs >= 600 ? 450 : 260;
      const totalMs = beat.audioDurationSec * 1000 + pauseMs;
      beat.durationInFrames = Math.max(15, Math.ceil((totalMs / 1000) * FPS));

      totalDurationFrames += beat.durationInFrames;

      console.log(
        `   Beat ${beat.id}: ${beat.audioDurationSec}s audio + ${pauseMs}ms pause -> ${beat.durationInFrames} frames`
      );
    }
  }

  fs.writeFileSync(compiledPath, JSON.stringify(episode, null, 2), 'utf8');

  const totalSec = (totalDurationFrames / FPS).toFixed(2);
  console.log(`\n========================================`);
  console.log(`[SUCCESS] Compilation Complete!`);
  console.log(`Scenes Processed: ${episode.scenes.length}`);
  console.log(`Beats Processed: ${beatCount}`);
  console.log(`Total Duration: ${totalDurationFrames} frames (${totalSec}s at ${FPS}fps)`);
  console.log(`Saved compiled episode to: ${compiledPath}`);
  console.log(`========================================\n`);
}

run().catch((err) => {
  console.error('[FATAL] Audio compilation failed:', err);
  process.exit(1);
});

