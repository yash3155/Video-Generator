import { Command } from "commander";
import { config as loadEnv } from "dotenv";
import { setQuiet } from "../core/log";
import { registerCommands } from "./commands";
import { AWAITING_AGENT_EXIT_CODE, awaitingLines, isAwaitingAgent } from "../llm/types";

loadEnv({ quiet: true });

const program = new Command();
program
  .name("openlectern")
  .description("Turn a book you have the right to use into narrated, animated, QA-gated lesson videos.")
  .version("0.1.0")
  .option("-q, --quiet", "less log output")
  .hook("preAction", (cmd) => {
    if (cmd.opts().quiet) setQuiet(true);
  });

registerCommands(program);

program.parseAsync(process.argv).catch((e: unknown) => {
  if (isAwaitingAgent(e)) {
    process.stderr.write("[WAIT] answer each task: read prompt.md, write output.json, run `openlectern task:validate <task_id>`, then re-run this command\n");
    process.stdout.write(awaitingLines(e).join("\n") + "\n", () => process.exit(AWAITING_AGENT_EXIT_CODE));
    return;
  }
  const msg = e instanceof Error ? e.message : String(e);
  process.stderr.write(`[FAIL] ${msg}\n`);
  if (process.env.OPENLECTERN_DEBUG && e instanceof Error) process.stderr.write(String(e.stack) + "\n");
  process.exit(typeof (e as { exitCode?: number })?.exitCode === "number" ? (e as { exitCode: number }).exitCode : 1);
});
