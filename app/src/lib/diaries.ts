import "server-only";

import { packageSlugs, serviceSlugs, type PackageSlug, type ServiceSlug } from "@/content/data/types";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { isDiaryLanguage, type DiaryLanguage } from "./diary-rules";

export type { DiaryLanguage };

const rtlLanguages: readonly DiaryLanguage[] = ["ar", "ur"];

export function diaryDirection(lang: DiaryLanguage): "ltr" | "rtl" {
  return rtlLanguages.includes(lang) ? "rtl" : "ltr";
}

/** Tags are service or package slugs, so filter labels come from site content. */
export type DiaryTag = ServiceSlug | PackageSlug;

export type DiaryImage = { src: string; alt: string };

/** A travelogue: a first-person account of a trip, written in the traveller's own language. */
export type Diary = {
  slug: string;
  title: string;
  author: string;
  lang: DiaryLanguage;
  /** Publication date, ISO (YYYY-MM-DD). */
  date: string;
  rating: number;
  tags: DiaryTag[];
  /** Service or package the in-story CTA points to. */
  service: DiaryTag;
  cover: DiaryImage;
  /** Optional end-of-story gallery; inline photos live in the body. */
  images: DiaryImage[];
  excerpt: string;
  /** Trip details, in the story's language except the numbers. */
  destination: string;
  days: number;
  /** Month travelled, ISO (YYYY-MM). */
  travelMonth: string;
  travellers: string;
  /** One line per day of the trip; optional. */
  itinerary: string[];
  readingMinutes: number;
  /** Markdown body, rendered without raw HTML. */
  body: string;
};

const DIARIES_DIR = path.join(process.cwd(), "src/content/diaries");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const WORDS_PER_MINUTE = 200;
// Markdown image syntax: ![alt](src "optional caption")
const INLINE_IMAGE = /!\[[^\]]*\]\(\s*([^\s)]+)/g;
const tagSet = new Set<string>([...serviceSlugs, ...packageSlugs]);

function isTag(value: unknown): value is DiaryTag {
  return typeof value === "string" && tagSet.has(value);
}

/** Photos must be committed to /public; guest stories never hot-link remote images. */
function isLocalPhoto(src: unknown): src is string {
  return typeof src === "string" && src.startsWith("/") && fs.existsSync(path.join(PUBLIC_DIR, src));
}

function isImage(value: unknown): value is DiaryImage {
  if (typeof value !== "object" || value === null) return false;
  const { src, alt } = value as Record<string, unknown>;
  return isLocalPhoto(src) && typeof alt === "string" && alt.length > 0;
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Fails the build with a clear message when a story's frontmatter is invalid. */
function invalid(file: string, field: string): never {
  throw new Error(`Invalid diary frontmatter in content/diaries/${file}: "${field}"`);
}

function parseDiary(file: string): Diary {
  const { data, content } = matter(fs.readFileSync(path.join(DIARIES_DIR, file), "utf8"));

  const slug = data.slug;
  if (typeof slug !== "string" || `${slug}.md` !== file) invalid(file, "slug (must match the file name)");
  if (typeof data.title !== "string" || !data.title) invalid(file, "title");
  if (typeof data.author !== "string" || !data.author) invalid(file, "author");
  if (!isDiaryLanguage(data.lang)) invalid(file, "lang");
  // YAML parses unquoted dates as Date objects.
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
  if (typeof date !== "string" || Number.isNaN(Date.parse(date))) invalid(file, "date");
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) invalid(file, "rating");
  if (!Array.isArray(data.tags) || !data.tags.every(isTag)) invalid(file, "tags");
  if (!isTag(data.service)) invalid(file, "service");
  if (!isImage(data.cover)) invalid(file, "cover");
  const images = data.images ?? [];
  if (!Array.isArray(images) || !images.every(isImage)) invalid(file, "images");
  if (typeof data.excerpt !== "string" || !data.excerpt) invalid(file, "excerpt");
  if (!isText(data.destination)) invalid(file, "destination");
  if (!Number.isInteger(data.days) || data.days < 1) invalid(file, "days");
  if (typeof data.travelMonth !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(data.travelMonth)) {
    invalid(file, 'travelMonth (quoted "YYYY-MM")');
  }
  if (!isText(data.travellers)) invalid(file, "travellers");
  const itinerary = data.itinerary ?? [];
  if (!Array.isArray(itinerary) || !itinerary.every(isText)) invalid(file, "itinerary");

  const body = content.trim();
  for (const [, src] of body.matchAll(INLINE_IMAGE)) {
    if (!isLocalPhoto(src)) invalid(file, `inline photo ${src} (must be a file in /public)`);
  }
  // Strip Markdown image syntax so photo captions don't count as reading time.
  const words = body.replace(INLINE_IMAGE, "").split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: data.title,
    author: data.author,
    lang: data.lang,
    date,
    rating: data.rating,
    tags: data.tags,
    service: data.service,
    cover: data.cover,
    images,
    excerpt: data.excerpt,
    destination: data.destination,
    days: data.days,
    travelMonth: data.travelMonth,
    travellers: data.travellers,
    itinerary,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    body,
  };
}

// Synchronous reads of repo files are deterministic, so pages using them prerender at build time.
const diaries: Diary[] = fs
  .readdirSync(DIARIES_DIR)
  .filter((file) => file.endsWith(".md"))
  .map(parseDiary)
  .sort((a, b) => b.date.localeCompare(a.date));

/** All published stories, newest first. */
export function getDiaries(): Diary[] {
  return diaries;
}

export function getDiary(slug: string): Diary | undefined {
  return diaries.find((diary) => diary.slug === slug);
}

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}
