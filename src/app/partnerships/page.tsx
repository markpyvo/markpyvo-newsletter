import type { Metadata } from "next";
import { PartnershipsPage } from "@/components/partnerships-page";

export const metadata: Metadata = {
  title: "Partnerships · 0→1 by Mark",
  description:
    "Media kit for Mark: plain-English AI & CS content for beginners across short-form video and a weekly newsletter. Sponsorships and collaborations.",
};

// The Instagram scrape (Apify) can take a while; give the (background)
// regeneration room so it doesn't get cut off. The page is served from cache
// via stale-while-revalidate, so visitors never wait on the scrape.
export const maxDuration = 60;

export default function Partnerships() {
  return <PartnershipsPage />;
}
