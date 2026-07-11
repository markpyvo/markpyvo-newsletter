import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { fetchResourceEmails } from "@/lib/resource-source";
import {
  emailToResource,
  mergeResources,
  deEmDash,
  htmlToText,
} from "@/lib/resource-email";
import { rewriteToArticle } from "@/lib/resource-rewrite";
import { sendReviewEmail } from "@/lib/review-email";
import { randomUUID } from "node:crypto";
import {
  getImportedResources,
  saveImportedResources,
} from "@/lib/resource-store";
import { requireCron } from "@/lib/cron-auth";

// LLM rewrite (when configured) can take a few seconds per email.
export const maxDuration = 60;

// Daily Vercel cron (see vercel.json). Reads the dedicated Boosend resources
// inbox, converts each new HTML email into a resource + blog-post body (LLM
// rewrite when configured), dedupes against what's already imported, and saves
// the new ones as DRAFTS. Each draft gets a review email with an approve link;
// it stays hidden from the site until approved.
//
// Auth: Vercel sends `Authorization: Bearer <CRON_SECRET>`; requireCron rejects
// anything else (and is fail-closed if CRON_SECRET is unset). Everything
// downstream no-ops gracefully when GMAIL_ACCESS_TOKEN / SUPABASE_* env is
// missing, so this is safe to deploy before the integrations are wired.
export async function GET(req: Request) {
  const denied = requireCron(req);
  if (denied) return denied;

  const emails = await fetchResourceEmails();
  const rawById = new Map(emails.map((e) => [e.id, e]));
  const parsed = emails.map(emailToResource);

  // Dedupe against ALL imported rows, including drafts: otherwise an
  // un-approved draft is re-imported every run, re-running the paid LLM
  // rewrite, minting a fresh review token (invalidating yesterday's approve
  // link), and sending a duplicate review email.
  const existing = await getImportedResources({ includeDrafts: true });
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
    if (r.bodyHtml) {
      r.bodyHtml = deEmDash(r.bodyHtml);
      // Rebuild the teaser from the FINAL (cleaned) body so it never leaks the
      // eyebrow glyph, greeting, or raw HTML the pre-LLM text picked up.
      const text = deEmDash(htmlToText(r.bodyHtml));
      r.teaser = text.length > 160 ? `${text.slice(0, 160).trim()}...` : text;
    } else {
      r.teaser = deEmDash(r.teaser);
    }
  }

  let emailed = 0;
  if (added.length > 0) {
    const saved = await saveImportedResources(added);
    // If persistence failed, don't email review links: their approve tokens
    // point at rows that were never stored, so approval would silently fail.
    if (!saved) {
      return NextResponse.json(
        { error: "Failed to save imported resources", scanned: emails.length },
        { status: 500 },
      );
    }
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
