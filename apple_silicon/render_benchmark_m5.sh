#!/bin/bash
# apple_silicon/render_benchmark_m5.sh
# 1-Click Remotion Render Benchmark for Apple Silicon (Mac M1/M2/M3/M4/M5)
# Renders Chapter 1 Part 1 & Part 2 (Hindi & English)

set -e

echo "=========================================================="
echo "⚡ APPLE SILICON REMOTION RENDER BENCHMARK"
echo "   Target Chapters: ch01_part1 & ch01_part2"
echo "   Engine: Hardware VideoToolbox / Metal Remotion Acceleration"
echo "=========================================================="

START_TIME=$(date +%s)

# Create output directories
mkdir -p out/chapters/murphy_technical_analysis
mkdir -p out/chapters/murphy_technical_analysis_en

# 1. Render Chapter 1 Part 1 (Hindi)
echo ""
echo "🎬 [1/4] Rendering ch01_part1 (Hindi)..."
npx remotion render src/index.ts EpisodeComposition \
  "out/chapters/murphy_technical_analysis/ch01_part1.mp4" \
  --props="src/data/chapters/murphy_technical_analysis/ch01_part1/episode_compiled.json" \
  --crf=16 \
  --pixel-format=yuv420p

# 2. Render Chapter 1 Part 1 (English)
echo ""
echo "🎬 [2/4] Rendering ch01_part1 (English)..."
npx remotion render src/index.ts EpisodeComposition \
  "out/chapters/murphy_technical_analysis_en/ch01_part1.mp4" \
  --props="src/data/chapters/murphy_technical_analysis_en/ch01_part1/episode_compiled.json" \
  --crf=16 \
  --pixel-format=yuv420p

# 3. Render Chapter 1 Part 2 (Hindi)
echo ""
echo "🎬 [3/4] Rendering ch01_part2 (Hindi)..."
npx remotion render src/index.ts EpisodeComposition \
  "out/chapters/murphy_technical_analysis/ch01_part2.mp4" \
  --props="src/data/chapters/murphy_technical_analysis/ch01_part2/episode_compiled.json" \
  --crf=16 \
  --pixel-format=yuv420p

# 4. Render Chapter 1 Part 2 (English)
echo ""
echo "🎬 [4/4] Rendering ch01_part2 (English)..."
npx remotion render src/index.ts EpisodeComposition \
  "out/chapters/murphy_technical_analysis_en/ch01_part2.mp4" \
  --props="src/data/chapters/murphy_technical_analysis_en/ch01_part2/episode_compiled.json" \
  --crf=16 \
  --pixel-format=yuv420p

END_TIME=$(date +%s)
TOTAL_SECS=$((END_TIME - START_TIME))

echo ""
echo "=========================================================="
echo "🏆 BENCHMARK COMPLETE!"
echo "   4 Videos Rendered in: ${TOTAL_SECS} seconds."
echo "   Average time per video: $((TOTAL_SECS / 4)) seconds."
echo "   Outputs located in 'out/chapters/'"
echo "=========================================================="

