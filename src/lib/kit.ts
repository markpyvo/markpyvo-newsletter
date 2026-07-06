// Server-only. Reads the current Kit (ConvertKit) subscriber count via the v4
// API using the same KIT_API_KEY as the signup route. v4 pagination omits the
// total unless you pass include_total_count=true, so we ask for it and read
// pagination.total_count.
//
// The fetch is cached and tagged "kit-subscribers". A weekly Vercel cron
// (/api/cron/refresh-media-kit) busts that tag so the number refreshes about
// once a week. Falls back to null (page keeps its static value) whenever
// KIT_API_KEY is missing or the request fails.
export async function getKitSubscriberCount(): Promise<number | null> {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      "https://api.kit.com/v4/subscribers?per_page=1&status=active&include_total_count=true",
      {
        headers: { "X-Kit-Api-Key": apiKey, Accept: "application/json" },
        next: { revalidate: 604800, tags: ["kit-subscribers"] },
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      pagination?: { total_count?: number };
    };
    const total = data?.pagination?.total_count;
    return typeof total === "number" && total > 0 ? total : null;
  } catch {
    return null;
  }
}
