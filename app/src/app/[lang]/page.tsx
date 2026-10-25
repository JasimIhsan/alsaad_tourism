import { CtaBand } from "@/components/sections/cta-band";
import { getContent } from "@/content/data/get-content";
import { serviceMeta } from "@/content/data/site";
import { packageSlugs, serviceSlugs, type ServiceSlug } from "@/content/data/types";
import { localizedHref } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { Highlights } from "./_components/highlights";
import { Hero } from "./_components/hero";
import { PackagesBento } from "./_components/packages-bento";
import { TrustStrip } from "./_components/trust-strip";

export default async function HomePage() {
  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const href = (path: string) => localizedHref(locale, path);
  const { home } = dict;

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

  return (
    <>
      <Hero
        dict={home}
        formDict={dict.form}
        photoAlts={dict.images}
        services={services}
        servicesHref={href("/services")}
      />
      <TrustStrip label={home.trust.label} items={home.trust.items} />
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
      <CtaBand title={home.cta.title} description={home.cta.description} buttonLabel={home.cta.button} />
    </>
  );
}
