// Server-only. Pulls resource emails from the dedicated Boosend Gmail inbox.
//
// This inbox only ever contains finished resource emails, so we read all of it
// (bounded by a lookback window) and let the store-level dedupe drop anything
// already imported. Uses the Gmail REST API via fetch, so there is no new
// dependency. It needs a Gmail OAuth access token with gmail.readonly scope in
// GMAIL_ACCESS_TOKEN. Without it, this returns [] and the importer no-ops.
//
// Getting a token: a one-time Google OAuth consent for the resources account,
// stored as a refresh token, exchanged for an access token per run. That
// exchange is a small addition once you decide to go live; wire it in
// getAccessToken() below.

import type { RawEmail } from "./resource-email";

const LOOKBACK_DAYS = 30;

async function getAccessToken(): Promise<string | null> {
  // Preferred: trade a long-lived refresh token for a fresh access token on
  // every run, so nothing ever expires. Set GMAIL_CLIENT_ID,
  // GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN.
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (clientId && clientSecret && refreshToken) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { access_token?: string };
        if (data.access_token) return data.access_token;
      }
    } catch {
      // fall through to a raw token / null
    }
  }
  // Fallback: a short-lived access token dropped straight into env (testing).
  return process.env.GMAIL_ACCESS_TOKEN ?? null;
}

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  // atob is available in the Vercel/Edge and Node runtimes used here.
  const binary = atob(normalized);
  try {
    // Preserve UTF-8 characters from the email body.
    return decodeURIComponent(
      binary
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
  } catch {
    return binary;
  }
}

type GmailPart = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPart[];
};

function extractHtml(part: GmailPart | undefined): string {
  if (!part) return "";
  if (part.mimeType === "text/html" && part.body?.data) {
    return decodeBase64Url(part.body.data);
  }
  for (const child of part.parts ?? []) {
    const found = extractHtml(child);
    if (found) return found;
  }
  return "";
}

function header(headers: { name: string; value: string }[], name: string) {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function fetchResourceEmails(): Promise<RawEmail[]> {
  const token = await getAccessToken();
  if (!token) return [];
  const auth = { Authorization: `Bearer ${token}` };

  try {
    const after = Math.floor(
      (Date.now() - LOOKBACK_DAYS * 86400_000) / 1000,
    );
    // The resource emails are the ones you SEND from this account; received
    // mail (security alerts, bounces, account notices) is noise. `in:sent`
    // scopes to only your outgoing resource emails. Override GMAIL_QUERY (e.g.
    // to a Gmail label like `label:resources`) if you ever need to narrow it.
    const base = process.env.GMAIL_QUERY?.trim() || "in:sent";
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
        `${base} after:${after}`,
      )}&maxResults=100`,
      { headers: auth, cache: "no-store" },
    );
    if (!listRes.ok) return [];
    const list = (await listRes.json()) as { messages?: { id: string }[] };
    const ids = (list.messages ?? []).map((m) => m.id);

    const emails: RawEmail[] = [];
    for (const id of ids) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
        { headers: auth, cache: "no-store" },
      );
      if (!msgRes.ok) continue;
      const msg = (await msgRes.json()) as {
        id: string;
        internalDate?: string;
        payload?: GmailPart & { headers?: { name: string; value: string }[] };
      };
      const headers = msg.payload?.headers ?? [];
      const html = extractHtml(msg.payload);
      if (!html) continue;
      emails.push({
        id: msg.id,
        subject: header(headers, "subject"),
        html,
        date: new Date(Number(msg.internalDate ?? Date.now())).toISOString(),
      });
    }
    return emails;
  } catch {
    return [];
  }
}
