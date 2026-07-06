// Server-only. Reads the current Kit (ConvertKit) subscriber count.
// The v3 endpoint returns `total_subscribers` directly; v4 uses cursor
// pagination with no total, so v3 is the reliable source for a count.
//
// The fetch is cached and tagged "kit-subscribers". A weekly Vercel cron
// (see vercel.json -> /api/cron/refresh-kit) busts that tag so the number
// refreshes about once a week. Falls back to null (page keeps its static
// value) whenever KIT_API_SECRET is missing or the request fails.
export async function getKitSubscriberCount(): Promise<number | null> {
  const secret = process.env.KIT_API_SECRET;
  if (!secret) return null;

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/subscribers?api_secret=${encodeURIComponent(
        secret,
      )}&per_page=1`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 604800, tags: ["kit-subscribers"] },
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { total_subscribers?: number };
    const total = data?.total_subscribers;
    return typeof total === "number" && total > 0 ? total : null;
  } catch {
    return null;
  }
}
