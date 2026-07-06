"use client";

import { X } from "lucide-react";

// Shared "get in touch" email modal. Used by the footer's Contact link and the
// partnerships hero's "work with me" button.
export function ContactModal({
  open,
  onClose,
  email = "markpyvovarov@gmail.com",
}: {
  open: boolean;
  onClose: () => void;
  email?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-[8px] p-8 w-full max-w-sm shadow-xl text-center border border-[rgba(33,33,33,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#aaaaaa] hover:text-[#121212] transition-colors"
        >
          <X size={18} />
        </button>
        <h2 className='text-xl font-semibold text-[#121212] mb-3 [font-family:"Space_Mono","Courier_New",monospace]'>
          GET IN TOUCH
        </h2>
        <p className="text-[#7e7e7e] text-sm leading-relaxed mb-5">
          For sponsorships, collaborations, or just to say hi:
        </p>
        <a
          href={`mailto:${email}`}
          className="text-[#4040ff] font-medium text-sm hover:underline"
        >
          {email}
        </a>
      </div>
    </div>
  );
}
