"use client";

import { FaqList } from "@/components/sections/faq-list";
import { Input } from "@/components/ui/input";
import type { FaqGroup } from "@/content/data/types";
import { useLocale } from "@/lib/i18n/locale-provider";
import { Search } from "lucide-react";
import { useDeferredValue, useId, useMemo, useState } from "react";

type FaqSearchProps = {
  groups: FaqGroup[];
  labels: { search: string; placeholder: string; noResults: string };
};

export function FaqSearch({ groups, labels }: FaqSearchProps) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const { locale } = useLocale();
  const inputId = useId();

  const filtered = useMemo(() => {
    const q = deferred.trim().toLocaleLowerCase(locale);
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          `${item.question} ${item.answer}`.toLocaleLowerCase(locale).includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [deferred, groups, locale]);

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        {labels.search}
      </label>
      <div className="relative max-w-xl">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.placeholder}
          className="h-14 rounded-full ps-13 pe-5 text-base"
        />
      </div>

      <div aria-live="polite" className="mt-14 grid gap-14">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">{labels.noResults}</p>
        ) : (
          filtered.map((group) => (
            <section key={group.id} aria-labelledby={`faq-${group.id}`}>
              <h2 id={`faq-${group.id}`} className="eyebrow mb-4 text-muted-foreground">
                {group.title}
              </h2>
              <FaqList items={group.items} />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
