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

export async function getInstagramStats(): Promise<InstagramStats | null> {
  const token = process.env.APIFY_TOKEN;
  const username = process.env.INSTAGRAM_USERNAME ?? "markpyvovarov";
  if (!token) return null;

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(
        token,
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [username] }),
        next: { revalidate: 604800, tags: ["instagram-stats"] },
      },
    );
    if (!res.ok) return null;

    const items = (await res.json()) as ApifyProfile[];
    const followers = items?.[0]?.followersCount;
    if (typeof followers !== "number" || followers <= 0) return null;

    return { followers };
  } catch {
    return null;
  }
}
