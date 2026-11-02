// scripts/validate_lesson_architecture.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SourceFactsSchema,
  ContentAuditSchema,
  LessonPlanSchema,
  StoryboardSchema,
} from '../src/schemas/sourceLessonSchemas.mjs';
import { getAllChapterDirectories, resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function validateChapterLessonArchitecture(chapterDir) {
  const dirPath = path.isAbsolute(chapterDir) ? chapterDir : path.resolve(rootDir, chapterDir);
  const chapterSlug = path.basename(dirPath);

  const results = {
    chapterSlug,
    sourceFacts: { present: false, valid: false, errors: [] },
    contentAudit: { present: false, valid: false, status: null, errors: [] },
    lessonPlan: { present: false, valid: false, errors: [] },
    storyboard: { present: false, valid: false, errors: [] },
    allValid: false,
  };

  // 1. source_facts.json
  const factsPath = path.join(dirPath, 'source_facts.json');
  if (fs.existsSync(factsPath)) {
    results.sourceFacts.present = true;
    try {
      const raw = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
      const parsed = SourceFactsSchema.safeParse(raw);
      if (parsed.success) {
        results.sourceFacts.valid = true;
      } else {
        results.sourceFacts.errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      }
    } catch (err) {
      results.sourceFacts.errors = [err.message];
    }
  }

  // 2. content_audit.json
  const auditPath = path.join(dirPath, 'content_audit.json');
  if (fs.existsSync(auditPath)) {
    results.contentAudit.present = true;
    try {
      const raw = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
      const parsed = ContentAuditSchema.safeParse(raw);
      if (parsed.success) {
        results.contentAudit.valid = true;
        results.contentAudit.status = parsed.data.status;
      } else {
        results.contentAudit.errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      }
    } catch (err) {
      results.contentAudit.errors = [err.message];
    }
  }

  // 3. lesson_plan.json
  const lessonPath = path.join(dirPath, 'lesson_plan.json');
  if (fs.existsSync(lessonPath)) {
    results.lessonPlan.present = true;
    try {
      const raw = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
      const parsed = LessonPlanSchema.safeParse(raw);
      if (parsed.success) {
        results.lessonPlan.valid = true;
      } else {
        results.lessonPlan.errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      }
    } catch (err) {
      results.lessonPlan.errors = [err.message];
    }
  }

  // 4. storyboard.json
  const storyboardPath = path.join(dirPath, 'storyboard.json');
  if (fs.existsSync(storyboardPath)) {
    results.storyboard.present = true;
    try {
      const raw = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
      const parsed = StoryboardSchema.safeParse(raw);
      if (parsed.success) {
        results.storyboard.valid = true;
      } else {
        results.storyboard.errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      }
    } catch (err) {
      results.storyboard.errors = [err.message];
    }
  }

  results.allValid =
    results.sourceFacts.valid &&
    results.contentAudit.valid &&
    results.contentAudit.status !== 'FAIL' &&
    results.lessonPlan.valid &&
    results.storyboard.valid;

  return results;
}

export function validateAllExistingChapters() {
  const chaptersRoot = path.join(rootDir, 'src', 'data', 'chapters');
  if (!fs.existsSync(chaptersRoot)) {
    console.error(`Chapters root not found: ${chaptersRoot}`);
    return [];
  }

  const chapterDirs = getAllChapterDirectories(chaptersRoot);

  const allReports = [];
  console.log(`\n======================================================`);
  console.log(`🔎 VALIDATING LESSON ARCHITECTURE ACROSS ALL CHAPTERS`);
  console.log(`   Found ${chapterDirs.length} chapter directories across books`);
  console.log(`======================================================\n`);

  let passingCount = 0;
  let missingArtifactsCount = 0;
  let schemaErrorsCount = 0;

  for (const chapDir of chapterDirs) {
    const slug = path.basename(chapDir);
    const rep = validateChapterLessonArchitecture(chapDir);
    allReports.push(rep);

    const fStatus = rep.sourceFacts.present ? (rep.sourceFacts.valid ? '✅' : '❌') : '⚪';
    const aStatus = rep.contentAudit.present
      ? rep.contentAudit.valid
        ? rep.contentAudit.status === 'PASS'
          ? '✅'
          : rep.contentAudit.status === 'CONDITIONAL_PASS'
            ? '⚠️'
            : '❌'
        : '❌'
      : '⚪';
    const lStatus = rep.lessonPlan.present ? (rep.lessonPlan.valid ? '✅' : '❌') : '⚪';
    const sStatus = rep.storyboard.present ? (rep.storyboard.valid ? '✅' : '❌') : '⚪';

    const overall = rep.allValid ? '✅ PASS' : rep.sourceFacts.present ? '⚠️ PARTIAL' : '⚪ LEGACY (NO PHASE 1 ARTIFACTS)';

    if (rep.allValid) passingCount++;
    else if (!rep.sourceFacts.present) missingArtifactsCount++;
    else schemaErrorsCount++;

    console.log(
      `  [${slug.padEnd(24)}] Facts:${fStatus} | Audit:${aStatus} | Lesson:${lStatus} | Storyboard:${sStatus} -> ${overall}`
    );
  }

  console.log(`\n======================================================`);
  console.log(`📊 HONEST SUMMARY REPORT:`);
  console.log(`   Total Chapters Scanned: ${chapterDirs.length}`);
  console.log(`   Phase 1 Fully Validated: ${passingCount}`);
  console.log(`   Legacy Chapters (Missing Phase 1 Artifacts): ${missingArtifactsCount}`);
  console.log(`   Chapters with Schema Errors/Unresolved Audits: ${schemaErrorsCount}`);
  console.log(`======================================================\n`);

  return allReports;
}

// CLI Execution
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const dirArg = process.argv.find((a) => a.startsWith('--dir='));
  const chapterArg = process.argv.find((a) => a.startsWith('--chapter='));
  const runAll = process.argv.includes('--all') || (!dirArg && !chapterArg);

  if (runAll) {
    validateAllExistingChapters();
  } else {
    const rawTarget = dirArg
      ? dirArg.split('=')[1]
      : chapterArg.split('=')[1];
    const target = resolveChapterDirectory(rawTarget, rootDir) || rawTarget;
    const result = validateChapterLessonArchitecture(target);
    console.log(JSON.stringify(result, null, 2));
  }
}

