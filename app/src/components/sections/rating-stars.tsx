import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
  /** Localised "Rated X out of 5" announced to screen readers. */
  label: string;
  className?: string;
};

export function RatingStars({ rating, label, className }: RatingStarsProps) {
  return (
    <span role="img" aria-label={label} className={cn("flex gap-0.5 text-primary", className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn("size-4", index < rating ? "fill-current" : "text-border")}
        />
      ))}
    </span>
  );
}
