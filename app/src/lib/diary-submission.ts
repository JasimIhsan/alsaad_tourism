"use server";

import { validateDiary, type DiaryFieldErrors } from "./diary-rules";
import { contextColumns, field, fileIds, recordLead, resolveUploads, screen } from "./leads/record";

export type DiaryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; fieldErrors: DiaryFieldErrors }
  | { status: "limited" }
  | { status: "failed" };

/** Frontmatter skeleton plus the story, ready to paste into content/diaries/<slug>.md. */
function markdownDraft(values: { name: string; language: string; rating: number; story: string; photos: string[] }) {
  const today = new Date().toISOString().slice(0, 10);
  return [
    "---",
    'title: ""',
    "slug: ",
    `author: ${JSON.stringify(values.name)}`,
    `lang: ${values.language}`,
    `date: ${today}`,
    `rating: ${values.rating}`,
    "tags: []",
    "service: ",
    "cover:",
    "  src: ",
    '  alt: ""',
    "images: []",
    'excerpt: ""',
    'destination: ""',
    "days: ",
    'travelMonth: ""',
    'travellers: ""',
    "itinerary: []",
    "---",
    "",
    values.story,
    ...(values.photos.length > 0 ? ["", "<!-- Photos (download to /public and add above):", ...values.photos, "-->"] : []),
  ].join("\n");
}

/**
 * Validates a Traveler Diaries submission and records it in the "Diaries" tab
 * (S3.2 / S4.4). Photos were uploaded straight to Drive by the browser; only
 * their IDs arrive here and are verified before being linked.
 */
export async function submitDiary(_prev: DiaryState, formData: FormData): Promise<DiaryState> {
  const screening = await screen(formData, "diary");
  if (screening === "spam") return { status: "success" };
  if (screening === "limited") return { status: "limited" };

  const fieldErrors = validateDiary(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const name = field(formData, "name");
  const trip = field(formData, "trip");
  const language = field(formData, "language");
  const rating = Number(field(formData, "rating"));
  const story = field(formData, "story");

  let photos: string[];
  try {
    photos = await resolveUploads("diaryPhoto", fileIds(formData, "photoIds"));
  } catch (error) {
    console.error("[diaries] Photo verification failed", error);
    return { status: "failed" };
  }

  const saved = await recordLead({
    tab: "Diaries",
    form: "Traveler Diaries",
    name,
    columns: {
      ...contextColumns(formData),
      Name: name,
      Trip: trip,
      Language: language,
      Rating: String(rating),
      Story: story,
      Photos: photos.join("\n"),
      "Markdown draft": markdownDraft({ name, language, rating, story, photos }),
      Status: "New",
    },
  });

  return saved ? { status: "success" } : { status: "failed" };
}
