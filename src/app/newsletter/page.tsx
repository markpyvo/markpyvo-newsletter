import type { Metadata } from "next";
import { SubscribePage } from "@/components/subscribe-page";
import { getKitSubscriberCount } from "@/lib/kit";

export const metadata: Metadata = {
  title: "Newsletter · 0→1 by Mark",
  description:
    "0→1 is a weekly newsletter for people who want to actually build things with AI, not just read about it. The vibecoding tools, workflows, and automations I use to ship real apps, from someone building it in public.",
};

export default async function Newsletter() {
  // Live subscriber count (cached, refreshed weekly by the media-kit cron).
  // Falls back to null, and the page shows its static "1,500+" copy.
  const subscriberCount = await getKitSubscriberCount();
  return <SubscribePage subscriberCount={subscriberCount} />;
}
