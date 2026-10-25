import { notFound } from "next/navigation";

// Sends unmatched URLs under a locale to the localised [lang]/not-found page.
export default function CatchAll() {
  notFound();
}
