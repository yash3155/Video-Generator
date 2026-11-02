// src/utils/chapterPaths.mjs
import fs from 'node:fs';
import path from 'node:path';

/**
 * Determines the book folder slug for a given chapter key/slug or metadata.
 * Defaults to 'murphy_technical_analysis' for non-hull chapters and 'hull_derivatives' for hull chapters.
 */
export function getBookSlug(chapterSlug, meta = {}) {
  const courseStr = String(meta.course || meta.book || '').toLowerCase();
  const slugStr = String(chapterSlug || '').toLowerCase();

  if (courseStr.includes('hull') || slugStr.startsWith('hull_') || slugStr.includes('hull')) {
    return 'hull_derivatives';
  }
  if (courseStr.includes('murphy') || slugStr.startsWith('ch') || slugStr.startsWith('appendix') || slugStr.includes('test_run')) {
    return 'murphy_technical_analysis';
  }
  if (courseStr.includes('mechanic') || slugStr.includes('physic')) {
    return 'classical_mechanics';
  }
  if (courseStr.includes('history') || slugStr.includes('history')) {
    return 'world_history';
  }

  return 'murphy_technical_analysis';
}

/**
 * Recursively scans chaptersRoot and returns all leaf directories that contain episode_raw.json.
 */
export function getAllChapterDirectories(chaptersRoot = path.join(process.cwd(), 'src', 'data', 'chapters')) {
  if (!fs.existsSync(chaptersRoot)) return [];
  const results = [];

  const topDirs = fs
    .readdirSync(chaptersRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const name of topDirs) {
    const full = path.join(chaptersRoot, name);
    const raw = path.join(full, 'episode_raw.json');

    if (fs.existsSync(raw)) {
      results.push(full);
    } else {
      // Subdirectory is a book directory (e.g. murphy_technical_analysis or hull_derivatives)
      try {
        const subDirs = fs
          .readdirSync(full, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name)
          .sort();

        for (const sub of subDirs) {
          const subFull = path.join(full, sub);
          if (fs.existsSync(path.join(subFull, 'episode_raw.json'))) {
            results.push(subFull);
          }
        }
      } catch {}
    }
  }

  return results;
}

/**
 * Resolves a chapter directory given a slug, key, relative path, or absolute path.
 * Searches:
 * 1. Exact existing path
 * 2. chaptersRoot/<book>/<slug>
 * 3. chaptersRoot/<slug>
 * 4. Case-insensitive search across all book directories
 */
export function resolveChapterDirectory(targetSlugOrPath, rootDir = process.cwd()) {
  if (!targetSlugOrPath) return null;

  // 1. Direct path check
  const resolved = path.isAbsolute(targetSlugOrPath)
    ? targetSlugOrPath
    : path.resolve(rootDir, targetSlugOrPath);

  if (fs.existsSync(resolved)) {
    if (fs.statSync(resolved).isFile()) {
      return path.dirname(resolved);
    }
    if (fs.existsSync(path.join(resolved, 'episode_raw.json'))) {
      return resolved;
    }
  }

  const cleanSlug = path.basename(targetSlugOrPath).replace(/\.json$/i, '');
  const chaptersRoot = path.join(rootDir, 'src', 'data', 'chapters');

  if (!fs.existsSync(chaptersRoot)) return null;

  const candidateSlugs = [
    cleanSlug,
    `${cleanSlug}_argon`,
    cleanSlug.replace(/_argon$/i, ''),
  ];

  const bookSlug = getBookSlug(cleanSlug);
  const possibleBooks = [bookSlug, 'murphy_technical_analysis', 'hull_derivatives'];

  // Check in specific book directories first
  for (const book of possibleBooks) {
    for (const c of candidateSlugs) {
      const p = path.join(chaptersRoot, book, c);
      if (fs.existsSync(p) && fs.existsSync(path.join(p, 'episode_raw.json'))) {
        return p;
      }
    }
  }

  // Check top-level chaptersRoot
  for (const c of candidateSlugs) {
    const p = path.join(chaptersRoot, c);
    if (fs.existsSync(p) && fs.existsSync(path.join(p, 'episode_raw.json'))) {
      return p;
    }
  }

  // Deep search across all subdirectories
  const allDirs = getAllChapterDirectories(chaptersRoot);
  const match = allDirs.find((d) => {
    const bName = path.basename(d);
    return candidateSlugs.includes(bName);
  });

  return match || null;
}

/**
 * Resolves the path to an output MP4 video file.
 */
export function resolveOutputVideoPath(videoKey, rootDir = process.cwd()) {
  const cleanKey = path.basename(videoKey).replace(/\.mp4$/i, '').replace(/_argon$/i, '');
  const outDir = path.join(rootDir, 'out');
  const bookSlug = getBookSlug(cleanKey);

  const candidatePaths = [
    path.join(outDir, 'chapters', bookSlug, `${cleanKey}.mp4`),
    path.join(outDir, bookSlug, `${cleanKey}.mp4`),
    path.join(outDir, 'chapters', `${cleanKey}.mp4`),
    path.join(outDir, `${cleanKey}.mp4`),
    path.join(outDir, 'videos', bookSlug, `${cleanKey}.mp4`),
  ];

  return candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];
}
