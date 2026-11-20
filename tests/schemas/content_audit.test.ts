import { describe, it } from "vitest";
import { ContentAudit } from "../../src/schemas";
import { clone, contentAudit } from "./fixtures";
import { expectInvalid, expectValid } from "./helpers";

describe("content_audit schema", () => {
  it("accepts a passing audit", () => expectValid(ContentAudit, contentAudit()));

  it("accepts a failing audit with issues", () => {
    const a = clone(contentAudit()) as { status: string; issues: unknown[] };
    a.status = "FAIL";
    a.issues = [{ severity: "BLOCKER", code: "C-12", message: "KaTeX error", factId: "F02" }];
    expectValid(ContentAudit, a);
  });

  it("rejects an unknown status", () => {
    const a = clone(contentAudit()) as { status: string };
    a.status = "OK";
    expectInvalid(ContentAudit, a, ["status"]);
  });

  it("rejects an unknown severity", () => {
    const a = clone(contentAudit()) as { issues: unknown[] };
    a.issues = [{ severity: "CRITICAL", code: "X", message: "m" }];
    expectInvalid(ContentAudit, a, ["issues", 0, "severity"]);
  });

  it("rejects negative counts", () => {
    const a = clone(contentAudit());
    a.factCount = -1;
    expectInvalid(ContentAudit, a, ["factCount"]);
  });
});
