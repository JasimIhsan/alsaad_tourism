import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href: string;
  label: string;
  className?: string;
};

export function Logo({ href, label, className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 text-sm font-bold tracking-[0.08em] whitespace-nowrap ar:tracking-normal",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative size-6 shrink-0 overflow-hidden rounded-full bg-primary after:absolute after:inset-0 after:bg-highlight after:[clip-path:polygon(100%_0,100%_100%,0_100%)]"
      />
      {label}
    </Link>
  );
}
