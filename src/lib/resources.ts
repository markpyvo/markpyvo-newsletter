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

// PLACEHOLDER seed data. Replace with your real resources (or let the
// automation fill this in). Titles/teasers below are examples in your voice.
export const RESOURCES: Resource[] = [
  {
    slug: "prompt-engineering-starter-pack",
    title: "The Prompt Engineering Starter Pack",
    teaser:
      "The 5 prompt patterns I use every day, in plain English, with copy-paste examples for beginners.",
    type: "Prompts",
    tool: "Multi-Tool",
    url: "#",
    date: "2026-06-30",
    popularity: 95,
  },
  {
    slug: "claude-projects-setup",
    title: "Set Up Claude Projects the Right Way",
    teaser:
      "Turn Claude into a tool that remembers your context. A step-by-step setup for first-timers.",
    type: "Guides",
    tool: "Claude",
    url: "#",
    date: "2026-06-24",
    popularity: 80,
  },
  {
    slug: "chatgpt-weekly-review",
    title: "Run Your Weekly Review With ChatGPT",
    teaser:
      "A simple workflow that turns a messy brain-dump into next week's plan in about ten minutes.",
    type: "Workflows",
    tool: "ChatGPT",
    url: "#",
    date: "2026-06-17",
    popularity: 72,
  },
  {
    slug: "beginner-ai-glossary",
    title: "The No-Jargon AI Glossary",
    teaser:
      "LLM, token, context window, RAG. Every term you keep seeing, explained like you're new (because you are).",
    type: "Guides",
    tool: "Multi-Tool",
    url: "#",
    date: "2026-06-10",
    popularity: 88,
  },
  {
    slug: "gemini-research-assistant",
    title: "Turn Gemini Into a Research Assistant",
    teaser:
      "Use Gemini plus Google Docs to summarize sources, pull quotes, and build an outline without the busywork.",
    type: "Systems",
    tool: "Gemini",
    url: "#",
    date: "2026-06-03",
    popularity: 60,
  },
];

export function sortResources(
  list: Resource[],
  sort: "popular" | "newest" | "oldest" | "az",
): Resource[] {
  const copy = [...list];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => b.date.localeCompare(a.date));
    case "oldest":
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case "az":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "popular":
    default:
      return copy.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  }
}
