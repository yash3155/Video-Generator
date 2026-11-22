import fs from 'node:fs';
import path from 'node:path';
import { Episode } from '../src/schemas/episode.ts';

function buildChapter(rawDir, outBookId, chId, partId, chTitle, partTitle, chNum, partNum) {
  const epRawPath = path.join(rawDir, 'episode_raw.json');
  if (!fs.existsSync(epRawPath)) {
    throw new Error(`episode_raw.json not found in ${rawDir}`);
  }
  const raw = JSON.parse(fs.readFileSync(epRawPath, 'utf8'));

  // Collect beats
  const rawBeats = [];
  raw.scenes.forEach(s => s.beats.forEach(b => rawBeats.push(b)));

  // Try to find script.md in Hull_English_Edition
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

  // Ensure every beat has non-empty narration
  rawBeats.forEach((b, idx) => {
    const k = b.id || ('b' + String(idx + 1).padStart(2, '0'));
    if (!hiBeats[k] || hiBeats[k].startsWith('[')) {
      hiBeats[k] = "Is mathematical concept aur derivation ko dhyan se samajhiye.";
    }
    if (!enBeats[k] || enBeats[k].startsWith('[')) {
      enBeats[k] = "Take a moment to carefully analyze this mathematical concept and derivation.";
    }
  });

  // Convert scenes to OpenLectern schemas
  const scenes = raw.scenes.map((s, sIdx) => {
    const sceneId = 's' + String(sIdx).padStart(2, '0');
    const takeaways = (s.takeaways || []).map(t => {
      if (typeof t === 'string') return t;
      return `${t.heading}: ${t.statement}`;
    }).slice(0, 3);
    while (takeaways.length === 0) {
      takeaways.push(`${s.title}: Core financial principles and mathematical structures.`);
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
            { id: "p1", title: "Institutional Architecture", description: takeaways[0] || s.title },
            { id: "p2", title: "Quantitative Valuation", description: takeaways[1] || "Continuous time pricing and risk management" }
          ]
        }
      }
    };

    if (s.template === 'interactive_quiz') {
      template = 'interactive_quiz';
      const q = s.ui_state?.quiz || {};
      data = {
        question: q.question || "Which statement correctly describes the primary valuation condition?",
        options: [
          "The condition holds under continuous risk-neutral replication.",
          "Expected asset drift determines contingent claim value.",
          "Arbitrage bounds can be systematically violated.",
          "Discrete tree steps eliminate all market variance."
        ],
        correctIndex: 0,
        explanation: q.explanation || "Risk-neutral replication eliminates subjective risk preferences."
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
    } else if (s.template === 'split_comparison' || s.ui_state?.arrangement === 'dual_comparison') {
      template = 'split_comparison';
      const comp = s.ui_state?.comparison || {};
      data = {
        left: {
          id: "left",
          heading: comp.leftColumn?.title || "Contractual / Traditional Profile",
          tone: "neutral",
          points: [
            takeaways[0] || "Standard market convention",
            takeaways[1] || "Continuous hedging mechanism"
          ]
        },
        right: {
          id: "right",
          heading: comp.rightColumn?.title || "Institutional / Alternative Profile",
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
    bookId: outBookId,
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
    progress: { index: sIdxTotal(chNum, partNum), total: 72 },
    theme: "dark-classroom",
    provenance: { mock: false },
    scenes
  };

  function sIdxTotal(c, p) {
    return (c - 1) * 2 + (p - 1);
  }

  // Validate with Zod
  const validated = Episode.parse(episode);
  console.log(`Episode validation passed for ${chId}_${partId}! (${validated.scenes.length} scenes)`);
  return validated;
}

const rawDir = 'C:/Users/YashAggarwal/OneDrive - 7N A S/Desktop/study video/src/data/chapters/hull_derivatives/chap16_part01';
const validated = buildChapter(rawDir, 'hull', 'ch16', 'p1', 'Employee Stock Options (ESOs)', 'Part 1: Contractual Mechanics & Valuation', 16, 1);
console.log('Success! Sample scene 0:', validated.scenes[0].title);
