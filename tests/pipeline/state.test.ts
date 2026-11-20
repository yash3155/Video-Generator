import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fingerprint, hashOutputs, isCached, loadState, saveState } from "../../src/pipeline/state";
import type { PartContext, Stage } from "../../src/pipeline/types";

let home: string;
const prevHome = process.env.OPENLECTERN_HOME;

beforeAll(() => {
  home = fs.mkdtempSync(path.join(os.tmpdir(), "ol-state-"));
  process.env.OPENLECTERN_HOME = home;
});
afterAll(() => {
  if (prevHome === undefined) delete process.env.OPENLECTERN_HOME;
  else process.env.OPENLECTERN_HOME = prevHome;
  fs.rmSync(home, { recursive: true, force: true });
});

function setup() {
  const partDir = path.join(home, "workspace", "books", "b", "chapters", "ch01", "p1");
  fs.mkdirSync(partDir, { recursive: true });
  const input = path.join(partDir, "in.json");
  const output = path.join(partDir, "out.json");
  fs.writeFileSync(input, '{"a":1}');
  const ctx = { partDir } as PartContext;
  let param = 1;
  const stage: Stage = {
    id: "S3",
    name: "test",
    version: 1,
    inputs: () => ({ files: [input], params: { param } }),
    outputs: () => [output],
    run: async () => {
      fs.writeFileSync(output, "x");
    },
  };
  const runAndSave = async () => {
    await stage.run(ctx);
    const s = loadState(ctx);
    s.stages.S3 = { fingerprint: fingerprint(stage, ctx), outputs: hashOutputs(stage.outputs(ctx)), mock: false, finishedAt: "now" };
    saveState(ctx, s);
  };
  const cached = () => isCached(stage, ctx, loadState(ctx), fingerprint(stage, ctx));
  return { input, output, runAndSave, cached, setParam: (v: number) => (param = v) };
}

describe("stage cache", () => {
  it("is cached only while inputs, params and outputs are unchanged", async () => {
    const t = setup();
    expect(t.cached()).toBe(false);
    await t.runAndSave();
    expect(t.cached()).toBe(true);

    fs.writeFileSync(t.input, '{"a":2}');
    expect(t.cached()).toBe(false);
    await t.runAndSave();
    expect(t.cached()).toBe(true);

    t.setParam(2);
    expect(t.cached()).toBe(false);
    await t.runAndSave();

    fs.writeFileSync(t.output, "edited by hand");
    expect(t.cached()).toBe(false);
    await t.runAndSave();

    fs.rmSync(t.output);
    expect(t.cached()).toBe(false);
  });

  it("stores paths relative to OPENLECTERN_HOME", async () => {
    const t = setup();
    await t.runAndSave();
    const raw = fs.readFileSync(path.join(path.dirname(t.input), ".pipeline", "state.json"), "utf8");
    expect(raw).not.toContain(home.replace(/\\/g, "\\\\"));
    expect(raw).toContain("workspace/books/b/chapters/ch01/p1/out.json");
  });
});
