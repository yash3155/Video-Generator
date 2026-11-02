// scripts/compile_tts_audio.mjs
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { EdgeTTS } from 'node-edge-tts';
import { parseFile } from 'music-metadata';
import { GoogleGenAI } from '@google/genai';
import { resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

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
  const foundDir = resolveChapterDirectory(chapterSlug, rootDir);
  chapterDir = foundDir || path.resolve(rootDir, 'src', 'data', 'chapters', chapterSlug);
}

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

let episode = null;
let edgeTts = null;
let aiClient = null;
const targetModel = process.env.GEMINI_MODEL || 'gemini-4-argon';

function getEdgeTts() {
  if (!edgeTts) {
    edgeTts = new EdgeTTS({
      voice: 'hi-IN-MadhurNeural',
      lang: 'hi-IN',
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
      rate: '+2%',
    });
  }
  return edgeTts;
}

function initAiClient() {
  if (aiClient) return aiClient;
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const geminiBaseUrl = process.env.GEMINI_BASE_URL || process.env.GOOGLE_GEMINI_BASE_URL;
  const thinkingLevel = process.env.GEMINI_THINKING_LEVEL || 'medium';

  if (geminiApiKey) {
    const clientOptions = { apiKey: geminiApiKey };
    if (geminiBaseUrl) {
      clientOptions.httpOptions = { baseUrl: geminiBaseUrl };
      console.log(`  -> [Gemini Config] Routing via proxy base URL: ${geminiBaseUrl}`);
    }
    console.log(`  -> [Gemini Config] Model Engine: ${targetModel} | Reasoning: ${thinkingLevel}`);
    aiClient = new GoogleGenAI(clientOptions);
  }
  return aiClient;
}

function ensurePreValidation() {
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

  episode = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

  // Guardrail: Validate schema before running any TTS synthesis
  try {
    const targetValidateDir = dirArg
      ? dirArg.split('=')[1]
      : chapterArg
        ? `src/data/chapters/${chapterSlug}`
        : 'src/data';
    const relValidateDir = path.isAbsolute(targetValidateDir)
      ? path.relative(rootDir, targetValidateDir).replace(/\\/g, '/')
      : targetValidateDir.replace(/\\/g, '/');
    execSync(`node "${path.join(__dirname, 'validate_episode.mjs')}" --dir="${relValidateDir}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
  } catch {
    console.error(`\n========================================`);
    console.error(`[VALIDATION FAILED] Cannot compile audio. Pre-validation checks failed.`);
    console.error(`========================================\n`);
    process.exit(1);
  }
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
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
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

  // 1. Strip commas inside numbers FIRST (e.g. ₹2,160 -> ₹2160)
  sanitized = sanitized.replace(/(\d),(\d)/g, '$1$2');
  sanitized = sanitized.replace(/(\d),(\d)/g, '$1$2');

  // 2. Convert numeric ranges BEFORE negative sign rule (e.g. 15-20% -> 15 से 20 परसेंट)
  sanitized = sanitized.replace(/(\d+)\s*[-–—]\s*(\d+)\s*%/g, '$1 से $2 परसेंट');
  sanitized = sanitized.replace(/(\d+)\s*[-–—]\s*(\d+)/g, '$1 से $2');

  // 3. Fix Microsoft hi-IN-MadhurNeural slurring half-la (ल्) in रिज़ल्ट / रिजल्ट into "रिज़िट"
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट्स/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ल्ट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]िट/gi, 'नतीजे');
  sanitized = sanitized.replace(/रि[ज़जज़]ट/gi, 'नतीजे');

  // 4. Fix slurred English loanwords & technical terms in Devanagari
  sanitized = sanitized.replace(/एकसपायरी/g, 'एक्सपायरी');
  sanitized = sanitized.replace(/वॉल्क|वाल्क/g, 'वॉक');
  sanitized = sanitized.replace(/सेल्[फ़फ][\s-]*अ[\s-]*फुलफिलिंग/g, 'सेल्फ-फुलफिलिंग');
  sanitized = sanitized.replace(/लेवरेज्ड/g, 'लीवरेज्ड');
  sanitized = sanitized.replace(/व्हिपसॉ/g, 'विप-सॉ');
  sanitized = sanitized.replace(/ब्लोफ/g, 'ब्लो-ऑफ');
  sanitized = sanitized.replace(/ओआई/g, 'ओपन इंटरेस्ट');
  sanitized = sanitized.replace(/ईएमए/g, 'ई एम ए');
  sanitized = sanitized.replace(/एसएमए/g, 'एस एम ए');

  // 5. Smooth out awkward regulatory & English clusters
  sanitized = sanitized.replace(/दवा रेगुलेटर\s*\(?FDA\)?/gi, 'दवा रेगुलेटर');
  sanitized = sanitized.replace(/\bUSFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/\bFDA\b/gi, 'एफ डी ए');
  sanitized = sanitized.replace(/यू\s*एस\s*एफ\s*डी\s*ए/g, 'एफ डी ए');

  // 6. Stochastic & Williams % symbols BEFORE generic % rule
  sanitized = sanitized.replace(/%K/gi, 'परसेंट के');
  sanitized = sanitized.replace(/%D/gi, 'परसेंट डी');
  sanitized = sanitized.replace(/%R/gi, 'परसेंट आर');

  // 7. Currency & Mathematical Symbols
  sanitized = sanitized.replace(/₹\s*(\d+(?:\.\d+)?)/g, '$1 रुपये');
  sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, '$1 परसेंट');
  sanitized = sanitized.replace(/(^|\s)\+(\d+(?:\.\d+)?)/g, '$1प्लस $2');
  sanitized = sanitized.replace(/(^|\s)-(\d+(?:\.\d+)?)/g, '$1माइनस $2');

  // 8. Finance & Technical Analysis Acronyms
  sanitized = sanitized.replace(/[()]/g, '');
  sanitized = sanitized.replace(/जहूठ/g, 'झूठ');
  sanitized = sanitized.replace(/\bTRIN\b/gi, 'ट्रिन');
  sanitized = sanitized.replace(/\bAD Line\b/gi, 'ए डी लाइन');
  sanitized = sanitized.replace(/\bA-D\b/gi, 'ए डी');
  sanitized = sanitized.replace(/\bMTM\b/gi, 'एम टी एम');
  sanitized = sanitized.replace(/\bOTC\b/gi, 'ओ टी सी');
  sanitized = sanitized.replace(/\bCCP\b/gi, 'सी सी पी');
  sanitized = sanitized.replace(/\bCCPs\b/gi, 'सी सी पी');
  sanitized = sanitized.replace(/\bCDS\b/gi, 'सी डी एस');
  sanitized = sanitized.replace(/\bCDO\b/gi, 'सी डी ओ');
  sanitized = sanitized.replace(/\bVaR\b/g, 'वी ए आर');
  sanitized = sanitized.replace(/\bLIBOR\b/gi, 'लाइबोर');
  sanitized = sanitized.replace(/\bSOFR\b/gi, 'सोफर');
  sanitized = sanitized.replace(/\bOIS\b/gi, 'ओ आई एस');
  sanitized = sanitized.replace(/\bFRA\b/gi, 'एफ आर ए');
  sanitized = sanitized.replace(/\bFRAs\b/gi, 'एफ आर ए');
  sanitized = sanitized.replace(/\bBSM\b/gi, 'बी एस एम');
  sanitized = sanitized.replace(/\bCBOE\b/gi, 'सी बी ओ ई');
  sanitized = sanitized.replace(/\bOCC\b/gi, 'ओ सी सी');
  sanitized = sanitized.replace(/\bISDA\b/gi, 'इस्डा');
  sanitized = sanitized.replace(/\bCSA\b/gi, 'सी एस ए');
  sanitized = sanitized.replace(/\bETF\b/gi, 'ई टी एफ');
  sanitized = sanitized.replace(/\bETFs\b/gi, 'ई टी एफ');
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
  sanitized = sanitized.replace(/\bEMAs\b/gi, 'ई एम ए');
  sanitized = sanitized.replace(/\bSMA\b/gi, 'एस एम ए');
  sanitized = sanitized.replace(/\bSMAs\b/gi, 'एस एम ए');
  sanitized = sanitized.replace(/\bOI\b/gi, 'ओपन इंटरेस्ट');
  sanitized = sanitized.replace(/\bOBV\b/gi, 'ओ बी वी');
  sanitized = sanitized.replace(/\bVPT\b/gi, 'वी पी टी');
  sanitized = sanitized.replace(/\bCOT\b/gi, 'सी ओ टी');
  sanitized = sanitized.replace(/\bPCR\b/gi, 'पी सी आर');
  sanitized = sanitized.replace(/\bROC\b/gi, 'आर ओ सी');
  sanitized = sanitized.replace(/\bCCI\b/gi, 'सी सी आई');
  sanitized = sanitized.replace(/\bKAMA\b/gi, 'कामा');
  sanitized = sanitized.replace(/\bATR\b/gi, 'ए टी आर');
  sanitized = sanitized.replace(/\bADX\b/gi, 'ए डी एक्स');
  sanitized = sanitized.replace(/\bSAR\b/gi, 'एस ए आर');
  sanitized = sanitized.replace(/\bCMT\b/gi, 'सी एम टी');
  sanitized = sanitized.replace(/\bQ1\b/gi, 'क्यू वन');
  sanitized = sanitized.replace(/\bQ2\b/gi, 'क्यू टू');
  sanitized = sanitized.replace(/\bQ3\b/gi, 'क्यू थ्री');
  sanitized = sanitized.replace(/\bQ4\b/gi, 'क्यू फोर');

  // 9. Tech & Systems Acronyms
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

/**
 * Computes deterministic SHA-256 hash of normalized narration text.
 */
export function hashNarration(text) {
  const normalized = (text || '').trim().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex').slice(0, 16);
}

/**
 * Segments an English subtitle into natural semantic phrases with proportional timing.
 * Falls back safely to a single sentence-level phrase if text cannot be cleanly split.
 */
export function segmentSubtitleIntoPhrases(subtitle, audioDurationSec) {
  if (!subtitle || typeof subtitle !== 'string') return [];
  const cleanText = subtitle.trim();
  if (!cleanText) return [];
  const totalMs = Math.max(500, Math.round(audioDurationSec * 1000));

  let rawChunks = [];
  if (/[,;—–]/.test(cleanText)) {
    rawChunks = cleanText.split(/(?<=[,;—–])\s+/).map((s) => s.trim()).filter(Boolean);
  }
  if (rawChunks.length <= 1) {
    const words = cleanText.split(/\s+/);
    if (words.length <= 5) {
      return [{ text: cleanText, startMs: 0, endMs: totalMs }];
    }
    const numPhrases = words.length >= 12 ? 3 : 2;
    const wordsPerPhrase = Math.ceil(words.length / numPhrases);
    rawChunks = [];
    for (let i = 0; i < words.length; i += wordsPerPhrase) {
      rawChunks.push(words.slice(i, i + wordsPerPhrase).join(' '));
    }
  }

  const totalChars = rawChunks.reduce((acc, c) => acc + c.length, 0);
  let currentStart = 0;
  return rawChunks.map((chunk, idx) => {
    const proportion = totalChars > 0 ? chunk.length / totalChars : 1 / rawChunks.length;
    const phraseDuration = Math.round(proportion * totalMs);
    const startMs = currentStart;
    const endMs = idx === rawChunks.length - 1 ? totalMs : Math.min(totalMs, currentStart + phraseDuration);
    currentStart = endMs;
    return { text: chunk, startMs, endMs };
  });
}

async function synthesizeEdge(beat, maxRetries = 4, targetHash = null, isHashMatch = false) {
  const fileName = `${beat.id}.mp3`;
  const filePath = path.join(audioDir, fileName);
  const spokenText = sanitizeForHindiTTS(beat.hindi_tts);

  const isValidExisting = fs.existsSync(filePath) && fs.statSync(filePath).size > 1000;
  const canUseCache = isValidExisting && isHashMatch && !force;

  if (!canUseCache) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        if (!isHashMatch && isValidExisting) {
          console.log(`  -> [Edge-TTS] Narration changed for beat "${beat.id}". Regenerating audio: "${spokenText.slice(0, 40)}..."`);
        } else {
          console.log(`  -> [Edge-TTS] Synthesizing beat "${beat.id}": "${spokenText.slice(0, 40)}..."`);
        }
        await getEdgeTts().ttsPromise(spokenText, filePath);

        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
          break;
        } else {
          throw new Error('Generated audio file is 0 bytes or corrupt.');
        }
      } catch (err) {
        attempt++;
        if (fs.existsSync(filePath) && fs.statSync(filePath).size < 1000) {
          try { fs.unlinkSync(filePath); } catch { }
        }
        if (attempt >= maxRetries) throw err;
        const waitMs = attempt * 2500;
        console.warn(`  [Edge-TTS Rate Limit 429] Waiting ${waitMs}ms before retry ${attempt}/${maxRetries} for beat "${beat.id}"...`);
        await sleep(waitMs);
      }
    }
    await sleep(450);
  } else {
    console.log(`  -> [Edge-TTS] Using authoritative cached "${fileName}" (hash: ${targetHash})`);
  }

  if (localAudioDir && fs.existsSync(filePath)) {
    try {
      fs.copyFileSync(filePath, path.join(localAudioDir, fileName));
    } catch { }
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

async function synthesizeGemini(beat, targetHash = null, isHashMatch = false) {
  const fileName = `${beat.id}.wav`;
  const filePath = path.join(audioDir, fileName);
  const relativeAudioPath = chapterSlug
    ? `audio/${chapterSlug}/${fileName}`
    : `audio/${fileName}`;

  const isValidExisting = fs.existsSync(filePath) && fs.statSync(filePath).size > 1000;
  const canUseCache = isValidExisting && isHashMatch && !force;

  if (canUseCache) {
    console.log(`  -> [Gemini-TTS] Using authoritative cached "${fileName}" (hash: ${targetHash})`);
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

  if (localAudioDir) {
    try {
      fs.copyFileSync(filePath, path.join(localAudioDir, fileName));
    } catch { }
  }

  const durationSec = pcmBuffer.length / (24000 * 2);
  console.log(`  -> [Gemini-TTS] Waiting 4s rate-limit pause...`);
  await sleep(4000);

  return {
    audioFile: relativeAudioPath,
    durationSec,
  };
}

async function run() {
  ensurePreValidation();

  const FPS = 30;
  let fallbackToEdge = false;
  let totalDurationFrames = 0;
  let beatCount = 0;

  // Load existing compiled episode if present to check previous narration hashes
  const compiledMap = new Map();
  if (fs.existsSync(compiledPath)) {
    try {
      const prevCompiled = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));
      (prevCompiled.scenes || []).forEach((sc) => {
        (sc.beats || []).forEach((b) => {
          if (b.id) {
            compiledMap.set(b.id, b);
          }
        });
      });
    } catch { }
  }

  for (const scene of episode.scenes) {
    console.log(`\n[Scene ${scene.segmentIndex}] "${scene.title}" (${scene.template})`);

    for (const beat of scene.beats) {
      beatCount++;
      let audioResult = null;

      const currentHash = hashNarration(beat.hindi_tts);
      const prevBeat = compiledMap.get(beat.id);
      const isHashMatch = Boolean(prevBeat && prevBeat.narrationHash === currentHash);

      if (selectedMode === 'gemini' && !fallbackToEdge) {
        try {
          audioResult = await synthesizeGemini(beat, currentHash, isHashMatch);
        } catch (err) {
          console.warn(`[WARN] Gemini TTS failed for beat ${beat.id}: ${err.message}`);
          console.warn(`[FALLBACK] Switching to Edge-TTS for beat ${beat.id} and remaining beats.`);
          fallbackToEdge = true;
          audioResult = await synthesizeEdge(beat, 4, currentHash, isHashMatch);
        }
      } else {
        audioResult = await synthesizeEdge(beat, 4, currentHash, isHashMatch);
      }

      beat.narrationHash = currentHash;
      beat.audioFile = audioResult.audioFile;
      beat.audioDurationSec = parseFloat(audioResult.durationSec.toFixed(2));

      // Authoritative exact authored pause preservation
      const pauseMs = beat.pauseAfterMs ?? 260;
      const totalMs = beat.audioDurationSec * 1000 + pauseMs;
      beat.durationInFrames = Math.max(15, Math.ceil((totalMs / 1000) * FPS));

      // Phase 2B: Generate phrase-level subtitle alignment data
      beat.subtitlePhrases = segmentSubtitleIntoPhrases(
        beat.en_subtitle,
        beat.audioDurationSec
      );

      // Validate cues against measured audio duration
      if (Array.isArray(beat.visualCues) && beat.visualCues.length > 0) {
        const audioEndMs = beat.audioDurationSec * 1000;
        beat.visualCues.forEach((cue) => {
          if (cue.atMs > audioEndMs + pauseMs) {
            console.warn(
              `  [WARN] Visual cue target "${cue.target}" at ${cue.atMs}ms exceeds beat duration (${Math.round(totalMs)}ms).`
            );
          }
        });
      }

      totalDurationFrames += beat.durationInFrames;

      console.log(
        `   Beat ${beat.id} [hash:${currentHash}]: ${beat.audioDurationSec}s audio + ${pauseMs}ms pause -> ${beat.durationInFrames} frames (${beat.subtitlePhrases.length} subtitle phrases)`
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

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  run().catch((err) => {
    console.error('[FATAL] Audio compilation failed:', err);
    process.exit(1);
  });
}