# Quality Assurance and Release Gate

OpenLectern enforces an uncompromising release gate before any video can be packaged or published. Every chapter video must pass 49 automated checks with zero BLOCKER and zero HIGH findings.

## The Six QA Layers

### L1 - Schema Validation
- Validates all artifacts against strict Zod schemas (`01_source_facts.json` through `09_episode_compiled.json`).
- Checks ID uniqueness, prerequisite acyclicity, and referenced source fact integrity.

### L2 - Pedagogical Standards (P-01 to P-10)
- **P-01**: Scene 0 problem-first hook with 4 beats; definition-first opening strictly prohibited.
- **P-02**: 8-stage learning progression mapped for each core concept.
- **P-03**: JIT concept clarification: all terms, acronyms, and symbols defined on or before first mention.
- **P-04**: Required elements present: causal chain card, prediction question before reveal, misconception vs reality split, where-we-are roadmap.
- **P-05**: Narration metrics: average sentence length 8-22 words (max 35 words); beat word budget 25-75 words.
- **P-06 / P-07 / P-09**: Quiz standards: 4 distinct options, thinking pause >= 3000 ms, no spoiler markers in any language, tests only prior concepts.
- **P-08**: Summary: exactly 8 rules, 6 beats, spotlight on rule 8.
- **P-10**: Visual diversity: no identical templates in adjacent scenes; max 30% per template; at least 5 distinct templates per part.

### L3 - Content Integrity (C-01 to C-15)
- **C-01 / C-02**: Source grounding: >= 85% fact coverage; all formulas and worked examples taught.
- **C-03 / C-04**: Number integrity: every on-screen number derived from source facts or badged `HYPOTHETICAL EXAMPLE`.
- **C-05 / C-06 / C-07**: Bespoke content gate: cross-part token 5-gram Jaccard similarity < 0.15; boilerplate denylist enforced.
- **C-08**: Narration-visual alignment: >= 60% keyword match between slide visual and spoken narration.
- **C-09**: Stale / broken rendering token detection: bans `[object Object]`, `undefined`, `null`, `NaN`, `TODO`, `TBD`.
- **C-10 / C-11**: Swallowed LaTeX backslash repair: catches `\t`, `\f`, `\b`, `\r`, `\n` in JSON math strings.
- **C-12 / C-13**: KaTeX strict compile and six-way arithmetic agreement verification.
- **C-14**: Variables declared with meanings and units; chart axes labeled with units.
- **C-15**: On-screen language rule: display language strings contain no narration-only script.

### L4 - Audio Quality (A-01 to A-07)
- **A-01 / A-02**: Decodable audio > 0.5s per beat; hash matches current spoken text (no stale audio).
- **A-03**: Timeline drift: measured audio vs compiled timeline drift < 0.5s per scene, < 1.0s total.
- **A-04 / A-05**: Loudness normalization (target -16 LUFS integrated, <= -1.0 dBTP peak); no internal silence > 1.5s (except quiz pause).
- **A-06**: Visual cue anchor resolution: every on-screen visual cue anchors to a valid word timestamp.
- **A-07**: Optional ASR back-transcription WER check with whisper.cpp.

### L5 - Render & Visuals (R-01 to R-08)
- **R-01**: Media container probe: H.264, 1920x1080, 30 fps, yuv420p, AAC stereo, matching duration.
- **R-02 / R-03**: ffmpeg `blackdetect` and `freezedetect` (> 20s freeze during cue narration fails).
- **R-04**: Real-time overflow diagnostics: elements reporting `scrollWidth > clientWidth` or `scrollHeight > clientHeight` fail.
- **R-05**: Optional Tesseract OCR scan for uncompiled LaTeX commands and placeholder tokens.
- **R-06 / R-07**: WCAG contrast AA conformance and caption-footer overlap prevention.
- **R-08**: Quiz animation validation: options visible during pause; single answer highlighted on reveal.

### L6 - Expert Instructional Review
- Evaluates full contact sheet and narration on 6 axes (1 to 5):
  - Accuracy
  - Clarity
  - Vividness
  - Narration-visual sync
  - Visual quality
  - Freshness (absence of boilerplate)
- All scores must be >= 4 for release.

## Severity Policy

- **BLOCKER**: Stops pipeline and prevents release.
- **HIGH**: Release-blocking issue. Must be resolved before publishing.
- **MEDIUM**: Reported warning; does not block draft builds.
- **LOW**: Minor diagnostic observation.
