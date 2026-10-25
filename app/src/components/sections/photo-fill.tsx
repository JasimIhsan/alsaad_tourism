import { photos, type PhotoId } from "@/content/data/site";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PhotoFillProps = {
  id: PhotoId;
  /** Localised alt text from the `images` dictionary. */
  alt: string;
  sizes: string;
  /** Preload above-the-fold (LCP) images only. */
  preload?: boolean;
  className?: string;
};

/** Cover photo that fills its positioned parent. */
export function PhotoFill({ id, alt, sizes, preload, className }: PhotoFillProps) {
  return (
    <Image
      src={photos[id].src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn("object-cover", className)}
    />
  );
}
