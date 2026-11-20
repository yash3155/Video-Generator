/* Narration craft metrics (check P-05, docs/standards/NARRATION_CRAFT.md). */
import { finding, type QaFinding } from "../qa/finding";

export const BANNED_FILLERS = [
  "as we all know",
  "it goes without saying",
  "needless to say",
  "in today's world",
  "let's dive in",
  "without further ado",
  "at the end of the day",
];

/** Maximum Flesch-Kincaid grade per audience (English narration only). */
export const AUDIENCE_MAX_GRADE: Record<string, number> = { absolute_beginner: 9, intermediate: 12, advanced: 16 };

export const SENTENCE_LIMITS = { avgMin: 8, avgMax: 22, max: 35 };
export const BEAT_WORD_BUDGET = { min: 25, max: 75 };

/** Hindi spells grammar with separate words (postpositions, auxiliaries), so its beats run longer for the same content. */
export const BUDGET_FACTOR: Record<string, number> = { hi: 1.3 };

const ABBREVIATIONS = /\b(e\.g|i\.e|etc|vs|Mr|Mrs|Ms|Dr|Prof|St|No|approx|U\.S|U\.K)\.$/i;

export function splitSentences(text: string): string[] {
  const parts: string[] = [];
  let buf = "";
  const s = text.replace(/\s+/g, " ").trim();
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    buf += c;
    if (!".!?।॥".includes(c)) continue;
    const next = s[i + 1];
    if (c === "." && next !== undefined && /\d/.test(s[i - 1] ?? "") && /\d/.test(next)) continue;
    if (c === "." && ABBREVIATIONS.test(buf)) continue;
    if (next === undefined || next === " " || next === '"' || next === "'" || next === ")") {
      while (i + 1 < s.length && /["')\s]/.test(s[i + 1]) && s[i + 1] !== " ") buf += s[++i];
      if (buf.trim()) parts.push(buf.trim());
      buf = "";
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

export function countWords(text: string): number {
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’.,%-]*/gu) ?? []).length;
}

export function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Flesch-Kincaid grade level (English). */
export function fleschKincaidGrade(text: string): number {
  const sentences = splitSentences(text);
  const words = text.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  if (!sentences.length || !words.length) return 0;
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  return 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;
}

export interface NarrationMetrics {
  words: number;
  sentences: number;
  avgSentenceWords: number;
  maxSentenceWords: number;
  longestSentence: string;
  grade?: number;
  fillers: string[];
}

export function narrationMetrics(text: string, lang: string): NarrationMetrics {
  const sentences = splitSentences(text);
  const lens = sentences.map(countWords);
  const maxIdx = lens.reduce((best, n, i) => (n > lens[best] ? i : best), 0);
  const lower = text.toLowerCase().replace(/’/g, "'");
  return {
    words: countWords(text),
    sentences: sentences.length,
    avgSentenceWords: lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0,
    maxSentenceWords: lens.length ? lens[maxIdx] : 0,
    longestSentence: sentences[maxIdx] ?? "",
    grade: lang.split("-")[0] === "en" ? fleschKincaidGrade(text) : undefined,
    fillers: BANNED_FILLERS.filter((f) => lower.includes(f)),
  };
}

export interface CraftBeat {
  sceneId: string;
  beatId: string;
  text: string;
  /** Transition beats and the quiz thinking beat are short by design. */
  exemptBudget?: boolean;
}

export interface CraftOptions {
  lang: string;
  audience?: string;
}

export function checkNarrationCraft(beats: CraftBeat[], opts: CraftOptions): QaFinding[] {
  const out: QaFinding[] = [];
  const lang = opts.lang;
  const factor = BUDGET_FACTOR[lang.split("-")[0]] ?? 1;
  const maxWords = Math.round(BEAT_WORD_BUDGET.max * factor);
  const maxSentence = Math.round(SENTENCE_LIMITS.max * factor);
  for (const b of beats) {
    const m = narrationMetrics(b.text, lang);
    const ctx = { lang, sceneId: b.sceneId, beatId: b.beatId };
    if (m.maxSentenceWords > maxSentence)
      out.push(
        finding(
          "P-05",
          "HIGH",
          `${b.beatId}: sentence of ${m.maxSentenceWords} words (max ${maxSentence}): "${m.longestSentence.slice(0, 120)}"`,
          "Long sentences are hard to follow by ear.",
          `Split the sentence in ${b.beatId} into two or three sentences with one idea each.`,
          ctx,
        ),
      );
    if (!b.exemptBudget && m.words > maxWords)
      out.push(finding("P-05", "HIGH", `${b.beatId}: ${m.words} words (budget ${BEAT_WORD_BUDGET.min}-${maxWords})`, "The beat is too long to pair with one visual state.", `Split ${b.beatId} into two beats.`, ctx));
    if (!b.exemptBudget && m.words < BEAT_WORD_BUDGET.min)
      out.push(finding("P-05", "MEDIUM", `${b.beatId}: only ${m.words} words (budget ${BEAT_WORD_BUDGET.min}-${maxWords})`, "The beat is too short to teach anything.", `Merge ${b.beatId} with a neighbour or add the missing explanation.`, ctx));
    for (const f of m.fillers) out.push(finding("P-05", "MEDIUM", `${b.beatId}: banned filler "${f}"`, "Filler phrases waste the learner's attention.", `Remove "${f}" from ${b.beatId}.`, ctx));
  }
  const all = beats.map((b) => b.text).join(" ");
  const m = narrationMetrics(all, lang);
  if (m.sentences >= 3 && (m.avgSentenceWords < SENTENCE_LIMITS.avgMin || m.avgSentenceWords > SENTENCE_LIMITS.avgMax * factor))
    out.push(
      finding(
        "P-05",
        "MEDIUM",
        `average sentence length ${m.avgSentenceWords.toFixed(1)} words (target ${SENTENCE_LIMITS.avgMin}-${Math.round(SENTENCE_LIMITS.avgMax * factor)})`,
        m.avgSentenceWords < SENTENCE_LIMITS.avgMin ? "Very short sentences sound choppy." : "Long average sentences make the narration dense.",
        "Rewrite the narration with one idea per sentence of 8 to 22 words.",
        { lang },
      ),
    );
  const maxGrade = AUDIENCE_MAX_GRADE[opts.audience ?? "absolute_beginner"];
  if (m.grade !== undefined && maxGrade !== undefined && m.grade > maxGrade)
    out.push(
      finding(
        "P-05",
        "MEDIUM",
        `readability grade ${m.grade.toFixed(1)} is above the ${opts.audience ?? "absolute_beginner"} target of ${maxGrade}`,
        "Too many long words and sentences for the audience.",
        "Use shorter words and sentences; explain jargon in plain language.",
        { lang },
      ),
    );
  return out;
}
