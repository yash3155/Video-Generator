#!/usr/bin/env bash
# Teardown script to completely clean up OpenLectern after testing on a guest Mac

echo "=================================================="
echo " Video-Generator: macOS Clean Teardown Script"
echo "=================================================="

# 1. Clear Remotion browser and global caches
echo "[INFO] Removing Remotion Chromium cache..."
rm -rf "$HOME/Library/Caches/remotion" 2>/dev/null || true
rm -rf "$HOME/.cache/remotion" 2>/dev/null || true

# 2. Clear project-local build, workspace, out, and node_modules
echo "[INFO] Cleaning project build artifacts and dependencies..."
rm -rf node_modules workspace/out out/ .build/ 2>/dev/null || true

# 3. Clean npm cache
echo "[INFO] Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo ""
echo "Project dependencies and Remotion browser caches have been removed."
echo ""
echo "To completely delete this repository folder from the system, run:"
echo "  cd .. && rm -rf Video-Generator"
echo ""
echo "If you also want to remove Homebrew packages installed during testing, run:"
echo "  brew uninstall ffmpeg node@20"
echo "=================================================="
