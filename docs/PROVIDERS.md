# Providers and Connectors Reference

OpenLectern features a modular provider architecture for both LLMs and Text-to-Speech (TTS), allowing fully offline, free online, or enterprise API operation.

## LLM Providers

Configure via `--llm <provider>` or in `book.config.json`: `"llm": { "provider": "..." }`.

| Provider | Description | Keys Required | Cost | Offline Support |
| --- | --- | --- | --- | --- |
| `agent-handoff` | **Default.** File-based protocol for AI coding agents (`AWAITING_AGENT` exit 75). | None | Zero | Yes |
| `replay` | Replays pre-recorded task outputs from `examples/<book>/recorded/` for deterministic testing. | None | Zero | Yes |
| `mock` | Hand-authored valid fixture outputs for pipeline unit and integration tests. | None | Zero | Yes |
| `openai-compatible` | Any standard `/v1/chat/completions` API (OpenAI, OpenRouter, Groq, Together, LM Studio, vLLM). | `OPENAI_API_KEY` | Per token | Configurable |
| `anthropic` | Anthropic Claude SDK (Claude 3.5 Sonnet / Haiku / Opus). | `ANTHROPIC_API_KEY` | Per token | No |
| `gemini` | Google Gemini SDK (`@google/genai`). | `GEMINI_API_KEY` | Free/Paid tiers | No |
| `ollama` | Local Ollama instance (`/api/chat` or `/v1`). | None | Zero | Yes |

### Agent-as-LLM Mode Protocol

When running inside an AI coding agent or headless build harness without paid API keys:
1. The pipeline creates task directories under `workspace/.tasks/<task_id>/` containing `prompt.md`, `input.json`, `output.schema.json`, and `task.json`.
2. OpenLectern prints `AWAITING_AGENT <task_id> <path>` and exits with code 75.
3. The agent reads the prompt and standards, generates `output.json`, and runs `openlectern task:validate <task_id>`.
4. Re-running the pipeline resumes from the newly answered task.

## TTS Providers

Configure via `--tts <provider>` or in `book.config.json`: `"tts": { "provider": "..." }`.

| Provider | Description | Keys Required | Word Timing Source | Offline Support |
| --- | --- | --- | --- | --- |
| `edge` | **Default.** Microsoft Edge online neural voices (e.g. `en-US-ChristopherNeural`, `hi-IN-MadhurNeural`). | None | Real-time boundary events | No |
| `piper` | Local open-source neural TTS engine (`piper-tts`). Automated fallback when Edge TTS fails 3 times. | None | Synthetic / Alignment | Yes |
| `openai` | OpenAI TTS API (`tts-1`, `tts-1-hd`). | `OPENAI_API_KEY` | Estimated | No |
| `elevenlabs` | ElevenLabs API with high expressive realism. | `ELEVENLABS_API_KEY` | Character alignment | No |
| `google` | Google Cloud Text-to-Speech API. | `GOOGLE_APPLICATION_CREDENTIALS` | Estimated | No |

### Automatic Edge-to-Piper Fallback

When Edge TTS network requests fail 3 times in a row with exponential backoff (due to rate limiting or proxy blocks), OpenLectern automatically falls back to Piper TTS for remaining beats. Fallback provenance is recorded in `09_episode_compiled.json` and reported in the QA report.

### English Collegiate Masterclass Voice Specifications

- **Voice ID**: `en-US-ChristopherNeural` via Microsoft Edge-TTS
- **Gender & Persona**: Male, collegiate / institutional masterclass narrator.
- **Tone & Delivery**: Calm, authoritative, articulate, and measured. It provides a natural collegiate lecture delivery suited for quantitative finance and textbook deconstruction without sounding robotic or overly casual.
- **Locale**: US English (`en-US`).
- **Scope**: Serves as the single instructor voice across all English narration; zero alternating voices or juvenile junior-vs-mentor banter.
