import path from "node:path";
import { check, exists, readText, run, cli, tail, listFiles, parseJsonLoose, rel } from "../lib.mjs";

export const ARTIFACTS = [
  "book_config",
  "research_context",
  "course_map",
  "course_glossary",
  "source_facts",
  "content_audit",
  "concept_register",
  "lesson_plan",
  "teaching_script",
  "visual_brief",
  "storyboard",
  "episode",
  "episode_compiled",
  "qa_report",
];

const STANDARDS = [
  "SOURCE_GROUNDING",
  "LEARNING_PROGRESSION",
  "NARRATION_CRAFT",
  "JIT_CONCEPT_CLARIFICATION",
  "SCENE_STRUCTURE",
  "ASSESSMENT",
  "ORIENTATION_AND_SYNTHESIS",
  "VISUAL_DESIGN",
  "FORMULA_RULES",
  "QA_SEVERITY",
];

export const checks = [
  check("schema-tests-exist", "a schema test file exists for every Part C artifact", () => {
    const miss = ARTIFACTS.filter((a) => !exists(`tests/schemas/${a}.test.ts`));
    return { ok: miss.length === 0, detail: miss.length ? "missing tests for " + miss.join(",") : `${ARTIFACTS.length} test files` };
  }),
  check("schema-tests-pass", "schema tests pass", () => {
    const r = run("npx", ["vitest", "run", "tests/schemas", "--reporter=dot"], { timeout: 15 * 60 * 1000 });
    return { ok: r.code === 0, detail: r.code === 0 ? "exit 0" : tail(r.out, 15) };
  }),
  check("json-schemas", "JSON Schemas exported to schemas/json/ for every artifact", () => {
    const r = run("npm", ["run", "schemas:export"], { timeout: 5 * 60 * 1000 });
    if (r.code !== 0) return { ok: false, detail: tail(r.out, 8) };
    const miss = ARTIFACTS.filter((a) => !exists(`schemas/json/${a}.schema.json`));
    for (const a of ARTIFACTS.filter((x) => !miss.includes(x))) {
      try {
        const j = JSON.parse(readText(`schemas/json/${a}.schema.json`));
        if (!j || typeof j !== "object" || (!j.type && !j.$ref && !j.anyOf && !j.properties && !j.$defs)) miss.push(a + "(empty)");
      } catch {
        miss.push(a + "(invalid)");
      }
    }
    return { ok: miss.length === 0, detail: miss.length ? "missing/invalid " + miss.join(",") : "all exported" };
  }),
  check("standards", "docs/standards/* present and substantive (> 1500 chars)", () => {
    const bad = STANDARDS.filter((s) => !exists(`docs/standards/${s}.md`) || readText(`docs/standards/${s}.md`).length <= 1500);
    return { ok: bad.length === 0, detail: bad.length ? "missing/short " + bad.join(",") : `${STANDARDS.length} standards` };
  }),
  check("demo-license", "examples/demo-book has a CC BY 4.0 LICENSE", () => {
    if (!exists("examples/demo-book/LICENSE")) return { ok: false, detail: "missing" };
    const t = readText("examples/demo-book/LICENSE");
    return { ok: /Creative Commons Attribution 4\.0|CC BY 4\.0/i.test(t), detail: "present" };
  }),
  check("demo-chapters", "demo book has >= 3 chapters", () => {
    const files = listFiles("examples/demo-book/book", (p) => /ch\d+[^\\/]*\.md$/i.test(p));
    return { ok: files.length >= 3, detail: `${files.length} chapter files` };
  }),
  check("demo-research-gate", "demo research files pass the S1 gate", () => {
    const files = listFiles("examples/demo-book/research", (p) => p.endsWith("notebook_context.md"));
    if (files.length < 3) return { ok: false, detail: `${files.length} research files (need one per chapter part, >= 3)` };
    const r = cli(["research:gate", "--json", ...files.map((f) => path.relative(rel(), f))], { timeout: 5 * 60 * 1000 });
    try {
      const j = parseJsonLoose(r.stdout);
      const failed = (j.results || []).filter((x) => !x.ok);
      return { ok: r.code === 0 && failed.length === 0 && (j.results || []).length === files.length, detail: failed.length ? JSON.stringify(failed).slice(0, 300) : `${files.length} files pass` };
    } catch {
      return { ok: false, detail: tail(r.out, 8) };
    }
  }),
];
