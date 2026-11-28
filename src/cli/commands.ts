import type { Command } from "commander";

/** Register every CLI command. Handlers are imported lazily so `doctor --json` stays fast. */
export function registerCommands(program: Command): void {
  program
    .command("doctor")
    .description("check Node, ffmpeg/ffprobe, Chromium, disk space and optional tools")
    .option("--json", "print machine-readable JSON")
    .option("--fix", "download missing auto-installable components (Remotion browser)")
    .option("--non-fatal", "always exit 0 (used by postinstall)")
    .action(async (opts) => {
      const { runDoctor, printDoctor } = await import("./doctor");
      const checks = await runDoctor({ fix: Boolean(opts.fix) });
      if (opts.json) process.stdout.write(JSON.stringify({ checks }, null, 2) + "\n");
      else printDoctor(checks);
      const blocking = checks.some((c) => c.required && c.status !== "ok");
      process.exitCode = blocking && !opts.nonFatal ? 1 : 0;
    });

  program
    .command("research:gate")
    .description("run the S1 research gate on one or more notebook_context.md files")
    .argument("<files...>", "research files")
    .option("--json", "print machine-readable JSON")
    .action(async (files: string[], opts) => {
      const { runResearchGate } = await import("./research-cmds");
      process.exitCode = runResearchGate(files, Boolean(opts.json));
    });

  program
    .command("research:stamp")
    .description("recompute the SHA-256 in the OPENLECTERN-RESEARCH header after editing a research file")
    .argument("<files...>", "research files")
    .action(async (files: string[]) => {
      const { runResearchStamp } = await import("./research-cmds");
      process.exitCode = runResearchStamp(files);
    });

  program
    .command("research:detect")
    .description("detect research connectors (NotebookLM MCP, nlm CLI, manual, local file)")
    .option("--json", "print machine-readable JSON")
    .action(async (opts) => {
      const { runResearchDetect } = await import("./provider-cmds");
      process.exitCode = await runResearchDetect(Boolean(opts.json));
    });

  program
    .command("tts:test")
    .description("synthesize one sentence with a TTS provider and save audio + word boundaries")
    .option("--provider <id>", "edge | piper | mock | openai | elevenlabs | google", "edge")
    .option("--voice <voice>", "provider voice id")
    .option("--lang <lang>", "language code", "en")
    .option("--text <text>", "text to speak")
    .option("--out <dir>", "output folder")
    .option("--json", "print machine-readable JSON")
    .action(async (opts) => {
      const { runTtsTest } = await import("./provider-cmds");
      process.exitCode = await runTtsTest(opts);
    });

  program
    .command("llm:test")
    .description("send a tiny ping task through an LLM provider (agent-handoff exits 75 until the agent answers)")
    .option("--provider <id>", "agent-handoff | openai-compatible | anthropic | gemini | ollama | mock", "agent-handoff")
    .option("--handoff <mode>", "exit | poll (agent-handoff only)")
    .option("--json", "print machine-readable JSON")
    .action(async (opts) => {
      const { runLlmTest } = await import("./provider-cmds");
      process.exitCode = await runLlmTest(opts);
    });

  program
    .command("task:validate")
    .description("validate the agent's output.json for one or more hand-off tasks (schema + content gates)")
    .argument("<ids...>", "task ids printed in AWAITING_AGENT lines")
    .option("--json", "print machine-readable JSON")
    .action(async (ids: string[], opts) => {
      const { runTaskValidate } = await import("./provider-cmds");
      process.exitCode = await runTaskValidate(ids, Boolean(opts.json));
    });

  program
    .command("task:list")
    .description("list agent hand-off tasks and whether they are answered")
    .option("--json", "print machine-readable JSON")
    .action(async (opts) => {
      const { runTaskList } = await import("./provider-cmds");
      process.exitCode = await runTaskList(Boolean(opts.json));
    });

  program
    .command("schemas:export")
    .description("export JSON Schemas for every artifact to schemas/json/")
    .option("--out <dir>", "output folder", "schemas/json")
    .action(async (opts) => {
      const { exportSchemas } = await import("../schemas/export");
      const n = exportSchemas(opts.out);
      process.stderr.write(`[OK] exported ${n} JSON Schemas to ${opts.out}\n`);
    });

  program
    .command("templates")
    .description("list the scene templates (id, purpose, animation targets, topologies, fallback)")
    .option("--json", "print machine-readable JSON")
    .option("--schema <id>", "print the JSON Schema of one template's data")
    .action(async (opts) => {
      const { runTemplates } = await import("./render-cmds");
      process.exitCode = runTemplates(opts);
    });

  const partOptions = (cmd: Command): Command =>
    cmd
      .option("--book <id>", "book id (workspace/books/<id>)")
      .option("--chapter <id>", "chapter id from the course map (e.g. ch01, orientation)")
      .option("--part <id>", "part id", "p1")
      .option("--lang <langs>", "comma-separated narration languages (default: the book's)")
      .option("--llm <id>", "agent-handoff | replay | mock | openai-compatible | anthropic | gemini | ollama")
      .option("--model <name>", "LLM model name")
      .option("--tts <id>", "edge | piper | mock | openai | elevenlabs | google")
      .option("--handoff <mode>", "exit | poll (agent-handoff only)")
      .option("--draft", "half-resolution, fast render (never releasable)")
      .option("--scenes <list>", "comma-separated scene indexes to synthesize and render (draft subsets)")
      .option("--non-interactive", "never prompt; agent hand-off exits 75 with AWAITING_AGENT lines")
      .option("--no-review", "skip the L6 expert review")
      .option("--json", "print machine-readable JSON");
  const makeOptions = (cmd: Command): Command =>
    partOptions(cmd)
      .option("--all", "every selected part of the book, then Orientation and Synthesis")
      .option("--until <stage>", "stop after this stage (S0..S14)")
      .option("--force [stages]", "re-run these stages (comma-separated) or all stages even when cached")
      .option("--resume", "continue an interrupted or waiting run (finished stages are cached)")
      .option("--record", "record non-mock LLM outputs for replay");

  makeOptions(program.command("make").description("run stages S0..S14 for one part (or --all parts) of a book")).action(async (opts) => {
    const { runMakeCmd } = await import("./make-cmds");
    process.exitCode = await runMakeCmd(opts);
  });

  makeOptions(program.command("start").description("the setup wizard (B.2); --non-interactive takes every answer from flags and runs make"))
    .option("--title <title>", "book title")
    .option("--author <name>", "author")
    .option("--edition <edition>", "edition")
    .option("--domain <text>", "subject domain (free text)")
    .option("--audience <level>", "absolute_beginner | intermediate | advanced")
    .option("--display-lang <lang>", "on-screen text language")
    .option("--chapters <toc>", "table of contents: '1. Title; 2. Title'")
    .option("--min-minutes <n>", "minimum minutes per video part")
    .option("--max-minutes <n>", "maximum minutes per video part")
    .option("--research <mode>", "notebooklm | manual | local-file")
    .option("--source-file <path>", "local PDF/EPUB/TXT/DOCX you own (local-file research)")
    .option("--notebook-id <id>", "NotebookLM notebook id")
    .option("--orientation", "build the Orientation video")
    .option("--no-orientation", "skip the Orientation video")
    .option("--synthesis", "build the Synthesis video")
    .option("--i-own-this-book", "confirm you own or have the right to use the book")
    .action(async (opts) => {
      const { runStart } = await import("./wizard");
      process.exitCode = await runStart(opts);
    });

  partOptions(program.command("run").description("run one stage alone (forced), e.g. `openlectern run S7 --book demo --chapter ch01`").argument("<stage>", "S0..S14")).action(async (stage: string, opts) => {
    const { runStageCmd } = await import("./make-cmds");
    process.exitCode = await runStageCmd(stage, opts);
  });

  partOptions(program.command("qa").description("run QA (S12) for a part and write qa/report.json + qa/report.html"))
    .option("--fixture <dir>", "run S10-S12 on a QA fixture folder instead of a workspace part")
    .option("--out <dir>", "output folder for --fixture")
    .action(async (opts) => {
      const { runQaCmd } = await import("./make-cmds");
      process.exitCode = await runQaCmd(opts);
    });

  program
    .command("qa:checks")
    .description("list every QA check id, layer and title")
    .option("--json", "print machine-readable JSON")
    .action(async (opts) => {
      const { runQaChecksCmd } = await import("./make-cmds");
      process.exitCode = runQaChecksCmd(Boolean(opts.json));
    });

  partOptions(
    program
      .command("part:preflight")
      .description("deterministic pre/post-render validation gate (schemas, L1-L3 QA, compiled cues, fast --stills overflow check, and --release packaging check)"),
  )
    .option("--compiled", "require compiled audio timelines (S10) with zero unresolved visualCues")
    .option("--stills", "render beat stills cleanly and assert 0 R-04/R-06 layout overflows before full S11 MP4 encode")
    .option("--release", "verify releasable=true QA report, packaged subfolder deliverables, clean drafts/flat dirs, and index.html links")
    .action(async (opts) => {
      const { runPreflightCmd } = await import("./make-cmds");
      process.exitCode = await runPreflightCmd(opts);
    });

  program
    .command("render:stills")
    .description("render template fixtures (or one fixture file) to PNG stills and report text overflow")
    .option("--fixtures", "render the template gallery in tests/fixtures/templates")
    .option("--fixture <file>", "render one fixture JSON file")
    .option("--out <dir>", "output folder", "out/stills")
    .option("--theme <id>", "override the theme (dark-classroom | light-classroom)")
    .option("--draft", "half-resolution stills")
    .option("--concurrency <n>", "parallel renders")
    .option("--json", "print machine-readable JSON")
    .action(async (opts) => {
      const { runRenderStills } = await import("./render-cmds");
      process.exitCode = await runRenderStills(opts);
    });
}
