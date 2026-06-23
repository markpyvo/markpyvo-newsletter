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
    subject: "you're in.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>welcome to 0→1</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f1;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;" align="center">
              <img src="https://markpyvo.ca/logo.svg" alt="0→1" width="120" height="48" style="display:block;" />
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:8px;border:1px solid #e2e0d8;padding:48px 48px 40px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td style="vertical-align:top;">
                    <p style="margin:0 0 20px;font-size:13px;font-weight:500;letter-spacing:2.5px;color:#888780;text-transform:uppercase;">welcome aboard</p>
                    <h1 style="margin:0;font-size:32px;font-weight:700;line-height:1.2;color:#111110;letter-spacing:-1px;">you're in.</h1>
                  </td>
                  <td style="vertical-align:top;text-align:right;width:110px;">
                    <img src="https://markpyvo.ca/mark-pro.png" alt="Mark" width="100" height="100" style="display:inline-block;object-fit:cover;border-radius:0;" />
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#3a3a38;">
                hey, i'm mark. 19-year-old cs student at mcgill, making content about ai and tech on the side.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#3a3a38;">
                i started 0&#8594;1 because i kept discovering tools, shortcuts, and ways of building that nobody really talks about. the stuff that would've saved me hours when i was just getting started. that's what this is.
              </p>
              <div style="border-top:1px solid #e2e0d8;margin-bottom:32px;"></div>
              <p style="margin:0 0 20px;font-size:13px;font-weight:500;letter-spacing:2.5px;color:#888780;text-transform:uppercase;">every monday you'll get</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr><td style="padding-bottom:16px;"><table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:20px;vertical-align:top;padding-top:2px;"><span style="display:inline-block;width:6px;height:6px;background:#534AB7;border-radius:50%;margin-top:6px;"></span></td>
                  <td style="font-size:15px;line-height:1.6;color:#3a3a38;"><strong style="color:#111110;font-weight:600;">ai tools</strong> worth actually using</td>
                </tr></table></td></tr>
                <tr><td style="padding-bottom:16px;"><table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:20px;vertical-align:top;"><span style="display:inline-block;width:6px;height:6px;background:#534AB7;border-radius:50%;margin-top:6px;"></span></td>
                  <td style="font-size:15px;line-height:1.6;color:#3a3a38;"><strong style="color:#111110;font-weight:600;">vibe coding</strong> tips and tricks</td>
                </tr></table></td></tr>
                <tr><td style="padding-bottom:16px;"><table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:20px;vertical-align:top;"><span style="display:inline-block;width:6px;height:6px;background:#534AB7;border-radius:50%;margin-top:6px;"></span></td>
                  <td style="font-size:15px;line-height:1.6;color:#3a3a38;"><strong style="color:#111110;font-weight:600;">automations</strong> that actually save time</td>
                </tr></table></td></tr>
                <tr><td><table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:20px;vertical-align:top;"><span style="display:inline-block;width:6px;height:6px;background:#534AB7;border-radius:50%;margin-top:6px;"></span></td>
                  <td style="font-size:15px;line-height:1.6;color:#3a3a38;">whatever i'm <strong style="color:#111110;font-weight:600;">building or figuring out</strong> that week</td>
                </tr></table></td></tr>
              </table>
              <div style="border-top:1px solid #e2e0d8;margin:32px 0;"></div>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#3a3a38;">
                reply to this email anytime. i read every single one. even if you just want to say hi or ask something about cs or ai, i'm here.
              </p>
              <p style="margin:0;font-size:15px;color:#3a3a38;line-height:1.7;">
                talk soon,<br/>
                <strong style="color:#111110;font-weight:600;">mark</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;" align="center">
              <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:12px;color:#888780;">
                0&#8594;1 by mark pyvo &nbsp;·&nbsp; markpyvo.ca
              </p>
              <p style="margin:0;font-size:12px;color:#aaa9a5;">
                <a href="https://markpyvo.ca/unsubscribe?email=${encodeURIComponent(email)}" style="color:#aaa9a5;text-decoration:underline;">unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  return NextResponse.json({ ok: true });
}
