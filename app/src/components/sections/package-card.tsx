import type { PhotoId, Visual } from "@/content/data/site";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PhotoFill } from "./photo-fill";
import { visualClass } from "./visual";

type PackageCardProps = {
  href: string;
  title: string;
  category: string;
  duration: string;
  priceNote: string;
  visual: Visual;
  photo: PhotoId;
  photoAlt: string;
  /** Responsive `sizes` for the photo; defaults to a third of the container. */
  sizes?: string;
  className?: string;
};

/** Bento-style package card: photo over a gradient fallback, with a legibility scrim. */
export function PackageCard({
  href,
  title,
  category,
  duration,
  priceNote,
  visual,
  photo,
  photoAlt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
}: PackageCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative isolate flex min-h-60 overflow-hidden rounded-card text-inverse-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-0 -z-20 transition-transform duration-[1200ms] ease-brand group-hover:scale-105",
          visualClass[visual],
        )}
      >
        <PhotoFill id={photo} alt={photoAlt} sizes={sizes} />
      </span>
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-scrim" />
      <span className="absolute top-5 start-5 flex flex-wrap gap-2">
        <Pill>{category}</Pill>
        <Pill>{duration}</Pill>
      </span>
      <span className="mt-auto flex w-full items-end justify-between gap-4 p-6">
        <span>
          <span className="block font-display text-2xl leading-tight md:text-3xl">{title}</span>
          <span className="mt-1.5 block text-sm opacity-90">{priceNote}</span>
        </span>
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-background text-foreground transition-opacity duration-400 ease-brand md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        >
          <ArrowRight className="size-4 -rotate-45 rtl:rotate-45 rtl:-scale-x-100" />
        </span>
      </span>
    </Link>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-glass-strong px-3 py-1.5 text-xs font-semibold text-foreground">
      {children}
    </span>
  );
}
