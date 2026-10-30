import { packageSlugs, serviceSlugs, legalSlugs } from "@/content/data/types";
import { getDiaries } from "@/lib/diaries";
import { getGoogleReviews } from "@/lib/google-reviews";
import { localizedHref, locales } from "@/lib/i18n/config";
import { absoluteUrl, localeUrls } from "@/lib/seo";
import type { MetadataRoute } from "next";

type Entry = { path: string; lastModified?: string };

/** Every page in every locale, each with its hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The reviews page 404s without reviews, so it is only listed when there are some.
  const reviews = await getGoogleReviews("en");

  const entries: Entry[] = [
    { path: "/" },
    { path: "/services" },
    ...serviceSlugs.map((slug) => ({ path: `/services/${slug}` })),
    { path: "/packages" },
    ...packageSlugs.map((slug) => ({ path: `/packages/${slug}` })),
    { path: "/diaries" },
    ...getDiaries().map((diary) => ({ path: `/diaries/${diary.slug}`, lastModified: diary.date })),
    { path: "/about" },
    { path: "/faq" },
    { path: "/contact" },
    ...(reviews && reviews.reviews.length > 0 ? [{ path: "/reviews" }] : []),
    ...legalSlugs.map((slug) => ({ path: `/legal/${slug}` })),
  ];

  return entries.flatMap(({ path, lastModified }) =>
    locales.map((locale) => ({
      url: absoluteUrl(localizedHref(locale, path)),
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages: localeUrls(path) },
    })),
  );
}
