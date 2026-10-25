import { ButtonLink } from "@/components/motion/button/base";
import { Reveal } from "@/components/motion/reveal";
import { PackageCard } from "@/components/sections/package-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { packageMeta, type PhotoId } from "@/content/data/site";
import type { PackageContent, PackageSlug } from "@/content/data/types";
import { cn } from "@/lib/utils";

type PackagesBentoProps = {
  title: string;
  description: string;
  ctaLabel: string;
  allHref: string;
  hrefFor: (slug: PackageSlug) => string;
  packages: { slug: PackageSlug; content: PackageContent }[];
  photoAlts: Record<PhotoId, string>;
};

// First card is the large tile; the grid mirrors automatically in RTL.
const spans = ["md:col-span-7 md:row-span-2", "md:col-span-5", "md:col-span-5"];
const sizes = ["(min-width: 768px) 60vw, 100vw", "(min-width: 768px) 40vw, 100vw", "(min-width: 768px) 40vw, 100vw"];

export function PackagesBento({ title, description, ctaLabel, allHref, hrefFor, packages, photoAlts }: PackagesBentoProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          title={title}
          description={description}
          action={
            <ButtonLink href={allHref} variant="outline" size="sm">
              {ctaLabel}
            </ButtonLink>
          }
        />
        <div className="grid gap-4 md:auto-rows-[12.5rem] md:grid-cols-12 md:gap-5">
          {packages.slice(0, 3).map(({ slug, content }, index) => (
            <Reveal key={slug} delay={index * 0.08} className={cn("grid", spans[index])}>
              <PackageCard
                href={hrefFor(slug)}
                title={content.title}
                category={content.category}
                duration={content.duration}
                priceNote={content.priceNote}
                visual={packageMeta[slug].visual}
                photo={packageMeta[slug].photo}
                photoAlt={photoAlts[packageMeta[slug].photo]}
                sizes={sizes[index]}
                className="md:min-h-0"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
