"use client";

import { useState } from "react";
import { ArrowRight, X, Mail } from "lucide-react";

const faqs = [
  {
    q: "Is this newsletter really free?",
    a: "Yes, completely free. I share what I learn as a CS student figuring out AI without a paywall because I believe beginners deserve real knowledge, not locked content.",
  },
  {
    q: "How often will I receive emails?",
    a: "Once a week, every Monday morning. No spam, no daily tips — just one clear, practical email you can actually read.",
  },
  {
    q: "Do I need to know coding or CS to understand this?",
    a: "Not at all. I write for curious people, not CS majors. If you can read and are curious about AI, you can get value from every issue. I explain everything from the ground up.",
  },
  {
    q: "Can I unsubscribe anytime?",
    a: "Absolutely. One click at the bottom of any email and you're out. No hard feelings, no guilt trips.",
  },
];

const avatars = [
  "https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
];

export function SubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [contactOpen, setContactOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus("done");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <a href="/">
          <img src="/logo.svg" alt="0→1" className="h-8 w-auto" />
        </a>
        <button
          onClick={() => setContactOpen(true)}
          className="text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          contact me
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-5 pt-6 pb-16 max-w-md mx-auto w-full">

        {/* Headshot — small centered block */}
        <div className="w-56 h-56 overflow-hidden mb-6 bg-gray-100">
          <img
            src="/mark-pro.png"
            alt="Mark"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-900 tracking-tight mb-1">
          0→1 by Mark
        </h1>

        {/* Credibility line */}
        <p className="text-sm text-gray-500 text-center mb-3">
          CS @ McGill University · CS & AI creator
        </p>

        {/* Description */}
        <p className="text-center text-gray-600 text-base leading-relaxed mb-8">
          the AI and CS tips I wish I had at the start. from a 19-year-old CS student at McGill still figuring it out.
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-2.5 mb-5">
          <a href="https://www.linkedin.com/in/markpyvovarov/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a href="https://www.instagram.com/markpyvovarov/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/@markpyvovarov" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
            className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
            </svg>
          </a>
        </div>

        {/* Trust pill */}
        <div className="inline-flex items-center gap-2.5 bg-gray-100 rounded-full py-2 px-4 mb-6">
          <div className="flex -space-x-2">
            {avatars.map((src, i) => (
              <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <span className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">1.5K</span> readers so far
          </span>
        </div>

        {/* Subscribe card */}
        <div className="w-full bg-gray-100 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            subscribe to my weekly newsletter
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            join over 1,500 students, builders and tech enthusiasts
          </p>

          {status === "done" ? (
            <div className="w-full text-center py-3 rounded-xl bg-white text-gray-700 text-sm font-medium">
              you&apos;re in — check your inbox 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center bg-white rounded-xl px-4 py-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email..."
                  required
                  className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent outline-none py-2"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:opacity-70 transition-opacity disabled:opacity-40 whitespace-nowrap ml-2"
                >
                  {status === "loading" ? "..." : <>subscribe <ArrowRight size={15} /></>}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">
          unsubscribe anytime. no spam. completely free.
        </p>
      </main>

      {/* ── Mac window preview placeholder ── */}
      <section className="pb-20 px-5">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white overflow-hidden shadow-[rgb(227,227,227)_0px_2px_0px_0px,rgba(0,0,0,0.08)_0px_8px_24px_0px] border border-[rgba(33,33,33,0.25)] rounded-sm">
            <div className="bg-[#f8f8f8] flex items-center px-4 py-3 border-b border-[rgba(33,33,33,0.12)]">
              <div className="flex gap-1.5">
                <span className="bg-[#e3e3e3] w-2.5 h-2.5 block rounded-full border border-[rgba(33,33,33,0.25)]" />
                <span className="bg-[#e3e3e3] w-2.5 h-2.5 block rounded-full border border-[rgba(33,33,33,0.25)]" />
                <span className="bg-[#e3e3e3] w-2.5 h-2.5 block rounded-full border border-[rgba(33,33,33,0.25)]" />
              </div>
            </div>
            <div className="bg-[#f8f8f8] aspect-video flex justify-center items-center">
              <p className='text-[#7e7e7e] [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase'>
                Preview coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Letter ── */}
      <section className="px-5 pb-20">
        <div className="w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">An honest letter to the reader</h2>
          <div
            className='bg-[#faf7ee] text-[#2a2a2a] [font-family:"Space_Mono",monospace] relative shadow-[rgba(255,255,255,0.7)_0px_1px_0px_0px_inset,rgba(0,0,0,0.04)_0px_2px_0px_0px,rgba(0,0,0,0.18)_0px_12px_32px_-8px,rgba(0,0,0,0.12)_0px_24px_60px_-20px] pt-16 pb-12 px-8 rounded-sm border border-[#e5deca]'
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(64,64,255,0.07) 27px, rgba(64,64,255,0.07) 28px)",
              backgroundPositionY: "64px",
            }}
          >
            {/* Stamp */}
            <div
              aria-hidden="true"
              className='bg-white text-[#7e7e7e] [font-family:"Space_Mono","Courier_New",monospace] text-[8px] tracking-[1.12px] uppercase text-center w-[84px] h-24 absolute top-[-18px] flex flex-col justify-center items-center shadow-[rgba(0,0,0,0.08)_0px_2px_6px_0px] rotate-6 [border-style:dashed] p-1.5 rounded-sm border-2 border-[rgba(33,33,33,0.25)] right-6'
            >
              <span className="block">Sent with<br />love</span>
              <span className="text-[#4040ff] leading-none text-[28px] block my-1 font-bold" style={{ fontFamily: "var(--font-syne), monospace" }}>MP</span>
              <span className="block">Monday<br />06:00</span>
            </div>

            {/* Email metadata */}
            <dl className='text-[rgba(42,42,42,0.55)] [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.9px] uppercase grid gap-y-0.5 gap-x-4 grid-cols-[50px_1fr] mb-8'>
              <dt className="font-bold">To</dt>
              <dd className="text-[#2a2a2a] tracking-[0.2px]">You</dd>
              <dt className="font-bold">From</dt>
              <dd className="text-[#2a2a2a] tracking-[0.2px] break-words">Mark &lt;mark@markpyvo.ca&gt;</dd>
              <dt className="font-bold">Re</dt>
              <dd className="text-[#2a2a2a] tracking-[0.2px]">Why I started this newsletter</dd>
            </dl>

            {/* Body */}
            <div className="text-[14px] leading-[1.85] flex flex-col gap-7">
              <p className="m-0">I remember feeling completely lost when I started learning CS.</p>
              <p className="m-0">Everyone around me seemed to &quot;get it.&quot; The data structures, the algorithms, the AI hype. I was nodding along in lectures while internally panicking that I was the only one who didn&apos;t understand.</p>
              <p className="m-0">AI moves fast. Really fast. New tools every day, constant updates, endless noise. You don&apos;t have time to live on X, watch every YouTube video, or read every OpenAI release just to keep up —{" "}<span className="bg-[rgba(64,64,255,0.12)] px-[2.8px]">especially when you&apos;re still figuring out the basics.</span></p>
              <p className="m-0">I&apos;m a 19-year-old CS student at McGill. I&apos;m not a genius. I&apos;m not a 10x engineer. I&apos;m just someone who is figuring it out in public — and writing down what actually clicks along the way.</p>
              <p className="m-0">Every Monday, I send one email breaking down one concept, tool, or idea from the world of AI and CS.{" "}<span className="bg-[rgba(64,64,255,0.12)] px-[2.8px]">Plain English. No jargon. No gatekeeping.</span>{" "}The kind of explanation I wish I had when I started.</p>
              <p className="m-0"><span className="bg-[rgba(64,64,255,0.12)] px-[2.8px]">I write this newsletter by hand</span>, every week. Read it and you can tell.</p>
            </div>

            {/* Signature */}
            <p className="text-[28px] font-bold text-[#121212] leading-none mt-8" style={{ fontFamily: "var(--font-syne), sans-serif" }}>— Mark</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 pb-20">
        <div className="w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently asked questions</h2>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white overflow-hidden rounded-sm border border-[rgba(33,33,33,0.25)] hover:shadow-[0_2px_0_0_rgb(227,227,227)]"
              >
                <button
                  className="bg-transparent font-medium text-sm w-full flex justify-between items-center gap-4 px-5 py-4 border-none text-left cursor-pointer text-gray-900"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className='text-[#aaaaaa] [font-family:"Space_Mono","Courier_New",monospace] text-[12px] shrink-0'>
                    {openFaq === i ? "[-]" : "[+]"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="border-t border-[rgba(33,33,33,0.08)]">
                    <p className="text-[#7e7e7e] leading-[1.7] text-sm m-0 pb-5 px-5 pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom gradient shade ── */}
      <div aria-hidden="true" className="w-full overflow-hidden">
        <div
          className="w-full h-[100px] [mask-image:linear-gradient(rgba(0,0,0,0)_0%,rgb(0,0,0)_100%)]"
          style={{ background: "repeating-linear-gradient(transparent, transparent 3px, rgba(33,33,33,0.05) 3px, rgba(33,33,33,0.05) 4px)" }}
        />
      </div>

      {/* Contact modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5" onClick={() => setContactOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Mail size={22} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">get in touch</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              to inquire about a deal or to view reference videos, send an email to:
            </p>
            <a
              href="mailto:markpyvovarov@gmail.com"
              className="text-blue-600 font-medium text-base hover:underline"
            >
              markpyvovarov@gmail.com
            </a>
          </div>
        </div>
      )}

      <footer className="px-5 pb-5">
        <p className="text-xs text-gray-400">&copy;2026 Mark Pyvovarov</p>
      </footer>
    </div>
  );
}
