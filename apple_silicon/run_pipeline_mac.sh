#!/bin/bash
# apple_silicon/run_pipeline_mac.sh
# Autonomous End-to-End Chapter Generation on macOS Apple Silicon

set -e

CHAPTER=${1:-"ch01_part1"}
FORCE=${2:-""}

echo "=========================================================="
echo "🍎 AUTONOMOUS VIDEO PRODUCTION ON APPLE SILICON"
echo "   Target Chapter: $CHAPTER"
echo "=========================================================="

# 1. Ensure Argon Proxy is running
if ! curl -s http://127.0.0.1:8001/health | grep -q "online"; then
  echo "📡 Starting local Argon proxy daemon..."
  ./apple_silicon/start_argon_mac.sh
fi

# 2. Run master batch producer with Argon
echo "🚀 Running production pipeline with Gemini 4 Argon..."
node scripts/batch_produce_murphy_with_argon.mjs "$CHAPTER" $FORCE

echo ""
echo "🎉 Chapter $CHAPTER generated and QA verified on Apple Silicon!"
