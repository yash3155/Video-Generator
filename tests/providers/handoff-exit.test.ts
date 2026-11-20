import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AWAITING_AGENT_EXIT_CODE } from "../../src/llm/types";

const REPO = path.join(__dirname, "..", "..");
const BIN = path.join(REPO, "bin", "openlectern.mjs");
let home: string;

function cli(args: string[]) {
  const r = spawnSync(process.execPath, [BIN, ...args], {
    cwd: REPO,
    env: { ...process.env, OPENLECTERN_HOME: home },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120_000,
  });
  return { code: r.status, stdout: r.stdout, stderr: r.stderr };
}

beforeAll(() => {
  home = fs.mkdtempSync(path.join(os.tmpdir(), "ol-handoff-"));
});
afterAll(() => fs.rmSync(home, { recursive: true, force: true }));

describe("agent hand-off in exit mode (non-TTY)", () => {
  it("exits with code 75 and prints AWAITING_AGENT lines, then resumes after the agent answers", () => {
    expect(AWAITING_AGENT_EXIT_CODE).toBe(75);

    const first = cli(["llm:test"]);
    expect(first.code).toBe(75);
    const lines = first.stdout.trim().split(/\r?\n/).filter((l) => l.startsWith("AWAITING_AGENT "));
    expect(lines).toHaveLength(1);
    const [, taskId, dir] = lines[0].split(" ");
    expect(taskId).toMatch(/^check-p1-ping-[0-9a-f]{8}$/);
    for (const f of ["prompt.md", "input.json", "output.schema.json", "task.json"]) expect(fs.existsSync(path.join(dir, f))).toBe(true);

    // Still unanswered: the same task is reported again and nothing else happens.
    expect(cli(["llm:test"]).code).toBe(75);

    // A wrong answer fails task:validate (content gate) ...
    fs.writeFileSync(path.join(dir, "output.json"), JSON.stringify({ answer: "hello" }));
    const bad = cli(["task:validate", taskId]);
    expect(bad.code).toBe(1);
    expect(bad.stderr).toMatch(/pong/);

    // ... a correct one passes, and re-running the command completes.
    fs.writeFileSync(path.join(dir, "output.json"), JSON.stringify({ answer: "pong from the agent" }));
    expect(cli(["task:validate", taskId]).code).toBe(0);
    const done = cli(["llm:test", "--json"]);
    expect(done.code).toBe(0);
    expect(JSON.parse(done.stdout).answer).toBe("pong from the agent");
  });

  it("rejects an invalid answer on re-run: moves it aside, writes feedback.md and exits 75 again", () => {
    const freshHome = fs.mkdtempSync(path.join(os.tmpdir(), "ol-handoff2-"));
    const prev = home;
    home = freshHome;
    try {
      const r1 = cli(["llm:test"]);
      expect(r1.code).toBe(75);
      const [, , dir] = r1.stdout.trim().split(" ");
      fs.writeFileSync(path.join(dir, "output.json"), JSON.stringify({ answer: 42 }));
      const r2 = cli(["llm:test"]);
      expect(r2.code).toBe(75);
      expect(r2.stdout).toMatch(/^AWAITING_AGENT /m);
      expect(fs.existsSync(path.join(dir, "output.rejected.json"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "output.json"))).toBe(false);
      expect(fs.readFileSync(path.join(dir, "feedback.md"), "utf8")).toMatch(/answer/);
    } finally {
      home = prev;
      fs.rmSync(freshHome, { recursive: true, force: true });
    }
  });
});
