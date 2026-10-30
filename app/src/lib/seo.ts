import { branchMeta, contact, photos, type PhotoId } from "@/content/data/site";
import { branchIds, type SiteContent } from "@/content/data/types";
import type { Diary } from "@/lib/diaries";
import type { Metadata } from "next";
import { defaultLocale, intlLocales, localizedHref, locales, type Locale } from "./i18n/config";
import type { Dictionary } from "./i18n/dictionaries";

/**
 * Canonical origin of the site, used for canonical URLs, hreflang, the sitemap and JSON-LD.
 * Set SITE_URL in production (see .env.example); on Vercel it falls back to the project's
 * production domain, and locally to localhost.
 */
export function getSiteUrl(): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const absoluteUrl = (path: string) => `${getSiteUrl()}${path}`;

/** Absolute URL of an app path in every locale, plus x-default, keyed by hreflang. */
export function localeUrls(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(localizedHref(locale, path))])),
    "x-default": absoluteUrl(localizedHref(defaultLocale, path)),
  };
}

type SocialImage = { src: string; alt: string; width?: number; height?: number };

/** Logo on white, 1200x630: the default share image, shown in WhatsApp, Facebook, LinkedIn and the like. */
const BRAND_CARD = { src: "/og-logo.png", width: 1200, height: 630 } as const;

type PageMetadataInput = {
  locale: Locale;
  dict: Dictionary;
  /** App path without the locale, e.g. "/services/flight-tickets"; "/" for home. */
  path: string;
  /** Omit on the home page so the layout's default title is used. */
  title?: string;
  description: string;
  /** A catalogue photo id, or an explicit image (e.g. a diary cover). Defaults to the logo card. */
  image?: PhotoId | SocialImage;
  type?: "website" | "article";
};

/**
 * Title, description, canonical, hreflang alternates, Open Graph and Twitter card for a page.
 * Next replaces (not merges) `openGraph` per segment, so every page builds the whole object.
 */
export function pageMetadata({
  locale,
  dict,
  path,
  title,
  description,
  image,
  type = "website",
}: PageMetadataInput): Metadata {
  const picture: SocialImage = !image
    ? { ...BRAND_CARD, alt: dict.meta.siteName }
    : typeof image === "string"
      ? { src: photos[image].src, alt: dict.images[image] }
      : image;
  const url = absoluteUrl(localizedHref(locale, path));
  const ogTitle = title ?? dict.meta.defaultTitle;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: localeUrls(path) },
    openGraph: {
      type,
      url,
      siteName: dict.meta.siteName,
      locale: intlLocales[locale].replace("-", "_"),
      title: ogTitle,
      description,
      images: [{ url: absoluteUrl(picture.src), alt: picture.alt, width: picture.width, height: picture.height }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [absoluteUrl(picture.src)] },
  };
}

/**
 * TravelAgency with a department per confirmed branch. Branches whose address is still to be
 * confirmed (no map query) are left out, and no rating is included: Google does not accept
 * self-published review markup for a business's own page.
 */
export function travelAgencyJsonLd(locale: Locale, dict: Dictionary, content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": absoluteUrl("/#agency"),
    name: dict.meta.siteName,
    url: absoluteUrl(localizedHref(locale, "/")),
    description: dict.meta.description,
    image: absoluteUrl(photos.dubaiSkyline.src),
    logo: absoluteUrl("/logo-emblem.png"),
    telephone: contact.phones.mobile.tel,
    department: branchIds
      .filter((id) => content.branches[id].mapQuery)
      .map((id) => ({
        "@type": "TravelAgency",
        name: `${dict.meta.siteName} ${content.branches[id].name}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: content.branches[id].address,
          addressCountry: "AE",
        },
        telephone: branchMeta[id].phone?.tel,
      })),
  };
}

export function faqJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq
      .flatMap((group) => group.items)
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
  };
}

export function articleJsonLd(locale: Locale, dict: Dictionary, diary: Diary) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: diary.title,
    description: diary.excerpt,
    image: [diary.cover, ...diary.images].map((photo) => absoluteUrl(photo.src)),
    datePublished: diary.date,
    inLanguage: diary.lang,
    author: { "@type": "Person", name: diary.author },
    publisher: { "@type": "Organization", name: dict.meta.siteName },
    mainEntityOfPage: absoluteUrl(localizedHref(locale, `/diaries/${diary.slug}`)),
  };
}
