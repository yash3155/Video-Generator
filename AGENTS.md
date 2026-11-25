# AI Agent Guide for OpenLectern

This document instructs AI coding agents (GitHub Copilot, Claude Code, Cursor, Gemini CLI, etc.) on how to operate inside OpenLectern in Agent-as-LLM mode and ensures every generated lesson meets release-grade standards.

## The Agent-as-LLM Protocol

OpenLectern is designed to run with zero paid API keys by using you (the host coding agent) as the reasoning engine for content generation stages.

### 1. Task Handoff Signal
When the pipeline requires LLM generation and no API key is provided, OpenLectern outputs lines in stdout:
```
AWAITING_AGENT <task_id> <task_folder>
```
and exits with code **75**. This is a normal, non-error pause to hand control over to you.

### 2. Task Directory Structure
Under each `<task_folder>` (located at `workspace/.tasks/<task_id>/`), you will find:
- `prompt.md`: The complete instructional prompt including task role, context, and requirements.
- `input.json`: The machine-readable task inputs.
- `output.schema.json`: The JSON Schema that your answer must validate against.
- `task.json`: Metadata about the task hash, kind, chapter, and part.
- `feedback.md` *(optional)*: If a previous attempt was rejected, specific gate failures and repair guidance are listed here.

### 3. Your Task
1. Read `prompt.md` and `input.json`.
2. Follow OpenLectern's core pedagogical principles:
   - **Grounding**: Teach only claims, definitions, numbers, and formulas present in `01_source_facts.json` (including positive magnitudes when narrated, e.g., `2.50%` alongside `-2.50%`).
   - **Vividness**: Concrete, sensory situations in the first 15 seconds; causal explanations.
   - **Clarity**: 8-22 words per sentence (max 35 words); 25-75 words per beat.
   - **JIT Clarification**: Define every new term, acronym, or symbol at first mention.
   - **Math & Plain Text**: Escape LaTeX backslashes inside JSON strings (`"\\frac"`, `"\\text"`). Never output swallowed control characters, uncompiled commands, or raw `_` / `^` inside plain text strings.
   - **Six-Way Agreement**: In `WorkedExample`, every symbol in `formula.expression` must be declared in `given`, and the final calculation step must match `result.value`.
   - **No Placeholders**: Never output `TODO`, `TBD`, `[insert]`, `[object Object]`, or empty visual cards.
   - **Narration-Visual Sync**: Every beat's on-screen content and `visualCues` must directly match what is spoken in that beat, with anchor words present verbatim in both `en` and `hi` spoken text.
3. Write your JSON answer to `workspace/.tasks/<task_id>/output.json`.

### 4. Validation and Resuming
Before resuming the pipeline, validate your output:
```powershell
node bin/openlectern.mjs task:validate <task_id>
```
Once validation reports `[OK]`, re-run the exact previous pipeline command. Stages are cached by content hash, so the pipeline resumes seamlessly at the next step.

## Production & Delivery Standards (Mandatory)

1. **Bilingual Every Time (`en` & `hi`)**: Always compile (`S10`) and render (`S11`) in **both** narration languages configured in `book.config.json` (`en` and `hi`). Never ship or stop at English-only renders.
2. **Full Pipeline Completeness (`S1`–`S14`)**: Never skip intermediate artifacts (`01_source_facts.json` with `dependencies`, `02_content_audit.json` through `07_storyboard.json`, `08_episode.json`, `09_episode_compiled.json`).
3. **Zero-Blocker Release Gate (`S12`)**: Every part must pass `S12` QA with `releasable: true` (**0 BLOCKER, 0 HIGH**) and **0 layout overflow** (`R-04`) across all beat stills in both `en` and `hi`. If any `S-*`, `A-*`, `C-*`, `P-*`, or `R-*` blocker occurs, fix the root cause and re-run `S10`–`S13` before considering the chapter done.
4. **Subfolder Packaging & Cleanup (`S13` / `S14`)**: Always package via `S13` into `out/<book>/<chapter>/` (removing any stale/legacy flat files under the same name in `out/<book>/`) and refresh `out/<book>/index.html` via `S14`.
5. **UTF-8 Safety**: Always read and write files containing Hindi (Devanagari) text as UTF-8 (via Node.js `utf8` or direct file tools—never ANSI-default PowerShell `Get-Content`).
6. **Code Verification**: After any change under `src/`, run `npm run check` (`eslint`, `tsc --noEmit`, `vitest run`) and confirm 100% pass.
