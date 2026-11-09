# Apple Silicon (Mac M1/M2/M3/M4/M5) Setup & Execution Guide

This directory contains everything required to clone, setup, and run this course-to-video autonomous engine on **Apple Silicon Macs** with zero manual friction.

---

## ⚡ Why Apple Silicon Excels for This Engine

1. **Remotion Video Rendering Acceleration**:
   - Apple Silicon contains dedicated **Hardware Media Engines** with ProRes and H.264/HEVC VideoToolbox encoders.
   - Video rendering runs **2x to 4x faster** than x86 Windows, producing 1080p 30fps broadcasts with near-zero heat and silent fans.
2. **Local Gemini 4 Argon Proxy**:
   - The Go proxy engine compiles into a single, high-performance native ARM64 Mach-O binary (`gemini-core-darwin-arm64`). It handles HTTP/3 QUIC streaming and connection multiplexing natively.
3. **Edge-TTS Audio & Zod Validation**:
   - Pure Node.js; runs natively on macOS arm64 without any binary translation or Rosetta.

---

## 🚀 3-Step Setup on Your Mac M5

### Step 1: Install Antigravity on Mac
Open Terminal on your Mac and run:
```bash
curl -fsSL https://antigravity.google/install.sh | bash
```
*(If you use the Antigravity IDE app, download the Universal DMG from `https://antigravity.google` and drag it into `/Applications`)*.

---

### Step 2: Clone the Repository & Run Setup
```bash
# Clone the repository
git clone <YOUR_GIT_REPO_URL> "study video"
cd "study video"

# Run the 1-click automated setup
chmod +x apple_silicon/*.sh
./apple_silicon/setup_apple_silicon.sh
```
This script automatically:
- Verifies Apple Silicon architecture (`arm64`),
- Ensures Node.js 20 LTS is active,
- Installs all project dependencies (`npm install`),
- Sets up the native macOS ARM64 Argon executable.

---

### Step 3: Run the Benchmark Render Test (Chapter 1 Part 1 & Part 2)
To test rendering immediately with pre-compiled audio and visual assets:
```bash
./apple_silicon/render_benchmark_m5.sh
```
This will render:
1. `ch01_part1` (Hindi)
2. `ch01_part1` (English)
3. `ch01_part2` (Hindi)
4. `ch01_part2` (English)

And report the exact encoding time and frames per second achieved by your Apple M5!

---

## 🧠 Running Full Autonomous Generation with Argon on Mac

To generate any new chapter part autonomously end-to-end on Mac:
```bash
# Start the local Gemini 4 Argon proxy (if not already running):
./apple_silicon/start_argon_mac.sh

# Generate a chapter end-to-end (Argon reasoning -> Edge-TTS -> Remotion -> Release Gate):
./apple_silicon/run_pipeline_mac.sh ch01_part1
```

All model calls, audio compilation, and Remotion rendering will run natively and autonomously.

