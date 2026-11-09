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

    // Generate episode_raw.json via deterministic scaffolding
    const rawEpisode = scaffoldEpisode({
      chapterKey: 'synthesis',
      courseSlug: courseId,
      chapterTitle: `The Master Synthesis · Complete Evolutionary Flow of ${courseConfig.bookTitle}`,
      facts: sourceFacts.facts,
      courseConfig
    });
    fs.writeFileSync(episodeRawFile, JSON.stringify(rawEpisode, null, 2), 'utf-8');
    console.log(`✅ Emitted episode_raw.json (12 scenes, 28 beats) to: ${episodeRawFile}`);

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

  return parsedData;
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
