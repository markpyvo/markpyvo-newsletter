import { NextResponse } from "next/server";
import { getImportedResources } from "@/lib/resource-store";

// Temporary diagnostic. Reports only booleans + counts (never secret values) so
// we can confirm which deployment is live and whether Supabase env is wired.
// Safe to delete once resources render on prod.
export const dynamic = "force-dynamic";

export async function GET() {
  const hasUrl = Boolean(process.env.SUPABASE_URL);
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
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
    hasSupabaseUrl: hasUrl,
    hasSupabaseServiceKey: hasKey,
    publishedCount: published,
    allCount: all,
  });
}
