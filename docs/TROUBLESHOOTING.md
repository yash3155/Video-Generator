# Troubleshooting Guide

Solutions and diagnostic steps for common issues encountered when setting up or running OpenLectern.

## 1. System Environment Check

Always start by running the built-in diagnostic tool:

```powershell
npx openlectern doctor
```

It inspects your Node runtime, ffmpeg/ffprobe, Chromium headless browser, disk space, and optional tools (nlm CLI, Piper TTS, Whisper, Tesseract).

## 2. Network and Proxy Settings

If you work behind a corporate HTTP/HTTPS proxy or firewall:
- Set environment variables:
  ```powershell
  $env:HTTP_PROXY = "http://proxy.example.com:8080"
  $env:HTTPS_PROXY = "http://proxy.example.com:8080"
  $env:NODE_USE_ENV_PROXY = "1"
  ```
- OpenLectern passes these proxy variables to:
  - npm package installations
  - Remotion headless Chromium browser downloads
  - Edge TTS websocket connections
  - LLM API requests (OpenAI, Anthropic, Gemini)

## 3. Remotion Rendering Issues

### Chromium Browser Download
If Remotion fails with "Browser not found", manually trigger the download:
```powershell
npx remotion browser ensure
```

### Clearing Bundle Cache
If UI changes or font additions do not appear in stills or renders, clear the Remotion bundle cache:
```powershell
Remove-Item -Recurse -Force node_modules\.cache\openlectern
```

### Out-of-Memory / High Concurrency
Remotion uses half your available CPU cores by default. On constrained systems, use `--draft` to test layouts at half scale and faster speeds.

## 4. Agent Hand-off and Exit Code 75

When running without paid API keys (zero-key default):
- OpenLectern writes task files to `workspace/.tasks/<task_id>/` and exits with code 75 (`AWAITING_AGENT`).
- This is normal and expected behavior!
- To resume:
  1. Inspect `workspace/.tasks/<task_id>/prompt.md` and `input.json`.
  2. Write your valid response to `output.json`.
  3. Validate: `node bin/openlectern.mjs task:validate <task_id>`.
  4. Re-run your `make` or `start` command.

## 5. Mathematical Notation (LaTeX) Fixes

- **C-10 (Control characters in JSON strings)**: Swallowed backslashes such as `\text` turning into a tab character (`\t`). Always escape LaTeX backslashes inside JSON strings: `"\\text{...}"` or `"\\frac{a}{b}"`.
- **C-11 (Forbidden math text)**: Never write raw `/text`, `/frac`, or naked underscores `_` in plain screen text. Use typed math segments `{ "type": "math", "latex": "S_T" }`.
- **C-12 (KaTeX syntax error)**: Check for unbalanced braces or unrecognized LaTeX commands. KaTeX runs in strict mode.
- **C-13 (Six-way arithmetic mismatch)**: The arithmetic computed by `mathjs` must agree within rounding tolerance with on-screen numbers, chart markers, and spoken narration.

## 6. TTS Synthesis Issues

- **Edge TTS rate limits / timeout**: OpenLectern retries 3 times with exponential backoff. If Edge TTS remains unreachable, it falls back to local Piper TTS if installed.
- **Unresolved visual cues (A-06)**: Every `visualCue` anchor word in a visual template must appear in the word timings returned by the TTS engine. Check spelling between the visual cue anchor and the beat's spoken narration.
