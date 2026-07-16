import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getResourceBySlug } from "@/lib/resources";
import { getAllResources } from "@/lib/resource-store";
import { readingTime } from "@/lib/resource-email";
import { formatDate } from "@/lib/issues";
import { AeoSummary, AeoFaq } from "@/components/resource-aeo";
import {
  SITE,
  blogPostingJsonLd,
  faqPageJsonLd,
  jsonLdScript,
} from "@/lib/site";

import { MONO } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(await getAllResources(), slug);
  if (!resource) return { title: "Resource not found · 0→1 by Mark" };
  // Prefer the AEO summary for the meta description: it's written to read well
  // out of context, which is exactly what a search snippet needs.
  const description = resource.aeo?.summary || resource.teaser;
  const canonical = resource.url;
  return {
    title: `${resource.title} · 0→1 by Mark`,
    description,
    authors: [{ name: SITE.author, url: SITE.url }],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: resource.title,
      description,
      url: canonical,
      siteName: SITE.name,
      publishedTime: resource.date,
      authors: [SITE.author],
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description,
    },
  };
}

export default async function ResourceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(await getAllResources(), slug);

  // Seeds without a body are just links out; nothing to render as a post.
  if (!resource || !resource.bodyHtml) notFound();

  const faqJsonLd = faqPageJsonLd(resource);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Structured data: BlogPosting (always) + FAQPage (when the post has an
          FAQ). This is what search engines and AI answer engines read. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(blogPostingJsonLd(resource)),
        }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
        />
      )}
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-6">
        <article className="pt-12 pb-20">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-[#7e7e7e] text-sm hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            All resources
          </Link>

          {/* Meta bar: type (accent) · tool · read time · date */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
            <span className={`text-[#4040ff] text-[11px] font-bold ${MONO}`}>
              {resource.type}
            </span>
            <span className="text-[#7e7e7e] text-xs">{resource.tool}</span>
            <span className="text-[#7e7e7e] text-xs">
              {readingTime(resource.bodyHtml)}
            </span>
            <span className="text-[#7e7e7e] text-xs">
              {formatDate(resource.date)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-[42px] font-bold tracking-tight leading-tight text-gray-900 mb-4">
            {resource.title}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            {resource.teaser}
          </p>

          {/* Direct-answer summary + key takeaways (AEO). */}
          <AeoSummary aeo={resource.aeo} />

          {/* Semantic article, converted from your email in htmlToArticle(). */}
          <div
            className="resource-body"
            dangerouslySetInnerHTML={{ __html: resource.bodyHtml }}
          />

          {/* FAQ (AEO). */}
          <AeoFaq aeo={resource.aeo} />
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
