# Bootstrap Prompt: Open-Source Book-to-Video Lesson Engine

How to use this file:

Prerequisites (once per machine): Node.js 20+, Git with `user.name`/`user.email` configured, ffmpeg on PATH (optional; the build falls back to `ffmpeg-static`), internet access (npm, Remotion's headless Chrome download, Edge TTS). Optional: an `nlm` NotebookLM CLI already logged in, Tesseract, whisper.cpp.

Option A - Visual Studio 2026 with GitHub Copilot agent mode (primary):

1. Prepare the empty project folder (git init, copies this prompt to `docs/BOOTSTRAP_PROMPT.md`, writes the always-on build-mode block in `.github/copilot-instructions.md`, adds `/start-build` and `/continue-build` prompt files, makes the first commit, and optionally opens Visual Studio):
   ```
   powershell -ExecutionPolicy Bypass -File <path-to>\docs\bootstrap\new-project-vs.ps1 -ProjectDir C:\code\openlectern -OpenVisualStudio
   ```
2. In Visual Studio: File > Open > Folder (if not opened automatically). Tools > Options > GitHub > Copilot > Copilot Chat: enable "custom instructions loaded from .github/copilot-instructions.md" (and prompt files if listed).
3. Open Copilot Chat, switch to **Agent** mode, pick the strongest model available in the model picker, and turn on autopilot / auto-approval of tool and terminal calls so the agent never waits for a click.
4. Send `/start-build` (or attach the prompt file `start-build` via the `#` / Attach context > Prompt menu, or type: `Read docs/BOOTSTRAP_PROMPT.md and execute it`).
5. The agent runs the Part L loop inside the chat; Visual Studio summarizes long history automatically and the build-mode instructions bring the agent back to the state files after every summary. If the chat ever stops before the build is verified (thread limit, IDE restart, premium-request limit), open a new chat thread in Agent mode and send `/continue-build`. That is the only thing you ever type.

Option B - fully unattended overnight from a terminal (same folder, same GitHub Copilot subscription via the Copilot CLI, or another agent CLI). Do not run it while an IDE agent is working on the same folder:

```
powershell -ExecutionPolicy Bypass -File <path-to>\docs\bootstrap\build-loop.ps1 -Agent copilot
```

The harness relaunches the agent until its own run of `npm run verify:done` exits 0 and the working tree is clean, detecting stalls, rate limits, and verifier tampering. Logs: `.build/logs/`. Other agents: `-Agent claude|codex|gemini|cursor|custom`; macOS/Linux: `build-loop.sh`.

Step that needs a human once: NotebookLM login (browser) if you want the connector tested live. It does not block the build.

The prompt was distilled from a full analysis of the `Video-Generator` reference project (its `docs/` methodology, `src/templates/CANONICAL_SCRIPT_SOUL.md`, orientation/synthesis paradigms, `src/specs/*`, QA engine, TTS compiler, and the production history of ~60 rendered chapters, including the failure modes that history exposed).

=== PROMPT START ===

# ROLE AND MISSION

You are a senior full-stack engineer, instructional designer, and release engineer working fully autonomously. Build, from an empty folder, a production-quality, open-source, plug-and-play application named **OpenLectern** (you may keep this name) that converts a book the user is legally entitled to use into a series of narrated, animated, broadcast-grade (1920x1080, 30 fps, H.264/AAC) educational videos — one video per chapter part — plus an optional Orientation video (watched before Chapter 1) and a whole-book Synthesis video (capstone).

The learner who watches these videos must never need to open the book: every material idea, definition, formula, number, worked example, and caveat from the source must be taught clearly, causally, and in beginner-friendly language, while staying 100% faithful to the source.

## Autonomy contract (read carefully)

- Execution model: follow the **Part L autonomous build loop** exactly. It defines the objective phase verifiers, the state file, the stuck protocol, the checkpoint rule, and the only legitimate reasons to end a session. You may be driven inside Visual Studio 2026 Copilot agent mode (primary; obey the host rules in Part L.9) or relaunched by an external harness; either way you have no reliable memory between sessions or after a history summary, so the repository files are your memory.
- Resume rule: at the start of every session, read `docs/BOOTSTRAP_PROMPT.md`, `.build/harness_note.md` (if present; address it first), `.build/state.json`, `docs/BUILD_LOG.md`, `docs/DECISIONS.md`, run `git log --oneline -20`, then run `npm run verify:status` (once it exists) and continue from the first unverified phase. Never restart completed phases. Before your context or session ends, checkpoint per Part L.5.
- Save this prompt verbatim as `docs/BOOTSTRAP_PROMPT.md` in Phase 0 if it is not already there (the harness places it for you).
- Do NOT ask the developer any question at any point. When something is ambiguous, choose the most reasonable, conservative, open-source-friendly option, record it in `docs/DECISIONS.md` (one entry per decision: context, options, choice, reason), and continue.
- Work in a loop: PLAN -> IMPLEMENT -> RUN -> VERIFY -> FIX, until every acceptance criterion in the "Definition of Done" section passes. Never declare success on the basis of code that has not been executed.
- Keep a living checklist in `docs/BUILD_LOG.md` (phase, task, status, evidence command, result). Update it after every phase.
- If a tool or dependency is unavailable on the machine (e.g., ffmpeg, Chromium, Python), install it via the package manager when possible; otherwise implement a graceful fallback and document it. Never stop the build because of one missing optional tool.
- Commit locally after each completed phase with Conventional Commit messages (`feat:`, `fix:`, `test:`, `docs:`, `chore:`). Local commits are the build's checkpoints only: never tag, add remotes, create repositories, or push.
- Never place secrets, cookies, tokens, personal paths, or copyrighted book text in the repository.

The ONLY interactive questions in the whole system are the ones the finished application asks its END USER at runtime (book details, NotebookLM availability, etc.). The developer building it is never asked anything.

---

# PART A — LESSONS LEARNED FROM THE REFERENCE PROJECT (DESIGN THESE OUT)

The reference implementation produced good videos but accumulated problems. Your design must make each of these impossible by construction or caught automatically:

1. **One-off scripts per chapter.** It accumulated ~190 scripts such as `build_ch12_part1.mjs`, `verify_video37.mjs`, `fix_ch15_audio.mjs`. Rule: zero chapter-specific code. Every capability is a generic, parameterized pipeline stage. Chapter differences live only in data.
2. **Hard-coded book detection** (`/hull/i.test(input)`, hard-coded book titles and curriculum file names). Rule: everything book-specific comes from `book.config.json` created by the wizard.
3. **Proprietary/fragile model access** (a local cookie-scraping proxy, IDE-only models, absolute paths like `C:\Users\<name>\...`). Rule: pluggable providers behind interfaces; default path must work with zero paid keys (see "Agent-as-LLM mode").
4. **Two conflicting visual baselines** (a light `#F7F6F2` spec and a dark `#171717` spec). Rule: exactly one design-token file is the source of truth; themes are data; QA checks rendered frames against the active theme.
5. **Stale/boilerplate leakage.** Cards, chat bubbles, comparison columns, and summary rules from Chapter 1 were copied into later chapters (e.g., the same "1848 corn farmers" story on unrelated chapters). Rule: Bespoke-content gate (Part F, check C-05..C-09).
6. **Broken formulas on screen** such as `/text{Profit}`, `\text{...}` shown raw, `ext{` (tab ate `\t`), `rac{a}{b}` (form-feed ate `\f`), `eta` (backspace ate `\b`), raw underscores `S_T`, and doubled escapes `\\\\frac`. Root cause: LaTeX inside JSON strings with wrong escaping, and renderers that print strings instead of typesetting them. Rule: Formula pipeline in Part E.4 plus checks C-10..C-14.
7. **`[object Object]`, `undefined`, `NaN`, empty cards** appearing on screen. Rule: typed view-models plus render-time and OCR checks.
8. **Quiz answer spoilers** like `(Correct)` / `(सही उत्तर)` inside options. Rule: check P-09.
9. **Script workflow not wired to rendering** (README admitted it). Rule: one command takes a chapter from source to released MP4.
10. **No license, `private: true`, `UNLICENSED`.** Rule: open-source readiness in Part H.
11. **Retry loops without limits** and silent fallbacks. Rule: bounded repair loop (max 3 iterations per gate) with an explicit failure report.

---

# PART B — PRODUCT REQUIREMENTS (WHAT THE END USER EXPERIENCES)

## B.1 Plug-and-play first run

```
git clone <repo> && cd openlectern
npm install            # postinstall runs `openlectern doctor` (non-fatal)
npm start              # launches the interactive wizard
```

`openlectern doctor` checks and reports (with fix commands per OS): Node version, ffmpeg/ffprobe, Chromium for Remotion, disk space, optional `nlm` CLI / NotebookLM MCP, optional local TTS (Piper), optional Whisper (whisper.cpp) for ASR QA, optional Tesseract for OCR QA. Missing optional tools only downgrade features; they never block the default path.

## B.2 The wizard (runtime questions to the END USER, all with defaults and all re-answerable via flags for non-interactive/CI use)

1. Book title, author, edition, subject domain (free text), and confirmation: "Do you own or have the right to use this book for personal/educational transformation?" (record the answer in the book config; refuse to proceed on "no").
2. Target audience level (absolute beginner / intermediate / advanced). Default: absolute beginner.
3. Narration language(s): `en`, `hi` (Hinglish in Devanagari), or any Edge/Piper-supported locale. On-screen text language (default: English). Bilingual output produces one MP4 per language with identical visuals.
4. Persona pair (novice + mentor) — defaults chosen by domain and language (e.g., en: "Alex" & "Dr. Rivera"; hi: "Raju" & "Sharma ji"), editable.
5. Chapter list: paste a table of contents, or let the app fetch it from NotebookLM, or detect it from a local source file.
6. Target length per video part (default 10–14 minutes). The app splits long chapters into parts automatically (Part C, stage S2).
7. **"Is this book already uploaded to a Google NotebookLM notebook?"**
   - **Yes** -> run the NotebookLM Connector flow (B.3).
   - **No** -> run the Manual Research flow (B.4).
8. LLM provider (B.5) and TTS provider (Part E.6). Defaults: Agent-as-LLM mode if running inside an AI coding agent, else the first configured key found in `.env`, else Agent-as-LLM file hand-off; Edge TTS for voice.
9. Which deliverables: Orientation video, chapter videos (all or a range), Synthesis video.

Answers are saved to `workspace/books/<book_id>/book.config.json` (validated by Zod). Re-running the wizard edits rather than overwrites.

## B.3 NotebookLM Connector flow (user said "yes")

Implement a `ResearchConnector` interface with these adapters, tried in order, auto-detected:

1. **NotebookLM MCP server** (if the host agent exposes NotebookLM MCP tools, the agent uses them directly).
2. **`nlm` CLI** (detect on PATH; support the common community CLIs by probing `nlm --help` output; commands such as `nlm login`/`nlm auth`, `nlm notebook list`, `nlm source list <id>`, `nlm query notebook <id> "<q>"` or `nlm chat <id> "<q>"`). Wrap each in a small adapter keyed by detected CLI flavor. Never store cookies in the repo; rely on the CLI's own credential store.
3. If neither works after authentication attempts, fall back automatically to B.4 and tell the user exactly why.

Flow: authenticate -> list notebooks -> let the user pick (fuzzy-match by book title, confirm) -> list sources -> for each chapter part run the **Chapter Extraction Prompt** (below), chunked so each answer stays within the tool's limits (one query per sub-topic if needed) -> save raw responses verbatim to `workspace/books/<book_id>/chapters/<chapter_id>/research/notebook_context.md` with a header block (notebook id, source ids, query text, timestamp, connector name, SHA-256). Then continue the pipeline automatically.

## B.4 Manual Research flow (user said "no" or connector failed)

1. Generate, per chapter part, a ready-to-paste file `workspace/books/<book_id>/chapters/<chapter_id>/research/PASTE_INTO_NOTEBOOKLM.md` containing the Chapter Extraction Prompt filled with the book, chapter, and part details, plus step-by-step instructions: create a notebook, upload the book PDF/EPUB you own, paste the prompt, copy the full answer.
2. Tell the user the exact drop path: `.../research/notebook_context.md` (create an empty file with a template header so they only paste).
3. Also offer: "Provide a local file path to a PDF/EPUB/TXT/DOCX you own" -> extract text locally (pdf.js / epub parser / mammoth), split by chapter headings, and store under `workspace/` (git-ignored). This path works fully offline.
4. `npm start -- --resume` (or `openlectern watch`) detects when the file appears, validates it is non-trivial (length, contains citations/page refs, not the template), and resumes the pipeline.

## B.5 Chapter Extraction Prompt (ship as `prompts/research/chapter_extraction.md`, templated)

The prompt must ask NotebookLM (or the LLM over local text) to return, for the given chapter part, in clearly delimited Markdown sections:

- Chapter scope: sections and page ranges covered by this part; what belongs to the next part.
- Exhaustive fact ledger: every definition, claim, rule, threshold, formula (in LaTeX, with each variable defined and its unit), numerical/worked example (all inputs, intermediate steps, and the result), case study, historical event (who/when/where/numbers), assumption, limitation, and common mistake the author warns about — each with a section/page citation. Target 15–40 facts per part; never fewer than 10.
- The real-world problem the chapter's main idea solves, as the author or the field describes it (actors, situation, failure, invention).
- Terms and acronyms introduced, with the author's definition.
- Dependencies: which earlier chapters/concepts this part relies on; which later chapters build on it.
- Exact quotations: at most 2 short quotes (under 25 words each) where wording matters; everything else paraphrased.
- "Do not invent. If the book does not say it, write NOT IN SOURCE."

## B.6 LLM providers and Agent-as-LLM mode

Interface `LlmProvider { complete(task: LlmTask): Promise<LlmResult> }` with adapters:

- `agent-handoff` (DEFAULT, zero keys): the pipeline writes `workspace/.tasks/<task_id>/prompt.md` + `input.json` + `output.schema.json` and then behaves per `--handoff <mode>`:
  - `exit` (default when stdout is not a TTY, i.e., whenever an agent runs it): print one line per pending task `AWAITING_AGENT <task_id> <path>` and exit with code 75. The agent answers every pending task, runs `openlectern task:validate <task_id>` (schema + content gates for that task), and re-runs the same command; completed stages are cached, so the run resumes at the first unanswered task. Never use a blocking poll inside an agent, because it freezes the agent's terminal.
  - `poll` (default for a human at a TTY): print instructions and poll for `output.json` every 2 s, with a timeout.
  Ship `AGENTS.md`/`CLAUDE.md`/`.github/copilot-instructions.md` that teach any agent this protocol and the content standards it must obey while answering.
- `replay` (tests and CI): returns recorded outputs from `examples/<book>/recorded/<task_hash>.json`; a missing recording is a test failure with the task hash printed. After the Phase 8 demo outputs pass QA, record them so CI reproduces the full pipeline with no keys and no agent.
- `mock` (tests only): returns hand-authored fixture outputs from `tests/fixtures/llm/<task_kind>/<chapter>.json`. These are schema-valid and content-valid for the demo-book scenes used by pipeline tests (Phase 6), so the gates run for real. Any artifact produced with `mock` is stamped `provenance.mock: true` and the QA gate refuses to release it (BLOCKER Q-MOCK).
- `openai-compatible` (any base URL: OpenAI, OpenRouter, Groq, Together, LM Studio, vLLM, Ollama `/v1`).
- `anthropic`, `gemini` (official SDKs, keys from `.env` only).
- `ollama` (local).

Every LLM call: typed task, prompt template from `prompts/`, JSON output validated by Zod, up to 2 schema-repair retries, cached by SHA-256 of (template version + inputs + model), recorded in `workspace/ledger.jsonl` (task, provider, model, tokens, cost, duration, cache hit). Deterministic stages never call an LLM.

---

# PART C — THE PIPELINE (ONE COMMAND, RESUMABLE, IDEMPOTENT)

`openlectern make --book <id> --chapter <ch> [--part <n>] [--lang en,hi]` runs stages S0..S14 for that part. `openlectern make --book <id> --all` runs every part, then Orientation and Synthesis if selected. Each stage reads and writes typed artifacts, is skipped when its input hashes are unchanged, and can be re-run alone (`openlectern run S7 ...`). A stage that fails its gate triggers the bounded repair loop for that stage only.

Workspace layout (all git-ignored except `examples/`):

```
workspace/books/<book_id>/
  book.config.json
  course_map.json                 # modules, chapters, parts, prerequisites
  course_glossary.json            # cross-chapter concept register (who introduced what, where)
  chapters/<chapter_id>/<part_id>/
    research/notebook_context.md
    01_source_facts.json
    02_content_audit.json
    03_concept_register.json
    04_lesson_plan.json
    05_teaching_script.md          # human-readable narration script (the "background script")
    06_visual_brief.json
    07_storyboard.json
    08_episode.json                # scenes, beats, narration, typed visuals
    09_episode_compiled.json       # measured audio, frames, word timings, cues
    audio/<lang>/<beat_id>.mp3 (+ .hash, .words.json)
    qa/report.json, qa/report.html, qa/frames/*.png, qa/contact_sheet.png
out/<book_id>/<chapter_id>_<part_id>_<lang>.mp4 (+ .srt, .vtt, chapters.txt, thumbnail.png, description.md)
```

| Stage | Name | Engine | Output | Gate |
| --- | --- | --- | --- | --- |
| S0 | Book setup | Wizard | `book.config.json` | schema, rights confirmed |
| S1 | Research ingest | Connector or manual | `notebook_context.md` | non-template, length, citations present |
| S2 | Course map and part split | LLM + deterministic | `course_map.json` | every chapter covered, parts sized to target length, prerequisites acyclic |
| S3 | Fact extraction | LLM | `01_source_facts.json` | >= 10 facts, each cited, formulas parse, numbers recomputed |
| S4 | Content audit | Deterministic | `02_content_audit.json` | PASS / CONDITIONAL_PASS |
| S5 | Concept register | LLM + deterministic | `03_concept_register.json`, glossary update | every term in facts registered; familiarity resolved from course glossary |
| S6 | Lesson plan | LLM | `04_lesson_plan.json` | 8-stage progression mapped, outcomes, misconception, prediction questions |
| S7 | Teaching script | LLM | `05_teaching_script.md` | Narration Craft gate (Part D.3) and JIT gate |
| S8 | Visual brief and storyboard | LLM + diversity engine | `06`, `07` | diversity and template-fit rules |
| S9 | Episode build | Deterministic scaffold + LLM fill | `08_episode.json` | schema + all content gates (Part F) |
| S10 | TTS | Provider | audio, `09_episode_compiled.json` | audio gates |
| S11 | Render | Remotion | MP4 + stills | render gates |
| S12 | QA release gate | Deterministic + optional LLM-vision judge | `qa/report.*` | 0 BLOCKER, 0 HIGH |
| S13 | Packaging | Deterministic | SRT/VTT, chapters, thumbnail, description | files present and valid |
| S14 | Course index | Deterministic | `out/<book_id>/index.html` playlist | links valid |

Orientation and Synthesis use the same stages with different scene paradigms (Part D.6).

---

# PART D — PEDAGOGICAL METHODOLOGY (NON-NEGOTIABLE, PORTED FROM THE REFERENCE `docs/`)

Ship these as Markdown standards under `docs/standards/` AND enforce them in code. Code is the source of truth for enforcement; docs explain the why.

## D.1 Source grounding

- `01_source_facts.json` is the only allowed source of claims, numbers, and formulas. Every beat's visual cites `sourceFactIds` that exist.
- Illustrative numbers not in the source must carry a visible badge `HYPOTHETICAL EXAMPLE` and `isHypothetical: true`.
- Fact schema: `id`, `category` (definition | claim | rule | formula | numerical_example | case_study | historical_event | assumption | limitation | misconception), `statement`, `citation` (chapter, section, page), optional `formula` { latex, variables[{symbol, meaning, unit}] }, optional `numbers` { inputs, steps, result, unit }.

## D.2 The 8-stage learning progression (every core concept)

1. Intuition (everyday analogy) -> 2. Why it exists (the real dilemma) -> 3. What it means (plain definition + notation) -> 4. How it works (step-by-step mechanism) -> 5. Worked example (real source numbers) -> 6. Guided application (intermediate steps before the answer) -> 7. Independent application (quiz with thinking pause) -> 8. Limitations and boundaries.

Also required per part: at least one inline prediction question before a reveal; at least one explicit causal chain card `Condition -> Action -> Mechanism -> Result -> Consequence`; a "Where we are" course-positioning roadmap in Scene 0 and Scene 10; a `COMMON NOVICE TRAP` vs `PROFESSIONAL REALITY` split in Scene 10 or Scene 6.

## D.3 Narration Craft Standard — the "background script", made vivid, informative, and clear

`05_teaching_script.md` is the narration every learner hears. It must read like an excellent teacher talking, not like a textbook being read aloud. Enforce:

**Vividness**
- Open every part with a concrete scene: who, where, when, what is at stake, with real numbers from the source (or badged hypothetical ones). The listener should be able to picture it in the first 15 seconds.
- Use sensory and situational detail sparingly but specifically ("a wheat farmer in June, looking at a field that won't be harvested until September") instead of abstractions ("market participants face uncertainty").
- Use one fresh, domain-appropriate analogy per core concept; never reuse an analogy already used in another part (checked against `course_glossary.json`).
- Use contrast and tension: what most people believe vs what actually happens.

**Informativeness**
- Every scene must teach at least one cited fact; no filler scenes.
- Every mechanism answers the six causal questions: what causes it, why it happens, what changes, who is affected, what happens next, why it matters.
- Every number is explained: what it is, where it comes from, and what it means for the learner.
- Worked examples are spoken step by step, matching the on-screen steps one-to-one.

**Clarity**
- One idea per sentence; 8–22 words per sentence on average; no sentence over 35 words.
- Signpost transitions ("First...", "Now here's the problem...", "Let's put real numbers on it...").
- Recap the key idea in one line at the end of each scene.
- Speak numbers, units, and symbols the way a teacher would ("S sub T", "five percent", "two thousand two hundred forty dollars"); keep a `display` form for the screen and a `spoken` form for TTS on every beat.
- Words-per-beat budget: 25–75 words (about 10–30 seconds). Split longer beats.

**Just-in-time concept clarification (the core law: never assume the learner knows the term)**
At the first mention of any term, acronym, symbol, or specialized concept, the narration runs the 6-step sequence: say the term -> expand the abbreviation -> one-sentence plain meaning -> meaning in this context -> short analogy or example -> continue. Assign an explanation depth: L1 quick gloss (5–12 s), L2 intuition (12–25 s), L3 mechanism (25–45 s), L4 application with worked numbers (45 s+). Re-gloss briefly (3–5 words) when a term reappears after 3+ scenes. Bridge every new concept to something already taught ("Earlier we saw X; this is its mirror image because..."). The on-screen companion is a compact Concept Clarification panel (TERM, FULL FORM, SIMPLE MEANING, ROLE HERE, CONNECTS TO) that never covers the main diagram.

**Dialogue**
- Novice asks the questions real beginners ask (including wrong guesses); mentor answers. No skits, jokes, or off-topic banter.
- Hindi narration: natural conversational Hinglish in Devanagari; keep standard technical terms in English pronunciation; on-screen text stays in the chosen display language.

The script file format: per scene, per beat: `speaker`, `narration.<lang>.spoken`, `subtitle.<lang>` (max 16 words per caption phrase), `onScreenIntent`, `sourceFactIds`, `newTerms`, `pauseAfterMs`.

## D.4 Canonical 12-scene structure (chapter parts)

| Scene | Template (default) | Beats | Purpose |
| --- | --- | --- | --- |
| 0 | chat_story | 4 | Problem-first hook: b1 novice asks about a real struggle; b2 mentor sets concrete situation and actors; b3 the trap or failure; b4 the author's invention or solution. Plus "where we are" roadmap. No dry definitions. |
| 1 | tug_of_war | 3 | The two opposing forces from the hook, and how the concept resolves them. |
| 2 | progressive_cards | 4 | The 4 pillars of the solution (the part's roadmap). |
| 3–8 | chosen per concept | 1–3 each | Deep dive: definitions, mechanisms, formulas, charts, causal chains, worked example, guided application, limitations. |
| 9 | interactive_quiz | 3 | b1 question (scenario >= 18 words) with 4 options A–D in a 2x2 grid; b2 thinking pause (>= 3 s, spinner, options visible); b3 reveal: correct option green with check badge, others at 45% opacity, explanation banner. |
| 10 | chat_story | 2–3 | Mentor wisdom tied back to the opening trap; misconception vs reality. |
| 11 | summary_thread | 6 | Exactly 8 rules: beats show ranges [0,0] roadmap, [1,2], [3,4], [5,6], [7,8] (rule 8 must get its own spotlight), then [1,8] compact 2-column overview. Narration names the rule numbers shown. |

Scene templates beyond the defaults may be chosen when the concept topology fits better (Part E.3), but scene purposes and beat counts for scenes 0, 9, 11 are fixed.

## D.5 Assessment rules

Quiz options never contain spoiler markers (regex `/\((?:correct|answer|true|right|उचित|सही|उत्तर)\)/i`), are plausible and distinct, test only terms already explained in this part or earlier parts, and the answer is identified only by `correctIndex`.

## D.6 Orientation and Synthesis paradigms

- **Orientation (~5–7 min, before Chapter 1):** dismantle intimidation, bust the biggest myth about the subject, show the 4 "superpowers" the book gives, show the reading journey (modules), demystify the single scariest formula in plain words, quiz, 8 reader's commandments. All content generated from this book's course map and facts — no reuse of another book's orientation.
- **Synthesis (capstone):** a dialectical chain across chapters: Tool A -> its fatal limitation -> the failure it caused -> the author's next invention (Tool B) -> ... Built from all parts' facts and the course glossary; includes "how to use the whole toolkit together" and 8 master laws.

---

# PART E — ENGINE, VISUALS, FORMULAS, AUDIO

## E.1 Stack

- Node.js 20+ with TypeScript (strict), pnpm or npm workspaces optional (keep simple if not needed).
- Remotion 4 (React 19) for rendering; Tailwind or CSS-in-TS with design tokens.
- Zod for every artifact schema; JSON Schema exported from Zod for LLM structured output.
- KaTeX for math (server-side `renderToString` with `throwOnError: true` during validation; rendered HTML in Remotion).
- mathjs for recomputing numbers.
- ffmpeg/ffprobe (via system binary or `ffmpeg-static`/`ffprobe-static`) for measurement, loudness, frame extraction.
- Commander/Clack (or Inquirer) for CLI and wizard.
- Vitest for tests; ESLint + Prettier; Playwright not required (Remotion stills are enough).
- Versions: pin exact versions in `package.json` (no `^`/`~`) and commit the lockfile. All `remotion` and `@remotion/*` packages must have the identical version (add a test for this). Use the latest stable releases available at build time; check each package's README/changelog in `node_modules` rather than relying on memory for APIs. Run `npx remotion browser ensure` in `doctor` and before the first render.
- Rendering performance: render programmatically with `@remotion/bundler` + `@remotion/renderer` (`renderMedia`, `renderStill`), bundle once per run, concurrency = half the CPU cores, and support `--draft` (scale 0.5, CRF 28, used only for tests/CI; draft renders are never releasable) and `--scenes <list>` (subset render for tests and repair loops).

## E.2 Design system (single source of truth)

`src/theme/tokens.ts` with themes as data. Default theme "Dark Technical Classroom": background `#171717` with subtle vignette, panels `#252525`, borders `#454545`, gold `#E5C45B` headings/key terms, teal `#59BFC3` definitions, green `#8ACB91` positive/correct, coral `#D98278` risk/error, blue `#79A9D8` process/neutral, purple `#B49AD9` secondary; text `#F2F2F2`. Also ship a light theme. Layout: header `COURSE · CHAPTER · PART` with segmented progress pills; scene title; main teaching panel; persistent `POINTS TO REMEMBER` footer (max 3 takeaways for the current scene); captions centered above the footer, never overlapping it, active phrase highlighted in gold. Fonts: open-licensed (Inter, JetBrains Mono, Noto Sans Devanagari), bundled locally with their OFL licenses. Contrast WCAG AA minimum; color-blind-safe pairing (never rely on red/green alone — add icons).

## E.3 Template registry (Level 1 / 2 / 3 template intelligence)

Implement domain-agnostic templates, each with a Zod data schema, a typed view-model, animation targets, and a fallback:
`chat_story`, `tug_of_war`, `progressive_cards`, `split_comparison`, `formula_breakdown`, `causal_chain`, `diagram_flow` (nodes/edges, timeline mode), `data_chart` (line/bar/area/scatter/candlestick via domain preset), `stat_counter`, `table_compare`, `concept_clarification` (overlay panel), `worked_example` (stepwise numbers), `interactive_quiz`, `summary_thread`, `roadmap`, `composite_layout` (Level 2: two templates side-by-side or stacked, pure JSON). Domain extensions (e.g., finance payoff diagrams, physics vectors) live in `src/domains/<name>/` and are enabled per book.

Level 3 (new template) is allowed only through `openlectern template:propose` -> spec -> code -> schema test -> still render -> QA -> registry entry, with tests.

Diversity engine rules per part: no identical template in adjacent scenes unless `pedagogicalContinuation: true`; no template above 30% of scenes; at least 5 distinct templates; template choice justified by concept topology (process -> causal_chain/diagram_flow; comparison -> split_comparison/table_compare; quantity over time -> data_chart; formula -> formula_breakdown/worked_example).

## E.4 On-screen visual ("background slide") quality — bespoke, dense, correct

Every beat's visual must be authored for that beat's narration in this part. Requirements:

- **Derived, not inherited.** Visual text is generated from this part's facts and this beat's narration. The scaffold contains only structure (template, ids, beat count), never content. Placeholder tokens (`TODO`, `TBD`, `lorem`, `{{`, `}}`, `[insert`, `XXX`, `PLACEHOLDER`, `Sample`, `Example Title`) are BLOCKERs.
- **Synchronized.** Each element appears via a `visualCue` anchored to a word timestamp from TTS (e.g., reveal step 2 when the narrator says "multiply"), not by percentage interpolation and not by parsing narration.
- **Informative density.** Each main panel shows the key term, the relationship (arrow, chain, comparison, chart), and the number or formula being discussed; footer shows up to 3 takeaways. Max ~45 words on the main panel at once; minimum font sizes: hero equation 44 px, card body 24 px, labels 18 px.
- **Charts:** both axes labeled with variable and unit; key points (strike, break-even, peaks) marked; curve data computed from the formula, not hand-typed; hypothetical charts watermarked `ILLUSTRATIVE MODEL`.
- **Formula pipeline (fixes the `/text` class of bugs):**
  1. Formulas are stored ONLY in a `latex` field of a typed `Formula` object, never inside free text. Free text that needs math uses inline segments `{ type: "math", latex }`.
  2. LLM outputs are parsed as JSON; after parsing, scan every string for control characters U+0000–U+001F (in `latex` fields this includes newline) — their presence means a JSON escape swallowed a LaTeX backslash: `\t` (`\text`, `\times`, `\theta`), `\f` (`\frac`), `\b` (`\beta`, `\bar`), `\r` (`\right`, `\rho`), `\n` (`\neq`, `\nu`, `\nabla`). Also catch JSON parse failures caused by `\u` (`\underline`) or invalid escapes such as `\v`. Auto-repair by re-escaping from the raw text when possible, otherwise BLOCKER.
  3. Reject `/text`, `/frac`, `\\\\`-doubled commands, unbalanced braces, `$` delimiters inside `latex` fields, and raw `_`/`^` in plain-text fields shown on screen.
  4. Compile every `latex` with KaTeX `throwOnError: true, strict: "error"`; any error is a BLOCKER.
  5. Render the KaTeX HTML in Remotion; never print LaTeX source as text.
  6. Six-way agreement: the typeset equation, the recomputed arithmetic (mathjs over declared variables and substitution steps), the chart data, the on-screen annotations, the spoken narration numbers, and the stated conclusion must agree within declared rounding. Any mismatch is a BLOCKER.
  7. Every formula lists every variable with meaning and unit; substitution steps go definition -> substitution -> result.

## E.5 Data flow into React

Templates receive typed view-models produced by pure mapper functions (`toViewModel(beat, scene, theme)`); mappers handle polymorphic inputs (e.g., summary steps as objects or `"1. Title: Description"` strings) and never call `String(obj)`. Any field that would render empty, `undefined`, `null`, `NaN`, or `[object Object]` throws in development and is caught by QA. Remotion components report text overflow (measure `scrollWidth > clientWidth` / `scrollHeight > clientHeight` after layout) into a per-frame diagnostics channel written to `qa/overflow.json` during the QA still-render pass.

## E.6 Text-to-speech

Interface `TtsProvider { synthesize(text, voice, opts): { audioPath, wordBoundaries[] } }` with adapters:
- `edge` (default; free; Microsoft Edge online voices, e.g., `en-US-ChristopherNeural`, `en-US-AriaNeural`, `hi-IN-MadhurNeural`, `hi-IN-SwaraNeural`; capture word-boundary events for timing). Document that it uses an unofficial online endpoint.
- `piper` (fully open-source, offline). Automatic fallback when Edge fails 3 times in a row (network, token change, rate limit); the fallback is recorded in the compiled episode and the QA report.
- `openai`, `elevenlabs`, `google` (keys from `.env`).
- `mock` (tests and CI only): deterministic tone or silence of `words / 2.6` seconds with synthetic, evenly spaced word boundaries. Stamped `provenance.mock: true`; never releasable (BLOCKER Q-MOCK); A-04/A-07 are skipped for it.

Edge implementation: use a maintained Node library that exposes word-boundary metadata (for example `msedge-tts`; evaluate `node-edge-tts` too; record the choice in `docs/DECISIONS.md`). If a library cannot return word boundaries, derive them by forced alignment (whisper.cpp word timestamps when available) or mark the beat `timingSource: "estimated"`; estimated timings are allowed only for beats with no `visualCue`s, otherwise A-06 fails.

Per beat: normalize text for speech (numbers, units, symbols, abbreviations per language, pronunciation lexicon in `book.config.json`), synthesize with retries and backoff, cache by SHA-256 of (spoken text + voice + rate + provider), measure duration with ffprobe, trim leading/trailing silence, normalize loudness (EBU R128, target -16 LUFS integrated, -1.5 dBTP), compute `durationInFrames = ceil((audioMs + pauseAfterMs) / 1000 * 30)`. Pause defaults: 260 ms normal beats, 450 ms scene transitions, >= 3200 ms quiz thinking beat. Build caption phrases (<= 16 words) from word boundaries. Map each `visualCue` anchor word to its timestamp; if an anchor is not found, BLOCKER (no silent fallback).

## E.7 Rendering

Remotion composition `Lesson` takes `09_episode_compiled.json` as props. Deterministic output (no `Math.random` without seed; seeded PRNG for generated chart data). Render with CRF 16–18, `yuv420p`, AAC 192 kbps. Also render one still per beat at its midpoint and at its last cue for QA, plus a contact sheet.

---

# PART F — RIGOROUS QA RELEASE GATE

`openlectern qa --book <id> --chapter <ch> --part <n>` writes `qa/report.json` and a self-contained `qa/report.html` (contact sheet, per-beat stills with narration under each, findings with cause and suggested repair). Severity policy: BLOCKER and HIGH stop release; MEDIUM and LOW are reported. Release requires 0 BLOCKER and 0 HIGH. Every check has an id, a unit test with a failing fixture, and a repair hint.

**L0 — Code health (CI):** typecheck, lint, unit tests, schema tests, one demo render.

**L1 — Schema:** all artifacts parse with Zod; ids unique; every `sourceFactId` resolves; every template allowed for the book.

**L2 — Pedagogy (P-xx):**
- P-01 Scene 0 has 4 beats in hook order and no definition-first opening (first beat must not match "X is defined as" patterns).
- P-02 8-stage progression mapped for each core concept in the lesson plan.
- P-03 Every term in narration flagged by the term detector (acronym regex `\b[A-Z]{2,6}s?\b`, domain term list, glossary, symbols) appears in the concept register; first occurrence in narration contains its expansion and a plain-language definition within the same or next beat.
- P-04 Causal chain card present; prediction question present; guided application before quiz; misconception vs reality present; roadmap in scenes 0 and 10.
- P-05 Narration craft metrics: average sentence length 8–22 words, none > 35; beat word budget 25–75; readability within audience target; no banned filler phrases.
- P-06 Quiz: exactly 3 beats; scenario >= 18 words; exactly 4 distinct options A–D; `correctIndex` 0–3; thinking pause >= 3000 ms; reveal explanation present.
- P-07 Quiz tests only terms registered as introduced at or before this part.
- P-08 Summary: exactly 8 rules, each <= 30 words; 6 beats with ranges [0,0],[1,2],[3,4],[5,6],[7,8],[1,8]+compact; narration mentions the rule numbers shown.
- P-09 No spoiler markers in options (regex in D.5), in any language.
- P-10 Diversity rules (E.3).

**L3 — Content integrity (C-xx):**
- C-01 Every beat cites >= 1 fact (except pure transition beats explicitly marked).
- C-02 Fact coverage: >= 85% of the part's facts are taught somewhere; every formula and worked example fact is taught.
- C-03 Every number on screen appears in the facts, is derived by a recorded computation, or is badged hypothetical.
- C-04 Hypothetical examples badged.
- C-05 Bespoke check: no on-screen string longer than 6 words appears verbatim in any other part of any book in the workspace, unless it is a registered fixed label (e.g., `POINTS TO REMEMBER`).
- C-06 Cross-part similarity: token 5-gram Jaccard similarity of this part's visual text vs every other part < 0.15; for narration < 0.10.
- C-07 Boilerplate denylist (configurable, ships with known reference-project leaks: "1848 corn farmers", "lagging earnings reports", generic rule summaries) unless the fact ledger of this part actually contains them.
- C-08 Narration–visual alignment per beat: >= 60% of content keywords on the visual appear in the beat's narration or cited facts; every number on the visual is spoken in that beat or the previous one.
- C-09 Placeholder tokens (E.4 list), empty strings, `undefined`, `null`, `NaN`, `[object Object]` anywhere in visual data.
- C-10 Control characters in any string, including newlines inside `latex` fields (the swallowed-backslash bug: `\text` -> tab + `ext`, `\frac` -> form-feed + `rac`, `\neq` -> newline + `eq`).
- C-11 Forbidden math text: `/text`, `/frac`, raw `\text`/`\frac`/`\left` outside `latex` fields, doubled backslashes, `$` inside `latex`.
- C-12 KaTeX compile of every formula with strict mode.
- C-13 Six-way agreement recomputation (E.4.6).
- C-14 Variables defined with units for every formula; chart axes labeled with units.
- C-15 On-screen language rule: display-language strings contain no script from the narration-only language (e.g., no Devanagari on screen when display language is English).

**L4 — Audio (A-xx):**
- A-01 Every beat has audio > 0 bytes, decodable, duration > 0.5 s.
- A-02 Hash in `.hash` file equals hash of current spoken text (no stale audio after script edits).
- A-03 Measured duration drift between compiled timeline and summed audio+pauses < 0.5 s per scene and < 1.0 s total (HIGH), > 10 s BLOCKER.
- A-04 Loudness within ±1 LU of target; true peak <= -1 dBTP; no clipping.
- A-05 No internal silence > 1.5 s except quiz pause beat.
- A-06 Every `visualCue` anchor resolved to a timestamp inside its beat.
- A-07 (if Whisper available) ASR back-transcription word error rate vs spoken text < 12% per beat (HIGH above 20%); detects TTS skipping, mispronounced numbers, or wrong language.

**L5 — Render (R-xx):**
- R-01 ffprobe: H.264, 1920x1080, 30 fps, yuv420p, AAC present, duration equals compiled duration ± 0.5 s.
- R-02 Black-frame detection (ffmpeg `blackdetect`) outside intentional transitions.
- R-03 Frozen-frame detection (`freezedetect`) > 20 s during narration of a beat that has cues.
- R-04 Overflow diagnostics from E.5 are empty (BLOCKER otherwise).
- R-05 Stills OCR (if Tesseract available): no raw LaTeX tokens (`\text`, `\frac`, `/text`, `\left`, `^{`, `_{`), no `[object Object]`, `undefined`, `NaN`, `TODO`; OCR text of each beat still shares >= 40% keywords with the beat's visual data (catches blank or wrong panels).
- R-06 Caption never overlaps footer or main panel (bounding boxes from layout diagnostics).
- R-07 Theme conformance: sampled background and panel pixels match active theme tokens within tolerance.
- R-08 Quiz frames: during b1/b2 all 4 option cards visible; during b3 exactly one highlighted.

**L6 — Expert review (optional but on by default when any LLM provider or Agent-as-LLM is available):** a vision-capable reviewer (or the host agent) reads the contact sheet, per-beat stills, and the teaching script, and scores a rubric: accuracy, clarity for a beginner, vividness, visual-narration sync, visual quality, absence of stale content (1–5 each, all must be >= 4). Findings flow into the repair loop. This layer can never downgrade a deterministic BLOCKER.

**Repair loop:** for each failing finding, run its mapped repair (re-prompt the specific beat/scene with the finding text, regenerate audio for changed beats only, re-render, re-QA). Max 3 iterations per part; if still failing, mark the part `NEEDS_HUMAN` with a clear report and continue with other parts.

---

# PART G — REPOSITORY STRUCTURE

```
openlectern/
  src/
    cli/ (index.ts, wizard.ts, doctor.ts, commands/*)
    pipeline/ (stages/S0..S14, runner.ts, cache.ts, ledger.ts)
    connectors/ (research/notebooklm-mcp.ts, research/nlm-cli.ts, research/manual.ts, research/local-file.ts)
    providers/ (llm/*, tts/*)
    schemas/ (zod schemas for every artifact)
    pedagogy/ (term-detector.ts, concept-register.ts, narration-metrics.ts, structure-rules.ts)
    math/ (latex-sanitize.ts, katex-compile.ts, recompute.ts, six-way.ts)
    qa/ (checks/*.ts, report-html.ts, ocr.ts, asr.ts, ffmpeg-probes.ts)
    remotion/ (Root.tsx, Lesson.tsx, layout/*, templates/*, mappers/*, diagnostics.ts)
    theme/ (tokens.ts, themes/*.ts)
    domains/ (finance/, physics/ — optional presets)
  scripts/verify/ (phase.mjs, status.mjs, done.mjs, checks/*.mjs, clean-clone.mjs) — the objective build verifiers from Part L
  prompts/ (research/, facts/, register/, plan/, script/, storyboard/, episode/, repair/, review/) — versioned
  docs/ (standards/*.md ported from the reference methodology, ARCHITECTURE.md, DECISIONS.md, BUILD_LOG.md, ADDING_A_BOOK.md, PROVIDERS.md, QA.md, TROUBLESHOOTING.md)
  examples/demo-book/ (an ORIGINAL short book written by you, CC BY 4.0, ~3 chapters, with formulas and a worked example — used for tests, CI, and the demo render)
  tests/ (unit, fixtures/bad/* one per QA check, integration)
  public/fonts/ (OFL fonts + licenses)
  workspace/ (git-ignored)  out/ (git-ignored)  .build/ (git-ignored: loop state, verifier results, harness logs)
  AGENTS.md  CLAUDE.md  .github/copilot-instructions.md
  README.md  LICENSE  NOTICE  CONTRIBUTING.md  CODE_OF_CONDUCT.md  SECURITY.md  CHANGELOG.md
  .env.example  .gitignore  .editorconfig  .nvmrc
  .github/workflows/ci.yml  .github/ISSUE_TEMPLATE/*  .github/pull_request_template.md  .github/dependabot.yml
```

---

# PART H — OPEN-SOURCE READINESS

- License: Apache-2.0 for code (patent grant). Demo book content: CC BY 4.0. Fonts: their OFL licenses in `public/fonts/`.
- README: what it does, a 60-second quick start (commands shown for both Windows PowerShell and bash; never rely on `&&` in PowerShell examples), opening the project in Visual Studio 2026 / VS Code, screenshots/GIF generated from the demo render, the wizard flow, NotebookLM vs manual research, providers table (free/offline/paid), QA explained, FAQ, troubleshooting.
- Prominent legal notes: users must own or have rights to process their books; generated videos may be derivative works — publishing them is the user's responsibility; no book content is shipped; Remotion has its own license (free for individuals and small teams, company license required otherwise) — link it; Edge TTS uses an unofficial endpoint — Piper is the fully open alternative; NotebookLM CLIs are community tools subject to Google's terms.
- CONTRIBUTING (setup, tests, how to add a template, a domain, a provider, a QA check), CODE_OF_CONDUCT (Contributor Covenant), SECURITY (report channel, no secrets), issue and PR templates, Dependabot, CI on Linux/macOS/Windows running lint, typecheck, tests, and a short demo render (scene subset) with QA.
- No telemetry leaves the machine. `.env.example` lists every optional key with comments. `npm audit` clean of high/critical at release.
- No emoji in source, config, or log output (plain `[OK]`, `[FAIL]`, `[WARN]`); YAML files end with exactly one newline.

---

# PART I — BUILD PLAN (EXECUTE IN ORDER, VERIFY EACH PHASE)

Every phase is complete only when `npm run verify:phase -- <n>` exits 0 (see the matrix in Part L.2). The "Verify" lines below describe intent; the verifier scripts are the authority.

Phase 0 — Bootstrap the loop: `git init -b main` if needed; `.gitignore` (node_modules, workspace, out, .build, .env, .vs, *.mp4 outside docs/media); save `docs/BOOTSTRAP_PROMPT.md`; ensure the build-mode block of Part L.9 exists in `.github/copilot-instructions.md` and the `start-build`/`continue-build` prompt files exist in `.github/prompts/` (create them if the developer did not run the setup script); create `docs/BUILD_LOG.md`, `docs/DECISIONS.md`, `.build/state.json`; minimal `package.json` with the `verify:*` scripts; implement `scripts/verify/phase.mjs`, `status.mjs`, `done.mjs` with the FULL check matrix of Part L.2 (checks for later phases simply fail until built). Verify: `npm run verify:phase -- 0` exits 0 and `npm run verify:status` reports Phase 1 as next.

Phase 1 — Skeleton: repo files, TypeScript, lint, test runner, CI, license files, `doctor`. Verify: `npm run lint && npm run typecheck && npm test` pass; `npx openlectern doctor` runs.

Phase 2 — Schemas, standards, demo book: all Zod schemas, JSON Schema export, `docs/standards/*` ported; write the ORIGINAL demo book `examples/demo-book/` (CC BY 4.0, ~3 short chapters on a beginner topic with at least two formulas, one worked numerical example, one historical case, and several acronyms) plus a `research/notebook_context.md` per chapter part in exactly the format the Chapter Extraction Prompt asks NotebookLM to return, so the whole pipeline runs offline. Verify: schema tests with valid and invalid fixtures; the demo research files pass the S1 gate.

Phase 3 — Providers and connectors: LLM adapters (agent-handoff first), TTS adapters (edge first, piper second), research connectors (nlm CLI detection, MCP note, manual, local file). Verify: unit tests with mocks; a real Edge TTS call for one sentence when network is available.

Phase 4 — Pedagogy and math engines: term detector, concept register, narration metrics, structure rules, latex sanitizer, KaTeX compile, recompute, six-way agreement. Verify: tests including the `\t`/`\f`/`\b` swallowed-backslash fixtures and `/text` fixtures.

Phase 5 — Remotion: theme tokens, layout, all templates, mappers, diagnostics, composition. Verify: Remotion still renders of every template from fixtures; overflow diagnostics catch an intentionally overflowing fixture.

Phase 6 — Pipeline S0–S14 and CLI/wizard: runner, caching, resumability, repair loop, `--handoff exit|poll`, `--until <stage>`, `--scenes`, `--draft`; hand-author the `mock` LLM fixtures for demo Chapter 1 Part 1 (content-valid, following the standards). Verify: non-interactive run with flags on the demo book (matrix row 6).

Phase 7 — QA gate: every check L1–L5 with a bad fixture each; L6 reviewer via agent-handoff; HTML report. Verify: each bad fixture fails with the right id; the clean demo passes.

Phase 8 — End-to-end demo: using the Phase 2 demo book, run Orientation + Chapter 1 Part 1 in English and Hindi using Agent-as-LLM mode (Part L.7: you act as the LLM by answering the hand-off tasks yourself, following the prompts and standards exactly); real TTS (Edge, or Piper if Edge is unreachable); full-quality render; QA. Inspect the contact sheet stills yourself (open the PNGs) and fix anything a demanding teacher would reject. Record the outputs for `replay`. Verify: 0 BLOCKER, 0 HIGH; MP4s play; captions sync (matrix row 8).

Phase 9 — Docs and polish: README with real screenshots from the demo (small PNGs/GIF under `docs/media/`, each < 1 MB; never commit full MP4s), all docs complete, `CHANGELOG.md` v0.1.0, CI switched to `--llm replay --tts mock --draft`. Verify: `scripts/verify/clean-clone.mjs` runs the README quick start from a clean clone in a temp folder (`git clone . <tmp> && cd <tmp> && npm ci && npm start -- --non-interactive --book demo --llm replay ...`).

---

# PART J — DEFINITION OF DONE (ALL MUST BE TRUE)

1. Clean clone -> `npm install` -> `npm start` launches the wizard; `--non-interactive` flags reproduce a full demo run.
2. The NotebookLM "yes" path detects and uses an available connector; the "no" path writes `PASTE_INTO_NOTEBOOKLM.md`, tells the exact drop path, and resumes automatically when the file appears.
3. One command produces a released MP4 (plus SRT/VTT, chapters, thumbnail, description) for a chapter part.
4. The demo book's Orientation and Chapter 1 Part 1 (en + hi) pass QA with 0 BLOCKER and 0 HIGH, and the L6 rubric scores >= 4 on every axis.
5. Every QA check has a failing fixture test; the full test suite passes on CI for Linux, macOS, Windows.
6. No chapter-specific code anywhere (`grep` for chapter numbers in `src/` returns only generic logic).
7. No secrets, personal paths, copyrighted text, or emoji in tracked files; license files present; `npm audit` has no high/critical issues.
8. `docs/BUILD_LOG.md` shows every phase verified with the command and result; `docs/DECISIONS.md` records all assumptions.
9. CI reproduces the demo pipeline with `--llm replay --tts mock --draft` from recorded outputs, without keys, network TTS, or an agent.
10. `npm run verify:done` exits 0 from a clean working tree and has written `.build/BUILD_COMPLETE`; no check in `scripts/verify/` was removed or relaxed after Phase 0 without a `docs/DECISIONS.md` entry explaining a genuine bug in that check.

---

# PART K — FINAL HAND-OFF (NO QUESTIONS)

1. Leave build mode: delete the block between `<!-- OPENLECTERN-BUILD-MODE:START` and `<!-- OPENLECTERN-BUILD-MODE:END -->` from `.github/copilot-instructions.md` (keep the product's agent hand-off instructions), delete `.github/prompts/start-build.prompt.md` and `.github/prompts/continue-build.prompt.md`, keep `docs/BOOTSTRAP_PROMPT.md`, `docs/BUILD_LOG.md`, and `docs/DECISIONS.md` as project history, re-run `npm run verify:done`, and commit `chore: leave build mode`.
2. Ensure the working tree is clean and all phases are committed locally on `main`. Do not tag, add a remote, create a repository, or push; publishing is out of scope for now.
3. Print a final summary: what was built, how to run it (3 commands), where the demo videos and QA reports are, known limitations, and the decision log location.

---

# PART L — AUTONOMOUS BUILD LOOP (ONE-GO EXECUTION PROTOCOL)

This part makes the build finish without a human. It overrides any habit of stopping to summarize, asking for confirmation, or declaring success early.

## L.1 Truth comes from verifiers, not from memory or prose

- `npm run verify:phase -- <n>`: runs every check for phase n, prints one `[OK]`/`[FAIL]`/`[SKIP]` line per check with a one-line reason, writes `.build/verify/phase-<n>.json` (`{ phase, ok, checks[{id, ok, optional, detail}], head, dirty, ts }`), exits 0 only if every non-optional check passes.
- `npm run verify:status`: prints the per-phase status table and `NEXT_PHASE=<n>` (or `NEXT_PHASE=done`). It may reuse a cached phase result only if `head` equals the current `git rev-parse HEAD` and the tree was clean when cached; otherwise it re-runs that phase.
- `npm run verify:done`: runs phases 0..9 plus the Definition of Done checks; on success writes `.build/BUILD_COMPLETE` (`{ head, ts, phases }`) and exits 0. Only this script writes the sentinel. Never create, edit, or touch it yourself.
- Verifier integrity: after Phase 0 you may add checks but never delete, skip, or loosen one to make it pass. Fixing a genuinely wrong check requires a `docs/DECISIONS.md` entry quoting the old and new logic. Never delete or `.skip` a test to get green. The harness reports any change under `scripts/verify/` in its next note.
- Optional checks (marked `optional: true`) cover only machine-dependent extras: live NotebookLM, Tesseract OCR, whisper ASR, live Edge TTS when offline, macOS/Windows CI runners. They print `[SKIP]` with the reason and the documented fallback.

## L.2 Phase verification matrix (implement all of it in Phase 0)

| Phase | Checks (all commands must exit 0 unless marked optional) |
| --- | --- |
| 0 | node >= 20; git repo on `main`; `.build/` git-ignored; `docs/BOOTSTRAP_PROMPT.md` exists and contains `PART L`; `docs/BUILD_LOG.md`, `docs/DECISIONS.md` exist; `verify:*` scripts present |
| 1 | `npm run lint`; `npm run typecheck`; `npm test`; `npx openlectern doctor --json` returns valid JSON; LICENSE, NOTICE, README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, `.env.example`, `.github/workflows/ci.yml` exist; remotion package versions identical |
| 2 | schema test files exist for every artifact in Part C and pass; JSON Schemas exported to `schemas/json/`; `docs/standards/` contains SOURCE_GROUNDING, LEARNING_PROGRESSION, NARRATION_CRAFT, JIT_CONCEPT_CLARIFICATION, SCENE_STRUCTURE, ASSESSMENT, ORIENTATION_AND_SYNTHESIS, VISUAL_DESIGN, FORMULA_RULES, QA_SEVERITY (each > 1500 chars); `examples/demo-book/` has LICENSE (CC BY 4.0), >= 3 chapters, and research files that pass the S1 gate |
| 3 | provider and connector unit tests pass; `openlectern tts:test --provider mock` writes audio + word boundaries; `openlectern tts:test --provider edge` (optional when offline); `openlectern research:detect --json` returns detected connectors; `--handoff exit` returns code 75 with `AWAITING_AGENT` lines in a fixture test |
| 4 | math and pedagogy tests pass, including fixtures for `\t`/`\f`/`\b`/`\r`/`\n` swallowed backslashes, `\u`/`\v` parse failures, `/text`, doubled backslashes, unbalanced braces, six-way mismatch, unexplained acronym, sentence > 35 words |
| 5 | `openlectern render:stills --fixtures` writes one PNG per registered template (count equals registry size, each PNG > 20 KB and not single-colour); the overflow fixture is reported in `overflow.json`; the `[object Object]` fixture throws |
| 6 | `openlectern make --book demo --chapter ch01 --part p1 --llm mock --tts mock --draft --scenes 0,9,11 --non-interactive` exits 0, produces the compiled episode and a draft MP4, and its QA report lists Q-MOCK as the only BLOCKER; second run is fully cached (no stage re-executed); `--resume` after deleting one artifact re-runs only dependent stages |
| 7 | every QA check id in the registry has a bad fixture that fails with exactly that id (coverage 100%, printed); the hand-authored clean fixture `tests/fixtures/qa/clean/` passes L1-L4 and the L5 checks that run on its draft render (Q-MOCK and full-quality-only checks are asserted separately); `qa/report.html` is generated and self-contained |
| 8 | released (non-draft, non-mock) MP4s exist for demo Orientation and Chapter 1 Part 1 in `en` and `hi`; each QA report has 0 BLOCKER and 0 HIGH; L6 rubric all >= 4; recorded replay outputs exist for every demo task; ffprobe matches R-01 |
| 9 | `node scripts/verify/clean-clone.mjs` (clone to temp dir, `npm ci`, run the README quick-start in non-interactive replay mode) exits 0; secret/personal-path/emoji scan clean; `npm audit --audit-level=high` clean; every README command exists in the CLI help; `docs/` files from Part G exist |

## L.3 The loop

```
while true:
  status = run("npm run verify:status")          # before Phase 0 exists: start Phase 0
  if status.NEXT_PHASE == done:
      if run("npm run verify:done") == 0: execute Part K; END SESSION (success)
      else: treat each failing DoD check as a task in a synthetic phase "done"; continue
  P = status.NEXT_PHASE
  if .build/state.json has no task list for P: write one from Part I and the matrix
      (tasks of at most ~1 hour, each with its own verification command and the files it touches)
  task = first task of P not marked done
  implement the smallest complete slice of task
  run its verification command; read the ACTUAL output (tail ~80 lines); never assume
  if failing: diagnose root cause from the output -> fix -> rerun (attempt counter++)
  if attempts for the same failure signature reach 3: apply the stuck protocol (L.4)
  if passing: mark task done in state.json, append evidence to BUILD_LOG.md, commit
  if all tasks of P done: run("npm run verify:phase -- P"); on exit 0 commit
      "chore(build): verify phase P" and record it in BUILD_LOG.md; otherwise add
      the failing checks as new tasks of P
```

Priorities inside a phase: required behaviour first, then tests, then polish. Never skip a phase, and never start phase P+1 while P is unverified (exception: Phase 0 verifier scripts are written before the code they check).

## L.4 Stuck protocol (same failure signature 3 times)

1. Re-read the full error and the real API docs or type definitions in `node_modules` (not memory).
2. Write a minimal reproduction under `.build/scratch/` and fix it there first.
3. Try a different approach or library; record the switch in `docs/DECISIONS.md`.
4. If the blocker is a machine-dependent optional capability, implement the documented fallback, mark only that optional check `[SKIP]` with the reason, and continue.
5. If it is still failing after 3 approaches, record it under `## Open blockers` in `docs/BUILD_LOG.md` with the exact error, continue with every other task that does not depend on it, and revisit it after each later phase. A required check can never be skipped this way; the build is not done until it passes.

## L.5 Sessions, context, and checkpoints

- Treat every session as one that can end at any moment. Commit after every completed task (small commits), so at most one task of work is ever lost.
- Keep tool output small: tail/limit logs (last 80 lines), use quiet/dot reporters, log long renders to `.build/logs/` and read only the summary. Do not print whole files or `node_modules` trees.
- Checkpoint (before your context is nearly exhausted, and at least every ~10 tasks): update `.build/state.json` (`currentPhase`, task statuses, `attempts`, `next` = the exact next command or edit) and `docs/BUILD_LOG.md`, then commit `chore(build): checkpoint`.
- The ONLY legitimate ways to end a session are: (a) `verify:done` passed and Part K is complete; (b) context or time is nearly exhausted, after a checkpoint. Do not end a session to report progress, to ask for confirmation, or because a phase is finished. If the tool forces a turn end, the harness relaunches you and you resume from the files.

## L.6 State file `.build/state.json`

```json
{
  "version": 1,
  "currentPhase": 4,
  "phases": { "0": { "status": "verified", "head": "<sha>", "ts": "<iso>" } },
  "tasks": { "4": [ { "id": "4.3", "title": "latex sanitizer", "verify": "npx vitest run tests/math/sanitize.test.ts", "status": "in_progress", "attempts": 1, "lastFailure": "<signature>" } ] },
  "openBlockers": [],
  "next": "Fix the form-feed fixture in tests/math/sanitize.test.ts, then rerun the verify command of task 4.3"
}
```

If the file is missing or corrupt, rebuild it from `npm run verify:status`, `git log`, and `docs/BUILD_LOG.md`.

## L.7 Acting as the LLM during the build (Phase 8)

- Run the pipeline with `--llm agent-handoff --handoff exit`. For each `AWAITING_AGENT` task, read `prompt.md`, `input.json`, `output.schema.json`, and the relevant `docs/standards/*.md`. Write `output.json` as the best teacher in the field would: vivid, causal, beginner-safe, faithful to the facts, bespoke to this part. Then run `openlectern task:validate <id>` and re-run the pipeline.
- When QA fails, fix the content through the pipeline's repair tasks (never by hand-editing compiled artifacts or MP4s), re-run TTS only for changed beats, re-render, re-run QA.
- Look at the contact sheet and at least the stills for Scenes 0, 3, 5, 9 (each beat), and 11 with your own vision. Fix anything a demanding teacher or designer would reject (crowding, weak hierarchy, unreadable text, stale or generic wording, a formula that is technically correct but not explained), even if every automated check is green.
- After both languages pass, record all task outputs to `examples/demo-book/recorded/` and confirm the replay run reproduces identical `08_episode.json` hashes.

## L.8 Harness contract

An external script (`build-loop.ps1` / `build-loop.sh`) may drive you. Each launch, it writes `.build/next_prompt.md` and `.build/harness_note.md` (stall warnings, verifier changes, a failed `verify:done` output, rate-limit pauses). Address the note first. The harness declares success only when its own run of `npm run verify:done` exits 0 and `git status --porcelain` is empty, so finishing Part K is part of the work.

## L.9 Host rules: Visual Studio 2026 GitHub Copilot agent mode (primary build host)

In Visual Studio there is no external harness, so the loop lives inside the chat. These rules make one chat thread carry the build as far as possible and make any new thread resume cleanly.

- **One long turn.** Keep executing the L.3 loop inside the same turn. Do not end the turn after a phase, after a commit, or to report progress. If the host offers an explicit completion tool (for example `task_complete`), call it only when `npm run verify:done` has exited 0 and Part K is finished, or when you are about to run out of context after a checkpoint. In the second case, say the build is not done and that the developer should send `/continue-build` in a new Agent-mode thread.
- **History summaries.** Visual Studio summarizes long conversations automatically. After any summary (or whenever you are unsure what is done), re-read `.build/state.json`, `docs/BUILD_LOG.md`, and `git log --oneline -20`, and run `npm run verify:status`. Trust those over your memory.
- **Always-on instructions.** `.github/copilot-instructions.md` carries this build-mode block, so it reaches every request even after a summary. Keep it exactly like this until Part K removes it (product instructions for the agent hand-off protocol go below it):

  ```markdown
  <!-- OPENLECTERN-BUILD-MODE:START (removed by Part K of docs/BOOTSTRAP_PROMPT.md) -->
  # Build mode: this repository is being built autonomously

  The specification is docs/BOOTSTRAP_PROMPT.md. On every request, including after the chat history is summarized:
  1. Follow its Autonomy contract and Part L (autonomous build loop) exactly, including the Visual Studio host rules in L.9.
  2. Before other work, re-read .build/state.json, docs/BUILD_LOG.md and docs/DECISIONS.md, run `git log --oneline -20`, and run `npm run verify:status` if it exists.
  3. Never ask the developer a question. Never declare completion (or call a completion tool) before `npm run verify:done` exits 0 and Part K is done.
  4. The terminal is Windows PowerShell 5.1: no `&&`, `||`, `??`, `?.`; chain with `;` and `if ($?) { ... }`; put multi-step commands in package.json scripts.
  5. Run long jobs (npm install, renders, TTS batches, QA) with output redirected to .build/logs/<name>.log; read only the tail.
  6. Checkpoint (state.json + BUILD_LOG.md + commit) after every task and before the context gets large.
  <!-- OPENLECTERN-BUILD-MODE:END -->
  ```

- **Prompt files.** `.github/prompts/start-build.prompt.md`: "Read docs/BOOTSTRAP_PROMPT.md completely and execute it from Phase 0 (or from the phase `npm run verify:status` reports). Follow Part L and L.9. Do not ask questions." `.github/prompts/continue-build.prompt.md`: "Resume the OpenLectern build: follow docs/BOOTSTRAP_PROMPT.md Part L and L.9 from the current state (state.json, BUILD_LOG.md, git log, verify:status). Do not ask questions. Do not stop before verify:done passes and Part K is finished."
- **Terminal.** The agent terminal is Windows PowerShell 5.1 and each command runs in a fresh process: no `cd` or environment-variable persistence, no `&&`/`||`, no heredocs, no Unix tools (`tail`, `grep`, `sed`, `/tmp`). Use `Get-Content -Tail 80`, `Select-String`, and `$env:TEMP`. npm runs package.json scripts through `cmd.exe` on Windows, so `&&` inside package.json scripts is fine; prefer `npm run check` (= lint + typecheck + test) and the `verify:*` scripts over long one-liners. All verifier and tooling scripts are Node (`.mjs`) using `path`, `os.tmpdir()`, and `child_process` with argument arrays, so they behave the same on Windows, macOS, and Linux.
- **Tool time limits.** A terminal call may return before a long job finishes. Start long jobs (first `npm install`, `npx remotion browser ensure`, full renders, TTS for a whole part, QA with OCR/ASR) as background processes that write to `.build/logs/<job>.log` and a `<job>.exitcode` file at the end. Then poll with short reads of the log tail until the exit-code file appears. Never start a second copy of a job that is still running; check first.
- **Build verification.** Visual Studio's own build (MSBuild/`run_build`) does not apply to this Node project. The only build truth is the npm scripts and `scripts/verify/*`. Use the IDE's error list only as a hint.
- **Editing.** Use the file edit tools for source changes. Never write files through shell redirection with the default PowerShell 5.1 encoding (UTF-16/BOM); when a script must write a file, use Node `fs.writeFileSync(path, text, "utf8")`. Keep LF line endings for `.sh` files and add a `.gitattributes` (`* text=auto`, `*.sh text eol=lf`).
- **Visual review.** Open the contact sheet and beat stills with the file view tool (it shows images) for the Part L.7 review; do not skip this because the checks are green.
- **Agent-as-LLM in the IDE.** Run the pipeline with `--handoff exit` (never `poll`: a polling process would block the terminal tool), answer the `.tasks/*` files with the edit tools, validate them with `openlectern task:validate`, and re-run.
- **Budget.** Each new developer message costs a premium request, but tool calls inside one turn do not. That is another reason to keep working within the turn instead of ending it to report progress.

Begin now: run the Part L loop, starting at Phase 0 (or at the phase `npm run verify:status` reports). Do not ask questions.
