#!/usr/bin/env bash
set -e

echo "=================================================="
echo " Generating Hull Chapter 3 (Part 1 & Part 2)"
echo " Languages: English (Narration) & Hindi (Narration)"
echo " Visuals: 100% English Slides & Formulas (1080p)"
echo "=================================================="

mkdir -p out/hull

# ==========================================
# PART 1
# ==========================================
echo ""
echo ">>> [1/2] Processing Chapter 3 Part 1..."

echo "[Step 1/4] S10 Speech Synthesis (Edge TTS)..."
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p1

echo "[Step 2/4] S11 Broadcast 1080p Video Render..."
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p1

# Copy rendered videos immediately after S11 finishes
echo "[INFO] Copying Part 1 deliverables to out/hull/..."
cp -f workspace/books/hull/chapters/ch03/p1/render/en.mp4 out/hull/ch03_p1_en.mp4 2>/dev/null || true
cp -f workspace/books/hull/chapters/ch03/p1/render/hi.mp4 out/hull/ch03_p1_hi.mp4 2>/dev/null || true

echo "[Step 3/4] S12 Automated QA Checks..."
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p1 --no-review || true

echo "[Step 4/4] S13 Packaging..."
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p1 || true

# ==========================================
# PART 2
# ==========================================
echo ""
echo ">>> [2/2] Processing Chapter 3 Part 2..."

echo "[Step 1/4] S10 Speech Synthesis (Edge TTS)..."
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p2

echo "[Step 2/4] S11 Broadcast 1080p Video Render..."
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p2

# Copy rendered videos immediately after S11 finishes
echo "[INFO] Copying Part 2 deliverables to out/hull/..."
cp -f workspace/books/hull/chapters/ch03/p2/render/en.mp4 out/hull/ch03_p2_en.mp4 2>/dev/null || true
cp -f workspace/books/hull/chapters/ch03/p2/render/hi.mp4 out/hull/ch03_p2_hi.mp4 2>/dev/null || true

echo "[Step 3/4] S12 Automated QA Checks..."
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p2 --no-review || true

echo "[Step 4/4] S13 Packaging..."
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p2 || true

echo ""
echo "=================================================="
echo " Chapter 3 Complete in Both Languages!"
echo " Output files in out/hull/:"
ls -lh out/hull/ch03_*.mp4 2>/dev/null || true
echo "=================================================="
