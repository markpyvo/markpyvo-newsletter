// Central site identity + structured-data (JSON-LD) builders. Kept in one place
// so the canonical URL, author, and publisher are defined once and reused by
// every page's metadata and the schema.org markup that search engines and AI
// answer engines (ChatGPT, Perplexity, Google AI Overviews) read.

import type { Resource } from "./resources";

export const SITE = {
  url: "https://markpyvo.ca",
  name: "0 → 1 by Mark",
  shortName: "markpyvo",
  author: "Mark Pyvovarov",
  description:
    "AI and CS made simple. Free prompts, guides, and systems, plus a weekly newsletter, from a McGill CS student figuring it out in public.",
  authorSocials: [
    "https://www.linkedin.com/in/markpyvovarov/",
    "https://www.instagram.com/markpyvovarov/",
    "https://www.tiktok.com/@markpyvovarov",
  ],
} as const;

// Absolute URL for a site-relative path. Answer engines and canonical tags want
// fully-qualified URLs, never "/resources/x".
export function absoluteUrl(path: string): string {
  return path.startsWith("http")
    ? path
    : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

// The Person entity for Mark. Reused as the author/publisher across posts so the
// author is a consistent, machine-readable entity (helps E-E-A-T + AEO).
function personEntity() {
  return {
    "@type": "Person",
    name: SITE.author,
    url: SITE.url,
    sameAs: [...SITE.authorSocials],
  };
}

// schema.org BlogPosting for a resource/blog post. This is what tells Google and
// AI answer engines "this is an article, by this author, published on this date".
export function blogPostingJsonLd(resource: Resource) {
  const url = absoluteUrl(resource.url);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: resource.title,
    description: resource.aeo?.summary || resource.teaser,
    datePublished: resource.date,
    dateModified: resource.date,
    author: personEntity(),
    publisher: personEntity(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en",
    keywords: [resource.tool, resource.type, "AI", "ChatGPT", "Claude"].join(
      ", ",
    ),
  };
}

// schema.org FAQPage from a resource's FAQ list. This is the single highest-value
// AEO signal: answer engines lift these Q&A pairs verbatim into their answers.
// Returns null when there are no FAQs so callers can skip the <script> entirely.
export function faqPageJsonLd(resource: Resource) {
  const faqs = resource.aeo?.faqs ?? [];
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Serialize a JSON-LD object for a <script> tag, escaping "<" so a stray HTML
// tag in the data can't break out of the script element (XSS guard, per the
// Next.js JSON-LD guidance).
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
