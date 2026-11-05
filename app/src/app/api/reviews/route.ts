import { getBranchReviews } from "@/lib/google/places";
import { defaultLocale, hasLocale } from "@/lib/i18n/config";

/** Branch ratings and reviews as JSON. Empty `branches` when Google is not configured. */
export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") ?? "";
  const branches = await getBranchReviews(hasLocale(lang) ? lang : defaultLocale);

  return Response.json(
    { branches },
    { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } },
  );
}
