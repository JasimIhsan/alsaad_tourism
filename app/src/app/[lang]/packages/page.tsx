import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { PackageCard } from "@/components/sections/package-card";
import { PageHero } from "@/components/sections/page-hero";
import { getContent } from "@/content/data/get-content";
import { packageMeta } from "@/content/data/site";
import { packageSlugs } from "@/content/data/types";
import { localizedHref } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({
    locale,
    dict,
    path: "/packages",
    title: dict.meta.packages.title,
    description: dict.meta.packages.description,
  });
}

// Alternating wide/narrow tiles keep the bento rhythm from the home page.
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

export default async function PackagesPage() {
  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const page = dict.packagesPage;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-8">
        <ul className="mx-auto grid w-full max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-12">
          {packageSlugs.map((slug, index) => {
            const pkg = content.packages[slug];
            return (
              <Reveal as="li" key={slug} delay={(index % 3) * 0.06} className={cn("grid", spans[index])}>
                <PackageCard
                  href={localizedHref(locale, `/packages/${slug}`)}
                  title={pkg.title}
                  category={pkg.category}
                  duration={pkg.duration}
                  priceNote={pkg.priceNote}
                  visual={packageMeta[slug].visual}
                  photo={packageMeta[slug].photo}
                  photoAlt={dict.images[packageMeta[slug].photo]}
                  sizes={index < 2 ? "(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw" : undefined}
                  className="min-h-80"
                />
              </Reveal>
            );
          })}
        </ul>
      </section>
      <CtaBand
        title={dict.home.cta.title}
        description={dict.home.cta.description}
        buttonLabel={dict.home.cta.button}
      />
    </>
  );
}
