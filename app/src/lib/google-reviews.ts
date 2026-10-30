import "server-only";

import dummyData from "@/content/data/dummy-google-reviews.json";
import { cacheLife } from "next/cache";
import type { Locale } from "./i18n/config";

/** One Google review, as returned by the Places API (New). Google sends at most 5. */
export type GoogleReview = {
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

export type GoogleReviews = {
  rating: number;
  count: number;
  /** The business listing, where visitors can read every review and write their own. */
  mapsUri: string;
  reviews: GoogleReview[];
};

const dummyReviews: Record<Locale, GoogleReviews> = dummyData;

const FIELD_MASK = "rating,userRatingCount,googleMapsUri,reviews";
const REQUEST_TIMEOUT_MS = 5000;

type PlaceReview = {
  rating?: unknown;
  text?: { text?: unknown; languageCode?: unknown };
  relativePublishTimeDescription?: unknown;
  authorAttribution?: { displayName?: unknown; uri?: unknown; photoUri?: unknown };
};

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

function parseReview(review: PlaceReview): GoogleReview | null {
  const body = text(review.text?.text);
  const author = text(review.authorAttribution?.displayName);
  if (!body || !author || typeof review.rating !== "number") return null;
  return {
    author,
    authorUri: text(review.authorAttribution?.uri),
    photoUri: text(review.authorAttribution?.photoUri),
    rating: review.rating,
    text: body,
    lang: text(review.text?.languageCode),
    when: text(review.relativePublishTimeDescription) ?? "",
  };
}

/**
 * Throws on any failure, so a failed call is never cached: the next request retries
 * instead of serving a day of "no reviews".
 */
async function fetchReviews(locale: Locale): Promise<GoogleReviews> {
  "use cache";
  cacheLife("days");

  // Read here, not passed in, so the API key never becomes part of the cache key.
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) throw new Error("GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set");

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${locale}`,
    {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
  );
  if (!response.ok) throw new Error(`Places API responded ${response.status}`);

  const place = (await response.json()) as {
    rating?: unknown;
    userRatingCount?: unknown;
    googleMapsUri?: unknown;
    reviews?: PlaceReview[];
  };
  const mapsUri = text(place.googleMapsUri);
  if (typeof place.rating !== "number" || typeof place.userRatingCount !== "number" || !mapsUri) {
    throw new Error("Places API response is missing rating, review count or listing link");
  }

  return {
    rating: place.rating,
    count: place.userRatingCount,
    mapsUri,
    reviews: (place.reviews ?? []).map(parseReview).filter((review) => review !== null),
  };
}

/**
 * Live Google rating and reviews (server-side only, refreshed about daily).
 * Returns null when the credentials are not set or the API fails, so callers hide
 * their section instead of breaking the page.
 */
export async function getGoogleReviews(locale: Locale): Promise<GoogleReviews | null> {
  // TODO(client): remove this fallback once the Google credentials are set; until then
  // the site shows dummy reviews so the layout can be reviewed.
  if (!process.env.GOOGLE_PLACES_API_KEY || !process.env.GOOGLE_PLACE_ID) return dummyReviews[locale];

  try {
    return await fetchReviews(locale);
  } catch (error) {
    console.error("[google-reviews] unavailable:", error);
    return null;
  }
}
