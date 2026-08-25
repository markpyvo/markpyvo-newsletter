// Scores and ranks resources by topical relatedness. Powers the automatic
// "Keep exploring" links on every resource page (see components/related-
// resources.tsx) and the candidate list handed to the LLM rewrite so imported
// posts can link out too. See docs/internal-linking-seo.md for why this
// exists and how to extend it.

import type { Resource } from "./resources";

// Words too common to signal topical overlap. Kept short on purpose: this is
// a cheap keyword-overlap heuristic, not real NLP.
const STOPWORDS = new Set([
  "this", "that", "with", "your", "from", "have", "will", "into", "when",
  "what", "your", "each", "week", "time", "just", "over", "than", "then",
  "them", "they", "here", "about", "these", "those", "gets", "make", "made",
  "like", "were", "been", "being", "does", "isn't", "don't", "you're",
  "it's", "the", "and", "for", "are", "not", "but", "can",
]);

function keywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
  );
}

function score(a: Resource, b: Resource): number {
  let s = 0;
  if (a.type === b.type) s += 3;
  if (a.tool === b.tool) s += 2;
  const aWords = keywords(`${a.title} ${a.teaser}`);
  const bWords = keywords(`${b.title} ${b.teaser}`);
  for (const w of aWords) if (bWords.has(w)) s += 1;
  return s;
}

// Candidates worth linking to: published, has a real local article page.
// Excludes the resource itself.
export function linkableResources(all: Resource[], exclude?: Resource): Resource[] {
  return all.filter(
    (r) =>
      r.slug !== exclude?.slug &&
      (r.status ?? "published") === "published" &&
      !!r.bodyHtml &&
      r.url.startsWith("/resources/"),
  );
}

// Top N most topically related resources to `current`, ranked highest first.
// Ties broken by newest first so the ordering is stable and favors fresher
// content.
export function getRelatedResources(
  current: Resource,
  all: Resource[],
  limit = 3,
): Resource[] {
  return linkableResources(all, current)
    .map((r) => ({ r, s: score(current, r) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || b.r.date.localeCompare(a.r.date))
    .slice(0, limit)
    .map(({ r }) => r);
}
