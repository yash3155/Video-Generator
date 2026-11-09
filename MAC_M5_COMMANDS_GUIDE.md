# 🍎 Apple Silicon (Mac M5) Complete Setup & Render Guide

This document contains the step-by-step instructions and terminal commands to clone, configure, and benchmark this course-to-video autonomous engine on **Apple Silicon (Mac M1/M2/M3/M4/M5)** with **zero manual configuration**.

---

## 📋 Overview of What is Tested

1. **Chapter 1 Part 1 (`ch01_part1`)**:
   - Technical Analysis foundations (Market discounts all fundamentals).
   - Front hook: Retail investor buying on lagging 3-month earnings and suffering a 30% drawdown.
   - Includes full audio and 12-scene Remotion composition for **Hindi** (8,685 frames) and **English** (6,580 frames).
2. **Chapter 1 Part 2 (`ch01_part2`)**:
   - Flexibility and Adaptability vs Sector Specialization.
   - Front hook: Sector Specialization Trap locking capital during multi-year sector bear markets.
   - Includes full audio and 12-scene Remotion composition for **Hindi** (8,812 frames) and **English** (6,597 frames).

---

## 🚀 Execution Steps on Your Mac M5

### Step 1: Push from Windows Machine First
Before cloning on your Mac, push the latest commits containing the Apple Silicon scripts and compiled chapter assets to your remote Git repository:

```powershell
# Run on Windows:
git push origin main
```

---

### Step 2: Install Antigravity on Mac M5
Open **Terminal** on your Mac (`Cmd + Space`, type `Terminal`, hit Enter) and run:

```bash
curl -fsSL https://antigravity.google/install.sh | bash
```

> **Optional**: If you prefer the Antigravity Desktop IDE GUI application, download the Apple Silicon `.dmg` installer from [antigravity.google](https://antigravity.google) and drag it into `/Applications`.

---

### Step 3: Clone Repository and Run 1-Click Setup

In your Mac Terminal, clone your repository and run the automated setup script:

```bash
# 1. Clone the repository
git clone <YOUR_GIT_REPO_URL> "study video"
cd "study video"

# 2. Grant execution permission to the Mac scripts
chmod +x apple_silicon/*.sh

# 3. Run the automated 1-click environment setup
./apple_silicon/setup_apple_silicon.sh
```

#### What `setup_apple_silicon.sh` does automatically:
- ✅ Confirms Apple Silicon architecture (`arm64`).
- ✅ Installs/updates Homebrew if missing.
- ✅ Installs Node.js 20 LTS via Homebrew (`node@20`) and links it.
- ✅ Installs Antigravity CLI (`agy`) if not detected.
- ✅ Installs all project NPM packages (`npm install`).
- ✅ Configures execution permissions on the pre-compiled native macOS ARM64 Argon proxy (`apple_silicon/bin/gemini-core-darwin-arm64`).

---

### Step 4: Run Initial Remotion Render Benchmark (No API / Proxy Required)

The compiled chapter data and narration audio are already prepared and included in the repository. To benchmark your Mac M5 hardware Media Engine encoding speed, run:

```bash
./apple_silicon/render_benchmark_m5.sh
```

#### What this command renders:
| # | Video Output | Language | Resolution | Frames |
|---|:---|:---:|:---:|:---:|
| 1 | `out/chapters/murphy_technical_analysis/ch01_part1.mp4` | Hindi | 1080p @ 30fps | 8,685 (~289s) |
| 2 | `out/chapters/murphy_technical_analysis_en/ch01_part1.mp4` | English | 1080p @ 30fps | 6,580 (~219s) |
| 3 | `out/chapters/murphy_technical_analysis/ch01_part2.mp4` | Hindi | 1080p @ 30fps | 8,812 (~293s) |
| 4 | `out/chapters/murphy_technical_analysis_en/ch01_part2.mp4` | English | 1080p @ 30fps | 6,597 (~219s) |

At the end of the benchmark, the script displays the total render time in seconds and average rendering speed.

---

### Step 5: Inspect Rendered Videos and QA Release Gate

To play the rendered videos directly on macOS:
```bash
# Open Hindi Chapter 1 Part 1
open out/chapters/murphy_technical_analysis/ch01_part1.mp4

# Open English Chapter 1 Part 1
open out/chapters/murphy_technical_analysis_en/ch01_part1.mp4
```

To run the automated QA Release Gate validator on Mac:
```bash
# QA check for Chapter 1 Part 1 (Hindi)
node scripts/run_qa.mjs --dir=src/data/chapters/murphy_technical_analysis/ch01_part1

# QA check for Chapter 1 Part 2 (English)
node scripts/run_qa.mjs --dir=src/data/chapters/murphy_technical_analysis_en/ch01_part2
```

---

### Step 6: Running Full Autonomous Chapter Generation on Mac (With Argon)

When you are ready to produce new chapters end-to-end on Mac M5 (source extraction $\to$ Argon reasoning $\to$ Edge-TTS $\to$ Remotion $\to$ QA Release Gate):

#### A. Start the Local Gemini 4 Argon Proxy Daemon
```bash
./apple_silicon/start_argon_mac.sh
```
*This launches the pre-compiled native ARM64 proxy in the background on port `8001` and verifies its health endpoint (`http://127.0.0.1:8001/health`).*

#### B. Generate Chapter End-to-End
```bash
# Autonomous generation with Gemini 4 Argon:
./apple_silicon/run_pipeline_mac.sh ch01_part1

# Force regenerate if assets exist:
./apple_silicon/run_pipeline_mac.sh ch01_part1 --force
```

---

## 🛠️ Single-Command Cheat Sheet for Mac M5

```bash
# 1. Install Antigravity
curl -fsSL https://antigravity.google/install.sh | bash

# 2. Setup project
git clone <YOUR_GIT_REPO_URL> "study video" && cd "study video"
chmod +x apple_silicon/*.sh && ./apple_silicon/setup_apple_silicon.sh

# 3. Benchmark render ch01 part 1 & 2 (Hindi + English)
./apple_silicon/render_benchmark_m5.sh

# 4. View results
open out/chapters/murphy_technical_analysis/ch01_part1.mp4
```

