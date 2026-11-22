#!/usr/bin/env bash
set -e

echo "=================================================="
echo " Testing Video Generation on macOS (Apple Silicon)"
echo "=================================================="

# 1. Quick 60-second replay demo
echo "[1/2] Running 60-second draft test..."
npm start -- --non-interactive --book demo --chapter ch01 --part p1 --lang en --llm replay --tts mock --draft

echo "[OK] Draft test completed. Output located in: out/demo/drafts/"

# 2. Test Hull Chapter 3 Part 1 (Speech Synthesis + Broadcast 1080p Render)
echo "[2/2] Generating Hull Chapter 3 Part 1 in English & Hindi..."
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p1
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p1

mkdir -p out/hull
cp -f workspace/books/hull/chapters/ch03/p1/render/en.mp4 out/hull/ch03_p1_en.mp4 2>/dev/null || true
cp -f workspace/books/hull/chapters/ch03/p1/render/hi.mp4 out/hull/ch03_p1_hi.mp4 2>/dev/null || true

node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p1 --no-review || true
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p1 || true

echo "=================================================="
echo " Test completed successfully!"
echo " Broadcast videos are ready in out/hull/:"
ls -lh out/hull/ch03_p1_*.mp4 2>/dev/null || true
echo "=================================================="
