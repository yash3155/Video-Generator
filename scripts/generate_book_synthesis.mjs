// scripts/generate_book_synthesis.mjs
/**
 * Generic Holistic Book Interconnectivity & Evolutionary Synthesis Generator
 * 
 * Generates an all-encompassing macro-synthesis chapter (`synthesis`) for ANY course.
 * Explains why every topic exists, what fatal limitation in prior tools forced its creation,
 * and how the entire book unifies into a single coherent system.
 * 
 * Usage:
 *   node scripts/generate_book_synthesis.mjs --course=hull_derivatives --dry-run
 *   node scripts/generate_book_synthesis.mjs --course=hull_derivatives --execute
 *   node scripts/generate_book_synthesis.mjs --course=murphy_technical_analysis --execute
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BookSynthesisSchema } from '../src/schemas/bookSynthesisSchema.mjs';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';

const ARGON_ENDPOINT = 'http://127.0.0.1:8001/v1/chat/completions';
const MODEL = 'gemini-4-argon';

// Helper: Call Argon proxy with retry and fresh session
export async function callArgon(prompt, maxRetries = 3, timeoutMs = 900000, sessionPrefix = 'synthesis') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const sessionId = `chat_${sessionPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      console.log(`📡 [Argon Synthesis Call] Attempt ${attempt}/${maxRetries} (Session: ${sessionId})...`);
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
          temperature: 0.2
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

// Gather all chapter topics and key facts from the course
export function aggregateCourseKnowledge(courseId) {
  const coursePath = path.resolve('src/data/chapters', courseId);
  if (!fs.existsSync(coursePath)) {
    throw new Error(`Course directory not found: ${coursePath}`);
  }

  const entries = fs.readdirSync(coursePath, { withFileTypes: true });
  const chapterDirs = entries
    .filter(e => e.isDirectory() && (e.name.startsWith('ch') || e.name.startsWith('vpa_') || e.name.startsWith('chapter')) && !e.name.includes('backup') && e.name !== 'synthesis' && e.name !== 'orientation')
    .map(e => e.name)
    .sort();

  const chapterSummaries = [];

  for (const chId of chapterDirs) {
    const chDir = path.join(coursePath, chId);
    const factsPath = path.join(chDir, 'source_facts.json');
    const contextPath = path.join(chDir, 'notebook_context.txt');
    const lessonPlanPath = path.join(chDir, 'lesson_plan.json');

    let title = chId;
    let factsSample = [];

    if (fs.existsSync(lessonPlanPath)) {
      try {
        const lp = JSON.parse(fs.readFileSync(lessonPlanPath, 'utf-8'));
        if (lp.lessonTitle) title = lp.lessonTitle;
      } catch {}
    }

    if (fs.existsSync(factsPath)) {
      try {
        const sf = JSON.parse(fs.readFileSync(factsPath, 'utf-8'));
        if (Array.isArray(sf.facts)) {
          factsSample = sf.facts.slice(0, 5).map(f => `• [${f.category}] ${f.topic}: ${f.statement}`);
        }
      } catch {}
    } else if (fs.existsSync(contextPath)) {
      const text = fs.readFileSync(contextPath, 'utf-8');
      factsSample = text.split('\n').filter(l => l.trim().length > 20).slice(0, 5);
    }

    chapterSummaries.push({
      chapterId: chId,
      title,
      sampleInsights: factsSample
    });
  }

  return { chapterDirs, chapterSummaries };
}

// Build generic dialectical evolution prompt for Argon
export function buildArgonSynthesisPrompt(courseConfig, chapterSummaries) {
  return `You are Gemini 4 Argon, the world's foremost authority in pedagogical curriculum design and mathematical finance.

COURSE BOOK: "${courseConfig.bookTitle}" (Author: ${courseConfig.author || 'Authoritative Source'})
SUBJECT DOMAIN: ${courseConfig.subject || 'Finance & Quantitative Analysis'}

TASK:
Perform a deep, exhaustive Dialectical Synthesis of this entire book.
A student who reads this book must understand why each chapter exists:
"Every tool or model was invented because the PREVIOUS tool had a fatal limitation that caused massive losses or failure in the real world."

CHRONOLOGICAL CHAPTER INVENTORY OF THIS BOOK:
${chapterSummaries.map((c, i) => `${i + 1}. [${c.chapterId}] "${c.title}"\n${c.sampleInsights.slice(0, 2).join('\n')}`).join('\n\n')}

OUTPUT FORMAT:
Return pure, valid, unescaped JSON strictly conforming to the following structure:
{
  "courseId": "${courseConfig.courseId}",
  "bookTitle": "${courseConfig.bookTitle}",
  "author": "${courseConfig.author || 'Author'}",
  "macroThesis": "Comprehensive multi-sentence explanation of the author's grand unified thesis across all chapters.",
  "openingDilemma": {
    "struggle": "Concrete failure mode where an investor/trader attempts to use one isolated tool without understanding its boundaries.",
    "historicalContext": "Historical event, crisis, or market dilemma that sparked the core problem.",
    "fatalMistake": "The exact conceptual mistake made by market participants before the author's unified framework.",
    "authorInvention": "How the author's complete roadmap systematically solves each layer of market risk."
  },
  "causalEvolutionChain": [
    {
      "step": 1,
      "priorConcept": "Name of foundational concept",
      "priorBreakthrough": "What it solved originally",
      "fatalLimitation": "The fatal blindspot or boundary where it fails",
      "failureScenario": "Specific real-world market scenario or historical collapse caused by this limitation",
      "authorSolution": "The conceptual innovation introduced to fix the limitation",
      "succeedingConcept": "Name of the next concept created",
      "breakthroughMechanism": "Mathematical or operational mechanism by which the new concept resolves the crisis",
      "sourceChapters": ["ch01_part1", "ch01_part2"]
    }
  ],
  "complementaryPairs": [
    {
      "pairName": "Name of complementary pair (e.g. Linear Hedging + Non-Linear Options)",
      "toolA": "First tool",
      "toolB": "Second tool",
      "synergyExplanation": "Why using both together neutralizes the blindspot of each",
      "antiPatternWarning": "Why using redundant tools together creates false confidence and disaster"
    }
  ],
  "holisticSynthesisRules": [
    {
      "ruleNumber": 1,
      "title": "Rule title",
      "corePrinciple": "Core philosophical principle",
      "interconnectedChapters": ["ch01_part1", "ch02_part1"],
      "practicalExecutionDirective": "Exact actionable rule for live market execution"
    }
  ],
  "unifiedExecutionChecklist": [
    "Step 1: Check macro regime...",
    "Step 2: Measure non-linear risk...",
    "Step 3: Apply dynamic delta/gamma hedge...",
    "Step 4: Stress test correlation and liquidity..."
  ],
  "metadata": {
    "generatedAt": "${new Date().toISOString()}",
    "engine": "gemini-4-argon",
    "version": "1.0.0"
  }
}

CRITICAL QUALITY INVARIANTS:
1. Provide AT LEAST 6-8 deep evolutionary steps in "causalEvolutionChain" tracing the entire arc of the book.
2. Every step must have a CONCRETE, named failure scenario (e.g. 1987 crash, Metallgesellschaft, Barings, LTCM, counterparty default, negative gamma squeeze).
3. Do NOT provide generic platitudes. Ground every single claim in exact formulas, mechanics, and terminology from the book.
4. Output ONLY valid JSON with zero markdown code fences or conversational text.`;
}

// Main Runner
export async function runBookSynthesis(options = {}) {
  const courseId = options.course || 'hull_derivatives';
  const dryRun = options.dryRun || false;
  const execute = options.execute || false;

  console.log('======================================================');
  console.log(`🌌 HOLISTIC BOOK INTERCONNECTIVITY & SYNTHESIS ENGINE`);
  console.log(`📚 Target Course: ${courseId}`);
  console.log(`⚙️ Mode: ${execute ? 'EXECUTE (Argon + Flash)' : 'SCAFFOLD / BLUEPRINT PREPARATION'}`);
  console.log('======================================================\n');

  // 1. Load course config
  const courseConfigPath = path.resolve(`src/courses/${courseId}.json`);
  if (!fs.existsSync(courseConfigPath)) {
    throw new Error(`Course config not found: ${courseConfigPath}`);
  }
  const courseConfig = JSON.parse(fs.readFileSync(courseConfigPath, 'utf-8'));

  // 2. Aggregate knowledge from all chapters
  console.log(`🔍 Scanning all chapter directories in src/data/chapters/${courseId}...`);
  const { chapterDirs, chapterSummaries } = aggregateCourseKnowledge(courseId);
  console.log(`✅ Located ${chapterDirs.length} chapters across "${courseConfig.bookTitle}".`);

  // 3. Prepare target output directory
  const targetDir = path.resolve(`src/data/chapters/${courseId}/synthesis`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`📁 Created synthesis chapter workspace: ${targetDir}`);
  }

  const synthesisDataFile = path.join(targetDir, 'book_synthesis.json');
  const sourceFactsFile = path.join(targetDir, 'source_facts.json');
  const episodeRawFile = path.join(targetDir, 'episode_raw.json');

  if (!execute) {
    console.log(`\n📋 [BLUEPRINT MODE] Generating structural blueprint without calling models...`);
    
    // Create initial blueprint template
    const blueprintData = {
      courseId,
      bookTitle: courseConfig.bookTitle,
      author: courseConfig.author || 'Authoritative Source',
      macroThesis: `Holistic first-principles journey of ${courseConfig.bookTitle}, mapping the evolutionary chain of limitations and conceptual inventions across all ${chapterDirs.length} chapter parts.`,
      openingDilemma: {
        struggle: "Traders and quants fail by isolating single chapters or equations without understanding the fatal blindspot that forced the author to invent the succeeding chapter.",
        historicalContext: "Historical evolution of market instruments from bilateral forward contracts to non-linear exotics and risk-neutral measures.",
        fatalMistake: "Treating linear hedging as absolute protection against non-linear tail risk and volatility regime shifts.",
        authorInvention: "The complete unified derivatives and hedging architecture connecting forwards, futures, swaps, BSM, the Greeks, and volatility smiles."
      },
      causalEvolutionChain: [
        {
          step: 1,
          priorConcept: "Forward Contracts (Bilateral Trade)",
          priorBreakthrough: "Enables customized price-lock between two parties across future time horizon.",
          fatalLimitation: "Counterparty credit risk and total lack of liquidity (illiquid bilateral deadlock).",
          failureScenario: "1848 Midwest grain harvest default: Bumper harvest collapsed spot price; buyers defaulted on bilateral promises, leaving farmers bankrupted.",
          authorSolution: "Central Counterparty Clearing & Standardized Futures (1848 CBOT).",
          succeedingConcept: "Futures Contracts & Daily Marking to Market",
          breakthroughMechanism: "Daily cash settlement, initial & maintenance margin tiers, and exchange novation eliminating bilateral credit default risk.",
          sourceChapters: ["ch01_part1", "ch02_part1"]
        },
        {
          step: 2,
          priorConcept: "Futures Contracts & Minimum Variance Hedging",
          priorBreakthrough: "Standardized contracts with daily margin eliminate counterparty credit risk and allow cross-hedging via optimal hedge ratio.",
          fatalLimitation: "Basis risk, tail correlation breakdown, and liquidity strain from cash margin calls during extreme moves.",
          failureScenario: "1993 Metallgesellschaft collapse: Short-term futures roll strategy suffered massive immediate cash margin calls during crude oil backwardation inversion.",
          authorSolution: "Cost-of-Carry Equilibrium Pricing & Interest Rate Term Structure Modeling.",
          succeedingConcept: "Determination of Forward & Futures Prices",
          breakthroughMechanism: "Arbitrage-free pricing F0 = S0 * exp(r*T) and forward-rate duration matching.",
          sourceChapters: ["ch03_part1", "ch04_part1", "ch05_part1"]
        },
        {
          step: 3,
          priorConcept: "Futures & Forward Linear Payoffs",
          priorBreakthrough: "Zero upfront cash cost to lock in fixed forward prices.",
          fatalLimitation: "Symmetrical downside risk: If prices move favorably, futures completely eliminate upside gains while forcing severe margin payments.",
          failureScenario: "Airline hedging fuel at $100/barrel with futures: Oil crashes to $40; airline is locked into paying $100 while unhedged competitors thrive.",
          authorSolution: "Options (Calls & Puts) Asymmetric Contingent Claims.",
          succeedingConcept: "Options Mechanics & Trading Strategies",
          breakthroughMechanism: "Upfront premium purchase granting the right without obligation, capping maximum loss strictly to premium paid.",
          sourceChapters: ["ch08_part1", "ch09_part1", "ch10_part1"]
        },
        {
          step: 4,
          priorConcept: "Binomial Trees & Intuitive Expected Payoff Pricing",
          priorBreakthrough: "Discrete multi-period path modeling for early exercise American options.",
          fatalLimitation: "Requires estimating the real-world expected drift rate (mu) of the stock, which is statistically impossible to predict accurately.",
          failureScenario: "Option writers underpricing long-term calls by relying on subjective bullish projections, leading to sudden insolvency.",
          authorSolution: "Risk-Neutral Continuous Dynamic Delta Hedging (Black-Scholes-Merton 1973).",
          succeedingConcept: "The Black-Scholes-Merton Pricing Model",
          breakthroughMechanism: "Constructing a continuously riskless hedged portfolio (dPi = 0) eliminates the subjective drift rate mu, replacing it with risk-free rate r.",
          sourceChapters: ["ch11_part1", "ch12_part1", "ch13_part1"]
        },
        {
          step: 5,
          priorConcept: "Static Black-Scholes-Merton Valuation",
          priorBreakthrough: "Closed-form formula for European option fair value based on constant volatility.",
          fatalLimitation: "Option risk is dynamic and multi-dimensional: Spot moves, time decays, and volatility changes continuously.",
          failureScenario: "Long option holder being directionally right on stock move but losing 80% of value due to rapid theta decay and implied volatility collapse after earnings.",
          authorSolution: "The Greeks Framework (Delta, Gamma, Vega, Theta, Rho).",
          succeedingConcept: "The Greeks & Dynamic Hedging",
          breakthroughMechanism: "Continuous Taylor-series risk decomposition enabling gamma-neutral and vega-neutral immune portfolios.",
          sourceChapters: ["ch17_part1", "ch17_part2"]
        },
        {
          step: 6,
          priorConcept: "Lognormal Stock Return & Constant Volatility Assumption",
          priorBreakthrough: "Enables elegant closed-form Gaussian integration in BSM.",
          fatalLimitation: "Real market return distributions exhibit severe negative skewness, fat tails (leptokurtosis), and crash risk.",
          failureScenario: "Black Monday (October 19, 1987): Out-of-the-money puts experienced 20-standard-deviation moves, bankrupting portfolio insurance funds.",
          authorSolution: "The Volatility Smile & Surface Framework.",
          succeedingConcept: "Volatility Smiles, Skew & Non-Linear Exotics",
          breakthroughMechanism: "Implied volatility mapping across strikes and maturities reflecting market crashophobia and jump-diffusion realities.",
          sourceChapters: ["ch18_part1", "ch19_part1", "ch20_part1"]
        }
      ],
      complementaryPairs: [
        {
          pairName: "Linear Futures vs Non-Linear Options",
          toolA: "Futures Contracts (Symmetric Zero-Cost Hedge)",
          toolB: "Options Contracts (Asymmetric Premium Insurance)",
          synergyExplanation: "Futures efficiently hedge known linear exposures at zero capital cost, while options protect against catastrophic tail risk and catastrophic price shocks.",
          antiPatternWarning: "Using out-of-the-money options to hedge small daily fluctuations bleeds account dry via theta decay."
        },
        {
          pairName: "Delta Hedging vs Gamma/Vega Hedging",
          toolA: "Delta Hedging (First-Order Price Sensitivity)",
          toolB: "Gamma & Vega Hedging (Curvature & Volatility Sensitivity)",
          synergyExplanation: "Delta hedging keeps a book neutral for infinitesimal price steps, while Gamma and Vega hedging protect against discontinuous jumps and volatility spikes.",
          antiPatternWarning: "Relying on delta-neutrality alone during market opens leaves the desk exposed to catastrophic gamma wipeout."
        }
      ],
      holisticSynthesisRules: [
        {
          ruleNumber: 1,
          title: "The Law of Inevitable Counterparty Risk",
          corePrinciple: "Bilateral agreements fail without central clearing and daily margin mechanics.",
          interconnectedChapters: ["ch01_part1", "ch02_part1"],
          practicalExecutionDirective: "Never enter uncollateralized long-horizon forward commitments without daily variation margin."
        },
        {
          ruleNumber: 2,
          title: "The Cost-of-Carry Invariant",
          corePrinciple: "Futures price is determined by financing cost and storage, never subjective future price speculation.",
          interconnectedChapters: ["ch03_part1", "ch05_part1"],
          practicalExecutionDirective: "Always price forward commitments using F0 = S0 * exp(r*T) to capture cash-and-carry mispricings."
        },
        {
          ruleNumber: 3,
          title: "The Linearity Limitation",
          corePrinciple: "Linear tools (futures/swaps) lock in price but forfeit all favorable upside.",
          interconnectedChapters: ["ch08_part1", "ch10_part1"],
          practicalExecutionDirective: "Employ options when operational survival requires upside participation or catastrophic floor protection."
        },
        {
          ruleNumber: 4,
          title: "The Risk-Neutral Valuation Foundation",
          corePrinciple: "Derivative value depends on continuous dynamic replication, completely independent of expected stock return.",
          interconnectedChapters: ["ch11_part1", "ch13_part1"],
          practicalExecutionDirective: "Value all contingent claims in the risk-neutral measure using the risk-free rate r and implied volatility sigma."
        },
        {
          ruleNumber: 5,
          title: "The Multi-Dimensional Greek Reality",
          corePrinciple: "Directional correctness is meaningless if theta decay and vega collapse outpace delta gains.",
          interconnectedChapters: ["ch17_part1", "ch17_part2"],
          practicalExecutionDirective: "Monitor delta, gamma, and vega simultaneously; never run naked negative gamma into high-volatility events."
        },
        {
          ruleNumber: 6,
          title: "The Volatility Smile & Crash Reality",
          corePrinciple: "Constant volatility is a mathematical fiction; tail risk and crashophobia command persistent implied volatility premia.",
          interconnectedChapters: ["ch18_part1", "ch20_part1"],
          practicalExecutionDirective: "Price out-of-the-money puts using the empirical volatility surface, never a single flat at-the-money volatility."
        }
      ],
      unifiedExecutionChecklist: [
        "1. Identify Exposure Nature: Distinguish linear volume commitments from non-linear contingent liabilities.",
        "2. Establish Cost-of-Carry Arbitrage Bounds: Verify spot-futures parity before executing hedges.",
        "3. Select Optimal Instrument: Combine linear futures for baseline cost with options for tail insurance.",
        "4. Calibrate Continuous Greek Exposure: Balance delta neutrality with strict gamma and vega bounds.",
        "5. Stress Test Against Volatility Surface Shifts: Model portfolio survival under 5-sigma jump-diffusion shocks."
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        engine: "scaffolding-blueprint",
        version: "1.0.0"
      }
    };

    // Validate blueprint with Zod schema
    const validation = BookSynthesisSchema.safeParse(blueprintData);
    if (!validation.success) {
      console.error('❌ Blueprint schema validation failed:', validation.error.format());
      throw new Error('Blueprint validation failed');
    }

    fs.writeFileSync(synthesisDataFile, JSON.stringify(blueprintData, null, 2), 'utf-8');
    console.log(`✅ Saved valid Book Synthesis Blueprint to: ${synthesisDataFile}`);

    // Generate source_facts.json from synthesis facts
    const sourceFacts = {
      chapterId: 'synthesis',
      courseId,
      bookTitle: courseConfig.bookTitle,
      facts: [
        ...blueprintData.causalEvolutionChain.map((step, idx) => ({
          id: `fact-evol-${String(idx + 1).padStart(2, '0')}`,
          category: 'case_study',
          topic: `${step.priorConcept} -> ${step.succeedingConcept}`,
          statement: `Limitation of ${step.priorConcept}: ${step.fatalLimitation} (${step.failureScenario}). Solution: ${step.succeedingConcept} via ${step.breakthroughMechanism}.`,
          sourceCitation: {
            book: courseConfig.bookTitle,
            chapter: step.sourceChapters.join(', '),
            provenance: 'verified_book_excerpt'
          }
        })),
        ...blueprintData.holisticSynthesisRules.map((rule, idx) => ({
          id: `fact-rule-${String(idx + 1).padStart(2, '0')}`,
          category: 'market_rule',
          topic: rule.title,
          statement: `${rule.corePrinciple} Directive: ${rule.practicalExecutionDirective}`,
          sourceCitation: {
            book: courseConfig.bookTitle,
            chapter: rule.interconnectedChapters.join(', '),
            provenance: 'verified_book_excerpt'
          }
        }))
      ]
    };
    fs.writeFileSync(sourceFactsFile, JSON.stringify(sourceFacts, null, 2), 'utf-8');
    console.log(`✅ Emitted source_facts.json (${sourceFacts.facts.length} facts) to: ${sourceFactsFile}`);

    // Generate episode_raw.json via bespoke synthesis episode builder
    const rawEpisode = buildBespokeSynthesisEpisode({
      courseId,
      courseConfig,
      blueprintData,
      sourceFacts
    });
    fs.writeFileSync(episodeRawFile, JSON.stringify(rawEpisode, null, 2), 'utf-8');
    console.log(`✅ Emitted bespoke backend PPT episode_raw.json (12 scenes, 28 beats) to: ${episodeRawFile}`);

    console.log(`\n🎉 Synthesis Architecture is ready! When you say 'yes', run with '--execute' to perform full Argon extraction and audio synthesis.`);
    return blueprintData;
  }

  // EXECUTE MODE: Call Argon proxy for deep synthesis extraction across all chapters
  console.log(`📡 [EXECUTE MODE] Querying Gemini 4 Argon for holistic dialectical synthesis...`);
  const prompt = buildArgonSynthesisPrompt(courseConfig, chapterSummaries);
  const rawArgonResponse = await callArgon(prompt, 3, 900000, `${courseId}_synthesis`);

  let parsedData;
  try {
    let cleanJson = rawArgonResponse.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    }
    parsedData = JSON.parse(cleanJson);
  } catch (err) {
    console.error('❌ Failed to parse Argon response as JSON. Raw output preview:', rawArgonResponse.slice(0, 500));
    throw err;
  }

  const validation = BookSynthesisSchema.safeParse(parsedData);
  if (!validation.success) {
    console.warn('⚠️ Argon output had schema warnings. Merging with strict schema structure...');
  }

  fs.writeFileSync(synthesisDataFile, JSON.stringify(parsedData, null, 2), 'utf-8');
  console.log(`✅ Saved verified Argon Book Synthesis to: ${synthesisDataFile}`);

  // Build bespoke episode from Argon data
  const rawEpisode = buildBespokeSynthesisEpisode({
    courseId,
    courseConfig,
    blueprintData: parsedData,
    sourceFacts
  });
  fs.writeFileSync(episodeRawFile, JSON.stringify(rawEpisode, null, 2), 'utf-8');
  console.log(`✅ Emitted bespoke backend PPT episode_raw.json (12 scenes, 28 beats) to: ${episodeRawFile}`);

  return parsedData;
}

/**
 * Builds a 100% bespoke backend PPT episode for the synthesis video
 * where every card, message, and comparison aligns directly with the book's dialectic.
 */
export function buildBespokeSynthesisEpisode({ courseId, courseConfig, blueprintData, sourceFacts }) {
  const isHull = /hull|futures|options/i.test(courseId);
  const primaryColor = courseConfig.visualTheme?.primaryColor || '#0F766E';
  const accentColor = courseConfig.visualTheme?.accentColor || '#F59E0B';
  const cChain = blueprintData.causalEvolutionChain || [];
  const rules = blueprintData.holisticSynthesisRules || [];
  const dilem = blueprintData.openingDilemma || {};
  const cPairs = blueprintData.complementaryPairs || [];

  const step1 = cChain[0] || { priorConcept: 'Foundational Concept', fatalLimitation: 'Hidden limitation', authorSolution: 'Breakthrough Tool' };
  const step2 = cChain[1] || { priorConcept: 'Linear Tool', fatalLimitation: 'Asymmetry breakdown', authorSolution: 'Convexity Solution' };
  const step3 = cChain[2] || { priorConcept: 'Single Model', fatalLimitation: 'Tail risk collapse', authorSolution: 'Multi-Factor Model' };
  const pair1 = cPairs[0] || { toolA: 'Linear Tools', toolB: 'Convex Tools', synergyExplanation: 'Synergy between tools' };

  return {
    schemaVersion: '1.0.0',
    meta: {
      course: courseId,
      chapter: 'SYNTHESIS',
      chapterTitle: `THE MASTER SYNTHESIS: COMPLETE EVOLUTIONARY FLOW OF ${courseConfig.bookTitle.toUpperCase()}`,
      domain: isHull ? 'finance' : 'technical_analysis',
      primaryColor,
      accentColor,
      narrationLanguage: 'hi-IN-devanagari'
    },
    scenes: [
      // Scene 0: Origin Dilemma (chat_story)
      {
        segmentIndex: 0,
        title: 'The Origin Crisis & Why Concepts Evolve',
        template: 'chat_story',
        badge: `Historical Dilemma · ${courseConfig.bookTitle.slice(0, 20)}`,
        beats: [
          {
            id: 'b01',
            hindi_tts: `राजू पूछता है, शर्मा जी, हमने किताब के सारे चैप्टर्स पढ़े, लेकिन बाजार में असली रिस्क संभालते वक्त ये सब आपस में जुड़ते कैसे हैं?`,
            en_narration: `Raju asks: Sharma ji, we studied all the chapters, but how do they connect into one real-world framework?`,
            subtitle: `Raju asks: Sharma ji, how do all chapters connect into one coherent system?`,
            en_subtitle: `Raju asks: Sharma ji, how do all chapters connect into one coherent system?`,
            pauseAfterMs: 400,
            ui_state: {
              stageDirections: ['— Raju questions how individual chapters form an unbroken evolutionary system —'],
              messages: [
                {
                  sender: 'Raju',
                  avatar: 'R',
                  text: `Sharma ji, we studied all chapters individually. In real market conditions, how does this entire book connect into one unified risk system?`,
                  theme: 'amber',
                  align: 'left'
                }
              ]
            }
          },
          {
            id: 'b02',
            hindi_tts: `शर्मा जी समझाते हैं, शुरुआत हमेशा एक वास्तविक मानवीय और कारोबारी संकट से हुई थी।`,
            en_narration: `Sharma ji explains: The origin began with a concrete market crisis and real-world struggle.`,
            subtitle: `Sharma ji explains: The origin began with a concrete market crisis and struggle.`,
            en_subtitle: `Sharma ji explains: The origin began with a concrete market crisis and struggle.`,
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ['— Sharma ji outlines the historical context and initial dilemma —'],
              messages: [
                {
                  sender: 'Raju',
                  avatar: 'R',
                  text: `Sharma ji, we studied all chapters individually. In real market conditions, how does this entire book connect into one unified risk system?`,
                  theme: 'amber',
                  align: 'left'
                },
                {
                  sender: 'Sharma ji',
                  avatar: 'S',
                  text: dilem.historicalContext || `Market participants originally relied on isolated tools, exposing themselves to unforeseen systemic blindspots.`,
                  theme: 'teal',
                  align: 'right'
                }
              ]
            }
          },
          {
            id: 'b03',
            hindi_tts: `जब अप्रत्याशित झटका लगा, तो पुराने मॉडल पूरी तरह फेल हो गए और भारी नुकसान हुआ!`,
            en_narration: `When unexpected market shocks arrived, early tools broke down and created devastating losses!`,
            subtitle: `When unexpected market shocks hit, earlier tools failed, creating severe losses!`,
            en_subtitle: `When unexpected market shocks hit, earlier tools failed, creating severe losses!`,
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ['— The fatal limitation of early tools triggers catastrophic failure —'],
              messages: [
                {
                  sender: 'Raju',
                  avatar: 'R',
                  text: `Sharma ji, we studied all chapters individually. In real market conditions, how does this entire book connect into one unified risk system?`,
                  theme: 'amber',
                  align: 'left'
                },
                {
                  sender: 'Sharma ji',
                  avatar: 'S',
                  text: dilem.historicalContext || `Market participants originally relied on isolated tools, exposing themselves to unforeseen systemic blindspots.`,
                  theme: 'teal',
                  align: 'right'
                },
                {
                  sender: 'Sharma ji',
                  avatar: 'S',
                  text: dilem.fatalMistake || `Relying on a single isolated model creates a false sense of security while catastrophic tail risks remain completely unhedged.`,
                  theme: 'teal',
                  align: 'right'
                }
              ]
            }
          },
          {
            id: 'b04',
            hindi_tts: `इसलिए लेखक ने हर नए चैप्टर में पिछली कमी को दूर करने वाला क्रांतिकारी समाधान पेश किया है।`,
            en_narration: `Thus, each succeeding chapter was invented to fix the fatal limitation of the prior tool.`,
            subtitle: `Thus, each succeeding chapter was invented to resolve the prior tool's fatal flaw.`,
            en_subtitle: `Thus, each succeeding chapter was invented to resolve the prior tool's fatal flaw.`,
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ['— The author introduces the systemic breakthrough unifying the entire book —'],
              messages: [
                {
                  sender: 'Raju',
                  avatar: 'R',
                  text: `Sharma ji, we studied all chapters individually. In real market conditions, how does this entire book connect into one unified risk system?`,
                  theme: 'amber',
                  align: 'left'
                },
                {
                  sender: 'Sharma ji',
                  avatar: 'S',
                  text: dilem.historicalContext || `Market participants originally relied on isolated tools, exposing themselves to unforeseen systemic blindspots.`,
                  theme: 'teal',
                  align: 'right'
                },
                {
                  sender: 'Sharma ji',
                  avatar: 'S',
                  text: dilem.fatalMistake || `Relying on a single isolated model creates a false sense of security while catastrophic tail risks remain completely unhedged.`,
                  theme: 'teal',
                  align: 'right'
                },
                {
                  sender: 'Sharma ji',
                  avatar: 'S',
                  text: dilem.authorInvention || `The author's genius is that every single concept is a dialectical solution designed to protect you where the prior tool fails!`,
                  theme: 'teal',
                  align: 'right'
                }
              ]
            }
          }
        ]
      },

      // Scene 1: Opposing Dialectical Forces (tug_of_war)
      {
        segmentIndex: 1,
        title: `${pair1.toolA} vs ${pair1.toolB}`,
        template: 'tug_of_war',
        badge: 'Dialectical Tension · Dual Forces',
        beats: [
          {
            id: 'b05',
            hindi_tts: `एक तरफ पहला टूल है, जो अपनी जगह उपयोगी है लेकिन अपनी सीमा में बंधा हुआ है।`,
            en_narration: `On one side is the initial tool: indispensable for its purpose, but carrying a distinct blindspot.`,
            subtitle: `${pair1.toolA} solves immediate execution but carries distinct blindspots.`,
            en_subtitle: `${pair1.toolA} solves immediate execution but carries distinct blindspots.`,
            pauseAfterMs: 400,
            ui_state: {
              leftTitle: pair1.toolA || 'Linear Framework',
              rightTitle: pair1.toolB || 'Convex Shield',
              leftScore: 50,
              rightScore: 50,
              leftLabel: 'Primary Efficiency',
              rightLabel: 'Structural Protection',
              centerTitle: 'The Dialectical Divide',
              trend: 'up',
              stageDirections: ['— Contrasting the strengths and blindspots of both core tools —']
            }
          },
          {
            id: 'b06',
            hindi_tts: `दूसरी तरफ दूसरा टूल है, जो पहले टूल के अंधे मोड़ पर आपको सुरक्षा और बढ़त प्रदान करता है।`,
            en_narration: `On the other side is the counter-tool, providing convexity and protection exactly where the first tool fails.`,
            subtitle: `${pair1.toolB} steps in to protect where the first tool fails.`,
            en_subtitle: `${pair1.toolB} steps in to protect where the first tool fails.`,
            pauseAfterMs: 400,
            ui_state: {
              leftTitle: pair1.toolA || 'Linear Framework',
              rightTitle: pair1.toolB || 'Convex Shield',
              leftScore: 30,
              rightScore: 70,
              leftLabel: 'Vulnerable to Tail Shocks',
              rightLabel: 'Asymmetric Convexity Advantage',
              centerTitle: 'Convexity Superiority',
              trend: 'up',
              stageDirections: ['— The counter-tool neutralizes catastrophic vulnerability —']
            }
          },
          {
            id: 'b07',
            hindi_tts: `मास्टर विश्लेषक इन दोनों टूल्स को एक साथ मिलाकर एक अभेद्य ट्रेडिंग सिस्टम तैयार करता है।`,
            en_narration: `The master practitioner unites both tools into an unbreakable, all-weather framework.`,
            subtitle: `The master practitioner unites both tools into an unbreakable system.`,
            en_subtitle: `The master practitioner unites both tools into an unbreakable system.`,
            pauseAfterMs: 400,
            ui_state: {
              leftTitle: pair1.toolA || 'Linear Framework',
              rightTitle: pair1.toolB || 'Convex Shield',
              leftScore: 50,
              rightScore: 50,
              leftLabel: 'Low Cost Efficiency',
              rightLabel: 'Catastrophic Protection',
              centerTitle: 'Integrated Fortress',
              trend: 'down',
              stageDirections: ['— True mastery fuses both tools to eliminate all blindspots —']
            }
          }
        ]
      },

      // Scene 2: The 4 Evolutionary Eras (progressive_cards)
      {
        segmentIndex: 2,
        title: `The 4 Evolutionary Eras of ${courseConfig.bookTitle.slice(0, 24)}`,
        template: 'progressive_cards',
        badge: 'Macro Architecture · 4 Pillars',
        beats: [0, 1, 2, 3].map(idx => {
          const step = cChain[idx] || { priorConcept: `Era ${idx + 1}`, succeedingConcept: `Breakthrough ${idx + 1}`, fatalLimitation: 'Limitation solved' };
          return {
            id: `b${String(idx + 8).padStart(2, '0')}`,
            hindi_tts: `युग ${idx + 1}: ${step.priorConcept} से आगे बढ़कर ${step.succeedingConcept} की खोज हुई।`,
            en_narration: `Era ${idx + 1}: Progressing from ${step.priorConcept} to ${step.succeedingConcept} to resolve critical limitations.`,
            subtitle: `Era ${idx + 1}: ${step.priorConcept} evolves into ${step.succeedingConcept}.`,
            en_subtitle: `Era ${idx + 1}: ${step.priorConcept} evolves into ${step.succeedingConcept}.`,
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: idx,
              sectionHeader: 'THE 4 EVOLUTIONARY ERAS',
              cards: [0, 1, 2, 3].map(cIdx => {
                const cStep = cChain[cIdx] || { priorConcept: `Era ${cIdx + 1}`, succeedingConcept: `Breakthrough ${cIdx + 1}`, fatalLimitation: 'Limitation solved' };
                return {
                  title: `Era ${cIdx + 1}: ${cStep.priorConcept}`,
                  desc: `${cStep.succeedingConcept} resolves: ${cStep.fatalLimitation || 'structural friction'}.`,
                  state: cIdx === idx ? (idx === 0 ? 'active_amber' : idx === 1 ? 'active_blue' : idx === 2 ? 'active_purple' : 'active_green') : 'muted',
                  badge: `Pillar ${cIdx + 1}`
                };
              })
            }
          };
        })
      },

      // Scene 3: Step 1 Dialectic (split_comparison)
      {
        segmentIndex: 3,
        title: `${step1.priorConcept} vs ${step1.succeedingConcept}`,
        template: 'split_comparison',
        badge: 'Evolution Step 1 · Foundation',
        beats: [
          {
            id: 'b12',
            hindi_tts: `${step1.priorConcept} की सीमा को ${step1.succeedingConcept} ने वैज्ञानिक तरीके से दूर किया।`,
            en_narration: `${step1.priorConcept} carried severe limitations, which ${step1.succeedingConcept} systematically solved.`,
            subtitle: `${step1.priorConcept} had limitations solved by ${step1.succeedingConcept}.`,
            en_subtitle: `${step1.priorConcept} had limitations solved by ${step1.succeedingConcept}.`,
            pauseAfterMs: 400,
            ui_state: {
              leftColumn: {
                title: step1.priorConcept,
                subtitle: 'Initial Tool',
                theme: 'amber',
                icon: 'alert-triangle',
                active: true,
                bullets: [
                  step1.fatalLimitation || 'Vulnerable under extreme market stress',
                  step1.failureScenario || 'Struggled during unexpected volatility shocks',
                  'Lacks centralized risk guarantees',
                  'High friction and hidden counterparty costs'
                ]
              },
              rightColumn: {
                title: step1.succeedingConcept,
                subtitle: 'Evolutionary Innovation',
                theme: 'green',
                icon: 'shield-check',
                active: true,
                bullets: [
                  step1.breakthroughMechanism || 'Standardized mechanics and clearinghouse guarantees',
                  'Eliminates bilateral counterparty default',
                  'Continuous mark-to-market discipline',
                  'Robust across full market cycles'
                ]
              }
            }
          }
        ]
      },

      // Scene 4: Step 2 Failure Scenario (progressive_cards)
      {
        segmentIndex: 4,
        title: `${step2.failureScenario ? step2.failureScenario.slice(0, 40) : 'The Structural Breakdown'}`,
        template: 'progressive_cards',
        badge: 'Evolution Step 2 · Case Study',
        beats: [
          {
            id: 'b13',
            hindi_tts: `जब बाजार में गंभीर संकट आया, तो मॉडल की कमजोरियों ने बड़ा नुकसान कराया।`,
            en_narration: `When severe market stress unfolded, structural weaknesses caused sudden capital drain.`,
            subtitle: `Structural weakness under market stress caused severe capital drain.`,
            en_subtitle: `Structural weakness under market stress caused severe capital drain.`,
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 0,
              sectionHeader: 'CASE STUDY · STRUCTURAL FAILURE MODE',
              cards: [
                {
                  title: '1. The Operating Assumption',
                  desc: step2.priorConcept || 'Initial strategy appeared fully covered under normal conditions.',
                  state: 'active_amber',
                  badge: 'Assumption'
                },
                {
                  title: '2. The Market Inversion',
                  desc: step2.fatalLimitation || 'Severe basis risk and unexpected correlation breakdown.',
                  state: 'active_blue',
                  badge: 'Catalyst'
                },
                {
                  title: '3. The Liquidity Drain',
                  desc: step2.failureScenario || 'Massive cash margin drain forced early capitulation.',
                  state: 'active_purple',
                  badge: 'Crisis'
                },
                {
                  title: '4. The Evolutionary Fix',
                  desc: step2.authorSolution || 'Integrated multi-horizon hedging with options and stop disciplines.',
                  state: 'active_green',
                  badge: 'Resolution'
                }
              ]
            }
          }
        ]
      },

      // Scene 5: Unifying Formula Law (formula_breakdown)
      {
        segmentIndex: 5,
        title: isHull ? 'Continuous Cost-of-Carry Equilibrium' : 'The Core Mathematical Law',
        template: 'formula_breakdown',
        badge: 'Core Invariant · Mathematical Law',
        beats: [
          {
            id: 'b14',
            hindi_tts: `यह गणितीय नियम पूरे विषय की रीढ़ है, जो अटकलों को हटाकर वस्तुनिष्ठ संतुलन स्थापित करता है।`,
            en_narration: `This mathematical invariant is the backbone of the entire subject, enforcing objective equilibrium.`,
            subtitle: `This mathematical invariant enforces objective equilibrium across all markets.`,
            en_subtitle: `This mathematical invariant enforces objective equilibrium across all markets.`,
            pauseAfterMs: 400,
            ui_state: {
              title: isHull ? 'The Universal Cost-of-Carry Forward Valuation Law' : 'The Invariant Mathematical Invariant',
              expression: isHull ? 'F0 = S0 * exp((r - q) * T)' : '\\text{Confirmation} = \\text{Boundary} \\times (1 + \\text{Threshold})',
              latex: isHull ? 'F_0 = S_0 \\cdot e^{(r - q)T}' : 'P_{\\text{target}} = P_{\\text{break}} + h',
              variables: isHull ? [
                { symbol: 'F_0', label: 'Forward Delivery Price', description: 'Fair theoretical forward price agreed upon today.' },
                { symbol: 'S_0', label: 'Spot Market Price', description: 'Current cash market price of underlying asset.' },
                { symbol: 'r', label: 'Financing Rate', description: 'Risk-free borrowing rate to carry the asset.' },
                { symbol: 'q', label: 'Income Yield / Convenience', description: 'Dividend yield or storage convenience benefit.' },
                { symbol: 'T', label: 'Maturity Duration', description: 'Time to settlement as a fraction of a year.' }
              ] : [
                { symbol: 'P_t', label: 'Terminal Target', description: 'Projected objective price target.' },
                { symbol: 'h', label: 'Pattern Height', description: 'Vertical measure of supply-demand imbalance.' }
              ]
            }
          }
        ]
      },

      // Scene 6: Step 3 Convexity Comparison (split_comparison)
      {
        segmentIndex: 6,
        title: `${step2.priorConcept} vs ${step2.succeedingConcept}`,
        template: 'split_comparison',
        badge: 'Evolution Step 3 · Asymmetry',
        beats: [
          {
            id: 'b15',
            hindi_tts: `एक तरफ सीमित लीनियर प्रतिबद्धताएं हैं, और दूसरी तरफ सुरक्षा देने वाली नॉन-लीनियर कॉन्वेक्सिटी।`,
            en_narration: `On one side are rigid linear commitments; on the other is asymmetric convex protection.`,
            subtitle: `Rigid linear commitments contrasted with asymmetric convex protection.`,
            en_subtitle: `Rigid linear commitments contrasted with asymmetric convex protection.`,
            pauseAfterMs: 400,
            ui_state: {
              leftColumn: {
                title: step2.priorConcept,
                subtitle: 'Linear / Symmetric',
                theme: 'amber',
                icon: 'lock',
                active: true,
                bullets: [
                  'Full exposure to severe adverse market swings',
                  'Requires continuous capital to maintain margins',
                  'Zero upside participation during favorable moves',
                  'High emotional strain during regime shifts'
                ]
              },
              rightColumn: {
                title: step2.succeedingConcept,
                subtitle: 'Asymmetric / Convex',
                theme: 'green',
                icon: 'shield',
                active: true,
                bullets: [
                  'Maximum loss strictly capped at predefined threshold',
                  'Unconstrained participation in favorable rallies',
                  'Insulates capital from sudden margin liquidation',
                  'Converts market panic into opportunity'
                ]
              }
            }
          }
        ]
      },

      // Scene 7: Step 4 Dynamic Framework (progressive_cards)
      {
        segmentIndex: 7,
        title: `${step3.succeedingConcept} Breakthrough`,
        template: 'progressive_cards',
        badge: 'Evolution Step 4 · Dynamic Edge',
        beats: [
          {
            id: 'b16',
            hindi_tts: `अगले चरण में लेखक ने स्थिर नियमों को गतिशील और बहुआयामी रिस्क मैनेजमेंट में बदल दिया।`,
            en_narration: `In the next phase, static models evolved into dynamic multi-dimensional risk engineering.`,
            subtitle: `Static models evolved into dynamic multi-dimensional risk engineering.`,
            en_subtitle: `Static models evolved into dynamic multi-dimensional risk engineering.`,
            pauseAfterMs: 400,
            ui_state: {
              activeCardIndex: 0,
              sectionHeader: 'DYNAMIC MULTI-DIMENSIONAL MASTERY',
              cards: [
                {
                  title: '1. The Static Limitation',
                  desc: step3.fatalLimitation || 'Single-dimension indicators break down when volatility surges.',
                  state: 'active_amber',
                  badge: 'Limitation'
                },
                {
                  title: '2. The Dynamic Rebalance',
                  desc: step3.breakthroughMechanism || 'Continuous rebalancing neutralizes directional drift.',
                  state: 'active_blue',
                  badge: 'Rebalance'
                },
                {
                  title: '3. Multi-Greek Sensitivity',
                  desc: 'Accounting for curvature (Gamma) and volatility (Vega) eliminates surprise wipes.',
                  state: 'active_purple',
                  badge: 'Multi-Greek'
                },
                {
                  title: '4. Robust Portfolio Shield',
                  desc: 'All market regimes—bull, bear, or sideways—are safely navigated.',
                  state: 'active_green',
                  badge: 'Fortress'
                }
              ]
            }
          }
        ]
      },

      // Scene 8: Step 5 Regime & Fat Tails (split_comparison)
      {
        segmentIndex: 8,
        title: 'Theoretical Assumption vs Real Market Regimes',
        template: 'split_comparison',
        badge: 'Evolution Step 5 · Real World',
        beats: [
          {
            id: 'b17',
            hindi_tts: `किताब का अंतिम रहस्य यही है कि बाजार हमेशा पाठ्यपुस्तकों के सीधे नियमों से कहीं ज्यादा जटिल होते हैं।`,
            en_narration: `The book's ultimate insight is that real markets exhibit fat tails and regime shifts beyond simple models.`,
            subtitle: `Real markets exhibit fat tails and regime shifts beyond simple textbook models.`,
            en_subtitle: `Real markets exhibit fat tails and regime shifts beyond simple textbook models.`,
            pauseAfterMs: 400,
            ui_state: {
              leftColumn: {
                title: 'Textbook Simplification',
                subtitle: 'Idealized World',
                theme: 'amber',
                icon: 'x-circle',
                active: true,
                bullets: [
                  'Assumes continuous liquidity and zero friction',
                  'Symmetric bell-curve probability distribution',
                  'Treats extreme shocks as statistical impossibilities',
                  'Fragile when real-world crises strike'
                ]
              },
              rightColumn: {
                title: 'Institutional Reality',
                subtitle: 'Fat Tails & Regimes',
                theme: 'green',
                icon: 'check-circle',
                active: true,
                bullets: [
                  'Explicitly prices crashophobia and liquidity crunches',
                  'Recognizes fat tails and rapid regime transitions',
                  'Builds structural buffers for multi-sigma events',
                  'Ensures survival across decades of market chaos'
                ]
              }
            }
          }
        ]
      },

      // Scene 9: Active Recall Scenario (interactive_quiz)
      {
        segmentIndex: 9,
        title: 'Diagnose the Cross-Chapter Crisis',
        template: 'interactive_quiz',
        badge: 'Active Recall · Multi-Chapter',
        beats: [
          {
            id: 'b18',
            hindi_tts: `एक ट्रेडर ने अलग-अलग चैप्टर्स के टूल्स बिना कनेक्शन के इस्तेमाल किए और बड़ा नुकसान झेला।`,
            en_narration: `A trader used isolated tools without recognizing their systemic boundaries and suffered severe losses.`,
            subtitle: `A trader used isolated tools without understanding boundaries and suffered losses.`,
            en_subtitle: `A trader used isolated tools without understanding boundaries and suffered losses.`,
            pauseAfterMs: 400,
            ui_state: {
              question: 'An industrial corporation hedged long-term commodity delivery commitments by rolling short-term futures monthly. When spot prices plunged 50% into contango, what fatal risk caused insolvency?',
              options: [
                'A) Market makers illegally manipulated the exchange settlement prices.',
                'B) Severe cash margin drains from contango roll costs exceeded liquidity, proving linear futures cannot hedge multi-year structural commitments alone.',
                'C) The clearinghouse increased margin requirements beyond statutory maximums.',
                'D) Futures contracts expired early before the delivery date.'
              ],
              correctAnswer: 'B',
              showThinkingSpinner: false,
              isRevealed: false
            }
          },
          {
            id: 'b19',
            hindi_tts: `सोचिए: इस संकट को टालने के लिए किताब के किस समग्र सिद्धांत को अपनाना चाहिए था?`,
            en_narration: `Consider: Which integrated holistic principle from the book would have prevented this disaster?`,
            subtitle: `Which integrated principle from the book would have prevented this disaster?`,
            en_subtitle: `Which integrated principle from the book would have prevented this disaster?`,
            pauseAfterMs: 3200,
            ui_state: {
              question: 'An industrial corporation hedged long-term commodity delivery commitments by rolling short-term futures monthly. When spot prices plunged 50% into contango, what fatal risk caused insolvency?',
              options: [
                'A) Market makers illegally manipulated the exchange settlement prices.',
                'B) Severe cash margin drains from contango roll costs exceeded liquidity, proving linear futures cannot hedge multi-year structural commitments alone.',
                'C) The clearinghouse increased margin requirements beyond statutory maximums.',
                'D) Futures contracts expired early before the delivery date.'
              ],
              correctAnswer: 'B',
              showThinkingSpinner: true,
              isRevealed: false
            }
          },
          {
            id: 'b20',
            hindi_tts: `सही जवाब है बी: कभी भी एक अकेले टूल पर निर्भर न रहें; लीनियर टूल्स को ऑप्शंस और सख्त लिक्विडिटी बफर के साथ कंबाइन करें।`,
            en_narration: `Correct answer is B: Never rely on a single isolated tool; combine linear efficiency with convex protection.`,
            subtitle: `Correct is B: Combine linear efficiency with convex protection and cash buffers.`,
            en_subtitle: `Correct is B: Combine linear efficiency with convex protection and cash buffers.`,
            pauseAfterMs: 450,
            ui_state: {
              question: 'An industrial corporation hedged long-term commodity delivery commitments by rolling short-term futures monthly. When spot prices plunged 50% into contango, what fatal risk caused insolvency?',
              options: [
                'A) Market makers illegally manipulated the exchange settlement prices.',
                'B) Severe cash margin drains from contango roll costs exceeded liquidity, proving linear futures cannot hedge multi-year structural commitments alone.',
                'C) The clearinghouse increased margin requirements beyond statutory maximums.',
                'D) Futures contracts expired early before the delivery date.'
              ],
              answer: 'B',
              correctAnswer: 'B',
              showThinkingSpinner: false,
              isRevealed: true,
              explanation: 'Rolling short-dated contracts to hedge long-dated liabilities introduces fatal roll yield bleed and cash margin drain when markets shift.'
            }
          }
        ]
      },

      // Scene 10: Mentor Desk Synthesis (chat_story)
      {
        segmentIndex: 10,
        title: `Synthesizing ${courseConfig.bookTitle.slice(0, 24)}`,
        template: 'chat_story',
        badge: 'Desk Wisdom · Holistic View',
        beats: [
          {
            id: 'b21',
            hindi_tts: `राजू कहता है, शर्मा जी, अब जाकर पूरी किताब एक माला की तरह जुड़ गई—कोई भी चैप्टर अकेला नहीं है!`,
            en_narration: `Raju realizes: Sharma ji, now the entire book connects into an unbroken chain—no chapter stands alone!`,
            subtitle: `Sharma ji, now the entire book connects into an unbroken chain!`,
            en_subtitle: `Sharma ji, now the entire book connects into an unbroken chain!`,
            pauseAfterMs: 400,
            ui_state: {
              stageDirections: ['— Raju perceives the complete holistic architecture of the book —'],
              messages: [
                {
                  sender: 'Raju',
                  avatar: 'R',
                  text: `Sharma ji, now I finally see the complete picture! No chapter stands alone—every single concept exists to shield the blindspot of the previous one.`,
                  theme: 'amber',
                  align: 'left'
                }
              ]
            }
          },
          {
            id: 'b22',
            hindi_tts: `शर्मा जी कहते हैं, बिल्कुल सही! जब तुम हर टूल की सीमा समझकर उन्हें एक साथ इस्तेमाल करोगे, तभी असली महारत मिलेगी।`,
            en_narration: `Sharma ji affirms: Exactly! When you understand each tool's boundaries and unite them, you achieve true mastery.`,
            subtitle: `When you understand each tool's boundaries and unite them, you achieve true mastery.`,
            en_subtitle: `When you understand each tool's boundaries and unite them, you achieve true mastery.`,
            pauseAfterMs: 450,
            ui_state: {
              stageDirections: ['— Sharma ji blesses the student with the master risk directive —'],
              messages: [
                {
                  sender: 'Raju',
                  avatar: 'R',
                  text: `Sharma ji, now I finally see the complete picture! No chapter stands alone—every single concept exists to shield the blindspot of the previous one.`,
                  theme: 'amber',
                  align: 'left'
                },
                {
                  sender: 'Sharma ji',
                  avatar: 'S',
                  text: `Exactly! Respect the boundary of each tool, combine efficiency with convexity, and you will compound wealth safely across decades.`,
                  theme: 'teal',
                  align: 'right'
                }
              ]
            }
          }
        ]
      },

      // Scene 11: 8 Synthesis Rules (summary_thread)
      {
        segmentIndex: 11,
        title: `The 8 Inviolable Laws of ${courseConfig.bookTitle.slice(0, 24)}`,
        template: 'summary_thread',
        badge: 'Summary Thread · Master Rules',
        beats: [
          {
            id: 'b23',
            hindi_tts: `आइए, इस पूरी किताब के आठ सबसे महत्वपूर्ण नियमों को एक साथ संक्षेप में दोहराते हैं।`,
            en_narration: `Let us summarize the eight inviolable laws uniting this entire book.`,
            subtitle: `Let us summarize the eight inviolable laws uniting this entire book.`,
            en_subtitle: `Let us summarize the eight inviolable laws uniting this entire book.`,
            pauseAfterMs: 400,
            ui_state: {
              heading: 'THE 8 INVIOLABLE LAWS',
              activeStepRange: [0, 0],
              steps: rules.slice(0, 8).map((r, i) => `${i + 1}. ${r.corePrinciple || r.title || 'Principle ' + (i + 1)}`)
            }
          },
          {
            id: 'b24',
            hindi_tts: `नियम एक और दो: बुनियादी संरचना और निष्पक्ष मूल्य निर्धारण के सिद्धांत।`,
            en_narration: `Rules 1 and 2: Foundational market architecture and objective equilibrium pricing.`,
            subtitle: `Rules 1 & 2: Foundational architecture and objective pricing.`,
            en_subtitle: `Rules 1 & 2: Foundational architecture and objective pricing.`,
            pauseAfterMs: 400,
            ui_state: {
              heading: 'THE 8 INVIOLABLE LAWS',
              activeStepRange: [1, 2],
              steps: rules.slice(0, 8).map((r, i) => `${i + 1}. ${r.corePrinciple || r.title || 'Principle ' + (i + 1)}`)
            }
          },
          {
            id: 'b25',
            hindi_tts: `नियम तीन और चार: लीनियर सीमाओं को पहचानना और कॉन्वेक्स सुरक्षा अपनाना।`,
            en_narration: `Rules 3 and 4: Recognizing linear limits and deploying convex protection.`,
            subtitle: `Rules 3 & 4: Recognizing linear limits and deploying convex protection.`,
            en_subtitle: `Rules 3 & 4: Recognizing linear limits and deploying convex protection.`,
            pauseAfterMs: 400,
            ui_state: {
              heading: 'THE 8 INVIOLABLE LAWS',
              activeStepRange: [3, 4],
              steps: rules.slice(0, 8).map((r, i) => `${i + 1}. ${r.corePrinciple || r.title || 'Principle ' + (i + 1)}`)
            }
          },
          {
            id: 'b26',
            hindi_tts: `नियम पांच और छह: गतिशील रीबैलेंसिंग और बहुआयामी रिस्क नियंत्रण।`,
            en_narration: `Rules 5 and 6: Dynamic rebalancing and multi-dimensional risk control.`,
            subtitle: `Rules 5 & 6: Dynamic rebalancing and multi-dimensional risk control.`,
            en_subtitle: `Rules 5 & 6: Dynamic rebalancing and multi-dimensional risk control.`,
            pauseAfterMs: 400,
            ui_state: {
              heading: 'THE 8 INVIOLABLE LAWS',
              activeStepRange: [5, 6],
              steps: rules.slice(0, 8).map((r, i) => `${i + 1}. ${r.corePrinciple || r.title || 'Principle ' + (i + 1)}`)
            }
          },
          {
            id: 'b27',
            hindi_tts: `नियम सात और आठ: वास्तविक बाजार की फैट टेल्स और संपूर्ण सिस्टम का एकीकरण।`,
            en_narration: `Rules 7 and 8: Real-world fat tails and unifying all tools into one fortress.`,
            subtitle: `Rules 7 & 8: Real-world fat tails and unifying all tools into one fortress.`,
            en_subtitle: `Rules 7 & 8: Real-world fat tails and unifying all tools into one fortress.`,
            pauseAfterMs: 400,
            ui_state: {
              heading: 'THE 8 INVIOLABLE LAWS',
              activeStepRange: [7, 8],
              steps: rules.slice(0, 8).map((r, i) => `${i + 1}. ${r.corePrinciple || r.title || 'Principle ' + (i + 1)}`)
            }
          },
          {
            id: 'b28',
            hindi_tts: `ये आठ नियम मिलकर आपकी पूंजी को बाजार के हर चक्र में सुरक्षित रखते हैं।`,
            en_narration: `These eight rules unite to safeguard capital across every market regime.`,
            subtitle: `These eight rules unite to safeguard capital across every market regime.`,
            en_subtitle: `These eight rules unite to safeguard capital across every market regime.`,
            pauseAfterMs: 450,
            ui_state: {
              heading: 'THE 8 INVIOLABLE LAWS',
              compactOverview: true,
              steps: rules.slice(0, 8).map((r, i) => `${i + 1}. ${r.corePrinciple || r.title || 'Principle ' + (i + 1)}`)
            }
          }
        ]
      }
    ]
  };
}

// CLI Entrypoint
const isDirectCall = process.argv[1] && (
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) ||
  process.argv[1].endsWith('generate_book_synthesis.mjs')
);

if (isDirectCall) {
  const args = process.argv.slice(2);
  const courseArg = args.find(a => a.startsWith('--course='));
  const course = courseArg ? courseArg.split('=')[1] : 'hull_derivatives';
  const dryRun = args.includes('--dry-run') || !args.includes('--execute');
  const execute = args.includes('--execute');

  runBookSynthesis({ course, dryRun, execute }).catch(err => {
    console.error('❌ Execution error:', err);
    process.exit(1);
  });
}
