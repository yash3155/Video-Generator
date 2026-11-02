// src/utils/modelPreflight.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

/**
 * Executes the mandatory model preflight check for Gemini 4 Argon.
 * Tests local proxy connectivity, daemon launch capability, and cookie sessions.
 */
export async function checkArgonPreflight(rootDir = process.cwd()) {
  if (process.env.FORCE_ARGON_OFFLINE === '1') {
    return {
      available: false,
      reason: 'Forced offline via FORCE_ARGON_OFFLINE test configuration.',
    };
  }

  const proxyBase = process.env.GEMINI_BASE_URL || 'http://127.0.0.1:8001';
  const healthUrl = proxyBase.replace(/\/v1\/chat\/completions\/?$/, '').replace(/\/+$/, '') + '/health';

  // 1. Direct health check
  try {
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      return { available: true, engine: 'proxy', url: healthUrl };
    }
  } catch {}

  // 2. Try launching local free-gemini-api proxy if executable exists
  const candidateExe = [
    path.resolve(rootDir, '..', 'free-gemini-api', 'gemini-core-windows-amd64.exe'),
    path.resolve(rootDir, 'free-gemini-api', 'gemini-core-windows-amd64.exe'),
  ];
  const exePath = candidateExe.find((p) => fs.existsSync(p));

  if (exePath) {
    try {
      const subprocess = spawn(exePath, [], {
        cwd: path.dirname(exePath),
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, WS_PORT: '9999' },
      });
      subprocess.unref();

      for (let i = 0; i < 8; i++) {
        await new Promise((r) => setTimeout(r, 600));
        try {
          const res = await fetch(healthUrl, { signal: AbortSignal.timeout(800) });
          if (res.ok) {
            return { available: true, engine: 'proxy', url: healthUrl };
          }
        } catch {}
      }
    } catch {}
  }

  // 3. Check for direct cookie session
  const cookiePath = path.resolve(rootDir, '..', 'free-gemini-api', 'cookies', 'cookies.json');
  if (fs.existsSync(cookiePath)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
      if (Array.isArray(cookies) && cookies.length > 0) {
        return { available: true, engine: 'direct_cookies', path: cookiePath };
      }
    } catch {}
  }

  return {
    available: false,
    reason: 'Gemini 4 Argon proxy is offline and no active direct cookie session was detected.',
  };
}
