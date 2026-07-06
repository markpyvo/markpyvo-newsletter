import { SubscribePage } from "@/components/subscribe-page";
import { getKitSubscriberCount } from "@/lib/kit";

export default async function Home() {
  // Live subscriber count (cached, refreshed weekly by the media-kit cron).
  // Falls back to null, and the page shows its static "1,500+" copy.
  const subscriberCount = await getKitSubscriberCount();
  return <SubscribePage subscriberCount={subscriberCount} />;
}
