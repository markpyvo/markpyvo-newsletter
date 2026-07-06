// Server-only. Pulls public Instagram stats via the Apify Instagram Profile
// Scraper. Only public data is available: follower count, and an engagement
// rate computed from recent public posts. Reach/impressions and audience
// demographics are private and cannot be scraped, so those stay manual.
//
// Cached and tagged "instagram-stats"; the weekly Vercel cron
// (/api/cron/refresh-media-kit) busts the tag so it refreshes about weekly.
// Returns null (page keeps its static values) when APIFY_TOKEN is missing or
// the scrape fails.
export type InstagramStats = {
  followers: number;
  engagementRate: number | null;
};

type ApifyProfile = {
  followersCount?: number;
  latestPosts?: Array<{ likesCount?: number; commentsCount?: number }>;
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
    const profile = items?.[0];
    const followers = profile?.followersCount;
    if (typeof followers !== "number" || followers <= 0) return null;

    // Engagement rate = average (likes + comments) per recent post / followers.
    // likesCount can be -1 when a post hides its like count, so filter those.
    const posts = (profile.latestPosts ?? []).filter(
      (p) => typeof p.likesCount === "number" && p.likesCount >= 0,
    );
    let engagementRate: number | null = null;
    if (posts.length > 0) {
      const totalInteractions = posts.reduce(
        (sum, p) => sum + (p.likesCount ?? 0) + (p.commentsCount ?? 0),
        0,
      );
      engagementRate = (totalInteractions / posts.length / followers) * 100;
    }

    return { followers, engagementRate };
  } catch {
    return null;
  }
}
