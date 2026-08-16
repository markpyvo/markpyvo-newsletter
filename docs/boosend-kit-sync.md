# Boosend -> Kit contact sync

Boosend's native Kit integration doesn't work. This replaces it with two
cooperating pieces, because a single piece couldn't do the whole job.

## Why two pieces

Boosend (an Instagram DM/comment automation + CRM tool) has no outbound
"new contact" webhook and no working documented REST API we could
authenticate to directly. The only reliable way to read its contacts is
Claude's Boosend MCP connector, which only runs inside a scheduled Claude
cloud routine. But that routine's sandbox has an outbound network policy that
blocks calls to `markpyvo.ca` directly (confirmed by testing: `curl` got a
403 "connect_rejected" at the proxy level, not a webhook error). Git push to
GitHub works fine from that sandbox, though.

So:

1. **Cloud routine** ("Boosend to Kit contact sync", daily at 15:00 UTC) -
   reads the newest ~500 Boosend contacts via MCP, filters to ones with an
   email, and pushes them to a **private** repo,
   [markpyvo/boosend-sync-data](https://github.com/markpyvo/boosend-sync-data)
   (`data/latest-contacts.json`). Private because that file contains real
   subscriber email addresses - it must never go in the public
   `markpyvo-newsletter` repo.
2. **Vercel cron** (`/api/cron/sync-boosend-contacts`, daily at 16:00 UTC,
   `vercel.json`) - reads that file via the GitHub API and syncs each
   contact into Kit: create/update subscriber, tag `n8n_boosend`. Runs on
   Vercel's own network, which has no such restriction.

The real-time webhook version (`src/app/api/webhooks/boosend-contact/`) is
still in the codebase and still works if Boosend is ever pushed to it
directly - this cron just also feeds it the same idempotent create+tag logic
inline, since the destination behavior is identical either way.

## Cadence

Vercel Hobby (free) caps cron jobs at once per day, with imprecise timing
(fires sometime within the scheduled hour, not on the minute). That's the
real ceiling here, not the cloud routine's schedule. If tighter timing ever
matters (e.g. the "send reintro while it's fresh" Kit automation), that
needs Vercel Pro, which allows per-minute cron.

## Environment

- **Kit:** `KIT_API_KEY` (already used by `/api/subscribe` and the webhook)
- **GitHub:** `GITHUB_SYNC_DATA_TOKEN` - a fine-grained PAT, scoped to only
  `markpyvo/boosend-sync-data`, Contents: Read-only permission. Create at
  github.com -> Settings -> Developer settings -> Fine-grained tokens ->
  Generate new token -> Repository access: Only select repositories ->
  `boosend-sync-data` -> Repository permissions -> Contents: Read-only.
- **Cron auth:** `CRON_SECRET` (shared with the other cron routes)

## Kit tag

`n8n_boosend`, id `22495453`. Same tag as the webhook route; both paths are
idempotent on Kit's side (existing subscriber/tag returns 200, not an
error), so overlap between the webhook and this cron is harmless.
