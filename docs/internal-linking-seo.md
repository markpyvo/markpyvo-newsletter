# Internal linking for AEO/SEO

Every resource page should link to several other resource pages. That's what
turns a pile of disconnected posts into a semantic graph that search engines
and AI answer engines (ChatGPT, Perplexity, Google AI Overviews) can read as
"Mark is an authority on this cluster of topics", the same way a site with
one page per topic and no links between them reads as a collection of
orphans. Added 2026-08-24.

## The two mechanisms

**1. Automatic "keep exploring" block (works for every post, zero effort).**

`components/related-resources.tsx`, rendered at the bottom of every
`/resources/[slug]` page, calls `getRelatedResources()` in
`lib/related-resources.ts`. It scores every other published resource against
the current one (same `type` +3, same `tool` +2, shared keyword in
title/teaser +1 each) and links the top 3. This runs automatically for both
hand-written and imported posts, no manual work needed. As the catalog
grows, links get more specific because there are more candidates to rank
against.

**2. Contextual inline links inside the article body (needs a human or the
LLM to actually place them).**

A "keep exploring" block at the bottom is necessary but not sufficient: the
example graph this doc is based on (Claude Code -> 30-Day App Roadmap ->
building an MVP -> monetizing -> marketing -> AI coding workflows) is about
links placed *inside the prose*, at the exact sentence where a related post
is genuinely relevant. That's what search engines and AI systems weight most
heavily, because it signals real topical relationships, not just "these two
things happen to share a tag."

- **Imported posts** (`api/cron/import-resources/route.ts`): the route
  builds a `linkCandidates` list from every existing published resource
  (title, url, teaser, capped to 20, most recent first) and passes it to
  `rewriteToArticle()` in `lib/resource-rewrite.ts`. The rewrite prompt
  instructs the model to add at most 2 inline links, only where genuinely
  relevant, using only the exact URLs given. This happens automatically on
  every import; nothing to maintain here beyond keeping the candidate list
  reasonably capped as the catalog grows.
- **Hand-written seed posts** (`content/*.ts`, added via `lib/resources.ts`):
  add 1-2 inline links yourself when you write or edit one. Look for a
  sentence in the new post that naturally references the topic of an
  existing post (or vice versa: go back and add a link from an old post
  to the new one where it fits). Use `<a href="/resources/<slug>">`, and
  write the anchor text as it would read in a normal sentence, not "click
  here" or a bare URL. See the link from `thirty-day-app-roadmap.ts`'s
  week 4 security section to `how-to-not-get-sued-101.ts`, and the link
  back from that post's intro, for the pattern.

## Checklist for adding a new resource

1. Write the post normally (seed file in `content/`, or let it come through
   the Gmail import).
2. Before publishing, skim 2-3 existing posts for a natural tie-in and add
   an inline link both ways if one exists (new post -> old post, and edit
   the old post to link forward to the new one). Don't force it: a link
   that doesn't fit the sentence is worse than no link.
3. Leave the "keep exploring" block alone. It's automatic and will pick up
   the new post as a candidate for other pages' related lists on its own.
4. For imported posts, just make sure `linkCandidates` in the cron route
   still includes the new post next time something else imports (it will,
   automatically, once it's `status: "published"`).

## Why not link everything to everything

More links isn't the goal, *relevant* links are. A related-block that always
shows the same 3 posts regardless of relevance reads as boilerplate to both
readers and crawlers. The scoring in `related-resources.ts` and the "only
when genuinely relevant, max 2" instruction in `resource-rewrite.ts` are both
deliberately conservative for that reason. If a post starts feeling
under-linked once there are more posts to draw from, raise the `limit` in
`getRelatedResources()` or loosen the scoring, don't hardcode links that
don't belong.
