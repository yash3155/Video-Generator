# Video-Generator: macOS & Antigravity IDE Setup Guide

Video-Generator is fully cross-platform and runs natively on macOS (Apple Silicon M1/M2/M3/M4/M5 and Intel Macs) as well as Windows. It uses the built-in `openlectern` engine CLI (`node bin/openlectern.mjs`) for video compilation and rendering.

## 1. Prerequisites on macOS

Ensure you have [Homebrew](https://brew.sh) installed, then run:

```bash
# 1. Install Node.js 20+ and FFmpeg
brew install node@20 ffmpeg git

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

Video-Generator automatically detects macOS and switches Remotion's Chromium renderer to Metal-backed hardware acceleration (`gl: "angle"`), taking full advantage of the GPU cores on Apple Silicon chips for significantly faster 1080p rendering (up to 16x faster than software rendering).

## 4. Running Video Production on macOS

### Option A: Complete Chapter 3 Dual-Language Video in One Command
```bash
chmod +x scripts/generate_ch03_both_languages.sh
./scripts/generate_ch03_both_languages.sh
```

### Option B: Step-by-Step Manual Run
To synthesize and render any specific chapter (e.g. Chapter 3 Part 1 in English & Hindi):
```bash
# Run S10 Speech Synthesis (Edge TTS)
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p1

# Run S11 Broadcast Render (CRF 17, 1080p @ 30fps)
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p1

# Run S12 QA Gate (with --no-review for automated execution)
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p1 --no-review

# Run S13 Packaging (Copies finalized mp4s to out/)
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p1
```

### Option C: Run Master Continuous Render Queue
To continuously render all compiled chapters in an automated loop:
```bash
node scripts/render_queue.mjs
```
Deliverables are automatically verified and packaged into `out/hull/` as `<chapter>_<part>_en.mp4` and `<chapter>_<part>_hi.mp4`.

## 5. Working Inside Antigravity IDE

When using Antigravity IDE on macOS:
- Open the repository folder directly (`Video-Generator`).
- All AI Agent-as-LLM handoffs operate without external paid API keys.
- You can launch background tasks using the built-in terminal or AI assistant prompts.
