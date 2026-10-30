import { CtaBand } from "@/components/sections/cta-band";
import { GoogleReviewsGrid } from "@/components/sections/google-reviews";
import { PageHero } from "@/components/sections/page-hero";
import { getGoogleReviews } from "@/lib/google-reviews";
import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.reviews.title, description: dict.meta.reviews.description };
}

export default async function ReviewsPage() {
  const { locale, dict } = await getI18n();
  const data = await getGoogleReviews(locale);
  // No reviews to show (credentials missing or the API failed): the page does not exist.
  if (!data || data.reviews.length === 0) notFound();

  const { page } = dict.reviews;
  const { cta } = dict.home;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <GoogleReviewsGrid data={data} labels={dict.reviews} locale={locale} />
        </div>
      </section>
      <CtaBand title={cta.title} description={cta.description} buttonLabel={cta.button} />
    </>
  );
}
