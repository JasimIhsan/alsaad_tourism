"use server";

import { isDiaryLanguage, STORY_MIN_LENGTH } from "./diary-rules";

export type DiaryErrorCode =
  | "required"
  | "rating"
  | "storyLength"
  | "photoCount"
  | "photoType"
  | "photoSize"
  | "consent";
export type DiaryField = "name" | "trip" | "language" | "rating" | "story" | "photos" | "consent";

export type DiaryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; fieldErrors: Partial<Record<DiaryField, DiaryErrorCode>> }
  | { status: "failed" };

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates a Traveler Diaries submission. Returns error *codes*; the form maps
 * them to dictionary strings so no user-facing text lives here.
 * Photos are validated in the browser and not sent with this action: Vercel caps
 * request bodies at 4.5 MB (S4.4 technical note).
 * TODO(epic-4): append a "Diaries" row to Google Sheets (story as Markdown-ready
 * plain text), upload photos straight to Drive with resumable URLs, and email the team.
 */
export async function submitDiary(_prev: DiaryState, formData: FormData): Promise<DiaryState> {
  // Honeypot: real users never fill this hidden field.
  if (field(formData, "company")) return { status: "success" };

  const name = field(formData, "name");
  const trip = field(formData, "trip");
  const language = field(formData, "language");
  const rating = Number(field(formData, "rating"));
  const story = field(formData, "story");
  const consent = formData.get("consent") === "on";

  const fieldErrors: Partial<Record<DiaryField, DiaryErrorCode>> = {};
  if (!name) fieldErrors.name = "required";
  if (!trip) fieldErrors.trip = "required";
  if (!isDiaryLanguage(language)) fieldErrors.language = "required";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) fieldErrors.rating = "rating";
  if (!story) fieldErrors.story = "required";
  else if (story.length < STORY_MIN_LENGTH) fieldErrors.story = "storyLength";
  if (!consent) fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  return { status: "success" };
}
