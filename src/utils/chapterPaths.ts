// src/utils/chapterPaths.ts
// @ts-expect-error mjs import without declaration
import * as mjsUtils from './chapterPaths.mjs';

export const getBookSlug: (chapterSlug?: string, meta?: any) => string =
  mjsUtils.getBookSlug;

export const getAllChapterDirectories: (chaptersRoot?: string) => string[] =
  mjsUtils.getAllChapterDirectories;

export const resolveChapterDirectory: (
  targetSlugOrPath?: string,
  rootDir?: string
) => string | null = mjsUtils.resolveChapterDirectory;

export const resolveOutputVideoPath: (
  videoKey: string,
  rootDir?: string
) => string = mjsUtils.resolveOutputVideoPath;
