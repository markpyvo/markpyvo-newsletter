import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  // Find the subscription by email
  const searchRes = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions/by_email/${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  if (!searchRes.ok) {
    return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  }

  const { data } = await searchRes.json();
  const subId = data?.id;

  if (!subId) {
    return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  }

  // Delete the subscription
  await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions/${subId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  return NextResponse.json({ ok: true });
}
