import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PartnershipsHeroActions } from "@/components/partnerships-hero-actions";
import { getKitSubscriberCount } from "@/lib/kit";
import { getInstagramStats } from "@/lib/instagram";
import {
  Clapperboard,
  Mail,
  Link2,
  GraduationCap,
  FileVideo,
  Megaphone,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   MEDIA KIT DATA. This is the ONLY thing you need to edit.
   Values marked PLACEHOLDER are guesses; replace with your real
   numbers from Instagram/TikTok Insights. (See notes Mark was given.)
   ────────────────────────────────────────────────────────────── */
const MEDIA_KIT = {
  email: "markpyvovarov@gmail.com",
  // Headline stats (shown as the big cards). Followers and subscribers are
  // overridden with live values (Instagram via Apify, subscribers via Kit).
  // Engagement rate and monthly impressions are private, so they are manual:
  // update them by hand from your Instagram Insights / Beacons media kit.
  stats: [
    { value: "6,235", label: "Instagram followers" }, // live from Apify
    { value: "7.3%", label: "engagement rate" }, // manual
    { value: "1M+", label: "monthly impressions" }, // manual
    { value: "1,500+", label: "newsletter subscribers" }, // live from Kit
  ],
  // Brands you've worked with. Leave [] to hide the whole section.
  // Each: { name, logo? }. logo is an optional image path in /public.
  brands: [
    { name: "Higgsfield", logo: "/brands/higgsfield.svg" },
    { name: "Whop", logo: "/brands/whop.png" },
    { name: "Cluely", logo: "/brands/cluely.svg" },
    { name: "Jobright.ai", logo: "/brands/jobright.png" },
    { name: "Obvious AI", logo: "/brands/obvious.svg" },
  ] as { name: string; logo?: string }[],
  // What you offer
  offers: [
    {
      icon: Clapperboard,
      title: "Sponsored short-form video",
      body: "One reel/short cross-posted to Instagram, TikTok, and (optionally) LinkedIn. Story-driven, beginner-friendly AI/CS content.",
    },
    {
      icon: Mail,
      title: "Newsletter feature",
      body: "A dedicated placement in 0→1 to 1,500+ engaged readers: CS students, early-career builders, and AI-curious beginners.",
    },
    {
      icon: Link2,
      title: "Link in bio",
      body: "Dedicated link-in-bio across platforms for a set window, pointing followers to your product or offer.",
    },
    {
      icon: GraduationCap,
      title: "Content collaboration",
      body: "A tutorial or walkthrough built around your tool, showing my audience how to actually use it, not just an ad read.",
    },
    {
      icon: FileVideo,
      title: "Raw video file",
      body: "The raw export so you can repurpose the content across your own channels and paid ads.",
    },
    {
      icon: Megaphone,
      title: "Usage rights",
      body: "Whitelisting / Spark Ads so you can run my content as paid ads from your brand's account.",
    },
  ],
  // Why brands work with you
  why: [
    "Audience is genuinely learning AI & CS: high intent, not passive scrollers",
    "Beginner-first voice: I make technical tools feel approachable",
    "1,500+ newsletter subscribers with high open rates",
    "Authentic, hand-made content, no faceless AI slop",
    "Fast turnaround and clear, professional communication",
    "Student builder credibility (CS @ McGill), figuring it out in public",
  ],
};

const MONO =
  '[font-family:"Space_Mono","Courier_New",monospace] tracking-[0.55px] uppercase';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white text-center px-4 py-8 rounded-[8px] border border-gray-200">
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className={`text-[#7e7e7e] text-[11px] ${MONO}`}>{label}</p>
    </div>
  );
}

export async function PartnershipsPage() {
  const showBrands = MEDIA_KIT.brands.length > 0;

  // Live analytics (refreshed weekly by cron), each falling back to the static
  // MEDIA_KIT value when its API is unavailable. base order: followers,
  // monthly reach, newsletter subscribers.
  const [ig, kitCount] = await Promise.all([
    getInstagramStats(),
    getKitSubscriberCount(),
  ]);
  const base = MEDIA_KIT.stats;
  const stats = [
    {
      ...base[0],
      value: ig?.followers ? ig.followers.toLocaleString("en-US") : base[0].value,
    },
    base[1], // engagement rate (manual)
    base[2], // monthly impressions (manual)
    {
      ...base[3],
      value: kitCount ? kitCount.toLocaleString("en-US") : base[3].value,
    },
  ];
  const statsGrid =
    stats.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <section className="text-center pt-16 pb-12">
          <p className={`text-[#4040ff] text-[11px] font-bold mb-3 ${MONO}`}>
            media kit
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Partner with Mark
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            I make plain-English AI &amp; CS content for beginners: short-form
            video plus a weekly newsletter, for an audience that&apos;s actually
            trying to learn, not just scroll.
          </p>
          <PartnershipsHeroActions email={MEDIA_KIT.email} />
        </section>

        {/* Stats */}
        <section className={`grid ${statsGrid} gap-4 mb-16`}>
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </section>

        {/* Brands */}
        {showBrands && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Brands I&apos;ve worked with
            </h2>
            <div className="max-w-2xl mx-auto grid grid-cols-3 sm:grid-cols-5 gap-6">
              {MEDIA_KIT.brands.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  {b.logo ? (
                    <img
                      src={b.logo}
                      alt={b.name}
                      className="w-14 h-14 object-contain"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                      {b.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[#7e7e7e] text-[11px] font-medium">
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* What I offer */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            What I offer
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {MEDIA_KIT.offers.map((o) => (
              <div
                key={o.title}
                className="bg-white p-6 rounded-[8px] border border-gray-200"
              >
                <div className="w-9 h-9 rounded-[8px] bg-[rgba(64,64,255,0.1)] flex items-center justify-center mb-4">
                  <o.icon className="w-[18px] h-[18px] text-[#4040ff]" strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1.5">
                  {o.title}
                </h3>
                <p className="text-[#7e7e7e] text-[13px] leading-relaxed">
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why brands work with me */}
        <section className="max-w-2xl mx-auto mb-16">
          <div className="bg-[#faf7ee] p-8 rounded-[8px] border border-[#e5deca]">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Why brands work with me
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {MEDIA_KIT.why.map((w) => (
                <div
                  key={w}
                  className="flex items-start gap-2.5 text-[14px] leading-snug text-[#2a2a2a]"
                >
                  <span className="text-[#4040ff] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  {w}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20">
          <div className="max-w-2xl mx-auto text-center bg-white p-10 sm:p-12 rounded-[8px] border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Let&apos;s work together
            </h2>
            <p className="text-gray-600 mb-4">
              Interested in a campaign? Tell me about your product and what you
              have in mind.
            </p>
            <a
              href={`mailto:${MEDIA_KIT.email}`}
              className="text-[#4040ff] font-semibold text-lg hover:underline"
            >
              {MEDIA_KIT.email}
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
