import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
};

/** Editorial page header for inner pages; clears the floating nav. */
export function PageHero({ eyebrow, title, description, children, className }: PageHeroProps) {
  return (
    <section className={cn("pt-36 pb-14 md:pt-44 md:pb-20", className)}>
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="eyebrow mb-5 text-muted-foreground">{eyebrow}</p>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] text-balance md:text-7xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-lg text-pretty md:text-xl">{description}</p>
        ) : null}
        {children ? <div className="mt-9">{children}</div> : null}
      </div>
    </section>
  );
}
