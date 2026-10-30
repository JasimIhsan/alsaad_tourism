import { DetailBlock, FactsCard, IconList } from "@/components/sections/detail-block";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { PackageCard } from "@/components/sections/package-card";
import { PageHero } from "@/components/sections/page-hero";
import { PhotoFill } from "@/components/sections/photo-fill";
import { visualClass } from "@/components/sections/visual";
import { getContent } from "@/content/data/get-content";
import { packageMeta } from "@/content/data/site";
import { packageSlugs, serviceSlugs, type PackageSlug } from "@/content/data/types";
import { localizedHref } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return packageSlugs.map((slug) => ({ slug }));
}

function isPackageSlug(value: string): value is PackageSlug {
  return (packageSlugs as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps<"/[lang]/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict } = await getI18n();
  if (!isPackageSlug(slug)) return {};
  const pkg = getContent(locale).packages[slug];
  return pageMetadata({
    locale,
    dict,
    path: `/packages/${slug}`,
    title: pkg.title,
    description: pkg.summary,
    image: packageMeta[slug].photo,
  });
}

export default async function PackagePage({ params }: PageProps<"/[lang]/packages/[slug]">) {
  const { slug } = await params;
  if (!isPackageSlug(slug)) notFound();

  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const pkg = content.packages[slug];
  const t = dict.packagesPage.detail;
  const services = serviceSlugs.map((s) => ({ value: s, label: content.services[s].title }));

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={pkg.title} description={pkg.summary} className="pb-10 md:pb-14" />

      <div className="mx-auto w-full max-w-6xl px-6">
        <div
          className={cn(
            "relative h-64 overflow-hidden rounded-section md:h-[28rem]",
            visualClass[packageMeta[slug].visual],
          )}
        >
          <PhotoFill
            id={packageMeta[slug].photo}
            alt={dict.images[packageMeta[slug].photo]}
            sizes="(min-width: 1152px) 1104px, 100vw"
            preload
          />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-16">
        <div className="grid gap-14">
          <DetailBlock title={t.overview}>
            <div className="grid max-w-2xl gap-4 text-lg">
              {pkg.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock title={t.inclusions}>
            <IconList items={pkg.inclusions} icon={<Check className="size-4" />} />
          </DetailBlock>

          <DetailBlock title={t.itinerary}>
            <ol className="grid gap-0 border-s border-border">
              {pkg.itinerary.map((step, index) => (
                <li key={step.title} className="relative ps-8 pb-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -start-[5px] top-2 size-2.5 rounded-full bg-primary"
                  />
                  <p className="eyebrow text-muted-foreground">{format(t.step, { n: index + 1 })}</p>
                  <p className="mt-1 font-display text-xl">{step.title}</p>
                  <p className="mt-1 text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </DetailBlock>
        </div>

        <aside className="grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <FactsCard
            title={dict.servicesPage.detail.facts}
            facts={[
              { label: t.duration, value: pkg.duration },
              { label: t.category, value: pkg.category },
              { label: t.price, value: pkg.priceNote },
            ]}
          />
          <div id="inquiry" className="scroll-mt-28 rounded-card border border-border p-7">
            <h2 className="font-display text-2xl">{t.inquiryTitle}</h2>
            <p className="mt-2 mb-6 text-muted-foreground">{t.inquiryDescription}</p>
            <InquiryForm dict={dict.form} services={services} subject={pkg.title} />
          </div>
        </aside>
      </div>

      <section className="border-t border-border py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="mb-10 font-display text-3xl md:text-4xl">{t.others}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {packageSlugs
              .filter((s) => s !== slug)
              .map((s) => (
                <li key={s} className="grid">
                  <PackageCard
                    href={localizedHref(locale, `/packages/${s}`)}
                    title={content.packages[s].title}
                    category={content.packages[s].category}
                    duration={content.packages[s].duration}
                    priceNote={content.packages[s].priceNote}
                    visual={packageMeta[s].visual}
                    photo={packageMeta[s].photo}
                    photoAlt={dict.images[packageMeta[s].photo]}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="min-h-72"
                  />
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}
