/* Pre-render & post-render deterministic verification gate (`part:preflight`). */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { exists, readJson, readText, sha256File } from "../core/fsutil";
import { outBookDir, partDir as partDirOf } from "../core/paths";
import { bookConfigFile, courseMapFile, qaDir, renderFile, videoBase, A } from "../pipeline/artifacts";
import { kindOf, otherParts, partInfo } from "../pipeline/stages";
import { BookConfig } from "../schemas/book";
import { EpisodeCompiled } from "../schemas/compiled";
import { Episode } from "../schemas/episode";
import { SourceFacts } from "../schemas/facts";
import { LessonPlan } from "../schemas/plan";
import { QaReport } from "../schemas/qa";
import { ConceptRegister } from "../schemas/register";
import { TeachingScript } from "../schemas/script";
import { Storyboard, VisualBrief } from "../schemas/storyboard";
import { renderLessonStills, pruneBundles } from "../render/lesson";
import { beatAudioHash, beatVoice } from "../tts/voices";
import { spokenText } from "../tts/speech";
import { audioChecks } from "./audio";
import { episodeChecks, scriptChecks, type CheckRun } from "./content";
import { finding, type QaFinding } from "./finding";
import { ARTIFACT_SCHEMAS } from "./part";
import { renderChecks } from "./render";

function summarize(findings: QaFinding[]): { BLOCKER: number; HIGH: number; MEDIUM: number; LOW: number } {
  const s = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of findings) s[f.severity]++;
  return s;
}

export const DEPRECATED_LEGACY_ARTIFACTS = [
  "02_lesson_plan.json",
  "03_math_blueprint.json",
  "04_pedagogical_script.json",
] as const;

export interface PreflightOptions {
  bookId: string;
  chapterId: string;
  partId: string;
  langs?: string[];
  compiled?: boolean;
  stills?: boolean;
  release?: boolean;
}

export interface PreflightResult {
  ok: boolean;
  bookId: string;
  chapterId: string;
  partId: string;
  languages: string[];
  findings: QaFinding[];
  summary: { BLOCKER: number; HIGH: number; MEDIUM: number; LOW: number };
}

const base = (lang: string) => lang.split("-")[0];

export async function runPreflight(opts: PreflightOptions): Promise<PreflightResult> {
  const findings: QaFinding[] = [];
  const pDir = partDirOf(opts.bookId, opts.chapterId, opts.partId);
  const cfgPath = bookConfigFile(opts.bookId);

  if (!exists(cfgPath)) {
    findings.push(finding("S-01", "BLOCKER", `missing ${cfgPath}`, "Book config is required.", "Create book.config.json (S0) first."));
    const summary = summarize(findings);
    return { ok: false, bookId: opts.bookId, chapterId: opts.chapterId, partId: opts.partId, languages: opts.langs ?? [], findings, summary };
  }

  const cfg = BookConfig.parse(readJson(cfgPath));
  const langs = opts.langs?.length ? opts.langs : cfg.narrationLanguages;
  const pFile = (name: string) => path.join(pDir, name);

  // 1. Reject leftover legacy scripts/artifacts
  for (const legacy of DEPRECATED_LEGACY_ARTIFACTS) {
    if (exists(pFile(legacy))) {
      findings.push(
        finding(
          "S-01",
          "BLOCKER",
          `deprecated legacy artifact ${legacy} exists in ${opts.chapterId}/${opts.partId}`,
          "Legacy pipeline artifacts conflict with S1-S14 completeness.",
          `Delete ${legacy} and regenerate full S1-S9 artifacts cleanly.`,
        ),
      );
    }
  }

  // 2. Validate S1-S9 schemas
  const parsed: Record<string, unknown> = {};
  for (const [name, schema] of ARTIFACT_SCHEMAS) {
    if (name === A.compiled) continue;
    const f = pFile(name);
    if (!exists(f)) {
      findings.push(finding("S-01", "BLOCKER", `${name} is missing`, "Every S1-S9 artifact is required.", `Generate ${name} (or run the corresponding stage).`));
      continue;
    }
    const raw = readJson(f);
    const parseSchema = schema as { safeParse: (d: unknown) => { success: true; data: unknown } | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } } };
    const res = parseSchema.safeParse(raw);
    if (!res.success) {
      const iss = res.error.issues[0];
      const msg = iss ? `${iss.path.join(".")}: ${iss.message}` : "schema validation failed";
      findings.push(finding("S-01", "BLOCKER", `${name} ${msg}`, "Artifact failed its Zod schema.", `Fix ${name} at ${iss?.path.join(".") || "root"}.`));
    } else {
      parsed[name] = res.data;
    }
  }

  if (!exists(pFile(A.scriptMd)) || !readText(pFile(A.scriptMd)).trim()) {
    findings.push(finding("S-01", "BLOCKER", `${A.scriptMd} is missing or empty`, "Human-readable script markdown is required alongside JSON.", `Write ${A.scriptMd} matching ${A.scriptJson}.`));
  }

  // Resolve nextPart safely from course_map.json
  let nextPart = undefined;
  if (exists(courseMapFile(opts.bookId))) {
    try {
      nextPart = partInfo({ bookId: opts.bookId, chapterId: opts.chapterId, partId: opts.partId }).nextPart;
    } catch {
      nextPart = undefined;
    }
  }

  const facts = parsed[A.facts] as SourceFacts | undefined;
  const register = parsed[A.register] as ConceptRegister | undefined;
  const plan = parsed[A.plan] as LessonPlan | undefined;
  const script = parsed[A.scriptJson] as TeachingScript | undefined;
  const brief = parsed[A.brief] as VisualBrief | undefined;
  const storyboard = parsed[A.storyboard] as Storyboard | undefined;
  const ep = parsed[A.episode] as Episode | undefined;

  const cfgSub = {
    audience: cfg.audience,
    displayLanguage: cfg.displayLanguage,
    allowedTemplates: cfg.allowedTemplates,
    boilerplateDenylist: cfg.boilerplateDenylist,
  };
  const topologies = brief?.scenes.map((s) => s.topology);

  // 3. L1-L3 Script & Episode Content + Pedagogy Checks
  if (script && facts && register) {
    findings.push(...scriptChecks(script, { cfg: cfgSub, facts, register }).findings);
  }
  if (ep && facts && register) {
    const others = otherParts({ partDir: pDir });
    const res = episodeChecks(ep, {
      cfg: cfgSub,
      facts,
      register,
      plan,
      topologies,
      others,
      nextPart: kindOf(opts.chapterId) === "chapter_part" ? nextPart : null,
    });
    findings.push(...res.findings);

    // Script-to-Episode alignment check
    if (script) {
      if (script.scenes.length !== ep.scenes.length) {
        findings.push(
          finding(
            "S-01",
            "BLOCKER",
            `05_teaching_script.json (${script.scenes.length} scenes) and 08_episode.json (${ep.scenes.length} scenes) count mismatch`,
            "Teaching script and episode must share identical scene structure.",
            "Re-sync 05_teaching_script.json/.md and 08_episode.json.",
          ),
        );
      } else {
        for (let i = 0; i < ep.scenes.length; i++) {
          const eb = ep.scenes[i].beats.map((b) => b.id).join(",");
          const sb = script.scenes[i].beats.map((b) => b.id).join(",");
          if (eb !== sb) {
            findings.push(
              finding(
                "S-01",
                "BLOCKER",
                `scene ${ep.scenes[i].id} beat ids differ between 05_teaching_script.json (${sb}) and 08_episode.json (${eb})`,
                "Script and episode beats drifted out of sync.",
                "Align beat ids across 05_teaching_script.json/.md, 07_storyboard.json, and 08_episode.json.",
                { sceneId: ep.scenes[i].id },
              ),
            );
          }
        }
      }
    }

    if (storyboard && storyboard.scenes.length !== ep.scenes.length) {
      findings.push(
        finding("S-01", "BLOCKER", `07_storyboard.json has ${storyboard.scenes.length} scenes vs ${ep.scenes.length} in 08_episode.json`, "Storyboard and episode must match.", "Re-sync 07_storyboard.json."),
      );
    }

    // 4. Proactive layout/sync hygiene checks that commonly trip Low/Medium runs
    for (const l of langs) {
      if (!ep.languages.includes(l)) {
        findings.push(finding("S-01", "BLOCKER", `08_episode.json missing configured narration language "${l}"`, "Bilingual delivery is mandatory.", `Add "${l}" narration to every beat in 08_episode.json.`));
      }
      for (const s of ep.scenes) {
        for (const b of s.beats) {
          const text = b.narration[l]?.display?.trim() ?? "";
          if (!text) {
            findings.push(finding("S-01", "BLOCKER", `${b.id} (${l}) has empty narration text`, "Missing bilingual beat narration.", `Fill ${b.id}.narration.${l}.display.`, { sceneId: s.id, beatId: b.id, lang: l }));
          }
        }
      }
    }

    for (const s of ep.scenes) {
      (s.takeaways ?? []).forEach((t, idx) => {
        if (t.length > 90) {
          findings.push(finding("R-04", "HIGH", `${s.id} takeaways[${idx}] is ${t.length} chars (> 90 max for footer)`, "Long footer takeaways wrap to 3+ lines and clip on 1080p stills.", "Shorten each takeaway to <= 78 chars.", { sceneId: s.id }));
        } else if (t.length > 78) {
          findings.push(finding("R-04", "MEDIUM", `${s.id} takeaways[${idx}] is ${t.length} chars (recommended <= 78)`, "Long takeaways may wrap tightly in the footer.", "Consider tightening takeaway text under 78 chars.", { sceneId: s.id }));
        }
      });
      if (s.template === "interactive_quiz") {
        for (const b of s.beats) {
          if (b.visual?.show?.length) {
            findings.push(
              finding(
                "A-06",
                "BLOCKER",
                `quiz beat ${b.id} sets non-empty visual.show (${JSON.stringify(b.visual.show)})`,
                "InteractiveQuiz controls options via phase only; named show ids fail A-06 element checks.",
                `Set ${b.id}.visual.show to [] and drive quiz state with visual.phase ("question" | "thinking" | "reveal").`,
                { sceneId: s.id, beatId: b.id },
              ),
            );
          }
        }
      }
    }
  }

  // 5. Compiled timeline & audio word-timestamp check (when exists or --compiled/--stills/--release)
  const compPath = pFile(A.compiled);
  let compiled: EpisodeCompiled | undefined;
  const needCompiled = Boolean(opts.compiled || opts.stills || opts.release);

  if (exists(compPath)) {
    const rawComp = EpisodeCompiled.safeParse(readJson(compPath));
    if (!rawComp.success) {
      findings.push(finding("S-01", "BLOCKER", `${A.compiled} failed Zod schema parse`, "Compiled timeline is malformed.", "Re-run S10."));
    } else {
      compiled = rawComp.data;
      if (ep) {
        const curHash = sha256File(pFile(A.episode));
        if (compiled.episodeHash !== curHash) {
          findings.push(finding("S-05", "BLOCKER", `${A.compiled} is stale (episodeHash mismatch with ${A.episode})`, "Episode edited after S10.", "Re-run S10 before S11/S12."));
        }
      }
      const beatById = new Map(ep ? ep.scenes.flatMap((s) => s.beats.map((b) => [b.id, b] as const)) : []);
      const lexOf = (lang: string) => cfg.pronunciation[lang] ?? cfg.pronunciation[base(lang)] ?? {};
      for (const lang of langs) {
        const run: CheckRun = audioChecks({
          partDir: pDir,
          compiled,
          lang,
          spoken: (cb) => {
            const eb = beatById.get(cb.beatId);
            return eb?.narration[lang] ? spokenText(eb.narration[lang], lang, lexOf(lang)) : null;
          },
          expectedHash: (cb) => {
            const eb = beatById.get(cb.beatId);
            if (!eb?.narration[lang]) return null;
            const sp = spokenText(eb.narration[lang], lang, lexOf(lang));
            const voice = beatVoice(cfg.tts.provider, cfg, lang, eb.speaker);
            return beatAudioHash(sp, voice, cfg.tts.rate, cfg.tts.provider);
          },
          renderFile: exists(path.join(pDir, "render", `${lang}.mp4`)) ? path.join(pDir, "render", `${lang}.mp4`) : undefined,
        });
        findings.push(...run.findings);
        const unresolved = compiled.timelines[lang]?.beats.filter((b) => (b.unresolvedCues?.length ?? 0) > 0) ?? [];
        for (const b of unresolved) {
          findings.push(
            finding(
              "A-06",
              "BLOCKER",
              `${b.beatId} (${lang}) has unresolved visualCue anchor(s) for target(s) ${JSON.stringify(b.unresolvedCues)}`,
              "Anchor word is missing verbatim or could not match TTS word boundaries.",
              `Change ${b.beatId}.visualCues anchor.${lang} to a clean verbatim word spoken in ${b.beatId}.narration.${lang}.`,
              { sceneId: b.sceneId, beatId: b.beatId, lang },
            ),
          );
        }
      }
    }
  } else if (needCompiled) {
    findings.push(finding("S-05", "BLOCKER", `${A.compiled} is missing`, "S10 must compile bilingual audio timelines first.", `Run: node bin/openlectern.mjs run S10 --book ${opts.bookId} --chapter ${opts.chapterId} --part ${opts.partId}`));
  }

  // 6. Fast layout dry-run (--stills): verify R-04 / R-06 / R-07 / R-08 before slow full MP4 encode
  if (opts.stills && compiled) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ol-preflight-stills-"));
    try {
      for (const lang of langs) {
        if (!compiled.timelines[lang]) continue;
        const langDir = path.join(tmpDir, lang);
        const stills = await renderLessonStills({ partDir: pDir, compiled, lang, outDir: langDir, draft: false });
        const rRun = renderChecks({
          compiled,
          lang,
          renderFile: "__preflight_skip_mp4__",
          stills,
          draft: false,
        });
        findings.push(...rRun.findings.filter((f) => f.id !== "R-01"));
      }
      pruneBundles(3);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  // 7. Post-render Release & Packaging Verification (--release)
  if (opts.release) {
    const repPath = path.join(qaDir({ partDir: pDir }), "report.json");
    if (!exists(repPath)) {
      findings.push(finding("S-01", "BLOCKER", `qa/report.json missing for ${opts.chapterId}/${opts.partId}`, "S12 QA has not run.", `Run S12 --no-review for ${opts.chapterId}/${opts.partId}.`));
    } else {
      const rep = QaReport.parse(readJson(repPath));
      if (!rep.release.releasable) {
        findings.push(finding("S-01", "BLOCKER", `qa/report.json releasable=false (${rep.release.reason})`, "Part has not passed S12 release gate.", "Resolve all BLOCKER/HIGH findings and re-run S10-S13."));
      }
    }

    const relOut = path.join(outBookDir(opts.bookId, false), opts.chapterId);
    const draftOut = path.join(outBookDir(opts.bookId, true), opts.chapterId);
    const flatReleaseDir = outBookDir(opts.bookId, false);
    const flatDraftDir = outBookDir(opts.bookId, true);

    for (const l of langs) {
      const vb = videoBase({ chapterId: opts.chapterId, partId: opts.partId }, l);
      const mp4 = path.join(relOut, `${vb}.mp4`);
      if (!exists(mp4)) {
        findings.push(finding("R-01", "BLOCKER", `packaged video missing: ${mp4}`, "S13 did not package release video.", `Run S13 for ${opts.chapterId}/${opts.partId}.`, { lang: l }));
      }
      const rendered = renderFile({ partDir: pDir }, l);
      if (exists(rendered) && exists(mp4)) {
        const rs = fs.statSync(rendered).size;
        const ps = fs.statSync(mp4).size;
        if (rs !== ps) {
          findings.push(finding("R-01", "BLOCKER", `packaged ${vb}.mp4 size (${ps}) differs from rendered ${rendered} (${rs})`, "Packaged output is stale.", `Re-run S13 for ${opts.chapterId}/${opts.partId}.`, { lang: l }));
        }
      }
      for (const stale of [path.join(draftOut, `${vb}.mp4`), path.join(flatReleaseDir, `${vb}.mp4`), path.join(flatDraftDir, `${vb}.mp4`)]) {
        if (exists(stale)) {
          findings.push(finding("S-01", "HIGH", `stale draft/legacy flat deliverable present: ${stale}`, "Old flat or draft video was not cleaned up.", `Re-run S13 or remove ${stale}.`, { lang: l }));
        }
      }
    }
    for (const suffix of ["qa.html", "qa.json"]) {
      const f = path.join(relOut, `${opts.chapterId}_${opts.partId}_${suffix}`);
      if (!exists(f)) findings.push(finding("S-01", "BLOCKER", `packaged QA artifact missing: ${f}`, "S13 packaging incomplete.", `Run S13 for ${opts.chapterId}/${opts.partId}.`));
      for (const stale of [path.join(draftOut, `${opts.chapterId}_${opts.partId}_${suffix}`), path.join(flatReleaseDir, `${opts.chapterId}_${opts.partId}_${suffix}`), path.join(flatDraftDir, `${opts.chapterId}_${opts.partId}_${suffix}`)]) {
        if (exists(stale)) findings.push(finding("S-01", "HIGH", `stale draft/flat QA artifact present: ${stale}`, "Old draft or flat file left behind.", `Remove ${stale}.`));
      }
    }

    const idxFile = path.join(flatReleaseDir, "index.html");
    if (!exists(idxFile)) {
      findings.push(finding("S-01", "BLOCKER", `course index missing: ${idxFile}`, "S14 has not run.", "Run S14."));
    } else {
      const html = readText(idxFile);
      for (const l of langs) {
        const expectedHref = `${opts.chapterId}/${opts.chapterId}_${opts.partId}_${l}.mp4`;
        const draftHref = `drafts/${opts.chapterId}_${opts.partId}_${l}.mp4`;
        const draftSubHref = `drafts/${opts.chapterId}/${opts.chapterId}_${opts.partId}_${l}.mp4`;
        if (!html.includes(expectedHref)) {
          findings.push(finding("S-01", "BLOCKER", `index.html missing release link "${expectedHref}"`, "S14 index is stale.", "Run S14."));
        }
        if (html.includes(draftHref) || html.includes(draftSubHref)) {
          findings.push(finding("S-01", "HIGH", `index.html still links draft for ${opts.chapterId}/${opts.partId}`, "S14 index was not refreshed after cleanup.", "Remove stale drafts and re-run S14."));
        }
      }
    }
  }

  const summary = summarize(findings);
  const ok = summary.BLOCKER === 0 && summary.HIGH === 0;
  return { ok, bookId: opts.bookId, chapterId: opts.chapterId, partId: opts.partId, languages: langs, findings, summary };
}
