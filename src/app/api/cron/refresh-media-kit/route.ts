import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireCron } from "@/lib/cron-auth";

// Weekly Vercel cron (see vercel.json). Vercel sends
// `Authorization: Bearer <CRON_SECRET>`; requireCron rejects anything else (and
// is fail-closed if CRON_SECRET is unset). Busting these tags makes the
// partnerships page re-pull the live Instagram + Kit numbers on the next request.
export async function GET(req: Request) {
  const denied = requireCron(req);
  if (denied) return denied;

  revalidateTag("instagram-stats", "max");
  revalidateTag("kit-subscribers", "max");
  return NextResponse.json({ revalidated: true });
}
