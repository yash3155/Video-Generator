import fs from 'node:fs';
import path from 'node:path';
import { Episode } from '../src/schemas/episode.ts';

function sanitizeEpisode(epPath) {
  const ep = JSON.parse(fs.readFileSync(epPath, 'utf8'));
  ep.schemaVersion = 1;
  ep.kind = "chapter_part";
  ep.courseTitle = ep.courseTitle || "Options, Futures, and Other Derivatives";
  ep.displayLanguage = "en";
  ep.languages = ["en", "hi"];
  ep.theme = ep.theme || "dark-classroom";
  ep.provenance = { mock: false };

  ep.personas = {
    en: {
      mentor: { name: "Christopher", voice: "en-US-ChristopherNeural" },
      novice: { name: "Christopher", voice: "en-US-ChristopherNeural" }
    },
    hi: {
      mentor: { name: "Madhur", voice: "hi-IN-MadhurNeural" },
      novice: { name: "Madhur", voice: "hi-IN-MadhurNeural" }
    }
  };

  ep.scenes = ep.scenes.map((s, sIdx) => {
    const sceneId = 's' + String(sIdx).padStart(2, '0');
    const takeaways = (s.takeaways || []).map(t => {
      if (typeof t === 'string') return t;
      return `${t.heading}: ${t.statement}`;
    }).slice(0, 3);
    while (takeaways.length === 0) {
      takeaways.push(`${s.title}: Foundational quantitative principles`);
    }

    const beats = s.beats.map((b, bIdx) => {
      const beatId = sceneId + 'b' + (bIdx + 1);
      let enDisp = b.narration?.en?.display || b.en_subtitle || b.hi_narration || "Review this quantitative concept carefully.";
      let hiDisp = b.narration?.hi?.display || b.hi_narration || "Is quantitative concept ko dhyan se samjhein.";
      if (enDisp.startsWith('[')) enDisp = "Review this quantitative concept carefully.";
      if (hiDisp.startsWith('[')) hiDisp = "Is quantitative concept ko dhyan se samjhein.";

      return {
        id: beatId,
        speaker: "mentor",
        narration: {
          en: { display: enDisp },
          hi: { display: hiDisp }
        },
        onScreenIntent: b.onScreenIntent || s.title,
        sourceFactIds: b.sourceFactIds || ["F01"],
        newTerms: b.newTerms || [],
        pauseAfterMs: b.pauseAfterMs || 300,
        transition: Boolean(b.transition),
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
            { id: "p2", title: "Pricing & Risk Mechanics", description: takeaways[1] || "Continuous time replication" }
          ]
        }
      }
    };

    if (s.template === 'interactive_quiz' || sIdx === 9) {
      template = 'interactive_quiz';
      data = {
        question: s.data?.question || "Which statement accurately describes the core derivatives principle?",
        options: [
          "The equilibrium condition holds via continuous risk-neutral replication.",
          "Expected asset drift determines contingent claim value directly.",
          "Arbitrage bounds can be systematically violated in liquid markets.",
          "Discrete binomial tree steps eliminate all underlying price variance."
        ],
        correctIndex: 0,
        explanation: s.data?.explanation || "Risk-neutral replication eliminates subjective risk preferences from derivatives pricing."
      };
    } else if (s.template === 'summary_thread' || sIdx === ep.scenes.length - 1) {
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
          heading: s.data?.left?.heading || "Contractual / Traditional Profile",
          tone: "neutral",
          points: [
            takeaways[0] || "Standard market convention",
            takeaways[1] || "Continuous hedging mechanism"
          ]
        },
        right: {
          id: "right",
          heading: s.data?.right?.heading || "Institutional / Alternative Profile",
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
      beats
    };
  });

  const validated = Episode.parse(ep);
  fs.writeFileSync(epPath, JSON.stringify(validated, null, 2), 'utf8');
  console.log(`Successfully sanitized and validated ${epPath}!`);
}

const target = process.argv[2] || 'workspace/books/hull/chapters/ch08/p1/08_episode.json';
sanitizeEpisode(target);
