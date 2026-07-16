import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllResources } from "@/lib/resource-store";

// Dynamic sitemap: the static top-level pages plus every published resource, so
// crawlers discover new posts as they're approved. getAllResources() returns
// published-only, so drafts never leak here.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/newsletter`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/resources`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE.url}/partnerships`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let posts: MetadataRoute.Sitemap = [];
  try {
    const resources = await getAllResources();
    posts = resources
      // Only posts with a body live at /resources/<slug>; link-out seeds don't.
      .filter((r) => r.bodyHtml && r.url.startsWith("/resources/"))
      .map((r) => ({
        url: `${SITE.url}${r.url}`,
        lastModified: r.date,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    // Supabase hiccup: still return the static pages rather than a 500.
  }

  return [...staticPages, ...posts];
}
