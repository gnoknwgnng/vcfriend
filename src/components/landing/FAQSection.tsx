"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is VC Friend really free?",
    answer: "Yes. We believe fundraising data should be accessible to all founders. Our platform is completely free to use, and we do not charge founders to search for investors or pitch ideas.",
    color: { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", divider: "border-slate-200", chevron: "text-slate-500", rotate: "-rotate-[0.5deg]" },
  },
  {
    question: "Are idea pitches truly anonymous?",
    answer: "Absolutely. When you submit a pitch, it is stored without any personally identifiable information linked to your public profile unless you choose to share your contact details within the pitch body.",
    color: { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", divider: "border-slate-200", chevron: "text-slate-500", rotate: "rotate-[0.6deg]" },
  },
  {
    question: "How do I review a VC firm?",
    answer: "Navigate to the VC directory, find the firm you interacted with, and click 'Write a Review'. You can rate them on a 5-star scale and share your experience to help other founders.",
    color: { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", divider: "border-slate-200", chevron: "text-slate-500", rotate: "-rotate-[0.4deg]" },
  },
  {
    question: "Can VCs delete negative reviews?",
    answer: "No. We believe in absolute transparency. As long as a review meets our community guidelines (no hate speech, spam, or blatant falsehoods), it will remain on the platform regardless of the rating.",
    color: { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", divider: "border-slate-200", chevron: "text-slate-500", rotate: "rotate-[0.5deg]" },
  },
  {
    question: "How often is the VC database updated?",
    answer: "Our database is updated weekly. We actively verify new firms, update check sizes, and adjust investment focus areas based on recent market activity and founder feedback.",
    color: { card: "bg-white border-slate-200/90", pin: "bg-red-400", title: "text-slate-900", text: "text-slate-700", divider: "border-slate-200", chevron: "text-slate-500", rotate: "-rotate-[0.6deg]" },
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-24 border-t border-emerald-500/20">
      <div className="container px-4 md:px-6 max-w-3xl">

        {/* Chalk heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="chalk-heading text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="chalk-text text-lg">
            Everything you need to know about the product and how it works.
          </p>
        </motion.div>

        {/* FAQ Sticky Notes — stacked accordion style */}
        <div className="space-y-7">
          {faqs.map((faq, index) => {
            const c = faq.color;
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`
                  relative rounded-sm border-2
                  shadow-[4px_4px_14px_rgba(0,0,0,0.22)]
                  ${c.card} ${isOpen ? "rotate-0" : c.rotate}
                  transition-[transform,box-shadow] duration-300
                  ${isOpen ? "shadow-[6px_6px_24px_rgba(0,0,0,0.28)]" : ""}
                `}
                style={{ fontFamily: "var(--font-caveat), cursive", willChange: "transform" }}
              >
                {/* Pin */}
                <div className={`absolute -top-3 left-8 w-5 h-5 rounded-full ${c.pin} shadow-md border-2 border-white/80 z-10`} />

                {/* Tape strip */}
                <div className="absolute -top-3 left-8 w-12 h-5 bg-white/40 rounded-sm border border-white/50 shadow-sm" />

                {/* Lined paper texture */}
                <div
                  className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.07]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 26px, rgba(0,0,0,0.5) 26px, rgba(0,0,0,0.5) 27px)",
                    backgroundPositionY: "48px",
                  }}
                />

                {/* Question row — clickable */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full px-6 pt-7 pb-5 text-left focus:outline-none group"
                >
                  <span className={`font-bold text-xl leading-snug pr-4 ${c.title}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${c.chevron} ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Answer — AnimatePresence for smooth open/close without max-h jank */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <div className={`mx-6 border-t-2 border-dashed ${c.divider} mb-1`} />
                      <p className={`px-6 py-5 text-[17px] leading-relaxed ${c.text}`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
