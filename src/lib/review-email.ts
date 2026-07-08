// Server-only. Emails you a review link for each newly imported (draft)
// resource, via Resend. Best-effort: if it fails or isn't configured, the
// import still succeeds; the draft just waits in Supabase.
//
// Env: RESEND_API_KEY (required), REVIEW_EMAIL_TO (default markpyvotips@gmail.com),
// REVIEW_EMAIL_FROM (a Resend-verified sender; default onboarding@resend.dev),
// SITE_URL (public base for the link, e.g. https://markpyvo.ca).

import type { Resource } from "./resources";

export function siteBaseUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function reviewUrl(resource: Resource): string {
  const token = resource.reviewToken ?? "";
  return `${siteBaseUrl()}/resources/review/${resource.slug}?token=${encodeURIComponent(token)}`;
}

export async function sendReviewEmail(resource: Resource): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const to = process.env.REVIEW_EMAIL_TO || "markpyvotips@gmail.com";
  const from = process.env.REVIEW_EMAIL_FROM || "onboarding@resend.dev";
  const url = reviewUrl(resource);

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a">
    <p style="font-size:11px;letter-spacing:0.5px;text-transform:uppercase;color:#4040ff;font-weight:700;margin:0 0 8px">New resource to review</p>
    <h1 style="font-size:22px;line-height:1.3;margin:0 0 8px">${escapeHtml(resource.title)}</h1>
    <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0 0 20px">${escapeHtml(resource.teaser)}</p>
    <p style="font-size:12px;color:#9ca3af;margin:0 0 20px">${escapeHtml(resource.type)} &middot; ${escapeHtml(resource.tool)}</p>
    <a href="${url}" style="display:inline-block;background:#4040ff;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:9999px">Preview &amp; approve &rarr;</a>
    <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:24px 0 0">It stays hidden from the site until you approve it on that page.</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Review: ${resource.title}`,
        html,
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
