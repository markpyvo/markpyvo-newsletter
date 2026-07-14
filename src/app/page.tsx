import { HomePage } from "@/components/home-page";
import { getKitSubscriberCount } from "@/lib/kit";
import { getAllResources } from "@/lib/resource-store";

// Gmail import (via getAllResources) can be slow; give background regeneration
// room. The page is served from cache, so visitors never wait on the fetch.
export const maxDuration = 60;

export default async function Home() {
  // Live subscriber count (cached, refreshed weekly by the media-kit cron).
  // Falls back to null, and the page shows its static "1,500+" copy.
  const [subscriberCount, resources] = await Promise.all([
    getKitSubscriberCount(),
    getAllResources(),
  ]);
  return <HomePage subscriberCount={subscriberCount} featured={resources.slice(0, 3)} />;
}
