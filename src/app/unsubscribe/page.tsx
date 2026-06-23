"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UnsubscribeForm() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleUnsubscribe = async () => {
    setStatus("loading");
    const res = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <a href="/" className="text-2xl font-black tracking-tight text-gray-900 mb-10 block">
          0 → 1
        </a>

        {status === "done" ? (
          <>
            <p className="text-lg font-semibold text-gray-900 mb-2">you&apos;re unsubscribed.</p>
            <p className="text-sm text-gray-500">sorry to see you go. you won&apos;t hear from me again.</p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-900 mb-2">unsubscribe</p>
            <p className="text-sm text-gray-500 mb-6">
              remove <span className="text-gray-800 font-medium">{email}</span> from the newsletter?
            </p>
            {status === "error" && (
              <p className="text-sm text-red-500 mb-4">something went wrong. try again or email me directly.</p>
            )}
            <button
              onClick={handleUnsubscribe}
              disabled={status === "loading" || !email}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              {status === "loading" ? "removing..." : "yes, unsubscribe me"}
            </button>
            <a href="/" className="block mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              never mind, keep me subscribed
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeForm />
    </Suspense>
  );
}
