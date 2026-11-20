import { describe, expect, it } from "vitest";
import { hashOf, stableStringify } from "../../src/core/fsutil";

describe("fsutil", () => {
  it("stableStringify sorts keys recursively", () => {
    expect(stableStringify({ b: 1, a: { d: 2, c: [3, { f: 1, e: 0 }] } })).toBe('{"a":{"c":[3,{"e":0,"f":1}],"d":2},"b":1}');
  });

  it("hashOf is independent of key order", () => {
    expect(hashOf({ x: 1, y: 2 })).toBe(hashOf({ y: 2, x: 1 }));
    expect(hashOf({ x: 1 })).not.toBe(hashOf({ x: 2 }));
  });
});
