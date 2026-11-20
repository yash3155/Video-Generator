/* Plain-text logging. Logs go to stderr so that `--json` output on stdout stays machine-readable. No emoji. */
let quiet = false;

export function setQuiet(q: boolean): void {
  quiet = q;
}

function emit(tag: string, msg: string): void {
  if (quiet && tag === "[INFO]") return;
  process.stderr.write(`${tag} ${msg}\n`);
}

export const log = {
  info: (m: string) => emit("[INFO]", m),
  ok: (m: string) => emit("[OK]", m),
  warn: (m: string) => emit("[WARN]", m),
  fail: (m: string) => emit("[FAIL]", m),
  stage: (m: string) => emit("[STAGE]", m),
};
