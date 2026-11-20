import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { sixWay, type SixWayInput } from "../../src/math/six-way";

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "fixtures", "math", "six-way-mismatch.json"), "utf8")) as { good: SixWayInput; bad: SixWayInput };

describe("six-way agreement (C-13)", () => {
  it("six-way-mismatch.json good variant: all six legs agree", () => {
    const rep = sixWay(fixture.good);
    expect(rep.ok).toBe(true);
    for (const leg of ["equation", "arithmetic", "chart", "narration", "conclusion"] as const) expect(rep.legs[leg].status).toBe("agree");
    expect(rep.legs.annotations.status).not.toBe("mismatch");
  });

  it("six-way-mismatch.json bad variant: narration, chart and conclusion disagree", () => {
    const rep = sixWay(fixture.bad);
    expect(rep.ok).toBe(false);
    expect(rep.legs.narration.status).toBe("mismatch");
    expect(rep.legs.chart.status).toBe("mismatch");
    expect(rep.legs.conclusion.status).toBe("mismatch");
    expect(rep.legs.equation.status).toBe("agree");
    expect(rep.legs.arithmetic.status).toBe("agree");
  });

  it("a wrong typeset step fails the equation leg", () => {
    const steps = fixture.good.steps.map((s, i) => (i === 1 ? { ...s, latex: "1100 \\times 1.10 = 1201" } : s));
    const rep = sixWay({ ...fixture.good, steps });
    expect(rep.legs.equation.status).toBe("mismatch");
  });

  it("a step value that does not recompute fails the arithmetic leg", () => {
    const steps = fixture.good.steps.map((s, i) => (i === 0 ? { ...s, value: 1110 } : s));
    const rep = sixWay({ ...fixture.good, steps });
    expect(rep.legs.arithmetic.status).toBe("mismatch");
  });

  it("numbers from the source facts are never near-misses", () => {
    const narration = [...fixture.good.narration, "Simple interest would give 1,200 dollars instead."];
    expect(sixWay({ ...fixture.good, narration }).legs.narration.status).toBe("mismatch");
    expect(sixWay({ ...fixture.good, narration, knownNumbers: [1200] }).legs.narration.status).toBe("agree");
  });
});
