import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must not be indexed next to the real site.
  const isPreview = process.env.VERCEL_ENV === "preview";
  return {
    rules: isPreview ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
