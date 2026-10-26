/** Validation limits shared by the story submission form and its Server Action. */

/** Languages a story may be written in (BRD 2.1). */
export const diaryLanguages = ["en", "ar", "ml", "hi", "ur"] as const;
export type DiaryLanguage = (typeof diaryLanguages)[number];

export const STORY_MIN_LENGTH = 300;
export const MAX_PHOTOS = 5;
export const PHOTO_MAX_MB = 5;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function isDiaryLanguage(value: unknown): value is DiaryLanguage {
  return typeof value === "string" && (diaryLanguages as readonly string[]).includes(value);
}
