import fs from "node:fs";
import path from "node:path";
import { readText } from "../core/fsutil";

/** Extract plain text from a book file the user owns. PDF pages are marked with `[p. N]` so citations keep page numbers. */
export async function extractBookText(file: string): Promise<string> {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".txt" || ext === ".md" || ext === ".markdown") return readText(file);
  if (ext === ".docx") {
    const mammoth = await import("mammoth");
    const r = await (mammoth.default ?? mammoth).extractRawText({ path: file });
    return r.value.replace(/\r\n/g, "\n");
  }
  if (ext === ".pdf") return extractPdf(file);
  if (ext === ".epub") return extractEpub(file);
  throw new Error(`unsupported book file type ${ext} (use PDF, EPUB, DOCX, TXT or MD)`);
}

async function extractPdf(file: string): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loading = pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)), useSystemFonts: true });
  const doc = await loading.promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let text = "";
    for (const item of content.items as { str?: string; hasEOL?: boolean }[]) {
      text += (item.str ?? "") + (item.hasEOL ? "\n" : " ");
    }
    pages.push(`[p. ${i}]\n${text.replace(/[ \t]+\n/g, "\n").trim()}`);
  }
  await loading.destroy();
  return pages.join("\n\n");
}

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<h([1-6])[^>]*>/gi, (_m, n: string) => "\n\n" + "#".repeat(Number(n)) + " ")
    .replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractEpub(file: string): Promise<string> {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const container = await zip.file("META-INF/container.xml")?.async("string");
  const opfPath = container?.match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error("EPUB has no container.xml rootfile");
  const opf = (await zip.file(opfPath)?.async("string")) ?? "";
  const base = path.posix.dirname(opfPath);
  const manifest = new Map<string, string>();
  for (const m of opf.matchAll(/<item\b[^>]*>/g)) {
    const id = m[0].match(/\bid="([^"]+)"/)?.[1];
    const href = m[0].match(/\bhref="([^"]+)"/)?.[1];
    if (id && href) manifest.set(id, href);
  }
  const parts: string[] = [];
  for (const m of opf.matchAll(/<itemref\b[^>]*idref="([^"]+)"/g)) {
    const href = manifest.get(m[1]);
    if (!href) continue;
    const f = zip.file(base === "." ? href : `${base}/${href}`);
    if (f) parts.push(htmlToText(await f.async("string")));
  }
  return parts.join("\n\n");
}

/**
 * Split a book into chapters by headings such as "Chapter N", "CHAPTER N: Title", "N. Title" or the exact chapter title.
 * Returns chapter number -> text. Chapters that cannot be located are omitted.
 */
export function splitChapters(text: string, chapters: { number: number; title: string }[]): Map<number, string> {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\p{Script=Devanagari}]+/gu, " ")
      .trim();
  const starts: { number: number; line: number }[] = [];
  for (const ch of chapters) {
    const titleN = norm(ch.title);
    const re = new RegExp(`^\\s*(?:#+\\s*)?(?:chapter|ch\\.?)\\s+${ch.number}\\b|^\\s*(?:#+\\s*)?${ch.number}[.:]\\s+\\S`, "i");
    let idx = lines.findIndex((l, i) => re.test(l) && !starts.some((s) => s.line === i));
    if (idx < 0) idx = lines.findIndex((l) => titleN.length > 6 && norm(l) === titleN);
    if (idx >= 0) starts.push({ number: ch.number, line: idx });
  }
  starts.sort((a, b) => a.line - b.line);
  const out = new Map<number, string>();
  starts.forEach((s, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].line : lines.length;
    out.set(s.number, lines.slice(s.line, end).join("\n").trim());
  });
  return out;
}
