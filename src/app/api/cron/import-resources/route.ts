import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { fetchResourceEmails } from "@/lib/resource-source";
import { emailToResource, mergeResources, deEmDash } from "@/lib/resource-email";
import { rewriteToArticle } from "@/lib/resource-rewrite";
import { sendReviewEmail } from "@/lib/review-email";
import { randomUUID } from "node:crypto";
import {
  getImportedResources,
  saveImportedResources,
} from "@/lib/resource-store";

// LLM rewrite (when configured) can take a few seconds per email.
export const maxDuration = 60;

// Daily Vercel cron (see vercel.json). Reads the dedicated Boosend resources
// inbox, converts each new HTML email into a resource + blog-post body (LLM
// rewrite when configured), dedupes against what's already imported, and saves
// the new ones as DRAFTS. Each draft gets a review email with an approve link;
// it stays hidden from the site until approved.
//
// Auth: Vercel sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is
// set, so we reject anything else. Everything downstream no-ops gracefully when
// GMAIL_ACCESS_TOKEN / SUPABASE_* env is missing, so this is safe to deploy
// before the integrations are wired.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const emails = await fetchResourceEmails();
  const rawById = new Map(emails.map((e) => [e.id, e]));
  const parsed = emails.map(emailToResource);

  const existing = await getImportedResources({ fresh: true });
  const { added } = mergeResources(existing, parsed);

  // For each new draft: LLM-rewrite the body (when configured; falls back to the
  // deterministic body) and mint a review token for the approval link.
  for (const r of added) {
    r.reviewToken = randomUUID();
    const raw = r.sourceId ? rawById.get(r.sourceId) : undefined;
    if (raw) {
      const better = await rewriteToArticle(raw.html, r.title);
      if (better) r.bodyHtml = better;
    }
    // No em dashes anywhere on the posts.
    r.title = deEmDash(r.title);
    r.teaser = deEmDash(r.teaser);
    if (r.bodyHtml) r.bodyHtml = deEmDash(r.bodyHtml);
  }

  let emailed = 0;
  if (added.length > 0) {
    await saveImportedResources(added);
    // Email a review link for each new draft (best-effort).
    for (const r of added) {
      if (await sendReviewEmail(r)) emailed += 1;
    }
    revalidateTag("resources", "max");
  }

  return NextResponse.json({
    scanned: emails.length,
    drafted: added.length,
    emailed,
    slugs: added.map((r) => r.slug),
  });
}
