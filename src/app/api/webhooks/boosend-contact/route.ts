import { NextResponse } from "next/server";
import { KIT_BASE, kitHeaders } from "@/lib/kit";
import { requireWebhookToken } from "@/lib/webhook-auth";

// Boosend's native Kit integration doesn't work, so Boosend is configured to
// POST new-contact events here instead (paste this route's URL, with the
// ?token= secret, into Boosend's integration settings). Real-time, no cron,
// no separate hosting: this rides the site's existing free Vercel deploy.
//
// Every contact with an email is created/updated in Kit and tagged
// "n8n_boosend" (id hardcoded below; see automation/n8n/README.md for how it
// was created). Contacts without an email are skipped entirely, no Kit call.
//
// Boosend has no public payload schema docs, so the email/name extraction
// below tries several common shapes. If a real event doesn't match any of
// them, the raw body is logged so the shape can be confirmed from the Vercel
// function logs and this extraction adjusted.
//
// Needs KIT_API_KEY (already used by /api/subscribe) and
// BOOSEND_WEBHOOK_SECRET env vars.

const KIT_N8N_BOOSEND_TAG_ID = "22495453";

function extractContact(body: Record<string, unknown>) {
  const b = body as Record<string, Record<string, unknown> | undefined>;
  const email =
    (body.email as string | undefined) ??
    (b.contact?.email as string | undefined) ??
    (b.data?.email as string | undefined) ??
    (b.subscriber?.email as string | undefined) ??
    (body.email_address as string | undefined) ??
    "";

  const name =
    (body.first_name as string | undefined) ??
    (body.firstName as string | undefined) ??
    (b.contact?.first_name as string | undefined) ??
    (b.data?.first_name as string | undefined) ??
    (typeof body.name === "string" ? body.name.split(" ")[0] : undefined) ??
    "";

  return { email: email.trim(), first_name: name };
}

export async function POST(req: Request) {
  const denied = requireWebhookToken(req, "BOOSEND_WEBHOOK_SECRET");
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email, first_name } = extractContact(body as Record<string, unknown>);
  if (!email) {
    console.log("boosend-contact: no email, skipping", JSON.stringify(body));
    return NextResponse.json({ skipped: "no_email" });
  }

  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing Kit config" }, { status: 500 });
  }
  const headers = { "Content-Type": "application/json", ...kitHeaders(apiKey) };

  const subRes = await fetch(`${KIT_BASE}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email, first_name: first_name || undefined }),
  });
  if (!subRes.ok) {
    console.error("boosend-contact: Kit create subscriber failed", subRes.status);
    return NextResponse.json({ error: "Kit create failed" }, { status: 502 });
  }
  const sub = (await subRes.json()) as { subscriber?: { id?: number } };
  const subscriberId = sub.subscriber?.id;
  if (!subscriberId) {
    return NextResponse.json({ error: "No subscriber id in Kit response" }, { status: 502 });
  }

  const tagRes = await fetch(
    `${KIT_BASE}/tags/${KIT_N8N_BOOSEND_TAG_ID}/subscribers/${subscriberId}`,
    { method: "POST", headers, body: "{}" },
  );
  if (!tagRes.ok) {
    console.error("boosend-contact: Kit tag failed", tagRes.status);
    return NextResponse.json({ ok: true, subscriberId, tagged: false });
  }

  return NextResponse.json({ ok: true, subscriberId, tagged: true });
}
