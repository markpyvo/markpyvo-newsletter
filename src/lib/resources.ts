// Resources catalog. This is the ONLY file you edit to add/remove resources.
// Each entry is one thing you send readers: a prompt, guide, workflow, etc.
//
// Long term, this array is meant to be generated automatically from your
// sent emails / Boosend automations (see the automation plan). For now it is
// hand-maintained. Keep slugs unique: they double as the dedupe key.

import { THIRTY_DAY_APP_ROADMAP_HTML } from "@/content/thirty-day-app-roadmap";
import { HOW_TO_NOT_GET_SUED_101_HTML } from "@/content/how-to-not-get-sued-101";

export type ResourceTool = "ChatGPT" | "Claude" | "Gemini" | "Multi-Tool";

export type ResourceType =
  | "Prompts"
  | "Guides"
  | "Workflows"
  | "Systems"
  | "Tools";

export type ResourceFaq = { q: string; a: string };

// Answer-engine (AEO) content generated alongside the post body: a direct-answer
// summary, key takeaways, and FAQ. Surfaced on the page and emitted as schema.org
// so ChatGPT / Perplexity / Google AI Overviews can quote it. Optional: posts
// without it render exactly as before.
export type ResourceAeo = {
  summary?: string; // 1-2 sentence direct answer / TL;DR
  keyTakeaways?: string[]; // 3-5 scannable bullets
  faqs?: ResourceFaq[]; // 3-5 question/answer pairs
};

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
  aeo?: ResourceAeo; // answer-engine summary/takeaways/FAQ (optional)
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

// Hand-written seed resources shown alongside the imported ones. The real
// resources come from the Gmail import (published after review); add an entry
// here only to feature something that didn't come from email.
export const RESOURCES: Resource[] = [
  {
    slug: "30-day-app-roadmap",
    title: "The 30-Day App Roadmap",
    teaser:
      "Build, market, monetize, scale. One small idea, four weeks, a real app that makes money and doesn't break at 2am.",
    type: "Systems",
    tool: "Claude",
    url: "/resources/30-day-app-roadmap",
    date: "2026-07-13",
    status: "published",
    bodyHtml: THIRTY_DAY_APP_ROADMAP_HTML,
    aeo: {
      summary:
        "The 30-Day App Roadmap is a four-week plan to take one small idea from zero to a launched, paying app: week 1 build the core, week 2 market it, week 3 add monetization, week 4 harden and scale.",
      keyTakeaways: [
        "Pick one small, specific idea you can build in a week, not a big platform.",
        "Ship the core feature first, then market before you add more features.",
        "Add payments early so you learn whether people will actually pay.",
        "Spend the final week on reliability so the app does not break at 2am.",
      ],
      faqs: [
        {
          q: "How long does it take to build an app with the 30-Day App Roadmap?",
          a: "Four weeks. The roadmap splits the work into build (week 1), market (week 2), monetize (week 3), and scale (week 4), so you launch a real, paying app in about a month.",
        },
        {
          q: "Do I need to know how to code to follow the roadmap?",
          a: "You need basic building ability, but the roadmap is designed for solo builders using AI tools like Claude to move fast, so you do not need to be an experienced engineer.",
        },
        {
          q: "When should I start charging for the app?",
          a: "In week 3, once the core works and you have early users. Adding payments early is how you find out whether people will actually pay before you invest more time.",
        },
      ],
    },
  },
  {
    slug: "how-to-not-get-sued-101",
    title: "How to Not Get Sued 101",
    teaser:
      "Three vibecoded security mistakes that carry real fines (fake reviews, broken access checks, ignored accessibility), plus a free stock news bot that ranks headlines by price impact.",
    type: "Guides",
    tool: "Claude",
    url: "/resources/how-to-not-get-sued-101",
    date: "2026-08-24",
    status: "published",
    bodyHtml: HOW_TO_NOT_GET_SUED_101_HTML,
    aeo: {
      summary:
        "Three vibecoded app mistakes carry real legal and financial risk: fake reviews (FTC fines up to $51,744 per review), missing ownership checks on predictable URLs (like the July 2026 Claude shared-chat indexing incident), and skipped accessibility work. Each has a one-line prompt fix, alongside a free open-source bot that ranks stock news by estimated price impact.",
      keyTakeaways: [
        "The FTC can fine $51,744 per fake review, including AI-generated testimonials, so only display reviews traceable to a real person.",
        "Checking a user is logged in isn't enough; also verify they own the specific resource before returning it, or predictable URLs leak other people's data.",
        "Anthropic's July 2026 incident, where shared Claude chats got indexed by Google, is a real example of a missing noindex tag plus missing access checks.",
        "AI coding tools skip accessibility unless asked; missing alt text and bad contrast can trigger demand letters even without a lawsuit.",
        "A ~250-line Python bot can pull stock news via RSS, score it with an LLM that's allowed to say \"I don't know,\" and rank headlines by estimated move times confidence.",
      ],
      faqs: [
        {
          q: "How much can fake reviews actually cost a business?",
          a: "Under the FTC's rule against fake and AI-generated reviews, the civil penalty is $51,744 per violation, calculated per review, not per company.",
        },
        {
          q: "What is the URL-based data leak vibecoders keep making?",
          a: "Apps often check that a user is logged in but never confirm they own the specific record they're requesting, so changing a number in the URL (like /orders/104 to /orders/105) exposes someone else's data.",
        },
        {
          q: "What happened with Anthropic's shared Claude chats in July 2026?",
          a: "Shared Claude chats and artifacts had no noindex tag, so Google indexed thousands of them, some containing medical records and API keys, exposing a broader pattern of missing access and indexing controls.",
        },
        {
          q: "What does the stock news bot actually do?",
          a: "It pulls a stock's news from three Google News RSS feeds, dedupes by hashing each link, sends surviving articles to an LLM for a direction/move/confidence score, ranks them by estimated move times confidence weight, and sends the top 3 to Telegram twice a day via GitHub Actions.",
        },
      ],
    },
  },
];

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
