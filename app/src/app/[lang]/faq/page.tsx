import { ButtonLink } from "@/components/motion/button/base";
import { PageHero } from "@/components/sections/page-hero";
import { getContent } from "@/content/data/get-content";
import { localizedHref } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { JsonLd } from "@/components/sections/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { FaqSearch } from "./_components/faq-search";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({
    locale,
    dict,
    path: "/faq",
    title: dict.meta.faq.title,
    description: dict.meta.faq.description,
  });
}

export default async function FaqPage() {
  const { locale, dict } = await getI18n();
  const page = dict.faqPage;

  return (
    <>
      <JsonLd data={faqJsonLd(getContent(locale))} />
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-20">
        <div className="mx-auto w-full max-w-4xl px-6">
          <FaqSearch
            groups={getContent(locale).faq}
            labels={{ search: page.searchLabel, placeholder: page.searchPlaceholder, noResults: page.noResults }}
          />
          <div className="mt-20 flex flex-col items-start gap-5 rounded-card bg-muted p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl">{page.contactPrompt}</p>
            <ButtonLink href={localizedHref(locale, "/contact")} variant="primary" size="md">
              {page.contactCta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
