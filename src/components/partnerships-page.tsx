import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getKitSubscriberCount } from "@/lib/kit";
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
  // Headline stats (shown as the big cards)
  stats: [
    { value: "6,235", label: "Instagram followers" },
    { value: "802K", label: "monthly reach" },
    { value: "1,500+", label: "newsletter subscribers" }, // TODO: confirm current Kit count
  ],
  // Audience age breakdown
  age: [
    { range: "18-24", pct: 56.1 },
    { range: "25-34", pct: 28.1 },
    { range: "35-44", pct: 6.7 },
    { range: "45-54", pct: 4.2 },
    { range: "55-64", pct: 0.8 },
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

function Bar({
  label,
  pct,
  color,
  labelWidth = "w-12",
}: {
  label: string;
  pct: number;
  color: string;
  labelWidth?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`${labelWidth} shrink-0 text-[#7e7e7e] text-[11px] ${MONO}`}>
        {label}
      </span>
      <div className="relative h-6 grow overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-900">
          {pct}%
        </span>
      </div>
    </div>
  );
}

export async function PartnershipsPage() {
  const showBrands = MEDIA_KIT.brands.length > 0;

  // Live Kit subscriber count (refreshed weekly by cron), falling back to the
  // static value when the API is unavailable.
  const kitCount = await getKitSubscriberCount();
  const stats = MEDIA_KIT.stats.map((s) =>
    s.label === "newsletter subscribers" && kitCount
      ? { ...s, value: kitCount.toLocaleString("en-US") }
      : s,
  );

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
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${MEDIA_KIT.email}`}
              className={`inline-flex items-center bg-gray-900 text-white text-[11px] font-bold px-6 py-3 rounded-[4px] hover:bg-[#4040ff] transition-colors ${MONO}`}
            >
              work with me
            </a>
            <a
              href="/#subscribe"
              className={`inline-flex items-center bg-white text-gray-900 text-[11px] font-bold px-6 py-3 rounded-[4px] border border-gray-200 hover:border-gray-400 transition-colors ${MONO}`}
            >
              see the newsletter
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </section>

        {/* Demographics: audience age */}
        <section className="max-w-lg mx-auto mb-16">
          <div className="bg-white p-6 rounded-[8px] border border-gray-200">
            <h3 className={`text-gray-900 text-[13px] font-bold mb-5 ${MONO}`}>
              audience age
            </h3>
            <div className="flex flex-col gap-3">
              {MEDIA_KIT.age.map((a) => (
                <Bar key={a.range} label={a.range} pct={a.pct} color="#4040ff" />
              ))}
            </div>
          </div>
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
