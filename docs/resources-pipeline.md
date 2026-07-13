# Resources import pipeline

How the `/resources` catalog is built from sent newsletter emails. Emails land
in a dedicated Boosend/Gmail inbox, get converted into blog-post resources, and
go live only after a one-click review.

## Flow

```
Gmail (sent/resources inbox)
  → resource-source.ts   fetch recent emails over the Gmail API
  → resource-email.ts    emailToResource(): parse HTML into a Resource + body
  → resource-email.ts    mergeResources(): dedupe by sourceId/slug vs stored rows
  → resource-rewrite.ts  rewriteToArticle(): LLM cleans the body (optional)
  → resource-store.ts    saveImportedResources(): upsert into Supabase as DRAFTS
  → review-email.ts      sendReviewEmail(): email an approve link per new draft
  ── reviewer clicks Approve ──
  → api/resources/approve  publishResource(): flip draft → published (token cleared)
  → /resources             getAllResources(): seeds + published imports, rendered
```

The daily scan runs from `api/cron/import-resources` (Vercel cron). Everything
downstream no-ops gracefully when its integration env is missing, so the site
works with only the hand-written seeds in `lib/resources.ts` until the pipeline
is wired.

## Key files

| File | Responsibility |
| --- | --- |
| `lib/resource-source.ts` | Gmail transport: OAuth, list + fetch email HTML |
| `lib/resource-email.ts` | Pure parsing: HTML → Resource, dedupe, sanitize helpers |
| `lib/resource-rewrite.ts` | Optional LLM rewrite of the body into a clean article |
| `lib/resource-store.ts` | Supabase persistence (read/save/publish); the only DB layer |
| `lib/review-email.ts` | Resend email with the approve link |
| `app/api/cron/import-resources` | Daily orchestrator (auth, scan, save, email) |
| `app/api/resources/approve` | Publishes a draft from the review link |
| `app/resources/*` | Public list, detail, and review pages |

## Review lifecycle

Imports are saved as `draft` and hidden from the public list. Each draft gets a
`review_token` and an emailed approve link. `publishResource` flips the row to
`published` **and clears the token**, so the approve link is single-use; a replay
redirects to the now-live post. Nothing is public until approved.

## Environment

- **Gmail:** `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`
  (or `GMAIL_ACCESS_TOKEN`), optional `GMAIL_QUERY`
- **Supabase:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (table `resources`:
  `slug` PK, plus `title, teaser, type, tool, url, date, popularity, body_html,
  source_id, status, review_token`)
- **LLM rewrite (optional):** `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`
- **Review email:** `RESEND_API_KEY`, `REVIEW_EMAIL_FROM`, `REVIEW_EMAIL_TO`
- **Cron:** `CRON_SECRET` (Vercel sends it as a Bearer token; the routes are
  fail-closed if it is unset)

## Related surfaces

The weekly `api/cron/refresh-media-kit` cron busts the `instagram-stats` and
`kit-subscribers` cache tags so the partnerships page re-pulls live follower and
subscriber counts. That is separate from the resources import but shares the
cron-auth helper (`lib/cron-auth.ts`).
