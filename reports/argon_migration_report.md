# Model-Neutral Architecture & Argon Migration Report

**Generated:** 2026-11-02T20:15:16.813Z  
**Total Chapters Migrated:** 36  
**Total Audio Files Relocated:** 1341  
**Total Episode Compiled Beats Updated:** 1368  
**Total Videos Relocated:** 2  

---

## 1. Executive Summary

This migration completes the transition from model-dependent naming (`_argon`, `hull_ch*`) to permanent, stable, model-neutral paths across all books and chapters:

- **Workspace Data Directory:** `src/data/chapters/<course_id>/<chapter_id>/`
- **Audio Assets Directory:** `public/audio/<course_id>/<chapter_id>/`
- **Mirrored Audio Directory:** `src/data/chapters/<course_id>/<chapter_id>/audio/`
- **Output Video Target:** `out/chapters/<course_id>/<chapter_id>.mp4`
- **QA Reports Directory:** `reports/qa/<course_id>/<chapter_id>/qa_report.json|html`

No production data is written to shared root files (`src/data/episode_raw.json`, `public/audio/`, `out/<chapter>.mp4`), which are strictly fixtures or preview scratches.

---

## 2. Chapter Migration Ledger

| Course ID | Old Directory | Model-Neutral Chapter ID | Audio Assets | Video Present | QA Report Dir |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `murphy_technical_analysis` | `appendix_ab_argon` | `appendix_ab` | 40 files | ✅ Yes | `reports/qa/murphy_technical_analysis/appendix_ab` |
| `murphy_technical_analysis` | `appendix_cd_argon` | `appendix_cd` | 35 files | ✅ Yes | `reports/qa/murphy_technical_analysis/appendix_cd` |
| `murphy_technical_analysis` | `ch01_part1_argon` | `ch01_part1` | 0 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch01_part1` |
| `murphy_technical_analysis` | `ch01_part2_argon` | `ch01_part2` | 43 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch01_part2` |
| `murphy_technical_analysis` | `ch02_part1_argon` | `ch02_part1` | 36 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch02_part1` |
| `murphy_technical_analysis` | `ch02_part2_argon` | `ch02_part2` | 36 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch02_part2` |
| `murphy_technical_analysis` | `ch03_part1_argon` | `ch03_part1` | 37 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch03_part1` |
| `murphy_technical_analysis` | `ch04_part1_argon` | `ch04_part1` | 38 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch04_part1` |
| `murphy_technical_analysis` | `ch04_part2_argon` | `ch04_part2` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch04_part2` |
| `murphy_technical_analysis` | `ch04_part3_argon` | `ch04_part3` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch04_part3` |
| `murphy_technical_analysis` | `ch05_part1_argon` | `ch05_part1` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch05_part1` |
| `murphy_technical_analysis` | `ch05_part2_argon` | `ch05_part2` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch05_part2` |
| `murphy_technical_analysis` | `ch06_part1_argon` | `ch06_part1` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch06_part1` |
| `murphy_technical_analysis` | `ch06_part2_argon` | `ch06_part2` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch06_part2` |
| `murphy_technical_analysis` | `ch07_part1_argon` | `ch07_part1` | 35 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch07_part1` |
| `murphy_technical_analysis` | `ch07_part2_argon` | `ch07_part2` | 35 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch07_part2` |
| `murphy_technical_analysis` | `ch08_part1_argon` | `ch08_part1` | 37 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch08_part1` |
| `murphy_technical_analysis` | `ch09_part1_argon` | `ch09_part1` | 34 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch09_part1` |
| `murphy_technical_analysis` | `ch09_part2_argon` | `ch09_part2` | 35 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch09_part2` |
| `murphy_technical_analysis` | `ch10_part1_argon` | `ch10_part1` | 37 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch10_part1` |
| `murphy_technical_analysis` | `ch10_part2_argon` | `ch10_part2` | 35 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch10_part2` |
| `murphy_technical_analysis` | `ch11_part1_argon` | `ch11_part1` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch11_part1` |
| `murphy_technical_analysis` | `ch12_part1_argon` | `ch12_part1` | 40 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch12_part1` |
| `murphy_technical_analysis` | `ch13_part1_argon` | `ch13_part1` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch13_part1` |
| `murphy_technical_analysis` | `ch13_part2_argon` | `ch13_part2` | 37 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch13_part2` |
| `murphy_technical_analysis` | `ch14_part1_argon` | `ch14_part1` | 40 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch14_part1` |
| `murphy_technical_analysis` | `ch15_part1_argon` | `ch15_part1` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch15_part1` |
| `murphy_technical_analysis` | `ch16_part1_argon` | `ch16_part1` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch16_part1` |
| `murphy_technical_analysis` | `ch16_part2_argon` | `ch16_part2` | 39 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch16_part2` |
| `murphy_technical_analysis` | `ch17_part1_argon` | `ch17_part1` | 38 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch17_part1` |
| `murphy_technical_analysis` | `ch17_part2_argon` | `ch17_part2` | 40 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch17_part2` |
| `murphy_technical_analysis` | `ch18_part1_argon` | `ch18_part1` | 40 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch18_part1` |
| `murphy_technical_analysis` | `ch19_part1_argon` | `ch19_part1` | 40 files | ✅ Yes | `reports/qa/murphy_technical_analysis/ch19_part1` |
| `murphy_technical_analysis` | `test_run` | `test_run` | 42 files | ⏳ Pending | `reports/qa/murphy_technical_analysis/test_run` |
| `hull_derivatives` | `hull_ch01_part1_argon` | `ch01_part1` | 41 files | ✅ Yes | `reports/qa/hull_derivatives/ch01_part1` |
| `hull_derivatives` | `hull_ch01_part2_argon` | `ch01_part2` | 41 files | ✅ Yes | `reports/qa/hull_derivatives/ch01_part2` |

---

## 3. Provenance and Zero Data Loss Verification

1. **Phase 1 Artifacts Preserved:**
   Every migrated chapter maintains all 4 required Phase 1 artifacts (`source_facts.json`, `content_audit.json`, `lesson_plan.json`, `storyboard.json`).
2. **Audio File Linkage:**
   Every beat in `episode_compiled.json` was updated to point directly to `audio/<course_id>/<chapter_id>/<file>.mp3` matching Remotion's `staticFile` resolver.
3. **No Legacy Exemptions:**
   All 36 chapters across John Murphy Technical Analysis (34 chapters) and John C. Hull Options & Futures (2 chapters) have been fully migrated and verified.
