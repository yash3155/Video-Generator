/* Minimal valid artifacts used by the schema tests. Each test clones one and breaks it in a specific way. */
import fs from "node:fs";
import path from "node:path";

export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export const demoConfig = () => JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "examples", "demo-book", "book.config.json"), "utf8"));

export const researchContext = () => ({
  header: {
    bookId: "demo",
    chapterId: "ch01",
    partId: "p1",
    connector: "manual",
    sourceIds: [],
    query: "Chapter Extraction Prompt v1",
    timestamp: "2026-01-01T00:00:00Z",
    sha256: "a".repeat(64),
  },
  body: "## Chapter scope\n...",
});

export const courseMap = () => ({
  bookId: "demo",
  courseTitle: "Money That Grows",
  modules: [{ id: "m1", title: "Growth", chapterIds: ["ch01"] }],
  chapters: [
    {
      id: "ch01",
      number: 1,
      title: "Simple and Compound Interest",
      moduleId: "m1",
      summary: "Interest, simple and compound growth.",
      kind: "chapter_part",
      parts: [{ id: "p1", title: "Interest that earns interest", sections: ["1.1", "1.2"], estimatedMinutes: 10 }],
      prerequisites: [],
    },
  ],
});

export const courseGlossary = () => ({
  bookId: "demo",
  concepts: [{ term: "principal", definition: "the starting amount", introducedIn: { chapterId: "ch01", partId: "p1" }, aliases: [] }],
  analogies: [],
});

export const fact = (id = "F01") => ({
  id,
  category: "definition",
  statement: "Interest is the price paid for using someone else's money.",
  citation: { chapter: "1", section: "1.1", page: "1" },
});

export const sourceFacts = () => ({
  bookId: "demo",
  chapterId: "ch01",
  partId: "p1",
  facts: [
    fact("F01"),
    {
      id: "F02",
      category: "formula",
      statement: "Compound interest with yearly compounding: A = P(1 + r)^t.",
      citation: { chapter: "1", section: "1.3", page: "3" },
      formula: {
        latex: "A = P(1 + r)^{t}",
        expression: "P * (1 + r)^t",
        solvesFor: "A",
        variables: [
          { symbol: "A", meaning: "balance after t years", unit: "dollars" },
          { symbol: "P", meaning: "principal", unit: "dollars" },
          { symbol: "r", meaning: "annual rate as a decimal", unit: "per year" },
          { symbol: "t", meaning: "time", unit: "years" },
        ],
      },
    },
  ],
  realWorldProblem: { actors: "Franklin", situation: "a bequest", failure: "idle money", invention: "compound interest", factIds: ["F02"] },
  terms: [{ term: "principal", definition: "starting amount" }],
  dependencies: { earlier: [], later: ["ch02"] },
  quotes: [],
});

export const contentAudit = () => ({
  status: "PASS",
  factCount: 2,
  categories: { definition: 1, formula: 1 },
  formulasCompiled: 1,
  numbersRecomputed: 0,
  issues: [],
});

export const conceptRegister = () => ({
  concepts: [
    {
      id: "K01",
      term: "principal",
      kind: "term",
      plainMeaning: "the money you start with",
      roleHere: "the starting deposit",
      depth: "L2",
      familiarity: "new",
      aliases: [],
      factIds: ["F01"],
    },
  ],
});

const stage = (i: number) => ({ sceneIndex: i, note: "covered" });
export const lessonPlan = () => ({
  outcomes: ["Compute simple interest", "Compute a compound balance"],
  coreConcepts: [
    {
      conceptId: "K01",
      term: "compound interest",
      stages: { intuition: stage(0), why: stage(1), what: stage(3), how: stage(4), workedExample: stage(5), guided: stage(7), independent: stage(9), limitations: stage(8) },
    },
  ],
  misconception: { myth: "interest times years is compound", reality: "that is simple interest", factIds: ["F01"], sceneIndex: 10 },
  predictionQuestions: [{ question: "Will the gap grow?", sceneIndex: 6 }],
  causalChain: { condition: "a", action: "b", mechanism: "c", result: "d", consequence: "e", factIds: ["F02"], sceneIndex: 4 },
  sceneOutline: [0, 1, 2].map((i) => ({ index: i, purpose: "p", concepts: ["K01"], factIds: ["F01"] })),
});

const scriptBeat = (id: string) => ({
  id,
  speaker: "mentor",
  narration: { en: { display: "Interest is the price of using money.", spoken: "Interest is the price of using money." } },
  onScreenIntent: "show the definition",
  sourceFactIds: ["F01"],
  newTerms: [],
});
export const teachingScript = () => ({
  languages: ["en"],
  scenes: [0, 1, 2].map((i) => ({ index: i, title: `Scene ${i}`, purpose: "teach", beats: [scriptBeat(`s0${i}b1`)] })),
});

export const visualBrief = () => ({
  scenes: [0, 1, 2].map((i) => ({ index: i, topology: "definition", visualIntent: "show it", keyElements: ["term"], factIds: ["F01"] })),
});

export const storyboard = () => ({
  scenes: ["chat_story", "tug_of_war", "progressive_cards"].map((t, i) => ({ index: i, template: t, justification: "fits", beats: [{ id: `s0${i}b1`, visualIntent: "x" }] })),
});

const epBeat = (id: string) => ({ ...scriptBeat(id), pauseAfterMs: 260, visual: { show: ["m1"] }, visualCues: [{ target: "m1", anchor: { en: "price" } }] });
export const episode = () => ({
  schemaVersion: 1,
  bookId: "demo",
  chapterId: "ch01",
  partId: "p1",
  kind: "chapter_part",
  courseTitle: "Money That Grows",
  chapterLabel: "Chapter 1",
  partLabel: "Part 1",
  title: "Interest that earns interest",
  displayLanguage: "en",
  languages: ["en"],
  personas: { en: { novice: { name: "Alex", voice: "en-US-AriaNeural" }, mentor: { name: "Dr. Rivera", voice: "en-US-ChristopherNeural" } } },
  progress: { index: 1, total: 4 },
  theme: "dark-classroom",
  provenance: { mock: false },
  scenes: [
    {
      id: "s00",
      index: 0,
      title: "Why money has a price",
      purpose: "hook",
      takeaways: ["Interest is a price"],
      template: "chat_story",
      data: { messages: [{ id: "m1", speaker: "novice", text: "Why does the bank pay me?" }] },
      beats: [epBeat("s00b1")],
    },
  ],
});

export const episodeCompiled = () => ({
  fps: 30,
  width: 1920,
  height: 1080,
  episodeHash: "abc",
  episode: episode(),
  timelines: {
    en: {
      lang: "en",
      durationInFrames: 90,
      ttsProvider: "mock",
      scenes: [{ sceneId: "s00", startFrame: 0, durationInFrames: 90 }],
      beats: [
        {
          beatId: "s00b1",
          sceneId: "s00",
          startFrame: 0,
          durationInFrames: 90,
          audio: { file: "audio/en/s00b1.wav", durationMs: 2700, textHash: "h", provider: "mock", voice: "v", mock: true },
          pauseAfterMs: 260,
          timingSource: "boundary",
          words: [{ text: "Interest", startMs: 0, endMs: 400 }],
          captions: [{ startMs: 0, endMs: 400, words: [{ text: "Interest", startMs: 0, endMs: 400 }] }],
          cues: [{ target: "m1", anchor: "price", atMs: 1200, frame: 36 }],
        },
      ],
    },
  },
});

export const qaReport = () => ({
  bookId: "demo",
  chapterId: "ch01",
  partId: "p1",
  languages: ["en"],
  generatedAt: "2026-01-01T00:00:00Z",
  release: { releasable: false, draft: true, mock: true, reason: "mock" },
  summary: { BLOCKER: 1, HIGH: 0, MEDIUM: 0, LOW: 0 },
  checks: [{ id: "Q-MOCK", title: "mock provenance", layer: "Q", status: "fail" }],
  findings: [{ id: "Q-MOCK", severity: "BLOCKER", layer: "Q", message: "mock", cause: "mock provider", repair: "use a real provider" }],
});
