/* Concept register lookups and the first-mention clarification check (P-03). */
import type { ConceptRegister, RegisteredConcept } from "../schemas/register";
import { finding, type QaFinding } from "../qa/finding";
import { detectTerms, normalizeAcronym, wordPattern, type TermDetectorOptions } from "./term-detector";

export interface NarrationBeatRef {
  sceneId: string;
  beatId: string;
  text: string;
  newTerms?: string[];
}

const norm = (s: string) => s.trim().toLowerCase();

export function findConcept(register: ConceptRegister, term: string): RegisteredConcept | undefined {
  const t = norm(normalizeAcronym(term));
  return register.concepts.find((c) => [c.term, c.fullForm ?? "", ...c.aliases].some((n) => n && (norm(n) === t || norm(normalizeAcronym(n)) === t)));
}

const STOPWORDS = new Set(
  "the a an of to in on for and or but is are was were be been it its this that these those with as by at from your you we our they their his her what which who when how why than then so such into over under more most less much very can will would should could may might has have had do does did not no".split(
    " ",
  ),
);

export function contentWords(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

export const DEFINITION_CUES: Record<string, RegExp> = {
  en: /\b(means?|meaning|is (a|an|the|just|simply)|are (the|just|simply)|refers? to|stands? for|in other words|simply put|think of|that is|is called|we call|which is)\b/i,
  hi: /(मतलब|यानी|यानि|अर्थ|कहते हैं|कहा जाता|समझिए|सोचिए|जैसे|होता है|होती है)/u,
};

export function hasDefinitionCue(text: string, lang: string): boolean {
  const re = DEFINITION_CUES[lang.split("-")[0]] ?? DEFINITION_CUES.en;
  return re.test(text) || DEFINITION_CUES.en.test(text);
}

/** Does the text contain the expansion of an acronym (all its content words, in any order)? */
export function containsExpansion(text: string, fullForm: string): boolean {
  if (wordPattern(fullForm, "iu").test(text)) return true;
  const words = contentWords(fullForm);
  if (!words.length) return false;
  const have = new Set(contentWords(text));
  return words.every((w) => have.has(w));
}

/** Share of the plain meaning's content words present in the text. */
export function definitionOverlap(text: string, plainMeaning: string): number {
  const want = [...new Set(contentWords(plainMeaning))];
  if (!want.length) return 0;
  const have = new Set(contentWords(text));
  return want.filter((w) => have.has(w)).length / want.length;
}

/**
 * A plain-language definition is present when the text shares at least a third of the plain meaning's content
 * words, or uses a definition phrase ("means", "stands for", Hindi "यानी") with some overlap. Non-English
 * narration paraphrases an English register entry, so a definition phrase alone is enough there.
 */
export function explainsConcept(text: string, concept: Pick<RegisteredConcept, "plainMeaning">, lang: string): boolean {
  const overlap = definitionOverlap(text, concept.plainMeaning);
  if (overlap >= 0.34) return true;
  const cue = hasDefinitionCue(text, lang);
  return lang.split("-")[0] === "en" ? cue && overlap >= 0.15 : cue;
}

export interface TermCheckOptions extends TermDetectorOptions {
  lang: string;
}

/**
 * P-03: every detected term is registered; at its first mention in this part the same beat expands the
 * acronym, and the same or the next beat gives a plain-language definition.
 */
export function checkTermIntroductions(beats: NarrationBeatRef[], register: ConceptRegister, opts: TermCheckOptions): QaFinding[] {
  const out: QaFinding[] = [];
  const seen = new Set<string>();
  const isEn = opts.lang.split("-")[0] === "en";
  beats.forEach((beat, i) => {
    const terms = detectTerms(beat.text, { ...opts, newTerms: [...(opts.newTerms ?? []), ...(beat.newTerms ?? [])] });
    for (const t of terms) {
      const concept = findConcept(register, t.term);
      const key = concept ? concept.id : norm(t.term);
      if (seen.has(key)) continue;
      seen.add(key);
      const ctx = { lang: opts.lang, sceneId: beat.sceneId, beatId: beat.beatId };
      if (!concept) {
        out.push(
          finding(
            "P-03",
            "HIGH",
            `"${t.term}" (${t.kind}) is used in ${beat.beatId} but is not in the concept register`,
            "The term detector found a term the learner has not been taught.",
            `Register "${t.term}" in 03_concept_register.json and explain it at its first mention in ${beat.beatId}, or replace it with plain words.`,
            ctx,
          ),
        );
        continue;
      }
      if (concept.familiarity !== "new") continue;
      const window = `${beat.text} ${beats[i + 1]?.text ?? ""}`;
      if (concept.kind === "acronym" && concept.fullForm && !containsExpansion(beat.text, concept.fullForm)) {
        const cue = hasDefinitionCue(window, opts.lang);
        out.push(
          finding(
            "P-03",
            isEn || !cue ? "HIGH" : "MEDIUM",
            `unexplained acronym "${t.term}" in ${beat.beatId}: its expansion "${concept.fullForm}" is not said at first mention`,
            "The narration uses an abbreviation before saying what it stands for.",
            `In ${beat.beatId}, say "${t.term}, ${concept.fullForm}" and add a one-sentence plain meaning before continuing.`,
            ctx,
          ),
        );
        continue;
      }
      if (!explainsConcept(window, concept, opts.lang)) {
        out.push(
          finding(
            "P-03",
            "HIGH",
            `"${t.term}" first appears in ${beat.beatId} without a plain-language definition in that beat or the next`,
            "The narration names a new concept but does not explain it at first mention.",
            `Add one plain sentence after the first mention in ${beat.beatId}: what ${t.term} means, then what it means here.`,
            ctx,
          ),
        );
      }
    }
  });
  return out;
}

/** P-07: terms used in the quiz must be registered and introduced (said or listed in newTerms) before the quiz scene. The quiz text is in the display language, so callers pass that language's beats. */
export function checkQuizTerms(quizText: string, quizSceneIndex: number, beats: (NarrationBeatRef & { sceneIndex: number })[], register: ConceptRegister, opts: TermCheckOptions): QaFinding[] {
  const out: QaFinding[] = [];
  for (const t of detectTerms(quizText, opts)) {
    const c = findConcept(register, t.term);
    if (!c) {
      out.push(
        finding("P-07", "HIGH", `the quiz uses "${t.term}", which is not in the concept register`, "Quizzes may only test terms already taught.", `Rewrite the quiz without "${t.term}" or teach it earlier in this part.`, { lang: opts.lang }),
      );
      continue;
    }
    if (c.familiarity !== "new") continue;
    const names = [c.term, c.fullForm ?? "", ...c.aliases].filter(Boolean);
    const taughtBefore = beats.some((b) => b.sceneIndex < quizSceneIndex && names.some((n) => wordPattern(n, "iu").test(b.text) || (b.newTerms ?? []).some((x) => norm(x) === norm(n))));
    if (!taughtBefore)
      out.push(
        finding(
          "P-07",
          "HIGH",
          `the quiz tests "${t.term}" before the narration has introduced it`,
          "The quiz scene comes before the term's first explanation.",
          `Introduce "${t.term}" in a scene before the quiz, or remove it from the quiz.`,
          { lang: opts.lang },
        ),
      );
  }
  return out;
}
