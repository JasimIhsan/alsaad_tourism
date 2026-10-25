import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { getContent } from "@/content/data/get-content";
import { serviceMeta } from "@/content/data/site";
import { serviceSlugs } from "@/content/data/types";
import { localizedHref } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { ServiceCard } from "./_components/service-card";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.services.title, description: dict.meta.services.description };
}

export default async function ServicesPage() {
  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const page = dict.servicesPage;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-8">
        <ul className="mx-auto grid w-full max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceSlugs.map((slug, index) => (
            <Reveal as="li" key={slug} delay={(index % 3) * 0.06}>
              <ServiceCard
                href={localizedHref(locale, `/services/${slug}`)}
                icon={serviceMeta[slug].icon}
                title={content.services[slug].title}
                summary={content.services[slug].summary}
                cta={dict.common.viewDetails}
              />
            </Reveal>
          ))}
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
