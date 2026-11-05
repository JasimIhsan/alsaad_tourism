import { ButtonLink } from "@/components/motion/button/base";
import { Reveal } from "@/components/motion/reveal";
import { RatingStars } from "@/components/sections/rating-stars";
import { SectionHeading } from "@/components/sections/section-heading";
import type { GoogleReview, GoogleReviews } from "@/lib/google-reviews";
import { intlLocales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useId } from "react";

type Labels = Dictionary["reviews"];

export function formatRating(locale: Locale, rating: number) {
  return new Intl.NumberFormat(intlLocales[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    rating,
  );
}

export function formatReviewCount(locale: Locale, count: number) {
  return new Intl.NumberFormat(intlLocales[locale]).format(count);
}

type GoogleReviewsProps = {
  data: GoogleReviews;
  labels: Labels;
  locale: Locale;
};

/**
 * The summary card plus every review Google returned (at most 5, so it fills a 3x2 grid),
 * with the attribution Google's display terms require.
 */
export function GoogleReviewsGrid({ data, labels, locale }: GoogleReviewsProps) {
  return (
    <ul aria-label={labels.listLabel} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal as="li" className="grid">
        <SummaryCard data={data} labels={labels} locale={locale} />
      </Reveal>
      {data.reviews.map((review, index) => (
        <Reveal key={`${review.author}-${index}`} as="li" delay={(index + 1) * 0.06} className="grid">
          <ReviewCard review={review} labels={labels} />
        </Reveal>
      ))}
    </ul>
  );
}

/** Home-page section: heading, the grid and a link to the full reviews page. */
export function GoogleReviewsSection({
  data,
  labels,
  locale,
  allHref,
}: GoogleReviewsProps & { allHref: string }) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          id={titleId}
          eyebrow={labels.eyebrow}
          title={labels.title}
          description={labels.description}
          action={
            <ButtonLink href={allHref} variant="outline" size="sm">
              {labels.allReviews}
            </ButtonLink>
          }
        />
        <GoogleReviewsGrid data={data} labels={labels} locale={locale} />
      </div>
    </section>
  );
}

function SummaryCard({ data, labels, locale }: { data: GoogleReviews; labels: Labels; locale: Locale }) {
  const rating = formatRating(locale, data.rating);
  return (
    <div className="flex w-full flex-col justify-between gap-8 rounded-card bg-inverse p-7 text-inverse-foreground">
      <div>
        <p className="eyebrow text-inverse-muted">{labels.summaryLabel}</p>
        <p className="mt-4 font-display text-7xl leading-none">{rating}</p>
        <RatingStars
          rating={Math.round(data.rating)}
          label={format(labels.ratingLabel, { rating })}
          className="mt-4 [&_svg]:size-5"
        />
        <p className="mt-4 text-inverse-muted">
          {format(labels.count, { count: formatReviewCount(locale, data.count) })}
        </p>
      </div>
      <div>
        <p className="eyebrow text-inverse-muted">{labels.attribution}</p>
        <a
          href={data.mapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
        >
          {labels.seeAll}
          <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </a>
      </div>
    </div>
  );
}

function ReviewCard({ review, labels }: { review: GoogleReview; labels: Labels }) {
  const rating = String(review.rating);
  return (
    <figure className="flex w-full flex-col rounded-card border border-border bg-card p-7">
      <RatingStars rating={review.rating} label={format(labels.ratingLabel, { rating })} />
      {/* The review keeps the language Google reports for it, whatever the site locale. */}
      <blockquote lang={review.lang ?? undefined} dir="auto" className="mt-5 mb-8 line-clamp-6 text-pretty">
        {review.text}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
        {review.photoUri ? (
          <Image
            src={review.photoUri}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full bg-accent object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold"
          >
            {[...review.author][0]}
          </span>
        )}
        <span className="min-w-0">
          {review.authorUri ? (
            <a
              href={review.authorUri}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={format(labels.authorLink, { author: review.author })}
              className="block truncate font-semibold hover:underline"
            >
              <bdi>{review.author}</bdi>
            </a>
          ) : (
            <span className="block truncate font-semibold">
              <bdi>{review.author}</bdi>
            </span>
          )}
          {review.when ? <span className="block text-sm text-muted-foreground">{review.when}</span> : null}
          {review.branch ? (
            <span className="block truncate text-sm text-muted-foreground">{labels.branches[review.branch]}</span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
