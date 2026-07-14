"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MONO } from "@/lib/utils";
import type { Resource } from "@/lib/resources";

export function HomePage({
  subscriberCount = null,
  featured = [],
}: {
  subscriberCount?: number | null;
  featured?: Resource[];
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  // Round the live Kit count down to the nearest 100 and add "+", matching the
  // subscribe page's honest, on-brand copy ("1,500+"). Falls back when unknown.
  const readers = subscriberCount
    ? subscriberCount >= 100
      ? `${(Math.floor(subscriberCount / 100) * 100).toLocaleString("en-US")}+`
      : `${subscriberCount}`
    : "1,500+";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="w-full max-w-5xl mx-auto px-5 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 items-center">
          <div>
            <p className={`text-[#4040ff] text-[11px] font-bold mb-4 ${MONO}`}>
              0 → 1 by mark
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-5">
              Hey, I&apos;m Mark.
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mb-8">
              I make AI and CS stupidly simple. Whether you&apos;re building your
              first app, keeping up with the tools, or just trying not to get
              left behind, I&apos;ve got you. Everything I know is right here.
              All free.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/resources"
                className='inline-flex items-center gap-2 bg-[#4040ff] text-white [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase font-bold px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity'
              >
                Browse resources
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </Link>
              <a
                href="#subscribe"
                className="text-sm text-gray-700 underline underline-offset-4 decoration-1 hover:text-[#4040ff] transition-colors"
              >
                Join the newsletter →
              </a>
            </div>
            <p
              className={`flex items-center gap-2 text-[#7e7e7e] text-[11px] mt-8 ${MONO}`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              {readers} readers every Monday
            </p>
          </div>

          <div className="order-first lg:order-none">
            <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 aspect-[4/5]">
              <img
                src="/mark-pro.png"
                alt="Mark"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter band ── */}
      <section
        id="subscribe"
        className="border-y border-gray-100 bg-[#faf7ee]"
      >
        <div className="w-full max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
          <div className="max-w-xl">
            <p className={`text-[#4040ff] text-[11px] font-bold mb-3 ${MONO}`}>
              the newsletter
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              The AI breakdown that actually makes sense.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Every Monday morning. One concept, tool, or idea from the world of
              AI and CS, explained in plain English. Short, free, written by
              hand.
            </p>

            {status === "done" ? (
              <div
                className={`py-4 text-[#4040ff] text-[11px] ${MONO}`}
              >
                you&apos;re in, check your inbox ✓
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className='flex-1 text-sm text-gray-800 placeholder:text-gray-400 bg-white outline-none px-4 py-3.5 border border-gray-200 rounded-full focus:border-[#4040ff] transition-colors [font-family:"Space_Mono","Courier_New",monospace]'
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className='shrink-0 bg-[#4040ff] text-white rounded-full px-7 py-3.5 [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase font-bold hover:opacity-90 transition-opacity disabled:opacity-40'
                >
                  {status === "loading" ? "..." : "Join Free"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className={`mt-3 text-red-600 text-[11px] ${MONO}`}>
                something went wrong, please try again
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Featured resources ── */}
      <section className="w-full max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className={`text-[#4040ff] text-[11px] font-bold mb-3 ${MONO}`}>
              free resources
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Prompts, guides &amp; systems
            </h2>
          </div>
          <Link
            href="/resources"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-700 underline underline-offset-4 decoration-1 hover:text-[#4040ff] transition-colors shrink-0"
          >
            View all
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <a
              key={r.slug}
              href={r.url}
              className="group flex flex-col rounded-2xl border border-gray-200 p-6 hover:border-[#4040ff] hover:shadow-[0_10px_30px_-12px_rgba(64,64,255,0.25)] transition-all"
            >
              <span
                className={`text-[#4040ff] text-[11px] font-semibold ${MONO}`}
              >
                {r.type} · {r.tool}
              </span>
              <h3 className="text-lg font-bold text-gray-900 leading-snug mt-3 mb-2 group-hover:underline underline-offset-4 decoration-1">
                {r.title}
              </h3>
              <p className="text-sm text-[#7e7e7e] leading-relaxed line-clamp-3">
                {r.teaser}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-900">
                Open
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  strokeWidth={2}
                />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm text-gray-700 underline underline-offset-4 decoration-1 hover:text-[#4040ff] transition-colors"
          >
            View all resources
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
