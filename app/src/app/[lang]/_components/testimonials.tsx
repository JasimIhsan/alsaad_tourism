"use client";

import { SectionHeading } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { Pause, Play, Quote, Star } from "lucide-react";
import { useId, useState, type CSSProperties } from "react";

export type Testimonial = { quote: string; name: string; detail: string };

type TestimonialsProps = {
  eyebrow: string;
  title: string;
  description: string;
  listLabel: string;
  pauseLabel: string;
  playLabel: string;
  ratingLabel: string;
  items: Testimonial[];
};

// Seconds each card takes to scroll past, so the speed stays constant as items are added.
const SECONDS_PER_CARD = 8;

/**
 * Auto-scrolling, infinitely looping testimonials. Pauses on hover and via the
 * toggle; with reduced motion it becomes a static, swipeable row.
 * TODO(client): replace the placeholder testimonials with verified reviews.
 */
export function Testimonials({
  eyebrow,
  title,
  description,
  listLabel,
  pauseLabel,
  playLabel,
  ratingLabel,
  items,
}: TestimonialsProps) {
  const [paused, setPaused] = useState(false);
  const titleId = useId();

  const renderList = (hidden: boolean) => (
    <ul
      aria-label={hidden ? undefined : listLabel}
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={cn("flex shrink-0 gap-5 pe-5", hidden && "motion-reduce:hidden")}
    >
      {items.map((item) => (
        <li key={item.name} className="flex w-76 shrink-0 snap-start sm:w-96">
          <TestimonialCard item={item} ratingLabel={ratingLabel} />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="overflow-hidden py-24 md:py-32" aria-labelledby={titleId}>
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          id={titleId}
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? playLabel : pauseLabel}
              className="grid size-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-accent motion-reduce:hidden"
            >
              {paused ? (
                <Play aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              ) : (
                <Pause aria-hidden="true" className="size-4" />
              )}
            </button>
          }
        />
      </div>

      <div className="group/marquee mask-fade-x motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto motion-reduce:scroll-px-6 motion-reduce:px-6 motion-reduce:mask-none">
        <div
          style={{ "--marquee-duration": `${items.length * SECONDS_PER_CARD}s` } as CSSProperties}
          className={cn(
            "flex w-max py-2 group-hover/marquee:[animation-play-state:paused] motion-safe:animate-marquee motion-safe:rtl:animate-marquee-rtl",
            paused && "[animation-play-state:paused]",
          )}
        >
          {renderList(false)}
          {renderList(true)}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, ratingLabel }: { item: Testimonial; ratingLabel: string }) {
  const initials = item.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <figure className="flex w-full flex-col rounded-card border border-border bg-card p-7">
      <div className="flex items-center justify-between gap-4">
        <Quote aria-hidden="true" className="size-8 text-highlight rtl:-scale-x-100" />
        <span role="img" aria-label={ratingLabel} className="flex gap-0.5 text-primary">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} aria-hidden="true" className="size-4 fill-current" />
          ))}
        </span>
      </div>
      <blockquote className="mt-6 mb-8 text-pretty">{item.quote}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold"
        >
          {initials}
        </span>
        <span>
          <span className="block font-semibold">{item.name}</span>
          <span className="block text-sm text-muted-foreground">{item.detail}</span>
        </span>
      </figcaption>
    </figure>
  );
}
