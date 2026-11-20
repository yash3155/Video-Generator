import path from "node:path";
import { exists, readText, writeText } from "../core/fsutil";
import { promptsDir, researchDir } from "../core/paths";
import { RESEARCH_TEMPLATE_MARKER } from "../schemas/research";
import type { BookConfig } from "../schemas/book";

export interface ExtractionVars {
  bookTitle: string;
  author: string;
  edition: string;
  chapterNumber: number;
  chapterTitle: string;
  partId: string;
  partScope: string;
  nextPartScope: string;
}

/** Fill the Chapter Extraction Prompt (prompts/research/chapter_extraction.md); the variables comment is dropped. */
export function renderExtractionPrompt(vars: ExtractionVars): string {
  const raw = readText(path.join(promptsDir(), "research", "chapter_extraction.md")).replace(/<!--[\s\S]*?-->\n?/g, "");
  return raw.replace(/\{\{\s*([a-zA-Z]+)\s*\}\}/g, (_m, k: string) => {
    if (!(k in vars)) throw new Error(`extraction prompt variable ${k} missing`);
    return String((vars as unknown as Record<string, string | number>)[k]);
  });
}

export function extractionVars(cfg: BookConfig, chapterId: string, partId: string, partScope: string, nextPartScope: string): ExtractionVars {
  const ch = cfg.chapters.find((c) => c.id === chapterId);
  if (!ch) throw new Error(`chapter ${chapterId} not in book config`);
  return {
    bookTitle: cfg.title,
    author: cfg.author,
    edition: cfg.edition || "current",
    chapterNumber: ch.number,
    chapterTitle: ch.title,
    partId,
    partScope,
    nextPartScope,
  };
}

/**
 * Manual research flow (B.4): write PASTE_INTO_NOTEBOOKLM.md with the filled prompt and instructions, and an empty
 * notebook_context.md template (header already filled) so the user only pastes. Returns the two paths.
 */
export function prepareManualResearch(cfg: BookConfig, chapterId: string, partId: string, partScope: string, nextPartScope: string): { pasteFile: string; dropFile: string; created: boolean } {
  const dir = researchDir(cfg.id, chapterId, partId);
  const pasteFile = path.join(dir, "PASTE_INTO_NOTEBOOKLM.md");
  const dropFile = path.join(dir, "notebook_context.md");
  const prompt = renderExtractionPrompt(extractionVars(cfg, chapterId, partId, partScope, nextPartScope));
  writeText(
    pasteFile,
    [
      `# Research for ${cfg.title}, ${chapterId} ${partId}`,
      "",
      "1. Open https://notebooklm.google.com and create a notebook (or open the one for this book).",
      "2. Upload the PDF or EPUB of the book that you own.",
      "3. Copy everything between the two lines below and paste it into the NotebookLM chat.",
      `4. Copy NotebookLM's full answer and paste it into \`${dropFile}\` below the header comment, replacing the ${RESEARCH_TEMPLATE_MARKER} line.`,
      "5. Run `npm start -- --resume` (or `openlectern watch`). OpenLectern checks the file and continues.",
      "",
      "----- copy from here -----",
      "",
      prompt.trim(),
      "",
      "----- copy to here -----",
      "",
    ].join("\n"),
  );
  let created = false;
  if (!exists(dropFile)) {
    const header = {
      bookId: cfg.id,
      chapterId,
      partId,
      connector: "manual",
      sourceIds: [],
      query: "Chapter Extraction Prompt v1",
      timestamp: new Date().toISOString(),
      sha256: "0".repeat(64),
    };
    writeText(dropFile, `<!-- OPENLECTERN-RESEARCH ${JSON.stringify(header)} -->\n\n${RESEARCH_TEMPLATE_MARKER}: paste the NotebookLM answer here, replacing this line.\n`);
    created = true;
  }
  return { pasteFile, dropFile, created };
}
