"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const STAGES = [
  {
    title: "Idea Stage",
    short: "Idea",
    subtitle: "No MVP",
    questions: ["Why this problem?", "Why you?", "Target customer?", "Market size?"],
  },
  {
    title: "Prototype / MVP",
    short: "MVP",
    subtitle: "Working MVP",
    questions: ["Got a prototype?", "User feedback?", "What's used most?", "Scale plan?"],
  },
  {
    title: "Early Traction",
    short: "Traction",
    subtitle: "First Users",
    questions: ["How many users?", "CAC?", "Retention?", "Biggest challenge?"],
  },
  {
    title: "Revenue Stage",
    short: "Revenue",
    subtitle: "Monetization",
    questions: ["Monthly revenue?", "Pricing?", "Gross margin?", "Growth rate?"],
  },
  {
    title: "Seed Stage",
    short: "Seed",
    subtitle: "Funding",
    questions: ["Why raise now?", "Milestones?", "GTM strategy?", "Competitors?"],
  },
  {
    title: "Series A",
    short: "Series A",
    subtitle: "Scaling",
    questions: ["Proven model?", "Growth metrics?", "Competitive moat?", "New markets?"],
  },
  {
    title: "Growth",
    short: "Growth",
    subtitle: "Market Leader",
    questions: ["How to win?", "Intl strategy?", "Maintain profit?", "Exit strategy?"],
  },
  {
    title: "Bonus",
    short: "Always",
    subtitle: "Always Asked",
    questions: ["Why now?", "Why this market?", "Why you?", "Why can't BigTech copy?"],
  },
];

export function HeroQuestions() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">
            What investors ask at every stage
          </h2>
          <p className="text-white/60 mt-1.5 text-sm md:text-base">
            Pick where you are. Prepare the answers before the meeting.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
        {/* Stage rail */}
        <div className="relative border-b border-white/10">
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#15323b] to-transparent md:hidden z-10" />
        <div className="flex overflow-x-auto no-scrollbar px-2 pt-2 gap-1" role="tablist">
          {STAGES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.title}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`relative shrink-0 px-4 py-3 text-sm font-medium rounded-t-xl transition-colors cursor-pointer ${
                  isActive ? "text-white" : "text-white/55 hover:text-white/85"
                }`}
              >
                <span className="mr-1.5 text-white/35 tabular-nums">{i === STAGES.length - 1 ? "★" : i + 1}</span>
                {s.short}
                {isActive && (
                  <motion.span
                    layoutId="stage-underline"
                    className="absolute left-2 right-2 -bottom-px h-[2px] bg-coral rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        </div>

        {/* Panel */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
            >
              <div className="md:col-span-4">
                <p className="text-coral text-sm font-semibold">{stage.subtitle}</p>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mt-1">
                  {stage.title}
                </h3>
                <p className="text-white/55 text-sm mt-3 leading-relaxed">
                  Four questions that come up in almost every conversation at this stage.
                </p>
              </div>
              <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stage.questions.map((q) => (
                  <li
                    key={q}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-ink/40 px-4 py-3.5 text-white/90"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-[#7fc3cf] shrink-0" />
                    <span className="text-[15px] leading-snug">{q}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
