import { z } from "zod";
import { LangCode, Id } from "./common";

export const Persona = z.object({
  name: z.string().min(1),
  voice: z.string().min(1).describe("provider voice id, e.g. en-US-ChristopherNeural"),
});

export const BookConfig = z.object({
  schemaVersion: z.literal(1).default(1),
  id: Id,
  title: z.string().min(1),
  author: z.string().min(1),
  edition: z.string().optional(),
  domain: z.string().min(1).describe("free-text subject domain"),
  domainPresets: z.array(z.string()).default([]),
  rights: z.object({
    confirmed: z.literal(true, { message: "rights must be confirmed to proceed" }),
    statement: z.string().min(1),
    confirmedAt: z.string().min(1),
  }),
  audience: z.enum(["absolute_beginner", "intermediate", "advanced"]).default("absolute_beginner"),
  narrationLanguages: z.array(LangCode).min(1),
  displayLanguage: LangCode.default("en"),
  personas: z.record(z.string(), z.object({ novice: Persona, mentor: Persona })),
  chapters: z.array(z.object({ id: Id, number: z.number().int().positive(), title: z.string().min(1) })).min(1),
  tocSource: z.enum(["pasted", "notebooklm", "local-file", "config"]).default("config"),
  targetMinutes: z.object({ min: z.number().positive(), max: z.number().positive() }).refine((t) => t.max >= t.min, "max >= min"),
  research: z.object({
    mode: z.enum(["notebooklm", "manual", "local-file"]),
    connector: z.string().optional(),
    notebookId: z.string().optional(),
    localFile: z.string().optional(),
  }),
  llm: z.object({ provider: z.string().min(1), model: z.string().optional() }),
  tts: z.object({ provider: z.string().min(1), rate: z.string().default("+0%") }),
  deliverables: z.object({
    orientation: z.boolean().default(true),
    chapters: z.union([z.literal("all"), z.object({ from: z.number().int().positive(), to: z.number().int().positive() })]).default("all"),
    synthesis: z.boolean().default(false),
  }),
  theme: z.string().default("dark-classroom"),
  pronunciation: z.record(z.string(), z.record(z.string(), z.string())).default({}),
  allowedTemplates: z.array(z.string()).optional(),
  boilerplateDenylist: z.array(z.string()).default([]),
});
export type BookConfig = z.infer<typeof BookConfig>;
