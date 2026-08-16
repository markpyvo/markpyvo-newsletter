import { NextResponse } from "next/server";
import { KIT_BASE, kitHeaders } from "@/lib/kit";
import { requireCron } from "@/lib/cron-auth";

// Daily Vercel cron (see vercel.json). Reads the newest Boosend contacts
// staged by a separate scheduled Claude cloud routine into the private repo
// markpyvo/boosend-sync-data (data/latest-contacts.json), then syncs each one
// with an email into Kit: create/update subscriber + tag "n8n_boosend".
//
// Why a private repo instead of calling Kit directly from the cloud routine:
// that routine's sandbox has an outbound network policy that blocks calls to
// markpyvo.ca, but git push to GitHub works. So the routine stages contacts
// there, and this cron (running on Vercel's own network, no such restriction)
// picks them up. See automation/boosend-sync/README.md for the full picture.
//
// Needs KIT_API_KEY (already used elsewhere) and GITHUB_SYNC_DATA_TOKEN (a
// fine-grained GitHub PAT, Contents: Read-only, scoped to just that repo).

const KIT_N8N_BOOSEND_TAG_ID = "22495453";
const HANDOFF_REPO = "markpyvo/boosend-sync-data";
const HANDOFF_PATH = "data/latest-contacts.json";

type Contact = { email: string; first_name?: string };

export async function GET(req: Request) {
  const denied = requireCron(req);
  if (denied) return denied;

  const githubToken = process.env.GITHUB_SYNC_DATA_TOKEN;
  const kitApiKey = process.env.KIT_API_KEY;
  if (!githubToken || !kitApiKey) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const fileRes = await fetch(
    `https://api.github.com/repos/${HANDOFF_REPO}/contents/${HANDOFF_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.raw+json",
      },
      cache: "no-store",
    },
  );
  if (!fileRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch hand-off file", status: fileRes.status },
      { status: 502 },
    );
  }
  const data = (await fileRes.json()) as { fetched_at: string; contacts: Contact[] };

  const headers = { "Content-Type": "application/json", ...kitHeaders(kitApiKey) };
  let synced = 0;
  let failed = 0;

  for (const contact of data.contacts) {
    const email = contact.email?.trim();
    if (!email) continue;

    const subRes = await fetch(`${KIT_BASE}/subscribers`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email_address: email,
        first_name: contact.first_name || undefined,
      }),
    });
    if (!subRes.ok) {
      failed += 1;
      continue;
    }
    const sub = (await subRes.json()) as { subscriber?: { id?: number } };
    const subscriberId = sub.subscriber?.id;
    if (!subscriberId) {
      failed += 1;
      continue;
    }

    const tagRes = await fetch(
      `${KIT_BASE}/tags/${KIT_N8N_BOOSEND_TAG_ID}/subscribers/${subscriberId}`,
      { method: "POST", headers, body: "{}" },
    );
    if (tagRes.ok) {
      synced += 1;
    } else {
      failed += 1;
    }
  }

  return NextResponse.json({
    fetchedAt: data.fetched_at,
    totalContacts: data.contacts.length,
    synced,
    failed,
  });
}
