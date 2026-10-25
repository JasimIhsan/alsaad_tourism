import { ButtonLink } from "@/components/motion/button/base";
import { localizedHref } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.notFound.title };
}

export default async function NotFound() {
  const { locale, dict } = await getI18n();
  const t = dict.notFound;

  return (
    <section className="flex min-h-[70dvh] items-center pt-36 pb-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="font-display text-7xl text-primary md:text-9xl">{t.eyebrow}</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-balance md:text-6xl">{t.title}</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t.description}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={localizedHref(locale, "/")} variant="primary" size="md">
            {t.home}
          </ButtonLink>
          <ButtonLink href={localizedHref(locale, "/contact")} variant="outline" size="md">
            {t.contact}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
