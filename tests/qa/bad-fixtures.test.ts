/* Every QA check id has a bad fixture under tests/fixtures/bad/<ID>/ that fails with exactly that id (new findings versus the clean fixture). */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { QA_CHECK_IDS } from "../../src/qa/registry";
import { buildMedia, evaluate, findingKey, layersFor, loadBadFixtures, loadClean, synthCompiled, type EvalOptions, type Media } from "./harness";

const clean = loadClean();
const compiled = synthCompiled(clean);
const fixtures = new Map(loadBadFixtures().map((x) => [x.fx.id, x.fx]));
const covered = new Set<string>();
let base: Media;
const baselines = new Map<string, Set<string>>();

function baseline(o: EvalOptions): Set<string> {
  const k = `${o.audio}-${o.render}`;
  if (!baselines.has(k)) baselines.set(k, new Set(evaluate(clean, compiled, {}, base, o).map(findingKey)));
  return baselines.get(k)!;
}

beforeAll(() => {
  base = buildMedia(compiled);
}, 300_000);

afterAll(() => {
  const n = QA_CHECK_IDS.length;
  console.log(`QA fixture coverage: ${Math.round((covered.size / n) * 100)}% (${covered.size}/${n})`);
});

describe("clean QA fixture", () => {
  it("passes every layer with no findings", () => {
    const all = evaluate(clean, compiled, {}, base, { audio: true, render: true });
    expect(all.map((f) => `${f.id} ${f.severity} ${f.sceneId ?? ""} ${f.message}`)).toEqual([]);
  }, 300_000);
});

describe("bad QA fixtures", () => {
  for (const id of QA_CHECK_IDS) {
    it(`${id} fails with exactly ${id}`, () => {
      const fx = fixtures.get(id);
      expect(fx, `tests/fixtures/bad/${id}/fixture.json`).toBeDefined();
      const o = layersFor(id);
      const media = fx!.audio || fx!.video || fx!.stills ? buildMedia(compiled, fx!, id) : base;
      const before = baseline(o);
      const added = evaluate(clean, compiled, fx!, media, o).filter((f) => !before.has(findingKey(f)));
      const other = added.filter((f) => f.id !== id).map((f) => `${f.id} ${f.severity} ${f.sceneId ?? ""}/${f.beatId ?? ""} ${f.message}`);
      expect(other, `${id} fixture also triggers other checks`).toEqual([]);
      expect(added.length, `${id} fixture triggers no ${id} finding`).toBeGreaterThan(0);
      covered.add(id);
    }, 300_000);
  }
});
