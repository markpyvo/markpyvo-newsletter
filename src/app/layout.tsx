import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "0→1 by Mark — markpyvo.ca",
  description:
    "A weekly newsletter that teaches AI to beginners. No jargon, no hype — just clear, practical lessons you can use right away.",
  openGraph: {
    title: "AI Made Simple — markpyvo.ca",
    description:
      "A weekly newsletter that teaches AI to beginners. No jargon, no hype — just clear, practical lessons you can use right away.",
    url: "https://markpyvo.ca",
    siteName: "AI Made Simple",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Made Simple — markpyvo.ca",
    description: "Weekly AI lessons for beginners.",
  },
  metadataBase: new URL("https://markpyvo.ca"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
