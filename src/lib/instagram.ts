import { unstable_cache } from "next/cache";

// Server-only. Pulls the public Instagram follower count via the Apify
// Instagram Profile Scraper. Only public data is available; reach, impressions,
// engagement, and demographics are private and cannot be scraped, so those stay
// manual in the media kit.
//
// Cached and tagged "instagram-stats"; the weekly Vercel cron
// (/api/cron/refresh-media-kit) busts the tag so it refreshes about weekly.
// Returns null (page keeps its static value) when APIFY_TOKEN is missing or the
// scrape fails.
export type InstagramStats = {
  followers: number;
};

type ApifyProfile = {
  followersCount?: number;
};

// The Apify call is a POST, and Next's Data Cache only caches GET/HEAD, so the
// per-fetch `next: { revalidate, tags }` was inert: every render fired a
// billable Apify run. Wrap it in unstable_cache instead, which caches the
// return value regardless of method and honors the "instagram-stats" tag the
// weekly cron busts. The inner function throws on any failure so a transient
// error is not cached for a week (only a real follower count gets stored).
const cachedFollowers = unstable_cache(
  async (): Promise<number> => {
    const token = process.env.APIFY_TOKEN;
    const username = process.env.INSTAGRAM_USERNAME ?? "markpyvovarov";
    if (!token) throw new Error("APIFY_TOKEN missing");

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(
        token,
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [username] }),
      },
    );
    if (!res.ok) throw new Error(`Apify returned ${res.status}`);

    const items = (await res.json()) as ApifyProfile[];
    const followers = items?.[0]?.followersCount;
    if (typeof followers !== "number" || followers <= 0) {
      throw new Error("no follower count in Apify response");
    }
    return followers;
  },
  ["instagram-stats"],
  { revalidate: 604800, tags: ["instagram-stats"] },
);

export async function getInstagramStats(): Promise<InstagramStats | null> {
  try {
    return { followers: await cachedFollowers() };
  } catch {
    return null;
  }
}
