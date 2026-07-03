import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FLAGS } from "@/lib/flags";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About · 0→1 by Mark",
};

// Feature-flagged. While FLAGS.about is false this route 404s and the nav
// link is hidden. Flip the flag in src/lib/flags.ts to ship it.
export default function About() {
  if (!FLAGS.about) notFound();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-2xl mx-auto px-5 sm:px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          About me
        </h1>
        {/* TODO: About content goes here. */}
      </main>
      <SiteFooter />
    </div>
  );
}
