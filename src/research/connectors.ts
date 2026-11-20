import { runSync, which } from "../core/proc";

export interface ConnectorStatus {
  id: "notebooklm-mcp" | "nlm-cli" | "manual" | "local-file";
  label: string;
  available: boolean;
  detail: string;
  flavor?: string;
}

export type NlmFlavor = "notebooklm-mcp-cli" | "nlm-chat" | "unknown";

/**
 * Community NotebookLM CLIs share the `nlm` name but differ in sub-commands. We probe `nlm --help` and pick an adapter:
 * - "notebooklm-mcp-cli": `nlm notebook list`, `nlm source list <id>`, `nlm query notebook <id> "<q>"`
 * - "nlm-chat": `nlm list`, `nlm sources <id>`, `nlm chat <id> "<q>"`
 */
export function detectNlmFlavor(helpText: string): NlmFlavor {
  const t = helpText.toLowerCase();
  if (/\bnotebook\b/.test(t) && /\bquery\b/.test(t)) return "notebooklm-mcp-cli";
  if (/\bchat\b/.test(t)) return "nlm-chat";
  return "unknown";
}

export interface NlmCommands {
  login: string[];
  listNotebooks: string[];
  listSources: (notebookId: string) => string[];
  query: (notebookId: string, question: string) => string[];
}

export function nlmCommands(flavor: NlmFlavor): NlmCommands {
  if (flavor === "nlm-chat")
    return {
      login: ["auth"],
      listNotebooks: ["list"],
      listSources: (id) => ["sources", id],
      query: (id, q) => ["chat", id, q],
    };
  return {
    login: ["login"],
    listNotebooks: ["notebook", "list"],
    listSources: (id) => ["source", "list", id],
    query: (id, q) => ["query", "notebook", id, q],
  };
}

/** Parse notebook listings leniently: any line with an id-like token (UUID or long base62) and a title. */
export function parseNotebookList(text: string): { id: string; title: string }[] {
  try {
    const j = JSON.parse(text);
    const arr = Array.isArray(j) ? j : j.notebooks;
    if (Array.isArray(arr)) return arr.map((n: any) => ({ id: String(n.id ?? n.notebook_id ?? n.notebookId), title: String(n.title ?? n.name ?? "") })).filter((n) => n.id);
  } catch {
    /* plain text */
  }
  const out: { id: string; title: string }[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[A-Za-z0-9_-]{20,})\b/);
    if (!m) continue;
    const title = line.replace(m[0], "").replace(/[|\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
    out.push({ id: m[1], title });
  }
  return out;
}

/** Fuzzy title match used to pick the user's notebook for a book (normalized token overlap). */
export function matchNotebook(notebooks: { id: string; title: string }[], bookTitle: string): { id: string; title: string; score: number } | null {
  const toks = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9\p{Script=Devanagari} ]+/gu, " ").split(/\s+/).filter((w) => w.length > 2));
  const want = toks(bookTitle);
  let best: { id: string; title: string; score: number } | null = null;
  for (const n of notebooks) {
    const have = toks(n.title);
    const inter = [...want].filter((w) => have.has(w)).length;
    const score = want.size ? inter / want.size : 0;
    if (!best || score > best.score) best = { ...n, score };
  }
  return best && best.score >= 0.5 ? best : null;
}

export class NlmCli {
  constructor(
    readonly bin: string,
    readonly flavor: NlmFlavor,
  ) {}

  private run(args: string[]): string {
    const r = runSync(this.bin, args, { timeoutMs: 10 * 60 * 1000 });
    if (r.code !== 0) throw new Error(`nlm ${args[0]} failed (exit ${r.code}): ${(r.stderr || r.stdout).slice(-300)}`);
    return r.stdout;
  }

  listNotebooks(): { id: string; title: string }[] {
    return parseNotebookList(this.run(nlmCommands(this.flavor).listNotebooks));
  }

  listSources(notebookId: string): { id: string; title: string }[] {
    return parseNotebookList(this.run(nlmCommands(this.flavor).listSources(notebookId)));
  }

  query(notebookId: string, question: string): string {
    return this.run(nlmCommands(this.flavor).query(notebookId, question));
  }
}

export function detectNlm(): { bin: string; flavor: NlmFlavor } | null {
  const bin = which("nlm");
  if (!bin) return null;
  const r = runSync(bin, ["--help"], { timeoutMs: 20000 });
  return { bin, flavor: detectNlmFlavor(r.stdout + r.stderr) };
}

/** Detect every research connector, in the order the wizard tries them. */
export function detectConnectors(): ConnectorStatus[] {
  const mcp = /^(1|true|yes)$/i.test(process.env.OPENLECTERN_NOTEBOOKLM_MCP || "");
  const nlm = detectNlm();
  return [
    {
      id: "notebooklm-mcp",
      label: "NotebookLM MCP server (host agent tools)",
      available: mcp,
      detail: mcp
        ? "the host agent exposes NotebookLM MCP tools; it runs the extraction prompt and saves notebook_context.md itself"
        : "not announced; set OPENLECTERN_NOTEBOOKLM_MCP=1 when your coding agent has NotebookLM MCP tools",
    },
    {
      id: "nlm-cli",
      label: "nlm command-line client",
      available: Boolean(nlm && nlm.flavor !== "unknown"),
      detail: nlm ? `found ${nlm.bin} (flavor ${nlm.flavor})` : "nlm not found on PATH",
      flavor: nlm?.flavor,
    },
    { id: "manual", label: "Manual NotebookLM copy and paste", available: true, detail: "always available: paste the prompt into NotebookLM and save the answer" },
    { id: "local-file", label: "Local PDF/EPUB/DOCX/TXT you own", available: true, detail: "offline text extraction; the LLM applies the extraction prompt to the chapter text" },
  ];
}
