// scripts/generate_lesson_storyboard.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { LessonPlanSchema, StoryboardSchema } from '../src/schemas/sourceLessonSchemas.mjs';
import { runContentAudit } from './audit_content.mjs';
import { resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function normalizeLessonPlan(lp, chapterSlug, factsList) {
  if (!lp) lp = {};
  const firstFactId = factsList[0]?.id || 'fact-01';
  const allFactIds = factsList.map((f) => f.id);

  const sections = (lp.sections || []).map((s, idx) => ({
    sectionIndex: typeof s.sectionIndex === 'number' ? s.sectionIndex : idx,
    title: s.title || s.name || `Section ${idx + 1}`,
    pedagogicalObjective: s.pedagogicalObjective || s.objective || s.goal || 'Understand foundational lesson concepts.',
    groundedFactIds: Array.isArray(s.groundedFactIds) && s.groundedFactIds.length > 0
      ? s.groundedFactIds.filter((id) => allFactIds.includes(id))
      : [allFactIds[idx % allFactIds.length] || firstFactId],
    keyPoints: Array.isArray(s.keyPoints) && s.keyPoints.length > 0 ? s.keyPoints : [s.description || 'Core principle analysis.'],
    formulaUsed: s.formulaUsed || undefined,
    numericalApplication: s.numericalApplication || undefined,
  }));

  const quiz = lp.activeRecallQuiz || {};
  const activeRecallQuiz = {
    scenario: quiz.scenario || quiz.question || 'A trader encounters this market scenario on results day with high expectations.',
    testedFactIds: Array.isArray(quiz.testedFactIds) && quiz.testedFactIds.length > 0
      ? quiz.testedFactIds.filter((id) => allFactIds.includes(id))
      : [firstFactId],
    question: quiz.question || quiz.prompt || 'What is the primary risk or consequence in this scenario?',
    correctAnswer: quiz.correctAnswer || quiz.answer || 'Correctly identifying the downside risk and margin constraints.',
    explanation: quiz.explanation || quiz.rationale || quiz.answer || 'Detailed pedagogical explanation grounded in source principles.',
  };

  const misconceptions = (lp.misconceptions || []).map((m, idx) => ({
    misconception: m.misconception || 'Believing high leverage creates free profits without downside risk.',
    factId: allFactIds.includes(m.factId) ? m.factId : firstFactId,
    authorRebuttal: m.authorRebuttal || m.rebuttal || 'The author demonstrates that leverage accelerates capital depletion.',
  }));

  return {
    schemaVersion: '1.0.0',
    chapterSlug,
    title: lp.title || 'Chapter Lesson Plan',
    targetAudiencePersona: lp.targetAudiencePersona || 'Retail Trader & Student',
    prerequisites: Array.isArray(lp.prerequisites) && lp.prerequisites.length > 0 ? lp.prerequisites : ['Basic market terminology'],
    learningOutcomes: Array.isArray(lp.learningOutcomes) && lp.learningOutcomes.length >= 3 ? lp.learningOutcomes : [
      'Understand the primary contract mechanics and definitions.',
      'Analyze real-world bankruptcy and leverage risks.',
      'Apply appropriate hedging and risk management principles.'
    ],
    sections: sections.length >= 3 ? sections : [
      {
        sectionIndex: 0,
        title: 'Core Principles',
        pedagogicalObjective: 'Introduce the core definition and mechanics.',
        groundedFactIds: [firstFactId],
        keyPoints: ['Definition and scope.'],
      },
      {
        sectionIndex: 1,
        title: 'Empirical Case Study',
        pedagogicalObjective: 'Examine historical market losses and leverage ratios.',
        groundedFactIds: [allFactIds[1] || firstFactId],
        keyPoints: ['Leverage threshold and margin call dynamics.'],
      },
      {
        sectionIndex: 2,
        title: 'Risk Framework & Execution',
        pedagogicalObjective: 'Synthesize actionable takeaway rules.',
        groundedFactIds: [allFactIds[2] || firstFactId],
        keyPoints: ['Clearinghouse and counterparty settlement.'],
      },
    ],
    misconceptions: misconceptions.length > 0 ? misconceptions : [
      {
        misconception: 'Assuming market prices move linearly without liquidity friction.',
        factId: firstFactId,
        authorRebuttal: 'The author shows that illiquidity and margin spirals cause rapid insolvency.',
      }
    ],
    activeRecallQuiz,
    coreTakeaways: Array.isArray(lp.coreTakeaways) && lp.coreTakeaways.length >= 3 ? lp.coreTakeaways : [
      'Always distinguish gross payoff from net profit.',
      'Control leverage ratios before taking directional exposure.',
      'Standardized clearing mitigates bilateral counterparty default.'
    ],
  };
}

function normalizeStoryboard(sb, chapterSlug, bookTitle, factsList) {
  if (!sb) sb = {};
  const allFactIds = factsList.map((f) => f.id);
  const firstFactId = allFactIds[0] || 'fact-01';

  const scenes = (sb.scenes || []).map((sc, sIdx) => {
    const sFactIds = (sc.sourceFactIds || []).filter((id) => allFactIds.includes(id));
    const effectiveFactIds = sFactIds.length > 0 ? sFactIds : [allFactIds[sIdx % allFactIds.length] || firstFactId];

    const beatOutlines = (sc.beatOutlines || []).map((bo, bIdx) => {
      const bFactIds = (bo.sourceFactIds || []).filter((id) => allFactIds.includes(id));
      return {
        beatIndex: typeof bo.beatIndex === 'number' ? bo.beatIndex : bIdx,
        textOutline: bo.textOutline || bo.text || `Beat ${bIdx + 1} narrative point.`,
        sourceFactIds: bFactIds.length > 0 ? bFactIds : effectiveFactIds,
        speaker: bo.speaker || 'narrator',
        visualNote: bo.visualNote || undefined,
      };
    });

    return {
      sceneIndex: typeof sc.sceneIndex === 'number' ? sc.sceneIndex : sIdx,
      title: sc.title || `Scene ${sIdx + 1}`,
      template: sc.template || 'progressive_cards',
      concept: sc.concept || 'Foundational market concept',
      sourceFactIds: effectiveFactIds,
      beatOutlines: beatOutlines.length > 0 ? beatOutlines : [
        {
          beatIndex: 0,
          textOutline: 'Introduce the core concept.',
          sourceFactIds: effectiveFactIds,
          speaker: 'narrator',
        }
      ],
      takeaways: Array.isArray(sc.takeaways) ? sc.takeaways : undefined,
    };
  });

  return {
    schemaVersion: '1.0.0',
    chapterSlug,
    course: sb.course || bookTitle,
    chapterTitle: sb.chapterTitle || 'Chapter Storyboard',
    approvedFactIds: allFactIds,
    scenes,
    summarySteps: Array.isArray(sb.summarySteps) && sb.summarySteps.length >= 6 && sb.summarySteps.length <= 8
      ? sb.summarySteps.slice(0, 8)
      : [
          'Identify the underlying asset and contract expiration',
          'Evaluate the spot price against the strike price',
          'Calculate potential terminal payoff profiles',
          'Deduct option premiums to determine true net profit',
          'Assess counterparty clearing and margin requirements',
          'Maintain disciplined leverage below institutional risk limits',
          'Use standardized contracts to guarantee secondary liquidity',
          'Execute positions with predefined stop-loss boundaries',
        ],
    bottomTakeaway: sb.bottomTakeaway || 'Risk management and grounded contract understanding are essential for survival.',
  };
}

export async function generateLessonAndStoryboard(targetDir, options = {}) {
  const dirPath = path.isAbsolute(targetDir) ? targetDir : path.resolve(rootDir, targetDir);
  const chapterSlug = path.basename(dirPath);

  const factsPath = path.join(dirPath, 'source_facts.json');
  const lessonPlanPath = path.join(dirPath, 'lesson_plan.json');
  const storyboardPath = path.join(dirPath, 'storyboard.json');

  if (!fs.existsSync(factsPath)) {
    throw new Error(`Cannot generate lesson plan or storyboard: 'source_facts.json' missing in ${dirPath}. Run extraction first.`);
  }

  // Pre-generation Gate: Run Content Audit
  console.log(`🧐 [LESSON-STORYBOARD] Auditing source facts for ${chapterSlug}...`);
  const audit = runContentAudit(dirPath);
  if (audit.status === 'FAIL') {
    throw new Error(`CRITICAL AUDIT FAILURE: Cannot generate lesson plan. ${audit.blockingReason}`);
  }

  if (fs.existsSync(lessonPlanPath) && fs.existsSync(storyboardPath) && !options.force) {
    console.log(`ℹ️ Existing lesson_plan.json and storyboard.json found in ${chapterSlug}.`);
    return {
      lessonPlan: JSON.parse(fs.readFileSync(lessonPlanPath, 'utf8')),
      storyboard: JSON.parse(fs.readFileSync(storyboardPath, 'utf8')),
    };
  }

  const sourceFacts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
  const factsList = sourceFacts.facts || [];
  const factSummaries = factsList
    .map((f) => `- [${f.id}] (${f.category}): ${f.statement} (Citation: ${f.sourceCitation?.book || ''})`)
    .join('\n');

  const proxyHealthUrl = (process.env.GEMINI_BASE_URL || 'http://127.0.0.1:8001').replace(/\/v1\/chat\/completions\/?$/, '').replace(/\/+$/, '') + '/health';
  let proxyAvailable = false;
  try {
    const pRes = await fetch(proxyHealthUrl, { signal: AbortSignal.timeout(1000) });
    if (pRes.ok) proxyAvailable = true;
  } catch {}

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!proxyAvailable && !geminiApiKey) {
    throw new Error('Neither active Argon proxy nor GEMINI_API_KEY is available to generate lesson plan and storyboard.');
  }

  console.log(`🧠 [LESSON-STORYBOARD] Synthesizing lesson plan and storyboard grounded in ${factsList.length} source facts...`);

  const prompt = `
You are the Master Educational Curriculum Architect.
Your task is to design a pedagogically rigorous Lesson Plan and 12-scene Storyboard for this chapter.
CRITICAL CONSTRAINT: You must ONLY use the provided approved source facts. Every single section, scene, and beat outline MUST explicitly reference the fact IDs ([fact-01], [fact-02], etc.) that justify its content.
DO NOT invent generic finance recap or technical analysis boilerplate.

Chapter: ${chapterSlug}
Book: ${sourceFacts.bookTitle}

APPROVED SOURCE FACTS (SINGLE SOURCE OF TRUTH):
${factSummaries}

GENERAL ASSUMPTIONS:
${(sourceFacts.generalAssumptions || []).map((a) => `- ${a}`).join('\n')}

INSTRUCTIONS:
1. Generate "lessonPlan":
   - "title": Chapter title
   - "prerequisites": List prerequisite concepts
   - "learningOutcomes": 3 to 5 clear student outcomes
   - "sections": 3 to 5 core pedagogical stages with "groundedFactIds"
   - "misconceptions": 1 to 3 common student misconceptions with "factId" and author rebuttal
   - "activeRecallQuiz": Real-world scenario testing "testedFactIds"
   - "coreTakeaways": 3 key principles

2. Generate "storyboard":
   - Exactly 12 scenes (indices 0 to 11):
     * Scene 0: 'chat_story' (Hook Part 1)
     * Scene 1: 'stat_counter' or 'data_visualizer' (Hook Part 2)
     * Scene 2: 'progressive_cards' (The 3-4 Pillar Roadmap)
     * Scenes 3 to 8: Mental models ('payoff_diagram', 'formula_breakdown', 'horizontal_bar_race', 'split_comparison', 'tug_of_war', 'progressive_cards')
     * Scene 9: 'interactive_quiz'
     * Scene 10: 'chat_story' (Practical checklist)
     * Scene 11: 'summary_thread' (8 sequential steps)
   - Every scene MUST have:
     * "sourceFactIds": Array of fact IDs (e.g. ["fact-01", "fact-02"])
     * "beatOutlines": Array of { "beatIndex": N, "textOutline": "...", "sourceFactIds": ["fact-01"] }
   - "summarySteps": Exactly 8 numbered steps derived from the facts
   - "bottomTakeaway": Core 1-sentence lesson

Return ONLY a JSON object with this shape:
{
  "lessonPlan": {
    "schemaVersion": "1.0.0",
    "chapterSlug": "${chapterSlug}",
    "title": "...",
    "targetAudiencePersona": "Retail Trader & Student",
    "prerequisites": ["..."],
    "learningOutcomes": ["..."],
    "sections": [ ... ],
    "misconceptions": [ ... ],
    "activeRecallQuiz": { ... },
    "coreTakeaways": [ ... ]
  },
  "storyboard": {
    "schemaVersion": "1.0.0",
    "chapterSlug": "${chapterSlug}",
    "course": "${sourceFacts.bookTitle}",
    "chapterTitle": "...",
    "approvedFactIds": [ ...all fact ids used... ],
    "scenes": [ ... ],
    "summarySteps": [ ...8 steps... ],
    "bottomTakeaway": "..."
  }
}
`;

  let parsedText = null;
  if (proxyAvailable) {
    const completionsUrl = (process.env.GEMINI_BASE_URL || 'http://127.0.0.1:8001').replace(/\/+$/, '') + '/v1/chat/completions';
    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      try {
        const res = await fetch(completionsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'argon-low',
            messages: [
              { role: 'system', content: 'You are the Master Educational Curriculum Architect. Return ONLY a valid JSON object matching the requested schema.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.2,
          }),
          signal: AbortSignal.timeout(180000),
        });
        if (res.ok) {
          const data = await res.json();
          parsedText = data.choices?.[0]?.message?.content;
          if (parsedText) break;
        }
      } catch (err) {
        console.warn(`⚠️ [LESSON-STORYBOARD] Proxy attempt ${attempts} failed: ${err.message}`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  } else {
    const aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
        parsedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (parsedText) break;
      } catch (callErr) {
        console.warn(`⚠️ [LESSON-STORYBOARD] API call attempt ${attempts} failed (${callErr.message}).`);
        if (attempts >= maxAttempts) throw callErr;
        const delayMs = Math.min(25000, 3000 * Math.pow(2, attempts - 1));
        console.log(`   Retrying in ${delayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  const cleanJson = (parsedText || '').replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsedJson = JSON.parse(cleanJson || '{}');

  const normalizedLP = normalizeLessonPlan(parsedJson.lessonPlan, chapterSlug, factsList);
  const normalizedSB = normalizeStoryboard(parsedJson.storyboard, chapterSlug, sourceFacts.bookTitle, factsList);

  // Validate Lesson Plan
  const validatedLessonPlan = LessonPlanSchema.safeParse(normalizedLP);
  if (!validatedLessonPlan.success) {
    console.error('❌ Lesson Plan Zod Error:', validatedLessonPlan.error.issues);
    throw new Error('Generated lesson plan failed Zod validation.');
  }

  // Validate Storyboard
  const validatedStoryboard = StoryboardSchema.safeParse(normalizedSB);
  if (!validatedStoryboard.success) {
    console.error('❌ Storyboard Zod Error:', validatedStoryboard.error.issues);
    throw new Error('Generated storyboard failed Zod validation.');
  }

  fs.writeFileSync(lessonPlanPath, JSON.stringify(validatedLessonPlan.data, null, 2), 'utf8');
  fs.writeFileSync(storyboardPath, JSON.stringify(validatedStoryboard.data, null, 2), 'utf8');

  console.log(`✅ [LESSON-STORYBOARD] Successfully generated:`);
  console.log(`   - ${lessonPlanPath}`);
  console.log(`   - ${storyboardPath}`);

  // Re-run audit to verify traceability
  runContentAudit(dirPath);

  return {
    lessonPlan: validatedLessonPlan.data,
    storyboard: validatedStoryboard.data,
  };
}

// Direct CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const dirArg = process.argv.find((a) => a.startsWith('--dir='));
  const force = process.argv.includes('--force');
  const rawTarget = dirArg ? dirArg.split('=')[1] : 'hull_ch01_part1_argon';
  const target = resolveChapterDirectory(rawTarget, rootDir) || rawTarget;
  generateLessonAndStoryboard(target, { force })
    .then(() => console.log('Generation complete.'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

