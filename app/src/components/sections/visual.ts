import type { Visual } from "@/content/data/site";

/** Token-based gradient placeholders until client photography is supplied. */
export const visualClass: Record<Visual, string> = {
  desert: "bg-gradient-desert",
  sky: "bg-gradient-sky",
  dusk: "bg-gradient-dusk",
  night: "bg-gradient-night",
  coast: "bg-gradient-coast",
  ember: "bg-gradient-ember",
};
