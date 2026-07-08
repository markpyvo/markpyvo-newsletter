import { NextResponse } from "next/server";
import { getImportedResources } from "@/lib/resource-store";

// Temporary diagnostic. Reports only booleans + counts (never secret values) so
// we can confirm which deployment is live and whether Supabase env is wired.
// Safe to delete once resources render on prod.
export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const url = rawUrl.replace(/\/$/, "");

  // Direct probe so we can see the real HTTP status (never expose the key).
  let status = -1;
  let bodyPreview = "";
  let host = "";
  try {
    host = new URL(rawUrl).host;
  } catch {
    host = "invalid-url";
  }
  try {
    const res = await fetch(`${url}/rest/v1/resources?select=slug,status`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    status = res.status;
    bodyPreview = (await res.text()).slice(0, 200);
  } catch (e) {
    bodyPreview = `fetch threw: ${e instanceof Error ? e.message : String(e)}`;
  }

  let published = -1;
  let all = -1;
  try {
    published = (await getImportedResources()).length;
    all = (await getImportedResources({ includeDrafts: true })).length;
  } catch {
    // leave as -1
  }
  return NextResponse.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
    supabaseHost: host,
    keyLength: key.length,
    keyEndsWithNewline: /\s$/.test(key),
    directStatus: status,
    directBodyPreview: bodyPreview,
    publishedCount: published,
    allCount: all,
  });
}
