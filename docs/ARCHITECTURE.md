# OpenLectern Architecture

OpenLectern is an autonomous, open-source engine that transforms books into broadcast-quality educational video lessons (1920x1080, 30 fps, H.264/AAC).

## System Overview

```
                      +-------------------+
                      |   Source Book     |
                      | (PDF/EPUB/TXT/NLM)|
                      +---------+---------+
                                |
                                v
                   [Stage S1: Research Ingest]
                                |
                                v
                 [Stage S2: Course Map Creation]
                                |
                                v
               [Stages S3-S8: Content & Scripting]
             (Facts -> Audit -> Register -> Plan -> Script -> Storyboard)
                                |
                                v
                 [Stage S9: Episode Assembly]
                                |
                                v
                 [Stage S10: Audio Synthesis (TTS)]
                                |
                                v
                 [Stage S11: Remotion Video Render]
                                |
                                v
                 [Stage S12: Multi-Layer QA Gate]
                                |
                                v
                 [Stage S13-S14: Packaging & Index]
```

## 15-Stage Resumable Pipeline

Each stage is typed, cached, and idempotent.

| Stage | Name | Description | Output Artifact |
| --- | --- | --- | --- |
| S0 | Book Setup | Loads and validates book configuration and copyright rights. | `book.config.json` |
| S1 | Research Ingest | Extracts structured notes from NotebookLM or local files. | `notebook_context.md` |
| S2 | Course Map | Maps book into modules, chapters, and parts with prerequisites. | `course_map.json` |
| S3 | Source Facts | Extracts verified definitions, claims, numbers, formulas. | `01_source_facts.json` |
| S4 | Content Audit | Verifies fact coverage, formula integrity, and prerequisite DAG. | `02_content_audit.json` |
| S5 | Concept Register | Registers technical terms, acronyms, and explanation depths. | `03_concept_register.json` |
| S6 | Lesson Plan | Plans 8-stage learning progression, traps, and quizzes. | `04_lesson_plan.json` |
| S7 | Teaching Script | Generates novice/mentor spoken narration and subtitles. | `05_teaching_script.json`, `.md` |
| S8 | Storyboard | Assigns templates, layout, and visual diversity rules. | `06_visual_brief.json`, `07_storyboard.json` |
| S9 | Episode | Assembles full visual scene graph with exact cue anchors. | `08_episode.json` |
| S10 | Speech & Timeline | Synthesizes speech, word timings, and measures durations. | `09_episode_compiled.json`, `audio/` |
| S11 | Video Render | Renders 1080p video, beat stills, and contact sheets. | `render/*.mp4`, `qa/frames/` |
| S12 | QA Release Gate | Runs 49 automated checks across L1-L5 plus L6 expert review. | `qa/report.json`, `qa/report.html` |
| S13 | Packaging | Packages releasable MP4s, subtitles, and metadata into `out/`. | `out/<book>/<video>.mp4` |
| S14 | Course Index | Generates course playlist and video navigation index. | `out/<book>/index.html` |

## Subsystems

### 1. Research Connectors
- `notebooklm-mcp`: Directly connects to NotebookLM MCP server if exposed by host.
- `nlm-cli`: Uses installed community CLI wrappers (`nlm login`, `nlm query`, `nlm chat`).
- `local-file`: Offline parser for PDF (pdf.js), EPUB (jszip), DOCX (mammoth), and Markdown/text.
- `manual`: Generates `PASTE_INTO_NOTEBOOKLM.md` with instructions and watches for pasted response.

### 2. LLM Providers
- `agent-handoff`: Zero-key default mode; writes `.tasks/<id>/prompt.md`, `input.json`, `output.schema.json` and exits with code 75 for agent completion.
- `replay`: Replays recorded outputs for CI and reproducible verification.
- `mock`: Hand-crafted schema-valid test fixtures for testing.
- `openai-compatible`, `anthropic`, `gemini`, `ollama`: API connectors with lazy SDK imports and proxy support.

### 3. TTS Engine
- `edge`: High-quality online neural voices (Microsoft Edge) with word-boundary event capture.
- `piper`: Offline neural voice synthesis; automated fallback when network Edge TTS fails 3 times.
- `openai`, `elevenlabs`, `google`: Commercial API connectors with timing estimation.

### 4. Math and Pedagogy Engines
- Formula pipeline: Auto-repairs swallowed JSON backslashes (`\t`, `\f`, `\b`, `\r`, `\n`), enforces KaTeX strict compilation, and executes six-way agreement recomputation (KaTeX step == mathjs arithmetic == chart data == annotations == spoken numbers == conclusion).
- Pedagogy engine: Enforces 8-stage progression, novice/mentor dialogue, JIT concept explanation at first mention, and word/sentence length metrics.

### 5. Remotion Video Rendering
- Remotion 4 (React 19) composition `Lesson`.
- 16 domain-agnostic templates with typed view-models.
- Central theme token system (`src/theme/tokens.ts`).
- Programmatic browser rendering with bundle caching and real-time overflow diagnostics.
