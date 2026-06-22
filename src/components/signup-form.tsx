"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  size?: "default" | "lg";
};

export function SignupForm({ size = "default" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // TODO: wire up to your email provider (Resend, ConvertKit, etc.)
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-3">
        <p className="text-lg">🎉</p>
        <p className="font-medium text-sm">You're in! Check your inbox for a welcome email.</p>
        <p className="text-xs text-muted-foreground">Welcome to AI Made Simple.</p>
      </div>
    );
  }

  const isLg = size === "lg";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-2 w-full ${isLg ? "max-w-md mx-auto" : "max-w-sm mx-auto"}`}
    >
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={`flex-1 ${isLg ? "h-11" : ""}`}
        aria-label="Email address"
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className={isLg ? "h-11 px-6" : ""}
      >
        {status === "loading" ? "Subscribing…" : "Subscribe free"}
      </Button>
    </form>
  );
}
