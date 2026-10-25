import type { ReactNode } from "react";

/** Titled content block used on service and package detail pages. */
export function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 font-display text-3xl">{title}</h2>
      {children}
    </section>
  );
}

export function IconList({ items, icon }: { items: string[]; icon: ReactNode }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-accent">
            {icon}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Dark "at a glance" card with label/value rows. */
export function FactsCard({ title, facts }: { title: string; facts: { label: string; value: string }[] }) {
  return (
    <div className="rounded-card bg-inverse p-7 text-inverse-foreground">
      <h2 className="eyebrow text-highlight">{title}</h2>
      <dl className="mt-5 grid">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex justify-between gap-6 border-b border-inverse-border py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <dt className="text-inverse-muted">{fact.label}</dt>
            <dd className="text-end font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
