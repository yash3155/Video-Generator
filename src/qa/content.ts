/* L1-L3 content checks (S-, P-, C-) over a part's artifacts. Used by the S7/S8/S9 gates and by the S12 QA report. */
import type { BookConfig } from "../schemas/book";
import type { SourceFacts } from "../schemas/facts";
import type { ConceptRegister } from "../schemas/register";
import type { LessonPlan } from "../schemas/plan";
import type { Episode, Scene } from "../schemas/episode";
import type { Topology } from "../schemas/storyboard";
import type { TeachingScript } from "../schemas/script";
import { finding, type QaFinding } from "./finding";
import { mathIssuesToFindings, scanMathText } from "../math/latex-sanitize";
import { checkKatex } from "../math/katex-compile";
import { checkSixWayEpisode, factNumbers } from "../math/six-way";
import { extractNumbers, numberMatches } from "../math/numbers";
import { checkFormulaVariables } from "../math/recompute";
import { scanControlChars } from "../math/escapes";
import { checkQuizTerms, checkTermIntroductions, contentWords } from "../pedagogy/concept-register";
import { checkNarrationCraft } from "../pedagogy/narration-metrics";
import * as S from "../pedagogy/structure-rules";
import { scanRenderable } from "../remotion/mappers/guard";
import { TEMPLATE_IDS, type TemplateId } from "../remotion/templates/schemas";
import { kindLayout } from "../pipeline/layout";

export interface CheckRun {
  findings: QaFinding[];
  /** Check ids that were evaluated. */
  ran: string[];
  /** Check ids that were not evaluated, with the reason. */
  skipped: Record<string, string>;
}

export function emptyRun(): CheckRun {
  return { findings: [], ran: [], skipped: {} };
}

export function mergeRuns(...runs: CheckRun[]): CheckRun {
  const out = emptyRun();
  for (const r of runs) {
    out.findings.push(...r.findings);
    for (const id of r.ran) if (!out.ran.includes(id)) out.ran.push(id);
    for (const [id, why] of Object.entries(r.skipped)) if (!out.ran.includes(id) && !(id in out.skipped)) out.skipped[id] = why;
  }
  for (const id of out.ran) delete out.skipped[id];
  return out;
}

/** Keys whose string values are identifiers, settings or LaTeX, not on-screen prose. */
const NON_TEXT_KEYS = new Set(["id", "template", "kind", "role", "tone", "color", "mode", "speaker", "status", "arrangement", "type", "expression", "expr", "variable", "generator", "scope", "from", "to", "target", "anchor", "highlightRowId", "icon", "solvesFor", "latex", "symbolLatex", "symbol"]);

export interface ScreenString {
  path: string;
  text: string;
}

/** Every human-readable string a scene puts on screen (title, takeaways, template data, concept panels). */
export function screenStrings(scene: Scene): ScreenString[] {
  const out: ScreenString[] = [{ path: "title", text: scene.title }];
  scene.takeaways.forEach((t, i) => out.push({ path: `takeaways[${i}]`, text: t }));
  const walk = (v: unknown, p: string, key: string) => {
    if (typeof v === "string") {
      if (!NON_TEXT_KEYS.has(key) && v.trim()) out.push({ path: p, text: v });
    } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) if (k !== "generator" && k !== "scope") walk(x, `${p}.${k}`, k);
  };
  walk(scene.data, "data", "");
  scene.beats.forEach((b) => {
    if (b.visual.concept) walk(b.visual.concept, `${b.id}.visual.concept`, "");
  });
  return out;
}

/** Element ids a cue or visual.show may target in a scene. */
export function elementIds(scene: Scene): Set<string> {
  const ids = new Set<string>(["formula", "note", "conclusion"]);
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.id === "string") ids.add(o.id);
      for (const x of Object.values(o)) walk(x);
    }
  };
  walk(scene.data);
  return ids;
}

function sceneIsHypothetical(scene: Scene): boolean {
  const d = scene.data as Record<string, unknown>;
  if (d.isHypothetical === true) return true;
  if (scene.template === "composite_layout") return scene.data.panels.some((p) => (p.data as Record<string, unknown>).isHypothetical === true);
  return scene.beats.some((b) => b.visual.hypothetical);
}

const SCRIPT_RE: Record<string, RegExp> = { hi: /[\u0900-\u097F]/, mr: /[\u0900-\u097F]/, ne: /[\u0900-\u097F]/, bn: /[\u0980-\u09FF]/, ta: /[\u0B80-\u0BFF]/, te: /[\u0C00-\u0C7F]/, ar: /[\u0600-\u06FF]/, ru: /[\u0400-\u04FF]/, zh: /[\u4E00-\u9FFF]/, ja: /[\u3040-\u30FF]/ };

const base = (lang: string) => lang.split("-")[0];

export interface ContentContext {
  cfg: Pick<BookConfig, "audience" | "displayLanguage" | "allowedTemplates" | "boilerplateDenylist">;
  facts: SourceFacts;
  register: ConceptRegister;
  plan?: LessonPlan;
  topologies?: Partial<Record<number, Topology>>;
  /** Next part in the course (for P-04 forward-bridge verification; null if last part, undefined if unknown). */
  nextPart?: S.NextPartInfo | null;
  /** Text of other parts in the workspace (C-05, C-06); undefined skips those checks. */
  others?: OtherPart[];
}

export interface OtherPart {
  id: string;
  screen: string[];
  narration: string;
}

/** Numbers a part may show or say: fact numbers, their percent forms, and small counting numbers. */
function allowedNumbers(facts: SourceFacts): number[] {
  return factNumbers(facts);
}

function numberAllowed(n: ReturnType<typeof extractNumbers>[number], allowed: number[]): boolean {
  if (!n.percent && Number.isInteger(n.value) && n.value >= 0 && n.value <= 12) return true;
  return allowed.some((a) => numberMatches(n, a, 2));
}

export const DEFAULT_BOILERPLATE = ["1848 corn farmers", "lagging earnings reports", "lorem ipsum", "in today's fast-paced world", "unlock the secrets", "game-changer"];

function termOptions(register: ConceptRegister, lang: string) {
  return {
    lang,
    glossary: register.concepts.filter((c) => c.kind !== "symbol").flatMap((c) => [c.term, ...c.aliases]),
    symbols: register.concepts.filter((c) => c.kind === "symbol").map((c) => c.term),
  };
}

function beatRefs(ep: Pick<Episode, "scenes">, lang: string) {
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

function ngrams(text: string, n = 5): Set<string> {
  const words = (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []) as string[];
  const out = new Set<string>();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(" "));
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

const stem = (w: string) => w.replace(/(ing|ed|es|s)$/u, "");

/** Fixed UI labels that may repeat across parts (C-05). */
export const FIXED_LABELS = new Set(["points to remember", "where we are", "hypothetical example", "illustrative model", "common novice trap", "professional reality"]);

/** Checks over the teaching script alone (S7 gate and S12). */
export function scriptChecks(script: TeachingScript, ctx: Pick<ContentContext, "cfg" | "facts" | "register">, kind = "chapter_part"): CheckRun {
  const layout = kindLayout(kind);
  const run = emptyRun();
  const f = run.findings;
  const factIds = new Set(ctx.facts.facts.map((x) => x.id));
  const seen = new Set<string>();
  for (const s of script.scenes)
    for (const b of s.beats) {
      if (seen.has(b.id)) f.push(finding("S-02", "BLOCKER", `duplicate beat id ${b.id}`, "Beat ids must be unique.", "Renumber the beats.", { beatId: b.id }));
      seen.add(b.id);
      if (!b.id.startsWith(`s${String(s.index).padStart(2, "0")}b`)) f.push(finding("S-02", "HIGH", `beat ${b.id} is in scene ${s.index}`, "Beat ids carry their scene number.", `Rename it s${String(s.index).padStart(2, "0")}b<n>.`, { beatId: b.id }));
      for (const id of b.sourceFactIds) if (!factIds.has(id)) f.push(finding("S-03", "BLOCKER", `${b.id} cites unknown fact ${id}`, "Every cited fact must exist in 01_source_facts.json.", "Cite an existing fact id.", { beatId: b.id }));
      if (!b.sourceFactIds.length && !b.transition) f.push(finding("C-01", "HIGH", `${b.id} cites no fact`, "Every beat teaches at least one cited fact.", "Add the fact ids this beat teaches, or mark it transition: true.", { beatId: b.id }));
      for (const lang of script.languages) if (!b.narration[lang]?.display?.trim()) f.push(finding("S-01", "BLOCKER", `${b.id} has no ${lang} narration`, "Every beat needs narration in every language.", `Write the ${lang} narration for ${b.id}.`, { beatId: b.id, lang }));
    }
  const indexes = script.scenes.map((s) => s.index).join(",");
  const want = Array.from({ length: layout.sceneCount }, (_, i) => i).join(",");
  if (indexes !== want) f.push(finding("P-02", "HIGH", `scene indexes are ${indexes}, expected ${want}`, `A ${layout.kind} lesson has ${layout.sceneCount} scenes in order.`, "Follow the lesson plan's scene outline one-to-one."));
  for (const [idx, n] of Object.entries(layout.beatCounts)) {
    const i = Number(idx);
    const s = script.scenes.find((x) => x.index === i);
    const rule = i === layout.hook ? "P-01" : i === layout.quiz ? "P-06" : "P-08";
    if (!s) f.push(finding(rule, "HIGH", `scene ${idx} is missing`, "The hook, quiz and summary scenes are fixed.", `Write scene ${idx}.`));
    else if (s.beats.length !== n) f.push(finding(rule, "HIGH", `scene ${idx} has ${s.beats.length} beats, expected ${n}`, "The hook, quiz and summary scenes have fixed beat counts.", `Rewrite scene ${idx} with ${n} beats.`));
  }
  const asEpisode = {
    scenes: script.scenes.map((s) => ({
      id: `s${String(s.index).padStart(2, "0")}`,
      index: s.index,
      beats: s.beats.map((b) => ({ ...b, newTerms: b.newTerms ?? [], visual: { show: [], phase: s.index === layout.quiz && b.id.endsWith("b2") ? ("thinking" as const) : undefined } })),
    })),
  } as unknown as Pick<Episode, "scenes">;
  for (const lang of script.languages) {
    const beats = beatRefs(asEpisode, lang);
    f.push(...checkNarrationCraft(beats, { lang, audience: ctx.cfg.audience }));
    f.push(...checkTermIntroductions(beats, ctx.register, termOptions(ctx.register, lang)));
  }
  for (const s of script.scenes) for (const b of s.beats) f.push(...mathIssuesToFindings(scanMathText(b.narration, b.id), { sceneId: `s${String(s.index).padStart(2, "0")}`, beatId: b.id }));
  run.ran.push("S-01", "S-02", "S-03", "C-01", "P-03", "P-05", "C-10", "C-11");
  return run;
}

/** Full L1-L3 checks over a built episode. */
export function episodeChecks(ep: Episode, ctx: ContentContext): CheckRun {
  const run = emptyRun();
  const f = run.findings;
  const facts = ctx.facts;
  const factIds = new Set(facts.facts.map((x) => x.id));
  const display = ctx.cfg.displayLanguage;

  // L1
  const sceneIds = new Set<string>();
  const beatIds = new Set<string>();
  for (const s of ep.scenes) {
    if (sceneIds.has(s.id)) f.push(finding("S-02", "BLOCKER", `duplicate scene id ${s.id}`, "Scene ids must be unique.", "Renumber the scenes.", { sceneId: s.id }));
    sceneIds.add(s.id);
    for (const b of s.beats) {
      if (beatIds.has(b.id)) f.push(finding("S-02", "BLOCKER", `duplicate beat id ${b.id}`, "Beat ids must be unique.", "Renumber the beats.", { sceneId: s.id, beatId: b.id }));
      beatIds.add(b.id);
      for (const id of b.sourceFactIds) if (!factIds.has(id)) f.push(finding("S-03", "BLOCKER", `${b.id} cites unknown fact ${id}`, "Every cited fact must exist in 01_source_facts.json.", "Cite an existing fact id.", { sceneId: s.id, beatId: b.id }));
    }
  }
  const dupFacts = facts.facts.map((x) => x.id).filter((id, i, a) => a.indexOf(id) !== i);
  for (const id of new Set(dupFacts)) f.push(finding("S-02", "BLOCKER", `duplicate fact id ${id}`, "Fact ids must be unique.", "Renumber the facts."));
  const dupConcepts = ctx.register.concepts.map((x) => x.id).filter((id, i, a) => a.indexOf(id) !== i);
  for (const id of new Set(dupConcepts)) f.push(finding("S-02", "BLOCKER", `duplicate concept id ${id}`, "Concept ids must be unique.", "Renumber the concepts."));
  const allowed = new Set<string>(ctx.cfg.allowedTemplates?.length ? ctx.cfg.allowedTemplates : TEMPLATE_IDS);
  for (const s of ep.scenes) {
    const used: string[] = s.template === "composite_layout" ? ["composite_layout", ...s.data.panels.map((p) => p.template)] : [s.template];
    for (const t of used) if (!allowed.has(t)) f.push(finding("S-04", "HIGH", `scene ${s.index} uses ${t}, which the book does not allow`, "The book restricts its templates.", `Use one of ${[...allowed].join(", ")}.`, { sceneId: s.id }));
  }
  run.ran.push("S-01", "S-02", "S-03", "S-04");

  // L2
  const kind = ep.kind;
  f.push(...S.checkHook(ep));
  if (ctx.plan) f.push(...S.checkProgression(ep, ctx.plan));
  else run.skipped["P-02"] = "no lesson plan";
  f.push(...S.checkRequiredElements(ep, ctx.plan, ctx.nextPart).filter((x) => kind === "chapter_part" || !/causal chain|roadmap|forward link/.test(x.message)));
  f.push(...S.checkQuiz(ep), ...S.checkSummary(ep), ...S.checkDiversity(S.diversityScenesFromEpisode(ep, ctx.topologies)));
  for (const lang of ep.languages) {
    const beats = beatRefs(ep, lang);
    const opts = termOptions(ctx.register, lang);
    f.push(...checkTermIntroductions(beats, ctx.register, opts));
    const quiz = ep.scenes.find((s) => s.template === "interactive_quiz");
    const quizLang = !ep.languages.includes(ep.displayLanguage) || lang === ep.displayLanguage;
    if (quizLang && quiz && quiz.template === "interactive_quiz") {
      const q = quiz.data;
      f.push(...checkQuizTerms([q.question, ...q.options, q.explanation].join(" "), quiz.index, beats, ctx.register, opts));
    }
    f.push(...checkNarrationCraft(beats, { lang, audience: ctx.cfg.audience }));
  }
  if (ctx.plan) run.ran.push("P-02");
  run.ran.push("P-01", "P-03", "P-04", "P-05", "P-06", "P-07", "P-08", "P-09", "P-10");

  // L3
  const allBeats = ep.scenes.flatMap((s) => s.beats.map((b) => ({ s, b })));
  for (const { s, b } of allBeats)
    if (!b.sourceFactIds.length && !b.transition) f.push(finding("C-01", "HIGH", `${b.id} cites no fact`, "Every beat teaches at least one cited fact.", "Add the fact ids this beat teaches, or mark it transition: true.", { sceneId: s.id, beatId: b.id }));
  const cited = new Set(allBeats.flatMap(({ b }) => b.sourceFactIds));
  const coverage = facts.facts.filter((x) => cited.has(x.id)).length / facts.facts.length;
  if (coverage < 0.85) f.push(finding("C-02", "HIGH", `only ${Math.round(coverage * 100)}% of facts are taught (min 85%)`, "Facts were extracted but never taught.", `Teach ${facts.facts.filter((x) => !cited.has(x.id)).map((x) => x.id).join(", ")} or remove them from the facts.`));
  for (const x of facts.facts)
    if ((x.category === "formula" || x.category === "numerical_example") && !cited.has(x.id))
      f.push(finding("C-02", "HIGH", `${x.category} fact ${x.id} is never taught`, "Every formula and worked example in the facts must be taught.", `Cite ${x.id} in the beat that teaches it.`));

  const nums = allowedNumbers(facts);
  for (const s of ep.scenes) {
    const hypo = sceneIsHypothetical(s);
    const strings = screenStrings(s);
    if (!hypo)
      for (const str of strings)
        for (const n of extractNumbers(str.text))
          if (!numberAllowed(n, nums))
            f.push(finding("C-03", "HIGH", `scene ${s.index} shows ${n.raw} (${str.path}), which is not in the facts`, "Numbers on screen must come from the source or a recorded computation.", "Use the fact's number or mark the example isHypothetical.", { sceneId: s.id }));
    if (!hypo)
      for (const b of s.beats)
        for (const [lang, n] of Object.entries(b.narration))
          for (const x of extractNumbers(n.display))
            if (!numberAllowed(x, nums))
              f.push(finding("C-04", "HIGH", `${b.id} (${lang}) says ${x.raw}, which is not in the facts`, "Narrated numbers must come from the source or a badged hypothetical example.", "Use the fact's number or badge the example as hypothetical.", { sceneId: s.id, beatId: b.id, lang }));

    for (const i of scanRenderable(s.data, "data")) f.push(finding("C-09", "BLOCKER", `scene ${s.index} ${i.path} would show "${i.token}"`, "Placeholder or empty value in visual data.", "Fill the field with real content from this part.", { sceneId: s.id }));
    for (const str of [{ path: "title", text: s.title }, ...s.takeaways.map((t, i) => ({ path: `takeaways[${i}]`, text: t }))])
      for (const i of scanRenderable(str.text, str.path)) f.push(finding("C-09", "BLOCKER", `scene ${s.index} ${str.path} would show "${i.token}"`, "Placeholder in on-screen text.", "Write real content.", { sceneId: s.id }));

    const cc = scanControlChars({ title: s.title, takeaways: s.takeaways, data: s.data, beats: s.beats.map((b) => b.narration) }, s.id);
    for (const p of cc.problems) f.push(finding("C-10", "BLOCKER", `${p.path}: ${p.detail}`, "A control character means a JSON escape swallowed a LaTeX backslash.", "Re-escape the backslash (\\\\frac, \\\\text) and regenerate.", { sceneId: s.id }));
    for (const r of cc.repairs) f.push(finding("C-10", "BLOCKER", `scene ${s.index}: control character (${r.detail})`, "A control character means a JSON escape swallowed a LaTeX backslash.", "Re-escape the backslash and regenerate.", { sceneId: s.id }));
    f.push(...mathIssuesToFindings(scanMathText({ title: s.title, takeaways: s.takeaways, data: s.data }, s.id, { onScreen: true }), { sceneId: s.id }).filter((x) => x.id !== "C-10"));
    f.push(...checkKatex(s.data, s.id, { sceneId: s.id }));
    for (const b of s.beats) f.push(...mathIssuesToFindings(scanMathText(b.narration, b.id), { sceneId: s.id, beatId: b.id }).filter((x) => x.id !== "C-10"));

    const formulas: { latex: string; variables: { symbol: string; meaning: string; unit: string }[]; expression?: string; solvesFor?: string }[] = [];
    const chartAxes: { label: string; unit: string }[] = [];
    const collect = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(collect);
      else if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        if (typeof o.latex === "string" && Array.isArray(o.variables)) formulas.push(o as never);
        if (o.xAxis && o.yAxis) chartAxes.push(o.xAxis as never, o.yAxis as never);
        for (const x of Object.values(o)) collect(x);
      }
    };
    collect(s.data);
    for (const fm of formulas)
      for (const i of checkFormulaVariables(fm as never)) f.push(finding("C-14", "HIGH", `scene ${s.index} formula: ${i.detail}`, "Every variable needs a meaning and a unit.", "Declare the variable with meaning and unit.", { sceneId: s.id }));
    for (const ax of chartAxes) if (!ax.unit?.trim() || !ax.label?.trim()) f.push(finding("C-14", "HIGH", `scene ${s.index} chart axis "${ax.label}" has no unit`, "Chart axes are labelled with variable and unit.", "Add the axis unit.", { sceneId: s.id }));

    for (const lang of ep.languages) {
      if (base(lang) === base(display)) continue;
      const re = SCRIPT_RE[base(lang)];
      if (!re || re.test("") || (SCRIPT_RE[base(display)] && SCRIPT_RE[base(display)].source === re.source)) continue;
      for (const str of strings) if (re.test(str.text)) f.push(finding("C-15", "HIGH", `scene ${s.index} ${str.path} shows ${lang} script on a ${display} screen: "${str.text.slice(0, 60)}"`, "On-screen text stays in the display language.", `Write ${str.path} in ${display}.`, { sceneId: s.id }));
    }

    // C-08: scene-level narration/visual agreement in the display language.
    const narr = ep.languages.includes(display) ? s.beats.map((b) => b.narration[display]?.display ?? "").join(" ") : "";
    const citedText = facts.facts.filter((x) => s.beats.some((b) => b.sourceFactIds.includes(x.id))).map((x) => x.statement).join(" ");
    const have = new Set(contentWords(`${narr} ${citedText}`).map(stem));
    const want = [...new Set(contentWords(strings.filter((x) => x.path !== "title").map((x) => x.text).join(" ")).map(stem))];
    if (want.length >= 5) {
      const ratio = want.filter((w) => have.has(w)).length / want.length;
      if (ratio < 0.6) f.push(finding("C-08", "MEDIUM", `scene ${s.index}: only ${Math.round(ratio * 100)}% of the visual's keywords are in the narration or cited facts`, "The visual shows things the narration does not talk about.", "Align the visual text with what is said in this scene.", { sceneId: s.id }));
    }
    if (narr && !hypo) {
      const spoken = extractNumbers(narr);
      for (const str of strings)
        for (const n of extractNumbers(str.text)) {
          if (!n.percent && Number.isInteger(n.value) && n.value <= 12) continue;
          if (!spoken.some((x) => numberMatches(x, n.percent ? n.value / 100 : n.value, 2) || numberMatches(n, x.percent ? x.value / 100 : x.value, 2)))
            f.push(finding("C-08", "MEDIUM", `scene ${s.index} shows ${n.raw} but the narration never says it`, "Numbers on the visual must be spoken in that beat or the previous one.", "Say the number or remove it from the visual.", { sceneId: s.id }));
        }
    }
  }
  f.push(...checkSixWayEpisode(ep, { knownNumbers: nums }));

  /* C-16/C-17/C-18/C-19: beat-level narration-visual synchronization checks. */
  for (const s of ep.scenes) {
    const dataIds = elementIds(s);
    /* Build a map from element id to its textual content. */
    const elTextMap = new Map<string, string>();
    const walk2 = (v: unknown, _p: string, parentId?: string) => {
      if (Array.isArray(v)) {
        for (const [i, x] of v.entries()) {
          if (typeof x === "string" && parentId && x.trim()) {
            elTextMap.set(parentId, (elTextMap.get(parentId) ?? "") + " " + x);
          } else {
            walk2(x, `${_p}[${i}]`, parentId);
          }
        }
      } else if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        const id = typeof o.id === "string" ? o.id : parentId;
        const texts: string[] = [];
        for (const [k, x] of Object.entries(o)) {
          if (typeof x === "string" && !NON_TEXT_KEYS.has(k) && x.trim()) texts.push(x);
          else if (typeof x === "object") walk2(x, `${_p}.${k}`, id);
        }
        if (id && texts.length) elTextMap.set(id, (elTextMap.get(id) ?? "") + " " + texts.join(" "));
      }
    };
    walk2(s.data, "data");
    for (const b of s.beats) {
      /* C-17: empty visual show (exempt quiz scenes which animate via visual.phase, whole-scene data charts, and summary intro beat) */
      const isSummaryIntro = s.template === "summary_thread" && b.visual.range?.[0] === 0;
      if ((!b.visual.show || !b.visual.show.length) && !b.transition && !b.visual.phase && s.template !== "interactive_quiz" && s.template !== "data_chart" && !isSummaryIntro) {
        f.push(finding("C-17", "HIGH", `${b.id} has empty visual.show`, "Every beat must display at least one on-screen element.", "Add element ids to visual.show for this beat.", { sceneId: s.id, beatId: b.id }));
      }
      /* C-16: beat-visual overlap with narration (exempt compact overview beats) */
      if (b.visual.show?.length && !b.visual.compact && ep.languages.includes(display)) {
        const beatNarr = b.narration[display]?.display ?? "";
        if (beatNarr) {
          const beatWords = new Set(contentWords(beatNarr).map(stem));
          const shownText = b.visual.show
            .map((id: string) => elTextMap.get(id) ?? "")
            .join(" ");
          if (shownText.trim()) {
            const shownWords = contentWords(shownText).map(stem);
            const overlap = shownWords.filter((w) => beatWords.has(w)).length;
            if (shownWords.length >= 3 && overlap / shownWords.length < 0.15) {
              f.push(finding("C-16", "HIGH", `${b.id}: visual elements have < 15% word overlap with the beat narration`, "The on-screen content must show what the narrator is saying in this beat.", "Rewrite the visual element text to match the narration's concrete nouns and numbers.", { sceneId: s.id, beatId: b.id }));
            }
          }
        }
      }
    }
    /* C-19: untimed elements – every data element should appear in at least one beat's visual.show */
    const shownIds = new Set(s.beats.flatMap((b) => b.visual.show ?? []));
    for (const id of dataIds) {
      if (!shownIds.has(id) && id !== "formula" && id !== "note" && id !== "conclusion") {
        f.push(finding("C-19", "MEDIUM", `scene ${s.index} element "${id}" is defined in data but never shown in any beat`, "Every visual element must be tied to at least one beat's visual.show.", "Add this element id to the beat that discusses it.", { sceneId: s.id }));
      }
    }
  }
  /* C-18: counted item match – when narration says "four pillars" or "five steps", the visual item count should match. */
  const countPattern = /\b(two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(pillars?|steps?|cards?|rules?|nodes?|links?|stages?|phases?|points?|items?)\b/gi;
  const countMap: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  for (const s of ep.scenes) {
    const sceneNarr = s.beats.map((b) => b.narration[display]?.display ?? "").join(" ");
    let m: RegExpExecArray | null;
    while ((m = countPattern.exec(sceneNarr)) !== null) {
      const num = countMap[m[1].toLowerCase()] ?? parseInt(m[1], 10);
      if (!num || num < 2 || num > 10) continue;
      /* Count matching elements in the data */
      const dataArrays: unknown[][] = [];
      const findArrays = (v: unknown) => {
        if (Array.isArray(v) && v.length >= 2 && v.every((x) => x && typeof x === "object" && "id" in (x as Record<string, unknown>))) dataArrays.push(v);
        else if (v && typeof v === "object") for (const x of Object.values(v as Record<string, unknown>)) findArrays(x);
      };
      findArrays(s.data);
      const hasMatch = dataArrays.some((arr) => arr.length === num);
      if (dataArrays.length > 0 && !hasMatch) {
        f.push(finding("C-18", "MEDIUM", `scene ${s.index}: narration says "${m[0]}" but no data array has ${num} items (found ${dataArrays.map((a) => a.length).join(", ")})`, "The number of visual items must match the count stated in the narration.", `Adjust the data to have exactly ${num} items or fix the narration.`, { sceneId: s.id }));
      }
    }
  }

  const deny = [...DEFAULT_BOILERPLATE, ...(ctx.cfg.boilerplateDenylist ?? [])].map((x) => x.toLowerCase());
  const factText = facts.facts.map((x) => x.statement).join(" ").toLowerCase();
  const allScreen = ep.scenes.flatMap((s) => screenStrings(s).map((x) => ({ s, text: x.text })));
  for (const phrase of deny) {
    if (factText.includes(phrase)) continue;
    const hit = allScreen.find((x) => x.text.toLowerCase().includes(phrase)) ?? allBeats.flatMap(({ s, b }) => Object.values(b.narration).map((n) => ({ s, text: n.display }))).find((x) => x.text.toLowerCase().includes(phrase));
    if (hit) f.push(finding("C-07", "HIGH", `boilerplate "${phrase}" in scene ${hit.s.index}`, "Known boilerplate leaked from another project.", "Replace it with content from this part's facts.", { sceneId: hit.s.id }));
  }

  if (ctx.others) {
    const mineScreen = allScreen.map((x) => x.text).filter((t) => (t.match(/\S+/g) ?? []).length > 6 && !FIXED_LABELS.has(t.toLowerCase()));
    for (const o of ctx.others) {
      const theirs = new Set(o.screen.map((t) => t.trim().toLowerCase()));
      for (const t of mineScreen) if (theirs.has(t.trim().toLowerCase())) f.push(finding("C-05", "HIGH", `on-screen text also appears in ${o.id}: "${t.slice(0, 60)}"`, "Visual text must be authored for this part.", "Rewrite the string for this part.", {}));
      const vs = jaccard(ngrams(allScreen.map((x) => x.text).join(" ")), ngrams(o.screen.join(" ")));
      if (vs >= 0.15) f.push(finding("C-06", "HIGH", `visual text is ${Math.round(vs * 100)}% similar to ${o.id} (max 15%)`, "The visuals look copied from another part.", "Regenerate the visuals from this part's facts."));
      const mineNarr = allBeats.map(({ b }) => Object.values(b.narration).map((n) => n.display).join(" ")).join(" ");
      const ns = jaccard(ngrams(mineNarr), ngrams(o.narration));
      if (ns >= 0.1) f.push(finding("C-06", "HIGH", `narration is ${Math.round(ns * 100)}% similar to ${o.id} (max 10%)`, "The narration repeats another part.", "Rewrite the narration for this part."));
    }
    run.ran.push("C-05", "C-06");
  } else {
    run.skipped["C-05"] = "no other parts in the workspace";
    run.skipped["C-06"] = "no other parts in the workspace";
  }
  run.ran.push("C-01", "C-02", "C-03", "C-04", "C-07", "C-08", "C-09", "C-10", "C-11", "C-12", "C-13", "C-14", "C-15", "C-16", "C-17", "C-18", "C-19");
  return run;
}

/** Pre-TTS cue checks (A-06 part 1): every cue targets an element of its scene and its anchor occurs in the beat text of every language. */
export function cueChecks(ep: Episode, normalize: (s: string) => string): QaFinding[] {
  const out: QaFinding[] = [];
  for (const s of ep.scenes) {
    const ids = elementIds(s);
    for (const b of s.beats) {
      for (const id of b.visual.show) if (!ids.has(id)) out.push(finding("A-06", "BLOCKER", `${b.id} shows unknown element "${id}"`, "visual.show must name element ids of the scene data.", "Use an element id from the scene data.", { sceneId: s.id, beatId: b.id }));
      for (const c of b.visualCues) {
        if (!ids.has(c.target)) out.push(finding("A-06", "BLOCKER", `${b.id} cue targets unknown element "${c.target}"`, "Cue targets must be element ids of the scene data.", "Use an element id from the scene data.", { sceneId: s.id, beatId: b.id }));
        for (const lang of ep.languages) {
          const anchor = c.anchor[lang];
          const text = b.narration[lang]?.display ?? "";
          if (!anchor) out.push(finding("A-06", "BLOCKER", `${b.id} cue "${c.target}" has no ${lang} anchor`, "Every cue needs an anchor word per narration language.", `Add a ${lang} anchor that occurs in the beat narration.`, { sceneId: s.id, beatId: b.id, lang }));
          else if (!normalize(text).includes(normalize(anchor)))
            out.push(finding("A-06", "BLOCKER", `${b.id} cue "${c.target}" anchor "${anchor}" is not in the ${lang} narration`, "The anchor must be a word the narrator says in that beat.", "Pick an anchor that occurs verbatim in the beat narration.", { sceneId: s.id, beatId: b.id, lang }));
        }
      }
    }
  }
  return out;
}

export const TEMPLATE_SET: ReadonlySet<TemplateId> = new Set(TEMPLATE_IDS);
