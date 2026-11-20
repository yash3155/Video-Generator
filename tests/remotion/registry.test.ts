import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TEMPLATE_IDS } from "../../src/remotion/templates/schemas";
import { TEMPLATE_REGISTRY, templateJsonSchema } from "../../src/remotion/templates/registry";
import { Topology } from "../../src/schemas/storyboard";
import { galleryJobs, loadStillFixture, TEMPLATE_FIXTURE_DIR } from "../../src/render/stills";

describe("template registry", () => {
  it("has one entry per template id, in order, with valid fallbacks and topologies", () => {
    expect(TEMPLATE_REGISTRY.map((t) => t.id)).toEqual([...TEMPLATE_IDS]);
    expect(TEMPLATE_REGISTRY.length).toBeGreaterThanOrEqual(16);
    for (const t of TEMPLATE_REGISTRY) {
      expect(TEMPLATE_IDS).toContain(t.fallback);
      expect(t.topologies.length).toBeGreaterThan(0);
      for (const top of t.topologies) expect(Topology.options).toContain(top);
      expect(t.description.length).toBeGreaterThan(10);
    }
    expect(TEMPLATE_REGISTRY.find((t) => t.id === "composite_layout")?.level).toBe(2);
  });

  it("exports a JSON Schema for every template", () => {
    for (const id of TEMPLATE_IDS) {
      const s = templateJsonSchema(id) as { type?: string; properties?: object };
      expect(s.type).toBe("object");
      expect(s.properties).toBeTruthy();
    }
  });
});

describe("template fixtures", () => {
  it("has a valid fixture for every template and the gallery includes variants and the overflow probe", () => {
    const jobs = galleryJobs();
    const names = jobs.map((j) => j.name);
    for (const id of TEMPLATE_IDS) expect(names).toContain(id);
    expect(jobs.filter((j) => j.expectOverflow).map((j) => j.name)).toEqual(["_overflow"]);
    expect(names.filter((n) => n.startsWith("_variant-")).length).toBeGreaterThanOrEqual(3);
    expect(jobs.filter((j) => !j.name.startsWith("_")).length).toBe(TEMPLATE_IDS.length);
  });

  it("rejects the [object Object] fixture before any browser work", () => {
    expect(() => loadStillFixture(path.join(TEMPLATE_FIXTURE_DIR, "object-object.json"))).toThrow(/\[object Object\]/);
  });

  it("applies a theme override", () => {
    expect(loadStillFixture(path.join(TEMPLATE_FIXTURE_DIR, "roadmap.json"), { theme: "light-classroom" }).theme).toBe("light-classroom");
  });

  it("keeps fixtures free of placeholder text", () => {
    for (const f of fs.readdirSync(TEMPLATE_FIXTURE_DIR).filter((n) => n.endsWith(".json") && n !== "object-object.json")) {
      const raw = fs.readFileSync(path.join(TEMPLATE_FIXTURE_DIR, f), "utf8");
      expect(raw, f).not.toMatch(/lorem|TODO|TBD|\[object Object\]/i);
    }
  });
});
