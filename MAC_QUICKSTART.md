# Video-Generator: macOS Quick Start Guide (MacBook Air / Pro / Mac Studio)

This guide provides step-by-step instructions to set up and run **Video-Generator** on macOS (Apple Silicon M1/M2/M3/M4/M5 and Intel Macs).

> **Note:** Video-Generator uses the built-in `openlectern` CLI engine (`bin/openlectern.mjs`) for automated pedagogical scripting, Microsoft Edge TTS audio synthesis, and Remotion 1080p video rendering.

---

## ⚡ Option A: Automated One-Command Setup

Open **Terminal** on your Mac, navigate to the folder where you want to clone the project, and run:

```bash
# 1. Clone the repository
git clone https://github.com/yash3155/Video-Generator.git
cd Video-Generator

# 2. Run the automated macOS setup script
chmod +x scripts/setup_mac.sh scripts/test_mac_render.sh
./scripts/setup_mac.sh

# 3. Run the test render (Draft + Broadcast Hull Chapter 3)
./scripts/test_mac_render.sh
```

---

## 🛠️ Option B: Step-by-Step Manual Setup

If you prefer to run the commands individually:

### 1. Install Prerequisites via Homebrew
Open Terminal and install Homebrew if you don't already have it:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Node.js 20+, FFmpeg, and Git:
```bash
brew install node@20 ffmpeg git
```

### 2. Clone the Repository
```bash
git clone https://github.com/yash3155/Video-Generator.git
cd Video-Generator
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Download Remotion Headless Chromium
```bash
npx remotion browser ensure
```

### 5. Check System Health
Verify that all dependencies and binaries are found:
```bash
node bin/openlectern.mjs doctor
```
*(All core checks should display `[OK]`.)*

---

## 🎬 How to Generate Videos

### 1. Quick 60-Second Demo Test
Generates a draft test video in `out/demo/drafts/`:
```bash
npm start -- --non-interactive --book demo --chapter ch01 --part p1 --lang en --llm replay --tts mock --draft
```

### 2. Generate Chapter 3 (Part 1 & Part 2) in Both English & Hindi

To generate the complete Chapter 3 in both languages with a single command:
```bash
chmod +x scripts/generate_ch03_both_languages.sh
./scripts/generate_ch03_both_languages.sh
```

Or run step-by-step manually:
```bash
# Part 1 (English + Hindi)
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p1
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p1
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p1 --no-review
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p1

# Part 2 (English + Hindi)
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p2
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p2
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p2 --no-review
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p2
```

> **Note on `--no-review`:** This flag tells the QA validator to run all 49 automated checks (syntax, timing, audio levels, frame integrity) without pausing to prompt for an LLM reviewer. Completed MP4 videos are ready in `out/hull/` immediately upon S11 render completion.

The completed broadcast videos will be in `out/hull/`:
- `ch03_p1_en.mp4` & `ch03_p1_hi.mp4`
- `ch03_p2_en.mp4` & `ch03_p2_hi.mp4`

### 3. Run the Automated Continuous Master Render Queue
To let your Mac render all remaining textbook chapters in an automated continuous loop:
```bash
node scripts/render_queue.mjs
```

---

## 🧹 Complete Teardown & Cleanup (Testing on a Guest Mac)

If you are testing on someone else's Mac and want to leave zero trace, run the automated teardown script:

```bash
chmod +x scripts/teardown_mac.sh
./scripts/teardown_mac.sh
```

This automatically cleans up:
- Project `node_modules/`, `out/`, `.build/`, and local workspace caches
- Remotion's Chromium browser download cache (`~/Library/Caches/remotion`)
- NPM cache

Then delete the project folder:
```bash
cd ..
rm -rf Video-Generator
```

*(Optional)* If you installed Homebrew packages specifically for this test and wish to remove them:
```bash
brew uninstall ffmpeg node@20
```

---

## 💡 Notes for Antigravity IDE / VS Code / Cursor
- When opening this repository in Antigravity IDE, open the root folder (`Video-Generator`).
- Use the integrated terminal (`Ctrl + \`` or `Cmd + \``) to run any of the commands above.
- Zero paid API keys are required. Spoken narration uses free Microsoft Edge TTS, and all reasoning stages run in automated Agent-as-LLM mode.
