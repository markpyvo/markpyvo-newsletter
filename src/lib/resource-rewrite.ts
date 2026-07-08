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

// Tags the final article is allowed to contain. Everything else is unwrapped.
const ALLOWED = new Set([
  "h2", "h3", "h4", "p", "ul", "ol", "li", "pre", "code", "blockquote",
  "a", "strong", "b", "em", "i", "br", "hr",
]);

// Strip an email down to structure + text for the model: no <head>, scripts,
// styles, images, comments, or attributes (except link hrefs). Tags are kept so
// the model can see the DOM shape. Capped so a runaway email can't blow the
// context / token budget.
function stripForLlm(html: string): string {
  let s = html
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<img\b[^>]*>/gi, "");
  s = s.replace(/<a\b[^>]*?href\s*=\s*"([^"]*)"[^>]*>/gi, (_m, href) =>
    /^(https?:|mailto:|\/)/i.test(href) ? `<a href="${href}">` : "<a>",
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
      return /^(https?:|mailto:|\/)/i.test(href) ? `<a href="${href}">` : "<a>";
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
