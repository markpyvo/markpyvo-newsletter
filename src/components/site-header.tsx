"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FLAGS } from "@/lib/flags";

const navLinks = [
  { label: "newsletter", href: "/" },
  { label: "partnerships", href: "/partnerships" },
  ...(FLAGS.about ? [{ label: "about", href: "/about" }] : []),
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="w-full border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Brand: square face + name */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 justify-self-start group" aria-label="Mark, home">
          <img
            src="/mark.jpg"
            alt="Mark"
            className="w-8 h-8 rounded-md object-cover object-center border border-gray-200"
          />
          <span className="font-bold text-[15px] tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
            mark
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 justify-self-center">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(href)
                  ? "font-semibold text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/#subscribe"
          className='shrink-0 justify-self-end hidden sm:inline-flex items-center bg-gray-900 text-white [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase font-bold px-4 py-2 rounded-[4px] hover:bg-[#4040ff] transition-colors'
        >
          sign up for my newsletter
        </Link>
      </div>
    </header>
  );
}
