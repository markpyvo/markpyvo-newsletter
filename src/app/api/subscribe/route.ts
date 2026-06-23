import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return NextResponse.json({ error: "Missing Beehiiv config" }, { status: 500 });
  }

  // Add to Beehiiv
  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: false,
        utm_source: "markpyvo.ca",
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Beehiiv error" }, { status: 500 });
  }

  // Send welcome email via Resend
  await resend.emails.send({
    from: "Mark <mark@markpyvo.ca>",
    to: email,
    subject: "You're in 🎉",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #111;">
        <p style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Welcome to 0→1 by Mark</p>
        <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 16px;">
          Hey! I'm Mark — a 19-year-old CS student at McGill. Every week I send one practical tip on AI or CS that I wish I had when I was starting out.
        </p>
        <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 24px;">
          No fluff. No spam. Just the stuff that actually matters.
        </p>
        <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 8px;">
          First issue hits your inbox soon. Talk then.
        </p>
        <p style="font-size: 16px; color: #444; margin: 0;">— Mark</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="font-size: 12px; color: #999;">
          You subscribed at markpyvo.ca. <a href="https://markpyvo.ca/unsubscribe?email=${encodeURIComponent(email)}" style="color: #999;">Unsubscribe</a> anytime.
        </p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
