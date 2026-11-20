import { check, exists, readJson, run, cli, tail, parseJsonLoose } from "../lib.mjs";

const npmScript = (name, timeout) =>
  check(name, `npm run ${name}`, () => {
    const r = run("npm", ["run", name], { timeout });
    return { ok: r.code === 0, detail: r.code === 0 ? "exit 0" : tail(r.out, 12) };
  });

export const checks = [
  npmScript("lint", 10 * 60 * 1000),
  npmScript("typecheck", 10 * 60 * 1000),
  check("test", "npm test", () => {
    const r = run("npm", ["test"], { timeout: 30 * 60 * 1000 });
    return { ok: r.code === 0, detail: r.code === 0 ? "exit 0" : tail(r.out, 15) };
  }),
  check("doctor-json", "npx openlectern doctor --json returns valid JSON", () => {
    const r = run("npx", ["--no-install", "openlectern", "doctor", "--json"], { timeout: 5 * 60 * 1000 });
    let viaNpx = true;
    let res = r;
    if (r.code !== 0 && /could not determine executable|not found|ENOENT/i.test(r.out)) {
      viaNpx = false;
      res = cli(["doctor", "--json"], { timeout: 5 * 60 * 1000 });
    }
    try {
      const j = JSON.parse(res.stdout.trim());
      const okShape = j && typeof j === "object" && Array.isArray(j.checks);
      return { ok: okShape && viaNpx, detail: `${viaNpx ? "npx" : "bin fallback"}; ${j.checks ? j.checks.length : 0} checks` };
    } catch (e) {
      return { ok: false, detail: "invalid JSON: " + tail(res.out, 6) };
    }
  }),
  check("oss-files", "license and community files exist", () => {
    const need = ["LICENSE", "NOTICE", "README.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "CHANGELOG.md", ".env.example", ".github/workflows/ci.yml"];
    const miss = need.filter((f) => !exists(f));
    return { ok: miss.length === 0, detail: miss.length ? "missing " + miss.join(",") : "all present" };
  }),
  check("remotion-versions", "all remotion packages have the identical exact version", () => {
    const pkg = readJson("package.json");
    const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const rem = Object.entries(all).filter(([n]) => n === "remotion" || n.startsWith("@remotion/"));
    if (rem.length < 3) return { ok: false, detail: `only ${rem.length} remotion packages declared` };
    const versions = new Set(rem.map(([, v]) => v));
    const exact = rem.every(([, v]) => /^\d+\.\d+\.\d+$/.test(v));
    return { ok: versions.size === 1 && exact, detail: rem.map(([n, v]) => `${n}@${v}`).join(" ") };
  }),
  check("exact-pins", "all dependencies pinned exactly and lockfile present", () => {
    const pkg = readJson("package.json");
    const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const loose = Object.entries(all).filter(([, v]) => /^[\^~]|[*x]|latest/.test(v));
    return { ok: loose.length === 0 && exists("package-lock.json"), detail: loose.length ? "loose: " + loose.map(([n]) => n).join(",") : "pinned" };
  }),
  check("doctor-parse", "doctor JSON reports node and ffmpeg checks", () => {
    const r = cli(["doctor", "--json"], { timeout: 5 * 60 * 1000 });
    const j = parseJsonLoose(r.stdout);
    const ids = (j.checks || []).map((c) => c.id);
    const need = ["node", "ffmpeg", "ffprobe", "chromium", "disk"];
    const miss = need.filter((n) => !ids.includes(n));
    return { ok: miss.length === 0, detail: miss.length ? "missing " + miss.join(",") : ids.join(",") };
  }),
];
