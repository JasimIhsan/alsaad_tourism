import type { SiteContent } from "@/content/data/types";
import { diaryDirection, isServiceSlug, type Diary, type DiaryLanguage, type DiaryTag } from "@/lib/diaries";
import { intlLocales, localizedHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import type { DiaryCardData } from "./diary-card";

/** Localised title of the service or package a tag points to. */
export function tagLabel(content: SiteContent, tag: DiaryTag): string {
  return isServiceSlug(tag) ? content.services[tag].title : content.packages[tag].title;
}

/** Link to the service or package page a tag points to. */
export function tagHref(locale: Locale, tag: DiaryTag): string {
  return localizedHref(locale, isServiceSlug(tag) ? `/services/${tag}` : `/packages/${tag}`);
}

/** Story language name in the site locale, e.g. "Urdu" / "الأردية". */
export function languageName(locale: Locale, lang: DiaryLanguage): string {
  return new Intl.DisplayNames([intlLocales[locale]], { type: "language" }).of(lang) ?? lang;
}

export function formatDiaryDate(locale: Locale, date: string): string {
  return new Intl.DateTimeFormat(intlLocales[locale], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(date),
  );
}

/** "5 days" / "5 أيام": Intl handles plural forms, so no per-locale plural rules in the dictionaries. */
export function formatDays(locale: Locale, days: number): string {
  return new Intl.NumberFormat(intlLocales[locale], { style: "unit", unit: "day", unitDisplay: "long" }).format(days);
}

/** "September 2026" from "2026-09". */
export function formatTravelMonth(locale: Locale, month: string): string {
  return new Intl.DateTimeFormat(intlLocales[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${month}-01`),
  );
}

/** "6 min read" in the site locale. */
export function formatReadingTime(locale: Locale, dict: Dictionary, minutes: number): string {
  const time = new Intl.NumberFormat(intlLocales[locale], {
    style: "unit",
    unit: "minute",
    unitDisplay: "short",
  }).format(minutes);
  return format(dict.diariesPage.readingTime, { time });
}

export function toCardData(diary: Diary, locale: Locale, dict: Dictionary): DiaryCardData {
  const page = dict.diariesPage;
  return {
    slug: diary.slug,
    href: localizedHref(locale, `/diaries/${diary.slug}`),
    title: diary.title,
    excerpt: diary.excerpt,
    byTemplate: page.by,
    author: diary.author,
    date: formatDiaryDate(locale, diary.date),
    dateTime: diary.date,
    rating: diary.rating,
    ratingLabel: format(page.rating, { rating: diary.rating }),
    lang: diary.lang,
    dir: diaryDirection(diary.lang),
    languageName: languageName(locale, diary.lang),
    cover: diary.cover,
    destination: diary.destination,
    duration: formatDays(locale, diary.days),
    tags: diary.tags,
  };
}
