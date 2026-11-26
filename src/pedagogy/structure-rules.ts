/* Structure rules for an episode: P-01, P-02, P-04, P-06, P-08, P-09, P-10 (docs/standards/SCENE_STRUCTURE.md, ASSESSMENT.md). */
import type { Episode, Scene } from "../schemas/episode";
import type { LessonPlan } from "../schemas/plan";
import type { Topology } from "../schemas/storyboard";
import type { TemplateId } from "../remotion/templates/schemas";
import { richTextToPlain } from "../core/richtext";
import { finding, type QaFinding } from "../qa/finding";
import { contentWords } from "./concept-register";
import { countWords, splitSentences } from "./narration-metrics";

export interface NextPartInfo {
  chapterId: string;
  partId: string;
  chapterNumber: number;
  chapterTitle: string;
  partTitle: string;
  summary?: string;
  sections: string[];
}

const stem = (w: string) => w.replace(/(ing|ed|es|s)$/u, "");
const SUMMARY_GENERIC = new Set(["rule", "rules", "number", "numbers", "principle", "principles", "pillar", "pillars"]);

function meaningfulStems(text: string): string[] {
  return [...new Set(contentWords(text).map(stem).filter((w) => w.length >= 3 && !SUMMARY_GENERIC.has(w)))];
}

function scenePlainStrings(scene: Scene): string[] {
  const out: string[] = [scene.title, ...scene.takeaways];
  const walk = (v: unknown) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if ("type" in o && "text" in o) out.push(richTextToPlain(v as never));
      else for (const [k, x] of Object.entries(o)) if (k !== "id" && k !== "template" && k !== "latex") walk(x);
    }
  };
  walk(scene.data);
  return out.filter(Boolean);
}

/** D.5 spoiler regex. */
export const SPOILER_RE = /\((?:correct|answer|true|right|उचित|सही|उत्तर)\)/i;

const DEFINITION_FIRST: RegExp[] = [
  /\bis defined as\b/i,
  /\bcan be defined as\b/i,
  /\brefers to\b/i,
  /\bis known as\b/i,
  /^(the )?(definition|term) (of|for)\b/i,
  /^[A-Z][\w-]*(?: [\w-]+){0,3} (?:is|are|means) (?:a|an|the) /,
  /की परिभाषा|को कहते हैं|का अर्थ है/u,
];

export function isDefinitionFirst(text: string): boolean {
  const first = splitSentences(text)[0] ?? "";
  if (/[?？]\s*$/.test(first)) return false;
  return DEFINITION_FIRST.some((re) => re.test(first.trim()));
}

function narrationOf(scene: Scene, lang: string): string[] {
  return scene.beats.map((b) => b.narration[lang]?.display ?? "");
}

function templatesOf(scene: Scene): TemplateId[] {
  if (scene.template === "composite_layout") return ["composite_layout", ...scene.data.panels.map((p) => p.template as TemplateId)];
  return [scene.template];
}

function panelData<T>(scene: Scene, template: TemplateId): T | undefined {
  if (scene.template === template) return scene.data as T;
  if (scene.template === "composite_layout") return scene.data.panels.find((p) => p.template === template)?.data as T | undefined;
  return undefined;
}

/** P-01: scene 0 is a 4-beat problem-first hook (novice asks, mentor sets the situation, trap, invention); no definition-first opening. */
export function checkHook(ep: Episode): QaFinding[] {
  const out: QaFinding[] = [];
  const s0 = ep.scenes.find((s) => s.index === 0);
  if (!s0) return [finding("P-01", "HIGH", "scene 0 is missing", "Every part opens with a hook scene.", "Add a 4-beat problem-first hook as scene 0.")];
  const ctx = { sceneId: s0.id };
  if (s0.beats.length !== 4) out.push(finding("P-01", "HIGH", `scene 0 has ${s0.beats.length} beats, expected 4`, "The hook has a fixed 4-beat order.", "Rewrite scene 0 as: novice asks, mentor sets the situation, the trap, the invention.", ctx));
  const [b1, b2] = s0.beats;
  if (b1 && b1.speaker !== "novice") out.push(finding("P-01", "HIGH", `scene 0 beat 1 is spoken by ${b1.speaker}, expected the novice`, "The hook opens with a learner's real question.", "Make beat 1 a novice question about a concrete struggle.", { ...ctx, beatId: b1.id }));
  if (b2 && b2.speaker !== "mentor") out.push(finding("P-01", "HIGH", `scene 0 beat 2 is spoken by ${b2.speaker}, expected the mentor`, "The mentor sets the situation in beat 2.", "Make beat 2 the mentor's concrete situation with actors and stakes.", { ...ctx, beatId: b2.id }));
  for (const lang of ep.languages) {
    const first = b1?.narration[lang]?.display ?? "";
    if (b1 && !/[?？]/.test(first)) out.push(finding("P-01", "MEDIUM", `scene 0 beat 1 (${lang}) asks no question`, "The hook should start from the learner's question.", "Phrase beat 1 as the novice's question.", { ...ctx, beatId: b1.id, lang }));
    if (b1 && isDefinitionFirst(first)) out.push(finding("P-01", "HIGH", `scene 0 opens with a definition (${lang}): "${first.slice(0, 80)}"`, "Definition-first openings lose beginners.", "Open with a concrete problem: who, where, what is at stake.", { ...ctx, beatId: b1.id, lang }));
  }
  return out;
}

/** P-02: every core concept maps all 8 stages to existing scenes, in teaching order. */
export function checkProgression(ep: Episode, plan: LessonPlan): QaFinding[] {
  const out: QaFinding[] = [];
  const indexes = new Set(ep.scenes.map((s) => s.index));
  const order = ["intuition", "why", "what", "how", "workedExample", "guided", "independent"] as const;
  for (const c of plan.coreConcepts) {
    for (const [stage, ref] of Object.entries(c.stages)) {
      if (!indexes.has(ref.sceneIndex))
        out.push(finding("P-02", "HIGH", `concept "${c.term}" stage ${stage} points to missing scene ${ref.sceneIndex}`, "The 8-stage progression must map to real scenes.", `Map ${stage} for "${c.term}" to a scene that teaches it.`));
    }
    for (let i = 1; i < order.length; i++) {
      const prev = c.stages[order[i - 1]].sceneIndex;
      const cur = c.stages[order[i]].sceneIndex;
      if (cur < prev)
        out.push(finding("P-02", "MEDIUM", `concept "${c.term}": ${order[i]} (scene ${cur}) comes before ${order[i - 1]} (scene ${prev})`, "The progression runs intuition to independent application in order.", "Reorder the scenes or the stage mapping."));
    }
    const quiz = ep.scenes.find((s) => s.index === c.stages.independent.sceneIndex);
    if (quiz && quiz.template !== "interactive_quiz")
      out.push(finding("P-02", "MEDIUM", `concept "${c.term}": independent application maps to scene ${quiz.index} (${quiz.template}), not the quiz`, "Independent application is the quiz.", "Map the independent stage to the quiz scene."));
  }
  return out;
}

/** P-04: causal chain card, prediction question, guided application before the quiz, misconception vs reality, roadmaps in scenes 0 and 10, and forward bridge to next part/chapter. */
export function checkRequiredElements(ep: Episode, plan?: LessonPlan, nextPart?: NextPartInfo | null): QaFinding[] {
  const out: QaFinding[] = [];
  const chain = ep.scenes.map((s) => panelData<{ links: { role: string }[] }>(s, "causal_chain")).find(Boolean);
  if (!chain) out.push(finding("P-04", "HIGH", "no causal chain card", "Every part shows Condition -> Action -> Mechanism -> Result -> Consequence.", "Add a causal_chain scene built from the plan's causal chain."));
  else {
    const roles = new Set(chain.links.map((l) => l.role));
    const missing = ["condition", "action", "mechanism", "result", "consequence"].filter((r) => !roles.has(r));
    if (missing.length) out.push(finding("P-04", "HIGH", `causal chain card is missing ${missing.join(", ")}`, "The chain needs all five links.", "Fill every link of the causal chain."));
  }
  const quizIdx = ep.scenes.find((s) => s.template === "interactive_quiz")?.index;
  for (const lang of ep.languages) {
    const predictionScenes = plan?.predictionQuestions.map((q) => q.sceneIndex) ?? ep.scenes.filter((s) => quizIdx === undefined || s.index < quizIdx).map((s) => s.index);
    const hasPrediction = ep.scenes.some((s) => predictionScenes.includes(s.index) && s.template !== "interactive_quiz" && narrationOf(s, lang).some((t) => /[?？]/.test(t)));
    if (!hasPrediction) out.push(finding("P-04", "HIGH", `no prediction question before a reveal (${lang})`, "Learners predict before they are told.", "Have the mentor or novice ask the learner to predict an outcome before revealing it.", { lang }));
  }
  if (plan && quizIdx !== undefined) {
    for (const c of plan.coreConcepts)
      if (c.stages.guided.sceneIndex >= quizIdx)
        out.push(finding("P-04", "HIGH", `guided application for "${c.term}" is not before the quiz`, "Guided practice comes before independent practice.", "Move the guided application to a scene before the quiz."));
  }
  const hasTrap = ep.scenes.some((s) => {
    const sc = panelData<{ left: { tone: string }; right: { tone: string } }>(s, "split_comparison");
    return !!sc && (sc.left.tone === "trap" || sc.right.tone === "trap");
  });
  if (!hasTrap) out.push(finding("P-04", "HIGH", "no misconception vs reality split", "Every part contrasts the common novice trap with professional reality.", "Add a split_comparison with a trap side and a positive side (scene 6 or 10)."));
  for (const idx of [0, 10]) {
    const s = ep.scenes.find((x) => x.index === idx);
    if (!s) continue;
    const ok = s.template === "roadmap" || templatesOf(s).includes("roadmap") || ((s.template === "chat_story" || s.template === "technical_panel") && !!s.data.whereWeAre);
    if (!ok) out.push(finding("P-04", "HIGH", `scene ${idx} has no "where we are" roadmap`, "Scenes 0 and 10 position the part in the course.", `Add whereWeAre to scene ${idx}.`, { sceneId: s.id }));
  }
  if (ep.kind === "chapter_part" && nextPart !== null) {
    const s10 = ep.scenes.find((x) => x.index === 10);
    if (s10) {
      const nextChRe = nextPart ? new RegExp(`\\b(?:chapter|ch)\\s*0?${nextPart.chapterNumber}\\b`, "i") : /\bchapter\s*\d+\b/i;
      const hasBridgeEn = new RegExp(
        `\\b(next|upcoming|ahead|part\\s*(?:2|two|ii)|will\\s+(?:explore|learn|cover|derive|master|examine|build|study|apply|develop|analyze)|bridg(?:e|ing)\\s+to|advancing\\s+(?:next|to))\\b|${nextChRe.source}`,
        "i",
      );
      const hasBridgeHi = /(अगले|आगे|भाग\s*[2२]|पार्ट\s*(?:2|टू|दो)|चैप्टर\s*\d+|सीखेंगे|पढ़ेंगे|समझेंगे|लागू करेंगे|अध्ययन करेंगे|तैयार|मास्टर करेंगे)/u;
      for (const lang of ep.languages) {
        const s10Text = narrationOf(s10, lang).join(" ");
        const baseLang = lang.split("-")[0];
        const ok = baseLang === "hi" ? hasBridgeHi.test(s10Text) || hasBridgeEn.test(s10Text) : hasBridgeEn.test(s10Text);
        if (!ok) {
          out.push(
            finding(
              "P-04",
              "HIGH",
              `scene 10 (${lang}) has no forward link explaining what the learner will understand next`,
              "Scene 10 must connect this part to what comes next in the course.",
              nextPart
                ? `Add a forward bridge in scene 10 (${lang}) explaining what comes next in Chapter ${nextPart.chapterNumber} ${nextPart.partId.toUpperCase()} (${nextPart.partTitle}).`
                : `Add a forward bridge in scene 10 (${lang}) naming the next part or chapter and its key topics.`,
              { sceneId: s10.id, lang },
            ),
          );
        }
      }
      if (nextPart) {
        const displayLang = ep.languages.includes(ep.displayLanguage) ? ep.displayLanguage : ep.languages[0];
        const bridgeBeatText = s10.beats.slice(-1)[0]?.narration[displayLang]?.display ?? "";
        const screenText = scenePlainStrings(s10).join(" ");
        const topicStems = meaningfulStems(`${nextPart.chapterTitle} ${nextPart.partTitle} ${nextPart.summary ?? ""}`).filter(
          (w) => !["part", "chapter", "method", "theories", "strategy", "strategies", "mechanics", "principles", "basic", "rate", "rates"].includes(w),
        );
        const bridgeStems = new Set(meaningfulStems(bridgeBeatText));
        const screenStems = new Set(meaningfulStems(screenText));
        const nextNumHit = nextChRe.test(bridgeBeatText) || (nextPart.chapterId === ep.chapterId && /\bpart\s*(?:2|two|ii)\b/i.test(bridgeBeatText));
        const topicMatch = topicStems.length === 0 || (topicStems.some((w) => bridgeStems.has(w)) && (topicStems.some((w) => screenStems.has(w)) || nextNumHit));
        if (!topicMatch) {
          out.push(
            finding(
              "P-04",
              "HIGH",
              `scene 10 does not describe what comes next (${nextPart.chapterId}/${nextPart.partId}: "${nextPart.partTitle}")`,
              "The forward bridge in scene 10 must name concrete topics from the upcoming part/chapter.",
              `In scene 10's final beat and on-screen roadmap, explicitly preview Chapter ${nextPart.chapterNumber} ${nextPart.partId.toUpperCase()}: ${nextPart.partTitle}.`,
              { sceneId: s10.id },
            ),
          );
        }
      }
      if (s10.template === "roadmap") {
        if (!s10.data.items.some((it) => it.status === "next"))
          out.push(finding("P-04", "HIGH", "scene 10 roadmap has no upcoming 'next' item", "The roadmap must show what the learner will study next.", "Add a status: \"next\" item for the upcoming part or chapter.", { sceneId: s10.id }));
      } else if ((s10.template === "chat_story" || s10.template === "technical_panel") && s10.data.whereWeAre) {
        const w = s10.data.whereWeAre;
        if (w.current >= w.items.length - 1)
          out.push(finding("P-04", "HIGH", "scene 10 whereWeAre roadmap shows no upcoming step after current", "The WHERE WE ARE panel must show the next part or chapter after the current item.", "Add the upcoming part/chapter to whereWeAre.items and keep current before the last item.", { sceneId: s10.id }));
      }
    }
  }
  return out;
}

/** P-06 quiz structure and P-09 spoilers. */
export function checkQuiz(ep: Episode): QaFinding[] {
  const out: QaFinding[] = [];
  const quizzes = ep.scenes.filter((s) => s.template === "interactive_quiz");
  if (!quizzes.length) return [finding("P-06", "HIGH", "no quiz scene", "Every part has independent application with a thinking pause.", "Add an interactive_quiz scene with 3 beats.")];
  for (const s of quizzes) {
    if (s.template !== "interactive_quiz") continue;
    const ctx = { sceneId: s.id };
    const d = s.data;
    if (s.beats.length !== 3) out.push(finding("P-06", "HIGH", `quiz has ${s.beats.length} beats, expected 3`, "Question, thinking pause, reveal.", "Use exactly 3 beats: question, thinking, reveal.", ctx));
    const phases = s.beats.map((b) => b.visual.phase);
    if (phases.join(",") !== "question,thinking,reveal") out.push(finding("P-06", "HIGH", `quiz beat phases are [${phases.join(", ")}]`, "Beats must run question, thinking, reveal.", "Set visual.phase on the three beats in order.", ctx));
    if (countWords(d.question) < 18) out.push(finding("P-06", "HIGH", `quiz scenario has ${countWords(d.question)} words (min 18)`, "The quiz needs a real scenario, not a recall question.", "Write a scenario of at least 18 words.", ctx));
    const distinct = new Set(d.options.map((o) => o.trim().toLowerCase().replace(/^[a-d][).:]\s*/, "")));
    if (d.options.length !== 4 || distinct.size !== 4) out.push(finding("P-06", "HIGH", "quiz options are not 4 distinct options", "Learners need four plausible, different options.", "Write four distinct options.", ctx));
    if (d.correctIndex < 0 || d.correctIndex > 3) out.push(finding("P-06", "BLOCKER", `correctIndex ${d.correctIndex} out of range`, "The answer must be one of A-D.", "Set correctIndex to 0-3.", ctx));
    const thinking = s.beats.find((b) => b.visual.phase === "thinking") ?? s.beats[1];
    if (thinking && thinking.pauseAfterMs < 3000) out.push(finding("P-06", "HIGH", `thinking pause is ${thinking.pauseAfterMs} ms (min 3000)`, "Learners need time to think.", "Set pauseAfterMs >= 3200 on the thinking beat.", { ...ctx, beatId: thinking.id }));
    if (!d.explanation.trim()) out.push(finding("P-06", "HIGH", "quiz reveal has no explanation", "The reveal explains why.", "Add the explanation.", ctx));
    d.options.forEach((o, i) => {
      if (SPOILER_RE.test(o)) out.push(finding("P-09", "BLOCKER", `quiz option ${"ABCD"[i]} contains a spoiler marker: "${o}"`, "The answer is shown in the option text.", "Remove the marker; the answer is identified only by correctIndex.", ctx));
    });
    for (const b of s.beats.filter((x) => x.visual.phase !== "reveal"))
      for (const [lang, n] of Object.entries(b.narration))
        if (SPOILER_RE.test(n.display)) out.push(finding("P-09", "BLOCKER", `quiz narration gives away the answer: "${n.display.slice(0, 80)}"`, "Spoiler marker before the reveal.", "Remove the spoiler marker from the narration.", { ...ctx, beatId: b.id, lang }));
  }
  return out;
}

const NUMBER_WORDS: Record<string, string[][]> = {
  en: [["zero"], ["one", "first"], ["two", "second"], ["three", "third"], ["four", "fourth"], ["five", "fifth"], ["six", "sixth"], ["seven", "seventh"], ["eight", "eighth"]],
  hi: [["शून्य"], ["एक", "पहला", "पहले", "पहली"], ["दो", "दूसरा", "दूसरे", "दूसरी"], ["तीन", "तीसरा", "तीसरे", "तीसरी"], ["चार", "चौथा", "चौथे", "चौथी"], ["पांच", "पाँच", "पांचवां", "पाँचवाँ", "पांचवें", "पाँचवें"], ["छह", "छः", "छठा", "छठे"], ["सात", "सातवां", "सातवाँ", "सातवें"], ["आठ", "आठवां", "आठवाँ", "आठवें"]],
};
const DEV = "०१२३४५६७८९";

export function mentionsNumber(text: string, n: number, lang: string): boolean {
  if (new RegExp(`(^|[^\\d])(${n}|${DEV[n]})(?!\\d)`).test(text)) return true;
  const words = [...(NUMBER_WORDS[lang.split("-")[0]]?.[n] ?? []), ...(NUMBER_WORDS.en[n] ?? [])];
  return words.some((w) => new RegExp(`(?<![\\p{L}\\p{M}])${w}(?![\\p{L}\\p{M}])`, "iu").test(text));
}

const SUMMARY_RANGES: [number, number][] = [
  [0, 0],
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [1, 8],
];

/** P-08: 8 rules of at most 30 words, 6 beats with the fixed ranges, narration names the rules shown, per-rule narration alignment, and taught-in-part grounding. */
export function checkSummary(ep: Episode): QaFinding[] {
  const out: QaFinding[] = [];
  const s = ep.scenes.find((x) => x.template === "summary_thread");
  if (!s || s.template !== "summary_thread") return [finding("P-08", "HIGH", "no summary_thread scene", "Every part ends with 8 rules.", "Add the summary scene.")];
  const ctx = { sceneId: s.id };
  if (s.data.rules.length !== 8) out.push(finding("P-08", "HIGH", `summary has ${s.data.rules.length} rules, expected 8`, "Exactly 8 rules.", "Write exactly 8 rules.", ctx));
  s.data.rules.forEach((r, i) => {
    const n = countWords(r.text);
    if (n > 30) out.push(finding("P-08", "MEDIUM", `rule ${i + 1} has ${n} words (max 30)`, "Rules must be short enough to read in a glance.", `Shorten rule ${i + 1}.`, ctx));
  });
  if (s.beats.length !== 6) out.push(finding("P-08", "HIGH", `summary has ${s.beats.length} beats, expected 6`, "Ranges [0,0],[1,2],[3,4],[5,6],[7,8],[1,8].", "Use the six fixed summary beats.", ctx));
  const displayLang = ep.languages.includes(ep.displayLanguage) ? ep.displayLanguage : ep.languages[0];
  const quizIdx = ep.scenes.find((x) => x.template === "interactive_quiz")?.index ?? s.index;
  const taughtCoreText = ep.scenes
    .filter((x) => x.index <= quizIdx)
    .map((x) => `${narrationOf(x, displayLang).join(" ")} ${scenePlainStrings(x).join(" ")}`)
    .join(" ");
  const taughtCoreStems = new Set(meaningfulStems(taughtCoreText));
  const s10 = ep.scenes.find((x) => x.index === 10 && x.index < s.index);
  const bridgeRegex = /\b(next\s+chapter|part\s*2|part\s*two|bridge\s+to|preview|will\s+(?:develop|explore|learn|cover|master|apply))\b/i;
  const s10BridgeText = s10
    ? s10.beats
        .filter((b) => bridgeRegex.test(b.narration[displayLang]?.display ?? "") || bridgeRegex.test(b.onScreenIntent))
        .map((b) => b.narration[displayLang]?.display ?? "")
        .join(" ")
    : "";
  const s10BridgeStems = new Set(meaningfulStems(s10BridgeText));
  const s10SynthText = s10
    ? s10.beats
        .filter((b) => !bridgeRegex.test(b.narration[displayLang]?.display ?? "") && !bridgeRegex.test(b.onScreenIntent))
        .map((b) => b.narration[displayLang]?.display ?? "")
        .join(" ")
    : "";
  const taughtAllStems = new Set([...taughtCoreStems, ...meaningfulStems(s10SynthText)]);

  s.beats.forEach((b, i) => {
    const want = SUMMARY_RANGES[i];
    if (!want) return;
    const got = b.visual.range;
    if (!got || got[0] !== want[0] || got[1] !== want[1]) out.push(finding("P-08", "HIGH", `${b.id} shows range ${got ? `[${got.join(",")}]` : "none"}, expected [${want.join(",")}]`, "Summary beats reveal fixed rule ranges.", `Set visual.range to [${want.join(",")}] on ${b.id}.`, { ...ctx, beatId: b.id }));
    if (i === 5 && !b.visual.compact) out.push(finding("P-08", "MEDIUM", `${b.id} should be the compact overview`, "The last summary beat is a compact 2-column overview.", `Set visual.compact on ${b.id}.`, { ...ctx, beatId: b.id }));
    if (want[0] === 0) return;
    for (const [lang, n] of Object.entries(b.narration)) {
      const need = i === 5 ? [8] : want;
      const missing = need.filter((k) => !mentionsNumber(n.display, k, lang));
      if (missing.length) out.push(finding("P-08", "HIGH", `${b.id} (${lang}) does not name rule ${missing.join(" and ")}`, "Narration must name the rule numbers shown.", `Say "rule ${missing.join(" and ")}" in ${b.id}.`, { ...ctx, beatId: b.id, lang }));
    }
    if (i >= 1 && i <= 4) {
      const beatStems = new Set(meaningfulStems(b.narration[displayLang]?.display ?? ""));
      for (let k = want[0]; k <= want[1]; k++) {
        const rule = s.data.rules[k - 1];
        if (!rule) continue;
        const ruleStems = meaningfulStems(`${rule.title} ${rule.text}`);
        const hits = ruleStems.filter((w) => beatStems.has(w)).length;
        if (ruleStems.length >= 3 && (hits < 2 || hits / ruleStems.length < 0.25)) {
          out.push(
            finding(
              "P-08",
              "HIGH",
              `summary rule ${k} ("${rule.title}") does not match what ${b.id} narrates`,
              "Each summary rule shown on screen must match the rule spoken in that beat.",
              `Align rule ${k} on screen with ${b.id}'s narration (1-to-1 rule numbering).`,
              { ...ctx, beatId: b.id, lang: displayLang },
            ),
          );
        }
      }
    }
  });

  s.data.rules.forEach((rule, idx) => {
    const k = idx + 1;
    const ruleStems = meaningfulStems(`${rule.title} ${rule.text}`);
    const taughtHits = ruleStems.filter((w) => taughtAllStems.has(w)).length;
    const bridgeOnly = ruleStems.filter((w) => !taughtCoreStems.has(w) && s10BridgeStems.has(w));
    if (ruleStems.length >= 4 && (taughtHits / ruleStems.length < 0.55 || bridgeOnly.length >= 2)) {
      out.push(
        finding(
          "P-08",
          "HIGH",
          `summary rule ${k} ("${rule.title}") covers material not taught in this part${bridgeOnly.length >= 2 ? ` (only in next-part preview: ${bridgeOnly.slice(0, 3).join(", ")})` : ""}`,
          "Summary rules must recap only concepts taught in this video, never upcoming preview topics.",
          `Rewrite rule ${k} to summarize a concept taught in scenes 0-${quizIdx} of this part.`,
          ctx,
        ),
      );
    }
  });
  return out;
}

/** Template fit by concept topology (E.3). Topologies not listed accept any template. */
export const TOPOLOGY_TEMPLATES: Partial<Record<Topology, TemplateId[]>> = {
  process: ["causal_chain", "diagram_flow", "progressive_cards", "composite_layout"],
  comparison: ["split_comparison", "table_compare", "tug_of_war", "composite_layout"],
  quantity_over_time: ["data_chart", "stat_counter", "composite_layout"],
  formula: ["formula_breakdown", "worked_example", "composite_layout"],
  worked_example: ["worked_example", "formula_breakdown", "composite_layout"],
  timeline: ["diagram_flow", "roadmap"],
  quiz: ["interactive_quiz"],
  summary: ["summary_thread"],
  statistic: ["stat_counter", "data_chart", "composite_layout"],
  table: ["table_compare"],
};

export interface DiversityScene {
  index: number;
  template: TemplateId;
  pedagogicalContinuation?: boolean;
  topology?: Topology;
}

/** P-10 diversity rules. */
export function checkDiversity(scenes: DiversityScene[]): QaFinding[] {
  const out: QaFinding[] = [];
  const sorted = [...scenes].sort((a, b) => a.index - b.index);
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1];
    const b = sorted[i];
    if (a.template === b.template && !b.pedagogicalContinuation)
      out.push(finding("P-10", "HIGH", `scenes ${a.index} and ${b.index} both use ${b.template}`, "Adjacent scenes need different templates unless one continues the other.", `Pick a different template for scene ${b.index} or mark pedagogicalContinuation with a reason.`));
  }
  const counts = new Map<string, number>();
  for (const s of sorted) counts.set(s.template, (counts.get(s.template) ?? 0) + 1);
  for (const [t, n] of counts)
    if (n / sorted.length > 0.3 && n > 1) out.push(finding("P-10", "HIGH", `${t} is used in ${n} of ${sorted.length} scenes (max 30%)`, "One template dominates the part.", `Replace some ${t} scenes with templates that fit their topology.`));
  if (counts.size < 5) out.push(finding("P-10", "HIGH", `only ${counts.size} distinct templates (min 5)`, "The part looks repetitive.", "Use at least 5 distinct templates chosen by concept topology."));
  for (const s of sorted) {
    const allowed = s.topology ? TOPOLOGY_TEMPLATES[s.topology] : undefined;
    if (allowed && !allowed.includes(s.template))
      out.push(finding("P-10", "MEDIUM", `scene ${s.index} has topology ${s.topology} but uses ${s.template}`, "Template choice must follow the concept topology.", `Use one of ${allowed.join(", ")} for scene ${s.index}.`));
  }
  return out;
}

export function diversityScenesFromEpisode(ep: Episode, topologies: Partial<Record<number, Topology>> = {}): DiversityScene[] {
  return ep.scenes.map((s) => ({ index: s.index, template: s.template, pedagogicalContinuation: s.pedagogicalContinuation, topology: topologies[s.index] }));
}
