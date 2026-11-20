/* The QA check registry (Part F): every check id with its layer, title, the stage its repair re-runs, and its repair hint. */
import type { QaFinding } from "../schemas/qa";

export interface QaCheckMeta {
  id: string;
  layer: QaFinding["layer"];
  title: string;
  /** Pipeline stage whose output the repair loop regenerates for a failing finding. */
  repairStage: "S3" | "S5" | "S6" | "S7" | "S8" | "S9" | "S10" | "S11" | null;
  repair: string;
}

const c = (id: string, layer: QaFinding["layer"], title: string, repairStage: QaCheckMeta["repairStage"], repair: string): QaCheckMeta => ({ id, layer, title, repairStage, repair });

export const QA_CHECKS: QaCheckMeta[] = [
  c("S-01", "L1", "Every artifact parses with its Zod schema", "S9", "Regenerate the artifact that failed to parse."),
  c("S-02", "L1", "Scene, beat, fact and concept ids are unique", "S7", "Renumber the duplicated ids."),
  c("S-03", "L1", "Every sourceFactId resolves to a fact of this part", "S7", "Cite only fact ids that exist in 01_source_facts.json."),
  c("S-04", "L1", "Every template is allowed for the book", "S8", "Pick a template from the book's allowedTemplates."),
  c("S-05", "L1", "The compiled episode matches the current episode and covers every rendered scene", "S10", "Re-run S10 so the compiled timeline matches 08_episode.json."),
  c("P-01", "L2", "Scene 0 is a 4-beat problem-first hook", "S7", "Rewrite scene 0: novice asks, mentor sets the situation, the trap, the invention."),
  c("P-02", "L2", "8-stage progression mapped for each core concept", "S6", "Map every stage of every core concept to a scene in teaching order."),
  c("P-03", "L2", "Just-in-time term introduction (registered, expanded, defined)", "S7", "Expand and define the term in the beat that first mentions it."),
  c("P-04", "L2", "Causal chain, prediction question, guided application, misconception split, roadmaps", "S9", "Add the missing required element."),
  c("P-05", "L2", "Narration craft metrics (sentence length, beat budget, readability, fillers)", "S7", "Split long sentences or beats; remove fillers."),
  c("P-06", "L2", "Quiz structure (3 beats, scenario, 4 options, thinking pause, explanation)", "S9", "Rebuild the quiz scene with the fixed 3-beat structure."),
  c("P-07", "L2", "Quiz tests only terms already taught", "S7", "Teach the term before the quiz or remove it from the quiz."),
  c("P-08", "L2", "Summary has 8 rules and the 6 fixed beats", "S9", "Rebuild the summary with 8 rules and ranges [0,0],[1,2],[3,4],[5,6],[7,8],[1,8]."),
  c("P-09", "L2", "No spoiler markers in quiz options or pre-reveal narration", "S9", "Remove the spoiler marker; correctIndex identifies the answer."),
  c("P-10", "L2", "Template diversity and topology fit", "S8", "Choose templates by topology; no adjacent repeats; at least 5 distinct."),
  c("C-01", "L3", "Every beat cites at least one fact", "S7", "Add the sourceFactIds the beat teaches, or mark a pure transition."),
  c("C-02", "L3", "Fact coverage >= 85% and every formula/worked example taught", "S7", "Teach the uncovered facts or drop them from 01_source_facts.json."),
  c("C-03", "L3", "Every number on screen comes from the facts or is badged hypothetical", "S9", "Use the fact's numbers or mark the scene isHypothetical."),
  c("C-04", "L3", "Narrated numbers come from the facts or a hypothetical scene", "S7", "Use the fact's numbers or badge the example as hypothetical."),
  c("C-05", "L3", "On-screen strings are bespoke (not copied from another part)", "S9", "Rewrite the copied string for this part."),
  c("C-06", "L3", "Cross-part similarity below threshold (visual < 0.15, narration < 0.10)", "S9", "Rewrite the visuals or narration for this part's facts."),
  c("C-07", "L3", "No boilerplate from the denylist", "S9", "Remove the boilerplate phrase."),
  c("C-08", "L3", "Narration and visual agree per scene (keywords and numbers)", "S9", "Show what the narration says, and say what the visual shows."),
  c("C-09", "L3", "No placeholder, empty, undefined, null, NaN or [object Object] in visual data", "S9", "Fill the empty field with real content."),
  c("C-10", "L3", "No control characters (swallowed LaTeX backslashes)", "S9", "Re-escape the LaTeX backslashes in the JSON."),
  c("C-11", "L3", "No forbidden math text (/text, raw \\frac, doubled backslashes, $ in latex)", "S9", "Move math into typed latex fields."),
  c("C-12", "L3", "Every formula compiles with KaTeX strict mode", "S9", "Fix the LaTeX so KaTeX compiles it."),
  c("C-13", "L3", "Six-way agreement of equation, arithmetic, chart, annotations, narration and conclusion", "S9", "Make every leg use the recomputed numbers."),
  c("C-14", "L3", "Formula variables have meaning and unit; chart axes have units", "S9", "Declare every variable with a unit and label both axes with units."),
  c("C-15", "L3", "On-screen text uses only the display language's script", "S9", "Write on-screen text in the display language."),
  c("A-01", "L4", "Every beat has decodable audio longer than 0.5 s", "S10", "Re-synthesize the beat audio."),
  c("A-02", "L4", "Audio hash matches the current spoken text (no stale audio)", "S10", "Re-run S10 to regenerate the stale audio."),
  c("A-03", "L4", "Compiled timeline matches the measured audio plus pauses", "S10", "Re-run S10 to re-measure the audio."),
  c("A-04", "L4", "Loudness -16 LUFS +/- 1 LU, true peak <= -1 dBTP", "S10", "Re-normalize the audio (two-pass loudnorm)."),
  c("A-05", "L4", "No internal silence over 1.5 s (except the quiz pause)", "S10", "Re-synthesize the beat; check the spoken text for long pauses."),
  c("A-06", "L4", "Every visualCue anchor resolves to a word timestamp", "S9", "Anchor the cue on a word that is spoken in that beat."),
  c("A-07", "L4", "ASR back-transcription word error rate (when Whisper is available)", "S10", "Fix the spoken text or the pronunciation lexicon."),
  c("R-01", "L5", "Video stream: H.264, 1920x1080 (draft 960x540), 30 fps, yuv420p, AAC, duration", "S11", "Re-render the part."),
  c("R-02", "L5", "No black frames outside intentional transitions", "S11", "Re-render; check scenes that render empty."),
  c("R-03", "L5", "No frozen picture over 20 s while a beat with cues is narrated", "S9", "Add visual cues or split the beat so the picture changes."),
  c("R-04", "L5", "No text overflow in any beat still", "S9", "Shorten the text that overflows its box."),
  c("R-05", "L5", "Stills OCR shows no raw LaTeX or junk tokens (when Tesseract is available)", "S9", "Fix the visual data that renders junk."),
  c("R-06", "L5", "Captions and panels never overlap", "S9", "Shorten the panel content or the caption phrase."),
  c("R-07", "L5", "Rendered background matches the active theme", "S11", "Re-render with the book theme."),
  c("R-08", "L5", "Quiz frames show 4 options, then exactly one highlighted answer", "S9", "Fix the quiz phases and correctIndex."),
  c("Q-MOCK", "Q", "No mock LLM or mock TTS output in a release", null, "Run with a real LLM (or agent hand-off) and a real TTS provider."),
  c("Q-DRAFT", "Q", "Draft renders and scene subsets are never released", null, "Render without --draft and --scenes."),
  c("Q-FALLBACK", "Q", "TTS fallback is recorded and reported", null, "Check the network or Edge TTS; Piper output is releasable but noted."),
  c("Q-REVIEW", "Q", "L6 expert review scores >= 4 on every axis", "S9", "Apply the reviewer's suggestions."),
];

export const QA_CHECK_IDS = QA_CHECKS.map((x) => x.id);

export function checkMeta(id: string): QaCheckMeta | undefined {
  return QA_CHECKS.find((x) => x.id === id);
}
