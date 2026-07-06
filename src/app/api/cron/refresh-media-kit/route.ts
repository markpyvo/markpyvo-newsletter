import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Weekly Vercel cron (see vercel.json). Vercel sends
// `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set in the project
// env, so we reject anything else. Busting these tags makes the partnerships
// page re-pull the live Instagram + Kit numbers on the next request.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  revalidateTag("instagram-stats", "max");
  revalidateTag("kit-subscribers", "max");
  return NextResponse.json({ revalidated: true });
}
