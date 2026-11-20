# Changelog

All notable changes to this project are documented here. The format follows Keep a Changelog and the project uses Semantic Versioning.

## [0.1.0] - 2026-11-21

### Added

- Interactive wizard (`openlectern start`) and system doctor (`openlectern doctor`).
- Full 15-stage pipeline (`S0` through `S14`) converting books into broadcast-quality 1080p educational videos.
- Pluggable research connectors: NotebookLM MCP, `nlm` CLI flavors, local file extraction (PDF, EPUB, DOCX, TXT/MD), and manual research flow with ready-to-paste prompts.
- Pluggable LLM providers: zero-key Agent-as-LLM mode (`agent-handoff`), deterministic `replay` for CI/tests, `mock` fixtures, OpenAI-compatible APIs, Anthropic, Gemini, and local Ollama.
- Dual-voice TTS engine: Microsoft Edge online TTS with automatic fallback to local Piper TTS; character/word-level timing alignment.
- Pedagogical engine: 8-stage learning progression, JIT concept clarification, sentence and beat metrics, novice/mentor dialogue structure.
- Math validation engine: JSON LaTeX escape repair (`\t`, `\f`, `\b`, `\r`, `\n`), KaTeX strict compilation, six-way agreement recomputation.
- Remotion 4 rendering suite: 16 domain-agnostic templates, dark/light theme tokens, WCAG contrast verification, overflow detection, and layout audit.
- QA release gate: 49 automated checks across schema (L1), pedagogy (L2), content integrity (L3), audio (L4), and video render (L5); self-contained HTML reports with embedded contact sheets.
- Multi-language support: simultaneous bilingual rendering (English and Hindi narration in Devanagari script).
