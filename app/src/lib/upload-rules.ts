/** File rules shared by the browser (instant feedback) and the server (enforcement). */

import { MAX_PHOTOS, PHOTO_MAX_MB, PHOTO_TYPES } from "./diary-rules";

export const uploadKinds = ["passport", "visaPhoto", "diaryPhoto"] as const;
export type UploadKind = (typeof uploadKinds)[number];

export type UploadRule = { types: readonly string[]; maxMb: number; maxFiles: number };

export const uploadRules: Record<UploadKind, UploadRule> = {
  passport: { types: ["image/jpeg", "image/png", "application/pdf"], maxMb: 10, maxFiles: 1 },
  visaPhoto: { types: ["image/jpeg", "image/png"], maxMb: 10, maxFiles: 1 },
  diaryPhoto: { types: PHOTO_TYPES, maxMb: PHOTO_MAX_MB, maxFiles: MAX_PHOTOS },
};

export type FileErrorCode = "fileCount" | "fileType" | "fileSize";

export type FileMeta = { name: string; type: string; size: number };

export function checkFiles(kind: UploadKind, files: FileMeta[]): FileErrorCode | undefined {
  const rule = uploadRules[kind];
  if (files.length > rule.maxFiles) return "fileCount";
  if (files.some((file) => !rule.types.includes(file.type))) return "fileType";
  if (files.some((file) => file.size <= 0 || file.size > rule.maxMb * 1024 * 1024)) return "fileSize";
  return undefined;
}

export function isUploadKind(value: unknown): value is UploadKind {
  return typeof value === "string" && (uploadKinds as readonly string[]).includes(value);
}
