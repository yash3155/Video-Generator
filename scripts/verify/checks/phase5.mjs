import fs from "node:fs";
import path from "node:path";
import { check, cli, tail, parseJsonLoose, VERIFY_DIR, rmrf, pngStats, exists } from "../lib.mjs";

const OUT = path.join(VERIFY_DIR, "stills");
let registry = null;

export const checks = [
  check("registry", "template registry lists templates", () => {
    const r = cli(["templates", "--json"], { timeout: 2 * 60 * 1000 });
    try {
      registry = parseJsonLoose(r.stdout).templates || [];
    } catch {
      return { ok: false, detail: tail(r.out, 8) };
    }
    return { ok: registry.length >= 16, detail: `${registry.length} templates` };
  }),
  check("stills", "render:stills --fixtures writes one PNG per registered template (> 20 KB, not single-colour)", async () => {
    if (!registry) return { ok: false, detail: "registry unavailable" };
    rmrf(OUT);
    const r = cli(["render:stills", "--fixtures", "--out", OUT], { timeout: 30 * 60 * 1000 });
    if (r.code !== 0) return { ok: false, detail: tail(r.out, 10) };
    const bad = [];
    for (const t of registry) {
      const id = typeof t === "string" ? t : t.id;
      const f = path.join(OUT, `${id}.png`);
      if (!fs.existsSync(f)) {
        bad.push(id + ":missing");
        continue;
      }
      if (fs.statSync(f).size <= 20 * 1024) bad.push(id + ":small");
      const st = await pngStats(f);
      if (st.colours <= 1) bad.push(id + ":single-colour");
    }
    const pngs = fs.readdirSync(OUT).filter((f) => f.endsWith(".png") && !f.startsWith("_"));
    return { ok: bad.length === 0 && pngs.length === registry.length, detail: bad.length ? bad.join(",") : `${pngs.length} PNGs` };
  }),
  check("overflow", "the overflow fixture is reported in overflow.json", () => {
    const f = path.join(OUT, "overflow.json");
    if (!fs.existsSync(f)) return { ok: false, detail: "overflow.json missing" };
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    const entries = Array.isArray(j) ? j : j.entries || [];
    const hit = entries.filter((e) => String(e.fixture || e.still || "").includes("overflow"));
    const clean = entries.filter((e) => !String(e.fixture || e.still || "").includes("overflow"));
    return { ok: hit.length > 0 && clean.length === 0, detail: `overflow entries=${hit.length}, unexpected=${clean.length}` };
  }),
  check("object-object", "the [object Object] fixture throws", () => {
    const fx = "tests/fixtures/templates/object-object.json";
    if (!exists(fx)) return { ok: false, detail: "missing " + fx };
    const r = cli(["render:stills", "--fixture", fx, "--out", path.join(VERIFY_DIR, "stills-bad")], { timeout: 10 * 60 * 1000 });
    return { ok: r.code !== 0 && /\[object Object\]/.test(r.out), detail: `exit ${r.code}: ${tail(r.out, 2)}` };
  }),
];
