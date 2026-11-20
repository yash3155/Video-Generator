# AI Agent Guide for OpenLectern

This document instructs AI coding agents (GitHub Copilot, Claude Code, Cursor, Gemini CLI, etc.) on how to operate inside OpenLectern in Agent-as-LLM mode.

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
   - **Grounding**: Teach only claims, definitions, numbers, and formulas present in `01_source_facts.json`.
   - **Vividness**: Concrete, sensory situations in the first 15 seconds; causal explanations.
   - **Clarity**: 8-22 words per sentence (max 35 words); 25-75 words per beat.
   - **JIT Clarification**: Define every new term, acronym, or symbol at first mention.
   - **Math**: Escape LaTeX backslashes inside JSON strings (`"\\frac"`, `"\\text"`). Never output swallowed control characters or uncompiled commands.
   - **No Placeholders**: Never output `TODO`, `TBD`, `[insert]`, `[object Object]`, or empty visual cards.
3. Write your JSON answer to `workspace/.tasks/<task_id>/output.json`.

### 4. Validation and Resuming
Before resuming the pipeline, validate your output:
```powershell
node bin/openlectern.mjs task:validate <task_id>
```
Once validation reports `[OK]`, re-run the exact previous pipeline command. Stages are cached by content hash, so the pipeline resumes seamlessly at the next step.
