"use client";

import { cn } from "@/lib/utils";
import { useSyncExternalStore } from "react";
import { DiaryCard, type DiaryCardData } from "./diary-card";

type DiaryFeedProps = {
  diaries: DiaryCardData[];
  /** Tags present in at least one story, with localised labels. */
  tags: { value: string; label: string }[];
  labels: { filter: string; all: string; empty: string; read: string };
};

const TAG_PARAM = "tag";

// The active tag lives in `?tag=` so filtered views can be shared. Reading it as an
// external store (instead of useSearchParams) keeps the feed out of a Suspense boundary.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

const getTag = () => new URLSearchParams(window.location.search).get(TAG_PARAM);
const getServerTag = () => null;

function setTag(tag: string | null) {
  const url = new URL(window.location.href);
  if (tag) url.searchParams.set(TAG_PARAM, tag);
  else url.searchParams.delete(TAG_PARAM);
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((listener) => listener());
}

/** Story grid with a trip filter. */
export function DiaryFeed({ diaries, tags, labels }: DiaryFeedProps) {
  const tag = useSyncExternalStore(subscribe, getTag, getServerTag);
  const active = tag && tags.some((t) => t.value === tag) ? tag : null;

  const visible = active ? diaries.filter((diary) => diary.tags.includes(active)) : diaries;

  return (
    <div>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        <FilterChip pressed={active === null} onClick={() => setTag(null)}>
          {labels.all}
        </FilterChip>
        {tags.map((tag) => (
          <FilterChip key={tag.value} pressed={active === tag.value} onClick={() => setTag(tag.value)}>
            {tag.label}
          </FilterChip>
        ))}
      </div>

      <div aria-live="polite" className="mt-10">
        {visible.length === 0 ? (
          <p className="text-muted-foreground">{labels.empty}</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((diary) => (
              <li key={diary.slug} className="grid">
                <DiaryCard diary={diary} readLabel={labels.read} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors duration-200",
        pressed
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}
