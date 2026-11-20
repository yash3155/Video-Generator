/* Content gates for every pipeline task kind. They run on agent answers (task:validate), on network outputs, on replays and on mocks. */
import { registerTaskGate } from "../llm/kinds";
import type { CourseMap } from "../schemas/course";
import type { SourceFacts } from "../schemas/facts";
import type { ConceptRegister } from "../schemas/register";
import type { LessonPlan } from "../schemas/plan";
import type { TeachingScript } from "../schemas/script";
import type { Storyboard, VisualBrief } from "../schemas/storyboard";
import type { EpisodeFill } from "../schemas/episode";
import type { BookConfig } from "../schemas/book";
import type { QaReview } from "../schemas/qa";
import { compileLatex } from "../math/katex-compile";
import { checkFormulaVariables, recomputeNumbers } from "../math/recompute";
import { checkLatexSource } from "../math/latex-sanitize";
import { checkDiversity } from "../pedagogy/structure-rules";
import { cueChecks, episodeChecks, scriptChecks } from "../qa/content";
import { foldText } from "../tts/speech";
import { kindLayout } from "./layout";
import { mergeEpisode, type EpisodeScaffold } from "./episode";
import type { QaFinding } from "../schemas/qa";

type CfgLike = Pick<BookConfig, "audience" | "displayLanguage" | "allowedTemplates" | "boilerplateDenylist">;

export interface CourseMapInput {
  bookId: string;
  chapters: { id: string; number: number; title: string }[];
  targetMinutes: { min: number; max: number };
}
export interface FactsInput {
  bookId: string;
  chapterId: string;
  partId: string;
}
export interface RegisterInput {
  facts: SourceFacts;
}
export interface PlanInput {
  kind: string;
  facts: SourceFacts;
  register: ConceptRegister;
}
export interface ScriptInput {
  kind: string;
  languages: string[];
  cfg: CfgLike;
  facts: SourceFacts;
  register: ConceptRegister;
  plan: LessonPlan;
}
export interface StoryboardInput {
  kind: string;
  script: { scenes: { index: number; beats: { id: string }[] }[] };
  availableTemplates: { id: string }[];
}
export interface FillInput {
  kind: string;
  cfg: CfgLike;
  scaffold: EpisodeScaffold;
  facts: SourceFacts;
  register: ConceptRegister;
  plan: LessonPlan;
}

/** Findings that fail a gate: BLOCKER and HIGH. */
export function blocking(findings: QaFinding[]): string[] {
  return findings.filter((f) => f.severity === "BLOCKER" || f.severity === "HIGH").map((f) => `${f.id} ${f.severity}${f.beatId ? ` ${f.beatId}` : f.sceneId ? ` ${f.sceneId}` : ""}: ${f.message}. Fix: ${f.repair}`);
}

export function courseMapGate(m: CourseMap, input: CourseMapInput): string[] {
  const out: string[] = [];
  if (m.bookId !== input.bookId) out.push(`bookId must be "${input.bookId}"`);
  const ids = new Set(m.chapters.map((c) => c.id));
  for (const c of input.chapters) if (!ids.has(c.id)) out.push(`chapter ${c.id} (${c.title}) is not covered`);
  for (const c of m.chapters) {
    if (!input.chapters.some((x) => x.id === c.id)) out.push(`chapter ${c.id} is not in the book`);
    if (!m.modules.some((mod) => mod.id === c.moduleId)) out.push(`chapter ${c.id} references unknown module ${c.moduleId}`);
    const partIds = c.parts.map((x) => x.id);
    if (new Set(partIds).size !== partIds.length) out.push(`chapter ${c.id} has duplicate part ids`);
    for (const p of c.parts)
      if (p.estimatedMinutes < input.targetMinutes.min || p.estimatedMinutes > input.targetMinutes.max)
        out.push(`${c.id} ${p.id} is ${p.estimatedMinutes} min, outside the target ${input.targetMinutes.min}-${input.targetMinutes.max} min (split or merge parts)`);
    for (const pre of c.prerequisites) if (!ids.has(pre)) out.push(`${c.id} prerequisite ${pre} is not a chapter`);
  }
  for (const mod of m.modules) for (const id of mod.chapterIds) if (!ids.has(id)) out.push(`module ${mod.id} lists unknown chapter ${id}`);
  const seen = new Map<string, number>();
  const visit = (id: string, stack: string[]): void => {
    if (stack.includes(id)) {
      out.push(`prerequisites form a cycle: ${[...stack, id].join(" -> ")}`);
      return;
    }
    if (seen.get(id) === 2) return;
    const c = m.chapters.find((x) => x.id === id);
    for (const pre of c?.prerequisites ?? []) visit(pre, [...stack, id]);
    seen.set(id, 2);
  };
  for (const c of m.chapters) visit(c.id, []);
  return [...new Set(out)];
}

export function factsGate(f: SourceFacts, input: FactsInput): string[] {
  const out: string[] = [];
  for (const k of ["bookId", "chapterId", "partId"] as const) if (f[k] !== input[k]) out.push(`${k} must be "${input[k]}"`);
  if (f.facts.length < 10) out.push(`only ${f.facts.length} facts (need at least 10)`);
  const ids = f.facts.map((x) => x.id);
  for (const id of ids.filter((x, i) => ids.indexOf(x) !== i)) out.push(`duplicate fact id ${id}`);
  const known = new Set(ids);
  for (const id of f.realWorldProblem.factIds) if (!known.has(id)) out.push(`realWorldProblem cites unknown fact ${id}`);
  for (const t of f.terms) if (t.factId && !known.has(t.factId)) out.push(`term ${t.term} cites unknown fact ${t.factId}`);
  for (const x of f.facts) {
    if (!x.citation.page && !x.citation.section) out.push(`${x.id} citation needs a page or section`);
    if (x.formula) {
      for (const i of checkLatexSource(x.formula.latex)) out.push(`${x.id} formula LaTeX: ${i.detail}`);
      const c = compileLatex(x.formula.latex, { displayMode: true });
      if (!c.ok) out.push(`${x.id} formula does not compile with KaTeX: ${c.error}`);
      for (const i of checkFormulaVariables(x.formula)) out.push(`${x.id} formula: ${i.detail}`);
    }
    if (x.category === "formula" && !x.formula) out.push(`${x.id} is a formula fact without a formula`);
    if (x.numbers) {
      try {
        const r = recomputeNumbers(x.numbers, x.formula);
        for (const m of r.mismatches) out.push(`${x.id} numbers: ${m.what} is ${m.expected}, recomputed ${m.computed}`);
        for (const e of r.errors) out.push(`${x.id} numbers: ${e}`);
      } catch (e) {
        out.push(`${x.id} numbers cannot be recomputed: ${(e as Error).message}`);
      }
    }
    if (x.category === "numerical_example" && !x.numbers) out.push(`${x.id} is a numerical example without a numbers block`);
  }
  return out;
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function registerGate(r: ConceptRegister, input: RegisterInput): string[] {
  const out: string[] = [];
  const ids = r.concepts.map((c) => c.id);
  for (const id of ids.filter((x, i) => ids.indexOf(x) !== i)) out.push(`duplicate concept id ${id}`);
  const factIds = new Set(input.facts.facts.map((x) => x.id));
  const names = new Set(r.concepts.flatMap((c) => [c.term, c.fullForm ?? "", ...c.aliases]).filter(Boolean).map(norm));
  for (const t of input.facts.terms) if (!names.has(norm(t.term)) && !(t.fullForm && names.has(norm(t.fullForm)))) out.push(`term "${t.term}" from the facts is not registered`);
  for (const c of r.concepts) for (const id of c.factIds) if (!factIds.has(id)) out.push(`${c.id} cites unknown fact ${id}`);
  return out;
}

export function planGate(plan: LessonPlan, input: PlanInput): string[] {
  const out: string[] = [];
  const layout = kindLayout(input.kind);
  const idx = plan.sceneOutline.map((s) => s.index);
  const want = Array.from({ length: layout.sceneCount }, (_, i) => i);
  if (idx.join(",") !== want.join(",")) out.push(`sceneOutline indexes are ${idx.join(",")}; expected ${want.join(",")}`);
  const factIds = new Set(input.facts.facts.map((x) => x.id));
  const conceptIds = new Set(input.register.concepts.map((c) => c.id));
  const inRange = (i: number, what: string) => {
    if (i < 0 || i >= layout.sceneCount) out.push(`${what} points to scene ${i}, outside 0-${layout.sceneCount - 1}`);
  };
  for (const c of plan.coreConcepts) {
    if (!conceptIds.has(c.conceptId)) out.push(`core concept ${c.conceptId} is not in the concept register`);
    for (const [stage, ref] of Object.entries(c.stages)) inRange(ref.sceneIndex, `${c.conceptId} ${stage}`);
    if (c.stages.independent.sceneIndex !== layout.quiz) out.push(`${c.conceptId} independent stage must be the quiz scene ${layout.quiz}`);
  }
  for (const s of plan.sceneOutline) for (const id of s.factIds) if (!factIds.has(id)) out.push(`scene ${s.index} cites unknown fact ${id}`);
  for (const id of [...plan.misconception.factIds, ...plan.causalChain.factIds]) if (!factIds.has(id)) out.push(`plan cites unknown fact ${id}`);
  inRange(plan.misconception.sceneIndex, "misconception");
  inRange(plan.causalChain.sceneIndex, "causalChain");
  for (const q of plan.predictionQuestions) {
    inRange(q.sceneIndex, "prediction question");
    if (!q.question.includes("?")) out.push(`prediction question "${q.question}" must be a question`);
  }
  return [...new Set(out)];
}

export function scriptGate(script: TeachingScript, input: ScriptInput): string[] {
  const out: string[] = [];
  for (const l of input.languages) if (!script.languages.includes(l)) out.push(`languages must include ${l}`);
  const run = scriptChecks({ ...script, languages: input.languages }, { cfg: input.cfg, facts: input.facts, register: input.register }, input.kind);
  out.push(...blocking(run.findings));
  return out;
}

export function storyboardGate(o: { visualBrief: VisualBrief; storyboard: Storyboard }, input: StoryboardInput): string[] {
  const out: string[] = [];
  const layout = kindLayout(input.kind);
  const allowed = new Set(input.availableTemplates.map((t) => t.id));
  const scriptIdx = input.script.scenes.map((s) => s.index).join(",");
  if (o.storyboard.scenes.map((s) => s.index).join(",") !== scriptIdx) out.push(`storyboard scenes must be ${scriptIdx} (the script's scenes, in order)`);
  if (o.visualBrief.scenes.map((s) => s.index).join(",") !== scriptIdx) out.push(`visualBrief scenes must be ${scriptIdx}`);
  for (const s of o.storyboard.scenes) {
    const sc = input.script.scenes.find((x) => x.index === s.index);
    if (sc && s.beats.map((b) => b.id).join(",") !== sc.beats.map((b) => b.id).join(",")) out.push(`scene ${s.index} beats must be ${sc.beats.map((b) => b.id).join(",")}`);
    if (!allowed.has(s.template)) out.push(`scene ${s.index} template ${s.template} is not available`);
    const fixed = layout.fixedTemplates[s.index];
    if (fixed && s.template !== fixed) out.push(`scene ${s.index} must use ${fixed}`);
  }
  const topo = Object.fromEntries(o.visualBrief.scenes.map((s) => [s.index, s.topology]));
  const div = checkDiversity(o.storyboard.scenes.map((s) => ({ index: s.index, template: s.template, pedagogicalContinuation: s.pedagogicalContinuation, topology: topo[s.index] })));
  out.push(...blocking(div));
  return out;
}

export function fillGate(fill: EpisodeFill, input: FillInput): string[] {
  const merged = mergeEpisode(input.scaffold, fill);
  if (!merged.ok) return merged.problems;
  const ep = merged.episode;
  const topo = Object.fromEntries(input.scaffold.scenes.map((s) => [s.index, s.topology]));
  const run = episodeChecks(ep, { cfg: input.cfg, facts: input.facts, register: input.register, plan: input.plan, topologies: topo });
  return [...blocking(run.findings), ...blocking(cueChecks(ep, foldText))];
}

export function reviewGate(r: QaReview, input: { lang: string }): string[] {
  return r.lang === input.lang ? [] : [`lang must be "${input.lang}"`];
}

let registered = false;
export function registerPipelineGates(): void {
  if (registered) return;
  registered = true;
  registerTaskGate("course_map", (o, i) => courseMapGate(o as CourseMap, i as CourseMapInput));
  registerTaskGate("source_facts", (o, i) => factsGate(o as SourceFacts, i as FactsInput));
  registerTaskGate("concept_register", (o, i) => registerGate(o as ConceptRegister, i as RegisterInput));
  registerTaskGate("lesson_plan", (o, i) => planGate(o as LessonPlan, i as PlanInput));
  registerTaskGate("teaching_script", (o, i) => scriptGate(o as TeachingScript, i as ScriptInput));
  registerTaskGate("storyboard", (o, i) => storyboardGate(o as { visualBrief: VisualBrief; storyboard: Storyboard }, i as StoryboardInput));
  registerTaskGate("episode_fill", (o, i) => fillGate(o as EpisodeFill, i as FillInput));
  registerTaskGate("review", (o, i) => reviewGate(o as QaReview, i as { lang: string }));
}
