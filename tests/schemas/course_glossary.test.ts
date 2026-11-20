import { describe, it } from "vitest";
import { CourseGlossary } from "../../src/schemas";
import { clone, courseGlossary } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("course_glossary schema", () => {
  it("accepts a minimal glossary", () => expectValid(CourseGlossary, courseGlossary()));

  it("accepts an empty glossary", () => expectValid(CourseGlossary, { bookId: "demo", concepts: [] }));

  it("requires where a concept was introduced", () => {
    const g = clone(courseGlossary()) as { concepts: Record<string, unknown>[] };
    delete g.concepts[0].introducedIn;
    expectInvalid(CourseGlossary, g, ["concepts", 0, "introducedIn"]);
  });

  it("rejects an empty definition", () => {
    const g = clone(courseGlossary());
    g.concepts[0].definition = "";
    expectInvalid(CourseGlossary, g, ["concepts", 0, "definition"]);
  });
});
