/* Loads the canonical good part (tests/fixtures/good/demo-ch01-p1) and runs every Phase 4 engine over it. */
import fs from "node:fs";
import path from "node:path";
import { Episode } from "../../src/schemas/episode";
import { SourceFacts } from "../../src/schemas/facts";
import { ConceptRegister } from "../../src/schemas/register";
import { LessonPlan } from "../../src/schemas/plan";
import type { QaFinding } from "../../src/qa/finding";
import { mathIssuesToFindings, scanMathText } from "../../src/math/latex-sanitize";
import { checkKatex } from "../../src/math/katex-compile";
import { checkSixWayEpisode, factNumbers } from "../../src/math/six-way";
import { checkQuizTerms, checkTermIntroductions } from "../../src/pedagogy/concept-register";
import { checkNarrationCraft } from "../../src/pedagogy/narration-metrics";
import * as S from "../../src/pedagogy/structure-rules";

export const GOOD_DIR = path.join(__dirname, "..", "fixtures", "good", "demo-ch01-p1");
export const readGood = (file: string): unknown => JSON.parse(fs.readFileSync(path.join(GOOD_DIR, file), "utf8"));

export const goodFacts = SourceFacts.parse(readGood("source_facts.json"));
export const goodRegister = ConceptRegister.parse(readGood("concept_register.json"));
export const goodPlan = LessonPlan.parse(readGood("lesson_plan.json"));

/** A fresh, mutable copy of the raw good episode JSON. */
export const rawEpisode = (): { scenes: { id: string; template: string; data: Record<string, unknown>; beats: { id: string; narration: Record<string, { display: string; spoken?: string }> }[] }[] } & Record<string, unknown> =>
  structuredClone(readGood("episode.json")) as never;

export function beatsOf(ep: Episode, lang = "en") {
  return ep.scenes.flatMap((s) =>
    s.beats.map((b) => ({
      sceneId: s.id,
      sceneIndex: s.index,
      beatId: b.id,
      text: b.narration[lang]?.display ?? "",
      newTerms: b.newTerms,
      exemptBudget: b.transition || b.visual.phase === "thinking",
    })),
  );
}

export function termOptions(register = goodRegister, lang = "en") {
  return {
    lang,
    glossary: register.concepts.filter((c) => c.kind !== "symbol").flatMap((c) => [c.term, ...c.aliases]),
    symbols: register.concepts.filter((c) => c.kind === "symbol").map((c) => c.term),
  };
}

export function runAllChecks(epJson: unknown, lang = "en"): QaFinding[] {
  const ep = Episode.parse(epJson);
  const out: QaFinding[] = [];
  for (const s of ep.scenes) {
    out.push(...mathIssuesToFindings(scanMathText({ title: s.title, takeaways: s.takeaways, data: s.data }, s.id, { onScreen: true }), { sceneId: s.id }));
    out.push(...checkKatex(s.data, s.id, { sceneId: s.id }));
    for (const b of s.beats) out.push(...mathIssuesToFindings(scanMathText(b.narration, b.id), { sceneId: s.id, beatId: b.id }));
  }
  out.push(...checkSixWayEpisode(ep, { knownNumbers: factNumbers(goodFacts) }));
  const beats = beatsOf(ep, lang);
  const opts = termOptions(goodRegister, lang);
  out.push(...checkTermIntroductions(beats, goodRegister, opts));
  const quiz = ep.scenes.find((s) => s.template === "interactive_quiz");
  if (quiz) {
    const q = quiz.data as { question: string; options: string[]; explanation: string };
    out.push(...checkQuizTerms([q.question, ...q.options, q.explanation].join(" "), quiz.index, beats, goodRegister, opts));
  }
  out.push(...checkNarrationCraft(beats, { lang, audience: "absolute_beginner" }));
  out.push(...S.checkHook(ep), ...S.checkProgression(ep, goodPlan), ...S.checkRequiredElements(ep, goodPlan), ...S.checkQuiz(ep), ...S.checkSummary(ep), ...S.checkDiversity(S.diversityScenesFromEpisode(ep)));
  return out;
}
