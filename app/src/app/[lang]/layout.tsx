import "../globals.css";

import { AnalyticsEvents } from "@/components/layout/analytics-events";
import { ContactFab } from "@/components/layout/contact-fab";
import type { NavItem } from "@/components/layout/nav-types";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { InquiryDrawerProvider } from "@/components/sections/inquiry-drawer";
import { getContent } from "@/content/data/get-content";
import { contact } from "@/content/data/site";
import { packageSlugs, serviceSlugs } from "@/content/data/types";
import { getDirection, locales, localizedHref } from "@/lib/i18n/config";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import { getI18n } from "@/lib/i18n/server";
import { getSiteUrl, pageMetadata } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Arabic,
  Inter,
  Noto_Naskh_Arabic,
  Playfair_Display,
  Quicksand,
} from "next/font/google";

// Rounded geometric sans that matches the logo's wordmark; used only for the name and tagline beside the emblem.
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  // Defaults for pages that set no metadata of their own (e.g. the 404). Canonical and
  // hreflang are per page, so they are not set here.
  const { openGraph, twitter } = pageMetadata({
    locale,
    dict,
    path: "/",
    description: dict.meta.description,
  });
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: dict.meta.defaultTitle,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    applicationName: dict.meta.siteName,
    openGraph: { ...openGraph, url: undefined },
    twitter,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const href = (path: string) => localizedHref(locale, path);
  const otherLocale = locale === "ar" ? "en" : "ar";

  const services = serviceSlugs.map((slug) => ({
    value: slug,
    label: content.services[slug].title,
  }));

  const navItems: NavItem[] = [
    {
      href: href("/services"),
      label: dict.nav.services,
      allLabel: dict.nav.allServices,
      children: serviceSlugs.map((slug) => ({
        href: href(`/services/${slug}`),
        label: content.services[slug].title,
        description: content.services[slug].summary,
      })),
    },
    {
      href: href("/packages"),
      label: dict.nav.packages,
      allLabel: dict.nav.allPackages,
      children: packageSlugs.map((slug) => ({
        href: href(`/packages/${slug}`),
        label: content.packages[slug].title,
        description: content.packages[slug].summary,
      })),
    },
    { href: href("/diaries"), label: dict.nav.diaries },
    { href: href("/about"), label: dict.nav.about },
    { href: href("/faq"), label: dict.nav.faq },
    { href: href("/contact"), label: dict.nav.contact },
  ];

  // WhatsApp message matched to the page (BRD 2.5).
  const fabMessages: Record<string, string> = {};
  for (const slug of serviceSlugs) {
    fabMessages[href(`/services/${slug}`)] =
      content.services[slug].whatsappMessage;
  }
  for (const slug of packageSlugs) {
    fabMessages[href(`/packages/${slug}`)] =
      content.packages[slug].whatsappMessage;
  }

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${inter.variable} ${playfair.variable} ${quicksand.variable} ${naskh.variable} ${plexArabic.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary px-5 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4"
        >
          {dict.common.skipToContent}
        </a>
        <Analytics />
        <AnalyticsEvents />
        <LocaleProvider locale={locale}>
          <InquiryDrawerProvider
            dict={{
              drawer: dict.drawer,
              form: dict.form,
              close: dict.common.close,
            }}
            services={services}
          >
            <SiteHeader
              homeHref={href("/")}
              brand={{
                name: dict.meta.brandName,
                tagline: dict.meta.brandTagline,
              }}
              items={navItems}
              navLabel={dict.nav.primaryLabel}
              ctaLabel={dict.nav.planJourney}
              menuLabels={{
                open: dict.common.openMenu,
                close: dict.common.close,
                title: dict.common.menu,
              }}
              language={{
                target: otherLocale,
                label: dict.language.switchLabel,
                ariaLabel: dict.language.switchAria,
              }}
            />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <SiteFooter locale={locale} dict={dict} content={content} />
            <ContactFab
              whatsappNumber={contact.whatsapp}
              tel={contact.phones.mobile.tel}
              labels={{
                group: dict.contactFab.groupLabel,
                whatsapp: dict.contactFab.whatsapp,
                call: dict.contactFab.call,
              }}
              defaultMessage={dict.contactFab.defaultMessage}
              messages={fabMessages}
            />
          </InquiryDrawerProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
