import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { PhotoFill } from "@/components/sections/photo-fill";
import { pagePhotos } from "@/content/data/site";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { BadgeCheck } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({
    locale,
    dict,
    path: "/about",
    title: dict.meta.about.title,
    description: dict.meta.about.description,
  });
}

export default async function AboutPage() {
  const { dict } = await getI18n();
  const page = dict.aboutPage;

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="pb-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
          <div className="relative h-80 overflow-hidden rounded-t-[12.5rem] rounded-b-card bg-gradient-sky md:h-112">
            <PhotoFill
              id={pagePhotos.about}
              alt={dict.images[pagePhotos.about]}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl">
              {page.storyTitle}
            </h2>
            <div className="mt-6 grid gap-4 text-lg">
              {page.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-2 sm:px-4">
        <div className="rounded-section bg-inverse py-20 text-inverse-foreground md:py-28">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="font-display text-4xl md:text-5xl">
              {page.valuesTitle}
            </h2>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-card bg-inverse-border md:grid-cols-3">
              {page.values.map((value, index) => (
                <Reveal
                  as="li"
                  key={value.title}
                  delay={index * 0.08}
                  className="bg-inverse p-8"
                >
                  <span className="font-display text-xl text-highlight">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 font-display text-2xl">{value.title}</h3>
                  <p className="mt-2 text-inverse-muted">{value.description}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">
              {page.leadershipTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">{page.leadershipNote}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl">
              {page.accreditationsTitle}
            </h2>
            <ul className="mt-6 grid gap-3">
              {page.accreditations.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border p-4"
                >
                  <BadgeCheck
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        title={dict.home.cta.title}
        description={dict.home.cta.description}
        buttonLabel={dict.home.cta.button}
      />
    </>
  );
}
