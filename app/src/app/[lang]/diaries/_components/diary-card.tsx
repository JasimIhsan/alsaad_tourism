import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/sections/rating-stars";

/** Serialisable card data, prepared on the server (dates and labels already localised). */
export type DiaryCardData = {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  /** Dictionary "By {author}" template; the name is isolated for bidi. */
  byTemplate: string;
  author: string;
  date: string;
  dateTime: string;
  rating: number;
  ratingLabel: string;
  lang: string;
  dir: "ltr" | "rtl";
  languageName: string;
  cover: { src: string; alt: string };
  /** In the story's language. */
  destination: string;
  /** Already localised, e.g. "5 days". */
  duration: string;
  tags: string[];
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-glass-strong px-3 py-1.5 text-xs font-semibold text-foreground">{children}</span>
  );
}

/**
 * A template with an "{author}" slot, with only the name in <bdi>, so an Arabic name in an English
 * byline (or the reverse) keeps its punctuation in place.
 */
export function Byline({ template, author }: { template: string; author: string }) {
  const [before, after = ""] = template.split("{author}");
  return (
    <>
      {before}
      <bdi>{author}</bdi>
      {after}
    </>
  );
}

export function DiaryCard({ diary, readLabel }: { diary: DiaryCardData; readLabel: string }) {
  return (
    <Link
      href={diary.href}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-card transition-[border-color,box-shadow] duration-300 ease-brand hover:border-foreground/20 hover:shadow-raised"
    >
      <span className="relative block h-56 overflow-hidden bg-gradient-sky">
        <Image
          src={diary.cover.src}
          alt={diary.cover.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-brand group-hover:scale-105"
        />
        <span className="absolute top-4 start-4 flex flex-wrap gap-2">
          <Pill>{diary.languageName}</Pill>
          <Pill>{diary.duration}</Pill>
        </span>
      </span>
      <span className="flex flex-1 flex-col p-7">
        <span className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <bdi lang={diary.lang} className="truncate">
              {diary.destination}
            </bdi>
          </span>
          <RatingStars rating={diary.rating} label={diary.ratingLabel} />
        </span>
        {/* Story text keeps its own language and direction. */}
        <span lang={diary.lang} dir={diary.dir} className="mt-4 block">
          <span className="block font-display text-2xl leading-tight">{diary.title}</span>
          <span className="mt-3 line-clamp-3 block text-muted-foreground">{diary.excerpt}</span>
        </span>
        <span className="mt-auto flex flex-col items-start gap-3 pt-7 text-sm">
          <span className="text-muted-foreground">
            <Byline template={diary.byTemplate} author={diary.author} /> ·{" "}
            <time dateTime={diary.dateTime}>{diary.date}</time>
          </span>
          <span className="inline-flex items-center gap-2 font-semibold text-primary">
            {readLabel}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </span>
        </span>
      </span>
    </Link>
  );
}
