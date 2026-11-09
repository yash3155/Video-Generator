#!/bin/bash
# apple_silicon/start_argon_mac.sh
# Starts the local Gemini 4 Argon Proxy on macOS Apple Silicon

set -e

ARGON_BIN="../free-gemini-api/gemini-core-darwin-arm64"

if [ ! -f "$ARGON_BIN" ]; then
  if [ -d "../free-gemini-api/free-gemini-api" ]; then
    echo "🔨 Compiling native Apple Silicon Argon Proxy binary..."
    (cd ../free-gemini-api/free-gemini-api && go build -ldflags="-s -w" -o ../gemini-core-darwin-arm64)
    chmod +x "$ARGON_BIN"
  else
    echo "❌ Error: Cannot find $ARGON_BIN or Go source code."
    exit 1
  fi
fi

chmod +x "$ARGON_BIN"

echo "🚀 Starting Gemini 4 Argon Proxy daemon on port :8001..."
(cd ../free-gemini-api && ./gemini-core-darwin-arm64 > /tmp/gemini_argon_mac.log 2>&1 &)

sleep 2

# Check health
if curl -s http://127.0.0.1:8001/health | grep -q "online"; then
  echo "✅ Gemini 4 Argon Proxy is ONLINE and healthy at http://127.0.0.1:8001"
else
  echo "⚠️ Argon Proxy started; checking status..."
  curl -s http://127.0.0.1:8001/health || true
fi

