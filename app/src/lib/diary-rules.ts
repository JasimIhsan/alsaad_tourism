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

export type DiaryErrorCode = "required" | "rating" | "storyLength" | "fileCount" | "fileType" | "fileSize" | "consent";
export type DiaryField = "name" | "trip" | "language" | "rating" | "story" | "photos" | "consent";
export type DiaryFieldErrors = Partial<Record<DiaryField, DiaryErrorCode>>;

/**
 * Text-field rules, run in the browser before photos upload (so a typo doesn't
 * cost a re-upload) and again in the Server Action, which is the real check.
 */
export function validateDiary(formData: FormData): DiaryFieldErrors {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  const rating = Number(text("rating"));
  const story = text("story");

  const errors: DiaryFieldErrors = {};
  if (!text("name")) errors.name = "required";
  if (!text("trip")) errors.trip = "required";
  if (!isDiaryLanguage(text("language"))) errors.language = "required";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "rating";
  if (!story) errors.story = "required";
  else if (story.length < STORY_MIN_LENGTH) errors.story = "storyLength";
  if (formData.get("consent") !== "on") errors.consent = "consent";
  return errors;
}
