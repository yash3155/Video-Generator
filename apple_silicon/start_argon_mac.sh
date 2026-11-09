#!/bin/bash
# apple_silicon/start_argon_mac.sh
# Starts the local Gemini 4 Argon Proxy on macOS Apple Silicon

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARGON_BIN="$SCRIPT_DIR/bin/gemini-core-darwin-arm64"

if [ ! -f "$ARGON_BIN" ]; then
  if [ -f "$SCRIPT_DIR/../../free-gemini-api/gemini-core-darwin-arm64" ]; then
    ARGON_BIN="$SCRIPT_DIR/../../free-gemini-api/gemini-core-darwin-arm64"
  elif [ -d "$SCRIPT_DIR/../../free-gemini-api/free-gemini-api" ]; then
    echo "🔨 Compiling native Apple Silicon Argon Proxy binary..."
    (cd "$SCRIPT_DIR/../../free-gemini-api/free-gemini-api" && go build -ldflags="-s -w" -o "$ARGON_BIN")
  else
    echo "❌ Error: Cannot find $ARGON_BIN"
    exit 1
  fi
fi

chmod +x "$ARGON_BIN"

echo "🚀 Starting Gemini 4 Argon Proxy daemon on port :8001..."
WORK_DIR="$(dirname "$ARGON_BIN")"
(cd "$WORK_DIR" && "$ARGON_BIN" > /tmp/gemini_argon_mac.log 2>&1 &)

sleep 2

# Check health
if curl -s http://127.0.0.1:8001/health | grep -q "online"; then
  echo "✅ Gemini 4 Argon Proxy is ONLINE and healthy at http://127.0.0.1:8001"
else
  echo "⚠️ Argon Proxy started; checking status..."
  curl -s http://127.0.0.1:8001/health || true
fi
