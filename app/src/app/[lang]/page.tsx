import { CtaBand } from "@/components/sections/cta-band";
import {
  formatRating,
  formatReviewCount,
  GoogleReviewsSection,
} from "@/components/sections/google-reviews";
import { getGoogleReviews } from "@/lib/google-reviews";
import { format } from "@/lib/i18n/format";
import { getContent } from "@/content/data/get-content";
import { serviceMeta } from "@/content/data/site";
import { packageSlugs, serviceSlugs, type ServiceSlug } from "@/content/data/types";
import { localizedHref } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { FeaturedServices } from "./_components/featured-services";
import { Highlights } from "./_components/highlights";
import { Hero } from "./_components/hero";
import { PackagesBento } from "./_components/packages-bento";
import { Testimonials } from "./_components/testimonials";
import { TrustStrip } from "./_components/trust-strip";

export default async function HomePage() {
  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const href = (path: string) => localizedHref(locale, path);
  const { home } = dict;
  const googleReviews = await getGoogleReviews(locale);
  const ratingBadge = googleReviews
    ? {
        label: dict.reviews.badgeLabel,
        value: format(dict.reviews.badgeValue, {
          rating: formatRating(locale, googleReviews.rating),
          count: formatReviewCount(locale, googleReviews.count),
        }),
      }
    : undefined;

  const services = serviceSlugs.map((slug) => ({ value: slug, label: content.services[slug].title }));

  const highlights = home.highlights.items.map((item) => {
    const slug = item.service as ServiceSlug;
    return {
      title: item.title,
      description: item.description,
      href: href(`/services/${slug}`),
      icon: serviceMeta[slug].icon,
      visual: serviceMeta[slug].visual,
      photo: serviceMeta[slug].photo,
      photoAlt: dict.images[serviceMeta[slug].photo],
      caption: content.services[slug].title,
    };
  });

  const featuredServices = serviceSlugs.map((slug) => ({
    href: href(`/services/${slug}`),
    title: content.services[slug].title,
    summary: content.services[slug].summary,
    icon: serviceMeta[slug].icon,
    visual: serviceMeta[slug].visual,
    photo: serviceMeta[slug].photo,
    photoAlt: dict.images[serviceMeta[slug].photo],
  }));

  return (
    <>
      <Hero
        dict={home}
        formDict={dict.form}
        photoAlts={dict.images}
        services={services}
        servicesHref={href("/services")}
        ratingBadge={ratingBadge}
      />
      <TrustStrip label={home.trust.label} items={home.trust.items} />
      <FeaturedServices
        eyebrow={home.featuredServices.eyebrow}
        title={home.featuredServices.title}
        description={home.featuredServices.description}
        ctaLabel={home.featuredServices.cta}
        allHref={href("/services")}
        learnMore={dict.common.learnMore}
        items={featuredServices}
      />
      <PackagesBento
        title={home.packages.title}
        description={home.packages.description}
        ctaLabel={home.packages.cta}
        allHref={href("/packages")}
        hrefFor={(slug) => href(`/packages/${slug}`)}
        packages={packageSlugs.map((slug) => ({ slug, content: content.packages[slug] }))}
        photoAlts={dict.images}
      />
      <Highlights
        eyebrow={home.highlights.eyebrow}
        title={home.highlights.title}
        tabsLabel={home.highlights.tabsLabel}
        learnMore={dict.common.learnMore}
        items={highlights}
      />
      {googleReviews && googleReviews.reviews.length > 0 ? (
        <GoogleReviewsSection data={googleReviews} labels={dict.reviews} locale={locale} />
      ) : (
        // Placeholder stories until the Google credentials are set (S5.1).
        <Testimonials
          eyebrow={home.testimonials.eyebrow}
          title={home.testimonials.title}
          description={home.testimonials.description}
          listLabel={home.testimonials.listLabel}
          pauseLabel={home.testimonials.pause}
          playLabel={home.testimonials.play}
          ratingLabel={home.testimonials.rating}
          items={home.testimonials.items}
        />
      )}
      <CtaBand title={home.cta.title} description={home.cta.description} buttonLabel={home.cta.button} />
    </>
  );
}
