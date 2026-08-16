import { NextResponse } from "next/server";

// Shared gate for inbound third-party webhooks that can only be configured
// with a plain URL (no custom headers), like Boosend's. The secret rides in
// the URL as a query param instead of an Authorization header. Fail-closed:
// if the env var is unset, or the param is missing/wrong, the request is
// rejected. Returns a 401 response to send back, or null when authorized.
export function requireWebhookToken(
  req: Request,
  envVar: string,
): NextResponse | null {
  const secret = process.env[envVar];
  const token = new URL(req.url).searchParams.get("token");
  if (!secret || token !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return null;
}
