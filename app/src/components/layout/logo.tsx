import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href: string;
  /** Localised site name, used as the image's alt text. */
  label: string;
  className?: string;
};

/** Brand lockup (emblem, wordmark, tagline). The PNG is transparent and made for light backgrounds. */
export function Logo({ href, label, className }: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex min-h-11 items-center", className)}>
      <Image
        src="/logo.png"
        alt={label}
        width={1674}
        height={413}
        sizes="180px"
        loading="eager"
        className="h-11 w-auto"
      />
    </Link>
  );
}
