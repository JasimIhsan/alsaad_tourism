import "server-only";

import { cacheLife } from "next/cache";
import type { Locale } from "../i18n/config";

/**
 * Branches shown in the Google reviews. The Place ID of each comes from an env var; a
 * branch whose variable is empty is skipped. Taj Al Saadah Typing Services has no Place
 * ID yet, so it is not listed.
 */
export const BRANCHES = [
  { key: "sharjah", envVar: "GOOGLE_PLACE_ID_SHARJAH" },
  { key: "dubai", envVar: "GOOGLE_PLACE_ID_DUBAI" },
  { key: "sajaa", envVar: "GOOGLE_PLACE_ID_SAJAA" },
  { key: "nadapuram", envVar: "GOOGLE_PLACE_ID_NADAPURAM" },
] as const;

export type BranchKey = (typeof BRANCHES)[number]["key"];

export type PlaceReview = {
  author: string;
  authorUri: string | null;
  photoUri: string | null;
  rating: number;
  text: string;
  /** Language of `text`, so the review keeps its own `lang` regardless of the site locale. */
  lang: string | null;
  /** Localised by Google, e.g. "2 weeks ago". */
  when: string;
};

export type BranchReviews = {
  branch: BranchKey;
  name: string | null;
  rating: number;
  count: number;
  /** The branch's Google listing, where visitors can read every review and write their own. */
  mapsUri: string;
  reviews: PlaceReview[];
};

const FIELD_MASK = "displayName,rating,userRatingCount,reviews,googleMapsUri";
const REQUEST_TIMEOUT_MS = 5000;

type RawReview = {
  rating?: unknown;
  text?: { text?: unknown; languageCode?: unknown };
  relativePublishTimeDescription?: unknown;
  authorAttribution?: { displayName?: unknown; uri?: unknown; photoUri?: unknown };
};

const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

function parseReview(review: RawReview): PlaceReview | null {
  const body = str(review.text?.text);
  const author = str(review.authorAttribution?.displayName);
  if (!body || !author || typeof review.rating !== "number") return null;
  return {
    author,
    authorUri: str(review.authorAttribution?.uri),
    photoUri: str(review.authorAttribution?.photoUri),
    rating: review.rating,
    text: body,
    lang: str(review.text?.languageCode),
    when: str(review.relativePublishTimeDescription) ?? "",
  };
}

/**
 * Throws on any failure, so a failed call is never cached: the next request retries
 * instead of serving hours of "no reviews". The Place ID and API key are read inside
 * (not passed in) so the key never becomes part of the cache key.
 */
async function fetchPlace(branch: BranchKey, locale: Locale): Promise<BranchReviews> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 6 * 3600, expire: 24 * 3600 });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const envVar = BRANCHES.find((entry) => entry.key === branch)?.envVar;
  const placeId = envVar ? process.env[envVar] : undefined;
  if (!apiKey || !placeId) throw new Error(`Google Places key or Place ID for "${branch}" is not set`);

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${locale}`,
    {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
  );
  if (!response.ok) throw new Error(`Places API responded ${response.status} for "${branch}"`);

  const place = (await response.json()) as {
    displayName?: { text?: unknown };
    rating?: unknown;
    userRatingCount?: unknown;
    googleMapsUri?: unknown;
    reviews?: RawReview[];
  };
  const mapsUri = str(place.googleMapsUri);
  if (typeof place.rating !== "number" || typeof place.userRatingCount !== "number" || !mapsUri) {
    throw new Error(`Places API response for "${branch}" is missing rating, review count or listing link`);
  }

  return {
    branch,
    name: str(place.displayName?.text),
    rating: place.rating,
    count: place.userRatingCount,
    mapsUri,
    reviews: (place.reviews ?? []).map(parseReview).filter((review) => review !== null),
  };
}

/**
 * Ratings and reviews for every branch that has a Place ID, fetched server-side and
 * cached for about six hours. Returns an empty list (never throws) when the API key or
 * IDs are missing or a request fails.
 */
export async function getBranchReviews(locale: Locale): Promise<BranchReviews[]> {
  if (!process.env.GOOGLE_PLACES_API_KEY) return [];

  const configured = BRANCHES.filter((entry) => process.env[entry.envVar]);
  const results = await Promise.allSettled(configured.map((entry) => fetchPlace(entry.key, locale)));

  const branches: BranchReviews[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") branches.push(result.value);
    else console.error(`[google-places] ${configured[index].key} unavailable:`, result.reason);
  });
  return branches;
}
