import { PageHero } from "@/components/sections/page-hero";
import { getContent } from "@/content/data/get-content";
import { photoIds, photos } from "@/content/data/site";
import { legalSlugs, type LegalSlug } from "@/content/data/types";
import { intlLocales, localizedHref } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

function isLegalSlug(value: string): value is LegalSlug {
  return (legalSlugs as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps<"/[lang]/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict } = await getI18n();
  if (!isLegalSlug(slug)) return {};
  const doc = getContent(locale).legal[slug];
  return pageMetadata({ locale, dict, path: `/legal/${slug}`, title: doc.title, description: doc.intro });
}

export default async function LegalPage({ params }: PageProps<"/[lang]/legal/[slug]">) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const { locale, dict } = await getI18n();
  const doc = getContent(locale).legal[slug];
  const updated = new Intl.DateTimeFormat(intlLocales[locale], { dateStyle: "long" }).format(
    new Date(`${doc.updated}T00:00:00Z`),
  );

  return (
    <>
      <PageHero eyebrow={dict.legal.eyebrow} title={doc.title} description={doc.intro}>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{format(dict.legal.updated, { date: updated })}</span>
          <span>{dict.common.draftNotice}</span>
        </p>
      </PageHero>

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-24 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="grid max-w-3xl content-start gap-10">
          {slug === "credits" ? (
            <ul className="grid border-t border-border">
              {photoIds.map((id) => (
                <li key={id} className="border-b border-border py-5">
                  <p className="font-medium">{dict.images[id]}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(dict.legal.creditLine, { author: photos[id].author, licence: photos[id].licence })}
                  </p>
                  <a
                    href={photos[id].source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
                  >
                    {dict.legal.viewSource}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl md:text-3xl">{section.heading}</h2>
              <div className="mt-4 grid gap-4 text-lg">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <nav aria-labelledby="legal-nav" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="legal-nav" className="eyebrow mb-4 text-muted-foreground">
            {dict.legal.otherPages}
          </h2>
          <ul className="grid gap-1 border-s border-border">
            {legalSlugs.map((s) => (
              <li key={s}>
                <Link
                  href={localizedHref(locale, `/legal/${s}`)}
                  aria-current={s === slug ? "page" : undefined}
                  className="-ms-px flex min-h-11 items-center border-s-2 border-transparent ps-4 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-foreground"
                >
                  {dict.legal.names[s]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
