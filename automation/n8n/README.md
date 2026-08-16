# Boosend -> Kit contact sync (n8n)

> **This is a local prototype, not the production path.** Making this
> automatic for real would require keeping n8n reachable from the internet
> 24/7, i.e. paying for hosting. Production automation lives instead as a
> Vercel API route on this site's existing free deploy: see
> `docs/boosend-kit-sync.md` and `src/app/api/webhooks/boosend-contact/`.
> This n8n workflow is kept around because it was built and tested first and
> is useful for visually inspecting the logic; it is not active anywhere.

Boosend's native Kit integration doesn't work, so this workflow replaces it.
It listens for Boosend's outbound webhook on new contacts, skips anything with
no email address, and otherwise creates/updates the contact in Kit and tags
them `n8n_boosend`.

## Why a webhook, not polling

Boosend's own n8n instructions are: create a Webhook node in n8n, activate the
workflow, copy the *production* URL, and paste it into Boosend's settings. That
means Boosend pushes to us on new-contact events, so no scheduled polling of a
Boosend "list contacts" API is needed, and **no Boosend API key is required**
for this workflow at all.

## Workflow file

`boosend-to-kit.workflow.json` - imported into a local n8n instance with:

```bash
N8N_USER_FOLDER=~/Developer/n8n-local npx n8n import:workflow \
  --input=automation/n8n/boosend-to-kit.workflow.json
```

Re-run that command any time this file changes; it upserts in place by
workflow id, it won't create a duplicate.

## Nodes

1. **Boosend Webhook** - `POST` trigger, path `/webhook/boosend-new-contact`.
   Responds immediately (`onReceived`) so Boosend's request doesn't hang while
   Kit calls run.
2. **Debug: Raw Boosend Payload** - passthrough Set node, stamps
   `_debug_stage`. Click this node's output after a test run to see exactly
   what Boosend sent, since Boosend has no public payload schema docs.
3. **Extract Email + Name** - normalizes `email` / `first_name` out of the raw
   payload, trying several common shapes (`body.email`, `body.contact.email`,
   `body.data.email`, `body.subscriber.email`). **This is the node you'll
   likely need to adjust** once you see Boosend's real payload shape in step 2
   - keep whichever path matches and delete the rest of the fallback chain.
4. **Has Email?** (IF) - `notEmpty` check on the extracted `email` field.
   - False branch -> **Skipped: No Email** (NoOp, ends here, no Kit call).
   - True branch -> continues to Kit.
5. **Kit: Create Or Update Subscriber** - `POST /v4/subscribers` with
   `email_address` + `first_name`. Kit's API is idempotent here: an existing
   email returns `200` (and updates the first name) instead of erroring, so
   there's nothing extra to handle for "subscriber already exists."
6. **Debug: Kit Subscriber Response** - extracts `subscriber_id` for the next
   call, stamps `_debug_stage`.
7. **Kit: Tag n8n_boosend** - `POST /v4/tags/{tag_id}/subscribers/{id}`.
   `onError: continueErrorOutput` so a genuine failure (bad tag id, transient
   network error) doesn't kill the run; it instead routes to a separate debug
   branch instead of being silently swallowed.
8. **Debug: Tag Applied OK** / **Debug: Tag Apply FAILED** - terminal nodes so
   you can see the outcome of every run at a glance in the executions list.

## Setup still needed (from you)

1. **Kit credential.** There's no separate top-level "Credentials" menu item
   in this n8n build; create it from inside a node instead:
   - Open `Kit: Create Or Update Subscriber`.
   - Under "Authentication," it's already set to "Generic Credential Type" ->
     "Header Auth." Click the "Credential for Header Auth" dropdown -> "+
     Create new credential."
   - Name it `Kit API Key`, set "Name" (header name) to `X-Kit-Api-Key`,
     "Value" to your Kit API key. Save.
   - Open `Kit: Tag n8n_boosend` and select that same `Kit API Key` credential
     from its dropdown (it won't carry over automatically between nodes).
2. **Tag id.** Done - created a dedicated `n8n_boosend` tag (id `22495453`,
   created 2026-08-16) rather than reusing `boosend_import`, so automated
   syncs stay distinguishable from your manual imports. Hardcoded into the
   `Kit: Tag n8n_boosend` node's URL.
3. **Boosend webhook URL.** Once the workflow is active, copy the production
   webhook URL from the Boosend Webhook node and paste it into Boosend's
   integration settings, per Boosend's own n8n instructions.

## Test plan (do this before turning on the real Boosend webhook)

n8n's Webhook node exposes both a **Test URL** (only listens while you have
the node's "Listen for test event" panel open, and logged in) and a
**Production URL** (works once the workflow is Active). For manual testing,
use the test URL so you can inspect each node's output in the editor.

1. Open the workflow, click the Boosend Webhook node, click "Listen for test
   event."
2. **Path A - has email:**
   ```bash
   curl -X POST <test-webhook-url> \
     -H "Content-Type: application/json" \
     -d '{"email": "test+boosend@example.com", "first_name": "Test"}'
   ```
   Expect: `Has Email?` takes the true branch, a subscriber appears in Kit
   tagged `n8n_boosend`, and `Debug: Tag Applied OK` shows the final item.
3. **Path B - no email:**
   ```bash
   curl -X POST <test-webhook-url> \
     -H "Content-Type: application/json" \
     -d '{"first_name": "NoEmail Test"}'
   ```
   Expect: `Has Email?` takes the false branch straight to `Skipped: No Email`
   and neither Kit node executes at all (check the execution graph: those
   nodes should show as not run).
4. Once both paths look right, adjust the `Extract Email + Name` node to match
   Boosend's real payload shape (from step 2's raw payload), then activate the
   workflow and paste the **production** URL into Boosend.
