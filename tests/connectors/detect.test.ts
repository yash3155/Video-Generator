import { afterEach, describe, expect, it } from "vitest";
import { detectConnectors, detectNlmFlavor, matchNotebook, nlmCommands, parseNotebookList } from "../../src/research/connectors";

const saved = process.env.OPENLECTERN_NOTEBOOKLM_MCP;
afterEach(() => {
  if (saved === undefined) delete process.env.OPENLECTERN_NOTEBOOKLM_MCP;
  else process.env.OPENLECTERN_NOTEBOOKLM_MCP = saved;
});

describe("connector detection", () => {
  it("reports all four connectors in try order; manual and local-file are always available", () => {
    delete process.env.OPENLECTERN_NOTEBOOKLM_MCP;
    const list = detectConnectors();
    expect(list.map((c) => c.id)).toEqual(["notebooklm-mcp", "nlm-cli", "manual", "local-file"]);
    expect(list.find((c) => c.id === "manual")!.available).toBe(true);
    expect(list.find((c) => c.id === "local-file")!.available).toBe(true);
    expect(list.find((c) => c.id === "notebooklm-mcp")!.available).toBe(false);
  });

  it("marks NotebookLM MCP available when the host agent announces it", () => {
    process.env.OPENLECTERN_NOTEBOOKLM_MCP = "1";
    expect(detectConnectors().find((c) => c.id === "notebooklm-mcp")!.available).toBe(true);
  });
});

describe("nlm CLI adapters", () => {
  it("detects the CLI flavor from --help output", () => {
    expect(detectNlmFlavor("Usage: nlm [command]\n  notebook  Manage notebooks\n  query     Ask a notebook\n  login")).toBe("notebooklm-mcp-cli");
    expect(detectNlmFlavor("nlm - NotebookLM CLI\nCommands:\n  list\n  sources\n  chat <id> <prompt>")).toBe("nlm-chat");
    expect(detectNlmFlavor("something else")).toBe("unknown");
  });

  it("builds flavor-specific commands", () => {
    expect(nlmCommands("notebooklm-mcp-cli").query("nb1", "q")).toEqual(["query", "notebook", "nb1", "q"]);
    expect(nlmCommands("nlm-chat").query("nb1", "q")).toEqual(["chat", "nb1", "q"]);
    expect(nlmCommands("nlm-chat").listSources("nb1")).toEqual(["sources", "nb1"]);
  });

  it("parses notebook lists from JSON and plain text", () => {
    expect(parseNotebookList('[{"id":"abc","title":"Money That Grows"}]')).toEqual([{ id: "abc", title: "Money That Grows" }]);
    const text = "ID                                    TITLE\n3f2b8c1e-1111-2222-3333-444455556666  Money That Grows\n9a8b7c6d-1111-2222-3333-444455556666  Cooking Notes\n";
    const list = parseNotebookList(text);
    expect(list).toHaveLength(2);
    expect(list[0]).toEqual({ id: "3f2b8c1e-1111-2222-3333-444455556666", title: "Money That Grows" });
  });

  it("fuzzy-matches the notebook by book title", () => {
    const nbs = [
      { id: "1", title: "Cooking Notes" },
      { id: "2", title: "Money that grows - primer" },
    ];
    expect(matchNotebook(nbs, "Money That Grows: A Beginner's Primer")?.id).toBe("2");
    expect(matchNotebook(nbs, "Quantum Field Theory")).toBeNull();
  });
});
