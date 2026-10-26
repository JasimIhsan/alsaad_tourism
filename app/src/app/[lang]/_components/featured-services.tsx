import { ButtonLink } from "@/components/motion/button/base";
import { Reveal } from "@/components/motion/reveal";
import { PhotoFill } from "@/components/sections/photo-fill";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceIcon } from "@/components/sections/service-icon";
import { visualClass } from "@/components/sections/visual";
import type { PhotoId, ServiceIcon as ServiceIconName, Visual } from "@/content/data/site";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export type FeaturedService = {
  href: string;
  title: string;
  summary: string;
  icon: ServiceIconName;
  visual: Visual;
  photo: PhotoId;
  photoAlt: string;
};

type FeaturedServicesProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  allHref: string;
  learnMore: string;
  items: FeaturedService[];
};

// Two wide cards over three narrow ones on desktop; the odd fifth card spans both columns on tablet.
const spans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "sm:col-span-2 lg:col-span-2"];
const photoHeights = ["h-56 md:h-72", "h-56 md:h-72", "h-56", "h-56", "h-56"];
const sizes = [
  "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 33vw, 100vw",
];

export function FeaturedServices({
  eyebrow,
  title,
  description,
  ctaLabel,
  allHref,
  learnMore,
  items,
}: FeaturedServicesProps) {
  return (
    <section className="pt-24 md:pt-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <ButtonLink href={allHref} variant="outline" size="sm">
              {ctaLabel}
            </ButtonLink>
          }
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((item, index) => (
            <Reveal as="li" key={item.href} delay={(index % 3) * 0.06} className={cn("grid", spans[index])}>
              <Link
                href={item.href}
                className="group flex flex-col overflow-hidden rounded-card border border-border bg-card transition-[border-color,box-shadow] duration-300 ease-brand hover:border-foreground/20 hover:shadow-raised"
              >
                <span className={cn("relative isolate block overflow-hidden", photoHeights[index])}>
                  <span
                    className={cn(
                      "absolute inset-0 -z-10 transition-transform duration-[1200ms] ease-brand group-hover:scale-105",
                      visualClass[item.visual],
                    )}
                  >
                    <PhotoFill id={item.photo} alt={item.photoAlt} sizes={sizes[index]} />
                  </span>
                  <span className="absolute top-5 start-5 grid size-12 place-items-center rounded-full bg-glass-strong text-foreground">
                    <ServiceIcon name={item.icon} className="size-5" />
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-7">
                  <span className="font-display text-2xl leading-tight">{item.title}</span>
                  <span className="mt-3 text-muted-foreground">{item.summary}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-primary">
                    {learnMore}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
