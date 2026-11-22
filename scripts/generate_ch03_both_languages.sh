#!/usr/bin/env bash
set -e

echo "=================================================="
echo " Generating Hull Chapter 3 (Part 1 & Part 2)"
echo " Languages: English (Narration) & Hindi (Narration)"
echo " Visuals: 100% English Slides & Formulas (1080p)"
echo "=================================================="

# Part 1
echo ""
echo ">>> [1/2] Processing Chapter 3 Part 1..."
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p1
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p1
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p1
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p1

mkdir -p out/hull
cp -f workspace/books/hull/chapters/ch03/p1/render/en.mp4 out/hull/ch03_p1_en.mp4 2>/dev/null || true
cp -f workspace/books/hull/chapters/ch03/p1/render/hi.mp4 out/hull/ch03_p1_hi.mp4 2>/dev/null || true

# Part 2
echo ""
echo ">>> [2/2] Processing Chapter 3 Part 2..."
node bin/openlectern.mjs run S10 --book hull --chapter ch03 --part p2
node bin/openlectern.mjs run S11 --book hull --chapter ch03 --part p2
node bin/openlectern.mjs run S12 --book hull --chapter ch03 --part p2
node bin/openlectern.mjs run S13 --book hull --chapter ch03 --part p2

cp -f workspace/books/hull/chapters/ch03/p2/render/en.mp4 out/hull/ch03_p2_en.mp4 2>/dev/null || true
cp -f workspace/books/hull/chapters/ch03/p2/render/hi.mp4 out/hull/ch03_p2_hi.mp4 2>/dev/null || true

echo ""
echo "=================================================="
echo " Chapter 3 Complete in Both Languages!"
echo " Output files in out/hull/:"
ls -lh out/hull/ch03_*.mp4 2>/dev/null || true
echo "=================================================="
