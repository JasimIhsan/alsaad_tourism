"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

type BranchMapProps = {
  query: string;
  locale: string;
  title: string;
  showLabel: string;
};

/** Google Maps embed that loads only on request, to save data and avoid third-party cookies. */
export function BranchMap({ query, locale, title, showLabel }: BranchMapProps) {
  const [visible, setVisible] = useState(false);
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=${locale}&z=15&output=embed`;

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
      {visible ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm font-semibold transition-colors hover:bg-accent"
        >
          <MapPin aria-hidden="true" className="size-6 text-primary" />
          {showLabel}
        </button>
      )}
    </div>
  );
}
