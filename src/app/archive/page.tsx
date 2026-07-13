import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { IssueCard } from "@/components/issue-card";
import { ISSUES } from "@/lib/issues";
import { MONO } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Archive, 0→1 by Mark",
  description: "Every past issue of the newsletter, in one place.",
};

export default function ArchivePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-6">
        <section className="text-center pt-16 pb-10">
          <p className={`text-[#4040ff] text-[11px] font-bold mb-3 ${MONO}`}>
            archive
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            All past issues
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
            {ISSUES.length} issue{ISSUES.length !== 1 ? "s" : ""} published so far.
          </p>
        </section>

        {ISSUES.length === 0 ? (
          <div className="text-center py-20 text-[#7e7e7e]">
            <p className="font-medium text-gray-900">
              No issues yet, the first one drops soon!
            </p>
            <p className="text-sm mt-1">Subscribe so you don&apos;t miss it.</p>
            <div className="mt-6">
              <a
                href="/#subscribe"
                className={`inline-flex items-center bg-gray-900 text-white text-[11px] font-bold px-4 py-2 rounded-[4px] hover:bg-[#4040ff] transition-colors ${MONO}`}
              >
                sign up for my newsletter
              </a>
            </div>
          </div>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {ISSUES.map((issue) => (
              <IssueCard key={issue.slug} issue={issue} />
            ))}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
