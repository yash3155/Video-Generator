/* `openlectern start`: the B.2 wizard. Every answer has a default and a flag, so --non-interactive runs work in CI and agents. */
import path from "node:path";
import { exists, readJson, writeJson } from "../core/fsutil";
import { log } from "../core/log";
import { BookConfig } from "../schemas/book";
import { bookConfigFile, exampleDirFor } from "../pipeline/artifacts";
import { defaultVoice } from "../tts/voices";
import { chapterIdFor, runMakeCmd, type MakeCliOptions } from "./make-cmds";

export interface StartCliOptions extends MakeCliOptions {
  title?: string;
  author?: string;
  edition?: string;
  domain?: string;
  audience?: string;
  displayLang?: string;
  chapters?: string;
  minMinutes?: string;
  maxMinutes?: string;
  research?: string;
  sourceFile?: string;
  notebookId?: string;
  orientation?: boolean;
  synthesis?: boolean;
  iOwnThisBook?: boolean;
}

const PERSONA_DEFAULTS: Record<string, { novice: [string, string]; mentor: [string, string] }> = {
  en: { novice: ["Alex", "en-US-AriaNeural"], mentor: ["Dr. Rivera", "en-US-ChristopherNeural"] },
  hi: { novice: ["Raju", "hi-IN-MadhurNeural"], mentor: ["Sharma ji", "hi-IN-SwaraNeural"] },
};

export function defaultPersonas(lang: string): BookConfig["personas"][string] {
  const d = PERSONA_DEFAULTS[lang] ?? PERSONA_DEFAULTS[lang.split("-")[0]];
  if (d) return { novice: { name: d.novice[0], voice: d.novice[1] }, mentor: { name: d.mentor[0], voice: d.mentor[1] } };
  const v = defaultVoice("edge", lang);
  return { novice: { name: "Sam", voice: v }, mentor: { name: "Professor", voice: v } };
}

/** The default LLM provider (B.2 step 8): agent hand-off inside an agent or without keys, else the first key in .env. */
export function defaultLlm(env: NodeJS.ProcessEnv = process.env, tty = Boolean(process.stdout.isTTY)): string {
  if (!tty) return "agent-handoff";
  if (env.OPENAI_API_KEY || env.OPENAI_BASE_URL) return "openai-compatible";
  if (env.ANTHROPIC_API_KEY) return "anthropic";
  if (env.GEMINI_API_KEY || env.GOOGLE_API_KEY) return "gemini";
  return "agent-handoff";
}

export function slugify(s: string): string {
  const v = s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return v || "book";
}

/** Parses a pasted table of contents: one chapter per line ("1. Title", "Chapter N: Title", "3 Title" or just "Title"). */
export function parseToc(text: string): BookConfig["chapters"] {
  const out: BookConfig["chapters"] = [];
  for (const raw of text.split(/\r?\n|;/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = /^(?:chapter\s+)?(\d+)\s*[.:)\-–]?\s*(.+)$/i.exec(line);
    const number = m ? Number(m[1]) : out.length + 1;
    const title = (m ? m[2] : line).trim();
    if (!title || number < 1) continue;
    out.push({ id: chapterIdFor(number), number, title });
  }
  return out;
}

/** Builds (or edits) a book config from flags, using an existing config's values as defaults. */
export function configFromFlags(o: StartCliOptions, prev?: BookConfig): BookConfig {
  const langs = o.lang
    ? o.lang
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : (prev?.narrationLanguages ?? ["en"]);
  const chapters = o.chapters ? parseToc(o.chapters) : (prev?.chapters ?? []);
  const title = o.title ?? prev?.title;
  const research = (o.research ?? prev?.research.mode ?? (o.sourceFile ? "local-file" : "manual")) as BookConfig["research"]["mode"];
  const raw = {
    schemaVersion: 1,
    id: o.book ?? prev?.id ?? slugify(title ?? ""),
    title,
    author: o.author ?? prev?.author,
    edition: o.edition ?? prev?.edition,
    domain: o.domain ?? prev?.domain ?? "general",
    domainPresets: prev?.domainPresets ?? [],
    rights:
      prev?.rights ??
      (o.iOwnThisBook
        ? {
            confirmed: true,
            statement: "The user confirmed they own or have the right to use this book for personal or educational transformation.",
            confirmedAt: new Date().toISOString(),
          }
        : undefined),
    audience: o.audience ?? prev?.audience ?? "absolute_beginner",
    narrationLanguages: langs,
    displayLanguage: o.displayLang ?? prev?.displayLanguage ?? "en",
    personas: Object.fromEntries(langs.map((l) => [l, prev?.personas[l] ?? defaultPersonas(l)])),
    chapters,
    tocSource: o.chapters ? "pasted" : (prev?.tocSource ?? "config"),
    targetMinutes: { min: Number(o.minMinutes ?? prev?.targetMinutes.min ?? 10), max: Number(o.maxMinutes ?? prev?.targetMinutes.max ?? 14) },
    research: {
      ...(prev?.research ?? {}),
      mode: research,
      ...(o.sourceFile ? { localFile: path.resolve(o.sourceFile) } : {}),
      ...(o.notebookId ? { notebookId: o.notebookId } : {}),
    },
    llm: { provider: o.llm ?? prev?.llm.provider ?? defaultLlm(), ...(o.model ? { model: o.model } : prev?.llm.model ? { model: prev.llm.model } : {}) },
    tts: { provider: o.tts ?? prev?.tts.provider ?? "edge", rate: prev?.tts.rate ?? "+0%" },
    deliverables: {
      orientation: o.orientation ?? prev?.deliverables.orientation ?? true,
      chapters: prev?.deliverables.chapters ?? "all",
      synthesis: o.synthesis ?? prev?.deliverables.synthesis ?? false,
    },
    theme: prev?.theme ?? "dark-classroom",
    pronunciation: prev?.pronunciation ?? {},
    allowedTemplates: prev?.allowedTemplates,
    boilerplateDenylist: prev?.boilerplateDenylist ?? [],
  };
  const r = BookConfig.safeParse(raw);
  if (!r.success)
    throw new Error(
      `book config is incomplete:\n${r.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n")}\nPass the missing values as flags (see \`openlectern start --help\`) or run the wizard interactively.`,
    );
  return r.data;
}

function loadPrev(bookId: string | undefined): BookConfig | undefined {
  if (!bookId) return undefined;
  const f = bookConfigFile(bookId);
  const src = exists(f) ? f : exampleDirFor(bookId) ? path.join(exampleDirFor(bookId)!, "book.config.json") : undefined;
  if (!src) return undefined;
  const r = BookConfig.safeParse(readJson(src));
  return r.success ? r.data : undefined;
}

const hasConfigFlags = (o: StartCliOptions) => Boolean(o.title || o.author || o.chapters || o.domain || o.sourceFile || o.research || o.iOwnThisBook);

export async function runStart(o: StartCliOptions): Promise<number> {
  if (o.nonInteractive || !process.stdin.isTTY) {
    const prev = loadPrev(o.book);
    if (!prev || hasConfigFlags(o)) {
      const cfg = configFromFlags(o, prev);
      writeJson(bookConfigFile(cfg.id), cfg);
      log.ok(`saved ${bookConfigFile(cfg.id)}`);
      o.book = cfg.id;
    }
    if (!o.chapter && !o.all) {
      log.info(`next: openlectern make --book ${o.book} --chapter <id> (or --all)`);
      return 0;
    }
    return runMakeCmd(o);
  }
  return runWizard(o);
}

async function runWizard(o: StartCliOptions): Promise<number> {
  const p = await import("@clack/prompts");
  const stop = (v: unknown): v is symbol => {
    if (p.isCancel(v)) {
      p.cancel("Cancelled. Nothing was changed.");
      return true;
    }
    return false;
  };
  p.intro("OpenLectern: turn a book you own into narrated lesson videos");
  const bookId =
    o.book ??
    ((await p.text({
      message: "Book id (folder name; re-use an id to edit that book)",
      placeholder: "my-book",
      validate: (v) => (v && /^[a-z0-9][a-z0-9_-]*$/i.test(v) ? undefined : "letters, digits, - and _ only"),
    })) as string);
  if (stop(bookId)) return 1;
  const prev = loadPrev(bookId);
  if (prev) p.note(`Editing "${prev.title}". Press Enter to keep each current answer.`);
  const ask = async (message: string, initialValue?: string, required = true) => {
    const v = await p.text({ message, initialValue: initialValue ?? "", validate: (x) => (required && !x?.trim() ? "required" : undefined) });
    return stop(v) ? null : (v as string).trim();
  };
  const title = await ask("Book title", o.title ?? prev?.title);
  if (title === null) return 1;
  const author = await ask("Author", o.author ?? prev?.author);
  if (author === null) return 1;
  const edition = await ask("Edition (optional)", o.edition ?? prev?.edition, false);
  if (edition === null) return 1;
  const domain = await ask("Subject domain (free text)", o.domain ?? prev?.domain ?? "general");
  if (domain === null) return 1;
  if (!prev?.rights.confirmed) {
    const own = await p.confirm({ message: "Do you own or have the right to use this book for personal/educational transformation?", initialValue: false });
    if (stop(own)) return 1;
    if (!own) {
      p.cancel("OpenLectern only works on books you own or have the right to use. Nothing was saved.");
      return 1;
    }
  }
  const audience = await p.select({
    message: "Target audience",
    initialValue: prev?.audience ?? "absolute_beginner",
    options: [
      { value: "absolute_beginner", label: "Absolute beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  });
  if (stop(audience)) return 1;
  const langs = await ask(
    "Narration language(s), comma-separated (en, hi = Hinglish in Devanagari, or any Edge/Piper locale)",
    o.lang ?? prev?.narrationLanguages.join(",") ?? "en",
  );
  if (langs === null) return 1;
  const displayLang = await ask("On-screen text language", o.displayLang ?? prev?.displayLanguage ?? "en");
  if (displayLang === null) return 1;
  const langList = langs
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const personas: BookConfig["personas"] = {};
  for (const l of langList) {
    const d = prev?.personas[l] ?? defaultPersonas(l);
    const novice = await ask(`[${l}] novice name`, d.novice.name);
    if (novice === null) return 1;
    const mentor = await ask(`[${l}] mentor name`, d.mentor.name);
    if (mentor === null) return 1;
    personas[l] = { novice: { ...d.novice, name: novice }, mentor: { ...d.mentor, name: mentor } };
  }
  const tocDefault = prev?.chapters.map((c) => `${c.number}. ${c.title}`).join("; ") ?? "";
  const toc = await ask(
    "Chapter list: paste the table of contents, one chapter per line or separated by ';' (e.g. 1. Title; 2. Title)",
    o.chapters ?? tocDefault,
  );
  if (toc === null) return 1;
  const minM = await ask("Minimum minutes per video part", String(prev?.targetMinutes.min ?? 10));
  if (minM === null) return 1;
  const maxM = await ask("Maximum minutes per video part", String(prev?.targetMinutes.max ?? 14));
  if (maxM === null) return 1;
  const inNlm = await p.select({
    message: "Is this book already uploaded to a Google NotebookLM notebook?",
    initialValue: prev?.research.mode ?? "manual",
    options: [
      { value: "notebooklm", label: "Yes: use the NotebookLM connector (nlm CLI or MCP)" },
      { value: "manual", label: "No: generate a prompt I paste into NotebookLM myself" },
      { value: "local-file", label: "No: extract from a local PDF/EPUB/TXT/DOCX I own (offline)" },
    ],
  });
  if (stop(inNlm)) return 1;
  let sourceFile = o.sourceFile ?? prev?.research.localFile;
  if (inNlm === "local-file" && prev?.research.connector !== "demo") {
    const f = await ask("Path to the book file", sourceFile);
    if (f === null) return 1;
    sourceFile = f;
  }
  const llm = await p.select({
    message: "LLM provider",
    initialValue: o.llm ?? prev?.llm.provider ?? defaultLlm(),
    options: [
      { value: "agent-handoff", label: "Agent hand-off (no keys: your coding agent answers the tasks)" },
      { value: "openai-compatible", label: "OpenAI-compatible API (OPENAI_API_KEY / OPENAI_BASE_URL)" },
      { value: "anthropic", label: "Anthropic (ANTHROPIC_API_KEY)" },
      { value: "gemini", label: "Gemini (GEMINI_API_KEY)" },
      { value: "ollama", label: "Ollama (local)" },
    ],
  });
  if (stop(llm)) return 1;
  const tts = await p.select({
    message: "Voice (TTS) provider",
    initialValue: o.tts ?? prev?.tts.provider ?? "edge",
    options: [
      { value: "edge", label: "Edge TTS (free, online; Piper fallback offline)" },
      { value: "piper", label: "Piper (free, offline)" },
      { value: "openai", label: "OpenAI TTS (paid)" },
      { value: "elevenlabs", label: "ElevenLabs (paid)" },
      { value: "google", label: "Google Cloud TTS (paid)" },
    ],
  });
  if (stop(tts)) return 1;
  const deliver = await p.multiselect({
    message: "Deliverables",
    initialValues: [...((prev?.deliverables.orientation ?? true) ? ["orientation"] : []), "chapters", ...(prev?.deliverables.synthesis ? ["synthesis"] : [])],
    options: [
      { value: "orientation", label: "Orientation video" },
      { value: "chapters", label: "Chapter videos" },
      { value: "synthesis", label: "Synthesis video" },
    ],
  });
  if (stop(deliver)) return 1;
  const flags: StartCliOptions = {
    ...o,
    book: bookId,
    title,
    author,
    edition: edition || undefined,
    domain,
    audience: audience as string,
    lang: langList.join(","),
    displayLang,
    chapters: toc === tocDefault && prev ? undefined : toc,
    minMinutes: minM,
    maxMinutes: maxM,
    research: inNlm as string,
    sourceFile,
    llm: llm as string,
    tts: tts as string,
    orientation: (deliver as string[]).includes("orientation"),
    synthesis: (deliver as string[]).includes("synthesis"),
    iOwnThisBook: true,
  };
  const cfg = configFromFlags(flags, prev);
  cfg.personas = { ...cfg.personas, ...personas };
  writeJson(bookConfigFile(cfg.id), BookConfig.parse(cfg));
  p.note(bookConfigFile(cfg.id), "Saved");
  const go = await p.confirm({ message: "Build the course now (all selected parts)?", initialValue: true });
  if (stop(go) || !go) {
    p.outro(`Later: openlectern make --book ${cfg.id} --all  (or --chapter ${cfg.chapters[0]?.id ?? chapterIdFor(1)})`);
    return 0;
  }
  p.outro("Building. Finished stages are cached, so you can stop and re-run at any time.");
  return runMakeCmd({ ...o, book: cfg.id, all: !o.chapter, llm: undefined, tts: undefined });
}
