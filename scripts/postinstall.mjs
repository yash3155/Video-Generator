// Postinstall: expose the `openlectern` bin inside this checkout (so `npx openlectern` works without a
// global install) and run a non-fatal `doctor` so missing optional tools are reported early.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binDir = path.join(root, "node_modules", ".bin");

function linkSelfBin() {
  if (!fs.existsSync(path.join(root, "node_modules"))) return;
  // When installed as a dependency, npm links the bin itself.
  if (root.split(path.sep).includes("node_modules")) return;
  fs.mkdirSync(binDir, { recursive: true });
  const target = "../../bin/openlectern.mjs";
  const sh = `#!/bin/sh\nbasedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")\nexec node "$basedir/${target}" "$@"\n`;
  const cmd = `@ECHO off\r\nnode "%~dp0\\..\\..\\bin\\openlectern.mjs" %*\r\n`;
  const ps1 = `#!/usr/bin/env pwsh\r\n$basedir = Split-Path $MyInvocation.MyCommand.Definition -Parent\r\n& node "$basedir/${target}" $args\r\nexit $LASTEXITCODE\r\n`;
  fs.writeFileSync(path.join(binDir, "openlectern"), sh, { mode: 0o755 });
  fs.writeFileSync(path.join(binDir, "openlectern.cmd"), cmd);
  fs.writeFileSync(path.join(binDir, "openlectern.ps1"), ps1);
}

try {
  linkSelfBin();
} catch (e) {
  process.stderr.write(`[WARN] could not link the openlectern bin: ${e}\n`);
}

const r = spawnSync(process.execPath, [path.join(root, "bin", "openlectern.mjs"), "doctor", "--non-fatal"], { stdio: "inherit" });
if (r.error) process.stderr.write(`[WARN] doctor did not run: ${r.error}\n`);
process.exit(0);
