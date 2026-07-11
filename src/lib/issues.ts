export type Issue = {
  slug: string;
  number: number;
  title: string;
  teaser: string;
  date: string;
  readTime: string;
  tags: string[];
};

export const ISSUES: Issue[] = [
  {
    slug: "what-is-a-large-language-model",
    number: 3,
    title: "What is a Large Language Model, and why does it matter?",
    teaser:
      "GPT, Claude, Gemini: they're all LLMs. But what does that actually mean? This week we peek under the hood.",
    date: "2026-06-18",
    readTime: "4 min",
    tags: ["Fundamentals"],
  },
  {
    slug: "prompt-engineering-basics",
    number: 2,
    title: "Prompt Engineering: how to talk to AI like a pro",
    teaser:
      "The words you use with AI make a huge difference. Here's the simple framework I use to get dramatically better results.",
    date: "2026-06-11",
    readTime: "5 min",
    tags: ["Prompting", "Practical"],
  },
  {
    slug: "what-is-ai-really",
    number: 1,
    title: "What is AI, really? (Not the sci-fi version)",
    teaser:
      "Everyone's talking about AI but most explanations are terrible. Let's fix that, in plain English, from the very beginning.",
    date: "2026-06-04",
    readTime: "3 min",
    tags: ["Fundamentals", "Beginner"],
  },
];

export function getIssueBySlug(slug: string): Issue | undefined {
  return ISSUES.find((i) => i.slug === slug);
}

export function formatDate(dateStr: string): string {
  // Parse "YYYY-MM-DD" as a local date. Passing the string straight to
  // new Date() treats it as UTC midnight, which renders as the previous day
  // in negative-offset timezones. Build from components to keep it local.
  const [year, month, day] = dateStr.split("-").map(Number);
  const d =
    year && month && day
      ? new Date(year, month - 1, day)
      : new Date(dateStr);
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
