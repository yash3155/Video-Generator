import fs from "node:fs";
import path from "node:path";
import { gateResearch, parseResearch, formatResearch } from "../research/gate";
import { readText, writeText } from "../core/fsutil";
import { log } from "../core/log";

export function runResearchGate(files: string[], json: boolean): number {
  const results = files.map((f) => {
    if (!fs.existsSync(f)) return { file: f, ok: false, problems: ["file not found"], stats: null };
    const r = gateResearch(readText(f));
    return { file: f, ok: r.ok, problems: r.problems, stats: r.stats };
  });
  if (json) process.stdout.write(JSON.stringify({ results }, null, 2) + "\n");
  else {
    for (const r of results) {
      if (r.ok) log.ok(`${r.file}: ${r.stats?.chars} chars, ${r.stats?.citations} citations, ${r.stats?.factLines} ledger items`);
      else log.fail(`${r.file}: ${r.problems.join("; ")}`);
    }
  }
  return results.every((r) => r.ok) ? 0 : 1;
}

export function runResearchStamp(files: string[]): number {
  let code = 0;
  for (const f of files) {
    const parsed = parseResearch(readText(f));
    if (!parsed.header) {
      log.fail(`${f}: no valid OPENLECTERN-RESEARCH header${parsed.headerError ? ` (${parsed.headerError})` : ""}`);
      code = 1;
      continue;
    }
    const { sha256: _old, ...rest } = parsed.header;
    writeText(f, formatResearch(rest, parsed.body));
    log.ok(`stamped ${path.normalize(f)}`);
  }
  return code;
}
