# QA Severity Standard

The QA release gate (`openlectern qa`, stage S12) runs deterministic checks in layers L1 to L5, an optional expert review (L6), and release rules (Q). Every finding has a severity, a cause and a repair hint.

## Severities

| Severity | Meaning | Release |
| --- | --- | --- |
| BLOCKER | The video would mislead, show broken content, or cannot be trusted (wrong number, raw LaTeX, `[object Object]`, missing audio, mock provenance). | Stops release |
| HIGH | The video breaks a teaching or production standard a learner would notice (unexplained acronym, quiz without thinking pause, caption over the footer, large audio drift). | Stops release |
| MEDIUM | A quality problem that should be fixed but does not mislead (slightly long sentences, low diversity margin). | Reported |
| LOW | Polish (a takeaway that could be shorter). | Reported |

Release requires 0 BLOCKER and 0 HIGH.

## Layers

- **L0 Code health** (CI): typecheck, lint, unit tests, schema tests, one demo render.
- **L1 Schema** (S-xx): every artifact parses; ids unique; every `sourceFactId` resolves; every template allowed for the book.
- **L2 Pedagogy** (P-01 to P-10): hook order, progression, term detector, required elements, narration metrics, quiz structure and fairness, summary structure, spoilers, diversity.
- **L3 Content integrity** (C-01 to C-15): citations, coverage, numbers, hypothetical badges, bespoke content, cross-part similarity, boilerplate, narration-visual alignment, placeholders, control characters, forbidden math text, KaTeX, six-way agreement, units, on-screen language.
- **L4 Audio** (A-01 to A-07): audio present, fresh, in sync, loud enough, no long silences, cues resolved, ASR back-transcription.
- **L5 Render** (R-01 to R-08): container format, black and frozen frames, overflow, OCR, caption placement, theme conformance, quiz frames.
- **L6 Expert review**: a reviewer (an LLM provider or the host agent) scores accuracy, clarity, vividness, sync, visual quality and freshness from 1 to 5; every axis must be at least 4. L6 can add findings but can never downgrade a deterministic BLOCKER.
- **Q Release rules**: Q-MOCK (mock LLM or TTS provenance, BLOCKER), Q-DRAFT (draft render, HIGH), Q-REVIEW (missing or failing L6 review on a release run, HIGH).

## Skipped checks

Checks that need an optional tool (Tesseract for R-05, whisper.cpp for A-07) or a full-quality render are reported as `skipped` with the reason. Mock audio skips A-04 and A-07. A skipped check is never a pass.

## Repair loop

For each failing finding the pipeline runs the mapped repair: re-prompt the specific beat or scene with the finding text, regenerate audio for changed beats only, re-render, re-run QA. At most three iterations per part; if still failing, the part is marked `NEEDS_HUMAN` with a report and the run continues with other parts.

## Every check is tested

Every check id in the registry has a failing fixture under `tests/fixtures/bad/<ID>/`, and `tests/qa` asserts that the fixture fails with exactly that id. The coverage line `QA fixture coverage: 100% (N/N)` is printed by the test run.
