// Resources catalog. This is the ONLY file you edit to add/remove resources.
// Each entry is one thing you send readers: a prompt, guide, workflow, etc.
//
// Long term, this array is meant to be generated automatically from your
// sent emails / Boosend automations (see the automation plan). For now it is
// hand-maintained. Keep slugs unique: they double as the dedupe key.

export type ResourceTool = "ChatGPT" | "Claude" | "Gemini" | "Multi-Tool";

export type ResourceType =
  | "Prompts"
  | "Guides"
  | "Workflows"
  | "Systems"
  | "Tools";

export type Resource = {
  slug: string; // unique, also the dedupe key
  title: string;
  teaser: string;
  type: ResourceType;
  tool: ResourceTool;
  url: string; // where it lives. Imported ones point at /resources/<slug>.
  date: string; // ISO date first sent, used for newest/oldest sort
  popularity?: number; // higher = more popular, used for the default sort
  bodyHtml?: string; // sanitized email body, rendered on the detail page
  sourceId?: string; // Gmail message id (provenance + dedupe) for imports
  status?: "draft" | "published"; // imports start as draft, hidden until approved
  reviewToken?: string; // secret in the approval link; guards publishing
};

export function getResourceBySlug(
  list: Resource[],
  slug: string,
): Resource | undefined {
  return list.find((r) => r.slug === slug);
}

export const TOOLS: ResourceTool[] = ["ChatGPT", "Claude", "Gemini", "Multi-Tool"];
export const TYPES: ResourceType[] = [
  "Prompts",
  "Guides",
  "Workflows",
  "Systems",
  "Tools",
];

// Hand-written seed resources shown alongside the imported ones. Left empty:
// the real resources come from the Gmail import (published after review). Add an
// entry here only if you want to feature something that didn't come from email.
export const RESOURCES: Resource[] = [];

export function sortResources(
  list: Resource[],
  sort: "newest" | "oldest" | "az",
): Resource[] {
  const copy = [...list];
  switch (sort) {
    case "oldest":
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case "az":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return copy.sort((a, b) => b.date.localeCompare(a.date));
  }
}
