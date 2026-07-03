import type { Metadata } from "next";
import { PartnershipsPage } from "@/components/partnerships-page";

export const metadata: Metadata = {
  title: "Partnerships · 0→1 by Mark",
  description:
    "Media kit for Mark: plain-English AI & CS content for beginners across short-form video and a weekly newsletter. Sponsorships and collaborations.",
};

export default function Partnerships() {
  return <PartnershipsPage />;
}
