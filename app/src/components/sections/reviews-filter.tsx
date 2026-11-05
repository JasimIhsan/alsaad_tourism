"use client";

import { GoogleReviewsGrid } from "@/components/sections/google-reviews";
import type { GoogleReviews } from "@/lib/google-reviews";
import type { BranchKey } from "@/lib/google/places";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  data: GoogleReviews;
  labels: Dictionary["reviews"];
  locale: Locale;
};

const chip =
  "inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none";

/**
 * Branch filter chips above the reviews grid. The summary card follows the selection, showing
 * that branch's own rating and count. Without per-branch data (or with a single branch) the
 * chips are hidden and the grid renders as before.
 */
export function ReviewsFilter({ data, labels, locale }: Props) {
  const [selected, setSelected] = useState<BranchKey | null>(null);
  const branches = data.branches ?? [];
  const active = branches.find((entry) => entry.branch === selected);

  const shown: GoogleReviews = active
    ? {
        rating: active.rating,
        count: active.count,
        mapsUri: active.mapsUri,
        reviews: data.reviews.filter((review) => review.branch === active.branch),
      }
    : data;

  return (
    <>
      {branches.length > 1 ? (
        <div role="group" aria-label={labels.filterLabel} className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={selected === null}
            onClick={() => setSelected(null)}
            className={cn(
              chip,
              selected === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-accent",
            )}
          >
            {labels.filterAll}
          </button>
          {branches.map(({ branch }) => (
            <button
              key={branch}
              type="button"
              aria-pressed={selected === branch}
              onClick={() => setSelected(branch)}
              className={cn(
                chip,
                selected === branch
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-accent",
              )}
            >
              {labels.branches[branch]}
            </button>
          ))}
        </div>
      ) : null}
      <GoogleReviewsGrid key={selected ?? "all"} data={shown} labels={labels} locale={locale} />
    </>
  );
}
