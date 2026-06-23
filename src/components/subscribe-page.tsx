"use client";

import { useState } from "react";
import { ArrowRight, X, Mail } from "lucide-react";

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
        <a href="/" className="text-2xl font-black tracking-tight text-gray-900 leading-none">
          0 → 1
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
