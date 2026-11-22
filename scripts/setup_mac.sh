#!/usr/bin/env bash
set -e

echo "=================================================="
echo " Video-Generator: macOS Automated Setup Script"
echo "=================================================="

# 1. Check / Install Homebrew
if ! command -v brew &> /dev/null; then
    echo "[INFO] Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [ -f "/opt/homebrew/bin/brew" ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -f "/usr/local/bin/brew" ]; then
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo "[OK] Homebrew is installed."
fi

# 2. Check / Install Node.js and FFmpeg
echo "[INFO] Checking Node.js and FFmpeg..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1 | sed 's/v//')" -lt 20 ]; then
    echo "[INFO] Installing Node.js 20+..."
    brew install node@20
    brew link --overwrite node@20
fi

if ! command -v ffmpeg &> /dev/null; then
    echo "[INFO] Installing FFmpeg..."
    brew install ffmpeg
fi

echo "[OK] Node.js version: $(node -v)"
echo "[OK] FFmpeg version: $(ffmpeg -version | head -n 1)"

# 3. Install NPM dependencies
echo "[INFO] Installing NPM dependencies..."
npm install

# 4. Ensure Remotion Chromium is downloaded
echo "[INFO] Ensuring Remotion headless browser is available..."
npx remotion browser ensure

# 5. Run OpenLectern Doctor
echo "[INFO] Running OpenLectern system diagnostics..."
node bin/openlectern.mjs doctor

echo "=================================================="
echo " Setup complete! You are ready to generate videos."
echo " To run a quick test: ./scripts/test_mac_render.sh"
echo "=================================================="
