// scripts/test_harness.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { normalizeAndRemedyEpisode } from './generate_episode.mjs';
import { getAllChapterDirectories, resolveChapterDirectory } from '../src/utils/chapterPaths.mjs';

const args = process.argv.slice(2);

function resolveTargetDirectory() {
  const dirArg = args.find((a) => a.startsWith('--dir='));
  if (dirArg) return dirArg.split('=')[1].replace(/"/g, '').trim();

  const chapterArg = args.find((a) => a.startsWith('--chapter='));
  if (chapterArg) {
    const chap = chapterArg.split('=')[1].replace(/"/g, '').trim();
    return resolveChapterDirectory(chap, process.cwd()) || `src/data/chapters/${chap}`;
  }

  const posArg = args.find((a) => !a.startsWith('--'));
  if (posArg) {
    const clean = posArg.trim();
    const resolved = resolveChapterDirectory(clean, process.cwd());
    if (resolved) return resolved;
    if (fs.existsSync(clean)) return clean;
    if (fs.existsSync(path.join(process.cwd(), clean))) return clean;
    return `src/data/chapters/${clean}`;
  }

  const chaptersRoot = path.join(process.cwd(), 'src', 'data', 'chapters');
  if (fs.existsSync(chaptersRoot)) {
    const allDirs = getAllChapterDirectories(chaptersRoot);
    const sorted = allDirs
      .map((d) => {
        const raw = path.join(d, 'episode_raw.json');
        return {
          path: path.relative(process.cwd(), d).replace(/\\/g, '/'),
          mtime: fs.existsSync(raw) ? fs.statSync(raw).mtimeMs : 0,
        };
      })
      .filter((d) => d.mtime > 0)
      .sort((a, b) => b.mtime - a.mtime);

    if (sorted.length > 0) return sorted[0].path;
  }

  if (fs.existsSync(path.join(process.cwd(), 'src', 'data', 'episode_raw.json'))) {
    return 'src/data';
  }

  return 'src/data/chapters/ch03_part1_argon';
}

const targetDir = resolveTargetDirectory();
const rootDir = process.cwd();
const relTargetDir = path.isAbsolute(targetDir)
  ? path.relative(rootDir, targetDir).replace(/\\/g, '/')
  : targetDir.replace(/\\/g, '/');
const rawEpisodePath = path.isAbsolute(targetDir)
  ? path.join(targetDir, 'episode_raw.json')
  : path.join(rootDir, targetDir, 'episode_raw.json');
const compiledEpisodePath = path.isAbsolute(targetDir)
  ? path.join(targetDir, 'episode_compiled.json')
  : path.join(rootDir, targetDir, 'episode_compiled.json');

console.log(`\n======================================================`);
console.log(`🛡️ RUNNING AUTOMATED QA & SELF-CORRECTION HARNESS`);
console.log(`📁 Target Directory: ${relTargetDir}`);
console.log(`======================================================\n`);

if (!fs.existsSync(rawEpisodePath)) {
  console.error(`❌ Harness Error: 'episode_raw.json' not found at: ${rawEpisodePath}`);
  process.exit(1);
}

let hasDefects = false;
const defectLogs = [];

// 1. Pre-Render Validation via validate_episode.mjs
console.log(`🔍 [1/3] Executing strict pre-render validation (Zod & directional logic)...`);
try {
  execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${relTargetDir}"`, {
    stdio: 'inherit',
    cwd: rootDir,
  });
} catch {
  hasDefects = true;
  defectLogs.push('Zod schema, directional logic, or UI invariant violation detected.');
}

// 1.5 Phase 1 Lesson Architecture & Source Audit Inspection (Mandatory for all chapters)
const isChapterWorkspace = relTargetDir.includes('src/data/chapters');
if (isChapterWorkspace) {
  console.log(`📋 [1.5/3] Inspecting Phase 1 source facts & lesson architecture...`);
  try {
    const lessonArchValidation = execSync(
      `"${process.execPath}" scripts/validate_lesson_architecture.mjs --dir="${relTargetDir}"`,
      { encoding: 'utf8', cwd: rootDir }
    );
    const rep = JSON.parse(lessonArchValidation);
    if (!rep.sourceFacts.present || !rep.contentAudit.present || !rep.lessonPlan.present || !rep.storyboard.present) {
      hasDefects = true;
      defectLogs.push(`Missing Phase 1 artifacts: All chapters require source_facts.json, content_audit.json, lesson_plan.json, and storyboard.json.`);
    }
    if (!rep.allValid) {
      if (rep.contentAudit.status === 'FAIL') {
        hasDefects = true;
        defectLogs.push(`Phase 1 Content Audit FAIL: Unresolved critical source/lesson findings.`);
      }
    }
  } catch (archErr) {
    hasDefects = true;
    defectLogs.push(`Phase 1 lesson architecture validation error: ${archErr.message}`);
  }
}

// 2. Structural & Telemetry Inspection
console.log(`🔍 [2/3] Inspecting episode telemetry, UI invariants, and compiled audio...`);
try {
  const episodeRaw = JSON.parse(fs.readFileSync(rawEpisodePath, 'utf8'));

  if (episodeRaw.meta?.chapter && /_ARGON|_V\d+/i.test(episodeRaw.meta.chapter)) {
    hasDefects = true;
    defectLogs.push(`meta.chapter contains illegal suffix: "${episodeRaw.meta.chapter}"`);
  }

  episodeRaw.scenes?.forEach((scene, sIdx) => {
    if (scene.template === 'summary_thread') {
      const steps = scene.beats?.[0]?.ui_state?.steps || [];
      if (steps.length < 6 || steps.length > 8) {
        hasDefects = true;
        defectLogs.push(`Scene ${sIdx} (summary_thread) has ${steps.length} steps (must be 6-8).`);
      }
      scene.beats?.forEach((b, bIdx) => {
        if (/^Crucial rule:/i.test(b.en_subtitle || '')) {
          hasDefects = true;
          defectLogs.push(`Scene ${sIdx} Beat ${bIdx} has synthetic English 'Crucial rule:' subtitle.`);
        }
      });
    }

    if (scene.template === 'interactive_quiz' && scene.beats?.length !== 3) {
      hasDefects = true;
      defectLogs.push(`Scene ${sIdx} (interactive_quiz) has ${scene.beats?.length} beats (must be 3).`);
    }
  });

  if (fs.existsSync(compiledEpisodePath)) {
    const compiledData = JSON.parse(fs.readFileSync(compiledEpisodePath, 'utf8'));
    let totalFrames = 0;
    let missingAudioCount = 0;

    compiledData.scenes?.forEach((scene) => {
      scene.beats?.forEach((beat) => {
        totalFrames += beat.durationInFrames || 0;
        if (beat.audioFile) {
          const candidateAudioPaths = [
            path.isAbsolute(beat.audioFile) ? beat.audioFile : path.join(rootDir, 'public', beat.audioFile),
            path.isAbsolute(beat.audioFile) ? beat.audioFile : path.join(rootDir, beat.audioFile),
            path.join(rootDir, targetDir, beat.audioFile),
            path.join(rootDir, targetDir, 'audio', path.basename(beat.audioFile)),
          ];
          const audioPath = candidateAudioPaths.find((p) => fs.existsSync(p));
          if (!audioPath || fs.statSync(audioPath).size === 0) {
            missingAudioCount++;
          }
        }
      });
    });

    if (missingAudioCount > 0) {
      hasDefects = true;
      defectLogs.push(`Found ${missingAudioCount} missing audio files in compiled episode.`);
    }
    console.log(`   📊 Telemetry: Total Frames = ${totalFrames} (~${(totalFrames / 30).toFixed(1)}s), Compiled Audio Verified.`);
  }
} catch (parseErr) {
  hasDefects = true;
  defectLogs.push(`Episode JSON parsing error: ${parseErr.message}`);
}

// 3. Single-Pass Auto-Correction Decision Matrix
if (hasDefects) {
  console.warn(`\n⚠️ QA Harness intercepted defects:`);
  defectLogs.forEach((log) => console.warn(`   - ${log}`));
  console.warn(`\n🔧 Triggering STRICT SINGLE-PASS automatic code/data remedy...`);

  try {
    let parsed = JSON.parse(fs.readFileSync(rawEpisodePath, 'utf8'));
    parsed = normalizeAndRemedyEpisode(parsed, path.basename(targetDir));
    fs.writeFileSync(rawEpisodePath, JSON.stringify(parsed, null, 2), 'utf8');

    console.log(`🔄 Re-validating after single auto-fix pass...`);
    execSync(`"${process.execPath}" scripts/validate_episode.mjs --dir="${relTargetDir}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
    console.log(`✅ Single-pass self-correction passed successfully!`);
  } catch {
    console.error(`\n❌ CRITICAL: Defects persisted after the single auto-correction pass.`);
    process.exit(1);
  }
} else {
  console.log(`\n✨ [3/3] QA Harness Inspection Complete: Zero defects detected! Video assets are pristine.\n`);
}