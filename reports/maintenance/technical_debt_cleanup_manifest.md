# Technical Debt & Repository Cleanup Manifest

Generated: 2026-11-08  
Status: DRAFT / AUDITED  
Engine: Autonomous Course-to-Video Engine (Antigravity AI Systems Architect)

---

## 1. Executive Summary

This manifest audits the current repository files and classifies technical debt, obsolete scripts, experimental chapters, ad-hoc test outputs, and unused artifacts into safe, controlled, and protected tiers.

In accordance with `AGENTS.md` and Phase 2 safety invariants:
- **Baseline preservation**: The original `src/data/chapters/hull_derivatives/ch01_part1` baseline has been fully backed up to `ch01_part1_baseline_backup` across data, audio, QA reports, and rendered MP4.
- **Protected assets**: Production source facts, active courses, book content, SQLite/credentials (`gemini.db`, `.env`), and core test suites are strictly marked **Essential / Retain permanently**.

---

## 2. File Audit & Classification Matrix

| File / Directory Path | Classification | Reason for Inclusion | Risk | Superseding / Reference File | Recommended Action |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `.backtest-man` | Clearly Obsolete | 0-byte temporary editor artifact in root. | Low | None | **Safe to delete now** |
| `.backtest-man~` | Clearly Obsolete | 0-byte backup editor artifact in root. | Low | None | **Safe to delete now** |
| `test_ch01_part2_formula.png` | Clearly Obsolete | Ad-hoc formula rendering test image from 2026-11-03. | Low | None | **Safe to delete now** |
| `out/test_audio.mp3` | Clearly Obsolete | Ad-hoc TTS test output in `out/`. | Low | `public/audio/...` | **Safe to delete now** |
| `out/test_rizalt.mp3` | Clearly Obsolete | Ad-hoc Hindi phonetic test audio file. | Low | `src/domain/hindi/` / Edge-TTS | **Safe to delete now** |
| `out/test_history_timeline.png` | Clearly Obsolete | Historical preview frame screenshot. | Low | `src/templates/HistoryTimeline.tsx` | **Safe to delete now** |
| `out/test_physics_kinematics.png` | Clearly Obsolete | Historical preview frame screenshot. | Low | `reports/qa/fixtures/` | **Safe to delete now** |
| `out/test_quiz_cue.png` | Clearly Obsolete | Ad-hoc quiz cue preview screenshot. | Low | `src/templates/QuizCueCard.tsx` | **Safe to delete now** |
| `out/qa_physics_still.png` | Clearly Obsolete | QA visual regression test still. | Low | `reports/qa/fixtures/` | **Safe to delete now** |
| `src/data/chapters/ch01_part1/` | Clearly Obsolete | Empty legacy root chapter directory deprecated by `AGENTS.md`. | Low | `src/data/chapters/hull_derivatives/ch01_part1/` | **Safe to delete now** |
| `scripts/test_argon_ch16.mjs` | Clearly Obsolete | 781-byte obsolete one-off proxy connectivity snippet. | Low | `src/orchestrator/executionRouter.mjs` | **Safe to delete now** |
| `out/chapters/hull_derivatives_micro_kernel/frame_scene*.png` | Generated / Temporary | 6 intermediate frame previews from microkernel experiment. | Low | Re-renderable via Remotion | **Safe to delete now** |
| `out/chapters/hull_derivatives_micro_kernel/test_frame.png` | Generated / Temporary | Single debug frame screenshot. | Low | None | **Safe to delete now** |
| `scripts/generate_micro_kernel_experiment.mjs` | Deprecated Architecture | Prototype script used during microkernel research. Superseded by orchestrator. | Med | `src/orchestrator/scaffoldingEngine.mjs` | **Controlled cleanup (Archive / User approval)** |
| `scripts/migrate_remove_argon.mjs` | Deprecated Architecture | One-time migration script for removing legacy Argon naming. | Med | Completed migration | **Controlled cleanup (Archive / User approval)** |
| `scripts/reorganize_by_book.mjs` | Deprecated Architecture | One-time directory migration script. | Med | Completed migration | **Controlled cleanup (Archive / User approval)** |
| `scripts/migrate_phase1_artifacts.mjs` | Deprecated Architecture | One-time Phase 1 schema migration script. | Med | Completed migration | **Controlled cleanup (Archive / User approval)** |
| `scripts/generate_phase1_report.mjs` | Deprecated Architecture | Phase 1 milestone audit report generator. | Med | `scripts/validate_lesson_architecture.mjs` | **Controlled cleanup (Archive / User approval)** |
| `scripts/verify_phase2a.mjs` | Deprecated Architecture | Milestone 2A verification script. | Med | `scripts/run_qa.mjs` | **Controlled cleanup (Archive / User approval)** |
| `scripts/verify_phase2b.mjs` | Deprecated Architecture | Milestone 2B verification script. | Med | `scripts/run_qa.mjs` | **Controlled cleanup (Archive / User approval)** |
| `scripts/generate_episode_argon.mjs` | Deprecated Architecture | Monolithic single-prompt generator superseded by microkernel scaffolding. | High | `scripts/generate_video.mjs` | **Controlled cleanup (Archive / User approval)** |
| `src/courses/hull_derivatives_flash_comparison.json` | Deprecated Architecture | Temporary course config for benchmark comparison. | Med | `src/courses/hull_derivatives.json` | **Controlled cleanup (Archive / User approval)** |
| `src/courses/hull_derivatives_micro_kernel.json` | Deprecated Architecture | Temporary course config for microkernel comparison. | Med | `src/courses/hull_derivatives.json` | **Controlled cleanup (Archive / User approval)** |
| `src/data/chapters/hull_derivatives_flash_comparison/` | Deprecated Architecture | Completed experimental chapter dataset. | Med | `hull_derivatives/ch01_part1` | **Controlled cleanup (Archive / User approval)** |
| `src/data/chapters/hull_derivatives_micro_kernel/` | Deprecated Architecture | Completed experimental chapter dataset. | Med | `hull_derivatives/ch01_part1` | **Controlled cleanup (Archive / User approval)** |
| `scripts/build_ch*.mjs` & `scripts/generate_ch*.mjs` | Uncertain / Needs Review | 25 chapter-specific builders. Contains specific facts/scenes for chapters ch02-ch08. | High | `src/data/chapters/` | **Retain permanently (Active generator code)** |
| `src/data/chapters/hull_derivatives/ch01_part1_baseline_backup/` | Essential | Preserved original baseline for Hull ch01_part1. | High | N/A | **Retain permanently (Protected baseline)** |
| `CLAUDE.md` | Uncertain / Needs Review | Assistant instructions file. May be used by other tools. | Low | `AGENTS.md` | **Retain permanently / User decision** |
| `product.md` | Uncertain / Needs Review | Project specification document. | Low | Documentation | **Retain permanently** |

---

## 3. Action Phasing

### Phase 2A: Safe Cleanup (To be executed immediately)
1. Delete empty directory: `src/data/chapters/ch01_part1/`
2. Delete root temporary files: `.backtest-man`, `.backtest-man~`, `test_ch01_part2_formula.png`
3. Delete ad-hoc audio and image scratch files in `out/`:
   - `out/test_audio.mp3`
   - `out/test_rizalt.mp3`
   - `out/test_history_timeline.png`
   - `out/test_physics_kinematics.png`
   - `out/test_quiz_cue.png`
   - `out/qa_physics_still.png`
   - `out/chapters/hull_derivatives_micro_kernel/frame_scene*.png`
   - `out/chapters/hull_derivatives_micro_kernel/test_frame.png`
4. Delete obsolete ad-hoc test script:
   - `scripts/test_argon_ch16.mjs`

### Phase 2B: Controlled Cleanup (Approved and Executed)
The user confirmed the deletion of all experimental chapters and superseded scripts on 2026-11-08:
1. Historical one-time migration scripts deleted:
   - `scripts/migrate_remove_argon.mjs`
   - `scripts/reorganize_by_book.mjs`
   - `scripts/migrate_phase1_artifacts.mjs`
   - `scripts/generate_phase1_report.mjs`
   - `scripts/verify_phase2a.mjs`
   - `scripts/verify_phase2b.mjs`
   - `scripts/generate_micro_kernel_experiment.mjs`
   - `scripts/generate_episode_argon.mjs`
2. Experimental course workspaces, audio, video, QA reports, and course configs deleted:
   - `src/data/chapters/hull_derivatives_flash_comparison/`
   - `src/data/chapters/hull_derivatives_micro_kernel/`
   - `src/courses/hull_derivatives_flash_comparison.json`
   - `src/courses/hull_derivatives_micro_kernel.json`
   - `reports/qa/hull_derivatives_flash_comparison/`
   - `reports/qa/hull_derivatives_micro_kernel/`
   - `out/chapters/hull_derivatives_flash_comparison/`
   - `out/chapters/hull_derivatives_micro_kernel/`
   - `public/audio/hull_derivatives_flash_comparison/`
   - `public/audio/hull_derivatives_micro_kernel/`

