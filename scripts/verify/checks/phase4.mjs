import { check, exists, run, tail, readText, listFiles } from "../lib.mjs";

const MATH_FIXTURES = [
  "swallowed-t.json",
  "swallowed-f.json",
  "swallowed-b.json",
  "swallowed-r.json",
  "swallowed-n.json",
  "parse-u.txt",
  "parse-v.txt",
  "slash-text.json",
  "doubled-backslash.json",
  "unbalanced-braces.json",
  "six-way-mismatch.json",
];
const PEDAGOGY_FIXTURES = ["unexplained-acronym.json", "long-sentence.json"];

export const checks = [
  check("fixtures", "math and pedagogy failure fixtures exist", () => {
    const miss = [
      ...MATH_FIXTURES.map((f) => `tests/fixtures/math/${f}`),
      ...PEDAGOGY_FIXTURES.map((f) => `tests/fixtures/pedagogy/${f}`),
    ].filter((f) => !exists(f));
    return { ok: miss.length === 0, detail: miss.length ? "missing " + miss.join(",") : "all present" };
  }),
  check("fixtures-referenced", "every fixture is referenced by a test", () => {
    const tests = [...listFiles("tests/math", (p) => p.endsWith(".ts")), ...listFiles("tests/pedagogy", (p) => p.endsWith(".ts"))]
      .map((f) => readText(f))
      .join("\n");
    const miss = [...MATH_FIXTURES, ...PEDAGOGY_FIXTURES].filter((f) => !tests.includes(f));
    return { ok: miss.length === 0, detail: miss.length ? "unreferenced " + miss.join(",") : "all referenced" };
  }),
  check("tests", "math and pedagogy tests pass", () => {
    const r = run("npx", ["vitest", "run", "tests/math", "tests/pedagogy", "--reporter=dot"], { timeout: 15 * 60 * 1000 });
    return { ok: r.code === 0, detail: r.code === 0 ? "exit 0" : tail(r.out, 15) };
  }),
];
