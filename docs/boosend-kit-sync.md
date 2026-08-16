# Boosend -> Kit contact sync

Boosend's native Kit integration doesn't work. `POST /api/webhooks/boosend-contact`
replaces it: Boosend pushes new-contact events here in real time, and it's
just another route on this site's existing free Vercel deploy, so there's no
separate hosting to pay for and no polling delay.

## Why not n8n in production

An n8n version of this was prototyped and tested locally first (see
`automation/n8n/`), but making it "automatic" for real would have meant
keeping n8n reachable from the internet 24/7, which means paying for hosting
(or running it on a laptop, which isn't really automatic). This route reuses
infrastructure that's already deployed and already free, following the same
pattern as the existing `/api/subscribe` and `/api/cron/*` routes.

## Flow

```
Boosend (new contact/subscriber event)
  → POST /api/webhooks/boosend-contact?token=<BOOSEND_WEBHOOK_SECRET>
  → extractContact()      pulls email + first_name out of Boosend's payload
  → no email?             → { skipped: "no_email" }, no Kit call at all
  → has email             → Kit: POST /v4/subscribers (create/update, idempotent)
                           → Kit: POST /v4/tags/{id}/subscribers/{subscriber_id}
                             tags the contact "n8n_boosend"
```

## Auth

Boosend can only be configured with a plain URL (no custom headers), so the
secret rides in the URL itself as `?token=`, checked by
`requireWebhookToken` (`src/lib/webhook-auth.ts`) - same fail-closed shape as
`requireCron` (`src/lib/cron-auth.ts`), just reading a query param instead of
an `Authorization` header. Without a valid token the request 401s before any
Kit call is made.

## Payload shape

Boosend has no public payload schema docs. `extractContact()` tries several
common shapes (`body.email`, `body.contact.email`, `body.data.email`,
`body.subscriber.email`, `body.email_address`, and the equivalent for
`first_name`/`name`). If a real Boosend event doesn't match any of them, the
raw body gets logged (Vercel function logs) so the shape can be confirmed and
this function adjusted.

## Environment

- **Kit:** `KIT_API_KEY` (already required by `/api/subscribe`)
- **Boosend:** `BOOSEND_WEBHOOK_SECRET` - random token, also appended to the
  URL pasted into Boosend's integration settings

## Setup

1. Set `BOOSEND_WEBHOOK_SECRET` in Vercel's project env vars (Production).
2. Deploy.
3. In Boosend's integration settings, paste:
   `https://<your-domain>/api/webhooks/boosend-contact?token=<the secret>`

## Kit tag

`n8n_boosend`, id `22495453` (hardcoded as `KIT_N8N_BOOSEND_TAG_ID` in the
route). Created 2026-08-16, separate from the pre-existing `boosend_import`
tag used for past manual imports, so automated syncs stay distinguishable
from manual ones.
