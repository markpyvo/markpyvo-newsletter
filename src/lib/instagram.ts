// Server-only. Pulls public Instagram stats via the Apify Instagram Profile
// Scraper. Only public data is available: follower count, and per-post likes +
// comments. Reach/impressions and audience demographics are private and cannot
// be scraped, so reach stays a manual figure (see MEDIA_KIT.reachMonthly) and
// engagement-by-reach is computed in the page from these scraped interactions.
//
// Cached and tagged "instagram-stats"; the weekly Vercel cron
// (/api/cron/refresh-media-kit) busts the tag so it refreshes about weekly.
// Returns null (page keeps its static values) when APIFY_TOKEN is missing or
// the scrape fails.
export type InstagramStats = {
  followers: number;
  // Total likes + comments across posts from the last 30 days. null when no
  // usable recent posts came back.
  interactions30d: number | null;
  // How many posts that total is based on (0 when none in the window).
  posts30d: number;
};

type ApifyProfile = {
  followersCount?: number;
  latestPosts?: Array<{
    likesCount?: number;
    commentsCount?: number;
    timestamp?: string;
  }>;
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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

    // Keep only posts from the last 30 days with a real like count. likesCount
    // is -1 when a post hides its likes, so those get filtered out.
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const recent = (profile.latestPosts ?? []).filter((p) => {
      if (typeof p.likesCount !== "number" || p.likesCount < 0) return false;
      if (!p.timestamp) return false;
      const t = new Date(p.timestamp).getTime();
      return Number.isFinite(t) && t >= cutoff;
    });

    let interactions30d: number | null = null;
    if (recent.length > 0) {
      interactions30d = recent.reduce(
        (sum, p) => sum + (p.likesCount ?? 0) + (p.commentsCount ?? 0),
        0,
      );
    }

    return { followers, interactions30d, posts30d: recent.length };
  } catch {
    return null;
  }
}
