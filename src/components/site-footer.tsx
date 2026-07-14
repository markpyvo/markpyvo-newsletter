"use client";

import { useState } from "react";
import Link from "next/link";
import { ContactModal } from "@/components/contact-modal";

const socials = [
  {
    href: "https://www.instagram.com/markpyvovarov/",
    label: "Follow on Instagram",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@markpyvovarov",
    label: "Follow on TikTok",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#121212">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/markpyvovarov/",
    label: "Connect on LinkedIn",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#121212">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      {/* ── Bottom gradient shade ── */}
      <div aria-hidden="true" className="w-full overflow-hidden">
        <div
          className="w-full h-[100px] [mask-image:linear-gradient(rgba(0,0,0,0)_0%,rgb(0,0,0)_100%)]"
          style={{ background: "repeating-linear-gradient(transparent, transparent 3px, rgba(33,33,33,0.05) 3px, rgba(33,33,33,0.05) 4px)" }}
        />
      </div>

      {/* ── Footer ── */}
      <footer className="pt-16 pb-8 px-5">
        <div className="w-full max-w-lg mx-auto">
          <div className="grid gap-x-12 grid-cols-[1fr_auto] grid-rows-[auto_auto_auto]">
            {/* Brand: square face + name */}
            <Link href="/" aria-label="Mark, home" className="flex items-center gap-2.5 self-center col-start-1 row-start-1 hover:opacity-80">
              <img src="/mark.jpg" alt="Mark" className="w-9 h-9 rounded-md object-cover object-center border border-gray-200" />
              <span className="font-bold text-[15px] tracking-tight text-gray-900">mark</span>
            </Link>

            {/* Social icons */}
            <div className="flex self-center gap-2 col-start-2 row-start-1 justify-self-end">
              {socials.map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='bg-white min-w-[30px] min-h-[30px] flex justify-center items-center shadow-[rgb(227,227,227)_-2px_-2px_0px_0px_inset] p-1.5 rounded-br-[4px] rounded-t-[4px] rounded-bl-[4px] border border-[#cccccc] hover:border-[#4040ff] transition-colors'
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Footer nav */}
            <nav className="flex flex-col items-end gap-1 col-start-2 row-start-2 row-end-4 justify-self-end mt-6">
              <Link href="/newsletter" className='text-[#7e7e7e] [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase block hover:text-[#4040ff] transition-colors'>
                Newsletter
              </Link>
              <Link href="/partnerships" className='text-[#7e7e7e] [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase block hover:text-[#4040ff] transition-colors'>
                Partnerships
              </Link>
              <button
                onClick={() => setContactOpen(true)}
                className='text-[#7e7e7e] [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase block hover:text-[#4040ff] transition-colors bg-transparent border-none cursor-pointer p-0'
              >
                Contact
              </button>
            </nav>

            {/* Copyright */}
            <div className="col-start-1 row-start-2 mt-6">
              <p className='text-[#7e7e7e] [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase my-0'>
                © 2026 0 → 1 BY MARK. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Contact modal ── */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
