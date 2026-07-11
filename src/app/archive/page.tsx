import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { IssueCard } from "@/components/issue-card";
import { SignupForm } from "@/components/signup-form";
import { ISSUES } from "@/lib/issues";

export const metadata: Metadata = {
  title: "Archive, AI Made Simple",
  description: "All past issues of AI Made Simple, the beginner-friendly AI newsletter.",
};

export default function ArchivePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-semibold text-sm">
            <span className="text-xl">🤖</span>
            <span>AI Made Simple</span>
          </a>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/archive" className="text-foreground font-medium">Archive</a>
            <a href="/#subscribe">
              <Button size="sm">Subscribe free</Button>
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">All Issues</h1>
            <p className="text-muted-foreground">
              {ISSUES.length} issue{ISSUES.length !== 1 ? "s" : ""} published so far
            </p>
          </div>

          {ISSUES.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-medium">No issues yet, the first one drops soon!</p>
              <p className="text-sm mt-2">Subscribe so you don&apos;t miss it.</p>
              <div className="mt-6">
                <SignupForm />
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ISSUES.map((issue) => (
                <IssueCard key={issue.slug} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border/60 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-base">🤖</span>
            <span>© 2026 AI Made Simple · markpyvo.ca</span>
          </div>
          <a href="mailto:mark@markpyvo.ca" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
