"use client";

import { motion } from "framer-motion";

const STAGES = [
  {
    title: "1. Idea Stage",
    subtitle: "No MVP",
    questions: ["Why this problem?", "Why you?", "Target customer?", "Market size?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "-rotate-1",
  },
  {
    title: "2. Prototype / MVP",
    subtitle: "Working MVP",
    questions: ["Got a prototype?", "User feedback?", "What's used most?", "Scale plan?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "rotate-1",
  },
  {
    title: "3. Early Traction",
    subtitle: "First Users",
    questions: ["How many users?", "CAC?", "Retention?", "Biggest challenge?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "-rotate-[0.5deg]",
  },
  {
    title: "4. Revenue Stage",
    subtitle: "Monetization",
    questions: ["Monthly revenue?", "Pricing?", "Gross margin?", "Growth rate?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "rotate-[1.5deg]",
  },
  {
    title: "5. Seed Stage",
    subtitle: "Funding",
    questions: ["Why raise now?", "Milestones?", "GTM strategy?", "Competitors?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "rotate-1",
  },
  {
    title: "6. Series A",
    subtitle: "Scaling",
    questions: ["Proven model?", "Growth metrics?", "Competitive moat?", "New markets?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "-rotate-1",
  },
  {
    title: "7. Growth",
    subtitle: "Market Leader",
    questions: ["How to win?", "Intl strategy?", "Maintain profit?", "Exit strategy?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "rotate-[0.5deg]",
  },
  {
    title: "Bonus",
    subtitle: "Always Asked",
    questions: ["Why now?", "Why this market?", "Why you?", "Why can't BigTech copy?"],
    color: "bg-white border-slate-200/90",
    pin: "bg-red-400",
    titleColor: "text-slate-900",
    subtitleColor: "text-slate-500",
    textColor: "text-slate-700",
    dotColor: "text-red-400",
    rotate: "-rotate-[1.5deg]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 14 },
  },
};

export function HeroQuestions() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 z-20">
      {/* Section label */}
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          What Investors Ask At Every Stage
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {STAGES.map((stage, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{
              scale: 1.06,
              rotate: 0,
              zIndex: 30,
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18)",
            }}
            className={`
              relative flex flex-col p-5 rounded-sm border-2
              shadow-[4px_4px_14px_rgba(0,0,0,0.12)]
              cursor-interactive
              ${stage.color}
              ${stage.rotate}
              transition-[box-shadow] duration-300
            `}
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            {/* Pin dot at top */}
            <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${stage.pin} shadow-md border-2 border-white/70 z-10`} />

            {/* Tape strip at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/50 backdrop-blur-sm rounded-sm shadow-sm border border-white/60" />

            {/* Header */}
            <div className="mt-3 mb-3 border-b-2 border-dashed border-current/20 pb-3">
              <h3 className={`text-[15px] font-bold leading-tight ${stage.titleColor}`}>
                {stage.title}
              </h3>
              <p className={`text-[11px] font-semibold uppercase tracking-widest mt-1 ${stage.subtitleColor}`}>
                {stage.subtitle}
              </p>
            </div>

            {/* Questions */}
            <ul className="space-y-2 flex-1">
              {stage.questions.map((q, qIdx) => (
                <li key={qIdx} className={`text-[13px] leading-snug flex items-start gap-1.5 ${stage.textColor}`}>
                  <span className={`mt-[3px] text-[9px] shrink-0 ${stage.dotColor}`}>●</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>

            {/* Subtle lined paper effect */}
            <div className="absolute inset-0 rounded-sm pointer-events-none opacity-10"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 22px, rgba(0,0,0,0.3) 22px, rgba(0,0,0,0.3) 23px)",
                backgroundPositionY: "36px",
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
