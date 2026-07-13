// Server-only. Persistence for imported resources.
//
// Auto-publish needs a runtime store because a Vercel cron can't commit to the
// repo. This uses Supabase's REST API (already a connector on this project) via
// plain fetch, matching the style of lib/kit.ts. Everything degrades to a
// graceful no-op when the env is missing, so the site keeps working with only
// the hand-written seeds in resources.ts until you wire Supabase up.
//
// Expected table `resources` (create once):
//   slug text primary key, title text, teaser text, type text, tool text,
//   url text, date date, popularity int, body_html text, source_id text
//
// Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the project env.

import type { Resource } from "./resources";
import { RESOURCES } from "./resources";
import { mergeResources } from "./resource-email";

type Row = {
  slug: string;
  title: string;
  teaser: string;
  type: string;
  tool: string;
  url: string;
  date: string;
  popularity: number | null;
  body_html: string | null;
  source_id: string | null;
  status: string | null;
  review_token: string | null;
};

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

// The service-role auth headers every Supabase REST call needs. Kept in one
// place so the key/scheme is not re-typed at each fetch site.
function authHeaders(cfg: { key: string }) {
  return { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` };
}

function rowToResource(r: Row): Resource {
  return {
    slug: r.slug,
    title: r.title,
    teaser: r.teaser,
    type: r.type as Resource["type"],
    tool: r.tool as Resource["tool"],
    url: r.url,
    date: r.date,
    popularity: r.popularity ?? undefined,
    bodyHtml: r.body_html ?? undefined,
    sourceId: r.source_id ?? undefined,
    status: (r.status as Resource["status"]) ?? "published",
    reviewToken: r.review_token ?? undefined,
  };
}

function resourceToRow(r: Resource): Row {
  return {
    slug: r.slug,
    title: r.title,
    teaser: r.teaser,
    type: r.type,
    tool: r.tool,
    url: r.url,
    date: r.date,
    popularity: r.popularity ?? null,
    body_html: r.bodyHtml ?? null,
    source_id: r.sourceId ?? null,
    status: r.status ?? "published",
    review_token: r.reviewToken ?? null,
  };
}

// Read imported resources. Always reads fresh from Supabase (no-store) so the
// list reflects approvals and imports immediately. Published-only by default;
// pass { includeDrafts: true } to also get drafts (the importer needs this so
// its dedupe sees un-approved drafts and never re-imports them). Returns []
// when Supabase is not configured or the request fails.
export async function getImportedResources(
  opts: { includeDrafts?: boolean } = {},
): Promise<Resource[]> {
  const cfg = config();
  if (!cfg) return [];
  const statusFilter = opts.includeDrafts ? "" : "&status=eq.published";
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/resources?select=*${statusFilter}&order=date.desc`,
      {
        headers: authHeaders(cfg),
        // Always read fresh so the list/detail reflect approvals and imports
        // immediately. One small Supabase query per view is fine at this traffic
        // and avoids the stale-cache bugs the tagged cache kept causing.
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Row[];
    return rows.map(rowToResource);
  } catch {
    return [];
  }
}

// The list the site actually renders: hand-written seeds from resources.ts plus
// every PUBLISHED import, deduped by slug/source id. Drafts are excluded.
export async function getAllResources(): Promise<Resource[]> {
  const imported = await getImportedResources();
  const { merged } = mergeResources(RESOURCES, imported);
  return merged;
}

// Fetch a single resource (any status) for the review/preview page. Uncached so
// a just-imported draft shows immediately. Returns null when not found.
export async function getResourceForReview(
  slug: string,
): Promise<Resource | null> {
  const cfg = config();
  if (!cfg) return null;
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/resources?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      {
        headers: authHeaders(cfg),
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Row[];
    return rows[0] ? rowToResource(rows[0]) : null;
  } catch {
    return null;
  }
}

// Publish a draft after review. Requires the matching review token, so the link
// in the approval email is the only way to flip it live. The token is cleared on
// success, making the approve link single-use: a replay of the same link finds
// no row with that token and is rejected. Returns true on success.
export async function publishResource(
  slug: string,
  token: string,
): Promise<boolean> {
  const cfg = config();
  if (!cfg || !token) return false;
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/resources?slug=eq.${encodeURIComponent(slug)}&review_token=eq.${encodeURIComponent(token)}`,
      {
        method: "PATCH",
        headers: {
          ...authHeaders(cfg),
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status: "published", review_token: null }),
      },
    );
    if (!res.ok) return false;
    const rows = (await res.json()) as Row[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

// Upsert imported resources (keyed on slug). Used by the cron importer.
export async function saveImportedResources(
  resources: Resource[],
): Promise<boolean> {
  const cfg = config();
  if (!cfg || resources.length === 0) return false;
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/resources?on_conflict=slug`,
      {
        method: "POST",
        headers: {
          ...authHeaders(cfg),
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(resources.map(resourceToRow)),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
