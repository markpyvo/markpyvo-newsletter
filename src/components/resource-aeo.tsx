// Answer-engine (AEO) content, rendered on the post + review pages. The summary
// and key takeaways sit above the article body as a scannable, quotable answer;
// the FAQ sits below it. Both are the human-visible half of the schema.org
// markup emitted on the post page, so what a reader sees is what an AI quotes.

import type { ResourceAeo } from "@/lib/resources";
import { MONO } from "@/lib/utils";

// Direct-answer summary + key takeaways. Renders above the article body. Returns
// null when there's neither, so posts without AEO look exactly as before.
export function AeoSummary({ aeo }: { aeo?: ResourceAeo }) {
  const hasSummary = !!aeo?.summary;
  const takeaways = aeo?.keyTakeaways ?? [];
  if (!hasSummary && takeaways.length === 0) return null;

  return (
    <div className="mb-10 rounded-2xl border border-[#e5deca] bg-[#faf7ee] p-6 sm:p-7">
      {hasSummary && (
        <>
          <p className={`text-[#4040ff] text-[11px] font-bold mb-2 ${MONO}`}>
            the short answer
          </p>
          <p className="text-gray-900 text-base sm:text-lg leading-relaxed">
            {aeo!.summary}
          </p>
        </>
      )}

      {takeaways.length > 0 && (
        <div className={hasSummary ? "mt-6" : ""}>
          <p className={`text-[#7e7e7e] text-[11px] font-bold mb-3 ${MONO}`}>
            key takeaways
          </p>
          <ul className="flex flex-col gap-2.5">
            {takeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4040ff]"
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// FAQ section. Renders below the article body. Plain <details> so it works
// without JS and each question is real, crawlable text. Returns null when empty.
export function AeoFaq({ aeo }: { aeo?: ResourceAeo }) {
  const faqs = aeo?.faqs ?? [];
  if (faqs.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-gray-200">
      <p className={`text-[#4040ff] text-[11px] font-bold mb-6 ${MONO}`}>
        frequently asked
      </p>
      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="group rounded-xl border border-gray-200 open:border-[#4040ff] transition-colors"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold text-gray-900 list-none">
              <span>{f.q}</span>
              <span className="text-[#aaaaaa] text-xs shrink-0 group-open:hidden">
                [+]
              </span>
              <span className="text-[#4040ff] text-xs shrink-0 hidden group-open:inline">
                [-]
              </span>
            </summary>
            <p className="px-5 pb-5 pt-1 text-[#7e7e7e] leading-relaxed">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
