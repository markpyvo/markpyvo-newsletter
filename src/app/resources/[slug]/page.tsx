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

const MONO =
  '[font-family:"Space_Mono","Courier_New",monospace] tracking-[0.55px] uppercase';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(await getAllResources(), slug);
  if (!resource) return { title: "Resource not found · 0→1 by Mark" };
  return {
    title: `${resource.title} · 0→1 by Mark`,
    description: resource.teaser,
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
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

          {/* Semantic article, converted from your email in htmlToArticle(). */}
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
