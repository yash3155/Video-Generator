// scripts/verify_phase2a.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CourseConfigSchema } from '../src/schemas/courseConfigSchema.mjs';
import { VisualSpecSchema } from '../src/schemas/visualSpecSchema.mjs';
import { validateEpisodeData } from './validate_episode.mjs';
import { resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log(`\n======================================================`);
console.log(`🧪 VERIFYING PHASE 2A: GENERIC VISUAL ENGINE & CONFIGS`);
console.log(`======================================================\n`);

// 1. Verify Course Configurations
const coursesDir = path.join(rootDir, 'src', 'courses');
const courseFiles = fs.readdirSync(coursesDir).filter((f) => f.endsWith('.json'));

console.log(`📚 [1/3] Validating Course Configurations (${courseFiles.length} found)...`);
let courseErrors = 0;
courseFiles.forEach((file) => {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(coursesDir, file), 'utf8'));
    const parsed = CourseConfigSchema.parse(raw);
    console.log(`  -> ✅ ${file}: Valid CourseConfig (${parsed.courseId}, subject: ${parsed.subject})`);
  } catch (err) {
    console.error(`  -> ❌ ${file}:`, err.message);
    courseErrors++;
  }
});

// 2. Verify Structured Fixtures
const fixturesDir = path.join(rootDir, 'src', 'data', 'fixtures');
const fixtureFiles = fs.readdirSync(fixturesDir).filter((f) => f.endsWith('.json'));

console.log(`\n🎨 [2/3] Validating Generic Visual Fixtures (${fixtureFiles.length} found)...`);
let fixtureErrors = 0;
fixtureFiles.forEach((file) => {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(fixturesDir, file), 'utf8'));
    // Validate each beat's visual spec
    (raw.scenes || []).forEach((scene, sIdx) => {
      (scene.beats || []).forEach((beat, bIdx) => {
        if (beat.visual) {
          VisualSpecSchema.parse(beat.visual);
        }
      });
    });

    // Validate episode
    const result = validateEpisodeData(raw);
    if (result.valid) {
      console.log(`  -> ✅ ${file}: Valid generic episode (domain: ${raw.meta?.domain}, totalScenes: ${raw.scenes?.length})`);
    } else {
      console.warn(`  -> ⚠️ ${file} warnings/errors:`, result.errors);
      fixtureErrors++;
    }
  } catch (err) {
    console.error(`  -> ❌ ${file}:`, err.message);
    fixtureErrors++;
  }
});

// 3. Verify Backward Compatibility on an existing Argon chapter
console.log(`\n🔄 [3/3] Validating Backward Compatibility with existing chapters...`);
const ch02Dir = resolveChapterDirectory('ch02_part1_argon', rootDir);
const ch02Raw = JSON.parse(
  fs.readFileSync(path.join(ch02Dir, 'episode_raw.json'), 'utf8')
);
const legacyResult = validateEpisodeData(ch02Raw);
if (legacyResult.valid) {
  console.log(`  -> ✅ ch02_part1_argon: 100% backward compatible (0 errors)`);
} else {
  console.error(`  -> ❌ ch02_part1_argon errors:`, legacyResult.errors);
}

console.log(`\n======================================================`);
console.log(`📊 PHASE 2A VERIFICATION SUMMARY:`);
console.log(`   Course Configs Checked: ${courseFiles.length} (Errors: ${courseErrors})`);
console.log(`   Generic Fixtures Checked: ${fixtureFiles.length} (Errors: ${fixtureErrors})`);
console.log(`   Legacy Compatibility: ${legacyResult.valid ? 'PASSED' : 'FAILED'}`);
console.log(`======================================================\n`);
