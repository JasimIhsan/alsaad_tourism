import { InquiryTrigger } from "@/components/sections/inquiry-trigger";
import { getContent } from "@/content/data/get-content";
import {
  diaryDirection,
  getDiaries,
  getDiary,
  isServiceSlug,
} from "@/lib/diaries";
import { localizedHref } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Plane,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Byline, DiaryCard } from "../_components/diary-card";
import { DiaryProse } from "../_components/diary-prose";
import { RatingStars } from "../_components/rating-stars";
import {
  formatDays,
  formatDiaryDate,
  formatReadingTime,
  formatTravelMonth,
  languageName,
  tagHref,
  tagLabel,
  toCardData,
} from "../_components/to-card-data";

export async function generateStaticParams() {
  return getDiaries().map((diary) => ({ slug: diary.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/diaries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const diary = getDiary(slug);
  if (!diary) return {};
  return {
    title: diary.title,
    description: diary.excerpt,
    openGraph: { images: [diary.cover.src] },
  };
}

export default async function DiaryPage({
  params,
}: PageProps<"/[lang]/diaries/[slug]">) {
  const { slug } = await params;
  const diary = getDiary(slug);
  if (!diary) notFound();

  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const t = dict.diariesPage;
  const dir = diaryDirection(diary.lang);
  const serviceTitle = tagLabel(content, diary.service);
  const more = getDiaries()
    .filter((d) => d.slug !== diary.slug)
    .slice(0, 3);
  // `storyText` values are written by the traveller, so they keep the story's language.
  const facts = [
    {
      icon: MapPin,
      label: t.facts.destination,
      value: diary.destination,
      storyText: true,
    },
    {
      icon: CalendarDays,
      label: t.facts.duration,
      value: formatDays(locale, diary.days),
      storyText: false,
    },
    {
      icon: Plane,
      label: t.facts.travelled,
      value: formatTravelMonth(locale, diary.travelMonth),
      storyText: false,
    },
    {
      icon: Users,
      label: t.facts.travellers,
      value: diary.travellers,
      storyText: true,
    },
  ];

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Link
            href={localizedHref(locale, "/diaries")}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {t.story.back}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1 font-semibold text-foreground">
              {languageName(locale, diary.lang)}
            </span>
            <RatingStars
              rating={diary.rating}
              label={format(t.rating, { rating: diary.rating })}
            />
            <time dateTime={diary.date}>
              {formatDiaryDate(locale, diary.date)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{formatReadingTime(locale, dict, diary.readingMinutes)}</span>
          </div>
          <div lang={diary.lang} dir={dir} className="mt-6 max-w-4xl">
            <h1 className="font-display text-5xl leading-[1.05] text-balance md:text-6xl">
              {diary.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-pretty md:text-xl">
              {diary.excerpt}
            </p>
          </div>
          <p className="mt-6 font-semibold">
            <Byline template={t.by} author={diary.author} />
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex gap-3 bg-background p-5">
                <fact.icon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
                <div className="min-w-0">
                  <dt className="eyebrow text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd
                    lang={fact.storyText ? diary.lang : undefined}
                    className="mt-1 font-semibold"
                  >
                    {fact.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="px-2 sm:px-4">
        <div className="relative mx-auto h-72 max-w-7xl overflow-hidden rounded-section bg-gradient-sky md:h-128">
          <Image
            src={diary.cover.src}
            alt={diary.cover.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
        <article lang={diary.lang} dir={dir} className="max-w-2xl">
          <DiaryProse markdown={diary.body} rtl={dir === "rtl"} />
        </article>

        <aside className="grid content-start gap-6">
          {diary.itinerary.length > 0 ? (
            <section
              aria-labelledby="diary-itinerary"
              className="rounded-card border border-border p-7"
            >
              <h2 id="diary-itinerary" className="font-display text-2xl">
                {t.itinerary.title}
              </h2>
              <ol className="mt-6 grid gap-5 border-s border-border ps-6">
                {diary.itinerary.map((stop, index) => (
                  <li key={stop} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute inset-s-[-1.85rem] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
                    />
                    <p className="eyebrow text-muted-foreground">
                      {format(t.itinerary.day, { day: index + 1 })}
                    </p>
                    <p
                      lang={diary.lang}
                      dir={dir}
                      className="mt-1 font-semibold"
                    >
                      {stop}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          <div className="rounded-card bg-inverse p-7 text-inverse-foreground lg:sticky lg:top-28">
            <p className="eyebrow text-highlight">{t.story.ctaEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight">
              {format(t.story.ctaTitle, { service: serviceTitle })}
            </h2>
            <p className="mt-3 text-inverse-muted">
              <Byline template={t.story.ctaDescription} author={diary.author} />
            </p>
            <div className="mt-7 grid gap-3">
              <InquiryTrigger
                variant="primary"
                size="md"
                service={
                  isServiceSlug(diary.service) ? diary.service : undefined
                }
                className="w-full"
              >
                {t.story.ctaInquire}
              </InquiryTrigger>
              <Link
                href={tagHref(locale, diary.service)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-inverse-border px-5 text-sm font-semibold transition-colors hover:bg-inverse-hover"
              >
                {t.story.ctaDetails}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 rtl:-scale-x-100"
                />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {diary.images.length > 0 ? (
        <section aria-labelledby="diary-gallery" className="pb-16 md:pb-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2
              id="diary-gallery"
              className="mb-8 font-display text-3xl md:text-4xl"
            >
              {t.story.gallery}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2">
              {diary.images.map((image) => (
                <li
                  key={image.src}
                  className="relative h-72 overflow-hidden rounded-card bg-gradient-sky md:h-96"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section className="border-t border-border py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="mb-10 font-display text-3xl md:text-4xl">
              {t.story.more}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((d) => (
                <li key={d.slug} className="grid">
                  <DiaryCard
                    diary={toCardData(d, locale, dict)}
                    readLabel={t.readStory}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
