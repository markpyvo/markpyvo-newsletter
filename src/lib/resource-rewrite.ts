// Server-only. Rewrites a raw marketing/newsletter email into a clean, well
// structured blog article using an LLM. Emails fake their structure with styled
// <div>s, so deterministic regex cleanup (htmlToArticle) produces a flat wall of
// paragraphs. An LLM understands the structure and rebuilds real headings, lists,
// and code blocks.
//
// Provider-agnostic: any OpenAI-compatible /chat/completions endpoint works
// (MiniMax international, OpenAI, DeepSeek, Together, Groq, ...). Configure:
//   LLM_API_KEY, LLM_BASE_URL (e.g. https://api.minimax.io/v1), LLM_MODEL
// When unset or the call fails, the caller keeps the regex fallback body, so
// this is always safe to ship.

import { stripEmailChrome } from "./resource-email";
import type { ResourceAeo } from "./resources";

// Tags the final article is allowed to contain. Everything else is unwrapped.
const ALLOWED = new Set([
  "h2", "h3", "h4", "p", "ul", "ol", "li", "pre", "code", "blockquote",
  "a", "strong", "b", "em", "i", "br", "hr",
]);

// Allow only http(s), mailto, and root-relative links; everything else (e.g.
// javascript:) is dropped to a bare <a>.
function safeAnchor(href: string): string {
  return /^(https?:|mailto:|\/)/i.test(href) ? `<a href="${href}">` : "<a>";
}

// Strip an email down to structure + text for the model: no <head>, scripts,
// styles, images, comments, or attributes (except link hrefs). Tags are kept so
// the model can see the DOM shape. Capped so a runaway email can't blow the
// context / token budget.
function stripForLlm(html: string): string {
  let s = stripEmailChrome(html).replace(/<img\b[^>]*>/gi, "");
  s = s.replace(/<a\b[^>]*?href\s*=\s*"([^"]*)"[^>]*>/gi, (_m, href) =>
    safeAnchor(href),
  );
  s = s.replace(/<(?!\/)(?!a[\s>])([a-zA-Z][\w:-]*)\b[^>]*>/g, "<$1>");
  s = s.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return s.slice(0, 24000);
}

// Reasoning models (e.g. MiniMax-M2.5) prefix a <think>...</think> block before
// the answer; drop it entirely.
function stripThink(s: string): string {
  return s
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^[\s\S]*?<\/think>/i, "")
    .replace(/<\/?think>/gi, "")
    .trim();
}

function stripCodeFences(s: string): string {
  return s
    .replace(/^﻿/, "")
    .replace(/^\s*```(?:html)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

// Keep the model honest: unwrap any tag it used outside the allowlist and drop
// every attribute except link hrefs.
function sanitizeArticleHtml(html: string): string {
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  // Tag-by-tag: unwrap anything outside the allowlist, drop attributes from the
  // rest, and keep only a safe href on links.
  s = s.replace(/<(\/?)([a-zA-Z][\w:-]*)\b[^>]*>/g, (m, slash, tag) => {
    const name = String(tag).toLowerCase();
    if (!ALLOWED.has(name)) return "";
    if (name === "a" && !slash) {
      const href = m.match(/href\s*=\s*"([^"]*)"/i)?.[1] ?? "";
      return safeAnchor(href);
    }
    return `<${slash}${name}>`;
  });
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

const SYSTEM_PROMPT = `You convert a marketing/newsletter email (given as messy HTML) into a clean, well-structured blog article in HTML.

Rules:
- Output ONLY HTML. No markdown, no code fences, no preamble, no closing remarks.
- Use ONLY these tags: <h2> <h3> <h4> <p> <ul> <ol> <li> <pre> <code> <blockquote> <a href="..."> <strong> <em> <br> <hr>. No classes, no styles, no inline attributes other than an <a> href.
- Do NOT include the article's main title as a heading (the page renders it separately).
- Reconstruct the real structure: numbered/labeled item lists become <h3> headings (or an <ol>/<ul>), sub-labels and descriptions become <p>. Commands, code, or things prefixed with "$" become <pre><code>...</code></pre>.
- Adapt the copy to read as a standalone BLOG POST, not an email. Keep the author's voice, the facts, and every real link, but rewrite or drop anything that assumes email/video/DM context or a prior interaction, e.g. "you commented the keyword", "the tool I showed in the video", "as promised", "like I said in the newsletter", "reply to this email", "click here to unlock". A reader landing cold on this page must never be confused by missing context. Open with a hook that stands on its own.
- Do not invent facts, add filler or commentary, or change the substance. Keep it concise.
- Remove email cruft: preheader text, decorative glyphs or eyebrow labels (e.g. "</>", "A GITHUB STARTER SHELF"), greetings ("Hi all", "Hey"), sign-offs ("Best,", "Cheers", a name signature), logos, "view in browser", social icons, unsubscribe/footer legal.
- If there is a primary link or call to action (e.g. a Google Doc, a signup, a repo), include it exactly once as its own paragraph on its own line: <p><a href="URL">Short label</a></p>. Do NOT also paste the raw URL as a "or paste this link" fallback, and do not repeat the same link twice.
- Keep it tight and readable, like a native blog post.`;

// ── Answer-engine (AEO) content generation ───────────────────────────────────

// Turn the finished article into a plain-text prompt for the AEO pass. Reuses
// the article stripper (it already unwraps tags to text-ish content) and caps
// length so a long post can't blow the token budget.
function articleToPlainish(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 16000);
}

const AEO_SYSTEM_PROMPT = `You write answer-engine-optimized (AEO) metadata for a blog post so that AI assistants (ChatGPT, Perplexity, Google AI Overviews) can quote it accurately.

Given the post's title and body, return ONLY a JSON object with this exact shape:
{
  "summary": "1-2 sentence direct answer to what this post is about, written so it reads well quoted out of context. Lead with the concrete answer, not 'This post explains...'.",
  "keyTakeaways": ["3 to 5 short, self-contained, scannable bullets. Each is a complete statement, not a fragment."],
  "faqs": [{"q": "A natural question a real person would type or ask about this topic", "a": "A concise, self-contained answer (1-3 sentences) that stands on its own"}]
}

Rules:
- Output ONLY the JSON. No markdown, no code fences, no commentary.
- Base everything strictly on the post. Do not invent facts, tools, numbers, or claims not supported by the body.
- Write 3 to 5 keyTakeaways and 3 to 5 faqs.
- Questions must be phrased the way people actually search or ask, and be answerable from the post.
- Keep the author's plain, no-jargon voice. No em dashes anywhere.
- Every answer must make sense to someone who has NOT read the post.`;

type AeoModelOutput = {
  summary?: unknown;
  keyTakeaways?: unknown;
  faqs?: unknown;
};

// Coerce the model's JSON into a clean ResourceAeo, dropping anything malformed.
// Returns null if there's nothing usable, so the caller can skip AEO entirely.
function parseAeo(raw: string): ResourceAeo | null {
  const jsonText = stripCodeFences(stripThink(raw));
  const match = jsonText.match(/\{[\s\S]*\}/);
  if (!match) return null;
  let data: AeoModelOutput;
  try {
    data = JSON.parse(match[0]) as AeoModelOutput;
  } catch {
    return null;
  }

  const summary =
    typeof data.summary === "string" && data.summary.trim()
      ? data.summary.trim()
      : undefined;

  const keyTakeaways = Array.isArray(data.keyTakeaways)
    ? data.keyTakeaways
        .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.trim())
        .slice(0, 6)
    : undefined;

  const faqs = Array.isArray(data.faqs)
    ? data.faqs
        .filter(
          (f): f is { q: string; a: string } =>
            !!f &&
            typeof f === "object" &&
            typeof (f as { q?: unknown }).q === "string" &&
            typeof (f as { a?: unknown }).a === "string" &&
            (f as { q: string }).q.trim().length > 0 &&
            (f as { a: string }).a.trim().length > 0,
        )
        .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
        .slice(0, 6)
    : undefined;

  const aeo: ResourceAeo = {};
  if (summary) aeo.summary = summary;
  if (keyTakeaways && keyTakeaways.length) aeo.keyTakeaways = keyTakeaways;
  if (faqs && faqs.length) aeo.faqs = faqs;
  return aeo.summary || aeo.keyTakeaways || aeo.faqs ? aeo : null;
}

// Generate AEO content (summary, key takeaways, FAQ) from a finished post body.
// Same provider config as rewriteToArticle. Always safe: returns null when the
// LLM is unconfigured or the call fails, and the post just ships without AEO.
export async function generateAeoContent(
  bodyHtml: string,
  title: string,
): Promise<ResourceAeo | null> {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;
  if (!apiKey || !baseUrl || !model) return null;

  const body = articleToPlainish(bodyHtml);
  if (body.length < 80) return null;

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 2000,
        messages: [
          { role: "system", content: AEO_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Title: ${title}\n\nPost body:\n${body}`,
          },
        ],
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return parseAeo(data?.choices?.[0]?.message?.content ?? "");
  } catch {
    return null;
  }
}

export async function rewriteToArticle(
  rawHtml: string,
  title: string,
): Promise<string | null> {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;
  if (!apiKey || !baseUrl || !model) return null;

  const cleaned = stripForLlm(rawHtml);
  if (!cleaned) return null;

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 16000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Article title (do not repeat as a heading): ${title}\n\nEmail HTML:\n${cleaned}`,
          },
        ],
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data?.choices?.[0]?.message?.content ?? "";
    const out = sanitizeArticleHtml(stripCodeFences(stripThink(raw)));
    // Basic sanity: needs real content and at least one block tag.
    return out.length > 40 && /<(p|h2|h3|ul|ol|pre)\b/i.test(out) ? out : null;
  } catch {
    return null;
  }
}
