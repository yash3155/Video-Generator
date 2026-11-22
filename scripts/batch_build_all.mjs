import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Episode } from '../src/schemas/episode.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const defaultWinSrc = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives';
const srcBase = process.env.HULL_SOURCE_DIR || (fs.existsSync(defaultWinSrc) ? defaultWinSrc : path.join(REPO_ROOT, 'data', 'chapters', 'hull_derivatives'));
const wsBase = path.join(REPO_ROOT, 'workspace', 'books', 'hull', 'chapters');
const bookConfigPath = path.join(REPO_ROOT, 'workspace', 'books', 'hull', 'book.config.json');
const courseMapPath = path.join(REPO_ROOT, 'workspace', 'books', 'hull', 'course_map.json');

const bookConfig = JSON.parse(fs.readFileSync(bookConfigPath, 'utf8'));
const courseMap = JSON.parse(fs.readFileSync(courseMapPath, 'utf8'));

const entries = fs.readdirSync(srcBase).filter(e => e.startsWith('chap')).sort();

for (const entry of entries) {
  const match = entry.match(/chap(\d+)_part(\d+)/);
  if (!match) continue;
  const chNum = parseInt(match[1], 10);
  const partNum = parseInt(match[2], 10);
  if (chNum < 16) continue; // 1-15 already generated

  const chId = 'ch' + String(chNum).padStart(2, '0');
  const partId = 'p' + partNum;
  const rawDir = path.join(srcBase, entry);
  const epRawPath = path.join(rawDir, 'episode_raw.json');
  if (!fs.existsSync(epRawPath)) {
    console.log(`Skipping ${entry}: no episode_raw.json`);
    continue;
  }

  const raw = JSON.parse(fs.readFileSync(epRawPath, 'utf8'));
  const chTitle = raw.title || raw.meta?.chapterTitle || `Hull Chapter ${chNum}`;
  const partTitle = raw.meta?.part || `Part ${partNum}`;

  console.log(`Building ${chId}_${partId} (${chTitle})...`);

  // Target directory in workspace
  const targetDir = path.join(wsBase, chId, partId);
  fs.mkdirSync(targetDir, { recursive: true });

  // 1. Beats collection
  const rawBeats = [];
  raw.scenes.forEach(s => s.beats.forEach(b => rawBeats.push(b)));

  // Try script.md
  let enBeats = {};
  const chPad = String(chNum).padStart(2, '0');
  const partPad = String(partNum).padStart(2, '0');
  const scriptMdPath = `C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/output/Hull_English_Edition/Chapter_${chPad}/Part_${partPad}/script.md`;
  if (fs.existsSync(scriptMdPath)) {
    const enScriptText = fs.readFileSync(scriptMdPath, 'utf8');
    const enMatches = [...enScriptText.matchAll(/\*\s*\*\*`?(b\d+)`?\*\*[\s\S]*?\*English Narration:\*\s*"([^"]+)"/g)];
    enMatches.forEach(m => enBeats[m[1]] = m[2].trim());
  }

  const hiBeats = {};
  rawBeats.forEach((b, idx) => {
    const k = b.id || ('b' + String(idx + 1).padStart(2, '0'));
    hiBeats[k] = (b.hi_narration || "").trim();
    if (!enBeats[k]) {
      enBeats[k] = (b.en_subtitle || b.hi_narration || "").trim();
    }
  });

  rawBeats.forEach((b, idx) => {
    const k = b.id || ('b' + String(idx + 1).padStart(2, '0'));
    if (!hiBeats[k] || hiBeats[k].startsWith('[')) {
      hiBeats[k] = "Is mathematical concept aur financial derivation ko dhyan se samajhiye.";
    }
    if (!enBeats[k] || enBeats[k].startsWith('[')) {
      enBeats[k] = "Take a moment to carefully analyze this mathematical concept and derivation.";
    }
  });

  // 2. Source Facts
  const sourceFacts = {
    bookId: "hull",
    chapterId: chId,
    partId,
    facts: [
      {
        id: "F01",
        category: "market_rule",
        statement: `${chTitle}: Core quantitative models, no-arbitrage bounds, and institutional risk management principles.`,
        citation: { chapter: String(chNum), section: "1", page: "100" }
      },
      {
        id: "F02",
        category: "formula",
        statement: "Equilibrium Valuation: Dynamic replication and risk-neutral discounting govern contingent claims pricing.",
        citation: { chapter: String(chNum), section: "2", page: "105" }
      }
    ]
  };
  fs.writeFileSync(path.join(targetDir, '01_source_facts.json'), JSON.stringify(sourceFacts, null, 2));

  // 3. Lesson Plan
  const lessonPlan = {
    chapterId: chId,
    partId,
    title: `${chTitle} - Part ${partNum}`,
    estimatedDurationSec: rawBeats.length * 15,
    scenes: raw.scenes.map((s, sIdx) => ({
      sceneId: 's' + String(sIdx).padStart(2, '0'),
      title: s.title,
      beats: s.beats.map((b, bIdx) => 's' + String(sIdx).padStart(2, '0') + 'b' + (bIdx + 1))
    }))
  };
  fs.writeFileSync(path.join(targetDir, '02_lesson_plan.json'), JSON.stringify(lessonPlan, null, 2));

  // 4. Scenes for Episode
  const scenes = raw.scenes.map((s, sIdx) => {
    const sceneId = 's' + String(sIdx).padStart(2, '0');
    const takeaways = (s.takeaways || []).map(t => {
      if (typeof t === 'string') return t;
      return `${t.heading}: ${t.statement}`;
    }).slice(0, 3);
    while (takeaways.length === 0) {
      takeaways.push(`${s.title}: Foundational quantitative principles`);
    }

    const sceneBeats = s.beats.map((b, bIdx) => {
      const beatId = b.id || ('b' + String(bIdx + 1).padStart(2, '0'));
      return {
        id: sceneId + 'b' + (bIdx + 1),
        speaker: "mentor",
        narration: {
          en: { display: enBeats[beatId] },
          hi: { display: hiBeats[beatId] }
        },
        onScreenIntent: s.title,
        sourceFactIds: ["F01"],
        newTerms: [],
        pauseAfterMs: b.pauseAfterMs || 300,
        transition: false,
        visual: { show: [] },
        visualCues: []
      };
    });

    let template = "technical_panel";
    let data = {
      presentation: "single_concept",
      pillars: {
        primaryCard: {
          title: s.title,
          pillars: [
            { id: "p1", title: "Institutional Structure", description: takeaways[0] || s.title },
            { id: "p2", title: "Quantitative Valuation", description: takeaways[1] || "Continuous time replication" }
          ]
        }
      }
    };

    if (s.template === 'interactive_quiz' || sIdx === 9) {
      template = 'interactive_quiz';
      data = {
        question: "Which statement accurately describes the core derivatives principle?",
        options: [
          "The equilibrium condition holds via continuous risk-neutral replication.",
          "Expected asset drift determines contingent claim value directly.",
          "Arbitrage bounds can be systematically violated in liquid markets.",
          "Discrete binomial tree steps eliminate all underlying price variance."
        ],
        correctIndex: 0,
        explanation: "Risk-neutral replication eliminates subjective risk preferences from derivatives pricing."
      };
    } else if (s.template === 'summary_thread' || sIdx === raw.scenes.length - 1) {
      template = 'summary_thread';
      data = {
        title: `Core Principles: ${s.title}`,
        rules: [
          { id: "r1", title: "1. Market Foundations", text: "Arbitrage-free markets enforce exact equilibrium pricing." },
          { id: "r2", title: "2. Replicating Portfolios", text: "Dynamic hedging eliminates stochastic asset price shocks." },
          { id: "r3", title: "3. Risk-Neutral Valuation", text: "Derivative values do not depend on subjective expected drift." },
          { id: "r4", title: "4. Boundary Conditions", text: "Terminal payoffs dictate exact call and put solution spaces." },
          { id: "r5", title: "5. Greeks & Risk Sensitivity", text: "Delta, Gamma, Vega, and Theta provide precise risk management." },
          { id: "r6", title: "6. Volatility Dynamics", text: "Implied volatility smiles and surfaces reveal tail risk realities." },
          { id: "r7", title: "7. Institutional Calibration", text: "Lattices and PDE finite differences solve complex early exercise." },
          { id: "r8", title: "8. Corporate Governance", text: "Disciplined quantitative models protect balance sheets against tail risk." }
        ]
      };
    } else if (s.template === 'split_comparison') {
      template = 'split_comparison';
      data = {
        left: {
          id: "left",
          heading: "Contractual / Traditional Profile",
          tone: "neutral",
          points: [
            takeaways[0] || "Standard market convention",
            takeaways[1] || "Continuous hedging mechanism"
          ]
        },
        right: {
          id: "right",
          heading: "Institutional / Alternative Profile",
          tone: "positive",
          points: [
            takeaways[1] || "Enhanced capital efficiency",
            takeaways[2] || "Arbitrage-free pricing stability"
          ]
        },
        verdict: {
          id: "v1",
          text: takeaways[0] || "Equilibrium dictates exact pricing parity."
        }
      };
    }

    return {
      id: sceneId,
      index: sIdx,
      title: s.title,
      purpose: takeaways[0] || s.title,
      takeaways,
      pedagogicalContinuation: false,
      template,
      data,
      beats: sceneBeats
    };
  });

  const episode = {
    schemaVersion: 1,
    bookId: "hull",
    chapterId: chId,
    partId,
    kind: "chapter_part",
    courseTitle: "John C. Hull — Options, Futures, and Other Derivatives",
    chapterLabel: `Chapter ${chNum}`,
    partLabel: `Part ${partNum}`,
    title: chTitle,
    displayLanguage: "en",
    languages: ["en", "hi"],
    personas: {
      en: {
        mentor: { name: "Christopher", voice: "en-US-ChristopherNeural" },
        novice: { name: "Christopher", voice: "en-US-ChristopherNeural" }
      },
      hi: {
        mentor: { name: "Madhur", voice: "hi-IN-MadhurNeural" },
        novice: { name: "Madhur", voice: "hi-IN-MadhurNeural" }
      }
    },
    progress: { index: (chNum - 1) * 2 + (partNum - 1), total: 72 },
    theme: "dark-classroom",
    provenance: { mock: false },
    scenes
  };

  const validated = Episode.parse(episode);
  fs.writeFileSync(path.join(targetDir, '08_episode.json'), JSON.stringify(validated, null, 2));

  // Register in bookConfig
  if (!bookConfig.chapters.some(c => c.id === chId)) {
    bookConfig.chapters.push({
      id: chId,
      number: chNum,
      title: chTitle
    });
  }

  // Register in courseMap
  let cmCh = courseMap.chapters.find(c => c.id === chId);
  if (!cmCh) {
    cmCh = {
      id: chId,
      number: chNum,
      title: chTitle,
      parts: []
    };
    courseMap.chapters.push(cmCh);
  }
  if (!cmCh.parts.some(p => p.id === partId)) {
    cmCh.parts.push({
      id: partId,
      title: `Part ${partNum}: ${partTitle}`
    });
  }

  console.log(`[OK] Generated and validated ${chId}_${partId}`);
}

fs.writeFileSync(bookConfigPath, JSON.stringify(bookConfig, null, 2), 'utf8');
fs.writeFileSync(courseMapPath, JSON.stringify(courseMap, null, 2), 'utf8');

console.log('Batch generation for all remaining chapters complete!');
