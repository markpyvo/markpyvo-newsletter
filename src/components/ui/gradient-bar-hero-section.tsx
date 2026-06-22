"use client";

import React, { useState } from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

type AvatarProps = {
  imageSrc: string;
  delay: number;
};

const Avatar: React.FC<AvatarProps> = ({ imageSrc, delay }) => (
  <div
    className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg"
    style={{
      animation: "fadeIn 0.5s ease forwards",
      animationDelay: `${delay}ms`,
      opacity: 0,
    }}
  >
    <img src={imageSrc} alt="Reader" className="h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
  </div>
);

const TrustPill: React.FC = () => {
  const avatars = [
    "https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
    "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
  ];

  return (
    <div className="inline-flex items-center gap-3 bg-gray-900/60 backdrop-blur-sm rounded-full py-2 px-4 text-sm">
      <div className="flex -space-x-2.5">
        {avatars.map((src, i) => (
          <Avatar key={i} imageSrc={src} delay={i * 150} />
        ))}
      </div>
      <p
        className="text-white whitespace-nowrap"
        style={{ animation: "fadeIn 0.5s ease forwards", animationDelay: "700ms", opacity: 0 }}
      >
        <span className="font-semibold">2.4K</span> readers so far
      </p>
    </div>
  );
};

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 1200);
  };

  if (status === "done") {
    return (
      <div className="bg-blue-500/15 border border-blue-500/25 text-blue-300 rounded-md px-6 py-4 text-center text-sm">
        You&apos;re subscribed. First issue lands Wednesday.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 rounded-md bg-gray-900/60 border border-gray-700 focus:border-blue-400 outline-none text-white text-sm placeholder:text-gray-500 backdrop-blur-sm transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-md bg-white hover:bg-gray-100 text-black text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? (
          <div className="h-4 w-4 border-2 border-gray-400 border-t-black rounded-full animate-spin mx-auto" />
        ) : (
          "Get the newsletter"
        )}
      </button>
    </form>
  );
};

const GradientBars: React.FC = () => {
  const numBars = 15;

  const height = (index: number) => {
    const pos = index / (numBars - 1);
    const dist = Math.abs(pos - 0.5);
    return 30 + 70 * Math.pow(dist * 2, 1.2);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes pulseBar {
          0% { opacity: 0.55; }
          100% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex h-full w-full">
        {Array.from({ length: numBars }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: `1 0 calc(100% / ${numBars})`,
              maxWidth: `calc(100% / ${numBars})`,
              height: "100%",
              background: "linear-gradient(to top, rgb(29, 78, 216), transparent)",
              transform: `scaleY(${height(i) / 100})`,
              transformOrigin: "bottom",
              animation: "pulseBar 2s ease-in-out infinite alternate",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Component: React.FC = () => (
  <section className="font-sans relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 overflow-hidden">
    <div className="absolute inset-0 bg-gray-950" />
    <GradientBars />

    {/* Minimal wordmark — no hamburger, no nav links until pages exist */}
    <div className="absolute top-0 left-0 right-0 z-50 py-6 px-6 md:px-12">
      <a href="/" className="text-white font-bold text-lg tracking-tight">
        🤖 AI Made Simple
      </a>
    </div>

    <div className="relative z-10 text-center w-full max-w-3xl mx-auto flex flex-col items-center gap-6">

      {/* Trust pill above headline */}
      <TrustPill />

      {/* Static headline */}
      <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
        Understand AI,{" "}
        <span className="text-blue-400">Starting from Zero.</span>
      </h1>

      {/* Subscribe form with typewriter label */}
      <div className="w-full max-w-lg mt-2">
        <TypewriterEffectSmooth
          words={[
            { text: "Free." },
            { text: "Plain" },
            { text: "English." },
            { text: "Every" },
            { text: "Wednesday.", className: "text-blue-400 dark:text-blue-400" },
          ]}
          className="text-gray-400 justify-center"
          cursorClassName="bg-blue-400"
        />
        <SubscribeForm />
        <p className="text-xs text-gray-600 mt-2 text-left">No spam. Unsubscribe any time.</p>
      </div>
    </div>
  </section>
);
