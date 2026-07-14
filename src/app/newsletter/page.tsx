import type { Metadata } from "next";
import { SubscribePage } from "@/components/subscribe-page";
import { getKitSubscriberCount } from "@/lib/kit";

export const metadata: Metadata = {
  title: "Newsletter · 0→1 by Mark",
  description:
    "A weekly newsletter that teaches AI to beginners. No jargon, no hype, just clear, practical lessons you can use right away.",
};

export default async function Newsletter() {
  // Live subscriber count (cached, refreshed weekly by the media-kit cron).
  // Falls back to null, and the page shows its static "1,500+" copy.
  const subscriberCount = await getKitSubscriberCount();
  return <SubscribePage subscriberCount={subscriberCount} />;
}
