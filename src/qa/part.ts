/* QA of one part (L1-L5) from its artifacts and media, shared by S12 and the bad-fixture tests. L6 review and Q-xx release checks are added by the caller. */
import { SourceFacts } from "../schemas/facts";
import { ContentAudit } from "../schemas/audit";
import { ConceptRegister } from "../schemas/register";
import { LessonPlan } from "../schemas/plan";
import { TeachingScript } from "../schemas/script";
import { Storyboard, VisualBrief, type Topology } from "../schemas/storyboard";
import { Episode } from "../schemas/episode";
import { EpisodeCompiled, type CompiledBeat } from "../schemas/compiled";
import type { PartKind } from "../schemas/course";
import type { LessonStill } from "../render/lesson";
import { foldText } from "../tts/speech";
import { A } from "../pipeline/artifacts";
import { cueChecks, emptyRun, episodeChecks, mergeRuns, scriptChecks, type CheckRun, type ContentContext, type OtherPart } from "./content";
import { audioChecks } from "./audio";
import { renderChecks } from "./render";
import { finding } from "./finding";

type Parser = { safeParse: (v: unknown) => { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } } };

export const ARTIFACT_SCHEMAS: [string, Parser][] = [
  [A.facts, SourceFacts],
  [A.audit, ContentAudit],
  [A.register, ConceptRegister],
  [A.plan, LessonPlan],
  [A.scriptJson, TeachingScript],
  [A.brief, VisualBrief],
  [A.storyboard, Storyboard],
  [A.episode, Episode],
  [A.compiled, EpisodeCompiled],
];

/** S-01: every artifact is present and parses with its schema. `artifacts` maps file name to parsed JSON (undefined when missing). */
export function schemaChecks(artifacts: Record<string, unknown>): CheckRun {
  const run = emptyRun();
  run.ran.push("S-01");
  for (const [name, schema] of ARTIFACT_SCHEMAS) {
    const v = artifacts[name];
    if (v === undefined) {
      run.findings.push(finding("S-01", "BLOCKER", `${name} is missing`, "An earlier stage did not write it.", "Re-run the pipeline."));
      continue;
    }
    const r = schema.safeParse(v);
    if (!r.success)
      for (const i of r.error!.issues.slice(0, 10))
        run.findings.push(
          finding(
            "S-01",
            "BLOCKER",
            `${name} ${i.path.join(".")}: ${i.message}`,
            "The artifact does not match its schema.",
            "Regenerate the artifact that failed to parse.",
          ),
        );
  }
  return run;
}

/** S-05: the compiled episode was built from the current 08_episode.json and covers exactly the selected scenes. */
export function compiledChecks(compiled: EpisodeCompiled, episodeHash: string, sceneIds: string[], langs: string[]): CheckRun {
  const run = emptyRun();
  run.ran.push("S-05");
  const f = (m: string) =>
    run.findings.push(
      finding("S-05", "BLOCKER", m, "09_episode_compiled.json is out of date.", "Re-run S10 so the compiled timeline matches 08_episode.json."),
    );
  if (compiled.episodeHash !== episodeHash) f("the compiled episode was built from a different 08_episode.json");
  for (const lang of langs) {
    const t = compiled.timelines[lang];
    if (!t) {
      f(`no ${lang} timeline`);
      continue;
    }
    const have = t.scenes.map((s) => s.sceneId);
    if (have.join(",") !== sceneIds.join(",")) f(`${lang} timeline covers scenes ${have.join(",")}; expected ${sceneIds.join(",")}`);
  }
  return run;
}

export interface PartQaInput {
  /** Parsed JSON of every artifact by file name (undefined when missing). */
  artifacts: Record<string, unknown>;
  /** sha256 of 08_episode.json as stored on disk. */
  episodeHash: string;
  cfg: ContentContext["cfg"];
  kind: PartKind;
  langs: string[];
  /** Selected scene indices (--scenes); undefined for all scenes. */
  scenes?: number[];
  /** Next part in the course (for P-04 forward-bridge check; null if last part, undefined if unknown). */
  nextPart?: ContentContext["nextPart"];
  others: OtherPart[];
  partDir: string;
  draft: boolean;
  /** Current spoken text of an episode beat in a language (null when it has no narration). */
  spoken: (lang: string, beatId: string) => string | null;
  /** Audio hash the beat should have for its current spoken text and voice. */
  expectedHash: (lang: string, beatId: string, spoken: string) => string;
  renderFile: (lang: string) => string;
  stills: (lang: string) => LessonStill[];
  /** Layers to evaluate (default all). */
  audio?: boolean;
  render?: boolean;
  /** ASR and OCR overrides (default: Whisper and Tesseract CLIs when installed). */
  transcribe?: (file: string, lang: string) => string | null;
  ocr?: (png: string, lang: string) => string | null;
}

export interface PartQaResult {
  run: CheckRun;
  episode?: Episode;
  compiled?: EpisodeCompiled;
}

/** Runs L1-L5 over a part. When an artifact the later layers need does not parse, only the S-01 findings are returned. */
export function runPartChecks(o: PartQaInput): PartQaResult {
  const runs: CheckRun[] = [schemaChecks(o.artifacts)];
  const parse = <T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: T } }, name: string): T | undefined => {
    const r = schema.safeParse(o.artifacts[name]);
    return r.success ? r.data : undefined;
  };
  const ep = parse<Episode>(Episode, A.episode);
  const facts = parse<SourceFacts>(SourceFacts, A.facts);
  const register = parse<ConceptRegister>(ConceptRegister, A.register);
  const plan = parse<LessonPlan>(LessonPlan, A.plan);
  const script = parse<TeachingScript>(TeachingScript, A.scriptJson);
  const brief = parse<VisualBrief>(VisualBrief, A.brief);
  const compiled = parse<EpisodeCompiled>(EpisodeCompiled, A.compiled);
  if (!ep || !facts || !register || !plan || !script || !brief || !compiled) return { run: mergeRuns(...runs) };

  const topologies: Partial<Record<number, Topology>> = Object.fromEntries(brief.scenes.map((s) => [s.index, s.topology]));
  runs.push(scriptChecks(script, { cfg: o.cfg, facts, register }, o.kind));
  runs.push(episodeChecks(ep, { cfg: o.cfg, facts, register, plan, topologies, nextPart: o.nextPart, others: o.others }));
  runs.push({ findings: cueChecks(ep, foldText), ran: ["A-06"], skipped: {} });
  const selected = o.scenes?.length ? ep.scenes.filter((s) => o.scenes!.includes(s.index)) : ep.scenes;
  runs.push(
    compiledChecks(
      compiled,
      o.episodeHash,
      selected.map((s) => s.id),
      o.langs,
    ),
  );

  const beatById = new Map(ep.scenes.flatMap((s) => s.beats.map((b) => [b.id, b] as const)));
  for (const lang of o.langs) {
    const spoken = (b: CompiledBeat) => (beatById.get(b.beatId)?.narration[lang] ? o.spoken(lang, b.beatId) : null);
    if (o.audio !== false)
      runs.push(
        audioChecks({
          partDir: o.partDir,
          compiled,
          lang,
          renderFile: o.renderFile(lang),
          spoken,
          expectedHash: (b) => {
            const s = spoken(b);
            return s ? o.expectedHash(lang, b.beatId, s) : null;
          },
          transcribe: o.transcribe,
        }),
      );
    if (o.render !== false && compiled.timelines[lang])
      runs.push(renderChecks({ compiled, lang, renderFile: o.renderFile(lang), draft: o.draft, stills: o.stills(lang), ocr: o.ocr }));
  }
  return { run: mergeRuns(...runs), episode: ep, compiled };
}
