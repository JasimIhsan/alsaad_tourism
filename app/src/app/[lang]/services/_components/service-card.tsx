import { ServiceIcon } from "@/components/sections/service-icon";
import type { ServiceIcon as ServiceIconName } from "@/content/data/site";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ServiceCardProps = {
  href: string;
  icon: ServiceIconName;
  title: string;
  summary: string;
  cta: string;
};

export function ServiceCard({ href, icon, title, summary, cta }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-card border border-border bg-card p-7 transition-[border-color,box-shadow] duration-300 ease-brand hover:border-foreground/20 hover:shadow-raised"
    >
      <span className="grid size-12 place-items-center rounded-full bg-accent text-foreground">
        <ServiceIcon name={icon} className="size-5" />
      </span>
      <span className="mt-8 font-display text-2xl leading-tight">{title}</span>
      <span className="mt-3 text-muted-foreground">{summary}</span>
      <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-primary">
        {cta}
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
        />
      </span>
    </Link>
  );
}
