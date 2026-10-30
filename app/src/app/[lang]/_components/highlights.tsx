"use client";

import { PhotoFill } from "@/components/sections/photo-fill";
import { ServiceIcon } from "@/components/sections/service-icon";
import { visualClass } from "@/components/sections/visual";
import type { PhotoId, ServiceIcon as ServiceIconName, Visual } from "@/content/data/site";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";

export type Highlight = {
  title: string;
  description: string;
  href: string;
  icon: ServiceIconName;
  visual: Visual;
  photo: PhotoId;
  photoAlt: string;
  caption: string;
};

type HighlightsProps = {
  eyebrow: string;
  title: string;
  tabsLabel: string;
  learnMore: string;
  items: Highlight[];
};

/** Dark "what we do" panel: vertical tabs with a cross-fading preview. */
export function Highlights({ eyebrow, title, tabsLabel, learnMore, items }: HighlightsProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const canHover = useHoverCapable();

  const focusTab = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 };
    if (event.key in keys) {
      event.preventDefault();
      focusTab(keys[event.key]);
    }
  };

  return (
    <section className="px-2 sm:px-4" aria-labelledby={`${baseId}-title`}>
      <div className="rounded-section bg-inverse py-20 text-inverse-foreground md:py-32">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-18">
          <div>
            <p className="eyebrow mb-4 text-highlight">{eyebrow}</p>
            <h2 id={`${baseId}-title`} className="mb-12 font-display text-4xl leading-[1.05] text-balance md:text-5xl">
              {title}
            </h2>
            <div role="tablist" aria-label={tabsLabel} aria-orientation="vertical" className="grid">
              {items.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.href}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    id={`${baseId}-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${index}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onPointerEnter={() => canHover && setActive(index)}
                    onKeyDown={(e) => onKeyDown(e, index)}
                    className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-t border-inverse-border py-6 text-start last:border-b"
                  >
                    <span className="font-display text-xl text-highlight">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block font-display text-2xl transition-colors duration-300",
                          selected ? "text-highlight" : "text-inverse-foreground",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1.5 block max-w-[46ch] text-inverse-muted">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative h-96 overflow-hidden rounded-card md:h-[32.5rem]">
            {items.map((item, index) => {
              const selected = index === active;
              return (
                <div
                  key={item.href}
                  id={`${baseId}-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`${baseId}-tab-${index}`}
                  inert={!selected}
                  className={cn(
                    "absolute inset-0 isolate flex flex-col justify-between overflow-hidden p-7 transition-[opacity,scale] duration-700 ease-brand",
                    visualClass[item.visual],
                    selected ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                  )}
                >
                  <PhotoFill
                    id={item.photo}
                    alt={item.photoAlt}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="-z-10"
                  />
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-caption" />
                  <span className="grid size-14 place-items-center rounded-full bg-glass-strong text-foreground">
                    <ServiceIcon name={item.icon} className="size-6" />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-glass-strong px-4 py-2.5 text-sm text-foreground">
                      {item.caption}
                    </span>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                    >
                      {learnMore}
                      <span className="sr-only">: {item.caption}</span>
                      <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
