// scripts/build_murphy_en_chapters.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildVisualCreativeBrief } from './generate_visual_creative_briefs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const HINDI_MURPHY_DIR = path.join(rootDir, 'src/data/chapters/murphy_technical_analysis');
const EN_MURPHY_DIR = path.join(rootDir, 'src/data/chapters/murphy_technical_analysis_en');

fs.mkdirSync(EN_MURPHY_DIR, { recursive: true });

export function adaptMurphyToEnglish(chapterSlug) {
  const srcDir = path.join(HINDI_MURPHY_DIR, chapterSlug);
  const destDir = path.join(EN_MURPHY_DIR, chapterSlug);

  if (!fs.existsSync(srcDir)) {
    console.error(`Source chapter not found: ${srcDir}`);
    return false;
  }

  fs.mkdirSync(destDir, { recursive: true });

  // 1. source_facts.json
  const factsPath = path.join(srcDir, 'source_facts.json');
  if (fs.existsSync(factsPath)) {
    const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
    facts.course = 'murphy_technical_analysis_en';
    fs.writeFileSync(path.join(destDir, 'source_facts.json'), JSON.stringify(facts, null, 2), 'utf8');
  }

  // 2. content_audit.json
  const auditPath = path.join(srcDir, 'content_audit.json');
  if (fs.existsSync(auditPath)) {
    const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    audit.course = 'murphy_technical_analysis_en';
    fs.writeFileSync(path.join(destDir, 'content_audit.json'), JSON.stringify(audit, null, 2), 'utf8');
  }

  // 3. lesson_plan.json
  const lessonPath = path.join(srcDir, 'lesson_plan.json');
  if (fs.existsSync(lessonPath)) {
    const lp = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
    lp.targetAudiencePersona = 'Global Technical Analysts & Active Traders';
    fs.writeFileSync(path.join(destDir, 'lesson_plan.json'), JSON.stringify(lp, null, 2), 'utf8');
  }

  // 4. storyboard.json
  const sbPath = path.join(srcDir, 'storyboard.json');
  if (fs.existsSync(sbPath)) {
    const sb = JSON.parse(fs.readFileSync(sbPath, 'utf8'));
    sb.course = 'murphy_technical_analysis_en';
    fs.writeFileSync(path.join(destDir, 'storyboard.json'), JSON.stringify(sb, null, 2), 'utf8');
  }

  // 5. visual_creative_brief.json
  buildVisualCreativeBrief(destDir, 'murphy_technical_analysis_en', chapterSlug, true);

  // 6. episode_raw.json
  const rawPath = path.join(srcDir, 'episode_raw.json');
  if (fs.existsSync(rawPath)) {
    const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    const enRaw = JSON.parse(JSON.stringify(raw));

    enRaw.meta = {
      course: 'murphy_technical_analysis_en',
      chapter: raw.meta?.chapter || chapterSlug.toUpperCase(),
      chapterTitle: raw.meta?.chapterTitle || chapterSlug,
      domain: 'finance',
      primaryColor: '#B45309',
      accentColor: '#2563EB',
      narrationLanguage: 'en-US',
    };

    // Adapt each scene and beat
    for (const scene of enRaw.scenes || []) {
      for (const beat of scene.beats || []) {
        // In English, the spoken narration is en_narration or en_subtitle or text
        const englishSentence = beat.en_narration || beat.en_subtitle || beat.text || 'Technical analysis reveals price action.';
        beat.hindi_tts = englishSentence; // Edge-TTS uses this field for TTS synthesis
        beat.en_narration = englishSentence;
        beat.en_subtitle = beat.en_subtitle || englishSentence;

        // Replace Raju and Sharma ji personas in messages
        if (beat.ui_state?.messages) {
          for (const msg of beat.ui_state.messages) {
            if (msg.sender === 'Raju') {
              msg.sender = 'Alex';
              msg.avatar = 'A';
            } else if (msg.sender === 'Sharma ji') {
              msg.sender = 'Marcus';
              msg.avatar = 'M';
            }
          }
        }

        if (beat.visual?.data?.messages) {
          for (const msg of beat.visual.data.messages) {
            if (msg.sender === 'Raju') {
              msg.sender = 'Alex';
              msg.avatar = 'A';
            } else if (msg.sender === 'Sharma ji') {
              msg.sender = 'Marcus';
              msg.avatar = 'M';
            }
          }
        }
      }
    }

    fs.writeFileSync(path.join(destDir, 'episode_raw.json'), JSON.stringify(enRaw, null, 2), 'utf8');
  }

  console.log(`[MURPHY EN ADAPTED] ${chapterSlug}`);
  return true;
}

// If run from command line
const targetChapters = process.argv.slice(2);
if (targetChapters.length > 0) {
  for (const ch of targetChapters) {
    adaptMurphyToEnglish(ch);
  }
} else {
  // Adapt all existing Murphy chapters
  const allChapters = fs.readdirSync(HINDI_MURPHY_DIR).filter(d => {
    return fs.statSync(path.join(HINDI_MURPHY_DIR, d)).isDirectory() && d !== 'test_run' && !d.includes('backup');
  });

  for (const ch of allChapters) {
    adaptMurphyToEnglish(ch);
  }
}

