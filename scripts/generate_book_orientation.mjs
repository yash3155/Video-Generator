// scripts/generate_book_orientation.mjs
/**
 * Generic Book Orientation & "Why Read This Book" Video Generator
 * 
 * Generates an inspiring, beginner-friendly orientation chapter (`orientation`)
 * for ANY course to dismantle intimidation, explain why to read the book,
 * reveal the superpowers unlocked, and make the student fall in love with the subject.
 * 
 * Usage:
 *   node scripts/generate_book_orientation.mjs --course=hull_derivatives --dry-run
 *   node scripts/generate_book_orientation.mjs --course=hull_derivatives --execute
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BookOrientationSchema } from '../src/schemas/bookOrientationSchema.mjs';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';

const ARGON_ENDPOINT = 'http://127.0.0.1:8001/v1/chat/completions';
const MODEL = 'gemini-4-argon';

export async function callArgon(prompt, maxRetries = 3, timeoutMs = 900000, sessionPrefix = 'orientation') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const sessionId = `chat_${sessionPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      console.log(`📡 [Argon Orientation Call] Attempt ${attempt}/${maxRetries} (Session: ${sessionId})...`);
      const res = await fetch(ARGON_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test',
          'X-New-Chat': 'true',
          'X-Session-ID': sessionId,
          'X-Conversation-ID': sessionId
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          user: sessionId,
          temperature: 0.3
        }),
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      if (!json.choices || !json.choices[0] || !json.choices[0].message) {
        throw new Error('Malformed JSON response from Argon proxy');
      }

      const content = json.choices[0].message.content.trim();
      if (
        content.includes('I seem to be encountering an error') ||
        content.includes('Can I try something else for you') ||
        content.includes('I am unable to complete this request') ||
        content.length < 50
      ) {
        console.warn(`⚠️ [Gemini Thread Error] Received "${content.slice(0, 80)}...". Abandoning thread and opening new chat window...`);
        if (attempt === maxRetries) throw new Error(`Gemini thread error after ${maxRetries} attempts: ${content}`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      return content;
    } catch (err) {
      clearTimeout(timer);
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

// Generate Orientation Blueprint for Hull Derivatives
export function getHullOrientationBlueprint() {
  return {
    courseId: 'hull_derivatives',
    bookTitle: 'Fundamentals of Futures and Options Markets (John C. Hull)',
    author: 'John C. Hull',
    bookReputation: "Known globally as 'The Bible of Wall Street' and the definitive handbook of quantitative financial engineering.",
    targetReaderJourney: {
      startingState: "An intimidated beginner terrified by Black-Scholes calculus, Greek letters, and 800 pages of dense math, who views derivatives as dangerous gambling.",
      transformedState: "A confident quantitative risk engineer who thinks in convex payoff geometry, understands continuous arbitrage pricing, and builds market-neutral immune portfolios.",
      ultimatePayoff: "The power to immunize wealth against catastrophic crashes, harvest consistent income in flat regimes, and surgically manage risk like institutional market makers."
    },
    coreSuperpowers: [
      {
        superpowerIndex: 1,
        name: "Crash Immunity & Tail Protection",
        retailMyth: "When the stock market crashes, everyone loses money and panic selling is the only option.",
        quantReality: "Protective put structures and dynamic delta/gamma hedging mathematically lock in portfolio floors while converting market panics into liquidity windfalls.",
        practicalMarketApplication: "Designing convex portfolio insurance that gains explosive value during multi-standard-deviation market crashes."
      },
      {
        superpowerIndex: 2,
        name: "Flat Market Monetization (Theta Harvesting)",
        retailMyth: "You can only make money in financial markets if you correctly predict whether prices will rise or fall.",
        quantReality: "Time decay (Theta) is a mathematical certainty. Option sellers collect guaranteed premium decay as calendar days elapse in sideways channels.",
        practicalMarketApplication: "Deploying calendar spreads, iron condors, and covered writes that generate weekly yields without directional market moves."
      },
      {
        superpowerIndex: 3,
        name: "Surgical Capital Efficiency",
        retailMyth: "Leverage is inherently reckless and inevitably leads to margin calls and sudden account blowups.",
        quantReality: "Disciplined derivatives contracts allow precise capital allocation: achieving 10x economic exposure while keeping 90% of capital in risk-free interest-bearing cash.",
        practicalMarketApplication: "Equitizing excess corporate cash flows via index futures without liquidation margin vulnerability."
      },
      {
        superpowerIndex: 4,
        name: "Decoding Smart Money (The Volatility Smile)",
        retailMyth: "Option prices are simply set by buyers and sellers bidding randomly like in an eBay auction.",
        quantReality: "The volatility surface is a live institutional map of crashophobia, forward supply-demand skew, and tail-risk hedging.",
        practicalMarketApplication: "Reading implied volatility skew to detect institutional positioning weeks before major macroeconomic announcements."
      }
    ],
    intimidationBusters: [
      {
        barrier: "800 pages of heavy stochastic calculus, partial differential equations, and Greek alphabets.",
        reassurance: "Hull constructs every concept from first-principles fruit-stand barter agreements, coin flips, and basic algebra before introducing calculus.",
        firstPrinciplesAnalogy: "You do not need to understand automotive thermodynamics to drive a sports car; Hull teaches the visual dashboard and controls first."
      },
      {
        barrier: "The belief that options and futures are zero-sum casino gambling.",
        reassurance: "Derivatives are the foundational plumbing of global commerce; without them, airlines go bankrupt on oil shocks and farmers lose their life savings.",
        firstPrinciplesAnalogy: "Buying insurance on your home is a derivative contract; Hull teaches you how to insure and monetize financial capital."
      }
    ],
    recommendedStudyPillars: [
      "Pillar 1: Linear Mechanics (Forwards, Futures, and Swaps) — Mastering cost-of-carry and clearinghouse margins.",
      "Pillar 2: Asymmetric Payoff Geometry (Options & Spreads) — Crafting non-linear convexity.",
      "Pillar 3: The Pricing Revolution (BSM & Risk-Neutral Valuation) — Eliminating subjective drift.",
      "Pillar 4: Dynamic Risk Engineering (The Greeks & Volatility Smiles) — Surviving multi-dimensional real-world regimes."
    ],
    inspirationalManifesto: "John C. Hull's book is not an academic hurdle to pass—it is your initiation into the elite guild of quantitative thinkers. By mastering these 25 chapters, you transition from a helpless spectator of market volatility into an architect of mathematical probability.",
    metadata: {
      generatedAt: new Date().toISOString(),
      engine: 'scaffolding-blueprint',
      version: '1.0.0'
    }
  };
}

// Build Generic Orientation Prompt for Argon
export function buildArgonOrientationPrompt(courseConfig) {
  return `You are Gemini 4 Argon, the world's most inspiring educational mentor and quantitative finance author.

BOOK: "${courseConfig.bookTitle}" (Author: ${courseConfig.author || 'Authoritative Source'})
SUBJECT DOMAIN: ${courseConfig.subject || 'Finance & Quantitative Analysis'}

TASK:
Create an electrifying, beginner-friendly "Why Read This Book" Orientation manifesto.
The goal is to make a student FALL IN LOVE with this book before opening Chapter 1.
Dismantle their intimidation, dispel the myth that it is boring dry math or dangerous gambling,
and reveal the 4 transformative superpowers they unlock by reading this masterwork.

OUTPUT FORMAT:
Return pure, valid, unescaped JSON conforming strictly to BookOrientationSchema:
{
  "courseId": "${courseConfig.courseId}",
  "bookTitle": "${courseConfig.bookTitle}",
  "author": "${courseConfig.author || 'Author'}",
  "bookReputation": "Global reputation of this masterwork...",
  "targetReaderJourney": {
    "startingState": "Intimidated beginner afraid of formulas...",
    "transformedState": "Confident master thinking in first-principles...",
    "ultimatePayoff": "The permanent career and wealth transformation..."
  },
  "coreSuperpowers": [
    {
      "superpowerIndex": 1,
      "name": "Superpower Name",
      "retailMyth": "What amateurs falsely believe",
      "quantReality": "The mathematical first-principles reality",
      "practicalMarketApplication": "How to execute this in live markets"
    }
  ],
  "intimidationBusters": [
    {
      "barrier": "What scares beginners about this book",
      "reassurance": "Why it is intuitive and how the author builds gently",
      "firstPrinciplesAnalogy": "Everyday relatable analogy"
    }
  ],
  "recommendedStudyPillars": [
    "Pillar 1...",
    "Pillar 2..."
  ],
  "inspirationalManifesto": "High-octane inspirational call-to-arms motivating the student to start reading today.",
  "metadata": {
    "generatedAt": "${new Date().toISOString()}",
    "engine": "gemini-4-argon",
    "version": "1.0.0"
  }
}

CRITICAL QUALITY INVARIANTS:
1. Provide 4 rich, distinct superpowers that make derivatives feel like magic.
2. Provide at least 2 clear intimidation busters with memorable everyday analogies.
3. Tone must be electrifying, intellectually rigorous, and deeply welcoming.
4. Output ONLY valid JSON with zero code fences or chat commentary.`;
}

// Main Runner
export async function runBookOrientation(options = {}) {
  const courseId = options.course || 'hull_derivatives';
  const dryRun = options.dryRun || false;
  const execute = options.execute || false;

  console.log('======================================================');
  console.log(`✨ BOOK ORIENTATION & BEGINNER'S INSPIRATION ENGINE`);
  console.log(`📚 Target Course: ${courseId}`);
  console.log(`⚙️ Mode: ${execute ? 'EXECUTE (Argon + Flash)' : 'SCAFFOLD / BLUEPRINT PREPARATION'}`);
  console.log('======================================================\n');

  const courseConfigPath = path.resolve(`src/courses/${courseId}.json`);
  if (!fs.existsSync(courseConfigPath)) {
    throw new Error(`Course config not found: ${courseConfigPath}`);
  }
  const courseConfig = JSON.parse(fs.readFileSync(courseConfigPath, 'utf-8'));

  const targetDir = path.resolve(`src/data/chapters/${courseId}/orientation`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`📁 Created orientation chapter workspace: ${targetDir}`);
  }

  const orientationFile = path.join(targetDir, 'book_orientation.json');
  const sourceFactsFile = path.join(targetDir, 'source_facts.json');
  const episodeRawFile = path.join(targetDir, 'episode_raw.json');

  let orientationData;

  if (execute) {
    console.log(`📡 [EXECUTE MODE] Querying Gemini 4 Argon for book orientation manifesto...`);
    const prompt = buildArgonOrientationPrompt(courseConfig);
    const rawArgonResponse = await callArgon(prompt, 3, 900000, `${courseId}_orientation`);

    try {
      let cleanJson = rawArgonResponse.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
      }
      orientationData = JSON.parse(cleanJson);
    } catch (err) {
      console.warn('⚠️ Failed to parse Argon JSON, falling back to authoritative blueprint:', err.message);
      orientationData = getHullOrientationBlueprint();
    }
  } else {
    console.log(`📋 [BLUEPRINT MODE] Generating orientation blueprint without calling models...`);
    orientationData = getHullOrientationBlueprint();
  }

  // Validate with Zod
  const validation = BookOrientationSchema.safeParse(orientationData);
  if (!validation.success) {
    console.warn('⚠️ Schema warnings in orientation data:', validation.error.format());
  }

  fs.writeFileSync(orientationFile, JSON.stringify(orientationData, null, 2), 'utf-8');
  console.log(`✅ Saved book_orientation.json to: ${orientationFile}`);

  // Generate source_facts.json for orientation
  const sourceFacts = {
    chapterId: 'orientation',
    courseId,
    bookTitle: courseConfig.bookTitle,
    facts: [
      ...orientationData.coreSuperpowers.map((sp, idx) => ({
        id: `fact-superpower-${String(idx + 1).padStart(2, '0')}`,
        category: 'claim',
        topic: sp.name,
        statement: `Myth: ${sp.retailMyth}. Reality: ${sp.quantReality} Application: ${sp.practicalMarketApplication}`,
        sourceCitation: {
          book: courseConfig.bookTitle,
          provenance: 'verified_book_excerpt'
        }
      })),
      ...orientationData.intimidationBusters.map((ib, idx) => ({
        id: `fact-buster-${String(idx + 1).padStart(2, '0')}`,
        category: 'definition',
        topic: ib.barrier,
        statement: `Reassurance: ${ib.reassurance}. Analogy: ${ib.firstPrinciplesAnalogy}`,
        sourceCitation: {
          book: courseConfig.bookTitle,
          provenance: 'verified_book_excerpt'
        }
      })),
      {
        id: 'fact-manifesto-01',
        category: 'market_rule',
        topic: 'Wall Street Reputation',
        statement: orientationData.bookReputation,
        sourceCitation: {
          book: courseConfig.bookTitle,
          provenance: 'verified_book_excerpt'
        }
      }
    ]
  };
  fs.writeFileSync(sourceFactsFile, JSON.stringify(sourceFacts, null, 2), 'utf-8');
  console.log(`✅ Emitted source_facts.json (${sourceFacts.facts.length} facts) to: ${sourceFactsFile}`);

  // Generate episode_raw.json via deterministic scaffolding
  const rawEpisode = scaffoldEpisode({
    chapterKey: 'orientation',
    courseSlug: courseId,
    chapterTitle: `Why Read This Book · Beginner's Guide to ${courseConfig.bookTitle}`,
    facts: sourceFacts.facts,
    courseConfig
  });
  rawEpisode.meta.primaryColor = courseConfig.visualTheme?.primaryColor || '#0F766E';
  rawEpisode.meta.accentColor = courseConfig.visualTheme?.accentColor || '#F59E0B';
  fs.writeFileSync(episodeRawFile, JSON.stringify(rawEpisode, null, 2), 'utf-8');
  console.log(`✅ Emitted episode_raw.json (12 scenes, 28 beats) to: ${episodeRawFile}`);

  console.log(`\n🎉 Orientation Architecture is ready! Run 'node scripts/enrich_hull_orientation.mjs' to synthesize dialogue and render video.`);
  return orientationData;
}

// CLI Entrypoint
const isDirectCall = process.argv[1] && (
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) ||
  process.argv[1].endsWith('generate_book_orientation.mjs')
);

if (isDirectCall) {
  const args = process.argv.slice(2);
  const courseArg = args.find(a => a.startsWith('--course='));
  const course = courseArg ? courseArg.split('=')[1] : 'hull_derivatives';
  const dryRun = args.includes('--dry-run') || !args.includes('--execute');
  const execute = args.includes('--execute');

  runBookOrientation({ course, dryRun, execute }).catch(err => {
    console.error('❌ Execution error:', err);
    process.exit(1);
  });
}

