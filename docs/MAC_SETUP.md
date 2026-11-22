# macOS & Antigravity IDE Setup Guide

OpenLectern is fully cross-platform and runs natively on macOS (Apple Silicon M1/M2/M3/M4 and Intel Macs) as well as Windows.

## 1. Prerequisites on macOS

Ensure you have [Homebrew](https://brew.sh) installed, then run:

```bash
# 1. Install Node.js 20+ and FFmpeg
brew install node@20 ffmpeg

# 2. (Optional) Install OCR and whisper tools
brew install tesseract whisper-cpp
```

## 2. Clone and Install Dependencies

```bash
git clone https://github.com/yash3155/Video-Generator.git
cd Video-Generator

# Install NPM dependencies
npm install

# Ensure Remotion's Chromium browser is installed
npx remotion browser ensure
```

Verify your environment with the system doctor:
```bash
node bin/openlectern.mjs doctor
```

## 3. Hardware Acceleration on macOS

OpenLectern automatically detects macOS and switches Remotion's Chromium renderer to Metal-backed hardware acceleration (`gl: "angle"`), taking full advantage of the GPU cores on Apple Silicon chips (M1/M2/M3/M4) for significantly faster 1080p rendering.

## 4. Running Video Production on macOS

### Run Single Chapter
To synthesize and render a specific chapter (e.g. Chapter 3 Part 1 in English & Hindi):
```bash
# Run S10 Speech Synthesis (Edge TTS)
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p1

# Run S11 Broadcast Render (CRF 17, 1080p @ 30fps)
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p1

# Run S12 QA Gate (Automated review handoff)
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p1

# Run S13 Packaging (Copies finalized mp4s to out/)
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p1
```

### Run Master Continuous Render Queue
To continuously render all compiled chapters in an automated loop:
```bash
node scripts/render_queue.mjs
```
Deliverables are automatically verified and packaged into `out/hull/` as `<chapter>_<part>_en.mp4` and `<chapter>_<part>_hi.mp4`.

## 5. Working Inside Antigravity IDE

When using Antigravity IDE on macOS:
- Open the repository folder directly.
- All AI Agent-as-LLM handoffs operate without external paid API keys.
- You can launch background tasks using the built-in terminal or AI assistant prompts.
