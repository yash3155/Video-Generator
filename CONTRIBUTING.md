# Contributing to OpenLectern

Thank you for helping. This project turns books that users have the right to use into lesson videos, so accuracy, pedagogy and legal care matter as much as code quality.

## Setup

```
git clone <your fork>
cd openlectern
npm install
npm run check
```

`npm run check` runs lint, typecheck and the unit tests. Node.js 20 or newer is required. ffmpeg is optional (the build falls back to `ffmpeg-static`).

PowerShell users: run commands one per line or chain them with `;` (Windows PowerShell 5.1 has no `&&`).

## Tests

- `npm test` runs every Vitest suite (`tests/**`).
- `npx vitest run tests/qa` runs the QA gate suite; every QA check has a failing fixture in `tests/fixtures/bad/<CHECK-ID>/`.
- `npm run demo:ci` reproduces the demo pipeline from recorded outputs with `--llm replay --tts mock --draft`.

## How to add a template

1. Run `npx openlectern template:propose --id <name>` to scaffold the spec.
2. Add a Zod data schema and a pure view-model mapper in `src/remotion/templates/<name>/`.
3. Add the React component, a fixture in `tests/fixtures/templates/<name>.json`, and register it in `src/remotion/templates/registry.ts`.
4. Run `npx openlectern render:stills --fixtures --out .build/stills` and look at the PNG.
5. Add schema and mapper tests.

## How to add a domain preset

Create `src/domains/<name>/index.ts` exporting a `DomainPreset` (term list, chart presets, boilerplate denylist additions). Enable it per book in `book.config.json` (`domains: ["<name>"]`).

## How to add a provider

- LLM: implement `LlmProvider` in `src/providers/llm/<name>.ts` and register it in `src/providers/llm/index.ts`. Every call must go through `runLlmTask` so schema validation, repair retries, caching and the ledger are applied.
- TTS: implement `TtsProvider` in `src/providers/tts/<name>.ts` returning audio plus word boundaries, and register it in `src/providers/tts/index.ts`.
- Keys are read from `.env` only. Never commit secrets.

## How to add a QA check

1. Add the check to `src/qa/checks/` with an id (`P-xx`, `C-xx`, `A-xx`, `R-xx`), severity and repair hint, and register it in `src/qa/registry.ts`.
2. Add `tests/fixtures/bad/<ID>/patch.json` that makes exactly that check fail on the clean fixture.
3. Run `npx vitest run tests/qa`; the coverage line must stay at 100%.

## Rules

- No chapter-specific or book-specific code; book differences live in data.
- No emoji in source, config or logs; use `[OK]`, `[FAIL]`, `[WARN]`.
- No copyrighted book text in the repository.
- Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
