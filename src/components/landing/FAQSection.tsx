"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal, SplitWords } from "@/components/ui/Reveal";

const faqs = [
  {
    question: "Is VC Friend really free?",
    answer:
      "Yes. We believe fundraising data should be accessible to all founders. Our platform is completely free to use, and we do not charge founders to search for investors or pitch ideas.",
  },
  {
    question: "Are idea pitches truly anonymous?",
    answer:
      "Absolutely. When you submit a pitch, it is stored without any personally identifiable information linked to your public profile unless you choose to share your contact details within the pitch body.",
  },
  {
    question: "How do I review a VC firm?",
    answer:
      "Navigate to the VC directory, find the firm you interacted with, and click 'Write a Review'. You can rate them on a 5-star scale and share your experience to help other founders.",
  },
  {
    question: "Can VCs delete negative reviews?",
    answer:
      "No. We believe in absolute transparency. As long as a review meets our community guidelines (no hate speech, spam, or blatant falsehoods), it will remain on the platform regardless of the rating.",
  },
  {
    question: "How often is the VC database updated?",
    answer:
      "Our database is updated weekly. We actively verify new firms, update check sizes, and adjust investment focus areas based on recent market activity and founder feedback.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-20 md:py-28 bg-mist">
      <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <SplitWords
            text="Frequently asked questions"
            className="text-4xl md:text-5xl font-bold text-ink leading-[1.05]"
          />
          <Reveal delay={0.15}>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed">
              Everything you need to know about the product and how it works.
            </p>
          </Reveal>
        </div>

        <Reveal effect="slide-right" className="lg:col-span-8 surface divide-y divide-line overflow-hidden">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex items-center justify-between w-full px-6 py-5 text-left gap-6 hover:bg-mist/60 transition-colors cursor-pointer"
                >
                  <span className="font-display font-semibold text-lg text-ink leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full border border-line flex items-center justify-center transition-all ${
                      isOpen ? "bg-ink text-white border-ink rotate-45" : "text-ink"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[15px] md:text-base leading-relaxed text-ink-soft max-w-prose">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
