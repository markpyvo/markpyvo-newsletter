"use client";

import { useState } from "react";
import { ContactModal } from "@/components/contact-modal";

const MONO =
  '[font-family:"Space_Mono","Courier_New",monospace] tracking-[0.55px] uppercase';

// The partnerships hero buttons: an external link to the live Beacons media
// kit, and a "work with me" button that opens the email contact modal.
export function PartnershipsHeroActions({ email }: { email: string }) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="https://beacons.ai/markpyvovarov/mediakit"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center bg-gray-900 text-white text-[11px] font-bold px-6 py-3 rounded-[4px] hover:bg-[#4040ff] transition-colors ${MONO}`}
        >
          view full media kit
        </a>
        <button
          onClick={() => setContactOpen(true)}
          className={`inline-flex items-center bg-white text-gray-900 text-[11px] font-bold px-6 py-3 rounded-[4px] border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer ${MONO}`}
        >
          work with me
        </button>
      </div>
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        email={email}
      />
    </>
  );
}
