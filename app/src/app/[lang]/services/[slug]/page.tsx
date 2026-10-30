import { DetailBlock as Block, FactsCard, IconList } from "@/components/sections/detail-block";
import { FaqList } from "@/components/sections/faq-list";
import { GoogleReviewsSection } from "@/components/sections/google-reviews";
import { getGoogleReviews } from "@/lib/google-reviews";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { PageHero } from "@/components/sections/page-hero";
import { getContent } from "@/content/data/get-content";
import { serviceMeta } from "@/content/data/site";
import { serviceSlugs, type ServiceSlug } from "@/content/data/types";
import { localizedHref } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { ArrowRight, Check, FileText, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceCard } from "../_components/service-card";

export async function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  if (!isServiceSlug(slug)) return {};
  const service = getContent(locale).services[slug];
  return { title: service.title, description: service.summary };
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const service = content.services[slug];
  const t = dict.servicesPage.detail;
  const faqItems = content.faq.flatMap((g) => g.items).filter((item) => service.faqIds.includes(item.id));
  const services = serviceSlugs.map((s) => ({ value: s, label: content.services[s].title }));
  const googleReviews = await getGoogleReviews(locale);

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={service.title} description={service.summary}>
        {service.notice ? (
          <p className="flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-muted px-5 py-4">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>{service.notice}</span>
          </p>
        ) : null}
      </PageHero>

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-20 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-16">
        <div className="grid gap-14">
          <Block title={t.overview}>
            <div className="grid max-w-2xl gap-4 text-lg">
              {service.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Block>

          <Block title={t.eligibility}>
            <IconList items={service.eligibility} icon={<Check className="size-4" />} />
          </Block>

          <Block title={t.documents}>
            <IconList items={service.documents} icon={<FileText className="size-4" />} />
          </Block>

          {faqItems.length > 0 ? (
            <Block title={t.faq}>
              <FaqList items={faqItems} />
              <Link
                href={localizedHref(locale, "/faq")}
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline"
              >
                {t.allFaq}
                <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </Link>
            </Block>
          ) : null}
        </div>

        <aside className="grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <FactsCard
            title={t.facts}
            facts={[...service.facts, { label: t.price, value: service.priceNote }]}
          />

          <div id="inquiry" className="scroll-mt-28 rounded-card border border-border p-7">
            <h2 className="font-display text-2xl">{t.inquiryTitle}</h2>
            <p className="mt-2 mb-6 text-muted-foreground">{t.inquiryDescription}</p>
            <InquiryForm dict={dict.form} services={services} defaultService={slug} />
          </div>
        </aside>
      </div>

      {googleReviews && googleReviews.reviews.length > 0 ? (
        <GoogleReviewsSection data={googleReviews} labels={dict.reviews} locale={locale} limit={2} />
      ) : null}

      <section className="border-t border-border py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="mb-10 font-display text-3xl md:text-4xl">{t.others}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceSlugs
              .filter((s) => s !== slug)
              .map((s) => (
                <li key={s}>
                  <ServiceCard
                    href={localizedHref(locale, `/services/${s}`)}
                    icon={serviceMeta[s].icon}
                    title={content.services[s].title}
                    summary={content.services[s].summary}
                    cta={dict.common.viewDetails}
                  />
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}

