import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ReviewsFilter } from "@/components/sections/reviews-filter";
import { getGoogleReviews } from "@/lib/google-reviews";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({
    locale,
    dict,
    path: "/reviews",
    title: dict.meta.reviews.title,
    description: dict.meta.reviews.description,
  });
}

export default async function ReviewsPage() {
  const { locale, dict } = await getI18n();
  const data = await getGoogleReviews(locale, { all: true });
  // No reviews to show (credentials missing or the API failed): the page does not exist.
  if (!data || data.reviews.length === 0) notFound();

  const { page } = dict.reviews;
  const { cta } = dict.home;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ReviewsFilter data={data} labels={dict.reviews} locale={locale} />
        </div>
      </section>
      <CtaBand title={cta.title} description={cta.description} buttonLabel={cta.button} />
    </>
  );
}
