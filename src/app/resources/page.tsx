import type { Metadata } from "next";
import { ResourcesPage } from "@/components/resources-page";
import { getAllResources } from "@/lib/resource-store";

export const metadata: Metadata = {
  title: "Resources · 0→1 by Mark",
  description:
    "Every free AI prompt, guide, workflow, and system Mark shares with readers, in one searchable place.",
};

// Gmail import can be slow; give background regeneration room. The page is
// served from cache (tag "resources"), so visitors never wait on the fetch.
export const maxDuration = 60;

export default async function Resources() {
  const resources = await getAllResources();
  return <ResourcesPage resources={resources} />;
}
