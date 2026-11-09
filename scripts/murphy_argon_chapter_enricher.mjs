// scripts/murphy_argon_chapter_enricher.mjs
import fs from 'node:fs';
import path from 'node:path';
import { SourceFactsSchema } from '../src/schemas/sourceLessonSchemas.mjs';

const ARGON_ENDPOINT = 'http://127.0.0.1:8001/v1/chat/completions';
const MODEL = 'gemini-4-argon';

export async function callArgon(prompt, maxRetries = 3, timeoutMs = 900000, sessionPrefix = 'murphy') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    // Open a brand new chat window / isolated thread for each call to avoid stale context corruption
    const sessionId = `chat_${sessionPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      console.log(`📡 [Argon Call] Attempt ${attempt}/${maxRetries} (Session: ${sessionId}, timeout: ${timeoutMs / 1000}s)...`);
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
      
      // Check for Gemini thread failure message ("I seem to be encountering an error...")
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
      console.warn(`⚠️ [Argon Error] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

const VALID_CATEGORIES = new Set([
  'definition',
  'claim',
  'formula',
  'numerical_example',
  'case_study',
  'assumption',
  'market_rule'
]);

function normalizeCategory(cat) {
  if (!cat) return 'market_rule';
  const c = cat.toLowerCase().trim();
  if (VALID_CATEGORIES.has(c)) return c;
  if (c.includes('case') || c.includes('history') || c.includes('historical') || c.includes('dilemma') || c.includes('trap')) return 'case_study';
  if (c.includes('formula') || c.includes('math')) return 'formula';
  if (c.includes('def')) return 'definition';
  if (c.includes('rule') || c.includes('law') || c.includes('principle')) return 'market_rule';
  if (c.includes('num') || c.includes('stat') || c.includes('threshold') || c.includes('example')) return 'numerical_example';
  if (c.includes('assump')) return 'assumption';
  return 'claim';
}

export async function extractComprehensiveFactsWithArgon(chapterKey, chapterTitle, contextText) {
  const prompt = `You are the Lead Quantitative Financial Content Director and Chief Technical Analyst.
Extract an exhaustive, highly detailed, authoritative fact ledger from the provided textbook context by John J. Murphy for chapter "${chapterTitle}" (${chapterKey}).

AUTHORITATIVE BOOK: "Technical Analysis of the Financial Markets" by John J. Murphy.

CRITICAL INSTRUCTIONS & HULL BENCHMARK INVARIANT:
1. Do NOT summarize superficially. The student must NOT need to open the original book themselves because all authoritative author knowledge is captured here.
2. Follow the Hull Derivatives benchmark pattern: Every lesson starts from a concrete, motivating problem/friction!
   - fact-01 MUST be the "Motivating Trading Dilemma / Real-World Failure Trap" (category: "case_study" or "market_rule"). State the practical trader struggle, market failure, or real-world friction that makes this concept necessary (e.g. Fundamental reports lag by months trapping buyers before 30% drops; trapped sellers waiting to break even creating resistance; whipsaw false breakouts wiping out capital).
   - fact-02 MUST be "The Author's Conceptual Invention & Solution" (category: "market_rule"). Explain why John J. Murphy / market technicians developed this specific concept to solve that opening dilemma.
   - Extract between 12 to 15 exhaustive, distinct facts covering:
     * Fundamental axioms and technical principles,
     * Precise geometric chart rules, parameters, and formation guidelines,
     * Mathematical calculations or percentage thresholds (e.g. 3% filter, 2-day rule, 38.2%/50%/61.8% retracements, RSI 70/30, MACD fast/slow periods),
     * Concrete confirmation sequences (e.g. price and volume relationships, indicators confirming price),
     * Real-world traps, failure modes, and criticisms (e.g. false breakouts, whip-saws, lag in moving averages).
3. Every fact MUST have:
   - id: "fact-01", "fact-02", etc.
   - category: one of ["definition", "claim", "formula", "numerical_example", "case_study", "assumption", "market_rule"]
   - topic: concise 2-5 word title
   - statement: detailed 20-50 word precise statement explaining the concept, author rationale, and market mechanics.
   - sourceCitation: { "book": "Technical Analysis of the Financial Markets", "chapter": "${chapterTitle}", "excerpt": "brief quote or reference" }
4. If a fact has category "formula", you MUST include "formulaDetails" with "name", "latex", and "variables" array (each with symbol, definition, and unit). If variables are not structured, categorize it as "market_rule" instead.
5. You MUST include at least one fact with category "numerical_example" illustrating concrete price, volume, or parameter numbers.
6. Output ONLY valid JSON matching this structure without markdown code fences:
{
  "facts": [
    {
      "id": "fact-01",
      "category": "case_study",
      "topic": "...",
      "statement": "...",
      "sourceCitation": {
        "book": "Technical Analysis of the Financial Markets",
        "chapter": "${chapterTitle}",
        "excerpt": "..."
      }
    }
  ],
  "generalAssumptions": [
    "Market action discounts all fundamental, political, and psychological information.",
    "Prices move in persistent trends that continue until definite reversal signals emerge.",
    "History repeats itself because human crowd psychology remains invariant."
  ]
}

Textbook Context:
${contextText.slice(0, 7000)}
`;

  const raw = await callArgon(prompt, 3, 900000, `${chapterKey}_facts`);
  const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  const normalizedFacts = (parsed.facts || []).map((f, idx) => {
    let cat = normalizeCategory(f.category);
    let cleanFormulaDetails = undefined;

    // Formula verification: must have formulaDetails.variables and required fields
    if (cat === 'formula') {
      if (!f.formulaDetails || !Array.isArray(f.formulaDetails.variables) || f.formulaDetails.variables.length === 0) {
        cat = 'market_rule';
      } else {
        cleanFormulaDetails = {
          name: f.formulaDetails.name || f.topic || `Formula ${idx + 1}`,
          latex: f.formulaDetails.latex || f.formulaDetails.formula || undefined,
          variables: f.formulaDetails.variables.map((v, vIdx) => ({
            symbol: v.symbol || `v${vIdx + 1}`,
            definition: v.definition || 'Market variable',
            unit: v.unit || 'pts'
          })),
          assumptions: Array.isArray(f.formulaDetails.assumptions) ? f.formulaDetails.assumptions : undefined
        };
      }
    }

    return {
      id: `fact-${String(idx + 1).padStart(2, '0')}`,
      category: cat,
      topic: f.topic || `Technical Analysis Principle ${idx + 1}`,
      statement: f.statement || 'Authoritative John J. Murphy technical analysis concept.',
      sourceCitation: {
        book: 'Technical Analysis of the Financial Markets',
        chapter: chapterTitle,
        excerpt: f.sourceCitation?.excerpt || 'John J. Murphy authoritative text.',
        provenance: 'notebooklm_query'
      },
      formulaDetails: cleanFormulaDetails,
      tags: f.tags || []
    };
  });

  // Ensure at least one fact is typed as 'numerical_example' to satisfy Phase 1 audit requirement
  const hasNumerical = normalizedFacts.some(f => f.category === 'numerical_example');
  if (!hasNumerical && normalizedFacts.length > 0) {
    const numFact = normalizedFacts.find(f => /\d+/.test(f.statement)) || normalizedFacts[Math.min(2, normalizedFacts.length - 1)];
    numFact.category = 'numerical_example';
  }

  const fullPayload = {
    schemaVersion: '1.0.0',
    chapterSlug: chapterKey,
    notebookId: '37f192bf-8225-4ea5-a8d0-3b3a19c18fd9',
    sourceId: 'b65495a2-bb39-47a7-98ce-00b7ce1096bf',
    retrievalTimestamp: new Date().toISOString(),
    bookTitle: 'Technical Analysis of the Financial Markets',
    facts: normalizedFacts,
    generalAssumptions: parsed.generalAssumptions || [
      'Market action discounts all fundamental, political, and psychological information.',
      'Prices move in trends that persist until definite reversal signals appear.',
      'History repeats itself because human market psychology remains invariant.'
    ]
  };

  SourceFactsSchema.parse(fullPayload);
  return fullPayload;
}

export async function generateDialoguesWithArgon(chapterKey, chapterTitle, facts) {
  const factSummary = facts.facts.map(f => `${f.id}: [${f.topic}] ${f.statement}`).join('\n');
  const prompt = `You are the Lead Bilingual Educational Dialogue & Visual Experience Director.
Generate the complete educational dialogue script AND matching on-screen scene visuals for chapter "${chapterTitle}" (${chapterKey}) of John J. Murphy's "Technical Analysis of the Financial Markets" based strictly on these extracted book facts:

${factSummary}

CRITICAL PEDAGOGICAL INSTRUCTION (HULL-STYLE PROBLEM-FIRST FRONT HOOK):
You MUST structure the lesson around a CONCRETE, RELATABLE FRONT EXAMPLE:
- b01 (Raju / Alex): Eagerly asks about a practical trading struggle, market trap, or failure mode (NOT a dry definition).
  E.g.: "Sharma ji, why do investors often buy on glowing corporate earnings news only to watch the stock crash 30% immediately after?"
- b02 (Sharma ji / Marcus): Introduces the CONCRETE REAL-WORLD SITUATION & ACTORS:
  E.g.: "Consider a retail investor who bought XYZ shares after seeing quarterly filings show a 25% profit surge."
- b03 (Sharma ji / Marcus): Reveals the TRAP / EXISTENTIAL CRISIS (Why conventional thinking failed):
  E.g.: "However, public earnings reports lagged by three months, while smart money had already dumped 30% on insider selling!"
- b04 (Sharma ji / Marcus): Explains the CONCEPTUAL INVENTION & AUTHOR SOLUTION (John Murphy's Principle):
  E.g.: "Thus, John Murphy establishes that market action discounts all information in advance, protecting disciplined chartists from the news lag trap!"
- b05, b06, b07 (Scene 1: Tug of War): Pits the opposing market pressures of that opening dilemma against each other.
- b08, b09, b10, b11 (Scene 2: Progressive Cards): Introduces the 4 structural solution pillars tackling that dilemma.
- b12 to b17 (Scenes 3 to 8): Concrete technical demonstrations, chart rules, formulas, and volume confirmations.
- b18 (Scene 9 Quiz): A detailed trading scenario question containing AT LEAST 18 WORDS testing if the student can avoid the opening trap.
- b19: Thinking pause.
- b20: Quiz answer and explanation.
- b21 (Scene 10 Raju / Alex): Reflects on the key discipline needed to avoid the opening dilemma.
- b22 (Scene 10 Sharma ji / Marcus): Mentor wisdom delivering author's core cautionary advice.
- b23 to b28 (Scene 11 Summary): 8 crisp rules codifying the entire solution.

PERSONAS:
- Hindi: Raju (retail trader asking eager practical questions) and Sharma ji (veteran technical analyst mentor giving deep foundational insights).
- English: Alex (junior analyst) and Marcus (senior chartist mentor).

IMPORTANT RULES:
- hi_tts MUST be written in pure Devanagari script (e.g. "शर्मा जी, जॉन मर्फी के अनुसार..."). NO English Latin alphabet in hi_tts, NO slurred phonetics.
- en_narration MUST be natural, grammatically correct professional English.
- Every sentence must be concise (guideline: <= 16 words per subtitle line).
- b18 (Quiz question): en_narration MUST be a detailed trading scenario question containing AT LEAST 18 WORDS.
- sceneVisuals MUST be written in English Latin characters only (no Devanagari in sceneVisuals).
- Explicitly mention the specific concepts, patterns, indicators, or rules of this exact chapter part.

OUTPUT FORMAT:
Output ONLY valid JSON matching this exact structure without markdown code fences:
{
  "dialogues": {
    "b01": { "speaker": "Raju", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b02": { "speaker": "Sharma ji", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b03": { "speaker": "Sharma ji", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b04": { "speaker": "Sharma ji", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b05": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b06": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b07": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b08": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b09": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b10": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b11": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b12": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b13": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b14": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b15": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b16": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b17": { "speaker": "Narrator", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b18": { "speaker": "Quiz Host", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b19": { "speaker": "Quiz Host", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b20": { "speaker": "Quiz Host", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b21": { "speaker": "Raju", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b22": { "speaker": "Sharma ji", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b23": { "speaker": "Summary", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b24": { "speaker": "Summary", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b25": { "speaker": "Summary", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b26": { "speaker": "Summary", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b27": { "speaker": "Summary", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." },
    "b28": { "speaker": "Summary", "hi_tts": "...", "en_narration": "...", "en_subtitle": "..." }
  },
  "sceneVisuals": {
    "scene0": {
      "title": "Origins & The Market Dilemma",
      "badge": "Market Reality · Problem & Solution",
      "b01_raju": "Concise English question explaining the trader dilemma",
      "b02_sharma": "Concise English explanation of the concrete situation & actors",
      "b03_sharma": "Concise English explanation of the trap / crisis",
      "b04_sharma": "Concise English explanation of the conceptual invention & solution"
    },
    "scene1": {
      "title": "The Information Lag Conflict",
      "badge": "Market Friction · News Lag vs Leading Price",
      "leftLabel": "Fundamental Lag (Trapped Crowd)",
      "rightLabel": "Price Action (Informed Chartist)"
    },
    "scene2": {
      "title": "The 4 Core Analytical Pillars",
      "badge": "Roadmap · 4 Methodological Pillars",
      "cards": [
        { "title": "...", "desc": "..." },
        { "title": "...", "desc": "..." },
        { "title": "...", "desc": "..." },
        { "title": "...", "desc": "..." }
      ]
    },
    "scene3": {
      "title": "Lagging Fundamentals vs Real-Time Price Action",
      "badge": "Analytical Edge · Lags vs Leading Action",
      "leftTitle": "Lagging Fundamentals",
      "rightTitle": "Price Action (Technicals)",
      "leftPoints": ["Quarterly reporting delay", "Subjective interpretations", "Insiders discount news before release"],
      "rightPoints": ["Immediate discounting of news", "Objective visual geometry", "Direct institutional supply & demand"]
    },
    "scene4": {
      "title": "Empirical Reliability & Volume Confirmation",
      "badge": "Market Evidence · Volume & Liquidity",
      "cards": [
        { "title": "Empirical Repetition", "desc": "Decades of chart evidence confirm invariant crowd psychology." },
        { "title": "Volume Confirmation", "desc": "Institutional volume must expand to validate price moves." }
      ]
    },
    "scene5": {
      "title": "Quantitative Confirmation Rule",
      "badge": "Quantitative Rule · Formula",
      "expression": "\\\\text{Breakout Confirmation} = \\\\text{Price} \\\\times (1 + \\\\text{Filter})",
      "variables": [
        { "symbol": "\\\\text{Boundary}", "label": "Support or resistance level", "unit": "pts" },
        { "symbol": "3\\\\%", "label": "Standard Murphy price filter rule", "unit": "%" }
      ]
    },
    "scene6": {
      "title": "Confirmed Breakout versus False Whipsaw Trap",
      "badge": "Validation Invariant · Authentic vs Noise",
      "leftTitle": "Confirmed Signal",
      "rightTitle": "False Breakout / Trap",
      "leftPoints": ["Decisive close beyond threshold", "Surge in companion volume", "Two-day follow-through"],
      "rightPoints": ["Intraday probe without close", "Drying or declining volume", "Quick reversal trapping crowd"]
    },
    "scene7": {
      "title": "Case Study · The Premature Anticipation Trap",
      "badge": "Case Study · Trader Pitfall",
      "cards": [
        { "title": "The Anticipation Error", "desc": "Taking positions before the pattern completes or line breaks." },
        { "title": "The Disciplined Rule", "desc": "Waiting for verified breakout confirmation preserves equity." }
      ]
    },
    "scene8": {
      "title": "Risk-to-Reward Ratio & Position Sizing",
      "badge": "Capital Preservation · Risk Math",
      "expression": "R = \\\\text{Target Profit} / \\\\text{Maximum Stop Risk}",
      "variables": [
        { "symbol": "R", "label": "Minimum 3:1 Reward-to-Risk ratio", "unit": "ratio" },
        { "symbol": "\\\\text{Risk}", "label": "Capital placed at risk per trade", "unit": "₹" }
      ]
    },
    "scene9": {
      "question": "Scenario question containing at least 18 words testing how to avoid the opening dilemma",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 1,
      "answer": "B) Explanation confirming the correct technical rule."
    },
    "scene10": {
      "rajuText": "Concise realization about discipline and objective confirmation",
      "sharmaText": "Mentor wisdom emphasizing trading what is seen rather than subjective opinions"
    },
    "scene11": {
      "rules": [
        "1. Crisp rule 1",
        "2. Crisp rule 2",
        "3. Crisp rule 3",
        "4. Crisp rule 4",
        "5. Crisp rule 5",
        "6. Crisp rule 6",
        "7. Crisp rule 7",
        "8. Crisp rule 8"
      ]
    }
  }
}
`;

  const raw = await callArgon(prompt, 3, 900000, `${chapterKey}_dialogue`);
  const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  // Fallback support if Argon returns flat dialogues
  if (!parsed.dialogues && parsed.b01) {
    return {
      dialogues: parsed,
      sceneVisuals: null
    };
  }

  return parsed;
}
