/* CLI handlers for templates and render:stills. */
import path from "node:path";
import { log } from "../core/log";
import { TEMPLATE_REGISTRY, templateJsonSchema, templateMeta } from "../remotion/templates/registry";

export function runTemplates(opts: { json?: boolean; schema?: string }): number {
  if (opts.schema) {
    const meta = templateMeta(opts.schema);
    if (!meta) {
      log.fail(`unknown template "${opts.schema}"; run \`openlectern templates\` for the list`);
      return 1;
    }
    process.stdout.write(JSON.stringify(templateJsonSchema(meta.id), null, 2) + "\n");
    return 0;
  }
  if (opts.json) {
    process.stdout.write(JSON.stringify({ templates: TEMPLATE_REGISTRY }, null, 2) + "\n");
    return 0;
  }
  for (const t of TEMPLATE_REGISTRY) {
    process.stdout.write(`${t.id.padEnd(22)} L${t.level}${t.nestable ? " nestable" : "         "}  ${t.description}\n`);
  }
  process.stdout.write(`\n${TEMPLATE_REGISTRY.length} templates. Data schema: openlectern templates --schema <id>\n`);
  return 0;
}

export async function runRenderStills(opts: { fixtures?: boolean; fixture?: string; out: string; theme?: string; draft?: boolean; concurrency?: string; json?: boolean }): Promise<number> {
  const { galleryJobs, loadStillFixture, renderStills } = await import("../render/stills");
  if (!opts.fixtures && !opts.fixture) {
    log.fail("pass --fixtures (template gallery) or --fixture <file>");
    return 2;
  }
  const overrides = opts.theme ? { theme: opts.theme } : {};
  let jobs;
  try {
    jobs = opts.fixtures
      ? galleryJobs(undefined, overrides)
      : [{ name: path.basename(opts.fixture!).replace(/\.json$/, ""), fixture: loadStillFixture(path.resolve(opts.fixture!), overrides), expectOverflow: /overflow/.test(path.basename(opts.fixture!)) }];
  } catch (e) {
    log.fail(`render data check failed: ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
  const result = await renderStills(jobs, { outDir: opts.out, draft: Boolean(opts.draft), concurrency: opts.concurrency ? Number(opts.concurrency) : undefined });
  if (opts.json) process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  for (const p of result.problems) log.fail(p);
  if (result.problems.length) return 1;
  log.ok(`${result.pngs.length} stills written to ${opts.out} (${result.overflow.length} expected overflow ${result.overflow.length === 1 ? "entry" : "entries"})`);
  return 0;
}
