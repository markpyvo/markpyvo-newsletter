import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Let crawlers (search + AI answer engines) index everything except the private
// API and the token-gated draft review pages, and point them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/resources/review/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
