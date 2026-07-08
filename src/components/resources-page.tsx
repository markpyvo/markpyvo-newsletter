"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  TOOLS,
  TYPES,
  sortResources,
  type Resource,
  type ResourceTool,
  type ResourceType,
} from "@/lib/resources";

const MONO =
  '[font-family:"Space_Mono","Courier_New",monospace] tracking-[0.55px] uppercase';

type SortKey = "popular" | "newest" | "oldest" | "az";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "A to Z" },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

export function ResourcesPage({ resources }: { resources: Resource[] }) {
  const [tool, setTool] = useState<ResourceTool | "All">("All");
  const [type, setType] = useState<ResourceType | "All">("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = resources.filter((r) => {
      if (tool !== "All" && r.tool !== tool) return false;
      if (type !== "All" && r.type !== type) return false;
      if (q) {
        const haystack = `${r.title} ${r.teaser} ${r.tool} ${r.type}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return sortResources(filtered, sort);
  }, [resources, tool, type, query, sort]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <section className="text-center pt-16 pb-10">
          <p className={`text-[#4040ff] text-[11px] font-bold mb-3 ${MONO}`}>
            resources
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            All my free AI prompts, guides &amp; systems
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
            Everything I share with readers, in one place.
          </p>
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-4">
          <div>
            <div className={`text-[#7e7e7e] text-[11px] font-semibold mb-2 ${MONO}`}>
              by ai tool
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip active={tool === "All"} onClick={() => setTool("All")}>
                All
              </Chip>
              {TOOLS.map((t) => (
                <Chip key={t} active={tool === t} onClick={() => setTool(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className={`text-[#7e7e7e] text-[11px] font-semibold mb-2 ${MONO}`}>
              by type
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip active={type === "All"} onClick={() => setType("All")}>
                All
              </Chip>
              {TYPES.map((t) => (
                <Chip key={t} active={type === t} onClick={() => setType(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className={`text-[#7e7e7e] text-[11px] font-semibold mb-2 ${MONO}`}>
              search
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try a tool or keyword. E.g. claude, prompts, weekly..."
              className="w-full h-10 px-4 rounded-[8px] border border-gray-200 text-sm text-gray-900 placeholder:text-[#9ca3af] focus:outline-none focus:border-[#4040ff]"
            />
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 pt-1">
            <span className="text-[#7e7e7e] text-sm">
              Showing {results.length} resource{results.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className={`text-[#7e7e7e] text-[11px] font-semibold ${MONO}`}
              >
                sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 pl-3 pr-8 rounded-[8px] border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#4040ff]"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* List */}
        <section className="mt-6 mb-20 border-t border-gray-200">
          {results.length === 0 ? (
            <div className="text-center py-20 text-[#7e7e7e]">
              <p className="font-medium text-gray-900">No resources match that.</p>
              <p className="text-sm mt-1">Try clearing a filter or your search.</p>
            </div>
          ) : (
            results.map((r) => (
              <a
                key={r.slug}
                href={r.url}
                className="block px-1 border-b border-gray-200 group"
              >
                <div className="flex items-center gap-4 py-6">
                  <div className="min-w-0 grow">
                    <div
                      className={`text-[#4040ff] text-[11px] font-semibold mb-1.5 ${MONO}`}
                    >
                      {r.type} · {r.tool}
                    </div>
                    <h3 className="font-bold text-xl sm:text-[22px] leading-snug text-gray-900 group-hover:underline underline-offset-4 decoration-1 truncate">
                      {r.title}
                    </h3>
                    <p className="text-[#7e7e7e] mt-1 truncate">{r.teaser}</p>
                  </div>
                  <ArrowRight
                    className="w-5 h-5 shrink-0 text-gray-900 group-hover:translate-x-0.5 transition-transform"
                    strokeWidth={2}
                  />
                </div>
              </a>
            ))
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
