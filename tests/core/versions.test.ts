import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf8"));
const all: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };

describe("package versions", () => {
  it("pins every dependency exactly", () => {
    const loose = Object.entries(all).filter(([, v]) => /^[\^~]|[*x]|latest/.test(v));
    expect(loose).toEqual([]);
  });

  it("uses one identical version for remotion and every @remotion/* package", () => {
    const rem = Object.entries(all).filter(([n]) => n === "remotion" || n.startsWith("@remotion/"));
    expect(rem.length).toBeGreaterThanOrEqual(3);
    expect(new Set(rem.map(([, v]) => v)).size).toBe(1);
  });

  it("is open source and not private", () => {
    expect(pkg.license).toBe("Apache-2.0");
    expect(pkg.private).not.toBe(true);
  });
});
