# Decisions

One entry per decision: context, options, choice, reason.

## D-001 Verifier location and runtime

- Context: Part L requires objective phase verifiers before the product exists.
- Options: shell scripts per OS; Node `.mjs` scripts; a TypeScript verifier.
- Choice: dependency-free Node `.mjs` under `scripts/verify/` (`phase.mjs`, `status.mjs`, `done.mjs`, `clean-clone.mjs`, `checks/phaseN.mjs`, `checks/done.mjs`).
- Reason: runs identically on Windows PowerShell 5.1, macOS and Linux; no build step; Phase 0 can run before `npm install`.

## D-002 Isolated workspace for the Phase 6 verifier

- Context: the Phase 6 check must observe a first run, a fully cached second run and a `--resume` run.
- Options: reuse the developer workspace; use an isolated home.
- Choice: the CLI honours `OPENLECTERN_HOME` (workspace and out are created below it; an empty value means the current directory). The verifier uses `.build/verify/home-phase6`, wiped before the first run.
- Reason: objective, repeatable, never destroys the developer's demo outputs.

## D-003 Contracts fixed by the verifier

- Context: the verifier is written before the code it checks.
- Choice: these CLI contracts are fixed now and the product must implement them: `doctor --json` (`{checks:[{id,...}]}`), `tts:test --provider <p> --out <dir> --json` (`{audioPath, wordsPath, timingSource}`), `research:detect --json` (`{connectors:[{id}]}`), `research:gate --json <files>` (`{results:[{file,ok}]}`), `templates --json`, `render:stills --fixtures|--fixture <file> --out <dir>` (non-template stills start with `_`, overflow diagnostics in `<out>/overflow.json`), `qa:checks --json`, `qa --fixture <dir> --draft --out <dir> --json`, `make ...` writing `workspace/books/<id>/runs/last.json` (`{stages:[{id,status}]}`) and per-part `tasks.json` (`{tasks:[{kind,hash}]}`). Draft MP4s go to `out/<book>/drafts/`, released MP4s to `out/<book>/`.
- Reason: makes every matrix row in Part L.2 mechanically checkable.

## D-004 Draft and mock runs are not failures of `make`

- Context: Phase 6 requires `make ... --llm mock --tts mock --draft` to exit 0 while its QA report contains the BLOCKER Q-MOCK.
- Choice: `make` exits 0 when every stage completed and the only release-blocking findings are Q-MOCK (BLOCKER, mock provenance) and Q-DRAFT (HIGH, draft render); it prints `NOT RELEASED` and writes outputs under `out/<book>/drafts/`. Any other BLOCKER/HIGH makes `make` exit 1 after the bounded repair loop.
- Reason: test runs must be distinguishable from failures, and mock/draft media can never be released.

## D-005 Network access through a corporate proxy

- Context: on the build machine the default system Node binary is refused outbound connections (EACCES), and all traffic must go through an HTTP proxy discovered by WPAD.
- Options: download packages through PowerShell; use the Node runtime bundled with the IDE through the proxy; give up on network features.
- Choice: the build uses the IDE-bundled Node 24 (allowed by the local policy) with standard `HTTPS_PROXY`/`HTTP_PROXY`/`NO_PROXY` variables and `NODE_USE_ENV_PROXY=1`. The helper that sets them lives in the ignored `.build/` folder so no machine-specific proxy URL is ever committed. The product honours the standard proxy variables everywhere it touches the network (npm, Remotion browser download, Edge TTS websocket, LLM HTTP APIs); `docs/TROUBLESHOOTING.md` documents this.
- Reason: keeps traffic on the sanctioned egress path and keeps the repository free of personal paths.

## D-006 Edge TTS library: `node-edge-tts`

- Context: Part E.6 asks for a maintained Node library that exposes Edge word-boundary metadata, evaluating `msedge-tts` and `node-edge-tts`.
- Options: `msedge-tts@2.1.1`; `node-edge-tts@1.2.12`; a hand-written websocket client.
- Choice: `node-edge-tts`. Its `streamAudio()` yields audio chunks and word boundaries (`{part,start,end}`), it has a `proxy` option (we pass `HTTPS_PROXY`), it is TypeScript-typed and has no install scripts. `msedge-tts` was rejected because it declares `preinstall: npx only-allow pnpm`, which can break `npm ci` for consumers on npm versions that run dependency install scripts.
- Reason: maintained library, word-boundary timings for visual cues, proxy support, clean install.

## D-007 `npx openlectern` inside the checkout

- Context: `npx --no-install openlectern` does not resolve a package's own `bin` inside its own checkout.
- Choice: `scripts/postinstall.mjs` writes `node_modules/.bin/openlectern{,.cmd,.ps1}` shims pointing at `bin/openlectern.mjs` (skipped when installed as a dependency, where npm links the bin itself) and then runs `doctor --non-fatal`.
- Reason: the documented commands work right after `npm install` or `npm ci` on every OS, without a global install.

## D-008 LLM provider transports

- Context: Part B.6 requires OpenAI-compatible (any base URL), Anthropic, Gemini (official SDKs) and Ollama providers.
- Choice: `@anthropic-ai/sdk` and `@google/genai` for Anthropic and Gemini; plain `fetch` for the OpenAI-compatible `/v1/chat/completions` endpoint (works with OpenAI, OpenRouter, Groq, Together, LM Studio, vLLM, Ollama `/v1`) and for the native Ollama `/api/chat` endpoint. SDKs are imported lazily so the default zero-key path never loads them.
- Reason: follows the spec, keeps the default path light, and every transport uses the platform fetch so proxy behaviour is identical.

## D-009 TypeScript runs through tsx

- Context: the CLI and Remotion compositions are TypeScript.
- Choice: no compile step. `bin/openlectern.mjs` registers `tsx` and imports `src/cli/index.ts`; Remotion bundles `src/remotion/index.ts` with its own bundler; `tsc --noEmit` only typechecks.
- Reason: `npm ci` then `npm start` works immediately; one source of truth.

## D-010: 08_episode.json does not depend on --lang

- Context: the replay quickstart (`--lang en`) must reproduce the episode hash recorded by the Phase 8 demo run (en and hi).
- Decision: S2 to S9 always generate narration for every narration language in book.config.json, so 08_episode.json is identical regardless of `--lang`. `--lang` filters only S10 onward (TTS, compile, render, QA, publish).
- Consequence: the task hashes for S7 to S9 do not include `--lang`; recorded replay fixtures serve any language subset.

## D-011: Schema tests use shared minimal fixtures

- Context: Phase 2 needs a valid and invalid fixture per artifact.
- Decision: tests/schemas/fixtures.ts builds a minimal valid object per artifact; each test clones it and breaks one field, asserting the failing issue path. JSON Schemas in schemas/json/ are generated and committed so editors can use them without a build.

## D-012: LLM task identity, cache key and hand-off protocol details

- Task hash = SHA-256 of (kind, template version, input). It excludes provider, model, time and paths so recordings replay on any machine. The LLM cache key adds provider id and model on top of the task hash, as the spec requires.
- Task id = `<chapter>-<part>-<kind>-<hash8>`; folder `workspace/.tasks/<task_id>/` holds prompt.md, input.json, output.schema.json, task.json; the agent writes output.json.
- Exit mode prints `AWAITING_AGENT <task_id> <task_folder>` on stdout (one line per task) and exits 75; guidance goes to stderr.
- An invalid answer found on re-run is moved to output.rejected.json and the problems are written to feedback.md; the run exits 75 again for that task. Network providers instead get up to 2 automatic repair retries with the problems appended to the prompt.
- `openlectern llm:test` sends a tiny `ping` task through any provider; it doubles as the fixture for the exit-75 test.
- Model output is parsed with a LaTeX-aware JSON reader (src/math/escapes.ts) that repairs swallowed backslashes (`\frac` read as form feed) before Zod validation.

## D-013: TTS fallback and voices

- Edge requests are retried 3 times with exponential backoff; when a request still fails, the Edge provider is considered down and every later beat goes to Piper (when installed). The reason is recorded on each fallback result for the compiled episode and the QA report. Without Piper the error propagates.
- node-edge-tts receives `proxy` from HTTPS_PROXY/HTTP_PROXY so corporate networks work.
- Piper voices default per language (en_US-lessac-medium, hi_IN-pratham-medium, ...) from PIPER_VOICES_DIR when the persona voice is an Edge voice name. Piper, OpenAI and Google timings are estimated; ElevenLabs timings come from its character alignment.

## D-014: Research connector detection

- A CLI cannot see the host agent's MCP tools, so the NotebookLM MCP connector is reported available only when OPENLECTERN_NOTEBOOKLM_MCP=1 is set (documented in .env.example and the agent instructions).
- The `nlm` CLI flavor is chosen by probing `nlm --help`: "notebook"+"query" selects the notebooklm-mcp-cli command set, "chat" selects the nlm-chat command set.
- Local files: PDF via pdfjs-dist (pages marked `[p. N]` to keep page citations), EPUB via jszip in spine order, DOCX via mammoth, TXT/MD directly; chapters are split by "Chapter N" / "N." headings or exact titles.

## D-015: Math engine thresholds

- Numbers match when they agree within half a unit of the smaller of the rounding digits and the decimals actually written (so "about 4,322" matches 4,321.94 and "1,157.63" matches 1,157.625). Percents match their decimal form (5% = 0.05).
- Six-way agreement: a typeset step's value is the last number after its last `=`, `\approx`, `\simeq` or `\equiv`; a chart marker must lie on any generated curve; the curve whose expression equals the formula, evaluated at the given value, must hit the result. A number in the narration or conclusion within 25% of the result that does not match it is a near-miss (C-13), unless the part's source facts state that number (other legitimate values such as simple interest on the same deposit).
- Formula expressions come from model output, so mathjs runs with import, createUnit, evaluate, parse, simplify and derivative disabled, and assignments or function definitions are rejected.
- Swallowed backslashes are repaired at parse time (raw text) and again on parsed values (control characters before letters); anything left is C-10. Slash commands, doubled backslashes, `$` in LaTeX and unbalanced braces are C-11; KaTeX runs in strict mode with throwOnError, failures are C-12.

## D-016: Pedagogy heuristics

- Readability uses the Flesch-Kincaid grade on English narration only (target at most grade 9 for absolute beginners, 12 intermediate, 16 advanced); other languages get sentence-length and word-budget checks only.
- Hindi narration gets a x1.3 allowance on the 75-word beat budget and the 35-word sentence maximum because it uses more, shorter words for the same content. Transition beats and the quiz thinking beat are exempt from the word budget.
- A concept counts as explained at first mention when the same or the next beat shares at least a third of the register's plain-meaning content words, or uses a definition phrase ("means", "stands for", Hindi "yani"/"matlab") with some overlap; non-English narration paraphrases the English register, so the phrase alone is enough there. Acronyms must have their expansion in the same beat (HIGH; MEDIUM in non-English narration when a definition phrase is present).
- Everyday all-caps words (OK, TV, AM, PM, USA, UK, US, FAQ, PS, AD, BC, CEO) and Roman numerals are not technical acronyms; single-letter symbols a, A and I are not matched, and apostrophes are part of a word so "don't" never matches the symbol t.
- The P-04 misconception requirement is satisfied by a split_comparison scene with a trap side; the prediction question and guided-before-quiz requirements come from the lesson plan.

## D-017: Remotion rendering conventions

- Fonts are bundled from @fontsource packages (Inter, JetBrains Mono, Noto Sans Devanagari) and imported as CSS in Root.tsx; nothing is fetched from a CDN at render time. Each composition holds a delayRender until document.fonts.ready, so measurements and stills use real glyph metrics.
- Overflow and layout diagnostics leave the browser as tagged console lines keyed by the composition label (the shared browser can route one page's log to another job's callback, so the label in the payload is authoritative).
- Remotion 4 renderStill passes composition.props, not inputProps, to the component, so each still job passes its own composition object with props set.
- Reveal semantics: elements a template does not register with the reveal map are always shown; registered elements appear on their beat and stay visible.
- Diagram edges are drawn only between adjacent nodes in the flow order; a candlestick request renders as a scatter of closing values (labelled), since the storyboard data carries no open/high/low.
- When a scene has a concept overlay, the overlay gets its own 580 px column on the right and the main template renders at "half" size, so the concept panel never covers the main diagram.
- Remotion bundles are cached in node_modules/.cache/openlectern/bundle-<hash>, keyed on the source tree, package.json and the public directory manifest.

## D-018: Visual review without an image viewer

- The agent host used for the build cannot display PNG bytes. Visual review is done with three substitutes: an in-browser layout audit run on every still (text collisions, off-canvas text, text under 16 px, WCAG contrast at 4.5:1, or 3:1 for large text) that fails render:stills on clean fixtures; per-element probe boxes written to layout.json; and coarse ASCII previews of the PNGs for composition and balance. A human reviewer should still look at out/stills before a release.

## D-019: Pipeline runner, caching and exit codes

- Each stage declares its input files, parameters and output files. A stage is cached when the SHA-256 fingerprint of (stage id, version, params, input file hashes) is unchanged **and** every recorded output still has its recorded hash. The fingerprint is recomputed after the run, so stages that create their own inputs (S0 copies the config) cache on the second run. State lives in `<part>/.pipeline/state.json` with paths relative to OPENLECTERN_HOME.
- `--resume` is accepted for clarity, but every run resumes: finished stages are always cached. `--force [S7,S8]` re-runs named stages (or all).
- Every run writes `workspace/books/<id>/runs/last.json` listing each stage as ran, cached or failed with its duration; the Phase 6 verifier and CI read it.
- Exit codes: 0 when the only blocking findings are Q-MOCK and Q-DRAFT (configuration, not content); 2 (NEEDS_HUMAN) when content findings remain after the repair loop, with `.pipeline/NEEDS_HUMAN.md`; 75 for agent hand-off; 76 when the manual research flow waits for the pasted NotebookLM answer. S13/S14 still run on NEEDS_HUMAN so the draft and its QA report land in `out/<book>/drafts`.
- Repair loop: BLOCKER/HIGH content findings map to the stage named by the check registry's repairStage; the runner writes `.pipeline/repair/<stage>.json` (added to the next prompt as repair feedback) and re-runs from the earliest such stage, at most 3 times. The loop does not run with the mock or replay providers, whose outputs cannot change.
- LLM task inputs never include --lang, --scenes or --draft, so a draft scene subset and the full render share the same cached S2-S9 artifacts.

## D-020: Stage details

- Orientation and Synthesis research is the concatenation of the chapters' research files (headings demoted one level), not a separate NotebookLM query; their scene layouts come from src/pipeline/layout.ts.
- The course map (S2) is book-level: it is computed once and shared by all parts through sidecar files (`.pipeline/course_map.input.sha`, `course_map.mock`) in the book folder; S2 adds the Orientation (and, when selected, Synthesis) entries deterministically.
- Beat audio is named `audio/<lang>/<beatId>.{wav|mp3}` with `.hash` (A-02) and `.json` (word timings) sidecars. Cues whose anchor is not found in the word timings fire at the beat start and are listed in `unresolvedCues` (A-06 reports them).
- Two stills per beat (mid-beat and end-of-beat, at least 18 frames after the last cue) feed L5 and the report; the contact sheet uses the end stills.
- The L6 expert review is skipped (Q-REVIEW skipped with a reason) for mock LLM runs, drafts, scene subsets and --no-review; release always needs a full, non-draft render.
- Q-FALLBACK (TTS fell back to Piper) is LOW: it is reported but does not block release, since the fallback voice is still intelligible and synced.
- Renders use `colorSpace: "bt709"` so the H.264 stream is tv-range yuv420p (Remotion's default bt601 path writes full-range yuvj420p, which some players mis-render and R-01 rejects).
- P-07 (quiz terms introduced before the quiz) compares the quiz, which is shown in the display language, with that language's narration and each beat's newTerms; transliterated Hindi narration is not expected to contain the English term.

## D-021: CLI and wizard

- `openlectern start` is the B.2 wizard (@clack/prompts). Every answer has a flag; with --non-interactive (or no TTY) it builds or edits the config from flags and the example/previous config, then delegates to `make` when --chapter or --all is given. Re-running edits the existing config: unspecified answers keep their previous values.
- Default personas: en Alex / Dr. Rivera (Aria / Christopher), hi Raju / Sharma ji (Madhur / Swara); other languages get "Sam" and "Professor" with the provider's default voice. Default LLM: agent-handoff without a TTY or keys, else the first key found (OpenAI-compatible, Anthropic, Gemini).
- `make --all` first runs S0-S2 on the first chapter to get the course map, then every deliverable part in order: chapters (filtered by deliverables.chapters), Orientation, Synthesis.
- `run <stage>` and `qa` run one stage alone, forced, on existing artifacts. `qa --fixture <dir>` runs S10-S12 (mock TTS, mock provenance) on a fixture folder (fixture.json, book/, part/) in an isolated home under --out.
- During the build, `npx tsc` hung on this host; the project's typecheck script runs tsc directly. (Build-host note only.)

## D-022: QA fixture harness (Phase 7)

- `tests/fixtures/qa/clean` is a real part (the demo's ch01 p1 artifacts) with `fixture.json` listing the languages and scenes to compile and render. `qa --fixture` renders scenes 0 and 9 (the hook and the quiz) in English: about 100 s of video, so the clean check runs in minutes. The other scenes still go through L1-L3.
- Each bad fixture (`tests/fixtures/bad/<ID>/fixture.json`) describes one defect as JSON-pointer or find/replace patches on the clean artifacts, plus, for L4/L5 and Q checks, overrides for synthetic media (missing, stale or quiet audio, internal silence, wrong size, black or frozen frames, overflow/collision/background/highlight diagnostics on stills) or for the injected ASR/OCR text and release flags.
- `tests/qa/harness.ts` evaluates fixtures with `runPartChecks` (the same L1-L5 orchestration S12 uses, in `src/qa/part.ts`) on a synthetic, non-mock timeline and ffmpeg-generated media, so the suite is deterministic and needs neither Edge TTS, Whisper, Tesseract nor a Remotion render. ASR (A-07) and OCR (R-05) are dependency-injected; the CLI uses Whisper/Tesseract when installed.
- A fixture passes when the findings it adds, compared with the clean baseline under the same layer options, are non-empty and all carry its id. Audio (L4) and render (L5) checks run only for A- and R- fixtures, which keeps the 49-fixture suite to a few minutes.

## D-023: Hidden elements are not shifted

- The first Phase 6 runs reported R-04 overflow on the summary scene (626 px of content in a 608 px main area) for every beat before rule 8 appears. The cause was the entrance style: a not-yet-revealed element sat at opacity 0 but was still translated 18 px down, and Chrome counts transformed boxes in the scroll height. `revealStyle` now applies the offset only while an element is entering (amount > 0); stills are taken after entrances finish, so real overflow is still caught.

## D-024 Collegiate Single-Instructor Masterclass Narration and Technical Panel Mechanism

- Context: The original reference paradigm relied on juvenile two-person banter (novice vs mentor) and cartoon speech bubbles on screen. For serious academic, quantitative finance, and institutional textbooks, learners require an authoritative, calm, and rigorous single-instructor masterclass format.
- Options: Maintain dialogue banter with voice switching; completely eliminate speech bubbles and alternating voices in favor of an authoritative single-instructor collegiate masterclass with structured pedagogical layouts.
- Choice:
  1. Narration: A single, authoritative professor/practitioner speaks directly to the learner. Zero two-person dialogues, zero alternating voices, and no artificial junior-vs-mentor banter.
  2. Voice: `en-US-ChristopherNeural` via Microsoft Edge-TTS is configured as the English voice for the entire course (male, collegiate/institutional masterclass narrator, calm, articulate, measured).
  3. Visual Presentation (`technical_panel`): On-screen chat bubbles are replaced with structured pedagogical presentations:
     - Two-Party Economic Mechanism (`two_party_mechanism`): Left Entity (Long / Buyer in cyan `#59BFC3`) with supply obligation and economic motivation; Right Entity (Short / Seller in gold `#E5C45B`) with harvest obligation and price protection motivation; Central Contract Conduit with exact transaction specifications; Causal Failure Callout highlighting bilateral counterparty default risk without a centralized clearinghouse.
     - 4-Pillar Structural Framework (`single_concept`): Primary technical card outlining the 4 institutional pillars (The Commercial Dilemma, Risk Unbundling, Quantitative Engineering, and The Unified Chapter Chain) paired with a secondary risk architecture panel.
     - Structured collegiate presentation cards for standard narrative beats.
  4. Canvas Base Background: `#171717` (Dark Charcoal) with a subtle radial depth gradient: `radial-gradient(ellipse at 50% 30%, #1E1E1E 0%, #131313 100%)`.
- Reason: Provides broadcast-grade instructional authority, prevents juvenile dialogue, and visually clarifies complex multi-party and institutional economic mechanics.
