// Automatic "keep exploring" links at the bottom of every resource page.
// Every post links to a handful of topically related ones so the site reads
// as a connected cluster, not a pile of disconnected pages, which is what
// both search engines and AI answer engines use to infer topical authority.
// See docs/internal-linking-seo.md.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Resource } from "@/lib/resources";
import { getRelatedResources } from "@/lib/related-resources";
import { MONO } from "@/lib/utils";

export function RelatedResources({
  current,
  all,
}: {
  current: Resource;
  all: Resource[];
}) {
  const related = getRelatedResources(current, all);
  if (related.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-gray-200">
      <p className={`text-[#4040ff] text-[11px] font-bold mb-6 ${MONO}`}>
        keep exploring
      </p>
      <div className="flex flex-col gap-3">
        {related.map((r) => (
          <Link
            key={r.slug}
            href={r.url}
            className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-5 py-4 hover:border-[#4040ff] transition-colors"
          >
            <div>
              <p className={`text-[#7e7e7e] text-[11px] font-bold mb-1 ${MONO}`}>
                {r.type}
              </p>
              <p className="font-semibold text-gray-900">{r.title}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#aaaaaa] shrink-0 group-hover:text-[#4040ff] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}
