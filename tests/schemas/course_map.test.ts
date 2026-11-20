import { describe, it } from "vitest";
import { CourseMap } from "../../src/schemas";
import { clone, courseMap } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("course_map schema", () => {
  it("accepts a minimal course map", () => expectValid(CourseMap, courseMap()));

  it("requires at least one part per chapter", () => {
    const m = clone(courseMap());
    m.chapters[0].parts = [];
    expectInvalid(CourseMap, m, ["chapters", 0, "parts"]);
  });

  it("rejects an unknown part kind", () => {
    const m = clone(courseMap()) as { chapters: { kind: string }[] };
    m.chapters[0].kind = "appendix";
    expectInvalid(CourseMap, m, ["chapters", 0, "kind"]);
  });

  it("rejects ids with spaces", () => {
    const m = clone(courseMap());
    m.chapters[0].id = "chapter one";
    expectInvalid(CourseMap, m, ["chapters", 0, "id"]);
  });

  it("rejects non-positive part estimates", () => {
    const m = clone(courseMap());
    m.chapters[0].parts[0].estimatedMinutes = 0;
    expectInvalid(CourseMap, m, ["chapters", 0, "parts", 0, "estimatedMinutes"]);
  });
});
