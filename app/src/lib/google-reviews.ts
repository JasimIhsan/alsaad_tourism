import "server-only";

import dummyData from "@/content/data/dummy-google-reviews.json";
import { BRANCHES, getBranchReviews, type BranchKey, type PlaceReview } from "./google/places";
import type { Locale } from "./i18n/config";

/** One Google review, tagged with the branch it was left for (null for the dummy data). */
export type GoogleReview = PlaceReview & { branch?: BranchKey | null };

export type GoogleReviews = {
  rating: number;
  count: number;
  /** The business listing, where visitors can read every review and write their own. */
  mapsUri: string;
  reviews: GoogleReview[];
};

/** The grid shows the summary card plus this many reviews (a 3x2 grid). */
const MAX_REVIEWS = 5;

const dummyReviews: Record<Locale, GoogleReviews> = dummyData;

/**
 * Live Google rating and reviews across all branches (server-side only, cached about 6h).
 * The rating is the average of the branches weighted by their review counts; reviews are
 * interleaved so every branch is represented. Returns null when Google is configured but
 * unavailable, so callers hide their section instead of breaking the page.
 */
export async function getGoogleReviews(locale: Locale): Promise<GoogleReviews | null> {
  const configured = BRANCHES.some((entry) => process.env[entry.envVar]);
  // TODO(client): remove this fallback once the Google credentials are set; until then
  // the site shows dummy reviews so the layout can be reviewed.
  if (!process.env.GOOGLE_PLACES_API_KEY || !configured) return dummyReviews[locale];

  const branches = await getBranchReviews(locale);
  if (branches.length === 0) return null;

  const count = branches.reduce((sum, branch) => sum + branch.count, 0);
  const rating =
    count > 0
      ? branches.reduce((sum, branch) => sum + branch.rating * branch.count, 0) / count
      : branches[0].rating;

  const reviews: GoogleReview[] = [];
  for (let index = 0; reviews.length < MAX_REVIEWS; index++) {
    const round = branches.filter((branch) => branch.reviews[index]);
    if (round.length === 0) break;
    for (const branch of round) {
      if (reviews.length < MAX_REVIEWS) reviews.push({ ...branch.reviews[index], branch: branch.branch });
    }
  }

  return { rating, count, mapsUri: branches[0].mapsUri, reviews };
}
