import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  id?: string;
  /** Optional action rendered at the end of the heading row (e.g. "see all"). */
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, id, action, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-4 text-muted-foreground">{eyebrow}</p> : null}
        <h2 id={id} className="font-display text-4xl leading-[1.05] text-balance md:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>
      {description || action ? (
        <div className="flex max-w-md flex-col items-start gap-5">
          {description ? <p className="text-pretty">{description}</p> : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
