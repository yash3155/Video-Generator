# Claude Code Instructions for OpenLectern

This file instructs Claude Code when operating inside the OpenLectern codebase.

## Build and Test Commands

- **Doctor**: `node bin/openlectern.mjs doctor` (checks system environment and tools)
- **Check**: `npm run check` (runs lint, typecheck, and test suite)
- **Typecheck**: `npm run typecheck` (`tsc --noEmit -p tsconfig.json`)
- **Lint**: `npm run lint`
- **Unit & Integration Tests**: `npm test` (`vitest run`)
- **Interactive Wizard**: `node bin/openlectern.mjs start`
- **Pipeline Runner**: `node bin/openlectern.mjs make --book <id> --chapter <ch> --part <p>`
- **Phase Verifiers**: `npm run verify:status`, `npm run verify:phase -- <n>`, `npm run verify:done`

## Architecture and Code Style

- **Runtime**: Node.js 20+ with TypeScript (strict mode).
- **Execution**: Run TypeScript via `tsx` or direct Node execution without compile steps.
- **Rendering**: Remotion 4 with React 19; 16 standard templates in `src/remotion/templates/`.
- **Validation**: Every artifact has a Zod schema in `src/schemas/`.
- **No Chapter-Specific Code**: All pipeline code is generic; chapter differences live solely in data under `workspace/books/`.
- **No Secrets / Telemetry**: Never hardcode credentials, cookies, or user-specific paths.

## Agent Hand-off Protocol

When running `--llm agent-handoff`:
1. The engine prints `AWAITING_AGENT <task_id> <path>` and exits with code 75.
2. Read `workspace/.tasks/<task_id>/prompt.md` and `input.json`.
3. Author the response in `workspace/.tasks/<task_id>/output.json`.
4. Validate with `node bin/openlectern.mjs task:validate <task_id>`.
5. Re-run the command to resume.
