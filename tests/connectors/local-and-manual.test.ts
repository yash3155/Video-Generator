import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import JSZip from "jszip";
import { extractBookText, htmlToText, splitChapters } from "../../src/research/local-file";
import { prepareManualResearch, renderExtractionPrompt } from "../../src/research/manual";
import { gateResearch } from "../../src/research/gate";
import { BookConfig } from "../../src/schemas/book";

const DEMO = path.join(__dirname, "..", "..", "examples", "demo-book");
let dir: string;
let savedHome: string | undefined;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "ol-conn-"));
  savedHome = process.env.OPENLECTERN_HOME;
  process.env.OPENLECTERN_HOME = dir;
});
afterEach(() => {
  if (savedHome === undefined) delete process.env.OPENLECTERN_HOME;
  else process.env.OPENLECTERN_HOME = savedHome;
  fs.rmSync(dir, { recursive: true, force: true });
});

const demoConfig = () => BookConfig.parse(JSON.parse(fs.readFileSync(path.join(DEMO, "book.config.json"), "utf8")));

function minimalPdf(lines: string[]): Buffer {
  const content = `BT /F1 14 Tf 72 720 Td 18 TL ${lines.map((l) => `(${l.replace(/[()\\]/g, "\\$&")}) Tj T*`).join(" ")} ET`;
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

describe("local-file connector", () => {
  it("reads Markdown and splits the demo book into chapters", async () => {
    const files = fs.readdirSync(path.join(DEMO, "book")).sort();
    const all = files.map((f) => fs.readFileSync(path.join(DEMO, "book", f), "utf8")).join("\n\n");
    const book = path.join(dir, "book.md");
    fs.writeFileSync(book, all);
    const text = await extractBookText(book);
    const cfg = demoConfig();
    const parts = splitChapters(text, cfg.chapters);
    expect([...parts.keys()]).toEqual([1, 2, 3]);
    expect(parts.get(2)!.startsWith("# Chapter 2")).toBe(true);
    expect(parts.get(1)).not.toContain("# Chapter 2");
  });

  it("extracts EPUB text in spine order", async () => {
    const zip = new JSZip();
    zip.file("META-INF/container.xml", '<container><rootfiles><rootfile full-path="OEBPS/content.opf"/></rootfiles></container>');
    zip.file(
      "OEBPS/content.opf",
      '<package><manifest><item id="c2" href="c2.xhtml"/><item id="c1" href="c1.xhtml"/></manifest><spine><itemref idref="c1"/><itemref idref="c2"/></spine></package>',
    );
    zip.file("OEBPS/c1.xhtml", "<html><body><h1>Chapter 1: Start</h1><p>Interest &amp; principal.</p></body></html>");
    zip.file("OEBPS/c2.xhtml", "<html><body><h1>Chapter 2: Next</h1><p>APR.</p></body></html>");
    const f = path.join(dir, "b.epub");
    fs.writeFileSync(f, await zip.generateAsync({ type: "nodebuffer" }));
    const text = await extractBookText(f);
    expect(text.indexOf("Chapter 1")).toBeLessThan(text.indexOf("Chapter 2"));
    expect(text).toContain("Interest & principal.");
  });

  it("extracts PDF text with page markers", async () => {
    const f = path.join(dir, "b.pdf");
    fs.writeFileSync(f, minimalPdf(["Chapter 1: Simple Interest", "Interest is the price of money."]));
    const text = await extractBookText(f);
    expect(text).toContain("[p. 1]");
    expect(text).toContain("Chapter 1: Simple Interest");
  });

  it("converts HTML to text with headings", () => {
    expect(htmlToText("<h2>Title</h2><p>a&nbsp;b</p>")).toBe("## Title\na b");
  });

  it("rejects unsupported formats", async () => {
    const f = path.join(dir, "b.xyz");
    fs.writeFileSync(f, "x");
    await expect(extractBookText(f)).rejects.toThrow(/unsupported/);
  });
});

describe("manual connector", () => {
  it("renders the extraction prompt with every variable filled", () => {
    const cfg = demoConfig();
    const p = renderExtractionPrompt({ bookTitle: cfg.title, author: cfg.author, edition: "1st", chapterNumber: 1, chapterTitle: "Simple and Compound Interest", partId: "p1", partScope: "all of chapter 1", nextPartScope: "none" });
    expect(p).toContain(cfg.title);
    expect(p).not.toMatch(/\{\{/);
    expect(p).toContain("NOT IN SOURCE");
  });

  it("writes PASTE_INTO_NOTEBOOKLM.md and a template drop file that the gate rejects until filled", () => {
    const cfg = demoConfig();
    const r = prepareManualResearch(cfg, "ch01", "p1", "sections 1.1 to 1.4", "none");
    expect(r.created).toBe(true);
    const paste = fs.readFileSync(r.pasteFile, "utf8");
    expect(paste).toContain("notebooklm.google.com");
    expect(paste).toContain(r.dropFile);
    expect(paste).not.toMatch(/\{\{/);
    const gate = gateResearch(fs.readFileSync(r.dropFile, "utf8"));
    expect(gate.ok).toBe(false);
    expect(gate.problems.join(" ")).toMatch(/unfilled template/);
    expect(prepareManualResearch(cfg, "ch01", "p1", "x", "y").created).toBe(false);
  });
});
