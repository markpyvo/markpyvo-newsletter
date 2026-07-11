import { NextResponse } from "next/server";

// Shared gate for the Vercel cron routes. Vercel sends
// `Authorization: Bearer <CRON_SECRET>` on scheduled invocations. This is
// fail-closed: if CRON_SECRET is not configured, or the header does not match,
// the request is rejected. Returns a 401 response to send back, or null when
// the caller is authorized.
export function requireCron(req: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return null;
}
