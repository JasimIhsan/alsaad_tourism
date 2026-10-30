import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href: string;
  /** Brand name and tagline, from the locale dictionary. */
  brand: { name: string; tagline: string };
  className?: string;
};

/** The emblem as an image, with the name and tagline set as live text in the brand's wordmark style. */
export function Logo({ href, brand, className }: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex min-h-11 items-center gap-2.5", className)}>
      {/* Decorative: the adjacent text names the brand. */}
      <Image src="/logo-emblem.png" alt="" width={384} height={384} sizes="44px" loading="eager" className="size-10 shrink-0 md:size-11" />
      <span className="flex flex-col font-wordmark leading-none">
        {/* Quicksand tops out at 700; a hairline stroke brings it to the logo's heavier lettering. */}
        <span className="text-[1.375rem] font-bold tracking-[0.01em] text-foreground uppercase [-webkit-text-stroke:0.04em_currentColor] md:text-[1.5rem] ar:text-[1.5rem] ar:normal-case ar:[-webkit-text-stroke:0] md:ar:text-[1.625rem]">
          {brand.name}
        </span>
        {/* Tracked out so the tagline spans the same width as the name, as in the logo. */}
        <span className="mt-1 text-[0.6875rem] font-medium tracking-[0.34em] whitespace-nowrap text-muted-foreground md:text-xs ar:tracking-normal">
          {brand.tagline}
        </span>
      </span>
    </Link>
  );
}
