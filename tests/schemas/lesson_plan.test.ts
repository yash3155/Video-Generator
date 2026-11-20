import { describe, it } from "vitest";
import { LessonPlan } from "../../src/schemas";
import { clone, lessonPlan } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("lesson_plan schema", () => {
  it("accepts a minimal plan", () => expectValid(LessonPlan, lessonPlan()));

  it("requires two to six outcomes", () => {
    const p = clone(lessonPlan());
    p.outcomes = ["only one"];
    expectInvalid(LessonPlan, p, ["outcomes"]);
  });

  it("requires every progression stage", () => {
    const p = clone(lessonPlan()) as { coreConcepts: { stages: Record<string, unknown> }[] };
    delete p.coreConcepts[0].stages.limitations;
    expectInvalid(LessonPlan, p, ["coreConcepts", 0, "stages", "limitations"]);
  });

  it("requires a misconception grounded in facts", () => {
    const p = clone(lessonPlan());
    p.misconception.factIds = [];
    expectInvalid(LessonPlan, p, ["misconception", "factIds"]);
  });

  it("requires at least three outline scenes", () => {
    const p = clone(lessonPlan());
    p.sceneOutline = p.sceneOutline.slice(0, 2);
    expectInvalid(LessonPlan, p, ["sceneOutline"]);
  });
});
