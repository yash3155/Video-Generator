#!/bin/bash
# apple_silicon/setup_apple_silicon.sh
# Automated 1-Click Environment Setup for Apple Silicon (Mac M1/M2/M3/M4/M5)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=========================================================="
echo "🍎 APPLE SILICON (M-SERIES) AUTONOMOUS ENVIRONMENT SETUP"
echo "=========================================================="

# 1. Verify Apple Silicon (arm64)
ARCH=$(uname -m)
if [ "$ARCH" != "arm64" ]; then
  echo "⚠️ Warning: System architecture is $ARCH (expected arm64 for Apple Silicon)."
else
  echo "✅ Verified Apple Silicon architecture: $ARCH"
fi

# 2. Check Homebrew
if ! command -v brew &> /dev/null; then
  echo "📦 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "✅ Homebrew is installed."
fi

# 3. Check Node.js
if ! command -v node &> /dev/null || [ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 20 ]; then
  echo "📦 Installing Node.js 20 LTS via Homebrew..."
  brew install node@20
  brew link --force --overwrite node@20
else
  echo "✅ Node.js $(node -v) is installed."
fi

# 4. Check Antigravity CLI (agy)
if ! command -v agy &> /dev/null; then
  echo "🚀 Installing Antigravity CLI..."
  curl -fsSL https://antigravity.google/install.sh | bash
  export PATH="$HOME/.antigravity/bin:$PATH"
else
  echo "✅ Antigravity CLI ($(agy --version 2>/dev/null || echo 'ready')) is installed."
fi

# 5. Install Project Dependencies
echo "📦 Installing project dependencies via npm..."
cd "$ROOT_DIR"
npm install

# 6. Setup macOS native Argon binary
if [ -f "$SCRIPT_DIR/bin/gemini-core-darwin-arm64" ]; then
  echo "🔧 Configuring native Apple Silicon Argon Proxy executable..."
  chmod +x "$SCRIPT_DIR/bin/gemini-core-darwin-arm64"
elif [ -f "$ROOT_DIR/../free-gemini-api/gemini-core-darwin-arm64" ]; then
  mkdir -p "$SCRIPT_DIR/bin"
  cp "$ROOT_DIR/../free-gemini-api/gemini-core-darwin-arm64" "$SCRIPT_DIR/bin/gemini-core-darwin-arm64"
  chmod +x "$SCRIPT_DIR/bin/gemini-core-darwin-arm64"
fi

# 7. Grant execution permissions on all mac helper scripts
chmod +x "$SCRIPT_DIR"/*.sh

echo ""
echo "=========================================================="
echo "🎉 SETUP COMPLETE! Ready for broadcast rendering on Mac M-series."
echo "   Run './apple_silicon/render_benchmark_m5.sh' to test Remotion rendering."
echo "=========================================================="
