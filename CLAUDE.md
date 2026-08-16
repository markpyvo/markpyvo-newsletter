@AGENTS.md

## Writing style

- Never use em dashes (—) anywhere: not in UI copy, comments, metadata, or commit messages. Use commas, colons, periods, parentheses, or a hyphen instead.

## Boosend -> Kit contact sync

Boosend contacts get synced into Kit automatically, daily. See
`docs/boosend-kit-sync.md` for the full picture; summary: a scheduled Claude
cloud routine ("Boosend to Kit contact sync") stages the newest Boosend
contacts into the private repo `markpyvo/boosend-sync-data` (its sandbox
can't reach markpyvo.ca directly, but can push to GitHub), and the
`/api/cron/sync-boosend-contacts` Vercel cron reads that file and syncs each
contact into Kit, tagging them `n8n_boosend`. Working and verified in
production as of 2026-08-16. A real-time webhook variant also exists at
`src/app/api/webhooks/boosend-contact/` for if Boosend is ever pointed at it
directly.
