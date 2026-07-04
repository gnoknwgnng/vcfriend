"use client";

import { motion } from "framer-motion";

const STAGES = [
  {
    title: "1. Idea Stage",
    subtitle: "No MVP, only an idea",
    questions: [
      "Why does this problem need to be solved?",
      "Why are you the right founder to solve it?",
      "Who is your target customer?",
      "How big is the market opportunity?",
      "Why is now the right time to build this?"
    ]
  },
  {
    title: "2. Prototype / MVP",
    subtitle: "Working prototype",
    questions: [
      "Have you built a working prototype?",
      "What feedback have you received?",
      "What have you learned since building?",
      "What features are customers using most?",
      "What is your plan to convert to scalable product?"
    ]
  },
  {
    title: "3. Early Traction",
    subtitle: "First Users",
    questions: [
      "How many users or customers do you have?",
      "How are you acquiring customers?",
      "Are users returning and actively using?",
      "What metrics show customers love your product?",
      "What is your biggest challenge in growing?"
    ]
  },
  {
    title: "4. Revenue Stage",
    subtitle: "Monetization",
    questions: [
      "How much revenue are you generating each month?",
      "What is your pricing model?",
      "What are your CAC and LTV?",
      "What is your gross margin?",
      "How fast is your revenue growing MoM?"
    ]
  },
  {
    title: "5. Seed Stage",
    subtitle: "Initial Funding",
    questions: [
      "Why are you raising this round now?",
      "What milestones will this funding achieve?",
      "What is your go-to-market strategy?",
      "Who are competitors, and why will you win?",
      "What does success look like in 18 months?"
    ]
  },
  {
    title: "6. Series A Stage",
    subtitle: "Scaling",
    questions: [
      "Is your business model proven and repeatable?",
      "How efficiently can you scale acquisition?",
      "What are your key growth metrics?",
      "What is your long-term competitive moat?",
      "How will you expand into new markets?"
    ]
  },
  {
    title: "7. Growth / Series B+",
    subtitle: "Market Leader",
    questions: [
      "How will you become a market leader?",
      "What is your international strategy?",
      "How will you maintain growth + profit?",
      "What are the biggest risks?",
      "What is your long-term exit strategy?"
    ]
  },
  {
    title: "Bonus",
    subtitle: "Every Stage",
    questions: [
      "Why now?",
      "Why you?",
      "Why this market?",
      "Why will customers choose you?",
      "Why can't a larger company copy you?"
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100 }
  }
};

export function QuestionsGrid() {
  return (
    <section className="w-full py-24 border-y border-emerald-900/10 relative overflow-hidden bg-transparent">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            What Investors Want to Know
          </h2>
          <p className="text-slate-600 max-w-[700px] text-lg font-medium">
            Investors ask different questions depending on the stage of your startup. Prepare your answers for these common questions.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STAGES.map((stage, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-interactive"
            >
              <div className="border-b border-slate-200/50 pb-3 mb-3">
                <h3 className="text-[15px] font-bold text-slate-800 leading-tight">{stage.title}</h3>
                <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest mt-1">{stage.subtitle}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {stage.questions.map((q, qIdx) => (
                  <li key={qIdx} className="text-[12px] text-slate-600 font-medium leading-snug flex items-start">
                    <span className="text-emerald-400 mr-2 mt-[3px] text-[8px]">■</span>
                    {q}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
