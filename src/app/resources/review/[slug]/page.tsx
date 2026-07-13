import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getResourceForReview } from "@/lib/resource-store";
import { readingTime } from "@/lib/resource-email";
import { formatDate } from "@/lib/issues";

export const metadata: Metadata = {
  title: "Review resource · 0→1 by Mark",
  robots: { index: false, follow: false },
};

import { MONO } from "@/lib/utils";

export default async function ReviewResource({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;
  const resource = await getResourceForReview(slug);

  // Guard: must exist, have a body, and the link token must match.
  if (!resource || !resource.bodyHtml) notFound();
  if (!token || token !== resource.reviewToken) notFound();

  const published = resource.status === "published";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      {/* Review action bar */}
      <div className="sticky top-16 z-40 border-b border-[#e5deca] bg-[#faf7ee]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-4">
          <span className={`text-[#8a7a3a] text-[11px] font-bold ${MONO}`}>
            {published ? "published" : "draft preview"}
          </span>
          {published ? (
            <Link
              href={`/resources/${resource.slug}`}
              className="inline-flex items-center bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#4040ff] transition-colors"
            >
              View live post
            </Link>
          ) : (
            <form action="/api/resources/approve" method="post">
              <input type="hidden" name="slug" value={resource.slug} />
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                className="inline-flex items-center bg-[#4040ff] text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Approve &amp; publish
              </button>
            </form>
          )}
        </div>
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-6">
        <article className="pt-10 pb-20">
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

          <div
            className="resource-body"
            dangerouslySetInnerHTML={{ __html: resource.bodyHtml }}
          />
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
