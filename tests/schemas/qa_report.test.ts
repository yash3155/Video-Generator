import { describe, it } from "vitest";
import { QaReport, QaReview } from "../../src/schemas";
import { clone, qaReport } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

const review = () => ({
  lang: "en",
  scores: { accuracy: 5, clarity: 4, vividness: 4, sync: 5, visual_quality: 4, freshness: 4 },
  findings: [],
  summary: "Clear and correct.",
});

describe("qa_report schema", () => {
  it("accepts a minimal report", () => expectValid(QaReport, qaReport()));

  it("rejects an unknown severity", () => {
    const r = clone(qaReport()) as { findings: { severity: string }[] };
    r.findings[0].severity = "FATAL";
    expectInvalid(QaReport, r, ["findings", 0, "severity"]);
  });

  it("rejects an unknown check status", () => {
    const r = clone(qaReport()) as { checks: { status: string }[] };
    r.checks[0].status = "warn";
    expectInvalid(QaReport, r, ["checks", 0, "status"]);
  });

  it("requires a repair hint on every finding", () => {
    const r = clone(qaReport()) as { findings: Record<string, unknown>[] };
    delete r.findings[0].repair;
    expectInvalid(QaReport, r, ["findings", 0, "repair"]);
  });

  it("requires the release block", () => {
    const r = clone(qaReport()) as Record<string, unknown>;
    delete r.release;
    expectInvalid(QaReport, r, ["release"]);
  });

  it("accepts an expert review and rejects scores outside 1 to 5", () => {
    expectValid(QaReview, review());
    const bad = review();
    bad.scores.clarity = 6;
    expectInvalid(QaReview, bad, ["scores", "clarity"]);
  });
});
