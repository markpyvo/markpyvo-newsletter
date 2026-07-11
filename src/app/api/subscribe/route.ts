import { NextRequest, NextResponse } from "next/server";

// Adds a landing-page signup to Kit. Kit's form handles the welcome/
// confirmation email, so no email is sent from here.
//
// v4 "add subscriber to form" expects the subscriber to exist, so we create
// them first (idempotent), then add them to the form which fires the welcome.
// Needs KIT_API_KEY and KIT_FORM_ID env vars.
const KIT_BASE = "https://api.kit.com/v4";

export async function POST(req: NextRequest) {
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;
  if (!apiKey || !formId) {
    return NextResponse.json({ error: "Missing Kit config" }, { status: 500 });
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": apiKey,
  };

  // 1. Ensure the subscriber exists (201 created, or already exists).
  await fetch(`${KIT_BASE}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email }),
  });

  // 2. Add them to the form, which triggers Kit's welcome email.
  const res = await fetch(`${KIT_BASE}/forms/${formId}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email, referrer: "https://markpyvo.ca" }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Kit error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
